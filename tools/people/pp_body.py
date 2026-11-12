"""pp_body.py: make one MakeHuman person from a patient's numbers, lay it on its back, and hand back plain arrays.
Used by make_person.py. Everything here is in the add-on's own standing frame until lay_supine():
   up +Z, the face looks along -Y, the person's left is +X, and one unit is one metre of the add-on's default-size person.
The person is scaled to the chart height only when it is laid down."""
import bpy, os, math
import numpy as np
from mathutils import Matrix, Vector, Quaternion
from pp_common import (mpfb, USERDATA, mixed_coords, deformed_coords, set_keys, group_weights, rotate_bone, aim_bone, bisect)
from scipy import ndimage as ndi

BODY_DENSITY = 1010.0       # kg per cubic metre; whole-body average, used to turn mesh volume into weight
FACE_UNITS = ('eyeBlinkLeft', 'eyeBlinkRight', 'jawOpen')

ARM_BONES = ['upperarm01', 'upperarm02', 'lowerarm01', 'lowerarm02', 'wrist'] + [f'finger{i}-{j}' for i in range(1, 6) for j in range(1, 4)] + [f'metacarpal{i}' for i in range(1, 5)]
HAND_BONES = ['wrist'] + [f'finger{i}-{j}' for i in range(1, 6) for j in range(1, 4)] + [f'metacarpal{i}' for i in range(1, 5)]
LEG_BONES = ['upperleg01', 'upperleg02', 'lowerleg01', 'lowerleg02', 'foot'] + [f'toe{i}-{j}' for i in range(1, 6) for j in range(1, 4)]


def _sides(names):
    return [n + s for n in names for s in ('.L', '.R')]


def body_topology(bm):
    """The faces that belong to the body itself (the base mesh also carries helper shapes for fitting clothes and joints)."""
    gi = bm.vertex_groups['body'].index
    inbody = np.zeros(len(bm.data.vertices), bool)
    for v in bm.data.vertices:
        for g in v.groups:
            if g.group == gi and g.weight > 0.5:
                inbody[v.index] = True
    uvd = bm.data.uv_layers.active.data
    faces, fuv = [], []
    for p in bm.data.polygons:
        if all(inbody[i] for i in p.vertices):
            faces.append(list(p.vertices))
            fuv.append([tuple(uvd[l].uv) for l in p.loop_indices])
    return inbody, np.array(faces, np.int32), np.array(fuv, np.float64)


def mesh_volume(co, quads):
    a, b, c, d = (co[quads[:, i]] for i in range(4))
    return float((np.einsum('ij,ij->i', a, np.cross(b, c)) + np.einsum('ij,ij->i', a, np.cross(c, d))).sum() / 6.0)


# What "heavier than the add-on's heaviest setting" is made of: the add-on's own fat and girth shapes, in fixed proportion.
# (name under the add-on's targets folder, share, True if it is a face or neck shape: those stop growing sooner)
HEAVY = [('arms/l-upperarm-fat-incr', 1, 0), ('arms/r-upperarm-fat-incr', 1, 0), ('arms/l-lowerarm-fat-incr', 1, 0), ('arms/r-lowerarm-fat-incr', 1, 0),
         ('legs/l-upperleg-fat-incr', 1, 0), ('legs/r-upperleg-fat-incr', 1, 0), ('legs/l-lowerleg-fat-incr', 1, 0), ('legs/r-lowerleg-fat-incr', 1, 0),
         ('torso/measure-waist-circ-incr', 1, 0), ('torso/measure-hips-circ-incr', 1, 0), ('torso/measure-bust-circ-incr', 0.7, 0), ('legs/measure-thigh-circ-incr', 1, 0),
         ('arms/measure-upperarm-circ-incr', 1, 0), ('stomach/stomach-tone-decr', 1, 0), ('stomach/stomach-pregnant-incr', 0.45, 0), ('buttocks/buttocks-volume-incr', 0.6, 0),
         ('torso/torso-scale-depth-incr', 0.5, 0), ('head/head-fat-incr', 0.5, 1), ('neck/neck-double-incr', 0.6, 1), ('neck/measure-neck-circ-incr', 0.7, 1),
         ('cheek/l-cheek-volume-incr', 0.3, 1), ('cheek/r-cheek-volume-incr', 0.3, 1)]
HEAVY_MAX, HEAVY_FACE_MAX = 3.0, 1.0


