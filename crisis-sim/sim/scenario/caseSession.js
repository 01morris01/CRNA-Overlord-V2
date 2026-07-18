import {
  CASE_STAGES,
  copyCaseData,
  normalizeCaseExperience,
} from './caseContract.js';
import {
  projectInstructorCase,
  projectLearnerCase,
} from './caseProjections.js';

export const CASE_OBSERVATION_STATUS = Object.freeze([
  'observed',
  'missed',
  'not_yet_evaluable',
]);

const REQUIRED_DEFINITION_SECTIONS = Object.freeze([
  'learnerChart',
  'assessment',
  'planRequirements',
  'surgery',
  'eventFlow',
  'instructorGuide',
  'debrief',
]);
const NEXT_STAGE = Object.freeze({
  chart_review: 'interview',
  interview: 'focused_exam',
  focused_exam: 'findings_summary',
  findings_summary: 'plan_submission',
  live_simulation: 'debrief_draft',
  appropriately_deferred: 'debrief_draft',
});

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isDeeplyFrozenData(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value);
  for (const name of Object.getOwnPropertyNames(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, name);
    if (!descriptor || !Object.hasOwn(descriptor, 'value')) return false;
    if (!isDeeplyFrozenData(descriptor.value, seen)) return false;
  }
  return true;
}

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const name of Object.getOwnPropertyNames(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, name);
    if (descriptor && Object.hasOwn(descriptor, 'value')) deepFreeze(descriptor.value, seen);
  }
  return Object.freeze(value);
}

function immutableCopy(value, label) {
  return deepFreeze(copyCaseData(value, label));
}

function immutableResult(value, label = 'case session result') {
  return immutableCopy(value, label);
}

function requireFixedStepTime(value, latestTimeSec) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new TypeError('tSec must be a finite nonnegative 0.02-second fixed-step timestamp');
  }
  const ticks = value * 50;
  const nearestTick = Math.round(ticks);
  if (!Number.isSafeInteger(nearestTick) || Math.abs(ticks - nearestTick) > 1e-9) {
    throw new RangeError('tSec must align to safe-integer 0.02-second fixed-step ticks');
  }
  if (value < latestTimeSec) {
    throw new RangeError(`tSec must be nondecreasing (latest is ${latestTimeSec})`);
  }
  return nearestTick / 50;
}

