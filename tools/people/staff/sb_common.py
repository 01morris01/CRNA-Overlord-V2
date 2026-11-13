"""sb_common.py: shared pieces for the staff figures (imported by the other scripts in this folder; Blender 5.x python).

Microsoft Rocketbox avatars (MIT) arrive as an FBX whose armature is scaled 0.01 and turned a quarter turn, with the mesh
parented under it. `load_avatar` brings one in and bakes those transforms away, so that afterwards the world is plain:
meters, Z up, the person facing -Y (which becomes +Z in glTF and in the building), feet near z = 0."""
import bpy, bmesh, os, math
from mathutils import Vector, Matrix, Quaternion

FPS = 30


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.render.fps = FPS


def image(path, size, fmt, name, tex_dir):
    """A resized copy of a source texture, cached in tex_dir, loaded as a Blender image."""
    os.makedirs(tex_dir, exist_ok=True)
    dst = os.path.join(tex_dir, f'{name}_{size}' + ('.png' if fmt == 'PNG' else '.jpg'))
    if not os.path.exists(dst):
        im = bpy.data.images.load(path); im.scale(size, size); im.filepath_raw = dst; im.file_format = fmt
        bpy.context.scene.render.image_settings.quality = 92; im.save(); bpy.data.images.remove(im)
    return bpy.data.images.load(dst, check_existing=True)


def principled(mat):
    """Empty the material and give it one Principled BSDF; returns (node_tree, bsdf)."""
    mat.use_nodes = True; nt = mat.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial'); b = nt.nodes.new('ShaderNodeBsdfPrincipled'); nt.links.new(b.outputs[0], out.inputs[0])
    return nt, b


def tex_material(mat, colour, normal=None, rough=0.75, alpha=False, normal_strength=1.0):
    nt, b = principled(mat)
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = colour; nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    if alpha:
        nt.links.new(t.outputs['Alpha'], b.inputs['Alpha'])
        try: mat.blend_method = 'HASHED'
        except Exception: pass
    if normal is not None:
        n = nt.nodes.new('ShaderNodeTexImage'); n.image = normal; normal.colorspace_settings.name = 'Non-Color'
        nm = nt.nodes.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = normal_strength
        nt.links.new(n.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs[0], b.inputs['Normal'])
    b.inputs['Roughness'].default_value = rough
    return b


def load_avatar(src, name, code, tex_dir, sizes=None, prefix=None):
    """Import <src>/<name>/<name>.fbx, bake its transforms, rebuild its materials. Returns (armature, mesh).
    Materials are renamed <prefix>_<part> and carry the custom property `part` (body, head, hair, kit)."""
    sizes = sizes or {}; before = set(bpy.data.objects); acts = set(bpy.data.actions)
    bpy.ops.import_scene.fbx(filepath=f'{src}/{name}/{name}.fbx'); bpy.context.scene.render.fps = FPS
    new = [o for o in bpy.data.objects if o not in before]
    arm = next(o for o in new if o.type == 'ARMATURE'); mesh = next(o for o in new if o.type == 'MESH')
    for o in [o for o in new if o.type == 'EMPTY']: bpy.data.objects.remove(o, do_unlink=True)
    for a in [a for a in bpy.data.actions if a not in acts]: bpy.data.actions.remove(a)
    if arm.animation_data: arm.animation_data_clear()
    # ---- bake the object transforms into the data
    bpy.context.view_layer.update()
    mw = mesh.matrix_world.copy(); aw = arm.matrix_world.copy()
    mesh.parent = None; mesh.matrix_world = Matrix.Identity(4); mesh.data.transform(mw); mesh.data.update()
    arm.data.transform(aw); arm.matrix_world = Matrix.Identity(4)
    bpy.context.view_layer.update()
    mesh.parent = arm; mesh.matrix_parent_inverse = Matrix.Identity(4)
    for m in mesh.modifiers:
        if m.type == 'ARMATURE': m.object = arm
    arm.name = name; mesh.name = name + '_mesh'
    # ---- materials
    prefix = prefix or name
    for m in mesh.data.materials:
        part = m.name.split('_')[-1]
        if part == 'opacity':
            b = tex_material(m, image(f'{src}/{name}/{code}_opacity_color.tga', sizes.get('hair', 1024), 'PNG', f'{code}_opacity', tex_dir), rough=0.55, alpha=True); m['part'] = 'hair'
        else:
            size = sizes.get(part, 512 if part in ('stetoskop', 'protection') else 1024)
            b = tex_material(m, image(f'{src}/{name}/{code}_{part}_color.tga', size, 'JPEG', f'{code}_{part}_color', tex_dir), image(f'{src}/{name}/{code}_{part}_normal.tga', size, 'JPEG', f'{code}_{part}_normal', tex_dir), rough=0.62 if part == 'head' else 0.78)
            m['part'] = {'stetoskop': 'kit', 'protection': 'kit'}.get(part, part)
        m.name = f'{prefix}_{m["part"]}'
    return arm, mesh


