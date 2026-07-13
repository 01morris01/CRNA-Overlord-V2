# Live Anesthesia Simulation UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a menu-reachable live anesthesia instructor console and read-only second-screen display driven entirely by the verified engine.

**Architecture:** The root static PWA gains one fixed instructor overlay and one separate display document. A single `SimRunner` in the instructor publishes snapshots through a transport adapter; the display subscribes and performs rendering only. The existing `crisis-sim/` engine and test location remain intact.

**Tech Stack:** Native ES modules, HTML, CSS, Canvas 2D, BroadcastChannel, Node.js, Vitest, service worker app-shell caching.

---

### Task 1: Verify the snapshot contract

**Files:**
- Create: `crisis-sim/test/snapshot-contract.mjs`

- [ ] Write a Node assertion script that lists every required numeric, boolean, and string key.
- [ ] Instantiate `SimRunner`, execute one `core.stepOnce(core.fixedStep)`, copy `core.simTime` to `runner.simTime`, and call `snapshot()`.
- [ ] Assert finite numbers, booleans, strings, and `airwayDevice` membership in `mask|intubated|extubated`.
- [ ] Run `node test/snapshot-contract.mjs` from `crisis-sim/`.
- [ ] If any assertion fails, stop without implementing UI. Otherwise preserve the command output for the final report.

### Task 2: Expose existing complication and debrief systems through the runner

**Files:**
- Modify: `crisis-sim/ui/simRunner.js`
- Create: `crisis-sim/test/live-runner.test.js`

- [ ] Write failing tests proving `injectComplication("Bronchospasm")` activates the existing state machine, Albuterol reverses its driver trend, unsupported names reject, and `buildDebrief()` returns the existing SimulationResult keys.
- [ ] Run `npx vitest run test/live-runner.test.js --reporter=verbose` and confirm missing-method failures.
- [ ] Build a physiology rig plus `ScenarioManager`, wire it to `core.scenario`, and start a generic live definition using the audited config.
- [ ] Add `injectComplication(type)` with an explicit allowlist that delegates to `ScenarioManager.applyComplication()` and logs the event.
- [ ] Add `buildDebrief()` using the existing `buildDebrief()` and `ScenarioRunState`, including `respiratoryAttribution` exactly as scripted scenarios do.
- [ ] Run the focused tests, then all 29 existing engine tests.

### Task 3: Build pure UI definitions and display models

**Files:**
- Create: `ui/liveSimModel.js`
- Create: `crisis-sim/test/live-ui-model.test.js`

- [ ] Write failing tests for clinical-unit-to-total-mg conversions, all sugammadex tiers, capped neostigmine, invalid weights, Snapshot-to-monitor formatting, threshold alarm derivation, and SimulationResult validation.
- [ ] Run the focused test and confirm import/function failures.
- [ ] Implement declarative patient presets, drug groups, complication names, dose conversion, monitor formatting, alarm derivation, and exact required result-key validation.
- [ ] Keep all functions free of DOM or engine mutation so they can be tested in Node.
- [ ] Run focused and full tests.

### Task 4: Build the replaceable pub/sub transport

**Files:**
- Create: `ui/liveSimTransport.js`
- Create: `crisis-sim/test/live-transport.test.js`

- [ ] Write a fake BroadcastChannel and failing tests for publish/subscribe, late-join request/reply, out-of-order rejection, session replacement, and close cleanup.
- [ ] Run the focused test and confirm missing-module failures.
- [ ] Implement protocol-versioned envelopes with `sessionId`, `sequence`, `type`, and `payload`.
- [ ] Expose only transport-level methods so callers do not depend on BroadcastChannel.
- [ ] Run focused and full tests.

### Task 5: Register and implement the instructor view

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Create: `ui/liveSimView.js`
- Create: `assets/css/live-sim.css`

