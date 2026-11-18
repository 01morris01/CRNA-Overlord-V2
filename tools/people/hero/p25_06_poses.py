"""p25_06_poses.py: the hero patient's pose clips, solved against the measured endoscopy stretcher.
   Blender -b --factory-startup --python tools/people/hero/p25_06_poses.py
Clips (one keyframe each, body bones only, never jaw, eyes, tongue or lids):
  flat          the rest pose (p25_05_rest.py).
  ramped        head-elevated ("ramped") laryngoscopy position for an obese patient: trunk raised on a foam ramp about 27
                degrees from the hips, the head raised further on a head support until the ear canal is level with the
                sternal notch and the face plane is horizontal; arms at the sides, palms toward the body, the right arm
                a little out for the antecubital IV.
  lateral_left  left lateral decubitus for EGD and colonoscopy: on the left side facing +X, head on a pillow in line with
                the spine with a little neck flexion, left arm forward (shoulder flexed ~85 degrees, elbow bent, hand
                toward the pillow), right arm forward on a pillow, hips flexed ~65 degrees (right ~72) and knees ~90
                degrees, right leg further forward, pillow between the knees, back parallel to the -X edge.
Saves the actions into p25/blend/p25_poses.blend and work/poses.json (bone rotations, solved numbers)."""
import bpy, os, sys, json, math
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Matrix, Vector, Quaternion
import hero_lib as H
import pose_lib as PL

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
OUT = os.path.join(WORK, 'poses'); os.makedirs(OUT, exist_ok=True)
log = H.Log('poses')
ST = json.load(open(os.path.join(WORK, 'stretcher', 'stretcher.json')))
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_rest.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']; P = arm.pose.bones
for pb in P:
    pb.rotation_mode = 'QUATERNION'
SH, SB = bpy.data.objects['skin_head'], bpy.data.objects['skin_body']
X, Y, Z = Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))
HALF_W = 0.5 * ST['pad_width']; HALF_L = ST['pad_z'][1]
REST_H, REST_B = PL.evaluated(SH), PL.evaluated(SB)
BODY_BONES = [b.name for b in arm.data.bones if not any(t in b.name for t in ('jaw', 'eye', 'tongue', 'oris', 'levator', 'orbicularis', 'oculi', 'risorius', 'temporalis', 'special'))]
log(f'body bones keyed: {len(BODY_BONES)} of {len(arm.data.bones)}')
ZONE = lambda o, n: PL.group_w(o, {'zone_' + n})
ears = ZONE(SH, 'ears')


# ---------------------------------------------------------------- landmarks on the rest skin (vertex indices)
def nearest(V, p):
    return int(np.argmin(np.linalg.norm(V - np.asarray(p), axis=1)))


RJ = json.load(open(os.path.join(WORK, 'rest.json')))
LM = {}
LM['notch'] = ('skin_body', nearest(REST_B, RJ['seam']['sternal_notch']))
eyeL = np.array(arm.data.bones['eye.L'].head_local); eyeR = np.array(arm.data.bones['eye.R'].head_local)
mid_eye = 0.5 * (eyeL + eyeR)
midl = np.abs(REST_H[:, 0]) < 0.004
cand = np.nonzero(midl & (np.abs(REST_H[:, 1] - (mid_eye[1] + 0.012)) < 0.006))[0]
LM['glabella'] = ('skin_head', int(cand[np.argmax(REST_H[cand, 2])]))
cand = np.nonzero(midl & (REST_H[:, 1] < mid_eye[1] - 0.085) & (REST_H[:, 1] > mid_eye[1] - 0.12))[0]
LM['pogonion'] = ('skin_head', int(cand[np.argmax(REST_H[cand, 2])]))
for s, sx in (('L', 1), ('R', -1)):
    e = np.nonzero((ears > 0.5) & (REST_H[:, 0] * sx > 0))[0]
    c = REST_H[e].mean(0)
    near = e[np.linalg.norm(REST_H[e] - c, axis=1) < 0.018]
    LM['eam' + s] = ('skin_head', int(near[np.argmin(np.abs(REST_H[near, 0]))]))
