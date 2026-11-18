"""build_iv.py: the IV access at a right antecubital vein: a 20 gauge catheter hub with integrated wings and extension tubing
(adapted from "Peripheral venous catheter" by scratchi, CC BY 4.0), its slide clamp and Luer end, plus what that model does
not have (authored here): the needleless injection port (split-septum valve), the cannula, and a clear IV dressing that drapes
over the hub.

   blender -b --factory-startup --python tools/props/airway/build_iv.py -- SOURCE.glb OUTDIR

Changes to the source: the needle, needle grip, grip plate and protective cap are removed (the catheter is in the vein); the
wings are lowered to the bottom of the hub (they lie on the skin); the gauge parts are recolored pink (20 G); the clamp is
white; heavy parts are thinned; everything is wrapped onto a 45 mm radius forearm.

Frame (meters, glTF): origin = the skin puncture; +Z runs along the forearm toward the shoulder (the catheter points that
way, into the vein); +Y is out of the skin at the puncture; the arm surface is a cylinder of radius ARM_R about the line
x=0, y=-ARM_R. Nodes: iv_port (root) > catheter (hub, wings, cannula), dressing, extension (tubing, clamp, Luer, valve),
port (empty at the valve's septum, +Z = the direction a syringe tip moves as it enters)."""
import bpy, bmesh, sys, os, math, json
import numpy as np
from mathutils import Matrix, Vector
from mathutils.bvhtree import BVHTree
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kit
from kit import MM

ARM_R = 0.045
SKIN_Z = -4.3                       # source units (mm): the bottom of the hub
INSERT_X = 16.7                     # source: the puncture is 3 mm in front of the hub nose


def src_to_local():
    """Source (Blender import, mm, lying in its XY plane) -> iv_port frame (m, glTF)."""
    R = Matrix(((0, 1, 0, 0), (0, 0, 1, 0), (1, 0, 0, 0), (0, 0, 0, 1)))
    return Matrix.Diagonal((MM, MM, MM, 1)) @ R @ Matrix.Translation((-INSERT_X, 0, -SKIN_Z))


def wrap(o, R=ARM_R):
    """Bend a mesh round the forearm: x along the skin becomes arc length."""
    for v in o.data.vertices:
        x, y, z = v.co; th = x / R; r = R + y; v.co = (r * math.sin(th), r * math.cos(th) - R, z)
    o.data.update(); return o


def bring(path):
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=path); new = [o for o in bpy.data.objects if o not in before]
    bpy.context.view_layer.update(); out = {}
    for o in new:
        if o.type != 'MESH': continue
        o.data = o.data.copy(); o.data.transform(o.matrix_world); o.parent = None; o.matrix_world = Matrix.Identity(4)
        out[o.name.split('_catheter')[0]] = o
    for o in new:
        if o.type != 'MESH': bpy.data.objects.remove(o)
    return out


def thin(o, ratio):
    m = o.modifiers.new('d', 'DECIMATE'); m.ratio = ratio; kit.apply_mods(o); return o


def valve(mat_body, mat_septum):
    """A split-septum needleless connector (Q-Syte type), axis +Y, male Luer at y=0 going -y, septum face at the top."""
    body = kit.lathe('valve_body', kit.fillet([(1.0, -7.5, 0), (2.0, -7.5, 0.2), (2.2, 0, 0), (3.3, 0.0, 0.3), (4.6, 0.8, 0.5), (4.6, 4.0, 0.6), (4.0, 4.8, 0.4), (4.0, 9.0, 0.4),
                                                (4.6, 10.0, 0.6), (4.6, 13.0, 0.6), (3.9, 14.2, 0.5), (3.9, 15.2, 0.3), (3.0, 15.4, 0)], r=0.3, n=2), seg=40, mat=mat_body, sharp_deg=45)
    sep = kit.lathe('valve_septum', kit.fillet([(0, 15.55, 0), (2.9, 15.5, 0.4), (3.0, 15.0, 0)], r=0.3, n=2), seg=40, mat=mat_septum)
    slit = kit.box('slit', (0.25, 0.08, 2.6), center=(0, 15.56, 0), bevel=0, mat=kit.M('plastic_dark'))
    grip = []
    for k in range(12):                                     # finger ribs on the collar
        a = k * kit.TAU / 12
        b = kit.box('rib%d' % k, (0.8, 2.6, 0.8), center=(4.7 * math.sin(a), 11.5, 4.7 * math.cos(a)), bevel=0.2, seg=1, mat=mat_body)
        b.data.transform(Matrix.Translation((4.7 * math.sin(a), 11.5, 4.7 * math.cos(a))) @ Matrix.Rotation(a, 4, 'Y') @ Matrix.Translation((-4.7 * math.sin(a), -11.5, -4.7 * math.cos(a))))
        grip.append(b)
    return [body, sep, slit] + grip, 15.55


