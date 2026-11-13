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
 * Every number below carries its provenance in SEDATION_PARAMS: `source` (a citation), `signoff` (a recorded owner decision)
 * or `unsourced` (a working value chosen so the model behaves in the right direction; it must be reviewed before it is
 * taught as fact). Most of the new links are unsourced. The room must say "experimental" wherever this model runs.
 */
import { f, Clamp, Clamp01, Exp, Max, Min } from './float32.js';

const P = (value, kind, note) => ({ value, kind, note });
export const SEDATION_MODEL_VERSION = 'experimental-0.1 (2026-11-13)';
export const SEDATION_PARAMS = Object.freeze({
  // ---- depth (read from the existing engine)
  depthModel: P('Eleveld 2018 PK/PD, BIS with Bouillon/Greco opioid synergy', 'signoff', 'Owner decision recorded 2026-06-11 for the Unity trainer, carried into this engine; the record is in the assistant\'s session notes, no signed document was found in either repository'),
  // ---- drive
  drugDepressionFloor: P(0, 'unsourced', 'The engine floors drug depression at 0.1 (never apnea). Here it may reach 0 so a deep enough dose stops breathing. The per-drug coefficients themselves (propofol 0.6 at Ce 4, fentanyl 1.1, midazolam 0.3, volatile 0.4 per MAC) are the engine\'s own, ported from the Unity trainer without a citation'),
  propofolDepression: P('(Ce/4)^2, 0 to 1', 'unsourced', 'Experimental mode only: propofol depresses central drive by the square of Ce/4, so an induction concentration (Ce 4 or more) stops breathing and sedation concentrations (Ce 1.5-2.5) slow it by 15-40 %. The engine\'s own rule is 0.6 x Ce/4 and never reaches apnea. Shape and threshold need review against the FDA propofol label and the literature'),
  co2SetPointMmHg: P(40, 'source', 'Normal arterial PCO2 35-45 mmHg (any physiology text)'),
  co2GainPerMmHg: P(0.05, 'unsourced', 'Fractional rise in drive per mmHg above the set point when undrugged. Chosen so 60 mmHg about doubles awake ventilation; the real response varies widely between people'),
  co2GainBluntedByDrugs: P(true, 'unsourced', 'The CO2 gain is multiplied by the square of the remaining drug drive, so a drugged patient responds much less to the same rise (the direction is textbook; the shape is not sourced)'),
  co2DriveMax: P(2.5, 'unsourced', 'Ceiling on the CO2 term'),
  tidalVolumeMlPerKgIbw: P(7, 'unsourced', 'The engine uses 7 mL/kg of TOTAL weight; here it is ideal body weight, so a 139 kg man does not breathe 975 mL breaths. 7 mL/kg is the engine\'s own figure'),
  tidalVolumeShallowing: P(0.45, 'unsourced', 'Tidal volume falls to (1 - 0.45) of normal as drug depression takes the drive to zero: drugged breathing is shallow as well as slow; a CO2 rise speeds the rate but does not deepen the breath here'),
  deadSpaceMlPerKgIbw: P(2.2, 'source', 'Anatomic dead space about 1 mL per lb (2.2 mL/kg) of IDEAL body weight (Radford 1955 rule, as in standard texts). The engine applies it to total weight; here it is ideal weight'),
  idealBodyWeight: P('Devine: male 50 kg, female 45.5 kg, + 2.3 kg per inch over 60 in', 'source', 'Devine BJ, Drug Intell Clin Pharm 1974 (the formula used by ARDSNet)'),
  apneaRateThreshold: P(2, 'source', 'The engine\'s own rule: fewer than 2 breaths a minute counts as not breathing'),
  // ---- patency
  obstructionHalfBis: P(55, 'unsourced', 'BIS at which a patient with an ordinary airway has lost half the upper-airway flow. Direction (deeper = more collapse) is established; the number is not'),
  obstructionWidthBis: P(5, 'unsourced', 'Steepness of that loss, in BIS points'),
  shiftOsa: P(6, 'unsourced', 'An OSA patient obstructs 6 BIS points lighter'),
  shiftBmi40: P(4, 'unsourced', 'BMI 40 or more: 4 points lighter'),
  shiftMallampati34: P(2, 'unsourced', 'Mallampati III or IV: 2 points lighter'),
  shiftLateral: P(-6, 'unsourced', 'Lateral position: 6 points deeper before the same collapse. Direction supported by Isono S et al., Anesthesiology 2002;97:780 (lateral position decreases collapsibility of the passive pharynx in OSA, doi:10.1097/00000542-200210000-00006); the size is not'),
  shiftRamped: P(-3, 'unsourced', 'Head-up/ramped: 3 points deeper. Direction plausible; not sourced here'),
  reliefChinLift: P(0.55, 'unsourced', 'Fraction of the obstruction left with a chin lift'),
  reliefJawThrust: P(0.3, 'unsourced', 'Fraction left with a jaw thrust'),
  reliefNasalAirway: P(0.5, 'unsourced', 'Fraction left with a nasal airway'),
  reliefOralAirway: P(0.35, 'unsourced', 'Fraction left with an oral airway (only tolerated deep; the model does not yet model gagging)'),
  patencyFloor: P(0.03, 'unsourced', 'Complete obstruction still leaks a little'),
  // ---- oxygen
  oxygenStore: P('mass balance: d(stores)/dt = VA x (FiO2 - FAO2) - VO2', 'source', 'The alveolar gas equation at steady state (FAO2 = FiO2 - VO2/VA), standard respiratory physiology. Replaces, in this mode only, the engine\'s blend toward an empty store by VA / (0.045 L/min per kg of TOTAL weight), which made any hypoventilation in a large patient behave like apnea. Apnea still drains the store at VO2, so the signed-off Benumof apnea times are unchanged. VO2 itself is the engine\'s 3.5 mL/kg of total weight (unsourced for obesity)'),
  alveolarPO2: P('PAO2 = FAO2 x (PB - PH2O), with FAO2 from the mass-balanced store', 'source', 'Equivalent at steady state to the alveolar gas equation PAO2 = PIO2 - PACO2/R (863/713 converts VO2 to alveolar conditions). The engine subtracts PaCO2/0.8 from a store that does not account for O2 uptake; with the mass balance that would count uptake twice'),
  metabolicWeight: P('ideal body weight + 0.4 x (total - ideal)', 'unsourced', 'VO2 (3.5 mL/kg) and VCO2 (2.8 mL/kg) are scaled to this weight instead of total weight. The scalar is borrowed from drug dosing (adjusted body weight); its use for metabolic rate is NOT sourced. Without it a 139 kg man breathing ideal-weight tidal volumes sits at PaCO2 near 60 awake'),
  cannulaFio2: P('0.20 + 0.04 per L/min, 1-6 L/min (24-44 %)', 'unsourced', 'Bedside rule of thumb found in many nursing and respiratory texts; real FiO2 by cannula falls as the patient\'s minute ventilation rises and with mouth breathing. Not from a validated model'),
  cannulaMaxFlow: P(6, 'unsourced', 'Flows above 6 L/min by ordinary cannula add little and dry the mucosa (common practice)'),
});

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
    if (this.device === 'cannula' && this.flowLPerMin > 0) return Clamp(f(0.20 + 0.04 * this.flowLPerMin), 0.21, 0.44);
    return f(0.21);
  }
  /** CO2 term of central drive. */
  co2Term(drugDrive) {
    const S = SEDATION_PARAMS, gain = f(S.co2GainPerMmHg.value * (S.co2GainBluntedByDrugs.value ? drugDrive * drugDrive : 1));
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
