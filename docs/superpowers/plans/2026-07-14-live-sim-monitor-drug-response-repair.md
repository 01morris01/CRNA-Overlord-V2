# Live Simulation Monitor and Drug Response Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair live-simulation drug timing, rocuronium clinical response, monitor layout, and waveform stability while retiring only the rocuronium-exposed parity contract.

**Architecture:** Keep physiologic truth in `crisis-sim`: a single float32 rocuronium concentration-to-blockade function feeds patient NMB derivation and reversal, while the runner exposes clock lifecycle results to the UI. Keep the second-screen display read-only by moving waveform history into a bounded rendering-only module and fixing layout through explicit primary/secondary grid contracts.

**Tech Stack:** JavaScript ES modules, Vitest, JSDOM, HTML/CSS Canvas 2D, service-worker PWA shell, Playwright/browser smoke checks.

---

## File map

- Create `crisis-sim/sim/neuromuscularModel.js`: pure float32 rocuronium effect-site concentration to blockade calculation.
- Create `ui/liveWaveformRenderer.js`: pure trace morphology plus stateful, bounded phase-integrating waveform buffers.
- Create `crisis-sim/test/live-waveform.test.js`: renderer continuity, missing-signal, bounds, and capacity tests.
- Modify `crisis-sim/sim/patientPhysiology.js`: consume the single shared NMB calculation.
- Modify `crisis-sim/sim/drugSystem.js`: consume the same NMB calculation for reversal eligibility/effect.
- Modify `crisis-sim/ui/simRunner.js`: expose READY/RUNNING/PAUSED lifecycle and structured dose/preoxygenation results.
- Modify `ui/liveSimView.js`: start from READY, queue visibly while PAUSED, and update START/RESUME controls without writing vitals.
- Modify `ui/liveSimDisplay.js`: render rolling samples from the display-only waveform module.
- Modify `live-sim-display.html` and `styles.css`: implement layout B and prevent numeric/canvas overflow.
- Modify `crisis-sim/test/parity.test.js`: exclude only the rocuronium-exposed RSI fixture and preserve the eight frozen non-rocuronium assertions.
- Modify focused Vitest files under `crisis-sim/test/`: add clinical anchors, orthogonality, reversal, lifecycle, display DOM/CSS, and PWA contracts.
- Modify `sw.js`: cache the new waveform module and increment the cache namespace.

### Task 1: Retire only the rocuronium parity contract

**Files:**
- Modify: `crisis-sim/test/parity.test.js`
- Test: `crisis-sim/test/parity.test.js`

- [x] **Step 1: Add an explicit retired-case contract before changing engine behavior**

Define immutable case lists in the parity test:

```js
const RETIRED_NMB_PARITY_CASES = Object.freeze([
  'rsi_hypotension_001.json',
]);

const FROZEN_PARITY_CASES = Object.freeze([
  'high_spinal_001.json',
  'malignant_hyperthermia_001.json',
]);
```

Add a test that loads each retired fixture, proves it has a `rocuronium` action, and loads each frozen fixture, proves it has none. Generate parity assertions only for `FROZEN_PARITY_CASES`; do not edit, delete, or regenerate fixture JSON.

- [x] **Step 2: Run the focused parity suite**

Run: `cd crisis-sim && npx vitest run test/parity.test.js --reporter=verbose`

Expected: the exposure-boundary contract and all eight high-spinal/MH frozen assertions pass. Any changed frozen assertion is a stop condition; do not update expected fixture data.

- [x] **Step 3: Commit the contract retirement**

```bash
git add crisis-sim/test/parity.test.js
git commit -m "Retire rocuronium parity contract"
```

### Task 2: Recalibrate one shared rocuronium NMB path

**Files:**
- Create: `crisis-sim/sim/neuromuscularModel.js`
- Modify: `crisis-sim/sim/patientPhysiology.js`
- Modify: `crisis-sim/sim/drugSystem.js`
- Modify: `crisis-sim/test/neuromuscular.test.js`
- Test: `crisis-sim/test/neuromuscular.test.js`

