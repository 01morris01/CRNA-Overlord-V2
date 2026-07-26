/* Regression tests for three defects found in adversarial review of the case
   confidentiality boundary and debrief record. Each test fails on the
   pre-fix code and passes on the fix. */
import { describe, expect, test } from 'vitest';
import standardScenario from '../sim/scenarios/standard_iv_healthy_001.json';
import { normalizeCaseExperience } from '../sim/scenario/caseContract.js';
import { CaseSession } from '../sim/scenario/caseSession.js';
import { renderPrintableCase } from '../../ui/liveSimView.js';
import { SimRunner } from '../ui/simRunner.js';
import { makeCaseExperience } from './helpers/caseFixtures.js';

// --- Defect 1: instructorOnlyUntilDiscovered must be a real gate ---

describe('defect 1: instructorOnlyUntilDiscovered is load-bearing', () => {
  test('contract rejects a finding that is both initiallyVisible and instructor-only', () => {
    const experience = makeCaseExperience();
    experience.assessment.findings.push({
      id: 'contradictory',
      learnerLabel: 'Should not be authorable',
      significance: 'Contradictory visibility flags',
      initiallyVisible: true,
      instructorOnlyUntilDiscovered: true,
    });
    expect(() => normalizeCaseExperience(experience))
      .toThrow(/initiallyVisible and instructorOnlyUntilDiscovered/);
  });

  test('an instructor-only finding stays hidden from the learner until discovered', () => {
    // The real, authorable case: instructorOnlyUntilDiscovered with
    // initiallyVisible:false. Undiscovered, neither its label nor significance
    // may reach the learner projection; once discovered, both appear.
    const experience = makeCaseExperience();
    experience.assessment.actions.push({
      id: 'ask_secret',
      stage: 'interview',
      domain: 'airway',
      prompt: 'Ask the concealed question',
      response: 'The concealed answer',
      reveals: ['secret_finding'],
      prerequisites: [],
      scoringRuleId: 'discover_secret',
      critical: false,
    });
    experience.assessment.findings.push({
      id: 'secret_finding',
      learnerLabel: 'LEAK_INSTRUCTOR_ONLY_LABEL',
      significance: 'LEAK_INSTRUCTOR_ONLY_SIG',
      initiallyVisible: false,
      instructorOnlyUntilDiscovered: true,
    });
    experience.assessment.scoringRules.push({
      id: 'discover_secret',
      label: 'Assesses the concealed item',
      critical: false,
      source: 'ENGINE_OBSERVABLE',
      evidence: { type: 'assessment_action', actionId: 'ask_secret' },
    });
    const definition = normalizeCaseExperience(experience);
    const session = new CaseSession({ definition, seed: 1 });
    session.advanceStage({ stage: 'interview', tSec: 0.02 });

    const before = JSON.stringify(session.getLearnerContext());
    expect(before).not.toContain('LEAK_INSTRUCTOR_ONLY_LABEL');
    expect(before).not.toContain('LEAK_INSTRUCTOR_ONLY_SIG');

    session.recordAssessmentAction({ actionId: 'ask_secret', tSec: 0.04 });
    const after = session.getLearnerContext();
    expect(after.discoveredFindings.some((f) => f.id === 'secret_finding')).toBe(true);
    expect(JSON.stringify(after)).toContain('LEAK_INSTRUCTOR_ONLY_LABEL');
  });
});

// --- Defect 3: initiallyVisible findings are recorded, not lost ---

function driveToFinalizedRunner(customize) {
  const runner = new SimRunner();
  const scenario = structuredClone(standardScenario);
  scenario.id = 'regression_case_001';
  scenario.caseExperience = customize(makeCaseExperience());
  runner.loadCaseScenario({ scenario });
  runner.advanceCaseStage({ stage: 'interview' });
  runner.performAssessmentAction({ actionId: 'ask_npo' });
  runner.advanceCaseStage({ stage: 'focused_exam' });
  runner.advanceCaseStage({ stage: 'findings_summary' });
  runner.submitCaseFindings({ findingIds: ['npo_ok'] });
  runner.advanceCaseStage({ stage: 'plan_submission' });
  runner.submitCasePlan({ selections: { disposition: 'proceed' } });
  runner.advanceCaseStage({ stage: 'debrief_draft' });
  runner.setInstructorCaseObservation({ considerationId: 'consider_npo', status: 'observed' });
  runner.finalizeCaseDebrief();
  return runner.buildDebrief();
}