log('landmarks:', {k: (v[0], v[1], (REST_H if v[0] == 'skin_head' else REST_B)[v[1]].round(3).tolist()) for k, v in LM.items()})


def lm(name, H_=None, B_=None):
    o, i = LM[name]
    return (H_ if o == 'skin_head' else B_)[i]


def cur():
    return PL.evaluated(SH), PL.evaluated(SB)


def keys_of_pose():
    return {n: P[n].matrix_basis.copy() for n in BODY_BONES}


POSES = {}
INFO = {}

# ================================================================ ramped
PL.reset_pose(arm)
TH_R = math.radians(27.0)
for n, share in (('spine05', 0.45), ('spine04', 0.35), ('spine03', 0.20)):
    PL.rot_world(arm, n, Quaternion(X, TH_R * share))
Hh, Bb = cur()
trunk_ang = math.degrees(math.atan2(lm('notch', Hh, Bb)[2] - 0, 1))
neck_base = PL.store(arm, ['neck01', 'neck02', 'neck03', 'head'])


def head_pose(flex, ext):
    PL.restore(arm, neck_base)
    PL.rot_world(arm, 'neck01', Quaternion(X, flex * 0.6)); PL.rot_world(arm, 'neck02', Quaternion(X, flex * 0.4))
    PL.rot_world(arm, 'head', Quaternion(X, -ext * 0.7)); PL.rot_world(arm, 'neck03', Quaternion(X, -ext * 0.3))


def face_tilt(flex, ext):
    head_pose(flex, ext); Hh, Bb = cur()
    return lm('glabella', Hh, Bb)[2] - lm('pogonion', Hh, Bb)[2]      # > 0: chin lower than forehead (face tipped toward the feet)


def ear_vs_notch(flex):
    ext = PL.bisect(lambda e: -face_tilt(flex, e), math.radians(-40), math.radians(70))
    head_pose(flex, ext); Hh, Bb = cur()
    eam = 0.5 * (lm('eamL', Hh, Bb) + lm('eamR', Hh, Bb))
    return eam[2] - lm('notch', Hh, Bb)[2], ext


flex = PL.bisect(lambda f: ear_vs_notch(f)[0], math.radians(-10), math.radians(60))
dz, ext = ear_vs_notch(flex)
Hh, Bb = cur()
INFO['ramped'] = dict(trunkDeg=27.0, neckFlexDeg=math.degrees(flex), headExtDeg=math.degrees(ext), earMinusNotchMM=dz * 1000,
                      faceTiltMM=float((lm('glabella', Hh, Bb) - lm('pogonion', Hh, Bb))[2] * 1000))
# right arm a little out from the side for the antecubital IV (kept on the mattress)
PL.rot_world(arm, 'upperarm01.R', Quaternion(Z, math.radians(-0.0)))
sh = Vector(P['upperarm01.R'].head)
base_r = PL.store(arm, ['upperarm01.R'])
Hh, Bb = cur()
armR = PL.group_w(SB, {n + '.R' for n in ('upperarm01', 'upperarm02', 'lowerarm01', 'lowerarm02', 'wrist')}) > 0.5


def r_out(a):
    PL.restore(arm, base_r)
    axis = (Vector(P['lowerarm01.R'].head) - sh).cross(Z).normalized()
    PL.rot_world(arm, 'upperarm01.R', Quaternion(Vector((0, 0, 1)), -a))
    Hh, Bb = cur()
    return -(Bb[armR, 0].min() + HALF_W - 0.012)


a_out = PL.bisect(lambda a: -r_out(a), 0.0, math.radians(14.0))
r_out(min(a_out, math.radians(12.0)))
INFO['ramped']['rightArmOutDeg'] = math.degrees(min(a_out, math.radians(12.0)))
POSES['ramped'] = keys_of_pose()
log('RAMPED', {k: round(v, 1) for k, v in INFO['ramped'].items()})

