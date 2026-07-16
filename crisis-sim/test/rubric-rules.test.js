import { describe, expect, test } from 'vitest';
import emergenceRaw from '../../data/rubrics/carson-newman-anesthesia-emergence.json';
import rsiRaw from '../../data/rubrics/carson-newman-rsi-induction.json';
import standardRaw from '../../data/rubrics/carson-newman-standard-iv-induction.json';
import {
  RUBRIC_RULES,
  RubricScoringSession,
  detectRubricViolations,
  evaluateRubricItem,
  evaluateRubricItems,
} from '../sim/index.js';
import { SimRunner } from '../ui/simRunner.js';

const RULE_IDS = [
  'emergence_stop_anesthetic',
  'emergence_tof_and_reversal',
  'emergence_spontaneous_ventilation',
  'standard_mask_ventilation_before_nmb',
  'rsi_preoxygenation',
  'rsi_cricoid_applied',
  'rsi_medication_selection',
  'rsi_medication_sequence',
  'rsi_no_ppv_before_first_laryngoscopy',
  'rsi_continuous_etco2_confirmation',
  'rsi_failed_attempt_ppv_with_cricoid',
  'rsi_cricoid_release_after_confirmation',
  'rsi_inhaled_anesthetic_on',
  'rsi_vent_mode',
  'rsi_tidal_volume',
  'rsi_respiratory_rate',
  'rsi_fresh_gas',
  'rsi_fio2',
  'rsi_bag_to_vent',
  'rsi_appropriate_failed_attempt_intervention',
  'rsi_under_three_attempts',
];

const CRITERIA = { weightKg: 70 };

function itemFor(ruleId) {
  for (const rubric of [emergenceRaw, standardRaw, rsiRaw]) {
    const item = rubric.items.find((candidate) => candidate.engineEvidence?.ruleId === ruleId);
    if (item) return item;
  }
  throw new Error(`missing test item ${ruleId}`);
}

function action(tSec, name, meta = {}, snapshot = null) {
  return { tSec, action: name, meta, snapshot };
}

function evaluate(ruleId, {
  actions = [], trace = [], criteria = CRITERIA, finalized = false,
} = {}) {
  return evaluateRubricItem({ item: itemFor(ruleId), actions, trace, criteria, finalized });
}

function ventilationTrace(start, end) {
  return Array.from({ length: end - start + 1 }, (_, offset) => ({
    t: start + offset,
    airwayDevice: 'intubated',
    mechanicalMV: 6,
    capnogramPresent: true,
    etco2: 38,
  }));
}

function preoxygenationTrace(start, end) {
  return Array.from({ length: end - start + 1 }, (_, offset) => ({
    t: start + offset,
    fio2: 1,
    spontaneousRR: 14,
    spontaneousTV: 490,
  }));
}

function advanceRunner(runner, seconds) {
  runner.core.stepFor(seconds);
  runner.simTime = runner.core.simTime;
  return runner.snapshot();
}

function createRunnerBridge(rubric, runner = new SimRunner(), criteria = CRITERIA) {
  const session = new RubricScoringSession({ rubric, criteria });
  let logCursor = 0;

  function sync(expectedAction = null) {
    const recorded = [];
    while (logCursor < runner.log.length) {
      const entry = runner.log[logCursor];
      logCursor += 1;
      if (typeof entry.meta?.action !== 'string') continue;
      const { action: canonicalAction, ...meta } = entry.meta;
      recorded.push(session.recordAction({
        tSec: Math.round(entry.t),
        action: canonicalAction,
        meta,
        snapshot: runner.snapshot(),
      }));
    }
    if (expectedAction !== null) expect(recorded.at(-1)?.action).toBe(expectedAction);
    return recorded;
  }

  function record(actionName, meta = {}) {
    return session.recordAction({
      tSec: Math.round(runner.simTime),
      action: actionName,
      meta,
      snapshot: runner.snapshot(),
    });
  }

  function trace(t) {
    const snapshot = runner.snapshot();
    session.recordTrace({ ...snapshot, t });
    return snapshot;
  }

  return { runner, session, sync, record, trace };
}

const RESCUE_ACTIONS = [
  action(1, 'intubation_attempt_failed', { attemptNumber: 1 }),
  action(2, 'cricoid_pressure_applied'),
  action(3, 'mask_ppv_started', {
    airwayDevice: 'mask', minuteVentilation: 6, cricoidPressure: true,
  }),
  action(5, 'intubation_attempt_started', { attemptNumber: 2 }),
];

describe('rubric rule registry and pure API', () => {
  test('exports the complete frozen registry', () => {
    expect(Object.keys(RUBRIC_RULES)).toEqual(RULE_IDS);
    expect(Object.isFrozen(RUBRIC_RULES)).toBe(true);
  });

  test('throws for an unknown rule without mutating inputs', () => {
    const item = {
      ...itemFor('rsi_preoxygenation'),
      engineEvidence: { ruleId: 'invented_rule' },
    };
    const actions = [action(1, 'drug', { drug: 'Propofol', doseMg: 100 })];
    const trace = [{ t: 1, fio2: 0.21 }];
    const before = JSON.stringify({ item, actions, trace, criteria: CRITERIA });

    expect(() => evaluateRubricItem({
      item, actions, trace, criteria: CRITERIA, finalized: true,
    })).toThrow(RangeError);
    expect(JSON.stringify({ item, actions, trace, criteria: CRITERIA })).toBe(before);
  });

  test('rejects unknown rules during violation detection and validates named criteria overrides', () => {
    const rubric = {
      ...rsiRaw,
      items: rsiRaw.items.map((item) => (
        item.id === 'rsi-7'
          ? { ...item, engineEvidence: { ...item.engineEvidence, ruleId: 'invented_rule' } }
          : item
      )),
    };
    expect(() => detectRubricViolations({
      rubric,
      action: action(1, 'drug', { drug: 'Propofol' }),
      actions: [action(1, 'drug', { drug: 'Propofol' })],
      trace: [],
      criteria: CRITERIA,
    })).toThrow(RangeError);
    expect(() => evaluate('rsi_continuous_etco2_confirmation', {
      criteria: { ...CRITERIA, etco2ConfirmationSamples: 2.5 },
    })).toThrow(/etco2ConfirmationSamples/);
  });

  test('returns deeply immutable JSON-safe results and preserves frozen inputs', () => {
    const actions = Object.freeze([
      Object.freeze(action(1, 'drug', Object.freeze({ drug: 'propofol', doseMg: 100 }))),
      Object.freeze(action(2, 'drug', Object.freeze({ drug: 'ROCURONIUM', doseMg: 50 }))),
    ]);
    const result = evaluate('rsi_medication_selection', { actions });

    expect(result).toMatchObject({ status: 'performed', points: 2 });
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.evidence)).toBe(true);
    expect(Object.isFrozen(result.evidence.actions)).toBe(true);
    expect(() => { result.evidence.actions[0].tSec = 99; }).toThrow(TypeError);
  });

  test('bulk evaluation matches single-item results without mutating shared inputs', () => {
    const items = [
      itemFor('rsi_medication_selection'),
      itemFor('rsi_medication_sequence'),
    ];
    const actions = [
      action(1, 'drug', { drug: 'Propofol', doseMg: 100 }),
      action(2, 'drug', { drug: 'Rocuronium', doseMg: 50 }),
      action(3, 'intubation_attempt_started', { attemptNumber: 1 }),
    ];
    const trace = [{ t: 0, fio2: 1, spontaneousRR: 14, spontaneousTV: 490 }];
    const before = structuredClone({ items, actions, trace, criteria: CRITERIA });

    const results = evaluateRubricItems({
      items, actions, trace, criteria: CRITERIA, finalized: false,
    });

    expect(results).toEqual(items.map((item) => evaluateRubricItem({
      item, actions, trace, criteria: CRITERIA, finalized: false,
    })));
    expect({ items, actions, trace, criteria: CRITERIA }).toEqual(before);
    expect(Object.isFrozen(results)).toBe(true);
    expect(Object.isFrozen(results[0])).toBe(true);
    expect(Object.isFrozen(results[0].evidence.actions)).toBe(true);
    expect(() => { results[0].evidence.actions[0].tSec = 99; }).toThrow(TypeError);
  });

  test('validates named criteria overrides when constructing a scoring session', () => {
    expect(() => new RubricScoringSession({
      rubric: rsiRaw,
      criteria: { ...CRITERIA, etco2ConfirmationSamples: 2.5 },
    })).toThrow(/etco2ConfirmationSamples/);
  });
});

