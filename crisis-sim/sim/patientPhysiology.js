/* ═══════════════════════════════════════════════════════════════════
   patientPhysiology.js — faithful port of
   OperatingRoom.Simulation.PatientPhysiology under the Mono float model:
   float sub-expressions stay in double precision; float32 rounding (`f()`)
   is applied only at C# float STORES / method returns and at Mathf-arg
   boundaries. Every non-dyadic float LITERAL is frounded (C# literals are
   float32). Truth boundary preserved: drivers in, derived vitals out.
   ═══════════════════════════════════════════════════════════════════ */
import { f, Clamp, Clamp01, Max, Lerp, Exp, Pow, RoundToInt } from './float32.js';
import { SimRandom } from './simRandom.js';
import { rocuroniumBlockFromCe } from './neuromuscularModel.js';

export const Status = {
  Awake: 0, Sedated: 1, LightAnesthesia: 2, SurgicalAnesthesia: 3,
  DeepAnesthesia: 4, Critical: 5,
};

export const AirwayDevice = Object.freeze({
  Mask: 'mask', Intubated: 'intubated', Extubated: 'extubated',
});

export class PatientPhysiology {
  #airwayDeviceState = AirwayDevice.Mask;
  #forcedApnea = false;
  #proceduralApnea = false;

  constructor() {
    this.weightKg = 70; this.heightCm = 170; this.ageYears = 45; this.sex = 'Male';

    this.baselineHR = 72; this.baselineSystolic = 120; this.baselineDiastolic = 80;
    this.baselineSpO2 = 99; this.baselineRR = 14; this.baselineTemp = f(36.6); this.baselineEtCO2 = 38;

    this.heartRate = 0; this.systolicBP = 0; this.diastolicBP = 0; this.meanArterialPressure = 0;
    this.spO2 = 0; this.respiratoryRate = 0; this.temperature = 0; this.etCO2 = 0; this.fiO2 = 0;
    this.tidalVolume = 0; this.minuteVentilation = 0; this.peakAirwayPressure = 0;
    this.plateauPressure = 0; this.peep = 0;

    this.bisIndex = 97; this.macMultiple = 0; this.endTidalAgent = 0; this.currentAgent = 'None';

    this.propofolCe = 0; this.fentanylCe = 0; this.rocuroniumCe = 0; this.midazolamCe = 0; this.succinylcholineCe = 0;
    this.sugammadexRocRelief = 0; this.neostigmineRocRelief = 0;
    this.neostigmineCe = 0;
    this.epinephrineCe = 0; this.phenylephrineCe = 0; this.ephedrineCe = 0;
    this.naloxoneCe = 0; this.dantroleneCe = 0; this.atropineCe = 0; this.albuterolCe = 0;

    this.respiratoryDriveFactor = 1; this.bloodVolumeFraction = 1;
    this.trainOfFourRatio = 1.0; this.trainOfFourCount = 4;
    this.effectiveNmbBlockade = 0;

    this.isBreathingSpontaneously = true;
    this.isMechanicallyVentilated = false; this.status = Status.Awake;

    this.frcLiters = 2.5; this.alveolarO2Fraction = f(0.21); this.alveolarO2StoresMl = 0;
    this.vo2MlMin = 250; this.paO2 = 95;
    this.vco2MlMin = 200; this.paCO2 = 40;
    this.airwayPatency = 1; this.airwayResistanceFactor = 1; this.shuntFraction = 0;
    this.svrFactor = 1; this.heatLoadC = 0; this.hrComplicationOffset = 0;
    this.regionalSensoryBlock = 0; this.regionalMotorBlock = 0;
    this.epiduralSympathectomyContribution = 0;
    this.surgicalStimulusRaw = 0; this.surgicalStimulusEffective = 0;
    this.lidocaineSystemicAnalgesicContribution = 0;

    this.drivenExternally = false; this.rng = null; this._fallbackRng = null;
    this._ecgPhase = 0; this._breathPhase = 0;
    this._hrModifier = 0; this._bpModifier = 1; this._rrModifier = 1;
  }

