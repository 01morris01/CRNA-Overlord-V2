/* Phase 1 wiring test: the case print action must be reachable (not dead code)
   and must never emit instructor-only content. Drives a case to finalized,
   runs the print action against a fake document, and greps the written print
   document innerHTML for sentinels. */
import { describe, expect, test } from 'vitest';
import standardScenario from '../sim/scenarios/standard_iv_healthy_001.json';
import { SimRunner } from '../ui/simRunner.js';
import { makeCaseExperience } from './helpers/caseFixtures.js';
import { runCasePrintAction } from '../../ui/liveSimView.js';
import { renderInstructorCaseShell } from '../../ui/liveCaseModel.js';
import { createLiveCaseController } from '../../ui/liveCaseView.js';

const SENTINEL = /LEAK_[A-Z_]+/g;

function seedForbidden(experience) {
  experience.assessment.actions.push({
    id: 'ask_secret', stage: 'interview', domain: 'airway',
    prompt: 'Concealed', response: 'LEAK_UNCOMPLETED_ACTION_RESPONSE',
    reveals: ['hidden'], prerequisites: [], scoringRuleId: 'discover_secret', critical: false,
  });
  experience.assessment.findings.push({
    id: 'hidden', learnerLabel: 'LEAK_UNDISCOVERED_FINDING_LABEL',
    significance: 'LEAK_UNDISCOVERED_FINDING_SIGNIFICANCE',
    initiallyVisible: false, instructorOnlyUntilDiscovered: true,
  });
  experience.assessment.scoringRules.push({
    id: 'discover_secret', label: 'Concealed rule', critical: false,
    source: 'ENGINE_OBSERVABLE', evidence: { type: 'assessment_action', actionId: 'ask_secret' },
  });
  const [released] = experience.instructorGuide.considerations;
  released.scoringGuidance = 'LEAK_SCORING_GUIDANCE';
  released.redFlags = ['LEAK_RED_FLAG'];
  released.defaultRevealInDebrief = true;
  experience.instructorGuide.considerations.push({
    id: 'consider_hidden', phaseId: 'assessment', eventId: 'assessment_ready',
    title: 'LEAK_UNRELEASED_TITLE', consideration: 'LEAK_UNRELEASED_BODY',
    expectedResponse: 'LEAK_UNRELEASED_EXPECTED', responseWindowSec: 0,
    redFlags: ['LEAK_UNRELEASED_RED_FLAG'], scoringGuidance: 'LEAK_UNRELEASED_GUIDANCE',
    defaultRevealInDebrief: false,
  });
  return experience;
}

class FakeEl {
  constructor(id = '') { this.id = id; this.value = ''; this.innerHTML = ''; this.hidden = true; this.dataset = {}; }

  querySelector() { return null; }
}

function makeDocRoot(ids) {
  const byId = Object.fromEntries(ids.map((id) => [id, new FakeEl(id)]));
  return { root: { getElementById: (id) => byId[id] ?? null }, byId };
}

function finalizedRunner() {
  const runner = new SimRunner();
  const scenario = structuredClone(standardScenario);
  scenario.id = 'cn_print_wiring_001';
  scenario.caseExperience = seedForbidden(makeCaseExperience());
  runner.loadCaseScenario({ scenario });
  runner.advanceCaseStage({ stage: 'interview' });
  runner.performAssessmentAction({ actionId: 'ask_npo' });
  runner.advanceCaseStage({ stage: 'focused_exam' });
  runner.advanceCaseStage({ stage: 'findings_summary' });
  runner.submitCaseFindings({ findingIds: ['npo_ok'] });
  runner.advanceCaseStage({ stage: 'plan_submission' });
  runner.submitCasePlan({ selections: { disposition: 'proceed' }, rationale: 'Standard induction.' });
  runner.advanceCaseStage({ stage: 'debrief_draft' });
  runner.setInstructorCaseObservation({ considerationId: 'consider_npo', status: 'observed', note: 'Asked timing' });
  runner.setInstructorCaseObservation({ considerationId: 'consider_hidden', status: 'observed' });
  const finalized = runner.finalizeCaseDebrief();
  if (!finalized.ok) throw new Error(`finalize failed: ${finalized.reason}`);
  return runner;
}

