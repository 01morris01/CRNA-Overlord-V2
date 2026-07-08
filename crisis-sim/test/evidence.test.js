/* Ported evidence anchors — the JS engine's own standing physiology
   evidence, independent of the golden fixtures. Mirrors the key checks in
   OperatingRoom.Editor.SimEvidence: Benumof desaturation anchors,
   determinism, and the truth boundary (drivers in → derived vitals out). */
import { describe, it, expect } from 'vitest';
import { buildPhysRig, VentMode, PatientPhysiology } from '../sim/index.js';

// SimEvidence.DesatRun — apneic time-to-90% for a given patient/preox state.
function desatRun(wt, ht, age, preox) {
  const r = buildPhysRig(1001, wt, ht, age);
  if (preox) { r.v.o2FlowLPerMin = 10; r.v.airFlowLPerMin = 0; } else { r.v.o2FlowLPerMin = 0; r.v.airFlowLPerMin = 5; }
  r.core.stepFor(preox ? 180 : 30);
  r.p.baselineRR = 0; r.p.respiratoryRate = 0; r.p.isBreathingSpontaneously = false;
  let tTo90 = -1;
  for (let t = 0; t <= 600; t += 30) {
    if (t > 0) r.core.stepFor(30);
    if (tTo90 < 0 && r.p.spO2 <= 90) tTo90 = t;
    if (r.p.spO2 < 60) break;
  }
  if (tTo90 < 0) tTo90 = 600;
  return tTo90;
}

// SimEvidence.DetRun — HR|SBP|SpO2 fingerprint after a propofol bolus.
function detRun(seed) {
  const r = buildPhysRig(seed, 70, 170, 45);
  r.d.administerBolus('Propofol', 140);
  let s = '';
  for (let t = 0; t < 6; t++) {
    r.core.stepFor(10);
    s += `[${r.p.heartRate.toFixed(2)}|${r.p.systolicBP.toFixed(2)}|${r.p.spO2.toFixed(2)}]`;
  }
  return s;
}

describe('5A desaturation (Benumof anchors)', () => {
  const tPreox = desatRun(70, 170, 45, true);
  const tRoom = desatRun(70, 170, 45, false);
  const tObese = desatRun(127, 170, 45, true);

  it('healthy preoxygenated survives ~8 min apnea (>= 420 s)', () => {
    expect(tPreox).toBeGreaterThanOrEqual(420);
  });
  it('healthy room-air desaturates fast (<= 90 s)', () => {
    expect(tRoom).toBeLessThanOrEqual(90);
  });
  it('preoxygenation dramatically extends safe apnea (> 5x room air)', () => {
    expect(tPreox).toBeGreaterThan(tRoom * 5);
  });
  it('obese preoxygenated desaturates sooner than lean preoxygenated', () => {
    expect(tObese).toBeLessThan(tPreox);
  });
});

describe('determinism', () => {
  it('same seed reproduces an identical run (bit-for-bit)', () => {
    expect(detRun(7777)).toBe(detRun(7777));
  });
  it('a different seed produces a different run', () => {
    expect(detRun(7777)).not.toBe(detRun(8888));
  });
});

describe('truth boundary (drivers set → vitals derived)', () => {
  it('bronchospasm drivers raise Ppeak and lower SpO2', () => {
    const r = buildPhysRig(4004, 70, 170, 45);
    r.v.setMode(VentMode.VCV);
    r.v.setTidalVolume = 500; r.v.setRespiratoryRate = 12; r.v.setPeep = 5; r.v.setFiO2 = 1;
    r.core.stepFor(20);
    const pPeakPre = r.p.peakAirwayPressure;
    const spo2Pre = r.p.spO2;
    r.p.airwayResistanceFactor = 4; r.p.shuntFraction = 0.40;
    r.core.stepFor(60);
    expect(r.p.peakAirwayPressure).toBeGreaterThan(pPeakPre);
    expect(r.p.peakAirwayPressure).toBeGreaterThan(40);
    expect(r.p.spO2).toBeLessThan(spo2Pre);
    expect(r.p.spO2).toBeLessThan(92);
  });

  it('anaphylaxis drivers (SVR collapse + shunt) drop SBP and SpO2', () => {
    const r = buildPhysRig(4004, 72, 163, 38);
    r.core.stepFor(10);
    const sbpPre = r.p.systolicBP;
    r.p.shuntFraction = 0.50; r.p.svrFactor = 0.45; r.p.baselineHR += 40;
    r.core.stepFor(60);
    expect(r.p.systolicBP).toBeLessThan(sbpPre);
    expect(r.p.systolicBP).toBeLessThan(80);
    expect(r.p.spO2).toBeLessThan(92);
  });
});

describe('Eleveld PD anchor', () => {
  it('BIS at Ce50 (3.08, age 35) is ~46.5 (E0/2)', () => {
    const bis = PatientPhysiology.eleveldBIS(3.08, 35);
    expect(Math.abs(bis - 46.5)).toBeLessThan(1);
  });
});
