"""p25_01_form.py: the form of the hero patient p25 on the MakeHuman carrier.
   BLENDER_USER_RESOURCES=~/Developer/overlord-asset-sources/people/blender-user \
     Blender -b --factory-startup --python tools/people/hero/p25_01_form.py -- [--stage all|probe]
What it does (details in the comments of each step):
 1. The carrier: MakeHuman base mesh (CC0, MPFB 2.0.18) with p25's macros and the face targets of his earlier spec, at an
    ordinary build so that the skeleton fitted to it is a normal man's skeleton of his height, plus the default rig
    without toes.
 2. The body form: MHR (Meta's Momentum Human Rig, Apache-2.0), a body model built from scans, at an identity of heavy
    build (body coefficients chosen below). MakeHuman's limbs are first turned to MHR's arm and leg directions, MHR is
    warped onto MakeHuman's joints (thin-plate warp), and MakeHuman's surface is wrapped onto MHR's average body
    (non-rigid ICP). The wrap gives every MakeHuman vertex a place on MHR's surface; the same places on the heavy MHR
    body are the new body. The heavy amount is searched until the mesh volume gives the chart weight (see VOLUME).
 3. The head form: MakeHuman's head and neck wrapped onto the Blender Studio "Body Male - Realistic" sculpt (CC0, scan
    derived) by face-landmark-guided non-rigid ICP (the study's method), brought back to MakeHuman's head size, then
    p25's identity added on top (identity.json), then MHR's heavy-minus-average face (full cheeks, jowls, submental fat).
 4. The neck is fitted to the chart's 49 cm circumference at the cricoid level.
 5. Saves form.npz (positions of every MakeHuman base vertex, metres, standing frame, MHR's arm pose) and pictures."""
import bpy, os, sys, json, math
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Matrix, Vector, Quaternion
import hero_lib as H
import pp_common as PC, pp_body as PB
import nicp

A = H.args_after_dashes()
STAGE = A[A.index('--stage') + 1] if '--stage' in A else 'all'
WORK = H.patient_work('p25')
OUT = os.path.join(WORK, 'form'); os.makedirs(OUT, exist_ok=True)
log = H.Log('form')
SPEC = json.load(open(os.path.join(H.PEOPLE, 'work', 'build', 'p25.spec.json')))
CHART = dict(height=1.78, weight=139.4, neck_circ=0.49)
# ---- VOLUME: what mesh volume 139.4 kg should have.
# The study and the earlier pipeline used 1010 kg/m3 for every body. A man of BMI 44 is about 40 to 45 % fat; fat is
# 0.90 g/cm3 and fat-free mass 1.10, so by Siri's two-compartment relation his tissue averages 495 / (42 + 450) = 1.006
# g/cm3. The mesh also holds the air in his lungs, which tissue density leaves out: at the end of a quiet breath (the
# rest shape) a man of BMI 44 holds about 2.0 L (functional residual capacity is reduced in class III obesity).
# Volume = 139.4 / 1006 + 0.0020 = 0.1406 m3. Reported both ways in p25.json.
FAT_FRACTION, TISSUE_DENSITY, LUNG_AIR = 0.42, 495.0 / (42.0 + 450.0) * 1000.0, 0.0020
VOLUME_TARGET = CHART['weight'] / TISSUE_DENSITY + LUNG_AIR
# MHR body coefficients (identity shapes 0..19 are body; 20..39 head; 40..44 hands). shape_0 is overall adiposity,
# searched below; shape_1 negative moves fat from hips and thighs to the abdomen and chest (a man's, "android" pattern,
# seen in the probe renders); shape_2 a little more abdominal depth.
MHR_FIXED = {'shape_1': -1.8, 'shape_2': 1.0}

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
M = PC.mpfb()

# ================================================================== 1. carrier
macros = dict(SPEC['macros'])
macros['weight'] = 0.62          # ordinary build: the skeleton is fitted to this, the obese surface comes from step 2
macros['muscle'] = 0.45
bm = M.Human.create_human(mask_helpers=False, detailed_helpers=True, extra_vertex_groups=True, feet_on_ground=False, scale=0.1, macro_detail_dict=macros)
bm.name = 'carrier'
spec_keys = []
for name, w in SPEC.get('targets', []):
    path = os.path.join(M.system_targets, name + '.target.gz')
    if not os.path.exists(path):
        path = os.path.join(PC.USERDATA, 'targets', name + '.target')
    k = M.Target.load_target(bm, path, weight=0.0)
    k.slider_min, k.slider_max = -2.0, 3.0
    spec_keys.append((k.name, float(w)))
inbody, quads, fuv = PB.body_topology(bm)
co_notargets = PC.mixed_coords(bm)
for kn, w in spec_keys:
    bm.data.shape_keys.key_blocks[kn].value = w
co_spec = PC.mixed_coords(bm)
# the race part of the earlier p25 face, kept as an offset so that the new face keeps his broad nose and full lips:
# the same person with the race macro set to 'caucasian', subtracted from him as built.
try:
    M.Props.set_value('african', 0.0, entity_reference=bm); M.Props.set_value('caucasian', 1.0, entity_reference=bm); M.Props.set_value('asian', 0.0, entity_reference=bm)
    M.Target.reapply_macro_details(bm)
    co_cauc = PC.mixed_coords(bm)
    M.Props.set_value('african', 0.85, entity_reference=bm); M.Props.set_value('caucasian', 0.15, entity_reference=bm)
    M.Target.reapply_macro_details(bm)
    race_ok = True
except Exception as e:
    log('race macro could not be switched:', e); co_cauc = co_spec.copy(); race_ok = False
