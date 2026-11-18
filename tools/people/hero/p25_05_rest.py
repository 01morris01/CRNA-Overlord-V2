"""p25_05_rest.py: lay the hero patient p25 on the endoscopy stretcher on his back ('flat') and make that the rest pose.
   Blender -b --factory-startup --python tools/people/hero/p25_05_rest.py
 1. Standing -> lying frame (head toward +Y, face up +Z), armature and every mesh with every shape key.
 2. Flat pose: the whole figure tipped so the upper back and the buttocks lie in one plane; legs let down until the
    calves and heels touch, rolled out 12 degrees, feet relaxed; head let back until it rests on the mattress (no pillow
    on the pre-op stretcher); arms alongside the trunk, kept inside the mattress edge, so for this patient the upper arms
    lie against the chest wall and the forearms and hands rest on the flanks and the sides of the thighs.
 3. Lying soft tissue: the belly dome settles and spreads to the flanks (a simple gravity redistribution that keeps the
    volume), then the body is let down so the support points would be 30 mm into the mattress and every point under
    12 mm is pressed back to 12 mm with a soft edge and a small sideways bulge: a flattened contact 12 mm deep.
    Where an arm lies on the trunk, both surfaces are pressed to meet.
 4. That pose becomes the rest pose (skeleton, meshes, every shape key carried through the skinning).
 5. Placed on the measured stretcher: top of the head 30 mm from the mattress' head end, centred across it (he is
    long for this 1.94 m mattress: lying, head on a pillow and feet relaxed, he measures about 1.90 m).
 6. The skin is split at a seam loop just above the clavicles into skin_head and skin_body (shared seam vertices
    duplicated, same positions), so a replacement head can be fitted later.
Saves p25/blend/p25_rest.blend and work/rest.json."""
import bpy, os, sys, json, math
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Matrix, Vector, Quaternion
import hero_lib as H
import pose_lib as PL
import nicp

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
OUT = os.path.join(WORK, 'rest'); os.makedirs(OUT, exist_ok=True)
log = H.Log('rest')
ST = json.load(open(os.path.join(WORK, 'stretcher', 'stretcher.json')))
SN = np.load(os.path.join(WORK, 'stretcher', 'stretcher.npz'))
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_morphs.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']
MESHES = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == arm]
skin = bpy.data.objects['skin']
log('meshes:', [o.name for o in MESHES])

# ---------------------------------------------------------------- 1. standing -> lying
R = Matrix.Rotation(-math.pi / 2, 4, 'X')
arm.data.transform(R)
for o in MESHES:
    o.data.transform(R, shape_keys=True)
    o.matrix_parent_inverse = Matrix.Identity(4)
bpy.context.view_layer.update()
for pb in arm.pose.bones:
    pb.rotation_mode = 'QUATERNION'
P = arm.pose.bones
X, Y, Z = Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))
lab = {}
for nm, names in (('head', {'head', 'jaw', 'eye.L', 'eye.R'} | {b.name for b in arm.data.bones['head'].children_recursive}), ('neck', {'neck01', 'neck02', 'neck03'}),
                  ('armL', {b.name for b in arm.data.bones['clavicle.L'].children_recursive} - {'shoulder01.L'}), ('armR', {b.name for b in arm.data.bones['clavicle.R'].children_recursive} - {'shoulder01.R'}),
                  ('legs', {b.name for s in ('L', 'R') for b in [arm.data.bones['upperleg01.' + s]] + list(arm.data.bones['upperleg01.' + s].children_recursive)}),
                  ('hands', {b.name for s in ('L', 'R') for b in [arm.data.bones['wrist.' + s]] + list(arm.data.bones['wrist.' + s].children_recursive)}),
                  ('fore', {f'lowerarm0{i}.{s}' for i in (1, 2) for s in ('L', 'R')})):
    lab[nm] = PL.group_w(skin, names)
lab['torso'] = np.clip(1 - lab['head'] - lab['neck'] - lab['armL'] - lab['armR'] - lab['legs'], 0, 1)
ev = lambda: PL.evaluated(skin)
sel = lambda w, t=0.5: w > t
torso, legs, headm, arms = sel(lab['torso']), sel(lab['legs']), sel(lab['head']), sel(lab['armL'] + lab['armR'])
fore, hands = sel(lab['fore'] + lab['hands']), sel(lab['hands'])
info = {}

