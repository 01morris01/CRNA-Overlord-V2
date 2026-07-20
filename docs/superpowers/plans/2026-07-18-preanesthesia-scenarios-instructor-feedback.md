# Preanesthesia Scenarios and Instructor Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a structured preanesthesia assessment, instructor-only event guidance, two deterministic end-to-end teaching scenarios, and a unified finalized debrief without leaking answer-key data or weakening the verified physiology engine.

**Architecture:** Add a validated case-experience layer beside the existing rubric session. A `CaseSession` owns assessment, plan, instructor observation, and revision state; a `CaseFlowSession` evaluates deterministic time/action/plan/physiology triggers and emits allowlisted modeled-input commands. `SimRunner` is the sole bridge to real actions and public projections, while the display transport publishes an explicit monitor-only allowlist.

**Tech Stack:** Native ES modules, JavaScript, Vitest 2, JSON scenario assets, fixed-step simulation at 50 Hz, DOM/CSS instructor console, BroadcastChannel learner display, service-worker PWA cache.

---

## Amendment A (2026-07-20): Karen finding/rule id remap

This plan's Task 9 Step 1 listed **invented composite ids** for Karen Whitfield that
were built against an imagined patient (a smoker with GERD and confirmed prior PONV).
During authoring, the operator directed realigning both cases to the **real** course
patients with comorbidities the engine can physiologically express. The only lap
cholecystectomy in the operator's teaching companion (Case 07) is a **non-smoker with
no GERD and only a hypothetical PONV history** whose one engine-expressible comorbidity
is **mild asthma** (see `docs/case-clinical-sourcing.md` and `docs/case-design-scripts.md`).
Karen's ids were therefore remapped as follows. Brittany Cole's ids are **unchanged**
from the plan.

**Rationale:** realignment to the real Carson-Newman Case 07 patient so every finding is
source-traceable and its intraoperative effect is engine-real (asthma → bronchospasm)
rather than a fake label. Silent divergence would break Task 10's registry metadata and
scope-hygiene check, so it is recorded here.

Karen finding ids (old → new):

| Plan (composite) | Authored (realigned) | Reason |
| --- | --- | --- |
| `current_smoker` | `mild_asthma` | Case 07 is a non-smoker; asthma is her reactive-airway comorbidity |
| `controlled_gerd` | `codeine_intolerance` | Case 07 has no GERD; codeine intolerance is a documented reaction |
| `severe_prior_ponv` | `ponv_high_risk` | Renamed; PONV is a *risk* (Apfel), assessed but not engine-modeled |
| (added) | `ocp_vte_risk` | Case 07 uses an OCP; pneumoperitoneum + OCP raises VTE risk |
| `airway_assessed` | `airway_assessed` | unchanged |
| `anesthetic_history_reviewed` | `anesthetic_history_reviewed` | unchanged |

Karen plan rule ids (old → new):

| Plan (composite) | Authored (realigned) | Reason |
| --- | --- | --- |
| `asa_ii_with_reason` | `asa_ii_with_reason` | unchanged |
| `aspiration_strategy` | `reactive_airway_plan` | no GERD/aspiration; the live risk is bronchospasm |
| `multimodal_ponv_prophylaxis` | `multimodal_ponv_prophylaxis` | unchanged |
| `smoking_pulmonary_plan` | `vte_prophylaxis` | non-smoker; OCP + laparoscopy VTE prophylaxis instead |
| `postoperative_pain_plan` | `postoperative_pain_plan` | unchanged |

## Amendment B (2026-07-20): authorized files beyond the original file map

The following were added or changed beyond the plan's original (75bb862-corrected) file
map, and are authorized additions rather than scope drift:

- `crisis-sim/ui/simRunner.js` — `activateCaseEvent` and `isCaseFinalized` public methods
  (necessary: without them an instructor cannot fire teaching beats or print in the app).
- `ui/liveSimView.js`, `ui/liveCaseView.js`, `ui/liveCaseModel.js` — printable case record
  wiring and the instructor teaching-beat control (Task 8 print gap + the beat control).
- `crisis-sim/sim/scenario/caseFlowSession.js`, `caseProjections.js` —
  `availableInstructorEventIds` flow-state field for the beat control, learner-stripped.
- `docs/case-clinical-sourcing.md`, `docs/case-design-scripts.md` — clinical trace and
  design script (the operator-facing provenance artifacts).
- Test files: `case-leak-probe`, `case-print`, `case-print-wiring`, `case-instructor-events`,
  `case-confidentiality-regressions`, `case-scenarios`, `case-evidence(.mjs/.test.js)`.

---

## Approved specification

Implement against:

`docs/superpowers/specs/2026-07-18-preanesthesia-scenarios-instructor-feedback-design.md`

Do not broaden this plan to free-text AI conversation, server authentication, real patient data, new disease models, or all 30 source cases.

## File map

### New runtime modules

- `crisis-sim/sim/scenario/caseContract.js` — JSON-safe copying, additive case-contract validation, stable reference validation, and immutable normalized definitions.
- `crisis-sim/sim/scenario/caseProjections.js` — defensive learner, instructor, and finalized-debrief projections with explicit field selection.
- `crisis-sim/sim/scenario/caseFlowSession.js` — deterministic phase, trigger, response-window, repeat, branch, and event-effect state.
- `crisis-sim/sim/scenario/caseSession.js` — assessment stages, discoveries, plan submission, instructor observations, feedback-release choices, timeline, finalization, and projections.
- `crisis-sim/sim/scenario/casePhysiologyInputs.js` — validate and apply only allowlisted modeled inputs emitted by case events.
- `crisis-sim/sim/scenario/caseDebrief.js` — validate and append finalized case evidence to the existing `SimulationResult`.

### New UI modules

- `ui/liveCaseModel.js` — pure formatting, escaping, and accessible markup for the learner workspace and instructor event-feedback panel.
- `ui/liveCaseView.js` — case-specific DOM mounting, event binding, form reads, and projection rendering through public runner APIs.

### New scenario assets

- `crisis-sim/sim/scenarios/cn_preassessment_lap_chole_001.json`
- `crisis-sim/sim/scenarios/cn_preassessment_npo_mh_001.json`

### New focused tests

- `crisis-sim/test/helpers/caseFixtures.js`
- `crisis-sim/test/case-contract.test.js`
- `crisis-sim/test/case-projections.test.js`
- `crisis-sim/test/case-flow.test.js`
- `crisis-sim/test/case-session.test.js`
- `crisis-sim/test/case-runner.test.js`
- `crisis-sim/test/case-ui.test.js`
- `crisis-sim/test/case-debrief.test.js`
- `crisis-sim/test/case-scenarios.test.js`
- `crisis-sim/test/case-evidence.mjs`
- `crisis-sim/test/case-evidence.test.js`

### Existing files modified

