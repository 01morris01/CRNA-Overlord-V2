/* ═══════════════════════════════════════════════════════════════════
   drugSystem.js — faithful port of OperatingRoom.Simulation.DrugSystem
   under the Mono float model (double intermediates; `f()` at float stores /
   returns / Mathf & float-arg boundaries; non-dyadic float literals
   frounded). No RNG. Propofol = full Eleveld 2018.
   ═══════════════════════════════════════════════════════════════════ */
import { f, Clamp01, Max, Min, MoveTowards, Pow, Exp } from './float32.js';

export class DrugSystem {
  constructor() {
    this.patient = null;
    this.drugLibrary = [];
    this.activeInfusions = [];

    this._ppfA1 = 0; this._ppfA2 = 0; this._ppfA3 = 0; this._ppfCe = 0;
    this.ppfV1 = 0; this.ppfV2 = 0; this.ppfV3 = 0; this.ppfCL = 0;
    this.ppfQ2 = 0; this.ppfQ3 = 0; this.ppfKe0 = 0; this.ppfC50 = 0;
    this.propofolWithOpioid = true;
    this._elComputed = false;
    this._elAge = 0; this._elWt = 0; this._elHt = 0; this._elMale = false; this._elOpiate = false;

    this._fentanylC1 = 0; this._fentanylC2 = 0; this._fentanylC3 = 0; this._fentanylCe = 0;
    this._rocuroniumC1 = 0; this._rocuroniumCe = 0;
    this._midazolamC1 = 0; this._midazolamCe = 0;
    this._suxC1 = 0; this._suxCe = 0;
    this._epiC1 = 0; this._epiCe = 0; this._phenylC1 = 0; this._phenylCe = 0;
    this._ephedC1 = 0; this._ephedCe = 0;
    this._naloxC1 = 0; this._naloxCe = 0; this._dantC1 = 0; this._dantCe = 0;
    this._atropC1 = 0; this._atropCe = 0; this._albC1 = 0; this._albCe = 0;
    this._sugammadexRocRelief = 0; this._sugammadexReliefTarget = 0;
    this._sugammadexReliefRate = 0; this._sugammadexAdministered = false;
    this._neoC1 = 0; this._neoCe = 0;
    this._neostigmineRocRelief = 0; this._neostigmineReliefTarget = 0;
    this._neostigmineReliefRate = 0; this._neostigmineAdministered = false;

    this.drivenExternally = false;
    this.rng = null;
  }

  administerBolus(drugName, totalDoseMg) {
    if (this.patient == null) return;
    const volumeL = f(this.patient.weightKg * f(0.07));
    switch (drugName) {
      case 'Propofol': this._ppfA1 = f(this._ppfA1 + totalDoseMg); break;
      case 'Fentanyl': this._fentanylC1 = f(this._fentanylC1 + (totalDoseMg * 1000) / (volumeL * f(12.7))); break;
      case 'Rocuronium': this._rocuroniumC1 = f(this._rocuroniumC1 + totalDoseMg / (volumeL * f(6.7))); break;
      case 'Midazolam': this._midazolamC1 = f(this._midazolamC1 + totalDoseMg / (volumeL * f(1.1))); break;
      case 'Succinylcholine': this._suxC1 = f(this._suxC1 + totalDoseMg / (volumeL * 6)); break;
      // pressors weight-scaled (mcg/kg), anchored at the 70 kg reference
      case 'Ephedrine': this._ephedC1 = f(this._ephedC1 + totalDoseMg / 10 * (70 / this.patient.weightKg)); break;
      case 'Phenylephrine': this._phenylC1 = f(this._phenylC1 + totalDoseMg / f(0.1) * (70 / this.patient.weightKg)); break;
      case 'Epinephrine': this._epiC1 = f(this._epiC1 + totalDoseMg / f(0.05) * (70 / this.patient.weightKg)); break;
      case 'Glycopyrrolate': this._atropC1 = f(this._atropC1 + totalDoseMg / f(0.4) * 0.5); break;
      case 'Atropine': this._atropC1 = f(this._atropC1 + totalDoseMg / 0.5); break;
      case 'Naloxone': this._naloxC1 = f(this._naloxC1 + totalDoseMg / f(0.04)); break;
      case 'Dantrolene': this._dantC1 = f(this._dantC1 + totalDoseMg / (2.5 * this.patient.weightKg)); break;
      case 'Albuterol': this._albC1 = f(this._albC1 + totalDoseMg); break;
      case 'Sugammadex': this.administerSugammadex(totalDoseMg); break;
      case 'Neostigmine': this.administerNeostigmine(totalDoseMg); break;
      default: break;
    }
  }

