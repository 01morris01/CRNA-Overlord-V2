/**
 * Headless self-test for the scene-as-data refactor.
 *
 * Confirms:
 *   1. sceneRegistry.js exports the 5 expected kinds and each value is a function.
 *   2. questionEngine.normalizeQuestions preserves q.scene + q.sceneCfg for both
 *      the flat form {scene: "ecg_waveform", sceneCfg: {...}} and the nested
 *      form {scene: {kind: "ecg_waveform", params: {...}}}.
 *   3. A question with no scene field still normalizes with scene=null, so the
 *      tier-2 (node-level) fallback in gameUI.js can take over.
 *
 * This cannot render a canvas, so it doesn't exercise runScene() — that part
 * needs a real browser. But it proves the JS data path is intact.
 */

import assert from 'node:assert/strict';

// Minimal window shim so the registry's `if (typeof window !== 'undefined')`
// block doesn't crash when it tries to attach globals.
globalThis.window = globalThis.window || {};

const { SCENE_REGISTRY, SCENE_KINDS, runScene, stopActiveScene } =
  await import('../ui/sceneRegistry.js');

// State.js talks to localStorage when loaded. questionEngine.js imports it.
// Give it just enough of a storage shim to avoid blowing up.
globalThis.localStorage = globalThis.localStorage || {
  _d: {},
  getItem(k) { return k in this._d ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
  clear() { this._d = {}; },
};

const { normalizeQuestions } = await import('../core/questionEngine.js');

// ─── 1. Registry shape ──────────────────────────────────────────────────────

// Original tier-1 kinds (cardio/pharm course).
const originalKinds = [
  'patient',
  'ecg_waveform',
  'frank_starling',
  'vessel_cross_section',
  'action_potential',
];

// Pathophysiology additions (Adv Phys & Pathophysiology course). These must
// stay in lockstep with ui/sceneRegistry.js — if you add a new primitive to
// support a new question, add it here too so this check enforces coverage.
const pathoKinds = [
  'cell_membrane',
  'ion_gradient_bars',
  'sarcomere',
  'oxygen_dissociation',
  'nephron_flow',
  'starling_forces',
  'feedback_loop',
  'pv_loop',
  'shock_spiral',
];

// Chemistry & Physics additions.
const chemPhysKinds = [
  'gas_piston',
  'iv_drip_calc',
  'pressure_depth',
];

const expectedKinds = [...originalKinds, ...pathoKinds, ...chemPhysKinds];

for (const k of expectedKinds) {
  assert.ok(SCENE_REGISTRY[k], `SCENE_REGISTRY missing "${k}"`);
  assert.equal(typeof SCENE_REGISTRY[k], 'function', `"${k}" is not a function`);
}
assert.deepEqual(SCENE_KINDS.sort(), [...expectedKinds].sort(), 'SCENE_KINDS mismatch');
assert.equal(typeof runScene, 'function');
assert.equal(typeof stopActiveScene, 'function');
console.log(`[ok] registry exports ${expectedKinds.length} expected draw functions`);

// ─── 2a. Nested form ────────────────────────────────────────────────────────

const nested = {
  id: 'mock_nested',
  type: 'mcq',
  prompt: 'A question',
  ans: [{ t: 'A', ok: true }, { t: 'B', ok: false }],
  scene: { kind: 'ecg_waveform', params: { rhythm: 'sinus', rate: 80 } },
  metadata: { nodeId: 'node-4' },
};
const [nNested] = normalizeQuestions([nested], 'node-4');
assert.equal(nNested.scene, 'ecg_waveform', 'nested form: scene kind not preserved');
assert.deepEqual(nNested.sceneCfg, { rhythm: 'sinus', rate: 80 }, 'nested form: params not preserved');
console.log('[ok] nested form preserved: scene=ecg_waveform, params flattened to sceneCfg');

// ─── 2b. Flat form ──────────────────────────────────────────────────────────

const flat = {
  id: 'mock_flat',
  type: 'mcq',
  prompt: 'Another question',
  ans: [{ t: 'A', ok: true }],
  scene: 'frank_starling',
  sceneCfg: { shift: 'failure' },
  metadata: { nodeId: 'node-4' },
};
const [nFlat] = normalizeQuestions([flat], 'node-4');
assert.equal(nFlat.scene, 'frank_starling', 'flat form: scene string not preserved');
assert.deepEqual(nFlat.sceneCfg, { shift: 'failure' }, 'flat form: cfg not preserved');
console.log('[ok] flat form preserved: scene=frank_starling, cfg passthrough');

// ─── 2c. Missing scene ──────────────────────────────────────────────────────

const bare = {
  id: 'mock_bare',
  type: 'mcq',
  prompt: 'No scene',
  ans: [{ t: 'A', ok: true }],
  metadata: { nodeId: 'node-4' },
};
const [nBare] = normalizeQuestions([bare], 'node-4');
assert.equal(nBare.scene, null, 'bare question: scene should be null');
assert.deepEqual(nBare.sceneCfg, {}, 'bare question: sceneCfg should be {}');
console.log('[ok] bare question normalizes with scene=null (gameUI will fall back to node renderer)');

// ─── 2d. Legacy format (non-prompt) still defaults to "patient" ─────────────

const legacy = {
  id: 'mock_legacy',
  q: 'Legacy question',
  ch: 'Ch.14',
  type: 'mcq',
  ans: [{ t: 'A', ok: true }],
  scene: 'vessel_cross_section',
  sceneCfg: { radius: 70 },
};
const [nLegacy] = normalizeQuestions([legacy], null);
assert.equal(nLegacy.scene, 'vessel_cross_section', 'legacy form: scene not preserved');
assert.deepEqual(nLegacy.sceneCfg, { radius: 70 }, 'legacy form: cfg not preserved');
console.log('[ok] legacy format still preserves scene fields through the unchanged path');

// ─── 3. Registry dispatch check (without canvas) ────────────────────────────

// We can't actually render (no canvas in Node), but we can confirm that each
// registered kind matches a question that would flow through it, purely by
// checking membership.
for (const q of [nNested, nFlat, nLegacy]) {
  assert.ok(SCENE_REGISTRY[q.scene], `registry missing entry for ${q.scene}`);
}
console.log('[ok] every normalized scene kind maps to a registry entry');

console.log('\nALL CHECKS PASSED');
