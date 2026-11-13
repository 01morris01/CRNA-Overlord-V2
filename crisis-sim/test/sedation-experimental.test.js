// EXPERIMENTAL sedation layer (sim/sedationExperimental.js): three reproducible cases and the checks that keep it honest.
//
// These are SOFTWARE tests. They pin how the experimental model behaves so a change is noticed; they do not show that the
// behavior is clinically right. Most of the new parameters are marked `unsourced` in SEDATION_PARAMS and wait for review.
// The cases: (A) stable light-to-moderate sedation in an ordinary adult; (B) deterioration in the endoscopy patient
// (139 kg, 178 cm, OSA, BMI 44, Mallampati III, left lateral, cannula 2 L/min) after a large bolus with an opioid;
// (C) the same deterioration answered at the first SpO2 under 92 % with a jaw thrust, the infusion stopped and the cannula
// turned up. Seeds are fixed; each case gives the same numbers every run.
import { describe, expect, it } from 'vitest';
import { buildPhysRig, VentMode } from '../sim/index.js';
import { SedationModel, SEDATION_PARAMS, idealBodyWeightKg } from '../sim/sedationExperimental.js';

const ENDO = { w: 139.4, h: 178, a: 58, risk: { osa: true, bmi: 44, mallampati: 3 } };
/** An awake adult on a natural airway, CO2 by mass balance, with the experimental layer on (or off). */
function patient(seed, { w = 70, h = 170, a = 45, risk = { osa: false, bmi: 24, mallampati: 1 }, position = 'lateral', cannula = 2, experimental = true } = {}) {
  const r = buildPhysRig(seed, w, h, a); r.v.co2Kinetics = 'stores'; r.v.setMode(VentMode.Manual); r.v.o2FlowLPerMin = 0; r.v.airFlowLPerMin = 0; r.v.n2oFlowLPerMin = 0;
  if (experimental) { r.p.sedation = new SedationModel(r.p); r.p.sedation.setRisk(risk); r.p.sedation.setPosition(position); r.p.sedation.setDevice(cannula ? 'cannula' : 'none', cannula); r.p.sedation.applyMetabolicScaling(); }
  r.core.stepFor(60); return r;
}
/** Step one second at a time; record the course and the extremes; `when(r, t)` may act and return true once it has. */
function run(r, seconds, when = null) {
  const trace = []; let minSpo2 = 100, minPatency = 1, maxPaco2 = 0, apneaSeconds = 0, acted = null;
  for (let t = 0; t < seconds; t += 1) {
    if (when && acted == null && when(r, t)) acted = t;
    r.core.stepFor(1); const p = r.p, s = p.sedation;
    minSpo2 = Math.min(minSpo2, p.spO2); maxPaco2 = Math.max(maxPaco2, p.paCO2); if (s) minPatency = Math.min(minPatency, s.patency); if (!p.isBreathingSpontaneously) apneaSeconds += 1;
    if (t % 30 === 0) trace.push([t, Math.round(p.bisIndex), +p.respiratoryRate.toFixed(1), s ? +s.patency.toFixed(2) : 1, Math.round(p.spO2), Math.round(p.paCO2)]);
  }
  return { trace, minSpo2, minPatency, maxPaco2, apneaSeconds, acted, last: { spo2: r.p.spO2, paco2: r.p.paCO2, patency: r.p.sedation ? r.p.sedation.patency : 1, rr: r.p.respiratoryRate } };
}
const caseA = () => { const r = patient(5101); r.d.administerBolus('Propofol', 40); r.d.startInfusion('Propofol', 300); return run(r, 1200); };
const caseB = () => { const r = patient(5102, ENDO); r.d.administerBolus('Propofol', 100); r.d.administerBolus('Fentanyl', 0.05); r.d.startInfusion('Propofol', 450); return { r, out: run(r, 300) }; };
const caseC = () => { const r = patient(5102, ENDO); r.d.administerBolus('Propofol', 100); r.d.administerBolus('Fentanyl', 0.05); r.d.startInfusion('Propofol', 450);
  const out = run(r, 600, (q) => { if (q.p.spO2 >= 92) return false; q.p.sedation.setManeuver('jawThrust', true); q.d.stopInfusion('Propofol'); q.p.sedation.setDevice('cannula', 6); return true; }); return { r, out }; };

