import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { SimRunner } from '../ui/simRunner.js';
import {
  applyFinalizedConsoleLock,
  applyInstructorNmbTarget,
  applyInstructorRubricScore,
  bindRubricActionControls,
  buildRubricPresentationKey,
  finalizeRubricDebrief,
  focusPendingRubricItem,
  loadRubricScenarioAssets,
  renderRubricConsoleShell,
  renderRubricItemMarkup,
  runRubricFinalizationAction,
  setRubricConsoleReadOnly,
  syncClinicalDraftControls,
} from '../../ui/liveSimView.js';

const root = resolve(import.meta.dirname, '../..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

class FakeElement {
  constructor({ dataset = {}, value = '' } = {}) {
    this.dataset = dataset;
    this.value = value;
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  emit(type, target = this) {
    for (const listener of this.listeners.get(type) ?? []) listener({ target });
  }

  closest(selector) {
    if (selector === '[data-rubric-points]' && Object.hasOwn(this.dataset, 'rubricPoints')) {
      return this;
    }
    return null;
  }
}

describe('live rubric instructor console', () => {
  it('exposes cached live status and timestamped instructor scoring through the runner', () => {
    const scenario = JSON.parse(read('crisis-sim/sim/scenarios/rsi_full_stomach_001.json'));
    const rubric = JSON.parse(read('data/rubrics/carson-newman-rsi-induction.json'));
    const runner = new SimRunner();
    runner.loadRubricScenario({ scenario, rubric });

    const before = runner.getRubricStatus();
    expect(runner.getRubricStatus()).toBe(before);
    expect(runner.getRubricDiscrepancies()).toEqual([{
      code: 'SOURCE_DENOMINATOR_MISMATCH',
      sourceHeaderDenominator: 49,
      computedMaxPoints: 106,
    }]);
    expect(runner.setInstructorScore({
      itemId: 'rsi-1', points: 1, note: 'PPE partially observed',
    })).toMatchObject({
      id: 'rsi-1', points: 1, note: 'PPE partially observed', status: 'partial',
    });
    const after = runner.getRubricStatus();
    expect(after).not.toBe(before);
    expect(after.actionLedger.at(-1)).toMatchObject({
      tSec: 0,
      action: 'instructor_rubric_score_set',
      meta: { itemId: 'rsi-1', points: 1, note: 'PPE partially observed', revision: 1 },
    });
  });

  it('renders the complete accessible console shell without replacing clinical controls', () => {
    const markup = renderRubricConsoleShell();
    for (const id of [
      'live-rubric-scenario', 'live-rubric-load', 'live-rubric-summary',
      'live-rubric-source-warning', 'live-rubric-flags', 'live-rubric-items',
      'live-rubric-finalization-status', 'live-instructor-nmb-custom',
      'live-instructor-nmb-apply', 'live-instructor-nmb-readback',
      'live-rubric-finalize', 'live-rubric-print',
    ]) expect(markup).toContain(`id="${id}"`);

    expect(markup.match(/<option value="(?:standard_iv_healthy_001|rsi_full_stomach_001|emergence_residual_block_001|rsi_failed_first_attempt_001)"/g))
      .toHaveLength(4);
    for (const target of ['0', '0.25', '0.50', '0.70', '0.90', '1']) {
      expect(markup).toContain(`data-nmb-target="${target}"`);
    }
    expect(markup).toContain('ADMINISTRATIVE SETUP');
    expect(markup).toContain('Not a student action and not scoreable');
    expect(markup).toContain('Actual TOF count');
    expect(markup).toContain('FINALIZE DEBRIEF');
    expect(markup).toContain('PRINT RUBRIC');
  });

  it('fetches both approved assets before atomically asking the runner to load them', async () => {
    const scenario = { id: 'rsi_full_stomach_001' };
    const rubric = { id: 'carson-newman-rsi-induction' };
    const fetchImpl = vi.fn(async (url) => ({
      ok: true,
      status: 200,
      json: async () => (url.includes('/scenarios/') ? scenario : rubric),
    }));
    const runner = { loadRubricScenario: vi.fn(() => ({ ok: true })) };

    await expect(loadRubricScenarioAssets(
      runner, 'rsi_full_stomach_001', fetchImpl,
    )).resolves.toEqual({ scenario, rubric, loaded: { ok: true } });
    expect(fetchImpl.mock.calls.map(([url]) => url)).toEqual([
      '/crisis-sim/sim/scenarios/rsi_full_stomach_001.json',
      '/data/rubrics/carson-newman-rsi-induction.json',
    ]);
    expect(runner.loadRubricScenario).toHaveBeenCalledWith({ scenario, rubric });

    const unavailableRunner = { loadRubricScenario: vi.fn() };
    const unavailableFetch = vi.fn(async () => ({ ok: false, status: 404 }));
    await expect(loadRubricScenarioAssets(
      unavailableRunner, 'standard_iv_healthy_001', unavailableFetch,
    )).rejects.toThrow(/unavailable/);
    expect(unavailableRunner.loadRubricScenario).not.toHaveBeenCalled();
  });

  it('shows literal text and source labels while restricting manual controls to instructor rows', () => {
    const literal = 'Confirm <airway> & monitor “exactly”';
    const engine = renderRubricItemMarkup({
      id: 'rsi-11', displayNumber: '11', text: literal, critical: true,
      scoringSource: 'ENGINE_OBSERVABLE', status: 'not_performed', points: 0,
      evidence: { actions: [] }, note: '',
    });
    expect(engine).toContain('11');
    expect(engine).toContain('Confirm &lt;airway&gt; &amp; monitor “exactly”');
    expect(engine).toContain('ENGINE OBSERVABLE');
    expect(engine).not.toContain('data-rubric-points');

    const instructor = renderRubricItemMarkup({
      id: 'rsi-1', displayNumber: '1', text: 'Don appropriate PPE', critical: true,
      scoringSource: 'INSTRUCTOR_OBSERVED', status: 'pending', points: null,
      evidence: null, note: '',
    });
    expect(instructor).toContain('INSTRUCTOR OBSERVED');
    expect(instructor.match(/data-rubric-points="[210]"/g)).toHaveLength(3);
    expect(instructor).toContain('aria-label="Score item 1 performed, 2 points"');
    expect(instructor).toContain('data-rubric-note="rsi-1"');
  });

  it('changes the bounded presentation key when live evidence or its timestamp changes', () => {
    const result = {
      rubricId: 'test-rubric', rawPoints: 0, maxPoints: 2, percentage: 0,
      finalized: false, outcome: null,
      pendingInstructorCount: 0, pendingEngineCount: 1, pendingUnscoreableCount: 0,
      items: [{
        id: 'engine-1', status: 'pending', points: null, note: '', updatedAtSec: 4,
        evidence: { ruleId: 'rule', actions: [], trace: [{ tSec: 4, observed: { spo2: 97 } }] },
      }],
      violations: [],
    };
    const original = buildRubricPresentationKey(result);
    const evidenceChanged = buildRubricPresentationKey({
      ...result,
      items: [{
        ...result.items[0],
        evidence: { ruleId: 'rule', actions: [], trace: [{ tSec: 5, observed: { spo2: 96 } }] },
      }],
    });
    const timestampChanged = buildRubricPresentationKey({
      ...result,
      items: [{ ...result.items[0], updatedAtSec: 5 }],
    });
    expect(evidenceChanged).not.toBe(original);
    expect(timestampChanged).not.toBe(original);
    expect(buildRubricPresentationKey({
      ...result,
      items: [{
        ...result.items[0],
        evidence: { trace: [{ observed: { spo2: 97 }, tSec: 4 }], actions: [], ruleId: 'rule' },
      }],
    })).toBe(original);
    expect(original.length).toBeLessThan(2_000);
  });

  it('wires real score and 0.70 preset listener paths to the public runner', () => {
    const itemList = new FakeElement();
    const scoreButton = new FakeElement({
      dataset: { rubricItem: 'rsi-11', rubricPoints: '0' },
    });
    const note = new FakeElement({
      dataset: { rubricNote: 'rsi-11' }, value: 'PPV before laryngoscopy',
    });
    const nmbPreset = new FakeElement({ dataset: { nmbTarget: '0.70' } });
    const rootElement = {
      querySelector: (selector) => (selector === '#live-rubric-items' ? itemList : null),
      querySelectorAll: (selector) => {
        if (selector === '[data-rubric-note]') return [note];
        if (selector === '[data-nmb-target]') return [nmbPreset];
        return [];
      },
    };
    const runner = {
      setInstructorScore: vi.fn(() => ({ id: 'rsi-11', points: 0 })),
      setInstructorNmbTarget: vi.fn(() => ({ targetTofRatio: 0.7 })),
    };
    const onScore = vi.fn();
    const onNmb = vi.fn();
    bindRubricActionControls({
      rootElement, getRunner: () => runner, onScore, onNmb, onError: vi.fn(),
    });

    itemList.emit('click', scoreButton);
    nmbPreset.emit('click');
    expect(runner.setInstructorScore).toHaveBeenCalledWith({
      itemId: 'rsi-11', points: 0, note: 'PPV before laryngoscopy',
    });
    expect(onScore).toHaveBeenCalledWith({ id: 'rsi-11', points: 0 });
    expect(runner.setInstructorNmbTarget).toHaveBeenCalledWith({ targetTofRatio: 0.7 });
    expect(onNmb).toHaveBeenCalledWith({ targetTofRatio: 0.7 });
  });

  it('runs the actual pending-finalization path and scrolls/focuses the first row', () => {
    const scoreControl = { focus: vi.fn() };
    const row = {
      scrollIntoView: vi.fn(),
      querySelector: vi.fn(() => scoreControl),
      focus: vi.fn(),
    };
    const documentRoot = {
      getElementById: vi.fn((id) => (id === 'live-rubric-item-rsi-1' ? row : null)),
    };
    const runner = {
      finalizeRubric: vi.fn(() => ({
        ok: false,
        reason: 'INSTRUCTOR_SCORES_PENDING',
        pendingItemIds: ['rsi-1', 'rsi-2'],
      })),
      buildDebrief: vi.fn(),
    };
    const onPending = vi.fn();
    const result = runRubricFinalizationAction({ runner, documentRoot, onPending });
    expect(result).toMatchObject({ ok: false, pendingItemIds: ['rsi-1', 'rsi-2'] });
    expect(onPending).toHaveBeenCalledWith(result);
    expect(documentRoot.getElementById).toHaveBeenCalledWith('live-rubric-item-rsi-1');
    expect(row.scrollIntoView).toHaveBeenCalledWith({ block: 'center', behavior: 'smooth' });
    expect(scoreControl.focus).toHaveBeenCalledOnce();
    expect(row.focus).not.toHaveBeenCalled();
    expect(runner.buildDebrief).not.toHaveBeenCalled();
    expect(focusPendingRubricItem(documentRoot, 'missing')).toBeNull();
  });

  it('pauses on successful finalization and locks mutation controls while leaving exit/new-case actions', () => {
    const callOrder = [];
    const runner = {
      finalizeRubric: vi.fn(() => ({ ok: true, outcome: 'PASS' })),
      buildDebrief: vi.fn(() => {
        callOrder.push('build');
        return { rubricResult: { outcome: 'PASS' } };
      }),
      pause: vi.fn(() => callOrder.push('pause')),
    };
    const onFinalized = vi.fn(() => callOrder.push('finalized'));
    expect(runRubricFinalizationAction({ runner, documentRoot: {}, onFinalized }))
      .toMatchObject({ ok: true });
    expect(runner.pause).toHaveBeenCalledOnce();
    expect(callOrder).toEqual(['pause', 'build', 'finalized']);

    const controls = [
      { id: 'live-start', disabled: false, dataset: {} },
      { id: 'live-machine-form-control', disabled: false, dataset: {} },
      { id: '', disabled: false, dataset: { rubricPoints: '2' } },
      { id: '', disabled: false, dataset: { nmbTarget: '0.70' } },
      { id: 'live-rubric-finalize', disabled: false, dataset: {} },
      { id: 'live-rubric-load', disabled: false, dataset: {} },
      { id: 'live-rubric-scenario', disabled: false, dataset: {} },
      { id: 'live-reset', disabled: false, dataset: {} },
      { id: 'live-rubric-print', disabled: false, dataset: {} },
      { id: 'live-export', disabled: false, dataset: {} },
      { id: 'live-close', disabled: false, dataset: {} },
      { id: 'live-open-display', disabled: false, dataset: {} },
    ];
    const consoleRoot = { querySelectorAll: vi.fn(() => controls) };
    setRubricConsoleReadOnly(consoleRoot, true);
    expect(controls.slice(0, 5).map(({ disabled }) => disabled)).toEqual([
      true, true, true, true, true,
    ]);
    expect(controls.slice(5).every(({ disabled }) => disabled === false)).toBe(true);
    setRubricConsoleReadOnly(consoleRoot, false);
    expect(controls.every(({ disabled }) => disabled === false)).toBe(true);
    expect(read('ui/liveSimView.js')).toContain('FINALIZED · READ ONLY');
  });

  it('reapplies the finalized lock after a later snapshot-derived control update', () => {
    const start = { id: 'live-start', disabled: false, dataset: {} };
    const intubate = { id: '', disabled: false, dataset: {} };
    const ppv = { id: 'live-mask-ppv', disabled: false, dataset: {} };
    const display = { id: 'live-open-display', disabled: false, dataset: {} };
    const controls = [start, intubate, ppv, display];
    const rootElement = { querySelectorAll: vi.fn(() => controls), dataset: {} };
    const runner = { isRubricFinalized: vi.fn(() => true) };

    setRubricConsoleReadOnly(rootElement, true);
    expect([start.disabled, intubate.disabled, ppv.disabled]).toEqual([true, true, true]);
    start.disabled = false;
    intubate.disabled = false;
    ppv.disabled = false;

    expect(applyFinalizedConsoleLock({ rootElement, runner })).toBe(true);
    expect([start.disabled, intubate.disabled, ppv.disabled]).toEqual([true, true, true]);
    expect(display.disabled).toBe(false);
    expect(runner.isRubricFinalized).toHaveBeenCalledOnce();
    expect(read('ui/liveSimView.js')).toMatch(
      /applyFinalizedConsoleLock\(\{ rootElement: view, runner \}\);\s*transport\?\.publishSnapshot/,
    );
  });

  it('synchronizes emergence machine and volatile drafts from the loaded engine snapshot', () => {
    const runner = new SimRunner();
    const scenario = JSON.parse(read('crisis-sim/sim/scenarios/emergence_residual_block_001.json'));
    const rubric = JSON.parse(read('data/rubrics/carson-newman-anesthesia-emergence.json'));
    runner.loadRubricScenario({ scenario, rubric });
    const snapshot = runner.snapshot();
    expect(snapshot).toMatchObject({
      airwayDevice: 'intubated', ventMode: 1, ventSetFiO2: 0.5,
      ventSetTV: 500, ventSetRR: 12, ventSetPeep: 5,
      vaporizerAgent: 'Sevoflurane', vaporizer: 2,
    });

    const names = [
      'mode', 'setTidalVolume', 'setRespiratoryRate', 'setPeep',
      'setPressureAbovePeep', 'setPressureSupport', 'setFiO2',
      'o2FlowLPerMin', 'airFlowLPerMin', 'n2oFlowLPerMin',
    ];
    const controls = new Map(names.map((name) => [name, { value: 'stale' }]));
    const form = { elements: { namedItem: (name) => controls.get(name) ?? null } };
    const dial = { value: 'stale' };
    const documentRoot = {
      getElementById: (id) => {
        if (id === 'live-machine-form') return form;
        if (id === 'live-volatile-dial') return dial;
        return null;
      },
    };
    const onVolatileAgent = vi.fn();
    const draft = syncClinicalDraftControls({ documentRoot, snapshot, onVolatileAgent });
    expect(Object.fromEntries([...controls].map(([name, control]) => [name, control.value])))
      .toEqual({
        mode: '1', setTidalVolume: '500', setRespiratoryRate: '12', setPeep: '5',
        setPressureAbovePeep: '15', setPressureSupport: '10', setFiO2: '0.5',
        o2FlowLPerMin: '2', airFlowLPerMin: '0', n2oFlowLPerMin: '0',
      });
    expect(dial.value).toBe('2');
    expect(onVolatileAgent).toHaveBeenCalledWith('Sevoflurane');
    expect(draft.ventMode).toBe(1);
    expect(read('ui/liveSimView.js')).toContain('syncCaseSetupControls(liveRunner.snapshot())');
  });

  it('uses non-animated pending focus and list scrolling under reduced motion', () => {
    const scoreControl = { focus: vi.fn() };
    const row = {
      scrollIntoView: vi.fn(),
      querySelector: vi.fn(() => scoreControl),
    };
    const documentRoot = { getElementById: vi.fn(() => row) };
    focusPendingRubricItem(documentRoot, 'rsi-1', { prefersReducedMotion: true });
    expect(row.scrollIntoView).toHaveBeenCalledWith({ block: 'center', behavior: 'auto' });
    const css = read('assets/css/live-sim.css');
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce[\s\S]*\.live-rubric-items\s*\{\s*scroll-behavior:\s*auto;/);
  });

  it('routes instructor scoring and NMB targets only through public runner APIs', () => {
    const runner = {
      setInstructorScore: vi.fn(() => ({ id: 'rsi-1', points: 1 })),
      setInstructorNmbTarget: vi.fn(() => ({ targetTofRatio: 0.7 })),
      setDriver: vi.fn(),
      snapshot: vi.fn(),
    };
    expect(applyInstructorRubricScore(runner, {
      itemId: 'rsi-1', points: 1, note: 'partial observation',
    })).toEqual({ id: 'rsi-1', points: 1 });
    expect(runner.setInstructorScore).toHaveBeenCalledWith({
      itemId: 'rsi-1', points: 1, note: 'partial observation',
    });

    expect(applyInstructorNmbTarget(runner, '0.70')).toEqual({ targetTofRatio: 0.7 });
    expect(runner.setInstructorNmbTarget).toHaveBeenCalledWith({ targetTofRatio: 0.7 });
    expect(runner.setDriver).not.toHaveBeenCalled();
    expect(runner.snapshot).not.toHaveBeenCalled();
  });

  it('does not build a debrief while instructor observations remain pending', () => {
    const pendingRunner = {
      finalizeRubric: vi.fn(() => ({
        ok: false, reason: 'INSTRUCTOR_SCORES_PENDING', pendingItemIds: ['rsi-1', 'rsi-2'],
      })),
      buildDebrief: vi.fn(),
    };
    expect(finalizeRubricDebrief(pendingRunner)).toEqual({
      ok: false, reason: 'INSTRUCTOR_SCORES_PENDING', pendingItemIds: ['rsi-1', 'rsi-2'],
    });
    expect(pendingRunner.buildDebrief).not.toHaveBeenCalled();

    const debrief = { rubricResult: { outcome: 'PASS' } };
    const readyRunner = {
      finalizeRubric: vi.fn(() => ({ ok: true, outcome: 'PASS' })),
      buildDebrief: vi.fn(() => debrief),
    };
    expect(finalizeRubricDebrief(readyRunner)).toEqual({
      ok: true, finalized: { ok: true, outcome: 'PASS' }, debrief,
    });
  });

  it('keeps the implementation on the engine truth boundary and makes rubric scrolling independent', () => {
    const controller = read('ui/liveSimView.js');
    const css = read('assets/css/live-sim.css');
    expect(controller).toContain('liveRunner.loadRubricScenario({ scenario, rubric })');
    expect(controller).toContain('liveRunner.getRubricStatus()');
    expect(controller).toContain('liveRunner.setInstructorScore');
    expect(controller).toContain('liveRunner.setInstructorNmbTarget({ targetTofRatio })');
    expect(controller).not.toContain('liveRunner.setDriver(');
    expect(controller).not.toMatch(/latestSnapshot\.(?:hr|sbp|dbp|map|spo2|rr|etco2|tofRatio)\s*=/);
    expect(css).toMatch(/\.live-rubric-panel\s*\{[^}]*position:\s*sticky[^}]*overflow:\s*hidden/s);
    expect(css).toMatch(/\.live-rubric-items\s*\{[^}]*overflow-y:\s*auto/s);
  });
});
