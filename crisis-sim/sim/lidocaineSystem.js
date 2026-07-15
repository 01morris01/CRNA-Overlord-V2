/* Deterministic Lidocaine PK/PD, regional block, LAST, and lipid-rescue system. */
import {
  f, Clamp, Exp, Max, Min, Pow,
} from './float32.js';

const REGIONAL_ROUTES = new Set(['infiltration', 'peripheral', 'epidural']);
const LN2 = f(Math.log(2));

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
    this.peakPlasmaTotalMcgMl = 0;
    this.surgicalStimulusRaw = 0;
    this.ventricularIrritabilityRaw = 0;
    this._lastToxicityStage = 'none';
    this._severeCnsExposureSec = 0;
    this._severeCardiacExposureSec = 0;
    this._cardiacCollapseLatched = false;
    this.lipidCumulativeMlKg = 0;
    this.lipidInfusionActive = false;
    this.lipidInfusionRateMlKgMin = 0;
    this._lipidSinkAvailableMg = 0;

    this._doseHistory = [];
    this._regionalHistory = [];
    this._toxicityHistory = [];
    this._lipidHistory = [];
    this._irritabilityHistory = [];
    this._lastDerivedRhythm = 'sinus';
  }

  get doseHistory() { return cloneValue(this._doseHistory); }

  get regionalHistory() { return cloneValue(this._regionalHistory); }

  get toxicityHistory() { return cloneValue(this._toxicityHistory); }

  get lipidRescueHistory() { return cloneValue(this._lipidHistory); }

  get irritabilityHistory() { return cloneValue(this._irritabilityHistory); }

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

  get regionalSensoryBlock() {
    return this._regionalHistory.reduce((maximum, record) => Max(maximum, record.sensoryBlock || 0), 0);
  }

  get regionalMotorBlock() {
    return this._regionalHistory.reduce((maximum, record) => Max(maximum, record.motorBlock || 0), 0);
  }

  get epiduralSympathectomyContribution() {
    return this._regionalHistory.reduce(
      (maximum, record) => Max(maximum, record.sympathectomyContribution || 0),
      0,
    );
  }

  get systemicAnalgesicContribution() {
    return Clamp(this.effectSiteMcgMl / 2, 0, 1);
  }

  get toxicityStage() {
    const exposure = this.plasmaTotalMcgMl;
    if (exposure > 10) return 'cardiac';
    if (exposure >= 8) return 'cns';
    if (exposure >= 5) return 'warning';
    return 'none';
  }

  get cnsToxicity() { return Clamp(f((this.plasmaTotalMcgMl - 8) / 2), 0, 1); }

  get cardiacToxicity() { return Clamp(f((this.plasmaTotalMcgMl - 10) / 2.5), 0, 1); }

  get antiarrhythmicContribution() {
    const therapeutic = Clamp(f(this.effectSiteMcgMl / 0.35), 0, 1);
    return f(therapeutic * f(1 - this.cardiacToxicity));
  }

  get ventricularIrritabilityEffective() {
    return Clamp(f(
      this.ventricularIrritabilityRaw * f(1 - this.antiarrhythmicContribution),
    ), 0, 1);
  }

  get rhythmIrritability() {
    return Max(
      this.ventricularIrritabilityEffective,
      f(0.8 * this.cardiacToxicity),
    );
  }

  get seizureDriveActive() {
    return this._severeCnsExposureSec >= 8 && this.cnsToxicity >= f(0.5);
  }

  get seizureActive() {
    if (!this.seizureDriveActive) return false;
    const sedated = this.patient
      && (this.patient.propofolCe > 1 || this.patient.midazolamCe > f(0.05));
    return !sedated;
  }

  get cardiacCollapseContribution() {
    return this._cardiacCollapseLatched ? Max(this.cardiacToxicity, f(0.3)) : 0;
  }

  get derivedRhythm() {
    if (this.patient?.explicitVentricularFibrillation) return 'ventricular_fibrillation';
    if (this.rhythmIrritability >= f(0.7)) return 'ventricular_tachycardia';
    if (this.rhythmIrritability >= f(0.25)) return 'ventricular_ectopy';
    return 'sinus';
  }

  get surgicalStimulusEffective() {
    const blockAttenuation = f(1 - f(this.regionalSensoryBlock * this.regionalCoverage));
    const systemicAttenuation = f(1 - f(0.25 * this.systemicAnalgesicContribution));
    return Clamp(f(this.surgicalStimulusRaw * blockAttenuation * systemicAttenuation), 0, 1);
  }

  get regionalCoverage() {
    let strongest = null;
    for (const record of this._regionalHistory) {
      if (!strongest || (record.sensoryBlock || 0) > (strongest.sensoryBlock || 0)) strongest = record;
    }
    if (!strongest || this.regionalSensoryBlock <= 0) return 0;
    return strongest.route === 'epidural' ? f(0.9) : 1;
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

  setSurgicalStimulus(value) {
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      throw new RangeError('surgical stimulus must be a finite number between 0 and 1');
    }
    this.surgicalStimulusRaw = f(value);
    return this.surgicalStimulusRaw;
  }

  setVentricularIrritability(value) {
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      throw new RangeError('ventricular irritability must be a finite number between 0 and 1');
    }
    this.ventricularIrritabilityRaw = f(value);
    this._record(this._irritabilityHistory, 'ventricular_irritability_set', {
      raw: this.ventricularIrritabilityRaw,
      effective: this.ventricularIrritabilityEffective,
      rhythmIrritability: this.rhythmIrritability,
      antiarrhythmicContribution: this.antiarrhythmicContribution,
      rhythm: this.derivedRhythm,
    });
    this._lastDerivedRhythm = this.derivedRhythm;
    return this.ventricularIrritabilityRaw;
  }

  injectToxicExposure({ targetPlasmaMcgMl } = {}) {
    const target = positiveFinite(targetPlasmaMcgMl, 'targetPlasmaMcgMl');
    const targetCentralMg = f(target * this.centralVolumeL);
    const addedMg = Max(0, f(targetCentralMg - this.centralMg));
    if (addedMg > 0) {
      this.centralMg = f(this.centralMg + addedMg);
      this.cumulativeAdministeredMg = f(this.cumulativeAdministeredMg + addedMg);
      this._observePeakExposure();
    }
    return this._record(this._doseHistory, 'administrative_toxic_exposure', {
      targetPlasmaMcgMl: target,
      addedMg,
    });
  }

  reset() {
    const patient = this.patient;
    const weightKg = this.weightKg;
    const clearanceFactor = this.clearanceFactor;
    Object.assign(this, new LidocaineSystem());
    this.patient = patient;
    this.weightKg = weightKg;
    this.clearanceFactor = clearanceFactor;
  }

  giveIvBolus({ doseMgPerKg } = {}) {
    const dose = positiveFinite(doseMgPerKg, 'doseMgPerKg');
    const weight = positiveFinite(this.weightKg, 'weightKg');
    const totalDoseMg = f(dose * weight);
    this.centralMg = f(this.centralMg + totalDoseMg);
    this.cumulativeAdministeredMg = f(this.cumulativeAdministeredMg + totalDoseMg);
    this._observePeakExposure();
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

  giveLipidBolus() {
    const doseMlKg = f(1.5);
    const remainingMlKg = Max(0, f(12 - this.lipidCumulativeMlKg));
    const deliveredMlKg = Min(doseMlKg, remainingMlKg);
    if (deliveredMlKg <= 0) {
      return {
        ok: true, changed: false, doseMlKg, deliveredMlKg: 0, reason: '12 mL/kg lipid cap reached',
      };
    }
    this.lipidCumulativeMlKg = f(this.lipidCumulativeMlKg + deliveredMlKg);
    this._lipidSinkAvailableMg = f(
      this._lipidSinkAvailableMg + f(deliveredMlKg * this.weightKg * f(0.8)),
    );
    const record = this._record(this._lipidHistory, 'lipid_bolus', {
      concentrationPercent: 20,
      doseMlKg,
      deliveredMlKg,
      cumulativeMlKg: this.lipidCumulativeMlKg,
    });
    return { ok: true, changed: true, ...record };
  }

  startLipidInfusion() {
    if (this.lipidCumulativeMlKg >= 12) {
      return {
        ok: true, changed: false, rateMlKgMin: 0, reason: '12 mL/kg lipid cap reached',
      };
    }
    if (!this.lipidInfusionActive) {
      this.lipidInfusionActive = true;
      this.lipidInfusionRateMlKgMin = f(0.25);
      const record = this._record(this._lipidHistory, 'lipid_infusion_started', {
        concentrationPercent: 20,
        rateMlKgMin: this.lipidInfusionRateMlKgMin,
      });
      return { ok: true, changed: true, ...record };
    }
    if (this.lipidInfusionRateMlKgMin < f(0.5)) {
      const previousRateMlKgMin = this.lipidInfusionRateMlKgMin;
      this.lipidInfusionRateMlKgMin = f(0.5);
      const record = this._record(this._lipidHistory, 'lipid_infusion_rate_doubled', {
        concentrationPercent: 20,
        previousRateMlKgMin,
        rateMlKgMin: this.lipidInfusionRateMlKgMin,
      });
      return { ok: true, changed: true, ...record };
    }
    return {
      ok: true, changed: false, rateMlKgMin: this.lipidInfusionRateMlKgMin,
    };
  }

  stopLipidInfusion() {
    if (!this.lipidInfusionActive) {
      return { ok: true, changed: false, rateMlKgMin: 0 };
    }
    const previousRateMlKgMin = this.lipidInfusionRateMlKgMin;
    this.lipidInfusionActive = false;
    this.lipidInfusionRateMlKgMin = 0;
    const record = this._record(this._lipidHistory, 'lipid_infusion_stopped', {
      previousRateMlKgMin,
      cumulativeMlKg: this.lipidCumulativeMlKg,
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
    const epiduralFastFraction = f(0.38 / f(0.38 + 0.58));
    const common = {
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
      absorbedMg: 0,
      elapsedSec: 0,
      cmaxMcgMl: 0,
      timeToCmaxMin: null,
      sensoryBlock: 0,
      motorBlock: 0,
      sympathectomyContribution: 0,
      peakSensoryBlock: 0,
      peakMotorBlock: 0,
      peakSympathectomy: 0,
      blockEstablished: false,
      blockDurationSec: null,
      completedAtSec: null,
      absorptionLagMin: route === 'peripheral' ? 60 : 0,
    };
    if (route === 'epidural') {
      common.fastRemainingMg = f(totalDoseMg * epiduralFastFraction);
      common.slowRemainingMg = f(totalDoseMg - common.fastRemainingMg);
      common.fastAbsorbedMg = 0;
      common.slowAbsorbedMg = 0;
    }
    const record = this._record(this._regionalHistory, 'regional_administered', common);
    return { ok: true, ...record };
  }

  _absorbFromDepot(remainingMg, ratePerMinute, dtMinutes) {
    if (remainingMg <= 0) return 0;
    const alpha = f(1 - Exp(f(-ratePerMinute * dtMinutes)));
    return Min(remainingMg, f(remainingMg * alpha));
  }

  _advanceRegional(dtMinutes, dtSeconds) {
    let totalAbsorbedMg = 0;
    for (const record of this._regionalHistory) {
      const epinephrineMultiplier = record.epinephrine ? f(0.5) : 1;
      let absorbedMg = 0;
      if (record.route === 'epidural') {
        const fastRate = f((LN2 / f(9.3)) * epinephrineMultiplier);
        const slowRate = f((LN2 / 82) * epinephrineMultiplier);
        const fastAbsorbed = this._absorbFromDepot(record.fastRemainingMg, fastRate, dtMinutes);
        const slowAbsorbed = this._absorbFromDepot(record.slowRemainingMg, slowRate, dtMinutes);
        record.fastRemainingMg = Max(0, f(record.fastRemainingMg - fastAbsorbed));
        record.slowRemainingMg = Max(0, f(record.slowRemainingMg - slowAbsorbed));
        record.fastAbsorbedMg = f(record.fastAbsorbedMg + fastAbsorbed);
        record.slowAbsorbedMg = f(record.slowAbsorbedMg + slowAbsorbed);
        absorbedMg = f(fastAbsorbed + slowAbsorbed);
        record.remainingMg = f(record.fastRemainingMg + record.slowRemainingMg);
      } else {
        const halfLifeMinutes = record.route === 'peripheral' ? 90 : 120;
        const rate = f((LN2 / halfLifeMinutes) * epinephrineMultiplier);
        const absorptionAvailable = f(record.elapsedSec / 60) >= record.absorptionLagMin;
        absorbedMg = absorptionAvailable
          ? this._absorbFromDepot(record.remainingMg, rate, dtMinutes)
          : 0;
        record.remainingMg = Max(0, f(record.remainingMg - absorbedMg));
      }
      record.absorbedMg = f(record.absorbedMg + absorbedMg);
      record.elapsedSec = f(record.elapsedSec + dtSeconds);
      totalAbsorbedMg = f(totalAbsorbedMg + absorbedMg);

      const remainingFraction = record.totalDoseMg > 0
        ? Clamp(record.remainingMg / record.totalDoseMg, 0, 1)
        : 0;
      const doseFactor = Clamp(record.doseMgKg / 3, 0, 1);
      const targetSensory = f(doseFactor * Clamp(f(remainingFraction * 1.5), 0, 1));
      const onsetMinutes = record.route === 'infiltration' ? 5 : (record.route === 'peripheral' ? 15 : 10);
      const blockAlpha = f(1 - Exp(f(-dtMinutes / onsetMinutes)));
      record.sensoryBlock = f(
        record.sensoryBlock + f(targetSensory - record.sensoryBlock) * blockAlpha,
      );
      const motorCeiling = record.route === 'infiltration' ? f(0.15)
        : (record.route === 'peripheral' ? f(0.9) : f(0.75));
      const targetMotor = f(targetSensory * motorCeiling);
      record.motorBlock = f(record.motorBlock + f(targetMotor - record.motorBlock) * blockAlpha);
      const targetSympathectomy = record.route === 'epidural' ? f(targetSensory * f(0.85)) : 0;
      record.sympathectomyContribution = f(
        record.sympathectomyContribution
        + f(targetSympathectomy - record.sympathectomyContribution) * blockAlpha,
      );
      record.peakSensoryBlock = Max(record.peakSensoryBlock, record.sensoryBlock);
      record.peakMotorBlock = Max(record.peakMotorBlock, record.motorBlock);
      record.peakSympathectomy = Max(record.peakSympathectomy, record.sympathectomyContribution);
      if (record.sensoryBlock >= f(0.5)) record.blockEstablished = true;
      if (record.blockEstablished && record.blockDurationSec === null && record.sensoryBlock < f(0.5)) {
        record.blockDurationSec = record.elapsedSec;
      }
      if (record.completedAtSec === null && record.remainingMg < f(0.01) && record.sensoryBlock < f(0.01)) {
        record.completedAtSec = record.elapsedSec;
      }
    }
    return totalAbsorbedMg;
  }

  _observeRegionalExposure() {
    for (const record of this._regionalHistory) {
      if (this.plasmaTotalMcgMl > record.cmaxMcgMl) {
        record.cmaxMcgMl = this.plasmaTotalMcgMl;
        record.timeToCmaxMin = f(record.elapsedSec / 60);
      }
    }
  }

  _observePeakExposure() {
    this.peakPlasmaTotalMcgMl = Max(this.peakPlasmaTotalMcgMl, this.plasmaTotalMcgMl);
  }

  _publishPatientContributions() {
    if (!this.patient) return;
    this.patient.regionalSensoryBlock = this.regionalSensoryBlock;
    this.patient.regionalMotorBlock = this.regionalMotorBlock;
    this.patient.epiduralSympathectomyContribution = this.epiduralSympathectomyContribution;
    this.patient.surgicalStimulusRaw = this.surgicalStimulusRaw;
    this.patient.surgicalStimulusEffective = this.surgicalStimulusEffective;
    this.patient.lidocaineSystemicAnalgesicContribution = this.systemicAnalgesicContribution;
    this.patient.lidocaineAntiarrhythmicContribution = this.antiarrhythmicContribution;
    this.patient.ventricularIrritabilityRaw = this.ventricularIrritabilityRaw;
    this.patient.ventricularIrritabilityEffective = this.ventricularIrritabilityEffective;
    this.patient.lidocaineCnsToxicity = this.cnsToxicity;
    this.patient.lidocaineCardiacToxicity = this.cardiacToxicity;
    this.patient.lidocaineSeizureDriveActive = this.seizureDriveActive;
    this.patient.lidocaineSeizureActive = this.seizureActive;
    this.patient.lidocaineCardiacCollapseContribution = this.cardiacCollapseContribution;
    this.patient.lidocaineToxicityStage = this.toxicityStage;
    this.patient.derivedRhythm = this.derivedRhythm;
  }

  _advanceToxicity(dtSeconds) {
    const cnsSevere = this.cnsToxicity >= f(0.5);
    const cardiacSevere = this.cardiacToxicity >= f(0.5);
    this._severeCnsExposureSec = cnsSevere
      ? f(this._severeCnsExposureSec + dtSeconds)
      : Max(0, f(this._severeCnsExposureSec - f(dtSeconds * 2)));
    this._severeCardiacExposureSec = cardiacSevere
      ? f(this._severeCardiacExposureSec + dtSeconds)
      : Max(0, f(this._severeCardiacExposureSec - f(dtSeconds * 2)));

    const stage = this.toxicityStage;
    if (this._severeCardiacExposureSec >= 12) this._cardiacCollapseLatched = true;
    if (stage !== 'cardiac') this._cardiacCollapseLatched = false;
    if (stage !== this._lastToxicityStage) {
      this._record(this._toxicityHistory, 'toxicity_transition', {
        fromStage: this._lastToxicityStage,
        stage,
        plasmaTotalMcgMl: this.plasmaTotalMcgMl,
        plasmaFreeMcgMl: this.plasmaFreeMcgMl,
      });
      this._lastToxicityStage = stage;
    }

    const rhythm = this.derivedRhythm;
    if (rhythm !== this._lastDerivedRhythm) {
      this._record(this._irritabilityHistory, 'rhythm_transition', {
        fromRhythm: this._lastDerivedRhythm,
        rhythm,
        raw: this.ventricularIrritabilityRaw,
        effective: this.ventricularIrritabilityEffective,
        rhythmIrritability: this.rhythmIrritability,
        antiarrhythmicContribution: this.antiarrhythmicContribution,
      });
      this._lastDerivedRhythm = rhythm;
    }
  }

  _advanceLipid(dtMinutes, dtSeconds) {
    if (this.lipidInfusionActive) {
      const remainingMlKg = Max(0, f(12 - this.lipidCumulativeMlKg));
      const requestedMlKg = f(this.lipidInfusionRateMlKgMin * dtMinutes);
      const deliveredMlKg = Min(requestedMlKg, remainingMlKg);
      this.lipidCumulativeMlKg = f(this.lipidCumulativeMlKg + deliveredMlKg);
      this._lipidSinkAvailableMg = f(
        this._lipidSinkAvailableMg + f(deliveredMlKg * this.weightKg * f(0.8)),
      );
      if (this.lipidCumulativeMlKg >= f(12 - 0.00001)) {
        this.lipidCumulativeMlKg = 12;
        const previousRateMlKgMin = this.lipidInfusionRateMlKgMin;
        this.lipidInfusionActive = false;
        this.lipidInfusionRateMlKgMin = 0;
        this._record(this._lipidHistory, 'lipid_infusion_capped', {
          previousRateMlKgMin,
          cumulativeMlKg: this.lipidCumulativeMlKg,
        });
      }
    }

    if (this.centralMg > 0 && this._lipidSinkAvailableMg > 0) {
      const freeFraction = this.plasmaTotalMcgMl > 0
        ? Clamp(this.plasmaFreeMcgMl / this.plasmaTotalMcgMl, 0, 1)
        : 0;
      const freeCentralMg = f(this.centralMg * freeFraction);
      const captureAlpha = f(1 - Exp(f(-LN2 * f(dtSeconds / 15))));
      const capturedMg = Min(
        this._lipidSinkAvailableMg,
        Min(this.centralMg, f(freeCentralMg * captureAlpha)),
      );
      this.centralMg = Max(0, f(this.centralMg - capturedMg));
      this.lipidBoundMg = f(this.lipidBoundMg + capturedMg);
      this._lipidSinkAvailableMg = Max(0, f(this._lipidSinkAvailableMg - capturedMg));
    }

    if (this.lipidBoundMg > 0) {
      const eliminationAlpha = f(1 - Exp(f(-LN2 * f(dtMinutes / 240))));
      const eliminatedBoundMg = Min(this.lipidBoundMg, f(this.lipidBoundMg * eliminationAlpha));
      this.lipidBoundMg = Max(0, f(this.lipidBoundMg - eliminatedBoundMg));
      this.eliminatedMg = f(this.eliminatedMg + eliminatedBoundMg);
    }
  }

  tick(dt) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    if (this.patient) this.weightKg = this.patient.weightKg;
    const dtSeconds = f(dt);
    const dtMinutes = f(dtSeconds / 60);
    const centralBefore = this.centralMg;
    const peripheralBefore = this.peripheralMg;

    const infusionMg = f(this.infusionInputMgPerMin * dtMinutes);
    const regionalAbsorbedMg = this._advanceRegional(dtMinutes, dtSeconds);
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

    this.centralMg = Max(0, f(
      centralBefore + infusionMg + regionalAbsorbedMg - eliminated - exchange,
    ));
    this.peripheralMg = Max(0, f(peripheralBefore + exchange));
    this.eliminatedMg = f(this.eliminatedMg + eliminated);
    this._advanceLipid(dtMinutes, dtSeconds);
    const conservedNonEliminated = this.centralMg + this.peripheralMg
      + this.lipidBoundMg + this.regionalDepotMg;
    this.eliminatedMg = Max(0, f(this.cumulativeAdministeredMg - conservedNonEliminated));
    this._observePeakExposure();

    const ke0PerMin = f(Math.log(2) / 2);
    const effectAlpha = f(1 - Exp(f(-ke0PerMin * dtMinutes)));
    this.effectSiteMcgMl = f(
      this.effectSiteMcgMl + f(this.plasmaFreeMcgMl - this.effectSiteMcgMl) * effectAlpha,
    );
    this._observeRegionalExposure();
    this._advanceToxicity(dtSeconds);
    this._publishPatientContributions();

    this.tickCount += 1;
    this.timeSec = f(this.tickCount * dtSeconds);
  }
}
