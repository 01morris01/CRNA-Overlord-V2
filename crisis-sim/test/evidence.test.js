/* Ported evidence anchors — the JS engine's own standing physiology
   evidence, independent of the golden fixtures. Mirrors the key checks in
   OperatingRoom.Editor.SimEvidence: Benumof desaturation anchors,
   determinism, and the truth boundary (drivers in → derived vitals out). */
import { describe, it, expect } from 'vitest';
import {
  buildPhysRig, buildRig, Clamp01, Lerp, RoundToInt, VentMode, PatientPhysiology,
} from '../sim/index.js';
import { SimRunner } from '../ui/simRunner.js';

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

function advanceUntil(rig, predicate, maxSec = 1200) {
  for (let elapsed = 0; elapsed < maxSec; elapsed += 0.5) {
    rig.core.stepFor(0.5);
    if (predicate(rig)) return elapsed + 0.5;
  }
  throw new Error(`condition not reached within ${maxSec}s`);
}

function rocuroniumRigAtCount(targetCount, seed = 7100) {
  const rig = buildPhysRig(seed, 70, 170, 45);
  rig.d.administerBolus('Rocuronium', 210);
  advanceUntil(rig, (x) => x.p.trainOfFourCount === targetCount, 600);
  return rig;
}

function scenarioRigAtRocuroniumCount(targetCount, doseMg, seed) {
  const rig = buildRig(seed);
  rig.d.administerBolus('Rocuronium', doseMg);
  advanceUntil(rig, (x) => x.p.trainOfFourCount === targetCount, 900);
  return rig;
}

function scenarioRigAtRecoveringRocuroniumCount(targetCount, doseMg, seed) {
  const rig = buildRig(seed);
  rig.d.administerBolus('Rocuronium', doseMg);
  let sawDeepBlock = false;
  advanceUntil(rig, (x) => {
    if (x.p.trainOfFourCount === 0) sawDeepBlock = true;
    return sawDeepBlock && x.p.trainOfFourCount === targetCount;
  }, 6000);
  return rig;
}

