// save.js: the world's saved state for the signed-in user. It lives beside the app's existing save, under the same
// per-user key with a "::world" suffix, so nothing the classic app stores is read, changed or put at risk.
// Two ledgers, kept apart on purpose:
//   game      what you earned and built (character, items, plot, discoveries)
//   learning  what you showed you know, how, when, how sure you were, and what is due again
import { getSession, getUserSaveKey } from '../../core/auth.js';

const VERSION = 2;   // 2: the floating island. The plot moved; saved blocks move with it.
const fresh = () => ({
  v: VERSION, createdAt: Date.now(), lastSeen: null, visits: 0,
  character: null,                                   // { name, skin, hair, hairColor, scrubs, cap, glasses, steth }
  game: { pos: null, inventory: { plank: 16, glass: 8, lamp: 3, hedge: 6 }, plot: [], notes: [], rewards: [], lessonDone: false },
  learning: { objectives: {}, attempts: [], due: [] },
});
export const key = () => getUserSaveKey() + '::world';
export function load() {
  if (!getSession()) return null;
  try { let raw = JSON.parse(localStorage.getItem(key())); if (raw && raw.v === 1) raw = migrate1to2(raw);
    if (raw && raw.v === VERSION) return { ...fresh(), ...raw, game: { ...fresh().game, ...raw.game, inventory: { ...fresh().game.inventory, ...raw.game?.inventory } }, learning: { ...fresh().learning, ...raw.learning } }; } catch (e) { /* fall through to a fresh save */ }
  return fresh();
}
/** Version 1 saves were made on the first island. Everything is kept. Blocks built on the old plot move to the new
 *  plot (same layout, new place and height); the saved position is dropped so you arrive at the landing. */
export function migrate1to2(raw) {
  const g = raw.game || {}; return { ...raw, v: 2, migratedFrom: 1, game: { ...g, pos: null, plot: (g.plot || []).map(([x, y, z, t]) => [x + 14, y + 23, z + 16, t === 19 ? 20 : t === 13 ? 14 : t === 14 ? 15 : t === 8 ? 9 : t === 10 ? 11 : t]) } };
}
export function save(state) { state.lastSeen = Date.now(); try { localStorage.setItem(key(), JSON.stringify(state)); return true; } catch (e) { return false; } }

const DAY = 86400000;
/** Record one unaided answer. evidence: 'identified' | 'applied' | 'recalled' | 'recognised'. confidence 1..3. */
export function recordAttempt(state, { objective, outline = null, item, evidence, correct, confidence, picked }) {
  const now = Date.now(), L = state.learning;
  L.attempts.push({ t: now, objective, outline, item, evidence, correct, confidence, picked }); if (L.attempts.length > 600) L.attempts.splice(0, L.attempts.length - 600);
  const o = L.objectives[objective] ||= { seen: 0, correct: 0, byEvidence: {}, last: null }; if (outline) o.outline = outline;
  o.seen++; if (correct) o.correct++; o.last = now;
  const e = o.byEvidence[evidence] ||= { seen: 0, correct: 0 }; e.seen++; if (correct) e.correct++;
  // missed, or right but a guess: it comes back. Right and sure: it comes back later.
  L.due = L.due.filter((d) => d.item !== item);
  const step = !correct ? 1 : confidence === 1 ? 2 : 6;
  L.due.push({ item, objective, at: now + step * DAY, reason: !correct ? 'missed' : confidence === 1 ? 'guessed' : 'spaced' });
}
export const dueNow = (state, now = Date.now()) => state.learning.due.filter((d) => d.at <= now);
export function summary(state) {
  const A = state.learning.attempts, id = A.filter((a) => a.evidence === 'identified'), ap = A.filter((a) => a.evidence === 'applied');
  const pct = (xs) => xs.length ? Math.round(100 * xs.filter((a) => a.correct).length / xs.length) : null;
  const byOutline = {}; for (const a of A) if (a.outline) { const o = byOutline[a.outline] ||= { seen: 0, correct: 0 }; o.seen++; if (a.correct) o.correct++; }
  return { identified: pct(id), related: pct(A.filter((a) => a.evidence === 'related')), applied: pct(ap), attempts: A.length, due: dueNow(state).length, missedWaiting: state.learning.due.filter((d) => d.reason !== 'spaced').length, byOutline };
}
