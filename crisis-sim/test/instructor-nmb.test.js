import { describe, expect, it } from 'vitest';
import emergenceRubric from '../../data/rubrics/carson-newman-anesthesia-emergence.json';
import {
  rocuroniumBlockFromCe, rocuroniumCeFromBlockade,
} from '../sim/neuromuscularModel.js';
import { SimRunner } from '../ui/simRunner.js';

const TARGETS = [0, 0.25, 0.5, 0.7, 0.9, 1];

function derivedNmbState(runner) {
  return {
    trainOfFourRatio: runner.p.trainOfFourRatio,
    trainOfFourCount: runner.p.trainOfFourCount,
    effectiveNmbBlockade: runner.p.effectiveNmbBlockade,
    respiratoryMuscleCapability: runner.p.respiratoryMuscleCapability,
  };
}

describe('rocuronium inverse Hill mapping', () => {
  it('returns finite float32 concentrations and round-trips representative blockade', () => {
    for (const blockade of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 0.9999]) {
      const ce = rocuroniumCeFromBlockade(blockade);
      expect(Number.isFinite(ce)).toBe(true);
      expect(ce).toBe(Math.fround(ce));
      expect(rocuroniumBlockFromCe(ce)).toBeCloseTo(blockade, 5);
    }
  });

  it('sanitizes endpoints without returning Infinity or NaN', () => {
    expect(rocuroniumCeFromBlockade(-1)).toBe(0);
    expect(rocuroniumCeFromBlockade(Number.NaN)).toBe(0);
    expect(rocuroniumCeFromBlockade(Number.NEGATIVE_INFINITY)).toBe(0);
    for (const blockade of [1, 2, Number.POSITIVE_INFINITY]) {
      const ce = rocuroniumCeFromBlockade(blockade);
      expect(Number.isFinite(ce)).toBe(true);
      expect(ce).toBe(Math.fround(ce));
      expect(rocuroniumBlockFromCe(ce)).toBeCloseTo(0.9999, 4);
    }
  });
});

describe('instructor NMB target through the single rocuronium state', () => {
  it.each(TARGETS)('preserves target %s and converges by normal fixed-step physiology', (targetTofRatio) => {
    const runner = new SimRunner();
    const before = derivedNmbState(runner);

    const returned = runner.setInstructorNmbTarget({ targetTofRatio });

    expect(returned).toMatchObject({
      source: 'administrative',
      targetTofRatio,
      actualTofRatio: before.trainOfFourRatio,
      actualTofCount: before.trainOfFourCount,
      effectiveNmbBlockade: before.effectiveNmbBlockade,
      equilibrating: targetTofRatio !== 1,
    });
    expect(derivedNmbState(runner)).toEqual(before);
    expect(Number.isFinite(returned.rocuroniumCe)).toBe(true);

    runner.stepFor(20);
    const status = runner.snapshot().instructorNmbTarget;
    expect(status.targetTofRatio).toBe(targetTofRatio);
    expect(status.actualTofRatio).toBeCloseTo(targetTofRatio, 1);
    expect(status.equilibrating).toBe(false);
    if (targetTofRatio < 0.99) {
      expect(status.dominantNmbSource).toBe('rocuronium');
    } else {
      expect(status.dominantNmbSource).toBe('none');
    }
  });

  it('does not synchronously write patient-derived NMB or respiratory fields', () => {
    const runner = new SimRunner();
    runner.giveBolus('Rocuronium', 20);
    runner.pause();
    runner.stepFor(2);
    const before = derivedNmbState(runner);

    runner.setInstructorNmbTarget({ targetTofRatio: 0.25 });

    expect(derivedNmbState(runner)).toEqual(before);
    runner.stepFor(10);
    expect(runner.p.trainOfFourRatio).toBeLessThan(before.trainOfFourRatio);
    expect(runner.p.respiratoryMuscleCapability)
      .toBeCloseTo(Math.min(1, runner.p.trainOfFourRatio / Math.fround(0.9)), 5);
    expect(runner.p.dominantNmbSource).toBe('rocuronium');
  });

  it('lets existing reversal improve the same overridden rocuronium state', () => {
    const runner = new SimRunner();
    runner.setInstructorNmbTarget({ targetTofRatio: 0.25 });
    runner.stepFor(20);
    const beforeReversal = runner.p.trainOfFourRatio;

    runner.d.administerBolus('Sugammadex', runner.p.weightKg * 4);
    runner.stepFor(100);

    expect(runner.p.sugammadexRocRelief).toBeGreaterThan(0.95);
    expect(runner.p.trainOfFourRatio).toBeGreaterThan(beforeReversal);
    expect(runner.p.effectiveNmbBlockade).toBeLessThan(0.1);
  });

  it('replaces succinylcholine and clears all prior reversal exposure and relief', () => {
    const runner = new SimRunner();
    runner.d.administerBolus('Succinylcholine', 100);
    runner.stepFor(20);
    runner.d.administerSugammadex(runner.p.weightKg * 4);
    runner.d.administerNeostigmine(4.9);
    runner.d.updateReversalAgents(30);
    expect(runner.d._suxC1).toBeGreaterThan(0);
    expect(runner.d._suxCe).toBeGreaterThan(0);
    expect(runner.d._sugammadexAdministered).toBe(true);
    expect(runner.d._neostigmineAdministered).toBe(true);

    runner.setInstructorNmbTarget({ targetTofRatio: 0.5 });

    expect(runner.d).toMatchObject({
      _suxC1: 0,
      _suxCe: 0,
      _sugammadexRocRelief: 0,
      _sugammadexReliefTarget: 0,
      _sugammadexReliefRate: 0,
      _sugammadexAdministered: false,
      _neoC1: 0,
      _neoCe: 0,
      _neostigmineRocRelief: 0,
      _neostigmineReliefTarget: 0,
      _neostigmineReliefRate: 0,
      _neostigmineAdministered: false,
    });
    runner.stepFor(10);
    expect(runner.p.succinylcholineCe).toBe(0);
    expect(runner.p.dominantNmbSource).toBe('rocuronium');
  });
});

