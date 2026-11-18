"""build_mask.py: adult large (size 5) anatomical face mask: clear dome, inflated cushion, 22 mm female connector (ISO 5356-1),
colored hook ring and the cushion's inflation valve. Authored (see SOURCES.md for the open models looked at).

   blender -b --factory-startup --python tools/props/airway/build_mask.py -- OUTDIR

Frame (meters, glTF): origin = `seat`, the center of the cushion's contact line averaged into a plane; +Z points away from
the face along the connector axis; +Y toward the nasal bridge; +X to the patient's left when the mask is on the face.
Nodes: mask (root) > dome, cushion, connector, hook_ring, seat (empty), port (empty at the connector mouth, +Z out)."""
import bpy, sys, os, math, json
from mathutils import Matrix, Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kit, specs
from kit import MM

L, Wd = specs.MASK['length'], specs.MASK['width']          # cushion outline, contact line (mm)
TUBE_W, TUBE_H = 19.0, 15.0                                  # inflated cushion section (mm): wider than tall, as a pressed balloon tube
Z_TOP = 56.0                                                 # dome top (connector base) above the seat plane (mm)
CONN_LEN = 22.0                                              # 22 mm female socket height above the dome top
C = specs.CONE22


def outline(t):
    """Contact line of the cushion: a pear outline, narrow at the nose (t=0, +Y), wide at the chin (t=pi). Returns (x, y, z) mm.
    The contact line is a saddle: higher (+Z) over the nasal bridge and the chin, lower over the cheeks."""
    c, s = math.cos(t), math.sin(t)
    y = (L / 2) * c - 3.0
    x = (Wd / 2) * s * (1.0 - 0.20 * c - 0.06 * c * c) / (1.0 - 0.06)
    x *= 1.0 - 0.10 * max(0.0, c) ** 3                       # a narrower, rounder nose end
    z = 8.0 * math.cos(2 * t) + 4.0 * c
    return Vector((x, y, z))


def frame_at(t, dt=1e-4):
    p = outline(t); tan = (outline(t + dt) - outline(t - dt)).normalized()
    up = Vector((0, 0, 1)); outw = tan.cross(up).normalized()     # outward in the rim plane (the outline runs counter-clockwise seen from +Z)
    if outw.dot(Vector((p.x, p.y + 3.0, 0))) < 0: outw = -outw
    nrm = outw.cross(tan).normalized()
    if nrm.z < 0: nrm = -nrm
    return p, tan, outw, nrm


def cushion(mat, nu=72, nv=22):
    """The inflated tube swept along the contact line. Section in (outward, up): an egg, fuller toward the face and inward."""
    def section(a):
        # a: 0..2pi around the section, 0 = outward, pi/2 = up (away from face), pi = inward, 3pi/2 = toward the face
        ca, sa = math.cos(a), math.sin(a)
        w = TUBE_W / 2 * (1.0 + 0.08 * (-ca))                 # fuller on the inner (face) lip
        h = TUBE_H / 2 * (1.0 + 0.06 * (-sa))
        return ca * w, sa * h
    def P(u, v):
        t = u * kit.TAU; p, tan, outw, nrm = frame_at(t)
        x, y = section(v * kit.TAU)
        ctr = p + nrm * (TUBE_H / 2) - outw * 1.5                # the contact point is the bottom of the tube, a little inside the outline
        return tuple((ctr + outw * x + nrm * y) * MM)
    return kit.grid('cushion', P, nu, nv, mat=mat)


def attach_line(t):
    """Where the dome meets the cushion: on the cushion's upper outer shoulder."""
    p, tan, outw, nrm = frame_at(t)
    return p + nrm * (TUBE_H * 0.92) + outw * (TUBE_W * 0.18)


def dome(mat, nu=64, nv=20, thick=1.3):
    top_r = 15.5; top_c = Vector((0, 4.0, Z_TOP))              # connector base: a little toward the nose
    def outer(u, s):
        t = u * kit.TAU; b = attach_line(t); ang = math.atan2(b.x, b.y - top_c.y)
        tc = top_c + Vector((top_r * math.sin(ang), top_r * math.cos(ang), 0))
        h = 1.0 - s ** 1.55; g = 1.0 - (1.0 - s) ** 1.6
        xy = Vector((tc.x + (b.x - tc.x) * h, tc.y + (b.y - tc.y) * h, 0)); z = b.z + (tc.z - b.z) * g
        return Vector((xy.x, xy.y, z))
    def P(u, v): return tuple(outer(u, v) * MM)
    o = kit.grid('dome', P, nu, nv, mat=mat, sharp_deg=None)
    me = o.data; me.update()
    top = max(me.polygons, key=lambda f: f.center.z)
    if top.normal.z < 0: me.flip_normals()
    kit.solidify(o, thick * MM, offset=-1.0)
    kit.finish_mesh(o.data, 60)
    return o