# ---------------------------------------------------------------- 2. flat pose
# a) tip the figure so the upper back and the seat share one support line (lowest line under the torso profile)
co = ev()
yz = co[torso][:, 1:]
yb = np.linspace(yz[:, 0].min(), yz[:, 0].max(), 70)
prof = np.array([[0.5 * (a + b), yz[(yz[:, 0] >= a) & (yz[:, 0] < b), 1].min(initial=9)] for a, b in zip(yb[:-1], yb[1:])])
prof = prof[prof[:, 1] < 8]
mid_y = 0.5 * (prof[0, 0] + prof[-1, 0])
best = None
for a in prof[prof[:, 0] < mid_y]:
    for b in prof[prof[:, 0] >= mid_y]:
        sl = (b[1] - a[1]) / (b[0] - a[0])
        if np.all(prof[:, 1] >= a[1] + sl * (prof[:, 0] - a[0]) - 1e-6):
            if best is None or abs(sl) < abs(best[0]):
                best = (sl, a, b)
tilt = math.atan(best[0]) if best else 0.0
PL.rot_world(arm, 'root', Quaternion(X, -tilt))
info['backTiltDeg'] = math.degrees(tilt)
co = ev()
z_back = co[torso, 2].min()


def floor_z(x, y):
    return np.full_like(np.asarray(x, float), z_back)


# b) legs: roll out 12 degrees, feet relax 25 degrees, then down until the backs of the legs touch the support line
for s, sx in (('L', 1.0), ('R', -1.0)):
    d = (P['foot.' + s].head - P['upperleg01.' + s].head).normalized()
    PL.rot_world(arm, 'upperleg01.' + s, Quaternion(d, sx * math.radians(12.0)))
    PL.rot_world(arm, 'foot.' + s, Quaternion(X, math.radians(15.0)))
base = PL.store(arm, ['upperleg01.L', 'upperleg01.R'])


def leg_gap(a):
    PL.restore(arm, base)
    for s in ('L', 'R'):
        PL.rot_world(arm, 'upperleg01.' + s, Quaternion(X, a))
    c = ev()
    return z_back - c[legs, 2].min()          # > 0 when the legs go below the line


a_leg = PL.bisect(lambda a: leg_gap(a), math.radians(-20), math.radians(20))
leg_gap(a_leg); info['hipDeg'] = math.degrees(a_leg)
PILLOW_H = 0.060            # a pre-op pillow under the head, about 60 mm high where the head presses it (pillow_head__flat)
# c) head: the lower neck tips back, upper neck and head tip forward a little, until the back of the head rests on the line
chain = (('neck01', -1.0), ('neck02', -0.5), ('neck03', 0.3), ('head', 0.6))
baseh = PL.store(arm, [n for n, _ in chain])


def head_gap(a):
    PL.restore(arm, baseh)
    for n, sh in chain:
        PL.rot_world(arm, n, Quaternion(X, a * sh))
    c = ev()
    return (z_back + PILLOW_H) - c[headm, 2].min()


a_head = PL.bisect(head_gap, math.radians(-25), math.radians(45))
head_gap(a_head); info['neckDeg'] = math.degrees(a_head)
co = ev()
info['headAbovePillowTopMM'] = float((co[headm, 2].min() - z_back - PILLOW_H) * 1000)
# d) arms. The trunk is wider than the mattress allows arms beside it, so, as a large patient lies on a narrow
#    stretcher, the upper arms lie against the chest wall and flanks and the forearms and hands rest on the sides of the
#    belly and the upper thighs; nothing goes past the mattress edge. Elbow and wrist are placed on the body surface
#    (lowest place within reach, inside the edge), then the bones are aimed at them.
half_w = 0.5 * ST['pad_width'] - 0.010
QALL = H.quads_of(skin)


def surface(mask_w):
    c = ev(); n = H.vertex_normals(c, QALL)
    idx = np.nonzero(mask_w > 0.5)[0]
    return c, n, idx


