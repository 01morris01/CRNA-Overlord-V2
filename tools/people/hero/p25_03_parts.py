"""p25_03_parts.py: eyes and mouth of the hero patient p25 (standing frame), added to p25_body.blend.
   Blender -b --factory-startup --python tools/people/hero/p25_03_parts.py
 Eyes: the Blender Studio "Eye - Realistic" globe and its separate cornea shell (CC0), sized and placed where the
   sculpt kept its eyeballs (the lids were wrapped around them). Tear line ("eye_wet") and soft lid shadow
   ("eye_occlusion") from ICT-FaceKit (MIT).
 Mouth: ICT-FaceKit's mouth socket (cheeks inside, floor, palate), gums, lower teeth and tongue (MIT), carried into this
   head by ICT's face wrapped onto ours (landmark-guided non-rigid ICP, the same solver as the head) and a thin-plate warp
   of the inside from that wrap. Dentures out: the upper teeth are not used; the upper gum becomes an edentulous ridge
   (resorbed, rounded crest, see edentulous_upper()). Lower third molars not present (common at 58; nothing in the
   chart either way). Soft palate, uvula and the palatoglossal / palatopharyngeal arches are authored here (no open
   model has them); his tonsils were removed in 1986 (chart), so the fossae between the arches are empty.
 The skin's own shallow MakeHuman mouth bag behind the lips is removed (the socket replaces it)."""
import bpy, os, sys, json, math, subprocess
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Matrix, Vector
import hero_lib as H
from scipy.spatial import Delaunay, cKDTree
import nicp

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
OUT = os.path.join(WORK, 'parts'); os.makedirs(OUT, exist_ok=True)
CACHE = os.path.join(WORK, 'cache')
log = H.Log('parts')
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_body.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']; skin = bpy.data.objects['skin']
B = np.load(os.path.join(WORK, 'body.npz'), allow_pickle=True)
SV = H.get_co(skin.data.vertices, len(skin.data.vertices))
SF = np.array([list(p.vertices) + [p.vertices[-1]] * (4 - len(p.vertices)) for p in skin.data.polygons], np.int32)
bones = {b.name: (np.array(b.head_local), np.array(b.tail_local), np.array(b.matrix_local)) for b in arm.data.bones}

# ================================================================ ICT face onto this head
IC = np.load(os.path.join(CACHE, 'ict_parts.npz'))
ib = IC['base']
conv = lambda X: np.stack([X[:, 0], -X[:, 2], X[:, 1]], 1) * 0.01          # ICT file (cm, y up, z forward) -> standing frame
IV = conv(ib)
IF = IC['faces']
RANGES = dict(face=(0, 9409), headneck=(9409, 11248), socket=(11248, 13294), sockL=(13294, 13678), sockR=(13678, 14062), gumtongue=(14062, 17039),
              teeth=(17039, 21451), eyeL=(21451, 23021), eyeR=(23021, 24591), wetL=(24591, 24795), wetR=(24795, 24999), occL=(25047, 25199), occR=(25199, 25351))
part_faces = {}
for name, (a, b) in RANGES.items():
    sel = (IF >= a).all(1) & (IF < b).all(1)
    part_faces[name] = IF[sel]
face_idx = np.arange(0, 11248)                                               # face plus head and neck
FFace = np.concatenate([part_faces['face'], part_faces['headneck']])
SKIN = (0.72, 0.52, 0.42)


def mesh_obj(name, V, F, color):
    ob = H.new_mesh(name, V, [tuple(f) if f[-1] != f[-2] else tuple(f[:-1]) for f in F])
    ob.data.materials.append(H.clay(name, color, 0.55))
    return ob


# landmark renders: our head (skin as it is) and ICT's face with its eyeballs, front, orthographic
head_mask = B['region'] > 0.5
hc_s = np.array([0.0, 0.0, SV[head_mask, 2].max() - 0.118])
hc_i = np.array([0.0, 0.0, IV[:11248, 2].max() - 0.118])
o_s = mesh_obj('s_skin', SV, SF, SKIN)
eyeV = np.load(os.path.join(CACHE, 'hbm_eye.npz'))
o_se = [mesh_obj('s_eye' + s, B['eye' + s], B['eyeF'], (0.85, 0.85, 0.85)) for s in ('L', 'R')]
o_i = mesh_obj('i_face', IV, FFace, SKIN)
o_ie = [mesh_obj('i_eye' + s, IV, part_faces['eye' + s], (0.85, 0.85, 0.85)) for s in ('L', 'R')]
for o in scene.objects:
    if o.type in ('MESH', 'ARMATURE') and o not in (o_s, *o_se, o_i, *o_ie):
        o.hide_render = True
