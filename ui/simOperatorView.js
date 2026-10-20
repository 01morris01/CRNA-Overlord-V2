/* DOM wiring for Booth, the sim operator (logic lives in simOperator.js).

   The instructor's Booth desk has four parts:
   - NOW: the latest thing the instructor needs to know, in plain words.
   - EVENT PLAN: the Mock OR case's complications, which ones are armed
     because the student missed something, and a TRIGGER for each. The run
     mode decides who pulls the trigger: Booth, or the instructor.
   - CONVERSATIONS: what the student hears and says (Booth's voice, the
     student's messages, Booth's replies), and the instructor's own private
     chat with Booth, answered as faculty.
   - WHY LOG: every complication started, treated, resolved, or failed, every
     vital sign drift with the engine reason behind it, and Booth's private
     notes about the student's messages.

   Voice: only Booth's room lines are spoken (POST /api/tts with voice
   "operator", falling back to speech synthesis). Instructor answers and the
   why log are text only, because the speakers are in the same room as the
   student. */

import {
  buildLocalAnswer,
  buildLocalRoast,
  CHAOS_PROFILES,
  CHATTER_LEVELS,
  createSimOperator,
  MEANNESS_LEVELS,
  OPERATOR_NAME,
} from './simOperator.js';
import {
  analyzeStudentAction,
  buildOperatorNote,
  buildStudentReply,
  classifyStudentStatement,
  parseStudentModelReply,
  replyGivesAwayIssue,
  STUDENT_SUGGESTIONS,
  studentFacts,
} from './boothStudent.js';
import { describeOrders, parseStudentOrders } from './boothOrders.js';
import {
  buildFacultyAnswer,
  formatClock,
  RUN_MODES,
  GRADUAL_TYPES,
  summarizeEventPlan,
} from './simScript.js';

const SETTINGS_KEY = 'overlord.booth.settings.v2';

/* Did the model's reply already say what Booth did? */
function mentionsExecuted(reply, executed) {
  const text = String(reply ?? '').toLowerCase();
  return executed.every((entry) => {
    const head = String(entry.label ?? '').toLowerCase().split(/[ ,]/)[0];
    return head.length < 3 || text.includes(head);
  });
}
const FEED_LIMIT = 60;
const NOTE_LIMIT = 60;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const formatTime = formatClock;

export function renderOperatorStrip() {
  return `
    <div id="live-operator-strip" class="live-operator-strip" role="status" aria-live="polite" hidden>
      <span class="live-operator-tag">${escapeHtml(OPERATOR_NAME.toUpperCase())} SAID</span>
      <p id="live-operator-latest"></p>
    </div>`;
}

