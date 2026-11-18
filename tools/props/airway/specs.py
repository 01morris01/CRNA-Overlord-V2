"""specs.py: the real dimensions every airway and machine prop is built to (millimetres unless named otherwise).

Plain Python (no Blender), shared by the Blender builders and by textures.py, so the printed scales and the geometry come
from the same numbers. Sources are named next to each block; "approx." marks a value read from product photographs or
drawings rather than a published table."""
import math

# ---------------------------------------------------------------------------------------------- syringes (US, Luer-Lok type)
# Inside diameters: the values syringe-pump drug libraries use for BD Luer-Lok / Plastipak syringes (3 mL 8.66, 5 mL 12.06,
# 10 mL 14.50; the brief quotes ~14.5 for 10 mL). Graduation spacing follows from the bore: travel per mL = 1000 / area.
# Outside diameters, flange, collar and rod sizes are approx. (product photographs and drawings of US 3/5/10 mL syringes).
# US printing: 3 mL marked every 0.1 mL with numbers at each 0.5 mL; 5 and 10 mL marked every 0.2 mL, numbers each 1 mL.
SYRINGES = {
    '3ml':  dict(ml=3,  id=8.66,  od=10.6, wall_floor=1.6, extra=9.0,  flange=(23.0, 14.0, 1.6), thumb=13.0, rod_rib=1.0,
                 stopper_len=6.0, minor=0.1, major=0.5, numbers=[0.5, 1, 1.5, 2, 2.5, 3], label=(34.0, 13.0)),
    '5ml':  dict(ml=5,  id=12.06, od=14.0, wall_floor=1.8, extra=10.0, flange=(29.0, 17.0, 1.8), thumb=17.0, rod_rib=1.2,
                 stopper_len=7.0, minor=0.2, major=1.0, numbers=[1, 2, 3, 4, 5], label=(38.0, 13.0)),
    '10ml': dict(ml=10, id=14.50, od=16.6, wall_floor=2.0, extra=12.0, flange=(35.0, 20.0, 2.0), thumb=21.0, rod_rib=1.4,
                 stopper_len=8.0, minor=0.2, major=1.0, numbers=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], label=(38.0, 13.0)),
}
for k, s in SYRINGES.items():
    s['area'] = math.pi * (s['id'] / 2) ** 2                 # mm^2
    s['mm_per_ml'] = 1000.0 / s['area']                     # mm of plunger travel per mL
    s['scale_len'] = s['ml'] * s['mm_per_ml']               # zero line to the nominal mark
# Male Luer (ISO 80369-7 / ISO 594-1): 6 % taper, about 3.98 mm at the tip end, 7.5 mm long; Luer-lock collar thread about 8 mm.
LUER = dict(tip_d=3.98, tip_len=7.5, taper=0.06, collar_id=7.0, collar_od=9.9, collar_len=8.0, bore=1.6)

# ---------------------------------------------------------------------------------------------- ISO 5356-1 cones
CONE22 = dict(d=22.37, at=15.0, taper=1 / 40, min_len=21.0)    # 22 mm cone: 22.37 +-0.04 at 15 mm from the leading end
CONE15 = dict(d=15.47, at=10.0, taper=1 / 40, min_len=16.0)    # 15 mm cone: 15.47 +-0.04 at 10 mm

# ---------------------------------------------------------------------------------------------- face mask, adult large (size 5)
# Cushion outline and height: approx., from product sheets of disposable anatomical masks (size 5 "large adult" ~ 125 x 100).
MASK = dict(length=124.0, width=99.0, height=72.0, cushion_tube=15.0, connector_od=26.5, hook_ring_od=46.0)

# ---------------------------------------------------------------------------------------------- reservoir bag 3 L
BAG = dict(volume_l=3.0, length=330.0, neck_len=55.0, neck_id=22.4, squeeze_l=0.7)

# ---------------------------------------------------------------------------------------------- laryngoscope
# Macintosh 4 (adult large): ~155 mm hook-on to tip (vendor tables give Mac 3 ~130-135, Mac 4 ~155); medium handle ~ 28 x 130 mm.
LARYNGOSCOPE = dict(mac4_len=155.0, handle_d=28.0, handle_len=130.0)

# ---------------------------------------------------------------------------------------------- ascending bellows (machine)
# Ehrenwerth 3rd ed. Fig 6.17: clear housing, scale 300..1500 mL reading DOWN from the top. Sized here so that 1500 mL is the
# full travel of a 130/106 mm pleat (effective diameter 118 mm): travel = 1.5 L / area.
BELLOWS = dict(max_ml=1500, scale=[300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500], labels=[300, 400, 500, 600, 700, 800, 1000, 1200, 1500],
               pleat_od=0.130, pleat_id=0.106, pleats=12, collapsed=0.030, base_h=0.030, top_plate=0.006, housing_od=0.160, housing_wall=0.003,
               center=(-0.1762, 0.8854, -0.0566))                      # machine-local: the old canister's axis and the worktop under it
BELLOWS['area'] = math.pi * ((BELLOWS['pleat_od'] + BELLOWS['pleat_id']) / 4) ** 2
BELLOWS['travel'] = BELLOWS['max_ml'] * 1e-6 / BELLOWS['area']

# ---------------------------------------------------------------------------------------------- flowmeters (modelled scales)
# Dual tubes in series per gas: fine 0..1 L/min (marked in mL/min) and coarse 1..10 L/min. Thorpe-tube spacing is not linear;
# the fraction of the graduated length used here is f = (Q / Qmax) ** k (k 0.85 fine, 0.80 coarse) - modelled, not one maker's.
FLOW = dict(fine=dict(qmax=1.0, k=0.85, marks=[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], labels={0.2: '200', 0.4: '400', 0.6: '600', 0.8: '800', 1.0: '1000'}, unit='mL/min'),
            coarse=dict(qmax=10.0, k=0.80, marks=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], labels={q: str(q) for q in range(1, 11)}, unit='L/min'),
            tube_y=(1.180, 1.445), grad_y=(1.205, 1.415), tube_od=0.0150, bore=(0.0062, 0.0098))
# sevoflurane dial (concentration %, dial angle in degrees counter-clockwise from 0; T = transport, past 0 the other way)
SEVO = dict(marks=[(0, 0), (0.2, 18), (0.4, 33), (0.6, 46), (0.8, 58), (1, 70), (1.5, 95), (2, 118), (2.5, 139), (3, 158), (3.5, 176), (4, 193), (5, 222), (6, 250), (7, 276), (8, 300)],
            T=-28)
# APL valve: SP (fully open, <1 cmH2O) to 70; clockwise (seen from above) closes. Angle = rotation about +Y (negative = clockwise).
APL = dict(marks=[('SP', 0), (5, -28), (10, -52), (20, -98), (30, -138), (40, -176), (50, -212), (60, -246), (70, -280)], max_angle=-300,
           sp_at=210)       # the SP mark sits 210 degrees clockwise from the back (about 7 o'clock seen from the operator's side), so the scale runs round the back
