# Engine Airway Gaps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add scoreable timed mask PPV, discrete cricoid pressure, deterministic failed intubation attempts with desaturation cost, and ETO2 while preserving the verified engine truth boundary and frozen fixtures.

**Architecture:** A new RNG-free `AirwayProcedureSystem` owns fixed-step action lifecycles, histories, and event records. `VentilatorSystem` reads its current support/procedure state, `PatientPhysiology` adds an independent procedural-apnea contribution, and `ScenarioManager`/`SimRunner` consume the same events for scoring and live logs. Existing scenarios remain unchanged unless they opt into `airwayPlan`.

**Tech Stack:** JavaScript ES modules, Vitest, Node assertion scripts, deterministic 0.02-second simulation ticks, float32 helper functions, browser DOM instructor console, service-worker PWA cache.

---

## File map

- Create `crisis-sim/sim/airwayProcedureSystem.js`: timed PPV, cricoid, attempt configuration/lifecycles, fixed-step event stream, copied histories.
- Modify `crisis-sim/sim/patientPhysiology.js`: procedural-apnea source and derived ETO2 only.
- Modify `crisis-sim/sim/ventilatorSystem.js`: consume PPV support and laryngoscopy inhibition through existing ventilation derivation.
- Modify `crisis-sim/sim/simulationCore.js`: deterministic procedure tick/reset wiring without RNG consumption.
- Modify `crisis-sim/sim/index.js`: construct/export/wire the additive `a` subsystem.
- Modify `crisis-sim/sim/scenario/scenarioLoader.js`: normalize optional `airwayPlan`.
- Modify `crisis-sim/sim/scenario/scenarioManager.js`: opt-in timed attempts and success-only scoring/triggering.
- Modify `crisis-sim/sim/scenario/actionCatalog.js`: canonical mask-ventilation, cricoid, and attempt action names.
- Modify `crisis-sim/sim/scenario/actionLogger.js`: preserve procedure metadata in copied action entries.
- Modify `crisis-sim/ui/simRunner.js`: public APIs, structured procedure log, snapshot contract, timed `intubate()` alias.
- Modify `ui/liveSimView.js`: timed attempt status/countdown plus mask-PPV and cricoid controls; no vital writes.
- Modify `docs/live-sim-integration.md`: exact wrapper signatures and operator behavior.
- Modify `sw.js`: cache the new engine module and bump cache version.
- Create `crisis-sim/test/airway-procedure.test.js`: unit/state-machine contracts.
- Create `crisis-sim/test/airway-gaps-evidence.test.js`: physiologic and rubric evidence.
- Create `crisis-sim/test/airway-gaps-evidence.mjs`: printable curves, ordered logs, and fingerprints.
- Modify `crisis-sim/test/live-runner.test.js`: wrapper APIs/logging/snapshot tests.
- Modify `crisis-sim/test/snapshot-contract.mjs`: exact new primitive/object/array keys.
- Modify `crisis-sim/test/live-case-smoke.mjs`: timed intubation and explicit VCV.
- Modify `crisis-sim/test/app-integration.test.js`: instructor-console control/blast-radius contract.
- Modify `crisis-sim/test/pwa-contract.test.js`: new cached module contract.
- Modify `docs/airway-gaps-model.md`: record implemented signatures and final evidence values if implementation changes a planned name.

### Task 1: Airway procedure state machine

**Files:**
- Create: `crisis-sim/sim/airwayProcedureSystem.js`
- Create: `crisis-sim/test/airway-procedure.test.js`

- [x] **Step 1: Write failing lifecycle tests**

Create focused tests using a reset patient and a procedure system:

