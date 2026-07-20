import {
  CASE_STAGES,
  copyCaseData,
  normalizeCaseExperience,
} from './caseContract.js';

const SESSION_ARRAY_KEYS = Object.freeze([
  'completedActionIds',
  'assessmentRecords',
  'discoveredFindingIds',
  'findingsSubmissionHistory',
  'planSubmissionHistory',
  'ruleResults',
  'instructorObservations',
  'instructorObservationHistory',
  'feedbackRevealIds',
  'feedbackRevealHistory',
  'timeline',
  'revisions',
]);

const OBSERVATION_STATUSES = Object.freeze([
  'observed',
  'missed',
  'not_yet_evaluable',
]);

const ASSESSMENT_RECORD_KEYS = Object.freeze([
  'actionId',
  'tSec',
  'sequence',
  'stage',
  'critical',
  'scoringRuleId',
  'revealedFindingIds',
]);

const FINDINGS_SUBMISSION_KEYS = Object.freeze([
  'findingIds',
  'notes',
  'tSec',
  'sequence',
  'revision',
]);

const PLAN_SUBMISSION_KEYS = Object.freeze([
  'selections',
  'rationale',
  'tSec',
  'sequence',
  'revision',
]);

const RULE_RESULT_KEYS = Object.freeze([
  'id',
  'label',
  'critical',
  'source',
  'status',
  'points',
  'evidence',
  'updatedAtSec',
]);

const OBSERVATION_KEYS = Object.freeze([
  'considerationId',
  'status',
  'note',
  'tSec',
  'sequence',
  'revision',
]);

const FEEDBACK_HISTORY_KEYS = Object.freeze([
  'considerationId',
  'reveal',
  'tSec',
  'sequence',
  'revision',
]);

const REVISION_KEYS = Object.freeze([
  'revision',
  'tSec',
  'sequence',
]);

const LEARNER_RECORD_KEYS = Object.freeze([
  'actionId',
  'tSec',
  'sequence',
]);

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function freezeRecursively(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) freezeRecursively(nested, seen);
  return Object.freeze(value);
}

function requireOrdinaryArray(value, label) {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype) {
    throw new TypeError(`${label} must be an ordinary array`);
  }
}

function requirePlainObject(value, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
}

function requireNonemptyString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${label} must be a nonempty string`);
  }
}

function requireExactKeys(value, expectedKeys, label) {
  requirePlainObject(value, label);
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  if (actual.length !== expected.length
    || actual.some((key, index) => key !== expected[index])) {
    throw new TypeError(`${label} must have exact shape {${expectedKeys.join(',')}}`);
  }
}

function requireTimestamp(value, label, { nullable = false } = {}) {
  if (nullable && value === null) return;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new TypeError(`${label} must be a finite nonnegative fixed-step timestamp`);
  }
  const ticks = value * 50;
  const nearestTick = Math.round(ticks);
  if (!Number.isSafeInteger(nearestTick) || Math.abs(ticks - nearestTick) > 1e-9) {
    throw new RangeError(`${label} must align to safe-integer 0.02-second fixed-step ticks`);
  }
}

function requireSequence(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${label} must be a nonnegative safe integer`);
  }
}

function requireRevision(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new TypeError(`${label} must be a positive safe integer`);
  }
}

function requireStringIds(value, label) {
  requireOrdinaryArray(value, label);
  const seen = new Set();
  value.forEach((id, index) => {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new TypeError(`${label}[${index}] must be a nonempty string`);
    }
    if (seen.has(id)) throw new TypeError(`${label} contains duplicate id ${id}`);
    seen.add(id);
  });
}

function normalizeProjectionDefinition(definition) {
  try {
    const normalized = normalizeCaseExperience(definition);
    if (normalized === null) {
      throw new TypeError('definition must contain a complete case experience');
    }
    return normalized;
  } catch (error) {
    throw new TypeError(`definition must be a validated case definition: ${error.message}`);
  }
}

function createDefinitionReferences(definition) {
  return {
    actions: new Map(definition.assessment.actions.map((entry) => [entry.id, entry])),
    findings: new Map(definition.assessment.findings.map((entry) => [entry.id, entry])),
    fields: new Map(definition.planRequirements.fields.map((entry) => [entry.id, entry])),
    rules: [
      ...definition.assessment.scoringRules,
      ...definition.planRequirements.rules,
    ],
    considerations: new Map(
      definition.instructorGuide.considerations.map((entry) => [entry.id, entry]),
    ),
    phases: new Map(definition.eventFlow.phases.map((entry) => [entry.id, entry])),
    events: new Map(definition.eventFlow.events.map((entry) => [entry.id, entry])),
    branches: new Map(definition.eventFlow.branches.map((entry) => [entry.id, entry])),
  };
}

function requireKnownIds(value, label, references, kind) {
  requireStringIds(value, label);
  for (const id of value) {
    if (!references.has(id)) throw new TypeError(`${label} contains unknown ${kind} id ${id}`);
  }
}

