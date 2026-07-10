/* ═══════════════════════════════════════════════════════════════════
   ventilatorSystem.js — faithful port of
   OperatingRoom.Simulation.VentilatorSystem under the Mono float model.
   Runs BEFORE PatientPhysiology each tick; its RNG jitters (VCV breath
   boundary, Manual spontaneous TV) precede the patient's.
   ═══════════════════════════════════════════════════════════════════ */
import { f, Clamp, Clamp01, Max, Min, Lerp } from './float32.js';
import { SimRandom } from './simRandom.js';

export const VentMode = { Manual: 0, VCV: 1, PCV: 2, PSV: 3 };

export class VentilatorSystem {
  constructor() {
    this.patient = null;
    this.mode = VentMode.Manual;

    this.setTidalVolume = 500; this.setRespiratoryRate = 12; this.setIERatio = 2;
    this.setPressureAbovePeep = 15; this.setPressureSupport = 10;
    this.setPeep = 5; this.setFiO2 = 1.0; this.peakFlowLPerMin = 40;
    this.o2FlowLPerMin = 2; this.airFlowLPerMin = 0; this.n2oFlowLPerMin = 0;
    this.vaporizerDial = 0; this.vaporizerAgent = 'Sevoflurane';

    this.measuredTidalVolume = 0; this.measuredRR = 0; this.measuredMinuteVent = 0;
    this.measuredPeakPressure = 0; this.measuredPlateauPressure = 0; this.measuredPeep = 0;
    this.measuredFiO2 = 0; this.inspiredAgentConcentration = 0; this.expiredAgentConcentration = 0;
    this.mechanicalMinuteVentilation = 0; this.effectiveMinuteVentilation = 0;

    this.aplValvePressure = 30; this.aplValveOpen = true; this.absorbentRemaining = 1;

    this.drivenExternally = false;
    this.rng = null;
    this._fallbackRng = null;
    this._breathTimer = 0;
  }

  get _rnd() {
    if (this.rng) return this.rng;
    if (!this._fallbackRng) this._fallbackRng = new SimRandom(0);
    return this._fallbackRng;
  }

  tick(dt) {
    if (this.patient == null || dt <= 0) return;
    const connected = this.patient.airwayDeviceState !== 'extubated';
    this.updateFiO2(connected);
    this.updateVaporizer(dt, connected);
    if (!connected && this.mode !== VentMode.Manual) {
      this.updateManualMode();
    } else {
      switch (this.mode) {
        case VentMode.Manual: this.updateManualMode(); break;
        case VentMode.VCV: this.updateVCVMode(dt); break;
        case VentMode.PCV: this.updatePCVMode(dt); break;
        case VentMode.PSV: this.updatePSVMode(); break;
        default: break;
      }
    }
    this.updatePatientInterface();
    this.updateCO2(dt);
    this.updateAbsorbent(dt);
  }

  updateFiO2(connected = true) {
    if (!connected) { this.measuredFiO2 = f(0.21); return; }
    const totalFlow = f(this.o2FlowLPerMin + this.airFlowLPerMin + this.n2oFlowLPerMin);
    if (totalFlow <= 0) { this.measuredFiO2 = f(0.21); return; }
    const o2FromAir = f(this.airFlowLPerMin * f(0.21));
    const totalO2 = f(this.o2FlowLPerMin + o2FromAir);
    this.measuredFiO2 = Clamp(totalO2 / totalFlow, 0.21, 1);
    if (this.mode !== VentMode.Manual) this.measuredFiO2 = this.setFiO2;
  }

  updateVaporizer(dt, connected = true) {
    if (!connected || this.vaporizerDial <= 0) {
      this.inspiredAgentConcentration = 0;
      this.expiredAgentConcentration = 0;
      this.patient.macMultiple = 0;
      this.patient.endTidalAgent = 0;
      this.patient.currentAgent = 'None';
      return;
    }
    this.inspiredAgentConcentration = this.vaporizerDial;
    const uptakeFactor = f(0.7);
    const targetExpired = f(this.inspiredAgentConcentration * uptakeFactor);
    this.expiredAgentConcentration = Lerp(this.expiredAgentConcentration, targetExpired, dt * f(0.1));

    let macValue;
    if (this.vaporizerAgent === 'Sevoflurane') macValue = f(2.05);
    else if (this.vaporizerAgent === 'Desflurane') macValue = f(6.0);
    else macValue = f(1.17);

    let ageFactor = 1;
    if (this.patient.ageYears > 40) ageFactor = f(1 - (this.patient.ageYears - 40) * f(0.006));
    macValue = f(macValue * Max(0.5, ageFactor));

    const fentanylMacReduction = f(Clamp01(this.patient.fentanylCe / 3) * 0.5);
    macValue = f(macValue * (1 - fentanylMacReduction));

    this.patient.macMultiple = f(this.expiredAgentConcentration / macValue);
    this.patient.endTidalAgent = this.expiredAgentConcentration;
    this.patient.currentAgent = this.vaporizerAgent;
  }

  updateVCVMode(dt) {
    this.patient.isMechanicallyVentilated = true;
    this.patient.isBreathingSpontaneously = false;
    const breathPeriod = f(60 / this.setRespiratoryRate);
    const inspiratoryTime = f(breathPeriod / (1 + this.setIERatio));
    this._breathTimer = f(this._breathTimer + dt);
    if (this._breathTimer < inspiratoryTime) {
      this.measuredPeakPressure = f(this.setPeep + this.setTidalVolume / 50 * this.patient.airwayResistanceFactor);
      this.measuredPlateauPressure = f(this.setPeep + this.setTidalVolume / 70);
    }
    if (this._breathTimer >= breathPeriod) {
      this._breathTimer = 0;
      this.measuredTidalVolume = f(this.setTidalVolume + this._rnd.jitter(10));
    }
    this.measuredRR = this.setRespiratoryRate;
    this.measuredPeep = this.setPeep;
    this.measuredMinuteVent = f(this.measuredTidalVolume * this.measuredRR / 1000);
    this.mechanicalMinuteVentilation = this.measuredMinuteVent;
  }

