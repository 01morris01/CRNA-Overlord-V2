// Sedation with the patient breathing for themselves: what the engine does today, pinned before the model is changed.
//
// Each `it.fails` states what should happen and currently does not; vitest passes it while the engine still behaves as found.
// When the respiratory model is corrected these become ordinary `it` tests (and the plain tests below are updated with it).
// Findings first recorded in the engine audit (overlord-asset-sources/research/engine/engine.md, section 3.12).
// Clinical statements are checked against cited sources in crisis-sim/docs/spontaneous-ventilation.md once that model lands.
import { describe, expect, it } from 'vitest';
import { buildPhysRig, VentMode } from '../sim/index.js';

/** An awake adult breathing room air on the natural airway, CO2 by mass balance (the walkable room's rule). */
function awake(seed = 4101, { weightKg = 70, heightCm = 170, ageYears = 45 } = {}) {
  const rig = buildPhysRig(seed, weightKg, heightCm, ageYears);
  rig.v.co2Kinetics = 'stores';
  rig.v.setMode(VentMode.Manual);
  rig.v.o2FlowLPerMin = 0; rig.v.airFlowLPerMin = 0; rig.v.n2oFlowLPerMin = 0;
  rig.core.stepFor(60);
  return rig;
}
/** Seconds stepped one at a time, returning the lowest and the last of a few signals. */
function watch(rig, seconds) {
  let minRR = Infinity, minPatency = Infinity, apneaSeconds = 0, maxCe = 0;
  for (let t = 0; t < seconds; t += 1) {
    rig.core.stepFor(1);
    const p = rig.p; minRR = Math.min(minRR, p.respiratoryRate); minPatency = Math.min(minPatency, p.airwayPatency); maxCe = Math.max(maxCe, p.propofolCe);
    if (!p.isBreathingSpontaneously) apneaSeconds += 1;
  }
  return { minRR, minPatency, apneaSeconds, maxCe, last: { rr: rig.p.respiratoryRate, spo2: rig.p.spO2, paco2: rig.p.paCO2, fio2: rig.p.fiO2 } };
}

describe('sedation: the engine as found (reproduction)', () => {
  it('the reproduction is deterministic: the same seed gives the same course', () => {
    const run = () => { const r = awake(4102); r.d.administerBolus('Propofol', 175); return JSON.stringify(watch(r, 300)); };
    expect(run()).toBe(run());
  });

  it('as found: after propofol 2.5 mg/kg the rate falls but never stops, and the airway stays fully open', () => {
    const r = awake(4103); r.d.administerBolus('Propofol', 175); const w = watch(r, 300);
    expect(w.maxCe).toBeGreaterThan(3);
    expect(w.minRR).toBeGreaterThan(4);            // capped at -60 % of the rate (patientPhysiology.js updateDrugEffects)
    expect(w.apneaSeconds).toBe(0);
    expect(w.minPatency).toBe(1);                  // only an injected laryngospasm ever changes airwayPatency
  });

  it('as found: oxygen at 4 L/min by itself is delivered as 100 %', () => {
    const r = awake(4104); r.v.o2FlowLPerMin = 4; r.core.stepFor(30);
    expect(r.p.fiO2).toBeGreaterThan(0.99);
  });

  it('as found: raising CO2 production does not raise the breathing rate', () => {
    const r = awake(4105); const before = r.p.respiratoryRate; r.p.vco2MlMin *= 3; r.core.stepFor(600);
    expect(r.p.paCO2).toBeGreaterThan(55);
    expect(Math.abs(r.p.respiratoryRate - before)).toBeLessThan(1);
  });

  // ---- what should happen (fails today)
  it.fails('an induction dose of propofol (2.5 mg/kg) stops breathing for a time in most adults', () => {
    const r = awake(4106); r.d.administerBolus('Propofol', 175); const w = watch(r, 180);
    expect(w.apneaSeconds).toBeGreaterThan(20);
  });
  it.fails('deep propofol sedation narrows the upper airway unless it is supported', () => {
    const r = awake(4107); r.d.administerBolus('Propofol', 175); const w = watch(r, 180);
    expect(w.minPatency).toBeLessThan(0.7);
  });
  it.fails('oxygen by nasal cannula at 4 L/min gives an inspired fraction well below 100 %', () => {
    const r = awake(4108); r.v.o2FlowLPerMin = 4; r.core.stepFor(30);
    expect(r.p.fiO2).toBeLessThan(0.5);
  });
  it.fails('a rising PaCO2 drives the breathing up', () => {
    const r = awake(4109); const before = r.p.respiratoryRate * r.p.tidalVolume; r.p.vco2MlMin *= 3; r.core.stepFor(600);
    expect(r.p.respiratoryRate * r.p.tidalVolume).toBeGreaterThan(before * 1.5);
  });
});
