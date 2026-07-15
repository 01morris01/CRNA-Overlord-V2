# Live Simulation Clinical Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permanently contain the NIBP value and make volatile-agent selection and quantitative TOF assessment obvious, real, timestamped live-simulation controls.

**Architecture:** Preserve the existing engine-derived display contract. Split BP presentation into separately rendered systolic/diastolic nodes, add one SimRunner TOF read action over the existing NMB state, and add one validated volatile action over the existing ventilator state. The UI calls only SimRunner and never writes a derived value.

**Tech Stack:** Static HTML/CSS/ES modules, deterministic JavaScript simulation, Vitest 2.1, existing BroadcastChannel transport and PWA service worker.

---

## File map

- `live-sim-display.html`: accessible split NIBP markup.
- `assets/css/live-sim-display.css`: NIBP container sizing and responsive containment.
- `assets/css/live-sim.css`: compact instructor NIBP and new control-panel layout.
- `ui/liveSimDisplay.js`: render SBP/DBP separately.
- `ui/liveSimModel.js`: volatile options and unchanged snapshot formatting.
- `ui/liveSimView.js`: dedicated volatile panel and CHECK TOF interaction.
- `crisis-sim/ui/simRunner.js`: public `setVolatile()` and `checkTrainOfFour()` actions/history.
- `crisis-sim/test/live-sim-display.test.js`: structural no-clipping contract.
- `crisis-sim/test/live-runner.test.js`: public action behavior and NMB immutability.
- `crisis-sim/test/app-integration.test.js`: visible control and binding contract.
- `crisis-sim/test/pwa-contract.test.js`: cache-version/module contract.
- `crisis-sim/test/snapshot-contract.mjs`: exact new snapshot keys.
- `docs/live-sim-integration.md`: public method signatures and scoreable action declaration.
- `sw.js`: cache version bump.

### Task 1: Lock failing monitor and control contracts

**Files:**
- Modify: `crisis-sim/test/live-sim-display.test.js`
- Modify: `crisis-sim/test/app-integration.test.js`
- Modify: `crisis-sim/test/live-runner.test.js`

- [x] **Step 1: Add the failing split-NIBP and container-sizing assertions**

Add to `live-sim-display.test.js`:

```js
it('renders systolic and diastolic independently inside a container-sized NIBP value', () => {
  const primary = section('display-numerics');
  expect(primary).toContain('id="display-bp"');
  expect(primary).toContain('id="display-sbp"');
  expect(primary).toContain('id="display-dbp"');
  expect(css).toMatch(/\.display-vital-bp\s*\{[^}]*container-type:\s*inline-size;/s);
  expect(css).toMatch(/\.display-vital-bp strong\s*\{[^}]*font-size:[^;]*cqi/s);
  expect(css).toMatch(/\.display-vital-bp strong\s*\{[^}]*min-width:\s*0;/s);
});
```

- [x] **Step 2: Add failing visible-control assertions**

Add to `app-integration.test.js`:

```js
expect(controller).toContain('id="live-volatile-panel"');
expect(controller).toContain('data-volatile-agent="Sevoflurane"');
expect(controller).toContain('data-volatile-agent="Desflurane"');
expect(controller).toContain('data-volatile-agent="Isoflurane"');
expect(controller).toContain('id="live-volatile-off"');
expect(controller).toContain('id="live-check-tof"');
expect(controller).toContain('liveRunner.setVolatile');
expect(controller).toContain('liveRunner.checkTrainOfFour');
```

- [x] **Step 3: Add failing runner behavior tests**

Add to `live-runner.test.js`:

