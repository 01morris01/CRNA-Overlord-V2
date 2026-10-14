import { describe, expect, it, vi } from 'vitest';
import {
  BARK_RULES,
  caseStage,
  CHATTER_LEVELS,
  worstFinding,
  buildLocalAnswer,
  buildLocalRoast,
  CALM_INTENSITY,
  CHAOS_PROFILES,
  COMPLICATION_LABELS,
  computeIntensity,
  createDirector,
  createSimOperator,
  DIRECTOR_COMPLICATIONS,
  DIRECTOR_EXCLUDED,
  eligibleComplications,
  fillTemplate,
  selectBark,
} from '../../ui/simOperator.js';
import { buildSystemPrompt } from '../../api/sim-operator.js';
import { LIVE_COMPLICATIONS, SimRunner, VentMode } from '../ui/simRunner.js';

const STABLE = Object.freeze({
  t: 0, hr: 72, sbp: 120, dbp: 80, map: 93, spo2: 98, etco2: 38, temp: 36.8,
  capnogramPresent: true, derivedRhythm: 'sinus', lidocaineToxicityStage: 'none',
  airwayDevice: 'intubated', vaporizer: 2, vaporizerAgent: 'Sevoflurane',
  effectiveNmbBlockade: 0, respDrive: 1, lidocaineCumulativeMg: 0, tof: 4, tofRatio: 1,
  lifecycle: 'RUNNING',
});

function seeded(seed = 7) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

function history(overrides = {}) {
  return {
    drugsGiven: new Set(), epiduralGiven: false, wasIntubated: false, ...overrides,
  };
}

function fakeRunner({ rubric = false, active = () => [] } = {}) {
  const runner = {
    rubricSession: rubric ? {} : null,
    caseSession: null,
    s: { eventLog: [] },
    activeComplications: active,
    snapshot: () => ({ ...STABLE }),
    injected: [],
    onEvent: null,
    injectComplication: vi.fn((type) => {
      runner.injected.push(type);
      runner.onEvent?.({ t: 0, kind: 'Complication', detail: type, meta: { action: 'complication', type } });
      return { ok: true, type };
    }),
  };
  return runner;
}

function feed(operator, seconds, base = STABLE, startT = 0) {
  for (let t = startT; t <= startT + seconds; t += 1) operator.observe({ ...base, t });
}

describe('Booth intensity model', () => {
  it('reads a stable anesthetized patient as calm', () => {
    expect(computeIntensity(STABLE)).toBe(0);
  });

  it('scales with the worst derangement and saturates at arrest', () => {
    const mild = computeIntensity({ ...STABLE, spo2: 90 });
    const severe = computeIntensity({ ...STABLE, spo2: 78 });
    expect(mild).toBeGreaterThan(CALM_INTENSITY);
    expect(severe).toBeGreaterThan(mild);
    expect(computeIntensity({ ...STABLE, derivedRhythm: 'ventricular_fibrillation' })).toBe(1);
  });

  it('ignores EtCO2 when no capnogram is present', () => {
    expect(computeIntensity({ ...STABLE, etco2: 90, capnogramPresent: false })).toBe(0);
  });
});

