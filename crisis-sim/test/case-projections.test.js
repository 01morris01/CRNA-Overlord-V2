import { describe, expect, test } from 'vitest';
import { normalizeCaseExperience } from '../sim/scenario/caseContract.js';
import {
  projectInstructorCase,
  projectLearnerCase,
} from '../sim/scenario/caseProjections.js';
import {
  makeCaseExperience,
  makeCaseSessionState,
} from './helpers/caseFixtures.js';

const SENTINELS = Object.freeze({
  completedResponse: 'COMPLETED_ACTION_RESPONSE_SENTINEL',
  concealedResponse: 'CONCEALED_ACTION_RESPONSE_SENTINEL',
  blockedPrompt: 'BLOCKED_ACTION_PROMPT_SENTINEL',
  discoveredSignificance: 'DISCOVERED_FINDING_SIGNIFICANCE_SENTINEL',
  visibleSignificance: 'UNDISCOVERED_VISIBLE_SIGNIFICANCE_SENTINEL',
  hiddenFindingLabel: 'UNDISCOVERED_FINDING_LABEL_SENTINEL',
  hiddenFindingSignificance: 'UNDISCOVERED_FINDING_SIGNIFICANCE_SENTINEL',
  physiologicChallenge: 'PHYSIOLOGIC_CHALLENGE_SENTINEL',
  anesthesiaConsideration: 'ANESTHESIA_CONSIDERATION_SENTINEL',
  assessmentRule: 'ASSESSMENT_SCORING_RULE_SENTINEL',
  planRule: 'PLAN_SCORING_RULE_SENTINEL',
  planEvidence: 'PLAN_RULE_EVIDENCE_SENTINEL',
  consideration: 'INSTRUCTOR_CONSIDERATION_SENTINEL',
  expectedResponse: 'INSTRUCTOR_EXPECTED_RESPONSE_SENTINEL',
  redFlag: 'INSTRUCTOR_RED_FLAG_SENTINEL',
  scoringGuidance: 'INSTRUCTOR_SCORING_GUIDANCE_SENTINEL',
  expectedEventResponse: 'EXPECTED_EVENT_RESPONSE_SENTINEL',
  unsafeEventResponse: 'UNSAFE_EVENT_RESPONSE_SENTINEL',
  eventEffect: 'EVENT_EFFECT_SENTINEL',
  debriefExplanation: 'UNRELEASED_DEBRIEF_EXPLANATION_SENTINEL',
  assessmentRecordScore: 'ASSESSMENT_RECORD_SCORE_SENTINEL',
  ruleResultEvidence: 'RULE_RESULT_EVIDENCE_SENTINEL',
  ruleResultPoints: 'RULE_RESULT_POINTS_SENTINEL',
  instructorNote: 'INSTRUCTOR_OBSERVATION_NOTE_SENTINEL',
  revision: 'INSTRUCTOR_REVISION_SENTINEL',
  responseDeadline: 'RESPONSE_DEADLINE_SENTINEL',
  branch: 'AVAILABLE_BRANCH_SENTINEL',
  flowHistory: 'FLOW_HISTORY_SENTINEL',
  callerPhaseTitle: 'CALLER_INJECTED_PHASE_GUIDANCE_SENTINEL',
  learnerFindingsNote: 'LEARNER_FINDINGS_NOTE_SENTINEL',
  learnerPlanRationale: 'LEARNER_PLAN_RATIONALE_SENTINEL',
});

function expectDeeplyFrozen(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  expect(Object.isFrozen(value)).toBe(true);
  for (const nested of Object.values(value)) expectDeeplyFrozen(nested, seen);
}

function expectOnlyPlainContainers(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  expect(value).not.toBeInstanceOf(Set);
  expect(value).not.toBeInstanceOf(Map);
  if (Array.isArray(value)) {
    expect(Object.getPrototypeOf(value)).toBe(Array.prototype);
  } else {
    expect([Object.prototype, null]).toContain(Object.getPrototypeOf(value));
  }
  for (const nested of Object.values(value)) expectOnlyPlainContainers(nested, seen);
}

function freezeForTest(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) freezeForTest(nested, seen);
  return Object.freeze(value);
}

function makeProjectionDefinition() {
  const definition = makeCaseExperience();

  definition.assessment.actions[0].response = SENTINELS.completedResponse;
  definition.assessment.findings[0].significance = SENTINELS.discoveredSignificance;
  definition.assessment.scoringRules[0].label = SENTINELS.assessmentRule;
  definition.assessment.findings.unshift({
    id: 'visible_chart_fact',
    learnerLabel: 'Visible chart fact',
    significance: SENTINELS.visibleSignificance,
    initiallyVisible: true,
    instructorOnlyUntilDiscovered: false,
  });
  definition.assessment.findings.push({
    id: 'concealed_airway_finding',
    learnerLabel: SENTINELS.hiddenFindingLabel,
    significance: SENTINELS.hiddenFindingSignificance,
    initiallyVisible: false,
    instructorOnlyUntilDiscovered: true,
  });
  definition.assessment.actions.push({
    id: 'assess_airway',
    stage: 'interview',
    domain: 'airway',
    prompt: 'Assess the airway history',
    response: SENTINELS.concealedResponse,
    reveals: ['concealed_airway_finding'],
    prerequisites: ['ask_npo'],
    scoringRuleId: 'assess_airway_rule',
    critical: true,
  }, {
    id: 'blocked_follow_up',
    stage: 'interview',
    domain: 'airway',
    prompt: SENTINELS.blockedPrompt,
    response: 'BLOCKED_ACTION_RESPONSE_SENTINEL',
    reveals: [],
    prerequisites: ['assess_airway'],
    scoringRuleId: 'blocked_follow_up_rule',
    critical: false,
  });
  definition.assessment.scoringRules.push({
    id: 'assess_airway_rule',
    label: 'Assesses airway history',
    critical: true,
    source: 'ENGINE_OBSERVABLE',
    evidence: { type: 'assessment_action', actionId: 'assess_airway' },
  }, {
    id: 'blocked_follow_up_rule',
    label: 'Performs the follow-up',
    critical: false,
    source: 'ENGINE_OBSERVABLE',
    evidence: { type: 'assessment_action', actionId: 'blocked_follow_up' },
  });

  definition.planRequirements.rules[0].label = SENTINELS.planRule;
  definition.planRequirements.rules[0].evidence.value = SENTINELS.planEvidence;
  definition.surgery.physiologicChallenges = [SENTINELS.physiologicChallenge];
  definition.surgery.anesthesiaConsiderations = [SENTINELS.anesthesiaConsideration];
  definition.eventFlow.events[0].expectedResponses = [SENTINELS.expectedEventResponse];
  definition.eventFlow.events[0].unsafeResponses = [SENTINELS.unsafeEventResponse];
  definition.eventFlow.events[0].effect = {
    type: 'inject_complication',
    complicationType: 'projection_test',
    description: SENTINELS.eventEffect,
  };
  definition.eventFlow.phases.push({
    id: 'recovery',
    title: 'Recovery',
    enterWhen: { type: 'instructor' },
    events: ['recovery_ready'],
    completionWhen: { type: 'instructor_advance' },
    allowedInstructorControls: ['advance'],
  });
  definition.eventFlow.events.push({
    id: 'recovery_ready',
    phaseId: 'recovery',
    trigger: { type: 'phase_enter' },
    repeatable: false,
    responseWindowSec: 0,
    expectedResponses: [],
    unsafeResponses: [],
    effect: null,
    guidanceIds: [],
    debriefIds: [],
  });
  definition.eventFlow.branches.push({
    id: SENTINELS.branch,
    label: 'Advance to recovery',
    fromPhaseId: 'assessment',
    toPhaseId: 'recovery',
    instructorOnly: true,
  });
  Object.assign(definition.instructorGuide.considerations[0], {
    consideration: SENTINELS.consideration,
    expectedResponse: SENTINELS.expectedResponse,
    redFlags: [SENTINELS.redFlag],
    scoringGuidance: SENTINELS.scoringGuidance,
    defaultRevealInDebrief: true,
  });
  definition.debrief.teachingItems[0].explanation = SENTINELS.debriefExplanation;

  return normalizeCaseExperience(definition);
}

