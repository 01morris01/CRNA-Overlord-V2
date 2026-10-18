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

export function pickSynthesisVoice(voices, voice) {
  const list = Array.isArray(voices) ? voices.filter((v) => /^en/i.test(v.lang ?? '')) : [];
  const wanted = voice === 'patient-male' ? MALE_VOICE_NAMES : FEMALE_VOICE_NAMES;
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

export function createPatientInterview({
  runner,
  root = (typeof document !== 'undefined' ? document : null),
  fetchImpl = (typeof fetch !== 'undefined' ? fetch : null),
  speechHost = (typeof window !== 'undefined' ? window : null),
  onActionPerformed = () => {},
} = {}) {
  const query = (id) => root?.getElementById?.(id) ?? null;
  const panel = query('live-patient-interview');
  const transcript = query('patient-interview-transcript');
  const input = query('patient-interview-input');
  const sendButton = query('patient-interview-send');
  const micButton = query('patient-interview-mic');
  const statusOut = query('patient-interview-status');

  let grounding = null;
  const history = [];
  let recognition = null;
  let listening = false;
  let destroyed = false;
  let currentAudio = null;

  function setStatus(text) { if (statusOut) statusOut.textContent = text; }

  function appendTurn(role, content) {
    if (!transcript) return;
    const line = root.createElement('div');
    line.className = `patient-interview-turn patient-interview-${role}`;
    const who = root.createElement('span');
    who.className = 'patient-interview-who';
    who.textContent = role === 'trainee' ? 'You' : (grounding?.patientName ?? 'Patient');
    const said = root.createElement('p');
    said.textContent = content;
    line.append(who, said);
    transcript.append(line);
    transcript.scrollTop = transcript.scrollHeight;
  }

  async function speak(text) {
    // Prefer the ElevenLabs proxy; fall back to browser speech synthesis.
    if (fetchImpl) {
      try {
        const res = await fetchImpl('/api/tts', {
          method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text, voice: grounding?.voice ?? 'patient-female' }),
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
      const chosen = pickSynthesisVoice(synth.getVoices?.(), grounding?.voice);
      if (chosen) utterance.voice = chosen;
      utterance.pitch = grounding?.voice === 'patient-male' ? 0.95 : 1.1;
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
            qa: grounding.qa,
            history: history.slice(-12),
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
    // Deterministic, sourced fallback.
    return { ...deterministicPatientReply(question, grounding.qa), source: 'scripted' };
  }

  async function ask(rawQuestion) {
    const question = String(rawQuestion ?? '').trim();
    if (!question || !grounding) return;
    if (input) input.value = '';
    appendTurn('trainee', question);
    history.push({ role: 'trainee', content: question });
    setStatus('Patient is thinking…');

    const { reply, coversQuestionIds, source } = await requestPatientReply(question);
    if (destroyed) return;
    appendTurn('patient', reply);
    history.push({ role: 'patient', content: reply });

    // Performing the matched interview action discovers the finding and scores it.
    for (const actionId of coversQuestionIds) {
      const result = runner?.performAssessmentAction?.({ actionId });
      if (result?.ok) onActionPerformed({ actionId, result });
    }
    setStatus(source === 'ai' ? 'Ready.' : 'Ready (scripted voice — add ANTHROPIC_API_KEY for a natural patient).');
    await speak(reply);
  }

  function startListening() {
    const SR = speechHost?.SpeechRecognition ?? speechHost?.webkitSpeechRecognition;
    if (!SR) { setStatus('Voice input not supported in this browser — type your question.'); return; }
    if (listening) { recognition?.stop(); return; }
    recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    listening = true;
    micButton?.setAttribute('aria-pressed', 'true');
    setStatus('Listening… ask your question.');
    recognition.onresult = (event) => {
      const said = event.results?.[0]?.[0]?.transcript ?? '';
      if (input) input.value = said;
      ask(said);
    };
    recognition.onerror = () => setStatus('Did not catch that — try again or type.');
    recognition.onend = () => { listening = false; micButton?.setAttribute('aria-pressed', 'false'); };
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

  /* Mock OR Day: grounding built straight from a chart (digest plus a few
     scripted answers for the offline fallback). null hides the panel. */
  function setGrounding(next) {
    grounding = next && typeof next === 'object' ? next : null;
    history.length = 0;
    if (transcript) transcript.replaceChildren();
    const available = grounding !== null && (grounding.qa?.length > 0 || Boolean(grounding.chart));
    if (panel) panel.hidden = !available;
    if (available) setStatus(`Interview ${grounding.patientName}. Ask by voice or text.`);
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

  return { setCase, setGrounding, ask, destroy };
}
