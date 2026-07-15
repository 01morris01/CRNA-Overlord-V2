# Lidocaine PK/PD and Regional Anesthesia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one deterministic Lidocaine exposure model shared by IV dosing, regional depots, local block, surgical-stimulation attenuation, antiarrhythmic effects, LAST, and lipid rescue.

**Architecture:** A new RNG-free `LidocaineSystem` owns mass and route-local state and publishes exposure-derived contributions. PatientPhysiology composes those contributions with existing hemodynamic drivers; ScenarioManager delegates administrative LAST into the same exposure; SimRunner remains the sole UI boundary. All new calculations use float32 helpers and remain inert when unused.

**Tech Stack:** JavaScript ES modules, deterministic 50 Hz engine, float32 helper layer, Vitest, static live UI, existing scenario/debrief/PWA infrastructure.

---

## File map

- Create `crisis-sim/sim/lidocaineSystem.js`: systemic PK, route depots, local block, toxicity, lipid state, copied histories.
- Modify `crisis-sim/sim/index.js`: export and wire `l` into both rig builders.
- Modify `crisis-sim/sim/simulationCore.js`: tick/reset the RNG-free subsystem before patient physiology.
- Modify `crisis-sim/sim/patientPhysiology.js`: compose stimulation, sympathectomy, antiarrhythmic, CNS, and cardiac contributions.
- Modify `crisis-sim/sim/scenario/scenarioManager.js`: delegate administrative LAST and record exposure-driven events.
- Modify `crisis-sim/ui/simRunner.js`: public actions, snapshot, histories, debrief context.
- Modify `ui/liveSimModel.js`: Lidocaine dose math and route metadata.
- Modify `ui/liveSimView.js`: IV/regional/stimulus/lipid controls and live status.
- Modify `assets/css/live-sim.css`: clinical-panel layout and warnings.
- Create `crisis-sim/test/lidocaine-system.test.js`: unit PK, validation, mass balance, depots, toxicity, rescue.
- Create `crisis-sim/test/lidocaine-evidence.test.js`: physiologic, rubric, and determinism evidence.
- Create `crisis-sim/test/lidocaine-evidence.mjs`: printable curves and fingerprints.
- Modify live-runner, UI-model, integration, smoke, snapshot, PWA, and parity tests.
- Create `docs/lidocaine-model.md`: implemented equations, calibration, limitations, and evidence.

### Task 1: Establish the Lidocaine public state and validation contract

**Files:**
- Create: `crisis-sim/test/lidocaine-system.test.js`
- Create: `crisis-sim/sim/lidocaineSystem.js`

- [x] **Step 1: Write failing validation and immutable-history tests**

```js
import { describe, expect, it } from 'vitest';
import { LidocaineSystem } from '../sim/lidocaineSystem.js';

describe('LidocaineSystem public actions', () => {
  it('accepts one IV infusion and updates its rate instead of duplicating it', () => {
    const l = new LidocaineSystem();
    l.weightKg = 70;
    l.startInfusion({ rateMgPerKgHour: 1.5 });
    l.startInfusion({ rateMgPerKgHour: 2 });
    expect(l.infusionActive).toBe(true);
    expect(l.infusionRateMgPerKgHour).toBe(2);
    expect(l.doseHistory.map((x) => x.type)).toEqual(['infusion_started', 'infusion_rate_changed']);
  });

  it('derives regional total milligrams and classifies route limits', () => {
    const l = new LidocaineSystem();
    l.weightKg = 70;
    const accepted = l.administerRegional({ route: 'peripheral', concentrationPercent: 1.5, volumeMl: 20, epinephrine: false });
    expect(accepted).toMatchObject({ totalDoseMg: 300, doseMgKg: 300 / 70, doseLimitStatus: 'within_limit' });
    const history = l.regionalHistory;
    history[0].remainingMg = 0;
    expect(l.regionalHistory[0].remainingMg).toBe(300);
  });

  it.each([
    [{ doseMgPerKg: -1 }], [{ doseMgPerKg: Number.NaN }],
  ])('rejects invalid IV bolus input %j', (options) => {
    const l = new LidocaineSystem();
    expect(() => l.giveIvBolus(options)).toThrow(RangeError);
  });
});
```

