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
const RESERVED_LEARNER_CHART_KEY_FAMILIES = Object.freeze([
  /^expectedanswers?/,
  /^instructorconsiderations?/,
  /answerkeys?$/,
  /^concealedfindings?/,
]);
const INSTRUCTOR_CONTROLS = new Set([
  'pause',
  'resume',
  'advance',
  'activate_branch',
  'activate_event',
]);
const PHYSIOLOGY_OPERATORS = new Set(['<', '<=', '>', '>=', '==']);
const MACHINE_PATCH_KEYS = new Set([
  'o2FlowLPerMin',
  'airFlowLPerMin',
  'n2oFlowLPerMin',
  'setFiO2',
  'setTidalVolume',
  'setRespiratoryRate',
  'setPeep',
  'mode',
  'vaporizerAgent',
  'vaporizerDial',
]);
const DERIVED_VITAL_KEYS = new Set([
  'hr',
  'sbp',
  'dbp',
  'map',
  'spo2',
  'rr',
  'etco2',
  'temp',
  'tof',
  'tofratio',
  'baselinehr',
  'baselinesystolic',
  'baselinediastolic',
  'baselinespo2',
  'baselinerr',
  'baselinetemp',
  'baselineetco2',
  'baselinetofratio',
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
    const normalizedName = name.replace(/[^a-z0-9]/gi, '').toLowerCase();
    if (RESERVED_LEARNER_CHART_KEYS.has(normalizedName)
      || RESERVED_LEARNER_CHART_KEY_FAMILIES.some((pattern) => pattern.test(normalizedName))) {
      throw new TypeError(`${path}.${name} is a reserved learner-chart key`);
    }
    const descriptor = Object.getOwnPropertyDescriptor(value, name);
    if (descriptor && Object.hasOwn(descriptor, 'value')) {
      rejectReservedLearnerChartKeys(descriptor.value, `${path}.${name}`);
    }
  }
}

function requirePlainObject(value, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
}

function requireArray(value, label) {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype) {
    throw new TypeError(`${label} must be an ordinary array`);
  }
}

function requireNonemptyString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${label} must be a nonempty string`);
  }
}

function requireBoolean(value, label) {
  if (typeof value !== 'boolean') throw new TypeError(`${label} must be a boolean`);
}

function requireFiniteNumber(value, label, { min = -Infinity, max = Infinity } = {}) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number`);
  }
  if (value < min || value > max) {
    throw new RangeError(`${label} must be between ${min} and ${max}`);
  }
}

function requireStringArray(value, label) {
  requireArray(value, label);
  value.forEach((entry, index) => requireNonemptyString(entry, `${label}[${index}]`));
}

function requirePlainObjectEntries(value, label) {
  requireArray(value, label);
  value.forEach((entry, index) => requirePlainObject(entry, `${label}[${index}]`));
}

function requireExactKeys(value, expectedKeys, label) {
  const actualKeys = Object.keys(value).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();
  if (actualKeys.length !== sortedExpectedKeys.length
    || actualKeys.some((key, index) => key !== sortedExpectedKeys[index])) {
    throw new TypeError(`${label} must have exact shape {${expectedKeys.join(',')}}`);
  }
}

function rejectUnsupportedTriggerFields(trigger, allowedKeys, label) {
  const allowed = new Set(allowedKeys);
  const unsupported = Object.keys(trigger).find((key) => !allowed.has(key));
  if (unsupported !== undefined) {
    throw new TypeError(`${label}.${unsupported} is an unsupported trigger field`);
  }
}

function collectIds(entries, label) {
  const ids = new Set();
  entries.forEach((entry, index) => {
    requireNonemptyString(entry.id, `${label}[${index}].id`);
    if (ids.has(entry.id)) throw new TypeError(`${label} contains duplicate id ${entry.id}`);
    ids.add(entry.id);
  });
  return ids;
}

function requireReference(ids, id, label) {
  requireNonemptyString(id, label);
  if (!ids.has(id)) throw new TypeError(`${label} references unknown id ${id}`);
}

