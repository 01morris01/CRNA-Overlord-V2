# Overlord world: status

Working copy `~/Developer/overlord-next`, branch `overlord/world-slice` (GitHub: 01morris01/CRNA-Overlord-V2). Updated 2026-11-13.
The voxel island described in versions of this file before 2026-11-12 was retired on 2026-11-10; it is in git history.

## Run it

```bash
python3 ~/Developer/overlord-next/tools/dev_server.py 8091
```

Open http://localhost:8091/world/ and sign in with an Overlord account for that browser. For checks, use the throwaway account in
`tools/test-account.example.json`.

Controls: W/S or the up and down arrows walk; left and right arrows (and Q) turn; A and D step sideways; drag with either mouse button
to look; E uses the station in front of you; Escape or any walking key leaves a station; click a thing to pick it up or use it;
X puts back what you hold; V or the wheel changes between your own eyes and over the shoulder.

## Rooms

| Room | Where | What runs there |
|---|---|---|
| Light court, forecourt, arrival | the middle of the building | walking; the doors of every room open onto the court |
| Anatomy gallery | off the court | plexus journey (film, six hands-on steps, unlabeled challenge, specimen, later review); airway and neck CT exhibit |
| Regional block bay | off the court | reasoning on the 3D plexus model; the older recorded-clip ultrasound trainer. No 3D block case |
| Pre-op holding | off the court | schedule of 56 fictional patients, four bays, chart and care plan in the Student Workstation |
| Operating room | off the court | whole general anesthetics with a tube on the app's engine (standard induction, rapid sequence, the program's emergence case) |
| Endoscopy suite (new) | off the court, north-east | a general anesthetic with a rapid sequence and a tube for the endoscopy patient whose sedation the learner decides against (below) |
| Labor room (new) | off the court, north-west | the room and its equipment only; says so at the door |
| Procedure room (new) | off the court, south-east | the room and its equipment only; says so at the door |
| Study studio | off the court | collection shelf, case rail, wardrobe |

## Playable case paths

1. **Operating room, general anesthetic.** Pre-op holding → a bay → chart and care plan in the Student Workstation → "Take ... to
   the operating room" (or "Go without a plan, as practice", recorded as unplanned) → the brief → run with the step list (recorded as
   assisted) or from memory → monitors on, drugs drawn and given, pre-oxygenation, induction, laryngoscopy and tube (the engine decides
   the attempt), ventilator and vaporizer, "ready" to the surgeon → closing → reversal, spontaneous breathing, waking, extubation →
   handover → debrief against the program's rubrics → recovery clears the room.
2. **Endoscopy patient booked for propofol sedation (p25).** At the bay, three decisions offered alike, before anything is said about
   what the simulator can run:
   - *Proceed as booked: sedation.* Recorded with the status "recorded; not run (sedation is not simulated yet)". The case does not
     start, and the page says why: the engine's propofol never stops breathing or relaxes the airway, and oxygen by cannula is not
     modeled. The choice stays on the record.
   - *Convert to general anesthesia.* Recorded, then the endoscopy suite is offered. The case runs there as path 1, with the
     endoscopist leading ("the endoscopist passes the scope", "withdrawing the scope") and recovery at the end. The debrief shows the
     pre-op decision and says the room does not grade it.
   - *Postpone.* Recorded with the status "recorded; no case today".
   Every decision is kept with its time and whether a care plan was in; the bay shows the last one. The app's draft answer key is shown
   only after a decision, beside it, never used to score it.
3. **Other scheduled patients** whose anesthetic is not a general anesthetic with a tube (spinals, blocks, MAC outside endoscopy) keep
   chart, interview and care plan in pre-op, and their case in the Student Workstation's own operating-room step.

## Checks

| Command | What it shows | Result (2026-11-13, on the recovery commit) |
|---|---|---|
| `cd crisis-sim && npx --yes vitest@2.1.9 run` | the engine's own suite, including the new sedation reproduction (`test/sedation-evidence.test.js`) | 47 files, 1,211 tests pass (4 of them are expected failures that state correct sedation behavior) |
| `node tools/cases_check.mjs` | the case layer against the engine | 61 of 61 |
| `uv run --with playwright python3 tools/periop_check.py OUT tools/test-account.example.json 8091` | a whole operating-room case with real input, recorded | 52 of 52 |
| `uv run --with playwright --with numpy --with scipy --with pillow python3 tools/movement_check.py OUT tools/test-account.example.json 8091` | walking, collisions and sightlines in the operating room | 55 of 55 |
| `uv run --with playwright --with numpy --with scipy --with pillow python3 tools/rooms_check.py OUT tools/test-account.example.json 8091` | the three new rooms on foot; the endoscopy decisions through the bay; the probe picked up, put back with X and clipped on | 62 of 62 |
| `uv run --with playwright python3 tools/endo_check.py OUT tools/test-account.example.json 8091` | the converted endoscopy case from the decision to the recovery debrief, recorded | 18 of 18 |

`rooms_check.py` finds what is visible two independent ways: a render of the room from above at body height, and every drawn
triangle that stands between knee and shoulder height (a tall wall seen edge-on from above shows only that way). Neither uses the
walking code's boxes.