- [x] **Step 1: Write failing clinical-anchor tests**

Add deterministic 70 kg, 0.6 mg/kg rocuronium tests using the real patient/drug update loop:

```js
expect(at60.effectiveNmbBlockade).toBeGreaterThanOrEqual(0.80);
expect(at60.centralDrive).toBeCloseTo(baseline.centralDrive, 5);
expect(at180.effectiveNmbBlockade).toBeGreaterThanOrEqual(0.95);
expect(at180.trainOfFourCount).toBe(0);
expect(at180.respiratoryMuscleCapability).toBeLessThanOrEqual(0.10);
expect(at15min.effectiveNmbBlockade).toBeGreaterThanOrEqual(0.75);
expect(recovery25Seconds).toBeGreaterThanOrEqual(15 * 60);
expect(recovery25Seconds).toBeLessThanOrEqual(85 * 60);
```

Also add a pure-function contract that the same exported `rocuroniumBlockFromCe()` result is observed by patient update and neostigmine reversal eligibility. Assert outputs are `Math.fround`-stable and clamped to `[0, 1]`.

- [x] **Step 2: Run the NMB tests to verify RED**

Run: `cd crisis-sim && npx vitest run test/neuromuscular.test.js --reporter=verbose`

Expected: FAIL because the current `rocuroniumCe / 3` curve misses the onset and depth anchors and the shared function does not yet exist.

- [x] **Step 3: Implement the minimal shared float32 model**

Create a pure module with one public mapping and no patient state:

```js
const f = Math.fround;

export function rocuroniumBlockFromCe(effectSiteConcentration) {
  const ce = f(Math.max(0, Number(effectSiteConcentration) || 0));
  // Apply the smallest calibrated float32 curve that satisfies the approved
  // onset, maximum-block, and clinical-duration anchors.
  return f(Math.max(0, Math.min(1, calibratedBlock)));
}
```

Replace both duplicated `Clamp01(rocuroniumCe / 3)` calculations with calls to this function. Do not introduce a second paralysis variable or alter `centralDrive`.

- [x] **Step 4: Tune only against stated clinical anchors and verify GREEN**

Run: `cd crisis-sim && npx vitest run test/neuromuscular.test.js --reporter=verbose`

Expected: all NMB clinical-anchor and shared-state tests pass, including a reported 25%-twitch recovery time inside 15–85 minutes.

- [x] **Step 5: Guard frozen parity immediately**

Run: `cd crisis-sim && npx vitest run test/parity.test.js --reporter=verbose`

Expected: all eight frozen parity assertions and the retirement-boundary contract pass. Stop on any non-rocuronium fixture change.

- [x] **Step 6: Commit the shared NMB calibration**

```bash
git add crisis-sim/sim/neuromuscularModel.js crisis-sim/sim/patientPhysiology.js crisis-sim/sim/drugSystem.js crisis-sim/test/neuromuscular.test.js
git commit -m "Calibrate shared rocuronium blockade model"
```

### Task 3: Prove reversal and airway/drive orthogonality

**Files:**
- Modify: `crisis-sim/test/reversal.test.js`
- Modify: `crisis-sim/test/neuromuscular.test.js`
- Modify only if evidence fails: `crisis-sim/sim/drugSystem.js`
- Modify only if evidence fails: `crisis-sim/sim/patientPhysiology.js`
- Test: `crisis-sim/test/reversal.test.js`
- Test: `crisis-sim/test/neuromuscular.test.js`

- [x] **Step 1: Add failing reversal evidence at the recalibrated block depth**

Exercise the public drug APIs and assert:

```js
expect(deepBlock.trainOfFourCount).toBe(0);
expect(() => giveNeostigmineAtTof0()).toThrow(/TOF|deep block/i);
expect(afterSugammadex.effectiveNmbBlockade).toBeLessThan(before.effectiveNmbBlockade);
expect(afterSugammadex.trainOfFourCount).toBeGreaterThanOrEqual(before.trainOfFourCount);
```

