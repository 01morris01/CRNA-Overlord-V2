# Sources of the gloved first-person hands (added 2026-11-13)

Built by `tools/props/airway/build_hands.py` (poses: `hands_poses.py`, solver: `hands_pose.py`; review: `review_hands.py`).

| File | Made from | Licence | Notes |
|---|---|---|---|
| `hands_gloved.glb`, `hands.json` | The MakeHuman base mesh and its default skeleton (the MakeHuman community, http://www.makehumancommunity.org), generated with the MPFB 2 add-on already used for the patients (`tools/people/pp_common.py`) for a mid-proportioned adult | MakeHuman assets CC0 | **Adapted:** hands and forearms cut from the body at 12.5 cm above the wrist, subdivided once and reduced to about 10,300 triangles per hand, rest-pose bones kept from lowerarm02 to the fingertips (21 per hand), weights from MakeHuman. **Authored here:** the nitrile glove (offset surface, rolled cuff bead 6 cm above the wrist, wrinkle and micro-texture normal maps), the forearm cap, 12 poses (36 animation clips), and the grip anchors |

Candidates the owner suggested, checked on 13 November 2026:
- "Free Pack - VR Hands (Rigged)" by PolyOne Studio, Sketchfab b3b8309e59c748e3956531c8f57dd233, licence CC BY 4.0 (read through
  the public API): not in Objaverse 1.0 or TexVerse, so it needs a Sketchfab sign-in to download. Not used.
- "Hands Rigged" by SparrowHawk on BlendSwap (CC0): BlendSwap downloads need an account. Not tried, not used.
- "Rigged Lowpoly Hand" by JanoschR (CC BY): too coarse for close view; not used even as reference.

The poses were solved against stand-ins of the real items (syringe 16.6 mm barrel, the mask as built, the 162 mm bag, the 28 mm
laryngoscope handle, a 32 mm knob, an SpO2 probe, a folded cuff) so fingers rest on surfaces; see `review` sheets.
