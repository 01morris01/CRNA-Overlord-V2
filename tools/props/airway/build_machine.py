"""build_machine.py: the ascending bellows assembly and the grabbable controls for the workstation in assets/level/clinical.glb
(DGLENN43's "Anesthesia_SF Gamicon21"), all authored to sit exactly on that machine (frame: see machine_frame.py).

   blender -b --factory-startup --python tools/props/airway/build_machine.py -- TEXDIR OUTDIR

Outputs bellows.glb + bellows.json and controls.glb + controls.json (OUTDIR = assets/models/machine). Everything here is in
the machine-local frame of the glTF node `eq_anesthesia_machine` (meters, +Y up, +Z toward the operator, +X to the operator's
right): controls.glb's root sits at that node's origin; bellows.glb's root sits at the bellows base center, whose
machine-local position bellows.json gives. The JSON files also list the parts of the level's own machine that these replace
(boxes in machine-local coordinates: hide or discard the triangles wholly inside them)."""
import bpy, bmesh, sys, os, math, json
import numpy as np
from mathutils import Matrix, Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kit, specs
from kit import MM

B = specs.BELLOWS; F = specs.FLOW


def ink_on(name, tex, rgb):
    return kit.ink(name, kit.image(tex), rgb=rgb)


def disc_decal(name, mat, c, r, normal, up, seg=48):
    """A round decal (UV = picture) centered at c, facing `normal`, picture-up along `up`."""
    n = Vector(normal).normalized(); u = Vector(up); u = (u - n * u.dot(n)).normalized(); x = u.cross(n)
    bm = bmesh.new(); uv = bm.loops.layers.uv.new('UVMap'); ctr = bm.verts.new(Vector(c)); ring = []
    for k in range(seg):
        a = kit.TAU * k / seg; ring.append(bm.verts.new(Vector(c) + (x * math.cos(a) + u * math.sin(a)) * r))
    for k in range(seg):
        f = bm.faces.new([ctr, ring[k], ring[(k + 1) % seg]])
        for l in f.loops:
            d = l.vert.co - Vector(c); l[uv].uv = (0.5 + d.dot(x) / (2 * r), 0.5 + d.dot(u) / (2 * r))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(mat); return kit._obj(name, me)


def cyl_decal(name, mat, c, r, y0, y1, ang_c, width, axis_up=True):
    """A band on a vertical cylinder (axis through c, along +Y), centered at angle ang_c (0 = facing +Z, + toward +X),
    `width` meters of arc wide, from y0 (picture bottom) to y1 (picture top)."""
    span = width / r; nu = max(4, int(span / 0.12) + 2)
    def P(u, v):
        a = ang_c - span / 2 + span * u; return (c[0] + r * math.sin(a), y0 + (y1 - y0) * v, c[2] + r * math.cos(a))
    return kit.grid(name, P, nu, 1, mat=mat)