```js
import { describe, expect, it } from 'vitest';
import { AirwayProcedureSystem, PatientPhysiology } from '../sim/index.js';

function procedureRig() {
  const patient = new PatientPhysiology();
  patient.resetToBaseline();
  const airway = new AirwayProcedureSystem();
  airway.patient = patient;
  airway.reset();
  return { patient, airway };
}

it('runs one timed mask-ventilation episode and returns copied history', () => {
  const { airway } = procedureRig();
  const result = airway.deliverMaskVentilation({
    durationSeconds: 2, tidalVolumeMl: 500, respiratoryRate: 12,
  });
  expect(result).toMatchObject({ ok: true, startTimeSec: 0, minuteVentilation: 6 });
  airway.tick(1);
  expect(airway.ppvActive).toBe(true);
  airway.tick(1);
  expect(airway.ppvActive).toBe(false);
  expect(airway.ppvHistory[0]).toMatchObject({
    startTimeSec: 0, plannedDurationSec: 2, deliveredDurationSec: 2,
    airwayDevice: 'mask', completionReason: 'completed',
  });
  const copy = airway.ppvHistory;
  copy[0].completionReason = 'mutated';
  expect(airway.ppvHistory[0].completionReason).toBe('completed');
});

it('records cricoid independently and idempotently', () => {
  const { airway } = procedureRig();
  expect(airway.applyCricoidPressure().ok).toBe(true);
  expect(airway.applyCricoidPressure().changed).toBe(false);
  airway.tick(3);
  expect(airway.releaseCricoidPressure()).toMatchObject({ ok: true, changed: true });
  expect(airway.cricoidPressureHistory).toEqual([
    expect.objectContaining({ appliedAtSec: 0, releasedAtSec: 3, durationSec: 3 }),
  ]);
  expect(airway.eventsSince(0).map((e) => e.type)).toEqual([
    'cricoid_pressure_applied', 'cricoid_pressure_released',
  ]);
});

it('configures deterministic attempt outcomes and interrupts PPV', () => {
  const { patient, airway } = procedureRig();
  airway.configureIntubation({ failedIntubationAttempts: [1], attemptDurationSeconds: 2 });
  airway.deliverMaskVentilation({ durationSeconds: 10 });
  expect(airway.attemptIntubation()).toMatchObject({ ok: true, attemptNumber: 1 });
  expect(airway.ppvHistory[0].completionReason).toBe('interrupted_by_intubation');
  expect(patient.airwayDeviceState).toBe('mask');
  airway.tick(2);
  expect(airway.lastIntubationOutcome).toBe('failed');
  expect(airway.attemptIntubation()).toMatchObject({ ok: true, attemptNumber: 2 });
  airway.tick(2);
  expect(airway.lastIntubationOutcome).toBe('succeeded');
  expect(patient.airwayDeviceState).toBe('intubated');
});
```

Also test invalid mask/number inputs, reset clearing state, and `eventsSince()` returning copies.

- [x] **Step 2: Run tests to verify RED**

Run: `cd crisis-sim && npx vitest run test/airway-procedure.test.js --reporter=verbose`

Expected: FAIL because `AirwayProcedureSystem` is not exported.

- [x] **Step 3: Implement the minimal subsystem**

Create the class with float32 time stores and no RNG:

```js
import { f, add, Clamp01 } from './float32.js';

export class AirwayProcedureSystem {
  constructor() {
    this.patient = null;
    this.reset();
  }

  configureIntubation({ failedIntubationAttempts = [], attemptDurationSeconds = 30 } = {}) {
    const failures = [...new Set(failedIntubationAttempts
      .filter((n) => Number.isInteger(n) && n > 0))].sort((a, b) => a - b);
    if (!Number.isFinite(attemptDurationSeconds) || attemptDurationSeconds <= 0) {
      throw new RangeError('attemptDurationSeconds must be finite and positive');
    }
    this.failedIntubationAttempts = failures;
    this.attemptDurationSeconds = f(attemptDurationSeconds);
  }

  get ppvActive() { return this._ppvCurrent !== null; }
  get intubationInProgress() { return this._attemptCurrent !== null; }
  get ppvCurrent() { return this._ppvCurrent ? { ...this._ppvCurrent } : null; }
  get ppvHistory() { return this._ppvHistory.map((x) => ({ ...x })); }
  get intubationAttempts() { return this._attempts.map((x) => ({ ...x })); }
  get cricoidPressureHistory() { return this._cricoidHistory.map((x) => ({ ...x })); }
  eventsSince(index) { return this._events.slice(index).map((x) => ({ ...x, meta: { ...x.meta } })); }
}
```

Implement validated start/stop, event emission, fixed-step completion, deterministic failure membership, SpO2 nadir/crossing samples, and reset exactly as specified in `docs/airway-gaps-model.md`.

- [x] **Step 4: Run tests to verify GREEN**

Run: `cd crisis-sim && npx vitest run test/airway-procedure.test.js --reporter=verbose`