describe('strict exported rubric API boundary', () => {
  const preoxygenationItem = itemFor('rsi_preoxygenation');

  test('rejects cycles, custom prototypes, accessors, symbols, and dangerous or unsafe values', () => {
    const cyclic = { weightKg: 70 };
    cyclic.self = cyclic;
    expect(() => evaluateRubricItem({ item: preoxygenationItem, criteria: cyclic }))
      .toThrow(/cycle/i);

    const customCriteria = Object.create({ inherited: true });
    customCriteria.weightKg = 70;
    expect(() => evaluateRubricItem({ item: preoxygenationItem, criteria: customCriteria }))
      .toThrow(/plain object/i);

    let getterCalls = 0;
    const accessorCriteria = {};
    Object.defineProperty(accessorCriteria, 'weightKg', {
      enumerable: true,
      get() {
        getterCalls += 1;
        return 70;
      },
    });
    expect(() => evaluateRubricItem({ item: preoxygenationItem, criteria: accessorCriteria }))
      .toThrow(/data propert/i);
    expect(getterCalls).toBe(0);

    const symbolCriteria = { weightKg: 70 };
    symbolCriteria[Symbol('unsafe')] = true;
    expect(() => evaluateRubricItem({ item: preoxygenationItem, criteria: symbolCriteria }))
      .toThrow(/string keys|JSON-safe/i);

    const dangerousCriteria = { weightKg: 70 };
    Object.defineProperty(dangerousCriteria, 'constructor', {
      enumerable: true, value: 'unsafe', writable: true,
    });
    expect(() => evaluateRubricItem({ item: preoxygenationItem, criteria: dangerousCriteria }))
      .toThrow(/Dangerous/i);

    for (const unsafe of [undefined, () => {}, NaN, Infinity]) {
      expect(() => evaluateRubricItem({
        item: preoxygenationItem,
        criteria: { weightKg: 70, unsafe },
      })).toThrow(/JSON-safe/i);
    }
  });

  test('requires ordinary dense arrays at every direct API boundary', () => {
    class CriteriaList extends Array {}
    expect(() => evaluateRubricItem({
      item: preoxygenationItem,
      criteria: { weightKg: 70, acceptedInductionDrugs: new CriteriaList('Propofol') },
    })).toThrow(/ordinary array/i);
    expect(() => evaluateRubricItem({
      item: preoxygenationItem,
      criteria: { weightKg: 70, acceptedInductionDrugs: new Array(1) },
    })).toThrow(/array index|indexed values/i);

    const accessorList = ['Propofol'];
    Object.defineProperty(accessorList, '0', {
      enumerable: true, get: () => 'Propofol',
    });
    expect(() => evaluateRubricItem({
      item: preoxygenationItem,
      criteria: { weightKg: 70, acceptedInductionDrugs: accessorList },
    })).toThrow(/array index/i);

    class ActionList extends Array {}
    expect(() => evaluateRubricItem({ item: preoxygenationItem, actions: new ActionList() }))
      .toThrow(/ordinary array/i);
  });

  test('applies the strict boundary to bulk item lists and rejects unknown rules', () => {
    class ItemList extends Array {}
    expect(() => evaluateRubricItems({ items: new ItemList(preoxygenationItem) }))
      .toThrow(/ordinary array/i);
    expect(() => evaluateRubricItems({ items: new Array(1) }))
      .toThrow(/array index|indexed values/i);

    let getterCalls = 0;
    const accessorInput = {};
    Object.defineProperty(accessorInput, 'items', {
      enumerable: true,
      get() {
        getterCalls += 1;
        return [preoxygenationItem];
      },
    });
    expect(() => evaluateRubricItems(accessorInput)).toThrow(/data propert/i);
    expect(getterCalls).toBe(0);

    expect(() => evaluateRubricItems({
      items: [preoxygenationItem, { engineEvidence: { ruleId: 'invented_rule' } }],
      actions: [],
      trace: [],
      criteria: CRITERIA,
    })).toThrow(RangeError);
    expect(() => evaluateRubricItems({
      items: [preoxygenationItem], finalized: 'false',
    })).toThrow(/finalized/i);
  });

  test.each([
    ['negative action time', [action(-1, 'drug', { drug: 'Propofol' })], []],
    ['nonfinite action time', [action(Infinity, 'drug', { drug: 'Propofol' })], []],
    ['empty action name', [action(1, '  ')], []],
    ['nonmonotonic ledger', [action(2, 'first'), action(1, 'second')], []],
    ['non-object metadata', [{ tSec: 1, action: 'drug', meta: [], snapshot: null }], []],
    ['non-object snapshot', [{ tSec: 1, action: 'drug', meta: {}, snapshot: [] }], []],
    ['noninteger trace time', [], [{ t: 1.5, fio2: 1 }]],
    ['unsorted trace', [], [{ t: 2, fio2: 1 }, { t: 1, fio2: 1 }]],
    ['duplicate trace time', [], [{ t: 1, fio2: 1 }, { t: 1, fio2: 1 }]],
    ['nonfinite trace field', [], [{ t: 1, fio2: NaN }]],
  ])('rejects malformed action or trace records: %s', (_label, actions, trace) => {
    expect(() => evaluateRubricItem({
      item: preoxygenationItem, actions, trace, criteria: CRITERIA,
    })).toThrow(TypeError);
  });

  test('rejects cyclic action data and malformed item or finalized shapes', () => {
    const cyclicMeta = {};
    cyclicMeta.self = cyclicMeta;
    expect(() => evaluateRubricItem({
      item: preoxygenationItem,
      actions: [action(1, 'drug', cyclicMeta)],
      criteria: CRITERIA,
    })).toThrow(/cycle/i);
    expect(() => evaluateRubricItem({ item: { engineEvidence: null } }))
      .toThrow(/engineEvidence/i);
    expect(() => evaluateRubricItem({ item: { engineEvidence: { ruleId: 42 } } }))
      .toThrow(/ruleId/i);
    expect(() => evaluateRubricItem({ item: preoxygenationItem, finalized: 1 }))
      .toThrow(/finalized/i);
    expect(() => evaluateRubricItem({
      item: { engineEvidence: { ruleId: 'invented_rule' } },
    })).toThrow(RangeError);
  });

  test('requires a violation trigger to be the exact validated ledger member', () => {
    const ledgerAction = action(1, 'drug', { drug: 'Propofol', doseMg: 100 });
    const absentTwin = action(1, 'drug', { drug: 'Propofol', doseMg: 100 });
    expect(() => detectRubricViolations({
      rubric: rsiRaw,
      action: absentTwin,
      actions: [ledgerAction],
      trace: [],
      criteria: CRITERIA,
    })).toThrow(/exact ledger member/i);

    const flags = detectRubricViolations({
      rubric: rsiRaw,
      action: ledgerAction,
      actions: [ledgerAction],
      trace: [],
      criteria: CRITERIA,
    });
    expect(flags.some(({ itemId }) => itemId === 'rsi-7')).toBe(true);
    expect(Object.isFrozen(flags)).toBe(true);
  });

  test('validates allowed vent modes as a unique supported set and rejects derived TV overflow', () => {
    for (const allowedVentModes of [
      [1, 1], [0, 1], [-1], [4], [Number.MAX_SAFE_INTEGER + 1],
    ]) {
      expect(() => evaluate('rsi_vent_mode', {
        criteria: { ...CRITERIA, allowedVentModes },
      })).toThrow(/allowedVentModes/);
    }
    expect(evaluate('rsi_vent_mode', {
      criteria: { ...CRITERIA, allowedVentModes: [3] },
      actions: [
        action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
        action(2, 'vent_mode_changed', { previousMode: 0, mode: 3 }),
      ],
    })).toMatchObject({ status: 'performed', points: 2 });
    expect(() => evaluate('emergence_spontaneous_ventilation', {
      criteria: { weightKg: Number.MAX_VALUE, spontaneousTvMinMlPerKg: 2 },
    })).toThrow(/spontaneous.*finite|finite.*spontaneous/i);
  });

  test('does not mutate valid direct inputs while normalizing and evaluating them', () => {
    const item = structuredClone(itemFor('rsi_medication_sequence'));
    const actions = [
      action(1, 'drug', { drug: 'Propofol', doseMg: 100 }),
      action(2, 'drug', { drug: 'Rocuronium', doseMg: 50 }),
      action(3, 'intubation_attempt_started', { attemptNumber: 1 }),
    ];
    const criteria = { ...CRITERIA, allowedVentModes: [1, 2] };
    const before = structuredClone({ item, actions, criteria });

    const result = evaluateRubricItem({ item, actions, criteria, finalized: false });

    expect({ item, actions, criteria }).toEqual(before);
    expect(result).toMatchObject({ status: 'performed', points: 2 });
    expect(Object.isFrozen(result)).toBe(true);
  });
});

