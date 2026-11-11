#!/usr/bin/env python
"""Step 7. Browser slice volume: 8-bit intensity + 8-bit labels as lossless PNG tile atlases, and volume.json.

    $HN_PY -I tools/headneck/20_export_volume.py
        -> <repo>/assets/models/headneck/volume_intensity.png, volume_labels.png, volume.json
        -> $HN_WORK/review/volume/  (work-area checks: defacing renders, verification json)

Grid   : the scan's own published voxels (1.5 mm isotropic; NOT the 0.75 mm working grid, which holds no extra
         information), cropped only in the cranio-caudal direction: native slices k = 0 .. K_TOP-1.
Labels : the corrected Slicer label map (0.75 mm) reduced 2x2x2: a published voxel takes the most frequent structure id
         among its eight sub-voxels if at least 4 of the 8 carry that id (>= 50 % occupancy); ties go to the lower id.
Deface : the publisher already blurred the face. On top of that, in the slices from the chin upward this script sets to air
           (1) all soft tissue lying more than 3 mm in front of the facial skeleton (lips, nose, chin pad, anterior cheeks),
           (2) thin surface protrusions (external ears, residual nose) removed by a 7.5 mm morphological opening of the body.
         Voxels that carry a structure label and bone-dense voxels (>= 250 HU) are never blanked.
LUT    : piecewise-linear HU -> byte with 2.5 HU steps through soft tissue (see LUT_HU / LUT_BYTE).
Atlas  : axial slices tiled left-to-right, top-to-bottom; tile pixel (u, v) = voxel (i = u, j = v) of slice k.
"""
import json
import os
import struct
import sys
import zlib
from pathlib import Path

import nibabel as nib
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
REPO = Path(os.environ.get("HN_REPO", Path.home() / "Developer/overlord-next"))
OUT = REPO / "assets" / "models" / "headneck"
CHK = WORK / "review" / "volume"
CHK.mkdir(parents=True, exist_ok=True)
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import catalog

dec = json.loads((HERE / "14_decisions.json").read_text())
plan = json.loads((WORK / "meshes" / "plan.json").read_text())
info = json.loads((WORK / "data" / "s0527" / "subject_info.json").read_text())
labtab = json.loads((WORK / "review" / "slicer" / "corrected_labels.json").read_text())["label_ids"]
R0, A0, S0 = plan["origin_G_mm"]
K_TOP = dec["parameters"]["exhibit_top_native_k_exclusive"]
TILES_PER_ROW = 16
AIR_HU = -1024
LUT_HU = [-1024, -160, 240, 1840, 3071]
LUT_BYTE = [0, 27, 187, 251, 255]

ct_im = nib.load(WORK / "data" / "s0527" / "ct_native_G.nii.gz")
AG = ct_im.affine.astype(np.float64)                        # native ijk -> frame G (mm), diagonal
assert nib.aff2axcodes(AG) == ("R", "A", "S") and np.allclose(AG[:3, :3], np.diag([1.5, 1.5, 1.5]))
ct = np.asanyarray(ct_im.dataobj).astype(np.int16)
lab_im = nib.load(WORK / "review" / "slicer" / "corrected_labels_075.nii.gz")
lab75 = np.asanyarray(lab_im.dataobj).astype(np.uint8)
assert lab75.shape == tuple(2 * s for s in ct.shape)
# corner alignment of the two grids
assert np.allclose(lab_im.affine @ [-0.5, -0.5, -0.5, 1], AG @ [-0.5, -0.5, -0.5, 1], atol=1e-3)

# ---- labels on the published grid: 2x2x2 majority with >= 50 % occupancy ------------------------------
ni, nj, nk = ct.shape
blocks = lab75.reshape(ni, 2, nj, 2, nk, 2).transpose(0, 2, 4, 1, 3, 5).reshape(ni, nj, nk, 8)
best_count = np.zeros((ni, nj, nk), np.uint8)
lab = np.zeros((ni, nj, nk), np.uint8)
n_lab = len(labtab)
for lid in range(1, n_lab + 1):                              # ascending id: ties stay with the lower id
    c = (blocks == lid).sum(axis=3).astype(np.uint8)
    upd = c > best_count
    best_count[upd] = c[upd]
    lab[upd] = lid