describe('Booth director pacing (L4D style)', () => {
  const profile = CHAOS_PROFILES[2];

  function run(director, { seconds, snapshot = STABLE, active = [], hist = history({ drugsGiven: new Set(['Propofol']) }), startT = 0 }) {
    const decisions = [];
    for (let t = startT; t < startT + seconds; t += 1) {
      const s = { ...snapshot, t };
      const decision = director.update({
        snapshot: s, dt: t === startT ? 0 : 1, intensity: computeIntensity(s), profile, active, history: hist, enabled: true,
      });
      if (decision) decisions.push({ t, ...decision });
    }
    return decisions;
  }

  it('waits for a full calm stretch before the first complication', () => {
    const director = createDirector({ random: seeded() });
    expect(run(director, { seconds: profile.firstCalmSec - 1 })).toEqual([]);
    const decisions = run(director, { seconds: 5, startT: profile.firstCalmSec - 1 });
    expect(decisions).toHaveLength(1);
    expect(LIVE_COMPLICATIONS).toContain(decisions[0].inject);
  });

  it('never injects while the patient is already unstable', () => {
    const director = createDirector({ random: seeded() });
    expect(run(director, { seconds: 1200, snapshot: { ...STABLE, map: 58 } })).toEqual([]);
  });

  it('backs off after an organic crisis instead of piling on', () => {
    const director = createDirector({ random: seeded() });
    run(director, { seconds: 10, snapshot: { ...STABLE, spo2: 75 } });
    expect(director.getState().phase).toBe('PEAK');
    // Recovery: fade hold, then a relax window with no injections.
    const decisions = run(director, { seconds: PEAK_WINDOW(), startT: 10 });
    expect(decisions).toEqual([]);
    expect(['RELAX', 'BUILD_UP']).toContain(director.getState().phase);
  });

  it('never stacks a second complication on a live one', () => {
    const director = createDirector({ random: seeded() });
    run(director, { seconds: profile.firstCalmSec + 2 });
    expect(director.getState().injected).toHaveLength(1);
    const decisions = run(director, { seconds: 2000, active: ['Bronchospasm'], startT: profile.firstCalmSec + 2 });
    expect(decisions).toEqual([]);
  });

  it('respects the chaos cap, and TRY ME grants exactly one more', () => {
    const director = createDirector({ random: seeded() });
    const decisions = run(director, { seconds: 4000 });
    expect(decisions).toHaveLength(profile.maxInjections);
    expect(director.getState().phase).toBe('DONE');
    director.forceSoon();
    const extra = run(director, { seconds: 60, startT: 4000 });
    expect(extra).toHaveLength(1);
    expect(run(director, { seconds: 4000, startT: 4060 })).toEqual([]);
  });

  it('does nothing in commentary only mode', () => {
    const director = createDirector({ random: seeded() });
    const decisions = [];
    for (let t = 0; t < 2000; t += 1) {
      const d = director.update({
        snapshot: { ...STABLE, t }, dt: 1, intensity: 0, profile: CHAOS_PROFILES[0], active: [], history: history(), enabled: true,
      });
      if (d) decisions.push(d);
    }
    expect(decisions).toEqual([]);
  });

  function PEAK_WINDOW() { return 30 + profile.relaxSec[1] + 5; }
});

describe('Booth complication choice is clinically gated and always winnable', () => {
  it('only picks complications the live console can actually rescue', () => {
    const picks = DIRECTOR_COMPLICATIONS.map((entry) => entry.type);
    for (const excluded of Object.keys(DIRECTOR_EXCLUDED)) expect(picks).not.toContain(excluded);
    for (const type of picks) expect(LIVE_COMPLICATIONS).toContain(type);
  });

  it('gates on the current airway and drug state', () => {
    const intubated = eligibleComplications({ ...STABLE, airwayDevice: 'intubated' }, history({ drugsGiven: new Set(['Rocuronium']) }));
    expect(intubated).toContain('Bronchospasm');
    expect(intubated).not.toContain('Laryngospasm');

    const paralyzedMask = eligibleComplications(
      { ...STABLE, airwayDevice: 'mask', vaporizer: 0, effectiveNmbBlockade: 0.95 },
      history({ drugsGiven: new Set(['Propofol', 'Rocuronium', 'Fentanyl']) }),
    );
    expect(paralyzedMask).not.toContain('Laryngospasm');
    expect(paralyzedMask).not.toContain('OpioidRespDepression');

    const emergence = eligibleComplications(
      { ...STABLE, airwayDevice: 'extubated', vaporizer: 0, effectiveNmbBlockade: 0 },
      history({ drugsGiven: new Set(['Propofol', 'Fentanyl']), wasIntubated: true }),
    );
    expect(emergence).toEqual(expect.arrayContaining(['Laryngospasm', 'OpioidRespDepression']));
    expect(emergence).not.toContain('MalignantHyperthermia');
    expect(emergence).not.toContain('HighSpinal');

    expect(eligibleComplications({ ...STABLE, vaporizer: 0, airwayDevice: 'mask' }, history())).toEqual([]);
  });

  it('waits for drugs to settle and keeps laryngospasm to light planes', () => {
    const hist = history({ drugsGiven: new Set(['Propofol']), lastDrugT: 100 });
    expect(eligibleComplications({ ...STABLE, t: 130 }, hist)).toEqual([]);
    expect(eligibleComplications({ ...STABLE, t: 170 }, hist).length).toBeGreaterThan(0);

    const mask = { ...STABLE, t: 500, airwayDevice: 'mask', vaporizer: 0 };
    expect(eligibleComplications({ ...mask, propofolCe: 3.1 }, hist)).not.toContain('Laryngospasm');
    expect(eligibleComplications({ ...mask, propofolCe: 0.4 }, hist)).toContain('Laryngospasm');
  });
});

