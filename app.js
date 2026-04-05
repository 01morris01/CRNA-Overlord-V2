import { loadState, saveState } from './core/state.js';
import { showMap , createSimpleCourseMap } from './ui/menus.js';
import { updateHUD, renderCurrentQuestion } from './ui/gameUI.js';
import { getOpioidsQuestions, getQuestionsForNode } from './core/questionEngine.js';

export function initApp() {
  const state = loadState();
  window.crnaState = state;

  function initUI() {
    if (state.name) {
      const nameInput = document.getElementById('name-input');
      const savedInfo = document.getElementById('saved-info');
      if (nameInput) nameInput.value = state.name;
      if (savedInfo) savedInfo.textContent = `Welcome back, ${state.name}! Banked: ${state.bankedPts.toLocaleString()} pts`;
    }
    createSimpleCourseMap();
    updateHUD();
    renderCurrentQuestion();

    // Expose opioid questions globally so legacy.js can use them
    const qs = getOpioidsQuestions();
    window.opioidsQuestions = qs;
    console.log('COURSE: basics-of-anesthesia (app init)');
    console.log('NODE: node-9 (app init)');
    console.log('QUESTION COUNT (opioids loaded):', qs.length);
    if (qs.length > 0) {
      console.log('FIRST QUESTION (opioids):', qs[0]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }

  window.addEventListener('beforeunload', () => {
    saveState(window.crnaState || state);
  });
}

initApp();