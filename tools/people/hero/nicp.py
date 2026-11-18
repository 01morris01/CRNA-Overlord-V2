"""nicp.py (copied unchanged in method from the p51 asset-first design study, people/hero/design/asset-first/scripts): non-rigid registration of one mesh onto another ("wrapping"), after Amberg, Romdhani and Vetter,
"Optimal Step Nonrigid ICP Algorithms for Surface Registration" (2007). Written for this project; no outside code.
Each source vertex gets its own 3x4 affine transform; neighbouring transforms are kept alike (stiffness), vertices are
pulled to the closest point of the target (data), and named landmarks are pulled to their partners. Stiffness is lowered
step by step, so the source first moves as a whole and only then follows the target's detail.
Runs inside Blender (uses mathutils' BVH tree for closest points) with numpy and scipy."""
import numpy as np
import scipy.sparse as sp
from scipy.sparse.linalg import splu
from mathutils import Vector
from mathutils.bvhtree import BVHTree


def vertex_normals(V, F):
    """Area-weighted vertex normals. F: (m, 3 or 4) with a repeated last index for triangles in a quad array."""
    N = np.zeros_like(V)
    tris = [F[:, [0, 1, 2]]] + ([F[:, [0, 2, 3]]] if F.shape[1] == 4 else [])
    for t in tris:
        n = np.cross(V[t[:, 1]] - V[t[:, 0]], V[t[:, 2]] - V[t[:, 0]])
        for k in range(3):
            np.add.at(N, t[:, k], n)
    l = np.linalg.norm(N, axis=1, keepdims=True)
    return N / np.maximum(l, 1e-20)


def edges_of(F):
    e = np.concatenate([F[:, [k, (k + 1) % F.shape[1]]] for k in range(F.shape[1])])
    e = e[e[:, 0] != e[:, 1]]
    e = np.sort(e, 1)
    return np.unique(e, axis=0)


def bvh(V, F):
    polys = [tuple(int(i) for i in (f if f[-1] != f[-2] else f[:-1])) for f in F]
    return BVHTree.FromPolygons([tuple(v) for v in V], polys)


def closest(tree, P, Ntarget_faces=None):
    """Closest point on the target for every row of P: positions, normals, distances."""
    loc = np.empty_like(P); nrm = np.empty_like(P); dist = np.empty(len(P))
    for i, p in enumerate(P):
        l, n, idx, d = tree.find_nearest(Vector(p))
        if l is None:
            loc[i] = p; nrm[i] = (0, 0, 1); dist[i] = 1e9
        else:
            loc[i] = l; nrm[i] = n; dist[i] = d
    return loc, nrm, dist


def wrap(Vs, Fs, tree, landmarks=None, data_mask=None, stiffness=(60, 30, 15, 8, 4, 2, 1), lm_weight=(20, 12, 8, 4, 2, 1, 0.5),
         inner=3, gamma=1.0, max_dist=0.03, min_dot=0.35, fixed=None, fixed_weight=50.0, log=print):
    """Vs: (n, 3) source vertices, Fs: faces among them. tree: BVH of the target. landmarks: (indices into Vs, target
    positions). data_mask: per-vertex 0..1 weight of the closest-point term (0 for cavities that the target lacks).
    fixed: (indices, positions) kept in place (for a region boundary). Returns the wrapped positions."""
    n = len(Vs)
    E = edges_of(Fs); m = len(E)
    # stiffness matrix M (x) G
    rows = np.repeat(np.arange(4 * m), 2)
    cols = np.empty((m, 4, 2), np.int64); vals = np.empty((m, 4, 2))
    g = np.array([1.0, 1.0, 1.0, gamma])
    for k in range(4):
        cols[:, k, 0] = 4 * E[:, 0] + k; cols[:, k, 1] = 4 * E[:, 1] + k
        vals[:, k, 0] = -g[k]; vals[:, k, 1] = g[k]
    MG = sp.csr_matrix((vals.ravel(), (rows, cols.ravel())), shape=(4 * m, 4 * n))
    # data matrix D: row i holds [v_i 1] at columns 4i..4i+3
    Vh = np.c_[Vs, np.ones(n)]
    D = sp.csr_matrix((Vh.ravel(), (np.repeat(np.arange(n), 4), np.arange(4 * n))), shape=(n, 4 * n))
    X = np.tile(np.r_[np.eye(3), np.zeros((1, 3))], (n, 1))             # identity transforms, (4n, 3)
    cur = Vs.copy()
    dm = np.ones(n) if data_mask is None else np.asarray(data_mask, float)
    for step, (alpha, beta) in enumerate(zip(stiffness, lm_weight)):
        for it in range(inner):
            Ns = vertex_normals(cur, Fs)
            U, Nt, dist = closest(tree, cur)
            w = dm * (dist < max_dist) * ((Ns * Nt).sum(1) > min_dot)
            blocks = [alpha * MG, sp.diags(w) @ D]
            rhs = [np.zeros((4 * m, 3)), U * w[:, None]]
            if landmarks is not None and beta > 0:
                li, lp = landmarks
                DL = D[li]
                blocks.append(beta * DL); rhs.append(beta * np.asarray(lp))
            if fixed is not None:
                fi, fp = fixed
                blocks.append(fixed_weight * D[fi]); rhs.append(fixed_weight * np.asarray(fp))
            A = sp.vstack(blocks).tocsc(); B = np.vstack(rhs)
            AtA = (A.T @ A).tocsc() + 1e-9 * sp.identity(4 * n, format='csc')
            lu = splu(AtA)
            AtB = A.T @ B
            X = np.stack([lu.solve(np.ascontiguousarray(AtB[:, k])) for k in range(3)], 1)
            new = D @ X
            move = np.linalg.norm(new - cur, axis=1).max()
            cur = new
            if move < 2e-5:
                break
        U, Nt, dist = closest(tree, cur)
        ok = dist < max_dist
        log(f'   wrap step {step}: stiffness {alpha}, landmark weight {beta}: {int((w > 0).sum())} of {n} vertices matched; distance to target mean {dist[ok].mean() * 1000:.2f} mm, 95th percentile {np.percentile(dist[ok], 95) * 1000:.2f} mm')
    return cur


def project(V, F, tree, max_dist=0.004, min_dot=0.5, mask=None):
    """Move vertices onto the target where it is close and faces the same way (the last fraction of a millimetre)."""
    N = vertex_normals(V, F)
    U, Nt, dist = closest(tree, V)
    ok = (dist < max_dist) & ((N * Nt).sum(1) > min_dot)
    if mask is not None:
        ok &= mask
    out = V.copy(); out[ok] = U[ok]
    return out, ok