- [x] **Step 2: Run and verify RED**

```bash
cd crisis-sim
npx vitest run test/lidocaine-system.test.js --reporter=verbose
```

Expected: module-not-found failure for `lidocaineSystem.js`.

- [x] **Step 3: Implement the minimal action/state shell**

Create `LidocaineSystem` with weight, fixed-step time/tick count, one infusion, dose/regional/toxicity/lipid histories, input validation, copied getters, `giveIvBolus`, `startInfusion`, `stopInfusion`, and `administerRegional`. Use `f()` for stored numeric state. Do not implement kinetics in this step.

Regional dose:

```js
const totalDoseMg = f(concentrationPercent * 10 * volumeMl);
const doseMgKg = f(totalDoseMg / weightKg);
const maxMg = epinephrine ? Math.min(f(7 * weightKg), 500) : Math.min(f(4.5 * weightKg), 300);
```

- [x] **Step 4: Run and verify GREEN**

```bash
cd crisis-sim
npx vitest run test/lidocaine-system.test.js --reporter=verbose
```

Expected: action/validation tests pass.

- [x] **Step 5: Commit the shell**

```bash
git add crisis-sim/sim/lidocaineSystem.js crisis-sim/test/lidocaine-system.test.js
git commit -m "Add Lidocaine action state"
```

### Task 2: Implement systemic two-compartment PK, binding, and mass balance

**Files:**
- Modify: `crisis-sim/sim/lidocaineSystem.js`
- Modify: `crisis-sim/test/lidocaine-system.test.js`

- [x] **Step 1: Add failing PK-anchor tests**

Add helpers that tick at `0.02` seconds and sample a 70 kg patient after a 1.5 mg/kg bolus. Assert:

```js
expect(sampleAt(0).plasmaTotalMcgMl).toBeCloseTo(105 / 43, 5);
expect(sampleAt(120).plasmaTotalMcgMl).toBeLessThan(sampleAt(0).plasmaTotalMcgMl);
expect(terminalHalfLifeMinutes).toBeGreaterThanOrEqual(90);
expect(terminalHalfLifeMinutes).toBeLessThanOrEqual(120);
expect(massBalanceErrorMg).toBeLessThan(0.02);
expect(freeAt1.boundFraction).toBeCloseTo(0.8, 5);
expect(freeAt4.boundFraction).toBeCloseTo(0.6, 5);
```

Add an infusion test showing 1.5 mg/kg/hour adds exactly 1.75 mg/min for a 70 kg patient before distribution/elimination.

Add a clearance-factor test proving the default is exactly `1`, the factor is independently queryable, and changing it alters elimination without changing dose input or another physiologic driver.

- [x] **Step 2: Run and verify RED**

```bash
cd crisis-sim
npx vitest run test/lidocaine-system.test.js -t "two-compartment|mass balance|binding|infusion" --reporter=verbose
```

Expected: missing tick/concentration getters.

- [x] **Step 3: Implement systemic tick**

Use reference constants `Vc=43`, `Vp=56`, `Cl=0.95`, `Q=1.0` L or L/min, weight-scaled as specified. Per minute:

```js
const cCentral = centralMg / vcL;
const cPeripheral = peripheralMg / vpL;
const eliminated = clLMin * cCentral * dtMinutes;
const exchanged = qLMin * (cCentral - cPeripheral) * dtMinutes;
centralMg += infusionMg - eliminated - exchanged;
peripheralMg += exchanged;
```

Use nonnegative bounded transfers so no compartment crosses below zero. Store eliminated mass separately. Update the effect site toward free concentration with `ke0 = ln(2)/2 min` through the float32 layer.

- [x] **Step 4: Verify focused and full unit tests**

```bash
cd crisis-sim
npx vitest run test/lidocaine-system.test.js --reporter=verbose
```