Keep existing sugammadex dose tiers and count-graded neostigmine selectivity. The TOF 0 neostigmine negative case is mandatory.

- [x] **Step 2: Add the same-drive/different-support orthogonality test**

Build two identical deeply blocked deterministic patients. Leave one unsupported; transition the other through the legal airway API to `intubated` with VCV on. After the same elapsed time assert equal central drive and different derived gas exchange:

```js
expect(supported.centralDrive).toBeCloseTo(unsupported.centralDrive, 5);
expect(supported.mechanicalMinuteVentilation).toBeGreaterThan(0);
expect(supported.etco2).toBeLessThan(unsupported.etco2);
expect(supported.spo2).toBeGreaterThan(unsupported.spo2);
```

- [x] **Step 3: Run the focused evidence to verify RED or expose exact gaps**

Run: `cd crisis-sim && npx vitest run test/reversal.test.js test/neuromuscular.test.js --reporter=verbose`

Expected: any failure names either reversal calibration or support derivation, not a UI behavior.

- [x] **Step 4: Make the smallest engine correction, if required**

Use the shared `rocuroniumBlockFromCe()` result for all reversal depth calculations. Preserve the existing composition:

```text
central drive × respiratory muscle capability + device/ventilator mechanical support
```

Do not write SpO2, EtCO2, RR, or MV directly in tests or UI.

- [x] **Step 5: Verify focused evidence and frozen parity**

Run:

```bash
cd crisis-sim
npx vitest run test/reversal.test.js test/neuromuscular.test.js --reporter=verbose
npx vitest run test/parity.test.js --reporter=verbose
```

Expected: reversal, TOF 0 negative, orthogonality, and all frozen parity contracts pass.

- [x] **Step 6: Commit orthogonality evidence**

```bash
git add crisis-sim/test/reversal.test.js crisis-sim/test/neuromuscular.test.js crisis-sim/sim/drugSystem.js crisis-sim/sim/patientPhysiology.js
git commit -m "Prove NMB reversal and support orthogonality"
```

### Task 4: Make runner drug and preoxygenation lifecycle explicit

**Files:**
- Modify: `crisis-sim/ui/simRunner.js`
- Modify: `ui/liveSimView.js`
- Modify: `crisis-sim/test/simRunner.test.js`
- Modify: `crisis-sim/test/live-sim-view.test.js`
- Test: `crisis-sim/test/simRunner.test.js`
- Test: `crisis-sim/test/live-sim-view.test.js`

- [x] **Step 1: Write failing runner lifecycle tests**

Cover all three states through public methods:

```js
expect(readyRunner.getLifecycleState()).toBe('READY');
expect(readyRunner.giveBolus('propofol', 140, 'Propofol').started).toBe(true);
expect(readyRunner.getLifecycleState()).toBe('RUNNING');
expect(runningRunner.giveBolus('rocuronium', 42, 'Rocuronium').queued).toBe(false);
pausedRunner.pause();
expect(pausedRunner.giveBolus('propofol', 20, 'Propofol').queued).toBe(true);
expect(pausedRunner.simTime).toBe(frozenTime);
```

Add a READY preoxygenation test that calls one runner operation, verifies machine FiO2 is 1.0, starts the clock, and records no drug.

- [x] **Step 2: Run runner tests to verify RED**

Run: `cd crisis-sim && npx vitest run test/simRunner.test.js --reporter=verbose`

Expected: FAIL because structured lifecycle results and READY auto-start/preoxygenation do not yet exist.

- [x] **Step 3: Implement the minimal runner API**

Add lifecycle derivation and structured results without changing engine vitals:

```js
getLifecycleState() {
  if (this.running) return 'RUNNING';
  return this.simTime > 0 ? 'PAUSED' : 'READY';
}

giveBolus(name, doseMg, label) {
  const state = this.getLifecycleState();
  this.drugs.administerBolus(name, doseMg);
  this.logEvent(/* existing event shape */);
  if (state === 'READY') this.start();
  return { state, started: state === 'READY', queued: state === 'PAUSED' };
}
```

