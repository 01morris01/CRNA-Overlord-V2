# CO2 kinetics in the simulator engine: investigation and prepared correction

Status: **default behavior unchanged. A correction is prepared behind a switch and is not enabled anywhere.**
Engine commit investigated: `bcba0c3` (deployed). Date: 2026-11-10.

Two different claims are made in this document and they must not be confused:

- **Software correctness**: the code obeys a stated rule, shown by tests. This document establishes that.
- **Physiological validation**: the rule and its numbers describe a patient well enough to teach from. This document
  does **not** establish that. It states the assumptions so faculty can.

## 1. The reported behavior, reproduced

Whole engine, default 70 kg adult, fentanyl 100 mcg + propofol 140 mg + rocuronium 42 mg at time zero, nobody
ventilating. PaCO2 every 30 seconds (`test/co2-kinetics.test.js`, "end to end"):

| Seconds | 0 | 30 | 60 | 90 | 120 | 150 | 180 | 240 | 300 |
|---|---|---|---|---|---|---|---|---|---|
| Legacy rule (default) | 41 | 54 | 73 | 98 | 120 | 127 | 129 | 133 | 136 |
| Prepared correction | 41 | 41 | 42 | 44 | 46 | 48 | 49 | 53 | 56 |

Reference for comparison, from the learner's own textbook: during apnea PaCO2 rises about 10 mmHg in the first
minute and 3.5 mmHg per minute afterwards (Barash, Cullen, and Stoelting's Clinical Anesthesia, 9th ed., section
"CO2 Exchange under Anesthesia"; page 1131 of the PDF, which has no printed page numbers).

## 2. Where it comes from

`sim/ventilatorSystem.js`, `updateCO2(dt)`. The rule first computes alveolar ventilation:

    VA (L/min) = max(0, (tidal volume - dead space) x rate) / 1000 x airway patency
    dead space = max(60, 2.2 mL/kg)
    tidal volume when breathing spontaneously = 400 mL (a constant)

then updates PaCO2 by one of two methods:

| Condition | Method |
|---|---|
| VA > 0.3 L/min | move toward `0.863 x VCO2 / VA` (limited to 10 to 130) with `Lerp(..., dt / 25)`: a 25-second time constant |
| VA <= 0.3 L/min | add `0.06 x (VCO2 / 200)` mmHg per second: 3.6 mmHg per minute at VCO2 200 |

### What was inspected

**The boundary between the two methods.** The update rule alone, 70 kg, VCO2 200, starting at 40 mmHg, rise in the
first minute:

| Spontaneous rate | VA (L/min) | Legacy (mmHg/min) | Correction (mmHg/min) |
|---|---|---|---|
| 0 (apnea) | 0.000 | 3.6 | 3.6 |
| 1.2 | 0.295 | 3.6 | 3.3 |
| 1.25 | 0.307 | **81.8** | 3.3 |
| 2 | 0.492 | 81.8 | 3.2 |
| 4 | 0.984 | 81.8 | 2.8 |
| 6 | 1.476 | 70.0 | 2.3 |
| 8 | 1.968 | 43.4 | 1.9 |
| 12 | 2.952 | 16.8 | 1.1 |

Crossing 0.3 L/min multiplies the rate of rise by about 23 in the first minute (3.6 to 81.8). A patient taking one
breath in fifty seconds is modeled as accumulating CO2 twenty times faster than a patient taking none.

**Units.** Consistent. `0.863 x VCO2 (mL/min) / VA (L/min)` gives mmHg; the apnea branch is mmHg per second times
seconds. No unit error was found.

**Timestep.** Not the cause. The legacy rule changes by less than 1 mmHg between a 0.02 s and a 0.5 s step over a
minute; the correction changes by less than 0.1 mmHg (tests "timestep").

**Ventilation inputs.** A second, separate problem. The rule assumes a spontaneous tidal volume of 400 mL, while the
engine's own value for the same patient is about 490 mL (`patient.spontaneousTidalVolume`). With 400 mL, dead space
154 mL and a rate of 14, VA is 3.44 L/min, whose steady state is 49 mmHg. So **an awake, untouched patient drifts
from 41 to 49 mmHg within about two minutes and stays there** (test "is the resting patient in balance?").

### The cause, in one sentence

The steady-state equation is right, but the approach to it is given a 25-second time constant, as if the body held
no CO2; in a body that stores CO2, PaCO2 cannot rise faster with some ventilation than it does with none.

## 3. The prepared correction

