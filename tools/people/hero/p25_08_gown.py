"""p25_08_gown.py: the hospital gown of the hero patient p25 (skinned to the rig) by cloth simulation over the rest pose.
   Blender -b --factory-startup --python tools/people/hero/p25_08_gown.py
 1. Pattern from the body: front and sides of the trunk from a low round neckline down to a hem 12 cm above the
    knees, short kimono sleeves to mid upper arm, and back panels that leave a 16 cm opening down the middle of the back
    (a gown is open at the back; here it is tied only at the neck). The shell starts 8 to 22 mm off the skin (more where
    cloth hangs: belly, flanks) so it has to fall.
 2. Blender cloth (cotton: 0.15 kg/m2, tension 15, bending 0.5) settles it for 40 frames under gravity onto the body,
    the mattress and the stretcher's rail; the neckline band, the sleeve tops and where the arms lie on the flanks are
    pinned to the skin. Leftovers inside the skin are pushed out to 2 mm.
 3. Real geometry at every edge: hems turned under (a 2 cm doubled strip 1.2 mm inside), three snaps on each shoulder
    seam, two neck ties at the back.
 4. Skinned by binding every gown vertex to the skin under it (the skin's weights, interpolated); the shape keys that
    move the trunk (breathe, press_ramped, press_lateral_left) are carried the same way.
Weave: Poly Haven stretch_poplin (CC0) normal map, tiled 29 x 28 cm; colour: an original small diamond print drawn
here (pale blue with navy), as many US hospital gowns have. Saves p25/blend/p25_gown.blend."""
import bpy, bmesh, os, sys, json, math
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Matrix, Vector
import hero_lib as H
import pose_lib as PL

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
TEX = os.path.join(WORK, 'tex'); os.makedirs(TEX, exist_ok=True)
log = H.Log('gown')
FRAMES = 40
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_contact.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']; P = arm.pose.bones
arm.animation_data.action = bpy.data.actions['flat']; scene.frame_set(1)
SB, SHd = bpy.data.objects['skin_body'], bpy.data.objects['skin_head']
RS = np.load(os.path.join(WORK, 'rest_split.npz'))
ri_b = np.empty(len(SB.data.vertices), np.int32); SB.data.attributes['restidx'].data.foreach_get('value', ri_b)
lab = {k[4:]: RS[k][ri_b] for k in RS.files if k.startswith('lab_')}
V = H.get_co(SB.data.shape_keys.key_blocks[0].data, len(SB.data.vertices))
Q = H.quads_of(SB); E = H.edges_of(Q)
N = H.vertex_normals(V, Q)
RJ = json.load(open(os.path.join(WORK, 'rest.json')))
seam_p = np.array(RJ['seam']['plane_point']); seam_n = np.array(RJ['seam']['plane_normal'])
notch = np.array(RJ['seam']['sternal_notch'])
bone = lambda n: np.array(arm.data.bones[n].head_local)
# ---------------------------------------------------------------- 1. pattern: an envelope of the trunk and thighs, sleeves
# The gown is cut from slices across the body: each slice of the trunk and thighs (arms and head left out) is wrapped
# by its convex outline, so below the hips the cloth bridges between the thighs as a skirt does; then the cloth falls.
d_seam = (V - seam_p) @ seam_n
knee_y = 0.5 * (bone('lowerleg01.L')[1] + bone('lowerleg01.R')[1])
hem_y = knee_y + 0.12
armw = lab['armL'] + lab['armR']
near_sh = np.zeros(len(V), bool)
for s_ in ('L', 'R'):
    near_sh |= (np.linalg.norm(V - bone('upperarm01.' + s_), axis=1) < 0.11) & (lab['arm' + s_] > 0.05)
