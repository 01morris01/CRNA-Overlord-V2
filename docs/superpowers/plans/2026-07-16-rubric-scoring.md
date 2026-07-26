# Carson-Newman Rubric Scoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build literal Carson-Newman rubric scoring, four deterministic scenarios, live instructor feedback, a source-aware debrief/print view, and a truth-boundary-safe instructor TOF control.

**Architecture:** A new `RubricScoringSession` runs beside the legacy `ScenarioScoring`. It consumes canonical runner actions and a one-second fixed-tick physiology trace, combines those facts with explicit instructor 2/1/0 selections, and appends a `rubricResult` to the existing `SimulationResult`. Administrative TOF changes replace the existing rocuronium PK state and never assign derived TOF or ventilation values.

**Tech Stack:** JavaScript ES modules, JSON static data, deterministic float32 engine, Vitest, browser DOM/CSS, static service worker.

---

## File map

New data and engine files:

- `data/rubrics/carson-newman-anesthesia-emergence.json` - literal nine-item rubric.
- `data/rubrics/carson-newman-standard-iv-induction.json` - literal fourteen-item rubric.
- `data/rubrics/carson-newman-rsi-induction.json` - literal fifty-three-row rubric and denominator warning metadata.
- `crisis-sim/sim/scenario/rubricLoader.js` - schema validation, count calculation, and immutable normalization.
- `crisis-sim/sim/scenario/rubricRules.js` - pure rule evaluators and violation detection.
- `crisis-sim/sim/scenario/rubricScoringSession.js` - canonical ledger, fixed trace, instructor decisions, live status, and final pass evaluation.
- `crisis-sim/sim/scenario/rubricDebrief.js` - additive `SimulationResult` result and observed-consequence extraction.
- `crisis-sim/sim/scenarios/standard_iv_healthy_001.json` - healthy standard induction case.
- `crisis-sim/sim/scenarios/rsi_full_stomach_001.json` - correct first-attempt RSI case.
- `crisis-sim/sim/scenarios/emergence_residual_block_001.json` - residual-block emergence case.
- `crisis-sim/sim/scenarios/rsi_failed_first_attempt_001.json` - deterministic rescue case.

Modified engine and integration files:

- `crisis-sim/sim/neuromuscularModel.js` - inverse Hill helper for administrative equilibrium targeting.
- `crisis-sim/sim/drugSystem.js` - replace current NMB exposure through the single rocuronium/succinylcholine/reversal state.
- `crisis-sim/sim/scenario/scenarioLoader.js` - preserve rubric/scenario metadata.
- `crisis-sim/sim/scenario/scenarioDebrief.js` - keep base result compatible while accepting additive rubric data.
- `crisis-sim/sim/index.js` - export rubric modules.
- `crisis-sim/ui/simRunner.js` - scenario/rubric lifecycle, deterministic sampling, normalized actions, assessment actions, and administrative TOF API.
- `ui/liveSimModel.js` - rubric presentation and validation helpers.
- `ui/liveSimView.js` - scenario selector, live rubric, flags, NMB controls, finalization, and print action.
- `assets/css/live-sim.css` - responsive rubric and print layout.
- `sw.js` - cache version and new static assets.

New and modified tests:

- `crisis-sim/test/rubric-data.test.js`
- `crisis-sim/test/rubric-session.test.js`
- `crisis-sim/test/rubric-rules.test.js`
- `crisis-sim/test/rubric-scenarios.test.js`
- `crisis-sim/test/rubric-debrief.test.js`
- `crisis-sim/test/rubric-ui.test.js`
- `crisis-sim/test/instructor-nmb.test.js`
- `crisis-sim/test/rubric-evidence.mjs`
- `crisis-sim/test/pwa-contract.test.js`
- `crisis-sim/test/live-case-smoke.mjs`

## Task 1: Encode and validate the literal rubrics

**Files:**

- Create: `data/rubrics/carson-newman-anesthesia-emergence.json`
- Create: `data/rubrics/carson-newman-standard-iv-induction.json`
- Create: `data/rubrics/carson-newman-rsi-induction.json`
- Create: `crisis-sim/sim/scenario/rubricLoader.js`
- Create: `crisis-sim/test/rubric-data.test.js`
- Modify: `crisis-sim/sim/index.js`

