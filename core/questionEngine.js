import { loadState, saveState } from './state.js';
import { OPIOIDS_QUESTIONS, OPIOIDS_METADATA } from '../data/questions/opioids-chapter9.js';

// Question bank registry for different courses/nodes
const QUESTION_BANKS = {
  'basics-of-anesthesia': {
    'node-9': {
      questions: OPIOIDS_QUESTIONS,
      metadata: OPIOIDS_METADATA
    }
  }
};

/**
 * Get questions for a specific course and node
 * @param {string} courseId - Course ID
 * @param {string} nodeId - Node ID
 * @returns {Array} Questions for the specified course/node
 */
export function getQuestions(courseId, nodeId) {
  const course = QUESTION_BANKS[courseId];
  if (!course) return [];
  
  const node = course[nodeId];
  if (!node) return [];
  
  return node.questions || [];
}

/**
 * Get metadata for a specific course and node
 * @param {string} courseId - Course ID
 * @param {string} nodeId - Node ID
 * @returns {Object|null} Metadata for the specified course/node
 */
export function getQuestionMetadata(courseId, nodeId) {
  const course = QUESTION_BANKS[courseId];
  if (!course) return null;
  
  const node = course[nodeId];
  if (!node) return null;
  
  return node.metadata || null;
}

/**
 * Normalize questions from the new format to internal format
 * Supports: mcq, multi, short question types
 */
export function normalizeQuestions(rawQuestions = window.ALL_QS || []) {
  return rawQuestions.map((q, i) => {
    // Handle new question bank format
    if (q.prompt !== undefined) {
      return normalizeNewFormatQuestion(q, i);
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
 * Normalize a question from the new format (opioids bank style)
 */
function normalizeNewFormatQuestion(q, index) {
  const normalized = {
    id: q.id || `q_${index + 1}`,
    chapter: q.metadata?.chapter || 'Chapter 9',
    scene: 'patient',
    sceneCfg: {},
    type: q.type, // mcq, multi, short
    difficulty: q.metadata?.priority === 'high' ? 3 : (q.metadata?.priority === 'medium' ? 2 : 1),
    setup: '',
    q: q.prompt,
    
    // For MCQ - convert choices to ans format
    ans: q.type === 'mcq' ? (q.choices || []).map(choice => ({
      t: choice,
      ok: q.correctAnswers.includes(choice)
    })) : [],
    
    // For multi-select
    choices: q.choices || [],
    correctAnswers: q.correctAnswers || [],
    selectCount: q.selectCount || 0,
    
    // For short answer
    accepted: q.acceptedAnswers || q.correctAnswers || [],
    acceptedAnswers: q.acceptedAnswers || [],
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
    
    metadata: {
      sectionId: 'basics-of-anesthesia',
      lessonId: 'node-9',
      topicId: q.metadata?.topic || 'opioids',
      priority: q.metadata?.priority || 'medium'
    },
  };
  
  return normalized;
}

export function getAllQuestions() {
  return normalizeQuestions(window.ALL_QS);
}

/**
 * Get normalized questions for a specific course/node
 * This is the primary API for loading questions for a study session
 */
export function getQuestionsForNode(courseId, nodeId) {
  const rawQuestions = getQuestions(courseId, nodeId);
  return normalizeQuestions(rawQuestions);
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