  updatePCVMode(dt) {
    this.patient.isMechanicallyVentilated = true;
    this.patient.isBreathingSpontaneously = false;
    const breathPeriod = f(60 / this.setRespiratoryRate);
    const inspiratoryTime = f(breathPeriod / (1 + this.setIERatio));
    this._breathTimer = f(this._breathTimer + dt);
    if (this._breathTimer < inspiratoryTime) {
      this.measuredPeakPressure = f(this.setPeep + this.setPressureAbovePeep);
      const compliance = f(50 / Max(1, this.patient.airwayResistanceFactor));
      this.measuredTidalVolume = f(this.setPressureAbovePeep * compliance);
    }
    if (this._breathTimer >= breathPeriod) this._breathTimer = 0;
    this.measuredPlateauPressure = this.measuredPeakPressure;
    this.measuredRR = this.setRespiratoryRate;
    this.measuredPeep = this.setPeep;
    this.measuredMinuteVent = f(this.measuredTidalVolume * this.measuredRR / 1000);
    this.mechanicalMinuteVentilation = this.measuredMinuteVent;
  }

  updatePSVMode() {
    this.patient.isMechanicallyVentilated = true;
    if (this.patient.respiratoryRate > 2) {
      this.measuredPeakPressure = f(this.setPeep + this.setPressureSupport);
      const compliance = 50;
      this.measuredTidalVolume = f(this.setPressureSupport * compliance * f(0.8));
      this.measuredRR = this.patient.respiratoryRate;
    } else {
      this.measuredTidalVolume = 0;
      this.measuredRR = 0;
      this.measuredPeakPressure = this.setPeep;
    }
    this.measuredPeep = this.setPeep;
    this.measuredMinuteVent = f(this.measuredTidalVolume * this.measuredRR / 1000);
    this.mechanicalMinuteVentilation = this.measuredMinuteVent;
  }

  updateManualMode() {
    this.patient.isMechanicallyVentilated = false;
    this.mechanicalMinuteVentilation = 0;
    this.measuredPeakPressure = 0;
    this.measuredPlateauPressure = 0;
    this.measuredPeep = 0;
    if (this.patient.isBreathingSpontaneously) {
      this.measuredRR = this.patient.respiratoryRate;
      const baseTidalVolume = f(7 * this.patient.weightKg + this._rnd.jitter(20));
      this.measuredTidalVolume = this.patient.respiratoryMuscleCapability < 1
        ? f(baseTidalVolume * this.patient.respiratoryMuscleCapability)
        : baseTidalVolume;
      this.measuredMinuteVent = f(this.measuredTidalVolume * this.measuredRR / 1000);
    } else {
      this.measuredTidalVolume = 0;
      this.measuredRR = 0;
      this.measuredMinuteVent = 0;
    }
  }

  updatePatientInterface() {
    const connected = this.patient.airwayDeviceState !== 'extubated';
    const controlled = connected && this.mode !== VentMode.Manual;
    this.patient.fiO2 = this.measuredFiO2;
    this.patient.tidalVolume = this.measuredTidalVolume;
    let effectiveMinuteVent = this.measuredMinuteVent;
    if (controlled && (this.patient.forcedApneaActive || this.patient.effectiveNmbBlockade > f(0.01))) {
      effectiveMinuteVent = Max(this.measuredMinuteVent, this.patient.spontaneousMinuteVentilation);
    }
    this.effectiveMinuteVentilation = effectiveMinuteVent;
    this.patient.minuteVentilation = effectiveMinuteVent;
    this.patient.peakAirwayPressure = this.measuredPeakPressure;
    this.patient.plateauPressure = this.measuredPlateauPressure;
    this.patient.peep = this.measuredPeep;
    if (controlled) this.patient.respiratoryRate = this.measuredRR;
  }

  updateCO2(dt) {
    const deadspace = Max(60, f(2.2) * this.patient.weightKg);
    const controlled = this.patient.airwayDeviceState !== 'extubated' && this.mode !== VentMode.Manual;
    const rr = controlled ? this.measuredRR
      : (this.patient.isBreathingSpontaneously ? this.patient.respiratoryRate : 0);
    const tv = controlled ? this.measuredTidalVolume
      : (this.patient.isBreathingSpontaneously ? 400 : 0);
    const vaLMin = f(Max(0, (tv - deadspace) * rr) / 1000 * this.patient.airwayPatency);

    if (vaLMin > 0.3) {
      const targetPaCO2 = Clamp(f(0.863) * this.patient.vco2MlMin / vaLMin, 10, 130);
      this.patient.paCO2 = Lerp(this.patient.paCO2, targetPaCO2, Clamp01(dt / 25));
    } else {
      const rise = f(f(0.06) * (this.patient.vco2MlMin / 200));
      this.patient.paCO2 = Min(150, this.patient.paCO2 + rise * dt);
    }
    this.patient.etCO2 = Clamp(this.patient.paCO2 - 3, 0, 150);
  }

  updateAbsorbent(dt) {
    if (this.mode !== VentMode.Manual || this.patient.isBreathingSpontaneously) {
      this.absorbentRemaining = f(this.absorbentRemaining - dt * f(0.00001));
      this.absorbentRemaining = Max(0, this.absorbentRemaining);
    }
  }

  setMode(newMode) {
    this.mode = newMode;
    this._breathTimer = 0;
  }
}
