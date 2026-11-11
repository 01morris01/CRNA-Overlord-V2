"""build_patient.py: a patient lying under a drape, for the operating table and the regional practice table.
   blender -b --factory-startup --python tools/build_patient.py -- ROCKETBOX_DIR OUT.glb [preview.png]
A Microsoft Rocketbox adult (MIT licence) is posed from the library's standing idle, laid on its back, and covered from the
upper chest down by a sheet that is draped over the body by projection and relaxed like cloth. Origin: the middle of the
table top under the body. In the exported file the head points to -Z and the face looks up (+Y).
This is set dressing. It is not a clinical model: nothing is taught or measured on it."""
import bpy, bmesh, sys, os, math, random
from mathutils import Vector, Matrix, Quaternion
from mathutils.bvhtree import BVHTree
A = sys.argv[sys.argv.index('--') + 1:]; SRC, OUT = A[0], A[1]; PREVIEW = A[2] if len(A) > 2 else None
NAME, CODE = 'Male_Adult_01', 'm002'; TMP = os.path.join(os.path.dirname(OUT), '_tex'); os.makedirs(TMP, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene; scene.render.fps = 30
bpy.ops.import_scene.fbx(filepath=f'{SRC}/{NAME}/{NAME}.fbx'); arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE'); mesh = next(o for o in bpy.data.objects if o.type == 'MESH')
def image(path, size, fmt, name):
    dst = os.path.join(TMP, name + ('.png' if fmt == 'PNG' else '.jpg'))
    if not os.path.exists(dst):
        im = bpy.data.images.load(path); im.scale(size, size); im.filepath_raw = dst; im.file_format = fmt; scene.render.image_settings.quality = 90; im.save(); bpy.data.images.remove(im)
    return bpy.data.images.load(dst, check_existing=True)
for m in mesh.data.materials:
    part = m.name.split('_')[-1]; nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial'); b = nt.nodes.new('ShaderNodeBsdfPrincipled'); nt.links.new(b.outputs[0], out.inputs[0])
    if part == 'opacity':
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = image(f'{SRC}/{NAME}/{CODE}_opacity_color.tga', 1024, 'PNG', f'{CODE}_opacity'); nt.links.new(t.outputs['Color'], b.inputs['Base Color']); nt.links.new(t.outputs['Alpha'], b.inputs['Alpha']); b.inputs['Roughness'].default_value = 0.6; m['part'] = 'hair'
        try: m.blend_method = 'HASHED'
        except Exception: pass
    else:
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = image(f'{SRC}/{NAME}/{CODE}_{part}_color.tga', 1024, 'JPEG', f'{CODE}_{part}_color'); nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
        n = nt.nodes.new('ShaderNodeTexImage'); n.image = image(f'{SRC}/{NAME}/{CODE}_{part}_normal.tga', 1024, 'JPEG', f'{CODE}_{part}_normal'); n.image.colorspace_settings.name = 'Non-Color'
        nm = nt.nodes.new('ShaderNodeNormalMap'); nt.links.new(n.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs[0], b.inputs['Normal']); b.inputs['Roughness'].default_value = 0.6 if part == 'head' else 0.78; m['part'] = part
    m.name = 'patient_' + m['part']
# ---- the standing idle pose, taken bone by bone in world space (as tools/convert_rocketbox.py does)
bo = set(bpy.data.objects); bpy.ops.import_scene.fbx(filepath=f'{SRC}/anim/m_idle_breathe_01.fbx'); new_o = [o for o in bpy.data.objects if o not in bo]; src = next(o for o in new_o if o.type == 'ARMATURE')
scene.frame_set(int(src.animation_data.action.frame_range[0]) + 4); bpy.context.view_layer.update()
def chain(b):
    yield b
    for c in b.children: yield from chain(c)
bones = [b for r in arm.data.bones if r.parent is None for b in chain(r)]; rest = {b.name: b.matrix_local.copy() for b in arm.data.bones}; inv = arm.matrix_world.inverted(); M = {}
for b in bones:
    pb = arm.pose.bones[b.name]; pb.rotation_mode = 'QUATERNION'; base = (M[b.parent.name] @ rest[b.parent.name].inverted() @ rest[b.name]) if b.parent else rest[b.name]; q = Quaternion()
    if b.name in src.pose.bones:
        q = base.to_quaternion().inverted() @ (inv @ (src.matrix_world @ src.pose.bones[b.name].matrix)).decompose()[1]
        if 'Hand' in b.name or 'Finger' in b.name: pass
    pb.rotation_quaternion = q; M[b.name] = base @ q.to_matrix().to_4x4()
print('LID BONES', [b.name for b in bones if 'lid' in b.name.lower() or 'Lid' in b.name][:8])
for o in new_o: bpy.data.objects.remove(o, do_unlink=True)
bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get(); ev = mesh.evaluated_get(dg); body_me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=True, depsgraph=dg)
W = mesh.matrix_world.copy(); body = bpy.data.objects.new('patient_body', body_me); scene.collection.objects.link(body)
LAY = Matrix(((1, 0, 0, 0), (0, 0, 1, 0), (0, -1, 0, 0), (0, 0, 0, 1)))           # standing -> on the back, head to +Y, face up
body_me.transform(LAY @ W); co = [v.co for v in body_me.vertices]; zmin = min(v.z for v in co); ymid = (min(v.y for v in co) + max(v.y for v in co)) / 2; xmid = (min(v.x for v in co) + max(v.x for v in co)) / 2
body_me.transform(Matrix.Translation((-xmid, -ymid, -zmin))); body_me.update()
for o in (arm, mesh): bpy.data.objects.remove(o, do_unlink=True)
ys = [v.co.y for v in body_me.vertices]; ytop, yfeet = max(ys), min(ys); print('BODY length', round(ytop - yfeet, 3), 'height above table', round(max(v.co.z for v in body_me.vertices), 3))
# ---- the sheet: projected onto the body from above, then relaxed so that it tents between high points and hangs at the sides
bm = bmesh.new(); bm.from_mesh(body_me); tree = BVHTree.FromBMesh(bm)
X0, X1, Y0, Y1, NX, NY, HALF = -0.40, 0.40, yfeet - 0.12, ytop - 0.292, 64, 132, 0.3
random.seed(4); sm = bmesh.new(); grid = [[None] * (NX + 1) for _ in range(NY + 1)]; floor = {}
for j in range(NY + 1):
    for i in range(NX + 1):
        x, y = X0 + (X1 - X0) * i / NX, Y0 + (Y1 - Y0) * j / NY; top = None
        for (dx, dy) in ((0, 0), (0.014, 0), (-0.014, 0), (0, 0.014), (0, -0.014), (0.01, 0.01), (-0.01, 0.01), (0.01, -0.01), (-0.01, -0.01)):      # the highest thing within a finger's width
            h = tree.ray_cast(Vector((x + dx, y + dy, 1.0)), Vector((0, 0, -1)))[0]
            if h is not None and (top is None or h.z > top): top = h.z
        over = max(0.0, abs(x) - HALF) + max(0.0, (yfeet - 0.02) - y) * 0.8; table = 0.004 if over <= 0 else -min(0.16, over * 1.9)
        lo = max(top + 0.011, table) if top is not None else table; v = sm.verts.new((x, y, lo)); grid[j][i] = v; floor[v] = lo