def dressing(parts, film, border, label, W=70.0, L=85.0, zc=-20.0, nx=44, nz=54):
    """A transparent IV dressing (7 x 8.5 cm, Tegaderm I.V. size) centered over the hub, its film draped over whatever is
    under it (raycast down onto the hub, wings and tubing, then relaxed to a ~35 degree tent), with a cloth border, a notch
    at the distal edge for the tubing and a label strip. Built flat in the local frame before wrapping (mm)."""
    bm = bmesh.new()
    for o in parts: bm.from_mesh(o.data)
    bvh = BVHTree.FromBMesh(bm); bm.free()
    xs = np.linspace(-W / 2, W / 2, nx + 1); zs = np.linspace(zc - L / 2, zc + L / 2, nz + 1); H = np.zeros((nz + 1, nx + 1))
    for i, z in enumerate(zs):
        for j, x in enumerate(xs):
            hit = bvh.ray_cast(Vector((x * MM, 0.03, z * MM)), Vector((0, -1, 0)))
            if hit[0] is not None: H[i, j] = max(0.0, hit[0].y / MM + 0.25)
    # tent: the film cannot follow a step; let it fall off at about 35 degrees from anything it covers
    dx = xs[1] - xs[0]; dz = zs[1] - zs[0]; slope = math.tan(math.radians(35))
    for _ in range(60):
        Hn = H.copy()
        Hn[1:, :] = np.maximum(Hn[1:, :], H[:-1, :] - slope * dz); Hn[:-1, :] = np.maximum(Hn[:-1, :], H[1:, :] - slope * dz)
        Hn[:, 1:] = np.maximum(Hn[:, 1:], H[:, :-1] - slope * dx); Hn[:, :-1] = np.maximum(Hn[:, :-1], H[:, 1:] - slope * dx)
        if np.allclose(Hn, H): break
        H = Hn
    H = H + 0.08
    def notch(x, z): return abs(x) < 5.5 and z < zc - L / 2 + 14.0
    bm = bmesh.new(); uv = bm.loops.layers.uv.new('UVMap'); V = [[bm.verts.new((x * MM, H[i, j] * MM, z * MM)) for j, x in enumerate(xs)] for i, z in enumerate(zs)]
    bord = []
    for i in range(nz):
        for j in range(nx):
            xm, zm = (xs[j] + xs[j + 1]) / 2, (zs[i] + zs[i + 1]) / 2
            if notch(xm, zm): continue
            f = bm.faces.new([V[i][j], V[i][j + 1], V[i + 1][j + 1], V[i + 1][j]])
            edge = min(xm + W / 2, W / 2 - xm, zm - (zc - L / 2), (zc + L / 2) - zm) < 7.0 or (abs(xm) < 11.5 and zm < zc - L / 2 + 20.0)
            lab = (zc + L / 2) - zm < 16.0 and abs(xm) < W / 2 - 7.0
            f.material_index = 2 if lab else (1 if edge else 0)
            for l, (a, b) in zip(f.loops, [(j, i), (j + 1, i), (j + 1, i + 1), (j, i + 1)]): l[uv].uv = (a / nx, b / nz)
    me = bpy.data.meshes.new('dressing'); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    for m in (film, border, label): me.materials.append(m)
    return kit._obj('dressing', me)


