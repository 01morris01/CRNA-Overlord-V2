import { describe, expect, it } from 'vitest';
import { buildPhysRig, LidocaineSystem } from '../sim/index.js';

function runStimulus({ block }) {
  const rig = buildPhysRig(8128);
  if (block) {
    rig.l.administerRegional({
      route: 'peripheral', concentrationPercent: 1.5, volumeMl: 20, epinephrine: false,
    });
    rig.core.stepFor(30 * 60);
  }
  rig.l.setSurgicalStimulus(1);
  let peakHr = rig.p.heartRate;
  let peakMap = rig.p.meanArterialPressure;
  for (let second = 0; second < 90; second++) {
    rig.core.stepFor(1);
    peakHr = Math.max(peakHr, rig.p.heartRate);
    peakMap = Math.max(peakMap, rig.p.meanArterialPressure);
  }
  return { ...rig, peakHr, peakMap };
}

describe('Lidocaine additive physiology evidence', () => {
  it('adds one RNG-free l rig key without replacing existing keys', () => {
    const rig = buildPhysRig(12345);

    expect(rig.l).toBeInstanceOf(LidocaineSystem);
    expect(rig.l.rng).toBeNull();
    expect(rig).toMatchObject({
      p: expect.any(Object), d: expect.any(Object), v: expect.any(Object),
      a: expect.any(Object), core: expect.any(Object),
    });
  });

  it('regional sensory block attenuates the same imposed stimulus', () => {
    const control = runStimulus({ block: false });
    const blocked = runStimulus({ block: true });

    expect(control.peakHr).toBeGreaterThan(blocked.peakHr + 10);
    expect(control.peakMap).toBeGreaterThan(blocked.peakMap + 8);
    expect(control.p.surgicalStimulusEffective).toBeGreaterThan(0.95);
    expect(blocked.p.surgicalStimulusEffective).toBeLessThan(0.35);
  });

  it('derives graded epidural sympathectomy without using the high-spinal driver', () => {
    const rig = buildPhysRig(4321);
    const baselineSvr = rig.p.svrFactor;
    rig.l.administerRegional({
      route: 'epidural', concentrationPercent: 1.5, volumeMl: 20, epinephrine: false,
    });
    rig.core.stepFor(30 * 60);

    expect(rig.p.epiduralSympathectomyContribution).toBeGreaterThan(0);
    expect(rig.p.epiduralSympathectomyContribution).toBeLessThanOrEqual(1);
    expect(rig.p.svrFactor).toBe(baselineSvr);
    expect(rig.p.meanArterialPressure).toBeLessThan(90);
  });

  it('suppresses imposed ventricular irritability at therapeutic exposure', () => {
    const untreated = buildPhysRig(2468);
    const treated = buildPhysRig(2468);
    untreated.l.setVentricularIrritability(0.8);
    treated.l.setVentricularIrritability(0.8);
    treated.l.giveIvBolus({ doseMgPerKg: 1.5 });
    untreated.core.stepFor(120);
    treated.core.stepFor(120);

    expect(treated.l.ventricularIrritabilityEffective)
      .toBeLessThan(untreated.l.ventricularIrritabilityEffective);
    expect(treated.p.derivedRhythm).toBe('sinus');
    expect(untreated.p.derivedRhythm).not.toBe('sinus');
  });

  it('never converts an explicit ventricular-fibrillation state', () => {
    const rig = buildPhysRig(1357);
    rig.p.explicitVentricularFibrillation = true;
    rig.l.giveIvBolus({ doseMgPerKg: 1.5 });
    rig.core.stepFor(180);

    expect(rig.p.derivedRhythm).toBe('ventricular_fibrillation');
  });

  it('recovers free exposure and pressure through lipid sequestration', () => {
    const noRescue = buildPhysRig(9753);
    const rescued = buildPhysRig(9753);
    noRescue.l.injectToxicExposure({ targetPlasmaMcgMl: 11.5 });
    rescued.l.injectToxicExposure({ targetPlasmaMcgMl: 11.5 });
    noRescue.core.stepFor(15);
    rescued.core.stepFor(15);
    rescued.l.giveLipidBolus();
    rescued.l.startLipidInfusion();
    noRescue.core.stepFor(120);
    rescued.core.stepFor(120);

    expect(rescued.l.plasmaFreeMcgMl).toBeLessThan(noRescue.l.plasmaFreeMcgMl);
    expect(rescued.p.meanArterialPressure).toBeGreaterThan(
      noRescue.p.meanArterialPressure + 10,
    );
  });
});
