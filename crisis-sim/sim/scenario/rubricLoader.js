export const RUBRIC_SCORING_SOURCES = Object.freeze([
  'ENGINE_OBSERVABLE',
  'INSTRUCTOR_OBSERVED',
  'UNSCOREABLE',
]);

const POINT_SCALE_KEYS = Object.freeze(['notPerformed', 'partial', 'performed']);
const PASS_RULE_KEYS = Object.freeze(['minimumPercent', 'requireEveryCriticalPerformed']);
const ENGINE_EVIDENCE_KEYS = Object.freeze(['actionLogEntries', 'ruleId', 'snapshotKeys']);
const SOURCE_DENOMINATOR_MISMATCH_KEYS = Object.freeze([
  'code',
  'computedMaxPoints',
  'sourceHeaderDenominator',
]);

function evidenceContract(ruleId, snapshotKeys, actionLogEntries) {
  return Object.freeze({
    ruleId,
    snapshotKeys: Object.freeze(snapshotKeys),
    actionLogEntries: Object.freeze(actionLogEntries),
  });
}

const ENGINE_EVIDENCE_CONTRACTS = Object.freeze({
  'carson-newman-anesthesia-emergence:emergence-2': evidenceContract(
    'emergence_stop_anesthetic',
    ['vaporizer', 'vaporizerAgent', 'activeAnestheticInfusions', 'airwayDevice'],
    ['volatile_changed', 'drug', 'extubate'],
  ),
  'carson-newman-anesthesia-emergence:emergence-3': evidenceContract(
    'emergence_tof_and_reversal',
    ['tofRatio', 'effectiveNmbBlockade', 'airwayDevice'],
    ['tof_checked', 'drug', 'extubate'],
  ),
  'carson-newman-anesthesia-emergence:emergence-4': evidenceContract(
    'emergence_spontaneous_ventilation',
    [
      'spontaneousRR',
      'spontaneousTV',
      'spontaneousMV',
      'respiratoryMuscleCapability',
      'airwayDevice',
    ],
    ['spontaneous_ventilation_assessed', 'extubate'],
  ),
  'carson-newman-standard-iv-induction:standard-7': evidenceContract(
    'standard_mask_ventilation_before_nmb',
    ['airwayDevice', 'mechanicalMV', 'effectiveMV'],
    ['mask_ppv_started', 'mask_ppv_completed', 'drug', 'intubation_attempt_started'],
  ),
  'carson-newman-rsi-induction:rsi-7': evidenceContract(
    'rsi_preoxygenation',
    ['fio2', 'eto2', 'airwayDevice', 'spontaneousRR', 'spontaneousTV'],
    ['preoxygenate', 'drug'],
  ),
  'carson-newman-rsi-induction:rsi-9': evidenceContract(
    'rsi_cricoid_applied',
    ['cricoidPressureActive'],
    ['drug', 'cricoid_pressure_applied', 'intubation_attempt_started'],
  ),
  'carson-newman-rsi-induction:rsi-10a': evidenceContract(
    'rsi_medication_selection',
    ['effectiveNmbBlockade'],
    ['drug'],
  ),
  'carson-newman-rsi-induction:rsi-10c': evidenceContract(
    'rsi_medication_sequence',
    ['effectiveNmbBlockade', 'airwayDevice'],
    ['drug', 'intubation_attempt_started'],
  ),
  'carson-newman-rsi-induction:rsi-11': evidenceContract(
    'rsi_no_ppv_before_first_laryngoscopy',
    ['airwayDevice', 'ppvActive', 'intubationAttemptCount'],
    ['mask_ppv_started', 'intubation_attempt_started'],
  ),
  'carson-newman-rsi-induction:rsi-26': evidenceContract(
    'rsi_continuous_etco2_confirmation',
    ['capnogramPresent', 'etco2', 'airwayDevice', 'mechanicalMV'],
    ['intubation_attempt_succeeded', 'confirm_etco2'],
  ),
  'carson-newman-rsi-induction:rsi-28': evidenceContract(
    'rsi_failed_attempt_ppv_with_cricoid',
    [
      'cricoidPressureActive',
      'ppvActive',
      'mechanicalMV',
      'effectiveMV',
      'intubationAttemptCount',
    ],
    [
      'intubation_attempt_failed',
      'cricoid_pressure_applied',
      'mask_ppv_started',
      'mask_ppv_completed',
      'intubation_attempt_started',
    ],
  ),
  'carson-newman-rsi-induction:rsi-29': evidenceContract(
    'rsi_cricoid_release_after_confirmation',
    ['cricoidPressureActive', 'capnogramPresent', 'etco2', 'airwayDevice'],
    ['intubation_attempt_succeeded', 'confirm_etco2', 'cricoid_pressure_released'],
  ),
  'carson-newman-rsi-induction:rsi-30': evidenceContract(
    'rsi_inhaled_anesthetic_on',
    ['vaporizer', 'vaporizerAgent', 'airwayDevice'],
    ['intubation_attempt_succeeded', 'volatile_changed'],
  ),
  'carson-newman-rsi-induction:rsi-32': evidenceContract(
    'rsi_vent_mode',
    ['ventMode', 'airwayDevice'],
    ['intubation_attempt_succeeded', 'vent_mode_changed'],
  ),
  'carson-newman-rsi-induction:rsi-33': evidenceContract(
    'rsi_tidal_volume',
    ['ventSetTV', 'airwayDevice'],
    ['intubation_attempt_succeeded', 'machine_settings_changed'],
  ),
  'carson-newman-rsi-induction:rsi-34': evidenceContract(
    'rsi_respiratory_rate',
    ['ventSetRR', 'airwayDevice'],
    ['intubation_attempt_succeeded', 'machine_settings_changed'],
  ),
  'carson-newman-rsi-induction:rsi-35': evidenceContract(
    'rsi_fresh_gas',
    ['o2Flow', 'airFlow', 'n2oFlow', 'airwayDevice'],
    ['intubation_attempt_succeeded', 'machine_settings_changed'],
  ),
  'carson-newman-rsi-induction:rsi-36': evidenceContract(
    'rsi_fio2',
    ['ventSetFiO2', 'fio2', 'airwayDevice'],
    ['intubation_attempt_succeeded', 'machine_settings_changed'],
  ),
  'carson-newman-rsi-induction:rsi-37': evidenceContract(
    'rsi_bag_to_vent',
    ['ventMode', 'mechanicalMV', 'airwayDevice'],
    ['intubation_attempt_succeeded', 'vent_mode_changed'],
  ),
  'carson-newman-rsi-induction:rsi-41': evidenceContract(
    'rsi_appropriate_failed_attempt_intervention',
    [
      'spo2',
      'cricoidPressureActive',
      'ppvActive',
      'mechanicalMV',
      'effectiveMV',
      'intubationAttemptCount',
      'airwayDevice',
    ],
    [
      'intubation_attempt_failed',
      'cricoid_pressure_applied',
      'mask_ppv_started',
      'mask_ppv_completed',
      'intubation_attempt_started',
      'intubation_attempt_succeeded',
    ],
  ),
  'carson-newman-rsi-induction:rsi-42': evidenceContract(
    'rsi_under_three_attempts',
    ['intubationAttemptCount', 'airwayDevice'],
    ['intubation_attempt_started', 'intubation_attempt_succeeded'],
  ),
});

