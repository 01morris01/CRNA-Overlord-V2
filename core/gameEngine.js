import { loadState, saveState } from './state.js';
import { recordQuestionOutcome, filterQuestions } from './questionEngine.js';

let currentRun = null;

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
    pointsEarned = 100 * mult;
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

  currentRun.results.push({questionId:q.id, correct:isCorrect, timestamp: Date.now()});

  if (currentRun.lives <= 0 || currentRun.index >= currentRun.questions.length - 1) {
    currentRun.done = true;
  }

  currentRun.index++;
  if (currentRun.index >= currentRun.questions.length) {
    currentRun.done = true;
  }

  const state = loadState();
  state.gamesPlayed = (state.gamesPlayed || 0) + (currentRun.done ? 1 : 0);
  state.bankedPts = (state.bankedPts || 0) + pointsEarned;
  state.totalPts = (state.totalPts || 0) + pointsEarned;
  state.highScore = Math.max(state.highScore || 0, currentRun.score);
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