function rejectPrerequisiteCycles(actions) {
  const actionsById = new Map(actions.map((action) => [action.id, action]));
  const visitState = new Map();

  function visit(actionId) {
    const state = visitState.get(actionId);
    if (state === 'visiting') {
      throw new TypeError(`assessment prerequisite cycle detected at action ${actionId}`);
    }
    if (state === 'visited') return;

    visitState.set(actionId, 'visiting');
    for (const prerequisiteId of actionsById.get(actionId).prerequisites) {
      visit(prerequisiteId);
    }
    visitState.set(actionId, 'visited');
  }

  for (const action of actions) visit(action.id);
}

function requireFixedStepSeconds(value, label) {
  requireFiniteNumber(value, label);
  if (value < 0) throw new RangeError(`${label} must be nonnegative`);
  const fixedSteps = value * 50;
  const nearestStep = Math.round(fixedSteps);
  if (!Number.isFinite(fixedSteps)
    || !Number.isSafeInteger(nearestStep)
    || Math.abs(fixedSteps - nearestStep) > 1e-9) {
    throw new RangeError(
      `${label} must align to finite safe-integer 0.02-second fixed-step ticks`,
    );
  }
}

function validateLearnerChart(chart) {
  requirePlainObject(chart, 'learnerChart');
  requirePlainObject(chart.patient, 'learnerChart.patient');
  requireNonemptyString(chart.patient.syntheticName, 'learnerChart.patient.syntheticName');
  requireNonemptyString(chart.patient.mrn, 'learnerChart.patient.mrn');
  requireFiniteNumber(chart.patient.ageYears, 'learnerChart.patient.ageYears');
  requireNonemptyString(chart.patient.sex, 'learnerChart.patient.sex');
  for (const key of ['dob']) {
    if (Object.hasOwn(chart.patient, key)) {
      requireNonemptyString(chart.patient[key], `learnerChart.patient.${key}`);
    }
  }
  for (const key of ['heightCm', 'weightKg', 'bmi']) {
    if (Object.hasOwn(chart.patient, key)) {
      requireFiniteNumber(chart.patient[key], `learnerChart.patient.${key}`);
    }
  }

  requirePlainObject(chart.scheduledProcedure, 'learnerChart.scheduledProcedure');
  for (const key of ['name', 'site', 'laterality']) {
    requireNonemptyString(
      chart.scheduledProcedure[key],
      `learnerChart.scheduledProcedure.${key}`,
    );
  }
  for (const key of ['surgeon', 'date', 'plannedAnesthesia']) {
    if (Object.hasOwn(chart.scheduledProcedure, key)) {
      requireNonemptyString(
        chart.scheduledProcedure[key],
        `learnerChart.scheduledProcedure.${key}`,
      );
    }
  }

  for (const key of ['documents', 'medications', 'allergies', 'labs', 'studies']) {
    requireArray(chart[key], `learnerChart.${key}`);
  }
  for (let index = 0; index < chart.documents.length; index += 1) {
    const document = chart.documents[index];
    requirePlainObject(document, `learnerChart.documents[${index}]`);
    for (const key of ['id', 'title', 'type']) {
      requireNonemptyString(document[key], `learnerChart.documents[${index}].${key}`);
    }
    requireArray(document.sections, `learnerChart.documents[${index}].sections`);
  }
  if (Object.hasOwn(chart, 'baselineVitals')) {
    requirePlainObject(chart.baselineVitals, 'learnerChart.baselineVitals');
    for (const [key, value] of Object.entries(chart.baselineVitals)) {
      requireFiniteNumber(value, `learnerChart.baselineVitals.${key}`);
    }
  }
}

