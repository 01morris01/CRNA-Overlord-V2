// Pure learner and instructor case UI models.
//
// Every renderer in this module accepts ONLY a learner or instructor case
// projection (or a projection-shaped plain object) and returns strings or
// frozen formatted objects. No renderer reads runner internals, the global
// DOM, or full scenario definitions. Learner renderers extract an explicit
// allowlist of learner-visible fields so a hostile instructor-shaped object
// can never leak concealed responses, significance, guidance, expected or
// unsafe responses, red flags, scoring guidance, rule answers, or unreleased
// debrief text into learner markup.

const OBSERVATION_STATUSES = Object.freeze([
  'observed',
  'missed',
  'not_yet_evaluable',
]);

const LEARNER_STAGE_PANELS = Object.freeze([
  Object.freeze({ id: 'live-case-stage-chart', title: 'Chart review', region: 'chart' }),
  Object.freeze({ id: 'live-case-stage-interview', title: 'Patient interview', region: 'interview' }),
  Object.freeze({ id: 'live-case-stage-exam', title: 'Focused exam', region: 'exam' }),
  Object.freeze({ id: 'live-case-stage-findings', title: 'Findings summary', region: 'findings' }),
  Object.freeze({ id: 'live-case-stage-plan', title: 'Anesthetic plan', region: 'plan' }),
]);

const LEARNER_CHART_LISTS = Object.freeze([
  Object.freeze({ key: 'documents', title: 'Documents' }),
  Object.freeze({ key: 'medications', title: 'Medications' }),
  Object.freeze({ key: 'allergies', title: 'Allergies' }),
  Object.freeze({ key: 'labs', title: 'Labs' }),
  Object.freeze({ key: 'studies', title: 'Studies' }),
]);

export function escapeCaseHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

export function formatCaseClock(seconds) {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) return '00:00';
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (part) => String(part).padStart(2, '0');
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
    : `${pad(minutes)}:${pad(secs)}`;
}

function asPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asText(value) {
  return typeof value === 'string' ? value : (typeof value === 'number' && Number.isFinite(value) ? String(value) : '');
}

function humanizeToken(value) {
  return asText(value).replaceAll('_', ' ');
}

function titleizeToken(value) {
  const humanized = humanizeToken(value);
  return humanized.length === 0 ? humanized : humanized[0].toUpperCase() + humanized.slice(1);
}

function disabledAttr(disabled) {
  return disabled ? ' disabled' : '';
}

// ---------------------------------------------------------------------------
// Shells
// ---------------------------------------------------------------------------

export function renderLearnerCaseShell() {
  const stagePanels = LEARNER_STAGE_PANELS.map(({ id, title, region }) => `
      <section id="${id}" class="live-case-stage" data-case-region="${region}" aria-labelledby="${id}-heading">
        <h3 id="${id}-heading">${title}</h3>
        <div class="live-case-stage-content" data-case-region-content="${region}"><p class="live-empty">No teaching case loaded.</p></div>
      </section>`).join('');
  return `
    <section id="live-case-workspace" class="live-panel live-case-workspace" aria-labelledby="live-case-workspace-heading">
      <div class="live-case-header">
        <p class="live-eyebrow">PREANESTHESIA CASE</p>
        <h2 id="live-case-workspace-heading">Learner case workspace</h2>
      </div>
      <output id="live-case-status" class="live-case-status" aria-live="polite">No teaching case loaded.</output>
      ${stagePanels}
      <label class="live-field live-case-notes-field" for="live-case-notes">
        <span>Learner notes (optional)</span>
        <textarea id="live-case-notes" maxlength="2000" rows="3"></textarea>
      </label>
      <div class="live-case-actions" role="group" aria-label="Case submissions">
        <button id="live-case-submit-findings" type="button" class="live-primary" disabled>SUBMIT FINDINGS</button>
        <button id="live-case-submit-plan" type="button" class="live-primary" disabled>SUBMIT PLAN</button>
      </div>
    </section>`;
}

