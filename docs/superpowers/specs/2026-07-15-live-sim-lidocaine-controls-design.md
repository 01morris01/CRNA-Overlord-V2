# Live Simulation Lidocaine and Clinical Controls Design

Status: approved for implementation
Date: 2026-07-15
Branch: `feature/live-sim-lidocaine-controls`
Base: `d917b7e` (`feature/engine-airway-gaps`)

## Objective

Repair the live patient-monitor NIBP presentation, make volatile anesthetics and quantitative neuromuscular assessment obvious clinical actions, and add one deterministic Lidocaine model shared by systemic dosing, regional anesthesia, surgical-stimulation attenuation, local-anesthetic systemic toxicity (LAST), and lipid rescue.

This is a two-stage delivery on one branch:

1. clinical-control and monitor repair;
2. Lidocaine systemic/regional PK/PD and toxicity.

The stages remain separately testable and separately committed even though they share one final branch.

## Current-state diagnosis

The deployed/default branch and the feature lineage are not equivalent:

- `origin/main` still contains the former six-card monitor grid and viewport-scaled NIBP typography;
- the current feature lineage contains the weighted four-card layout and responsive rows, but it has not been merged or deployed;
- Sevoflurane, Desflurane, and Isoflurane are supported by `VentilatorSystem`, but their controls are buried near the bottom of the full machine form;
- TOF count and ratio are continuously derived and displayed, but there is no discrete assessment action;
- Lidocaine is absent from `DrugSystem`, `SimRunner`, the snapshot, and the live console;
- LAST is currently an administratively injected complication driven by independent severity fields rather than an actual local-anesthetic exposure.

The new work must fix both the code and its delivery path. A pushed feature branch alone does not change the default/deployed application.

## Non-negotiable boundaries

1. No public API writes HR, BP, BIS, rhythm, seizure state, or another derived clinical output.
2. All actions set exposure, procedure state, or an explicit external driver. Physiology derives the consequences.
3. Lidocaine has one systemic exposure state across IV, infiltration, peripheral block, and epidural dosing.
4. LAST reads that shared exposure. There is no second toxicity model for regional dosing.
5. Existing NMB state and its sole TOF-ratio integrator remain unchanged.
6. CHECK TOF reads the existing NMB state and cannot alter it.
7. Existing airway-device, respiratory-drive, NMB, PPV, and timed-intubation axes remain orthogonal.
8. The Lidocaine system consumes no RNG. Unused new actions cannot move an existing random sequence.
9. New arithmetic inside the engine uses the existing float32 helpers and fixed timestep.
10. Frozen non-Lidocaine fixtures are not regenerated or weakened.
11. Existing Isoflurane support is retained even though Sevoflurane and Desflurane receive the requested prominent controls.

## Architecture

Add an RNG-free `LidocaineSystem` to the physical rig:

```text
Instructor UI
  -> SimRunner public action
    -> LidocaineSystem
       |- IV central/peripheral compartments
       |- systemic effect site
       |- regional absorption depots
       |- route-local sensory/motor block
       |- cumulative exposure and dose limits
       `- lipid binding/rescue state
    -> PatientPhysiology inputs
       |- systemic analgesic contribution
       |- ventricular-irritability suppression
       |- effective surgical stimulation
       |- epidural sympathectomy contribution
       |- CNS toxicity contribution
       `- cardiac toxicity contribution
    -> existing derived-vital update
```

`buildPhysRig()` exposes the additive system as `l` while preserving all existing rig keys. `SimulationCore` ticks Lidocaine before the patient consumes the resulting inputs. Scenario code receives the same instance for administrative LAST setup and debrief attribution.

`DrugSystem` remains responsible for its existing general-anesthesia drugs and reversal agents. It does not gain regional depots or a parallel toxicity pathway.

### Public runner boundary

The live controller uses only these new wrapper methods:

