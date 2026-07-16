import { describe, expect, test } from 'vitest';
import emergenceRubric from '../../data/rubrics/carson-newman-anesthesia-emergence.json';
import rsiRubric from '../../data/rubrics/carson-newman-rsi-induction.json';
import standardRubric from '../../data/rubrics/carson-newman-standard-iv-induction.json';
import emergenceScenario from '../sim/scenarios/emergence_residual_block_001.json';
import failedRsiScenario from '../sim/scenarios/rsi_failed_first_attempt_001.json';
import rsiScenario from '../sim/scenarios/rsi_full_stomach_001.json';
import standardScenario from '../sim/scenarios/standard_iv_healthy_001.json';
import { ScenarioManager } from '../sim/scenario/scenarioManager.js';
import { normalize } from '../sim/scenario/scenarioLoader.js';
import { SimRunner, VentMode } from '../ui/simRunner.js';

const CASES = [
  [standardScenario, standardRubric],
  [rsiScenario, rsiRubric],
  [emergenceScenario, emergenceRubric],
  [failedRsiScenario, rsiRubric],
];

function scoreInstructorRows(session, points = 2) {
  const tSec = session.getLiveResult().trace.at(-1)?.t ?? 0;
  for (const item of session.rubric.items) {
    if (item.scoringSource === 'INSTRUCTOR_OBSERVED') {
      session.setInstructorScore({ itemId: item.id, points, tSec });
    }
  }
  return session.finalize({ tSec });
}

function procedureActions(runner) {
  return runner.rubricSession.getLiveResult().actionLedger
    .map(({ action }) => action)
    .filter((action) => /^(cricoid_|mask_ppv_|intubation_attempt_)/.test(action));
}

describe('rubric scenario definition contract', () => {
  test('ships four stable, uniquely seeded scenarios mapped to literal rubrics', () => {
    expect(new Set(CASES.map(([scenario]) => scenario.id)).size).toBe(4);
    expect(new Set(CASES.map(([scenario]) => scenario.seed)).size).toBe(4);

    for (const [scenario, rubric] of CASES) {
      expect(scenario).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        seed: expect.any(Number),
        rubricId: rubric.id,
        rubricCriteria: expect.objectContaining({ weightKg: scenario.patientProfile.weightKg }),
        patientProfile: expect.any(Object),
        startingSetup: expect.any(Object),
        events: expect.any(Array),
        airwayPlan: expect.objectContaining({
          failedIntubationAttempts: expect.any(Array),
          intubationAttemptDurationSeconds: expect.any(Number),
        }),
        debrief: expect.any(Object),
      });
      expect(Number.isSafeInteger(scenario.seed)).toBe(true);
      expect(scenario.seed).toBeGreaterThanOrEqual(0);
      expect(scenario.startingSetup).toEqual(expect.objectContaining({
        airway: expect.stringMatching(/^(mask|ett)$/),
        ventMode: expect.any(String),
        fio2: expect.any(Number),
      }));
    }

    expect(standardScenario).toMatchObject({
      patientProfile: { weightKg: 70 },
      startingSetup: { airway: 'mask', fio2: 0.21, ventMode: 'manual', oxygenOn: false },
      airwayPlan: { failedIntubationAttempts: [] },
      administrativeSetup: null,
      rubricCriteria: {
        acceptedInductionDrugs: expect.arrayContaining(['Propofol']),
        acceptedNmbDrugs: expect.arrayContaining(['Rocuronium']),
        minimumPpvMinuteVentilation: expect.any(Number),
      },
    });
    expect(rsiScenario).toMatchObject({
      startingSetup: { airway: 'mask', fio2: 0.21, ventMode: 'manual', oxygenOn: false },
      airwayPlan: { failedIntubationAttempts: [] },
      administrativeSetup: null,
      rubricCriteria: {
        preoxygenationDurationSec: 180,
        preoxygenationFiO2Min: 0.99,
        etco2ConfirmationSamples: 5,
      },
    });
    expect(rsiScenario.patientProfile.weightKg
      / ((rsiScenario.patientProfile.heightCm / 100) ** 2)).toBeGreaterThan(30);
    expect(emergenceScenario).toMatchObject({
      startingSetup: {
        airway: 'ett', ventMode: 'vcv', vaporizerDial: expect.any(Number),
      },
      administrativeSetup: {
        instructorNmbTarget: { targetTofRatio: expect.any(Number) },
        preconditioningDurationSeconds: expect.any(Number),
      },
    });
    expect(emergenceScenario.administrativeSetup.instructorNmbTarget.targetTofRatio)
      .toBeLessThan(0.9);
    expect((emergenceScenario.administrativeSetup.preconditioningDurationSeconds * 50) % 1)
      .toBe(0);
    expect(failedRsiScenario.airwayPlan.failedIntubationAttempts).toEqual([1]);
  });

  test('normalizes additive defaults and defensively copies new nested fields', () => {
    const accepted = ['Propofol'];
    const admin = {
      instructorNmbTarget: { targetTofRatio: 0.25 },
      preconditioningDurationSeconds: 20,
    };
    const raw = {
      id: 'copy_probe',
      tags: ['legacy'],
      events: [],
      expectedActions: [],
      dangerousActions: [],
      rubricCriteria: { weightKg: 70, acceptedInductionDrugs: accepted },
      administrativeSetup: admin,
      seed: 'invalid',
    };

    const normalized = normalize(raw);
    accepted.push('Ketamine');
    admin.instructorNmbTarget.targetTofRatio = 1;

    expect(normalized).toMatchObject({
      id: 'copy_probe', tags: ['legacy'], rubricId: '', seed: 12345,
      rubricCriteria: { weightKg: 70, acceptedInductionDrugs: ['Propofol'] },
      administrativeSetup: {
        instructorNmbTarget: { targetTofRatio: 0.25 },
        preconditioningDurationSeconds: 20,
      },
    });
    normalized.rubricCriteria.acceptedInductionDrugs.push('Etomidate');
    expect(accepted).toEqual(['Propofol', 'Ketamine']);
  });
});