describe('Booth barks (most specific rule wins)', () => {
  function memory() {
    return { said: new Set(), lastByRule: new Map(), lastText: null };
  }

  it('prefers the more specific rule', () => {
    const bark = selectBark({ concept: 'DRUG', drug: 'Neostigmine', tof: 0 }, { meanness: 2, memory: memory(), random: seeded() });
    expect(bark.ruleId).toBe('neo_count_zero');
    const later = selectBark({ concept: 'DRUG', drug: 'Neostigmine', tof: 3 }, { meanness: 2, memory: memory(), random: seeded() });
    expect(later.ruleId).toBe('neo');
  });

  it('never exceeds the attitude setting', () => {
    for (const rule of BARK_RULES) {
      for (let i = 0; i < 5; i += 1) {
        const bark = selectBark({ concept: rule.concept, ...ALWAYS_TRUE_FACTS }, {
          rules: [rule], meanness: 1, memory: memory(), random: seeded(i + 1),
        });
        if (bark) expect(bark.heat).toBe(1);
      }
    }
  });

  it('honors said once memory', () => {
    const mem = memory();
    const first = selectBark({ concept: 'PREOX' }, { meanness: 2, memory: mem });
    mem.said.add(first.ruleId);
    expect(selectBark({ concept: 'PREOX' }, { meanness: 2, memory: mem })).toBeNull();
  });

  it('fills numbers from engine facts only', () => {
    expect(fillTemplate('SpO2 {spo2}, TOF {tofRatio}', { spo2: 87.6, tofRatio: 0.6234 })).toBe('SpO2 88, TOF 0.62');
    expect(fillTemplate('MAP {map}', {})).toBe('MAP ?');
  });

  it('has a line at every attitude for every rule, with no dashes as punctuation', () => {
    const knownSlots = new Set(['spo2', 'map', 'hr', 'etco2', 'temp', 'tofRatio', 'tof', 'attempts', 'complication', 'name', 'worst', 'agent', 'dial', 'mac', 'bis', 'rr']);
    for (const rule of BARK_RULES) {
      const heats = new Set(rule.lines.map(([heat]) => heat));
      expect([...heats].sort(), rule.id).toEqual(expect.arrayContaining([1, 2, 3]));
      for (const [, text] of rule.lines) {
        expect(text, rule.id).not.toMatch(/[‒–—―]| - /);
        for (const [, slot] of text.matchAll(/\{(\w+)\}/g)) expect(knownSlots.has(slot), `${rule.id}:${slot}`).toBe(true);
      }
    }
  });

  it('tells the trainee to call for help at every attitude when things are going badly (Riskin 2015 guardrail)', () => {
    for (const id of ['arrest', 'failure', 'intubation_failed_repeat']) {
      const rule = BARK_RULES.find((candidate) => candidate.id === id);
      for (const [heat, text] of rule.lines) expect(text.toLowerCase(), `${id} heat ${heat}`).toContain('help');
    }
  });

  it('never punishes pausing', () => {
    const rule = BARK_RULES.find((candidate) => candidate.id === 'paused');
    for (const [, text] of rule.lines) expect(text.toLowerCase()).toMatch(/think|wait|minute/);
  });

  const ALWAYS_TRUE_FACTS = {
    drug: 'Propofol', tof: 0, doseMg: 0.4, failedAttempts: 2, preoxygenated: false, tofRatio: 0.5,
    complicationType: 'MalignantHyperthermia', dantroleneGiven: false,
  };
});

