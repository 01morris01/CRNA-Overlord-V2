import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { complicationReadiness, createDirector, createSimOperator } from '../../ui/simOperator.js';
import {
  buildEventPlan,
  buildFacultyAnswer,
  createTrendWatch,
  describeInjection,
  explainCauses,
  summarizeEventPlan,
} from '../../ui/simScript.js';
import { renderEventPlanMarkup } from '../../ui/simOperatorView.js';
import { buildSystemPrompt } from '../../api/sim-operator.js';
import { SimRunner, VentMode } from '../ui/simRunner.js';

const key = (id) => JSON.parse(readFileSync(new URL(`../../data/mock-or-day/answer-keys/${id}.json`, import.meta.url), 'utf8'));

function gradeWith(answerKey, statuses = {}, fallback = 'found') {
  return { percent: 70, redFlags: answerKey.redFlags.map((flag) => ({ id: flag.id, status: statuses[flag.id] ?? fallback })) };
}

function seeded(seed = 7) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

const STABLE = Object.freeze({
  t: 0, hr: 72, sbp: 120, dbp: 80, map: 93, spo2: 98, etco2: 38, temp: 36.8,
  capnogramPresent: true, derivedRhythm: 'sinus', lidocaineToxicityStage: 'none',
  airwayDevice: 'intubated', vaporizer: 2, vaporizerAgent: 'Sevoflurane',
  effectiveNmbBlockade: 0, respDrive: 1, lidocaineCumulativeMg: 0, tof: 4, tofRatio: 1,
  lifecycle: 'RUNNING',
});

describe('answer keys link each Booth complication to the red flags it tests', () => {
  it('every linked flag id exists in its own answer key', () => {
    const index = JSON.parse(readFileSync(new URL('../../data/mock-or-day/index.json', import.meta.url), 'utf8'));
    const ids = (index.patients ?? index).map((entry) => entry.id);
    let linked = 0;
    for (const id of ids) {
      const answerKey = key(id);
      const flagIds = new Set(answerKey.redFlags.map((flag) => flag.id));
      for (const item of answerKey.boothComplications ?? []) {
        expect(Array.isArray(item.flags), `${id} ${item.type}`).toBe(true);
        for (const flag of item.flags) expect(flagIds.has(flag), `${id} ${item.type} ${flag}`).toBe(true);
        if (item.flags.length > 0) linked += 1;
      }
    }
    expect(linked).toBeGreaterThan(40);
  });
});