- [ ] **Step 1: Write failing source-contract tests**

Read the three approved source PDFs from the paths recorded below and encode text exactly, excluding only the critical asterisk because `critical` stores it:

```text
/Users/shawnmorris/Downloads/Carson-Newman_Anesthesia_Emergence_Rubric.pdf
/Users/shawnmorris/Downloads/Carson-Newman_Standard_IV_Induction_Rubric.pdf
/Users/shawnmorris/Downloads/Carson-Newman_RSI_Induction_Rubric.pdf
```

Create tests that load each JSON and assert the immutable contract:

```js
expect(summary(emergence)).toEqual({ items: 9, maxPoints: 18, critical: 5 });
expect(summary(standard)).toEqual({ items: 14, maxPoints: 28, critical: 10 });
expect(summary(rsi)).toEqual({ items: 53, maxPoints: 106, critical: 27 });
expect(rsi.sourceHeaderDenominator).toBe(49);
expect(rsi.discrepancies).toContainEqual(expect.objectContaining({
  code: 'SOURCE_DENOMINATOR_MISMATCH', computedMaxPoints: 106,
}));
```

Assert every item has `id`, `displayNumber`, exact `text`, its own `{performed:2, partial:1, notPerformed:0}` scale, `critical`, one approved source tag, and evidence only for engine rows. Assert classification totals `3/6/0`, `1/13/0`, and `17/36/0`.

- [ ] **Step 2: Run the focused test and confirm failure**

Run:

```bash
npm test --prefix crisis-sim -- rubric-data.test.js
```

Expected: FAIL because the rubric JSON and loader do not exist.

- [ ] **Step 3: Add exact JSON and a strict loader**

Implement these exports in `rubricLoader.js`:

```js
export const RUBRIC_SCORING_SOURCES = Object.freeze([
  'ENGINE_OBSERVABLE', 'INSTRUCTOR_OBSERVED', 'UNSCOREABLE',
]);

export function summarizeRubric(rubric) {
  return Object.freeze({
    itemCount: rubric.items.length,
    maxPoints: rubric.items.length * rubric.pointScale.performed,
    criticalCount: rubric.items.filter((item) => item.critical).length,
  });
}

export function normalizeRubric(raw) {
  // Deep-copy, validate IDs/text/scale/source/evidence, compute counts,
  // preserve discrepancy metadata, and deep-freeze the returned value.
}
```

Each engine row's `engineEvidence` must contain exact `snapshotKeys`, exact `actionLogEntries`, and the `ruleId` named in the approved design. Throw a `TypeError` or `RangeError` on malformed data; do not silently retag an item.

- [ ] **Step 4: Run the contract tests**

Run the focused command again. Expected: all rubric-data tests PASS, including literal text fixtures for every row and the RSI warning.

- [ ] **Step 5: Commit the literal data boundary**

```bash
git add data/rubrics crisis-sim/sim/scenario/rubricLoader.js crisis-sim/sim/index.js crisis-sim/test/rubric-data.test.js
git commit -m "feat: encode Carson-Newman rubrics"
```

## Task 2: Implement pass rules and deterministic session state

**Files:**

- Create: `crisis-sim/sim/scenario/rubricScoringSession.js`
- Create: `crisis-sim/test/rubric-session.test.js`
- Modify: `crisis-sim/sim/index.js`

- [ ] **Step 1: Write failing session/pass-rule tests**

Construct small normalized rubrics and prove:

```js
expect(resultFor({ percentage: 90, criticalPoints: 1 }).outcome).toBe('NOT PASS');
expect(resultFor({ percentage: 84, criticalPoints: 2 }).outcome).toBe('NOT PASS');
expect(resultFor({ percentage: 86, criticalPoints: 2 }).outcome).toBe('PASS');
```

Also assert instructor rows begin `pending`, revisions retain ledger history, engine rows reject instructor overrides, critical partial scores count as omitted, and `finalize()` returns `{ok:false, reason:'INSTRUCTOR_SCORES_PENDING'}` until every instructor row has a value.

- [ ] **Step 2: Run the focused test and confirm failure**

