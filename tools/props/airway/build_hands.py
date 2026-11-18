"""build_hands.py: first-person hands in blue nitrile exam gloves, left and right, to mid-forearm, each a skinned mesh with a
full finger rig, and the poses the runtime crossfades.

   BLENDER_USER_RESOURCES=~/Developer/overlord-asset-sources/people/blender-user \
   blender -b --factory-startup --python tools/props/airway/build_hands.py -- TEXDIR OUTDIR [BLEND]

Source: the MakeHuman base mesh and its default skeleton (CC0), made with the MakeHuman add-on MPFB (see
tools/people/pp_common.py) for a mid-proportioned adult; the hands and forearms are cut from it. Everything else (the glove,
its cuff, the wrinkles, the poses, the grip anchors) is made here.

Frame of each hand (meters, glTF): origin at the wrist joint; -Z runs toward the fingertips in the `open` pose; +Y is out of
the back of the hand; the thumb is on +X for the left hand and on -X for the right hand.
Nodes: hands_gloved (root) > hand_L, hand_R (armatures) > bones (MakeHuman names: lowerarm02, wrist, metacarpal1-4,
finger1-1 .. finger5-3, with .L/.R), the skinned meshes glove_L, glove_R, and per hand the grip anchors (children of the wrist
bone): grip_syringe, grip_mask, grip_bag, grip_laryngoscope, grip_pinch (+.L/.R suffix in the file; see hands.json).
Animations: one per pose for both hands (e.g. `open`), and per hand (`open.L`, `open.R`); `syringe_hold` has two keys
(t=0 hold, t=1 s thumb pressed ~2 cm) and `syringe_push` is the pressed pose alone."""
import bpy, bmesh, sys, os, math, json
import numpy as np
from mathutils import Matrix, Vector, Quaternion, Euler
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(HERE)), 'people'))
import kit
from kit import MM
import hands_pose as HP
import hands_poses as POSE

KEEP = ['lowerarm02', 'wrist'] + ['metacarpal%d' % i for i in range(1, 5)] + ['finger%d-%d' % (i, j) for i in range(1, 6) for j in range(1, 4)]
FINGERS = {1: 'thumb', 2: 'index', 3: 'middle', 4: 'ring', 5: 'little'}


def make_human():
    from pp_common import mpfb
    M = mpfb()
    bm = M.Human.create_human(mask_helpers=False, detailed_helpers=True, extra_vertex_groups=True, feet_on_ground=True, scale=0.1,
                              macro_detail_dict={'gender': 0.5, 'age': 0.5, 'muscle': 0.55, 'weight': 0.45, 'height': 0.5, 'proportions': 0.5, 'cupsize': 0.5, 'firmness': 0.5,
                                                 'race': {'african': 0.33, 'asian': 0.33, 'caucasian': 0.34}})
    arm = M.Human.add_builtin_rig(bm, 'default')
    return bm, arm


def bake_shape(bm):
    """Apply the shape-key mix so the mesh data holds the finished body (rest pose)."""
    if bm.data.shape_keys:
        k = bm.shape_key_add(name='__mix', from_mix=True); co = [tuple(d.co) for d in k.data]
        for kb in list(bm.data.shape_keys.key_blocks)[::-1]: bm.shape_key_remove(kb)
        for v, c in zip(bm.data.vertices, co): v.co = c


def hand_frame(arm, side):
    """Rest-pose frame of the hand: origin at the wrist head, -Z distal, +Y dorsal, thumb on +X (left) / -X (right)."""
    B = {b.name: b for b in arm.data.bones}; s = '.' + side
    w = B['wrist' + s].head_local.copy()
    k2, k5 = B['finger2-1' + s].head_local, B['finger5-1' + s].head_local
    dist = ((k2 + k5) / 2 - w).normalized()
    across = (k5 - k2).normalized()                                   # index knuckle -> little knuckle
    up = dist.cross(across).normalized()                              # candidate dorsal normal
    th = (B['finger1-2' + s].head_local - w)
    # the thumb lies on the palm side, below the plane of the knuckles: dorsal is away from it
    if up.dot(th - dist * th.dot(dist)) > 0: up = -up
    z = -dist; y = (up - z * up.dot(z)).normalized(); x = y.cross(z)
    M = Matrix((x, y, z)).transposed().to_4x4(); M.translation = w
    return M


