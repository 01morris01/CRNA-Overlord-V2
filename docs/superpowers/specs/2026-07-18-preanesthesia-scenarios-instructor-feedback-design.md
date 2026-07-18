# Preanesthesia Scenarios and Instructor Event Feedback Design

Status: approved in conversation, pending written-spec review
Date: 2026-07-18
Branch: `feature/rubric-scoring`
Base: `c005ab1`

## Objective

Extend the verified live anesthesia simulator with a continuous educational case experience:

```text
chart review
  -> structured preanesthesia interview and focused examination
  -> findings summary and anesthetic plan
  -> deterministic live simulation
  -> instructor-finalized debrief
```

The first release adds:

1. a learner-facing synthetic patient chart;
2. a structured, scoreable preanesthesia assessment;
3. a structured anesthetic-plan submission;
4. an instructor-only event-feedback area;
5. deterministic scenario phases and response windows;
6. a unified assessment-to-physiology timeline and debrief; and
7. two complete teaching scenarios grounded in the supplied Carson-Newman materials.

The educational-use fence remains visible. This is a teaching simulator, not a clinical record, decision-support device, or examination system of record.

## Source grounding

The design is based on these supplied teaching materials:

- `Carson-Newman_Preanesthesia_Record.docx`
- `Preanesthetic Assessment part1 (1).pptx`
- `Preanesthetic_Assessment_Practice_Pack.docx`
- `Preanesthetic_Assessment_Tutorial_Guide.docx`
- `00_Anesthesia_Implications_Summary.docx`

Together they establish the required chart domains, assessment sequence, probe-and-close-the-loop method, patient-specific plan, instructor coach guidance, and post-case teaching format.

The Practice Pack's learner role and coach check-off are intentionally separate. The implications summary is instructor reference and post-case study material. The product preserves that boundary: a trainee does not receive the answer key while the case is active.

## Approved product decisions

1. Live clinical considerations are instructor-only.
2. Selected teaching feedback becomes learner-visible only after the instructor finalizes the debrief.
3. The learner actively performs the preanesthesia assessment instead of merely reading a completed chart.
4. The first release uses structured interview and examination choices for deterministic scoring, with an optional free-text notes field.
5. Free-text conversational patient simulation is deferred.
6. The first release delivers two complete vertical-slice scenarios before expanding the wider scenario catalog.
7. The first scenarios are:
   - Karen Whitfield: laparoscopic cholecystectomy, current smoking, controlled GERD, and severe prior PONV.
   - Brittany Cole: knee arthroscopy, recent heavy meal/NPO violation, malignant-hyperthermia family history, and a predicted difficult airway.
8. Scenario events advance deterministically, with timestamped instructor pause, advance, and optional-branch controls.
9. A correct postpone/defer decision may end a case successfully before live anesthetic care. The instructor can deliberately enter a labeled training-only branch when further simulation is educationally useful.

## Non-negotiable boundaries

1. No assessment, event, guidance, or scoring API writes a derived vital.
2. Physiologic consequences enter through modeled causes such as drugs, ventilation, airway state, surgical stimulus, or an established complication model.
3. Fixed timestep, deterministic action order, seeded behavior, and existing float32 discipline remain intact.
4. Scenario and feedback logic consume no RNG unless a future scenario contract explicitly defines and tests seeded consumption.
5. The single existing NMB state remains authoritative for TOF, respiratory muscle ability, and reversal.
6. Airway-device state, respiratory drive, ventilatory support, and NMB remain orthogonal.
7. Existing frozen fixtures, rubric evidence, smoke coverage, and PWA behavior remain additive and green.
8. Learner-display transport never receives concealed findings, expected answers, instructor considerations, instructor notes, or rubric answer keys.
9. Only synthetic patient identities and data may be stored in repository, browser cache, exported debrief, or print output.
10. Instructor overrides are explicit, timestamped, attributable, and revision-preserving.

## Architecture decision

Three approaches were considered.

### Extend current rubric JSON directly

