import { describe, expect, test, vi } from 'vitest';
import { normalizeCaseExperience } from '../sim/scenario/caseContract.js';
import { CaseFlowSession } from '../sim/scenario/caseFlowSession.js';
import { CaseSession } from '../sim/scenario/caseSession.js';
import { makeCaseEventFlow, makeCaseExperience } from './helpers/caseFixtures.js';

function event({
  id,
  phaseId = 'preop',
  trigger,
  repeatable = false,
  responseWindowSec = 0,
  effect = null,
  guidanceIds = [],
  debriefIds = [],
} = {}) {
  return {
    id,
    phaseId,
    trigger,
    repeatable,
    responseWindowSec,
    expectedResponses: [],
    unsafeResponses: [],
    effect,
    guidanceIds,
    debriefIds,
  };
}

function phase({
  id,
  title = id,
  events = [],
  completionWhen = { type: 'instructor_advance' },
  allowedInstructorControls = ['pause', 'resume', 'advance', 'activate_branch', 'activate_event'],
} = {}) {
  return {
    id,
    title,
    enterWhen: { type: 'load' },
    events,
    completionWhen,
    allowedInstructorControls,
  };
}

function flowDefinition({ phases, events, branches = [], initialPhaseId = phases[0].id }) {
  return { initialPhaseId, phases, events, branches };
}

function makeTriggerFlow() {
  const events = [
    event({ id: 'assessment_ready', trigger: { type: 'phase_enter' } }),
    event({ id: 'fixed_one', trigger: { type: 'fixed_time', atSec: 1 } }),
    event({ id: 'phase_two', trigger: { type: 'phase_time', atSec: 2 } }),
    event({
      id: 'induction_started',
      trigger: { type: 'action', action: 'drug', match: { drug: 'Propofol' } },
      effect: { type: 'set_forced_apnea', active: true },
      guidanceIds: ['guide_induction'],
      debriefIds: ['teach_induction'],
    }),
    event({
      id: 'case_deferred',
      trigger: { type: 'plan', fieldId: 'disposition', equals: 'postpone' },
    }),
    event({
      id: 'spo2_low',
      trigger: {
        type: 'physiology',
        key: 'spo2',
        operator: '<=',
        value: 90,
        dwellSec: 0.04,
        resetDelta: 2,
      },
      repeatable: true,
    }),
    event({ id: 'instructor_cue', trigger: { type: 'instructor' } }),
  ];
  return flowDefinition({
    phases: [phase({ id: 'preop', title: 'Preoperative', events: events.map(({ id }) => id) })],
    events,
  });
}

function ids(records) {
  return records.map(({ eventId }) => eventId);
}

