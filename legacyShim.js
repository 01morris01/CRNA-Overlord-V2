import { startRun as engineStartRun, submitAnswer as engineSubmitAnswer, getCurrentRun } from './core/gameEngine.js';
import { showMap, createSimpleCourseMap, startStudySessionForNode } from './ui/menus.js';
import { updateHUD, renderCurrentQuestion, hideFeedback, stopTimer, showAnswerFeedback, addQuestionTime } from './ui/gameUI.js';
import { gradeAnswer } from './core/answerGrading.js';
import { getQuestionsForNode } from './core/questionEngine.js';
import { getNodeConfig } from './core/nodeConfig.js';
import { loadState, saveState } from './core/state.js';

// Track which engine is currently active
window.usingNewEngine = false;

// Capture legacy functions before any overrides
const mapRuntime = {
  startGame: window.startGame,
  submitType: window.submitType,
  openStore: window.openStore,
  closeStore: window.closeStore,
  pauseGame: window.pauseGame,
  resumeGame: window.resumeGame,
  quitToMap: window.quitToMap,
  usePwr: window.usePwr,
  closeLvl: window.closeLvl,
  backToMap: window.backToMap,
  restart: window.restart,
};

function maybeAssign(fnName, fnImpl) {
  if (typeof mapRuntime[fnName] === 'function') {
    window[fnName] = mapRuntime[fnName];
  } else {
    window[fnName] = fnImpl;
  }
}

// Expose engine functions globally
window.engineStartRun = engineStartRun;
window.renderCurrentQuestion = renderCurrentQuestion;
window.updateHUD = updateHUD;

/**
 * Start a game with specific questions (new engine path).
 * Called by startStudySessionForNode for all nodes.
 */
window.startGameWithQuestions = function(questions) {
  if (!questions || questions.length === 0) {
    console.error('No questions provided to startGameWithQuestions');
    return;
  }

  window.usingNewEngine = true;

  // Stop any running scene / timer from a previous session
  if (typeof window.stopLegacyScene === 'function') window.stopLegacyScene();
  if (typeof window.stopOpioidScene  === 'function') window.stopOpioidScene();
  if (typeof window.stopNMBScene     === 'function') window.stopNMBScene();
  if (typeof window.stopAnesthesiaMachineScene === 'function') window.stopAnesthesiaMachineScene();
  stopTimer();

  console.log('COURSE:', window.currentSession?.courseId);
  console.log('NODE:',   window.currentSession?.nodeId);
  console.log('QUESTION COUNT:', questions.length);
  console.log('FIRST QUESTION:', questions[0]);

  const run = engineStartRun({ mode: 'lesson', questions, lives: 3 });

  // Hide all entry screens, show game
  const splash         = document.getElementById('splash');
  const courseSelector = document.getElementById('course-selector');
  const levelMap       = document.getElementById('level-map');
  const game           = document.getElementById('game');

  if (splash)         splash.style.display        = 'none';
  if (courseSelector) courseSelector.style.display = 'none';
  if (levelMap)       levelMap.classList.remove('on');
  if (game)           game.style.display           = 'flex';

  // Init HUD counters
  const qn       = document.getElementById('qn');
  const qt       = document.getElementById('qt');
  const lvlBadge = document.getElementById('lvl-b');
  const progFill = document.getElementById('prog-fill');
  if (qn)       qn.textContent  = '1';
  if (qt)       qt.textContent  = questions.length;
  if (lvlBadge) {
    const nodeId = window.currentSession?.nodeId;
    const cfg    = nodeId ? getNodeConfig(nodeId) : null;
    lvlBadge.textContent = cfg ? `${cfg.title.toUpperCase()} ${cfg.chapterLabel}` : 'STUDY SESSION';
  }
  if (progFill) progFill.style.width = '0%';

  renderCurrentQuestion();
  updateHUD();

  // Sync powerup button counts from state
  _syncPwrBtns();

  return run;
};

