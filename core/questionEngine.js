import { loadState, saveState } from './state.js';

export function normalizeQuestions(rawQuestions = window.ALL_QS || []) {
  return rawQuestions.map((q, i) => {
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

export function getAllQuestions() {
  return normalizeQuestions(window.ALL_QS);
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