- `crisis-sim/ui/simRunner.js` — atomic optional-case loading, public case APIs, one canonical action bridge, fixed-step flow processing, allowlisted effects, projections, and debrief composition.
- `crisis-sim/sim/scenario/scenarioDebrief.js` — optional finalized case-result argument.
- `crisis-sim/sim/scenario/scenarioLoader.js` — inert additive `caseExperience` normalization (Task 1).
- `ui/liveSimModel.js` — combined scenario registry and case formatting helpers.
- `ui/liveSimView.js` — case asset loading, learner workspace, instructor feedback controls, lifecycle synchronization, and unified finalization.
- `ui/liveSimTransport.js` — explicit learner-monitor projection.
- `assets/css/live-sim.css` — responsive case workspace and instructor panel styling.
- `crisis-sim/test/live-transport.test.js` — deny-list and allowlist evidence.
- `crisis-sim/test/live-sim-display.test.js` — learner-display allowlist evidence (Task 5).
- `crisis-sim/test/rubric-ui.test.js` — existing rubric-console coexistence.
- `crisis-sim/test/app-integration.test.js` — case registry and live-console integration (Tasks 7 and 10).
- `crisis-sim/test/live-runner.test.js` — no-case inertness and load/reset compatibility.
- `crisis-sim/test/snapshot-contract.mjs` — assert case answer data is absent, without adding snapshot fields.
- `crisis-sim/test/live-case-smoke.mjs` — complete assessment-to-emergence path.
- `crisis-sim/test/pwa-contract.test.js` — new modules/assets and cache version.
- `sw.js` — PWA cache version and new local assets.
- `docs/live-sim-integration.md` — operator workflow and static-hosting confidentiality limitation.
- `FINAL_STATUS.md` — commit and test evidence, recorded only after verification succeeds (Task 10).

## Stable public API names

Use these names throughout all tasks:

```js
runner.loadCaseScenario({ scenario, rubric = null })
runner.getLearnerCaseContext()
runner.getInstructorCaseContext()
runner.performAssessmentAction({ actionId })
runner.advanceCaseStage({ stage })
runner.submitCaseFindings({ findingIds, notes = '' })
runner.submitCasePlan({ selections, rationale = '' })
runner.setInstructorCaseObservation({ considerationId, status, note = '' })
runner.setCaseFeedbackReveal({ considerationId, reveal })
runner.advanceCasePhase()
runner.activateCaseBranch({ branchId })
runner.pauseCase()
runner.resumeCase()
runner.finalizeCaseDebrief()
runner.beginCaseDebriefRevision()
```

`loadRubricScenario(options)` remains public and delegates to the shared loader with `rubric` required. Existing callers and return shapes remain compatible.

## Task 1: Validate and normalize the additive case contract

**Files:**

- Create: `crisis-sim/sim/scenario/caseContract.js`
- Create: `crisis-sim/test/helpers/caseFixtures.js`
- Create: `crisis-sim/test/case-contract.test.js`
- Modify: `crisis-sim/sim/scenario/scenarioLoader.js`

- [ ] **Step 1: Create a complete minimal case fixture**

Add `makeCaseScenario()` and `makeCaseExperience()` to the helper. The fixture must contain one item in every required collection so reference validation is exercised:

```js
export function makeCaseExperience() {
  return {
    version: 1,
    learnerChart: {
      patient: { syntheticName: 'Taylor Example', mrn: 'SIM-0001', ageYears: 40, sex: 'Female' },
      scheduledProcedure: { name: 'Test procedure', site: 'Test site', laterality: 'none' },
      documents: [], medications: [], allergies: [], labs: [], studies: [],
    },
    assessment: {
      stages: ['chart_review', 'interview', 'focused_exam', 'findings_summary'],
      actions: [{
        id: 'ask_npo', stage: 'interview', domain: 'npo', prompt: 'Ask last oral intake',
        response: 'Solids eight hours ago', reveals: ['npo_ok'], prerequisites: [],
        scoringRuleId: 'discover_npo', critical: true,
      }],
      findings: [{
        id: 'npo_ok', learnerLabel: 'NPO appropriate', significance: 'Aspiration risk assessed',
        initiallyVisible: false, instructorOnlyUntilDiscovered: true,
      }],
      requiredDomains: ['npo'],
      scoringRules: [{
        id: 'discover_npo', label: 'Assesses NPO status', critical: true,
        source: 'ENGINE_OBSERVABLE', evidence: { type: 'assessment_action', actionId: 'ask_npo' },
      }],
    },
    planRequirements: {
      fields: [{ id: 'disposition', type: 'single', required: true, options: ['proceed', 'postpone'] }],
      rules: [{
        id: 'plan_proceed', label: 'Selects disposition', critical: true,
        source: 'ENGINE_OBSERVABLE', evidence: { type: 'plan_equals', fieldId: 'disposition', value: 'proceed' },
      }],
    },
    surgery: {
      procedure: 'Test procedure', indication: 'Teaching fixture', position: 'supine',
      expectedDurationMin: 30, expectedStimulation: 'low', bloodLossRisk: 'low',
      physiologicChallenges: [], anesthesiaConsiderations: [],
    },
    eventFlow: {
      initialPhaseId: 'assessment',
      phases: [{
        id: 'assessment', title: 'Assessment', enterWhen: { type: 'load' },
        events: ['assessment_ready'], completionWhen: { type: 'plan_submitted' },
        allowedInstructorControls: ['advance'],
      }],
      events: [{
        id: 'assessment_ready', phaseId: 'assessment', trigger: { type: 'phase_enter' },
        repeatable: false, responseWindowSec: 0, expectedResponses: [], unsafeResponses: [],
        effect: null, guidanceIds: ['consider_npo'], debriefIds: ['teach_npo'],
      }],
      branches: [],
    },
    instructorGuide: {
      considerations: [{
        id: 'consider_npo', phaseId: 'assessment', eventId: 'assessment_ready',
        title: 'NPO status', consideration: 'Trainee should establish intake timing.',
        expectedResponse: 'Ask solids and clear-liquid timing.', responseWindowSec: 0,
        redFlags: ['Plan submitted without NPO assessment'], scoringGuidance: 'Observe sequence.',
        defaultRevealInDebrief: true,
      }],
    },
    debrief: {
      teachingItems: [{ id: 'teach_npo', title: 'NPO', explanation: 'Connect intake timing to aspiration risk.' }],
    },
  };
}
```

- [ ] **Step 2: Write failing contract tests**

Test JSON-safe defensive copying, valid normalization, absence returning `null`, and atomic rejection of:

```js
expect(normalizeCaseExperience({})).toBeNull();
expect(normalizeCaseExperience(makeCaseExperience())).toMatchObject({ version: 1 });
expect(() => normalizeCaseExperience({ learnerChart: {} })).toThrow(/complete case experience/i);
expect(() => normalizeCaseExperience(withDuplicateId())).toThrow(/duplicate/i);
expect(() => normalizeCaseExperience(withUnknownFindingReference())).toThrow(/finding/i);
expect(() => normalizeCaseExperience(withUnknownGuidanceReference())).toThrow(/guidance/i);
expect(() => normalizeCaseExperience(withDerivedVitalEffect('spo2'))).toThrow(/derived vital/i);
```

