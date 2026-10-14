/* Booth, the sim operator: on-demand language model replies.

   Two modes, both grounded in a case context the client builds from engine
   snapshots and the action log (ui/simOperator.js caseContext):
   - ask:   the trainee asks Booth something mid case.
   - roast: end of case review, sarcastic but specific.

   Truth boundary: the model may only use facts in CONTEXT. In ask mode the
   client withholds any complication Booth injected that the trainee has not
   treated yet, so the model cannot leak a diagnosis it was never told.
   Uses the same ANTHROPIC_API_KEY as grade-recall and patient-chat. Without a
   key this returns 501 and the client falls back to offline replies.

   Request body: { mode: 'ask'|'roast', question?, meanness: 1|2|3, context, history? }
   Response: { reply: string }
*/

const MODEL = process.env.SIM_OPERATOR_MODEL || process.env.PATIENT_CHAT_MODEL || 'claude-haiku-4-5-20251001';

const ATTITUDE = {
  1: 'Dry and deadpan. Light sarcasm, mostly straight teaching.',
  2: 'Salty. Clearly sarcastic and a little mean, like a sim tech who has watched a thousand trainees.',
  3: 'Savage. Roast hard and be funny about it, but every jab must be about an action or an outcome, never about the trainee as a person.',
};

function asString(value, max = 4000) {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

export function buildSystemPrompt({ mode, meanness, context }) {
  const level = ATTITUDE[meanness] ? meanness : 2;
  const contextJson = JSON.stringify(context ?? {}, null, 2).slice(0, 12000);
  const shared = `You are Booth, the sim operator who runs an anesthesia simulation from the control booth for a nurse anesthesia trainee. Attitude: ${ATTITUDE[level]}

RULES. These protect a teaching simulation. Never break them.
1. Facts come ONLY from CONTEXT below. Never invent a vital sign, dose, drug, time, event, or outcome. If CONTEXT doesn't contain it, you don't know it.
2. Clinical teaching must be accurate, standard anesthesia practice. If you are not certain a clinical claim is correct, leave it out. Do not give drug doses; the console's buttons carry the doses.
3. Mock decisions and outcomes, never the trainee's intelligence, identity, appearance, or worth. No slurs, no profanity.
4. Never discourage asking for help, calling for help, or pausing to think. If the trainee asks for help, help them, with attitude.
5. Do not use dashes as punctuation. Use commas, periods, or parentheses.
6. Plain text only. No markdown, no lists with symbols, no emoji.`;

  if (mode === 'roast') {
    return `${shared}

TASK: End of case roast. Write 4 to 7 sentences. Open with one roast line. Then name the 2 or 3 most important things the trainee should fix, each tied to a specific fact in CONTEXT (a time, a vital sign extreme, a missed or late action). If something was done well, give it one grudging sentence. End with one line telling them what to practice next.

CONTEXT:
${contextJson}`;
  }

  return `${shared}

TASK: The trainee is mid case and asked you a question. Answer in 1 to 3 short sentences, in character.
- Ground every observation in CONTEXT vitals, extremes, or recent actions.
- If an entry in CONTEXT.injections has disclosed false, something is wrong that the trainee hasn't identified. Do NOT guess or name it. Point them at the abnormal numbers and ask what could cause that pattern, like a good preceptor would.
- If they ask what to do next, give the next sensible step for the abnormal numbers you can see, not a diagnosis you can't.

CONTEXT:
${contextJson}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(501).json({ error: 'sim_operator_unavailable', reason: 'ANTHROPIC_API_KEY not configured' });

  const body = req.body ?? {};
  const mode = body.mode === 'roast' ? 'roast' : 'ask';
  const question = asString(body.question, 400);
  if (mode === 'ask' && !question.trim()) return res.status(400).json({ error: 'Missing question' });
  const meanness = [1, 2, 3].includes(body.meanness) ? body.meanness : 2;

  const system = buildSystemPrompt({ mode, meanness, context: body.context });
  const priorTurns = mode === 'ask'
    ? (Array.isArray(body.history) ? body.history : [])
      .slice(-6)
      .map((turn) => ({
        role: turn.role === 'operator' ? 'assistant' : 'user',
        content: asString(turn.content, 1000),
      }))
      .filter((turn) => turn.content.length > 0)
    : [];
  const userContent = mode === 'roast' ? 'Roast my case.' : question;
  // The Messages API needs alternating roles starting with user.
  const messages = [];
  for (const turn of [...priorTurns, { role: 'user', content: userContent }]) {
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
      body: JSON.stringify({ model: MODEL, max_tokens: mode === 'roast' ? 450 : 220, system, messages }),
    });
    if (!response.ok) return res.status(502).json({ error: 'sim_operator_error', details: response.status });
    const data = await response.json();
    const reply = (data?.content ?? [])
      .filter((block) => block?.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();
    if (!reply) return res.status(502).json({ error: 'sim_operator_empty' });
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(502).json({ error: 'sim_operator_network', details: String(error?.message ?? error) });
  }
}