function makeMultiProjectionDefinition({
  required = true,
  evidenceValue = ['propofol', 'ketamine'],
} = {}) {
  const definition = makeCaseExperience();
  definition.planRequirements.fields.push({
    id: 'agents',
    type: 'multi',
    required,
    options: ['propofol', 'ketamine', 'etomidate'],
  });
  definition.planRequirements.rules.push({
    id: 'plan_agents',
    label: 'Selects the planned induction agents',
    critical: false,
    source: 'ENGINE_OBSERVABLE',
    evidence: {
      type: 'plan_equals',
      fieldId: 'agents',
      value: evidenceValue,
    },
  });
  return normalizeCaseExperience(definition);
}

function makePendingRuleResults(definition) {
  return [
    ...definition.assessment.scoringRules,
    ...definition.planRequirements.rules,
  ].map((rule) => ({
    id: rule.id,
    label: rule.label,
    critical: rule.critical,
    source: rule.source,
    status: 'pending',
    points: null,
    evidence: structuredClone(rule.evidence),
    updatedAtSec: null,
  }));
}

function makeProjectionSessionState(definition, overrides = {}) {
  return makeCaseSessionState({
    ruleResults: makePendingRuleResults(definition),
    feedbackRevealIds: definition.instructorGuide.considerations
      .filter(({ defaultRevealInDebrief }) => defaultRevealInDebrief)
      .map(({ id }) => id),
    ...overrides,
  });
}

function makeMultiPlanSessionState(definition, agents) {
  const submission = {
    selections: { disposition: 'proceed', agents },
    rationale: 'Multi-select projection',
    tSec: 0,
    sequence: 1,
    revision: 1,
  };
  return makeCaseSessionState({
    stage: 'live_simulation',
    sequence: 1,
    ruleResults: makePendingRuleResults(definition),
    feedbackRevealIds: definition.instructorGuide.considerations
      .filter(({ defaultRevealInDebrief }) => defaultRevealInDebrief)
      .map(({ id }) => id),
    planSubmission: structuredClone(submission),
    planSubmissionHistory: [structuredClone(submission)],
    timeline: [{
      kind: 'plan_submission',
      selections: structuredClone(submission.selections),
      rationale: submission.rationale,
      revision: 1,
      stage: 'plan_submission',
      tSec: 0,
      sequence: 1,
    }],
  });
}

function makePopulatedSessionState(overrides = {}) {
  return makeCaseSessionState({
    stage: 'interview',
    sequence: 6,
    currentTimeSec: 6,
    completedActionIds: ['ask_npo'],
    assessmentRecords: [{
      actionId: 'ask_npo',
      tSec: 2,
      sequence: 1,
      stage: 'interview',
      critical: true,
      scoringRuleId: 'discover_npo',
      revealedFindingIds: ['npo_ok'],
    }],
    discoveredFindingIds: ['npo_ok'],
    findingsSubmission: {
      findingIds: ['npo_ok'],
      notes: SENTINELS.learnerFindingsNote,
      tSec: 3,
      sequence: 2,
      revision: 1,
    },
    planSubmission: {
      selections: { disposition: 'proceed' },
      rationale: SENTINELS.learnerPlanRationale,
      tSec: 4,
      sequence: 3,
      revision: 1,
    },
    ruleResults: [{
      id: 'discover_npo',
      label: SENTINELS.assessmentRule,
      critical: true,
      source: 'ENGINE_OBSERVABLE',
      status: 'performed',
      points: 2,
      evidence: { type: 'assessment_action', actionId: 'ask_npo' },
      updatedAtSec: 2,
    }, {
      id: 'assess_airway_rule',
      label: 'Assesses airway history',
      critical: true,
      source: 'ENGINE_OBSERVABLE',
      status: 'pending',
      points: null,
      evidence: { type: 'assessment_action', actionId: 'assess_airway' },
      updatedAtSec: null,
    }, {
      id: 'blocked_follow_up_rule',
      label: 'Performs the follow-up',
      critical: false,
      source: 'ENGINE_OBSERVABLE',
      status: 'pending',
      points: null,
      evidence: { type: 'assessment_action', actionId: 'blocked_follow_up' },
      updatedAtSec: null,
    }, {
      id: 'plan_proceed',
      label: SENTINELS.planRule,
      critical: true,
      source: 'ENGINE_OBSERVABLE',
      status: 'pending',
      points: null,
      evidence: {
        type: 'plan_equals',
        fieldId: 'disposition',
        value: SENTINELS.planEvidence,
      },
      updatedAtSec: null,
    }],
    instructorObservations: [{
      considerationId: 'consider_npo',
      status: 'observed',
      note: SENTINELS.instructorNote,
      tSec: 5,
      sequence: 4,
      revision: 1,
    }],
    feedbackRevealIds: ['consider_npo'],
    findingsSubmissionHistory: [{
      findingIds: ['npo_ok'],
      notes: SENTINELS.learnerFindingsNote,
      tSec: 3,
      sequence: 2,
      revision: 1,
    }],
    planSubmissionHistory: [{
      selections: { disposition: 'proceed' },
      rationale: SENTINELS.learnerPlanRationale,
      tSec: 4,
      sequence: 3,
      revision: 1,
    }],
    instructorObservationHistory: [{
      considerationId: 'consider_npo',
      status: 'observed',
      note: SENTINELS.instructorNote,
      tSec: 5,
      sequence: 4,
      revision: 1,
    }],
    feedbackRevealHistory: [{
      considerationId: 'consider_npo',
      reveal: true,
      tSec: 5,
      sequence: 5,
      revision: 1,
    }],
    revisions: [{ revision: 1, tSec: 6, sequence: 6 }],
    timeline: [{
      kind: 'assessment_action',
      actionId: 'ask_npo',
      stage: 'interview',
      revealedFindingIds: ['npo_ok'],
      tSec: 2,
      sequence: 1,
    }, {
      kind: 'findings_submission',
      findingIds: ['npo_ok'],
      notes: SENTINELS.learnerFindingsNote,
      revision: 1,
      stage: 'findings_summary',
      tSec: 3,
      sequence: 2,
    }, {
      kind: 'plan_submission',
      selections: { disposition: 'proceed' },
      rationale: SENTINELS.learnerPlanRationale,
      revision: 1,
      stage: 'plan_submission',
      tSec: 4,
      sequence: 3,
    }, {
      kind: 'instructor_observation',
      considerationId: 'consider_npo',
      status: 'observed',
      note: SENTINELS.instructorNote,
      revision: 1,
      stage: 'live_simulation',
      tSec: 5,
      sequence: 4,
    }, {
      kind: 'feedback_reveal',
      considerationId: 'consider_npo',
      reveal: true,
      revision: 1,
      stage: 'live_simulation',
      tSec: 5,
      sequence: 5,
    }, {
      kind: 'revision_started',
      revision: 1,
      fromStage: 'debrief_finalized',
      toStage: 'debrief_revision',
      tSec: 6,
      sequence: 6,
    }],
    finalized: false,
    finalizedAtSec: null,
    outcome: null,
    ...overrides,
  });
}

