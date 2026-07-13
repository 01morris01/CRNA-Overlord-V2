/* ═══════════════════════════════════════════════════════════════════
   simRunner.js — wraps the ported deterministic engine in a wall-clock
   real-time driver. Advances the sim in fixed 0.02 s steps (preserving
   C# determinism per step) paced to real time × speed, and emits a flat
   vitals snapshot each animation frame. All patient / machine / drug
   control goes through here so the console never touches engine
   internals directly.
   ═══════════════════════════════════════════════════════════════════ */
import {
  AirwayDevice, buildPhysRig, ScenarioManager, VentMode,
} from '../sim/index.js';
import { buildDebrief as buildScenarioDebrief } from '../sim/scenario/scenarioDebrief.js';

const SEED = 12345;

export const LIVE_COMPLICATIONS = Object.freeze([
  'Bronchospasm', 'HighSpinal', 'Sympathectomy', 'Anaphylaxis',
  'MalignantHyperthermia', 'OpioidRespDepression',
  'OpioidInducedRespiratoryDepression', 'Hemorrhage', 'Laryngospasm',
  'LocalAnestheticToxicity', 'TensionPneumothorax', 'VentricularFibrillation',
]);

function liveScenarioDefinition(config) {
  return {
    id: 'live_sim',
    title: 'Live Anesthesia Simulation',
    courseUnit: 'Live Simulation',
    maxDurationSeconds: 86400,
    tags: ['Live simulation', 'Anesthesia'],
    learningObjectives: [],
    expectedActions: [],
    dangerousActions: [],
    events: [],
    patientProfile: {
      weightKg: config.weightKg,
      heightCm: config.heightCm,
      ageYears: config.ageYears,
      sex: config.sex,
      baselineHR: config.baselineHR,
      baselineSystolic: config.baselineSystolic,
      baselineDiastolic: config.baselineDiastolic,
      baselineSpO2: config.baselineSpO2,
      baselineRR: config.baselineRR,
      baselineTemp: config.baselineTemp,
    },
    startingSetup: {
      oxygenOn: false,
      fio2: 0.21,
      tidalVolume: 0,
      respiratoryRate: 0,
      peep: 0,
      vaporizerDial: 0,
      ventMode: 'manual',
      airway: 'mask',
    },
    debrief: {
      summary: 'Instructor-led live anesthesia simulation.',
      teachingPoints: [],
      reviewTopics: [],
      reviewTags: ['Live simulation', 'Anesthesia'],
    },
  };
}

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
    const scenario = new ScenarioManager();
    scenario.patient = p;
    scenario.drugSystem = d;
    scenario.ventilator = v;
    core.scenario = scenario;
    core.initialize(SEED);
    scenario.loadRaw(liveScenarioDefinition(c));
    scenario.startScenario();
    this.p = p; this.d = d; this.v = v; this.s = scenario; this.core = core;
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
    if (typeof globalThis.cancelAnimationFrame === 'function') {
      globalThis.cancelAnimationFrame(this._raf);
    }
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
      ventSetTV: v.setTidalVolume, ventSetRR: v.setRespiratoryRate, ventSetPeep: v.setPeep,
      ventSetPressure: v.setPressureAbovePeep, ventSetPressureSupport: v.setPressureSupport,
      o2Flow: v.o2FlowLPerMin, airFlow: v.airFlowLPerMin, n2oFlow: v.n2oFlowLPerMin,
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

  injectComplication(type) {
    if (!LIVE_COMPLICATIONS.includes(type)) {
      throw new RangeError(`Unsupported complication: ${type}`);
    }
    this.s.applyComplication({ complicationType: type, description: type });
    this.logEvent('Complication', type, { action: 'complication', type });
    return { ok: true, type };
  }

  buildDebrief() {
    const def = this.s.activeScenario || liveScenarioDefinition(this.config);
    const result = buildScenarioDebrief(
      def,
      this.s.run,
      this.s.scoring,
      this.s.actionLog,
      0,
      0,
      this.simTime,
    );
    result.respiratoryAttribution = this.p.respiratoryAttribution;
    return result;
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
