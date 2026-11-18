"""p25_07_contact.py: supports, contact and the per-pose press shapes of the hero patient p25.
   Blender -b --factory-startup --python tools/people/hero/p25_07_contact.py
For each pose clip (flat is the rest pose):
 - the supports are built (authored: no open model of these exists) and placed on the measured mattress:
     flat:          pillow_head__flat (a hospital pillow; the pre-op stretcher has one: added to the contract's list)
     ramped:        support_ramp__ramped (bariatric foam ramp, vinyl cover) and support_head__ramped (foam head rest)
     lateral_left:  pillow_head__lateral_left, pillow_knees__lateral_left
 - the body as posed is 'un-flattened' (the rest pose carries the flat pose's back contact) and, lying on his side,
   the belly and chest fat sag toward the mattress; then every point under a support's surface (or 12 mm below the
   mattress top) is pressed onto it with a soft edge and a small sideways bulge (the head is not pressed: the skull
   does not flatten, the pillow is dented instead);
 - that change, carried back through the skinning to the rest pose, is the shape key press_<pose> on skin_body (set it
   with the clip's weight in the mixer);
 - each support's top is dented to the body's underside, so there is no gap and no pass-through.
Saves p25/blend/p25_contact.blend and work/contact.json (penetration and gap numbers per pose)."""
import bpy, os, sys, json, math
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Matrix, Vector, Quaternion
from mathutils.bvhtree import BVHTree
import hero_lib as H
import pose_lib as PL
import support_lib as SL

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
OUT = os.path.join(WORK, 'contact'); os.makedirs(OUT, exist_ok=True)
log = H.Log('contact')
ST = json.load(open(os.path.join(WORK, 'stretcher', 'stretcher.json')))
SN = np.load(os.path.join(WORK, 'stretcher', 'stretcher.npz'))
RS = np.load(os.path.join(WORK, 'rest_split.npz'))
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_poses.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']; P = arm.pose.bones
SHd, SBd = bpy.data.objects['skin_head'], bpy.data.objects['skin_body']
HALF_W = 0.5 * ST['pad_width']; HALF_L = ST['pad_z'][1]
SINK = 0.012
QB = H.quads_of(SBd); QH = H.quads_of(SHd)
EB = H.edges_of(QB)
ri_b = np.empty(len(SBd.data.vertices), np.int32); SBd.data.attributes['restidx'].data.foreach_get('value', ri_b)
ri_h = np.empty(len(SHd.data.vertices), np.int32); SHd.data.attributes['restidx'].data.foreach_get('value', ri_h)
PRESS_FLAT_B = RS['press_flat'][ri_b]
labB = {k[4:]: RS[k][ri_b] for k in RS.files if k.startswith('lab_')}
REST_B = H.get_co(SBd.data.shape_keys.key_blocks[0].data, len(SBd.data.vertices))
mattress_V = np.stack([SN['V'][:, 0], -SN['V'][:, 2], SN['V'][:, 1]], 1).astype(float)
mattress_F = SN['F'][SN['pad']]
MAT_TREE = H.bvh(mattress_V, mattress_F)
REPORT = {}


def set_action(name):
    arm.animation_data.action = bpy.data.actions[name]
    scene.frame_set(1)
    bpy.context.view_layer.update()


def mesh_obj(name, V, F, UV=None, material=None):
    if name in bpy.data.objects:
        bpy.data.objects.remove(bpy.data.objects[name], do_unlink=True)
    o = H.new_mesh(name, V, [tuple(int(x) for x in (f if f[-1] != f[-2] else f[:-1])) for f in F])
    if UV is not None:
        lay = o.data.uv_layers.new(name='UVMap'); arr = []
        for p in o.data.polygons:
            for vi in p.vertices:
                arr.append(UV[vi])
        lay.data.foreach_set('uv', np.asarray(arr, np.float32).ravel())
    if material is not None:
        o.data.materials.append(material)
    return o


