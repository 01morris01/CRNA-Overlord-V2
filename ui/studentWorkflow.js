/* Student workstation: one page, one patient, in order.

   1 Patient -> 2 Chart review -> 3 Interview -> 4 Care plan -> 5 Booth's grade
   -> 6 Into the OR (the monitor, where the student keeps talking to Booth).

   Each step unlocks the next; the student can go back to any step already
   reached. Progress is saved on this device. When the instructor console is
   open in the same browser, it follows along: the patient loads into the
   engine when the student picks one, and START unlocks when the plan is in.
   Booth is in the side panel the whole time. */

import { renderBoothDock, createBoothDock } from './boothDock.js';
import {
  createCarePlanController,
  loadStoredPlan,
  renderCarePlanModal,
  renderGradeMarkup,
} from './carePlanSheet.js';
import {
  MOCK_OR_BASE,
  MOCK_OR_EHR,
  buildChartDigest,
  buildChartInterviewGrounding,
} from './mockOrDay.js';
import { createPatientInterview } from './patientInterview.js';
import { bindLinkPanel, renderGuestLinkPanel } from './remoteLinkView.js';
import {
  createStudentChannel,
  readStudentSession,
  writeStudentSession,
} from './studentChannel.js';

export const STEPS = Object.freeze(['patient', 'chart', 'interview', 'plan', 'grade', 'or']);
export const REVIEW_ITEMS = Object.freeze(['allergies', 'meds', 'labs', 'history', 'logistics', 'notes']);
export const MIN_QUESTIONS = 3;
export const INTERVIEW_STORAGE_PREFIX = 'overlord.interview.v1.';

export function readInterview(storage, patientId) {
  try {
    const parsed = JSON.parse(storage?.getItem?.(`${INTERVIEW_STORAGE_PREFIX}${patientId}`) ?? '[]');
    return Array.isArray(parsed) ? parsed.slice(-80) : [];
  } catch { return []; }
}

export function writeInterview(storage, patientId, turns) {
  try { storage?.setItem?.(`${INTERVIEW_STORAGE_PREFIX}${patientId}`, JSON.stringify(turns.slice(-80))); } catch { /* storage blocked */ }
}

/* Pure: may the student leave this step for the next one? */
export function stepGate(step, state = {}) {
  switch (step) {
    case 'patient':
      return state.patientId ? { allowed: true } : { allowed: false, reason: 'Pick a patient.' };
    case 'chart': {
      const missing = REVIEW_ITEMS.filter((item) => !state.reviewed?.[item]);
      return missing.length === 0 ? { allowed: true } : { allowed: false, reason: `Check off the chart review (${REVIEW_ITEMS.length - missing.length} of ${REVIEW_ITEMS.length}).` };
    }
    case 'interview':
      return (state.questions ?? 0) >= MIN_QUESTIONS
        ? { allowed: true }
        : { allowed: false, reason: `Ask at least ${MIN_QUESTIONS} questions (${state.questions ?? 0} so far).` };
    case 'plan':
      return state.planSubmitted ? { allowed: true } : { allowed: false, reason: 'Submit the care plan.' };
    case 'grade':
      return state.planSubmitted ? { allowed: true } : { allowed: false, reason: 'Submit the care plan first.' };
    default:
      return { allowed: false, reason: 'This is the last step.' };
  }
}

/* Pure: the furthest step the student may open. */
export function furthestStep(state = {}) {
  let index = 0;
  while (index < STEPS.length - 1 && stepGate(STEPS[index], state).allowed) index += 1;
  return index;
}