H.use_gpu(scene, 32); scene.view_settings.view_transform = 'Standard'
cam = bpy.data.cameras.new('c'); co_ = bpy.data.objects.new('c', cam); scene.collection.objects.link(co_); scene.camera = co_
cam.type = 'ORTHO'; ORTHO = 0.30; cam.ortho_scale = ORTHO; RES = 1024
lights = H.studio(scene, Vector(hc_s), strength=0.20, world=0.5)
for which, objs, hc in (('src', (o_i, *o_ie), hc_i), ('tgt', (o_s, *o_se), hc_s)):
    for o in (o_s, *o_se, o_i, *o_ie):
        o.hide_render = o not in objs
    H.look(co_, Vector(hc) + Vector((0, -1.0, 0)), Vector(hc))
    H.render(scene, os.path.join(OUT, f'lm_{which}.png'), RES, RES)
for nm in ('src', 'tgt'):
    r = subprocess.run([H.UV_BIN, 'run', '--python', '3.12', '--with', 'mediapipe==0.10.14', '--with', 'numpy', '--with', 'pillow', 'python', '-I',
                        os.path.join(H.HERE, 'facemesh_detect.py'), os.path.join(OUT, f'lm_{nm}.png'), os.path.join(OUT, f'lm_{nm}.json')], capture_output=True, text=True, cwd=OUT)
    log('detector:', r.stdout.strip().split('\n')[-1] if r.stdout.strip() else r.stderr.strip()[-300:])
Ls, Lt = json.load(open(os.path.join(OUT, 'lm_src.json'))), json.load(open(os.path.join(OUT, 'lm_tgt.json')))
assert Ls['found'] and Lt['found'], 'landmarks not found'
ps, pt = np.array(Ls['points'])[:, :2], np.array(Lt['points'])[:, :2]
px_to_xz = lambda p, hc: np.stack([hc[0] + (p[:, 0] / RES - 0.5) * ORTHO, hc[2] + (0.5 - p[:, 1] / RES) * ORTHO], 1)
xz_to_px = lambda xz, hc: np.stack([((xz[:, 0] - hc[0]) / ORTHO + 0.5) * RES, (0.5 - (xz[:, 1] - hc[2]) / ORTHO) * RES], 1)
tree_i = nicp.bvh(IV, FFace); tree_s = nicp.bvh(SV, SF)
Ni = nicp.vertex_normals(IV[:11248], FFace)
tri2d = Delaunay(ps)
cand = np.arange(0, 9409)
q_px = xz_to_px(IV[cand][:, [0, 2]], hc_i); simp = tri2d.find_simplex(q_px)
cand = cand[(simp >= 0) & (Ni[cand, 1] < -0.25)]
vis = np.array([(lambda l: l is not None and abs(l.y - IV[i, 1]) < 0.002)(tree_i.ray_cast(Vector((IV[i, 0], -1.0, IV[i, 2])), Vector((0, 1, 0)))[0]) for i in cand])
cand = cand[vis]
q_px = xz_to_px(IV[cand][:, [0, 2]], hc_i); simp = tri2d.find_simplex(q_px)
Tm = tri2d.transform[simp]; b2 = np.einsum('nij,nj->ni', Tm[:, :2], q_px - Tm[:, 2]); bary = np.c_[b2, 1 - b2.sum(1)]
t_xz = px_to_xz(np.einsum('nk,nkj->nj', bary, pt[tri2d.simplices[simp]]), hc_s)
lm_i, lm_p = [], []
for i, xz in zip(cand, t_xz):
    l = tree_s.ray_cast(Vector((xz[0], -1.0, xz[1])), Vector((0, 1, 0)))[0]
    if l is not None:
        lm_i.append(i); lm_p.append(tuple(l))
lm_i, lm_p = np.array(lm_i), np.array(lm_p)
A_, B_ = IV[lm_i], lm_p
ca, cb = A_.mean(0), B_.mean(0)
U_, s_, Vt_ = np.linalg.svd((A_ - ca).T @ (B_ - cb))
R = (U_ @ np.diag([1, 1, np.sign(np.linalg.det(U_ @ Vt_))]) @ Vt_).T
sc = s_.sum() / ((A_ - ca) ** 2).sum()
sim = lambda X: (X - ca) @ R.T * sc + cb
log(f'ICT face onto this head: {len(lm_i)} dense correspondences; similarity scale {sc:.4f}')
IVs = sim(IV)
Vf = IVs[:11248]
Nf = nicp.vertex_normals(Vf, FFace); tree_f = nicp.bvh(Vf, FFace)
cav = np.zeros(len(Vf), bool)
for i in range(len(Vf)):
    cav[i] = tree_f.ray_cast(Vector(Vf[i] + Nf[i] * 0.0015), Vector(Nf[i]), 0.035)[0] is not None
