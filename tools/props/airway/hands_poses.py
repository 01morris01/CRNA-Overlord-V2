"""hands_poses.py: the pose library for the gloved hands (see hands_pose.py for the solver and the joint conventions).

Each pose function takes a Hand (left or right; positions here are written for the LEFT hand and mirrored by h.m()) and
sets its joints. Holding poses also return the grip frame: where, in the hand frame, the held object's own anchor goes
(see GRIP_ANCHOR) and the stand-in shape used for contact. Numbers are meters and degrees.

Real sizes used for the stand-ins: syringe barrel 16.6 mm, flange 35 x 20 mm; mask dome as built (build_mask.py); bag
162 mm across; laryngoscope handle 28 mm; flow-control knob 32 mm; SpO2 probe about 20 x 18 x 45 mm; folded BP cuff."""
import math
from mathutils import Matrix, Vector
from hands_pose import frame, sdf

GRIP_ANCHOR = {
    'grip_syringe': 'syringe_*: the `flange` empty (origin on the barrel axis at the finger flange, +Z toward the tip)',
    'grip_mask': 'face_mask_adult: the root / `seat` empty (+Z away from the face, +Y toward the nasal bridge)',
    'grip_bag': 'reservoir_bag_3l: the `squeeze_center` empty (+Z toward the thumb side, +Y along the bag toward the neck)',
    'grip_laryngoscope': 'laryngoscope_mac: the `grip` empty (+Y up the handle toward the end cap, +Z toward the open blade)',
    'grip_pinch': 'a flow-control knob: its front face center, +Z out of the knob toward the hand (controls.json gives knob axes)',
}


def mx(h, M):
    """Mirror a left-hand frame for the right hand (reflect x, keep a right-handed frame by flipping the X axis too)."""
    if h.s > 0: return M
    S = Matrix.Diagonal((-1, 1, 1, 1)); return S @ M @ S


def shape_m(h, sh):
    """Mirror a stand-in shape for the right hand."""
    if h.s > 0: return sh
    S3 = Matrix.Diagonal((-1, 1, 1)); out = dict(sh)
    if 'p' in sh: out['p'] = tuple(h.m(sh['p']))
    if 'axis' in sh: out['axis'] = tuple(h.m(sh['axis']))
    if 'rot' in sh: out['rot'] = S3 @ sh['rot'] @ S3
    if 'shapes' in sh: out['shapes'] = [shape_m(h, s) for s in sh['shapes']]
    return out


# ---------------------------------------------------------------------------------------------- free poses
def open_(h):
    h.clear(); h.set_wrist(0, 0)
    for n, sp in ((2, 7), (3, 1), (4, 6), (5, 12)): h.set_finger(n, -14, -12, -8, spread=sp)
    h.set_thumb(swing=-12, abd=18, roll=0, mcp=-8, ip=-6); h.apply()


def relaxed(h):
    h.clear()
    for n, (a, b, c) in {2: (8, 14, 8), 3: (12, 20, 10), 4: (16, 24, 12), 5: (20, 28, 14)}.items(): h.set_finger(n, a, b, c, spread=2)
    h.set_thumb(swing=12, abd=4, roll=8, mcp=10, ip=12); h.apply()


def point(h):
    h.clear()
    h.set_finger(2, -12, -10, -6, spread=2)
    for n, (a, b, c) in {3: (82, 95, 45), 4: (88, 100, 45), 5: (92, 100, 45)}.items(): h.set_finger(n, a, b, c)
    h.set_thumb(swing=48, abd=-14, roll=25, mcp=22, ip=18); h.apply()


# ---------------------------------------------------------------------------------------------- holding poses
def pinch(h, knob_r=0.016):
    """Grasping a fluted flow-control knob (32 mm) from the front: index and middle pads on one side of the rim, the thumb pad
    on the other. The fingers point at the panel (-Z); the knob axis runs back toward the hand."""
    h.clear()
    h.set_finger(2, 32, 42, 22, spread=-3); h.set_finger(3, 38, 48, 24, spread=-6); h.set_finger(4, 55, 70, 35); h.set_finger(5, 60, 72, 35)
    h.apply(); ip = h.pad(2).copy(); mp = h.pad(3).copy()
    across = (h.m(Vector((1, 0, 0))) * 0.55 + Vector((0, -1, 0)) * 0.45).normalized()       # from the index pad toward the thumb, across the knob
    tgt = ip + across * (2 * knob_r + 0.004)
    knob = {'type': 'cyl', 'p': tuple(ip + across * (knob_r + 0.002)), 'axis': (0, 0, 1), 'r': knob_r}
    h.thumb_to(tgt, shape=knob, swing=(0, 85), abd=(-30, 35), roll=20, mcp=(-10, 45), ip=(-10, 45))
    tp = h.pad(1).copy(); c = (ip + tp) / 2
    z = Vector((0, 0, 1)); dd = (tp - ip).normalized(); z = (z - dd * z.dot(dd)).normalized()
    face = c + z * 0.007
    return frame(face, z, (0, 1, 0)), knob