export function renderInstructorCaseShell() {
  return `
    <section id="live-case-instructor" class="live-panel live-case-instructor" aria-labelledby="live-case-instructor-heading">
      <div class="live-case-header">
        <p class="live-eyebrow">INSTRUCTOR · CASE EVENTS</p>
        <h2 id="live-case-instructor-heading">Case event feedback</h2>
      </div>
      <dl class="live-case-flow-summary">
        <div><dt>Current phase</dt><dd id="live-case-current-phase">—</dd></div>
        <div><dt>Active event</dt><dd id="live-case-active-event" aria-live="polite">None</dd></div>
      </dl>
      <div class="live-case-flow-controls" role="group" aria-label="Case flow controls">
        <button id="live-case-pause" type="button" disabled>PAUSE CASE</button>
        <button id="live-case-advance" type="button" disabled>ADVANCE PHASE</button>
      </div>
      <div id="live-case-branches" class="live-case-branches" role="group" aria-label="Instructor branch controls">
        <p class="live-empty">No instructor branches available.</p>
      </div>
      <section class="live-case-considerations-section" aria-labelledby="live-case-considerations-heading">
        <h3 id="live-case-considerations-heading">Phase considerations</h3>
        <ol id="live-case-considerations" class="live-case-considerations"><li class="live-empty">No active considerations.</li></ol>
      </section>
      <section class="live-case-history-section" aria-labelledby="live-case-history-heading">
        <h3 id="live-case-history-heading">Case history</h3>
        <ol id="live-case-history" class="live-case-history"><li class="live-empty">No case events recorded.</li></ol>
      </section>
    </section>`;
}

// ---------------------------------------------------------------------------
// Learner-safe extraction
// ---------------------------------------------------------------------------

function pickLearnerAction(action) {
  const source = asPlainObject(action);
  const completed = source.completed === true;
  const picked = {
    id: asText(source.id),
    stage: asText(source.stage),
    domain: asText(source.domain),
    prompt: asText(source.prompt),
    completed,
  };
  if (completed) picked.response = asText(source.response);
  return picked;
}

function pickLearnerFinding(finding) {
  const source = asPlainObject(finding);
  const discovered = source.discovered === true;
  const picked = {
    id: asText(source.id),
    learnerLabel: asText(source.learnerLabel),
    discovered,
  };
  if (discovered) picked.significance = asText(source.significance);
  return picked;
}

function pickLearnerPlanField(field) {
  const source = asPlainObject(field);
  return {
    id: asText(source.id),
    type: source.type === 'multi' ? 'multi' : 'single',
    required: source.required === true,
    options: asArray(source.options).map((option) => asText(option)),
  };
}

function pickLearnerSubmission(submission, keys) {
  const source = asPlainObject(submission);
  if (submission === null || submission === undefined) return null;
  const picked = {};
  for (const key of keys) {
    if (Object.hasOwn(source, key)) picked[key] = source[key];
  }
  return picked;
}

function pickLearnerContext(context) {
  const source = asPlainObject(context);
  const chart = asPlainObject(source.learnerChart);
  const patient = asPlainObject(chart.patient);
  const procedure = asPlainObject(chart.scheduledProcedure);
  const surgery = asPlainObject(source.surgery);
  const flowState = asPlainObject(source.flowState);
  return {
    active: source.active === true,
    stage: asText(source.stage),
    finalized: source.finalized === true,
    outcome: asText(source.outcome),
    patient: {
      syntheticName: asText(patient.syntheticName),
      mrn: asText(patient.mrn),
      ageYears: asText(patient.ageYears),
      sex: asText(patient.sex),
    },
    scheduledProcedure: {
      name: asText(procedure.name),
      site: asText(procedure.site),
      laterality: asText(procedure.laterality),
    },
    chartLists: LEARNER_CHART_LISTS.map(({ key, title }) => ({
      title,
      entries: asArray(chart[key]),
    })),
    surgery: {
      procedure: asText(surgery.procedure),
      indication: asText(surgery.indication),
      position: asText(surgery.position),
      expectedDurationMin: asText(surgery.expectedDurationMin),
      expectedStimulation: asText(surgery.expectedStimulation),
      bloodLossRisk: asText(surgery.bloodLossRisk),
    },
    actions: asArray(source.actions).map(pickLearnerAction),
    discoveredFindings: asArray(source.discoveredFindings).map(pickLearnerFinding),
    planFields: asArray(source.planFields).map(pickLearnerPlanField),
    findingsSubmission: pickLearnerSubmission(
      source.findingsSubmission,
      ['findingIds', 'notes', 'tSec', 'sequence'],
    ),
    planSubmission: pickLearnerSubmission(
      source.planSubmission,
      ['selections', 'rationale', 'tSec', 'sequence'],
    ),
    flowState: {
      currentPhaseTitle: asText(flowState.currentPhaseTitle),
      paused: flowState.paused === true,
    },
  };
}