dm = (~cav).astype(float); dm[9409:] *= 0.3                                  # the back of ICT's head and neck: a light pull only
Wf = nicp.wrap(Vf, FFace, tree_s, landmarks=(lm_i, lm_p), data_mask=dm, log=log)
_, _, df = nicp.closest(tree_s, Wf)
log(f'RESULT ICT face wrap: mean {df[~cav[:9409].tolist() + [False] * 1839].mean() * 1000:.2f} mm' if False else f'RESULT ICT face wrap on the face: median {np.median(df[:9409][~cav[:9409]]) * 1000:.2f} mm, 95th {np.percentile(df[:9409][~cav[:9409]], 95) * 1000:.2f} mm')
# thin-plate warp of the inside from the wrapped face: control points on the face, lips and cheeks around the mouth and eyes
rng = np.random.default_rng(25)
ctrl = np.concatenate([rng.choice(np.arange(0, 9409), 700, replace=False), rng.choice(np.arange(9409, 11248), 120, replace=False)])
tps = H.tps_fit(Vf[ctrl], Wf[ctrl], reg=1e-4)
IVw = tps(IVs)
IVw[:11248] = Wf
J = sc * R                                                                       # expression offsets: the similarity's scale and turn
expr = {k[2:]: conv(IC[k]) @ J.T for k in IC.files if k.startswith('x_')}
for o in (o_s, *o_se, o_i, *o_ie, co_, *lights):
    bpy.data.objects.remove(o, do_unlink=True)
for o in scene.objects:
    o.hide_render = False
np.savez_compressed(os.path.join(OUT, 'ict_fit.npz'), IVw=IVw, sc=sc)
log('ICT parts carried into the head')


# ================================================================ split ICT's gums-and-tongue by texture islands, classify
FUV = IC['fuv']
def uv_islands(face_ids):
    parent = {}
    def find(a):
        while parent.setdefault(a, a) != a:
            parent[a] = parent[parent[a]]; a = parent[a]
        return a
    for fi in face_ids:
        f = FUV[fi]
        for t in f[1:]:
            ra, rb = find(int(f[0])), find(int(t))
            if ra != rb: parent[ra] = rb
    isl = {}
    for fi in face_ids:
        isl.setdefault(find(int(FUV[fi][0])), []).append(fi)
    return list(isl.values())
a, b = RANGES['gumtongue']
gt_faces = np.nonzero((IF >= a).all(1) & (IF < b).all(1))[0]
jaw_move = np.linalg.norm(expr['jawOpen'], axis=1)
lower_teeth_v = np.arange(19247, 21451)
kd_lt = cKDTree(IVw[lower_teeth_v]); kd_ut = cKDTree(IVw[17039:19247])
pieces = {'gum_upper': [], 'gum_lower': [], 'tongue': []}
for isl in uv_islands(gt_faces):
    vv = np.unique(IF[isl]); P = IVw[vv]
    mv = jaw_move[vv].mean(); dl = kd_lt.query(P)[0].mean(); du = kd_ut.query(P)[0].mean()
    kind = 'gum_upper' if mv < 0.004 and du < dl else ('gum_lower' if dl < 0.008 else 'tongue')
    pieces[kind] += list(isl)
    log(f'gums/tongue island: {len(isl)} faces, centre {P.mean(0).round(3)}, jaw motion {mv * 1000:.1f} mm, to lower teeth {dl * 1000:.1f} mm, to upper {du * 1000:.1f} mm -> {kind}')

if '--islands' in sys.argv:
    cols = [(0.9, 0.2, 0.2), (0.2, 0.9, 0.2), (0.2, 0.2, 0.9), (0.9, 0.9, 0.2), (0.9, 0.2, 0.9), (0.2, 0.9, 0.9), (0.6, 0.3, 0.1), (0.3, 0.6, 0.1), (0.5, 0.5, 0.5), (1, 1, 1), (0.1, 0.1, 0.1)]
    obs = []
    for k, isl in enumerate(uv_islands(gt_faces)):
        F_ = IF[isl]; obs.append(mesh_obj(f'isl{k}', IVw, F_, cols[k % len(cols)]))
    obs.append(mesh_obj('teeth', IVw, part_faces['teeth'], (0.95, 0.95, 0.9)))
    sock = mesh_obj('socket', IVw, part_faces['socket'], (0.5, 0.25, 0.25))
    for o in scene.objects:
        if o.type in ('MESH', 'ARMATURE') and o not in obs + [sock]:
            o.hide_render = True
    H.use_gpu(scene, 16); scene.view_settings.view_transform = 'AgX'
    cam = bpy.data.cameras.new('c2'); c2 = bpy.data.objects.new('c2', cam); scene.collection.objects.link(c2); scene.camera = c2; cam.lens = 50
    ctr = Vector((0, -0.1, 1.605))
    H.studio(scene, ctr, strength=0.05, world=1.0)
    for nm, off, show_sock in (('above', (0, -0.05, 0.25), False), ('side', (0.25, -0.02, 0.0), False), ('front', (0, -0.25, 0.02), False), ('sock', (0.2, -0.15, 0.1), True)):
        sock.hide_render = not show_sock
        H.look(c2, ctr + Vector(off), ctr); H.render(scene, os.path.join(OUT, f'isl_{nm}.png'), 700, 600)
    raise SystemExit(0)

