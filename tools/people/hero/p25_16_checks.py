"""p25_16_checks.py: contact numbers for every pose of the hero patient p25 (measured on p25_final.blend).
   Blender -b --factory-startup --python tools/people/hero/p25_16_checks.py
 - body below the mattress top (the 12 mm sink is intended), body inside each support of the pose (depth), gaps between
   the body and the support under it (floating), blanket inside body or gown, gown inside the body; all in mm."""
import bpy, os, sys, json
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Vector
import hero_lib as H
import pose_lib as PL

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
log = H.Log('checks')
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_final.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']
ST = json.load(open(os.path.join(WORK, 'stretcher', 'stretcher.json')))
HW, HL = 0.5 * ST['pad_width'], ST['pad_z'][1]
FIG = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == arm]
SUP = {'flat': ['pillow_head__flat'], 'ramped': ['support_ramp__ramped', 'support_head__ramped'], 'lateral_left': ['pillow_head__lateral_left', 'pillow_knees__lateral_left']}


def set_pose(name):
    arm.animation_data.action = bpy.data.actions[name]; scene.frame_set(1)
    for o in FIG:
        if o.data.shape_keys:
            for k in o.data.shape_keys.key_blocks[1:]:
                k.value = 1.0 if k.name == 'press_' + name else 0.0
    bpy.context.view_layer.update()


def inside_depth(P, V, Q, step=1):
    """Depth of points inside a closed-ish mesh (nearest-surface test with the face normal)."""
    tree = H.bvh(V, Q); worst = 0.0; n = 0
    for p in P[::step]:
        loc, nrm, fi, d = tree.find_nearest(Vector(p), 0.2)
        if loc is not None and (Vector(p) - loc).dot(nrm) < 0:
            worst = max(worst, d); n += 1
    return worst, n


REP = {}
for pose in ('flat', 'ramped', 'lateral_left'):
    set_pose(pose)
    SH, SB, GW = bpy.data.objects['skin_head'], bpy.data.objects['skin_body'], bpy.data.objects['gown']
    VH, VB, VG = PL.evaluated(SH), PL.evaluated(SB), PL.evaluated(GW)
    QH, QB, QG = H.quads_of(SH), H.quads_of(SB), H.quads_of(GW)
    BODY = np.vstack([VH, VB]); BQ = np.vstack([QH, QB + len(VH)])
    r = {}
    on = (np.abs(BODY[:, 0]) < HW) & (np.abs(BODY[:, 1]) < HL)
    r['below_mattress_top_mm'] = float(-BODY[on, 2].min() * 1000)
    r['outside_mattress_footprint_vertices'] = int((~on).sum())
    r['outside_by_mm'] = float(max(0.0, (np.abs(BODY[:, 0]) - HW).max(), (np.abs(BODY[:, 1]) - HL).max()) * 1000)
    for s in SUP[pose]:
        o = bpy.data.objects[s]; V = H.world_coords(o); Q = H.quads_of(o)
        d, n = inside_depth(BODY, V, Q, step=2)
        # floating: over the support's top, the gap between the support surface and the body's underside
        tree = H.bvh(BODY, BQ); gaps = []
        top = V[V[:, 2] > np.percentile(V[:, 2], 60)]
        for p in top[::3]:
            hit = tree.ray_cast(Vector((p[0], p[1], p[2] - 0.002)), Vector((0, 0, 1)), 0.05)
            if hit[0] is not None:
                gaps.append(hit[3] - 0.002)
        r[s] = dict(body_inside_mm=d * 1000, body_vertices_inside=n, contact_gap_min_mm=(min(gaps) * 1000 if gaps else None), contact_points=len(gaps))
    bl = bpy.data.objects['blanket__' + pose]
    d, n = inside_depth(H.world_coords(bl), np.vstack([BODY, VG]), np.vstack([BQ, QG + len(BODY)]), step=2)
    r['blanket_inside_body_or_gown_mm'] = d * 1000; r['blanket_vertices_inside'] = n
    d, n = inside_depth(VG, BODY, BQ, step=1)
    r['gown_inside_body_mm'] = d * 1000; r['gown_vertices_inside'] = n
    REP[pose] = r
    log(pose, json.dumps(r))
H.save_json(os.path.join(WORK, 'checks.json'), REP)
