/* Fast first-divergence finder for the parity port. Run: node test/diagnose.mjs

   Retirement policy (mirrors test/parity.test.js): rocuronium-bearing RSI
   fixtures encode a clinically incorrect C# NMB contract that was deliberately
   retired in favor of FDA clinical-anchor evidence tests (neuromuscular.test.js,
   lidocaine-evidence). Their divergence from the frozen fixture is EXPECTED and
   correct, so it is shown for provenance but does not count as a parity failure.
   A retired case is detected the same way parity.test.js validates it: an
   administered rocuronium dose in its action log. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { RUNNERS } from './parityDriver.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const FX = join(HERE, 'fixtures', 'parity');
const f = Math.fround;

const isRetiredNmbCase = (fixture) => fixture.actionLog.some(
  (entry) => entry.drug?.toLowerCase() === 'rocuronium',
);

function cmpNum(a, b) { return f(a) === f(b); }

function diffSamples(id, fixtureSamples, actualSamples) {
  if (fixtureSamples.length !== actualSamples.length) {
    return `sample COUNT: fixture ${fixtureSamples.length} vs actual ${actualSamples.length}`;
  }
  for (let i = 0; i < fixtureSamples.length; i++) {
    const fx = fixtureSamples[i];
    const ac = actualSamples[i];
    for (const k of Object.keys(fx)) {
      const fv = fx[k]; const av = ac[k];
      const bothNum = typeof fv === 'number' && typeof av === 'number';
      const ok = bothNum ? cmpNum(fv, av) : fv === av;
      if (!ok) {
        return `sample #${i} tick=${fx.tick} field '${k}': fixture=${fv} actual=${av} (Δ=${bothNum ? av - fv : 'n/a'})`;
      }
    }
  }
  return null;
}

function diffActionLog(fxLog, acLog) {
  if (fxLog.length !== acLog.length) return `actionLog COUNT: fixture ${fxLog.length} vs actual ${acLog.length}`;
  for (let i = 0; i < fxLog.length; i++) {
    const fx = fxLog[i]; const ac = acLog[i];
    for (const k of Object.keys(fx)) {
      const fv = fx[k]; const av = ac[k];
      const bothNum = typeof fv === 'number' && typeof av === 'number';
      const ok = bothNum ? cmpNum(fv, av) : fv === av;
      if (!ok) return `actionLog #${i} '${fx.action}' field '${k}': fixture=${fv} actual=${av}`;
    }
  }
  return null;
}

function diffDebrief(fx, ac) {
  if (!fx || !ac) return `debrief missing: fixture=${!!fx} actual=${!!ac}`;
  for (const k of Object.keys(fx)) {
    const fv = fx[k]; const av = ac[k];
    if (Array.isArray(fv)) {
      if (!Array.isArray(av) || av.length !== fv.length || fv.some((x, j) => x !== av[j])) {
        return `debrief '${k}': fixture=${JSON.stringify(fv)} actual=${JSON.stringify(av)}`;
      }
    } else if (typeof fv === 'number' && typeof av === 'number') {
      if (!cmpNum(fv, av)) return `debrief '${k}': fixture=${fv} actual=${av}`;
    } else if (fv !== av) {
      return `debrief '${k}': fixture=${JSON.stringify(fv)} actual=${JSON.stringify(av)}`;
    }
  }
  return null;
}

let anyFail = false;
for (const id of Object.keys(RUNNERS)) {
  const fixture = JSON.parse(readFileSync(join(FX, `${id}.json`), 'utf8'));
  const actual = RUNNERS[id]();
  const retired = isRetiredNmbCase(fixture);
  const sd = diffSamples(id, fixture.samples, actual.samples);
  const ld = diffActionLog(fixture.actionLog, actual.actionLog);
  const dd = diffDebrief(fixture.debrief, actual.debrief);
  const scoreOk = fixture.finalScore === actual.finalScore && fixture.maxScore === actual.maxScore;
  const pass = !sd && !ld && !dd && scoreOk;
  // Frozen (non-rocuronium) fixtures must match bit-for-bit. Retired NMB cases
  // are expected to diverge (deliberate clinical correction), so their diff is
  // reported for provenance but never fails the parity verdict.
  if (!pass && !retired) anyFail = true;
  console.log(`\n===== ${id}${retired ? ' [RETIRED NMB — divergence expected]' : ''} =====`);
  console.log(`  samples: ${fixture.samples.length}  score: ${actual.finalScore}/${actual.maxScore} (fixture ${fixture.finalScore}/${fixture.maxScore})`);
  console.log(`  first sample diff: ${sd || 'NONE ✓'}${sd && retired ? ' (expected — retired NMB contract)' : ''}`);
  console.log(`  first actionLog diff: ${ld || 'NONE ✓'}${ld && retired ? ' (expected — retired NMB contract)' : ''}`);
  console.log(`  debrief diff: ${dd || 'NONE ✓'}`);
}
console.log(anyFail ? '\nRESULT: FAIL' : '\nRESULT: ALL FROZEN PARITY OK (retired NMB cases excluded)');
process.exit(anyFail ? 1 : 0);