```js
it('sets only supported volatile inputs and logs the fixed-step action', () => {
  const runner = new SimRunner();
  expect(runner.setVolatile({ agent: 'Desflurane', dialPercent: 6 })).toMatchObject({
    ok: true, agent: 'Desflurane', dialPercent: 6,
  });
  expect(runner.snapshot()).toMatchObject({ vaporizerAgent: 'Desflurane', vaporizer: 6 });
  expect(runner.log.at(-1).meta.action).toBe('volatile_changed');
  expect(runner.setVolatile({ agent: 'Ether', dialPercent: 2 })).toMatchObject({ ok: false, reason: expect.any(String) });
  runner.setVolatile({ agent: 'Desflurane', dialPercent: 0 });
  expect(runner.snapshot()).toMatchObject({ vaporizerAgent: 'Desflurane', vaporizer: 0 });
});

it('checks TOF without changing any neuromuscular state', () => {
  const runner = new SimRunner();
  runner.giveBolus('Rocuronium', 42, 'Rocuronium 42 mg');
  runner.core.stepFor(120);
  runner.simTime = runner.core.simTime;
  const before = runner.snapshot();
  const record = runner.checkTrainOfFour();
  const after = runner.snapshot();
  expect(record).toMatchObject({ count: before.tof, ratio: before.tofRatio });
  expect(after.effectiveNmbBlockade).toBe(before.effectiveNmbBlockade);
  expect(after.tof).toBe(before.tof);
  expect(after.tofRatio).toBe(before.tofRatio);
  expect(after.tofCheckHistory).toEqual([record]);
  expect(runner.log.at(-1).meta.action).toBe('tof_checked');
});
```

- [x] **Step 4: Run the focused tests and verify RED**

Run:

```bash
cd crisis-sim
npx vitest run test/live-sim-display.test.js test/app-integration.test.js test/live-runner.test.js --reporter=verbose
```

Expected: failures for missing split nodes, control markup, `setVolatile`, and `checkTrainOfFour`.

### Task 2: Make NIBP containment structural

**Files:**
- Modify: `live-sim-display.html`
- Modify: `assets/css/live-sim-display.css`
- Modify: `assets/css/live-sim.css`
- Modify: `ui/liveSimDisplay.js`
- Modify: `ui/liveSimView.js`
- Test: `crisis-sim/test/live-sim-display.test.js`

- [x] **Step 1: Split the display value without splitting its accessible meaning**

Replace the NIBP `strong` in `live-sim-display.html` with:

```html
<strong id="display-bp" aria-label="Blood pressure unavailable">
  <span id="display-sbp">—</span><span aria-hidden="true">/</span><span id="display-dbp">—</span>
</strong>
```

- [x] **Step 2: Render the two values and combined accessible label**

In `ui/liveSimDisplay.js`, replace the combined BP assignment with:

```js
setText('display-sbp', model.sbp);
setText('display-dbp', model.dbp);
const bp = document.getElementById('display-bp');
if (bp) bp.setAttribute('aria-label', `Blood pressure ${model.sbp} over ${model.dbp} millimeters of mercury`);
```

Extend `formatMonitorSnapshot()` to return `sbp` and `dbp` while retaining combined `bp` for the instructor console.

- [x] **Step 3: Size against the card, not the viewport**

Use these rules in `live-sim-display.css`:

```css
.display-vital-bp { container-type: inline-size; }
.display-vital-bp strong {
  display: flex;
  align-items: baseline;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  font-size: clamp(1.7rem, 15cqi, 4.8rem);
  letter-spacing: -.06em;
  white-space: nowrap;
}
.display-vital-bp strong > span { flex: 0 1 auto; min-width: 0; }
```

Remove conflicting viewport-only BP font-size overrides from the 680/480-pixel media rules.

- [x] **Step 4: Constrain the instructor BP tile**

Give every `.live-vitals > div` `min-width: 0`, make the compact BP value no-wrap with a container-relative font size, and mark the BP tile with `live-vital-bp` in `renderShell()`.

- [x] **Step 5: Run the display tests and verify GREEN**

Run:

```bash
cd crisis-sim
npx vitest run test/live-sim-display.test.js test/live-ui-model.test.js --reporter=verbose
```

Expected: both files pass; formatting still returns combined and split values.

- [x] **Step 6: Commit the NIBP repair**

```bash
git add live-sim-display.html assets/css/live-sim-display.css assets/css/live-sim.css ui/liveSimDisplay.js ui/liveSimView.js crisis-sim/test/live-sim-display.test.js crisis-sim/test/live-ui-model.test.js
git commit -m "Contain live monitor blood pressure"
```

### Task 3: Add scoreable quantitative TOF assessment