describe('Booth operator wiring', () => {
  it('injects through the runner, not around it, and only in free play', () => {
    const free = fakeRunner();
    const operator = createSimOperator({
      runner: free, random: seeded(), now: () => 0, schedule: (fn) => fn(), chaos: 3, minGapMs: 0,
    });
    free.onEvent = operator.observeEvent;
    operator.observeEvent({ t: 0, meta: { action: 'drug', drug: 'Propofol', doseMg: 140 } });
    feed(operator, CHAOS_PROFILES[3].firstCalmSec + 5);
    expect(free.injectComplication).toHaveBeenCalledTimes(1);
    expect(operator.getHistory().injections[0]).toMatchObject({ source: 'booth', revealed: false });

    const scored = fakeRunner({ rubric: true });
    const quiet = createSimOperator({
      runner: scored, random: seeded(), now: () => 0, schedule: (fn) => fn(), chaos: 3, minGapMs: 0,
    });
    quiet.observeEvent({ t: 0, meta: { action: 'drug', drug: 'Propofol', doseMg: 140 } });
    feed(quiet, 3000);
    expect(scored.injectComplication).not.toHaveBeenCalled();
    expect(quiet.getSettings().directorAllowed).toBe(false);
  });

  it('keeps a complication secret until the trainee treats it', () => {
    let active = [];
    const runner = fakeRunner({ active: () => active });
    const lines = [];
    const operator = createSimOperator({
      runner, say: (line) => lines.push(line.text), random: () => 0, now: () => 0,
      schedule: (fn) => fn(), chaos: 3, minGapMs: 0,
    });
    runner.onEvent = (entry) => {
      operator.observeEvent(entry);
      active = [entry.meta.type];
    };
    // Volatile on and sux given: random() = 0 picks the first eligible entry.
    operator.observeEvent({ t: 0, meta: { action: 'drug', drug: 'Succinylcholine', doseMg: 70 } });
    feed(operator, CHAOS_PROFILES[3].firstCalmSec + 5);
    const type = runner.injected[0];
    expect(type).toBeDefined();
    const label = COMPLICATION_LABELS[type];
    feed(operator, 60, { ...STABLE, etco2: 70, temp: 38.9, hr: 125 }, CHAOS_PROFILES[3].firstCalmSec + 6);

    expect(lines.join(' ').toLowerCase()).not.toContain(label);
    const hidden = operator.caseContext();
    expect(hidden.injections[0]).toMatchObject({ complication: null, disclosed: false });
    expect(JSON.stringify(hidden).toLowerCase()).not.toContain(label);

    const rescue = { Bronchospasm: 'Albuterol', MalignantHyperthermia: 'Dantrolene', Anaphylaxis: 'Epinephrine' }[type];
    operator.observeEvent({ t: 200, meta: { action: 'drug', drug: rescue, doseMg: 1 } });
    expect(operator.caseContext().injections[0]).toMatchObject({ complication: label, disclosed: true, timeToTreatmentSec: expect.any(Number) });
    expect(operator.caseContext({ revealAll: true }).injections[0].complication).toBe(label);
  });

  it('calls out a repeated engine failure line once, not every tick', () => {
    const runner = fakeRunner();
    const lines = [];
    const operator = createSimOperator({ runner, say: (line) => lines.push(line), now: () => 0, minGapMs: 0, chaos: 0 });
    for (let t = 0; t < 50; t += 1) {
      runner.s.eventLog.push('[01:00] ANAPHYLAXIS FAILURE');
      operator.observe({ ...STABLE, t });
    }
    expect(lines.filter((line) => line.concept === 'FAILURE')).toHaveLength(1);
  });

  it('roasts extubation below a TOF ratio of 0.9 with the real number', () => {
    const lines = [];
    const operator = createSimOperator({ runner: fakeRunner(), say: (line) => lines.push(line.text), now: () => 0, minGapMs: 0, chaos: 0, meanness: 2 });
    operator.observe({ ...STABLE, t: 1, tofRatio: 0.62 });
    operator.observeEvent({ t: 1, meta: { action: 'extubate' } });
    expect(lines.at(-1)).toContain('0.62');
    expect(lines.at(-1)).toContain('0.9');
  });
});