# ================================================================ lateral_left
LEGL = PL.group_w(SB, {n + '.L' for n in ('upperleg01', 'upperleg02', 'lowerleg01', 'lowerleg02')}) > 0.5
LEGR = PL.group_w(SB, {n + '.R' for n in ('upperleg01', 'upperleg02', 'lowerleg01', 'lowerleg02')}) > 0.5
ARMS = PL.group_w(SB, {n + s for n in ('upperarm01', 'upperarm02', 'lowerarm01', 'lowerarm02', 'wrist') for s in ('.L', '.R')}) > 0.5
KNEE_GAP = 0.085                       # the knee pillow, compressed between the knees


BETA_L = [0.0]


def lateral(hip_l, knee_l, extra_r, abd_r):
    PL.reset_pose(arm)
    for s_, hip, knee in (('L', hip_l, knee_l), ('R', hip_l + extra_r, knee_l + 5.0)):
        PL.rot_world(arm, 'upperleg01.' + s_, Quaternion(X, -math.radians(hip)))
        PL.rot_world(arm, 'lowerleg01.' + s_, Quaternion(X, math.radians(knee)))
        PL.rot_world(arm, 'foot.' + s_, Quaternion(X, -math.radians(10.0)))
    # the top (right) thigh lifted away from the lower one so the knees rest on the pillow
    PL.rot_world(arm, 'upperleg01.R', Quaternion(Y, -math.radians(abd_r)))
    PL.aim(arm, 'upperarm01.L', 'lowerarm01.L', Vector((0.20, math.sin(BETA_L[0]), math.cos(BETA_L[0]))))
    PL.aim(arm, 'lowerarm01.L', 'wrist.L', Vector((0.08, 1.0, 0.12)))
    PL.aim(arm, 'wrist.L', 'finger3-1.L', Vector((0.05, 1.0, 0.1)))
    PL.aim(arm, 'upperarm01.R', 'lowerarm01.R', Vector((0.0, -0.95, 0.35)))
    PL.aim(arm, 'lowerarm01.R', 'wrist.R', Vector((0.05, -1.0, 0.35)))
    PL.aim(arm, 'wrist.R', 'finger3-1.R', Vector((0.05, -1.0, 0.2)))
    PL.rot_world(arm, 'neck01', Quaternion(X, math.radians(6.0))); PL.rot_world(arm, 'neck02', Quaternion(X, math.radians(4.0)))
    root_head = Vector(P['root'].head)
    PL.rot_world(arm, 'root', Quaternion(Y, math.radians(90.0)), pivot=root_head)
    Hh, Bb = cur(); allv = np.vstack([Hh, Bb])
    dx = (-HALF_W + 0.012) - Bb[~ARMS, 0].min()
    dzz = -0.030 - allv[:, 2].min()
    dy = min(0.0, (HALF_L - 0.03) - allv[:, 1].max())
    P['root'].matrix = Matrix.Translation((dx, dy, dzz)) @ P['root'].matrix
    bpy.context.view_layer.update()
    return cur()


# hip flexion: as much as the mattress width allows, up to the 65 degrees asked
def knee_out(hip):
    Hh, Bb = lateral(hip, 92.0, 7.0, 6.0)
    return Bb[LEGL | LEGR, 0].max() - (HALF_W - 0.008)


ARML = PL.group_w(SB, {n + '.L' for n in ('upperarm01', 'upperarm02', 'lowerarm01', 'lowerarm02', 'wrist')} | {f'finger{i}-{j}.L' for i in range(1, 6) for j in (1, 2, 3)}) > 0.5
ARMR = PL.group_w(SB, {n + '.R' for n in ('upperarm01', 'upperarm02', 'lowerarm01', 'lowerarm02', 'wrist')} | {f'finger{i}-{j}.R' for i in range(1, 6) for j in (1, 2, 3)}) > 0.5
hip = 45.0
for hp in (65.0, 62.0, 60.0, 58.0, 56.0, 54.0, 52.0, 50.0, 48.0, 45.0):
    Hh, Bb = lateral(hp, 92.0, 5.0, 6.0)
    reach = Bb[LEGL | LEGR, 0].max()
    log(f'   hip {hp}: knees reach x {reach:.3f}')
    if reach <= HALF_W - 0.008:
        hip = hp; break