function esc(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function initialState(saved) {
  return {
    patientId: saved?.patientId ?? null,
    step: STEPS.includes(saved?.step) ? saved.step : 'patient',
    reviewed: saved?.reviewed ?? {},
    questions: saved?.questions ?? 0,
    planSubmitted: false,
    autoInterview: Boolean(saved?.autoInterview),
  };
}

/* What the instructor's advance fills in, step by step: reaching a step means
   every earlier step was done correctly. Pure, used by the console. */
export function advanceSession(session = {}, patientId, step) {
  const target = STEPS.indexOf(step);
  const next = {
    patientId,
    step,
    reviewed: { ...(session.patientId === patientId ? session.reviewed : {}) },
    questions: session.patientId === patientId ? (session.questions ?? 0) : 0,
    autoInterview: session.patientId === patientId ? Boolean(session.autoInterview) : false,
    instructorStep: step,
    updatedAt: Date.now(),
  };
  if (target > STEPS.indexOf('chart')) for (const item of REVIEW_ITEMS) next.reviewed[item] = true;
  if (target > STEPS.indexOf('interview') && next.questions < MIN_QUESTIONS) {
    next.questions = Math.max(MIN_QUESTIONS, next.questions);
    next.autoInterview = true;
  }
  return next;
}

/* Shown in the transcript when the instructor skipped the interview: the
   scripted answers from the chart, as if the student had asked. */
export function scriptedInterview(grounding) {
  return (grounding?.qa ?? []).map((item) => ({ question: `${item.prompt}?`, answer: item.response }));
}

export function startStudentWorkflow({ root = document, storage = globalThis.localStorage, fetchImpl = globalThis.fetch?.bind(globalThis) } = {}) {
  const $ = (id) => root.getElementById(id);
  const channel = createStudentChannel({ role: 'student' });
  // On a computer other than the instructor's, the room code links the two.
  const linkSlot = $('student-remote-link');
  if (linkSlot && typeof globalThis.BroadcastChannel === 'function') {
    linkSlot.innerHTML = renderGuestLinkPanel();
    bindLinkPanel(linkSlot.firstElementChild, { role: 'guest' });
  }
  const state = initialState(readStudentSession(storage));
  let index = null;
  let patient = null;
  let answerKey = null;
  let consoleState = null;

  // Booth's side panel. He answers from the chart during preop and from the
  // live case once the instructor console is open.
  $('student-side').innerHTML = renderBoothDock();
  const dock = createBoothDock({
    root,
    channel,
    fetchImpl,
    getStandaloneContext: () => ({
      studentStep: state.step,
      mockOrCase: patient ? { patient: patient.label, procedure: patient.case?.procedure, chart: buildChartDigest(patient, { maxChars: 4000 }) } : null,
    }),
    localReply: () => 'Noted. Keep working the steps; I\'ll have more to say once the instructor console is open.',
  });

  // Care plan, inline.
  $('student-plan-host').innerHTML = renderCarePlanModal();
  const planModal = $('careplan-modal');
  planModal.hidden = false;
  const carePlan = createCarePlanController({
    root,
    storage,
    inline: true,
    fetchImpl,
    onOpenChart: () => go('chart'),
    onGraded: (status) => {
      state.planSubmitted = Boolean(status?.submitted);
      if (state.planSubmitted) channel?.post({ type: 'student-plan', patientId: state.patientId });
      renderGrade();
      render();
    },
  });

  // The interview survives a reload: every turn is saved per patient.
  const interview = createPatientInterview({
    runner: null,
    root,
    onTurn: () => { if (state.patientId) writeInterview(storage, state.patientId, interview.getTranscript()); },
  });
  const transcript = $('patient-interview-transcript');
  new MutationObserver(() => {
    const asked = transcript.querySelectorAll('.patient-interview-trainee').length;
    if (asked !== state.questions && asked > 0) { state.questions = asked; save(); render(); }
  }).observe(transcript, { childList: true });

  function save() {
    writeStudentSession(storage, {
      patientId: state.patientId, step: state.step, reviewed: state.reviewed, questions: state.questions,
      autoInterview: state.autoInterview, updatedAt: Date.now(),
    });
  }

  let lastReported = '';
  function report() {
    const record = state.patientId ? loadStoredPlan(storage, state.patientId) : null;
    const payload = {
      type: 'student-state', patientId: state.patientId, step: state.step, questions: state.questions,
      planSubmitted: state.planSubmitted, percent: record?.grade?.percent ?? null,
    };
    const key = JSON.stringify(payload);
    if (key === lastReported) return;
    lastReported = key;
    channel?.post(payload);
  }

  function fillScriptedInterview() {
    if (!patient || transcript.querySelector('.patient-interview-trainee')) return;
    const grounding = buildChartInterviewGrounding(patient);
    const note = root.createElement('p');
    note.className = 'student-instructor-note';
    const lead = grounding.participants?.find((entry) => entry.id === grounding.defaultSpeakerId);
    note.textContent = `Your instructor completed the interview. These are the answers from ${lead && lead.role !== 'patient' ? lead.label : 'the patient'}.`;
    transcript.append(note);
    for (const { question, answer } of scriptedInterview(grounding)) {
      for (const [role, text] of [['trainee', question], ['patient', answer]]) {
        const line = root.createElement('div');
        line.className = `patient-interview-turn patient-interview-${role}`;
        const who = root.createElement('span');
        who.className = 'patient-interview-who';
        who.textContent = role === 'trainee' ? 'You' : (grounding.participants?.find((entry) => entry.id === grounding.defaultSpeakerId)?.label ?? grounding.patientName);
        const said = root.createElement('p');
        said.textContent = text;
        line.append(who, said);
        transcript.append(line);
      }
    }
  }

  async function applyInstructorAdvance(message) {
    const saved = readStudentSession(storage);
    if (saved) {
      state.reviewed = saved.reviewed ?? {};
      state.questions = saved.questions ?? 0;
      state.autoInterview = Boolean(saved.autoInterview);
    }
    if (message.patientId !== state.patientId || !patient) {
      state.patientId = null;
      await selectPatient(message.patientId, { announce: false, keepProgress: true });
    } else {
      const status = carePlan.load({ patient, answerKey, chartDigest: buildChartDigest(patient, { maxChars: 9000 }) });
      state.planSubmitted = Boolean(status.submitted);
      for (const box of root.querySelectorAll('[data-review]')) box.checked = Boolean(state.reviewed[box.dataset.review]);
    }
    if (state.autoInterview) fillScriptedInterview();
    state.questions = Math.max(state.questions, saved?.questions ?? 0);
    const label = root.querySelector(`[data-step-tab="${message.step}"]`)?.textContent?.replace(/^\d/, '').trim() ?? message.step;
    $('student-patient-sub').textContent = `${patient?.case?.procedure ?? ''} · Your instructor moved you to ${label}.`;
    renderGrade();
    state.step = message.step;
    save();
    render();
    globalThis.scrollTo?.({ top: 0, behavior: 'smooth' });
  }

  function renderSchedule() {
    const host = $('student-schedule');
    if (!index) return;
    const filter = $('student-filter').value.trim().toLowerCase();
    const rows = index.patients.filter((entry) => !filter || `${entry.label} ${entry.name} ${entry.procedure} ${entry.room} ${entry.time}`.toLowerCase().includes(filter));
    if (!rows.length) { host.innerHTML = '<p class="student-empty">No patients match.</p>'; return; }
    host.innerHTML = rows.map((entry) => {
      const record = loadStoredPlan(storage, entry.id);
      const planLabel = record?.grade ? `Plan ${record.grade.percent}%` : (record?.values ? 'Plan started' : '');
      const selected = entry.id === state.patientId;
      return `<button type="button" role="listitem" class="student-patient${selected ? ' is-selected' : ''}" data-patient="${esc(entry.id)}" aria-pressed="${selected}">
        <span class="student-patient-time">${esc(entry.time)} · ${esc(entry.room)}</span>
        <strong>${esc(entry.label)}</strong>
        <span class="student-patient-meta">${esc(entry.age)} ${esc(entry.sex)} · ${esc(entry.service)}</span>
        <span class="student-patient-proc">${esc(entry.procedure)}</span>
        <span class="student-patient-tags">${entry.cnRubric ? `<em class="student-tag-cn">${entry.cnRubric.kind === 'teaching' ? 'CN teaching case' : 'CN rubric · scored'}</em>` : ''}${entry.engineSupported ? '' : '<em>chart only</em>'}${planLabel ? `<em class="student-tag-plan">${esc(planLabel)}</em>` : ''}</span>
      </button>`;
    }).join('');
  }

  async function getJson(path) {
    const res = await fetchImpl(path);
    if (!res.ok) throw new Error(`${path} returned ${res.status}`);
    return res.json();
  }

  async function selectPatient(id, { announce = true, keepProgress = false } = {}) {
    const entry = index?.patients.find((row) => row.id === id);
    if (!entry) return;
    if (id !== state.patientId && !keepProgress) {
      state.reviewed = {};
      state.questions = 0;
      state.autoInterview = false;
    }
    state.patientId = id;
    [patient, answerKey] = await Promise.all([
      getJson(`${MOCK_OR_BASE}/patients/${id}.json`),
      getJson(`${MOCK_OR_BASE}/answer-keys/${id}.json`).catch(() => null),
    ]);
    $('student-patient-title').textContent = `${patient.label} · ${patient.age} ${patient.sex}`;
    $('student-patient-sub').textContent = `${patient.case?.procedure ?? ''} · ${patient.room} at ${patient.time}${entry.engineSupported ? '' : ' · chart only (outside the engine range)'}`;
    const url = `${MOCK_OR_EHR}?patient=${encodeURIComponent(id)}#${id}`;
    $('student-chart-frame').src = url;
    $('student-chart-newtab').href = url;
    interview.setGrounding(buildChartInterviewGrounding(patient));
    interview.restore(readInterview(storage, id));
    const status = carePlan.load({ patient, answerKey, chartDigest: buildChartDigest(patient, { maxChars: 9000 }) });
    state.planSubmitted = Boolean(status.submitted);
    for (const box of root.querySelectorAll('[data-review]')) box.checked = Boolean(state.reviewed[box.dataset.review]);
    if (announce) channel?.post({ type: 'student-load', patientId: id });
    save();
    renderSchedule();
    renderGrade();
    render();
  }

  function renderGrade() {
    const host = $('student-grade-host');
    const record = state.patientId ? loadStoredPlan(storage, state.patientId) : null;
    host.innerHTML = record?.grade
      ? renderGradeMarkup(record.grade, { verdict: record.verdict ?? '', answerKey, aiPending: record.verdictSource !== 'ai' && state.planSubmitted })
      : '<p class="student-empty">Submit the care plan first.</p>';
  }

  function renderOr() {
    const out = $('student-or-status');
    const entry = index?.patients.find((row) => row.id === state.patientId);
    if (entry && !entry.engineSupported) {
      out.dataset.state = 'warn';
      out.textContent = `${patient?.label ?? 'This patient'} is chart and care plan only (${entry.engineNote ?? 'outside the physiology engine range'}). There is no live case to run. Debrief the plan with your instructor, or pick an adult patient for the OR.`;
      return;
    }
    if (!consoleState || !dock.consoleConnected()) {
      out.dataset.state = 'waiting';
      out.textContent = 'No instructor console yet. On the other screen, open LIVE SIM and choose INSTRUCTOR SIM; it links to this window automatically. You can still open the monitor.';
      return;
    }
    if (consoleState.patientId && consoleState.patientId !== state.patientId) {
      out.dataset.state = 'warn';
      out.textContent = `The console has a different patient loaded (${consoleState.patientId}). Tell your instructor.`;
      return;
    }
    out.dataset.state = 'ready';
    out.textContent = `Instructor console connected${consoleState.patientId ? `, ${patient?.label ?? state.patientId} loaded` : ''}. Case is ${String(consoleState.lifecycle ?? 'ready').toLowerCase()}.`;
  }

  function go(step) {
    const target = STEPS.indexOf(step);
    if (target === -1 || target > furthestStep(state)) return;
    state.step = step;
    save();
    render();
    if (step === 'plan') planModal.querySelector('[data-cp-tab="page1"]')?.click();
    root.querySelector('.student-main')?.scrollTo?.({ top: 0 });
    globalThis.scrollTo?.({ top: 0, behavior: 'smooth' });
  }

  function render() {
    const current = STEPS.indexOf(state.step);
    const furthest = furthestStep(state);
    for (const section of root.querySelectorAll('[data-step]')) section.hidden = section.dataset.step !== state.step;
    for (const button of root.querySelectorAll('[data-step-tab]')) {
      const i = STEPS.indexOf(button.dataset.stepTab);
      button.disabled = i > furthest;
      button.setAttribute('aria-current', i === current ? 'step' : 'false');
      button.dataset.done = String(i < furthest || (i === furthest && stepGate(STEPS[i], state).allowed && i < STEPS.length - 1));
    }
    const gate = stepGate(state.step, state);
    $('student-back').disabled = current === 0;
    const next = $('student-next');
    next.hidden = state.step === 'or';
    next.textContent = state.step === 'plan' && !state.planSubmitted ? 'SUBMIT PLAN' : (state.step === 'grade' ? 'INTO THE OR' : 'NEXT');
    next.disabled = state.step === 'plan' ? false : !gate.allowed;
    $('student-gate').textContent = gate.allowed || state.step === 'or' ? '' : gate.reason;
    $('student-interview-count').textContent = state.questions >= MIN_QUESTIONS
      ? `${Math.min(state.questions, 99)} questions asked. You can move on whenever you are ready.`
      : `${state.questions} of ${MIN_QUESTIONS} questions asked.`;
    if (state.step === 'or') renderOr();
    report();
  }

  // Events
  $('student-schedule').addEventListener('click', (event) => {
    const card = event.target.closest('[data-patient]');
    if (card) selectPatient(card.dataset.patient);
  });
  $('student-filter').addEventListener('input', renderSchedule);
  for (const box of root.querySelectorAll('[data-review]')) {
    box.addEventListener('change', () => { state.reviewed[box.dataset.review] = box.checked; save(); render(); });
  }
  $('student-stepper').addEventListener('click', (event) => {
    const tab = event.target.closest('[data-step-tab]');
    if (tab && !tab.disabled) go(tab.dataset.stepTab);
  });
  $('student-back').addEventListener('click', () => go(STEPS[Math.max(0, STEPS.indexOf(state.step) - 1)]));
  $('student-next').addEventListener('click', async () => {
    if (state.step === 'plan' && !state.planSubmitted) {
      await carePlan.submit();
      if (carePlan.status().submitted) go('grade');
      else planModal.querySelector('[data-cp-tab="page1"]')?.click();
      return;
    }
    const gate = stepGate(state.step, state);
    if (gate.allowed) go(STEPS[STEPS.indexOf(state.step) + 1]);
  });
  $('student-start-over').addEventListener('click', () => {
    if (state.patientId) writeInterview(storage, state.patientId, []);
    interview.setGrounding(null);
    state.patientId = null; state.step = 'patient'; state.reviewed = {}; state.questions = 0; state.planSubmitted = false;
    patient = null; answerKey = null;
    $('student-patient-title').textContent = 'Choose your patient';
    $('student-patient-sub').textContent = 'Work through each step in order. Booth is listening.';
    save();
    renderSchedule();
    render();
  });
  $('student-toggle-booth').addEventListener('click', (event) => {
    const side = $('student-side');
    side.hidden = !side.hidden;
    event.currentTarget.setAttribute('aria-expanded', String(!side.hidden));
  });
  channel?.subscribe((message) => {
    if (message.type === 'instructor-advance') {
      applyInstructorAdvance(message);
      return;
    }
    if (message.type === 'console-state') {
      const first = !consoleState;
      consoleState = message;
      // The console opened after the student picked a patient: catch it up.
      if (first && state.patientId && message.patientId !== state.patientId) channel.post({ type: 'student-load', patientId: state.patientId });
      if (first && state.planSubmitted && state.patientId) channel.post({ type: 'student-plan', patientId: state.patientId });
      // Answer every heartbeat so the console knows this screen is still here.
      lastReported = '';
      report();
      if (state.step === 'or') renderOr();
    }
  });

  (async () => {
    try {
      index = await getJson(`${MOCK_OR_BASE}/index.json`);
      renderSchedule();
      if (state.patientId) await selectPatient(state.patientId, { announce: true, keepProgress: true });
      if (state.autoInterview) fillScriptedInterview();
    } catch (error) {
      $('student-schedule').innerHTML = `<p class="student-empty">Schedule unavailable: ${esc(error.message)}</p>`;
    }
    // Resume where the student left off, but never past what is unlocked.
    const target = Math.min(STEPS.indexOf(state.step), furthestStep(state));
    state.step = STEPS[Math.max(0, target)];
    render();
  })();

  return { state, go, selectPatient, carePlan, dock };
}

if (typeof document !== 'undefined' && document.getElementById('student-stepper')) {
  startStudentWorkflow();
}
