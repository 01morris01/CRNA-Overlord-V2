/* EXPERIMENTAL: sedation with the patient breathing on a natural airway.
 *
 * Off unless a caller turns it on (SimRunner.setSedationModel('experimental') or `patient.sedation = new SedationModel(patient)`
 * with `active = true`). With it off, nothing in the engine changes: every existing test and case behaves exactly as before.
 *
 * What it adds, as five visible pieces of state that a room can show and a learner can act on:
 *   depth     the engine's own BIS (Eleveld 2018 propofol PD with the Bouillon/Greco opioid interaction), read, not changed
 *   effort    central drive: the engine's drug depression (now allowed to reach zero, i.e. apnea), times any complication
 *             drive, times a CO2 term (a rising PaCO2 drives breathing, less so when drugs blunt the response)
 *   patency   upper-airway patency from depth and the patient's collapsibility (OSA, BMI, Mallampati, position), relieved by
 *             chin lift, jaw thrust and airway adjuncts. Multiplies the engine's own complication patency (laryngospasm and
 *             the rest are untouched and keep their own thresholds: those are NOT reused here)
 *   ventilation  alveolar ventilation from rate, tidal volume (ideal body weight), dead space (ideal body weight) and patency
 *   oxygen    inspired O2 from the supplemental device: none, nasal cannula by flow, or the circuit's own mask
 *
 * Every number below carries its provenance in SEDATION_PARAMS: `standard` (established textbook physiology or physics that
 * does not need a single-study citation here), `source` (a cited value), `source-range` (a value chosen inside a verified
 * published range), `signoff` (a recorded owner decision), `engineering` (a numerical stability or model limit, not a
 * physiological claim) or `unsourced` (a working value chosen so the model behaves in the right direction; it must be
 * reviewed before it is taught as fact). Most of the new links are unsourced. The room must say "experimental" wherever
 * this model runs.
 */
import { f, Clamp, Clamp01, Exp, Max, Pow } from './float32.js';