function requireNonemptyString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${label} must be a nonempty string`);
  }
}

function requireString(value, label) {
  if (typeof value !== 'string') throw new TypeError(`${label} must be a string`);
}

function requireOrdinaryArray(value, label) {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype) {
    throw new TypeError(`${label} must be an ordinary array`);
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
      && left.every((entry, index) => equalJsonSafe(entry, right[index]));
  }
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key) => Object.hasOwn(right, key)
      && equalJsonSafe(left[key], right[key]));
}

function canonicalizePlanSelection(field, value) {
  if (field.type === 'multi') {
    requireOrdinaryArray(value, `plan field ${field.id}`);
    if (field.required && value.length === 0) {
      throw new RangeError(`required multi plan field ${field.id} must not be empty`);
    }

    const selected = new Set();
    value.forEach((option, index) => {
      requireNonemptyString(option, `plan field ${field.id}[${index}]`);
      if (selected.has(option)) {
        throw new TypeError(`multi plan field ${field.id} contains duplicate option ${option}`);
      }
      if (!field.options.includes(option)) {
        throw new RangeError(`plan field ${field.id} must use valid options`);
      }
      selected.add(option);
    });
    return field.options.filter((option) => selected.has(option));
  }

  if (Array.isArray(value)) {
    throw new TypeError(`single plan field ${field.id} must use one option value`);
  }
  if (!field.options.some((option) => equalJsonSafe(option, value))) {
    throw new RangeError(`plan field ${field.id} must use a valid option`);
  }
  return value;
}

function planSelectionMatches(field, actual, expected) {
  if (field.type !== 'multi') return equalJsonSafe(actual, expected);
  if (!Array.isArray(actual) || !Array.isArray(expected)
    || actual.length !== expected.length) {
    return false;
  }
  const actualOptions = new Set(actual);
  const expectedOptions = new Set(expected);
  return actualOptions.size === actual.length
    && expectedOptions.size === expected.length
    && expected.every((option) => field.options.includes(option))
    && actual.every((option) => expectedOptions.has(option));
}

function failure(reason, details = {}) {
  return immutableResult({ ok: false, reason, ...details }, 'case session failure');
}

function success(details = {}) {
  return immutableResult({ ok: true, ...details }, 'case session success');
}

export class CaseSession {
  #definition;

  #stage = 'chart_review';

  #sequence = 0;

  #timeSec = 0;

  #active = true;

  #finalized = false;

  #outcome = null;

  #planCompletionStage = null;

  #finalizedAtSec = null;

  #completedActionIds = new Set();

  #assessmentRecords = [];

  #discoveredFindingIds = new Set();

  #findingsSubmission = null;

  #findingsSubmissionHistory = [];

  #planSubmission = null;

  #planSubmissionHistory = [];

  #ruleResults = [];

  #instructorObservations = new Map();

  #instructorObservationHistory = [];

  #feedbackRevealIds = new Set();

  #feedbackRevealHistory = [];

  #feedbackRevealRevisions = new Map();

  #timeline = [];

  #revisions = [];

  constructor({ definition, seed } = {}) {
    if (!isPlainObject(definition)
      || !isDeeplyFrozenData(definition)
      || definition.version !== 1
      || REQUIRED_DEFINITION_SECTIONS.some((key) => !Object.hasOwn(definition, key))) {
      throw new TypeError('definition must be a normalized frozen case definition');
    }
    if (!Number.isSafeInteger(seed) || seed < 0) {
      throw new RangeError('seed must be a safe nonnegative integer');
    }

    this.#definition = normalizeCaseExperience(definition);
    Object.defineProperty(this, 'seed', {
      configurable: false,
      enumerable: true,
      value: seed,
      writable: false,
    });

    this.#ruleResults = [
      ...this.#definition.assessment.scoringRules,
      ...this.#definition.planRequirements.rules,
    ].map((rule) => ({
      id: rule.id,
      label: rule.label,
      critical: rule.critical,
      source: rule.source,
      status: 'pending',
      points: null,
      evidence: immutableCopy(rule.evidence, `rule ${rule.id} evidence`),
      updatedAtSec: null,
    }));

    for (const consideration of this.#definition.instructorGuide.considerations) {
      if (consideration.defaultRevealInDebrief) this.#feedbackRevealIds.add(consideration.id);
    }
  }

  currentTimeSec() {
    return this.#timeSec;
  }

  #normalMutationGuard() {
    if (this.#finalized) return failure('FINALIZED');
    if (this.#stage === 'debrief_revision') return failure('REVISION_FEEDBACK_ONLY');
    return null;
  }

  #feedbackMutationGuard() {
    if (this.#finalized) return failure('FINALIZED');
    return null;
  }

  #validatedTime(tSec) {
    return requireFixedStepTime(tSec, this.#timeSec);
  }

  #appendTimeline(entry, tSec) {
    this.#sequence += 1;
    this.#timeSec = tSec;
    const record = immutableCopy({ ...entry, tSec, sequence: this.#sequence }, 'case timeline entry');
    this.#timeline.push(record);
    return record;
  }

  #transitionTo(stage, tSec, reason = null) {
    const fromStage = this.#stage;
    const entry = {
      kind: 'stage_transition',
      fromStage,
      toStage: stage,
    };
    if (reason !== null) entry.reason = reason;
    const record = this.#appendTimeline(entry, tSec);
    this.#stage = stage;
    return record;
  }

  #orderedCompletedActionIds() {
    return this.#definition.assessment.actions
      .filter(({ id }) => this.#completedActionIds.has(id))
      .map(({ id }) => id);
  }

  #orderedDiscoveredFindingIds() {
    return this.#definition.assessment.findings
      .filter(({ id }) => this.#discoveredFindingIds.has(id))
      .map(({ id }) => id);
  }

  #orderedFeedbackRevealIds() {
    return this.#definition.instructorGuide.considerations
      .filter(({ id }) => this.#feedbackRevealIds.has(id))
      .map(({ id }) => id);
  }

  #orderedInstructorObservations() {
    return this.#definition.instructorGuide.considerations
      .filter(({ id }) => this.#instructorObservations.has(id))
      .map(({ id }) => this.#instructorObservations.get(id));
  }

  #setRuleResultAt(index, { status, points, updatedAtSec }) {
    this.#ruleResults[index] = {
      ...this.#ruleResults[index],
      status,
      points,
      updatedAtSec,
    };
  }

  #evaluateAssessmentAction(actionId, tSec) {
    this.#definition.assessment.scoringRules.forEach((rule, index) => {
      if (rule.evidence.type === 'assessment_action'
        && rule.evidence.actionId === actionId) {
        this.#setRuleResultAt(index, {
          status: 'performed',
          points: 2,
          updatedAtSec: tSec,
        });
      }
    });
  }

  #evaluatePlan(tSec) {
    const assessmentRuleCount = this.#definition.assessment.scoringRules.length;
    const fieldsById = new Map(this.#definition.planRequirements.fields
      .map((field) => [field.id, field]));
    this.#definition.planRequirements.rules.forEach((rule, index) => {
      if (rule.evidence.type !== 'plan_equals') return;
      const matches = planSelectionMatches(
        fieldsById.get(rule.evidence.fieldId),
        this.#planSubmission.selections[rule.evidence.fieldId],
        rule.evidence.value,
      );
      this.#setRuleResultAt(assessmentRuleCount + index, {
        status: matches ? 'performed' : 'not_performed',
        points: matches ? 2 : 0,
        updatedAtSec: tSec,
      });
    });
  }

  #resolvePlanCompletionStage(selections) {
    const fieldsById = new Map(this.#definition.planRequirements.fields
      .map((field) => [field.id, field]));
    const matchingRoutes = (this.#definition.planRequirements.completionRoutes ?? [])
      .filter((route) => planSelectionMatches(
        fieldsById.get(route.fieldId),
        selections[route.fieldId],
        route.equals,
      ));
    if (matchingRoutes.length === 0) return 'live_simulation';
    const stages = new Set(matchingRoutes.map(({ stage }) => stage));
    if (stages.size !== 1) {
      throw new TypeError('plan completion routes produced ambiguous destination stages');
    }
    return matchingRoutes[0].stage;
  }

  advanceStage({ stage, tSec } = {}) {
    const guard = this.#normalMutationGuard();
    if (guard) return guard;
    const safeTime = this.#validatedTime(tSec);
    if (!CASE_STAGES.includes(stage)) return failure('UNKNOWN_STAGE');

    const expectedStage = NEXT_STAGE[this.#stage];
    if (this.#stage === 'plan_submission') return failure('PLAN_SUBMISSION_REQUIRED');
    if (stage !== expectedStage) return failure('INVALID_STAGE_TRANSITION');
    if (this.#stage === 'findings_summary' && this.#findingsSubmission === null) {
      return failure('FINDINGS_SUBMISSION_REQUIRED');
    }
    const transition = this.#transitionTo(stage, safeTime);
    return success({ stage: this.#stage, sequence: transition.sequence });
  }

  recordAssessmentAction({ actionId, tSec } = {}) {
    const guard = this.#normalMutationGuard();
    if (guard) return guard;
    const safeTime = this.#validatedTime(tSec);
    const action = this.#definition.assessment.actions.find(({ id }) => id === actionId);
    if (!action) return failure('UNKNOWN_ACTION');
    if (action.stage !== this.#stage) return failure('WRONG_STAGE');
    if (!action.prerequisites.every((id) => this.#completedActionIds.has(id))) {
      return failure('PREREQUISITES_UNMET');
    }
    if (this.#completedActionIds.has(action.id)) return failure('DUPLICATE_ACTION');

    const revealSet = new Set(action.reveals);
    const revealedFindingIds = this.#definition.assessment.findings
      .filter(({ id }) => revealSet.has(id) && !this.#discoveredFindingIds.has(id))
      .map(({ id }) => id);
    const timelineRecord = this.#appendTimeline({
      kind: 'assessment_action',
      actionId: action.id,
      stage: this.#stage,
      revealedFindingIds,
    }, safeTime);
    this.#completedActionIds.add(action.id);
    for (const findingId of revealedFindingIds) this.#discoveredFindingIds.add(findingId);
    this.#assessmentRecords.push(immutableCopy({
      actionId: action.id,
      tSec: safeTime,
      sequence: timelineRecord.sequence,
      stage: this.#stage,
      critical: action.critical,
      scoringRuleId: action.scoringRuleId,
      revealedFindingIds,
    }, 'assessment record'));
    this.#evaluateAssessmentAction(action.id, safeTime);
    return success({ revealedFindingIds });
  }

  submitFindings({ findingIds, notes = '', tSec } = {}) {
    const guard = this.#normalMutationGuard();
    if (guard) return guard;
    const safeTime = this.#validatedTime(tSec);
    if (this.#stage !== 'findings_summary') return failure('WRONG_STAGE');
    requireOrdinaryArray(findingIds, 'findingIds');
    requireString(notes, 'notes');
    const copiedIds = copyCaseData(findingIds, 'findingIds');
    const selectedIds = new Set();
    for (let index = 0; index < copiedIds.length; index += 1) {
      const findingId = copiedIds[index];
      requireNonemptyString(findingId, `findingIds[${index}]`);
      if (selectedIds.has(findingId)) throw new TypeError(`findingIds contains duplicate id ${findingId}`);
      selectedIds.add(findingId);
      const finding = this.#definition.assessment.findings.find(({ id }) => id === findingId);
      if (!finding) return failure('UNKNOWN_FINDING');
      if (!finding.initiallyVisible && !this.#discoveredFindingIds.has(findingId)) {
        return failure('FINDING_NOT_AVAILABLE');
      }
    }

    const missingRequiredIds = this.#definition.assessment.findings
      .filter((finding) => finding.required === true
        && (finding.initiallyVisible || this.#discoveredFindingIds.has(finding.id))
        && !selectedIds.has(finding.id))
      .map(({ id }) => id);
    if (missingRequiredIds.length > 0) {
      return failure('REQUIRED_FINDINGS_MISSING', { missingFindingIds: missingRequiredIds });
    }

    const orderedIds = this.#definition.assessment.findings
      .filter(({ id }) => selectedIds.has(id))
      .map(({ id }) => id);
    const revision = this.#findingsSubmissionHistory.length + 1;
    const timelineRecord = this.#appendTimeline({
      kind: 'findings_submission',
      findingIds: orderedIds,
      notes,
      revision,
      stage: this.#stage,
    }, safeTime);
    const submission = immutableCopy({
      findingIds: orderedIds,
      notes,
      tSec: safeTime,
      sequence: timelineRecord.sequence,
      revision,
    }, 'findings submission');
    this.#findingsSubmission = submission;
    this.#findingsSubmissionHistory.push(submission);
    return success({ submission });
  }

  submitPlan({ selections, rationale = '', tSec } = {}) {
    const guard = this.#normalMutationGuard();
    if (guard) return guard;
    const safeTime = this.#validatedTime(tSec);
    if (this.#stage !== 'plan_submission') return failure('WRONG_STAGE');
    if (!isPlainObject(selections)) throw new TypeError('selections must be a plain object');
    requireString(rationale, 'rationale');
    const copiedSelections = copyCaseData(selections, 'selections');
    const fieldsById = new Map(this.#definition.planRequirements.fields
      .map((field) => [field.id, field]));

    for (const fieldId of Object.keys(copiedSelections)) {
      if (!fieldsById.has(fieldId)) throw new TypeError(`selections contains unknown field ${fieldId}`);
    }
    const canonicalSelections = new Map();
    for (const field of this.#definition.planRequirements.fields) {
      if (field.required && !Object.hasOwn(copiedSelections, field.id)) {
        throw new TypeError(`required plan field ${field.id} is missing`);
      }
      if (Object.hasOwn(copiedSelections, field.id)) {
        canonicalSelections.set(
          field.id,
          canonicalizePlanSelection(field, copiedSelections[field.id]),
        );
      }
    }

    const orderedSelections = {};
    for (const field of this.#definition.planRequirements.fields) {
      if (canonicalSelections.has(field.id)) {
        orderedSelections[field.id] = canonicalSelections.get(field.id);
      }
    }
    const nextStage = this.#resolvePlanCompletionStage(orderedSelections);
    const revision = this.#planSubmissionHistory.length + 1;
    const timelineRecord = this.#appendTimeline({
      kind: 'plan_submission',
      selections: orderedSelections,
      rationale,
      revision,
      stage: this.#stage,
    }, safeTime);
    const submission = immutableCopy({
      selections: orderedSelections,
      rationale,
      tSec: safeTime,
      sequence: timelineRecord.sequence,
      revision,
    }, 'plan submission');
    this.#planSubmission = submission;
    this.#planSubmissionHistory.push(submission);
    this.#evaluatePlan(safeTime);

    this.#planCompletionStage = nextStage;
    this.#transitionTo(nextStage, safeTime, 'plan_submitted');
    return success({ submission, stage: this.#stage });
  }

  recordCanonicalAction({ action, meta = {}, snapshot = null, tSec } = {}) {
    const guard = this.#normalMutationGuard();
    if (guard) return guard;
    const safeTime = this.#validatedTime(tSec);
    requireNonemptyString(action, 'action');
    if (!isPlainObject(meta)) throw new TypeError('meta must be a plain object');
    if (snapshot !== null && !isPlainObject(snapshot)) {
      throw new TypeError('snapshot must be null or a plain object');
    }
    const copiedMeta = immutableCopy(meta, 'canonical action meta');
    const copiedSnapshot = snapshot === null
      ? null
      : immutableCopy(snapshot, 'canonical action snapshot');
    this.#appendTimeline({
      kind: 'live_action',
      action,
      meta: copiedMeta,
      snapshot: copiedSnapshot,
      stage: this.#stage,
    }, safeTime);
    return success({ activations: [] });
  }

  setInstructorObservation({ considerationId, status, note = '', tSec } = {}) {
    const guard = this.#feedbackMutationGuard();
    if (guard) return guard;
    const safeTime = this.#validatedTime(tSec);
    const consideration = this.#definition.instructorGuide.considerations
      .find(({ id }) => id === considerationId);
    if (!consideration) return failure('UNKNOWN_CONSIDERATION');
    if (!CASE_OBSERVATION_STATUS.includes(status)) {
      throw new RangeError(`status must be one of ${CASE_OBSERVATION_STATUS.join(', ')}`);
    }
    requireString(note, 'note');
    const revision = (this.#instructorObservations.get(considerationId)?.revision ?? 0) + 1;
    const timelineRecord = this.#appendTimeline({
      kind: 'instructor_observation',
      considerationId,
      status,
      note,
      revision,
      stage: this.#stage,
    }, safeTime);
    const observation = immutableCopy({
      considerationId,
      status,
      note,
      tSec: safeTime,
      sequence: timelineRecord.sequence,
      revision,
    }, 'instructor observation');
    this.#instructorObservations.set(considerationId, observation);
    this.#instructorObservationHistory.push(observation);
    return success({ observation });
  }

  setFeedbackReveal({ considerationId, reveal, tSec } = {}) {
    const guard = this.#feedbackMutationGuard();
    if (guard) return guard;
    const safeTime = this.#validatedTime(tSec);
    const consideration = this.#definition.instructorGuide.considerations
      .find(({ id }) => id === considerationId);
    if (!consideration) return failure('UNKNOWN_CONSIDERATION');
    if (typeof reveal !== 'boolean') throw new TypeError('reveal must be a boolean');
    const revision = (this.#feedbackRevealRevisions.get(considerationId) ?? 0) + 1;
    const timelineRecord = this.#appendTimeline({
      kind: 'feedback_reveal',
      considerationId,
      reveal,
      revision,
      stage: this.#stage,
    }, safeTime);
    const history = immutableCopy({
      considerationId,
      reveal,
      tSec: safeTime,
      sequence: timelineRecord.sequence,
      revision,
    }, 'feedback reveal history');
    if (reveal) this.#feedbackRevealIds.add(considerationId);
    else this.#feedbackRevealIds.delete(considerationId);
    this.#feedbackRevealRevisions.set(considerationId, revision);
    this.#feedbackRevealHistory.push(history);
    return success({ feedbackRevealIds: this.#orderedFeedbackRevealIds() });
  }

  activateBranch({ tSec } = {}) {
    const guard = this.#normalMutationGuard();
    if (guard) return guard;
    this.#validatedTime(tSec);
    return failure('NO_CASE_FLOW');
  }

  advancePhase({ tSec } = {}) {
    const guard = this.#normalMutationGuard();
    if (guard) return guard;
    this.#validatedTime(tSec);
    return failure('NO_CASE_FLOW');
  }

  #projectionState() {
    return {
      stage: this.#stage,
      sequence: this.#sequence,
      currentTimeSec: this.#timeSec,
      active: this.#active,
      finalizedAtSec: this.#finalizedAtSec,
      completedActionIds: this.#orderedCompletedActionIds(),
      assessmentRecords: this.#assessmentRecords,
      discoveredFindingIds: this.#orderedDiscoveredFindingIds(),
      findingsSubmission: this.#findingsSubmission,
      findingsSubmissionHistory: this.#findingsSubmissionHistory,
      planSubmission: this.#planSubmission,
      planSubmissionHistory: this.#planSubmissionHistory,
      ruleResults: this.#ruleResults,
      instructorObservations: this.#orderedInstructorObservations(),
      instructorObservationHistory: this.#instructorObservationHistory,
      feedbackRevealIds: this.#orderedFeedbackRevealIds(),
      feedbackRevealHistory: this.#feedbackRevealHistory,
      timeline: this.#timeline,
      revisions: this.#revisions,
      finalized: this.#finalized,
      outcome: this.#outcome,
    };
  }

  getLearnerContext() {
    return projectLearnerCase({
      definition: this.#definition,
      sessionState: this.#projectionState(),
      flowState: null,
    });
  }

  getInstructorContext() {
    return projectInstructorCase({
      definition: this.#definition,
      sessionState: this.#projectionState(),
      flowState: null,
    });
  }

  #buildLiveResult() {
    return {
      seed: this.seed,
      stage: this.#stage,
      sequence: this.#sequence,
      currentTimeSec: this.#timeSec,
      active: this.#active,
      finalized: this.#finalized,
      outcome: this.#outcome,
      finalizedAtSec: this.#finalizedAtSec,
      completedActionIds: this.#orderedCompletedActionIds(),
      assessmentRecords: this.#assessmentRecords,
      discoveredFindingIds: this.#orderedDiscoveredFindingIds(),
      findingsSubmission: this.#findingsSubmission,
      findingsSubmissionHistory: this.#findingsSubmissionHistory,
      planSubmission: this.#planSubmission,
      planSubmissionHistory: this.#planSubmissionHistory,
      ruleResults: this.#ruleResults,
      instructorObservations: this.#orderedInstructorObservations(),
      instructorObservationHistory: this.#instructorObservationHistory,
      feedbackRevealIds: this.#orderedFeedbackRevealIds(),
      feedbackRevealHistory: this.#feedbackRevealHistory,
      timeline: this.#timeline,
      revisions: this.#revisions,
    };
  }

  getLiveResult() {
    return immutableResult(this.#buildLiveResult());
  }

  finalize({ tSec } = {}) {
    if (this.#finalized) return failure('FINALIZED');
    const safeTime = this.#validatedTime(tSec);
    if (!['debrief_draft', 'appropriately_deferred', 'debrief_revision'].includes(this.#stage)) {
      return failure('INVALID_FINALIZATION_STAGE');
    }

    const pendingConsiderationIds = this.#definition.instructorGuide.considerations
      .filter(({ id }) => {
        const observation = this.#instructorObservations.get(id);
        return !observation || observation.status === 'not_yet_evaluable';
      })
      .map(({ id }) => id);
    if (pendingConsiderationIds.length > 0) {
      return failure('PENDING_INSTRUCTOR_OBSERVATIONS', { pendingConsiderationIds });
    }

    if (this.#stage === 'appropriately_deferred') {
      this.#transitionTo('debrief_draft', safeTime, 'finalize_deferred_case');
    }
    this.#ruleResults.forEach((rule, index) => {
      if (rule.source === 'ENGINE_OBSERVABLE' && rule.status === 'pending') {
        this.#setRuleResultAt(index, {
          status: 'not_performed',
          points: 0,
          updatedAtSec: safeTime,
        });
      }
    });

    const fromStage = this.#stage;
    this.#appendTimeline({
      kind: 'case_finalized',
      fromStage,
      toStage: 'debrief_finalized',
      outcome: this.#planCompletionStage === 'appropriately_deferred'
        ? 'appropriately_deferred'
        : 'completed',
    }, safeTime);
    this.#stage = 'debrief_finalized';
    this.#active = false;
    this.#finalized = true;
    this.#outcome = this.#planCompletionStage === 'appropriately_deferred'
      ? 'appropriately_deferred'
      : 'completed';
    this.#finalizedAtSec = safeTime;
    return immutableResult({ ok: true, ...this.#buildLiveResult() }, 'finalized case result');
  }

  beginRevision({ tSec } = {}) {
    if (!this.#finalized) return failure('NOT_FINALIZED');
    const safeTime = this.#validatedTime(tSec);
    const revision = this.#revisions.length + 1;
    const timelineRecord = this.#appendTimeline({
      kind: 'revision_started',
      revision,
      fromStage: this.#stage,
      toStage: 'debrief_revision',
    }, safeTime);
    const revisionRecord = immutableCopy({
      revision,
      tSec: safeTime,
      sequence: timelineRecord.sequence,
    }, 'case revision');
    this.#revisions.push(revisionRecord);
    this.#stage = 'debrief_revision';
    this.#finalized = false;
    this.#active = true;
    this.#finalizedAtSec = null;
    return success({ revision, record: revisionRecord });
  }
}