```js
setVolatile({ agent, dialPercent })
checkTrainOfFour()

giveLidocaineBolus({ doseMgPerKg: 1.5 })
startLidocaineInfusion({ rateMgPerKgHour })
stopLidocaineInfusion()
administerRegionalLidocaine({
  route,                    // "infiltration" | "peripheral" | "epidural"
  concentrationPercent,
  volumeMl,
  epinephrine,
})
setSurgicalStimulus(intensity) // finite 0..1
setVentricularIrritability(intensity) // scenario/admin driver, finite 0..1

giveLipidEmulsionBolus()
startLipidEmulsionInfusion()
stopLipidEmulsionInfusion()
```

All accepted actions create fixed-step timestamped runner events. Rejected actions return a reason and do not change state.

## Evidence sources and calibration policy

The model is an educational, deterministic approximation. Numeric anchors come from primary or authoritative sources; route-average and cross-patient simplifications are labeled below.

1. The current US Lidocaine injection label states that parenteral Lidocaine is completely absorbed, absorption varies with site and vasoconstrictor use, intercostal block produces the highest non-intravascular blood levels, and subcutaneous administration produces the lowest. It gives an IV elimination half-life of 1.5 to 2 hours, reports 60% to 80% protein binding over 1 to 4 micrograms/mL, and notes increasingly apparent objective adverse effects above approximately 6 micrograms/mL. It limits healthy adults to 4.5 mg/kg and generally 300 mg without epinephrine, or 7 mg/kg and generally 500 mg with epinephrine.
   - <https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=9e049bbe-0f4d-988e-e053-2a95a90a3691&type=display>
2. Stable-isotope epidural data support a two-compartment systemic disposition with mean central volume 43 L, steady-state volume 99 L, clearance 0.95 L/min, distribution half-life 12 minutes, terminal half-life 100 minutes, and dual epidural absorption half-lives of 9.3 and 82 minutes with reported fast/slow fractions 0.38 and 0.58.
   - <https://pubmed.ncbi.nlm.nih.gov/3665324/>
3. Human axillary-block data report slower systemic appearance, including mean time to peak of approximately 2.3 hours in that study. This is used as a peripheral-block calibration band, not as a universal value for every nerve and site.
   - <https://pubmed.ncbi.nlm.nih.gov/18370545/>
4. Controlled trials conflict on whether IV Lidocaine 1.5 mg/kg reliably attenuates the laryngoscopy HR/BP response. The model therefore does not grant a guaranteed or complete intubation-response block.
   - <https://pubmed.ncbi.nlm.nih.gov/7776527/>
   - <https://pmc.ncbi.nlm.nih.gov/articles/PMC8557037/>
5. Lipid rescue dosing and action sequencing follow the ASRA LAST checklist.
   - <https://asra.com/docs/default-source/guidelines-articles/local-anesthetic-systemic-toxicity-rgb.pdf?sfvrsn=33b348e_2>
6. The FDA-labeled systemic antiarrhythmic infusion range is 20 to 50 micrograms/kg/min, equivalent to 1.2 to 3 mg/kg/hour. The live control uses mg/kg/hour and displays the conversion rather than mixing units silently.
   - <https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/019830s027lbl.pdf>

## Systemic Lidocaine PK

### Reference two-compartment model

For a 70 kg reference adult:

- central volume `Vc = 43 L`;
- peripheral volume `Vp = 56 L`, so `Vss = 99 L`;
- elimination clearance `Cl = 0.95 L/min`;
- intercompartmental clearance `Q = 1.0 L/min`.

Those constants produce distribution and terminal behavior near the published 12- and 100-minute anchors while retaining the published volumes and systemic clearance. Volumes scale linearly with `weightKg / 70`; clearance and intercompartmental clearance scale with `(weightKg / 70)^0.75`.

An explicit `lidocaineClearanceFactor`, default `1`, multiplies clearance and is independently queryable. It permits future liver-flow/liver-disease scenarios without changing the standard patient. Renal metabolite accumulation and active-metabolite PK remain out of scope.

IV bolus mass enters the central compartment. IV infusion adds `rateMgPerKgHour * weightKg / 60` mg/min to the central compartment. Starting an infusion while one is active updates the existing rate and logs `lidocaine_infusion_rate_changed`; it does not create a second infusion.

### Protein binding and effect site

The snapshot reports total plasma, estimated free plasma, and effect-site concentrations in micrograms/mL.

