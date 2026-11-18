"""p25_11_assemble.py: final materials, names and morph sets of the hero patient p25, ready for glTF export.
   Blender -b --factory-startup --python tools/people/hero/p25_11_assemble.py
Materials are plain Principled BSDF with image maps so Blender's glTF exporter writes them as glTF PBR:
  skin_head / skin_body: base colour; normal; the packed map feeds occlusion (R) and roughness (G); metallic 0, so the
    packed map's B channel (thickness) is read only by the app's skin shader (metallicFactor 0 makes it inert in glTF).
  eyes, cornea (alpha-blended, glossy), eye_wet, eye_occlusion, teeth_lower, gums, tongue, mouth_inner, hair, brows,
  lashes (alpha-tested), gown, and the supports and blankets.
Morph sets: skin_head carries the 52 ARKit shapes and the clinical ones; skin_body breathe and press_<pose>; parts carry
the clinical names they move with (and the ARKit jaw / eye / brow ones that move them). Also records the landmark
vertices. Saves p25/blend/p25_final.blend and work/landmark_verts.json."""
import bpy, os, sys, json, math
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Vector
import hero_lib as H
import pose_lib as PL

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
TEX = os.path.join(WORK, 'tex')
log = H.Log('assemble')
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_textured.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']; arm.animation_data.action = bpy.data.actions['flat']; scene.frame_set(1)
PATHS = json.load(open(os.path.join(WORK, 'tex_paths.json')))
CLIN = ['jawOpen', 'lipsPart', 'jawThrust', 'cheekPuff', 'eyesClosed', 'blink', 'breathe']


def img(path, noncolor=False):
    im = bpy.data.images.load(path, check_existing=True)
    if noncolor:
        im.colorspace_settings.name = 'Non-Color'
    return im


