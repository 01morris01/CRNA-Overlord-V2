import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../..');
const sw = readFileSync(resolve(root, 'sw.js'), 'utf8');

const requiredAppShellEntries = [
  '/live-sim-display.html',
  '/assets/css/live-sim.css',
  '/assets/css/live-sim-display.css',
  '/ui/liveSimView.js',
  '/ui/liveSimDisplay.js',
  '/ui/liveWaveformRenderer.js',
  '/ui/liveSimModel.js',
  '/ui/liveSimTransport.js',
  '/crisis-sim/ui/simRunner.js',
  '/crisis-sim/sim/index.js',
  '/crisis-sim/sim/float32.js',
  '/crisis-sim/sim/simRandom.js',
  '/crisis-sim/sim/patientPhysiology.js',
  '/crisis-sim/sim/drugSystem.js',
  '/crisis-sim/sim/lidocaineSystem.js',
  '/crisis-sim/sim/neuromuscularModel.js',
  '/crisis-sim/sim/airwayProcedureSystem.js',
  '/crisis-sim/sim/ventilatorSystem.js',
  '/crisis-sim/sim/simulationCore.js',
  '/crisis-sim/sim/scenario/scenarioManager.js',
  '/crisis-sim/sim/scenario/scenarioLoader.js',
  '/crisis-sim/sim/scenario/scenarioState.js',
  '/crisis-sim/sim/scenario/scenarioScoring.js',
  '/crisis-sim/sim/scenario/scenarioDebrief.js',
  '/crisis-sim/sim/scenario/rubricLoader.js',
  '/crisis-sim/sim/scenario/rubricScoringSession.js',
  '/crisis-sim/sim/scenario/rubricRules.js',
  '/crisis-sim/sim/scenario/rubricDebrief.js',
  '/crisis-sim/sim/scenario/actionLogger.js',
  '/crisis-sim/sim/scenario/actionCatalog.js',
  '/data/rubrics/carson-newman-standard-iv-induction.json',
  '/data/rubrics/carson-newman-rsi-induction.json',
  '/data/rubrics/carson-newman-anesthesia-emergence.json',
  '/crisis-sim/sim/scenarios/standard_iv_healthy_001.json',
  '/crisis-sim/sim/scenarios/rsi_full_stomach_001.json',
  '/crisis-sim/sim/scenarios/emergence_residual_block_001.json',
  '/crisis-sim/sim/scenarios/rsi_failed_first_attempt_001.json',
];

function appShellEntries() {
  const literal = sw.match(/const APP_SHELL = \[([\s\S]*?)\n\];/)?.[1] ?? '';
  return [...literal.matchAll(/'([^']+)'/g)].map(([, entry]) => entry);
}

describe('live simulation PWA contract', () => {
  it('bumps the service worker version for installed clients', () => {
    expect(sw).toContain("const CACHE_VERSION = 'v53-rubric-debrief-2026-07-17';");
    expect(sw).toContain('rubric-debrief');
    expect(sw).toContain("'/hospital-map.js?v=48'");
    expect(sw).not.toContain('v52-live-sim-lidocaine-2026-07-15');
    expect(sw).not.toContain("const CACHE_VERSION = 'v51-live-sim-clinical-controls-2026-07-15';");
    expect(sw).not.toContain("const CACHE_VERSION = 'v50-airway-gaps-2026-07-14';");
  });

  it('pre-caches every live view and browser engine dependency', () => {
    for (const entry of requiredAppShellEntries) {
      expect(sw, `missing ${entry}`).toContain(`'${entry}'`);
    }
  });

  it('resolves every app-shell URL to a local file so cache installation cannot abort', () => {
    const entries = appShellEntries();
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      const pathname = entry.split('?')[0];
      const localPath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
      expect(existsSync(resolve(root, localPath)), `${entry} -> ${localPath}`).toBe(true);
    }
    const normalized = entries.map((entry) => entry.split('?')[0]);
    expect(new Set(normalized).size).toBe(normalized.length);
  });
});
