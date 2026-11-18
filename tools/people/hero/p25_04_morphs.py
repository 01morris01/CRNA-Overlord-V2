"""p25_04_morphs.py: movements of the hero patient p25 (standing frame), added to p25_parts.blend -> p25_morphs.blend.
   Blender -b --factory-startup --python tools/people/hero/p25_04_morphs.py [-- --sheet]
Clinical morphs (names fixed by the asset contract; jawOpen and cheekPuff are also ARKit names and are one key each):
  jawOpen   1.0 = 40 mm from the upper gum ridge (dentures out) to the lower incisal edges, the chart's 4 cm. The lower
            teeth, lower gum, tongue and the jaw-borne part of the mouth lining turn about the jaw hinge and the hinge
            slides forward and down as the condyle does on the articular eminence; the skin uses MakeHuman's jawOpen
            unit scaled so the lower lip moves with the lower incisors, then the generic corrections below.
  lipsPart  lips apart with the jaw nearly closed (lower lip down, upper lip up, jaw 12 % of jawOpen).
  jawThrust mandible 8 mm forward with 3 degrees of opening so the lower incisors pass in front of the upper ridge.
  cheekPuff cheeks inflated (MakeHuman's cheekPuff unit on the skin, ICT's cheek puff on the mouth lining).
  eyesClosed relaxed lid closure (both eyeBlink units with the lid seal correction); blink: the same, a little tighter.
  breathe   lower ribs out 6 mm each side, abdomen up 14 mm, nothing at the clavicles.
ARKit: the 52 MakeHuman face units (faceunits01, CC0) under their ARKit names on the head skin, with the same
corrections; lashes and brows carry the eye and brow ones; lower teeth, gums, tongue and mouth lining carry the jaw ones.
Generic corrections applied to every face shape on this wrapped head: amplitude scaling (MakeHuman units were authored
on MakeHuman's own face), no skin inside the eyeballs (lid margins are pushed out to 0.7 mm outside the globe), and no
movement below the head-and-neck seam.
Also the rest shape: with the upper denture out the upper lip has lost its support, so the upper lip and philtrum sit
3 mm further back than the sculpt's (which had teeth)."""
import bpy, os, sys, json, math
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Matrix, Vector, Quaternion
import hero_lib as H
import nicp

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
OUT = os.path.join(WORK, 'morphs'); os.makedirs(OUT, exist_ok=True)
log = H.Log('morphs')
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_parts.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']; skin = bpy.data.objects['skin']
O = {n: bpy.data.objects[n] for n in ('eyes', 'cornea', 'eye_wet', 'eye_occlusion', 'teeth_lower', 'gums', 'tongue', 'mouth_inner', 'lashes', 'brows', 'hair')}
PZ = np.load(os.path.join(WORK, 'parts.npz'), allow_pickle=True)
B = np.load(os.path.join(WORK, 'body.npz'), allow_pickle=True)
bones = {b.name: b for b in arm.data.bones}
mw_arm = np.array(arm.matrix_world)
bh = lambda n: np.array(bones[n].head_local)
kb = skin.data.shape_keys.key_blocks
SV = H.get_co(kb[0].data, len(kb[0].data))
ARKIT = [k.name for k in kb[1:]]
SF = H.quads_of(skin)
ORIG = np.empty(len(skin.data.vertices), np.int32); skin.data.attributes['orig'].data.foreach_get('value', ORIG)
Bv = lambda key: B[key][ORIG]                           # body.npz arrays are per vertex of the skin before the mouth bag was cut out
E = H.edges_of(SF)

# ---------------------------------------------------------------- rest-shape correction: no upper denture
lipsz = np.zeros(len(SV))
g = skin.vertex_groups.get('zone_lips')
for v in skin.data.vertices:
    for gg in v.groups:
        if gg.group == g.index:
            lipsz[v.index] = gg.weight
