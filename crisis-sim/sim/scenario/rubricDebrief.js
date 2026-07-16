import { normalizeRubric } from './rubricLoader.js';

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const ADDITIVE_RESULT_KEYS = new Set([
  'rubricResult',
  'actionTimeline',
  'physiologicTrace',
  'violationFlags',
  'administrativeActions',
]);
const SCORE_STATUS = Object.freeze({
  0: 'not_performed',
  1: 'partial',
  2: 'performed',
});
const SOURCE_LABELS = Object.freeze({
  ENGINE_OBSERVABLE: 'Engine observed',
  INSTRUCTOR_OBSERVED: 'Instructor observed',
  UNSCOREABLE: 'Unscoreable',
});
const BASE_STRING_FIELDS = Object.freeze([
  'scenarioId',
  'title',
  'courseUnit',
  'teachingFeedback',
]);
const BASE_NUMBER_FIELDS = Object.freeze([
  'durationSec',
  'rawPoints',
  'maxPoints',
  'score',
  'timeToRecognitionSec',
  'timeToTreatmentSec',
]);
const BASE_ARRAY_FIELDS = Object.freeze([
  'teachingPoints',
  'reviewTopics',
  'reviewTags',
  'criticalActionsCompleted',
  'criticalActionsMissed',
  'dangerousActions',
]);
const VIOLATION_KEYS = Object.freeze([
  'rubricId',
  'itemId',
  'displayNumber',
  'text',
  'tSec',
  'triggerAction',
  'evidence',
]);

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function copyJsonSafe(value, label, ancestors = new WeakSet()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`${label} must contain only finite JSON-safe values`);
    return value;
  }
  if (typeof value !== 'object') throw new TypeError(`${label} must contain only JSON-safe values`);
  if (ancestors.has(value)) throw new TypeError(`${label} must not contain cycles`);
  if (Object.getOwnPropertySymbols(value).length > 0) {
    throw new TypeError(`${label} must contain only JSON-safe string keys`);
  }

  const names = Object.getOwnPropertyNames(value);
  const unsafe = names.find((key) => DANGEROUS_KEYS.has(key));
  if (unsafe) throw new TypeError(`${label} contains unsafe key ${unsafe}`);
  ancestors.add(value);
  let copied;
  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value) !== Array.prototype) {
      ancestors.delete(value);
      throw new TypeError(`${label} must contain only ordinary arrays`);
    }
    const length = Object.getOwnPropertyDescriptor(value, 'length').value;
    if (names.length !== length + 1) {
      ancestors.delete(value);
      throw new TypeError(`${label} arrays must be dense JSON data`);
    }
    copied = new Array(length);
    for (let index = 0; index < length; index += 1) {
      const descriptor = Object.getOwnPropertyDescriptor(value, `${index}`);
      if (!descriptor || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
        ancestors.delete(value);
        throw new TypeError(`${label} arrays must contain enumerable data properties`);
      }
      copied[index] = copyJsonSafe(descriptor.value, `${label}[${index}]`, ancestors);
    }
  } else {
    if (!isPlainObject(value)) {
      ancestors.delete(value);
      throw new TypeError(`${label} must contain only plain objects`);
    }
    copied = {};
    for (const key of names) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
        ancestors.delete(value);
        throw new TypeError(`${label} must contain only enumerable data properties`);
      }
      Object.defineProperty(copied, key, {
        configurable: true,
        enumerable: true,
        value: copyJsonSafe(descriptor.value, `${label}.${key}`, ancestors),
        writable: true,
      });
    }
  }
  ancestors.delete(value);
  return copied;
}

function copyRoot(value, label) {
  const copied = copyJsonSafe(value, label);
  if (!isPlainObject(copied)) throw new TypeError(`${label} must be a plain object`);
  return copied;
}

function requireFinite(value, label, { min = -Infinity, max = Infinity } = {}) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new TypeError(`${label} must be a finite number from ${min} to ${max}`);
  }
}