Expected: all PK and public-state tests pass.

- [x] **Step 5: Commit systemic PK**

```bash
git add crisis-sim/sim/lidocaineSystem.js crisis-sim/test/lidocaine-system.test.js
git commit -m "Model systemic Lidocaine kinetics"
```

### Task 3: Add regional absorption and local block pharmacodynamics

**Files:**
- Modify: `crisis-sim/sim/lidocaineSystem.js`
- Modify: `crisis-sim/test/lidocaine-system.test.js`

- [x] **Step 1: Add failing route-order, epinephrine, and block tests**

Use matched 70 kg/200 mg cases and assert at documented calibration times:

```js
expect(epidural.fastRemainingMg).toBeLessThan(epidural.slowRemainingMg);
expect(peripheral.timeToCmaxMin).toBeGreaterThanOrEqual(108);
expect(peripheral.timeToCmaxMin).toBeLessThanOrEqual(168);
expect(infiltration.cmaxMcgMl).toBeLessThan(peripheral.cmaxMcgMl);
expect(withEpinephrine.cmaxMcgMl).toBeLessThan(withoutEpinephrine.cmaxMcgMl);
expect(withEpinephrine.blockDurationSec).toBeGreaterThan(withoutEpinephrine.blockDurationSec);
expect(peripheral.peakMotorBlock).toBeGreaterThan(infiltration.peakMotorBlock);
expect(epidural.peakSympathectomy).toBeGreaterThan(0);
```

- [x] **Step 2: Run and verify RED**

```bash
cd crisis-sim
npx vitest run test/lidocaine-system.test.js -t "regional|epinephrine|block" --reporter=verbose
```

Expected: missing route tick/block fields.

- [x] **Step 3: Implement route depots**

Epidural uses normalized fast/slow fractions and half-lives 9.3/82 minutes. Peripheral absorption is calibrated by test to the `2.3 +/- 0.5 hour` Tmax band. Infiltration uses a 120-minute absorption half-life. Epinephrine multiplies every absorption `ka` by `0.5`.

Move absorbed mass into central mass each tick. Drive route-local sensory/motor values toward potency from remaining depot concentration and dose; infiltration motor target is capped low, peripheral and epidural are not. Record Cmax, peak block, and completion without mutating returned history objects.

- [x] **Step 4: Verify unit suite**

```bash
cd crisis-sim
npx vitest run test/lidocaine-system.test.js --reporter=verbose
```

Expected: route ordering, mass balance, block, and prior PK tests pass.

- [x] **Step 5: Commit regional PK/PD**

```bash
git add crisis-sim/sim/lidocaineSystem.js crisis-sim/test/lidocaine-system.test.js
git commit -m "Model regional Lidocaine depots"
```

### Task 4: Wire the additive subsystem into rigs and physiology

**Files:**
- Modify: `crisis-sim/sim/index.js`
- Modify: `crisis-sim/sim/simulationCore.js`
- Modify: `crisis-sim/sim/patientPhysiology.js`
- Create: `crisis-sim/test/lidocaine-evidence.test.js`
- Modify: `crisis-sim/test/parity.test.js`

- [x] **Step 1: Write failing rig-inertness and stimulation tests**

```js
it('adds l without moving the unused frozen physiology path', () => {
  const rig = buildPhysRig(12345);
  expect(rig.l).toBeInstanceOf(LidocaineSystem);
  expect(rig.l.rng).toBeNull();
});

it('regional sensory block attenuates the same imposed stimulus', () => {
  const control = runStimulus({ block: false });
  const blocked = runStimulus({ block: true });
  expect(control.peakHr).toBeGreaterThan(blocked.peakHr + 10);
  expect(control.peakMap).toBeGreaterThan(blocked.peakMap + 8);
});
```

Add an epidural test proving graded SVR reduction occurs through `epiduralSympathectomyContribution`, not `_sympSeverity`.

- [x] **Step 2: Run and verify RED**