// ---------------------------------------------------------------------------
// Learner markup
// ---------------------------------------------------------------------------

function renderChartEntryMarkup(entry) {
  if (entry === null || typeof entry !== 'object') return escapeCaseHtml(entry);
  if (Array.isArray(entry)) return entry.map(renderChartEntryMarkup).join(' · ');
  return Object.entries(entry)
    .map(([key, value]) => `${escapeCaseHtml(humanizeToken(key))}: ${escapeCaseHtml(
      value !== null && typeof value === 'object' ? JSON.stringify(value) : value,
    )}`)
    .join(' · ');
}

function renderLearnerActionListMarkup(actions, stage, locked) {
  const items = actions
    .filter((action) => action.stage === stage)
    .map((action) => `
      <li class="live-case-action-item">
        <button type="button" class="live-case-action" data-case-action="${escapeCaseHtml(action.id)}"${disabledAttr(locked || action.completed)}>
          <span>${escapeCaseHtml(action.prompt)}</span>
          <small>${escapeCaseHtml(humanizeToken(action.domain))}</small>
        </button>
        ${action.completed ? `<p class="live-case-response">${escapeCaseHtml(action.response)}</p>` : ''}
      </li>`);
  if (items.length === 0) return '<p class="live-empty">No available actions.</p>';
  return `<ol class="live-case-action-list">${items.join('')}</ol>`;
}

function renderLearnerChartMarkup(safe, locked) {
  const chartLists = safe.chartLists.map(({ title, entries }) => {
    const items = entries.length === 0
      ? '<li class="live-empty">None recorded.</li>'
      : entries.map((entry) => `<li>${renderChartEntryMarkup(entry)}</li>`).join('');
    return `
      <section class="live-case-chart-list">
        <h4>${escapeCaseHtml(title)}</h4>
        <ul>${items}</ul>
      </section>`;
  }).join('');
  return `
    <dl class="live-case-patient">
      <div><dt>Patient</dt><dd>${escapeCaseHtml(safe.patient.syntheticName)}</dd></div>
      <div><dt>MRN</dt><dd>${escapeCaseHtml(safe.patient.mrn)}</dd></div>
      <div><dt>Age</dt><dd>${escapeCaseHtml(safe.patient.ageYears)}</dd></div>
      <div><dt>Sex</dt><dd>${escapeCaseHtml(safe.patient.sex)}</dd></div>
      <div><dt>Scheduled procedure</dt><dd>${escapeCaseHtml(safe.scheduledProcedure.name)}</dd></div>
      <div><dt>Site</dt><dd>${escapeCaseHtml(safe.scheduledProcedure.site)} · ${escapeCaseHtml(safe.scheduledProcedure.laterality)}</dd></div>
      <div><dt>Surgical plan</dt><dd>${escapeCaseHtml(safe.surgery.procedure)} — ${escapeCaseHtml(safe.surgery.indication)}</dd></div>
      <div><dt>Position · Duration</dt><dd>${escapeCaseHtml(safe.surgery.position)} · ${escapeCaseHtml(safe.surgery.expectedDurationMin)} min</dd></div>
      <div><dt>Stimulation · Blood loss</dt><dd>${escapeCaseHtml(safe.surgery.expectedStimulation)} · ${escapeCaseHtml(safe.surgery.bloodLossRisk)}</dd></div>
    </dl>
    ${chartLists}
    ${renderLearnerActionListMarkup(safe.actions, 'chart_review', locked)}`;
}