core = (lab['torso'] > 0.5) | ((lab['legs'] > 0.5) & (armw < 0.05)) | near_sh
top_y = max(bone('upperarm01.L')[1], bone('upperarm01.R')[1]) + 0.07
NS, NA = 72, 112
ys = np.linspace(hem_y, top_y, NS)
from scipy.spatial import ConvexHull
rings = []
for y in ys:
    m = core & (np.abs(V[:, 1] - y) < 0.012)
    pts = V[m][:, [0, 2]]
    if len(pts) < 12:
        rings.append(rings[-1].copy() if rings else None); continue
    hl = ConvexHull(pts); poly = pts[hl.vertices]
    c = poly.mean(0)
    # resample by angle about the centre, starting at the back middle
    ang = np.arctan2(poly[:, 1] - c[1], poly[:, 0] - c[0])
    order = np.argsort(ang); poly = poly[order]; ang = ang[order]
    tgt = np.linspace(-np.pi / 2, 3 * np.pi / 2, NA, endpoint=False)
    out = []
    for t in tgt:
        tt = (t + np.pi) % (2 * np.pi) - np.pi
        # intersect the ray from c at angle tt with the polygon
        dvec = np.array([math.cos(tt), math.sin(tt)]); best = None
        for i in range(len(poly)):
            p0, p1 = poly[i], poly[(i + 1) % len(poly)]
            e = p1 - p0; den = dvec[0] * (-e[1]) - dvec[1] * (-e[0])
            if abs(den) < 1e-12:
                continue
            rhs = p0 - c
            tr = (rhs[0] * (-e[1]) - rhs[1] * (-e[0])) / den
            u = (dvec[0] * rhs[1] - dvec[1] * rhs[0]) / den
            if tr > 0 and -1e-9 <= u <= 1 + 1e-9:
                best = tr if best is None else min(best, tr)
        r = best if best is not None else 0.1
        out.append(c + dvec * r)
    out = np.array(out)
    # ease: more cloth where it hangs (front of the belly, the sides) than on the shoulders
    up = np.clip((out[:, 1] - c[1]) / 0.2, -1, 1)
    e = 0.010 + 0.010 * np.clip(up, 0, 1) + 0.006
    outw = out + (out - c) / np.maximum(np.linalg.norm(out - c, axis=1, keepdims=True), 1e-6) * e[:, None]
    rings.append(np.c_[outw[:, 0], np.full(NA, y), outw[:, 1]])
for i in range(len(rings)):
    if rings[i] is None:
        rings[i] = next(r for r in rings[i:] if r is not None)
R_ = np.array(rings)                                             # (NS, NA, 3)
R_[..., 2] = np.maximum(R_[..., 2], -0.006)                       # under him: lies on the mattress
GVb = R_.reshape(-1, 3)
GFb = []
for i in range(NS - 1):
    for j in range(NA):
        a_ = i * NA + j; b_ = i * NA + (j + 1) % NA
        GFb.append([a_, b_, b_ + NA, a_ + NA])
GFb = np.array(GFb)
# cut: neckline (lower in front), back opening down the middle
dseam_g = (GVb - seam_p) @ seam_n
front_g = GVb[:, 2] > 0.08
n01_, hd_ = bone('neck01'), bone('head'); nax = (hd_ - n01_) / np.linalg.norm(hd_ - n01_)
rad_g = np.linalg.norm((GVb - n01_) - np.outer((GVb - n01_) @ nax, nax), axis=1)
neck_cut = (dseam_g > -np.where(front_g, 0.055, 0.025)) & (rad_g < 0.115)          # a round neck opening; the shoulders stay covered
neck_cut |= dseam_g > 0.02
back_cut = (np.abs(GVb[:, 0]) < 0.08) & (GVb[:, 2] < 0.10)
bad = neck_cut | back_cut
GFb = GFb[~bad[GFb].any(1)]
# sleeves: short tubes round each upper arm
SL_V, SL_F = [], []
for s in ():
    sh = bone('upperarm01.' + s); el = bone('lowerarm01.' + s)
    ax = (el - sh) / np.linalg.norm(el - sh)
    u_, v_ = H.plane_basis(ax)
    am = (lab['arm' + s] > 0.3)
    ts = np.linspace(-0.02, 0.15, 10); NAs = 40
    base_i = sum(len(x) for x in SL_V) + len(GVb)
    ring_s = []
    for t in ts:
        m = am & (np.abs((V - sh) @ ax - t) < 0.012)
        pts = V[m] - sh - np.outer((V[m] - sh) @ ax, ax)
        q = np.stack([pts @ u_, pts @ v_], 1)
        hl = ConvexHull(q); c = q[hl.vertices].mean(0)
        rr = []
        for k in range(NAs):
            th = 2 * np.pi * k / NAs; dvec = np.array([math.cos(th), math.sin(th)])
            proj = (q[hl.vertices] - c) @ dvec
            rr.append(c + dvec * (proj.max() + 0.012))
        rr = np.array(rr)
        ring_s.append(sh + ax * t + np.outer(rr[:, 0], u_) + np.outer(rr[:, 1], v_))
    ring_s = np.array(ring_s)
    SL_V.append(ring_s.reshape(-1, 3))
    for i in range(len(ts) - 1):
        for k in range(NAs):
            a_ = base_i + i * NAs + k; b_ = base_i + i * NAs + (k + 1) % NAs
            SL_F.append([a_, b_, b_ + NAs, a_ + NAs])
