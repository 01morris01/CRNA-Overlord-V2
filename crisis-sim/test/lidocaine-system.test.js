import { describe, expect, it } from 'vitest';
import { LidocaineSystem } from '../sim/lidocaineSystem.js';

const STEP = Math.fround(0.02);

function advance(lidocaine, seconds) {
  const steps = Math.round(seconds / STEP);
  for (let index = 0; index < steps; index++) lidocaine.tick(STEP);
  return lidocaine;
}

function advanceAt(lidocaine, seconds, stepSeconds = 0.5) {
  const steps = Math.round(seconds / stepSeconds);
  for (let index = 0; index < steps; index++) lidocaine.tick(stepSeconds);
  return lidocaine;
}

function runRegionalCase(options, durationMinutes = 360) {
  const l = new LidocaineSystem();
  l.weightKg = 70;
  l.administerRegional(options);
  advanceAt(l, durationMinutes * 60);
  return { l, record: l.regionalHistory[0] };
}

describe('LidocaineSystem public actions', () => {
  it('accepts one IV infusion and updates its rate instead of duplicating it', () => {
    const l = new LidocaineSystem();
    l.weightKg = 70;

    expect(l.startInfusion({ rateMgPerKgHour: 1.5 })).toMatchObject({
      ok: true, changed: true, rateMgPerKgHour: 1.5,
    });
    expect(l.startInfusion({ rateMgPerKgHour: 2 })).toMatchObject({
      ok: true, changed: true, rateMgPerKgHour: 2,
    });

    expect(l.infusionActive).toBe(true);
    expect(l.infusionRateMgPerKgHour).toBe(2);
    expect(l.doseHistory.map((entry) => entry.type)).toEqual([
      'infusion_started', 'infusion_rate_changed',
    ]);
  });

  it('derives regional total milligrams and classifies route limits', () => {
    const l = new LidocaineSystem();
    l.weightKg = 70;

    const accepted = l.administerRegional({
      route: 'peripheral', concentrationPercent: 1.5, volumeMl: 20, epinephrine: false,
    });

    expect(accepted).toMatchObject({
      ok: true,
      totalDoseMg: 300,
      doseLimitStatus: 'within_limit',
      maximumRecommendedMg: 300,
    });
    expect(accepted.doseMgKg).toBeCloseTo(300 / 70, 5);
    const history = l.regionalHistory;
    history[0].remainingMg = 0;
    expect(l.regionalHistory[0].remainingMg).toBe(300);
  });

  it('accepts deliberate above-limit dosing but marks the exposure', () => {
    const l = new LidocaineSystem();
    l.weightKg = 70;

    expect(l.administerRegional({
      route: 'epidural', concentrationPercent: 2, volumeMl: 20, epinephrine: false,
    })).toMatchObject({
      ok: true,
      totalDoseMg: 400,
      doseLimitStatus: 'exceeded',
      warning: expect.stringContaining('300'),
    });
  });

  it.each([
    { doseMgPerKg: -1 },
    { doseMgPerKg: Number.NaN },
  ])('rejects invalid IV bolus input $doseMgPerKg', (options) => {
    const l = new LidocaineSystem();
    expect(() => l.giveIvBolus(options)).toThrow(RangeError);
  });

  it.each(['bier', 'intravenous_regional', 'unknown'])('rejects unsupported regional route %s', (route) => {
    const l = new LidocaineSystem();
    expect(() => l.administerRegional({
      route, concentrationPercent: 1, volumeMl: 10, epinephrine: false,
    })).toThrow(RangeError);
  });
});

