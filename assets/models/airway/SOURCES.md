# Sources of the hand-held airway kit (added 2026-11-13)

Built by `tools/props/airway/` (`build_all.sh` rebuilds everything; each `build_*.py` says what it makes). Dimensions are in
`tools/props/airway/specs.py` with where each number comes from. Licences were read on each model's Sketchfab page through
the public API on 13 November 2026. Nothing here was paid for, needed a sign-in, or came from an image generator.

Earlier files in this folder (`nibp_cuff.glb`, `spo2_probe.glb`, `airway.json`) are not part of this set and were not changed.

| File | Made from | Licence | Authored or adapted |
|---|---|---|---|
| `syringe_3ml.glb`, `syringe_5ml.glb`, `syringe_10ml.glb`, `syringes.json` | Authored in Blender to US Luer-lock syringe proportions (bore from syringe-pump drug-library values: 8.66, 12.06, 14.50 mm; ISO 80369-7 male Luer and lock collar) | Project's own | **Authored.** Looked at and not used: "syringeS" by shiva070 (CC BY 4.0, https://sketchfab.com/3d-models/46121c4d191046f1aa4faac5ea6bc138): a single European 10 mL slip-tip syringe with a needle and a scale printed to 11 mL; it cannot give US 3 and 5 mL proportions or a Luer lock |
| `face_mask_adult.glb` | Authored: anatomical size-5 mask, inflated cushion, ISO 5356-1 22 mm female connector, hook ring, cushion inflation valve | Project's own | **Authored.** Looked at: the clear mask in "LIC TRAINER 2 equipment 7634" by 7634hosi (CC BY 4.0, https://sketchfab.com/3d-models/153ed34cc7524291aa37c939bce83574): a round dish and ring of about 75 x 100 mm with no connector detail; not used |
| `reservoir_bag_3l.glb` | Authored: black latex-free 3 L bag, 22 mm female neck, morph targets `fill` and `squeeze` computed so that full = 3.0 L and squeeze = -0.7 L | Project's own | **Authored.** The LIC trainer's blue bag (same author, CC BY) was looked at: a rigid shape not suited to morphing; not used |
| `laryngoscope_mac.glb` | Authored: C-cell knurled handle (knurl as a normal map), Macintosh 4 blade with a fiberoptic light guide and lens, hook-on heel and hinge pin | Project's own | **Authored.** Looked at and not used: "Laryngoscope" by CarlosBe0305 (CC BY 4.0, https://sketchfab.com/3d-models/b26a806e366342ef8888334d1d570637): a 550,000-triangle CAD export with no materials, fan-triangulated faces, a blade of about Macintosh 3 length, and (as attached in that file) a blade that curves toward the handle, where a Macintosh blade curves away from it |
| `circuit_parts.glb`, `corrugated_normal.png`, `corrugated_normal.txt` | Authored: 22 mm swivel elbow with capped Luer sampling port, Y-piece, adult HME filter with pleated paper and foam; ISO 5356-1 cone sizes. The normal map is generated (`textures.py`) | Project's own | **Authored** |
| `iv_port.glb` | "Peripheral venous catheter" by 3D (scratchi), https://sketchfab.com/3d-models/69f883fdc4b54b51aca2864eb4b9c646, from the Objaverse 1.0 release (allenai/objaverse on Hugging Face) | **CC BY 4.0** (https://creativecommons.org/licenses/by/4.0/). Credit: "Peripheral venous catheter" by scratchi, CC BY 4.0 | **Adapted.** Kept: the clear catheter hub with its side port, the wings, the extension tubing loop, the slide clamp and the Luer end. Removed: needle, needle grip, grip plate, protective cap. Changed: wings lowered onto the skin; wings and Luer end recolored pink (20 G); clamp white; clamp, tubing and Luer end thinned (decimated); everything turned and wrapped onto a 45 mm radius forearm. Added (authored): the 20 G cannula, a split-septum needleless connector on the Luer end, and a 7 x 8.5 cm transparent dressing with border, notch and label strip, draped over the hub |
| `bite_block.glb` | Authored: adult endoscopy bite block (20 mm / 60 Fr channel), elastic strap drawn round an average head | Project's own | **Authored** (nothing found in either open mirror) |
| `nasal_cannula_capno.glb` | Authored: adult divided nasal cannula with CO2 sampling line, ear loops, chin slide, O2 and sampling lines | Project's own | **Authored** (nothing found) |

## Frames and anchors (also in each file's root extras)
- syringes: +Z toward the tip; origin at the zero line; `plunger` moves along -Z (see `syringes.json`).
- mask: origin `seat` (cushion contact plane), +Z away from the face, +Y toward the nasal bridge; `port` at the connector mouth.
- bag: +Y toward the neck; `neck` at the neck opening (+Z out along the fitting); `squeeze_center` where the hand goes.
- laryngoscope: origin on the hinge pin, +Y up the handle, open blade along +Z; fold = rotate `blade` -90 degrees about X.
- circuit parts: each part has `in` (machine side) and `out` (patient side) at its port mouths, +Z out of the port; the Y-piece also `exp`.
- IV: origin at the skin puncture, +Z toward the shoulder, +Y out of the skin; `port` at the needleless valve, +Z into the valve.
- bite block: origin at the bite line, +Z out of the mouth; cannula: origin `prongs`, +Z anterior; tube centerlines in node extras.

## Third-party data used for dimensions (facts, not copied material)
ISO 5356-1 (publisher preview): 22 mm cone 22.37 mm at 15 mm, 15 mm cone 15.47 mm at 10 mm, taper 1:40. ISO 80369-7 / ISO 594-1:
male Luer 6 % taper. Ehrenwerth, Anesthesia Equipment, 3rd ed.: mask construction, 22 mm circuit, bag sizes, ascending bellows.
