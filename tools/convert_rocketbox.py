"""convert_rocketbox.py: Microsoft Rocketbox avatars (MIT licence) -> one GLB each with Idle, Walk and Brisk clips, plus a portrait.
   blender -b --factory-startup --python tools/convert_rocketbox.py -- ROCKETBOX_DIR OUT_DIR [only_name]
ROCKETBOX_DIR holds <Avatar>/<Avatar>.fbx with its .tga textures and anim/*.fbx (see fetch.sh beside the downloads).

The library's clips are stored relative to their own rigs' rest poses, which differ from the avatars' bind pose, so copying the
curves gives wrong limbs. Each clip is therefore re-baked: per frame, every avatar bone takes the WORLD rotation of the bone of
the same name in the animation rig; bone lengths stay the avatar's own; the hips follow the source scaled by leg length, with
the net travel of a walk removed so that it plays in place (the measured speed is written to characters.json)."""
import bpy, sys, os, json, math
from mathutils import Vector, Matrix, Quaternion
A = sys.argv[sys.argv.index('--') + 1:]; SRC, OUT = A[0], A[1]; ONLY = A[2] if len(A) > 2 else None
os.makedirs(OUT, exist_ok=True); TMP = os.path.join(OUT, '_tex'); os.makedirs(TMP, exist_ok=True)
CH = [('Medical_Female_01', 'f152', 'f', 'tunic'), ('Medical_Female_02', 'f153', 'f', 'coat'), ('Medical_Male_03', 'm153', 'm', 'longcoat'), ('Medical_Male_04', 'm162', 'm', 'scrubs')]
META = {}
def image(path, size, fmt, name):
    dst = os.path.join(TMP, name + ('.png' if fmt == 'PNG' else '.jpg'))
    if not os.path.exists(dst):
        im = bpy.data.images.load(path); im.scale(size, size); im.filepath_raw = dst; im.file_format = fmt; bpy.context.scene.render.image_settings.quality = 90; im.save(); bpy.data.images.remove(im)
    return bpy.data.images.load(dst, check_existing=True)
def chain(b):
    yield b
    for c in b.children: yield from chain(c)
def leg(arm):
    r = {b.name: b.matrix_local.translation for b in arm.data.bones}
    return (r['Bip01 L Calf'] - r['Bip01 L Thigh']).length + (r['Bip01 L Foot'] - r['Bip01 L Calf']).length
def rebake(tgt, src, name, in_place, scene):
    """Bake the source rig's motion onto the avatar as a new action; returns (action, seconds, speed m/s)."""
    f0, f1 = (int(v) for v in src.animation_data.action.frame_range); bones = [b for r in tgt.data.bones if r.parent is None for b in chain(r)]
    rest = {b.name: b.matrix_local.copy() for b in tgt.data.bones}; inv = tgt.matrix_world.inverted(); k = leg(tgt) / leg(src); S = []
    for f in range(f0, f1 + 1):
        scene.frame_set(f); bpy.context.view_layer.update(); S.append({b.name: (src.matrix_world @ src.pose.bones[b.name].matrix).copy() for b in bones if b.name in src.pose.bones})
    root = bones[0].name; p0, p1 = S[0][root].translation.copy(), S[-1][root].translation.copy(); travel = Vector((p1.x - p0.x, p1.y - p0.y, 0))
    act = bpy.data.actions.new(name); tgt.animation_data.action = act; prev = {}
    for i, fr in enumerate(S):
        M = {}
        for b in bones:
            pb = tgt.pose.bones[b.name]; pb.rotation_mode = 'QUATERNION'
            base = (M[b.parent.name] @ rest[b.parent.name].inverted() @ rest[b.name]) if b.parent else rest[b.name]
            q, loc = Quaternion(), Vector((0, 0, 0))
            if b.name in fr:
                want = inv @ fr[b.name]; q = base.to_quaternion().inverted() @ want.decompose()[1]
                if b.name in prev and q.dot(prev[b.name]) < 0: q.negate()
                if b.parent is None:
                    w = fr[b.name].translation.copy(); t = i / max(1, len(S) - 1)
                    if in_place: w -= travel * t
                    w = Vector((p0.x + (w.x - p0.x) * k, p0.y + (w.y - p0.y) * k, w.z * k)) if in_place else w * k
                    loc = base.inverted() @ (inv @ w)
            prev[b.name] = q.copy(); pb.rotation_quaternion = q; pb.location = loc; pb.keyframe_insert('rotation_quaternion', frame=i + 1)
            if b.parent is None: pb.keyframe_insert('location', frame=i + 1)
            M[b.name] = base @ Matrix.Translation(loc) @ q.to_matrix().to_4x4()
    secs = (f1 - f0) / scene.render.fps; act.use_fake_user = True
    return act, secs, (travel.length * k / secs if secs else 0.0)