function renderLearnerFindingsMarkup(safe, locked) {
  const submittedIds = new Set(asArray(safe.findingsSubmission?.findingIds)
    .map((id) => asText(id)));
  const items = safe.discoveredFindings.map((finding) => {
    const controlId = `live-case-finding-${finding.id}`;
    return `
      <li class="live-case-finding">
        <input type="checkbox" id="${escapeCaseHtml(controlId)}" data-case-finding="${escapeCaseHtml(finding.id)}"${submittedIds.has(finding.id) ? ' checked' : ''}${disabledAttr(locked)}>
        <label for="${escapeCaseHtml(controlId)}">
          <span>${escapeCaseHtml(finding.learnerLabel)}</span>
          ${finding.discovered ? `<small>${escapeCaseHtml(finding.significance)}</small>` : ''}
        </label>
      </li>`;
  });
  const list = items.length === 0
    ? '<p class="live-empty">No findings available yet.</p>'
    : `<ul class="live-case-finding-list">${items.join('')}</ul>`;
  const submittedNotes = safe.findingsSubmission === null
    ? ''
    : `<p class="live-case-submission-note">Submitted notes · ${escapeCaseHtml(asText(safe.findingsSubmission.notes))}</p>`;
  return `${list}${submittedNotes}${renderLearnerActionListMarkup(safe.actions, 'findings_summary', locked)}`;
}

function renderLearnerPlanMarkup(safe, locked) {
  const selections = asPlainObject(safe.planSubmission?.selections);
  const fieldsets = safe.planFields.map((field) => {
    const selection = Object.hasOwn(selections, field.id) ? selections[field.id] : undefined;
    const selected = new Set((Array.isArray(selection) ? selection : (selection === undefined ? [] : [selection]))
      .map((option) => asText(option)));
    const inputType = field.type === 'multi' ? 'checkbox' : 'radio';
    const options = field.options.map((option) => {
      const controlId = `live-case-plan-${field.id}-${option}`;
      return `
        <span class="live-case-option">
          <input type="${inputType}" id="${escapeCaseHtml(controlId)}" name="live-case-plan-${escapeCaseHtml(field.id)}" value="${escapeCaseHtml(option)}" data-case-plan-field="${escapeCaseHtml(field.id)}"${selected.has(option) ? ' checked' : ''}${disabledAttr(locked)}>
          <label for="${escapeCaseHtml(controlId)}">${escapeCaseHtml(humanizeToken(option))}</label>
        </span>`;
    }).join('');
    return `
      <fieldset class="live-case-plan-group"${disabledAttr(locked)}>
        <legend>${escapeCaseHtml(titleizeToken(field.id))}${field.required ? ' *' : ''}</legend>
        ${options}
      </fieldset>`;
  }).join('');
  const rationale = safe.planSubmission === null
    ? ''
    : `<p class="live-case-plan-rationale">Submitted rationale · ${escapeCaseHtml(asText(safe.planSubmission.rationale))}</p>`;
  const body = fieldsets.length === 0
    ? '<p class="live-empty">No plan fields available.</p>'
    : fieldsets;
  return `${body}${rationale}${renderLearnerActionListMarkup(safe.actions, 'plan_submission', locked)}`;
}