describe('atomic deterministic rubric scenario loading', () => {
  test('rejects mismatches and malformed administration before any runner mutation', () => {
    const runner = new SimRunner();
    const originalSession = runner.attachRubricSession({
      rubric: standardRubric, criteria: { weightKg: 70 },
    });
    runner.logEvent('Probe', 'preserve me', { action: 'condition', name: 'probe' });
    let tickEmissions = 0;
    let eventEmissions = 0;
    runner.onTick = () => { tickEmissions += 1; };
    runner.onEvent = () => { eventEmissions += 1; };
    const before = {
      core: runner.core,
      snapshot: JSON.stringify(runner.snapshot()),
      log: JSON.stringify(runner.log),
      sessionResult: originalSession.getLiveResult(),
      running: runner.running,
    };

    expect(() => runner.loadRubricScenario({
      scenario: standardScenario,
      rubric: rsiRubric,
    })).toThrow(/rubricId|mismatch/i);
    const invalidAdmin = structuredClone(emergenceScenario);
    invalidAdmin.administrativeSetup.preconditioningDurationSeconds = 0.015;
    expect(() => runner.loadRubricScenario({
      scenario: invalidAdmin,
      rubric: emergenceRubric,
    })).toThrow(/fixed-step|aligned/i);
    const invalidSeed = structuredClone(standardScenario);
    invalidSeed.seed = '31001';
    expect(() => runner.loadRubricScenario({
      scenario: invalidSeed,
      rubric: standardRubric,
    })).toThrow(/seed/i);

    expect(runner.core).toBe(before.core);
    expect(JSON.stringify(runner.snapshot())).toBe(before.snapshot);
    expect(JSON.stringify(runner.log)).toBe(before.log);
    expect(runner.rubricSession).toBe(originalSession);
    expect(originalSession.getLiveResult()).toBe(before.sessionResult);
    expect(runner.running).toBe(before.running);
    expect(tickEmissions).toBe(0);
    expect(eventEmissions).toBe(0);
  });

  test.each(CASES)('loads $0.id through one seed and completes every rubric row', (scenario, rubric) => {
    const runner = new SimRunner();
    const callerScenario = structuredClone(scenario);
    const callerRubric = structuredClone(rubric);
    const loaded = runner.loadRubricScenario({ scenario: callerScenario, rubric: callerRubric });
    callerScenario.patientProfile.weightKg = 1;
    callerScenario.rubricCriteria.weightKg = 1;
    callerRubric.title = 'mutated';

    expect(loaded).toMatchObject({
      ok: true, scenarioId: scenario.id, rubricId: rubric.id, seed: scenario.seed,
    });
    expect(runner).toMatchObject({ activeSeed: scenario.seed, simTime: 0 });
    expect(runner.core).toMatchObject({ seed: scenario.seed, tickCount: 0, simTime: 0 });
    expect(runner.core.rng.seed).toBe(scenario.seed);
    expect(runner.s).toMatchObject({ seed: scenario.seed, elapsedTime: 0 });
    expect(runner.s.activeScenario).toMatchObject({
      id: scenario.id,
      seed: scenario.seed,
      rubricId: rubric.id,
      rubricCriteria: scenario.rubricCriteria,
      patientProfile: { weightKg: scenario.patientProfile.weightKg },
    });
    expect(runner.a.failedIntubationAttempts).toEqual(
      scenario.airwayPlan.failedIntubationAttempts,
    );
    expect(runner.a.attemptDurationSeconds)
      .toBe(Math.fround(scenario.airwayPlan.intubationAttemptDurationSeconds));
    expect(runner.rubricSession).toMatchObject({
      seed: scenario.seed,
      criteria: scenario.rubricCriteria,
    });
    const [initialTrace] = runner.rubricSession.getLiveResult().trace;
    expect(initialTrace).toMatchObject({
      t: 0,
      airwayDevice: scenario.startingSetup.airway === 'ett' ? 'intubated' : 'mask',
      ventMode: { manual: 0, vcv: 1, pcv: 2, psv: 3 }[scenario.startingSetup.ventMode],
      ventSetFiO2: scenario.startingSetup.fio2,
    });
    expect(runner.snapshot().activeRubricScenario).toMatchObject({
      id: scenario.id, rubricId: rubric.id, seed: scenario.seed,
    });
    loaded.initialSnapshot.airwayDevice = 'caller mutation';
    expect(runner.compactRubricSnapshot(0).airwayDevice).not.toBe('caller mutation');

    const final = scoreInstructorRows(runner.rubricSession);
    expect(final).toMatchObject({
      ok: true,
      rubricId: rubric.id,
      finalized: true,
      incomplete: false,
      pendingInstructorCount: 0,
      pendingEngineCount: 0,
      pendingUnscoreableCount: 0,
      items: expect.any(Array),
      outcome: expect.stringMatching(/^(PASS|NOT PASS)$/),
    });
    expect(final.items).toHaveLength(rubric.items.length);
  });

  test('starts the residual-block learner clock after deterministic administrative preconditioning', () => {
    function load() {
      const runner = new SimRunner();
      runner.loadRubricScenario({ scenario: emergenceScenario, rubric: emergenceRubric });
      return runner;
    }
    const first = load();
    const second = load();
    const firstResult = first.rubricSession.getLiveResult();
    const firstTrace = firstResult.trace[0];

    expect(firstTrace).toMatchObject({
      t: 0,
      airwayDevice: 'intubated',
      ventMode: VentMode.VCV,
      capnogramPresent: true,
      vaporizer: expect.any(Number),
      mechanicalMV: expect.any(Number),
    });
    expect(firstTrace.vaporizer).toBeGreaterThan(0);
    expect(firstTrace.mechanicalMV).toBeGreaterThan(0);
    expect(firstTrace.tofRatio).toBeLessThan(0.9);
    expect(firstResult.actionLedger).toEqual([]);
    expect(firstResult.trace.map(({ t }) => t)).toEqual([0]);
    expect(first).toMatchObject({ simTime: 0 });
    expect(first.core).toMatchObject({ simTime: 0, tickCount: 0 });
    expect(first.a.timeSec).toBe(0);
    expect(first.s.elapsedTime).toBe(0);
    expect(first.log).toEqual([]);
    expect(first.snapshot().instructorNmbTarget).toMatchObject({
      source: 'administrative',
      targetTofRatio: emergenceScenario.administrativeSetup.instructorNmbTarget.targetTofRatio,
      actualTofRatio: firstTrace.tofRatio,
    });
    expect(JSON.stringify({
      trace: second.rubricSession.getLiveResult().trace,
      snapshot: second.compactRubricSnapshot(0),
      target: second.snapshot().instructorNmbTarget,
    })).toBe(JSON.stringify({
      trace: firstResult.trace,
      snapshot: first.compactRubricSnapshot(0),
      target: first.snapshot().instructorNmbTarget,
    }));
  });

  test('preserves a loaded rubric scenario across reset with an identical fresh learner session', () => {
    const runner = new SimRunner();
    runner.loadRubricScenario({ scenario: emergenceScenario, rubric: emergenceRubric });
    const initial = JSON.stringify({
      trace: runner.rubricSession.getLiveResult().trace,
      target: runner.snapshot().instructorNmbTarget,
    });
    runner.stepFor(1);
    runner.checkTrainOfFour();

    runner.reset();

    expect(runner.snapshot().activeRubricScenario.id).toBe(emergenceScenario.id);
    expect(runner.rubricSession.getLiveResult().actionLedger).toEqual([]);
    expect(JSON.stringify({
      trace: runner.rubricSession.getLiveResult().trace,
      target: runner.snapshot().instructorNmbTarget,
    })).toBe(initial);
  });

  test('honors a caller-declared alternate seed without changing the source definition', () => {
    const alternate = structuredClone(standardScenario);
    alternate.id = 'standard_iv_healthy_seed_probe';
    alternate.seed += 101;
    const runner = new SimRunner();
    const sourceRunner = new SimRunner();

    runner.loadRubricScenario({ scenario: alternate, rubric: standardRubric });
    sourceRunner.loadRubricScenario({ scenario: standardScenario, rubric: standardRubric });
    runner.stepFor(1);
    sourceRunner.stepFor(1);

    expect(runner.activeSeed).toBe(alternate.seed);
    expect(runner.core.seed).toBe(alternate.seed);
    expect(runner.s.seed).toBe(alternate.seed);
    expect(runner.rubricSession.seed).toBe(alternate.seed);
    expect(standardScenario.seed).not.toBe(alternate.seed);
    expect(JSON.stringify(runner.compactRubricSnapshot(1)))
      .not.toBe(JSON.stringify(sourceRunner.compactRubricSnapshot(1)));
  });
});

