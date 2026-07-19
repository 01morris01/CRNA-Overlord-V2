import { describe, expect, test, vi } from 'vitest';
import standardRubric from '../../data/rubrics/carson-newman-standard-iv-induction.json';
import standardScenario from '../sim/scenarios/standard_iv_healthy_001.json';
import {
  CASE_INPUT_TYPES,
  applyCasePhysiologyInput,
  validateCasePhysiologyInput,
} from '../sim/scenario/casePhysiologyInputs.js';
import { SimRunner, VentMode } from '../ui/simRunner.js';
import { makeCaseExperience } from './helpers/caseFixtures.js';

function caseEvent({
  id,
  phaseId = 'assessment',
  trigger,
  effect = null,
  repeatable = false,
} = {}) {
  return {
    id,
    phaseId,
    trigger,
    repeatable,
    responseWindowSec: 0,
    expectedResponses: [],
    unsafeResponses: [],
    effect,
    guidanceIds: [],
    debriefIds: [],
  };
}

function makeLiveCase(customizeExperience = () => {}) {
  const scenario = structuredClone(standardScenario);
  scenario.id = 'runner_case_001';
  scenario.title = 'Runner teaching case';
  scenario.caseExperience = makeCaseExperience();
  customizeExperience(scenario.caseExperience);
  return scenario;
}

function addAssessmentEvent(experience, event) {
  experience.eventFlow.events.push(event);
  experience.eventFlow.phases[0].events.push(event.id);
}

function loadCase(runner, customizeExperience, rubric = null) {
  return runner.loadCaseScenario({
    scenario: makeLiveCase(customizeExperience),
    rubric,
  });
}

function advanceToPlan(runner) {
  expect(runner.advanceCaseStage({ stage: 'interview' })).toMatchObject({ ok: true });
  expect(runner.performAssessmentAction({ actionId: 'ask_npo' })).toMatchObject({ ok: true });
  expect(runner.advanceCaseStage({ stage: 'focused_exam' })).toMatchObject({ ok: true });
  expect(runner.advanceCaseStage({ stage: 'findings_summary' })).toMatchObject({ ok: true });
  expect(runner.submitCaseFindings({ findingIds: ['npo_ok'], notes: 'Reviewed' }))
    .toMatchObject({ ok: true });
  expect(runner.advanceCaseStage({ stage: 'plan_submission' })).toMatchObject({ ok: true });
}

function liveActions(runner) {
  return runner.getInstructorCaseContext().timeline
    .filter(({ kind }) => kind === 'live_action');
}

