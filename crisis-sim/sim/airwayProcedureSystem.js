/* Deterministic, RNG-free timed airway actions. This subsystem owns action
   state and history only; ventilator and patient systems derive physiology. */
import { f } from './float32.js';

function positiveFinite(value, name) {
  if (!Number.isFinite(value) || value <= 0) return `${name} must be finite and positive`;
  return '';
}

function copyRecord(record) {
  return record ? { ...record } : null;
}

export class AirwayProcedureSystem {
  constructor() {
    this.patient = null;
    this._listeners = new Set();
    this.reset();
  }

  reset() {
    if (this.patient?.setProceduralApnea) this.patient.setProceduralApnea(false);
    this.timeSec = 0;
    this._tickCount = 0;
    this._fixedStep = null;
    this.failedIntubationAttempts = [];
    this.attemptDurationSeconds = f(30);
    this._nextPpvEpisodeId = 1;
    this._ppvCurrent = null;
    this._ppvHistory = [];
    this.cricoidPressureActive = false;
    this._cricoidCurrent = null;
    this._cricoidHistory = [];
    this._attemptCurrent = null;
    this._attempts = [];
    this.intubationAttemptCount = 0;
    this.lastIntubationOutcome = 'none';
    this._events = [];
  }

  configureIntubation({ failedIntubationAttempts = [], attemptDurationSeconds = 30 } = {}) {
    const durationError = positiveFinite(attemptDurationSeconds, 'attemptDurationSeconds');
    if (durationError) throw new RangeError(durationError);
    const failures = [...new Set(failedIntubationAttempts
      .filter((attempt) => Number.isInteger(attempt) && attempt > 0))]
      .sort((left, right) => left - right);
    this.failedIntubationAttempts = failures;
    this.attemptDurationSeconds = f(attemptDurationSeconds);
    return {
      failedIntubationAttempts: [...failures],
      attemptDurationSeconds: this.attemptDurationSeconds,
    };
  }

  get ppvActive() { return this._ppvCurrent !== null; }

  get ppvEpisodeCount() { return this._ppvHistory.length; }

  get ppvCurrent() { return copyRecord(this._ppvCurrent); }

  get ppvHistory() { return this._ppvHistory.map(copyRecord); }

  get intubationInProgress() { return this._attemptCurrent !== null; }

  get intubationCurrent() {
    return this._attemptCurrent ? copyRecord(this._attemptCurrent.record) : null;
  }

  get intubationAttempts() { return this._attempts.map(copyRecord); }

  get cricoidPressureHistory() { return this._cricoidHistory.map(copyRecord); }

  get eventCount() { return this._events.length; }

  eventsSince(index) {
    return this._events.slice(Math.max(0, index)).map((event) => ({
      ...event,
      meta: { ...event.meta },
    }));
  }