def radius_about(c, m, a_, b_):
    seg = b_ - a_; L = np.linalg.norm(seg); u = seg / L
    pts = c[m]; t = np.clip((pts - a_) @ u, 0.15 * L, 0.85 * L)
    near = np.abs((pts - a_) @ u - t) < 1e-9
    d = np.linalg.norm(pts - a_ - np.outer(t, u), axis=1)
    return float(np.median(d))


def palm_normal(s, sx):
    w = P['wrist.' + s].head
    n = (P['finger2-1.' + s].head - w).cross(P['finger5-1.' + s].head - w)
    return (n * sx).normalized()


for s, sx in (('L', 1.0), ('R', -1.0)):
    m = sel(lab['arm' + s])
    names = [n + '.' + s for n in ('upperarm01', 'upperarm02', 'lowerarm01', 'lowerarm02', 'wrist')] + [f'finger{i}-{j}.{s}' for i in range(1, 6) for j in (1, 2, 3)]
    PL.reset_pose(arm, names)
    c, n, _ = surface(lab['torso'] + lab['legs'])
    sh, el, wr = (np.array(P[b + '.' + s].head) for b in ('upperarm01', 'lowerarm01', 'wrist'))
    L1, L2 = np.linalg.norm(el - sh), np.linalg.norm(wr - el)
    r_up = radius_about(c, sel(PL.group_w(skin, {'upperarm01.' + s, 'upperarm02.' + s})), sh, el)
    r_fo = radius_about(c, sel(PL.group_w(skin, {'lowerarm01.' + s, 'lowerarm02.' + s})), el, wr)
    body = np.nonzero(((lab['torso'] + lab['legs']) > 0.5) & (c[:, 0] * sx > 0.02))[0]
    # elbow: on the side of the chest or flank, L1 from the shoulder, toward the feet
    cand = body[(np.abs(np.linalg.norm(c[body] - sh, axis=1) - L1) < 0.05) & (c[body, 1] < sh[1] - 0.10) & (n[body, 0] * sx > 0.0)]
    centres = c[cand] + n[cand] * r_up
    ok = (centres[:, 0] * sx + r_up <= half_w) & (centres[:, 2] - r_up > z_back - 0.005)
    score = centres[:, 2] + 0.5 * np.abs(np.linalg.norm(centres - sh, axis=1) - L1) + 5.0 * np.maximum(centres[:, 0] * sx + r_up - half_w, 0)
    score[~ok] += 1.0
    e_t = centres[np.argmin(score)]
    PL.aim(arm, 'upperarm01.' + s, 'lowerarm01.' + s, Vector(e_t - sh))
    el = np.array(P['lowerarm01.' + s].head)
    # wrist: on the side of the belly or the top of the thigh, L2 from the elbow, further toward the feet
    cand = body[(np.abs(np.linalg.norm(c[body] - el, axis=1) - L2) < 0.04) & (c[body, 1] < el[1] - 0.08) & (n[body, 2] > -0.1)]
    centres = c[cand] + n[cand] * (0.6 * r_fo)
    ok = (centres[:, 0] * sx + r_fo <= half_w)
    score = centres[:, 2] + 0.3 * np.abs(np.linalg.norm(centres - el, axis=1) - L2) + 5.0 * np.maximum(centres[:, 0] * sx + r_fo - half_w, 0)
    score[~ok] += 1.0
    w_t = centres[np.argmin(score)]
    PL.aim(arm, 'lowerarm01.' + s, 'wrist.' + s, Vector(w_t - el))
    # hand in line with the forearm, palm down onto the thigh and a little toward the body, fingers relaxed
    fd = (P['wrist.' + s].head - P['lowerarm01.' + s].head).normalized()
    PL.aim(arm, 'wrist.' + s, 'finger3-1.' + s, fd + Vector((0, 0, -0.25)))
    axis = (P['wrist.' + s].head - P['lowerarm01.' + s].head).normalized()
    want = Vector((-sx * 0.35, 0, -1.0)); want = (want - axis * want.dot(axis)).normalized()
    pn = -palm_normal(s, sx); pn = (pn - axis * pn.dot(axis)).normalized()       # (index x little knuckle) is the back of the hand
    ang = math.atan2(axis.dot(pn.cross(want)), pn.dot(want))
    for nm, share in (('lowerarm01.', 0.35), ('lowerarm02.', 0.45), ('wrist.', 0.2)):
        PL.rot_world(arm, nm + s, Quaternion(axis, ang * share))
    dorsal = palm_normal(s, sx)
    for i in range(2, 6):
        for j, deg in ((1, 14.0), (2, 16.0), (3, 8.0)):
            pb = P[f'finger{i}-{j}.{s}']; side_ax = Vector(pb.y_axis).cross(dorsal)
            if side_ax.length > 1e-6:
                PL.rot_world(arm, pb.name, Quaternion(side_ax.normalized(), -math.radians(deg)))
    info['upperArmRadiusMM' + s] = r_up * 1000; info['elbowTargetX' + s] = float(e_t[0]); info['wristTargetX' + s] = float(w_t[0])
    info['palmTurnDeg' + s] = math.degrees(ang)
