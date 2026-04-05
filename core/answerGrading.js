/**
 * ANSWER GRADING ENGINE
 * Flexible grading logic for short answer questions with fuzzy matching
 * 
 * Supports:
 * - Case insensitivity
 * - Extra space normalization
 * - Punctuation removal
 * - Abbreviation matching
 * - Minor misspelling tolerance (Levenshtein distance)
 * - Word order variation
 * - Fuzzy threshold matching
 */

/**
 * Normalize a string for comparison
 * @param {string} str - Input string
 * @param {Object} options - Matching options
 * @returns {string} Normalized string
 */
export function normalizeString(str, options = {}) {
  if (!str || typeof str !== 'string') return '';
  
  let normalized = str;
  
  // Convert to lowercase if ignoreCase
  if (options.ignoreCase !== false) {
    normalized = normalized.toLowerCase();
  }
  
  // Remove punctuation if ignorePunctuation
  if (options.ignorePunctuation !== false) {
    normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"]/g, ' ');
  }
  
  // Normalize hyphens and slashes
  normalized = normalized.replace(/[-\/\\]/g, ' ');
  
  // Trim and collapse multiple spaces
  if (options.ignoreExtraSpaces !== false) {
    normalized = normalized.trim().replace(/\s+/g, ' ');
  }
  
  return normalized;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 */
export function levenshteinDistance(a, b) {
  if (!a || !b) return Math.max((a || '').length, (b || '').length);
  
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Calculate similarity ratio between two strings (0-1)
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Similarity ratio (1 = identical)
 */
export function similarityRatio(a, b) {
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  
  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  
  return maxLength === 0 ? 1 : 1 - (distance / maxLength);
}

/**
 * Check if two strings match with word order variation allowed
 * @param {string} input - User input
 * @param {string} target - Target answer
 * @returns {boolean} Whether they match
 */
export function matchWithWordOrderVariation(input, target) {
  const inputWords = new Set(input.split(' ').filter(w => w.length > 0));
  const targetWords = new Set(target.split(' ').filter(w => w.length > 0));
  
  // Check if all target words are present in input
  for (const word of targetWords) {
    if (!inputWords.has(word)) {
      // Check for partial match (one word might contain another)
      let found = false;
      for (const inputWord of inputWords) {
        if (inputWord.includes(word) || word.includes(inputWord)) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
  }
  
  return true;
}

/**
 * Grade a short answer response
 * @param {string} userAnswer - The user's answer
 * @param {Object} question - Question object with acceptedAnswers and answerMatching config
 * @returns {Object} { correct: boolean, matchedAnswer: string|null, similarity: number }
 */
export function gradeShortAnswer(userAnswer, question) {
  if (!userAnswer || typeof userAnswer !== 'string') {
    return { correct: false, matchedAnswer: null, similarity: 0 };
  }
  
  const acceptedAnswers = question.acceptedAnswers || question.correctAnswers || [];
  const options = question.answerMatching || {
    ignoreCase: true,
    ignoreExtraSpaces: true,
    ignorePunctuation: true,
    allowAbbreviations: true,
    allowMinorMisspellings: true,
    allowWordOrderVariation: false,
    fuzzyThreshold: 0.8
  };
  
  const normalizedInput = normalizeString(userAnswer, options);
  
  if (!normalizedInput) {
    return { correct: false, matchedAnswer: null, similarity: 0 };
  }
  
  let bestMatch = null;
  let bestSimilarity = 0;
  
  for (const accepted of acceptedAnswers) {
    const normalizedAccepted = normalizeString(accepted, options);
    
    // Exact match after normalization
    if (normalizedInput === normalizedAccepted) {
      return { correct: true, matchedAnswer: accepted, similarity: 1 };
    }
    
    // Word order variation matching
    if (options.allowWordOrderVariation) {
      if (matchWithWordOrderVariation(normalizedInput, normalizedAccepted)) {
        const similarity = similarityRatio(normalizedInput, normalizedAccepted);
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          bestMatch = accepted;
        }
        if (similarity >= (options.fuzzyThreshold || 0.8)) {
          return { correct: true, matchedAnswer: accepted, similarity };
        }
      }
    }
    
    // Fuzzy matching with similarity threshold
    if (options.allowMinorMisspellings) {
      const similarity = similarityRatio(normalizedInput, normalizedAccepted);
      
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = accepted;
      }
      
      if (similarity >= (options.fuzzyThreshold || 0.8)) {
        return { correct: true, matchedAnswer: accepted, similarity };
      }
    }
    
    // Substring/contains check for short answers
    if (normalizedAccepted.length <= 15) {
      if (normalizedInput.includes(normalizedAccepted) || 
          normalizedAccepted.includes(normalizedInput)) {
        const similarity = similarityRatio(normalizedInput, normalizedAccepted);
        if (similarity >= (options.fuzzyThreshold || 0.8)) {
          return { correct: true, matchedAnswer: accepted, similarity };
        }
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          bestMatch = accepted;
        }
      }
    }
  }
  
  // Return the best match even if not passing threshold (for feedback purposes)
  return { 
    correct: false, 
    matchedAnswer: bestMatch, 
    similarity: bestSimilarity,
    closestMatch: bestMatch
  };
}

/**
 * Grade a multiple choice question
 * @param {string} userAnswer - The user's selected answer
 * @param {Object} question - Question object with correctAnswers
 * @returns {Object} { correct: boolean }
 */
export function gradeMCQ(userAnswer, question) {
  const correctAnswers = question.correctAnswers || [];
  const correct = correctAnswers.includes(userAnswer);
  return { correct };
}

/**
 * Grade a multi-select question
 * @param {string[]} userAnswers - Array of user's selected answers
 * @param {Object} question - Question object with correctAnswers and selectCount
 * @returns {Object} { correct: boolean, correctCount: number, incorrectCount: number }
 */
export function gradeMultiSelect(userAnswers, question) {
  const correctAnswers = new Set(question.correctAnswers || []);
  const userAnswerSet = new Set(userAnswers || []);
  
  let correctCount = 0;
  let incorrectCount = 0;
  
  for (const answer of userAnswerSet) {
    if (correctAnswers.has(answer)) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }
  
  // All correct answers must be selected and no incorrect answers
  const allCorrectSelected = correctCount === correctAnswers.size;
  const noIncorrectSelected = incorrectCount === 0;
  const correct = allCorrectSelected && noIncorrectSelected;
  
  return { 
    correct, 
    correctCount, 
    incorrectCount,
    totalRequired: correctAnswers.size,
    totalSelected: userAnswerSet.size
  };
}

/**
 * Universal grading function that handles all question types
 * @param {string|string[]} userAnswer - User's answer(s)
 * @param {Object} question - Question object with type and answer data
 * @returns {Object} Grading result
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
      // Fallback to legacy format
      if (question.accepted && Array.isArray(question.accepted)) {
        const normalized = (userAnswer || '').trim().toLowerCase();
        const correct = question.accepted.map(a => a.trim().toLowerCase()).includes(normalized);
        return { correct };
      }
      return { correct: false };
  }
}
