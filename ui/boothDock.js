/* Talk to Booth from the student's screen.

   Input: push to talk (hold the mic button or press it once), hands free
   ("Booth, I'm going to intubate now"; anything without the word Booth is
   ignored), or typing. Output: Booth's own voice (POST /api/tts voice
   'operator'), never the patient's; browser speech synthesis as fallback.

   Routing: when the instructor console is open (it sends a heartbeat on the
   student channel), the statement goes to the console, which knows the live
   engine state, answers through Booth, and keeps the private instructor note
   to itself. Without a console (preop steps on their own), the dock asks the
   API directly with the chart context, or answers offline. */

import { OPERATOR_NAME } from './simOperator.js';
import { createUtteranceAssembler, RELEASE_GRACE_MS } from './speechAssembler.js';

export { createUtteranceAssembler, SILENCE_MS, RELEASE_GRACE_MS } from './speechAssembler.js';

const CONSOLE_FRESH_MS = 6000;
const REPLY_TIMEOUT_MS = 20000;

function esc(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderBoothDock({ id = 'booth-dock', title = `Talk to ${OPERATOR_NAME}` } = {}) {
  return `
    <section id="${id}" class="booth-dock" aria-labelledby="${id}-heading">
      <header class="booth-dock-header">
        <div>
          <p class="booth-dock-eyebrow">SIM OPERATOR</p>
          <h2 id="${id}-heading">${esc(title)}</h2>
        </div>
        <output class="booth-dock-link" data-booth="link" data-state="standalone">NO CONSOLE</output>
      </header>
      <ol class="booth-dock-transcript" data-booth="transcript" aria-live="polite">
        <li class="booth-dock-empty">Tell ${esc(OPERATOR_NAME)} what you are doing. "Booth, I'm going to intubate now."</li>
      </ol>
      <div class="booth-dock-controls">
        <button type="button" class="booth-dock-mic" data-booth="mic" aria-pressed="false">HOLD TO TALK</button>
        <label class="booth-dock-handsfree"><input type="checkbox" data-booth="handsfree"><span>Hands free: say "Booth"</span></label>
        <label class="booth-dock-voice"><input type="checkbox" data-booth="voice" checked><span>Voice</span></label>
      </div>
      <form class="booth-dock-form" data-booth="form" novalidate>
        <input type="text" data-booth="input" maxlength="400" autocomplete="off" placeholder="I'm going to intubate now" aria-label="Message to ${esc(OPERATOR_NAME)}">
        <button type="submit">SEND</button>
      </form>
      <output class="booth-dock-status" data-booth="status" aria-live="polite"></output>
    </section>`;
}

/* Strips the wake word. Returns null when Booth was not addressed. */
export function extractBoothCommand(transcript) {
  const text = String(transcript ?? '').trim();
  const match = /\b(hey\s+)?booth\b[\s,.:!?]*/i.exec(text);
  if (!match) return null;
  const rest = (text.slice(0, match.index) + ' ' + text.slice(match.index + match[0].length)).replace(/\s+/g, ' ').trim();
  return rest;
}

export function createBoothVoice({ fetchImpl = (typeof fetch !== 'undefined' ? fetch : null), speechHost = (typeof window !== 'undefined' ? window : null) } = {}) {
  let audio = null;
  let enabled = true;
  let speaking = false;
  const queue = [];

  async function playOne(text) {
    if (fetchImpl) {
      try {
        const res = await fetchImpl('/api/tts', {
          method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text, voice: 'operator' }),
        });
        if (res.ok) {
          const url = URL.createObjectURL(await res.blob());
          audio = new (speechHost?.Audio ?? Audio)(url);
          await new Promise((resolve) => {
            audio.addEventListener('ended', resolve, { once: true });
            audio.addEventListener('error', resolve, { once: true });
            audio.play().catch(resolve);
          });
          URL.revokeObjectURL(url);
          return;
        }
      } catch { /* fall back */ }
    }
    const synth = speechHost?.speechSynthesis;
    const Utterance = speechHost?.SpeechSynthesisUtterance;
    if (!synth || !Utterance) return;
    await new Promise((resolve) => {
      const u = new Utterance(text);
      u.pitch = 0.7;
      u.rate = 1.05;
      u.onend = resolve;
      u.onerror = resolve;
      synth.speak(u);
      setTimeout(resolve, Math.min(20000, 1500 + text.length * 80));
    });
  }

  return {
    get speaking() { return speaking; },
    setEnabled(value) {
      enabled = Boolean(value);
      if (!enabled) { queue.length = 0; audio?.pause?.(); speechHost?.speechSynthesis?.cancel?.(); }
    },
    async say(text, onState = () => {}) {
      if (!enabled || !text) return;
      queue.push(text);
      if (speaking) return;
      speaking = true;
      onState(true);
      try {
        while (queue.length && enabled) await playOne(queue.shift());
      } finally {
        speaking = false;
        onState(false);
      }
    },
  };
}