# reclassify: islands that move with the jaw are the lower gum (near the lower teeth) or the tongue; islands that do not
# move are the upper gum when they hug the upper teeth, otherwise the back of the tongue
pieces = {'gum_upper': [], 'gum_lower': [], 'tongue': []}
for isl in uv_islands(gt_faces):
    vv = np.unique(IF[isl]); P = IVw[vv]
    mv = jaw_move[vv].mean(); dl = kd_lt.query(P)[0].mean(); du = kd_ut.query(P)[0].mean()
    if mv > 0.02 and dl < 0.004:
        kind = 'gum_lower'
    elif mv < 0.002 and du < 0.004:
        kind = 'gum_upper'
    else:
        kind = 'tongue'
    pieces[kind] += list(isl)
log('pieces:', {k: len(v) for k, v in pieces.items()})

PARTS = {}            # name -> dict(V, F, UV(optional), ict(optional per-vertex ICT index), weights {bone: per-vertex})


def take(name, face_ids=None, faces=None, keep_v=None):
    F_ = IF[face_ids] if face_ids is not None else faces
    if keep_v is not None:
        F_ = F_[np.isin(F_, keep_v).all(1)]
    vv = np.unique(F_)
    loc = -np.ones(len(IVw), int); loc[vv] = np.arange(len(vv))
    uvi = None
    if face_ids is not None:
        uvi = FUV[face_ids] if keep_v is None else FUV[face_ids][np.isin(IF[face_ids], keep_v).all(1)]
    return dict(V=IVw[vv].copy(), F=loc[F_], ict=vv, uvi=uvi)


# ---- eyes: the sculpt's realistic eyeball and cornea, placed as the sculpt's own body eyes
EY = np.load(os.path.join(CACHE, 'hbm_eye.npz'))
ev, ef, euv, ecomp = EY['V'], EY['F'], EY['UV'], EY['comp']
cids = np.unique(ecomp)
globe_c = max(cids, key=lambda c: (ecomp == c).sum()); corn_c = [c for c in cids if c != globe_c][0]
gi = np.nonzero(ecomp == globe_c)[0]; ci = np.nonzero(ecomp == corn_c)[0]
fwd = ev[ci].mean(0) - ev[gi].mean(0); log(f'eye asset: globe {len(gi)} vertices, cornea {len(ci)}; cornea toward {np.round(fwd / np.linalg.norm(fwd), 2)}')
eyes_V, eyes_F, eyes_UV, corn_V, corn_F, corn_UV, eye_side_g, eye_side_c = [], [], [], [], [], [], [], []
for side in ('L', 'R'):
    tgt = B['eye' + side]; c_t = tgt.mean(0); r_t = np.linalg.norm(tgt - c_t, axis=1).mean()
    c_a = ev[gi].mean(0); r_a = np.linalg.norm(ev[gi] - c_a, axis=1).mean()
    # turn the asset's cornea direction to straight ahead (-Y), scale to the body eye, move to its centre
    f = fwd / np.linalg.norm(fwd)
    rot = np.array(Vector(f).rotation_difference(Vector((0, -1, 0))).to_matrix())
    place = lambda X: ((X - c_a) @ rot.T) * (r_t / r_a) + c_t
    for comp_idx, VV, FF, UVL, SID in ((gi, eyes_V, eyes_F, eyes_UV, eye_side_g), (ci, corn_V, corn_F, corn_UV, eye_side_c)):
        loc = -np.ones(len(ev), int); loc[comp_idx] = np.arange(len(comp_idx))
        fsel = np.isin(ef, comp_idx).all(1)
        base = sum(len(v) for v in VV)
        VV.append(place(ev[comp_idx])); FF.append(loc[ef[fsel]] + base); UVL.append(euv[fsel]); SID.append(np.full(len(comp_idx), 0 if side == 'L' else 1))
    log(f'eye {side}: centre {c_t.round(4)}, radius {r_t * 1000:.2f} mm (asset {r_a * 1000:.2f} mm)')
