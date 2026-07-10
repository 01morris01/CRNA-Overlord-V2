# Engine Reversal and Airway Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add clinically bounded rocuronium reversal, multi-source spontaneous ventilation, and a private validated airway-device state while preserving every frozen C# parity fixture.

**Architecture:** `DrugSystem` publishes deterministic sugammadex and neostigmine relief drivers. `PatientPhysiology` composes them with existing relaxant effect-site concentrations into one instantaneous `effectiveNmbBlockade`, retains the existing TOF-ratio transfer function as the sole lagged neuromuscular integrator, and derives respiratory muscle capability from that ratio. A private airway-device state and independent forced-apnea input feed `VentilatorSystem`, which keeps mandatory support and spontaneous effort separate before composing effective ventilation.

**Tech Stack:** Vanilla JavaScript ES modules, Vitest 2.1, deterministic 50 Hz `SimulationCore`, existing Mono-compatible float32 helpers.

---

## File map

- Modify `docs/reversal-airway-model.md`: apply all seven approved amendments before engine code.
- Modify `sim/drugSystem.js`: add reversal administration, effect drivers, float32 relief ramps, and reset-safe inert defaults.
- Modify `sim/patientPhysiology.js`: add the private airway state, forced-apnea contribution, single NMB exposure scalar, preserved TOF integrator, spontaneous-effort/attribution signals, and neostigmine chronotropic driver.
- Modify `sim/ventilatorSystem.js`: separate mandatory and spontaneous ventilation, honor device connectivity, retain effort visibility, and expose capnogram presence.
- Modify `sim/scenario/scenarioManager.js`: replace direct airway mutation and add reversal action dispatch without changing scenario math.
- Modify `sim/scenario/actionCatalog.js`: add canonical reversal and airway actions.
- Modify `sim/scenario/actionLogger.js`: retain respiratory attribution fields for debrief evidence.
- Modify `sim/scenario/scenarioDebrief.js`: add optional additive respiratory-attribution output without changing frozen keys.
- Modify `sim/index.js`: export `AirwayDevice`.
- Modify `ui/simRunner.js`: expose validated airway/apnea wrappers and remove direct `isIntubated` assignment.
- Modify `test/evidence.test.js`: add exactly eight evidence cases, with the amended count-graded, timeseries, coupling, and mid-ramp assertions.

### Task 1: Amend and lock the model document

**Files:**
- Modify: `docs/reversal-airway-model.md`

- [x] **Step 1: Patch all seven amendments**

Replace the sugammadex sub-tier row with zero relief, replace the neostigmine gate with count-based ceilings `0`, `0.15`, and `0.45`, name `trainOfFourRatio` as the sole lagged integrator, document the conservative `max()` failure case, document succinylcholine dominance, spell out every float32 sub-store, and require exposure-gated relief ramps.

- [x] **Step 2: Verify amendment coverage**

Run:

```bash
rg -n "count 1|0\.15|below threshold|sole lagged|conservative|succinylcholine.*dominant|sub-store|never been administered" docs/reversal-airway-model.md
git diff --check
```

Expected: every amendment phrase is present and `git diff --check` prints nothing.

- [x] **Step 3: Commit the amended model and plan**

```bash
git add docs/reversal-airway-model.md docs/superpowers/plans/2026-07-10-engine-reversal-airway.md
git commit -m "Refine reversal and respiratory model"
```

### Task 2: Write the eight failing evidence cases

**Files:**
- Modify: `test/evidence.test.js`

- [ ] **Step 1: Add reusable fixed-step helpers**

Add helpers that create rocuronium/succinylcholine depth, advance until a requested TOF count, capture contribution timeseries, and fingerprint float32 fields. Helpers must administer through `DrugSystem` and call only public airway/apnea APIs.

```js
function advanceUntil(rig, predicate, maxSec = 900) {
  for (let elapsed = 0; elapsed < maxSec; elapsed += 0.5) {
    rig.core.stepFor(0.5);
    if (predicate(rig)) return elapsed + 0.5;
  }
  throw new Error('condition not reached');
}

function reversalSnapshot(rig) {
  return [
    rig.core.tickCount,
    rig.p.effectiveNmbBlockade,
    rig.p.trainOfFourRatio,
    rig.p.respiratoryMuscleCapability,
    rig.d.sugammadexRocRelief,
    rig.d.neostigmineRocRelief,
  ].map(Math.fround).join('|');
}
```

- [ ] **Step 2: Add the eight top-level evidence tests**

Add one `it()` for each approved case:

```js
it('sugammadex is threshold-tiered, dose-dependent, and rocuronium-selective', () => {});
it('neostigmine effect is count-graded and preserves count-1 residual weakness', () => {});
it('apnea attribution changes from forced apnea to NMB across a lift timeseries', () => {});
it('TOF and respiratory capability share the sole ratio integrator', () => {});
it('airway device and forced apnea axes remain orthogonal under mandatory support', () => {});
it('returning effort remains visible over mandatory ventilation', () => {});
it('airway transitions validate every edge and expose no writable device field', () => {});
it('reversal/apnea/airway runs are deterministic at mid-ramp samples', () => {});
```

The neostigmine test must assert: count 0 relief stays near zero, count 1 remains `<0.9`, and count 2+ reaches `>=0.9`. The apnea test must record at least one sample before and after `setForcedApnea(false)`. The deterministic fingerprint must include approximately 15 seconds after a 16 mg/kg sugammadex bolus and several minutes into neostigmine exposure.

- [ ] **Step 3: Run the evidence file and verify red failures**

Run:

```bash
npx vitest run test/evidence.test.js --reporter=verbose
```

Expected: the existing nine tests pass and the eight new cases fail because the new public APIs/properties are absent.

### Task 3: Add the private airway-device API

**Files:**
- Modify: `sim/patientPhysiology.js`
- Modify: `sim/scenario/scenarioManager.js`
- Modify: `sim/index.js`
- Modify: `ui/simRunner.js`
- Test: `test/evidence.test.js`

- [ ] **Step 1: Implement private state and transition validation**

Add `AirwayDevice`, private `#airwayDeviceState`, read-only getters, internal reset, and this transition result shape:

```js
export const AirwayDevice = Object.freeze({ Mask: 'mask', Intubated: 'intubated', Extubated: 'extubated' });

transitionAirwayDevice(next) {
  const previous = this.#airwayDeviceState;
  if (next === previous) return { ok: true, changed: false, previous, current: previous, reason: '' };
  const legal = (previous === AirwayDevice.Mask && next === AirwayDevice.Intubated)
    || (previous === AirwayDevice.Intubated && next === AirwayDevice.Extubated)
    || (previous === AirwayDevice.Extubated && (next === AirwayDevice.Mask || next === AirwayDevice.Intubated));
  if (!legal) return { ok: false, changed: false, previous, current: previous, reason: `illegal ${previous} -> ${next}` };
  this.#airwayDeviceState = next;
  return { ok: true, changed: true, previous, current: next, reason: '' };
}
```

Expose `get isIntubated()` without a setter. Replace every existing assignment with `transitionAirwayDevice()` or the internal reset path. Export `AirwayDevice` from `sim/index.js`; delegate through `SimRunner.setAirwayDevice()`.

- [ ] **Step 2: Run transition evidence and source proof**

```bash
npx vitest run test/evidence.test.js -t "airway transitions" --reporter=verbose
rg -n "isIntubated\s*=|airwayDeviceState\s*=" sim ui test --glob '*.js'
```

Expected: transition test passes; grep finds only the private field's internal class assignment/reset and no external assignment.

### Task 4: Add reversal drug drivers with float32-safe ramps

**Files:**
- Modify: `sim/drugSystem.js`
- Modify: `sim/scenario/actionCatalog.js`
- Modify: `sim/scenario/scenarioManager.js`
- Test: `test/evidence.test.js`

- [ ] **Step 1: Add new inert driver state**

Initialize sugammadex/neostigmine compartments, targets, rates, and exposure gates to exact zero. Publish read-only getters and patient effect drivers only after administration.

- [ ] **Step 2: Add threshold-tiered administration**

Use actual body weight. `<2 mg/kg` sugammadex logs but sets no relief target; 2, 4, and 16 mg/kg tiers set targets and 120/90/30 second ramps. Neostigmine caps effective dose at `min(0.07 mg/kg, 5 mg)`, always enters `_neoC1`, and derives its `0/0.15/0.45` relief target from current TOF count.

- [ ] **Step 3: Implement explicit float32 sub-stores**

The rocuronium relief expression must be written as separate stores:

```js
const unbound = f(1 - this.sugammadexRocRelief);
const afterSugammadex = f(rawRocBlock * unbound);
const afterNeostigmine = f(afterSugammadex - this.neostigmineRocRelief);
const effectiveRocBlock = Clamp01(afterNeostigmine);
```

Ramp stores use `MoveTowards()` with float32-rounded `maxDelta`; skip the entire update when the relevant exposure gate is false.