co_back = PC.mixed_coords(bm)
log(f'race offset available: {race_ok}; largest race offset {np.linalg.norm(co_spec - co_cauc, axis=1).max():.4f} MH units; restored error {np.abs(co_back - co_spec).max():.2e}')
M.Target.bake_targets(bm)
H.set_co(bm.data.vertices, co_spec); bm.data.update()
z = co_spec[inbody, 2]
S = CHART['height'] / (z.max() - z.min()); z0 = z.min()
co_m = co_spec * S; co_m[:, 2] -= z0 * S
race_m = (co_spec - co_cauc) * S
specid_m = (co_spec - co_notargets) * S          # the earlier spec's face targets, as offsets
H.set_co(bm.data.vertices, co_m); bm.data.update()
log(f'carrier: {len(co_m)} vertices ({int(inbody.sum())} body), {len(quads)} body quads; scaled x{S:.4f} to {CHART["height"]} m; volume {abs(H.volume(co_m, quads)) * 1000:.1f} L')
arm = M.Human.add_builtin_rig(bm, 'default_no_toes')
arm.name = 'rig'
bpy.context.view_layer.update()
P = arm.pose.bones
for pb in P:
    pb.rotation_mode = 'QUATERNION'
mh_j = {b.name: np.array(arm.matrix_world @ b.head_local) for b in arm.data.bones}
log('carrier joints (m): shoulder L', mh_j['upperarm01.L'].round(3), 'elbow', mh_j['lowerarm01.L'].round(3), 'wrist', mh_j['wrist.L'].round(3), 'hip', mh_j['upperleg01.L'].round(3), 'knee', mh_j['lowerleg01.L'].round(3), 'ankle', mh_j['foot.L'].round(3))

# ================================================================== 2a. MHR
before = set(bpy.data.objects)
bpy.ops.wm.fbx_import(filepath=os.path.join(H.MHR_DIR, 'lod1.fbx'))
new = [o for o in bpy.data.objects if o not in before]
marm = next(o for o in new if o.type == 'ARMATURE'); mme = next(o for o in new if o.type == 'MESH')
for o in new:
    if o.type == 'EMPTY':
        bpy.data.objects.remove(o, do_unlink=True)
mkb = mme.data.shape_keys.key_blocks
for k in mkb[1:]:
    k.slider_min, k.slider_max = -10.0, 10.0; k.value = 0.0
mme.modifiers.clear()                     # MHR's own skinning is not used: its rest pose is what is wrapped
bpy.context.view_layer.update()
MF = np.array([list(p.vertices) for p in mme.data.polygons], np.int32)
mw = np.array(mme.matrix_world)
mbasis = H.get_co(mkb[0].data, len(mkb[0].data))
mdelta = {k.name: H.get_co(k.data, len(k.data)) - mbasis for k in mkb[1:46]}


def mhr_world(coefs):
    c = mbasis.copy()
    for n, v in coefs.items():
        c = c + v * mdelta[n]
    return c @ mw[:3, :3].T + mw[:3, 3]


MV0 = mhr_world({})
mj = {b.name: np.array(marm.matrix_world @ b.head_local) for b in marm.data.bones}
mt = {b.name: np.array(marm.matrix_world @ b.tail_local) for b in marm.data.bones}
log(f'MHR lod1: {len(MV0)} vertices, {len(MF)} triangles; height {np.ptp(MV0[:, 2]):.3f} m; l_uparm head {mj["l_uparm"].round(3)} (left is +x: {mj["l_uparm"][0] > 0})')
PAIRS = [('upperarm01.{s}', '{m}_uparm'), ('lowerarm01.{s}', '{m}_lowarm'), ('wrist.{s}', '{m}_wrist'), ('finger3-1.{s}', '{m}_middle1'),
         ('upperleg01.{s}', '{m}_upleg'), ('lowerleg01.{s}', '{m}_lowleg'), ('foot.{s}', '{m}_foot'), ('toe1-1.{s}', '{m}_ball'), ('clavicle.{s}', '{m}_clavicle')]
pairs = []
for a_, b_ in PAIRS:
    for s, m in (('L', 'l'), ('R', 'r')):
        pairs.append((a_.format(s=s), b_.format(m=m)))
pairs += [('neck01', 'c_neck'), ('head', 'c_head')]
for a_, b_ in pairs:
    log(f'   joint {a_:>14s} MH {mh_j[a_].round(3)}   MHR {b_:>12s} {mj[b_].round(3)}')
if STAGE == 'probe':
    raise SystemExit(0)

# ================================================================== 2b. wrap the carrier onto MHR's average body
SM = CHART['height'] / np.ptp(MV0[:, 2])                   # MHR scaled uniformly to his height
mz0 = MV0[:, 2].min()
def mhr_m(coefs):
    V = mhr_world(coefs); V = V * SM; V[:, 2] -= mz0 * SM; return V
MVm = mhr_m({})
mjm = {k: (v * SM - np.array([0, 0, mz0 * SM])) for k, v in mj.items()}
lab = PB.segment_labels(bm)
hands = PC.group_weights(bm, {n + s for n in PB.HAND_BONES for s in ('.L', '.R')})
feet = PC.group_weights(bm, {n + s for n in ('foot', 'toe1-1') for s in ('.L', '.R')})
headw = lab['head']
# control points for the thin-plate start: limb joints, their mid-bones, the top of the head, the soles
src_c, dst_c = [], []
for a_, b_ in pairs:
    if a_.startswith(('neck', 'head', 'clavicle')):
        continue
    src_c.append(mh_j[a_]); dst_c.append(mjm[b_])