def cloth_mat(name, color, weave, rough=0.85):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough
    b.inputs['Sheen Weight'].default_value = 0.3 if 'Sheen Weight' in b.inputs else 0
    d = os.path.join(H.DL, 'ph-' + weave)
    nimg = bpy.data.images.load(os.path.join(d, f'{weave}_nor_gl_2k.jpg')); nimg.colorspace_settings.name = 'Non-Color'
    tn = nt.nodes.new('ShaderNodeTexImage'); tn.image = nimg
    nm = nt.nodes.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = 0.8
    nt.links.new(tn.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    return m


def vinyl_mat(name, color):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = 0.42
    return m


M_PILLOW = cloth_mat('pillow_cotton', (0.86, 0.88, 0.9), 'stretch_poplin')
M_FOAM = vinyl_mat('foam_vinyl', (0.035, 0.07, 0.11))


def posed():
    return PL.evaluated(SHd), PL.evaluated(SBd)


def skin_mats(o):
    return H.skin_matrices(arm, o)


def floor_from(objs, P, default=-1.0, look_up=0.06):
    """The surface each point would rest on: the first mattress or support surface met by a ray going down from a little
    above the point (so a support that lies above a part, e.g. the knee pillow over the lower knee, is not its floor)."""
    trees = [MAT_TREE] + [H.bvh(H.world_coords(o), H.quads_of(o)) for o in objs]
    z = np.full(len(P), default)
    for i, p in enumerate(P):
        best = default
        for t in trees:
            hit = t.ray_cast(Vector((p[0], p[1], p[2] + look_up)), Vector((0, 0, -1)), 2.0)
            if hit[0] is not None and hit[1].z > 0.2:
                best = max(best, hit[0].z)
        z[i] = best
    return z


def dent(o, body_pts, body_faces, ring=0.035, sink_extra=0.0, local=None):
    """Press a support's top down to the body's underside (no gap, no pass-through), easing the surface around the dent.
    Only body faces whose middle is above the support's mid-height count (a part lying under the support is not pressing its top)."""
    V = H.get_co(o.data.vertices, len(o.data.vertices))
    zmid = 0.5 * (V[:, 2].min() + V[:, 2].max())
    fz = body_pts[body_faces].mean(1)[:, 2]
    if local is None:
        body_faces = body_faces[fz > zmid]
    tree = H.bvh(body_pts, body_faces)
    newz = V[:, 2].copy(); depth = np.zeros(len(V))
    for i, v in enumerate(V):
        hit = tree.ray_cast(Vector((v[0], v[1], (v[2] - local) if local is not None else max(v[2] - 0.25, zmid))), Vector((0, 0, 1)), 0.6)
        if hit[0] is not None and hit[0].z < v[2] + 0.0005 and hit[1].z < 0:
            newz[i] = hit[0].z - 0.0005 - sink_extra; depth[i] = v[2] - newz[i]
    # ease the rim of the dent
    from scipy.spatial import cKDTree
    pressed = np.nonzero(depth > 0)[0]
    if len(pressed):
        kd = cKDTree(V[pressed, :2])
        d, j = kd.query(V[:, :2])
        fall = np.clip(1 - d / ring, 0, 1) ** 2
        ease = depth[pressed][j] * fall * 0.5
        top = V[:, 2] > np.percentile(V[:, 2], 30)
        newz = np.where(depth > 0, newz, V[:, 2] - ease * top)
    V[:, 2] = newz
    H.set_co(o.data.vertices, V); o.data.update()
    return float(depth.max())


def press_shape(pose, supports, sag=None):
    """press_<pose> on skin_body: undo the flat contact, add sag, press onto the supports, carry back to rest."""
    set_action(pose)
    S = skin_mats(SBd)
    Ph = PL.evaluated(SHd)
    Pb = PL.evaluated(SBd) - H.apply_mats_dir(S, PRESS_FLAT_B)              # the body as posed without the flat pose's contact
    d_sag = np.zeros_like(Pb) if sag is None else sag(Pb, S)
    Pb2 = Pb + d_sag
    fl = floor_from(supports, Pb2) - SINK
    Ns = H.vertex_normals(Pb2, QB)
    not_hand = (labB['hands'] < 0.5)
    Pb3, dz = PL.soft_floor(Pb2, np.ones(len(Pb2)), lambda x, y: fl, depth_soft=0.006, normals=Ns, spread=0.5, E=EB)
    Pb3 = np.where(np.isfinite(Pb3), Pb3, Pb2)
    d_posed = Pb3 - PL.evaluated(SBd)
    Sinv = np.linalg.inv(S[:, :3, :3])
    d_rest = np.einsum('nij,nj->ni', Sinv, d_posed)
    kb = SBd.data.shape_keys.key_blocks
    k = kb.get('press_' + pose) or SBd.shape_key_add(name='press_' + pose, from_mix=False)
    H.set_co(k.data, REST_B + d_rest); k.value = 0.0
    return Ph, Pb3, dz, d_sag


def penetration(points, objs, label):
    """Deepest point of `points` inside the support meshes (rays) and the mattress top (z < 0)."""
    worst = 0.0
    for o in objs:
        V = H.world_coords(o); t = H.bvh(V, H.quads_of(o))
        for p in points[::2]:
            hit = t.ray_cast(Vector((p[0], p[1], p[2])), Vector((0, 0, 1)), 0.5)
            if hit[0] is not None and hit[1].z > 0.2:                         # under an upward-facing support surface
                worst = max(worst, hit[3])
    on_pad = (np.abs(points[:, 0]) < HALF_W) & (np.abs(points[:, 1]) < HALF_L)
    mat = float(max(0.0, -points[on_pad, 2].min())) if on_pad.any() else 0.0
    return worst, mat


# ================================================================ flat: the pillow under the head
set_action('flat')
Ph, Pb = posed()
headpts = Ph[Ph[:, 2] < Ph[:, 2].min() + 0.03]
hc = headpts.mean(0)
pil_V, pil_F, pil_UV = SL.pillow(0.0, hc[1] + 0.04, 0.0, 0.58, 0.40, 0.075)
pil = mesh_obj('pillow_head__flat', pil_V, pil_F, pil_UV, M_PILLOW)
d_flat = dent(pil, np.vstack([Ph, Pb]), np.vstack([QH, QB + len(Ph)]))
REPORT['flat'] = dict(pillowDentMM=d_flat * 1000, headLowestZ=float(Ph[:, 2].min()))
log(f'flat: pillow 580 x 400 mm, 75 mm high; dented {d_flat * 1000:.0f} mm under the head')

# ================================================================ ramped: foam ramp and head rest
set_action('ramped')
Ph, Pb = posed()
Pb_nf = Pb - H.apply_mats_dir(skin_mats(SBd), PRESS_FLAT_B)
torso = (labB['torso'] > 0.5)
yz = Pb_nf[torso][:, 1:]
yb = np.linspace(yz[:, 0].min(), yz[:, 0].max(), 60)
prof = np.array([[0.5 * (a + b), yz[(yz[:, 0] >= a) & (yz[:, 0] < b), 1].min(initial=9)] for a, b in zip(yb[:-1], yb[1:])])
prof = prof[prof[:, 1] < 8]
# lower convex hull of the back profile (y, z): the wedge's top is its edge that spans the raised back
pts = prof[np.argsort(prof[:, 0])]
hull = []
for q in pts:
    while len(hull) >= 2 and np.cross(hull[-1] - hull[-2], q - hull[-2]) <= 0:
        hull.pop()
    hull.append(q)
hull = np.array(hull)
# A: where the back leaves the mattress; B: the top of the upper back (the last hull point of the trunk). The chord
# between them is the wedge's face: the back between sinks into the foam (pressed below), as a heavy trunk does.
low = np.nonzero(hull[:, 1] <= 0.008)[0]
iA = int(low[-1]) if len(low) else 0
iB = len(hull) - 1
A_, B_ = hull[iA], hull[iB]
k_ = np.array([(B_[1] - A_[1]) / (B_[0] - A_[0]), 0.0]); k_[1] = A_[1] - k_[0] * A_[0]
y0 = -k_[1] / k_[0]
y_sh = float(B_[0])
line = lambda y: k_[0] * y + k_[1]
y_top = y_sh + 0.01
h_top = line(y_top) + SINK
y_end = HALF_L - 0.01
log(f'ramped back hull: {len(hull)} points; wedge edge from ({A_[0]:.3f}, {A_[1]:.3f}) to ({B_[0]:.3f}, {B_[1]:.3f})')
prof_r = SL.rounded_polygon([(y0 - 0.02, 0.0), (y_top, h_top), (y_end, h_top), (y_end, 0.0)], 0.03, n=6)
ramp_V, ramp_F, ramp_UV = SL.foam_profile_solid(prof_r[:, ::1], HALF_W - 0.012, n_x=24, r_edge=0.02)
ramp = mesh_obj('support_ramp__ramped', ramp_V, ramp_F, ramp_UV, M_FOAM)
ang = math.degrees(math.atan(k_[0]))
log(f'ramped: ramp from y {y0:.3f} (on the mattress) up {ang:.1f} deg to {h_top * 1000:.0f} mm at y {y_top:.3f}, then level to the head end')
# head rest on the ramp's top: from the ramp top to the back of the head
head_low = Ph[:, 2].min(); hc = Ph[Ph[:, 2] < head_low + 0.02].mean(0)
hr_th = max(0.03, head_low - h_top + SINK + 0.02)
hr_V, hr_F, hr_UV = SL.pillow(0.0, hc[1], h_top - 0.002, 0.34, 0.26, hr_th, p=6.0, crown=0.4)
head_rest = mesh_obj('support_head__ramped', hr_V, hr_F, hr_UV, M_FOAM)
REPORT['ramped'] = dict(rampAngleDeg=ang, rampStartY=float(y0), rampTopMM=h_top * 1000, headRestThickMM=hr_th * 1000)
Ph_r, Pb_r, dz_r, _ = press_shape('ramped', [ramp, head_rest])
REPORT['ramped']['pressDepthMaxMM'] = float(dz_r.max() * 1000)
d1 = dent(ramp, np.vstack([Ph_r, Pb_r]), np.vstack([QH, QB + len(Ph_r)]), local=0.07)
d2 = dent(head_rest, np.vstack([Ph_r, Pb_r]), np.vstack([QH, QB + len(Ph_r)]))
REPORT['ramped'].update(rampDentMM=d1 * 1000, headRestDentMM=d2 * 1000)
log(f'ramped: head rest {hr_th * 1000:.0f} mm; body pressed up to {dz_r.max() * 1000:.1f} mm; ramp dented {d1 * 1000:.0f} mm, head rest {d2 * 1000:.0f} mm')

# ================================================================ lateral_left: head pillow and knee pillow
set_action('lateral_left')
Ph, Pb = posed()
head_low = Ph[:, 2].min(); hc = Ph.mean(0)
ph_th = max(0.08, head_low + SINK + 0.03)
hy0 = Ph[:, 1].min()                                              # the lowest point of the head along the body (chin or neck side)
lp_V, lp_F, lp_UV = SL.pillow(float(Ph[:, 0].mean()) - 0.02, max(hy0 + 0.17, Ph[:, 1].max() - 0.18), 0.0, 0.40, 0.38, ph_th, crown=0.8)   # under the head only: the left hand rests in front of it
pil_l = mesh_obj('pillow_head__lateral_left', lp_V, lp_F, lp_UV, M_PILLOW)
wL = PL.group_w(SBd, {n + '.L' for n in ('upperleg01', 'upperleg02', 'lowerleg01', 'lowerleg02')}) > 0.5
wR = PL.group_w(SBd, {n + '.R' for n in ('upperleg01', 'upperleg02', 'lowerleg01', 'lowerleg02')}) > 0.5
kneeL = np.array(P['lowerleg01.L'].head); kneeR = np.array(P['lowerleg01.R'].head)
kc = 0.5 * (kneeL + kneeR)
nearL = wL & (np.linalg.norm(Pb[:, :2] - kneeL[:2], axis=1) < 0.12); nearR = wR & (np.linalg.norm(Pb[:, :2] - kneeR[:2], axis=1) < 0.12)
zl_top = Pb[nearL, 2].max(); zr_bot = Pb[nearR, 2].min()
k_th = max(0.06, zr_bot - zl_top + 2 * SINK)
log(f'lateral knees: lower knee top {zl_top:.3f}, upper knee underside {zr_bot:.3f}: pillow {k_th * 1000:.0f} mm')
kp_V, kp_F, kp_UV = SL.pillow(kc[0], kc[1], zl_top - SINK, 0.34, 0.30, k_th, crown=0.9)
pil_k = mesh_obj('pillow_knees__lateral_left', kp_V, kp_F, kp_UV, M_PILLOW)


def belly_sag(Pb, S):
    """Lying on the left side the front of the belly and chest falls toward the mattress (-Z)."""
    rest = REST_B
    front = rest[:, 2]                                           # rest frame: +Z is the front (supine)
    t = labB['torso']
    zf = np.clip((front - 0.20) / 0.20, 0, 1)                     # only the part well in front of the back
    sag = np.zeros_like(Pb)
    sag[:, 2] = -0.045 * zf * t
    return H.smooth_field(sag, EB, n_iter=10, lam=0.5)


Ph_l, Pb_l, dz_l, sag_l = press_shape('lateral_left', [pil_l, pil_k], sag=belly_sag)
d3 = dent(pil_l, np.vstack([Ph_l, Pb_l]), np.vstack([QH, QB + len(Ph_l)]))
# the knee pillow: the lower knee pushes it up from below as the upper knee pushes down; dent its top only
d4 = dent(pil_k, np.vstack([Ph_l, Pb_l]), np.vstack([QH, QB + len(Ph_l)]))
REPORT['lateral_left'] = dict(headPillowMM=ph_th * 1000, headPillowDentMM=d3 * 1000, kneePillowDentMM=d4 * 1000, bellySagMaxMM=float(np.abs(sag_l[:, 2]).max() * 1000),
                              pressDepthMaxMM=float(dz_l.max() * 1000))
log(f'lateral_left: head pillow {ph_th * 1000:.0f} mm, dented {d3 * 1000:.0f} mm; knee pillow dented {d4 * 1000:.0f} mm; belly sag up to {np.abs(sag_l[:, 2]).max() * 1000:.0f} mm; pressed up to {dz_l.max() * 1000:.1f} mm')
for o in [pil, ramp, head_rest, pil_l, pil_k]:
    for p in o.data.polygons:
        p.use_smooth = True
H.save_json(os.path.join(WORK, 'contact.json'), REPORT)
set_action('flat')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_contact.blend'))
log('SAVED p25_contact.blend')