const P = (value, kind, note) => ({ value, kind, note });
export const SEDATION_MODEL_VERSION = 'experimental-0.2 (2026-11-14)';
export const SEDATION_PARAMS = Object.freeze({
  // ---- depth (read from the existing engine)
  depthModel: P('Eleveld 2018 PK/PD, BIS with Bouillon/Greco opioid synergy', 'signoff', 'Owner decision recorded 2026-06-11 for the Unity trainer, carried into this engine; the record is in the assistant\'s session notes, no signed document was found in either repository'),
  // ---- drive
  drugDepressionFloor: P(0, 'unsourced', 'The engine floors drug depression at 0.1 (never apnea). Here it may reach 0 so a deep enough dose stops breathing. The per-drug coefficients themselves (propofol 0.6 at Ce 4, fentanyl 1.1, midazolam 0.3, volatile 0.4 per MAC) are the engine\'s own, ported from the Unity trainer without a verified literature anchor in EVIDENCE.md'),
  propofolDepression: P({ scale: 0.1, exponent: 1.5 }, 'unsourced', 'Experimental mode only: propofol drive loss = 0.1 x Ce^1.5, clamped 0-1. A PLACEHOLDER, NOT CALIBRATED: in the healthy 70 kg / 175 cm steady-state test at Ce 1.0 it gives only about a 1.9 % fall in resting minute ventilation versus the Nieuwenhuijs 2003 population estimate of 12.6 +/- 3.3 % (DOI 10.1097/00000542-200302000-00008; measured ARTERIAL concentration, closed-loop resting ventilation, PETCO2 endpoint). That test is pinned as a known failure pending a CO2 mass-balance audit. Keeping drive loss below 1 for Ce < 4 is an ENGINEERING ASSUMPTION carried from the previous rule, not published physiology: no study here establishes a propofol concentration below which apnea cannot occur. Candidate replacement to evaluate: Bouillon 2004 indirect-response model (C50 1.33 ug/mL, gamma 1.68; DOI 10.1097/00000542-200402000-00010).'),
  co2SetPointMmHg: P(40, 'standard', 'Standard physiological resting arterial CO2 set point used operationally for this layer; no single-study citation is required here.'),
  co2SlopeLMinPerMmHg: P(2.0, 'source-range', 'Verified published range for awake CO2 response slope: 1.27 +/- 0.31 L/min/mmHg in steady-state normoxia (Xie 2006, DOI 10.1113/jphysiol.2006.110627) to 2.48 +/- 1.05 L/min/mmHg with rebreathing before epidural fentanyl (Negre 1987, PMID 3111304); 2.0 is chosen inside that range.'),
  co2GainBluntedByDrugs: P(true, 'unsourced', 'The CO2 gain is multiplied by the square of the remaining drug drive, so a drugged patient responds less to the same rise. Placeholder only: evidence shows drugs change BOTH slope and curve position (Allsop 1988 PMID 3065083: propofol alone shifted right with no slope change; Babenco 2000 DOI 10.1097/00000542-200002000-00020: remifentanil slope 0.99 -> 0.27), so this squared multiplier is only a temporary stand-in.'),
  co2DriveMax: P(2.5, 'engineering', 'Numerical stability ceiling only. A 2.5x physiological ceiling is not supported by the evidence; healthy adults can exceed it under hypercapnia. This clamp exists only to keep the simulation stable.'),
  tidalVolumeMlPerKgIbw: P(7, 'unsourced', 'The engine uses 7 mL/kg of TOTAL weight; here it is ideal body weight, so a 139 kg man does not breathe 975 mL breaths. The 7 mL/kg figure is carried over from the engine, not newly sourced from verified evidence here.'),
  tidalVolumeShallowing: P(0.45, 'unsourced', 'Tidal volume falls to (1 - 0.45) of normal as drug depression takes the drive to zero. This fixed floor is only a placeholder: Allsop 1988 PMID 3065083 found propofol tidal volume around 41-44 % of baseline, and Babenco 2000 DOI 10.1097/00000542-200002000-00020 found remifentanil depression came mainly through tidal volume.'),
  deadSpaceMlPerKgIbw: P(2.2, 'unsourced', 'Anatomic dead space is applied here as 2.2 mL/kg of ideal body weight. The rule is carried over from standard teaching, but no verified DOI/PMID-backed source for this exact number was supplied in EVIDENCE.md.'),
  idealBodyWeight: P('Devine: male 50 kg, female 45.5 kg, + 2.3 kg per inch over 60 in', 'unsourced', 'Devine ideal body weight is used operationally here, but no verified DOI/PMID-backed source was supplied in EVIDENCE.md for keeping it as a sourced parameter in this provenance table.'),
  apneaRateThreshold: P(2, 'unsourced', 'The engine\'s own rule: fewer than 2 breaths a minute counts as not breathing. This is retained as an engine threshold, not as a verified literature claim.'),
  // ---- patency
  obstructionHalfBis: P(55, 'unsourced', 'BIS-logistic midpoint retained. No published evidence supports a specific BIS-point value for half obstruction in this form.'),
  obstructionWidthBis: P(5, 'unsourced', 'BIS-logistic width retained. No published evidence supports a specific BIS-point width for this transition.'),
  shiftOsa: P(6, 'unsourced', 'OSA shifts obstruction lighter in the model, but no published evidence supports a fixed BIS-point shift for OSA here.'),
  shiftBmi40: P(4, 'unsourced', 'Obesity worsens collapsibility qualitatively, but no published evidence supports a fixed BIS-point shift at BMI 40 here.'),
  shiftMallampati34: P(2, 'unsourced', 'Mallampati III/IV increases risk qualitatively, but no published evidence supports a fixed BIS-point shift here.'),
  shiftLateral: P(-6, 'unsourced', 'Lateral positioning helps qualitatively, but no published evidence supports a fixed BIS-point shift for lateral relief here.'),
  shiftRamped: P(-3, 'unsourced', 'Head-up/ramped positioning helps qualitatively, but no published evidence supports a fixed BIS-point shift for ramping here.'),
  reliefChinLift: P(0.55, 'unsourced', 'No published evidence supports a fixed percentage of obstruction relief from chin lift in this model.'),
  reliefJawThrust: P(0.3, 'unsourced', 'No published evidence supports a fixed percentage of obstruction relief from jaw thrust in this model.'),
  reliefNasalAirway: P(0.5, 'unsourced', 'No published evidence supports a fixed percentage of obstruction relief from a nasal airway in this model.'),
  reliefOralAirway: P(0.35, 'unsourced', 'No published evidence supports a fixed percentage of obstruction relief from an oral airway in this model.'),
  patencyFloor: P(0.03, 'unsourced', 'Complete obstruction still leaks a little. Working numerical floor, not a verified physiological claim.'),
  // ---- oxygen
  oxygenStore: P('mass balance: d(stores)/dt = VA x (FiO2 - FAO2) - VO2', 'standard', 'The alveolar gas equation at steady state (FAO2 = FiO2 - VO2/VA), standard respiratory physiology. Replaces, in this mode only, the engine\'s blend toward an empty store by VA / (0.045 L/min per kg of TOTAL weight), which made any hypoventilation in a large patient behave like apnea. Apnea still drains the store at VO2, so the signed-off Benumof apnea times are unchanged. VO2 itself is the engine\'s 3.5 mL/kg of total weight (unsourced for obesity).'),
  alveolarPO2: P('PAO2 = FAO2 x (PB - PH2O), with FAO2 from the mass-balanced store', 'standard', 'Equivalent at steady state to the alveolar gas equation PAO2 = PIO2 - PACO2/R (863/713 converts VO2 to alveolar conditions). The engine subtracts PaCO2/0.8 from a store that does not account for O2 uptake; with the mass balance that would count uptake twice.'),
  metabolicWeight: P('ideal body weight + 0.4 x (total - ideal)', 'unsourced', 'VO2 (3.5 mL/kg) and VCO2 (2.8 mL/kg) are scaled to this weight instead of total weight. Resting energy expenditure is better predicted by fat-free mass: Mifflin 1990 found REE = 19.7 x FFM + 413 with R^2 0.64 (DOI 10.1093/ajcn/51.2.241), so this 0.4 adjusted-weight rule remains an unsourced placeholder.'),
  cannulaFio2: P('0.21 + 0.038 per L/min', 'source', 'O\'Reilly Nugent 2014 measured about +0.038 FiO2 per L/min by nasal cannula, with 0.296 at 2 L/min, and reported that measured FiO2 falls as minute ventilation rises; that ventilation dependence is not yet modeled here (DOI 10.1111/resp.12268).'),
  cannulaMaxFlow: P(6, 'engineering', 'Engineering limit for ordinary nasal cannula flow in this UI/model path; not a physiological claim.'),
});