PARTS['eyes'] = dict(V=np.concatenate(eyes_V), F=np.concatenate(eyes_F), UVq=np.concatenate(eyes_UV), side=np.concatenate(eye_side_g))
PARTS['cornea'] = dict(V=np.concatenate(corn_V), F=np.concatenate(corn_F), UVq=np.concatenate(corn_UV), side=np.concatenate(eye_side_c))
# ---- tear line and lid shadow (ICT)
for nm, (pa, pb) in (('eye_wet', ('wetL', 'wetR')), ('eye_occlusion', ('occL', 'occR'))):
    fid = np.nonzero(np.isin(IF, np.arange(*RANGES[pa])).all(1) | np.isin(IF, np.arange(*RANGES[pb])).all(1))[0]
    PARTS[nm] = take(nm, face_ids=fid)
# ---- lower teeth (third molars left out), lower gum, tongue, mouth socket
keep_teeth = np.arange(19426, 21272)
fid = np.nonzero(np.isin(IF, keep_teeth).all(1))[0]
PARTS['teeth_lower'] = take('teeth_lower', face_ids=fid)
PARTS['gum_lower'] = take('gum_lower', face_ids=np.array(pieces['gum_lower']))
PARTS['tongue'] = take('tongue', face_ids=np.array(pieces['tongue']))
fid = np.nonzero(np.isin(IF, np.arange(*RANGES['socket'])).all(1))[0]
PARTS['socket'] = take('socket', face_ids=fid)
for k, v in PARTS.items():
    log(f'part {k}: {len(v["V"])} vertices, {len(v["F"])} faces')

# ---- the edentulous upper ridge (dentures out): swept along the arch of ICT's upper teeth, resorbed upward and inward
UT = [(17230, 17416), (17416, 17607), (17607, 17730), (17730, 17895), (17895, 17991), (17991, 18067), (18067, 18143),
      (18143, 18219), (18219, 18295), (18295, 18391), (18391, 18556), (18556, 18679), (18679, 18870), (18870, 19056)]   # 2nd molar L .. 2nd molar R
gumU = IVw[np.unique(IF[np.array(pieces['gum_upper'])])]
cej = []
for a_, b_ in UT:
    P = IVw[a_:b_]; c = P.mean(0)
    nearg = gumU[np.linalg.norm(gumU[:, :2] - c[:2], axis=1) < 0.005]
    margin = nearg[:, 2].min() if len(nearg) else np.quantile(P[:, 2], 0.6)       # the lowest gum edge over this tooth
    cej.append(np.array([c[0], c[1], margin]))
cej = np.array(cej)
log(f'upper gum margins over the former teeth: z {cej[:, 2].min():.4f}..{cej[:, 2].max():.4f} (upper teeth from {IVw[17039:19247, 2].min():.4f} to {IVw[17039:19247, 2].max():.4f})')
arch_c = np.array([0.0, cej[:, 1].max() + 0.0, cej[:, 2].mean()])                 # roughly the middle of the arch (back)
crest = []
for p in cej:
    inward = np.array([arch_c[0] - p[0], arch_c[1] - p[1], 0.0]); inward /= max(np.linalg.norm(inward), 1e-9)
    crest.append(p + np.array([0, 0, 0.0035]) + inward * 0.0018)                     # 3.5 mm up, 1.8 mm toward the palate
crest = np.array(crest)
# extend 6 mm behind the last molars (maxillary tuberosity) and resample by arc length
d0 = crest[0] - crest[1]; d1 = crest[-1] - crest[-2]
crest = np.vstack([crest[0] + d0 / np.linalg.norm(d0) * 0.006, crest, crest[-1] + d1 / np.linalg.norm(d1) * 0.006])
seg = np.linalg.norm(np.diff(crest, axis=0), axis=1); sarc = np.r_[0, np.cumsum(seg)]
from scipy.interpolate import splprep, splev
tck, _ = splprep(crest.T, u=sarc / sarc[-1], s=1e-7, k=3)
NT = 72; tt = np.linspace(0, 1, NT)
C = np.array(splev(tt, tck)).T; Tg = np.array(splev(tt, tck, der=1)).T; Tg /= np.linalg.norm(Tg, axis=1, keepdims=True)
PROF = np.array([(5.0, 12.0), (5.4, 8.0), (4.8, 4.2), (3.4, 1.6), (1.8, 0.35), (0.0, 0.0), (-1.8, 0.4), (-3.4, 1.7), (-4.6, 4.0), (-5.8, 6.8), (-7.5, 9.0), (-9.5, 10.5)]) * 0.001
rv, rf = [], []
for k in range(NT):
    up = np.array([0, 0, 1.0]); outw = np.cross(Tg[k], up); outw /= np.linalg.norm(outw)
    if np.dot(outw, C[k] - arch_c) < 0:
        outw = -outw
    taper = min(1.0, 0.45 + 0.55 * min(tt[k], 1 - tt[k]) / 0.08)             # the ends round off at the tuberosities
    for o, u in PROF:
        rv.append(C[k] + outw * o * (0.75 + 0.25 * taper) + up * u * taper)