def connector(mat):
    """22 mm female socket (ISO 5356-1): 22.37 mm at 15 mm from its leading end, 1:40 taper, opening outward (+Z)."""
    z0, z1 = Z_TOP - 6.0, Z_TOP + CONN_LEN
    d_mouth = C['d'] + C['at'] * C['taper']                    # internal diameter at the mouth (wider: female taper narrows inward)
    d_in = C['d'] - (CONN_LEN - 2 - C['at']) * C['taper']
    ro = specs.MASK['connector_od'] / 2
    prof = kit.fillet([(d_in / 2 - 1.5, z0 + 2, 0), (d_in / 2, z1 - CONN_LEN + 2, 0.3), (d_mouth / 2, z1 - 0.6, 0.0), (d_mouth / 2 + 0.6, z1, 0.0),
                       (ro - 0.5, z1, 0.0), (ro, z1 - 0.7, 0.0), (ro, Z_TOP + 7.5, 0.6), (ro + 0.9, Z_TOP + 6.5, 0.5), (ro + 0.9, Z_TOP + 4.0, 0.5),
                       (ro, Z_TOP + 3.0, 0.5), (ro + 1.5, z0 + 3.0, 2.5), (ro + 3.0, z0, 0.0)], r=0.35, n=3)
    # lathe about +Y, then turn to +Z
    o = kit.lathe('connector', [(r, z) for r, z in prof], seg=56, mat=mat, sharp_deg=50)
    kit.xform(o, Matrix.Translation((0, 4.0 * MM, 0)) @ Matrix.Rotation(math.radians(90), 4, 'X') @ Matrix.Diagonal((MM, MM, MM, 1)) @ Matrix.Rotation(0, 4, 'X'))
    return o, z1, d_mouth


def hook_ring(mat):
    """The four-prong hook ring a head harness hooks onto, seated on the connector shoulder."""
    import bmesh
    ri, ro, h = specs.MASK['connector_od'] / 2 + 0.95, 19.0, 3.2
    prof = kit.fillet([(ri, 0, 0), (ro - 1.2, 0, 0.6), (ro, 1.0, 0.6), (ro, h - 0.8, 0.6), (ro - 1.0, h, 0.6), (ri, h, 0)], r=0.4, n=3)
    prof.append(prof[0])
    ring = kit.lathe('ring', prof, seg=64, mat=mat, sharp_deg=50)
    prongs = []
    for k in range(4):
        a = math.radians(45 + 90 * k)
        # each prong: a short post outward with an upturned hook tip
        path = [(math.sin(a) * (ro - 1.0), h * 0.5, math.cos(a) * (ro - 1.0)), (math.sin(a) * (ro + 4.0), h * 0.5, math.cos(a) * (ro + 4.0)),
                (math.sin(a) * (ro + 6.2), h * 0.9, math.cos(a) * (ro + 6.2)), (math.sin(a) * (ro + 6.6), h + 3.0, math.cos(a) * (ro + 6.6))]
        prongs.append(kit.sweep('prong%d' % k, path, radius=1.25, seg=12, mat=mat, cap1=True, sharp_deg=None))
    o = kit.join('hook_ring', [ring] + prongs)
    kit.xform(o, Matrix.Translation((0, 4.0 * MM, (Z_TOP + 3.0) * MM)) @ Matrix.Rotation(math.radians(90), 4, 'X') @ Matrix.Diagonal((MM, MM, MM, 1)))
    return o


def valve(mat_body, mat_cap):
    """The cushion's inflation valve: a short stem on the chin end of the cushion with a colored cap."""
    p, tan, outw, nrm = frame_at(math.pi)
    base = p + nrm * TUBE_H * 0.85 + outw * 2.0
    d = (nrm * 0.55 + outw * 0.83).normalized()
    stem = kit.sweep('valve_stem', [tuple(base * MM), tuple((base + d * 7.0) * MM)], radius=2.0 * MM, seg=16, mat=mat_body)
    cap = kit.sweep('valve_cap', [tuple((base + d * 6.0) * MM), tuple((base + d * 9.5) * MM)], radius=2.7 * MM, seg=20, mat=mat_cap, cap1=True)
    return [stem, cap]


def build(outdir):
    kit.reset()
    clear_dome = kit.material('clear_dome_pvc', rgb=(0.95, 0.975, 0.98), rough=0.05, transmission=1.0, ior=1.53)
    clear_cushion = kit.material('cushion_pvc_milky', rgb=(0.78, 0.84, 0.88), rough=0.30, sheen=0.35, sheen_rough=0.35, sheen_tint=(0.9, 0.95, 1.0), specular=0.6)        # opaque: in three.js a transmissive cushion vanishes behind the transmissive dome
    conn_mat = kit.material('clear_connector_pc', rgb=(0.95, 0.97, 0.98), rough=0.06, transmission=1.0, ior=1.58)
    ring_mat = kit.material('hook_ring_green', rgb=(0.05, 0.42, 0.30), rough=0.38)
    cap_mat = kit.material('valve_cap_white', rgb=(0.82, 0.83, 0.82), rough=0.4)
    item = kit.Item('mask')
    cu = cushion(clear_cushion); dm = dome(clear_dome); co, z1, d_mouth = connector(conn_mat); hr = hook_ring(ring_mat); vv = valve(clear_cushion, cap_mat)
    item.part('cushion', [cu] + vv)
    item.part('dome', [dm])
    item.part('connector', [co], pivot=(0, 4.0 * MM, Z_TOP * MM))
    item.part('hook_ring', [hr], pivot=(0, 4.0 * MM, (Z_TOP + 3.0) * MM))
    item.empty('seat', at=(0, 0, 0), z=(0, 0, 1), y=(0, 1, 0))
    item.empty('port', at=(0, 4.0 * MM, z1 * MM), z=(0, 0, 1), y=(0, 1, 0))
    lo, hi = kit.bounds([o for o in item.parts.values() if o.type == 'MESH'])
    info = {'size_m': [round(v, 4) for v in (hi - lo)], 'contact_line_mm': [Wd, L], 'connector': '22 mm female, %.2f mm at the mouth, 1:40 taper' % d_mouth,
            'port_m': [0, 0.004, round(z1 * MM, 4)], 'tris': {k: kit.tris(o) for k, o in item.parts.items() if o.type == 'MESH'}}
    item.export(os.path.join(outdir, 'face_mask_adult.raw.glb'), extras={'mask': json.dumps(info)})
    print('MASK', info)


if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:]; build(argv[0])