# ---------------------------------------------------------------------------------------------- bellows
def build_bellows(texdir, outdir):
    kit.reset()
    clear = kit.material('clear_housing_acrylic', rgb=(0.97, 0.98, 0.985), rough=0.03, transmission=1.0, ior=1.49)
    base_m = kit.material('bellows_base_grey', rgb=(0.42, 0.44, 0.46), rough=0.45)
    rubber = kit.material('bellows_rubber', rgb=(0.10, 0.17, 0.26), rough=0.48, sheen=0.25, sheen_rough=0.4, sheen_tint=(0.6, 0.7, 0.9))
    plate_m = kit.material('bellows_top_plate', rgb=(0.80, 0.81, 0.80), rough=0.4)
    item = kit.Item('bellows_assembly')
    bh, coll, tp, trav = B['base_h'], B['collapsed'], B['top_plate'], B['travel']
    ro, ri = B['pleat_od'] / 2, B['pleat_id'] / 2; R = B['housing_od'] / 2; wall = B['housing_wall']
    y_b = bh; y_ct = y_b + coll; y_full_top = y_ct + tp + trav; y_hi = y_full_top + 0.0015; y_cap = y_hi + 0.004
    # base: a grey plastic ring the housing locks onto, with two latch tabs
    base = kit.lathe('base', kit.fillet([(0.0, 0.002, 0), (R + 0.006, 0.0, 0.002), (R + 0.006, bh - 0.008, 0.0015), (R + 0.003, bh - 0.006, 0.001), (R + 0.003, bh, 0.001), (R - wall - 0.002, bh, 0), (0, bh, 0)], r=0.0015, n=3), seg=72, mat=base_m, cap0=True, sharp_deg=45)
    tabs = []
    for a in (math.radians(90), math.radians(-90)):
        t = kit.box('tab', (0.010, 0.016, 0.006), center=((R + 0.009) * math.sin(a), bh - 0.010, (R + 0.009) * math.cos(a)), bevel=0.0015, seg=2, mat=base_m); tabs.append(t)
    # housing: clear acrylic, 3 mm wall, closed top with a rounded edge
    out = kit.fillet([(0.0, y_cap, 0), (R - 0.006, y_cap, 0.0), (R, y_cap - 0.006, 0.006), (R, bh - 0.004, 0), (R - wall, bh - 0.004, 0), (R - wall, y_hi - 0.004, 0.0), (R - wall - 0.004, y_hi, 0.004), (0.0, y_hi, 0)], r=0.004, n=5)
    housing = kit.lathe('housing', out, seg=96, mat=clear, sharp_deg=50)
    # the printed scale, turned 15 degrees from the front toward the operator's side (+X)
    lay = json.load(open(os.path.join(texdir, 'layouts.json')))['bellows_scale']
    H = lay['height_mm'] / 1000; top = y_hi - lay['top_pad_mm'] / 1000 + (y_full_top - y_hi) + lay['top_pad_mm'] / 1000
    y1 = y_full_top + lay['top_pad_mm'] / 1000; y0 = y1 - H
    scale = cyl_decal('scale', ink_on('ink_bellows_scale', os.path.join(texdir, 'bellows_scale.png'), (0.96, 0.96, 0.96)), (0, 0, 0), R + 0.0003, y0, y1, math.radians(15), lay['width_mm'] / 1000)
    fixed = item.part('housing', [base, housing, scale] + tabs)
    # bellows: 12 convolutions, collapsed 30 mm; morph `excursion` stretches the stack by the full travel
    n = B['pleats']; prof = []; h0 = coll / n
    for k in range(n + 1):
        y = y_b + k * h0
        prof.append((ri, y)); prof.append((ro, y + h0 * 0.5)) if k < n else None
    pr = []
    for i, (r_, y) in enumerate(prof):
        pr.append((r_, y))
    pts = kit.fillet([(ri - 0.004, y_b, 0)] + [(r_, y, 0.0012) for r_, y in pr] + [(ri - 0.002, y_ct, 0)], r=0.0012, n=2)
    bel = kit.lathe('bellows', pts, seg=56, mat=rubber, sharp_deg=None)
    topplate = kit.lathe('top_plate', kit.fillet([(0.0, y_ct + tp, 0), (ro - 0.002, y_ct + tp, 0.002), (ro + 0.001, y_ct + tp * 0.5, 0.002), (ro - 0.002, y_ct, 0.001), (ri - 0.002, y_ct, 0)], r=0.0015, n=3), seg=64, mat=plate_m)
    mv = kit.join('bellows', [bel, topplate])
    mv.shape_key_add(name='Basis'); ex = mv.shape_key_add(name='excursion', from_mix=False)
    for i, v in enumerate(mv.data.vertices):
        y = v.co.y
        if y <= y_ct + 1e-6: yn = y_b + (y - y_b) * (coll + trav) / coll        # the pleats stretch evenly
        else: yn = y + trav                                                        # the top plate rides up
        ex.data[i].co = Vector((v.co.x, yn, v.co.z))
    ex.value = 1.0                                                                 # default: fully up (end of expiration)
    item.part('bellows', [mv])
    item.empty('bellows_top', at=(0, y_ct + tp, 0), z=(0, 1, 0), y=(0, 0, 1), parent='bellows')
    hide = {'anesthesia_machine_body (clinical.glb node anesthesia_machine_3)': [[-0.2705, 0.8850, -0.1505], [-0.0820, 1.1420, 0.0370]],
            'anesthesia_machine_bag_and_tube_pump (node anesthesia_machine_0)': [[-0.2620, 0.8940, -0.1425], [-0.0900, 1.1315, 0.0290]]}
    marks = {str(v): round(y_full_top - v * 1e-6 / B['area'], 5) for v in B['scale']}
    info = {
        'file': 'bellows.glb', 'parent_node': 'eq_anesthesia_machine (in assets/level/clinical.glb)',
        'machine_local_transform': {'translation': list(B['center']), 'rotation_xyzw': [0, 0, 0, 1], 'scale': [1, 1, 1]},
        'replaces': 'the opaque canister and the green 3-lobe shape inside it; discard the triangles of these meshes that lie wholly inside these machine-local boxes',
        'hide_boxes_machine_local': hide,
        'nodes': {'bellows_assembly': 'root (bellows base center)', 'housing': 'base ring, clear housing, printed scale (static)', 'bellows': 'pleats + top plate, morph `excursion`', 'bellows_top': 'empty on the top plate (moves with the morph in three.js only if read from the morph; see top_y_local)'},
        'morph': 'excursion', 'excursion_meaning': '0 = collapsed at the bottom (inspiration ended with 1500 mL delivered); 1 = fully up against the housing top (end of expiration)',
        'volume': {'max_mL': B['max_ml'], 'effective_area_m2': round(B['area'], 6), 'travel_m': round(trav, 5), 'contained_mL': '1500 * excursion',
                   'delivered_mL_from_full': '1500 * (1 - excursion)', 'top_y_local': '%.5f + %.5f * excursion' % (y_ct + tp, trav)},
        'scale_marks_y_local_m': {'meaning': 'height (local y) of each printed mark; the top plate reaches it when that many mL have been delivered from full', **marks},
        'scale_reads': 'down from the top: 300 at the top of the scale, 1500 at the bottom', 'housing_m': {'outside_diameter': B['housing_od'], 'top_y_local': round(y_cap, 4)},
        'tris': {k: kit.tris(o) for k, o in item.parts.items() if o.type == 'MESH'},
    }
    item.export(os.path.join(outdir, 'bellows.raw.glb'))
    json.dump(info, open(os.path.join(outdir, 'bellows.json'), 'w'), indent=1)
    print('BELLOWS', info['tris'], 'travel', trav, 'cap', y_cap)