const ENGINE_RULE_IDS = new Set(
  Object.values(ENGINE_EVIDENCE_CONTRACTS).map((contract) => contract.ruleId),
);

const SNAPSHOT_KEYS = new Set([
  'activeAnestheticInfusions',
  'airFlow',
  'airwayDevice',
  'capnogramPresent',
  'cricoidPressureActive',
  'effectiveMV',
  'effectiveNmbBlockade',
  'etco2',
  'eto2',
  'fio2',
  'intubationAttemptCount',
  'mechanicalMV',
  'n2oFlow',
  'o2Flow',
  'ppvActive',
  'respiratoryMuscleCapability',
  'spontaneousMV',
  'spontaneousRR',
  'spontaneousTV',
  'spo2',
  'tofRatio',
  'vaporizer',
  'vaporizerAgent',
  'ventMode',
  'ventSetFiO2',
  'ventSetRR',
  'ventSetTV',
]);

const ACTION_LOG_ENTRIES = new Set([
  'confirm_etco2',
  'cricoid_pressure_applied',
  'cricoid_pressure_released',
  'drug',
  'extubate',
  'intubation_attempt_failed',
  'intubation_attempt_started',
  'intubation_attempt_succeeded',
  'machine_settings_changed',
  'mask_ppv_completed',
  'mask_ppv_started',
  'preoxygenate',
  'spontaneous_ventilation_assessed',
  'tof_checked',
  'vent_mode_changed',
  'volatile_changed',
]);

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function deepCopy(value, ancestors = new WeakSet()) {
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
  if (typeof value !== 'object') throw new TypeError('Rubric data must be JSON-compatible');
  if (ancestors.has(value)) throw new TypeError('Rubric data must not contain cycles');
  if (!Array.isArray(value) && !isPlainObject(value)) {
    throw new TypeError('Rubric data objects must use a plain object prototype');
  }

  ancestors.add(value);
  const result = Array.isArray(value) ? [] : {};
  for (const [key, nested] of Object.entries(value)) {
    result[key] = deepCopy(nested, ancestors);
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

function ownKeysEqual(value, expected) {
  return isPlainObject(value)
    && Object.keys(value).sort().join('\0') === [...expected].sort().join('\0');
}

function requireString(value, label, { id = false } = {}) {
  if (typeof value !== 'string' || value.length === 0 || value !== value.trim()) {
    throw new TypeError(`${label} must be a non-empty trimmed string`);
  }
  if (id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new TypeError(`${label} must be a lowercase kebab-case identifier`);
  }
}

function requirePositiveInteger(value, label) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new TypeError(`${label} must be a positive integer`);
  }
}

