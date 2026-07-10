/* ═══════════════════════════════════════════════════════════════════
   simRunner.js — wraps the ported deterministic engine in a wall-clock
   real-time driver. Advances the sim in fixed 0.02 s steps (preserving
   C# determinism per step) paced to real time × speed, and emits a flat
   vitals snapshot each animation frame. All patient / machine / drug
   control goes through here so the console never touches engine
   internals directly.
   ═══════════════════════════════════════════════════════════════════ */
import { AirwayDevice, buildPhysRig, VentMode } from '../sim/index.js';

const SEED = 12345;

export const DEFAULT_CONFIG = {
  weightKg: 70, heightCm: 170, ageYears: 45, sex: 'Male',
  baselineHR: 72, baselineSystolic: 120, baselineDiastolic: 80,
  baselineSpO2: 99, baselineRR: 14, baselineTemp: 36.6, baselineEtCO2: 38,
};

export class SimRunner {
  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.running = false;
    this.speed = 1;
    this.simTime = 0;
    this.onTick = null;   // (snapshot) => void, every frame
    this.onEvent = null;  // (entry) => void, on logged action
    this.log = [];
    this._accum = 0;
    this._lastReal = 0;
    this._raf = 0;
    this._interval = 0;
    this._rafLoop = this._rafLoop.bind(this);
    this._tick = this._tick.bind(this);
    this.build();
  }

  build() {
    const c = this.config;
    const { p, d, v, core } = buildPhysRig(SEED, c.weightKg, c.heightCm, c.ageYears);
    p.sex = c.sex;
    p.baselineHR = c.baselineHR;
    p.baselineSystolic = c.baselineSystolic;
    p.baselineDiastolic = c.baselineDiastolic;
    p.baselineSpO2 = c.baselineSpO2;
    p.baselineRR = c.baselineRR;
    p.baselineTemp = c.baselineTemp;
    p.baselineEtCO2 = c.baselineEtCO2;
    p.resetToBaseline();
    core.initialize(SEED);
    this.p = p; this.d = d; this.v = v; this.core = core;
    this.simTime = 0; this._accum = 0;
  }

  applyConfig(patch) {
    Object.assign(this.config, patch);
    const wasRunning = this.running;
    this.pause();
    this.build();
    this.logEvent('Patient reset', `${this.config.weightKg} kg · ${this.config.ageYears} y · ${this.config.sex}`);
    this.emit();
    if (wasRunning) this.start();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._lastReal = performance.now();
    // rAF paces smoothly while the tab is visible; the interval keeps the
    // sim advancing on wall-clock time even when this tab is backgrounded
    // (e.g. operator clicks over to the second-screen monitor window).
    // Both call _tick and share _lastReal, so elapsed time is never counted twice.
    this._raf = requestAnimationFrame(this._rafLoop);
    this._interval = setInterval(() => this._tick(performance.now()), 100);
  }

  pause() {
    this.running = false;
    cancelAnimationFrame(this._raf);
    clearInterval(this._interval);
    this._interval = 0;
    this.emit();
  }

  reset() {
    this.pause();
    this.build();
    this.log = [];
    this.emit();
  }

  setSpeed(mult) { this.speed = mult; }

  _rafLoop(now) {
    if (!this.running) return;
    this._tick(now);
    this._raf = requestAnimationFrame(this._rafLoop);
  }

  _tick(now) {
    if (!this.running) return;
    let dtReal = (now - this._lastReal) / 1000;
    if (dtReal <= 0) return; // another path already consumed this slice
    this._lastReal = now;
    if (dtReal > 0.5) dtReal = 0.5; // don't fast-forward after a long background gap
    this._accum += dtReal * this.speed;
    const step = this.core.fixedStep;
    let guard = 0;
    while (this._accum >= step && guard < 8000) {
      this.core.stepOnce(step);
      this._accum -= step;
      guard++;
    }
    this.simTime = this.core.simTime;
    this.emit();
  }

  emit() { if (this.onTick) this.onTick(this.snapshot()); }

  snapshot() {
    const p = this.p, v = this.v;
    return {
      t: this.simTime,
      hr: p.heartRate, sbp: p.systolicBP, dbp: p.diastolicBP,
      // MAP falls back to the derived value before the first tick computes it
      map: p.meanArterialPressure > 0 ? p.meanArterialPressure : p.diastolicBP + (p.systolicBP - p.diastolicBP) / 3,
      spo2: p.spO2, rr: p.respiratoryRate, etco2: p.etCO2, temp: p.temperature,
      bis: p.bisIndex, mac: p.macMultiple, etAgent: p.endTidalAgent, agent: p.currentAgent,
      tof: p.trainOfFourCount, tofRatio: p.trainOfFourRatio,
      ppeak: v.measuredPeakPressure, mv: v.measuredMinuteVent, tv: v.measuredTidalVolume,
      fio2: p.fiO2, ventMode: v.mode, vaporizer: v.vaporizerDial, vaporizerAgent: v.vaporizerAgent,
      intubated: p.isIntubated, spont: p.isBreathingSpontaneously, status: p.status,
      airwayDevice: p.airwayDeviceState, forcedApnea: p.forcedApneaActive,
      forcedApneaContribution: p.forcedApneaContribution,
      drugDepressionContribution: p.drugDepressionContribution,
      complicationDriveContribution: p.complicationDriveContribution,
      centralDrive: p.centralDrive, effectiveNmbBlockade: p.effectiveNmbBlockade,
      respiratoryMuscleCapability: p.respiratoryMuscleCapability,
      spontaneousRR: p.spontaneousRespiratoryRate, spontaneousTV: p.spontaneousTidalVolume,
      spontaneousMV: p.spontaneousMinuteVentilation, spontaneousEffort: p.spontaneousEffort,
      capnogramPresent: p.capnogramPresent,
      sugammadexRocRelief: this.d.sugammadexRocRelief,
      neostigmineRocRelief: this.d.neostigmineRocRelief,
      running: this.running, speed: this.speed,
      patient: `${this.config.weightKg} kg · ${this.config.ageYears} y · ${this.config.sex}`,
      // physiologic drivers (truth-boundary inputs) + drug context for the advisor
      svr: p.svrFactor, vol: p.bloodVolumeFraction, airwayRes: p.airwayResistanceFactor,
      shunt: p.shuntFraction, hrOffset: p.hrComplicationOffset, respDrive: p.respiratoryDriveFactor,
      heat: p.heatLoadC, vco2: p.vco2MlMin,
      propofolCe: p.propofolCe, fentanylCe: p.fentanylCe, midazolamCe: p.midazolamCe,
      weightKg: this.config.weightKg,
    };
  }

  // ── physiologic drivers (truth boundary: set drivers, engine derives vitals) ──
  setDriver(key, value) { if (this.p) this.p[key] = value; }

  driverDefaults() {
    return {
      svrFactor: 1, bloodVolumeFraction: 1, airwayResistanceFactor: 1, shuntFraction: 0,
      hrComplicationOffset: 0, respiratoryDriveFactor: 1, heatLoadC: 0,
      vco2MlMin: this.p ? this.p.deriveRestingVco2() : 200,
    };
  }

  applyCondition(name, patch) {
    if (!this.p) return;
    const d = this.driverDefaults();
    Object.assign(d, patch);
    for (const k in d) this.p[k] = d[k];
    this.logEvent('Condition', name, { action: 'condition', name });
  }

  // live baseline nudge — engine lerps current vitals toward the new baseline (no reset)
  setBaselineLive(key, value) { if (this.p) this.p[key] = value; this.config[key] = value; }

  // ── control surface ────────────────────────────────────────────────
  giveBolus(name, doseMg, label) {
    this.d.administerBolus(name, doseMg);
    this.logEvent('Drug', label || `${name} ${doseMg} mg`, { action: 'drug', drug: name, doseMg });
  }

  setVentMode(mode) { this.v.setMode(mode); this.logEvent('Ventilator', `Mode → ${ventName(mode)}`); }

  setMachine(patch) {
    Object.assign(this.v, patch);
    if ('mode' in patch) this.v.setMode(patch.mode);
  }

  intubate() {
    const result = this.p.transitionAirwayDevice(AirwayDevice.Intubated);
    if (!result.ok) return result;
    this.v.setMode(VentMode.VCV);
    this.v.setTidalVolume = Math.round(this.config.weightKg * 7);
    this.v.setRespiratoryRate = 12;
    this.v.setPeep = 5;
    this.logEvent('Airway', `Intubated · VCV ${this.v.setTidalVolume} mL × 12`, { action: 'intubate' });
    return result;
  }

  extubate() {
    const result = this.p.transitionAirwayDevice(AirwayDevice.Extubated);
    if (!result.ok) return result;
    this.v.setMode(VentMode.Manual);
    this.logEvent('Airway', 'Extubated · manual/spontaneous', { action: 'extubate' });
    return result;
  }

  setAirwayDevice(next) { return this.p.transitionAirwayDevice(next); }

  setForcedApnea(active) {
    this.p.setForcedApnea(active);
    this.logEvent('Respiratory drive', active ? 'Forced apnea imposed' : 'Forced apnea lifted', {
      action: active ? 'force_apnea' : 'lift_forced_apnea',
    });
  }

  logEvent(kind, detail, meta) {
    const entry = { t: this.simTime, kind, detail, meta: meta || null };
    this.log.push(entry);
    if (this.onEvent) this.onEvent(entry);
  }
}

export function ventName(m) {
  return { 0: 'Manual/Bag', 1: 'VCV', 2: 'PCV', 3: 'PSV' }[m] || String(m);
}
export { VentMode };
