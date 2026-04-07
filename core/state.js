const SAVE_KEY = 'hemodynamic_overlord_save';

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
};

function safeParse(json) {
  try { return JSON.parse(json); } catch (e) { return null; }
}

export function loadState() {
  const raw = safeParse(localStorage.getItem(SAVE_KEY));
  if (!raw) return {...DEFAULT_STATE};

  const merged = {...DEFAULT_STATE, ...raw};

  if (raw.equip) merged.equip = {...DEFAULT_STATE.equip, ...raw.equip};
  if (raw.inv) merged.inv = {...DEFAULT_STATE.inv, ...raw.inv};
  merged.performanceByTopic = {...DEFAULT_STATE.performanceByTopic, ...(raw.performanceByTopic||{})};
  merged.missedQuestionIds = Array.isArray(raw.missedQuestionIds)? [...new Set(raw.missedQuestionIds)] : [];
  merged.lastSeen = {...DEFAULT_STATE.lastSeen, ...(raw.lastSeen||{})};
  merged.nodeCompletion = {...DEFAULT_STATE.nodeCompletion, ...(raw.nodeCompletion||{})};
  merged.savedForLater  = Array.isArray(raw.savedForLater) ? [...new Set(raw.savedForLater)] : [];

  return merged;
}

export function saveState(state) {
  try {
    const safe = {
      ...state,
      equip: {...DEFAULT_STATE.equip, ...(state.equip||{})},
      inv: {...DEFAULT_STATE.inv, ...(state.inv||{})},
      performanceByTopic: {...(state.performanceByTopic||{})},
      missedQuestionIds: Array.isArray(state.missedQuestionIds) ? [...new Set(state.missedQuestionIds)] : [],
      lastSeen: {...DEFAULT_STATE.lastSeen, ...(state.lastSeen||{})},
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(safe));
  } catch (e) {
    console.warn('Failed to save state', e);
  }
}

export function clearState() {
  localStorage.removeItem(SAVE_KEY);
}

export function migrateState(raw) {
  if (!raw) return {...DEFAULT_STATE};
  const migrated = loadState();
  return migrated;
}