lab[best_count < 4] = 0
del blocks

# ---- crop (cranio-caudal only) ------------------------------------------------------------------------
ct = ct[:, :, :K_TOP].copy()
lab = lab[:, :, :K_TOP].copy()
ni, nj, nk = ct.shape
ids = {int(k): v for k, v in labtab.items()}
name_to_id = {v: k for k, v in ids.items()}

# ---- defacing -------------------------------------------------------------------------------------------
body = ct > -350
lbl, n = ndi.label(body)
sizes = np.bincount(lbl.ravel())
sizes[0] = 0
body = lbl == sizes.argmax()
for k in range(nk):                                           # fill internal air per axial slice
    body[:, :, k] = ndi.binary_fill_holes(body[:, :, k])
bone_ids = [name_to_id[n_] for n_ in ("skull", "mandible", "teeth_upper", "teeth_lower", "hard_palate")]
facial_bone = np.isin(lab, bone_ids)
mand = lab == name_to_id["mandible"]
k_chin = int(np.nonzero(mand.any(axis=(0, 1)))[0].min())      # lowest slice containing mandible
MARGIN_VOX = 2                                                # 3 mm in front of the bone is kept
blank_front = np.zeros_like(body)
for k in range(k_chin, nk):
    fb = facial_bone[:, :, k]
    cols = np.nonzero(fb.any(axis=1))[0]
    if len(cols) < 2:
        continue
    front = np.full(ni, np.nan)
    for i in cols:
        front[i] = np.nonzero(fb[i])[0].max()
    i0, i1 = cols.min(), cols.max()
    xs = np.arange(i0, i1 + 1)
    front[i0:i1 + 1] = np.interp(xs, cols, front[cols])       # bridge columns without bone between the outermost bone columns
    jj = np.arange(nj)[None, :]
    sl = np.zeros((ni, nj), bool)
    sl[i0:i1 + 1] = jj > (front[i0:i1 + 1, None] + MARGIN_VOX)
    blank_front[:, :, k] = sl & body[:, :, k]
# thin protrusions (ears, residual nose): 3D opening of the body with a 7.5 mm ball, edge-padded so the cut faces of
# the volume are not eroded
r = 5
zz, yy, xx = np.mgrid[-r:r + 1, -r:r + 1, -r:r + 1]
ball = (xx ** 2 + yy ** 2 + zz ** 2) <= r * r
pad = np.pad(body & ~blank_front, r + 1, mode="edge")
opened = ndi.binary_opening(pad, structure=ball)[r + 1:-r - 1, r + 1:-r - 1, r + 1:-r - 1]
protr = (body & ~blank_front) & ~opened
protr[:, :, :k_chin] = False
protect = (lab > 0) | (ct >= 250)
blank = (blank_front | protr) & ~protect
ct_out = ct.copy()
ct_out[blank] = AIR_HU
deface = {
    "publisher": "face blurred by the dataset publisher before release (resources/train_nnunet.md: 'Your dataset contains blurred faces')",
    "additional_blanking_in_this_export": {
        "applies_to_slices_k": [k_chin, nk - 1],
        "applies_from_S_mm": float(AG[2, 3] - 0.75 + 1.5 * k_chin),
        "rule_1": "soft tissue more than 3 mm anterior to the facial skeleton (skull, mandible, teeth, hard palate labels), per axial slice, between the outermost bone columns",
        "rule_2": "soft-tissue surface protrusions removed by a 3D morphological opening of the body mask with a 7.5 mm radius ball (external ears, residual nose)",
        "never_blanked": "voxels with a structure label; voxels >= 250 HU",
        "set_to_HU": AIR_HU,
        "voxels_blanked_rule_1": int((blank_front & ~protect).sum()),
        "voxels_blanked_rule_2": int((protr & ~protect & ~blank_front).sum()),
        "voxels_blanked_total": int(blank.sum()),
        "volume_blanked_mL": round(float(blank.sum() * 3.375 / 1000), 1),
    },
}