GV = np.vstack([GVb] + SL_V); GF = np.vstack([GFb] + ([np.array(SL_F)] if SL_F else []))
used = np.unique(GF); remap = -np.ones(len(GV), int); remap[used] = np.arange(len(used))
SLEEVE_MASK = np.zeros(len(GV), bool); SLEEVE_MASK[len(GVb):] = True
GV = GV[used]; GF = remap[GF]; SLEEVE_MASK = SLEEVE_MASK[used]
log(f'pattern: envelope of the trunk and thighs ({NS} slices x {NA}) with the shoulder caps (kimono sleeves); {len(GV)} vertices, {len(GF)} faces; hem at y {hem_y:.3f} (knees at {knee_y:.3f})')
gown = H.new_mesh('gown', GV, [tuple(int(x) for x in f) for f in GF])
GQ = H.quads_of(gown)
# pins: the neckline band, the shoulder tops and the sleeve tops; where the arm lies on the flank
from scipy.spatial import cKDTree
kd = cKDTree(V)
dist, nn = kd.query(GV)
pin = np.zeros(len(GV))
dseam_g = (GV - seam_p) @ seam_n
pin = np.maximum(pin, np.clip(1 - (-dseam_g - 0.05) / 0.06, 0, 1))                  # 6 cm band under the neckline
shoulder_top = np.zeros(len(GV), bool)
for s in ('L', 'R'):
    sh = bone('upperarm01.' + s)
    shoulder_top |= (np.linalg.norm(GV - sh, axis=1) < 0.11) & (GV[:, 2] > sh[2])
pin = np.maximum(pin, shoulder_top * 0.9)
# the sleeves keep their tube round the upper arm (pinned), the body of the gown falls
pin[SLEEVE_MASK] = 1.0
grp = gown.vertex_groups.new(name='pin')
for i in np.nonzero(pin > 0.02)[0]:
    grp.add([int(i)], float(min(1, pin[i])), 'REPLACE')
# colliders: the skin (as posed now), the mattress and the stretcher frame
def static_copy(o, name):
    me = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    c = bpy.data.objects.new(name, me); scene.collection.objects.link(c); c.matrix_world = o.matrix_world.copy()
    return c
col_body = static_copy(SB, 'col_body'); col_head = static_copy(SHd, 'col_head')
# the forearms and hands lie on top of the gown: they are not colliders (the cloth falls under them onto the flanks)
fore = PL.group_w(SB, {n + s_ for n in ('lowerarm01', 'lowerarm02', 'wrist') for s_ in ('.L', '.R')} | {f'finger{i}-{j}{s_}' for i in range(1, 6) for j in (1, 2, 3) for s_ in ('.L', '.R')} | {f'metacarpal{i}{s_}' for i in range(1, 5) for s_ in ('.L', '.R')}) > 0.3
bmc = bmesh.new(); bmc.from_mesh(col_body.data); bmc.verts.ensure_lookup_table()
bmesh.ops.delete(bmc, geom=[bmc.verts[i] for i in np.nonzero(fore)[0]], context='VERTS'); bmc.to_mesh(col_body.data); bmc.free()
SN = np.load(os.path.join(WORK, 'stretcher', 'stretcher.npz'))
sv = np.stack([SN['V'][:, 0], -SN['V'][:, 2], SN['V'][:, 1]], 1)
col_st = H.new_mesh('col_stretcher', sv, [tuple(int(x) for x in (f if f[-1] != f[-2] else f[:-1])) for f in SN['F']])
for c in (col_body, col_head, col_st):
    m = c.modifiers.new('col', 'COLLISION'); c.collision.thickness_outer = 0.003; c.collision.cloth_friction = 8.0
cl = gown.modifiers.new('cloth', 'CLOTH'); cs = cl.settings
cs.quality = 6; cs.mass = 0.15; cs.tension_stiffness = 15; cs.compression_stiffness = 15; cs.shear_stiffness = 5; cs.bending_stiffness = 0.5
cs.air_damping = 1.0; cs.vertex_group_mass = 'pin'; cs.pin_stiffness = 1.0
cl.collision_settings.distance_min = 0.003; cl.collision_settings.use_self_collision = False; cl.collision_settings.collision_quality = 3
cl.point_cache.frame_start = 1; cl.point_cache.frame_end = FRAMES
scene.frame_start, scene.frame_end = 1, FRAMES
import time
t0 = time.time()
for f in range(1, FRAMES + 1):
    scene.frame_set(f)
