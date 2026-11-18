"""pose_lib.py: posing helpers for the hero patient scripts (run inside Blender).
Lying frame: +Z up from the mattress top, head toward +Y, the patient's left +X (see hero_lib)."""
import bpy, math
import numpy as np
from mathutils import Matrix, Vector, Quaternion
import hero_lib as H


def evaluated(obj):
    """Vertex positions as displayed (pose applied, shape keys at their current values), world space."""
    return H.world_coords(obj)


def reset_pose(arm, names=None):
    for pb in arm.pose.bones:
        if names is None or pb.name in names:
            pb.matrix_basis = Matrix.Identity(4)
    bpy.context.view_layer.update()


def rot_world(arm, name, quat, pivot=None):
    """Turn one pose bone by a rotation given in world (= armature, the armature object has no transform) space,
    about the bone's head (or `pivot`)."""
    pb = arm.pose.bones[name]
    m = pb.matrix.copy()
    p = m.translation.copy() if pivot is None else Vector(pivot)
    pb.matrix = Matrix.Translation(p) @ quat.to_matrix().to_4x4() @ Matrix.Translation(-p) @ m
    bpy.context.view_layer.update()


def aim(arm, name, tip_name, direction, roll_axis=None):
    pb = arm.pose.bones[name]
    d0 = (arm.pose.bones[tip_name].head - pb.head).normalized()
    rot_world(arm, name, d0.rotation_difference(Vector(direction).normalized()))


def head(arm, name):
    return np.array(arm.pose.bones[name].head)


def bisect(fn, lo, hi, iters=14):
    """Root of fn between lo and hi assuming fn increases (returns the nearer end when there is no sign change)."""
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


def store(arm, names):
    return {n: arm.pose.bones[n].matrix_basis.copy() for n in names}


def restore(arm, saved):
    for n, m in saved.items():
        arm.pose.bones[n].matrix_basis = m
    bpy.context.view_layer.update()


def group_w(obj, names):
    idx = {g.index for g in obj.vertex_groups if g.name in names}
    w = np.zeros(len(obj.data.vertices))
    for v in obj.data.vertices:
        for g in v.groups:
            if g.group in idx:
                w[v.index] += g.weight
    return w


def soft_floor(P, mask, floor, depth_soft=0.004, normals=None, spread=0.8, E=None, smooth_iter=6):
    """Press points under `floor(x, y)` (a function giving the support height) up onto it, with a soft knee of
    depth_soft so the contact patch flattens smoothly; the displaced depth is partly given back as a sideways bulge
    (spread) along the horizontal part of the normals. Returns the new positions and the per-vertex press depth."""
    z_f = floor(P[:, 0], P[:, 1])
    pen = np.maximum(z_f - P[:, 2], 0) * mask
    out = P.copy()
    # soft knee: points within depth_soft above the floor are eased toward it too
    z_new = z_f + 0.5 * ((P[:, 2] - z_f) + np.sqrt((P[:, 2] - z_f) ** 2 + depth_soft ** 2)) - 0.5 * depth_soft
    z_new = np.where(mask > 0, np.maximum(z_new, z_f), P[:, 2])
    dz = z_new - P[:, 2]
    if E is not None:
        dz_s = H.smooth_field(np.maximum(dz, 0), E, n_iter=smooth_iter, lam=0.5)
        dz = np.maximum(dz, dz_s * 0.6) * (mask > 0)
    out[:, 2] = P[:, 2] + dz
    if normals is not None and spread > 0:
        hn = normals[:, :2] / np.maximum(np.linalg.norm(normals[:, :2], axis=1, keepdims=True), 1e-6)
        side = np.clip(1.0 - np.abs(normals[:, 2]), 0, 1)
        out[:, :2] += (spread * dz * side)[:, None] * hn
    return out, dz
