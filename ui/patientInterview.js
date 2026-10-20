/* Voice patient interview for the preanesthesia assessment.

   The trainee asks questions (by voice or text); the case patient answers. The
   patient's clinical content is always the case's sourced, scripted answers —
   the AI only phrases them naturally and routes the question. When a question
   maps to a scripted assessment action, that action is performed on the runner
   so the finding is discovered and scored, exactly as clicking the button would.

   Layers, each with a graceful fallback so the interview works before keys exist:
   - Patient brain: POST /api/patient-chat (grounded Anthropic). If unavailable
     (501/error), fall back to a deterministic keyword match against the scripted
     question set (fully sourced, no AI).
   - Voice: POST /api/tts (ElevenLabs). If unavailable, fall back to the browser
     SpeechSynthesis voice.
   - Input: SpeechRecognition (mic) where supported, plus a text box always. */

import { createUtteranceAssembler } from './speechAssembler.js';

const STOP_WORDS = new Set(['the', 'a', 'an', 'is', 'are', 'do', 'did', 'you', 'your', 'have',
  'has', 'any', 'about', 'to', 'of', 'me', 'i', 'we', 'and', 'or', 'for', 'with', 'on', 'in',
  'ask', 'tell', 'what', 'when', 'how', 'was', 'were', 'be', 'been', 'that', 'this', 'it']);

function tokens(text) {
  return String(text ?? '').toLowerCase().match(/[a-z0-9]+/g)?.filter((w) => !STOP_WORDS.has(w)) ?? [];
}

// Build the learner-safe grounding for the patient from a normalized case
// experience: the chart plus the interview-stage scripted question/answer pairs.
export function buildInterviewGrounding(caseExperience) {
  if (!caseExperience || typeof caseExperience !== 'object') return null;
  const chart = caseExperience.learnerChart ?? {};
  const actions = Array.isArray(caseExperience.assessment?.actions) ? caseExperience.assessment.actions : [];
  const qa = actions
    .filter((action) => action.stage === 'interview' || action.stage === 'chart_review')
    .map((action) => ({ id: action.id, prompt: action.prompt, response: action.response, domain: action.domain }));
  return {
    patientName: chart.patient?.syntheticName ?? 'the patient',
    voice: patientVoiceFor(chart.patient?.sex),
    chart: {
      patient: chart.patient,
      scheduledProcedure: chart.scheduledProcedure,
      documents: chart.documents,
      medications: chart.medications,
      allergies: chart.allergies,
      labs: chart.labs,
    },
    qa,
  };
}

// The patient's voice follows the chart's sex; Booth has his own voice.
export function patientVoiceFor(sex) {
  return /^(m|male|man)$/i.test(String(sex ?? '').trim()) ? 'patient-male' : 'patient-female';
}

const MALE_VOICE_NAMES = /\b(male|david|mark|daniel|alex|fred|george|guy|aaron|arthur|james|tom)\b/i;
const FEMALE_VOICE_NAMES = /\b(female|samantha|victoria|karen|zira|susan|serena|moira|tessa|fiona|allison|ava|jenny)\b/i;

/* What gets spoken: stage directions in parentheses are for reading, not
   for the voice. "(looks at mom) No." speaks "No."; a reply that is only a
   stage direction (an infant) speaks nothing. */
export function spokenText(text) {
  return String(text ?? '').replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
}

export function isMaleVoice(voice) {
  return voice === 'patient-male' || /-male$/.test(String(voice ?? ''));
}

/* Browser speech fallback pitch per cast role. */
export function synthesisPitch(voice) {
  const role = String(voice ?? '');
  if (role.startsWith('child-')) return 1.5;
  if (role.startsWith('teen-')) return 1.2;
  if (role.startsWith('older-')) return isMaleVoice(role) ? 0.85 : 0.95;
  return isMaleVoice(role) ? 0.95 : 1.1;
}

export function pickSynthesisVoice(voices, voice) {
  const list = Array.isArray(voices) ? voices.filter((v) => /^en/i.test(v.lang ?? '')) : [];
  const wanted = isMaleVoice(voice) ? MALE_VOICE_NAMES : FEMALE_VOICE_NAMES;
  return list.find((v) => wanted.test(v.name ?? '')) ?? null;
}

// Deterministic fallback (no AI): match a free-text question to the nearest
// scripted question by shared significant words. Returns the sourced answer.
export function deterministicPatientReply(question, qa) {
  const qWords = new Set(tokens(question));
  let best = null;
  let bestOverlap = 0;
  for (const item of Array.isArray(qa) ? qa : []) {
    const candidate = new Set([...tokens(item.prompt), ...tokens(item.domain)]);
    let overlap = 0;
    for (const w of candidate) if (qWords.has(w)) overlap += 1;
    // Most shared significant words wins; ties keep the first (declaration order).
    if (overlap > bestOverlap) { bestOverlap = overlap; best = item; }
  }
  if (best && bestOverlap >= 1) {
    return { reply: best.response, coversQuestionIds: [best.id], matched: true };
  }
  return { reply: "I'm not sure about that — nobody's mentioned anything like that to me.", coversQuestionIds: [], matched: false };
}

