import { getCurrentRun } from '../core/gameEngine.js';
import { gradeShortAnswer, gradeMultiSelect } from '../core/answerGrading.js';
import { renderOpioidScene, stopOpioidScene } from './opioidsScene.js';

// ─── multi-select state ───────────────────────────────────────────────────────

let multiSelectState = { selected: new Set(), requiredCount: 0 };

// ─── timer ────────────────────────────────────────────────────────────────────

let _timerInterval = null;
const QUESTION_TIME_SEC = 35;

function startQuestionTimer(q) {
  clearInterval(_timerInterval);
  _timerInterval = null;

  let remaining = QUESTION_TIME_SEC;
  const fill = document.getElementById('tmr-fill');
  if (fill) {
    fill.style.transition = 'none';
    fill.style.width = '100%';
    fill.style.background = 'linear-gradient(90deg,#ff2200,#ff8800)';
  }

  console.log('Timer start:', remaining, 'for', q.id);

  _timerInterval = setInterval(() => {
    remaining--;
    const pct = Math.max(0, (remaining / QUESTION_TIME_SEC) * 100);

    if (fill) {
      fill.style.width = pct + '%';
      if (pct < 25) fill.style.background = '#ff2200';
    }

    console.log('Timer tick:', remaining);

    if (remaining <= 0) {
      clearInterval(_timerInterval);
      _timerInterval = null;
      console.log('Timer expired for question:', q.id);
      _disableAllInputs();
      const msg = q.correctAnswers ? `Correct: ${q.correctAnswers[0]}` : '';
      showAnswerFeedback(false, (q.rationale || q.ex || '') + (msg ? '\n\n' + msg : ''));
      if (window.submitAnswer) window.submitAnswer(false);
    }
  }, 1000);
}

export function stopTimer() {
  clearInterval(_timerInterval);
  _timerInterval = null;
}

function _disableAllInputs() {
  document.querySelectorAll('#ans-grid .abtn').forEach(b => b.disabled = true);
  document.querySelectorAll('#multi-area button').forEach(b => b.disabled = true);
  const inp = document.getElementById('type-input');
  if (inp) inp.disabled = true;
  const tsub = document.getElementById('type-submit');
  if (tsub) tsub.disabled = true;
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

  if (!q.rationale && !q.ex) {
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
  if (skv) skv.textContent = `x${state.streak || 1}`;
  if (l1) l1.style.opacity = state.lives >= 1 ? '1' : '.2';
  if (l2) l2.style.opacity = state.lives >= 2 ? '1' : '.2';
  if (l3) l3.style.opacity = state.lives >= 3 ? '1' : '.2';
}

// ─── main question renderer ───────────────────────────────────────────────────

export function renderCurrentQuestion() {
  const state = getCurrentRun();
  if (!state) return;

  const q = state.questions[state.index];
  if (!q) return;

  console.log('Rendering question:', q.id, q.type, q);

  // Validate (auto-repairs where possible)
  _validateQuestion(q);

  // Reset multi-select state
  multiSelectState = { selected: new Set(), requiredCount: q.selectCount || 0 };

  // Ensure question panel is visible
  const chWrap = document.getElementById('ch-wrap');
  if (chWrap) chWrap.classList.add('on');

  // Fill header fields
  const chb = document.getElementById('chb');
  const ovs = document.getElementById('ovs');
  const qtxt = document.getElementById('qtxt');
  if (chb) chb.textContent = `📚 Ch. 9 — ${(q.metadata?.topic || 'Opioids').toUpperCase()}`;
  if (ovs) ovs.textContent = q.setup || '';
  if (qtxt) qtxt.textContent = q.q || '';

  // Hide all answer areas
  const typeArea  = document.getElementById('type-area');
  const ansGrid   = document.getElementById('ans-grid');
  const clickInst = document.getElementById('click-inst');
  const multiArea = document.getElementById('multi-area');
  if (typeArea)  typeArea.style.display  = 'none';
  if (ansGrid)   ansGrid.style.display   = 'none';
  if (clickInst) clickInst.style.display = 'none';
  if (multiArea) multiArea.style.display = 'none';

  console.log('QUESTION TYPE:', q.type, '| id:', q.id);
  if (q.type === 'multi') console.log('Choices:', q.choices);

  // Render by type
  if (q.type === 'short' || q.type === 'type') {
    renderShortAnswerUI(q);
  } else if (q.type === 'multi') {
    renderMultiSelectUI(q);
  } else if (q.type === 'click') {
    if (clickInst) clickInst.style.display = 'block';
  } else {
    renderMCQUI(q);
  }

  // Start countdown timer
  startQuestionTimer(q);

  // Render themed scene
  renderOpioidScene(q);
}

// ─── MCQ ─────────────────────────────────────────────────────────────────────

function renderMCQUI(q) {
  const ansGrid = document.getElementById('ans-grid');
  if (!ansGrid) return;

  ansGrid.style.display = 'grid';
  const n = (q.ans || []).length || 3;
  ansGrid.style.gridTemplateColumns = n === 4 ? 'repeat(2,1fr)' : `repeat(${Math.min(n, 3)},1fr)`;
  ansGrid.innerHTML = '';

  (q.ans || []).forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.id = `b${idx}`;
    btn.className = 'abtn';
    btn.textContent = choice.t || '';
    btn.onclick = () => {
      // Disable all buttons immediately
      ansGrid.querySelectorAll('.abtn').forEach((b, i) => {
        b.disabled = true;
        if (q.ans[i]?.ok) b.classList.add('correct');
      });
      if (!choice.ok) btn.classList.add('wrong');
      showAnswerFeedback(Boolean(choice.ok), q.rationale || q.ex, choice.t);
      if (window.submitAnswer) window.submitAnswer(Boolean(choice.ok));
    };
    ansGrid.appendChild(btn);
  });
}

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

  q.choices.forEach(choice => {
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
  if (sub) {
    const ready = multiSelectState.selected.size === q.selectCount;
    sub.disabled = !ready;
    sub.classList.toggle('disabled', !ready);
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
  if (!result.correct && (q.correctAnswers || q.acceptedAnswers)) {
    const best = (q.correctAnswers || q.acceptedAnswers)[0];
    feedback = `Correct answer: ${best}\n\n${feedback}`;
  }

  showAnswerFeedback(result.correct, feedback, userAnswer);
  if (window.submitAnswer) window.submitAnswer(result.correct);
}

// ─── FEEDBACK OVERLAY ─────────────────────────────────────────────────────────

export function showAnswerFeedback(correct, rationale, userAnswer = null) {
  stopTimer(); // always stop timer when showing feedback

  const result = document.getElementById('result');
  if (!result) return;

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
}

// ─── HIDE FEEDBACK ────────────────────────────────────────────────────────────

export function hideFeedback() {
  const result = document.getElementById('result');
  if (result) result.classList.remove('on');
}

// ─── expose for legacy compatibility ─────────────────────────────────────────

window.hideFeedback = hideFeedback;
window.stopTimer    = stopTimer;
window.stopOpioidScene = stopOpioidScene;
