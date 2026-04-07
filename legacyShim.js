import { startRun as engineStartRun, submitAnswer as engineSubmitAnswer, getCurrentRun } from './core/gameEngine.js';
import { showMap, createSimpleCourseMap, startStudySessionForNode, SESSION_SIZE } from './ui/menus.js';
import { updateHUD, renderCurrentQuestion, hideFeedback, stopTimer, showAnswerFeedback, addQuestionTime, resumeQuestionTimer } from './ui/gameUI.js';
import { gradeAnswer } from './core/answerGrading.js';
import { getQuestionsForNode } from './core/questionEngine.js';
import { getNodeConfig } from './core/nodeConfig.js';
import { loadState, saveState } from './core/state.js';
import { showReviewPanel, hideReviewPanel, buildReviewSession, REVIEW_SESSION_SIZE } from './ui/reviewMode.js';

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
  'ba-t12': { courseId: 'basics-of-anesthesia', nodeId: 'node-11' },
};

// Pending mapping stored by selectTopic, consumed by startStudySession.
let _pendingNodeMapping = null;

/**
 * Public helper for world-map.js (non-module script).
 * Returns { seen, pct } if this topic maps to a new-engine node with seen > 0,
 * or null if the topic has no question bank or hasn't been visited yet.
 */
window.getNodeCompletionForTopic = function(topicId) {
  const mapping = TOPIC_TO_NODE[topicId];
  if (!mapping) return null;
  const state = loadState();
  const nc = (state.nodeCompletion || {})[mapping.nodeId];
  if (!nc || nc.seen <= 0) return null;
  const pct = nc.totalInBank > 0 ? Math.min(100, Math.round((nc.seen / nc.totalInBank) * 100)) : 0;
  return { seen: nc.seen, pct };
};

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

  const recallOn = !!loadState().recallFirstEnabled;
  info.innerHTML = `
    <div style="font-size:.95rem;font-weight:900;margin-bottom:.3rem;">${cfg.icon || '📚'} ${cfg.title}</div>
    <div style="color:#888;font-size:.7rem;">${cfg.chapterLabel} &nbsp;·&nbsp; ${cfg.badgeLabel}</div>
    <div style="color:#4af;font-size:.75rem;margin-top:.5rem;">📝 Session: ${SESSION_SIZE} questions</div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:.6rem;padding-top:.5rem;border-top:1px solid rgba(255,150,0,.15);">
      <div>
        <span style="font-size:.68rem;color:#888;letter-spacing:.05em;">Recall First</span>
        <div style="font-size:.58rem;color:#445;margin-top:.1rem;">See question before choices</div>
      </div>
      <button id="recall-toggle-btn" onclick="toggleRecallFirst()"
        style="font-size:.65rem;padding:.28rem .65rem;border-radius:3px;cursor:pointer;font-family:monospace;letter-spacing:.05em;
               background:${recallOn ? 'rgba(0,255,136,.15)' : 'rgba(30,30,50,.6)'};
               border:1px solid ${recallOn ? 'rgba(0,255,136,.5)' : 'rgba(80,80,120,.4)'};
               color:${recallOn ? '#00ff88' : '#555'};">
        ${recallOn ? '● ON' : '○ OFF'}
      </button>
    </div>
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
  hideReviewPanel();

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
  const go      = document.getElementById('go');
  const goT     = document.getElementById('go-t');
  const goS     = document.getElementById('go-s');
  const goPts   = document.getElementById('go-pts');
  const bonusEl = document.getElementById('go-bonus');

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

  // ── XP Improvement Bonus (follow-up sessions only) ────────────────────────
  if (bonusEl) bonusEl.style.display = 'none';
  const session = window.currentSession;
  if (session?.isFollowup && session.targetedConcepts?.length > 0) {
    const improved = [];
    const mastered = [];

    for (const concept of session.targetedConcepts) {
      const conceptQs = run.questions.filter(q => q.concept_tag === concept);
      if (conceptQs.length === 0) continue;
      const total   = conceptQs.length;
      const correct = run.results.filter(r =>
        r.correct && conceptQs.some(q => q.id === r.questionId)
      ).length;
      if (correct >= 2 || correct / total >= 0.7) {
        mastered.push(concept);
      } else if (correct >= 1) {
        improved.push(concept);
      }
    }

    const bonusXP = Math.min(100, improved.length * 25 + mastered.length * 50);
    if (bonusXP > 0) {
      run.score += bonusXP;
      const bstate = loadState();
      bstate.bankedPts = (bstate.bankedPts || 0) + bonusXP;
      saveState(bstate);

      if (bonusEl) {
        const lines = [
          `<div style="font-size:1.1rem;font-weight:900;color:#ffcc00;text-shadow:0 0 12px #ffaa00;">⚡ BONUS +${bonusXP}</div>`,
          ...mastered.map(c => `<div style="font-size:.7rem;color:#00ff88;letter-spacing:.1em;">👑 MASTERED: ${c}</div>`),
          ...improved.map(c => `<div style="font-size:.7rem;color:#4af;letter-spacing:.1em;">🧠 IMPROVED: ${c}</div>`),
        ];
        bonusEl.innerHTML = lines.join('');
        bonusEl.style.display = 'flex';
      }
    }
  }

  if (goPts) goPts.textContent = run.score.toLocaleString();

  // Refresh the #level-map node list so completion status reflects this session
  createSimpleCourseMap();

  // ── Follow-up actions ──────────────────────────────────────────────────────
  const followup   = document.getElementById('go-followup');
  const retryBtn   = document.getElementById('go-retry-btn');
  const saveBtn    = document.getElementById('go-save-btn');
  const rematchBtn = document.getElementById('go-rematch-btn');

  if (followup) {
    const missedCount = run.results.filter(r => !r.correct && !r.skipped).length;

    // Retry Missed — only useful when there are wrong answers
    if (retryBtn) {
      if (missedCount > 0) {
        retryBtn.style.display = '';
        retryBtn.textContent   = `🔁 RETRY MISSED (${missedCount})`;
        retryBtn.disabled      = false;
      } else {
        retryBtn.style.display = 'none';
      }
    }

    // Review Weakest — show when ≥1 missed question has a concept_tag
    const weakBtn = document.getElementById('go-weak-btn');
    if (weakBtn) {
      const conceptsWithMisses = new Set(
        run.results
          .filter(r => !r.correct && !r.skipped)
          .map(r => run.questions.find(q => q.id === r.questionId)?.concept_tag)
          .filter(Boolean)
      );
      if (conceptsWithMisses.size >= 1) {
        weakBtn.style.display = '';
        weakBtn.disabled      = false;
      } else {
        weakBtn.style.display = 'none';
      }
    }

    // Save for Later — only when there are wrong answers
    if (saveBtn) {
      if (missedCount > 0) {
        saveBtn.style.display = '';
        saveBtn.textContent   = '📌 SAVE FOR LATER';
        saveBtn.disabled      = false;
      } else {
        saveBtn.style.display = 'none';
      }
    }

    // Quick Rematch always available
    if (rematchBtn) rematchBtn.disabled = false;

    followup.style.display = 'flex';
  }
}

// ─── Follow-up action handlers ───────────────────────────────────────────────

/** Hide and reset the follow-up panel and bonus block (called before any navigation away from #go). */
function _resetFollowup() {
  const followup = document.getElementById('go-followup');
  if (followup) followup.style.display = 'none';
  const bonusEl = document.getElementById('go-bonus');
  if (bonusEl) { bonusEl.style.display = 'none'; bonusEl.innerHTML = ''; }
}

/**
 * Retry Missed — launches a short sub-session (up to 5 questions) consisting
 * of the questions the player answered incorrectly in the just-finished run.
 */
window.goRetryMissed = function() {
  const run = getCurrentRun();
  if (!run) return;

  const missedIds = new Set(
    run.results.filter(r => !r.correct && !r.skipped).map(r => r.questionId)
  );
  const missedQs = run.questions.filter(q => missedIds.has(q.id));
  if (missedQs.length === 0) return;

  const subset = [...missedQs].sort(() => Math.random() - 0.5).slice(0, 5);

  // Tag for XP improvement detection
  const targetedConcepts = [...new Set(missedQs.map(q => q.concept_tag).filter(Boolean))];
  window.currentSession = {
    ...window.currentSession,
    isFollowup:       true,
    followupType:     'retry-missed',
    targetedConcepts,
  };

  _resetFollowup();
  const go = document.getElementById('go');
  if (go) go.classList.remove('on');

  window.startGameWithQuestions(subset);
};

/**
 * Quick Rematch — reshuffles the same node (or same review bucket) for a fresh run.
 */
window.goQuickRematch = function() {
  _resetFollowup();
  const go = document.getElementById('go');
  if (go) go.classList.remove('on');

  const session = window.currentSession;
  if (!session) return;

  if (session.isReview) {
    // Re-run the same review bucket
    window.launchReviewBucket(session.reviewBucket);
  } else {
    startStudySessionForNode(session.courseId, session.nodeId);
  }
};

/**
 * Save for Later — persists this session's missed question IDs to
 * state.savedForLater[] for future Smart Review sessions.
 */
window.goSaveForLater = function() {
  const run = getCurrentRun();
  if (!run) return;

  const missedIds = run.results
    .filter(r => !r.correct && !r.skipped)
    .map(r => r.questionId);
  if (missedIds.length === 0) return;

  const state = loadState();
  const saved = new Set(state.savedForLater || []);
  missedIds.forEach(id => saved.add(id));
  state.savedForLater = [...saved];
  saveState(state);

  const btn = document.getElementById('go-save-btn');
  if (btn) { btn.textContent = `✅ SAVED (${missedIds.length})`; btn.disabled = true; }
};

/**
 * Review Weakest — builds a short session (≤5 questions) from the 1-2
 * most-missed concept tags in the just-finished run.
 * Only uses questions already in currentRun — never pulls from other nodes.
 */
window.goReviewWeakest = function() {
  const run = getCurrentRun();
  if (!run) return;

  // 1. Count misses per concept_tag
  const conceptCounts = {};
  run.results.forEach(r => {
    if (!r.correct && !r.skipped) {
      const q = run.questions.find(q => q.id === r.questionId);
      if (!q?.concept_tag) return;
      conceptCounts[q.concept_tag] = (conceptCounts[q.concept_tag] || 0) + 1;
    }
  });

  // 2. Sort by most missed, take top 2 concepts
  const targetConcepts = Object.entries(conceptCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([concept]) => concept);

  if (targetConcepts.length === 0) return;

  // 3. Pool = all run questions matching those concepts
  const pool = run.questions.filter(q => targetConcepts.includes(q.concept_tag));

  // 4. Shuffle and cap at 5
  const subset = [...pool]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  if (subset.length === 0) return;

  // Tag for XP improvement detection
  window.currentSession = {
    ...window.currentSession,
    isFollowup:       true,
    followupType:     'review-weakest',
    targetedConcepts: targetConcepts,
  };

  _resetFollowup();
  const go = document.getElementById('go');
  if (go) go.classList.remove('on');

  window.startGameWithQuestions(subset);
};

// ─── Recall First toggle ─────────────────────────────────────────────────────

/**
 * Toggle Recall First mode on/off. Persists to state.
 * Updates any visible toggle button (node preview or review panel).
 */
window.toggleRecallFirst = function() {
  const state = loadState();
  state.recallFirstEnabled = !state.recallFirstEnabled;
  saveState(state);

  const on = state.recallFirstEnabled;
  // Update any toggle button currently in the DOM
  document.querySelectorAll('.recall-toggle-btn').forEach(btn => {
    btn.textContent = on ? '● ON' : '○ OFF';
    btn.style.background    = on ? 'rgba(0,255,136,.15)' : 'rgba(30,30,50,.6)';
    btn.style.borderColor   = on ? 'rgba(0,255,136,.5)'  : 'rgba(80,80,120,.4)';
    btn.style.color         = on ? '#00ff88' : '#555';
  });
  // Also update by ID (node preview button)
  const byId = document.getElementById('recall-toggle-btn');
  if (byId) {
    byId.textContent     = on ? '● ON' : '○ OFF';
    byId.style.background  = on ? 'rgba(0,255,136,.15)' : 'rgba(30,30,50,.6)';
    byId.style.borderColor = on ? 'rgba(0,255,136,.5)'  : 'rgba(80,80,120,.4)';
    byId.style.color       = on ? '#00ff88' : '#555';
  }
};

// ─── Smart Review Mode ───────────────────────────────────────────────────────

/**
 * Open the Smart Review panel.
 * courseId: prefer active session's course; fall back to 'basics-of-anesthesia'.
 */
window.openReviewPanel = function() {
  const courseId = window.currentSession?.courseId || 'basics-of-anesthesia';
  showReviewPanel(courseId);
};

/** Close review panel, restore world-map (called by panel's ← BACK TO MAP button). */
window.closeReviewPanel = function() {
  hideReviewPanel();
};

/**
 * Launch a review session for the given bucket.
 * Reads courseId from the panel's dataset (set by showReviewPanel).
 */
window.launchReviewBucket = function(bucket) {
  const panel    = document.getElementById('review-panel');
  const courseId = panel?.dataset?.courseId || window.currentSession?.courseId || 'basics-of-anesthesia';

  const questions = buildReviewSession(bucket, courseId);
  if (!questions || questions.length === 0) {
    console.warn('[REVIEW] No questions for bucket:', bucket);
    return;
  }

  // Tag the session so follow-up handlers know this is a review run
  window.currentSession = {
    courseId,
    nodeId:       null,
    questions,
    totalInBank:  questions.length,
    isReview:     true,
    reviewBucket: bucket,
  };

  hideReviewPanel();
  window.startGameWithQuestions(questions);
};

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

    _resetFollowup();
    hideReviewPanel();
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

// ─── backToMap ───────────────────────────────────────────────────────────────
// Called from #lvl-screen "BACK TO MAP" button. For new engine, return to the
// specific course map; for legacy, delegate to legacy backToMap.
//
window.backToMap = function() {
  _resetFollowup();
  const game = document.getElementById('game');
  const go   = document.getElementById('go');
  const lvl  = document.getElementById('lvl-screen');
  if (game) game.style.display = 'none';
  if (go)   go.classList.remove('on');
  if (lvl)  lvl.classList.remove('on');

  if (window.usingNewEngine) {
    window.usingNewEngine = false;
    _pendingNodeMapping = null;
    if (typeof window.showTopicMap === 'function') {
      window.showTopicMap();
    } else if (typeof window.showCourseSelector === 'function') {
      window.showCourseSelector();
    }
  } else if (typeof mapRuntime.backToMap === 'function') {
    mapRuntime.backToMap();
  } else if (typeof window.showCourseSelector === 'function') {
    window.showCourseSelector();
  }
};

// ─── restart ─────────────────────────────────────────────────────────────────
// Called from #go "NEW PATIENT" button. For new engine, return to the specific
// course map so the user can pick a node; for legacy, delegate to legacy restart.
//
window.restart = function() {
  _resetFollowup();
  const go = document.getElementById('go');
  if (go) go.classList.remove('on');

  if (window.usingNewEngine) {
    window.usingNewEngine = false;
    _pendingNodeMapping = null;
    if (typeof window.showTopicMap === 'function') {
      window.showTopicMap();
    } else if (typeof window.showCourseSelector === 'function') {
      window.showCourseSelector();
    }
  } else if (typeof mapRuntime.restart === 'function') {
    mapRuntime.restart();
  } else if (typeof window.showCourseSelector === 'function') {
    window.showCourseSelector();
  }
};

// Initialize the course map node list (used by #level-map, kept for compat)
createSimpleCourseMap();