log(f'cloth settled: {FRAMES} frames in {time.time() - t0:.0f} s')
dg = bpy.context.evaluated_depsgraph_get()
me_settled = bpy.data.meshes.new_from_object(gown.evaluated_get(dg))
GS = H.get_co(me_settled.vertices, len(me_settled.vertices))
scene.frame_set(1)
gown.modifiers.remove(cl)
for c in (col_body, col_head, col_st):
    bpy.data.objects.remove(c, do_unlink=True)
H.set_co(gown.data.vertices, GS); gown.data.update()
moved = np.linalg.norm(GS - GV, axis=1)
log(f'settling moved the cloth: mean {moved.mean() * 1000:.1f} mm, max {moved.max() * 1000:.1f} mm')
# ---------------------------------------------------------------- cleanup: nothing inside the skin
# where the gown is under a forearm or hand it is laid on the trunk under the arm; elsewhere pushed out to 2 mm
notfore = ~fore
tq = Q[notfore[Q].all(1)]
tree = H.bvh(V, tq)
tree_f = H.bvh(V, Q[fore[Q].all(1)])
inside = 0; worst = 0.0
for i, p in enumerate(GS):
    lf, nf, _, df = tree_f.find_nearest(Vector(p), 0.06)
    if lf is not None and (Vector(p) - lf).dot(nf) < 0.002:
        # under the arm: onto the trunk below it
        lt, nt, _, dt = tree.find_nearest(Vector(p), 0.12)
        if lt is not None:
            GS[i] = np.array(lt) + np.array(nt) * 0.002; inside += 1; continue
    loc_, nrm, fi, d = tree.find_nearest(Vector(p), 0.05)
    if loc_ is not None:
        s_ = (Vector(p) - loc_).dot(nrm)
        if s_ < 0.002:
            worst = max(worst, 0.002 - s_); inside += 1
            GS[i] = np.array(loc_) + np.array(nrm) * 0.002
log(f'cleanup: {inside} gown vertices were within 2 mm of or inside the skin (deepest {worst * 1000:.1f} mm), pushed out to 2 mm')
GS = H.smooth_field(GS, H.edges_of(H.quads_of(gown)), n_iter=1, lam=0.2)
H.set_co(gown.data.vertices, GS); gown.data.update()
H.save_json(os.path.join(WORK, 'gown_sim.json'), dict(frames=FRAMES, moved_mean_mm=moved.mean() * 1000, pushed_out=inside, deepest_mm=worst * 1000))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_gown_sim.blend'))
log('SAVED p25_gown_sim.blend')

# ================================================================ 3. edges as real geometry: hems, snaps, ties
gm = gown.data
GS = H.get_co(gm.vertices, len(gm.vertices)); GQ = H.quads_of(gown)
GN = H.vertex_normals(GS, GQ)
# boundary loops
e = np.concatenate([GQ[:, [k, (k + 1) % 4]] for k in range(4)]); e = e[e[:, 0] != e[:, 1]]
key = np.sort(e, 1); u, inv, cnt = np.unique(key, axis=0, return_inverse=True, return_counts=True)
bnd = e[cnt[inv.ravel()] == 1]
nxt = {int(a): int(b) for a, b in bnd}
loops, seen = [], set()
for a0 in list(nxt):
    if a0 in seen:
        continue
    lp = [a0]; seen.add(a0); b0 = nxt[a0]
    while b0 != a0 and b0 not in seen and b0 in nxt:
        lp.append(b0); seen.add(b0); b0 = nxt[b0]
    loops.append(lp)
log(f'gown edges: {len(loops)} boundary loops, {sum(len(l) for l in loops)} edge vertices')
nbr = [[] for _ in range(len(GS))]
for a_, b_ in H.edges_of(GQ):
    nbr[a_].append(b_); nbr[b_].append(a_)
