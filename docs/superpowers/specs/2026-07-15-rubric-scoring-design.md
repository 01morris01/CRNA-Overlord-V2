# Carson-Newman Rubric Scoring, Scenarios, and Debrief Design

Status: approved for implementation, pending written-spec review
Date: 2026-07-15
Branch: `feature/rubric-scoring`
Base: `281e2a2` (merged Round 2)

## Objective

Add literal Carson-Newman clinical rubric scoring to the verified anesthesia simulator without replacing the existing scenario scorer or weakening the engine truth boundary. The round delivers:

1. exact JSON encodings of the three supplied rubrics;
2. a deterministic rubric-scoring session driven by real actions and fixed-step physiology;
3. four rubric-linked clinical scenarios;
4. live instructor scoring and rubric-named violation flags;
5. a rubric-format debrief appended to the existing `SimulationResult` contract;
6. a printable paper-like rubric view; and
7. an instructor-only TOF-depth control that changes the existing rocuronium PK state rather than writing a derived TOF value.

The educational-use fence remains visible and non-dismissible. This feature is not a clinical examination system of record.

## Source audit

The following supplied PDFs were rendered and visually inspected in addition to text extraction:

| Source | SHA-256 | Source count | Computed maximum | Critical count |
|---|---|---:|---:|---:|
| `Carson-Newman_Anesthesia_Emergence_Rubric.pdf` | `c0745b7244f2120d4f509545f5dc26120800f0469208e736c3147119969e3fcf` | 9 items | 18 | 5 |
| `Carson-Newman_Standard_IV_Induction_Rubric.pdf` | `453455c5be47ff3e00cc13da1106ea8738501073302e3f1b6a846f786b2a91a7` | 14 items | 28 | 10 |
| `Carson-Newman_RSI_Induction_Rubric.pdf` | `36a48cb37f9d85333357d583981048da615ec314611dee29a9a8eea6efb14de0` | 53 scored rows | 106 | 27 |

The RSI form contains 42 numbered rows and 11 separately scored sub-rows under items 3, 10, and 27. This agrees with its footnote, "27 of 53 scored items," but conflicts with the header denominator `/49`. The JSON will preserve all 53 scored rows, compute 106 maximum points, retain `49` as `sourceHeaderDenominator`, and expose a machine-readable discrepancy warning. The implementation will not guess a correction.

## Non-negotiable boundaries

1. The rubrics are the scoring model. No replacement taxonomy, scale, weighting, or pass rule is introduced.
2. Every encoded item uses exactly `2` for performed, `1` for partial, and `0` for not performed.
3. Pass requires both a score of at least 85 percent and every critical item scored `2`.
4. A critical item scored `1` or `0` prevents a pass regardless of percentage.
5. `ENGINE_OBSERVABLE`, `INSTRUCTOR_OBSERVED`, and `UNSCOREABLE` are the only source tags.
6. An item is engine-observable only when its complete auto-score can be derived from named real events and snapshot values.
7. A composite row containing an invisible physical or verbal requirement is instructor-observed even when the engine can display supporting evidence for part of the row.
8. Instructor-observed items remain pending until the instructor selects 2, 1, or 0. Pending is not silently converted to zero.
9. A final PASS/NOT PASS result cannot be issued while an instructor-observed item is pending.
10. No action or scorer writes HR, BP, SpO2, EtCO2, TOF count, TOF ratio, ventilation, or another derived output.
11. Rubric code consumes no RNG and never changes engine tick order.
12. The single existing NMB state remains authoritative for TOF, respiratory muscle capability, and reversal.
13. Administrative setup actions are visibly distinguished and cannot satisfy student-action criteria.
14. The legacy `ScenarioScoring` behavior and frozen evidence remain intact.

## Architecture decision

Three approaches were considered:

1. Extend `ScenarioScoring`. Rejected because its expected/dangerous-action model is not the rubric's 2/1/0, source-aware scoring model.
2. Score only in the browser view. Rejected because animation-frame sampling is not deterministic and would duplicate scoring logic outside the engine-facing runner.
3. Add a parallel `RubricScoringSession`. Selected because it preserves legacy scoring, operates on a deterministic event/trace boundary, and can be reused by live UI, scenario evidence tests, and debrief generation.

The selected flow is:

```text
literal rubric JSON + rubric-linked scenario JSON
  -> RubricScoringSession
       |- canonical student action ledger
       |- fixed one-second physiologic trace
       |- instructor 2/1/0 decisions
       |- engine item evaluators
       |- rubric-named violations
       `- final pass-rule evaluator
  -> live rubric presentation
  -> SimulationResult.rubricResult
  -> printable rubric and action/physiology timeline
```

`ScenarioScoring` continues to calculate legacy expected/dangerous action points. Its score does not determine a rubric result. Rubric-linked scenarios present the rubric outcome as the authoritative educational result.

## Literal rubric JSON

Files live under `data/rubrics/`:

- `carson-newman-anesthesia-emergence.json`
- `carson-newman-standard-iv-induction.json`
- `carson-newman-rsi-induction.json`

Each top-level object contains:

```js
{
  id,
  title,
  course,
  sourceFile,
  sourceSha256,
  sourceHeaderDenominator,
  sourceFootnoteScoredItems,
  computedItemCount,
  computedMaxPoints,
  discrepancies,
  pointScale: { performed: 2, partial: 1, notPerformed: 0 },
  passRule: { minimumPercent: 85, requireEveryCriticalPerformed: true },
  items,
}
```

Every item contains:

```js
{
  id,
  displayNumber,
  text,
  pointScale: { performed: 2, partial: 1, notPerformed: 0 },
  critical,
  scoringSource,
  engineEvidence: null | {
    snapshotKeys,
    actionLogEntries,
    ruleId,
  },
}
```

`text` preserves the complete source cell, including a Standard IV item's explanatory line. The critical asterisk is encoded in `critical`, not appended to the text. RSI parent rows and indented sub-rows remain separate scored items because that is the only encoding consistent with the source footnote's 53-item count.

Schema validation rejects unknown source tags, point values, duplicate IDs, incorrect computed counts, mismatched critical counts, and engine-observable items without named evidence.

## Scoring-source classification

The approved strict classification is 21 engine-observable, 55 instructor-observed, and zero unscoreable items.

### Anesthesia Emergence

Engine-observable:

- 2. Discontinue volatile anesthetics and decrease any continuous infusions (e.g., propofol).
- 3. Confirm adequate train-of-four (TOF) ratio and reverse neuromuscular blockade if necessary.
- 4. Ensure the patient has resumed spontaneous ventilation and that rate and tidal volumes are adequate.

Instructor-observed:

- 1, 5, 6, 7, 8, and 9.

Item 7 remains instructor-observed because the engine cannot see eye opening, command following, protective airway reflexes, or the clinician's deep-extubation judgment. The engine still displays extubation timing, anesthetic depth, TOF, respiratory state, and subsequent physiology as supporting evidence.

### Standard IV Induction

Engine-observable:

- 7. Confirm ability to mask-ventilate before the neuromuscular blocking agent.

Instructor-observed:

- 1-6 and 8-14.

The classification is intentionally strict:

- item 5 includes physical positioning;
- item 6 includes verbalization;
- item 8 includes verbalization and a conscious re-assessment;
- items 9-11 include physical airway technique;
- item 12 includes chest-rise and auscultation findings;
- item 13 includes physically securing the ETT; and
- item 14 includes verbalized readiness and overall judgment.

Engine evidence remains visible beside these rows and supports the required safety flags, but it does not replace the instructor's score.

### Rapid Sequence Induction

Engine-observable:

- 7. Pre-oxygenate at 100% FiO2 for 3 minutes at normal tidal breaths.
- 9. Apply cricoid pressure as appropriate.
- 10a. Select appropriate medications.
- 10c. Administer the medications in the appropriate sequence.
- 11. Do not mask ventilate prior to first laryngoscopy.
- 26. Confirm placement by continuous EtCO2 waveform with ventilation.
- 28. If unable to intubate, perform positive pressure mask ventilation with cricoid pressure.
- 29. Remove cricoid pressure after endotracheal tube placement confirmed.
- 30. Turn on the inhaled anesthetic.
- 32. Set ventilator mode appropriate for the patient.
- 33. Set tidal volume.
- 34. Set the respiratory rate.
- 35. Adjust the fresh gas flow rate.
- 36. Set the FiO2.
- 37. Turn on the ventilator from bag to ventilator mode.
- 41. Appropriate intervention if unable to intubate.
- 42. Completion of intubation in fewer than 3 attempts.

Instructor-observed:

- 1, 2, 3, all four item-3 sub-rows, 4, 5, 6, 8, parent item 10, item 10's dose-verbalization sub-row, 12-25, parent item 27, all four item-27 sub-rows, 31, and 38-40.

Cricoid pressure is engine-observable in this simulator because Round 2 added an explicit fixed-step action and history. This differs from a physical-world sensor claim; the debrief labels it as a recorded simulator maneuver.

## Deterministic evidence boundary

### Canonical action ledger

All scoreable live actions produce entries with:

```js
{
  tSec,
  action,
  meta,
  snapshot,
}
```

`snapshot` is a compact copied state immediately after the action. Existing runner events are normalized rather than replaced. Required canonical entries include:

- `preoxygenate`
- `drug`
- `tof_checked`
- `spontaneous_ventilation_assessed`
- `confirm_etco2`
- `cricoid_pressure_applied`
- `cricoid_pressure_released`
- `mask_ppv_started`
- `mask_ppv_completed`
- `intubation_attempt_started`
- `intubation_attempt_failed`
- `intubation_attempt_succeeded`
- `extubate`
- `volatile_changed`
- `machine_settings_changed`
- `vent_mode_changed`
- `instructor_rubric_score_set`
- `instructor_nmb_depth_set`

The runner's existing event log remains available to the UI. The rubric ledger is a normalized deterministic projection used for scoring and export.

### Fixed trace

The session records a compact trace at exact one-second simulation-time boundaries derived from fixed 0.02-second ticks, never from `requestAnimationFrame`. It also records action-time snapshots. Trace fields are:

- `t`, `hr`, `sbp`, `dbp`, `map`, `spo2`, `rr`, `etco2`, `eto2`, `bis`, and `mac`;
- `tof`, `tofRatio`, `effectiveNmbBlockade`, and `respiratoryMuscleCapability`;
- `airwayDevice`, `capnogramPresent`, `cricoidPressureActive`, and `intubationAttemptCount`;
- `spontaneousRR`, `spontaneousTV`, `spontaneousMV`, `mechanicalMV`, and `effectiveMV`;
- `ventMode`, `ventSetTV`, `ventSetRR`, `ventSetPeep`, new `ventSetFiO2`, `o2Flow`, `airFlow`, and `n2oFlow`;
- `vaporizer`, `vaporizerAgent`, and active anesthetic infusion identities/rates.

Sampling copies values and consumes no RNG. A fingerprint test samples mid-PPV, mid-intubation attempt, during preoxygenation, at a drug action, and during residual-block recovery.

## Engine scoring rules

Every rule returns pending during the run until enough evidence exists. At finalization it returns 2, 1, or 0 with the exact evidence used.

### Emergence

`emergence_stop_anesthetic`

- Evidence: `vaporizer`, `vaporizerAgent`, active anesthetic infusions; `volatile_changed` and infusion-change entries.
- 2: the previously active volatile is off and every active tracked continuous anesthetic infusion is stopped or decreased before extubation/end.
- 1: anesthetic delivery was decreased but at least one applicable source remains active.
- 0: no applicable reduction occurred.
- The residual-block scenario uses volatile maintenance and no propofol infusion because the live UI does not yet expose a general propofol infusion control.

`emergence_tof_and_reversal`

- Evidence: `tofRatio`, `effectiveNmbBlockade`, `airwayDevice`; `tof_checked`, reversal `drug`, and `extubate`.
- 2: a discrete pre-extubation TOF check records ratio at least 0.90; if an earlier check was below 0.90, reversal is followed by a qualifying repeat check.
- 1: TOF was checked or reversal was attempted, but adequate recovery was not confirmed.
- 0: no TOF assessment/reversal evidence exists before extubation/end.

`emergence_spontaneous_ventilation`

- Evidence: `spontaneousRR`, `spontaneousTV`, `spontaneousMV`, and `respiratoryMuscleCapability`; `spontaneous_ventilation_assessed` and `extubate`.
- The scenario declares its adequacy thresholds. The initial adult scenario uses RR at least 8/min, tidal volume at least 5 mL/kg, and spontaneous minute ventilation at least 4 L/min.
- 2: a discrete assessment before extubation meets every threshold.
- 1: an assessment meets some but not all thresholds.
- 0: no assessment occurs or no threshold is met.

### Standard IV

`standard_mask_ventilation_before_nmb`

- Evidence: `airwayDevice`, `mechanicalMV`, `effectiveMV`, and PPV history; `mask_ppv_started`, `mask_ppv_completed`, and NMB `drug`.
- 2: adequate mask PPV begins in mask state before the first rocuronium/succinylcholine action and carries positive delivered minute ventilation.
- 1: PPV is demonstrated only after the NMB action but before laryngoscopy.
- 0: no adequate PPV is demonstrated before the NMB action.

### RSI

`rsi_preoxygenation`

- Evidence: `fio2`, `eto2`, `airwayDevice`, `spontaneousRR`, and `spontaneousTV`; `preoxygenate` and induction `drug`.
- 2: FiO2 at least 0.99 is sustained for at least 180 seconds during spontaneous tidal breathing before the first induction agent.
- 1: preoxygenation occurs but is shorter than 180 seconds or is interrupted.
- 0: no qualifying interval occurs before induction.

`rsi_cricoid_applied`

- Evidence: `cricoidPressureActive` and history; `cricoid_pressure_applied`.
- 2: cricoid is applied after induction begins and before first laryngoscopy.
- 1: cricoid is applied but late.
- 0: no application is recorded.

`rsi_medication_selection`

- Evidence: scenario accepted-drug classes; `drug` name and total dose.
- 2: required induction and NMB classes use scenario-accepted medications.
- 1: one required class is acceptable and another is absent or not accepted.
- 0: neither required class is satisfied.

`rsi_medication_sequence`

- Evidence: `drug` and `intubation_attempt_started`.
- 2: accepted induction agent precedes NMB, which precedes first laryngoscopy.
- 1: all required classes are given but one ordering relationship is wrong.
- 0: required medication classes are absent or laryngoscopy precedes them.

`rsi_no_ppv_before_first_laryngoscopy`

- Evidence: `mask_ppv_started` and `intubation_attempt_started`.
- 2: first laryngoscopy occurs with no earlier mask PPV.
- 0: any mask PPV starts before first laryngoscopy.
- No artificial partial state is created for this binary criterion.

`rsi_continuous_etco2_confirmation`

- Evidence: `capnogramPresent`, `etco2`, `airwayDevice`, and `mechanicalMV`; `intubation_attempt_succeeded` and `confirm_etco2`.
- The live console provides a discrete CONFIRM CONTINUOUS EtCO2 action that records the current waveform state. It does not create or alter the waveform.
- 2: after successful placement, the learner records confirmation and at least five consecutive one-second samples show an intubated airway, ventilation, `capnogramPresent: true`, and positive EtCO2.
- 1: a confirmation action or waveform exists, but both are not present for the sustained interval.
- 0: neither post-intubation confirmation nor waveform evidence exists.

`rsi_failed_attempt_ppv_with_cricoid`

- Evidence: attempt, PPV, and cricoid histories; failure, cricoid, PPV, and next-attempt entries.
- 2: after a failed attempt and before the next attempt, adequate mask PPV occurs while cricoid is active.
- 1: PPV rescue or cricoid is present, but not both together.
- 0: a failed attempt is followed by neither qualifying rescue nor case end.
- If no attempt fails, the conditional row is satisfied with 2 and labeled "condition not triggered" in the evidence.

`rsi_cricoid_release_after_confirmation`

- Evidence: cricoid history, sustained EtCO2 confirmation, and successful attempt; `cricoid_pressure_released`.
- 2: release occurs after successful placement and sustained confirmation.
- 1: release occurs after placement but before sustained confirmation.
- 0: cricoid was applied and is not appropriately released.

`rsi_inhaled_anesthetic_on`

- Evidence: `vaporizer`, `vaporizerAgent`; `volatile_changed`.
- 2: a supported inhaled anesthetic is turned on after intubation.
- 1: it is turned on before placement or remains at a negligible dial.
- 0: it is not turned on.

`rsi_vent_mode`, `rsi_tidal_volume`, `rsi_respiratory_rate`, `rsi_fresh_gas`, `rsi_fio2`, and `rsi_bag_to_vent`

- Evidence: the named ventilator snapshot keys; `machine_settings_changed` and `vent_mode_changed`.
- Each row scores the specific setting named by the PDF rather than collapsing all six into one synthetic competency.
- A positive, accepted setting after intubation earns 2; a setting made before placement but left active earns 1; absence earns 0. Mode appropriateness comes from the scenario's allowed-mode list.

`rsi_appropriate_failed_attempt_intervention`

- Evidence: failure, PPV, cricoid, oxygenation trace, and later attempt/success entries.
- 2: a failed attempt is followed by the scenario's rescue chain before another attempt.
- 1: rescue begins but is incomplete.
- 0: another attempt or case end occurs without rescue.
- If no attempt fails, the conditional row is satisfied with 2 and labeled "condition not triggered."

`rsi_under_three_attempts`

- Evidence: `intubationAttemptCount`, attempt history, and attempt entries.
- 2: successful intubation completes on attempt 1 or 2.
- 0: attempt 3 starts or no successful intubation occurs by finalization.
- No artificial partial state is created.

## Instructor scoring

Every instructor-observed item shows 2, 1, and 0 controls. A selection writes `instructor_rubric_score_set` with item ID, points, timestamp, and optional note. The instructor may revise a decision before finalization; the ledger retains every revision and the final value is explicit.

Engine supporting evidence is visible under instructor rows when relevant, but it is labeled "supporting trace - instructor scored." It never selects a point value automatically.

Finalization is blocked while an instructor row remains pending. The UI scrolls to the first pending row and reports the count. This avoids fabricating omissions and guarantees that a completed debrief has a denominator equal to the source rubric.

## Live violation flags

Violations are edge-triggered, deduplicated by item and triggering action, and contain only the rubric name, item number, and literal item text as their displayed label. A structured evidence detail may show the measured reason beneath the label.

Required rules:

1. Standard IV item 7 fires when an NMB drug is logged before qualifying mask PPV.
2. RSI item 11 fires when `mask_ppv_started` occurs before the first `intubation_attempt_started`.
3. Emergence item 3 fires on extubation when the latest qualifying TOF check is absent or below 0.90.
4. Emergence item 4 fires on extubation when a qualifying spontaneous-ventilation assessment is absent or below scenario thresholds.
5. Standard IV item 5 or RSI item 7 fires at the first induction drug when the rubric-specific preoxygenation evidence is inadequate.
6. RSI item 42 fires as soon as attempt 3 starts.

The requested residual-block constructed case produces both emergence critical flags because it has a low TOF ratio and inadequate derived spontaneous tidal ventilation. A case with TOF below 0.90 but independently adequate ventilation flags item 3 only, preserving the literal meaning of item 4.

Correct-order tests prove that none of these flags fire in a compliant run.

## Instructor TOF-depth control

The instructor console adds a clearly labeled administrative NMB panel with presets and a custom target TOF ratio from 0.00 to 1.00. Initial presets are 0.00, 0.25, 0.50, 0.70, 0.90, and 1.00. The panel displays target ratio, actual ratio, actual count, effective blockade, and dominant NMB source.

The control does not assign `trainOfFourCount`, `trainOfFourRatio`, `effectiveNmbBlockade`, or respiratory capability. Instead:

1. `SimRunner.setInstructorNmbTarget({ targetTofRatio })` validates the target.
2. `DrugSystem` converts the requested equilibrium blockade to rocuronium effect-site concentration using the inverse of the existing Hill relationship.
3. The same rocuronium central/effect-site state is replaced with the new administrative exposure.
4. Succinylcholine exposure and prior sugammadex/neostigmine relief are cleared because the action is an explicit replacement of current NMB state, not an additive second block.
5. Normal fixed-step PK/PD and the existing `PatientPhysiology.updateNeuromuscular()` move the displayed TOF toward the target over several seconds.
6. Respiratory muscle capability and ventilation change through their existing derivation.

Endpoints use a finite float32 clamp when inverting the Hill equation. The exact requested target and actual values are logged as `instructor_nmb_depth_set`. The UI states that equilibration is in progress until actual ratio is within tolerance.

This administrative action cannot satisfy `tof_checked`, reversal, medication-selection, medication-sequence, or any other student criterion. A student must still use CHECK TOF and appropriate reversal actions. The debrief displays administrative changes in a separate source style.

## Scenario definitions

Four additive JSON scenarios reuse the existing patient profile, starting setup, event, airway plan, and debrief fields. New fields are limited to `rubricId`, `rubricCriteria`, and `administrativeSetup`.

### Standard IV induction - healthy adult

- 70 kg healthy adult with normal baseline physiology.
- Mask airway, room-air starting gas, manual/bag mode.
- Standard IV rubric.
- No failed intubation attempts.
- Accepted induction and NMB choices are explicitly listed.
- The correct run preoxygenates, demonstrates mask PPV before NMB, continues PPV during onset, and intubates within two attempts.

### RSI - full stomach / aspiration risk

- Adult with obesity, GERD/full-stomach history, and reduced oxygen reserve derived from existing FRC behavior.
- Mask airway, room-air starting gas, manual/bag mode.
- RSI rubric with no failed attempts.
- The correct run uses three-minute preoxygenation, independent cricoid action, no PPV before first laryngoscopy, timed intubation, EtCO2 confirmation, cricoid release, and mechanical ventilation.

### Emergence - residual blockade

- Intubated adult on VCV with volatile maintenance active.
- Emergence rubric.
- Administrative setup uses the same instructor NMB target pathway to establish a TOF ratio well below 0.90.
- Fixed-step preconditioning runs before the learner clock/trace so the first learner-visible snapshot already reflects residual blockade. Preconditioning duration and target are explicit in JSON.
- The scenario is deterministic and does not create a second paralysis variable.

### RSI - failed first attempt

- Full-stomach RSI patient with `failedIntubationAttempts: [1]`.
- The correct rescue order is failed attempt 1, cricoid maintained/applied, mask PPV, oxygenation recovery, attempt 2, successful placement, sustained EtCO2, and cricoid release.
- The attempt count, desaturation timing, and oxygenation recovery come from Round 2 histories and the fixed trace.

Every scenario declares one fixed seed. Administrative preconditioning is fixed-step and deterministic. Unused rubric/scenario fields do not consume RNG or modify other cases.

## Live instructor console

The console adds:

- a four-scenario selector and case summary;
- the active rubric with source counts, live total, critical status, and source discrepancy banner;
- per-item status: pending, performed, partial, or not performed;
- automatic evidence details for engine rows;
- 2/1/0 controls and notes for instructor rows;
- immediate rubric-named violation flags;
- the instructor NMB/TOF target panel;
- FINALIZE DEBRIEF and PRINT RUBRIC actions.

The rubric panel is responsive and independently scrollable so it does not reintroduce monitor clipping. Source is visible through text labels, not color alone. Administrative, engine-observed, and instructor-observed entries use distinct labels in both screen and print views.

## Debrief and `SimulationResult`

The existing required `SimulationResult` fields remain unchanged. Rubric cases append:

```js
{
  rubricResult: {
    rubricId,
    itemCount,
    rawPoints,
    maxPoints,
    percentage,
    criticalItemsOmitted,
    outcome,
    denominatorWarnings,
    items,
  },
  actionTimeline,
  physiologicTrace,
  violationFlags,
  administrativeActions,
}
```

Each result item contains literal rubric text, points, critical status, source, evidence, instructor note, and observed consequence when applicable.

Consequences are generated only from actual trace values. A failed-item record identifies the triggering time, relevant action snapshot, subsequent observation window, nadir/peak values, and elapsed time. The prose formatter may say, for example, "Extubated at TOF ratio 0.71 and spontaneous TV 180 mL; observed SpO2 nadir 88% at +90 s." It does not claim a physiologic value that is absent from the trace or substitute canned teaching text for an observed result.

The action timeline includes every student and administrative action with its contemporaneous compact snapshot. Administrative entries are excluded from student scoring and visibly labeled.

## Printable rubric

Print CSS mirrors the source forms' structure:

- program/title header;
- outcome, total points, percentage, omitted critical events, date, student, and evaluator fields;
- section headings and literal rubric rows;
- performed, partial, not performed, and notes columns;
- critical-event footnote and exact pass rule;
- engine/instructor source labels;
- RSI denominator warning; and
- a following evidence/timeline appendix.

The printable view is a semantic HTML print layout, not a generated facsimile PDF. It preserves readability and provenance without copying source logos as new assets.

## Failure handling

- Invalid rubric JSON fails load with a visible error and cannot start a case.
- An unknown `ruleId` fails load rather than defaulting to instructor or a score.
- An engine item missing a named event/key mapping fails schema validation.
- A rejected clinical action enters the normal event log but cannot satisfy a rubric rule.
- Pending instructor scores block finalization.
- A source discrepancy warns but does not block RSI execution.
- A low percentage and an omitted critical event are reported as separate failure reasons.

## Evidence and test plan

1. Source contract tests assert exact item count, maximum points, critical count, literal text fixtures, source tags, and PDF hashes.
2. RSI tests assert 53 encoded rows, 106 computed points, 27 critical rows, preserved header `/49`, and a discrepancy warning.
3. Pass-rule tests prove 90 percent plus one omitted critical fails; 84 percent plus all critical performed fails; and 86 percent plus all critical performed passes.
4. Classification tests assert 3/6/0 for emergence, 1/13/0 for standard, and 17/36/0 for RSI.
5. Every engine-observable rule receives a real-run performed case and a real-run not-performed case. Partial cases are added only for rules with defined measurable subsets.
6. Required violation tests prove each flag fires and a correct paired run does not false-positive.
7. Instructor-scoring tests prove pending behavior, revisions, final values, critical partial failure, and finalization blocking.
8. TOF-control tests prove no direct derived-state write, single rocuronium state, gradual fixed-step equilibration, respiratory coupling, reversal compatibility after override, administrative logging, and scoring exclusion.
9. Each of the four scenarios runs to a complete rubric debrief.
10. The failed-attempt scenario proves ordered rescue, oxygenation recovery, and attempt-2 success.
11. The emergence scenario proves residual block is present in the first learner-visible trace and unsafe extubation records actual consequences.
12. Two complete executions containing preoxygenation, PPV, failed intubation, rubric actions, and administrative NMB setup produce identical fingerprints, including mid-action samples.
13. Print-view contract tests assert all rubric rows, score columns, source labels, warning, and educational fence.
14. Existing `SimulationResult` validation remains green with additive fields.
15. All prior 132 tests and frozen fixtures remain green.
16. `sw.js` includes every new static asset and advances the cache version.

## Simplifications and out of scope

1. A simulator button records that a maneuver was declared/performed in the simulation; it does not prove physical-world technique.
2. Instructor-observed scores are human judgments and are labeled as such.
3. Cricoid pressure remains a recorded maneuver without aspiration or resistance physiology.
4. Bag-mask ventilation continues to assume an adequate seal; mask failure/difficulty remains out of scope.
5. The initial emergence case uses volatile maintenance and no propofol infusion.
6. Spontaneous ventilation thresholds are scenario-declared educational thresholds, not universal extubation criteria.
7. Sustained EtCO2 confirmation is modeled as five deterministic one-second samples.
8. Conditional RSI rescue rows receive performed credit when no failed attempt makes them applicable; the evidence explicitly says the condition was not triggered.
9. Ventilator-setting rows score whether the named setting was made; they do not claim that one universal TV, RR, FGF, or FiO2 is clinically optimal.
10. The TOF target control replaces rocuronium/succinylcholine/reversal state administratively and is not a pharmacologic dose action.
11. Target TOF equilibration is deliberately not instantaneous because derived TOF is never assigned directly.
12. The paper-like view is not an official university record and does not reproduce protected branding assets.
13. CICO as a distinct emergency pathway, aspiration physiology, difficult laryngoscopy technique, speech recognition, PPE sensing, auscultation sensing, and airway-device securement sensing remain out of scope.

## Planned files

New:

- `data/rubrics/*.json`
- `crisis-sim/sim/scenario/rubricLoader.js`
- `crisis-sim/sim/scenario/rubricScoringSession.js`
- `crisis-sim/sim/scenario/rubricRules.js`
- `crisis-sim/sim/scenario/rubricDebrief.js`
- four rubric-linked scenario JSON files under `crisis-sim/sim/scenarios/`
- rubric model, scoring, scenario, UI, print, and evidence tests

Modified:

- `crisis-sim/ui/simRunner.js`
- `crisis-sim/sim/drugSystem.js`
- scenario normalization/exports where required
- `ui/liveSimModel.js`
- `ui/liveSimView.js`
- `assets/css/live-sim.css`
- `sw.js`
- `crisis-sim/sim/scenario/scenarioDebrief.js` or its additive caller integration

No frozen parity fixture will be regenerated.
