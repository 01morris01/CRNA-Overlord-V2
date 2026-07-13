# Live Anesthesia Simulation UI Design

## Goal

Add a live induction-to-emergence teaching simulator to the existing CRNA Overlord static PWA. The instructor console owns one verified `SimRunner`; a second-screen display receives snapshots and renders them without running physiology.

The user's implementation brief is the approved design authority for this round. Where the brief leaves a choice, this document resolves it without expanding the physiology boundary.

## Architecture

The feature uses the existing fixed-view/native-ESM app architecture. The instructor is a DOM overlay declared in `index.html`, initialized from `app.js`, and opened from a new level-map menu control. The display is a separate cached HTML document. Both reuse the root theme tokens and require no router, framework, dependency, or build step.

The verified engine remains at `crisis-sim/`. `ui/liveSimView.js` is the only root module allowed to instantiate `SimRunner`. `ui/liveSimDisplay.js` never imports the runner or any engine module.

```text
level-map menu
    -> liveSimView (one SimRunner)
       -> runner methods -> verified engine -> snapshot()
       -> event log
       -> liveSimTransport.publishSnapshot()
                                    |
                                    v
                         BroadcastChannel adapter
                                    |
                                    v
                       liveSimDisplay (render only)
```

## Instructor console

The setup form exposes all and only `DEFAULT_CONFIG` fields. Applying setup resets the patient and clearly reports that reset in the event log. A compact vitals strip shows engine-derived state so the instructor can confirm actions without relying on the display window.

Controls are grouped by task:

- Case: start, pause, reset, 1x/5x/20x/100x speed, open display, export debrief, close.
- Patient: demographics and audited baseline values.
- Airway/drive: mask, intubate, extubate, and forced apnea. Failed device transitions render their engine-provided reason in an `aria-live` status area.
- Machine: Manual, VCV, PCV, PSV; TV, RR, PEEP, pressure control, pressure support, FiO2, fresh O2/air/N2O flow, vaporizer agent, and dial.
- Drugs: supported induction, maintenance, rescue, and emergence drugs. Each button displays clinical units and computed total milligrams. Every action calls `giveBolus()` with total milligrams.
- Complications: buttons for the existing scenario state machines. The wrapper delegates to the existing manager; it does not synthesize a vital change.
- Events: newest-first timestamped runner events.

## Complication wiring

`SimRunner` will include one `ScenarioManager` wired to its existing patient/drug/ventilator objects and ticked by `SimulationCore`. A generic live scenario definition keeps that manager in its normal running state. `injectComplication(type)` validates the public type list and calls `ScenarioManager.applyComplication({ complicationType: type, description: type })`.

Treatments are ordinary runner actions. For example, bronchospasm reads the engine's Albuterol effect-site concentration after `giveBolus("Albuterol", 1, ...)`; anaphylaxis reads epinephrine and the existing stop-agent action is not exposed because `SimRunner` has no public wrapper for it. Controls without a real runner path are omitted.

## Drug dosing

The dose model is declarative and testable. `computeDose(definition, weightKg)` returns `{totalMg, clinicalLabel}`. Important conversions include:

- fentanyl 2 mcg/kg -> `0.002 * weightKg` total mg;
- phenylephrine 100 mcg -> `0.1` total mg;
- epinephrine 10 mcg -> `0.01` total mg;
- sugammadex 2/4/16 mg/kg -> tier times weight in total mg;
- neostigmine 0.07 mg/kg -> `min(0.07 * weightKg, 5)` total mg;
- glycopyrrolate 0.2 mg or atropine 0.5 mg are available alongside neostigmine.

No UI action calls `administerWeightBasedBolus()`.

## Display transport and lifecycle

`createLiveSimTransport()` hides BroadcastChannel behind publish/subscribe methods. Messages include a protocol version, instructor `sessionId`, and monotonic `sequence`.

- Instructor publishes a state envelope on every runner snapshot and on request.
- Display publishes `state-request` at startup and on visibility regain.
- A late display receives the current snapshot immediately.
- When an instructor refresh creates a new `sessionId`, the display replaces stale state and resets render-only waveform phases.
- Sequence checks discard out-of-order snapshots within a session.
- Closing a transport removes handlers and closes its channel.

This interface can be backed by WebSocket later without changing view callers.

## Display rendering

The display presents:

- large HR, BP/MAP, SpO2, RR, EtCO2, temperature, TOF count, and TOF ratio;
- spontaneous RR, spontaneous TV, spontaneous MV, and effort adjacent to mandatory vent output;
- vent mode, set/measured TV and RR, PEEP, peak pressure, MV, FiO2, vaporizer agent/dial;
- ECG, pleth, and capnogram canvas traces;
- active threshold alarms with acknowledge and timed silence;
- connection/session status;
- a fixed “Educational simulation. Not for clinical use.” fence.

Waveform morphology and alarm tones are explicitly marked `RENDERING ONLY` in code. Capnogram presence is controlled exclusively by `snapshot.capnogramPresent`; the renderer does not infer airway or ventilation physiology.

## Debrief

`SimRunner.buildDebrief()` calls the existing `buildDebrief()` function with a live-session definition and `ScenarioRunState`, then adds the same `respiratoryAttribution` field used by scripted scenarios. The returned object contains the existing `SimulationResult` fields and no invented score model. The instructor downloads that object as JSON.

## Error handling

- Invalid patient values remain in the form and produce an inline error; no reset occurs.
- Invalid dose definitions or weights disable the action and report an error.
- Airway transition failures display the exact engine `reason`.
- Unsupported complication names throw before the engine is touched and are covered by tests.
- BroadcastChannel absence shows a persistent display-sync error while leaving the instructor engine usable.
- A display with no snapshot shows a waiting state, not fabricated normals.

## Testing

Tests are layered:

1. Snapshot contract verification before any UI code.
2. Vitest unit tests for runner additions and pure UI modules, written red-green.
3. A full-case Node smoke using the same public runner methods as the UI.
4. Static PWA checks for view registration, display import boundary, and complete cache manifest.
5. Local HTTP browser checks for both views, zero errors, late join, snapshot sync, and instructor refresh/session replacement.
6. Original engine suite remains 29/29 and parity fixtures remain byte-unchanged.

## Self-review

- No placeholders or unresolved design choices remain.
- One engine instance exists only in the instructor window.
- NMB/TOF/spontaneous effort are read from the single verified engine state.
- The display never derives physiology.
- The PWA cache is part of implementation, not deferred deployment work.
