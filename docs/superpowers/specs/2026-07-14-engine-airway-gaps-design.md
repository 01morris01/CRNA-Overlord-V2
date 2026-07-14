# Engine Airway Gaps Design

Date: 2026-07-14  
Branch: `feature/engine-airway-gaps`  
Base: Round 1 commit `7923dc9`

## Context

Round 1 left the verified JavaScript engine with one shared neuromuscular-blockade state, orthogonal airway-device and respiratory-drive axes, calibrated rocuronium, tiered sugammadex, count-graded neostigmine, and an oxygen-reservoir model. Three Carson-Newman rubric surfaces remain unscoreable:

1. There is no discrete manual positive-pressure ventilation action.
2. Intubation always succeeds immediately and has no attempt cost or counter.
3. The adequate oxygen-store model does not expose ETO2.

The Round 1 baseline is 68/68 Vitest tests. Its preoxygenation audit already proves a clinically meaningful oxygen-store consequence: in the audited 70 kg forced-apnea run, room-air preparation crossed SpO2 95% at 27 seconds and 90% at 42 seconds, while three minutes of FiO2 1.0 preoxygenation crossed those thresholds at 460 and 473 seconds. The oxygen-store equations will therefore remain unchanged; this round adds only a derived ETO2 signal.

## Goals

- Represent bag-mask PPV as a timed, discrete, timestamped engine action.
- Let PPV provide mechanical minute ventilation through a mask without changing spontaneous drive or any derived vital directly.
- Make action ordering sufficient to score RSI versus Standard IV induction behavior.
- Represent deterministic, scenario-configured intubation failures with attempt count, elapsed-time cost, unsupported apnea, and outcome history.
- Expose ETO2 from the existing oxygen state.
- Preserve all frozen fixtures and all behavior when the new drivers are unused.

## Non-goals

- Mask leak, poor seal, difficult bag-mask ventilation, gastric insufflation, pressure injury, or operator fatigue.
- Random intubation success rolls.
- A separate cannot-intubate-cannot-oxygenate emergency state machine.
- Direct assignment of SpO2, EtCO2, PaO2, PaCO2, or other derived vitals.
- A second paralysis or respiratory-muscle state.
- Automatic ventilator activation after successful tube placement.

## Chosen architecture

Add a deterministic `AirwayProcedureSystem` beside the existing drug, ventilator, patient, and scenario systems. This subsystem owns the lifecycle and immutable history of timed PPV episodes and timed intubation attempts. It has references to the existing patient and ventilator; the ventilator has a read-only reference back to the active procedure state.

The simulation order becomes:

```text
drug -> airway procedure -> ventilator -> patient -> alarms -> scenario
```

The subsystem consumes no RNG. When no PPV or intubation attempt is active, its tick is physiologically inert and does not change the established RNG-consumption order.

`buildRig()` and `buildPhysRig()` return the additive `a` member:

```js
{ p, d, v, a, s, core }
{ p, d, v, a, core }
```

Existing destructuring callers remain valid.

## Public API

### Timed mask ventilation

The engine and `SimRunner` expose:

```js
deliverMaskVentilation({
  durationSeconds = 30,
  tidalVolumeMl = 500,
  respiratoryRate = 12,
  cricoidPressure = false,
} = {})
```

The method returns a structured result:

```js
{
  ok,
  reason,
  episodeId,
  startTimeSec,
  plannedDurationSec,
  airwayDevice,
  tidalVolumeMl,
  respiratoryRate,
  minuteVentilation,
  cricoidPressure,
}
```

Validation requires finite positive duration, tidal volume, and respiratory rate; a mask airway; no active intubation attempt; and no already-active PPV episode. A rejected call creates no ventilation and no successful action record.

The episode starts at the current fixed-step simulation time and automatically completes after the requested duration. It can also finish early with a reason such as `stopped`, `airway_changed`, `reset`, or `interrupted_by_intubation`. Actual delivered duration is calculated from fixed-step timestamps and stored separately from planned duration.

An explicit `stopMaskVentilation()` method ends the current episode early and records its actual duration.

The `cricoidPressure` flag remains convenience metadata on a PPV episode. It is not the scoreable cricoid maneuver; the independent action below is.

### Cricoid pressure

The engine and `SimRunner` expose two discrete actions:

```js
applyCricoidPressure()
releaseCricoidPressure()
```

They produce fixed-step `cricoid_pressure_applied` and `cricoid_pressure_released` events. The subsystem stores `cricoidPressureActive` plus a history of apply/release intervals and timestamps. Applying an already-active maneuver or releasing an inactive maneuver is idempotent and does not create a duplicate scoreable action.

Cricoid pressure is independent of PPV. A correct RSI can therefore record applied cricoid pressure without any mask-ventilation action before laryngoscopy. Cricoid pressure has no modeled physiologic effect in this round: it does not change airway resistance, mask ventilation, aspiration risk, or intubation success. This recorded-maneuver-only simplification is explicit in the model document.

### Intubation attempts

The engine and `SimRunner` expose:

```js
attemptIntubation()
```