Implement READY preoxygenation as the existing machine changes plus `start()`, returning `{ started, state }`. Do not start again from RUNNING and do not resume from PAUSED.

- [x] **Step 4: Verify runner GREEN**

Run: `cd crisis-sim && npx vitest run test/simRunner.test.js --reporter=verbose`

Expected: READY, RUNNING, PAUSED, and preoxygenation lifecycle tests pass.

- [x] **Step 5: Write failing controller feedback tests**

Use the real DOM/controller binding to assert:

```js
expect(status.textContent).toContain('EFFECT EVOLVES WITH SIMULATION TIME');
expect(pausedStatus.textContent).toContain('DOSE QUEUED — RESUME TO ADVANCE');
expect(startButton.textContent).toBe('RESUME');
```

Also assert preoxygenation changes the READY case label/clock state without adding a dose event.

- [x] **Step 6: Run controller tests to verify RED, then implement feedback**

Run: `cd crisis-sim && npx vitest run test/live-sim-view.test.js --reporter=verbose`

Expected before implementation: FAIL on explicit lifecycle feedback. Update `liveSimView.js` to consume runner results and update controls/status only; do not calculate or assign vitals.

- [x] **Step 7: Verify lifecycle suites and commit**

Run:

```bash
cd crisis-sim
npx vitest run test/simRunner.test.js test/live-sim-view.test.js --reporter=verbose
```

Expected: all lifecycle/controller tests pass.

```bash
git add crisis-sim/ui/simRunner.js ui/liveSimView.js crisis-sim/test/simRunner.test.js crisis-sim/test/live-sim-view.test.js
git commit -m "Start live physiology from ready actions"
```

### Task 5: Replace absolute-time traces with bounded rolling waveforms

**Files:**
- Create: `ui/liveWaveformRenderer.js`
- Create: `crisis-sim/test/live-waveform.test.js`
- Modify: `ui/liveSimDisplay.js`
- Test: `crisis-sim/test/live-waveform.test.js`

- [x] **Step 1: Write failing pure renderer tests**

Test the public module interface:

```js
const renderer = createWaveformRenderer({ sampleRate: 100, seconds: 6 });
renderer.advance(0.5, signalsAt(70));
const history = renderer.snapshot();
renderer.advance(0.1, signalsAt(71));
expect(renderer.snapshot().ecg.slice(0, history.ecg.length)).toEqual(history.ecg);
expect(renderer.snapshot().ecg.length).toBeLessThanOrEqual(600);
```

Add separate tests proving continuous phase, ECG/pleth cardiac-phase sharing, missing HR/SpO2 flatlines, `capnogramPresent !== true` flat CO2, frame-gap clamping, and every normalized sample within `[-1, 1]`.

- [x] **Step 2: Run renderer tests to verify RED**

Run: `cd crisis-sim && npx vitest run test/live-waveform.test.js --reporter=verbose`

Expected: FAIL because `ui/liveWaveformRenderer.js` does not exist.

- [x] **Step 3: Implement minimal rolling renderer**

Export pure morphology functions and `createWaveformRenderer()` with private cardiac/respiratory phase, a fixed logical sample rate, bounded arrays, and `advance(elapsedSeconds, signals)`. Clamp elapsed time to one reasonable frame-gap maximum; append new samples only. `snapshot()` returns copies so callers cannot mutate history.

- [x] **Step 4: Verify renderer GREEN**

Run: `cd crisis-sim && npx vitest run test/live-waveform.test.js --reporter=verbose`

Expected: all continuity, flatline, capacity, and bounds tests pass.

- [x] **Step 5: Integrate the renderer without changing transport or engine state**

In `ui/liveSimDisplay.js`, retain the latest received snapshot, advance the renderer from animation-frame elapsed time, and draw the returned history. Guard zero-sized canvases. Draw with vertical padding and clamp pixel Y inside that padding. Remove absolute-time phase calculation; do not send any rendered value back through BroadcastChannel or `localStorage`.