function validateRecordPosition(record, label) {
  requireTimestamp(record.tSec, `${label}.tSec`);
  requireSequence(record.sequence, `${label}.sequence`);
}

function validateAssessmentRecords(records, references) {
  records.forEach((record, index) => {
    const label = `sessionState.assessmentRecords[${index}]`;
    requireExactKeys(record, ASSESSMENT_RECORD_KEYS, label);
    const action = references.actions.get(record.actionId);
    if (!action) throw new TypeError(`${label}.actionId references unknown action ${record.actionId}`);
    if (!CASE_STAGES.includes(record.stage) || record.stage !== action.stage) {
      throw new TypeError(`${label}.stage must match the referenced action stage`);
    }
    if (typeof record.critical !== 'boolean' || record.critical !== action.critical) {
      throw new TypeError(`${label}.critical must match the referenced action`);
    }
    if (record.scoringRuleId !== action.scoringRuleId) {
      throw new TypeError(`${label}.scoringRuleId must match the referenced action`);
    }
    requireKnownIds(
      record.revealedFindingIds,
      `${label}.revealedFindingIds`,
      references.findings,
      'finding',
    );
    validateRecordPosition(record, label);
  });
}

function validateFindingsSubmission(submission, label, references) {
  requireExactKeys(submission, FINDINGS_SUBMISSION_KEYS, label);
  requireKnownIds(submission.findingIds, `${label}.findingIds`, references.findings, 'finding');
  if (typeof submission.notes !== 'string') throw new TypeError(`${label}.notes must be a string`);
  validateRecordPosition(submission, label);
  requireRevision(submission.revision, `${label}.revision`);
}

function validatePlanSelections(selections, label, references) {
  requirePlainObject(selections, label);
  for (const fieldId of Object.keys(selections)) {
    const field = references.fields.get(fieldId);
    if (!field) throw new TypeError(`${label} contains unknown plan field ${fieldId}`);
    const selection = selections[fieldId];
    if (field.type === 'multi') {
      requireOrdinaryArray(selection, `${label}.${fieldId}`);
      if (field.required && selection.length === 0) {
        throw new RangeError(`${label}.${fieldId} is required and must not be empty`);
      }
      const selected = new Set();
      selection.forEach((option, index) => {
        requireNonemptyString(option, `${label}.${fieldId}[${index}]`);
        if (selected.has(option)) {
          throw new TypeError(`${label}.${fieldId} contains duplicate option ${option}`);
        }
        if (!field.options.includes(option)) {
          throw new RangeError(`${label}.${fieldId} must use valid options`);
        }
        selected.add(option);
      });
      const canonicalSelection = field.options.filter((option) => selected.has(option));
      if (!equalJsonSafe(selection, canonicalSelection)) {
        throw new TypeError(`${label}.${fieldId} must use canonical definition order`);
      }
    } else {
      if (Array.isArray(selection)) {
        throw new TypeError(`${label}.${fieldId} is single-select and must use one option value`);
      }
      if (!field.options.includes(selection)) {
        throw new RangeError(`${label}.${fieldId} must use a valid option`);
      }
    }
  }
  for (const field of references.fields.values()) {
    if (field.required && !Object.hasOwn(selections, field.id)) {
      throw new TypeError(`${label} is missing required plan field ${field.id}`);
    }
  }
}

function validatePlanSubmission(submission, label, references) {
  requireExactKeys(submission, PLAN_SUBMISSION_KEYS, label);
  validatePlanSelections(submission.selections, `${label}.selections`, references);
  if (typeof submission.rationale !== 'string') {
    throw new TypeError(`${label}.rationale must be a string`);
  }
  validateRecordPosition(submission, label);
  requireRevision(submission.revision, `${label}.revision`);
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
      && left.every((entry, index) => equalJsonSafe(entry, right[index]));
  }
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key) => Object.hasOwn(right, key)
      && equalJsonSafe(left[key], right[key]));
}

function validateRuleResults(results, references) {
  if (results.length !== references.rules.length) {
    throw new TypeError(
      `sessionState.ruleResults must contain exactly ${references.rules.length} results in definition order`,
    );
  }
  results.forEach((result, index) => {
    const label = `sessionState.ruleResults[${index}]`;
    requireExactKeys(result, RULE_RESULT_KEYS, label);
    requireNonemptyString(result.id, `${label}.id`);
    requireNonemptyString(result.label, `${label}.label`);
    if (typeof result.critical !== 'boolean') throw new TypeError(`${label}.critical must be a boolean`);
    requireNonemptyString(result.source, `${label}.source`);
    const expectedRule = references.rules[index];
    if (result.id !== expectedRule.id
      || result.label !== expectedRule.label
      || result.critical !== expectedRule.critical
      || result.source !== expectedRule.source
      || !equalJsonSafe(result.evidence, expectedRule.evidence)) {
      throw new TypeError(
        `${label} with id ${result.id} must match definition rule ${expectedRule.id} in definition order`,
      );
    }
    if (!['pending', 'performed', 'not_performed'].includes(result.status)) {
      throw new TypeError(`${label}.status is unsupported`);
    }
    if (result.points !== null
      && (typeof result.points !== 'number' || !Number.isFinite(result.points))) {
      throw new TypeError(`${label}.points must be null or a finite number`);
    }
    requirePlainObject(result.evidence, `${label}.evidence`);
    requireTimestamp(result.updatedAtSec, `${label}.updatedAtSec`, { nullable: true });
  });
}

