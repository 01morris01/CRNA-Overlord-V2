import { normalizeRubric } from './rubricLoader.js';

const DANGEROUS_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const SCORE_STATUS = Object.freeze({
  0: 'not_performed',
  1: 'partial',
  2: 'performed',
});

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function deepCopy(value, ancestors = new WeakSet()) {
  if (value === undefined || value === null) return value;
  if (['string', 'number', 'boolean'].includes(typeof value)) return value;
  if (typeof value !== 'object') throw new TypeError('Session data must be JSON-compatible');
  if (ancestors.has(value)) throw new TypeError('Session data must not contain cycles');
  if (!Array.isArray(value) && !isPlainObject(value)) {
    throw new TypeError('Session data objects must use a plain object prototype');
  }

  ancestors.add(value);
  const result = Array.isArray(value) ? [] : {};
  for (const [key, nested] of Object.entries(value)) {
    if (DANGEROUS_OBJECT_KEYS.has(key)) {
      throw new TypeError(`Dangerous session data key is not allowed: ${key}`);
    }
    Object.defineProperty(result, key, {
      configurable: true,
      enumerable: true,
      value: deepCopy(nested, ancestors),
      writable: true,
    });
  }
  ancestors.delete(value);
  return result;
}

function deepFreeze(value, visited = new WeakSet()) {
  if (value === null || typeof value !== 'object' || visited.has(value)) return value;
  visited.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, visited);
  return Object.freeze(value);
}

function immutableCopy(value) {
  return deepFreeze(deepCopy(value));
}

function requireTime(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new TypeError(`${label} must be a finite nonnegative number`);
  }
}

export class RubricScoringSession {
  constructor({ rubric, criteria = {}, seed = 12345 } = {}) {
    this.rubric = normalizeRubric(rubric);
    this.criteria = immutableCopy(criteria);
    this.seed = seed;

    this._states = new Map(this.rubric.items.map((item) => [item.id, {
      status: 'pending',
      points: null,
      note: '',
      updatedAtSec: null,
      evidence: null,
      revision: 0,
    }]));
    this._actionLedger = [];
    this._trace = [];
    this._finalResult = null;
  }

  _requireOpen() {
    if (this._finalResult !== null) throw new Error('Rubric scoring session is finalized');
  }

  _requireState(itemId) {
    const state = this._states.get(itemId);
    if (!state) throw new RangeError(`Unknown rubric item: ${itemId}`);
    return state;
  }

  recordAction({ tSec, action, meta = {}, snapshot } = {}) {
    this._requireOpen();
    requireTime(tSec, 'tSec');
    if (typeof action !== 'string' || action.trim().length === 0) {
      throw new TypeError('action must be a nonempty string');
    }

    const record = immutableCopy({ tSec, action, meta, snapshot });
    this._actionLedger.push(record);
    return immutableCopy(record);
  }

  recordTrace(snapshot) {
    this._requireOpen();
    if (!isPlainObject(snapshot)) throw new TypeError('Trace snapshot must be an object');
    if (!Number.isSafeInteger(snapshot.t) || snapshot.t < 0) {
      throw new TypeError('Trace snapshot .t timestamp must be a finite nonnegative safe integer');
    }

    const sample = immutableCopy(snapshot);
    const existingIndex = this._trace.findIndex((entry) => entry.t === sample.t);
    if (existingIndex >= 0) {
      this._trace[existingIndex] = sample;
    } else {
      const insertionIndex = this._trace.findIndex((entry) => entry.t > sample.t);
      if (insertionIndex < 0) this._trace.push(sample);
      else this._trace.splice(insertionIndex, 0, sample);
    }
    return immutableCopy(sample);
  }