```bash
npm test --prefix crisis-sim -- rubric-session.test.js
```

Expected: FAIL because `RubricScoringSession` does not exist.

- [ ] **Step 3: Implement the minimal session core**

Use this public boundary:

```js
export class RubricScoringSession {
  constructor({ rubric, criteria = {}, seed = 12345 })
  recordAction({ tSec, action, meta = {}, snapshot })
  recordTrace(snapshot)
  setInstructorScore({ itemId, points, note = '', tSec })
  getItemStatus(itemId)
  getLiveResult()
  finalize({ tSec })
}
```

Store copied action/trace records. `recordTrace()` accepts only exact integer-second `t` values and replaces a duplicate timestamp deterministically. `setInstructorScore()` accepts only 0/1/2 and writes `instructor_rubric_score_set`. `finalize()` computes percentage from encoded maximum and evaluates both pass conditions independently.

- [ ] **Step 4: Run session and rubric-data tests**

Expected: both files PASS and the RSI maximum remains 106.

- [ ] **Step 5: Commit session/pass logic**

```bash
git add crisis-sim/sim/scenario/rubricScoringSession.js crisis-sim/sim/index.js crisis-sim/test/rubric-session.test.js
git commit -m "feat: add rubric scoring session"
```

## Task 3: Add real engine rule evaluators and violation flags

**Files:**

- Create: `crisis-sim/sim/scenario/rubricRules.js`
- Create: `crisis-sim/test/rubric-rules.test.js`
- Modify: `crisis-sim/sim/scenario/rubricScoringSession.js`

- [ ] **Step 1: Write one performed and one not-performed real-run test for every engine rule**

Cover these exact rule IDs:

```js
[
  'emergence_stop_anesthetic',
  'emergence_tof_and_reversal',
  'emergence_spontaneous_ventilation',
  'standard_mask_ventilation_before_nmb',
  'rsi_preoxygenation',
  'rsi_cricoid_applied',
  'rsi_medication_selection',
  'rsi_medication_sequence',
  'rsi_no_ppv_before_first_laryngoscopy',
  'rsi_continuous_etco2_confirmation',
  'rsi_failed_attempt_ppv_with_cricoid',
  'rsi_cricoid_release_after_confirmation',
  'rsi_inhaled_anesthetic_on',
  'rsi_vent_mode', 'rsi_tidal_volume', 'rsi_respiratory_rate',
  'rsi_fresh_gas', 'rsi_fio2', 'rsi_bag_to_vent',
  'rsi_appropriate_failed_attempt_intervention',
  'rsi_under_three_attempts',
]
```

Multiple RSI rows share pure evaluators but retain separate item results. Use actual `buildPhysRig()`/`SimRunner` actions for performed and omitted runs; do not hand-author derived vital values.

Add paired flag tests for Standard 7, RSI 11, Emergence 3, Emergence 4, Standard 5/RSI 7, and RSI 42. Every test must include a compliant run proving no false positive.

- [ ] **Step 2: Run the rule tests and confirm failure**

```bash
npm test --prefix crisis-sim -- rubric-rules.test.js
```

Expected: FAIL because the registry and rule evaluations do not exist.

- [ ] **Step 3: Implement pure rule and violation registries**

Export:

```js
export const RUBRIC_RULES = Object.freeze({
  emergence_stop_anesthetic: evaluateEmergenceStopAnesthetic,
  // every rule ID listed above
});

export function evaluateRubricItem({ item, actions, trace, criteria, finalized }) {
  const evaluator = RUBRIC_RULES[item.engineEvidence.ruleId];
  if (!evaluator) throw new RangeError(`Unknown rubric rule: ${item.engineEvidence.ruleId}`);
  return evaluator({ actions, trace, criteria, finalized });
}

export function detectRubricViolations({ rubric, action, actions, trace, criteria }) {
  // Return literal rubric item labels plus structured measured evidence.
}
```

Use only event order and named trace fields. Preserve binary 2/0 behavior for RSI 11 and 42. Conditional RSI 28/41 returns 2 with `conditionTriggered:false` only if no attempt failed. Violation display text comes directly from `item.displayNumber` and `item.text`.

- [ ] **Step 4: Run rule, session, and data tests**

