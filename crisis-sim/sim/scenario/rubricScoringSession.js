import { normalizeRubric } from './rubricLoader.js';
import {
  detectRubricViolations,
  evaluateRubricItem,
  evaluateRubricItems,
} from './rubricRules.js';

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

function copyJsonSafe(value, label, ancestors = new WeakSet()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`${label} must contain only JSON-safe values`);
    return value;
  }
  if (typeof value !== 'object') {
    throw new TypeError(`${label} must contain only JSON-safe values`);
  }
  if (ancestors.has(value)) throw new TypeError(`${label} must not contain cycles`);
  if (Object.getOwnPropertySymbols(value).length > 0) {
    throw new TypeError(`${label} must contain only JSON-safe string keys`);
  }

  const ownNames = Object.getOwnPropertyNames(value);
  const dangerousKey = ownNames.find((key) => DANGEROUS_OBJECT_KEYS.has(key));
  if (dangerousKey) throw new TypeError(`Dangerous session data key is not allowed: ${dangerousKey}`);

  ancestors.add(value);
  let result;
  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value) !== Array.prototype) {
      ancestors.delete(value);
      throw new TypeError(`${label} must contain only ordinary arrays`);
    }
    const lengthDescriptor = Object.getOwnPropertyDescriptor(value, 'length');
    const length = lengthDescriptor.value;
    if (ownNames.length !== length + 1) {
      ancestors.delete(value);
      throw new TypeError(`${label} arrays must contain only JSON-safe indexed values`);
    }

    result = new Array(length);
    for (let index = 0; index < length; index += 1) {
      const descriptor = Object.getOwnPropertyDescriptor(value, `${index}`);
      if (!descriptor || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
        ancestors.delete(value);
        throw new TypeError(`${label} array indexes must be JSON-safe enumerable data properties`);
      }
      result[index] = copyJsonSafe(descriptor.value, `${label}[${index}]`, ancestors);
    }
  } else {
    if (!isPlainObject(value)) {
      ancestors.delete(value);
      throw new TypeError(`${label} must contain only JSON-safe plain objects`);
    }
    result = {};
    for (const key of ownNames) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
        ancestors.delete(value);
        throw new TypeError(`${label} must contain only JSON-safe data properties`);
      }
      Object.defineProperty(result, key, {
        configurable: true,
        enumerable: true,
        value: copyJsonSafe(descriptor.value, `${label}.${key}`, ancestors),
        writable: true,
      });
    }
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

function equalJsonSafe(left, right) {
  if (Object.is(left, right)) return true;
  if (left === null || right === null || typeof left !== 'object' || typeof right !== 'object') {
    return false;
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
    return left.every((value, index) => equalJsonSafe(value, right[index]));
  }
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key) => (
      Object.hasOwn(right, key) && equalJsonSafe(left[key], right[key])
    ));
}

function immutableJsonCopy(value, label) {
  return deepFreeze(copyJsonSafe(value, label));
}

function requireTime(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new TypeError(`${label} must be a finite nonnegative number`);
  }
}

export class RubricScoringSession {
  constructor({ rubric, criteria = {}, seed = 12345 } = {}) {
    this.rubric = normalizeRubric(rubric);
    if (!isPlainObject(criteria)) throw new TypeError('criteria must be a plain object');
    if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) {
      throw new RangeError('seed must be a nonnegative uint32 integer');
    }
    this.criteria = immutableJsonCopy(criteria, 'criteria');
    this.seed = seed;

    const criteriaProbeItem = this.rubric.items.find(
      (item) => item.scoringSource === 'ENGINE_OBSERVABLE',
    );
    if (criteriaProbeItem) {
      evaluateRubricItem({
        item: criteriaProbeItem,
        actions: [],
        trace: [],
        criteria: this.criteria,
        finalized: false,
      });
    }

    this._itemsById = new Map(this.rubric.items.map((item) => [item.id, item]));
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
    this._violations = [];
    this._violationKeys = new Set();
    this._liveResult = null;
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

  _requireActionChronology(tSec) {
    const latest = this._actionLedger.at(-1)?.tSec;
    if (latest !== undefined && tSec < latest) {
      throw new RangeError(`Action tSec must be nondecreasing (latest is ${latest})`);
    }
  }

