/**
 * SMART REVIEW MODE
 * Builds review question pools from content the player has already encountered.
 * Slots into the existing startGameWithQuestions flow — no new game loop needed.
 */

import { loadState }           from '../core/state.js';
import { getNodesByCourse }    from '../core/nodeConfig.js';
import { getQuestionsForNode } from '../core/questionEngine.js';

// Max questions per review session
export const REVIEW_SESSION_SIZE = 5;

// ─── Pool helpers ─────────────────────────────────────────────────────────────

/**
 * Returns nodeIds from this course that the player has actually seen.
 * Falls back to all course nodes when no completion data exists yet.
 */
function _seenNodeIds(courseId) {
  const state = loadState();
  const nc    = state.nodeCompletion || {};
  const nodes = getNodesByCourse(courseId).map(n => n.nodeId);
  const seen  = nodes.filter(id => nc[id] && nc[id].seen > 0);
  return seen.length > 0 ? seen : nodes; // fallback: show all if nothing seen yet
}

/** Returns all normalized questions from seen nodes for a course. */
function _buildPool(courseId) {
  const pool = [];
  for (const nodeId of _seenNodeIds(courseId)) {
    pool.push(...getQuestionsForNode(courseId, nodeId));
  }
  return pool;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns question counts for each review bucket.
 * Used to populate the review panel button labels.
 */
export function getReviewCounts(courseId) {
  const state   = loadState();
  const pool    = _buildPool(courseId);
  const poolIds = new Set(pool.map(q => q.id));

  const missedSet = new Set(state.missedQuestionIds || []);
  const savedSet  = new Set(state.savedForLater     || []);

  const missed = pool.filter(q => missedSet.has(q.id)).length;
  const saved  = pool.filter(q => savedSet.has(q.id)).length;

  // Weak: topics where correct/attempted ratio < 0.6 and at least 1 attempt
  const perf       = state.performanceByTopic || {};
  const weakTopics = new Set(
    Object.entries(perf)
      .filter(([, p]) => p.attempted > 0 && (p.correct / p.attempted) < 0.6)
      .map(([topic]) => topic)
  );
  const weak  = pool.filter(q => weakTopics.has(q.metadata?.topicId)).length;
  const mixed = pool.length;

  return { missed, weak, saved, mixed };
}

/**
 * Builds a review session for the given bucket.
 * Returns up to REVIEW_SESSION_SIZE normalized question objects.
 */
export function buildReviewSession(bucket, courseId) {
  const state = loadState();
  const pool  = _buildPool(courseId);
  let selected = [];

  if (bucket === 'missed') {
    const ids = new Set(state.missedQuestionIds || []);
    selected  = pool.filter(q => ids.has(q.id));

  } else if (bucket === 'saved') {
    const ids = new Set(state.savedForLater || []);
    selected  = pool.filter(q => ids.has(q.id));

  } else if (bucket === 'weak') {
    const perf       = state.performanceByTopic || {};
    const weakTopics = new Set(
      Object.entries(perf)
        .filter(([, p]) => p.attempted > 0 && (p.correct / p.attempted) < 0.6)
        .map(([topic]) => topic)
    );
    selected = pool.filter(q => weakTopics.has(q.metadata?.topicId));
    // Sort weakest topics first so the most-broken concepts come up first
    selected.sort((a, b) => {
      const pa = perf[a.metadata?.topicId] || { correct: 0, attempted: 1 };
      const pb = perf[b.metadata?.topicId] || { correct: 0, attempted: 1 };
      return (pa.correct / pa.attempted) - (pb.correct / pb.attempted);
    });

  } else {
    // mixed — random sample across all seen nodes
    selected = [...pool].sort(() => Math.random() - 0.5);
  }

  // Shuffle (except weak, which is pre-sorted) and cap
  if (bucket !== 'weak') {
    selected = [...selected].sort(() => Math.random() - 0.5);
  }
  return selected.slice(0, REVIEW_SESSION_SIZE);
}

// ─── Panel UI ─────────────────────────────────────────────────────────────────

function _updateBtn(id, count, label) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.textContent   = count > 0 ? `${label}  (${count})` : label;
  btn.disabled      = count === 0;
  btn.style.opacity = count === 0 ? '0.3' : '1';
}

/**
 * Show the review panel for a course, hiding the Leaflet world-map.
 * Populates all bucket buttons with live counts.
 */
export function showReviewPanel(courseId) {
  const panel     = document.getElementById('review-panel');
  const worldMap  = document.getElementById('world-map');
  const startBtn  = document.getElementById('start-session-btn');
  const modeCon   = document.getElementById('mode-container');

  if (!panel) return;

  // Swap world-map for review panel
  if (worldMap)  worldMap.style.display  = 'none';
  if (startBtn)  startBtn.style.display  = 'none';
  if (modeCon)   modeCon.style.display   = 'none';

  // Store active courseId for launchReviewBucket to read
  panel.dataset.courseId = courseId;

  const counts = getReviewCounts(courseId);
  _updateBtn('review-missed-btn', counts.missed, '🩸 RETRY MISSED');
  _updateBtn('review-weak-btn',   counts.weak,   '🧠 WEAK CONCEPTS');
  _updateBtn('review-saved-btn',  counts.saved,  '📌 SAVED FOR LATER');
  _updateBtn('review-mixed-btn',  counts.mixed,  '🔀 MIXED REVIEW');

  // Sync Recall First toggle state
  const recallOn = !!loadState().recallFirstEnabled;
  panel.querySelectorAll('.recall-toggle-btn').forEach(btn => {
    btn.textContent    = recallOn ? '● ON' : '○ OFF';
    btn.style.background    = recallOn ? 'rgba(0,255,136,.15)' : 'rgba(30,30,50,.6)';
    btn.style.borderColor   = recallOn ? 'rgba(0,255,136,.5)'  : 'rgba(80,80,120,.4)';
    btn.style.color         = recallOn ? '#00ff88' : '#555';
  });

  panel.style.display = 'flex';
}

/**
 * Hide the review panel and restore the world-map.
 * Call window.invalidateWorldMap() after to fix Leaflet tile sizing.
 */
export function hideReviewPanel() {
  const panel    = document.getElementById('review-panel');
  const worldMap = document.getElementById('world-map');

  if (panel)    panel.style.display    = 'none';
  if (worldMap) worldMap.style.display = 'block';

  if (typeof window.invalidateWorldMap === 'function') {
    setTimeout(window.invalidateWorldMap, 50);
  }
}
