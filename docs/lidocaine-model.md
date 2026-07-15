# Lidocaine Simulation Model

Date: 2026-07-15
Status: implemented on `feature/live-sim-lidocaine-controls`

## Purpose and safety boundary

This is a deterministic educational model for observing relationships between Lidocaine dose, route, systemic exposure, regional block, surgical stimulation, ventricular irritability, local-anesthetic systemic toxicity (LAST), and lipid rescue. It is not a dosing calculator, treatment protocol, patient-specific pharmacokinetic service, or substitute for clinical judgment. The dose limits and toxicity bands below are modeled teaching anchors; they are not bedside diagnostic thresholds.

No Lidocaine action writes HR, blood pressure, rhythm, BIS, SpO2, or another derived vital. `LidocaineSystem` publishes graded inputs to `PatientPhysiology`, which derives the displayed state through the same fixed-step physiology path used by the rest of the engine.

The system is RNG-free (`rng === null`) and uses the engine float32 helpers for stored numeric state. If no Lidocaine, regional, stimulation, irritability, or lipid action is used, every new driver remains inert and consumes no random samples.

## State ownership and tick order

One `LidocaineSystem` instance is exposed as rig key `l`. It owns all IV and regional Lidocaine mass, local block state, systemic exposure, toxicity, ventricular-irritability treatment, and lipid-rescue state. Administrative `LocalAnestheticToxicity` setup delegates into this same instance; there is no second `_lastCnsTox`, `_lastCardiacTox`, or regional-toxicity variable.

At each 0.02-second engine step, the system:

1. absorbs regional depot mass and adds active infusion input;
2. advances central/peripheral distribution and clearance;
3. advances the finite lipid sink;
4. updates the free-plasma effect site;
5. derives local block, toxicity, irritability, and rescue state;
6. publishes contributions before patient physiology advances.

## Systemic pharmacokinetics

Reference parameters are weight-scaled from a 70 kg patient:

```text
weightScale = weightKg / 70
Vc = 43 * weightScale L
Vp = 56 * weightScale L
Cl = 0.95 * weightScale^0.75 * lidocaineClearanceFactor L/min
Q  = 1.00 * weightScale^0.75 L/min
```

`lidocaineClearanceFactor` defaults to exactly `1` and is independently queryable. IV bolus mass enters the central compartment. An infusion contributes:

```text
infusionInputMgMin = rateMgPerKgHour * weightKg / 60
```

For step length `dtMin`:

```text
Cc = centralMg / Vc
Cp = peripheralMg / Vp
eliminatedMg = Cl * Cc * dtMin
exchangeMg = Q * (Cc - Cp) * dtMin

centralMg += infusionMg + regionalAbsorbedMg - eliminatedMg - exchangeMg
peripheralMg += exchangeMg
```

Outgoing transfers are bounded so neither compartment becomes negative. Total plasma concentration is `centralMg / Vc`; mg/L and mcg/mL are numerically equal. Interpolation of the label's concentration-dependent binding anchors is:

```text
total <= 1 mcg/mL: 80% bound
1..4 mcg/mL:       linear 80% -> 60% bound
4..7 mcg/mL:       linear 60% -> 40% bound
total > 7 mcg/mL:  40% bound
free = total * (1 - boundFraction)
```

The free-plasma effect site follows a first-order equilibration with a 2-minute half-time:

```text
ke0 = ln(2) / 2 min
Ce += (freePlasma - Ce) * (1 - exp(-ke0 * dtMin))
```

Mass is audited as:

```text
cumulativeAdministeredMg
= centralMg + peripheralMg + regionalDepotMg
 + lipidBoundMg + eliminatedMg
```

`massBalanceErrorMg` is the absolute difference between the two sides. The implementation recomputes eliminated mass from the conserved remainder after each fixed step to contain float32 accumulation error.

## Regional depots and block

Supported route strings are exactly `infiltration`, `peripheral`, and `epidural`. The accepted dose is:

```text
totalDoseMg = concentrationPercent * 10 * volumeMl
doseMgKg = totalDoseMg / weightKg
```

The console classifies—but does not prevent—a dose above the healthy-adult label anchor:

```text
without epinephrine: min(4.5 mg/kg, 300 mg)
with epinephrine:    min(7 mg/kg, 500 mg)
```

Route absorption is a teaching-average depot model:

- epidural: normalized fast/slow fractions `0.38 / (0.38 + 0.58)` and the remainder, with 9.3- and 82-minute absorption half-times;
- peripheral: 60-minute appearance lag followed by a 90-minute absorption half-time, calibrated to a 2.3-hour peak band;
- infiltration: 120-minute absorption half-time and no lag;
- epinephrine: multiplies every route's absorption rate constant by `0.5`.

For a depot mass `M` and rate `ka`:

```text
absorbed = M * (1 - exp(-ka * dtMin))
```

Local sensory target uses `doseFactor = clamp(doseMgKg / 3, 0, 1)` and the remaining-depot fraction. Sensory onset half-shaping uses route time constants of 5 minutes (infiltration), 15 minutes (peripheral), and 10 minutes (epidural). Motor ceilings are 0.15, 0.90, and 0.75 respectively. Epidural sympathectomy is `0.85 * targetSensory`; other routes contribute zero. Multiple records compose by the greatest current block rather than summing beyond one.

