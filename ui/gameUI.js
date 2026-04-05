import { getCurrentRun } from '../core/gameEngine.js';
import { gradeAnswer, gradeShortAnswer, gradeMultiSelect } from '../core/answerGrading.js';

// Track multi-select state
let multiSelectState = {
  selected: new Set(),
  requiredCount: 0
};

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

export function renderCurrentQuestion() {
  const state = getCurrentRun();
  if (!state) return;

  const q = state.questions[state.index];
  if (!q) return;

  // Reset multi-select state
  multiSelectState = {
    selected: new Set(),
    requiredCount: q.selectCount || 0
  };

  const chb = document.getElementById('chb');
  const ovs = document.getElementById('ovs');
  const qtxt = document.getElementById('qtxt');
  const typeArea = document.getElementById('type-area');
  const ansGrid = document.getElementById('ans-grid');
  const clickInst = document.getElementById('click-inst');
  const multiArea = document.getElementById('multi-area');

  if (chb) chb.textContent = q.chapter || 'Opioids';
  if (ovs) ovs.textContent = q.setup || '';
  if (qtxt) qtxt.textContent = q.q || '';

  // Hide all answer areas first
  if (typeArea) typeArea.style.display = 'none';
  if (ansGrid) ansGrid.style.display = 'none';
  if (clickInst) clickInst.style.display = 'none';
  if (multiArea) multiArea.style.display = 'none';

  // Render based on question type
  if (q.type === 'short' || q.type === 'type') {
    renderShortAnswerUI(q);
  } else if (q.type === 'multi') {
    renderMultiSelectUI(q);
  } else if (q.type === 'click') {
    if (clickInst) clickInst.style.display = 'block';
  } else {
    // MCQ (default)
    renderMCQUI(q);
  }
}

/**
 * Render MCQ (Multiple Choice) UI
 */
function renderMCQUI(q) {
  const ansGrid = document.getElementById('ans-grid');
  if (!ansGrid) return;

  ansGrid.style.display = 'grid';
  
  // Update grid columns based on number of choices
  const numChoices = q.ans.length || 3;
  if (numChoices === 4) {
    ansGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
  } else {
    ansGrid.style.gridTemplateColumns = `repeat(${Math.min(numChoices, 3)}, 1fr)`;
  }

  // Clear existing buttons
  ansGrid.innerHTML = '';

  // Create answer buttons
  q.ans.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.id = `b${idx}`;
    btn.className = 'abtn';
    btn.textContent = choice.t || '';
    btn.disabled = false;
    btn.onclick = () => {
      const correct = Boolean(choice.ok);
      showAnswerFeedback(correct, q.rationale || q.ex, choice.t);
      if (window.submitAnswer) window.submitAnswer(correct);
    };
    ansGrid.appendChild(btn);
  });
}

/**
 * Render Multi-Select UI
 */
function renderMultiSelectUI(q) {
  let multiArea = document.getElementById('multi-area');
  
  // Create multi-area if it doesn't exist
  if (!multiArea) {
    multiArea = document.createElement('div');
    multiArea.id = 'multi-area';
    multiArea.className = 'multi-area';
    const chCard = document.getElementById('ch-card');
    if (chCard) {
      const ansGrid = document.getElementById('ans-grid');
      if (ansGrid) {
        chCard.insertBefore(multiArea, ansGrid.nextSibling);
      } else {
        chCard.appendChild(multiArea);
      }
    }
  }

  multiArea.style.display = 'block';
  multiArea.innerHTML = '';

  // Instruction
  const instruction = document.createElement('div');
  instruction.className = 'multi-instruction';
  instruction.textContent = `Select ${q.selectCount} answer${q.selectCount > 1 ? 's' : ''}`;
  multiArea.appendChild(instruction);

  // Selection counter
  const counter = document.createElement('div');
  counter.id = 'multi-counter';
  counter.className = 'multi-counter';
  counter.textContent = `Selected: 0 / ${q.selectCount}`;
  multiArea.appendChild(counter);

  // Choices grid
  const choicesGrid = document.createElement('div');
  choicesGrid.className = 'multi-choices-grid';
  
  // Determine grid columns
  const numChoices = q.choices.length;
  if (numChoices <= 4) {
    choicesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
  } else {
    choicesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
  }

  q.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'multi-btn';
    btn.textContent = choice;
    btn.dataset.choice = choice;
    btn.onclick = () => toggleMultiSelect(btn, choice, q);
    choicesGrid.appendChild(btn);
  });

  multiArea.appendChild(choicesGrid);

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.id = 'multi-submit';
  submitBtn.className = 'multi-submit disabled';
  submitBtn.textContent = 'Submit Answer';
  submitBtn.disabled = true;
  submitBtn.onclick = () => submitMultiSelect(q);
  multiArea.appendChild(submitBtn);
}