// Reference data for a future pressure-flow airway model.
export const AIRWAY_EVIDENCE = Object.freeze({
  note: 'Reference data for a future pressure-flow airway model.',
  eastwood2005: Object.freeze({
    citation: 'Eastwood 2005, DOI 10.1097/00000542-200509000-00007',
    measure: 'PcritCmH2OByPropofolCeUgMl',
    points: Object.freeze([
      Object.freeze({ ceUgMl: 2.5, meanCmH2O: -0.3, sdCmH2O: 3.5 }),
      Object.freeze({ ceUgMl: 4.0, meanCmH2O: 0.5, sdCmH2O: 3.7 }),
      Object.freeze({ ceUgMl: 6.0, meanCmH2O: 1.4, sdCmH2O: 3.5 }),
    ]),
  }),
  walsh2008: Object.freeze({
    citation: 'Walsh 2008, PMID 18853942',
    measure: 'PcritCmH2OByHeadPosture',
    points: Object.freeze([
      Object.freeze({ posture: 'neutral', meanCmH2O: -0.4, sdCmH2O: 4.4 }),
      Object.freeze({ posture: 'flexion', meanCmH2O: 3.7, sdCmH2O: 2.9 }),
      Object.freeze({ posture: 'extension', meanCmH2O: -9.4, sdCmH2O: 3.8 }),
    ]),
  }),
  isono1997: Object.freeze({
    citation: 'Isono 1997, DOI 10.1152/jappl.1997.82.4.1319',
    measure: 'VelopharyngealClosingPressureCmH2O',
    points: Object.freeze([
      Object.freeze({ group: 'normal', meanCmH2O: -3.77, sdCmH2O: 3.44 }),
      Object.freeze({ group: 'sdb1', meanCmH2O: 0.9, sdCmH2O: 1.34 }),
      Object.freeze({ group: 'sdb2', meanCmH2O: 2.78, sdCmH2O: 2.78 }),
    ]),
  }),
  kobayashi2011: Object.freeze({
    citation: 'Kobayashi 2011, DOI 10.1097/ALN.0b013e318223ba6d',
    measure: 'PcritCmH2OAtHeadElevation',
    note: 'Approximate, abstract only; fixed jaw.',
    points: Object.freeze([
      Object.freeze({ headElevationCm: 0, approxCmH2O: -3 }),
      Object.freeze({ headElevationCm: 6, approxCmH2O: -7 }),
    ]),
  }),
});

