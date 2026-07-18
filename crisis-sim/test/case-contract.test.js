import { describe, expect, test } from 'vitest';
import {
  CASE_EFFECT_TYPES,
  CASE_STAGES,
  normalizeCaseExperience,
} from '../sim/scenario/caseContract.js';
import { makeCaseExperience, makeCaseScenario } from './helpers/caseFixtures.js';

const EXPECTED_CASE_STAGES = [
  'chart_review',
  'interview',
  'focused_exam',
  'findings_summary',
  'plan_submission',
  'live_simulation',
  'appropriately_deferred',
  'debrief_draft',
  'debrief_finalized',
  'debrief_revision',
];

const EXPECTED_EFFECT_TYPES = [
  'set_surgical_stimulus',
  'inject_complication',
  'set_forced_apnea',
  'set_machine',
];

function expectDeeplyFrozen(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  expect(Object.isFrozen(value)).toBe(true);
  for (const nested of Object.values(value)) expectDeeplyFrozen(nested, seen);
}

function withMutation(mutate) {
  const definition = makeCaseExperience();
  mutate(definition);
  return definition;
}

function firstEvent(definition) {
  return definition.eventFlow.events[0];
}

describe('case experience normalization', () => {
  test('returns null when a legacy scenario has no case experience', () => {
    expect(normalizeCaseExperience({})).toBeNull();
    expect(normalizeCaseExperience({ id: 'legacy', events: [] })).toBeNull();
    expect(normalizeCaseExperience({ caseExperience: null })).toBeNull();
  });

  test('copies a valid definition, preserves stable order, and freezes every container', () => {
    const caller = makeCaseExperience();
    const normalized = normalizeCaseExperience(caller);
    const beforeCallerMutation = structuredClone(normalized);

    expect(normalized).not.toBe(caller);
    expect(normalized).toMatchObject({ version: 1 });
    expect(normalized.assessment.stages).toEqual([
      'chart_review', 'interview', 'focused_exam', 'findings_summary',
    ]);
    expect(CASE_STAGES).toEqual(EXPECTED_CASE_STAGES);
    expect(CASE_EFFECT_TYPES).toEqual(EXPECTED_EFFECT_TYPES);
    expect(Object.isFrozen(CASE_STAGES)).toBe(true);
    expect(Object.isFrozen(CASE_EFFECT_TYPES)).toBe(true);
    expectDeeplyFrozen(normalized);

    caller.assessment.stages.reverse();
    caller.assessment.actions[0].response = 'Changed by caller';
    caller.eventFlow.events[0].guidanceIds.length = 0;
    caller.debrief.teachingItems[0].explanation = 'Changed by caller';

    expect(normalized).toEqual(beforeCallerMutation);
    expect(() => { normalized.version = 2; }).toThrow(TypeError);
    expect(() => { normalized.assessment.stages.push('debrief_finalized'); }).toThrow(TypeError);
    expect(() => { normalized.learnerChart.patient.ageYears = 99; }).toThrow(TypeError);
    expect(normalizeCaseExperience(makeCaseExperience())).toEqual(beforeCallerMutation);
  });

  test('accepts a complete scenario object and extracts only its case experience', () => {
    const scenario = makeCaseScenario();
    const normalized = normalizeCaseExperience(scenario);

    expect(normalized).toEqual(normalizeCaseExperience(scenario.caseExperience));
    expect(normalized).not.toHaveProperty('id', scenario.id);
    expect(Object.isFrozen(normalized)).toBe(true);
  });

  test('rejects a partial case instead of filling a misleading default contract', () => {
    expect(() => normalizeCaseExperience({ learnerChart: {} }))
      .toThrow(/complete case experience/i);
    expect(() => normalizeCaseExperience({
      caseExperience: { ...makeCaseExperience(), instructorGuide: undefined },
    })).toThrow(/complete case experience|JSON-safe/i);
  });
});