Mutate every returned nested collection and prove a second normalization from the original is unchanged.

- [ ] **Step 3: Run the contract test and confirm RED**

Run:

```bash
cd crisis-sim
npx vitest run test/case-contract.test.js
```

Expected: FAIL because `caseContract.js` and `normalizeCaseExperience` do not exist.

- [ ] **Step 4: Implement strict contract validation**

Export this exact surface:

```js
export const CASE_STAGES = Object.freeze([
  'chart_review', 'interview', 'focused_exam', 'findings_summary',
  'plan_submission', 'live_simulation', 'appropriately_deferred',
  'debrief_draft', 'debrief_finalized', 'debrief_revision',
]);

export const CASE_EFFECT_TYPES = Object.freeze([
  'set_surgical_stimulus', 'inject_complication', 'set_forced_apnea', 'set_machine',
]);

copyCaseData(value, label = 'case data')
normalizeCaseExperience(scenarioOrExperience)
```

`normalizeCaseExperience` accepts either `scenario.caseExperience` or the case-experience object itself. It must:

- require all seven sections when any case section is present;
- reject accessors, symbols, sparse arrays, cycles, unsafe keys, non-finite numbers, and non-plain objects;
- reject duplicate IDs across each namespace;
- validate every prerequisite, finding, scoring-rule, phase, event, guidance, branch, and debrief reference;
- require the initial phase to exist and every phase to be reachable from initial/branch transitions;
- allow only the four modeled effect types above;
- reject `hr`, `sbp`, `dbp`, `map`, `spo2`, `rr`, `etco2`, `temp`, `tof`, or another derived-vital key in an effect;
- freeze the returned root and nested containers with a recursive `deepFreeze`; and
- preserve exact stable array order.

Add this inert additive field in `scenarioLoader.normalize()`:

```js
def.caseExperience = normalizeCaseExperience(def);
```

Legacy scenarios without `caseExperience` receive `null` and otherwise retain their old normalized fingerprint.

- [ ] **Step 5: Run focused and legacy loader coverage**

Run:

```bash
cd crisis-sim
npx vitest run test/case-contract.test.js test/rubric-scenarios.test.js test/parity.test.js
```

Expected: PASS, including unchanged frozen parity fixtures.

- [ ] **Step 6: Commit Task 1**

```bash
git add crisis-sim/sim/scenario/caseContract.js crisis-sim/sim/scenario/scenarioLoader.js crisis-sim/test/helpers/caseFixtures.js crisis-sim/test/case-contract.test.js
git commit -m "feat: validate preanesthesia case contracts"
```

## Task 2: Implement deterministic assessment and instructor session state

**Files:**

- Create: `crisis-sim/sim/scenario/caseProjections.js`
- Create: `crisis-sim/sim/scenario/caseSession.js`
- Create: `crisis-sim/test/case-projections.test.js`
- Create: `crisis-sim/test/case-session.test.js`
- Modify: `crisis-sim/test/helpers/caseFixtures.js`

- [ ] **Step 1: Write failing lifecycle, scoring, and projection tests**

Construct `new CaseSession({ definition, seed: 12345 })` and test:

```js
expect(session.getLearnerContext()).toMatchObject({ stage: 'chart_review' });
expect(JSON.stringify(session.getLearnerContext())).not.toContain('Solids eight hours ago');
expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 1 })).toMatchObject({ ok: false, reason: 'WRONG_STAGE' });
session.advanceStage({ stage: 'interview', tSec: 1 });
expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 2 })).toMatchObject({
  ok: true, revealedFindingIds: ['npo_ok'],
});
expect(session.getLearnerContext().discoveredFindings).toHaveLength(1);
expect(session.getInstructorContext().considerations[0]).toMatchObject({ id: 'consider_npo' });
```

Also test prerequisites, duplicate assessment actions, findings submission, plan option validation, structured scoring, instructor-observed pending state, note/reveal revision history, finalization lock, explicit revision, chronological fixed-step timestamps, stable sequence at equal timestamps, and defensive projections.

In `case-projections.test.js`, construct hostile internal state and prove `projectLearnerCase(...)` excludes concealed responses/significance, expected and unsafe responses, instructor guidance, red flags, score answers, notes, and unreleased debrief text while `projectInstructorCase(...)` includes the authorized instructor fields. Mutating either returned projection must not mutate the session or definition.

- [ ] **Step 2: Run the session test and confirm RED**

Run:

```bash
cd crisis-sim
npx vitest run test/case-projections.test.js test/case-session.test.js
```

Expected: FAIL because `CaseSession` does not exist.

- [ ] **Step 3: Implement `CaseSession` with this public surface**

```js
export class CaseSession {
  constructor({ definition, seed })
  currentTimeSec()
  advanceStage({ stage, tSec })
  recordAssessmentAction({ actionId, tSec })
  submitFindings({ findingIds, notes = '', tSec })
  submitPlan({ selections, rationale = '', tSec })
  recordCanonicalAction({ action, meta = {}, snapshot = null, tSec })
  setInstructorObservation({ considerationId, status, note = '', tSec })
  setFeedbackReveal({ considerationId, reveal, tSec })
  activateBranch({ branchId, tSec })
  advancePhase({ tSec })
  getLearnerContext()
  getInstructorContext()
  getLiveResult()
  finalize({ tSec })
  beginRevision({ tSec })
}
```

Use only `tSec` passed from the runner. Assign every record a monotonically increasing integer `sequence` so equal-time assessment actions remain ordered. Use `Set` and `Map` internally, but return copied JSON-safe arrays/objects.

Allowed instructor observation statuses are exact constants:

```js
export const CASE_OBSERVATION_STATUS = Object.freeze([
  'observed', 'missed', 'not_yet_evaluable',
]);
```

Implement these projection functions in the focused module and have `CaseSession` delegate to them:

```js
projectLearnerCase({ definition, sessionState, flowState })
projectInstructorCase({ definition, sessionState, flowState })
```

The learner projection may contain only initially visible chart data, completed action prompts/responses, discovered finding labels, the learner's own submissions/notes, learner-safe phase title, and completion state. It must not contain `significance` before discovery, instructor guide text, expected responses, red flags, scoring guidance, rule answers, or unreleased debrief explanations.

The instructor projection contains complete concealed findings, rule status/evidence, considerations, response windows, observations, branch controls, and revision history.

- [ ] **Step 4: Run focused tests**

Run:

```bash
cd crisis-sim
npx vitest run test/case-projections.test.js test/case-session.test.js test/case-contract.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit Task 2**

```bash
git add crisis-sim/sim/scenario/caseProjections.js crisis-sim/sim/scenario/caseSession.js crisis-sim/test/case-projections.test.js crisis-sim/test/case-session.test.js crisis-sim/test/helpers/caseFixtures.js
git commit -m "feat: add scoreable preanesthesia case sessions"
```

## Task 3: Add deterministic phase and event-flow evaluation

**Files:**

- Create: `crisis-sim/sim/scenario/caseFlowSession.js`
- Create: `crisis-sim/test/case-flow.test.js`
- Modify: `crisis-sim/sim/scenario/caseSession.js`
- Modify: `crisis-sim/test/helpers/caseFixtures.js`

- [ ] **Step 1: Write failing flow tests**

Cover all approved trigger kinds:

```js
const flow = new CaseFlowSession({ eventFlow, initialTimeSec: 0 });
expect(flow.enterInitialPhase({ tSec: 0 })).toEqual(['assessment_ready']);
expect(flow.onStep({ tSec: 5, snapshot: { spo2: 99 } })).toEqual([]);
expect(flow.onAction({ action: 'drug', meta: { drug: 'Propofol' }, tSec: 6, snapshot: {} }))
  .toEqual(['induction_started']);
expect(flow.onPlan({ selections: { disposition: 'postpone' }, tSec: 7 })).toEqual(['case_deferred']);
```

Add cases for phase-relative time, fixed time, threshold comparison with dwell and hysteresis, rejected actions not entering the evaluator, equal-time stable order, nonrepeatable events, explicit repeatable events, response-window expiry, manual phase advance, allowed/forbidden instructor branch, pause/resume, and two byte-identical mixed runs sampled mid-event.

- [ ] **Step 2: Run the flow test and confirm RED**

```bash
cd crisis-sim
npx vitest run test/case-flow.test.js
```

Expected: FAIL because `CaseFlowSession` does not exist.

- [ ] **Step 3: Implement the evaluator**

Export:

```js
export class CaseFlowSession {
  constructor({ eventFlow, initialTimeSec = 0 })
  enterInitialPhase({ tSec })
  onStep({ tSec, snapshot })
  onAction({ action, meta = {}, tSec, snapshot })
  onPlan({ selections, tSec })
  advancePhase({ tSec })
  activateBranch({ branchId, tSec })
  setPaused({ paused, tSec })
  drainActivations()
  getState()
}
```

Each activation returned by `drainActivations()` is:

```js
{
  sequence,
  tSec,
  eventId,
  phaseId,
  source: 'time' | 'action' | 'plan' | 'physiology' | 'instructor' | 'phase_enter',
  effect,
  responseDeadlineSec,
  guidanceIds,
  debriefIds,
}
```

Use no timers, wall clock, RNG, or mutation of supplied snapshots. Physiology thresholds support `key`, `operator`, `value`, `dwellSec`, and `resetDelta`; evaluate only finite numeric snapshot values. Stable definition order breaks ties.

Integrate the flow into `CaseSession` so canonical assessment, plan, and live actions update one flow instance and its state appears only in the appropriate projections.

- [ ] **Step 4: Run focused deterministic coverage**

```bash
cd crisis-sim
npx vitest run test/case-flow.test.js test/case-session.test.js
```

Expected: PASS with identical fingerprints.

- [ ] **Step 5: Commit Task 3**

```bash
git add crisis-sim/sim/scenario/caseFlowSession.js crisis-sim/sim/scenario/caseSession.js crisis-sim/test/case-flow.test.js crisis-sim/test/case-session.test.js crisis-sim/test/helpers/caseFixtures.js
git commit -m "feat: evaluate deterministic teaching case events"
```

## Task 4: Integrate atomic case loading, public APIs, action bridging, and modeled effects

**Files:**

- Create: `crisis-sim/sim/scenario/casePhysiologyInputs.js`
- Modify: `crisis-sim/ui/simRunner.js`
- Create: `crisis-sim/test/case-runner.test.js`
- Modify: `crisis-sim/test/live-runner.test.js`
- Modify: `crisis-sim/test/snapshot-contract.mjs`

- [ ] **Step 1: Write failing atomic-load and projection tests**

Test the stable public APIs listed at the top of this plan. Required assertions include:

```js
const before = runner.snapshot();
expect(() => runner.loadCaseScenario({ scenario: malformed })).toThrow();
expect(runner.snapshot()).toEqual(before);

runner.loadCaseScenario({ scenario: validCase });
expect(runner.getLearnerCaseContext()).toMatchObject({ stage: 'chart_review' });
expect(runner.getInstructorCaseContext()).toMatchObject({ active: true });
expect(runner.snapshot().activeRubricScenario).toBeNull();
expect(Object.keys(runner.snapshot())).not.toContain('instructorGuide');
```

Also prove `loadRubricScenario` behaves byte-for-byte as before, case loading/reset is atomic, returned contexts are defensive, legacy/no-case action fingerprints are unchanged, and `setAirwayDevice()` administrative state cannot satisfy a live action rule unless a canonical accepted event is recorded.

- [ ] **Step 2: Write failing canonical action/effect tests**

Use spies or observable histories to prove:

- one accepted `giveBolus('Propofol', ...)` creates one case action and one drug exposure;
- rejected Lidocaine/volatile/procedure actions create no case credit;
- procedure events bridge once at their own fixed-step timestamps;
- `set_surgical_stimulus` changes only the existing stimulus driver;
- `inject_complication` uses `ScenarioManager.applyComplication`;
- `set_forced_apnea` uses `PatientPhysiology.setForcedApnea`;
- `set_machine` changes only allowlisted ventilator inputs; and
- no effect writes a derived vital.

- [ ] **Step 3: Run runner tests and confirm RED**

```bash
cd crisis-sim
npx vitest run test/case-runner.test.js test/live-runner.test.js
```

Expected: FAIL because the case loader/APIs do not exist.

- [ ] **Step 4: Refactor one fixed-step helper**

Replace duplicated `core.stepOnce` loops with an inert helper:

```js
_stepOnce(step) {
  this.core.stepOnce(step);
  this.processCaseFlowAfterStep();
  this.sampleRubricTraceAfterStep();
}
```

Both realtime `_tick` and `stepFor` call `_stepOnce(step)`. When `caseSession === null`, `processCaseFlowAfterStep()` returns immediately so existing tick order and parity do not change.

- [ ] **Step 5: Implement optional case loading and APIs**

Add `caseSession`, `_activeCaseScenario`, and `_loadedCaseScenario` fields. Candidate construction validates and constructs the complete case off-side before `_adoptRubricScenarioCandidate`-style adoption.

`loadCaseScenario({ scenario, rubric = null })` supports a case without a rubric. When a rubric is supplied, it attaches the existing `RubricScoringSession`. `loadRubricScenario(options)` delegates and still requires a valid rubric.

Every case mutation uses the deterministic case-clock method defined below, returns a defensive result, and calls `emit()` exactly once after a synchronous change. Existing rubric-only mutations retain `_currentRubricTime()`.

Pre-live assessment actions must not all receive timestamp zero and must not use wall-clock time. Add a deterministic case-clock allocator:

```js
_nextCaseTimestamp({ live = false } = {}) {
  if (live) return Math.fround(this._caseLiveEpochSec + this.core.tickCount / 50);
  this._caseClockTick += 1;
  return Math.fround(this._caseClockTick / 50);
}
```

Initialize `_caseClockTick` to `0`. When plan submission enters live simulation, set `_caseLiveEpochSec` to the next aligned case tick. Before that transition, every accepted assessment/plan/instructor action advances the case clock by exactly one 0.02-second tick. Timeline `sequence` remains the tie-breaker. Reset restores both fields. This is an ordering clock, not a claim about real interview duration.

- [ ] **Step 6: Add exactly one canonical action bridge**

Refactor action recording to:

```js
recordCanonicalAction(action, meta = {}, tSec = this.a?.timeSec ?? this.simTime) {
  const snapshot = this.compactRubricSnapshot(tSec);
  const rubric = this.recordRubricAction(action, meta, tSec);
  const caseResult = this.caseSession?.recordCanonicalAction({ action, meta, snapshot, tSec }) ?? null;
  this.applyCaseActivations(caseResult?.activations ?? []);
  return { rubric, caseResult };
}
```

`logEvent` and `logProcedureEvent` call `recordCanonicalAction` after the real action succeeds. Scenario-generated log records have `source: 'scenario'` and bypass learner-action re-entry.

- [ ] **Step 7: Implement an explicit modeled-effect module and allowlist**

Export the following from `casePhysiologyInputs.js`:

```js
export const CASE_INPUT_TYPES = Object.freeze([
  'set_surgical_stimulus', 'inject_complication', 'set_forced_apnea', 'set_machine',
]);