describe('every engine-observable rule resolves performed and not performed', () => {
  const cases = [
    {
      ruleId: 'emergence_stop_anesthetic',
      performed: {
        actions: [
          action(1, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 2 }),
          action(2, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 0 }),
        ],
      },
      notPerformed: {
        actions: [action(1, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 2 })],
        finalized: true,
      },
    },
    {
      ruleId: 'emergence_tof_and_reversal',
      performed: { actions: [action(1, 'tof_checked', { ratio: 0.92 })] },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'emergence_spontaneous_ventilation',
      performed: {
        actions: [action(1, 'spontaneous_ventilation_assessed', {}, {
          spontaneousRR: 10, spontaneousTV: 400, spontaneousMV: 4.2,
        })],
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'standard_mask_ventilation_before_nmb',
      performed: {
        actions: [
          action(1, 'mask_ppv_started', { airwayDevice: 'mask', minuteVentilation: 6 }),
          action(2, 'drug', { drug: 'Rocuronium', doseMg: 50 }),
        ],
      },
      notPerformed: {
        actions: [
          action(1, 'drug', { drug: 'Rocuronium', doseMg: 50 }),
          action(2, 'intubation_attempt_started', { attemptNumber: 1 }),
        ],
      },
    },
    {
      ruleId: 'rsi_preoxygenation',
      performed: {
        actions: [action(180, 'drug', { drug: 'Propofol', doseMg: 120 })],
        trace: preoxygenationTrace(0, 180),
      },
      notPerformed: {
        actions: [action(1, 'drug', { drug: 'Propofol', doseMg: 120 })],
        trace: [{ t: 1, fio2: 0.21, spontaneousRR: 14, spontaneousTV: 490 }],
      },
    },
    {
      ruleId: 'rsi_cricoid_applied',
      performed: {
        actions: [
          action(1, 'drug', { drug: 'Propofol', doseMg: 120 }),
          action(2, 'cricoid_pressure_applied'),
          action(3, 'intubation_attempt_started', { attemptNumber: 1 }),
        ],
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'rsi_medication_selection',
      performed: {
        actions: [
          action(1, 'drug', { drug: 'Etomidate', doseMg: 20 }),
          action(2, 'drug', { drug: 'Succinylcholine', doseMg: 100 }),
        ],
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'rsi_medication_sequence',
      performed: {
        actions: [
          action(1, 'drug', { drug: 'Ketamine', doseMg: 100 }),
          action(2, 'drug', { drug: 'Rocuronium', doseMg: 50 }),
          action(3, 'intubation_attempt_started', { attemptNumber: 1 }),
        ],
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'rsi_no_ppv_before_first_laryngoscopy',
      performed: { actions: [action(1, 'intubation_attempt_started', { attemptNumber: 1 })] },
      notPerformed: {
        actions: [
          action(1, 'mask_ppv_started', { airwayDevice: 'mask', minuteVentilation: 6 }),
          action(2, 'intubation_attempt_started', { attemptNumber: 1 }),
        ],
      },
    },
    {
      ruleId: 'rsi_continuous_etco2_confirmation',
      performed: {
        actions: [
          action(0, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
          action(1, 'confirm_etco2'),
        ],
        trace: ventilationTrace(1, 5),
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'rsi_failed_attempt_ppv_with_cricoid',
      performed: { actions: RESCUE_ACTIONS },
      notPerformed: {
        actions: [
          action(1, 'intubation_attempt_failed', { attemptNumber: 1 }),
          action(2, 'intubation_attempt_started', { attemptNumber: 2 }),
        ],
      },
    },
    {
      ruleId: 'rsi_cricoid_release_after_confirmation',
      performed: {
        actions: [
          action(0, 'cricoid_pressure_applied'),
          action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
          action(2, 'confirm_etco2'),
          action(6, 'cricoid_pressure_released'),
        ],
        trace: ventilationTrace(1, 5),
      },
      notPerformed: {
        actions: [action(0, 'cricoid_pressure_applied')],
        finalized: true,
      },
    },
    {
      ruleId: 'rsi_inhaled_anesthetic_on',
      performed: {
        actions: [
          action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
          action(2, 'volatile_changed', { agent: 'Desflurane', dialPercent: 6 }),
        ],
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'rsi_vent_mode',
      performed: {
        actions: [
          action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
          action(2, 'vent_mode_changed', { previousMode: 0, mode: 1 }),
        ],
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'rsi_tidal_volume',
      performed: {
        actions: [
          action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
          action(2, 'machine_settings_changed', { patch: { setTidalVolume: 500 } }),
        ],
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'rsi_respiratory_rate',
      performed: {
        actions: [
          action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
          action(2, 'machine_settings_changed', { setRespiratoryRate: 12 }),
        ],
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'rsi_fresh_gas',
      performed: {
        actions: [
          action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
          action(2, 'machine_settings_changed', {
            patch: { o2FlowLPerMin: 2, airFlowLPerMin: 2, n2oFlowLPerMin: 0 },
          }),
        ],
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'rsi_fio2',
      performed: {
        actions: [
          action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
          action(2, 'machine_settings_changed', { patch: { setFiO2: 0.5 } }),
        ],
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'rsi_bag_to_vent',
      performed: {
        actions: [
          action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
          action(2, 'vent_mode_changed', { previousMode: 0, mode: 2 }),
        ],
      },
      notPerformed: { finalized: true },
    },
    {
      ruleId: 'rsi_appropriate_failed_attempt_intervention',
      performed: {
        actions: [
          ...RESCUE_ACTIONS,
          action(6, 'intubation_attempt_succeeded', { attemptNumber: 2 }),
        ],
        trace: [
          { t: 1, spo2: 98 },
          { t: 2, spo2: 94 },
          { t: 3, spo2: 95 },
          { t: 4, spo2: 98 },
        ],
      },
      notPerformed: {
        actions: [
          action(1, 'intubation_attempt_failed', { attemptNumber: 1 }),
          action(2, 'intubation_attempt_started', { attemptNumber: 2 }),
        ],
      },
    },
    {
      ruleId: 'rsi_under_three_attempts',
      performed: {
        actions: [
          action(1, 'intubation_attempt_started', { attemptNumber: 2 }),
          action(2, 'intubation_attempt_succeeded', { attemptNumber: 2 }),
        ],
      },
      notPerformed: { actions: [action(1, 'intubation_attempt_started', { attemptNumber: 3 })] },
    },
  ];

  test.each(cases)('$ruleId performed', ({ ruleId, performed }) => {
    const result = evaluate(ruleId, performed);
    expect(result).toMatchObject({ status: 'performed', points: 2 });
    for (const citation of result.evidence.actions) {
      expect(citation).toMatchObject({ index: expect.any(Number), tSec: expect.any(Number) });
    }
    for (const citation of result.evidence.trace) {
      expect(citation).toMatchObject({ index: expect.any(Number), tSec: expect.any(Number) });
      expect(Object.keys(citation.fields).length).toBeGreaterThan(0);
    }
  });

  test.each(cases)('$ruleId not performed', ({ ruleId, notPerformed }) => {
    expect(evaluate(ruleId, notPerformed)).toMatchObject({
      status: 'not_performed', points: 0,
    });
  });
});

describe('rules with explicit partial semantics', () => {
  const partialCases = [
    ['emergence_stop_anesthetic', {
      actions: [
        action(1, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 2 }),
        action(2, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 1 }),
      ],
    }],
    ['emergence_tof_and_reversal', {
      actions: [action(1, 'tof_checked', { ratio: 0.6 })],
    }],
    ['emergence_spontaneous_ventilation', {
      actions: [action(1, 'spontaneous_ventilation_assessed', {
        spontaneousRR: 10, spontaneousTV: 100, spontaneousMV: 1,
      })],
    }],
    ['standard_mask_ventilation_before_nmb', {
      actions: [
        action(1, 'drug', { drug: 'Rocuronium', doseMg: 50 }),
        action(2, 'mask_ppv_started', { airwayDevice: 'mask', minuteVentilation: 6 }),
      ],
    }],
    ['rsi_preoxygenation', {
      actions: [action(60, 'drug', { drug: 'Propofol', doseMg: 100 })],
      trace: preoxygenationTrace(0, 60),
    }],
    ['rsi_cricoid_applied', {
      actions: [
        action(0, 'cricoid_pressure_applied'),
        action(1, 'drug', { drug: 'Propofol', doseMg: 100 }),
        action(2, 'intubation_attempt_started', { attemptNumber: 1 }),
      ],
    }],
    ['rsi_medication_selection', {
      actions: [action(1, 'drug', { drug: 'Etomidate', doseMg: 20 })],
    }],
    ['rsi_medication_sequence', {
      actions: [
        action(1, 'drug', { drug: 'Rocuronium', doseMg: 50 }),
        action(2, 'drug', { drug: 'Etomidate', doseMg: 20 }),
        action(3, 'intubation_attempt_started', { attemptNumber: 1 }),
      ],
    }],
    ['rsi_continuous_etco2_confirmation', {
      actions: [
        action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
        action(2, 'confirm_etco2'),
      ],
    }],
    ['rsi_failed_attempt_ppv_with_cricoid', {
      actions: [
        action(1, 'intubation_attempt_failed', { attemptNumber: 1 }),
        action(2, 'cricoid_pressure_applied'),
      ],
    }],
    ['rsi_cricoid_release_after_confirmation', {
      actions: [
        action(0, 'cricoid_pressure_applied'),
        action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
        action(2, 'cricoid_pressure_released'),
      ],
    }],
    ['rsi_inhaled_anesthetic_on', {
      actions: [
        action(0, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 2 }),
        action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }, {
          vaporizerAgent: 'Sevoflurane', vaporizer: 2,
        }),
      ],
    }],
    ['rsi_vent_mode', {
      actions: [
        action(0, 'vent_mode_changed', { previousMode: 0, mode: 1 }),
        action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }, { ventMode: 1 }),
      ],
    }],
    ['rsi_tidal_volume', {
      actions: [
        action(0, 'machine_settings_changed', { setTidalVolume: 500 }),
        action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }, { ventSetTV: 500 }),
      ],
    }],
    ['rsi_respiratory_rate', {
      actions: [
        action(0, 'machine_settings_changed', { setRespiratoryRate: 12 }),
        action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }, { ventSetRR: 12 }),
      ],
    }],
    ['rsi_fresh_gas', {
      actions: [
        action(0, 'machine_settings_changed', { o2FlowLPerMin: 2 }),
        action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }, {
          o2Flow: 2, airFlow: 0, n2oFlow: 0,
        }),
      ],
    }],
    ['rsi_fio2', {
      actions: [
        action(0, 'machine_settings_changed', { setFiO2: 0.5 }),
        action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }, { fio2: 0.5 }),
      ],
    }],
    ['rsi_bag_to_vent', {
      actions: [
        action(0, 'vent_mode_changed', { previousMode: 0, mode: 1 }),
        action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }, { ventMode: 1 }),
      ],
    }],
    ['rsi_appropriate_failed_attempt_intervention', {
      actions: [
        action(1, 'intubation_attempt_failed', { attemptNumber: 1 }),
        action(2, 'mask_ppv_started', { airwayDevice: 'mask', minuteVentilation: 6 }),
      ],
    }],
  ];

  test.each(partialCases)('%s returns partial only for documented incomplete behavior', (ruleId, input) => {
    expect(evaluate(ruleId, input)).toMatchObject({ status: 'partial', points: 1 });
  });

  test.each([
    'rsi_failed_attempt_ppv_with_cricoid',
    'rsi_appropriate_failed_attempt_intervention',
  ])('%s finalizes performed when the conditional failure never occurs', (ruleId) => {
    expect(evaluate(ruleId, { finalized: true })).toMatchObject({
      status: 'performed',
      points: 2,
      evidence: { conditionTriggered: false },
    });
  });
});