  get _rnd() {
    if (this.rng) return this.rng;
    if (!this._fallbackRng) this._fallbackRng = new SimRandom(0);
    return this._fallbackRng;
  }

  resetToBaseline() {
    this.heartRate = this.baselineHR;
    this.systolicBP = this.baselineSystolic;
    this.diastolicBP = this.baselineDiastolic;
    this.spO2 = this.baselineSpO2;
    this.respiratoryRate = this.baselineRR;
    this.temperature = this.baselineTemp;
    this.etCO2 = this.baselineEtCO2;
    this.paCO2 = f(this.baselineEtCO2 + 3);
    this.fiO2 = f(0.21);
    this.bisIndex = 97;
    this.macMultiple = 0;
    this.trainOfFourRatio = 1;
    this.trainOfFourCount = 4;
    this.status = Status.Awake;
    this.isBreathingSpontaneously = true;
    this.isMechanicallyVentilated = false;
    this.#airwayDeviceState = AirwayDevice.Mask;
    this.#forcedApnea = false;
    this.#proceduralApnea = false;

    this._hrModifier = 0; this._bpModifier = 1; this._rrModifier = 1;

    this.propofolCe = 0; this.fentanylCe = 0; this.rocuroniumCe = 0; this.midazolamCe = 0; this.succinylcholineCe = 0;
    this.sugammadexRocRelief = 0; this.neostigmineRocRelief = 0;
    this.neostigmineCe = 0;
    this.effectiveNmbBlockade = 0;

    this.airwayPatency = 1; this.airwayResistanceFactor = 1; this.shuntFraction = 0;
    this.svrFactor = 1; this.heatLoadC = 0; this.hrComplicationOffset = 0;
    this.regionalSensoryBlock = 0; this.regionalMotorBlock = 0;
    this.epiduralSympathectomyContribution = 0;
    this.surgicalStimulusRaw = 0; this.surgicalStimulusEffective = 0;
    this.lidocaineSystemicAnalgesicContribution = 0;
    this.vco2MlMin = this.deriveRestingVco2();

    this.epinephrineCe = 0; this.phenylephrineCe = 0; this.ephedrineCe = 0;
    this.naloxoneCe = 0; this.dantroleneCe = 0; this.atropineCe = 0; this.albuterolCe = 0;
    this.respiratoryDriveFactor = 1; this.bloodVolumeFraction = 1;

    this.deriveOxygenReserveParams();
    this.alveolarO2Fraction = f(0.21);
    this.alveolarO2StoresMl = f(this.alveolarO2Fraction * this.frcLiters * 1000);
    this.paO2 = f(this.alveolarPO2() * (1 - this.shuntFraction) + 40 * this.shuntFraction);
  }

  deriveOxygenReserveParams() {
    const predicted = Max(0.15, this.heightCm * f(0.03) - 2.5);
    const hc = this.heightCm / 100;
    const bmi = f(this.weightKg / Max(0.25, hc * hc));
    const obesityFactor = Clamp(1 - (bmi - 25) * f(0.022), 0.45, 1);
    this.frcLiters = Max(0.12, predicted * obesityFactor);
    this.vo2MlMin = this.deriveVo2();
  }

