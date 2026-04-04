import { startRun as engineStartRun, submitAnswer as engineSubmitAnswer, getCurrentRun } from './core/gameEngine.js';
import { showMap, createSimpleCourseMap } from './ui/menus.js';
import { updateHUD, renderCurrentQuestion } from './ui/gameUI.js';

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

maybeAssign('startGame', function() {
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
  const result = engineSubmitAnswer(false);
  renderCurrentQuestion();
  updateHUD();
  if (result.currentRun && result.currentRun.done) {
    const ro = document.getElementById('result');
    ro.classList.add('on');
    document.getElementById('r-v').textContent = result.currentRun.score > 0 ? 'VICTORY' : 'DEFEAT';
    document.getElementById('r-q').textContent = `Completed ${result.currentRun.index}/${result.currentRun.questions.length}`;
    document.getElementById('r-ex').textContent = 'Review your performance and keep hammering those weak spots.';
  }
  return result;
});

maybeAssign('submitType', function() {
  const input = document.getElementById('type-input');
  const run = getCurrentRun();
  if (!run || !run.questions || run.index >= run.questions.length) return;
  const q = run.questions[run.index];
  if (!q) return;
  const isCorrect = q.accepted && input && q.accepted.map(v=>v.trim().toLowerCase()).includes(input.value.trim().toLowerCase());
  engineSubmitAnswer(isCorrect);
  renderCurrentQuestion();
  updateHUD();
  return isCorrect;
});

maybeAssign('openStore', function() {
  console.warn('openStore fallback called - legacy not present');
});

maybeAssign('closeStore', function() {
  console.warn('closeStore fallback called - legacy not present');
});

maybeAssign('pauseGame', function() {
  console.warn('pauseGame fallback called - legacy not present');
});

maybeAssign('resumeGame', function() {
  console.warn('resumeGame fallback called - legacy not present');
});

maybeAssign('quitToMap', function() {
  showMap();
  console.warn('quitToMap fallback called - legacy not present');
});

maybeAssign('usePwr', function(type) {
  console.warn('usePwr fallback called - legacy not present', type);
});

maybeAssign('closeLvl', function() {
  document.getElementById('lvl-screen').classList.remove('on');
  console.warn('closeLvl fallback called - legacy not present');
});

maybeAssign('backToMap', function() {
  showMap();
  console.warn('backToMap fallback called - legacy not present');
});

maybeAssign('restart', function() {
  console.warn('restart fallback called - legacy not present');
});

createSimpleCourseMap();
