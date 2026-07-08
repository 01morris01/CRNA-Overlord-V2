/* Fast first-divergence finder for the parity port. Run: node test/diagnose.mjs */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { RUNNERS } from './parityDriver.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const FX = join(HERE, 'fixtures', 'parity');
const f = Math.fround;

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
  const sd = diffSamples(id, fixture.samples, actual.samples);
  const ld = diffActionLog(fixture.actionLog, actual.actionLog);
  const dd = diffDebrief(fixture.debrief, actual.debrief);
  const scoreOk = fixture.finalScore === actual.finalScore && fixture.maxScore === actual.maxScore;
  const pass = !sd && !ld && !dd && scoreOk;
  if (!pass) anyFail = true;
  console.log(`\n===== ${id} =====`);
  console.log(`  samples: ${fixture.samples.length}  score: ${actual.finalScore}/${actual.maxScore} (fixture ${fixture.finalScore}/${fixture.maxScore})`);
  console.log(`  first sample diff: ${sd || 'NONE ✓'}`);
  console.log(`  first actionLog diff: ${ld || 'NONE ✓'}`);
  console.log(`  debrief diff: ${dd || 'NONE ✓'}`);
}
console.log(anyFail ? '\nRESULT: FAIL' : '\nRESULT: ALL PARITY OK');
process.exit(anyFail ? 1 : 0);
