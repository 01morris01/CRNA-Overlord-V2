#!/usr/bin/env python
"""Step 2c. Fetch ONE DICOM series from the NCI Imaging Data Commons and convert it to NIfTI.

Anonymous download from the public bucket s3://idc-open-data (s5cmd --no-sign-request; no account).
The series is addressed by its IDC `crdc_series_uuid` (from logs/idc_neck_ct_candidates.csv).

    $HN_PY -I tools/headneck/06_fetch_idc_series.py <crdc_series_uuid> <label>
        -> $HN_WORK/data/idc/<label>/dicom/*.dcm, ct.nii.gz, dicom_meta.json

Conversion: SimpleITK ImageSeriesReader (GDCM ordering by ImagePositionPatient), written as NIfTI.
HU are the stored values after RescaleSlope/Intercept. The script also re-derives the geometry straight from
the DICOM tags (independent of SimpleITK) and asserts both agree, because the exhibit depends on left/right.
"""
import json
import os
import subprocess
import sys
from pathlib import Path

import numpy as np
import pydicom
import SimpleITK as sitk

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
S5 = str(Path(sys.executable).parent / "s5cmd")

uuid, label = sys.argv[1], sys.argv[2]
out = WORK / "data" / "idc" / label
dcm = out / "dicom"
dcm.mkdir(parents=True, exist_ok=True)

if not any(dcm.glob("*.dcm")):
    for bucket in ("idc-open-data", "idc-open-data-two", "idc-open-data-cr"):   # IDC's three public buckets
        r = subprocess.run([S5, "--no-sign-request", "cp", f"s3://{bucket}/{uuid}/*", str(dcm) + "/"],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if r.returncode == 0 and any(dcm.glob("*.dcm")):
            break
files = sorted(dcm.glob("*.dcm"))
print(len(files), "instances,", round(sum(f.stat().st_size for f in files) / 1e6, 1), "MB")

# ---- read with SimpleITK -------------------------------------------------------------------------
reader = sitk.ImageSeriesReader()
ids = reader.GetGDCMSeriesIDs(str(dcm))
assert len(ids) == 1, f"expected one series, found {ids}"
names = reader.GetGDCMSeriesFileNames(str(dcm), ids[0])
reader.SetFileNames(names)
img = reader.Execute()
print("size", img.GetSize(), "spacing", np.round(img.GetSpacing(), 4), "origin", np.round(img.GetOrigin(), 3))
print("direction", np.round(img.GetDirection(), 4))
sitk.WriteImage(img, str(out / "ct.nii.gz"), useCompression=True)

# ---- independent geometry check from the raw tags --------------------------------------------------
hdrs = [pydicom.dcmread(f, stop_before_pixels=True) for f in files]
iop = np.array([float(x) for x in hdrs[0].ImageOrientationPatient])
row_dir, col_dir = iop[:3], iop[3:]          # direction of increasing column index / increasing row index (LPS)
normal = np.cross(row_dir, col_dir)
pos = np.array([[float(x) for x in h.ImagePositionPatient] for h in hdrs])
d = pos @ normal
order = np.argsort(d)
dz = np.diff(d[order])
meta = {
    "crdc_series_uuid": uuid,
    "n_instances": len(files),
    "ImageOrientationPatient": iop.tolist(),
    "slice_normal_LPS": normal.tolist(),
    "slice_spacing_mm_min_max_mean": [float(dz.min()), float(dz.max()), float(dz.mean())],
    "uniform_spacing": bool(np.allclose(dz, dz.mean(), atol=1e-3)),
    "z_range_LPS_mm": [float(d.min()), float(d.max())],
    "coverage_mm": float(d.max() - d.min() + dz.mean()),
}
keep = ["PatientID", "PatientAge", "PatientSex", "StudyDate", "StudyDescription", "SeriesDescription", "SeriesNumber",
        "Modality", "Manufacturer", "ManufacturerModelName", "PixelSpacing", "SliceThickness", "KVP", "ConvolutionKernel",
        "ReconstructionDiameter", "ContrastBolusAgent", "PatientPosition", "Rows", "Columns", "BodyPartExamined",
        "RescaleSlope", "RescaleIntercept", "StudyInstanceUID", "SeriesInstanceUID", "PatientIdentityRemoved",
        "DeidentificationMethod", "LongitudinalTemporalInformationModified", "BurnedInAnnotation", "ExposureTime",
        "XRayTubeCurrent", "Exposure", "FilterType", "GantryDetectorTilt", "SpiralPitchFactor", "ProtocolName"]
h0 = hdrs[order[0]]
meta["tags"] = {k: (str(h0.get(k)) if h0.get(k) is not None else None) for k in keep}
seq = h0.get("DeidentificationMethodCodeSequence")
meta["tags"]["DeidentificationMethodCodeSequence"] = [f"{i.get('CodeValue')} {i.get('CodeMeaning')}" for i in seq] if seq else None
meta["sitk"] = {"size": list(img.GetSize()), "spacing": list(img.GetSpacing()), "origin": list(img.GetOrigin()),
                "direction": list(img.GetDirection())}
# SimpleITK direction columns must equal (row_dir, col_dir, +/-normal) and its origin the first slice position
D = np.array(img.GetDirection()).reshape(3, 3)
assert np.allclose(D[:, 0], row_dir, atol=1e-4) and np.allclose(D[:, 1], col_dir, atol=1e-4), "in-plane axes differ"
assert np.allclose(np.abs(D[:, 2]), np.abs(normal), atol=1e-4), "slice axis differs"
first = pos[order[0]] if np.dot(D[:, 2], normal) > 0 else pos[order[-1]]
assert np.allclose(img.GetOrigin(), first, atol=1e-2), (img.GetOrigin(), first)
assert abs(img.GetSpacing()[2] - dz.mean()) < 1e-3
meta["geometry_check"] = "SimpleITK volume geometry equals geometry derived directly from ImagePositionPatient/ImageOrientationPatient"
(out / "dicom_meta.json").write_text(json.dumps(meta, indent=1) + "\n")
print(json.dumps({k: meta[k] for k in ("slice_spacing_mm_min_max_mean", "uniform_spacing", "coverage_mm")}))
print("wrote", out / "ct.nii.gz", round((out / "ct.nii.gz").stat().st_size / 1e6, 1), "MB")
