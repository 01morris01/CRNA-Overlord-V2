/* Phase 0 confidentiality probe for the MOUNTED learner workspace.

   Task 6 proved the pure learner projection withholds instructor material.
   This probe closes the remaining gap: it seeds LEAK_ sentinels through every
   instructor-only channel of a case definition, mounts the real live case
   controller onto a DOM, drives the case through every learner stage, and
   greps the learner regions' innerHTML for any sentinel.

   The instructor panel is an authorized surface and is deliberately excluded
   from the learner assertion; a separate assertion proves the probe is live by
   confirming sentinels DO reach the instructor panel. */
import { describe, expect, test } from 'vitest';
import standardScenario from '../sim/scenarios/standard_iv_healthy_001.json';
import { SimRunner } from '../ui/simRunner.js';
import { makeCaseExperience } from './helpers/caseFixtures.js';
import { createLiveCaseController } from '../../ui/liveCaseView.js';

const SENTINEL = /LEAK_[A-Z_]+/g;

/* Every instructor-only channel the plan enumerates, seeded with a distinct
   sentinel so a failure names the exact channel that leaked. */
function seedInstructorSentinels(experience) {
  // 1. An assessment action the learner never performs: its response is the
  //    answer key and must stay hidden while the action is uncompleted.
  experience.assessment.actions.push({
    id: 'ask_secret',
    stage: 'interview',
    domain: 'airway',
    prompt: 'Ask the concealed airway question',
    response: 'LEAK_UNCOMPLETED_ACTION_RESPONSE',
    reveals: ['hidden_finding'],
    prerequisites: [],
    scoringRuleId: 'discover_secret',
    critical: false,
  });

  // 2. A finding never discovered: label and significance are instructor-only
  //    until the learner earns them.
  experience.assessment.findings.push({
    id: 'hidden_finding',
    learnerLabel: 'LEAK_UNDISCOVERED_FINDING_LABEL',
    significance: 'LEAK_UNDISCOVERED_FINDING_SIGNIFICANCE',
    initiallyVisible: false,
    instructorOnlyUntilDiscovered: true,
  });

  // 3. Scoring rule labels drive ruleResults, which are instructor scoring state.
  experience.assessment.scoringRules.push({
    id: 'discover_secret',
    label: 'LEAK_ASSESSMENT_RULE_LABEL',
    critical: false,
    source: 'ENGINE_OBSERVABLE',
    evidence: { type: 'assessment_action', actionId: 'ask_secret' },
  });
  experience.planRequirements.rules.push({
    id: 'plan_secret',
    label: 'LEAK_PLAN_RULE_LABEL',
    critical: false,
    source: 'ENGINE_OBSERVABLE',
    evidence: {
      type: 'plan_equals',
      fieldId: 'disposition',
      value: 'postpone',
    },
  });

  // 4. Event expected/unsafe responses are the instructor's answer key.
  experience.eventFlow.events[0].expectedResponses = ['LEAK_EXPECTED_RESPONSE'];
  experience.eventFlow.events[0].unsafeResponses = ['LEAK_UNSAFE_RESPONSE'];

  // 5. Instructor guidance: title, prose, expected response, scoring guidance,
  //    and red flags are all instructor-only in the workspace.
  const [consideration] = experience.instructorGuide.considerations;
  consideration.title = 'LEAK_CONSIDERATION_TITLE';
  consideration.consideration = 'LEAK_CONSIDERATION_BODY';
  consideration.expectedResponse = 'LEAK_CONSIDERATION_EXPECTED';
  consideration.scoringGuidance = 'LEAK_SCORING_GUIDANCE';
  consideration.redFlags = ['LEAK_RED_FLAG'];

  // 6. Debrief teaching text is unreleased until the debrief is built.
  experience.debrief.teachingItems[0].title = 'LEAK_DEBRIEF_TITLE';
  experience.debrief.teachingItems[0].explanation = 'LEAK_DEBRIEF_EXPLANATION';

  return experience;
}

class FakeCaseElement {
  constructor({ id = '', dataset = {} } = {}) {
    this.id = id;
    this.dataset = dataset;
    this.value = '';
    this.checked = false;
    this.type = '';
    this.innerHTML = '';
    this.textContent = '';
    this.disabled = false;
    this.listeners = new Map();
    this.queryMap = {};
  }

  addEventListener(eventType, listener) {
    const listeners = this.listeners.get(eventType) ?? [];
    listeners.push(listener);
    this.listeners.set(eventType, listeners);
  }

  removeEventListener() {}

  insertAdjacentHTML() {}

  closest() { return null; }

  querySelector() { return null; }

  querySelectorAll(selector) { return this.queryMap[selector] ?? []; }
}

