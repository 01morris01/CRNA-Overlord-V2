import { describe, expect, it } from 'vitest';
import { AirwayProcedureSystem, PatientPhysiology, buildPhysRig } from '../sim/index.js';

function procedureRig() {
  const patient = new PatientPhysiology();
  patient.resetToBaseline();
  const airway = new AirwayProcedureSystem();
  airway.patient = patient;
  airway.reset();
  return { patient, airway };
}

describe('airway procedure state machine', () => {
  it('runs one timed mask-ventilation episode and returns copied history', () => {
    const { airway } = procedureRig();

    const result = airway.deliverMaskVentilation({
      durationSeconds: 2,
      tidalVolumeMl: 500,
      respiratoryRate: 12,
      cricoidPressure: true,
    });

    expect(result).toMatchObject({
      ok: true,
      startTimeSec: 0,
      plannedDurationSec: 2,
      airwayDevice: 'mask',
      tidalVolumeMl: 500,
      respiratoryRate: 12,
      minuteVentilation: 6,
      cricoidPressure: true,
    });
    expect(airway.ppvActive).toBe(true);

    airway.tick(1);
    expect(airway.ppvActive).toBe(true);
    airway.tick(1);

    expect(airway.ppvActive).toBe(false);
    expect(airway.ppvHistory).toEqual([
      expect.objectContaining({
        episodeId: 1,
        startTimeSec: 0,
        endTimeSec: 2,
        plannedDurationSec: 2,
        deliveredDurationSec: 2,
        airwayDevice: 'mask',
        tidalVolumeMl: 500,
        respiratoryRate: 12,
        minuteVentilation: 6,
        cricoidPressure: true,
        completionReason: 'completed',
      }),
    ]);

    const copy = airway.ppvHistory;
    copy[0].completionReason = 'mutated';
    expect(airway.ppvHistory[0].completionReason).toBe('completed');
  });

  it('validates PPV inputs and requires the mask device', () => {
    const { patient, airway } = procedureRig();

    expect(airway.deliverMaskVentilation({ durationSeconds: 0 })).toMatchObject({
      ok: false, reason: 'durationSeconds must be finite and positive',
    });
    expect(airway.deliverMaskVentilation({ tidalVolumeMl: Number.NaN })).toMatchObject({
      ok: false, reason: 'tidalVolumeMl must be finite and positive',
    });
    expect(airway.deliverMaskVentilation({ respiratoryRate: -1 })).toMatchObject({
      ok: false, reason: 'respiratoryRate must be finite and positive',
    });

    patient.transitionAirwayDevice('intubated');
    expect(airway.deliverMaskVentilation()).toMatchObject({
      ok: false, reason: 'mask ventilation requires airway device mask',
    });
    expect(airway.ppvHistory).toEqual([]);
  });

  it('records cricoid independently and idempotently', () => {
    const { airway } = procedureRig();

    expect(airway.applyCricoidPressure()).toMatchObject({ ok: true, changed: true, appliedAtSec: 0 });
    expect(airway.applyCricoidPressure()).toMatchObject({ ok: true, changed: false });
    airway.tick(3);
    expect(airway.releaseCricoidPressure()).toMatchObject({ ok: true, changed: true, releasedAtSec: 3 });
    expect(airway.releaseCricoidPressure()).toMatchObject({ ok: true, changed: false });

    expect(airway.cricoidPressureActive).toBe(false);
    expect(airway.cricoidPressureHistory).toEqual([
      expect.objectContaining({ appliedAtSec: 0, releasedAtSec: 3, durationSec: 3 }),
    ]);
    expect(airway.eventsSince(0).map((event) => event.type)).toEqual([
      'cricoid_pressure_applied',
      'cricoid_pressure_released',
    ]);
  });

  it('configures deterministic attempt outcomes and interrupts PPV', () => {
    const { patient, airway } = procedureRig();
    expect(airway.configureIntubation({
      failedIntubationAttempts: [3, 1, 1, 0, -2, 2.5],
      attemptDurationSeconds: 2,
    })).toEqual({ failedIntubationAttempts: [1, 3], attemptDurationSeconds: 2 });

    airway.deliverMaskVentilation({ durationSeconds: 10 });
    expect(airway.attemptIntubation()).toMatchObject({
      ok: true, attemptNumber: 1, startTimeSec: 0, plannedDurationSec: 2, airwayDevice: 'mask',
    });
    expect(airway.ppvHistory[0].completionReason).toBe('interrupted_by_intubation');
    expect(patient.airwayDeviceState).toBe('mask');
    expect(airway.intubationInProgress).toBe(true);

    airway.tick(2);
    expect(airway.intubationInProgress).toBe(false);
    expect(airway.lastIntubationOutcome).toBe('failed');
    expect(patient.airwayDeviceState).toBe('mask');

    expect(airway.attemptIntubation()).toMatchObject({ ok: true, attemptNumber: 2 });
    airway.tick(2);
    expect(airway.lastIntubationOutcome).toBe('succeeded');
    expect(patient.airwayDeviceState).toBe('intubated');
    expect(airway.intubationAttempts.map((attempt) => attempt.outcome)).toEqual(['failed', 'succeeded']);
  });

  it('tracks attempt SpO2 nadir and first below-90 crossing', () => {
    const { patient, airway } = procedureRig();
    airway.configureIntubation({ failedIntubationAttempts: [1], attemptDurationSeconds: 3 });
    airway.attemptIntubation();

    patient.spO2 = 94;
    airway.tick(1);
    patient.spO2 = 89;
    airway.tick(1);
    patient.spO2 = 87;
    airway.tick(1);

    expect(airway.intubationAttempts[0]).toMatchObject({
      outcome: 'failed',
      spo2Nadir: 87,
      desaturatedBelow90: true,
      timeToSpo2_90Sec: 2,
    });
  });

  it('clears all action state and copied events on reset', () => {
    const { airway } = procedureRig();
    airway.applyCricoidPressure();
    airway.deliverMaskVentilation({ durationSeconds: 3 });
    airway.tick(1);
    airway.reset();

    expect(airway.timeSec).toBe(0);
    expect(airway.ppvActive).toBe(false);
    expect(airway.cricoidPressureActive).toBe(false);
    expect(airway.ppvHistory).toEqual([]);
    expect(airway.cricoidPressureHistory).toEqual([]);
    expect(airway.intubationAttempts).toEqual([]);
    expect(airway.eventsSince(0)).toEqual([]);
  });

  it('wires procedural apnea without duplicating NMB and exposes derived ETO2', () => {
    const { p, a, core } = buildPhysRig(8101, 70, 170, 45);

    expect(a.patient).toBe(p);
    expect(core.airwayProcedure).toBe(a);
    expect(p.proceduralApneaActive).toBe(false);
    expect(p.proceduralApneaContribution).toBe(1);
    expect(p.endTidalO2Percent).toBe(Math.fround(p.alveolarO2Fraction * 100));

    a.configureIntubation({ failedIntubationAttempts: [1], attemptDurationSeconds: 2 });
    a.attemptIntubation();
    expect(p.proceduralApneaActive).toBe(true);
    expect(p.proceduralApneaContribution).toBe(0);
    expect(p.centralDrive).toBe(0);
    expect(Object.hasOwn(p, 'procedureNmbBlockade')).toBe(false);

    core.stepFor(2);
    expect(p.proceduralApneaActive).toBe(false);
    expect(a.lastIntubationOutcome).toBe('failed');
  });

  it('clears procedure state through core reset without a second paralysis state', () => {
    const { p, a, core } = buildPhysRig(8102, 70, 170, 45);
    a.applyCricoidPressure();
    a.deliverMaskVentilation({ durationSeconds: 10 });
    p.effectiveNmbBlockade = 0.7;

    core.resetSim(8102);

    expect(a.ppvHistory).toEqual([]);
    expect(a.cricoidPressureHistory).toEqual([]);
    expect(p.proceduralApneaActive).toBe(false);
    expect(p.effectiveNmbBlockade).toBe(0);
    expect(Object.hasOwn(p, 'procedureNmbBlockade')).toBe(false);
  });
});
