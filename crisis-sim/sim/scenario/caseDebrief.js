/* Strict additive composition of finalized preanesthesia case evidence onto a
   SimulationResult. The case result is derived only from a finalized CaseSession
   result and its normalized definition; instructor-only guidance never reaches
   the learner-visible debrief unless the instructor explicitly released it. */
import { copyCaseData } from './caseContract.js';

export const CASE_TIMELINE_SOURCES = Object.freeze([
  'learner',
  'instructor',
  'scenario',
  'administrative',
]);

const CASE_OUTCOMES = Object.freeze(['completed', 'appropriately_deferred']);

/* Every timeline kind CaseSession can append must map to exactly one source so
   an unlabelled record can never silently reach the debrief. */
const TIMELINE_SOURCE_BY_KIND = Object.freeze({
  assessment_action: 'learner',
  findings_submission: 'learner',
  plan_submission: 'learner',
  live_action: 'learner',
  instructor_observation: 'instructor',
  feedback_reveal: 'instructor',
  case_flow_event_activated: 'scenario',
  case_flow_branch_activated: 'scenario',
  case_flow_phase_advanced: 'scenario',
  stage_transition: 'administrative',
  case_finalized: 'administrative',
  revision_started: 'administrative',
});

/* Learner-facing teaching fields only. scoringGuidance and redFlags stay
   instructor-only even once a consideration is released. */
const RELEASED_FEEDBACK_FIELDS = Object.freeze([
  'title',
  'consideration',
  'expectedResponse',
]);

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

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function deepFreeze(value) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const name of Object.getOwnPropertyNames(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, name);
    if (descriptor && Object.hasOwn(descriptor, 'value')) deepFreeze(descriptor.value);
  }
  return Object.freeze(value);
}

