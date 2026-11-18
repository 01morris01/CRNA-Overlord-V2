"""p25_10_textures.py: the skin, eye and part materials of the hero patient p25, baked with Cycles into image maps.
   Blender -b --factory-startup --python tools/people/hero/p25_10_textures.py [-- --fast]
Skin, head (skin_head, 4096 colour and normal, 2048 packed) and body (skin_body, 2048 each):
 - texture coordinates: MakeHuman's islands, re-packed so each piece fills its own square (UVPacked becomes the
   exported TEXCOORD_0);
 - base colour: MakeHuman's CC0 'middleage african male' skin for the broad colour zones (it holds only about 2 px/mm
   of face), graded to the earlier spec's tone (sRGB 0.36 / 0.24 / 0.17 on the cheek), with computed layers on top:
   fine mottling, slightly darker periorbital skin and lip margins, warmer lips, a shaved 58-year-old's beard shadow
   with grey and black stubble dots, paler palms; no colour is taken from any scan;
 - normal (head): the Blender Studio sculpt's level-3 relief (CC0) baked onto the head as wrapped on the sculpt, in
   tangent space (lid margins, lip edge, nostrils, ears, creases); body: neutral (its fine relief is the detail map);
 - packed: R ambient occlusion (rest pose, parts included), G roughness by zone (forehead/nose 0.38, cheeks 0.48,
   lips 0.33, scalp 0.52, ears 0.45, nails 0.24, palms 0.58, elsewhere 0.50), B thickness (thin: ears, nostril wings,
   lids, fingers);
 - skin_detail_normal: a 512 px tiling pore normal, 36 mm across, from the high-passed relief (< 1.2 mm) of the
   "Infinite" head scan by Lee Perry-Smith (CC BY 3.0, credited), as cut by the texture-first study; no shape, colour or
   feature of that face is used.
Eyes: an iris drawn here (dark brown, limbal ring, radial fibres, 3 mm pupil) and a sclera with faint vessels, baked into
the sculpt eye's own texture coordinates. Saves p25/blend/p25_textured.blend and the maps in work/tex/."""
import bpy, bmesh, os, sys, json, math
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Vector, Matrix
import hero_lib as H
import pose_lib as PL

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
TEX = os.path.join(WORK, 'tex'); os.makedirs(TEX, exist_ok=True)
log = H.Log('tex')
FAST = '--fast' in H.args_after_dashes()
HEAD_RES = 1024 if FAST else 4096
BODY_RES = 512 if FAST else 2048
PACK_RES = 512 if FAST else 2048
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_blankets.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']; arm.animation_data.action = bpy.data.actions['flat']; scene.frame_set(1)
SHd, SB = bpy.data.objects['skin_head'], bpy.data.objects['skin_body']
log('opened'); H.use_gpu(scene, 64)
scene.cycles.use_denoising = False
log('gpu set')
MHSKIN = os.path.join(H.PEOPLE, 'blender-user', 'extensions', '.user', 'user_default', 'mpfb', 'data', 'skins', 'middleage_african_male', 'middleage_darkskinned_male_diffuse.png')


# ---------------------------------------------------------------- texture coordinates: packed islands
def packed_uv(o, margin=0.004):
    """Pack the object's MakeHuman islands on a plain copy of its mesh (no shape keys or modifiers: Blender 5.1 crashed
    entering edit mode on the skinned, shape-keyed original), then copy the result back as UVPacked."""
    me = o.data
    tmp_me = bpy.data.meshes.new('tmp_uv')
    V = H.get_co(me.vertices, len(me.vertices))
    tmp_me.from_pydata([tuple(v) for v in V], [], [tuple(p.vertices) for p in me.polygons])
    lay0 = tmp_me.uv_layers.new(name='UVPacked')
    lay0.data.foreach_set('uv', np.array([d.uv[:] for d in me.uv_layers['UVMap'].data], np.float32).ravel())
    tmp = bpy.data.objects.new('tmp_uv', tmp_me); scene.collection.objects.link(tmp)
    for x in bpy.context.selected_objects:
        x.select_set(False)
    tmp.select_set(True); bpy.context.view_layer.objects.active = tmp
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.uv.select_all(action='SELECT')
    bpy.ops.uv.pack_islands(rotate=True, margin=margin)
    bpy.ops.object.mode_set(mode='OBJECT')
    uv = np.array([d.uv[:] for d in tmp_me.uv_layers['UVPacked'].data], np.float32)
    bpy.data.objects.remove(tmp, do_unlink=True); bpy.data.meshes.remove(tmp_me)
    lay = me.uv_layers.new(name='UVPacked'); lay.data.foreach_set('uv', uv.ravel())
    me.uv_layers.active = lay
    log(f'{o.name}: islands packed, UVPacked bbox {uv.min(0).round(3)}..{uv.max(0).round(3)}')