const KIND_TAGS = Object.freeze({
  self: 'PATIENT', child: 'PATIENT · CHILD', nonverbal: 'PATIENT · CANNOT ANSWER', impaired: 'PATIENT · LACKS CAPACITY',
});

/* The person the trainee is talking to. Teaching cases and older groundings
   have no participants: the patient answers for themself. */
export function currentSpeaker(grounding, speakerId) {
  const list = Array.isArray(grounding?.participants) ? grounding.participants : [];
  return list.find((entry) => entry.id === speakerId)
    ?? list.find((entry) => entry.id === grounding?.defaultSpeakerId)
    ?? { id: 'patient', role: 'patient', kind: 'self', name: grounding?.patientName ?? 'the patient', label: grounding?.patientName ?? 'Patient', voice: grounding?.voice ?? 'patient-female' };
}

export function speakerTag(speaker) {
  if (speaker.role === 'patient') return KIND_TAGS[speaker.kind] ?? 'PATIENT';
  const parts = [String(speaker.relation ?? '').toUpperCase()];
  if (speaker.title && !/^parent$/i.test(speaker.title)) parts.push(speaker.title.toUpperCase());
  if (speaker.presence === 'phone') parts.push('BY PHONE');
  return parts.filter(Boolean).join(' · ');
}

export function questionPlaceholder(grounding, speaker) {
  const name = grounding?.patientName ?? 'the patient';
  if (speaker.role === 'patient') {
    if (speaker.kind === 'child') return 'Hi buddy, does anything hurt today?';
    if (speaker.kind === 'nonverbal') return `${name} cannot answer. Talk to the family.`;
    return 'When did you last eat or drink anything?';
  }
  return `When did ${name} last eat or drink anything?`;
}

/* Prior turns as the model sees them: lines from someone other than the
   current speaker are labeled, so a parent and a child never blur. */
export function historyForSpeaker(history, speakerId) {
  return history.map((turn) => {
    if (turn.role !== 'patient' || !turn.speakerId || turn.speakerId === speakerId) return { role: turn.role, content: turn.content };
    return { role: 'trainee', content: `(${turn.label ?? 'Someone else'} said: ${turn.content})` };
  });
}

