#!/usr/bin/env python
"""Step 6b. Do the shipped slices and the shipped meshes register? Uses ONLY the deliverable files
(assets/models/headneck/headneck.glb, volume.json, volume_intensity.png, volume_labels.png).

    $HN_PY -I tools/headneck/22_registration_check.py
        -> $HN_WORK/review/volume/registration.json
        -> docs/overlord-world/headneck/registration_*.jpg   (slices from the atlas with mesh cross-sections drawn on top)

Numeric test per structure: every mesh vertex is mapped through the INVERSE of volume.json's voxel_to_frame affine;
the share of vertices whose voxel, or one of its 26 neighbours, carries that structure's label id is reported
(a mesh surface lies on the label boundary, so ~100 % is expected when frame, axes and left/right all agree;
a left/right flip or an axis swap drops paired structures to ~0 %).
"""
import json
import os
import struct
import sys
from pathlib import Path

import DracoPy
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
REPO = Path(os.environ.get("HN_REPO", Path.home() / "Developer/overlord-next"))
ASSET = REPO / "assets" / "models" / "headneck"
DOCIMG = REPO / "docs" / "overlord-world" / "headneck"
DOCIMG.mkdir(parents=True, exist_ok=True)
CHK = WORK / "review" / "volume"
CHK.mkdir(parents=True, exist_ok=True)

vj = json.loads((ASSET / "volume.json").read_text())
ni, nj, nk = vj["grid"]["dims_ijk"]
T = vj["atlas"]["tiles_per_row"]
A = np.array(vj["grid"]["voxel_to_frame"])
Ainv = np.linalg.inv(A)


def load_atlas(name):
    img = np.array(Image.open(ASSET / name))
    vol = np.zeros((ni, nj, nk), np.uint8)
    for k in range(nk):
        r, c = divmod(k, T)
        vol[:, :, k] = img[r * nj:(r + 1) * nj, c * ni:(c + 1) * ni].T
    return vol


inten = load_atlas(vj["intensity"]["file"])
labels = load_atlas(vj["labels"]["file"])
hu = np.interp(inten.astype(np.float64), vj["intensity"]["lut"]["byte"], vj["intensity"]["lut"]["hu"])
label_of = {t["id"]: t["label"] for t in vj["labels"]["table"]}

b = (ASSET / "headneck.glb").read_bytes()
off, js, bn = 12, None, None
while off < len(b):
    clen, ctype = struct.unpack_from("<I4s", b, off)
    if ctype == b"JSON":
        js = json.loads(b[off + 8: off + 8 + clen])
    else:
        bn = b[off + 8: off + 8 + clen]
    off += 8 + clen
meshes = {}
for node in js["nodes"]:
    V, F, base = [], [], 0
    for prim in js["meshes"][node["mesh"]]["primitives"]:
        bv = js["bufferViews"][prim["extensions"]["KHR_draco_mesh_compression"]["bufferView"]]
        dm = DracoPy.decode(bn[bv.get("byteOffset", 0): bv.get("byteOffset", 0) + bv["byteLength"]])
        v = np.asarray(dm.points, np.float64).reshape(-1, 3)
        V.append(v)
        F.append(np.asarray(dm.faces, np.int64).reshape(-1, 3) + base)
        base += len(v)
    meshes[node["name"]] = (np.vstack(V), np.vstack(F), js["materials"][js["meshes"][node["mesh"]]["primitives"][0]["material"]]["pbrMetallicRoughness"]["baseColorFactor"])