function makeFutureDiscoverySubmissionState(definition) {
  const findingsSubmission = {
    findingIds: ['concealed_airway_finding'],
    notes: 'FORGED_CONCEALED_FINDING_SUBMISSION',
    tSec: 3,
    sequence: 2,
    revision: 1,
  };
  return makeProjectionSessionState(definition, {
    stage: 'interview',
    sequence: 3,
    currentTimeSec: 4,
    completedActionIds: ['ask_npo', 'assess_airway'],
    assessmentRecords: [{
      actionId: 'ask_npo',
      tSec: 2,
      sequence: 1,
      stage: 'interview',
      critical: true,
      scoringRuleId: 'discover_npo',
      revealedFindingIds: ['npo_ok'],
    }, {
      actionId: 'assess_airway',
      tSec: 4,
      sequence: 3,
      stage: 'interview',
      critical: true,
      scoringRuleId: 'assess_airway_rule',
      revealedFindingIds: ['concealed_airway_finding'],
    }],
    discoveredFindingIds: ['npo_ok', 'concealed_airway_finding'],
    findingsSubmission: structuredClone(findingsSubmission),
    findingsSubmissionHistory: [structuredClone(findingsSubmission)],
    timeline: [{
      kind: 'assessment_action',
      actionId: 'ask_npo',
      stage: 'interview',
      revealedFindingIds: ['npo_ok'],
      tSec: 2,
      sequence: 1,
    }, {
      kind: 'findings_submission',
      findingIds: ['concealed_airway_finding'],
      notes: findingsSubmission.notes,
      revision: 1,
      stage: 'findings_summary',
      tSec: 3,
      sequence: 2,
    }, {
      kind: 'assessment_action',
      actionId: 'assess_airway',
      stage: 'interview',
      revealedFindingIds: ['concealed_airway_finding'],
      tSec: 4,
      sequence: 3,
    }],
  });
}

function makeFlowState() {
  return {
    currentPhaseId: 'assessment',
    currentTimeSec: 6,
    currentPhaseTitle: SENTINELS.callerPhaseTitle,
    activeEventIds: ['assessment_ready'],
    responseDeadlines: [{
      eventId: 'assessment_ready',
      privateMarker: SENTINELS.responseDeadline,
    }],
    availableBranchIds: [SENTINELS.branch],
    paused: false,
    history: [{
      phaseId: 'assessment',
      eventId: 'assessment_ready',
      privateMarker: SENTINELS.flowHistory,
    }],
  };
}

