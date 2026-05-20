import { getCurrentRun, LADDER_REWARDS, submitAnswer as engineSubmitAnswer } from '../core/gameEngine.js';
import { gradeShortAnswer, gradeMultiSelect } from '../core/answerGrading.js';
import { gradeRecallAnswer } from '../core/recallGrader.js';
import { renderAirwayManagementScene, stopAirwayManagementScene } from './airwayManagementScene.js';
import { renderBasicPharmacologicPrinciplesScene, stopBasicPharmacologicPrinciplesScene } from './basicPharmacologicPrinciplesScene.js';
import { renderCardiacPhysiologyScene, stopCardiacPhysiologyScene } from './cardiacPhysiologyScene.js';
import { renderPulmonaryPhysiologyScene, stopPulmonaryPhysiologyScene } from './pulmonaryPhysiologyScene.js';
import { renderAutonomicNSScene, stopAutonomicNSScene } from './autonomicNSScene.js';
import { renderInhaledAnestheticsScene, stopInhaledAnestheticsScene } from './inhaledAnestheticsScene.js';
import { renderIVAnestheticsScene, stopIVAnestheticsScene } from './ivAnestheticsScene.js';
import { renderOpioidScene, stopOpioidScene } from './opioidsScene.js';
import { renderNMBScene, stopNMBScene } from './nmbScene.js';
import { renderAnesthesiaMachineScene, stopAnesthesiaMachineScene } from './anesthesiaMachineScene.js';
import { SCENE_REGISTRY, runScene, stopActiveScene } from './sceneRegistry.js';
import { getNodeConfig } from '../core/nodeConfig.js';
import { loadState, saveState, updateRecallStats } from '../core/state.js';

/**
 * Returns a safe display string for the correct answer of any question type,
 * or null if no valid answer string can be found.
 * Priority: canonicalAnswer → correctAnswers[0] → acceptedAnswers[0] → accepted[0]
 * Never returns undefined or an empty string.
 */
function _getCorrectAnswerDisplay(q) {
  const candidates = [
    q.canonicalAnswer,
    q.correctAnswers?.[0],
    q.acceptedAnswers?.[0],
    q.accepted?.[0],
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c;
  }
  return null;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── multi-select state ───────────────────────────────────────────────────────

let multiSelectState = { selected: new Set(), requiredCount: 0 };

// ─── Web Audio synthesizer ──────────────────────────────────────────────────

let _audioCtx = null;
function _audio() {
  if (!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  return _audioCtx;
}

function playTone(freq, duration = 0.1, type = 'sine', vol = 0.15) {
  const ctx = _audio();
  if (!ctx) return;
  try {
    const state = loadState();
    if (state.soundMuted) return;
  } catch(e) {}
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

window.playCorrect = () => playTone(880, 0.08, 'sine', 0.12);
window.playWrong = () => { playTone(160, 0.18, 'sawtooth', 0.18); setTimeout(() => playTone(110, 0.22, 'sawtooth', 0.18), 80); };
window.playStreak3 = () => { [523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 0.12, 'sine', 0.15), i * 100)); };
window.playStreak5 = () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.1, 'square', 0.12), i * 80)); };
window.playWalk = () => playTone(440, 0.4, 'triangle', 0.2);
window.playCode = () => { [220, 165, 110, 60].forEach((f, i) => setTimeout(() => playTone(f, 0.3, 'sawtooth', 0.2), i * 100)); };

// ─── timer ────────────────────────────────────────────────────────────────────

let _timerInterval = null;
const QUESTION_TIME_SEC = 60;
let _remaining = 0;
let _currentTimerQ = null; // current question, used by resumeQuestionTimer

function _getTimerDuration() {
  const mode = window._sessionMode;
  if (mode === 'code-blue') return 15;
  if (mode === 'study') return 0; // no timer
  return QUESTION_TIME_SEC;
}

function startQuestionTimer(q) {
  clearInterval(_timerInterval);
  _timerInterval = null;

  // Study mode: no timer
  const duration = _getTimerDuration();
  if (duration === 0) {
    const fill = document.getElementById('tmr-fill');
    if (fill) { fill.style.width = '0%'; }
    return;
  }

  _currentTimerQ = q;
  _remaining = duration;
  const fill = document.getElementById('tmr-fill');
  if (fill) {
    fill.style.transition = 'background 300ms ease';
    fill.style.width = '100%';
    fill.style.background = 'var(--green,#00ffa3)';
  }

  console.log('Timer start:', _remaining, 'for', q.id);
  const _timerTotal = duration;

  _timerInterval = setInterval(() => {
    _remaining--;
    const pct = Math.max(0, (_remaining / _timerTotal) * 100);

    if (fill) {
      fill.style.width = pct + '%';
      if (pct < 25) fill.style.background = 'var(--red,#ff3366)';
      else if (pct < 50) fill.style.background = 'var(--amber,#ffc400)';
      else fill.style.background = 'var(--green,#00ffa3)';
    }

    if (_remaining <= 0) {
      clearInterval(_timerInterval);
      _timerInterval = null;
      console.log('Timer expired for question:', q.id);
      _disableAllInputs();
      const _ans = _getCorrectAnswerDisplay(q);
      const msg = _ans ? `Correct: ${_ans}` : '';
      showAnswerFeedback(false, (q.rationale || q.ex || '') + (msg ? '\n\n' + msg : ''));
      if (window.submitAnswer) window.submitAnswer(false);
    }
  }, 1000);
}

export function stopTimer() {
  clearInterval(_timerInterval);
  _timerInterval = null;
}

/** Add seconds to the currently running question timer (for +Time powerup). */
export function addQuestionTime(seconds) {
  _remaining = Math.min(_remaining + seconds, QUESTION_TIME_SEC);
}

/**
 * Resume the question timer after stopTimer() was called (e.g. closing the store).
 * Uses _remaining and _currentTimerQ set by the last startQuestionTimer() call.
 * No-op if the timer is already running or there's nothing to resume.
 */
export function resumeQuestionTimer() {
  if (_timerInterval || _remaining <= 0 || !_currentTimerQ) return;
  const q    = _currentTimerQ;
  const fill = document.getElementById('tmr-fill');
  _timerInterval = setInterval(() => {
    _remaining--;
    const pct = Math.max(0, (_remaining / QUESTION_TIME_SEC) * 100);
    if (fill) {
      fill.style.width = pct + '%';
      if (pct < 25) fill.style.background = '#ff2200';
    }
    if (_remaining <= 0) {
      clearInterval(_timerInterval);
      _timerInterval = null;
      _disableAllInputs();
      const _ans = _getCorrectAnswerDisplay(q);
      const msg = _ans ? `Correct: ${_ans}` : '';
      showAnswerFeedback(false, (q.rationale || q.ex || '') + (msg ? '\n\n' + msg : ''));
      if (window.submitAnswer) window.submitAnswer(false);
    }
  }, 1000);
}

function _disableAllInputs() {
  document.querySelectorAll('#ans-grid .abtn').forEach(b => b.disabled = true);
  document.querySelectorAll('#multi-area button').forEach(b => b.disabled = true);
  const inp = document.getElementById('type-input');
  if (inp) inp.disabled = true;
  const tsub = document.getElementById('type-submit');
  if (tsub) tsub.disabled = true;
  const rinp = document.getElementById('recall-input');
  if (rinp) rinp.disabled = true;
  const rsub = document.getElementById('recall-submit-btn');
  if (rsub) rsub.disabled = true;
}

// ─── validation ───────────────────────────────────────────────────────────────