The binding approximation is deterministic and concentration dependent:

- 80% bound at or below 1 microgram/mL;
- linearly falling to 60% bound at 4 micrograms/mL;
- continuing to a 40% floor by 7 micrograms/mL.

This matches the label's direction and therapeutic-range anchors but does not model alpha-1-acid glycoprotein as a patient-specific laboratory value.

The effect site equilibrates toward free central concentration with a two-minute half-time. This is an explicit response-delay simplification rather than a claim of a universal human `ke0`.

## Regional depots and local block

Each regional administration creates a copied, immutable-on-read record containing:

- route;
- concentration percent;
- volume in mL;
- total dose in mg;
- dose in mg/kg;
- epinephrine presence;
- fixed-step start/end times;
- remaining depot mass;
- absorbed systemic mass;
- sensory and motor block values;
- peak block and time to peak;
- systemic Cmax and time to Cmax;
- dose-limit classification.

Total dose is derived as:

```text
doseMg = concentrationPercent * 10 mg/mL * volumeMl
```

### Route-average absorption

- `epidural`: two parallel first-order depots. Reported fractions `0.38` and `0.58` are normalized to sum to one, with half-lives 9.3 and 82 minutes.
- `peripheral`: one first-order depot calibrated so the 70 kg reference case peaks within `2.3 +/- 0.5 hours` at the tested evidence dose.
- `infiltration`: one slower depot with a 120-minute absorption half-life and a lower Cmax than the matched peripheral and epidural cases.
- `epinephrine: true`: multiplies all route absorption rate constants by `0.5` and prolongs the local depot effect. This fixed multiplier is a labeled simplification of variable vasoconstrictor effects.

Mass balance must close at every sampled tick within float32 tolerance:

```text
administered mass
= central + peripheral + unabsorbed depots + eliminated + lipid-bound mass
```

### Local pharmacodynamics

Local sensory and motor block consume local depot mass/concentration, not systemic plasma concentration. Route-specific first-order onset/recovery states produce `0..1` values:

- infiltration: fast focal sensory onset, minimal motor block;
- peripheral: sensory and motor block;
- epidural: sensory, motor, and sympathectomy contributions.

Concentration and total dose affect onset, depth, and duration. Tests assert ordered and directional behavior rather than pretending one generic block represents every anatomical site.

The regional model does not simulate individual nerves, dermatomes, ultrasound images, needle placement, intraneural injection, or stochastic block failure. A successful accepted action represents correctly deposited drug at a generic surgical field.

## Surgical stimulation

`setSurgicalStimulus(intensity)` controls one explicit external input from `0` to `1`. It never writes a vital.

The patient derives:

```text
effectiveStimulus
= rawStimulus
 * (1 - regionalSensoryBlock * genericCoverage)
 * (1 - 0.25 * systemicAnalgesicContribution)
```

Generic coverage is `1` for infiltration and peripheral block and `0.9` for epidural block. Multiple active regional records compose by the greatest effective sensory coverage, not by summing beyond one.

Unblocked full stimulation can contribute up to `+35 bpm` to the hemodynamic target and a `1.25` SVR multiplier. These are explicit simulator calibration constants. The existing hemodynamic integrator, not the action API, determines the observed HR/BP trajectory.

Therapeutic systemic Lidocaine can reduce the stimulus contribution by at most 25%. It cannot substitute for hypnotic depth or a functioning regional block and does not guarantee abolition of the laryngoscopy response.

Epidural sympathectomy is a separate graded driver capped at a 20% SVR reduction at full modeled block. It composes with surgical stimulation and existing complications without overwriting them.

## Antiarrhythmic pharmacodynamics

Lidocaine exposes a queryable `lidocaineAntiarrhythmicContribution` derived from effect-site concentration. It rises through the therapeutic concentration band, peaks without exceeding one, and falls as cardiac-toxicity concentration is approached. Toxic Lidocaine therefore cannot become increasingly antiarrhythmic without limit.

`setVentricularIrritability(intensity)` is an explicit scenario/administrative driver from `0` to `1`. Effective irritability is:

```text
effectiveVentricularIrritability
= rawVentricularIrritability
 * (1 - lidocaineAntiarrhythmicContribution)
```