export const OPIOID_EVIDENCE = Object.freeze({
  fentanyl: Object.freeze({
    vanLemmen2025: Object.freeze({
      citation: 'van Lemmen 2025, DOI 10.1097/ALN.0000000000005710',
      note: 'Exploratory study.',
      potencyNgMl: 2.3,
      potencySdNgMl: 0.5,
      controllerGainLMinPerKPa: 5.3,
      timeConstantMin: 2.4,
    }),
    cartwright1983: Object.freeze({
      citation: 'Cartwright 1983, PMID 6414339',
      depression50PercentRangeNgMl: Object.freeze([1.5, 3.0]),
    }),
  }),
  remifentanil: Object.freeze({
    babenco2000: Object.freeze({
      citation: 'Babenco 2000, DOI 10.1097/00000542-200002000-00020',
      note: 'Reference only; the engine has no remifentanil model.',
      ec50NgMl: 1.12,
      gamma: 1.74,
      onsetHalfTimeMin: 2.9,
    }),
  }),
});

export const VENTILATION_INTERACTION_EVIDENCE = Object.freeze({
  note: 'Transcribed from extracted text of the paper and the author\'s 2002 Leiden thesis (via a second AI tool); the single-drug lambda values match the PubMed abstract; Table 2 uncertainties and the equation layout are NOT visually verified against the journal page. Measured ARTERIAL concentrations, 22 healthy young men, propofol 0-2.6 ug/mL, remifentanil 0-2 ng/mL. The example apnea combinations in the paper belong to the fixed-PETCO2-55 surface, not resting apnea.',
  citation: 'Nieuwenhuijs 2003, DOI 10.1097/00000542-200302000-00008',
  qmax: 0.5,
  endpoints: Object.freeze({
    restingVi: Object.freeze({ E0: 9.4, se: 0.3, lambdaRemi: 0.277, lambdaProp: 0.126, Imax: 1.9, gamma: 0.5, increases: false, unit: 'L/min' }),
    restingPetco2: Object.freeze({ E0: 41.2, se: 0.1, lambdaRemi: 0.154, lambdaProp: 0.042, Imax: 1.3, gamma: 0.7, increases: true, unit: 'mmHg' }),
    co2Slope: Object.freeze({ E0: 1.87, se: 0.01, lambdaRemi: 0.2, lambdaProp: 0.51, Imax: 1.3, gamma: 0.4, increases: false, unit: 'L/min/mmHg' }),
    viAtPetco2_55: Object.freeze({ E0: 31.4, se: 1.5, lambdaRemi: 0.577, lambdaProp: 0.443, Imax: 1.2, gamma: 0.4, increases: false, unit: 'L/min' }),
  }),
});

export function nieuwenhuijsEffect(endpoint, CrNgMl, CpUgMl) {
  const spec = VENTILATION_INTERACTION_EVIDENCE.endpoints[endpoint];
  if (!spec) throw new Error(`Unknown Nieuwenhuijs endpoint: ${endpoint}`);
  const r = Max(0, +CrNgMl || 0);
  const p = Max(0, +CpUgMl || 0);
  if (r === 0 && p === 0) return spec.E0;
  const Q = r + p > 0 ? r / (r + p) : 0;
  const t = Q <= VENTILATION_INTERACTION_EVIDENCE.qmax ? Q / VENTILATION_INTERACTION_EVIDENCE.qmax : (1 - Q) / (1 - VENTILATION_INTERACTION_EVIDENCE.qmax);
  const I = 1 + (spec.Imax - 1) * (1.5 * t - 0.5 * t * t * t);
  const D = Pow(r * Pow(spec.lambdaRemi, 1 / spec.gamma) + p * Pow(spec.lambdaProp, 1 / spec.gamma), spec.gamma) * I;
  return spec.increases ? spec.E0 * (1 + D) : spec.E0 * (1 - D);
}