describe('stable identifiers and references', () => {
  test.each([
    ['assessment action', (value) => value.assessment.actions.push(
      structuredClone(value.assessment.actions[0]),
    )],
    ['finding', (value) => value.assessment.findings.push(
      structuredClone(value.assessment.findings[0]),
    )],
    ['assessment scoring rule', (value) => value.assessment.scoringRules.push(
      structuredClone(value.assessment.scoringRules[0]),
    )],
    ['plan field', (value) => value.planRequirements.fields.push(
      structuredClone(value.planRequirements.fields[0]),
    )],
    ['plan scoring rule', (value) => value.planRequirements.rules.push(
      structuredClone(value.planRequirements.rules[0]),
    )],
    ['phase', (value) => value.eventFlow.phases.push(
      structuredClone(value.eventFlow.phases[0]),
    )],
    ['event', (value) => value.eventFlow.events.push(
      structuredClone(value.eventFlow.events[0]),
    )],
    ['consideration', (value) => value.instructorGuide.considerations.push(
      structuredClone(value.instructorGuide.considerations[0]),
    )],
    ['teaching item', (value) => value.debrief.teachingItems.push(
      structuredClone(value.debrief.teachingItems[0]),
    )],
  ])('rejects a duplicate %s id', (_label, mutate) => {
    expect(() => normalizeCaseExperience(withMutation(mutate))).toThrow(/duplicate/i);
  });

  test.each([
    [
      'prerequisite action',
      (value) => { value.assessment.actions[0].prerequisites = ['missing_action']; },
      /prerequisite|action/i,
    ],
    [
      'revealed finding',
      (value) => { value.assessment.actions[0].reveals = ['missing_finding']; },
      /finding/i,
    ],
    [
      'assessment scoring rule',
      (value) => { value.assessment.actions[0].scoringRuleId = 'missing_rule'; },
      /scoring rule/i,
    ],
    [
      'plan field',
      (value) => { value.planRequirements.rules[0].evidence.fieldId = 'missing_field'; },
      /plan field/i,
    ],
    [
      'phase',
      (value) => { value.eventFlow.events[0].phaseId = 'missing_phase'; },
      /phase/i,
    ],
    [
      'event',
      (value) => {
        value.eventFlow.phases[0].completionWhen = {
          type: 'event_fired', eventId: 'missing_event',
        };
      },
      /event/i,
    ],
    [
      'guidance',
      (value) => { value.eventFlow.events[0].guidanceIds = ['missing_guidance']; },
      /guidance/i,
    ],
    [
      'branch',
      (value) => {
        value.eventFlow.phases[0].completionWhen = {
          type: 'branch_activated', branchId: 'missing_branch',
        };
      },
      /branch/i,
    ],
    [
      'debrief teaching item',
      (value) => { value.eventFlow.events[0].debriefIds = ['missing_teaching']; },
      /debrief|teaching/i,
    ],
  ])('rejects an unknown %s reference', (_label, mutate, category) => {
    expect(() => normalizeCaseExperience(withMutation(mutate))).toThrow(category);
  });

  test('rejects phases that cannot be reached from the initial phase', () => {
    const definition = withMutation((value) => {
      value.eventFlow.phases.push({
        id: 'orphan',
        title: 'Orphan phase',
        enterWhen: { type: 'load' },
        events: [],
        completionWhen: { type: 'instructor_advance' },
        allowedInstructorControls: ['advance'],
      });
    });

    expect(() => normalizeCaseExperience(definition))
      .toThrow(/unreachable.*phase|phase.*unreachable/i);
  });
});