function validateAssessment(assessment) {
  requirePlainObject(assessment, 'assessment');
  requireStringArray(assessment.stages, 'assessment.stages');
  assessment.stages.forEach((stage) => {
    if (!CASE_STAGES.includes(stage)) throw new TypeError(`assessment stage ${stage} is unsupported`);
  });
  requirePlainObjectEntries(assessment.actions, 'assessment.actions');
  requirePlainObjectEntries(assessment.findings, 'assessment.findings');
  requireStringArray(assessment.requiredDomains, 'assessment.requiredDomains');
  requirePlainObjectEntries(assessment.scoringRules, 'assessment.scoringRules');

  assessment.actions.forEach((action, index) => {
    const label = `assessment.actions[${index}]`;
    for (const key of ['id', 'stage', 'domain', 'prompt', 'response', 'scoringRuleId']) {
      requireNonemptyString(action[key], `${label}.${key}`);
    }
    if (!CASE_STAGES.includes(action.stage)) {
      throw new TypeError(`${label}.stage is unsupported`);
    }
    requireStringArray(action.reveals, `${label}.reveals`);
    requireStringArray(action.prerequisites, `${label}.prerequisites`);
    requireBoolean(action.critical, `${label}.critical`);
  });

  assessment.findings.forEach((finding, index) => {
    const label = `assessment.findings[${index}]`;
    for (const key of ['id', 'learnerLabel', 'significance']) {
      requireNonemptyString(finding[key], `${label}.${key}`);
    }
    requireBoolean(finding.initiallyVisible, `${label}.initiallyVisible`);
    requireBoolean(
      finding.instructorOnlyUntilDiscovered,
      `${label}.instructorOnlyUntilDiscovered`,
    );
  });

  assessment.scoringRules.forEach((rule, index) => {
    const label = `assessment.scoringRules[${index}]`;
    for (const key of ['id', 'label', 'source']) {
      requireNonemptyString(rule[key], `${label}.${key}`);
    }
    requireBoolean(rule.critical, `${label}.critical`);
    requirePlainObject(rule.evidence, `${label}.evidence`);
    requireNonemptyString(rule.evidence.type, `${label}.evidence.type`);
    requireNonemptyString(rule.evidence.actionId, `${label}.evidence.actionId`);
  });
}

function validatePlanRequirements(planRequirements) {
  requirePlainObject(planRequirements, 'planRequirements');
  requirePlainObjectEntries(planRequirements.fields, 'planRequirements.fields');
  requirePlainObjectEntries(planRequirements.rules, 'planRequirements.rules');

  planRequirements.fields.forEach((field, index) => {
    const label = `planRequirements.fields[${index}]`;
    requireNonemptyString(field.id, `${label}.id`);
    requireNonemptyString(field.type, `${label}.type`);
    requireBoolean(field.required, `${label}.required`);
    requireStringArray(field.options, `${label}.options`);
  });

  planRequirements.rules.forEach((rule, index) => {
    const label = `planRequirements.rules[${index}]`;
    for (const key of ['id', 'label', 'source']) {
      requireNonemptyString(rule[key], `${label}.${key}`);
    }
    requireBoolean(rule.critical, `${label}.critical`);
    requirePlainObject(rule.evidence, `${label}.evidence`);
    requireNonemptyString(rule.evidence.type, `${label}.evidence.type`);
    requireNonemptyString(rule.evidence.fieldId, `${label}.evidence.fieldId`);
    if (!Object.hasOwn(rule.evidence, 'value')) {
      throw new TypeError(`${label}.evidence must provide its own value`);
    }
  });
}

function validateSurgery(surgery) {
  requirePlainObject(surgery, 'surgery');
  for (const key of [
    'procedure', 'indication', 'position', 'expectedStimulation', 'bloodLossRisk',
  ]) {
    requireNonemptyString(surgery[key], `surgery.${key}`);
  }
  requireFiniteNumber(surgery.expectedDurationMin, 'surgery.expectedDurationMin');
  requireStringArray(surgery.physiologicChallenges, 'surgery.physiologicChallenges');
  requireStringArray(surgery.anesthesiaConsiderations, 'surgery.anesthesiaConsiderations');
}

function validateCompletionWhen(completion, label) {
  requirePlainObject(completion, label);
  requireNonemptyString(completion.type, `${label}.type`);
  switch (completion.type) {
    case 'plan_submitted':
    case 'instructor_advance':
      requireExactKeys(completion, ['type'], label);
      break;
    case 'event_fired':
      requireExactKeys(completion, ['type', 'eventId'], label);
      requireNonemptyString(completion.eventId, `${label}.eventId`);
      break;
    case 'branch_activated':
      requireExactKeys(completion, ['type', 'branchId'], label);
      requireNonemptyString(completion.branchId, `${label}.branchId`);
      break;
    default:
      throw new TypeError(`${label} has unsupported completion type ${completion.type}`);
  }
}

