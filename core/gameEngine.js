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

  if (isCorrect) {
    currentRun.score += 100;
    currentRun.streak += 1;
    currentRun.bestStreak = Math.max(currentRun.bestStreak, currentRun.streak);
  } else {
    currentRun.streak = 0;
    currentRun.lives -= 1;
  }

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
  state.bankedPts = (state.bankedPts || 0) + (isCorrect ? 100 : 0);
  state.totalPts = (state.totalPts || 0) + (isCorrect ? 10 : 0);
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