describe('learner case projection', () => {
  test('shows only eligible current-stage actions and reveals responses after completion', () => {
    const definition = makeProjectionDefinition();
    const beforeCompletion = projectLearnerCase({
      definition,
      sessionState: makeProjectionSessionState(definition, { stage: 'interview' }),
    });

    expect(beforeCompletion.actions).toEqual([{
      id: 'ask_npo',
      stage: 'interview',
      domain: 'npo',
      prompt: 'Ask last oral intake',
      completed: false,
    }]);
    expect(JSON.stringify(beforeCompletion)).not.toContain(SENTINELS.completedResponse);
    expect(JSON.stringify(beforeCompletion)).not.toContain(SENTINELS.concealedResponse);

    const afterCompletion = projectLearnerCase({
      definition,
      sessionState: makePopulatedSessionState(),
    });
    expect(afterCompletion.actions).toEqual([{
      id: 'ask_npo',
      stage: 'interview',
      domain: 'npo',
      prompt: 'Ask last oral intake',
      completed: true,
      response: SENTINELS.completedResponse,
    }, {
      id: 'assess_airway',
      stage: 'interview',
      domain: 'airway',
      prompt: 'Assess the airway history',
      completed: false,
    }]);
    expect(JSON.stringify(afterCompletion)).not.toContain(SENTINELS.concealedResponse);
    expect(JSON.stringify(afterCompletion)).not.toContain(SENTINELS.blockedPrompt);
  });

  test('returns a frozen defensive learner allowlist without instructor or answer-key data', () => {
    const definition = makeProjectionDefinition();
    const sessionState = makePopulatedSessionState();
    const flowState = makeFlowState();
    const sessionBefore = structuredClone(sessionState);
    const flowBefore = structuredClone(flowState);

    const projection = projectLearnerCase({ definition, sessionState, flowState });

    expect(projection).toMatchObject({
      active: true,
      stage: 'interview',
      finalized: false,
      outcome: null,
      learnerChart: definition.learnerChart,
      assessmentStages: definition.assessment.stages,
      planFields: [{
        id: 'disposition',
        type: 'single',
        required: true,
        options: ['proceed', 'postpone'],
      }],
      findingsSubmission: {
        findingIds: ['npo_ok'],
        notes: SENTINELS.learnerFindingsNote,
        tSec: 3,
        sequence: 2,
      },
      planSubmission: {
        selections: { disposition: 'proceed' },
        rationale: SENTINELS.learnerPlanRationale,
        tSec: 4,
        sequence: 3,
      },
      flowState: {
        currentPhaseTitle: 'Assessment',
        paused: false,
      },
    });
    expect(projection.surgery).toEqual({
      procedure: definition.surgery.procedure,
      indication: definition.surgery.indication,
      position: definition.surgery.position,
      expectedDurationMin: definition.surgery.expectedDurationMin,
      expectedStimulation: definition.surgery.expectedStimulation,
      bloodLossRisk: definition.surgery.bloodLossRisk,
    });
    expect(Object.keys(projection.surgery)).not.toContain('physiologicChallenges');
    expect(Object.keys(projection.surgery)).not.toContain('anesthesiaConsiderations');
    expect(projection.discoveredFindings).toEqual([{
      id: 'visible_chart_fact',
      learnerLabel: 'Visible chart fact',
      discovered: false,
      initiallyVisible: true,
    }, {
      id: 'npo_ok',
      learnerLabel: 'NPO appropriate',
      discovered: true,
      initiallyVisible: false,
      significance: SENTINELS.discoveredSignificance,
    }]);
    expect(projection.assessmentRecords).toEqual([{
      actionId: 'ask_npo',
      tSec: 2,
      sequence: 1,
    }]);
    expect(Object.keys(projection.planFields[0])).toEqual([
      'id', 'type', 'required', 'options',
    ]);
    expect(() => { projection.planFields[0].options.push('forged'); }).toThrow(TypeError);

    expect(Object.keys(projection.flowState)).toEqual([
      'currentPhaseTitle', 'paused',
    ]);
    for (const forbiddenKey of [
      'instructorGuide',
      'planRequirements',
      'ruleResults',
      'instructorObservations',
      'feedbackRevealIds',
      'revisions',
      'findingsSubmissionHistory',
      'planSubmissionHistory',
      'instructorObservationHistory',
      'feedbackRevealHistory',
      'timeline',
      'currentTimeSec',
      'finalizedAtSec',
      'eventFlow',
      'debrief',
    ]) {
      expect(projection).not.toHaveProperty(forbiddenKey);
    }
    for (const forbiddenKey of [
      'critical',
      'scoringRuleId',
      'prerequisites',
      'reveals',
    ]) {
      expect(projection.actions[0]).not.toHaveProperty(forbiddenKey);
    }

    const serialized = JSON.stringify(projection);
    for (const forbiddenKey of [
      'consideration',
      'expectedResponse',
      'redFlags',
      'scoringGuidance',
      'defaultRevealInDebrief',
      'scoringRules',
      'evidence',
      'ruleResults',
      'points',
      'critical',
      'scoringRuleId',
      'currentPhaseId',
      'currentTimeSec',
      'activeEventIds',
      'responseDeadlines',
      'availableBranchIds',
      'history',
      'completionRoutes',
    ]) {
      expect(serialized).not.toContain(`\"${forbiddenKey}\"`);
    }
    for (const forbiddenValue of [
      SENTINELS.concealedResponse,
      SENTINELS.visibleSignificance,
      SENTINELS.hiddenFindingLabel,
      SENTINELS.hiddenFindingSignificance,
      SENTINELS.physiologicChallenge,
      SENTINELS.anesthesiaConsideration,
      SENTINELS.assessmentRule,
      SENTINELS.planRule,
      SENTINELS.planEvidence,
      SENTINELS.consideration,
      SENTINELS.expectedResponse,
      SENTINELS.redFlag,
      SENTINELS.scoringGuidance,
      SENTINELS.expectedEventResponse,
      SENTINELS.unsafeEventResponse,
      SENTINELS.eventEffect,
      SENTINELS.debriefExplanation,
      SENTINELS.assessmentRecordScore,
      SENTINELS.ruleResultEvidence,
      SENTINELS.ruleResultPoints,
      SENTINELS.instructorNote,
      SENTINELS.revision,
      SENTINELS.responseDeadline,
      SENTINELS.branch,
      SENTINELS.flowHistory,
      SENTINELS.callerPhaseTitle,
    ]) {
      expect(serialized).not.toContain(forbiddenValue);
    }
    expect(serialized).toContain(SENTINELS.completedResponse);
    expect(serialized).toContain(SENTINELS.discoveredSignificance);
    expect(serialized).toContain(SENTINELS.learnerFindingsNote);
    expect(serialized).toContain(SENTINELS.learnerPlanRationale);
    expect(sessionState).toEqual(sessionBefore);
    expect(flowState).toEqual(flowBefore);
    expect(projection.learnerChart).not.toBe(definition.learnerChart);
    expect(projection.findingsSubmission).not.toBe(sessionState.findingsSubmission);
    expectDeeplyFrozen(projection);
  });
});

describe('instructor case projection', () => {
  test('includes complete instructor-authorized definition, state, flow, and considerations', () => {
    const definition = makeProjectionDefinition();
    const sessionState = makePopulatedSessionState();
    const flowState = makeFlowState();

    const projection = projectInstructorCase({ definition, sessionState, flowState });

    expect(projection).toMatchObject({
      active: sessionState.active,
      stage: sessionState.stage,
      sequence: sessionState.sequence,
      currentTimeSec: sessionState.currentTimeSec,
      finalized: sessionState.finalized,
      finalizedAtSec: sessionState.finalizedAtSec,
      outcome: sessionState.outcome,
      learnerChart: definition.learnerChart,
      assessment: definition.assessment,
      planRequirements: definition.planRequirements,
      surgery: definition.surgery,
      eventFlow: definition.eventFlow,
      instructorGuide: definition.instructorGuide,
      debrief: definition.debrief,
      completedActionIds: sessionState.completedActionIds,
      assessmentRecords: sessionState.assessmentRecords,
      discoveredFindingIds: sessionState.discoveredFindingIds,
      findingsSubmission: sessionState.findingsSubmission,
      findingsSubmissionHistory: sessionState.findingsSubmissionHistory,
      planSubmission: sessionState.planSubmission,
      planSubmissionHistory: sessionState.planSubmissionHistory,
      ruleResults: sessionState.ruleResults,
      instructorObservations: sessionState.instructorObservations,
      instructorObservationHistory: sessionState.instructorObservationHistory,
      feedbackRevealIds: sessionState.feedbackRevealIds,
      feedbackRevealHistory: sessionState.feedbackRevealHistory,
      timeline: sessionState.timeline,
      revisions: sessionState.revisions,
      flowState: {
        ...flowState,
        currentPhaseTitle: 'Assessment',
      },
      considerations: definition.instructorGuide.considerations,
    });
    expect(projection.assessment.actions).toEqual(definition.assessment.actions);
    expect(projection.assessment.findings).toEqual(definition.assessment.findings);
    expect(projection.assessment.scoringRules).toEqual(definition.assessment.scoringRules);
    expect(projection.planRequirements).toEqual(definition.planRequirements);
    expect(projection.surgery).toEqual(definition.surgery);
    expect(projection.eventFlow.branches).toEqual(definition.eventFlow.branches);
    expect(projection.debrief).toEqual(definition.debrief);
    expect(JSON.stringify(projection.flowState)).not.toContain(SENTINELS.callerPhaseTitle);
    expect(projection.ruleResults).not.toBe(sessionState.ruleResults);
    expect(projection.flowState).not.toBe(flowState);
    expectOnlyPlainContainers(projection);
    expectDeeplyFrozen(projection);
  });
});

