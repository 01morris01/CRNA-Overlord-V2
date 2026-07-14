import { describe, expect, it } from 'vitest';
import { buildPhysRig, VentMode } from '../sim/index.js';

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
});