def extract(bm, arm, side, keep_len=0.125):
    """A copy of the body cut to this side's hand and distal forearm, with only the hand bones' weights."""
    s = '.' + side; names = [n + s for n in KEEP]
    gi = {g.index: g.name for g in bm.vertex_groups}
    W = np.zeros(len(bm.data.vertices)); body = np.zeros(len(bm.data.vertices), bool)
    bidx = bm.vertex_groups['body'].index
    for v in bm.data.vertices:
        for g in v.groups:
            n = gi[g.group]
            if n in names or n == 'lowerarm01' + s: W[v.index] += g.weight
            if g.group == bidx and g.weight > 0.5: body[v.index] = True
    Fw = hand_frame(arm, side); inv = Fw.inverted()
    co = np.array([tuple(inv @ v.co) for v in bm.data.vertices])                 # in the hand frame
    keep = body & (W > 0.5) & (co[:, 2] < keep_len)                               # up to keep_len proximal of the wrist
    me = bm.data.copy(); ob = bpy.data.objects.new('glove_' + side, me); bpy.context.scene.collection.objects.link(ob)
    for g in bm.vertex_groups: ob.vertex_groups.new(name=g.name)
    b = bmesh.new(); b.from_mesh(me); b.verts.ensure_lookup_table()
    bmesh.ops.delete(b, geom=[v for v in b.verts if not keep[v.index]], context='VERTS')
    b.to_mesh(me); b.free()
    me.transform(inv)
    # weights: keep the hand bones; whatever was on lowerarm01 goes to lowerarm02 (the static root of the hand rig)
    for g in list(ob.vertex_groups):
        if g.name not in names and g.name != 'lowerarm01' + s: ob.vertex_groups.remove(g)
    g1 = ob.vertex_groups.get('lowerarm01' + s); g2 = ob.vertex_groups['lowerarm02' + s]
    if g1:
        for v in me.vertices:
            for g in v.groups:
                if g.group == g1.index: g2.add([v.index], g.weight, 'ADD')
        ob.vertex_groups.remove(g1)
    return ob, Fw


def hand_armature(arm, side, Fw):
    """A new armature with only this hand's bones, in the hand frame."""
    s = '.' + side; inv = Fw.inverted()
    ad = bpy.data.armatures.new('hand_' + side); ao = bpy.data.objects.new('hand_' + side, ad); bpy.context.scene.collection.objects.link(ao)
    bpy.context.view_layer.objects.active = ao; bpy.ops.object.mode_set(mode='EDIT')
    src = {b.name: b for b in arm.data.bones}; eb = {}
    for n in KEEP:
        b = src[n + s]; e = ad.edit_bones.new(n + s)
        M = inv @ b.matrix_local; e.head = inv @ b.head_local; e.tail = inv @ b.tail_local; e.align_roll((M.to_3x3() @ Vector((0, 0, 1))))
        eb[n] = e
    for n in KEEP:
        p = src[n + s].parent
        if p and p.name[:-2] in eb: eb[n].parent = eb[p.name[:-2]]; eb[n].use_connect = False
    bpy.ops.object.mode_set(mode='OBJECT')
    return ao


