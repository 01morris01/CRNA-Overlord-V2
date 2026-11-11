#!/usr/bin/env python
"""Step 2b. Examine the TotalSegmentator training dataset on Zenodo WITHOUT downloading the 37 GB archive.

Reads the zip's central directory and single members over HTTP range requests (package `remotezip`), then
  - saves meta.csv (the dataset's own metadata table) to the work area,
  - shortlists head / neck studies from it,
  - optionally fetches the CT of named subjects (a few MB each) for visual inspection.

    $HN_PY -I tools/headneck/05_zenodo_totalseg_dataset_peek.py                 # listing + meta.csv + shortlist
    $HN_PY -I tools/headneck/05_zenodo_totalseg_dataset_peek.py s0123 s0456     # also fetch these subjects' ct.nii.gz
"""
import csv
import io
import json
import os
import sys
import time
from pathlib import Path

from remotezip import RemoteZip

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
OUT = WORK / "data" / "zenodo_totalseg_v300"
OUT.mkdir(parents=True, exist_ok=True)
LOGS = WORK / "logs"
LOGS.mkdir(parents=True, exist_ok=True)

RECORD = "22688904"  # v3.0.0, DOI 10.5281/zenodo.22688904 (concept DOI 10.5281/zenodo.6802613), CC BY 4.0
URL = f"https://zenodo.org/api/records/{RECORD}/files/Totalsegmentator_dataset_v300.zip/content"
HEADERS = {"User-Agent": "python-remotezip (single-subject fetch for an anatomy teaching asset)"}

t0 = time.time()
with RemoteZip(URL, headers=HEADERS) as z:
    infos = z.infolist()
    print(f"central directory: {len(infos)} entries in {time.time()-t0:.1f}s")
    names = [i.filename for i in infos]
    listing = LOGS / "zenodo_totalseg_v300_listing.txt"
    listing.write_text("\n".join(f"{i.file_size}\t{i.filename}" for i in infos) + "\n")
    top = sorted({n.split("/")[0] for n in names})
    print("top-level entries:", len(top), top[:5], "...", [t for t in top if not t.startswith("s")][:10])
    meta_name = next((n for n in names if n.endswith("meta.csv")), None)
    prefix = meta_name[: -len("meta.csv")] if meta_name else ""   # e.g. "Totalsegmentator_dataset_v300/"
    print("meta table:", meta_name)
    if meta_name:
        raw = z.read(meta_name)
        (OUT / "meta.csv").write_bytes(raw)
        txt = raw.decode("utf-8-sig", "replace")
        delim = ";" if txt.split("\n")[0].count(";") > txt.split("\n")[0].count(",") else ","
        rows = list(csv.DictReader(io.StringIO(txt), delimiter=delim))
        print("meta columns:", list(rows[0].keys()), "rows:", len(rows))
        key = next(k for k in rows[0] if "study" in k.lower())
        from collections import Counter
        cnt = Counter(r[key] for r in rows)
        hn = {k: v for k, v in cnt.items() if any(t in k.lower() for t in ("neck", "head", "hals", "larynx", "carotid", "polytrauma", "whole", "spine", "angiography"))}
        print("study types mentioning head/neck/spine/whole body:", json.dumps(hn, indent=1))
        sizes = {i.filename: i.file_size for i in infos}
        short = []
        for r in rows:
            st = r[key].lower()
            if "neck" in st or "hals" in st or "larynx" in st or "carotid" in st:
                sid = r.get("image_id") or list(r.values())[0]
                r["ct_bytes"] = sizes.get(f"{prefix}{sid}/ct.nii.gz")
                short.append(r)
        (LOGS / "zenodo_totalseg_neck_shortlist.json").write_text(json.dumps(short, indent=1) + "\n")
        print("neck-type studies:", len(short), "->", LOGS / "zenodo_totalseg_neck_shortlist.json")
        thin = [r for r in short if r["study_type"] in ("ct neck", "ct angiography neck") and r["pathology"] == "no_pathology"
                and float(r["slice_thickness"] or 9) <= 1.0]
        print("dedicated neck, no_pathology, source slice thickness <= 1 mm:")
        for r in thin:
            print("  ", r)
    for sid in sys.argv[1:]:
        member = f"{prefix}{sid}/ct.nii.gz"
        d = OUT / sid
        d.mkdir(exist_ok=True)
        t1 = time.time()
        (d / "ct.nii.gz").write_bytes(z.read(member))
        print(f"fetched {member}: {(d/'ct.nii.gz').stat().st_size/1e6:.1f} MB in {time.time()-t1:.1f}s")
