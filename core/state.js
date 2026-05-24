import { getUserSaveKey } from './auth.js';

const LEGACY_SAVE_KEY = 'hemodynamic_overlord_save';

// Rolling atom accuracy >= this threshold (and >= 2 attempts) unlocks
// synthesis questions for the topic. One named constant for easy tuning.
export const SYNTHESIS_UNLOCK_THRESHOLD = 70;

// Adaptive timer bounds (seconds) — the homeostat never pushes outside these.
export const RECALL_TIMER_FLOOR   = 150;  // 2:30 hard minimum for synthesis
export const RECALL_TIMER_CEILING = 330;  // 5:30 hard maximum for synthesis

// Homeostat step sizes (seconds)
export const TIMER_LOOSEN_STEP  = 45;  // sharp — erring toward safety
export const TIMER_TIGHTEN_STEP = 30;  // governed — once per session, post-win only

const DEFAULT_STATE = {
  name: '',
  totalPts: 0,
  bankedPts: 0,
  equip: {vent:false,mac:false,vl:false,bougie:false},
  inv: {shield:0,skip:0,reveal:0,time:0},
  highScore: 0,
  gamesPlayed: 0,
  completed: {},
  bestScores: {},
  performanceByTopic: {},
  missedQuestionIds: [],
  lastSeen: {course:null,section:null,lesson:null},
  // Per-node completion: { [nodeId]: { seen, correct, totalInBank } }
  nodeCompletion: {},
  // Question IDs the player has flagged for later review
  savedForLater: [],
  // Recall First: show stem before answer options, hold timer until user is ready
  recallFirstEnabled: false,
  // Daily missions: { [dateString]: { completedAt } }
  dailyMissions: {},
  // Last selected game mode
  lastMode: 'or-rounds',
  // Chapter badges earned
  badges: [],
  // Per-topic stats: { nodeId: { plays, bestScore, bestPct, lastSeen } }
  topicStats: {},
  // Free recall stats: { [questionId]: { attempts, bestScore, lastAttempt, capturedPoints, missedCounts, persistentlyMissed } }
  recallStats: {},
  // Per-topic atom competence for adaptive gating
  // { [topic]: { atomAttempts, atomAccuracySum, rollingAccuracy, synthesisUnlocked } }
  topicCompetence: {},
  // Per-topic adaptive timer state (homeostat)
  // { [topic]: { synthesisAdjust: 0, tightenedThisSession: false } }
  timerState: {},
};

function safeParse(json) {
  try { return JSON.parse(json); } catch (e) { return null; }
}

function _getSaveKey() {
  try {
    return getUserSaveKey();
  } catch (e) {
    return LEGACY_SAVE_KEY;
  }
}

export function loadState() {
  const key = _getSaveKey();
  const raw = safeParse(localStorage.getItem(key));
  if (!raw) return {...DEFAULT_STATE};

  const merged = {...DEFAULT_STATE, ...raw};

  if (raw.equip) merged.equip = {...DEFAULT_STATE.equip, ...raw.equip};
  if (raw.inv) merged.inv = {...DEFAULT_STATE.inv, ...raw.inv};
  merged.performanceByTopic = {...DEFAULT_STATE.performanceByTopic, ...(raw.performanceByTopic||{})};
  merged.missedQuestionIds = Array.isArray(raw.missedQuestionIds)? [...new Set(raw.missedQuestionIds)] : [];
  merged.lastSeen = {...DEFAULT_STATE.lastSeen, ...(raw.lastSeen||{})};
  merged.nodeCompletion = {...DEFAULT_STATE.nodeCompletion, ...(raw.nodeCompletion||{})};
  merged.savedForLater  = Array.isArray(raw.savedForLater) ? [...new Set(raw.savedForLater)] : [];
  merged.topicCompetence = {...DEFAULT_STATE.topicCompetence, ...(raw.topicCompetence||{})};
  merged.timerState = {...DEFAULT_STATE.timerState, ...(raw.timerState||{})};

  return merged;
}

export function saveState(state) {
  const key = _getSaveKey();
  try {
    const safe = {
      ...state,
      equip: {...DEFAULT_STATE.equip, ...(state.equip||{})},
      inv: {...DEFAULT_STATE.inv, ...(state.inv||{})},
      performanceByTopic: {...(state.performanceByTopic||{})},
      missedQuestionIds: Array.isArray(state.missedQuestionIds) ? [...new Set(state.missedQuestionIds)] : [],
      lastSeen: {...DEFAULT_STATE.lastSeen, ...(state.lastSeen||{})},
    };
    localStorage.setItem(key, JSON.stringify(safe));
  } catch (e) {
    console.warn('Failed to save state', e);
  }
}

