"""p25_02_body.py: the skinned body of the hero patient p25, standing, from form.npz (p25_01_form.py).
   BLENDER_USER_RESOURCES=~/Developer/overlord-asset-sources/people/blender-user \
     Blender -b --factory-startup --python tools/people/hero/p25_02_body.py
 A. The carrier is rebuilt exactly as in p25_01 (same MakeHuman macros and targets, so the same vertex order) and every
    vertex is moved to its place in form.npz: the body surface, the joint helpers the rig is fitted to, and the shells the
    hair, brows and lashes are fitted to.
 B. MakeHuman's default rig without toes (CC0 weights) is fitted; brows, lashes and (for Stage 1) the earlier p25's
    MakeHuman hair are fitted to the new head.
 C. The 52 ARKit-named face units of MakeHuman's faceunits01 pack (CC0) are loaded as shape keys and carried to the parts.
 D. The skin (body faces only, helpers dropped) becomes its own object with UVs, weights and every shape key.
 E. One Catmull-Clark level on the head and neck, trunk and arms (hands, legs and feet stay at the cage), carrying shape
    keys, weights and UVs (method from the texture-first study's tf_lib.cc_subdivide, copied into hero_lib).
 F. Head detail: the subdivided head and neck vertices take the sculpt's own fine relief (lid margins, lip edge, nostril
    and ear folds) by projecting the same vertices of the sculpt-wrapped head onto the sculpt at its finest level and
    carrying that offset along the normal onto the identity-changed head.
Saves p25/blend/p25_body.blend and work/body.npz."""
import bpy, os, sys, json, math
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Matrix, Vector
import hero_lib as H
import pp_common as PC, pp_body as PB
import nicp

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend'); os.makedirs(BLEND, exist_ok=True)
log = H.Log('body')
FORM = np.load(os.path.join(WORK, 'form.npz'), allow_pickle=True)
SPEC = json.load(open(os.path.join(H.PEOPLE, 'work', 'build', 'p25.spec.json')))
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
M = PC.mpfb()

# ---------------------------------------------------------------- A. carrier, same build as p25_01
macros = json.loads(str(FORM['macros']))
bm = M.Human.create_human(mask_helpers=False, detailed_helpers=True, extra_vertex_groups=True, feet_on_ground=False, scale=0.1, macro_detail_dict=macros)
bm.name = 'carrier'
for name, w in SPEC.get('targets', []):
    path = os.path.join(M.system_targets, name + '.target.gz')
    if not os.path.exists(path):
        path = os.path.join(PC.USERDATA, 'targets', name + '.target')
    k = M.Target.load_target(bm, path, weight=0.0)
    k.slider_min, k.slider_max = -2.0, 3.0; k.value = float(w)
M.Target.bake_targets(bm)
V_all = FORM['V']
assert len(bm.data.vertices) == len(V_all), (len(bm.data.vertices), len(V_all))
H.set_co(bm.data.vertices, V_all); bm.data.update()
S = float(FORM['S'])
inbody, quads, fuv = FORM['inbody'], FORM['quads'], FORM['fuv']
log(f'carrier rebuilt: {len(V_all)} vertices moved to the form; volume {abs(H.volume(V_all, quads)) * 1000:.2f} L')

# ---------------------------------------------------------------- B. rig and MakeHuman parts
arm = M.Human.add_builtin_rig(bm, 'default_no_toes'); arm.name = 'rig'
parts = {}
for key, kind, frag in (('brows', 'eyebrows', SPEC['parts']['brows']), ('lashes', 'eyelashes', SPEC['parts']['lashes']), ('hair', 'hair', SPEC['parts']['hair'])):
    path = M.Asset.find_asset_absolute_path(frag, kind)
    ob = M.Human.add_mhclo_asset(path, bm, asset_type=kind.capitalize(), subdiv_levels=0, material_type='MAKESKIN')
    for m_ in list(ob.modifiers):
        if m_.type != 'ARMATURE':
            ob.modifiers.remove(m_)
    ob.name = key; parts[key] = ob
for m_ in list(bm.modifiers):
    if m_.type != 'ARMATURE':
        bm.modifiers.remove(m_)
log('rig bones', len(arm.data.bones), '; parts', {k: len(o.data.polygons) for k, o in parts.items()})

