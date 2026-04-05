import { startRun as engineStartRun, submitAnswer as engineSubmitAnswer, getCurrentRun } from './core/gameEngine.js';
import { showMap, createSimpleCourseMap, startStudySessionForNode } from './ui/menus.js';
import { updateHUD, renderCurrentQuestion, hideFeedback, stopTimer, showAnswerFeedback } from './ui/gameUI.js';
import { gradeAnswer } from './core/answerGrading.js';
import { getOpioidsQuestions } from './core/questionEngine.js';

// Track which engine is currently active
window.usingNewEngine = false;

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
 * Start a game with specific questions (new engine path)
 */
window.startGameWithQuestions = function(questions) {
  if (!questions || questions.length === 0) {
    console.error('No questions provided to startGameWithQuestions');
    return;
  }

  window.usingNewEngine = true;

  // Stop any legacy scene animation on the #scn canvas
  if (typeof window.stopLegacyScene === 'function') window.stopLegacyScene();
  // Stop any running opioid scene from a previous session
  if (typeof window.stopOpioidScene === 'function') window.stopOpioidScene();
  // Stop any running timer
  stopTimer();

  // DEBUG
  if (window.currentSession) {
    console.log('COURSE:', window.currentSession.courseId);
    console.log('NODE:', window.currentSession.nodeId);
  }
  console.log('QUESTION COUNT:', questions.length);
  console.log('FIRST QUESTION:', questions[0]);

  const run = engineStartRun({ mode: 'lesson', questions: questions, lives: 3 });

  // Hide all entry screens, show game
  const splash        = document.getElementById('splash');
  const courseSelector= document.getElementById('course-selector');
  const levelMap      = document.getElementById('level-map');
  const game          = document.getElementById('game');

  if (splash)         splash.style.display         = 'none';
  if (courseSelector) courseSelector.style.display  = 'none';
  if (levelMap)       levelMap.classList.remove('on');
  if (game)           game.style.display            = 'flex';

  // Init HUD counters
  const qn      = document.getElementById('qn');
  const qt      = document.getElementById('qt');
  const lvlBadge= document.getElementById('lvl-b');
  const progFill= document.getElementById('prog-fill');
  if (qn)       qn.textContent       = '1';
  if (qt)       qt.textContent       = questions.length;
  if (lvlBadge) lvlBadge.textContent = 'OPIOIDS Ch.9';
  if (progFill) progFill.style.width = '0%';

  renderCurrentQuestion();
  updateHUD();

  return run;
};

/**
 * Unified nextQ — dispatches to new engine or legacy engine depending on which is active
 */
const _legacyNextQ = window.nextQ;
window.nextQ = function() {
  if (window.usingNewEngine) {
    // New engine path
    hideFeedback();

    const run = getCurrentRun();
    if (!run) return;

    if (run.done) {
      _showNewEngineGameOver(run);
      return;
    }

    renderCurrentQuestion();
    updateHUD();

    // DEBUG: log current question type
    const q = run.questions[run.index];
    if (q) {
      console.log('QUESTION TYPE:', q.type);
    }
  } else {
    // Legacy engine path
    if (typeof _legacyNextQ === 'function') _legacyNextQ();
  }
};

/**
 * Submit answer (called from gameUI.js after grading)
 */
window.submitAnswer = function(isCorrect) {
  const result = engineSubmitAnswer(isCorrect);
  updateHUD();

  // Update progress bar
  const run = getCurrentRun();
  if (run) {
    const progress = ((run.index) / run.questions.length) * 100;
    const progFill = document.getElementById('prog-fill');
    if (progFill) progFill.style.width = `${progress}%`;

    // Update question counter
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
 * Show game over screen for new engine run
 */
function _showNewEngineGameOver(run) {
  const go = document.getElementById('go');
  const goT = document.getElementById('go-t');
  const goS = document.getElementById('go-s');
  const goPts = document.getElementById('go-pts');

  if (go) {
    go.classList.add('on');

    const correctCount = run.results.filter(r => r.correct).length;
    const totalCount = run.results.length;
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    if (run.lives > 0) {
      if (goT) goT.textContent = 'PATIENT STABLE';
      if (goS) goS.textContent = `- ${correctCount}/${totalCount} correct (${percentage}%) -`;
    } else {
      if (goT) goT.textContent = 'PATIENT DECEASED';
      if (goS) goS.textContent = `- ${correctCount}/${totalCount} correct -`;
    }

    if (goPts) goPts.textContent = run.score.toLocaleString();
  }
}

maybeAssign('startGame', function() {
  // Default to opioids questions
  const questions = getOpioidsQuestions();

  if (questions && questions.length > 0) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    window.currentSession = { courseId: 'basics-of-anesthesia', nodeId: 'node-9', questions: shuffled };
    return window.startGameWithQuestions(shuffled);
  }

  // Fallback to legacy
  if (typeof engineStartRun === 'function') {
    const run = engineStartRun({mode:'lesson', questions: undefined, lives:3});
    document.getElementById('splash').style.display='none';
    document.getElementById('game').style.display='flex';
    renderCurrentQuestion();
    updateHUD();
    return run;
  }
  console.warn('startGame fallback: no engine');
});

maybeAssign('openStore', function() {
  const modal = document.getElementById('store-modal');
  if (modal) modal.classList.add('on');
});

maybeAssign('closeStore', function() {
  const modal = document.getElementById('store-modal');
  if (modal) modal.classList.remove('on');
});

maybeAssign('pauseGame', function() {
  stopTimer();
  if (typeof window.stopOpioidScene === 'function') window.stopOpioidScene();
  const overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.classList.add('on');
});

maybeAssign('resumeGame', function() {
  const overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.classList.remove('on');
  // Re-render current question to restart timer + scene
  if (window.usingNewEngine) {
    renderCurrentQuestion();
  }
});

maybeAssign('quitToMap', function() {
  stopTimer();
  if (typeof window.stopOpioidScene === 'function') window.stopOpioidScene();
  window.usingNewEngine = false;

  const overlay  = document.getElementById('pause-overlay');
  const game     = document.getElementById('game');
  const go       = document.getElementById('go');
  const levelMap = document.getElementById('level-map');

  if (overlay)  overlay.classList.remove('on');
  if (game)     game.style.display = 'none';
  if (go)       go.classList.remove('on');
  if (levelMap) levelMap.classList.add('on');
});

maybeAssign('usePwr', function(type) {
  console.warn('usePwr fallback called - legacy not present', type);
});

maybeAssign('closeLvl', function() {
  document.getElementById('lvl-screen').classList.remove('on');
});

maybeAssign('backToMap', function() {
  const game = document.getElementById('game');
  const go = document.getElementById('go');
  const levelMap = document.getElementById('level-map');

  if (game) game.style.display = 'none';
  if (go) go.classList.remove('on');
  if (levelMap) levelMap.classList.add('on');
});

maybeAssign('restart', function() {
  const go = document.getElementById('go');
  if (go) go.classList.remove('on');
  window.usingNewEngine = false;
  window.startGame();
});

// Initialize the course map
createSimpleCourseMap();
