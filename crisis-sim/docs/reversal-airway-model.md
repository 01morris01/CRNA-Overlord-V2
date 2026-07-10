# Reversal, Respiratory Drive, and Airway Device Model

Date: 2026-07-10
Status: Approved design for `feature/engine-reversal-airway`

## Purpose and invariants

This round adds neuromuscular-blockade reversal, independently queryable respiratory-drive sources, and a validated airway-device state without changing any existing result when the new inputs are unused.

The implementation must preserve these invariants:

1. Derived vitals remain outputs. New APIs set drug exposures, physiologic drivers, or device state; they never set TOF, respiratory rate, minute ventilation, EtCO2, or SpO2 directly.
2. One scalar, `effectiveNmbBlockade`, is the only neuromuscular impairment consumed by TOF, respiratory muscle capability, reversal eligibility, and debrief attribution. There is no second paralysis variable or recovery timer.
3. Airway-device state and respiratory drive are orthogonal. Mechanical support may substitute for absent spontaneous ventilation, but it may not erase the separately queryable spontaneous-effort signal.
4. New state is initialized to values that reproduce the old engine: no forced apnea, no reversal exposure, and the existing airway/ventilator setup. Frozen parity fixtures are not re-baselined.
5. Every new arithmetic store and boundary uses the existing float32 helpers in `sim/float32.js`.

## Clinical reference model

