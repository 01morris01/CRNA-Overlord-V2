import { startRun as engineStartRun, submitAnswer as engineSubmitAnswer, getCurrentRun } from './core/gameEngine.js';
import { showMap, createSimpleCourseMap, startStudySessionForNode, SESSION_SIZE } from './ui/menus.js';
import { updateHUD, renderCurrentQuestion, hideFeedback, stopTimer, showAnswerFeedback, addQuestionTime, resumeQuestionTimer } from './ui/gameUI.js';
import { gradeAnswer } from './core/answerGrading.js';
import { getQuestionsForNode } from './core/questionEngine.js';
import { getNodeConfig } from './core/nodeConfig.js';
import { loadState, saveState } from './core/state.js';

// Track which engine is currently active
window.usingNewEngine = false;

// Capture legacy functions before any overrides
const mapRuntime = {
  startGame:        window.startGame,
  submitType:       window.submitType,
  openStore:        window.openStore,
  closeStore:       window.closeStore,
  pauseGame:        window.pauseGame,
  resumeGame:       window.resumeGame,
  quitToMap:        window.quitToMap,
  usePwr:           window.usePwr,
  closeLvl:         window.closeLvl,
  backToMap:        window.backToMap,
  restart:          window.restart,
  startStudySession: window.startStudySession, // captured before our override
};

function maybeAssign(fnName, fnImpl) {
  if (typeof mapRuntime[fnName] === 'function') {
    window[fnName] = mapRuntime[fnName];
  } else {
    window[fnName] = fnImpl;
  }
}

// Expose engine functions globally
window.engineStartRun        = engineStartRun;
window.renderCurrentQuestion = renderCurrentQuestion;
window.updateHUD             = updateHUD;

// ─── Store item definitions ───────────────────────────────────────────────────
// Mirrors legacy STORE_ITEMS (which is a const closure, not accessible from module).
const _STORE_ITEMS = [
  { id:'shield', name:'Ventilator',        icon:'🫁', cost:800,  desc:'SHIELD — Next wrong answer costs no life. The vent breathes so your patient doesn\'t die from your stupidity.',  equipKey:'vent'   },
  { id:'skip',   name:'MAC Blade',          icon:'🔪', cost:1200, desc:'SKIP — Skip any question, no penalty. Because sometimes you just gotta intubate and move on.',                   equipKey:'mac'    },
  { id:'reveal', name:'Video Laryngoscope', icon:'📺', cost:600,  desc:'REVEAL — Eliminates one wrong MCQ answer or shows extra hint. Better view = better decisions.',                  equipKey:'vl'     },
  { id:'time',   name:'Bougie',             icon:'🔧', cost:400,  desc:'+TIME — Adds 15 seconds. Like a bougie, it buys you time when shit gets tight.',                                  equipKey:'bougie' },
];

/** Render the store grid using state.js as source of truth (bypasses stale legacy bankedPts). */
function _renderStoreGrid(state) {
  const g = document.getElementById('store-grid');
  if (!g) return;
  const pts = state.bankedPts || 0;
  const inv = state.inv || {};

  const ptsEl = document.getElementById('store-pts-val');
  if (ptsEl) ptsEl.textContent = pts.toLocaleString();

  g.innerHTML = '';
  _STORE_ITEMS.forEach(item => {
    const canBuy = pts >= item.cost;
    const d = document.createElement('div');
    d.className = 'store-item';
    d.innerHTML = `<span class="si-icon">${item.icon}</span><div class="si-name">${item.name}</div><div class="si-desc">${item.desc}</div><div class="si-cost">${item.cost} pts</div><button class="si-buy" ${canBuy ? '' : 'disabled'} onclick="buyItem('${item.id}')">BUY</button><div class="si-owned">Owned: ${inv[item.id] || 0}</div>`;
    g.appendChild(d);
  });
}

// ─── Node-to-topic mapping ────────────────────────────────────────────────────
// Maps legacy topic IDs (used by course map markers) to NODE_CONFIG node IDs.
const TOPIC_TO_NODE = {
  'ba-t09': { courseId: 'basics-of-anesthesia', nodeId: 'node-9'  },
  'ba-t10': { courseId: 'basics-of-anesthesia', nodeId: 'node-10' },
  'ba-t11': { courseId: 'basics-of-anesthesia', nodeId: 'node-11' },
};

// Pending mapping stored by selectTopic, consumed by startStudySession.
let _pendingNodeMapping = null;