# e) place on the stretcher: centred across, the top of the head HEAD_GAP from the mattress' head end, back on z = 0
HEAD_GAP = 0.030
co = ev()
pad_head_y = -ST['pad_z'][0]                          # patient z (head end negative) -> lying y
shift = Vector((-0.5 * (co[torso, 0].min() + co[torso, 0].max()), (pad_head_y - HEAD_GAP) - co[headm, 1].max(), -z_back))
P['root'].matrix = Matrix.Translation(shift) @ P['root'].matrix
bpy.context.view_layer.update()
z_back = 0.0
info['placedShift'] = list(map(float, shift))
co = ev()
info['widthWithArms'] = float(co[:, 0].max() - co[:, 0].min())
log('POSE ' + ', '.join(f'{k} {v:.3f}' if isinstance(v, float) else f'{k} {v}' for k, v in info.items()))
log(f'body bbox after placing: {co.min(0).round(3)} .. {co.max(0).round(3)}')
for nm_, w_ in (('torso', lab['torso']), ('upper arms', lab['armL'] + lab['armR'] - lab['fore'] - lab['hands']), ('forearms', lab['fore']), ('hands', lab['hands']), ('legs', lab['legs']), ('head', lab['head'])):
    mm = w_ > 0.5
    log(f'   {nm_}: |x| max {np.abs(co[mm, 0]).max():.3f} m (mattress half width {0.5 * ST["pad_width"]:.3f})')

# ================================================================== 3. pose -> geometry; lying soft tissue; contact
def posed_arrays(o):
    S = H.skin_matrices(arm, o)
    k = o.data.shape_keys
    base = H.get_co(k.key_blocks[0].data, len(o.data.vertices)) if k else H.get_co(o.data.vertices, len(o.data.vertices))
    out = {'__basis__': H.apply_mats(S, base)}
    if k:
        for kk in k.key_blocks[1:]:
            out[kk.name] = H.apply_mats_dir(S, H.get_co(kk.data, len(kk.data)) - base)
    return out


POSED = {o.name: posed_arrays(o) for o in MESHES}
SB = POSED['skin']['__basis__'].copy()
QS = H.quads_of(skin); ES = H.edges_of(QS)
# a) the belly dome settles and spreads toward the flanks (lying on the back), volume kept
tw = np.clip(lab['torso'] + 0.6 * lab['legs'] * (SB[:, 1] > SB[lab['legs'] > 0.5, 1].max() - 0.25), 0, 1)
tw = H.smooth_field(tw, ES, n_iter=10, lam=0.5)
ys = SB[:, 1]
bands = np.linspace(ys[tw > 0.5].min(), ys[tw > 0.5].max(), 40)
zmid = np.zeros(len(SB)); zmax = np.zeros(len(SB)) + 1e-3; xc = np.zeros(len(SB))
for a_, b_ in zip(bands[:-1], bands[1:]):
    m = (ys >= a_) & (ys < b_) & (tw > 0.5)
    if m.sum() < 10:
        continue
    zb = SB[m, 2]; sel_ = (ys >= a_ - 0.03) & (ys < b_ + 0.03)
    zmid[sel_] = 0.5 * (zb.min() + zb.max()); zmax[sel_] = zb.max(); xc[sel_] = np.median(SB[m, 0])