function _validateQuestion(q) {
  if (!q) { console.warn('[VALIDATE] null question'); return false; }
  let ok = true;
  if (!q.id) { console.warn('[VALIDATE] missing id', q); ok = false; }
  if (!q.type) { console.warn('[VALIDATE] missing type', q.id); ok = false; }

  if (q.type === 'mcq') {
    if (!q.ans || q.ans.length === 0) {
      console.warn('[VALIDATE]', q.id, 'MCQ: missing ans array — choices:', q.choices);
      // auto-repair if choices exist
      if (q.choices && q.correctAnswers) {
        q.ans = q.choices.map(c => ({ t: c, ok: q.correctAnswers.includes(c) }));
        console.log('[VALIDATE] auto-repaired MCQ ans from choices');
      } else { ok = false; }
    }
  }

  if (q.type === 'multi') {
    if (!q.choices || q.choices.length === 0) {
      console.warn('[VALIDATE]', q.id, 'multi: missing choices');
      ok = false;
    }
    if (!q.selectCount || q.selectCount < 1) {
      console.warn('[VALIDATE]', q.id, 'multi: missing selectCount — defaulting to 2');
      q.selectCount = q.correctAnswers?.length || 2;
    }
    if (!q.correctAnswers || q.correctAnswers.length === 0) {
      console.warn('[VALIDATE]', q.id, 'multi: missing correctAnswers');
      ok = false;
    }
  }

  if (q.type === 'short' || q.type === 'type') {
    const acc = q.acceptedAnswers || q.correctAnswers || [];
    if (acc.length === 0) {
      console.warn('[VALIDATE]', q.id, 'short: no accepted answers');
      ok = false;
    }
  }

  if (q.type === 'recall') {
    if (!q.q && !q.prompt) {
      console.warn('[VALIDATE]', q.id, 'recall: missing prompt');
      ok = false;
    }
    if (!q.rubric || !q.rubric.key_points || !q.rubric.key_points.length) {
      console.warn('[VALIDATE]', q.id, 'recall: missing rubric.key_points');
      ok = false;
    }
  }

  if (!q.rationale && !q.ex && q.type !== 'recall') {
    console.warn('[VALIDATE]', q.id, 'missing rationale (non-fatal)');
  }

  return ok;
}

// ─── HUD ─────────────────────────────────────────────────────────────────────

export function updateHUD() {
  const state = getCurrentRun();
  if (!state) return;

  const scv = document.getElementById('scv');
  const skv = document.getElementById('skv');
  const l1 = document.getElementById('l1');
  const l2 = document.getElementById('l2');
  const l3 = document.getElementById('l3');

  if (scv) scv.textContent = state.score.toLocaleString();

  const mult = state._lastMult || 1;
  if (skv) {
    if (state.streak >= 2) {
      skv.innerHTML = `\u{1F525}${state.streak}<span style="font-size:.55em;opacity:.85;margin-left:2px;">\u00D7${mult}</span>`;
      skv.style.color = mult >= 3 ? '#ff3366' : '#ffc400';
    } else if (state.streak === 1) {
      skv.textContent = `\u{1F525}1`;
      skv.style.color = 'var(--green, #00ffa3)';
    } else {
      skv.textContent = '\u2013';
      skv.style.color = 'var(--muted, #4a6282)';
    }
  }

  if (l1) l1.classList.toggle('dead', state.lives < 1);
  if (l2) l2.classList.toggle('dead', state.lives < 2);
  if (l3) l3.classList.toggle('dead', state.lives < 3);
  if (state.lives === 1 && l1) l1.classList.add('lastlife');
  else if (l1) l1.classList.remove('lastlife');

  // Skull: only show on last life
  const skull = document.querySelector('.ov-icon');
  if (skull) skull.classList.toggle('critical', state.lives === 1);

  // Update vitals display
  if (state.vitals) {
    const vhr  = document.getElementById('vhr');
    const vbp  = document.getElementById('vbp');
    const vsp  = document.getElementById('vsp');
    const vmap = document.getElementById('vmap');
    const v = state.vitals;
    const mapVal = Math.round(v.dbp + (v.sbp - v.dbp) / 3);

    if (vhr)  { vhr.textContent = v.hr;
                vhr.classList.toggle('bad',  v.hr > 110 || v.hr < 50);
                vhr.classList.toggle('warn', (v.hr > 90 && v.hr <= 110) || (v.hr >= 50 && v.hr < 60)); }
    if (vbp)  { vbp.textContent = `${v.sbp}/${v.dbp}`;
                vbp.classList.toggle('bad',  v.sbp < 90);
                vbp.classList.toggle('warn', v.sbp >= 90 && v.sbp < 110); }
    if (vsp)  { vsp.textContent = Math.round(v.spo2);
                vsp.classList.toggle('bad',  v.spo2 < 92);
                vsp.classList.toggle('warn', v.spo2 >= 92 && v.spo2 < 96); }
    if (vmap) { vmap.textContent = mapVal;
                vmap.classList.toggle('bad',  mapVal < 65);
                vmap.classList.toggle('warn', mapVal >= 65 && mapVal < 75); }
  }

  // Streak milestone banner
  if (state._streakMilestone) {
    const labels = { 3: '\u{1F525} ON FIRE', 5: '\u26A1 UNSTOPPABLE', 7: '\u{1F480} OVERLORD MODE' };
    const label = labels[state._streakMilestone];
    if (label) _showStreakBanner(label);
    state._streakMilestone = null;
  }

  // Ladder bar
  _updateLadderBar(state);
}

function _updateLadderBar(run) {
  const bar = document.getElementById('ladder-bar');
  if (!bar || !run) { if (bar) bar.innerHTML = ''; return; }

  const total = Math.max(15, run.questions?.length || 15);
  let html = '';
  for (let i = 0; i < total; i++) {
    let bg = 'var(--muted-2,#384a66)';
    if (i < run.index) {
      const result = run.results?.[i];
      bg = result?.correct ? 'var(--green,#00ffa3)' : 'var(--red,#ff2e63)';
    } else if (i === run.index) {
      bg = 'var(--amber,#ffb000)';
    } else {
      if (i < 5) bg = 'rgba(0,255,163,.15)';
      else if (i < 10) bg = 'rgba(255,176,0,.15)';
      else if (i < 14) bg = 'rgba(255,46,99,.15)';
      else bg = 'rgba(255,46,99,.4)';
    }
    const isSafe = (i === 4 || i === 9);
    const safeShadow = isSafe ? 'box-shadow:0 0 4px var(--amber,#ffb000);' : '';
    html += `<div style="flex:1;background:${bg};border-radius:1px;${safeShadow}transition:background 200ms var(--ease-out,cubic-bezier(.23,1,.32,1));"></div>`;
  }
  bar.innerHTML = html;
}