function extendedDeterminismRun(seed) {
  const sug = rocuroniumRigAtCount(0, seed);
  sug.p.transitionAirwayDevice('intubated');
  sug.p.setForcedApnea(true);
  sug.v.setMode(VentMode.VCV);
  sug.d.administerWeightBasedBolus('Sugammadex', 16);
  sug.core.stepFor(15);
  const sugMid = [
    sug.d.sugammadexRocRelief, sug.p.effectiveNmbBlockade,
    sug.p.trainOfFourRatio, sug.p.respiratoryMuscleCapability,
    sug.p.forcedApneaContribution, sug.p.airwayDeviceState,
  ];
  sug.p.setForcedApnea(false);
  sug.p.transitionAirwayDevice('extubated');
  sug.core.stepFor(20);

  const neo = scenarioRigAtRocuroniumCount(2, 70, seed + 1);
  neo.s.recordDrugAction('Neostigmine', 4.9);
  neo.core.stepFor(210);
  const neoMid = [
    neo.d.neostigmineRocRelief, neo.p.effectiveNmbBlockade,
    neo.p.trainOfFourRatio, neo.p.respiratoryMuscleCapability,
  ];

  return {
    fingerprint: JSON.stringify([...sugMid, ...neoMid]),
    sugMidRelief: sugMid[0], neoMidRelief: neoMid[0],
  };
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

describe('reversal, respiratory drive, and airway evidence', () => {
  it('sugammadex is threshold-tiered, dose-dependent, and rocuronium-selective', () => {
    const moderate2 = rocuroniumRigAtCount(2, 7101);
    moderate2.d.administerWeightBasedBolus('Sugammadex', 2);
    moderate2.core.stepFor(15);
    const relief2At15 = moderate2.d.sugammadexRocRelief;

    const deep4 = rocuroniumRigAtCount(0, 7102);
    deep4.d.administerWeightBasedBolus('Sugammadex', 4);
    deep4.core.stepFor(15);
    const relief4At15 = deep4.d.sugammadexRocRelief;

    const deep16 = rocuroniumRigAtCount(0, 7103);
    deep16.d.administerWeightBasedBolus('Sugammadex', 16);
    deep16.core.stepFor(15);
    const relief16At15 = deep16.d.sugammadexRocRelief;

    expect(relief16At15).toBeGreaterThan(relief4At15);
    expect(relief4At15).toBeGreaterThan(relief2At15);

    moderate2.core.stepFor(240);
    deep4.core.stepFor(240);
    deep16.core.stepFor(240);
    expect(moderate2.p.trainOfFourRatio).toBeGreaterThanOrEqual(0.9);
    expect(deep4.p.trainOfFourRatio).toBeGreaterThanOrEqual(0.9);
    expect(deep16.p.trainOfFourRatio).toBeGreaterThanOrEqual(0.9);

    const underdose = scenarioRigAtRocuroniumCount(2, 70, 7104);
    const underdoseMg = Math.fround(1.99 * underdose.p.weightKg);
    underdose.s.recordDrugAction('Sugammadex', underdoseMg);
    underdose.core.stepFor(60);
    expect(underdose.d.sugammadexRocRelief).toBe(0);
    expect(underdose.s.actionLog.entries.at(-1)).toMatchObject({
      action: 'GiveSugammadex', doseMg: underdoseMg,
    });

    const suxControl = buildPhysRig(7105, 70, 170, 45);
    const suxReversed = buildPhysRig(7105, 70, 170, 45);
    suxControl.d.administerWeightBasedBolus('Succinylcholine', 3);
    suxReversed.d.administerWeightBasedBolus('Succinylcholine', 3);
    suxReversed.d.administerWeightBasedBolus('Sugammadex', 16);
    suxControl.core.stepFor(90);
    suxReversed.core.stepFor(90);
    expect(suxReversed.p.trainOfFourRatio).toBe(suxControl.p.trainOfFourRatio);
    expect(suxReversed.p.trainOfFourCount).toBe(suxControl.p.trainOfFourCount);
  });

  it('neostigmine effect is count-graded and preserves count-1 residual weakness', () => {
    const deep = scenarioRigAtRocuroniumCount(0, 210, 7201);
    deep.s.recordDrugAction('Neostigmine', 4.9);
    deep.core.stepFor(180);
    expect(deep.s.actionLog.entries.at(-1)).toMatchObject({
      action: 'GiveNeostigmine', doseMg: 4.9,
    });
    expect(deep.d.neostigmineRocRelief).toBe(0);
    expect(deep.p.trainOfFourCount).toBe(0);

    const count1Control = scenarioRigAtRecoveringRocuroniumCount(1, 210, 7202);
    const count1Neo = scenarioRigAtRecoveringRocuroniumCount(1, 210, 7202);
    count1Neo.s.recordDrugAction('Neostigmine', 4.9);
    count1Control.core.stepFor(600);
    count1Neo.core.stepFor(600);
    expect(count1Neo.d.neostigmineRocRelief).toBeGreaterThan(0);
    expect(count1Neo.p.trainOfFourRatio).toBeGreaterThan(count1Control.p.trainOfFourRatio);
    expect(count1Neo.p.trainOfFourRatio).toBeLessThan(0.9);

    const count2 = scenarioRigAtRecoveringRocuroniumCount(2, 70, 7203);
    count2.s.recordDrugAction('Neostigmine', 4.9);
    count2.core.stepFor(600);
    expect(count2.p.trainOfFourRatio).toBeGreaterThanOrEqual(0.9);

    const control = buildPhysRig(7204, 70, 170, 45);
    const neoBrady = buildPhysRig(7204, 70, 170, 45);
    const neoProtected = buildPhysRig(7204, 70, 170, 45);
    neoBrady.d.administerBolus('Neostigmine', 4.9);
    neoProtected.d.administerBolus('Neostigmine', 4.9);
    neoProtected.d.administerBolus('Glycopyrrolate', 0.4);
    control.core.stepFor(180);
    neoBrady.core.stepFor(180);
    neoProtected.core.stepFor(180);
    expect(neoBrady.p.heartRate).toBeLessThan(control.p.heartRate);
    expect(neoProtected.p.heartRate).toBeGreaterThan(neoBrady.p.heartRate);
  });

  it('TOF and respiratory capability share the sole ratio integrator', () => {
    const rig = rocuroniumRigAtCount(0, 7301);
    rig.d.administerWeightBasedBolus('Sugammadex', 16);
    const samples = [];
    for (let sec = 0; sec <= 40; sec += 5) {
      if (sec > 0) rig.core.stepFor(5);
      samples.push({
        ratio: rig.p.trainOfFourRatio,
        capability: rig.p.respiratoryMuscleCapability,
        blockade: rig.p.effectiveNmbBlockade,
        count: rig.p.trainOfFourCount,
      });
    }

    for (const sample of samples) {
      expect(sample.capability).toBe(Clamp01(sample.ratio / Math.fround(0.9)));
      expect(sample.count).toBe(RoundToInt(Lerp(4, 0, sample.blockade)));
    }
    const midRamp = samples.find((x) => x.ratio > 0.1 && x.ratio < 0.9);
    expect(midRamp).toBeDefined();
    expect(midRamp.capability).toBeLessThan(1);
  });

  it('apnea attribution changes from forced apnea to NMB across a lift timeseries', () => {
    const rig = rocuroniumRigAtCount(0, 7401);
    rig.p.setForcedApnea(true);
    rig.core.stepFor(1);
    const beforeLift = {
      forced: rig.p.forcedApneaContribution,
      drug: rig.p.drugDepressionContribution,
      complication: rig.p.complicationDriveContribution,
      muscle: rig.p.respiratoryMuscleCapability,
      source: rig.p.dominantInadequateVentilationSource,
    };
    expect(beforeLift.forced).toBe(0);
    expect(beforeLift.muscle).toBeLessThan(1);
    expect(beforeLift.source).toBe('forced_apnea');

    rig.p.setForcedApnea(false);
    const afterLift = [];
    for (let i = 0; i < 10; i++) {
      rig.core.stepOnce(rig.core.fixedStep);
      afterLift.push({
        forced: rig.p.forcedApneaContribution,
        muscle: rig.p.respiratoryMuscleCapability,
        source: rig.p.dominantInadequateVentilationSource,
      });
    }
    expect(afterLift.every((x) => x.forced === 1)).toBe(true);
    expect(afterLift.some((x) => x.source === 'nmb')).toBe(true);

    rig.d.administerWeightBasedBolus('Sugammadex', 16);
    rig.core.stepFor(240);
    expect(rig.p.respiratoryMuscleCapability).toBe(1);
    expect(rig.p.forcedApneaContribution).toBe(1);

    const opioid = buildPhysRig(7402, 70, 170, 45);
    opioid.d.administerWeightBasedBolus('Fentanyl', 0.01);
    opioid.core.stepFor(180);
    const depressed = opioid.p.drugDepressionContribution;
    expect(depressed).toBeLessThan(1);
    expect(opioid.p.forcedApneaContribution).toBe(1);
    expect(opioid.p.respiratoryMuscleCapability).toBe(1);
    expect(opioid.p.dominantInadequateVentilationSource).toBe('drug_depression');
    opioid.d.administerBolus('Naloxone', 0.4);
    opioid.core.stepFor(180);
    expect(opioid.p.drugDepressionContribution).toBeGreaterThan(depressed);

    const debriefRig = buildRig(7403);
    debriefRig.s.loadRaw({
      id: 'respiratory_attribution_evidence', title: 'Respiratory attribution evidence',
      patientProfile: {
        weightKg: 70, heightCm: 170, ageYears: 45, sex: 'Male', baselineHR: 72,
        baselineSystolic: 120, baselineDiastolic: 80, baselineSpO2: 99,
        baselineRR: 14, baselineTemp: 36.6,
      },
      startingSetup: { oxygenOn: true, fio2: 0.21, ventMode: 'manual', airway: 'native' },
      events: [], expectedActions: [], dangerousActions: [],
      debrief: { summary: '', teachingPoints: [], reviewTopics: [], reviewTags: [] },
    });
    debriefRig.s.startScenario();
    debriefRig.d.administerBolus('Rocuronium', 210);
    advanceUntil(debriefRig, (x) => x.p.trainOfFourCount === 0, 600);
    debriefRig.p.setForcedApnea(true);
    debriefRig.core.stepFor(1);
    debriefRig.s.endCase();
    expect(debriefRig.s.lastResult.respiratoryAttribution).toMatchObject({
      dominantSource: 'forced_apnea', forcedApneaContribution: 0,
    });
    expect(debriefRig.s.lastResult.respiratoryAttribution.respiratoryMuscleCapability).toBeLessThan(1);
  });

  it('airway device and forced apnea axes remain orthogonal under mandatory support', () => {
    const supported = buildPhysRig(7501, 70, 170, 45);
    supported.p.transitionAirwayDevice('intubated');
    supported.p.setForcedApnea(true);
    supported.v.setMode(VentMode.VCV);
    supported.v.setTidalVolume = 500;
    supported.v.setRespiratoryRate = 12;
    supported.v.setPeep = 5;
    supported.v.setFiO2 = 1;
    supported.core.stepFor(120);

    const unsupported = buildPhysRig(7501, 70, 170, 45);
    unsupported.p.transitionAirwayDevice('intubated');
    unsupported.p.setForcedApnea(true);
    unsupported.v.o2FlowLPerMin = 0;
    unsupported.v.airFlowLPerMin = 5;
    unsupported.v.setMode(VentMode.Manual);
    const unsupportedStartSpO2 = unsupported.p.spO2;
    unsupported.core.stepFor(180);

    const disconnected = buildPhysRig(7501, 70, 170, 45);
    disconnected.p.transitionAirwayDevice('intubated');
    disconnected.p.transitionAirwayDevice('extubated');
    disconnected.p.setForcedApnea(true);
    disconnected.v.setMode(VentMode.VCV);
    disconnected.v.setTidalVolume = 500;
    disconnected.v.setRespiratoryRate = 12;
    disconnected.core.stepFor(30);

    expect(supported.p.forcedApneaContribution).toBe(0);
    expect(unsupported.p.forcedApneaContribution).toBe(0);
    expect(supported.p.capnogramPresent).toBe(true);
    expect(supported.p.spO2).toBeGreaterThanOrEqual(95);
    expect(supported.p.etCO2).toBeGreaterThan(25);
    expect(supported.p.etCO2).toBeLessThan(55);
    expect(unsupported.p.capnogramPresent).toBe(false);
    expect(unsupported.p.minuteVentilation).toBe(0);
    expect(unsupported.p.spO2).toBeLessThan(unsupportedStartSpO2);
    expect(unsupported.p.spO2).toBeLessThan(90);
    expect(disconnected.v.measuredMinuteVent).toBe(0);
    expect(disconnected.p.capnogramPresent).toBe(false);
  });

  it('returning effort remains visible over mandatory ventilation', () => {
    const rig = rocuroniumRigAtCount(0, 7601);
    rig.p.transitionAirwayDevice('intubated');
    rig.v.setMode(VentMode.VCV);
    rig.v.setTidalVolume = 500;
    rig.v.setRespiratoryRate = 12;
    rig.core.stepFor(10);
    const before = {
      effort: rig.p.spontaneousEffort,
      rr: rig.p.spontaneousRespiratoryRate,
      tv: rig.p.spontaneousTidalVolume,
    };

    rig.d.administerWeightBasedBolus('Sugammadex', 16);
    rig.core.stepFor(60);
    expect(rig.v.measuredMinuteVent).toBeGreaterThan(0);
    expect(rig.p.isMechanicallyVentilated).toBe(true);
    expect(rig.p.spontaneousEffort).toBeGreaterThan(before.effort);
    expect(rig.p.spontaneousRespiratoryRate).toBeGreaterThan(0);
    expect(rig.p.spontaneousTidalVolume).toBeGreaterThan(before.tv);
    expect(rig.p.spontaneousRespiratoryRate).toBe(before.rr);

    const runner = new SimRunner();
    expect(runner.snapshot()).toMatchObject({
      airwayDevice: 'mask', forcedApnea: false,
      forcedApneaContribution: 1, respiratoryMuscleCapability: 1,
      spontaneousEffort: 1, capnogramPresent: false,
    });
    expect(runner.setAirwayDevice('intubated').ok).toBe(true);
    runner.setForcedApnea(true);
    expect(runner.snapshot()).toMatchObject({
      airwayDevice: 'intubated', forcedApnea: true,
      forcedApneaContribution: 0, spontaneousEffort: 0,
    });
  });

  it('airway transitions validate every edge and expose no writable device field', () => {
    const { p } = buildPhysRig(7007, 70, 170, 45);

    expect(p.airwayDeviceState).toBe('mask');
    expect(p.transitionAirwayDevice('intubated')).toEqual({
      ok: true, changed: true, previous: 'mask', current: 'intubated', reason: '',
    });
    expect(p.transitionAirwayDevice('intubated')).toEqual({
      ok: true, changed: false, previous: 'intubated', current: 'intubated', reason: '',
    });
    expect(p.transitionAirwayDevice('mask').ok).toBe(false);
    expect(p.airwayDeviceState).toBe('intubated');
    expect(p.transitionAirwayDevice('extubated').ok).toBe(true);
    expect(p.transitionAirwayDevice('mask').ok).toBe(true);
    expect(p.transitionAirwayDevice('extubated').ok).toBe(false);
    expect(p.transitionAirwayDevice('intubated').ok).toBe(true);
    expect(p.transitionAirwayDevice('extubated').ok).toBe(true);
    expect(p.transitionAirwayDevice('intubated').ok).toBe(true);

    expect(() => { p.isIntubated = false; }).toThrow(TypeError);
    expect(() => { p.airwayDeviceState = 'mask'; }).toThrow(TypeError);
  });

  it('reversal, apnea, and airway runs are deterministic at mid-ramp samples', () => {
    const first = extendedDeterminismRun(7701);
    const second = extendedDeterminismRun(7701);
    expect(first.fingerprint).toBe(second.fingerprint);
    expect(first.sugMidRelief).toBeGreaterThan(0);
    expect(first.sugMidRelief).toBeLessThan(1);
    expect(first.neoMidRelief).toBeGreaterThan(0);
    expect(first.neoMidRelief).toBeLessThan(0.45);

    const resetRig = rocuroniumRigAtCount(0, 7703);
    resetRig.p.transitionAirwayDevice('intubated');
    resetRig.p.setForcedApnea(true);
    resetRig.d.administerWeightBasedBolus('Sugammadex', 16);
    resetRig.core.stepFor(15);
    resetRig.core.resetSim(7703);
    expect(resetRig.d.sugammadexRocRelief).toBe(0);
    expect(resetRig.p.forcedApneaActive).toBe(false);
    expect(resetRig.p.airwayDeviceState).toBe('mask');
  });
});