lipsP = SV[lipsz > 0.5]
mouth_c = lipsP.mean(0); upper = SV[:, 2] > mouth_c[2] - 0.001
r = np.linalg.norm((SV - (mouth_c + np.array([0, 0, 0.006]))) * np.array([1.0, 1.4, 1.2]), axis=1)
w_ul = np.exp(-(r / 0.016) ** 2) * upper * (Bv('region') > 0.5)
push = np.zeros_like(SV); push[:, 1] = 0.003 * w_ul; push[:, 2] = -0.0008 * w_ul
for k in kb:
    H.set_co(k.data, H.get_co(k.data, len(k.data)) + push)
SV = SV + push
log(f'rest shape: upper lip and philtrum moved back by up to 3.0 mm ({int((w_ul > 0.2).sum())} vertices) for the missing upper denture')


# ---------------------------------------------------------------- helpers
def key_delta(obj, name):
    k = obj.data.shape_keys.key_blocks
    return H.get_co(k[name].data, len(k[name].data)) - H.get_co(k[0].data, len(k[0].data))


def set_key(obj, name, delta):
    if not obj.data.shape_keys:
        obj.shape_key_add(name='Basis', from_mix=False)
    k = obj.data.shape_keys.key_blocks.get(name) or obj.shape_key_add(name=name, from_mix=False)
    base = H.get_co(obj.data.shape_keys.key_blocks[0].data, len(obj.data.vertices))
    H.set_co(k.data, base + delta); k.value = 0.0
    return k


def verts(obj):
    k = obj.data.shape_keys
    return H.get_co(k.key_blocks[0].data, len(obj.data.vertices)) if k else H.get_co(obj.data.vertices, len(obj.data.vertices))


# eyeballs for the lid push
EYE = verts(O['eyes']); eside = np.zeros(len(EYE), int)
gL = O['eyes'].vertex_groups['eye.L'].index
for v in O['eyes'].data.vertices:
    eside[v.index] = 0 if any(gg.group == gL and gg.weight > 0.5 for gg in v.groups) else 1
EC = [EYE[eside == s].mean(0) for s in (0, 1)]; ER = [np.linalg.norm(EYE[eside == s] - EC[s], axis=1).max() for s in (0, 1)]
COR = verts(O['cornea'])
ERc = [max(ER[s], np.linalg.norm(COR - EC[s], axis=1)[np.linalg.norm(COR - EC[s], axis=1) < 0.02].max()) for s in (0, 1)]
near_eye = [np.linalg.norm(SV - EC[s], axis=1) < 0.03 for s in (0, 1)]
head_w = np.clip(Bv('w_h') * 2.0, 0, 1)


def correct(delta, smooth=2):
    """Generic corrections for a face shape on this head."""
    d = delta * head_w[:, None]
    P = SV + d
    for s in (0, 1):
        m = near_eye[s]
        v = P[m] - EC[s]; dist = np.linalg.norm(v, axis=1)
        # the cornea bulges forward: inside the cornea's reach use its radius
        lim = np.where(v[:, 1] < -0.004, ERc[s], ER[s]) + 0.0007
        inside = dist < lim
        idx = np.nonzero(m)[0][inside]
        P[idx] = EC[s] + v[inside] / dist[inside, None] * lim[inside, None]
    d = P - SV
    if smooth:
        moving = np.linalg.norm(d, axis=1) > 1e-7
        d = H.smooth_field(d, E, n_iter=smooth, keep=~moving, lam=0.3)
    return d


# ---------------------------------------------------------------- the jaw: hinge, rigid motion, calibration
hinge = bh('jaw')                                    # MakeHuman's jaw bone head sits at the joint
TEETH = verts(O['teeth_lower'])
inc_tip = TEETH[np.argmax(TEETH[:, 2] - 2.0 * np.abs(TEETH[:, 0]) - 0.0 * TEETH[:, 1])]        # top of the lower central incisors
GUMS = verts(O['gums']); nU = int(PZ['n_gum_upper'])
ridge = GUMS[:nU]; front = ridge[np.abs(ridge[:, 0]) < 0.004]
crest = front[np.argmin(front[:, 2] + 0.2 * front[:, 1])]                                     # lowest front point of the upper ridge
gap0 = np.linalg.norm(inc_tip - crest)
log(f'jaw hinge {hinge.round(4)}; lower incisal edge {inc_tip.round(4)}; upper ridge crest {crest.round(4)}; gap at rest {gap0 * 1000:.1f} mm')


