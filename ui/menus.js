import { loadState, saveState } from '../core/state.js';
import { filterQuestions, getQuestionsForNode, getQuestionMetadata } from '../core/questionEngine.js';
import { getNodesByCourse, getDistinctCourses, getNodeConfig } from '../core/nodeConfig.js';

/** Currently selected courseId — defaults to last-used or first available. */
let _activeCourseId = null;

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
    node.innerHTML=`<div class='mn-icon'>${section.icon||'📍'}</div><div class='mn-info'><div class='mn-name'>${section.name}</div><div class='mn-desc'>${section.desc||''}</div><div class='mn-badge'>${section.status||''}</div></div>`;
    node.onclick = ()=> {
      if(section.onClick) section.onClick(section);
    };
    path.appendChild(node);
  });
}

/**
 * Render the course tab bar into #course-tabs.
 * Highlights the active course and wires click → switchCourse().
 */
function renderCourseTabs() {
  const container = document.getElementById('course-tabs');
  if (!container) return;
  container.innerHTML = '';

  const courses = getDistinctCourses();

  courses.forEach(({ courseId, label, nodeCount }) => {
    const btn = document.createElement('button');
    btn.className = 'course-tab';
    if (courseId === _activeCourseId) btn.classList.add('active');
    btn.textContent = `${label} (${nodeCount})`;
    btn.onclick = () => switchCourse(courseId);
    container.appendChild(btn);
  });
}

/**
 * Switch to a different course — re-renders tabs + node list.
 */
export function switchCourse(courseId) {
  _activeCourseId = courseId;
  renderCourseTabs();
  _renderNodesForCourse(courseId);

  // Remember selection.
  const state = loadState();
  state.lastSeen = { ...(state.lastSeen || {}), course: courseId };
  saveState(state);
}

/**
 * Render the node list for one course into #map-path.
 */
function _renderNodesForCourse(courseId) {
  const nodes = getNodesByCourse(courseId);
  const state = loadState();
  const nc = state.nodeCompletion || {};

  const sections = nodes.map(({ nodeId, courseId: cid, title, chapterLabel, icon, questionsMeta }) => {
    const meta = questionsMeta || getQuestionMetadata(cid, nodeId);
    const desc = meta
      ? `${meta.totalQuestions} questions · ${meta.questionTypes?.mcq ?? 0} MCQ · ${meta.questionTypes?.multi ?? 0} Multi · ${meta.questionTypes?.short ?? 0} Short`
      : 'Questions loading...';

    const nodeData = nc[nodeId];
    const seen = nodeData?.seen || 0;
    const totalInBank = nodeData?.totalInBank || 0;
    const pct = totalInBank > 0 ? Math.min(100, Math.round((seen / totalInBank) * 100)) : 0;
    let status = 'Ready';
    if (pct >= 80)     status = `✅ ${pct}% explored`;
    else if (pct > 0)  status = `📈 ${pct}% seen`;

    return {
      name:     `${title} — ${chapterLabel}`,
      desc,
      status,
      icon:     icon || '📍',
      available: true,
      courseId: cid,
      nodeId,
      onClick:  (section) => startStudySessionForNode(section.courseId, section.nodeId),
    };
  });

  if (sections.length > 0) {
    renderSectionList(sections);
  } else {
    renderSectionList([{
      name:    'No nodes available',
      desc:    'This course has no question banks yet.',
      status:  '—',
      icon:    '📭',
      onClick: () => {},
    }]);
  }
}

export function createSimpleCourseMap() {
  // Determine initial course: last-used > first available
  if (!_activeCourseId) {
    const state = loadState();
    const lastCourse = state.lastSeen?.course;
    const courses = getDistinctCourses();
    if (lastCourse && courses.some(c => c.courseId === lastCourse)) {
      _activeCourseId = lastCourse;
    } else {
      _activeCourseId = courses[0]?.courseId || 'basics-of-anesthesia';
    }
  }

  renderCourseTabs();
  _renderNodesForCourse(_activeCourseId);
}

