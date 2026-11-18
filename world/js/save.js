// save.js: the world's saved state for the signed-in user. It lives beside the app's existing save, under the same
// per-user key with a "::world" suffix, so nothing the classic app stores is read, changed or put at risk.
// Two ledgers, kept apart on purpose:
//   game      what is yours: character, position, preferences, the collection, the case archive, your notes
//   learning  what you showed you know: every answer with its objective, correctness, confidence, help used and time,
//             and what is due again
// Accounts come from core/auth.js. With a sync server behind the page the save is pulled down at sign-in
// and pushed back as you work, so it follows you to another device; without one it stays in this browser.
import { getSession, getUserSaveKey, noteSaved } from '../../core/auth.js';

const VERSION = 3;   // 3: the institute. The island's plot and blocks are retired; what was earned there is kept.
const fresh = () => ({
  v: VERSION, createdAt: Date.now(), lastSeen: null, visits: 0,
  character: null,                                   // { name, person, colour }  (saved key: kept as written so existing saves load)
  game: { pos: null, prefs: null, rewards: [], collection: [], cases: {}, notes: {}, best: {}, progress: {}, lessonDone: false, filmDone: false },
  learning: { objectives: {}, attempts: [], due: [] },
});
export const key = () => getUserSaveKey() + '::world';
export function load() {
  if (!getSession()) return null;
  try { let raw = JSON.parse(localStorage.getItem(key())); if (raw && raw.v === 1) raw = migrate1to2(raw); if (raw && raw.v === 2) raw = migrate2to3(raw);
    if (raw && raw.v === VERSION) return { ...fresh(), ...raw, game: { ...fresh().game, ...raw.game }, learning: { ...fresh().learning, ...raw.learning } }; } catch (e) { /* fall through to a fresh save */ }
  return fresh();
}
export function migrate1to2(raw) { const g = raw.game || {}; return { ...raw, v: 2, migratedFrom: 1, game: { ...g, pos: null } }; }
/** Version 2 saves were made on the block island. Learning records are kept untouched. What was earned becomes its
 *  counterpart in the collection; the plot, its blocks and the block character have no counterpart and are dropped. */
export function migrate2to3(raw) {
  const g = raw.game || {}, had = g.rewards || [], at = raw.lastSeen || Date.now(), col = [];
  if (had.includes('plexus-model') || had.includes('nerve-stimulator')) col.push({ id: 'plexus-specimen', at, from: 'earned before the institute' });
  if (had.includes('nerve-stimulator')) col.push({ id: 'stimulator-layer', at, from: 'earned before the institute' });
  if (had.includes('block-cap')) col.push({ id: 'regional-patch', at, from: 'earned before the institute' });
  return { ...raw, v: 3, migratedFrom: raw.migratedFrom || 2, character: raw.character ? { name: raw.character.name, person: 'tunic', colour: 'ceil' } : null,
    game: { pos: null, prefs: null, rewards: had, collection: col, cases: {}, notes: {}, best: {}, progress: g.progress || {}, lessonDone: !!g.lessonDone, filmDone: false } };
}
/** Signed out, there is no key to write to: getUserSaveKey() falls back to the legacy key, which is shared
 *  by everyone who has ever used this browser. A save that lands there is one person's work under a name
 *  the next person also gets. load() has always refused without a session; so does this now. */
export function save(state) { if (!getSession()) return false;
  state.lastSeen = Date.now(); try { localStorage.setItem(key(), JSON.stringify(state)); noteSaved('world'); return true; } catch (e) { return false; } }

const DAY = 86400000;
/** Record one answer.
 *  evidence    'identified' | 'related' | 'applied' | 'recognised' | 'recalled (self-rated)'
 *  confidence  1..3 where it was asked
 *  assist      null when the answer was unaided; otherwise what helped: 'hint', 'retry' (a second try after feedback), 'labels'
 *  ms          time from the question appearing to the answer
 *  where       the route that asked: 'gallery', 'studio', 'direct', 'review'
 * Assisted answers are kept, and never counted as independent retrieval or scheduled as known. */
export function recordAttempt(state, { objective, outline = null, item, evidence, correct, confidence = null, picked = null, assist = null, ms = null, where = null, view = null }) {
  const now = Date.now(), L = state.learning;
  L.attempts.push({ t: now, objective, outline, item, evidence, correct, confidence, picked, assist, ms, where, view }); if (L.attempts.length > 800) L.attempts.splice(0, L.attempts.length - 800);
  const o = L.objectives[objective] ||= { seen: 0, correct: 0, byEvidence: {}, last: null }; if (outline) o.outline = outline;
  if (assist) { o.assisted = (o.assisted || 0) + 1; o.last = now; return; }                       // help was used: it does not move what is known or when it is due
  o.seen++; if (correct) o.correct++; o.last = now;
  const e = o.byEvidence[evidence] ||= { seen: 0, correct: 0 }; e.seen++; if (correct) e.correct++;
  const prior = L.due.find((d) => d.item === item); if (prior && prior.at <= now && now - (prior.set || 0) > 20 * 3600000) { o.delayed = (o.delayed || 0) + 1; if (correct) o.delayedCorrect = (o.delayedCorrect || 0) + 1; }   // it came back after a day or more
  // missed, or right but a guess: it comes back soon. Right and sure: it comes back later.
  L.due = L.due.filter((d) => d.item !== item);
  const step = !correct ? 1 : confidence === 1 ? 2 : 6;
  L.due.push({ item, objective, at: now + step * DAY, set: now, reason: !correct ? 'missed' : confidence === 1 ? 'guessed' : 'spaced' });
}
export const dueNow = (state, now = Date.now()) => state.learning.due.filter((d) => d.at <= now);
/** Four different things, never merged into one number: coverage, assisted work, independent retrieval, delayed retention. */
export function summary(state) {
  const A = state.learning.attempts, own = A.filter((a) => !a.assist), pct = (xs) => xs.length ? Math.round(100 * xs.filter((a) => a.correct).length / xs.length) : null, ev = (k) => own.filter((a) => a.evidence === k);
  const byOutline = {}; for (const a of own) if (a.outline) { const o = byOutline[a.outline] ||= { seen: 0, correct: 0 }; o.seen++; if (a.correct) o.correct++; }
  const O = Object.values(state.learning.objectives), delayed = O.reduce((s, o) => s + (o.delayed || 0), 0), delayedOk = O.reduce((s, o) => s + (o.delayedCorrect || 0), 0);
  return { identified: pct(ev('identified')), related: pct(ev('related')), applied: pct(ev('applied')), recognised: pct(ev('recognised')), attempts: own.length, assisted: A.length - own.length, covered: O.length,
    delayed, delayedPct: delayed ? Math.round(100 * delayedOk / delayed) : null, due: dueNow(state).length, missedWaiting: state.learning.due.filter((d) => d.reason !== 'spaced').length, byOutline };
}
export const has = (state, id) => state.game.collection.some((c) => c.id === id);
export function grant(state, id, from) { if (has(state, id)) return false; state.game.collection.push({ id, at: Date.now(), from }); return true; }