Expected: all PASS; verify every engine rule has both performed and not-performed coverage.

- [ ] **Step 5: Commit rules and flags**

```bash
git add crisis-sim/sim/scenario/rubricRules.js crisis-sim/sim/scenario/rubricScoringSession.js crisis-sim/test/rubric-rules.test.js
git commit -m "feat: score observable rubric actions"
```

## Task 4: Normalize runner actions and fixed-time trace sampling

**Files:**

- Modify: `crisis-sim/ui/simRunner.js`
- Modify: `crisis-sim/sim/scenario/scenarioDebrief.js`
- Modify: `crisis-sim/test/live-runner.test.js`
- Modify: `crisis-sim/test/snapshot-contract.mjs`

- [ ] **Step 1: Write failing runner-boundary tests**

Assert `snapshot()` adds `ventSetFiO2` and copied active infusion state. Assert these public methods and normalized actions:

```js
runner.assessSpontaneousVentilation(); // spontaneous_ventilation_assessed
runner.confirmEtco2();                 // confirm_etco2
runner.setMachine(patch);              // machine_settings_changed
runner.setVentMode(mode);              // vent_mode_changed
```

Assert actions include an immediate compact snapshot. Advance 2.5 seconds in uneven outer chunks and prove the rubric trace contains exactly `t = 0, 1, 2`, matching a run advanced in one chunk.

- [ ] **Step 2: Run the focused tests and confirm failure**

```bash
npm test --prefix crisis-sim -- live-runner.test.js
```

Expected: FAIL on missing fields/methods/session trace.

- [ ] **Step 3: Integrate `RubricScoringSession` without changing tick order**

Add runner methods:

```js
attachRubricSession({ rubric, criteria })
compactRubricSnapshot()
recordRubricAction(action, meta = {})
sampleRubricTraceAfterStep()
assessSpontaneousVentilation()
confirmEtco2()
```

Call `sampleRubricTraceAfterStep()` after each existing `core.stepOnce(step)` and record only when `core.tickCount % 50 === 0`. Use `recordRubricAction()` from existing clinical methods after their state change. Do not call `snapshot()` at 50 Hz because it copies large histories.

- [ ] **Step 4: Run runner, rule, session, and snapshot tests**

Expected: PASS with unchanged existing snapshot fields and deterministic trace timestamps.

- [ ] **Step 5: Commit the action/trace boundary**

```bash
git add crisis-sim/ui/simRunner.js crisis-sim/sim/scenario/scenarioDebrief.js crisis-sim/test/live-runner.test.js crisis-sim/test/snapshot-contract.mjs
git commit -m "feat: record deterministic rubric evidence"
```

## Task 5: Add the instructor TOF target through the single NMB state

**Files:**

- Modify: `crisis-sim/sim/neuromuscularModel.js`
- Modify: `crisis-sim/sim/drugSystem.js`
- Modify: `crisis-sim/ui/simRunner.js`
- Create: `crisis-sim/test/instructor-nmb.test.js`

- [ ] **Step 1: Write failing single-state and truth-boundary tests**

Test targets 0, 0.25, 0.50, 0.70, 0.90, and 1.00. Assert the method does not synchronously assign patient `trainOfFourRatio`, then advances fixed steps toward the target through rocuronium Ce. Assert respiratory muscle capability moves in the same direction, `dominantNmbSource === 'rocuronium'` for blocked presets, reversal can still improve the same state, and the action never produces `tof_checked`.

Also assert replacement clears succinylcholine exposure plus prior sugammadex/neostigmine relief and logs only `instructor_nmb_depth_set`.

- [ ] **Step 2: Run the focused test and confirm failure**

```bash
npm test --prefix crisis-sim -- instructor-nmb.test.js
```

Expected: FAIL because the inverse mapping and administrative API do not exist.

- [ ] **Step 3: Implement inverse Hill targeting and runner API**

In `neuromuscularModel.js` add:

```js
export function rocuroniumCeFromBlockade(blockade) {
  const b = Clamp(Number(blockade) || 0, 0, 0.9999);
  if (b <= 0) return 0;
  return f(ROCURONIUM_EC50 * Pow(b / (1 - b), 1 / ROCURONIUM_HILL));
}
```

