import { describe, expect, it } from 'vitest';
import {
  buildPhysRig, DrugSystem, PatientPhysiology, rocuroniumBlockFromCe, VentMode,
} from '../sim/index.js';

const ROCURONIUM_INTUBATING_DOSE_MG_KG = Math.fround(0.6);

function buildRocuroniumRig(seed = 8101) {
  const rig = buildPhysRig(seed, 70, 170, 45);
  rig.d.administerWeightBasedBolus('Rocuronium', ROCURONIUM_INTUBATING_DOSE_MG_KG);
  return rig;
}

describe('rocuronium 0.6 mg/kg FDA clinical anchors', () => {
  it('produces at least 80% block at 60 seconds without changing central drive', () => {
    const rig = buildRocuroniumRig();
    const baselineCentralDrive = rig.p.centralDrive;

    rig.core.stepFor(60);

    expect(rig.p.effectiveNmbBlockade).toBeGreaterThanOrEqual(0.80);
    expect(rig.p.centralDrive).toBeCloseTo(baselineCentralDrive, 5);
  });

  it('reaches deep block, TOF 0, and minimal respiratory muscle capability by 180 seconds', () => {
    const rig = buildRocuroniumRig();

    rig.core.stepFor(180);

    expect(rig.p.effectiveNmbBlockade).toBeGreaterThanOrEqual(0.95);
    expect(rig.p.trainOfFourCount).toBe(0);
    expect(rig.p.respiratoryMuscleCapability).toBeLessThanOrEqual(0.10);
  });

  it('remains clinically meaningful at 15 minutes', () => {
    const rig = buildRocuroniumRig();

    rig.core.stepFor(15 * 60);

    expect(rig.p.effectiveNmbBlockade).toBeGreaterThanOrEqual(0.75);
  });

  it('recovers to 25% twitch within the labeled 15–85 minute clinical-duration range', () => {
    const rig = buildRocuroniumRig();
    let sawDeepBlock = false;
    let recoverySeconds = null;

    for (let elapsed = 1; elapsed <= 85 * 60; elapsed += 1) {
      rig.core.stepFor(1);
      if (rig.p.effectiveNmbBlockade >= 0.95) sawDeepBlock = true;
      if (sawDeepBlock && rig.p.effectiveNmbBlockade <= 0.75) {
        recoverySeconds = elapsed;
        break;
      }
    }

    expect(sawDeepBlock).toBe(true);
    expect(recoverySeconds).not.toBeNull();
    expect(recoverySeconds).toBeGreaterThanOrEqual(15 * 60);
    expect(recoverySeconds).toBeLessThanOrEqual(85 * 60);
  });
});

describe('single neuromuscular state', () => {
  it('uses the same float32 concentration mapping for patient block and neostigmine relief', () => {
    const effectSiteConcentration = Math.fround(0.08);
    const rawBlock = rocuroniumBlockFromCe(effectSiteConcentration);
    expect(rawBlock).toBe(Math.fround(rawBlock));
    expect(rawBlock).toBeGreaterThan(0);
    expect(rawBlock).toBeLessThan(1);
    expect(rocuroniumBlockFromCe(-1)).toBe(0);

    const patient = new PatientPhysiology();
    patient.resetToBaseline();
    patient.rocuroniumCe = effectSiteConcentration;
    patient.updateNeuromuscular(Math.fround(0.02));
    expect(patient.effectiveNmbBlockade).toBe(rawBlock);

    patient.trainOfFourCount = 2;
    const drugs = new DrugSystem();
    drugs.patient = patient;
    drugs.administerNeostigmine(4.9);
    drugs.updateReversalAgents(420);
    expect(drugs.neostigmineRocRelief).toBe(rawBlock);
  });

  it('keeps central drive independent while device support changes derived gas exchange', () => {
    const unsupported = buildRocuroniumRig(8201);
    unsupported.v.o2FlowLPerMin = 0;
    unsupported.v.airFlowLPerMin = 5;
    unsupported.v.setMode(VentMode.Manual);

    const supported = buildRocuroniumRig(8201);
    supported.p.transitionAirwayDevice('intubated');
    supported.v.setMode(VentMode.VCV);
    supported.v.setTidalVolume = 500;
    supported.v.setRespiratoryRate = 12;
    supported.v.setPeep = 5;
    supported.v.setFiO2 = 1;

    unsupported.core.stepFor(240);
    supported.core.stepFor(240);

    expect(supported.p.centralDrive).toBeCloseTo(unsupported.p.centralDrive, 5);
    expect(supported.p.effectiveNmbBlockade).toBeCloseTo(unsupported.p.effectiveNmbBlockade, 5);
    expect(supported.v.mechanicalMinuteVentilation).toBeGreaterThan(0);
    expect(unsupported.v.mechanicalMinuteVentilation).toBe(0);
    expect(supported.p.capnogramPresent).toBe(true);
    expect(unsupported.p.capnogramPresent).toBe(false);
    expect(supported.p.etCO2).toBeLessThan(unsupported.p.etCO2);
    expect(supported.p.spO2).toBeGreaterThan(unsupported.p.spO2);
  });
});
