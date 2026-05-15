const GRADE_ENDPOINT = '/api/grade-recall';
const TIMEOUT_MS = 15000;

export async function gradeRecallAnswer(question, userAnswer) {
  const rubric = question.rubric;
  const prompt = question.q || question.prompt;

  if (!rubric || !prompt) {
    return _fallbackResult(rubric);
  }

  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const res = await fetch(GRADE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, rubric, userAnswer }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        lastError = new Error(`HTTP ${res.status}`);
        continue;
      }

      const result = await res.json();

      if (result.error && !result.score && result.score !== 0) {
        lastError = new Error(result.error);
        continue;
      }

      const score = typeof result.score === 'number' ? Math.max(0, Math.min(100, result.score)) : 70;

      return {
        score,
        passed: score >= (rubric.minimum_passing_score || 60),
        captured: Array.isArray(result.captured) ? result.captured : [],
        missed: Array.isArray(result.missed) ? result.missed : [],
        errors: Array.isArray(result.errors) ? result.errors : [],
        summary: result.summary || '',
        voss_quip: result.voss_quip || '',
      };
    } catch (err) {
      lastError = err;
      if (err.name === 'AbortError') {
        console.warn('[RECALL GRADER] Timeout on attempt', attempt + 1);
      } else {
        console.warn('[RECALL GRADER] Error on attempt', attempt + 1, err);
      }
    }
  }

  console.error('[RECALL GRADER] Both attempts failed:', lastError);
  return _fallbackResult(rubric);
}

function _fallbackResult(rubric) {
  return {
    score: 70,
    passed: true,
    captured: [],
    missed: rubric?.key_points?.map(kp => ({ point_id: kp.id, description: kp.description })) || [],
    errors: [],
    summary: 'Could not reach the grader. Counted as correct — move on.',
    voss_quip: 'Grader is down. You get a freebie.',
    _fallback: true,
  };
}