The derived rhythm path distinguishes sinus rhythm, ventricular ectopy, and ventricular tachycardia. It is deterministic and consumes no RNG. Therapeutic Lidocaine can suppress ectopy/VT tendency while excessive exposure independently produces conduction and contractility depression.

Lidocaine does not directly cardiovert ventricular fibrillation or pulseless VT. The existing `VentricularFibrillation` complication remains a cardiac-arrest state requiring the appropriate resuscitation pathway; Lidocaine may reduce post-conversion recurrence only when a future or existing scenario explicitly supplies that state. This prevents an antiarrhythmic concentration from writing a normal rhythm or vital directly.

## LAST and lipid rescue

LAST is derived from the shared total/free plasma and effect-site concentrations.

The deterministic educational staging is:

- below 5 micrograms/mL total plasma: no toxicity contribution;
- 5 to 8: graded warning state (perioral symptoms/tinnitus/metallic taste proxy);
- 8 to 12: increasing CNS excitation with deterministic seizure onset at sustained severe exposure;
- above 10: increasing cardiac conduction/contractility depression;
- sufficiently sustained severe cardiac toxicity: cardiovascular collapse through physiologic drivers.

These bands are simulation thresholds, not bedside diagnostic cutoffs. The label's approximately 6 micrograms/mL adverse-effect anchor and the known variability of LAST are stated in the debrief.

Toxicity exposes drivers to PatientPhysiology. It does not assign HR, BP, BIS, or arrest values directly. Existing sedative concentration may suppress visible seizure activity but does not remove the Lidocaine exposure or cardiac toxicity.

The existing `LocalAnestheticToxicity` instructor complication becomes an administrative exposure path. It seeds the shared central Lidocaine state to a documented toxic target and logs `last_exposure_injected`; it does not create separate `_lastCnsTox` or `_lastCardiacTox` truth.

Lipid rescue uses one shared rescue state:

- bolus: approximately 1.5 mL/kg of 20% lipid over the modeled two-to-three-minute interval;
- infusion: approximately 0.25 mL/kg/min;
- repeat bolus and doubled infusion remain available while unstable;
- cumulative lipid is capped at 12 mL/kg.

Lipid creates a finite binding/sink contribution that reduces free active Lidocaine and therefore toxicity through the same concentration-to-effect path. It never directly restores a vital. The binding-capacity constant is calibrated to demonstrate clinically meaningful recovery at checklist dosing and is labeled as a lipid-sink simplification.

## Quantitative TOF assessment

`checkTrainOfFour()` creates a discrete `tof_checked` event and returns a copied record:

```js
{
  tSec,
  count,
  ratio,
  effectiveNmbBlockade,
  nmbSource,
  airwayDevice,
}
```

The snapshot exposes `lastTofCheck`, `tofCheckCount`, and `tofCheckHistory`. Count and ratio are sampled from the existing NMB state. The check creates no new paralysis variable, recovery timer, or TOF integrator.

## Volatile controls

`setVolatile({ agent, dialPercent })` validates:

- `agent` is `Sevoflurane`, `Desflurane`, or `Isoflurane` when dial is above zero;
- `dialPercent` is finite and within the supported machine range;
- `Agent Off` sets the dial to zero while retaining the last selected valid agent for later reuse.

The action logs `volatile_changed` with agent, dial, current airway, and simulation timestamp. Gas exchange and anesthetic depth continue to derive through `VentilatorSystem` and `PatientPhysiology`.

## Live UI

### NIBP containment

The display value becomes separate systolic, separator, and diastolic children under one accessible NIBP value. The NIBP card establishes an inline-size container and sizes its value using container-relative units rather than viewport-relative units.

The complete value must fit without horizontal scrolling for two- and three-digit systolic/diastolic values at viewport widths 320, 480, 600, 768, 1280, and 1440 pixels. The instructor's compact BP tile receives the same `min-width: 0`, no-wrap, and container-fit treatment.

The renderer sets systolic and diastolic nodes independently and updates the combined accessible label. No visual code changes the snapshot values.

### Volatile panel

