# Asset ledger

Rule: every model, texture and data file in a build is listed here with its source, licence, what was changed, and its
clinical validation status. If a row is missing or its licence is unknown, the file does not ship.

## In the build (committed)

| Asset | Source | Licence | What was changed | Clinical validation status |
|---|---|---|---|---|
| `assets/level/institute.glb`, `level.json`, `lightmap.jpg`, `lightmap-2k.jpg` | Geometry written for this project (`tools/build_institute.py`): every wall, frame, plinth, bench and fixture | Yours | n/a | Not applicable. Proportions are scene design, not hospital building standards |
| Materials inside `institute.glb` | Poly Haven scans: `marble_01`, `large_grey_tiles`, `concrete_wall_008`, `brushed_concrete`, `plastered_wall_04`, `white_plaster_02`, `concrete_floor_02`, `oak_veneer_01`, `black_oak_veneer`, `leather_white` | CC0 | Resized to 1K or 2K; colour regraded lighter and less saturated; re-encoded as WebP | Not applicable |
| `assets/level/props.glb` | Poly Haven models: `modern_arm_chair_01`, `side_table_01`, `WoodenTable_02`, `potted_plant_01`, `_02`, `_04`, `desk_lamp_arm_01`, `book_encyclopedia_set_01`, `ceramic_vase_03` | CC0 | Placed and scaled; simplified, Draco-compressed, textures to 1K WebP | Not applicable |
| `assets/level/sky.hdr` | Poly Haven HDRI `kloofendal_48d_partly_cloudy_puresky` (1K) | CC0 | Rotated so its sun matches the level's sun | Not applicable |
| `assets/characters/*.glb`, portraits, `characters.json` | Microsoft Rocketbox avatars `Medical_Female_01`, `Medical_Female_02`, `Medical_Male_03`, `Medical_Male_04`; animations `idle_breathe_01`, `walk_neutral_01`, `walk_fast_01` (github.com/microsoft/Microsoft-Rocketbox) | MIT | Clips re-baked onto each avatar by world-space bone rotation, walks made in-place; textures to 1K; portraits rendered (`tools/convert_rocketbox.py`) | Not applicable |
| `assets/models/patient/patient-supine.glb` | Rocketbox `Male_Adult_01` | MIT | Posed, laid supine, covered by a generated sheet (`tools/build_patient.py`) | **Set dressing.** Not a clinical model; nothing is taught or measured on it |
| `assets/models/plexus/plexus-right-overlord-v2.glb` | Z-Anatomy `Startup.blend` (github.com/Z-Anatomy/Models-of-human-anatomy), itself from BodyParts3D | CC BY-SA 4.0 (BodyParts3D: CC BY-SA 2.1 Japan). This derived file carries the same licence | 9 curves corrected, 10 structures built, each tagged in the file (`PLEXUS-DISCREPANCIES.md`) | **AI-audited** against page-level textbook statements: 48 of 48 geometric checks. **Not reviewed by an anatomist or faculty** |
| `assets/models/figure/figure-zanatomy.glb` | Z-Anatomy: all bones and cartilages, all nerve curves, the body-surface regions (hair left out) | CC BY-SA 4.0; this derived file carries the same licence | Merged into three meshes, reduced, compressed (`tools/zanatomy_export_figure.py`). No anatomical edits | **Not checked.** View only; the app says so and assesses nothing on it |
| `assets/models/headneck/headneck.glb`, `structures.json`, `volume.json`, `volume_intensity.png`, `volume_labels.png` | CT scan: TotalSegmentator dataset v3.0.0, subject s0527 (Wasserthal et al., University Hospital Basel; doi:10.5281/zenodo.22688904). Outlines: TotalSegmentator 2.18.0 | Scan: CC BY 4.0. Software: Apache-2.0 (not redistributed) | 18 outlines corrected and 56 classes excluded after review in 3D Slicer; meshes cleaned and reduced; scan cropped, face region blanked beyond the publisher's blur (`HEADNECK-CT.md`) | **AI-reviewed with quantitative checks. Not validated by a radiologist.** One person's scan at 1.5 mm; teaching illustration only |
| `assets/level/clinical.glb`: anesthesia workstation, operating table, ultrasound unit, stretcher, emergency cart, supply carts, IV poles, curtain track and curtains, vital signs monitor, suction sets, instruments, clock, laryngoscope, syringes | Thirteen professionally made models from Sketchfab, each by its own author, taken from the Objaverse 1.0 release (Allen Institute for AI). Authors, titles and links, one per model: `assets/LICENSES.md` | Each CC BY 4.0. Credit is shown in the two rooms' panels and in `assets/LICENSES.md` | Scaled to real size, placed, reduced, textures resized, displays given drawable rectangles (`tools/clinical_set.py`). Operating table: stains painted out, column lengthened. Anesthesia workstation: pipeline hoses removed; cylinders, flow knobs and vaporizer dials recoloured to the United States convention | **Set dressing.** No control works, nothing is taught or scored from it. Proportions and details are each modeller's, not a manufacturer's drawing. The colour coding was set by an AI against the textbook convention and **has not been reviewed by faculty** |
| `assets/level/clinical.glb`: surgical lights, ceiling supply arm, draped back table and Mayo stand, stools, kick bucket, glass-door cabinets, wall control panel, sharps bin | Built for this project by script (`tools/clinical_kit.py`), because no openly licensed professional model of them was found | Yours | n/a | **Set dressing.** These are the pieces to replace first if a professional model is bought or downloaded |
| What the operating room's displays show (`world/js/clinical.js`) | The app's own engine (`crisis-sim`) and waveform generator (`ui/liveWaveformRenderer.js`), read each frame; layout drawn for this project | Yours | n/a | With a case running: the engine's numbers and the generator's traces, unchanged. With no patient: STANDBY. The engine's physiology is the app's own and is **not reviewed by faculty**; carbon dioxide uses the prepared correction unless switched (`CO2-FACULTY-REVIEW.md`). The ultrasound screen in the regional bay is still a drawn "probe in air" picture, labelled DEMO and "not a scan" |
| Patients, charts, answer keys, rubrics, scenarios used in pre-op holding and the operating room | The app's own data: `data/mock-or-day/`, `data/rubrics/`, `crisis-sim/sim/scenarios/` | Yours | Nothing. Read as they are | Fictional patients. The rubrics are the program's own documents as already held in the app. **Not reviewed for this project** |
| `assets/audio/narration/*.mp3`, `manifest.json` | Generated with ElevenLabs text to speech, stock voice "Matilda", from your account (`tools/render_narration.py`) | Yours to use under ElevenLabs' terms for your plan; see `assets/LICENSES.md` | Generated, measured, named by a hash of voice and text | The words are the lessons' own verified lines; the audio adds nothing clinical |
| `world/brand/*.svg` | Drawn for this project (`world/js/brand.js`) | Yours | n/a | Not applicable |
| Inter Tight | Google Fonts | SIL Open Font License | none | Not applicable |
| three.js r170, its loaders and Draco decoder | jsDelivr CDN | MIT; Apache-2.0 | none | Loaded from a CDN: vendor them before relying on the site offline |

