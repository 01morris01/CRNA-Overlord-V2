import { loadState, saveState } from '../core/state.js';
import { filterQuestions, getQuestionsForNode, getQuestionMetadata } from '../core/questionEngine.js';

// Course definitions with their nodes
const COURSES = {
  'basics-of-anesthesia': {
    name: 'Basics of Anesthesia',
    icon: '💊',
    nodes: [
      { id: 'node-9', name: 'Opioids', chapter: 'Chapter 9', icon: '💉', available: true }
    ]
  }
};

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
  const state = loadState();
  
  // Check for opioids questions first
  const opioidsMetadata = getQuestionMetadata('basics-of-anesthesia', 'node-9');
  
  if (opioidsMetadata) {
    // Create section for Opioids
    const sections = [{
      name: 'Opioids - Chapter 9',
      desc: `${opioidsMetadata.totalQuestions} questions (${opioidsMetadata.questionTypes.mcq} MCQ, ${opioidsMetadata.questionTypes.multi} Multi-Select, ${opioidsMetadata.questionTypes.short} Short Answer)`,
      status: 'Ready',
      icon: '💉',
      available: true,
      courseId: 'basics-of-anesthesia',
      nodeId: 'node-9',
      onClick: (section) => {
        startStudySessionForNode(section.courseId, section.nodeId);
      }
    }];
    
    renderSectionList(sections);
  } else {
    // Fallback to legacy questions
    const allQuestions = filterQuestions({mode:'all'});
    const section = {
      name:'Hemodynamic Mastery',
      desc:`${allQuestions.length} questions available`,
      status:'Ready',
      icon:'🎯',
      onClick:()=>{
        console.debug('Section selected');
      }
    };
    renderSectionList([section]);
  }
}

/**
 * Start a study session for a specific course/node
 */
export function startStudySessionForNode(courseId, nodeId) {
  const questions = getQuestionsForNode(courseId, nodeId);
  
  if (!questions || questions.length === 0) {
    console.error(`No questions found for ${courseId}/${nodeId}`);
    return;
  }
  
  // Shuffle questions for variety
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  
  // Store session info
  window.currentSession = {
    courseId,
    nodeId,
    questions: shuffled
  };
  
  // Start the game with these questions
  if (window.startGameWithQuestions) {
    window.startGameWithQuestions(shuffled);
  } else if (window.engineStartRun) {
    window.engineStartRun({ questions: shuffled, lives: 3, mode: 'lesson' });
  }
  
  // Hide map and show game
  hideMap();
  const splash = document.getElementById('splash');
  const game = document.getElementById('game');
  const levelMap = document.getElementById('level-map');
  
  if (splash) splash.style.display = 'none';
  if (game) game.style.display = 'flex';
  if (levelMap) levelMap.classList.remove('on');
  
  // Render first question
  if (window.renderCurrentQuestion) {
    window.renderCurrentQuestion();
  }
  if (window.updateHUD) {
    window.updateHUD();
  }
}

export function setLastSeen(course, section, lesson) {
  const state = loadState();
  state.lastSeen = {course, section, lesson};
  saveState(state);
}

// Expose for global access
window.startStudySessionForNode = startStudySessionForNode;