describe('case physiology input boundary', () => {
  test('exports the exact modeled-input allowlist and defensively validates copied inputs', () => {
    expect(CASE_INPUT_TYPES).toEqual([
      'set_surgical_stimulus',
      'inject_complication',
      'set_forced_apnea',
      'set_machine',
    ]);
    const source = {
      type: 'set_machine',
      patch: {
        o2FlowLPerMin: 10,
        airFlowLPerMin: 0,
        n2oFlowLPerMin: 0,
        setFiO2: 1,
        setTidalVolume: 500,
        setRespiratoryRate: 12,
        setPeep: 5,
        mode: 'vcv',
        vaporizerAgent: 'Sevoflurane',
        vaporizerDial: 2,
      },
    };

    const validated = validateCasePhysiologyInput(source);
    source.patch.setFiO2 = 0.21;

    expect(validated).toEqual({
      type: 'set_machine',
      patch: expect.objectContaining({ setFiO2: 1, mode: 'vcv' }),
    });
    expect(validated).not.toBe(source);
    expect(() => { validated.patch.setFiO2 = 0.5; }).toThrow();
    expect(() => validateCasePhysiologyInput({
      type: 'set_machine', patch: { spo2: 100 },
    })).toThrow(/unsupported|derived vital/i);
    expect(() => validateCasePhysiologyInput({
      type: 'set_machine', patch: { setFiO2: 2 },
    })).toThrow(/setFiO2/i);
    expect(() => validateCasePhysiologyInput({
      type: 'invented_effect', value: 1,
    })).toThrow(/unsupported case effect/i);
  });

  test('routes each effect through only its established modeled driver', () => {
    const runner = new SimRunner();
    const stimulus = vi.spyOn(runner.l, 'setSurgicalStimulus');
    const complication = vi.spyOn(runner.s, 'applyComplication');
    const forcedApnea = vi.spyOn(runner.p, 'setForcedApnea');

    expect(applyCasePhysiologyInput({
      input: { type: 'set_surgical_stimulus', intensity: 0.7 },
      patient: runner.p,
      lidocaineSystem: runner.l,
      ventilator: runner.v,
      scenarioManager: runner.s,
    })).toEqual({ type: 'set_surgical_stimulus', intensity: 0.7 });
    expect(stimulus).toHaveBeenCalledOnce();
    expect(runner.l.surgicalStimulusRaw).toBeCloseTo(0.7, 6);

    expect(applyCasePhysiologyInput({
      input: {
        type: 'inject_complication',
        complicationType: 'Bronchospasm',
        description: 'Modeled bronchospasm',
      },
      patient: runner.p,
      lidocaineSystem: runner.l,
      ventilator: runner.v,
      scenarioManager: runner.s,
    })).toEqual({
      type: 'inject_complication',
      complicationType: 'Bronchospasm',
      description: 'Modeled bronchospasm',
    });
    expect(complication).toHaveBeenCalledOnce();
    expect(complication).toHaveBeenCalledWith({
      complicationType: 'Bronchospasm', description: 'Modeled bronchospasm',
    });

    expect(applyCasePhysiologyInput({
      input: { type: 'set_forced_apnea', active: true },
      patient: runner.p,
      lidocaineSystem: runner.l,
      ventilator: runner.v,
      scenarioManager: runner.s,
    })).toEqual({ type: 'set_forced_apnea', active: true });
    expect(forcedApnea).toHaveBeenCalledOnce();
    expect(runner.p.forcedApneaActive).toBe(true);

    expect(applyCasePhysiologyInput({
      input: {
        type: 'set_machine',
        patch: {
          o2FlowLPerMin: 8,
          airFlowLPerMin: 2,
          n2oFlowLPerMin: 0,
          setFiO2: 0.8,
          setTidalVolume: 525,
          setRespiratoryRate: 13,
          setPeep: 6,
          mode: 'vcv',
          vaporizerAgent: 'Desflurane',
          vaporizerDial: 6,
        },
      },
      patient: runner.p,
      lidocaineSystem: runner.l,
      ventilator: runner.v,
      scenarioManager: runner.s,
    })).toEqual({
      type: 'set_machine',
      patch: expect.objectContaining({ mode: 'vcv', setFiO2: 0.8 }),
    });
    expect(runner.v).toMatchObject({
      o2FlowLPerMin: 8,
      airFlowLPerMin: 2,
      n2oFlowLPerMin: 0,
      setFiO2: 0.8,
      setTidalVolume: 525,
      setRespiratoryRate: 13,
      setPeep: 6,
      mode: VentMode.VCV,
      vaporizerAgent: 'Desflurane',
      vaporizerDial: 6,
    });
  });

  test('rejects an invalid machine patch atomically', () => {
    const runner = new SimRunner();
    const before = {
      setFiO2: runner.v.setFiO2,
      setTidalVolume: runner.v.setTidalVolume,
    };

    expect(() => applyCasePhysiologyInput({
      input: {
        type: 'set_machine',
        patch: { setFiO2: 0.8, setTidalVolume: -1 },
      },
      patient: runner.p,
      lidocaineSystem: runner.l,
      ventilator: runner.v,
      scenarioManager: runner.s,
    })).toThrow(/setTidalVolume/i);
    expect(runner.v).toMatchObject(before);
  });
});