# ---- HU -> byte ---------------------------------------------------------------------------------------------
hu_axis = np.arange(-1024, 3072)
lut_full = np.rint(np.interp(hu_axis, LUT_HU, LUT_BYTE)).astype(np.uint8)
vol8 = lut_full[np.clip(ct_out, -1024, 3071).astype(np.int32) + 1024]
byte_to_hu = [round(float(np.interp(b, LUT_BYTE, LUT_HU)), 1) for b in range(256)]


def atlas(vol):
    rows = (nk + TILES_PER_ROW - 1) // TILES_PER_ROW
    img = np.zeros((rows * nj, TILES_PER_ROW * ni), np.uint8)
    for k in range(nk):
        r_, c_ = divmod(k, TILES_PER_ROW)
        img[r_ * nj:(r_ + 1) * nj, c_ * ni:(c_ + 1) * ni] = vol[:, :, k].T        # row v = j, column u = i
    return img


def save_png(arr, path):
    im = Image.fromarray(arr, mode="L")
    im.save(path, format="PNG", optimize=True, compress_level=9)       # no alpha, no ICC profile, no text chunks
    return path.stat().st_size


def png_chunks(path):
    b = path.read_bytes()
    assert b[:8] == b"\x89PNG\r\n\x1a\n"
    off, out = 8, []
    while off < len(b):
        ln, typ = struct.unpack(">I4s", b[off:off + 8])
        out.append(typ.decode())
        if typ == b"IHDR":
            w, h, depth, ctype = struct.unpack(">IIBB", b[off + 8:off + 18])
            ihdr = {"width": w, "height": h, "bit_depth": depth, "color_type": ctype}
        off += 12 + ln
    return ihdr, out


a_int, a_lab = atlas(vol8), atlas(lab)
f_int, f_lab = OUT / "volume_intensity.png", OUT / "volume_labels.png"
sz_int, sz_lab = save_png(a_int, f_int), save_png(a_lab, f_lab)

# ---- affine: voxel index (centre of voxel i, j, k) -> browser frame (metres) ----------------------------------
tR, tA, tS = AG[0, 3], AG[1, 3], AG[2, 3]                    # frame-G position of the centre of voxel (0, 0, 0)
aff = np.array([[-0.0015, 0.0, 0.0, (R0 - tR) / 1000.0],
                [0.0, 0.0, 0.0015, (tS - S0) / 1000.0],
                [0.0, 0.0015, 0.0, (tA - A0) / 1000.0],
                [0.0, 0.0, 0.0, 1.0]])
assert np.linalg.det(aff[:3, :3]) > 0

# ---- label table with counts on this grid ---------------------------------------------------------------------
vox75 = json.loads((WORK / "review" / "slicer" / "corrected_labels.json").read_text())["voxels_working_grid"]
label_table = []
for lid in range(1, n_lab + 1):
    sid = ids[lid]
    n_nat = int((lab == lid).sum())
    full = float(vox75[sid] * 0.421875)
    kk = np.nonzero(lab == lid)
    cen = None
    if n_nat:
        c_idx = np.array([kk[0].mean(), kk[1].mean(), kk[2].mean(), 1.0])
        cen = [round(float(x), 6) for x in (aff @ c_idx)[:3]]
    label_table.append({"label": lid, "id": sid, "voxels": n_nat, "volume_mL": round(n_nat * 3.375 / 1000, 3),
                        "volume_ratio_to_corrected_mask": round(n_nat * 3.375 / full, 3) if full else None,
                        "centroid_m": cen})

