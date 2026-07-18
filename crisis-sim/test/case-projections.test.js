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

function makePopulatedSessionState(overrides = {}) {
  return makeCaseSessionState({
    stage: 'interview',
    sequence: 7,
    completedActionIds: ['ask_npo'],
    assessmentRecords: [{
      actionId: 'ask_npo',
      tSec: 2,
      sequence: 1,
      critical: true,
      scoringRuleId: 'discover_npo',
      points: SENTINELS.assessmentRecordScore,
      instructorNote: SENTINELS.instructorNote,
    }],
    discoveredFindingIds: ['npo_ok'],
    findingsSubmission: {
      findingIds: ['npo_ok'],
      notes: SENTINELS.learnerFindingsNote,
      tSec: 3,
      sequence: 2,
      points: 'FINDINGS_SUBMISSION_INTERNAL_POINTS_SENTINEL',
    },
    planSubmission: {
      selections: { disposition: 'proceed' },
      rationale: SENTINELS.learnerPlanRationale,
      tSec: 4,
      sequence: 3,
      instructorNote: SENTINELS.instructorNote,
    },
    ruleResults: [{
      ruleId: 'discover_npo',
      passed: true,
      evidence: SENTINELS.ruleResultEvidence,
      points: SENTINELS.ruleResultPoints,
      critical: true,
    }],
    instructorObservations: [{
      considerationId: 'consider_npo',
      status: 'observed',
      note: SENTINELS.instructorNote,
      tSec: 5,
      sequence: 4,
    }],
    feedbackRevealIds: ['consider_npo'],
    revisions: [{ note: SENTINELS.revision, tSec: 6, sequence: 5 }],
    finalized: true,
    outcome: 'completed',
    ...overrides,
  });
}

function makeFlowState() {
  return {
    currentPhaseId: 'assessment',
    currentPhaseTitle: 'Assessment',
    activeEventIds: ['assessment_ready'],
    responseDeadlines: [{
      eventId: 'assessment_ready',
      privateMarker: SENTINELS.responseDeadline,
    }],
    availableBranchIds: [SENTINELS.branch],
    paused: false,
    history: [{ eventId: SENTINELS.flowHistory }],
  };
}

describe('learner case projection', () => {
  test('shows only eligible current-stage actions and reveals responses after completion', () => {
    const definition = makeProjectionDefinition();
    const beforeCompletion = projectLearnerCase({
      definition,
      sessionState: makeCaseSessionState({ stage: 'interview' }),
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
      finalized: true,
      outcome: 'completed',
      learnerChart: definition.learnerChart,
      assessmentStages: definition.assessment.stages,
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
        currentPhaseId: 'assessment',
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

    expect(Object.keys(projection.flowState)).toEqual([
      'currentPhaseId', 'currentPhaseTitle', 'paused',
    ]);
    for (const forbiddenKey of [
      'instructorGuide',
      'planRequirements',
      'ruleResults',
      'instructorObservations',
      'feedbackRevealIds',
      'revisions',
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
      'activeEventIds',
      'responseDeadlines',
      'availableBranchIds',
      'history',
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
      finalized: sessionState.finalized,
      outcome: sessionState.outcome,
      learnerChart: definition.learnerChart,
      assessment: definition.assessment,
      planRequirements: definition.planRequirements,
      surgery: definition.surgery,
      instructorGuide: definition.instructorGuide,
      completedActionIds: sessionState.completedActionIds,
      assessmentRecords: sessionState.assessmentRecords,
      discoveredFindingIds: sessionState.discoveredFindingIds,
      findingsSubmission: sessionState.findingsSubmission,
      planSubmission: sessionState.planSubmission,
      ruleResults: sessionState.ruleResults,
      instructorObservations: sessionState.instructorObservations,
      feedbackRevealIds: sessionState.feedbackRevealIds,
      revisions: sessionState.revisions,
      flowState,
      considerations: definition.instructorGuide.considerations,
    });
    expect(projection.assessment.actions).toEqual(definition.assessment.actions);
    expect(projection.assessment.findings).toEqual(definition.assessment.findings);
    expect(projection.assessment.scoringRules).toEqual(definition.assessment.scoringRules);
    expect(projection.planRequirements).toEqual(definition.planRequirements);
    expect(projection.surgery).toEqual(definition.surgery);
    expect(projection.ruleResults).not.toBe(sessionState.ruleResults);
    expect(projection.flowState).not.toBe(flowState);
    expectOnlyPlainContainers(projection);
    expectDeeplyFrozen(projection);
  });
});

describe('case projection validation and determinism', () => {
  test('requires normalized definitions, plain state, nullable plain flow, and ID arrays', () => {
    const definition = makeProjectionDefinition();
    const sessionState = makeCaseSessionState();

    expect(() => projectLearnerCase({
      definition: makeCaseExperience(),
      sessionState,
    })).toThrow(/normalized.*definition|definition.*normalized/i);
    expect(() => projectLearnerCase({ definition: null, sessionState }))
      .toThrow(/normalized.*definition|definition.*normalized/i);
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