describe('experimental sedation: switched off, the engine is unchanged', () => {
  it('a patient without the layer has no sedation state and keeps the engine floor on drug depression', () => {
    const r = patient(5100, { experimental: false }); r.d.administerBolus('Propofol', 175); r.core.stepFor(120);
    expect(r.p.sedation).toBeNull(); expect(r.p.sedationView).toBeNull(); expect(r.p.drugDepressionContribution).toBeGreaterThanOrEqual(0.1);
  });
  it('every new parameter states where it comes from', () => {
    for (const [k, v] of Object.entries(SEDATION_PARAMS)) { expect(['source', 'signoff', 'unsourced'], k).toContain(v.kind); expect(v.note.length, k).toBeGreaterThan(20); }
  });
  it('ideal body weight follows Devine (178 cm man about 73 kg)', () => { expect(idealBodyWeightKg(178, 'Male')).toBeCloseTo(73.1, 0); });
});

describe('experimental sedation: what the as-found tests said should happen now happens in this mode', () => {
  it('an induction dose of propofol (2.5 mg/kg) stops breathing for a time', () => {
    const r = patient(4106, { cannula: 0 }); r.d.administerBolus('Propofol', 175); const o = run(r, 180); expect(o.apneaSeconds).toBeGreaterThan(20);
  });
  it('deep propofol sedation narrows the upper airway unless it is supported', () => {
    const r = patient(4107, { position: 'supine' }); r.d.administerBolus('Propofol', 120); r.d.startInfusion('Propofol', 500); const o = run(r, 300); expect(o.minPatency).toBeLessThan(0.7);
  });
  it('a nasal cannula at 4 L/min gives an inspired O2 well under 50 %', () => {
    const r = patient(4108, { cannula: 4 }); r.core.stepFor(30); expect(r.p.fiO2).toBeGreaterThan(0.3); expect(r.p.fiO2).toBeLessThan(0.5);
  });
  it('a rise in CO2 drives breathing up', () => {
    const r = patient(4109); const before = r.p.respiratoryRate; r.p.vco2MlMin *= 2; r.core.stepFor(600);
    expect(r.p.paCO2).toBeGreaterThan(45); expect(r.p.respiratoryRate).toBeGreaterThan(before + 2);
  });
});

describe('experimental sedation: the three reproducible cases', () => {
  it('each case gives the same course from the same seed', () => {
    expect(JSON.stringify(caseA().trace)).toBe(JSON.stringify(caseA().trace));
    expect(JSON.stringify(caseC().out.trace)).toBe(JSON.stringify(caseC().out.trace));
  });
  it('A, stable: 20 minutes of propofol sedation, breathing kept, airway open, saturation and CO2 near normal', () => {
    const o = caseA(); expect(o.apneaSeconds).toBe(0); expect(o.minPatency).toBeGreaterThan(0.85); expect(o.minSpo2).toBeGreaterThanOrEqual(95); expect(o.maxPaco2).toBeLessThan(55);
  });
  it('B, deterioration: in the endoscopy patient the airway narrows, CO2 rises and saturation falls under 90 % within five minutes', () => {
    const { out } = caseB(); expect(out.minPatency).toBeLessThan(0.4); expect(out.minSpo2).toBeLessThan(90); expect(out.maxPaco2).toBeGreaterThan(48);
  });
  it('C, response: a jaw thrust, the infusion stopped and more oxygen bring the airway open and the saturation back', () => {
    const { r, out } = caseC(); expect(out.acted).not.toBeNull();
    expect(out.last.patency).toBeGreaterThan(0.7); expect(out.last.spo2).toBeGreaterThanOrEqual(94);
    const after = out.trace.filter(([t]) => t > out.acted + 120); expect(Math.min(...after.map((q) => q[4]))).toBeGreaterThanOrEqual(92);
    expect(r.p.sedation.maneuvers.jawThrust).toBe(true);
  });
});

describe('experimental sedation: the signed-off apnea times are kept', () => {
  /** Seconds from apnea to SpO2 90 % after 3 min of O2 at 100 % on the mask, in the default engine and in this mode. */
  function apneaTime(experimental) {
    const r = patient(4200, { experimental, cannula: 0, position: 'supine' });
    if (experimental) r.p.sedation.setDevice('circuit'); r.v.o2FlowLPerMin = 10; r.core.stepFor(180); r.p.setForcedApnea(true);
    for (let t = 0; t < 1200; t += 1) { r.core.stepFor(1); if (r.p.spO2 < 90) return t; } return 1200;
  }
  it('preoxygenated apnea lasts within 20 % of the default engine (Benumof anchors)', () => {
    const a = apneaTime(false), b = apneaTime(true); expect(Math.abs(b - a) / a).toBeLessThan(0.2);
  });
});
