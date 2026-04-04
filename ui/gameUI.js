import { getCurrentRun } from '../core/gameEngine.js';

export function updateHUD() {
  const state = getCurrentRun();
  if (!state) return;
  const scv = document.getElementById('scv');
  const skv = document.getElementById('skv');
  const l1 = document.getElementById('l1');
  const l2 = document.getElementById('l2');
  const l3 = document.getElementById('l3');

  if (scv) scv.textContent = state.score.toLocaleString();
  if (skv) skv.textContent = `🔥×${state.streak || 1}`;
  if (l1) l1.style.opacity = state.lives >= 1 ? '1' : '.2';
  if (l2) l2.style.opacity = state.lives >= 2 ? '1' : '.2';
  if (l3) l3.style.opacity = state.lives >= 3 ? '1' : '.2';
}

export function renderCurrentQuestion() {
  const state = getCurrentRun();
  if (!state) return;

  const q = state.questions[state.index];
  if (!q) return;

  const chb = document.getElementById('chb');
  const ovs = document.getElementById('ovs');
  const qtxt = document.getElementById('qtxt');
  const b0 = document.getElementById('b0');
  const b1 = document.getElementById('b1');
  const b2 = document.getElementById('b2');
  const typeArea = document.getElementById('type-area');
  const ansGrid = document.getElementById('ans-grid');
  const clickInst = document.getElementById('click-inst');

  if (chb) chb.textContent = q.chapter || 'Chapter';
  if (ovs) ovs.textContent = q.setup || '';
  if (qtxt) qtxt.textContent = q.q || '';

  if (q.type === 'type') {
    if (typeArea) typeArea.style.display = 'block';
    if (ansGrid) ansGrid.style.display = 'none';
    if (clickInst) clickInst.style.display = 'none';
  } else if (q.type === 'click') {
    if (typeArea) typeArea.style.display = 'none';
    if (ansGrid) ansGrid.style.display = 'none';
    if (clickInst) clickInst.style.display = 'block';
  } else {
    if (typeArea) typeArea.style.display = 'none';
    if (ansGrid) ansGrid.style.display = 'grid';
    if (clickInst) clickInst.style.display = 'none';
    [b0,b1,b2].forEach((btn, idx) => {
      if (!btn) return;
      const choice = q.ans[idx];
      btn.textContent = choice ? choice.t : '';
      btn.disabled = false;
      btn.className = 'abtn';
      btn.onclick = () => {
        const correct = Boolean(choice && choice.ok);
        if (window.submitAnswer) window.submitAnswer(correct);
      };
    });
  }
}