export function createBoothDock({
  root = (typeof document !== 'undefined' ? document : null),
  id = 'booth-dock',
  channel = null,
  fetchImpl = (typeof fetch !== 'undefined' ? fetch : null),
  speechHost = (typeof window !== 'undefined' ? window : null),
  now = () => Date.now(),
  getStandaloneContext = () => ({}),
  localReply = () => 'I hear you. Open the instructor console and I\'ll have more to say.',
} = {}) {
  const dock = root?.getElementById?.(id);
  const q = (name) => dock?.querySelector?.(`[data-booth="${name}"]`) ?? null;
  const transcript = q('transcript');
  const input = q('input');
  const form = q('form');
  const mic = q('mic');
  const handsfree = q('handsfree');
  const voiceToggle = q('voice');
  const status = q('status');
  const link = q('link');
  const voice = createBoothVoice({ fetchImpl, speechHost });
  const waiting = new Map();
  let lastConsoleAt = 0;
  let consoleState = null;
  let recognition = null;
  let listeningMode = null; // 'ptt' | 'handsfree'
  let seq = 0;

  function setStatus(text) { if (status) status.textContent = text; }

  function append(role, text) {
    if (!transcript || !root?.createElement) return;
    transcript.querySelector?.('.booth-dock-empty')?.remove();
    const li = root.createElement('li');
    li.className = `booth-dock-line booth-dock-${role}`;
    const who = root.createElement('span');
    who.textContent = role === 'you' ? 'You' : OPERATOR_NAME;
    const said = root.createElement('p');
    said.textContent = text;
    li.append(who, said);
    transcript.append(li);
    while (transcript.children.length > 40) transcript.firstElementChild?.remove();
    transcript.scrollTop = transcript.scrollHeight;
  }

  function consoleConnected() { return now() - lastConsoleAt < CONSOLE_FRESH_MS; }

  function renderLink() {
    if (!link) return;
    const on = consoleConnected();
    link.dataset.state = on ? 'console' : 'standalone';
    link.textContent = on ? 'CONNECTED TO SIM OPERATOR' : 'NO CONSOLE';
  }

  async function askStandalone(text) {
    if (fetchImpl) {
      try {
        const res = await fetchImpl('/api/sim-operator', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ mode: 'ask', question: text, meanness: 2, context: { phase: 'preop, no live case running', ...getStandaloneContext() } }),
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data?.reply === 'string' && data.reply.trim()) return data.reply.trim();
        }
      } catch { /* offline */ }
    }
    return localReply(text);
  }

  function speakReply(text) {
    append('booth', text);
    pauseListening();
    voice.say(text, (talking) => { if (!talking) resumeListening(); setStatus(talking ? `${OPERATOR_NAME} is talking...` : ''); });
  }

  async function send(raw) {
    const text = String(raw ?? '').trim().slice(0, 400);
    if (!text) return null;
    append('you', text);
    if (channel && consoleConnected()) {
      const msgId = `s${now().toString(36)}${(seq += 1)}`;
      setStatus(`${OPERATOR_NAME} is thinking...`);
      const reply = await new Promise((resolve) => {
        waiting.set(msgId, resolve);
        channel.post({ type: 'student-booth', id: msgId, text });
        setTimeout(() => { if (waiting.has(msgId)) { waiting.delete(msgId); resolve(null); } }, REPLY_TIMEOUT_MS);
      });
      const finalReply = reply ?? await askStandalone(text);
      speakReply(finalReply);
      return finalReply;
    }
    setStatus(`${OPERATOR_NAME} is thinking...`);
    const reply = await askStandalone(text);
    speakReply(reply);
    return reply;
  }

  function onChannel(message) {
    if (message.type === 'console-state') {
      lastConsoleAt = now();
      consoleState = message;
      renderLink();
    } else if (message.type === 'booth-reply') {
      const resolve = waiting.get(message.replyTo);
      if (resolve) { waiting.delete(message.replyTo); resolve(message.text); }
    }
  }
  const unsubscribe = channel?.subscribe?.(onChannel);

  function Recognition() { return speechHost?.SpeechRecognition ?? speechHost?.webkitSpeechRecognition ?? null; }

  // Push to talk: everything said while the button is held (or, after a
  // quick tap, until a pause) is one message. Hands free: everything after
  // "Booth" until a pause is one message.
  const assembler = createUtteranceAssembler({
    onHearing: (heard) => { if (heard) setStatus(`Hearing: ${heard}`); },
    onUtterance: (said) => {
      if (listeningMode === 'ptt' || pttTapped) {
        pttTapped = false;
        stopPtt();
        send(said);
        return;
      }
      const command = extractBoothCommand(said);
      if (command === null) { setStatus('Hands free on. Start with "Booth".'); return; }
      if (command) send(command);
      else speakReply('Yeah? What.');
    },
  });
  let pttPressedAt = 0;
  let pttTapped = false;

  function stopPtt() {
    mic?.setAttribute('aria-pressed', 'false');
    if (listeningMode === 'ptt') {
      listeningMode = null;
      try { recognition?.stop?.(); } catch { /* ignore */ }
    }
  }

  function startRecognition(mode) {
    const SR = Recognition();
    if (!SR) { setStatus('Voice input not supported in this browser. Type instead.'); return false; }
    stopRecognition();
    assembler.clear();
    recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    listeningMode = mode;
    recognition.onresult = (event) => {
      // Holding the button: wait for the release. Tapped or hands free: wait for a pause.
      const holding = mode === 'ptt' && !pttTapped;
      assembler.push(event, { autoFlush: !holding });
    };
    recognition.onerror = (event) => { if (event?.error !== 'no-speech' && event?.error !== 'aborted') setStatus('Did not catch that.'); };
    recognition.onend = () => {
      if (listeningMode === 'handsfree' && handsfree?.checked && !voice.speaking) {
        try { recognition.start(); } catch { /* already started */ }
        return;
      }
      if (listeningMode === 'ptt' && pttTapped) {
        // Chrome stopped on its own while the tapped mic was open: keep listening.
        try { recognition.start(); } catch { /* running */ }
      }
    };
    try { recognition.start(); } catch { /* ignore */ }
    if (mode === 'ptt') { mic?.setAttribute('aria-pressed', 'true'); setStatus('Listening... let go when you are done.'); }
    else setStatus('Hands free on. Start with "Booth".');
    return true;
  }

  function stopRecognition() {
    const r = recognition;
    recognition = null;
    listeningMode = null;
    try { r?.abort?.(); } catch { /* ignore */ }
  }

  // Booth must not hear himself through the speakers.
  function pauseListening() { if (listeningMode === 'handsfree') { try { recognition?.stop?.(); } catch { /* ignore */ } } }
  function resumeListening() {
    if (handsfree?.checked && listeningMode === 'handsfree' && recognition) { try { recognition.start(); } catch { /* running */ } }
  }

  const onSubmit = (event) => { event.preventDefault(); const value = input?.value ?? ''; if (input) input.value = ''; send(value); };
  const onMicDown = () => {
    if (handsfree?.checked) return;
    // A second tap while the tapped mic is open sends now.
    if (pttTapped && listeningMode === 'ptt') { assembler.flush(); return; }
    pttPressedAt = now();
    startRecognition('ptt');
  };
  const onMicUp = () => {
    if (listeningMode !== 'ptt' || pttTapped) return;
    if (now() - pttPressedAt < 350 && !assembler.text) {
      // A quick tap: keep listening until they pause.
      pttTapped = true;
      setStatus('Listening... I will answer when you pause.');
      setTimeout(() => { if (pttTapped && !assembler.text) { pttTapped = false; stopPtt(); setStatus('Did not hear anything.'); } }, 15000);
      return;
    }
    // Held and released: collect the last words, then send (or stop if nothing was heard).
    setTimeout(() => {
      if (listeningMode !== 'ptt' || pttTapped) return;
      if (assembler.text) assembler.flush();
      else { stopPtt(); setStatus('Did not hear anything.'); }
    }, RELEASE_GRACE_MS);
  };
  const onHandsfree = () => { if (handsfree.checked) startRecognition('handsfree'); else { stopRecognition(); setStatus(''); } };
  const onVoice = () => voice.setEnabled(voiceToggle.checked);
  form?.addEventListener?.('submit', onSubmit);
  mic?.addEventListener?.('pointerdown', onMicDown);
  mic?.addEventListener?.('pointerup', onMicUp);
  mic?.addEventListener?.('pointerleave', onMicUp);
  mic?.addEventListener?.('keydown', (event) => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); if (!listeningMode) onMicDown(); } });
  mic?.addEventListener?.('keyup', (event) => { if (event.key === ' ' || event.key === 'Enter') onMicUp(); });
  handsfree?.addEventListener?.('change', onHandsfree);
  voiceToggle?.addEventListener?.('change', onVoice);
  const linkTimer = setInterval(renderLink, 2000);
  channel?.post?.({ type: 'student-hello' });

  return {
    send,
    consoleConnected,
    getConsoleState: () => consoleState,
    destroy() {
      clearInterval(linkTimer);
      unsubscribe?.();
      stopRecognition();
      voice.setEnabled(false);
      form?.removeEventListener?.('submit', onSubmit);
    },
  };
}