Expected: all state-machine tests pass without any RNG field or call.

- [x] **Step 5: Commit**

```bash
git add crisis-sim/sim/airwayProcedureSystem.js crisis-sim/test/airway-procedure.test.js
git commit -m "Add deterministic airway procedure state"
```

### Task 2: Core wiring, procedural apnea, and ETO2

**Files:**
- Modify: `crisis-sim/sim/patientPhysiology.js`
- Modify: `crisis-sim/sim/simulationCore.js`
- Modify: `crisis-sim/sim/index.js`
- Modify: `crisis-sim/test/airway-procedure.test.js`

- [x] **Step 1: Add failing composition and rig tests**

```js
import { buildPhysRig } from '../sim/index.js';

it('wires procedure state without duplicating NMB and exposes derived ETO2', () => {
  const { p, a, core } = buildPhysRig(8101, 70, 170, 45);
  expect(a.patient).toBe(p);
  expect(core.airwayProcedure).toBe(a);
  expect(p.proceduralApneaContribution).toBe(1);
  expect(p.endTidalO2Percent).toBe(Math.fround(p.alveolarO2Fraction * 100));
  a.configureIntubation({ failedIntubationAttempts: [1], attemptDurationSeconds: 2 });
  a.attemptIntubation();
  expect(p.proceduralApneaActive).toBe(true);
  expect(p.proceduralApneaContribution).toBe(0);
  expect(p.centralDrive).toBe(0);
  expect(Object.hasOwn(p, 'procedureNmbBlockade')).toBe(false);
});
```

Add a reset test asserting procedure state and patient procedural apnea clear while existing `effectiveNmbBlockade` remains owned by the established patient/drug reset.

- [x] **Step 2: Run tests to verify RED**

Run: `cd crisis-sim && npx vitest run test/airway-procedure.test.js --reporter=verbose`

Expected: FAIL on missing rig member and patient getters.

- [x] **Step 3: Implement patient composition and core wiring**

Add a private patient flag and exact composition:

```js
#proceduralApnea = false;

setProceduralApnea(active) { this.#proceduralApnea = active === true; }
get proceduralApneaActive() { return this.#proceduralApnea; }
get proceduralApneaContribution() { return this.#proceduralApnea ? 0 : 1; }
get endTidalO2Percent() { return f(Clamp01(this.alveolarO2Fraction) * 100); }

get centralDrive() {
  const forcedDrug = f(this.forcedApneaContribution * this.drugDepressionContribution);
  const complicationProcedure = f(this.complicationDriveContribution * this.proceduralApneaContribution);
  return Clamp01(f(forcedDrug * complicationProcedure));
}
```

Reset the flag in `resetToBaseline()` and expose it in respiratory attribution. Extend the existing respiration checks without regrouping the established drug/complication arithmetic:

```js
const procedureOrForcedApnea = this.#forcedApnea || this.#proceduralApnea;
const targetRR = procedureOrForcedApnea
  ? 0
  : Clamp(this.baselineRR * this._rrModifier * this.respiratoryDriveFactor, 0, 40);
this.isBreathingSpontaneously = !procedureOrForcedApnea
  && this.respiratoryRate >= 2 && this.respiratoryMuscleCapability > f(0.01);
```

Likewise, make `alveolarVentilationLMin()` use zero RR when a non-mechanically-ventilated patient has either forced or procedural apnea. This guarantees immediate zero-flow physiology without changing any unused-driver arithmetic.

Wire one `AirwayProcedureSystem` into both rig builders and `SimulationCore`. Procedure state must bracket each ventilation/physiology tick: prepare active state before ventilator, then sample SpO2, advance float32 procedure time, and complete actions after patient physiology but before scenario event processing. This preserves the full requested support/apnea duration and lets scenario scoring observe a completion in the same fixed step. Reset it without assigning an RNG.

- [x] **Step 4: Verify focused tests and frozen parity immediately**

Run:

```bash
cd crisis-sim
npx vitest run test/airway-procedure.test.js --reporter=verbose
npx vitest run test/parity.test.js --reporter=verbose
```

Expected: composition tests pass and every frozen non-rocuronium parity assertion remains green. Any frozen change is a stop condition.

- [x] **Step 5: Commit**