/** Devine ideal body weight in kg from height (cm) and sex. */
export function idealBodyWeightKg(heightCm, sex = 'Male') { const inches = heightCm / 2.54, base = /^f/i.test(String(sex)) ? 45.5 : 50; return Max(30, f(base + 2.3 * (inches - 60))); }

export class SedationModel {
  constructor(patient) {
    this.patient = patient; this.active = true;
    this.device = 'none'; this.flowLPerMin = 0;                          // 'none' | 'cannula' | 'circuit' (the anesthesia mask held on the face)
    this.position = 'supine';                                            // 'supine' | 'ramped' | 'lateral'
    this.maneuvers = { chinLift: false, jawThrust: false, nasalAirway: false, oralAirway: false };
    this.risk = { osa: false, bmi: 25, mallampati: 2 };
    // outputs
    this.depthBis = 97; this.drugDrive = 1; this.co2Drive = 1; this.effort = 1; this.obstruction = 0; this.patency = 1;
    this.tidalVolumeMl = 0; this.alveolarVentilationLMin = 0; this.inspiredO2 = 0.21; this.flowRR = 0;
  }
  get ibwKg() { return idealBodyWeightKg(this.patient.heightCm, this.patient.sex); }
  get deadSpaceMl() { return Max(60, f(SEDATION_PARAMS.deadSpaceMlPerKgIbw.value * this.ibwKg)); }
  get restingMinuteVentilationLMin() {
    const tv = f(SEDATION_PARAMS.tidalVolumeMlPerKgIbw.value * this.ibwKg);
    return f(tv * this.patient.baselineRR / 1000);
  }
  propofolDriveLoss(ceUgMl) {
    const cfg = SEDATION_PARAMS.propofolDepression.value;
    const ce = Max(0, +ceUgMl || 0);
    if (ce <= 0) return 0;
    return Clamp01(f(cfg.scale * Pow(ce, cfg.exponent)));
  }
  setDevice(device, flowLPerMin = 0) {
    const d = ['none', 'cannula', 'circuit'].includes(device) ? device : 'none';
    this.device = d; this.flowLPerMin = d === 'cannula' ? Clamp(+flowLPerMin || 0, 0, SEDATION_PARAMS.cannulaMaxFlow.value) : 0;
    return { ok: true, device: this.device, flowLPerMin: this.flowLPerMin };
  }
  setManeuver(name, on) { if (!(name in this.maneuvers)) return { ok: false, reason: `unknown maneuver: ${name}` }; this.maneuvers[name] = !!on; return { ok: true, maneuvers: { ...this.maneuvers } }; }
  setPosition(pos) { this.position = ['supine', 'ramped', 'lateral'].includes(pos) ? pos : 'supine'; return { ok: true, position: this.position }; }
  setRisk({ osa, bmi, mallampati } = {}) { if (osa !== undefined) this.risk.osa = !!osa; if (bmi !== undefined) this.risk.bmi = +bmi || 25; if (mallampati !== undefined) this.risk.mallampati = +mallampati || 2; return { ok: true, risk: { ...this.risk } }; }