  _invalidateLiveResult() {
    this._liveResult = null;
  }

  recordAction({ tSec, action, meta = {}, snapshot } = {}) {
    this._requireOpen();
    requireTime(tSec, 'tSec');
    if (typeof action !== 'string' || action.trim().length === 0) {
      throw new TypeError('action must be a nonempty string');
    }
    if (!isPlainObject(meta)) throw new TypeError('meta must be a plain object');
    if (snapshot !== undefined && !isPlainObject(snapshot)) {
      throw new TypeError('snapshot must be a plain object when provided');
    }
    this._requireActionChronology(tSec);

    const record = deepFreeze({
      tSec,
      action,
      meta: immutableJsonCopy(meta, 'meta'),
      snapshot: snapshot === undefined ? null : immutableJsonCopy(snapshot, 'snapshot'),
    });
    this._actionLedger.push(record);
    try {
      const flags = detectRubricViolations({
        rubric: this.rubric,
        action: record,
        actions: this._actionLedger,
        trace: this._trace,
        criteria: this.criteria,
      });
      const triggerIndex = this._actionLedger.length - 1;
      for (const flag of flags) {
        const key = `${flag.itemId}\0${triggerIndex}\0${flag.tSec}`;
        if (this._violationKeys.has(key)) continue;
        this._violationKeys.add(key);
        this._violations.push(flag);
      }
    } catch (error) {
      this._actionLedger.pop();
      throw error;
    }
    this._invalidateLiveResult();
    return record;
  }

  recordTrace(snapshot) {
    this._requireOpen();
    if (!isPlainObject(snapshot)) throw new TypeError('Trace snapshot must be an object');
    if (!Number.isSafeInteger(snapshot.t) || snapshot.t < 0) {
      throw new TypeError('Trace snapshot .t timestamp must be a finite nonnegative safe integer');
    }

    const sample = immutableJsonCopy(snapshot, 'Trace snapshot');
    const last = this._trace.at(-1);
    if (!last || last.t < sample.t) {
      this._trace.push(sample);
    } else if (last.t === sample.t) {
      this._trace[this._trace.length - 1] = sample;
    } else {
      let low = 0;
      let high = this._trace.length;
      while (low < high) {
        const middle = Math.floor((low + high) / 2);
        if (this._trace[middle].t < sample.t) low = middle + 1;
        else high = middle;
      }
      if (this._trace[low]?.t === sample.t) this._trace[low] = sample;
      else this._trace.splice(low, 0, sample);
    }
    this._invalidateLiveResult();
    return sample;
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
    this._requireActionChronology(tSec);

    const revision = state.revision + 1;
    this.recordAction({
      tSec,
      action: 'instructor_rubric_score_set',
      meta: { itemId, points, note, revision },
    });
    state.status = SCORE_STATUS[points];
    state.points = points;
    state.note = note;
    state.updatedAtSec = tSec;
    state.revision = revision;
    return this.getItemStatus(itemId);
  }

  _buildItemStatus(item, state) {
    return {
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
    };
  }

  getItemStatus(itemId) {
    const state = this._requireState(itemId);
    const item = this._itemsById.get(itemId);
    return deepFreeze(this._buildItemStatus(item, state));
  }

  _evaluateEngineStates(finalized) {
    let changed = false;
    const engineItems = this.rubric.items.filter(
      (item) => item.scoringSource === 'ENGINE_OBSERVABLE',
    );
    const evaluations = evaluateRubricItems({
      items: engineItems,
      actions: this._actionLedger,
      trace: this._trace,
      criteria: this.criteria,
      finalized,
    });
    for (let index = 0; index < engineItems.length; index += 1) {
      const item = engineItems[index];
      const evaluated = evaluations[index];
      const state = this._states.get(item.id);
      const evidenceChanged = !equalJsonSafe(state.evidence, evaluated.evidence);
      if (state.status === evaluated.status
        && state.points === evaluated.points
        && !evidenceChanged) continue;

      state.status = evaluated.status;
      state.points = evaluated.points;
      state.evidence = evaluated.evidence;
      const evidenceTimes = [
        ...evaluated.evidence.actions.map(({ tSec }) => tSec),
        ...evaluated.evidence.trace.map(({ tSec }) => tSec),
      ].filter((value) => typeof value === 'number' && Number.isFinite(value));
      state.updatedAtSec = evidenceTimes.length > 0 ? Math.max(...evidenceTimes) : null;
      changed = true;
    }
    if (changed) this._invalidateLiveResult();
    return changed;
  }