  addEventListener(listener) {
    if (typeof listener !== 'function') throw new TypeError('listener must be a function');
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  deliverMaskVentilation({
    durationSeconds = 30,
    tidalVolumeMl = 500,
    respiratoryRate = 12,
    cricoidPressure = false,
  } = {}) {
    const durationError = positiveFinite(durationSeconds, 'durationSeconds');
    if (durationError) return { ok: false, reason: durationError };
    const tidalVolumeError = positiveFinite(tidalVolumeMl, 'tidalVolumeMl');
    if (tidalVolumeError) return { ok: false, reason: tidalVolumeError };
    const respiratoryRateError = positiveFinite(respiratoryRate, 'respiratoryRate');
    if (respiratoryRateError) return { ok: false, reason: respiratoryRateError };
    if (this.patient?.airwayDeviceState !== 'mask') {
      return { ok: false, reason: 'mask ventilation requires airway device mask' };
    }
    if (this.intubationInProgress) {
      return { ok: false, reason: 'mask ventilation unavailable during intubation attempt' };
    }
    if (this.ppvActive) return { ok: false, reason: 'mask ventilation already active' };

    const episodeId = this._nextPpvEpisodeId++;
    const plannedDurationSec = f(durationSeconds);
    const tv = f(tidalVolumeMl);
    const rr = f(respiratoryRate);
    const minuteVentilation = f(tv * rr / 1000);
    const record = {
      episodeId,
      startTimeSec: this.timeSec,
      endTimeSec: null,
      plannedDurationSec,
      deliveredDurationSec: 0,
      airwayDevice: 'mask',
      tidalVolumeMl: tv,
      respiratoryRate: rr,
      minuteVentilation,
      cricoidPressure: cricoidPressure === true,
      completionReason: 'active',
    };
    this._ppvCurrent = record;
    this._ppvHistory.push(record);
    this._emit('mask_ppv_started', {
      episodeId,
      plannedDurationSec,
      airwayDevice: record.airwayDevice,
      tidalVolumeMl: tv,
      respiratoryRate: rr,
      minuteVentilation,
      cricoidPressure: record.cricoidPressure,
    });
    return {
      ok: true,
      reason: '',
      episodeId,
      startTimeSec: record.startTimeSec,
      plannedDurationSec,
      airwayDevice: record.airwayDevice,
      tidalVolumeMl: tv,
      respiratoryRate: rr,
      minuteVentilation,
      cricoidPressure: record.cricoidPressure,
    };
  }

  stopMaskVentilation(reason = 'stopped') {
    if (!this.ppvActive) return { ok: true, changed: false, reason: 'mask ventilation not active' };
    const record = this._completePpv(reason);
    return { ok: true, changed: true, reason: '', episode: copyRecord(record) };
  }

  applyCricoidPressure() {
    if (this.cricoidPressureActive) {
      return { ok: true, changed: false, appliedAtSec: this._cricoidCurrent.appliedAtSec };
    }
    const record = {
      appliedAtSec: this.timeSec,
      releasedAtSec: null,
      durationSec: null,
    };
    this.cricoidPressureActive = true;
    this._cricoidCurrent = record;
    this._cricoidHistory.push(record);
    this._emit('cricoid_pressure_applied', { appliedAtSec: record.appliedAtSec });
    return { ok: true, changed: true, appliedAtSec: record.appliedAtSec };
  }

  releaseCricoidPressure() {
    if (!this.cricoidPressureActive) {
      return { ok: true, changed: false, releasedAtSec: this.timeSec };
    }
    const record = this._cricoidCurrent;
    record.releasedAtSec = this.timeSec;
    record.durationSec = f(record.releasedAtSec - record.appliedAtSec);
    this.cricoidPressureActive = false;
    this._cricoidCurrent = null;
    this._emit('cricoid_pressure_released', {
      appliedAtSec: record.appliedAtSec,
      releasedAtSec: record.releasedAtSec,
      durationSec: record.durationSec,
    });
    return { ok: true, changed: true, releasedAtSec: record.releasedAtSec };
  }

  attemptIntubation() {
    if (this.patient?.airwayDeviceState !== 'mask') {
      return { ok: false, reason: 'intubation attempt requires airway device mask' };
    }
    if (this.intubationInProgress) {
      return { ok: false, reason: 'intubation attempt already active' };
    }
    if (this.ppvActive) this._completePpv('interrupted_by_intubation');

    const attemptNumber = ++this.intubationAttemptCount;
    const startingSpO2 = f(this.patient?.spO2 ?? 100);
    const record = {
      attemptNumber,
      startTimeSec: this.timeSec,
      endTimeSec: null,
      plannedDurationSec: this.attemptDurationSeconds,
      durationSec: 0,
      outcome: 'in_progress',
      airwayBefore: 'mask',
      airwayAfter: 'mask',
      spo2Nadir: startingSpO2,
      desaturatedBelow90: startingSpO2 < 90,
      timeToSpo2_90Sec: startingSpO2 < 90 ? 0 : null,
    };
    this._attempts.push(record);
    this._attemptCurrent = {
      record,
      willFail: this.failedIntubationAttempts.includes(attemptNumber),
    };
    if (this.patient?.setProceduralApnea) this.patient.setProceduralApnea(true);
    this._emit('intubation_attempt_started', {
      attemptNumber,
      plannedDurationSec: record.plannedDurationSec,
      airwayDevice: record.airwayBefore,
    });
    return {
      ok: true,
      reason: '',
      attemptNumber,
      startTimeSec: record.startTimeSec,
      plannedDurationSec: record.plannedDurationSec,
      airwayDevice: record.airwayBefore,
    };
  }

  prepareTick() {
    if (this._ppvCurrent && this.patient?.airwayDeviceState !== 'mask') {
      this._completePpv('airway_changed');
    }
  }

  tick(dt) {
    if (!(dt > 0)) return;
    const step = f(dt);
    if (this._fixedStep === null) this._fixedStep = step;
    else if (step !== this._fixedStep) {
      throw new RangeError('AirwayProcedureSystem requires a fixed timestep');
    }
    this._tickCount += 1;
    const nextTime = f(this._tickCount * this._fixedStep);
    if (this._attemptCurrent) this._sampleAttemptSpO2(nextTime);
    this.timeSec = nextTime;

    if (this._ppvCurrent
      && f(this.timeSec - this._ppvCurrent.startTimeSec) >= this._ppvCurrent.plannedDurationSec) {
      this._completePpv('completed');
    }
    if (this._attemptCurrent
      && f(this.timeSec - this._attemptCurrent.record.startTimeSec)
        >= this._attemptCurrent.record.plannedDurationSec) {
      this._completeIntubationAttempt();
    }
  }

  _sampleAttemptSpO2(sampleTimeSec) {
    const record = this._attemptCurrent.record;
    const currentSpO2 = f(this.patient?.spO2 ?? record.spo2Nadir);
    if (currentSpO2 < record.spo2Nadir) record.spo2Nadir = currentSpO2;
    if (!record.desaturatedBelow90 && currentSpO2 < 90) {
      record.desaturatedBelow90 = true;
      record.timeToSpo2_90Sec = f(sampleTimeSec - record.startTimeSec);
    }
  }

  _completePpv(completionReason) {
    const record = this._ppvCurrent;
    if (!record) return null;
    record.endTimeSec = this.timeSec;
    record.deliveredDurationSec = f(record.endTimeSec - record.startTimeSec);
    record.completionReason = completionReason;
    this._ppvCurrent = null;
    this._emit('mask_ppv_completed', {
      episodeId: record.episodeId,
      plannedDurationSec: record.plannedDurationSec,
      deliveredDurationSec: record.deliveredDurationSec,
      airwayDevice: record.airwayDevice,
      completionReason,
    });
    return record;
  }

  _completeIntubationAttempt() {
    const current = this._attemptCurrent;
    const record = current.record;
    record.endTimeSec = this.timeSec;
    record.durationSec = f(record.endTimeSec - record.startTimeSec);
    if (this.patient?.setProceduralApnea) this.patient.setProceduralApnea(false);

    if (current.willFail) {
      record.outcome = 'failed';
      record.airwayAfter = this.patient?.airwayDeviceState ?? 'mask';
      this.lastIntubationOutcome = 'failed';
      this._attemptCurrent = null;
      this._emit('intubation_attempt_failed', { ...record });
      return;
    }

    const transition = this.patient?.transitionAirwayDevice?.('intubated');
    record.outcome = transition?.ok === false ? 'failed' : 'succeeded';
    record.airwayAfter = this.patient?.airwayDeviceState ?? record.airwayBefore;
    this.lastIntubationOutcome = record.outcome;
    this._attemptCurrent = null;
    this._emit(
      record.outcome === 'succeeded' ? 'intubation_attempt_succeeded' : 'intubation_attempt_failed',
      { ...record },
    );
  }

  _emit(type, meta) {
    const event = {
      sequence: this._events.length + 1,
      tSec: this.timeSec,
      type,
      meta: { ...meta },
    };
    this._events.push(event);
    for (const listener of this._listeners) listener({ ...event, meta: { ...event.meta } });
  }
}