describe('CaseFlowSession trigger evaluation', () => {
  test('copies its event-flow definition before evaluation', () => {
    const eventFlow = makeCaseEventFlow();
    const flow = new CaseFlowSession({ eventFlow });
    eventFlow.initialPhaseId = 'caller_mutation';
    eventFlow.phases[0].events.length = 0;
    eventFlow.events[0].effect = { type: 'caller_mutation' };

    expect(flow.enterInitialPhase({ tSec: 0 })).toEqual(['assessment_ready']);
    expect(flow.getState()).toMatchObject({
      currentPhaseId: 'assessment', activeEventIds: ['assessment_ready'],
    });
  });

  test('evaluates phase-entry, fixed, phase-relative, matched action, plan, and instructor triggers', () => {
    const flow = new CaseFlowSession({ eventFlow: makeTriggerFlow(), initialTimeSec: 0 });

    expect(flow.enterInitialPhase({ tSec: 0 })).toEqual(['assessment_ready']);
    expect(ids(flow.drainActivations())).toEqual(['assessment_ready']);
    expect(flow.onStep({ tSec: 0.98, snapshot: { spo2: 99 } })).toEqual([]);
    expect(flow.onStep({ tSec: 1, snapshot: { spo2: 99 } })).toEqual(['fixed_one']);
    expect(flow.onStep({ tSec: 2, snapshot: { spo2: 99 } })).toEqual(['phase_two']);
    expect(flow.onAction({
      action: 'drug',
      meta: { drug: 'Lidocaine', nested: { amount: 10 } },
      tSec: 2.02,
      snapshot: {},
    })).toEqual([]);
    expect(flow.onAction({
      action: 'drug',
      meta: { drug: 'Propofol', extra: 'allowed' },
      tSec: 2.04,
      snapshot: {},
    })).toEqual(['induction_started']);
    expect(flow.onPlan({
      selections: { disposition: 'postpone', technique: 'general' },
      tSec: 2.06,
    })).toEqual(['case_deferred']);
    expect(flow.onAction({
      action: 'instructor_event',
      meta: { eventId: 'instructor_cue' },
      tSec: 2.08,
      snapshot: {},
    })).toEqual(['instructor_cue']);

    const activations = flow.drainActivations();
    expect(ids(activations)).toEqual([
      'fixed_one',
      'phase_two',
      'induction_started',
      'case_deferred',
      'instructor_cue',
    ]);
    expect(activations[2]).toEqual({
      sequence: 4,
      tSec: 2.04,
      eventId: 'induction_started',
      phaseId: 'preop',
      source: 'action',
      effect: { type: 'set_forced_apnea', active: true },
      responseDeadlineSec: null,
      guidanceIds: ['guide_induction'],
      debriefIds: ['teach_induction'],
    });
    expect(activations.at(-1).source).toBe('instructor');
  });

  test.each([
    ['<', 89, 90, true],
    ['<=', 90, 90, true],
    ['>', 91, 90, true],
    ['>=', 90, 90, true],
    ['==', 90, 90, true],
    ['<', 90, 90, false],
    ['>', 90, 90, false],
    ['==', 91, 90, false],
  ])('supports the %s physiology operator for %s versus %s', (
    operator,
    actual,
    threshold,
    shouldFire,
  ) => {
    const thresholdEvent = event({
      id: 'threshold',
      trigger: {
        type: 'physiology', key: 'value', operator, value: threshold, dwellSec: 0, resetDelta: 1,
      },
    });
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [phase({ id: 'preop', events: ['threshold'] })],
        events: [thresholdEvent],
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });
    expect(flow.onStep({ tSec: 0.02, snapshot: { value: actual } }))
      .toEqual(shouldFire ? ['threshold'] : []);
  });

  test('requires continuous dwell, finite snapshot values, and hysteresis before a repeat', () => {
    const flow = new CaseFlowSession({ eventFlow: makeTriggerFlow() });
    flow.enterInitialPhase({ tSec: 0 });
    flow.drainActivations();

    expect(flow.onStep({ tSec: 0.02, snapshot: { spo2: Number.NaN } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.04, snapshot: { spo2: 90 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.06, snapshot: { spo2: 91 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.08, snapshot: { spo2: 90 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.12, snapshot: { spo2: 90 } })).toEqual(['spo2_low']);
    expect(flow.onStep({ tSec: 0.2, snapshot: { spo2: 90 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.22, snapshot: { spo2: 91.9 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.24, snapshot: { spo2: 92 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.26, snapshot: { spo2: 89 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.3, snapshot: { spo2: 89 } })).toEqual(['spo2_low']);
  });

  test.each([
    ['missing', {}],
    ['non-finite', { value: Number.NaN }],
  ])('breaks continuous physiology dwell on a %s sample', (_label, interruptedSnapshot) => {
    const thresholdEvent = event({
      id: 'continuous',
      trigger: {
        type: 'physiology', key: 'value', operator: '<=', value: 90, dwellSec: 0.04, resetDelta: 2,
      },
    });
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [phase({ id: 'preop', events: ['continuous'] })],
        events: [thresholdEvent],
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });

    expect(flow.onStep({ tSec: 0.02, snapshot: { value: 90 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.04, snapshot: interruptedSnapshot })).toEqual([]);
    expect(flow.onStep({ tSec: 0.06, snapshot: { value: 90 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.08, snapshot: { value: 90 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.1, snapshot: { value: 90 } })).toEqual(['continuous']);
  });

  test('requires leaving an inclusive threshold before rearming when reset delta is zero', () => {
    const thresholdEvent = event({
      id: 'inclusive',
      trigger: {
        type: 'physiology', key: 'value', operator: '<=', value: 90, dwellSec: 0, resetDelta: 0,
      },
      repeatable: true,
    });
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [phase({ id: 'preop', events: ['inclusive'] })],
        events: [thresholdEvent],
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });

    expect(flow.onStep({ tSec: 0.02, snapshot: { value: 90 } })).toEqual(['inclusive']);
    expect(flow.onStep({ tSec: 0.04, snapshot: { value: 90 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.06, snapshot: { value: 90 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.08, snapshot: { value: 91 } })).toEqual([]);
    expect(flow.onStep({ tSec: 0.1, snapshot: { value: 90 } })).toEqual(['inclusive']);
  });

  test('preserves definition order for equal-time events', () => {
    const events = [
      event({ id: 'third_in_global', trigger: { type: 'fixed_time', atSec: 1 } }),
      event({ id: 'first_in_phase', trigger: { type: 'fixed_time', atSec: 1 } }),
      event({ id: 'second_in_phase', trigger: { type: 'fixed_time', atSec: 1 } }),
    ];
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [phase({
          id: 'preop',
          events: ['first_in_phase', 'second_in_phase', 'third_in_global'],
        })],
        events,
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });

    expect(flow.onStep({ tSec: 1, snapshot: {} })).toEqual([
      'first_in_phase', 'second_in_phase', 'third_in_global',
    ]);
  });

  test('fires nonrepeatable events once and explicit action events on every matching action', () => {
    const events = [
      event({ id: 'once', trigger: { type: 'action', action: 'drug' } }),
      event({ id: 'again', trigger: { type: 'action', action: 'drug' }, repeatable: true }),
    ];
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [phase({ id: 'preop', events: ['once', 'again'] })],
        events,
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });

    expect(flow.onAction({ action: 'drug', tSec: 0.02, snapshot: {} })).toEqual([
      'once', 'again',
    ]);
    expect(flow.onAction({ action: 'drug', tSec: 0.04, snapshot: {} })).toEqual(['again']);
  });

  test('does not complete a phase from a suppressed nonrepeatable event after re-entry', () => {
    const finishFirst = event({
      id: 'finish_first',
      phaseId: 'first',
      trigger: { type: 'action', action: 'finish' },
    });
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [
          phase({
            id: 'first',
            events: ['finish_first'],
            completionWhen: { type: 'event_fired', eventId: 'finish_first' },
          }),
          phase({ id: 'second', events: [] }),
        ],
        events: [finishFirst],
        branches: [{
          id: 'retry_first',
          label: 'Retry first',
          fromPhaseId: 'second',
          toPhaseId: 'first',
          instructorOnly: true,
        }],
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });
    expect(flow.onAction({ action: 'finish', tSec: 0.02, snapshot: {} }))
      .toEqual(['finish_first']);
    expect(flow.getState().currentPhaseId).toBe('second');
    expect(flow.activateBranch({ branchId: 'retry_first', tSec: 0.04 }).ok).toBe(true);
    expect(flow.onAction({ action: 'finish', tSec: 0.06, snapshot: {} })).toEqual([]);
    expect(flow.getState().currentPhaseId).toBe('first');
  });

  test('applies one plan submission only to the phase where it was submitted', () => {
    const planEvent = event({
      id: 'plan_event',
      phaseId: 'first',
      trigger: { type: 'plan', fieldId: 'disposition', equals: 'proceed' },
    });
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [
          phase({
            id: 'first',
            events: ['plan_event'],
            completionWhen: { type: 'event_fired', eventId: 'plan_event' },
          }),
          phase({ id: 'second', events: [], completionWhen: { type: 'plan_submitted' } }),
          phase({ id: 'third', events: [] }),
        ],
        events: [planEvent],
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });

    expect(flow.onPlan({ selections: { disposition: 'proceed' }, tSec: 0.02 }))
      .toEqual(['plan_event']);
    expect(flow.getState().currentPhaseId).toBe('second');
  });
});