- [x] **Step 6: Run renderer and snapshot contracts**

Run:

```bash
cd crisis-sim
npx vitest run test/live-waveform.test.js test/snapshot-contract.test.js --reporter=verbose
```

Expected: renderer and engine-to-display snapshot contracts pass.

- [x] **Step 7: Commit the waveform repair**

```bash
git add ui/liveWaveformRenderer.js ui/liveSimDisplay.js crisis-sim/test/live-waveform.test.js
git commit -m "Stabilize live monitor waveform history"
```

### Task 6: Implement clinical-priority layout B and overflow contracts

**Files:**
- Modify: `live-sim-display.html`
- Modify: `styles.css`
- Modify: `crisis-sim/test/live-sim-display.test.js`
- Test: `crisis-sim/test/live-sim-display.test.js`

- [x] **Step 1: Write failing DOM/CSS contract tests**

Parse the display HTML and stylesheet. Assert the primary row contains HR, NIBP/MAP, SpO2, EtCO2/RR; the three waveform rows follow; TEMP/TOF occupy a separate secondary row. Assert the CSS includes a weighted NIBP column, BP `white-space: nowrap`, waveform `grid-template-columns: 70px minmax(0, 1fr)`, and waveform canvas `min-width: 0`.

- [x] **Step 2: Run layout tests to verify RED**

Run: `cd crisis-sim && npx vitest run test/live-sim-display.test.js --reporter=verbose`

Expected: FAIL because TEMP/TOF are still in the six-card primary grid and canvases retain intrinsic overflow.

- [x] **Step 3: Apply the minimal markup and CSS restructure**

Use this content order:

```text
education/header
primary: HR | wide NIBP/MAP | SpO2 | EtCO2/RR
ECG II | PLETH | CO2
secondary: TEMP | TOF/ratio
emergence/machine/alarms
```

Use a four-column weighted desktop grid, two-column laptop/tablet grid, and narrow phone fallback with no horizontal scrolling. Keep all existing DOM IDs consumed by `liveSimDisplay.js`.

- [x] **Step 4: Verify layout GREEN**

Run: `cd crisis-sim && npx vitest run test/live-sim-display.test.js --reporter=verbose`

Expected: all DOM ordering and non-clipping CSS contracts pass.

- [x] **Step 5: Commit layout B**

```bash
git add live-sim-display.html styles.css crisis-sim/test/live-sim-display.test.js
git commit -m "Prioritize live monitor vitals and traces"
```

### Task 7: Update PWA shell and cache contract

**Files:**
- Modify: `sw.js`
- Modify: `crisis-sim/test/pwa-contract.test.js`
- Test: `crisis-sim/test/pwa-contract.test.js`

- [x] **Step 1: Write the failing PWA cache test**

Require cache namespace `v49-live-sim-monitor-2026-07-14` and `/ui/liveWaveformRenderer.js` in the app-shell manifest while preserving every existing live-simulation asset.

- [x] **Step 2: Run PWA test to verify RED**

Run: `cd crisis-sim && npx vitest run test/pwa-contract.test.js --reporter=verbose`

Expected: FAIL because the current cache is v48 and the new module is absent.

- [x] **Step 3: Update the service worker**

Change only the cache namespace and app-shell asset list:

```js
const CACHE_NAME = 'v49-live-sim-monitor-2026-07-14';
// include '/ui/liveWaveformRenderer.js'
```

Do not remove unrelated shell assets.

- [x] **Step 4: Verify PWA GREEN and inspect the exact manifest diff**

Run:

```bash
cd crisis-sim
npx vitest run test/pwa-contract.test.js --reporter=verbose
cd ..
git diff -- sw.js crisis-sim/test/pwa-contract.test.js
```

Expected: PWA contract passes; diff shows exactly one cache bump plus the waveform module addition and matching test expectations.

- [x] **Step 5: Commit the cache update**

```bash
git add sw.js crisis-sim/test/pwa-contract.test.js
git commit -m "Refresh PWA cache for monitor repair"
```