function validatePointScale(value, label) {
  if (!ownKeysEqual(value, POINT_SCALE_KEYS)
    || value.performed !== 2
    || value.partial !== 1
    || value.notPerformed !== 0) {
    throw new RangeError(`${label} must be { performed: 2, partial: 1, notPerformed: 0 }`);
  }
}

function validatePassRule(value) {
  if (!ownKeysEqual(value, PASS_RULE_KEYS)
    || value.minimumPercent !== 85
    || value.requireEveryCriticalPerformed !== true) {
    throw new RangeError('passRule must require 85 percent and every critical item performed');
  }
}

function validateEvidenceList(values, allowed, label) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new TypeError(`${label} must be a non-empty array`);
  }
  const seen = new Set();
  for (const value of values) {
    requireString(value, label);
    if (!allowed.has(value)) throw new RangeError(`Unknown ${label}: ${value}`);
    if (seen.has(value)) throw new RangeError(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

function sameMembers(actual, expected) {
  return actual.length === expected.length
    && expected.every((entry) => actual.includes(entry));
}

function validateEngineEvidence(value, rubricId, itemId) {
  if (!ownKeysEqual(value, ENGINE_EVIDENCE_KEYS)) {
    throw new TypeError(`${itemId}.engineEvidence must contain snapshotKeys, actionLogEntries, and ruleId`);
  }
  validateEvidenceList(value.snapshotKeys, SNAPSHOT_KEYS, `${itemId}.engineEvidence.snapshotKeys`);
  validateEvidenceList(
    value.actionLogEntries,
    ACTION_LOG_ENTRIES,
    `${itemId}.engineEvidence.actionLogEntries`,
  );
  requireString(value.ruleId, `${itemId}.engineEvidence.ruleId`);
  if (!ENGINE_RULE_IDS.has(value.ruleId)) {
    throw new RangeError(`Unknown rubric rule: ${value.ruleId}`);
  }

  const expected = ENGINE_EVIDENCE_CONTRACTS[`${rubricId}:${itemId}`];
  if (!expected
    || value.ruleId !== expected.ruleId
    || !sameMembers(value.snapshotKeys, expected.snapshotKeys)
    || !sameMembers(value.actionLogEntries, expected.actionLogEntries)) {
    throw new RangeError(`${itemId}.engineEvidence does not match the approved evidence contract`);
  }
}

function validateDiscrepancies(rubric, summary) {
  if (!Array.isArray(rubric.discrepancies)) {
    throw new TypeError('discrepancies must be an array');
  }

  const denominatorMismatches = [];
  const seenCodes = new Set();
  for (const discrepancy of rubric.discrepancies) {
    if (!isPlainObject(discrepancy)) throw new TypeError('Each discrepancy must be an object');
    requireString(discrepancy.code, 'discrepancy.code');
    if (discrepancy.code !== 'SOURCE_DENOMINATOR_MISMATCH') {
      throw new RangeError(`Unknown discrepancy code: ${discrepancy.code}`);
    }
    if (!ownKeysEqual(discrepancy, SOURCE_DENOMINATOR_MISMATCH_KEYS)) {
      throw new TypeError(
        'SOURCE_DENOMINATOR_MISMATCH must contain only code, sourceHeaderDenominator, and computedMaxPoints',
      );
    }
    if (seenCodes.has(discrepancy.code)) {
      throw new RangeError(`Duplicate discrepancy code: ${discrepancy.code}`);
    }
    seenCodes.add(discrepancy.code);
    requirePositiveInteger(
      discrepancy.sourceHeaderDenominator,
      'SOURCE_DENOMINATOR_MISMATCH sourceHeaderDenominator',
    );
    requirePositiveInteger(
      discrepancy.computedMaxPoints,
      'SOURCE_DENOMINATOR_MISMATCH computedMaxPoints',
    );
    denominatorMismatches.push(discrepancy);
    if (discrepancy.sourceHeaderDenominator !== rubric.sourceHeaderDenominator) {
      throw new RangeError('SOURCE_DENOMINATOR_MISMATCH sourceHeaderDenominator is incorrect');
    }
    if (discrepancy.computedMaxPoints !== summary.maxPoints) {
      throw new RangeError('SOURCE_DENOMINATOR_MISMATCH computedMaxPoints is incorrect');
    }
  }

  const denominatorDiffers = rubric.sourceHeaderDenominator !== summary.maxPoints;
  if (denominatorDiffers && denominatorMismatches.length !== 1) {
    throw new RangeError('A SOURCE_DENOMINATOR_MISMATCH discrepancy is required');
  }
  if (!denominatorDiffers && denominatorMismatches.length !== 0) {
    throw new RangeError('SOURCE_DENOMINATOR_MISMATCH requires different source and computed totals');
  }
}

export function summarizeRubric(rubric) {
  return Object.freeze({
    itemCount: rubric.items.length,
    maxPoints: rubric.items.length * rubric.pointScale.performed,
    criticalCount: rubric.items.filter((item) => item.critical).length,
  });
}

export function normalizeRubric(raw) {
  if (!isPlainObject(raw)) throw new TypeError('Rubric must be an object');
  const rubric = deepCopy(raw);

  requireString(rubric.id, 'id', { id: true });
  requireString(rubric.title, 'title');
  requireString(rubric.course, 'course');
  requireString(rubric.sourceFile, 'sourceFile');
  if (!rubric.sourceFile.endsWith('.pdf')) throw new TypeError('sourceFile must name a PDF');
  if (typeof rubric.sourceSha256 !== 'string' || !/^[a-f0-9]{64}$/.test(rubric.sourceSha256)) {
    throw new TypeError('sourceSha256 must be a lowercase SHA-256 digest');
  }
  requirePositiveInteger(rubric.sourceHeaderDenominator, 'sourceHeaderDenominator');
  requirePositiveInteger(rubric.sourceFootnoteScoredItems, 'sourceFootnoteScoredItems');
  requirePositiveInteger(rubric.computedItemCount, 'computedItemCount');
  requirePositiveInteger(rubric.computedMaxPoints, 'computedMaxPoints');
  validatePointScale(rubric.pointScale, 'pointScale');
  validatePassRule(rubric.passRule);

  if (!Array.isArray(rubric.items) || rubric.items.length === 0) {
    throw new TypeError('items must be a non-empty array');
  }
  const itemIds = new Set();
  for (const item of rubric.items) {
    if (!isPlainObject(item)) throw new TypeError('Each item must be an object');
    requireString(item.id, 'item.id', { id: true });
    if (itemIds.has(item.id)) throw new RangeError(`Duplicate item id: ${item.id}`);
    itemIds.add(item.id);
    requireString(item.displayNumber, `${item.id}.displayNumber`);
    requireString(item.text, `${item.id}.text`);
    validatePointScale(item.pointScale, `${item.id}.pointScale`);
    if (typeof item.critical !== 'boolean') {
      throw new TypeError(`${item.id}.critical must be boolean`);
    }
    if (!RUBRIC_SCORING_SOURCES.includes(item.scoringSource)) {
      throw new RangeError(`Unknown scoring source: ${item.scoringSource}`);
    }
    if (item.scoringSource === 'ENGINE_OBSERVABLE') {
      validateEngineEvidence(item.engineEvidence, rubric.id, item.id);
    } else if (item.engineEvidence !== null) {
      throw new TypeError(`${item.id} must not declare engine evidence`);
    }
  }

  const summary = summarizeRubric(rubric);
  if (rubric.computedItemCount !== summary.itemCount) {
    throw new RangeError('computedItemCount does not match the item array');
  }
  if (rubric.sourceFootnoteScoredItems !== summary.itemCount) {
    throw new RangeError('sourceFootnoteScoredItems does not match the item array');
  }
  if (rubric.computedMaxPoints !== summary.maxPoints) {
    throw new RangeError('computedMaxPoints does not match the item point scales');
  }
  if (Object.hasOwn(rubric, 'computedCriticalCount')
    && rubric.computedCriticalCount !== summary.criticalCount) {
    throw new RangeError('computedCriticalCount does not match item critical metadata');
  }
  validateDiscrepancies(rubric, summary);

  return deepFreeze(rubric);
}