  administerWeightBasedBolus(drugName, dosePerKg) {
    if (this.patient == null) return;
    const totalDose = f(dosePerKg * this.patient.weightKg);
    this.administerBolus(drugName, totalDose);
  }

  startInfusion(drugName, ratePerHour) {
    this.activeInfusions = this.activeInfusions.filter((i) => i.drugName !== drugName);
    this.activeInfusions.push({ drugName, ratePerHour, elapsed: 0 });
  }

  stopInfusion(drugName) {
    this.activeInfusions = this.activeInfusions.filter((i) => i.drugName !== drugName);
  }

  tick(dt) {
    if (this.patient == null || dt <= 0) return;
    this.ensureEleveld();
    this.processInfusions(dt);
    this.updatePropofolPK(dt);
    this.updateFentanylPK(dt);
    this.updateRocuroniumPK(dt);
    this.updateMidazolamPK(dt);
    this.updateSuccinylcholinePK(dt);
    this.updateReversalAgents(dt);
    this.updateTreatmentAgents(dt);

    this.patient.propofolCe = this._ppfCe;
    this.patient.fentanylCe = this._fentanylCe;
    this.patient.rocuroniumCe = this._rocuroniumCe;
    this.patient.midazolamCe = this._midazolamCe;
    this.patient.succinylcholineCe = this._suxCe;
    this.patient.sugammadexRocRelief = this._sugammadexRocRelief;
    this.patient.neostigmineRocRelief = this._neostigmineRocRelief;
    this.patient.neostigmineCe = this._neoCe;
  }

  get sugammadexRocRelief() { return this._sugammadexRocRelief; }
  get neostigmineRocRelief() { return this._neostigmineRocRelief; }

  resetReversalState() {
    this._sugammadexRocRelief = 0; this._sugammadexReliefTarget = 0;
    this._sugammadexReliefRate = 0; this._sugammadexAdministered = false;
    this._neoC1 = 0; this._neoCe = 0;
    this._neostigmineRocRelief = 0; this._neostigmineReliefTarget = 0;
    this._neostigmineReliefRate = 0; this._neostigmineAdministered = false;
  }

  administerSugammadex(totalDoseMg) {
    if (!(Number.isFinite(totalDoseMg) && totalDoseMg > 0) || this.patient == null) return;
    this._sugammadexAdministered = true;
    const dosePerKg = f(totalDoseMg / Max(1, this.patient.weightKg));
    let duration = 0;
    if (dosePerKg >= 16) duration = 30;
    else if (dosePerKg >= 4) duration = 90;
    else if (dosePerKg >= 2 && this.patient.trainOfFourCount >= 2) duration = 120;
    if (duration <= 0) return;
    this._sugammadexReliefTarget = 1;
    this._sugammadexReliefRate = f(1 / duration);
  }

