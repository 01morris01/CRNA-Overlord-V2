"""make_person.py: one patient, from the chart numbers to a finished file for the browser.
   BLENDER_USER_RESOURCES=<people>/blender-user blender -b --factory-startup --python tools/people/make_person.py -- SPEC.json OUT_DIR [--debug]
SPEC.json is one entry of the file written by tools/people/patient_specs.py. OUT_DIR receives <id>.raw.glb (not yet
compressed), <id>.json (measurements and landmarks) and, with --debug, pictures of the stages.
What happens, in order: a MakeHuman person is generated to the chart's age, sex, height and weight (pp_body.py);
it is posed lying down; a gown and a sheet are draped over it (pp_cloth.py); everything the cloth hides is removed;
skin, eyes and hair textures are made for what is left (pp_skin.py); three movements are stored as morph targets
(eyesClosed, jawOpen, breathe); landmarks are measured; the result is exported with +Y up, head toward -Z."""
import bpy, os, sys, json, math, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Matrix, Vector, Quaternion
import pp_common as C
import pp_body as B

A = C.args_after_dashes()
SPEC = json.load(open(A[0])); OUT = A[1]; DEBUG = '--debug' in A
os.makedirs(OUT, exist_ok=True)
PID = SPEC['id']; T0 = time.time()


def log(*a):
    print(f'[{PID} {time.time() - T0:5.1f}s]', *a, flush=True)


bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ---------------------------------------------------------------- 1. the person, standing
bm, inbody, quads, fuv, build = B.create_fitted_human(SPEC, log)
stand = C.mixed_coords(bm)
stand_h = float(stand[inbody, 2].max() - stand[inbody, 2].min())
S = float(SPEC['heightM']) / stand_h                      # one scale for everything: the chart height
arm, parts = B.add_rig_and_parts(bm, SPEC, log)
lab, pose = B.pose_supine(bm, arm, inbody, SPEC, S, log)

# ---------------------------------------------------------------- 2. positions of every part, lying down, in meters
# Lying frame (Blender): X = the patient's left, Y = toward the head, Z = up from the table. The exporter turns this into
# the browser's frame (Y up, head toward -Z).
MORPH_KEYS = {'eyesClosed': ('eyeBlinkLeft', 'eyeBlinkRight'), 'jawOpen': ('jawOpen',)}
y_table = pose['y_table']
SINK = 0.008                                               # how far a body settles into a pad, meters


def collect(obj):
    out = {}
    C.set_keys(obj, ())
    out['basis'] = C.deformed_coords(obj)
    names = {k.name for k in obj.data.shape_keys.key_blocks} if obj.data.shape_keys else set()
    for m, keys in MORPH_KEYS.items():
        if all(k in names for k in keys):
            C.set_keys(obj, keys)
            out[m] = C.deformed_coords(obj)
    C.set_keys(obj, ())
    return out


raw = {'body': collect(bm)}
for k, ob in parts.items():
    raw[k] = collect(ob)
zs = raw['body']['basis'][inbody, 2]
z_mid = 0.5 * (zs.max() + zs.min())


def lay(co):
    out = np.empty_like(co)
    out[:, 0] = co[:, 0] * S
    out[:, 1] = (co[:, 2] - z_mid) * S
    out[:, 2] = np.maximum((y_table - co[:, 1]) * S - SINK, 0.0)
    return out


pos = {k: {m: lay(c) for m, c in d.items()} for k, d in raw.items()}
bb = pos['body']['basis'][inbody]
log(f'LAID length {bb[:, 1].max() - bb[:, 1].min():.3f} m (chart {SPEC["heightM"]:.3f}), width {bb[:, 0].max() - bb[:, 0].min():.3f}, highest {bb[:, 2].max():.3f}, x center {0.5 * (bb[:, 0].max() + bb[:, 0].min()):+.4f}')

J = {b.name: lay(np.array([list(b.head)]))[0] for b in arm.pose.bones}          # joint positions, lying frame

# ---------------------------------------------------------------- 3. gown and sheet
import pp_cloth as K
cloth = K.drape_patient(pos['body']['basis'], quads, lab, J, float(SPEC['heightM']), seed=int(PID[1:]), log=log)


# ---------------------------------------------------------------- 4. what is still seen of the body, and where its skin goes in the pictures
import pp_skin as SK
import pp_export as X
from PIL import Image
k = cloth['k']
FACE_PX = 2500.0 / S                    # pixels of the skin picture per meter of face (about 25 to the centimetre for an adult)
# slots in the shared detail picture (x, y from the top-left, width, height)
SLOTS = {'hair': (0, 0, 1024, 608), 'lashes': (0, 608, 368, 192), 'eye': (368, 608, 192, 192), 'teeth': (560, 608, 176, 192), 'tongue': (736, 608, 96, 128),
         'beard': (832, 608, 192, 192), 'handL': (0, 800, 224, 224), 'handR': (224, 800, 224, 224), 'forearmL': (448, 800, 288, 112), 'forearmR': (448, 912, 288, 112)}
hidden = cloth['hidden']
keep_face = ~hidden[quads].all(1)
island = SK.classify_islands(quads, fuv)
is_arm_face = (lab['armL'][quads].mean(1) + lab['armR'][quads].mean(1)) >= 0.5
layout = SK.SkinLayout(quads, fuv, keep_face, island, is_arm_face, SLOTS)
log(f'KEPT {keep_face.sum()} of {len(quads)} body faces: ' + ', '.join(f'{n} {int(((island[layout.kept] == n)).sum())}' for n in ('head', 'trunk', 'mouth', 'handL', 'handR')))


def slot_uv(uv, slot):
    """Texture coordinates of an asset (0..1 over its own picture) -> the same picture placed in a slot of the detail picture."""
    x, y, w, h = slot
    uv = np.asarray(uv, float)
    return np.stack([(x + uv[:, 0] * w) / 1024.0, 1.0 - (y + (1.0 - uv[:, 1]) * h) / 1024.0], 1)


def part_data(ob):
    faces = [tuple(p.vertices) for p in ob.data.polygons]
    uvd = ob.data.uv_layers.active.data
    uvs = np.array([tuple(uvd[l].uv) for p in ob.data.polygons for l in p.loop_indices])
    img = None
    for n in ob.material_slots[0].material.node_tree.nodes:
        if n.bl_idname == 'ShaderNodeTexImage' and n.image:
            img = bpy.path.abspath(n.image.filepath); break
    return faces, uvs, img


