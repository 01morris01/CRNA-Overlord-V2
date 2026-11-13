"""pp_export.py: pictures, materials and the file itself. Used by make_person.py.
The browser wants plain metallic-roughness materials and nothing see-through that needs sorting. Hair and lashes are
cut-outs (alpha test). Blender's exporter decides the alpha mode from the node set-up in ways that have changed between
versions, so the exported file's own material table is set here afterwards, by name, where it cannot be misread."""
import bpy, os, json, struct
import numpy as np
from PIL import Image


def save_png(path, arr):
    """arr: floats 0..1, (h, w, 3 or 4), row 0 at the top."""
    a = (np.clip(arr, 0, 1) * 255 + 0.5).astype(np.uint8)
    Image.fromarray(a, 'RGBA' if a.shape[2] == 4 else 'RGB').save(path)
    return path


def load_rgba(path, size=None):
    """A picture file as floats 0..1 with an alpha channel, optionally resized to (width, height)."""
    im = Image.open(path).convert('RGBA')
    if size is not None and im.size != tuple(size):
        im = im.resize(tuple(size), Image.LANCZOS)
    return np.asarray(im, np.float64) / 255.0


def make_material(name, color=None, image=None, normal=None, rough=0.6, cutout=False, two_sided=False, normal_strength=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = 0.0
    if color is not None:
        b.inputs['Base Color'].default_value = (*color, 1.0)
    if image is not None:
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = image
        nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
        if cutout:
            nt.links.new(t.outputs['Alpha'], b.inputs['Alpha'])
    if normal is not None:
        t2 = nt.nodes.new('ShaderNodeTexImage'); t2.image = normal
        normal.colorspace_settings.name = 'Non-Color'
        nm = nt.nodes.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = normal_strength
        nt.links.new(t2.outputs['Color'], nm.inputs['Color'])
        nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    m.use_backface_culling = not two_sided
    m['cutout'] = bool(cutout)
    m['two_sided'] = bool(two_sided)
    return m


def set_vertex_alpha(ob, alpha):
    """Give a mesh a per-vertex opacity (stored as a white vertex color with alpha). With a cut-out material this makes
    the mesh thin out toward chosen vertices instead of ending at a hard polygon edge."""
    attr = ob.data.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
    data = np.ones((len(ob.data.vertices), 4), np.float32)
    data[:, 3] = np.asarray(alpha, np.float32)
    attr.data.foreach_set('color', data.ravel())
    ob.data.color_attributes.active_color = attr
    ob.data.color_attributes.render_color_index = 0


def patch_glb(path, cutouts, two_sided, cutoff=0.4):
    """Open the exported file's table of contents and set, by material name: alpha test for the cut-out materials,
    opaque for all others, and which materials are drawn from both sides."""
    with open(path, 'rb') as f:
        data = f.read()
    magic, version, length = struct.unpack_from('<4sII', data, 0)
    assert magic == b'glTF'
    clen, ctype = struct.unpack_from('<I4s', data, 12)
    assert ctype == b'JSON'
    doc = json.loads(data[20:20 + clen].decode('utf8'))
    rest = data[20 + clen:]
    for m in doc.get('materials', []):
        nm = m.get('name', '')
        if nm in cutouts:
            m['alphaMode'] = 'MASK'; m['alphaCutoff'] = cutouts[nm] if isinstance(cutouts, dict) else cutoff
        else:
            m.pop('alphaMode', None); m.pop('alphaCutoff', None)
        m['doubleSided'] = nm in two_sided
    js = json.dumps(doc, separators=(',', ':')).encode('utf8')
    js += b' ' * ((4 - len(js) % 4) % 4)
    out = struct.pack('<4sII', b'glTF', 2, 12 + 8 + len(js) + len(rest)) + struct.pack('<I4s', len(js), b'JSON') + js + rest
    with open(path, 'wb') as f:
        f.write(out)
    return doc


def decimate(verts, faces, uvs, ratio):
    """Thin a mesh (positions, faces, one uv per face corner) with Blender's own edge-collapse; returns the same three."""
    me = bpy.data.meshes.new('tmp_dec')
    me.from_pydata([tuple(v) for v in verts], [], [tuple(int(i) for i in f) for f in faces])
    me.update()
    layer = me.uv_layers.new(name='UVMap')
    layer.data.foreach_set('uv', np.asarray(uvs, np.float32).reshape(-1))
    ob = bpy.data.objects.new('tmp_dec', me)
    bpy.context.scene.collection.objects.link(ob)
    mod = ob.modifiers.new('d', 'DECIMATE'); mod.ratio = ratio; mod.use_collapse_triangulate = True
    dg = bpy.context.evaluated_depsgraph_get()
    ev = ob.evaluated_get(dg)
    m2 = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=True, depsgraph=dg)
    V = np.empty(len(m2.vertices) * 3, np.float32); m2.vertices.foreach_get('co', V)
    F = [tuple(p.vertices) for p in m2.polygons]
    uvd = m2.uv_layers.active.data
    UV = [tuple(uvd[l].uv) for p in m2.polygons for l in p.loop_indices]
    bpy.data.objects.remove(ob, do_unlink=True); bpy.data.meshes.remove(me); bpy.data.meshes.remove(m2)
    return V.reshape(-1, 3).astype(np.float64), F, UV
