import { copyCaseData } from './caseContract.js';

const REQUIRED_DEFINITION_SECTIONS = Object.freeze([
  'learnerChart',
  'assessment',
  'planRequirements',
  'surgery',
  'eventFlow',
  'instructorGuide',
  'debrief',
]);

const SESSION_ARRAY_KEYS = Object.freeze([
  'completedActionIds',
  'assessmentRecords',
  'discoveredFindingIds',
  'ruleResults',
  'instructorObservations',
  'feedbackRevealIds',
  'revisions',
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

function copyNormalizedDefinition(definition) {
  if (!isPlainObject(definition)
    || !Object.isFrozen(definition)
    || definition.version !== 1
    || REQUIRED_DEFINITION_SECTIONS.some(
      (key) => !isPlainObject(definition[key]) || !Object.isFrozen(definition[key]),
    )) {
    throw new TypeError('definition must be a normalized frozen case definition object');
  }

  try {
    return copyCaseData(definition, 'normalized case definition');
  } catch (error) {
    throw new TypeError(`definition must be a normalized case definition: ${error.message}`);
  }
}

function copyAndValidateSessionState(sessionState) {
  if (!isPlainObject(sessionState)) {
    throw new TypeError('sessionState must be a plain object');
  }

  const copied = copyCaseData(sessionState, 'sessionState');
  if (typeof copied.stage !== 'string' || copied.stage.trim().length === 0) {
    throw new TypeError('sessionState.stage must be a nonempty string');
  }
  if (!Number.isInteger(copied.sequence) || copied.sequence < 0) {
    throw new TypeError('sessionState.sequence must be a nonnegative integer');
  }
  if (typeof copied.active !== 'boolean') {
    throw new TypeError('sessionState.active must be a boolean');
  }
  if (typeof copied.finalized !== 'boolean') {
    throw new TypeError('sessionState.finalized must be a boolean');
  }
  if (copied.outcome !== null
    && (typeof copied.outcome !== 'string' || copied.outcome.trim().length === 0)) {
    throw new TypeError('sessionState.outcome must be null or a nonempty string');
  }
  for (const key of SESSION_ARRAY_KEYS) {
    requireOrdinaryArray(copied[key], `sessionState.${key}`);
  }
  requireStringIds(copied.completedActionIds, 'sessionState.completedActionIds');
  requireStringIds(copied.discoveredFindingIds, 'sessionState.discoveredFindingIds');

  for (const key of ['findingsSubmission', 'planSubmission']) {
    if (copied[key] !== null && !isPlainObject(copied[key])) {
      throw new TypeError(`sessionState.${key} must be null or a plain object`);
    }
  }

  copied.assessmentRecords.forEach((record, index) => {
    if (!isPlainObject(record)) {
      throw new TypeError(`sessionState.assessmentRecords[${index}] must be a plain object`);
    }
  });
  return copied;
}

function copyAndValidateFlowState(flowState) {
  if (flowState === null) return null;
  if (!isPlainObject(flowState)) {
    throw new TypeError('flowState must be null or a plain object');
  }

  const copied = copyCaseData(flowState, 'flowState');
  for (const key of ['currentPhaseId', 'currentPhaseTitle']) {
    if (Object.hasOwn(copied, key)
      && (typeof copied[key] !== 'string' || copied[key].trim().length === 0)) {
      throw new TypeError(`flowState.${key} must be a nonempty string`);
    }
  }
  if (Object.hasOwn(copied, 'paused') && typeof copied.paused !== 'boolean') {
    throw new TypeError('flowState.paused must be a boolean');
  }
  for (const key of ['activeEventIds', 'availableBranchIds']) {
    if (Object.hasOwn(copied, key)) requireStringIds(copied[key], `flowState.${key}`);
  }
  for (const key of ['responseDeadlines', 'history']) {
    if (Object.hasOwn(copied, key)) requireOrdinaryArray(copied[key], `flowState.${key}`);
  }
  return copied;
}

function validateKnownSessionIds(definition, sessionState) {
  const actionIds = new Set(definition.assessment.actions.map(({ id }) => id));
  for (const id of sessionState.completedActionIds) {
    if (!actionIds.has(id)) {
      throw new TypeError(`sessionState.completedActionIds contains unknown completed action id ${id}`);
    }
  }

  const findingIds = new Set(definition.assessment.findings.map(({ id }) => id));
  for (const id of sessionState.discoveredFindingIds) {
    if (!findingIds.has(id)) {
      throw new TypeError(
        `sessionState.discoveredFindingIds contains unknown discovered finding id ${id}`,
      );
    }
  }
}

function createProjectionInputs({ definition, sessionState, flowState }) {
  const copiedDefinition = copyNormalizedDefinition(definition);
  const copiedSessionState = copyAndValidateSessionState(sessionState);
  const copiedFlowState = copyAndValidateFlowState(flowState);
  validateKnownSessionIds(copiedDefinition, copiedSessionState);
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
    .filter((finding) => finding.initiallyVisible || discoveredIds.has(finding.id))
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
  for (const key of ['currentPhaseId', 'currentPhaseTitle', 'paused']) {
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
    finalized: safeState.finalized,
    outcome: safeState.outcome,
    learnerChart: safeDefinition.learnerChart,
    assessment: safeDefinition.assessment,
    planRequirements: safeDefinition.planRequirements,
    surgery: safeDefinition.surgery,
    instructorGuide: safeDefinition.instructorGuide,
    completedActionIds: safeState.completedActionIds,
    assessmentRecords: safeState.assessmentRecords,
    discoveredFindingIds: safeState.discoveredFindingIds,
    findingsSubmission: safeState.findingsSubmission,
    planSubmission: safeState.planSubmission,
    ruleResults: safeState.ruleResults,
    instructorObservations: safeState.instructorObservations,
    feedbackRevealIds: safeState.feedbackRevealIds,
    revisions: safeState.revisions,
    flowState: inputs.flowState,
    considerations: createCurrentConsiderations(safeDefinition, inputs.flowState),
  }, 'instructor case projection');
}