Attribution lines that must stay with the files and are shown in the app:

- "Z-Anatomy, the libre 3D atlas of anatomy, CC BY-SA 4.0. BodyParts3D, The Database Center for Life Science, CC BY-SA 2.1 Japan."
- "CT scan: TotalSegmentator dataset v3.0.0, subject s0527, Wasserthal et al., University Hospital Basel, CC BY 4.0 (doi:10.5281/zenodo.22688904)."
- "Characters: Microsoft Rocketbox avatar library, MIT licence."
- For the clinical rooms' equipment: the author and title of each of the thirteen models, with "CC BY 4.0" and "changed", as listed in `assets/LICENSES.md`.

The two Z-Anatomy files are share-alike. They are separate files beside the rest of the project; before distributing the
app commercially, have someone who knows licensing confirm that this arrangement is enough.

## On this computer only (never committed)

| Asset | Where | Why it stays out |
|---|---|---|
| The operating-room pack you bought (Artisan 3D Ventures "Operation Theatre", Unity Asset Store) | `assets/local/or-pack/`, a link to your `crisis-sim/assets/pack` | **No longer used by the institute.** The rooms now use the openly licensed models above. The link is left in place, ignored by git, and can be deleted. Whether the pack's terms allow serving its raw models from a website was never confirmed |
| The Mirror experiment | `world/local/x-ray-mirror.html`, a copy of your `X-Ray Mirror.html` | Its origin and licence are not recorded. It loads hand and pose tracking from a CDN when started |
| Textbooks and their extracted text | Your `Textbooks CRNA` folder; scratch text files | Private. Nothing from them is in the repository; the app's wording is original and cites pages |
| The scan work area, weights, corrected segmentation, 3D Slicer | `~/Developer/overlord-asset-sources/` | Production tools and intermediate data (about 7 GB) |
| Poly Haven and Rocketbox originals, the lightmap's raw bake | `~/Developer/overlord-asset-sources/` | Sources; the build holds the processed results |
| The thirteen equipment models as downloaded, and nine others that were looked at and not used | `~/Developer/overlord-asset-sources/objaverse/` with `sources.json` | Sources; the build holds the processed results. The unused ones are not in the build |
| `ChariteOR.glb`, `patient.glb`, older larynx, lung and bronchial models | Your earlier project folders | Not used in this build. See the earlier ledger entries in git history for their licences |

## Idol: what was verified and what was not

Verified from the SDK's own README (github.com/speridlabs/idol-sdk, Apache-2.0):
- One image in, one 3D Gaussian splat out (`.ply`, 32,768 to 1,048,576 Gaussians, default 262,144), **including the
  sides the picture never showed**. That part is generated, not measured.
- Runs on CUDA, Apple MPS or CPU. Reported 7.2 GB peak memory.
- First use downloads weights and requires access to two gated Hugging Face models (DINOv3 ViT-H+ and a FLUX.2
  autoencoder) and `hf auth login`. Those licences are separate from the SDK's and must be read before any
  commercial or shared use.

Not done: **no asset was generated and nothing was tested in our browser.** It needs your Hugging Face account and
your acceptance of those licences, which I cannot do for you.

Assessment before any test:

| Question | Editable mesh (what the slice uses) | Idol splat |
|---|---|---|
| Named parts you can show, hide, isolate, click | Yes | No. A splat is one cloud; it has no parts |
| Accuracy | As good as the source and its review | The unseen side is invented. Unsuitable for nerve identification or procedure teaching |
| Appearance | Clean, slightly diagrammatic | Can look photographic |
| File size | 1.8 MB for 102 structures | A standard splat file stores up to about 248 bytes per Gaussian, so the default 262,144 is up to about 65 MB before compression |
| In our renderer | Native three.js | Needs an added splat renderer; untested here |

Where a splat could make sense: scenery or objects whose look matters and whose parts do not, captured from your own
photographs. Where it should not be used: anything a learner is asked to identify or act on.

Proposed test once you have access: generate one non-teaching object, load it beside the mesh in the Hall, and
measure file size, frame time on a phone, and whether it can be picked at all.