describe('scoreable scenario paths', () => {
  test('standard IV records adequate mask PPV before NMB and during onset', () => {
    const runner = new SimRunner();
    runner.loadRubricScenario({ scenario: standardScenario, rubric: standardRubric });

    runner.deliverMaskVentilation({
      durationSeconds: 30, tidalVolumeMl: 500, respiratoryRate: 12,
    });
    runner.pause();
    runner.giveBolus('Rocuronium', 50);
    runner.pause();
    runner.stepFor(10);

    const ledger = runner.rubricSession.getLiveResult().actionLedger;
    const ppv = ledger.findIndex(({ action }) => action === 'mask_ppv_started');
    const nmb = ledger.findIndex(({ action, meta }) => (
      action === 'drug' && meta.drug === 'Rocuronium'
    ));
    expect(ppv).toBeGreaterThanOrEqual(0);
    expect(ppv).toBeLessThan(nmb);
    expect(runner.snapshot()).toMatchObject({
      ppvActive: true, airwayDevice: 'mask', mechanicalMV: 6,
    });
  });

  test('successful RSI reaches first laryngoscopy without prior mask PPV', () => {
    const runner = new SimRunner();
    runner.loadRubricScenario({ scenario: rsiScenario, rubric: rsiRubric });
    runner.giveBolus('Propofol', 200);
    runner.pause();
    runner.giveBolus('Rocuronium', 100);
    runner.pause();
    runner.applyCricoidPressure();
    runner.pause();
    runner.attemptIntubation();
    runner.pause();

    const actions = runner.rubricSession.getLiveResult().actionLedger.map(({ action }) => action);
    const firstAttempt = actions.indexOf('intubation_attempt_started');
    expect(firstAttempt).toBeGreaterThanOrEqual(0);
    expect(actions.slice(0, firstAttempt)).not.toContain('mask_ppv_started');
  });

  test('failed RSI preserves the deterministic rescue, oxygenation, and attempt histories', () => {
    const runner = new SimRunner();
    runner.loadRubricScenario({ scenario: failedRsiScenario, rubric: rsiRubric });
    runner.giveBolus('Propofol', 200);
    runner.pause();
    runner.giveBolus('Rocuronium', 100);
    runner.pause();
    runner.applyCricoidPressure();
    runner.pause();
    runner.attemptIntubation();
    runner.pause();
    runner.stepFor(failedRsiScenario.airwayPlan.intubationAttemptDurationSeconds);
    const failedSpO2 = runner.snapshot().spo2;
    expect(runner.snapshot()).toMatchObject({
      airwayDevice: 'mask', intubationAttemptCount: 1, lastIntubationOutcome: 'failed',
    });

    runner.preoxygenate();
    runner.pause();
    runner.deliverMaskVentilation({
      durationSeconds: 30,
      tidalVolumeMl: 600,
      respiratoryRate: 14,
      cricoidPressure: true,
    });
    runner.pause();
    runner.stepFor(30);
    const rescuedSpO2 = runner.snapshot().spo2;
    runner.attemptIntubation();
    runner.pause();
    runner.stepFor(failedRsiScenario.airwayPlan.intubationAttemptDurationSeconds);
    runner.setVentMode(VentMode.VCV);
    runner.setMachine({
      setTidalVolume: 550,
      setRespiratoryRate: 12,
      setPeep: 5,
      setFiO2: 1,
      o2FlowLPerMin: 10,
    });
    // VCV derives its first measured tidal volume at the first complete
    // breath, then supplies at least five one-second sustained samples.
    runner.stepFor(11);
    runner.confirmEtco2();
    runner.releaseCricoidPressure();

    expect(rescuedSpO2 - failedSpO2)
      .toBeGreaterThanOrEqual(failedRsiScenario.rubricCriteria.failedAttemptSpo2RecoveryDelta);
    expect(runner.snapshot()).toMatchObject({
      airwayDevice: 'intubated',
      intubationAttemptCount: 2,
      lastIntubationOutcome: 'succeeded',
      capnogramPresent: true,
    });
    expect(runner.a.intubationAttempts).toHaveLength(2);
    expect(runner.a.intubationAttempts.map(({ outcome }) => outcome)).toEqual(['failed', 'succeeded']);
    expect(runner.a.intubationAttempts[0]).toMatchObject({
      attemptNumber: 1,
      spo2Nadir: expect.any(Number),
      desaturatedBelow90: true,
      timeToSpo2_90Sec: expect.any(Number),
    });
    expect(runner.a.intubationAttempts[0].timeToSpo2_90Sec).toBeGreaterThan(0);
    expect(runner.a.intubationAttempts[0].spo2Nadir).toBeLessThanOrEqual(failedSpO2);
    expect(procedureActions(runner)).toEqual([
      'cricoid_pressure_applied',
      'intubation_attempt_started',
      'intubation_attempt_failed',
      'mask_ppv_started',
      'mask_ppv_completed',
      'intubation_attempt_started',
      'intubation_attempt_succeeded',
      'cricoid_pressure_released',
    ]);
    const postSuccess = runner.rubricSession.getLiveResult().trace.filter((sample) => (
      sample.airwayDevice === 'intubated'
      && sample.capnogramPresent === true
      && sample.etco2 > 0
      && sample.mechanicalMV > 0
    ));
    expect(postSuccess.length).toBeGreaterThanOrEqual(5);
  });

  test('repeats complete action, trace, and airway histories byte-for-byte', () => {
    function run() {
      const runner = new SimRunner();
      runner.loadRubricScenario({ scenario: failedRsiScenario, rubric: rsiRubric });
      runner.applyCricoidPressure();
      runner.pause();
      runner.attemptIntubation();
      runner.pause();
      runner.stepFor(failedRsiScenario.airwayPlan.intubationAttemptDurationSeconds);
      runner.preoxygenate();
      runner.pause();
      runner.deliverMaskVentilation({
        durationSeconds: 10, tidalVolumeMl: 600, respiratoryRate: 14,
      });
      runner.pause();
      runner.stepFor(10);
      return JSON.stringify({
        actions: runner.rubricSession.getLiveResult().actionLedger,
        trace: runner.rubricSession.getLiveResult().trace,
        attempts: runner.a.intubationAttempts,
        ppv: runner.a.ppvHistory,
        cricoid: runner.a.cricoidPressureHistory,
      });
    }

    expect(run()).toBe(run());
  });
});