packed_uv(SHd); log('head packed'); packed_uv(SB); log('body packed')


# ---------------------------------------------------------------- per-vertex fields for zones
def vgroup(o, name):
    return PL.group_w(o, {name})


def attr(o, name, values):
    if name in o.data.attributes:
        o.data.attributes.remove(o.data.attributes[name])
    a = o.data.attributes.new(name, 'FLOAT', 'POINT'); a.data.foreach_set('value', np.asarray(values, np.float32))


log('evaluating'); VH = PL.evaluated(SHd); VB = PL.evaluated(SB); log('evaluated')
QH, QB = H.quads_of(SHd), H.quads_of(SB)
NH = H.vertex_normals(VH, QH)
bone = lambda n: np.array(arm.data.bones[n].head_local)
eyeL, eyeR = bone('eye.L'), bone('eye.R')
lips = vgroup(SHd, 'zone_lips'); ears = vgroup(SHd, 'zone_ears'); scalp = vgroup(SHd, 'zone_scalp')
mouth_c = VH[lips > 0.5].mean(0)
# head frame (lying): up the head = +Y, front = +Z, his left = +X
dist_eye = np.minimum(np.linalg.norm(VH - eyeL, axis=1), np.linalg.norm(VH - eyeR, axis=1))
periorb = np.clip(1 - (dist_eye - 0.014) / 0.016, 0, 1) * (VH[:, 2] > eyeL[2] - 0.01)
nose_tip = VH[np.argmax(VH[:, 2] * (np.abs(VH[:, 0]) < 0.01))]
# beard zone: lower face and upper neck in front of the ears, below the cheekbones, not the lips
ear_y = 0.5 * (eyeL[1] + eyeR[1]) - 0.015
beard = np.clip((ear_y - 0.035 - VH[:, 1]) / 0.02, 0, 1) * np.clip((VH[:, 2] - (mouth_c[2] - 0.11)) / 0.03, 0, 1) * (1 - np.clip(lips * 2, 0, 1)) * (scalp < 0.3)
beard *= np.clip((np.abs(VH[:, 0]) < 0.075) * 1.0 + 0.0, 0, 1)
beard = H.smooth_field(beard, H.edges_of(QH), n_iter=8, lam=0.5)
tzone = np.exp(-((VH[:, 0]) / 0.025) ** 2) * (VH[:, 1] > mouth_c[1] + 0.02)
attr(SHd, 'z_lips', lips); attr(SHd, 'z_perio', periorb); attr(SHd, 'z_beard', beard); attr(SHd, 'z_tzone', tzone); attr(SHd, 'z_ears', ears); attr(SHd, 'z_scalp', scalp)
nails = vgroup(SB, 'zone_fingernails') + vgroup(SB, 'zone_toenails')
palms = np.zeros(len(VB))
hands = PL.group_w(SB, {f'finger{i}-{j}.{s}' for i in range(1, 6) for j in (1, 2, 3) for s in ('L', 'R')} | {'wrist.L', 'wrist.R'} | {f'metacarpal{i}.{s}' for i in range(1, 5) for s in ('L', 'R')})
attr(SB, 'z_nails', nails); attr(SB, 'z_lips', np.zeros(len(VB))); attr(SB, 'z_perio', np.zeros(len(VB))); attr(SB, 'z_beard', np.zeros(len(VB))); attr(SB, 'z_tzone', np.zeros(len(VB)))
attr(SB, 'z_ears', np.zeros(len(VB))); attr(SB, 'z_scalp', np.zeros(len(VB)))
attr(SHd, 'z_nails', np.zeros(len(VH)))
# thickness: how far a ray goes through the body inward from each vertex (thin parts read thin)


