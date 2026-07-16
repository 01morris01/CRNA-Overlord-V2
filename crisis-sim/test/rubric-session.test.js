import { describe, expect, test } from 'vitest';
import emergenceRaw from '../../data/rubrics/carson-newman-anesthesia-emergence.json';
import rsiRaw from '../../data/rubrics/carson-newman-rsi-induction.json';
import { RubricScoringSession } from '../sim/index.js';
import { normalizeRubric } from '../sim/scenario/rubricLoader.js';

const POINT_SCALE = { performed: 2, partial: 1, notPerformed: 0 };
const PASS_RULE = { minimumPercent: 85, requireEveryCriticalPerformed: true };

function makeRubric({
  id = 'test-rubric',
  count = 2,
  criticalIndexes = [0],
  sources = [],
} = {}) {
  const critical = new Set(criticalIndexes);
  const items = Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    displayNumber: `${index + 1}`,
    text: `Literal item ${index + 1}`,
    critical: critical.has(index),
    pointScale: { ...POINT_SCALE },
    scoringSource: sources[index] ?? 'INSTRUCTOR_OBSERVED',
    engineEvidence: null,
  }));

  return {
    id,
    title: `Rubric ${id}`,
    course: 'Test Course',
    sourceFile: `${id}.pdf`,
    sourceSha256: 'a'.repeat(64),
    sourceHeaderDenominator: count * 2,
    sourceFootnoteScoredItems: count,
    computedItemCount: count,
    computedMaxPoints: count * 2,
    computedCriticalCount: critical.size,
    discrepancies: [],
    pointScale: { ...POINT_SCALE },
    passRule: { ...PASS_RULE },
    items,
  };
}

function scoreAll(session, points, startSec = 1) {
  points.forEach((value, index) => {
    session.setInstructorScore({
      itemId: `item-${index + 1}`,
      points: value,
      tSec: startSec + index,
    });
  });
}

describe('RubricScoringSession construction and initial state', () => {
  test('normalizes raw rubric input, copies criteria, stores the seed, and does not mutate inputs', () => {
    const raw = makeRubric();
    const normalized = normalizeRubric(makeRubric({ id: 'normalized-rubric' }));
    const criteria = { nested: { values: [1, 2] } };
    const session = new RubricScoringSession({ rubric: raw, criteria, seed: 9876 });
    const normalizedSession = new RubricScoringSession({ rubric: normalized });

    raw.title = 'caller mutation';
    raw.items[0].text = 'caller mutation';
    criteria.nested.values.push(3);

    expect(session.rubric.title).toBe('Rubric test-rubric');
    expect(session.rubric.items[0].text).toBe('Literal item 1');
    expect(session.criteria).toEqual({ nested: { values: [1, 2] } });
    expect(Object.isFrozen(session.criteria.nested.values)).toBe(true);
    expect(session.seed).toBe(9876);
    expect(Object.isFrozen(session.rubric)).toBe(true);
    expect(normalizedSession.rubric).toEqual(normalized);
    expect(normalizedSession.rubric).not.toBe(normalized);
  });

  test.each([
    [null],
    [[]],
    [new Date()],
    [Object.create({ inherited: true })],
  ])('rejects non-plain constructor criteria %#', (criteria) => {
    expect(() => new RubricScoringSession({ rubric: makeRubric(), criteria })).toThrow(/criteria/);
  });

  test.each([
    [-1],
    [0x100000000],
    [1.5],
    [Number.NaN],
    [Number.POSITIVE_INFINITY],
    ['1'],
    [null],
  ])('rejects invalid uint32 seed %#', (seed) => {
    expect(() => new RubricScoringSession({ rubric: makeRubric(), seed })).toThrow(/seed/);
  });

  test('accepts both uint32 seed boundaries', () => {
    expect(new RubricScoringSession({ rubric: makeRubric(), seed: 0 }).seed).toBe(0);
    expect(new RubricScoringSession({ rubric: makeRubric(), seed: 0xffffffff }).seed)
      .toBe(0xffffffff);
  });

  test('starts every item pending with null points and preserves scoring-source identity', () => {
    const raw = makeRubric({ sources: ['INSTRUCTOR_OBSERVED', 'UNSCOREABLE'] });
    const session = new RubricScoringSession({ rubric: raw });
    const instructor = session.getItemStatus('item-1');
    const unscoreable = session.getItemStatus('item-2');
    const engine = new RubricScoringSession({ rubric: emergenceRaw })
      .getItemStatus('emergence-2');
    const live = session.getLiveResult();

    expect(instructor).toMatchObject({
      id: 'item-1',
      displayNumber: '1',
      text: 'Literal item 1',
      critical: true,
      scoringSource: 'INSTRUCTOR_OBSERVED',
      status: 'pending',
      points: null,
      note: '',
      updatedAtSec: null,
      evidence: null,
    });
    expect(unscoreable).toMatchObject({
      scoringSource: 'UNSCOREABLE',
      status: 'pending',
      points: null,
    });
    expect(engine).toMatchObject({
      scoringSource: 'ENGINE_OBSERVABLE',
      status: 'pending',
      points: null,
    });
    expect(live).toMatchObject({
      rawPoints: 0,
      maxPoints: 4,
      percentage: 0,
      provisional: true,
      incomplete: true,
      pendingInstructorCount: 1,
      pendingEngineCount: 0,
      pendingUnscoreableCount: 1,
      finalized: false,
      outcome: null,
    });
  });

  test('sums only resolved points against the encoded computed denominator', () => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    session.setInstructorScore({ itemId: 'item-1', points: 1, tSec: 1 });

    expect(session.getLiveResult()).toMatchObject({
      rawPoints: 1,
      maxPoints: 4,
      percentage: 25,
      pendingInstructorCount: 1,
      provisional: true,
      incomplete: true,
    });
    expect(new RubricScoringSession({ rubric: rsiRaw }).getLiveResult()).toMatchObject({
      maxPoints: 106,
      rawPoints: 0,
      percentage: 0,
    });
  });
});