- [ ] Add a static contract test that initially fails because the menu entry, root overlay, module import, and stylesheet are absent.
- [ ] Add a `LIVE ANESTHESIA SIM` labeled menu button to `#level-map` and the fixed `#live-sim-view` overlay under `#app`.
- [ ] Import and call `initLiveSimView()` from `_initGameUI()`.
- [ ] Implement one lazy `SimRunner`, patient setup, case controls, drug actions, machine controls, airway validation feedback, forced apnea, complication injection, event log, display launch, and debrief download.
- [ ] Ensure every engine action routes through a runner method and every input has a visible label.
- [ ] Reuse theme tokens, visible focus, 44 px targets, responsive layout, tabular numerics, and reduced-motion behavior.
- [ ] Run static, focused, and full tests.

### Task 6: Implement the read-only display

**Files:**
- Create: `live-sim-display.html`
- Create: `ui/liveSimDisplay.js`
- Create: `assets/css/live-sim-display.css`

- [ ] Extend the static test so it fails unless the display imports transport/model but not `SimRunner` or any `/crisis-sim/sim/` module.
- [ ] Add large monitored numerics, mandatory vent output, the emergence panel, machine strip, alarms, connection status, and the non-dismissible education fence.
- [ ] Subscribe through the transport and request the latest state on load/visibility regain.
- [ ] Implement acknowledge and timed silence state without changing snapshots.
- [ ] Implement Canvas ECG, pleth, and capnogram morphology under `RENDERING ONLY` comments; flatten capnogram solely when `capnogramPresent` is false.
- [ ] Run static, focused, and full tests.

### Task 7: Make the feature PWA-safe

**Files:**
- Modify: `sw.js`
- Create: `crisis-sim/test/pwa-contract.test.js`

- [ ] Write a failing test that parses `APP_SHELL`, checks every new live file and every browser-imported engine file, and rejects the old cache version.
- [ ] Add all required HTML, CSS, JS, and engine import-graph files to `APP_SHELL`.
- [ ] Change `CACHE_VERSION` to `v39-live-sim-2026-07-13`.
- [ ] Run the focused contract test and full suite.

### Task 8: Add the full induction-to-emergence smoke

**Files:**
- Create: `crisis-sim/test/live-case-smoke.mjs`

- [ ] Drive an 80 kg runner exclusively through public UI-used methods: config, preoxygenation machine settings, boluses, forced apnea, intubation, VCV, maintenance, complication injection/treatment, sugammadex, apnea lift, emergence over the vent, and extubation.
- [ ] Assert directional physiology at every stage, TOF ratio at least 0.9, and visible spontaneous RR/TV/MV/effort while mandatory ventilation continues.
- [ ] Build a second runner, produce TOF count 0, administer capped neostigmine, and assert the logged dose with persistent block/ratio below 0.9.
- [ ] Validate the live debrief object against the exact SimulationResult key contract.
- [ ] Run `node test/live-case-smoke.mjs` and preserve its full output.

### Task 9: Browser and regression verification

**Files:**
- Modify only if a failing test identifies a defect.

- [ ] Start a local static server at the repository root.
- [ ] Load the main app and display in the supported browser automation surface; capture console/page errors.
- [ ] Authenticate or use a non-destructive local test path, open the live view, start a case, open the display, verify state sync, then reload the instructor and confirm session replacement instead of stale state.
- [ ] Verify 375 px and wide-screen layout, focus visibility, and the education fence.
- [ ] Run `npm test -- --reporter=verbose`, snapshot contract, full-case smoke, static/PWA tests, syntax checks, fixture diff checks, and git diff review.
- [ ] Document anything requiring a true physical second display or audible environment as manual-only.

### Task 10: Commit without integration

**Files:**
- All intentional tracked files from Tasks 1-9.

- [ ] Confirm the branch is `feature/live-sim-ui`, effective email is `01morris01@gmail.com`, and pre-existing untracked prototypes are untouched.
- [ ] Stage only intentional files.
- [ ] Commit with a scoped live-sim message.
- [ ] Confirm the branch is not pushed and not merged.

## Plan self-review

- Every requirement in the approved brief maps to a task.
- The snapshot gate precedes all production UI code.
- Existing physiology is delegated to, never duplicated.
- Both views and the entire engine browser import graph are covered by the service-worker task.
- The display has no engine import and cannot create a second engine.
- The full-case test includes the required emergence-over-vent and TOF-0 neostigmine negative evidence.
- No placeholder, deferred implementation, router, framework, or build step is introduced.