**Files:**
- Modify: `crisis-sim/ui/simRunner.js`
- Modify: `ui/liveSimView.js`
- Modify: `assets/css/live-sim.css`
- Modify: `crisis-sim/test/live-runner.test.js`
- Modify: `crisis-sim/test/app-integration.test.js`
- Modify: `crisis-sim/test/snapshot-contract.mjs`

- [x] **Step 1: Add one copied TOF history to SimRunner**

Initialize/reset `this.tofCheckHistory = []`. Add:

```js
checkTrainOfFour() {
  const record = Object.freeze({
    tSec: this.simTime,
    count: this.p.trainOfFourCount,
    ratio: this.p.trainOfFourRatio,
    effectiveNmbBlockade: this.p.effectiveNmbBlockade,
    nmbSource: this.p.dominantNmbSource,
    airwayDevice: this.p.airwayDeviceState,
  });
  this.tofCheckHistory.push(record);
  this.logEvent('Neuromuscular assessment', `TOF ${record.count} · ratio ${record.ratio.toFixed(2)}`, {
    action: 'tof_checked', ...record,
  });
  this.emit();
  return { ...record };
}
```

If `dominantNmbSource` is not public, expose it as a pure getter derived from existing rocuronium/succinylcholine concentrations; do not add state.

- [x] **Step 2: Extend snapshot with copied records**

Add:

```js
lastTofCheck: this.tofCheckHistory.length ? { ...this.tofCheckHistory.at(-1) } : null,
tofCheckCount: this.tofCheckHistory.length,
tofCheckHistory: this.tofCheckHistory.map((entry) => ({ ...entry })),
```

- [x] **Step 3: Add the live action**

Place a CHECK TOF button beside the continuously displayed TOF/ratio. Its handler calls `checkTrainOfFour()` and reports count, ratio, and simulation time. `renderSnapshot()` shows the last checked result separately from the current continuous value.

- [x] **Step 4: Update exact snapshot accounting**

Add `tofCheckCount` to numeric keys, `lastTofCheck` to nullable-object keys, and `tofCheckHistory` to array keys in `snapshot-contract.mjs`.

- [x] **Step 5: Verify focused tests**

```bash
cd crisis-sim
npx vitest run test/live-runner.test.js test/app-integration.test.js --reporter=verbose
node test/snapshot-contract.mjs
```

Expected: runner and UI contracts pass; snapshot key/type counts are exact.

- [x] **Step 6: Commit TOF assessment**

```bash
git add crisis-sim/ui/simRunner.js ui/liveSimView.js assets/css/live-sim.css crisis-sim/test/live-runner.test.js crisis-sim/test/app-integration.test.js crisis-sim/test/snapshot-contract.mjs
git commit -m "Add scoreable TOF assessment"
```

### Task 4: Promote volatile anesthetics to a dedicated panel

**Files:**
- Modify: `crisis-sim/ui/simRunner.js`
- Modify: `ui/liveSimModel.js`
- Modify: `ui/liveSimView.js`
- Modify: `assets/css/live-sim.css`
- Modify: `crisis-sim/test/live-runner.test.js`
- Modify: `crisis-sim/test/app-integration.test.js`

- [x] **Step 1: Implement validated wrapper action**

Add to SimRunner:

```js
setVolatile({ agent, dialPercent }) {
  const allowed = new Set(['Sevoflurane', 'Desflurane', 'Isoflurane']);
  if (!Number.isFinite(dialPercent) || dialPercent < 0 || dialPercent > 18) {
    return { ok: false, reason: 'volatile dial must be between 0 and 18 percent' };
  }
  if (!allowed.has(agent)) return { ok: false, reason: `unsupported volatile agent: ${agent}` };
  this.v.vaporizerAgent = agent;
  this.v.vaporizerDial = dialPercent;
  this.logEvent('Volatile anesthetic', `${this.v.vaporizerAgent} ${dialPercent.toFixed(1)}%`, {
    action: 'volatile_changed', agent: this.v.vaporizerAgent, dialPercent,
    airwayDevice: this.p.airwayDeviceState,
  });
  this.emit();
  return { ok: true, agent: this.v.vaporizerAgent, dialPercent };
}
```

- [x] **Step 2: Add declarative agent metadata**

