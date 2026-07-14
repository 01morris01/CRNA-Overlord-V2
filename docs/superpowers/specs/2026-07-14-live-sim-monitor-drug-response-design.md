# Live Simulation Monitor and Drug Response Repair

**Status:** Approved design

**Date:** 2026-07-14

**Branch:** `codex/live-sim-monitor-drug-fix`

## Problem statement

The deployed live simulation has four related defects:

1. A drug can be administered while the simulation is still `READY` or deliberately paused. The bolus enters the drug system, but no physiologic time advances, so the monitor appears unchanged.
2. The current rocuronium calibration is not clinically credible at the UI's 0.6 mg/kg intubating dose. In the deterministic 70 kg patient it still produces TOF 4 at 90 seconds and TOF 3 after five minutes, with most respiratory muscle capability preserved.
3. Six equal-width numeric cards use viewport-scaled type. At common laptop widths the NIBP value is wider than its card, so the diastolic value clips outside the visible viewport.
4. The display synthesizes every historical waveform sample from `absoluteTime × currentRate`. Small engine-derived HR changes therefore move the whole ECG/pleth history at once, producing visible phase jumps and flicker.

The rocuronium reference target is the FDA prescribing information: an initial 0.6 mg/kg dose produces at least 80% block at a median of one minute, maximum block at a median of 1.8 minutes, and a median clinical duration of 31 minutes (reported range 15–85 minutes). Reference: <https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/217472s000lbl.pdf>.

## Goals

- Make a first drug action visibly start physiologic time.
- Preserve an intentional pause while making queued-dose behavior explicit.
- Preserve the existing graded propofol PK/PD response.
- Recalibrate rocuronium 0.6 mg/kg to a credible onset and duration.
- Keep neuromuscular block, TOF, respiratory muscle capability, and reversal on one shared NMB state.
- Keep central respiratory drive independent from paralysis.
- Adopt the approved clinical-priority monitor layout (layout B).
- Replace flickering waveform synthesis with stable rolling history.
- Preserve the engine/display truth boundary: the display never writes a vital.

## Non-goals

- Do not make propofol automatically impose forced apnea.
- Do not couple airway device state to respiratory drive.
- Do not add random ECG noise, arrhythmia inference, or new physiologic signals.
- Do not redesign the instructor console outside the dose-state feedback needed here.
- Do not change unrelated CRNA Overlord game, regional-blocks, or character work.

## Drug action lifecycle

The runner continues to own the drug system and simulation clock. The controller derives three interaction states from the runner:

- `READY`: not running and simulation time is zero.
- `RUNNING`: simulation time is advancing.
- `PAUSED`: not running and simulation time is greater than zero.

Drug behavior:

- From `READY`, record the bolus at time zero and immediately start the runner. The status message names the dose and says that effect evolves with simulation time.
- From `RUNNING`, record the bolus and continue normally.
- From `PAUSED`, record the bolus in the drug compartment without advancing time. Return a queued result and announce `DOSE QUEUED — RESUME TO ADVANCE` through the existing live status region.
- The existing start button reads `START` in `READY` and `RESUME` in `PAUSED`. The existing pause and reset buttons remain separate; pause is enabled only while running.

The controller must not mutate HR, BP, RR, SpO2, EtCO2, TOF, or any other derived value. Propofol keeps the existing PK/PD curve; the repair is that the first dose starts time and paused behavior is unambiguous.

## Rocuronium and the single NMB state

Create one pure rocuronium effect-site-to-blockade function in the simulation layer. Both `PatientPhysiology.updateNeuromuscular()` and reversal calculations consume that function. No parallel paralysis flag, UI-only block value, or second NMB store is permitted.

The derived path remains:

```text
rocuronium dose
  -> rocuronium effect-site concentration
  -> shared raw rocuronium blockade
  -> sugammadex / neostigmine relief
  -> effectiveNmbBlockade
  -> TOF count + TOF ratio
  -> respiratoryMuscleCapability
  -> spontaneous tidal volume + minute ventilation
```

`centralDrive` is not modified by rocuronium. An unsupported patient can therefore retain central drive while losing the ability to move air. Airway device state and ventilator support remain orthogonal:

- Unsupported mask/extubated patient: spontaneous TV and MV collapse as muscle capability falls; capnography and oxygenation deteriorate through the existing engine derivation.
- Intubated patient with VCV support: mechanical minute ventilation substitutes for lost muscle capability, preserving gas exchange.

Deterministic 70 kg adult acceptance anchors for 0.6 mg/kg rocuronium:

- At 60 seconds: `effectiveNmbBlockade >= 0.80` and central drive remains unchanged.
- By 180 seconds: `effectiveNmbBlockade >= 0.95`, TOF is 0, and respiratory muscle capability is at most 0.10.
- Block remains clinically meaningful through at least 15 minutes.
- Recovery to 25% of control twitch (approximately 75% blockade remaining) occurs within the FDA-reported 15–85 minute clinical-duration range, targeting the neighborhood of the 31-minute median.
- Existing sugammadex dose tiers and count-graded neostigmine behavior operate on the recalibrated state and retain their selectivity rules.

## Monitor layout B

The second-screen display uses this vertical order:

1. Education fence and connection header.
2. Primary numeric row: HR, wide NIBP/MAP, SpO2, EtCO2/RR.
3. Full-width ECG II, pleth, and CO2 waveform rows.
4. Compact secondary numeric row: temperature and TOF/ratio.
5. Existing emergence, machine, and alarm panels.

The primary row uses a weighted grid so NIBP receives more width than a single-value card. BP also gets a dedicated responsive type scale and `white-space: nowrap`. Waveform rows use a fixed narrow label column plus `minmax(0, 1fr)` for the canvas, and each canvas has `min-width: 0`. This removes intrinsic-canvas overflow and guarantees the complete pleth plot remains visible.

Responsive behavior:

- Wide/classroom: four primary cards in one row.
- Laptop/tablet: two primary cards per row, preserving NIBP width.
- Phone: one or two cards based on available width; no horizontal scrolling or clipped diastolic value.
- TEMP and TOF remain a two-card secondary row until the narrow phone breakpoint, where they stack if required.

## Stable waveform renderer

Move rendering math into a small display-only module with pure morphology functions and a stateful rolling-sample buffer.

- Integrate cardiac and respiratory phase from elapsed frame time rather than multiplying absolute time by the newest rate.
- Generate new samples at a fixed logical sample frequency and append them to bounded ECG, pleth, and capnogram buffers.
- Render existing samples without recomputing their phase. Rate changes affect future samples only, so history does not jump.
- ECG and pleth use the same cardiac phase source with different morphology/amplitude functions.
- Clamp frame gaps to prevent a backgrounded tab from generating a burst of invented history.
- Missing HR produces a flat ECG and pleth. Missing SpO2 produces a flat pleth. `capnogramPresent !== true` produces a flat CO2 trace.
- Clamp plotted Y positions inside vertical padding so peaks and the full pleth contour remain visible.
- Keep waveform synthesis explicitly rendering-only; it never feeds the engine or transport.

## Error handling and feedback

- Dose conversion failures retain the existing error status.
- A queued paused dose is reported immediately and remains frozen until resume.
- The clock and case-state label update immediately when a READY dose starts the runner.
- Display connection/stale behavior is unchanged.
- If canvas dimensions are temporarily zero, the renderer skips drawing without throwing and resumes on the next valid frame.

## Evidence plan

### Automated

- Runner/controller tests for READY auto-start, RUNNING dose, and PAUSED queued status.
- Existing graded propofol response test remains unchanged and passes.
- New rocuronium onset, maximum-block, duration, and central-drive-independence tests.
- Axis-orthogonality evidence using the recalibrated block: unsupported deterioration versus intubated VCV stability.
- Sugammadex and neostigmine evidence against the same shared NMB calculation.
- Waveform tests proving:
  - existing history is unchanged by a small HR update;
  - phase advances continuously;
  - missing inputs generate zeros;
  - buffer size is bounded;
  - peaks stay within plotting bounds.
- DOM/CSS contract tests for the primary/secondary layout and non-clipping canvas grid.
- Original parity/evidence suites, snapshot contract, and full induction-to-emergence smoke case.

### Browser

- READY propofol dose starts the clock and produces visible graded changes.
- PAUSED dose announces queued state and begins evolving only after resume.
- Rocuronium 0.6 mg/kg demonstrates TOF/muscle onset without changing central drive.
- Unsupported and mechanically supported rocuronium cases produce correctly different gas exchange.
- NIBP, ECG, full pleth, and CO2 traces are inspected at phone, laptop, and classroom widths.
- ECG remains visually stable during small HR changes and produces no console errors.
- Separate display late join, instructor refresh, and paused heartbeat still work.

## PWA and release

- Add the waveform module to the service-worker application shell.
- Increment the cache version so installed PWAs replace the defective display assets.
- Implement and verify on the isolated branch.
- Merge to `main` only after all automated and browser checks pass.
- Verify production serves the new cache version and corrected assets, then reproduce the reported flows on the deployed URL.
