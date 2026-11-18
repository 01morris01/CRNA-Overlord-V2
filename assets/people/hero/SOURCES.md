# Hero patient p25: sources and licences

Dale Swinford is a fictional patient (chart: `data/mock-or-day/patients/p25.json`). No photograph, scan or likeness of a
named real person was used for his shape or his colour. Every file below was downloaded without a sign-in; nothing
paid and no image generator was used. Build scripts: `tools/people/hero/`, run in this order (Blender ones with `BLENDER_USER_RESOURCES` set as in `hero_lib.py`): measure_stretcher, cache_parts, p25_01_form, p25_02_body, p25_03_parts, p25_04_morphs, p25_05_rest, p25_06_poses, p25_07_contact, p25_08_gown, p25_09_blankets, p25_10_textures, p25_11_assemble, p25_13_lod1, then `python3 p25_12_export.py`, p25_14_landmarks (Blender), p25_16_checks (Blender), `python3 p25_15_json.py`. Review: review_cycles.py (Blender), capture.py + viewer.html (`uv run --with playwright python3 capture.py ...`).
Editable sources (.blend files, work files): `~/Developer/overlord-asset-sources/people/hero/p25/`.

## Credit line the app must show (CC BY 3.0)

> Skin pore detail from "Infinite, 3D Head Scan" by Lee Perry-Smith (www.ir-ltd.net), CC BY 3.0, as distributed by Morgan McGuire's Computer Graphics Archive.

## What each part comes from

| Part of p25.glb | Source | Author | Licence | How it is used |
|---|---|---|---|---|
| Topology, UV islands, skeleton (default rig without toes, 137 bones) and its weights, the 52 ARKit-named face units, brows (eyebrow010), lashes (eyelashes01), hair (culturalibre_hair_02, Stage 1 stand-in), the broad skin colour (middleage african male skin) | MakeHuman base mesh and asset packs, via MPFB 2.0.18 | MakeHuman community | CC0 (http://static.makehumancommunity.org/about/license.html) | The carrier everything is wrapped onto; face units corrected for this head. MPFB itself (GPL-3.0) is a tool and is not shipped |
| Body form (BMI 44 distribution of fat) | MHR, Momentum Human Rig 1.0.1, lod1 identity shapes | Meta Platforms | Apache-2.0 (licence text in the study's `licences/MHR_LICENSE.txt`) | Shape only: MakeHuman's surface wrapped onto MHR's average body; the same places on MHR at a heavy identity (shape_0 2.34, shape_1 -1.8, shape_2 1.0) give the body |
| Head and face form (lids, lips, nose, ear shells, skull) and its fine relief | Blender Studio Human Base Meshes 1.4.1, "Body Male - Realistic" (multires levels 2 and 3) | Blender Studio (realistic assets: Dan Ulrich) | CC0 | MakeHuman's head wrapped onto it, then changed by the identity offsets (`tools/people/hero/p25_identity.json`) and a heavy face; the subject of the sculpt is not named |
| Eyeballs and corneas | Blender Studio Human Base Meshes 1.4.1, "Eye - Realistic" | Dan Ulrich | CC0 | Placed where the sculpt keeps its eyes; iris and sclera texture drawn by script |
| Mouth lining (socket), lower teeth (third molars left out), lower gum, tongue, tear line (`eye_wet`), lid shadow (`eye_occlusion`) | ICT-FaceKit | USC Institute for Creative Technologies | MIT | ICT's face wrapped onto this head; a thin-plate warp carries the inside; tongue enlarged for Mallampati III |
| Pore relief (high-passed, < 1.2 mm) in `skin_detail_normal` and in the head and body normal maps | "Infinite, 3D Head Scan" (bump.png), as cut by the texture-first study (`tf_03_detail.py`) | Lee Perry-Smith | CC BY 3.0 | Only small patches of skin surface, only relief finer than 1.2 mm: no feature, proportion or colour of that face |
| Gown and pillowcase weave | Poly Haven `stretch_poplin` | colormass / Rico Cilliers | CC0 | Normal map; the gown's small diamond print is drawn by script |
| Blanket weave | Poly Haven `waffle_pique_cotton` | colormass / Rico Cilliers | CC0 | Normal map and colour variation |
| The stretcher under him | "Gourney - Hospital Bed" (already in `assets/LICENSES.md`) | meeww | CC BY | Measured only (not in these files) |
| Landmark detection on clay renders | MediaPipe Face Mesh 0.10.14 | Google | Apache-2.0 | A measuring tool; nothing from it is in the files |

## Authored here (no open model was found), by script

- `support_ramp__ramped` (bariatric foam ramp with vinyl cover), `support_head__ramped` (foam head rest),
  `pillow_head__flat`, `pillow_head__lateral_left`, `pillow_knees__lateral_left` (sewn hospital pillows): `support_lib.py`,
  `p25_07_contact.py`; dented where he lies.
- The gown's pattern (cut from slices of the body, simulated with Blender cloth), its turned hems, shoulder snaps and
  neck ties, and its print: `p25_08_gown.py`. Blankets by Blender cloth: `p25_09_blankets.py`.
- The edentulous upper ridge, the soft palate edge, uvula and the four palatal arches: `p25_03_parts.py`.
- Skin colour layers on MakeHuman's map (grade, mottling, periorbital, lips, beard shadow and stubble), the iris and
  sclera: `p25_10_textures.py`.

## Choices written down

- **Dentures.** The chart conflicts: the airway exam says "Dentures, remove before sedation"; the nursing pre-op
  checklist says "Dentures: None". Modeled as the airway exam reads, at the moment it matters to the anesthetist: the
  upper complete denture is out (edentulous upper arch with a resorbed, rounded ridge), the lower teeth are natural.
  Without the denture the upper lip has lost support, so it sits 3 mm further back than the sculpt's.
- **Tonsils.** Tonsillectomy 1986 (chart): the tonsillar fossae between the arches are empty.
- **Weight from volume.** Sized for 139.4 kg of tissue at 1006 kg/m3 (42 % fat, Siri) plus 2.0 L of lung air; the
  same mesh reads 142.0 kg at the 1010 kg/m3 the other patients use.
- **A pillow on the flat pose.** The pre-op stretcher patient has a pillow (`pillow_head__flat`), an addition to the
  contract's list of per-pose meshes.
- **Lateral hip flexion 54/59 degrees, not 60-70.** On the 0.576 m mattress his knees pass the edge beyond about 56
  degrees (measured: 65 degrees puts them 3.4 cm over the edge).
- **Arms.** His trunk is wider than the mattress leaves room for arms beside it, so in `flat` and `ramped` the upper arms
  lie against the chest wall and the forearms and hands rest on the flanks; nothing passes the mattress edge.