describe('Booth on the real engine', () => {
  // Same actions, same tick, two runners: one driven by Booth, one where the
  // complication is injected by hand. Identical physiology proves Booth acts
  // only through runner.injectComplication and never writes engine state.
  function scriptedCase(runner, { onStep } = {}) {
    const w = runner.config.weightKg;
    runner.pause();
    runner.preoxygenate();
    runner.pause();
    let steps = 0;
    const step = (seconds) => {
      for (let i = 0; i < seconds; i += 1) {
        runner.stepFor(1);
        steps += 1;
        onStep?.(steps);
      }
    };
    step(60);
    runner.giveBolus('Propofol', 2 * w, 'Propofol 2 mg/kg');
    runner.giveBolus('Rocuronium', 0.6 * w, 'Rocuronium 0.6 mg/kg');
    step(60);
    runner.attemptIntubation();
    runner.pause();
    step(40);
    runner.setMachine({ mode: VentMode.VCV, setFiO2: 1, setTidalVolume: 500, setRespiratoryRate: 12, setPeep: 5 });
    runner.setVolatile({ agent: 'Sevoflurane', dialPercent: 2 });
    step(700);
    return runner.snapshot();
  }

  it('drives a full case and matches a hand injected twin exactly', () => {
    const lines = [];
    let clock = 0;
    const a = new SimRunner();
    const operator = createSimOperator({
      runner: a, say: (line) => lines.push(line), random: seeded(7), now: () => clock,
      schedule: (fn) => fn(), isLive: () => true, chaos: 3, minGapMs: 4000,
    });
    let injectedAtStep = null;
    a.onTick = (snapshot) => operator.observe(snapshot);
    a.onEvent = (entry) => operator.observeEvent(entry);
    const finalA = scriptedCase(a, {
      onStep: (steps) => {
        clock += 1000;
        if (injectedAtStep === null && operator.getHistory().injections.length > 0) injectedAtStep = steps;
      },
    });

    const injections = operator.getHistory().injections;
    expect(injections).toHaveLength(1);
    expect(injections[0].source).toBe('booth');
    expect(a.log.filter((entry) => entry.kind === 'Complication').map((entry) => entry.detail)).toEqual([injections[0].type]);
    expect(lines.some((line) => line.concept === 'INJECTED')).toBe(true);

    const b = new SimRunner();
    const finalB = scriptedCase(b, {
      onStep: (steps) => { if (steps === injectedAtStep) b.injectComplication(injections[0].type); },
    });

    const vitals = (s) => ({ t: s.t, hr: s.hr, map: s.map, spo2: s.spo2, etco2: s.etco2, temp: s.temp, svr: s.svr, vol: s.vol });
    expect(vitals(finalA)).toEqual(vitals(finalB));
    expect(a.log.map((entry) => entry.meta?.action)).toEqual(b.log.map((entry) => entry.meta?.action));
  }, 60000);
});

describe('Booth offline fallbacks and model prompt', () => {
  it('answers from the monitor when the API is unavailable', () => {
    const answer = buildLocalAnswer({ vitals: { spo2: 86, map: 58, hr: 120, etco2: 61, temp: 38.9 } });
    expect(answer).toContain('SpO2 86');
    expect(answer).toContain('EtCO2 61');
  });

  it('builds a grounded roast with time to treatment', () => {
    const roast = buildLocalRoast({
      simTimeSec: 900,
      extremes: { minSpO2: 84, minMap: 52, maxEtco2: 40, maxTemp: 37 },
      intubation: { failedAttempts: 1, preoxygenated: true },
      injections: [{ complication: 'anaphylaxis', timeToTreatmentSec: 138 }],
    }, 2);
    expect(roast).toContain('84');
    expect(roast).toContain('52');
    expect(roast).toContain('138 seconds');
    expect(roast).not.toMatch(/[–—]/);
  });

  it('does not claim a self resolved complication was never treated', () => {
    const roast = buildLocalRoast({ injections: [{ complication: 'laryngospasm', timeToTreatmentSec: null, resolvedAtSec: 300 }] }, 1);
    expect(roast).toContain('resolved without a targeted rescue');
    expect(roast).not.toContain('never got definitive treatment');
  });

  it('pins the model to the context and forbids naming hidden complications', () => {
    const prompt = buildSystemPrompt({ mode: 'ask', meanness: 3, context: { injections: [{ disclosed: false, complication: null }] } });
    expect(prompt).toContain('Facts come ONLY from CONTEXT');
    expect(prompt).toContain('disclosed false');
    expect(prompt).toContain('Never discourage asking for help');
    expect(prompt).toContain('never about the trainee as a person');
  });
});

