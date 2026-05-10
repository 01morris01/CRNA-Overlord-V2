import { loadState, saveState } from './core/state.js';
import { showMap , createSimpleCourseMap } from './ui/menus.js';
import { updateHUD, renderCurrentQuestion } from './ui/gameUI.js';
import { getOpioidsQuestions, getQuestionsForNode } from './core/questionEngine.js';
import { getSession, loginUser, registerUser, logout } from './core/auth.js';
import { renderMissionCard } from './core/dailyMission.js';

let _authMode = 'login'; // 'login' or 'register'

function _showLoggedIn(displayName) {
  const authArea     = document.getElementById('auth-area');
  const loggedInArea = document.getElementById('logged-in-area');
  const loggedInInfo = document.getElementById('logged-in-info');
  const nameArea     = document.getElementById('name-area');
  const startBtn     = document.getElementById('start-btn');
  const savedInfo    = document.getElementById('saved-info');

  const backupArea  = document.getElementById('backup-area');

  if (authArea)     authArea.style.display     = 'none';
  if (loggedInArea) loggedInArea.style.display  = 'block';
  if (nameArea)     nameArea.style.display      = 'block';
  if (startBtn)     startBtn.style.display      = 'inline-block';
  if (backupArea)   backupArea.style.display    = 'block';

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

  // Show daily mission card for returning users
  renderMissionCard();

  // Check for abandoned run
  _checkAbandonedRun(state);
}