# ---------------------------------------------------------------------------------------------- glove surface
def glove_surface(ob, side, cuff_z=0.062):
    """Materials, a rolled cuff bead and a slight outward offset of the glove over the skin. cuff_z: distance proximal of the
    wrist joint where the glove ends (exam-glove cuffs reach about 6 cm past the wrist crease)."""
    me = ob.data
    glove = kit.material('nitrile_blue', rgb=(0.09, 0.20, 0.60), rough=0.36, specular=0.5, sheen=0.10, sheen_rough=0.45, sheen_tint=(0.35, 0.5, 0.95))
    skin = kit.material('skin_forearm', rgb=(0.55, 0.38, 0.29), rough=0.48, specular=0.45)
    me.materials.clear(); me.materials.append(glove); me.materials.append(skin)
    # subdivide once for a smooth hand at arm's length (weights interpolate)
    m = ob.modifiers.new('sub', 'SUBSURF'); m.levels = 1; m.render_levels = 1; m.uv_smooth = 'PRESERVE_BOUNDARIES'
    kit.apply_mods(ob)
    d = ob.modifiers.new('dec', 'DECIMATE'); d.ratio = 0.74; d.use_collapse_triangulate = False; kit.apply_mods(ob); me = ob.data
    b = bmesh.new(); b.from_mesh(me)
    bmesh.ops.bisect_plane(b, geom=b.verts[:] + b.edges[:] + b.faces[:], dist=1e-5, plane_co=(0, 0, cuff_z), plane_no=(0, 0, 1))
    b.to_mesh(me); b.free()
    for p in me.polygons:
        c = sum((me.vertices[i].co for i in p.vertices), Vector()) / len(p.vertices); p.material_index = 0 if c.z < cuff_z else 1; p.use_smooth = True
    me.update()
    # glove thickness and the cuff bead (a rolled edge ~2 mm proud), on the glove side of the cuff line
    me.calc_normals_split() if hasattr(me, 'calc_normals_split') else None
    for v in me.vertices:
        z = v.co.z; n = v.normal
        if z < cuff_z + 0.002:
            off = 0.0004 + 0.0019 * math.exp(-((z - (cuff_z - 0.0025)) / 0.0022) ** 2)
            v.co = v.co + n * off
    me.update()
    # close the cut end of the forearm with a slightly domed cap (skin)
    b = bmesh.new(); b.from_mesh(me)
    edges = [e for e in b.edges if e.is_boundary]
    if edges:
        res = bmesh.ops.holes_fill(b, edges=edges, sides=0)
        for f in res['faces']:
            f.material_index = 1; f.smooth = True
            c = f.calc_center_median(); ins = bmesh.ops.poke(b, faces=[f])
            for v in ins['verts']: v.co.z -= 0.004
    b.to_mesh(me); b.free(); me.update()
    return ob