  administerNeostigmine(totalDoseMg) {
    if (!(Number.isFinite(totalDoseMg) && totalDoseMg > 0) || this.patient == null) return;
    this._neostigmineAdministered = true;
    const maxByWeight = f(f(0.07) * this.patient.weightKg);
    const effectiveDose = Min(totalDoseMg, Min(maxByWeight, 5));
    const effectiveDosePerKg = f(effectiveDose / Max(1, this.patient.weightKg));
    const doseFraction = Clamp01(effectiveDosePerKg / f(0.07));
    this._neoC1 = f(this._neoC1 + doseFraction);

    let ceiling = 0;
    if (this.patient.trainOfFourCount >= 2) ceiling = f(0.45);
    else if (this.patient.trainOfFourCount === 1) ceiling = f(0.15);
    const rawRocBlock = Clamp01(this.patient.rocuroniumCe / 3);
    const scaledCeiling = f(ceiling * doseFraction);
    const target = Min(scaledCeiling, rawRocBlock);
    this._neostigmineReliefTarget = Max(this._neostigmineReliefTarget, target);
    this._neostigmineReliefRate = f(this._neostigmineReliefTarget / 420);
  }

  updateReversalAgents(dt) {
    if (this._sugammadexAdministered) {
      const maxDelta = f(this._sugammadexReliefRate * dt);
      this._sugammadexRocRelief = MoveTowards(
        this._sugammadexRocRelief, this._sugammadexReliefTarget, maxDelta,
      );
    }
    if (this._neostigmineAdministered) {
      const maxDelta = f(this._neostigmineReliefRate * dt);
      this._neostigmineRocRelief = MoveTowards(
        this._neostigmineRocRelief, this._neostigmineReliefTarget, maxDelta,
      );
    }
  }

  static _eff(c1, ce, k10, ke0, dt) {
    const c1n = Max(0, c1 - k10 * c1 * dt);
    const cen = Max(0, ce + ke0 * (c1n - ce) * dt);
    return [c1n, cen];
  }

  updateTreatmentAgents(dt) {
    [this._epiC1, this._epiCe] = DrugSystem._eff(this._epiC1, this._epiCe, f(f(0.15) / 60), f(0.50 / 60), dt);
    [this._phenylC1, this._phenylCe] = DrugSystem._eff(this._phenylC1, this._phenylCe, f(f(0.10) / 60), f(0.50 / 60), dt);
    [this._ephedC1, this._ephedCe] = DrugSystem._eff(this._ephedC1, this._ephedCe, f(f(0.06) / 60), f(f(0.40) / 60), dt);
    [this._naloxC1, this._naloxCe] = DrugSystem._eff(this._naloxC1, this._naloxCe, f(f(0.026) / 60), f(f(0.60) / 60), dt);
    [this._dantC1, this._dantCe] = DrugSystem._eff(this._dantC1, this._dantCe, f(f(0.008) / 60), f(f(0.30) / 60), dt);
    [this._atropC1, this._atropCe] = DrugSystem._eff(this._atropC1, this._atropCe, f(f(0.03) / 60), f(f(0.60) / 60), dt);
    [this._albC1, this._albCe] = DrugSystem._eff(this._albC1, this._albCe, f(f(0.05) / 60), f(f(0.40) / 60), dt);
    [this._neoC1, this._neoCe] = DrugSystem._eff(this._neoC1, this._neoCe, f(f(0.03) / 60), f(f(0.60) / 60), dt);

    this.patient.epinephrineCe = this._epiCe;
    this.patient.phenylephrineCe = this._phenylCe;
    this.patient.ephedrineCe = this._ephedCe;
    this.patient.naloxoneCe = this._naloxCe;
    this.patient.dantroleneCe = this._dantCe;
    this.patient.atropineCe = this._atropCe;
    this.patient.albuterolCe = this._albCe;
    this.patient.neostigmineCe = this._neoCe;
  }

  processInfusions(dt) {
    const volumeL = f(this.patient.weightKg * f(0.07));
    for (const inf of this.activeInfusions) {
      inf.elapsed = f(inf.elapsed + dt);
      const doseThisFrame = f(inf.ratePerHour * (dt / 3600));
      switch (inf.drugName) {
        case 'Propofol': this._ppfA1 = f(this._ppfA1 + doseThisFrame); break;
        case 'Fentanyl': this._fentanylC1 = f(this._fentanylC1 + (doseThisFrame * 1000) / (volumeL * f(12.7))); break;
        case 'Rocuronium': this._rocuroniumC1 = f(this._rocuroniumC1 + doseThisFrame / (volumeL * f(6.7))); break;
        default: break;
      }
    }
  }