/** Show a node preview panel in #mode-container when a known node is selected. */
function _renderNodePreview(topicId) {
  const mapping = TOPIC_TO_NODE[topicId];
  if (!mapping) return;
  const cfg = getNodeConfig(mapping.nodeId);
  if (!cfg) return;

  const container = document.getElementById('mode-container');
  const grid      = document.getElementById('mode-grid');
  if (!container || !grid) return;

  grid.style.gridTemplateColumns = '1fr';
  grid.innerHTML = '';

  const info = document.createElement('div');
  info.style.cssText = 'background:rgba(255,150,0,.08);border:1px solid rgba(255,150,0,.25);border-radius:6px;padding:.8rem 1rem;color:#ffaa00;font-family:monospace;';
  info.innerHTML = `
    <div style="font-size:.95rem;font-weight:900;margin-bottom:.3rem;">${cfg.icon || '📚'} ${cfg.title}</div>
    <div style="color:#888;font-size:.7rem;">${cfg.chapterLabel} &nbsp;·&nbsp; ${cfg.badgeLabel}</div>
    <div style="color:#4af;font-size:.75rem;margin-top:.5rem;">📝 Session: ${SESSION_SIZE} questions</div>
    <div style="color:#666;font-size:.65rem;margin-top:.2rem;">Click ⚡ START STUDY SESSION ⚡ below</div>
  `;
  grid.appendChild(info);
  container.style.display = 'block';
}

function _hideNodePreview() {
  const container = document.getElementById('mode-container');
  if (container) container.style.display = 'none';
}

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
  _pendingNodeMapping   = null;
  _hideNodePreview();

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
  _syncPwrBtns();

  return run;
};