for (name, code, sex, cid) in CH:
    if ONLY and ONLY != name: continue
    bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene; scene.render.fps = 30
    bpy.ops.import_scene.fbx(filepath=f'{SRC}/{name}/{name}.fbx'); scene.render.fps = 30
    arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE'); mesh = next(o for o in bpy.data.objects if o.type == 'MESH')
    for o in [o for o in bpy.data.objects if o.type == 'EMPTY']: bpy.data.objects.remove(o, do_unlink=True)
    for a in list(bpy.data.actions): bpy.data.actions.remove(a)
    # ---- materials: rebuilt, with the textures at a size a browser wants
    for m in mesh.data.materials:
        part = m.name.split('_')[-1]; nt = m.node_tree
        for n in list(nt.nodes): nt.nodes.remove(n)
        out = nt.nodes.new('ShaderNodeOutputMaterial'); b = nt.nodes.new('ShaderNodeBsdfPrincipled'); nt.links.new(b.outputs[0], out.inputs[0])
        if part == 'opacity':
            t = nt.nodes.new('ShaderNodeTexImage'); t.image = image(f'{SRC}/{name}/{code}_opacity_color.tga', 1024, 'PNG', f'{code}_opacity'); nt.links.new(t.outputs['Color'], b.inputs['Base Color']); nt.links.new(t.outputs['Alpha'], b.inputs['Alpha'])
            b.inputs['Roughness'].default_value = 0.55; m['part'] = 'hair'
            try: m.blend_method = 'HASHED'
            except Exception: pass
        else:
            size = 512 if part in ('stetoskop', 'protection') else 1024
            t = nt.nodes.new('ShaderNodeTexImage'); t.image = image(f'{SRC}/{name}/{code}_{part}_color.tga', size, 'JPEG', f'{code}_{part}_color'); nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
            n = nt.nodes.new('ShaderNodeTexImage'); n.image = image(f'{SRC}/{name}/{code}_{part}_normal.tga', size, 'JPEG', f'{code}_{part}_normal'); n.image.colorspace_settings.name = 'Non-Color'
            nm = nt.nodes.new('ShaderNodeNormalMap'); nt.links.new(n.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs[0], b.inputs['Normal'])
            b.inputs['Roughness'].default_value = 0.62 if part == 'head' else 0.78; m['part'] = {'stetoskop': 'kit', 'protection': 'kit'}.get(part, part)
        m.name = f'{cid}_{m["part"]}'
    # ---- clips, re-baked onto this avatar
    arm.animation_data_create(); info, acts = {}, {}
    for clip, fname, in_place in (('Idle', f'{sex}_idle_breathe_01', False), ('Walk', f'{sex}_walk_neutral_01', True), ('Brisk', f'{sex}_walk_fast_01', True)):
        bo, ba = set(bpy.data.objects), set(bpy.data.actions); bpy.ops.import_scene.fbx(filepath=f'{SRC}/anim/{fname}.fbx'); scene.render.fps = 30
        new_o = [o for o in bpy.data.objects if o not in bo]; src = next(o for o in new_o if o.type == 'ARMATURE')
        act, secs, speed = rebake(arm, src, clip, in_place, scene); acts[clip] = act; info[clip] = {'seconds': round(secs, 3), 'speed': round(speed, 3)}
        for o in new_o: bpy.data.objects.remove(o, do_unlink=True)
        for a in [a for a in bpy.data.actions if a not in ba and a is not act]: bpy.data.actions.remove(a)
    arm.animation_data.action = None
    for clip, act in acts.items():
        tr = arm.animation_data.nla_tracks.new(); tr.name = clip; st = tr.strips.new(clip, 1, act)
        if hasattr(st, 'action_slot') and getattr(act, 'slots', None): st.action_slot = act.slots[0]
        tr.mute = True
    def pose(clip, frame):
        a = acts[clip]; arm.animation_data.action = a
        if getattr(a, 'slots', None): arm.animation_data.action_slot = a.slots[0]
        scene.frame_set(frame); bpy.context.view_layer.update()
    # ---- measure: height and facing in the idle; how far the hips wander in the walk (they should stay near the spot)
    pose('Idle', 5); W = arm.matrix_world
    head = W @ arm.pose.bones['Bip01 Head'].head; eyes = (W @ arm.pose.bones['Bip01 LEye'].head + W @ arm.pose.bones['Bip01 REye'].head) / 2
    fwd = (eyes - head); fwd.z = 0; fwd.normalize(); ev = mesh.evaluated_get(bpy.context.evaluated_depsgraph_get()); zs = [(ev.matrix_world @ v.co).z for v in ev.data.vertices]; height = max(zs) - min(zs); feet = min(zs)
    hand = (W @ arm.pose.bones['Bip01 L Hand'].head); arm_drop = round((W @ arm.pose.bones['Bip01 L UpperArm'].head).z - hand.z, 3)
    pts = []
    for f in range(1, 36, 4): pose('Walk', f); pts.append((W @ arm.pose.bones['Bip01 Pelvis'].head).copy())
    wander = max((p - pts[0]).xy.length for p in pts)
    # ---- portrait: bust in the idle pose, soft key from the front-left, transparent ground
    pose('Idle', 20)
    scene.render.engine = 'CYCLES'; scene.cycles.samples = 64; scene.cycles.use_denoising = True; scene.render.film_transparent = True; scene.render.resolution_x, scene.render.resolution_y = 360, 440; scene.view_settings.view_transform = 'AgX'
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'METAL'; prefs.get_devices(); scene.cycles.device = 'GPU'
    except Exception: pass
    side = Vector((-fwd.y, fwd.x, 0)); tgt = Vector((head.x, head.y, head.z - 0.13)); cam = bpy.data.cameras.new('c'); cam.lens = 70; co = bpy.data.objects.new('c', cam); scene.collection.objects.link(co)
    co.location = tgt + fwd * 1.5 + side * 0.3 + Vector((0, 0, 0.04)); co.rotation_euler = (tgt - co.location).to_track_quat('-Z', 'Y').to_euler(); scene.camera = co
    for (off, e, col, sz) in ((fwd * 1.6 + side * 1.4 + Vector((0, 0, 1.0)), 260, (1, 0.95, 0.9), 1.6), (fwd * 1.2 - side * 1.8 + Vector((0, 0, 0.2)), 70, (0.85, 0.92, 1), 2.0), (-fwd * 1.6 + side * 0.6 + Vector((0, 0, 1.2)), 220, (1, 1, 1), 0.8)):
        d = bpy.data.lights.new('l', 'AREA'); d.energy = e; d.color = col; d.size = sz; lo = bpy.data.objects.new('l', d); scene.collection.objects.link(lo); lo.location = tgt + off; lo.rotation_euler = (tgt - lo.location).to_track_quat('-Z', 'Y').to_euler()
    w = bpy.data.worlds.new('w'); scene.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.5, 0.5, 0.52, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.35
    scene.render.image_settings.file_format = 'PNG'; scene.render.image_settings.color_mode = 'RGBA'; scene.render.filepath = os.path.join(OUT, cid + '.png'); bpy.ops.render.render(write_still=True)
    # a full-figure check sheet for whoever runs this: idle from the front, walk and brisk from the side
    scene.render.resolution_x, scene.render.resolution_y = 260, 420; scene.cycles.samples = 24; cam.type = 'ORTHO'; cam.ortho_scale = 2.2
    for clip, fr, v in (('Idle', 20, fwd), ('Walk', 9, side), ('Brisk', 9, side)):
        pose(clip, fr); c = W @ arm.pose.bones['Bip01 Pelvis'].head; co.location = Vector((c.x, c.y, 0.95)) + v * 6; co.rotation_euler = (Vector((c.x, c.y, 0.95)) - co.location).to_track_quat('-Z', 'Y').to_euler()
        scene.render.filepath = os.path.join(TMP, f'check_{cid}_{clip}.png'); bpy.ops.render.render(write_still=True)
    for o in [o for o in bpy.data.objects if o.type in ('LIGHT', 'CAMERA')]: bpy.data.objects.remove(o, do_unlink=True)
    # ---- export
    arm.animation_data.action = None
    for tr in arm.animation_data.nla_tracks: tr.mute = False
    scene.frame_set(1); bpy.ops.object.select_all(action='DESELECT'); arm.select_set(True); mesh.select_set(True); bpy.context.view_layer.objects.active = arm
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, cid + '.glb'), export_format='GLB', use_selection=True, export_yup=True, export_animations=True, export_animation_mode='NLA_TRACKS', export_skins=True,
                              export_force_sampling=True, export_optimize_animation_size=True, export_image_format='AUTO', export_extras=True, export_def_bones=False)
    META[cid] = {'file': cid + '.glb', 'portrait': cid + '.png', 'source': name, 'height': round(height, 3), 'feet_z': round(feet, 3), 'forward': [round(fwd.x, 3), 0, round(-fwd.y, 3)], 'clips': info, 'idle_arm_drop_m': arm_drop, 'walk_hip_wander_m': round(wander, 3), 'verts': len(mesh.data.vertices), 'tris': sum(len(p.vertices) - 2 for p in mesh.data.polygons)}
    print('DONE', cid, json.dumps(META[cid]))
p = os.path.join(OUT, 'characters.json'); old = json.load(open(p)) if os.path.exists(p) and ONLY else {}; old.update(META); json.dump(old, open(p, 'w'), indent=1)