  updatePropofolPK(dt) {
    if (this.ppfV1 <= 0) return;
    const k10 = f(this.ppfCL / this.ppfV1 / 60);
    const k12 = f(this.ppfQ2 / this.ppfV1 / 60);
    const k21 = f(this.ppfQ2 / this.ppfV2 / 60);
    const k13 = f(this.ppfQ3 / this.ppfV1 / 60);
    const k31 = f(this.ppfQ3 / this.ppfV3 / 60);
    const ke0 = f(this.ppfKe0 / 60);

    const dA1 = f(-(k10 + k12 + k13) * this._ppfA1 + k21 * this._ppfA2 + k31 * this._ppfA3);
    const dA2 = f(k12 * this._ppfA1 - k21 * this._ppfA2);
    const dA3 = f(k13 * this._ppfA1 - k31 * this._ppfA3);
    this._ppfA1 = Max(0, this._ppfA1 + dA1 * dt);
    this._ppfA2 = Max(0, this._ppfA2 + dA2 * dt);
    this._ppfA3 = Max(0, this._ppfA3 + dA3 * dt);

    const Cp = f(this._ppfA1 / this.ppfV1);
    this._ppfCe = Max(0, this._ppfCe + ke0 * (Cp - this._ppfCe) * dt);
  }

  get propofolPlasma() { return this.ppfV1 > 0 ? f(this._ppfA1 / this.ppfV1) : 0; }

  ensureEleveld() {
    const male = this.patient.sex === 'Male';
    if (this._elComputed && this._elAge === this.patient.ageYears && this._elWt === this.patient.weightKg &&
        this._elHt === this.patient.heightCm && this._elMale === male && this._elOpiate === this.propofolWithOpioid) {
      return;
    }
    this.computeEleveld();
  }

  computeEleveld() {
    const AGE = f(this.patient.ageYears);
    const TBW = Max(1, this.patient.weightKg);
    const HGT = Max(30, this.patient.heightCm);
    const MALE = this.patient.sex === 'Male';
    const OPIATE = this.propofolWithOpioid;

    const AGEref = 35, WGTref = 70, HGTref = 170;
    const BMI = f(TBW / Pow(HGT / 100, 2));
    const BMIref = f(WGTref / Pow(HGTref / 100, 2));
    const PMA = f(AGE + 40 / 52);
    const PMAref = f(AGEref + 40 / 52);

    // theta[1..18], frounded (C# float literals)
    const t1 = f(6.28), t2 = f(25.5), t3 = 273, t4 = f(1.79), t5 = f(1.75), t6 = f(1.11),
      t8 = f(42.3), t9 = f(9.06), t10 = f(-0.0156), t11 = f(-0.00286), t12 = f(33.6),
      t13 = f(-0.0138), t14 = f(68.3), t15 = f(2.10), t16 = f(1.30);
    const ke0art = f(0.146), c50 = f(3.08);

    const Faging = (x) => Exp(f(x) * (AGE - AGEref));
    const Fsig = (x, e50, lam) => { x = f(x); e50 = f(e50); lam = f(lam); return f(Pow(x, lam) / (Pow(x, lam) + Pow(e50, lam))); };
    const Fcentral = (x) => Fsig(x, t12, 1);
    const Fopiate = (x) => (OPIATE ? Exp(f(x) * AGE) : 1);

    const fCLmat = Fsig(PMA * 52, t8, t9);
    const fCLmatRef = Fsig(PMAref * 52, t8, t9);
    const fQ3mat = Fsig(AGE * 52 + 40, t14, 1);
    const fQ3matRef = Fsig(AGEref * 52 + 40, t14, 1);

    let fAl;
    if (MALE) {
      const A = f(f(0.88) + (1 - f(0.88)) / (1 + Pow(AGE / f(13.4), -12.7)));
      fAl = f(A * (9270 * TBW) / (6680 + 216 * BMI));
    } else {
      const A = f(f(1.11) + (1 - f(1.11)) / (1 + Pow(AGE / f(7.1), -1.1)));
      fAl = f(A * (9270 * TBW) / (8780 + 244 * BMI));
    }
    const Aref = f(f(0.88) + (1 - f(0.88)) / (1 + Pow(AGEref / f(13.4), -12.7)));
    const fAlRef = f(Aref * (9270 * WGTref) / (6680 + 216 * BMIref));

    this.ppfV1 = f(t1 * Fcentral(TBW) / Fcentral(WGTref));
    this.ppfV2 = f(t2 * (TBW / WGTref) * Faging(t10));
    this.ppfV3 = f(t3 * (fAl / fAlRef) * Fopiate(t13));
    this.ppfCL = f((MALE ? t4 : t15) * Pow(TBW / WGTref, 0.75) * (fCLmat / fCLmatRef) * Fopiate(t11));
    this.ppfQ2 = f(t5 * Pow(this.ppfV2 / t2, 0.75) * (1 + t16 * (1 - fQ3mat)));
    this.ppfQ3 = f(t6 * Pow(this.ppfV3 / t3, 0.75) * (fQ3mat / fQ3matRef));
    this.ppfKe0 = f(ke0art * Pow(TBW / WGTref, -0.25));
    this.ppfC50 = f(c50 * Faging(-0.00635));

    this._elComputed = true;
    this._elAge = AGE; this._elWt = this.patient.weightKg; this._elHt = this.patient.heightCm;
    this._elMale = MALE; this._elOpiate = OPIATE;
  }