describe('CaseFlowSession lifecycle and controls', () => {
  test('tracks response windows and expires them only after the deterministic deadline', () => {
    const responseEvent = event({
      id: 'respond_now',
      trigger: { type: 'action', action: 'stimulus' },
      responseWindowSec: 1,
    });
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [phase({ id: 'preop', events: ['respond_now'] })],
        events: [responseEvent],
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });
    flow.onAction({ action: 'stimulus', tSec: 0.02, snapshot: {} });

    expect(flow.getState()).toMatchObject({
      activeEventIds: ['respond_now'],
      responseDeadlines: [{ eventId: 'respond_now', responseDeadlineSec: 1.02 }],
    });
    expect(flow.onStep({ tSec: 1.02, snapshot: {} })).toEqual([]);
    expect(flow.getState().activeEventIds).toEqual(['respond_now']);
    expect(flow.onStep({ tSec: 1.04, snapshot: {} })).toEqual([]);
    expect(flow.getState().activeEventIds).toEqual([]);
    expect(flow.getState().responseDeadlines).toEqual([]);
    expect(flow.getState().history.at(-1)).toMatchObject({
      kind: 'response_window_expired', eventId: 'respond_now', tSec: 1.04,
    });
  });

  test('manually advances in definition order and fires phase-entry events', () => {
    const secondReady = event({
      id: 'second_ready', phaseId: 'second', trigger: { type: 'phase_enter' },
    });
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [
          phase({ id: 'first', events: [] }),
          phase({ id: 'second', events: ['second_ready'] }),
        ],
        events: [secondReady],
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });

    expect(flow.advancePhase({ tSec: 0.02 })).toEqual({
      ok: true, phaseId: 'second', activations: ['second_ready'],
    });
    expect(flow.getState()).toMatchObject({ currentPhaseId: 'second' });
    expect(flow.advancePhase({ tSec: 0.04 })).toEqual({
      ok: false, reason: 'NO_NEXT_PHASE',
    });
  });

  test('permits only defined branches from phases with branch control', () => {
    const rescueReady = event({
      id: 'rescue_ready', phaseId: 'rescue', trigger: { type: 'phase_enter' },
    });
    const allowed = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [
          phase({ id: 'preop', events: [] }),
          phase({ id: 'rescue', events: ['rescue_ready'] }),
        ],
        events: [rescueReady],
        branches: [{
          id: 'proceed_for_training',
          label: 'Proceed for training',
          fromPhaseId: 'preop',
          toPhaseId: 'rescue',
          instructorOnly: true,
        }],
      }),
    });
    allowed.enterInitialPhase({ tSec: 0 });
    expect(allowed.activateBranch({ branchId: 'missing', tSec: 0.02 })).toEqual({
      ok: false, reason: 'UNKNOWN_BRANCH',
    });
    expect(allowed.activateBranch({ branchId: 'proceed_for_training', tSec: 0.04 }))
      .toEqual({ ok: true, phaseId: 'rescue', activations: ['rescue_ready'] });

    const forbiddenDefinition = flowDefinition({
      phases: [
        phase({ id: 'preop', events: [], allowedInstructorControls: ['advance'] }),
        phase({ id: 'rescue', events: [] }),
      ],
      events: [],
      branches: [{
        id: 'proceed_for_training',
        label: 'Proceed for training',
        fromPhaseId: 'preop',
        toPhaseId: 'rescue',
        instructorOnly: true,
      }],
    });
    const forbidden = new CaseFlowSession({ eventFlow: forbiddenDefinition });
    forbidden.enterInitialPhase({ tSec: 0 });
    expect(forbidden.activateBranch({ branchId: 'proceed_for_training', tSec: 0.02 }))
      .toEqual({ ok: false, reason: 'CONTROL_NOT_ALLOWED' });
  });

  test('pause freezes fixed and phase-relative clocks until an allowed resume', () => {
    const events = [
      event({ id: 'fixed', trigger: { type: 'fixed_time', atSec: 1 } }),
      event({ id: 'relative', trigger: { type: 'phase_time', atSec: 1 } }),
    ];
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [phase({ id: 'preop', events: ['fixed', 'relative'] })],
        events,
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });
    expect(flow.setPaused({ paused: true, tSec: 0.4 })).toEqual({ ok: true, paused: true });
    expect(flow.onStep({ tSec: 3, snapshot: {} })).toEqual([]);
    expect(flow.setPaused({ paused: false, tSec: 3 })).toEqual({ ok: true, paused: false });
    expect(flow.onStep({ tSec: 3.58, snapshot: {} })).toEqual([]);
    expect(flow.onStep({ tSec: 3.6, snapshot: {} })).toEqual(['fixed', 'relative']);
    expect(flow.getState().history).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'flow_paused', tSec: 0.4 }),
      expect.objectContaining({ kind: 'flow_resumed', tSec: 3 }),
    ]));
  });

  test('pause blocks phase and branch movement until resume', () => {
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [phase({ id: 'first', events: [] }), phase({ id: 'second', events: [] })],
        events: [],
        branches: [{
          id: 'to_second',
          label: 'To second',
          fromPhaseId: 'first',
          toPhaseId: 'second',
          instructorOnly: true,
        }],
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });
    flow.setPaused({ paused: true, tSec: 0.02 });

    expect(flow.advancePhase({ tSec: 0.04 })).toEqual({ ok: false, reason: 'PAUSED' });
    expect(flow.activateBranch({ branchId: 'to_second', tSec: 0.04 }))
      .toEqual({ ok: false, reason: 'PAUSED' });
    expect(flow.getState().currentPhaseId).toBe('first');
    flow.setPaused({ paused: false, tSec: 0.04 });
    expect(flow.advancePhase({ tSec: 0.06 })).toMatchObject({
      ok: true, phaseId: 'second',
    });
  });

  test('requires an exact active-phase instructor event and activate-event control', () => {
    const instructorEvent = event({ id: 'cue', trigger: { type: 'instructor' } });
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [phase({
          id: 'preop',
          events: ['cue'],
          allowedInstructorControls: ['pause', 'resume'],
        })],
        events: [instructorEvent],
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });
    expect(() => flow.onAction({
      action: 'instructor_event', meta: {}, tSec: 0.02, snapshot: {},
    })).toThrow(/eventId/i);
    expect(flow.onAction({
      action: 'instructor_event', meta: { eventId: 'cue' }, tSec: 0.02, snapshot: {},
    })).toEqual([]);
    expect(flow.onAction({
      action: 'drug', meta: { eventId: 'cue' }, tSec: 0.04, snapshot: {},
    })).toEqual([]);
  });

  test('does not advance chronology for a rejected instructor event activation', () => {
    const instructorEvent = event({ id: 'cue', trigger: { type: 'instructor' } });
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [phase({ id: 'preop', events: ['cue'] })],
        events: [instructorEvent],
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });
    expect(flow.onAction({
      action: 'instructor_event', meta: { eventId: 'cue' }, tSec: 0.02, snapshot: {},
    })).toEqual(['cue']);
    expect(flow.onAction({
      action: 'instructor_event', meta: { eventId: 'cue' }, tSec: 10, snapshot: {},
    })).toEqual([]);
    expect(() => flow.onStep({ tSec: 0.04, snapshot: {} })).not.toThrow();
  });

  test('pause freezes an active response window and shifts its deadline on resume', () => {
    const responseEvent = event({
      id: 'respond',
      trigger: { type: 'action', action: 'stimulus' },
      responseWindowSec: 1,
    });
    const flow = new CaseFlowSession({
      eventFlow: flowDefinition({
        phases: [phase({ id: 'preop', events: ['respond'] })],
        events: [responseEvent],
      }),
    });
    flow.enterInitialPhase({ tSec: 0 });
    flow.onAction({ action: 'stimulus', tSec: 0.02, snapshot: {} });
    flow.setPaused({ paused: true, tSec: 0.5 });
    flow.onStep({ tSec: 2.5, snapshot: {} });
    flow.setPaused({ paused: false, tSec: 2.5 });

    expect(flow.getState().responseDeadlines).toEqual([{
      eventId: 'respond', activatedAtSec: 0.02, responseDeadlineSec: 3.02,
    }]);
    flow.onStep({ tSec: 3.02, snapshot: {} });
    expect(flow.getState().activeEventIds).toEqual(['respond']);
    flow.onStep({ tSec: 3.04, snapshot: {} });
    expect(flow.getState().activeEventIds).toEqual([]);
  });

  test('enforces fixed-step nondecreasing timestamps atomically', () => {
    const flow = new CaseFlowSession({ eventFlow: makeTriggerFlow(), initialTimeSec: 0.02 });

    expect(() => flow.enterInitialPhase({ tSec: 0.01 })).toThrow(/0\.02|fixed-step|tick/i);
    expect(() => flow.enterInitialPhase({ tSec: 0 })).toThrow(/nondecreasing/i);
    expect(flow.getState().history).toEqual([]);
    expect(flow.enterInitialPhase({ tSec: 0.02 })).toEqual(['assessment_ready']);
    const before = JSON.stringify(flow.getState());
    expect(() => flow.onStep({ tSec: 0.01, snapshot: {} })).toThrow(/0\.02|fixed-step|tick/i);
    expect(() => flow.onStep({ tSec: 0, snapshot: {} })).toThrow(/nondecreasing/i);
    expect(JSON.stringify(flow.getState())).toBe(before);
  });

  test('does not mutate supplied snapshots or depend on wall clock or RNG', () => {
    const flow = new CaseFlowSession({ eventFlow: makeTriggerFlow() });
    flow.enterInitialPhase({ tSec: 0 });
    const snapshot = { spo2: 90, nested: { value: 'caller' } };
    const before = structuredClone(snapshot);
    const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => {
      throw new Error('wall clock used');
    });
    const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('RNG used');
    });
    try {
      expect(flow.onStep({ tSec: 0.02, snapshot })).toEqual([]);
      expect(snapshot).toEqual(before);
    } finally {
      dateSpy.mockRestore();
      randomSpy.mockRestore();
    }
  });
});

