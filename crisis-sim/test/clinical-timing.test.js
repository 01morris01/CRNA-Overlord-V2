/* Clinical timing anchors for the live console, checked on the real engine.

   - Apnea after induction (propofol plus rocuronium, mask on, nobody
     bagging): preoxygenated healthy adult reaches SpO2 90 in about 6 to 9
     minutes (Benumof, Anesthesiology 1997); on room air in about 1 minute.
     Before the fix, a paralyzed patient on a mask never desaturated because
     a zero tidal volume fell through to a 450 mL default.
   - Sevoflurane wash-in: Et rises over minutes and depends on fresh gas
     flow (circuit time constant about 6 L / FGF); steady FA/FI near 0.85.
     Before, Et sat at 0.7 x dial within a minute at any flow, and turning
     the dial off emptied the patient instantly.
   - Live complications build: MH EtCO2 climbs over minutes with temperature
     rising well under 1 C per minute; high spinal hypotension develops over
     about 2 minutes. Scenario files keep their original abrupt onset. */
import { describe, expect, it } from 'vitest';
import { SimRunner, VentMode } from '../ui/simRunner.js';

const W = 70;

function steps(runner, seconds, each) {
  for (let t = 1; t <= seconds; t += 1) {
    runner.stepFor(1);
    each?.(runner.snapshot(), t);
  }
}

function intubatedOnSevo({ flow = 2, dial = 2, settle = 0 } = {}) {
  const r = new SimRunner();
  r.pause();
  r.preoxygenate();
  r.pause();
  steps(r, 60);
  r.giveBolus('Propofol', 2 * W, 'Propofol');
  r.giveBolus('Rocuronium', 0.6 * W, 'Rocuronium');
  steps(r, 90);
  r.attemptIntubation();
  r.pause();
  steps(r, 35);
  r.setMachine({ mode: VentMode.VCV, setFiO2: 1, setTidalVolume: 500, setRespiratoryRate: 12, o2FlowLPerMin: flow });
  if (dial > 0) r.setVolatile({ agent: 'Sevoflurane', dialPercent: dial });
  if (settle) steps(r, settle);
  return r;
}

describe('apnea after induction desaturates on a believable clock', () => {
  function timeTo90({ preox }) {
    const r = new SimRunner();
    r.pause();
    if (preox) {
      r.preoxygenate();
      r.pause();
      steps(r, 180);
    } else {
      r.setMachine({ setFiO2: 0.21, o2FlowLPerMin: 0, airFlowLPerMin: 2 });
      r.pause();
      steps(r, 60);
    }
    r.giveBolus('Propofol', 2 * W, 'Propofol');
    r.giveBolus('Rocuronium', 0.6 * W, 'Rocuronium');
    let t90 = null;
    steps(r, 900, (s, t) => { if (t90 === null && s.spo2 < 90) t90 = t; });
    return t90;
  }

  it('preoxygenated: about 6 to 9 minutes', () => {
    const t = timeTo90({ preox: true });
    expect(t).toBeGreaterThanOrEqual(360);
    expect(t).toBeLessThanOrEqual(540);
  });

  it('room air: about a minute', () => {
    expect(timeTo90({ preox: false })).toBeLessThanOrEqual(90);
  });
});

describe('sevoflurane takes minutes to come up and to wash out', () => {
  it('wash-in at 2 L/min is gradual and settles near FA/FI 0.85', () => {
    const r = intubatedOnSevo({ flow: 2, dial: 2 });
    const et = {};
    steps(r, 1800, (s, t) => { if ([60, 300, 600, 1800].includes(t)) et[t] = s.etAgent; });
    expect(et[60]).toBeLessThan(0.5);
    expect(et[300]).toBeGreaterThan(0.7);
    expect(et[300]).toBeLessThan(1.4);
    expect(et[600]).toBeGreaterThan(1.2);
    expect(et[1800] / 2).toBeGreaterThan(0.8);
    expect(et[1800] / 2).toBeLessThan(0.95);
  });

  it('higher fresh gas flow speeds wash-in', () => {
    const low = intubatedOnSevo({ flow: 1, dial: 2 });
    const high = intubatedOnSevo({ flow: 8, dial: 2 });
    steps(low, 180);
    steps(high, 180);
    expect(high.snapshot().etAgent).toBeGreaterThan(low.snapshot().etAgent * 1.5);
  });

  it('turning the dial off washes out over minutes, faster at high flow', () => {
    const lowFlow = intubatedOnSevo({ flow: 2, dial: 2.5, settle: 2400 });
    const highFlow = intubatedOnSevo({ flow: 2, dial: 2.5, settle: 2400 });
    for (const [runner, flow] of [[lowFlow, 2], [highFlow, 10]]) {
      runner.setVolatile({ agent: 'Sevoflurane', dialPercent: 0 });
      runner.setMachine({ o2FlowLPerMin: flow });
    }
    steps(lowFlow, 60);
    steps(highFlow, 60);
    expect(lowFlow.snapshot().mac).toBeGreaterThan(0.5);
    steps(lowFlow, 240);
    steps(highFlow, 240);
    expect(highFlow.snapshot().mac).toBeLessThan(lowFlow.snapshot().mac);
    expect(highFlow.snapshot().mac).toBeLessThan(0.35);
  });
});