describe('case print action is wired and reachable', () => {
  test('the instructor case shell exposes a print document and button', () => {
    const shell = renderInstructorCaseShell();
    expect(shell).toContain('live-case-print-document');
    expect(shell).toContain('live-case-print');
  });

  test('running the action writes the case record into the print document', () => {
    const runner = finalizedRunner();
    const { root, byId } = makeDocRoot(['live-case-print-document', 'live-case-print-status']);
    let printed = 0;
    const result = runCasePrintAction({ runner, documentRoot: root, printImpl: () => { printed += 1; } });
    expect(result).toMatchObject({ ok: true, caseId: 'cn_print_wiring_001' });
    expect(printed).toBe(1);
    const html = byId['live-case-print-document'].innerHTML;
    for (const heading of ['Assessment', 'Anesthetic Plan', 'Event Timeline', 'Instructor Observations', 'Released Teaching Feedback']) {
      expect(html).toContain(heading);
    }
    expect(byId['live-case-print-document'].hidden).toBe(false);
  });

  test('the printed document contains no instructor-only sentinel', () => {
    const runner = finalizedRunner();
    const { root, byId } = makeDocRoot(['live-case-print-document', 'live-case-print-status']);
    runCasePrintAction({ runner, documentRoot: root, printImpl: () => {} });
    const html = byId['live-case-print-document'].innerHTML;
    const leaks = [...new Set(html.match(SENTINEL) ?? [])];
    // eslint-disable-next-line no-console
    console.log(`CASE_PRINT_WIRING_LEAKS: ${JSON.stringify(leaks)}`);
    expect(leaks).toEqual([]);
    expect(html).not.toContain('scoringGuidance');
    expect(html).not.toContain('redFlags');
  });

  test('the controller enables the print button when finalized and firing it invokes onPrint', () => {
    class EvtEl {
      constructor(id = '') { this.id = id; this.dataset = {}; this.disabled = true; this.innerHTML = ''; this.textContent = ''; this.value = ''; this.listeners = new Map(); this.queryMap = {}; }

      addEventListener(t, fn) { (this.listeners.get(t) ?? this.listeners.set(t, []).get(t)).push(fn); }

      removeEventListener() {}

      insertAdjacentHTML() {}

      emit(t) { for (const fn of this.listeners.get(t) ?? []) fn({ target: this, currentTarget: this }); }

      closest() { return null; }

      querySelector() { return null; }

      querySelectorAll(s) { return this.queryMap[s] ?? []; }
    }
    const ids = [
      'live-case-workspace', 'live-case-status', 'live-case-notes', 'live-case-submit-findings',
      'live-case-submit-plan', 'live-case-instructor', 'live-case-current-phase', 'live-case-active-event',
      'live-case-pause', 'live-case-advance', 'live-case-branches', 'live-case-considerations',
      'live-case-history', 'live-case-print',
    ];
    const byId = Object.fromEntries(ids.map((id) => [id, new EvtEl(id)]));
    const regions = Object.fromEntries(['chart', 'interview', 'exam', 'findings', 'plan']
      .map((r) => [r, new EvtEl()]));
    const root = {
      querySelector(sel) {
        if (sel.startsWith('#')) return byId[sel.slice(1)] ?? null;
        const m = /^\[data-case-region-content="([a-z]+)"\]$/.exec(sel);
        return m ? regions[m[1]] ?? null : null;
      },
    };
    const runner = finalizedRunner();
    let printed = 0;
    const controller = createLiveCaseController({ runner, root, onPrint: () => { printed += 1; } });
    controller.render();
    // Finalized -> button enabled.
    expect(byId['live-case-print'].disabled).toBe(false);
    byId['live-case-print'].emit('click');
    expect(printed).toBe(1);
  });

  test('refuses to print an unfinalized case', () => {
    const runner = new SimRunner();
    const scenario = structuredClone(standardScenario);
    scenario.id = 'cn_print_wiring_002';
    scenario.caseExperience = makeCaseExperience();
    runner.loadCaseScenario({ scenario });
    const { root } = makeDocRoot(['live-case-print-document']);
    expect(runCasePrintAction({ runner, documentRoot: root, printImpl: () => {} }))
      .toMatchObject({ ok: false });
  });
});