newV = [GS]; newF = [GQ]; base = len(GS)
HEM, LIP = 0.018, 0.0012
for lp in loops:
    lpa = np.array(lp); n = len(lpa)
    inward = []
    for i in lpa:
        inn = [j for j in nbr[i] if j not in set(lp)]
        d = (GS[inn].mean(0) - GS[i]) if inn else -GN[i]
        d = d - GN[i] * np.dot(d, GN[i]); d /= max(np.linalg.norm(d), 1e-9)
        inward.append(d)
    inward = np.array(inward)
    r1 = GS[lpa] - GN[lpa] * LIP * 0.5 + inward * 0.0015                  # the fold
    r2 = GS[lpa] - GN[lpa] * LIP + inward * HEM                           # the turned-under strip
    i1 = base + np.arange(n); base += n; i2 = base + np.arange(n); base += n
    newV += [r1, r2]
    for k in range(n):
        a_, b_ = lpa[k], lpa[(k + 1) % n]
        newF.append(np.array([[a_, b_, i1[(k + 1) % n], i1[k]], [i1[k], i1[(k + 1) % n], i2[(k + 1) % n], i2[k]]]))
GV2 = np.vstack(newV); GF2 = np.vstack(newF)
log(f'hems: {HEM * 1000:.0f} mm turned under at every edge; gown now {len(GV2)} vertices')
# snaps on each shoulder seam (3 per side) and two neck ties at the back
extras_V, extras_F = [], []
def disc(c, nrm, r=0.0045, h=0.0018, n=12):
    u_, v_ = H.plane_basis(nrm); vs = []; fs = []
    for k in range(n):
        th = 2 * np.pi * k / n; d = np.cos(th) * u_ + np.sin(th) * v_
        vs += [c + d * r, c + d * r + nrm * h]
    vs += [c + nrm * h]
    b0 = len(extras_V and np.vstack(extras_V)) if False else 0
    for k in range(n):
        a_, b_ = 2 * k, 2 * ((k + 1) % n)
        fs += [[a_, b_, b_ + 1, a_ + 1], [a_ + 1, b_ + 1, 2 * n, 2 * n]]
    return np.array(vs), np.array(fs)
tree_g = H.bvh(GV2, GF2)
for s_ in ('L', 'R'):
    sh = bone('upperarm01.' + s_); cl_ = bone('clavicle.' + s_)
    for t in (0.25, 0.5, 0.75):
        p = cl_ + (sh - cl_) * t + np.array([0, 0, 0.3])
        hit = tree_g.ray_cast(Vector(p), Vector((0, 0, -1)), 1.0)
        if hit[0] is not None:
            dv, df = disc(np.array(hit[0]), np.array(hit[1]))
            extras_F.append(df + sum(len(x) for x in extras_V)); extras_V.append(dv)
tie_root = seam_p + seam_n * -0.03
for sx in (1, -1):
    pts = [tie_root + np.array([sx * 0.07, 0, 0])]
    for k in range(1, 12):
        pts.append(pts[-1] + np.array([sx * 0.004, -0.024, 0]))
    pts = np.array(pts); pts[:, 2] = np.maximum(pts[:, 2], -0.004)
    w_ = 0.012; vs = []; fs = []
    for k, p in enumerate(pts):
        vs += [p + np.array([w_, 0, 0]), p - np.array([w_, 0, 0])]
    for k in range(len(pts) - 1):
        fs.append([2 * k, 2 * k + 1, 2 * k + 3, 2 * k + 2])
    extras_F.append(np.array(fs) + sum(len(x) for x in extras_V)); extras_V.append(np.array(vs))
EV = np.vstack(extras_V); EF = np.vstack(extras_F)
GV3 = np.vstack([GV2, EV]); GF3 = np.vstack([GF2, np.pad(EF, ((0, 0), (0, 0))) + len(GV2)])
log(f'snaps: {len(extras_V) - 2} discs; ties: 2 strips 24 mm wide, 26 cm long, lying under the back')
bpy.data.objects.remove(gown, do_unlink=True)
gown = H.new_mesh('gown', GV3, [tuple(int(x) for x in (f if f[-1] != f[-2] else f[:-1])) for f in GF3])
# texture coordinates: the weave and print tile every 29 x 28 cm, laid on the body's length
uvs = []
for p_ in gown.data.polygons:
    for vi in p_.vertices:
        pv = GV3[vi]
        ang = math.atan2(pv[2] - 0.15, pv[0])
        uvs.append(((ang * 0.30) / 0.29, pv[1] / 0.28))
lay = gown.data.uv_layers.new(name='UVMap'); lay.data.foreach_set('uv', np.asarray(uvs, np.float32).ravel())