describe('event plan: only what the student missed fires on its own', () => {
  const p14 = key('p14');

  it('holds bronchospasm when the student caught the carboprost reaction, arms the high spinal they missed', () => {
    const plan = buildEventPlan({ answerKey: p14, grade: gradeWith(p14, { spine: 'missed' }) });
    const byType = Object.fromEntries(plan.map((event) => [event.type, event]));
    expect(byType.Bronchospasm.state).toBe('caught');
    expect(byType.Bronchospasm.autoAllowed).toBe(false);
    expect(byType.Bronchospasm.reason).toMatch(/caught "Carboprost in the hemorrhage cart/);
    expect(byType.HighSpinal.state).toBe('armed');
    expect(byType.HighSpinal.autoAllowed).toBe(true);
    expect(byType.HighSpinal.reason).toMatch(/missed "Prior L4 to S1 fusion/);
    expect(byType.LocalAnestheticToxicity.state).toBe('background');
    expect(byType.LocalAnestheticToxicity.autoAllowed).toBe(false);
    expect(plan[0].type).toBe('HighSpinal');
    expect(summarizeEventPlan(plan)).toBe('1 armed, 1 caught by the student, 1 background.');
  });

  it('a partly caught flag still arms its event', () => {
    const plan = buildEventPlan({ answerKey: p14, grade: gradeWith(p14, { carboprost: 'partial' }) });
    const broncho = plan.find((event) => event.type === 'Bronchospasm');
    expect(broncho.state).toBe('armed');
    expect(broncho.reason).toMatch(/only partly caught/);
  });

  it('with no graded plan, every linked event counts as not caught', () => {
    const plan = buildEventPlan({ answerKey: p14, grade: null });
    expect(plan.filter((event) => event.state === 'armed').map((event) => event.type).sort()).toEqual(['Bronchospasm', 'HighSpinal']);
  });

  it('an all caught plan arms nothing and says so', () => {
    const plan = buildEventPlan({ answerKey: p14, grade: gradeWith(p14) });
    expect(plan.some((event) => event.autoAllowed)).toBe(false);
    expect(summarizeEventPlan(plan)).toMatch(/Nothing will start on its own/);
  });

  it('the director never picks outside the allowed list', () => {
    const director = createDirector({ random: () => 0 });
    director.setAllowed([]);
    const hist = { drugsGiven: new Set(['Propofol', 'Rocuronium']), epiduralGiven: false, wasIntubated: true };
    const profile = { maxInjections: 4, firstCalmSec: 10, buildCalmSec: 10, relaxSec: [10, 20] };
    for (let t = 0; t < 600; t += 1) {
      const decision = director.update({ snapshot: { ...STABLE, t }, dt: 1, intensity: 0, profile, active: [], history: hist, enabled: true });
      expect(decision).toBeNull();
    }
    director.setAllowed(['Bronchospasm']);
    let picked = null;
    for (let t = 600; t < 700 && !picked; t += 1) {
      picked = director.update({ snapshot: { ...STABLE, t }, dt: 1, intensity: 0, profile, active: [], history: hist, enabled: true })?.inject ?? null;
    }
    expect(picked).toBe('Bronchospasm');
  });
});

describe('readiness tells the instructor when to trigger', () => {
  it('bronchospasm waits for a tube and MH waits for a trigger agent', () => {
    const noTube = complicationReadiness('Bronchospasm', { ...STABLE, airwayDevice: 'mask' }, { drugsGiven: [] });
    expect(noTube.ready).toBe(false);
    expect(noTube.text).toMatch(/Waiting\. Patient intubated/);
    const ready = complicationReadiness('Bronchospasm', { ...STABLE, t: 500 }, { drugsGiven: ['Propofol'], lastDrugT: 100 });
    expect(ready).toMatchObject({ ready: true, calm: true });
    const mh = complicationReadiness('MalignantHyperthermia', { ...STABLE, vaporizer: 0 }, { drugsGiven: [] });
    expect(mh.ready).toBe(false);
    expect(complicationReadiness('Hemorrhage', STABLE, {}).text).toMatch(/Manual only/);
  });
});

describe('explanations for the instructor', () => {
  it('names hypermetabolism for an MH style EtCO2 rise and hypoventilation for a depressed patient', () => {
    const mh = explainCauses('etco2', { etco2: 70, vco2: 600, effectiveMV: 7, airwayRes: 1.4 }, {
      restingVco2: 196, active: [{ type: 'MalignantHyperthermia', source: 'booth', tSec: 252 }],
    });
    expect(mh[0]).toBe('Malignant hyperthermia is running (Booth started it at 04:12).');
    expect(mh.join(' ')).toMatch(/CO2 production is 3\.1 times baseline/);
    const hypo = explainCauses('etco2', { etco2: 58, vco2: 200, effectiveMV: 2.1, respDrive: 0.3, airwayDevice: 'mask', ppvActive: false }, { restingVco2: 196 });
    expect(hypo.join(' ')).toMatch(/Minute ventilation is only 2\.1 L\/min because respiratory drive is depressed and nobody is bagging/);
    expect(explainCauses('map', { svr: 0.5, vol: 1 }, {}).join(' ')).toMatch(/SVR is 50% of normal/);
  });

  it('describes a Booth injection with why, signs, rescue, and resolution', () => {
    const p14 = key('p14');
    const event = buildEventPlan({ answerKey: p14, grade: gradeWith(p14, { spine: 'missed' }) }).find((item) => item.type === 'HighSpinal');
    const note = describeInjection({ type: 'HighSpinal', source: 'booth', tSec: 300, event });
    expect(note.title).toBe('Booth started High spinal at 05:00');
    expect(note.lines.map(([label]) => label)).toEqual(['Why', 'Watch for', 'Student should', 'Resolves when']);
    expect(note.lines[0][1]).toMatch(/missed "Prior L4 to S1 fusion/);
  });

  it('flags a steady EtCO2 climb before it crosses 50', () => {
    const trend = createTrendWatch();
    let hit = null;
    for (let t = 0; t <= 60 && !hit; t += 5) hit = trend.observe({ t, etco2: 38 + t / 6 });
    expect(hit).toEqual({ rise: 8 });
  });

  it('the instructor text never uses a dash as punctuation', () => {
    const source = readFileSync(new URL('../../ui/simScript.js', import.meta.url), 'utf8');
    const strings = source.match(/'[^'\n]*'/g) ?? [];
    for (const text of strings) expect(text).not.toMatch(/ [-–—] /);
  });
});

describe('Booth on the real engine, instructor side', () => {
  function intubatedCase(runner, steps = 120) {
    const w = runner.config.weightKg;
    runner.pause();
    runner.preoxygenate();
    runner.pause();
    runner.stepFor(60);
    runner.giveBolus('Propofol', 2 * w, 'Propofol 2 mg/kg');
    runner.giveBolus('Rocuronium', 0.6 * w, 'Rocuronium 0.6 mg/kg');
    runner.stepFor(60);
    runner.attemptIntubation();
    runner.pause();
    runner.stepFor(40);
    runner.setMachine({ mode: VentMode.VCV, setFiO2: 1, setTidalVolume: 500, setRespiratoryRate: 12, setPeep: 5 });
    runner.setVolatile({ agent: 'Sevoflurane', dialPercent: 2 });
    for (let i = 0; i < steps; i += 1) runner.stepFor(1);
  }

  function rig({ runMode = 'booth', chaos = 3 } = {}) {
    const runner = new SimRunner();
    const notes = [];
    const lines = [];
    let clock = 0;
    const operator = createSimOperator({
      runner, say: (line) => lines.push(line), notify: (note) => notes.push(note), random: seeded(3), now: () => clock,
      schedule: (fn) => fn(), isLive: () => true, chaos, runMode, minGapMs: 4000,
    });
    runner.onTick = (snapshot) => { clock += 250; operator.observe(snapshot); };
    runner.onEvent = (entry) => operator.observeEvent(entry);
    return { runner, operator, notes, lines };
  }

  it('BOOTH RUNS IT with an all caught plan never starts anything', () => {
    const { runner, operator, notes } = rig();
    const p14 = key('p14');
    operator.setEventPlan(buildEventPlan({ answerKey: p14, grade: gradeWith(p14) }));
    intubatedCase(runner, 900);
    expect(operator.getHistory().injections).toEqual([]);
    expect(notes.some((note) => note.kind === 'event')).toBe(false);
  });

  it('BOOTH RUNS IT starts only the armed event and explains it to the instructor', () => {
    const { runner, operator, notes } = rig();
    const p14 = key('p14');
    operator.setEventPlan(buildEventPlan({ answerKey: p14, grade: gradeWith(p14, { carboprost: 'missed' }) }));
    intubatedCase(runner, 900);
    const injected = operator.getHistory().injections.map((entry) => entry.type);
    expect(injected).toEqual(['Bronchospasm']);
    const note = notes.find((entry) => entry.kind === 'event');
    expect(note.title).toMatch(/^Booth started Bronchospasm at \d\d:\d\d$/);
    expect(note.lines[0][1]).toMatch(/missed "Carboprost in the hemorrhage cart/);
  });

  it('I RUN IT never auto starts, says when an event is ready, and the trigger is labeled as the instructor\'s', () => {
    const { runner, operator, notes, lines } = rig({ runMode: 'instructor' });
    const p14 = key('p14');
    operator.setEventPlan(buildEventPlan({ answerKey: p14, grade: gradeWith(p14, { carboprost: 'missed' }) }));
    intubatedCase(runner, 900);
    expect(operator.getHistory().injections).toEqual([]);
    expect(notes.find((note) => note.kind === 'ready')?.title).toBe('Good moment for Bronchospasm');
    const spokenBefore = lines.length;
    expect(operator.triggerEvent('Bronchospasm')).toMatchObject({ ok: true });
    const note = notes.at(-1);
    expect(note.title).toMatch(/^You \(event plan\) started Bronchospasm/);
    expect(lines.slice(spokenBefore).some((line) => /instructor/i.test(line.text))).toBe(false);
    expect(operator.getEventPlan().find((event) => event.type === 'Bronchospasm').fired).toBe(true);
    expect(operator.triggerEvent('Bronchospasm')).toMatchObject({ ok: false });
  });

  it('a hand injected MH explains the EtCO2 rise and the faculty context names it', () => {
    const { runner, operator, notes } = rig({ chaos: 0 });
    intubatedCase(runner, 240);
    // The induction apnea already pushed EtCO2 up, and Booth said why.
    const apnea = notes.find((note) => note.kind === 'vital' && /EtCO2/.test(note.title));
    expect(apnea.lines[0][1]).toMatch(/paralyzed and the ventilator is in manual mode/);
    const before = notes.length;
    runner.injectComplication('MalignantHyperthermia');
    for (let i = 0; i < 120; i += 1) runner.stepFor(1);
    const vital = notes.slice(before).find((note) => note.kind === 'vital' && /EtCO2/.test(note.title));
    expect(vital).toBeTruthy();
    expect(vital.lines[0][1]).toMatch(/Malignant hyperthermia is running \(started by you/);
    expect(vital.lines[0][1]).toMatch(/CO2 production is/);
    const context = operator.facultyContext();
    expect(context.audience).toBe('instructor');
    expect(context.activeNow).toContain('malignant hyperthermia');
    expect(context.injections[0]).toMatchObject({ type: 'MalignantHyperthermia', source: 'instructor' });
    // The student side context still withholds it.
    expect(operator.caseContext().injections[0].complication).toBeNull();
    expect(buildFacultyAnswer(context, 'why is the etco2 going up')).toMatch(/Malignant hyperthermia is running/);
  });
});

describe('event plan rows and the faculty prompt', () => {
  it('renders a trigger per event, disabled until the case runs', () => {
    const p14 = key('p14');
    const events = buildEventPlan({ answerKey: p14, grade: gradeWith(p14, { spine: 'missed' }) })
      .map((event) => ({ ...event, readiness: { ready: false, calm: false, text: 'Waiting.' } }));
    const idle = renderEventPlanMarkup(events, { runMode: 'instructor', live: false });
    expect(idle.match(/data-trigger-event=/g)).toHaveLength(3);
    expect(idle).toContain('disabled');
    expect(idle).toContain('ARMED');
    expect(idle).toContain('CAUGHT');
    const live = renderEventPlanMarkup(events, { runMode: 'booth', live: true });
    expect(live).not.toContain('disabled');
    expect(live).toContain('Booth will start it.');
  });

  it('faculty mode talks to the instructor, withholds nothing, and is never sarcastic', () => {
    const prompt = buildSystemPrompt({ mode: 'faculty', meanness: 3, context: { injections: [{ type: 'MalignantHyperthermia' }] } });
    expect(prompt).toMatch(/talking to the INSTRUCTOR/);
    expect(prompt).toMatch(/Nothing is secret from the instructor/);
    expect(prompt).toMatch(/No sarcasm aimed at the instructor/);
    expect(prompt).not.toMatch(/Roast hard/);
    expect(prompt).toContain('MalignantHyperthermia');
  });
});