function runMixedFingerprint() {
  const eventFlow = makeTriggerFlow();
  eventFlow.events.find(({ id }) => id === 'induction_started').responseWindowSec = 1;
  const flow = new CaseFlowSession({ eventFlow });
  const samples = [];
  samples.push({ returned: flow.enterInitialPhase({ tSec: 0 }), state: flow.getState() });
  flow.drainActivations();
  flow.onStep({ tSec: 0.02, snapshot: { spo2: 90 } });
  samples.push({ marker: 'mid_dwell', state: flow.getState(), drained: flow.drainActivations() });
  flow.onStep({ tSec: 0.04, snapshot: { spo2: 90 } });
  flow.onStep({ tSec: 0.06, snapshot: { spo2: 90 } });
  flow.onAction({
    action: 'drug', meta: { drug: 'Propofol' }, tSec: 0.08, snapshot: { spo2: 89 },
  });
  samples.push({
    marker: 'mid_response_window',
    state: flow.getState(),
    drained: flow.drainActivations(),
  });
  flow.onPlan({ selections: { disposition: 'postpone' }, tSec: 0.1 });
  flow.setPaused({ paused: true, tSec: 0.12 });
  flow.onStep({ tSec: 0.2, snapshot: { spo2: 88 } });
  flow.setPaused({ paused: false, tSec: 0.2 });
  samples.push({ marker: 'final', state: flow.getState(), drained: flow.drainActivations() });
  return JSON.stringify(samples);
}