def principled(name, color=(0.8, 0.8, 0.8), rough=0.5, base_img=None, normal_img=None, packed_img=None, alpha=None, alpha_img=False, uv='UVPacked', spec=0.5, normal_strength=1.0, clip=None):
    m = bpy.data.materials.get(name)
    if m is None:
        m = bpy.data.materials.new(name)
    m.use_nodes = True; nt = m.node_tree
    for nd in list(nt.nodes):
        nt.nodes.remove(nd)
    out = nt.nodes.new('ShaderNodeOutputMaterial'); b = nt.nodes.new('ShaderNodeBsdfPrincipled'); nt.links.new(b.outputs[0], out.inputs[0])
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = 0.0
    b.inputs['Specular IOR Level'].default_value = spec
    uvn = None
    if uv:
        uvn = nt.nodes.new('ShaderNodeUVMap'); uvn.uv_map = uv
    if base_img is not None:
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = base_img
        if uvn: nt.links.new(uvn.outputs[0], t.inputs[0])
        nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
        if alpha_img:
            nt.links.new(t.outputs['Alpha'], b.inputs['Alpha'])
    if normal_img is not None:
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = normal_img
        if uvn: nt.links.new(uvn.outputs[0], t.inputs[0])
        nm = nt.nodes.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = normal_strength
        if uv: nm.uv_map = uv
        nt.links.new(t.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    if packed_img is not None:
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = packed_img
        if uvn: nt.links.new(uvn.outputs[0], t.inputs[0])
        sp = nt.nodes.new('ShaderNodeSeparateColor'); nt.links.new(t.outputs['Color'], sp.inputs[0])
        nt.links.new(sp.outputs['Green'], b.inputs['Roughness'])
        # occlusion through the exporter's glTF output group
        g = bpy.data.node_groups.get('glTF Material Output') or bpy.data.node_groups.new('glTF Material Output', 'ShaderNodeTree')
        if not g.interface.items_tree:
            g.interface.new_socket('Occlusion', in_out='INPUT', socket_type='NodeSocketFloat')
        gn = nt.nodes.new('ShaderNodeGroup'); gn.node_tree = g
        nt.links.new(sp.outputs['Red'], gn.inputs['Occlusion'])
    if alpha is not None:
        b.inputs['Alpha'].default_value = alpha
    if alpha is not None or alpha_img:
        try:
            m.surface_render_method = 'BLENDED' if clip is None else 'DITHERED'
        except Exception:
            pass
        m['gltf_alpha'] = 'MASK' if clip is not None else 'BLEND'
    m.use_backface_culling = False
    return m


def set_mat(o, m):
    o.data.materials.clear(); o.data.materials.append(m)


O = {o.name: o for o in bpy.data.objects if o.type == 'MESH'}
set_mat(O['skin_head'], principled('skin_head', base_img=img(PATHS['head_basecolor']), normal_img=img(PATHS['head_normal'], True), packed_img=img(PATHS['head_packed'], True), spec=0.5))
set_mat(O['skin_body'], principled('skin_body', base_img=img(PATHS['body_basecolor']), normal_img=img(PATHS['body_normal'], True), packed_img=img(PATHS['body_packed'], True), spec=0.5))
# the tiling pore normal travels in the file as its own named image (see p25_12_export.py)
for nm_ in ('skin_head', 'skin_body'):
    bpy.data.materials[nm_]['detail_normal_image'] = 'skin_detail_normal'
    bpy.data.materials[nm_]['detail_tile_mm'] = 36.0
set_mat(O['eyes'], principled('eyes', base_img=img(PATHS['eye_basecolor']), rough=0.25, spec=0.5))
set_mat(O['cornea'], principled('cornea', color=(1, 1, 1), rough=0.02, alpha=0.06, uv=None, spec=1.0))
set_mat(O['eye_wet'], principled('eye_wet', color=(1, 1, 1), rough=0.03, alpha=0.18, uv=None, spec=1.0))
set_mat(O['eye_occlusion'], principled('eye_occlusion', color=(0.02, 0.012, 0.01), rough=1.0, alpha=0.2, uv=None, spec=0.0))
set_mat(O['teeth_lower'], principled('teeth_lower', color=(0.74, 0.68, 0.56), rough=0.28, uv=None, spec=0.6))
set_mat(O['gums'], principled('gums', color=(0.42, 0.17, 0.16), rough=0.38, uv=None, spec=0.6))
set_mat(O['tongue'], principled('tongue', color=(0.48, 0.21, 0.21), rough=0.5, uv=None, spec=0.5))
set_mat(O['mouth_inner'], principled('mouth_inner', color=(0.36, 0.11, 0.10), rough=0.42, uv=None, spec=0.5))


def mh_image(o):
    for m in o.data.materials:
        if m and m.use_nodes:
            for nd in m.node_tree.nodes:
                if nd.type == 'TEX_IMAGE' and nd.image:
                    return nd.image
    return None


for nm_, tint in (('hair', (0.36, 0.35, 0.36)), ('brows', (0.17, 0.16, 0.16)), ('lashes', (0.06, 0.055, 0.055))):
    o = O[nm_]; im = mh_image(o)
    if im is not None:
        im.filepath = bpy.path.abspath(im.filepath); im.reload()
    m = principled(nm_, color=tint, base_img=im, alpha_img=True, rough=0.55, uv=o.data.uv_layers[0].name, clip=0.3)
    # the MakeHuman hair picture is black hair; the colour is the tint (multiplied in): half grey, as the spec
    nt = m.node_tree; b = [n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'][0]; t = [n for n in nt.nodes if n.type == 'TEX_IMAGE'][0]
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'; mx.inputs['Factor'].default_value = 1.0
    nt.links.new(t.outputs['Color'], mx.inputs[6]); mx.inputs[7].default_value = (*[min(1.0, c * 4.0) for c in tint], 1)
    nt.links.new(mx.outputs[2], b.inputs['Base Color'])
    set_mat(o, m)
for o in bpy.data.objects:
    if o.type == 'MESH':
        o.data.name = o.name
# ---------------------------------------------------------------- UV sets: one per mesh (the packed one for skin and eyes)
for nm_ in ('skin_head', 'skin_body', 'eyes'):
    me = O[nm_].data
    for lay in list(me.uv_layers):
        if lay.name != 'UVPacked':
            me.uv_layers.remove(lay)
    me.uv_layers['UVPacked'].name = 'UVMap'
for m in bpy.data.materials:
    if m.use_nodes:
        for nd in m.node_tree.nodes:
            if nd.type == 'UVMAP' and nd.uv_map == 'UVPacked':
                nd.uv_map = 'UVMap'
            if nd.type == 'NORMAL_MAP' and nd.uv_map == 'UVPacked':
                nd.uv_map = 'UVMap'
for nm_ in ('skin_head', 'skin_body', 'eyes'):
    for a in [a.name for a in O[nm_].data.attributes if a.name.startswith('z_') or a.name in ('canon',)]:
        O[nm_].data.attributes.remove(O[nm_].data.attributes[a])
# ---------------------------------------------------------------- morph sets
EYE_ARKIT = [n for n in O['skin_head'].data.shape_keys.key_blocks.keys() if n.startswith(('eye', 'brow'))]
KEEP = {'hair': [], 'brows': CLIN + EYE_ARKIT, 'lashes': CLIN + EYE_ARKIT}
for nm_, keep in KEEP.items():
    o = O[nm_]
    if not o.data.shape_keys:
        continue
    for k in list(o.data.shape_keys.key_blocks[1:]):
        if k.name not in keep:
            o.shape_key_remove(k)
    if o.data.shape_keys and len(o.data.shape_keys.key_blocks) == 1:
        o.shape_key_remove(o.data.shape_keys.key_blocks[0])
# lid seal: MakeHuman's blink units were made for its own, smaller eyeball; on this head the upper lid stops short of the
# lower one, so the upper lid's travel is lengthened until the margins meet, then kept outside the globe (+0.7 mm)
EL_, ER_ = np.array(arm.data.bones['eye.L'].head_local), np.array(arm.data.bones['eye.R'].head_local)
EYV = H.get_co(O['eyes'].data.vertices, len(O['eyes'].data.vertices))
COV = H.get_co(O['cornea'].data.vertices, len(O['cornea'].data.vertices))
up_face = np.array([0, 1.0, 0])                                                # in the lying rest frame the top of the head is +Y
SEAL = 1.0                                                                       # 1.45 was tried: it opened holes through the lids (review three4); left at 1.0 for Stage 1
for o_name in ('skin_head', 'lashes'):
    o = O[o_name]; kb_ = o.data.shape_keys.key_blocks; b0 = H.get_co(kb_[0].data, len(o.data.vertices))
    near = np.minimum(np.linalg.norm(b0 - EL_, axis=1), np.linalg.norm(b0 - ER_, axis=1)) < 0.032
    for kn in ('eyesClosed', 'blink', 'eyeBlinkLeft', 'eyeBlinkRight'):
        if kn not in kb_:
            continue
        d = H.get_co(kb_[kn].data, len(b0)) - b0
        upper = near & ((d @ up_face) < -0.0005)
        d[upper] *= SEAL
        P_ = b0 + d
        if o_name == 'skin_head':
            for c, sel in ((EL_, np.linalg.norm(b0 - EL_, axis=1) < 0.03), (ER_, np.linalg.norm(b0 - ER_, axis=1) < 0.03)):
                rg = np.linalg.norm(EYV - c, axis=1); rg = rg[rg < 0.02].max(); rc = np.linalg.norm(COV - c, axis=1); rc = rc[rc < 0.02].max()
                v = P_[sel] - c; dist = np.linalg.norm(v, axis=1)
                lim = np.maximum(rg, np.where(v @ np.array([0, 0, 1.0]) > 0.004, rc, rg)) + 0.0007
                ins = dist < lim
                idx = np.nonzero(sel)[0][ins]
                P_[idx] = c + v[ins] / dist[ins, None] * lim[ins, None]
        H.set_co(kb_[kn].data, P_)
log(f'lid seal: upper lid travel x {SEAL} on eyesClosed, blink and the two eyeBlink shapes; lids kept 0.7 mm outside the globe and cornea')
# the tongue rests 4 mm lower in the mouth (toward the floor and the chin), so the soft palate shows above it
o = O['tongue']; kb_ = o.data.shape_keys.key_blocks
shift = -0.004 * up_face
for k in kb_:
    H.set_co(k.data, H.get_co(k.data, len(o.data.vertices)) + shift)
log('tongue lowered 4 mm')
# the tear line and lid shadow sit on the open lid margins: when the lids close they go back 2.5 mm behind the lids
for nm_ in ('eye_wet', 'eye_occlusion'):
    o = O[nm_]; kb_ = o.data.shape_keys.key_blocks; b0 = H.get_co(kb_[0].data, len(o.data.vertices))
    EL, ER = np.array(arm.data.bones['eye.L'].head_local), np.array(arm.data.bones['eye.R'].head_local)
    c = np.where((np.linalg.norm(b0 - EL, axis=1) < np.linalg.norm(b0 - ER, axis=1))[:, None], EL, ER)
    back = (c - b0) / np.maximum(np.linalg.norm(c - b0, axis=1, keepdims=True), 1e-9) * 0.0025
    left = np.linalg.norm(b0 - EL, axis=1) < np.linalg.norm(b0 - ER, axis=1)
    for kn, m_ in (('eyesClosed', np.ones(len(b0), bool)), ('blink', np.ones(len(b0), bool)), ('eyeBlinkLeft', left), ('eyeBlinkRight', ~left)):
        if kn in kb_:
            H.set_co(kb_[kn].data, b0 + back * m_[:, None])
# every mesh that should follow a clinical morph carries all of its names (zeros where it does not move)
FOLLOW = ['skin_head', 'teeth_lower', 'gums', 'tongue', 'mouth_inner', 'eye_wet', 'eye_occlusion', 'brows', 'lashes']
for nm_ in FOLLOW:
    o = O[nm_]
    if not o.data.shape_keys:
        o.shape_key_add(name='Basis', from_mix=False)
    for c in CLIN:
        if c not in o.data.shape_keys.key_blocks:
            o.shape_key_add(name=c, from_mix=False)
for nm_ in ('skin_body', 'gown'):
    o = O[nm_]
    for c in ('breathe', 'press_ramped', 'press_lateral_left'):
        assert c in o.data.shape_keys.key_blocks, (nm_, c)
for o in bpy.data.objects:
    if o.type == 'MESH' and o.data.shape_keys:
        for k in o.data.shape_keys.key_blocks[1:]:
            k.value = 0.0; k.slider_min = 0.0; k.slider_max = 1.0
# sparse morphs stay sparse only if untouched vertices are exactly still: offsets under 0.1 mm are set to zero
zeroed = 0
for o in bpy.data.objects:
    if o.type == 'MESH' and o.data.shape_keys:
        b0 = H.get_co(o.data.shape_keys.key_blocks[0].data, len(o.data.vertices))
        for k in o.data.shape_keys.key_blocks[1:]:
            d = H.get_co(k.data, len(b0)) - b0
            small = np.linalg.norm(d, axis=1) < 0.0001
            zeroed += int(small.sum() - (np.linalg.norm(d, axis=1) == 0).sum())
            d[small] = 0.0
            H.set_co(k.data, b0 + d)
log(f'morph offsets under 0.1 mm set to zero: {zeroed} vertex entries')
summary = {o.name: ([k.name for k in o.data.shape_keys.key_blocks[1:]] if o.data.shape_keys else []) for o in bpy.data.objects if o.type == 'MESH'}
log('morphs per mesh:', {k: len(v) for k, v in summary.items()})
H.save_json(os.path.join(WORK, 'morphs_per_mesh.json'), summary)

# ================================================================ landmark vertices (rest, lying frame)
SHd, SB = O['skin_head'], O['skin_body']
VH, VB = PL.evaluated(SHd), PL.evaluated(SB)
NH, NB = H.vertex_normals(VH, H.quads_of(SHd)), H.vertex_normals(VB, H.quads_of(SB))
PJ = json.load(open(os.path.join(WORK, 'poses.json')))['landmarks_used']
RJ = json.load(open(os.path.join(WORK, 'rest.json')))
bone = lambda n: np.array(arm.data.bones[n].head_local)
tail = lambda n: np.array(arm.data.bones[n].tail_local)
LMV = {}


def on(o, V, i):
    return (o.name, int(i))


def nearest_on(o, V, p, mask=None):
    d = np.linalg.norm(V - np.asarray(p), axis=1)
    if mask is not None:
        d = np.where(mask, d, 9)
    return on(o, V, int(np.argmin(d)))


lips = PL.group_w(SHd, {'zone_lips'})
mc = VH[lips > 0.5].mean(0)
mid = np.abs(VH[:, 0]) < 0.004
up_lip = np.nonzero(mid & (lips > 0.5) & (VH[:, 1] > mc[1]))[0]; lo_lip = np.nonzero(mid & (lips > 0.5) & (VH[:, 1] < mc[1]))[0]
LMV['mouth'] = dict(points=[on(SHd, VH, up_lip[np.argmin(VH[up_lip, 1])]), on(SHd, VH, lo_lip[np.argmax(VH[lo_lip, 1])])], note='midpoint between the upper and lower lip at the midline')
LMV['noseTip'] = dict(points=[on(SHd, VH, np.nonzero(mid)[0][np.argmax(VH[mid, 2])])])
LMV['chin'] = dict(points=[on(SHd, VH, PJ['pogonion'][1])])
gl = PJ['glabella'][1]
fh = np.nonzero(mid & (VH[:, 1] > VH[gl, 1] + 0.05) & (VH[:, 1] < VH[gl, 1] + 0.07))[0]
LMV['forehead'] = dict(points=[on(SHd, VH, fh[np.argmax(VH[fh, 2])])])
CORV = H.get_co(O['cornea'].data.vertices, len(O['cornea'].data.vertices))
for s in ('L', 'R'):
    e = bone('eye.' + s)
    apex = CORV[np.argmax(CORV[:, 2] - 50 * (np.abs(CORV[:, 0] - e[0]) > 0.02))]
    LMV['eye' + s] = dict(point=apex.tolist(), bone='eye.' + s, note='front of the cornea')
    LMV['ear' + s] = dict(points=[on(SHd, VH, PJ['eam' + s][1])], note='external ear canal opening')
LMV['sternalNotch'] = dict(points=[on(SB, VB, PJ['notch'][1])])
midb = np.abs(VB[:, 0]) < 0.006
notch = VB[PJ['notch'][1]]
ch = np.nonzero(midb & (np.abs(VB[:, 1] - (notch[1] - 0.15)) < 0.01))[0]
LMV['chest'] = dict(points=[on(SB, VB, ch[np.argmax(VB[ch, 2])])], note='mid-sternum, 15 cm below the notch')
# umbilicus: the deepest point of the midline profile of the belly
ab = np.nonzero(midb & (VB[:, 1] < notch[1] - 0.30) & (VB[:, 1] > notch[1] - 0.62) & (VB[:, 2] > 0.2))[0]
prof = ab[np.argsort(VB[ab, 1])]
z = VB[prof, 2]; zs = np.convolve(z, np.ones(9) / 9, mode='same')
k = int(np.argmin(z - zs)); LMV['umbilicus'] = dict(points=[on(SB, VB, prof[k])], note='deepest point of the belly midline between xiphoid and pubis')
for s, sx in (('L', 1), ('R', -1)):
    hm = PL.group_w(SB, {f'metacarpal{i}.{s}' for i in range(1, 5)}) > 0.5
    c = VB[hm].mean(0)
    dorsal = np.nonzero(hm)[0][np.argmax((VB[hm] - c) @ (NB[hm].mean(0) * 0 + np.array([0, 0, 1.0])))]
    LMV['hand' + s] = dict(points=[on(SB, VB, dorsal)], note='back of the hand (it faces up or out in these poses)')
    wv = PL.group_w(SB, {'wrist.' + s}) > 0.3
    wr = bone('wrist.' + s)
    LMV['wrist' + s] = dict(points=[nearest_on(SB, VB, wr, wv)], note='skin over the wrist joint')
    ft = tail('finger2-3.' + s)
    LMV['fingertipIndex' + s] = dict(points=[nearest_on(SB, VB, ft)], note='index fingertip (pulse oximeter)')
    sh, el = bone('upperarm01.' + s), bone('lowerarm01.' + s)
    p = sh + 0.45 * (el - sh)
    um = PL.group_w(SB, {'upperarm01.' + s, 'upperarm02.' + s}) > 0.4
    cand = np.nonzero(um & (np.abs((VB - p) @ ((el - sh) / np.linalg.norm(el - sh))) < 0.01))[0]
    LMV['upperArm' + s] = dict(points=[on(SB, VB, cand[np.argmax(VB[cand, 0] * sx + VB[cand, 2] * 0.3)])] if len(cand) else [nearest_on(SB, VB, p, um)], note='BP cuff centre, outer side of the mid upper arm')
el = bone('lowerarm01.R'); fm = PL.group_w(SB, {'lowerarm01.R', 'upperarm02.R'}) > 0.2
cand = np.nonzero(fm & (np.linalg.norm(VB - el, axis=1) < 0.07))[0]
# the front of the elbow: the side the forearm bends toward
fdir = tail('lowerarm01.R') - el; fdir /= np.linalg.norm(fdir)
udir = el - bone('upperarm01.R'); udir /= np.linalg.norm(udir)
flex = fdir - udir * np.dot(fdir, udir); flex = flex / max(np.linalg.norm(flex), 1e-6) if np.linalg.norm(flex) > 1e-3 else np.array([0, 0, 1.0])
LMV['antecubitalR'] = dict(points=[on(SB, VB, cand[np.argmax((VB[cand] - el) @ flex + 0.5 * (VB[cand] - el) @ np.array([0, 0, 1.0]))])], note='right antecubital fossa: the 20 g IV (chart)')
# ECG electrodes (5-lead): RA/LA under the clavicles at the mid-clavicular line, LL left lower chest/abdomen, V5 left anterior axillary line at the V4 level
for nm_, s, sx in (('ecgRA', 'R', -1), ('ecgLA', 'L', 1)):
    cl = bone('clavicle.' + s); sh = bone('upperarm01.' + s)
    p = 0.5 * (cl + sh) + np.array([0, -0.04, 0.2])
    front = (VB[:, 2] > 0.1) & (np.abs(VB[:, 0] - 0.5 * (cl[0] + sh[0])) < 0.02) & (np.abs(VB[:, 1] - (0.5 * (cl[1] + sh[1]) - 0.04)) < 0.02)
    LMV[nm_] = dict(points=[on(SB, VB, np.nonzero(front)[0][np.argmax(VB[front, 2])])], note='infraclavicular, mid-clavicular line')
v4y = notch[1] - 0.20
ll = (VB[:, 0] > 0.10) & (VB[:, 0] < 0.16) & (np.abs(VB[:, 1] - (notch[1] - 0.40)) < 0.02) & (VB[:, 2] > 0.1)
LMV['ecgLL'] = dict(points=[on(SB, VB, np.nonzero(ll)[0][np.argmax(VB[ll, 2])])], note='left lower chest / upper abdomen')
torso_l = (VB[:, 0] > 0.05) & (np.abs(VB[:, 1] - v4y) < 0.015)
cand = np.nonzero(torso_l)[0]
# anterior axillary line: where the trunk's surface faces sideways and forward equally
score = -np.abs(NB[cand, 0] - NB[cand, 2]) - 2 * (NB[cand, 0] < 0)
LMV['ecgV5'] = dict(points=[on(SB, VB, cand[np.argmax(score)])], note='V5: left anterior axillary line, 5th intercostal level')
H.save_json(os.path.join(WORK, 'landmark_verts.json'), LMV)
log(f'landmarks: {len(LMV)} recorded')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_final.blend'))
log('SAVED p25_final.blend')