describe('atomic teaching-case runner integration', () => {
  test('loads a case without a rubric and keeps answer data out of snapshot', () => {
    const runner = new SimRunner();

    expect(loadCase(runner)).toMatchObject({
      ok: true,
      scenarioId: 'runner_case_001',
      rubricId: null,
      seed: standardScenario.seed,
    });
    expect(runner.getLearnerCaseContext()).toMatchObject({
      active: true, stage: 'chart_review',
    });
    expect(runner.getInstructorCaseContext()).toMatchObject({
      active: true,
      assessment: { actions: [expect.objectContaining({ response: 'Solids eight hours ago' })] },
    });
    expect(runner.getRubricStatus()).toBeNull();
    expect(runner.snapshot().activeRubricScenario).toBeNull();

    const serialized = JSON.stringify(runner.snapshot());
    expect(serialized).not.toMatch(/instructorGuide|concealed|expectedResponse|caseContext|caseExperience/);
  });

  test('optionally attaches the existing rubric while preserving rubric-only load behavior', () => {
    const caseRunner = new SimRunner();
    const caseLoaded = loadCase(caseRunner, undefined, standardRubric);
    expect(caseLoaded).toMatchObject({
      ok: true,
      scenarioId: 'runner_case_001',
      rubricId: standardRubric.id,
      seed: standardScenario.seed,
      initialSnapshot: expect.objectContaining({ t: 0, airwayDevice: 'mask' }),
    });
    expect(caseRunner.getRubricStatus()).toMatchObject({ rubricId: standardRubric.id });

    const rubricOnly = new SimRunner();
    const result = rubricOnly.loadRubricScenario({
      scenario: standardScenario,
      rubric: standardRubric,
    });
    expect(Object.keys(result)).toEqual([
      'ok', 'scenarioId', 'rubricId', 'seed', 'initialSnapshot',
    ]);
    expect(result).toMatchObject({
      ok: true,
      scenarioId: standardScenario.id,
      rubricId: standardRubric.id,
      seed: standardScenario.seed,
    });
    expect(rubricOnly.getLearnerCaseContext()).toBeNull();
    expect(rubricOnly.getInstructorCaseContext()).toBeNull();
  });

  test('rejects a malformed case before touching the active runner or emitting', () => {
    const runner = new SimRunner();
    loadCase(runner);
    runner.advanceCaseStage({ stage: 'interview' });
    let emissions = 0;
    runner.onTick = () => { emissions += 1; };
    const before = {
      core: runner.core,
      snapshot: JSON.stringify(runner.snapshot()),
      learner: JSON.stringify(runner.getLearnerCaseContext()),
      instructor: JSON.stringify(runner.getInstructorCaseContext()),
      log: JSON.stringify(runner.log),
      running: runner.running,
    };
    const malformed = makeLiveCase();
    malformed.caseExperience.eventFlow.events[0].guidanceIds = ['unknown_guidance'];

    expect(() => runner.loadCaseScenario({ scenario: malformed })).toThrow(/guidance/i);
    expect(runner.core).toBe(before.core);
    expect(JSON.stringify(runner.snapshot())).toBe(before.snapshot);
    expect(JSON.stringify(runner.getLearnerCaseContext())).toBe(before.learner);
    expect(JSON.stringify(runner.getInstructorCaseContext())).toBe(before.instructor);
    expect(JSON.stringify(runner.log)).toBe(before.log);
    expect(runner.running).toBe(before.running);
    expect(emissions).toBe(0);
  });

  test('returns defensive projections and reset rebuilds a pristine case session', () => {
    const runner = new SimRunner();
    loadCase(runner);
    const learner = runner.getLearnerCaseContext();
    const instructor = runner.getInstructorCaseContext();

    expect(() => { learner.stage = 'forged'; }).toThrow();
    expect(() => { instructor.assessment.actions[0].response = 'forged'; }).toThrow();
    expect(runner.getLearnerCaseContext()).not.toBe(learner);
    expect(runner.getInstructorCaseContext()).not.toBe(instructor);
    expect(runner.getInstructorCaseContext().assessment.actions[0].response)
      .toBe('Solids eight hours ago');

    runner.advanceCaseStage({ stage: 'interview' });
    expect(runner.getLearnerCaseContext().stage).toBe('interview');
    const resetSnapshot = runner.reset();
    expect(resetSnapshot).toEqual(runner.snapshot());
    expect(runner.getLearnerCaseContext()).toMatchObject({ stage: 'chart_review' });
    expect(runner.getInstructorCaseContext()).toMatchObject({
      sequence: 0,
      completedActionIds: [],
      timeline: [],
    });
  });

  test('exposes the approved lifecycle surface with one emission per accepted mutation', () => {
    const runner = new SimRunner();
    loadCase(runner);
    let emissions = 0;
    runner.onTick = () => { emissions += 1; };
    const accepted = (invoke) => {
      const before = emissions;
      const result = invoke();
      expect(result).toMatchObject({ ok: true });
      expect(emissions - before).toBe(1);
      return result;
    };

    accepted(() => runner.advanceCaseStage({ stage: 'interview' }));
    accepted(() => runner.performAssessmentAction({ actionId: 'ask_npo' }));
    accepted(() => runner.advanceCaseStage({ stage: 'focused_exam' }));
    accepted(() => runner.advanceCaseStage({ stage: 'findings_summary' }));
    accepted(() => runner.submitCaseFindings({ findingIds: ['npo_ok'], notes: 'NPO checked' }));
    accepted(() => runner.advanceCaseStage({ stage: 'plan_submission' }));
    accepted(() => runner.submitCasePlan({
      selections: { disposition: 'postpone' }, rationale: 'Elective deferral',
    }));
    accepted(() => runner.setInstructorCaseObservation({
      considerationId: 'consider_npo', status: 'observed', note: 'Closed loop',
    }));
    accepted(() => runner.setCaseFeedbackReveal({
      considerationId: 'consider_npo', reveal: false,
    }));
    accepted(() => runner.finalizeCaseDebrief());
    accepted(() => runner.beginCaseDebriefRevision());
    accepted(() => runner.setCaseFeedbackReveal({
      considerationId: 'consider_npo', reveal: true,
    }));

    expect(runner.getInstructorCaseContext().timeline.map(({ tSec }) => tSec))
      .toEqual([
        0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.14,
        0.16, 0.18, 0.2, 0.2, 0.22, 0.24,
      ]);
  });

  test('exposes deterministic pause, resume, phase-advance, and branch controls', () => {
    const runner = new SimRunner();
    loadCase(runner, (experience) => {
      const [assessment] = experience.eventFlow.phases;
      assessment.allowedInstructorControls = [
        'pause', 'resume', 'advance', 'activate_branch',
      ];
      assessment.completionWhen = { type: 'instructor_advance' };
      experience.eventFlow.phases.push({
        id: 'live',
        title: 'Live',
        enterWhen: { type: 'instructor_advance' },
        events: [],
        completionWhen: { type: 'instructor_advance' },
        allowedInstructorControls: [],
      });
      experience.eventFlow.phases.push({
        id: 'branch_live',
        title: 'Branch live',
        enterWhen: { type: 'branch', branchId: 'training' },
        events: [],
        completionWhen: { type: 'instructor_advance' },
        allowedInstructorControls: [],
      });
      experience.eventFlow.branches.push({
        id: 'training',
        fromPhaseId: 'assessment',
        toPhaseId: 'branch_live',
        label: 'Training branch',
        instructorOnly: true,
      });
      experience.eventFlow.branches.push({
        id: 'live_reachable',
        fromPhaseId: 'assessment',
        toPhaseId: 'live',
        label: 'Live reachable',
        instructorOnly: true,
      });
    });

    expect(runner.pauseCase()).toMatchObject({ ok: true, paused: true });
    expect(runner.resumeCase()).toMatchObject({ ok: true, paused: false });
    expect(runner.advanceCasePhase()).toMatchObject({ ok: true, phaseId: 'live' });

    runner.reset();
    expect(runner.activateCaseBranch({ branchId: 'training' })).toMatchObject({
      ok: true, phaseId: 'branch_live', targetPhaseId: 'branch_live',
    });
  });
});

