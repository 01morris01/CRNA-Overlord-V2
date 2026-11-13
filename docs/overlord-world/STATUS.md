# Overlord world: status

Branch `overlord/world-slice` (pushed to GitHub, not merged to `main`, not deployed). Working copy: `~/Developer/overlord-next`.
Updated 2026-11-12. The voxel island described in earlier versions of this file was retired on 2026-11-10; it is in git history.

## How to run it

```bash
python3 ~/Developer/overlord-next/tools/dev_server.py 8091
```

Then open http://localhost:8091/world/ and sign in with an Overlord account for that browser.

## What exists

| Part | State |
|---|---|
| Building | One connected realistic level: forecourt, arrival, light court, anatomy gallery, regional block bay, operating room, pre-op holding, study studio, and (new) endoscopy suite, labor room and procedure room |
| Plexus journey | Film with a prediction, six hands-on steps, unlabeled challenge, specimen earned, regional case, later review |
| Airway and neck exhibit | 68 structures from one CC BY CT (TotalSegmentator s0527); model and slices share a frame. See HEADNECK-CT.md |
| Pre-op holding | Schedule of the 56 mock-OR-day patients, four bays, chart and care plan in the Student Workstation, plan gate |
| Operating room | Whole general anesthetics with a tube on the app's engine (`crisis-sim`): monitors from the engine, drugs drawn and labelled, machine controls, held views, debrief against the program's rubrics. Pulse oximeter probe and BP cuff are placed by hand |
| Endoscopy suite | An endoscopy patient booked for sedation can be converted to a rapid sequence and a tube, run in the suite on the engine; or postponed. Sedation itself is refused (see below) |
| X-Ray Mirror | The owner's own page (`world/mirror/`), BodyParts3D anatomy (CC BY-SA 2.1 JP), camera stays on the computer |

## Checks (2026-11-12, commit 01ce6c5)

| Check | Result |
|---|---|
| `node tools/cases_check.mjs` (engine level) | 61 of 61 |
| `tools/periop_check.py` (whole cases, real input, recorded) | 52 of 52 |
| `tools/movement_check.py` (walking, collisions, ways in and out) | 55 of 55 |
| Endoscopy case | Smoke run only (p25 converted to rapid sequence: suite loads, no page errors). No recorded check yet |

Checks show that things work. They are not a score for visual quality, and they are not content review.

## Not built, and why

- **Sedation** (endoscopy MAC): the engine's propofol never stops breathing or obstructs the airway, and oxygen without a sealed circuit is 100% or nothing, so a sedation case would be uneventful whatever the learner did. Needs spontaneous ventilation built from published models.
- **Crises** in the 3D OR: not built. Only crises the engine can model faithfully should be.
- **Spinal, epidural, nerve blocks, children under 20 kg**: not run in the 3D OR; those patients keep chart and plan in the Student Workstation.
- **Ultrasound picture**: the bay's screen shows a probe in air, labelled "not a scan".
- **Labor and procedure rooms**: rooms only; nothing clinical runs in them.
- **Hands-on equipment**: only the pulse oximeter probe and BP cuff; every other step is a button on the step list.
- **Known look problems**: the endoscopy case text still says surgeon and incision; the endoscopy stretcher rails read as wireframe glass up close; the patient figures' gowns are blocky.

## Verification status

All clinical content and the CO2 correction are AI-checked, not faculty-reviewed. Faculty review is still needed (CO2-FACULTY-REVIEW.md, CONTENT-VERIFICATION.md).

## Devices

Tested on this Mac in Chrome. Phone and tablet only in Chrome's emulation. No real phone or tablet has been tested; the iOS Simulator needs full Xcode, which this Mac does not have.

## Needs the owner

- Faculty review of content and the CO2 correction.
- A Hugging Face sign-in on this Mac (`uvx --from huggingface_hub hf auth login`) and acceptance of the gated model licences, for the Idol test.
- A real device test.