# ---------------------------------------------------------------- 5. morph targets
MM = float(SPEC['heightM'])
jaw_scale = 1.0
if 'teeth' in pos and 'jawOpen' in pos['teeth']:
    drop = np.linalg.norm(pos['teeth']['jawOpen'] - pos['teeth']['basis'], axis=1).max()
    want_open = 0.032 * min(max(k, 0.55), 1.0)            # about 3 cm between the teeth for an adult, less for a small child
    jaw_scale = float(np.clip(want_open / max(drop, 1e-6), 0.6, 1.7))
    log(f'JAW the face unit opens {drop * 1000:.1f} mm at full strength; stored at {jaw_scale:.2f} of it = {drop * jaw_scale * 1000:.1f} mm')
for d_ in pos.values():
    if 'jawOpen' in d_:
        d_['jawOpen'] = d_['basis'] + (d_['jawOpen'] - d_['basis']) * jaw_scale

# eyes: where each eyeball sits and which way it looks, in the lying frame
from mathutils.bvhtree import BVHTree
erest = C.get_co(parts['eyes'].data.vertices, len(parts['eyes'].data.vertices))
EYE = {}
for side, nm in ((1.0, 'L'), (-1.0, 'R')):
    m = erest[:, 0] * side > 0
    idx = np.nonzero(m)[0]
    apex = idx[np.argmin(erest[idx, 1])]                 # the front of the cornea (the face looks along -Y before it is laid down)
    P_ = pos['eyes']['basis'][idx]
    Aq = np.c_[2 * P_, np.ones(len(P_))]; sol = np.linalg.lstsq(Aq, (P_ ** 2).sum(1), rcond=None)[0]
    cen = sol[:3]; rad = float(np.sqrt(sol[3] + (cen ** 2).sum()))
    axis = pos['eyes']['basis'][apex] - cen; axis /= np.linalg.norm(axis)
    EYE[nm] = {'centre': cen, 'radius': rad, 'axis': axis, 'apex': pos['eyes']['basis'][apex]}


def lid_tree(amount):
    """The face with the lids closed by `amount` of the stored movement, as something rays can be cast against."""
    Pc = pos['body']['basis'] + amount * (pos['body']['eyesClosed'] - pos['body']['basis'])
    tris = np.concatenate([head_q[:, [0, 1, 2]], head_q[:, [0, 2, 3]]])
    return BVHTree.FromPolygons([tuple(v) for v in Pc], [tuple(int(i) for i in t) for t in tris]), Pc


def lids_cover(tree):
    """Share of the iris that the lids hide: rays from in front of the eye, straight at it."""
    hit_n = tot = 0
    for e in EYE.values():
        ax = Vector(e['axis']); c = Vector(e['centre'])
        u = ax.cross(Vector((1, 0, 0))).normalized(); v = ax.cross(u)
        for a_ in np.linspace(-1, 1, 7):
            for b_ in np.linspace(-1, 1, 7):
                if a_ * a_ + b_ * b_ > 1:
                    continue
                o = c + ax * (e['radius'] + 0.03) + (u * a_ + v * b_) * (0.34 * e['radius'])
                loc = tree.ray_cast(o, -ax, 0.03 - 0.0003)[0]
                tot += 1; hit_n += loc is not None
    return hit_n / max(tot, 1)


head_q = layout.quads[layout.which == 0]; head_uv = layout.new_uv[layout.which == 0]
blink = 1.0
for blink in (1.0, 1.1, 1.2, 1.3, 1.4):
    cover = lids_cover(lid_tree(blink)[0])
    if cover > 0.985:
        break
open_cover = lids_cover(lid_tree(0.0)[0])
log(f'LIDS open: {open_cover * 100:.0f}% of the iris hidden; closed at {blink:.1f} of the face unit: {cover * 100:.0f}% hidden')
for d_ in pos.values():
    if 'eyesClosed' in d_:
        d_['eyesClosed'] = d_['basis'] + (d_['eyesClosed'] - d_['basis']) * blink

y_pelvis = 0.5 * (J['upperleg01.L'][1] + J['upperleg01.R'][1])
grid = cloth['grid']
half_w = np.array([np.abs(grid.xs[row >= 0]).max() if (row >= 0).any() else 0.0 for row in cloth['H_tl']])
from scipy import ndimage as ndi
half_w = ndi.gaussian_filter1d(half_w, grid.px(0.03 * k))
top_tl = ndi.gaussian_filter(np.maximum(cloth['H_tl'], 0), grid.px(0.02 * k))
BREATH = 0.015 * min(max(k, 0.45), 1.0)


def breathe(P):
    """Where each point is when the chest and belly are up by one breath: most at the lower ribs, nothing at the
    collar bones, the arms and the table."""
    P = np.asarray(P, float)
    s = (P[:, 1] - y_pelvis) / (cloth['y_notch'] - y_pelvis)
    sm = lambda a, b, x: np.clip((x - a) / (b - a), 0, 1) ** 2 * (3 - 2 * np.clip((x - a) / (b - a), 0, 1))
    along = sm(-0.05, 0.6, s) * (1 - 0.72 * sm(0.72, 1.06, s)) * (1 - sm(1.06, 1.14, s))
    hw = np.maximum(np.interp(P[:, 1], grid.ys, half_w), 1e-3)
    across = 1 - sm(0.6, 1.02, np.abs(P[:, 0]) / hw)
    top = np.maximum(grid.sample(top_tl, P[:, 0], P[:, 1]), 0.02)
    height = np.clip(P[:, 2] / top, 0, 1) ** 0.7
    out = P.copy()
    out[:, 2] += BREATH * along * across * height
    return out


# ---------------------------------------------------------------- 6. the pictures
TEX = os.path.join(OUT, PID + '_tex'); os.makedirs(TEX, exist_ok=True)
rng = np.random.default_rng(1000 + int(PID[1:]))
M = C.mpfb()
skin_mhmat = M.Asset.find_asset_absolute_path(SPEC['skin'], 'skins')
skin_png = None
for line in open(skin_mhmat, errors='replace'):
    if line.strip().startswith('diffuseTexture'):
        skin_png = os.path.join(os.path.dirname(skin_mhmat), line.split(None, 1)[1].strip())
src = X.load_rgba(skin_png)[:, :, :3]
tone = SPEC.get('tone', {})
detail = np.zeros((1024, 1024, 4))
detail[..., 3] = 1.0