```bash
cd crisis-sim
npx vitest run test/lidocaine-evidence.test.js test/parity.test.js --reporter=verbose
```

Expected: missing rig key and patient drivers; frozen parity remains green.

- [x] **Step 3: Wire and compose**

Create `l`, set `l.patient = p`, expose `{p,d,v,a,l,...}`, add `core.lidocaineSystem`, and tick `l` after general drugs but before patient physiology. Do not give it `core.rng`.

Patient fields default to inert values. Derive:

```js
effectiveSurgicalStimulus = raw * (1 - regionalSensoryBlock * coverage)
  * (1 - 0.25 * systemicAnalgesicContribution);
```

Compose HR/SVR/cardiac contributions in `updateHemodynamics()` without assigning a vital. Reset all Lidocaine inputs to inert defaults.

- [x] **Step 4: Verify evidence and frozen parity**

```bash
cd crisis-sim
npx vitest run test/lidocaine-evidence.test.js test/parity.test.js --reporter=verbose
```

Expected: stimulus/epidural tests pass and all frozen parity assertions remain exact.

- [x] **Step 5: Commit engine integration**

```bash
git add crisis-sim/sim/index.js crisis-sim/sim/simulationCore.js crisis-sim/sim/patientPhysiology.js crisis-sim/test/lidocaine-evidence.test.js crisis-sim/test/parity.test.js
git commit -m "Compose Lidocaine with patient physiology"
```

### Task 5: Implement antiarrhythmic and shared LAST pathways

**Files:**
- Modify: `crisis-sim/sim/lidocaineSystem.js`
- Modify: `crisis-sim/sim/patientPhysiology.js`
- Modify: `crisis-sim/test/lidocaine-system.test.js`
- Modify: `crisis-sim/test/lidocaine-evidence.test.js`

- [x] **Step 1: Add failing therapeutic/toxic/arrhythmia tests**

Assert a therapeutic bolus has `toxicityStage === 'none'`, a therapeutic effect-site concentration suppresses an imposed ventricular-irritability driver, toxicity rises through warning/CNS/cardiac order, sedation suppresses visible seizure without lowering cardiac toxicity, and Lidocaine never converts an explicit VF state.

```js
expect(treated.effectiveVentricularIrritability).toBeLessThan(untreated.effectiveVentricularIrritability);
expect(therapeutic.lidocaineToxicityStage).toBe('none');
expect(toxic.transitions.map((x) => x.stage)).toEqual(['warning', 'cns', 'cardiac']);
expect(sedated.seizureActive).toBe(false);
expect(sedated.cardioToxicity).toBeGreaterThan(0);
expect(vfAfterLidocaine.derivedRhythm).toBe('ventricular_fibrillation');
```

- [x] **Step 2: Run and verify RED**

```bash
cd crisis-sim
npx vitest run test/lidocaine-system.test.js test/lidocaine-evidence.test.js -t "toxicity|arrhythm|seizure|therapeutic" --reporter=verbose
```

- [x] **Step 3: Implement concentration-to-effect mappings**

Add antiarrhythmic contribution over the therapeutic band, falling as cardiac toxicity increases. Add staged total-plasma thresholds from the spec, a sustained severe-CNS timer for seizure, and sustained severe-cardiac timer for collapse contribution. Publish drivers to patient; PatientPhysiology derives rhythm/status/hemodynamics.

- [x] **Step 4: Verify tests and parity**

```bash
cd crisis-sim
npx vitest run test/lidocaine-system.test.js test/lidocaine-evidence.test.js test/parity.test.js --reporter=verbose
```

Expected: therapeutic/toxic evidence passes; frozen parity remains exact.

- [x] **Step 5: Commit shared toxicity**

```bash
git add crisis-sim/sim/lidocaineSystem.js crisis-sim/sim/patientPhysiology.js crisis-sim/test/lidocaine-system.test.js crisis-sim/test/lidocaine-evidence.test.js
git commit -m "Derive Lidocaine therapy and toxicity"
```

### Task 6: Add lipid rescue through the exposure path

