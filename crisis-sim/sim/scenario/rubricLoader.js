export const RUBRIC_SCORING_SOURCES = Object.freeze([
  'ENGINE_OBSERVABLE',
  'INSTRUCTOR_OBSERVED',
  'UNSCOREABLE',
]);

const POINT_SCALE_KEYS = Object.freeze(['notPerformed', 'partial', 'performed']);
const PASS_RULE_KEYS = Object.freeze(['minimumPercent', 'requireEveryCriticalPerformed']);
const ENGINE_EVIDENCE_KEYS = Object.freeze(['actionLogEntries', 'ruleId', 'snapshotKeys']);

const ENGINE_RULE_IDS = new Set([
  'emergence_stop_anesthetic',
  'emergence_tof_and_reversal',
  'emergence_spontaneous_ventilation',
  'standard_mask_ventilation_before_nmb',
  'rsi_preoxygenation',
  'rsi_cricoid_applied',
  'rsi_medication_selection',
  'rsi_medication_sequence',
  'rsi_no_ppv_before_first_laryngoscopy',
  'rsi_continuous_etco2_confirmation',
  'rsi_failed_attempt_ppv_with_cricoid',
  'rsi_cricoid_release_after_confirmation',
  'rsi_inhaled_anesthetic_on',
  'rsi_vent_mode',
  'rsi_tidal_volume',
  'rsi_respiratory_rate',
  'rsi_fresh_gas',
  'rsi_fio2',
  'rsi_bag_to_vent',
  'rsi_appropriate_failed_attempt_intervention',
  'rsi_under_three_attempts',
]);

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

function validateEngineEvidence(value, itemId) {
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
    if (seenCodes.has(discrepancy.code)) {
      throw new RangeError(`Duplicate discrepancy code: ${discrepancy.code}`);
    }
    seenCodes.add(discrepancy.code);
    if (discrepancy.code === 'SOURCE_DENOMINATOR_MISMATCH') {
      denominatorMismatches.push(discrepancy);
      if (discrepancy.sourceHeaderDenominator !== rubric.sourceHeaderDenominator) {
        throw new RangeError('SOURCE_DENOMINATOR_MISMATCH sourceHeaderDenominator is incorrect');
      }
      if (discrepancy.computedMaxPoints !== summary.maxPoints) {
        throw new RangeError('SOURCE_DENOMINATOR_MISMATCH computedMaxPoints is incorrect');
      }
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
      validateEngineEvidence(item.engineEvidence, item.id);
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