function requireString(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${label} must be a nonempty string`);
  }
}

function validateActions(actions) {
  if (!Array.isArray(actions)) throw new TypeError('sessionResult.actionLedger must be an array');
  let previousTime = -Infinity;
  for (let index = 0; index < actions.length; index += 1) {
    const record = actions[index];
    if (!isPlainObject(record)) throw new TypeError(`actionLedger[${index}] must be a plain object`);
    requireFinite(record.tSec, `actionLedger[${index}].tSec`, { min: 0 });
    if (record.tSec < previousTime) throw new RangeError('actionLedger must be chronological');
    previousTime = record.tSec;
    requireString(record.action, `actionLedger[${index}].action`);
    if (!isPlainObject(record.meta)) throw new TypeError(`actionLedger[${index}].meta must be a plain object`);
    if (record.snapshot !== null && !isPlainObject(record.snapshot)) {
      throw new TypeError(`actionLedger[${index}].snapshot must be null or a plain object`);
    }
  }
}

function validateTrace(trace) {
  if (!Array.isArray(trace)) throw new TypeError('sessionResult.trace must be an array');
  let previousTime = -1;
  for (let index = 0; index < trace.length; index += 1) {
    const sample = trace[index];
    if (!isPlainObject(sample) || !Number.isSafeInteger(sample.t) || sample.t < 0) {
      throw new TypeError(`trace[${index}] must be a plain sample with nonnegative integer t`);
    }
    if (sample.t <= previousTime) throw new RangeError('trace timestamps must be strictly increasing');
    previousTime = sample.t;
  }
}

function validateItems(sessionResult) {
  if (!Array.isArray(sessionResult.items) || sessionResult.items.length === 0) {
    throw new TypeError('sessionResult.items must be a nonempty array');
  }
  const ids = new Set();
  let rawPoints = 0;
  for (let index = 0; index < sessionResult.items.length; index += 1) {
    const item = sessionResult.items[index];
    if (!isPlainObject(item)) throw new TypeError(`items[${index}] must be a plain object`);
    requireString(item.id, `items[${index}].id`);
    requireString(item.displayNumber, `items[${index}].displayNumber`);
    requireString(item.text, `items[${index}].text`);
    if (ids.has(item.id)) throw new RangeError(`Duplicate finalized item id: ${item.id}`);
    ids.add(item.id);
    if (item.points !== 0 && item.points !== 1 && item.points !== 2) {
      throw new RangeError(`items[${index}].points must be 0, 1, or 2`);
    }
    if (item.status !== SCORE_STATUS[item.points]) {
      throw new RangeError(`items[${index}].status does not match points`);
    }
    if (typeof item.critical !== 'boolean') throw new TypeError(`items[${index}].critical must be boolean`);
    if (!Object.hasOwn(SOURCE_LABELS, item.scoringSource)) {
      throw new RangeError(`items[${index}].scoringSource is not supported`);
    }
    if (item.scoringSource === 'UNSCOREABLE') {
      throw new RangeError(`items[${index}] cannot be UNSCOREABLE in a finalized rubric result`);
    }
    if (typeof item.note !== 'string') throw new TypeError(`items[${index}].note must be a string`);
    if (item.evidence !== null && !isPlainObject(item.evidence)) {
      throw new TypeError(`items[${index}].evidence must be null or a plain object`);
    }
    if (item.scoringSource === 'ENGINE_OBSERVABLE') {
      if (!isPlainObject(item.evidence)) {
        throw new TypeError(`items[${index}].evidence must be a plain object for engine rows`);
      }
      requireString(item.evidence.ruleId, `items[${index}].evidence.ruleId`);
    }
    rawPoints += item.points;
  }
  if (sessionResult.rawPoints !== rawPoints) {
    throw new RangeError('sessionResult.rawPoints does not equal finalized item points');
  }
  if (sessionResult.maxPoints !== sessionResult.items.length * 2) {
    throw new RangeError('sessionResult.maxPoints does not equal the literal item maximum');
  }
}

function validateFinalizedSession(sessionResult) {
  if (sessionResult.ok !== true
    || sessionResult.finalized !== true
    || (sessionResult.outcome !== 'PASS' && sessionResult.outcome !== 'NOT PASS')) {
    throw new TypeError('sessionResult must be a successful finalized rubric result');
  }
  requireString(sessionResult.rubricId, 'sessionResult.rubricId');
  if (sessionResult.provisional !== false) {
    throw new TypeError('sessionResult.provisional must be exactly false');
  }
  if (sessionResult.incomplete !== false) {
    throw new TypeError('sessionResult.incomplete must be exactly false');
  }
  for (const field of [
    'pendingInstructorCount',
    'pendingEngineCount',
    'pendingUnscoreableCount',
  ]) {
    if (!Number.isSafeInteger(sessionResult[field]) || sessionResult[field] !== 0) {
      throw new TypeError(`sessionResult.${field} must be exactly integer zero`);
    }
  }
  requireFinite(sessionResult.finalizedAtSec, 'sessionResult.finalizedAtSec', { min: 0 });
  requireFinite(sessionResult.rawPoints, 'sessionResult.rawPoints', { min: 0 });
  requireFinite(sessionResult.maxPoints, 'sessionResult.maxPoints', { min: Number.MIN_VALUE });
  requireFinite(sessionResult.percentage, 'sessionResult.percentage', { min: 0, max: 100 });
  if (!Array.isArray(sessionResult.criticalItemsOmitted)
    || !Array.isArray(sessionResult.denominatorWarnings)
    || !Array.isArray(sessionResult.violations)) {
    throw new TypeError('sessionResult must include criticalItemsOmitted, denominatorWarnings, and violations arrays');
  }
  validateItems(sessionResult);
  validateActions(sessionResult.actionLedger);
  validateTrace(sessionResult.trace);
  const calculatedPercentage = (sessionResult.rawPoints / sessionResult.maxPoints) * 100;
  if (Math.abs(calculatedPercentage - sessionResult.percentage) > Number.EPSILON * 100) {
    throw new RangeError('sessionResult.percentage does not match rawPoints and maxPoints');
  }
  const omitted = sessionResult.items
    .filter((item) => item.critical && item.points < 2)
    .map((item) => item.id);
  if (omitted.length !== sessionResult.criticalItemsOmitted.length
    || omitted.some((id, index) => id !== sessionResult.criticalItemsOmitted[index])) {
    throw new RangeError('sessionResult.criticalItemsOmitted does not match finalized items');
  }
  const expectedOutcome = sessionResult.percentage >= 85 && omitted.length === 0
    ? 'PASS'
    : 'NOT PASS';
  if (sessionResult.outcome !== expectedOutcome) {
    throw new RangeError(`sessionResult.outcome must be ${expectedOutcome}`);
  }
}

function equalJsonSafe(left, right) {
  if (Object.is(left, right)) return true;
  if (left === null || right === null || typeof left !== 'object' || typeof right !== 'object') {
    return false;
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left)
      && Array.isArray(right)
      && left.length === right.length
      && left.every((value, index) => equalJsonSafe(value, right[index]));
  }
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key) => (
      Object.hasOwn(right, key) && equalJsonSafe(left[key], right[key])
    ));
}

function validateRubricProvenance(sessionResult, rubric) {
  if (sessionResult.rubricId !== rubric.id) {
    throw new RangeError('sessionResult.rubricId does not match the rubric definition');
  }
  if (sessionResult.items.length !== rubric.computedItemCount
    || sessionResult.items.length !== rubric.items.length) {
    throw new RangeError('sessionResult item count does not match the rubric definition');
  }
  if (sessionResult.maxPoints !== rubric.computedMaxPoints) {
    throw new RangeError('sessionResult maximum does not match the rubric definition');
  }
  if (!equalJsonSafe(sessionResult.denominatorWarnings, rubric.discrepancies)) {
    throw new RangeError('sessionResult denominator warnings do not match the rubric definition');
  }
  for (let index = 0; index < rubric.items.length; index += 1) {
    const resultItem = sessionResult.items[index];
    const rubricItem = rubric.items[index];
    for (const key of ['id', 'displayNumber', 'text', 'critical', 'scoringSource']) {
      if (resultItem[key] !== rubricItem[key]) {
        throw new RangeError(`sessionResult item ${index} ${key} does not match the rubric definition`);
      }
    }
    if (rubricItem.scoringSource === 'ENGINE_OBSERVABLE'
      && resultItem.evidence.ruleId !== rubricItem.engineEvidence.ruleId) {
      throw new RangeError(`sessionResult item ${rubricItem.id} rule does not match the rubric definition`);
    }
  }
}

function validateViolationProvenance(sessionResult, rubric) {
  const trustedItems = new Map(rubric.items.map((item) => [item.id, item]));
  const triggerIdentities = new Set();
  for (let index = 0; index < sessionResult.violations.length; index += 1) {
    const violation = sessionResult.violations[index];
    if (!isPlainObject(violation)) {
      throw new TypeError(`sessionResult.violations[${index}] must be a plain object`);
    }
    const keys = Object.keys(violation);
    if (keys.length !== VIOLATION_KEYS.length
      || VIOLATION_KEYS.some((key) => !Object.hasOwn(violation, key))) {
      throw new TypeError(`sessionResult.violations[${index}] does not match the violation contract`);
    }
    if (violation.rubricId !== rubric.id) {
      throw new RangeError(`sessionResult.violations[${index}].rubricId does not match the rubric`);
    }
    const item = trustedItems.get(violation.itemId);
    if (!item) {
      throw new RangeError(`sessionResult.violations[${index}].itemId is unknown`);
    }
    if (violation.displayNumber !== item.displayNumber) {
      throw new RangeError(`sessionResult.violations[${index}].displayNumber does not match the rubric item`);
    }
    if (violation.text !== item.text) {
      throw new RangeError(`sessionResult.violations[${index}].text does not match the literal rubric item`);
    }
    requireFinite(violation.tSec, `sessionResult.violations[${index}].tSec`, { min: 0 });
    if (typeof violation.triggerAction !== 'string'
      || violation.triggerAction.trim().length === 0) {
      throw new TypeError(`sessionResult.violations[${index}].triggerAction must be nonempty`);
    }
    if (!isPlainObject(violation.evidence)) {
      throw new TypeError(`sessionResult.violations[${index}].evidence must be a plain object`);
    }
    const triggerIdentity = JSON.stringify([
      violation.rubricId,
      violation.itemId,
      violation.triggerAction,
      violation.tSec,
    ]);
    if (triggerIdentities.has(triggerIdentity)) {
      throw new RangeError(`Duplicate violation record at index ${index}`);
    }
    triggerIdentities.add(triggerIdentity);
  }
}

function validateBaseResult(baseResult) {
  for (const field of BASE_STRING_FIELDS) {
    if (typeof baseResult[field] !== 'string') {
      throw new TypeError(`baseResult.${field} must be a string`);
    }
  }
  for (const field of BASE_NUMBER_FIELDS) {
    if (typeof baseResult[field] !== 'number' || !Number.isFinite(baseResult[field])) {
      throw new TypeError(`baseResult.${field} must be a finite number`);
    }
  }
  for (const field of BASE_ARRAY_FIELDS) {
    if (!Array.isArray(baseResult[field])) {
      throw new TypeError(`baseResult.${field} must be an array`);
    }
  }
}

function timelineSource(record) {
  if (record.action === 'instructor_rubric_score_set') return 'instructor';
  if (record.action === 'instructor_nmb_depth_set') return 'administrative';
  return 'learner';
}

function formatMeasurement(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
}

function selectActionSnapshot(snapshot, rule) {
  const selected = {};
  if (!isPlainObject(snapshot)) return selected;
  for (const field of rule.numericSnapshotFields) {
    if (!Object.hasOwn(snapshot, field)) continue;
    const value = snapshot[field];
    if (typeof value === 'number' && Number.isFinite(value)) selected[field] = value;
  }
  for (const field of rule.stringSnapshotFields) {
    if (!Object.hasOwn(snapshot, field)) continue;
    const value = snapshot[field];
    if (typeof value === 'string' && value.length > 0) selected[field] = value;
  }
  return selected;
}

function validateConsequenceItem(item) {
  requireString(item.id, 'itemResult.id');
  requireString(item.displayNumber, 'itemResult.displayNumber');
  requireString(item.text, 'itemResult.text');
  if (typeof item.critical !== 'boolean') throw new TypeError('itemResult.critical must be boolean');
  if (!Object.hasOwn(SOURCE_LABELS, item.scoringSource)) {
    throw new RangeError('itemResult.scoringSource is not supported');
  }
  if (item.points !== 0 && item.points !== 1 && item.points !== 2) {
    throw new RangeError('itemResult.points must be 0, 1, or 2');
  }
  if (item.status !== SCORE_STATUS[item.points]) {
    throw new RangeError('itemResult.status does not match points');
  }
  if (typeof item.note !== 'string') throw new TypeError('itemResult.note must be a string');
  if (item.evidence !== null && !isPlainObject(item.evidence)) {
    throw new TypeError('itemResult.evidence must be null or a plain object');
  }
  if (item.scoringSource === 'ENGINE_OBSERVABLE') {
    if (!isPlainObject(item.evidence)) {
      throw new TypeError('ENGINE_OBSERVABLE itemResult.evidence must be a plain object');
    }
    requireString(item.evidence.ruleId, 'itemResult.evidence.ruleId');
  }
}

const CONSEQUENCE_RULES = Object.freeze({
  emergence_tof_and_reversal: Object.freeze({
    triggerAction: 'extubate',
    numericSnapshotFields: Object.freeze(['tofRatio', 'effectiveNmbBlockade']),
    stringSnapshotFields: Object.freeze(['airwayDevice']),
  }),
  emergence_spontaneous_ventilation: Object.freeze({
    triggerAction: 'extubate',
    numericSnapshotFields: Object.freeze([
      'spontaneousRR',
      'spontaneousTV',
      'spontaneousMV',
      'respiratoryMuscleCapability',
    ]),
    stringSnapshotFields: Object.freeze(['airwayDevice']),
  }),
});

function measuredStatement(ruleId, actionSnapshot, nadir, triggerTime) {
  const actionMeasurements = [];
  if (ruleId === 'emergence_tof_and_reversal'
    && typeof actionSnapshot.tofRatio === 'number') {
    actionMeasurements.push(`TOF ratio ${formatMeasurement(actionSnapshot.tofRatio)}`);
  }
  if (ruleId === 'emergence_spontaneous_ventilation') {
    if (typeof actionSnapshot.spontaneousRR === 'number') {
      actionMeasurements.push(`spontaneous RR ${formatMeasurement(actionSnapshot.spontaneousRR)}/min`);
    }
    if (typeof actionSnapshot.spontaneousTV === 'number') {
      actionMeasurements.push(`spontaneous TV ${formatMeasurement(actionSnapshot.spontaneousTV)} mL`);
    }
    if (typeof actionSnapshot.spontaneousMV === 'number') {
      actionMeasurements.push(`spontaneous MV ${formatMeasurement(actionSnapshot.spontaneousMV)} L/min`);
    }
  }
  let statement = actionMeasurements.length > 0
    ? `Extubated at ${actionMeasurements.join(', ')}`
    : `Extubated at ${formatMeasurement(triggerTime)} s`;
  if (nadir) {
    statement += `; observed SpO2 nadir ${formatMeasurement(nadir.value)}% at +${formatMeasurement(nadir.elapsedSec)} s`;
  }
  return `${statement}.`;
}

function observedConsequenceFromCopied(item, copiedActions, copiedTrace, windowSec) {
  if (item.scoringSource !== 'ENGINE_OBSERVABLE'
    || (item.points !== 0 && item.points !== 1)
    || !isPlainObject(item.evidence)) return null;
  const ruleId = item.evidence.ruleId;
  const rule = CONSEQUENCE_RULES[ruleId];
  if (!rule) return null;
  const triggerIndex = copiedActions.findIndex(({ action }) => action === rule.triggerAction);
  if (triggerIndex < 0) return null;
  const triggerAction = copiedActions[triggerIndex];
  const endSec = triggerAction.tSec + windowSec;
  if (!Number.isFinite(endSec)) {
    throw new RangeError('observation window end must be finite');
  }
  const actionSnapshot = selectActionSnapshot(triggerAction.snapshot, rule);
  const samples = copiedTrace.filter((sample) => (
    sample.t >= triggerAction.tSec && sample.t <= endSec
  ));
  let spo2Nadir = null;
  for (const sample of samples) {
    if (!Number.isFinite(sample.spo2)) continue;
    if (spo2Nadir === null || sample.spo2 < spo2Nadir.value) {
      const elapsedSec = sample.t - triggerAction.tSec;
      if (!Number.isFinite(elapsedSec)) {
        throw new RangeError('observation elapsed time must be finite');
      }
      spo2Nadir = {
        value: sample.spo2,
        tSec: sample.t,
        elapsedSec,
      };
    }
  }
  const extrema = {};
  if (spo2Nadir) extrema.spo2Nadir = spo2Nadir;
  return {
    trigger: {
      action: triggerAction.action,
      tSec: triggerAction.tSec,
      ledgerIndex: triggerIndex,
    },
    actionSnapshot,
    observationWindow: {
      startSec: triggerAction.tSec,
      endSec,
      windowSec,
    },
    extrema,
    statement: measuredStatement(ruleId, actionSnapshot, spo2Nadir, triggerAction.tSec),
  };
}

export function observedConsequence({ itemResult, actions, trace, windowSec = 90 } = {}) {
  const item = copyRoot(itemResult, 'itemResult');
  const copiedActions = copyJsonSafe(actions, 'actions');
  const copiedTrace = copyJsonSafe(trace, 'trace');
  validateActions(copiedActions);
  validateTrace(copiedTrace);
  validateConsequenceItem(item);
  requireFinite(windowSec, 'windowSec', { min: 0 });
  return observedConsequenceFromCopied(item, copiedActions, copiedTrace, windowSec);
}

export function buildRubricDebrief({ baseResult, sessionResult, rubricDefinition } = {}) {
  const base = copyRoot(baseResult, 'baseResult');
  const session = copyRoot(sessionResult, 'sessionResult');
  const rubric = normalizeRubric(rubricDefinition);
  for (const key of ADDITIVE_RESULT_KEYS) {
    if (Object.hasOwn(base, key)) throw new TypeError(`baseResult already contains reserved field ${key}`);
  }
  validateBaseResult(base);
  validateFinalizedSession(session);
  validateRubricProvenance(session, rubric);
  validateViolationProvenance(session, rubric);

  const actionTimeline = session.actionLedger.map((record) => ({
    ...copyJsonSafe(record, 'action record'),
    source: timelineSource(record),
  }));
  const items = session.items.map((item) => ({
    id: item.id,
    displayNumber: item.displayNumber,
    text: item.text,
    critical: item.critical,
    scoringSource: item.scoringSource,
    source: SOURCE_LABELS[item.scoringSource],
    status: item.status,
    points: item.points,
    note: item.note,
    updatedAtSec: item.updatedAtSec,
    evidence: copyJsonSafe(item.evidence, `item ${item.id} evidence`),
    observedConsequence: observedConsequenceFromCopied(
      item,
      session.actionLedger,
      session.trace,
      90,
    ),
  }));
  const failureReasons = [];
  if (session.percentage < 85) {
    failureReasons.push({
      code: 'PERCENT_BELOW_MINIMUM',
      percentage: session.percentage,
      minimumPercent: 85,
    });
  }
  if (session.criticalItemsOmitted.length > 0) {
    failureReasons.push({
      code: 'CRITICAL_ITEMS_OMITTED',
      itemIds: [...session.criticalItemsOmitted],
    });
  }

  return {
    ...base,
    rubricResult: {
      rubricId: session.rubricId,
      itemCount: items.length,
      rawPoints: session.rawPoints,
      maxPoints: session.maxPoints,
      percentage: session.percentage,
      criticalItemsOmitted: [...session.criticalItemsOmitted],
      outcome: session.outcome,
      denominatorWarnings: copyJsonSafe(
        rubric.discrepancies,
        'rubric.discrepancies',
      ),
      items,
      failureReasons,
    },
    actionTimeline,
    physiologicTrace: copyJsonSafe(session.trace, 'sessionResult.trace'),
    violationFlags: copyJsonSafe(session.violations, 'sessionResult.violations'),
    administrativeActions: actionTimeline
      .filter(({ source }) => source !== 'learner')
      .map((record) => copyJsonSafe(record, 'administrative action')),
  };
}