for s, m in (('L', 'l'), ('R', 'r')):
    for (a1, a2), (b1, b2) in ((('upperarm01', 'lowerarm01'), ('uparm', 'lowarm')), (('lowerarm01', 'wrist'), ('lowarm', 'wrist')), (('upperleg01', 'lowerleg01'), ('upleg', 'lowleg')), (('lowerleg01', 'foot'), ('lowleg', 'foot'))):
        src_c.append(0.5 * (mh_j[f'{a1}.{s}'] + mh_j[f'{a2}.{s}'])); dst_c.append(0.5 * (mjm[f'{m}_{b1}'] + mjm[f'{m}_{b2}']))
top_s = co_m[inbody][np.argmax(co_m[inbody, 2])]; top_t = MVm[np.argmax(MVm[:, 2])]
src_c.append(np.array([0, top_s[1], top_s[2]])); dst_c.append(np.array([0, top_t[1], top_t[2]]))
# pelvis and shoulder-girdle centres
src_c.append(0.5 * (mh_j['upperleg01.L'] + mh_j['upperleg01.R'])); dst_c.append(0.5 * (mjm['l_upleg'] + mjm['r_upleg']))
src_c.append(0.5 * (mh_j['upperarm01.L'] + mh_j['upperarm01.R'])); dst_c.append(0.5 * (mjm['l_uparm'] + mjm['r_uparm']))
tps = H.tps_fit(np.array(src_c), np.array(dst_c), reg=1e-5)
co_tps = tps(co_m)
bidx = np.nonzero(inbody)[0]
loc_of = -np.ones(len(co_m), int); loc_of[bidx] = np.arange(len(bidx))
Fb = loc_of[quads]
Vb0 = co_tps[bidx]
tree_mean = nicp.bvh(MVm, MF)
# cavities of MakeHuman's head that MHR closes with membranes (mouth, sockets): stiffness only there
Nb = nicp.vertex_normals(Vb0, Fb)
tree_b = nicp.bvh(Vb0, Fb)
cav = np.zeros(len(Vb0), bool)
for i in np.nonzero(headw[bidx] > 0.5)[0]:
    hit = tree_b.ray_cast(Vector(Vb0[i] + Nb[i] * 0.0015), Vector(Nb[i]), 0.035)[0]
    cav[i] = hit is not None
dmask = (1.0 - np.clip(hands[bidx] + feet[bidx], 0, 1)) * (~cav)
log(f'wrap onto MHR average body: {len(bidx)} vertices, {int((dmask > 0.5).sum())} pulled to the surface ({int(cav.sum())} cavity, {int((hands[bidx] + feet[bidx] > 0.5).sum())} hand and foot vertices follow by stiffness)')
Wm = nicp.wrap(Vb0, Fb, tree_mean, data_mask=dmask, stiffness=(80, 40, 20, 10, 5, 2.5, 1.2, 0.6), lm_weight=(0, 0, 0, 0, 0, 0, 0, 0), inner=4, max_dist=0.08, min_dot=0.2, log=log)
U_, Nt_, dist_ = nicp.closest(tree_mean, Wm)
ok = dmask > 0.5
log(f'RESULT wrap onto MHR: distance mean {dist_[ok].mean() * 1000:.2f} mm, 95th {np.percentile(dist_[ok], 95) * 1000:.2f} mm, max {dist_[ok].max() * 1000:.1f} mm')
# the place on MHR's surface of every body vertex: triangle and barycentric coordinates (plus the remaining offset)
binding = H.bind_to_surface(Wm, MVm, MF)
np.savez_compressed(os.path.join(OUT, 'wrap_mhr.npz'), Wm=Wm, bidx=bidx, tri=binding[0], bc=binding[1], off=binding[2], cav=cav, dmask=dmask)

far = ok & (dist_ > 0.01)
if far.any():
    zs = Wm[far, 2]
    log('vertices still over 10 mm from MHR, by height band:', np.histogram(zs, bins=[0, 0.3, 0.6, 0.9, 1.2, 1.4, 1.55, 1.8])[0].tolist())

# ================================================================== 2c. the heavy body at the same places on MHR
def heavy_body(s0):
    coefs = dict(MHR_FIXED); coefs['shape_0'] = s0
    V = mhr_m(coefs)
    return H.eval_binding(V, MF, binding, use_offset=False), V
MVh0 = None


def show(objs_spec, path, views=(('front', (0, -1, 0)), ('side', (-1, 0, 0)), ('three', (-0.7, -0.7, 0.1))), size=(1400, 1200), centre=(0, 0, 0.92), ortho=2.1):
    """Clay pictures of a few meshes side by side (each spec: (V, F, x offset))."""
    obs = []
    mat = H.clay('clay')
    for V, F, dx in objs_spec:
        o = H.new_mesh('show', np.asarray(V) + np.array([dx, 0, 0]), [tuple(f if f[-1] != f[-2] else f[:-1]) for f in np.asarray(F)])
        o.data.materials.append(mat); obs.append(o)
    hidden = [o for o in scene.objects if o.type in ('MESH', 'ARMATURE') and o not in obs]
    for o in hidden:
        o.hide_render = True
    H.use_gpu(scene, 24); scene.view_settings.view_transform = 'AgX'
    lights = H.studio(scene, Vector(centre), strength=1.0, world=0.3)
    cam = bpy.data.cameras.new('c'); co_ = bpy.data.objects.new('c', cam); scene.collection.objects.link(co_); scene.camera = co_
    cam.type = 'ORTHO'; cam.ortho_scale = ortho
    files = []
    for nm, d in views:
        H.look(co_, Vector(centre) + Vector(d) * 6, Vector(centre))
        f = path + f'_{nm}.png'; H.render(scene, f, *size); files.append(f)
    for o in obs + lights + [co_]:
        bpy.data.objects.remove(o, do_unlink=True)
    for o in hidden:
        o.hide_render = False
    return files


