import { describe, expect, it } from 'vitest';
import { buildPhysRig, VentMode } from '../sim/index.js';
import { SimRunner } from '../ui/simRunner.js';

function advanceUntil(rig, predicate, maxSeconds, stepSeconds = 1) {
  for (let elapsed = 0; elapsed < maxSeconds; elapsed += stepSeconds) {
    rig.core.stepFor(stepSeconds);
    if (predicate(rig)) return rig;
  }
  throw new Error(`Condition not reached within ${maxSeconds} seconds`);
}

function apneicParalyzedRig(seed) {
  const rig = buildPhysRig(seed, 70, 170, 45);
  rig.v.o2FlowLPerMin = 0;
  rig.v.airFlowLPerMin = 5;
  rig.v.n2oFlowLPerMin = 0;
  rig.v.setMode(VentMode.Manual);
  rig.d.administerBolus('Rocuronium', 210);
  advanceUntil(rig, ({ p }) => p.trainOfFourCount === 0, 300);
  rig.p.setForcedApnea(true);
  rig.v.o2FlowLPerMin = 10;
  rig.v.airFlowLPerMin = 0;
  return rig;
}

function advanceRunner(runner, seconds) {
  runner.core.stepFor(seconds);
  runner.simTime = runner.core.simTime;
  return runner.snapshot();
}

function actionNames(runner, included = null) {
  return runner.log
    .map((entry) => entry.meta?.action)
    .filter((action) => action && (included == null || included.has(action)));
}

function combinedDeterminismFingerprint() {
  const runner = new SimRunner();
  runner.configureIntubationAttempts({
    failedIntubationAttempts: [1],
    attemptDurationSeconds: 40,
  });
  runner.preoxygenate();
  advanceRunner(runner, 180);

  runner.deliverMaskVentilation({
    durationSeconds: 20, tidalVolumeMl: 500, respiratoryRate: 12,
  });
  const midPpv = advanceRunner(runner, 10);
  advanceRunner(runner, 10);

  runner.attemptIntubation();
  const midAttempt = advanceRunner(runner, 20);
  const completed = advanceRunner(runner, 20);

  return JSON.stringify({
    midPpv: {
      t: midPpv.t, spo2: midPpv.spo2, etco2: midPpv.etco2, eto2: midPpv.eto2,
      ppvActive: midPpv.ppvActive, mechanicalMV: midPpv.mechanicalMV,
      ppvCurrent: midPpv.ppvCurrent,
    },
    midAttempt: {
      t: midAttempt.t, spo2: midAttempt.spo2, etco2: midAttempt.etco2, eto2: midAttempt.eto2,
      intubationInProgress: midAttempt.intubationInProgress,
      proceduralApneaContribution: midAttempt.proceduralApneaContribution,
      attempt: midAttempt.intubationAttempts[0],
    },
    completed: {
      t: completed.t, spo2: completed.spo2, etco2: completed.etco2,
      outcome: completed.lastIntubationOutcome,
      airwayDevice: completed.airwayDevice,
      ppvHistory: completed.ppvHistory,
      attempts: completed.intubationAttempts,
    },
    log: runner.log,
  });
}