NPF = len(PROF)
for k in range(NT - 1):
    for j in range(NPF - 1):
        a_ = k * NPF + j; rf.append([a_, a_ + 1, a_ + NPF + 1, a_ + NPF])
rv = np.array(rv); rf = np.array(rf)
# close the two posterior ends with fans
for k in (0, NT - 1):
    cidx = len(rv); rv = np.vstack([rv, rv[k * NPF:(k + 1) * NPF].mean(0) + (Tg[k] * (-0.002 if k == 0 else 0.002))])
    for j in range(NPF - 1):
        a_, b_ = k * NPF + j, k * NPF + j + 1
        rf = np.vstack([rf, [a_, b_, cidx, cidx] if k == NT - 1 else [b_, a_, cidx, cidx]])
uvr = np.stack([np.repeat(tt, NPF), np.tile(np.linspace(0, 1, NPF), NT)], 1)
PARTS['gum_upper'] = dict(V=rv, F=rf, uv_per_vertex=np.vstack([uvr, np.full((2, 2), 0.5)]))
log(f'edentulous upper ridge: crest 3.5 mm above and 1.8 mm inside the former gum margins; {len(rv)} vertices, {len(rf)} faces; arch length {sarc[-1] * 1000:.0f} mm')
# ---- soft palate, uvula and the arches, authored on the socket's own back
SK = PARTS['socket']['V']
mid = SK[np.abs(SK[:, 0]) < 0.004]
roof = mid[mid[:, 2] > np.median(mid[:, 2])]
yb = roof[:, 1].max()                                            # the back end of the roof
# soft palate free edge: 8 mm in front of the back wall, on the roof surface there
y_edge = yb - 0.010
z_edge = np.interp(y_edge, np.sort(roof[:, 1]), roof[np.argsort(roof[:, 1]), 2]) - 0.0015
log(f'socket roof back at y {yb:.3f}; soft palate edge at y {y_edge:.3f}, z {z_edge:.3f}')


def tube(path, radii, n_around=12, flat=1.0):
    """A closed tube along a 3D path with given radii (flattened front to back by `flat`)."""
    path = np.asarray(path); vs, fs = [], []
    for k, (p, r) in enumerate(zip(path, radii)):
        t = path[min(k + 1, len(path) - 1)] - path[max(k - 1, 0)]; t /= np.linalg.norm(t)
        a = np.array([0, 1.0, 0]) if abs(t[1]) < 0.9 else np.array([1.0, 0, 0])
        u = np.cross(t, a); u /= np.linalg.norm(u); v = np.cross(t, u)
        for j in range(n_around):
            th = 2 * np.pi * j / n_around
            vs.append(p + r * (np.cos(th) * u + flat * np.sin(th) * v))
    for k in range(len(path) - 1):
        for j in range(n_around):
            a_ = k * n_around + j; b_ = k * n_around + (j + 1) % n_around
            fs.append([a_, b_, b_ + n_around, a_ + n_around])
    for k, sgn in ((0, -1), (len(path) - 1, 1)):
        c = len(vs); vs.append(path[k]); 
        for j in range(n_around):
            a_ = k * n_around + j; b_ = k * n_around + (j + 1) % n_around
            fs.append([b_, a_, c, c] if sgn < 0 else [a_, b_, c, c])
    return np.array(vs), np.array(fs)


# uvula: 11 mm long, 8 mm wide at its root, rounded tip
L_uv = 0.011
upath = [np.array([0, y_edge + 0.001, z_edge + 0.002]) + np.array([0, 0.0015 * (t ** 2), -L_uv * t]) for t in np.linspace(0, 1, 9)]
urad = [0.0042, 0.0040, 0.0036, 0.0033, 0.0031, 0.0030, 0.0029, 0.0026, 0.0012]
uvV, uvF = tube(upath, urad, 14, flat=0.65)
# palatoglossal (front) and palatopharyngeal (back) arches, both sides: folds from the soft palate down the side walls
arches = []
for sx in (1, -1):
    for dy, r0 in ((-0.004, 0.0024), (0.004, 0.0028)):
        x_wall = np.percentile(np.abs(SK[np.abs(SK[:, 1] - (y_edge + dy)) < 0.004, 0]), 92)
        pts = []
        for t in np.linspace(0, 1, 12):
            ang = t * np.pi / 2
            x = sx * (0.006 + (x_wall - 0.006 - 0.002) * np.sin(ang)); z = z_edge + 0.001 - 0.022 * (1 - np.cos(ang)) - 0.004 * t
            pts.append(np.array([x, y_edge + dy, z]))
        arches.append(tube(pts, np.linspace(r0, r0 * 1.15, 12), 10, flat=0.8))