window._showStreakBanner = _showStreakBanner;
function _showStreakBanner(text) {
  const run = getCurrentRun();
  const streak = run?.streak || 0;
  const mult = run?._lastMult || 1;

  // Determine tier
  let tier = 'fire';    // orange
  let tierColor = 'var(--amber,#ffb000)';
  let tierGlow = 'rgba(255,176,0,.5)';
  if (streak >= 7) { tier = 'overlord'; tierColor = 'var(--red,#ff2e63)'; tierGlow = 'rgba(255,46,99,.5)'; }
  else if (streak >= 5) { tier = 'unstoppable'; tierColor = 'var(--amber,#ffb000)'; tierGlow = 'rgba(255,176,0,.5)'; }

  // Build takeover overlay
  let ov = document.getElementById('streak-overlay');
  if (ov) ov.remove();
  ov = document.createElement('div');
  ov.id = 'streak-overlay';
  ov.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:center;`;

  // Backdrop
  const bd = document.createElement('div');
  bd.style.cssText = `position:absolute;inset:0;background:rgba(0,0,0,.75);opacity:0;transition:opacity 180ms var(--ease-out,cubic-bezier(.23,1,.32,1));`;
  ov.appendChild(bd);

  // Center content
  const center = document.createElement('div');
  center.style.cssText = `position:relative;text-align:center;opacity:0;transform:scale(0.7);transition:opacity 260ms var(--ease-out) 180ms,transform 260ms var(--ease-out) 180ms;`;
  center.innerHTML = `
    <div style="font-family:var(--fd);font-size:4rem;font-weight:700;color:${tierColor};text-shadow:0 0 40px ${tierGlow},0 0 80px ${tierGlow};line-height:1;">${streak} <span style="font-size:2rem;opacity:.8;">\u00D7${mult}</span></div>
    <div style="font-family:var(--fd);font-size:1.6rem;font-weight:700;color:${tierColor};letter-spacing:.15em;margin-top:.3rem;text-shadow:0 0 20px ${tierGlow};">${text}</div>
    <div style="font-family:var(--fm);font-size:.6rem;color:var(--txt-2,#a3b3c9);margin-top:.5rem;letter-spacing:.1em;">KEEP GOING</div>
  `;
  ov.appendChild(center);

  document.body.appendChild(ov);

  // Audio cue
  if (streak >= 5 && typeof window.playStreak5 === 'function') window.playStreak5();
  else if (typeof window.playStreak3 === 'function') window.playStreak3();

  // Animate in
  requestAnimationFrame(() => {
    bd.style.opacity = '1';
    center.style.opacity = '1';
    center.style.transform = 'scale(1)';
  });

  // Auto dismiss after 2s
  setTimeout(() => {
    bd.style.opacity = '0';
    center.style.opacity = '0';
    center.style.transform = 'scale(0.95)';
    setTimeout(() => ov.remove(), 300);
  }, 1700);
}

// ─── First-run tutorial ──────────────────────────────────────────────────────

function _showTutorial() {
  // Pause the timer during tutorial
  stopTimer();

  const steps = [
    { text: "These are your patient's vitals.<br><b>Wrong answers degrade them. Right answers stabilize them.</b>", highlight: '#hud' },
    { text: "This is your timer.<br><b>Don't waste it.</b> Time runs out, the patient loses a life.", highlight: '#tmr-wrap' },
    { text: "Pick the right answer.<br><b>Build a streak.</b> 3 in a row triggers a multiplier.", highlight: '#ans-area' },
    { text: "Earn points, buy equipment in the store.<br><b>Equipment helps when you are stuck.</b>", highlight: '#pwr-row' },
  ];

  let idx = 0;
  const overlay = document.createElement('div');
  overlay.id = 'tutorial-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;pointer-events:auto;';

  const ring = document.createElement('div');
  ring.style.cssText = 'position:absolute;border:2px solid var(--green,#00ffa3);border-radius:6px;box-shadow:0 0 0 9999px rgba(0,0,0,.78),0 0 20px var(--green,#00ffa3);pointer-events:none;transition:all .3s ease;z-index:1;';
  overlay.appendChild(ring);

  const card = document.createElement('div');
  card.style.cssText = 'position:absolute;background:var(--card,#0c1828);border:2px solid var(--green,#00ffa3);border-radius:10px;padding:1rem 1.2rem;max-width:300px;text-align:center;box-shadow:0 0 40px rgba(0,255,163,.3);z-index:2;';
  overlay.appendChild(card);

  function show() {
    const step = steps[idx];
    const isLast = idx === steps.length - 1;
    const target = document.querySelector(step.highlight);
    if (target) {
      const r = target.getBoundingClientRect();
      const pad = 6;
      ring.style.left = `${r.left - pad}px`;
      ring.style.top  = `${r.top - pad}px`;
      ring.style.width  = `${r.width + pad * 2}px`;
      ring.style.height = `${r.height + pad * 2}px`;
    }

    card.innerHTML = `
      <div style="font-size:.8rem;color:var(--txt,#dce8f5);margin-bottom:.7rem;line-height:1.55;">${step.text}</div>
      <div style="font-size:.5rem;color:var(--muted,#4a6282);letter-spacing:.15em;margin-bottom:.6rem;">STEP ${idx+1} OF ${steps.length}</div>
      <button id="tutorial-next" style="background:transparent;border:2px solid var(--green,#00ffa3);color:var(--green,#00ffa3);font-family:var(--fd);font-size:.78rem;font-weight:700;padding:.45rem 1.6rem;cursor:pointer;border-radius:4px;letter-spacing:.1em;">${isLast ? 'GOT IT' : 'NEXT'}</button>
      ${isLast ? '' : '<button id="tutorial-skip" style="background:transparent;border:none;color:var(--muted,#4a6282);font-family:var(--fb);font-size:.6rem;padding:.3rem;margin-left:.6rem;cursor:pointer;">SKIP</button>'}
    `;

    const targetRect = target ? target.getBoundingClientRect() : { bottom: 0, left: 0, top: 0 };
    const cardW = 300, cardH = 160;
    const vw = window.innerWidth, vh = window.innerHeight;
    let cardLeft = Math.min(Math.max(targetRect.left, 12), vw - cardW - 12);
    let cardTop;
    if (targetRect.bottom + cardH + 30 < vh) cardTop = targetRect.bottom + 18;
    else if (targetRect.top - cardH - 30 > 0) cardTop = targetRect.top - cardH - 18;
    else cardTop = vh / 2 - cardH / 2;
    card.style.left = `${cardLeft}px`;
    card.style.top  = `${cardTop}px`;

    function dismiss() {
      overlay.remove();
      const s = loadState(); s.tutorialSeen = true; saveState(s);
    }
    document.getElementById('tutorial-next').onclick = () => {
      idx++;
      if (idx >= steps.length) dismiss();
      else show();
    };
    const skipBtn = document.getElementById('tutorial-skip');
    if (skipBtn) skipBtn.onclick = dismiss;
  }

  document.body.appendChild(overlay);
  requestAnimationFrame(() => requestAnimationFrame(show));
}

// ─── Recall First helpers ─────────────────────────────────────────────────────

/**
 * Render the correct answer UI for the current question type.
 * Called immediately on normal flow, or on "Ready" button click in recall mode.
 */
function _renderAnswerOptions(q) {
  const clickInst = document.getElementById('click-inst');
  if (q.type === 'short' || q.type === 'type') {
    renderShortAnswerUI(q);
  } else if (q.type === 'multi') {
    renderMultiSelectUI(q);
  } else if (q.type === 'click') {
    if (clickInst) clickInst.style.display = 'block';
  } else {
    renderMCQUI(q);
  }
}

/**
 * Show the recall phase: stem is visible, answers are hidden, timer not started.
 * A single "Ready for Answer Options" button transitions to normal answer flow.
 */
function _showRecallPhase(q) {
  // Show timer bar in dimmed/waiting state (gray, full width = not counting yet)
  const fill = document.getElementById('tmr-fill');
  if (fill) {
    fill.style.transition = 'none';
    fill.style.width = '100%';
    fill.style.background = 'rgba(80,80,100,.35)';
  }

  // Inject the reveal button into #ans-area
  const ansArea = document.getElementById('ans-area') || document.getElementById('ch-card');
  if (!ansArea) return;

  const btn = document.createElement('button');
  btn.id = 'recall-reveal-btn';
  btn.className = 'big-btn green';
  btn.style.cssText = 'width:100%;margin-top:.6rem;font-size:.82rem;padding:.6rem 1rem;animation:none;';
  btn.textContent = '⚡ Ready for Answer Options';
  btn.onclick = () => {
    btn.remove();
    _renderAnswerOptions(q);
    // Respect untimed flag — math/drip nodes skip the timer even in recall mode
    const _nodeId = window.currentSession?.nodeId || null;
    const _nodeCfg = _nodeId ? getNodeConfig(_nodeId) : null;
    const _untimed = q.metadata?.untimed || q.untimed || _nodeCfg?.untimed || false;
    if (!_untimed) startQuestionTimer(q);
  };
  ansArea.appendChild(btn);
}

// ─── main question renderer ───────────────────────────────────────────────────

export function renderCurrentQuestion() {
  const state = getCurrentRun();
  if (!state) return;

  const q = state.questions[state.index];
  if (!q) return;

  // First-run tutorial coachmarks
  if (!state._tutorialShown) {
    const userState = loadState();
    if (!userState.tutorialSeen) {
      state._tutorialShown = true;
      _showTutorial();
    }
  }

  // Boss case banner
  if (q._isBoss && !state._bossAnnounced) {
    state._bossAnnounced = true;
    _showStreakBanner('BOSS CASE');
    if (typeof window.vossSay === 'function') {
      window.vossSay('ON_GAME_START'); // reuse start quotes for dramatic effect
    }
  }

  console.log('Rendering question:', q.id, q.type, q);

  // Validate (auto-repairs where possible)
  _validateQuestion(q);

  // Reset multi-select state
  multiSelectState = { selected: new Set(), requiredCount: q.selectCount || 0 };

  // Ensure question panel is visible
  const chWrap = document.getElementById('ch-wrap');
  if (chWrap) chWrap.classList.add('on');

  // Fill header fields — dynamic per node
  const chb = document.getElementById('chb');
  const ovs = document.getElementById('ovs');
  const qtxt = document.getElementById('qtxt');
  {
    const nodeId = window.currentSession?.nodeId || null;
    const cfg = nodeId ? getNodeConfig(nodeId) : null;
    const chapterLabel = cfg?.chapterLabel || 'Ch. ?';
    const defaultTitle  = cfg?.title || 'Study';
    const topic = q.metadata?.topic || q.metadata?.topicId || defaultTitle;
    if (chb) {
      const rIdx = state.index;
      const tier = rIdx < 5 ? 'PRE-INDUCTION' : rIdx < 10 ? 'MAINTENANCE' : rIdx < 14 ? 'CRITICAL' : 'CODE BLUE';
      const tierColor = rIdx < 5 ? 'var(--green,#00ffa3)' : rIdx < 10 ? 'var(--amber,#ffb000)' : 'var(--red,#ff2e63)';
      const reward = LADDER_REWARDS[Math.min(rIdx, LADDER_REWARDS.length - 1)];
      chb.innerHTML = `<span style="color:${tierColor};font-weight:700;">${tier}</span> · Q${rIdx + 1}/${state.questions.length} · <span style="color:var(--amber,#ffb000);">${reward}pts</span>`;
    }
  }
  if (ovs) ovs.textContent = q.setup || '';
  if (qtxt) qtxt.textContent = q.q || '';

  // Remove any leftover recall reveal button from previous question
  document.getElementById('recall-reveal-btn')?.remove();

  // Hide all answer areas
  const typeArea   = document.getElementById('type-area');
  const ansGrid    = document.getElementById('ans-grid');
  const clickInst  = document.getElementById('click-inst');
  const multiArea  = document.getElementById('multi-area');
  const recallArea = document.getElementById('recall-area');
  if (typeArea)   typeArea.style.display   = 'none';
  if (ansGrid)    ansGrid.style.display    = 'none';
  if (clickInst)  clickInst.style.display  = 'none';
  if (multiArea)  multiArea.style.display  = 'none';
  if (recallArea) recallArea.style.display = 'none';

  console.log('QUESTION TYPE:', q.type, '| id:', q.id);
  if (q.type === 'multi') console.log('Choices:', q.choices);

  // Determine whether this question/node should skip the timer.
  // Questions with metadata.untimed === true (e.g. math/drip nodes) run
  // without a countdown. The timer bar is hidden so the learner can work
  // through stepwise calculations at their own pace.
  const nodeId = window.currentSession?.nodeId || null;
  const nodeCfg = nodeId ? getNodeConfig(nodeId) : null;
  const isUntimed = q.metadata?.untimed
    || q.untimed
    || nodeCfg?.untimed
    || false;

  if (isUntimed) {
    // Hide the timer bar entirely for untimed questions
    const fill = document.getElementById('tmr-fill');
    if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
  }

  // Free recall questions get their own renderer and timer logic
  if (q.type === 'recall') {
    renderRecallUI(q);
    if (!isUntimed && window._sessionMode !== 'study') {
      const recallTime = window._sessionMode === 'code-blue' ? 45 : 90;
      _remaining = recallTime;
      startQuestionTimer(q);
    }
  } else if (loadState().recallFirstEnabled) {
    // Recall First: show stem only, hold timer until user clicks ready
    _showRecallPhase(q);
  } else {
    // Normal path: render answers and start timer immediately (unless untimed)
    _renderAnswerOptions(q);
    if (!isUntimed) startQuestionTimer(q);
  }

  // Render themed scene — three-tier dispatch:
  //   1. Question-level scene (data-driven, agent-generatable):
  //        q.scene is a registry kind and q.sceneCfg carries its params.
  //   2. Node-level scene (legacy, hand-written per-node files):
  //        NODE_CONFIG[nodeId].sceneRendererName is a global function name.
  //   3. Final fallback: opioid scene, preserves old behavior.
  //
  // Whatever we pick, we first tear down whatever was running so raf loops
  // don't pile up.
  {
    const nodeId = window.currentSession?.nodeId || null;
    const cfg = nodeId ? getNodeConfig(nodeId) : null;

    // Stop prior registry-driven scene (if any).
    try { stopActiveScene(); } catch (_) {}
    // Stop prior node-level scene (if any).
    if (cfg?.stopSceneName && typeof window[cfg.stopSceneName] === 'function') {
      try { window[cfg.stopSceneName](); } catch (_) {}
    }

    if (q.scene && SCENE_REGISTRY[q.scene]) {
      // Tier 1: data-driven registry scene.
      runScene(q.scene, q.sceneCfg || {});
    } else if (cfg?.sceneRendererName && typeof window[cfg.sceneRendererName] === 'function') {
      // Tier 2: legacy per-node renderer.
      window[cfg.sceneRendererName](q);
    } else {
      // Tier 3: last-resort fallback.
      renderOpioidScene(q);
    }
  }
}

// ─── MCQ ─────────────────────────────────────────────────────────────────────

function renderMCQUI(q) {
  const ansGrid = document.getElementById('ans-grid');
  if (!ansGrid) return;

  ansGrid.style.display = 'grid';
  
  // Cache shuffled answers to prevent reshuffling on re-render
  if (!q._shuffledAns) {
    q._shuffledAns = shuffleArray([...q.ans]);
    console.log("MCQ shuffled:", q.id, q._shuffledAns);
  }
  const shuffled = q._shuffledAns;
  
  const n = shuffled.length || 3;
  ansGrid.style.gridTemplateColumns = n === 4 ? 'repeat(2,1fr)' : `repeat(${Math.min(n, 3)},1fr)`;
  ansGrid.innerHTML = '';

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  shuffled.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.id = `b${idx}`;
    btn.className = 'abtn';
    btn.dataset.ansIdx = idx;
    btn.innerHTML = `<span class="ans-chip">${letters[idx] || ''}</span> ${choice.t || ''}`;
    btn.onclick = () => _selectMCQAnswer(q, ansGrid, idx);
    ansGrid.appendChild(btn);
  });
}

function _selectMCQAnswer(q, ansGrid, idx) {
  if (!q || !q._shuffledAns) return;
  const choice = q._shuffledAns[idx];
  if (!choice) return;
  const btns = ansGrid.querySelectorAll('.abtn');
  btns.forEach((b, i) => {
    b.disabled = true;
    if (q._shuffledAns[i]?.ok) b.classList.add('correct');
  });
  if (!choice.ok) btns[idx]?.classList.add('wrong');

  if (choice.ok) {
    _flashEdge('var(--green,#00ffa3)');
    if (typeof window.playCorrect === 'function') window.playCorrect();
  } else {
    _onWrongAnswer();
  }

  showAnswerFeedback(Boolean(choice.ok), q.rationale || q.ex, choice.t);
  if (window.submitAnswer) window.submitAnswer(Boolean(choice.ok));
}

function _showWalkScreen(run) {
  const correctCount = run.results.filter(r => r.correct).length;
  const totalCount = run.results.length;
  const pct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const tierReached = run.index >= 14 ? 'CODE BLUE' : run.index >= 10 ? 'CRITICAL' : run.index >= 5 ? 'MAINTENANCE' : 'PRE-INDUCTION';

  // Play the walk sound
  if (typeof window.playWalk === 'function') window.playWalk();

  // Build the walk overlay
  const ov = document.createElement('div');
  ov.id = 'walk-overlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(3,6,12,.95);opacity:0;transition:opacity 300ms var(--ease-out,cubic-bezier(.23,1,.32,1));pointer-events:auto;';

  const card = document.createElement('div');
  card.style.cssText = 'text-align:center;max-width:360px;width:90%;transform:scale(0.9);transition:transform 350ms var(--ease-out);';

  // Animate the points counter
  const ptsDisplay = run.score.toLocaleString();

  card.innerHTML = `
    <div style="font-family:var(--fm);font-size:.55rem;color:var(--amber,#ffb000);letter-spacing:.3em;margin-bottom:.6rem;">YOU WALKED AWAY</div>
    <div style="font-family:var(--fd);font-size:clamp(3rem,10vw,5rem);font-weight:700;color:var(--amber,#ffb000);line-height:.9;text-shadow:0 0 40px rgba(255,176,0,.4);">+${ptsDisplay}</div>
    <div style="font-family:var(--fm);font-size:.7rem;color:var(--txt-2,#a3b3c9);margin-top:.3rem;letter-spacing:.12em;">POINTS BANKED</div>

    <div style="display:flex;justify-content:center;gap:1.5rem;margin-top:1.5rem;margin-bottom:1.5rem;">
      <div style="text-align:center;">
        <div style="font-family:var(--fd);font-size:1.8rem;font-weight:700;color:var(--green,#00ffa3);line-height:1;">${pct}%</div>
        <div style="font-family:var(--fm);font-size:.4rem;color:var(--muted,#5a6f8a);letter-spacing:.15em;margin-top:.2rem;">ACCURACY</div>
      </div>
      <div style="text-align:center;">
        <div style="font-family:var(--fd);font-size:1.8rem;font-weight:700;color:var(--txt,#e5edf7);line-height:1;">${correctCount}/${totalCount}</div>
        <div style="font-family:var(--fm);font-size:.4rem;color:var(--muted,#5a6f8a);letter-spacing:.15em;margin-top:.2rem;">CORRECT</div>
      </div>
      <div style="text-align:center;">
        <div style="font-family:var(--fd);font-size:1.8rem;font-weight:700;color:var(--amber,#ffb000);line-height:1;">${run.bestStreak}</div>
        <div style="font-family:var(--fm);font-size:.4rem;color:var(--muted,#5a6f8a);letter-spacing:.15em;margin-top:.2rem;">BEST STREAK</div>
      </div>
    </div>

    <div style="font-family:var(--fm);font-size:.5rem;color:var(--muted,#5a6f8a);letter-spacing:.15em;margin-bottom:1.5rem;">${tierReached} TIER REACHED</div>

    <button id="walk-continue" style="background:var(--amber,#ffb000);border:none;color:#000;font-family:var(--fd);font-size:1rem;font-weight:700;letter-spacing:.15em;padding:.8rem 2rem;border-radius:4px;cursor:pointer;transition:transform 130ms var(--ease-out);">CONTINUE</button>
  `;

  ov.appendChild(card);
  document.body.appendChild(ov);

  requestAnimationFrame(() => {
    ov.style.opacity = '1';
    card.style.transform = 'scale(1)';
  });

  // Play a celebratory ascending tone after a short delay
  setTimeout(() => {
    if (typeof window.playStreak3 === 'function') window.playStreak3();
  }, 400);

  document.getElementById('walk-continue').onclick = () => {
    ov.style.opacity = '0';
    setTimeout(() => {
      ov.remove();
      // Bank the points and go to game over which leads to course menu
      if (typeof window._showNewEngineGameOver === 'function') {
        window._showNewEngineGameOver(run);
      }
    }, 300);
  };
}

function _onWrongAnswer() {
  // Red edge flash (more pronounced)
  _flashEdge('var(--red,#ff2e63)');

  // Vital alarm pulse
  ['vhr','vbp','vsp','vmap'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.animation = 'vital-alarm 0.8s ease';
      setTimeout(() => { el.style.animation = ''; }, 850);
    }
  });

  // Scene dim
  const scn = document.getElementById('scn');
  if (scn) {
    scn.style.transition = 'opacity 200ms var(--ease-out,cubic-bezier(.23,1,.32,1))';
    scn.style.opacity = '0.3';
    setTimeout(() => { scn.style.opacity = '1'; }, 600);
  }

  // Haptic
  if (navigator.vibrate) navigator.vibrate([60, 40, 60]);

  // Audio
  if (typeof window.playWrong === 'function') window.playWrong();
}

function _flashEdge(color) {
  let el = document.getElementById('edge-flash');
  if (!el) {
    el = document.createElement('div');
    el.id = 'edge-flash';
    el.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;border:3px solid transparent;border-radius:0;opacity:0;transition:opacity 80ms ease,border-color 80ms ease;';
    document.body.appendChild(el);
  }
  el.style.borderColor = color;
  el.style.opacity = '0.6';
  setTimeout(() => { el.style.opacity = '0'; }, 150);
}

// Keyboard shortcuts for MCQ: A/B/C/D or 1/2/3/4
document.addEventListener('keydown', (e) => {
  if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  const game = document.getElementById('game');
  if (!game || game.style.display === 'none') return;

  const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
  const idx = keyMap[e.key.toLowerCase()];
  if (idx === undefined) return;

  const ansGrid = document.getElementById('ans-grid');
  if (!ansGrid || ansGrid.style.display === 'none') return;

  const btn = ansGrid.querySelector(`.abtn[data-ans-idx="${idx}"]`);
  if (btn && !btn.disabled) btn.click();
});

// ─── MULTI-SELECT ─────────────────────────────────────────────────────────────
// BUG FIX: previous code did chCard.insertBefore(multiArea, ansGrid.nextSibling)
// ansGrid is inside #ans-area, NOT a direct child of #ch-card, so that threw
// HierarchyRequestError and aborted the function before any choices rendered.

function renderMultiSelectUI(q) {
  let multiArea = document.getElementById('multi-area');

  if (!multiArea) {
    multiArea = document.createElement('div');
    multiArea.id = 'multi-area';
    multiArea.className = 'multi-area';
    // Insert inside #ans-area (correct parent) — not ch-card
    const ansArea = document.getElementById('ans-area');
    if (ansArea) {
      ansArea.appendChild(multiArea);
    } else {
      const chCard = document.getElementById('ch-card');
      if (chCard) chCard.appendChild(multiArea);
    }
  }

  multiArea.style.display = 'flex';
  multiArea.style.flexDirection = 'column';
  multiArea.style.gap = '.4rem';
  multiArea.innerHTML = '';

  // Instruction
  const inst = document.createElement('div');
  inst.className = 'multi-instruction';
  inst.textContent = `Select ${q.selectCount} answer${q.selectCount > 1 ? 's' : ''}`;
  multiArea.appendChild(inst);

  // Counter
  const counter = document.createElement('div');
  counter.id = 'multi-counter';
  counter.className = 'multi-counter';
  counter.textContent = `Selected: 0 / ${q.selectCount}`;
  multiArea.appendChild(counter);

  // Choices grid
  const grid = document.createElement('div');
  grid.className = 'multi-choices-grid';
  grid.style.gridTemplateColumns = 'repeat(2,1fr)';
  multiArea.appendChild(grid);

  // Cache shuffled choices to prevent reshuffling on re-render
  if (!q._shuffledChoices) {
    q._shuffledChoices = shuffleArray([...q.choices]);
    console.log("MULTI shuffled:", q.id, q._shuffledChoices);
  }
  const shuffled = q._shuffledChoices;

  shuffled.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'multi-btn';
    btn.textContent = choice;
    btn.dataset.choice = choice;
    btn.onclick = () => _toggleMultiChoice(btn, choice, q);
    grid.appendChild(btn);
  });

  // Submit button
  const sub = document.createElement('button');
  sub.id = 'multi-submit';
  sub.className = 'multi-submit disabled';
  sub.textContent = 'Submit Answer';
  sub.disabled = true;
  sub.onclick = () => _submitMulti(q);
  multiArea.appendChild(sub);
}

function _toggleMultiChoice(btn, choice, q) {
  if (multiSelectState.selected.has(choice)) {
    multiSelectState.selected.delete(choice);
    btn.classList.remove('selected');
  } else if (multiSelectState.selected.size < q.selectCount) {
    multiSelectState.selected.add(choice);
    btn.classList.add('selected');
  }

  const counter = document.getElementById('multi-counter');
  if (counter) counter.textContent = `Selected: ${multiSelectState.selected.size} / ${q.selectCount}`;

  const sub = document.getElementById('multi-submit');
  const ready = multiSelectState.selected.size === q.selectCount;
  if (sub) {
    sub.disabled = !ready;
    sub.classList.toggle('disabled', !ready);
  }

  // Auto-submit when target count reached (220ms pause so user sees their selection)
  if (ready) {
    if (counter) counter.textContent = `Submitting...`;
    setTimeout(() => {
      if (sub && !sub.disabled) sub.click();
    }, 220);
  }
}

function _submitMulti(q) {
  const userAnswers = Array.from(multiSelectState.selected);
  const result = gradeMultiSelect(userAnswers, q);

  // Highlight buttons
  const multiArea = document.getElementById('multi-area');
  if (multiArea) {
    multiArea.querySelectorAll('.multi-btn').forEach(btn => {
      const c = btn.dataset.choice;
      btn.disabled = true;
      if (q.correctAnswers.includes(c)) btn.classList.add('correct');
      else if (multiSelectState.selected.has(c)) btn.classList.add('wrong');
    });
    const sub = document.getElementById('multi-submit');
    if (sub) sub.style.display = 'none';
  }

  showAnswerFeedback(result.correct, q.rationale || q.ex);
  if (window.submitAnswer) window.submitAnswer(result.correct);
}

// ─── SHORT ANSWER ─────────────────────────────────────────────────────────────

function renderShortAnswerUI(q) {
  const typeArea = document.getElementById('type-area');
  if (!typeArea) return;

  typeArea.style.display = 'block';
  typeArea.innerHTML = `
    <div class="type-row">
      <input type="text" id="type-input" placeholder="Type your answer…" autocomplete="off" spellcheck="false"/>
      <button id="type-submit">Submit</button>
    </div>
    <div class="type-hint">Press Enter or click Submit</div>
  `;

  const input = document.getElementById('type-input');
  const sub   = document.getElementById('type-submit');

  if (input) {
    input.focus();
    input.onkeydown = e => { if (e.key === 'Enter') _submitShortAnswer(q); };
  }
  if (sub) sub.onclick = () => _submitShortAnswer(q);
}

function _submitShortAnswer(q) {
  const input = document.getElementById('type-input');
  if (!input || !input.value.trim()) return;

  const userAnswer = input.value.trim();
  const result = gradeShortAnswer(userAnswer, q);

  input.disabled = true;
  const sub = document.getElementById('type-submit');
  if (sub) sub.style.display = 'none';

  let feedback = q.rationale || q.ex || '';
  if (!result.correct) {
    const best = _getCorrectAnswerDisplay(q);
    if (best) feedback = `Correct answer: ${best}\n\n${feedback}`;
  }

  showAnswerFeedback(result.correct, feedback, userAnswer);
  if (window.submitAnswer) window.submitAnswer(result.correct);
}

// ─── FREE RECALL ─────────────────────────────────────────────────────────────

let _speechRecognition = null;

function renderRecallUI(q) {
  const recallArea = document.getElementById('recall-area');
  if (!recallArea) return;

  recallArea.style.display = 'flex';

  const hasSpeechAPI = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  recallArea.innerHTML = `
    <textarea id="recall-input" placeholder="Type your answer in your own words..." rows="6"></textarea>
    <div class="recall-char-count" id="recall-char-count">0 / 20 MIN</div>
    <div class="recall-controls">
      ${hasSpeechAPI ? '<button class="recall-mic" id="recall-mic-btn">🎤 SPEAK</button>' : ''}
      <button class="recall-submit" id="recall-submit-btn" disabled>KEEP GOING...</button>
    </div>
    <div class="recall-grading-status" id="recall-grading-status">DR. VOSS IS REVIEWING...</div>
  `;

  const input = document.getElementById('recall-input');
  const submitBtn = document.getElementById('recall-submit-btn');
  const charCount = document.getElementById('recall-char-count');
  const micBtn = document.getElementById('recall-mic-btn');

  // Auto-resize textarea
  if (input) {
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, window.innerHeight * 0.5) + 'px';

      const len = input.value.length;
      if (charCount) charCount.textContent = len < 20 ? `${len} / 20 MIN` : `${len} CHARS`;

      if (submitBtn) {
        const ready = len >= 20;
        submitBtn.disabled = !ready;
        submitBtn.textContent = ready ? 'SUBMIT ANSWER →' : 'KEEP GOING...';
      }
    });

    input.focus();
  }

  // Submit handler
  if (submitBtn) {
    submitBtn.onclick = () => {
      if (input && input.value.length >= 20) {
        window._handleRecallSubmit(q);
      }
    };
  }

  // Voice input
  if (micBtn && hasSpeechAPI) {
    micBtn.onclick = () => _toggleSpeechRecognition(input, micBtn);
  }
}

function _toggleSpeechRecognition(textarea, btn) {
  if (_speechRecognition) {
    _speechRecognition.stop();
    _speechRecognition = null;
    btn.classList.remove('recording');
    btn.textContent = '🎤 SPEAK';
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  _speechRecognition = new SpeechRecognition();
  _speechRecognition.continuous = true;
  _speechRecognition.interimResults = true;
  _speechRecognition.lang = 'en-US';

  let finalTranscript = textarea.value;

  btn.classList.add('recording');
  btn.textContent = '⏹ STOP';

  _speechRecognition.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += (finalTranscript ? ' ' : '') + transcript;
      } else {
        interim += transcript;
      }
    }
    textarea.value = finalTranscript + (interim ? ' ' + interim : '');
    textarea.dispatchEvent(new Event('input'));
  };

  _speechRecognition.onerror = () => {
    _speechRecognition = null;
    btn.classList.remove('recording');
    btn.textContent = '🎤 SPEAK';
  };

  _speechRecognition.onend = () => {
    if (_speechRecognition) {
      _speechRecognition = null;
      btn.classList.remove('recording');
      btn.textContent = '🎤 SPEAK';
      textarea.value = finalTranscript;
      textarea.dispatchEvent(new Event('input'));
    }
  };

  _speechRecognition.start();
}

window._handleRecallSubmit = async function(q) {
  const input = document.getElementById('recall-input');
  const submitBtn = document.getElementById('recall-submit-btn');
  const micBtn = document.getElementById('recall-mic-btn');
  const gradingStatus = document.getElementById('recall-grading-status');

  if (!input || input.value.length < 20) return;

  const userAnswer = input.value;

  // Stop speech recognition if active
  if (_speechRecognition) {
    _speechRecognition.stop();
    _speechRecognition = null;
    if (micBtn) { micBtn.classList.remove('recording'); micBtn.textContent = '🎤 SPEAK'; }
  }

  // Disable inputs
  input.disabled = true;
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'GRADING...'; }
  if (micBtn) micBtn.disabled = true;

  // Pause timer
  stopTimer();

  // Show grading status
  if (gradingStatus) gradingStatus.classList.add('on');

  // Long-wait message
  const longWaitTimer = setTimeout(() => {
    if (gradingStatus) gradingStatus.textContent = 'DR. VOSS IS REVIEWING... SOMETIMES HE TAKES HIS TIME. STAND BY.';
  }, 15000);

  try {
    const result = await gradeRecallAnswer(q, userAnswer);

    clearTimeout(longWaitTimer);
    if (gradingStatus) gradingStatus.classList.remove('on');

    // Store result for feedback view
    window._lastRecallResult = { question: q, userAnswer, result };

    // Save recall stats
    updateRecallStats(q.id, result);

    // Show feedback view
    _showRecallFeedback(q, userAnswer, result);

    // Determine pass/fail for streak/lives
    const passed = result.score >= (q.rubric?.minimum_passing_score || 60);

    // Submit to game engine
    if (window.submitAnswer) window.submitAnswer(passed);

    // Apply partial credit override
    const run = getCurrentRun();
    if (run && result.score !== undefined) {
      const ladderIdx = Math.min(Math.max(run.index - 1, 0), LADDER_REWARDS.length - 1);
      const basePts = LADDER_REWARDS[ladderIdx];
      const partialPts = Math.floor(basePts * (result.score / 100));
      const fullPts = basePts * (run._lastMult || 1) * (run.mode === 'code-blue' ? 2 : 1);
      const diff = partialPts - fullPts;
      if (diff !== 0 && passed) {
        run.score += diff;
      }
    }
  } catch (err) {
    clearTimeout(longWaitTimer);
    console.error('[RECALL] Grading failed:', err);
    if (gradingStatus) gradingStatus.classList.remove('on');

    _showRecallFeedback(q, userAnswer, {
      score: 70, passed: true,
      captured: [], missed: [], errors: [],
      summary: 'Grading failed. Counted as correct — keep going.',
      voss_quip: 'Technical difficulties. Move on.',
      _fallback: true,
    });

    if (window.submitAnswer) window.submitAnswer(true);
  }
};

// ─── RECALL FEEDBACK VIEW ────────────────────────────────────────────────────

function _showRecallFeedback(q, userAnswer, result) {
  const recallArea = document.getElementById('recall-area');
  if (!recallArea) return;

  const score = result.score || 0;
  let scoreColor = 'var(--red,#ff2e63)';
  let scoreLabel = 'DR. VOSS IS DISAPPOINTED';
  if (score >= 80)      { scoreColor = 'var(--green,#00ffa3)'; scoreLabel = 'DR. VOSS APPROVES'; }
  else if (score >= 60) { scoreColor = 'var(--green-2,#00c485)'; scoreLabel = 'ADEQUATE'; }
  else if (score >= 40) { scoreColor = 'var(--amber,#ffb000)'; scoreLabel = 'DR. VOSS WILL ACCEPT THIS'; }

  const capturedHTML = (result.captured || []).map(c => {
    const kp = q.rubric?.key_points?.find(k => k.id === c.point_id);
    return `<div class="recall-fb-point recall-fb-captured" style="color:var(--green-2,#00c485);">
      ${kp?.description || c.point_id}
    </div>`;
  }).join('');

  const missedHTML = (result.missed || []).map(m => {
    return `<div class="recall-fb-point recall-fb-missed" style="color:var(--amber,#ffb000);">
      ${m.description || m.point_id}
    </div>`;
  }).join('');

  const errorsHTML = (result.errors || []).map(e => {
    return `<div class="recall-fb-error">
      <div class="recall-fb-error-stmt">You said: "${e.statement}"</div>
      <div class="recall-fb-error-fix">Correction: ${e.correction}</div>
    </div>`;
  }).join('');

  recallArea.innerHTML = `
    <div class="recall-feedback">
      <div class="recall-fb-header" style="color:${scoreColor};">${scoreLabel}</div>
      <div class="recall-fb-score ${score >= 80 ? 'recall-fb-score-glow' : ''}" style="color:${scoreColor};text-shadow:0 0 30px ${scoreColor}40;">${score}</div>

      ${result.voss_quip ? `<div class="recall-fb-quip">"${result.voss_quip}"<br><span style="font-size:.6rem;color:var(--muted);font-style:normal;">— DR. VOSS</span></div>` : ''}

      ${result.summary ? `<div style="font-size:.75rem;color:var(--txt-2);line-height:1.5;margin:.5rem 0;">${result.summary}</div>` : ''}

      ${capturedHTML ? `
        <div class="recall-fb-section">
          <div class="recall-fb-section-title" style="color:var(--green,#00ffa3);">✓ YOU CAPTURED</div>
          ${capturedHTML}
        </div>
      ` : ''}

      ${missedHTML ? `
        <div class="recall-fb-section">
          <div class="recall-fb-section-title" style="color:var(--amber,#ffb000);">✗ YOU MISSED</div>
          ${missedHTML}
        </div>
      ` : ''}

      ${errorsHTML ? `
        <div class="recall-fb-section">
          <div class="recall-fb-section-title" style="color:var(--red,#ff2e63);">⚠ FACTUAL ERRORS</div>
          ${errorsHTML}
        </div>
      ` : ''}

      <button class="recall-fb-toggle" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='block'?'none':'block'">YOUR ANSWER ▾</button>
      <div class="recall-fb-original">${_escapeHTML(userAnswer)}</div>

      <div class="recall-fb-buttons">
        <button class="recall-submit" onclick="window._showRecallReview()" style="border-color:var(--muted);color:var(--muted);">REVIEW RUBRIC</button>
        <button class="recall-submit" onclick="nextQ()">NEXT QUESTION →</button>
      </div>
    </div>
  `;

  // Stagger animation for child sections
  const sections = recallArea.querySelectorAll('.recall-fb-section, .recall-fb-quip, .recall-fb-buttons');
  sections.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = `opacity 200ms var(--ease-out) ${(i + 1) * 60}ms, transform 200ms var(--ease-out) ${(i + 1) * 60}ms`;
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  });

  // Voss reacts
  if (typeof window.vossSay === 'function') {
    if (score >= 80) window.vossSay('ON_CORRECT');
    else if (score >= 60) window.vossSay('ON_CORRECT');
    else window.vossSay('ON_WRONG');
  }

  // Sound
  if (score >= 60 && typeof window.playCorrect === 'function') window.playCorrect();
  else if (score < 60 && typeof window.playWrong === 'function') window.playWrong();
}

function _escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

window._showRecallReview = function() {
  const data = window._lastRecallResult;
  if (!data) return;

  const q = data.question;
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);pointer-events:auto;';

  const card = document.createElement('div');
  card.style.cssText = 'background:var(--card,#0e1a2e);border:2px solid var(--line-2,#243757);border-radius:12px;padding:1.5rem;max-width:500px;width:92%;max-height:80vh;overflow-y:auto;';

  const kpHTML = (q.rubric?.key_points || []).map(kp => {
    const captured = data.result.captured?.some(c => c.point_id === kp.id);
    const color = captured ? 'var(--green,#00ffa3)' : 'var(--amber,#ffb000)';
    const icon = captured ? '✓' : '✗';
    return `<div style="font-size:.75rem;color:${color};padding:.25rem 0;line-height:1.5;">${icon} [w:${kp.weight}] ${kp.description}</div>`;
  }).join('');

  card.innerHTML = `
    <div style="font-family:var(--fd);font-size:1rem;font-weight:700;color:var(--green,#00ffa3);letter-spacing:.1em;margin-bottom:.5rem;">RUBRIC REVIEW</div>
    <div style="font-family:var(--fb);font-size:.8rem;color:var(--txt);line-height:1.6;margin-bottom:1rem;">${q.q}</div>
    <div style="font-family:var(--fm);font-size:.5rem;color:var(--muted);letter-spacing:.15em;margin-bottom:.4rem;">KEY POINTS</div>
    ${kpHTML}
    <button onclick="this.closest('div[style*=fixed]').remove()" style="margin-top:1rem;width:100%;background:transparent;border:2px solid var(--green,#00ffa3);color:var(--green,#00ffa3);font-family:var(--fd);font-size:.8rem;font-weight:700;padding:.6rem;cursor:pointer;border-radius:4px;letter-spacing:.1em;">CLOSE</button>
  `;

  overlay.appendChild(card);
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  document.body.appendChild(overlay);
};

// ─── FEEDBACK OVERLAY ─────────────────────────────────────────────────────────

export function showAnswerFeedback(correct, rationale, userAnswer = null) {
  stopTimer(); // always stop timer when showing feedback

  const result = document.getElementById('result');
  if (!result) return;

  // Clear any inline styles left by the legacy engine (loadQ sets
  // style.opacity='0' / style.visibility='hidden' which override CSS classes).
  result.style.opacity = '';
  result.style.visibility = '';

  result.classList.add('on');
  result.classList.remove('win-bg', 'lose-bg');
  result.classList.add(correct ? 'win-bg' : 'lose-bg');

  const rv  = document.getElementById('r-v');
  const rq  = document.getElementById('r-q');
  const rex = document.getElementById('r-ex');

  if (rv)  rv.textContent  = correct ? 'CORRECT' : 'INCORRECT';
  if (rq)  rq.textContent  = userAnswer ? `Your answer: "${userAnswer}"` : '';
  if (rex) {
    rex.textContent = rationale || '';
    rex.style.whiteSpace = 'pre-wrap';
  }

  // SRNA reacts to answer
  if (typeof window._setSRNAState === 'function') {
    const run = getCurrentRun();
    if (correct && run && run.streak >= 3) {
      window._setSRNAState('confident', 3000);
    } else if (!correct) {
      window._setSRNAState('wipe_brow', 2000);
    }
  }

  // Voss reacts to correct/wrong
  if (typeof window.vossSay === 'function') {
    const run = getCurrentRun();
    if (run && run.lives === 1 && !correct) {
      window.vossSay('ON_LAST_LIFE');
    } else if (correct && run && run.streak === 3) {
      window.vossSay('ON_STREAK_3');
    } else if (correct && run && run.streak === 5) {
      window.vossSay('ON_STREAK_5');
    } else {
      window.vossSay(correct ? 'ON_CORRECT' : 'ON_WRONG');
    }
  }

  // Safe rung WALK option at Q5 and Q10
  const run = getCurrentRun();
  if (correct && run && run._safeRungReached && run.lives > 0) {
    run._safeRungReached = false;
    const nxtBtn = result.querySelector('.nxt-btn');
    if (nxtBtn) {
      const nextTier = run.index <= 5 ? 'MAINTENANCE' : 'CRITICAL';
      nxtBtn.textContent = `PUSH TO ${nextTier}`;

      const walkBtn = document.createElement('button');
      walkBtn.className = 'walk-btn';
      walkBtn.textContent = `WALK · BANK ${run.score.toLocaleString()}`;
      walkBtn.onclick = () => {
        run.lives = 99;
        run.done = true;
        run.walked = true;
        result.classList.remove('on');
        _showWalkScreen(run);
      };
      nxtBtn.parentNode.insertBefore(walkBtn, nxtBtn);
    }
  }
}

// ─── HIDE FEEDBACK ────────────────────────────────────────────────────────────

export function showPointsPopup(text, opts = {}) {
  const popup = document.createElement('div');
  popup.className = 'pts-pop';
  if (opts.big) popup.classList.add('big');
  if (opts.miss) popup.classList.add('miss');
  popup.textContent = text;
  const scv = document.getElementById('scv');
  if (scv) {
    const rect = scv.getBoundingClientRect();
    popup.style.left = `${rect.left + rect.width / 2}px`;
    popup.style.top  = `${rect.top + rect.height / 2}px`;
  } else {
    popup.style.left = '50%';
    popup.style.top  = '20%';
  }
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1300);
}
window.showPointsPopup = showPointsPopup;

export function hideFeedback() {
  const result = document.getElementById('result');
  if (!result) return;
  result.classList.remove('on');
  // Clear inline styles so CSS classes control visibility cleanly
  result.style.opacity = '';
  result.style.visibility = '';
}

// ─── expose for legacy compatibility ─────────────────────────────────────────

window.hideFeedback    = hideFeedback;
window.stopTimer       = stopTimer;
window.stopOpioidScene = stopOpioidScene;
window.renderOpioidScene = renderOpioidScene;
window.renderNMBScene  = renderNMBScene;
window.stopNMBScene    = stopNMBScene;
window.renderAnesthesiaMachineScene = renderAnesthesiaMachineScene;
window.stopAnesthesiaMachineScene   = stopAnesthesiaMachineScene;
