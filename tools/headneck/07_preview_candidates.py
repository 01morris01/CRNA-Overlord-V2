#!/usr/bin/env python
"""Step 2d. Contact sheets of candidate CTs for visual inspection before committing to one.

    $HN_PY -I tools/headneck/07_preview_candidates.py <label>=<ct.nii.gz> [<label>=<ct.nii.gz> ...]
        -> $HN_WORK/review/candidates/<label>_overview.png   (sagittal, coronal, 10 axial levels; soft-tissue window)
        -> $HN_WORK/review/candidates/<label>_bone.png       (same sagittal/coronal in a bone window)

Images are reoriented to RAS+ for display only. Axial panels use the radiological convention
(patient RIGHT on the viewer's left, anterior up). These sheets stay in the work area (they can show a face).
"""
import os
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import nibabel as nib
import numpy as np

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
OUT = WORK / "review" / "candidates"
OUT.mkdir(parents=True, exist_ok=True)


def win(a, level, width):
    lo, hi = level - width / 2, level + width / 2
    return np.clip((a - lo) / (hi - lo), 0, 1)


for arg in sys.argv[1:]:
    label, path = arg.split("=", 1)
    im = nib.as_closest_canonical(nib.load(path))
    vol = np.asanyarray(im.dataobj).astype(np.float32)      # axes: R, A, S
    zx, zy, zz = im.header.get_zooms()[:3]
    nx, ny, nz = vol.shape
    print(label, vol.shape, (zx, zy, zz), "extent mm", (nx * zx, ny * zy, nz * zz), "HU range", vol.min(), vol.max())

    # body midline: centre of mass of tissue (> -300 HU) in the middle third of the stack
    body = vol[:, :, nz // 3: 2 * nz // 3] > -300
    cx = int(round((body.sum(axis=(1, 2)) * np.arange(nx)).sum() / max(body.sum(), 1)))
    cy = int(round((body.sum(axis=(0, 2)) * np.arange(ny)).sum() / max(body.sum(), 1)))

    for name, (lv, wd) in {"overview": (40, 400), "bone": (400, 2000)}.items():
        fig = plt.figure(figsize=(20, 14), facecolor="black")
        gs = fig.add_gridspec(3, 6, hspace=0.05, wspace=0.03)
        ax = fig.add_subplot(gs[0:2, 0:2])
        ax.imshow(win(vol[cx, :, :].T, lv, wd), cmap="gray", origin="lower", aspect=zz / zy)
        ax.set_title(f"{label}  sagittal x={cx}  (anterior right)", color="w", fontsize=11)
        ax.axis("off")
        ax = fig.add_subplot(gs[0:2, 2:4])
        ax.imshow(win(vol[::-1, cy, :].T, lv, wd), cmap="gray", origin="lower", aspect=zz / zx)
        ax.set_title(f"coronal y={cy}  (patient R on viewer left)", color="w", fontsize=11)
        ax.axis("off")
        levels = np.linspace(0.04, 0.96, 10)
        slots = [gs[0, 4], gs[0, 5], gs[1, 4], gs[1, 5], gs[2, 0], gs[2, 1], gs[2, 2], gs[2, 3], gs[2, 4], gs[2, 5]]
        for f, slot in zip(levels[::-1], slots):
            k = int(round(f * (nz - 1)))
            ax = fig.add_subplot(slot)
            ax.imshow(win(vol[::-1, :, k].T, lv, wd), cmap="gray", origin="lower", aspect=zy / zx)
            ax.set_title(f"axial k={k}  z={k * zz:.0f} mm", color="w", fontsize=9)
            ax.text(0.02, 0.5, "R", color="yellow", transform=ax.transAxes, fontsize=10)
            ax.axis("off")
        p = OUT / f"{label}_{name}.png"
        fig.savefig(p, dpi=70, facecolor="black", bbox_inches="tight")
        plt.close(fig)
        print("  wrote", p)
