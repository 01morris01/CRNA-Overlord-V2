import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  buildPhysRig, LidocaineSystem, VentMode,
} from '../sim/index.js';

const DIRECT_STEP = 0.5;
let maximumMassBalanceErrorMg = 0;

function advanceDirect(lidocaine, seconds) {
  const steps = Math.round(seconds / DIRECT_STEP);
  for (let index = 0; index < steps; index++) {
    lidocaine.tick(DIRECT_STEP);
    maximumMassBalanceErrorMg = Math.max(maximumMassBalanceErrorMg, lidocaine.massBalanceErrorMg);
  }
}

function concentrationRow(label, timeMin, l) {
  return [
    label, timeMin,
    l.plasmaTotalMcgMl.toFixed(5),
    l.plasmaFreeMcgMl.toFixed(5),
    l.effectSiteMcgMl.toFixed(5),
    l.centralMg.toFixed(4),
    l.peripheralMg.toFixed(4),
    l.eliminatedMg.toFixed(4),
  ].join(',');
}

function printSystemicCurves() {
  const bolus = new LidocaineSystem();
  const infusion = new LidocaineSystem();
  bolus.giveIvBolus({ doseMgPerKg: 1.5 });
  infusion.startInfusion({ rateMgPerKgHour: 1.5 });
  const times = [0, 1, 2, 5, 10, 30, 60, 90, 120, 180];
  let previous = 0;

  console.log('SYSTEMIC LIDOCAINE CURVES');
  console.log('case,time_min,total_mcg_ml,free_mcg_ml,effect_site_mcg_ml,central_mg,peripheral_mg,eliminated_mg');
  for (const time of times) {
    advanceDirect(bolus, (time - previous) * 60);
    advanceDirect(infusion, (time - previous) * 60);
    console.log(concentrationRow('bolus_1.5_mg_kg', time, bolus));
    console.log(concentrationRow('infusion_1.5_mg_kg_hr', time, infusion));
    previous = time;
  }
  assert.equal(bolus.toxicityStage, 'none');
  assert.ok(bolus.peakPlasmaTotalMcgMl < 5);
}

function printRegionalCurves() {
  const cases = [
    ['epidural', false], ['peripheral', false], ['infiltration', false],
    ['infiltration', true],
  ].map(([route, epinephrine]) => {
    const l = new LidocaineSystem();
    l.administerRegional({
      route, concentrationPercent: 1, volumeMl: 20, epinephrine,
    });
    return { route, epinephrine, l };
  });
  const times = [0, 15, 30, 60, 120, 180, 240, 360, 480, 720];
  let previous = 0;

  console.log('REGIONAL ROUTE AND EPINEPHRINE CURVES');
  console.log('route,epinephrine,time_min,total_mcg_ml,sensory_block,motor_block,sympathectomy,remaining_mg');
  for (const time of times) {
    for (const entry of cases) advanceDirect(entry.l, (time - previous) * 60);
    for (const { route, epinephrine, l } of cases) {
      console.log([
        route, epinephrine, time,
        l.plasmaTotalMcgMl.toFixed(5),
        l.regionalSensoryBlock.toFixed(5),
        l.regionalMotorBlock.toFixed(5),
        l.epiduralSympathectomyContribution.toFixed(5),
        l.regionalDepotMg.toFixed(4),
      ].join(','));
    }
    previous = time;
  }
  const summaries = cases.map(({ route, epinephrine, l }) => ({
    route, epinephrine,
    cmaxMcgMl: l.regionalHistory[0].cmaxMcgMl,
    timeToCmaxMin: l.regionalHistory[0].timeToCmaxMin,
    blockDurationSec: l.regionalHistory[0].blockDurationSec,
  }));
  console.log('REGIONAL SUMMARIES');
  console.log(JSON.stringify(summaries));
  const noEpi = summaries.filter((entry) => !entry.epinephrine);
  assert.ok(noEpi.find((entry) => entry.route === 'epidural').cmaxMcgMl
    > noEpi.find((entry) => entry.route === 'peripheral').cmaxMcgMl);
  assert.ok(noEpi.find((entry) => entry.route === 'peripheral').cmaxMcgMl
    > noEpi.find((entry) => entry.route === 'infiltration').cmaxMcgMl);
  const peripheralTmax = noEpi.find((entry) => entry.route === 'peripheral').timeToCmaxMin;
  assert.ok(peripheralTmax >= 108 && peripheralTmax <= 168);
}