# ---------------------------------------------------------------------------------------------- controls
TUBES = {   # name: (x, kind, gas)
    'air_fine': (-0.0561, 'fine', 'air'), 'air_coarse': (-0.0358, 'coarse', 'air'),
    'n2o_fine': (0.0021, 'fine', 'n2o'), 'n2o_coarse': (0.0224, 'coarse', 'n2o'),
    'o2_fine': (0.0670, 'fine', 'o2'), 'o2_coarse': (0.0880, 'coarse', 'o2'),
}
TUBE_Z = -0.0555


def flow_y(kind, q):
    s = F[kind]; g0, g1 = F['grad_y']; f = min(1.0, max(0.0, q / s['qmax'])) ** s['k']; return g0 + (g1 - g0) * f


def build_controls(texdir, outdir):
    kit.reset()
    glass = kit.material('clear_flowtube_glass', rgb=(0.97, 0.985, 0.99), rough=0.02, transmission=1.0, ior=1.47)
    chrome = kit.M('chrome'); dark = kit.M('plastic_dark')
    bob_m = kit.material('bobbin_alu', rgb=(0.78, 0.79, 0.80), rough=0.2, metal=1.0)
    green = kit.material('knob_o2_green', rgb=(0.03, 0.36, 0.13), rough=0.38)
    yellow = kit.material('knob_air_yellow', rgb=(0.80, 0.62, 0.05), rough=0.40)
    sevo_y = kit.material('sevo_yellow', rgb=(0.84, 0.66, 0.08), rough=0.40)
    grey = kit.material('apl_grey', rgb=(0.20, 0.21, 0.22), rough=0.42); white = kit.material('pointer_white', rgb=(0.88, 0.88, 0.86), rough=0.4)
    plate = kit.material('panel_label_white', rgb=(0.86, 0.87, 0.86), rough=0.5)
    item = kit.Item('controls'); info = {'controls': {}}
    lay = json.load(open(os.path.join(texdir, 'layouts.json')))
    # ---- flow tubes (static glass + caps + printed scale) and bobbins (moving)
    y0t, y1t = F['tube_y']; rt = F['tube_od'] / 2; b0, b1 = F['bore']
    for name, (x, kind, gas) in TUBES.items():
        c = (x, 0, TUBE_Z)
        outer = kit.lathe('tube', [(rt, y0t), (rt, y1t)], seg=40, mat=glass)
        inner = kit.lathe('bore', [(b0 / 2, y0t), (b1 / 2, y1t)], seg=32, mat=glass, flip=True)
        caps = [kit.lathe('cap', kit.fillet([(0.002, yy, 0), (rt + 0.0015, yy, 0.001), (rt + 0.0015, yy + 0.012 * sgn, 0.001), (0.002, yy + 0.012 * sgn, 0)], r=0.001), seg=32, mat=chrome) for yy, sgn in ((y0t, -1), (y1t, 1))]
        L = lay['flow_' + kind]; g0, g1 = F['grad_y']; pad = L['pad_mm'] / 1000
        sc = cyl_decal('scale', ink_on('ink_flow_' + kind, os.path.join(texdir, 'flow_scale_%s.png' % kind), (0.05, 0.05, 0.06)), (0, 0, 0), rt + 0.0002, g0 - pad, g1 + pad, math.radians(20), L['width_mm'] / 1000)
        parts = [outer, inner, sc] + caps
        for o in parts: kit.xform(o, Matrix.Translation(c))
        item.part('tube_' + name, parts)
        # bobbin: a fluted float, read at its top edge; node pivot = that top edge on the tube axis
        bob = kit.lathe('bobbin', kit.fillet([(0.0, -0.0115, 0), (0.0012, -0.0115, 0.0004), (0.0028, -0.0028, 0.0006), (b0 / 2 - 0.0002, -0.0012, 0.0005), (b0 / 2 - 0.0002, 0.0, 0.0004), (0.0, 0.0006, 0)], r=0.0004, n=2), seg=24, mat=bob_m)
        band = kit.lathe('bobbin_band', [(b0 / 2 - 0.0001, -0.0010), (b0 / 2 - 0.0001, -0.0003)], seg=24, mat=dark)
        y_rest = flow_y(kind, 0.0)
        for o in (bob, band): kit.xform(o, Matrix.Translation((x, y_rest, TUBE_Z)))
        item.part('bobbin_' + name, [bob, band], pivot=(x, y_rest, TUBE_Z))
        info['controls']['bobbin_' + name] = {'type': 'bobbin', 'gas': gas, 'tube': kind, 'axis': [0, 1, 0], 'rest_y_machine_local': round(y_rest, 5),
                                              'flow_to_y': '%s: y = %.4f + %.4f * min(1, flow / %g) ** %.2f  (flow in L/min; reading at the top of the bobbin)' % (kind, g0, g1 - g0, F[kind]['qmax'], F[kind]['k']),
                                              'marks_y': {('%g' % q): round(flow_y(kind, q), 5) for q in F[kind]['marks']},
                                              'series': 'fine and coarse tubes of one gas carry the same flow: the fine bobbin rises 0..1 L/min then stays at its top; the coarse bobbin reads 1..10 L/min'}
    # ---- flow-control knobs (O2 fluted and larger, as US machines require; air knurled)
    for gas, x, mat, d, flutes, depth in (('o2', 0.0778, green, 0.036, 14, 0.0028), ('air', -0.0467, yellow, 0.030, 24, 0.0007)):
        r = d / 2; prof = kit.fillet([(0.0, 0.026, 0), (r - 0.003, 0.026, 0.0025), (r, 0.022, 0.002), (r, 0.006, 0.001), (r - 0.0035, 0.004, 0.001), (0.0065, 0.004, 0.0), (0.0065, -0.010, 0)], r=0.0015, n=3)
        kn = kit.lathe('knob', prof, seg=max(64, flutes * 5), mat=mat, sharp_deg=50)
        # flutes: push the rim in between ribs
        for v in kn.data.vertices:
            rr = math.hypot(v.co.x, v.co.z)
            if rr > r - 0.0036 and 0.0045 < v.co.y < 0.0235:
                a = math.atan2(v.co.x, v.co.z); s_ = 0.5 + 0.5 * math.cos(a * flutes); k_ = 1 - depth / rr * (1 - s_) ** 2
                v.co.x *= k_; v.co.z *= k_
        kit.finish_mesh(kn.data, 50)
        # the knob's axis is +Z (it faces the operator): lathe +Y -> +Z
        kit.xform(kn, Matrix.Translation((x, 1.1473, -0.012)) @ Matrix.Rotation(math.radians(90), 4, 'X'))
        item.part('knob_' + gas, [kn], pivot=(x, 1.1473, -0.012))
        info['controls']['knob_' + gas] = {'type': 'rotary', 'pivot_machine_local': [x, 1.1473, -0.012], 'axis': [0, 0, 1],
                                           'rule': 'counter-clockwise (as the operator sees it, positive about +Z) opens; needle valve, about 3.5 turns closed to 10 L/min',
                                           'angle_deg_for_flow': 'angle = 1260 * (flow / 10) ** (1 / 1.6)', 'min_deg': 0, 'max_deg': 1260,
                                           'flow_for_angle': 'flow_L_min = 10 * (angle / 1260) ** 1.6', 'average_deg_per_L_min': 126,
                                           'face_center_machine_local': [x, 1.1473, round(-0.012 + 0.026, 4)], 'diameter_m': d}
    # ---- sevoflurane dial (faces the operator), fixed bezel with the index mark, and the 0/T lock button
    sc_ = (0.3483, 1.3347, -0.0615); rd = 0.030
    dial = kit.lathe('dial', kit.fillet([(0.0, 0.016, 0), (rd - 0.004, 0.016, 0.003), (rd, 0.012, 0.002), (rd, 0.003, 0.001), (rd - 0.002, 0.0, 0.0), (0.0, 0.0, 0)], r=0.0015, n=3), seg=96, mat=sevo_y, sharp_deg=50)
    for v in dial.data.vertices:
        rr = math.hypot(v.co.x, v.co.z)
        if rr > rd - 0.0025 and 0.002 < v.co.y < 0.0125:
            a = math.atan2(v.co.x, v.co.z); s_ = 0.5 + 0.5 * math.cos(a * 30); k_ = 1 - 0.0012 / rr * (1 - s_) ** 2; v.co.x *= k_; v.co.z *= k_
    kit.finish_mesh(dial.data, 50)
    face = disc_decal('dial_face', ink_on('ink_sevo_dial', os.path.join(texdir, 'sevo_dial.png'), (0.05, 0.05, 0.06)), (0, 0.0161, 0), rd - 0.0035, (0, 1, 0), (0, 0, -1))
    lockb = kit.lathe('lock', kit.fillet([(0.0, 0.0215, 0), (0.0045, 0.0215, 0.001), (0.0045, 0.012, 0)], r=0.0008), seg=32, mat=dark)
    kit.xform(lockb, Matrix.Translation((0, 0, -0.019)))
    M_d = Matrix.Translation(sc_) @ Matrix.Rotation(math.radians(90), 4, 'X')
    for o in (dial, face, lockb): kit.xform(o, M_d)
    item.part('sevo_dial', [dial, face], pivot=sc_)
    item.part('sevo_lock', [lockb], parent='sevo_dial', pivot=tuple(Vector(sc_) + Vector((0, 0.019, 0.0215))))
    bez = kit.lathe('bezel', kit.fillet([(rd + 0.001, 0.004, 0), (rd + 0.006, 0.004, 0.001), (rd + 0.006, -0.001, 0)], r=0.0008), seg=96, mat=kit.M('plastic_lgrey'))
    idx = kit.sweep('index', [(0, 0.0045, -(rd + 0.0005)), (0, 0.0045, -(rd + 0.0055))], section=[(-0.0016, 0.0), (0.0016, 0.0), (0.0, 0.0010)], mat=dark, up=(0, 1, 0))
    for o in (bez, idx): kit.xform(o, M_d)
    item.part('sevo_bezel', [bez, idx])
    info['controls']['sevo_dial'] = {'type': 'rotary', 'pivot_machine_local': list(sc_), 'axis': [0, 0, 1], 'agent': 'sevoflurane',
                                     'rule': 'counter-clockwise (positive about +Z, as the operator sees it) raises the concentration; the index mark is fixed at 12 o\'clock on sevo_bezel',
                                     'angle_deg_for_percent': {('%g' % v): a for v, a in specs.SEVO['marks']}, 'T_deg': specs.SEVO['T'], 'min_deg': specs.SEVO['T'], 'max_deg': 300,
                                     'face_center_machine_local': [sc_[0], sc_[1], round(sc_[2] + 0.016, 4)], 'diameter_m': 2 * rd,
                                     'lock': 'sevo_lock (child of the dial) must be pressed (translate 0.002 m along -Z) to turn the dial off 0 toward the scale, or from 0 to T'}
    info['controls']['sevo_lock'] = {'type': 'button', 'axis': [0, 0, -1], 'travel_m': 0.002, 'parent': 'sevo_dial'}
    # ---- APL valve on the breathing-system block (axis +Y)
    ac = (-0.2238, 0.8899, 0.1985); ra = 0.0215
    ring = disc_decal('apl_ring', ink_on('ink_apl', os.path.join(texdir, 'apl_ring.png'), (0.05, 0.05, 0.06)), (0, 0.0042, 0), 0.034, (0, 1, 0), (0, 0, -1))
    ringbase = kit.lathe('apl_base', kit.fillet([(0.0, 0.004, 0), (0.033, 0.004, 0.0015), (0.034, 0.0, 0)], r=0.001), seg=72, mat=plate, cap0=False)
    knob = kit.lathe('apl_knob', kit.fillet([(0.0, 0.026, 0), (ra - 0.004, 0.026, 0.003), (ra, 0.022, 0.002), (ra, 0.007, 0.001), (ra - 0.002, 0.004, 0.0), (0.0, 0.004, 0)], r=0.0015, n=3), seg=72, mat=grey, sharp_deg=50)
    for v in knob.data.vertices:
        rr = math.hypot(v.co.x, v.co.z)
        if rr > ra - 0.0025 and 0.006 < v.co.y < 0.0225:
            a = math.atan2(v.co.x, v.co.z); s_ = 0.5 + 0.5 * math.cos(a * 18); k_ = 1 - 0.0015 / rr * (1 - s_) ** 2; v.co.x *= k_; v.co.z *= k_
    kit.finish_mesh(knob.data, 50)
    sp = math.radians(specs.APL['sp_at']); dirx, dirz = math.sin(sp), -math.cos(sp)          # the SP mark's direction (seen from above, 0 = back)
    ptr = kit.sweep('apl_pointer', [(dirx * 0.004, 0.0262, dirz * 0.004), (dirx * (ra - 0.002), 0.0262, dirz * (ra - 0.002))], section=[(-0.0012, 0.0), (0.0012, 0.0), (0.0012, 0.0008), (-0.0012, 0.0008)], mat=white, up=(0, 1, 0))
    tip = kit.sweep('apl_tip', [(dirx * (ra + 0.0002), 0.012, dirz * (ra + 0.0002)), (dirx * (ra + 0.003), 0.012, dirz * (ra + 0.003))], radius=0.0012, seg=10, mat=white, cap1=True)
    for o in (ring, ringbase, knob, ptr, tip): kit.xform(o, Matrix.Translation(ac))
    item.part('apl_scale', [ringbase, ring])
    item.part('apl_knob', [knob, ptr, tip], pivot=ac)
    info['controls']['apl_knob'] = {'type': 'rotary', 'pivot_machine_local': list(ac), 'axis': [0, 1, 0],
                                    'rule': 'clockwise seen from above (negative about +Y) closes the valve: SP (fully open, <1 cmH2O) to 70 cmH2O; the knob\'s white pointer reads against apl_scale',
                                    'angle_deg_for_cmH2O': {str(l): a for l, a in specs.APL['marks']}, 'top_center_machine_local': [ac[0], round(ac[1] + 0.026, 4), ac[2]], 'diameter_m': 2 * ra, 'min_deg': specs.APL['max_angle'], 'max_deg': 0, 'above_70': 'between -280 and -300 deg the valve is fully closed (75+)'}
    # ---- bag / vent selector (a toggle lever on the block, tilting about X)
    bc = (-0.1715, 0.8899, 0.1695)
    bplate = disc_decal('bv_plate', ink_on('ink_bagvent', os.path.join(texdir, 'bagvent_plate.png'), (0.05, 0.05, 0.06)), (0, 0.0032, 0), 0.020, (0, 1, 0), (0, 0, -1))
    bpbase = kit.lathe('bv_base', kit.fillet([(0.0, 0.003, 0), (0.0195, 0.003, 0.001), (0.020, 0.0, 0)], r=0.0008), seg=48, mat=plate)
    boss = kit.lathe('bv_boss', kit.fillet([(0.0, 0.0105, 0), (0.0065, 0.0105, 0.002), (0.0075, 0.003, 0)], r=0.0015, n=3), seg=32, mat=dark)
    for o in (bplate, bpbase, boss): kit.xform(o, Matrix.Translation(bc))
    lever = kit.lathe('bv_lever', kit.fillet([(0.0, 0.040, 0), (0.0045, 0.039, 0.002), (0.0055, 0.031, 0.002), (0.0032, 0.022, 0.003), (0.0028, 0.006, 0)], r=0.0015, n=3), seg=32, mat=kit.M('plastic_blue'))
    kit.xform(lever, Matrix.Translation(bc))
    item.part('bag_vent_base', [bpbase, bplate, boss])
    item.part('bag_vent_switch', [lever], pivot=(bc[0], bc[1] + 0.008, bc[2]))
    info['controls']['bag_vent_switch'] = {'type': 'toggle', 'pivot_machine_local': [bc[0], bc[1] + 0.008, bc[2]], 'axis': [1, 0, 0],
                                           'positions_deg': {'BAG': -25, 'VENT': 25}, 'labels': 'BAG at the back, VENT at the front on bag_vent_base'}
    # ---- O2 flush (recessed, guarded push button on the flowmeter block front)
    fc = (-0.0259, 1.0747, -0.0048)
    guard = kit.lathe('guard', kit.fillet([(0.0135, -0.004, 0), (0.0135, 0.004, 0.001), (0.0165, 0.006, 0.0015), (0.0175, 0.002, 0.001), (0.0175, -0.004, 0)], r=0.0008, n=3), seg=48, mat=kit.M('plastic_lgrey'))
    btn = kit.lathe('flush_button', kit.fillet([(0.0, 0.0028, 0), (0.011, 0.0028, 0.0015), (0.0118, -0.006, 0)], r=0.001, n=3), seg=48, mat=green)
    lbl = disc_decal('flush_label', ink_on('ink_flush', os.path.join(texdir, 'flush_face.png'), (0.95, 0.95, 0.95)), (0, 0.00285, 0), 0.0105, (0, 1, 0), (0, 0, -1))
    M_f = Matrix.Translation(fc) @ Matrix.Rotation(math.radians(90), 4, 'X')
    for o in (guard, btn, lbl): kit.xform(o, M_f)
    item.part('o2_flush_guard', [guard])
    item.part('o2_flush', [btn, lbl], pivot=fc)
    info['controls']['o2_flush'] = {'type': 'button', 'pivot_machine_local': list(fc), 'axis': [0, 0, -1], 'travel_m': 0.006, 'rule': 'press and hold: 35-75 L/min O2 to the common gas outlet (bypasses the vaporizers); springs back'}
    info.update({
        'file': 'controls.glb', 'parent_node': 'eq_anesthesia_machine (assets/level/clinical.glb)', 'root_transform': 'identity: the root `controls` is the machine-local origin',
        'grip_pinch_note': 'hands_gloved.glb grip_pinch.L/.R: put the knob face center there, the knob axis along the grip +Z',
        'replaces': {
            'flowmeter tubes and bobbins': {'meshes': ['anesthesia_machine_3 (body)', 'anesthesia_machine_4 (metal)'], 'box': [[-0.0680, 1.1720, -0.0650], [0.0990, 1.4560, -0.0460]]},
            'O2 knob': {'mesh': 'anesthesia_machine_9 (material knob_oxygen): hide the whole mesh'},
            'air knob': {'mesh': 'anesthesia_machine_7 (material knob_air): hide the whole mesh'},
            'sevoflurane dial': {'mesh': 'anesthesia_machine_11 (material dial_sevoflurane): hide the whole mesh'},
            'APL cap': {'meshes': ['anesthesia_machine_3 (body)'], 'box': [[-0.2490, 0.8890, 0.1730], [-0.1985, 0.9130, 0.2240]]},
            'bag/vent knob': {'meshes': ['anesthesia_machine_3 (body)'], 'box': [[-0.1850, 0.8790, 0.1560], [-0.1580, 0.9200, 0.1830]]},
            'O2 flush disc': {'meshes': ['anesthesia_machine_1 (buttons_knobs)'], 'box': [[-0.0380, 1.0620, -0.0170], [-0.0140, 1.0870, -0.0040]]},
        },
        'colors': 'US: O2 green (fluted, larger, as required), air yellow, sevoflurane yellow; N2O tubes are included (static) so the flowmeter bank is complete; its blue knob stays the machine\'s own'})
    info['tris'] = {k: kit.tris(o) for k, o in item.parts.items() if o.type == 'MESH'}
    item.export(os.path.join(outdir, 'controls.raw.glb'))
    json.dump(info, open(os.path.join(outdir, 'controls.json'), 'w'), indent=1)
    print('CONTROLS', sum(info['tris'].values()), info['tris'])


if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:]; build_bellows(argv[0], argv[1]); build_controls(argv[0], argv[1])