describe('event flow grammar', () => {
  test.each([
    ['fixed time', { type: 'fixed_time', atSec: 0.02 }],
    ['phase time', { type: 'phase_time', atSec: 0.04 }],
    ['accepted action', { type: 'action', action: 'drug', match: { drug: 'Propofol' } }],
    ['submitted plan', { type: 'plan', fieldId: 'disposition', equals: 'proceed' }],
    [
      'physiology threshold',
      {
        type: 'physiology',
        key: 'spo2',
        operator: '<=',
        value: 90,
        dwellSec: 0.04,
        resetDelta: 2,
      },
    ],
    ['instructor activation', { type: 'instructor' }],
    ['phase entry', { type: 'phase_enter' }],
  ])('accepts the %s trigger', (_label, trigger) => {
    const definition = withMutation((value) => { firstEvent(value).trigger = trigger; });
    expect(() => normalizeCaseExperience(definition)).not.toThrow();
  });

  test.each(['<', '<=', '>', '>=', '=='])(
    'accepts the %s physiology comparator',
    (operator) => {
      const definition = withMutation((value) => {
        firstEvent(value).trigger = {
          type: 'physiology', key: 'etco2', operator, value: 45, dwellSec: 0, resetDelta: 1,
        };
      });
      expect(() => normalizeCaseExperience(definition)).not.toThrow();
    },
  );

  test.each([
    ['missing trigger type', {}, /trigger/i],
    ['unknown trigger type', { type: 'wall_clock' }, /trigger/i],
    ['fixed time without a time', { type: 'fixed_time' }, /trigger|time|atSec/i],
    ['phase time without a time', { type: 'phase_time' }, /trigger|time|atSec/i],
    ['action without an action name', { type: 'action', match: {} }, /trigger|action/i],
    ['action with a non-object match', { type: 'action', action: 'drug', match: [] }, /match|plain object/i],
    ['plan without a field', { type: 'plan', equals: 'proceed' }, /trigger|plan|field/i],
    ['plan without an expected value', { type: 'plan', fieldId: 'disposition' }, /trigger|plan|equals/i],
    [
      'physiology without threshold shape',
      { type: 'physiology', key: 'spo2', operator: '<=', value: 90 },
      /trigger|physiology|dwell|reset/i,
    ],
    [
      'unknown physiology comparator',
      {
        type: 'physiology', key: 'spo2', operator: '!=', value: 90, dwellSec: 0, resetDelta: 2,
      },
      /operator|comparator|physiology/i,
    ],
    [
      'nonfinite physiology threshold',
      {
        type: 'physiology', key: 'spo2', operator: '<', value: Infinity, dwellSec: 0, resetDelta: 2,
      },
      /finite|JSON-safe|physiology/i,
    ],
    [
      'negative physiology reset delta',
      {
        type: 'physiology', key: 'spo2', operator: '<', value: 90, dwellSec: 0, resetDelta: -1,
      },
      /reset|nonnegative|physiology/i,
    ],
  ])('rejects %s', (_label, trigger, category) => {
    const definition = withMutation((value) => { firstEvent(value).trigger = trigger; });
    expect(() => normalizeCaseExperience(definition)).toThrow(category);
  });

  test.each([
    [
      'negative fixed time',
      (value) => { firstEvent(value).trigger = { type: 'fixed_time', atSec: -0.02 }; },
    ],
    [
      'unaligned fixed time',
      (value) => { firstEvent(value).trigger = { type: 'fixed_time', atSec: 0.01 }; },
    ],
    [
      'nonfinite phase time',
      (value) => { firstEvent(value).trigger = { type: 'phase_time', atSec: NaN }; },
    ],
    [
      'string phase time',
      (value) => { firstEvent(value).trigger = { type: 'phase_time', atSec: '0.02' }; },
    ],
    [
      'negative event response window',
      (value) => { firstEvent(value).responseWindowSec = -0.02; },
    ],
    [
      'unaligned guidance response window',
      (value) => { value.instructorGuide.considerations[0].responseWindowSec = 0.01; },
    ],
    [
      'unaligned physiology dwell',
      (value) => {
        firstEvent(value).trigger = {
          type: 'physiology', key: 'spo2', operator: '<', value: 90, dwellSec: 0.03, resetDelta: 2,
        };
      },
    ],
  ])('requires finite, nonnegative, 0.02-second alignment for %s', (_label, mutate) => {
    expect(() => normalizeCaseExperience(withMutation(mutate)))
      .toThrow(/finite|nonnegative|fixed-step|align|0\.02|time|window|dwell|JSON-safe/i);
  });

  test.each(['pause', 'resume', 'advance', 'activate_branch', 'activate_event'])(
    'accepts the %s instructor control',
    (control) => {
      const definition = withMutation((value) => {
        value.eventFlow.phases[0].allowedInstructorControls = [control];
      });
      expect(() => normalizeCaseExperience(definition)).not.toThrow();
    },
  );

  test('rejects an instructor control outside the explicit allowlist', () => {
    const definition = withMutation((value) => {
      value.eventFlow.phases[0].allowedInstructorControls = ['set_spo2'];
    });
    expect(() => normalizeCaseExperience(definition)).toThrow(/control/i);
  });
});