def jaw_motion(theta, P, fwd=0.0):
    """Points P carried by a jaw opening of theta (radians, about +X through the hinge) with the hinge moving forward
    (toward -Y) and down by the condyle's slide."""
    slide = np.array([0.0, -0.0075, -0.0035]) * (theta / math.radians(26.0)) + np.array([0.0, -fwd, 0.0])
    c, s = math.cos(theta), math.sin(theta)
    Rm = np.array([[1, 0, 0], [0, c, -s], [0, s, c]])          # opening turns the chin down: +theta about +X lowers points in front (-Y)
    return (P - hinge) @ Rm.T + hinge + slide


def gap_at(theta):
    return np.linalg.norm(jaw_motion(theta, inc_tip[None])[0] - crest)


sgn = 1.0 if jaw_motion(0.1, inc_tip[None])[0][2] < inc_tip[2] else -1.0
lo, hi = 0.0, math.radians(45)
for _ in range(40):
    mid = 0.5 * (lo + hi)
    if gap_at(sgn * mid) < 0.040:
        lo = mid
    else:
        hi = mid
THETA = sgn * 0.5 * (lo + hi)
log(f'jawOpen: {math.degrees(abs(THETA)):.1f} degrees about the hinge (plus 7.5 mm forward, 3.5 mm down slide) gives {gap_at(THETA) * 1000:.1f} mm upper ridge to lower incisors')
# per-object jaw weight (the share of the jaw's motion each vertex takes)
def jaw_w(obj):
    w = np.zeros(len(obj.data.vertices)); g = obj.vertex_groups.get('jaw')
    if g is None:
        return w
    for v in obj.data.vertices:
        for gg in v.groups:
            if gg.group == g.index:
                w[v.index] = gg.weight
    return w


def rigid_jaw_delta(obj, theta, fwd=0.0):
    P = verts(obj); w = jaw_w(obj)
    return (jaw_motion(theta, P, fwd) - P) * w[:, None]


# skin jawOpen: MakeHuman's unit scaled so the middle of the lower lip goes where the jaw carries it
lower_lip = np.nonzero((lipsz > 0.5) & (SV[:, 2] < mouth_c[2] - 0.004) & (np.abs(SV[:, 0]) < 0.006))[0]
d_mh = key_delta(skin, 'jawOpen')
want = (jaw_motion(THETA, SV[lower_lip]) - SV[lower_lip]).mean(0)
got = d_mh[lower_lip].mean(0)
a_open = float(np.dot(want, got) / max(np.dot(got, got), 1e-12))
log(f'skin jawOpen: MakeHuman unit x {a_open:.3f} (lower lip moves {np.linalg.norm(got * a_open) * 1000:.1f} mm; the jaw carries it {np.linalg.norm(want) * 1000:.1f} mm)')
# a blend of the scaled unit and the rigid jaw motion through the skin's own jaw weights keeps the chin and jaw line on the bone
w_skin_jaw = jaw_w(skin)
rig_skin = (jaw_motion(THETA, SV) - SV) * w_skin_jaw[:, None]
d_open = correct(a_open * d_mh, smooth=2)
set_key(skin, 'jawOpen', d_open)

# ---------------------------------------------------------------- the other ARKit shapes on the skin: scale like jawOpen
AMP = {'jawForward': a_open, 'jawLeft': a_open, 'jawRight': a_open, 'mouthClose': a_open}
for name in ARKIT:
    if name == 'jawOpen':
        continue
    set_key(skin, name, correct(key_delta(skin, name) * AMP.get(name, 1.0)))
log(f'ARKit shapes corrected on the skin: {len(ARKIT)}')

# ---------------------------------------------------------------- clinical composites on the skin
def kd(name):
    return key_delta(skin, name)


