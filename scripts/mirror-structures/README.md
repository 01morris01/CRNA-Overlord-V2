# Mirror structure pack (head and neck study guide)

Builds `world/mirror/hn-structures.json` and `hn-structures.bin`, the structure picker data for the X-Ray Mirror.

* `catalog.py` is the list: every structure in the BIOL 520 head and neck study guide, its section, the guide's notes,
  and how it is shown (a BodyParts3D mesh, part of a mesh, a pin, or a traced path marked approximate).
* `landmarks.py` places the foramina, processes and other points on the BodyParts3D skull.
* `fit_transforms.py` fits BodyParts3D 4.0 (skull) and 3.0 (face muscles) onto the mirror's own meshes.
* `build.py` writes the pack, already in the mirror's head coordinates (cm).

Inputs (not committed, large):

* `BP3D4`: unzipped `isa_BP3D_4.0_obj_99.zip` from https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
* `BP3D3`: the STL folder of https://github.com/Kevin-Mattheus-Moerman/BodyParts3D (only the face muscle FMA ids in `catalog.py` are needed)

```
pip install numpy scipy trimesh fast_simplification matplotlib
export BP3D4=/path/to/isa_BP3D_4.0_obj_99 BP3D3=/path/to/stl
python3 fit_transforms.py
python3 build.py ../../world/mirror
```

To add or fix a structure, edit `catalog.py` (or a point in `landmarks.py`) and rebuild.