if STAGE == 'wrapcheck':
    hb, _ = heavy_body(2.6)
    show([(co_m[bidx], Fb, -1.2), (Wm, Fb, 0.0), (hb, Fb, 1.2)], os.path.join(OUT, 'check_wrap'), size=(1800, 1000), ortho=3.6)
    raise SystemExit(0)

# ================================================================== 3. the head: carrier wrapped onto the scan-derived sculpt
import subprocess
from scipy.spatial import Delaunay, cKDTree
T = np.load(os.path.join(H.HBM_CACHE, 'hbm_male_L2.npz')); TV, TF = T['V'].astype(np.float64), T['F']
E = np.load(os.path.join(H.HBM_CACHE, 'hbm_male_eyes.npz'))
tree_t = nicp.bvh(TV, TF)
src = co_m.copy()                                            # carrier, metres, standing
SKIN = (0.72, 0.52, 0.42)


def mesh_obj(name, V, F, color):
    ob = H.new_mesh(name, V, [tuple(f) if f[-1] != f[-2] else tuple(f[:-1]) for f in F])
    ob.data.materials.append(H.clay(name, color, 0.55))
    return ob


o_src = mesh_obj('src_body', src[bidx], Fb, SKIN)
o_tgt = mesh_obj('tgt_body', TV, TF, SKIN)
o_tgt_eyes = [mesh_obj('tgt_eye' + s, E['V' + s].astype(np.float64), E['F' + s], (0.85, 0.85, 0.85)) for s in ('L', 'R')]
# the carrier's own eyes for its render (MakeHuman 'high-poly' eyes, fitted to the carrier)
eyes_path = M.Asset.find_asset_absolute_path('high-poly/high-poly.mhclo', 'eyes')
o_mh_eyes = M.Human.add_mhclo_asset(eyes_path, bm, asset_type='Eyes', subdiv_levels=0, material_type='MAKESKIN')
for m_ in list(o_mh_eyes.modifiers):
    o_mh_eyes.modifiers.remove(m_)
src_eyeV = H.world_coords(o_mh_eyes)
o_src_eye = mesh_obj('src_eye', src_eyeV, H.quads_of(o_mh_eyes), (0.85, 0.85, 0.85))
bpy.data.objects.remove(o_mh_eyes, do_unlink=True)
for o in list(scene.objects):
    if o not in (o_src, o_src_eye, o_tgt, *o_tgt_eyes) and o.type in ('MESH', 'ARMATURE'):
        o.hide_render = True
H.use_gpu(scene, 32); scene.view_settings.view_transform = 'Standard'
cam = bpy.data.cameras.new('c'); co_ = bpy.data.objects.new('c', cam); scene.collection.objects.link(co_); scene.camera = co_
cam.type = 'ORTHO'; ORTHO = 0.30; cam.ortho_scale = ORTHO; RES = 1024
hc_s = np.array([0.0, 0.0, src[inbody, 2].max() - 0.118]); hc_t = np.array([0.0, 0.0, TV[:, 2].max() - 0.118])
lights = H.studio(scene, Vector(hc_t), strength=0.20, world=0.5)


def shot(which, hc, path):
    for o in (o_src, o_src_eye):
        o.hide_render = which != 'src'
    for o in (o_tgt, *o_tgt_eyes):
        o.hide_render = which != 'tgt'
    H.look(co_, Vector(hc) + Vector((0, -1.0, 0)), Vector(hc))
    H.render(scene, path, RES, RES)


shot('src', hc_s, os.path.join(OUT, 'lm_src.png')); shot('tgt', hc_t, os.path.join(OUT, 'lm_tgt.png'))
for nm in ('src', 'tgt'):
    r = subprocess.run([H.UV_BIN, 'run', '--python', '3.12', '--with', 'mediapipe==0.10.14', '--with', 'numpy', '--with', 'pillow', 'python', '-I',
                        os.path.join(H.HERE, 'facemesh_detect.py'), os.path.join(OUT, f'lm_{nm}.png'), os.path.join(OUT, f'lm_{nm}.json')], capture_output=True, text=True, cwd=OUT)
    log('detector:', r.stdout.strip().split('\n')[-1] if r.stdout.strip() else r.stderr.strip()[-300:])
Ls, Lt = json.load(open(os.path.join(OUT, 'lm_src.json'))), json.load(open(os.path.join(OUT, 'lm_tgt.json')))
if not (Ls['found'] and Lt['found']):
    raise SystemExit('face landmarks were not found on one of the renders')
ps, pt = np.array(Ls['points'])[:, :2], np.array(Lt['points'])[:, :2]
px_to_xz = lambda p, hc: np.stack([hc[0] + (p[:, 0] / RES - 0.5) * ORTHO, hc[2] + (0.5 - p[:, 1] / RES) * ORTHO], 1)
xz_to_px = lambda xz, hc: np.stack([((xz[:, 0] - hc[0]) / ORTHO + 0.5) * RES, (0.5 - (xz[:, 1] - hc[2]) / ORTHO) * RES], 1)
tree_s = nicp.bvh(src, quads)
Ns = nicp.vertex_normals(src, quads)
tri2d = Delaunay(ps)
q_px = xz_to_px(src[bidx][:, [0, 2]], hc_s)
simp = tri2d.find_simplex(q_px)
cand = bidx[(simp >= 0) & (Ns[bidx, 1] < -0.25) & (src[bidx, 2] > hc_s[2] - 0.16)]
vis = []
for i in cand:
    loc = tree_s.ray_cast(Vector((src[i, 0], -1.0, src[i, 2])), Vector((0, 1, 0)))[0]
    vis.append(loc is not None and abs(loc.y - src[i, 1]) < 0.002)