# ---------------------------------------------------------------- C. the 52 ARKit face units
FU_DIR = os.path.join(PC.USERDATA, 'targets', 'faceunits')
ARKIT = sorted(f[:-7] for f in os.listdir(FU_DIR) if f.endswith('.target'))
for name in ARKIT:
    k = M.Target.load_target(bm, os.path.join(FU_DIR, name + '.target'), weight=0.0, name=name)
M.Face.interpolate_targets(bm)
bpy.context.view_layer.update()
kb = bm.data.shape_keys.key_blocks
basis = H.get_co(kb[0].data, len(kb[0].data))
# the units are stored in MakeHuman's own unit; the carrier was scaled to metres by S
for name in ARKIT:
    d = H.get_co(kb[name].data, len(kb[name].data)) - basis
    H.set_co(kb[name].data, basis + d * S)
for o in parts.values():
    if o.data.shape_keys:
        okb = o.data.shape_keys.key_blocks; ob0 = H.get_co(okb[0].data, len(okb[0].data))
        for k in okb[1:]:
            H.set_co(k.data, ob0 + (H.get_co(k.data, len(k.data)) - ob0) * S)
log(f'face units: {len(ARKIT)} loaded ({", ".join(ARKIT[:6])} ...); parts with keys: {[k for k, o in parts.items() if o.data.shape_keys]}')

# ---------------------------------------------------------------- D. the skin object: body faces only
bidx = np.nonzero(inbody)[0]
loc = -np.ones(len(V_all), int); loc[bidx] = np.arange(len(bidx))
faces = [tuple(loc[q]) if q[3] != q[2] else tuple(loc[q[:3]]) for q in quads]
uvs = np.concatenate([fuv[i][:len(f)] for i, f in enumerate(faces)])
groups = {g.index: g.name for g in bm.vertex_groups}
bone_names = {b.name for b in arm.data.bones}
WN = sorted(n for n in groups.values() if n in bone_names)
widx = {n: i for i, n in enumerate(WN)}
Wt = np.zeros((len(V_all), len(WN)), np.float32)
extra = {n: np.zeros(len(V_all), np.float32) for n in ('lips', 'fingernails', 'toenails', 'ears', 'scalp', 'nipple')}
for v in bm.data.vertices:
    for g in v.groups:
        n = groups[g.group]
        if n in widx:
            Wt[v.index, widx[n]] = g.weight
        elif n in extra:
            extra[n][v.index] = g.weight
keys = {name: H.get_co(kb[name].data, len(kb[name].data)) for name in ARKIT}

# ---------------------------------------------------------------- E. subdivision of the chosen regions
lab = PB.segment_labels(bm)
fcen = lambda arr: np.array([arr[list(q[:len(f)])].mean() for q, f in zip(quads, faces)])
head_f = fcen(lab['head'] + lab['neck']) > 0.4
torso_f = fcen(lab['torso']) > 0.4
arms_f = (fcen(lab['armL'] + lab['armR']) > 0.4) & ~(fcen(lab['handL'] + lab['handR']) > 0.4)
subset = np.nonzero((head_f | torso_f | arms_f) & np.array([len(f) == 4 for f in faces]))[0]
Wsub, nfaces, nuvs, parent = H.cc_subdivide(len(bidx), faces, uvs, subset)
V1 = Wsub @ V_all[bidx]
log(f'subdivision: {len(subset)} of {len(faces)} faces (head+neck {int(head_f.sum())}, trunk {int(torso_f.sum())}, arms {int(arms_f.sum())}) -> {len(V1)} vertices, {len(nfaces)} faces, {sum(len(f) - 2 for f in nfaces)} triangles')
Wt1 = np.asarray(Wsub @ Wt[bidx]); Wt1[Wt1 < 1e-4] = 0
Wt1 = Wt1 / np.maximum(Wt1.sum(1, keepdims=True), 1e-8)
extra1 = {n: np.asarray(Wsub @ a[bidx]) for n, a in extra.items()}
keys1 = {n: Wsub @ k[bidx] for n, k in keys.items()}
lab1 = {n: np.asarray(Wsub @ a[bidx]) for n, a in lab.items()}
region1 = np.asarray(Wsub @ FORM['region'][bidx].astype(float))
cage_of = np.full(len(V1), -1); cage_of[:len(bidx)] = bidx           # new vertices keep their old index first