function validateTrigger(trigger, label, planFieldIds) {
  requirePlainObject(trigger, label);
  requireNonemptyString(trigger.type, `${label}.type`);
  switch (trigger.type) {
    case 'fixed_time':
    case 'phase_time':
      rejectUnsupportedTriggerFields(trigger, ['type', 'atSec'], label);
      requireFixedStepSeconds(trigger.atSec, `${label}.atSec`);
      break;
    case 'action':
      rejectUnsupportedTriggerFields(trigger, ['type', 'action', 'match'], label);
      requireNonemptyString(trigger.action, `${label}.action`);
      if (Object.hasOwn(trigger, 'match')) requirePlainObject(trigger.match, `${label}.match`);
      break;
    case 'plan':
      rejectUnsupportedTriggerFields(trigger, ['type', 'fieldId', 'equals'], label);
      requireReference(planFieldIds, trigger.fieldId, `${label} plan field`);
      if (!Object.hasOwn(trigger, 'equals')) {
        throw new TypeError(`${label} plan trigger must provide its own equals value`);
      }
      break;
    case 'physiology':
      rejectUnsupportedTriggerFields(
        trigger,
        ['type', 'key', 'operator', 'value', 'dwellSec', 'resetDelta'],
        label,
      );
      requireNonemptyString(trigger.key, `${label}.key`);
      if (!PHYSIOLOGY_OPERATORS.has(trigger.operator)) {
        throw new TypeError(`${label}.operator is an unsupported physiology comparator`);
      }
      requireFiniteNumber(trigger.value, `${label}.value`);
      requireFixedStepSeconds(trigger.dwellSec, `${label}.dwellSec`);
      requireFiniteNumber(trigger.resetDelta, `${label}.resetDelta`, { min: 0 });
      break;
    case 'instructor':
    case 'phase_enter':
      rejectUnsupportedTriggerFields(trigger, ['type'], label);
      break;
    default:
      throw new TypeError(`${label} has unsupported trigger type ${trigger.type}`);
  }
}

function rejectDerivedVitalKeys(value, path = 'event effect') {
  if (value === null || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    if (DERIVED_VITAL_KEYS.has(key.toLowerCase())) {
      throw new TypeError(
        `${path}.${key} is a derived vital and cannot be written by a modeled input effect`,
      );
    }
    rejectDerivedVitalKeys(nested, `${path}.${key}`);
  }
}

function validateMachinePatch(patch, label) {
  requirePlainObject(patch, label);
  for (const key of Object.keys(patch)) {
    if (!MACHINE_PATCH_KEYS.has(key)) {
      throw new TypeError(`${label}.${key} is an unsupported machine patch key`);
    }
    switch (key) {
      case 'o2FlowLPerMin':
      case 'airFlowLPerMin':
      case 'n2oFlowLPerMin':
        requireFiniteNumber(patch[key], `${label}.${key}`, { min: 0, max: 100 });
        break;
      case 'setFiO2':
        requireFiniteNumber(patch[key], `${label}.${key}`, { min: 0.21, max: 1 });
        break;
      case 'setTidalVolume':
        requireFiniteNumber(patch[key], `${label}.${key}`, { min: 0, max: 2000 });
        break;
      case 'setRespiratoryRate':
        requireFiniteNumber(patch[key], `${label}.${key}`, { min: 0, max: 100 });
        break;
      case 'setPeep':
        requireFiniteNumber(patch[key], `${label}.${key}`, { min: 0, max: 50 });
        break;
      case 'mode': {
        const validNumber = Number.isInteger(patch.mode) && patch.mode >= 0 && patch.mode <= 3;
        const validString = typeof patch.mode === 'string'
          && ['manual', 'vcv', 'pcv', 'psv'].includes(patch.mode.toLowerCase());
        if (!validNumber && !validString) {
          throw new TypeError(`${label}.mode must be a supported ventilator mode`);
        }
        break;
      }
      case 'vaporizerAgent':
        if (!['Sevoflurane', 'Desflurane', 'Isoflurane'].includes(patch.vaporizerAgent)) {
          throw new TypeError(`${label}.vaporizerAgent must be a supported agent`);
        }
        break;
      case 'vaporizerDial':
        requireFiniteNumber(patch[key], `${label}.${key}`, { min: 0, max: 18 });
        break;
      default:
        throw new TypeError(`${label}.${key} is an unsupported machine patch key`);
    }
  }
}