- The [FDA BRIDION prescribing information](https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/022225s014lbl.pdf) defines sugammadex as a selective relaxant-binding agent for rocuronium and vecuronium, with actual-body-weight tiers of 2 mg/kg at reappearance of T2, 4 mg/kg at 1-2 post-tetanic counts with no TOF response, and 16 mg/kg for immediate reversal approximately three minutes after rocuronium 1.2 mg/kg. Vecuronium is not present in this engine, so only rocuronium is eligible. Sugammadex has no modeled effect on succinylcholine.
- The [FDA neostigmine prescribing information](https://www.accessdata.fda.gov/drugsatfda_docs/label/2021/203629s003lbl.pdf) specifies 0.03-0.07 mg/kg IV, capped at 0.07 mg/kg or 5 mg, selection based on spontaneous twitch recovery, and concomitant atropine or glycopyrrolate. The label requires a first-twitch response before expecting useful reversal and warns about cholinergic effects.
- The [2023 ASA Practice Guidelines for Monitoring and Antagonism of Neuromuscular Blockade](https://pubs.asahq.org/anesthesiology/article/138/1/13/137379/2023-American-Society-of-Anesthesiologists) use quantitative monitoring and a TOF ratio of at least 0.9 as the recovery endpoint and distinguish sugammadex use at deeper rocuronium/vecuronium block from neostigmine use at minimal block.

The engine is a teaching simulation, not a dose calculator. Dose tiers and eligibility follow these references, while the time evolution below is deliberately simplified and deterministic.

## Phase 0 dependency finding

The antimuscarinic dependency already exists and will be reused rather than duplicated:

- `DrugSystem.administerBolus("Glycopyrrolate", doseMg)` and `administerBolus("Atropine", doseMg)` feed the existing `_atropC1` compartment.
- `DrugSystem.updateTreatmentAgents()` advances `_atropCe` and publishes it as `patient.atropineCe`.
- `PatientPhysiology.updateHemodynamics()` adds `atropineCe * 28` to `hrBoost`.

Neostigmine will publish its own negative chronotropic effect driver. The existing `atropineCe` driver will oppose it in the same hemodynamic target calculation. This is a lumped antimuscarinic teaching model: glycopyrrolate and atropine share one existing effect-site signal rather than separate receptor-level models.

## Single computed neuromuscular-blockade state

### Inputs

The existing effect-site concentrations remain the drug exposure inputs:

```text
rawRocBlock = clamp01(rocuroniumCe / 3)
rawSuxBlock = clamp01(succinylcholineCe / 1)
```

`DrugSystem` adds two independently queryable reversal modifiers:

- `sugammadexRocRelief`, a float32 scalar from 0 to 1 representing the fraction of the current rocuronium block neutralized by encapsulation.
- `neostigmineRocRelief`, a float32 scalar from 0 to 0.45 representing competitive relief available through acetylcholinesterase inhibition.

Only the rocuronium component accepts these modifiers:

```text
effectiveRocBlock = clamp01(rawRocBlock * (1 - sugammadexRocRelief)
                            - neostigmineRocRelief)

effectiveNmbBlockade = max(effectiveRocBlock, rawSuxBlock)
```

`effectiveNmbBlockade` is computed once per physiology tick. TOF count, the TOF-ratio target, respiratory muscle capability, reversal eligibility, and the NMB source reported to the debrief all consume that same value. The raw rocuronium and succinylcholine inputs remain queryable for attribution, but they are not alternative paralysis outputs.

The existing engine already models measured TOF ratio as a temporally smoothed response to blockade exposure. That smoothing must remain bit-identical when reversal is unused because it is present in the frozen RSI fixture. `trainOfFourRatio` is therefore the measured transmission output, not a second paralysis model. Respiratory muscle capability is a pure getter derived from that same measured ratio and has no independent state or timer.

### Sugammadex modifier

`administerBolus("Sugammadex", totalDoseMg)` always records the administered dose. `doseMgPerKg` is calculated from actual body weight. The bolus selects a tier and adds a deterministic target/rate to the single rocuronium-relief modifier:

| Dose | Eligible depth | Relief target | Time to target |
|---|---|---:|---:|
| `< 2 mg/kg` | Any | proportional fraction of the 2 mg/kg target | 180 s |
| `2 to <4 mg/kg` | Moderate block, TOF count at least 2 | 1.0 | 120 s |
| `4 to <16 mg/kg` | Deep or moderate block, including TOF count 0 | 1.0 | 90 s |
| `>=16 mg/kg` | Any rocuronium block, including immediate deep block | 1.0 | 30 s |

For sub-tier dosing, the relief target is multiplied by `doseMgPerKg / tierDose`. A 2 mg/kg bolus given during count-0 deep block is still recorded but receives no deep-block relief target; 4 and 16 mg/kg remain effective from count 0. Repeated doses may increase the target but never above 1.

This is explicitly an **instantaneous-encapsulation teaching simplification with a deterministic effect ramp**, not a compartmental or molar binding model. The effect ramp makes dose tiers observable while avoiding a false claim that the engine's arbitrary rocuronium Ce units represent sugammadex binding stoichiometry.

### Neostigmine modifier and ceiling

`administerBolus("Neostigmine", totalDoseMg)` always administers and logs the push. The administered amount is capped for effect calculation at `min(0.07 mg/kg, 5 mg total)`; excess dose is recorded but adds no reversal effect. A one-compartment `_neoC1`/`_neoCe` driver follows the same deterministic `_eff` convention as other treatment agents.

The twitch requirement gates effect, never administration:

```text
neoDoseFraction = clamp01(effectiveDoseMgPerKg / 0.07)
hasTwitch = TOF count >= 1
shallowEnough = effectiveNmbBlockade <= 0.75
neostigmineRocReliefTarget = hasTwitch && shallowEnough
  ? min(0.45 * neoDoseFraction, rawRocBlock)
  : 0
```

`neostigmineRocRelief` approaches that target over 7 minutes, matching the label's bounded dosing while representing its slower onset. The 0.45 maximum is a deliberate ceiling simplification: a shallow rocuronium block can be fully relieved, but a deep count-0 block receives near-zero early benefit and cannot be rescued to full recovery by neostigmine. If natural rocuronium clearance later restores a twitch, residual neostigmine exposure may then accelerate recovery; the original drug push remains visible in the action log.

Neostigmine has no beneficial effect on `rawSuxBlock`. Its muscarinic contribution is independently published as `neostigmineBradycardiaEffect`; `PatientPhysiology.updateHemodynamics()` subtracts it from the HR target, while the existing `atropineCe` effect opposes it.

### TOF mapping

Both TOF outputs consume the same scalar while preserving the existing temporal response exactly:

```text
trainOfFourCount = RoundToInt(Lerp(4, 0, effectiveNmbBlockade))

targetTransmission = 1 - effectiveNmbBlockade
if effectiveNmbBlockade > 0.01:
    trainOfFourRatio = Lerp(trainOfFourRatio, targetTransmission, dt * 0.3)
else:
    trainOfFourRatio = Lerp(trainOfFourRatio, 1, dt * 0.05)

respiratoryMuscleCapability = clamp01(trainOfFourRatio / 0.9)
```

The count formula is the engine's existing `RoundToInt(Lerp(4, 0, blockade))` mapping, including float32 and banker's-rounding behavior. Its nominal boundaries are 0.125, 0.375, 0.625, and 0.875; count 0 begins at blockade 0.875. The ratio transfer function is also the existing behavior and is frozen by parity samples.

Adequate quantitative recovery is `trainOfFourRatio >= 0.9`. Count is an intentionally coarse qualitative signal; ratio is the extubation/reversal endpoint. Muscle capability reaches 1 at the same 0.9 endpoint and otherwise follows the ratio without an independent timer. Thus a TOF reading cannot recover while respiratory muscle capability remains impaired through a separate path.

## Multi-source respiratory drive

### Independently queryable contributions

`PatientPhysiology` exposes these read-only float32 contributions:

| Contribution | Set/cleared by | Meaning |
|---|---|---|
| `forcedApneaContribution` | `setForcedApnea(true/false)` | `0` while imposed, otherwise `1` |
| `drugDepressionContribution` | Existing propofol, fentanyl, midazolam, and volatile PK/PD in `updateDrugEffects()` | Existing graded `_rrModifier`, clamped to 0-1 |
| `complicationDriveContribution` | Existing `respiratoryDriveFactor` driver | High-spinal/opioid-complication and other external central-drive effects |
| `respiratoryMuscleCapability` | Pure mapping `clamp01(trainOfFourRatio / 0.9)`, with TOF ratio driven by `effectiveNmbBlockade` | Peripheral ability to turn central effort into ventilation |

Composition is:

```text
centralDrive = forcedApneaContribution
             * drugDepressionContribution
             * complicationDriveContribution

effectiveSpontaneousVentilationFraction = centralDrive
                                         * respiratoryMuscleCapability
```

This multiplicative composition is a deliberate teaching simplification. Real combined respiratory depression is not cleanly multiplicative, but multiplication preserves independent attribution and correctly produces a hard zero when forced apnea, central drive, or muscle capability is zero.

### Spontaneous-effort signals

The engine retains separate spontaneous signals even during controlled ventilation:

```text
spontaneousRespiratoryRate = baselineRR * centralDrive
spontaneousTidalVolume = 7 mL/kg * respiratoryMuscleCapability
spontaneousMinuteVentilation = spontaneousRespiratoryRate
                             * spontaneousTidalVolume / 1000
spontaneousEffort = effectiveSpontaneousVentilationFraction
```

These are derived signals, not externally writable fields. Forced apnea sets rate and effort to zero. NMB preserves central-rate intent but reduces tidal movement and muscle capability. Drug depression grades central rate. The four values remain queryable when VCV or PCV supplies mandatory breaths, allowing the trainer to observe breathing over the tube before extubation.

`capnogramPresent` is another read-only derived signal. It is true only when effective ventilation produces exhaled flow. During unsupported apnea, blood/alveolar CO2 may continue rising internally while `capnogramPresent` is false because no breaths deliver CO2 to the sensor. Waveform rendering uses this signal to flatten the trace; the physiology engine does not fake a low PaCO2 or directly overwrite EtCO2.

## Controlled and spontaneous ventilation

Mechanical and spontaneous ventilation are computed separately, then composed for gas exchange:

- Connected VCV/PCV produces mandatory `mechanicalMinuteVentilation` independent of spontaneous drive.
- Connected PSV requires spontaneous effort; absent effort produces no supported breath.
- Manual mode supplies no automatic mechanical minute ventilation in this round. A future discrete bag-squeeze API may add manual breaths; it is not faked here.
- For connected VCV/PCV, `effectiveMinuteVentilation = max(mechanicalMinuteVentilation, spontaneousMinuteVentilation)`. Using `max` is a deliberate teaching simplification that represents adequate controlled ventilation substituting for absent effort without double-counting breath stacking.
- For connected PSV, effective ventilation is the pressure-supported spontaneous result.
- Without supported mechanical ventilation, effective ventilation equals spontaneous minute ventilation.

The existing CO2 and oxygen-reservoir derivations consume effective minute ventilation. Consequently, supported forced apnea maintains appropriate gas exchange, while unsupported apnea drives EtCO2/capnogram toward zero-flow behavior and progressively depletes oxygen stores. No gas-exchange vital is assigned directly.

## Airway-device state

### Private state and validated API

`PatientPhysiology` owns a private `#airwayDeviceState` with values exported as `AirwayDevice.Mask`, `AirwayDevice.Intubated`, and `AirwayDevice.Extubated`. Validation lives here—not only in the UI wrapper—because `ScenarioManager`, test rigs, and future callers also hold the patient object. It exposes:

```text
get airwayDeviceState()
get isIntubated()  // compatibility getter only; no setter
transitionAirwayDevice(nextState) -> { ok, changed, previous, current, reason }
```

The compatibility getter makes assignment to `isIntubated` fail in module strict mode. All current writes in `ScenarioManager` and `ui/SimRunner` must delegate to `transitionAirwayDevice()`. `SimRunner.setAirwayDevice()` is a UI-facing wrapper, not the validation boundary.

Legal transitions are:

```text
mask -> intubated -> extubated
extubated -> mask
extubated -> intubated  // emergency reintubation
```

Repeated requests for the current state succeed with `changed: false`. `mask -> extubated` and `intubated -> mask` return `ok: false` and leave state unchanged. Reset initializes the device to `mask` through an internal reset path; callers cannot invoke that path.

### Device/support and drive cross-product

VCV/PCV support is considered connected for mask or intubated states; an extubated state has no circuit connection. PSV requires nonzero effort. The table below covers every device state against each independently attributable drive condition. "Mixed" uses the documented multiplicative composition rather than a separate rule.

| Device | Drive condition | Spontaneous signal | Vent off/manual result | Connected VCV/PCV result | PSV result |
|---|---|---|---|---|---|
| `mask` | Normal | Baseline RR/TV/effort | Spontaneous ventilation through mask | Mandatory support, with effort still queryable | Triggered support |
| `mask` | Drug depressed | Graded lower RR and minute ventilation | Graded hypoventilation | Mandatory support substitutes when adequate | Reduced triggering/support |
| `mask` | Forced apnea | RR/effort zero | Zero ventilation; no-flow capnogram | Mandatory support substitutes fully | No trigger and no ventilation |
| `mask` | NMB | Central RR intent preserved; TV/effort reduced by muscle capability | Graded-to-zero muscle ventilation | Mandatory support substitutes when adequate | Support falls with triggerable effort |
| `mask` | Mixed sources | Multiplicative central drive times muscle capability | Composed graded-to-zero ventilation | Mandatory support substitutes when adequate | Support follows remaining effort |
| `intubated` | Normal | Baseline RR/TV/effort over ETT | Spontaneous ventilation through ETT | Mandatory support; spontaneous effort remains queryable | Triggered support over ETT |
| `intubated` | Drug depressed | Graded lower RR and minute ventilation | Graded hypoventilation | Mandatory support substitutes when adequate | Reduced triggering/support |
| `intubated` | Forced apnea | RR/effort zero | Zero ventilation, flat no-flow capnogram, progressive desaturation | Normal controlled capnogram/gas exchange when settings are adequate | No trigger and no ventilation |
| `intubated` | NMB | Central RR intent preserved; TV/effort reduced by muscle capability | Graded-to-zero muscle ventilation | Mandatory support substitutes when adequate; central effort remains queryable | Support falls with triggerable effort |
| `intubated` | Mixed sources | Multiplicative central drive times muscle capability | Composed graded-to-zero ventilation | Mandatory support substitutes when adequate | Support follows remaining effort |
| `extubated` | Normal | Baseline RR/TV/effort | Unassisted spontaneous ventilation | No circuit connection; spontaneous ventilation only | No circuit connection; spontaneous ventilation only |
| `extubated` | Drug depressed | Graded lower RR and minute ventilation | Graded hypoventilation | No circuit connection; same graded spontaneous result | No circuit connection; same graded spontaneous result |
| `extubated` | Forced apnea | RR/effort zero | Zero ventilation; no-flow capnogram | No circuit connection and no effort: zero ventilation | No circuit connection and no effort: zero ventilation |
| `extubated` | NMB | Central RR intent preserved; TV/effort reduced by muscle capability | Graded-to-zero muscle ventilation | No circuit connection; same graded spontaneous result | No circuit connection; same graded spontaneous result |
| `extubated` | Mixed sources | Multiplicative central drive times muscle capability | Composed graded-to-zero ventilation | No circuit connection; same composed result | No circuit connection; same composed result |

This table defines mechanics only. It does not claim mask seal failure, difficult ventilation, or failed intubation. Manual bag squeezes are also out of scope for this round.

## Public API-to-driver map

| Public API | Exact engine input/state driven | Derived consumers |
|---|---|---|
| `DrugSystem.administerBolus("Sugammadex", doseMg)` | `_sugammadexReliefTarget` and deterministic relief ramp | `effectiveRocBlock`, then the single `effectiveNmbBlockade` |
| `DrugSystem.administerBolus("Neostigmine", doseMg)` | `_neoC1`, `_neoCe`, capped relief target, `neostigmineBradycardiaEffect` | `effectiveRocBlock`; HR target through drug effect |
| Existing glycopyrrolate/atropine bolus APIs | Existing `_atropC1 -> _atropCe -> patient.atropineCe` | Opposes neostigmine bradycardia in HR target |
| `PatientPhysiology.setForcedApnea(active)` | private forced-apnea state | `forcedApneaContribution`, central drive, spontaneous effort |
| `PatientPhysiology.transitionAirwayDevice(next)` | private `#airwayDeviceState` | circuit connection and mechanical-support eligibility |
| `SimRunner.setForcedApnea(active)` | delegates to patient forced-apnea API | UI-facing control and event log |
| `SimRunner.setAirwayDevice(next)` | delegates to patient transition API | UI-facing validated transition and event log |
| Ventilator mode/settings | existing mode, rate, tidal volume, pressure, and PEEP inputs | mechanical minute ventilation, composed gas-exchange ventilation |

No API in this table writes TOF, minute ventilation, EtCO2, SpO2, or another derived vital.

## Attribution and debrief surface

Each tick exposes a respiratory attribution snapshot:

```text
forcedApneaActive
drugDepressionContribution
complicationDriveContribution
effectiveNmbBlockade
respiratoryMuscleCapability
dominantInadequateVentilationSource
capnogramPresent
```

`dominantInadequateVentilationSource` is derived with explicit precedence for hard-zero forced apnea, then NMB when muscle capability is the smallest contribution, then drug depression, then complication drive. The underlying numeric contributions are exported with the label so debrief logic does not lose mixed-cause information. Clearing occurs only through the owning path: lift forced apnea, allow/antagonize drug exposure, reverse/clear NMB, or resolve the complication driver.

## Error handling

- Airway transition failures return a structured rejection and never partially mutate device or ventilator state.
- Repeated legal-state requests are idempotent successes.
- Neostigmine and sugammadex pushes are logged even when the current depth makes their modeled effect negligible. Clinical misuse remains observable rather than being rejected by the API.
- Nonpositive or non-finite sugammadex/neostigmine doses produce no effect. UI-facing wrappers reject them and log a rejected attempt rather than a successful administration; positive pushes always log even when depth gating makes the clinical effect negligible.
- All new state resets through the engine reset path so test rigs cannot leak reversal or apnea state between runs.

## Evidence design

The frozen parity fixtures remain untouched. `test/evidence.test.js` gains eight evidence cases:

1. Sugammadex tier/selectivity: faster-than-natural, dose-dependent rocuronium recovery; 4 and 16 mg/kg recover from count 0; no succinylcholine reversal.
2. Neostigmine ceiling: shallow recovery accelerates; a deep-block push is logged but has near-zero early effect.
3. Apnea-source distinction: forced apnea, drug depression, and NMB are independently queryable and clear only by their owning mechanisms; attribution reports the source.
4. NMB coupling: TOF ratio and muscle capability equal mappings of the same `effectiveNmbBlockade` throughout reversal, including the moment an independent-timer implementation would diverge.
5. Axis orthogonality: the same forced-apnea state remains stable with adequate intubated VCV/PCV and deteriorates with support off.
6. Emergence visibility: spontaneous RR, tidal volume, and effort return and remain queryable over mandatory ventilation.
7. Airway transitions: all legal, illegal, and repeated transitions produce the specified structured result; source grep confirms no external device-state assignment.
8. Determinism: reversal, forced apnea, and airway transitions produce a bit-identical fingerprint in two seeded runs.

Every test drives only public inputs and asserts derived outputs. Tests do not assign TOF, ventilation, EtCO2, or SpO2.

## Explicit scope limitations

- No supraglottic/LMA state is modeled; the supported device surface is mask and ETT, plus the extubated/no-device state.
- Failed intubation is not modeled. A legal transition to `intubated` always succeeds; cannot-intubate/cannot-oxygenate scenarios remain out of scope.
- Sugammadex encapsulation is not a compartmental or stoichiometric binding model.
- Neostigmine uses a bounded teaching ceiling rather than a receptor-occupancy model.
- Combined respiratory-drive effects are multiplicative and controlled/spontaneous ventilation uses a `max` composition in mandatory modes; both are teaching simplifications rather than claims of full respiratory mechanics.