```bash
git add crisis-sim/sim/patientPhysiology.js crisis-sim/sim/simulationCore.js crisis-sim/sim/index.js crisis-sim/test/airway-procedure.test.js
git commit -m "Wire procedural apnea and ETO2"
```

### Task 3: PPV and laryngoscopy ventilation mechanics

**Files:**
- Modify: `crisis-sim/sim/ventilatorSystem.js`
- Create: `crisis-sim/test/airway-gaps-evidence.test.js`

- [x] **Step 1: Write failing PPV physiology evidence**

Build equivalent forced-apnea, deeply rocuronium-blocked patients at FiO2 1.0. Deliver 120 seconds of mask PPV to one and withhold it from the other:

```js
expect(supported.p.forcedApneaContribution).toBe(0);
expect(supported.p.respiratoryMuscleCapability).toBeLessThan(0.1);
expect(supported.v.mechanicalMinuteVentilation).toBeCloseTo(6, 4);
expect(supported.v.effectiveMinuteVentilation).toBeGreaterThan(5.9);
expect(supported.p.capnogramPresent).toBe(true);
expect(supported.p.spO2).toBeGreaterThanOrEqual(95);
expect(unsupported.v.effectiveMinuteVentilation).toBe(0);
expect(unsupported.p.capnogramPresent).toBe(false);
expect(unsupported.p.spO2).toBeLessThan(90);
```

Add a laryngoscopy test that starts PPV, starts an attempt, then asserts mechanical/effective MV are zero throughout the attempt even if the ventilator was set to a mandatory mode.

- [x] **Step 2: Run tests to verify RED**

Run: `cd crisis-sim && npx vitest run test/airway-gaps-evidence.test.js --reporter=verbose`

Expected: FAIL because the ventilator does not read procedure support.

- [x] **Step 3: Implement PPV support and attempt inhibition**

Give `VentilatorSystem` an `airwayProcedure` reference. In `tick()` give active laryngoscopy highest priority, active mask PPV next priority, then preserve the existing mode switch unchanged:

```js
if (this.airwayProcedure?.intubationInProgress) {
  this.updateUnsupportedProcedure();
} else if (this.patient.airwayDeviceState === 'mask' && this.airwayProcedure?.ppvActive) {
  this.updateMaskPpv(this.airwayProcedure.ppvCurrent);
} else {
  this.updateConfiguredMode(dt, connected);
}
```

`updateMaskPpv()` sets measured TV/RR/MV and mechanical MV only. `updatePatientInterface()` composes `Max(mechanicalMinuteVentilation, spontaneousMinuteVentilation)` for PPV, matching the existing controlled-support simplification. `updateCO2()` and the patient oxygen reservoir must consume the resulting effective ventilation; do not assign gas-exchange vitals.

- [x] **Step 4: Verify evidence and frozen parity**

Run:

```bash
cd crisis-sim
npx vitest run test/airway-gaps-evidence.test.js --reporter=verbose
npx vitest run test/parity.test.js --reporter=verbose
```

Expected: PPV/withholding and support-inhibition evidence pass; frozen fixtures are unchanged.

- [x] **Step 5: Commit**

```bash
git add crisis-sim/sim/ventilatorSystem.js crisis-sim/test/airway-gaps-evidence.test.js
git commit -m "Derive gas exchange from timed mask PPV"
```

### Task 4: Scenario configuration and scoreable attempt path

**Files:**
- Modify: `crisis-sim/sim/scenario/scenarioLoader.js`
- Modify: `crisis-sim/sim/scenario/scenarioManager.js`
- Modify: `crisis-sim/sim/scenario/actionCatalog.js`
- Modify: `crisis-sim/sim/scenario/actionLogger.js`
- Modify: `crisis-sim/test/airway-procedure.test.js`

- [x] **Step 1: Write failing scenario tests**

Load a small scenario with `airwayPlan.failedIntubationAttempts: [1]` and two-second attempts. Assert:

```js
expect(rig.s.recordStudentAction('Intubate')).toMatchObject({ ok: true, attemptNumber: 1 });
expect(rig.s.run.intubatedAtSec).toBe(-1);
rig.core.stepFor(2);
expect(rig.p.airwayDeviceState).toBe('mask');
expect(rig.s.run.intubatedAtSec).toBe(-1);
expect(rig.s.recordStudentAction('Intubate')).toMatchObject({ ok: true, attemptNumber: 2 });
rig.core.stepFor(2);
expect(rig.p.airwayDeviceState).toBe('intubated');
expect(rig.s.run.intubatedAtSec).toBeGreaterThan(0);
expect(rig.s.actionLog.entries.some((e) => e.canonical === 'intubation_attempt_succeeded')).toBe(true);
```