function buildLearnerStatus(safe) {
  if (!safe.active && !safe.finalized) return 'No teaching case loaded.';
  const parts = [`Stage · ${humanizeToken(safe.stage).toUpperCase()}`];
  if (safe.flowState.currentPhaseTitle.length > 0) {
    parts.push(`Phase · ${safe.flowState.currentPhaseTitle}`);
  }
  if (safe.flowState.paused) parts.push('PAUSED');
  if (safe.finalized) {
    parts.push(safe.outcome.length > 0
      ? `FINALIZED · ${humanizeToken(safe.outcome).toUpperCase()}`
      : 'FINALIZED');
  }
  return escapeCaseHtml(parts.join(' — '));
}

export function renderLearnerCaseMarkup(context = {}) {
  const safe = pickLearnerContext(context);
  const locked = safe.finalized || !safe.active;
  return Object.freeze({
    chart: renderLearnerChartMarkup(safe, locked),
    interview: renderLearnerActionListMarkup(safe.actions, 'interview', locked),
    exam: renderLearnerActionListMarkup(safe.actions, 'focused_exam', locked),
    findings: renderLearnerFindingsMarkup(safe, locked),
    plan: renderLearnerPlanMarkup(safe, locked),
    status: buildLearnerStatus(safe),
    submitFindingsDisabled: locked || safe.stage !== 'findings_summary',
    submitPlanDisabled: locked || safe.stage !== 'plan_submission',
    notesDisabled: locked,
    finalized: safe.finalized,
  });
}

// ---------------------------------------------------------------------------
// Instructor markup
// ---------------------------------------------------------------------------

function latestObservationsById(observations) {
  const byId = new Map();
  for (const observation of asArray(observations)) {
    const source = asPlainObject(observation);
    const considerationId = asText(source.considerationId);
    if (considerationId.length > 0) byId.set(considerationId, source);
  }
  return byId;
}

function renderInstructorConsiderationMarkup(consideration, { observation, revealed, locked }) {
  const source = asPlainObject(consideration);
  const id = asText(source.id);
  const responseWindowSec = source.responseWindowSec;
  const observationStatus = asText(asPlainObject(observation).status);
  const observationNote = asText(asPlainObject(observation).note);
  const redFlags = asArray(source.redFlags)
    .map((flag) => `<li>${escapeCaseHtml(flag)}</li>`)
    .join('');
  const statusButtons = OBSERVATION_STATUSES.map((status) => `
        <button type="button" data-case-observation="${escapeCaseHtml(id)}" data-case-status="${status}" aria-pressed="${observationStatus === status}"${disabledAttr(locked)}>${humanizeToken(status).toUpperCase()}</button>`).join('');
  return `
    <li class="live-case-consideration" data-case-consideration="${escapeCaseHtml(id)}">
      <h4>${escapeCaseHtml(source.title)}</h4>
      <p class="live-case-consideration-text">${escapeCaseHtml(source.consideration)}</p>
      <p class="live-case-expected">Expected response · ${escapeCaseHtml(source.expectedResponse)}</p>
      ${typeof responseWindowSec === 'number' && responseWindowSec > 0
    ? `<p class="live-case-response-window">Response window · ${formatCaseClock(responseWindowSec)}</p>`
    : ''}
      ${redFlags.length > 0 ? `<ul class="live-case-red-flags">${redFlags}</ul>` : ''}
      <p class="live-case-scoring-guidance">${escapeCaseHtml(source.scoringGuidance)}</p>
      <div class="live-case-observation-controls" role="group" aria-label="Observation status for ${escapeCaseHtml(source.title)}">${statusButtons}
      </div>
      <label class="live-case-observation-note-field">
        <span>Instructor note (optional)</span>
        <input type="text" data-case-observation-note="${escapeCaseHtml(id)}" value="${escapeCaseHtml(observationNote)}" maxlength="500"${disabledAttr(locked)}>
      </label>
      <label class="live-case-reveal">
        <input type="checkbox" data-case-reveal="${escapeCaseHtml(id)}"${revealed ? ' checked' : ''}${disabledAttr(locked)}>
        <span>Release in finalized debrief</span>
      </label>
    </li>`;
}