A dedicated panel appears before the general machine form with prominent Sevoflurane, Desflurane, Isoflurane, and Agent Off choices, a visible dial, APPLY, and current dial/end-tidal/MAC readouts. Isoflurane is retained to avoid removing existing behavior.

Vaporizer fields are removed from the large machine form so there is one control source. Snapshot rendering keeps the panel synchronized with the engine.

### TOF action

A visible CHECK TOF button appears with last checked count/ratio/time. The continuously rendered monitor may still show current quantitative values, but only `tof_checked` is scoreable evidence of an assessment action.

### Lidocaine and stimulus panels

The Lidocaine panel provides:

- IV 1.5 mg/kg bolus;
- infusion rate in mg/kg/hour with START/UPDATE and STOP;
- route (`infiltration`, `peripheral`, `epidural`);
- concentration percent;
- volume in mL;
- epinephrine toggle;
- computed total mg, mg/kg, and current rolling cumulative exposure;
- route-appropriate maximum-dose warning;
- administration action;
- live total/free/effect-site level, block state, and toxicity status.

Warnings do not prevent a deliberate overdose exercise. Invalid numeric inputs do.

A Surgical Stimulus panel provides a `0..1` control, explicit APPLY/OFF actions, and current raw/effective stimulus values.

The Rescue panel exposes 20% lipid bolus, infusion start/update, and stop actions with cumulative mL/kg.

All controls are keyboard accessible, have visible labels and units, and meet the existing 44-pixel target minimum.

## Snapshot and debrief additions

New primitives include:

- `lidocainePlasmaTotalMcgMl`;
- `lidocainePlasmaFreeMcgMl`;
- `lidocaineEffectSiteMcgMl`;
- `lidocaineCentralMg`;
- `lidocainePeripheralMg`;
- `lidocaineEliminatedMg`;
- `lidocaineCumulativeMg`;
- `lidocaineCumulativeMgKg`;
- `lidocaineInfusionActive`;
- `lidocaineInfusionRateMgKgHour`;
- `lidocaineClearanceFactor`;
- `regionalSensoryBlock`;
- `regionalMotorBlock`;
- `epiduralSympathectomyContribution`;
- `surgicalStimulusRaw`;
- `surgicalStimulusEffective`;
- `lidocaineSystemicAnalgesicContribution`;
- `lidocaineAntiarrhythmicContribution`;
- `ventricularIrritabilityRaw`;
- `ventricularIrritabilityEffective`;
- `derivedRhythm`;
- `lidocaineCnsToxicity`;
- `lidocaineCardiacToxicity`;
- `lidocaineSeizureActive`;
- `lidocaineToxicityStage`;
- `lipidInfusionActive`;
- `lipidCumulativeMlKg`;
- `lastTofCheck`;
- `tofCheckCount`.

Copied arrays include:

- `lidocaineRegionalHistory`;
- `lidocaineDoseHistory`;
- `lidocaineToxicityHistory`;
- `lipidRescueHistory`;
- `tofCheckHistory`.

The debrief reports dose chronology, route and dose-limit classification, block effectiveness during stimulation, peak systemic concentration, toxicity stage transitions, rescue chronology, and quantitative TOF checks.
When ventricular irritability is used, it also reports pre/post-treatment irritability and rhythm-state chronology.

## Validation and error behavior

- Reject non-finite or negative doses/rates and zero/negative regional concentration or volume.
- Reject unknown routes and volatile agents.
- Clamp surgical stimulus only after validating a finite input; out-of-range values are rejected rather than silently changed.
- A second infusion start updates the one infusion and logs a rate-change event.
- Stopping an inactive infusion returns unchanged state and does not create a false clinical event.
- Regional dosing above the recommended maximum is accepted with `doseLimitStatus: "exceeded"` and an explicit warning event.
- Histories and current-record objects returned from snapshots are copies.
- Administrative injected LAST is distinguishable from dose-produced LAST.
- All state-changing events use fixed-step simulation timestamps, not wall-clock timestamps.

## Required evidence

### Stage 1: monitor and controls