describe('CaseFlowSession determinism', () => {
  test('is byte-identical across two mixed runs including mid-dwell and open-window samples', () => {
    const first = runMixedFingerprint();
    expect(first).toBe(runMixedFingerprint());
    expect(first).toContain('"responseDeadlineSec":1.08');
  });
});

function makeIntegratedDefinition() {
  const raw = makeCaseExperience();
  raw.eventFlow.events.push(event({
    id: 'assessment_recorded',
    phaseId: 'assessment',
    trigger: {
      type: 'action',
      action: 'assessment_action',
      match: { actionId: 'ask_npo' },
    },
  }));
  raw.eventFlow.events.push(event({
    id: 'plan_recorded',
    phaseId: 'assessment',
    trigger: { type: 'plan', fieldId: 'disposition', equals: 'proceed' },
  }));
  raw.eventFlow.events.push(event({
    id: 'live_drug_recorded',
    phaseId: 'assessment',
    trigger: { type: 'action', action: 'drug', match: { drug: 'Propofol' } },
  }));
  raw.eventFlow.events.push(event({
    id: 'instructor_recorded',
    phaseId: 'assessment',
    trigger: { type: 'instructor' },
  }));
  raw.eventFlow.phases[0].events.push(
    'assessment_recorded',
    'plan_recorded',
    'live_drug_recorded',
    'instructor_recorded',
  );
  raw.eventFlow.phases[0].allowedInstructorControls.push('activate_event');
  return normalizeCaseExperience(raw);
}

