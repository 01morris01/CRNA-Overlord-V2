import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

describe('main app live simulation registration', () => {
  it('registers the instructor with the existing fixed-view/module convention', () => {
    const index = read('index.html');
    const app = read('app.js');
    const controller = read('ui/liveSimView.js');
    const hospitalMap = read('hospital-map.js');

    expect(index).toContain('href="assets/css/live-sim.css"');
    expect(index).toContain('id="live-sim-launch"');
    expect(index).toContain('id="live-sim-view"');
    expect(index).toContain('src="hospital-map.js?v=48"');
    expect(controller).toContain('live-sim-course-launch');
    expect(controller).toContain('hospital-live-sim-launch');
    expect(controller).toContain('MutationObserver');
    expect(controller).toContain("document.getElementById('course-selector')");
    expect(controller).toContain("courseSelector.style.display = 'none'");
    expect(app).toMatch(/import \{ initLiveSimView \} from '\.\/ui\/liveSimView\.js';/);
    expect(app).toMatch(/initLiveSimView\(\);/);
    expect(controller).toContain("from '../crisis-sim/ui/simRunner.js'");
    expect(controller).not.toContain("from '../crisis-sim/sim/");
    expect(controller.match(/new SimRunner\(/g)).toHaveLength(1);
    expect(controller).toContain('const result = liveRunner.giveBolus');
    expect(controller).toContain('liveRunner.preoxygenate()');
    expect(controller).toContain('deriveLifecyclePresentation(snapshot)');
    expect(hospitalMap).toContain('var dt = Math.max(0, Math.min(.05, (t - last) / 1000));');
  });

  it('keeps all derived-vital writes out of the instructor controller', () => {
    const controller = read('ui/liveSimView.js');
    for (const vital of ['hr', 'sbp', 'dbp', 'map', 'spo2', 'rr', 'etco2', 'temp', 'tofRatio']) {
      expect(controller).not.toMatch(new RegExp(`\\.${vital}\\s*=`));
    }
  });

  it('keeps the second-screen display read-only and visibly fenced', () => {
    const html = read('live-sim-display.html');
    const controller = read('ui/liveSimDisplay.js');

    expect(html).toContain('href="assets/css/live-sim-display.css"');
    expect(html).toContain('Educational simulation. Not for clinical use.');
    expect(html).toContain('id="display-spontaneous-rr"');
    expect(html).toContain('id="display-spontaneous-tv"');
    expect(html).toContain('id="display-spontaneous-mv"');
    expect(html).toContain('id="display-spontaneous-effort"');
    expect(html).toContain('id="display-tof-ratio"');
    expect(controller).toContain("from './liveSimTransport.js'");
    expect(controller).toContain("from './liveSimModel.js'");
    expect(controller).not.toContain('SimRunner');
    expect(controller).not.toContain('/crisis-sim/');
    expect(controller).toContain('RENDERING ONLY');
    expect(controller).toContain('capnogramPresent');
    expect(controller).toContain('if (!Number.isFinite(snapshot?.hr)) return 0;');
    expect(controller).toContain('if (!Number.isFinite(snapshot?.hr) || !Number.isFinite(snapshot?.spo2)) return 0;');
    expect(controller).toContain('transport?.requestState();');
    expect(controller).toContain('snapshotAge > 10000');
    expect(controller).toContain("'FORCED APNEA OFF'");
    expect(controller).not.toContain('DRIVE AVAILABLE');
  });
});
