import { loadState, saveState } from './state.js';
import { getNodeConfig } from './nodeConfig.js';

/**
 * Get raw questions for a specific node (reads from NODE_CONFIG).
 */
export function getQuestions(courseId, nodeId) {
  const cfg = getNodeConfig(nodeId);
  if (!cfg || cfg.courseId !== courseId) return [];
  return cfg.questions || [];
}

/**
 * Get metadata for a specific node (reads from NODE_CONFIG).
 */
export function getQuestionMetadata(courseId, nodeId) {
  const cfg = getNodeConfig(nodeId);
  if (!cfg || cfg.courseId !== courseId) return null;
  return cfg.questionsMeta || null;
}

/**
 * Normalize questions from the new format to internal format
 * Supports: mcq, multi, short question types
 * @param {Array} rawQuestions
 * @param {string} [nodeId] - optional, e.g. 'node-9' or 'node-10'
 */
export function normalizeQuestions(rawQuestions = window.ALL_QS || [], nodeId = null) {
  return rawQuestions.map((q, i) => {
    // Handle new question bank format (has .prompt field)
    if (q.prompt !== undefined) {
      return normalizeNewFormatQuestion(q, i, nodeId);
    }
    
    // Handle legacy format
    const normalized = {
      id: q.id || `q_${i+1}`,
      chapter: q.ch || q.chapter || 'unknown',
      scene: q.scene || 'patient',
      sceneCfg: q.sceneCfg || {},
      type: q.type || 'mcq',
      difficulty: q.difficulty || 1,
      setup: q.setup || '',
      q: q.q || '',
      ans: q.ans || [],
      accepted: q.accepted || [],
      correctTarget: q.correctTarget || null,
      hint: q.hint || '',
      revealHint: q.revealHint || '',
      win: q.win || '',
      lose: q.lose || '',
      ex: q.ex || '',
      metadata: {
        sectionId: q.sectionId || 'general',
        lessonId: q.lessonId || 'general',
        topicId: q.topicId || q.ch || 'general',
      },
    };
    return normalized;
  });
}

/**
 * Normalize a question from the new format (opioids/NMB bank style)
 * @param {object} q - raw question object
 * @param {number} index
 * @param {string|null} nodeId - e.g. 'node-9', 'node-10'
 */
function normalizeNewFormatQuestion(q, index, nodeId) {
  // Determine chapter label and default topic from the node, falling back to metadata
  const resolvedNodeId = nodeId || q.metadata?.nodeId || 'node-unknown';
  const resolvedChapter = q.metadata?.chapter || `Node ${resolvedNodeId.replace('node-', '')}`;
  const resolvedTopic = q.metadata?.topic || resolvedNodeId;

  // Handle both old format (prompt + choices/correctAnswers) and new format (prompt + ans)
  let ans = [];
  if (q.type === 'mcq') {
    if (q.ans && q.ans.length > 0) {
      // Already in {t, ok} format (new NMB bank style)
      ans = q.ans;
    } else if (q.choices && q.correctAnswers) {
      // Old opioids bank style: choices array + correctAnswers array
      ans = (q.choices || []).map(choice => ({
        t: choice,
        ok: q.correctAnswers.includes(choice)
      }));
    }
  }

  const normalized = {
    id: q.id || `q_${index + 1}`,
    chapter: resolvedChapter,
    scene: 'patient',
    sceneCfg: {},
    type: q.type, // mcq, multi, short
    difficulty: q.metadata?.priority === 'high' ? 3 : (q.metadata?.priority === 'medium' ? 2 : 1),
    setup: q.setup || '',
    q: q.prompt || q.q || '',

    // For MCQ
    ans,

    // For multi-select
    choices: q.choices || [],
    correctAnswers: q.correctAnswers || [],
    selectCount: q.selectCount || 0,

    // For short answer
    accepted: q.acceptedAnswers || q.correctAnswers || [],
    acceptedAnswers: q.acceptedAnswers || [],
    canonicalAnswer: q.canonicalAnswer || null, // optional human-readable display answer
    answerMatching: q.answerMatching || {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowMinorMisspellings: true,
      fuzzyThreshold: 0.8
    },

    correctTarget: null,
    hint: '',
    revealHint: '',
    win: 'Correct!',
    lose: 'Incorrect.',
    ex: q.rationale || '',
    rationale: q.rationale || '',

    // concept_tag: human-readable topic used by Review Weakest and XP bonus
    concept_tag: q.metadata?.topic || null,

    metadata: {
      sectionId: 'basics-of-anesthesia',
      lessonId: resolvedNodeId,
      topicId: resolvedTopic,
      topic: resolvedTopic,
      priority: q.metadata?.priority || 'medium'
    },
  };

  return normalized;
}

