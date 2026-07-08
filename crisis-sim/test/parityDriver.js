/* Reproduces ScenarioParityExport.cs action scripts in the JS engine and
   samples the same per-tick state, so fixtures can be asserted bit-for-bit. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildRig } from '../sim/index.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCEN_DIR = join(HERE, '..', 'sim', 'scenarios');
const FIXED_STEP = Math.fround(0.02); // C# SimulationCore.fixedStep = 0.02f (float32)
const SAMPLE_EVERY = 10;

function loadScenario(id) {
  return JSON.parse(readFileSync(join(SCEN_DIR, `${id}.json`), 'utf8'));
}

function sample(rig, tick) {
  const { p, s } = rig;
  return {
    tick,
    elapsed: s.elapsedTime,
    hr: p.heartRate, sbp: p.systolicBP, dbp: p.diastolicBP, map: p.meanArterialPressure,
    spo2: p.spO2, etco2: p.etCO2, rr: p.respiratoryRate, temp: p.temperature, bis: p.bisIndex,
    paO2: p.paO2, paCO2: p.paCO2, alvO2Frac: p.alveolarO2Fraction, alvO2Stores: p.alveolarO2StoresMl,
    fiO2: p.fiO2, tidalVolume: p.tidalVolume, minuteVent: p.minuteVentilation,
    peakPressure: p.peakAirwayPressure, plateauPressure: p.plateauPressure,
    macMultiple: p.macMultiple, endTidalAgent: p.endTidalAgent, vco2: p.vco2MlMin,
    svrFactor: p.svrFactor, hrOffset: p.hrComplicationOffset, airwayResist: p.airwayResistanceFactor,
    airwayPatency: p.airwayPatency, shunt: p.shuntFraction, heatLoad: p.heatLoadC,
    bloodVol: p.bloodVolumeFraction, respDrive: p.respiratoryDriveFactor,
    tofRatio: p.trainOfFourRatio, tofCount: p.trainOfFourCount,
    propofolCe: p.propofolCe, fentanylCe: p.fentanylCe, rocuroniumCe: p.rocuroniumCe,
    midazolamCe: p.midazolamCe, suxCe: p.succinylcholineCe,
    epiCe: p.epinephrineCe, phenylCe: p.phenylephrineCe, ephedCe: p.ephedrineCe,
    naloxCe: p.naloxoneCe, dantCe: p.dantroleneCe, atropCe: p.atropineCe, albCe: p.albuterolCe,
    score: s.currentScore, maxScore: s.maxPossibleScore,
  };
}

function makeCtx(rig) {
  const ctx = { rig, samples: [], tick: 0 };
  ctx.rec = () => ctx.samples.push(sample(rig, ctx.tick));
  return ctx;
}

function advance(ctx, seconds) {
  const steps = Math.round(seconds / FIXED_STEP); // RoundToInt of an exact multiple
  for (let i = 0; i < steps; i++) {
    ctx.rig.core.stepOnce(FIXED_STEP);
    ctx.tick++;
    if (ctx.tick % SAMPLE_EVERY === 0) ctx.rec();
  }
}

function wrap(rig, ctx) {
  return {
    finalScore: rig.s.currentScore,
    maxScore: rig.s.maxPossibleScore,
    samples: ctx.samples,
    actionLog: rig.s.actionLog.entries.map((e) => ({
      tSec: e.tSec, action: e.action, canonical: e.canonical, drug: e.drug, doseMg: e.doseMg,
      classification: e.classification, pointsDelta: e.pointsDelta,
      hr: e.hr, sbp: e.sbp, dbp: e.dbp, map: e.map, spo2: e.spo2, etco2: e.etco2,
      rr: e.rr, tempC: e.tempC, bis: e.bis,
    })),
    debrief: rig.s.lastResult,
  };
}

export function runRsi() {
  const rig = buildRig(4242);
  rig.s.loadRaw(loadScenario('rsi_hypotension_001'));
  rig.s.startScenario();
  const c = makeCtx(rig); c.rec();
  advance(c, 10);
  rig.s.recordStudentAction('PreOxygenate');
  advance(c, 30);
  rig.s.recordDrugAction('Propofol', 190);
  advance(c, 60);
  rig.s.recordDrugAction('Rocuronium', 95);
  advance(c, 20);
  rig.s.recordStudentAction('Intubate');
  advance(c, 15);
  rig.s.recordStudentAction('ConfirmEtCO2');
  rig.s.recordDrugAction('Phenylephrine', Math.fround(0.1));
  advance(c, 90);
  rig.s.endCase();
  return wrap(rig, c);
}

export function runHighSpinal() {
  const rig = buildRig(4244);
  rig.s.loadRaw(loadScenario('high_spinal_001'));
  rig.s.startScenario();
  const c = makeCtx(rig); c.rec();
  advance(c, 5);
  advance(c, 115);
  rig.s.recordStudentAction('SetFiO2_100');
  rig.s.recordDrugAction('Ephedrine', 10);
  rig.s.recordDrugAction('Atropine', 0.5);
  rig.s.recordStudentAction('CallForHelp');
  advance(c, 150);
  rig.s.endCase();
  return wrap(rig, c);
}

export function runMh() {
  const rig = buildRig(4245);
  rig.s.loadRaw(loadScenario('malignant_hyperthermia_001'));
  rig.s.startScenario();
  const c = makeCtx(rig); c.rec();
  advance(c, 180);
  rig.s.recordStudentAction('StopVolatile');
  rig.s.recordStudentAction('SetFiO2_100');
  rig.s.recordStudentAction('Hyperventilate');
  rig.s.recordDrugAction('Dantrolene', 200);
  rig.s.recordStudentAction('ActiveCooling');
  rig.s.recordStudentAction('CallForHelp');
  advance(c, 300);
  rig.s.endCase();
  return wrap(rig, c);
}

export const RUNNERS = {
  rsi_hypotension_001: runRsi,
  high_spinal_001: runHighSpinal,
  malignant_hyperthermia_001: runMh,
};
