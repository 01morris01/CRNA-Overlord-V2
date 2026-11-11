#!/usr/bin/env python3
"""fetch_polyhaven.py: download the Poly Haven assets the institute level uses, and write a manifest for the ledger.
Everything on Poly Haven is CC0 (https://polyhaven.com/license). Files go OUTSIDE the repo; only what the level build
bakes or converts ends up in assets/.
   python3 tools/fetch_polyhaven.py DEST_DIR"""
import json, os, sys, urllib.request
DEST = sys.argv[1]; UA = {"User-Agent": "overlord-asset-fetch"}
TEX = {  # id: resolution
 "large_floor_tiles_02": "2k", "large_grey_tiles": "2k", "marble_01": "1k", "concrete_floor_02": "2k", "concrete_wall_006": "2k", "concrete_wall_008": "2k", "white_plaster_02": "1k", "plastered_wall_04": "1k",
 "oak_veneer_01": "1k", "black_oak_veneer": "1k", "metal_plate": "1k", "fabric_pattern_07": "1k", "leather_white": "1k", "rubber_tiles": "1k", "ceiling_interior": "1k", "brushed_concrete": "1k", "terrazzo_tiles": "1k" }
HDRI = {"kloofendal_48d_partly_cloudy_puresky": "2k"}
MODELS = ["ArmChair_01", "Sofa_01", "CoffeeTable_01", "Ottoman_01", "Shelf_01", "WoodenTable_02", "potted_plant_01", "potted_plant_02", "potted_plant_04", "book_encyclopedia_set_01", "desk_lamp_arm_01", "ceramic_vase_03", "modern_arm_chair_01", "side_table_01", "steel_frame_shelves_03", "wooden_bench_01", "plastic_monobloc_chair_01", "folding_wooden_stool"]
def get(u): return json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60))
def dl(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0: return os.path.getsize(path)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=180) as r, open(path, "wb") as f: f.write(r.read())
    return os.path.getsize(path)
man = {"license": "CC0 1.0 (https://polyhaven.com/license)", "textures": {}, "hdris": {}, "models": {}}; total = 0
for a, res in TEX.items():
    try: f = get(f"https://api.polyhaven.com/files/{a}")
    except Exception as e: print("skip texture", a, str(e)[:40]); continue
    got = {}
    for key, short in (("Diffuse", "diff"), ("nor_gl", "nor"), ("Rough", "rough"), ("AO", "ao")):
        e = f.get(key, {}).get(res, {}).get("jpg")
        if e: total += dl(e["url"], f"{DEST}/textures/{a}/{a}_{short}.jpg"); got[short] = e["url"]
    man["textures"][a] = {"resolution": res, "files": got, "page": f"https://polyhaven.com/a/{a}"}; print("texture", a, list(got))
for a, res in HDRI.items():
    f = get(f"https://api.polyhaven.com/files/{a}"); e = f["hdri"][res]["hdr"]; total += dl(e["url"], f"{DEST}/hdri/{a}_{res}.hdr"); e1 = f["hdri"]["1k"]["hdr"]; total += dl(e1["url"], f"{DEST}/hdri/{a}_1k.hdr"); man["hdris"][a] = {"page": f"https://polyhaven.com/a/{a}"}; print("hdri", a)
for a in MODELS:
    try: f = get(f"https://api.polyhaven.com/files/{a}")
    except Exception as e: print("skip model", a, str(e)[:40]); continue
    g = f.get("gltf", {}).get("1k", {}).get("gltf")
    if not g: print("skip model (no gltf)", a); continue
    total += dl(g["url"], f"{DEST}/models/{a}/{a}.gltf")
    for rel, inc in g.get("include", {}).items(): total += dl(inc["url"], f"{DEST}/models/{a}/{rel}")
    man["models"][a] = {"page": f"https://polyhaven.com/a/{a}"}; print("model", a, len(g.get("include", {})), "files")
json.dump(man, open(f"{DEST}/manifest.json", "w"), indent=1); print(f"total {total/1e6:.0f} MB; {len(man['textures'])} textures, {len(man['models'])} models")