### Task 8: Full evidence loop, browser inspection, and final commit

**Files:**
- Modify if evidence wording is stale: `docs/superpowers/specs/2026-07-14-live-sim-monitor-drug-response-design.md`
- Modify: `docs/superpowers/plans/2026-07-14-live-sim-monitor-drug-response-repair.md`
- Test: all `crisis-sim/test/*.test.js`

- [x] **Step 1: Run the complete automated suite**

Run: `cd crisis-sim && npm test`

Expected: all Vitest files and assertions pass. If a test fails, identify the first failing assertion and its root cause before editing. Three consecutive failed fixes on the same assertion is a stop condition.

- [x] **Step 2: Run frozen parity separately and preserve output**

Run: `cd crisis-sim && npx vitest run test/parity.test.js --reporter=verbose`

Expected: retirement-boundary contract plus eight frozen high-spinal/MH assertions pass. Any frozen failure is a stop condition.

- [x] **Step 3: Re-run and capture deterministic engine evidence**

Run Node scripts against real engine APIs for:

```text
preoxygenation: 3 min FiO2 1.0 then unsupported forced apnea vs immediate apnea
propofol: 70 kg, 2 mg/kg, drugDepressionContribution and spontaneous MV through 180 s
rocuronium: 70 kg, 0.6 mg/kg, block/TOF/muscle/central drive through onset and recovery
orthogonality: same block, unsupported vs intubated VCV, EtCO2/SpO2 through deterioration window
reversal: deep-block sugammadex response and TOF 0 neostigmine rejection
```

Expected: preoxygenation reserve is materially different; propofol depression remains graded but does not approach zero and is recorded as a Round 2 engine gap; rocuronium/reversal/orthogonality match automated anchors. Do not simulate any missing physiology in the UI.

- [x] **Step 4: Run snapshot and full induction-to-emergence smoke evidence explicitly**

Run the repository's named snapshot-contract and smoke-case Vitest files discovered with `rg -l "snapshot|induction.*emergence|smoke" crisis-sim/test`, then preserve the passing output.

- [x] **Step 5: Inspect in a local browser at three widths**

Serve the repository locally and use the real instructor and `/live-sim-display.html` pages. At phone, laptop, and classroom widths verify:

```text
READY propofol starts the clock and visibly evolves through engine snapshots
READY preoxygenation starts time without a drug
PAUSED dose reports queued and remains frozen until RESUME
NIBP diastolic remains in its card
complete pleth is visible
ECG history does not jump on small HR changes
rocuronium reduces TOF/muscle response without changing central drive
unsupported rocuronium deteriorates while intubated VCV remains supported
late join, refresh, paused heartbeat, and display connectivity remain intact
no browser console errors
```

Capture screenshots at the three viewport classes and console output as evidence. Browser rendering may never be used to override failed engine evidence.

- [x] **Step 6: Review the final diff for scope and truth boundaries**

Run:

```bash
git status --short
git diff origin/main...HEAD --stat
git diff origin/main...HEAD -- crisis-sim/sim crisis-sim/ui ui live-sim-display.html styles.css sw.js crisis-sim/test docs/superpowers
```

Expected: no unrelated game, regional-block, or character files; no direct UI writes to derived vitals; exactly one shared NMB mapping; no regenerated parity fixtures.

- [x] **Step 7: Mark this plan complete and commit final evidence documentation**

Check each completed plan item. If documentation changed after the last code commit:

```bash
git add docs/superpowers/specs/2026-07-14-live-sim-monitor-drug-response-design.md docs/superpowers/plans/2026-07-14-live-sim-monitor-drug-response-repair.md
git commit -m "Document live sim repair evidence"
```

- [x] **Step 8: Hand off without publishing**

Report the branch and commits, actual automated outputs, parity retirement/frozen list, FDA clinical anchors, audit curves, engine gaps, PWA manifest diff, and browser evidence. Do not push, merge, deploy, or modify the user's dirty main checkout.