for beta in range(0, 75, 5):
    BETA_L[0] = math.radians(beta)
    Hh, Bb = lateral(hip, 92.0, 5.0, 6.0)
    if Bb[ARML, 0].max() <= HALF_W - 0.010:
        break
log(f'   left arm turned {beta} deg toward the head from straight forward; reach x {Bb[ARML, 0].max():.3f}; right arm reach x {Bb[ARMR, 0].max():.3f}')
# the top thigh's lift: the gap between the knees equals the pillow
def knee_gap(abd):
    Hh, Bb = lateral(hip, 92.0, 5.0, abd)
    kl = Bb[LEGL]; kr = Bb[LEGR]
    yk = np.array(P['lowerleg01.L'].head)[1]
    kl = kl[np.abs(kl[:, 1] - yk) < 0.06]; kr = kr[np.abs(kr[:, 1] - yk) < 0.06]
    return (kr[:, 2].min() - kl[:, 2].max()) - KNEE_GAP
abd = PL.bisect(knee_gap, -10.0, 25.0)
Hh, Bb = lateral(hip, 92.0, 5.0, abd)
allv = np.vstack([Hh, Bb])
INFO['lateral_left'] = dict(hipFlexDegLeft=hip, hipFlexDegRight=hip + 5.0, leftArmTowardHeadDeg=beta, kneeDegLeft=92.0, kneeDegRight=97.0, topThighLiftDeg=abd, kneePillowGapMM=KNEE_GAP * 1000,
                            xMin=float(allv[:, 0].min()), xMax=float(allv[:, 0].max()), yMin=float(allv[:, 1].min()), yMax=float(allv[:, 1].max()), zMin=float(allv[:, 2].min()),
                            fitsAcross=bool(allv[:, 0].max() <= HALF_W and allv[:, 0].min() >= -HALF_W), fitsAlong=bool(allv[:, 1].max() <= HALF_L and allv[:, 1].min() >= -HALF_L))
POSES['lateral_left'] = keys_of_pose()
log('LATERAL', {k: (round(v, 3) if isinstance(v, float) else v) for k, v in INFO['lateral_left'].items()})
# which parts still pass the edges
for nm_, m_ in (('legs', LEGL | LEGR), ('arms', ARMS)):
    log(f'   {nm_}: x {Bb[m_, 0].min():.3f}..{Bb[m_, 0].max():.3f}, y {Bb[m_, 1].min():.3f}..{Bb[m_, 1].max():.3f}')
log(f'   head: x {Hh[:, 0].min():.3f}..{Hh[:, 0].max():.3f}, y {Hh[:, 1].min():.3f}..{Hh[:, 1].max():.3f}; trunk x {Bb[~(LEGL | LEGR | ARMS), 0].min():.3f}..{Bb[~(LEGL | LEGR | ARMS), 0].max():.3f}')

# ================================================================ store as actions
PL.reset_pose(arm)
POSES['flat'] = keys_of_pose()
arm.animation_data_create()
for name, keys in POSES.items():
    act = bpy.data.actions.new(name)
    arm.animation_data.action = act
    for n, mb in keys.items():
        pb = P[n]; pb.matrix_basis = mb
        loc, rot, sca = mb.decompose()
        pb.location = loc; pb.rotation_quaternion = rot; pb.scale = (1, 1, 1)
        pb.keyframe_insert('location', frame=1, group=n); pb.keyframe_insert('rotation_quaternion', frame=1, group=n)
    act.use_fake_user = True
    PL.reset_pose(arm)
    log(f'action {name}: {len(act.fcurves) if hasattr(act, "fcurves") else "?"} curves')
arm.animation_data.action = bpy.data.actions['flat']
H.save_json(os.path.join(WORK, 'poses.json'), dict(info=INFO, landmarks_used={k: list(v) for k, v in LM.items()}))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_poses.blend'))
log('SAVED p25_poses.blend')
