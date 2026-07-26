import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LEARNER_MONITOR_KEYS, projectLearnerMonitorSnapshot } from '../../ui/liveSimTransport.js';

const root = resolve(import.meta.dirname, '../..');
const html = readFileSync(resolve(root, 'live-sim-display.html'), 'utf8');
const css = readFileSync(resolve(root, 'assets/css/live-sim-display.css'), 'utf8');
const viewSource = readFileSync(resolve(root, 'ui/liveSimView.js'), 'utf8');

function section(className) {
  const start = html.indexOf(`<section class="${className}"`);
  const end = html.indexOf('</section>', start);
  return html.slice(start, end);
}

describe('live monitor clinical-priority layout', () => {
  it('keeps four primary vitals above waveforms and TEMP/TOF in a secondary row', () => {
    const primary = section('display-numerics');
    const secondary = section('display-secondary-numerics');
    const waveformsAt = html.indexOf('<section class="display-waveforms"');

    for (const id of ['display-hr', 'display-bp', 'display-spo2', 'display-etco2']) {
      expect(primary).toContain(`id="${id}"`);
    }
    expect(primary).not.toContain('id="display-temp"');
    expect(primary).not.toContain('id="display-tof"');
    expect(secondary).toContain('id="display-temp"');
    expect(secondary).toContain('id="display-tof"');
    expect(html.indexOf('<section class="display-numerics"')).toBeLessThan(waveformsAt);
    expect(html.indexOf('<section class="display-secondary-numerics"')).toBeGreaterThan(waveformsAt);
  });

  it('gives NIBP extra width and prevents numeric and canvas clipping', () => {
    expect(css).toContain('grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr);');
    expect(css).toMatch(/\.display-vital-bp strong\s*\{[^}]*white-space:\s*nowrap;/s);
    expect(css).toContain('grid-template-columns: 70px minmax(0, 1fr);');
    expect(css).toMatch(/\.display-wave-row canvas\s*\{[^}]*min-width:\s*0;/s);
    expect(css).toMatch(/\.display-vital\s*\{[^}]*min-width:\s*0;/s);
  });

  it('renders systolic and diastolic independently inside a container-sized NIBP value', () => {
    const primary = section('display-numerics');
    expect(primary).toContain('id="display-bp"');
    expect(primary).toContain('id="display-sbp"');
    expect(primary).toContain('id="display-dbp"');
    expect(css).toMatch(/\.display-vital-bp\s*\{[^}]*container-type:\s*inline-size;/s);
    expect(css).toMatch(/\.display-vital-bp strong\s*\{[^}]*font-size:[^;]*cqi/s);
    expect(css).toMatch(/\.display-vital-bp strong\s*\{[^}]*min-width:\s*0;/s);
  });

  it('has explicit wide, laptop/tablet, and narrow-phone grid behavior', () => {
    expect(css).toMatch(/@media \(max-width: 1120px\)[\s\S]*?\.display-numerics\s*\{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]*?\.display-numerics[\s\S]*?grid-template-columns:\s*1fr;/);
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]*?\.display-secondary-numerics[\s\S]*?grid-template-columns:\s*1fr;/);
  });
});

describe('learner display transport allowlist evidence', () => {
  it('allowlists every snapshot field the learner display consumes', () => {
    const displayedFields = [
      't', 'patient', 'hr', 'sbp', 'dbp', 'map', 'spo2', 'rr', 'etco2', 'temp',
      'tof', 'tofRatio', 'spontaneousRR', 'spontaneousTV', 'spontaneousMV',
      'spontaneousEffort', 'ppeak', 'mv', 'tv', 'fio2', 'ventMode', 'vaporizer',
      'vaporizerAgent', 'airwayDevice', 'forcedApnea', 'ventSetTV', 'ventSetRR',
      'ventSetPeep', 'ventSetPressure', 'ventSetPressureSupport',
    ];
    for (const field of displayedFields) {
      expect(LEARNER_MONITOR_KEYS).toContain(field);
    }
  });

  it('never leaks case guidance through the learner projection', () => {
    const projected = projectLearnerMonitorSnapshot({
      t: 42, hr: 72, spo2: 98,
      instructorGuide: { answer: 'postpone' },
      concealedFindings: ['MH'], expectedResponse: 'avoid volatile',
      rubricNotes: ['answer key'], caseContext: { private: true },
    });

    expect(Object.keys(projected).every((key) => LEARNER_MONITOR_KEYS.includes(key))).toBe(true);
    expect(JSON.stringify(projected)).not.toMatch(/postpone|MH|answer key|private/);
  });

  it('has the instructor view publish only the learner projection', () => {
    expect(viewSource).toMatch(/publishSnapshot\(projectLearnerMonitorSnapshot\(snapshot\)\)/);
    expect(viewSource).not.toMatch(/publishSnapshot\(snapshot\)/);
  });
});