1. NIBP systolic and diastolic bounding boxes remain inside the card at 320, 480, 600, 768, 1280, and 1440 pixel widths for `120/80`, `80/40`, and `260/160`.
2. The full page and waveform canvases have no horizontal overflow at those widths.
3. Sevoflurane, Desflurane, Isoflurane, Agent Off, Lidocaine, and CHECK TOF controls are visible and keyboard reachable.
4. Sevoflurane and Desflurane actions change the supported agent/dial inputs and produce derived end-tidal agent/MAC over simulation time.
5. CHECK TOF logs the exact current count/ratio and leaves the complete NMB fingerprint unchanged.

### Stage 2: Lidocaine

6. A 70 kg IV bolus and infusion produce reference two-compartment concentration curves and the expected terminal half-life band.
7. Central/peripheral/depot/eliminated/lipid-bound mass balance closes within float32 tolerance.
8. Matched epidural, peripheral, and infiltration cases demonstrate the documented route ordering. Peripheral time to peak falls within `2.3 +/- 0.5 hours` for the calibration case.
9. Epidural output visibly contains fast and slow absorption phases.
10. Epinephrine delays and lowers the matched regional Cmax while prolonging local block.
11. A therapeutic IV bolus remains below the LAST warning stage.
12. An effective regional block measurably attenuates the same standardized surgical stimulus that raises HR/BP without a block.
13. Epidural block produces graded sympathectomy without using the high-spinal complication variable.
14. Excessive cumulative dose and administrative toxic exposure both traverse the shared ordered warning/CNS/cardiac pathway.
15. Sedation can suppress visible seizure activity without erasing systemic or cardiac toxicity.
16. Checklist-dose lipid rescue lowers free active concentration and permits derived hemodynamic recovery; inadequate rescue does not.
17. Therapeutic effect-site concentration suppresses an imposed ventricular ectopy/VT tendency, while a matched no-Lidocaine run does not; neither therapeutic nor toxic Lidocaine directly converts VF to sinus rhythm.
18. Dose and toxicity histories contain fixed-step timestamps and appear in debrief output.
19. Two combined runs sampled mid-regional absorption, mid-stimulation, mid-arrhythmia suppression, mid-toxicity, and mid-lipid rescue have identical float32 fingerprints.

### Regression

20. Exact snapshot-contract accounting is updated for every primitive, object, nullable field, and array.
21. The full induction-to-emergence smoke case remains green.
22. All existing airway, PPV, failed-intubation, NMB, reversal, respiratory-drive, waveform, PWA, and app-integration tests remain green.
23. Every frozen non-Lidocaine parity assertion remains green without fixture regeneration.
24. A no-Lidocaine combined run retains the prior deterministic fingerprint, proving the new subsystem consumes no RNG and is inert when unused.

## Delivery and cache behavior

The service-worker cache version must change and must list any new runtime modules. PWA contract tests must prove that the updated display CSS, live controller, model, runner, and Lidocaine module are cached.

Implementation completion means:

- stage-specific commits exist on `feature/live-sim-lidocaine-controls`;
- the full verification matrix is green;
- the branch status and commit are reported;
- no push, merge, PR, or deployment is performed without explicit authorization;
- the final report states that users will continue to see the old main-branch layout until the completed branch is integrated and deployed.

## Explicit simplifications and exclusions

- Educational simulation only; not a clinical dosing tool.
- Route-average absorption cannot predict one individual patient's concentration.
- The effect-site half-time and epinephrine absorption multiplier are calibration simplifications.
- No active Lidocaine-metabolite PK, alpha-1-acid-glycoprotein laboratory state, pregnancy/placental model, or renal-metabolite toxicity.
- No individual nerve anatomy, dermatome map, ultrasound/needle placement, intraneural injection, hematoma, infection, or stochastic failed block.
- No IV regional/Bier block in this round.
- No bupivacaine, ropivacaine, or multi-local-anesthetic mixture PK in this round.
- No claim that IV Lidocaine reliably prevents the laryngoscopy hemodynamic response.
- Lipid rescue uses a finite binding/sink approximation rather than a complete mechanistic lipid-shuttle model.
- The generic surgical stimulus is an externally imposed teaching driver, not a nociception monitor.