/**
 * Sync powerup button UI from state.js (used by new engine path).
 * The legacy updatePwrBtns() reads its own `inv` closure — this reads state.js instead.
 */
function _syncPwrBtns() {
  const state = loadState();
  const inv = state.inv || { shield: 0, skip: 0, reveal: 0, time: 0 };
  ['shield', 'skip', 'reveal', 'time'].forEach(p => {
    const btn = document.getElementById('pw-' + p);
    const cnt = document.getElementById('pc-' + p);
    if (cnt) cnt.textContent = inv[p] || 0;
    if (btn) btn.classList.toggle('has', (inv[p] || 0) > 0);
  });
}

/**
 * Unified nextQ — dispatches to new engine or legacy engine.
 */
const _legacyNextQ = window.nextQ;
window.nextQ = function() {
  if (window.usingNewEngine) {
    hideFeedback();

    const run = getCurrentRun();
    if (!run) return;

    if (run.done) {
      _showNewEngineGameOver(run);
      return;
    }

    renderCurrentQuestion();
    updateHUD();

    const q = run.questions[run.index];
    if (q) console.log('QUESTION TYPE:', q.type, '| id:', q.id);
  } else {
    if (typeof _legacyNextQ === 'function') _legacyNextQ();
  }
};

/**
 * Submit answer — handles shield flag before delegating to engine.
 */
window.submitAnswer = function(isCorrect) {
  const run = getCurrentRun();

  // Shield: absorb wrong answer so no life is lost
  if (!isCorrect && run && run._shieldActive) {
    run._shieldActive = false;
    isCorrect = true; // engine counts as correct (no life lost); UI already showed INCORRECT
    console.log('[SHIELD] activated — wrong answer absorbed');
  }

  const result = engineSubmitAnswer(isCorrect);
  updateHUD();

  if (run) {
    const progress = (run.index / run.questions.length) * 100;
    const progFill = document.getElementById('prog-fill');
    if (progFill) progFill.style.width = `${progress}%`;

    const qn = document.getElementById('qn');
    const qt = document.getElementById('qt');
    if (qn) qn.textContent = run.index + 1;
    if (qt) qt.textContent = run.questions.length;
  }

  return result;
};

maybeAssign('submitType', function() {
  const input = document.getElementById('type-input');
  const run = getCurrentRun();
  if (!run || !run.questions || run.index >= run.questions.length) return;
  const q = run.questions[run.index];
  if (!q) return;

  const result = gradeAnswer(input.value, q);
  engineSubmitAnswer(result.correct);
  renderCurrentQuestion();
  updateHUD();
  return result.correct;
});

/**
 * Show game over + update node completion in state.
 */
function _showNewEngineGameOver(run) {
  const go    = document.getElementById('go');
  const goT   = document.getElementById('go-t');
  const goS   = document.getElementById('go-s');
  const goPts = document.getElementById('go-pts');

  if (!go) return;
  go.classList.add('on');

  const correctCount = run.results.filter(r => r.correct).length;
  const totalCount   = run.results.length;
  const pct          = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // Update node completion in state
  const nodeId      = window.currentSession?.nodeId;
  const totalInBank = window.currentSession?.totalInBank || totalCount;
  let nodeCompLine  = '';

  if (nodeId) {
    const state = loadState();
    const nc    = state.nodeCompletion || {};
    if (!nc[nodeId]) nc[nodeId] = { seen: 0, correct: 0, totalInBank };
    nc[nodeId].seen      += totalCount;
    nc[nodeId].correct   += correctCount;
    nc[nodeId].totalInBank = totalInBank; // update if bank grew
    state.nodeCompletion  = nc;
    saveState(state);

    const exposurePct = Math.min(100, Math.round((nc[nodeId].seen / totalInBank) * 100));
    nodeCompLine = `Node exposure: ${exposurePct}% (${nc[nodeId].seen}/${totalInBank} seen)`;
  }

  if (run.lives > 0) {
    if (goT) goT.textContent = 'SESSION COMPLETE';
    if (goS) goS.textContent = `${correctCount}/${totalCount} correct (${pct}%)${nodeCompLine ? ' — ' + nodeCompLine : ''}`;
  } else {
    if (goT) goT.textContent = 'PATIENT DECEASED';
    if (goS) goS.textContent = `${correctCount}/${totalCount} correct${nodeCompLine ? ' — ' + nodeCompLine : ''}`;
  }

  if (goPts) goPts.textContent = run.score.toLocaleString();
}