vol_json = {
    "schema": "overlord.headneck.volume/1",
    "source": {"dataset": "TotalSegmentator dataset v3.0.0", "doi": "10.5281/zenodo.22688904", "subject": "s0527",
               "license": "CC BY 4.0", "license_url": "https://creativecommons.org/licenses/by/4.0/",
               "attribution": "CT scan: TotalSegmentator dataset v3.0.0, subject s0527, Wasserthal et al., University Hospital Basel, CC BY 4.0 (doi:10.5281/zenodo.22688904). Structures: TotalSegmentator 2.18.0 (Apache-2.0), reviewed and corrected in 3D Slicer; modified."},
    "frame": {"units": "metres", "handedness": "right", "x": "patient LEFT", "y": "SUPERIOR", "z": "ANTERIOR",
              "from_patient_frame_G_mm": "x = -(R - R0)/1000, y = (S - S0)/1000, z = (A - A0)/1000",
              "origin_G_mm": {"R0": R0, "A0": A0, "S0": S0},
              "origin_note": plan["origin_note"],
              "patient_frame_G": "R, A, S along the image's own voxel axes; equals the publisher's NIfTI world frame rotated rigidly by %.3f degrees about the volume centre (published sform is oblique). See subject record." % info["published_affine_obliquity"]["rotation_angle_deg"],
              "G_to_published_world": {"formula": "p_world = Rot @ (p_G - c) + c", "Rot": info["published_affine_obliquity"]["rotation_matrix_Rot"],
                                       "c_mm": info["frame_G"]["pivot_c_world_mm"]}},
    "grid": {"dims_ijk": [ni, nj, nk], "spacing_mm": [1.5, 1.5, 1.5],
             "axes": {"i": "towards patient RIGHT (-x)", "j": "towards ANTERIOR (+z)", "k": "towards SUPERIOR (+y)"},
             "voxel_to_frame": aff.tolist(),
             "voxel_to_frame_note": "4x4, row-major, maps the CENTRE of voxel (i, j, k) to metres in the browser frame; a voxel covers index +/- 0.5",
             "bounds_m": {"min": [round(float(x), 6) for x in np.minimum(aff @ [-0.5, -0.5, -0.5, 1], aff @ [ni - 0.5, nj - 0.5, nk - 0.5, 1])[:3]],
                          "max": [round(float(x), 6) for x in np.maximum(aff @ [-0.5, -0.5, -0.5, 1], aff @ [ni - 0.5, nj - 0.5, nk - 0.5, 1])[:3]]},
             "resolution_note": "the publisher released this scan resampled to 1.5 mm isotropic; these are those voxels, not upsampled"},
    "crop": {"native_grid_dims_ijk": info["shape_ijk"], "kept_i": [0, ni - 1], "kept_j": [0, nj - 1], "kept_k": [0, nk - 1],
             "removed": "native slices k >= %d (everything above S = %.2f mm in frame G: orbits, cranial vault, brain)" % (K_TOP, dec["parameters"]["exhibit_top_S_mm"])},
    "atlas": {"tiles_per_row": TILES_PER_ROW, "tile_width_px": ni, "tile_height_px": nj, "tiles": nk,
              "rows": (nk + TILES_PER_ROW - 1) // TILES_PER_ROW,
              "image_width_px": int(a_int.shape[1]), "image_height_px": int(a_int.shape[0]),
              "slice_order": "tile t (0-based, left to right, then top to bottom) = axial slice k = t; k = 0 is the most INFERIOR slice",
              "pixel_mapping": "pixel (x, y) from the image's top-left corner: x = (k % tiles_per_row) * tile_width + i ; y = floor(k / tiles_per_row) * tile_height + j",
              "within_tile": "u = i runs towards patient RIGHT, v = j runs towards ANTERIOR (image top = posterior)",
              "format": "PNG, 8-bit greyscale (colour type 0), no alpha, no colour profile, lossless"},
    "intensity": {"file": f_int.name, "bytes": sz_int,
                  "lut": {"type": "piecewise-linear", "hu": LUT_HU, "byte": LUT_BYTE,
                          "steps_HU_per_level": {"-1024..-160": 32.0, "-160..240": 2.5, "240..1840": 25.0, "1840..3071": 307.75},
                          "byte_to_hu": byte_to_hu,
                          "suggested_windows": {"soft_tissue": {"level": 40, "width": 400}, "bone": {"level": 400, "width": 1800}, "airway": {"level": -600, "width": 1500}}},
                  "values_outside_body_or_blanked": {"hu": AIR_HU, "byte": 0}},
    "labels": {"file": f_lab.name, "bytes": sz_lab, "background": 0,
               "rule": "2x2x2 reduction of the corrected 0.75 mm label map: most frequent structure id among the 8 sub-voxels if >= 4 of 8 carry it; ties to the lower id",
               "table": label_table},
    "defacing": deface,
}
(OUT / "volume.json").write_text(json.dumps(vol_json, indent=1) + "\n")