  _buildResult({ finalized = false, finalizedAtSec = null, outcome = null } = {}) {
    const items = this.rubric.items.map((item) => (
      this._buildItemStatus(item, this._states.get(item.id))
    ));
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
    const pendingUnscoreableCount = items.filter((item) => (
      item.scoringSource === 'UNSCOREABLE' && item.points === null
    )).length;
    const criticalItemsOmitted = items
      .filter((item) => item.critical && item.points !== null && item.points < 2)
      .map((item) => item.id);

    return {
      rubricId: this.rubric.id,
      rawPoints,
      maxPoints,
      percentage,
      provisional: !finalized,
      incomplete: pendingInstructorCount > 0
        || pendingEngineCount > 0
        || pendingUnscoreableCount > 0,
      pendingInstructorCount,
      pendingEngineCount,
      pendingUnscoreableCount,
      criticalItemsOmitted,
      items,
      actionLedger: [...this._actionLedger],
      trace: [...this._trace],
      violations: [...this._violations],
      finalized,
      finalizedAtSec,
      outcome,
    };
  }

  getLiveResult() {
    if (this._finalResult !== null) return this._finalResult;
    if (this._liveResult !== null) return this._liveResult;
    this._evaluateEngineStates(false);
    if (this._liveResult === null) this._liveResult = deepFreeze(this._buildResult());
    return this._liveResult;
  }

  finalize({ tSec } = {}) {
    if (this._finalResult !== null) return this._finalResult;
    requireTime(tSec, 'tSec');

    const latestActionTime = this._actionLedger.at(-1)?.tSec ?? 0;
    const latestTraceTime = this._trace.at(-1)?.t ?? 0;
    const latestItemTime = Math.max(0, ...[...this._states.values()]
      .map((state) => state.updatedAtSec ?? 0));
    const latestSessionTime = Math.max(latestActionTime, latestTraceTime, latestItemTime);
    if (tSec < latestSessionTime) {
      throw new RangeError(`finalize tSec must be at least latest session time ${latestSessionTime}`);
    }

    const pendingInstructorIds = this.rubric.items
      .filter((item) => (
        item.scoringSource === 'INSTRUCTOR_OBSERVED'
        && this._states.get(item.id).points === null
      ))
      .map((item) => item.id);
    if (pendingInstructorIds.length > 0) {
      return deepFreeze({
        ok: false,
        reason: 'INSTRUCTOR_SCORES_PENDING',
        pendingItemIds: pendingInstructorIds,
      });
    }

    this._evaluateEngineStates(true);

    const pendingEngineIds = this.rubric.items
      .filter((item) => (
        item.scoringSource === 'ENGINE_OBSERVABLE'
        && this._states.get(item.id).points === null
      ))
      .map((item) => item.id);
    if (pendingEngineIds.length > 0) {
      return deepFreeze({
        ok: false,
        reason: 'ENGINE_SCORES_PENDING',
        pendingItemIds: pendingEngineIds,
      });
    }

    const unscoreableIds = this.rubric.items
      .filter((item) => item.scoringSource === 'UNSCOREABLE')
      .map((item) => item.id);
    if (unscoreableIds.length > 0) {
      return deepFreeze({
        ok: false,
        reason: 'UNSCOREABLE_ITEMS_PRESENT',
        pendingItemIds: unscoreableIds,
      });
    }

    const result = this._buildResult({ finalized: true, finalizedAtSec: tSec });
    const everyCriticalItemPerformed = result.items
      .filter((item) => item.critical)
      .every((item) => item.points === 2);
    result.outcome = result.percentage >= 85 && everyCriticalItemPerformed
      ? 'PASS'
      : 'NOT PASS';
    this._finalResult = deepFreeze({
      ok: true,
      ...result,
    });
    this._liveResult = this._finalResult;
    return this._finalResult;
  }
}