describe('canonical case action and effect bridge', () => {
  test('records one accepted Propofol exposure and one canonical case action', () => {
    const runner = new SimRunner();
    loadCase(runner, (experience) => {
      addAssessmentEvent(experience, caseEvent({
        id: 'propofol_seen',
        trigger: { type: 'action', action: 'drug', match: { drug: 'Propofol' } },
        effect: { type: 'set_forced_apnea', active: true },
      }));
    });
    const forcedApnea = vi.spyOn(runner.p, 'setForcedApnea');

    runner.giveBolus('Propofol', 140, 'Propofol 140 mg');
    runner.pause();

    expect(runner.d._ppfA1).toBe(140);
    expect(liveActions(runner)).toEqual([
      expect.objectContaining({
        action: 'drug',
        meta: { drug: 'Propofol', doseMg: 140 },
      }),
    ]);
    expect(forcedApnea).toHaveBeenCalledTimes(1);
    expect(runner.p.forcedApneaActive).toBe(true);
    expect(runner.log.filter(({ meta }) => meta?.eventId === 'propofol_seen')).toHaveLength(1);
    expect(runner.log.find(({ meta }) => meta?.eventId === 'propofol_seen')).toMatchObject({
      meta: { source: 'scenario', eventId: 'propofol_seen', activationSequence: 2 },
    });
  });

  test('does not award case action credit for rejected Lidocaine, volatile, or procedure actions', () => {
    const runner = new SimRunner();
    loadCase(runner);

    expect(runner.giveLidocaineBolus({ doseMgPerKg: -1 })).toMatchObject({ ok: false });
    expect(runner.setVolatile({ agent: 'Ether', dialPercent: 2 })).toMatchObject({ ok: false });
    expect(runner.setAirwayDevice('intubated')).toMatchObject({ ok: true });
    expect(runner.deliverMaskVentilation({ durationSeconds: 1 })).toMatchObject({ ok: false });

    expect(liveActions(runner)).toEqual([]);
    expect(runner.getInstructorCaseContext().timeline.filter(
      ({ action }) => action?.startsWith('intubation_attempt_'),
    )).toEqual([]);
  });

  test('bridges procedure events once at their fixed-step event times', () => {
    const runner = new SimRunner();
    loadCase(runner);
    advanceToPlan(runner);
    expect(runner.submitCasePlan({
      selections: { disposition: 'proceed' }, rationale: 'Proceed',
    })).toMatchObject({ ok: true, stage: 'live_simulation' });
    const epoch = runner.getInstructorCaseContext().currentTimeSec;
    runner.configureIntubationAttempts({ attemptDurationSeconds: 0.02 });

    expect(runner.attemptIntubation()).toMatchObject({ ok: true });
    runner.pause();
    runner.stepFor(0.02);

    const procedureActions = liveActions(runner).filter(
      ({ action }) => action.startsWith('intubation_attempt_'),
    );
    expect(procedureActions.map(({ action }) => action)).toEqual([
      'intubation_attempt_started',
      'intubation_attempt_succeeded',
    ]);
    expect(procedureActions.map(({ tSec }) => tSec)).toEqual([epoch, epoch + 0.02]);
    expect(runner.log.filter(
      ({ meta }) => meta?.action === 'intubation_attempt_started',
    )).toHaveLength(1);
    expect(runner.log.filter(
      ({ meta }) => meta?.action === 'intubation_attempt_succeeded',
    )).toHaveLength(1);
  });

  test('applies initial and fixed-step activations exactly once with scenario-source logs', () => {
    const runner = new SimRunner();
    loadCase(runner, (experience) => {
      experience.eventFlow.events[0].effect = {
        type: 'set_surgical_stimulus', intensity: 0.4,
      };
      experience.eventFlow.phases.push({
        id: 'live',
        title: 'Live simulation',
        enterWhen: { type: 'plan_submitted' },
        events: ['live_machine'],
        completionWhen: { type: 'instructor_advance' },
        allowedInstructorControls: [],
      });
      experience.eventFlow.events.push(caseEvent({
        id: 'live_machine',
        phaseId: 'live',
        trigger: { type: 'phase_time', atSec: 0.02 },
        effect: { type: 'set_machine', patch: { setFiO2: 0.8 } },
      }));
      experience.eventFlow.branches.push({
        id: 'live_reachable',
        fromPhaseId: 'assessment',
        toPhaseId: 'live',
        label: 'Live reachable',
        instructorOnly: true,
      });
    });
    expect(runner.l.surgicalStimulusRaw).toBeCloseTo(0.4, 6);
    expect(runner.log.filter(({ meta }) => meta?.eventId === 'assessment_ready')).toHaveLength(1);
    advanceToPlan(runner);
    runner.submitCasePlan({ selections: { disposition: 'proceed' }, rationale: 'Proceed' });
    const machineBefore = runner.log.filter(({ meta }) => meta?.eventId === 'live_machine').length;

    runner.stepFor(0.02);
    runner.stepFor(0.02);

    expect(runner.v.setFiO2).toBeCloseTo(0.8, 8);
    expect(runner.log.filter(({ meta }) => meta?.eventId === 'live_machine'))
      .toHaveLength(machineBefore + 1);
    expect(liveActions(runner).filter(({ action }) => action === 'machine_settings_changed'))
      .toEqual([]);
  });

  test('routes complication activations to ScenarioManager exactly once', () => {
    const runner = new SimRunner();
    loadCase(runner, (experience) => {
      experience.eventFlow.events[0].effect = {
        type: 'inject_complication',
        complicationType: 'Bronchospasm',
        description: 'Teaching bronchospasm',
      };
    });

    expect(runner.s.eventLog.filter((entry) => entry.includes('COMPLICATION'))).toHaveLength(1);
    expect(runner.s._bronchoActive).toBe(true);
    expect(runner.log.filter(({ meta }) => meta?.eventId === 'assessment_ready')).toHaveLength(1);
  });
});
