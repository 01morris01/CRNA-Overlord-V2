"""Step 5a. Export one RAW surface mesh per structure from the corrected Slicer segmentation.

    "$HN_SLICER" --no-splash --no-main-window --python-script tools/headneck/16_slicer_export_meshes.py

Input : $HN_WORK/review/slicer/TS_corrected.seg.nrrd  (segments named by structure id)
Output: $HN_WORK/meshes/raw/<id>.ply   binary PLY, vertices in RAS millimetres of the patient frame G
        $HN_WORK/meshes/raw_meshes.json  (points, triangles, enclosed volume, area per structure)

"Raw" means Slicer's binary-labelmap -> closed-surface conversion with smoothing and decimation switched OFF
(conversion parameters "Smoothing factor" = 0, "Decimation factor" = 0): the voxel-faithful marching-cubes
surface of the 0.75 mm mask. All smoothing / decimation happens afterwards in Blender (17_blender_optimize.py).
"""
import json
import os
import sys
import time
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import slicer
import vtk

import slicer_lib as L

RAW = os.path.join(L.WORK, "meshes", "raw")
os.makedirs(RAW, exist_ok=True)
P = L.log_open(os.path.join(L.WORK, "meshes", "slicer_export_meshes.log"))
try:
    t0 = time.time()
    P("Slicer", slicer.app.applicationVersion, slicer.app.repositoryRevision)
    segNode = slicer.util.loadSegmentation(os.path.join(L.WORK, "review", "slicer", "TS_corrected.seg.nrrd"))
    seg = segNode.GetSegmentation()
    seg.SetConversionParameter("Smoothing factor", "0.0")
    seg.SetConversionParameter("Decimation factor", "0.0")
    seg.SetConversionParameter("Compute surface normals", "0")
    seg.SetConversionParameter("Joint smoothing", "0")
    segNode.RemoveClosedSurfaceRepresentation()
    ok = segNode.CreateClosedSurfaceRepresentation()
    P("closed surface conversion:", ok, round(time.time() - t0, 1), "s")
    out = {"slicer_version": slicer.app.applicationVersion, "slicer_revision": slicer.app.repositoryRevision,
           "conversion": {"Smoothing factor": 0.0, "Decimation factor": 0.0, "Joint smoothing": 0},
           "coordinates": "RAS mm, patient frame G", "meshes": {}}
    for i in range(seg.GetNumberOfSegments()):
        sid = seg.GetNthSegmentID(i)
        name = seg.GetNthSegment(i).GetName()
        pd = vtk.vtkPolyData()
        segNode.GetClosedSurfaceRepresentation(sid, pd)
        tri = vtk.vtkTriangleFilter()
        tri.SetInputData(pd)
        tri.PassLinesOff()
        tri.PassVertsOff()
        clean = vtk.vtkCleanPolyData()
        clean.SetInputConnection(tri.GetOutputPort())
        clean.PointMergingOn()
        clean.Update()
        mesh = clean.GetOutput()
        mp = vtk.vtkMassProperties()
        mp.SetInputData(mesh)
        mp.Update()
        w = vtk.vtkPLYWriter()
        w.SetFileName(os.path.join(RAW, f"{name}.ply"))
        w.SetInputData(mesh)
        w.SetFileTypeToBinary()
        w.SetArrayName("")            # geometry only
        w.Write()
        b = mesh.GetBounds()
        out["meshes"][name] = {"points": mesh.GetNumberOfPoints(), "triangles": mesh.GetNumberOfPolys(),
                               "volume_mL": round(mp.GetVolume() / 1000.0, 4), "area_mm2": round(mp.GetSurfaceArea(), 2),
                               "bounds_RAS_mm": [round(x, 3) for x in b]}
        P(f"{name:36} {mesh.GetNumberOfPolys():9d} tris  {mp.GetVolume() / 1000.0:9.3f} mL")
    L.save_json(out, os.path.join(L.WORK, "meshes", "raw_meshes.json"))
    P("DONE", len(out["meshes"]), "meshes", round(time.time() - t0, 1), "s")
except Exception:
    P("ERROR", traceback.format_exc())
slicer.util.exit(0)