function validateObservation(record, label, references) {
  requireExactKeys(record, OBSERVATION_KEYS, label);
  if (!references.considerations.has(record.considerationId)) {
    throw new TypeError(`${label}.considerationId references unknown consideration ${record.considerationId}`);
  }
  if (!OBSERVATION_STATUSES.includes(record.status)) {
    throw new TypeError(`${label}.status is unsupported`);
  }
  if (typeof record.note !== 'string') throw new TypeError(`${label}.note must be a string`);
  validateRecordPosition(record, label);
  requireRevision(record.revision, `${label}.revision`);
}

function validateObservations(records, label, references, { unique = false } = {}) {
  const seen = new Set();
  records.forEach((record, index) => {
    validateObservation(record, `${label}[${index}]`, references);
    if (unique && seen.has(record.considerationId)) {
      throw new TypeError(`${label} contains duplicate consideration id ${record.considerationId}`);
    }
    seen.add(record.considerationId);
  });
}

function validateFeedbackHistory(records, references) {
  records.forEach((record, index) => {
    const label = `sessionState.feedbackRevealHistory[${index}]`;
    requireExactKeys(record, FEEDBACK_HISTORY_KEYS, label);
    if (!references.considerations.has(record.considerationId)) {
      throw new TypeError(`${label}.considerationId references unknown consideration ${record.considerationId}`);
    }
    if (typeof record.reveal !== 'boolean') throw new TypeError(`${label}.reveal must be a boolean`);
    validateRecordPosition(record, label);
    requireRevision(record.revision, `${label}.revision`);
  });
}

function validateOptionalRecordReferences(record, label, references) {
  for (const [key, map, kind] of [
    ['actionId', references.actions, 'action'],
    ['findingId', references.findings, 'finding'],
    ['considerationId', references.considerations, 'consideration'],
    ['phaseId', references.phases, 'phase'],
    ['fromPhaseId', references.phases, 'phase'],
    ['toPhaseId', references.phases, 'phase'],
    ['eventId', references.events, 'event'],
    ['branchId', references.branches, 'branch'],
  ]) {
    if (Object.hasOwn(record, key) && !map.has(record[key])) {
      throw new TypeError(`${label}.${key} references unknown ${kind} ${record[key]}`);
    }
  }
  for (const key of ['findingIds', 'revealedFindingIds']) {
    if (Object.hasOwn(record, key)) {
      requireKnownIds(record[key], `${label}.${key}`, references.findings, 'finding');
    }
  }
  for (const key of ['stage', 'fromStage', 'toStage']) {
    if (Object.hasOwn(record, key) && !CASE_STAGES.includes(record[key])) {
      throw new TypeError(`${label}.${key} is an unsupported case stage`);
    }
  }
  if (Object.hasOwn(record, 'selections')) {
    validatePlanSelections(record.selections, `${label}.selections`, references);
  }
}

function validateTimeline(records, references) {
  records.forEach((record, index) => {
    const label = `sessionState.timeline[${index}]`;
    requirePlainObject(record, label);
    requireNonemptyString(record.kind, `${label}.kind`);
    validateRecordPosition(record, label);
    validateOptionalRecordReferences(record, label, references);
  });
}

function equalStringArrays(left, right) {
  return left.length === right.length && left.every((entry, index) => entry === right[index]);
}