function runStimulus(block) {
  const rig = buildPhysRig(8128);
  if (block) {
    rig.l.administerRegional({
      route: 'peripheral', concentrationPercent: 1.5, volumeMl: 20, epinephrine: false,
    });
  }
  rig.core.stepFor(30 * 60);
  const baseline = { hr: rig.p.heartRate, map: rig.p.meanArterialPressure };
  rig.l.setSurgicalStimulus(1);
  let peakHr = rig.p.heartRate;
  let peakMap = rig.p.meanArterialPressure;
  for (let second = 0; second < 90; second += 1) {
    rig.core.stepFor(1);
    peakHr = Math.max(peakHr, rig.p.heartRate);
    peakMap = Math.max(peakMap, rig.p.meanArterialPressure);
  }
  return {
    baseline, peakHr, peakMap,
    regionalSensoryBlock: rig.l.regionalSensoryBlock,
    rawStimulus: rig.l.surgicalStimulusRaw,
    effectiveStimulus: rig.l.surgicalStimulusEffective,
  };
}

function printStimulusEvidence() {
  const unblocked = runStimulus(false);
  const blocked = runStimulus(true);
  console.log('BLOCK AND STIMULATION COMPARISON');
  console.log(JSON.stringify({ unblocked, blocked }));
  assert.ok(unblocked.peakHr > blocked.peakHr + 10);
  assert.ok(unblocked.peakMap > blocked.peakMap + 8);
}

function printToxicityAndRescue() {
  const therapeutic = new LidocaineSystem();
  therapeutic.giveIvBolus({ doseMgPerKg: 1.5 });
  advanceDirect(therapeutic, 120);

  const transitions = new LidocaineSystem();
  for (const target of [5.5, 8.5, 11.5]) {
    transitions.injectToxicExposure({ targetPlasmaMcgMl: target });
    transitions.tick(DIRECT_STEP);
  }
  console.log('THERAPEUTIC AND TOXIC EXPOSURE');
  console.log(JSON.stringify({
    therapeutic: {
      total: therapeutic.plasmaTotalMcgMl,
      free: therapeutic.plasmaFreeMcgMl,
      effectSite: therapeutic.effectSiteMcgMl,
      antiarrhythmic: therapeutic.antiarrhythmicContribution,
      stage: therapeutic.toxicityStage,
    },
    toxic: {
      total: transitions.plasmaTotalMcgMl,
      cns: transitions.cnsToxicity,
      cardiac: transitions.cardiacToxicity,
      stage: transitions.toxicityStage,
    },
  }));
  console.log('ORDERED LAST TRANSITIONS');
  console.log(JSON.stringify(transitions.toxicityHistory));
  assert.deepEqual(transitions.toxicityHistory.map((entry) => entry.stage), [
    'warning', 'cns', 'cardiac',
  ]);

  const run = ({ target, rescue }) => {
    const rig = buildPhysRig(9753);
    rig.l.injectToxicExposure({ targetPlasmaMcgMl: target });
    rig.core.stepFor(15);
    const before = {
      total: rig.l.plasmaTotalMcgMl,
      free: rig.l.plasmaFreeMcgMl,
      map: rig.p.meanArterialPressure,
      stage: rig.l.toxicityStage,
    };
    if (rescue === 'adequate') {
      rig.l.giveLipidBolus();
      rig.l.startLipidInfusion();
    } else if (rescue === 'inadequate') {
      rig.l.giveLipidBolus();
    }
    rig.core.stepFor(120);
    return {
      before,
      after: {
        total: rig.l.plasmaTotalMcgMl,
        free: rig.l.plasmaFreeMcgMl,
        map: rig.p.meanArterialPressure,
        stage: rig.l.toxicityStage,
        lipidCumulativeMlKg: rig.l.lipidCumulativeMlKg,
        lipidBoundMg: rig.l.lipidBoundMg,
      },
    };
  };
  const noRescue = run({ target: 11.5, rescue: 'none' });
  const adequate = run({ target: 11.5, rescue: 'adequate' });
  const inadequate = run({ target: 18, rescue: 'inadequate' });
  console.log('LIPID RESCUE COMPARISON');
  console.log(JSON.stringify({ noRescue, adequate, inadequate }));
  assert.ok(adequate.after.free < noRescue.after.free);
  assert.ok(adequate.after.map > noRescue.after.map + 10);
  assert.notEqual(inadequate.after.stage, 'none');
}

function fingerprintPoint(rig, label) {
  return {
    label,
    t: rig.core.simTime,
    hr: rig.p.heartRate,
    sbp: rig.p.systolicBP,
    dbp: rig.p.diastolicBP,
    map: rig.p.meanArterialPressure,
    rhythm: rig.p.derivedRhythm,
    total: rig.l.plasmaTotalMcgMl,
    free: rig.l.plasmaFreeMcgMl,
    effectSite: rig.l.effectSiteMcgMl,
    sensory: rig.l.regionalSensoryBlock,
    stimulus: rig.l.surgicalStimulusEffective,
    irritability: rig.l.ventricularIrritabilityEffective,
    stage: rig.l.toxicityStage,
    cns: rig.l.cnsToxicity,
    cardiac: rig.l.cardiacToxicity,
    lipid: rig.l.lipidCumulativeMlKg,
    lipidBoundMg: rig.l.lipidBoundMg,
  };
}