def thickness(o, V, Q):
    N = H.vertex_normals(V, Q); tree = H.bvh(V, Q); t = np.full(len(V), 0.05)
    for i in range(len(V)):
        hit = tree.ray_cast(Vector(V[i] - N[i] * 0.0005), Vector(-N[i]), 0.05)
        if hit[0] is not None:
            t[i] = hit[3]
    return np.clip(1 - t / 0.02, 0, 1)                       # 1 = thinner than about 1 mm, 0 = 20 mm or more


thH = thickness(SHd, VH, QH); thB = thickness(SB, VB, QB)
attr(SHd, 'z_thin', thH); attr(SB, 'z_thin', thB)
# roughness by zone
rH = 0.50 - 0.12 * tzone - 0.17 * np.clip(lips, 0, 1) + 0.02 * scalp - 0.05 * ears
rB = 0.50 - 0.26 * np.clip(nails, 0, 1)
attr(SHd, 'z_rough', np.clip(rH, 0.2, 0.7)); attr(SB, 'z_rough', np.clip(rB, 0.2, 0.7))
log(f'zones: beard {int((beard > 0.5).sum())} vertices, lips {int((lips > 0.5).sum())}, periorbital {int((periorb > 0.5).sum())}; thin head vertices {int((thH > 0.5).sum())}')