function validateAssessmentEvidence(sessionState, references) {
  const recordsByActionId = new Map();
  const recordSequences = new Set();
  for (const record of sessionState.assessmentRecords) {
    if (recordsByActionId.has(record.actionId)) {
      throw new TypeError(
        `sessionState.assessmentRecords contains duplicate action record ${record.actionId}`,
      );
    }
    if (recordSequences.has(record.sequence)) {
      throw new TypeError(
        `sessionState.assessmentRecords contains duplicate sequence ${record.sequence}`,
      );
    }
    recordsByActionId.set(record.actionId, record);
    recordSequences.add(record.sequence);
  }

  const completedActionIds = new Set(sessionState.completedActionIds);
  if (completedActionIds.size !== recordsByActionId.size
    || [...completedActionIds].some((id) => !recordsByActionId.has(id))) {
    throw new TypeError(
      'sessionState.completedActionIds must equal the unique action IDs in assessmentRecords',
    );
  }

  const orderedRecords = [...sessionState.assessmentRecords]
    .sort((left, right) => left.sequence - right.sequence || left.tSec - right.tSec);
  const accumulatedFindingIds = new Set();
  for (const record of orderedRecords) {
    const action = references.actions.get(record.actionId);
    for (const prerequisiteId of action.prerequisites) {
      const prerequisite = recordsByActionId.get(prerequisiteId);
      if (!prerequisite) {
        throw new TypeError(
          `assessment action ${action.id} is missing completed prerequisite ${prerequisiteId}`,
        );
      }
      if (prerequisite.sequence >= record.sequence || prerequisite.tSec > record.tSec) {
        throw new TypeError(
          `assessment action ${action.id} must occur after prerequisite ${prerequisiteId}`,
        );
      }
    }

    const declaredRevealIds = new Set(action.reveals);
    const expectedNewFindingIds = [...references.findings.values()]
      .filter((finding) => declaredRevealIds.has(finding.id)
        && !accumulatedFindingIds.has(finding.id))
      .map(({ id }) => id);
    if (!equalStringArrays(record.revealedFindingIds, expectedNewFindingIds)) {
      throw new TypeError(
        `assessment record ${action.id}.revealedFindingIds must equal newly declared action reveals in definition order`,
      );
    }
    for (const findingId of record.revealedFindingIds) accumulatedFindingIds.add(findingId);
  }

  const expectedDiscoveredFindingIds = [...references.findings.values()]
    .filter(({ id }) => accumulatedFindingIds.has(id))
    .map(({ id }) => id);
  if (!equalStringArrays(sessionState.discoveredFindingIds, expectedDiscoveredFindingIds)) {
    throw new TypeError(
      'sessionState.discoveredFindingIds must equal assessment record reveals in definition order',
    );
  }

  const assessmentTimeline = sessionState.timeline.filter(
    ({ kind }) => kind === 'assessment_action',
  );
  if (assessmentTimeline.length !== sessionState.assessmentRecords.length) {
    throw new TypeError(
      'sessionState.assessmentRecords must have one matching assessment action timeline record each',
    );
  }
  for (const record of sessionState.assessmentRecords) {
    const matchingTimelineRecords = assessmentTimeline.filter((entry) => (
      entry.actionId === record.actionId
      && entry.tSec === record.tSec
      && entry.sequence === record.sequence
      && entry.stage === record.stage
      && equalStringArrays(entry.revealedFindingIds, record.revealedFindingIds)
    ));
    if (matchingTimelineRecords.length !== 1) {
      throw new TypeError(
        `sessionState.assessmentRecords action ${record.actionId} must match its canonical timeline record`,
      );
    }
  }
}

function requireCanonicalTimelineRecord(sessionState, record, kind, label) {
  const matches = sessionState.timeline.filter((entry) => (
    entry.kind === kind
    && entry.sequence === record.sequence
    && Object.keys(record).every((key) => equalJsonSafe(entry[key], record[key]))
  ));
  if (matches.length !== 1) {
    throw new TypeError(`${label} must match exactly one canonical ${kind} timeline record`);
  }
}

function validateContiguousHistory(records, label, keyForRecord = () => 'all') {
  const revisionsByKey = new Map();
  let priorSequence = 0;
  records.forEach((record, index) => {
    if (record.sequence <= priorSequence) {
      throw new TypeError(`${label} must be stored in strictly increasing sequence order`);
    }
    priorSequence = record.sequence;
    const key = keyForRecord(record);
    const expectedRevision = (revisionsByKey.get(key) ?? 0) + 1;
    if (record.revision !== expectedRevision) {
      throw new TypeError(
        `${label}[${index}].revision must be contiguous from 1 for ${key}`,
      );
    }
    revisionsByKey.set(key, expectedRevision);
  });
}

function requireCurrentEqualsLatest(current, history, label) {
  if (history.length === 0) {
    if (current !== null) {
      throw new TypeError(`sessionState.${label} must be null without ${label}History`);
    }
    return;
  }
  if (current === null || !equalJsonSafe(current, history.at(-1))) {
    throw new TypeError(`sessionState.${label} must equal its latest history entry`);
  }
}

function validateSubmissionEvidence(sessionState, references) {
  validateContiguousHistory(
    sessionState.findingsSubmissionHistory,
    'sessionState.findingsSubmissionHistory',
  );
  requireCurrentEqualsLatest(
    sessionState.findingsSubmission,
    sessionState.findingsSubmissionHistory,
    'findingsSubmission',
  );

  const initiallyAvailableIds = new Set([...references.findings.values()]
    .filter(({ initiallyVisible }) => initiallyVisible)
    .map(({ id }) => id));
  for (const [index, submission] of sessionState.findingsSubmissionHistory.entries()) {
    const availableIds = new Set(initiallyAvailableIds);
    sessionState.assessmentRecords
      .filter((record) => record.sequence < submission.sequence)
      .forEach((record) => record.revealedFindingIds
        .forEach((findingId) => availableIds.add(findingId)));
    const unavailableId = submission.findingIds.find((id) => !availableIds.has(id));
    if (unavailableId !== undefined) {
      throw new TypeError(
        `sessionState.findingsSubmissionHistory[${index}] finding ${unavailableId} was not available at submission sequence`,
      );
    }
    requireCanonicalTimelineRecord(
      sessionState,
      submission,
      'findings_submission',
      `sessionState.findingsSubmissionHistory[${index}]`,
    );
  }

  validateContiguousHistory(
    sessionState.planSubmissionHistory,
    'sessionState.planSubmissionHistory',
  );
  requireCurrentEqualsLatest(
    sessionState.planSubmission,
    sessionState.planSubmissionHistory,
    'planSubmission',
  );
  sessionState.planSubmissionHistory.forEach((submission, index) => {
    requireCanonicalTimelineRecord(
      sessionState,
      submission,
      'plan_submission',
      `sessionState.planSubmissionHistory[${index}]`,
    );
  });
}

