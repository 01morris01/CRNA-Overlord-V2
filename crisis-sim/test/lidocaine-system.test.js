import { describe, expect, it } from 'vitest';
import { LidocaineSystem } from '../sim/lidocaineSystem.js';

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