def create_fitted_human(spec, log=print):
    """A standing person whose build matches the chart. The add-on's weight control only spans a body-mass index of about
    20 to 24, so: below that the thin shape is pushed further, above it the add-on's fat and girth shapes are added in
    fixed proportion (HEAVY), and the amount is searched until the mesh volume at the chart height gives the chart weight."""
    M = mpfb()
    macros = dict(spec['macros'])
    macros.setdefault('weight', 0.5)
    bm = M.Human.create_human(mask_helpers=False, detailed_helpers=True, extra_vertex_groups=True, feet_on_ground=False, scale=0.1, macro_detail_dict=macros)
    for name, w in spec.get('targets', []):
        path = os.path.join(M.system_targets, name + '.target.gz')
        if not os.path.exists(path):
            path = os.path.join(USERDATA, 'targets', name + '.target')
        k = M.Target.load_target(bm, path, weight=0.0)
        k.slider_min, k.slider_max = -2.0, 3.0
        k.value = float(w)
    heavy = []
    for name, share, face in HEAVY:
        k = M.Target.load_target(bm, os.path.join(M.system_targets, name + '.target.gz'), weight=0.0, name='heavy:' + name)
        k.slider_max = HEAVY_MAX
        heavy.append((k.name, share, face))
    inbody, quads, fuv = body_topology(bm)
    H, W = float(spec['heightM']), float(spec['weightKg'])
    want = W / (H * H)

    def at(w=None, h=None):
        if w is not None:
            M.Props.set_value('weight', float(w), entity_reference=bm)
            M.Target.reapply_macro_details(bm)
        if h is not None:
            for name, share, face in heavy:
                bm.data.shape_keys.key_blocks[name].value = share * (min(h, HEAVY_FACE_MAX) if face else h)
        return mixed_coords(bm)

    def bmi_of(co):
        z = co[inbody, 2]
        h = z.max() - z.min()
        return BODY_DENSITY * abs(mesh_volume(co, quads)) * H / h ** 3     # volume scaled to the chart height, over height squared

    p_lo, p_mid, p_hi = at(0.0, 0.0), at(0.5), at(1.0)
    b_lo, b_hi = bmi_of(p_lo), bmi_of(p_hi)
    if want > b_hi:
        h = bisect(lambda h: bmi_of(at(h=h)) - want, 0.0, HEAVY_MAX, iters=12)
        co, note = at(h=h), f'heaviest setting plus {h:.2f} of the fat shapes'
    elif want < b_lo:
        k = bisect(lambda k: want - bmi_of(p_lo + k * (p_lo - p_mid)), 0.0, 1.6)
        co, note = at(0.0) + k * (p_lo - p_mid), f'thinnest setting pushed {k:.2f} further'
    else:
        w = bisect(lambda w: bmi_of(at(w)) - want, 0.0, 1.0, iters=10)
        co, note = at(w), f'weight setting {w:.3f}'
    reached = bmi_of(co)
    log(f'BUILD chart BMI {want:.1f}; weight control alone spans {b_lo:.1f} to {b_hi:.1f}; {note}; reached {reached:.1f}')
    M.Target.bake_targets(bm)
    bm.data.vertices.foreach_set('co', co.astype(np.float32).ravel())
    bm.data.update()
    return bm, inbody, quads, fuv, {'bmiWanted': round(want, 2), 'bmiReached': round(reached, 2), 'buildNote': note}


def add_rig_and_parts(bm, spec, log=print):
    """The add-on's standard skeleton, then eyes, lashes, teeth, tongue and (when asked for) hair, brows and a beard, each fitted to this person."""
    M = mpfb()
    arm = M.Human.add_builtin_rig(bm, 'default')
    parts = {}
    for key, kind in (('eyes', 'eyes'), ('lashes', 'eyelashes'), ('teeth', 'teeth'), ('tongue', 'tongue'), ('brows', 'eyebrows'), ('hair', 'hair'), ('beard', 'clothes')):
        frag = spec.get('parts', {}).get(key)
        if not frag:
            continue
        path = M.Asset.find_asset_absolute_path(frag, kind)
        if not path:
            raise SystemExit(f'asset not found: {kind}/{frag}')
        ob = M.Human.add_mhclo_asset(path, bm, asset_type=kind.capitalize(), subdiv_levels=0, material_type='MAKESKIN')
        for m in list(ob.modifiers):
            if m.type != 'ARMATURE':
                ob.modifiers.remove(m)
        parts[key] = ob
    for m in list(bm.modifiers):          # masks that hide skin under clothes are not wanted here
        if m.type != 'ARMATURE':
            bm.modifiers.remove(m)
    # three movements from the CC0 face-unit pack: each becomes a shape key on the body and on the parts that follow it
    for name in FACE_UNITS:
        M.Target.load_target(bm, os.path.join(USERDATA, 'targets', 'faceunits', name + '.target'), weight=0.0, name=name)
    M.Face.interpolate_targets(bm)
    bpy.context.view_layer.update()
    return arm, parts