In `DrugSystem` add `setAdministrativeNmbTarget({ targetTofRatio })`, replacing `_rocuroniumC1` and `_rocuroniumCe` with the inverse-derived equilibrium, clearing `_suxC1/_suxCe` and reversal state, and returning copied target metadata. In `SimRunner`, add:

```js
setInstructorNmbTarget({ targetTofRatio })
```

Validate finite 0..1 input, call the drug method, log `instructor_nmb_depth_set`, record it as administrative evidence, and expose target/equilibration status in `snapshot()`.

- [ ] **Step 4: Run NMB, neuromuscular, evidence, and runner tests**

Expected: all PASS, including the existing single-NMB and reversal tests.

- [ ] **Step 5: Commit the administrative control**

```bash
git add crisis-sim/sim/neuromuscularModel.js crisis-sim/sim/drugSystem.js crisis-sim/ui/simRunner.js crisis-sim/test/instructor-nmb.test.js
git commit -m "feat: add instructor NMB depth control"
```

## Task 6: Build and load the four deterministic rubric scenarios

**Files:**

- Create: `crisis-sim/sim/scenarios/standard_iv_healthy_001.json`
- Create: `crisis-sim/sim/scenarios/rsi_full_stomach_001.json`
- Create: `crisis-sim/sim/scenarios/emergence_residual_block_001.json`
- Create: `crisis-sim/sim/scenarios/rsi_failed_first_attempt_001.json`
- Modify: `crisis-sim/sim/scenario/scenarioLoader.js`
- Modify: `crisis-sim/ui/simRunner.js`
- Create: `crisis-sim/test/rubric-scenarios.test.js`

- [ ] **Step 1: Write failing scenario-contract and full-run tests**

Assert every definition has `rubricId`, one fixed seed, existing patient/setup/events/airway fields, explicit `rubricCriteria`, and optional `administrativeSetup`. Run all four through `SimRunner.loadRubricScenario({scenario, rubric})` and finalize complete debriefs after supplying instructor scores.

For the residual-block scenario, assert the first learner-visible trace is intubated, mechanically ventilated, and below TOF ratio 0.90. For the failed RSI, assert attempt 1 fails, rescue recovers oxygenation, attempt 2 succeeds, and the complete ordered procedure ledger is preserved.

- [ ] **Step 2: Run the focused scenario tests and confirm failure**

```bash
npm test --prefix crisis-sim -- rubric-scenarios.test.js
```

Expected: FAIL because the definitions and loader path do not exist.

- [ ] **Step 3: Add scenario JSON and deterministic loading/preconditioning**

Extend normalization with copied fields:

```js
def.rubricId = def.rubricId ?? '';
def.rubricCriteria = def.rubricCriteria ?? {};
def.administrativeSetup = def.administrativeSetup ?? null;
def.seed = Number.isInteger(def.seed) ? def.seed : 12345;
```

`loadRubricScenario()` rebuilds with the scenario seed, loads the normal scenario, attaches its rubric session, and applies setup through existing public/admin APIs. For emergence, pause the scenario clock, apply the NMB target, advance the documented number of fixed steps, resume with an empty learner ledger/trace and `t=0`. Do not set TOF fields or create a second blockade state.

- [ ] **Step 4: Run scenario, airway, runner, and parity tests**

Expected: the four new cases PASS and all frozen scenarios remain unchanged.

- [ ] **Step 5: Commit scenarios**

```bash
git add crisis-sim/sim/scenarios crisis-sim/sim/scenario/scenarioLoader.js crisis-sim/ui/simRunner.js crisis-sim/test/rubric-scenarios.test.js
git commit -m "feat: add rubric clinical scenarios"
```

## Task 7: Generate source-aware rubric debriefs and actual consequences

**Files:**

- Create: `crisis-sim/sim/scenario/rubricDebrief.js`
- Modify: `crisis-sim/sim/scenario/scenarioDebrief.js`
- Modify: `crisis-sim/ui/simRunner.js`
- Create: `crisis-sim/test/rubric-debrief.test.js`

- [ ] **Step 1: Write failing additive-result and consequence tests**

Assert the existing required `SimulationResult` fields remain valid and the additive fields contain:

```js
expect(result).toMatchObject({
  rubricResult: {
    rawPoints: expect.any(Number),
    maxPoints: expect.any(Number),
    percentage: expect.any(Number),
    criticalItemsOmitted: expect.any(Array),
    outcome: expect.stringMatching(/^(PASS|NOT PASS)$/),
    items: expect.any(Array),
  },
  actionTimeline: expect.any(Array),
  physiologicTrace: expect.any(Array),
  violationFlags: expect.any(Array),
  administrativeActions: expect.any(Array),
});
```

Create an unsafe emergence run and assert consequence values equal the trace's actual extubation TOF/TV and next-90-second SpO2 nadir. Assert no failed item invents a vital absent from the trace and instructor/engine source remains visible per row.

- [ ] **Step 2: Run the focused test and confirm failure**

```bash
npm test --prefix crisis-sim -- rubric-debrief.test.js
```

Expected: FAIL because additive rubric results are not built.

- [ ] **Step 3: Implement debrief composition**

Export:

```js
export function buildRubricDebrief({ baseResult, sessionResult })
export function observedConsequence({ itemResult, actions, trace, windowSec = 90 })
```

Copy the full ledger and trace. For a failed engine row, select only its named evidence fields, action-time values, and measured later extrema/timing. Format measured statements without a causal claim. Preserve the RSI denominator warning and exact literal item text.

- [ ] **Step 4: Run debrief, session, scenario, and live model tests**

Expected: PASS with the old result validator still accepting required fields.

- [ ] **Step 5: Commit debrief integration**

```bash
git add crisis-sim/sim/scenario/rubricDebrief.js crisis-sim/sim/scenario/scenarioDebrief.js crisis-sim/ui/simRunner.js crisis-sim/test/rubric-debrief.test.js
git commit -m "feat: add rubric debrief evidence"
```

## Task 8: Add live scenario, rubric, flag, and TOF controls

**Files:**

- Modify: `ui/liveSimModel.js`
- Modify: `ui/liveSimView.js`
- Modify: `assets/css/live-sim.css`
- Create: `crisis-sim/test/rubric-ui.test.js`
- Modify: `crisis-sim/test/live-ui-model.test.js`

- [ ] **Step 1: Write failing model and DOM contract tests**

Assert the shell contains a scenario selector with four cases, rubric summary, source warning, live item list, instructor 2/1/0 buttons, exact-text flag region, pending-finalization message, administrative NMB presets/custom input, actual TOF/count readback, FINALIZE DEBRIEF, and PRINT RUBRIC.

Assert source is visible as text, engine rows have no manual point controls, instructor rows do, and clicking an instructor score calls `setInstructorScore()` with the correct item ID/points. Assert applying target 0.70 calls `setInstructorNmbTarget({targetTofRatio:0.7})`, not `setDriver()` or direct snapshot mutation.

- [ ] **Step 2: Run the UI tests and confirm failure**

```bash
npm test --prefix crisis-sim -- rubric-ui.test.js live-ui-model.test.js
```

Expected: FAIL because the controls and presentation helpers do not exist.

- [ ] **Step 3: Implement model helpers and responsive UI**

Add pure helpers:

```js
export const RUBRIC_SCENARIOS = Object.freeze([
  { id: 'standard_iv_healthy_001', label: 'Standard IV - Healthy Adult' },
  { id: 'rsi_full_stomach_001', label: 'RSI - Full Stomach' },
  { id: 'emergence_residual_block_001', label: 'Emergence - Residual Blockade' },
  { id: 'rsi_failed_first_attempt_001', label: 'RSI - Failed First Attempt' },
]);

export function formatRubricStatus(result)
export function formatRubricFlag(flag)
export function formatInstructorNmb(snapshot)
```

Load selected JSON with `fetch`, validate it before starting, and render literal item text/status/source/evidence. Preserve the non-dismissible education fence. Keep the monitor and drug controls intact.

- [ ] **Step 4: Run UI, runner, display, and app-integration tests**

Expected: all PASS and existing live launch/display behavior remains intact.

- [ ] **Step 5: Commit live instructor UI**

