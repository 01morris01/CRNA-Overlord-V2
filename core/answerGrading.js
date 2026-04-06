/**
 * ANSWER GRADING ENGINE
 * Flexible grading logic for short answer questions with fuzzy matching
 *
 * Supports:
 * - Normalization: lowercase, trim, collapse spaces, strip leading/trailing punctuation
 * - Exact match after normalization
 * - Abbreviation expansion (bidirectional lookup table)
 * - Plural/singular normalization (strip trailing 's')
 * - Levenshtein fuzzy match with length-aware thresholds
 * - Substring containment (≥5 chars)
 * - Per-question answerMatching config: { strict: true } skips fuzzy/substring
 */

// ─── Abbreviation table (bidirectional) ──────────────────────────────────────

const ABBREV_TABLE = {
  "ache":  "acetylcholinesterase",
  "nmba":  "neuromuscular blocking agent",
  "lbm":   "lean body mass",
  "tof":   "train of four",
  "nmj":   "neuromuscular junction",
  "o2":    "oxygen",
  "co2":   "carbon dioxide",
  "n2o":   "nitrous oxide",
  "mac":   "minimum alveolar concentration",
  "frc":   "functional residual capacity",
  "svr":   "systemic vascular resistance",
  "map":   "mean arterial pressure",
};

// Build reverse map: full form → abbreviation
const ABBREV_REVERSE = {};
for (const [abbr, full] of Object.entries(ABBREV_TABLE)) {
  ABBREV_REVERSE[full] = abbr;
}

/**
 * Expand abbreviations in both directions.
 * Returns an array of string variants to check (including original).
 */
function _expandAbbreviations(str) {
  const variants = [str];
  // Try expanding abbreviation → full form
  if (ABBREV_TABLE[str]) variants.push(ABBREV_TABLE[str]);
  // Try contracting full form → abbreviation
  if (ABBREV_REVERSE[str]) variants.push(ABBREV_REVERSE[str]);
  return variants;
}

// ─── Core normalization ───────────────────────────────────────────────────────

/**
 * Normalize a string: lowercase, strip leading/trailing punctuation,
 * collapse multiple spaces.
 */
export function normalizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/^[^\w]+|[^\w]+$/g, '')   // strip leading/trailing punctuation
    .replace(/[^\w\s]/g, ' ')           // replace internal punctuation with space
    .replace(/\s+/g, ' ')               // collapse multiple spaces
    .trim();
}

/**
 * Normalize and strip trailing 's' for plural/singular comparison.
 */
function _depluralize(str) {
  return str.endsWith('s') && str.length > 3 ? str.slice(0, -1) : str;
}

// ─── Levenshtein distance ─────────────────────────────────────────────────────

export function levenshteinDistance(a, b) {
  if (!a || !b) return Math.max((a || '').length, (b || '').length);

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1]     + 1,
          matrix[i - 1][j]     + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function similarityRatio(a, b) {
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  const dist = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - dist / maxLen;
}

// ─── Fuzzy threshold by length ────────────────────────────────────────────────

function _fuzzyMatch(input, target) {
  const len = Math.min(input.length, target.length);
  if (len <= 3) return false;           // no fuzzy for very short strings
  const dist = levenshteinDistance(input, target);
  if (len <= 6) return dist <= 1;       // 4-6 chars: allow 1 edit
  return dist <= 2;                     // 7+ chars: allow 2 edits
}

// ─── Word-order variation (legacy support) ────────────────────────────────────

export function matchWithWordOrderVariation(input, target) {
  const inputWords  = new Set(input.split(' ').filter(w => w.length > 0));
  const targetWords = new Set(target.split(' ').filter(w => w.length > 0));
  for (const word of targetWords) {
    if (!inputWords.has(word)) {
      let found = false;
      for (const iw of inputWords) {
        if (iw.includes(word) || word.includes(iw)) { found = true; break; }
      }
      if (!found) return false;
    }
  }
  return true;
}

// ─── Primary grader ──────────────────────────────────────────────────────────

/**
 * Grade a short answer response.
 * @param {string} userAnswer
 * @param {Object} question  — must have acceptedAnswers (or correctAnswers)
 * @returns {{ correct: boolean, matched: string|null }}
 *
 * Per-question config via question.answerMatching:
 *   { strict: true }         — exact + abbreviation only (no fuzzy/substring)
 *   { fuzzyThreshold: 0.8 }  — legacy field; treated as default fuzzy behavior
 */
