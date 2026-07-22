/**
 * ULTRASOUND TRAINER: Plexus Studio embedded inline, with tabs.
 *
 * Plexus Studio (the capture to overlay ultrasound structure highlighting
 * trainer) is copied in tree under /ultrasound and served by the same
 * python http.server that serves this app, so onnxruntime-web wasm and the
 * recorded mp4 clips load without a second node server.
 *
 * This view is the single top level ultrasound entry point:
 *   1. A hidden <section id="ultrasound-trainer-view"> lives in index.html.
 *   2. initUltrasoundTrainerView() is called from app.js on login.
 *   3. A top level ULTRASOUND TRAINER button on the level map opens it; a
 *      BACK TO MAP control closes it.
 *
 * Inside the view a tab bar switches between:
 *   LIVE TRAINER, the Plexus Studio iframe (default tab), and
 *   BLOCK REFERENCE, the regional nerve blocks study reference, mounted from
 *   regionalBlocksView.js. Block cards with a trained model deep link back to
 *   the LIVE TRAINER tab via window.showUltrasoundTrainer(model, source).
 *
 * The trainer is embedded in an iframe so its relative asset paths keep
 * working. This is a teaching overlay, never clinical or intra procedure
 * guidance. The trainer keeps its own training aid banner, model trust panel,
 * and abstention gate intact.
 */

import { mountRegionalBlocksPanel } from './regionalBlocksView.js';

const TRAINER_BASE = '/ultrasound/index.html';

let initialized = false;
let view = null;
let launchSource = null;
let courseSelectorDisplay = null;
let currentModel = null;
let activeTab = 'live';

function renderShell() {
  view.innerHTML = `
    <header class="ut-header">
      <div>
        <p class="ut-eyebrow">STUDY CONSOLE · ULTRASOUND</p>
        <h1>Ultrasound Trainer · Plexus Studio</h1>
        <p class="ut-subtitle">Capture to overlay structure highlighting. Training aid only, never a needle target.</p>
      </div>
      <div class="ut-header-actions">
        <button id="ut-close" type="button" class="ut-btn ut-secondary">BACK TO MAP</button>
      </div>
    </header>
    <div class="ut-tabs" role="tablist" aria-label="Ultrasound trainer sections">
      <button id="ut-tab-live" type="button" class="ut-tab is-active" role="tab" aria-selected="true" aria-controls="ut-panel-live">LIVE TRAINER</button>
      <button id="ut-tab-blocks" type="button" class="ut-tab" role="tab" aria-selected="false" aria-controls="ut-panel-blocks">BLOCK REFERENCE</button>
    </div>
    <div id="ut-panel-live" class="ut-frame-wrap" role="tabpanel" aria-labelledby="ut-tab-live">
      <iframe id="ut-frame" class="ut-frame" title="Plexus Studio ultrasound trainer" src="about:blank"></iframe>
    </div>
    <div id="ut-panel-blocks" class="ut-blocks-panel" role="tabpanel" aria-labelledby="ut-tab-blocks" hidden></div>`;
}

function setActiveTab(tab) {
  activeTab = tab;
  const liveTab = document.getElementById('ut-tab-live');
  const blocksTab = document.getElementById('ut-tab-blocks');
  const livePanel = document.getElementById('ut-panel-live');
  const blocksPanel = document.getElementById('ut-panel-blocks');
  if (!liveTab || !blocksTab || !livePanel || !blocksPanel) return;
  const liveActive = tab === 'live';
  liveTab.classList.toggle('is-active', liveActive);
  blocksTab.classList.toggle('is-active', !liveActive);
  liveTab.setAttribute('aria-selected', String(liveActive));
  blocksTab.setAttribute('aria-selected', String(!liveActive));
  // The live panel is hidden with a class, not [hidden], so the iframe keeps
  // its wasm session alive while the reference tab is open.
  livePanel.classList.toggle('is-hidden', !liveActive);
  blocksPanel.hidden = liveActive;
}

function frameUrl(model) {
  if (model) {
    return `${TRAINER_BASE}?model=${encodeURIComponent(model)}`;
  }
  return TRAINER_BASE;
}

function loadFrame(model) {
  const frame = document.getElementById('ut-frame');
  if (!frame) return;
  const target = frameUrl(model);
  // Reload only when the requested model changed, so re opening the same
  // deep link does not needlessly reboot the wasm session.
  if (currentModel === model && frame.getAttribute('src') && frame.getAttribute('src') !== 'about:blank') {
    return;
  }
  currentModel = model;
  frame.setAttribute('src', target);
}