function validateInstructorEvidence(sessionState, references) {
  validateContiguousHistory(
    sessionState.instructorObservationHistory,
    'sessionState.instructorObservationHistory',
    ({ considerationId }) => considerationId,
  );
  const latestObservations = new Map();
  sessionState.instructorObservationHistory.forEach((observation, index) => {
    latestObservations.set(observation.considerationId, observation);
    requireCanonicalTimelineRecord(
      sessionState,
      observation,
      'instructor_observation',
      `sessionState.instructorObservationHistory[${index}]`,
    );
  });
  const expectedObservations = [...references.considerations.values()]
    .filter(({ id }) => latestObservations.has(id))
    .map(({ id }) => latestObservations.get(id));
  if (!equalJsonSafe(sessionState.instructorObservations, expectedObservations)) {
    throw new TypeError(
      'sessionState.instructorObservations must equal the latest history entry for each consideration',
    );
  }

  validateContiguousHistory(
    sessionState.feedbackRevealHistory,
    'sessionState.feedbackRevealHistory',
    ({ considerationId }) => considerationId,
  );
  const currentRevealIds = new Set([...references.considerations.values()]
    .filter(({ defaultRevealInDebrief }) => defaultRevealInDebrief)
    .map(({ id }) => id));
  sessionState.feedbackRevealHistory.forEach((history, index) => {
    if (history.reveal) currentRevealIds.add(history.considerationId);
    else currentRevealIds.delete(history.considerationId);
    requireCanonicalTimelineRecord(
      sessionState,
      history,
      'feedback_reveal',
      `sessionState.feedbackRevealHistory[${index}]`,
    );
  });
  const expectedRevealIds = [...references.considerations.values()]
    .filter(({ id }) => currentRevealIds.has(id))
    .map(({ id }) => id);
  if (!equalStringArrays(sessionState.feedbackRevealIds, expectedRevealIds)) {
    throw new TypeError(
      'sessionState.feedbackRevealIds must equal the latest reveal history state',
    );
  }
}

function validateRevisions(records, sessionState) {
  records.forEach((record, index) => {
    const label = `sessionState.revisions[${index}]`;
    requireExactKeys(record, REVISION_KEYS, label);
    requireRevision(record.revision, `${label}.revision`);
    validateRecordPosition(record, label);
    requireCanonicalTimelineRecord(sessionState, record, 'revision_started', label);
  });
  validateContiguousHistory(records, 'sessionState.revisions');
}

function validateAggregateChronology(sessionState, flowState) {
  let previousTimeSec = 0;
  sessionState.timeline.forEach((record, index) => {
    const expectedSequence = index + 1;
    if (record.sequence !== expectedSequence) {
      throw new TypeError(
        'sessionState.timeline sequence values must be unique, strict, and contiguous from 1',
      );
    }
    if (record.tSec < previousTimeSec) {
      throw new TypeError('sessionState.timeline tSec values must be nondecreasing');
    }
    previousTimeSec = record.tSec;
  });

  if (sessionState.sequence !== sessionState.timeline.length) {
    throw new TypeError('sessionState.sequence must equal the maximum canonical timeline sequence');
  }
  const timelineTimeSec = sessionState.timeline.at(-1)?.tSec ?? 0;
  const otherTimes = [
    sessionState.finalizedAtSec,
    ...sessionState.ruleResults.map(({ updatedAtSec }) => updatedAtSec),
    ...sessionState.assessmentRecords.map(({ tSec }) => tSec),
    ...sessionState.findingsSubmissionHistory.map(({ tSec }) => tSec),
    ...sessionState.planSubmissionHistory.map(({ tSec }) => tSec),
    ...sessionState.instructorObservationHistory.map(({ tSec }) => tSec),
    ...sessionState.feedbackRevealHistory.map(({ tSec }) => tSec),
    ...sessionState.revisions.map(({ tSec }) => tSec),
  ].filter((value) => value !== null);
  const maximumRecordedTimeSec = Math.max(timelineTimeSec, ...otherTimes, 0);
  if (sessionState.currentTimeSec < maximumRecordedTimeSec) {
    throw new TypeError(
      'sessionState.currentTimeSec must be at or after every recorded canonical time',
    );
  }
  const reconciledTimeSec = flowState === null
    ? sessionState.currentTimeSec
    : Math.max(maximumRecordedTimeSec, flowState.currentTimeSec);
  if (flowState !== null && sessionState.currentTimeSec !== reconciledTimeSec) {
    throw new TypeError(
      'sessionState.currentTimeSec must reconcile canonical record and flowState times',
    );
  }
}