export function gradeShortAnswer(userAnswer, question) {
  if (!userAnswer || typeof userAnswer !== 'string') {
    return { correct: false, matched: null, similarity: 0 };
  }

  const acceptedAnswers = question.acceptedAnswers || question.correctAnswers || [];
  const matchCfg        = question.answerMatching || {};
  const strict          = matchCfg.strict === true;

  const normInput    = normalizeString(userAnswer);
  const deplurInput  = _depluralize(normInput);
  const inputVariants = _expandAbbreviations(normInput);

  if (!normInput) return { correct: false, matched: null, similarity: 0 };

  for (const accepted of acceptedAnswers) {
    const normAccepted    = normalizeString(String(accepted));
    const deplurAccepted  = _depluralize(normAccepted);
    const acceptedVariants = _expandAbbreviations(normAccepted);

    // ── 1. Exact match after normalization ───────────────────────────────────
    if (normInput === normAccepted) {
      return { correct: true, matched: accepted, similarity: 1 };
    }

    // ── 2. Abbreviation expansion (both directions) ──────────────────────────
    for (const iv of inputVariants) {
      for (const av of acceptedVariants) {
        if (iv === av) return { correct: true, matched: accepted, similarity: 1 };
      }
    }

    // ── 3. Plural/singular normalization ─────────────────────────────────────
    if (deplurInput === deplurAccepted) {
      return { correct: true, matched: accepted, similarity: 1 };
    }

    // Strict mode stops here
    if (strict) continue;

    // ── 4. Fuzzy match (Levenshtein, length-aware thresholds) ────────────────
    if (_fuzzyMatch(normInput, normAccepted)) {
      return { correct: true, matched: accepted, similarity: similarityRatio(normInput, normAccepted) };
    }
    // Also try depluralized forms
    if (_fuzzyMatch(deplurInput, deplurAccepted)) {
      return { correct: true, matched: accepted, similarity: similarityRatio(deplurInput, deplurAccepted) };
    }

    // ── 5. Substring containment (≥5 chars) ──────────────────────────────────
    const shorter = normInput.length <= normAccepted.length ? normInput : normAccepted;
    const longer  = normInput.length <= normAccepted.length ? normAccepted : normInput;
    if (shorter.length >= 5 && longer.includes(shorter)) {
      return { correct: true, matched: accepted, similarity: shorter.length / longer.length };
    }
  }

  return { correct: false, matched: null, similarity: 0 };
}

/**
 * Grade a multiple choice question
 */
export function gradeMCQ(userAnswer, question) {
  const correctAnswers = question.correctAnswers || [];
  return { correct: correctAnswers.includes(userAnswer) };
}

/**
 * Grade a multi-select question — compares by VALUE not position.
 * @param {string[]} userAnswers
 * @param {Object} question — must have correctAnswers
 * @returns {{ correct: boolean, correctCount, incorrectCount, totalRequired, totalSelected }}
 */
export function gradeMultiSelect(userAnswers, question) {
  const correctAnswers = new Set(question.correctAnswers || []);
  const userAnswerSet  = new Set(userAnswers || []);

  let correctCount   = 0;
  let incorrectCount = 0;

  for (const answer of userAnswerSet) {
    if (correctAnswers.has(answer)) correctCount++;
    else incorrectCount++;
  }

  const allCorrectSelected = correctCount === correctAnswers.size;
  const noIncorrectSelected = incorrectCount === 0;
  const correct = allCorrectSelected && noIncorrectSelected;

  return {
    correct,
    correctCount,
    incorrectCount,
    totalRequired: correctAnswers.size,
    totalSelected: userAnswerSet.size,
  };
}

/**
 * Universal grading dispatcher
 */
export function gradeAnswer(userAnswer, question) {
  switch (question.type) {
    case 'mcq':
      return gradeMCQ(userAnswer, question);
    case 'multi':
      return gradeMultiSelect(userAnswer, question);
    case 'short':
    case 'type':
      return gradeShortAnswer(userAnswer, question);
    default:
      if (question.accepted && Array.isArray(question.accepted)) {
        const normalized = (userAnswer || '').trim().toLowerCase();
        const correct = question.accepted.map(a => a.trim().toLowerCase()).includes(normalized);
        return { correct };
      }
      return { correct: false };
  }
}
