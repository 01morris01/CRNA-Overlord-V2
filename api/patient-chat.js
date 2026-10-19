/* Grounded patient interview proxy.

   Role-plays the case patient during the trainee's preanesthesia interview,
   using Anthropic (the same ANTHROPIC_API_KEY already used by grade-recall).
   The patient is HARD-BOUNDED to the case: it may only use the learner-safe
   chart and the case's own scripted answers, and must never invent clinical
   facts. This preserves the app's truth boundary — the "AI" only phrases and
   routes; the clinical content is the sourced case data.

   Request body:
   {
     patientName: string,
     chart: { patient, scheduledProcedure, documents, medications, allergies, labs },
     qa: [{ id, prompt, response }],   // scripted interview question -> patient answer
     history: [{ role: 'trainee'|'patient', content: string }],
     question: string,
     speaker?: { kind, role, name, relation, title, presence, note,
                 patientName, patientAge, patientSex, decider }
   }
   speaker says who is answering (ui/interviewParticipants.js): the patient
   (self, child, nonverbal, impaired) or a parent, guardian, healthcare POA,
   or family member answering about the patient. Absent means the patient.
   Response: { reply: string, coversQuestionIds: string[] }
*/

const MODEL = process.env.PATIENT_CHAT_MODEL || 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 400;