h = np.clip((SB[:, 2] - zmid) / np.maximum(zmax - zmid, 1e-3), 0, 1)
ALPHA = 0.11


def spread(beta):
    out = SB.copy()
    out[:, 2] -= ALPHA * np.maximum(SB[:, 2] - zmid, 0) * tw
    out[:, 0] += beta * (SB[:, 0] - xc) * tw * (1 - 0.6 * h) * np.clip(np.abs(SB[:, 0] - xc) / 0.12, 0, 1)
    return out


v0 = H.volume(SB, QS)
beta = PL.bisect(lambda b: abs(H.volume(spread(b), QS)) - abs(v0), 0.0, 0.3)
SB2 = spread(beta)
info['domeSettlePct'] = ALPHA * 100; info['flankSpreadPct'] = beta * 100
info['bellyTopBeforeAfterMM'] = [float(SB[tw > 0.5, 2].max() * 1000), float(SB2[tw > 0.5, 2].max() * 1000)]
# b) arms and trunk meet where an arm lies on the trunk: both surfaces pressed half the overlap each, smoothed
armw = lab['armL'] + lab['armR']
is_arm = armw > 0.5; is_tr = (lab['torso'] + lab['legs']) > 0.5
for it in range(3):
    Ns = H.vertex_normals(SB2, QS)
    tri_t = QS[is_tr[QS].all(1)]; tri_a = QS[is_arm[QS].all(1)]
    tree_t = H.bvh(SB2, tri_t); tree_a = H.bvh(SB2, tri_a)
    disp = np.zeros_like(SB2); worst = 0.0
    shoulder_zone = np.zeros(len(SB2), bool)
    for s_ in ('L', 'R'):
        shoulder_zone |= np.linalg.norm(SB2 - np.array(P['upperarm01.' + s_].head), axis=1) < 0.13
    for i in np.nonzero(is_arm & ~shoulder_zone)[0]:
        loc, nrm, fi, d = tree_t.find_nearest(Vector(SB2[i]), 0.08)
        if loc is not None and (Vector(SB2[i]) - loc).dot(nrm) < 0:
            disp[i] += np.array(nrm) * d * 0.55; worst = max(worst, d)
    for i in np.nonzero(is_tr & ~shoulder_zone)[0]:
        loc, nrm, fi, d = tree_a.find_nearest(Vector(SB2[i]), 0.08)
        if loc is not None and (Vector(SB2[i]) - loc).dot(nrm) < 0:
            disp[i] += np.array(nrm) * d * 0.55
    moved = np.linalg.norm(disp, axis=1) > 0
    disp = H.smooth_field(disp, ES, n_iter=4, keep=moved, lam=0.5)
    SB2 = SB2 + disp
    if it == 0:
        info['armTrunkOverlapMM'] = worst * 1000
# c) let down 30 mm and press: everything under 12 mm below the mattress top comes back to -12 mm (not the head)
DROP, SINK = 0.030, 0.012
SB2[:, 2] -= DROP
SB2_prepress = SB2.copy()
not_head = (lab['head'] + lab['neck'] * 0.0) < 0.5
Ns = H.vertex_normals(SB2, QS)
SB3, dz = PL.soft_floor(SB2, not_head.astype(float), lambda x, y: np.full_like(x, -SINK), depth_soft=0.006, normals=Ns, spread=0.5, E=ES)
info['pressedVertices'] = int((dz > 1e-4).sum()); info['pressDepthMaxMM'] = float(dz.max() * 1000)
info['contactAreaCM2'] = float((SB3[:, 2] < -SINK + 0.0015).sum())
# d) tissue does not compress: the volume the posing and pressing lost is given back as a small even swelling of the
#    soft parts (trunk, thighs, upper arms), away from the contact patches
FORMJ = json.load(open(os.path.join(WORK, 'form.json')))
v_target = FORMJ['volume_m3']
soft = np.clip(lab['torso'] + lab['legs'] * 0.7 + (lab['armL'] + lab['armR'] - lab['fore'] - lab['hands']) * 0.6, 0, 1) * (SB3[:, 2] > -SINK + 0.004)
soft = H.smooth_field(soft.astype(float), ES, n_iter=6, lam=0.5)
NS3 = H.vertex_normals(SB3, QS)
v_before = abs(H.volume(SB3, QS))
dn = PL.bisect(lambda d: abs(H.volume(SB3 + NS3 * (d * soft)[:, None], QS)) - v_target, 0.0, 0.02)
SB3 = SB3 + NS3 * (dn * soft)[:, None]
info['volumePosedBeforeRestoreL'] = v_before * 1000; info['volumeRestoreSwellMM'] = dn * 1000
skin_fix = SB3 - SB
PRESS_FLAT = SB3 - SB2_prepress
# every other mesh: the drop only
POSED['skin']['__basis__'] = SB3
for nm in POSED:
    if nm != 'skin':
        POSED[nm]['__basis__'][:, 2] -= DROP
