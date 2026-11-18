"""p25_09_blankets.py: a cotton thermal blanket per pose, by cloth simulation over the posed body, gown and supports on
the measured stretcher (its frame and raised rail included as colliders).
   Blender -b --factory-startup --python tools/people/hero/p25_09_blankets.py
 blanket__flat, blanket__ramped: from the waist down, top edge folded back 20 cm, over the feet, hanging over the sides.
 blanket__lateral_left: over the hips and legs.
Weave: Poly Haven waffle_pique_cotton (CC0), tiled 29 x 28 cm. Edges: a 15 mm bound hem as real geometry (doubled
strip). Saves p25/blend/p25_blankets.blend."""
import bpy, os, sys, json, math, time
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Matrix, Vector
import hero_lib as H
import pose_lib as PL

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
TEX = os.path.join(WORK, 'tex'); os.makedirs(TEX, exist_ok=True)
log = H.Log('blankets')
FRAMES = 45
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_gown.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']
SN = np.load(os.path.join(WORK, 'stretcher', 'stretcher.npz'))
sv = np.stack([SN['V'][:, 0], -SN['V'][:, 2], SN['V'][:, 1]], 1)
col_st = H.new_mesh('col_stretcher', sv, [tuple(int(x) for x in (f if f[-1] != f[-2] else f[:-1])) for f in SN['F']])
m_ = col_st.modifiers.new('col', 'COLLISION'); col_st.collision.thickness_outer = 0.004
FIG = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == arm and o.name in ('skin_body', 'skin_head', 'gown')]
# material
from PIL import Image
S_ = 1024
d = os.path.join(H.DL, 'ph-waffle_pique_cotton')
Image.open(os.path.join(d, 'waffle_pique_cotton_nor_gl_2k.jpg')).resize((S_, S_)).save(os.path.join(TEX, 'blanket_normal.png'))
col = np.asarray(Image.open(os.path.join(d, 'waffle_pique_cotton_diff_2k.jpg')).convert('RGB').resize((S_, S_)), float) / 255.0
lum = col.mean(2, keepdims=True); col = np.clip(np.array([0.90, 0.91, 0.92]) * (0.85 + 0.35 * (lum - lum.mean())), 0, 1)
Image.fromarray((col * 255).astype(np.uint8)).save(os.path.join(TEX, 'blanket_basecolor.png'))
M = bpy.data.materials.new('blanket'); M.use_nodes = True; nt = M.node_tree; b = nt.nodes['Principled BSDF']
ti = nt.nodes.new('ShaderNodeTexImage'); ti.image = bpy.data.images.load(os.path.join(TEX, 'blanket_basecolor.png')); nt.links.new(ti.outputs['Color'], b.inputs['Base Color'])
tn = nt.nodes.new('ShaderNodeTexImage'); tn.image = bpy.data.images.load(os.path.join(TEX, 'blanket_normal.png')); tn.image.colorspace_settings.name = 'Non-Color'
nm = nt.nodes.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = 1.0
nt.links.new(tn.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
b.inputs['Roughness'].default_value = 0.9; M.use_backface_culling = False
REPORT = {}


def set_pose(name):
    arm.animation_data.action = bpy.data.actions[name]; scene.frame_set(1)
    for o in FIG:
        if o.data.shape_keys:
            for k in o.data.shape_keys.key_blocks[1:]:
                k.value = 1.0 if k.name == 'press_' + name else 0.0
    bpy.context.view_layer.update()


def static_copy(o, name):
    me = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    c = bpy.data.objects.new(name, me); scene.collection.objects.link(c); c.matrix_world = o.matrix_world.copy()
    return c


def blanket(pose, y0, y1, x_half, cuff, supports):
    set_pose(pose)
    cols = [static_copy(o, 'col_' + o.name) for o in FIG] + [static_copy(bpy.data.objects[s], 'col_' + s) for s in supports]
    for c in cols:
        c.modifiers.new('col', 'COLLISION'); c.collision.thickness_outer = 0.008 if c.name == 'col_gown' else 0.004; c.collision.cloth_friction = 12.0
    allv = np.vstack([H.world_coords(o) for o in FIG])
    sel = (allv[:, 1] > y0) & (allv[:, 1] < y1)
    ztop = allv[sel, 2].max() + 0.04
    nx, ny = 64, int(64 * (y1 - y0) / (2 * x_half))
    xs = np.linspace(-x_half, x_half, nx); ys = np.linspace(y0, y1, ny)
    X, Y = np.meshgrid(xs, ys, indexing='ij')
    Vb = np.stack([X, Y, np.full_like(X, ztop)], -1).reshape(-1, 3)
    F = [[i * ny + j, (i + 1) * ny + j, (i + 1) * ny + j + 1, i * ny + j + 1] for i in range(nx - 1) for j in range(ny - 1)]
    o = H.new_mesh('blanket__' + pose, Vb, F)
    cl = o.modifiers.new('cloth', 'CLOTH'); cs = cl.settings
    cs.quality = 6; cs.mass = 0.35; cs.tension_stiffness = 12; cs.compression_stiffness = 12; cs.shear_stiffness = 4; cs.bending_stiffness = 1.0; cs.air_damping = 1.0
    cl.collision_settings.distance_min = 0.004; cl.collision_settings.use_self_collision = False; cl.collision_settings.collision_quality = 3
    cl.point_cache.frame_start = 1; cl.point_cache.frame_end = FRAMES
    scene.frame_start, scene.frame_end = 1, FRAMES
    t0 = time.time()
    for f in range(1, FRAMES + 1):
        scene.frame_set(f)
    me = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    Vs = H.get_co(me.vertices, len(me.vertices))
    scene.frame_set(1)
    o.modifiers.remove(cl)
    for c in cols:
        bpy.data.objects.remove(c, do_unlink=True)
    set_pose(pose)
    log(f'{pose}: blanket {2 * x_half:.2f} x {y1 - y0:.2f} m, {len(Vb)} vertices, settled in {time.time() - t0:.0f} s; lowest edge z {Vs[:, 2].min():.3f}')
    # the cuff: the head-end 20 cm folded back on itself (a second layer 4 mm above, joined by a rolled edge)
    Q = np.array(F)
    Ns = H.vertex_normals(Vs, Q)
    Vs = Vs + Ns * 0.0
    top = Y.reshape(-1) > y1 - cuff
    cuffV = Vs[top] + Ns[top] * 0.004
    idx = -np.ones(len(Vs), int); idx[np.nonzero(top)[0]] = len(Vs) + np.arange(top.sum())
    F2 = [[idx[f[3]], idx[f[2]], idx[f[1]], idx[f[0]]] for f in F if all(top[v] for v in f)]
    # join the outer edge of the fold to the blanket's head edge
    edge = [i * ny + (ny - 1) for i in range(nx)]
    F3 = [[edge[i], edge[i + 1], idx[edge[i + 1]], idx[edge[i]]] for i in range(nx - 1)]
    V2 = np.vstack([Vs, cuffV]); FF = F + F2 + F3
    # a bound hem round the outside (15 mm doubled strip just under the edge)
    border = [(i, 0) for i in range(nx)] + [(nx - 1, j) for j in range(1, ny)] + [(i, ny - 1) for i in range(nx - 2, -1, -1)] + [(0, j) for j in range(ny - 2, 0, -1)]
    bi = [i * ny + j for i, j in border]
    hemV = []
    nb = len(bi)
    for k, v in enumerate(bi):
        inn = Vs[[bi[(k - 1) % nb], bi[(k + 1) % nb]]].mean(0)
        c = Vs[v]; nrm = Ns[v]
        ctr = Vs.mean(0); dirc = (ctr - c); dirc -= nrm * np.dot(dirc, nrm); dirc /= max(np.linalg.norm(dirc), 1e-9)
        hemV.append(c - nrm * 0.0025 + dirc * 0.015)
    hb = len(V2); V2 = np.vstack([V2, np.array(hemV)])
    FF += [[bi[k], hb + k, hb + (k + 1) % nb, bi[(k + 1) % nb]] for k in range(nb)]
    bpy.data.objects.remove(o, do_unlink=True)
    o = H.new_mesh('blanket__' + pose, V2, [tuple(f) for f in FF])
    uvs = []
    for p in o.data.polygons:
        for vi in p.vertices:
            uvs.append((V2[vi, 0] / 0.29, V2[vi, 1] / 0.28))
    lay = o.data.uv_layers.new(name='UVMap'); lay.data.foreach_set('uv', np.asarray(uvs, np.float32).ravel())
    o.data.materials.append(M)
    for p in o.data.polygons:
        p.use_smooth = True
    # how close the settled blanket is to the body and gown: smallest clearance (negative = passes through)
    fig = np.vstack([H.world_coords(x) for x in FIG]); figF = []
    off = 0
    for x in FIG:
        figF.append(H.quads_of(x) + off); off += len(x.data.vertices)
    tree = H.bvh(fig, np.vstack(figF))
    worst = 1.0
    for p in Vs[::3]:
        loc, nrm, fi, dd = tree.find_nearest(Vector(p), 0.05)
        if loc is not None:
            s_ = (Vector(p) - loc).dot(nrm); worst = min(worst, s_)
    REPORT[pose] = dict(vertices=len(V2), triangles=sum(len(p.vertices) - 2 for p in o.data.polygons), min_clearance_mm=worst * 1000, lowest_z=float(Vs[:, 2].min()))
    log(f'{pose}: blanket {len(V2)} vertices, {REPORT[pose]["triangles"]} triangles; least clearance to body/gown {worst * 1000:.1f} mm')
    return o


skin_b = bpy.data.objects['skin_body']
set_pose('flat'); vb = H.world_coords(skin_b)
y_waist = float(np.percentile(vb[:, 1], 50)) - 0.13
blanket('flat', vb[:, 1].min() - 0.12, y_waist, 0.65, 0.20, ['pillow_head__flat'])
set_pose('ramped'); vb = H.world_coords(skin_b)
blanket('ramped', vb[:, 1].min() - 0.12, y_waist, 0.65, 0.20, ['support_ramp__ramped', 'support_head__ramped'])
set_pose('lateral_left'); vb = H.world_coords(skin_b)
blanket('lateral_left', vb[:, 1].min() - 0.10, float(np.percentile(vb[:, 1], 55)), 0.65, 0.20, ['pillow_head__lateral_left', 'pillow_knees__lateral_left'])
bpy.data.objects.remove(col_st, do_unlink=True)
set_pose('flat')
for o in FIG:
    if o.data.shape_keys:
        for k in o.data.shape_keys.key_blocks[1:]:
            k.value = 0.0
H.save_json(os.path.join(WORK, 'blankets.json'), REPORT)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_blankets.blend'))
log('SAVED p25_blankets.blend')