This is initially fast but mixes patient facts, concealed answers, event state, and rubric scoring. It increases the chance of answer-key leakage and makes scenario flow dependent on one rubric implementation. Rejected.

### Build a separate preassessment application

This isolates the interview but fragments the case timeline, duplicates case loading, and complicates the final debrief. Rejected for the first release.

### Unified case contract with role-separated projections

Selected. One validated scenario definition supports the continuous case, while public runner APIs expose only the projection required by each UI surface.

```text
validated case definition
  |- learner case projection
  |    |- chart
  |    |- discovered assessment findings
  |    `- learner-safe phase cues
  |- instructor case projection
  |    |- concealed findings
  |    |- current considerations
  |    |- expected response and window
  |    `- scoring and branch controls
  |- physiologic simulation inputs
  `- finalized debrief projection
       |- unified timeline
       |- scored findings and actions
       `- selected teaching explanations
```

The full definition remains internal to the scenario/session boundary. Public accessors return defensive copies.

## Current integration points

The design extends, rather than replaces, these existing boundaries:

- `crisis-sim/sim/scenario/scenarioLoader.js`: validation and normalization.
- `crisis-sim/sim/scenario/scenarioManager.js`: deterministic phase/event lifecycle.
- `crisis-sim/sim/scenario/rubricScoringSession.js`: trusted copied action and fixed-step evidence boundary.
- `crisis-sim/sim/scenario/rubricDebrief.js`: finalized rubric evidence and timeline.
- `crisis-sim/ui/simRunner.js`: public case/session APIs and live action bridge.
- `ui/liveSimModel.js`: approved scenario registry and assets.
- `ui/liveSimView.js`: learner assessment workspace and instructor console.
- `ui/liveSimTransport.js`: learner-display allowlist.
- `crisis-sim/sim/scenarios/`: validated synthetic scenario assets.
- `sw.js`: offline asset list and versioning.

The existing scenario manager already supports fixed-time events and partial action-triggered behavior. Live `SimRunner` actions do not currently reach that legacy action evaluator. The implementation adds one canonical action bridge without administering drugs twice, duplicating procedures, or changing physiology solely to record evidence.

## Scenario data contract

The additive contract has these logical sections:

```js
{
  id,
  title,
  version,
  category,
  difficulty,
  courseUnit,
  learningObjectives,
  learnerChart,
  assessment,
  planRequirements,
  surgery,
  eventFlow,
  instructorGuide,
  debrief,
  patientProfile,
  startingSetup,
  rubricId,
  rubricCriteria,
}
```

Existing physiology, setup, airway-plan, and rubric fields remain valid.

### Learner chart

`learnerChart` contains only facts available before questioning or examination:

```js
{
  patient: { syntheticName, mrn, dob, ageYears, sex, heightCm, weightKg, bmi },
  scheduledProcedure: { name, site, laterality, surgeon, date, plannedAnesthesia },
  documents: [
    { id, title, type, sections: [...] },
  ],
  medications: [...],
  allergies: [...],
  labs: [...],
  studies: [...],
  baselineVitals: {...},
}
```

Scenario authors decide which facts are initially visible and which require assessment. Concealed answers never appear in this projection.

### Assessment

```js
{
  stages: ["chart_review", "interview", "focused_exam", "findings_summary"],
  actions: [
    {
      id,
      stage,
      domain,
      prompt,
      response,
      reveals: [findingId],
      prerequisites: [actionId],
      scoringRuleId,
      critical,
    },
  ],
  findings: [
    {
      id,
      learnerLabel,
      significance,
      initiallyVisible,
      instructorOnlyUntilDiscovered,
    },
  ],
  requiredDomains: [...],
}
```

Selectable actions include focused questions, follow-up probes, record review, and physical-examination maneuvers. The optional notes field is stored as learner-authored narrative but does not use keyword guessing for automatic credit in the first release.

### Plan requirements

The learner submits structured choices for:

- ASA status and rationale;
- proceed, postpone, optimize, or escalate decision;
- anesthetic technique;
- aspiration and airway strategy;
- induction and maintenance agents;
- monitoring and access;
- PONV prevention and analgesia;
- trigger-free precautions where applicable;
- postoperative disposition; and
- team communication.

Each choice references stable IDs. Free-text rationale supplements the structured record but is instructor-scored unless a rule can be derived from explicit selections.

### Surgery

```js
{
  procedure,
  indication,
  position,
  expectedDurationMin,
  expectedStimulation,
  bloodLossRisk,
  physiologicChallenges,
  anesthesiaConsiderations,
}
```

Learner-visible surgery facts and instructor-only implications are projected separately.

### Event flow

```js
{
  initialPhaseId,
  phases: [
    {
      id,
      title,
      enterWhen,
      events: [...],
      completionWhen,
      allowedInstructorControls,
    },
  ],
  branches: [...],
}
```

Each event has a stable ID, trigger, repeat policy, response window, expected and unsafe responses, physiologic input action if any, guidance references, and debrief references.

Supported triggers for this release are:

- fixed simulation time;
- phase-relative time;
- accepted learner action;
- submitted plan choice;
- modeled physiologic threshold with dwell/hysteresis where required; and
- explicit instructor activation.

Event processing is idempotent unless `repeatable` is explicitly true. Equal-time events use stable scenario order.

### Instructor guide

```js
{
  considerations: [
    {
      id,
      phaseId,
      eventId,
      title,
      consideration,
      expectedResponse,
      responseWindowSec,
      redFlags,
      scoringGuidance,
      defaultRevealInDebrief,
    },
  ],
}
```

Guidance is explanatory. It does not become a learner action and does not silently award or remove points.

## Case lifecycle

The session state machine is:

```text
not_loaded
  -> chart_review
  -> interview
  -> focused_exam
  -> findings_summary
  -> plan_submission
  -> live_simulation | appropriately_deferred
  -> debrief_draft
  -> debrief_finalized
  -> debrief_revision (explicit instructor action only)
```

Moving backward requires a defined instructor control and is logged. Loading a different case or resetting clears discoveries, plan state, active phase, event history, response timers, instructor observations, feedback selections, and debrief draft.

An appropriately deferred case remains a completed educational run. It produces a debrief without inventing intraoperative actions.

## Assessment and scoring semantics

The assessment measures four separate facts:

```text
finding discovered
  -> significance interpreted
  -> implication incorporated into plan
  -> correct action taken
```

Credit for one stage does not imply credit for later stages. For example, discovering a heavy meal does not automatically award the postpone decision.

Sequence-sensitive rules use canonical timestamps. Examples include asking the required NPO timing before plan submission, following a positive history with a severity probe, and recognizing MH risk before selecting triggering agents.

Automatic scoring is limited to explicit structured actions, plan selections, real simulator actions, and modeled trace data. Communication quality, empathy, nuanced rationale, and other human-observed behaviors remain pending for instructor scoring.

Instructor decisions use the existing revision-preserving model: value, note, timestamp, and revision history. Finalization is blocked while required instructor-observed items remain pending.

## Instructor event-feedback area

The instructor console adds a dedicated, independently scrollable panel containing:

- case and current phase;
- active clinical event;
- considerations the trainee should be evaluating;
- expected response and response window;
- red flags or critical omissions;
- `observed`, `missed`, and `not yet evaluable` controls;
- event-specific instructor notes;
- timestamped history;
- reveal-in-debrief selection; and
- permitted pause, advance, and optional-branch controls.

Considerations are concise and phase-specific. Historical items remain available without obscuring the active item. Controls are keyboard accessible, visibly labeled, and usable at the existing instructor-console breakpoints.

Finalized feedback is read-only. Starting a revision is explicit and appears in the exported history.

## Learner assessment workspace

The learner-facing workspace provides four ordered tabs or steps:

1. Chart Review
2. Interview and Focused Examination
3. Findings Summary
4. Anesthetic Plan

The interface shows discovered information, not the full answer set. Structured controls use clinical labels and avoid game-like point totals during the attempt. The learner can maintain optional notes.

