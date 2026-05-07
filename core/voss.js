/**
 * Attending Voss dialogue system.
 * Snarky, terse quotes displayed in the .ov-bub element.
 */

const QUOTES = {
  ON_GAME_START: [
    "Your hands are shaking. Mine never do.",
    "Try not to embarrass yourself.",
    "First case. Do not make me regret signing you in.",
    "I have seen med students with more confidence.",
    "The patient is awake. You should be too.",
    "Clock is ticking. So is their heart. For now.",
  ],
  ON_CORRECT: [
    "Adequate.",
    "Do not get cocky.",
    "That should have been faster.",
    "Even a broken clock is right twice a day.",
    "Acceptable. Barely.",
    "The patient lives another minute.",
    "You read the chapter. Congratulations.",
    "Correct. Now do it under pressure.",
  ],
  ON_WRONG: [
    "The patient noticed.",
    "I would have failed you in residency for that.",
    "Read it again. Slowly this time.",
    "That answer was clinically indefensible.",
    "Wrong. The OR is not the place for guessing.",
    "Your preceptor is updating your evaluation right now.",
    "Boards would not be kind to that answer.",
    "The scrub tech just winced.",
  ],
  ON_STREAK_3: [
    "Three in a row. The autonomic system approves.",
    "Starting to look less incompetent.",
    "Acceptable streak. Keep it going.",
    "Your patient might actually survive this.",
    "The attending nods. Slightly.",
    "Three correct. Do not let it go to your head.",
  ],
  ON_STREAK_5: [
    "Five. The CRNA program was right about you. Maybe.",
    "Unstoppable? We will see.",
    "Five in a row. The charge nurse is impressed.",
    "You are earning your keep today.",
    "Even I am mildly surprised.",
    "The surgeon stopped complaining. That is saying something.",
  ],
  ON_LAST_LIFE: [
    "One life left. One. Think before you answer.",
    "Your patient is circling the drain. Focus.",
    "Last chance. Make it count or the code team comes in.",
    "The monitor is alarming. So should you be.",
    "One more wrong answer and the patient codes.",
    "I am reaching for the crash cart. Your move.",
  ],
  ON_TIME_RUNNING_OUT: [
    "Clock is ticking. Answer or the patient codes.",
    "Time is a resource. You are wasting it.",
    "The surgeon is staring at you. Answer.",
    "Faster. Real codes do not wait.",
    "Seconds matter in the OR. Move.",
    "Your hesitation is showing.",
  ],
  ON_LEVEL_COMPLETE: [
    "The patient survived. Barely. So did your career.",
    "Session complete. You are still employed.",
    "Not terrible. Not great. But not terrible.",
    "The patient made it to PACU. You are welcome.",
    "Acceptable performance. Do better next time.",
    "You survived. The patient did too. That is the minimum.",
  ],
  ON_GAME_OVER: [
    "Code blue. The patient is gone. Review and come back stronger.",
    "Flatline. Your attending is not surprised.",
    "The family wants to speak with you. Good luck.",
    "You just proved why malpractice insurance exists.",
    "The patient coded. The debrief will be uncomfortable.",
    "Case over. The outcome was preventable.",
  ],
};

let _lastQuoteIndex = {};

function _pick(state) {
  const arr = QUOTES[state];
  if (!arr || arr.length === 0) return null;
  // Avoid repeating the same quote consecutively
  let idx;
  do {
    idx = Math.floor(Math.random() * arr.length);
  } while (idx === _lastQuoteIndex[state] && arr.length > 1);
  _lastQuoteIndex[state] = idx;
  return arr[idx];
}

let _questionsSinceLastQuote = 0;
let _vossTimeout = null;

/**
 * Show a Voss quote for the given state.
 * Displays in .ov-bub for 4 seconds with fade in/out.
 */
export function vossSay(state) {
  const quote = _pick(state);
  if (!quote) return;

  const bub = document.getElementById('ovb');
  if (!bub) return;

  clearTimeout(_vossTimeout);
  bub.textContent = quote;
  bub.style.opacity = '1';

  _vossTimeout = setTimeout(() => {
    bub.style.opacity = '0';
  }, 4000);

  _questionsSinceLastQuote = 0;
}

/**
 * Call after each question render. Shows quotes at appropriate intervals
 * (every 3rd question minimum, plus all critical state changes).
 */
export function vossOnQuestion(run) {
  _questionsSinceLastQuote++;
  if (_questionsSinceLastQuote < 3) return;

  // Pick a contextual quote based on current state
  if (run.lives === 1) {
    vossSay('ON_LAST_LIFE');
  } else if (run.streak >= 5) {
    vossSay('ON_STREAK_5');
  } else if (run.streak >= 3) {
    vossSay('ON_STREAK_3');
  }
}

// Expose globally for legacy code
window.vossSay = vossSay;
window.vossOnQuestion = vossOnQuestion;