describe('LidocaineSystem systemic PK', () => {
  it('follows the reference two-compartment bolus anchors and terminal half-life', () => {
    const l = new LidocaineSystem();
    l.weightKg = 70;
    l.giveIvBolus({ doseMgPerKg: 1.5 });

    expect(l.plasmaTotalMcgMl).toBeCloseTo(105 / 43, 5);
    const initial = l.plasmaTotalMcgMl;
    advance(l, 90 * 60);
    const at90Minutes = l.plasmaTotalMcgMl;
    advance(l, 120 * 60);
    const at210Minutes = l.plasmaTotalMcgMl;
    const terminalHalfLifeMinutes = 120 * Math.log(2) / Math.log(at90Minutes / at210Minutes);

    expect(at90Minutes).toBeLessThan(initial);
    expect(terminalHalfLifeMinutes).toBeGreaterThanOrEqual(90);
    expect(terminalHalfLifeMinutes).toBeLessThanOrEqual(120);
  });

  it('closes systemic mass balance within float32 tolerance', () => {
    const l = new LidocaineSystem();
    l.weightKg = 70;
    l.giveIvBolus({ doseMgPerKg: 1.5 });
    l.startInfusion({ rateMgPerKgHour: 1.5 });

    advance(l, 60 * 60);

    expect(l.infusionInputMgPerMin).toBeCloseTo(1.75, 6);
    expect(l.massBalanceErrorMg).toBeLessThan(0.02);
    expect(l.eliminatedMg).toBeGreaterThan(0);
    expect(l.peripheralMg).toBeGreaterThan(0);
  });

  it('reports concentration-dependent binding and a lagging effect site', () => {
    const l = new LidocaineSystem();

    expect(l.bindingForTotal(1).boundFraction).toBeCloseTo(0.8, 5);
    expect(l.bindingForTotal(4).boundFraction).toBeCloseTo(0.6, 5);
    expect(l.bindingForTotal(7).boundFraction).toBeCloseTo(0.4, 5);

    l.giveIvBolus({ doseMgPerKg: 1.5 });
    expect(l.effectSiteMcgMl).toBe(0);
    advance(l, 30);
    expect(l.effectSiteMcgMl).toBeGreaterThan(0);
    expect(l.effectSiteMcgMl).toBeLessThan(l.plasmaFreeMcgMl);
  });

  it('keeps clearance factor independently queryable and causal', () => {
    const reference = new LidocaineSystem();
    const reduced = new LidocaineSystem();
    expect(reference.clearanceFactor).toBe(1);
    reduced.setClearanceFactor(0.5);
    expect(reduced.clearanceFactor).toBe(0.5);
    reference.giveIvBolus({ doseMgPerKg: 1.5 });
    reduced.giveIvBolus({ doseMgPerKg: 1.5 });

    advance(reference, 60 * 60);
    advance(reduced, 60 * 60);

    expect(reduced.eliminatedMg).toBeLessThan(reference.eliminatedMg);
    expect(reduced.cumulativeAdministeredMg).toBe(reference.cumulativeAdministeredMg);
  });
});

describe('LidocaineSystem regional depots and local block', () => {
  const matchedDose = { concentrationPercent: 1, volumeMl: 20, epinephrine: false };

  it('shows fast and slow epidural absorption phases', () => {
    const l = new LidocaineSystem();
    l.administerRegional({ route: 'epidural', ...matchedDose });
    advanceAt(l, 30 * 60);
    const record = l.regionalHistory[0];

    expect(record.fastRemainingMg).toBeLessThan(record.slowRemainingMg);
    expect(record.fastAbsorbedMg).toBeGreaterThan(record.slowAbsorbedMg);
    expect(record.remainingMg).toBeCloseTo(
      record.fastRemainingMg + record.slowRemainingMg,
      3,
    );
  });

  it('calibrates peripheral absorption to the 2.3 plus or minus 0.5 hour Tmax band', () => {
    const { record } = runRegionalCase({ route: 'peripheral', ...matchedDose }, 300);

    expect(record.timeToCmaxMin).toBeGreaterThanOrEqual(108);
    expect(record.timeToCmaxMin).toBeLessThanOrEqual(168);
  });

  it('orders route-average exposure and keeps infiltration motor block lower', () => {
    const epidural = runRegionalCase({ route: 'epidural', ...matchedDose }).record;
    const peripheral = runRegionalCase({ route: 'peripheral', ...matchedDose }).record;
    const infiltration = runRegionalCase({ route: 'infiltration', ...matchedDose }).record;

    expect(epidural.cmaxMcgMl).toBeGreaterThan(peripheral.cmaxMcgMl);
    expect(peripheral.cmaxMcgMl).toBeGreaterThan(infiltration.cmaxMcgMl);
    expect(peripheral.peakMotorBlock).toBeGreaterThan(infiltration.peakMotorBlock);
    expect(epidural.peakSympathectomy).toBeGreaterThan(0);
  });

  it('epinephrine delays and lowers Cmax while prolonging sensory block', () => {
    const without = runRegionalCase({ route: 'infiltration', ...matchedDose }, 720).record;
    const withEpinephrine = runRegionalCase({
      route: 'infiltration', concentrationPercent: 1, volumeMl: 20, epinephrine: true,
    }, 720).record;

    expect(withEpinephrine.cmaxMcgMl).toBeLessThan(without.cmaxMcgMl);
    expect(withEpinephrine.timeToCmaxMin).toBeGreaterThan(without.timeToCmaxMin);
    expect(withEpinephrine.blockDurationSec).toBeGreaterThan(without.blockDurationSec);
  });

  it('publishes aggregate sensory, motor, and epidural sympathetic contributions', () => {
    const l = new LidocaineSystem();
    l.administerRegional({ route: 'epidural', concentrationPercent: 1.5, volumeMl: 20, epinephrine: false });
    advanceAt(l, 30 * 60);

    expect(l.regionalSensoryBlock).toBeGreaterThan(0.5);
    expect(l.regionalMotorBlock).toBeGreaterThan(0.25);
    expect(l.epiduralSympathectomyContribution).toBeGreaterThan(0);
    expect(l.massBalanceErrorMg).toBeLessThan(0.02);
  });
});