// ─── startGame: delegate to legacy (loads state → shows Courses screen) ─────
//
// Legacy startGame correctly shows #course-selector (Courses screen).
// It also loads inv/equip/bankedPts from localStorage into legacy closure vars.
// We just call it directly — no redirect needed.
//
window.startGame = function() {
  if (typeof mapRuntime.startGame === 'function') {
    mapRuntime.startGame();
  }
};

// ─── selectTopic: route known nodes through startStudySessionForNode ──────────
//
// Map markers call selectTopic(topicId) on click. Legacy selectTopic only
// stores the ID and shows a visual selection + Start button. startStudySession()
// then only special-cases ba-t09 for the new engine; ba-t10/ba-t11 fall back
// to legacy ALL_QS.
//
// This override intercepts clicks on topics that have a question bank in
// NODE_CONFIG and immediately launches the correct session — same path used
// by the node-list buttons. Topics without question banks fall through to
// legacy behavior (visual selection + Start button).
//
const TOPIC_TO_NODE = {
  'ba-t09': { courseId: 'basics-of-anesthesia', nodeId: 'node-9'  },
  'ba-t10': { courseId: 'basics-of-anesthesia', nodeId: 'node-10' },
  'ba-t11': { courseId: 'basics-of-anesthesia', nodeId: 'node-11' },
};

const _legacySelectTopic = window.selectTopic;

window.selectTopic = function(topicId) {
  const mapping = TOPIC_TO_NODE[topicId];
  if (mapping) {
    console.log('[SHIM] selectTopic', topicId, '→', mapping.nodeId);
    startStudySessionForNode(mapping.courseId, mapping.nodeId);
    return;
  }
  // No question bank for this topic yet — fall through to legacy (shows selection UI)
  if (typeof _legacySelectTopic === 'function') {
    _legacySelectTopic(topicId);
  }
};

// ─── usePwr: works for both legacy and new engine ───────────────────────────
//
// Legacy usePwr checks G.done but G is null when new engine is active → crash.
// New engine path reads/writes state.js inv directly.
//
const _legacyUsePwr = mapRuntime.usePwr;

window.usePwr = function(type) {
  if (!window.usingNewEngine) {
    // Legacy engine path — original function handles everything
    if (typeof _legacyUsePwr === 'function') _legacyUsePwr(type);
    return;
  }

  // ── New engine path ──────────────────────────────────────────────────────
  const run = getCurrentRun();
  if (!run || run.done) return;

  const state = loadState();
  const inv   = state.inv || { shield: 0, skip: 0, reveal: 0, time: 0 };

  if ((inv[type] || 0) <= 0) return; // nothing to use

  inv[type]--;
  state.inv = inv;
  saveState(state);
  _syncPwrBtns();

  const q = run.questions[run.index];

  if (type === 'skip') {
    // Skip advances without penalty — count as correct so no life lost
    console.log('[POWERUP] Skip used');
    run.index++;
    run.results.push({ questionId: q?.id, correct: true, skipped: true, timestamp: Date.now() });
    if (run.index >= run.questions.length) run.done = true;
    hideFeedback();
    if (run.done) {
      _showNewEngineGameOver(run);
    } else {
      renderCurrentQuestion();
      updateHUD();
    }

  } else if (type === 'reveal') {
    // Eliminate one wrong MCQ answer
    console.log('[POWERUP] Reveal used');
    if (q && q.type === 'mcq') {
      const ansGrid = document.getElementById('ans-grid');
      if (ansGrid) {
        const btns = Array.from(ansGrid.querySelectorAll('.abtn'));
        const wrongBtns = btns.filter((b, i) => {
          return q._shuffledAns && !q._shuffledAns[i]?.ok && !b.disabled && !b.classList.contains('elim');
        });
        if (wrongBtns.length > 0) {
          wrongBtns[0].disabled = true;
          wrongBtns[0].classList.add('elim');
        }
      }
    }

  } else if (type === 'shield') {
    // Next wrong answer absorbs — flag checked in submitAnswer
    console.log('[POWERUP] Shield armed');
    run._shieldActive = true;

  } else if (type === 'time') {
    // Add 15 seconds to the running timer
    console.log('[POWERUP] +Time used');
    addQuestionTime(15);
  }
};

