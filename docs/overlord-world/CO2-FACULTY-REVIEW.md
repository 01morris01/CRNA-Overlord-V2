# For faculty review: arterial CO2 in the simulator

**Nothing the students use has changed.** The full technical record, with tests, is in
`crisis-sim/docs/co2-kinetics.md`. This page is the short version and the questions that need a clinical answer.

Until these are answered, CO2 and end-tidal CO2 during induction and hypoventilation should not be scored or
presented as clinically reliable. The engine's tests passing shows the code does what it was written to do. It does
not show that what it was written to do is physiologically right.

## What is wrong

1. **A patient who is breathing a little accumulates CO2 far faster than one who is not breathing at all.**
   After a standard induction with no ventilation, the simulator's PaCO2 goes 41, 54, 73, 98 at 0, 30, 60 and 90
   seconds. The textbook figure for complete apnea is about 10 mmHg in the first minute and 3.5 mmHg per minute
   after that (Barash 9th ed., "CO2 Exchange under Anesthesia").
2. **The rate jumps about twenty-fold at one threshold.** Just below 0.3 L/min of alveolar ventilation the rise is
   3.6 mmHg per minute; just above it, 82.
3. **An awake, untouched patient is not in balance.** PaCO2 drifts from 41 to 49 mmHg in two minutes, because the
   CO2 calculation assumes a 400 mL breath while the same patient is modeled elsewhere as breathing 490 mL.

## Why

The engine jumps to the textbook steady state with a 25-second time constant, as though the body stored no CO2.

## What has been prepared (switched off)

One mass-balance rule: CO2 produced, minus CO2 breathed out, divided by how much CO2 the body holds per mmHg. It
keeps today's apnea rate (3.6 mmHg/min) and today's steady state, removes the threshold, and uses the patient's own
tidal volume. Same induction: 41, 41, 42, 44 at 0, 30, 60 and 90 seconds, and 56 at five minutes.

## Questions for faculty

1. Is a single CO2 store acceptable for teaching? It cannot show the larger first-minute rise.
2. The storage capacity (55.6 mL per mmHg) was chosen to keep the current apnea rate, not taken from a reference.
   Is 3.6 mmHg per minute the figure you want, and should capacity scale with body weight?
3. With the correction, hyperventilation lowers CO2 over minutes instead of seconds (rate 24 for five minutes: 35
   mmHg instead of 29). Is that the behavior you want students to see?
4. Resting values are not consistent with each other: tidal volume 490 mL, rate 14, dead space 2.2 mL/kg and CO2
   production 2.8 mL/kg/min balance at 36 mmHg, not the 41 baseline. Which one should change?
5. Turning the correction on changes 8 existing tests: four are exact-match comparisons with the original C# engine,
   four are malignant hyperthermia timings tuned on the old rule. Do you accept losing exact parity for CO2, and how
   fast should EtCO2 climb in MH?

## Where the correction is used (added 11 November 2026)

One place: the institute's 3D operating room (`world/js/cases.js`). A case started there switches the correction on for
that case only, because the room's monitor would otherwise show a breathing patient's carbon dioxide climbing past
100 mmHg, and a learner would be taught something false by a monitor that looks real. The room's station offers the
engine's original rule instead, the case panel names the rule in use while a case runs, and every debrief and saved
result records it (`co2: "stores"` or `"legacy"`). This is a choice made by an AI assistant for honesty of display, not a
faculty decision, and it should be reversed or confirmed by faculty. Nothing was changed in the engine's files to do it.

## What was not done

- The correction is not enabled in the classic live simulator, the instructor console, or any scenario file.
- No existing test or expected value was changed.
- No clinician has reviewed the correction.
