import { loadState, saveState } from './core/state.js';
import { showMap , createSimpleCourseMap } from './ui/menus.js';
import { updateHUD, renderCurrentQuestion } from './ui/gameUI.js';
import { injectSpeedInsights } from '@vercel/speed-insights';

export function initApp() {
  const state = loadState();
  window.crnaState = state;

  // Initialize Vercel Speed Insights
  injectSpeedInsights();

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