In `liveSimModel.js`:

```js
export const VOLATILE_AGENTS = Object.freeze([
  { name: 'Sevoflurane', referenceDial: 2 },
  { name: 'Desflurane', referenceDial: 6 },
  { name: 'Isoflurane', referenceDial: 1.2 },
]);
```

- [x] **Step 3: Move the UI controls**

Remove agent/dial inputs from `live-machine-form`. Add `live-volatile-panel` before it with three agent buttons, Agent Off, a numeric dial input, APPLY, and current dial/end-tidal/MAC outputs. Agent buttons select; APPLY calls `setVolatile()`. Agent Off calls the same method with dial zero.

- [x] **Step 4: Keep the panel synchronized**

`renderSnapshot()` sets selected-button `aria-pressed`, dial input when it is not focused, and current values from `snapshot.vaporizerAgent`, `snapshot.vaporizer`, `snapshot.etAgent`, and `snapshot.mac`.

- [x] **Step 5: Verify UI and runner tests**

```bash
cd crisis-sim
npx vitest run test/live-runner.test.js test/app-integration.test.js test/live-ui-model.test.js --reporter=verbose
```

Expected: all pass; the general machine form no longer owns vaporizer state.

Also advance a Sevoflurane and a Desflurane run long enough to assert that the existing ventilator/physiology path derives nonzero end-tidal agent and MAC. The wrapper test must never assert a direct write to those outputs.

- [x] **Step 6: Commit volatile controls**

```bash
git add crisis-sim/ui/simRunner.js ui/liveSimModel.js ui/liveSimView.js assets/css/live-sim.css crisis-sim/test/live-runner.test.js crisis-sim/test/app-integration.test.js crisis-sim/test/live-ui-model.test.js
git commit -m "Promote live volatile controls"
```

### Task 5: Cache, documentation, and rendered geometry evidence

**Files:**
- Modify: `sw.js`
- Modify: `crisis-sim/test/pwa-contract.test.js`
- Modify: `docs/live-sim-integration.md`
- Modify: `docs/superpowers/plans/2026-07-15-live-sim-clinical-controls.md`

- [x] **Step 1: Write the failing PWA assertions**

Require a new cache version and the changed display/UI assets:

```js
expect(sw).toContain("live-sim-clinical-controls");
for (const path of ['/assets/css/live-sim-display.css', '/assets/css/live-sim.css', '/ui/liveSimDisplay.js', '/ui/liveSimView.js']) {
  expect(sw).toContain(`'${path}'`);
}
```

- [x] **Step 2: Bump the cache and update docs**

Update `sw.js` cache name and retain every existing cached asset. Document exact signatures, event names, snapshot additions, and that CHECK TOF—not passive display—is the scoreable assessment record.

- [x] **Step 3: Run browser geometry QA**

Serve the repository locally and use the in-app browser responsive viewport at 320, 480, 600, 768, 1280, and 1440 pixels. For values `120/80`, `80/40`, and `260/160`, record:

```js
const card = document.querySelector('.display-vital-bp').getBoundingClientRect();
const sbp = document.querySelector('#display-sbp').getBoundingClientRect();
const dbp = document.querySelector('#display-dbp').getBoundingClientRect();
({
  sbpInside: sbp.left >= card.left && sbp.right <= card.right,
  dbpInside: dbp.left >= card.left && dbp.right <= card.right,
  horizontalOverflow: document.body.scrollWidth - document.body.clientWidth,
});
```

Expected at every width/value: both booleans true and horizontal overflow zero.

- [x] **Step 4: Run Stage 1 regression**

```bash
cd crisis-sim
npm test -- --run
node test/snapshot-contract.mjs
node test/live-case-smoke.mjs
npx vitest run test/parity.test.js --reporter=verbose
git -C .. diff --check
```

Expected: every test, smoke checkpoint, snapshot contract, and frozen parity assertion passes.

- [x] **Step 5: Mark Stage 1 complete and commit**

```bash
git add sw.js crisis-sim/test/pwa-contract.test.js docs/live-sim-integration.md docs/superpowers/plans/2026-07-15-live-sim-clinical-controls.md
git commit -m "Verify live clinical controls"
```
