#!/usr/bin/env python
"""Step 2a. Shortlist head-and-neck CT series in the NCI Imaging Data Commons (IDC) by licence and coverage.

Uses the `idc-index` package (a local parquet index; no account, no sign-in). For each shortlisted series it
downloads TWO DICOM instances anonymously from the public IDC bucket (s3://idc-open-data, --no-sign-request)
only to read the headers (spacing, slice thickness, kernel, contrast, de-identification tags).

    $HN_PY -I tools/headneck/04_idc_shortlist.py            # query + header peek
Outputs (work area): logs/idc_neck_ct_candidates.csv, logs/idc_header_peek.json
"""
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

import pandas as pd
import pydicom
from idc_index import IDCClient

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
LOGS = WORK / "logs"
LOGS.mkdir(parents=True, exist_ok=True)
S5 = str(Path(sys.executable).parent / "s5cmd")

c = IDCClient()
print("IDC data version:", c.get_idc_version())

# 1. every CT series whose body part / description says neck, thyroid, larynx or carotid, >=120 instances,
#    under a licence that allows redistribution of derivatives (CC BY x.0, not NC).
q = """
select collection_id, PatientID, PatientAge, PatientSex, StudyDate, StudyDescription, SeriesNumber, SeriesDescription,
       BodyPartExamined, Manufacturer, ManufacturerModelName, instanceCount, round(series_size_MB,1) mb,
       license_short_name, source_DOI, crdc_series_uuid, SeriesInstanceUID, StudyInstanceUID
from index
where Modality='CT' and license_short_name like 'CC BY %' and license_short_name not like '%NC%' and instanceCount>=120 and (
   upper(BodyPartExamined) like '%NECK%' or lower(StudyDescription) like '%neck%' or lower(SeriesDescription) like '%neck%'
   or upper(BodyPartExamined) like '%THYROID%' or lower(StudyDescription) like '%thyroid%'
   or lower(StudyDescription) like '%larynx%' or lower(StudyDescription) like '%carotid%')
order by collection_id, PatientID, instanceCount desc
"""
df = c.sql_query(q)
df.to_csv(LOGS / "idc_neck_ct_candidates.csv", index=False)
print(len(df), "candidate series ->", LOGS / "idc_neck_ct_candidates.csv")
print(df.groupby(["collection_id", "license_short_name"]).size().to_string())

# Collections that hold head-and-neck RADIOLOGY in TCIA but are absent from IDC (restricted licence there):
q_hn = """select collection_id, license_short_name, string_agg(distinct Modality, ',') modalities, count(*) n_series
from index where lower(collection_id) like '%hn%' or lower(collection_id) like '%head%' or lower(collection_id) like '%neck%'
   or lower(collection_id) like '%opc%' or lower(collection_id) like '%radcure%' group by 1,2 order by 1"""
print("\nhead/neck-named collections present in IDC:\n", c.sql_query(q_hn).to_string())

# 2. header peek for dedicated, contrast-enhanced, thin-slice neck studies picked from the table above
PEEK = [  # (PatientID, SeriesNumber, study description filter)
    ("C3N-02948", "4"), ("C3N-02948", "3"),
    ("EAY131-7978834", "3"),
    ("AP-RMFZ", "6"), ("AP-RMFZ", "5"),
    ("EAY131-8784141", "6"),
    ("TCGA-E3-A3E5", None),
]
TAGS = ["Manufacturer", "ManufacturerModelName", "StudyDescription", "SeriesDescription", "PatientAge", "PatientSex",
        "PixelSpacing", "SliceThickness", "SpacingBetweenSlices", "Rows", "Columns", "ReconstructionDiameter",
        "ConvolutionKernel", "KVP", "ContrastBolusAgent", "ContrastBolusRoute", "PatientPosition",
        "ImageOrientationPatient", "ImagePositionPatient", "GantryDetectorTilt", "BodyPartExamined",
        "PatientIdentityRemoved", "DeidentificationMethod", "LongitudinalTemporalInformationModified",
        "BurnedInAnnotation", "RescaleSlope", "RescaleIntercept"]

peek_out = []
for pid, sn in PEEK:
    sel = df[(df.PatientID == pid)]
    if sn is not None:
        sel = sel[sel.SeriesNumber.astype(str) == sn]
    for _, r in sel.head(1 if sn else 3).iterrows():
        with tempfile.TemporaryDirectory(prefix="idc_peek_") as td:
            ls = subprocess.run([S5, "--no-sign-request", "ls", f"s3://idc-open-data/{r.crdc_series_uuid}/"],
                                capture_output=True, text=True, check=True).stdout.split("\n")
            names = [ln.split()[-1] for ln in ls if ln.strip().endswith(".dcm")]
            for nm in names[:2]:
                subprocess.run([S5, "--no-sign-request", "cp", f"s3://idc-open-data/{r.crdc_series_uuid}/{nm}", td + "/"],
                               capture_output=True, text=True, check=True)
            recs = []
            for f in sorted(Path(td).glob("*.dcm")):
                ds = pydicom.dcmread(f, stop_before_pixels=True)
                rec = {t: (str(ds.get(t)) if ds.get(t) is not None else None) for t in TAGS}
                seq = ds.get("DeidentificationMethodCodeSequence")
                if seq:
                    rec["DeidentificationMethodCodes"] = [f"{i.get('CodeValue')}:{i.get('CodeMeaning')}" for i in seq]
                recs.append(rec)
        z = sorted(float(eval(x["ImagePositionPatient"])[2]) for x in recs)
        info = {"collection_id": r.collection_id, "PatientID": pid, "SeriesNumber": str(r.SeriesNumber),
                "instanceCount": int(r.instanceCount), "license": r.license_short_name, "source_DOI": r.source_DOI,
                "SeriesInstanceUID": r.SeriesInstanceUID, "crdc_series_uuid": r.crdc_series_uuid, "header": recs[0]}
        peek_out.append(info)
        h = recs[0]
        print(f"\n{r.collection_id} {pid} s{r.SeriesNumber} n={r.instanceCount} [{r.license_short_name}]")
        for t in TAGS:
            if h.get(t) is not None:
                print(f"   {t}: {h[t]}")
        if "DeidentificationMethodCodes" in h:
            print("   DeidentificationMethodCodes:", h["DeidentificationMethodCodes"])

(LOGS / "idc_header_peek.json").write_text(json.dumps(peek_out, indent=1) + "\n")
print("\nwrote", LOGS / "idc_header_peek.json")