describe('anesthetic infusion and machine-state adapters', () => {
  test('requires actions to reduce every initially active anesthetic source', () => {
    const trace = [{
      t: 0,
      vaporizer: 0,
      activeAnestheticInfusions: { Propofol: 100, Remifentanil: 10 },
    }];
    const partial = evaluate('emergence_stop_anesthetic', {
      trace,
      actions: [action(1, 'drug_infusion_changed', {
        drug: 'Propofol', previousRate: 100, rate: 0,
      })],
    });
    const performed = evaluate('emergence_stop_anesthetic', {
      trace,
      actions: [
        action(1, 'drug_infusion_changed', {
          drug: 'Propofol', previousRate: 100, rate: 0,
        }),
        action(2, 'drug_infusion_stopped', {
          drug: 'Remifentanil', previousRate: 10, rate: 0,
        }),
      ],
    });

    expect(partial).toMatchObject({ status: 'partial', points: 1 });
    expect(performed).toMatchObject({ status: 'performed', points: 2 });
    expect(performed.evidence.trace[0].fields.activeAnestheticInfusions)
      .toEqual({ Propofol: 100, Remifentanil: 10 });
  });

  test('uses the action snapshot to calculate total fresh gas after a one-field change', () => {
    expect(evaluate('rsi_fresh_gas', {
      actions: [
        action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
        action(2, 'machine_settings_changed', { patch: { airFlowLPerMin: 0 } }, {
          o2Flow: 2, airFlow: 0, n2oFlow: 0,
        }),
      ],
    })).toMatchObject({ status: 'performed', points: 2 });
  });

  test('counts a contiguous interval through induction when the last sample is one second before it', () => {
    expect(evaluate('rsi_preoxygenation', {
      actions: [action(180, 'drug', { drug: 'Propofol', doseMg: 100 })],
      trace: preoxygenationTrace(0, 179),
    })).toMatchObject({ status: 'performed', points: 2 });
  });

  test('recognizes cricoid already active at a failed attempt as incomplete rescue evidence', () => {
    const actions = [
      action(0, 'cricoid_pressure_applied'),
      action(1, 'intubation_attempt_failed', { attemptNumber: 1 }),
      action(2, 'intubation_attempt_started', { attemptNumber: 2 }),
    ];
    expect(evaluate('rsi_failed_attempt_ppv_with_cricoid', { actions }))
      .toMatchObject({ status: 'partial', points: 1 });
    expect(evaluate('rsi_appropriate_failed_attempt_intervention', { actions }))
      .toMatchObject({ status: 'partial', points: 1 });
  });

  test('does not fabricate applied cricoid pressure from a release action alone', () => {
    expect(evaluate('rsi_cricoid_release_after_confirmation', {
      actions: [
        action(0, 'intubation_attempt_succeeded', { attemptNumber: 1 }),
        action(1, 'confirm_etco2'),
        action(6, 'cricoid_pressure_released'),
      ],
      trace: ventilationTrace(1, 5),
      finalized: true,
    })).toMatchObject({ status: 'not_performed', points: 0 });
  });
});

describe('ordered evidence regression cases', () => {
  test('cuts anesthetic shutdown scoring at the first extubation action', () => {
    const result = evaluate('emergence_stop_anesthetic', {
      actions: [
        action(1, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 2 }),
        action(2, 'extubate'),
        action(3, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 0 }),
      ],
    });

    expect(result).toMatchObject({ status: 'not_performed', points: 0 });
    expect(result.evidence.actions.map(({ index }) => index)).toEqual([0]);
  });

  test('uses ledger order for same-time volatile terminal state before extubation', () => {
    const offThenOn = evaluate('emergence_stop_anesthetic', {
      actions: [
        action(0, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 2 }),
        action(1, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 0 }),
        action(1, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 2 }),
        action(1, 'extubate'),
      ],
    });
    const onThenOff = evaluate('emergence_stop_anesthetic', {
      actions: [
        action(0, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 2 }),
        action(1, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 3 }),
        action(1, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 0 }),
        action(1, 'extubate'),
      ],
    });

    expect(offThenOn).toMatchObject({ status: 'partial', points: 1 });
    expect(onThenOff).toMatchObject({ status: 'performed', points: 2 });
  });

  test('accepts a terminal active infusion below baseline but not a restored infusion', () => {
    const trace = [{
      t: 0,
      vaporizer: 0,
      activeAnestheticInfusions: { Propofol: 100 },
    }];
    const decreased = evaluate('emergence_stop_anesthetic', {
      trace,
      actions: [
        action(1, 'drug_infusion_changed', {
          drug: 'Propofol', previousRate: 100, rate: 60,
        }),
        action(2, 'extubate'),
      ],
    });
    const restored = evaluate('emergence_stop_anesthetic', {
      trace,
      actions: [
        action(1, 'drug_infusion_changed', {
          drug: 'Propofol', previousRate: 100, rate: 60,
        }),
        action(2, 'drug_infusion_changed', {
          drug: 'Propofol', previousRate: 60, rate: 100,
        }),
        action(3, 'extubate'),
      ],
    });

    expect(decreased).toMatchObject({ status: 'performed', points: 2 });
    expect(restored).toMatchObject({ status: 'partial', points: 1 });
  });

  test('applies type-specific terminal rules across every active anesthetic source', () => {
    const trace = [{
      t: 0,
      vaporizer: 2,
      vaporizerAgent: 'Sevoflurane',
      activeAnestheticInfusions: { Propofol: 100, Remifentanil: 10 },
    }];
    const allComplete = evaluate('emergence_stop_anesthetic', {
      trace,
      actions: [
        action(1, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 0 }),
        action(2, 'drug_infusion_changed', {
          drug: 'Propofol', previousRate: 100, rate: 75,
        }),
        action(3, 'drug_infusion_changed', {
          drug: 'Remifentanil', previousRate: 10, rate: 5,
        }),
        action(4, 'extubate'),
      ],
    });
    const volatileStillOn = evaluate('emergence_stop_anesthetic', {
      trace,
      actions: [
        action(1, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 1 }),
        action(2, 'drug_infusion_changed', {
          drug: 'Propofol', previousRate: 100, rate: 75,
        }),
        action(3, 'drug_infusion_changed', {
          drug: 'Remifentanil', previousRate: 10, rate: 5,
        }),
        action(4, 'extubate'),
      ],
    });

    expect(allComplete).toMatchObject({ status: 'performed', points: 2 });
    expect(volatileStillOn).toMatchObject({ status: 'partial', points: 1 });
  });

  test.each([
    ['induction then NMB then attempt', ['induction', 'nmb', 'attempt'], 2],
    ['NMB then induction then attempt', ['nmb', 'induction', 'attempt'], 1],
    ['attempt then induction then NMB', ['attempt', 'induction', 'nmb'], 0],
    ['induction then attempt then NMB', ['induction', 'attempt', 'nmb'], 0],
    ['NMB then attempt then induction', ['nmb', 'attempt', 'induction'], 0],
    ['attempt without medications', ['attempt'], 0],
    ['induction then attempt without NMB', ['induction', 'attempt'], 0],
    ['NMB then attempt without induction', ['nmb', 'attempt'], 0],
  ])('scores medication sequence permutation: %s', (_label, order, points) => {
    const records = {
      induction: action(10, 'drug', { drug: 'Propofol', doseMg: 100 }),
      nmb: action(10, 'drug', { drug: 'Rocuronium', doseMg: 50 }),
      attempt: action(10, 'intubation_attempt_started', { attemptNumber: 1 }),
    };
    const result = evaluate('rsi_medication_sequence', {
      actions: order.map((key) => records[key]),
    });

    expect(result.points).toBe(points);
  });

  test('keeps medication sequence pending before an attempt and finalizes a missing attempt to zero', () => {
    const actions = [
      action(1, 'drug', { drug: 'Rocuronium', doseMg: 50 }),
      action(2, 'drug', { drug: 'Propofol', doseMg: 100 }),
    ];

    expect(evaluate('rsi_medication_sequence', { actions }))
      .toMatchObject({ status: 'pending', points: null });
    expect(evaluate('rsi_medication_sequence', { actions, finalized: true }))
      .toMatchObject({ status: 'not_performed', points: 0 });
  });

  test('later volatile or infusion reactivation lowers a completed shutdown to partial', () => {
    const volatileActions = [
      action(1, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 2 }),
      action(2, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 0 }),
      action(3, 'volatile_changed', { agent: 'Sevoflurane', dialPercent: 3 }),
    ];
    const infusionActions = [
      action(1, 'drug_infusion_stopped', {
        drug: 'Propofol', previousRate: 100, rate: 0,
      }),
      action(2, 'drug_infusion_changed', {
        drug: 'Propofol', previousRate: 0, rate: 100,
      }),
    ];

    const volatile = evaluate('emergence_stop_anesthetic', { actions: volatileActions });
    const infusion = evaluate('emergence_stop_anesthetic', { actions: infusionActions });

    expect(volatile).toMatchObject({ status: 'partial', points: 1 });
    expect(infusion).toMatchObject({ status: 'partial', points: 1 });
    expect(volatile.evidence.actions.map(({ index }) => index)).toEqual([0, 1, 2]);
    expect(infusion.evidence.actions.map(({ index }) => index)).toEqual([0, 1]);
  });

  test('a low TOF requires low-check then reversal then adequate repeat in ledger order', () => {
    const low = action(10, 'tof_checked', { ratio: 0.4 });
    const reversal = action(10, 'drug', { drug: 'Sugammadex', doseMg: 140 });
    const adequate = action(10, 'tof_checked', { ratio: 0.95 });

    expect(evaluate('emergence_tof_and_reversal', { actions: [low, adequate] }))
      .toMatchObject({ status: 'partial', points: 1 });
    expect(evaluate('emergence_tof_and_reversal', { actions: [low, reversal, adequate] }))
      .toMatchObject({ status: 'performed', points: 2 });
    expect(evaluate('emergence_tof_and_reversal', { actions: [low, adequate, reversal] }))
      .toMatchObject({ status: 'partial', points: 1 });
    expect(evaluate('emergence_tof_and_reversal', { actions: [adequate] }))
      .toMatchObject({ status: 'performed', points: 2 });
  });

  test('spontaneous ventilation assessments after extubation cannot improve the score', () => {
    const extubation = action(1, 'extubate');
    const adequateAfter = action(2, 'spontaneous_ventilation_assessed', {}, {
      spontaneousRR: 12, spontaneousTV: 450, spontaneousMV: 5.4,
    });
    const partialBefore = action(0, 'spontaneous_ventilation_assessed', {}, {
      spontaneousRR: 10, spontaneousTV: 100, spontaneousMV: 1,
    });

    expect(evaluate('emergence_spontaneous_ventilation', {
      actions: [extubation, adequateAfter],
    })).toMatchObject({ status: 'not_performed', points: 0 });
    expect(evaluate('emergence_spontaneous_ventilation', {
      actions: [partialBefore, extubation, adequateAfter],
    })).toMatchObject({ status: 'partial', points: 1 });
  });

  test('preoxygenation uses the longest qualifying run before induction, even after interruption', () => {
    const longThenInterrupted = [
      ...preoxygenationTrace(0, 180),
      { t: 181, fio2: 0.21, spontaneousRR: 14, spontaneousTV: 490 },
    ];
    const shortThenInterrupted = [
      ...preoxygenationTrace(0, 30),
      { t: 31, fio2: 0.21, spontaneousRR: 14, spontaneousTV: 490 },
    ];

    expect(evaluate('rsi_preoxygenation', {
      actions: [action(182, 'drug', { drug: 'Propofol', doseMg: 100 })],
      trace: longThenInterrupted,
    })).toMatchObject({ status: 'performed', points: 2 });
    expect(evaluate('rsi_preoxygenation', {
      actions: [action(32, 'drug', { drug: 'Propofol', doseMg: 100 })],
      trace: shortThenInterrupted,
    })).toMatchObject({ status: 'partial', points: 1 });
    expect(evaluate('rsi_preoxygenation', {
      actions: [action(180, 'drug', { drug: 'Propofol', doseMg: 100 })],
      trace: preoxygenationTrace(0, 178),
    })).toMatchObject({ status: 'partial', points: 1 });
  });

  test('same-time cricoid release requires confirm action earlier in ledger order', () => {
    const applied = action(0, 'cricoid_pressure_applied');
    const success = action(1, 'intubation_attempt_succeeded', { attemptNumber: 1 });
    const confirmation = action(6, 'confirm_etco2');
    const release = action(6, 'cricoid_pressure_released');
    const trace = ventilationTrace(1, 5);

    expect(evaluate('rsi_cricoid_release_after_confirmation', {
      actions: [applied, success, confirmation, release], trace,
    })).toMatchObject({ status: 'performed', points: 2 });
    expect(evaluate('rsi_cricoid_release_after_confirmation', {
      actions: [applied, success, release, confirmation], trace,
    })).toMatchObject({ status: 'partial', points: 1 });
  });
});