The workspace transitions to the live monitor/control experience only when the plan is submitted and the case has not appropriately ended through postponement or escalation.

## Visibility and security

The runtime exposes distinct public projections:

- learner case context;
- instructor guidance and control state;
- learner-display physiology; and
- finalized debrief.

The physiologic snapshot contract does not gain instructor or answer-key fields. `liveSimTransport` sends an explicit learner-display allowlist rather than forwarding the complete runner snapshot.

Defensive-copy tests prove that callers cannot mutate the loaded definition or session by editing returned objects.

The current application uses client-side authentication and statically hosted assets. Therefore this release prevents ordinary UI and transport leakage but cannot provide cryptographic anti-cheating protection against a user deliberately inspecting downloadable static assets. That limitation must be documented in the instructor UI and deployment notes. Server-authenticated instructor assets and role authorization are a separate future project.

## Deterministic event behavior

The flow evaluator consumes canonical accepted actions after the underlying action succeeds. A rejected drug, invalid transition, or failed validation does not satisfy a rule.

The bridge must not call both a runner procedure and a legacy scenario procedure. It records one normalized evidence event after the real action has already changed the model.

Condition triggers are evaluated on the fixed simulation step. Threshold triggers define comparison, dwell time, and reset/hysteresis behavior. Mid-event and mid-response-window fingerprints are included in determinism evidence.

Instructor actions do not consume RNG. Pause freezes scenario progression consistently with the established simulation pause behavior; it does not rewrite timestamps.

## Initial scenarios

### CN Preassessment 001: Karen Whitfield

Scheduled procedure: laparoscopic cholecystectomy.

Assessment targets:

- current smoking history;
- controlled GERD and aspiration implications;
- severe previous PONV;
- focused airway and anesthetic history;
- appropriate ASA classification and rationale; and
- multimodal PONV prevention.

Live flow:

- preinduction preparation;
- induction and airway management;
- laparoscopic surgical-stimulation/ventilatory challenge through modeled inputs;
- maintenance response;
- emergence; and
- PONV-prevention review.

### CN Preassessment 002: Brittany Cole

Scheduled procedure: elective knee arthroscopy.

Assessment targets:

- heavy breakfast approximately two hours before assessment;
- family history consistent with malignant hyperthermia;
- pregnancy-screen consideration;
- predicted difficult airway and dental risk;
- ASA classification independent of the NPO violation; and
- proceed/postpone reasoning and team communication.

Primary correct branch:

- elective case postponed/deferred for NPO violation;
- MH history escalated and trigger-free precautions documented; and
- educational run concludes with debrief.

Optional instructor-marked training branch:

- the instructor explicitly selects `proceed_for_training`;
- the debrief never represents that branch as the correct real-world disposition;
- full-stomach airway planning, trigger-free technique, difficult-intubation rescue, and unsafe MH-trigger recognition can then be exercised using existing modeled systems.

## Debrief

The finalized debrief combines:

- assessment and chart-review actions;
- findings discovered and missed;
- plan choices and revisions;
- simulator action timeline;
- physiologic trace and consequences;
- event recognition and treatment timing;
- instructor scores, observations, and revisions;
- selected teaching feedback; and
- review topics from the supplied materials.

Instructor-only guidance not selected for release remains absent from learner-facing output. The printable view distinguishes learner actions, instructor controls, administrative setup, automatic events, and post-case explanations.

## Validation and failure handling

Scenario loading validates the complete additive contract before mutating the active runner. Validation rejects:

- missing or duplicate IDs;
- unknown phase, event, finding, guidance, or scoring references;
- unreachable phases or branches;
- invalid response windows or threshold definitions;
- concealed data placed in learner-visible fields;
- direct derived-vital mutation instructions in new event definitions;
- unsupported instructor controls; and
- malformed patient/setup/rubric data already rejected by existing loaders.

Failed load leaves the prior active case and session untouched.