validateCasePhysiologyInput(input)
applyCasePhysiologyInput({ input, patient, lidocaineSystem, ventilator, scenarioManager })
```

The application function uses one switch and returns a copied record of the modeled input actually applied:

```js
switch (input.type) {
  case 'set_surgical_stimulus': lidocaineSystem.setSurgicalStimulus(input.intensity); break;
  case 'inject_complication': scenarioManager.applyComplication({ complicationType: input.complicationType, description: input.description }); break;
  case 'set_forced_apnea': patient.setForcedApnea(input.active); break;
  case 'set_machine': applyAllowlistedMachinePatch(ventilator, input.patch); break;
  default: throw new RangeError(`Unsupported case effect: ${input.type}`);
}
```

The machine patch allowlist is `o2FlowLPerMin`, `airFlowLPerMin`, `n2oFlowLPerMin`, `setFiO2`, `setTidalVolume`, `setRespiratoryRate`, `setPeep`, `mode`, `vaporizerAgent`, and `vaporizerDial` with the existing validation ranges.

- [ ] **Step 8: Run focused and frozen evidence**

```bash
cd crisis-sim
npx vitest run test/case-runner.test.js test/live-runner.test.js test/parity.test.js
node test/snapshot-contract.mjs
```

`snapshot-contract.mjs` is a node evidence script, not a vitest test; passing it to
`vitest run` silently skips it. Run it with `node` and require the `SNAPSHOT
CONTRACT: PASS` line.

Expected: PASS, with no case answer fields in `snapshot()` and all frozen fixtures unchanged.

- [ ] **Step 9: Commit Task 4**

```bash
git add crisis-sim/sim/scenario/casePhysiologyInputs.js crisis-sim/ui/simRunner.js crisis-sim/test/case-runner.test.js crisis-sim/test/live-runner.test.js crisis-sim/test/snapshot-contract.mjs
git commit -m "feat: connect teaching cases to live simulator actions"
```

## Task 5: Enforce the learner-monitor transport allowlist

**Files:**

- Modify: `ui/liveSimTransport.js`
- Modify: `ui/liveSimView.js`
- Modify: `crisis-sim/test/live-transport.test.js`
- Modify: `crisis-sim/test/live-sim-display.test.js`

- [ ] **Step 1: Write failing allowlist and denial tests**

Export and test `projectLearnerMonitorSnapshot(snapshot)`. Feed a snapshot containing valid monitor data plus nested forbidden fields:

```js
const projected = projectLearnerMonitorSnapshot({
  t: 10, hr: 88, dbp: 70, patient: '70 kg · 40 y · Female',
  instructorGuide: { answer: 'postpone' },
  concealedFindings: ['MH'], expectedResponse: 'avoid volatile',
  rubricNotes: ['answer key'], caseContext: { private: true },
});
expect(projected).toEqual({ t: 10, hr: 88, dbp: 70, patient: '70 kg · 40 y · Female' });
expect(JSON.stringify(projected)).not.toMatch(/postpone|MH|answer key|private/);
```

Mutate the source after projection and the projection after publishing; prove the late-join payload is unchanged.

- [ ] **Step 2: Run transport tests and confirm RED**

```bash
cd crisis-sim
npx vitest run test/live-transport.test.js test/live-sim-display.test.js
```

Expected: FAIL because the projector and copy boundary do not exist.

- [ ] **Step 3: Implement the explicit allowlist**

```js
export const LEARNER_MONITOR_KEYS = Object.freeze([
  't', 'patient', 'hr', 'sbp', 'dbp', 'map', 'spo2', 'rr', 'etco2', 'temp',
  'tof', 'tofRatio', 'spontaneousRR', 'spontaneousTV', 'spontaneousMV',
  'spontaneousEffort', 'ppeak', 'mv', 'tv', 'fio2', 'ventMode', 'vaporizer',
  'vaporizerAgent', 'airwayDevice', 'forcedApnea', 'ventSetTV', 'ventSetRR',
  'ventSetPeep', 'ventSetPressure', 'ventSetPressureSupport', 'capnogramPresent',
]);