THRUST = 0.008
fwd_unit = key_delta(skin, 'jawForward') / AMP['jawForward']                  # back to MakeHuman's own unit
cf = -fwd_unit[lower_lip, 1].mean()
open_part = (3.0 / math.degrees(abs(THETA))) * d_open
a_fwd = (THRUST + open_part[lower_lip, 1].mean()) / max(cf, 1e-6)              # net 8 mm forward at the lower lip
th_thrust = math.radians(3.0) * np.sign(THETA)
rig_thrust = (jaw_motion(th_thrust, SV, THRUST) - SV) * w_skin_jaw[:, None]
set_key(skin, 'jawThrust', correct(fwd_unit * a_fwd + open_part, smooth=2))
set_key(skin, 'lipsPart', correct(0.6 * (kd('mouthLowerDownLeft') + kd('mouthLowerDownRight')) + 0.4 * (kd('mouthUpperUpLeft') + kd('mouthUpperUpRight')) + 0.12 * d_open))
set_key(skin, 'eyesClosed', correct(kd('eyeBlinkLeft') + kd('eyeBlinkRight'), smooth=1))
set_key(skin, 'blink', correct(1.03 * (kd('eyeBlinkLeft') + kd('eyeBlinkRight')) + 0.15 * (kd('eyeSquintLeft') + kd('eyeSquintRight')), smooth=1))
log(f'jawThrust: MakeHuman jawForward x {a_fwd:.2f} blended with an 8 mm rigid advance and 3 degrees of opening')

# ---------------------------------------------------------------- breathe
z = SV[:, 2]
lab_t = Bv('lab_torso')
cl = 0.5 * (bh('clavicle.L') + bh('clavicle.R'))
pel = 0.5 * (bh('upperleg01.L') + bh('upperleg01.R'))
z_xiph = cl[2] - 0.20; z_pub = pel[2] - 0.02
front_sel = SV[:, 1] < (SV[lab_t > 0.5, 1].mean())
t_ab = np.clip((z_xiph + 0.04 - z) / 0.08, 0, 1) * np.clip((z - z_pub) / 0.10, 0, 1)
w_abd = (t_ab ** 1.5) * front_sel * np.clip(lab_t, 0, 1) * np.clip(1 - np.abs(SV[:, 0]) / 0.30, 0, 1)
t_rib = np.exp(-((z - (z_xiph - 0.01)) / 0.07) ** 2) * np.clip(lab_t, 0, 1) * np.clip((z_xiph + 0.12 - z) / 0.06, 0, 1)
side = np.sign(SV[:, 0]) * np.clip(np.abs(SV[:, 0]) / 0.12, 0, 1)
breathe = np.zeros_like(SV)
breathe[:, 1] = -0.014 * w_abd                          # standing frame: -Y is in front; supine this is up
breathe[:, 0] = 0.006 * t_rib * side
breathe[:, 1] += -0.004 * t_rib * front_sel
breathe = H.smooth_field(breathe, E, n_iter=8, lam=0.5)
set_key(skin, 'breathe', breathe)
log(f'breathe: abdomen up to {np.abs(breathe[:, 1]).max() * 1000:.1f} mm forward, ribs {np.abs(breathe[:, 0]).max() * 1000:.1f} mm out; clavicle-level motion {np.abs(breathe[np.abs(z - cl[2]) < 0.03]).max() * 1000:.2f} mm')

# ---------------------------------------------------------------- the parts
EXPR = {k[2:]: PZ[k] for k in PZ.files if k.startswith('x_')}


def ict_delta(obj, part, name, scale=1.0):
    idx = PZ[part + '_ict']
    d = EXPR[name][idx] * scale
    return d


for nm in ('teeth_lower', 'gums', 'tongue', 'mouth_inner'):
    o = O[nm]
    set_key(o, 'jawOpen', rigid_jaw_delta(o, THETA))
    set_key(o, 'jawThrust', rigid_jaw_delta(o, th_thrust, THRUST))
    set_key(o, 'lipsPart', rigid_jaw_delta(o, 0.12 * THETA))
    set_key(o, 'jawForward', rigid_jaw_delta(o, 0.0, THRUST))
    for nmk, dx in (('jawLeft', 0.006), ('jawRight', -0.006)):
        P = verts(o); w = jaw_w(o); set_key(o, nmk, np.outer(w, [dx, 0, 0]))
    # the remaining shapes keep the parts still
    for nmk in ('cheekPuff', 'eyesClosed', 'blink', 'breathe'):
        set_key(o, nmk, np.zeros((len(o.data.vertices), 3)))
