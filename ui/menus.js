import { loadState, saveState } from '../core/state.js';
import { filterQuestions, getQuestionsForNode, getQuestionMetadata } from '../core/questionEngine.js';
import { getNodesByCourse } from '../core/nodeConfig.js';

export function showMap({course='default'}={}) {
  const map = document.getElementById('level-map');
  const app = document.getElementById('game');
  if (map) map.classList.add('on');
  if (app) app.style.display = 'none';
}

export function hideMap() {
  const map = document.getElementById('level-map');
  if (map) map.classList.remove('on');
}

export function renderSectionList(sections=[]) {
  const path = document.getElementById('map-path');
  if (!path) return;
  path.innerHTML = '';

  sections.forEach(section=>{
    const node = document.createElement('button');
    node.className='map-node';
    if (section.available) {
      node.classList.add('map-available');
    }
    node.innerHTML=`<div class='mn-icon'>${section.icon||'📍'}</div><div class='mn-info'><div class='mn-name'>${section.name}</div><div class='mn-desc'>${section.desc||''}</div></div><div class='mn-status'>${section.status||''}</div>`;
    node.onclick = ()=> {
      if(section.onClick) section.onClick(section);
    };
    path.appendChild(node);
  });
}

export function createSimpleCourseMap() {
  // Auto-build sections from NODE_CONFIG — no manual wiring needed per node
  const nodes = getNodesByCourse('basics-of-anesthesia');

  const sections = nodes.map(({ nodeId, courseId, title, chapterLabel, icon, questionsMeta }) => {
    const meta = questionsMeta || getQuestionMetadata(courseId, nodeId);
    const desc = meta
      ? `${meta.totalQuestions} questions (${meta.questionTypes?.mcq ?? 0} MCQ, ${meta.questionTypes?.multi ?? 0} Multi, ${meta.questionTypes?.short ?? 0} Short)`
      : 'Questions loading...';
    return {
      name:     `${title} — ${chapterLabel}`,
      desc,
      status:   'Ready',
      icon:     icon || '📍',
      available: true,
      courseId,
      nodeId,
      onClick:  (section) => startStudySessionForNode(section.courseId, section.nodeId),
    };
  });

  if (sections.length > 0) {
    renderSectionList(sections);
  } else {
    const allQuestions = filterQuestions({ mode: 'all' });
    renderSectionList([{
      name:    'Hemodynamic Mastery',
      desc:    `${allQuestions.length} questions available`,
      status:  'Ready',
      icon:    '🎯',
      onClick: () => { console.debug('Section selected'); },
    }]);
  }
}

// Number of questions per study session (subset of full bank)
const SESSION_SIZE = 15;

/**
 * Start a study session for a specific course/node.
 * Always pulls questions from NODE_CONFIG — never falls back to legacy banks.
 */
export function startStudySessionForNode(courseId, nodeId) {
  console.log('Loading node:', nodeId);

  const questions = getQuestionsForNode(courseId, nodeId);

  if (!questions || questions.length === 0) {
    console.error(`No questions found for ${courseId}/${nodeId}`);
    return;
  }

  console.log('Question count (full bank):', questions.length);

  // Shuffle and take a session-sized subset
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  const sessionQuestions = shuffled.slice(0, Math.min(SESSION_SIZE, shuffled.length));

  console.log('Session size:', sessionQuestions.length);

  // Store session info — totalInBank used for node completion %
  window.currentSession = {
    courseId,
    nodeId,
    questions: sessionQuestions,
    totalInBank: questions.length,
  };

  // Start the game — startGameWithQuestions handles all display switching
  if (window.startGameWithQuestions) {
    window.startGameWithQuestions(sessionQuestions);
    return;
  }

  // Fallback if shim not loaded yet
  if (window.engineStartRun) {
    window.engineStartRun({ questions: sessionQuestions, lives: 3, mode: 'lesson' });
  }
  hideMap();
  const splash = document.getElementById('splash');
  const game = document.getElementById('game');
  const levelMap = document.getElementById('level-map');
  if (splash) splash.style.display = 'none';
  if (game) game.style.display = 'flex';
  if (levelMap) levelMap.classList.remove('on');
  if (window.renderCurrentQuestion) window.renderCurrentQuestion();
  if (window.updateHUD) window.updateHUD();
}

export function setLastSeen(course, section, lesson) {
  const state = loadState();
  state.lastSeen = {course, section, lesson};
  saveState(state);
}

// Expose for global access
window.startStudySessionForNode = startStudySessionForNode;