# ---------------------------------------------------------------- the bake material (emission from a node tree)
def bake_mat(name, kind):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    for nd in list(nt.nodes):
        nt.nodes.remove(nd)
    out = nt.nodes.new('ShaderNodeOutputMaterial'); em = nt.nodes.new('ShaderNodeEmission'); nt.links.new(em.outputs[0], out.inputs[0])
    A = lambda n: (lambda nd: (setattr(nd, 'attribute_name', n), nd)[1])(nt.nodes.new('ShaderNodeAttribute'))
    if kind == 'color':
        uvn = nt.nodes.new('ShaderNodeUVMap'); uvn.uv_map = 'UVMap'
        ti = nt.nodes.new('ShaderNodeTexImage'); ti.image = bpy.data.images.load(MHSKIN); ti.interpolation = 'Cubic'
        nt.links.new(uvn.outputs[0], ti.inputs[0])
        # grade: MakeHuman's dark skin to the spec's tone (gain per channel set below)
        gain = nt.nodes.new('ShaderNodeMix'); gain.data_type = 'RGBA'; gain.blend_type = 'MULTIPLY'; gain.inputs['Factor'].default_value = 1.0
        gain.inputs[7].default_value = (*GAIN, 1)
        nt.links.new(ti.outputs['Color'], gain.inputs[6])
        cur = gain.outputs[2]
        tc = nt.nodes.new('ShaderNodeTexCoord')
        # mottling: two scales of noise in object space (multiplicative, +-7 % and +-4 %)
        def noise(scale, amt, detail=4):
            nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = scale; nz.inputs['Detail'].default_value = detail
            nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
            mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['To Min'].default_value = 1 - amt; mr.inputs['To Max'].default_value = 1 + amt
            nt.links.new(nz.outputs['Fac'], mr.inputs['Value']); return mr.outputs[0]
        def mul(col, fac_socket, color=None):
            mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'; mx.inputs['Factor'].default_value = 1.0
            nt.links.new(col, mx.inputs[6])
            if color is not None:
                nt.links.new(color, mx.inputs[7])
            else:
                cmb = nt.nodes.new('ShaderNodeCombineColor'); [nt.links.new(fac_socket, cmb.inputs[i]) for i in range(3)]; nt.links.new(cmb.outputs[0], mx.inputs[7])
            return mx.outputs[2]
        cur = mul(cur, noise(28.0, 0.07)); cur = mul(cur, noise(160.0, 0.04, 6))
        # zones: blend toward a zone colour by the attribute
        def zone(col, attr_name, color, amount):
            mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'
            a = A(attr_name); mm = nt.nodes.new('ShaderNodeMath'); mm.operation = 'MULTIPLY'; mm.inputs[1].default_value = amount
            nt.links.new(a.outputs['Fac'], mm.inputs[0]); nt.links.new(mm.outputs[0], mx.inputs['Factor'])
            nt.links.new(col, mx.inputs[6]); mx.inputs[7].default_value = (*color, 1)
            return mx.outputs[2]
        cur = zone(cur, 'z_perio', (0.72, 0.66, 0.66), 0.8)
        cur = zone(cur, 'z_lips', (0.80, 0.62, 0.66), 0.7)
        # beard shadow: a dark blue-grey tint plus stubble dots (Voronoi cells, black and grey hairs)
        cur = zone(cur, 'z_beard', (0.80, 0.80, 0.84), 0.6)
        vo = nt.nodes.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 2600.0; vo.feature = 'F1'
        nt.links.new(tc.outputs['Object'], vo.inputs['Vector'])
        dotm = nt.nodes.new('ShaderNodeMapRange'); dotm.inputs['From Min'].default_value = 0.0; dotm.inputs['From Max'].default_value = 0.22; dotm.inputs['To Min'].default_value = 1.0; dotm.inputs['To Max'].default_value = 0.0
        dotm.clamp = True
        nt.links.new(vo.outputs['Distance'], dotm.inputs['Value'])
        grey = nt.nodes.new('ShaderNodeMath'); grey.operation = 'GREATER_THAN'; grey.inputs[1].default_value = 0.5
        nt.links.new(vo.outputs['Color'], grey.inputs[0])
        hair_col = nt.nodes.new('ShaderNodeMix'); hair_col.data_type = 'RGBA'
        nt.links.new(grey.outputs[0], hair_col.inputs['Factor']); hair_col.inputs[6].default_value = (0.02, 0.018, 0.018, 1); hair_col.inputs[7].default_value = (0.25, 0.24, 0.24, 1)
        bfac = nt.nodes.new('ShaderNodeMath'); bfac.operation = 'MULTIPLY'; nt.links.new(dotm.outputs[0], bfac.inputs[0]); nt.links.new(A('z_beard').outputs['Fac'], bfac.inputs[1])
        bfac2 = nt.nodes.new('ShaderNodeMath'); bfac2.operation = 'MULTIPLY'; bfac2.inputs[1].default_value = 0.85; nt.links.new(bfac.outputs[0], bfac2.inputs[0])
        st = nt.nodes.new('ShaderNodeMix'); st.data_type = 'RGBA'; nt.links.new(bfac2.outputs[0], st.inputs['Factor']); nt.links.new(cur, st.inputs[6]); nt.links.new(hair_col.outputs[2], st.inputs[7])
        cur = st.outputs[2]
        cur = zone(cur, 'z_nails', (1.25, 1.1, 1.05), 0.6)
        nt.links.new(cur, em.inputs['Color'])
    elif kind == 'packed':
        ao = nt.nodes.new('ShaderNodeAmbientOcclusion'); ao.samples = 32; ao.inputs['Distance'].default_value = 0.05
        cmb = nt.nodes.new('ShaderNodeCombineColor')
        nt.links.new(ao.outputs['AO'], cmb.inputs[0]); nt.links.new(A('z_rough').outputs['Fac'], cmb.inputs[1]); nt.links.new(A('z_thin').outputs['Fac'], cmb.inputs[2])
        nt.links.new(cmb.outputs[0], em.inputs['Color'])
    return m