info['headLowestZ'] = float(SB3[lab['head'] > 0.5, 2].min())
info['volumeAfterL'] = abs(H.volume(SB3, QS)) * 1000

# ================================================================== 4. this pose becomes the rest pose
bpy.context.view_layer.objects.active = arm
for o in bpy.context.selected_objects:
    o.select_set(False)
arm.select_set(True)
bpy.ops.object.mode_set(mode='POSE')
bpy.ops.pose.armature_apply(selected=False)
bpy.ops.object.mode_set(mode='OBJECT')
# the drop belongs to the rest skeleton too
arm.data.transform(Matrix.Translation((0, 0, -DROP)))
for o in MESHES:
    PA = POSED[o.name]
    k = o.data.shape_keys
    if k:
        H.set_co(k.key_blocks[0].data, PA['__basis__'])
        for kk in k.key_blocks[1:]:
            H.set_co(kk.data, PA['__basis__'] + PA[kk.name])
    H.set_co(o.data.vertices, PA['__basis__'])
    o.data.update()
bpy.context.view_layer.update()
co_rest = PL.evaluated(skin)
info['restCheckMM'] = float(np.abs(co_rest - SB3).max() * 1000)
log('REST ' + ', '.join(f'{k} {v}' for k, v in info.items() if k in ('domeSettlePct', 'flankSpreadPct', 'bellyTopBeforeAfterMM', 'armTrunkOverlapMM', 'pressedVertices', 'pressDepthMaxMM', 'contactAreaCM2', 'headLowestZ', 'volumeAfterL', 'restCheckMM', 'volumePosedBeforeRestoreL', 'volumeRestoreSwellMM')))

# ================================================================== 6. skin_head and skin_body, split at a seam loop above the clavicles
import bmesh
REST = PL.evaluated(skin)
n01, hd = np.array(arm.data.bones['neck01'].head_local), np.array(arm.data.bones['head'].head_local)
axis = (hd - n01) / np.linalg.norm(hd - n01)
cmid = 0.5 * (np.array(arm.data.bones['clavicle.L'].head_local) + np.array(arm.data.bones['clavicle.R'].head_local))
tree = H.bvh(REST, QS)
fwd = np.cross(axis, np.array([1.0, 0, 0])); fwd = fwd if fwd[2] > 0 else -fwd          # the front of the neck (up, lying)
hit = tree.ray_cast(Vector(cmid + fwd * 0.3), Vector(-fwd))
notch = np.array(hit[0]) if hit[0] is not None else cmid
fc = np.array([REST[list(p.vertices)].mean(0) for p in skin.data.polygons])
headlab = lab['head'] + lab['neck']
fh = np.array([headlab[list(p.vertices)].mean() for p in skin.data.polygons])
# face adjacency through edges
from collections import defaultdict
edge_faces = defaultdict(list)
for p_ in skin.data.polygons:
    vs = list(p_.vertices)
    for k in range(len(vs)):
        edge_faces[tuple(sorted((vs[k], vs[(k + 1) % len(vs)])))].append(p_.index)
nbr = defaultdict(set)
for fl in edge_faces.values():
    for f1 in fl:
        nbr[f1].update(x for x in fl if x != f1)