It returns the started attempt without revealing its configured result before completion:

```js
{
  ok,
  reason,
  attemptNumber,
  startTimeSec,
  plannedDurationSec,
  airwayDevice,
}
```

The scenario definition accepts:

```js
airwayPlan: {
  failedIntubationAttempts: [1],
  intubationAttemptDurationSeconds: 30,
}
```

Normalization removes duplicate/non-positive attempt numbers, sorts the list, and requires a finite positive duration. Outcome is membership in `failedIntubationAttempts`; there is no stochastic roll. Seeded physiology, fixed-step timing, and the scenario list therefore produce a bit-reproducible run.

Starting an attempt is legal only from `mask`, when no attempt is already active. It increments the attempt counter immediately, ends an active PPV episode with `interrupted_by_intubation`, applies procedural apnea, and inhibits all mechanical support for the attempt duration. On completion:

- A failed attempt clears procedural apnea and leaves the airway at `mask`.
- A successful attempt clears procedural apnea and calls the existing validated `mask -> intubated` transition.
- Neither outcome changes ventilator mode or settings.

`SimRunner.intubate()` becomes a compatibility alias for `attemptIntubation()` and no longer directly mutates the airway or starts VCV. `setAirwayDevice()` remains available for administrative setup and tests, but it is not a scoreable intubation attempt.

Only `attemptIntubation()` can produce `intubation_attempt_*` log entries. Round 3 scoring must require a successful attempt entry. Reaching `intubated` through `setAirwayDevice()` scores zero on intubation-performance items, even though the administrative device state is valid.

Existing frozen scenarios without `airwayPlan` retain their established immediate scenario-action behavior so their fixtures do not change. New rubric scenarios opt into the timed path by declaring `airwayPlan`.

## Respiratory-drive composition during laryngoscopy

The patient gains a distinct, queryable procedural contribution rather than reusing forced apnea:

```text
centralDrive = forcedApneaContribution
             * drugDepressionContribution
             * complicationDriveContribution
             * proceduralApneaContribution

effectiveSpontaneousVentilationFraction = centralDrive
                                         * respiratoryMuscleCapability
```

`proceduralApneaContribution` is 0 only while an intubation attempt is active and 1 otherwise. `proceduralApneaActive` and the contribution are exposed in respiratory attribution. Forced apnea, drug depression, complication drive, and the single NMB-derived muscle capability are unchanged and remain independently queryable.

Support inhibition is separate from central drive. During laryngoscopy, both spontaneous ventilation and mechanical support are zero. The existing CO2 and oxygen-reservoir derivations then produce capnogram loss, CO2 accumulation, oxygen-store depletion, and progressive desaturation without direct vital writes.

## PPV ventilation composition

While a valid mask PPV episode is active:

```text
ppvMechanicalMinuteVentilation = tidalVolumeMl
                               * respiratoryRate / 1000

effectiveMinuteVentilation = max(ppvMechanicalMinuteVentilation,
                                 spontaneousMinuteVentilation)
```

This deliberately reuses the Round 1 controlled-ventilation simplification. `max` represents adequate mechanical ventilation substituting for absent effort without double-counting breath stacking. True breath summation remains out of scope and is documented as a conservative under-read when both contributions are partial.

PPV supplies the ventilator's measured tidal volume, respiratory rate, minute ventilation, and mechanical minute ventilation for gas-exchange derivation. It does not change airway-device state, forced apnea, drug depression, NMB, or oxygen stores directly. Inspired oxygen remains determined by existing machine fresh-gas/FiO2 settings.

## ETO2

Expose a read-only percent signal derived from the existing oxygen store:

```text
ETO2 percent = float32(clamp01(alveolarO2Fraction) * 100)
```

This is a teaching approximation of end-tidal oxygen. It introduces no new oxygen compartment and does not affect physiology. The model document will label the approximation explicitly.

## Snapshot contract

`SimRunner.snapshot()` adds:

| Key | Type | Meaning |
|---|---|---|
| `eto2` | number | Derived end-tidal oxygen percent |
| `mechanicalMV` | number | Current mechanical contribution |
| `effectiveMV` | number | Minute ventilation consumed by gas exchange |
| `proceduralApnea` | boolean | Intubation-attempt apnea active |
| `proceduralApneaContribution` | number | 0 during attempt, otherwise 1 |
| `cricoidPressureActive` | boolean | Recorded cricoid maneuver currently applied |
| `cricoidPressureHistory` | array | Fixed-step apply/release records |
| `ppvActive` | boolean | Timed PPV currently delivering support |
| `ppvEpisodeCount` | number | Number of accepted episodes |
| `ppvCurrent` | object or null | Current episode settings/timing |
| `ppvHistory` | array | Completed and current episode records |
| `intubationInProgress` | boolean | Attempt currently active |
| `intubationAttemptCount` | number | Attempts started in this run |
| `lastIntubationOutcome` | string | `none`, `failed`, or `succeeded` |
| `intubationAttempts` | array | Attempt timing, outcome, airway, and nadir SpO2 |