describe('complications injected from the console build like the real thing', () => {
  it('MH: EtCO2 climbs over minutes and temperature rises well under 1 C per minute', () => {
    const r = intubatedOnSevo({ settle: 600 });
    const base = r.snapshot();
    r.injectComplication('MalignantHyperthermia');
    const at = {};
    steps(r, 600, (s, t) => { if ([60, 300, 600].includes(t)) at[t] = s; });
    expect(at[60].etco2 - base.etco2).toBeLessThan(25);
    expect(at[300].etco2).toBeGreaterThan(base.etco2 + 40);
    expect(at[300].hr).toBeGreaterThan(base.hr + 15);
    expect(at[600].temp - base.temp).toBeGreaterThan(0.5);
    expect(at[600].temp - base.temp).toBeLessThan(4);
    expect(r.activeComplications()).toContain('MalignantHyperthermia');
  });

  it('high spinal: hypotension develops over about two minutes, then recedes', () => {
    const r = intubatedOnSevo({ settle: 300 });
    const base = r.snapshot();
    r.injectComplication('HighSpinal');
    const at = {};
    steps(r, 900, (s, t) => { if ([20, 120, 900].includes(t)) at[t] = s; });
    expect(at[20].map).toBeGreaterThan(base.map * 0.7);
    expect(at[120].map).toBeLessThan(base.map * 0.65);
    expect(at[900].map).toBeGreaterThan(at[120].map);
  });

  it('anaphylaxis and bronchospasm start partial and worsen when untreated', () => {
    const ana = intubatedOnSevo({ settle: 300 });
    const base = ana.snapshot();
    ana.injectComplication('Anaphylaxis');
    const map = {};
    steps(ana, 120, (s, t) => { if ([20, 120].includes(t)) map[t] = s.map; });
    expect(map[20]).toBeGreaterThan(base.map * 0.6);
    expect(map[120]).toBeLessThan(map[20]);
    const broncho = intubatedOnSevo({ settle: 300 });
    broncho.injectComplication('Bronchospasm');
    const spo2 = {};
    steps(broncho, 300, (s, t) => { if ([30, 300].includes(t)) spo2[t] = s.spo2; });
    expect(spo2[30]).toBeGreaterThan(spo2[300]);
  });
});

describe('instant mode for showing the concept', () => {
  it('INSTANT MH is at full severity right away; REALISTIC builds', () => {
    const instant = intubatedOnSevo({ settle: 600 });
    const realistic = intubatedOnSevo({ settle: 600 });
    const base = instant.snapshot().etco2;
    expect(instant.injectComplication('MalignantHyperthermia', { onset: 'instant' })).toMatchObject({ onset: 'instant' });
    expect(realistic.injectComplication('MalignantHyperthermia')).toMatchObject({ onset: 'realistic' });
    steps(instant, 60);
    steps(realistic, 60);
    expect(instant.snapshot().etco2 - base).toBeGreaterThan(40);
    expect(realistic.snapshot().etco2 - base).toBeLessThan(25);
    // Abrupt complications have no slow version.
    expect(instant.injectComplication('Laryngospasm', { onset: 'realistic' }).onset).toBe('instant');
  });

  it('INSTANT volatile uptake follows the dial within a minute and survives RESET', () => {
    const r = intubatedOnSevo({ dial: 0 });
    expect(r.getAgentKinetics()).toBe('physiologic');
    r.setAgentKinetics('legacy');
    r.setVolatile({ agent: 'Sevoflurane', dialPercent: 2 });
    steps(r, 60);
    expect(r.snapshot().etAgent).toBeGreaterThan(1.3);
    r.reset();
    expect(r.getAgentKinetics()).toBe('legacy');
    r.setAgentKinetics('physiologic');
    expect(r.getAgentKinetics()).toBe('physiologic');
  });
});