def head_faces(h):
    pp = notch + axis * h
    fd_ = (fc - pp) @ axis
    fr_ = np.linalg.norm((fc - pp) - np.outer(fd_, axis), axis=1)
    ok = (fd_ > 0) & ((fr_ < 0.15) | (fd_ > 0.07))
    seed = [i for i in np.nonzero(ok & (fh > 0.95))[0]]
    keep = np.zeros(len(fc), bool); keep[seed] = True
    stack = list(seed)
    while stack:
        f_ = stack.pop()
        for g_ in nbr[f_]:
            if not keep[g_] and ok[g_]:
                keep[g_] = True; stack.append(g_)
    dv = (REST - pp) @ axis
    fvh = np.zeros(len(REST), bool); fvb = np.zeros(len(REST), bool)
    for p_, h_ in zip(skin.data.polygons, keep):
        for v in p_.vertices:
            (fvh if h_ else fvb)[v] = True
    sm = fvh & fvb
    return keep, sm, pp, dv, (np.abs(dv[sm]).max() if sm.any() else 9.0)


# the seam follows the skeleton's own neck: faces mostly carried by the neck and head bones are the head piece
# (an isoline of MakeHuman's weights, which runs round the base of the neck above the clavicles); its vertices are then
# eased onto a plane fitted to them, so the loop is clean and planar
fhw = np.array([headlab[list(p.vertices)].mean() for p in skin.data.polygons])
# the seam: the plane across the neck at SEAM_UP above the sternal notch, limited to skin the neck and head bones carry
# (so it cannot run out over the shoulders); the lowest height whose loop is clean is used
fhw = np.array([headlab[list(p.vertices)].max() for p in skin.data.polygons])
for SEAM_UP in (0.006, 0.010, 0.014, 0.018, 0.022, 0.026, 0.030, 0.035, 0.040):
    pp = notch + axis * SEAM_UP
    fd_ = (fc - pp) @ axis
    ok = (fd_ > 0) & (fhw > 0.02)
    keep = np.zeros(len(fc), bool); seed = list(np.nonzero(ok & (fh > 0.99))[0][:1]); keep[seed] = True; stack = list(seed)
    while stack:
        f_ = stack.pop()
        for g_ in nbr[f_]:
            if not keep[g_] and ok[g_]:
                keep[g_] = True; stack.append(g_)
    fvh = np.zeros(len(REST), bool); fvb = np.zeros(len(REST), bool)
    for p_, h_ in zip(skin.data.polygons, keep):
        for v in p_.vertices:
            (fvh if h_ else fvb)[v] = True
    seam = fvh & fvb
    dv = (REST - pp) @ axis
    worst = np.abs(dv[seam]).max()
    ax0 = (hd - n01) / np.linalg.norm(hd - n01)
    log(f'seam try {SEAM_UP * 1000:.0f} mm: {int(seam.sum())} vertices, farthest from the plane {worst * 1000:.1f} mm')
    if worst < 0.012:
        break
is_head_face = keep
cP = REST[seam].mean(0); U_, S_, Vt_ = np.linalg.svd(REST[seam] - cP); pn = Vt_[2]
if np.dot(pn, axis) < 0:
    pn = -pn
axis = pn; plane_p = cP
d = (REST - plane_p) @ axis
SEAM_UP = float(np.dot(plane_p - notch, axis))
log(f'seam: fitted plane through the loop {SEAM_UP * 1000:.1f} mm above the sternal notch along its normal; {int(seam.sum())} vertices, farthest {np.abs(d[seam]).max() * 1000:.1f} mm from it')
# boundary vertices onto the plane, with their neighbours eased, so the seam is a clean planar loop
move = np.zeros_like(REST); move[seam] = -np.outer(d[seam], axis)
move = H.smooth_field(move, ES, n_iter=3, keep=seam, lam=0.5) * (np.abs(d) < 0.02)[:, None]
kb = skin.data.shape_keys.key_blocks
base_k = H.get_co(kb[0].data, len(REST))
for kk in kb:
    H.set_co(kk.data, H.get_co(kk.data, len(REST)) + move)