  setInstructorScore({ itemId, points, note = '', tSec } = {}) {
    this._requireOpen();
    const state = this._requireState(itemId);
    const item = this.rubric.items.find((candidate) => candidate.id === itemId);
    if (item.scoringSource !== 'INSTRUCTOR_OBSERVED') {
      throw new RangeError(`${itemId} is not an INSTRUCTOR_OBSERVED rubric item`);
    }
    if (points !== 0 && points !== 1 && points !== 2) {
      throw new RangeError('Instructor score points must be exactly 0, 1, or 2');
    }
    if (typeof note !== 'string') throw new TypeError('Instructor score note must be a string');
    requireTime(tSec, 'tSec');

    state.status = SCORE_STATUS[points];
    state.points = points;
    state.note = note;
    state.updatedAtSec = tSec;
    state.revision += 1;
    this.recordAction({
      tSec,
      action: 'instructor_rubric_score_set',
      meta: { itemId, points, note, revision: state.revision },
    });
    return this.getItemStatus(itemId);
  }

  getItemStatus(itemId) {
    const state = this._requireState(itemId);
    const item = this.rubric.items.find((candidate) => candidate.id === itemId);
    return immutableCopy({
      id: item.id,
      displayNumber: item.displayNumber,
      text: item.text,
      critical: item.critical,
      scoringSource: item.scoringSource,
      status: state.status,
      points: state.points,
      note: state.note,
      updatedAtSec: state.updatedAtSec,
      evidence: state.evidence,
    });
  }

  _buildResult({ finalized = false, outcome = null } = {}) {
    const items = this.rubric.items.map((item) => this.getItemStatus(item.id));
    const rawPoints = items.reduce((total, item) => (
      item.points === null ? total : total + item.points
    ), 0);
    const maxPoints = this.rubric.computedMaxPoints;
    const percentage = (rawPoints / maxPoints) * 100;
    const pendingInstructorCount = items.filter((item) => (
      item.scoringSource === 'INSTRUCTOR_OBSERVED' && item.points === null
    )).length;
    const pendingEngineCount = items.filter((item) => (
      item.scoringSource === 'ENGINE_OBSERVABLE' && item.points === null
    )).length;
    const criticalItemsOmitted = items
      .filter((item) => item.critical && item.points !== null && item.points < 2)
      .map((item) => item.id);
    const actionLedger = this._actionLedger.map((record) => deepCopy(record));

    return {
      rubricId: this.rubric.id,
      rawPoints,
      maxPoints,
      percentage,
      provisional: !finalized,
      incomplete: pendingInstructorCount > 0 || pendingEngineCount > 0,
      pendingInstructorCount,
      pendingEngineCount,
      criticalItemsOmitted,
      items,
      actionLedger,
      trace: this._trace.map((sample) => deepCopy(sample)),
      violations: [],
      finalized,
      outcome,
    };
  }

  getLiveResult() {
    if (this._finalResult !== null) return immutableCopy(this._finalResult);
    return immutableCopy(this._buildResult());
  }

  finalize({ tSec } = {}) {
    if (this._finalResult !== null) return immutableCopy(this._finalResult);
    requireTime(tSec, 'tSec');

    const pendingInstructorIds = this.rubric.items
      .filter((item) => (
        item.scoringSource === 'INSTRUCTOR_OBSERVED'
        && this._states.get(item.id).points === null
      ))
      .map((item) => item.id);
    if (pendingInstructorIds.length > 0) {
      return immutableCopy({
        ok: false,
        reason: 'INSTRUCTOR_SCORES_PENDING',
        pendingItemIds: pendingInstructorIds,
      });
    }

    const pendingEngineIds = this.rubric.items
      .filter((item) => (
        item.scoringSource === 'ENGINE_OBSERVABLE'
        && this._states.get(item.id).points === null
      ))
      .map((item) => item.id);
    if (pendingEngineIds.length > 0) {
      return immutableCopy({
        ok: false,
        reason: 'ENGINE_SCORES_PENDING',
        pendingItemIds: pendingEngineIds,
      });
    }

    const live = this._buildResult();
    const everyCriticalItemPerformed = live.items
      .filter((item) => item.critical)
      .every((item) => item.points === 2);
    const outcome = live.percentage >= 85 && everyCriticalItemPerformed
      ? 'PASS'
      : 'NOT PASS';
    this._finalResult = deepFreeze({
      ok: true,
      ...this._buildResult({ finalized: true, outcome }),
    });
    return immutableCopy(this._finalResult);
  }
}
