/* DOM wiring for Booth, the sim operator (logic lives in simOperator.js).

   Voice: POST /api/tts with voice "operator" (ElevenLabs), falling back to the
   browser's speech synthesis. Ask and roast: POST /api/sim-operator, falling
   back to offline answers built from the same grounded case context. */

import {
  buildLocalAnswer,
  buildLocalRoast,
  CHAOS_PROFILES,
  createSimOperator,
  MEANNESS_LEVELS,
  OPERATOR_NAME,
} from './simOperator.js';

const SETTINGS_KEY = 'overlord.booth.settings.v1';
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
      </div>
      <label class="live-toggle" for="live-operator-voice"><input id="live-operator-voice" type="checkbox"><span>Voice</span></label>
      <output id="live-operator-phase" class="live-help" aria-live="polite">Waiting for the case to start.</output>
      <div class="live-button-row">
        <button id="live-operator-tryme" type="button">TRY ME</button>
        <button id="live-operator-roast" type="button">ROAST MY CASE</button>
      </div>
      <ol id="live-operator-feed" class="live-operator-feed"><li class="live-empty">${escapeHtml(OPERATOR_NAME)} is watching.</li></ol>
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
      voice: parsed.voice === true,
    };
  } catch {
    return { enabled: true, meanness: 2, chaos: 1, voice: false };
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
    if (!synth || !Utterance) return;
    synth.cancel();
    const utterance = new Utterance(text);
    utterance.pitch = 0.8;
    utterance.rate = 1.05;
    synth.speak(utterance);
  }

  async function voice(text, priority = 1) {
    if (!settings.voice) return;
    // Booth doesn't talk over himself; low priority lines are dropped while he speaks.
    if (speaking && priority < 2) return;
    speaking = true;
    try {
      if (fetchImpl) {
        const res = await fetchImpl('/api/tts', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text, voice: 'operator' }),
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          currentAudio?.pause?.();
          currentAudio = new (speechHost?.Audio ?? Audio)(url);
          await new Promise((resolve) => {
            currentAudio.addEventListener('ended', resolve, { once: true });
            currentAudio.addEventListener('error', resolve, { once: true });
            currentAudio.play().catch(resolve);
          });
          URL.revokeObjectURL(url);
          return;
        }
      }
      speakWithSynthesis(text);
    } catch {
      speakWithSynthesis(text);
    } finally {
      speaking = false;
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
        currentAudio?.pause?.();
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
  };
}