Surgical stimulus remains an explicit `0..1` driver:

```text
effectiveStimulus
= rawStimulus
 * (1 - regionalSensoryBlock * regionalCoverage)
 * (1 - 0.25 * systemicAnalgesicContribution)

regionalCoverage = 1.0 infiltration/peripheral, 0.9 epidural
systemicAnalgesicContribution = clamp(effectSite / 2, 0, 1)
```

At full effective stimulation, patient physiology can add up to 35 bpm to its HR target and multiply SVR by 1.25. Full modeled epidural sympathectomy can reduce that pathway's SVR multiplier by 20%. These are simulator calibration constants, not clinical effect predictions.

## Antiarrhythmic and toxicity derivation

The antiarrhythmic contribution rises through the modeled therapeutic effect-site band and is attenuated as cardiac toxicity develops:

```text
therapeutic = clamp(effectSiteMcgMl / 0.35, 0, 1)
antiarrhythmicContribution = therapeutic * (1 - cardiacToxicity)

effectiveVentricularIrritability
= rawVentricularIrritability * (1 - antiarrhythmicContribution)
```

That effective value is the independently queryable treatment signal. Toxic exposure separately supplies a rhythm-irritability floor of `0.8 * cardiacToxicity`; the derived rhythm uses the greater of the treated external driver and that toxicity floor. Thresholds are `<0.25` sinus, `0.25..<0.70` ventricular ectopy, and `>=0.70` ventricular tachycardia. Explicit ventricular fibrillation always remains ventricular fibrillation: Lidocaine never writes sinus rhythm or directly cardioverts VF.

Deterministic total-plasma teaching bands are:

```text
< 5 mcg/mL: none
5.. <8:     warning
8..10:      CNS
>10:        cardiac (overlapping cardiac toxicity begins above 10)

cnsToxicity = clamp((total - 8) / 2, 0, 1)
cardiacToxicity = clamp((total - 10) / 2.5, 0, 1)
```

Sustained severe CNS exposure is required before seizure drive becomes active. Existing Propofol or Midazolam effect-site concentration can suppress the visible seizure, but it does not erase the toxic exposure. Sustained severe cardiac exposure produces a graded collapse contribution; patient physiology then derives bradycardia and pressure loss from that contribution.

## Lipid rescue

The shared 20% lipid-rescue state implements:

- bolus: 1.5 mL/kg;
- infusion start: 0.25 mL/kg/min;
- calling start again while active: 0.50 mL/kg/min;
- cumulative cap: 12 mL/kg.

Each delivered mL/kg creates `0.8 * weightKg` mg of finite sink capacity. Free central mass is captured with a 15-second half-time and enters `lipidBoundMg`; bound mass clears with a 240-minute half-time. Capture reduces free/total exposure through the same compartment path, so recovery is derived rather than written directly.

This is deliberately a calibrated lipid-sink simplification. The discrete bolus action credits the modeled 1.5 mL/kg immediately, while sequestration occurs over subsequent fixed steps; the engine does not model a syringe-delivery waveform, lipid pharmacology, altered resuscitation drug dosing, airway treatment, CPR, or defibrillation.

## Public live-wrapper methods

The UI calls these exact `SimRunner` methods:

```js
giveLidocaineBolus({ doseMgPerKg = 1.5 })
startLidocaineInfusion({ rateMgPerKgHour })
stopLidocaineInfusion()
administerRegionalLidocaine({
  route, concentrationPercent, volumeMl, epinephrine
})
setSurgicalStimulus(intensity)
setVentricularIrritability(intensity)
giveLipidEmulsionBolus()
startLipidEmulsionInfusion()
stopLipidEmulsionInfusion()
```

IV bolus input is mg/kg, not total mg. Infusion input is mg/kg/hour. Regional concentration is percent, volume is mL, and `epinephrine` must be boolean. Invalid inputs return `{ ok: false, reason }` without changing state. A changed clinical action starts a READY case, is marked `queued` while PAUSED, and is timestamped at the runner's fixed-step time. A no-op stop does not emit a false clinical event.

## Snapshot contract

`runner.snapshot()` exposes these Lidocaine primitives:

- exposure/mass: `lidocainePlasmaTotalMcgMl`, `lidocainePlasmaFreeMcgMl`, `lidocaineEffectSiteMcgMl`, `lidocaineCentralMg`, `lidocainePeripheralMg`, `lidocaineEliminatedMg`, `lidocaineCumulativeMg`, `lidocaineCumulativeMgKg`, `lidocaineClearanceFactor`;
- infusion: `lidocaineInfusionActive`, `lidocaineInfusionRateMgKgHour`;
- regional/stimulus: `regionalSensoryBlock`, `regionalMotorBlock`, `epiduralSympathectomyContribution`, `surgicalStimulusRaw`, `surgicalStimulusEffective`, `lidocaineSystemicAnalgesicContribution`;
- rhythm: `lidocaineAntiarrhythmicContribution`, `ventricularIrritabilityRaw`, `ventricularIrritabilityEffective`, `derivedRhythm`;
- LAST/rescue: `lidocaineCnsToxicity`, `lidocaineCardiacToxicity`, `lidocaineSeizureActive`, `lidocaineToxicityStage`, `lipidInfusionActive`, `lipidCumulativeMlKg`.