def bake_image(o, mat, name, res, colorspace='sRGB', bake_type='EMIT', margin=16):
    img = bpy.data.images.new(name, res, res, alpha=False, float_buffer=False)
    img.colorspace_settings.name = colorspace
    old = list(o.data.materials)
    o.data.materials.clear(); o.data.materials.append(mat)
    nd = mat.node_tree.nodes.new('ShaderNodeTexImage'); nd.image = img
    mat.node_tree.nodes.active = nd
    o.data.uv_layers.active = o.data.uv_layers['UVPacked']
    for x in bpy.context.selected_objects:
        x.select_set(False)
    o.select_set(True); bpy.context.view_layer.objects.active = o
    scene.cycles.samples = 16 if bake_type == 'EMIT' else 32
    scene.render.bake.margin = margin
    bpy.ops.object.bake(type=bake_type, use_clear=True, margin=margin)
    path = os.path.join(TEX, name + '.png'); img.filepath_raw = path; img.file_format = 'PNG'; img.save()
    o.data.materials.clear()
    for m in old:
        o.data.materials.append(m)
    return path


# tone: the cheek's average in MakeHuman's map -> the spec's cheek colour
from PIL import Image
mh = np.asarray(Image.open(MHSKIN).convert('RGB'), float) / 255.0
# cheek region of the MakeHuman layout, found from the head's own vertices (left cheek, below the eye)
uvl = np.array([d.uv[:] for d in SHd.data.uv_layers['UVMap'].data])
loops_v = np.array([l.vertex_index for l in SHd.data.loops])
cheek_v = np.nonzero((np.linalg.norm(VH - (eyeL + np.array([0.012, -0.035, 0.012])), axis=1) < 0.012))[0]
cu = uvl[np.isin(loops_v, cheek_v)]
px = (cu * np.array([mh.shape[1], mh.shape[0]])).astype(int); px[:, 1] = mh.shape[0] - 1 - px[:, 1]
px = np.clip(px, 0, [mh.shape[1] - 1, mh.shape[0] - 1])
cheek = H.srgb_to_lin(mh[px[:, 1], px[:, 0]]).mean(0)
want = H.srgb_to_lin(np.array([0.36, 0.24, 0.17]))
GAIN = tuple(np.clip(want / np.maximum(cheek, 1e-4), 0.2, 4.0))
log(f'tone: MakeHuman cheek linear {cheek.round(4)} -> wanted {want.round(4)}; gain {np.round(GAIN, 3)}')
MC = bake_mat('bake_color', 'color'); MP = bake_mat('bake_packed', 'packed')
paths = {}
paths['head_basecolor'] = bake_image(SHd, MC, 'p25_head_basecolor', HEAD_RES)
paths['body_basecolor'] = bake_image(SB, MC, 'p25_body_basecolor', BODY_RES)
HIDE = [o for o in bpy.data.objects if o.type == 'MESH' and (o.name in ('hair', 'brows', 'lashes', 'gown') or '__' in o.name)]
for o in HIDE:
    o.hide_render = True
paths['head_packed'] = bake_image(SHd, MP, 'p25_head_packed', PACK_RES, 'Non-Color')
paths['body_packed'] = bake_image(SB, MP, 'p25_body_packed', PACK_RES, 'Non-Color')
for o in HIDE:
    o.hide_render = False
log('baked colour and packed maps')
H.save_json(os.path.join(WORK, 'tex_paths.json'), paths)

