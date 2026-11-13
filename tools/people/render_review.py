"""render_review.py: review pictures of finished patient files, rendered with Cycles under one fixed, soft light.
   blender -b --factory-startup --python tools/people/render_review.py -- OUT.jpg [options] FILE.glb [FILE.glb ...]
Options:
   --views face,full          which pictures per patient, left to right. face: head and shoulders from about 40 cm;
                              three: the same from the side; full: the whole person; top: from straight above; crown: from behind the head
   --morph eyesClosed=1       set a morph target on every mesh that has it (may be repeated)
   --size 640                 height of one picture in pixels
   --samples 96               Cycles samples
   --label                    write the file name under each row
   --flat                     light from everywhere and no lamps, as in the browser's room (shows what is baked into the colors)
What is rendered is the file the browser will load (it is imported, not rebuilt), so this shows the delivered result.
The light is a large soft key above and to one side, a weaker fill from the other side, and a neutral gray room."""
import bpy, os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Vector
import pp_common as C
from PIL import Image, ImageDraw

A = C.args_after_dashes()
OUT = A[0]
views, morphs, size, samples, label, flat, files = ['face', 'full'], {}, 640, 96, False, False, []
i = 1
while i < len(A):
    if A[i] == '--views': views = A[i + 1].split(','); i += 2
    elif A[i] == '--morph': k, v = A[i + 1].split('='); morphs[k] = float(v); i += 2
    elif A[i] == '--size': size = int(A[i + 1]); i += 2
    elif A[i] == '--samples': samples = int(A[i + 1]); i += 2
    elif A[i] == '--label': label = True; i += 1
    elif A[i] == '--flat': flat = True; i += 1
    else: files.append(A[i]); i += 1
ASPECT = {'face': 1.0, 'three': 1.0, 'full': 1.9, 'top': 0.55, 'crown': 1.0, 'mouth': 1.0, 'room': 1.3, 'bedside': 1.3}