  get airwayDeviceState() { return this.#airwayDeviceState; }

  get isIntubated() { return this.#airwayDeviceState === AirwayDevice.Intubated; }

  get respiratoryMuscleCapability() {
    return Clamp01(this.trainOfFourRatio / f(0.9));
  }

  get effectiveRocuroniumBlockade() {
    const raw = rocuroniumBlockFromCe(this.rocuroniumCe);
    const afterSugammadex = f(raw * f(1 - this.sugammadexRocRelief));
    return Clamp01(f(afterSugammadex - this.neostigmineRocRelief));
  }

  get effectiveSuccinylcholineBlockade() {
    return Clamp01(this.succinylcholineCe / 1.0);
  }

  get dominantNmbSource() {
    const roc = this.effectiveRocuroniumBlockade;
    const sux = this.effectiveSuccinylcholineBlockade;
    if (Max(roc, sux) <= f(0.01)) return 'none';
    return roc >= sux ? 'rocuronium' : 'succinylcholine';
  }

  setForcedApnea(active) { this.#forcedApnea = active === true; }

  get forcedApneaActive() { return this.#forcedApnea; }

  get forcedApneaContribution() { return this.#forcedApnea ? 0 : 1; }

  setProceduralApnea(active) { this.#proceduralApnea = active === true; }

  get proceduralApneaActive() { return this.#proceduralApnea; }

  get proceduralApneaContribution() { return this.#proceduralApnea ? 0 : 1; }

  get drugDepressionContribution() { return Clamp01(this._rrModifier); }

  get complicationDriveContribution() { return Clamp01(this.respiratoryDriveFactor); }

  get centralDrive() {
    const forcedDrug = f(this.forcedApneaContribution * this.drugDepressionContribution);
    const establishedDrive = f(forcedDrug * this.complicationDriveContribution);
    return Clamp01(f(establishedDrive * this.proceduralApneaContribution));
  }

  get effectiveSpontaneousVentilationFraction() {
    return Clamp01(f(this.centralDrive * this.respiratoryMuscleCapability));
  }

  get spontaneousRespiratoryRate() { return f(this.baselineRR * this.centralDrive); }

  get spontaneousTidalVolume() {
    return f(f(7 * this.weightKg) * this.respiratoryMuscleCapability);
  }

  get spontaneousMinuteVentilation() {
    return f(this.spontaneousRespiratoryRate * this.spontaneousTidalVolume / 1000);
  }

  get spontaneousEffort() { return this.effectiveSpontaneousVentilationFraction; }

  get capnogramPresent() { return this.minuteVentilation > f(0.3); }

  get endTidalO2Percent() { return f(Clamp01(this.alveolarO2Fraction) * 100); }

  get dominantInadequateVentilationSource() {
    if (this.forcedApneaContribution === 0) return 'forced_apnea';
    if (this.proceduralApneaContribution === 0) return 'intubation_attempt';
    const muscle = this.respiratoryMuscleCapability;
    const drug = this.drugDepressionContribution;
    const complication = this.complicationDriveContribution;
    if (muscle < 1 && muscle <= drug && muscle <= complication) return 'nmb';
    if (drug < 1 && drug <= complication) return 'drug_depression';
    if (complication < 1) return 'complication_drive';
    return 'none';
  }

  get respiratoryAttribution() {
    return {
      dominantSource: this.dominantInadequateVentilationSource,
      forcedApneaActive: this.forcedApneaActive,
      forcedApneaContribution: this.forcedApneaContribution,
      proceduralApneaActive: this.proceduralApneaActive,
      proceduralApneaContribution: this.proceduralApneaContribution,
      drugDepressionContribution: this.drugDepressionContribution,
      complicationDriveContribution: this.complicationDriveContribution,
      effectiveNmbBlockade: this.effectiveNmbBlockade,
      respiratoryMuscleCapability: this.respiratoryMuscleCapability,
      centralDrive: this.centralDrive,
    };
  }

  transitionAirwayDevice(next) {
    const previous = this.#airwayDeviceState;
    if (!Object.values(AirwayDevice).includes(next)) {
      return { ok: false, changed: false, previous, current: previous, reason: `unknown airway device: ${next}` };
    }
    if (next === previous) {
      return { ok: true, changed: false, previous, current: previous, reason: '' };
    }
    const legal = (previous === AirwayDevice.Mask && next === AirwayDevice.Intubated)
      || (previous === AirwayDevice.Intubated && next === AirwayDevice.Extubated)
      || (previous === AirwayDevice.Extubated
        && (next === AirwayDevice.Mask || next === AirwayDevice.Intubated));
    if (!legal) {
      return { ok: false, changed: false, previous, current: previous, reason: `illegal ${previous} -> ${next}` };
    }
    this.#airwayDeviceState = next;
    return { ok: true, changed: true, previous, current: next, reason: '' };
  }

  deriveVo2() {
    const perKg = this.ageYears < 12 ? 6.0 : 3.5;
    return Max(20, perKg * this.weightKg);
  }

  deriveRestingVco2() {
    return Max(15, f(2.8) * this.weightKg);
  }

  tick(dt) {
    if (dt <= 0) return;
    this.updateDrugEffects();
    this.updateHemodynamics(dt);
    this.updateRespiration(dt);
    this.updateOxygenReservoir(dt);
    this.updateOxygenation(dt);
    this.updateAnesthesiaDepth(dt);
    this.updateWaveformPhases(dt);
    this.updateTemperature(dt);
    this.updateNeuromuscular(dt);
    this.updateMAP();
  }

  updateDrugEffects() {
    this._hrModifier = 0; this._bpModifier = 1; this._rrModifier = 1;

    if (this.propofolCe > 0) {
      const e = Clamp01(this.propofolCe / 4);
      this._hrModifier = f(this._hrModifier - e * 10);
      this._bpModifier = f(this._bpModifier - e * f(0.28));
      this._rrModifier = f(this._rrModifier - e * f(0.6));
    }
    if (this.fentanylCe > 0) {
      const e = Clamp01(this.fentanylCe / 4);
      this._hrModifier = f(this._hrModifier - e * 20);
      this._bpModifier = f(this._bpModifier - e * f(0.15));
      // stronger, nonlinear opioid ventilatory depression on its own curve (HR/BP unchanged)
      let opioidRespEffect = Clamp01(this.fentanylCe / f(1.2));
      if (this.naloxoneCe > 0) {
        const naloxoneBlock = Clamp01(this.naloxoneCe / f(0.8));
        const unblocked = f(1 - naloxoneBlock);
        opioidRespEffect = f(opioidRespEffect * unblocked);
      }
      this._rrModifier = f(this._rrModifier - opioidRespEffect * f(1.1));
    }
    if (this.midazolamCe > 0) {
      const e = Clamp01(this.midazolamCe / f(0.2));
      this._hrModifier = f(this._hrModifier - e * 5);
      this._bpModifier = f(this._bpModifier - e * f(0.1));
      this._rrModifier = f(this._rrModifier - e * f(0.3));
    }
    if (this.macMultiple > 0) {
      this._hrModifier = f(this._hrModifier - this.macMultiple * 8);
      this._bpModifier = f(this._bpModifier - this.macMultiple * f(0.2));
      this._rrModifier = f(this._rrModifier - this.macMultiple * f(0.4));
    }
    if (this.neostigmineCe > 0) {
      this._hrModifier = f(this._hrModifier - Clamp01(this.neostigmineCe) * 20);
    }
    this._bpModifier = Max(this._bpModifier, 0.3);
    this._rrModifier = Max(this._rrModifier, 0.1);
  }

  updateHemodynamics(dt) {
    const hrBoost = f(this.ephedrineCe * 12 + this.epinephrineCe * 25 + this.atropineCe * 28 - this.phenylephrineCe * 8);
    const bpBoost = f(this.phenylephrineCe * 25 + this.ephedrineCe * 15 + this.epinephrineCe * 30);

    const preload = Clamp(this.bloodVolumeFraction, 0.4, 1.1);
    const hypovolemiaReflex = f(Max(0, 1 - this.bloodVolumeFraction) * 60);

    const lidocaineHemodynamicsActive = this.surgicalStimulusEffective > 0
      || this.epiduralSympathectomyContribution > 0;
    const targetHR = lidocaineHemodynamicsActive
      ? Clamp(
        this.baselineHR + this._hrModifier + hrBoost + hypovolemiaReflex
          + this.hrComplicationOffset + f(this.surgicalStimulusEffective * 35)
          + this._rnd.jitter(0.5),
        25, 200,
      )
      : Clamp(
        this.baselineHR + this._hrModifier + hrBoost + hypovolemiaReflex + this.hrComplicationOffset + this._rnd.jitter(0.5),
        25, 200,
      );
    this.heartRate = Lerp(this.heartRate, targetHR, dt * 0.5);

    const lidocaineSvrMultiplier = lidocaineHemodynamicsActive
      ? f(f(1 + f(0.25 * this.surgicalStimulusEffective))
        * f(1 - f(0.2 * Clamp01(this.epiduralSympathectomyContribution))))
      : 1;
    const sysBase = lidocaineHemodynamicsActive
      ? this.baselineSystolic * this._bpModifier * this.svrFactor * preload * lidocaineSvrMultiplier
      : this.baselineSystolic * this._bpModifier * this.svrFactor * preload;
    const targetSys = Clamp(sysBase + bpBoost + this._rnd.jitter(1), 25, 250);
    const diaBase = lidocaineHemodynamicsActive
      ? this.baselineDiastolic * this._bpModifier * this.svrFactor * preload * lidocaineSvrMultiplier
      : this.baselineDiastolic * this._bpModifier * this.svrFactor * preload;
    const targetDia = Clamp(diaBase + bpBoost * f(0.6) + this._rnd.jitter(0.5), 12, 150);
    this.systolicBP = Lerp(this.systolicBP, targetSys, dt * 0.3);
    this.diastolicBP = Lerp(this.diastolicBP, targetDia, dt * 0.3);

    if (this.systolicBP <= this.diastolicBP + 5) this.diastolicBP = f(this.systolicBP - 5);
  }

  updateRespiration(dt) {
    if (this.isMechanicallyVentilated) {
      this.isBreathingSpontaneously = this.spontaneousEffort > f(0.01);
      return;
    }
    const procedureOrForcedApnea = this.#forcedApnea || this.#proceduralApnea;
    const targetRR = procedureOrForcedApnea
      ? 0
      : Clamp(this.baselineRR * this._rrModifier * this.respiratoryDriveFactor, 0, 40);
    this.respiratoryRate = Lerp(this.respiratoryRate, targetRR, dt * 0.5);
    this.isBreathingSpontaneously = !procedureOrForcedApnea
      && this.respiratoryRate >= 2 && this.respiratoryMuscleCapability > f(0.01);
  }

  updateOxygenReservoir(dt) {
    const capacityMl = Max(50, this.frcLiters * 1000);
    const va = this.alveolarVentilationLMin();
    const vaRequired = Max(0.5, f(0.045) * this.weightKg);
    const adequacy = Clamp01(va / vaRequired);
    const targetStores = f(Clamp01(this.fiO2 * f(0.95)) * capacityMl);
    const washPerSec = Clamp(va / Max(0.2, this.frcLiters) / 60, 0.002, 0.2);
    const filled = Lerp(this.alveolarO2StoresMl, targetStores, Clamp01(1 - Exp(-washPerSec * dt)));
    const drained = f(this.alveolarO2StoresMl - this.vo2MlMin * (dt / 60));
    this.alveolarO2StoresMl = Lerp(drained, filled, adequacy);
    this.alveolarO2StoresMl = Clamp(this.alveolarO2StoresMl, 0, capacityMl);
    this.alveolarO2Fraction = f(this.alveolarO2StoresMl / capacityMl);
  }

  alveolarVentilationLMin() {
    const noSpontaneousFlow = this.#forcedApnea || this.#proceduralApnea;
    const rr = (!this.isMechanicallyVentilated && noSpontaneousFlow) ? 0 : this.respiratoryRate;
    const tv = this.tidalVolume > 0 ? this.tidalVolume : 450;
    const deadspace = Max(60, f(2.2) * this.weightKg);
    const va = f(Max(0, (tv - deadspace) * rr) / 1000);
    return f(va * this.airwayPatency);
  }

  alveolarPO2() {
    return Max(0, this.alveolarO2Fraction * (760 - 47) - this.paCO2 / f(0.8));
  }

  updateOxygenation(dt) {
    const pAlv = this.alveolarPO2();
    this.paO2 = Lerp(this.paO2, pAlv, Clamp01(dt / 8));
    const endCapillarySat = PatientPhysiology.severinghausSpO2(this.paO2);
    const arterial = Lerp(endCapillarySat, 70, Clamp01(this.shuntFraction));
    this.spO2 = Clamp(arterial + this._rnd.jitter(0.15), 1, 100);
  }

  static eleveldBIS(ce, ageYears) {
    const ce50 = f(f(3.08) * Exp(f(-0.00635) * (ageYears - 35)));
    const gamma = ce <= ce50 ? 1.47 : 1.89;
    const ceG = Pow(Max(0, ce), gamma);
    const c50G = Pow(ce50, gamma);
    return f(93 * c50G / (ceG + c50G));
  }

  static eleveldBISWithOpioid(propofolCe, fentanylCe, ageYears) {
    const ce50p = f(f(3.08) * Exp(f(-0.00635) * (ageYears - 35)));
    const ce50o = 8;
    const alpha = 3;
    const up = f(Max(0, propofolCe) / ce50p);
    const uo = f(Max(0, fentanylCe) / ce50o);
    const gamma = up <= 1 ? 1.47 : 1.89;
    const U = f(up + uo + alpha * up * uo);
    return f(93 / (1 + Pow(U, gamma)));
  }

  static severinghausSpO2(pO2) {
    if (pO2 <= 0) return 0;
    const denom = f(pO2 * pO2 * pO2 + 150 * pO2);
    if (denom <= 0) return 0;
    const so2 = f(1 / (23400 / denom + 1));
    return f(Clamp01(so2) * 100);
  }

  updateAnesthesiaDepth(dt) {
    const bisHypnoticOpioid = PatientPhysiology.eleveldBISWithOpioid(this.propofolCe, this.fentanylCe, this.ageYears);
    let extra = 0;
    extra = f(extra + Clamp01(this.midazolamCe / f(0.15)) * 15);
    extra = f(extra + this.macMultiple * 25);
    const targetBIS = Clamp(bisHypnoticOpioid - extra, 8, 97);
    this.bisIndex = Lerp(this.bisIndex, targetBIS, dt * 0.3);

    if (this.bisIndex > 80) this.status = Status.Awake;
    else if (this.bisIndex > 65) this.status = Status.Sedated;
    else if (this.bisIndex > 50) this.status = Status.LightAnesthesia;
    else if (this.bisIndex > 35) this.status = Status.SurgicalAnesthesia;
    else if (this.bisIndex > 20) this.status = Status.DeepAnesthesia;
    else this.status = Status.Critical;
  }

  updateWaveformPhases(dt) {
    this._ecgPhase = f(this._ecgPhase + dt * (this.heartRate / 60));
    if (this._ecgPhase > 1) this._ecgPhase = f(this._ecgPhase - 1);
    const effectiveRR = this.isMechanicallyVentilated
      ? this.respiratoryRate
      : (this.isBreathingSpontaneously ? this.respiratoryRate : 0);
    if (effectiveRR > 0) {
      this._breathPhase = f(this._breathPhase + dt * (effectiveRR / 60));
      if (this._breathPhase > 1) this._breathPhase = f(this._breathPhase - 1);
    }
  }

  updateTemperature(dt) {
    let targetTemp = f(this.baselineTemp + this.heatLoadC);
    if (this.heatLoadC < f(0.05)) {
      if (this.status >= Status.LightAnesthesia) targetTemp = f(targetTemp - 0.5);
      if (this.status >= Status.DeepAnesthesia) targetTemp = f(targetTemp - f(0.8));
    }
    const rate = this.heatLoadC > f(0.05) ? f(0.03) : f(0.01);
    this.temperature = Lerp(this.temperature, targetTemp, dt * rate);
  }

  updateNeuromuscular(dt) {
    const roc = this.effectiveRocuroniumBlockade;
    const sux = this.effectiveSuccinylcholineBlockade;
    const blockade = Max(roc, sux);
    this.effectiveNmbBlockade = blockade;
    if (blockade > f(0.01)) {
      this.trainOfFourRatio = Lerp(this.trainOfFourRatio, 1 - blockade, dt * 0.3);
      this.trainOfFourCount = RoundToInt(Lerp(4, 0, blockade));
    } else {
      this.trainOfFourRatio = Lerp(this.trainOfFourRatio, 1, dt * 0.05);
      this.trainOfFourCount = this.trainOfFourRatio > f(0.9) ? 4 : RoundToInt(this.trainOfFourRatio * 4);
    }
  }

  updateMAP() {
    this.meanArterialPressure = f(this.diastolicBP + (this.systolicBP - this.diastolicBP) / 3);
  }
}
