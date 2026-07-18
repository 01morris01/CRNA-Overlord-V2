export const CASE_STAGES = Object.freeze([
  'chart_review',
  'interview',
  'focused_exam',
  'findings_summary',
  'plan_submission',
  'live_simulation',
  'appropriately_deferred',
  'debrief_draft',
  'debrief_finalized',
  'debrief_revision',
]);

export const CASE_EFFECT_TYPES = Object.freeze([
  'set_surgical_stimulus',
  'inject_complication',
  'set_forced_apnea',
  'set_machine',
]);

const CASE_SECTION_KEYS = Object.freeze([
  'learnerChart',
  'assessment',
  'planRequirements',
  'surgery',
  'eventFlow',
  'instructorGuide',
  'debrief',
]);

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const RESERVED_LEARNER_CHART_KEYS = new Set([
  'instructorguide',
  'instructornotes',
  'answerkey',
  'expectedresponse',
  'scoringguidance',
  'concealedresponse',
]);

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function propertyValue(descriptor, label) {
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) {
    throw new TypeError(`${label} must be an enumerable data property, not an accessor`);
  }
  if (!descriptor.enumerable) {
    throw new TypeError(`${label} must not be a non-enumerable data property`);
  }
  return descriptor.value;
}

function copyArray(value, label, ancestors, names) {
  if (Object.getPrototypeOf(value) !== Array.prototype) {
    throw new TypeError(`${label} must contain only ordinary dense JSON-safe arrays`);
  }

  const lengthDescriptor = Object.getOwnPropertyDescriptor(value, 'length');
  if (!lengthDescriptor || !Object.hasOwn(lengthDescriptor, 'value')) {
    throw new TypeError(`${label} must be an ordinary dense JSON-safe array`);
  }
  const length = lengthDescriptor.value;

  for (const name of names) {
    if (name === 'length') continue;
    const descriptor = Object.getOwnPropertyDescriptor(value, name);
    propertyValue(descriptor, `${label}[${JSON.stringify(name)}]`);
    const index = Number(name);
    if (!Number.isInteger(index) || index < 0 || index >= length || String(index) !== name) {
      throw new TypeError(`${label} must be an ordinary dense JSON-safe array without extra properties`);
    }
  }

  if (names.length !== length + 1) {
    throw new TypeError(`${label} must be a dense JSON-safe array without sparse entries`);
  }

  const copied = new Array(length);
  for (let index = 0; index < length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    const nested = propertyValue(descriptor, `${label}[${index}]`);
    copied[index] = copyCaseDataInternal(nested, `${label}[${index}]`, ancestors);
  }
  return copied;
}

function copyObject(value, label, ancestors, names) {
  if (!isPlainObject(value)) {
    throw new TypeError(`${label} must contain only JSON-safe plain objects`);
  }

  const copied = Object.create(Object.getPrototypeOf(value));
  for (const name of names) {
    const descriptor = Object.getOwnPropertyDescriptor(value, name);
    const nested = propertyValue(descriptor, `${label}.${name}`);
    Object.defineProperty(copied, name, {
      configurable: true,
      enumerable: true,
      value: copyCaseDataInternal(nested, `${label}.${name}`, ancestors),
      writable: true,
    });
  }
  return copied;
}

function copyCaseDataInternal(value, label, ancestors) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError(`${label} must contain only finite JSON-safe numbers`);
    }
    return value;
  }
  if (typeof value !== 'object') {
    throw new TypeError(`${label} contains a non-JSON-safe ${typeof value} value`);
  }
  if (ancestors.has(value)) throw new TypeError(`${label} must not contain cycles`);
  if (Object.getOwnPropertySymbols(value).length > 0) {
    throw new TypeError(`${label} must contain only JSON-safe string keys, not symbol keys`);
  }

  const names = Object.getOwnPropertyNames(value);
  const unsafeKey = names.find((name) => UNSAFE_KEYS.has(name));
  if (unsafeKey !== undefined) {
    throw new TypeError(`${label} contains unsafe JSON key ${unsafeKey}`);
  }

  ancestors.add(value);
  try {
    return Array.isArray(value)
      ? copyArray(value, label, ancestors, names)
      : copyObject(value, label, ancestors, names);
  } finally {
    ancestors.delete(value);
  }
}

export function copyCaseData(value, label = 'case data') {
  return copyCaseDataInternal(value, label, new WeakSet());
}

function deepFreeze(value) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const name of Object.getOwnPropertyNames(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, name);
    if (descriptor && Object.hasOwn(descriptor, 'value')) deepFreeze(descriptor.value);
  }
  return Object.freeze(value);
}

function rejectReservedLearnerChartKeys(value, path = 'learnerChart') {
  if (value === null || typeof value !== 'object') return;
  for (const name of Object.getOwnPropertyNames(value)) {
    if (RESERVED_LEARNER_CHART_KEYS.has(name.toLowerCase())) {
      throw new TypeError(`${path}.${name} is a reserved learner-chart key`);
    }
    const descriptor = Object.getOwnPropertyDescriptor(value, name);
    if (descriptor && Object.hasOwn(descriptor, 'value')) {
      rejectReservedLearnerChartKeys(descriptor.value, `${path}.${name}`);
    }
  }
}

function getWrappedCaseExperience(input) {
  const descriptor = Object.getOwnPropertyDescriptor(input, 'caseExperience');
  return propertyValue(descriptor, 'caseExperience');
}

export function normalizeCaseExperience(input) {
  if (input === null || typeof input !== 'object') {
    throw new TypeError('case experience input must be a plain object');
  }

  const candidate = Object.hasOwn(input, 'caseExperience')
    ? getWrappedCaseExperience(input)
    : input;
  if (candidate === null) return null;
  if (!isPlainObject(candidate)) {
    throw new TypeError('case experience must be a JSON-safe plain object');
  }

  const presentSections = CASE_SECTION_KEYS.filter((key) => Object.hasOwn(candidate, key));
  if (presentSections.length === 0) return null;
  if (presentSections.length !== CASE_SECTION_KEYS.length) {
    throw new TypeError('a complete case experience must provide all seven case sections');
  }

  const copied = copyCaseData(candidate, 'case experience');
  if (!Number.isInteger(copied.version) || copied.version !== 1) {
    throw new TypeError('case experience version must be integer 1');
  }

  rejectReservedLearnerChartKeys(copied.learnerChart);
  return deepFreeze(copied);
}
