#!/usr/bin/env python
"""Step 2f. Fetch the chosen subject and build the working volumes.

Chosen: TotalSegmentator training dataset v3.0.0 (Zenodo 10.5281/zenodo.22688904, CC BY 4.0), subject s0527
("ct angiography neck"). Only this subject's files are read from the 37 GB zip (HTTP range requests):
  ct.nii.gz                       the scan, 1.5 mm isotropic as published
  segmentations/<class>.nii.gz    the publisher's reviewed labels for the 117 `total` classes (used ONLY as an
                                  independent reference when reviewing the model output; never exported)

The published NIfTI has an OBLIQUE sform (the voxel axes are rotated ~1.5 degrees against the world axes, and the
float32 direction cosines are not orthonormal enough for ITK / 3D Slicer to open the file). This script therefore
defines the working PATIENT FRAME "G" = the image's own axes:

    R_G, A_G, S_G  (mm)  =  1.5 * (i, j, k)  +  t_G            (i -> Right, j -> Anterior, k -> Superior)

which is the published world frame rotated rigidly by Rot^T about the volume centre (Rot and the centre are
recorded in subject_info.json so every coordinate can be mapped back to the publisher's sform). No voxel is
resampled by this step. Everything downstream (masks, Slicer, meshes, browser volume) lives in frame G.

Outputs in $HN_WORK/data/s0527/:
  ct.nii.gz              as published (kept for provenance; sha256 recorded)
  ct_native_G.nii.gz     identical voxels, clean axis-aligned affine (frame G)
  ct_075.nii.gz          frame G, 0.75 mm isotropic = every published voxel split 2x2x2 (corners aligned,
                         cubic B-spline, clamped to the published HU range). Adds NO information; it only lets
                         the masks be drawn on a finer lattice. This is the TotalSegmentator input.
  publisher_labels_G.nii.gz + publisher_labels.json   the publisher's 117-class labels as one label map (frame G)
  subject_info.json

    $HN_PY -I tools/headneck/09_prepare_subject.py
"""
import hashlib
import json
import os
from pathlib import Path

import nibabel as nib
import numpy as np
import SimpleITK as sitk

SUBJECT = "s0527"
RECORD = "22688904"
ZIP_URL = f"https://zenodo.org/api/records/{RECORD}/files/Totalsegmentator_dataset_v300.zip/content"
PREFIX = "Totalsegmentator_dataset_v300/"

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
SUBJ = WORK / "data" / SUBJECT
GT = SUBJ / "publisher_segmentations"
SUBJ.mkdir(parents=True, exist_ok=True)
GT.mkdir(exist_ok=True)

# ---- 1. fetch (skips what is already there) --------------------------------------------------------
peeked = WORK / "data" / "zenodo_totalseg_v300" / SUBJECT / "ct.nii.gz"
need_ct = not (SUBJ / "ct.nii.gz").exists()
if need_ct and peeked.exists():
    (SUBJ / "ct.nii.gz").write_bytes(peeked.read_bytes())
    need_ct = False
need_gt = len(list(GT.glob("*.nii.gz"))) < 117
if need_ct or need_gt:
    from remotezip import RemoteZip
    with RemoteZip(ZIP_URL, headers={"User-Agent": "python-remotezip (single-subject fetch for an anatomy teaching asset)"}) as z:
        if need_ct:
            (SUBJ / "ct.nii.gz").write_bytes(z.read(f"{PREFIX}{SUBJECT}/ct.nii.gz"))
        if need_gt:
            members = [n for n in z.namelist() if n.startswith(f"{PREFIX}{SUBJECT}/segmentations/") and n.endswith(".nii.gz")]
            for n in members:
                (GT / Path(n).name).write_bytes(z.read(n))
            print("fetched", len(members), "publisher label files")

ct_path = SUBJ / "ct.nii.gz"
sha = hashlib.sha256(ct_path.read_bytes()).hexdigest()

# ---- 2. describe the published scan ----------------------------------------------------------------
im = nib.load(ct_path)
data = np.asanyarray(im.dataobj)
A = im.affine.astype(np.float64)
vox = np.array(im.header.get_zooms()[:3], dtype=np.float64)
assert np.allclose(vox, 1.5), vox
M = A[:3, :3]
# closest rotation to M/1.5 (polar decomposition via SVD)
U, s, Vt = np.linalg.svd(M / vox)
Rot = U @ Vt
assert np.linalg.det(Rot) > 0.999, "published affine is not a proper rotation (would mean a flip)"
angle_deg = float(np.degrees(np.arccos(np.clip((np.trace(Rot) - 1) / 2, -1, 1))))
non_orth = float(np.abs(M / vox - Rot).max())
axcodes = nib.aff2axcodes(A)
assert axcodes == ("R", "A", "S"), axcodes     # i -> Right, j -> Anterior, k -> Superior

