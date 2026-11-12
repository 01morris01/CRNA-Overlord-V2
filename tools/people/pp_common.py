"""pp_common.py: shared helpers for the patient figure scripts (imported by make_person.py and the review scripts).
These scripts run inside Blender with a private user folder, so nothing here touches the Blender settings of this computer:
   BLENDER_USER_RESOURCES=<people>/blender-user  blender -b --factory-startup --python tools/people/<script>.py -- ...
<people> is ~/Developer/overlord-asset-sources/people unless OVERLORD_PEOPLE says otherwise. tools/people/install_packs.py
fills that folder from the downloads. scipy and Pillow live in <people>/pydeps (installed for Blender's own Python)."""
import bpy, os, sys
import numpy as np
from mathutils import Matrix, Vector, Quaternion

PEOPLE = os.environ.get('OVERLORD_PEOPLE', os.path.expanduser('~/Developer/overlord-asset-sources/people'))
PYDEPS = os.path.join(PEOPLE, 'pydeps')
if PYDEPS not in sys.path:
    sys.path.append(PYDEPS)          # appended, so Blender's own numpy stays first
USERDATA = os.path.join(PEOPLE, 'blender-user', 'extensions', '.user', 'user_default', 'mpfb', 'data')


class _Mpfb:
    """The parts of the MakeHuman add-on (MPFB2) that the scripts call, loaded once."""
    def __init__(self):
        bpy.ops.preferences.addon_enable(module='bl_ext.user_default.mpfb')
        from bl_ext.user_default.mpfb.services.humanservice import HumanService
        from bl_ext.user_default.mpfb.services.targetservice import TargetService
        from bl_ext.user_default.mpfb.services.assetservice import AssetService
        from bl_ext.user_default.mpfb.services.faceservice import FaceService
        from bl_ext.user_default.mpfb.services.locationservice import LocationService
        from bl_ext.user_default.mpfb.services.logservice import LogService
        from bl_ext.user_default.mpfb.entities.objectproperties import HumanObjectProperties
        self.Human, self.Target, self.Asset, self.Face, self.Location, self.Props = HumanService, TargetService, AssetService, FaceService, LocationService, HumanObjectProperties
        try:
            LogService.set_default_log_level(LogService.WARN)     # the add-on is chatty at its default level
        except Exception:
            pass
        self.system_targets = LocationService.get_mpfb_data('targets')


_mpfb = None


def mpfb():
    global _mpfb
    if _mpfb is None:
        _mpfb = _Mpfb()
    return _mpfb


def args_after_dashes():
    return sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def get_co(mesh_or_key_data, n):
    a = np.empty(n * 3, np.float32)
    mesh_or_key_data.foreach_get('co', a)
    return a.reshape(-1, 3).astype(np.float64)


def mixed_coords(obj):
    """Vertex positions with the current shape-key mix applied (no modifiers)."""
    me = obj.data
    if not me.shape_keys:
        return get_co(me.vertices, len(me.vertices))
    k = obj.shape_key_add(name='__mix', from_mix=True)
    a = get_co(k.data, len(k.data))
    obj.shape_key_remove(k)
    return a


def deformed_coords(obj):
    """Vertex positions as displayed: shape keys at their current values, then the armature. World space."""
    dg = bpy.context.evaluated_depsgraph_get()
    ev = obj.evaluated_get(dg)
    me = ev.to_mesh()
    a = get_co(me.vertices, len(me.vertices))
    ev.to_mesh_clear()
    mw = np.array(obj.matrix_world)
    return a @ mw[:3, :3].T + mw[:3, 3]


def set_keys(obj, on=()):
    """Set the named shape keys to 1 and every other one to 0."""
    if obj.data.shape_keys:
        for k in obj.data.shape_keys.key_blocks[1:]:
            k.value = 1.0 if k.name in on else 0.0


def group_weights(obj, names):
    """Sum of the vertex-group weights of the named groups, per vertex."""
    idx = {g.index for g in obj.vertex_groups if g.name in names}
    w = np.zeros(len(obj.data.vertices))
    for v in obj.data.vertices:
        for g in v.groups:
            if g.group in idx:
                w[v.index] += g.weight
    return w


def rotate_bone(arm, name, quat, pivot=None):
    """Turn one pose bone (and so everything below it) by a rotation given in armature space, about the bone's head."""
    pb = arm.pose.bones[name]
    m = pb.matrix.copy()
    p = m.translation.copy() if pivot is None else Vector(pivot)
    pb.matrix = Matrix.Translation(p) @ quat.to_matrix().to_4x4() @ Matrix.Translation(-p) @ m
    bpy.context.view_layer.update()


def aim_bone(arm, name, tip_name, direction):
    """Turn a pose bone by the smallest rotation that makes the line from its head to another bone's head point along `direction`."""
    pb = arm.pose.bones[name]
    d0 = (arm.pose.bones[tip_name].head - pb.head).normalized()
    rotate_bone(arm, name, d0.rotation_difference(Vector(direction).normalized()))


def bisect(fn, lo, hi, iters=16):
    """Root of an increasing function between lo and hi (returns the nearer end if there is no sign change)."""
    flo, fhi = fn(lo), fn(hi)
    if flo >= 0:
        return lo
    if fhi <= 0:
        return hi
    for _ in range(iters):
        mid = 0.5 * (lo + hi)
        if fn(mid) < 0:
            lo = mid
        else:
            hi = mid
    return 0.5 * (lo + hi)


def new_mesh_object(name, verts, faces, uvs=None, smooth=True, collection=None):
    """A mesh object from arrays. `uvs` is one (u, v) per face corner, in face order."""
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], [tuple(int(i) for i in f) for f in faces])
    me.update()
    if uvs is not None:
        layer = me.uv_layers.new(name='UVMap')
        layer.data.foreach_set('uv', np.asarray(uvs, np.float32).reshape(-1))
    if smooth:
        me.polygons.foreach_set('use_smooth', [True] * len(me.polygons))
    ob = bpy.data.objects.new(name, me)
    (collection or bpy.context.scene.collection).objects.link(ob)
    return ob


def add_shape(obj, name, coords):
    """Add a shape key holding the given positions (creates the basis key first if needed)."""
    if not obj.data.shape_keys:
        obj.shape_key_add(name='Basis', from_mix=False)
    k = obj.shape_key_add(name=name, from_mix=False)
    k.data.foreach_set('co', np.asarray(coords, np.float32).reshape(-1))
    k.value = 0.0
    return k


def use_gpu(scene, samples=96):
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'METAL'
        prefs.get_devices()
        for d in prefs.devices:
            d.use = True
        scene.cycles.device = 'GPU'
    except Exception as e:
        print('GPU not used:', e)