def syringe_hold(h, push=0.0):
    """Barrel between the index and middle fingers, finger flange behind them, thumb on the plunger's thumb press.
    push: how far the thumb has pressed the plunger in (m). Placed for a 10 mL syringe drawn to about 4 mL."""
    h.clear()
    axis = Vector((0.0, -0.12, -1.0)).normalized(); P = Vector((0.0205, -0.034, -0.092))       # flange center, push direction
    barrel = {'type': 'cyl', 'p': tuple(P), 'axis': tuple(axis), 'r': 0.0083}
    fl = {'type': 'box', 'p': tuple(P), 'half': (0.0175, 0.010, 0.001), 'rot': frame(P, axis, (0, 1, 0)).to_3x3(), 'round': 0.001}
    S = shape_m(h, {'type': 'union', 'shapes': [barrel, fl]})
    h.curl_to(2, S, (85, 75, 35), base=(30, 10, 5), spread=10)
    h.curl_to(3, S, (85, 75, 35), base=(30, 10, 5), spread=-10)
    h.set_finger(4, 75, 85, 40); h.set_finger(5, 80, 85, 40)
    stroke = 4.0 * 0.0060558                                    # 4 mL drawn in a 10 mL syringe
    press = P - axis * (0.0140 + stroke) + axis * push           # back face of the thumb press (behind the flange)
    h.thumb_to(h.m(press - axis * 0.004), shape=S, swing=(20, 95), abd=(-35, 25), roll=30, mcp=(-10, 40), ip=(-10, 40))
    return mx(h, frame(P, axis, (0, 1, 0))), S


def mask_ce(h):
    """Left hand C-E grip on the mask from the head of the bed: thumb and index in a C round the connector collar (thumb on
    the nasal side), middle, ring and little fingers down on the mandible beyond the chin end of the mask."""
    h.clear()
    # mask frame in the hand frame: mask +Z (away from face) = hand +Y, mask +Y (nose) = hand +Z, mask +X = hand -X
    R = Matrix(((-1, 0, 0), (0, 0, 1), (0, 1, 0)))
    seat = Vector((0.040, -0.092, -0.080))
    M = R.to_4x4(); M.translation = seat
    dome = {'type': 'ell', 'p': tuple(seat + R @ Vector((0, -0.003, 0.012))), 'r': (0.056, 0.042, 0.065), 'rot': R}
    collar = {'type': 'cyl', 'p': tuple(seat + R @ Vector((0, 0.004, 0.06))), 'axis': tuple(R @ Vector((0, 0, 1))), 'r': 0.0135}
    jaw = {'type': 'cyl', 'p': tuple(seat + R @ Vector((0.040, -0.040, -0.040))), 'axis': tuple((R @ Vector((0.85, 0.5, 0.0))).normalized()), 'r': 0.014}
    S = shape_m(h, {'type': 'union', 'shapes': [dome, collar]}); J = shape_m(h, jaw); SJ = shape_m(h, {'type': 'union', 'shapes': [dome, collar, jaw]})
    h.curl_to(2, S, (70, 60, 35), base=(5, 5, 0), spread=-2)
    for n, sp in ((3, -2), (4, 2), (5, 8)): h.curl_to(n, SJ, (100, 85, 45), base=(10, 10, 5), spread=sp)
    tgt = h.m(seat + R @ Vector((0.0, 0.026, 0.052)))
    h.thumb_to(tgt, shape=S, swing=(-10, 60), abd=(-30, 40), roll=10, mcp=(-10, 30), ip=(-10, 30))
    return mx(h, M), S