describe('airway gaps evidence', () => {
  it('mask PPV maintains gas exchange in an apneic paralyzed patient while withholding it desaturates', () => {
    const supported = apneicParalyzedRig(8201);
    const withheld = apneicParalyzedRig(8201);
    const supportedStart = supported.p.spO2;
    const withheldStart = withheld.p.spO2;

    expect(supported.a.deliverMaskVentilation({
      durationSeconds: 120,
      tidalVolumeMl: 500,
      respiratoryRate: 12,
    }).ok).toBe(true);
    supported.core.stepFor(120);
    withheld.core.stepFor(120);

    expect(supported.p.forcedApneaContribution).toBe(0);
    expect(supported.p.respiratoryMuscleCapability).toBeLessThan(0.1);
    expect(supported.v.mechanicalMinuteVentilation).toBeCloseTo(6, 4);
    expect(supported.v.effectiveMinuteVentilation).toBeGreaterThan(5.9);
    expect(supported.p.capnogramPresent).toBe(true);
    expect(supported.p.spO2).toBeGreaterThanOrEqual(95);
    expect(supported.p.spO2).toBeGreaterThanOrEqual(supportedStart - 2);

    expect(withheld.v.effectiveMinuteVentilation).toBe(0);
    expect(withheld.p.capnogramPresent).toBe(false);
    expect(withheld.p.spO2).toBeLessThan(withheldStart);
    expect(withheld.p.spO2).toBeLessThan(90);
  });

  it('laryngoscopy inhibits mask PPV and configured mandatory support for the full attempt', () => {
    const rig = buildPhysRig(8202, 70, 170, 45);
    rig.v.setMode(VentMode.VCV);
    rig.v.setTidalVolume = 500;
    rig.v.setRespiratoryRate = 12;
    rig.core.stepFor(6);
    expect(rig.v.mechanicalMinuteVentilation).toBeGreaterThan(4);
    rig.a.configureIntubation({ failedIntubationAttempts: [1], attemptDurationSeconds: 2 });
    rig.a.deliverMaskVentilation({ durationSeconds: 10 });

    rig.a.attemptIntubation();
    rig.core.stepFor(1);

    expect(rig.a.intubationInProgress).toBe(true);
    expect(rig.a.ppvActive).toBe(false);
    expect(rig.p.proceduralApneaContribution).toBe(0);
    expect(rig.v.mechanicalMinuteVentilation).toBe(0);
    expect(rig.v.effectiveMinuteVentilation).toBe(0);
    expect(rig.p.minuteVentilation).toBe(0);
    expect(rig.p.capnogramPresent).toBe(false);

    rig.core.stepFor(1);
    expect(rig.a.lastIntubationOutcome).toBe('failed');
    expect(rig.p.airwayDeviceState).toBe('mask');
  });

  it('distinguishes RSI runs by whether PPV occurred before first laryngoscopy', () => {
    const ppvFirst = new SimRunner();
    ppvFirst.configureIntubationAttempts({ failedIntubationAttempts: [], attemptDurationSeconds: 2 });
    ppvFirst.deliverMaskVentilation({ durationSeconds: 1 });
    advanceRunner(ppvFirst, 1);
    ppvFirst.attemptIntubation();

    const noPpv = new SimRunner();
    noPpv.configureIntubationAttempts({ failedIntubationAttempts: [], attemptDurationSeconds: 2 });
    noPpv.attemptIntubation();

    const ppvFirstActions = actionNames(ppvFirst);
    const noPpvActions = actionNames(noPpv);
    expect(ppvFirstActions.indexOf('mask_ppv_started')).toBeLessThan(
      ppvFirstActions.indexOf('intubation_attempt_started'),
    );
    expect(noPpvActions.slice(0, noPpvActions.indexOf('intubation_attempt_started')))
      .not.toContain('mask_ppv_started');
  });

  it('distinguishes Standard IV confirmation-before-paralytic from paralytic-first ordering', () => {
    const confirmedFirst = new SimRunner();
    confirmedFirst.deliverMaskVentilation({ durationSeconds: 1 });
    advanceRunner(confirmedFirst, 1);
    confirmedFirst.giveBolus('Rocuronium', 42, 'Rocuronium 0.6 mg/kg');

    const paralyticFirst = new SimRunner();
    paralyticFirst.giveBolus('Rocuronium', 42, 'Rocuronium 0.6 mg/kg');
    advanceRunner(paralyticFirst, 1);
    paralyticFirst.deliverMaskVentilation({ durationSeconds: 1 });

    const confirmedActions = actionNames(confirmedFirst);
    const wrongActions = actionNames(paralyticFirst);
    expect(confirmedActions.indexOf('mask_ppv_completed')).toBeLessThan(
      confirmedActions.indexOf('drug'),
    );
    expect(wrongActions.indexOf('drug')).toBeLessThan(wrongActions.indexOf('mask_ppv_started'));
  });

  it('records the complete RSI rescue chain and restores oxygenation during PPV', () => {
    const runner = new SimRunner();
    runner.configureIntubationAttempts({
      failedIntubationAttempts: [1],
      attemptDurationSeconds: 45,
    });
    runner.setMachine({ o2FlowLPerMin: 0, airFlowLPerMin: 5, n2oFlowLPerMin: 0 });

    runner.attemptIntubation();
    const afterFailure = advanceRunner(runner, 45);
    expect(afterFailure.lastIntubationOutcome).toBe('failed');
    expect(afterFailure.airwayDevice).toBe('mask');

    runner.setMachine({ o2FlowLPerMin: 10, airFlowLPerMin: 0 });
    runner.applyCricoidPressure();
    runner.deliverMaskVentilation({
      durationSeconds: 90,
      tidalVolumeMl: 500,
      respiratoryRate: 12,
      cricoidPressure: true,
    });
    const afterPpv = advanceRunner(runner, 90);
    expect(afterPpv.spo2).toBeGreaterThan(afterFailure.spo2);

    runner.attemptIntubation();
    const afterSuccess = advanceRunner(runner, 45);
    expect(afterSuccess.lastIntubationOutcome).toBe('succeeded');
    expect(afterSuccess.airwayDevice).toBe('intubated');

    const required = new Set([
      'intubation_attempt_started', 'intubation_attempt_failed',
      'cricoid_pressure_applied', 'mask_ppv_started', 'intubation_attempt_succeeded',
    ]);
    expect(actionNames(runner, required)).toEqual([
      'intubation_attempt_started',
      'intubation_attempt_failed',
      'cricoid_pressure_applied',
      'mask_ppv_started',
      'intubation_attempt_started',
      'intubation_attempt_succeeded',
    ]);
  });

  it('records correct-RSI cricoid pressure independently with no pre-laryngoscopy PPV', () => {
    const runner = new SimRunner();
    runner.configureIntubationAttempts({ failedIntubationAttempts: [], attemptDurationSeconds: 30 });

    runner.applyCricoidPressure();
    runner.attemptIntubation();

    const firstAttempt = runner.log.findIndex(
      (entry) => entry.meta?.action === 'intubation_attempt_started',
    );
    expect(firstAttempt).toBeGreaterThan(0);
    expect(runner.log.slice(0, firstAttempt).some(
      (entry) => entry.meta?.action === 'cricoid_pressure_applied',
    )).toBe(true);
    expect(runner.log.slice(0, firstAttempt).some(
      (entry) => entry.meta?.action === 'mask_ppv_started',
    )).toBe(false);
  });

  it('records below-90 timing without preoxygenation and no crossing after preoxygenation', () => {
    const roomAir = buildPhysRig(8203, 70, 170, 45);
    roomAir.v.o2FlowLPerMin = 0;
    roomAir.v.airFlowLPerMin = 5;
    roomAir.a.configureIntubation({ failedIntubationAttempts: [1], attemptDurationSeconds: 60 });
    roomAir.a.attemptIntubation();
    roomAir.core.stepFor(60);

    const preoxygenated = buildPhysRig(8203, 70, 170, 45);
    preoxygenated.v.o2FlowLPerMin = 10;
    preoxygenated.v.airFlowLPerMin = 0;
    preoxygenated.core.stepFor(180);
    expect(preoxygenated.p.endTidalO2Percent).toBeGreaterThan(90);
    preoxygenated.a.configureIntubation({ failedIntubationAttempts: [1], attemptDurationSeconds: 60 });
    preoxygenated.a.attemptIntubation();
    preoxygenated.core.stepFor(60);

    expect(roomAir.a.intubationAttempts[0]).toMatchObject({
      outcome: 'failed',
      desaturatedBelow90: true,
      timeToSpo2_90Sec: expect.any(Number),
    });
    expect(Number.isFinite(roomAir.a.intubationAttempts[0].timeToSpo2_90Sec)).toBe(true);
    expect(preoxygenated.a.intubationAttempts[0]).toMatchObject({
      outcome: 'failed',
      desaturatedBelow90: false,
      timeToSpo2_90Sec: null,
    });
  });

  it('is bit-reproducible at mid-PPV and mid-attempt samples', () => {
    const first = combinedDeterminismFingerprint();
    const second = combinedDeterminismFingerprint();

    expect(first).toBe(second);
    const decoded = JSON.parse(first);
    expect(decoded.midPpv.ppvActive).toBe(true);
    expect(decoded.midAttempt.intubationInProgress).toBe(true);
    expect(decoded.completed.outcome).toBe('failed');
  });
});