def segment_labels(bm):
    """Which part of the body each vertex mostly belongs to, from the skeleton weights."""
    lab = {}
    lab['armL'] = group_weights(bm, {n + '.L' for n in ARM_BONES})
    lab['armR'] = group_weights(bm, {n + '.R' for n in ARM_BONES})
    lab['handL'] = group_weights(bm, {n + '.L' for n in HAND_BONES})
    lab['handR'] = group_weights(bm, {n + '.R' for n in HAND_BONES})
    lab['forearmL'] = group_weights(bm, {'lowerarm01.L', 'lowerarm02.L'}) + lab['handL']
    lab['forearmR'] = group_weights(bm, {'lowerarm01.R', 'lowerarm02.R'}) + lab['handR']
    lab['legs'] = group_weights(bm, set(_sides(LEG_BONES)))
    head_bones = {'head'} | {b.name for b in bm.parent.data.bones['head'].children_recursive}
    lab['head'] = group_weights(bm, head_bones)
    lab['neck'] = group_weights(bm, {'neck01', 'neck02', 'neck03'})
    lab['torso'] = 1.0 - lab['armL'] - lab['armR'] - lab['legs'] - lab['head'] - lab['neck']
    return lab


def pose_supine(bm, arm, inbody, spec, scale, log=print):
    """Pose the standing person as someone lying flat: legs let go, head resting, arms alongside the body on top of the
    sheet with the backs of the hands up. "The table" here is the plane behind the person that the back and the seat both touch."""
    lab = segment_labels(bm)
    P = arm.pose.bones
    for pb in P:
        pb.rotation_mode = 'QUATERNION'
    X = Vector((1, 0, 0))
    info = {}

    def body_co():
        return deformed_coords(bm)

    sel = lambda w, t=0.5: inbody & (w > t)
    torso, legs, head = sel(lab['torso']), sel(lab['legs']), sel(lab['head'])
    arms = sel(lab['armL'] + lab['armR'])
    fore = sel(lab['forearmL'] + lab['forearmR'])
    hands = sel(lab['handL'] + lab['handR'])

    # ---- 1. tip the whole person so that the upper back and the seat lie in one plane (the line a ruler would make across them)
    co = body_co()
    yz = co[torso][:, 1:]
    zb = np.linspace(yz[:, 1].min(), yz[:, 1].max(), 60)
    prof = np.array([[yz[(yz[:, 1] >= a) & (yz[:, 1] < b), 0].max(initial=-9), 0.5 * (a + b)] for a, b in zip(zb[:-1], zb[1:])])
    prof = prof[prof[:, 0] > -8]
    iz_mid = 0.5 * (prof[0, 1] + prof[-1, 1])
    lower, upper = prof[prof[:, 1] < iz_mid], prof[prof[:, 1] >= iz_mid]
    best = None
    for a in lower:                                       # the pair of points, one low one high, that every other point stays in front of
        for b in upper:
            slope = (b[0] - a[0]) / (b[1] - a[1])
            if np.all(prof[:, 0] <= a[0] + slope * (prof[:, 1] - a[1]) + 1e-6):
                best = slope
    tilt = math.atan(best) if best is not None else 0.0
    rotate_bone(arm, 'root', Quaternion(X, tilt))         # done on the root bone, so the skeleton's own frame stays the world frame
    co = body_co()
    y_table = co[torso, 1].max()
    info['backTiltDeg'] = math.degrees(tilt)

    # ---- 2. let each part come to rest: legs and head on the table plane
    def turn_about_x(names, angle, base):
        for n in names:
            P[n].matrix_basis = base[n]
        bpy.context.view_layer.update()
        for n in names:
            rotate_bone(arm, n, Quaternion(X, angle))

    def rest(names, fn, lo, hi, label):
        """Turn the named bones about the left-right axis until fn() (how far the part is through its support) is zero."""
        base = {n: P[n].matrix_basis.copy() for n in names}

        def f(a):
            turn_about_x(names, a, base)
            return fn()
        a = bisect(f, math.radians(lo), math.radians(hi), iters=12)
        f(a)
        info[label] = math.degrees(a)

    # legs: roll outward a little, feet relax, then lower onto the table
    roll = math.radians(spec.get('pose', {}).get('legRollDeg', 9.0))
    for s, sx in (('.L', 1.0), ('.R', -1.0)):
        pb = P['upperleg01' + s]
        d = (P['foot' + s].head - pb.head).normalized()
        rotate_bone(arm, 'upperleg01' + s, Quaternion(d, -sx * roll))        # toes turn outward
        rotate_bone(arm, 'foot' + s, Quaternion(X, math.radians(spec.get('pose', {}).get('footDropDeg', 14.0))))
    rest(['upperleg01.L', 'upperleg01.R'], lambda: body_co()[legs, 1].max() - y_table, -15, 20, 'hipExtDeg')
    # head: MakeHuman people carry the head a few centimetres forward of the back. Lying down, the neck straightens and
    # the head comes back to rest: the lower neck tips back while the upper neck and head tip forward again, so the head
    # moves back much more than it tilts (the face ends up only slightly more "chin up" than standing).
    chain = (('neck01', -1.0), ('neck02', -0.4), ('neck03', 0.35), ('head', 0.75))
    base = {n: P[n].matrix_basis.copy() for n, _ in chain}

    def fh(a):
        for n, _ in chain:
            P[n].matrix_basis = base[n]
        bpy.context.view_layer.update()
        for n, share in chain:
            rotate_bone(arm, n, Quaternion(X, a * share))
        return body_co()[head, 1].max() - y_table
    limit = spec.get('pose', {}).get('neckLimitDeg', 34.0)
    a = bisect(fh, math.radians(-10), math.radians(limit), iters=14)
    info['neckBaseDeg'] = math.degrees(a)
    info['neckExtDeg'] = math.degrees(a) * -sum(sh for _, sh in chain)       # net tilt of the head, chin up positive
    info['headGap'] = -fh(a)                      # how far the back of the head still is from the table (standing-frame units)

    # ---- 3. arms: alongside the body, on top of the sheet, the backs of the hands up, nothing beyond the edge of a stretcher
    # The arms rest on the sheet where it lies on the table beside the body. Where an arm cannot be beside the body
    # without going over the edge (a broad or heavy patient), it is kept inside the edge and overlaps the body's outline:
    # the sheet is pressed down under it (pp_cloth.py), which reads as an arm held against the patient's side.
    trunk_legs = torso | legs
    on_sheet = y_table - 0.005 / scale                    # the table plane, less the thickness of a sheet

    def back_of_hand(s, sx):
        w = P['wrist' + s].head
        n = (P['finger2-1' + s].head - w).cross(P['finger5-1' + s].head - w)      # index knuckle x little-finger knuckle
        return (n * sx).normalized()                                              # the two hands are mirror images

    arm_chain = [n + s for s in ('.L', '.R') for n in ['clavicle', 'shoulder01'] + ARM_BONES]

    def pose_arms(ab, af):
        """Upper arms `ab` out from straight down, forearms `af` out from straight down, hands in line, palms toward the table."""
        for n in arm_chain:
            P[n].matrix_basis = Matrix.Identity(4)
        bpy.context.view_layer.update()
        for s, sx in (('.L', 1.0), ('.R', -1.0)):
            aim_bone(arm, 'upperarm01' + s, 'lowerarm01' + s, (sx * math.sin(ab), 0.0, -math.cos(ab)))
            aim_bone(arm, 'lowerarm01' + s, 'wrist' + s, (sx * math.sin(af), 0.0, -math.cos(af)))
            fd = (P['wrist' + s].head - P['lowerarm01' + s].head).normalized()
            aim_bone(arm, 'wrist' + s, 'finger3-1' + s, fd)                       # hand in line with the forearm
            axis = (P['wrist' + s].head - P['lowerarm01' + s].head).normalized()
            dorsal = back_of_hand(s, sx)
            dorsal = (dorsal - axis * dorsal.dot(axis)).normalized()
            want = Vector((0, -1, 0)); want = (want - axis * want.dot(axis)).normalized()
            ang = math.atan2(axis.dot(dorsal.cross(want)), dorsal.dot(want))
            up_axis = (P['lowerarm01' + s].head - P['upperarm01' + s].head).normalized()
            for name, share in (('upperarm02', 0.10), ('lowerarm01', 0.22), ('lowerarm02', 0.40), ('wrist', 0.28)):   # the turn is spread along the arm, as in a real forearm
                rotate_bone(arm, name + s, Quaternion(up_axis if name == 'upperarm02' else (P['wrist' + s].head - P['lowerarm01' + s].head).normalized(), ang * share))
            info['forearmTurnDeg' + s] = math.degrees(ang)
            dorsal = back_of_hand(s, sx)                                          # a resting hand is not flat: let the fingers curl a little
            for i in range(2, 6):
                for j, deg in ((1, 16.0), (2, 14.0), (3, 8.0)):
                    pb = P[f'finger{i}-{j}{s}']
                    side = Vector(pb.y_axis).cross(dorsal)
                    if side.length > 1e-6:
                        rotate_bone(arm, pb.name, Quaternion(side.normalized(), -math.radians(deg)))

    def gap(mask):
        """The narrowest space between a part of the arms and the trunk or legs, measured level by level (negative: they overlap)."""
        c = body_co()
        g = 9.0
        for z in np.arange(c[mask, 2].min(), c[mask, 2].max(), 0.02):
            band = (c[:, 2] >= z) & (c[:, 2] < z + 0.02)
            inner, outer = np.abs(c[band & mask, 0]), np.abs(c[band & trunk_legs, 0])
            if len(inner) and len(outer):
                g = min(g, inner.min() - outer.max())
        return g

    pose_arms(0.2, 0.2)
    co = body_co()
    sh_z = 0.5 * (P['upperarm01.L'].head.z + P['upperarm01.R'].head.z); el_z = 0.5 * (P['lowerarm01.L'].head.z + P['lowerarm01.R'].head.z)
    upper_all = arms & ~fore
    # the half of the upper arm nearer the elbow (the half nearer the shoulder is joined to the trunk and always "touches" it)
    wv = group_weights(bm, {'upperarm02.L', 'upperarm02.R', 'lowerarm01.L', 'lowerarm01.R'})
    upper_far = upper_all & (wv > 0.5)
    near_elbow = np.zeros(len(co), bool)
    for s in ('.L', '.R'):
        e = np.array(P['lowerarm01' + s].head)
        near_elbow |= np.linalg.norm(co - e, axis=1) < 0.22 * (Vector(P['wrist' + s].head) - Vector(e)).length
    fingers = inbody & (group_weights(bm, {f'finger{i}-{j}{s}' for i in range(1, 6) for j in (1, 2, 3) for s in ('.L', '.R')}) > 0.5)
    edge = spec.get('pose', {}).get('armHalfWidth', 0.295) / scale                # everything stays within this distance of the midline
    # a) upper arms against the side of the chest (pressed in about a centimetre, as a resting arm is)
    ab = bisect(lambda a_: (pose_arms(a_, a_), gap(upper_far))[1] + 0.012 / scale, math.radians(1.0), math.radians(30.0), iters=8)
    # b) forearms and hands just clear of the hips and thighs, so that they lie on the surface beside them ...
    #    (but never bent outward at the elbow by more than a little: where the hips are in the way, the hand lies against them)
    af = bisect(lambda a_: (pose_arms(ab, a_), gap(fore))[1] - 0.010 / scale, math.radians(-10.0), ab + math.radians(9.0), iters=8)
    # c) ... unless that would put a hand over the edge: then the arm comes in, and rests on the side of the body instead
    beyond = lambda a_b, a_f: (pose_arms(a_b, a_f), float(np.abs(body_co()[arms, 0]).max()))[1] - edge
    if beyond(ab, af) > 0:
        af = bisect(lambda a_: beyond(ab, a_), ab - math.radians(22.0), af, iters=8)
        if beyond(ab, af) > 0:
            ab = bisect(lambda a_: beyond(a_, af), math.radians(-6.0), ab, iters=8)
    pose_arms(ab, af)
    info['armAbductionDeg'], info['forearmOutDeg'] = math.degrees(ab), math.degrees(af)
    # d) lower each part until it lies on what is under it: the elbow first, then the forearm and the heel of the hand, then the fingers
    rest(['upperarm01.L', 'upperarm01.R'], lambda: body_co()[upper_far | (arms & near_elbow), 1].max() - on_sheet, -40, 40, 'shoulderExtDeg')
    rest(['lowerarm01.L', 'lowerarm01.R'], lambda: body_co()[fore & ~near_elbow & ~fingers, 1].max() - on_sheet, -60, 40, 'elbowDeg')
    rest(['wrist.L', 'wrist.R'], lambda: body_co()[fingers, 1].max() - on_sheet, -40, 40, 'wristDeg')
    co = body_co()
    info['armsHalfWidth'] = float(np.abs(co[arms, 0]).max() * scale)
    info['y_table'] = float(co[torso, 1].max())
    log('POSE ' + ', '.join(f'{k} {v:.1f}' if isinstance(v, float) and abs(v) >= 1 else f'{k} {v:.3f}' if isinstance(v, float) else f'{k} {v}' for k, v in info.items()))
    return lab, info
