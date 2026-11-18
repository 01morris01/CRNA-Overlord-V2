"""review_hands.py: every hand pose rendered holding its real item at true scale (Cycles).

   blender -b --factory-startup --python tools/props/airway/review_hands.py -- HANDS.blend ASSETDIR OUTDIR [pose ...]

The hands .blend is the one build_hands.py saves (authored in the glTF frame). Items are imported from ASSETDIR and placed
so that their anchor empty coincides with the hand's grip anchor (the same rule the runtime uses, see hands.json). One view
is from about where a standing clinician's eyes would be (behind and above the hand, along the forearm); one is a check view
from the palm side."""
import bpy, os, sys, math
from mathutils import Matrix, Vector

ITEMS = {   # pose: (grip anchor, file, item anchor, extra node offsets in the item's own frame)
    'syringe_hold': ('grip_syringe', 'syringe_10ml.glb', 'flange', {'plunger': (0, 0, -4 * 0.0060558)}),
    'syringe_push': ('grip_syringe', 'syringe_10ml.glb', 'flange', {'plunger': (0, 0, -2 * 0.0060558)}),
    'mask_ce': ('grip_mask', 'face_mask_adult.glb', 'seat', {}),
    'bag_squeeze_open': ('grip_bag', 'reservoir_bag_3l.glb', 'squeeze_center', {}),
    'bag_squeeze_closed': ('grip_bag', 'reservoir_bag_3l.glb', 'squeeze_center', {}, {'squeeze': 1.0}),
    'laryngoscope_grip': ('grip_laryngoscope', 'laryngoscope_mac.glb', 'grip', {}),
    'pinch': ('grip_pinch', None, None, {}),
}
# camera direction from the grip point, in the hand frame (left hand), and distance: an eye behind and above the hand
EYE = {'default': ((0.55, 0.45, 0.70), 0.40), 'mask_ce': ((0.1, 0.85, 0.5), 0.45), 'bag_squeeze_open': ((0.3, 0.6, 0.7), 0.55),
       'bag_squeeze_closed': ((0.3, 0.6, 0.7), 0.55), 'laryngoscope_grip': ((0.6, 0.35, 0.72), 0.48)}
FIX = Matrix.Rotation(math.radians(-90), 4, 'X')       # imported (Z-up) -> authored glTF frame (Y-up)


def setup():
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = 40; sc.cycles.use_denoising = True
    try:
        p = bpy.context.preferences.addons['cycles'].preferences; p.compute_device_type = 'METAL'; p.get_devices(); [setattr(d, 'use', True) for d in p.devices]; sc.cycles.device = 'GPU'
    except Exception: pass
    sc.render.resolution_x, sc.render.resolution_y = 900, 675; sc.view_settings.view_transform = 'AgX'; sc.view_settings.exposure = -0.6
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; env = w.node_tree.nodes.new('ShaderNodeTexEnvironment')
    env.image = bpy.data.images.load(os.path.expanduser('~/Developer/overlord-asset-sources/polyhaven/hdri/studio_small_09_2k.hdr'))
    w.node_tree.links.new(env.outputs[0], w.node_tree.nodes['Background'].inputs[0]); w.node_tree.nodes['Background'].inputs[1].default_value = 0.7
    cam = bpy.data.cameras.new('c'); cam.lens = 35; co = bpy.data.objects.new('c', cam); sc.collection.objects.link(co); sc.camera = co; cam.clip_start = 0.01
    return co


def look(co, target, d, dist, up=(0, 1, 0)):
    d = Vector(d).normalized(); co.location = Vector(target) + d * dist
    z = d; x = Vector(up).cross(z).normalized(); y = z.cross(x); co.rotation_euler = Matrix((x, y, z)).transposed().to_euler()


def place_item(path, item_anchor, target, offsets):
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=path); new = [o for o in bpy.data.objects if o not in before]
    fix = bpy.data.objects.new('fix', None); bpy.context.scene.collection.objects.link(fix)
    for o in new:
        if o.parent is None: o.parent = fix
    fix.matrix_world = FIX; bpy.context.view_layer.update()
    by = {o.name: o for o in new}
    for n, t in offsets.items():
        if n in by: by[n].location = by[n].location + Vector((t[0], -t[2], t[1]))
    bpy.context.view_layer.update()
    A = by[item_anchor].matrix_world.copy() @ FIX.inverted()   # the anchor's glTF frame (Blender's importer conjugates node frames by the axis turn)
    fix.matrix_world = target @ A.inverted() @ FIX; bpy.context.view_layer.update()
    return new + [fix]


def main():
    a = sys.argv[sys.argv.index('--') + 1:]; blend, assets, out = a[0], a[1], a[2]; only = a[3:]
    bpy.ops.wm.open_mainfile(filepath=blend); co = setup(); os.makedirs(out, exist_ok=True)
    arms = {s: bpy.data.objects['hand_' + s] for s in ('L', 'R')}
    names = [t.name for t in arms['L'].animation_data.nla_tracks if '.' not in t.name]
    for pose in names:
        if only and pose not in only: continue
        for s, ao in arms.items():
            for t in ao.animation_data.nla_tracks: t.mute = (t.name != pose)
        bpy.context.scene.frame_set(1); bpy.context.view_layer.update()
        for side in ('L', 'R'):
            other = 'R' if side == 'L' else 'L'
            for o in bpy.data.objects:
                if o.name.endswith('_' + other) or o.name.endswith('.' + other): o.hide_render = True
                elif o.name.endswith('_' + side) or o.name.endswith('.' + side): o.hide_render = False
            ao = arms[side]; H = ao.matrix_world
            added = []
            it = ITEMS.get(pose)
            gp = H.translation
            if it and it[1]:
                g = bpy.data.objects.get('%s.%s' % (it[0], side))
                if g:
                    T = g.matrix_world.copy(); added = place_item(os.path.join(assets, it[1]), it[2], T, it[3]); gp = T.translation
                    for o in added:
                        if len(it) > 4 and o.type == 'MESH' and o.data.shape_keys:
                            for k, w in it[4].items():
                                if k in o.data.shape_keys.key_blocks: o.data.shape_keys.key_blocks[k].value = w
            elif it:
                g = bpy.data.objects.get('%s.%s' % (it[0], side))
                if g:
                    T = g.matrix_world.copy(); gp = T.translation
                    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.016, depth=0.026); k = bpy.context.object
                    k.matrix_world = T @ Matrix.Translation((0, 0, -0.013 - 0.010)); added = [k]
            d, dist = EYE.get(pose, EYE['default']); sgn = 1 if side == 'L' else -1
            look(co, gp, (H.to_3x3() @ Vector((d[0] * sgn, d[1], d[2]))), dist)
            bpy.context.scene.render.filepath = os.path.join(out, 'hand_%s_%s_eye.png' % (pose, side)); bpy.ops.render.render(write_still=True)
            look(co, gp, (H.to_3x3() @ Vector((0.35 * sgn, -0.85, 0.15))), dist * 0.85)
            bpy.context.scene.render.filepath = os.path.join(out, 'hand_%s_%s_palm.png' % (pose, side)); bpy.ops.render.render(write_still=True)
            for o in added: bpy.data.objects.remove(o)
            print('RENDERED', pose, side)


if __name__ == '__main__':
    main()