describe('rubric scenario lifecycle hardening', () => {
  const invalidCases = [
    ['missing baseline HR', (scenario) => { delete scenario.patientProfile.baselineHR; }],
    ['string baseline HR', (scenario) => { scenario.patientProfile.baselineHR = '84'; }],
    ['NaN baseline HR', (scenario) => { scenario.patientProfile.baselineHR = Number.NaN; }],
    ['infinite baseline HR', (scenario) => {
      scenario.patientProfile.baselineHR = Number.POSITIVE_INFINITY;
    }],
    ['negative baseline RR', (scenario) => { scenario.patientProfile.baselineRR = -1; }],
    ['invalid sex', (scenario) => { scenario.patientProfile.sex = 'Other'; }],
    ['string tidal volume', (scenario) => { scenario.startingSetup.tidalVolume = '500'; }],
    ['string oxygen flow', (scenario) => { scenario.startingSetup.o2FlowLPerMin = '10'; }],
    ['invalid FiO2', (scenario) => { scenario.startingSetup.fio2 = 1.1; }],
    ['invalid vent mode', (scenario) => { scenario.startingSetup.ventMode = 'SIMV'; }],
    ['invalid airway', (scenario) => { scenario.startingSetup.airway = 'native'; }],
    ['string vaporizer dial', (scenario) => { scenario.startingSetup.vaporizerDial = '2'; }],
    ['invalid attempt duration', (scenario) => {
      scenario.airwayPlan.intubationAttemptDurationSeconds = -30;
    }],
    ['unsigned-only seed', (scenario) => { scenario.seed = 0x80000000; }],
    ['invalid criteria', (scenario) => {
      scenario.rubricCriteria.etco2ConfirmationSamples = 2.5;
    }],
    ['malformed administration', (scenario) => {
      scenario.administrativeSetup = {
        instructorNmbTarget: { targetTofRatio: '0.25' },
        preconditioningDurationSeconds: 20,
      };
    }],
  ];

  test.each(invalidCases)(
    'rejects %s before touching a running runner',
    (_label, mutate) => {
      const runner = new SimRunner();
      const oldSession = runner.attachRubricSession({
        rubric: standardRubric, criteria: { weightKg: 70 },
      });
      runner.logEvent('Probe', 'preserve', { action: 'condition', name: 'atomic' });
      const onTick = () => {};
      const onEvent = () => {};
      runner.onTick = onTick;
      runner.onEvent = onEvent;
      runner.start();
      const scenario = structuredClone(standardScenario);
      mutate(scenario);
      const before = {
        core: runner.core,
        patient: runner.p,
        airway: runner.a,
        listener: runner._procedureUnsubscribe,
        session: runner.rubricSession,
        log: runner.log,
        config: runner.config,
        active: runner._activeRubricScenario,
        loaded: runner._loadedRubricScenario,
        lastReal: runner._lastReal,
        accum: runner._accum,
        snapshot: JSON.stringify(runner.snapshot()),
      };

      expect(() => runner.loadRubricScenario({ scenario, rubric: standardRubric })).toThrow();

      expect(runner).toMatchObject({
        core: before.core,
        p: before.patient,
        a: before.airway,
        rubricSession: before.session,
        log: before.log,
        config: before.config,
        _activeRubricScenario: before.active,
        _loadedRubricScenario: before.loaded,
        _lastReal: before.lastReal,
        _accum: before.accum,
        running: true,
        onTick,
        onEvent,
      });
      expect(runner._procedureUnsubscribe).toBe(before.listener);
      expect(JSON.stringify(runner.snapshot())).toBe(before.snapshot);
      const tickBefore = runner.core.tickCount;
      runner._tick(runner._lastReal + 20);
      expect(runner.running).toBe(true);
      expect(runner.core.tickCount).toBe(tickBefore + 1);
      runner.pause();
    },
  );

  test('keeps the active runner atomic when off-side candidate construction fails', () => {
    const runner = new SimRunner();
    runner.start();
    const before = {
      core: runner.core,
      log: runner.log,
      config: runner.config,
      lastReal: runner._lastReal,
      snapshot: JSON.stringify(runner.snapshot()),
    };
    runner._createRubricScenarioCandidate = () => {
      throw new Error('candidate-stage probe');
    };

    expect(() => runner.loadRubricScenario({
      scenario: standardScenario, rubric: standardRubric,
    })).toThrow(/candidate-stage probe/);

    expect(runner.core).toBe(before.core);
    expect(runner.log).toBe(before.log);
    expect(runner.config).toBe(before.config);
    expect(runner._lastReal).toBe(before.lastReal);
    expect(JSON.stringify(runner.snapshot())).toBe(before.snapshot);
    expect(runner.running).toBe(true);
    const tickBefore = runner.core.tickCount;
    runner._tick(runner._lastReal + 20);
    expect(runner.core.tickCount).toBe(tickBefore + 1);
    runner.pause();
  });

  test('leaves a progressed paused runner bit-identical after invalid loading', () => {
    const runner = new SimRunner();
    runner.stepFor(1);
    const invalid = structuredClone(standardScenario);
    invalid.startingSetup.vaporizerDial = 'bad';
    const before = {
      core: runner.core,
      session: runner.rubricSession,
      log: runner.log,
      config: runner.config,
      snapshot: JSON.stringify(runner.snapshot()),
    };

    expect(() => runner.loadRubricScenario({
      scenario: invalid, rubric: standardRubric,
    })).toThrow(/vaporizerDial|finite/);

    expect(runner.core).toBe(before.core);
    expect(runner.rubricSession).toBe(before.session);
    expect(runner.log).toBe(before.log);
    expect(runner.config).toBe(before.config);
    expect(JSON.stringify(runner.snapshot())).toBe(before.snapshot);
    expect(runner.snapshot().lifecycle).toBe('PAUSED');
  });

  test('adopts one real procedure listener and emits one coherent loaded snapshot', () => {
    const runner = new SimRunner();
    const emissions = [];
    const events = [];
    runner.onTick = (snapshot) => emissions.push(snapshot);
    runner.onEvent = (entry) => events.push(entry);

    runner.loadRubricScenario({ scenario: standardScenario, rubric: standardRubric });

    expect(emissions).toHaveLength(1);
    expect(emissions[0].activeRubricScenario.id).toBe(standardScenario.id);
    expect(events).toEqual([]);
    runner.applyCricoidPressure();
    runner.pause();
    expect(runner.log.filter(({ meta }) => meta?.action === 'cricoid_pressure_applied'))
      .toHaveLength(1);
    expect(runner.rubricSession.getLiveResult().actionLedger
      .filter(({ action }) => action === 'cricoid_pressure_applied')).toHaveLength(1);
  });

  test('rebases every independent learner clock and deterministic ventilator phase', () => {
    function loadAndSample() {
      const runner = new SimRunner();
      runner.loadRubricScenario({ scenario: emergenceScenario, rubric: emergenceRubric });
      expect(runner.l).toMatchObject({ timeSec: 0, tickCount: 0 });
      expect(runner.l.doseHistory).toEqual([]);
      expect(runner.l.toxicityHistory).toEqual([]);
      expect(runner.v.breathCyclePhase).toBe(0);
      expect(runner.s.eventLog).toEqual([]);
      const samples = [];
      for (let index = 0; index < 7; index += 1) {
        runner.stepFor(1);
        samples.push(runner.compactRubricSnapshot(index + 1));
      }
      return { runner, samples };
    }

    const first = loadAndSample();
    const second = loadAndSample();
    expect(JSON.stringify(first.samples)).toBe(JSON.stringify(second.samples));
    first.runner.reset();
    expect(first.runner.s.eventLog).toEqual([]);
    const resetSamples = [];
    for (let index = 0; index < 7; index += 1) {
      first.runner.stepFor(1);
      resetSamples.push(first.runner.compactRubricSnapshot(index + 1));
    }
    expect(JSON.stringify(resetSamples)).toBe(JSON.stringify(second.samples));

    const actionRunner = new SimRunner();
    actionRunner.loadRubricScenario({ scenario: emergenceScenario, rubric: emergenceRubric });
    actionRunner.giveLidocaineBolus({ doseMgPerKg: 1.5 });
    actionRunner.pause();
    expect(actionRunner.l.doseHistory[0].tSec).toBe(0);
    expect(actionRunner.log.at(-1).t).toBe(0);
    expect(actionRunner.rubricSession.getLiveResult().actionLedger.at(-1).tSec).toBe(0);
  });

  test('preserves assessment and expected-action maxima across administrative rebase', () => {
    const definition = structuredClone(standardScenario);
    definition.id = 'max_score_rebase_probe';
    definition.events = [{
      triggerTimeSeconds: 0,
      typeName: 'assessment',
      description: 'Satisfiable assessment',
      expectedAction: 'CallForHelp',
      points: 7,
    }];
    definition.expectedActions = [{ action: 'call_for_help', points: 11 }];
    const ordinary = new SimRunner();
    ordinary.s.loadRaw(definition);
    ordinary.s.startScenario();
    expect(ordinary.s.maxPossibleScore).toBe(18);

    definition.administrativeSetup = {
      instructorNmbTarget: { targetTofRatio: 0.5 },
      preconditioningDurationSeconds: 0.02,
    };
    const preconditioned = new SimRunner();
    preconditioned.loadRubricScenario({ scenario: definition, rubric: standardRubric });

    expect(preconditioned.s.maxPossibleScore).toBe(18);
  });

  test('keeps persistent live configuration through multiple rubric scenarios', () => {
    const runner = new SimRunner();
    runner.applyConfig({ weightKg: 91, ageYears: 63, sex: 'Female' });
    expect(runner.config).toMatchObject({ weightKg: 91, ageYears: 63, sex: 'Female' });

    runner.loadRubricScenario({ scenario: standardScenario, rubric: standardRubric });
    expect(runner.snapshot()).toMatchObject({
      weightKg: standardScenario.patientProfile.weightKg,
      patient: expect.stringContaining(`${standardScenario.patientProfile.weightKg} kg`),
    });
    runner.loadRubricScenario({ scenario: rsiScenario, rubric: rsiRubric });
    expect(runner.snapshot().weightKg).toBe(rsiScenario.patientProfile.weightKg);
    expect(runner.config).toMatchObject({
      weightKg: rsiScenario.patientProfile.weightKg,
      ageYears: rsiScenario.patientProfile.ageYears,
      sex: rsiScenario.patientProfile.sex,
    });

    runner.applyConfig({ baselineHR: 75 });

    expect(runner.snapshot()).toMatchObject({
      activeRubricScenario: null,
      weightKg: 91,
      patient: '91 kg · 63 y · Female',
      hr: 75,
    });
    expect(runner.config).toMatchObject({ weightKg: 91, ageYears: 63, sex: 'Female' });
  });

  test('rejects administrative rebase on an ordinary progressed paused case without mutation', () => {
    const runner = new SimRunner();
    runner.stepFor(0.02);
    runner.s.pauseScenario();
    const before = JSON.stringify({
      elapsedTime: runner.s.elapsedTime,
      state: runner.s.state,
      eventLog: runner.s.eventLog,
      score: runner.s.currentScore,
      run: runner.s.run,
    });

    expect(() => runner.s.beginAdministrativePreconditioning()).toThrow(/pristine|elapsed|admin/i);
    expect(() => runner.s.rebaseLearnerRun()).toThrow(/administrative|eligible/i);
    expect(JSON.stringify({
      elapsedTime: runner.s.elapsedTime,
      state: runner.s.state,
      eventLog: runner.s.eventLog,
      score: runner.s.currentScore,
      run: runner.s.run,
    })).toBe(before);
  });

  test('returns snapshots from reset in generic and rubric modes', () => {
    const generic = new SimRunner();
    expect(generic.reset()).toEqual(generic.snapshot());
    const rubric = new SimRunner();
    rubric.loadRubricScenario({ scenario: emergenceScenario, rubric: emergenceRubric });
    const reset = rubric.reset();
    expect(reset).toEqual(rubric.snapshot());
    expect(reset).not.toHaveProperty('ok');
    expect(reset.activeRubricScenario.id).toBe(emergenceScenario.id);
  });

  test('rejects missing and forged administrative capabilities before mutation', () => {
    expect(new SimRunner().s.requireAdministrativePreconditioningCapability).toBeUndefined();
    for (const capability of [undefined, Object.freeze({ forged: true })]) {
      const runner = new SimRunner();
      const before = JSON.stringify({
        state: runner.s.state,
        elapsedTime: runner.s.elapsedTime,
        eventLog: runner.s.eventLog,
        run: runner.s.run,
      });

      expect(() => runner.s.beginAdministrativePreconditioning(capability))
        .toThrow(/capability|authoriz/i);
      expect(() => runner.s.rebaseLearnerRun(capability)).toThrow(/capability|authoriz/i);
      expect(JSON.stringify({
        state: runner.s.state,
        elapsedTime: runner.s.elapsedTime,
        eventLog: runner.s.eventLog,
        run: runner.s.run,
      })).toBe(before);
    }
  });

  test('cannot erase a t0 learner propofol dose through public administrative rebasing', () => {
    const runner = new SimRunner();
    runner.giveBolus('Propofol', 100);
    runner.pause();
    const before = JSON.stringify({
      state: runner.s.state,
      elapsedTime: runner.s.elapsedTime,
      eventLog: runner.s.eventLog,
      log: runner.log,
      propofolCentral: runner.d._ppfA1,
      run: runner.s.run,
    });

    expect(() => runner.s.beginAdministrativePreconditioning()).toThrow(/capability|authoriz/i);
    expect(() => runner.s.rebaseLearnerRun()).toThrow(/capability|authoriz/i);

    expect(JSON.stringify({
      state: runner.s.state,
      elapsedTime: runner.s.elapsedTime,
      eventLog: runner.s.eventLog,
      log: runner.log,
      propofolCentral: runner.d._ppfA1,
      run: runner.s.run,
    })).toBe(before);
    expect(runner.d._ppfA1).toBe(100);
  });

  test.each([
    ['lidocaine action', (runner) => runner.giveLidocaineBolus({ doseMgPerKg: 1 })],
    ['procedure action', (runner) => runner.applyCricoidPressure()],
    ['runner log', (runner) => runner.logEvent('Probe', 'learner-visible')],
  ])('cannot publicly rebase after a t0 %s', (_label, expose) => {
    const runner = new SimRunner();
    expose(runner);
    runner.pause();
    const before = JSON.stringify(runner.snapshot());

    expect(() => runner.s.beginAdministrativePreconditioning()).toThrow(/capability|authoriz/i);
    expect(() => runner.s.rebaseLearnerRun()).toThrow(/capability|authoriz/i);
    expect(JSON.stringify(runner.snapshot())).toBe(before);
  });

  test('uses active-case config for weight-based controls while preserving saved live config', () => {
    const runner = new SimRunner();
    runner.applyConfig({
      weightKg: 70, ageYears: 45, baselineHR: 72, sex: 'Male',
    });
    const heavyRsi = structuredClone(rsiScenario);
    heavyRsi.patientProfile.weightKg = 110;
    heavyRsi.patientProfile.ageYears = 52;
    heavyRsi.patientProfile.sex = 'Female';
    heavyRsi.rubricCriteria.weightKg = 110;

    runner.loadRubricScenario({ scenario: heavyRsi, rubric: rsiRubric });

    expect(runner.config).toMatchObject({ weightKg: 110, ageYears: 52, sex: 'Female' });
    expect(runner.p).toMatchObject({ weightKg: 110, ageYears: 52, sex: 'Female' });
    expect(runner.snapshot()).toMatchObject({
      weightKg: 110,
      patient: '110 kg · 52 y · Female',
    });
    const rocuroniumTotalMg = 0.6 * runner.config.weightKg;
    expect(rocuroniumTotalMg).toBe(66);
    runner.giveBolus('Rocuronium', rocuroniumTotalMg);
    runner.pause();
    expect(runner.log.at(-1)).toMatchObject({ meta: { drug: 'Rocuronium', doseMg: 66 } });

    // This instructor adjustment belongs to the active case only.
    runner.setBaselineLive('baselineHR', 91);
    expect(runner.config.baselineHR).toBe(91);
    expect(runner.p.baselineHR).toBe(91);

    const nextScenario = structuredClone(standardScenario);
    nextScenario.patientProfile.weightKg = 82;
    nextScenario.patientProfile.ageYears = 60;
    nextScenario.rubricCriteria.weightKg = 82;
    runner.loadRubricScenario({ scenario: nextScenario, rubric: standardRubric });
    expect(runner.config).toMatchObject({ weightKg: 82, ageYears: 60 });
    expect(runner.snapshot().weightKg).toBe(82);
    expect(runner.p.weightKg).toBe(82);

    runner.applyConfig({ ageYears: 46 });
    expect(runner.snapshot().activeRubricScenario).toBeNull();
    expect(runner.config).toMatchObject({
      weightKg: 70, ageYears: 46, baselineHR: 72, sex: 'Male',
    });
    expect(runner.p).toMatchObject({
      weightKg: 70, ageYears: 46, baselineHR: 72, sex: 'Male',
    });
  });

  test('persists live-mode baseline edits without leaking scenario-mode edits', () => {
    const runner = new SimRunner();
    runner.setBaselineLive('baselineHR', 77);
    expect(runner.config.baselineHR).toBe(77);
    runner.loadRubricScenario({ scenario: rsiScenario, rubric: rsiRubric });
    runner.setBaselineLive('baselineHR', 94);

    runner.applyConfig({ weightKg: 73 });

    expect(runner.config).toMatchObject({ weightKg: 73, baselineHR: 77 });
    expect(runner.p).toMatchObject({ weightKg: 73, baselineHR: 77 });
  });

  test('does not expose saved live array state through the public active config', () => {
    const runner = new SimRunner();
    runner.applyConfig({ failedIntubationAttempts: [2] });
    runner.config.failedIntubationAttempts.push(9);
    runner.loadRubricScenario({ scenario: rsiScenario, rubric: rsiRubric });

    runner.applyConfig({ ageYears: 46 });

    expect(runner.config.failedIntubationAttempts).toEqual([2]);
  });

  test.each([
    ['adds a learner-visible event', (scenarioManager) => {
      scenarioManager.logEvent('injected');
    }],
    ['removes the normal scenario-start event', (scenarioManager) => {
      scenarioManager.eventLog.pop();
    }],
  ])('rejects off-side candidate setup that %s before privileged begin', (_label, mutate) => {
    const runner = new SimRunner();
    const session = runner.attachRubricSession({
      rubric: standardRubric, criteria: { weightKg: 70 },
    });
    runner.logEvent('Probe', 'active runner must survive');
    const onTick = () => {};
    const onEvent = () => {};
    runner.onTick = onTick;
    runner.onEvent = onEvent;
    runner.start();
    const before = {
      core: runner.core,
      patient: runner.p,
      airway: runner.a,
      session,
      listener: runner._procedureUnsubscribe,
      log: runner.log,
      config: runner.config,
      lastReal: runner._lastReal,
      accum: runner._accum,
      snapshot: JSON.stringify(runner.snapshot()),
    };

    const originalSetMachine = SimRunner.prototype.setMachine;
    const originalBegin = ScenarioManager.prototype.beginAdministrativePreconditioning;
    let beginCallCount = 0;
    SimRunner.prototype.setMachine = function injectedSetMachine(patch) {
      const result = originalSetMachine.call(this, patch);
      mutate(this.s);
      return result;
    };
    ScenarioManager.prototype.beginAdministrativePreconditioning = function countedBegin(...args) {
      beginCallCount += 1;
      return originalBegin.apply(this, args);
    };

    let loadError = null;
    try {
      runner.loadRubricScenario({ scenario: emergenceScenario, rubric: emergenceRubric });
    } catch (error) {
      loadError = error;
    } finally {
      SimRunner.prototype.setMachine = originalSetMachine;
      ScenarioManager.prototype.beginAdministrativePreconditioning = originalBegin;
    }

    expect(loadError).toBeInstanceOf(Error);
    expect(loadError.message).toMatch(/baseline|pristine|construction|event/i);
    expect(beginCallCount).toBe(0);
    expect(runner).toMatchObject({
      core: before.core,
      p: before.patient,
      a: before.airway,
      rubricSession: before.session,
      log: before.log,
      config: before.config,
      _lastReal: before.lastReal,
      _accum: before.accum,
      running: true,
      onTick,
      onEvent,
    });
    expect(runner._procedureUnsubscribe).toBe(before.listener);
    expect(JSON.stringify(runner.snapshot())).toBe(before.snapshot);
    const tickBefore = runner.core.tickCount;
    runner._tick(runner._lastReal + 20);
    expect(runner.core.tickCount).toBe(tickBefore + 1);
    runner.pause();
  });
});