# ---- numeric: vertices -> voxels -> label ---------------------------------------------------------------
res = {}
st26 = np.ones((3, 3, 3), bool)
for sid, (v, f, col) in meshes.items():
    lid = label_of[sid]
    near = ndi.binary_dilation(labels == lid, structure=st26)
    ijk = (Ainv @ np.column_stack([v, np.ones(len(v))]).T).T[:, :3]
    idx = np.rint(ijk).astype(int)
    inside = (idx[:, 0] >= 0) & (idx[:, 0] < ni) & (idx[:, 1] >= 0) & (idx[:, 1] < nj) & (idx[:, 2] >= 0) & (idx[:, 2] < nk)
    hit = np.zeros(len(v), bool)
    hit[inside] = near[idx[inside, 0], idx[inside, 1], idx[inside, 2]]
    # mirrored control: flip x (left/right) about the midline and test again
    vm = v.copy()
    vm[:, 0] *= -1
    ijkm = np.rint((Ainv @ np.column_stack([vm, np.ones(len(v))]).T).T[:, :3]).astype(int)
    insm = (ijkm[:, 0] >= 0) & (ijkm[:, 0] < ni) & (ijkm[:, 1] >= 0) & (ijkm[:, 1] < nj) & (ijkm[:, 2] >= 0) & (ijkm[:, 2] < nk)
    hitm = np.zeros(len(v), bool)
    hitm[insm] = near[ijkm[insm, 0], ijkm[insm, 1], ijkm[insm, 2]]
    res[sid] = {"vertices": int(len(v)), "share_on_own_label": round(float(hit.mean()), 4),
                "share_inside_volume": round(float(inside.mean()), 4), "share_on_own_label_if_mirrored": round(float(hitm.mean()), 4)}
paired = [s for s in res if s.endswith(("_left", "_right")) or s.startswith(("rib_left", "rib_right"))]
summary = {"min_share_on_own_label": min((r["share_on_own_label"], s) for s, r in res.items()),
           "mean_share_on_own_label": round(float(np.mean([r["share_on_own_label"] for r in res.values()])), 4),
           "paired_structures_mirrored_control_max": max((res[s]["share_on_own_label_if_mirrored"], s) for s in paired),
           "paired_structures_mirrored_control_mean": round(float(np.mean([res[s]["share_on_own_label_if_mirrored"] for s in paired])), 4)}
(CHK / "registration.json").write_text(json.dumps({"summary": summary, "per_structure": res}, indent=1) + "\n")
print(json.dumps(summary, indent=1))


# ---- pictures: atlas slices with mesh cross-sections ---------------------------------------------------------
def section(v, f, axis, value):
    """Segments where the triangle mesh crosses the plane coordinate[axis] == value (browser frame)."""
    d = v[:, axis] - value
    t = d[f]
    crossing = (t.min(axis=1) < 0) & (t.max(axis=1) > 0)
    segs = []
    for tri, dd in zip(f[crossing], t[crossing]):
        pts = []
        for a_, b_ in ((0, 1), (1, 2), (2, 0)):
            if (dd[a_] < 0) != (dd[b_] < 0):
                w = dd[a_] / (dd[a_] - dd[b_])
                pts.append(v[tri[a_]] + w * (v[tri[b_]] - v[tri[a_]]))
        if len(pts) == 2:
            segs.append(pts)
    return np.array(segs) if segs else np.zeros((0, 2, 3))


def win(a, level, width):
    return np.clip((a - (level - width / 2)) / width, 0, 1)


bmin, bmax = np.array(vj["grid"]["bounds_m"]["min"]), np.array(vj["grid"]["bounds_m"]["max"])
cen = {s["id"]: s for s in json.loads((ASSET / "structures.json").read_text())["structures"]}