describe('RubricScoringSession JSON-safe evidence', () => {
  test.each([
    [{ meta: null }, /meta/],
    [{ meta: [] }, /meta/],
    [{ meta: new Date() }, /meta/],
    [{ meta: Object.create({ inherited: true }) }, /meta/],
    [{ snapshot: null }, /snapshot/],
    [{ snapshot: [] }, /snapshot/],
    [{ snapshot: new Date() }, /snapshot/],
    [{ snapshot: Object.create({ inherited: true }) }, /snapshot/],
  ])('rejects malformed action evidence top-level input %#', (fields, message) => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    expect(() => session.recordAction({ tSec: 0, action: 'test', ...fields })).toThrow(message);
  });

  test.each([
    ['NaN', () => ({ bad: Number.NaN })],
    ['Infinity', () => ({ bad: Number.POSITIVE_INFINITY })],
    ['undefined', () => ({ bad: undefined })],
    ['bigint', () => ({ bad: 1n })],
    ['symbol', () => ({ bad: Symbol('bad') })],
    ['function', () => ({ bad: () => {} })],
    ['custom prototype', () => ({ bad: Object.create({ inherited: true }) })],
    ['nested Date', () => ({ bad: new Date() })],
    ['sparse array', () => ({ bad: Array(1) })],
    ['sparse array with an extra property', () => {
      const array = Array(1);
      array.extra = 'not an indexed element';
      return { bad: array };
    }],
    ['symbol key', () => ({ bad: { [Symbol('key')]: true } })],
    ['cycle', () => {
      const cycle = {};
      cycle.self = cycle;
      return { bad: cycle };
    }],
  ])('rejects recursively unsafe %s values', (_name, makeUnsafe) => {
    expect(() => new RubricScoringSession({
      rubric: makeRubric(), criteria: makeUnsafe(),
    })).toThrow(/JSON-safe|cycle|Dangerous/);

    const actionSession = new RubricScoringSession({ rubric: makeRubric() });
    expect(() => actionSession.recordAction({
      tSec: 0, action: 'test', meta: makeUnsafe(),
    })).toThrow(/JSON-safe|cycle|Dangerous/);
    expect(() => actionSession.recordAction({
      tSec: 0, action: 'test', snapshot: makeUnsafe(),
    })).toThrow(/JSON-safe|cycle|Dangerous/);

    const traceSession = new RubricScoringSession({ rubric: makeRubric() });
    expect(() => traceSession.recordTrace({ t: 0, payload: makeUnsafe() })).toThrow(
      /JSON-safe|cycle|Dangerous/,
    );
  });

  test.each(['__proto__', 'prototype', 'constructor'])(
    'rejects dangerous %s keys at nested levels',
    (key) => {
      const unsafe = { nested: JSON.parse(`{"${key}":{"polluted":true}}`) };
      const session = new RubricScoringSession({ rubric: makeRubric() });

      expect(() => session.recordAction({
        tSec: 0, action: 'test', meta: unsafe,
      })).toThrow(/Dangerous/);
      expect(() => session.recordTrace({ t: 0, unsafe })).toThrow(/Dangerous/);
    },
  );

  test.each([
    ['Array subclass with overridden map', () => {
      class UntrustedArray extends Array {
        map() { return [Number.NaN]; }
      }
      return new UntrustedArray('safe input');
    }],
    ['array with a replaced prototype', () => {
      const array = ['safe input'];
      Object.setPrototypeOf(array, { map: Array.prototype.map });
      return array;
    }],
    ['array with a null prototype', () => {
      const array = ['safe input'];
      Object.setPrototypeOf(array, null);
      return array;
    }],
    ['array with an own non-enumerable map', () => {
      const array = ['safe input'];
      Object.defineProperty(array, 'map', {
        value: () => [Number.NaN],
      });
      return array;
    }],
    ['array with an extra string property', () => {
      const array = ['safe input'];
      array.extra = true;
      return array;
    }],
  ])('rejects %s', (_name, makeArray) => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    expect(() => session.recordAction({
      tSec: 0,
      action: 'test',
      meta: { values: makeArray() },
    })).toThrow(/JSON-safe|ordinary array/);
  });

  test('rejects an accessor array index without invoking it', () => {
    let accessed = false;
    const array = [];
    Object.defineProperty(array, '0', {
      enumerable: true,
      get() {
        accessed = true;
        return 'safe input';
      },
    });
    const session = new RubricScoringSession({ rubric: makeRubric() });

    expect(() => session.recordAction({
      tSec: 0,
      action: 'test',
      meta: { values: array },
    })).toThrow(/JSON-safe|data propert|array index/);
    expect(accessed).toBe(false);
  });

  test('accepts ordinary nested arrays and returns a copied frozen representation', () => {
    const values = [1, { nested: [2, null] }];
    const session = new RubricScoringSession({ rubric: makeRubric() });
    const record = session.recordAction({
      tSec: 0,
      action: 'test',
      meta: { values },
    });
    values[1].nested[0] = 99;

    expect(record.meta.values).toEqual([1, { nested: [2, null] }]);
    expect(record.meta.values).not.toBe(values);
    expect(Object.getPrototypeOf(record.meta.values)).toBe(Array.prototype);
    expect(Object.isFrozen(record.meta.values)).toBe(true);
    expect(Object.isFrozen(record.meta.values[1].nested)).toBe(true);
  });

  test('normalizes an omitted action snapshot to JSON-safe null', () => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    expect(session.recordAction({ tSec: 0, action: 'test' })).toEqual({
      tSec: 0,
      action: 'test',
      meta: {},
      snapshot: null,
    });
  });
});