export function updateRecallStats(questionId, result) {
  const state = loadState();
  if (!state.recallStats) state.recallStats = {};

  const prev = state.recallStats[questionId] || {
    attempts: 0,
    bestScore: 0,
    lastAttempt: 0,
    capturedPoints: [],
    missedCounts: {},
    persistentlyMissed: [],
  };

  prev.attempts += 1;
  prev.bestScore = Math.max(prev.bestScore, result.score || 0);
  prev.lastAttempt = Date.now();

  const captured = (result.captured || []).map(c => c.point_id);
  prev.capturedPoints = [...new Set([...prev.capturedPoints, ...captured])];

  const missed = (result.missed || []).map(m => m.point_id);
  for (const pid of missed) {
    prev.missedCounts[pid] = (prev.missedCounts[pid] || 0) + 1;
  }
  // Reset miss count for points that were captured this time
  for (const pid of captured) {
    if (prev.missedCounts[pid]) prev.missedCounts[pid] = 0;
  }

  prev.persistentlyMissed = Object.entries(prev.missedCounts)
    .filter(([, count]) => count >= 3)
    .map(([pid]) => pid);

  state.recallStats[questionId] = prev;
  saveState(state);

  return prev;
}

/**
 * Timer homeostat: adapt synthesis timer toward the just-in-time band.
 *
 * @param {string} topic - question topic
 * @param {number} timeRemaining - seconds left when submitted (0 = timeout)
 * @param {number} totalTime - total seconds on the clock for this question
 * @param {number} score - graded score 0-100
 * @param {number} passingScore - rubric minimum passing score
 * @param {boolean} isTimeout - true if the submission was forced by timer expiry
 */
export function updateTimerHomeostat(topic, timeRemaining, totalTime, score, passingScore, isTimeout) {
  if (!topic) return;
  const state = loadState();
  if (!state.timerState) state.timerState = {};

  const ts = state.timerState[topic] || {
    synthesisAdjust: 0,
    tightenedThisSession: false,
  };

  const pctRemaining = totalTime > 0 ? (timeRemaining / totalTime) : 0;
  const passed = score >= passingScore;

  if (isTimeout || (pctRemaining < 0.10 && !passed)) {
    // TOO TIGHT — sharp loosening
    ts.synthesisAdjust = Math.min(
      RECALL_TIMER_CEILING - RECALL_TIMER_FLOOR, // max positive adjust
      ts.synthesisAdjust + TIMER_LOOSEN_STEP
    );
  } else if (pctRemaining > 0.33 && passed && !ts.tightenedThisSession) {
    // TOO LOOSE — governed tightening, once per session, post-win only
    ts.synthesisAdjust = Math.max(
      -(RECALL_TIMER_CEILING - RECALL_TIMER_FLOOR), // max negative adjust
      ts.synthesisAdjust - TIMER_TIGHTEN_STEP
    );
    ts.tightenedThisSession = true;
  }
  // else: IN THE BAND — no change

  state.timerState[topic] = ts;
  saveState(state);
  return ts;
}

/**
 * Reset tightenedThisSession for all topics. Call at session start.
 */
export function resetSessionTimerFlags() {
  const state = loadState();
  if (!state.timerState) return;
  for (const topic of Object.keys(state.timerState)) {
    state.timerState[topic].tightenedThisSession = false;
  }
  saveState(state);
}

export function updateTopicCompetence(topic, tier, score) {
  if (tier !== 'atom') return; // only atom scores gate synthesis
  const state = loadState();
  if (!state.topicCompetence) state.topicCompetence = {};

  const tc = state.topicCompetence[topic] || {
    atomAttempts: 0,
    atomAccuracySum: 0,
    rollingAccuracy: 0,
    synthesisUnlocked: false,
  };

  tc.atomAttempts += 1;
  tc.atomAccuracySum += score;
  tc.rollingAccuracy = Math.round(tc.atomAccuracySum / tc.atomAttempts);
  if (tc.rollingAccuracy >= SYNTHESIS_UNLOCK_THRESHOLD && tc.atomAttempts >= 2) {
    tc.synthesisUnlocked = true;
  }

  state.topicCompetence[topic] = tc;
  saveState(state);
  return tc;
}

export function clearState() {
  const key = _getSaveKey();
  localStorage.removeItem(key);
}

export function migrateState(raw) {
  if (!raw) return {...DEFAULT_STATE};
  const migrated = loadState();
  return migrated;
}