// Number of questions per study session (subset of full bank)
export const SESSION_SIZE = 15;

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

  // Store pending session for mode picker
  window._pendingSession = { courseId, nodeId, questions };

  // Show mode picker
  const modal = document.getElementById('mode-picker-modal');
  const nodeLabel = document.getElementById('mode-picker-node');
  if (nodeLabel) {
    const cfg = getNodeConfig(nodeId);
    nodeLabel.textContent = cfg ? `${cfg.title} (${questions.length} questions)` : nodeId;
  }

  // Check recall availability for free-recall mode button
  const recallCount = questions.filter(q => q.type === 'recall').length;
  const recallBtn = document.getElementById('mode-free-recall');
  const recallNotice = document.getElementById('mode-recall-notice');
  if (recallBtn) {
    if (recallCount === 0) {
      recallBtn.disabled = true;
      recallBtn.style.opacity = '.3';
      recallBtn.style.cursor = 'not-allowed';
      if (recallNotice) { recallNotice.style.display = 'block'; recallNotice.textContent = 'Coming soon for this node — no recall questions yet.'; }
    } else {
      recallBtn.disabled = false;
      recallBtn.style.opacity = '1';
      recallBtn.style.cursor = 'pointer';
      if (recallNotice && recallCount < 5) {
        recallNotice.style.display = 'block';
        recallNotice.textContent = `This node has only ${recallCount} recall question${recallCount > 1 ? 's' : ''}. Free recall is most effective with full coverage.`;
      } else if (recallNotice) {
        recallNotice.style.display = 'none';
      }
    }
  }

  if (modal) modal.style.display = 'flex';
}

// Launch with selected mode
window._launchWithMode = function(mode) {
  const modal = document.getElementById('mode-picker-modal');
  if (modal) modal.style.display = 'none';

  const pending = window._pendingSession;
  if (!pending) return;

  const { courseId, nodeId, questions } = pending;
  window._pendingSession = null;

  let pool = questions;
  let sessionQuestions;

  if (mode === 'free-recall') {
    pool = questions.filter(q => q.type === 'recall');
    if (pool.length === 0) {
      console.error('No recall questions for this node');
      return;
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    sessionQuestions = shuffled.slice(0, Math.min(SESSION_SIZE, shuffled.length));
  } else {
    // Shuffle and take session subset
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    sessionQuestions = shuffled.slice(0, Math.min(SESSION_SIZE, shuffled.length));

    // Append boss case: 3 high-priority questions from the same node
    const bossPool = pool.filter(q =>
      q.metadata?.priority === 'high' && !sessionQuestions.some(sq => sq.id === q.id)
    );
    const bossQuestions = bossPool.sort(() => Math.random() - 0.5).slice(0, 3);
    if (bossQuestions.length >= 3) {
      bossQuestions.forEach(q => { q._isBoss = true; });
      sessionQuestions.push(...bossQuestions);
    }
  }

  // Apply mode rules
  let lives = 3;
  if (mode === 'code-blue') lives = 1;
  if (mode === 'study') lives = 999;
  if (mode === 'free-recall') lives = 3;

  // Store session info
  window.currentSession = {
    courseId,
    nodeId,
    questions: sessionQuestions,
    totalInBank: questions.length,
    mode,
  };

  // Save last mode preference
  const state = loadState();
  state.lastMode = mode;
  saveState(state);

  // Store mode on window for timer/powerup logic
  window._sessionMode = mode;

  if (window.startGameWithQuestions) {
    window.startGameWithQuestions(sessionQuestions, { lives, mode });
    return;
  }

  if (window.engineStartRun) {
    window.engineStartRun({ questions: sessionQuestions, lives, mode });
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
};

export function setLastSeen(course, section, lesson) {
  const state = loadState();
  state.lastSeen = {course, section, lesson};
  saveState(state);
}

// Expose for global access
window.startStudySessionForNode = startStudySessionForNode;
