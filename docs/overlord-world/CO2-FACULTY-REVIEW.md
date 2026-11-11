# For faculty review: arterial CO2 during hypoventilation in the simulator engine

Status: **open question for faculty. Nothing in the engine was changed.** Until this is reviewed, CO2 and end-tidal
CO2 values during induction should not be scored or presented as clinically reliable. Passing software tests shows the
code does what it was written to do. It does not show that what it was written to do is clinically right.

## What was seen

Deployed engine (`crisis-sim`, commit `bcba0c3`), driven only through its own runner, 70 kg default adult.
Fentanyl 100 mcg, propofol 140 mg, rocuronium 42 mg at time zero. No ventilation given.

| Simulated time | PaCO2 (mmHg) | Minute ventilation (L/min) | State |
|---|---|---|---|
| 0 s | about 40 | spontaneous | awake |
| 30 s | 54 | 4.6 | breathing slowing |
| 60 s | 74 | 0.8 | nearly apnoeic |
| 90 s | 99 | 0.2 | nearly apnoeic |
| 120 s | 100 | 0 | apnoeic |
| 240 s | 129 | 0 | apnoeic. Measured on the older local copy of the same routine; about 3.6 mmHg per minute over the last two minutes |

So PaCO2 rose about 59 mmHg in 90 seconds while the patient was still making small breaths, then about 3.6 mmHg per
minute once fully apnoeic.

## Why it happens (code)

`crisis-sim/sim/ventilatorSystem.js`, `updateCO2`:

- When alveolar ventilation is above 0.3 L/min, PaCO2 moves toward the steady-state value
  `0.863 x VCO2 / VA` (limited to 10 to 130 mmHg) with a 25-second time constant.
- When alveolar ventilation is 0.3 L/min or less, PaCO2 rises at `0.06 mmHg/s x (VCO2 / 200)`, which is 3.6 mmHg per
  minute at a VCO2 of 200 mL/min.
- Spontaneous tidal volume is fixed at 400 mL and dead space at 2.2 mL/kg, so as respiratory rate falls, calculated
  alveolar ventilation falls quickly and the steady-state target becomes very high (for example a rate of 7 gives a
  target near 100 mmHg).

## The question

1. The apnoea branch (3.6 mmHg/min) is close to the usual teaching figure (about 6 mmHg in the first minute, then
   3 to 4 mmHg per minute). Is the missing first-minute step acceptable for teaching?
2. The hypoventilation branch reaches a new steady state with a 25-second time constant. Because the body stores a
   large amount of CO2, the real approach to a new steady state takes many minutes. As written, **a patient who is
   breathing a little accumulates CO2 about ten times faster than a patient who is not breathing at all.** Is that
   acceptable, or should the rise in this branch be limited to the apnoeic rate?
3. Is a fixed 400 mL spontaneous tidal volume acceptable while drive is falling?

## If faculty want it changed (proposal only)

- Limit the upward rate in the hypoventilation branch to no more than the apnoeic rate; keep a faster fall for
  hyperventilation if desired, with its own time constant.
- Add a test that states the rule: "with any ventilation, PaCO2 never rises faster than it does in apnoea".
- Record the reference used for the chosen numbers in `crisis-sim/docs/`.

## Also noted, lower confidence

In the older local copy of the engine the patient started on FiO2 1.0 before any preoxygenation and SpO2 stayed at
99% through eight minutes of apnoea. The deployed version has since changed how FiO2 is set ("FiO2 from flowmeters");
I did not re-measure this on the deployed engine, so treat it as a prompt to check, not a finding.