export function renderOperatorPanel() {
  const meanness = MEANNESS_LEVELS
    .map((level) => `<option value="${level.id}">${escapeHtml(level.label)}</option>`).join('');
  const chaos = Object.values(CHAOS_PROFILES)
    .map((profile) => `<option value="${profile.id}">${escapeHtml(profile.label)}</option>`).join('');
  const chatter = CHATTER_LEVELS
    .map((level) => `<option value="${level.id}">${escapeHtml(level.label)}</option>`).join('');
  const modes = RUN_MODES
    .map((mode) => `<button type="button" data-run-mode="${mode.id}" aria-pressed="false" title="${escapeHtml(mode.help)}">${escapeHtml(mode.label)}</button>`).join('');
  return `
    <section id="live-operator-panel" class="live-panel live-operator-panel" aria-labelledby="live-operator-heading">
      <div class="live-operator-header">
        <div>
          <p class="live-eyebrow">SIM OPERATOR · ONLY YOU SEE THIS PANEL</p>
          <h2 id="live-operator-heading">${escapeHtml(OPERATOR_NAME)}</h2>
        </div>
        <label class="live-toggle" for="live-operator-enabled"><input id="live-operator-enabled" type="checkbox" checked><span>On</span></label>
      </div>

      <article id="live-booth-now" class="live-booth-now" data-severity="info" aria-live="polite">
        <p class="live-booth-now-tag">NOW</p>
        <h3 id="live-booth-now-title">Nothing happening yet.</h3>
        <div id="live-booth-now-body"><p>When anything changes on the patient, ${escapeHtml(OPERATOR_NAME)} tells you here what it is and why.</p></div>
      </article>

      <section class="live-booth-block" aria-labelledby="live-event-plan-heading">
        <div class="live-booth-block-head">
          <h3 id="live-event-plan-heading">Event plan</h3>
          <div class="live-run-mode" role="group" aria-label="Who starts events">${modes}</div>
        </div>
        <p id="live-run-mode-help" class="live-help"></p>
        <output id="live-event-plan-summary" class="live-event-plan-summary">No case loaded. Free play.</output>
        <ol id="live-event-plan" class="live-event-plan"></ol>
        <output id="live-operator-phase" class="live-help" aria-live="polite">Waiting for the case to start.</output>
      </section>

      <div class="live-booth-chats">
        <section class="live-booth-block" aria-labelledby="live-room-heading">
          <h3 id="live-room-heading">Student and ${escapeHtml(OPERATOR_NAME)}</h3>
          <p class="live-help">What the student says and hears. ${escapeHtml(OPERATOR_NAME)}'s lines here are spoken out loud.</p>
          <div class="live-run-mode live-student-orders" role="group" aria-label="Who carries out what the student orders">
            <span>Student orders</span>
            <button type="button" data-student-orders="booth" aria-pressed="true" title="Drugs, fluids, preox, airway, gas and vent orders the student says are done at once. You can UNDO a drug for 2 minutes.">${escapeHtml(OPERATOR_NAME.toUpperCase())} DOES THEM</button>
            <button type="button" data-student-orders="instructor" aria-pressed="false" title="Each order shows up in the why log with a button; nothing happens until you press it.">I DO THEM</button>
          </div>
          <ol id="live-operator-feed" class="live-operator-feed"><li class="live-empty">Nothing said yet.</li></ol>
        </section>
        <section class="live-booth-block" aria-labelledby="live-instructor-chat-heading">
          <h3 id="live-instructor-chat-heading">You and ${escapeHtml(OPERATOR_NAME)}</h3>
          <p class="live-help">Private. He answers you as faculty, with nothing held back. Never spoken.</p>
          <ol id="live-instructor-chat" class="live-operator-feed live-instructor-chat"><li class="live-empty">Ask why something is happening, what to trigger next, or how to debrief.</li></ol>
          <form id="live-operator-ask-form" class="live-operator-ask" novalidate>
            <label class="live-field" for="live-operator-ask"><span>Ask ${escapeHtml(OPERATOR_NAME)}</span>
              <input id="live-operator-ask" type="text" maxlength="400" placeholder="Why is the EtCO2 going up?" autocomplete="off">
            </label>
            <button id="live-operator-ask-send" type="submit">ASK</button>
          </form>
        </section>
      </div>

      <section class="live-booth-block live-operator-notes-panel" aria-labelledby="live-operator-notes-heading">
        <h3 id="live-operator-notes-heading">Why log</h3>
        <p class="live-help">Every event, every vital sign drift with its engine cause, and ${escapeHtml(OPERATOR_NAME)}'s notes on what the student said. Newest on top.</p>
        <ol id="live-operator-notes" class="live-operator-notes"><li class="live-empty">Nothing yet.</li></ol>
      </section>

      <details class="live-booth-settings">
        <summary>${escapeHtml(OPERATOR_NAME)} settings</summary>
        <div class="live-operator-settings">
          <label class="live-field" for="live-operator-meanness"><span>Attitude</span><select id="live-operator-meanness">${meanness}</select></label>
          <label class="live-field" for="live-operator-chaos"><span>Pace when ${escapeHtml(OPERATOR_NAME)} runs it</span><select id="live-operator-chaos">${chaos}</select></label>
          <label class="live-field" for="live-operator-chatter"><span>Chatter</span><select id="live-operator-chatter">${chatter}</select></label>
        </div>
        <label class="live-toggle" for="live-operator-voice"><input id="live-operator-voice" type="checkbox" checked><span>Voice in the room</span></label>
        <div class="live-button-row">
          <button id="live-operator-tryme" type="button">START ONE SOON</button>
          <button id="live-operator-roast" type="button">ROAST THE CASE</button>
        </div>
        <p class="live-help">Pace sets how many events ${escapeHtml(OPERATOR_NAME)} may start and how long he waits between them. With a rubric or teaching case loaded he only talks.</p>
      </details>
    </section>`;
}

function readSettings(storage) {
  try {
    const raw = storage?.getItem?.(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      enabled: parsed.enabled !== false,
      meanness: [1, 2, 3].includes(parsed.meanness) ? parsed.meanness : 2,
      chaos: Object.hasOwn(CHAOS_PROFILES, parsed.chaos) ? parsed.chaos : 1,
      chatter: CHATTER_LEVELS.some((level) => level.id === parsed.chatter) ? parsed.chatter : 1,
      voice: parsed.voice !== false,
      runMode: RUN_MODES.some((mode) => mode.id === parsed.runMode) ? parsed.runMode : 'booth',
      studentOrders: parsed.studentOrders === 'instructor' ? 'instructor' : 'booth',
    };
  } catch {
    return { enabled: true, meanness: 2, chaos: 1, chatter: 1, voice: true, runMode: 'booth', studentOrders: 'booth' };
  }
}

