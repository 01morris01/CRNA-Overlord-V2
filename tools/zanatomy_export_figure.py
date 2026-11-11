"""zanatomy_export_figure.py: the atrium's standing figure, from Z-Anatomy (CC BY-SA 4.0; meshes from BodyParts3D, CC BY-SA 2.1 JP).
   blender -b --disable-autoexec --factory-startup Startup.blend --python tools/zanatomy_export_figure.py -- OBJECTS.json OUT.glb
Three meshes: `skeleton` (every bone and cartilage of the skeletal system), `nerves` (every nerve curve, as thin tubes) and
`skin` (the body-surface regions, welded; hair regions left out). OBJECTS.json is the object listing made earlier from the
same file (name, type, collections). Nothing is edited anatomically; this is a view-only piece and is labelled so."""
import bpy, bmesh, json, sys, os
A = sys.argv[sys.argv.index('--') + 1:]; LIST, OUT = json.load(open(A[0])), A[1]
suf = lambda n: n.rsplit('.', 1)[-1] if '.' in n else ''
want = {'skeleton': [], 'nerves': [], 'skin': []}
for o in LIST:
    top = [c for c in o['cols'] if c[:2] in ('1:', '7:', '9:')]
    if not top: continue
    if o['type'] == 'MESH' and any(c.startswith('1:') for c in top) and suf(o['name']) not in ('j', 't', 'i', 'g') and o.get('verts', 0) > 40: want['skeleton'].append(o['name'])
    if o['type'] == 'CURVE' and any(c.startswith('7:') for c in top): want['nerves'].append(o['name'])
    if o['type'] == 'MESH' and any(c.startswith('9:') for c in top) and suf(o['name']) in ('l', 'r', '') and 'air' not in o['name'].lower() and o.get('verts', 0) > 20: want['skin'].append(o['name'])
made = []
for key, names in want.items():
    bm = bmesh.new(); n = 0
    for name in names:
        o = bpy.data.objects.get(name)
        if o is None: continue
        if o.type == 'CURVE': o.data.bevel_depth = 0.0013; o.data.bevel_resolution = 0; o.data.resolution_u = 4; o.data.use_fill_caps = True
        try: me = o.to_mesh()
        except Exception as e: print('skip', name, e); continue
        if me is None or not len(me.vertices): o.to_mesh_clear(); continue
        tmp = bmesh.new(); tmp.from_mesh(me); tmp.transform(o.matrix_world); t2 = bpy.data.meshes.new('t'); tmp.to_mesh(t2); tmp.free(); bm.from_mesh(t2); bpy.data.meshes.remove(t2); o.to_mesh_clear(); n += 1
    if key == 'skin': bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.0006)
    for f in bm.faces: f.smooth = True
    me = bpy.data.meshes.new(key); bm.to_mesh(me); bm.free(); ob = bpy.data.objects.new(key, me); bpy.context.scene.collection.objects.link(ob); made.append(ob)
    for layer in list(me.uv_layers): me.uv_layers.remove(layer)
    while me.materials: me.materials.pop()
    tris0 = sum(len(p.vertices) - 2 for p in me.polygons)
    budget = {'skeleton': 150000, 'nerves': 90000, 'skin': 60000}[key]
    if tris0 > budget:
        bpy.context.view_layer.objects.active = ob; d = ob.modifiers.new('d', 'DECIMATE'); d.ratio = budget / tris0; bpy.ops.object.modifier_apply({'object': ob}, modifier='d') if False else None
        with bpy.context.temp_override(object=ob, active_object=ob, selected_objects=[ob]): bpy.ops.object.modifier_apply(modifier='d')
    print('PART', key, 'objects', n, 'of', len(names), 'tris', tris0, '->', sum(len(p.vertices) - 2 for p in ob.data.polygons), 'z', round(min(v.co.z for v in ob.data.vertices), 3), round(max(v.co.z for v in ob.data.vertices), 3))
for o in bpy.data.objects: o.select_set(False)
for o in made: o.hide_set(False); o.select_set(True)
bpy.context.view_layer.objects.active = made[0]
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_yup=True, export_apply=True, export_normals=True, export_texcoords=False, export_materials='NONE', export_draco_mesh_compression_enable=True, export_draco_position_quantization=14, export_draco_normal_quantization=10)
print('EXPORTED', OUT, os.path.getsize(OUT))
