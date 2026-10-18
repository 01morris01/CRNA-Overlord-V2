/* DOM wiring for Booth, the sim operator (logic lives in simOperator.js).

   Voice: POST /api/tts with voice "operator" (ElevenLabs), falling back to the
   browser's speech synthesis. Ask and roast: POST /api/sim-operator, falling
   back to offline answers built from the same grounded case context. */

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
  STUDENT_SUGGESTIONS,
  studentFacts,
} from './boothStudent.js';

const SETTINGS_KEY = 'overlord.booth.settings.v2';
const FEED_LIMIT = 30;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function renderOperatorStrip() {
  return `
    <div id="live-operator-strip" class="live-operator-strip" role="status" aria-live="polite" hidden>
      <span class="live-operator-tag">${escapeHtml(OPERATOR_NAME.toUpperCase())}</span>
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
  return `
    <section id="live-operator-panel" class="live-panel live-operator-panel" aria-labelledby="live-operator-heading">
      <div class="live-operator-header">
        <div>
          <p class="live-eyebrow">SIM OPERATOR</p>
          <h2 id="live-operator-heading">${escapeHtml(OPERATOR_NAME)}</h2>
        </div>
        <label class="live-toggle" for="live-operator-enabled"><input id="live-operator-enabled" type="checkbox" checked><span>On</span></label>
      </div>
      <p class="live-help">Runs the case from the booth. Injects complications when things get quiet and has opinions about everything. With a rubric or teaching case loaded he only talks.</p>
      <div class="live-operator-settings">
        <label class="live-field" for="live-operator-meanness"><span>Attitude</span><select id="live-operator-meanness">${meanness}</select></label>
        <label class="live-field" for="live-operator-chaos"><span>Chaos</span><select id="live-operator-chaos">${chaos}</select></label>
        <label class="live-field" for="live-operator-chatter"><span>Chatter</span><select id="live-operator-chatter">${chatter}</select></label>
      </div>
      <label class="live-toggle" for="live-operator-voice"><input id="live-operator-voice" type="checkbox" checked><span>Voice</span></label>
      <output id="live-operator-phase" class="live-help" aria-live="polite">Waiting for the case to start.</output>
      <div class="live-button-row">
        <button id="live-operator-tryme" type="button">TRY ME</button>
        <button id="live-operator-roast" type="button">ROAST MY CASE</button>
      </div>
      <ol id="live-operator-feed" class="live-operator-feed"><li class="live-empty">${escapeHtml(OPERATOR_NAME)} is watching.</li></ol>
      <section class="live-operator-notes-panel" aria-labelledby="live-operator-notes-heading">
        <h3 id="live-operator-notes-heading">${escapeHtml(OPERATOR_NAME)}'s notes for you</h3>
        <p class="live-help">When the student talks to ${escapeHtml(OPERATOR_NAME)} from their screen, he answers them and tells you here what they may have missed. Only you see this.</p>
        <ol id="live-operator-notes" class="live-operator-notes"><li class="live-empty">No student messages yet.</li></ol>
      </section>
      <form id="live-operator-ask-form" class="live-operator-ask" novalidate>
        <label class="live-field" for="live-operator-ask"><span>Ask ${escapeHtml(OPERATOR_NAME)}</span>
          <input id="live-operator-ask" type="text" maxlength="400" placeholder="What am I missing?" autocomplete="off">
        </label>
        <button id="live-operator-ask-send" type="submit">ASK</button>
      </form>
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
    };
  } catch {
    return { enabled: true, meanness: 2, chaos: 1, chatter: 1, voice: true };
  }
}