function writeSettings(storage, settings) {
  try { storage?.setItem?.(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* storage blocked */ }
}

const PHASE_LABELS = Object.freeze({
  BUILD_UP: 'Waiting for a calm stretch before the next event.',
  PEAK: 'An event or a rough patch is in progress.',
  PEAK_FADE: 'Waiting for the patient to stabilize.',
  RELAX: 'Giving the student a breather.',
  DONE: 'Out of events at this pace.',
});

const STATE_LABELS = Object.freeze({
  armed: 'ARMED', caught: 'CAUGHT', background: 'BACKGROUND',
});

const FLAG_STATUS_LABELS = Object.freeze({ found: 'caught', partial: 'partly caught', missed: 'missed' });

export function renderEventPlanMarkup(events = [], { runMode = 'booth', live = false } = {}) {
  if (events.length === 0) return '';
  return events.map((event) => {
    const running = event.readiness?.text === 'Running now.';
    const status = running ? 'running' : (event.fired ? 'fired' : event.state);
    const chip = running ? 'RUNNING' : (event.fired ? 'DONE' : STATE_LABELS[event.state]);
    const flags = event.flags.length > 0
      ? `<p class="live-event-flags">${event.flags.map((flag) => `<span data-status="${escapeHtml(flag.status ?? 'none')}">${escapeHtml(flag.finding)}${flag.status ? ` · ${escapeHtml(FLAG_STATUS_LABELS[flag.status] ?? flag.status)}` : ''}</span>`).join('')}</p>`
      : '';
    let when;
    if (event.fired || running) when = '';
    else if (!event.rescuable) when = 'Manual only. The console has no rescue for this one.';
    else if (event.autoAllowed && runMode === 'booth') when = `Booth will start it. ${event.readiness?.text ?? ''}`;
    else when = event.readiness?.text ?? '';
    const triggerLabel = event.fired ? 'RUN AGAIN' : 'TRIGGER';
    return `
      <li class="live-event-row" data-state="${escapeHtml(status)}" data-ready="${event.readiness?.ready && event.readiness?.calm ? 'true' : 'false'}">
        <div class="live-event-row-head">
          <strong>${escapeHtml(event.label)}</strong>
          <span class="live-event-chip">${escapeHtml(chip)}</span>
        </div>
        <p class="live-event-reason">${escapeHtml(event.reason)}${event.why ? ` <em>Chart: ${escapeHtml(event.why)}.</em>` : ''}</p>
        ${flags}
        ${when ? `<p class="live-event-when">${escapeHtml(when)}</p>` : ''}
        <div class="live-event-buttons">
          <button type="button" data-trigger-event="${escapeHtml(event.type)}" data-onset="realistic" ${!live || running ? 'disabled' : ''} title="${GRADUAL_TYPES.includes(event.type) ? 'Builds over minutes, like the real thing' : 'Start it now'}">${triggerLabel}</button>
          ${GRADUAL_TYPES.includes(event.type) ? `<button type="button" class="live-event-instant" data-trigger-event="${escapeHtml(event.type)}" data-onset="instant" ${!live || running ? 'disabled' : ''} title="Full severity now, to show the concept">INSTANT</button>` : ''}
        </div>
      </li>`;
  }).join('');
}

export function createSimOperatorController({
  runner,
  root = (typeof document !== 'undefined' ? document : null),
  fetchImpl = (typeof fetch !== 'undefined' ? fetch : null),
  speechHost = (typeof window !== 'undefined' ? window : null),
  storage = (typeof localStorage !== 'undefined' ? localStorage : null),
  now = () => Date.now(),
  getAnswerKey = () => null,
  getPlanGrade = () => null,
  getStage = () => ({}),
  random = Math.random,
} = {}) {
  const query = (id) => root?.getElementById?.(id) ?? null;
  const settings = readSettings(storage);
  const askHistory = [];
  const facultyHistory = [];
  const roomLog = [];
  let currentAudio = null;
  let speaking = false;
  let lastPhaseText = '';
  let lastPlanRenderMs = 0;
  let lastPlanMarkup = '';

  function simTime() {
    return runner?.simTime ?? null;
  }

  // Conversations read top to bottom like a chat, newest at the bottom.
  function appendLine(listId, role, text, tSec = null) {
    const feed = query(listId);
    if (!feed || !root?.createElement) return;
    feed.querySelector?.('.live-empty')?.remove();
    const pinnedToBottom = feed.scrollHeight - feed.scrollTop - feed.clientHeight < 40;
    const item = root.createElement('li');
    item.className = `live-operator-line live-operator-${role}`;
    const time = root.createElement('time');
    time.textContent = tSec === null ? '' : formatTime(tSec);
    const said = root.createElement('p');
    said.textContent = text;
    item.append(time, said);
    feed.append(item);
    while (feed.children.length > FEED_LIMIT) feed.firstElementChild?.remove();
    if (pinnedToBottom || role === 'you') feed.scrollTop = feed.scrollHeight;
  }

  // What the student hears or says.
  function appendRoom(role, text, tSec = null) {
    roomLog.push({ role, text, tSec });
    if (roomLog.length > 80) roomLog.shift();
    appendLine('live-operator-feed', role, role === 'student' ? `Student: ${text}` : `${OPERATOR_NAME}: ${text}`, tSec);
  }

  function appendInstructorChat(role, text, tSec = null) {
    appendLine('live-instructor-chat', role, role === 'you' ? `You: ${text}` : `${OPERATOR_NAME}: ${text}`, tSec);
  }

  function showLatest(text) {
    const strip = query('live-operator-strip');
    const latest = query('live-operator-latest');
    if (latest) latest.textContent = text;
    if (strip) strip.hidden = false;
  }

  // NOW keeps the running event pinned (what it is, why, what to watch,
  // what the student should do) and shows the latest change under it.
  let pinnedEvent = null;
  let latestChange = null;

  function showNow(entry) {
    if (entry.kind === 'event') {
      pinnedEvent = entry;
      latestChange = null;
    } else if (pinnedEvent && ['resolved', 'failure'].includes(entry.kind) && (!entry.type || entry.type === pinnedEvent.type)) {
      pinnedEvent = null;
      latestChange = entry;
    } else {
      latestChange = entry;
    }
    const card = query('live-booth-now');
    const title = query('live-booth-now-title');
    const body = query('live-booth-now-body');
    if (!card || !title || !body || !root?.createElement) return;
    const main = pinnedEvent ?? latestChange ?? entry;
    card.dataset.severity = main.severity ?? 'info';
    title.textContent = main.title;
    const lineEl = ([label, text]) => {
      const p = root.createElement('p');
      const strong = root.createElement('strong');
      strong.textContent = `${label}: `;
      p.append(strong, text);
      return p;
    };
    const children = (main.lines ?? []).map(lineEl);
    if (pinnedEvent && latestChange) {
      const latest = root.createElement('div');
      latest.className = 'live-booth-now-latest';
      latest.dataset.severity = latestChange.severity ?? 'info';
      const head = root.createElement('p');
      head.className = 'live-booth-now-latest-title';
      head.textContent = `Latest, ${formatTime(latestChange.tSec)}: ${latestChange.title}`;
      latest.append(head, ...(latestChange.lines ?? []).map(lineEl));
      children.push(latest);
    }
    body.replaceChildren(...children);
  }

  function noteItem({ className, head, lines }) {
    const item = root.createElement('li');
    item.className = className;
    const headEl = root.createElement('p');
    headEl.className = 'live-operator-note-head';
    headEl.textContent = head;
    item.append(headEl);
    for (const [label, text] of lines) {
      const p = root.createElement('p');
      if (label) {
        const strong = root.createElement('strong');
        strong.textContent = `${label}: `;
        p.append(strong);
      }
      p.append(text);
      item.append(p);
    }
    return item;
  }

  function prependNote(item) {
    const list = query('live-operator-notes');
    if (!list) return;
    list.querySelector?.('.live-empty')?.remove();
    list.prepend(item);
    while (list.children.length > NOTE_LIMIT) list.lastElementChild?.remove();
  }

  // Instructor only explanation from the operator. Text, never voice.
  function onInstructorNote(entry) {
    showNow(entry);
    renderEventPlan(true);
    if (!root?.createElement) return;
    prependNote(noteItem({
      className: `live-operator-note live-operator-note-${entry.severity ?? 'info'} live-note-${entry.kind ?? 'info'}`,
      head: `${formatTime(entry.tSec)} · ${entry.title}`,
      lines: entry.lines ?? [],
    }));
  }

  function speakWithSynthesis(text) {
    const synth = speechHost?.speechSynthesis;
    const Utterance = speechHost?.SpeechSynthesisUtterance;
    if (!synth || !Utterance) return Promise.resolve();
    return new Promise((resolve) => {
      stopCurrent = resolve;
      const utterance = new Utterance(text);
      utterance.pitch = 0.8;
      utterance.rate = 1.05;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      synth.speak(utterance);
      // Some browsers never fire onend; don't let the queue stall.
      setTimeout(resolve, Math.min(20000, 1500 + text.length * 80));
    });
  }

  // One line plays at a time. While Booth is talking, the newest waiting
  // line replaces any older waiting line, so he never falls behind the case;
  // urgent lines (priority 2+) jump ahead of chatter.
  let pending = null;
  let stopCurrent = null;

  async function playOne(text) {
    if (fetchImpl) {
      try {
        const res = await fetchImpl('/api/tts', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text, voice: 'operator' }),
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          currentAudio = new (speechHost?.Audio ?? Audio)(url);
          await new Promise((resolve) => {
            stopCurrent = resolve;
            currentAudio.addEventListener('ended', resolve, { once: true });
            currentAudio.addEventListener('error', resolve, { once: true });
            currentAudio.play().catch(resolve);
          });
          URL.revokeObjectURL(url);
          return;
        }
      } catch { /* fall through to synthesis */ }
    }
    await speakWithSynthesis(text);
  }

  async function voice(text, priority = 1) {
    if (!settings.voice) return;
    if (speaking) {
      if (!pending || priority >= pending.priority) pending = { text, priority };
      return;
    }
    speaking = true;
    try {
      let next = { text, priority };
      while (next && settings.voice) {
        pending = null;
        await playOne(next.text);
        next = pending;
      }
    } finally {
      speaking = false;
      pending = null;
    }
  }

  function onLine(line) {
    appendRoom('booth', line.text, line.tSec);
    showLatest(line.text);
    voice(line.text, line.priority);
  }

  const operator = createSimOperator({
    runner,
    say: onLine,
    notify: (entry) => onInstructorNote(entry),
    now,
    meanness: settings.meanness,
    chaos: settings.chaos,
    chatter: settings.chatter,
    enabled: settings.enabled,
    runMode: settings.runMode,
  });

  function isLive() {
    try { return runner?.snapshot?.().lifecycle === 'RUNNING'; } catch { return false; }
  }

  function renderRunMode() {
    for (const button of root?.querySelectorAll?.('[data-run-mode]') ?? []) {
      button.setAttribute('aria-pressed', String(button.dataset.runMode === settings.runMode));
    }
    const help = query('live-run-mode-help');
    if (help) help.textContent = RUN_MODES.find((mode) => mode.id === settings.runMode)?.help ?? '';
  }

  function renderEventPlan(force = false) {
    const list = query('live-event-plan');
    if (!list) return;
    if (!force && now() - lastPlanRenderMs < 1000) return;
    lastPlanRenderMs = now();
    const events = operator.getEventPlan();
    const markup = renderEventPlanMarkup(events, { runMode: settings.runMode, live: isLive() });
    if (markup !== lastPlanMarkup) {
      list.innerHTML = markup;
      lastPlanMarkup = markup;
    }
    const summary = query('live-event-plan-summary');
    if (summary) summary.textContent = summarizeEventPlan(events);
  }

  function renderPhase() {
    const out = query('live-operator-phase');
    if (!out) return;
    const s = operator.getSettings();
    let text;
    if (!s.enabled) text = `${OPERATOR_NAME} is off. No commentary and no events from him.`;
    else if (!s.directorAllowed) text = 'Rubric or teaching case loaded. Commentary only.';
    else if (s.runMode === 'instructor') text = 'You run it. Nothing starts unless you press TRIGGER.';
    else if (s.chaos === 0) text = 'Pace is set to commentary only, so Booth will not start events.';
    else {
      const d = operator.getDirectorState();
      const cap = (CHAOS_PROFILES[s.chaos]?.maxInjections ?? 0) + (d.extra ?? 0);
      text = `${PHASE_LABELS[d.phase] ?? d.phase} ${d.injected.length} of ${cap} events used at this pace.`;
    }
    if (text !== lastPhaseText) {
      out.textContent = text;
      lastPhaseText = text;
    }
  }

  function persist() {
    writeSettings(storage, settings);
  }

  async function postOperator(payload) {
    if (!fetchImpl) return null;
    try {
      const res = await fetchImpl('/api/sim-operator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return typeof data?.reply === 'string' && data.reply.trim() ? data.reply.trim() : null;
    } catch {
      return null;
    }
  }

  function planGradeSummary() {
    const grade = getPlanGrade();
    if (!grade) return null;
    return {
      percent: grade.percent ?? null,
      redFlags: (grade.redFlags ?? []).map(({ id, status, severity, finding }) => ({ id, status, severity, finding })),
    };
  }

  /* The instructor asks Booth from the console: faculty mode, full answers,
     nothing withheld, never spoken. */
  async function ask(rawQuestion) {
    const question = String(rawQuestion ?? '').trim().slice(0, 400);
    if (!question) return null;
    appendInstructorChat('you', question, simTime());
    const answerKey = getAnswerKey();
    const context = {
      ...operator.facultyContext(),
      studentConversation: roomLog.slice(-16).map(({ role, text, tSec }) => ({ who: role === 'student' ? 'student' : 'Booth', text, tSec })),
      carePlanGrade: planGradeSummary(),
      mockOrAnswerKey: answerKey ? {
        summary: answerKey.summary,
        decision: answerKey.decision ?? null,
        redFlags: (answerKey.redFlags ?? []).map(({ id, severity, finding, implication, action }) => ({ id, severity, finding, implication, action })),
      } : null,
    };
    const reply = await postOperator({
      mode: 'faculty', question, meanness: settings.meanness, context, history: facultyHistory.slice(-6),
    }) ?? buildFacultyAnswer(context, question);
    facultyHistory.push({ role: 'trainee', content: question }, { role: 'operator', content: reply });
    appendInstructorChat('booth', reply, simTime());
    return reply;
  }

  /* What the student orders, done on the engine. */
  function executeOrder(order) {
    if (!runner) return { ok: false, reason: 'no simulation' };
    const done = (label = order.label, extra = {}) => ({ ok: true, label, ...extra });
    try {
      switch (order.kind) {
        case 'drug': {
          const result = runner.giveBolus(order.drug, order.totalMg, `${order.label} · ${order.totalMg} mg total (student order)`);
          return done(order.label, { doseId: result?.doseId ?? null });
        }
        case 'preoxygenate': runner.preoxygenate(); return done();
        case 'mask_ppv': {
          const s = runner.snapshot();
          const result = runner.deliverMaskVentilation({ durationSeconds: 30, tidalVolumeMl: s.ventSetTV || 500, respiratoryRate: s.ventSetRR || 12, cricoidPressure: s.cricoidPressureActive === true });
          return result?.ok === false ? { ok: false, label: order.label, reason: result.reason } : done();
        }
        case 'intubate': {
          const s = runner.snapshot();
          // Already in, or the attempt is underway: nothing new to start.
          if (s.airwayDevice === 'intubated' || s.intubationInProgress) return { ok: true, skipped: true, label: order.label };
          const result = runner.intubate();
          return result?.ok === false ? { ok: false, label: order.label, reason: result.reason } : done(`Intubation attempt ${result?.attemptNumber ?? ''} started`.replace(/ +started/, ' started'));
        }
        case 'extubate': {
          const result = runner.extubate();
          return result?.ok === false ? { ok: false, label: order.label, reason: result.reason } : done();
        }
        case 'cricoid_on': runner.applyCricoidPressure(); return done();
        case 'cricoid_off': runner.releaseCricoidPressure(); return done();
        case 'tof': {
          const record = runner.checkTrainOfFour();
          return done(`Train of four ${record.count} of 4${record.count === 4 ? `, ratio ${record.ratio.toFixed(2)}` : ''}`);
        }
        case 'vent_on': runner.setVentMode(1); runner.logEvent?.('Ventilator', 'Volume control on (student order)'); return done();
        case 'volatile': {
          const result = runner.setVolatile({ agent: order.agent, dialPercent: order.dial });
          return result?.ok === false ? { ok: false, label: order.label, reason: result.reason } : done();
        }
        case 'fluid_bolus': {
          const result = runner.giveFluid({ type: order.type, volumeMl: order.volumeMl, overMin: order.overMin });
          return result?.ok === false ? { ok: false, label: order.label, reason: result.reason } : done(result.detail ?? order.label);
        }
        case 'fluid_rate': {
          const result = runner.setFluidRate({ type: order.type, mlPerHr: order.mlPerHr });
          return result?.ok === false ? { ok: false, label: order.label, reason: result.reason } : done();
        }
        case 'fluid_stop': runner.stopFluid(); return done();
        case 'start': {
          const state = runner.getLifecycleState?.();
          if (state === 'READY' || state === 'PAUSED') runner.start();
          return done('Case clock running');
        }
        default: return { ok: false, label: order.label, reason: 'not something the console can do' };
      }
    } catch (error) {
      return { ok: false, label: order.label, reason: error.message };
    } finally {
      runner.emit?.();
    }
  }

  let pendingDose = null; // { drug, atMs }: Booth asked "how much?"

  function askDoseLine(drug) {
    const lines = settings.meanness >= 3
      ? [`${drug}. How much? I don't do guesswork.`, `Dose of ${drug}? Numbers, please.`]
      : settings.meanness === 2
        ? [`${drug}. How much?`, `Sure, ${drug}. What dose?`]
        : [`How much ${drug}?`, `${drug}, what dose?`];
    return lines[Math.floor(random() * lines.length)];
  }

  /* Where the case is, in words Booth cannot misread. */
  function whereWeAre(executedSomething) {
    const lifecycle = runner?.getLifecycleState?.() ?? 'READY';
    const stage = getStage?.() ?? {};
    const inOr = stage.studentStep === 'or' || lifecycle !== 'READY' || executedSomething;
    if (!inOr) return { inOr, text: `Preop${stage.studentStepLabel ? ` (${stage.studentStepLabel})` : ''}. The student is not in the operating room yet.` };
    const clock = lifecycle === 'READY'
      ? 'The sim clock has not started; it starts with the first drug or order you carry out.'
      : `The sim clock is ${lifecycle === 'RUNNING' ? 'running' : lifecycle.toLowerCase()}.`;
    return { inOr, text: `In the operating room with the patient, not preop. ${clock}` };
  }

  /* The student talked to Booth from their own screen. Returns the reply for
     the student (spoken there) and writes the private note into the why log. */
  async function respondToStudent(rawText) {
    const text = String(rawText ?? '').trim().slice(0, 400);
    if (!text) return null;
    // Orders first: what did they tell Booth to do, through speech errors.
    const pending = pendingDose && now() - pendingDose.atMs < 120000 ? pendingDose.drug : null;
    const parsed = parseStudentOrders(text, { weightKg: runner?.config?.weightKg ?? 70, pendingDrug: pending });
    const executed = [];
    const failed = [];
    const awaiting = [];
    if (parsed.orders.length) pendingDose = null;
    for (const order of parsed.orders) {
      if (settings.studentOrders === 'booth') {
        const result = executeOrder(order);
        if (result.skipped) continue;
        (result.ok ? executed : failed).push(result);
      } else {
        awaiting.push(order);
      }
    }
    if (parsed.needsDose && !parsed.orders.some((order) => order.kind === 'drug')) {
      pendingDose = { drug: parsed.needsDose, atMs: now() };
      const reply = askDoseLine(parsed.needsDose);
      appendRoom('student', text, simTime());
      appendRoom('booth', reply, simTime());
      askHistory.push({ role: 'trainee', content: text }, { role: 'operator', content: reply });
      showLatest(reply);
      addNote({ text, note: `Heard ${parsed.needsDose} without a dose; asked how much.${executed.length ? ` Did: ${executed.map((entry) => entry.label).join(', ')}.` : ''}`, suggestions: [], issues: [], tSec: simTime(), orders: awaiting });
      return { reply, note: '', suggestions: [], executed, parsed };
    }
    if (parsed.problems.length && !executed.length && !awaiting.length) {
      const reply = parsed.problems[0];
      appendRoom('student', text, simTime());
      appendRoom('booth', reply, simTime());
      askHistory.push({ role: 'trainee', content: text }, { role: 'operator', content: reply });
      showLatest(reply);
      addNote({ text, note: `Did not act: ${parsed.problems.join(' ')}`, suggestions: [], issues: [], tSec: simTime() });
      return { reply, note: '', suggestions: [], executed, parsed };
    }
    const classification = classifyStudentStatement(text);
    const snapshot = runner?.snapshot?.() ?? {};
    const answerKey = getAnswerKey();
    const facts = studentFacts({ snapshot, history: operator.getHistory(), answerKey });
    const analysis = analyzeStudentAction(classification, facts);
    const where = whereWeAre(executed.length > 0);
    const confirm = executed.length ? `${describeOrders(executed)} ` : '';
    const failedLine = failed.length ? `Couldn't do ${failed.map((entry) => `${entry.label} (${entry.reason})`).join('; ')}. ` : '';
    let reply = `${confirm}${failedLine}${buildStudentReply(classification, analysis, { meanness: settings.meanness, random })}`.trim();
    let note = `${executed.length ? `Booth did: ${executed.map((entry) => entry.label).join(', ')}. ` : ''}${awaiting.length ? `Waiting for you: ${awaiting.map((order) => order.label).join(', ')}. ` : ''}${buildOperatorNote(text, classification, analysis)}`;
    let suggestions = analysis.suggestions;
    const context = {
      ...operator.caseContext(),
      where: where.text,
      student: {
        statement: text,
        ...classification,
        heardDrugs: parsed.drugsHeard ?? [],
        executed: executed.map((entry) => entry.label),
        couldNotDo: failed.map((entry) => `${entry.label}: ${entry.reason}`),
        waitingForInstructor: awaiting.map((order) => order.label),
        analysis: { issues: analysis.issues.map(({ id, missed, consequence, severity }) => ({ id, missed, consequence, severity })) },
      },
      allowedSuggestions: Object.fromEntries(Object.entries(STUDENT_SUGGESTIONS).map(([id, entry]) => [id, entry.label])),
      mockOrAnswerKey: answerKey ? { summary: answerKey.summary, redFlags: (answerKey.redFlags ?? []).map(({ severity, finding }) => ({ severity, finding })) } : null,
    };
    if (fetchImpl) {
      try {
        const res = await fetchImpl('/api/sim-operator', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ mode: 'student', question: text, meanness: settings.meanness, context, history: askHistory.slice(-6) }),
        });
        if (res.ok) {
          const data = await res.json();
          const parsed = parseStudentModelReply(data?.reply);
          if (parsed) {
            // Before the act, a reply that hints at the problem is replaced.
            const leaks = classification.tense !== 'done' && replyGivesAwayIssue(parsed.reply, analysis.issues);
            if (!leaks) reply = executed.length && !mentionsExecuted(parsed.reply, executed) ? `${confirm}${parsed.reply}` : parsed.reply;
            if (parsed.operatorNote) note = `${executed.length ? `Booth did: ${executed.map((entry) => entry.label).join(', ')}. ` : ''}${parsed.operatorNote}`;
            // Engine analysis always contributes its actions; the model can add fitting ones.
            suggestions = [...new Set([...analysis.suggestions, ...parsed.suggestions])];
          }
        }
      } catch { /* offline reply stands */ }
    }
    askHistory.push({ role: 'trainee', content: text }, { role: 'operator', content: reply });
    appendRoom('student', text, simTime());
    appendRoom('booth', reply, simTime());
    showLatest(reply);
    addNote({ text, note, suggestions, issues: analysis.issues, tSec: simTime(), orders: awaiting });
    return { reply, note, suggestions, classification, analysis, executed, parsed };
  }

  function applySuggestion(id) {
    const entry = STUDENT_SUGGESTIONS[id];
    if (!entry || !runner) return { ok: false, reason: 'unknown action' };
    try {
      if (entry.kind === 'fail_intubation') return runner.failIntubationAttempt();
      if (entry.kind === 'inject') return runner.injectComplication(entry.complication);
      if (entry.kind === 'stimulus') {
        runner.setSurgicalStimulus(entry.intensity);
        runner.logEvent?.('Instructor', `Surgical stimulus ${entry.intensity}`, { instructorAction: 'stimulus' });
        return { ok: true };
      }
    } catch (error) {
      return { ok: false, reason: error.message };
    }
    return { ok: false, reason: 'unsupported' };
  }

  function addNote({ text, note, suggestions, issues, tSec, orders = [] }) {
    if (!query('live-operator-notes') || !root?.createElement) return;
    const worst = issues[0]?.severity ?? 'none';
    const item = noteItem({
      className: `live-operator-note live-operator-note-${worst} live-note-student`,
      head: `${tSec === null ? '' : `${formatTime(tSec)} · `}Student said "${text}"`,
      lines: [['', note]],
    });
    const row = root.createElement('div');
    row.className = 'live-operator-note-actions';
    for (const order of orders) {
      const button = root.createElement('button');
      button.type = 'button';
      button.className = 'live-primary';
      button.textContent = `DO IT: ${order.label}`;
      button.addEventListener('click', () => {
        const result = executeOrder(order);
        button.disabled = true;
        button.textContent = result.ok ? `${result.label} · DONE` : `FAILED: ${result.reason}`;
      });
      row.append(button);
    }
    for (const id of suggestions) {
      const entry = STUDENT_SUGGESTIONS[id];
      if (!entry) continue;
      const button = root.createElement('button');
      button.type = 'button';
      button.textContent = entry.label;
      button.dataset.suggestion = id;
      button.addEventListener('click', () => {
        const result = applySuggestion(id);
        button.disabled = true;
        button.textContent = result?.ok === false ? `FAILED: ${result.reason}` : `${entry.label} · DONE`;
      });
      row.append(button);
    }
    const dismiss = root.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'live-secondary';
    dismiss.textContent = 'DISMISS';
    dismiss.addEventListener('click', () => item.remove());
    row.append(dismiss);
    item.append(row);
    prependNote(item);
  }

  async function roast() {
    const context = operator.caseContext({ revealAll: true });
    const button = query('live-operator-roast');
    if (button) button.disabled = true;
    try {
      const reply = await postOperator({ mode: 'roast', meanness: settings.meanness, context })
        ?? buildLocalRoast(context, settings.meanness);
      appendRoom('roast', reply, simTime());
      showLatest(reply);
      voice(reply, 2);
      return reply;
    } finally {
      if (button) button.disabled = false;
    }
  }

  function triggerEvent(type, { onset = 'realistic' } = {}) {
    const result = operator.triggerEvent(type, { onset });
    if (result?.ok === false) {
      onInstructorNote({
        kind: 'info', severity: 'warn', tSec: simTime() ?? 0,
        title: `Could not trigger: ${result.reason}`, lines: [],
      });
    }
    renderEventPlan(true);
    return result;
  }

  /* Mock OR case loaded or its care plan graded. null clears the plan. */
  function setCasePlan(input) {
    if (!input) {
      operator.setEventPlan(null);
      lastPlanMarkup = '';
      renderEventPlan(true);
      return [];
    }
    const plan = operator.buildAndSetEventPlan(input);
    renderEventPlan(true);
    renderPhase();
    return plan;
  }

  function setRunMode(mode) {
    if (!RUN_MODES.some((entry) => entry.id === mode)) return;
    settings.runMode = mode;
    operator.setRunMode(mode);
    persist();
    renderRunMode();
    renderEventPlan(true);
    renderPhase();
  }

  function bind() {
    const enabled = query('live-operator-enabled');
    const meanness = query('live-operator-meanness');
    const chaos = query('live-operator-chaos');
    const voiceToggle = query('live-operator-voice');
    const chatter = query('live-operator-chatter');
    if (chatter) chatter.value = String(settings.chatter);
    chatter?.addEventListener('change', () => {
      settings.chatter = Number(chatter.value);
      operator.setChatter(settings.chatter);
      persist();
    });
    if (enabled) enabled.checked = settings.enabled;
    if (meanness) meanness.value = String(settings.meanness);
    if (chaos) chaos.value = String(settings.chaos);
    if (voiceToggle) voiceToggle.checked = settings.voice;

    enabled?.addEventListener('change', () => {
      settings.enabled = enabled.checked;
      operator.setEnabled(settings.enabled);
      persist();
      renderPhase();
    });
    meanness?.addEventListener('change', () => {
      settings.meanness = Number(meanness.value);
      operator.setMeanness(settings.meanness);
      persist();
    });
    chaos?.addEventListener('change', () => {
      settings.chaos = Number(chaos.value);
      operator.setChaos(settings.chaos);
      persist();
      renderPhase();
    });
    voiceToggle?.addEventListener('change', () => {
      settings.voice = voiceToggle.checked;
      if (!settings.voice) {
        pending = null;
        currentAudio?.pause?.();
        stopCurrent?.();
        speechHost?.speechSynthesis?.cancel?.();
      }
      persist();
    });
    for (const button of root?.querySelectorAll?.('[data-run-mode]') ?? []) {
      button.addEventListener('click', () => setRunMode(button.dataset.runMode));
    }
    const renderOrdersMode = () => {
      for (const button of root?.querySelectorAll?.('[data-student-orders]') ?? []) {
        button.setAttribute('aria-pressed', String(button.dataset.studentOrders === settings.studentOrders));
      }
    };
    for (const button of root?.querySelectorAll?.('[data-student-orders]') ?? []) {
      button.addEventListener('click', () => {
        settings.studentOrders = button.dataset.studentOrders === 'instructor' ? 'instructor' : 'booth';
        persist();
        renderOrdersMode();
      });
    }
    renderOrdersMode();
    query('live-event-plan')?.addEventListener('click', (event) => {
      const button = event.target?.closest?.('[data-trigger-event]');
      if (button && !button.disabled) triggerEvent(button.dataset.triggerEvent, { onset: button.dataset.onset ?? 'realistic' });
    });
    query('live-operator-tryme')?.addEventListener('click', () => {
      operator.forceSoon();
      onInstructorNote({
        kind: 'info', severity: 'info', tSec: simTime() ?? 0,
        title: settings.runMode === 'booth' ? 'Booth will start the next armed event at the next calm moment.' : 'You are running it. Press TRIGGER on an event instead.',
        lines: [],
      });
      renderPhase();
    });
    query('live-operator-roast')?.addEventListener('click', () => { roast(); });
    query('live-operator-ask-form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = query('live-operator-ask');
      const value = input?.value ?? '';
      if (input) input.value = '';
      ask(value);
    });
  }

  bind();
  renderRunMode();
  renderPhase();
  renderEventPlan(true);

  return {
    operator,
    observe(snapshot) {
      operator.observe(snapshot);
      renderPhase();
      renderEventPlan();
    },
    observeEvent(entry) { operator.observeEvent(entry); },
    ask,
    roast,
    respondToStudent,
    executeOrder,
    getStudentOrdersMode: () => settings.studentOrders,
    applySuggestion,
    triggerEvent,
    setCasePlan,
    setRunMode,
    getRoomLog() { return roomLog.map((entry) => ({ ...entry })); },
  };
}
