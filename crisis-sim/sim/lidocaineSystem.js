/* Deterministic Lidocaine PK/PD, regional block, LAST, and lipid-rescue system. */
import { f, Min } from './float32.js';

const REGIONAL_ROUTES = new Set(['infiltration', 'peripheral', 'epidural']);

function positiveFinite(value, label) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive finite number`);
  }
  return f(value);
}
function cloneValue(value) {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, cloneValue(nested)]));
  }
  return value;
}

export class LidocaineSystem {
  constructor() {
    this.patient = null;
    this.rng = null;
    this.weightKg = 70;
    this.timeSec = 0;
    this.tickCount = 0;

    this.centralMg = 0;
    this.peripheralMg = 0;
    this.eliminatedMg = 0;
    this.lipidBoundMg = 0;
    this.cumulativeAdministeredMg = 0;
    this.infusionActive = false;
    this.infusionRateMgPerKgHour = 0;
    this.clearanceFactor = 1;

    this._doseHistory = [];
    this._regionalHistory = [];
    this._toxicityHistory = [];
    this._lipidHistory = [];
  }

  get doseHistory() { return cloneValue(this._doseHistory); }

  get regionalHistory() { return cloneValue(this._regionalHistory); }

  get toxicityHistory() { return cloneValue(this._toxicityHistory); }

  get lipidRescueHistory() { return cloneValue(this._lipidHistory); }

  _record(history, type, data = {}) {
    const stored = { tSec: this.timeSec, type, ...cloneValue(data) };
    history.push(stored);
    return cloneValue(stored);
  }

  giveIvBolus({ doseMgPerKg } = {}) {
    const dose = positiveFinite(doseMgPerKg, 'doseMgPerKg');
    const weight = positiveFinite(this.weightKg, 'weightKg');
    const totalDoseMg = f(dose * weight);
    this.centralMg = f(this.centralMg + totalDoseMg);
    this.cumulativeAdministeredMg = f(this.cumulativeAdministeredMg + totalDoseMg);
    return this._record(this._doseHistory, 'iv_bolus', {
      route: 'iv', doseMgPerKg: dose, totalDoseMg,
    });
  }

  startInfusion({ rateMgPerKgHour } = {}) {
    const rate = positiveFinite(rateMgPerKgHour, 'rateMgPerKgHour');
    const previousRate = this.infusionRateMgPerKgHour;
    if (this.infusionActive && previousRate === rate) {
      return { ok: true, changed: false, rateMgPerKgHour: rate };
    }
    const type = this.infusionActive ? 'infusion_rate_changed' : 'infusion_started';
    this.infusionActive = true;
    this.infusionRateMgPerKgHour = rate;
    const record = this._record(this._doseHistory, type, {
      route: 'iv', rateMgPerKgHour: rate, previousRateMgPerKgHour: previousRate,
    });
    return { ok: true, changed: true, ...record };
  }

  stopInfusion() {
    if (!this.infusionActive) {
      return { ok: true, changed: false, rateMgPerKgHour: 0 };
    }
    const previousRate = this.infusionRateMgPerKgHour;
    this.infusionActive = false;
    this.infusionRateMgPerKgHour = 0;
    const record = this._record(this._doseHistory, 'infusion_stopped', {
      route: 'iv', previousRateMgPerKgHour: previousRate,
    });
    return { ok: true, changed: true, ...record };
  }

  administerRegional({ route, concentrationPercent, volumeMl, epinephrine } = {}) {
    if (!REGIONAL_ROUTES.has(route)) {
      throw new RangeError(`unsupported regional Lidocaine route: ${route}`);
    }
    const concentration = positiveFinite(concentrationPercent, 'concentrationPercent');
    const volume = positiveFinite(volumeMl, 'volumeMl');
    const weight = positiveFinite(this.weightKg, 'weightKg');
    if (typeof epinephrine !== 'boolean') {
      throw new TypeError('epinephrine must be a boolean');
    }
    const totalDoseMg = f(concentration * 10 * volume);
    const doseMgKg = f(totalDoseMg / weight);
    const maximumRecommendedMg = epinephrine
      ? Min(f(7 * weight), 500)
      : Min(f(4.5 * weight), 300);
    const doseLimitStatus = totalDoseMg > maximumRecommendedMg ? 'exceeded' : 'within_limit';
    const warning = doseLimitStatus === 'exceeded'
      ? `Dose exceeds the ${maximumRecommendedMg} mg route recommendation`
      : null;
    this.cumulativeAdministeredMg = f(this.cumulativeAdministeredMg + totalDoseMg);
    const record = this._record(this._regionalHistory, 'regional_administered', {
      route,
      concentrationPercent: concentration,
      volumeMl: volume,
      epinephrine,
      totalDoseMg,
      doseMgKg,
      maximumRecommendedMg,
      doseLimitStatus,
      warning,
      remainingMg: totalDoseMg,
    });
    return { ok: true, ...record };
  }
}
