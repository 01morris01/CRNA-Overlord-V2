/* Phase 2: the instructor-only teaching-beat control. Proves an instructor can
   fire a scheduled instructor event (bronchospasm) from the mounted console,
   and that the available instructor event ids and their metadata never reach
   the learner workspace projection or the learner transport snapshot. */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { SimRunner, VentMode } from '../ui/simRunner.js';
import { renderInstructorCaseMarkup, renderLearnerCaseMarkup } from '../../ui/liveCaseModel.js';
import { createLiveCaseController } from '../../ui/liveCaseView.js';
import { projectLearnerMonitorSnapshot } from '../../ui/liveSimTransport.js';

const KAREN = JSON.parse(readFileSync(new URL('../sim/scenarios/cn_preassessment_lap_chole_001.json', import.meta.url), 'utf8'));

function driveToInductionPhase() {
  const r = new SimRunner();
  r.loadCaseScenario({ scenario: KAREN });
  r.advanceCaseStage({ stage: 'interview' });
  r.performAssessmentAction({ actionId: 'ask_asthma_control' });
  r.advanceCaseStage({ stage: 'focused_exam' });
  r.performAssessmentAction({ actionId: 'exam_airway' });
  r.advanceCaseStage({ stage: 'findings_summary' });
  r.submitCaseFindings({ findingIds: ['mild_asthma', 'airway_assessed'] });
  r.advanceCaseStage({ stage: 'plan_submission' });
  r.submitCasePlan({
    selections: {
      disposition: 'proceed', asa_class: 'II', reactive_airway: 'sevoflurane_albuterol_ready',
      ponv_prophylaxis: 'multimodal', vte_prophylaxis: 'mechanical_scd', analgesia: 'multimodal_no_codeine',
    },
  });
  r.advanceCasePhase(); // preinduction -> induction_airway
  return r;
}

describe('instructor teaching-beat control', () => {
  test('the instructor projection exposes the fireable beat; the learner does not', () => {
    const r = driveToInductionPhase();
    const instructor = r.getInstructorCaseContext();
    expect(instructor.flowState.availableInstructorEventIds).toContain('bronchospasm_onset');

    const learner = r.getLearnerCaseContext();
    // The event id must not appear anywhere in the learner workspace projection.
    expect(JSON.stringify(learner)).not.toContain('bronchospasm_onset');
    expect(JSON.stringify(learner)).not.toContain('availableInstructorEventIds');
    // The learner flow state is limited to phase title and paused only.
    expect(Object.keys(learner.flowState ?? {}).sort()).toEqual(['currentPhaseTitle', 'paused']);
  });

  test('the instructor markup renders the beat button; the learner markup never does', () => {
    const r = driveToInductionPhase();
    const instructorMarkup = renderInstructorCaseMarkup(r.getInstructorCaseContext());
    expect(instructorMarkup.instructorEvents).toContain('data-case-event="bronchospasm_onset"');

    const learnerHtml = JSON.stringify(renderLearnerCaseMarkup(r.getLearnerCaseContext()));
    expect(learnerHtml).not.toContain('bronchospasm_onset');
    expect(learnerHtml).not.toContain('data-case-event');
  });

  test('the learner transport snapshot carries no case-event data', () => {
    const r = driveToInductionPhase();
    const learnerSnapshot = projectLearnerMonitorSnapshot(r.snapshot());
    expect(JSON.stringify(learnerSnapshot)).not.toContain('bronchospasm');
    expect(JSON.stringify(learnerSnapshot)).not.toContain('event');
  });

  test('clicking the beat button fires the event and injects the complication', () => {
    class EvtEl {
      constructor(id = '') { this.id = id; this.dataset = {}; this.disabled = false; this.innerHTML = ''; this.textContent = ''; this.value = ''; this.listeners = new Map(); this.queryMap = {}; }

      addEventListener(t, fn) { const a = this.listeners.get(t) ?? []; a.push(fn); this.listeners.set(t, a); }

      removeEventListener() {}

      insertAdjacentHTML() {}

      emit(t, target = this) { for (const fn of this.listeners.get(t) ?? []) fn({ target, currentTarget: this }); }

      closest(sel) {
        const m = /^\[data-([a-z-]+)\]$/.exec(sel);
        if (!m) return null;
        const key = m[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return Object.hasOwn(this.dataset, key) ? this : null;
      }

      querySelector() { return null; }

      querySelectorAll(s) { return this.queryMap[s] ?? []; }
    }
    const ids = [
      'live-case-workspace', 'live-case-status', 'live-case-notes', 'live-case-submit-findings',
      'live-case-submit-plan', 'live-case-instructor', 'live-case-current-phase', 'live-case-active-event',
      'live-case-pause', 'live-case-advance', 'live-case-branches', 'live-case-events',
      'live-case-considerations', 'live-case-history', 'live-case-print',
    ];
    const byId = Object.fromEntries(ids.map((id) => [id, new EvtEl(id)]));
    const regions = Object.fromEntries(['chart', 'interview', 'exam', 'findings', 'plan'].map((r) => [r, new EvtEl()]));
    const root = {
      querySelector(sel) {
        if (sel.startsWith('#')) return byId[sel.slice(1)] ?? null;
        const m = /^\[data-case-region-content="([a-z]+)"\]$/.exec(sel);
        return m ? regions[m[1]] ?? null : null;
      },
    };

    const runner = driveToInductionPhase();
    // Set up a ventilated intubated patient so bronchospasm has an airway to obstruct.
    const w = runner.config.weightKg;
    runner.setMachine({ o2FlowLPerMin: 2, airFlowLPerMin: 2, setFiO2: 0.5 });
    runner.giveBolus('Propofol', 2 * w, 'ind');
    runner.giveBolus('Rocuronium', 0.6 * w, 'nmb');
    runner.pause(); runner.stepFor(30);
    runner.intubate();
    runner.setVentMode(VentMode.VCV);
    runner.setMachine({ setTidalVolume: Math.round(7 * w), setRespiratoryRate: 12, setFiO2: 0.5 });
    runner.pause(); runner.stepFor(30);
    const beforePpeak = runner.snapshot().ppeak;

    const controller = createLiveCaseController({ runner, root });
    controller.render();
    // The instructor panel now holds a fireable beat button.
    const instructorPanel = byId['live-case-instructor'];
    const eventButton = new EvtEl();
    eventButton.dataset.caseEvent = 'bronchospasm_onset';
    // Fire the button through the instructor click handler (event delegation).
    instructorPanel.emit('click', eventButton);

    runner.pause(); runner.stepFor(20);
    const after = runner.snapshot();
    expect(after.ppeak).toBeGreaterThan(30);
    expect(after.ppeak).toBeGreaterThan(beforePpeak);
    expect(after.spo2).toBeLessThan(95);
  });
});