# the mouth lining's cheeks puff with the skin (ICT's own cheek puff on the socket part only)
o = O['mouth_inner']; ns = int(PZ['n_socket'])
d = np.zeros((len(o.data.vertices), 3)); d[:ns] = ict_delta(o, 'socket', 'cheekPuff_L') + ict_delta(o, 'socket', 'cheekPuff_R')
Pm = verts(o)[:ns]; lat = np.clip((np.abs(Pm[:, 0]) - 0.012) / 0.012, 0, 1) * np.clip((Pm[:, 1] - Pm[:, 1].min() - 0.006) / 0.01, 0, 1)
d[:ns] *= 0.8 * lat[:, None]                                                    # cheek walls only: the lips are the skin's
set_key(o, 'cheekPuff', d)
# tongue out: the tip forward 25 mm, fading to nothing at the root
o = O['tongue']; P = verts(o); front_t = P[:, 1].min(); length = P[:, 1].max() - front_t
wt = np.clip(1 - (P[:, 1] - front_t) / length, 0, 1) ** 1.5
d = np.zeros_like(P); d[:, 1] = -0.025 * wt; d[:, 2] = -0.004 * wt
set_key(o, 'tongueOut', d)
for nm in ('teeth_lower', 'gums', 'mouth_inner'):
    set_key(O[nm], 'tongueOut', np.zeros((len(O[nm].data.vertices), 3)))
# eye pieces: tear line and lid shadow follow ICT's own blink; eyes and corneas never move with morphs (eye bones turn them)
for nm, part in (('eye_wet', 'eye_wet'), ('eye_occlusion', 'eye_occlusion')):
    o = O[nm]; P = verts(o)
    dl = ict_delta(o, part, 'eyeBlink_L'); dr = ict_delta(o, part, 'eyeBlink_R')
    left = P[:, 0] > 0
    dL = dl * left[:, None]; dR = dr * (~left)[:, None]
    set_key(o, 'eyeBlinkLeft', dL); set_key(o, 'eyeBlinkRight', dR)
    set_key(o, 'eyesClosed', dL + dR); set_key(o, 'blink', dL + dR)
    for nmk in ('jawOpen', 'lipsPart', 'jawThrust', 'cheekPuff', 'breathe'):
        set_key(o, nmk, np.zeros_like(P))
# lashes and brows: MakeHuman carried every face unit to them; compose the clinical ones the same way
for nm in ('lashes', 'brows', 'hair'):
    o = O[nm]
    if not o.data.shape_keys:
        continue
    names = [k.name for k in o.data.shape_keys.key_blocks[1:]]
    g = lambda n: key_delta(o, n) if n in names else 0.0
    set_key(o, 'eyesClosed', g('eyeBlinkLeft') + g('eyeBlinkRight') + np.zeros((len(o.data.vertices), 3)))
    set_key(o, 'blink', 1.03 * (g('eyeBlinkLeft') + g('eyeBlinkRight')) + 0.15 * (g('eyeSquintLeft') + g('eyeSquintRight')) + np.zeros((len(o.data.vertices), 3)))
    for nmk in ('jawOpen', 'lipsPart', 'jawThrust', 'cheekPuff', 'breathe'):
        set_key(o, nmk, np.zeros((len(o.data.vertices), 3)))
    # keep only shapes that move this piece
    for k in list(o.data.shape_keys.key_blocks[1:]):
        if k.name in ('eyesClosed', 'blink', 'jawOpen', 'lipsPart', 'jawThrust', 'cheekPuff', 'breathe'):
            continue
        if np.abs(key_delta(o, k.name)).max() < 1e-5:
            o.shape_key_remove(k)
H.save_json(os.path.join(WORK, 'morphs.json'), dict(theta_deg=math.degrees(abs(THETA)), gap_rest_mm=gap0 * 1000, gap_open_mm=gap_at(THETA) * 1000, a_open=a_open, a_fwd=a_fwd,
                                                  hinge=hinge, incisor_tip=inc_tip, ridge_crest=crest, eye_centres=EC, eye_radii=ER))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_morphs.blend'))
log('SAVED p25_morphs.blend')