av, af = [uvV], [uvF]
for v_, f_ in arches:
    af.append(f_ + sum(len(x) for x in av)); av.append(v_)
PARTS['palate_extra'] = dict(V=np.concatenate(av), F=np.concatenate(af))
log(f'uvula {L_uv * 1000:.0f} mm long from y {y_edge:.3f}; four arches; tonsils not modeled (tonsillectomy 1986)')
# ---- the tongue: a little bigger and higher than ICT's (large tongue for a Mallampati III view, OSA)
TG = PARTS['tongue']; tc_ = TG['V'].mean(0)
TG['V'] = tc_ + (TG['V'] - tc_) * np.array([1.06, 1.08, 1.12]) + np.array([0, 0.0, 0.0025])
# ---- remove the skin's own shallow mouth bag behind the lips (the socket replaces it)
Nsk = nicp.vertex_normals(SV, SF)
lipz = np.array([np.median(PARTS['socket']['V'][:, 2])])
front_y = PARTS['socket']['V'][:, 1].min()
inside = np.zeros(len(SV), bool)
box = (np.abs(SV[:, 0]) < 0.034) & (SV[:, 2] > PARTS['socket']['V'][:, 2].min() - 0.004) & (SV[:, 2] < PARTS['socket']['V'][:, 2].max() + 0.004) & (SV[:, 1] > front_y + 0.004)
tree_sk = nicp.bvh(SV, SF)
for i in np.nonzero(box)[0]:
    inside[i] = tree_sk.ray_cast(Vector(SV[i] + Nsk[i] * 0.0015), Vector(Nsk[i]), 0.035)[0] is not None
rm_faces = [p.index for p in skin.data.polygons if all(inside[v] for v in p.vertices)]
log(f'skin mouth bag: {int(inside.sum())} vertices behind the lips, {len(rm_faces)} faces removed')
import bmesh
att = skin.data.attributes.new('orig', 'INT', 'POINT'); att.data.foreach_set('value', np.arange(len(skin.data.vertices), dtype=np.int32))
bmm = bmesh.new(); bmm.from_mesh(skin.data); bmm.faces.ensure_lookup_table()
bmesh.ops.delete(bmm, geom=[bmm.faces[i] for i in rm_faces], context='FACES')
loose = [v for v in bmm.verts if not v.link_faces]
bmesh.ops.delete(bmm, geom=loose, context='VERTS')
bmm.to_mesh(skin.data); bmm.free(); skin.data.update()
log(f'skin now {len(skin.data.vertices)} vertices, {len(skin.data.polygons)} faces')