// ─── remaining game management functions ────────────────────────────────────

maybeAssign('openStore', function() {
  const modal = document.getElementById('store-modal');
  if (modal) modal.classList.add('on');
});

maybeAssign('closeStore', function() {
  const modal = document.getElementById('store-modal');
  if (modal) modal.classList.remove('on');
});

window.pauseGame = function() {
  if (window.usingNewEngine) {
    stopTimer();
    const nodeId = window.currentSession?.nodeId;
    const cfg    = nodeId ? getNodeConfig(nodeId) : null;
    if (cfg?.stopSceneName && typeof window[cfg.stopSceneName] === 'function') {
      window[cfg.stopSceneName]();
    } else if (typeof window.stopOpioidScene === 'function') {
      window.stopOpioidScene();
    }
    const overlay = document.getElementById('pause-overlay');
    if (overlay) overlay.classList.add('on');
  } else if (typeof mapRuntime.pauseGame === 'function') {
    mapRuntime.pauseGame();
  }
};

window.resumeGame = function() {
  const overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.classList.remove('on');
  if (window.usingNewEngine) {
    renderCurrentQuestion();
  } else if (typeof mapRuntime.resumeGame === 'function') {
    mapRuntime.resumeGame();
  }
};

// Direct override (not maybeAssign) so this runs for both engines.
// Legacy quitToMap would call showTopicMap/showCombinedStudyScreen which is
// fine for pure legacy sessions, but for new engine we need proper cleanup.
window.quitToMap = function() {
  if (window.usingNewEngine) {
    // New engine path: stop timer + scene, then return to course map
    stopTimer();
    const nodeId = window.currentSession?.nodeId;
    const cfg    = nodeId ? getNodeConfig(nodeId) : null;
    if (cfg?.stopSceneName && typeof window[cfg.stopSceneName] === 'function') {
      window[cfg.stopSceneName]();
    } else if (typeof window.stopOpioidScene === 'function') {
      window.stopOpioidScene();
    }
    window.usingNewEngine = false;
    const overlay = document.getElementById('pause-overlay');
    const game    = document.getElementById('game');
    const go      = document.getElementById('go');
    if (overlay) overlay.classList.remove('on');
    if (game)    game.style.display = 'none';
    if (go)      go.classList.remove('on');
    if (typeof window.showCourseSelector === 'function') window.showCourseSelector();
  } else if (typeof mapRuntime.quitToMap === 'function') {
    // Legacy engine path: use original (handles save + topic map navigation)
    mapRuntime.quitToMap();
  }
};

maybeAssign('closeLvl', function() {
  const s = document.getElementById('lvl-screen');
  if (s) s.classList.remove('on');
});

maybeAssign('backToMap', function() {
  const game = document.getElementById('game');
  const go   = document.getElementById('go');
  if (game) game.style.display = 'none';
  if (go)   go.classList.remove('on');
  // Show courses screen (restores full Name→Courses→Map→Node flow)
  if (typeof window.showCourseSelector === 'function') window.showCourseSelector();
});

maybeAssign('restart', function() {
  const go = document.getElementById('go');
  if (go) go.classList.remove('on');
  window.usingNewEngine = false;
  // Return to courses screen so user can pick any node
  if (typeof window.showCourseSelector === 'function') window.showCourseSelector();
});

// Initialize the course map
createSimpleCourseMap();