PPV history records include episode ID, start/end time, planned/actual duration, airway state, TV, RR, minute ventilation, cricoid-pressure flag, and completion reason. Attempt records include attempt number, start/end time, actual duration, outcome, airway before/after, `spo2Nadir`, `desaturatedBelow90`, and `timeToSpo2_90Sec`. The elapsed crossing time is finite when SpO2 first crosses below 90% during the attempt and `null` if it never crosses.

Snapshot arrays and objects are copies so callers cannot mutate engine state.

## Structured action logs and scoring

Procedure events use explicit fixed-step timestamps rather than wrapper wall-clock time:

- `mask_ppv_started`
- `mask_ppv_completed`
- `cricoid_pressure_applied`
- `cricoid_pressure_released`
- `intubation_attempt_started`
- `intubation_attempt_failed`
- `intubation_attempt_succeeded`

PPV start entries contain planned duration, settings, airway state, and cricoid-pressure metadata. Completion entries contain actual delivered duration and completion reason. Attempt completion entries contain outcome and actual duration.

This supports the required ordering questions directly:

- RSI: compare first `mask_ppv_started` with first `intubation_attempt_started`; no pre-laryngoscopy PPV is distinguishable from PPV before laryngoscopy.
- Standard IV: compare accepted PPV start/completion with the existing rocuronium drug timestamp; confirmed mask ventilation before paralytic is distinguishable from paralytic-first ordering.
- Rescue: PPV after a failed attempt, including `cricoidPressure: true`, is directly queryable.
- Correct RSI: `cricoid_pressure_applied` can exist before first laryngoscopy while no `mask_ppv_started` entry exists.

For configured scenarios, the scenario manager defers `intubation_successful`, success scoring, and success-triggered events until the attempt actually succeeds. A failed start is logged but does not secure or score the airway.

Round 3 scoring must inspect the attempt log, not device state alone. Administrative `setAirwayDevice('intubated')` creates no attempt event and cannot satisfy an intubation rubric item.

## Live UI blast radius

The live instructor console moves from immediate tube placement to the timed procedure path. Pressing **INTUBATE** starts laryngoscopy, reports the active attempt and countdown, leaves the device at `mask`, and exposes apnea/support inhibition during the configured interval. The airway changes to `intubated` only on successful completion. The operator must then select/configure mechanical ventilation separately.

The full induction-to-emergence smoke case uses `attemptIntubation()`, advances through the attempt duration, verifies the completed success event, and then explicitly enables VCV. This intentionally changes operator-visible timing while preserving device/support orthogonality.

## Reset and determinism

Engine reset, live-runner rebuild, and scenario reset clear active procedure state, histories, counters, procedural apnea, and support inhibition. Reset never clears or replaces the NMB state outside the existing drug/patient reset path.

All procedure durations and timestamps use the existing fixed 0.02-second timestep and float32 stores. Procedure logic consumes no random numbers, so unused drivers cannot shift frozen RNG sequences.

## Evidence plan

Tests and evidence output will demonstrate:

1. Mask PPV maintains effective ventilation, capnogram presence, stable EtCO2, and oxygenation in an apneic paralyzed patient; withholding PPV desaturates.
2. PPV history and logs contain exact start, completion, planned duration, actual duration, airway state, and settings.
3. RSI runs with and without PPV before first laryngoscopy are distinguishable by ordered action records.
4. Standard IV runs with PPV before rocuronium versus rocuronium before PPV are distinguishable.
5. Configured attempt 1 failure consumes time, suppresses support, leaves `mask`, lowers oxygen stores/SpO2, and increments the counter; attempt 2 succeeds and transitions to `intubated`.
6. Preoxygenated and non-preoxygenated apnea curves retain a measurable difference, and ETO2 exceeds 90% after adequate preoxygenation.
7. A combined preoxygenation, PPV, and failed-attempt run has an identical fingerprint across two executions.
8. All existing tests, snapshot checks, smoke tests, PWA contract checks, and frozen parity fixtures remain green.
9. RSI rescue chain: attempt 1 fails, cricoid pressure is applied, mask PPV restores oxygenation, and attempt 2 succeeds; the complete required log order is asserted.
10. Correct-RSI cricoid record: cricoid is applied at induction without pre-laryngoscopy PPV, producing the cricoid event independently.
11. Desaturation timing: a non-preoxygenated failed attempt records a finite below-90 crossing while the otherwise-equivalent preoxygenated attempt does not cross below 90%.
12. Scoring-path integrity: administrative transition to `intubated` produces no `intubation_attempt_*` event.

The combined deterministic fingerprint includes samples from the middle of an active PPV episode and the middle of an intubation attempt, not only endpoints. This catches accidental RNG consumption or transient-state nondeterminism.

## Documentation deliverable

`docs/airway-gaps-model.md` will document every equation, state transition, public method, snapshot field, configuration field, ordering discriminator, live-UI behavior change, and simplification. Each simplification will be labeled, including delivered-MV bag-mask ventilation, assumed adequate seal, no difficult ventilation, no breath summation, approximate ETO2, recorded-only cricoid pressure, deterministic configured failure, and no separate CICO pathway.