function copyAndValidateSessionState(sessionState, references, flowState = null) {
  if (!isPlainObject(sessionState)) throw new TypeError('sessionState must be a plain object');

  const copied = copyCaseData(sessionState, 'sessionState');
  if (!CASE_STAGES.includes(copied.stage)) {
    throw new TypeError(`sessionState.stage is an unknown or unsupported case stage: ${copied.stage}`);
  }
  requireSequence(copied.sequence, 'sessionState.sequence');
  requireTimestamp(copied.currentTimeSec, 'sessionState.currentTimeSec');
  if (typeof copied.active !== 'boolean') {
    throw new TypeError('sessionState.active must be a boolean');
  }
  if (typeof copied.finalized !== 'boolean') {
    throw new TypeError('sessionState.finalized must be a boolean');
  }
  if (copied.outcome !== null
    && !['completed', 'appropriately_deferred'].includes(copied.outcome)) {
    throw new TypeError('sessionState.outcome must be null, completed, or appropriately_deferred');
  }
  requireTimestamp(copied.finalizedAtSec, 'sessionState.finalizedAtSec', { nullable: true });
  if (copied.finalized && copied.finalizedAtSec === null) {
    throw new TypeError('sessionState.finalizedAtSec is required when finalized');
  }
  for (const key of SESSION_ARRAY_KEYS) {
    requireOrdinaryArray(copied[key], `sessionState.${key}`);
  }
  requireKnownIds(
    copied.completedActionIds,
    'sessionState.completedActionIds',
    references.actions,
    'completed action',
  );
  requireKnownIds(
    copied.discoveredFindingIds,
    'sessionState.discoveredFindingIds',
    references.findings,
    'discovered finding',
  );
  validateAssessmentRecords(copied.assessmentRecords, references);

  if (copied.findingsSubmission !== null) {
    validateFindingsSubmission(copied.findingsSubmission, 'sessionState.findingsSubmission', references);
  }
  copied.findingsSubmissionHistory.forEach((submission, index) => {
    validateFindingsSubmission(
      submission,
      `sessionState.findingsSubmissionHistory[${index}]`,
      references,
    );
  });
  if (copied.planSubmission !== null) {
    validatePlanSubmission(copied.planSubmission, 'sessionState.planSubmission', references);
  }
  copied.planSubmissionHistory.forEach((submission, index) => {
    validatePlanSubmission(submission, `sessionState.planSubmissionHistory[${index}]`, references);
  });
  validateRuleResults(copied.ruleResults, references);
  validateObservations(
    copied.instructorObservations,
    'sessionState.instructorObservations',
    references,
    { unique: true },
  );
  validateObservations(
    copied.instructorObservationHistory,
    'sessionState.instructorObservationHistory',
    references,
  );
  requireKnownIds(
    copied.feedbackRevealIds,
    'sessionState.feedbackRevealIds',
    references.considerations,
    'consideration',
  );
  validateFeedbackHistory(copied.feedbackRevealHistory, references);
  validateTimeline(copied.timeline, references);
  validateAssessmentEvidence(copied, references);
  validateAggregateChronology(copied, flowState);
  validateSubmissionEvidence(copied, references);
  validateInstructorEvidence(copied, references);
  validateRevisions(copied.revisions, copied);
  return copied;
}