def draw(ax, plane, value, title, level=60, width=450, zoom=None):
    """plane: 'axial' (y = value), 'coronal' (z = value), 'sagittal' (x = value). Picture axes are browser-frame metres."""
    p = Ainv @ np.array([value if plane == "sagittal" else 0, value if plane == "axial" else 0, value if plane == "coronal" else 0, 1.0])
    if plane == "axial":
        k = int(np.clip(round(p[2]), 0, nk - 1))
        img = hu[:, :, k].T                       # rows j (z), cols i (x decreasing with i)
        extent = [bmax[0], bmin[0], bmin[2], bmax[2]]          # i=0 is +x (patient left) ... see axes note below
        hax, vax, fixed = 0, 2, 1
        xl, yl = "x (m)   patient LEFT ->", "z (m)   ANTERIOR ->"
    elif plane == "coronal":
        j = int(np.clip(round(p[1]), 0, nj - 1))
        img = hu[:, j, :].T
        extent = [bmax[0], bmin[0], bmin[1], bmax[1]]
        hax, vax, fixed = 0, 1, 2
        xl, yl = "x (m)   patient LEFT ->", "y (m)   SUPERIOR ->"
    else:
        i = int(np.clip(round(p[0]), 0, ni - 1))
        img = hu[i, :, :].T
        extent = [bmin[2], bmax[2], bmin[1], bmax[1]]
        hax, vax, fixed = 2, 1, 0
        xl, yl = "z (m)   ANTERIOR ->", "y (m)   SUPERIOR ->"
    # image columns run with voxel index i (towards patient RIGHT = -x) or j (+z); extent places them in metres
    ax.imshow(win(img, level, width), cmap="gray", origin="lower", extent=extent, interpolation="bilinear", vmin=0, vmax=1)
    for sid, (v, f, col) in meshes.items():
        s = section(v, f, fixed, value)
        if len(s):
            for seg in s:
                ax.plot(seg[:, hax], seg[:, vax], color=col[:3], lw=0.9)
    if plane != "sagittal":
        ax.set_xlim(bmin[0], bmax[0])              # +x (patient left) on the picture's right: viewed from the feet / from the front
    ax.set_xlabel(xl, color="w", fontsize=8)
    ax.set_ylabel(yl, color="w", fontsize=8)
    ax.set_title(title, color="w", fontsize=9)
    ax.tick_params(colors="w", labelsize=7)
    if zoom:
        ax.set_xlim(*zoom[0])
        ax.set_ylim(*zoom[1])
    ax.set_facecolor("black")


y_cart = cen["thyroid_cartilage"]["mask"]["centroid_m"][1]
y_cric = cen["cricoid_cartilage"]["mask"]["centroid_m"][1]
y_hy = cen["hyoid"]["mask"]["centroid_m"][1]
y_thy = cen["thyroid_gland"]["mask"]["centroid_m"][1]
z_tr = cen["larynx_air"]["mask"]["centroid_m"][2]
fig, axs = plt.subplots(2, 3, figsize=(15, 10.5), facecolor="black")
zoomA = ((-0.062, 0.062), (-0.03, 0.075))
draw(axs[0, 0], "axial", y_hy, f"axial through the hyoid (y = {y_hy * 1000:.0f} mm)", zoom=zoomA)
draw(axs[0, 1], "axial", y_cart, f"axial through the thyroid cartilage (y = {y_cart * 1000:.0f} mm)", zoom=zoomA)
draw(axs[0, 2], "axial", y_cric, f"axial through the cricoid (y = {y_cric * 1000:.0f} mm)", zoom=zoomA)
draw(axs[1, 0], "axial", y_thy, f"axial through the thyroid gland (y = {y_thy * 1000:.0f} mm)", zoom=zoomA)
draw(axs[1, 1], "coronal", z_tr, f"coronal through the laryngeal airway (z = {z_tr * 1000:.0f} mm)", zoom=((-0.07, 0.07), (-0.139, 0.1)))
draw(axs[1, 2], "sagittal", 0.0, "mid-sagittal (x = 0)", zoom=((-0.114, 0.114), (-0.139, 0.139)))
fig.suptitle("Shipped slice atlas (volume_intensity.png via volume.json) with cross-sections of the shipped meshes (headneck.glb)", color="w", fontsize=11)
fig.tight_layout()
p = CHK / "registration_slices.png"
fig.savefig(p, dpi=72, facecolor="black")
plt.close(fig)
Image.open(p).convert("RGB").save(DOCIMG / "registration_slices.jpg", quality=82, optimize=True)
print("wrote", DOCIMG / "registration_slices.jpg", (DOCIMG / "registration_slices.jpg").stat().st_size, "bytes")