describe('modeled event effects', () => {
  test.each([
    ['surgical stimulus', { type: 'set_surgical_stimulus', intensity: 0.5 }],
    [
      'complication injection',
      { type: 'inject_complication', complicationType: 'Bronchospasm', description: 'Fixture' },
    ],
    ['forced apnea', { type: 'set_forced_apnea', active: true }],
    ['machine input', { type: 'set_machine', patch: { setFiO2: 1 } }],
  ])('accepts the allowlisted %s effect', (_label, effect) => {
    const definition = withMutation((value) => { firstEvent(value).effect = effect; });
    expect(() => normalizeCaseExperience(definition)).not.toThrow();
  });

  test('rejects an effect type outside the modeled-input allowlist', () => {
    const definition = withMutation((value) => {
      firstEvent(value).effect = { type: 'set_vitals', spo2: 80 };
    });
    expect(() => normalizeCaseExperience(definition))
      .toThrow(/unsupported.*effect|effect type|modeled.*input/i);
  });

  test('rejects direct and embedded derived-vital writes', () => {
    const derivedKeys = [
      'hr', 'sbp', 'dbp', 'map', 'spo2', 'rr', 'etco2', 'temp', 'tof', 'tofRatio',
    ];

    for (const key of derivedKeys) {
      const direct = withMutation((value) => {
        firstEvent(value).effect = { type: 'set_machine', [key]: 1 };
      });
      expect(() => normalizeCaseExperience(direct), `direct ${key}`)
        .toThrow(/derived vital|vital.*effect|modeled.*input|machine/i);

      const embedded = withMutation((value) => {
        firstEvent(value).effect = { type: 'set_machine', patch: { nested: { [key]: 1 } } };
      });
      expect(() => normalizeCaseExperience(embedded), `embedded ${key}`)
        .toThrow(/derived vital|vital.*effect|modeled.*input|machine/i);
    }
  });

  test.each([
    'baselineHR',
    'baselineSystolic',
    'baselineDiastolic',
    'baselineSpO2',
    'baselineRR',
    'baselineTemp',
    'baselineEtCO2',
    'baselineTofRatio',
  ])('rejects the %s baseline-vital setter in an effect', (key) => {
    const definition = withMutation((value) => {
      firstEvent(value).effect = { type: 'set_machine', patch: { [key]: 1 } };
    });
    expect(() => normalizeCaseExperience(definition))
      .toThrow(/baseline|derived vital|vital.*effect|modeled.*input|machine/i);
  });
});

describe('confidentiality and strict JSON-safe input', () => {
  test.each(['instructorNotes', 'answerKey', 'expectedResponse', 'scoringGuidance'])(
    'rejects reserved learner-chart key %s',
    (key) => {
      const definition = withMutation((value) => {
        value.learnerChart.patient[key] = 'concealed answer';
      });
      expect(() => normalizeCaseExperience(definition))
        .toThrow(/learner.?chart|reserved|instructor|answer|guidance/i);
    },
  );

  test('rejects an accessor without invoking it', () => {
    let getterCalls = 0;
    const definition = makeCaseExperience();
    Object.defineProperty(definition.assessment.actions[0], 'trap', {
      enumerable: true,
      get() {
        getterCalls += 1;
        return 'unsafe';
      },
    });

    expect(() => normalizeCaseExperience(definition))
      .toThrow(/accessor|data propert|JSON-safe/i);
    expect(getterCalls).toBe(0);
  });

  test('rejects symbol keys', () => {
    const definition = makeCaseExperience();
    definition.assessment[Symbol('answer')] = true;
    expect(() => normalizeCaseExperience(definition))
      .toThrow(/symbol|string keys|JSON-safe/i);
  });

  test('rejects sparse arrays', () => {
    const definition = makeCaseExperience();
    definition.learnerChart.documents = new Array(1);
    expect(() => normalizeCaseExperience(definition))
      .toThrow(/sparse|dense|JSON-safe/i);
  });

  test('rejects cyclic input', () => {
    const definition = makeCaseExperience();
    definition.learnerChart.self = definition;
    expect(() => normalizeCaseExperience(definition)).toThrow(/cycle|cyclic/i);
  });

  test.each(['__proto__', 'constructor', 'prototype'])(
    'rejects an own %s key',
    (key) => {
      const definition = makeCaseExperience();
      Object.defineProperty(definition.learnerChart.patient, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 'unsafe',
      });
      expect(() => normalizeCaseExperience(definition))
        .toThrow(/unsafe|prototype|constructor|JSON-safe/i);
    },
  );

  test.each([NaN, Infinity, -Infinity])('rejects nonfinite number %s', (number) => {
    const definition = makeCaseExperience();
    definition.learnerChart.patient.ageYears = number;
    expect(() => normalizeCaseExperience(definition)).toThrow(/finite|JSON-safe/i);
  });

  test('rejects Date instances, class instances, and objects with custom prototypes', () => {
    class ConcealedAnswer {
      constructor() {
        this.value = 'unsafe';
      }
    }

    const dateValue = withMutation((value) => {
      value.learnerChart.documents.push(new Date('2026-07-18T00:00:00Z'));
    });
    expect(() => normalizeCaseExperience(dateValue)).toThrow(/plain object|JSON-safe/i);

    const classValue = withMutation((value) => {
      value.learnerChart.documents.push(new ConcealedAnswer());
    });
    expect(() => normalizeCaseExperience(classValue)).toThrow(/plain object|JSON-safe/i);

    const customPrototypeValue = makeCaseExperience();
    customPrototypeValue.learnerChart.patient = Object.assign(
      Object.create({ inherited: true }),
      customPrototypeValue.learnerChart.patient,
    );
    expect(() => normalizeCaseExperience(customPrototypeValue))
      .toThrow(/plain object|JSON-safe/i);
  });
});
