# Licences of the files under `assets/`

The project's own code and drawings are the owner's. These files come from other people and keep their licences.
The full ledger, with what was changed in each, is `docs/overlord-world/ASSET-LEDGER.md`.

| Files | From | Licence |
|---|---|---|
| `characters/*.glb`, `characters/*.png`, `models/patient/patient-supine.glb` | Microsoft Rocketbox avatar library, https://github.com/microsoft/Microsoft-Rocketbox | MIT. The licence text is in `characters/LICENSE-Microsoft-Rocketbox.txt` |
| `models/plexus/plexus-right-overlord-v2.glb`, `models/figure/figure-zanatomy.glb` | Z-Anatomy, https://github.com/Z-Anatomy/Models-of-human-anatomy, from BodyParts3D, The Database Center for Life Science | CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/); BodyParts3D CC BY-SA 2.1 Japan. **Changed** from the originals (see the ledger); these derived files are offered under CC BY-SA 4.0 |
| `models/headneck/*` | CT scan: TotalSegmentator dataset v3.0.0, subject s0527, Wasserthal et al., University Hospital Basel, doi:10.5281/zenodo.22688904 | CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). **Changed**: segmented, corrected, cropped, face region blanked, meshed (`docs/overlord-world/HEADNECK-CT.md`) |
| `level/institute.glb` (its textures), `level/props.glb`, `level/sky.hdr` | Poly Haven, https://polyhaven.com | CC0 |
| `level/clinical.glb`: the professionally made pieces listed below | Thirteen models by their authors on Sketchfab, taken from the Objaverse 1.0 release of each upload (Allen Institute for AI, https://huggingface.co/datasets/allenai/objaverse) | Each CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). **Changed**: see below |
| `people/patients/*.glb`, `people/patients.json` | Generated for this project from the MakeHuman base mesh, skins, hair and clothes (the MakeHuman community, http://www.makehumancommunity.org) with the MPFB 2.0.18 add-on in Blender (`tools/people/`) | CC0 for the MakeHuman assets used; the generated figures are yours. Each figure is built from a patient's charted age, sex, height and weight. None is a portrait of a real person, and appearance is never inferred from a name |
| `models/airway/nibp_cuff.glb` | "Sphygmomanometer Low Poly" by TheGiwi on Sketchfab (https://sketchfab.com/3d-models/58f303b71fd047b0960785141485f8f0), from the Objaverse 1.0 release | CC BY 4.0. **Changed**: the cuff taken out of the set, re-proportioned and smoothed (`models/airway/airway.json` lists every change) |
| `models/airway/spo2_probe.glb` | "Pulse Oximeter | Free Model" by Nofil.Khan on Sketchfab (https://sketchfab.com/3d-models/e3ad5ac95aed4546bb869fcd984a7a99), from the Objaverse 1.0 release | CC BY 4.0. **Changed**: see `models/airway/airway.json` |
| `level/clinical.glb`: surgical lights, ceiling supply arm, draped back table and Mayo stand, stools, kick bucket, glass-door cabinets, wall control panel, sharps bin | Built for this project (`tools/clinical_kit.py`) | Yours |

## Equipment in the operating room and the regional bay (`level/clinical.glb`)

Every model below is licensed CC BY 4.0 by its author. All were changed for this project by `tools/clinical_set.py`:
scaled to real size, turned and placed, reduced in triangle count, textures resized and re-encoded, meshes merged, and
rectangles added over blank displays so the app can draw on them. Further changes are named per model.

| Model | Author | Source | Further changes |
|---|---|---|---|
| "Anesthesia_SF Gamicon21" (anesthesia workstation) | DGLENN43 | https://sketchfab.com/3d-models/7ae35c7d5b9b4872af390969292f7914 | Trailing pipeline hoses removed. Recoloured to the United States convention: cylinders and flow-control knobs oxygen green, nitrous oxide blue, air yellow; vaporizer dials sevoflurane yellow, isoflurane purple. Display and gauge faces darkened |
| "Operating Table" | shashkinv1ad | https://sketchfab.com/3d-models/e3a4512227d34b098e2ef0d11c8a80fd | Only the table is used (its lights, column and instrument arms are not). Red stains painted out of the colour map and rust-brown wear drawn back toward clean steel. Column lengthened so the pads stand at 0.90 m |
| "Ultrasound Machine" | Liuuzaki | https://sketchfab.com/3d-models/0d4593f431f94de9a94815ec2c7715e9 | None beyond the common ones |
| "Gourney - Hospital Bed" (stretcher) | meeww | https://sketchfab.com/3d-models/aecf349e49864d8492cf320e5b8d063c | One of the two stretchers in the file is used; mattress colour darkened |
| "Emergency Cart" | tutminchai | https://sketchfab.com/3d-models/7b6c0aa0f213416bbd65efbaa2d26391 | None beyond the common ones |
| "Medical Cart" | NicolasVB | https://sketchfab.com/3d-models/2a0a574f9e374702af8c415fce296f45 | None beyond the common ones |
| "IV Pole" | Mouch (Mountrise) | https://sketchfab.com/3d-models/76521e2f71704b1986cf5ac54368b14f | The file's two poles are separated and placed one in each room |
| "Bed Curtain and Vital Signs Monitor" | Ethan Cragun (EDIIIC) | https://sketchfab.com/3d-models/295ed50eeaa249e8bbeed7b305d3da71 | Track stretched to the bay's size; the curtain across the foot removed; monitor placed separately |
| "Suction-canister" | Dwayne.Barnett | https://sketchfab.com/3d-models/34f41e2382fb4b66a9732cbebc8e872d | None beyond the common ones |
| "SURGICAL INSTRUMENT" | ferofluid | https://sketchfab.com/3d-models/2971a44d334b45ff926792e92a6bcee7 | Laid flat |
| "(FREE) Wall Clock" | Mohamed Ahmed (Ma16.q) | https://sketchfab.com/3d-models/2533ef500ece4fcc804872c706df036b | Glass made simply see-through |
| "Laryngoscope Straight" | marcomiceli29 | https://sketchfab.com/3d-models/8423d037de164df2bd8f3111ae1f7412 | Laid on its side |
| "IV Supplies" (two syringe parts) | Ethan Cragun (EDIIIC) | https://sketchfab.com/3d-models/577ee63d736a44cca98497ed60f8a3c1 | Two parts used, laid flat |

Licences were read from each model's Sketchfab listing on 11 November 2026. The models depict equipment in general; no
manufacturer's name is shown by this project, and none of the models is offered as an accurate record of any product.

## Recorded narration

`assets/audio/narration/*.mp3` and `manifest.json`: the lessons' spoken lines (the plexus film and the regional
explanation), 15 clips, about two and a half minutes. The words are this project's own (each one is sourced in
`docs/overlord-world/CONTENT-VERIFICATION.md`). The audio was generated with ElevenLabs text to speech, voice "Matilda"
(a stock voice from ElevenLabs' own library, voice id `XrExE9yKIg1WjnnlVkGX`, model `eleven_multilingual_v2`), from the
project owner's ElevenLabs account, by `tools/render_narration.py`. No person was recorded and no voice was cloned; the
owner's own voice clones were not used. ElevenLabs' terms give the account holder the rights to audio generated on a paid
plan; the owner should confirm the plan in force covers the use they intend before distributing the app.