Copied arrays are `lidocaineRegionalHistory`, `lidocaineDoseHistory`, `lidocaineToxicityHistory`, and `lipidRescueHistory`. Mutating a returned snapshot/history cannot mutate engine truth. The debrief adds `lidocaineAttribution` with peak/current exposure, dose, route, toxicity, rescue, stimulation, irritability/rhythm, and TOF chronology.

## Event names

Runner action-log `meta.action` values are:

- `lidocaine_iv_bolus`;
- `lidocaine_infusion_started`, `lidocaine_infusion_rate_changed`, `lidocaine_infusion_stopped`;
- `regional_lidocaine_administered`, plus `lidocaine_dose_warning` when above the displayed recommendation;
- `surgical_stimulus_changed`, `ventricular_irritability_changed`;
- `lipid_emulsion_bolus`, `lipid_emulsion_infusion_started`, `lipid_emulsion_infusion_rate_doubled`, `lipid_emulsion_infusion_stopped`;
- `last_exposure_injected` for the administrative scenario path.

Internal copied history record types include `iv_bolus`, `infusion_started`, `infusion_rate_changed`, `infusion_stopped`, `regional_administered`, `toxicity_transition`, `ventricular_irritability_set`, `rhythm_transition`, `lipid_bolus`, `lipid_infusion_started`, `lipid_infusion_rate_doubled`, `lipid_infusion_stopped`, and `lipid_infusion_capped`.

## Operator-facing behavior

Before this work, the live console had no Lidocaine action, no regional block/stimulation relationship, and no concentration-derived LAST/lipid-rescue path. It now provides separate IV bolus and infusion controls, regional route/concentration/volume/epinephrine controls with a live mg and mg/kg preview, a visible maximum-dose warning, surgical-stimulus selection, exposure/toxicity readbacks, and 20% lipid rescue controls. A warning does not silently disable the action, allowing deterministic overdose teaching scenarios. The operator still cannot type or overwrite a displayed vital.

The same round also makes Sevoflurane, Desflurane, Isoflurane, Agent Off, and CHECK TOF visible scoreable actions, and structurally contains the systolic/diastolic display at narrow widths.

## Simplifications and exclusions

- Parameters represent one weight-scaled adult reference, not a population model; age, pregnancy, shock, acid-base state, liver blood flow, alpha-1-acid glycoprotein, and interacting drugs do not alter PK.
- `lidocaineClearanceFactor` is a manual future-scenario hook; active metabolites, renal metabolite accumulation, placental transfer, methemoglobinemia, allergy, chondrotoxicity, and site-specific tissue perfusion are out of scope.
- Route averages do not model injection plane, intercostal block, ultrasound guidance, aspiration, test dosing, inadvertent intravascular injection mechanics, dermatomal spread, or difficult/failed block.
- Epinephrine only slows absorption and prolongs the modeled depot; it has no separate HR/BP or ischemia effect.
- Regional records use greatest-block composition and generic coverage; bilateral/segmental anatomy is not represented.
- LAST staging is concentration-driven and deterministic. Real presentations vary and may skip prodromes.
- Lipid rescue models finite sequestration only. Clinical management still requires the full emergency pathway outside this model.
- Therapeutic IV Lidocaine can attenuate stimulation by at most 25%; it does not guarantee suppression of a laryngoscopy response or substitute for hypnosis or regional anesthesia.

## Calibration sources

- [DailyMed Lidocaine Hydrochloride Injection label](https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=9e049bbe-0f4d-988e-e053-2a95a90a3691&type=display): concentration conversion, absorption/site and vasoconstrictor dependence, protein binding, elimination half-life, adverse-effect anchor, and healthy-adult maximum-dose anchors.
- [Stable-isotope epidural Lidocaine PK study](https://pubmed.ncbi.nlm.nih.gov/3665324/): central/steady-state volume, clearance, distribution/terminal half-life, and dual epidural absorption anchors.
- [Human axillary-block PK study](https://pubmed.ncbi.nlm.nih.gov/18370545/): peripheral-block time-to-peak calibration band.
- [IV Lidocaine and laryngoscopy trial](https://pubmed.ncbi.nlm.nih.gov/7776527/) and [later controlled study](https://pmc.ncbi.nlm.nih.gov/articles/PMC8557037/): conflicting hemodynamic attenuation evidence, supporting a limited rather than guaranteed effect.
- [ASRA LAST checklist](https://asra.com/docs/default-source/guidelines-articles/local-anesthetic-systemic-toxicity-rgb.pdf?sfvrsn=33b348e_2): 20% lipid bolus, infusion, repeat/escalation, and cumulative-cap anchors.
- [FDA antiarrhythmic Lidocaine label](https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/019830s027lbl.pdf): systemic infusion range and unit conversion used by the console.