describe('RubricScoringSession action ledger', () => {
  test('deep-copies action data and returns an immutable record', () => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    const meta = { nested: { value: 1 } };
    const snapshot = { vitals: { spo2: 99 } };
    const record = session.recordAction({ tSec: 1.25, action: 'custom_action', meta, snapshot });

    meta.nested.value = 7;
    snapshot.vitals.spo2 = 50;

    expect(record).toEqual({
      tSec: 1.25,
      action: 'custom_action',
      meta: { nested: { value: 1 } },
      snapshot: { vitals: { spo2: 99 } },
    });
    expect(Object.isFrozen(record)).toBe(true);
    expect(Object.isFrozen(record.meta.nested)).toBe(true);
    expect(() => { record.meta.nested.value = 8; }).toThrow(TypeError);
    expect(session.getLiveResult().actionLedger).toEqual([record]);
  });

  test.each([
    [{ action: 'valid' }, /tSec/],
    [{ tSec: -1, action: 'valid' }, /tSec/],
    [{ tSec: Number.NaN, action: 'valid' }, /tSec/],
    [{ tSec: Number.POSITIVE_INFINITY, action: 'valid' }, /tSec/],
    [{ tSec: 0 }, /action/],
    [{ tSec: 0, action: '' }, /action/],
    [{ tSec: 0, action: '   ' }, /action/],
  ])('rejects invalid action input %#', (input, message) => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    expect(() => session.recordAction(input)).toThrow(message);
  });

  test('keeps equal action timestamps stable and rejects backward timestamps', () => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    session.recordAction({ tSec: 2, action: 'first' });
    session.recordAction({ tSec: 2, action: 'second' });

    expect(session.getLiveResult().actionLedger.map(({ action }) => action)).toEqual([
      'first',
      'second',
    ]);
    expect(() => session.recordAction({ tSec: 1, action: 'backward' })).toThrow(/nondecreasing/);
    expect(session.getLiveResult().actionLedger).toHaveLength(2);
  });
});