# -- skin picture: color
U, V, ok = layout.source_coords(0)
alb = SK.sample_image(src, U, V, order=3).clip(0, 1)
body_N = K.vertex_normals(pos['body']['basis'], quads)
lips_w = C.group_weights(bm, {'lips'}); lid_w = C.group_weights(bm, {'orbicularis03.L', 'orbicularis03.R', 'orbicularis04.L', 'orbicularis04.R'})
scalp_w = C.group_weights(bm, {'scalp'})
tri_idx = np.concatenate([head_q[:, [0, 1, 2]], head_q[:, [0, 2, 3]]])
occ = SK.vertex_occlusion(pos['body']['basis'], body_N, np.unique(head_q), tri_idx, 0.055 * k, rng)
for _ in range(2):                                         # evened out over neighboring vertices
    acc = np.zeros(len(occ)); cnt_ = np.zeros(len(occ))
    for i_ in range(4):
        np.add.at(acc, head_q[:, i_], occ[head_q[:, (i_ + 1) % 4]]); np.add.at(cnt_, head_q[:, i_], 1)
    occ = np.where(cnt_ > 0, 0.5 * occ + 0.5 * acc / np.maximum(cnt_, 1), occ)
attr_v = np.concatenate([pos['body']['basis'], body_N, lips_w[:, None], lid_w[:, None], scalp_w[:, None], occ[:, None]], 1)
tri_uv = np.concatenate([head_uv[:, [0, 1, 2]], head_uv[:, [0, 2, 3]]])
tri_px = np.stack([tri_uv[..., 0] * 1024, (1 - tri_uv[..., 1]) * 1024], -1)
amap, hit = SK.rasterize(tri_px, attr_v[tri_idx].astype(np.float32), 1024, 1024)
pos_map, nrm_map = amap[..., 0:3].astype(np.float64), amap[..., 3:6].astype(np.float64)
smooth_mask = ndi.gaussian_filter(np.clip(amap[..., 6] + amap[..., 7], 0, 1), 2.0)
scalp_map = ndi.gaussian_filter(amap[..., 8], 3.0)
lin = SK.srgb_to_lin(alb)
face_zone = hit & (smooth_mask < 0.1) & (scalp_map < 0.2)
face_zone[:int(0.2 * SK.HEAD_ROWS)] = False; face_zone[int(0.86 * SK.HEAD_ROWS):] = False
face_zone[:, :300] = False; face_zone[:, 724:] = False
gain = np.ones(3)
if 'rgb' in tone:
    lin, gain = SK.tone_match(lin, face_zone, SK.srgb_to_lin(np.array(tone['rgb'])), keep=tone.get('keep', 0.25))
# soft shading where the face is hollow, a little warmer than plain darkening (light that has passed through skin is red)
occ_map = np.where(hit, amap[..., 9], 1.0).astype(np.float64)
occ_map = ndi.gaussian_filter(SK.fill_outside(occ_map, hit), 1.2)
sh = 1.0 - SPEC.get('occlusion', 0.5) * np.clip(1.0 - occ_map, 0, 1) ** 1.2
# ... and a very soft light from above the lying patient: what faces the ceiling is a little lighter than what faces the
# side or the floor. The browser's room is lit almost evenly, so without this a face has no form at all.
nz = np.where(hit, nrm_map[..., 2] / np.maximum(np.linalg.norm(nrm_map, axis=-1), 1e-6), 1.0)
nz = ndi.gaussian_filter(SK.fill_outside(nz, hit), 1.5)
sh = sh * (1.0 - SPEC.get('topLight', 0.24) * np.clip(0.5 - 0.5 * nz, 0, 1) ** 1.3)
lin = lin * np.stack([sh ** 0.6, sh ** 0.92, sh ** 1.0], -1)
# more life in the colour: the picture's own reds (lips, cheeks, nose, ears) are brought out a little
mean_l = lin.mean(-1, keepdims=True)
lin = np.clip(mean_l + (lin - mean_l) * SPEC.get('saturation', 1.18), 0, None)
# fine unevenness of color that a 400-pixel face does not have: mottling, and slightly darker pores
squeeze = SK.squeeze_map()
relief, pores = SK.skin_relief((1024, 1024), rng, SK.lin_to_srgb(lin).mean(-1), smooth_mask, squeeze)
mott = SK.fractal((1024, 1024), rng, (3.0, 9.0, 24.0), (0.5, 0.8, 1.0)) / 2.3
lin = lin * (1.0 + 0.022 * mott[..., None] * np.array([1.0, 0.2, -0.3]) + 0.012 * mott[..., None])       # mostly a red-brown drift
lin = lin * (1.0 + 0.05 * np.minimum(pores, 0)[..., None] * (1 - smooth_mask[..., None]))
alb = SK.lin_to_srgb(lin).clip(0, 1)
blur = ndi.gaussian_filter(alb, (1.6, 1.6, 0))
alb = np.clip(alb + 0.28 * (alb - blur), 0, 1)                                                           # a little crispness back after resampling
# eyebrows: painted into the skin from the eyebrow asset
if 'brows' in parts:
    bf, buv, bimg = part_data(parts['brows'])
    bp = pos['brows']['basis']
    tris, tuv, c0 = [], [], 0
    for f in bf:
        n = len(f)
        for t in range(1, n - 1):
            tris.append([bp[f[0]], bp[f[t]], bp[f[t + 1]]]); tuv.append([buv[c0], buv[c0 + t], buv[c0 + t + 1]])
        c0 += n
    brow = SPEC.get('brow', {})
    card = X.load_rgba(bimg)
    head_rows = hit.copy(); head_rows[SK.HEAD_ROWS:] = False
    alb, brow_cov = SK.paint_from_card(alb, pos_map, nrm_map, head_rows, np.array(tris), np.array(tuv), card, brow.get('tint', (0.20, 0.13, 0.09)), brow.get('strength', 0.95), 0.008 * k)
    log(f'BROWS painted over {int((brow_cov > 0.05).sum())} pixels')
def triangles(key):
    f_, uv_, img_ = part_data(parts[key])
    P_ = pos[key]['basis']
    tris, tuv, c0 = [], [], 0
    for f in f_:
        for t in range(1, len(f) - 1):
            tris.append([P_[f[0]], P_[f[t]], P_[f[t + 1]]]); tuv.append([uv_[c0], uv_[c0 + t], uv_[c0 + t + 1]])
        c0 += len(f)
    return np.array(tris), np.array(tuv), img_


hair_spec = SPEC.get('hair', {})
scalp_in = scalp_w > 0.5                                   # the hair-bearing scalp, as marked on the base mesh
# the part of the head that hair is kept off: the forehead and temples, above the eyes and in front of the ears (standing figure)
eye_z = 0.5 * (erest[erest[:, 0] > 0, 2].mean() + erest[erest[:, 0] < 0, 2].mean()); eye_x = np.abs(erest[:, 0]).mean()
front_zone = (stand[:, 1] < stand[12038, 1] - 0.012) & (stand[:, 2] > eye_z + 0.006) & inbody & (lab['head'] > 0.5)
if not hair_spec.get('cutSides', True):                    # long styles keep the hair at the temples; only the middle of the forehead is cleared
    front_zone &= np.abs(stand[:, 0]) < 1.75 * eye_x