describe('SimRunner instructor NMB administrative contract', () => {
  it('exposes an explicit null status before a target and defensive copies afterward', () => {
    const runner = new SimRunner();
    expect(runner.snapshot().instructorNmbTarget).toBeNull();

    const returned = runner.setInstructorNmbTarget({ targetTofRatio: 0.7 });
    const firstSnapshot = runner.snapshot();
    returned.targetTofRatio = 0;
    firstSnapshot.instructorNmbTarget.targetTofRatio = 0;

    expect(runner.snapshot().instructorNmbTarget).toMatchObject({
      source: 'administrative',
      targetTofRatio: 0.7,
      actualTofRatio: 1,
      actualTofCount: 4,
      effectiveNmbBlockade: 0,
      dominantNmbSource: 'none',
      tolerance: expect.any(Number),
      equilibrating: true,
    });
  });

  it('logs one administrative action with immediate actual state and no learner aliases', () => {
    const runner = new SimRunner();
    const session = runner.attachRubricSession({
      rubric: emergenceRubric,
      criteria: { weightKg: 70 },
    });

    runner.setInstructorNmbTarget({ targetTofRatio: 0.5 });

    expect(runner.log).toHaveLength(1);
    expect(runner.log[0]).toMatchObject({
      kind: 'Instructor NMB',
      meta: {
        action: 'instructor_nmb_depth_set',
        source: 'administrative',
        targetTofRatio: 0.5,
        actualTofRatio: 1,
        actualTofCount: 4,
        effectiveNmbBlockade: 0,
        dominantNmbSource: 'none',
        tolerance: expect.any(Number),
        equilibrating: true,
      },
    });
    const ledger = session.getLiveResult().actionLedger;
    expect(ledger).toHaveLength(1);
    expect(ledger[0]).toMatchObject({
      action: 'instructor_nmb_depth_set',
      meta: { source: 'administrative', targetTofRatio: 0.5 },
      snapshot: { t: 0, tofRatio: 1, effectiveNmbBlockade: 0 },
    });
    expect(ledger.map(({ action }) => action)).not.toContain('tof_checked');
    expect(ledger.map(({ action }) => action)).not.toContain('drug');
    expect(ledger.map(({ action }) => action).some((action) => action.includes('reversal')))
      .toBe(false);
  });

  it.each([
    ['numeric string', '0.5'],
    ['NaN', Number.NaN],
    ['positive infinity', Number.POSITIVE_INFINITY],
    ['negative infinity', Number.NEGATIVE_INFINITY],
    ['below range', -0.01],
    ['above range', 1.01],
    ['null', null],
  ])('rejects %s before any mutation or logging', (_label, invalidTarget) => {
    const runner = new SimRunner();
    const session = runner.attachRubricSession({
      rubric: emergenceRubric,
      criteria: { weightKg: 70 },
    });
    const drugState = {
      rocC1: runner.d._rocuroniumC1,
      rocCe: runner.d._rocuroniumCe,
      suxC1: runner.d._suxC1,
      suxCe: runner.d._suxCe,
    };

    expect(() => runner.setInstructorNmbTarget({ targetTofRatio: invalidTarget }))
      .toThrow(/targetTofRatio/);

    expect({
      rocC1: runner.d._rocuroniumC1,
      rocCe: runner.d._rocuroniumCe,
      suxC1: runner.d._suxC1,
      suxCe: runner.d._suxCe,
    }).toEqual(drugState);
    expect(runner.snapshot().instructorNmbTarget).toBeNull();
    expect(runner.log).toEqual([]);
    expect(session.getLiveResult().actionLedger).toEqual([]);
  });

  it('defensively rejects invalid direct DrugSystem input', () => {
    const runner = new SimRunner();
    expect(() => runner.d.setAdministrativeNmbTarget({ targetTofRatio: '0.5' }))
      .toThrow(/targetTofRatio/);
    expect(() => runner.d.setAdministrativeNmbTarget({ targetTofRatio: Number.NaN }))
      .toThrow(/targetTofRatio/);
    expect(() => runner.d.setAdministrativeNmbTarget({ targetTofRatio: 2 }))
      .toThrow(/targetTofRatio/);
    expect(runner.d._rocuroniumC1).toBe(0);
    expect(runner.d._rocuroniumCe).toBe(0);
  });
});