describe('RubricScoringSession trace', () => {
  test('sorts samples, replaces duplicate timestamps in place, and deep-copies snapshots', () => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    const late = { t: 10, nested: { value: 'late' } };
    const early = { t: 2, nested: { value: 'early' } };

    session.recordTrace(late);
    session.recordTrace(early);
    const replacement = session.recordTrace({ t: 10, nested: { value: 'replacement' } });
    late.nested.value = 'caller mutation';
    early.nested.value = 'caller mutation';

    const trace = session.getLiveResult().trace;
    expect(trace).toEqual([
      { t: 2, nested: { value: 'early' } },
      { t: 10, nested: { value: 'replacement' } },
    ]);
    expect(replacement).toEqual({ t: 10, nested: { value: 'replacement' } });
    expect(Object.isFrozen(replacement.nested)).toBe(true);
    expect(() => { trace[0].nested.value = 'mutation'; }).toThrow(TypeError);
    expect(session.getLiveResult().trace[0].nested.value).toBe('early');
  });

  test.each([
    [null],
    [[]],
    [{}],
    [{ t: -1 }],
    [{ t: 1.5 }],
    [{ t: Number.NaN }],
    [{ t: Number.POSITIVE_INFINITY }],
    [{ t: Number.MAX_SAFE_INTEGER + 1 }],
    [new Date()],
    [Object.create({ t: 1 })],
  ])('rejects invalid trace sample %#', (sample) => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    expect(() => session.recordTrace(sample)).toThrow(/snapshot|timestamp|\.t/);
  });
});

