import { loadState, saveState } from './core/state.js';
import { showMap , createSimpleCourseMap } from './ui/menus.js';
import { updateHUD, renderCurrentQuestion } from './ui/gameUI.js';
import { getOpioidsQuestions, getQuestionsForNode } from './core/questionEngine.js';
import { getSession, loginUser, registerUser, logout } from './core/auth.js';

let _authMode = 'login'; // 'login' or 'register'

function _showLoggedIn(displayName) {
  const authArea     = document.getElementById('auth-area');
  const loggedInArea = document.getElementById('logged-in-area');
  const loggedInInfo = document.getElementById('logged-in-info');
  const nameArea     = document.getElementById('name-area');
  const startBtn     = document.getElementById('start-btn');
  const savedInfo    = document.getElementById('saved-info');

  if (authArea)     authArea.style.display     = 'none';
  if (loggedInArea) loggedInArea.style.display  = 'block';
  if (nameArea)     nameArea.style.display      = 'block';
  if (startBtn)     startBtn.style.display      = 'inline-block';

  const state = loadState();
  if (loggedInInfo) {
    loggedInInfo.innerHTML = `Logged in as <b style="color:#ffcc00">${displayName}</b> <button class="logout-btn" onclick="window.handleLogout()">LOGOUT</button>`;
  }
  if (savedInfo) {
    savedInfo.textContent = state.bankedPts > 0
      ? `Welcome back! Banked: ${state.bankedPts.toLocaleString()} pts`
      : '';
  }

  const nameInput = document.getElementById('name-input');
  if (nameInput && state.name) {
    nameInput.value = state.name;
  }
}

function _showAuthForm() {
  const authArea     = document.getElementById('auth-area');
  const loggedInArea = document.getElementById('logged-in-area');
  const nameArea     = document.getElementById('name-area');
  const startBtn     = document.getElementById('start-btn');

  if (authArea)     authArea.style.display     = 'block';
  if (loggedInArea) loggedInArea.style.display  = 'none';
  if (nameArea)     nameArea.style.display      = 'none';
  if (startBtn)     startBtn.style.display      = 'none';
}

window.switchAuthTab = function(tab) {
  _authMode = tab;
  const tabLogin    = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const authBtn     = document.getElementById('auth-btn');
  const authError   = document.getElementById('auth-error');
  const authPass    = document.getElementById('auth-password');

  if (tabLogin)    tabLogin.classList.toggle('active', tab === 'login');
  if (tabRegister) tabRegister.classList.toggle('active', tab === 'register');
  if (authBtn)     authBtn.textContent = tab === 'login' ? 'LOGIN' : 'REGISTER';
  if (authError)   authError.textContent = '';
  if (authPass)    authPass.autocomplete = tab === 'login' ? 'current-password' : 'new-password';
};

window.handleAuth = async function() {
  const username = document.getElementById('auth-username')?.value?.trim();
  const password = document.getElementById('auth-password')?.value;
  const errorEl  = document.getElementById('auth-error');

  if (!username || !password) {
    if (errorEl) errorEl.textContent = 'Enter both username and password.';
    return;
  }

  let result;
  if (_authMode === 'login') {
    result = await loginUser(username, password);
  } else {
    result = await registerUser(username, password);
  }

  if (!result.success) {
    if (errorEl) errorEl.textContent = result.error;
    return;
  }

  // Logged in successfully
  _showLoggedIn(result.displayName);
  _initGameUI();
};

window.handleLogout = function() {
  logout();
  _showAuthForm();
  // Clear UI
  const nameInput = document.getElementById('name-input');
  if (nameInput) nameInput.value = '';
};

// Allow Enter key to submit auth form
function _setupAuthKeyboard() {
  ['auth-username', 'auth-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') window.handleAuth();
      });
    }
  });
}

function _initGameUI() {
  const state = loadState();
  window.crnaState = state;
  createSimpleCourseMap();
  updateHUD();
  renderCurrentQuestion();

  const qs = getOpioidsQuestions();
  window.opioidsQuestions = qs;
}

export function initApp() {
  function initUI() {
    _setupAuthKeyboard();

    // Check for existing session
    const session = getSession();
    if (session) {
      _showLoggedIn(session.displayName);
      _initGameUI();
    } else {
      _showAuthForm();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }

  // On unload, save the CURRENT localStorage state (not a stale closure).
  // All mutations (buyItem, usePwr, submitAnswer) already call saveState()
  // immediately, so this is only a safety net for the name field.
  window.addEventListener('beforeunload', () => {
    const session = getSession();
    if (!session) return; // not logged in, nothing to save
    const current = loadState();
    const nameInput = document.getElementById('name-input');
    if (nameInput && nameInput.value.trim()) {
      current.name = nameInput.value.trim();
    }
    saveState(current);
  });
}

initApp();
