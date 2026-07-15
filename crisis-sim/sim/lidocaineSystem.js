/* Deterministic Lidocaine PK/PD, regional block, LAST, and lipid-rescue system. */
import {
  f, Clamp, Exp, Max, Min, Pow,
} from './float32.js';

const REGIONAL_ROUTES = new Set(['infiltration', 'peripheral', 'epidural']);

function positiveFinite(value, label) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive finite number`);
  }
  return f(value);
}

function nonnegativeFinite(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a nonnegative finite number`);
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
    this.effectSiteMcgMl = 0;

    this._doseHistory = [];
    this._regionalHistory = [];
    this._toxicityHistory = [];
    this._lipidHistory = [];
  }

  get doseHistory() { return cloneValue(this._doseHistory); }

  get regionalHistory() { return cloneValue(this._regionalHistory); }

  get toxicityHistory() { return cloneValue(this._toxicityHistory); }

  get lipidRescueHistory() { return cloneValue(this._lipidHistory); }

  get weightScale() { return f(positiveFinite(this.weightKg, 'weightKg') / 70); }

  get centralVolumeL() { return f(43 * this.weightScale); }

  get peripheralVolumeL() { return f(56 * this.weightScale); }

  get clearanceLMin() {
    return f(0.95 * Pow(this.weightScale, 0.75) * this.clearanceFactor);
  }

  get intercompartmentalClearanceLMin() {
    return f(1.0 * Pow(this.weightScale, 0.75));
  }

  get infusionInputMgPerMin() {
    if (!this.infusionActive) return 0;
    return f(this.infusionRateMgPerKgHour * positiveFinite(this.weightKg, 'weightKg') / 60);
  }

  get plasmaTotalMcgMl() { return f(this.centralMg / this.centralVolumeL); }

  get boundFraction() { return this.bindingForTotal(this.plasmaTotalMcgMl).boundFraction; }

  get plasmaFreeMcgMl() { return this.bindingForTotal(this.plasmaTotalMcgMl).freeMcgMl; }

  get regionalDepotMg() {
    return f(this._regionalHistory.reduce((sum, record) => sum + Max(0, record.remainingMg || 0), 0));
  }

  get massBalanceErrorMg() {
    const accounted = this.centralMg + this.peripheralMg + this.eliminatedMg
      + this.lipidBoundMg + this.regionalDepotMg;
    return Math.abs(this.cumulativeAdministeredMg - accounted);
  }

  _record(history, type, data = {}) {
    const stored = { tSec: this.timeSec, type, ...cloneValue(data) };
    history.push(stored);
    return cloneValue(stored);
  }

  bindingForTotal(totalMcgMl) {
    const total = nonnegativeFinite(totalMcgMl, 'totalMcgMl');
    let boundFraction;
    if (total <= 1) boundFraction = 0.8;
    else if (total <= 4) boundFraction = 0.8 - (total - 1) * (0.2 / 3);
    else if (total <= 7) boundFraction = 0.6 - (total - 4) * (0.2 / 3);
    else boundFraction = 0.4;
    boundFraction = f(Clamp(boundFraction, 0.4, 0.8));
    return {
      boundFraction,
      freeMcgMl: f(total * f(1 - boundFraction)),
    };
  }

  setClearanceFactor(value) {
    this.clearanceFactor = nonnegativeFinite(value, 'clearanceFactor');
    return this.clearanceFactor;
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

  tick(dt) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    const dtSeconds = f(dt);
    const dtMinutes = f(dtSeconds / 60);
    const centralBefore = this.centralMg;
    const peripheralBefore = this.peripheralMg;

    const infusionMg = f(this.infusionInputMgPerMin * dtMinutes);
    this.cumulativeAdministeredMg = f(this.cumulativeAdministeredMg + infusionMg);

    const centralConcentration = f(centralBefore / this.centralVolumeL);
    const peripheralConcentration = f(peripheralBefore / this.peripheralVolumeL);
    let eliminated = f(this.clearanceLMin * centralConcentration * dtMinutes);
    let exchange = f(
      this.intercompartmentalClearanceLMin
      * f(centralConcentration - peripheralConcentration)
      * dtMinutes,
    );

    if (exchange >= 0) {
      const totalCentralOut = f(eliminated + exchange);
      if (totalCentralOut > centralBefore && totalCentralOut > 0) {
        const scale = f(centralBefore / totalCentralOut);
        eliminated = f(eliminated * scale);
        exchange = f(exchange * scale);
      }
    } else {
      exchange = f(-Min(-exchange, peripheralBefore));
      eliminated = Min(eliminated, centralBefore);
    }

    this.centralMg = Max(0, f(centralBefore + infusionMg - eliminated - exchange));
    this.peripheralMg = Max(0, f(peripheralBefore + exchange));
    this.eliminatedMg = f(this.eliminatedMg + eliminated);
    const conservedNonEliminated = this.centralMg + this.peripheralMg
      + this.lipidBoundMg + this.regionalDepotMg;
    this.eliminatedMg = Max(0, f(this.cumulativeAdministeredMg - conservedNonEliminated));

    const ke0PerMin = f(Math.log(2) / 2);
    const effectAlpha = f(1 - Exp(f(-ke0PerMin * dtMinutes)));
    this.effectSiteMcgMl = f(
      this.effectSiteMcgMl + f(this.plasmaFreeMcgMl - this.effectSiteMcgMl) * effectAlpha,
    );

    this.tickCount += 1;
    this.timeSec = f(this.tickCount * dtSeconds);
  }
}