function validateEffect(effect, label) {
  if (effect === null) return;
  requirePlainObject(effect, label);
  rejectDerivedVitalKeys(effect, label);
  requireNonemptyString(effect.type, `${label}.type`);
  switch (effect.type) {
    case 'set_surgical_stimulus':
      requireExactKeys(effect, ['type', 'intensity'], label);
      requireFiniteNumber(effect.intensity, `${label}.intensity`, { min: 0, max: 1 });
      break;
    case 'inject_complication':
      requireExactKeys(effect, ['type', 'complicationType', 'description'], label);
      requireNonemptyString(effect.complicationType, `${label}.complicationType`);
      requireNonemptyString(effect.description, `${label}.description`);
      break;
    case 'set_forced_apnea':
      requireExactKeys(effect, ['type', 'active'], label);
      requireBoolean(effect.active, `${label}.active`);
      break;
    case 'set_machine':
      requireExactKeys(effect, ['type', 'patch'], label);
      validateMachinePatch(effect.patch, `${label}.patch`);
      break;
    default:
      throw new TypeError(`${label} has unsupported effect type ${effect.type}`);
  }
}

function validateEventFlow(eventFlow, planFieldIds) {
  requirePlainObject(eventFlow, 'eventFlow');
  requireNonemptyString(eventFlow.initialPhaseId, 'eventFlow.initialPhaseId');
  requirePlainObjectEntries(eventFlow.phases, 'eventFlow.phases');
  requirePlainObjectEntries(eventFlow.events, 'eventFlow.events');
  requirePlainObjectEntries(eventFlow.branches, 'eventFlow.branches');

  eventFlow.phases.forEach((phase, index) => {
    const label = `eventFlow.phases[${index}]`;
    requireNonemptyString(phase.id, `${label}.id`);
    requireNonemptyString(phase.title, `${label}.title`);
    requirePlainObject(phase.enterWhen, `${label}.enterWhen`);
    requireNonemptyString(phase.enterWhen.type, `${label}.enterWhen.type`);
    requireStringArray(phase.events, `${label}.events`);
    validateCompletionWhen(phase.completionWhen, `${label}.completionWhen`);
    requireStringArray(phase.allowedInstructorControls, `${label}.allowedInstructorControls`);
    phase.allowedInstructorControls.forEach((control) => {
      if (!INSTRUCTOR_CONTROLS.has(control)) {
        throw new TypeError(`${label} contains unsupported instructor control ${control}`);
      }
    });
  });

  eventFlow.events.forEach((event, index) => {
    const label = `eventFlow.events[${index}]`;
    requireNonemptyString(event.id, `${label}.id`);
    requireNonemptyString(event.phaseId, `${label}.phaseId`);
    validateTrigger(event.trigger, `${label}.trigger`, planFieldIds);
    requireBoolean(event.repeatable, `${label}.repeatable`);
    requireFixedStepSeconds(event.responseWindowSec, `${label}.responseWindowSec`);
    requireArray(event.expectedResponses, `${label}.expectedResponses`);
    requireArray(event.unsafeResponses, `${label}.unsafeResponses`);
    validateEffect(event.effect, `${label}.effect`);
    requireStringArray(event.guidanceIds, `${label}.guidanceIds`);
    requireStringArray(event.debriefIds, `${label}.debriefIds`);
  });

  eventFlow.branches.forEach((branch, index) => {
    const label = `eventFlow.branches[${index}]`;
    requireExactKeys(
      branch,
      ['id', 'label', 'fromPhaseId', 'toPhaseId', 'instructorOnly'],
      label,
    );
    for (const key of ['id', 'label', 'fromPhaseId', 'toPhaseId']) {
      requireNonemptyString(branch[key], `${label}.${key}`);
    }
    if (branch.instructorOnly !== true) {
      throw new TypeError(`${label}.instructorOnly must be true`);
    }
  });
}

