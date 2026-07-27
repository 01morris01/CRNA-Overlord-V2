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
     question: string
   }
   Response: { reply: string, coversQuestionIds: string[] }
*/

const MODEL = process.env.PATIENT_CHAT_MODEL || 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 400;

function asString(value, max = 4000) {
  return typeof value === 'string' ? value.slice(0, max) : '';
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

  const system = buildSystemPrompt(asString(body.patientName, 120), body.chart, body.qa);
  const priorTurns = (Array.isArray(body.history) ? body.history : [])
    .slice(-12)
    .map((turn) => ({
      role: turn.role === 'patient' ? 'assistant' : 'user',
      content: asString(turn.content, 2000),
    }))
    .filter((turn) => turn.content.length > 0);
  const messages = [...priorTurns, { role: 'user', content: question }];

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
    return res.status(200).json(parseModelText(text));
  } catch (error) {
    return res.status(502).json({ error: 'patient_chat_network', details: String(error?.message ?? error) });
  }
}