function _checkAbandonedRun(state) {
  if (!state.activeRun) return;
  const run = state.activeRun;
  const age = Date.now() - (run.timestamp || 0);
  if (age > 24 * 60 * 60 * 1000) {
    // Older than 24 hours; auto-abandon and bank locked score
    const s = loadState();
    if (run.lockedScore > 0 && run.mode !== 'study') {
      s.bankedPts = (s.bankedPts || 0) + run.lockedScore;
      s.totalPts = (s.totalPts || 0) + run.lockedScore;
    }
    s.activeRun = null;
    saveState(s);
    return;
  }

  // Show abandoned patient banner
  let banner = document.getElementById('abandoned-run-banner');
  if (banner) banner.remove();
  banner = document.createElement('div');
  banner.id = 'abandoned-run-banner';
  banner.style.cssText = 'max-width:320px;width:100%;margin-bottom:1rem;padding:.8rem;background:rgba(255,46,99,.08);border:1px solid rgba(255,46,99,.3);border-radius:8px;text-align:center;';
  banner.innerHTML = `
    <div style="font-family:var(--fm);font-size:.5rem;color:var(--red,#ff2e63);letter-spacing:.15em;margin-bottom:.3rem;">ABANDONED PATIENT</div>
    <div style="font-size:.65rem;color:var(--txt,#e5edf7);font-weight:600;margin-bottom:.2rem;">${run.nodeId || 'Unknown'}, Q${(run.index||0)+1}/15</div>
    <div style="font-size:.5rem;color:var(--txt-2,#a3b3c9);margin-bottom:.6rem;">Score: ${(run.score||0).toLocaleString()} · Locked: ${(run.lockedScore||0).toLocaleString()}</div>
    <div style="display:flex;gap:.5rem;justify-content:center;">
      <button id="abandon-resume" style="background:var(--red,#ff2e63);border:none;color:#fff;font-family:var(--fd);font-size:.7rem;font-weight:700;padding:.4rem 1rem;border-radius:4px;cursor:pointer;letter-spacing:.1em;">RESUME</button>
      <button id="abandon-quit" style="background:transparent;border:1px solid var(--line,#1a2940);color:var(--muted,#5a6f8a);font-family:var(--fm);font-size:.55rem;padding:.4rem 1rem;border-radius:4px;cursor:pointer;">ABANDON</button>
    </div>
  `;

  const loggedIn = document.getElementById('logged-in-area');
  if (loggedIn) loggedIn.appendChild(banner);

  document.getElementById('abandon-quit')?.addEventListener('click', () => {
    const s = loadState();
    if (run.lockedScore > 0 && run.mode !== 'study') {
      s.bankedPts = (s.bankedPts || 0) + run.lockedScore;
      s.totalPts = (s.totalPts || 0) + run.lockedScore;
    }
    s.activeRun = null;
    saveState(s);
    banner.remove();
  });

  // Resume: reload questions for the node and restore run state
  document.getElementById('abandon-resume')?.addEventListener('click', () => {
    banner.remove();

    // Import the question loader and start a resumed session
    import('./core/questionEngine.js').then(({ getQuestionsForNode }) => {
      import('./ui/menus.js').then(({ SESSION_SIZE }) => {
        const questions = getQuestionsForNode(run.courseId, run.nodeId);
        if (!questions || questions.length === 0) {
          alert('Could not load questions for this node. Starting fresh.');
          const startBtn = document.getElementById('start-btn');
          if (startBtn) startBtn.click();
          return;
        }

        // Shuffle and take session subset (same size as original)
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        const sessionQuestions = shuffled.slice(0, Math.min(SESSION_SIZE, shuffled.length));

        // Set up the session
        window.currentSession = {
          courseId: run.courseId,
          nodeId: run.nodeId,
          questions: sessionQuestions,
          totalInBank: questions.length,
          mode: run.mode || 'or-rounds',
        };
        window._sessionMode = run.mode || 'or-rounds';

        // Start the game
        if (window.startGameWithQuestions) {
          const lives = run.lives || 3;
          window.startGameWithQuestions(sessionQuestions, { lives, mode: run.mode || 'or-rounds' });

          // After the engine starts, restore the run state
          setTimeout(() => {
            const engineRun = window.engineGetCurrentRun?.() || (typeof getCurrentRun === 'function' ? getCurrentRun() : null);
            if (engineRun) {
              // Fast-forward index to where they left off
              // We can't truly restore mid-question, so start them at the question they were on
              engineRun.score = run.score || 0;
              engineRun.lockedScore = run.lockedScore || 0;
              engineRun.streak = run.streak || 0;
              engineRun.bestStreak = Math.max(run.streak || 0, run.bestStreak || 0);
              engineRun.lives = run.lives || 3;

              // Skip to the right question index
              const targetIdx = Math.min(run.index || 0, engineRun.questions.length - 1);
              engineRun.index = targetIdx;

              // Fill in placeholder results for skipped questions
              while (engineRun.results.length < targetIdx) {
                engineRun.results.push({ questionId: 'resumed', correct: true, timestamp: Date.now(), topic: 'resumed' });
              }

              // Re-render at the correct position
              if (window.renderCurrentQuestion) window.renderCurrentQuestion();
              if (window.updateHUD) window.updateHUD();

              // Update HUD counters
              const qn = document.getElementById('qn');
              const qt = document.getElementById('qt');
              if (qn) qn.textContent = targetIdx + 1;
              if (qt) qt.textContent = engineRun.questions.length;
            }

            // Clear the activeRun since we're resuming
            const s = loadState();
            s.activeRun = null;
            saveState(s);
          }, 100);
        }
      });
    });
  });
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

function _showRecoveryCard(err) {
  const app = document.getElementById('app');
  if (!app) return;
  const card = document.createElement('div');
  card.style.cssText = 'position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(4,6,14,.95);z-index:10000;padding:2rem;';
  card.innerHTML = `
    <div style="max-width:400px;text-align:center;">
      <div style="font-size:1.2rem;font-weight:900;color:#ff3366;margin-bottom:1rem;">Something went wrong.</div>
      <div style="font-size:.65rem;color:#7a95b0;margin-bottom:.5rem;">Error: ${(err?.message || 'Unknown error').replace(/</g, '&lt;')}</div>
      <div style="font-size:.6rem;color:#4a6282;margin-bottom:1.5rem;">Your save data may be corrupted. You can reset to start fresh.</div>
      <button id="recovery-reset-btn" style="background:transparent;border:2px solid #ff3366;color:#ff3366;font-size:.8rem;font-weight:700;padding:.6rem 2rem;cursor:pointer;border-radius:4px;letter-spacing:.1em;">RESET AND RELOAD</button>
    </div>
  `;
  app.appendChild(card);
  document.getElementById('recovery-reset-btn')?.addEventListener('click', () => {
    // Clear the current user's save key
    try {
      const key = typeof window._getUserSaveKey === 'function' ? window._getUserSaveKey() : null;
      if (key) localStorage.removeItem(key);
    } catch (_) { /* ignore */ }
    // Fallback: clear all overlord save keys
    Object.keys(localStorage).filter(k => k.startsWith('hemodynamic_overlord_save')).forEach(k => localStorage.removeItem(k));
    location.reload();
  });
}

// Backup / restore progress
window._backupProgress = function() {
  const state = loadState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `overlord-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

window._importBackup = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!imported || typeof imported !== 'object') throw new Error('Invalid format');
      saveState(imported);
      alert('Progress restored. Reloading.');
      location.reload();
    } catch (err) {
      alert('Failed to import: ' + err.message);
    }
  };
  reader.readAsText(file);
};

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
      try {
        _initGameUI();
      } catch (err) {
        console.error('[INIT] _initGameUI failed:', err);
        _showRecoveryCard(err);
      }
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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((reg) => {
    setInterval(() => reg.update(), 5 * 60 * 1000);
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }).catch(err => {
    console.warn('[SW] Registration failed:', err);
  });
}