function copyAndValidateFlowState(flowState, references) {
  if (flowState === null) return null;
  if (!isPlainObject(flowState)) {
    throw new TypeError('flowState must be null or a plain object');
  }

  const copied = copyCaseData(flowState, 'flowState');
  requireNonemptyString(copied.currentPhaseId, 'flowState.currentPhaseId');
  const phase = references.phases.get(copied.currentPhaseId);
  if (!phase) {
    throw new TypeError(`flowState.currentPhaseId references unknown phase ${copied.currentPhaseId}`);
  }
  if (typeof copied.paused !== 'boolean') {
    throw new TypeError('flowState.paused must be a boolean');
  }
  requireTimestamp(copied.currentTimeSec, 'flowState.currentTimeSec');
  requireKnownIds(copied.activeEventIds, 'flowState.activeEventIds', references.events, 'event');
  for (const eventId of copied.activeEventIds) {
    if (references.events.get(eventId).phaseId !== phase.id) {
      throw new TypeError(`flowState.activeEventIds event ${eventId} does not belong to current phase ${phase.id}`);
    }
  }
  requireKnownIds(
    copied.availableBranchIds,
    'flowState.availableBranchIds',
    references.branches,
    'branch',
  );
  for (const branchId of copied.availableBranchIds) {
    if (references.branches.get(branchId).fromPhaseId !== phase.id) {
      throw new TypeError(`flowState.availableBranchIds branch ${branchId} is not from current phase ${phase.id}`);
    }
  }
  if (copied.availableBranchIds.length > 0 && copied.paused) {
    throw new TypeError('flowState.availableBranchIds must be empty while flowState.paused is true');
  }
  if (copied.availableBranchIds.length > 0
    && !phase.allowedInstructorControls.includes('activate_branch')) {
    throw new TypeError(
      'flowState.availableBranchIds requires the current phase activate_branch control',
    );
  }
  requireOrdinaryArray(copied.responseDeadlines, 'flowState.responseDeadlines');
  const deadlineSequences = new Set();
  copied.responseDeadlines.forEach((deadline, index) => {
    const label = `flowState.responseDeadlines[${index}]`;
    requirePlainObject(deadline, label);
    const event = references.events.get(deadline.eventId);
    if (!event) throw new TypeError(`${label}.eventId references unknown event ${deadline.eventId}`);
    if (event.phaseId !== phase.id) {
      throw new TypeError(`${label}.eventId does not belong to current phase ${phase.id}`);
    }
    if (!copied.activeEventIds.includes(deadline.eventId)) {
      throw new TypeError(`${label}.eventId must also appear in flowState.activeEventIds`);
    }
    if (!Number.isSafeInteger(deadline.activationSequence)
      || deadline.activationSequence < 1) {
      throw new TypeError(`${label}.activationSequence must be a positive safe integer`);
    }
    if (deadlineSequences.has(deadline.activationSequence)) {
      throw new TypeError(
        `flowState.responseDeadlines contains duplicate activationSequence ${deadline.activationSequence}`,
      );
    }
    deadlineSequences.add(deadline.activationSequence);
    requireTimestamp(deadline.activatedAtSec, `${label}.activatedAtSec`);
    requireTimestamp(deadline.responseDeadlineSec, `${label}.responseDeadlineSec`);
    if (deadline.activatedAtSec > copied.currentTimeSec) {
      throw new TypeError(`${label}.activatedAtSec must not exceed flowState.currentTimeSec`);
    }
    if (deadline.responseDeadlineSec < deadline.activatedAtSec) {
      throw new TypeError(`${label}.responseDeadlineSec must not be before activatedAtSec`);
    }
  });
  requireOrdinaryArray(copied.history, 'flowState.history');
  copied.history.forEach((record, index) => {
    const label = `flowState.history[${index}]`;
    requirePlainObject(record, label);
    validateOptionalRecordReferences(record, label, references);
  });
  copied.responseDeadlines.forEach((deadline, index) => {
    const hasActivationHistory = copied.history.some((record) => (
      record.kind === 'event_activated'
      && record.eventId === deadline.eventId
      && record.sequence === deadline.activationSequence
      && record.tSec === deadline.activatedAtSec
    ));
    if (!hasActivationHistory) {
      throw new TypeError(
        `flowState.responseDeadlines[${index}] must reference matching activation history`,
      );
    }
  });
  copied.currentPhaseTitle = phase.title;
  return copied;
}

function createProjectionInputs({ definition, sessionState, flowState }) {
  const copiedDefinition = normalizeProjectionDefinition(definition);
  const references = createDefinitionReferences(copiedDefinition);
  const copiedFlowState = copyAndValidateFlowState(flowState, references);
  const copiedSessionState = copyAndValidateSessionState(
    sessionState,
    references,
    copiedFlowState,
  );
  return {
    definition: copiedDefinition,
    sessionState: copiedSessionState,
    flowState: copiedFlowState,
  };
}

function createLearnerActions(definition, sessionState) {
  const completedIds = new Set(sessionState.completedActionIds);
  return definition.assessment.actions
    .filter((action) => completedIds.has(action.id)
      || (action.stage === sessionState.stage
        && action.prerequisites.every((id) => completedIds.has(id))))
    .map((action) => {
      const completed = completedIds.has(action.id);
      const projected = {
        id: action.id,
        stage: action.stage,
        domain: action.domain,
        prompt: action.prompt,
        completed,
      };
      if (completed) projected.response = action.response;
      return projected;
    });
}

function createLearnerFindings(definition, sessionState) {
  const discoveredIds = new Set(sessionState.discoveredFindingIds);
  return definition.assessment.findings
    // Honor instructorOnlyUntilDiscovered as a hard gate: a finding reaches the
    // learner only once discovered, or if it is chart-visible AND not marked
    // instructor-only. The contract already rejects the contradictory pair;
    // this is defense in depth if a definition reaches here unvalidated.
    .filter((finding) => discoveredIds.has(finding.id)
      || (finding.initiallyVisible && !finding.instructorOnlyUntilDiscovered))
    .map((finding) => {
      const discovered = discoveredIds.has(finding.id);
      const projected = {
        id: finding.id,
        learnerLabel: finding.learnerLabel,
        discovered,
        initiallyVisible: finding.initiallyVisible,
      };
      if (discovered) projected.significance = finding.significance;
      return projected;
    });
}