cand = cand[np.array(vis)]
q_px = xz_to_px(src[cand][:, [0, 2]], hc_s); simp = tri2d.find_simplex(q_px)
Tm = tri2d.transform[simp]; b2 = np.einsum('nij,nj->ni', Tm[:, :2], q_px - Tm[:, 2]); bary = np.c_[b2, 1 - b2.sum(1)]
t_xz = px_to_xz(np.einsum('nk,nkj->nj', bary, pt[tri2d.simplices[simp]]), hc_t)
lm_i, lm_p = [], []
for i, xz in zip(cand, t_xz):
    loc = tree_t.ray_cast(Vector((xz[0], -1.0, xz[1])), Vector((0, 1, 0)))[0]
    if loc is not None:
        lm_i.append(i); lm_p.append(tuple(loc))
lm_i = np.array(lm_i); lm_p = np.array(lm_p)
log(f'dense face correspondences from the 478 detected landmarks: {len(lm_i)} carrier vertices')
A_, B_ = src[lm_i], lm_p
ca, cb = A_.mean(0), B_.mean(0)
U_, s_, Vt_ = np.linalg.svd((A_ - ca).T @ (B_ - cb))
Rs = (U_ @ np.diag([1, 1, np.sign(np.linalg.det(U_ @ Vt_))]) @ Vt_).T
sc = s_.sum() / ((A_ - ca) ** 2).sum()
log(f'pre-alignment carrier -> sculpt: scale {sc:.4f}, rotation {np.degrees(np.arccos(np.clip((np.trace(Rs) - 1) / 2, -1, 1))):.2f} deg')
z_neck = mh_j['neck01'][2]
region = inbody & (src[:, 2] > z_neck - 0.07) & (np.abs(src[:, 0]) < 0.17)
ridx = np.nonzero(region)[0]
rloc = -np.ones(len(src), int); rloc[ridx] = np.arange(len(ridx))
Fr = rloc[quads[region[quads].all(1)]]
Vr = (src[ridx] - ca) @ Rs.T * sc + cb
Nr = nicp.vertex_normals(Vr, Fr); tree_r = nicp.bvh(Vr, Fr)
cavh = np.zeros(len(Vr), bool)
for i in range(len(Vr)):
    cavh[i] = tree_r.ray_cast(Vector(Vr[i] + Nr[i] * 0.0015), Vector(Nr[i]), 0.035)[0] is not None
keep = rloc[lm_i] >= 0
Wh = nicp.wrap(Vr, Fr, tree_t, landmarks=(rloc[lm_i][keep], lm_p[keep]), data_mask=(~cavh).astype(float), log=log)
_, _, dh = nicp.closest(tree_t, Wh)
log(f'RESULT head wrap: mean {dh[~cavh].mean() * 1000:.3f} mm, median {np.median(dh[~cavh]) * 1000:.3f} mm, 95th {np.percentile(dh[~cavh], 95) * 1000:.3f} mm')
# back to the carrier's head size and place
Wh_c = ((Wh - cb) / sc) @ Rs + ca
eyes_c = {s: ((E['V' + s].astype(np.float64) - cb) / sc) @ Rs + ca for s in ('L', 'R')}
for o in (o_src, o_src_eye, o_tgt, *o_tgt_eyes, co_, *lights):
    bpy.data.objects.remove(o, do_unlink=True)
for o in scene.objects:
    o.hide_render = False
np.savez_compressed(os.path.join(OUT, 'wrap_head.npz'), Wh_c=Wh_c, ridx=ridx, cav=cavh, lm_i=lm_i, lm_p=lm_p, sc=sc, Rs=Rs, ca=ca, cb=cb, eyeL=eyes_c['L'], eyeR=eyes_c['R'], eyeFL=E['FL'], eyeFR=E['FR'])

# ================================================================== 4. identity, fat, blend, volume, neck
def target_delta(name):
    path = os.path.join(M.system_targets, name + '.target.gz')
    if not os.path.exists(path):
        path = os.path.join(PC.USERDATA, 'targets', name + '.target')
    k = M.Target.load_target(bm, path, weight=0.0, name='t:' + name)
    kb = bm.data.shape_keys.key_blocks
    d = H.get_co(k.data, len(k.data)) - H.get_co(kb[0].data, len(kb[0].data))
    bm.shape_key_remove(k)
    return d * S


IDENT = json.load(open(os.path.join(H.HERE, 'p25_identity.json')))
ident_off = specid_m * IDENT.get('spec_targets_share', 1.0) + race_m * IDENT['race_offset_share']
for name, w in IDENT['targets']:
    ident_off = ident_off + w * target_delta(name)
if bm.data.shape_keys:
    bm.shape_key_clear()