# 1. the picture's own painted stubble is taken off the scalp (it has the wrong color for most people's hair) ...
skin_ref = np.median(alb[face_zone], axis=0)
clean = np.clip(ndi.gaussian_filter(amap[..., 8], 5.0) * 1.4, 0, 1)[..., None] * hair_spec.get('scalpClean', 0.85)
clean[SK.HEAD_ROWS:] = 0
alb = alb * (1 - clean) + skin_ref * (1 + 0.03 * mott[..., None]) * clean
# 2. ... and the hair's own color is painted where hair grows: under the hair mesh, and out to the natural hairline,
#    fading into single strands. The hair mesh itself is cut back behind that line (below), so its hard edge lies on
#    hair-colored scalp and the visible hairline is the soft painted one.
root_rgb = np.array(hair_spec.get('root', np.array(hair_spec.get('tint', (0.16, 0.10, 0.07))) * 0.82))
shade = hair_spec.get('scalpShade', 0.9)
if shade > 0:
    grow = ndi.gaussian_filter(np.clip((amap[..., 8] - 0.25) / 0.5, 0, 1), 4.5)      # the scalp region, soft at its border
    grow = np.clip((grow - 0.3) / 0.4, 0, 1)
    if 'hair' in parts:
        htris, htuv, himg = triangles('hair')
        halpha = X.load_rgba(himg)[..., 3]
        zone = hit & (ndi.gaussian_filter(amap[..., 8], 6.0) > 0.02)
        zone[SK.HEAD_ROWS:] = False
        cover = SK.hair_cover(pos_map, nrm_map, zone, htris, htuv, halpha, 0.05 * k)
        grow = np.maximum(grow * hair_spec.get('scalpCover', 1.0), ndi.maximum_filter(cover, size=3))
    strands = SK.fractal((1024, 1024), rng, (0.7, 1.8), (1.0, 0.7))
    a_ = SK.feathered(grow > 0.5, rng, hair_spec.get('hairlineFeather', 0.02) * k * FACE_PX, grain=(0.8, 2.6)) * shade       # thinning out over a centimetre or two
    a_[SK.HEAD_ROWS:] = 0
    alb = alb * (1 - a_[..., None]) + root_rgb * (1 + 0.14 * strands[..., None]) * a_[..., None]
    log(f'SCALP hair color painted over {int((a_ > 0.3).sum())} pixels')
# a beard: its outline comes from a beard asset, and the hair itself is painted on the skin inside that outline, thinning
# out to stubble at the edge. (The asset's own shell is not exported: in the browser its outline was a hard polygon edge.)
beard_spec = SPEC.get('beard', {})
if 'beard' in parts:
    btris, btuv, _ = triangles('beard')
    head_only = hit.copy(); head_only[SK.HEAD_ROWS:] = False
    bcov = SK.hair_cover(pos_map, nrm_map, head_only, btris, btuv, np.ones((4, 4)), 0.03 * k)
    bstr = SK.fractal((1024, 1024), rng, (0.6, 1.4), (1.0, 0.8))
    grown = ndi.binary_dilation(ndi.maximum_filter(bcov, size=3) > 0.5, iterations=2)
    ba = (SK.feathered(grown, rng, beard_spec.get('feather', 0.009) * k * FACE_PX, grain=(0.6, 1.3)) * beard_spec.get('shade', 0.9))[..., None]
    ba[SK.HEAD_ROWS:] = 0
    ba = ba * (1.0 - np.clip(ndi.gaussian_filter(amap[..., 6], 1.5) * 2.2, 0, 1))[..., None]      # not on the lips
    alb = alb * (1 - ba) + np.array(beard_spec.get('tint', hair_spec.get('tint', (0.16, 0.10, 0.07)))) * (1 + 0.22 * bstr[..., None]) * ba
    log(f'BEARD painted over {int((ba[..., 0] > 0.3).sum())} pixels')
# lashes: a thin dark line painted along the lid margins (it moves with the lids when the eyes close). The lash asset
# gives the place: the points where its hairs leave the lid.
lash_spec = SPEC.get('lash', {})
if 'lashes' in parts:
    ltris, _, _ = triangles('lashes')
    face_up = pos['body']['basis'][5192] - pos['body']['basis'][991]; face_up = face_up / np.linalg.norm(face_up)      # chin to forehead
    wts = np.array([(a_, b_, 1 - a_ - b_) for a_ in np.linspace(0, 1, 7) for b_ in np.linspace(0, 1 - a_, max(1, int(round((1 - a_) * 6)) + 1))])
    samples = (ltris[:, None, :, :] * wts[None, :, :, None]).sum(2).reshape(-1, 3)
    head_only = hit.copy(); head_only[SK.HEAD_ROWS:] = False
    for e in EYE.values():
        r_ = np.linalg.norm(samples - e['centre'], axis=1)
        mine = samples[r_ < 2.0 * e['radius']]; rm = r_[r_ < 2.0 * e['radius']]
        roots = mine[rm < rm.min() + 0.0022 * k]
        upper = (roots - e['centre']) @ face_up > 0
        for sel_, strength in ((upper, lash_spec.get('upper', 0.8)), (~upper, lash_spec.get('lower', 0.3))):
            if sel_.sum() > 3:
                ll = SK.lash_line(pos_map, head_only, roots[sel_], lash_spec.get('width', 0.0014) * k)[..., None] * strength
                alb = alb * (1 - ll) + np.array(lash_spec.get('rgb', (0.10, 0.07, 0.055))) * ll
alb = SK.fill_outside(alb, hit | (~ok))
alb[~ok] = alb[face_zone].mean(0)
X.save_png(os.path.join(TEX, 'skin.png'), alb)
# -- skin picture: relief
nrm = SK.height_to_normal(relief, SPEC.get('reliefStrength', 0.16))
nrm[~ok] = (0.5, 0.5, 1.0)
X.save_png(os.path.join(TEX, 'skin_normal.png'), nrm)

# -- detail picture: forearms and hands (same skin, same tone)
U1, V1, ok1 = layout.source_coords(1)
arm_lin = SK.srgb_to_lin(SK.sample_image(src, U1, V1, order=1).clip(0, 1)) * gain
arm_rgb = SK.lin_to_srgb(arm_lin * (1.0 + 0.02 * mott[..., None])).clip(0, 1)
detail[ok1, :3] = arm_rgb[ok1]