function createLearnerAssessmentRecords(records) {
  return records.map((record) => {
    const projected = {};
    for (const key of LEARNER_RECORD_KEYS) {
      if (Object.hasOwn(record, key)) projected[key] = record[key];
    }
    return projected;
  });
}

function createLearnerPlanFields(definition) {
  return definition.planRequirements.fields.map((field) => ({
    id: field.id,
    type: field.type,
    required: field.required,
    options: field.options,
  }));
}

function createLearnerSubmission(submission, allowedKeys) {
  if (submission === null) return null;
  const projected = {};
  for (const key of allowedKeys) {
    if (Object.hasOwn(submission, key)) projected[key] = submission[key];
  }
  return projected;
}

function createLearnerFlowState(flowState) {
  if (flowState === null) return null;
  const projected = {};
  for (const key of ['currentPhaseTitle', 'paused']) {
    if (Object.hasOwn(flowState, key)) projected[key] = flowState[key];
  }
  return projected;
}

function createCurrentConsiderations(definition, flowState) {
  if (flowState === null) return definition.instructorGuide.considerations;

  const hasPhase = Object.hasOwn(flowState, 'currentPhaseId');
  const hasActiveEvents = Object.hasOwn(flowState, 'activeEventIds');
  const activeEventIds = new Set(hasActiveEvents ? flowState.activeEventIds : []);
  return definition.instructorGuide.considerations.filter((consideration) => (
    (!hasPhase || consideration.phaseId === flowState.currentPhaseId)
    && (!hasActiveEvents || activeEventIds.has(consideration.eventId))
  ));
}

function finalizeProjection(value, label) {
  return freezeRecursively(copyCaseData(value, label));
}

export function projectLearnerCase({ definition, sessionState, flowState = null }) {
  const inputs = createProjectionInputs({ definition, sessionState, flowState });
  const { definition: safeDefinition, sessionState: safeState } = inputs;

  return finalizeProjection({
    active: safeState.active,
    stage: safeState.stage,
    finalized: safeState.finalized,
    outcome: safeState.outcome,
    learnerChart: safeDefinition.learnerChart,
    surgery: {
      procedure: safeDefinition.surgery.procedure,
      indication: safeDefinition.surgery.indication,
      position: safeDefinition.surgery.position,
      expectedDurationMin: safeDefinition.surgery.expectedDurationMin,
      expectedStimulation: safeDefinition.surgery.expectedStimulation,
      bloodLossRisk: safeDefinition.surgery.bloodLossRisk,
    },
    assessmentStages: safeDefinition.assessment.stages,
    planFields: createLearnerPlanFields(safeDefinition),
    actions: createLearnerActions(safeDefinition, safeState),
    discoveredFindings: createLearnerFindings(safeDefinition, safeState),
    assessmentRecords: createLearnerAssessmentRecords(safeState.assessmentRecords),
    findingsSubmission: createLearnerSubmission(
      safeState.findingsSubmission,
      ['findingIds', 'notes', 'tSec', 'sequence'],
    ),
    planSubmission: createLearnerSubmission(
      safeState.planSubmission,
      ['selections', 'rationale', 'tSec', 'sequence'],
    ),
    flowState: createLearnerFlowState(inputs.flowState),
  }, 'learner case projection');
}

export function projectInstructorCase({ definition, sessionState, flowState = null }) {
  const inputs = createProjectionInputs({ definition, sessionState, flowState });
  const { definition: safeDefinition, sessionState: safeState } = inputs;

  return finalizeProjection({
    active: safeState.active,
    stage: safeState.stage,
    sequence: safeState.sequence,
    currentTimeSec: safeState.currentTimeSec,
    finalized: safeState.finalized,
    finalizedAtSec: safeState.finalizedAtSec,
    outcome: safeState.outcome,
    learnerChart: safeDefinition.learnerChart,
    assessment: safeDefinition.assessment,
    planRequirements: safeDefinition.planRequirements,
    surgery: safeDefinition.surgery,
    eventFlow: safeDefinition.eventFlow,
    instructorGuide: safeDefinition.instructorGuide,
    debrief: safeDefinition.debrief,
    completedActionIds: safeState.completedActionIds,
    assessmentRecords: safeState.assessmentRecords,
    discoveredFindingIds: safeState.discoveredFindingIds,
    findingsSubmission: safeState.findingsSubmission,
    findingsSubmissionHistory: safeState.findingsSubmissionHistory,
    planSubmission: safeState.planSubmission,
    planSubmissionHistory: safeState.planSubmissionHistory,
    ruleResults: safeState.ruleResults,
    instructorObservations: safeState.instructorObservations,
    instructorObservationHistory: safeState.instructorObservationHistory,
    feedbackRevealIds: safeState.feedbackRevealIds,
    feedbackRevealHistory: safeState.feedbackRevealHistory,
    timeline: safeState.timeline,
    revisions: safeState.revisions,
    flowState: inputs.flowState,
    considerations: createCurrentConsiderations(safeDefinition, inputs.flowState),
  }, 'instructor case projection');
}
