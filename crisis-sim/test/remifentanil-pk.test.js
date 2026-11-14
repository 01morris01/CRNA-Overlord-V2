import { describe, expect, it } from 'vitest';
import { DrugSystem, PatientPhysiology, buildPhysRig } from '../sim/index.js';

function buildPatient({ weightKg = 70, heightCm = 170, ageYears = 40, sex = 'Male' } = {}) {
  const patient = new PatientPhysiology();
  patient.weightKg = weightKg;
  patient.heightCm = heightCm;
  patient.ageYears = ageYears;
  patient.sex = sex;
  patient.resetToBaseline();
  return patient;
}

function buildDrugSystem(patient) {
  const drugs = new DrugSystem();
  drugs.patient = patient;
  return drugs;
}

function advance(drugs, seconds, dt = 1) {
  const steps = Math.round(seconds / dt);
  for (let index = 0; index < steps; index++) drugs.tick(dt);
}

describe('remifentanil pharmacokinetics', () => {
  it('matches the published typical parameter values at age 40 and LBM 55 kg', () => {
    const patient = buildPatient({ weightKg: 70, heightCm: 170, ageYears: 40, sex: 'Male' });
    const drugs = buildDrugSystem(patient);
    const originalLbm = DrugSystem.remifentanilJamesLbmKg;
    DrugSystem.remifentanilJamesLbmKg = () => 55;

    try {
      drugs.computeRemifentanilModel();
    } finally {
      DrugSystem.remifentanilJamesLbmKg = originalLbm;
    }

    expect(drugs._remiV1).toBeCloseTo(5.1, 6);
    expect(drugs._remiV2).toBeCloseTo(9.82, 6);
    expect(drugs._remiV3).toBeCloseTo(5.42, 6);
    expect(drugs._remiCL1).toBeCloseTo(2.6, 6);
    expect(drugs._remiCL2).toBeCloseTo(2.05, 6);
    expect(drugs._remiCL3).toBeCloseTo(0.076, 6);
    expect(drugs._remiKe0Eeg).toBeCloseTo(0.595, 6);
  });

  it('uses the James lean body mass formula for male and female patients', () => {
    expect(DrugSystem.remifentanilJamesLbmKg(72, 171, 'Male')).toBeCloseTo(56.5, 1);

    const expectedFemale = 1.07 * 60 - 148 * ((60 / 165) ** 2);
    expect(DrugSystem.remifentanilJamesLbmKg(60, 165, 'Female')).toBeCloseTo(expectedFemale, 5);
  });

  it('closes mass balance after a 1 ug/kg bolus', () => {
    const patient = buildPatient({ weightKg: 70, heightCm: 170, ageYears: 40, sex: 'Male' });
    const drugs = buildDrugSystem(patient);
    const doseMicrograms = patient.weightKg;
    let eliminatedMicrograms = 0;

    drugs.administerWeightBasedBolus('Remifentanil', 0.001);
    drugs.computeRemifentanilModel();

    for (let elapsed = 0; elapsed < 30 * 60; elapsed += 1) {
      const k10PerSecond = drugs._remiCL1 / drugs._remiV1 / 60;
      eliminatedMicrograms += k10PerSecond * drugs._remiA1;
      drugs.tick(1);
    }

    const totalMicrograms = drugs._remiA1 + drugs._remiA2 + drugs._remiA3 + eliminatedMicrograms;
    expect(totalMicrograms).toBeCloseTo(doseMicrograms, 1);
    expect(Math.abs(totalMicrograms - doseMicrograms) / doseMicrograms).toBeLessThanOrEqual(0.005);
  });

  it('keeps the effect site below plasma and peaking later after a bolus', () => {
    const patient = buildPatient({ weightKg: 70, heightCm: 170, ageYears: 40, sex: 'Male' });
    const drugs = buildDrugSystem(patient);

    drugs.administerWeightBasedBolus('Remifentanil', 0.001);

    let cpPeak = drugs.remifentanilPlasma;
    let cpPeakTime = 0;
    let cePeak = drugs._remiCe;
    let cePeakTime = 0;

    for (let elapsed = 1; elapsed <= 20 * 60; elapsed += 1) {
      drugs.tick(1);
      const cp = drugs.remifentanilPlasma;
      const ce = drugs._remiCe;
      if (cp > cpPeak) {
        cpPeak = cp;
        cpPeakTime = elapsed;
      }
      if (ce > cePeak) {
        cePeak = ce;
        cePeakTime = elapsed;
      }
    }

    expect(cePeakTime).toBeGreaterThan(cpPeakTime);
    expect(cePeak).toBeLessThan(cpPeak);
  });

  it('halves plasma concentration within five minutes after a four-hour steady infusion', () => {
    const patient = buildPatient({ weightKg: 70, heightCm: 170, ageYears: 40, sex: 'Male' });
    const drugs = buildDrugSystem(patient);
    const infusionRateMgHour = 1.05;

    drugs.startInfusion('Remifentanil', infusionRateMgHour);
    advance(drugs, 4 * 60 * 60);
    drugs.stopInfusion('Remifentanil');

    const stopCp = drugs.remifentanilPlasma;
    let secondsToHalf = null;
    for (let elapsed = 1; elapsed <= 5 * 60; elapsed += 1) {
      drugs.tick(1);
      if (drugs.remifentanilPlasma <= stopCp / 2) {
        secondsToHalf = elapsed;
        break;
      }
    }

    expect(stopCp).toBeGreaterThan(0);
    expect(secondsToHalf).not.toBeNull();
    expect(secondsToHalf).toBeLessThan(5 * 60);
  });

  it('flags patients outside the fitted range while keeping all parameters positive', () => {
    const patient = buildPatient({ weightKg: 139, heightCm: 175, ageYears: 40, sex: 'Male' });
    const drugs = buildDrugSystem(patient);

    drugs.computeRemifentanilModel();
    drugs.tick(1);

    expect(drugs._remiOutsideFittedRange).toBe(true);
    expect(patient.remifentanilOutsideFittedRange).toBe(true);
    expect(drugs._remiV1).toBeGreaterThan(0);
    expect(drugs._remiV2).toBeGreaterThan(0);
    expect(drugs._remiV3).toBeGreaterThan(0);
    expect(drugs._remiCL1).toBeGreaterThan(0);
    expect(drugs._remiCL2).toBeGreaterThan(0);
    expect(drugs._remiCL3).toBeGreaterThan(0);
    expect(drugs._remiKe0Eeg).toBeGreaterThan(0);
  });

  it('does not change fentanyl behavior in the physiology rig', () => {
    const remiRig = buildPhysRig(9001, 70, 170, 45);
    const fentRig = buildPhysRig(9001, 70, 170, 45);

    remiRig.d.administerWeightBasedBolus('Remifentanil', 0.001);
    fentRig.d.administerWeightBasedBolus('Fentanyl', 0.002);

    remiRig.core.stepFor(300);
    fentRig.core.stepFor(300);

    expect(remiRig.p.fentanylCe).toBe(0);
    expect(fentRig.p.fentanylCe).toBeGreaterThan(0);
    expect(remiRig.p.remifentanilCe).toBeGreaterThan(0);
    expect(fentRig.p.remifentanilCe).toBe(0);
  });
});