describe('RubricScoringSession engine integration', () => {
  test('uses canonical actions and a real SimRunner snapshot to score Standard IV ventilation', () => {
    const runner = new SimRunner();
    const session = new RubricScoringSession({ rubric: standardRaw, criteria: CRITERIA });
    const ppv = runner.deliverMaskVentilation({
      durationSeconds: 2, tidalVolumeMl: 500, respiratoryRate: 12,
    });
    const ppvLog = runner.log.at(-1);
    const { action: ppvAction, ...ppvMeta } = ppvLog.meta;
    session.recordAction({
      tSec: ppvLog.t,
      action: ppvAction,
      meta: ppvMeta,
      snapshot: runner.snapshot(),
    });
    runner.giveBolus('Rocuronium', 50);
    const drugLog = runner.log.at(-1);
    session.recordAction({
      tSec: drugLog.t,
      action: drugLog.meta.action,
      meta: { drug: drugLog.meta.drug, doseMg: drugLog.meta.doseMg },
      snapshot: runner.snapshot(),
    });

    expect(ppv.minuteVentilation).toBe(6);
    expect(session.getItemStatus('standard-7').status).toBe('pending');
    expect(session.getLiveResult().items.find(({ id }) => id === 'standard-7')).toMatchObject({
      status: 'performed', points: 2,
    });
  });

  test('moves pending engine rows to final scores and can degrade a prior live score', () => {
    const session = new RubricScoringSession({ rubric: rsiRaw, criteria: CRITERIA });
    session.recordAction({
      tSec: 1, action: 'intubation_attempt_started', meta: { attemptNumber: 1 },
    });
    session.recordAction({
      tSec: 2, action: 'intubation_attempt_succeeded', meta: { attemptNumber: 1 },
    });
    const performed = session.getLiveResult();
    expect(performed.items.find(({ id }) => id === 'rsi-42')).toMatchObject({ points: 2 });

    session.recordAction({
      tSec: 3, action: 'intubation_attempt_started', meta: { attemptNumber: 3 },
    });
    const degraded = session.getLiveResult();
    expect(degraded).not.toBe(performed);
    expect(degraded.items.find(({ id }) => id === 'rsi-42')).toMatchObject({ points: 0 });
    expect(session.getLiveResult()).toBe(degraded);

    for (const item of session.rubric.items) {
      if (item.scoringSource === 'INSTRUCTOR_OBSERVED') {
        session.setInstructorScore({ itemId: item.id, points: 2, tSec: 4 });
      }
    }
    const final = session.finalize({ tSec: 5 });
    expect(final.ok).toBe(true);
    expect(final.pendingEngineCount).toBe(0);
    expect(final.items.filter(({ scoringSource }) => scoringSource === 'ENGINE_OBSERVABLE'))
      .not.toContainEqual(expect.objectContaining({ points: null }));
    expect(session.finalize({ tSec: 999 })).toBe(final);
  });
});