export function createPatientInterview({
  runner,
  root = (typeof document !== 'undefined' ? document : null),
  fetchImpl = (typeof fetch !== 'undefined' ? fetch : null),
  speechHost = (typeof window !== 'undefined' ? window : null),
  onActionPerformed = () => {},
  onTurn = () => {},
} = {}) {
  const query = (id) => root?.getElementById?.(id) ?? null;
  const panel = query('live-patient-interview');
  const transcript = query('patient-interview-transcript');
  const input = query('patient-interview-input');
  const sendButton = query('patient-interview-send');
  const micButton = query('patient-interview-mic');
  const statusOut = query('patient-interview-status');

  let grounding = null;
  let speakerId = null;
  const history = [];
  const heading = query('patient-interview-heading');
  let recognition = null;
  let listening = false;
  let destroyed = false;
  let currentAudio = null;

  function setStatus(text) { if (statusOut) statusOut.textContent = text; }

  function speaker() { return currentSpeaker(grounding, speakerId); }

  function appendTurn(role, content, label = null) {
    if (!transcript) return;
    const line = root.createElement('div');
    line.className = `patient-interview-turn patient-interview-${role}`;
    const who = root.createElement('span');
    who.className = 'patient-interview-who';
    who.textContent = role === 'trainee' ? 'You' : (label ?? speaker().label ?? grounding?.patientName ?? 'Patient');
    const said = root.createElement('p');
    said.textContent = content;
    line.append(who, said);
    transcript.append(line);
    transcript.scrollTop = transcript.scrollHeight;
  }

  async function speak(rawText) {
    const text = spokenText(rawText);
    if (!text) return;
    // Prefer the ElevenLabs proxy; fall back to browser speech synthesis.
    if (fetchImpl) {
      try {
        const res = await fetchImpl('/api/tts', {
          method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text, voice: speaker().voice ?? grounding?.voice ?? 'patient-female' }),
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          currentAudio = new (speechHost?.Audio ?? Audio)(url);
          currentAudio.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true });
          await currentAudio.play().catch(() => {});
          return;
        }
      } catch { /* fall through to synthesis */ }
    }
    const synth = speechHost?.speechSynthesis;
    const Utterance = speechHost?.SpeechSynthesisUtterance;
    if (synth && Utterance) {
      synth.cancel();
      const utterance = new Utterance(text);
      const who = speaker();
      const chosen = pickSynthesisVoice(synth.getVoices?.(), who.voice ?? grounding?.voice);
      if (chosen) utterance.voice = chosen;
      utterance.pitch = synthesisPitch(who.voice ?? grounding?.voice);
      synth.speak(utterance);
    }
  }

  async function requestPatientReply(question) {
    if (fetchImpl) {
      try {
        const res = await fetchImpl('/api/patient-chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            patientName: grounding.patientName,
            chart: grounding.chart,
            qa: grounding.scripted?.[speaker().id] ?? grounding.qa,
            speaker: grounding.participants ? {
              kind: speaker().kind,
              role: speaker().role,
              name: speaker().name,
              relation: speaker().relation,
              title: speaker().title ?? '',
              presence: speaker().presence ?? 'bedside',
              note: speaker().note ?? '',
              patientName: grounding.patientName,
              patientAge: grounding.patientAge ?? '',
              patientSex: grounding.patientSex ?? '',
              decider: (grounding.participants.find((entry) => entry.id === 'decider') ?? grounding.participants.find((entry) => entry.role === 'parent'))?.relation ?? '',
            } : null,
            history: historyForSpeaker(history.slice(-12), speaker().id),
            question,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data?.reply === 'string' && data.reply.trim()) {
            return { reply: data.reply.trim(), coversQuestionIds: Array.isArray(data.coversQuestionIds) ? data.coversQuestionIds : [], source: 'ai' };
          }
        }
      } catch { /* fall through to deterministic */ }
    }
    // Deterministic, sourced fallback, phrased for whoever is answering.
    const qa = grounding.scripted?.[speaker().id] ?? grounding.qa;
    const who = speaker();
    if (who.kind === 'nonverbal') return { reply: qa?.[0]?.response ?? `(${who.name} does not answer.)`, coversQuestionIds: [], source: 'scripted' };
    const fallback = deterministicPatientReply(question, qa);
    if (!fallback.matched && who.role !== 'patient') fallback.reply = "I'm not sure about that. Nobody has told us anything like that.";
    return { ...fallback, source: 'scripted' };
  }

  async function ask(rawQuestion) {
    const question = String(rawQuestion ?? '').trim();
    if (!question || !grounding) return;
    if (input) input.value = '';
    const who = speaker();
    appendTurn('trainee', question);
    history.push({ role: 'trainee', content: question, speakerId: who.id });
    onTurn({ role: 'trainee', content: question, speakerId: who.id, label: 'You' });
    setStatus(`${who.label} is thinking…`);

    const { reply, coversQuestionIds, source } = await requestPatientReply(question);
    if (destroyed) return;
    appendTurn('patient', reply, who.label);
    history.push({ role: 'patient', content: reply, speakerId: who.id, label: who.label });
    onTurn({ role: 'patient', content: reply, speakerId: who.id, label: who.label });

    // Performing the matched interview action discovers the finding and scores it.
    for (const actionId of coversQuestionIds) {
      const result = runner?.performAssessmentAction?.({ actionId });
      if (result?.ok) onActionPerformed({ actionId, result });
    }
    setStatus(source === 'ai' ? 'Ready.' : 'Ready (scripted answers; the natural voice needs the server).');
    await speak(reply);
  }

  // The question is sent after a pause of about two seconds, or when the mic
  // is pressed again, so a long or halting question is not cut off.
  let assembler = null;
  function stopListening() {
    listening = false;
    micButton?.setAttribute('aria-pressed', 'false');
    const r = recognition;
    recognition = null;
    try { r?.stop?.(); } catch { /* ignore */ }
  }
  function startListening() {
    const SR = speechHost?.SpeechRecognition ?? speechHost?.webkitSpeechRecognition;
    if (!SR) { setStatus('Voice input not supported in this browser. Type your question.'); return; }
    if (listening) { assembler?.flush(); stopListening(); return; }
    assembler = createUtteranceAssembler({
      onHearing: (heard) => { if (heard) { if (input) input.value = heard; setStatus('Listening... press the mic again or pause to send.'); } },
      onUtterance: (said) => { stopListening(); if (input) input.value = said; ask(said); },
    });
    recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    listening = true;
    micButton?.setAttribute('aria-pressed', 'true');
    setStatus('Listening... ask your question.');
    recognition.onresult = (event) => assembler?.push(event);
    recognition.onerror = (event) => { if (event?.error !== 'no-speech' && event?.error !== 'aborted') setStatus('Did not catch that. Try again or type.'); };
    recognition.onend = () => {
      // Chrome can stop on its own during a pause: keep listening until sent.
      if (listening && recognition) { try { recognition.start(); } catch { /* running */ } }
    };
    recognition.start();
  }

  function setCase(caseExperience) {
    grounding = buildInterviewGrounding(caseExperience);
    history.length = 0;
    if (transcript) transcript.replaceChildren();
    const available = grounding !== null && grounding.qa.length > 0;
    if (panel) panel.hidden = !available;
    if (available) setStatus(`Interview ${grounding.patientName}. Ask by voice or text.`);
  }

  function speakersHost() {
    if (!panel || !root?.createElement) return null;
    let host = query('patient-interview-speakers');
    if (!host) {
      host = root.createElement('div');
      host.id = 'patient-interview-speakers';
      host.className = 'patient-interview-speakers';
      if (transcript?.parentNode) transcript.parentNode.insertBefore(host, transcript);
      else panel.append(host);
      host.addEventListener('click', (event) => {
        const button = event.target?.closest?.('[data-speaker-id]');
        if (button) selectSpeaker(button.dataset.speakerId);
      });
    }
    return host;
  }

  function renderSpeakers() {
    const host = speakersHost();
    const who = speaker();
    if (heading) heading.textContent = grounding?.participants ? `Talking with ${who.label}` : 'Talk with the patient';
    if (input) input.placeholder = questionPlaceholder(grounding, who);
    if (!host) return;
    const list = grounding?.participants ?? [];
    host.hidden = list.length < 2 && !grounding?.banner;
    host.replaceChildren();
    if (grounding?.banner) {
      const banner = root.createElement('p');
      banner.className = 'patient-interview-banner';
      banner.textContent = grounding.banner;
      host.append(banner);
    }
    if (list.length < 2) return;
    const row = root.createElement('div');
    row.className = 'patient-interview-speaker-row';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', 'Who you are talking to');
    for (const entry of list) {
      const button = root.createElement('button');
      button.type = 'button';
      button.dataset.speakerId = entry.id;
      button.dataset.kind = entry.kind;
      button.setAttribute('aria-pressed', String(entry.id === who.id));
      const name = root.createElement('strong');
      name.textContent = entry.role === 'patient' ? entry.name : entry.label.split(',')[0];
      const tag = root.createElement('small');
      tag.textContent = speakerTag(entry);
      button.append(name, tag);
      row.append(button);
    }
    host.append(row);
  }

  function selectSpeaker(id) {
    if (!grounding?.participants?.some((entry) => entry.id === id)) return;
    speakerId = id;
    renderSpeakers();
    const who = speaker();
    setStatus(who.note ? `Now talking with ${who.label}. ${who.note}` : `Now talking with ${who.label}.`);
  }

  /* Mock OR Day: grounding built straight from a chart (digest plus a few
     scripted answers for the offline fallback). null hides the panel. */
  function setGrounding(next) {
    grounding = next && typeof next === 'object' ? next : null;
    speakerId = grounding?.defaultSpeakerId ?? null;
    history.length = 0;
    if (transcript) transcript.replaceChildren();
    const available = grounding !== null && (grounding.qa?.length > 0 || Boolean(grounding.chart));
    if (panel) panel.hidden = !available;
    renderSpeakers();
    if (available) setStatus(`Talking with ${speaker().label}. Ask by voice or text.`);
  }

  /* Saved turns from an earlier visit: shown, and given back to the model. */
  function restore(turns = []) {
    for (const turn of Array.isArray(turns) ? turns : []) {
      if (!turn || typeof turn.content !== 'string' || !['trainee', 'patient'].includes(turn.role)) continue;
      appendTurn(turn.role, turn.content, turn.role === 'patient' ? (turn.label ?? null) : null);
      history.push({ role: turn.role, content: turn.content, speakerId: turn.speakerId ?? null, label: turn.label ?? null });
    }
  }

  function handleSend() { ask(input?.value ?? ''); }
  function handleKey(event) { if (event.key === 'Enter') { event.preventDefault(); handleSend(); } }

  sendButton?.addEventListener?.('click', handleSend);
  input?.addEventListener?.('keydown', handleKey);
  micButton?.addEventListener?.('click', startListening);

  function destroy() {
    destroyed = true;
    recognition?.abort?.();
    currentAudio?.pause?.();
    sendButton?.removeEventListener?.('click', handleSend);
    input?.removeEventListener?.('keydown', handleKey);
    micButton?.removeEventListener?.('click', startListening);
  }

  return {
    setCase, setGrounding, ask, destroy, restore, selectSpeaker,
    getSpeaker: () => speaker(),
    getTranscript: () => history.map((turn) => ({ ...turn })),
  };
}