  updateFentanylPK(dt) {
    const k10 = f(f(0.0827) / 60), k12 = f(f(0.471) / 60), k21 = f(f(0.225) / 60);
    const k13 = f(f(0.225) / 60), k31 = f(f(0.013) / 60), ke0 = f(f(0.147) / 60);

    const dC1 = f(-(k10 + k12 + k13) * this._fentanylC1 + k21 * this._fentanylC2 + k31 * this._fentanylC3);
    const dC2 = f(k12 * this._fentanylC1 - k21 * this._fentanylC2);
    const dC3 = f(k13 * this._fentanylC1 - k31 * this._fentanylC3);
    const dCe = f(ke0 * (this._fentanylC1 - this._fentanylCe));

    this._fentanylC1 = Max(0, this._fentanylC1 + dC1 * dt);
    this._fentanylC2 = Max(0, this._fentanylC2 + dC2 * dt);
    this._fentanylC3 = Max(0, this._fentanylC3 + dC3 * dt);
    this._fentanylCe = Max(0, this._fentanylCe + dCe * dt);
  }

  updateRocuroniumPK(dt) {
    const k10 = f(f(0.065) / 60), ke0 = f(f(0.168) / 60);
    this._rocuroniumC1 = Max(0, this._rocuroniumC1 - k10 * this._rocuroniumC1 * dt);
    this._rocuroniumCe = Max(0, this._rocuroniumCe + ke0 * (this._rocuroniumC1 - this._rocuroniumCe) * dt);
  }

  updateMidazolamPK(dt) {
    const k10 = f(f(0.044) / 60), ke0 = f(f(0.077) / 60);
    this._midazolamC1 = Max(0, this._midazolamC1 - k10 * this._midazolamC1 * dt);
    this._midazolamCe = Max(0, this._midazolamCe + ke0 * (this._midazolamC1 - this._midazolamCe) * dt);
  }

  updateSuccinylcholinePK(dt) {
    const k10 = f(0.25 / 60), ke0 = f(0.5 / 60);
    this._suxC1 = Max(0, this._suxC1 - k10 * this._suxC1 * dt);
    this._suxCe = Max(0, this._suxCe + ke0 * (this._suxC1 - this._suxCe) * dt);
  }
}