# the race macro and some targets also move or tilt the whole head (body proportions change with them): only the change
# of shape is wanted, so the best rigid motion of the head region is taken out of the offsets
Pp, Qq = src[ridx], src[ridx] + ident_off[ridx]
cp, cq = Pp.mean(0), Qq.mean(0)
U_, s_, Vt_ = np.linalg.svd((Pp - cp).T @ (Qq - cq))
Rr = (U_ @ np.diag([1, 1, np.sign(np.linalg.det(U_ @ Vt_))]) @ Vt_).T
rigid = (src - cp) @ Rr.T + cq - src
log(f'identity offsets: rigid part taken out: shift {1000 * np.linalg.norm(cq - cp):.1f} mm, turn {np.degrees(np.arccos(np.clip((np.trace(Rr) - 1) / 2, -1, 1))):.2f} deg')
ident_off = ident_off - rigid
headbase = src.copy(); headbase[ridx] = Wh_c
headbase = headbase + ident_off * region[:, None]


def bump(V, centre, radius, vec, mask):
    r = np.linalg.norm(V - np.asarray(centre), axis=1); f = np.exp(-(r / radius) ** 2) * mask
    return V + f[:, None] * np.asarray(vec)


for b in IDENT['asymmetry']:
    c = headbase[b['vertex']] + np.array(b.get('offset', [0, 0, 0]))
    headbase = bump(headbase, c, b['radius'], np.array(b['move']) * 0.001, region.astype(float))
log(f'identity: {len(IDENT["targets"])} targets, race offset share {IDENT["race_offset_share"]}, {len(IDENT["asymmetry"])} asymmetries; nose tip moved {1000 * np.linalg.norm(headbase[297] - Wh_c[rloc[297]]):.1f} mm from the sculpt')
# carrier frame -> MHR frame for the head: similarity fitted on the head's outer surface
Wm_full = co_tps.copy(); Wm_full[bidx] = Wm
hsel = np.nonzero(region & (headw > 0.5))[0]
hsel = hsel[~cavh[rloc[hsel]]]
A_, B_ = src[hsel], Wm_full[hsel]
ca2, cb2 = A_.mean(0), B_.mean(0)
U_, s_, Vt_ = np.linalg.svd((A_ - ca2).T @ (B_ - cb2))
R2 = (U_ @ np.diag([1, 1, np.sign(np.linalg.det(U_ @ Vt_))]) @ Vt_).T
sc2 = s_.sum() / ((A_ - ca2) ** 2).sum()
to_mhr = lambda X: (X - ca2) @ R2.T * sc2 + cb2
log(f'head carrier -> body frame: scale {sc2:.4f} (kept 1.0: the head keeps the carrier\'s size), shift {(cb2 - ca2).round(4)}')
to_mhr = lambda X: (X - ca2) @ R2.T + cb2
head_mhr = to_mhr(headbase)
# blend weight: the sculpt head above the jaw, MHR's neck below, over the neck
zc = src[:, 2]
z_lo, z_hi = mh_j['neck01'][2] - 0.01, mh_j['head'][2] - 0.005
t = np.clip((zc - z_lo) / (z_hi - z_lo), 0, 1); w_h = t * t * (3 - 2 * t) * region
# fat: heavy minus average MHR at every vertex's place; carried smoothly into hands, feet and the cavities
mean_at = H.eval_binding(MVm, MF, binding, use_offset=False)
def delta_for(coefs):
    V = mhr_m(coefs); return H.eval_binding(V, MF, binding, use_offset=False) - mean_at
D1 = delta_for({'shape_0': 1.0})
DF = delta_for(MHR_FIXED)
E_b = H.edges_of(Fb)
fixed = dmask > 0.5
D1s = H.smooth_field(D1, E_b, n_iter=60, keep=fixed, lam=0.8)
DFs = H.smooth_field(DF, E_b, n_iter=60, keep=fixed, lam=0.8)
D1f = np.zeros_like(src); D1f[bidx] = D1s
DFf = np.zeros_like(src); DFf[bidx] = DFs
# little fat on the cranium: MHR's heavy shape also enlarges the back and top of the head, which fat does not do
z_eye = 0.5 * (mh_j['eye.L'][2] + mh_j['eye.R'][2])
tc = np.clip((src[:, 2] - (z_eye - 0.01)) / 0.06, 0, 1); crown = (tc * tc * (3 - 2 * tc)) * region
dscale = 1.0 - 0.75 * crown
D1f *= dscale[:, None]; DFf *= dscale[:, None]
base_f = (1 - w_h)[:, None] * Wm_full + w_h[:, None] * head_mhr


def body_at(s0):
    return base_f + s0 * D1f + DFf


# volume with every opening of the skin closed (eye openings): fan caps on boundary loops
def boundary_loops(F):
    e = np.concatenate([F[:, [k, (k + 1) % 4]] for k in range(4)]); e = e[e[:, 0] != e[:, 1]]
    key = np.sort(e, 1); u, inv, cnt = np.unique(key, axis=0, return_inverse=True, return_counts=True)
    bnd = e[cnt[inv.ravel()] == 1]
    nxt = {a: b for a, b in bnd}
    loops, seen = [], set()
    for a in nxt:
        if a in seen:
            continue
        loop = [a]; seen.add(a); b = nxt[a]
        while b != a and b not in seen and b in nxt:
            loop.append(b); seen.add(b); b = nxt[b]
        loops.append(loop)
    return loops


LOOPS = boundary_loops(quads)
log(f'skin openings: {len(LOOPS)} boundary loops of {[len(l) for l in LOOPS]} edges')


def closed_volume(V):
    v = abs(H.volume(V, quads))
    T = H.tris_of(quads); sgn = np.sign(H.volume(V, quads))
    for lp in LOOPS:
        c = V[lp].mean(0)
        for i in range(len(lp)):
            a, b = V[lp[i]], V[lp[(i + 1) % len(lp)]]
            v += sgn * np.dot(c, np.cross(b, a)) / 6.0 * 1.0     # orientation: boundary edges run with the faces
    return abs(v)