def wrinkle_map(ob, ao, side, path, px=1024):
    """A tangent-space normal map for the glove: thin creases across the finger joints and the knuckles, bunched rings at the
    wrist and in front of the cuff bead, and a faint micro-texture. The mesh's UVs are first re-packed so the hand fills the
    picture; heights are computed from rest-pose positions rasterized into UV space."""
    me = ob.data
    bpy.context.view_layer.objects.active = ob; ob.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.pack_islands(margin=0.004, rotate=True); bpy.ops.object.mode_set(mode='OBJECT'); ob.select_set(False)
    uv = me.uv_layers.active.data; P = np.zeros((px, px, 3), np.float32); M = np.zeros((px, px), bool)
    co = np.array([v.co[:] for v in me.vertices], np.float32)
    for poly in me.polygons:
        li = list(poly.loop_indices)
        for k in range(1, len(li) - 1):
            ids = [li[0], li[k], li[k + 1]]; T = np.array([uv[i].uv[:] for i in ids]) * (px - 1); V = co[[me.loops[i].vertex_index for i in ids]]
            x0, y0 = np.floor(T.min(0)).astype(int); x1, y1 = np.ceil(T.max(0)).astype(int)
            if x1 < 0 or y1 < 0 or x0 >= px or y0 >= px: continue
            xs, ys = np.meshgrid(np.arange(max(0, x0 - 1), min(px, x1 + 2)), np.arange(max(0, y0 - 1), min(px, y1 + 2)))
            a, b, c = T; d = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
            if abs(d) < 1e-12: continue
            l1 = ((b[1] - c[1]) * (xs - c[0]) + (c[0] - b[0]) * (ys - c[1])) / d; l2 = ((c[1] - a[1]) * (xs - c[0]) + (a[0] - c[0]) * (ys - c[1])) / d; l3 = 1 - l1 - l2
            ins = (l1 >= -0.02) & (l2 >= -0.02) & (l3 >= -0.02)
            pos = l1[..., None] * V[0] + l2[..., None] * V[1] + l3[..., None] * V[2]
            P[ys[ins], xs[ins]] = pos[ins]; M[ys[ins], xs[ins]] = True
    h = np.zeros((px, px), np.float32); rng = np.random.default_rng(7 if side == 'L' else 11)
    for b in ao.data.bones:
        n = b.name[:-2]
        if not n.startswith('finger') and not n.startswith('metacarpal'): continue
        if n.startswith('metacarpal'): j = Vector(b.tail_local)                        # MCP knuckle
        else: j = Vector(b.tail_local) if not n.endswith('-3') else None              # PIP, DIP
        if j is None: continue
        d = (b.tail_local - b.head_local).normalized(); rel = P - np.array(j[:], np.float32)
        along = rel @ np.array(d[:], np.float32); radial = np.linalg.norm(rel - along[..., None] * np.array(d[:], np.float32), axis=-1)
        w = np.exp(-(along / 0.0065) ** 2) * np.exp(-(radial / 0.016) ** 2)
        f = 2 * np.pi / (0.0016 + 0.0004 * rng.random())
        h += w * (0.6 * np.sin(along * f + rng.random() * 6) + 0.4 * np.sin(along * f * 1.9 + rng.random() * 6))
    z = P[..., 2]; ang = np.arctan2(P[..., 0], P[..., 1])
    wr = 0.55 * np.exp(-((z - 0.012) / 0.012) ** 2) + 0.6 * np.exp(-((z - 0.050) / 0.006) ** 2)     # over the wrist crease, and bunched in front of the cuff bead
    wr *= 0.55 + 0.45 * np.sin(ang * 2.0 + 1.0) * np.sin(z * 180.0 + 0.4)                                # uneven, not rings
    ripple = np.sin(z * 2 * np.pi / 0.0035 + 1.5 * np.sin(ang * 3 + 0.7) + 0.8 * np.sin(ang * 7)) * (0.6 + 0.4 * np.sin(ang * 5 + 2))
    h += wr * ripple * (z < 0.06)
    h += (rng.standard_normal((px, px)).astype(np.float32)) * 0.04          # micro-texture of the nitrile
    h[~M] = 0
    # blur the noise a little and convert to a normal map (glTF/OpenGL convention: +Y = +V, image rows run down)
    k = np.array([1, 4, 6, 4, 1], np.float32) / 16
    for ax in (0, 1): h = np.apply_along_axis(lambda r: np.convolve(r, k, 'same'), ax, h)
    gx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) / 2; gy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) / 2
    s_ = 1.1; nx, ny, nz = -gx * s_, -gy * s_, np.ones_like(h)      # Blender UV v runs up the picture as stored by foreach (row 0 = v 0)
    L = np.sqrt(nx * nx + ny * ny + nz * nz); n = np.stack([nx / L, ny / L, nz / L, np.ones_like(h)], -1) * 0.5 + 0.5; n[..., 3] = 1
    im = bpy.data.images.new('glove_normal_' + side, px, px, alpha=False); im.colorspace_settings.name = 'Non-Color'
    im.pixels.foreach_set(n.astype(np.float32).ravel()); im.filepath_raw = path; im.file_format = 'PNG'; im.save(); im.pack()
    return im