function writeSettings(storage, settings) {
  try { storage?.setItem?.(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* storage blocked */ }
}

const PHASE_LABELS = Object.freeze({
  BUILD_UP: 'Watching. Getting bored.',
  PEAK: 'Something is happening.',
  PEAK_FADE: 'Waiting for you to stabilize.',
  RELAX: 'Letting you breathe. For now.',
  DONE: 'Out of complications for this case.',
});

export function createSimOperatorController({
  runner,
  root = (typeof document !== 'undefined' ? document : null),
  fetchImpl = (typeof fetch !== 'undefined' ? fetch : null),
  speechHost = (typeof window !== 'undefined' ? window : null),
  storage = (typeof localStorage !== 'undefined' ? localStorage : null),
  now = () => Date.now(),
  getAnswerKey = () => null,
  random = Math.random,
} = {}) {
  const query = (id) => root?.getElementById?.(id) ?? null;
  const settings = readSettings(storage);
  const askHistory = [];
  let currentAudio = null;
  let speaking = false;
  let lastPhaseText = '';

  function appendFeed(role, text, tSec = null) {
    const feed = query('live-operator-feed');
    if (!feed || !root?.createElement) return;
    feed.querySelector?.('.live-empty')?.remove();
    const item = root.createElement('li');
    item.className = `live-operator-line live-operator-${role}`;
    const time = root.createElement('time');
    time.textContent = tSec === null ? '' : formatTime(tSec);
    const said = root.createElement('p');
    said.textContent = role === 'you' ? `You: ${text}` : text;
    item.append(time, said);
    feed.prepend(item);
    while (feed.children.length > FEED_LIMIT) feed.lastElementChild?.remove();
  }

  function showLatest(text) {
    const strip = query('live-operator-strip');
    const latest = query('live-operator-latest');
    if (latest) latest.textContent = text;
    if (strip) strip.hidden = false;
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
    appendFeed('booth', line.text, line.tSec);
    showLatest(line.text);
    voice(line.text, line.priority);
  }

  const operator = createSimOperator({
    runner,
    say: onLine,
    now,
    meanness: settings.meanness,
    chaos: settings.chaos,
    chatter: settings.chatter,
    enabled: settings.enabled,
  });

  function renderPhase() {
    const out = query('live-operator-phase');
    if (!out) return;
    const s = operator.getSettings();
    let text;
    if (!s.enabled) text = `${OPERATOR_NAME} is off.`;
    else if (!s.directorAllowed) text = 'Rubric or teaching case loaded. Commentary only.';
    else if (s.chaos === 0) text = 'Commentary only.';
    else {
      const d = operator.getDirectorState();
      const cap = (CHAOS_PROFILES[s.chaos]?.maxInjections ?? 0) + (d.extra ?? 0);
      text = `${PHASE_LABELS[d.phase] ?? d.phase} ${d.injected.length} of ${cap} used.`;
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

  async function ask(rawQuestion) {
    const question = String(rawQuestion ?? '').trim().slice(0, 400);
    if (!question) return null;
    appendFeed('you', question, runner?.simTime ?? null);
    const context = operator.caseContext();
    const reply = await postOperator({
      mode: 'ask', question, meanness: settings.meanness, context, history: askHistory.slice(-6),
    }) ?? buildLocalAnswer(context);
    askHistory.push({ role: 'trainee', content: question }, { role: 'operator', content: reply });
    appendFeed('booth', reply, runner?.simTime ?? null);
    showLatest(reply);
    voice(reply, 2);
    return reply;
  }

  /* The student talked to Booth from their own screen. Returns the reply for
     the student (spoken there) and writes the private note into the console. */
  async function respondToStudent(rawText) {
    const text = String(rawText ?? '').trim().slice(0, 400);
    if (!text) return null;
    const classification = classifyStudentStatement(text);
    const snapshot = runner?.snapshot?.() ?? {};
    const answerKey = getAnswerKey();
    const facts = studentFacts({ snapshot, history: operator.getHistory(), answerKey });
    const analysis = analyzeStudentAction(classification, facts);
    let reply = buildStudentReply(classification, analysis, { meanness: settings.meanness, random });
    let note = buildOperatorNote(text, classification, analysis);
    let suggestions = analysis.suggestions;
    const context = {
      ...operator.caseContext(),
      student: { statement: text, ...classification, analysis: { issues: analysis.issues.map(({ id, missed, consequence, severity }) => ({ id, missed, consequence, severity })) } },
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
            reply = parsed.reply;
            if (parsed.operatorNote) note = parsed.operatorNote;
            // Engine analysis always contributes its actions; the model can add fitting ones.
            suggestions = [...new Set([...analysis.suggestions, ...parsed.suggestions])];
          }
        }
      } catch { /* offline reply stands */ }
    }
    askHistory.push({ role: 'trainee', content: text }, { role: 'operator', content: reply });
    appendFeed('student', `Student: ${text}`, runner?.simTime ?? null);
    appendFeed('booth', reply, runner?.simTime ?? null);
    showLatest(reply);
    addNote({ text, note, suggestions, issues: analysis.issues, tSec: runner?.simTime ?? null });
    return { reply, note, suggestions, classification, analysis };
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

  function addNote({ text, note, suggestions, issues, tSec }) {
    const list = query('live-operator-notes');
    if (!list || !root?.createElement) return;
    list.querySelector?.('.live-empty')?.remove();
    const item = root.createElement('li');
    const worst = issues[0]?.severity ?? 'none';
    item.className = `live-operator-note live-operator-note-${worst}`;
    const head = root.createElement('p');
    head.className = 'live-operator-note-head';
    head.textContent = `${tSec === null ? '' : `${formatTime(tSec)} · `}"${text}"`;
    const body = root.createElement('p');
    body.textContent = note;
    item.append(head, body);
    const row = root.createElement('div');
    row.className = 'live-operator-note-actions';
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
    list.prepend(item);
    while (list.children.length > 20) list.lastElementChild?.remove();
  }

  async function roast() {
    const context = operator.caseContext({ revealAll: true });
    const button = query('live-operator-roast');
    if (button) button.disabled = true;
    try {
      const reply = await postOperator({ mode: 'roast', meanness: settings.meanness, context })
        ?? buildLocalRoast(context, settings.meanness);
      appendFeed('roast', reply, runner?.simTime ?? null);
      showLatest(reply);
      voice(reply, 2);
      return reply;
    } finally {
      if (button) button.disabled = false;
    }
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
    query('live-operator-tryme')?.addEventListener('click', () => {
      operator.forceSoon();
      const line = 'Try you? Fine. Give me a quiet moment and I\'ll find something.';
      appendFeed('booth', line, runner?.simTime ?? null);
      showLatest(line);
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
  renderPhase();

  return {
    operator,
    observe(snapshot) {
      operator.observe(snapshot);
      renderPhase();
    },
    observeEvent(entry) { operator.observeEvent(entry); },
    ask,
    roast,
    respondToStudent,
    applySuggestion,
  };
}