lo_s, hi_s = 0.0, 5.0
for _ in range(30):
    mid = 0.5 * (lo_s + hi_s)
    if closed_volume(body_at(mid)) < VOLUME_TARGET:
        lo_s = mid
    else:
        hi_s = mid
s0 = 0.5 * (lo_s + hi_s)
FINAL = body_at(s0)
vol = closed_volume(FINAL)
log(f'VOLUME heavy coefficient shape_0 = {s0:.3f} with {MHR_FIXED}: closed volume {vol * 1000:.2f} L (target {VOLUME_TARGET * 1000:.2f} L); open-mesh volume {abs(H.volume(FINAL, quads)) * 1000:.2f} L')
log(f'   weight at 1010 kg/m3: {vol * 1010:.1f} kg; at tissue {TISSUE_DENSITY:.0f} kg/m3 after {LUNG_AIR * 1000:.1f} L lung air: {(vol - LUNG_AIR) * TISSUE_DENSITY:.1f} kg')
np.savez_compressed(os.path.join(OUT, 'form_pre_neck.npz'), V=FINAL, s0=s0)

# ================================================================== 5. helpers (rig joints, part fitting shells) follow
GROUPS = {g.index: g.name for g in bm.vertex_groups}
vg_of = [set() for _ in range(len(src))]
for v in bm.data.vertices:
    for g in v.groups:
        if g.weight > 0.5:
            vg_of[v.index].add(GROUPS[g.group])
HEAD_HELPERS = ('helper-hair', 'helper-l-eye', 'helper-r-eye', 'helper-l-eyelashes-1', 'helper-l-eyelashes-2', 'helper-r-eyelashes-1', 'helper-r-eyelashes-2',
                'helper-lower-teeth', 'helper-upper-teeth', 'helper-tongue', 'joint-head', 'joint-head-2', 'joint-jaw', 'joint-l-eye', 'joint-r-eye', 'joint-l-eye-target',
                'joint-r-eye-target', 'joint-l-lowerlid', 'joint-r-lowerlid', 'joint-l-upperlid', 'joint-r-upperlid', 'joint-mouth', 'joint-tongue-1', 'joint-tongue-2',
                'joint-tongue-3', 'joint-tongue-4')
helper = ~inbody
in_head_helper = np.array([bool(vg_of[i] & set(HEAD_HELPERS)) for i in range(len(src))]) & helper
from scipy.spatial import cKDTree as _KD
hb_idx = np.nonzero(region)[0]
kd_h = _KD(src[hb_idx])


def follow(points_src, V_new, idx_pool, kd, radius=0.10):
    out = np.empty_like(points_src)
    disp = V_new[idx_pool] - src[idx_pool]
    for i, p in enumerate(points_src):
        nb = kd.query_ball_point(p, radius)
        if not nb:
            nb = [kd.query(p)[1]]
        d = np.linalg.norm(src[idx_pool[nb]] - p, axis=1)
        w = 1.0 / (d * d + 1e-4)
        out[i] = p + (w[:, None] * disp[nb]).sum(0) / w.sum()
    return out


def assemble(V_body):
    V = co_tps.copy()                                  # skeleton joints and the other helpers: the thin-plate warp only
    V[inbody] = V_body[inbody]
    hh = np.nonzero(in_head_helper)[0]
    V[hh] = follow(src[hh], V_body, hb_idx, kd_h)
    return V


def joint_centre(V, name):
    idx = [i for i in range(len(src)) if name in vg_of[i]]
    return V[idx].mean(0)


# ================================================================== 6. neck: 49 cm at the cricoid level
CHIN_V = 991                     # MakeHuman base-mesh vertex on the front of the chin (pogonion), as in the study


def neck_frame(V):
    n0, hd = joint_centre(V, 'joint-neck'), joint_centre(V, 'joint-head')
    axis = (hd - n0) / np.linalg.norm(hd - n0)
    sc_l, sc_r = joint_centre(V, 'joint-l-clavicle'), joint_centre(V, 'joint-r-clavicle')
    mid = 0.5 * (sc_l + sc_r)
    tree = H.bvh(V[bidx], Fb)
    hit = tree.ray_cast(Vector(mid + np.array([0, -0.5, 0])), Vector((0, 1, 0)))[0]
    notch = np.array(hit) if hit is not None else mid
    chin = V[CHIN_V]
    t = 0.40 * np.dot(chin - notch, axis)
    level = notch + axis * t
    return dict(axis=axis, notch=notch, chin=chin, level=level, t=t, n0=n0, hd=hd)


def neck_circ(V, nf=None):
    nf = nf or neck_frame(V)
    centre = nf['n0'] + nf['axis'] * np.dot(nf['level'] - nf['n0'], nf['axis'])
    c, P = H.tape_circumference(V[bidx], Fb, nf['level'], nf['axis'], keep_near=centre, radius=0.13)
    return c, P, nf, centre


V0 = assemble(FINAL)
c0, P0, nf0, cen0 = neck_circ(V0)
log(f'NECK before fitting: {c0 * 100:.1f} cm at the cricoid level ({nf0["t"] * 100:.1f} cm above the sternal notch along the neck axis, 40% of notch-to-chin)')
# fit: scale the neck about its axis in a band from the clavicles to under the jaw (smooth ends), keeping the face
tn = (FINAL - nf0['notch']) @ nf0['axis']
band = np.clip(tn / 0.025 + 0.4, 0, 1) * np.clip((nf0['t'] + 0.045 - tn) / 0.03, 0, 1)
band = band * band * (3 - 2 * band) * inbody
radial = FINAL - (cen0 + np.outer((FINAL - cen0) @ nf0['axis'], nf0['axis']))