**Files:**
- Modify: `crisis-sim/sim/lidocaineSystem.js`
- Modify: `crisis-sim/test/lidocaine-system.test.js`
- Modify: `crisis-sim/test/lidocaine-evidence.test.js`

- [x] **Step 1: Write failing dose, cap, and recovery tests**

```js
expect(l.giveLipidBolus()).toMatchObject({ doseMlKg: 1.5 });
l.startLipidInfusion();
expect(l.lipidInfusionRateMlKgMin).toBe(0.25);
advanceUntilCapped(l);
expect(l.lipidCumulativeMlKg).toBe(12);
expect(adequateRescue.freePlasmaMcgMl).toBeLessThan(noRescue.freePlasmaMcgMl);
expect(adequateRescue.meanArterialPressure).toBeGreaterThan(noRescue.meanArterialPressure);
expect(inadequateRescue.toxicityStage).not.toBe('none');
```

- [x] **Step 2: Run and verify RED**

```bash
cd crisis-sim
npx vitest run test/lidocaine-system.test.js test/lidocaine-evidence.test.js -t "lipid|rescue" --reporter=verbose
```

- [x] **Step 3: Implement finite lipid binding**

Track cumulative mL/kg, enforce 12 mL/kg, and create a finite sink that transfers active central/free Lidocaine into `lipidBoundMg`. Release/eliminate bound mass slowly; do not write vitals. Record bolus, infusion, rate doubling, stop, and cap events.

- [x] **Step 4: Verify rescue and prior evidence**

```bash
cd crisis-sim
npx vitest run test/lidocaine-system.test.js test/lidocaine-evidence.test.js --reporter=verbose
```

- [x] **Step 5: Commit lipid rescue**

```bash
git add crisis-sim/sim/lidocaineSystem.js crisis-sim/test/lidocaine-system.test.js crisis-sim/test/lidocaine-evidence.test.js
git commit -m "Model lipid rescue for LAST"
```

### Task 7: Retire the parallel administrative LAST truth

**Files:**
- Modify: `crisis-sim/sim/scenario/scenarioManager.js`
- Modify: `crisis-sim/sim/index.js`
- Modify: `crisis-sim/ui/simRunner.js`
- Modify: `crisis-sim/test/lidocaine-evidence.test.js`
- Modify: `crisis-sim/test/live-runner.test.js`

- [ ] **Step 1: Add failing administrative-path integrity test**

Inject `LocalAnestheticToxicity` and assert central Lidocaine exposure rises, `last_exposure_injected` is logged, and no independent `_lastCnsTox`/`_lastCardiacTox` state exists. Assert naturally overdosed regional Lidocaine reaches the same toxicity mapper without an administrative injection event.

- [ ] **Step 2: Run and verify RED**

```bash
cd crisis-sim
npx vitest run test/lidocaine-evidence.test.js test/live-runner.test.js -t "administrative|shared LAST" --reporter=verbose
```

- [ ] **Step 3: Delegate ScenarioManager**

Wire `scenario.lidocaineSystem = l`. Replace `triggerLAST(true, 3.5)` with `l.injectToxicExposure({ targetPlasmaMcgMl: 10 })`. Remove advancement of independent LAST severity fields and have scenario prompts/events observe shared stage transitions.

- [ ] **Step 4: Verify scenario and parity**

```bash
cd crisis-sim
npx vitest run test/lidocaine-evidence.test.js test/live-runner.test.js test/parity.test.js --reporter=verbose
```

- [ ] **Step 5: Commit scenario integration**

```bash
git add crisis-sim/sim/scenario/scenarioManager.js crisis-sim/sim/index.js crisis-sim/ui/simRunner.js crisis-sim/test/lidocaine-evidence.test.js crisis-sim/test/live-runner.test.js
git commit -m "Unify LAST with Lidocaine exposure"
```

### Task 8: Expose exact SimRunner actions, snapshot, and debrief