# ---------------------------------------------------------------- F. the sculpt's fine relief on the head
WH = np.load(os.path.join(WORK, 'form', 'wrap_head.npz'))
ridx, Wh_c = WH['ridx'], WH['Wh_c']
sc, Rs, ca, cb = float(WH['sc']), WH['Rs'], WH['ca'], WH['cb']
L3 = np.load(os.path.join(H.HBM_CACHE, 'hbm_male_L3.npz')); TV3, TF3 = L3['V'].astype(np.float64), L3['F']
tree3 = nicp.bvh(TV3, TF3)
# the sculpt-wrapped head on the subdivided topology, in the sculpt's own frame
Wfull = V_all.copy(); Wfull[ridx] = (Wh_c - ca) @ Rs.T * sc + cb          # carrier frame -> sculpt frame
Wsculpt = Wsub @ Wfull[bidx]
Fq = [f if len(f) == 4 else (f[0], f[1], f[2], f[2]) for f in nfaces]
Fq = np.array(Fq, np.int32)
in_head = region1 > 0.999
Nsub = nicp.vertex_normals(Wsculpt, Fq)
U3, N3, d3 = nicp.closest(tree3, Wsculpt[in_head])
off = ((U3 - Wsculpt[in_head]) * Nsub[in_head]).sum(1)
ok = (d3 < 0.004) & ((N3 * Nsub[in_head]).sum(1) > 0.5)
off[~ok] = 0.0
off = np.clip(off, -0.0025, 0.0025) / sc                                  # back to the carrier's head size
N1 = nicp.vertex_normals(V1, Fq)
detail = np.zeros(len(V1)); detail[np.nonzero(in_head)[0]] = off
# fade the relief out at the neck seam of the head region and where the identity or fat moved things a lot
wh1 = np.asarray(Wsub @ FORM['w_h'][bidx])
detail *= np.clip(wh1 * 1.5, 0, 1)
V1 = V1 + N1 * detail[:, None]
for n in keys1:
    keys1[n] = keys1[n] + N1 * detail[:, None]
log(f'head relief from the sculpt at multires level 3: {int(ok.sum())} of {int(in_head.sum())} head vertices; offset mean {np.abs(off[ok]).mean() * 1000:.3f} mm, 95th {np.percentile(np.abs(off[ok]), 95) * 1000:.3f} mm')

# ---------------------------------------------------------------- the skin object
skin = H.new_mesh('skin', V1, nfaces, uvs=nuvs)
skin.data.uv_layers[0].name = 'UVMap'
for n in WN:
    g = skin.vertex_groups.new(name=n)
    col = Wt1[:, widx[n]]
    for i in np.nonzero(col > 0)[0]:
        g.add([int(i)], float(col[i]), 'REPLACE')
for n, a in extra1.items():
    g = skin.vertex_groups.new(name='zone_' + n)
    for i in np.nonzero(a > 0.05)[0]:
        g.add([int(i)], float(min(1.0, a[i])), 'REPLACE')
skin.shape_key_add(name='Basis', from_mix=False)
for n in ARKIT:
    k = skin.shape_key_add(name=n, from_mix=False); H.set_co(k.data, keys1[n] + (V1 - Wsub @ V_all[bidx]) * 0)
    k.value = 0.0
mod = skin.modifiers.new('rig', 'ARMATURE'); mod.object = arm
skin.parent = arm
log(f'skin: {len(V1)} vertices, {len(skin.data.polygons)} faces, {len(WN)} weight groups, {len(ARKIT)} face shapes')
# keep the parts; drop the carrier
for o in parts.values():
    o.parent = arm
bm_name = bm.name
bpy.data.objects.remove(bm, do_unlink=True)
np.savez_compressed(os.path.join(WORK, 'body.npz'), V=V1, F=Fq, cage_of=cage_of, n_cage=len(bidx), bidx=bidx, region=region1, w_h=wh1,
                    **{'lab_' + k: v for k, v in lab1.items()}, **{'zone_' + k: v for k, v in extra1.items()}, eyeL=FORM['eyeL'], eyeR=FORM['eyeR'],
                    eyeF=FORM['eyeF'], eyeFR=FORM['eyeFR'], neck_level=FORM['neck_level'], neck_axis=FORM['neck_axis'], neck_notch=FORM['neck_notch'],
                    neck_circ=FORM['neck_circ'], arkit=np.array(ARKIT), subset_faces=subset)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_body.blend'))
log('SAVED p25_body.blend')
