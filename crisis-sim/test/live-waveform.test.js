import { describe, expect, it } from 'vitest';
import {
  createWaveformRenderer,
  ecgMorphology,
  plethMorphology,
  capnoMorphology,
} from '../../ui/liveWaveformRenderer.js';

function signals(overrides = {}) {
  return {
    hr: 70,
    spo2: 99,
    rr: 12,
    etco2: 38,
    capnogramPresent: true,
    ...overrides,
  };
}

describe('rolling live waveform renderer', () => {
  it('keeps rendered history unchanged when a small HR update arrives', () => {
    const renderer = createWaveformRenderer({ sampleRate: 100, seconds: 6 });
    renderer.advance(0.5, signals({ hr: 70 }));
    const before = renderer.snapshot();

    renderer.advance(0.1, signals({ hr: 71 }));
    const after = renderer.snapshot();

    expect(after.ecg.slice(0, before.ecg.length)).toEqual(before.ecg);
    expect(after.pleth.slice(0, before.pleth.length)).toEqual(before.pleth);
    expect(after.cardiacPhase).not.toBe(before.cardiacPhase);
  });

  it('advances one shared cardiac phase continuously for ECG and pleth', () => {
    const renderer = createWaveformRenderer({ sampleRate: 100, seconds: 6 });

    renderer.advance(0.2, signals({ hr: 60 }));
    const first = renderer.snapshot();
    renderer.advance(0.2, signals({ hr: 60 }));
    const second = renderer.snapshot();

    expect(first.ecg).toHaveLength(first.pleth.length);
    expect(second.ecg).toHaveLength(second.pleth.length);
    expect(first.cardiacPhase).toBeCloseTo(0.2, 5);
    expect(second.cardiacPhase).toBeCloseTo(0.4, 5);
  });

  it('flatlines signals that are absent according to the received snapshot', () => {
    const missingHeartRate = createWaveformRenderer({ sampleRate: 100, seconds: 6 });
    missingHeartRate.advance(0.1, signals({ hr: null }));
    expect(missingHeartRate.snapshot().ecg.every((value) => value === 0)).toBe(true);
    expect(missingHeartRate.snapshot().pleth.every((value) => value === 0)).toBe(true);

    const missingSpo2 = createWaveformRenderer({ sampleRate: 100, seconds: 6 });
    missingSpo2.advance(0.2, signals({ spo2: null }));
    expect(missingSpo2.snapshot().ecg.some((value) => value !== 0)).toBe(true);
    expect(missingSpo2.snapshot().pleth.every((value) => value === 0)).toBe(true);

    const absentCapnogram = createWaveformRenderer({ sampleRate: 100, seconds: 6 });
    absentCapnogram.advance(0.2, signals({ capnogramPresent: false }));
    expect(absentCapnogram.snapshot().co2.every((value) => value === 0)).toBe(true);
  });

  it('bounds history and clamps long background frame gaps', () => {
    const renderer = createWaveformRenderer({
      sampleRate: 100, seconds: 1, maxFrameGapSeconds: 0.25,
    });

    const firstAdvance = renderer.advance(10, signals());
    expect(firstAdvance).toEqual({ appended: 25, elapsedSeconds: 0.25 });
    for (let i = 0; i < 10; i += 1) renderer.advance(0.25, signals());

    const history = renderer.snapshot();
    expect(history.ecg).toHaveLength(100);
    expect(history.pleth).toHaveLength(100);
    expect(history.co2).toHaveLength(100);
  });

  it('returns copied, normalized samples whose peaks stay within plotting bounds', () => {
    const renderer = createWaveformRenderer({ sampleRate: 100, seconds: 2 });
    renderer.advance(0.25, signals({ hr: 180, spo2: 100, rr: 40, etco2: 130 }));
    const history = renderer.snapshot();

    for (const value of [...history.ecg, ...history.pleth, ...history.co2]) {
      expect(value).toBeGreaterThanOrEqual(-1);
      expect(value).toBeLessThanOrEqual(1);
    }
    history.ecg[0] = 99;
    expect(renderer.snapshot().ecg[0]).not.toBe(99);
    expect(ecgMorphology(0.205)).toBeGreaterThan(0.9);
    expect(plethMorphology(0.16)).toBeGreaterThan(0.9);
    expect(capnoMorphology(0.3)).toBeGreaterThan(0.9);
  });
});