# ---------------------------------------------------------------- normal maps: scan pores at true size (high-passed)
DT = np.load(os.path.join(H.STUDY, '..', 'texture-first', 'work', 'detail_tiles.npz'))
def tile_png(key, name, size_px):
    m = DT[key].astype(np.float64)
    n = min(m.shape); m = m[:n, :n]
    # make it tile: blend with itself shifted by half (seams fall in the middle of a smooth weight)
    w = np.sin(np.linspace(0, np.pi, n)) ** 2; W2 = np.outer(w, w)
    sh = np.roll(np.roll(m, n // 2, 0), n // 2, 1); W2s = np.roll(np.roll(W2, n // 2, 0), n // 2, 1)
    t = (m * W2 + sh * W2s) / np.maximum(W2 + W2s, 1e-6)
    t = (t - t.mean()) / (t.std() + 1e-9)
    from scipy import ndimage as ndi
    t = ndi.zoom(t, size_px / n, order=3)
    mm_per_px = (n / DT['px_per_mm']) / size_px
    gy, gx = np.gradient(t * float(DT[key].std()))                         # millimetres of relief per pixel
    k = 1.0 / mm_per_px
    nx, ny = -gx * k, gy * k; nz = np.ones_like(nx)
    l = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
    img = np.stack([nx / l, ny / l, nz / l], -1) * 0.5 + 0.5
    Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(os.path.join(TEX, name + '.png'))
    hgt = np.clip(0.5 + t / 6, 0, 1)
    Image.fromarray((hgt * 255).astype(np.uint8)).save(os.path.join(TEX, name + '_height.png'))
    return n / DT['px_per_mm']                                               # tile size in millimetres
tile_mm = tile_png('cheekL_micro', 'skin_detail_normal', 512)
neck_mm = tile_png('neck_micro', 'skin_detail_body', 512)
log(f'skin_detail_normal: 512 px tiling, {tile_mm:.0f} mm across (scan cheek, relief under 1.2 mm only)')


def uv_mm_scale(o):
    """Millimetres per unit of UVPacked, from 3D area over texture area."""
    me = o.data; V = H.get_co(me.vertices, len(me.vertices)); uv = np.array([d.uv[:] for d in me.uv_layers['UVPacked'].data])
    a3 = 0.0; a2 = 0.0
    for p in me.polygons:
        li = list(p.loop_indices); vi = list(p.vertices)
        for k in range(1, len(vi) - 1):
            a3 += 0.5 * np.linalg.norm(np.cross(V[vi[k]] - V[vi[0]], V[vi[k + 1]] - V[vi[0]]))
            e1 = uv[li[k]] - uv[li[0]]; e2 = uv[li[k + 1]] - uv[li[0]]
            a2 += 0.5 * abs(e1[0] * e2[1] - e1[1] * e2[0])
    return math.sqrt(a3 / a2) * 1000.0


def bake_normal(o, height_png, tile_mm_, name, res, strength):
    s_mm = uv_mm_scale(o)
    m = bpy.data.materials.new('bake_n_' + name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    uvn = nt.nodes.new('ShaderNodeUVMap'); uvn.uv_map = 'UVPacked'
    mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (s_mm / tile_mm_, s_mm / tile_mm_, 1)
    nt.links.new(uvn.outputs[0], mp.inputs[0])
    ti = nt.nodes.new('ShaderNodeTexImage'); ti.image = bpy.data.images.load(height_png); ti.image.colorspace_settings.name = 'Non-Color'; ti.extension = 'REPEAT'
    nt.links.new(mp.outputs[0], ti.inputs[0])
    bu = nt.nodes.new('ShaderNodeBump'); bu.inputs['Strength'].default_value = strength; bu.inputs['Distance'].default_value = 0.0004
    nt.links.new(ti.outputs['Color'], bu.inputs['Height']); nt.links.new(bu.outputs['Normal'], b.inputs['Normal'])
    log(f'{o.name}: {s_mm:.0f} mm per texture unit; pore tile repeated {s_mm / tile_mm_:.1f} times across')
    return bake_image(o, m, name, res, 'Non-Color', bake_type='NORMAL', margin=16)


scene.render.bake.normal_space = 'TANGENT'
paths['head_normal'] = bake_normal(SHd, os.path.join(TEX, 'skin_detail_normal_height.png'), tile_mm, 'p25_head_normal', HEAD_RES, 0.35)
paths['body_normal'] = bake_normal(SB, os.path.join(TEX, 'skin_detail_body_height.png'), neck_mm, 'p25_body_normal', BODY_RES, 0.25)
paths['detail'] = os.path.join(TEX, 'skin_detail_normal.png')

# ---------------------------------------------------------------- eyes: iris and sclera
EO = bpy.data.objects['eyes']; COR = bpy.data.objects['cornea']
EV = H.get_co(EO.data.vertices, len(EO.data.vertices)); CV = H.get_co(COR.data.vertices, len(COR.data.vertices))
side = (PL.group_w(EO, {'eye.L'}) > 0.5)
canon = np.zeros_like(EV)
for sel_ in (side, ~side):
    c = EV[sel_].mean(0)
    cc = CV[np.argsort(np.linalg.norm(CV - c, axis=1))[:200]].mean(0)
    fwd = (cc - c) / np.linalg.norm(cc - c); r = np.linalg.norm(EV[sel_] - c, axis=1).mean()
    u_, v_ = H.plane_basis(fwd)
    d = EV[sel_] - c
    canon[sel_] = np.stack([d @ u_, d @ v_, d @ fwd], 1) / r
ca = EO.data.attributes.new('canon', 'FLOAT_VECTOR', 'POINT'); ca.data.foreach_set('vector', canon.astype(np.float32).ravel())
me_ = bpy.data.materials.new('bake_eye'); me_.use_nodes = True; nt = me_.node_tree
for nd in list(nt.nodes):
    nt.nodes.remove(nd)
out = nt.nodes.new('ShaderNodeOutputMaterial'); em = nt.nodes.new('ShaderNodeEmission'); nt.links.new(em.outputs[0], out.inputs[0])
at = nt.nodes.new('ShaderNodeAttribute'); at.attribute_name = 'canon'
sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(at.outputs['Vector'], sep.inputs[0])
cmb = nt.nodes.new('ShaderNodeCombineXYZ'); nt.links.new(sep.outputs['X'], cmb.inputs['X']); nt.links.new(sep.outputs['Y'], cmb.inputs['Y'])
ln = nt.nodes.new('ShaderNodeVectorMath'); ln.operation = 'LENGTH'; nt.links.new(cmb.outputs[0], ln.inputs[0])
front = nt.nodes.new('ShaderNodeMath'); front.operation = 'GREATER_THAN'; front.inputs[1].default_value = 0.0; nt.links.new(sep.outputs['Z'], front.inputs[0])
# radius in the iris plane (globe radius 1): pupil 0.13 (3 mm of an 11.2 mm globe), iris edge 0.52 (11.6 mm iris)
cr = nt.nodes.new('ShaderNodeValToRGB'); el = cr.color_ramp.elements
el[0].position = 0.0; el[0].color = (0.004, 0.003, 0.003, 1)
for pos, col in ((0.13, (0.004, 0.003, 0.003, 1)), (0.15, (0.030, 0.014, 0.006, 1)), (0.25, (0.060, 0.028, 0.010, 1)), (0.40, (0.045, 0.022, 0.009, 1)), (0.48, (0.018, 0.010, 0.006, 1)),
                 (0.52, (0.010, 0.007, 0.006, 1)), (0.56, (0.70, 0.66, 0.60, 1))):
    e_ = cr.color_ramp.elements.new(pos); e_.color = col
el[-1].position = 1.0; el[-1].color = (0.74, 0.70, 0.64, 1)
nt.links.new(ln.outputs['Value'], cr.inputs['Fac'])
# radial fibres: noise stretched along the radius (angle as one coordinate)
ang = nt.nodes.new('ShaderNodeMath'); ang.operation = 'ARCTAN2'; nt.links.new(sep.outputs['Y'], ang.inputs[0]); nt.links.new(sep.outputs['X'], ang.inputs[1])
cmb2 = nt.nodes.new('ShaderNodeCombineXYZ'); nt.links.new(ang.outputs[0], cmb2.inputs['X']); nt.links.new(ln.outputs['Value'], cmb2.inputs['Y'])
mp2 = nt.nodes.new('ShaderNodeMapping'); mp2.inputs['Scale'].default_value = (14.0, 1.2, 1.0); nt.links.new(cmb2.outputs[0], mp2.inputs[0])
nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 6.0; nz.inputs['Detail'].default_value = 8; nt.links.new(mp2.outputs[0], nz.inputs['Vector'])
fib = nt.nodes.new('ShaderNodeMapRange'); fib.inputs['To Min'].default_value = 0.6; fib.inputs['To Max'].default_value = 1.5; nt.links.new(nz.outputs['Fac'], fib.inputs['Value'])
irisw = nt.nodes.new('ShaderNodeMapRange'); irisw.inputs['From Min'].default_value = 0.5; irisw.inputs['From Max'].default_value = 0.56; irisw.inputs['To Min'].default_value = 1.0; irisw.inputs['To Max'].default_value = 0.0
nt.links.new(ln.outputs['Value'], irisw.inputs['Value'])
fmix = nt.nodes.new('ShaderNodeMix'); fmix.data_type = 'RGBA'; fmix.blend_type = 'MULTIPLY'
nt.links.new(irisw.outputs[0], fmix.inputs['Factor']); nt.links.new(cr.outputs['Color'], fmix.inputs[6])
cf = nt.nodes.new('ShaderNodeCombineColor'); [nt.links.new(fib.outputs[0], cf.inputs[i]) for i in range(3)]; nt.links.new(cf.outputs[0], fmix.inputs[7])
# sclera vessels: thin dark-red lines toward the corners
vs = nt.nodes.new('ShaderNodeTexNoise'); vs.inputs['Scale'].default_value = 9.0; vs.inputs['Detail'].default_value = 10; vs.noise_dimensions = '3D'
nt.links.new(at.outputs['Vector'], vs.inputs['Vector'])
sub_ = nt.nodes.new('ShaderNodeMath'); sub_.operation = 'SUBTRACT'; sub_.inputs[1].default_value = 0.5; nt.links.new(vs.outputs['Fac'], sub_.inputs[0])
ab_ = nt.nodes.new('ShaderNodeMath'); ab_.operation = 'ABSOLUTE'; nt.links.new(sub_.outputs[0], ab_.inputs[0])
vmask = nt.nodes.new('ShaderNodeMath'); vmask.operation = 'LESS_THAN'; vmask.inputs[1].default_value = 0.006; nt.links.new(ab_.outputs[0], vmask.inputs[0])
# vessels only on the sclera toward the corners (|x| large in the eye's own frame), faint
sx_ = nt.nodes.new('ShaderNodeMath'); sx_.operation = 'ABSOLUTE'; nt.links.new(sep.outputs['X'], sx_.inputs[0])
side_ = nt.nodes.new('ShaderNodeMapRange'); side_.inputs['From Min'].default_value = 0.55; side_.inputs['From Max'].default_value = 0.85; nt.links.new(sx_.outputs[0], side_.inputs['Value'])
vm2 = nt.nodes.new('ShaderNodeMath'); vm2.operation = 'MULTIPLY'; nt.links.new(vmask.outputs[0], vm2.inputs[0]); nt.links.new(side_.outputs[0], vm2.inputs[1])
vmul = nt.nodes.new('ShaderNodeMath'); vmul.operation = 'MULTIPLY'; vmul.inputs[1].default_value = 0.25; nt.links.new(vm2.outputs[0], vmul.inputs[0])
vmix = nt.nodes.new('ShaderNodeMix'); vmix.data_type = 'RGBA'; nt.links.new(vmul.outputs[0], vmix.inputs['Factor']); nt.links.new(fmix.outputs[2], vmix.inputs[6]); vmix.inputs[7].default_value = (0.35, 0.06, 0.05, 1)
nt.links.new(vmix.outputs[2], em.inputs['Color'])
eye_uv = EO.data.uv_layers[0]
pk = EO.data.uv_layers.new(name='UVPacked'); pk.data.foreach_set('uv', np.array([d.uv[:] for d in eye_uv.data], np.float32).ravel())
paths['eye_basecolor'] = bake_image(EO, me_, 'p25_eye_basecolor', 512 if FAST else 1024)
log('baked normal, detail and eye maps')
H.save_json(os.path.join(WORK, 'tex_paths.json'), paths)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_textured.blend'))
log('SAVED p25_textured.blend')