def render_one(path, tmp):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=path)
    obs = {o.name: o for o in scene.objects if o.type == 'MESH'}
    for o in obs.values():
        if o.data.shape_keys:
            for kb in o.data.shape_keys.key_blocks[1:]:
                kb.value = morphs.get(kb.name, 0.0)
    bpy.context.view_layer.update()

    def bbox(o):
        pts = [o.matrix_world @ Vector(c) for c in o.bound_box]
        return Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts))), Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    if 'eyes' in obs:
        lo, hi = bbox(obs['eyes'])
        eye = (lo + hi) / 2
    else:                                                 # a file without separate eyes (the first patient): find the nose tip at the head end and step back to the eyes
        best = None
        for o in obs.values():
            for v in o.data.vertices:
                p = o.matrix_world @ v.co
                if best is None or p.y > best[0]:
                    best = (p.y, None)
        ymax = best[0]; tip = None
        for o in obs.values():
            for v in o.data.vertices:
                p = o.matrix_world @ v.co
                if p.y > ymax - 0.26 and (tip is None or p.z > tip.z):
                    tip = p.copy()
        eye = tip + Vector((0, 0.035, -0.028))
    allp = [bbox(o) for o in obs.values()]
    blo = Vector((min(b[0].x for b in allp), min(b[0].y for b in allp), min(b[0].z for b in allp)))
    bhi = Vector((max(b[1].x for b in allp), max(b[1].y for b in allp), max(b[1].z for b in allp)))
    length = bhi.y - blo.y
    f = 0.42 + 0.58 * max(0.3, min(1.0, length / 1.8))    # children are framed somewhat closer, but a child's head is not that much smaller
    C.use_gpu(scene, samples)
    scene.view_settings.view_transform = 'Standard'
    w = bpy.data.worlds.new('w'); scene.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs[0].default_value = (0.42, 0.43, 0.45, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.55

    def light(loc, energy, sz, color, target):
        d = bpy.data.lights.new('l', 'AREA'); d.energy = energy; d.size = sz; d.color = color
        o = bpy.data.objects.new('l', d); scene.collection.objects.link(o); o.location = loc
        o.rotation_euler = (Vector(target) - o.location).to_track_quat('-Z', 'Y').to_euler()
    if flat:                                              # the browser's room: light from everywhere, no lamp, hardly any shading
        w.node_tree.nodes['Background'].inputs[0].default_value = (0.9, 0.9, 0.9, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 1.0
    else:
        light(eye + Vector((0.9, -0.5, 1.5)), 62, 1.4, (1.0, 0.97, 0.94), eye)              # key
        light(eye + Vector((-1.3, 0.2, 0.9)), 16, 1.8, (0.93, 0.96, 1.0), eye)              # fill
        light(Vector((0.3, -0.4, 2.2)), 46, 2.5, (1, 1, 1), (0, -0.2, 0))                   # the room's own light on the body
    me = bpy.data.meshes.new('table'); me.from_pydata([(-1.5, -2.0, -0.002), (1.5, -2.0, -0.002), (1.5, 2.0, -0.002), (-1.5, 2.0, -0.002)], [], [(0, 1, 2, 3)])
    tb = bpy.data.objects.new('table', me); scene.collection.objects.link(tb)
    tm = bpy.data.materials.new('table'); tm.use_nodes = True
    tm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.36, 0.38, 0.40, 1); tm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.8
    me.materials.append(tm)
    cam = bpy.data.cameras.new('c'); co = bpy.data.objects.new('c', cam); scene.collection.objects.link(co); scene.camera = co
    out = []
    Y, Z = Vector((0, 1, 0)), Vector((0, 0, 1))
    for v in views:
        cam.type = 'PERSP'
        if v == 'face':                                    # from above the face, the top of the head at the top of the picture
            tgt = eye + Vector((0, -0.035 * f, 0)); loc = tgt + Vector((0.05, 0.03, 0.40)) * max(f, 0.6); cam.lens = 58; up = Y
        elif v == 'three':
            tgt = eye + Vector((0, -0.035 * f, -0.02)); loc = tgt + Vector((0.30, -0.02, 0.27)) * max(f, 0.6); cam.lens = 58; up = Y
        elif v == 'crown':                                 # where the anesthetist stands: behind the head, looking down the body
            tgt = eye + Vector((0, -0.06 * f, -0.02)); loc = tgt + Vector((0.0, 0.42, 0.26)) * max(f, 0.6); cam.lens = 50; up = Z
        elif v == 'room':                                  # the room's held camera: above the chest, under a meter from the face, looking toward the head
            tgt = eye + Vector((0, -0.05 * f, 0.0)); loc = tgt + Vector((0.0, -0.42, 0.62)) * max(f, 0.6); cam.lens = 45; up = Y
        elif v == 'bedside':                               # standing beside the bed at about 1.5 m
            tgt = eye + Vector((0, -0.25 * f, -0.05)); loc = tgt + Vector((1.05, -0.35, 1.0)); cam.lens = 55; up = Z
        elif v == 'mouth':
            tgt = eye + Vector((0, -0.075 * f, 0.0)); loc = tgt + Vector((0.0, -0.20, 0.18)) * max(f, 0.6); cam.lens = 70; up = Y
        elif v == 'full':                                  # from the patient's left, the head to the right of the picture
            tgt = Vector((0, 0.0, 0.06 * f)); loc = Vector((1.75, -0.25, 1.55)) * max(f, 0.4); cam.lens = 36; up = Z
        else:
            cam.type = 'ORTHO'; cam.ortho_scale = max(length * 1.08, 0.6); tgt = Vector((0, 0, 0)); loc = Vector((0, 0, 3)); up = Y
        fwd = (tgt - loc).normalized()
        right = fwd.cross(up).normalized()
        upv = right.cross(fwd)
        from mathutils import Matrix
        co.matrix_world = Matrix(((right.x, upv.x, -fwd.x, loc.x), (right.y, upv.y, -fwd.y, loc.y), (right.z, upv.z, -fwd.z, loc.z), (0, 0, 0, 1)))
        scene.render.resolution_y = size; scene.render.resolution_x = int(size * ASPECT.get(v, 1.0))
        scene.render.filepath = f'{tmp}_{v}.png'
        bpy.ops.render.render(write_still=True)
        out.append(Image.open(scene.render.filepath).convert('RGB'))
    return out


rows = []
tmp = os.path.splitext(OUT)[0] + '_tmp'
for p in files:
    ims = render_one(p, tmp)
    wtot = sum(im.width for im in ims)
    row = Image.new('RGB', (wtot, size + (22 if label else 0)), (24, 24, 24))
    x = 0
    for im in ims:
        row.paste(im, (x, 0)); x += im.width
    if label:
        ImageDraw.Draw(row).text((6, size + 4), os.path.basename(p) + ('   ' + ' '.join(f'{k}={v:g}' for k, v in morphs.items()) if morphs else ''), fill=(235, 235, 235))
    rows.append(row)
sheet = Image.new('RGB', (max(r.width for r in rows), sum(r.height for r in rows)), (24, 24, 24))
y = 0
for r in rows:
    sheet.paste(r, (0, y)); y += r.height
sheet.save(OUT, quality=92)
for v in views:
    try:
        os.remove(f'{tmp}_{v}.png')
    except OSError:
        pass
print('REVIEW', OUT, sheet.size)