describe('defect 3: chart-visible findings survive in the debrief', () => {
  test('an initiallyVisible finding lands in chartVisibleFindings, not lost', () => {
    const debrief = driveToFinalizedRunner((experience) => {
      experience.assessment.findings.unshift({
        id: 'chart_documented_allergy',
        learnerLabel: 'Documented penicillin allergy',
        significance: 'On the chart from the start',
        initiallyVisible: true,
        instructorOnlyUntilDiscovered: false,
      });
      return experience;
    });
    const { assessment } = debrief.caseResult;
    const bucketOf = (id) => [
      ['discovered', assessment.discoveredFindings],
      ['chartVisible', assessment.chartVisibleFindings],
      ['missed', assessment.missedFindings],
    ].filter(([, list]) => list.some((f) => f.id === id)).map(([name]) => name);

    // Exactly one bucket, and it is chartVisible.
    expect(bucketOf('chart_documented_allergy')).toEqual(['chartVisible']);
    // The default discoverable finding still lands in discovered.
    expect(bucketOf('npo_ok')).toEqual(['discovered']);
  });

  test('every finding lands in exactly one of the three buckets', () => {
    const debrief = driveToFinalizedRunner((experience) => {
      experience.assessment.findings.unshift({
        id: 'chart_finding',
        learnerLabel: 'Chart finding',
        significance: 'Visible',
        initiallyVisible: true,
        instructorOnlyUntilDiscovered: false,
      });
      experience.assessment.findings.push({
        id: 'undiscovered_finding',
        learnerLabel: 'Never asked',
        significance: 'Missed',
        initiallyVisible: false,
        instructorOnlyUntilDiscovered: true,
      });
      return experience;
    });
    const { assessment } = debrief.caseResult;
    const all = [
      ...assessment.discoveredFindings,
      ...assessment.chartVisibleFindings,
      ...assessment.missedFindings,
    ].map((f) => f.id);
    // No finding appears twice.
    expect(new Set(all).size).toBe(all.length);
    // All three definition findings are represented.
    expect(new Set(all)).toEqual(new Set(['npo_ok', 'chart_finding', 'undiscovered_finding']));
    expect(assessment.chartVisibleFindings.map((f) => f.id)).toEqual(['chart_finding']);
    expect(assessment.missedFindings.map((f) => f.id)).toEqual(['undiscovered_finding']);
  });
});

// --- Defect 2: the two-tier boundary is explicit and tested ---

describe('defect 2: instructor debrief vs student printable are two tiers', () => {
  function finalizedWithMissedSecret() {
    return driveToFinalizedRunner((experience) => {
      experience.assessment.findings.push({
        id: 'missed_secret',
        learnerLabel: 'LEAK_MISSED_LABEL',
        significance: 'LEAK_MISSED_SIGNIFICANCE',
        initiallyVisible: false,
        instructorOnlyUntilDiscovered: true,
      });
      return experience;
    });
  }

  test('the debrief object is the instructor-complete record (carries missed content)', () => {
    const debrief = finalizedWithMissedSecret();
    const serialized = JSON.stringify(debrief.caseResult);
    // The instructor debrief intentionally names what was missed, for teaching.
    expect(serialized).toContain('LEAK_MISSED_LABEL');
    expect(serialized).toContain('LEAK_MISSED_SIGNIFICANCE');
  });

  test('the student printable scrubs that same missed content to a count', () => {
    const debrief = finalizedWithMissedSecret();
    const html = renderPrintableCase({ debrief });
    expect(html).not.toContain('LEAK_MISSED_LABEL');
    expect(html).not.toContain('LEAK_MISSED_SIGNIFICANCE');
    // The count is present instead.
    expect(html).toMatch(/Findings not discovered:\s*1/);
  });
});