**Files:**
- Modify: `crisis-sim/ui/simRunner.js`
- Modify: `crisis-sim/test/live-runner.test.js`
- Modify: `crisis-sim/test/snapshot-contract.mjs`
- Modify: `crisis-sim/sim/scenario/scenarioDebrief.js`
- Modify: `crisis-sim/test/live-case-smoke.mjs`

- [ ] **Step 1: Add failing public-action tests**

Test every approved signature, READY auto-start behavior for clinical doses/stimulus, PAUSED queued feedback, copied regional histories, and rejection behavior. Add the exact snapshot keys/types from the spec.

The public-action test must call this exact surface so the UI cannot invent aliases:

```js
giveLidocaineBolus({ doseMgPerKg: 1.5 })
startLidocaineInfusion({ rateMgPerKgHour: 1.5 })
stopLidocaineInfusion()
administerRegionalLidocaine({ route: 'peripheral', concentrationPercent: 1.5, volumeMl: 20, epinephrine: false })
setSurgicalStimulus(0.8)
setVentricularIrritability(0.7)
giveLipidEmulsionBolus()
startLipidEmulsionInfusion()
stopLipidEmulsionInfusion()
```

The snapshot contract must account for every primitive and copied array listed in the approved spec, including `lidocaineClearanceFactor`, both raw/effective stimulation and irritability values, `derivedRhythm`, and all four Lidocaine/lipid histories. It must also prove mutations to returned records cannot change engine state.

- [ ] **Step 2: Run and verify RED**

```bash
cd crisis-sim
npx vitest run test/live-runner.test.js --reporter=verbose
node test/snapshot-contract.mjs
```

- [ ] **Step 3: Implement wrapper methods**

Delegate to `this.l`; translate engine records to runner log entries without changing physiology. Extend snapshot with every primitive/history in the spec. Add Lidocaine exposure/block/toxicity/rescue/TOF context to debrief without removing existing respiratory attribution.

- [ ] **Step 4: Update smoke with an inert therapeutic Lidocaine segment**

Give 1.5 mg/kg IV during induction, assert exposure appears and remains below warning toxicity, then complete the existing induction-to-emergence path unchanged.

- [ ] **Step 5: Verify runner/snapshot/smoke**

```bash
cd crisis-sim
npx vitest run test/live-runner.test.js --reporter=verbose
node test/snapshot-contract.mjs
node test/live-case-smoke.mjs
```

- [ ] **Step 6: Commit wrapper contract**

```bash
git add crisis-sim/ui/simRunner.js crisis-sim/sim/scenario/scenarioDebrief.js crisis-sim/test/live-runner.test.js crisis-sim/test/snapshot-contract.mjs crisis-sim/test/live-case-smoke.mjs
git commit -m "Expose live Lidocaine actions"
```

### Task 9: Build Lidocaine, stimulation, and lipid live controls

**Files:**
- Modify: `ui/liveSimModel.js`
- Modify: `ui/liveSimView.js`
- Modify: `assets/css/live-sim.css`
- Modify: `crisis-sim/test/live-ui-model.test.js`
- Modify: `crisis-sim/test/app-integration.test.js`

- [ ] **Step 1: Write failing dose and markup tests**

Add pure dose tests:

```js
expect(computeRegionalLidocaineDose({ concentrationPercent: 1.5, volumeMl: 20, weightKg: 70, epinephrine: false })).toMatchObject({
  totalMg: 300, doseMgKg: 300 / 70, maximumMg: 300, exceeded: false,
});
```

Assert all approved element IDs and exact runner method calls appear in `liveSimView.js`.

- [ ] **Step 2: Run and verify RED**

```bash
cd crisis-sim
npx vitest run test/live-ui-model.test.js test/app-integration.test.js --reporter=verbose
```

- [ ] **Step 3: Implement pure model helpers**

Add route metadata, dose-limit math, unit formatting, and toxicity/status presentation with no DOM dependencies.

- [ ] **Step 4: Render and bind controls**