Add a separate administrative transition assertion proving `p.transitionAirwayDevice('intubated')` produces no procedure event. Run existing RSI fixture behavior without `airwayPlan` and assert its immediate legacy action remains unchanged.

- [x] **Step 2: Run tests to verify RED**

Run: `cd crisis-sim && npx vitest run test/airway-procedure.test.js --reporter=verbose`

Expected: FAIL because loader/manager do not know the plan or procedure events.

- [x] **Step 3: Implement opt-in configuration and success-only scoring**

Normalize `airwayPlan` only when present. Wire `ScenarioManager.airwayProcedure`. For opted-in scenarios, `recordStudentAction('Intubate')` starts an attempt and returns without marking `intubation_successful`. Process new procedure events during scenario tick; only `intubation_attempt_succeeded` may set `run.intubatedAtSec`, evaluate canonical `intubate`, mark the success trigger, and run success-triggered events.

Add action catalog entries:

```js
MaskVentilate: 'mask_ventilation',
ApplyCricoidPressure: 'cricoid_pressure_applied',
ReleaseCricoidPressure: 'cricoid_pressure_released',
AttemptIntubation: 'intubation_attempt',
```

Let action-log records accept copied procedure metadata. Preserve the no-plan scenario path exactly.

- [x] **Step 4: Verify scenario tests and parity**

Run:

```bash
cd crisis-sim
npx vitest run test/airway-procedure.test.js test/parity.test.js --reporter=verbose
```

Expected: configured success is deferred, administrative state is unscoreable, and frozen parity remains green.

- [x] **Step 5: Commit**

```bash
git add crisis-sim/sim/scenario crisis-sim/test/airway-procedure.test.js
git commit -m "Make intubation attempts scenario-scoreable"
```

### Task 5: SimRunner APIs, structured logs, and snapshot

**Files:**
- Modify: `crisis-sim/ui/simRunner.js`
- Modify: `crisis-sim/test/live-runner.test.js`
- Modify: `crisis-sim/test/snapshot-contract.mjs`

- [x] **Step 1: Write failing wrapper tests**

Test exact public methods and event ordering through `SimRunner`:

```js
const runner = new SimRunner();
runner.configureIntubationAttempts({ failedIntubationAttempts: [1], attemptDurationSeconds: 2 });
runner.applyCricoidPressure();
runner.deliverMaskVentilation({ durationSeconds: 1, cricoidPressure: true });
advance(runner, 1);
expect(runner.intubate()).toMatchObject({ ok: true, attemptNumber: 1 });
advance(runner, 2);
expect(runner.snapshot()).toMatchObject({
  cricoidPressureActive: true,
  ppvEpisodeCount: 1,
  intubationAttemptCount: 1,
  lastIntubationOutcome: 'failed',
  airwayDevice: 'mask',
});
```

Assert procedure log entries contain their fixed-step `t`, event action, duration/settings/outcome metadata, and required RSI rescue order. Assert `setAirwayDevice('intubated')` produces no `intubation_attempt_*` entry.

Extend the snapshot contract with the exact primitive/object/array keys from the model. Validate copied arrays and nullable `ppvCurrent` rather than weakening the total-key contract.

- [x] **Step 2: Run tests to verify RED**

Run:

```bash
cd crisis-sim
npx vitest run test/live-runner.test.js --reporter=verbose
node test/snapshot-contract.mjs
```

Expected: wrapper tests fail on missing methods and snapshot keys.

- [x] **Step 3: Implement the wrapper contract**

Wire the `a` rig member into `SimRunner`, include an `airwayPlan` in the live scenario, and expose:

```js
deliverMaskVentilation(options) { return this.a.deliverMaskVentilation(options); }
stopMaskVentilation() { return this.a.stopMaskVentilation(); }
applyCricoidPressure() { return this.a.applyCricoidPressure(); }
releaseCricoidPressure() { return this.a.releaseCricoidPressure(); }
attemptIntubation() { return this.a.attemptIntubation(); }
intubate() { return this.attemptIntubation(); }
configureIntubationAttempts(options) { return this.a.configureIntubation(options); }
```