export function getAllQuestions() {
  return normalizeQuestions(window.ALL_QS);
}

/**
 * Validate a single normalized question — logs warnings, does not throw
 * @param {object} q - normalized question
 * @returns {boolean} true if valid
 */
function _validateNormalized(q) {
  let ok = true;
  if (!q.id)   { console.warn('[QE VALIDATE] missing id', q); ok = false; }
  if (!q.type) { console.warn('[QE VALIDATE] missing type', q.id); ok = false; }
  if (q.type === 'mcq'   && (!q.ans || q.ans.length === 0))           { console.warn('[QE VALIDATE]', q.id, 'MCQ missing ans'); ok = false; }
  if (q.type === 'multi' && (!q.choices || q.choices.length === 0))   { console.warn('[QE VALIDATE]', q.id, 'multi missing choices'); ok = false; }
  if (q.type === 'multi' && (!q.correctAnswers || !q.correctAnswers.length)) { console.warn('[QE VALIDATE]', q.id, 'multi missing correctAnswers'); ok = false; }
  if (q.type === 'multi' && !q.selectCount)                           { console.warn('[QE VALIDATE]', q.id, 'multi missing selectCount'); ok = false; }
  if ((q.type === 'short' || q.type === 'type') && (!q.acceptedAnswers || !q.acceptedAnswers.length)) {
    console.warn('[QE VALIDATE]', q.id, 'short missing acceptedAnswers'); ok = false;
  }
  if (!q.rationale && !q.ex) { console.warn('[QE VALIDATE]', q.id, 'missing rationale (non-fatal)'); }
  return ok;
}

/**
 * Get normalized questions for a specific course/node
 * This is the primary API for loading questions for a study session
 */
export function getQuestionsForNode(courseId, nodeId) {
  const rawQuestions = getQuestions(courseId, nodeId);
  const normalized   = normalizeQuestions(rawQuestions, nodeId);

  // Validate each question and log issues
  let validCount = 0;
  normalized.forEach(q => { if (_validateNormalized(q)) validCount++; });
  console.log(`[QE] ${courseId}/${nodeId}: ${validCount}/${normalized.length} questions valid`);

  return normalized;
}

/**
 * Get opioids questions specifically (convenience function)
 */
export function getOpioidsQuestions() {
  return getQuestionsForNode('basics-of-anesthesia', 'node-9');
}

export function filterQuestions({sectionId=null, lessonId=null, topicId=null, mode='all', missedOnly=false}) {
  let questions = getAllQuestions();
  if (sectionId) questions = questions.filter(q => q.metadata.sectionId === sectionId);
  if (lessonId) questions = questions.filter(q => q.metadata.lessonId === lessonId);
  if (topicId) questions = questions.filter(q => q.metadata.topicId === topicId);

  const state = loadState();
  if (missedOnly) {
    questions = questions.filter(q => state.missedQuestionIds.includes(q.id));
  }

  if (mode === 'weak') {
    const topicPerf = state.performanceByTopic || {};
    questions = questions.sort((a,b)=>{const aPerf = topicPerf[a.metadata.topicId]; const bPerf=topicPerf[b.metadata.topicId];
      const aRate = aPerf ? (aPerf.correct / Math.max(1, aPerf.attempted)) : 0;
      const bRate = bPerf ? (bPerf.correct / Math.max(1, bPerf.attempted)) : 0;
      return aRate - bRate;
    });
  }

  return questions;
}

export function recordQuestionOutcome(questionId, topicId, correct) {
  const state = loadState();
  const topicPerf = state.performanceByTopic || {};
  if (!topicPerf[topicId]) topicPerf[topicId] = {attempted:0, correct:0};
  topicPerf[topicId].attempted++;
  if (correct) topicPerf[topicId].correct++;

  let missed = new Set(state.missedQuestionIds || []);
  if (!correct) missed.add(questionId);
  else missed.delete(questionId);

  state.performanceByTopic = topicPerf;
  state.missedQuestionIds = [...missed];
  saveState(state);

  return state;
}