Event firing is idempotent. Reset is complete. Scenario changes do not retain prior discoveries or guidance. Asynchronous asset loading uses a generation token or equivalent guard so a stale response cannot overwrite a newer selection.

## Testing and evidence

### Contract and lifecycle

- Valid cases load atomically.
- Malformed sections fail before mutation.
- Returned projections are defensive copies.
- Reset and scenario change clear all new state.
- Equal-time events preserve stable ordering.

### Assessment and plan scoring

- Correct discovery, follow-up, interpretation, plan, and action score separately.
- Missed and late findings remain distinguishable.
- Prerequisite and sequence rules cannot be satisfied out of order.
- Optional notes do not receive guessed automatic credit.
- Required human observations remain pending until instructor-scored.

### Event flow

- Time-, phase-, action-, plan-, physiology-, and instructor-triggered events activate correctly.
- Failed/rejected actions do not satisfy expected responses.
- Repeat protection and explicit repeat behavior work.
- Pause, advance, and optional branch controls are timestamped.
- No event writes a derived vital.
- A mixed run is bit-reproducible, including mid-event and mid-response-window samples.

### Visibility

- Learner context excludes concealed assessment responses and instructor guidance.
- Monitor snapshot and broadcast payload exclude chart-private fields, expected reactions, instructor notes, rubric answers, and answer keys.
- Finalized learner debrief contains only feedback selected for release.
- HTML content is escaped and rendered through existing safe patterns.

### Scenario evidence

- Karen: smoking, GERD, and severe PONV can each be discovered, interpreted, planned for, and debriefed.
- Karen: modeled intraoperative events react to actual learner actions and physiology.
- Brittany: a correct NPO assessment and postpone decision complete the primary path.
- Brittany: missing the NPO or MH history is legible in score and debrief.
- Brittany: the training-only branch is explicit, reproducible, and never presented as the correct disposition.
- Instructor considerations change with phase and never appear live to the trainee.

### Regression and delivery

- Existing full test suite remains green; baseline at design time is 579 tests.
- Frozen high-spinal and malignant-hyperthermia evidence remains unchanged.
- Live induction-to-emergence smoke remains green.
- Rubric evidence remains green.
- Snapshot contract remains explicit.
- Responsive/keyboard-accessible UI contracts pass.
- PWA scenario assets and cache version are updated and tested.

## Staged implementation decomposition

Implementation proceeds through independently reviewed tasks:

1. Scenario contract validation and normalized immutable data.
2. Learner, instructor, transport, and debrief projections.
3. Assessment session state and structured scoring.
4. Canonical live-action bridge and deterministic event-flow evaluator.
5. Instructor event-feedback panel.
6. Learner chart, interview, examination, findings, and plan workspace.
7. Unified debrief and print integration.
8. Karen Whitfield end-to-end scenario.
9. Brittany Cole primary and training-only branches.
10. Registry, PWA, responsive UI, full evidence, and deployment verification.

Each task uses a fresh delegated implementer followed by independent specification and code-quality reviews. Implementation does not start until this written design is reviewed by the user and an implementation plan is approved.

## Out of scope

- Free-text or AI-generated patient conversation.
- Real patient data or EHR integration.
- Server-enforced instructor/learner authorization.
- Cryptographic anti-cheating guarantees for static scenario assets.
- New physiologic disease models not required by the two initial cases.
- Direct manual editing of derived vitals.
- Automatic scoring of empathy, communication quality, physical technique, or nuanced narrative reasoning.
- Porting all 30 implication-summary cases in the first release.

## Acceptance criteria

The design is implemented when:

1. both initial scenarios are selectable and work offline;
2. the trainee can complete a structured, scoreable preassessment and plan;
3. the instructor sees phase-specific considerations and records event feedback;
4. live learner outputs contain no instructor answer-key data;
5. actual learner actions drive deterministic scenario events without duplicated physiology;
6. correct postponement and optional training branches behave as designed;
7. finalized debriefs unite assessment, plan, actions, physiology, and selected feedback; and
8. all new evidence and prior verification pass before commit and push.
