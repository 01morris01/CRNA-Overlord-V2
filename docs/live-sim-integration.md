# Live Simulation Integration Audit

Date: 2026-07-13  
Base: `feature/engine-reversal-airway` at `80c067a`

## Repository placement

`git ls-tree -d --name-only main -- crisis-sim` returns no entry. The verified engine first enters the main application tree on `feature/engine-reversal-airway` as:

- `crisis-sim/sim/` — deterministic physiology, drug, ventilator, and scenario systems.
- `crisis-sim/ui/simRunner.js` — the live wall-clock wrapper and the only object the instructor controller may use for patient, drug, airway, and machine actions.
- `crisis-sim/test/`, `crisis-sim/package.json`, and `crisis-sim/package-lock.json` — the existing 29-test parity/evidence suite in its current location.

The live feature will preserve this layout. The static root app can import `/crisis-sim/ui/simRunner.js` directly when served by Vercel, while `npm test` continues to run from `crisis-sim/`. The engine internals will not be moved, copied, bundled, or rewritten.

## Existing navigation and view registration

The app has no URL router or view registry. `index.html` declares every primary view as a fixed DOM subtree under `#app`:

- `#splash` is the authenticated entry screen.
- `#game` is the question-session view.
- `#level-map` is a full-screen overlay toggled with the `.on` class.
- Store, pause, mode-picker, review, and map views are other fixed overlays toggled by functions.

`app.js` imports the module functions required at startup. `_initGameUI()` calls `createSimpleCourseMap()`, `updateHUD()`, and `renderCurrentQuestion()`. `ui/menus.js` renders course tabs and menu nodes into `#course-tabs` and `#map-path`, and its exported `showMap()`/`hideMap()` functions toggle the level-map view.

The live simulator will use the same convention:

1. Declare a fixed `#live-sim-view` subtree in `index.html`.
2. Import and call `initLiveSimView()` from `app.js` during `_initGameUI()`.
3. Add a labeled `LIVE ANESTHESIA SIM` menu button beside the existing level-map controls.
4. `showLiveSim()` hides `#level-map`/`#game` and displays `#live-sim-view`; `closeLiveSim()` reverses that transition.
5. The learner display is a separate static document, `/live-sim-display.html`, because the app has no router. It is opened by the instructor view and never imports or constructs the engine.

This is an in-app menu destination, not a standalone instructor prototype.

## Module loading

`index.html` loads `legacyShim.js` and `app.js` as native ES modules. Root modules use relative `.js` imports and there is no framework, bundler, transpiler, or build step. The live feature will remain native ESM:

- `ui/liveSimView.js` — instructor DOM/controller and sole `SimRunner` owner.
- `ui/liveSimModel.js` — supported control definitions, dose conversions, alarm/model helpers, and export validation.
- `ui/liveSimTransport.js` — BroadcastChannel-backed pub/sub with session and sequence metadata.
- `ui/liveSimDisplay.js` — display-only subscriber, monitor rendering, alarms, and waveform rendering.
- `assets/css/live-sim.css` — instructor view styling.
- `assets/css/live-sim-display.css` — second-screen styling.
- `live-sim-display.html` — display document.

The instructor imports `SimRunner`, `VentMode`, and `DEFAULT_CONFIG` from `crisis-sim/ui/simRunner.js`. No root app module imports patient, drug, ventilator, or scenario internals directly.

## Runner configuration audit

`SimRunner.DEFAULT_CONFIG` accepts exactly these reset-time fields:

| Field | Type | Default |
| --- | --- | ---: |
| `weightKg` | finite number | 70 |
| `heightCm` | finite number | 170 |
| `ageYears` | finite number | 45 |
| `sex` | `Male` or `Female` | `Male` |
| `baselineHR` | finite number | 72 |
| `baselineSystolic` | finite number | 120 |
| `baselineDiastolic` | finite number | 80 |
| `baselineSpO2` | finite number | 99 |
| `baselineRR` | finite number | 14 |
| `baselineTemp` | finite number | 36.6 |
| `baselineEtCO2` | finite number | 38 |

