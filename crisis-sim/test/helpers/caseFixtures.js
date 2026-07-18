export function makeCaseExperience() {
  return {
    version: 1,
    learnerChart: {
      patient: {
        syntheticName: 'Taylor Example',
        mrn: 'SIM-0001',
        ageYears: 40,
        sex: 'Female',
      },
      scheduledProcedure: {
        name: 'Test procedure',
        site: 'Test site',
        laterality: 'none',
      },
      documents: [],
      medications: [],
      allergies: [],
      labs: [],
      studies: [],
    },
    assessment: {
      stages: ['chart_review', 'interview', 'focused_exam', 'findings_summary'],
      actions: [{
        id: 'ask_npo',
        stage: 'interview',
        domain: 'npo',
        prompt: 'Ask last oral intake',
        response: 'Solids eight hours ago',
        reveals: ['npo_ok'],
        prerequisites: [],
        scoringRuleId: 'discover_npo',
        critical: true,
      }],
      findings: [{
        id: 'npo_ok',
        learnerLabel: 'NPO appropriate',
        significance: 'Aspiration risk assessed',
        initiallyVisible: false,
        instructorOnlyUntilDiscovered: true,
      }],
      requiredDomains: ['npo'],
      scoringRules: [{
        id: 'discover_npo',
        label: 'Assesses NPO status',
        critical: true,
        source: 'ENGINE_OBSERVABLE',
        evidence: { type: 'assessment_action', actionId: 'ask_npo' },
      }],
    },
    planRequirements: {
      fields: [{
        id: 'disposition',
        type: 'single',
        required: true,
        options: ['proceed', 'postpone'],
      }],
      rules: [{
        id: 'plan_proceed',
        label: 'Selects disposition',
        critical: true,
        source: 'ENGINE_OBSERVABLE',
        evidence: {
          type: 'plan_equals',
          fieldId: 'disposition',
          value: 'proceed',
        },
      }],
    },
    surgery: {
      procedure: 'Test procedure',
      indication: 'Teaching fixture',
      position: 'supine',
      expectedDurationMin: 30,
      expectedStimulation: 'low',
      bloodLossRisk: 'low',
      physiologicChallenges: [],
      anesthesiaConsiderations: [],
    },
    eventFlow: {
      initialPhaseId: 'assessment',
      phases: [{
        id: 'assessment',
        title: 'Assessment',
        enterWhen: { type: 'load' },
        events: ['assessment_ready'],
        completionWhen: { type: 'plan_submitted' },
        allowedInstructorControls: ['advance'],
      }],
      events: [{
        id: 'assessment_ready',
        phaseId: 'assessment',
        trigger: { type: 'phase_enter' },
        repeatable: false,
        responseWindowSec: 0,
        expectedResponses: [],
        unsafeResponses: [],
        effect: null,
        guidanceIds: ['consider_npo'],
        debriefIds: ['teach_npo'],
      }],
      branches: [],
    },
    instructorGuide: {
      considerations: [{
        id: 'consider_npo',
        phaseId: 'assessment',
        eventId: 'assessment_ready',
        title: 'NPO status',
        consideration: 'Trainee should establish intake timing.',
        expectedResponse: 'Ask solids and clear-liquid timing.',
        responseWindowSec: 0,
        redFlags: ['Plan submitted without NPO assessment'],
        scoringGuidance: 'Observe sequence.',
        defaultRevealInDebrief: true,
      }],
    },
    debrief: {
      teachingItems: [{
        id: 'teach_npo',
        title: 'NPO',
        explanation: 'Connect intake timing to aspiration risk.',
      }],
    },
  };
}

export function makeCaseScenario() {
  return {
    id: 'case_contract_fixture_001',
    title: 'Preanesthesia contract fixture',
    courseUnit: 'Test course',
    maxDurationSeconds: 900,
    events: [],
    expectedActions: [],
    dangerousActions: [],
    debrief: {
      summary: 'Teaching fixture summary.',
      teachingPoints: [],
      reviewTopics: [],
      reviewTags: [],
    },
    caseExperience: makeCaseExperience(),
  };
}
