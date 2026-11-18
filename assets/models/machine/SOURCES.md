# Sources of the workstation bellows and controls (added 2026-11-13)

Built by `tools/props/airway/build_machine.py` (textures by `textures.py`; frame by `machine_frame.py`). Both files fit the
anesthesia workstation already in `assets/level/clinical.glb`: "Anesthesia_SF Gamicon21" by DGLENN43, CC BY 4.0,
https://sketchfab.com/3d-models/7ae35c7d5b9b4872af390969292f7914 (licence re-read on 13 November 2026). Positions were
measured from that model through the same transform `tools/clinical_set.py` applies (checked: the oxygen knob's box matches
the level's `knob_oxygen` mesh to the millimeter).

| File | What it is | Licence | Authored or adapted |
|---|---|---|---|
| `bellows.glb`, `bellows.json` | Ascending bellows assembly: grey base ring, clear acrylic housing with a 300-1500 mL scale reading down from the top, 12-convolution bellows with a top plate; morph `excursion` (0 collapsed, 1 fully up); 1500 mL = full travel of a 118 mm effective diameter | Project's own | **Authored.** The workstation model has no bellows (an opaque cylinder with a green 3-lobe shape in it); no open model of a bellows was found (`research/sourcing/sourcing.md`) |
| `controls.glb`, `controls.json` | Dual-tube flowmeters (fine 0-1 L/min, coarse 1-10 L/min) for air, N2O and O2 with moving bobbins; O2 knob (green, fluted, larger) and air knob (yellow); sevoflurane dial with its % scale, fixed index and 0/T lock button; APL valve knob over a SP-70 cmH2O scale; bag/vent toggle; recessed O2 flush button | Project's own | **Authored to match the workstation** (its own knobs and dial are simple shapes without scales; reused only as positions and sizes). The N2O knob stays the workstation's own |

The flowmeter scale spacing (Thorpe-tube style, denser at the top) is modelled, not copied from one manufacturer; the
formula is in `controls.json`. Textbook facts used (Ehrenwerth, Anesthesia Equipment, 3rd ed.): ascending bellows rises in
exhalation and fails to reach the top on a leak; clear housing, scale 300-1500 mL reading down from the top; APL opens under
1 cmH2O when fully open and closes clockwise; bag/vent selector; O2 flush.
