# Asset ledger and sourcing

Rule: every model used in a build is listed here with its origin, licence, what was changed, and whether it suits the
use. If a row is missing or its licence is unknown, the model does not ship.

## Used in the slice

| Asset | Origin | Licence | Changes | Suitable for | Restrictions and cautions |
|---|---|---|---|---|---|
| `assets/models/plexus/plexus-right-zanatomy.glb` (1.8 MB, 102 structures) | Z-Anatomy `Startup.blend` from github.com/Z-Anatomy/Models-of-human-anatomy (file dated 2023-05-02; repository head `dd53423` on 2026-11-10). Derived from BodyParts3D, The Database Center for Life Science | Z-Anatomy: CC BY-SA 4.0. BodyParts3D: CC BY-SA 2.1 Japan | Selected the right neck, shoulder and arm; curves converted to tubes; transforms applied; hand bones merged; skull bones merged; Draco compression. Script: `tools/` export described below. No shapes edited | Identification of named structures and their course; relations to bone, muscle and vessel that pass the audit | **Share-alike**: this file and anything derived from it must be offered under CC BY-SA with attribution. Z-Anatomy also bundles a few models under non-commercial licences (inner ear, kidney); none of those are in this export. Not suitable for teaching division-to-cord wiring (see audit) |
| Island blocks, props, characters | Written for this project (`world/js/voxel.js`, `game.js`, `avatar.js`) | Yours | n/a | The game world | Code-built. A candidate for replacement by commissioned or licensed art |
| Inter Tight typeface | Google Fonts | SIL Open Font License | none | UI | none |
| three.js r170 and its Draco decoder | jsDelivr CDN | MIT / Apache-2.0 | none | Rendering | Loaded from a CDN; vendor it before relying on it offline |

Attribution shown in the app and required wherever the model is redistributed:
"Z-Anatomy, the libre 3D atlas of anatomy, CC BY-SA 4.0. BodyParts3D, The Database Center for Life Science, CC BY-SA 2.1 Japan."

### Anatomy verification (what "checked" means here)

`tools/audit_plexus.py` measures the model and compares it with the statements the lesson makes. 18 of 23 pass.

| Passes | Fails (model differs from the textbook statement) |
|---|---|
| Trunk order top to bottom; trunks emerge behind the anterior scalene beside the middle scalene; subclavian artery crosses the first rib; inferior trunk behind and above the artery; vein in front of and artery behind the anterior scalene; axillary nerve at the surgical neck; radial nerve behind the humeral shaft; ulnar nerve behind the medial epicondyle; median nerve with the brachial artery; suprascapular nerve from the superior trunk to the scapula; long thoracic nerve on serratus anterior; dorsal scapular nerve through the middle scalene; posterior cord gives radial, thoracodorsal and both subscapular nerves; musculocutaneous between biceps and brachialis; cricoid at C6; trunks above and posterior cord below the clavicle | Trunks are not inside the groove (the roots, which are, are not modelled): 3 checks. Musculocutaneous does not pierce coracobrachialis and is not joined to the plexus. The posterior division of the inferior trunk does not reach the posterior cord, and the axillary nerve starts 7 mm from it |

The lesson text was changed to match the model in each failing case. Still needed: review by an anatomist or faculty.

## On your computer, not in the slice

| Asset | Origin | Licence | Suitable? |
|---|---|---|---|
| OR pack: `Anesthesia.glb`, table, light, IV pole, trolleys and others in the uncommitted `crisis-sim/assets/pack` | Artisan 3D Ventures "Operation Theatre", a Unity Asset Store pack you bought (per earlier project notes; the FBX originals are in your Unity projects) | Unity Asset Store EULA | Good quality for the OR. **Check the EULA before these GLB files go into a public repository or onto a public site in a form that can be downloaded as assets.** I have not verified the current terms; treat this as unresolved |
| `patient.glb` | Microsoft Rocketbox avatar, converted in Blender (per earlier project notes) | MIT | Usable. Street clothes; needs draping or a gown |
| `ChariteOR.glb` (26 MB room) | Unknown. Earlier notes call it reference only | Unknown | **Do not ship** |
| `AnesthesiaMachine.glb`, `PatientMonitor.glb` (named parts, no textures) | No record. Structure suggests they were built by script in Blender | Yours if so | Low detail. Useful as interaction stand-ins only |
| Larynx (`larynx-dundee.glb`) | University of Dundee, "Anatomy of the Larynx" | CC BY-SA 4.0 | Yes, with attribution and share-alike. Muscles in the rig are generated |
| Lung segments | NIH 3D entry 3DPX-013408, Visible Human male lungs, cut into segments by your own project | CC BY 4.0 (per your project's README) | Yes for segment identification. Internal channels are print features, not airways |
| Bronchial tree | marcguntow on Sketchfab | CC BY 4.0 (in the file) | Yes, with attribution |

## Sources evaluated

| Source | Verdict |
|---|---|
| **Z-Anatomy** | Best available open source for named, layered whole-body anatomy. 7,184 objects; nerves and vessels are curves that convert cleanly. Share-alike applies. Detail is uneven: gross relations are good, fine nerve junctions are schematic, as the audit showed |
| **NIH 3D** | Good for individual scanned organs and printable models. Licence varies by entry and must be read per entry. Not re-checked online in this session beyond the lung entry your project already documents |
| **Blender** | Used here for selection, conversion and export, not for shaping anatomy. Appropriate next uses: adding structures the model lacks (cords, roots, phrenic) **only** from a reference and with review; building equipment; gowning the patient |
| **Your existing models** | See the table above. The OR pack is the strongest; its licence question comes first |
| **Idol SDK (Sperid Labs)** | Not run. See below |

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
