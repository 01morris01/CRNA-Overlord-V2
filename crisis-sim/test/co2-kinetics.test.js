/* CO2 kinetics: a controlled comparison of the two update rules in VentilatorSystem.updateCO2.

   The defect (reported 2026-11-10, docs/co2-kinetics.md): under the legacy rule a patient who is still breathing a
   little accumulates CO2 many times faster than a patient who is not breathing at all, and the rate jumps about
   sixty-fold as alveolar ventilation crosses 0.3 L/min.

   What these tests are and are not. They check that the code obeys a stated rule. The rule itself ("some ventilation
   can never raise PaCO2 faster than none") is a physical argument, and the numbers are model assumptions written in
   docs/co2-kinetics.md. Passing here is software correctness. It is not physiological validation; that is faculty's.

   `it.fails` marks a test that is EXPECTED to fail today because it states the correct behaviour and the default
   (legacy) rule does not have it. If someone changes the legacy rule, these start "passing" and vitest reports that,
   so the change cannot go unnoticed. No existing test or expected value was edited. */
import { describe, expect, it } from 'vitest';
import { VentilatorSystem, CO2_STORE_ML_PER_MMHG } from '../sim/ventilatorSystem.js';
import { AirwayDevice, buildPhysRig, VentMode } from '../sim/index.js';
import { idealBodyWeightKg } from '../sim/sedationExperimental.js';

/** The update rule alone: a 70 kg patient on a mask, breathing spontaneously at `rr` (0 = apnoea), VCO2 200 mL/min. */
function bench(kinetics, { rr, seconds, dt = 0.02, start = 40, vco2 = 200 }) {
  const v = new VentilatorSystem(); v.co2Kinetics = kinetics;
  v.patient = { weightKg: 70, airwayDeviceState: 'mask', isBreathingSpontaneously: rr > 0, respiratoryRate: rr, airwayPatency: 1, vco2MlMin: vco2, paCO2: start, etCO2: start - 3 };
  const steps = Math.round(seconds / dt); for (let i = 0; i < steps; i++) v.updateCO2(dt);
  return v.patient.paCO2;
}
/** Alveolar ventilation the rule computes for a spontaneous rate: (400 mL - 2.2 mL/kg dead space) x rate. */
const VA = (rr) => Math.max(0, (400 - 2.2 * 70) * rr) / 1000;
const risePerMin = (kinetics, rr) => bench(kinetics, { rr, seconds: 60 }) - 40;

describe('CO2 kinetics: the reported behaviour, reproduced in isolation (legacy rule)', () => {
  it('measures it: breathing 6/min raises PaCO2 far faster than apnoea', () => {
    const apnoea = risePerMin('legacy', 0), six = risePerMin('legacy', 6);
    expect(apnoea).toBeCloseTo(3.6, 1);            // 0.06 mmHg/s
    expect(VA(6)).toBeCloseTo(1.476, 3);           // L/min: well above the 0.3 boundary
    expect(six).toBeGreaterThan(apnoea * 10);      // this is the defect, pinned so it is visible
  });
  it.fails('STATES THE CORRECT BEHAVIOUR: some ventilation never raises PaCO2 faster than none', () => {
    for (const rr of [2, 4, 6, 8]) expect(risePerMin('legacy', rr)).toBeLessThanOrEqual(risePerMin('legacy', 0) + 0.05);
  });
  it.fails('STATES THE CORRECT BEHAVIOUR: no jump in the rate of rise across the 0.3 L/min boundary', () => {
    const below = risePerMin('legacy', 1.2), above = risePerMin('legacy', 1.25);   // VA 0.295 and 0.3075 L/min
    expect(VA(1.2)).toBeLessThan(0.3); expect(VA(1.25)).toBeGreaterThan(0.3);
    expect(above / below).toBeLessThan(1.5);
  });
});

describe('dead space basis', () => {
  it('defaults to total body weight for 70 kg and 139 kg patients', () => {
    for (const weightKg of [70, 139]) {
      const r = buildPhysRig(6000 + weightKg, weightKg, 170, 45);
      expect(r.v.deadSpaceBasis).toBe('total');
      expect(r.v.getDeadSpaceMl()).toBeCloseTo(Math.max(60, 2.2 * weightKg), 4);
    }
  });

  it('uses Devine ideal body weight when deadSpaceBasis is ideal', () => {
    const r = buildPhysRig(6139, 139, 175, 45);
    r.p.sex = 'Male';
    r.v.deadSpaceBasis = 'ideal';
    expect(r.v.getDeadSpaceMl()).toBeCloseTo(2.2 * idealBodyWeightKg(175, 'Male'), 5);
  });

  it('lowers EtCO2 on the same ventilator settings in a large patient', () => {
    const run = (deadSpaceBasis) => {
      const r = buildPhysRig(6140, 139, 175, 45);
      r.p.sex = 'Male';
      r.v.co2Kinetics = 'stores';
      r.v.deadSpaceBasis = deadSpaceBasis;
      r.p.transitionAirwayDevice(AirwayDevice.Intubated);
      r.v.setMode(VentMode.VCV);
      r.v.setTidalVolume = 560;
      r.v.setRespiratoryRate = 12;
      r.v.setFiO2 = 0.21;
      r.v.o2FlowLPerMin = 2;
      r.v.airFlowLPerMin = 0;
      r.v.n2oFlowLPerMin = 0;
      r.core.stepFor(5 * 60);
      return r.p.etCO2;
    };

    const total = run('total');
    const ideal = run('ideal');
    expect(ideal).toBeLessThan(total - 5);
  });
});