export function projectLearnerMonitorSnapshot(snapshot = {}) {
  return Object.fromEntries(LEARNER_MONITOR_KEYS
    .filter((key) => Object.hasOwn(snapshot, key))
    .map((key) => [key, snapshot[key]]));
}
```

Copy the projected object again inside `publishSnapshot` so callers cannot mutate `currentEnvelope.payload`. In `liveSimView.renderSnapshot`, publish only the projection.

- [ ] **Step 4: Run transport/display and snapshot coverage**

```bash
cd crisis-sim
npx vitest run test/live-transport.test.js test/live-sim-display.test.js
node test/snapshot-contract.mjs
```

Expected: PASS, including the `SNAPSHOT CONTRACT: PASS` line.

- [ ] **Step 5: Commit Task 5**

```bash
git add ui/liveSimTransport.js ui/liveSimView.js crisis-sim/test/live-transport.test.js crisis-sim/test/live-sim-display.test.js
git commit -m "fix: isolate learner monitor transport data"
```

## Task 6: Build pure learner and instructor case UI models

**Files:**

- Create: `ui/liveCaseModel.js`
- Create: `crisis-sim/test/case-ui.test.js`

- [ ] **Step 1: Write failing markup and escaping tests**

Require these exported functions:

```js
renderLearnerCaseShell()
renderInstructorCaseShell()
renderLearnerCaseMarkup(context)
renderInstructorCaseMarkup(context)
formatCaseClock(seconds)
```

Assert the shells include stable accessible IDs:

```js
for (const id of [
  'live-case-workspace', 'live-case-stage-chart', 'live-case-stage-interview',
  'live-case-stage-exam', 'live-case-stage-findings', 'live-case-stage-plan',
  'live-case-notes', 'live-case-submit-findings', 'live-case-submit-plan',
]) expect(renderLearnerCaseShell()).toContain(`id="${id}"`);

for (const id of [
  'live-case-instructor', 'live-case-current-phase', 'live-case-active-event',
  'live-case-considerations', 'live-case-history', 'live-case-pause',
  'live-case-advance', 'live-case-branches',
]) expect(renderInstructorCaseShell()).toContain(`id="${id}"`);
```

Use malicious chart, response, guidance, note, and scenario strings and assert escaped text with no executable HTML. Test `aria-live`, fieldset/legend grouping, label associations, disabled/finalized state, observed/missed/not-yet-evaluable controls, reveal checkbox, and chronological history.

- [ ] **Step 2: Run UI-model tests and confirm RED**

```bash
cd crisis-sim
npx vitest run test/case-ui.test.js
```

Expected: FAIL because `liveCaseModel.js` does not exist.

- [ ] **Step 3: Implement pure rendering helpers**

Use the existing escaping convention:

```js
export function escapeCaseHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
```

No renderer reads runner internals, global DOM, or full scenario definitions. It accepts only learner or instructor projections and returns strings/pure formatted objects.

- [ ] **Step 4: Run focused UI tests**

```bash
cd crisis-sim
npx vitest run test/case-ui.test.js test/rubric-ui.test.js
```

Expected: PASS and existing rubric markup unchanged.

- [ ] **Step 5: Commit Task 6**

```bash
git add ui/liveCaseModel.js crisis-sim/test/case-ui.test.js
git commit -m "feat: render learner and instructor case panels"
```

## Task 7: Wire the case workspace and instructor feedback panel into the live console

**Files:**

- Create: `ui/liveCaseView.js`
- Modify: `ui/liveSimModel.js`
- Modify: `ui/liveSimView.js`
- Modify: `assets/css/live-sim.css`
- Modify: `crisis-sim/test/case-ui.test.js`
- Modify: `crisis-sim/test/rubric-ui.test.js`

- [ ] **Step 1: Write failing controller tests**

Using the existing fake-element pattern, test that:

- scenario load refreshes both projections atomically;
- assessment buttons call `performAssessmentAction` with the exact `actionId`;
- stage navigation cannot skip invalid transitions;
- findings and plan forms submit stable structured values plus optional notes/rationale;
- instructor observation controls pass status/note/reveal to the public runner APIs;
- pause/resume/advance/branch controls call only public APIs;
- finalized state disables all mutation controls;
- reset/load removes prior case DOM state; and
- a case workspace coexists with every existing drug, airway, TOF, rubric, monitor, and display control.

- [ ] **Step 2: Run controller tests and confirm RED**

```bash
cd crisis-sim
npx vitest run test/case-ui.test.js test/rubric-ui.test.js
```

Expected: FAIL because the case panels are not in `renderShell` and handlers are absent.

- [ ] **Step 3: Add combined scenario registry metadata**

Preserve `RUBRIC_SCENARIOS` and `RUBRIC_SCENARIO_ASSETS` exports for compatibility. Add:

```js
export const TEACHING_CASES = Object.freeze([
  { id: 'cn_preassessment_lap_chole_001', label: 'Preassessment - Lap Chole / PONV' },
  { id: 'cn_preassessment_npo_mh_001', label: 'Preassessment - NPO / MH / Difficult Airway' },
]);

export const TEACHING_CASE_ASSETS = Object.freeze({
  cn_preassessment_lap_chole_001: Object.freeze({
    scenarioUrl: '/crisis-sim/sim/scenarios/cn_preassessment_lap_chole_001.json',
  }),
  cn_preassessment_npo_mh_001: Object.freeze({
    scenarioUrl: '/crisis-sim/sim/scenarios/cn_preassessment_npo_mh_001.json',
  }),
});
```

Add a generalized `loadSelectedScenarioAssets` that fetches an optional rubric URL and calls `loadCaseScenario` for teaching cases or the existing `loadRubricScenario` for rubric-only cases.

- [ ] **Step 4: Integrate UI shells and public API handlers**

Implement `createLiveCaseController({ runner, root, onChanged })` in `ui/liveCaseView.js`. It owns case DOM queries, event delegation, structured form reads, and projection rendering. It returns `{ render(), reset(), destroy() }` and never reads runner internals.

`ui/liveSimView.js` only mounts the controller, inserts the learner workspace before live case controls, and inserts the instructor panel inside the existing sticky instructor stack before the rubric/event log. Update panels from `getLearnerCaseContext()` and `getInstructorCaseContext()`, never `runner.s.activeScenario` or another private field.

Do not write case data into `snapshot()`. Refresh case projections after accepted actions, fixed-step ticks, reset, scenario load, stage change, instructor control, and finalization.

- [ ] **Step 5: Add responsive CSS**

Use the existing tokens. Required layout behavior:

```css
.live-case-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(20rem, .8fr); gap: 1rem; }
.live-case-scroll { max-height: min(52vh, 42rem); overflow: auto; min-width: 0; }
@media (max-width: 980px) { .live-case-grid { grid-template-columns: 1fr; } }
```

Add visible focus styles, minimum 44px interactive targets, no horizontal clipping at 320px, and independent scrolling so the instructor can retain the active event while navigating history.

- [ ] **Step 6: Run UI and app integration tests**

```bash
cd crisis-sim
npx vitest run test/case-ui.test.js test/rubric-ui.test.js test/app-integration.test.js test/live-ui-model.test.js
```

Expected: PASS.

- [ ] **Step 7: Commit Task 7**

```bash
git add ui/liveCaseView.js ui/liveSimModel.js ui/liveSimView.js assets/css/live-sim.css crisis-sim/test/case-ui.test.js crisis-sim/test/rubric-ui.test.js
git commit -m "feat: add live case assessment and instructor feedback UI"
```

## Task 8: Append finalized case evidence to debrief and print output

**Files:**

- Create: `crisis-sim/sim/scenario/caseDebrief.js`
- Create: `crisis-sim/test/case-debrief.test.js`
- Modify: `crisis-sim/sim/scenario/scenarioDebrief.js`
- Modify: `crisis-sim/ui/simRunner.js`
- Modify: `ui/liveSimView.js`
- Modify: `ui/liveSimModel.js`

- [ ] **Step 1: Write failing case-debrief validation tests**

Require the additive result key `caseResult` with:

```js
{
  caseId,
  outcome: 'completed' | 'appropriately_deferred',
  finalizedAtSec,
  assessment: { actions, discoveredFindings, missedFindings, findingsSubmission },
  plan: { selections, rationale, ruleResults },
  eventTimeline,
  instructorObservations,
  releasedFeedback,
  revisions,
}
```

Reject unfinalized results, nonchronological records, unknown release IDs, unsafe/non-JSON values, invalid outcome, and instructor-only unreleased guidance in `releasedFeedback`.

Test that existing no-case and rubric-only `SimulationResult` shapes remain valid and unchanged.

- [ ] **Step 2: Run debrief tests and confirm RED**

```bash
cd crisis-sim
npx vitest run test/case-debrief.test.js test/rubric-debrief.test.js
```

Expected: FAIL because `caseDebrief.js` and additive composition do not exist.

- [ ] **Step 3: Implement strict debrief composition**

Export:

```js
export function buildCaseDebrief({ baseResult, caseSessionResult, caseDefinition })
```

It validates/copies both inputs and returns `{ ...baseResult, caseResult }`. Only considerations selected through `setCaseFeedbackReveal` appear in `releasedFeedback`. Every timeline entry has `source` equal to `learner`, `instructor`, `scenario`, or `administrative`.

Extend `scenarioDebrief.buildDebrief` with optional final parameters:

```js
caseSessionResult = null,
caseDefinition = null,
```

Composition order is base legacy result, optional rubric debrief, then optional case debrief.

- [ ] **Step 4: Integrate finalization and printable output**

`SimRunner.buildDebrief()` throws `CASE_DEBRIEF_NOT_FINALIZED` when an active case is not finalized. `finalizeCaseDebrief()` refuses required pending instructor observations and returns their IDs. `beginCaseDebriefRevision()` unlocks only case feedback and records a revision entry.

The print output adds Assessment, Anesthetic Plan, Event Timeline, Instructor Observations, and Released Teaching Feedback sections. It labels training-only branches and appropriately deferred cases explicitly.

- [ ] **Step 5: Run focused debrief/UI coverage**

```bash
cd crisis-sim
npx vitest run test/case-debrief.test.js test/rubric-debrief.test.js test/case-ui.test.js test/rubric-ui.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit Task 8**

