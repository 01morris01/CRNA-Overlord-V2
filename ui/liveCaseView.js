// Live case controller: mounts the learner case workspace and instructor
// case-event panel onto the live console DOM and drives every mutation
// exclusively through the public SimRunner case APIs.
//
// Boundary rules:
// - The controller never reads runner internals. It renders only from
//   runner.getLearnerCaseContext() and runner.getInstructorCaseContext(),
//   and mutates only through the stable public case methods.
// - All markup is produced by the pure renderers in liveCaseModel.js; this
//   module owns DOM queries, event delegation, structured form reads, and
//   projection refreshes.

import {
  escapeCaseHtml,
  renderInstructorCaseMarkup,
  renderLearnerCaseMarkup,
} from './liveCaseModel.js';

const LEARNER_REGIONS = Object.freeze(['chart', 'interview', 'exam', 'findings', 'plan']);

const STAGE_NAV_SHELL = '<nav id="live-case-stage-nav" class="live-case-stage-nav" aria-label="Assessment stage navigation"></nav>';

function humanizeStage(stage) {
  const text = String(stage ?? '').replaceAll('_', ' ');
  return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1);
}

function renderStageNavMarkup(learnerContext, learnerMarkup) {
  const context = learnerContext !== null && typeof learnerContext === 'object'
    ? learnerContext
    : {};
  if (context.active !== true && learnerMarkup.finalized !== true) {
    return '<p class="live-empty">No teaching case loaded.</p>';
  }
  const assessmentStages = Array.isArray(context.assessmentStages)
    ? context.assessmentStages
    : [];
  const stages = [...assessmentStages, 'plan_submission'];
  const currentIndex = stages.indexOf(context.stage);
  const nextStage = learnerMarkup.finalized !== true
    && currentIndex >= 0
    && context.stage !== 'plan_submission'
    ? stages[currentIndex + 1] ?? null
    : null;
  return stages.map((stage) => {
    const isCurrent = stage === context.stage;
    const enabled = stage === nextStage;
    return `<button type="button" data-case-stage="${escapeCaseHtml(stage)}"`
      + `${isCurrent ? ' aria-current="step"' : ''}`
      + `${enabled ? '' : ' disabled'}>${escapeCaseHtml(humanizeStage(stage))}</button>`;
  }).join('');
}