Subscribe to procedure events once per build and append live log records using the event's fixed-step timestamp, not stale wrapper time. Add all approved snapshot fields, copying histories through subsystem getters. Do not start VCV in `intubate()`.

- [x] **Step 4: Verify wrapper GREEN**

Run:

```bash
cd crisis-sim
npx vitest run test/live-runner.test.js --reporter=verbose
node test/snapshot-contract.mjs
```

Expected: APIs, structured logs, copies, and exact snapshot key count pass.

- [x] **Step 5: Commit**

```bash
git add crisis-sim/ui/simRunner.js crisis-sim/test/live-runner.test.js crisis-sim/test/snapshot-contract.mjs
git commit -m "Expose scoreable airway actions in live snapshots"
```

### Task 6: Complete rubric evidence and printable output

**Files:**
- Modify: `crisis-sim/test/airway-gaps-evidence.test.js`
- Create: `crisis-sim/test/airway-gaps-evidence.mjs`

- [x] **Step 1: Add the remaining failing evidence tests**

Add all required runs:

- RSI discriminator: PPV-before-first-attempt versus no PPV.
- Standard IV discriminator: mask PPV timestamp before rocuronium versus rocuronium timestamp first.
- Rescue chain exact order:

```js
expect(actions).toEqual([
  'intubation_attempt_started',
  'intubation_attempt_failed',
  'cricoid_pressure_applied',
  'mask_ppv_started',
  'intubation_attempt_started',
  'intubation_attempt_succeeded',
]);
expect(afterPpv.spo2).toBeGreaterThan(beforePpv.spo2);
```

- Correct RSI: cricoid entry and no PPV entry before first attempt.
- Desaturation timing: room-air failed attempt has `desaturatedBelow90 === true` and finite crossing; preoxygenated equivalent has `false` and `null`.
- Preoxygenation curve with ETO2 over 90%.
- Combined determinism with serialized samples at mid-PPV, mid-attempt, and endpoint.

- [x] **Step 2: Run evidence to identify the first RED assertion**

Run: `cd crisis-sim && npx vitest run test/airway-gaps-evidence.test.js --reporter=verbose`

Expected: any remaining failure identifies one unmet evidence contract. Apply the systematic-debugging workflow to the first failure only; do not stack speculative corrections.

- [x] **Step 3: Make only evidence-driven corrections**

Correct source behavior, never expected values or derived vitals. For desaturation timing, sample actual `patient.spO2` during each active procedure tick and latch the first `< 90` elapsed timestamp. For oxygenation recovery, choose a rescue PPV interval long enough for the existing oxygen model to show a rise; do not assign saturation.

- [x] **Step 4: Add the printable evidence driver**

The Node driver runs the same public APIs and prints:

```text
PPV SUPPORT CURVE
t, supported_spo2, supported_etco2, withheld_spo2, withheld_etco2
...
PREOXYGENATION APNEA CURVES
t, room_air_spo2, room_air_eto2, preox_spo2, preox_eto2
...
RSI RESCUE ORDER
...
DETERMINISM fingerprint_a=... fingerprint_b=... equal=true
```

Use fixed samples and JSON/string fingerprints; do not round before comparing bit-identical values.

- [x] **Step 5: Verify all evidence**

Run:

```bash
cd crisis-sim
npx vitest run test/airway-gaps-evidence.test.js --reporter=verbose
node test/airway-gaps-evidence.mjs
```

Expected: all twelve evidence contracts pass and the printed fingerprints are equal.

- [x] **Step 6: Commit**

```bash
git add crisis-sim/test/airway-gaps-evidence.test.js crisis-sim/test/airway-gaps-evidence.mjs
git commit -m "Prove airway rubric evidence"
```

### Task 7: Instructor console, timed smoke case, and PWA cache

**Files:**
- Modify: `ui/liveSimView.js`
- Modify: `docs/live-sim-integration.md`
- Modify: `crisis-sim/test/app-integration.test.js`
- Modify: `crisis-sim/test/live-case-smoke.mjs`
- Modify: `sw.js`
- Modify: `crisis-sim/test/pwa-contract.test.js`