def put(slot, rgba):
    x, y, w, h = slot
    im = Image.fromarray((np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA').resize((w, h), Image.LANCZOS)
    detail[y:y + h, x:x + w] = np.asarray(im, np.float64) / 255.0


# -- eyes
eye = SPEC.get('eye', {})
eye_rgb = SK.eye_picture(384, eye.get('rgb', (0.30, 0.17, 0.08)), seed=int(PID[1:]) + 77, pupil=eye.get('pupil', 0.30), glint=eye.get('glint', 0.75))
put(SLOTS['eye'], np.concatenate([eye_rgb, np.ones(eye_rgb.shape[:2] + (1,))], -1))
log('pictures: skin and relief written')
# -- teeth, tongue, lashes, hair, beard: each asset's own picture goes into its slot
pdata = {k_: part_data(o) for k_, o in parts.items()}


def recolour(rgba, hc):
    """Hair in the patient's colour: the strands' light and dark are kept, the color is replaced, and the opacity can be thinned."""
    rgb = rgba[..., :3]
    solid = rgba[..., 3] > 0.3
    l = rgb.mean(-1, keepdims=True)
    l = (l - l[solid].mean()) / (l[solid].std() + 1e-6) * 0.15 * hc.get('contrast', 1.0) + hc.get('level', 0.44)
    rgb = np.clip(l * 2.0 * np.asarray(hc.get('tint', (0.16, 0.10, 0.07))), 0, 1)
    al = rgba[..., 3:]
    hp = rgba[..., :3].mean(-1) - ndi.gaussian_filter(rgba[..., :3].mean(-1), 6.0)
    hp = hp / (hp[solid].std() + 1e-6)
    tuft = ndi.gaussian_filter(rng.standard_normal(al.shape[:2]), 0.006 * al.shape[0]); tuft /= tuft.std() + 1e-9
    al = al * np.clip(0.76 + 0.14 * hp + 0.16 * tuft, 0.5, 1.0)[..., None]      # every strand stays above the cut-out threshold on its own, but tufts and strands differ in how far above
    if hc.get('density', 1.0) < 1.0:                     # thinner hair: strands drop out, in streaks, not evenly
        thin = SK.fractal(al.shape[:2], rng, (1.2, 6.0), (1.0, 0.6))
        thin = ndi.gaussian_filter(thin, (4.0, 0.8))
        al = al * np.clip(0.5 + (hc['density'] - 0.5) * 2.2 + 0.55 * thin[..., None], 0, 1)
    return np.concatenate([rgb, np.clip(al, 0, 1)], -1)


for key in ('teeth', 'tongue', 'lashes', 'hair', 'beard'):
    if (key == 'lashes' and not lash_spec.get('mesh', False)) or (key == 'beard' and not beard_spec.get('mesh', False)):
        continue                                           # painted on the skin instead; no picture needed
    if key in pdata and pdata[key][2]:
        rgba = X.load_rgba(pdata[key][2])
        if key == 'hair':
            rgba = recolour(rgba, hair_spec)
        if key == 'beard':                               # the asset's own picture is plain; strands are drawn here
            st = ndi.gaussian_filter(rng.standard_normal((384, 384)), (3.0, 0.55), mode='wrap')        # fine strands, running one way
            st /= st.std() + 1e-9
            bt = np.array(beard_spec.get('tint', hair_spec.get('tint', (0.16, 0.10, 0.07))))
            rgba = np.concatenate([np.clip(bt * (1.0 + 0.16 * st[..., None]), 0, 1), np.clip(0.72 + 0.34 * st, 0, 1)[..., None]], -1)
        if key == 'lashes':
            ls = SPEC.get('lash', {})
            rgba = np.concatenate([np.ones_like(rgba[..., :3]) * np.asarray(ls.get('rgb', (0.06, 0.045, 0.04))), np.clip(rgba[..., 3:] * ls.get('strength', 1.0), 0, 1)], -1)
        put(SLOTS[key], rgba)
X.save_png(os.path.join(TEX, 'detail.png'), detail)

# ---------------------------------------------------------------- 7. the objects of the finished file
from scipy.spatial import cKDTree
for o in list(bpy.data.objects):
    o.hide_render = True
    o.select_set(False)
img_skin = bpy.data.images.load(os.path.join(TEX, 'skin.png'))
img_nrm = bpy.data.images.load(os.path.join(TEX, 'skin_normal.png'))
img_det = bpy.data.images.load(os.path.join(TEX, 'detail.png'))
gown_rgb = SPEC.get('gownColor', (0.60, 0.70, 0.78)); sheet_rgb = SPEC.get('sheetColor', (0.20, 0.42, 0.50))
MAT = {'skin': X.make_material('skin', image=img_skin, normal=img_nrm, rough=0.56, normal_strength=1.0),
       'skin_arms': X.make_material('skin_arms', image=img_det, rough=0.58),
       'eye': X.make_material('eye', image=img_det, rough=0.07),
       'teeth': X.make_material('teeth', image=img_det, rough=0.25),
       'tongue': X.make_material('tongue', image=img_det, rough=0.35),
       'hair': X.make_material('hair', image=img_det, rough=0.62, cutout=True, two_sided=True),
       'hair_lashes': X.make_material('hair_lashes', image=img_det, rough=0.6, cutout=True, two_sided=True),
       'hair_beard': X.make_material('hair_beard', image=img_det, rough=0.65, cutout=True, two_sided=True),
       'gown': X.make_material('gown', color=gown_rgb, rough=0.9, two_sided=True),
       'drape': X.make_material('drape', color=sheet_rgb, rough=0.88, two_sided=True)}
final = {}


def emit(name, V, F, UV, mat, morphs=()):
    ob = C.new_mesh_object(name, V, F, UV)
    ob.data.name = name
    ob.data.materials.append(MAT[mat])
    for mname, co in morphs:
        C.add_shape(ob, mname, co)
    final[name] = ob
    return ob


def compact(faces):
    """Faces given with indices into a big vertex array -> (indices of the vertices used, faces renumbered)."""
    used = np.array(sorted({int(i) for f in faces for i in f}))
    re = {o: n for n, o in enumerate(used)}
    return used, [tuple(re[int(i)] for i in f) for f in faces]


# body: head, neck and the chest inside the neckline
used, F = compact(head_q)
Pb = pos['body']
emit('body', Pb['basis'][used], F, head_uv.reshape(-1, 2), 'skin',
     [('eyesClosed', Pb['eyesClosed'][used]), ('jawOpen', Pb['jawOpen'][used]), ('breathe', breathe(Pb['basis'][used]))])
# forearms and hands: thinned, they are seen from further away than the face
arm_q = layout.quads[layout.which == 1]
if len(arm_q):
    used, F = compact(arm_q)
    V2, F2, UV2 = X.decimate(Pb['basis'][used], F, layout.new_uv[layout.which == 1].reshape(-1, 2), SPEC.get('handDetail', 0.42))
    emit('arms', V2, F2, UV2, 'skin_arms')
# eyes: the outer, cornea-shaped layer of the MakeHuman eye, with its own mapping (see pp_skin.eye_picture)
ef, euv, _ = pdata['eyes']
erest = C.get_co(parts['eyes'].data.vertices, len(parts['eyes'].data.vertices))
c0 = 0; outer = []
for f in ef:
    if euv[c0:c0 + len(f), 0].mean() > 0.85 and euv[c0:c0 + len(f), 1].mean() < 0.15:
        outer.append(f)
    c0 += len(f)
used, F = compact(outer)
uvv = np.zeros((len(erest), 2))
for side in (1.0, -1.0):
    m = np.zeros(len(erest), bool); m[used] = True; m &= (erest[:, 0] * side > 0)
    p = erest[m]
    cen = p.mean(0)
    for _ in range(2):                                   # center of the ball, from the part behind the cornea's bulge
        d_ = p - cen; ang = np.degrees(np.arccos(np.clip(-d_[:, 1] / np.linalg.norm(d_, axis=1), -1, 1)))
        q = p[ang > 38]
        Aq = np.c_[2 * q, np.ones(len(q))]; sol = np.linalg.lstsq(Aq, (q ** 2).sum(1), rcond=None)[0]; cen = sol[:3]
    d_ = p - cen; rr = np.linalg.norm(d_, axis=1)
    theta = np.degrees(np.arccos(np.clip(-d_[:, 1] / rr, -1, 1)))
    phi = np.arctan2(d_[:, 2], d_[:, 0] * side)
    rho = 0.5 * np.power(np.clip(theta / 100.0, 0, 1), 0.6)
    uvv[m] = np.stack([0.5 + rho * np.cos(phi), 0.5 + rho * np.sin(phi)], 1)
eye_uv = slot_uv(np.array([uvv[i] for f in outer for i in f]), SLOTS['eye'])
Pe = pos['eyes']['basis'].copy()
for e in EYE.values():                                   # drawn in very slightly, so that the ball never shows past a lid margin
    mine = np.linalg.norm(Pe - e['centre'], axis=1) < 1.5 * e['radius']
    Pe[mine] = e['centre'] + (Pe[mine] - e['centre']) * 0.985
emit('eyes', Pe[used], F, eye_uv, 'eye')
# teeth: thinned; the lower row follows the jaw as one rigid piece
tf, tuv, _ = pdata['teeth']
Pt = pos['teeth']
V2, F2, UV2 = X.decimate(Pt['basis'], tf, slot_uv(tuv, SLOTS['teeth']), SPEC.get('teethDetail', 0.22))
delta = np.linalg.norm(Pt['jawOpen'] - Pt['basis'], axis=1)
lower = delta > 0.25 * delta.max()
A0, A1 = Pt['basis'][lower], Pt['jawOpen'][lower]
ca, cb = A0.mean(0), A1.mean(0)
Uk, _, Vk = np.linalg.svd((A0 - ca).T @ (A1 - cb))
Rk = (Uk @ np.diag([1, 1, np.sign(np.linalg.det(Uk @ Vk))]) @ Vk).T
near = cKDTree(Pt['basis']).query(V2)[1]
lowv = lower[near]
# every tooth (and each gum) is its own separate piece: a piece moves with the jaw as a whole or not at all
par = list(range(len(V2)))


def root_of(a_):
    while par[a_] != a_:
        par[a_] = par[par[a_]]; a_ = par[a_]
    return a_


for f_ in F2:
    for i_ in f_[1:]:
        par[root_of(i_)] = root_of(f_[0])
roots = np.array([root_of(i_) for i_ in range(len(V2))])
for r_ in np.unique(roots):
    m_ = roots == r_
    lowv[m_] = lowv[m_].mean() > 0.5
Vj = V2.copy()
Vj[lowv] = (V2[lowv] - ca) @ Rk.T + cb
teeth_mode = SPEC.get('teeth', 'all')                  # 'all', 'lower' (upper dentures out) or 'none' (all dentures out)
if teeth_mode == 'lower':
    fk = [f for f in F2 if all(lowv[i] for i in f)]
    uk = [uv for f, c in zip(F2, np.cumsum([0] + [len(f) for f in F2[:-1]])) if all(lowv[i] for i in f) for uv in UV2[c:c + len(f)]]
    usedk, fk = compact(fk)
    emit('teeth', V2[usedk], fk, uk, 'teeth', [('jawOpen', Vj[usedk])])
elif teeth_mode != 'none':
    emit('teeth', V2, F2, UV2, 'teeth', [('jawOpen', Vj)])
tf, tuv, _ = pdata['tongue']
emit('tongue', pos['tongue']['basis'], tf, slot_uv(tuv, SLOTS['tongue']), 'tongue', [('jawOpen', pos['tongue']['jawOpen'])] if 'jawOpen' in pos['tongue'] else [])
lf, luv, _ = pdata['lashes']
lash_len = SPEC.get('lash', {}).get('length', 1.0)


def shorten(P_):
    """Lashes at a fraction of the asset's length: each point keeps its direction from the eye's center and moves in toward the lid."""
    out = P_.copy()
    for e in EYE.values():
        d_ = P_ - e['centre']; r_ = np.linalg.norm(d_, axis=1)
        mine = r_ < 2.2 * e['radius']
        base = r_[mine].min()
        out[mine] = e['centre'] + d_[mine] * ((base + (r_[mine] - base) * lash_len) / r_[mine])[:, None]
    return out


if lash_spec.get('mesh', False):                          # off by default: at the distances of the browser's room the lash cards read as black spikes; the painted line does not
    emit('lashes', shorten(pos['lashes']['basis']), lf, slot_uv(luv, SLOTS['lashes']), 'hair_lashes', [('eyesClosed', shorten(pos['lashes']['eyesClosed']))])
if 'hair' in parts:
    hf, huv, _ = pdata['hair']
    Vh = pos['hair']['basis'].copy()
    bidx = np.nonzero(inbody)[0]
    if hair_spec.get('lieDown', not hair_spec.get('cutSides', True)):
        # Longer hair was made for a standing person and hangs toward the feet. On someone lying down it falls back onto
        # the mattress: every part of the hair that is not on the head itself is brought down to the lying surface,
        # drawn in toward the head (it no longer hangs its full length) and spread a little outward.
        hidx = bidx[lab['head'][bidx] > 0.5]
        d_head = cKDTree(pos['body']['basis'][hidx]).query(Vh)[0]
        free = np.clip((d_head - 0.016 * k) / (0.034 * k), 0, 1)
        free = free * free * (3 - 2 * free)
        y_ear = 0.5 * (pos['body']['basis'][12038, 1] + pos['body']['basis'][5439, 1])
        wave = 0.004 * k * np.sin(Vh[:, 0] * 90.0 / k + Vh[:, 1] * 55.0 / k)
        below = np.maximum(y_ear - Vh[:, 1], 0.0)            # how far toward the feet of the ears a strand reaches when it hangs
        target = np.stack([Vh[:, 0] * 1.10, np.where(Vh[:, 1] < y_ear, y_ear - 0.36 * below, Vh[:, 1]), 0.007 * k + np.abs(wave)], 1)
        Vh = Vh + (target - Vh) * free[:, None]
    Vh[:, 2] = np.maximum(Vh[:, 2], 0.004)               # hair is pressed flat where the head rests
    huv2 = slot_uv(huv, SLOTS['hair'])
    # The hair is cut back to a line a little behind the natural hairline (the hairline itself is painted on the skin).
    # "How far behind the hairline" is measured on the head: for every scalp vertex, the distance to the nearest bare
    # forehead or temple vertex; a hair point takes the value of the skin under it.
    bare = np.nonzero(front_zone & ~scalp_in)[0]
    depth_b = np.full(len(stand), 9.0)
    depth_b[bidx] = cKDTree(stand[bare]).query(stand[bidx])[0] * S
    depth_b[bare] = 0.0
    matters = front_zone | scalp_in
    d3, i3 = cKDTree(pos['body']['basis'][bidx]).query(Vh, k=3)
    w3 = 1.0 / np.maximum(d3, 1e-6); w3 /= w3.sum(1, keepdims=True)
    depth_h = (np.where(matters[bidx[i3]], depth_b[bidx[i3]], 9.0) * w3).sum(1)
    cut = hair_spec.get('setback', 0.011) * k - depth_h                    # positive: in front of the cut line
    top_cut = hair_spec.get('cutTop')                    # balding: no hair mesh above this fraction of the head's height (standing figure)
    if top_cut is not None:
        head_lo, head_hi = stand[991, 2], stand[inbody, 2].max()
        zrel = ((stand[bidx[i3], 2] - head_lo) / (head_hi - head_lo) * w3).sum(1)
        cut = np.maximum(cut, (zrel - top_cut) * 0.2)
    n_before = len(hf)
    Vh, hf, huv2 = K.clip_with_uv(Vh, hf, huv2, cut)
    if len(hf):
        # the edge of the hair is laid down onto the skin, so the hair thins out toward its edge instead of ending in a step
        cnt = {}
        for f in hf:
            for q in range(len(f)):
                e = (min(f[q], f[(q + 1) % len(f)]), max(f[q], f[(q + 1) % len(f)]))
                cnt[e] = cnt.get(e, 0) + 1
        lay_w = np.zeros(len(Vh))
        for (u_, v_), c_ in cnt.items():
            if c_ == 1:
                lay_w[u_] = lay_w[v_] = 1.0
        for _ in range(2):                                # and, less so, the next two rows in from the edge
            nxt = lay_w.copy()
            for (u_, v_) in cnt:
                nxt[u_] = max(nxt[u_], 0.55 * lay_w[v_]); nxt[v_] = max(nxt[v_], 0.55 * lay_w[u_])
            lay_w = nxt
        dist_b, near_i = cKDTree(pos['body']['basis'][bidx]).query(Vh)
        skin_pt = pos['body']['basis'][bidx[near_i]] + body_N[bidx[near_i]] * 0.0015
        lay_w *= np.clip(1.0 - (dist_b - 0.012 * k) / (0.02 * k), 0, 1) * hair_spec.get('layEdge', 1.0)      # only where the hair is close to the head anyway
        Vh = Vh + (skin_pt - Vh) * lay_w[:, None]
        Vh[:, 2] = np.maximum(Vh[:, 2], 0.004)
        hair_ob = emit('hair', Vh, hf, huv2, 'hair')
        # and it thins out toward every edge: the outermost vertices are fully see-through, the next row partly; with the
        # strands' uneven opacity in the picture this gives a broken, feathered edge in place of a polygon outline
        rim = np.zeros(len(Vh))
        for (u_, v_), c_ in cnt.items():
            if c_ == 1:
                rim[u_] = rim[v_] = 1.0
        for _ in range(2):                                # two rows in from the edge: 0, about a third, about two thirds, then solid
            nxt = rim.copy()
            for (u_, v_) in cnt:
                nxt[u_] = max(nxt[u_], rim[v_] - 0.34); nxt[v_] = max(nxt[v_], rim[u_] - 0.34)
            rim = nxt
        X.set_vertex_alpha(hair_ob, 1.0 - rim)
    log(f'HAIR cut back behind the painted hairline: {n_before} faces before, {len(hf)} after')
if 'beard' in parts and beard_spec.get('mesh', False):       # off by default (see the note where the beard is painted)
    bf_, buv_, _ = pdata['beard']
    Vb = pos['beard']['basis']
    # like the hair, the shell's rim is laid onto the skin so the beard thins out at its edge
    cnt = {}
    for f in bf_:
        for q in range(len(f)):
            e = (min(f[q], f[(q + 1) % len(f)]), max(f[q], f[(q + 1) % len(f)]))
            cnt[e] = cnt.get(e, 0) + 1
    rim = np.zeros(len(Vb))
    for (u_, v_), c_ in cnt.items():
        if c_ == 1:
            rim[u_] = rim[v_] = 1.0
    bidx = np.nonzero(inbody)[0]
    near_i = cKDTree(pos['body']['basis'][bidx]).query(Vb)[1]
    to_skin = (pos['body']['basis'][bidx[near_i]] + body_N[bidx[near_i]] * 0.001 - Vb) * rim[:, None]
    morphs_b = [('jawOpen', pos['beard']['jawOpen'] + to_skin)] if 'jawOpen' in pos['beard'] else []
    emit('beard', Vb + to_skin, bf_, slot_uv(np.mod(buv_ * beard_spec.get('repeat', 3.0), 1.0), SLOTS['beard']), 'hair_beard', morphs_b)
gV, gF, gUV = cloth['gown']
emit('gown', gV, gF, gUV, 'gown', [('breathe', breathe(gV))])
sV, sF, sUV = cloth['sheet']
emit('sheet', sV, sF, sUV, 'drape', [('breathe', breathe(sV))])

# ---------------------------------------------------------------- 7b. landmarks, measured on the finished meshes
# Base-mesh vertex numbers (the same on every MakeHuman person): where the lips meet on the midline (upper 474, lower 493),
# the tip of the nose (297), the chin (991), the middle of the forehead (5192), the outermost point of each ear (12038, 5439).
def gl(v):
    """Lying frame (Blender: X left, Y to the head, Z up) -> the exported file's frame (X left, Y up, Z to the feet)."""
    return [round(float(v[0]), 4), round(float(v[2]), 4), round(float(-v[1]), 4)]


def tree_of(ob):
    me_ = ob.data
    return BVHTree.FromPolygons([tuple(v.co) for v in me_.vertices], [tuple(p_.vertices) for p_ in me_.polygons])


def drop_on(trees, x, y, default_z):
    """The highest point of the given meshes straight above the table at (x, y)."""
    best = None
    for t_ in trees:
        loc = t_.ray_cast(Vector((x, y, 2.0)), Vector((0, 0, -1)))[0]
        if loc is not None and (best is None or loc.z > best):
            best = loc.z
    return np.array([x, y, default_z if best is None else best])


Bb = pos['body']['basis']
LM = {'mouth': gl(0.5 * (Bb[474] + Bb[493])), 'nose': gl(Bb[297])}
closed_tree, _ = lid_tree(1.0)                               # the stored eyesClosed movement already includes the closing factor
for nm in ('L', 'R'):
    e = EYE[nm]
    o = Vector(e['centre']) + Vector(e['axis']) * (e['radius'] + 0.03)
    loc = closed_tree.ray_cast(o, -Vector(e['axis']), 0.05)[0]
    LM['eye' + nm] = gl(loc if loc is not None else e['apex'])
cloth_trees = [tree_of(final['sheet']), tree_of(final['gown'])]
y_chest = min(cloth['y_notch'] - 0.055 * MM, cloth['y_top'] - 0.03 * k)
LM['chest'] = gl(drop_on(cloth_trees, 0.0, y_chest, 0.1))
arm_tree = [tree_of(final['arms'])] if 'arms' in final else []
for nm, s_ in (('L', '.L'), ('R', '.R')):
    c = 0.5 * (J['metacarpal2' + s_] + J['finger3-1' + s_])
    LM['hand' + nm] = gl(drop_on(arm_tree, c[0], c[1], c[2]))
    LM['wrist' + nm] = gl(drop_on(arm_tree, J['wrist' + s_][0], J['wrist' + s_][1], J['wrist' + s_][2]))
LM.update({'chin': gl(Bb[991]), 'forehead': gl(Bb[5192]), 'earL': gl(Bb[12038]), 'earR': gl(Bb[5439])})
LM['sternalNotch'] = gl(drop_on([tree_of(final['body'])] + cloth_trees, 0.0, cloth['y_notch'], 0.1))
jaw_move = float(np.linalg.norm(pos['body']['jawOpen'][493] - Bb[493]))
log(f"LANDMARKS mouth {LM['mouth']} eyeL {LM['eyeL']} nose {LM['nose']} chest {LM['chest']} handL {LM['handL']}; lower lip moves {jaw_move * 1000:.0f} mm with jawOpen, upper {np.linalg.norm(pos['body']['jawOpen'][474] - Bb[474]) * 1000:.1f} mm")

# ---------------------------------------------------------------- 8. export
tri_total = 0
for nm, ob in final.items():
    ob.hide_render = False
    ob.select_set(True)
    tri_total += sum(len(p.vertices) - 2 for p in ob.data.polygons)
bpy.context.view_layer.objects.active = final['body']
raw = os.path.join(OUT, PID + '.raw.glb')
bpy.ops.export_scene.gltf(filepath=raw, export_format='GLB', use_selection=True, export_yup=True, export_apply=False, export_morph=True, export_morph_normal=False,
                          export_morph_tangent=False, export_tangents=False, export_image_format='AUTO', export_extras=False, export_try_sparse_sk=True,
                          export_draco_mesh_compression_enable=False, export_animations=False, export_skins=False,
                          export_vertex_color='ACTIVE', export_all_vertex_colors=False, export_active_vertex_color_when_no_material=False)
X.patch_glb(raw, {'hair': 0.42, 'hair_lashes': 0.3, 'hair_beard': 0.42}, {'hair', 'hair_lashes', 'hair_beard', 'gown', 'drape'})
log(f'EXPORT {raw} {os.path.getsize(raw) / 1e6:.2f} MB, {tri_total} triangles: ' + ', '.join(f'{n} {sum(len(p.vertices) - 2 for p in o.data.polygons)}' for n, o in final.items()))
allv = np.concatenate([np.array([v.co[:] for v in o.data.vertices]) for o in final.values()])
side = {'id': PID, 'heightM': MM, 'sex': SPEC['sex'], 'ageYears': SPEC['ageYears'],
        'source': 'MakeHuman base mesh and assets (CC0) via MPFB 2.0.18; skin ' + SPEC['skin'].split('/')[0] + ((', hair ' + SPEC['parts']['hair'].split('/')[0]) if SPEC.get('parts', {}).get('hair') else ''),
        'morphs': ['eyesClosed', 'jawOpen', 'breathe'],
        'morphsByMesh': {n: [kb.name for kb in o.data.shape_keys.key_blocks[1:]] for n, o in final.items() if o.data.shape_keys},
        'meshes': list(final.keys()), 'triangles': tri_total, 'landmarks': LM, 'headTiltDeg': 0.0, 'neckExtensionDeg': round(pose['neckExtDeg'], 1),
        'headRestGapM': round(max(0.0, pose['headGap'] * S), 4), 'armAbductionDeg': round(pose['armAbductionDeg'], 1), 'armsHalfWidthM': round(pose['armsHalfWidth'], 3),
        'jawOpenM': round(jaw_move, 4), 'breatheRiseM': round(BREATH, 4), 'lyingLengthM': round(float(bb[:, 1].max() - bb[:, 1].min()), 3),
        'bboxMin': gl([allv[:, 0].min(), allv[:, 1].max(), allv[:, 2].min()]), 'bboxMax': gl([allv[:, 0].max(), allv[:, 1].min(), allv[:, 2].max()]),
        'build': build, 'group': SPEC.get('group'), 'note': SPEC.get('note', '')}
json.dump(side, open(os.path.join(OUT, PID + '.json'), 'w'), indent=1)
if DEBUG:
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, PID + '_final.blend'))
log('done')