describe('real engine rubric evidence bridge', () => {
  function liveItem(session, itemId) {
    return session.getLiveResult().items.find(({ id }) => id === itemId);
  }

  test('uses actual volatile, NMB, reversal, TOF, and spontaneous engine state for emergence', () => {
    const bridge = createRunnerBridge(emergenceRaw);
    const { runner, session } = bridge;

    runner.setVolatile({ agent: 'Sevoflurane', dialPercent: 2 });
    bridge.sync('volatile_changed');
    expect(runner.snapshot().vaporizer).toBe(2);
    runner.setVolatile({ agent: 'Sevoflurane', dialPercent: 0 });
    bridge.sync('volatile_changed');
    expect(liveItem(session, 'emergence-2')).toMatchObject({ points: 2 });
    runner.setVolatile({ agent: 'Sevoflurane', dialPercent: 3 });
    bridge.sync('volatile_changed');
    expect(runner.snapshot().vaporizer).toBe(3);
    expect(liveItem(session, 'emergence-2')).toMatchObject({ points: 1 });

    runner.giveBolus('Rocuronium', 42);
    bridge.sync('drug');
    advanceRunner(runner, 120);
    const lowCheck = runner.checkTrainOfFour();
    bridge.sync('tof_checked');
    expect(lowCheck.ratio).toBeLessThan(0.9);
    runner.giveBolus('Sugammadex', 280);
    bridge.sync('drug');
    advanceRunner(runner, 300);
    const recoveredCheck = runner.checkTrainOfFour();
    bridge.sync('tof_checked');
    expect(recoveredCheck.ratio).toBeGreaterThanOrEqual(0.9);
    expect(liveItem(session, 'emergence-3')).toMatchObject({ points: 2 });

    const spontaneous = createRunnerBridge(emergenceRaw);
    expect(spontaneous.runner.setAirwayDevice('intubated').ok).toBe(true);
    const assessment = spontaneous.runner.snapshot();
    expect(assessment.spontaneousRR).toBeGreaterThanOrEqual(8);
    expect(assessment.spontaneousTV).toBeGreaterThanOrEqual(350);
    expect(assessment.spontaneousMV).toBeGreaterThanOrEqual(4);
    spontaneous.record('spontaneous_ventilation_assessed');
    expect(spontaneous.runner.extubate().ok).toBe(true);
    spontaneous.sync('extubate');
    expect(liveItem(spontaneous.session, 'emergence-4')).toMatchObject({ points: 2 });

    const afterExtubation = createRunnerBridge(emergenceRaw);
    expect(afterExtubation.runner.setAirwayDevice('intubated').ok).toBe(true);
    expect(afterExtubation.runner.extubate().ok).toBe(true);
    afterExtubation.sync('extubate');
    afterExtubation.record('spontaneous_ventilation_assessed');
    expect(liveItem(afterExtubation.session, 'emergence-4')).toMatchObject({ points: 0 });
  });

  test('uses actual mask PPV and NMB actions for paired Standard IV outcomes', () => {
    const compliant = createRunnerBridge(standardRaw);
    const ppv = compliant.runner.deliverMaskVentilation({
      durationSeconds: 1, tidalVolumeMl: 500, respiratoryRate: 12,
    });
    compliant.sync('mask_ppv_started');
    expect(ppv.minuteVentilation).toBe(6);
    expect(compliant.runner.snapshot().airwayDevice).toBe('mask');
    compliant.runner.giveBolus('Rocuronium', 42);
    compliant.sync('drug');
    expect(liveItem(compliant.session, 'standard-7')).toMatchObject({ points: 2 });

    const omitted = createRunnerBridge(standardRaw);
    omitted.runner.giveBolus('Rocuronium', 42);
    omitted.sync('drug');
    omitted.runner.configureIntubationAttempts({
      failedIntubationAttempts: [], attemptDurationSeconds: 1,
    });
    omitted.runner.attemptIntubation();
    omitted.sync('intubation_attempt_started');
    expect(liveItem(omitted.session, 'standard-7')).toMatchObject({ points: 0 });
  });

  test('scores a complete RSI run from actual preoxygenation, airway, and machine state', () => {
    const bridge = createRunnerBridge(rsiRaw);
    const { runner, session } = bridge;
    runner.preoxygenate();
    bridge.sync('preoxygenate');
    for (let second = 1; second <= 180; second += 1) {
      const snapshot = advanceRunner(runner, 1);
      expect(snapshot.fio2).toBeGreaterThanOrEqual(0.99);
      expect(snapshot.spontaneousRR).toBeGreaterThan(0);
      expect(snapshot.spontaneousTV).toBeGreaterThan(0);
      bridge.trace(second);
    }

    runner.giveBolus('Propofol', 140);
    bridge.sync('drug');
    runner.giveBolus('Rocuronium', 50);
    bridge.sync('drug');
    runner.applyCricoidPressure();
    bridge.sync('cricoid_pressure_applied');
    runner.configureIntubationAttempts({
      failedIntubationAttempts: [], attemptDurationSeconds: 1,
    });
    runner.attemptIntubation();
    bridge.sync('intubation_attempt_started');
    advanceRunner(runner, 1);
    bridge.sync('intubation_attempt_succeeded');
    expect(runner.snapshot().airwayDevice).toBe('intubated');

    const machinePatch = {
      setTidalVolume: 500,
      setRespiratoryRate: 12,
      o2FlowLPerMin: 2,
      airFlowLPerMin: 2,
      n2oFlowLPerMin: 0,
      setFiO2: 0.5,
    };
    runner.setMachine({ mode: 1, ...machinePatch });
    bridge.record('vent_mode_changed', { previousMode: 0, mode: 1 });
    bridge.record('machine_settings_changed', { patch: machinePatch });
    runner.setVolatile({ agent: 'Sevoflurane', dialPercent: 2 });
    bridge.sync('volatile_changed');

    let ventilated = runner.snapshot();
    for (let elapsed = 0; elapsed < 20 && !ventilated.capnogramPresent; elapsed += 1) {
      ventilated = advanceRunner(runner, 1);
    }
    expect(ventilated).toMatchObject({
      airwayDevice: 'intubated',
      capnogramPresent: true,
      ventMode: 1,
      ventSetTV: 500,
      ventSetRR: 12,
    });
    expect(ventilated.mechanicalMV).toBeGreaterThan(0);
    expect(ventilated.etco2).toBeGreaterThan(0);
    bridge.record('confirm_etco2');
    const firstTraceSecond = Math.round(runner.simTime);
    for (let offset = 0; offset < 5; offset += 1) {
      if (offset > 0) advanceRunner(runner, 1);
      const actual = bridge.trace(firstTraceSecond + offset);
      expect(actual.capnogramPresent).toBe(true);
      expect(actual.mechanicalMV).toBeGreaterThan(0);
    }
    runner.releaseCricoidPressure();
    bridge.sync('cricoid_pressure_released');

    for (const itemId of [
      'rsi-7', 'rsi-9', 'rsi-10a', 'rsi-10c', 'rsi-11', 'rsi-26', 'rsi-29',
      'rsi-30', 'rsi-32', 'rsi-33', 'rsi-34', 'rsi-35', 'rsi-36', 'rsi-37', 'rsi-42',
    ]) {
      expect(liveItem(session, itemId), itemId).toMatchObject({ points: 2 });
    }
  });

  test('uses actual failed attempts and rescue ventilation for conditional RSI rules', () => {
    const rescued = createRunnerBridge(rsiRaw);
    rescued.runner.configureIntubationAttempts({
      failedIntubationAttempts: [1], attemptDurationSeconds: 1,
    });
    rescued.runner.attemptIntubation();
    rescued.sync('intubation_attempt_started');
    advanceRunner(rescued.runner, 1);
    rescued.sync('intubation_attempt_failed');
    rescued.runner.applyCricoidPressure();
    rescued.sync('cricoid_pressure_applied');
    const ppv = rescued.runner.deliverMaskVentilation({
      durationSeconds: 1,
      tidalVolumeMl: 500,
      respiratoryRate: 12,
      cricoidPressure: true,
    });
    rescued.sync('mask_ppv_started');
    expect(ppv.minuteVentilation).toBe(6);
    advanceRunner(rescued.runner, 1);
    rescued.sync('mask_ppv_completed');
    rescued.runner.attemptIntubation();
    rescued.sync('intubation_attempt_started');
    advanceRunner(rescued.runner, 1);
    rescued.sync('intubation_attempt_succeeded');
    expect(liveItem(rescued.session, 'rsi-28')).toMatchObject({ points: 2 });
    expect(liveItem(rescued.session, 'rsi-41')).toMatchObject({ points: 1 });
    expect(liveItem(rescued.session, 'rsi-42')).toMatchObject({ points: 2 });

    const omitted = createRunnerBridge(rsiRaw);
    omitted.runner.configureIntubationAttempts({
      failedIntubationAttempts: [1, 2], attemptDurationSeconds: 1,
    });
    omitted.runner.attemptIntubation();
    omitted.sync('intubation_attempt_started');
    advanceRunner(omitted.runner, 1);
    omitted.sync('intubation_attempt_failed');
    omitted.runner.attemptIntubation();
    omitted.sync('intubation_attempt_started');
    expect(liveItem(omitted.session, 'rsi-28')).toMatchObject({ points: 0 });
    expect(liveItem(omitted.session, 'rsi-41')).toMatchObject({ points: 0 });
    advanceRunner(omitted.runner, 1);
    omitted.sync('intubation_attempt_failed');
    omitted.runner.attemptIntubation();
    omitted.sync('intubation_attempt_started');
    expect(liveItem(omitted.session, 'rsi-42')).toMatchObject({ points: 0 });

    const ppvBeforeAttempt = createRunnerBridge(rsiRaw);
    ppvBeforeAttempt.runner.setMachine({
      o2FlowLPerMin: 0, airFlowLPerMin: 5, n2oFlowLPerMin: 0, setFiO2: 0.21,
    });
    for (let second = 1; second <= 5; second += 1) {
      const roomAir = advanceRunner(ppvBeforeAttempt.runner, 1);
      expect(roomAir.fio2).toBeLessThan(0.99);
      ppvBeforeAttempt.trace(second);
    }
    ppvBeforeAttempt.runner.giveBolus('Propofol', 140);
    ppvBeforeAttempt.sync('drug');
    expect(liveItem(ppvBeforeAttempt.session, 'rsi-7')).toMatchObject({ points: 0 });
    ppvBeforeAttempt.runner.deliverMaskVentilation({
      durationSeconds: 1, tidalVolumeMl: 500, respiratoryRate: 12,
    });
    ppvBeforeAttempt.sync('mask_ppv_started');
    advanceRunner(ppvBeforeAttempt.runner, 1);
    ppvBeforeAttempt.sync('mask_ppv_completed');
    ppvBeforeAttempt.runner.attemptIntubation();
    ppvBeforeAttempt.sync('intubation_attempt_started');
    expect(liveItem(ppvBeforeAttempt.session, 'rsi-11')).toMatchObject({ points: 0 });
  });
});

