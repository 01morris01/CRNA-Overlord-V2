import { readFileSync } from 'node:fs';
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
  '/crisis-sim/sim/scenario/actionLogger.js',
  '/crisis-sim/sim/scenario/actionCatalog.js',
];

describe('live simulation PWA contract', () => {
  it('bumps the service worker version for installed clients', () => {
    expect(sw).toContain("const CACHE_VERSION = 'v52-live-sim-lidocaine-2026-07-15';");
    expect(sw).toContain('live-sim-lidocaine');
    expect(sw).toContain("'/hospital-map.js?v=48'");
    expect(sw).not.toContain("const CACHE_VERSION = 'v51-live-sim-clinical-controls-2026-07-15';");
    expect(sw).not.toContain("const CACHE_VERSION = 'v50-airway-gaps-2026-07-14';");
  });

  it('pre-caches every live view and browser engine dependency', () => {
    for (const entry of requiredAppShellEntries) {
      expect(sw, `missing ${entry}`).toContain(`'${entry}'`);
    }
  });
});