`ventilator.co2Kinetics = 'stores'` (default is `'legacy'`). One mass balance replaces both methods:

    dPaCO2/dt = (VCO2 - VA x PaCO2 / 0.863) / C

- `VCO2`: CO2 produced, mL/min (unchanged).
- `VA x PaCO2 / 0.863`: CO2 breathed out, mL/min. This is the same ventilation equation, rearranged.
- `C = 200 / 3.6 = 55.6 mL/mmHg`: how much CO2 the body takes up per mmHg (`CO2_STORE_ML_PER_MMHG`).
- Spontaneous tidal volume is the patient's own (about 490 mL at rest), not 400 mL.

### Assumptions, stated so they can be challenged

1. **One well-mixed store.** Real CO2 stores have fast and slow parts. One compartment cannot reproduce the larger
   rise in the first minute of apnea (about 10 mmHg per the reference above); it gives 3.6. Neither does the legacy
   rule.
2. **C is the capacity the legacy apnea branch already implies.** It was not taken from a physiology reference. It
   was chosen so apnea behaves exactly as it does today (3.6 mmHg/min at VCO2 200, against the reference's 3.5).
   Whether C should scale with body weight is open.
3. **Steady state is unchanged**: `0.863 x VCO2 / VA`.
4. **Consequence, not assumption**: the time to a new steady state is `C x 0.863 / VA` minutes, so it is naturally
   slower when ventilation is low (about 12 minutes at 4 L/min) and faster when it is high (about 6 minutes at
   8 L/min).

### What the correction guarantees (tests, all passing)

- Any ventilation raises PaCO2 no faster than apnea.
- Apnea rises at the legacy apnea rate.
- No jump across 0.3 L/min.
- Same steady state as the ventilation equation.
- Independent of timestep.
- After induction with no ventilation, PaCO2 stays within what apnea alone could produce.

### What it does not fix

- **Resting balance is still about 5 mmHg off.** With the engine's own resting values (tidal volume 490 mL, rate 14,
  dead space 2.2 mL/kg, VCO2 2.8 mL/kg/min) the steady state is 36 mmHg, and baseline is 41. Under the correction an
  untouched patient drifts down to 36 over about half an hour (legacy: up to 49 in two minutes). The resting inputs
  are not mutually consistent. Bringing them into balance means changing one of them (for example VCO2 near
  3.2 mL/kg/min); that is a calibration decision for faculty and is recorded as an expected-failure test.
- **Spontaneous tidal volume does not fall with drug depression** in either rule; only the rate does.
- **Hyperventilation becomes slower** (5 minutes at a rate of 24: legacy 29 mmHg, correction 35 mmHg). Faculty should
  say whether that is the behavior they want to teach.

## 4. Effect on the existing test suite

Normal run, default rule: **46 files, 1,203 tests, all pass** (1,187 existing, unchanged, plus 16 new).
No existing test or expected value was edited.

Experiment, correction forced on for every existing test (`npx vitest run -c vitest.co2-stores.config.js`):
**8 of the 1,187 existing tests change.**

| Test | Why it changes |
|---|---|
| `parity.test.js`: high_spinal_001 and malignant_hyperthermia_001, tick and action-log parity (4 tests) | These compare against frozen output of the original C# engine, which has the legacy rule. Any change to CO2 breaks exact parity by definition |
| `clinical-timing.test.js`: MH EtCO2 climbs over minutes; instant versus realistic MH (2 tests) | The malignant hyperthermia timing was tuned on the 25-second rule |
| `case-scenarios.test.js`: Brittany Cole MH branch (1 test) | Same |
| `booth-instructor.test.js`: hand-injected MH explains the EtCO2 rise (1 test) | Same |

Enabling the correction therefore needs three decisions that are not mine to make: accept the loss of exact C#
parity for CO2, re-time malignant hyperthermia, and choose the resting calibration.

## 5. Tests added

`test/co2-kinetics.test.js` (16 tests). Four use `it.fails`: they state the correct behavior and are expected to
fail under the default rule, so the defect is pinned in the suite and cannot be changed unnoticed.

| Group | What it shows |
|---|---|
| Reproduced in isolation (legacy) | The measurement; and two expected failures stating the invariant and the continuity |
| Prepared correction | Six properties listed above |
| Timestep | Legacy depends only slightly on the step |
| Resting balance | Legacy drift measured; correct behavior stated (expected failure); correction settles where the equation says; open calibration question (expected failure) |
| End to end | Legacy reproduces the report; correction stays within the apneic bound |