# ================================================================ objects, weights, plain materials (maps come later)
def mat(name, color, rough=0.5, sss=0.0, alpha=1.0, spec=0.5, coat=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough
    if sss: b.inputs['Subsurface Weight'].default_value = sss; b.inputs['Subsurface Radius'].default_value = (0.8, 0.3, 0.2); b.inputs['Subsurface Scale'].default_value = 0.002
    if alpha < 1: b.inputs['Alpha'].default_value = alpha; m.blend_method = 'BLEND' if hasattr(m, 'blend_method') else None
    if coat: b.inputs['Coat Weight'].default_value = coat
    return m


def make(name, V, F, weights, material, uvq=None, uv_vert=None):
    F_ = [tuple(int(x) for x in (f if (len(f) < 4 or f[-1] != f[-2]) else f[:-1])) for f in F]
    o = H.new_mesh(name, V, F_)
    if uvq is not None or uv_vert is not None:
        lay = o.data.uv_layers.new(name='UVMap'); arr = []
        for k, p in enumerate(o.data.polygons):
            for j, vi in enumerate(p.vertices):
                arr.append(uvq[k][j] if uvq is not None else uv_vert[vi])
        lay.data.foreach_set('uv', np.asarray(arr, np.float32).ravel())
    for bn, w in weights.items():
        g = o.vertex_groups.new(name=bn); w = np.broadcast_to(np.asarray(w, float), (len(V),))
        for vi in np.nonzero(w > 1e-4)[0]:
            g.add([int(vi)], float(w[vi]), 'REPLACE')
    md = o.modifiers.new('rig', 'ARMATURE'); md.object = arm; o.parent = arm
    o.data.materials.append(material)
    return o


def ict_uvq(P):
    if P.get('uvi') is None:
        return None
    return [[IC['vt'][t] for t in row] for row in P['uvi']]


eside = PARTS['eyes']['side']; cside = PARTS['cornea']['side']
objs = {}
objs['eyes'] = make('eyes', PARTS['eyes']['V'], PARTS['eyes']['F'], {'eye.L': (eside == 0).astype(float), 'eye.R': (eside == 1).astype(float)}, mat('eyes', (0.8, 0.78, 0.74), 0.3, sss=0.2), uvq=PARTS['eyes']['UVq'])
objs['cornea'] = make('cornea', PARTS['cornea']['V'], PARTS['cornea']['F'], {'eye.L': (cside == 0).astype(float), 'eye.R': (cside == 1).astype(float)}, mat('cornea', (1, 1, 1), 0.02, alpha=0.1), uvq=PARTS['cornea']['UVq'])
for nm in ('eye_wet', 'eye_occlusion'):
    objs[nm] = make(nm, PARTS[nm]['V'], PARTS[nm]['F'], {'head': 1.0}, mat(nm, (1, 1, 1) if nm == 'eye_wet' else (0.05, 0.03, 0.03), 0.05 if nm == 'eye_wet' else 1.0, alpha=0.3), uvq=ict_uvq(PARTS[nm]))
objs['teeth_lower'] = make('teeth_lower', PARTS['teeth_lower']['V'], PARTS['teeth_lower']['F'], {'jaw': 1.0}, mat('teeth_lower', (0.78, 0.72, 0.6), 0.35, sss=0.3), uvq=ict_uvq(PARTS['teeth_lower']))
# gums: upper ridge (head) and lower gum (jaw) in one object
GU, GL = PARTS['gum_upper'], PARTS['gum_lower']
gV = np.vstack([GU['V'], GL['V']]); gF = np.vstack([GU['F'], GL['F'] + len(GU['V'])])
wjaw = np.r_[np.zeros(len(GU['V'])), np.ones(len(GL['V']))]
objs['gums'] = make('gums', gV, gF, {'jaw': wjaw, 'head': 1 - wjaw}, mat('gums', (0.55, 0.22, 0.2), 0.45, sss=0.3))
objs['tongue'] = make('tongue', PARTS['tongue']['V'], PARTS['tongue']['F'], {'jaw': 1.0}, mat('tongue', (0.55, 0.25, 0.24), 0.55, sss=0.3), uvq=ict_uvq(PARTS['tongue']))
# mouth_inner: socket (moving with the jaw in proportion to ICT's own jaw opening) plus palate extras (head)
SKp = PARTS['socket']
inc = np.arange(20263, 20435)                                              # lower central incisors (ICT)
ref = np.linalg.norm(expr['jawOpen'][inc], axis=1).mean()
wj = np.clip(np.linalg.norm(expr['jawOpen'][SKp['ict']], axis=1) / ref, 0, 1)
PE = PARTS['palate_extra']
mV = np.vstack([SKp['V'], PE['V']]); mF = np.vstack([SKp['F'], PE['F'] + len(SKp['V'])])
wjm = np.r_[wj, np.zeros(len(PE['V']))]
objs['mouth_inner'] = make('mouth_inner', mV, mF, {'jaw': wjm, 'head': 1 - wjm}, mat('mouth_inner', (0.45, 0.16, 0.15), 0.5, sss=0.3))
for k, o in objs.items():
    log(f'object {k}: {len(o.data.vertices)} vertices, {sum(len(p.vertices) - 2 for p in o.data.polygons)} triangles')
np.savez_compressed(os.path.join(WORK, 'parts.npz'), **{f'{k}_ict': PARTS[k]['ict'] for k in ('eye_wet', 'eye_occlusion', 'teeth_lower', 'gum_lower', 'tongue', 'socket')},
                    n_gum_upper=len(GU['V']), n_socket=len(SKp['V']), **{'x_' + k: v for k, v in expr.items()}, uv_edge=y_edge, z_edge=z_edge, tongue_centre=tc_, crest=C)
skin.data.materials.clear(); skin.data.materials.append(mat('skin', (0.36, 0.24, 0.17), 0.45, sss=0.5))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_parts.blend'))
log('SAVED p25_parts.blend')
if '--look' in sys.argv:
    for o in scene.objects:
        o.hide_render = o.type not in ('MESH',) or o.name in ('hair',)
    H.use_gpu(scene, 32); scene.view_settings.view_transform = 'AgX'
    cam = bpy.data.cameras.new('c3'); c3 = bpy.data.objects.new('c3', cam); scene.collection.objects.link(c3); scene.camera = c3; cam.lens = 60
    ctr = Vector((0, -0.11, 1.61)); lights = H.studio(scene, ctr, strength=0.08, world=0.6)
    shots = [('face', (0, -0.55, 0.05), ctr, False), ('mouth_cut', (0.0, -0.32, -0.18), ctr, True), ('mouth_side', (0.3, -0.05, 0.0), ctr, True), ('eye', (0.08, -0.25, 0.08), Vector((0.033, -0.12, 1.675)), False)]
    for nm, off, c_, hide_skin in shots:
        skin.hide_render = hide_skin
        H.look(c3, c_ + Vector(off), c_); H.render(scene, os.path.join(OUT, f'look_{nm}.png'), 800, 650)