- [ ] **Step 4: Run sugammadex/neostigmine evidence**

```bash
npx vitest run test/evidence.test.js -t "sugammadex|neostigmine" --reporter=verbose
```

Expected: both reversal cases pass, including sub-2 mg/kg zero effect and count-1 TOF ratio below 0.9.

### Task 5: Compute the single NMB state and respiratory-source composition

**Files:**
- Modify: `sim/patientPhysiology.js`
- Modify: `sim/scenario/actionLogger.js`
- Modify: `sim/scenario/scenarioDebrief.js`
- Test: `test/evidence.test.js`

- [ ] **Step 1: Preserve the existing TOF transfer function**

Compute one instantaneous `effectiveNmbBlockade` from effective rocuronium and raw succinylcholine. Keep the old count formula and old ratio `Lerp` rates bit-identical. Implement `respiratoryMuscleCapability` only as `Clamp01(trainOfFourRatio / 0.9)`.

- [ ] **Step 2: Add independently queryable respiratory contributions**

Add `setForcedApnea(active)`, `forcedApneaContribution`, `drugDepressionContribution`, `complicationDriveContribution`, `centralDrive`, spontaneous RR/TV/MV/effort, and dominant-source attribution. The central-drive product must use explicit float32 stores.

- [ ] **Step 3: Add additive attribution output**

Capture contribution values in action/debrief data without removing or renaming any frozen result key. The lift-event timeseries test must see `forced_apnea` before lifting and `nmb` afterward.

- [ ] **Step 4: Run source and coupling evidence**

```bash
npx vitest run test/evidence.test.js -t "apnea attribution|sole ratio integrator" --reporter=verbose
```

Expected: both cases pass and capability equals `Math.fround(Clamp01(ratio / 0.9))` at every sampled mid-ramp tick.

### Task 6: Separate mandatory and spontaneous ventilation

**Files:**
- Modify: `sim/ventilatorSystem.js`
- Test: `test/evidence.test.js`

- [ ] **Step 1: Retain spontaneous effort during mandatory modes**

Do not overwrite spontaneous RR/TV/effort when VCV/PCV runs. Compute mandatory ventilation separately, gate circuit connectivity through airway-device state, use triggered support for PSV, and compose effective gas-exchange ventilation with the approved conservative `max()` rule.

- [ ] **Step 2: Expose capnogram presence**

Derive `capnogramPresent` from exhaled flow/effective ventilation. Unsupported apnea sets it false while PaCO2 continues to rise and oxygen stores drain; supported forced apnea retains it true.

- [ ] **Step 3: Run axis and emergence evidence**

```bash
npx vitest run test/evidence.test.js -t "axes remain orthogonal|effort remains visible" --reporter=verbose
```

Expected: supported forced apnea has stable SpO2 and normal-range EtCO2, unsupported forced apnea desaturates with no capnogram, and spontaneous effort returns while mandatory ventilation remains active.

### Task 7: Full loop, determinism, and completion proof

**Files:**
- Verify: `sim/drugSystem.js`, `sim/patientPhysiology.js`, `sim/ventilatorSystem.js`, `sim/scenario/*.js`, `ui/simRunner.js`, `test/evidence.test.js`

- [ ] **Step 1: Run the mid-ramp determinism case**

```bash
npx vitest run test/evidence.test.js -t "mid-ramp" --reporter=verbose
```

Expected: two seeded fingerprints match exactly and include active sugammadex and neostigmine ramps.

- [ ] **Step 2: Run the full suite until green**

```bash
npm test -- --reporter=verbose
```

Expected: frozen parity remains 12/12 and evidence totals 17/17.

- [ ] **Step 3: Prove fixtures and direct writes are untouched**

```bash
git diff feature/js-sim-engine...HEAD -- test/fixtures/parity
rg -n "isIntubated\s*=|airwayDeviceState\s*=" sim ui test --glob '*.js'
```

Expected: fixture diff is empty; assignment grep shows only private internal state writes.

- [ ] **Step 4: Verify JavaScript syntax and imports**

```bash
for f in sim/*.js sim/scenario/*.js ui/simRunner.js test/evidence.test.js; do node --check "$f"; done
node -e "import('./sim/index.js').then(() => console.log('import smoke: PASS'))"
```

Expected: all checks exit zero and import smoke prints `PASS`.

- [ ] **Step 5: Commit the implementation**

```bash
git add sim ui/simRunner.js test/evidence.test.js docs/reversal-airway-model.md
git commit -m "Add verified reversal and airway physiology APIs"
```

Do not push.