const LEARNER_IDS = Object.freeze(['live-case-status', 'live-case-stage-nav']);
const INSTRUCTOR_IDS = Object.freeze([
  'live-case-current-phase', 'live-case-active-event', 'live-case-branches',
  'live-case-considerations', 'live-case-history',
]);
const ALL_IDS = Object.freeze([
  'live-case-workspace', 'live-case-notes', 'live-case-submit-findings',
  'live-case-submit-plan', 'live-case-instructor', 'live-case-pause',
  'live-case-advance', ...LEARNER_IDS, ...INSTRUCTOR_IDS,
]);
const REGIONS = Object.freeze(['chart', 'interview', 'exam', 'findings', 'plan']);

function makeConsoleDom() {
  const byId = Object.fromEntries(ALL_IDS.map((id) => [id, new FakeCaseElement({ id })]));
  const regions = Object.fromEntries(REGIONS
    .map((region) => [region, new FakeCaseElement({ dataset: { caseRegionContent: region } })]));
  const root = {
    querySelector(selector) {
      if (selector.startsWith('#')) return byId[selector.slice(1)] ?? null;
      const match = /^\[data-case-region-content="([a-z]+)"\]$/.exec(selector);
      return match ? regions[match[1]] ?? null : null;
    },
  };
  return { root, byId, regions };
}

/* Everything the learner can see in the mounted console: the five workspace
   regions, the status line, and the stage navigation. */
function learnerHtml(dom) {
  return [
    ...REGIONS.map((region) => dom.regions[region].innerHTML),
    ...LEARNER_IDS.map((id) => dom.byId[id].innerHTML),
  ].join('\n');
}

function instructorHtml(dom) {
  return INSTRUCTOR_IDS.map((id) => dom.byId[id].innerHTML).join('\n');
}

function loadProbeCase(runner) {
  const scenario = structuredClone(standardScenario);
  scenario.id = 'case_leak_probe_001';
  scenario.title = 'Leak probe case';
  scenario.caseExperience = seedInstructorSentinels(makeCaseExperience());
  return runner.loadCaseScenario({ scenario });
}

describe('Phase 0: mounted learner workspace confidentiality probe', () => {
  test('no instructor-only sentinel reaches the learner DOM at any stage', () => {
    const runner = new SimRunner();
    const dom = makeConsoleDom();
    const controller = createLiveCaseController({ runner, root: dom.root });
    loadProbeCase(runner);

    const observed = [];
    const capture = (label) => {
      controller.render();
      const html = learnerHtml(dom);
      observed.push({ label, leaks: html.match(SENTINEL) ?? [] });
    };

    capture('chart_review');

    expect(runner.advanceCaseStage({ stage: 'interview' })).toMatchObject({ ok: true });
    capture('interview_before_actions');

    // Perform only the benign action; ask_secret stays uncompleted on purpose.
    expect(runner.performAssessmentAction({ actionId: 'ask_npo' })).toMatchObject({ ok: true });
    capture('interview_after_benign_action');

    expect(runner.advanceCaseStage({ stage: 'focused_exam' })).toMatchObject({ ok: true });
    capture('focused_exam');

    expect(runner.advanceCaseStage({ stage: 'findings_summary' })).toMatchObject({ ok: true });
    capture('findings_summary');

    expect(runner.submitCaseFindings({ findingIds: ['npo_ok'] })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'plan_submission' })).toMatchObject({ ok: true });
    capture('plan_submission');

    // Instructor activity while the learner workspace is mounted.
    expect(runner.setInstructorCaseObservation({
      considerationId: 'consider_npo',
      status: 'observed',
      note: 'LEAK_INSTRUCTOR_NOTE',
    })).toMatchObject({ ok: true });
    capture('after_instructor_observation');

    expect(runner.submitCasePlan({ selections: { disposition: 'proceed' } }))
      .toMatchObject({ ok: true });
    capture('after_plan_submitted');

    expect(runner.advanceCaseStage({ stage: 'debrief_draft' })).toMatchObject({ ok: true });
    capture('debrief_draft');

    expect(runner.finalizeCaseDebrief()).toMatchObject({ ok: true });
    capture('finalized');

    // eslint-disable-next-line no-console
    console.log(`LEAK_PROBE_STAGES: ${JSON.stringify(observed, null, 2)}`);
    const totalLeaks = observed.flatMap(({ leaks }) => leaks);
    expect(totalLeaks).toEqual([]);
  });

  test('the probe is live: sentinels do reach the authorized instructor panel', () => {
    const runner = new SimRunner();
    const dom = makeConsoleDom();
    const controller = createLiveCaseController({ runner, root: dom.root });
    loadProbeCase(runner);
    controller.render();

    // If this ever returns nothing, the probe has stopped proving anything.
    const reached = instructorHtml(dom).match(SENTINEL) ?? [];
    // eslint-disable-next-line no-console
    console.log(`LEAK_PROBE_CONTROL_INSTRUCTOR_PANEL: ${JSON.stringify([...new Set(reached)])}`);
    expect(reached.length).toBeGreaterThan(0);
  });
});
