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

describe('live monitor GE style layout', () => {
  it('puts the patient monitor and the anesthesia machine screen side by side', () => {
    const monitor = section('ge-screen ge-monitor');
    const machine = section('ge-screen ge-vent');
    for (const id of ['display-ecg', 'display-pleth', 'display-hr', 'display-spo2', 'display-bp', 'display-temp', 'display-tof']) {
      expect(monitor).toContain(`id="${id}"`);
    }
    for (const id of ['display-paw', 'display-flow', 'display-capnogram', 'display-ppeak', 'display-pmean', 'display-machine-mv',
      'display-machine-tv', 'display-rr', 'display-etco2', 'display-fio2', 'display-eto2', 'display-et-agent', 'display-mac',
      'display-flow-o2', 'display-flow-air', 'display-flow-n2o', 'display-flow-total', 'display-vent-mode', 'display-set-tv',
      'display-set-rr', 'display-peep', 'display-set-pressure', 'display-pressure-support', 'display-set-fio2']) {
      expect(machine).toContain(`id="${id}"`);
    }
    expect(html.indexOf('ge-screen ge-monitor')).toBeLessThan(html.indexOf('ge-screen ge-vent'));
    expect(css).toMatch(/\.display-layout\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\) minmax\(0, 1\.35fr\);/s);
  });

  it('pairs each waveform with its parameter window and keeps canvases from clipping', () => {
    expect(html).toMatch(/ge-row-ecg[\s\S]*display-ecg[\s\S]*display-hr/);
    expect(html).toMatch(/ge-row-pleth[\s\S]*display-pleth[\s\S]*display-spo2/);
    expect(css).toMatch(/\.ge-wave canvas\s*\{[^}]*min-width:\s*0;/s);
    expect(css).toMatch(/\.ge-param\s*\{[^}]*min-width:\s*0;/s);
  });

  it('renders systolic and diastolic independently inside a container-sized NIBP value', () => {
    const monitor = section('ge-screen ge-monitor');
    expect(monitor).toContain('id="display-sbp"');
    expect(monitor).toContain('id="display-dbp"');
    expect(css).toMatch(/\.ge-param-nibp\s*\{[^}]*container-type:\s*inline-size;/s);
    expect(css).toMatch(/\.ge-param-nibp strong\s*\{[^}]*font-size:[^;]*cqi/s);
    expect(css).toMatch(/\.ge-param-nibp strong\s*\{[^}]*min-width:\s*0;/s);
  });

  it('uses channel colors and stacks on narrow screens', () => {
    for (const token of ['--ge-ecg', '--ge-spo2', '--ge-paw', '--ge-flow', '--ge-co2', '--ge-sevo', '--ge-des', '--ge-iso']) {
      expect(css).toContain(token);
    }
    expect(css).toMatch(/@media \(max-width: 1120px\)[\s\S]*?\.display-layout\s*\{\s*grid-template-columns: 1fr;/);
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]*?\.ge-param-strip\s*\{\s*grid-template-columns: 1fr;/);
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
      'eto2', 'etAgent', 'mac', 'o2Flow', 'airFlow', 'n2oFlow', 'ventSetFiO2', 'spont',
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