def bag_squeeze(h, closed=False):
    """A hand round the widest part of the 3 L bag: palm and thumb on the bag's +X side, fingers over the bag toward its -X
    side (the dents build_bag.py makes). The bag axis runs across the palm."""
    h.clear()
    c = Vector((0.004, -0.103, -0.060))
    Rr = 0.081 - (0.016 if closed else 0.0)
    bag = {'type': 'ell', 'p': tuple(c), 'r': (0.135, Rr, Rr), 'rot': Matrix((Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))))}
    S = shape_m(h, bag)
    for n, sp in ((2, 6), (3, 0), (4, -3), (5, -8)): h.wrap_to(n, S, (75, 95, 60), base=(-10, -8, -4), spread=sp)
    # thumb: swung out along the bag on the palm side, then curled down onto it
    h.thumb_base(swing=18 if not closed else 26, abd=22, roll=10); h.wrap_to(1, S, (60, 70, 0), base=(-10, -8, 0))
    # the bag's squeeze_center empty: +Z = bag X (the palm and thumb side) = hand +Y; +Y = bag axis (toward the neck) = hand -X
    return mx(h, frame(c, (0, 1, 0), (-1, 0, 0))), S


def laryngoscope_grip(h):
    """Left hand round the handle low near the blade: a power grip on the 28 mm handle, which runs across the palm toward the
    thumb (its end cap beyond the thumb); the blade comes out below the little finger and points the way the knuckles face."""
    h.clear()
    a = Vector((1.0, 0.0, -0.42)).normalized(); p = Vector((0.004, -0.036, -0.080))
    S = shape_m(h, {'type': 'cyl', 'p': tuple(p), 'axis': tuple(a), 'r': 0.014})
    for n, sp in ((2, 0), (3, 0), (4, 0), (5, 0)): h.curl_to(n, S, (95, 100, 50), base=(20, 15, 5), spread=sp)
    tgt = h.m(p + a * 0.020 + Vector((0, -0.024, -0.004)))
    h.thumb_to(tgt, shape=S, swing=(10, 80), abd=(-30, 30), roll=20, mcp=(0, 45), ip=(0, 45))
    blade = Vector((0, 0, -1)); blade = (blade - a * blade.dot(a)).normalized()
    # laryngoscope `grip` frame: +Y up the handle (toward the thumb), +Z toward the blade
    y = a; z = blade; x = y.cross(z); M = Matrix((x, y, z)).transposed().to_4x4(); M.translation = p
    return mx(h, M), S


def cuff_hold(h):
    """Holding a folded blood-pressure cuff (a soft pad about 35 mm thick) between the fingers and the thumb."""
    h.clear()
    S = shape_m(h, {'type': 'box', 'p': (0.004, -0.040, -0.135), 'half': (0.060, 0.017, 0.045), 'round': 0.006})
    for n, sp in ((2, 2), (3, 0), (4, -2), (5, -4)): h.curl_to(n, S, (60, 80, 40), base=(0, 0, 0), spread=sp)
    h.thumb_to(h.m(Vector((0.040, -0.064, -0.120))), shape=S, swing=(10, 80), abd=(-30, 30), roll=15, mcp=(0, 40), ip=(0, 40))
    return None, S


def probe_hold(h):
    """Holding a finger-clip SpO2 probe (about 20 x 18 x 45 mm) between the thumb pad and the index and middle pads."""
    h.clear()
    c = Vector((0.032, -0.046, -0.150))
    S = shape_m(h, {'type': 'box', 'p': tuple(c), 'half': (0.011, 0.009, 0.022), 'round': 0.003})
    h.curl_to(2, S, (70, 70, 40), base=(15, 10, 5), spread=-3); h.curl_to(3, S, (70, 70, 40), base=(18, 12, 6), spread=-6)
    h.set_finger(4, 45, 60, 30); h.set_finger(5, 50, 60, 30)
    h.thumb_to(h.m(c + Vector((0.0, -0.013, 0.002))), shape=S, swing=(20, 90), abd=(-30, 30), roll=25, mcp=(0, 45), ip=(0, 45))
    return None, S


POSES = [
    ('open', open_, None), ('relaxed', relaxed, None), ('point', point, None),
    ('pinch', pinch, 'grip_pinch'), ('syringe_hold', syringe_hold, 'grip_syringe'), ('syringe_push', lambda h: syringe_hold(h, push=0.02), None),
    ('mask_ce', mask_ce, 'grip_mask'), ('bag_squeeze_open', bag_squeeze, 'grip_bag'), ('bag_squeeze_closed', lambda h: bag_squeeze(h, closed=True), None),
    ('laryngoscope_grip', laryngoscope_grip, 'grip_laryngoscope'), ('cuff_hold', cuff_hold, None), ('probe_hold', probe_hold, None),
]