Add IV bolus/infusion, regional route/concentration/volume/epinephrine, stimulus, and lipid controls exactly as specified. Update computed dose preview on every relevant input. Show warnings without disabling administration. Render current plasma/effect-site/block/toxicity/rescue values from snapshots.

- [ ] **Step 5: Verify UI tests**

```bash
cd crisis-sim
npx vitest run test/live-ui-model.test.js test/app-integration.test.js --reporter=verbose
```

- [ ] **Step 6: Commit UI**

```bash
git add ui/liveSimModel.js ui/liveSimView.js assets/css/live-sim.css crisis-sim/test/live-ui-model.test.js crisis-sim/test/app-integration.test.js
git commit -m "Add live Lidocaine controls"
```

### Task 10: Produce evidence, docs, cache, and final regression

**Files:**
- Create: `crisis-sim/test/lidocaine-evidence.mjs`
- Modify: `crisis-sim/test/lidocaine-evidence.test.js`
- Create: `docs/lidocaine-model.md`
- Modify: `docs/live-sim-integration.md`
- Modify: `sw.js`
- Modify: `crisis-sim/test/pwa-contract.test.js`
- Modify: `docs/superpowers/plans/2026-07-15-lidocaine-pkpd.md`

- [ ] **Step 1: Build printable evidence output**

Print CSV/JSON for:

- IV bolus and infusion concentration curves;
- matched route and epinephrine curves;
- block/stimulation HR/MAP comparison;
- therapeutic vs toxic exposure;
- ordered LAST transitions;
- adequate/inadequate lipid rescue;
- mid-absorption, mid-stimulation, mid-arrhythmia, mid-toxicity, and mid-rescue fingerprints.

Add a pre-feature no-Lidocaine combined-run fingerprint assertion. It must match the prior value exactly, proving the new subsystem is inert and consumes no RNG when unused.

- [ ] **Step 2: Write the model document**

Document exact equations/constants, public methods, snapshot keys, mass balance, event names, sources, route-average simplifications, toxicity thresholds, exclusions, and operator behavior.

- [ ] **Step 3: Update PWA cache**

Bump the cache name and include `/crisis-sim/sim/lidocaineSystem.js` plus every changed runtime UI/model module. Update the PWA contract test before changing `sw.js`, verify RED, then GREEN.

- [ ] **Step 4: Run the complete matrix fresh**

```bash
cd crisis-sim
npm test -- --run
node test/snapshot-contract.mjs
node test/live-case-smoke.mjs
node test/airway-gaps-evidence.mjs
node test/lidocaine-evidence.mjs
npx vitest run test/parity.test.js --reporter=verbose
git -C .. diff --check
```

Expected:

- every Vitest file and assertion passes;
- snapshot key/type count is exact;
- full induction-to-emergence smoke passes;
- airway and Lidocaine evidence scripts pass;
- determinism fingerprints match across paired executions;
- every frozen parity assertion remains exact;
- no whitespace errors.

- [ ] **Step 5: Inspect scope and mark plans complete**

```bash
git status --short
git diff --stat cf90b5b
git log --oneline cf90b5b..HEAD
```

Confirm no unrelated game/data files, no regenerated frozen fixture, no direct UI vital writes, and no RNG assigned to LidocaineSystem. Mark every completed checkbox in both implementation plans.

- [ ] **Step 6: Commit final evidence**

```bash
git add crisis-sim/test/lidocaine-evidence.mjs crisis-sim/test/lidocaine-evidence.test.js docs/lidocaine-model.md docs/live-sim-integration.md sw.js crisis-sim/test/pwa-contract.test.js docs/superpowers/plans/2026-07-15-live-sim-clinical-controls.md docs/superpowers/plans/2026-07-15-lidocaine-pkpd.md
git commit -m "Verify live Lidocaine simulation"
```

- [ ] **Step 7: Prepare final report**

Report test counts, curves, ordered toxicity/rescue events, mass-balance maximum error, deterministic fingerprints, rendered NIBP geometry results, frozen parity result, branch, commit, and explicit push/merge/deployment status. State that the default application will not change until this branch is integrated and deployed.
