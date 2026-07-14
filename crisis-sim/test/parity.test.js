/* Parity suite — asserts the JS engine reproduces the frozen, non-NMB C#
   golden fixtures bit-for-bit (float32-exact). The rocuronium-bearing RSI
   fixture is retained on disk for provenance but its clinically incorrect NMB
   contract is retired in favor of FDA clinical-anchor evidence tests. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { RUNNERS } from './parityDriver.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const FX = join(HERE, 'fixtures', 'parity');
const f = Math.fround;

const RETIRED_NMB_PARITY_CASES = Object.freeze([
  'rsi_hypotension_001',
]);

const FROZEN_PARITY_CASES = Object.freeze([
  'high_spinal_001',
  'malignant_hyperthermia_001',
]);

const loadFixture = (id) => JSON.parse(readFileSync(join(FX, `${id}.json`), 'utf8'));

// float32-exact for numbers; strict for everything else. (Tolerance 1e-9 is
// trivially satisfied because equality here is bit-exact.)
function eq(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return f(a) === f(b);
  return a === b;
}

function collectSampleDiffs(fx, ac) {
  const diffs = [];
  if (fx.length !== ac.length) { diffs.push(`sample count ${ac.length} != ${fx.length}`); return diffs; }
  for (let i = 0; i < fx.length; i++) {
    for (const k of Object.keys(fx[i])) {
      if (!eq(fx[i][k], ac[i][k])) diffs.push(`sample#${i} tick=${fx[i].tick} ${k}: ${ac[i][k]} != ${fx[i][k]}`);
    }
  }
  return diffs;
}

function collectLogDiffs(fx, ac) {
  const diffs = [];
  if (fx.length !== ac.length) { diffs.push(`actionLog count ${ac.length} != ${fx.length}`); return diffs; }
  for (let i = 0; i < fx.length; i++) {
    for (const k of Object.keys(fx[i])) {
      if (!eq(fx[i][k], ac[i][k])) diffs.push(`actionLog#${i} ${k}: ${ac[i][k]} != ${fx[i][k]}`);
    }
  }
  return diffs;
}

function collectDebriefDiffs(fx, ac) {
  const diffs = [];
  for (const k of Object.keys(fx)) {
    const a = fx[k]; const b = ac[k];
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length || a.some((x, j) => x !== b[j])) {
        diffs.push(`debrief ${k}: ${JSON.stringify(b)} != ${JSON.stringify(a)}`);
      }
    } else if (!eq(a, b)) {
      diffs.push(`debrief ${k}: ${JSON.stringify(b)} != ${JSON.stringify(a)}`);
    }
  }
  return diffs;
}

describe('parity exposure boundary', () => {
  it('retires only fixtures with an administered rocuronium dose', () => {
    const hasRocuroniumAction = (id) => loadFixture(id).actionLog.some(
      (entry) => entry.drug?.toLowerCase() === 'rocuronium',
    );

    expect(RETIRED_NMB_PARITY_CASES.filter(hasRocuroniumAction)).toEqual(RETIRED_NMB_PARITY_CASES);
    expect(FROZEN_PARITY_CASES.filter(hasRocuroniumAction)).toEqual([]);
    expect([...RETIRED_NMB_PARITY_CASES, ...FROZEN_PARITY_CASES].sort()).toEqual(
      Object.keys(RUNNERS).sort(),
    );
  });
});

describe('frozen golden-fixture parity (C# → JS, float32-exact)', () => {
  for (const id of FROZEN_PARITY_CASES) {
    describe(id, () => {
      const fixture = loadFixture(id);
      const actual = RUNNERS[id]();

      it('final score & max score match', () => {
        expect(actual.finalScore).toBe(fixture.finalScore);
        expect(actual.maxScore).toBe(fixture.maxScore);
      });

      it(`every sampled tick matches (${fixture.samples.length} samples)`, () => {
        const diffs = collectSampleDiffs(fixture.samples, actual.samples);
        expect(diffs.slice(0, 10)).toEqual([]);
      });

      it(`every action-log entry matches (${fixture.actionLog.length} entries)`, () => {
        const diffs = collectLogDiffs(fixture.actionLog, actual.actionLog);
        expect(diffs.slice(0, 10)).toEqual([]);
      });

      it('debrief payload matches', () => {
        const diffs = collectDebriefDiffs(fixture.debrief, actual.debrief);
        expect(diffs.slice(0, 10)).toEqual([]);
      });
    });
  }
});