function validateInstructorGuide(instructorGuide) {
  requirePlainObject(instructorGuide, 'instructorGuide');
  requirePlainObjectEntries(instructorGuide.considerations, 'instructorGuide.considerations');
  instructorGuide.considerations.forEach((consideration, index) => {
    const label = `instructorGuide.considerations[${index}]`;
    for (const key of [
      'id',
      'phaseId',
      'eventId',
      'title',
      'consideration',
      'expectedResponse',
      'scoringGuidance',
    ]) {
      requireNonemptyString(consideration[key], `${label}.${key}`);
    }
    requireFixedStepSeconds(consideration.responseWindowSec, `${label}.responseWindowSec`);
    requireStringArray(consideration.redFlags, `${label}.redFlags`);
    requireBoolean(
      consideration.defaultRevealInDebrief,
      `${label}.defaultRevealInDebrief`,
    );
  });
}

function validateDebrief(debrief) {
  requirePlainObject(debrief, 'debrief');
  requirePlainObjectEntries(debrief.teachingItems, 'debrief.teachingItems');
  debrief.teachingItems.forEach((item, index) => {
    const label = `debrief.teachingItems[${index}]`;
    for (const key of ['id', 'title', 'explanation']) {
      requireNonemptyString(item[key], `${label}.${key}`);
    }
  });
}

function validateReferences(value) {
  collectIds(value.learnerChart.documents, 'learner chart documents');
  const actionIds = collectIds(value.assessment.actions, 'assessment actions');
  const findingIds = collectIds(value.assessment.findings, 'assessment findings');
  const assessmentRuleIds = collectIds(
    value.assessment.scoringRules,
    'assessment scoring rules',
  );
  const planFieldIds = collectIds(value.planRequirements.fields, 'plan fields');
  collectIds(value.planRequirements.rules, 'plan scoring rules');
  const phaseIds = collectIds(value.eventFlow.phases, 'event-flow phases');
  const eventIds = collectIds(value.eventFlow.events, 'event-flow events');
  const branchIds = collectIds(value.eventFlow.branches, 'event-flow branches');
  const guidanceIds = collectIds(
    value.instructorGuide.considerations,
    'instructor guidance considerations',
  );
  const teachingItemIds = collectIds(value.debrief.teachingItems, 'debrief teaching items');

  value.assessment.actions.forEach((action, index) => {
    action.prerequisites.forEach((id) => requireReference(
      actionIds,
      id,
      `assessment.actions[${index}] prerequisite action`,
    ));
    action.reveals.forEach((id) => requireReference(
      findingIds,
      id,
      `assessment.actions[${index}] finding`,
    ));
    requireReference(
      assessmentRuleIds,
      action.scoringRuleId,
      `assessment.actions[${index}] scoring rule`,
    );
  });
  rejectPrerequisiteCycles(value.assessment.actions);
  value.assessment.scoringRules.forEach((rule, index) => requireReference(
    actionIds,
    rule.evidence.actionId,
    `assessment.scoringRules[${index}] evidence action`,
  ));
  value.planRequirements.rules.forEach((rule, index) => requireReference(
    planFieldIds,
    rule.evidence.fieldId,
    `planRequirements.rules[${index}] evidence plan field`,
  ));

  requireReference(phaseIds, value.eventFlow.initialPhaseId, 'eventFlow initial phase');
  const eventsById = new Map(value.eventFlow.events.map((event) => [event.id, event]));
  const eventMembershipCounts = new Map(
    value.eventFlow.events.map((event) => [event.id, 0]),
  );
  value.eventFlow.phases.forEach((phase, index) => {
    phase.events.forEach((eventId) => requireReference(
      eventIds,
      eventId,
      `eventFlow.phases[${index}] event`,
    ));
    phase.events.forEach((eventId) => {
      const event = eventsById.get(eventId);
      eventMembershipCounts.set(eventId, eventMembershipCounts.get(eventId) + 1);
      if (event.phaseId !== phase.id) {
        throw new TypeError(
          `event ${eventId} is listed under phase ${phase.id} but declares owning phase ${event.phaseId}`,
        );
      }
    });
    if (phase.completionWhen.type === 'event_fired') {
      requireReference(
        eventIds,
        phase.completionWhen.eventId,
        `eventFlow.phases[${index}] completion event`,
      );
    }
    if (phase.completionWhen.type === 'branch_activated') {
      requireReference(
        branchIds,
        phase.completionWhen.branchId,
        `eventFlow.phases[${index}] completion branch`,
      );
    }
  });
  value.eventFlow.events.forEach((event, index) => {
    requireReference(phaseIds, event.phaseId, `eventFlow.events[${index}] phase`);
    const membershipCount = eventMembershipCounts.get(event.id);
    if (membershipCount !== 1) {
      throw new TypeError(
        `event ${event.id} must be listed exactly once in its owning phase; found ${membershipCount}`,
      );
    }
    event.guidanceIds.forEach((id) => requireReference(
      guidanceIds,
      id,
      `eventFlow.events[${index}] guidance`,
    ));
    event.debriefIds.forEach((id) => requireReference(
      teachingItemIds,
      id,
      `eventFlow.events[${index}] debrief teaching item`,
    ));
  });
  value.instructorGuide.considerations.forEach((consideration, index) => {
    requireReference(
      phaseIds,
      consideration.phaseId,
      `instructorGuide.considerations[${index}] phase`,
    );
    requireReference(
      eventIds,
      consideration.eventId,
      `instructorGuide.considerations[${index}] event`,
    );
    const considerationEvent = eventsById.get(consideration.eventId);
    if (considerationEvent.phaseId !== consideration.phaseId) {
      throw new TypeError(
        `consideration ${consideration.id} event ${consideration.eventId} belongs to phase ${considerationEvent.phaseId}, not declared phase ${consideration.phaseId}`,
      );
    }
  });
  value.eventFlow.branches.forEach((branch, index) => {
    requireReference(phaseIds, branch.fromPhaseId, `eventFlow.branches[${index}] from phase`);
    requireReference(phaseIds, branch.toPhaseId, `eventFlow.branches[${index}] to phase`);
  });

  const reachablePhaseIds = new Set([value.eventFlow.initialPhaseId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const branch of value.eventFlow.branches) {
      if (reachablePhaseIds.has(branch.fromPhaseId)
        && !reachablePhaseIds.has(branch.toPhaseId)) {
        reachablePhaseIds.add(branch.toPhaseId);
        changed = true;
      }
    }
  }
  const unreachablePhase = value.eventFlow.phases.find(
    (phase) => !reachablePhaseIds.has(phase.id),
  );
  if (unreachablePhase) {
    throw new TypeError(`unreachable event-flow phase ${unreachablePhase.id}`);
  }

}