```bash
git add crisis-sim/sim/scenario/caseDebrief.js crisis-sim/sim/scenario/scenarioDebrief.js crisis-sim/ui/simRunner.js ui/liveSimView.js ui/liveSimModel.js crisis-sim/test/case-debrief.test.js crisis-sim/test/case-ui.test.js
git commit -m "feat: add assessment and event evidence to debriefs"
```

## Task 9: Author and prove the two Carson-Newman teaching scenarios

**Files:**

- Create: `crisis-sim/sim/scenarios/cn_preassessment_lap_chole_001.json`
- Create: `crisis-sim/sim/scenarios/cn_preassessment_npo_mh_001.json`
- Create: `crisis-sim/test/case-scenarios.test.js`
- Create: `crisis-sim/test/case-evidence.mjs`
- Create: `crisis-sim/test/case-evidence.test.js`

- [ ] **Step 1: Write failing literal scenario-contract tests**

Load both JSON files and assert exact identity and critical source facts.

Karen required finding IDs:

```js
[
  'current_smoker', 'controlled_gerd', 'severe_prior_ponv',
  'airway_assessed', 'anesthetic_history_reviewed',
]
```

Karen required plan rule IDs:

```js
[
  'asa_ii_with_reason', 'aspiration_strategy', 'multimodal_ponv_prophylaxis',
  'smoking_pulmonary_plan', 'postoperative_pain_plan',
]
```

Brittany required finding IDs:

```js
[
  'heavy_breakfast_two_hours', 'family_history_mh', 'pregnancy_screen_needed',
  'predicted_difficult_airway', 'dental_injury_risk',
]
```

Brittany required plan rule IDs:

```js
[
  'asa_not_changed_by_npo', 'postpone_elective_case', 'escalate_mh_history',
  'trigger_free_plan', 'difficult_airway_plan', 'team_communication',
]
```

Assert the `proceed_for_training` branch is instructor-only, is labeled not recommended, and cannot be entered by a learner plan selection alone.

- [ ] **Step 2: Run scenario tests and confirm RED**

```bash
cd crisis-sim
npx vitest run test/case-scenarios.test.js
```

Expected: FAIL because the two JSON assets do not exist.

- [ ] **Step 3: Author Karen Whitfield as a complete vertical slice**

Use synthetic identifiers and the supplied Practice Pack facts. Event phases and IDs are exact:

```js
[
  'preassessment', 'preinduction', 'induction_airway',
  'laparoscopic_maintenance', 'emergence', 'debrief',
]
```

Required live events:

- `case_ready` on initial phase entry;
- `plan_accepted` after valid plan submission;
- `induction_started` after accepted induction drug action;
- `airway_secured` after `intubation_attempt_succeeded`;
- `pneumoperitoneum_started` by instructor activation, effect `set_surgical_stimulus` at an intensity validated by existing limits;
- `ventilatory_challenge_detected` from a finite EtCO2 dwell threshold;
- `ventilation_adjusted` after accepted machine-setting action;
- `surgical_stimulus_ended` by phase transition, effect stimulus zero;
- `emergence_started` after volatile reduction or explicit phase advance; and
- `case_complete` after safe emergence criteria or instructor advance.

Guidance must cover GERD/aspiration reasoning, PONV risk and multimodal prevention, smoking/pulmonary implications, ventilation during laparoscopy, and emergence plan. Only selected items are released in debrief.

- [ ] **Step 4: Author Brittany Cole with primary and training-only branches**

Primary phases:

```js
['preassessment', 'plan_review', 'appropriately_deferred', 'debrief']
```

The primary branch completes successfully only when the learner discovers the NPO violation and submits `disposition: 'postpone'` with MH escalation. NPO status does not change the expected ASA classification.

Training-only phases:

```js
[
  'training_preinduction', 'trigger_free_induction', 'difficult_airway',
  'training_maintenance', 'training_emergence',
]
```

Required optional events:

- `training_branch_activated` by instructor only;
- `unsafe_trigger_selected` after Succinylcholine or volatile action;
- `mh_complication_started` using the existing `MalignantHyperthermia` complication only when the unsafe trigger condition is satisfied;
- `first_intubation_attempt_failed` from the existing deterministic airway plan;
- `rescue_oxygenation_started` from accepted mask PPV;
- `second_intubation_attempt_succeeded` from the actual airway procedure event; and
- `trigger_free_path_maintained` when no unsafe trigger occurs through its response window.