describe('failed-attempt segment aggregation', () => {
  const failed = (tSec, attemptNumber) => (
    action(tSec, 'intubation_attempt_failed', { attemptNumber })
  );
  const attemptStarted = (tSec, attemptNumber) => (
    action(tSec, 'intubation_attempt_started', { attemptNumber })
  );
  const succeeded = (tSec, attemptNumber) => (
    action(tSec, 'intubation_attempt_succeeded', { attemptNumber })
  );
  const cricoid = (tSec) => action(tSec, 'cricoid_pressure_applied');
  const ppv = (tSec) => action(tSec, 'mask_ppv_started', {
    airwayDevice: 'mask', minuteVentilation: 6, cricoidPressure: true,
  });
  const ppvCompleted = (tSec) => action(tSec, 'mask_ppv_completed');

  test('a later complete rescue cannot erase an earlier missed or partial segment', () => {
    const missedThenRescued = [
      failed(1, 1),
      attemptStarted(2, 2),
      failed(3, 2),
      cricoid(4),
      ppv(5),
      attemptStarted(6, 3),
      succeeded(7, 3),
    ];
    const partialThenComplete = [
      failed(1, 1),
      cricoid(2),
      attemptStarted(3, 2),
      failed(4, 2),
      ppv(5),
      attemptStarted(6, 3),
      succeeded(7, 3),
    ];
    const allComplete = [
      failed(1, 1),
      cricoid(2),
      ppv(3),
      attemptStarted(4, 2),
      failed(5, 2),
      ppv(6),
      attemptStarted(7, 3),
      succeeded(8, 3),
    ];

    expect(evaluate('rsi_failed_attempt_ppv_with_cricoid', {
      actions: missedThenRescued,
    })).toMatchObject({ status: 'not_performed', points: 0 });
    expect(evaluate('rsi_failed_attempt_ppv_with_cricoid', {
      actions: partialThenComplete,
    })).toMatchObject({ status: 'partial', points: 1 });
    expect(evaluate('rsi_failed_attempt_ppv_with_cricoid', {
      actions: allComplete,
    })).toMatchObject({ status: 'performed', points: 2 });
  });

  test('keeps item 28 action-only and gives item 41 measured oxygenation and progression evidence', () => {
    const actions = [
      failed(1, 1),
      cricoid(2),
      ppv(3),
      attemptStarted(5, 2),
      failed(6, 2),
      ppv(7),
      attemptStarted(9, 3),
      succeeded(10, 3),
    ];
    const trace = [
      { t: 1, spo2: 98 }, { t: 2, spo2: 94 }, { t: 3, spo2: 95 }, { t: 4, spo2: 98 },
      { t: 6, spo2: 97 }, { t: 7, spo2: 95 }, { t: 8, spo2: 98 },
    ];

    const item28 = evaluate('rsi_failed_attempt_ppv_with_cricoid', { actions, trace });
    const item41 = evaluate('rsi_appropriate_failed_attempt_intervention', { actions, trace });

    expect(item28).toMatchObject({ status: 'performed', points: 2 });
    expect(item28.evidence.trace).toEqual([]);
    expect(item28.evidence.segments).toHaveLength(2);
    expect(item41).toMatchObject({
      status: 'performed',
      points: 2,
      evidence: {
        segments: [
          {
            failureAttemptNumber: 1,
            preRescueSpO2: 95,
            nadirSpO2: 94,
            postRescueSpO2: 98,
            oxygenationRecovered: true,
            nextAttemptNumber: 2,
            nextAttemptOutcome: 'failed',
          },
          {
            failureAttemptNumber: 2,
            preRescueSpO2: 95,
            nadirSpO2: 95,
            postRescueSpO2: 98,
            oxygenationRecovered: true,
            nextAttemptNumber: 3,
            nextAttemptOutcome: 'succeeded',
          },
        ],
      },
    });
    expect(item41.evidence.trace.length).toBeGreaterThan(0);
    expect(item41.evidence).not.toEqual(item28.evidence);
  });

  test('keeps a lone failed-attempt rescue window open live and closes it at finalization', () => {
    const failureOnly = [failed(1, 1)];
    const completeRescueWithoutTrace = [
      failed(1, 1), cricoid(2), ppv(3), attemptStarted(4, 2), succeeded(5, 2),
    ];

    for (const ruleId of [
      'rsi_failed_attempt_ppv_with_cricoid',
      'rsi_appropriate_failed_attempt_intervention',
    ]) {
      expect(evaluate(ruleId, { actions: failureOnly })).toMatchObject({
        status: 'pending',
        points: null,
        evidence: {
          conditionTriggered: true,
          segments: [{ segmentOpen: true, rescueStatus: 'pending' }],
        },
      });
      expect(evaluate(ruleId, { actions: failureOnly, finalized: true })).toMatchObject({
        status: 'not_performed',
        points: 0,
        evidence: {
          conditionTriggered: true,
          segments: [{ segmentOpen: false, rescueStatus: 'not_performed' }],
        },
      });
      expect(evaluate(ruleId)).toMatchObject({
        status: 'pending', points: null,
      });
      expect(evaluate(ruleId, { finalized: true })).toMatchObject({
        status: 'performed', points: 2, evidence: { conditionTriggered: false },
      });
    }
    expect(evaluate('rsi_failed_attempt_ppv_with_cricoid', {
      actions: completeRescueWithoutTrace,
    })).toMatchObject({ status: 'performed', points: 2 });
    expect(evaluate('rsi_appropriate_failed_attempt_intervention', {
      actions: completeRescueWithoutTrace,
    })).toMatchObject({ status: 'partial', points: 1 });
  });

  test('closes untouched rescue segments on reattempt and preserves an earlier omission', () => {
    const failureThenAttempt = [failed(1, 1), attemptStarted(2, 2)];
    const earlierOmissionThenOpen = [
      failed(1, 1), attemptStarted(2, 2), failed(3, 2),
    ];

    for (const ruleId of [
      'rsi_failed_attempt_ppv_with_cricoid',
      'rsi_appropriate_failed_attempt_intervention',
    ]) {
      expect(evaluate(ruleId, { actions: failureThenAttempt })).toMatchObject({
        status: 'not_performed', points: 0,
      });
      expect(evaluate(ruleId, { actions: earlierOmissionThenOpen })).toMatchObject({
        status: 'not_performed',
        points: 0,
        evidence: {
          segments: [
            { segmentOpen: false, rescueStatus: 'not_performed' },
            { segmentOpen: true, rescueStatus: 'pending' },
          ],
        },
      });
    }
  });

  test('scores open partial rescue as partial and closed complete rescue as performed', () => {
    const openPartial = [failed(1, 1), cricoid(2)];
    const closedComplete = [
      failed(1, 1), cricoid(2), ppv(3), attemptStarted(5, 2), succeeded(6, 2),
    ];
    const recoveryTrace = [
      { t: 1, spo2: 98 }, { t: 2, spo2: 94 }, { t: 3, spo2: 95 }, { t: 4, spo2: 98 },
    ];

    for (const ruleId of [
      'rsi_failed_attempt_ppv_with_cricoid',
      'rsi_appropriate_failed_attempt_intervention',
    ]) {
      expect(evaluate(ruleId, { actions: openPartial })).toMatchObject({
        status: 'partial',
        points: 1,
        evidence: { segments: [{ segmentOpen: true, rescueStatus: 'partial' }] },
      });
    }
    expect(evaluate('rsi_failed_attempt_ppv_with_cricoid', {
      actions: closedComplete,
    })).toMatchObject({ status: 'performed', points: 2 });
    expect(evaluate('rsi_appropriate_failed_attempt_intervention', {
      actions: closedComplete, trace: recoveryTrace,
    })).toMatchObject({ status: 'performed', points: 2 });
  });

  test('does not reuse one SpO2 sample as both pre- and post-rescue evidence', () => {
    const actions = [
      failed(1, 1), cricoid(2), ppv(3), attemptStarted(6, 2), succeeded(7, 2),
    ];

    const result = evaluate('rsi_appropriate_failed_attempt_intervention', {
      actions,
      trace: [{ t: 3, spo2: 98 }],
    });

    expect(result).toMatchObject({
      status: 'partial',
      points: 1,
      evidence: {
        segments: [{
          preRescueSpO2: 98,
          preRescueTraceIndex: 0,
          preRescueT: 3,
          nadirSpO2: 98,
          nadirTraceIndex: 0,
          nadirT: 3,
          postRescueSpO2: null,
          postRescueTraceIndex: null,
          postRescueT: null,
          oxygenationRecovered: false,
          oxygenationMaintained: false,
        }],
      },
    });
  });

  test('accepts distinct post-rescue evidence that maintained baseline oxygenation', () => {
    const actions = [
      failed(1, 1), cricoid(2), ppv(3), attemptStarted(6, 2), succeeded(7, 2),
    ];

    const result = evaluate('rsi_appropriate_failed_attempt_intervention', {
      actions,
      trace: [{ t: 2, spo2: 98 }, { t: 4, spo2: 98 }],
    });

    expect(result).toMatchObject({
      status: 'performed',
      points: 2,
      evidence: {
        segments: [{
          preRescueSpO2: 98,
          preRescueTraceIndex: 0,
          preRescueT: 2,
          postRescueSpO2: 98,
          postRescueTraceIndex: 1,
          postRescueT: 4,
          oxygenationRecovered: false,
          oxygenationMaintained: true,
        }],
      },
    });
  });

  test('prefers a post-completion SpO2 sample and reports delta recovery separately', () => {
    const actions = [
      failed(1, 1), cricoid(2), ppv(3), ppvCompleted(4),
      attemptStarted(6, 2), succeeded(7, 2),
    ];

    const result = evaluate('rsi_appropriate_failed_attempt_intervention', {
      actions,
      trace: [
        { t: 3, spo2: 98 }, { t: 4, spo2: 92 }, { t: 5, spo2: 95 },
      ],
    });

    expect(result).toMatchObject({
      status: 'performed',
      points: 2,
      evidence: {
        segments: [{
          preRescueSpO2: 98,
          preRescueTraceIndex: 0,
          preRescueT: 3,
          nadirSpO2: 92,
          nadirTraceIndex: 1,
          nadirT: 4,
          postRescueSpO2: 95,
          postRescueTraceIndex: 2,
          postRescueT: 5,
          oxygenationRecovered: true,
          oxygenationMaintained: false,
        }],
      },
    });
  });

  test('keeps a closed rescue partial when no distinct post-rescue sample exists', () => {
    const actions = [
      failed(1, 1), cricoid(2), ppv(3), attemptStarted(6, 2), succeeded(7, 2),
    ];

    const result = evaluate('rsi_appropriate_failed_attempt_intervention', {
      actions,
      trace: [{ t: 2, spo2: 97 }],
    });

    expect(result).toMatchObject({
      status: 'partial',
      points: 1,
      evidence: {
        segments: [{
          preRescueTraceIndex: 0,
          preRescueT: 2,
          postRescueSpO2: null,
          postRescueTraceIndex: null,
          postRescueT: null,
          oxygenationRecovered: false,
          oxygenationMaintained: false,
        }],
      },
    });
  });

  test('requires item 41 to progress to a later numbered attempt with a timely outcome', () => {
    const trace = [
      { t: 1, spo2: 98 }, { t: 2, spo2: 95 }, { t: 3, spo2: 98 },
    ];
    const repeatedAttemptNumber = [
      failed(1, 1), cricoid(2), ppv(2), attemptStarted(4, 1), succeeded(5, 1),
    ];
    const outcomeAfterAnotherAttempt = [
      failed(1, 1), cricoid(2), ppv(2), attemptStarted(4, 2),
      attemptStarted(5, 3), succeeded(6, 2),
    ];

    expect(evaluate('rsi_appropriate_failed_attempt_intervention', {
      actions: repeatedAttemptNumber, trace,
    })).toMatchObject({ status: 'partial', points: 1 });
    expect(evaluate('rsi_appropriate_failed_attempt_intervention', {
      actions: outcomeAfterAnotherAttempt, trace,
    })).toMatchObject({ status: 'partial', points: 1 });
  });

  test('uses actual runner SpO2 and outcome records for an appropriate rescue', () => {
    const bridge = createRunnerBridge(rsiRaw);
    bridge.runner.configureIntubationAttempts({
      failedIntubationAttempts: [1], attemptDurationSeconds: 1,
    });
    bridge.runner.attemptIntubation();
    bridge.sync('intubation_attempt_started');
    advanceRunner(bridge.runner, 1);
    bridge.sync('intubation_attempt_failed');
    const before = bridge.trace(1);
    bridge.runner.applyCricoidPressure();
    bridge.sync('cricoid_pressure_applied');
    bridge.runner.deliverMaskVentilation({
      durationSeconds: 1, tidalVolumeMl: 500, respiratoryRate: 12, cricoidPressure: true,
    });
    bridge.sync('mask_ppv_started');
    advanceRunner(bridge.runner, 1);
    bridge.sync('mask_ppv_completed');
    const after = bridge.trace(2);
    advanceRunner(bridge.runner, 1);
    bridge.trace(3);
    bridge.runner.attemptIntubation();
    bridge.sync('intubation_attempt_started');
    advanceRunner(bridge.runner, 1);
    bridge.sync('intubation_attempt_succeeded');

    const result = bridge.session.getLiveResult().items.find(({ id }) => id === 'rsi-41');
    expect(before.spo2).toBeGreaterThan(0);
    expect(after.spo2).toBeGreaterThan(0);
    expect(result).toMatchObject({
      status: 'performed', points: 2,
      evidence: {
        conditionTriggered: true,
        segments: [{ nextAttemptNumber: 2, nextAttemptOutcome: 'succeeded' }],
      },
    });
  });
});

