import { describe, expect, test } from 'vitest';
import emergenceRaw from '../../data/rubrics/carson-newman-anesthesia-emergence.json';
import rsiRaw from '../../data/rubrics/carson-newman-rsi-induction.json';
import standardRaw from '../../data/rubrics/carson-newman-standard-iv-induction.json';
import {
  RUBRIC_RULES,
  RubricScoringSession,
  detectRubricViolations,
  evaluateRubricItem,
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

const RESCUE_ACTIONS = [
  action(1, 'intubation_attempt_failed', { attemptNumber: 1 }),
  action(2, 'cricoid_pressure_applied'),
  action(3, 'mask_ppv_started', {
    airwayDevice: 'mask', minuteVentilation: 6, cricoidPressure: true,
  }),
  action(4, 'intubation_attempt_started', { attemptNumber: 2 }),
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

  test('validates named criteria overrides when constructing a scoring session', () => {
    expect(() => new RubricScoringSession({
      rubric: rsiRaw,
      criteria: { ...CRITERIA, etco2ConfirmationSamples: 2.5 },
    })).toThrow(/etco2ConfirmationSamples/);
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
      performed: { actions: RESCUE_ACTIONS },
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

    const compliant = detectRubricViolations({
      rubric,
      action: action(180, 'drug', { drug: 'Propofol', doseMg: 100 }),
      actions: [action(180, 'drug', { drug: 'Propofol', doseMg: 100 })],
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