describe('RubricScoringSession instructor scoring', () => {
  test('maps the 0/1/2 scale and retains every revision in history', () => {
    const session = new RubricScoringSession({ rubric: makeRubric() });

    session.setInstructorScore({
      itemId: 'item-1', points: 2, note: 'first', tSec: 3,
    });
    const current = session.setInstructorScore({
      itemId: 'item-1', points: 1, note: 'revised', tSec: 5,
    });

    expect(current).toMatchObject({
      status: 'partial',
      points: 1,
      note: 'revised',
      updatedAtSec: 5,
    });
    expect(session.getLiveResult().actionLedger).toEqual([
      {
        tSec: 3,
        action: 'instructor_rubric_score_set',
        meta: { itemId: 'item-1', points: 2, note: 'first', revision: 1 },
        snapshot: null,
      },
      {
        tSec: 5,
        action: 'instructor_rubric_score_set',
        meta: { itemId: 'item-1', points: 1, note: 'revised', revision: 2 },
        snapshot: null,
      },
    ]);

    session.setInstructorScore({ itemId: 'item-1', points: 0, tSec: 6 });
    expect(session.getItemStatus('item-1').status).toBe('not_performed');
  });

  test('allows equal-time revisions and rejects backward revisions atomically', () => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    session.setInstructorScore({ itemId: 'item-1', points: 2, note: 'first', tSec: 5 });
    session.setInstructorScore({ itemId: 'item-1', points: 1, note: 'equal', tSec: 5 });

    expect(() => session.setInstructorScore({
      itemId: 'item-1', points: 0, note: 'backward', tSec: 4,
    })).toThrow(/nondecreasing/);
    expect(session.getItemStatus('item-1')).toMatchObject({
      points: 1,
      note: 'equal',
      updatedAtSec: 5,
    });
    expect(session.getLiveResult().actionLedger.map(({ meta }) => meta.revision)).toEqual([1, 2]);
  });

  test('rejects engine, unscoreable, and unknown item overrides', () => {
    const engineSession = new RubricScoringSession({ rubric: emergenceRaw });
    const unscoreableSession = new RubricScoringSession({
      rubric: makeRubric({ sources: ['UNSCOREABLE', 'INSTRUCTOR_OBSERVED'] }),
    });

    expect(() => engineSession.setInstructorScore({
      itemId: 'emergence-2', points: 2, tSec: 1,
    })).toThrow(/INSTRUCTOR_OBSERVED/);
    expect(() => unscoreableSession.setInstructorScore({
      itemId: 'item-1', points: 2, tSec: 1,
    })).toThrow(/INSTRUCTOR_OBSERVED/);
    expect(() => unscoreableSession.setInstructorScore({
      itemId: 'missing', points: 2, tSec: 1,
    })).toThrow(/Unknown rubric item/);
    expect(() => unscoreableSession.getItemStatus('missing')).toThrow(/Unknown rubric item/);
  });

  test.each([
    [{ itemId: 'item-1', points: -1, tSec: 1 }, /points/],
    [{ itemId: 'item-1', points: 3, tSec: 1 }, /points/],
    [{ itemId: 'item-1', points: 1.5, tSec: 1 }, /points/],
    [{ itemId: 'item-1', points: 2, note: null, tSec: 1 }, /note/],
    [{ itemId: 'item-1', points: 2, tSec: -1 }, /tSec/],
    [{ itemId: 'item-1', points: 2, tSec: Number.NaN }, /tSec/],
    [{ itemId: 'item-1', points: 2, tSec: Number.POSITIVE_INFINITY }, /tSec/],
  ])('rejects invalid instructor score input %#', (input, message) => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    expect(() => session.setInstructorScore(input)).toThrow(message);
  });

  test('reports only resolved critical items below two as omitted', () => {
    const session = new RubricScoringSession({ rubric: makeRubric() });

    expect(session.getLiveResult().criticalItemsOmitted).toEqual([]);
    session.setInstructorScore({ itemId: 'item-1', points: 1, tSec: 1 });
    expect(session.getLiveResult().criticalItemsOmitted).toEqual(['item-1']);
    session.setInstructorScore({ itemId: 'item-1', points: 0, tSec: 2 });
    expect(session.getLiveResult().criticalItemsOmitted).toEqual(['item-1']);
  });

  test('returns immutable item and live-result copies', () => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    const item = session.getItemStatus('item-1');
    const result = session.getLiveResult();

    expect(Object.isFrozen(item)).toBe(true);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.items)).toBe(true);
    expect(Object.isFrozen(result.items[0])).toBe(true);
    expect(Object.isFrozen(result.actionLedger)).toBe(true);
    expect(Object.isFrozen(result.trace)).toBe(true);
    expect(Object.isFrozen(result.violations)).toBe(true);
    expect(() => { item.status = 'performed'; }).toThrow(TypeError);
    expect(() => { result.items[0].points = 2; }).toThrow(TypeError);
    expect(session.getItemStatus('item-1').points).toBeNull();
  });

  test('caches immutable live projections and invalidates after every mutation type', () => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    const initial = session.getLiveResult();
    expect(session.getLiveResult()).toBe(initial);

    session.recordAction({ tSec: 0, action: 'first' });
    const afterAction = session.getLiveResult();
    expect(afterAction).not.toBe(initial);
    expect(session.getLiveResult()).toBe(afterAction);

    session.recordTrace({ t: 3, value: 'trace' });
    const afterTrace = session.getLiveResult();
    expect(afterTrace).not.toBe(afterAction);
    expect(session.getLiveResult()).toBe(afterTrace);

    session.recordTrace({ t: 3, value: 'replacement' });
    const afterTraceReplacement = session.getLiveResult();
    expect(afterTraceReplacement).not.toBe(afterTrace);
    expect(afterTraceReplacement.trace).toEqual([{ t: 3, value: 'replacement' }]);

    session.setInstructorScore({ itemId: 'item-1', points: 2, tSec: 1 });
    const afterScore = session.getLiveResult();
    expect(afterScore).not.toBe(afterTraceReplacement);
    expect(session.getLiveResult()).toBe(afterScore);
  });
});