# ================================================================ 4. skinning and shape keys from the skin under the gown
# bind to the trunk, thighs and upper arms only (the forearms and hands lie on top of the gown and must not drag it)
T_all = H.tris_of(Q)
fore_t = fore[T_all].any(1)
T = T_all[~fore_t]
bind = H.bind_to_surface(GV3, V, T)
tri, bc, off = bind
groups = {g.index: g.name for g in SB.vertex_groups if not g.name.startswith('zone_')}
W = np.zeros((len(V), len(groups)), np.float32); gi = {gidx: k for k, gidx in enumerate(groups)}
for v in SB.data.vertices:
    for g in v.groups:
        if g.group in gi:
            W[v.index, gi[g.group]] = g.weight
Wg = (W[T[tri, 0]] * bc[:, :1] + W[T[tri, 1]] * bc[:, 1:2] + W[T[tri, 2]] * bc[:, 2:3])
E_g = H.edges_of(np.array([list(p_.vertices) + [p_.vertices[-1]] * (4 - len(p_.vertices)) for p_ in gown.data.polygons]))
Wg = H.smooth_field(Wg, E_g, n_iter=12, lam=0.5)
Wg = Wg / np.maximum(Wg.sum(1, keepdims=True), 1e-8)
for gidx, k in gi.items():
    col = Wg[:, k]
    if col.max() < 1e-3:
        continue
    vg = gown.vertex_groups.new(name=groups[gidx])
    for i in np.nonzero(col > 1e-3)[0]:
        vg.add([int(i)], float(col[i]), 'REPLACE')
md = gown.modifiers.new('rig', 'ARMATURE'); md.object = arm; gown.parent = arm
kb = SB.data.shape_keys.key_blocks
gown.shape_key_add(name='Basis', from_mix=False)
for kname in ('breathe', 'press_ramped', 'press_lateral_left'):
    d = H.get_co(kb[kname].data, len(V)) - V
    dg_ = d[T[tri, 0]] * bc[:, :1] + d[T[tri, 1]] * bc[:, 1:2] + d[T[tri, 2]] * bc[:, 2:3]
    dg_ = H.smooth_field(dg_, E_g, n_iter=6, lam=0.5)
    k = gown.shape_key_add(name=kname, from_mix=False); H.set_co(k.data, GV3 + dg_)
log(f'gown skinned through {len(gown.vertex_groups)} groups; shape keys breathe, press_ramped, press_lateral_left carried from the skin')
# ================================================================ material: weave + an original small print
from PIL import Image
S_ = 1024
yy, xx = np.mgrid[0:S_, 0:S_] / S_
base = np.array([0.70, 0.80, 0.88])
img = np.ones((S_, S_, 3)) * base
# diamonds: 8 per tile side, navy, small
gx = (xx * 8) % 1.0 - 0.5; gy = (yy * 8) % 1.0 - 0.5
dia = (np.abs(gx) + np.abs(gy)) < 0.12
gx2 = ((xx * 8 + 0.5) % 1.0) - 0.5; gy2 = ((yy * 8 + 0.5) % 1.0) - 0.5
dot = (gx2 ** 2 + gy2 ** 2) < 0.04 ** 2
img[dia] = [0.16, 0.25, 0.45]; img[dot] = [0.35, 0.45, 0.62]
weave = np.asarray(Image.open(os.path.join(H.DL, 'ph-stretch_poplin', 'stretch_poplin_diff_2k.jpg')).convert('L').resize((S_, S_)), float) / 255.0
img = img * (0.86 + 0.28 * (weave - weave.mean()))[..., None]
Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(os.path.join(TEX, 'gown_basecolor.png'))
Image.open(os.path.join(H.DL, 'ph-stretch_poplin', 'stretch_poplin_nor_gl_2k.jpg')).resize((S_, S_)).save(os.path.join(TEX, 'gown_normal.png'))
m = bpy.data.materials.new('gown'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
ti = nt.nodes.new('ShaderNodeTexImage'); ti.image = bpy.data.images.load(os.path.join(TEX, 'gown_basecolor.png'))
nt.links.new(ti.outputs['Color'], b.inputs['Base Color'])
tn = nt.nodes.new('ShaderNodeTexImage'); tn.image = bpy.data.images.load(os.path.join(TEX, 'gown_normal.png')); tn.image.colorspace_settings.name = 'Non-Color'
nm = nt.nodes.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = 0.7
nt.links.new(tn.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
b.inputs['Roughness'].default_value = 0.82
m.use_backface_culling = False
gown.data.materials.append(m)
for p_ in gown.data.polygons:
    p_.use_smooth = True
log(f'gown: {len(gown.data.vertices)} vertices, {sum(len(p.vertices) - 2 for p in gown.data.polygons)} triangles')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_gown.blend'))
log('SAVED p25_gown.blend')