# ---- verification ---------------------------------------------------------------------------------------------
ver = {}
for f, src in ((f_int, vol8), (f_lab, lab)):
    ihdr, chunks = png_chunks(f)
    back = np.array(Image.open(f))
    rec = np.zeros_like(src)
    for k in range(nk):
        r_, c_ = divmod(k, TILES_PER_ROW)
        rec[:, :, k] = back[r_ * nj:(r_ + 1) * nj, c_ * ni:(c_ + 1) * ni].T
    ver[f.name] = {"ihdr": ihdr, "chunks": sorted(set(chunks)), "lossless_roundtrip": bool(np.array_equal(rec, src)),
                   "no_alpha": ihdr["color_type"] == 0, "no_icc_profile": "iCCP" not in chunks and "sRGB" not in chunks,
                   "max_side_px": max(ihdr["width"], ihdr["height"]), "bytes": f.stat().st_size}
# quantisation error of the LUT through soft tissue
soft = (ct_out > -160) & (ct_out < 240)
hu_back = np.interp(vol8.astype(np.float64), LUT_BYTE, LUT_HU)
ver["lut_roundtrip_abs_error_HU"] = {"soft_tissue_max": round(float(np.abs(hu_back - ct_out)[soft].max()), 2),
                                     "soft_tissue_mean": round(float(np.abs(hu_back - ct_out)[soft].mean()), 3)}
ver["label_volume_ratio_min"] = min((t["volume_ratio_to_corrected_mask"], t["id"]) for t in label_table)
ver["label_volume_ratio_max"] = max((t["volume_ratio_to_corrected_mask"], t["id"]) for t in label_table)
ver["labels_with_zero_voxels"] = [t["id"] for t in label_table if t["voxels"] == 0]
# registration slices <-> meshes: label-volume centroid through volume.json's affine vs the GLB mesh centroid
val = json.loads((WORK / "meshes" / "validation.json").read_text())["structures"]
reg = {}
for t in label_table:
    if t["centroid_m"] is None:
        continue
    d = np.linalg.norm(np.array(t["centroid_m"]) - np.array(val[t["id"]]["centroid_mesh_m"])) * 1000
    reg[t["id"]] = round(float(d), 3)
ver["slice_vs_mesh_centroid_mm"] = {"max": max(reg.values()), "worst": max(reg, key=reg.get), "mean": round(float(np.mean(list(reg.values()))), 3),
                                    "per_structure": reg}
ver["total_bytes"] = sz_int + sz_lab + (OUT / "volume.json").stat().st_size
ver["defacing"] = deface["additional_blanking_in_this_export"]
(CHK / "volume_verification.json").write_text(json.dumps(ver, indent=1) + "\n")
np.save(CHK / "ct_exported_hu.npy", ct_out)
np.save(CHK / "blank_mask.npy", blank)
print(json.dumps({k: v for k, v in ver.items() if k != "slice_vs_mesh_centroid_mm"}, indent=1))
print("slice vs mesh centroid (mm): max", ver["slice_vs_mesh_centroid_mm"]["max"], ver["slice_vs_mesh_centroid_mm"]["worst"],
      "mean", ver["slice_vs_mesh_centroid_mm"]["mean"])
print("dims", [ni, nj, nk], "atlas", a_int.shape[::-1], "k_chin", k_chin)