describe('RubricScoringSession finalization', () => {
  test('rejects pending instructor scores without sealing the session', () => {
    const session = new RubricScoringSession({ rubric: makeRubric() });

    expect(session.finalize({ tSec: 5 })).toEqual({
      ok: false,
      reason: 'INSTRUCTOR_SCORES_PENDING',
      pendingItemIds: ['item-1', 'item-2'],
    });
    expect(session.getLiveResult()).toMatchObject({ finalized: false, outcome: null });
    expect(() => session.setInstructorScore({ itemId: 'item-1', points: 2, tSec: 6 })).not.toThrow();
  });

  test('rejects pending engine scores after instructor scores are complete', () => {
    const session = new RubricScoringSession({ rubric: emergenceRaw });
    for (const item of session.rubric.items) {
      if (item.scoringSource === 'INSTRUCTOR_OBSERVED') {
        session.setInstructorScore({ itemId: item.id, points: 2, tSec: 1 });
      }
    }

    const result = session.finalize({ tSec: 5 });
    expect(result).toEqual({
      ok: false,
      reason: 'ENGINE_SCORES_PENDING',
      pendingItemIds: ['emergence-2', 'emergence-3', 'emergence-4'],
    });
    expect(session.getLiveResult().finalized).toBe(false);
  });

  test.each([
    {
      name: '90% with a partial critical item is NOT PASS',
      points: [1, ...Array(44).fill(2), 1, ...Array(4).fill(0)],
      percentage: 90,
      outcome: 'NOT PASS',
      omitted: ['item-1'],
    },
    {
      name: '84% with every critical item performed is NOT PASS',
      points: [...Array(42).fill(2), ...Array(8).fill(0)],
      percentage: 84,
      outcome: 'NOT PASS',
      omitted: [],
    },
    {
      name: '86% with every critical item performed is PASS',
      points: [...Array(43).fill(2), ...Array(7).fill(0)],
      percentage: 86,
      outcome: 'PASS',
      omitted: [],
    },
  ])('$name', ({ points, percentage, outcome, omitted }) => {
    const session = new RubricScoringSession({
      rubric: makeRubric({ count: 50, criticalIndexes: [0] }),
    });
    scoreAll(session, points);

    const result = session.finalize({ tSec: 100 });
    expect(result).toMatchObject({
      ok: true,
      rawPoints: percentage,
      maxPoints: 100,
      percentage,
      criticalItemsOmitted: omitted,
      pendingInstructorCount: 0,
      pendingEngineCount: 0,
      pendingUnscoreableCount: 0,
      provisional: false,
      incomplete: false,
      finalized: true,
      finalizedAtSec: 100,
      outcome,
    });
  });

  test('rejects UNSCOREABLE items after instructor and engine pending gates', () => {
    const session = new RubricScoringSession({
      rubric: makeRubric({
        count: 10,
        criticalIndexes: [0],
        sources: ['UNSCOREABLE'],
      }),
    });
    for (let index = 1; index < 10; index += 1) {
      session.setInstructorScore({ itemId: `item-${index + 1}`, points: 2, tSec: index });
    }

    const result = session.finalize({ tSec: 20 });
    expect(result).toEqual({
      ok: false,
      reason: 'UNSCOREABLE_ITEMS_PRESENT',
      pendingItemIds: ['item-1'],
    });
    expect(session.getLiveResult()).toMatchObject({
      pendingUnscoreableCount: 1,
      incomplete: true,
      finalized: false,
      outcome: null,
    });
  });

  test('rejects finalization before the latest session time and accepts the exact latest time', () => {
    const session = new RubricScoringSession({ rubric: makeRubric({ count: 1 }) });
    session.setInstructorScore({ itemId: 'item-1', points: 2, tSec: 5 });
    session.recordTrace({ t: 10, value: 'latest' });

    expect(() => session.finalize({ tSec: 9 })).toThrow(/latest session time.*10/);
    expect(session.getLiveResult()).toMatchObject({ finalized: false, outcome: null });
    expect(session.finalize({ tSec: 10 })).toMatchObject({
      finalized: true,
      finalizedAtSec: 10,
      outcome: 'PASS',
    });
  });

  test('is idempotent after success and seals every mutation method', () => {
    const session = new RubricScoringSession({ rubric: makeRubric({ count: 1 }) });
    session.setInstructorScore({ itemId: 'item-1', points: 2, tSec: 1 });
    const first = session.finalize({ tSec: 2 });
    const second = session.finalize({ tSec: 0 });
    const third = session.finalize();

    expect(second).toEqual(first);
    expect(second).toBe(first);
    expect(third).toBe(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.items[0])).toBe(true);
    expect(() => session.setInstructorScore({ itemId: 'item-1', points: 0, tSec: 3 })).toThrow(/finalized/);
    expect(() => session.recordAction({ tSec: 3, action: 'late' })).toThrow(/finalized/);
    expect(() => session.recordTrace({ t: 3 })).toThrow(/finalized/);
    expect(first.finalizedAtSec).toBe(2);
    expect(session.getLiveResult()).toBe(first);
  });

  test.each([
    [{}],
    [{ tSec: -1 }],
    [{ tSec: Number.NaN }],
    [{ tSec: Number.POSITIVE_INFINITY }],
  ])('rejects invalid finalization time %#', (input) => {
    const session = new RubricScoringSession({ rubric: makeRubric() });
    expect(() => session.finalize(input)).toThrow(/tSec/);
  });
});