describe('CaseSession event-flow integration', () => {
  test('keeps projections usable when fixed-step flow time advances without a canonical action', () => {
    const session = new CaseSession({ definition: makeIntegratedDefinition(), seed: 6 });
    session.drainFlowActivations();

    expect(session.processFlowStep({ tSec: 0.02, snapshot: { spo2: 99 } }))
      .toMatchObject({ ok: true });
    expect(session.getLiveResult()).toMatchObject({ currentTimeSec: 0.02, timeline: [] });
    expect(() => session.getLearnerContext()).not.toThrow();
    expect(() => session.getInstructorContext()).not.toThrow();
    expect(session.getInstructorContext()).toMatchObject({
      currentTimeSec: 0.02,
      flowState: { currentTimeSec: 0.02 },
    });

    expect(session.advanceStage({ stage: 'interview', tSec: 0.04 })).toMatchObject({ ok: true });
    expect(() => session.getLearnerContext()).not.toThrow();
    expect(session.getInstructorContext()).toMatchObject({
      currentTimeSec: 0.04,
      flowState: { currentTimeSec: 0.02 },
    });
  });

  test('feeds only accepted assessment actions to its single flow instance', () => {
    const session = new CaseSession({ definition: makeIntegratedDefinition(), seed: 7 });
    expect(session.drainFlowActivations().map(({ eventId }) => eventId)).toEqual([
      'assessment_ready',
    ]);

    expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0.02 })).toEqual({
      ok: false, reason: 'WRONG_STAGE',
    });
    expect(session.drainFlowActivations()).toEqual([]);
    expect(session.advanceStage({ stage: 'interview', tSec: 0.04 }).ok).toBe(true);
    expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0.06 }))
      .toMatchObject({ ok: true, activations: [expect.objectContaining({
        eventId: 'assessment_recorded', source: 'action',
      })] });
    session.drainFlowActivations();
    expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0.08 })).toEqual({
      ok: false, reason: 'DUPLICATE_ACTION',
    });
    expect(session.drainFlowActivations()).toEqual([]);
  });

  test('feeds accepted plan and live actions, preserves completion routes, and isolates projections', () => {
    const session = new CaseSession({ definition: makeIntegratedDefinition(), seed: 8 });
    session.drainFlowActivations();
    expect(session.recordCanonicalAction({
      action: 'drug',
      meta: { drug: 'Propofol' },
      snapshot: { spo2: 99 },
      tSec: 0.02,
    })).toMatchObject({ ok: true, activations: [expect.objectContaining({
      eventId: 'live_drug_recorded', source: 'action',
    })] });
    session.drainFlowActivations();
    expect(() => session.recordCanonicalAction({
      action: '', tSec: 0.04,
    })).toThrow(/action/i);
    expect(session.drainFlowActivations()).toEqual([]);

    expect(session.advanceStage({ stage: 'interview', tSec: 0.04 }).ok).toBe(true);
    expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0.06 }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'focused_exam', tSec: 0.08 }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'findings_summary', tSec: 0.1 }).ok).toBe(true);
    expect(session.submitFindings({ findingIds: ['npo_ok'], tSec: 0.12 }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'plan_submission', tSec: 0.14 }).ok).toBe(true);
    expect(session.submitPlan({
      selections: { disposition: 'proceed' }, tSec: 0.16,
    })).toMatchObject({
      ok: true,
      stage: 'live_simulation',
      activations: [expect.objectContaining({ eventId: 'plan_recorded', source: 'plan' })],
    });

    const learner = session.getLearnerContext();
    const instructor = session.getInstructorContext();
    expect(learner.flowState).toEqual({
      currentPhaseTitle: 'Assessment',
      paused: false,
    });
    expect(JSON.stringify(learner)).not.toContain('assessment_recorded');
    expect(instructor.flowState.history.some(
      ({ eventId }) => eventId === 'assessment_recorded',
    )).toBe(true);
    expect(instructor.flowState.activeEventIds).toContain('plan_recorded');
    expect(session.getLiveResult()).not.toHaveProperty('flowState');
  });

  test('delegates phase, branch, pause, and resume controls with timestamped session evidence', () => {
    const raw = makeCaseExperience();
    raw.eventFlow.phases[0].allowedInstructorControls = [
      'pause', 'resume', 'advance', 'activate_branch', 'activate_event',
    ];
    raw.eventFlow.phases.push(phase({
      id: 'training',
      title: 'Training branch',
      events: [],
      completionWhen: { type: 'instructor_advance' },
    }));
    raw.eventFlow.branches.push({
      id: 'proceed_for_training',
      label: 'Proceed for training',
      fromPhaseId: 'assessment',
      toPhaseId: 'training',
      instructorOnly: true,
    });
    const session = new CaseSession({
      definition: normalizeCaseExperience(raw),
      seed: 9,
    });
    session.drainFlowActivations();

    expect(session.setPaused({ paused: true, tSec: 0.02 })).toEqual({
      ok: true, paused: true,
    });
    expect(session.setPaused({ paused: false, tSec: 0.04 })).toEqual({
      ok: true, paused: false,
    });
    expect(session.activateBranch({ branchId: 'proceed_for_training', tSec: 0.06 }))
      .toMatchObject({ ok: true, phaseId: 'training' });
    expect(session.getLiveResult().timeline.map(({ kind }) => kind)).toEqual([
      'case_flow_paused', 'case_flow_resumed', 'case_flow_branch_activated',
    ]);
    expect(session.advancePhase({ tSec: 0.08 })).toEqual({
      ok: false, reason: 'NO_NEXT_PHASE',
    });
  });

  test('reserves instructor-event activation from ordinary canonical actions', () => {
    const session = new CaseSession({ definition: makeIntegratedDefinition(), seed: 10 });
    session.drainFlowActivations();

    expect(session.recordCanonicalAction({
      action: 'instructor_event',
      meta: { eventId: 'instructor_recorded' },
      tSec: 0.02,
    })).toEqual({ ok: false, reason: 'RESERVED_INSTRUCTOR_ACTION' });
    expect(session.getInstructorContext().flowState.activeEventIds)
      .not.toContain('instructor_recorded');
    expect(session.activateInstructorEvent({
      eventId: 'instructor_recorded', tSec: 0.02,
    })).toMatchObject({
      ok: true,
      activations: [expect.objectContaining({
        eventId: 'instructor_recorded', source: 'instructor',
      })],
    });
  });

  test('matches reversed multi-select plan trigger values after canonical submission', () => {
    const raw = makeCaseExperience();
    raw.planRequirements.fields.push({
      id: 'agents',
      type: 'multi',
      required: true,
      options: ['propofol', 'ketamine', 'etomidate'],
    });
    raw.eventFlow.events.push(event({
      id: 'agents_selected',
      phaseId: 'assessment',
      trigger: {
        type: 'plan',
        fieldId: 'agents',
        equals: ['ketamine', 'propofol'],
      },
    }));
    raw.eventFlow.phases[0].events.push('agents_selected');
    const session = new CaseSession({
      definition: normalizeCaseExperience(raw),
      seed: 11,
    });
    session.drainFlowActivations();
    expect(session.advanceStage({ stage: 'interview', tSec: 0.02 }).ok).toBe(true);
    expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0.04 }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'focused_exam', tSec: 0.06 }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'findings_summary', tSec: 0.08 }).ok).toBe(true);
    expect(session.submitFindings({ findingIds: ['npo_ok'], tSec: 0.1 }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'plan_submission', tSec: 0.12 }).ok).toBe(true);

    expect(session.submitPlan({
      selections: {
        disposition: 'proceed',
        agents: ['ketamine', 'propofol'],
      },
      tSec: 0.14,
    })).toMatchObject({
      ok: true,
      activations: [expect.objectContaining({ eventId: 'agents_selected', source: 'plan' })],
    });
    expect(session.getLiveResult().planSubmission.selections.agents)
      .toEqual(['propofol', 'ketamine']);
  });

  test('never exposes hostile internal phase ids to the learner projection', () => {
    const raw = makeCaseExperience();
    const concealedPhaseId = 'concealed_mh_answer';
    raw.eventFlow.initialPhaseId = concealedPhaseId;
    raw.eventFlow.phases[0].id = concealedPhaseId;
    raw.eventFlow.events[0].phaseId = concealedPhaseId;
    raw.instructorGuide.considerations[0].phaseId = concealedPhaseId;
    const session = new CaseSession({
      definition: normalizeCaseExperience(raw),
      seed: 12,
    });

    const learner = session.getLearnerContext();
    const instructor = session.getInstructorContext();
    expect(learner.flowState).toEqual({
      currentPhaseTitle: 'Assessment',
      paused: false,
    });
    expect(JSON.stringify(learner)).not.toContain(concealedPhaseId);
    expect(instructor.flowState.currentPhaseId).toBe(concealedPhaseId);
  });
});