describe('Booth talks throughout the case', () => {
  function chattyOperator({ chatter = 1, base = STABLE, active = () => [], runner = fakeRunner({ active }), seconds = 120 } = {}) {
    const lines = [];
    let clock = 0;
    const operator = createSimOperator({
      runner, say: (line) => lines.push(line), random: seeded(3), now: () => clock,
      schedule: (fn) => fn(), chaos: 0, chatter, minGapMs: 5000,
    });
    for (let t = 0; t <= seconds; t += 1) {
      clock = t * 1000;
      operator.observe({ ...base, t });
    }
    return { lines, operator };
  }

  it('fills silence on a steady cadence and stays quiet in events only mode', () => {
    const steady = chattyOperator({ chatter: 1, seconds: 180 });
    const ambient = steady.lines.filter((line) => line.concept === 'AMBIENT');
    expect(ambient.length).toBeGreaterThanOrEqual(8);
    const gaps = ambient.slice(1).map((line, i) => line.tSec - ambient[i].tSec);
    expect(Math.min(...gaps)).toBeGreaterThanOrEqual(CHATTER_LEVELS[1].gapMs[0] / 1000 - 1);

    const nonstop = chattyOperator({ chatter: 2, seconds: 180 }).lines.filter((line) => line.concept === 'AMBIENT');
    expect(nonstop.length).toBeGreaterThan(ambient.length);

    const quiet = chattyOperator({ chatter: 0, seconds: 180 }).lines;
    expect(quiet.map((line) => line.concept)).toEqual(['CASE_START']);
  });

  it('rotates lines instead of repeating himself', () => {
    const texts = chattyOperator({ chatter: 2, seconds: 300 }).lines.map((line) => line.text);
    expect(texts.length).toBeGreaterThan(30);
    // No line repeats within any six consecutive lines.
    for (let i = 0; i + 6 <= texts.length; i += 1) {
      expect(new Set(texts.slice(i, i + 6)).size, texts.slice(i, i + 6).join(' | ')).toBe(6);
    }
  });

  it('reads the real worst number when the patient is unstable', () => {
    const { lines } = chattyOperator({ chatter: 2, base: { ...STABLE, map: 52 } });
    const ambient = lines.filter((line) => line.concept === 'AMBIENT');
    expect(ambient.length).toBeGreaterThan(0);
    expect(ambient.some((line) => line.text.includes('MAP 52'))).toBe(true);
  });

  it('never gives away a hidden complication while chattering', () => {
    let active = [];
    const runner = fakeRunner({ active: () => active });
    const lines = [];
    let clock = 0;
    const operator = createSimOperator({
      runner, say: (line) => lines.push(line.text), random: () => 0, now: () => clock,
      schedule: (fn) => fn(), chaos: 3, chatter: 2, minGapMs: 0,
    });
    runner.onEvent = (entry) => { operator.observeEvent(entry); active = [entry.meta.type]; };
    operator.observeEvent({ t: 0, meta: { action: 'drug', drug: 'Succinylcholine', doseMg: 70 } });
    for (let t = 0; t <= 600; t += 1) {
      clock = t * 1000;
      const deranged = runner.injected.length > 0 ? { etco2: 66, hr: 118 } : {};
      operator.observe({ ...STABLE, ...deranged, t });
    }
    expect(runner.injected).toHaveLength(1);
    const label = COMPLICATION_LABELS[runner.injected[0]];
    expect(lines.length).toBeGreaterThan(40);
    for (const text of lines) expect(text.toLowerCase()).not.toContain(label);
  });

  it('knows the stage of the case and the worst number', () => {
    expect(caseStage({ airwayDevice: 'mask' }, { drugsGiven: new Set() })).toBe('preinduction');
    expect(caseStage({ airwayDevice: 'mask' }, { drugsGiven: new Set(['Propofol']) })).toBe('induction');
    expect(caseStage({ airwayDevice: 'intubated' }, { drugsGiven: new Set(['Propofol']) })).toBe('maintenance');
    expect(caseStage({ airwayDevice: 'extubated' }, { drugsGiven: new Set(['Propofol']) })).toBe('emergence');
    expect(worstFinding(STABLE)).toBeNull();
    expect(worstFinding({ ...STABLE, spo2: 86, map: 60 })).toBe('SpO2 86');
  });
});