The setup form and presets will only populate these fields. `applyConfig(patch)` rebuilds the rig, so the UI clearly labels it as a patient reset.

## Supported actions and truth boundary

All patient-affecting instructor actions go through public runner methods:

- `applyConfig(patch)` for the audited patient fields.
- `start()`, `pause()`, `reset()`, and `setSpeed(mult)` for case flow.
- `giveBolus(name, totalDoseMg, label)` for drug actions. Per-kilogram or microgram calculations happen in the UI model and are converted to total milligrams before this call.
- `setVentMode(mode)` and `setMachine(patch)` for the ventilator and vaporizer.
- `setAirwayDevice(next)`, `intubate()`, and `extubate()` for validated device transitions. Rejected transition `reason` text is displayed.
- `setForcedApnea(boolean)` for the explicit forced-apnea contribution.
- `injectComplication(type)` will be added as a thin wrapper around the already-implemented `ScenarioManager.applyComplication()` state machines. It will not write a vital or create a second physiology model.
- `buildDebrief()` will reuse `buildDebrief()`/`ScenarioRunState` so the live export has the existing `SimulationResult` keys.

The UI never assigns `hr`, blood pressure, SpO2, RR, EtCO2, temperature, TOF, respiratory effort, or other derived values.

## Theme and interaction conventions

`assets/css/tokens.css` defines the app-wide dark system:

- surfaces: `--void`, `--abyss`, `--surf`, `--card`, `--card-hi`, `--line`, `--line-2`;
- semantic colors: `--green`, `--amber`, `--red`, `--blue`, `--purple`;
- text: `--txt`, `--txt-2`, `--muted`, `--muted-2`;
- type: `--fd` (display), `--fm` (monospace), `--fb` (body);
- motion: `--ease-*` and duration tokens, with a global reduced-motion rule.

The control surface will reuse these tokens, visible form labels, 44 px minimum targets, keyboard focus rings, semantic error text, tabular numerics, and a responsive grid. The second screen is dark, high contrast, full-screen, and readable at two meters. The educational-use fence is fixed, visible, and non-dismissible.

## Service worker cache mechanism

`sw.js` defines:

- `CACHE_VERSION`, interpolated into `CACHE_NAME` as `overlord-${CACHE_VERSION}`;
- `APP_SHELL`, the explicit list passed to `cache.addAll()` during install;
- activation cleanup that deletes every cache whose name is not the current `CACHE_NAME`;
- cache-first fetch behavior with same-origin background refresh, except `/data/questions/`, which is network-first with cache fallback;
- `SKIP_WAITING` message support.

Every new live-sim HTML, JS, and CSS file, plus every newly tracked engine module needed by the browser import graph, must be listed in `APP_SHELL`. `CACHE_VERSION` must be changed from `v38-patho2-neural-2026-07-07` so installed PWAs invalidate the old shell.

## Selected architecture and rejected alternatives

1. **Selected: root app views importing the preserved `crisis-sim/` engine.** This follows the app's native-ESM overlay convention, keeps one verified engine copy, preserves tests, and gives the display a clean read-only boundary.
2. **Rejected: copy `sim/` and `simRunner.js` into root `core/`/`ui/`.** This would duplicate or restructure the verified engine and make parity maintenance ambiguous.
3. **Rejected: reuse the untracked `crisis-sim/index.html` prototype as the feature.** It is not a main-menu destination, is not part of the tracked app, and would create a second independent UI architecture.

## Verification map

- Snapshot contract: a Node script instantiates `SimRunner`, advances a fixed tick, and validates every required key and type before UI implementation.
- Unit tests: dose conversion, complication delegation, debrief shape, transport late-join/session replacement, alarm derivation, and display model.
- Full-case smoke: 80 kg induction through emergence using only runner methods, including treated bronchospasm and the TOF-0 neostigmine negative case.
- App/PWA contract: static checks for menu registration, one-engine import boundary, display read-only imports, all cache entries, and version bump.
- Browser: both documents load through a local HTTP server with no console/page errors; instructor-to-display state and late-join behavior are exercised.
- Engine regression: the original `npm test -- --reporter=verbose` remains 29/29 before new live-sim tests are counted separately.