describe('case projection validation and determinism', () => {
  test('accepts and defensively projects canonical multi-select plan values', () => {
    const definition = makeMultiProjectionDefinition();
    const sessionState = makeMultiPlanSessionState(definition, ['propofol', 'ketamine']);

    const learner = projectLearnerCase({ definition, sessionState });
    const instructor = projectInstructorCase({ definition, sessionState });

    expect(learner.planSubmission.selections.agents).toEqual(['propofol', 'ketamine']);
    expect(instructor.planSubmission.selections.agents).toEqual(['propofol', 'ketamine']);
    expect(instructor.planSubmissionHistory[0].selections.agents).toEqual([
      'propofol', 'ketamine',
    ]);
    expect(() => { instructor.planSubmission.selections.agents[0] = 'mutated'; })
      .toThrow(TypeError);
    expect(sessionState.planSubmission.selections.agents).toEqual(['propofol', 'ketamine']);
  });

  test('preserves unordered contract evidence while requiring canonical stored selections', () => {
    const definition = makeMultiProjectionDefinition({
      evidenceValue: ['ketamine', 'propofol'],
    });
    const canonicalState = makeMultiPlanSessionState(definition, ['propofol', 'ketamine']);

    const instructor = projectInstructorCase({
      definition,
      sessionState: canonicalState,
    });

    expect(instructor.planSubmission.selections.agents).toEqual(['propofol', 'ketamine']);
    expect(instructor.ruleResults.at(-1).evidence.value).toEqual([
      'ketamine', 'propofol',
    ]);

    const noncanonicalState = makeMultiPlanSessionState(definition, ['ketamine', 'propofol']);
    expect(() => projectInstructorCase({
      definition,
      sessionState: noncanonicalState,
    })).toThrow(/agents|canonical|definition order/i);
  });

  test.each([
    ['scalar multi value', 'propofol', /agents|multi|array/i],
    ['duplicate multi options', ['propofol', 'propofol'], /agents|duplicate/i],
    ['unknown multi option', ['propofol', 'thiopental'], /agents|option/i],
    ['empty required multi value', [], /agents|required|empty/i],
  ])('rejects %s', (_label, agents, pattern) => {
    const definition = makeMultiProjectionDefinition();
    const sessionState = makeMultiPlanSessionState(definition, agents);

    expect(() => projectInstructorCase({ definition, sessionState })).toThrow(pattern);
  });

  test('rejects an array for a single field and allows empty multi only when optional', () => {
    const requiredDefinition = makeMultiProjectionDefinition();
    const invalidSingle = makeMultiPlanSessionState(requiredDefinition, ['propofol']);
    invalidSingle.planSubmission.selections.disposition = ['proceed'];
    expect(() => projectInstructorCase({
      definition: requiredDefinition,
      sessionState: invalidSingle,
    })).toThrow(/disposition|single|option/i);

    const optionalDefinition = makeMultiProjectionDefinition({ required: false });
    const optionalEmpty = makeMultiPlanSessionState(optionalDefinition, []);
    expect(() => projectInstructorCase({
      definition: optionalDefinition,
      sessionState: optionalEmpty,
    })).not.toThrow();
  });

  test('revalidates frozen definitions and rejects nested answer-key forgery', () => {
    const forged = makeCaseExperience();
    forged.learnerChart.answerKey = 'FORGED_NESTED_ANSWER_KEY_SENTINEL';
    freezeForTest(forged);

    expect(() => projectLearnerCase({
      definition: forged,
      sessionState: makeCaseSessionState(),
    })).toThrow(/reserved.*learner-chart|answerKey.*reserved/i);
    expect(() => projectInstructorCase({
      definition: forged,
      sessionState: makeCaseSessionState(),
    })).toThrow(/reserved.*learner-chart|answerKey.*reserved/i);
  });

  test('derives canonical phase titles and rejects an unknown current phase', () => {
    const definition = makeProjectionDefinition();
    const sessionState = makePopulatedSessionState();
    const flowState = makeFlowState();

    const learner = projectLearnerCase({ definition, sessionState, flowState });
    const instructor = projectInstructorCase({ definition, sessionState, flowState });

    expect(learner.flowState.currentPhaseTitle).toBe('Assessment');
    expect(instructor.flowState.currentPhaseTitle).toBe('Assessment');
    expect(JSON.stringify(learner)).not.toContain(SENTINELS.callerPhaseTitle);
    expect(JSON.stringify(instructor.flowState)).not.toContain(SENTINELS.callerPhaseTitle);

    flowState.currentPhaseId = 'missing_phase';
    expect(() => projectLearnerCase({ definition, sessionState, flowState }))
      .toThrow(/flowState.*currentPhaseId.*unknown|unknown.*phase.*missing_phase/i);
  });

  test.each([
    [
      'completed action without an assessment record',
      (state) => {
        state.assessmentRecords = [];
        state.discoveredFindingIds = [];
        state.timeline = [];
      },
      /completedActionIds.*assessmentRecords|completed action.*record/i,
    ],
    [
      'assessment record without a completed action',
      (state) => { state.completedActionIds = []; },
      /assessmentRecords.*completedActionIds|completedActionIds.*assessmentRecords/i,
    ],
    [
      'duplicate assessment action record',
      (state) => {
        state.assessmentRecords.push(structuredClone(state.assessmentRecords[0]));
        state.timeline.push(structuredClone(state.timeline[0]));
      },
      /assessmentRecords.*duplicate.*action/i,
    ],
    [
      'completed action with an unmet prerequisite',
      (state) => {
        state.completedActionIds = ['assess_airway'];
        state.assessmentRecords = [{
          actionId: 'assess_airway',
          tSec: 2,
          sequence: 1,
          stage: 'interview',
          critical: true,
          scoringRuleId: 'assess_airway_rule',
          revealedFindingIds: ['concealed_airway_finding'],
        }];
        state.discoveredFindingIds = ['concealed_airway_finding'];
        state.timeline = [{
          kind: 'assessment_action',
          actionId: 'assess_airway',
          tSec: 2,
          sequence: 1,
          stage: 'interview',
          revealedFindingIds: ['concealed_airway_finding'],
        }];
      },
      /prerequisite.*ask_npo|ask_npo.*prerequisite/i,
    ],
    [
      'assessment reveal not declared by the action',
      (state) => {
        state.assessmentRecords[0].revealedFindingIds = ['concealed_airway_finding'];
        state.discoveredFindingIds = ['concealed_airway_finding'];
        state.timeline[0].revealedFindingIds = ['concealed_airway_finding'];
      },
      /revealedFindingIds.*declared|reveal.*action/i,
    ],
    [
      'discovered finding without assessment evidence',
      (state) => { state.discoveredFindingIds.push('concealed_airway_finding'); },
      /discoveredFindingIds.*assessment.*reveal|discovered.*evidence/i,
    ],
    [
      'assessment reveal omitted from discovered findings',
      (state) => { state.discoveredFindingIds = []; },
      /discoveredFindingIds.*assessment.*reveal|discovered.*evidence/i,
    ],
    [
      'assessment action missing from canonical timeline',
      (state) => { state.timeline = []; },
      /assessmentRecords.*timeline|timeline.*assessment action/i,
    ],
    [
      'assessment action mismatched in canonical timeline',
      (state) => { state.timeline[0].stage = 'focused_exam'; },
      /assessmentRecords.*timeline|timeline.*match/i,
    ],
  ])('rejects forged %s evidence', (_label, mutate, pattern) => {
    const definition = makeProjectionDefinition();
    const sessionState = makePopulatedSessionState();
    mutate(sessionState);

    expect(() => projectLearnerCase({ definition, sessionState })).toThrow(pattern);
  });

  test('rejects a findings submission that names a concealed finding discovered only later', () => {
    const definition = makeProjectionDefinition();
    const forged = makeFutureDiscoverySubmissionState(definition);

    expect(() => projectLearnerCase({ definition, sessionState: forged }))
      .toThrow(/findingsSubmissionHistory.*available|finding.*available.*submission/i);
    expect(() => projectInstructorCase({ definition, sessionState: forged }))
      .toThrow(/findingsSubmissionHistory.*available|finding.*available.*submission/i);
  });

  test.each([
    [
      'findings history without its canonical timeline record',
      (state) => { state.timeline[1].kind = 'live_action'; },
      /findingsSubmissionHistory.*timeline|findings_submission.*canonical/i,
    ],
    [
      'findings history whose timeline payload differs',
      (state) => { state.timeline[1].notes = 'FORGED_TIMELINE_NOTE'; },
      /findingsSubmissionHistory.*timeline|findings_submission.*canonical/i,
    ],
    [
      'current findings submission that is not the latest history entry',
      (state) => { state.findingsSubmission.notes = 'FORGED_CURRENT_NOTE'; },
      /findingsSubmission.*latest.*history|current.*findings/i,
    ],
  ])('rejects %s', (_label, mutate, pattern) => {
    const definition = makeProjectionDefinition();
    const sessionState = makePopulatedSessionState();
    mutate(sessionState);

    expect(() => projectLearnerCase({ definition, sessionState })).toThrow(pattern);
  });

  test.each([
    [
      'a timeline sequence gap',
      (state) => { state.timeline[2].sequence = 4; },
      /timeline.*sequence.*contiguous|timeline.*strict/i,
    ],
    [
      'duplicate timeline sequence values',
      (state) => { state.timeline[2].sequence = 2; },
      /timeline.*sequence.*contiguous|timeline.*strict|duplicate/i,
    ],
    [
      'decreasing timeline time',
      (state) => { state.timeline[2].tSec = 1; },
      /timeline.*tSec.*nondecreasing|chronolog/i,
    ],
    [
      'session sequence behind the canonical timeline',
      (state) => { state.sequence = 5; },
      /sessionState\.sequence.*timeline|max.*sequence/i,
    ],
    [
      'a findings revision gap',
      (state) => {
        state.findingsSubmission.revision = 2;
        state.findingsSubmissionHistory[0].revision = 2;
        state.timeline[1].revision = 2;
      },
      /findingsSubmissionHistory.*revision.*contiguous/i,
    ],
    [
      'a plan revision gap',
      (state) => {
        state.planSubmission.revision = 2;
        state.planSubmissionHistory[0].revision = 2;
        state.timeline[2].revision = 2;
      },
      /planSubmissionHistory.*revision.*contiguous/i,
    ],
    [
      'an observation revision gap',
      (state) => {
        state.instructorObservations[0].revision = 2;
        state.instructorObservationHistory[0].revision = 2;
        state.timeline[3].revision = 2;
      },
      /instructorObservationHistory.*revision.*contiguous/i,
    ],
    [
      'a feedback revision gap',
      (state) => {
        state.feedbackRevealHistory[0].revision = 2;
        state.timeline[4].revision = 2;
      },
      /feedbackRevealHistory.*revision.*contiguous/i,
    ],
    [
      'a debrief revision gap',
      (state) => {
        state.revisions[0].revision = 2;
        state.timeline[5].revision = 2;
      },
      /sessionState\.revisions.*revision.*contiguous/i,
    ],
    [
      'a current observation that is not its latest history entry',
      (state) => { state.instructorObservations[0].note = 'FORGED_CURRENT_NOTE'; },
      /instructorObservations.*latest.*history|current.*observation/i,
    ],
    [
      'a current plan submission that is not its latest history entry',
      (state) => { state.planSubmission.rationale = 'FORGED_CURRENT_RATIONALE'; },
      /planSubmission.*latest.*history|current.*plan/i,
    ],
    [
      'a current feedback reveal that differs from its latest history entry',
      (state) => { state.feedbackRevealIds = []; },
      /feedbackRevealIds.*latest.*history|current.*reveal/i,
    ],
    [
      'plan history without matching canonical timeline evidence',
      (state) => { state.timeline[2].rationale = 'FORGED_TIMELINE_RATIONALE'; },
      /planSubmissionHistory.*timeline|plan_submission.*canonical/i,
    ],
    [
      'observation history without matching canonical timeline evidence',
      (state) => { state.timeline[3].note = 'FORGED_TIMELINE_NOTE'; },
      /instructorObservationHistory.*timeline|instructor_observation.*canonical/i,
    ],
    [
      'feedback history without matching canonical timeline evidence',
      (state) => { state.timeline[4].reveal = false; },
      /feedbackRevealHistory.*timeline|feedback_reveal.*canonical/i,
    ],
    [
      'revision history without matching canonical timeline evidence',
      (state) => { state.timeline[5].kind = 'live_action'; },
      /sessionState\.revisions.*timeline|revision_started.*canonical/i,
    ],
  ])('rejects forged aggregate chronology: %s', (_label, mutate, pattern) => {
    const definition = makeProjectionDefinition();
    const sessionState = makePopulatedSessionState();
    mutate(sessionState);

    expect(() => projectInstructorCase({ definition, sessionState })).toThrow(pattern);
  });

  test('allows session time after the latest action and reconciles it with flow time', () => {
    const definition = makeProjectionDefinition();
    const withoutFlow = makePopulatedSessionState({ currentTimeSec: 8 });
    expect(() => projectInstructorCase({ definition, sessionState: withoutFlow }))
      .not.toThrow();

    const behindRecords = makePopulatedSessionState({ currentTimeSec: 5 });
    expect(() => projectInstructorCase({ definition, sessionState: behindRecords }))
      .toThrow(/currentTimeSec.*recorded|recorded.*time/i);

    const mismatchedFlow = makeFlowState();
    mismatchedFlow.currentTimeSec = 7;
    expect(() => projectInstructorCase({
      definition,
      sessionState: makePopulatedSessionState(),
      flowState: mismatchedFlow,
    })).toThrow(/currentTimeSec.*flowState|flowState.*currentTimeSec/i);
  });

  test('accepts same rule ID in assessment and plan namespaces in definition order', () => {
    const rawDefinition = makeCaseExperience();
    rawDefinition.planRequirements.rules[0].id = 'discover_npo';
    const definition = normalizeCaseExperience(rawDefinition);
    const expectedRules = [
      ...definition.assessment.scoringRules,
      ...definition.planRequirements.rules,
    ];
    const ruleResults = expectedRules.map((rule) => ({
      id: rule.id,
      label: rule.label,
      critical: rule.critical,
      source: rule.source,
      status: 'pending',
      points: null,
      evidence: structuredClone(rule.evidence),
      updatedAtSec: null,
    }));

    const projection = projectInstructorCase({
      definition,
      sessionState: makeCaseSessionState({
        ruleResults,
        feedbackRevealIds: ['consider_npo'],
      }),
    });

    expect(projection.ruleResults.map(({ id }) => id))
      .toEqual(['discover_npo', 'discover_npo']);
    expect(projection.ruleResults.map(({ evidence }) => evidence))
      .toEqual(expectedRules.map(({ evidence }) => evidence));
  });

  test.each([
    ['missing result', (results) => { results.pop(); }],
    ['reordered results', (results) => { results.reverse(); }],
    ['mismatched label', (results) => { results[0].label = 'forged label'; }],
    ['mismatched criticality', (results) => { results[0].critical = false; }],
    ['mismatched source', (results) => { results[0].source = 'FORGED_SOURCE'; }],
    ['mismatched evidence', (results) => { results[0].evidence.actionId = 'assess_airway'; }],
  ])('rejects %s against concatenated definition rule order', (_label, mutate) => {
    const definition = makeProjectionDefinition();
    const sessionState = makePopulatedSessionState();
    mutate(sessionState.ruleResults);

    expect(() => projectInstructorCase({ definition, sessionState }))
      .toThrow(/ruleResults.*definition order|ruleResults.*match.*rule|exactly.*rule/i);
  });

  test.each([
    ['unknown stage', (state) => { state.stage = 'forged_stage'; }, /stage.*supported|unknown.*stage/i],
    [
      'current time',
      (state) => { state.currentTimeSec = -1; },
      /currentTimeSec/i,
    ],
    [
      'finalization time',
      (state) => { state.finalizedAtSec = -1; },
      /finalizedAtSec/i,
    ],
    [
      'assessment record action',
      (state) => { state.assessmentRecords[0].actionId = 'missing_action'; },
      /assessmentRecords.*actionId.*unknown|unknown.*action/i,
    ],
    [
      'assessment record exact shape',
      (state) => { state.assessmentRecords[0].unexpected = true; },
      /assessmentRecords.*exact shape|unexpected/i,
    ],
    [
      'assessment record timestamp',
      (state) => { state.assessmentRecords[0].tSec = -1; },
      /assessmentRecords.*tSec|timestamp/i,
    ],
    [
      'assessment record sequence',
      (state) => { state.assessmentRecords[0].sequence = 1.5; },
      /assessmentRecords.*sequence/i,
    ],
    [
      'findings submission unknown finding',
      (state) => { state.findingsSubmission.findingIds = ['missing_finding']; },
      /findingsSubmission.*unknown.*finding|missing_finding/i,
    ],
    [
      'findings submission duplicate finding',
      (state) => { state.findingsSubmission.findingIds = ['npo_ok', 'npo_ok']; },
      /findingsSubmission.*duplicate/i,
    ],
    [
      'plan submission unknown field',
      (state) => { state.planSubmission.selections.unknown_field = 'x'; },
      /planSubmission.*unknown.*field|unknown_field/i,
    ],
    [
      'plan submission invalid option',
      (state) => { state.planSubmission.selections.disposition = 'invalid'; },
      /planSubmission.*option|disposition.*option/i,
    ],
    [
      'unknown rule result',
      (state) => { state.ruleResults[0].id = 'missing_rule'; },
      /ruleResults.*unknown.*rule|missing_rule/i,
    ],
    [
      'extra rule result',
      (state) => { state.ruleResults.push(structuredClone(state.ruleResults[0])); },
      /ruleResults.*definition order|exactly.*rule|ruleResults.*length/i,
    ],
    [
      'unknown instructor observation',
      (state) => { state.instructorObservations[0].considerationId = 'missing_consideration'; },
      /instructorObservations.*unknown.*consideration|missing_consideration/i,
    ],
    [
      'invalid instructor observation status',
      (state) => { state.instructorObservations[0].status = 'partial'; },
      /instructorObservations.*status/i,
    ],
    [
      'unknown feedback reveal',
      (state) => { state.feedbackRevealIds = ['missing_consideration']; },
      /feedbackRevealIds.*unknown.*consideration|missing_consideration/i,
    ],
    [
      'findings history record container',
      (state) => { state.findingsSubmissionHistory = [null]; },
      /findingsSubmissionHistory.*plain object/i,
    ],
    [
      'findings history reference',
      (state) => { state.findingsSubmissionHistory[0].findingIds = ['missing_finding']; },
      /findingsSubmissionHistory.*unknown.*finding|missing_finding/i,
    ],
    [
      'plan history reference',
      (state) => { state.planSubmissionHistory[0].selections.disposition = 'invalid'; },
      /planSubmissionHistory.*option|disposition.*option/i,
    ],
    [
      'instructor observation history reference',
      (state) => {
        state.instructorObservationHistory[0].considerationId = 'missing_consideration';
      },
      /instructorObservationHistory.*unknown.*consideration|missing_consideration/i,
    ],
    [
      'feedback history reference',
      (state) => { state.feedbackRevealHistory[0].considerationId = 'missing_consideration'; },
      /feedbackRevealHistory.*unknown.*consideration|missing_consideration/i,
    ],
    [
      'revision record',
      (state) => { state.revisions[0].sequence = -1; },
      /revisions.*sequence/i,
    ],
    [
      'timeline record container',
      (state) => { state.timeline = [null]; },
      /timeline.*plain object/i,
    ],
    [
      'timeline reference',
      (state) => { state.timeline[0].actionId = 'missing_action'; },
      /timeline.*unknown.*action|missing_action/i,
    ],
  ])('rejects malformed or unresolved %s state', (_label, mutate, pattern) => {
    const definition = makeProjectionDefinition();
    const sessionState = makePopulatedSessionState();
    mutate(sessionState);

    expect(() => projectInstructorCase({ definition, sessionState })).toThrow(pattern);
  });

  test.each([
    [
      'unknown active event',
      (flow) => { flow.activeEventIds = ['missing_event']; },
      /activeEventIds.*unknown.*event|missing_event/i,
    ],
    [
      'event outside the current phase',
      (flow) => { flow.activeEventIds = ['recovery_ready']; },
      /activeEventIds.*current phase|event.*belong.*phase/i,
    ],
    [
      'branch outside the current phase',
      (flow) => {
        flow.currentPhaseId = 'recovery';
        flow.activeEventIds = ['recovery_ready'];
      },
      /availableBranchIds.*current phase|branch.*from.*phase/i,
    ],
    [
      'unknown response-deadline event',
      (flow) => { flow.responseDeadlines[0].eventId = 'missing_event'; },
      /responseDeadlines.*unknown.*event|missing_event/i,
    ],
    [
      'unknown flow-history phase',
      (flow) => { flow.history[0].phaseId = 'missing_phase'; },
      /history.*unknown.*phase|missing_phase/i,
    ],
    [
      'unknown flow-history event',
      (flow) => { flow.history[0].eventId = 'missing_event'; },
      /history.*unknown.*event|missing_event/i,
    ],
    [
      'unknown flow-history branch',
      (flow) => { flow.history[0].branchId = 'missing_branch'; },
      /history.*unknown.*branch|missing_branch/i,
    ],
  ])('rejects malformed or unresolved %s flow state', (_label, mutate, pattern) => {
    const definition = makeProjectionDefinition();
    const flowState = makeFlowState();
    mutate(flowState);

    expect(() => projectInstructorCase({
      definition,
      sessionState: makePopulatedSessionState(),
      flowState,
    })).toThrow(pattern);
  });

  test('requires normalized definitions, plain state, nullable plain flow, and ID arrays', () => {
    const definition = makeProjectionDefinition();
    const sessionState = makeProjectionSessionState(definition);
    const rawDefinition = makeCaseExperience();

    expect(() => projectLearnerCase({
      definition: rawDefinition,
      sessionState: makeProjectionSessionState(rawDefinition),
    }))
      .not.toThrow();
    expect(() => projectLearnerCase({ definition: null, sessionState }))
      .toThrow(/validated.*definition|definition.*validated/i);
    expect(() => projectInstructorCase({ definition, sessionState: [] }))
      .toThrow(/sessionState.*plain object/i);
    expect(() => projectLearnerCase({ definition, sessionState, flowState: [] }))
      .toThrow(/flowState.*null.*plain object|flowState.*plain object/i);
    expect(() => projectLearnerCase({
      definition,
      sessionState: makeCaseSessionState({ completedActionIds: new Set() }),
    })).toThrow(/completedActionIds.*array|JSON-safe/i);
    expect(() => projectInstructorCase({
      definition,
      sessionState: makeCaseSessionState({ discoveredFindingIds: null }),
    })).toThrow(/discoveredFindingIds.*array/i);
    const missingTimeline = makeCaseSessionState();
    delete missingTimeline.timeline;
    expect(() => projectInstructorCase({ definition, sessionState: missingTimeline }))
      .toThrow(/sessionState\.timeline.*array/i);
  });

  test('rejects unknown completed and discovered IDs rather than silently ignoring them', () => {
    const definition = makeProjectionDefinition();

    expect(() => projectLearnerCase({
      definition,
      sessionState: makeCaseSessionState({ completedActionIds: ['missing_action'] }),
    })).toThrow(/unknown.*completed.*action.*missing_action|missing_action.*unknown/i);
    expect(() => projectInstructorCase({
      definition,
      sessionState: makeCaseSessionState({ discoveredFindingIds: ['missing_finding'] }),
    })).toThrow(/unknown.*discovered.*finding.*missing_finding|missing_finding.*unknown/i);
  });

  test('supports null flow and returns byte-stable fresh projections in definition order', () => {
    const definition = makeProjectionDefinition();
    const sessionState = makePopulatedSessionState();

    const learnerFirst = projectLearnerCase({ definition, sessionState, flowState: null });
    const learnerSecond = projectLearnerCase({ definition, sessionState, flowState: null });
    const instructorFirst = projectInstructorCase({ definition, sessionState, flowState: null });
    const instructorSecond = projectInstructorCase({ definition, sessionState, flowState: null });

    expect(learnerFirst).not.toBe(learnerSecond);
    expect(instructorFirst).not.toBe(instructorSecond);
    expect(learnerFirst.flowState).toBeNull();
    expect(instructorFirst.flowState).toBeNull();
    expect(learnerFirst.actions.map(({ id }) => id)).toEqual(['ask_npo', 'assess_airway']);
    expect(learnerFirst.discoveredFindings.map(({ id }) => id))
      .toEqual(['visible_chart_fact', 'npo_ok']);
    expect(JSON.stringify(learnerFirst)).toBe(JSON.stringify(learnerSecond));
    expect(JSON.stringify(instructorFirst)).toBe(JSON.stringify(instructorSecond));

    expect(() => { learnerFirst.learnerChart.patient.syntheticName = 'Mutated'; })
      .toThrow(TypeError);
    expect(() => { learnerFirst.actions.push({ id: 'injected' }); }).toThrow(TypeError);
    expect(() => { instructorFirst.ruleResults[0].passed = false; }).toThrow(TypeError);
    expect(JSON.stringify(projectLearnerCase({ definition, sessionState })))
      .toBe(JSON.stringify(learnerSecond));
    expect(JSON.stringify(projectInstructorCase({ definition, sessionState })))
      .toBe(JSON.stringify(instructorSecond));
  });
});