The scenario/debrief must repeatedly label `proceed_for_training` as an instructor-selected educational counterfactual, not the recommended clinical disposition.

- [ ] **Step 5: Build executable scenario evidence**

`case-evidence.mjs` runs and exports JSON summaries for:

1. Karen complete discovery/plan/event/debrief path.
2. Karen missed PONV history and late ventilation correction.
3. Brittany correct postpone path with no live anesthetic actions.
4. Brittany missed NPO/MH findings.
5. Brittany instructor training branch with failed attempt, PPV rescue, successful second attempt, and trigger-free maintenance.
6. Brittany unsafe-trigger branch activating existing MH physiology and appropriate treatment.
7. Two identical mixed runs with byte-identical assessment, mid-event, mid-response-window, physiologic, and debrief fingerprints.

Every run uses only public `SimRunner` methods and inspects only public projections, logs, snapshots, and debriefs.

- [ ] **Step 6: Run scenario and evidence tests**

```bash
cd crisis-sim
npx vitest run test/case-scenarios.test.js test/case-evidence.test.js
node test/case-evidence.mjs
```

Expected: all tests PASS and the script ends with `CASE_EVIDENCE: PASS`.

- [ ] **Step 7: Commit Task 9**

```bash
git add crisis-sim/sim/scenarios/cn_preassessment_lap_chole_001.json crisis-sim/sim/scenarios/cn_preassessment_npo_mh_001.json crisis-sim/test/case-scenarios.test.js crisis-sim/test/case-evidence.mjs crisis-sim/test/case-evidence.test.js
git commit -m "feat: add Carson-Newman preanesthesia teaching cases"
```

## Task 10: Registry, PWA, smoke, documentation, and full verification

**Files:**

- Modify: `ui/liveSimModel.js`
- Modify: `ui/liveSimView.js`
- Modify: `sw.js`
- Modify: `crisis-sim/test/pwa-contract.test.js`
- Modify: `crisis-sim/test/live-case-smoke.mjs`
- Modify: `crisis-sim/test/app-integration.test.js`
- Modify: `docs/live-sim-integration.md`
- Modify: `FINAL_STATUS.md`

- [ ] **Step 1: Write failing registry/PWA/smoke expectations**

Require both case IDs in the selector/asset registry, every new browser-loaded runtime/UI module and both JSON files in `APP_SHELL`, a new cache version containing `preanesthesia-cases`, and no duplicate normalized cache paths.

Extend the smoke to:

```text
load Karen
  -> complete chart/interview/exam
  -> submit findings and plan
  -> perform induction and timed intubation
  -> activate laparoscopy event
  -> adjust ventilation based on actual EtCO2 response
  -> emerge, check TOF, reverse as appropriate, extubate
  -> score instructor observations
  -> select teaching feedback
  -> finalize and build unified debrief
```

The smoke still covers Lidocaine controls, bronchospasm rescue, volatile choice, TOF-0 neostigmine behavior, and existing rubric finalization through its existing segments.

- [ ] **Step 2: Run delivery tests and confirm RED**

```bash
cd crisis-sim
npx vitest run test/pwa-contract.test.js test/app-integration.test.js
node test/live-case-smoke.mjs
```

Expected: FAIL until registry, cache, docs, and smoke are updated.

- [ ] **Step 3: Update registry and PWA**

Add all new assets, bump cache version to:

```js
const CACHE_VERSION = 'v54-preanesthesia-cases-2026-07-18';
```

Update the cache-busting query used by the live-sim launcher only where the current PWA contract requires it. Do not remove old cache eviction safeguards.

- [ ] **Step 4: Document operator-visible behavior and limitation**

In `docs/live-sim-integration.md`, document:

- selecting and loading either teaching case;
- trainee workflow through chart, assessment, plan, and simulator;
- instructor phase feedback, observations, reveal selection, branch controls, and finalization;
- appropriately deferred case behavior;
- the explicitly counterfactual training branch;
- exported debrief sections;
- synthetic-data requirement; and
- the exact client-only/static-asset confidentiality limitation and need for an authenticated backend for anti-cheating security.

Update `FINAL_STATUS.md` with commit/test evidence only after verification succeeds.

- [ ] **Step 5: Run targeted full-path evidence**

```bash
cd crisis-sim
npx vitest run test/case-contract.test.js test/case-session.test.js test/case-flow.test.js test/case-runner.test.js test/live-transport.test.js test/case-ui.test.js test/case-debrief.test.js test/case-scenarios.test.js test/case-evidence.test.js test/pwa-contract.test.js
node test/case-evidence.mjs
node test/live-case-smoke.mjs
node test/rubric-evidence.mjs
```

Expected endings:

```text
CASE_EVIDENCE: PASS
LIVE CASE SMOKE: PASS
RUBRIC_EVIDENCE: PASS
```

- [ ] **Step 6: Run the complete regression suite**

```bash
cd crisis-sim
npm test
```

Expected: every test passes; the count is greater than the 579-test baseline.

- [ ] **Step 7: Run repository hygiene and inspect scope**

```bash
git diff --check
git status --short
git diff --stat HEAD~10..HEAD
```

Expected: no whitespace errors, only planned files changed, no generated render artifacts or source documents added.

- [ ] **Step 8: Commit Task 10**

```bash
git add ui/liveSimModel.js ui/liveSimView.js sw.js crisis-sim/test/pwa-contract.test.js crisis-sim/test/live-case-smoke.mjs crisis-sim/test/app-integration.test.js docs/live-sim-integration.md FINAL_STATUS.md
git commit -m "test: verify preanesthesia scenario workflow"
```

## Per-task delegated review loop

The user selected subagent-driven development. For every task above:

1. Dispatch a fresh implementer with only that task, the approved spec, and relevant current files.
2. Require test-first RED evidence before implementation edits.
3. Require the implementer to run the task's focused tests and self-review before returning.
4. Dispatch a fresh specification reviewer. Fix every Critical or Important spec finding.
5. Dispatch a fresh code-quality reviewer. Fix every Critical or Important quality finding.
6. Re-run focused tests and `git diff --check` in the primary agent.
7. Commit only the task's files with the planned message.
8. Do not allow reviewers to approve code they authored.

After Task 10, dispatch terminal specification and quality reviewers across the full branch, then run complete verification again before pushing.

## Stop conditions

Stop and report rather than weakening evidence if:

- a frozen non-case fixture changes;
- an existing rubric rule or result changes without an approved requirement;
- case guidance appears in the full snapshot or learner transport;
- a new event directly writes a derived vital;
- live action bridging double-administers a drug or procedure;
- a correct Brittany postpone path is forced into live anesthesia;
- determinism differs across identical runs; or
- the same root failure remains after three focused correction attempts.