def world_verts(obj):
    """Evaluated (posed) world positions of a mesh object's vertices."""
    ev = obj.evaluated_get(bpy.context.evaluated_depsgraph_get()); mw = ev.matrix_world
    return [mw @ v.co for v in ev.data.vertices]


def bone_head(arm, name):
    return arm.matrix_world @ arm.data.bones[name].head_local


def facing(arm):
    """Unit vector the figure faces, from the head bone toward the midpoint of the eyes (rest pose)."""
    h = bone_head(arm, 'Bip01 Head'); e = (bone_head(arm, 'Bip01 LEye') + bone_head(arm, 'Bip01 REye')) / 2
    f = e - h; f.z = 0; f.normalize(); return f


def material_faces(mesh, part):
    idx = [i for i, m in enumerate(mesh.data.materials) if m and m.get('part') == part]
    return [p.index for p in mesh.data.polygons if p.material_index in idx]


def cycles(scene, samples=48, res=(720, 960), transparent=False):
    scene.render.engine = 'CYCLES'; scene.cycles.samples = samples; scene.cycles.use_denoising = True
    scene.render.film_transparent = transparent; scene.render.resolution_x, scene.render.resolution_y = res; scene.render.resolution_percentage = 100
    scene.view_settings.view_transform = 'AgX'
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'METAL'; prefs.get_devices()
        for d in prefs.devices: d.use = True
        scene.cycles.device = 'GPU'
    except Exception: pass
    scene.render.image_settings.file_format = 'PNG'; scene.render.image_settings.color_mode = 'RGBA' if transparent else 'RGB'


def studio(scene, target, fwd, grey=0.55):
    """Three soft lights around `target` and a gray world: a neutral review set, not the building's light."""
    side = Vector((-fwd.y, fwd.x, 0)); made = []
    for (off, e, col, sz) in ((fwd * 2.4 + side * 2.0 + Vector((0, 0, 1.4)), 520, (1, 0.96, 0.92), 2.2), (fwd * 2.0 - side * 2.6 + Vector((0, 0, 0.4)), 180, (0.88, 0.93, 1), 2.6), (-fwd * 2.4 + side * 0.8 + Vector((0, 0, 1.8)), 420, (1, 1, 1), 1.2)):
        d = bpy.data.lights.new('rv_light', 'AREA'); d.energy = e; d.color = col; d.size = sz; lo = bpy.data.objects.new('rv_light', d); scene.collection.objects.link(lo)
        lo.location = target + off; lo.rotation_euler = (target - lo.location).to_track_quat('-Z', 'Y').to_euler(); made.append(lo)
    w = bpy.data.worlds.new('rv_world'); scene.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs[0].default_value = (grey, grey, grey * 1.03, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.45
    return made


def camera(scene, eye, look, lens=70, ortho=None):
    cam = bpy.data.cameras.new('rv_cam'); co = bpy.data.objects.new('rv_cam', cam); scene.collection.objects.link(co)
    if ortho: cam.type = 'ORTHO'; cam.ortho_scale = ortho
    else: cam.lens = lens
    co.location = eye; co.rotation_euler = (Vector(look) - Vector(eye)).to_track_quat('-Z', 'Y').to_euler(); scene.camera = co
    return co


def aim(co, eye, look):
    co.location = eye; co.rotation_euler = (Vector(look) - Vector(eye)).to_track_quat('-Z', 'Y').to_euler()


def shot(scene, path):
    scene.render.filepath = path; bpy.ops.render.render(write_still=True)