/**
 * Sync powerup button UI from state.js.
 * Legacy updatePwrBtns() reads the legacy `inv` closure; this reads state.js instead.
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
    isCorrect = true; // UI already showed INCORRECT; engine counts as correct (no life lost)
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
    nc[nodeId].seen        += totalCount;
    nc[nodeId].correct     += correctCount;
    nc[nodeId].totalInBank  = totalInBank;
    state.nodeCompletion    = nc;
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

// ─── startGame ────────────────────────────────────────────────────────────────
// Delegate to legacy startGame which loads state (bankedPts, inv, equip) from
// localStorage and correctly shows the Courses screen (#course-selector).
//
window.startGame = function() {
  if (typeof mapRuntime.startGame === 'function') {
    mapRuntime.startGame();
  }
};

// ─── selectTopic ─────────────────────────────────────────────────────────────
// Map markers call selectTopic(topicId). For known nodes, show a node preview
// and store the pending mapping — do NOT launch immediately.
// startStudySession (bound to the Start button) picks up the mapping.
//
const _legacySelectTopic = window.selectTopic;

window.selectTopic = function(topicId) {
  const mapping = TOPIC_TO_NODE[topicId];

  if (mapping) {
    console.log('[SHIM] selectTopic', topicId, '→', mapping.nodeId, '(preview)');
    _pendingNodeMapping = mapping;
    _renderNodePreview(topicId);
    // Also call legacy so it sets selectedTopicId and shows the Start button
    if (typeof _legacySelectTopic === 'function') _legacySelectTopic(topicId);
    return;
  }

  // No question bank yet — standard legacy behavior (visual selection + Start button)
  _pendingNodeMapping = null;
  _hideNodePreview();
  if (typeof _legacySelectTopic === 'function') _legacySelectTopic(topicId);
};

// ─── startStudySession ───────────────────────────────────────────────────────
// Called when the user clicks ⚡ START STUDY SESSION ⚡.
// If a pending node mapping exists (set by selectTopic for known nodes), route
// to the correct question bank. Otherwise fall through to legacy.
//
window.startStudySession = function() {
  if (_pendingNodeMapping) {
    const { courseId, nodeId } = _pendingNodeMapping;
    _pendingNodeMapping = null;
    _hideNodePreview();
    console.log('[SHIM] startStudySession →', nodeId);
    startStudySessionForNode(courseId, nodeId);
    return;
  }
  // No mapping — legacy handles unmapped topics (or falls through to ALL_QS)
  if (typeof mapRuntime.startStudySession === 'function') {
    mapRuntime.startStudySession();
  }
};

// ─── usePwr ──────────────────────────────────────────────────────────────────
// Legacy usePwr crashes when G is null (new engine). New engine path uses state.js.
//
const _legacyUsePwr = mapRuntime.usePwr;

window.usePwr = function(type) {
  if (!window.usingNewEngine) {
    if (typeof _legacyUsePwr === 'function') _legacyUsePwr(type);
    return;
  }

  const run = getCurrentRun();
  if (!run || run.done) return;

  const state = loadState();
  const inv   = state.inv || { shield: 0, skip: 0, reveal: 0, time: 0 };
  if ((inv[type] || 0) <= 0) return;

  inv[type]--;
  state.inv = inv;
  saveState(state);
  _syncPwrBtns();

  const q = run.questions[run.index];

  if (type === 'skip') {
    console.log('[POWERUP] Skip');
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
    console.log('[POWERUP] Reveal');
    if (q && q.type === 'mcq') {
      const ansGrid = document.getElementById('ans-grid');
      if (ansGrid) {
        const btns = Array.from(ansGrid.querySelectorAll('.abtn'));
        const wrongBtns = btns.filter((b, i) =>
          q._shuffledAns && !q._shuffledAns[i]?.ok && !b.disabled && !b.classList.contains('elim')
        );
        if (wrongBtns.length > 0) {
          wrongBtns[0].disabled = true;
          wrongBtns[0].classList.add('elim');
        }
      }
    }

  } else if (type === 'shield') {
    console.log('[POWERUP] Shield armed');
    run._shieldActive = true;

  } else if (type === 'time') {
    console.log('[POWERUP] +Time');
    addQuestionTime(15);
  }
};

// ─── openStore ───────────────────────────────────────────────────────────────
// Direct override so new engine gets state.js bankedPts and timer is stopped.
// For legacy engine: call legacy openStore (handles G timer pause) then patch display.
//
window.openStore = function() {
  const modal = document.getElementById('store-modal');
  if (modal) modal.classList.add('on');

  if (window.usingNewEngine) {
    stopTimer(); // prevent timeout firing while browsing store
    _renderStoreGrid(loadState());
  } else {
    // Legacy: pause legacy timer + render store
    if (typeof mapRuntime.openStore === 'function') mapRuntime.openStore();
    // Patch pts display to reflect state.js bankedPts (catches cross-session drift)
    const state = loadState();
    const ptsEl = document.getElementById('store-pts-val');
    if (ptsEl) ptsEl.textContent = (state.bankedPts || 0).toLocaleString();
  }
};

// ─── closeStore ──────────────────────────────────────────────────────────────
// Bug 3 fix: for new engine, close modal only — do NOT navigate.
// For legacy engine, call legacy closeStore (handles timer resume + navigation).
//
window.closeStore = function() {
  const modal = document.getElementById('store-modal');
  if (modal) modal.classList.remove('on');

  if (window.usingNewEngine) {
    // Resume timer from where it was — game continues underneath
    resumeQuestionTimer();
  } else {
    if (typeof mapRuntime.closeStore === 'function') mapRuntime.closeStore();
  }
};

// ─── buyItem ─────────────────────────────────────────────────────────────────
// Bug 1 fix: use state.js as source of truth so points earned during new engine
// sessions are immediately spendable, regardless of legacy bankedPts stale state.
//
window.buyItem = function(id) {
  const item = _STORE_ITEMS.find(i => i.id === id);
  if (!item) return;

  const state = loadState();
  const pts   = state.bankedPts || 0;
  if (pts < item.cost) return;

  state.bankedPts -= item.cost;
  state.inv        = state.inv  || { shield: 0, skip: 0, reveal: 0, time: 0 };
  state.equip      = state.equip || { vent: false, mac: false, vl: false, bougie: false };
  state.inv[id]            = (state.inv[id] || 0) + 1;
  state.equip[item.equipKey] = true;
  saveState(state);

  _renderStoreGrid(state);
  _syncPwrBtns();
};

// ─── pauseGame / resumeGame ──────────────────────────────────────────────────

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
    renderCurrentQuestion(); // re-renders scene + restarts timer
  } else if (typeof mapRuntime.resumeGame === 'function') {
    mapRuntime.resumeGame();
  }
};

// ─── quitToMap ───────────────────────────────────────────────────────────────
// Bug 4 fix: for new engine, return to the SPECIFIC course map (showTopicMap),
// not the all-courses screen (showCourseSelector).
// selectedCourseId is preserved in legacy's closure from when the user selected
// the course — showTopicMap() uses it to re-render the correct map.
//
window.quitToMap = function() {
  if (window.usingNewEngine) {
    stopTimer();
    const nodeId = window.currentSession?.nodeId;
    const cfg    = nodeId ? getNodeConfig(nodeId) : null;
    if (cfg?.stopSceneName && typeof window[cfg.stopSceneName] === 'function') {
      window[cfg.stopSceneName]();
    } else if (typeof window.stopOpioidScene === 'function') {
      window.stopOpioidScene();
    }
    window.usingNewEngine = false;
    _pendingNodeMapping   = null;

    const overlay = document.getElementById('pause-overlay');
    const game    = document.getElementById('game');
    const go      = document.getElementById('go');
    if (overlay) overlay.classList.remove('on');
    if (game)    game.style.display = 'none';
    if (go)      go.classList.remove('on');

    // Return to the specific course map (not all-courses screen)
    if (typeof window.showTopicMap === 'function') {
      window.showTopicMap();
    } else if (typeof window.showCourseSelector === 'function') {
      window.showCourseSelector(); // fallback
    }
  } else if (typeof mapRuntime.quitToMap === 'function') {
    mapRuntime.quitToMap();
  }
};

// ─── misc navigation ─────────────────────────────────────────────────────────

maybeAssign('closeLvl', function() {
  const s = document.getElementById('lvl-screen');
  if (s) s.classList.remove('on');
});

maybeAssign('backToMap', function() {
  const game = document.getElementById('game');
  const go   = document.getElementById('go');
  if (game) game.style.display = 'none';
  if (go)   go.classList.remove('on');
  if (typeof window.showCourseSelector === 'function') window.showCourseSelector();
});

maybeAssign('restart', function() {
  const go = document.getElementById('go');
  if (go) go.classList.remove('on');
  window.usingNewEngine = false;
  if (typeof window.showCourseSelector === 'function') window.showCourseSelector();
});

// Initialize the course map node list (used by #level-map, kept for compat)
createSimpleCourseMap();