```bash
git add ui/liveSimModel.js ui/liveSimView.js assets/css/live-sim.css crisis-sim/test/rubric-ui.test.js crisis-sim/test/live-ui-model.test.js
git commit -m "feat: add live rubric instructor console"
```

## Task 9: Add printable rubric and service-worker coverage

**Files:**

- Modify: `ui/liveSimView.js`
- Modify: `assets/css/live-sim.css`
- Modify: `sw.js`
- Modify: `crisis-sim/test/rubric-ui.test.js`
- Modify: `crisis-sim/test/pwa-contract.test.js`

- [ ] **Step 1: Write failing print/PWA contract tests**

Assert print markup contains source title, student/evaluator/date fields, PASS/NOT PASS, total/max/percentage, explicit omitted critical items, all rubric rows, 2/1/0 columns, notes, source text, exact pass-rule footnote, educational fence, RSI warning, and action/trace appendix. Assert the service worker version changes and caches all three rubric JSON files, four scenario JSON files, and new JS modules.

- [ ] **Step 2: Run the focused tests and confirm failure**

```bash
npm test --prefix crisis-sim -- rubric-ui.test.js pwa-contract.test.js
```

Expected: FAIL on missing print structure/cache entries.

- [ ] **Step 3: Implement semantic print view and cache manifest**

Use `@media print` to hide controls and show the rubric table plus appendix. Keep source labels as text and avoid copying university logo assets. Update the cache constant and add every fetchable data/module asset required offline.

- [ ] **Step 4: Run UI/PWA tests and the full Vitest suite**

```bash
npm test --prefix crisis-sim
```

Expected: all test files PASS.

- [ ] **Step 5: Commit printable/PWA integration**

```bash
git add ui/liveSimView.js assets/css/live-sim.css sw.js crisis-sim/test/rubric-ui.test.js crisis-sim/test/pwa-contract.test.js
git commit -m "feat: add printable rubric debrief"
```

## Task 10: Produce full evidence, repair regressions, and finalize without pushing

**Files:**

- Create: `crisis-sim/test/rubric-evidence.mjs`
- Modify: `crisis-sim/test/live-case-smoke.mjs`
- Modify: any Round 3 file identified by a root-cause test failure

- [ ] **Step 1: Add the deterministic evidence driver**

Print machine-readable sections for:

- source counts/classifications and the RSI mismatch;
- all three pass-rule cases;
- every engine rule's performed/not-performed case;
- required violation/no-false-positive pairs;
- complete debriefs for all four scenarios;
- full failed-first-attempt rescue ordering and oxygenation recovery;
- unsafe emergence consequences; and
- two identical fingerprints sampling preoxygenation, drug, mid-PPV, mid-attempt, sustained EtCO2, and NMB equilibration.

Update the smoke case to select a rubric scenario, account for timed intubation, complete instructor rows, finalize, and validate the additive result.

- [ ] **Step 2: Run all evidence and tests**

```bash
npm test --prefix crisis-sim
node crisis-sim/test/rubric-evidence.mjs
node crisis-sim/test/live-case-smoke.mjs
```

Expected: all suites green, two fingerprints byte-identical, and all four debriefs complete.

- [ ] **Step 3: Apply the three-strikes/root-cause rule**

For each failure, identify the first causal defect and change only the owning Round 3 file. Stop and report if the same root cause survives three attempted fixes or a frozen non-Round-3 fixture requires regeneration.

- [ ] **Step 4: Review repository and evidence state**

```bash
git diff --check
git status --short
git log --oneline --decorate -12
```

Confirm there are no unrelated changes, no duplicate paralysis state, no direct derived-vital writes, no pending instructor items in exported examples, and no push.

- [ ] **Step 5: Commit final evidence/repairs**

```bash
git add crisis-sim/test/rubric-evidence.mjs crisis-sim/test/live-case-smoke.mjs
git add data/rubrics crisis-sim/sim crisis-sim/ui ui assets/css/live-sim.css sw.js
git commit -m "test: verify rubric scenarios and debriefs"
```

The final handoff must report the commit, full test/evidence commands and results, the 21 engine/55 instructor/0 unscoreable classification, all simplifications from the design, the RSI 49-versus-106 discrepancy, and that the branch was not pushed.