- [x] **Step 1: Write failing UI and smoke contracts**

Update integration tests to require instructor controls for timed PPV and apply/release cricoid, an intubation-in-progress status/countdown, and no direct device mutation from the intubate button.

Update the smoke case to:

```js
const started = runner.intubate();
assert.equal(started.ok, true, started.reason);
assert.equal(runner.snapshot().airwayDevice, 'mask');
advance(runner, started.plannedDurationSec);
assert.equal(runner.snapshot().lastIntubationOutcome, 'succeeded');
assert.equal(runner.snapshot().airwayDevice, 'intubated');
runner.setVentMode(VentMode.VCV);
```

Require `/crisis-sim/sim/airwayProcedureSystem.js` in the PWA cache contract.

- [x] **Step 2: Run tests to verify RED**

Run:

```bash
cd crisis-sim
npx vitest run test/app-integration.test.js test/pwa-contract.test.js --reporter=verbose
node test/live-case-smoke.mjs
```

Expected: console/PWA assertions and the old immediate smoke assumption fail.

- [x] **Step 3: Update the instructor console**

Bind the controls only to `SimRunner` methods. Show `Attempt N · Xs remaining` while active; report failure while retaining mask state; report success only when the snapshot changes to `intubated`. Leave ventilator selection explicit. Do not assign patient vitals or airway fields in the view.

Document the exact APIs and the operator change in `docs/live-sim-integration.md`.

- [x] **Step 4: Update smoke and cache**

Advance the smoke case through the timed attempt and explicitly select VCV afterward. Add the new module URL and bump the service-worker cache name so installed apps receive the engine file.

- [x] **Step 5: Verify UI, smoke, and PWA GREEN**

Run:

```bash
cd crisis-sim
npx vitest run test/app-integration.test.js test/pwa-contract.test.js --reporter=verbose
node test/live-case-smoke.mjs
```

Expected: instructor, timed smoke, and cache contracts all pass.

- [x] **Step 6: Commit**

```bash
git add ui/liveSimView.js docs/live-sim-integration.md crisis-sim/test/app-integration.test.js crisis-sim/test/live-case-smoke.mjs sw.js crisis-sim/test/pwa-contract.test.js
git commit -m "Move live intubation to timed airway attempts"
```

### Task 8: Full regression and final documentation audit

**Files:**
- Modify: `docs/airway-gaps-model.md`
- Modify: `docs/superpowers/plans/2026-07-14-engine-airway-gaps.md`

- [x] **Step 1: Reconcile implemented names and output with the model**

Compare every public method, snapshot key, event name, config field, record field, simplification, and live-UI statement against the implementation. Update only genuine implementation facts; do not weaken the approved requirements.

- [x] **Step 2: Run the complete verification matrix fresh**

```bash
cd crisis-sim
npm test -- --run
node test/snapshot-contract.mjs
node test/live-case-smoke.mjs
node test/airway-gaps-evidence.mjs
npx vitest run test/parity.test.js --reporter=verbose
git diff --check
```

Expected:

- all Vitest files/tests pass;
- snapshot contract passes with exact key count;
- the full induction-to-emergence smoke case passes;
- evidence output contains both curves, ordered rescue chain, and equal fingerprints;
- all frozen high-spinal/MH parity assertions and exposure guard pass;
- no whitespace errors.

If the same test fails three times after three root-cause-based corrections, stop and report the blocker. Any broken frozen non-rocuronium fixture is an immediate stop condition.

- [x] **Step 3: Inspect scope and repository state**

```bash
git status --short
git diff --stat 7923dc9..HEAD
git log --oneline 7923dc9..HEAD
```

Confirm no unrelated user files changed and no remote push occurred.

- [x] **Step 4: Mark this plan complete and make the final feature commit**

```bash
git add docs/airway-gaps-model.md docs/superpowers/plans/2026-07-14-engine-airway-gaps.md
git commit -m "Record airway gaps verification"
```

- [x] **Step 5: Prepare the final report**

Paste the complete verification counts, PPV/withheld curve, preoxygenated/non-preoxygenated curve, ordered rescue log, desaturation timing records, determinism fingerprints, frozen parity result, commit ID, branch, and explicit `not pushed` status. State exactly that the operator now experiences a timed unsupported laryngoscopy interval and must enable ventilation separately after successful tube placement.
