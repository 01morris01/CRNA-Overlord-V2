import { loadState, saveState } from './state.js';
import { recordQuestionOutcome, filterQuestions } from './questionEngine.js';

let currentRun = null;

// PRESSURE LADDER: each question rung is worth more than the last
export const LADDER_REWARDS = [
  // Q1-Q5: pre-induction (banks at Q5)
  50, 50, 50, 50, 100,
  // Q6-Q10: maintenance (banks at Q10)
  150, 150, 150, 150, 250,
  // Q11-Q14: critical phase
  400, 400, 400, 400,
  // Q15: code blue
  1000,
];

export function getCurrentRun() {
  return currentRun;
}

export function startRun(options = {}) {
  const allQs = (options.questions || filterQuestions(options)).slice();
  if (!allQs.length) {
    throw new Error('No questions available for startRun');
  }

  currentRun = {
    questions: allQs,
    index: 0,
    score: 0,
    lives: options.lives || 3,
    streak: 0,
    bestStreak: 0,
    mode: options.mode || 'lesson',
    done: false,
    results: [],
    vitals: { hr: 72, sbp: 120, dbp: 80, spo2: 98 },
    lockedScore: 0,
    // House lifelines: 1 of each per session (separate from store inventory)
    houseLifelines: (options.mode !== 'code-blue')
      ? { shield: 1, skip: 1, reveal: 1, time: 1 }
      : { shield: 0, skip: 0, reveal: 0, time: 0 },
  };

  return currentRun;
}

export function getCurrentQuestion() {
  if(!currentRun) return null;
  return currentRun.questions[currentRun.index] || null;
}

export function submitAnswer(isCorrect) {
  if(!currentRun || currentRun.done) return;

  const q = getCurrentQuestion();
  if(!q) return;

  const topicId = q.metadata.topicId || q.metadata.sectionId || 'general';
  recordQuestionOutcome(q.id, topicId, !!isCorrect);

  let pointsEarned = 0;
  const v = currentRun.vitals;
  if (isCorrect) {
    currentRun.streak += 1;
    currentRun.bestStreak = Math.max(currentRun.bestStreak, currentRun.streak);
    const mult = Math.min(1 + Math.floor(currentRun.streak / 2), 5);
    const modeMultiplier = currentRun.mode === 'code-blue' ? 2 : 1;

    // Base points from the pressure ladder (not flat 100)
    const ladderIdx = Math.min(currentRun.index, LADDER_REWARDS.length - 1);
    const basePts = LADDER_REWARDS[ladderIdx];
    pointsEarned = basePts * mult * modeMultiplier;
    currentRun.score += pointsEarned;
    currentRun._lastMult = mult;

    // Streak milestone banners
    if (currentRun.streak === 3 || currentRun.streak === 5 || currentRun.streak === 7) {
      currentRun._streakMilestone = currentRun.streak;
    }

    // Vitals drift toward baseline on correct answer
    v.hr  += (72 - v.hr) * 0.15;
    v.sbp += (120 - v.sbp) * 0.12;
    v.dbp += (80 - v.dbp) * 0.12;
    v.spo2 = Math.min(98, v.spo2 + 0.5);
  } else {
    currentRun.streak = 0;
    currentRun._lastMult = 1;
    currentRun.lives -= 1;

    // Vitals degrade on wrong answer
    v.hr  = Math.min(180, v.hr + 8);
    v.sbp = Math.max(40, v.sbp - 10);
    v.dbp = Math.max(20, v.dbp - 5);
    v.spo2 = Math.max(60, v.spo2 - 1);

    // Code blue check: critical vitals trigger immediate game over
    if (v.hr > 140 || v.sbp < 70 || v.spo2 < 88) {
      currentRun._codeBlueTrigger = true;
    }
  }
  // Round vitals for display
  v.hr = Math.round(v.hr); v.sbp = Math.round(v.sbp);
  v.dbp = Math.round(v.dbp); v.spo2 = Math.round(v.spo2 * 10) / 10;

  // Safe rungs: lock in score at Q5 and Q10
  if (isCorrect && (currentRun.index === 4 || currentRun.index === 9)) {
    currentRun.lockedScore = currentRun.score;
    currentRun._safeRungReached = true;
  }

  currentRun.results.push({questionId:q.id, correct:isCorrect, timestamp: Date.now(), topic: q.metadata?.topic || q.metadata?.topicId || 'general'});

  if (currentRun.lives <= 0 || currentRun.index >= currentRun.questions.length - 1) {
    currentRun.done = true;
  }

  currentRun.index++;
  if (currentRun.index >= currentRun.questions.length) {
    currentRun.done = true;
  }

  const state = loadState();
  state.gamesPlayed = (state.gamesPlayed || 0) + (currentRun.done ? 1 : 0);

  // Banking: study mode earns nothing; dead runs bank only locked score
  if (currentRun.mode !== 'study') {
    if (currentRun.done && currentRun.lives <= 0) {
      // Lost all lives: bank only the locked safe-rung amount
      const finalBank = currentRun.lockedScore || 0;
      state.bankedPts = (state.bankedPts || 0) + finalBank;
      state.totalPts = (state.totalPts || 0) + finalBank;
    } else {
      // Still alive or just finished: bank incrementally
      state.bankedPts = (state.bankedPts || 0) + pointsEarned;
      state.totalPts = (state.totalPts || 0) + pointsEarned;
    }
  }
  state.highScore = Math.max(state.highScore || 0, currentRun.score);

  // Track per-topic stats
  if (currentRun.done) {
    const nodeId = window.currentSession?.nodeId;
    if (nodeId && currentRun.results?.length > 0) {
      const correct = currentRun.results.filter(r => r.correct).length;
      const total = currentRun.results.length;
      const pct = Math.round(correct / total * 100);
      if (!state.topicStats) state.topicStats = {};
      const prev = state.topicStats[nodeId] || { plays: 0, bestScore: 0, bestPct: 0 };
      state.topicStats[nodeId] = {
        plays: prev.plays + 1,
        bestScore: Math.max(prev.bestScore, currentRun.score),
        bestPct: Math.max(prev.bestPct, pct),
        lastSeen: Date.now(),
      };
    }
  }

  saveState(state);

  return {currentRun, nextQuestion: getCurrentQuestion()};
}

export function endRun() {
  if(!currentRun) return;
  currentRun.done = true;
  return currentRun;
}

export function resetRun() {
  currentRun = null;
}
