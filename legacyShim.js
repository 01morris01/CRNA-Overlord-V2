import { startRun as engineStartRun, submitAnswer as engineSubmitAnswer, getCurrentRun } from './core/gameEngine.js';
import { showMap, createSimpleCourseMap, startStudySessionForNode } from './ui/menus.js';
import { updateHUD, renderCurrentQuestion, hideFeedback } from './ui/gameUI.js';
import { gradeAnswer } from './core/answerGrading.js';
import { getOpioidsQuestions } from './core/questionEngine.js';

const mapRuntime = {
  startGame: window.startGame,
  nextQ: window.nextQ,
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
 * Start a game with specific questions
 */
window.startGameWithQuestions = function(questions) {
  if (!questions || questions.length === 0) {
    console.error('No questions provided');
    return;
  }
  
  const run = engineStartRun({ mode: 'lesson', questions: questions, lives: 3 });
  
  document.getElementById('splash').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  
  renderCurrentQuestion();
  updateHUD();
  
  return run;
};

maybeAssign('startGame', function() {
  // Default to opioids questions
  const questions = getOpioidsQuestions();
  
  if (questions && questions.length > 0) {
    // Shuffle for variety
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
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
  console.warn('startGame fallback no engine');
});

maybeAssign('nextQ', function() {
  // Hide feedback first
  hideFeedback();
  
  const run = getCurrentRun();
  if (!run) return;
  
  // Check if game is over
  if (run.done) {
    showGameOver(run);
    return;
  }
  
  // Render next question
  renderCurrentQuestion();
  updateHUD();
});

/**
 * Submit answer (called from UI)
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
  
  // Use the new grading system
  const result = gradeAnswer(input.value, q);
  engineSubmitAnswer(result.correct);
  renderCurrentQuestion();
  updateHUD();
  return result.correct;
});

/**
 * Show game over screen
 */
function showGameOver(run) {
  const go = document.getElementById('go');
  const goT = document.getElementById('go-t');
  const goS = document.getElementById('go-s');
  const goPts = document.getElementById('go-pts');
  
  if (go) {
    go.classList.add('on');
    
    const correctCount = run.results.filter(r => r.correct).length;
    const totalCount = run.results.length;
    const percentage = Math.round((correctCount / totalCount) * 100);
    
    if (run.lives > 0) {
      // Survived
      if (goT) goT.textContent = 'PATIENT STABLE';
      if (goS) goS.textContent = `- ${correctCount}/${totalCount} correct (${percentage}%) -`;
    } else {
      // Game over
      if (goT) goT.textContent = 'PATIENT DECEASED';
      if (goS) goS.textContent = `- ${correctCount}/${totalCount} correct -`;
    }
    
    if (goPts) goPts.textContent = run.score.toLocaleString();
  }
}

maybeAssign('openStore', function() {
  const modal = document.getElementById('store-modal');
  if (modal) modal.classList.add('on');
});

maybeAssign('closeStore', function() {
  const modal = document.getElementById('store-modal');
  if (modal) modal.classList.remove('on');
});

maybeAssign('pauseGame', function() {
  const overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.classList.add('on');
});

maybeAssign('resumeGame', function() {
  const overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.classList.remove('on');
});

maybeAssign('quitToMap', function() {
  const overlay = document.getElementById('pause-overlay');
  const game = document.getElementById('game');
  const go = document.getElementById('go');
  const levelMap = document.getElementById('level-map');
  
  if (overlay) overlay.classList.remove('on');
  if (game) game.style.display = 'none';
  if (go) go.classList.remove('on');
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
  
  // Restart with opioids questions
  window.startGame();
});

// Initialize the course map
createSimpleCourseMap();