function showView(model) {
  document.getElementById('level-map')?.classList.remove('on');
  const courseSelector = document.getElementById('course-selector');
  if (courseSelector) {
    courseSelectorDisplay = courseSelector.style.display;
    courseSelector.style.display = 'none';
  }
  const game = document.getElementById('game');
  if (game) game.style.display = 'none';
  const splash = document.getElementById('splash');
  if (splash) splash.style.display = 'none';
  view.hidden = false;
  view.setAttribute('aria-hidden', 'false');
  view.classList.add('is-open');
  // A model deep link (from a BLOCK REFERENCE card) lands on the live tab
  // with that model loading; a plain open keeps the current tab.
  if (model) {
    setActiveTab('live');
    loadFrame(model);
  } else {
    loadFrame(currentModel || null);
  }
  document.getElementById('ut-close')?.focus();
}

function closeView() {
  view.hidden = true;
  view.setAttribute('aria-hidden', 'true');
  view.classList.remove('is-open');
  const courseSelector = document.getElementById('course-selector');
  if (courseSelector && courseSelectorDisplay !== null) {
    courseSelector.style.display = courseSelectorDisplay;
    courseSelectorDisplay = null;
  }
  if (launchSource?.closest('#level-map')) {
    document.getElementById('level-map')?.classList.add('on');
  }
  launchSource?.focus();
}

function registerLaunchButton(button) {
  if (!button || button.dataset.utBound === 'true') return;
  button.dataset.utBound = 'true';
  button.addEventListener('click', (event) => {
    launchSource = event.currentTarget;
    showView(null);
  });
}

let launchObserver = null;

// The course selector (SELECT STUDY PATH) is the first screen after login, so
// inject a launcher there as well as the level map, keeping the trainer
// discoverable from the top of the app.
function ensureMenuLaunchButtons() {
  registerLaunchButton(document.getElementById('ultrasound-trainer-launch'));

  const courseSelectorBody = document.querySelector('#course-selector > div');
  if (courseSelectorBody && !document.getElementById('ultrasound-trainer-course-launch')) {
    const button = document.createElement('button');
    button.id = 'ultrasound-trainer-course-launch';
    button.className = 'big-btn ut-menu-launch';
    button.type = 'button';
    button.textContent = '🔬 ULTRASOUND TRAINER';
    // Place it just after the live sim launcher so the study consoles sit
    // together at the top of the selector.
    const anchor = document.getElementById('live-sim-course-launch');
    if (anchor && anchor.parentNode === courseSelectorBody) {
      courseSelectorBody.insertBefore(button, anchor.nextSibling);
    } else {
      courseSelectorBody.insertBefore(button, courseSelectorBody.children[1] ?? null);
    }
  }
  registerLaunchButton(document.getElementById('ultrasound-trainer-course-launch'));
}

function observeMenuLaunchers() {
  ensureMenuLaunchButtons();
  const courseSelector = document.getElementById('course-selector');
  if (!courseSelector || typeof MutationObserver === 'undefined') return;
  launchObserver = new MutationObserver(ensureMenuLaunchButtons);
  launchObserver.observe(courseSelector, { childList: true, subtree: true });
}

export function initUltrasoundTrainerView() {
  if (initialized) return;
  view = document.getElementById('ultrasound-trainer-view');
  if (!view) return;
  initialized = true;
  renderShell();
  mountRegionalBlocksPanel(document.getElementById('ut-panel-blocks'));
  document.getElementById('ut-close')?.addEventListener('click', closeView);
  document.getElementById('ut-tab-live')?.addEventListener('click', () => {
    setActiveTab('live');
    loadFrame(currentModel || null);
  });
  document.getElementById('ut-tab-blocks')?.addEventListener('click', () => setActiveTab('blocks'));
  observeMenuLaunchers();
  // Deep link entry used by the BLOCK REFERENCE live launch buttons. Sources
  // inside this view (block cards) must not clobber launchSource, which
  // tracks where the whole view was opened from for BACK TO MAP focus return.
  window.showUltrasoundTrainer = (model, source) => {
    if (source && !view.contains(source)) launchSource = source;
    showView(model || null);
  };
}

export { showView as showUltrasoundTrainer, closeView as closeUltrasoundTrainer };