function validateCaseExperience(value) {
  validateLearnerChart(value.learnerChart);
  validateAssessment(value.assessment);
  validatePlanRequirements(value.planRequirements);
  validateSurgery(value.surgery);
  const planFieldIds = collectIds(value.planRequirements.fields, 'plan fields');
  validateEventFlow(value.eventFlow, planFieldIds);
  validateInstructorGuide(value.instructorGuide);
  validateDebrief(value.debrief);
  validateReferences(value);
}

function getWrappedCaseExperience(input) {
  const descriptor = Object.getOwnPropertyDescriptor(input, 'caseExperience');
  return propertyValue(descriptor, 'caseExperience');
}

export function normalizeCaseExperience(input) {
  if (input === null || typeof input !== 'object') {
    throw new TypeError('case experience input must be a plain object');
  }

  const isWrapped = Object.hasOwn(input, 'caseExperience');
  const candidate = isWrapped
    ? getWrappedCaseExperience(input)
    : input;
  if (candidate === null) return null;
  if (!isPlainObject(candidate)) {
    throw new TypeError('case experience must be a JSON-safe plain object');
  }

  const presentSections = CASE_SECTION_KEYS.filter((key) => Object.hasOwn(candidate, key));
  if (presentSections.length === 0 && !isWrapped) return null;
  if (presentSections.length === 1
    && presentSections[0] === 'debrief'
    && Object.hasOwn(candidate, 'events')) return null;
  if (presentSections.length !== CASE_SECTION_KEYS.length) {
    throw new TypeError('a complete case experience must provide all seven case sections');
  }

  const copied = copyCaseData(candidate, 'case experience');
  if (!Number.isInteger(copied.version) || copied.version !== 1) {
    throw new TypeError('case experience version must be integer 1');
  }

  rejectReservedLearnerChartKeys(copied.learnerChart);
  validateCaseExperience(copied);
  return deepFreeze(copied);
}