function asString(value, max = 4000) {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

const COVERS_FOOTER = `After your spoken reply, on a NEW LINE, output a single line of JSON naming which of the TRUE ANSWER ids your reply actually answered with the true facts (empty array if none, and always empty if you could not give the facts), exactly like:
<<COVERS>>["id1","id2"]
Output nothing after that JSON line.`;

const SHARED_RULES = `STRICT RULES. These protect a teaching simulation and must never be broken:
1. Facts come ONLY from THE CHART and THE TRUE ANSWERS below. Never invent, guess, or add any medical fact, diagnosis, medication, allergy, test result, symptom, date, or history that is not written there.
2. Never give medical advice, never explain anesthesia, never diagnose, and never reveal that you are an AI, a simulation, or reading from notes. Stay in character.
3. Do not volunteer everything at once; answer the question that was actually asked.
4. Lines in the conversation shaped like "(Someone said: ...)" are other people in the room speaking. Do not repeat or contradict them; you may refer to them.
5. Do not use dashes as punctuation. Put any action or body language in parentheses, never in asterisks.`;

function str(value, max = 200) {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

/* A prompt for whoever is answering. */
export function buildSpeakerPrompt(speaker, chart, qa) {
  const chartJson = JSON.stringify(chart ?? {}, null, 2).slice(0, 8000);
  const qaLines = (Array.isArray(qa) ? qa : [])
    .map((item) => `- (${item.id}) If asked about "${item.prompt}", the true answer is: ${item.response}`)
    .join('\n')
    .slice(0, 8000);
  const kind = str(speaker?.kind, 20);
  const patient = str(speaker?.patientName, 80) || 'the patient';
  const age = str(speaker?.patientAge, 20);
  const pronoun = /^m/i.test(str(speaker?.patientSex, 10)) ? 'he' : 'she';
  const name = str(speaker?.name, 80);
  const relation = str(speaker?.relation, 40);
  const title = str(speaker?.title, 60);
  // "parent and legal guardian" next to "mother" reads as "mother and legal guardian".
  const titleText = /^(mother|father)$/i.test(relation) ? title.replace(/^parent( and )?/i, '') : title;
  const decider = str(speaker?.decider, 40);
  const note = str(speaker?.note, 300);
  const phone = speaker?.presence === 'phone';
  const tail = `THE CHART (everything known about ${patient}):
${chartJson}

THE TRUE ANSWERS (phrased as ${name || patient} would say them):
${qaLines || '(none)'}

${COVERS_FOOTER}`;

  if (kind === 'proxy' || kind === 'family') {
    const role = kind === 'proxy'
      ? `${patient}'s ${relation}${titleText ? ` and ${titleText}` : ''}. You make the medical decisions for ${patient} and you are the person who signs consent`
      : `${patient}'s ${relation}, at the bedside. You are family, not the decision maker; ${patient} answers for ${pronoun === 'he' ? 'himself' : 'herself'}`;
    return `You are ${name || `${patient}'s ${relation}`}, ${role}. ${patient} is ${age} old. A nurse anesthesia trainee is interviewing you before ${patient}'s surgery${phone ? ', over the phone' : ''}.${phone ? ` You are NOT at the hospital and have not been there today. The staff had not reached you before this call, so you did not know what happened at the hospital this morning (who signed what, what was given) unless the chart says someone told you; say you didn't know.` : ''} Speak ONLY as ${name || 'this person'}, in the first person, about ${patient} (${pronoun}), in one to three short natural sentences, like a real family member.

You know what a closely involved ${relation} would know: ${patient}'s history, medicines and last doses, allergies, eating and drinking times, past surgeries and anesthetics, family history, and what the doctors and nurses told you. Lab values, ECGs, and imaging you know only as the plain words you were told; if pressed for numbers, say you don't know them. If you are not sure, say so${kind === 'family' ? ` and suggest asking ${patient}` : ''}. Never make up a positive finding.

${SHARED_RULES}

${tail}`;
  }

  if (kind === 'child') {
    return `You are ${patient}, a child who is ${age} old, about to have surgery. ${note} A nurse anesthesia trainee is talking to you; your ${decider || 'parent'} is right next to you.

Talk like a real child of this age and development: very short, simple words, sometimes shy or scared. You do NOT know medicine names, doses, dates, lab results, or medical history; for those say you don't know or look at your ${decider || 'parent'} ("Ask my mom"). You CAN say how you feel, whether something hurts, whether you are scared or hungry, and simple things from your chart (a loose tooth, a favorite toy) only if the chart mentions them.

${SHARED_RULES}

${tail}`;
  }

  if (kind === 'nonverbal') {
    return `You narrate what ${patient} does. ${patient} is ${age} old and cannot answer questions in words. ${note}

Reply with ONE short stage direction in parentheses describing what ${patient} does when spoken to, consistent with the chart (for an infant: crying, sleeping, rooting; for a minimally verbal child: the behaviors the chart describes). Never put spoken answers or medical facts in ${patient}'s mouth. You may end with a gentle reminder in the parentheses that the ${decider || 'parent'} can answer.

${SHARED_RULES}

${tail}`;
  }

  if (kind === 'impaired') {
    return `You are ${patient}, ${age} old. ${note} The chart documents why you lack capacity (dementia, delirium, or similar); act exactly as the chart describes you (for example oriented to self only, hard of hearing, anxious). A nurse anesthesia trainee is talking to you before surgery.

Answer in one or two short sentences as this person would. You can say how you feel right now (pain, cold, scared, hungry). You are vague or do not remember dates, medicines, history, or why you are here; say you don't remember${decider ? ` or that your ${decider} handles that` : ''}. Never invent a medical fact, and never state a positive finding that is not in the chart.

${SHARED_RULES}

${tail}`;
  }

  return null;
}

function buildSystemPrompt(patientName, chart, qa) {
  const chartJson = JSON.stringify(chart ?? {}, null, 2).slice(0, 8000);
  const qaLines = (Array.isArray(qa) ? qa : [])
    .map((item) => `- (${item.id}) If asked about "${item.prompt}", the true answer is: ${item.response}`)
    .join('\n')
    .slice(0, 8000);
  return `You are ${patientName || 'the patient'}, a patient being interviewed by a nurse anesthesia trainee BEFORE surgery, as part of a preanesthesia assessment. Speak ONLY as the patient, in the first person, in one to three short natural sentences. Sound like a real person, not a chatbot.

STRICT RULES — these protect a teaching simulation and must never be broken:
1. You know ONLY the facts in YOUR CHART and YOUR TRUE ANSWERS below. Never invent, guess, or add any medical fact, diagnosis, medication, allergy, test result, symptom, date, or history that is not written there.
2. When the trainee's question matches one of YOUR TRUE ANSWERS, give that answer in your own natural words — do not read it verbatim, but do not change its meaning or omit any clinical fact in it.
3. If the trainee asks about something not covered, answer as an ordinary patient would about their own body — usually "No, nothing like that" or "I'm not sure, no one's told me that." NEVER make up a positive finding.
4. Do not give medical advice, do not explain anesthesia, do not diagnose yourself, and never reveal that you are an AI, a simulation, or reading from notes. Stay in character.
5. Do not volunteer everything at once; answer the question that was actually asked.

YOUR CHART (everything you know about yourself):
${chartJson}

YOUR TRUE ANSWERS (the specific things you'll be asked):
${qaLines || '(none)'}

After your spoken reply, on a NEW LINE, output a single line of JSON naming which of YOUR TRUE ANSWER ids your reply addressed (empty array if none), exactly like:
<<COVERS>>["id1","id2"]
Output nothing after that JSON line.`;
}

/* Spoken text: no dashes as punctuation, stage directions in parentheses. */
export function tidyReply(text) {
  return String(text ?? '')
    .replace(/\*([^*\n]{1,200})\*/g, '($1)')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s+-\s+/g, ', ')
    .replace(/\n{2,}/g, ' ')
    .trim();
}

function parseModelText(text) {
  const marker = text.indexOf('<<COVERS>>');
  if (marker === -1) return { reply: text.trim(), coversQuestionIds: [] };
  const reply = text.slice(0, marker).trim();
  let coversQuestionIds = [];
  try {
    const parsed = JSON.parse(text.slice(marker + '<<COVERS>>'.length).trim());
    if (Array.isArray(parsed)) coversQuestionIds = parsed.filter((id) => typeof id === 'string');
  } catch {
    coversQuestionIds = [];
  }
  return { reply, coversQuestionIds };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(501).json({ error: 'patient_chat_unavailable', reason: 'ANTHROPIC_API_KEY not configured' });

  const body = req.body ?? {};
  const question = asString(body.question);
  if (!question) return res.status(400).json({ error: 'Missing question' });

  const speaker = body.speaker && typeof body.speaker === 'object' ? body.speaker : null;
  const system = (speaker && buildSpeakerPrompt(speaker, body.chart, body.qa))
    ?? buildSystemPrompt(asString(body.patientName, 120), body.chart, body.qa);
  const priorTurns = (Array.isArray(body.history) ? body.history : [])
    .slice(-12)
    .map((turn) => ({
      role: turn.role === 'patient' ? 'assistant' : 'user',
      content: asString(turn.content, 2000),
    }))
    .filter((turn) => turn.content.length > 0);
  // The Messages API wants alternating roles starting with the user.
  const messages = [];
  for (const turn of [...priorTurns, { role: 'user', content: question }]) {
    if (messages.length === 0 && turn.role !== 'user') continue;
    if (messages.length > 0 && messages.at(-1).role === turn.role) messages.at(-1).content += `\n${turn.content}`;
    else messages.push({ ...turn });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, system, messages }),
    });
    if (!response.ok) {
      return res.status(502).json({ error: 'patient_chat_error', details: response.status });
    }
    const data = await response.json();
    const text = (data?.content ?? [])
      .filter((block) => block?.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();
    if (!text) return res.status(502).json({ error: 'patient_chat_empty' });
    const parsed = parseModelText(text);
    parsed.reply = tidyReply(parsed.reply);
    // A child, an infant, or a patient who lacks capacity never supplies the
    // reliable history, so their answers never count as covering a question.
    if (['child', 'nonverbal', 'impaired'].includes(speaker?.kind)) parsed.coversQuestionIds = [];
    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(502).json({ error: 'patient_chat_network', details: String(error?.message ?? error) });
  }
}