def build(src, outdir):
    kit.reset()
    P = bring(src)
    for k in ('Line002', 'Line003', 'Box002', 'Object001', 'Object002'):           # needle, grip, grip plate, cap
        bpy.data.objects.remove(P.pop(k))
    hub, wings, tubing, clamp, luer = P['Cylinder001'], P['Line001'], P['Line004'], P['Line005'], P['Cylinder003']
    wings.data.transform(Matrix.Translation((0, 0, SKIN_Z + 0.35)))                    # wings down onto the skin
    thin(clamp, 0.25); thin(tubing, 0.42); thin(luer, 0.6)
    pink = kit.material('gauge_pink_20G', rgb=(0.86, 0.38, 0.55), rough=0.38)
    white = kit.material('clamp_white', rgb=(0.86, 0.87, 0.86), rough=0.42)
    clear = kit.material('clear_hub_pc', rgb=(0.95, 0.97, 0.975), rough=0.08, transmission=1.0, ior=1.58)
    tube_m = kit.material('clear_tubing_pvc', rgb=(0.94, 0.965, 0.97), rough=0.10, transmission=1.0, ior=1.53)
    for o, m in ((hub, clear), (wings, pink), (luer, pink), (clamp, white), (tubing, tube_m)):
        o.data.materials.clear(); o.data.materials.append(m)
        for p in o.data.polygons: p.use_smooth = True
    M = src_to_local()
    for o in (hub, wings, tubing, clamp, luer): kit.xform(o, M)
    # the cannula: 20 G (1.1 mm), 30 mm, from the hub nose into the skin at 12 degrees
    nose = M @ Vector((13.67, 0, 0)); d = Vector((0, -math.sin(math.radians(12)), math.cos(math.radians(12))))
    can = kit.sweep('cannula', [tuple(nose), tuple(nose + d * 0.030)], radius=0.55 * MM, seg=12, mat=kit.material('clear_cannula', rgb=(0.95, 0.96, 0.97), rough=0.12, transmission=1.0, ior=1.4), cap1=True)
    # the valve on the Luer end: the source's Luer piece ends at x=1.17, y~-39 (source mm), axis +x
    vparts, top = valve(kit.material('valve_clear', rgb=(0.94, 0.96, 0.97), rough=0.1, transmission=1.0, ior=1.5), kit.material('septum_white', rgb=(0.86, 0.86, 0.84), rough=0.5, sheen=0.2))
    end_src = Vector((1.17, -39.1, 0.0)); end = M @ end_src; ax = (M.to_3x3() @ Vector((1, 0, 0))).normalized()
    Rv = Vector((0, 1, 0)).rotation_difference(ax).to_matrix().to_4x4()
    for o in vparts: kit.xform(o, Matrix.Translation(end) @ Rv @ Matrix.Diagonal((MM, MM, MM, 1)))
    film = kit.material('clear_dressing_film', rgb=(0.96, 0.965, 0.96), rough=0.22, transmission=0.95, ior=1.45, double_sided=True)
    border = kit.material('dressing_border', rgb=(0.90, 0.90, 0.87), rough=0.9, double_sided=True)
    label = kit.material('dressing_label', rgb=(0.95, 0.95, 0.93), rough=0.85, double_sided=True)
    drs = dressing([hub, wings, tubing], film, border, label)
    for o in (hub, wings, tubing, clamp, luer, can, drs) + tuple(vparts): wrap(o)
    port_pt = end + ax * top * MM; port_w = Vector(port_pt)
    th = port_w.x / ARM_R; r = ARM_R + port_w.y; port_wr = Vector((r * math.sin(th), r * math.cos(th) - ARM_R, port_w.z))
    ax_w = Vector((ax.x * math.cos(th) - ax.y * math.sin(th), ax.x * math.sin(th) + ax.y * math.cos(th), ax.z)).normalized()
    item = kit.Item('iv_port')
    item.part('catheter', [hub, wings, can])
    item.part('dressing', [drs])
    item.part('extension', [tubing, clamp, luer] + vparts)
    item.empty('port', at=tuple(port_wr), z=tuple(-ax_w), y=(0, 1, 0))
    info = {'catheter': '20 G (pink), 1.1 mm x 30 mm cannula entering the skin at 12 degrees', 'arm_radius_m': ARM_R, 'dressing_mm': [70, 85],
            'port_m': [round(v, 4) for v in port_wr], 'port_axis_into_valve': [round(v, 4) for v in -ax_w],
            'tris': {k: kit.tris(o) for k, o in item.parts.items() if o.type == 'MESH'}}
    item.export(os.path.join(outdir, 'iv_port.raw.glb'), extras={'iv_port': json.dumps(info)})
    print('IV', info)


if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:]; build(argv[0], argv[1])
