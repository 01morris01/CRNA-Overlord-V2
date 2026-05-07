/**
 * Daily Mission System.
 * Generates a deterministic daily mission seeded by today's date.
 * All users get the same mission; it changes at local midnight.
 */

import { getDistinctCourses, getNodesByCourse } from './nodeConfig.js';
import { loadState, saveState } from './state.js';

function _dateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

/** Simple hash for seeding. */
function _hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Pick a node deterministically from all populated nodes. */
function _pickNode(seed) {
  const courses = getDistinctCourses();
  const allNodes = [];
  courses.forEach(c => {
    getNodesByCourse(c.courseId).forEach(n => {
      if (n.questions && n.questions.length >= 5) {
        allNodes.push({ courseId: c.courseId, nodeId: n.nodeId, title: n.title, count: n.questions.length });
      }
    });
  });
  if (allNodes.length === 0) return null;
  return allNodes[seed % allNodes.length];
}

/** Get today's mission. */
export function getDailyMission() {
  const today = _dateString();
  const seed = _hashStr(today);
  const node = _pickNode(seed);
  if (!node) return null;

  return {
    date: today,
    nodeId: node.nodeId,
    courseId: node.courseId,
    nodeTitle: node.title,
    targetCorrect: 5,
    minAccuracy: 0.8,
    noPowerups: true,
    reward: 500,
  };
}

/** Check if today's mission is already completed. */
export function isMissionComplete() {
  const state = loadState();
  const today = _dateString();
  return !!(state.dailyMissions && state.dailyMissions[today]);
}

/** Mark today's mission as complete and bank reward. */
export function completeMission() {
  const state = loadState();
  if (!state.dailyMissions) state.dailyMissions = {};
  const today = _dateString();
  if (state.dailyMissions[today]) return; // already done

  state.dailyMissions[today] = { completedAt: Date.now() };
  state.bankedPts = (state.bankedPts || 0) + 500;
  state.totalPts = (state.totalPts || 0) + 500;
  saveState(state);
}

/** Get the current consecutive day streak. */
export function getMissionStreak() {
  const state = loadState();
  const missions = state.dailyMissions || {};
  let streak = 0;
  const d = new Date();

  // Count backwards from today
  for (let i = 0; i < 365; i++) {
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (missions[ds]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/** Render the daily mission card on the splash screen. */
export function renderMissionCard() {
  const mission = getDailyMission();
  if (!mission) return;

  const done = isMissionComplete();
  const streak = getMissionStreak();

  // Find or create the mission card container
  let card = document.getElementById('daily-mission-card');
  if (!card) {
    card = document.createElement('div');
    card.id = 'daily-mission-card';
    card.style.cssText = 'max-width:320px;width:100%;margin-bottom:1rem;padding:.8rem;background:var(--card,#0c1828);border:1px solid var(--border,#162035);border-radius:8px;text-align:center;';

    // Insert after logged-in-area
    const loggedIn = document.getElementById('logged-in-area');
    if (loggedIn && loggedIn.parentNode) {
      loggedIn.parentNode.insertBefore(card, loggedIn.nextSibling);
    }
  }

  const statusIcon = done ? '\u2705' : '\u{1F3AF}';
  const statusText = done ? 'COMPLETE' : 'ACTIVE';
  const streakText = streak > 0 ? ` | ${streak} day streak` : '';

  card.innerHTML = `
    <div style="font-family:var(--fm);font-size:.5rem;color:var(--muted,#4a6282);letter-spacing:.15em;margin-bottom:.3rem;">TODAY'S MISSION${streakText}</div>
    <div style="font-size:.65rem;color:var(--txt,#dce8f5);font-weight:700;margin-bottom:.2rem;">${mission.nodeTitle}</div>
    <div style="font-size:.48rem;color:var(--muted-2,#7a95b0);margin-bottom:.3rem;">5 correct, 80% accuracy, no powerups. Reward: 500 pts.</div>
    <div style="font-size:.5rem;color:${done ? 'var(--green,#00ffa3)' : 'var(--amber,#ffc400)'};font-weight:700;">${statusIcon} ${statusText}</div>
  `;
}

// Check mission completion after a game session
export function checkMissionCompletion(run) {
  if (!run || isMissionComplete()) return;

  const mission = getDailyMission();
  if (!mission) return;

  const session = window.currentSession;
  if (!session || session.nodeId !== mission.nodeId) return;

  const correctCount = run.results.filter(r => r.correct).length;
  const totalCount = run.results.length;
  const accuracy = totalCount > 0 ? correctCount / totalCount : 0;

  if (correctCount >= mission.targetCorrect && accuracy >= mission.minAccuracy) {
    completeMission();
    renderMissionCard(); // refresh the card
  }
}