shape = np.array(im.shape, dtype=np.float64)
centre_ijk = (shape - 1) / 2.0
centre_world = A[:3, :3] @ centre_ijk + A[:3, 3]
t_G = centre_world - vox * centre_ijk          # frame G: rotate world by Rot^T about the volume centre
AG = np.eye(4)
AG[:3, :3] = np.diag(vox)
AG[:3, 3] = t_G
# G <- world :  p_G = Rot^T (p_world - c) + c.  The published cosines are only approximately orthonormal, so the
# rigid model is checked at the eight volume corners and the residual is recorded.
corners = np.array([[x, y, z, 1.0] for x in (0, shape[0] - 1) for y in (0, shape[1] - 1) for z in (0, shape[2] - 1)])
resid = [float(np.linalg.norm(Rot.T @ ((A @ c)[:3] - centre_world) + centre_world - (AG @ c)[:3])) for c in corners]
rigid_residual_mm = max(resid)
assert rigid_residual_mm < 0.05, resid


def save_nifti(arr, affine, path, dtype):
    h = nib.Nifti1Header()
    h.set_data_dtype(dtype)
    out = nib.Nifti1Image(np.asarray(arr, dtype=dtype), affine, h)
    out.set_sform(affine, code=1)
    out.set_qform(affine, code=1)
    nib.save(out, path)


save_nifti(data, AG, SUBJ / "ct_native_G.nii.gz", np.int16)

info = {
    "subject": SUBJECT,
    "source": "TotalSegmentator dataset v3.0.0, Zenodo record 22688904, DOI 10.5281/zenodo.22688904 (concept DOI 10.5281/zenodo.6802613)",
    "license": "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/legalcode)",
    "zip_member": f"{PREFIX}{SUBJECT}/ct.nii.gz",
    "sha256_ct_nii_gz": sha,
    "bytes": ct_path.stat().st_size,
    "shape_ijk": list(map(int, im.shape)),
    "voxel_mm": vox.tolist(),
    "dtype": str(data.dtype),
    "hu_min_max": [float(data.min()), float(data.max())],
    "published_affine_ijk_to_world_RAS_mm": A.tolist(),
    "sform_code": int(im.header["sform_code"]), "qform_code": int(im.header["qform_code"]),
    "axis_codes": list(axcodes),
    "extent_mm": (shape * vox).tolist(),
    "published_affine_obliquity": {
        "rotation_matrix_Rot": Rot.tolist(),
        "rotation_angle_deg": angle_deg,
        "max_abs_deviation_of_direction_cosines_from_orthonormal": non_orth,
        "note": "world_RAS = Rot @ (1.5 * ijk) + t.  ITK/3D Slicer refuse the file as published (non-orthonormal float32 cosines).",
    },
    "frame_G": {
        "definition": "R_G,A_G,S_G (mm) = 1.5*(i,j,k) + t_G ; the image's own axes (i->Right, j->Anterior, k->Superior)",
        "affine_native_ijk_to_G_mm": AG.tolist(),
        "relation_to_published_world": "p_G = Rot^T @ (p_world - c) + c   (rigid; c = world position of the volume centre)",
        "pivot_c_world_mm": centre_world.tolist(),
        "max_residual_of_rigid_model_at_volume_corners_mm": rigid_residual_mm,
    },
}
meta_csv = WORK / "data" / "zenodo_totalseg_v300" / "meta.csv"
if meta_csv.exists():
    import csv, io
    rows = list(csv.DictReader(io.StringIO(meta_csv.read_text(encoding="utf-8-sig")), delimiter=";"))
    info["meta_csv_row"] = next(r for r in rows if r["image_id"] == SUBJECT)