describe("CO2 kinetics: the prepared correction ('stores')", () => {
  it('some ventilation never raises PaCO2 faster than none', () => {
    const apnoea = risePerMin('stores', 0);
    for (const rr of [1, 2, 4, 6, 8]) expect(risePerMin('stores', rr)).toBeLessThanOrEqual(apnoea + 0.05);
  });
  it('apnoea rises at the same rate as the legacy apnoea branch (3.6 mmHg/min at VCO2 200)', () => {
    expect(risePerMin('stores', 0)).toBeCloseTo(risePerMin('legacy', 0), 1);
    expect(bench('stores', { rr: 0, seconds: 300 }) - 40).toBeCloseTo(18, 0);
    expect(200 / CO2_STORE_ML_PER_MMHG).toBeCloseTo(3.6, 6);
  });
  it('the rate of rise is continuous across the old 0.3 L/min boundary', () => {
    expect(risePerMin('stores', 1.25) / risePerMin('stores', 1.2)).toBeGreaterThan(0.95);
    expect(risePerMin('stores', 1.25) / risePerMin('stores', 1.2)).toBeLessThan(1.05);
  });
  it('reaches the same steady state as the alveolar ventilation equation', () => {
    for (const rr of [8, 12, 20]) expect(bench('stores', { rr, seconds: 3 * 3600, dt: 0.5 })).toBeCloseTo(0.863 * 200 / VA(rr), 0);
  });
  it('hyperventilation lowers PaCO2 and hypoventilation raises it, both over minutes', () => {
    const fast = bench('stores', { rr: 24, seconds: 300 }), slow = bench('stores', { rr: 8, seconds: 300 });
    expect(fast).toBeLessThan(37); expect(fast).toBeGreaterThan(25); expect(slow).toBeGreaterThan(43); expect(slow).toBeLessThan(40 + 18);
  });
  it('does not depend on the timestep', () => {
    for (const rr of [0, 6, 12]) expect(bench('stores', { rr, seconds: 240, dt: 0.5 })).toBeCloseTo(bench('stores', { rr, seconds: 240, dt: 0.02 }), 1);
  });
});

describe('CO2 kinetics: timestep behaviour of the legacy rule', () => {
  it('the legacy approach to target depends only slightly on the timestep', () => {
    expect(Math.abs(bench('legacy', { rr: 6, seconds: 60, dt: 0.5 }) - bench('legacy', { rr: 6, seconds: 60, dt: 0.02 }))).toBeLessThan(1.0);
  });
});

describe('CO2 kinetics: is the resting patient in balance?', () => {
  const rest = (kinetics, minutes) => { const r = buildPhysRig(4242, 70, 170, 45); r.v.co2Kinetics = kinetics; const start = r.p.paCO2; r.core.stepFor(minutes * 60); return { start, end: r.p.paCO2, r }; };
  it('legacy: an untouched awake patient drifts up about 8 mmHg within five minutes (400 mL assumed, 490 mL breathed)', () => {
    const { start, end, r } = rest('legacy', 5); expect(end - start).toBeGreaterThan(6); expect(r.p.spontaneousTidalVolume).toBeGreaterThan(450);
  });
  it.fails('STATES THE CORRECT BEHAVIOUR: an untouched awake patient stays within 3 mmHg of baseline for thirty minutes (legacy)', () => {
    const { start, end } = rest('legacy', 30); expect(Math.abs(end - start)).toBeLessThan(3);
  });
  it("'stores' uses the tidal volume the patient is actually breathing and settles where the ventilation equation says", () => {
    const { end, r } = rest('stores', 120), va = (r.p.spontaneousTidalVolume - Math.max(60, 2.2 * 70)) * r.p.respiratoryRate / 1000;
    expect(end).toBeCloseTo(0.863 * r.p.vco2MlMin / va, 0);
  });
  it.fails("OPEN CALIBRATION QUESTION: under 'stores' the resting inputs still settle about 5 mmHg below baseline", () => {
    const { start, end } = rest('stores', 120); expect(Math.abs(end - start)).toBeLessThan(3);
  });
});

/** End to end: the whole engine, standard induction, nobody ventilating. */
function induction(kinetics, seconds) {
  const r = buildPhysRig(4242, 70, 170, 45); r.v.co2Kinetics = kinetics;
  r.d.administerBolus('Fentanyl', 0.1); r.d.administerBolus('Propofol', 140); r.d.administerBolus('Rocuronium', 42);
  const out = []; for (let t = 30; t <= seconds; t += 30) { r.core.stepFor(30); out.push(+r.p.paCO2.toFixed(1)); }
  return out;
}
describe('CO2 kinetics: end to end after a standard induction with no ventilation', () => {
  it('legacy reproduces the report: PaCO2 passes 90 mmHg within 90 seconds', () => {
    const p = induction('legacy', 90); expect(p[p.length - 1]).toBeGreaterThan(85);
  });
  it("'stores' stays within what apnoea alone could produce", () => {
    const start = buildPhysRig(4242, 70, 170, 45).p.paCO2, p = induction('stores', 240);
    p.forEach((v, i) => expect(v).toBeLessThanOrEqual(start + 3.6 * ((i + 1) * 0.5) * 1.15 + 1));   // 3.6 mmHg/min, 15% margin for a raised VCO2
    expect(p[p.length - 1]).toBeGreaterThan(start + 5);                                            // and it does rise
  });
});