for j in range(NY):
    for i in range(NX): sm.faces.new((grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]))
for it in range(46):                                                # cloth cannot sink into what is under it; otherwise it evens out
    nz = {}
    for v in sm.verts:
        nb = [e.other_vert(v).co.z for e in v.link_edges]; nz[v] = max(floor[v], v.co.z * 0.42 + 0.58 * sum(nb) / len(nb))
    for v, z in nz.items(): v.co.z = z
for v in sm.verts: v.co.z += (random.random() - 0.5) * 0.0016 + 0.0012 * math.sin(v.co.y * 61 + v.co.x * 23) * math.sin(v.co.x * 47)
for f in sm.faces: f.smooth = True
uv = sm.loops.layers.uv.new('UV0')
for f in sm.faces:
    for l in f.loops: l[uv].uv = ((l.vert.co.x - X0) / 0.5, (l.vert.co.y - Y0) / 0.5)
dme = bpy.data.meshes.new('patient_drape'); sm.to_mesh(dme); sm.free(); bm.free(); drape = bpy.data.objects.new('patient_drape', dme); scene.collection.objects.link(drape)
dm = bpy.data.materials.new('patient_drape'); dm.use_nodes = True; pb = dm.node_tree.nodes['Principled BSDF']; pb.inputs['Base Color'].default_value = (0.2, 0.42, 0.5, 1); pb.inputs['Roughness'].default_value = 0.88; dm.use_backface_culling = False; dme.materials.append(dm)
print('DRAPE verts', len(dme.vertices), 'from y', round(Y0, 2), 'to', round(Y1, 2))
if PREVIEW:
    scene.render.engine = 'CYCLES'; scene.cycles.samples = 48; scene.render.resolution_x, scene.render.resolution_y = 900, 520; scene.view_settings.view_transform = 'AgX'
    cam = bpy.data.cameras.new('c'); cam.lens = 40; co = bpy.data.objects.new('c', cam); scene.collection.objects.link(co); co.location = (1.5, 1.25, 1.15); co.rotation_euler = (Vector((0, 0.1, 0.1)) - co.location).to_track_quat('-Z', 'Y').to_euler(); scene.camera = co
    d = bpy.data.lights.new('l', 'AREA'); d.energy = 420; d.size = 2.2; lo = bpy.data.objects.new('l', d); scene.collection.objects.link(lo); lo.location = (0.4, 0.3, 2.3)
    w = bpy.data.worlds.new('w'); scene.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.7, 0.72, 0.75, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.5
    tb = bpy.data.meshes.new('t'); tbm = bmesh.new(); bmesh.ops.create_cube(tbm, size=1.0); [setattr(v, 'co', Vector((v.co.x * 0.6, v.co.y * 2.0, v.co.z * 0.1 - 0.05))) for v in tbm.verts]; tbm.to_mesh(tb); tbm.free(); to = bpy.data.objects.new('t', tb); scene.collection.objects.link(to)
    scene.render.filepath = PREVIEW; bpy.ops.render.render(write_still=True); [bpy.data.objects.remove(o, do_unlink=True) for o in (co, lo, to)]
bpy.ops.object.select_all(action='DESELECT'); body.select_set(True); drape.select_set(True); bpy.context.view_layer.objects.active = body
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_yup=True, export_apply=True, export_image_format='AUTO', export_extras=True, export_draco_mesh_compression_enable=True)
print('EXPORTED', OUT, os.path.getsize(OUT))