  get metabolicWeightKg() { const ibw = this.ibwKg, w = this.patient.weightKg; return w > ibw ? f(ibw + 0.4 * (w - ibw)) : w; }
  /** Scale resting VO2 and VCO2 to the metabolic weight (once, when the model is switched on); `restore()` puts the engine's back. */
  applyMetabolicScaling() { const p = this.patient; if (this._saved) return; this._saved = { vo2: p.vo2MlMin, vco2: p.vco2MlMin }; const k = this.metabolicWeightKg / Max(1, p.weightKg); p.vo2MlMin = f(p.vo2MlMin * k); p.vco2MlMin = f(p.vco2MlMin * k); }
  restore() { const p = this.patient; if (!this._saved) return; p.vo2MlMin = this._saved.vo2; p.vco2MlMin = this._saved.vco2; this._saved = null; }
  /** The inspired O2 fraction this device gives; `circuitFiO2` is what the machine delivers when the mask is on. */
  inspiredO2For(circuitFiO2) {
    if (this.device === 'circuit') return circuitFiO2;
    if (this.device === 'cannula' && this.flowLPerMin > 0) return Clamp(f(0.21 + 0.038 * this.flowLPerMin), 0.21, f(0.21 + 0.038 * SEDATION_PARAMS.cannulaMaxFlow.value));
    return f(0.21);
  }
  /** CO2 term of central drive. */
  co2Term(drugDrive) {
    const S = SEDATION_PARAMS;
    // Published CO2-response slopes are total MINUTE-ventilation responses, so convert them to a fractional drive using
    // this model's own resting minute ventilation at baseline rate and ideal-weight tidal volume, without subtracting dead space.
    const baselineMinuteVent = Max(0.1, this.restingMinuteVentilationLMin);
    const slope = f(S.co2SlopeLMinPerMmHg.value * (S.co2GainBluntedByDrugs.value ? drugDrive * drugDrive : 1));
    const gain = f(slope / baselineMinuteVent);
    return Clamp(f(1 + gain * Max(-5, this.patient.paCO2 - S.co2SetPointMmHg.value)), 0.7, S.co2DriveMax.value);
  }
  /** Obstruction (0 open .. 1 closed) from depth and collapsibility, after the maneuvers in place. */
  obstructionFor(bis) {
    const S = SEDATION_PARAMS, r = this.risk; let half = S.obstructionHalfBis.value;
    if (r.osa) half += S.shiftOsa.value; if (r.bmi >= 40) half += S.shiftBmi40.value; if (r.mallampati >= 3) half += S.shiftMallampati34.value;
    if (this.position === 'lateral') half += S.shiftLateral.value; else if (this.position === 'ramped') half += S.shiftRamped.value;
    let o = f(1 / (1 + Exp((bis - half) / S.obstructionWidthBis.value)));
    const m = this.maneuvers; if (m.jawThrust) o = f(o * S.reliefJawThrust.value); else if (m.chinLift) o = f(o * S.reliefChinLift.value);
    if (m.oralAirway) o = f(o * S.reliefOralAirway.value); else if (m.nasalAirway) o = f(o * S.reliefNasalAirway.value);
    return Clamp01(o);
  }
  /** Called by the patient once per tick, after the drug effects are known and before respiration is updated. */
  update(dt) {
    const p = this.patient, S = SEDATION_PARAMS;
    this.depthBis = p.bisIndex;
    this.drugDrive = Clamp01(p._rrModifier);
    this.co2Drive = this.co2Term(this.drugDrive);
    const drive = Clamp(f(this.drugDrive * Clamp01(p.respiratoryDriveFactor) * this.co2Drive), 0, S.co2DriveMax.value);
    this.effort = drive;
    this.obstruction = this.obstructionFor(this.depthBis);
    this.patency = Max(S.patencyFloor.value, f(1 - this.obstruction));
    const shallow = f(1 - S.tidalVolumeShallowing.value * (1 - Clamp01(f(this.drugDrive * Clamp01(p.respiratoryDriveFactor)))));
    this.tidalVolumeMl = f(S.tidalVolumeMlPerKgIbw.value * this.ibwKg * p.respiratoryMuscleCapability * shallow);
    this.inspiredO2 = this.inspiredO2For(p.fiO2);
    return drive;
  }
  /** What the room shows: plain numbers, and the provenance of the model that made them. */
  view() {
    return { model: SEDATION_MODEL_VERSION, experimental: true, depthBis: this.depthBis, effort: this.effort, drugDrive: this.drugDrive, co2Drive: this.co2Drive,
      obstruction: this.obstruction, patency: this.patency, tidalVolumeMl: this.tidalVolumeMl, alveolarVentilationLMin: this.alveolarVentilationLMin,
      flowRR: this.flowRR, inspiredO2: this.inspiredO2, device: this.device, flowLPerMin: this.flowLPerMin, position: this.position, maneuvers: { ...this.maneuvers }, risk: { ...this.risk }, ibwKg: this.ibwKg, deadSpaceMl: this.deadSpaceMl };
  }
}