def neck_fit(k):
    return FINAL + ((k - 1.0) * band)[:, None] * radial


lo_k, hi_k = 0.8, 1.3
for _ in range(25):
    mk = 0.5 * (lo_k + hi_k)
    if neck_circ(assemble(neck_fit(mk)), nf0)[0] < CHART['neck_circ']:
        lo_k = mk
    else:
        hi_k = mk
kneck = 0.5 * (lo_k + hi_k)
FINAL2 = neck_fit(kneck)
# the neck change moves a little volume: hold the weight by re-solving the body coefficient with the neck kept
for _it in range(2):
    vol_now = closed_volume(FINAL2)
    ds = (VOLUME_TARGET - vol_now) / max(closed_volume(FINAL2 + D1f * 0.01) - vol_now, 1e-9) * 0.01
    FINAL2 = FINAL2 + ds * D1f; s0 += ds
V_all = assemble(FINAL2)
c1, P1, nf1, cen1 = neck_circ(V_all)
vol = closed_volume(FINAL2)
log(f'NECK fitted: radial factor {kneck:.3f}; now {c1 * 100:.1f} cm; volume {vol * 1000:.2f} L (shape_0 {s0:.3f}) -> {vol * 1010:.1f} kg at 1010, {(vol - LUNG_AIR) * TISSUE_DENSITY:.1f} kg tissue')
FINAL = FINAL2
eyes_out = {}
# the eye globes were placed by the sculpt; the identity and fat move the lids slightly: follow the mean lid shift
for s_ in ('L', 'R'):
    Ve_m = to_mhr(eyes_c[s_]); c = Ve_m.mean(0)
    near = np.nonzero(np.linalg.norm(to_mhr(Wh_c) - c, axis=1) < 0.025)[0]
    shift = (V_all[ridx[near]] - to_mhr(Wh_c)[near]).mean(0)
    eyes_out[s_] = Ve_m + shift
    log(f'eye {s_}: centre {(Ve_m.mean(0) + shift).round(4)}, radius {np.linalg.norm(Ve_m - Ve_m.mean(0), axis=1).mean() * 1000:.1f} mm, followed the lids by {np.linalg.norm(shift) * 1000:.1f} mm')
np.savez_compressed(os.path.join(WORK, 'form.npz'), V=V_all, inbody=inbody, quads=quads, fuv=fuv, region=region, w_h=w_h, macros=json.dumps(macros),
                    spec_targets=json.dumps(spec_keys), S=S, z0=z0, eyeL=eyes_out['L'], eyeR=eyes_out['R'], eyeF=E['FL'], eyeFR=E['FR'], neck_level=nf1['level'],
                    neck_axis=nf1['axis'], neck_notch=nf1['notch'], neck_circ=c1, neck_pts=P1, volume=vol, s0=s0, kneck=kneck, mhr_fixed=json.dumps(MHR_FIXED))
H.save_json(os.path.join(WORK, 'form.json'), dict(volume_m3=vol, weight_at_1010=vol * 1010, weight_at_tissue_density=(vol - LUNG_AIR) * TISSUE_DENSITY, tissue_density=TISSUE_DENSITY,
             fat_fraction_assumed=FAT_FRACTION, lung_air_m3=LUNG_AIR, mhr_coefficients=dict(MHR_FIXED, shape_0=s0), neck_circumference_m=c1, neck_level_above_notch_m=float(nf1['t']),
             neck_radial_factor=kneck, head_wrap=dict(scale_carrier_to_sculpt=float(sc)), carrier_scale=S))
log('SAVED form.npz')
FINAL = V_all
mag = np.linalg.norm(ident_off[ridx], axis=1)
log(f'identity offsets on the head: mean {mag.mean() * 1000:.2f} mm, 95th {np.percentile(mag, 95) * 1000:.2f} mm, max {mag.max() * 1000:.2f} mm at vertex {ridx[np.argmax(mag)]}; vertex 297 in region: {bool(region[297])}, z {src[297, 2]:.3f}, y {src[297, 1]:.3f}')
if STAGE in ('look', 'all'):
    show([(FINAL[bidx], Fb, 0.0)], os.path.join(OUT, 'look_body'), size=(900, 1100), ortho=2.0)
    hc = FINAL[bidx][np.argmax(FINAL[bidx][:, 2])] - np.array([0, 0, 0.12])
    show([(FINAL[bidx], Fb, 0.0)], os.path.join(OUT, 'look_head'), size=(800, 800), ortho=0.36, centre=tuple(hc))
if STAGE == 'headparts':
    hB = headbase
    sel_h = np.nonzero(region)[0]; rl = -np.ones(len(src), int); rl[sel_h] = np.arange(len(sel_h)); Fh = rl[quads[region[quads].all(1)]]
    hC = FINAL
    for tag, VV in (('wrapped', np.where(region[:, None], np.vstack([src[:0]]) if False else src, src)), ):
        pass
    hA = src.copy(); hA[ridx] = Wh_c
    for tag, VV in (('A_wrapped', hA), ('B_identity', hB), ('C_final', hC)):
        hc = VV[sel_h][np.argmax(VV[sel_h][:, 2])] - np.array([0, 0, 0.12])
        show([(VV[sel_h], Fh, 0.0)], os.path.join(OUT, 'hp_' + tag), views=(('front', (0, -1, 0)), ('three', (-0.7, -0.7, 0.05)), ('side', (-1, 0, 0))), size=(600, 600), ortho=0.36, centre=tuple(hc))
