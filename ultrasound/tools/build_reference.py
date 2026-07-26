#!/usr/bin/env python
"""Precompute compact ground truth reference artifacts for Plexus Studio.

Derives, per studio clip, the real nerve mask contours (from ac_masks) and the
real needle tip/tail coordinates (from needle_coordinates). Writes one JSON per
clip into studio/reference/. This is DERIVED from the real dataset, nothing is
fabricated. Clips whose id has no needle_coordinates file are marked needle
absent, which is the truth for s005 and s187.

Run: .venv/bin/python studio/tools/build_reference.py
"""
import os
import glob
import json
import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.dirname(HERE)
REPO = os.path.dirname(STUDIO)
SONO = os.path.join(REPO, "brachial_plexus", "data", "Sonosite")
OUT = os.path.join(STUDIO, "reference")

CLIPS = ["s005", "s071", "s123", "s187", "s311"]
FRAME_W, FRAME_H = 512, 360
EPSILON = 1.5  # contour simplification, pixels


def mask_contours(mask_path):
    m = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
    if m is None:
        return []
    if m.shape != (FRAME_H, FRAME_W):
        m = cv2.resize(m, (FRAME_W, FRAME_H), interpolation=cv2.INTER_NEAREST)
    _, binm = cv2.threshold(m, 127, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(binm, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    out = []
    for c in contours:
        if cv2.contourArea(c) < 8:  # drop specks
            continue
        approx = cv2.approxPolyDP(c, EPSILON, True)
        pts = [[int(p[0][0]), int(p[0][1])] for p in approx]
        if len(pts) >= 3:
            out.append(pts)
    return out


def load_needle(sid):
    path = os.path.join(SONO, "needle", "needle_coordinates", f"{sid}.txt")
    if not os.path.exists(path):
        return None
    with open(path) as f:
        return json.load(f)


def build_clip(sid):
    mask_dir = os.path.join(SONO, "ac_masks", sid)
    files = sorted(glob.glob(os.path.join(mask_dir, f"{sid}_*.jpg")))
    needle = load_needle(sid)
    frames = []
    nerve_frames = 0
    needle_frames = 0
    for f in files:
        base = os.path.basename(f)
        idx = int(base.replace(f"{sid}_", "").replace(".jpg", ""))
        contours = mask_contours(f)
        if contours:
            nerve_frames += 1
        entry = {"i": idx, "nerve": contours}
        if needle is not None and str(idx) in needle:
            nd = needle[str(idx)]
            # start is the tip, stop is the tail near skin, per dataset readme
            entry["needleTip"] = [int(nd["start"][0]), int(nd["start"][1])]
            entry["needleTail"] = [int(nd["stop"][0]), int(nd["stop"][1])]
            needle_frames += 1
        frames.append(entry)
    return {
        "sid": sid,
        "frameW": FRAME_W,
        "frameH": FRAME_H,
        "frameCount": len(files),
        "hasNeedle": needle is not None,
        "nerveFrames": nerve_frames,
        "needleFrames": needle_frames,
        "source": "brachial_plexus/data/Sonosite ac_masks and needle_coordinates",
        "frames": frames,
    }


def main():
    os.makedirs(OUT, exist_ok=True)
    summary = []
    for sid in CLIPS:
        data = build_clip(sid)
        outpath = os.path.join(OUT, f"{sid}.json")
        with open(outpath, "w") as f:
            json.dump(data, f, separators=(",", ":"))
        size = os.path.getsize(outpath)
        summary.append(
            f"{sid}: {data['frameCount']} frames, nerve on {data['nerveFrames']}, "
            f"needle {'present ' + str(data['needleFrames']) + ' frames' if data['hasNeedle'] else 'ABSENT'}, "
            f"{size} bytes"
        )
    print("\n".join(summary))


if __name__ == "__main__":
    main()