export function createLiveCaseController({
  runner, root, onChanged = () => {}, onPrint = () => {},
} = {}) {
  const query = (selector) => root?.querySelector?.(selector) ?? null;

  const workspace = query('#live-case-workspace');
  const status = query('#live-case-status');
  const notes = query('#live-case-notes');
  const submitFindings = query('#live-case-submit-findings');
  const submitPlan = query('#live-case-submit-plan');
  const regions = Object.fromEntries(LEARNER_REGIONS
    .map((region) => [region, query(`[data-case-region-content="${region}"]`)]));
  const instructor = query('#live-case-instructor');
  const currentPhase = query('#live-case-current-phase');
  const activeEvent = query('#live-case-active-event');
  const pause = query('#live-case-pause');
  const advance = query('#live-case-advance');
  const branches = query('#live-case-branches');
  const caseEvents = query('#live-case-events');
  const considerations = query('#live-case-considerations');
  const history = query('#live-case-history');
  const printButton = query('#live-case-print');

  let stageNav = query('#live-case-stage-nav');
  if (!stageNav && status?.insertAdjacentHTML) {
    status.insertAdjacentHTML('afterend', STAGE_NAV_SHELL);
    stageNav = query('#live-case-stage-nav');
  }

  let lastRenderKey = null;
  let lastPaused = false;
  let clearDraftsOnNextRender = false;
  let destroyed = false;

  function queryAllIn(element, selector) {
    return [...(element?.querySelectorAll?.(selector) ?? [])];
  }

  function captureDrafts() {
    return {
      findings: new Map(queryAllIn(workspace, '[data-case-finding]')
        .filter((control) => control?.dataset?.caseFinding !== undefined)
        .map((control) => [control.dataset.caseFinding, control.checked === true])),
      plan: new Map(queryAllIn(workspace, '[data-case-plan-field]')
        .filter((control) => control?.dataset?.casePlanField !== undefined)
        .map((control) => [
          `${control.dataset.casePlanField}::${control.value}`,
          control.checked === true,
        ])),
      observationNotes: new Map(queryAllIn(instructor, '[data-case-observation-note]')
        .filter((control) => control?.dataset?.caseObservationNote !== undefined)
        .map((control) => [control.dataset.caseObservationNote, control.value ?? ''])),
    };
  }

  function restoreDrafts(drafts) {
    for (const control of queryAllIn(workspace, '[data-case-finding]')) {
      const key = control?.dataset?.caseFinding;
      if (key !== undefined && drafts.findings.has(key)) {
        control.checked = drafts.findings.get(key);
      }
    }
    for (const control of queryAllIn(workspace, '[data-case-plan-field]')) {
      const key = `${control?.dataset?.casePlanField}::${control?.value}`;
      if (control?.dataset?.casePlanField !== undefined && drafts.plan.has(key)) {
        control.checked = drafts.plan.get(key);
      }
    }
    for (const control of queryAllIn(instructor, '[data-case-observation-note]')) {
      const key = control?.dataset?.caseObservationNote;
      if (key !== undefined && drafts.observationNotes.has(key)) {
        control.value = drafts.observationNotes.get(key);
      }
    }
  }

  function render() {
    if (destroyed) return;
    const learnerContext = runner.getLearnerCaseContext();
    const instructorContext = runner.getInstructorCaseContext();
    lastPaused = instructorContext?.flowState?.paused === true;
    const learnerMarkup = renderLearnerCaseMarkup(learnerContext ?? {});
    const instructorMarkup = renderInstructorCaseMarkup(instructorContext ?? {});
    const stageNavMarkup = renderStageNavMarkup(learnerContext, learnerMarkup);
    const renderKey = JSON.stringify([learnerMarkup, instructorMarkup, stageNavMarkup]);
    if (renderKey === lastRenderKey) return;
    lastRenderKey = renderKey;

    const drafts = clearDraftsOnNextRender ? null : captureDrafts();
    clearDraftsOnNextRender = false;

    for (const region of LEARNER_REGIONS) {
      if (regions[region]) regions[region].innerHTML = learnerMarkup[region];
    }
    if (status) status.innerHTML = learnerMarkup.status;
    if (stageNav) stageNav.innerHTML = stageNavMarkup;
    if (notes) notes.disabled = learnerMarkup.notesDisabled;
    if (submitFindings) submitFindings.disabled = learnerMarkup.submitFindingsDisabled;
    if (submitPlan) submitPlan.disabled = learnerMarkup.submitPlanDisabled;

    if (currentPhase) currentPhase.innerHTML = instructorMarkup.currentPhase;
    if (activeEvent) activeEvent.innerHTML = instructorMarkup.activeEvent;
    if (branches) branches.innerHTML = instructorMarkup.branches;
    if (caseEvents) caseEvents.innerHTML = instructorMarkup.instructorEvents;
    if (considerations) considerations.innerHTML = instructorMarkup.considerations;
    if (history) history.innerHTML = instructorMarkup.history;
    if (pause) {
      pause.textContent = instructorMarkup.pauseLabel;
      pause.disabled = instructorMarkup.pauseDisabled;
    }
    if (advance) advance.disabled = instructorMarkup.advanceDisabled;
    // The printable case record is only available once the case is finalized.
    if (printButton) printButton.disabled = runner.isCaseFinalized?.() !== true;

    if (drafts) restoreDrafts(drafts);
  }

  function runAction(kind, invoke) {
    let result;
    try {
      result = invoke();
    } catch (error) {
      result = { ok: false, reason: error?.message ?? 'CASE_CONTROL_FAILED' };
    }
    render();
    onChanged({ kind, result });
    return result;
  }

  function readFindingIds() {
    return queryAllIn(workspace, '[data-case-finding]')
      .filter((control) => control?.checked === true
        && control?.dataset?.caseFinding !== undefined)
      .map((control) => String(control.dataset.caseFinding));
  }

  function readPlanSelections() {
    const selections = {};
    for (const control of queryAllIn(workspace, '[data-case-plan-field]')) {
      const fieldId = control?.dataset?.casePlanField;
      if (fieldId === undefined) continue;
      if (control.type === 'checkbox') {
        if (!Array.isArray(selections[fieldId])) selections[fieldId] = [];
        if (control.checked === true) selections[fieldId].push(String(control.value));
      } else if (control.checked === true) {
        selections[fieldId] = String(control.value);
      }
    }
    return selections;
  }

  function readObservationNote(considerationId) {
    const control = queryAllIn(instructor, '[data-case-observation-note]')
      .find((candidate) => candidate?.dataset?.caseObservationNote === considerationId);
    return control?.value ?? '';
  }

  function handleWorkspaceClick(event) {
    const actionButton = event.target?.closest?.('[data-case-action]');
    if (actionButton) {
      runAction('assessment_action', () => runner.performAssessmentAction({
        actionId: actionButton.dataset.caseAction,
      }));
      return;
    }
    const stageButton = event.target?.closest?.('[data-case-stage]');
    if (stageButton) {
      runAction('stage_advance', () => runner.advanceCaseStage({
        stage: stageButton.dataset.caseStage,
      }));
    }
  }

  function handleSubmitFindings() {
    runAction('findings_submission', () => runner.submitCaseFindings({
      findingIds: readFindingIds(),
      notes: notes?.value ?? '',
    }));
  }

  function handleSubmitPlan() {
    runAction('plan_submission', () => runner.submitCasePlan({
      selections: readPlanSelections(),
      rationale: notes?.value ?? '',
    }));
  }

  function handleInstructorClick(event) {
    const observationButton = event.target?.closest?.('[data-case-observation]');
    if (observationButton) {
      const considerationId = observationButton.dataset.caseObservation;
      runAction('instructor_observation', () => runner.setInstructorCaseObservation({
        considerationId,
        status: observationButton.dataset.caseStatus,
        note: readObservationNote(considerationId),
      }));
      return;
    }
    const branchButton = event.target?.closest?.('[data-case-branch]');
    if (branchButton) {
      runAction('branch_activation', () => runner.activateCaseBranch({
        branchId: branchButton.dataset.caseBranch,
      }));
      return;
    }
    const eventButton = event.target?.closest?.('[data-case-event]');
    if (eventButton) {
      runAction('instructor_event', () => runner.activateCaseEvent({
        eventId: eventButton.dataset.caseEvent,
      }));
    }
  }

  function handleInstructorChange(event) {
    const revealControl = event.target?.closest?.('[data-case-reveal]');
    if (!revealControl) return;
    runAction('feedback_reveal', () => runner.setCaseFeedbackReveal({
      considerationId: revealControl.dataset.caseReveal,
      reveal: revealControl.checked === true,
    }));
  }

  function handlePauseToggle() {
    runAction('case_pause', () => (lastPaused ? runner.resumeCase() : runner.pauseCase()));
  }

  function handlePhaseAdvance() {
    runAction('phase_advance', () => runner.advanceCasePhase());
  }

  function handlePrint() {
    if (runner.isCaseFinalized?.() !== true) return;
    onPrint();
  }

  const bindings = [
    [workspace, 'click', handleWorkspaceClick],
    [submitFindings, 'click', handleSubmitFindings],
    [submitPlan, 'click', handleSubmitPlan],
    [instructor, 'click', handleInstructorClick],
    [instructor, 'change', handleInstructorChange],
    [pause, 'click', handlePauseToggle],
    [advance, 'click', handlePhaseAdvance],
    [printButton, 'click', handlePrint],
  ];
  for (const [element, eventType, handler] of bindings) {
    element?.addEventListener?.(eventType, handler);
  }

  function reset() {
    if (destroyed) return;
    clearDraftsOnNextRender = true;
    lastRenderKey = null;
    if (notes) notes.value = '';
    render();
  }

  function destroy() {
    if (destroyed) return;
    for (const [element, eventType, handler] of bindings) {
      element?.removeEventListener?.(eventType, handler);
    }
    destroyed = true;
  }

  return { render, reset, destroy };
}