H.set_co(skin.data.vertices, base_k + move); skin.data.update()
REST = REST + move
log(f'seam: plane {SEAM_UP * 1000:.0f} mm above the sternal notch along the neck axis (notch {notch.round(4)}); {int(seam.sum())} seam vertices, largest snap {np.abs(d[seam]).max() * 1000:.1f} mm; head faces {int(is_head_face.sum())}')
NRM = H.vertex_normals(REST, QS)


def split(name, keep_faces):
    o = skin.copy(); o.data = skin.data.copy(); o.name = name; o.data.name = name
    bpy.context.scene.collection.objects.link(o)
    bm_ = bmesh.new(); bm_.from_mesh(o.data); bm_.faces.ensure_lookup_table()
    orig = bm_.verts.layers.int.get('orig')
    idx_layer = bm_.verts.layers.int.new('restidx')
    for v in bm_.verts:
        v[idx_layer] = v.index
    bmesh.ops.delete(bm_, geom=[bm_.faces[i] for i in range(len(bm_.faces)) if not keep_faces[i]], context='FACES')
    bmesh.ops.delete(bm_, geom=[v for v in bm_.verts if not v.link_faces], context='VERTS')
    bm_.to_mesh(o.data); bm_.free(); o.data.update()
    ri = np.empty(len(o.data.vertices), np.int32); o.data.attributes['restidx'].data.foreach_get('value', ri)
    o.data.normals_split_custom_set_from_vertices([tuple(NRM[i]) for i in ri])
    return o, ri


o_head, ri_h = split('skin_head', is_head_face)
o_body, ri_b = split('skin_body', ~is_head_face)
for o_, mn in ((o_head, 'skin_head'), (o_body, 'skin_body')):
    o_.data.materials.clear(); m_ = bpy.data.materials.get('skin').copy(); m_.name = mn; o_.data.materials.append(m_)
# shapes: the head keeps the face shapes; the body keeps only those that move it (breathe)
for o_ in (o_head, o_body):
    b0 = H.get_co(o_.data.shape_keys.key_blocks[0].data, len(o_.data.vertices))
    for kk in list(o_.data.shape_keys.key_blocks[1:]):
        if np.abs(H.get_co(kk.data, len(o_.data.vertices)) - b0).max() < 1e-6 and not (o_ is o_body and kk.name == 'breathe'):
            o_.shape_key_remove(kk)
seam_rest = REST[seam]
# order the seam loop around the axis
u_, v_ = H.plane_basis(axis)
ang = np.arctan2((seam_rest - plane_p) @ v_, (seam_rest - plane_p) @ u_)
seam_rest = seam_rest[np.argsort(ang)]
info['seam'] = dict(plane_point=plane_p, plane_normal=axis, above_sternal_notch_mm=SEAM_UP * 1000, vertices=seam_rest.round(5).tolist(), count=int(seam.sum()),
                    head_faces=int(is_head_face.sum()), body_faces=int((~is_head_face).sum()), sternal_notch=notch)
log(f'skin_head {len(o_head.data.vertices)} vertices, {len(o_head.data.shape_keys.key_blocks) - 1} shapes; skin_body {len(o_body.data.vertices)} vertices, {len(o_body.data.shape_keys.key_blocks) - 1} shapes')
np.savez_compressed(os.path.join(WORK, 'rest_split.npz'), ri_h=ri_h, ri_b=ri_b, seam=np.nonzero(seam)[0], REST=REST, press_flat=PRESS_FLAT, seam_move=move, **{'lab_' + k: v for k, v in lab.items()})
bpy.data.objects.remove(skin, do_unlink=True)
REST_ALL = np.vstack([H.world_coords(o) for o in bpy.data.objects if o.type == 'MESH' and o.parent == arm])
info['restBBoxLying'] = [REST_ALL.min(0).round(4).tolist(), REST_ALL.max(0).round(4).tolist()]
info['padHalfLength'] = ST['pad_z'][1]
log(f'rest bbox (lying frame): {REST_ALL.min(0).round(3)} .. {REST_ALL.max(0).round(3)}; mattress y -{ST["pad_z"][1]:.3f}..{ST["pad_z"][1]:.3f}, x +-{0.5 * ST["pad_width"]:.3f}')
H.save_json(os.path.join(WORK, 'rest.json'), info)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_rest.blend'))
log('SAVED p25_rest.blend')