describe('live rubric violation flags', () => {
  function violationsFor(rubric, actions, criteria = CRITERIA) {
    const trigger = actions.at(-1);
    return detectRubricViolations({ rubric, action: trigger, actions, trace: [], criteria });
  }

  const violationPairs = [
    {
      name: 'Standard item 7 at first NMB',
      rubric: standardRaw,
      bad: [action(1, 'drug', { drug: 'Rocuronium', doseMg: 50 })],
      good: [
        action(0, 'mask_ppv_started', { airwayDevice: 'mask', minuteVentilation: 6 }),
        action(1, 'drug', { drug: 'Rocuronium', doseMg: 50 }),
      ],
      itemId: 'standard-7',
    },
    {
      name: 'RSI item 11 at PPV before laryngoscopy',
      rubric: rsiRaw,
      bad: [action(1, 'mask_ppv_started', { airwayDevice: 'mask', minuteVentilation: 6 })],
      good: [
        action(0, 'intubation_attempt_started', { attemptNumber: 1 }),
        action(1, 'mask_ppv_started', { airwayDevice: 'mask', minuteVentilation: 6 }),
      ],
      itemId: 'rsi-11',
    },
    {
      name: 'Emergence item 3 at extubation without adequate TOF',
      rubric: emergenceRaw,
      bad: [
        action(0, 'tof_checked', { ratio: 0.7 }),
        action(0, 'spontaneous_ventilation_assessed', {
          spontaneousRR: 10, spontaneousTV: 400, spontaneousMV: 4.2,
        }),
        action(1, 'extubate'),
      ],
      good: [
        action(0, 'tof_checked', { ratio: 0.95 }),
        action(0, 'spontaneous_ventilation_assessed', {
          spontaneousRR: 10, spontaneousTV: 400, spontaneousMV: 4.2,
        }),
        action(1, 'extubate'),
      ],
      itemId: 'emergence-3',
    },
    {
      name: 'Emergence item 4 at extubation without adequate spontaneous ventilation',
      rubric: emergenceRaw,
      bad: [action(0, 'tof_checked', { ratio: 0.95 }), action(1, 'extubate')],
      good: [
        action(0, 'tof_checked', { ratio: 0.95 }),
        action(0, 'spontaneous_ventilation_assessed', {
          spontaneousRR: 10, spontaneousTV: 400, spontaneousMV: 4.2,
        }),
        action(1, 'extubate'),
      ],
      itemId: 'emergence-4',
    },
    {
      name: 'RSI item 42 when attempt three starts',
      rubric: rsiRaw,
      bad: [action(1, 'intubation_attempt_started', { attemptNumber: 3 })],
      good: [action(1, 'intubation_attempt_started', { attemptNumber: 2 })],
      itemId: 'rsi-42',
    },
  ];

  test.each(violationPairs)('$name flags only the noncompliant run', ({
    rubric, bad, good, itemId,
  }) => {
    const flags = violationsFor(rubric, bad);
    const item = rubric.items.find(({ id }) => id === itemId);
    expect(flags).toEqual([expect.objectContaining({
      rubricId: rubric.id,
      itemId,
      displayNumber: item.displayNumber,
      text: item.text,
      tSec: bad.at(-1).tSec,
      triggerAction: bad.at(-1).action,
      evidence: expect.objectContaining({ actions: expect.any(Array) }),
    })]);
    expect(Object.isFrozen(flags)).toBe(true);
    expect(Object.isFrozen(flags[0].evidence)).toBe(true);
    expect(violationsFor(rubric, good)).toEqual([]);
  });

  test.each([
    [standardRaw, 'standard-5'],
    [rsiRaw, 'rsi-7'],
  ])('flags literal preoxygenation item %s at first induction drug without 180 seconds', (
    rubric, itemId,
  ) => {
    const session = new RubricScoringSession({ rubric, criteria: CRITERIA });
    session.recordAction({
      tSec: 1, action: 'drug', meta: { drug: 'Propofol', doseMg: 100 },
    });
    const item = rubric.items.find(({ id }) => id === itemId);
    expect(session.getLiveResult().violations).toEqual([
      expect.objectContaining({ itemId, text: item.text }),
    ]);
    if (itemId === 'standard-5') {
      expect(session.getItemStatus(itemId)).toMatchObject({ status: 'pending', points: null });
    }

    const induction = action(180, 'drug', { drug: 'Propofol', doseMg: 100 });
    const compliant = detectRubricViolations({
      rubric,
      action: induction,
      actions: [induction],
      trace: preoxygenationTrace(0, 179),
      criteria: CRITERIA,
    });
    expect(compliant.filter((flag) => flag.itemId === itemId)).toEqual([]);
  });

  test('deduplicates one triggering action, preserves separate triggers, and ignores score actions', () => {
    const session = new RubricScoringSession({ rubric: rsiRaw, criteria: CRITERIA });
    session.recordAction({
      tSec: 1,
      action: 'mask_ppv_started',
      meta: { airwayDevice: 'mask', minuteVentilation: 6 },
    });
    const first = session.getLiveResult();
    expect(first.violations.filter(({ itemId }) => itemId === 'rsi-11')).toHaveLength(1);
    expect(session.getLiveResult()).toBe(first);

    session.recordAction({
      tSec: 2,
      action: 'mask_ppv_started',
      meta: { airwayDevice: 'mask', minuteVentilation: 6 },
    });
    expect(session.getLiveResult().violations.filter(({ itemId }) => itemId === 'rsi-11'))
      .toHaveLength(2);

    const instructor = session.rubric.items.find(
      ({ scoringSource }) => scoringSource === 'INSTRUCTOR_OBSERVED',
    );
    session.setInstructorScore({ itemId: instructor.id, points: 2, tSec: 3 });
    expect(session.getLiveResult().violations.filter(({ itemId }) => itemId === 'rsi-11'))
      .toHaveLength(2);
  });
});
