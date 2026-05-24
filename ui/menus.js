import { loadState, saveState, SYNTHESIS_UNLOCK_THRESHOLD, resetSessionTimerFlags } from '../core/state.js';
import { filterQuestions, getQuestionsForNode, getQuestionMetadata } from '../core/questionEngine.js';
import { getNodesByCourse, getDistinctCourses, getNodeConfig } from '../core/nodeConfig.js';
import { getCurrentRun } from '../core/gameEngine.js';

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
 * Build an adaptive recall session with soft-gated atom→synthesis ordering.
 *
 * Rules:
 *  - Atoms come first, INTERLEAVED across topics (not blocked by topic).
 *  - Synthesis questions whose feeder topics are all unlocked are eligible.
 *  - Synthesis questions with non-empty feeder_atoms whose topics are NOT all
 *    unlocked are DEFERRED (moved to back), but never removed.
 *  - If the node has zero atoms, the list is simply shuffled (graceful
 *    degradation — identical to pre-adaptive behavior).
 */
function _buildAdaptiveRecallSession(pool) {
  const state = loadState();
  const tc = state.topicCompetence || {};

  const atoms = pool.filter(q => q.tier === 'atom');
  const synthesis = pool.filter(q => q.tier !== 'atom');

  // ── Graceful degradation: no atoms → plain shuffle ────────────────────
  if (atoms.length === 0) {
    const shuffled = [...synthesis].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(SESSION_SIZE, shuffled.length));
  }

  // ── Interleave atoms across topics ────────────────────────────────────
  const atomsByTopic = {};
  for (const a of atoms) {
    const t = a.concept_tag || a.metadata?.topic || a.topic || '_none';
    (atomsByTopic[t] = atomsByTopic[t] || []).push(a);
  }
  // Shuffle within each topic bucket
  for (const t of Object.keys(atomsByTopic)) {
    atomsByTopic[t].sort(() => Math.random() - 0.5);
  }
  // Round-robin interleave
  const interleavedAtoms = [];
  const topicKeys = Object.keys(atomsByTopic).sort(() => Math.random() - 0.5);
  let moreAtoms = true;
  while (moreAtoms) {
    moreAtoms = false;
    for (const t of topicKeys) {
      if (atomsByTopic[t].length > 0) {
        interleavedAtoms.push(atomsByTopic[t].shift());
        moreAtoms = true;
      }
    }
  }

  // ── Partition synthesis into eligible vs deferred ──────────────────────
  const eligible = [];
  const deferred = [];
  for (const sq of synthesis) {
    const feeders = sq.feeder_atoms || [];
    if (feeders.length === 0) {
      // No atom dependencies — eligible immediately
      eligible.push(sq);
    } else {
      // Check if ALL feeder topics are unlocked
      const feederTopics = _feederTopics(feeders, pool);
      const allUnlocked = feederTopics.every(t => tc[t]?.synthesisUnlocked);
      if (allUnlocked) {
        eligible.push(sq);
      } else {
        deferred.push(sq);
      }
    }
  }

  // Shuffle both groups
  eligible.sort(() => Math.random() - 0.5);
  deferred.sort(() => Math.random() - 0.5);

  // ── Assemble: atoms first, then eligible synthesis, then deferred ─────
  const ordered = [...interleavedAtoms, ...eligible, ...deferred];
  return ordered.slice(0, Math.min(SESSION_SIZE, ordered.length));
}

/**
 * Given a list of feeder atom IDs, return the set of topics those atoms cover.
 * Looks up each atom ID in the pool to find its topic.
 */
function _feederTopics(feederIds, pool) {
  const topics = new Set();
  for (const fid of feederIds) {
    const atom = pool.find(q => q.id === fid);
    if (atom) {
      topics.add(atom.concept_tag || atom.metadata?.topic || atom.topic || '_none');
    }
  }
  return [...topics];
}

/**
 * After each graded recall question, reorder the remaining questions in the
 * live session based on rolling session accuracy and topic competence.
 *
 * - If rolling accuracy < 60%: push all synthesis to the back (keep on atoms).
 * - If rolling accuracy >= 60%: synthesis whose feeder topics are all unlocked
 *   move ahead of deferred synthesis.
 * - A synthesis question is served only after at least one atom from each of
 *   its feeder topics has been attempted THIS session OR those topics were
 *   already unlocked from prior sessions.
 *
 * This is a no-op for non-recall modes and for nodes with zero atoms.
 */
export function adaptRecallSession() {
  const run = window.currentSession;
  const cr = getCurrentRun();
  if (!run || run.mode !== 'free-recall' || !cr) return;

  const idx = cr.index; // current question index (just answered)
  const remaining = cr.questions.slice(idx);
  if (remaining.length <= 1) return; // nothing left to reorder

  const atoms    = remaining.filter(q => q.tier === 'atom');
  const synthQs  = remaining.filter(q => q.tier !== 'atom');

  // No atoms remaining → nothing to adapt
  if (atoms.length === 0 && synthQs.every(s => !(s.feeder_atoms?.length))) return;

  // Rolling session accuracy
  const results = cr.results || [];
  const graded  = results.length;
  const correct = results.filter(r => r.correct).length;
  const accuracy = graded > 0 ? (correct / graded) * 100 : 100;

  // Topics attempted this session
  const attemptedTopics = new Set(results.map(r => r.topic));

  // Current topic competence from state
  const state = loadState();
  const tc    = state.topicCompetence || {};

  // Partition synthesis
  const eligibleSynth = [];
  const deferredSynth = [];

  for (const sq of synthQs) {
    const feeders = sq.feeder_atoms || [];
    if (feeders.length === 0) {
      // No dependencies — eligible
      eligibleSynth.push(sq);
      continue;
    }

    const feederTopics = _feederTopics(feeders, cr.questions);

    // Check: at least one atom from each feeder topic attempted this session
    // OR that topic was already unlocked from prior sessions
    const allFeedersSatisfied = feederTopics.every(t =>
      attemptedTopics.has(t) || tc[t]?.synthesisUnlocked
    );

    // Check: all feeder topics unlocked
    const allUnlocked = feederTopics.every(t => tc[t]?.synthesisUnlocked);

    if (allFeedersSatisfied && allUnlocked) {
      eligibleSynth.push(sq);
    } else {
      deferredSynth.push(sq);
    }
  }

  // If struggling (< 60%), push ALL synthesis to back
  let reordered;
  if (accuracy < 60) {
    reordered = [...atoms, ...eligibleSynth, ...deferredSynth];
  } else {
    reordered = [...atoms, ...eligibleSynth, ...deferredSynth];
  }

  // Replace remaining portion of the question list
  cr.questions = [...cr.questions.slice(0, idx), ...reordered];
}

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

  // Reset per-session timer flags so tightening is allowed once this session
  resetSessionTimerFlags();
  // Clear per-session notice trackers
  window._synthesisUnlockNoticeShown = new Set();
  window._timerShiftNoticeShown = new Set();

  let pool = questions;
  let sessionQuestions;

  if (mode === 'free-recall') {
    pool = questions.filter(q => q.type === 'recall');
    if (pool.length === 0) {
      console.error('No recall questions for this node');
      return;
    }
    sessionQuestions = _buildAdaptiveRecallSession(pool);
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