function historyDetailMarkup(entry) {
  const details = [];
  for (const key of [
    'actionId', 'fromStage', 'toStage', 'stage', 'considerationId',
    'eventId', 'branchId', 'phaseId', 'status', 'revision',
  ]) {
    if (Object.hasOwn(entry, key)) {
      details.push(`${escapeCaseHtml(humanizeToken(key))} ${escapeCaseHtml(entry[key])}`);
    }
  }
  return details.length === 0 ? '' : `<small>${details.join(' · ')}</small>`;
}

function renderInstructorHistoryMarkup(timeline) {
  const entries = asArray(timeline)
    .map((entry) => asPlainObject(entry))
    .slice()
    .sort((left, right) => {
      const leftTime = typeof left.tSec === 'number' ? left.tSec : 0;
      const rightTime = typeof right.tSec === 'number' ? right.tSec : 0;
      if (leftTime !== rightTime) return leftTime - rightTime;
      const leftSequence = typeof left.sequence === 'number' ? left.sequence : 0;
      const rightSequence = typeof right.sequence === 'number' ? right.sequence : 0;
      return leftSequence - rightSequence;
    });
  if (entries.length === 0) return '<li class="live-empty">No case events recorded.</li>';
  return entries.map((entry) => `
    <li class="live-case-history-item">
      <span class="live-case-history-time">${formatCaseClock(entry.tSec)}</span>
      <span class="live-case-history-kind">${escapeCaseHtml(entry.kind)}</span>
      ${historyDetailMarkup(entry)}
    </li>`).join('');
}

export function renderInstructorCaseMarkup(context = {}) {
  const source = asPlainObject(context);
  const active = source.active === true;
  const finalized = source.finalized === true;
  const locked = finalized || !active;
  const flowState = asPlainObject(source.flowState);
  const hasFlowState = Object.keys(flowState).length > 0;
  const paused = flowState.paused === true;

  const phaseTitle = asText(flowState.currentPhaseTitle);
  const phaseId = asText(flowState.currentPhaseId);
  const currentPhase = phaseTitle.length > 0 || phaseId.length > 0
    ? escapeCaseHtml([phaseTitle, phaseId.length > 0 ? `(${phaseId})` : ''].filter((part) => part.length > 0).join(' '))
    : '—';

  const activeEventIds = asArray(flowState.activeEventIds)
    .map((eventId) => asText(eventId))
    .filter((eventId) => eventId.length > 0);
  const activeEvent = activeEventIds.length === 0
    ? 'None'
    : escapeCaseHtml(activeEventIds.join(' · '));

  const branchIds = asArray(flowState.availableBranchIds)
    .map((branchId) => asText(branchId))
    .filter((branchId) => branchId.length > 0);
  const branches = branchIds.length === 0
    ? '<p class="live-empty">No instructor branches available.</p>'
    : branchIds.map((branchId) => `
      <button type="button" class="live-case-branch" data-case-branch="${escapeCaseHtml(branchId)}"${disabledAttr(locked)}>${escapeCaseHtml(humanizeToken(branchId).toUpperCase())}</button>`).join('');

  const observations = latestObservationsById(source.instructorObservations);
  const revealIds = new Set(asArray(source.feedbackRevealIds).map((id) => asText(id)));
  const considerationItems = asArray(source.considerations)
    .map((consideration) => renderInstructorConsiderationMarkup(consideration, {
      observation: observations.get(asText(asPlainObject(consideration).id)) ?? null,
      revealed: revealIds.has(asText(asPlainObject(consideration).id)),
      locked,
    }));
  const considerations = considerationItems.length === 0
    ? '<li class="live-empty">No active considerations.</li>'
    : considerationItems.join('');

  return Object.freeze({
    currentPhase,
    activeEvent,
    branches,
    considerations,
    history: renderInstructorHistoryMarkup(source.timeline),
    pauseLabel: paused ? 'RESUME CASE' : 'PAUSE CASE',
    pauseDisabled: locked || !hasFlowState,
    advanceDisabled: locked || !hasFlowState,
    finalized,
  });
}