/**
 * Toggle multi-select choice
 */
function toggleMultiSelect(btn, choice, q) {
  if (multiSelectState.selected.has(choice)) {
    multiSelectState.selected.delete(choice);
    btn.classList.remove('selected');
  } else {
    // Only allow selection up to required count
    if (multiSelectState.selected.size < q.selectCount) {
      multiSelectState.selected.add(choice);
      btn.classList.add('selected');
    }
  }

  // Update counter
  const counter = document.getElementById('multi-counter');
  if (counter) {
    counter.textContent = `Selected: ${multiSelectState.selected.size} / ${q.selectCount}`;
  }

  // Enable/disable submit button
  const submitBtn = document.getElementById('multi-submit');
  if (submitBtn) {
    if (multiSelectState.selected.size === q.selectCount) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('disabled');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('disabled');
    }
  }
}

/**
 * Submit multi-select answer
 */
function submitMultiSelect(q) {
  const userAnswers = Array.from(multiSelectState.selected);
  const result = gradeMultiSelect(userAnswers, q);
  
  // Highlight correct/incorrect choices
  const multiArea = document.getElementById('multi-area');
  if (multiArea) {
    const buttons = multiArea.querySelectorAll('.multi-btn');
    buttons.forEach(btn => {
      const choice = btn.dataset.choice;
      const isCorrect = q.correctAnswers.includes(choice);
      const wasSelected = multiSelectState.selected.has(choice);
      
      btn.disabled = true;
      
      if (isCorrect) {
        btn.classList.add('correct');
      }
      if (wasSelected && !isCorrect) {
        btn.classList.add('wrong');
      }
    });
    
    // Disable submit button
    const submitBtn = document.getElementById('multi-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.display = 'none';
    }
  }

  showAnswerFeedback(result.correct, q.rationale || q.ex);
  if (window.submitAnswer) window.submitAnswer(result.correct);
}

/**
 * Render Short Answer UI
 */
function renderShortAnswerUI(q) {
  const typeArea = document.getElementById('type-area');
  if (!typeArea) return;

  typeArea.style.display = 'block';
  
  // Clear and rebuild
  typeArea.innerHTML = `
    <div class="type-row">
      <input type="text" id="type-input" placeholder="Type your answer..." autocomplete="off" />
      <button id="type-submit">Submit</button>
    </div>
    <div class="type-hint">Press Enter or click Submit to answer</div>
  `;

  const input = document.getElementById('type-input');
  const submitBtn = document.getElementById('type-submit');

  // Submit on Enter
  if (input) {
    input.focus();
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        submitShortAnswer(q);
      }
    };
  }

  // Submit on button click
  if (submitBtn) {
    submitBtn.onclick = () => submitShortAnswer(q);
  }
}

/**
 * Submit short answer
 */
function submitShortAnswer(q) {
  const input = document.getElementById('type-input');
  if (!input) return;

  const userAnswer = input.value.trim();
  if (!userAnswer) return;

  // Grade the answer
  const result = gradeShortAnswer(userAnswer, q);

  // Disable input
  input.disabled = true;
  
  // Hide submit button
  const submitBtn = document.getElementById('type-submit');
  if (submitBtn) submitBtn.style.display = 'none';

  // Show correct answer if wrong
  let feedbackText = q.rationale || q.ex;
  if (!result.correct && q.correctAnswers && q.correctAnswers[0]) {
    feedbackText = `Correct answer: ${q.correctAnswers[0]}\n\n${feedbackText}`;
  }

  showAnswerFeedback(result.correct, feedbackText, userAnswer);
  if (window.submitAnswer) window.submitAnswer(result.correct);
}

/**
 * Show answer feedback overlay
 */
function showAnswerFeedback(correct, rationale, userAnswer = null) {
  const result = document.getElementById('result');
  if (!result) return;

  result.classList.add('on');
  result.classList.remove('win-bg', 'lose-bg');
  result.classList.add(correct ? 'win-bg' : 'lose-bg');

  const rv = document.getElementById('r-v');
  const rq = document.getElementById('r-q');
  const rex = document.getElementById('r-ex');

  if (rv) rv.textContent = correct ? 'CORRECT' : 'INCORRECT';
  if (rq) rq.textContent = userAnswer ? `Your answer: "${userAnswer}"` : '';
  if (rex) {
    rex.textContent = rationale || '';
    rex.style.whiteSpace = 'pre-wrap';
  }
}

/**
 * Hide feedback and move to next question
 */
export function hideFeedback() {
  const result = document.getElementById('result');
  if (result) {
    result.classList.remove('on');
  }
}

// Expose for legacy compatibility
window.hideFeedback = hideFeedback;