function combinedLidocaineRun() {
  const rig = buildPhysRig(606060);
  const points = [];
  rig.l.administerRegional({
    route: 'epidural', concentrationPercent: 0.5, volumeMl: 10, epinephrine: false,
  });
  rig.core.stepFor(15 * 60);
  points.push(fingerprintPoint(rig, 'mid_absorption'));
  rig.l.setSurgicalStimulus(1);
  rig.core.stepFor(30);
  points.push(fingerprintPoint(rig, 'mid_stimulation'));
  rig.l.setVentricularIrritability(0.8);
  rig.l.giveIvBolus({ doseMgPerKg: 1.5 });
  rig.core.stepFor(120);
  points.push(fingerprintPoint(rig, 'mid_arrhythmia_suppression'));
  rig.l.injectToxicExposure({ targetPlasmaMcgMl: 11.5 });
  rig.core.stepFor(10);
  points.push(fingerprintPoint(rig, 'mid_toxicity'));
  rig.l.giveLipidBolus();
  rig.l.startLipidInfusion();
  rig.core.stepFor(30);
  points.push(fingerprintPoint(rig, 'mid_rescue'));
  const payload = JSON.stringify({
    points,
    doseHistory: rig.l.doseHistory,
    regionalHistory: rig.l.regionalHistory,
    toxicityHistory: rig.l.toxicityHistory,
    lipidHistory: rig.l.lipidRescueHistory,
  });
  return { points, hash: createHash('sha256').update(payload).digest('hex') };
}

function noLidocaineBaselineRun() {
  const rig = buildPhysRig(424242, 70, 170, 45);
  const sample = (label) => ({
    label, t: rig.core.simTime,
    hr: rig.p.heartRate, sbp: rig.p.systolicBP, dbp: rig.p.diastolicBP,
    map: rig.p.meanArterialPressure, spo2: rig.p.spO2, etco2: rig.p.etCO2,
    rr: rig.p.respiratoryRate, tof: rig.p.trainOfFourCount,
    tofRatio: rig.p.trainOfFourRatio, ppf: rig.p.propofolCe,
    fent: rig.p.fentanylCe, roc: rig.p.rocuroniumCe,
    mechanical: rig.v.mechanicalMinuteVentilation,
    effective: rig.v.effectiveMinuteVentilation,
    airway: rig.p.airwayDeviceState,
    ppv: rig.a.ppvActive, attempt: rig.a.intubationInProgress,
  });
  const points = [sample('initial')];
  rig.v.o2FlowLPerMin = 10; rig.v.airFlowLPerMin = 0;
  rig.core.stepFor(180); points.push(sample('preox'));
  rig.d.administerBolus('Propofol', 140);
  rig.d.administerBolus('Fentanyl', 0.14);
  rig.d.administerBolus('Rocuronium', 42);
  rig.p.setForcedApnea(true);
  rig.a.deliverMaskVentilation({ durationSeconds: 30, tidalVolumeMl: 500, respiratoryRate: 12 });
  rig.core.stepFor(15); points.push(sample('mid_ppv'));
  rig.core.stepFor(15);
  rig.a.configureIntubation({ failedIntubationAttempts: [], attemptDurationSeconds: 30 });
  rig.a.attemptIntubation();
  rig.core.stepFor(15); points.push(sample('mid_attempt'));
  rig.core.stepFor(15); points.push(sample('intubated'));
  rig.v.setMode(VentMode.VCV);
  rig.v.setTidalVolume = 500; rig.v.setRespiratoryRate = 12; rig.v.setFiO2 = 0.5;
  rig.core.stepFor(60); points.push(sample('ventilated'));
  return createHash('sha256').update(JSON.stringify(points)).digest('hex');
}

printSystemicCurves();
printRegionalCurves();
printStimulusEvidence();
printToxicityAndRescue();

const first = combinedLidocaineRun();
const second = combinedLidocaineRun();
console.log('COMBINED LIDOCAINE DETERMINISM');
console.log(JSON.stringify(first.points));
console.log(`fingerprint_a=${first.hash}`);
console.log(`fingerprint_b=${second.hash}`);
assert.equal(first.hash, second.hash);

const baselineHash = noLidocaineBaselineRun();
const expectedPreFeatureHash = 'a85cf28e3e1249b50283b1e1be77ba117ea2739851a62ba058c9f3ce29ac8826';
console.log('NO-LIDOCAINE PRE-FEATURE FINGERPRINT');
console.log(`expected=${expectedPreFeatureHash}`);
console.log(`actual=${baselineHash}`);
assert.equal(baselineHash, expectedPreFeatureHash);

console.log(`MAXIMUM MASS BALANCE ERROR MG=${maximumMassBalanceErrorMg}`);
assert.ok(maximumMassBalanceErrorMg < 0.02);
console.log('LIDOCAINE EVIDENCE: PASS');