def build(texdir, outdir, blend=None):
    kit.reset()
    body, arm = make_human()
    bake_shape(body)
    # remove the rig modifier so the mesh is in rest pose
    for m in list(body.modifiers): body.modifiers.remove(m)
    root = bpy.data.objects.new('hands_gloved', None); bpy.context.scene.collection.objects.link(root)
    out = {}
    for side in ('L', 'R'):
        ob, Fw = extract(body, arm, side)
        ao = hand_armature(arm, side, Fw)
        glove_surface(ob, side)
        im = wrinkle_map(ob, ao, side, os.path.join(texdir, 'glove_normal_%s.png' % side))
        gm = ob.data.materials[0].copy(); gm.name = 'nitrile_blue_' + side; ob.data.materials[0] = gm
        nt = gm.node_tree; b_ = nt.nodes['Principled BSDF']; t = nt.nodes.new('ShaderNodeTexImage'); t.image = im; nm = nt.nodes.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = 1.0
        nt.links.new(t.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs['Normal'], b_.inputs['Normal'])
        ob.parent = ao; mod = ob.modifiers.new('arm', 'ARMATURE'); mod.object = ao
        ao.parent = root
        out[side] = (ob, ao, Fw)
        print('HAND', side, 'verts', len(ob.data.vertices), 'tris', kit.tris(ob), 'groups', len(ob.vertex_groups))
    bpy.data.objects.remove(body); bpy.data.objects.remove(arm)
    mine = {root} | {o for side in ('L', 'R') for o in out[side][:2]}
    for o in list(bpy.data.objects):
        if o not in mine: bpy.data.objects.remove(o)                 # MPFB's bone-shape spheres and helpers
    # place the two hands side by side for a look (the runtime moves each hand root anyway)
    out['L'][1].location = (-0.12, 0, 0); out['R'][1].location = (0.12, 0, 0)
    bpy.context.view_layer.update()
    info = make_poses({s_: out[s_][1] for s_ in ('L', 'R')})
    if blend: bpy.ops.wm.save_as_mainfile(filepath=blend)
    bpy.ops.object.select_all(action='DESELECT')
    for o in bpy.data.objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(outdir, 'hands_gloved.raw.glb'), export_format='GLB', use_selection=True, export_yup=False,
                              export_apply=False, export_skins=True, export_animations=True, export_animation_mode='NLA_TRACKS',
                              export_optimize_animation_size=False, export_force_sampling=False, export_extras=True, export_def_bones=False)
    info['triangles_per_hand'] = kit.tris(out['L'][0])
    json.dump(info, open(os.path.join(outdir, 'hands.raw.json'), 'w'), indent=1)


def make_poses(arms):
    """Solve every pose for both hands, key it into actions (one NLA track per pose shared by both hands, plus a per-hand
    track), and add the grip anchors."""
    sc = bpy.context.scene; sc.render.fps = 24
    hands = {s_: HP.Hand(a, s_) for s_, a in arms.items()}
    info = {'poses': [], 'grips': {}, 'anchor_meaning': POSE.GRIP_ANCHOR, 'frame': 'hand frame: wrist joint at the origin, -Z toward the fingertips, +Y back of the hand, thumb +X (left) / -X (right)'}
    for a in arms.values(): a.animation_data_create(); a.animation_data.use_nla = False
    def snap(h): return {pb.name: pb.rotation_quaternion.copy() for pb in h.ao.pose.bones}
    def key(h, q, frame_no):
        for pb in h.ao.pose.bones: pb.rotation_quaternion = q[pb.name]; pb.keyframe_insert('rotation_quaternion', frame=frame_no)
    for name, fn, grip in POSE.POSES:
        info['poses'].append(name)
        for s_, h in hands.items():
            h.ao.animation_data.action = None
            res = fn(h); q1 = snap(h); q2 = None
            if name == 'syringe_hold': POSE.syringe_hold(h, push=0.02); q2 = snap(h)
            act = bpy.data.actions.new('%s_%s' % (name, s_)); h.ao.animation_data.action = act
            key(h, q1, 1)
            if q2: key(h, q2, 25)
            if grip and res and res[0] is not None:
                e = bpy.data.objects.new('%s.%s' % (grip, s_), None); e.empty_display_type = 'ARROWS'; e.empty_display_size = 0.02
                bpy.context.scene.collection.objects.link(e); e.parent = h.ao; e.matrix_parent_inverse = Matrix.Identity(4); e.matrix_basis = res[0]
                M = res[0]; info['grips']['%s.%s' % (grip, s_)] = {'pose': name, 'matrix_hand_frame': [list(map(lambda v: round(v, 5), r)) for r in M]}
            h.ao.animation_data.action = None
            for tname in (name, '%s.%s' % (name, s_)):
                tr = h.ao.animation_data.nla_tracks.new(); tr.name = tname; st = tr.strips.new(tname, 1, act); st.action_frame_end = max(st.action_frame_end, 1)
            print('POSE', name, s_)
    for a in arms.values(): a.animation_data.use_nla = True
    for h in hands.values(): h.clear(); h.apply()
    return info


if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:]
    build(argv[0], argv[1], argv[2] if len(argv) > 2 else None)
