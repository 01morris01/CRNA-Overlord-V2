#!/usr/bin/env python
"""Step 2e. Geometry of IDC series WITHOUT downloading pixel data.

For each (label, crdc_series_uuid) it lists the series in the public bucket and reads only the first bytes of every
instance over an HTTPS Range request (the DICOM header), then reports in-plane spacing, slice thickness, slice
spacing uniformity, cranio-caudal coverage, kernel, kVp and contrast tags. Used to shortlist before fetching.

    $HN_PY -I tools/headneck/08_idc_series_extent.py label=uuid [label=uuid ...]
        -> $HN_WORK/logs/idc_series_extent.json (appended/updated per label)
"""
import io
import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import pydicom
import requests

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
LOG = WORK / "logs" / "idc_series_extent.json"
S5 = str(Path(sys.executable).parent / "s5cmd")
HEAD_BYTES = 24 * 1024
sess = requests.Session()


def header(url):
    for nbytes in (HEAD_BYTES, 4 * HEAD_BYTES):
        r = sess.get(url, headers={"Range": f"bytes=0-{nbytes - 1}"}, timeout=60)
        r.raise_for_status()
        try:
            ds = pydicom.dcmread(io.BytesIO(r.content), stop_before_pixels=True, force=True)
            if "ImagePositionPatient" in ds and "PixelSpacing" in ds:
                return ds
        except Exception:
            pass
    return None


results = json.loads(LOG.read_text()) if LOG.exists() else {}
for arg in sys.argv[1:]:
    label, uuid = arg.split("=", 1)
    names, bucket = [], None
    for bucket in ("idc-open-data", "idc-open-data-two", "idc-open-data-cr"):   # IDC's three public buckets
        p = subprocess.run([S5, "--no-sign-request", "ls", f"s3://{bucket}/{uuid}/"], capture_output=True, text=True)
        names = [ln.split()[-1] for ln in p.stdout.split("\n") if ln.strip().endswith(".dcm")]
        if names:
            break
    if not names:
        print(label, "NOT FOUND in public buckets")
        continue
    urls = [f"https://{bucket}.s3.amazonaws.com/{uuid}/{n}" for n in names]
    with ThreadPoolExecutor(8) as ex:
        hs = [h for h in ex.map(header, urls) if h is not None]
    h0 = hs[0]
    iop = np.array([float(x) for x in h0.ImageOrientationPatient])
    normal = np.cross(iop[:3], iop[3:])
    d = np.sort(np.array([[float(x) for x in h.ImagePositionPatient] for h in hs]) @ normal)
    dz = np.diff(d)
    rec = {
        "crdc_series_uuid": uuid, "n_listed": len(names), "n_headers": len(hs),
        "PatientID": str(h0.get("PatientID")), "age": str(h0.get("PatientAge")), "sex": str(h0.get("PatientSex")),
        "StudyDescription": str(h0.get("StudyDescription")), "SeriesDescription": str(h0.get("SeriesDescription")),
        "model": f"{h0.get('Manufacturer')} {h0.get('ManufacturerModelName')}",
        "PixelSpacing": [float(x) for x in h0.PixelSpacing], "SliceThickness": float(h0.get("SliceThickness", 0) or 0),
        "slice_spacing_min_max_median": [float(dz.min()), float(dz.max()), float(np.median(dz))] if len(dz) else None,
        "coverage_mm": float(d[-1] - d[0] + (np.median(dz) if len(dz) else 0)),
        "kernel": str(h0.get("ConvolutionKernel")), "kVp": str(h0.get("KVP")),
        "contrast": str(h0.get("ContrastBolusAgent")), "FOV": str(h0.get("ReconstructionDiameter")),
        "position": str(h0.get("PatientPosition")), "IOP": iop.round(3).tolist(), "ImageType": str(h0.get("ImageType")),
        "tilt": str(h0.get("GantryDetectorTilt")),
    }
    results[label] = rec
    print(label, json.dumps(rec))
    LOG.write_text(json.dumps(results, indent=1) + "\n")