function requireString(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${label} must be a nonempty string`);
  }
}

function requireFinite(value, label, { min = -Infinity } = {}) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min) {
    throw new TypeError(`${label} must be a finite number of at least ${min}`);
  }
}

function requireArray(value, label) {
  if (!Array.isArray(value)) throw new TypeError(`${label} must be an array`);
  return value;
}

function validateBaseResult(baseResult) {
  if (!isPlainObject(baseResult)) throw new TypeError('baseResult must be a plain object');
  if (Object.hasOwn(baseResult, 'caseResult')) {
    throw new TypeError('baseResult already contains reserved field caseResult');
  }
  for (const field of BASE_STRING_FIELDS) {
    if (typeof baseResult[field] !== 'string') {
      throw new TypeError(`baseResult.${field} must be a string`);
    }
  }
  requireString(baseResult.scenarioId, 'baseResult.scenarioId');
  for (const field of BASE_NUMBER_FIELDS) {
    if (typeof baseResult[field] !== 'number' || !Number.isFinite(baseResult[field])) {
      throw new TypeError(`baseResult.${field} must be a finite number`);
    }
  }
  for (const field of BASE_ARRAY_FIELDS) {
    requireArray(baseResult[field], `baseResult.${field}`);
  }
}

function validateDefinition(caseDefinition) {
  if (!isPlainObject(caseDefinition)) {
    throw new TypeError('caseDefinition must be a normalized case experience object');
  }
  if (!isPlainObject(caseDefinition.assessment)
    || !isPlainObject(caseDefinition.instructorGuide)) {
    throw new TypeError('caseDefinition must include assessment and instructorGuide sections');
  }
  requireArray(caseDefinition.assessment.actions, 'caseDefinition.assessment.actions');
  requireArray(caseDefinition.assessment.findings, 'caseDefinition.assessment.findings');
  requireArray(
    caseDefinition.instructorGuide.considerations,
    'caseDefinition.instructorGuide.considerations',
  );
}

function validateFinalizedCaseSession(session) {
  if (!isPlainObject(session)) throw new TypeError('caseSessionResult must be a plain object');
  if (session.finalized !== true) {
    throw new TypeError('caseSessionResult must be a finalized case result');
  }
  if (session.active !== false) {
    throw new TypeError('a finalized caseSessionResult must not remain active');
  }
  if (!CASE_OUTCOMES.includes(session.outcome)) {
    throw new RangeError(`caseSessionResult.outcome must be one of ${CASE_OUTCOMES.join(', ')}`);
  }
  requireFinite(session.finalizedAtSec, 'caseSessionResult.finalizedAtSec', { min: 0 });
  for (const field of [
    'completedActionIds',
    'assessmentRecords',
    'discoveredFindingIds',
    'ruleResults',
    'instructorObservations',
    'feedbackRevealIds',
    'timeline',
    'revisions',
  ]) {
    requireArray(session[field], `caseSessionResult.${field}`);
  }
  if (session.planSubmission !== null && !isPlainObject(session.planSubmission)) {
    throw new TypeError('caseSessionResult.planSubmission must be null or a plain object');
  }
  if (session.findingsSubmission !== null && !isPlainObject(session.findingsSubmission)) {
    throw new TypeError('caseSessionResult.findingsSubmission must be null or a plain object');
  }
}

function validateTimeline(timeline) {
  let previousTime = -Infinity;
  let previousSequence = -Infinity;
  for (let index = 0; index < timeline.length; index += 1) {
    const record = timeline[index];
    if (!isPlainObject(record)) {
      throw new TypeError(`caseSessionResult.timeline[${index}] must be a plain object`);
    }
    requireString(record.kind, `caseSessionResult.timeline[${index}].kind`);
    requireFinite(record.tSec, `caseSessionResult.timeline[${index}].tSec`, { min: 0 });
    if (record.tSec < previousTime) {
      throw new RangeError('caseSessionResult.timeline must be chronological');
    }
    previousTime = record.tSec;
    if (!Number.isSafeInteger(record.sequence) || record.sequence <= previousSequence) {
      throw new RangeError('caseSessionResult.timeline sequence must strictly increase');
    }
    previousSequence = record.sequence;
    if (!Object.hasOwn(TIMELINE_SOURCE_BY_KIND, record.kind)) {
      throw new RangeError(`caseSessionResult.timeline[${index}].kind ${record.kind} has no debrief source`);
    }
  }
}

function validateReferences(session, definition) {
  const considerationIds = new Set(
    definition.instructorGuide.considerations.map(({ id }) => id),
  );
  for (const id of session.feedbackRevealIds) {
    requireString(id, 'caseSessionResult.feedbackRevealIds entry');
    if (!considerationIds.has(id)) {
      throw new RangeError(`caseSessionResult released unknown consideration ${id}`);
    }
  }
  for (const observation of session.instructorObservations) {
    if (!isPlainObject(observation)) {
      throw new TypeError('caseSessionResult.instructorObservations entries must be plain objects');
    }
    if (!considerationIds.has(observation.considerationId)) {
      throw new RangeError(
        `caseSessionResult observed unknown consideration ${observation.considerationId}`,
      );
    }
  }
  const actionIds = new Set(definition.assessment.actions.map(({ id }) => id));
  for (const id of session.completedActionIds) {
    if (!actionIds.has(id)) {
      throw new RangeError(`caseSessionResult completed unknown assessment action ${id}`);
    }
  }
  const findingIds = new Set(definition.assessment.findings.map(({ id }) => id));
  for (const id of session.discoveredFindingIds) {
    if (!findingIds.has(id)) {
      throw new RangeError(`caseSessionResult discovered unknown finding ${id}`);
    }
  }
}

function buildAssessment(session, definition) {
  const recordsByActionId = new Map(
    session.assessmentRecords.map((record) => [record.actionId, record]),
  );
  const completed = new Set(session.completedActionIds);
  const actions = definition.assessment.actions
    .filter(({ id }) => completed.has(id))
    .map((action) => {
      const record = recordsByActionId.get(action.id) ?? null;
      return {
        id: action.id,
        stage: action.stage,
        domain: action.domain,
        prompt: action.prompt,
        critical: action.critical,
        tSec: record === null ? null : record.tSec,
        sequence: record === null ? null : record.sequence,
        revealedFindingIds: record === null ? [] : [...record.revealedFindingIds],
      };
    });

  const discovered = new Set(session.discoveredFindingIds);
  const describeFinding = (finding) => ({
    id: finding.id,
    learnerLabel: finding.learnerLabel,
    significance: finding.significance,
  });
  const visible = (finding) => finding.initiallyVisible || discovered.has(finding.id);

  return {
    actions,
    discoveredFindings: definition.assessment.findings
      .filter((finding) => discovered.has(finding.id))
      .map(describeFinding),
    missedFindings: definition.assessment.findings
      .filter((finding) => !visible(finding))
      .map(describeFinding),
    findingsSubmission: session.findingsSubmission === null
      ? null
      : copyCaseData(session.findingsSubmission, 'findings submission'),
  };
}

function buildPlan(session) {
  const submission = session.planSubmission;
  return {
    selections: submission === null
      ? {}
      : copyCaseData(submission.selections, 'plan selections'),
    rationale: submission === null ? '' : submission.rationale,
    ruleResults: copyCaseData(session.ruleResults, 'plan rule results'),
  };
}

function buildReleasedFeedback(session, definition) {
  const released = new Set(session.feedbackRevealIds);
  const observationsById = new Map(
    session.instructorObservations.map((observation) => [observation.considerationId, observation]),
  );
  return definition.instructorGuide.considerations
    .filter(({ id }) => released.has(id))
    .map((consideration) => {
      const observation = observationsById.get(consideration.id) ?? null;
      const entry = { considerationId: consideration.id };
      for (const field of RELEASED_FEEDBACK_FIELDS) entry[field] = consideration[field];
      entry.status = observation === null ? null : observation.status;
      entry.note = observation === null ? '' : observation.note;
      return entry;
    });
}

export function buildCaseDebrief({ baseResult, caseSessionResult, caseDefinition } = {}) {
  validateBaseResult(baseResult);
  validateDefinition(caseDefinition);

  /* Copy before inspecting so a hostile or non-JSON-safe session result is
     rejected up front and later reads cannot observe mutating getters. */
  const session = copyCaseData(caseSessionResult, 'caseSessionResult');
  validateFinalizedCaseSession(session);
  validateTimeline(session.timeline);
  validateReferences(session, caseDefinition);

  const caseResult = deepFreeze({
    caseId: baseResult.scenarioId,
    outcome: session.outcome,
    finalizedAtSec: session.finalizedAtSec,
    assessment: buildAssessment(session, caseDefinition),
    plan: buildPlan(session),
    eventTimeline: session.timeline.map((record) => ({
      ...record,
      source: TIMELINE_SOURCE_BY_KIND[record.kind],
    })),
    instructorObservations: copyCaseData(
      session.instructorObservations,
      'instructor observations',
    ),
    releasedFeedback: buildReleasedFeedback(session, caseDefinition),
    revisions: copyCaseData(session.revisions, 'case revisions'),
  });

  return { ...baseResult, caseResult };
}