describe('SimRunner rebuild snapshot coherence', () => {
  it('reset emits only the rebuilt t=0 snapshot with the administrative target cleared', () => {
    const runner = new SimRunner();
    runner.setInstructorNmbTarget({ targetTofRatio: 0.25 });
    runner.stepFor(1);
    const emissions = [];
    runner.onTick = (snapshot) => emissions.push(snapshot);

    runner.reset();

    expect(emissions).toHaveLength(1);
    expect(emissions[0]).toMatchObject({
      t: 0,
      running: false,
      lifecycle: 'READY',
      instructorNmbTarget: null,
      tofRatio: 1,
      effectiveNmbBlockade: 0,
    });
  });

  it('applyConfig never emits stale physiology or target metadata under new demographics', () => {
    const runner = new SimRunner();
    runner.setInstructorNmbTarget({ targetTofRatio: 0.25 });
    runner.stepFor(1);
    runner.start();
    const emissions = [];
    runner.onTick = (snapshot) => emissions.push(snapshot);

    runner.applyConfig({
      weightKg: 90,
      ageYears: 60,
      sex: 'Female',
      baselineHR: 88,
    });

    expect(emissions).toHaveLength(1);
    expect(emissions[0]).toMatchObject({
      t: 0,
      running: true,
      lifecycle: 'RUNNING',
      instructorNmbTarget: null,
      tofRatio: 1,
      effectiveNmbBlockade: 0,
      hr: 88,
      weightKg: 90,
      patient: '90 kg · 60 y · Female',
    });
    runner.pause();
  });

  it('keeps explicit public pause observable through one paused snapshot', () => {
    const runner = new SimRunner();
    runner.stepFor(1);
    runner.start();
    const emissions = [];
    runner.onTick = (snapshot) => emissions.push(snapshot);

    runner.pause();

    expect(emissions).toHaveLength(1);
    expect(emissions[0]).toMatchObject({
      t: runner.simTime,
      running: false,
      lifecycle: 'PAUSED',
    });
  });
});