# ---- 3. working grid: 2x2x2 split, corner aligned ---------------------------------------------------
img = sitk.ReadImage(str(SUBJ / "ct_native_G.nii.gz"))
sp = np.array(img.GetSpacing())
D = np.array(img.GetDirection()).reshape(3, 3)
new_sp = sp / 2.0
new_size = [int(sz * 2) for sz in img.GetSize()]
new_origin = np.array(img.GetOrigin()) - D @ (sp / 4.0)       # first sub-voxel centre sits a quarter voxel back
rs = sitk.ResampleImageFilter()
rs.SetInterpolator(sitk.sitkBSpline)
rs.SetOutputSpacing(new_sp.tolist())
rs.SetSize(new_size)
rs.SetOutputOrigin(new_origin.tolist())
rs.SetOutputDirection(img.GetDirection())
rs.SetDefaultPixelValue(float(data.min()))
rs.SetOutputPixelType(sitk.sitkFloat32)
up = rs.Execute(sitk.Cast(img, sitk.sitkFloat32))
up = sitk.Clamp(up, sitk.sitkFloat32, float(data.min()), float(data.max()))   # remove spline overshoot
up = sitk.Cast(sitk.Round(up), sitk.sitkInt16)
u = sitk.GetArrayFromImage(up).transpose(2, 1, 0)             # -> (i, j, k)
A75 = np.eye(4)
A75[:3, :3] = np.diag(vox / 2)
A75[:3, 3] = t_G - vox / 4
save_nifti(u, A75, SUBJ / "ct_075.nii.gz", np.int16)

im2 = nib.load(SUBJ / "ct_075.nii.gz")
assert nib.aff2axcodes(im2.affine) == ("R", "A", "S")
c1 = AG @ np.array([-0.5, -0.5, -0.5, 1]); c2 = im2.affine @ np.array([-0.5, -0.5, -0.5, 1])
e1 = AG @ np.array([*(shape - 0.5), 1]); e2 = im2.affine @ np.array([*(np.array(im2.shape) - 0.5), 1])
assert np.allclose(c1, c2, atol=1e-4) and np.allclose(e1, e2, atol=1e-4), (c1, c2, e1, e2)
bm = u.astype(np.float32).reshape(im.shape[0], 2, im.shape[1], 2, im.shape[2], 2).mean(axis=(1, 3, 5))
diff = bm - data.astype(np.float32)
info["working_grid"] = {
    "file": "ct_075.nii.gz", "shape_ijk": list(map(int, im2.shape)), "voxel_mm": (vox / 2).tolist(),
    "affine_ijk_to_G_mm": A75.tolist(), "axis_codes": list(nib.aff2axcodes(im2.affine)),
    "interpolation": "cubic B-spline (SimpleITK sitkBSpline), clamped to published HU range, rounded to int16",
    "relation": "native voxel (i,j,k) = working voxels (2i..2i+1, 2j..2j+1, 2k..2k+1); corners aligned",
    "block_mean_minus_native_HU": {"mean": float(diff.mean()), "abs_mean": float(np.abs(diff).mean()),
                                   "p99_abs": float(np.percentile(np.abs(diff), 99))},
}

# ---- 4. publisher labels -> one label map in frame G --------------------------------------------------
from totalsegmentator.map_to_binary import class_map
total = class_map["total"]
lab = np.zeros(im.shape, dtype=np.uint8)
present = {}
for idx, name in total.items():
    f = GT / f"{name}.nii.gz"
    if not f.exists():
        continue
    g = nib.load(f)
    assert g.shape == im.shape and np.allclose(g.affine, im.affine, atol=1e-3), name
    m = np.asanyarray(g.dataobj) > 0
    if m.any():
        lab[m] = idx
        present[name] = int(m.sum())
save_nifti(lab, AG, SUBJ / "publisher_labels_G.nii.gz", np.uint8)
(SUBJ / "publisher_labels.json").write_text(json.dumps(
    {"note": "publisher's reviewed labels for task `total` (subject is in the dataset's TRAIN split); reference only, not exported",
     "label_values": {str(k): v for k, v in total.items()}, "voxels_per_class_native_grid": present}, indent=1) + "\n")
info["publisher_labels_present"] = sorted(present, key=lambda n: -present[n])

(SUBJ / "subject_info.json").write_text(json.dumps(info, indent=1) + "\n")
print(json.dumps({k: info[k] for k in ("sha256_ct_nii_gz", "shape_ijk", "voxel_mm", "axis_codes", "extent_mm", "meta_csv_row")}, indent=1))
print("obliquity:", json.dumps(info["published_affine_obliquity"], indent=1))
print("frame G affine:", np.round(AG, 4).tolist())
print("working grid:", json.dumps(info["working_grid"], indent=1))
print("publisher labels present:", len(present), info["publisher_labels_present"])