Checks show that things work and are recorded truthfully. They are not a score for visual quality and not content review.
All runs: desktop Chrome on this Mac (M4 Pro), headless Playwright with the GPU. No phone or tablet hardware has been tested.

## Review status

| Item | State |
|---|---|
| Clinical content, rubrics' room mapping, the CO2 correction, the endoscopy decision texts | AI-checked, not faculty-reviewed (CO2-FACULTY-REVIEW.md, CONTENT-VERIFICATION.md) |
| The 56 answer keys | drafts written from the charts for faculty review; shown beside decisions, never used to score them |
| Sedation physiology | not modeled; reproduced and pinned in `crisis-sim/test/sedation-evidence.test.js` (four expected failures state what should happen) |

## Build files: what is source, what is runtime, what is regenerated

| Path | Kind | Notes |
|---|---|---|
| `tools/build_institute.py`, `tools/clinical_set.py`, `tools/clinical_kit.py`, `tools/finish_institute.sh`, `tools/encode_lightmap.py` | source | the level, its equipment and its light |
| `assets/level/institute.glb`, `clinical.glb`, `props.glb`, `level.json`, `lightmap.jpg`, `lightmap-2k.jpg` | runtime (committed outputs) | regenerate: `blender -b --factory-startup --python tools/build_institute.py -- ~/Developer/overlord-asset-sources/polyhaven assets/level final` then `sh tools/finish_institute.sh assets/level` (about 10 minutes on the M4 Pro). Needs the Poly Haven and Objaverse sources in `~/Developer/overlord-asset-sources/` |
| `assets/level/_tex/`, `institute-clinical.glb`, `institute-props.glb`, `lightmap.npy`, `_lightmap_preview.png`, `_props.log` | regenerable intermediates (git-ignored) | written by the two commands above |
| `tools/people/staff/` (`fetch.sh`, `sb_common.py`, `sb_dress.py`, `sb_pose.py`) | source, unfinished | helper libraries for staff figures. The script that would call them (`build_staff.py`) was never written and nothing they produce exists; the runtime does not load them. Working notes: `~/Developer/overlord-asset-sources/work/staff/PROGRESS.md` |
| `tools/props/bedside/` (`kit.py`, `specs.py`) | source, unfinished | a modeling library and sourced measurements for bedside props. No build script uses them yet and no output exists |
| `tools/props/surgical/` (`review.py`, `room_shots.py`) | source tools | studio renders and in-room pictures of surgical props; `assets/models/or/surgical/` is still empty |
| `world/mirror/x-ray-mirror.html` | runtime | the owner's X-Ray Mirror (built by the owner with Claude Fable 5); BodyParts3D anatomy, CC BY-SA 2.1 JP, credited in the page and in `assets/LICENSES.md` |

## Engine findings to settle before the sedation work (found 2026-11-13, not yet changed)

- **Paralysis and the breathing rate.** At a train-of-four ratio of 0.08 after rocuronium the engine still reports a spontaneous
  rate of 11 to 12 a minute; only the tidal volume falls. A paralyzed patient does not breathe at any rate.
- **Size and carbon dioxide.** Dead space (2.2 mL/kg) and resting CO2 production (2.8 mL/kg/min) are taken from total body weight.
  The 139 kg endoscopy patient, ventilated at 560 mL x 12 (about 7.5 mL/kg of ideal body weight), climbs to EtCO2 about 100 over
  45 minutes. Reproduce: `tools/cases_check.mjs` style, patient p25, rapid sequence, volume control 560 x 12, 45 minutes. This
  belongs with the CO2 review (CO2-FACULTY-REVIEW.md).
- **Sedation research is paused.** The literature review for the breathing model was stopped by the AI provider's safeguards; it
  waits on the owner (see the session report).

## Spelling and frameworks

US spelling throughout (labor, color, meter, center, apnea, modeled, labeled, pediatric). A few saved-data keys keep their old
spelling (`colour`, `'modelled'`, `'recognised'`) so existing saves and records still load; they are never shown. US clinical
frameworks first (ASA, AANA, MHAUS, FDA labeling); UK guidance only as a secondary reference.

## Not built, and why

- **Sedation** (step 2 of the current plan): see above.
- **Crises in the 3D rooms**: the engine has malignant hyperthermia, anaphylaxis, bronchospasm, laryngospasm, high spinal, LAST and
  hemorrhage state machines (engine audit 3.7, 3.11); none is wired into a 3D case yet.
- **Labor epidural, procedure-room central line, spinal and block cases, children under 20 kg**: not run in 3D.
- **Ultrasound picture**: the regional bay's screen shows a probe in air, labeled "not a scan".
- **Hands-on equipment** beyond the oximeter probe and the pressure cuff.
- **Staff figures** in the rooms.

## Needs the owner

- Faculty review of content, the CO2 correction and the decision texts.
- A Hugging Face sign-in on this Mac (`uvx --from huggingface_hub hf auth login`) and acceptance of the gated licences, for the Idol test.
- A real phone or tablet test.
