"""Step 4d. Export the corrected Slicer segmentation as ONE label map on the working grid.

    "$HN_SLICER" --no-splash --no-main-window --python-script tools/headneck/15_slicer_export_labelmap.py

Input : $HN_WORK/review/slicer/TS_corrected.seg.nrrd
Output: $HN_WORK/review/slicer/corrected_labels_075.nii.gz   uint8, 0 = none, label id = position in the reviewed keep list (1..N)
        $HN_WORK/review/slicer/corrected_labels.json         {label id: structure id}, voxel counts
The corrected segments do not overlap (asserted here again), so one label per voxel loses nothing.
"""
import json
import os
import sys
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import slicer

import slicer_lib as L

HERE = os.path.dirname(os.path.abspath(__file__))
SCN = os.path.join(L.WORK, "review", "slicer")
P = L.log_open(os.path.join(SCN, "export_labelmap.log"))
try:
    keep = json.load(open(os.path.join(HERE, "14_decisions.json")))["keep"]
    ct = slicer.util.loadVolume(os.path.join(L.SUBJ, "ct_075.nii.gz"), properties={"name": "CT_075"})
    segNode = slicer.util.loadSegmentation(os.path.join(SCN, "TS_corrected.seg.nrrd"))
    seg = segNode.GetSegmentation()
    names = [seg.GetNthSegment(i).GetName() for i in range(seg.GetNumberOfSegments())]
    assert sorted(names) == sorted(keep), set(names) ^ set(keep)
    shape = slicer.util.arrayFromVolume(ct).shape
    lab = np.zeros(shape, np.uint8)
    counts = {}
    for i, nm in enumerate(keep, 1):
        m = L.seg_array(segNode, seg.GetSegmentIdBySegmentName(nm), ct)
        assert not (lab[m] > 0).any(), f"{nm} overlaps an earlier segment"
        lab[m] = i
        counts[nm] = int(m.sum())
    lm = slicer.mrmlScene.AddNewNodeByClass("vtkMRMLLabelMapVolumeNode", "corrected_labels_075")
    slicer.util.updateVolumeFromArray(lm, lab)
    import vtk
    M = vtk.vtkMatrix4x4()
    ct.GetIJKToRASMatrix(M)
    lm.SetIJKToRASMatrix(M)
    ok = slicer.util.saveNode(lm, os.path.join(SCN, "corrected_labels_075.nii.gz"))
    L.save_json({"label_ids": {str(i): nm for i, nm in enumerate(keep, 1)}, "voxels_working_grid": counts,
                 "grid_shape_ijk": list(shape[::-1]), "slicer_version": slicer.app.applicationVersion},
                os.path.join(SCN, "corrected_labels.json"))
    P("saved label map:", ok, "labels", len(keep), "labelled voxels", int((lab > 0).sum()))
except Exception:
    P("ERROR", traceback.format_exc())
slicer.util.exit(0)
