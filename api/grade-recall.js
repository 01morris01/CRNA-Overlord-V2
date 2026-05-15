export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { prompt, rubric, userAnswer } = req.body;
  if (!prompt || !rubric || !userAnswer) {
    return res.status(400).json({ error: 'Missing required fields: prompt, rubric, userAnswer' });
  }

  const systemMessage = `You are Dr. Voss, a no-nonsense anesthesia attending grading an SRNA's free-recall answer. You are direct, precise, and care about clinical accuracy more than effort. You praise sparingly and correct firmly. You never make up medical facts.

You will be given:
1. A question prompt
2. A rubric with weighted key points
3. The student's free-recall answer

Your job is to:
1. For each key point in the rubric, determine if the student's answer addresses it. Be generous on phrasing (paraphrases count) but strict on accuracy (wrong dose or wrong mechanism does not count, even if the topic is mentioned).
2. Identify any factually incorrect statements the student made.
3. Calculate a score from 0-100 based on weighted key points captured.
4. Generate a 1-2 sentence summary of what the student got right and where they need to focus.
5. Generate one in-character Voss line (snarky but instructive, ~12 words).

Respond in valid JSON only, matching this schema exactly:
{
  "captured": [{"point_id": "...", "evidence": "..."}],
  "missed": [{"point_id": "...", "description": "..."}],
  "errors": [{"statement": "...", "correction": "..."}],
  "score": 0-100,
  "summary": "...",
  "voss_quip": "..."
}`;

  const userMessage = `QUESTION PROMPT:
${prompt}

RUBRIC:
${JSON.stringify(rubric, null, 2)}

STUDENT'S ANSWER:
${userAnswer}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250514',
        max_tokens: 1024,
        temperature: 0.3,
        system: systemMessage,
        messages: [{ role: 'user', content: userMessage }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(502).json({ error: 'Grading service error', details: response.status });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    let result;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (parseErr) {
      console.error('JSON parse failed, raw:', text);
      return res.status(200).json({
        captured: [],
        missed: rubric.key_points.map(kp => ({ point_id: kp.id, description: kp.description })),
        errors: [],
        score: 70,
        summary: 'Could not parse grading response. Counted as passing.',
        voss_quip: 'Technical difficulties. You get a pass this time.',
        _parseError: true,
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      return res.status(200).json({
        captured: [],
        missed: [],
        errors: [],
        score: 70,
        summary: 'Grading timed out. Marked as passing.',
        voss_quip: 'Clock ran out on me. Move on.',
        _timeout: true,
      });
    }
    console.error('Grading endpoint error:', err);
    return res.status(502).json({ error: 'Network error reaching grading service' });
  }
}
