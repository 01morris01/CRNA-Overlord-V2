# zanatomy_export_plexus.py: how assets/models/plexus/plexus-right-zanatomy.glb was made from Z-Anatomy Startup.blend.
#   blender -b --disable-autoexec --factory-startup Startup.blend --python tools/zanatomy_export_plexus.py -- OUT.glb OUT.json
# Set the Draco option to False for the raw file that tools/audit_plexus.py reads.
import bpy, re, json, sys, bmesh
from mathutils import Vector
out_glb, out_json = sys.argv[sys.argv.index('--')+1:][:2]
LABEL_SUFFIX = re.compile(r"\.(g|i|j|s|t|[eo]\d*[lr]?)$")
def real(o): return o.type in ('MESH', 'CURVE') and not LABEL_SUFFIX.search(o.name)
ALL = [o for o in bpy.data.objects if real(o)]
BY = {o.name: o for o in ALL}

EXACT = {
 'nerve': ["Superior trunk of brachial plexus.r","Middle trunk of brachial plexus.r","Inferior trunk of brachial plexus.r",
   "Anterior division of superior trunk of brachial plexus.r","Posterior division of superior trunk of brachial plexus.r",
   "Anterior division of middle trunk of brachial plexus.r","Posterior division of middle trunk of brachial plexus.r",
   "Anterior division of inferior trunk of brachial plexus.r","Posterior division of inferior trunk of brachial plexus.r",
   "Posterior cord of brachial plexus.r",
   "Musculocutaneous nerve.r","Axillary nerve.r","Radial nerve.r","Median nerve.r","Ulnar nerve.r",
   "Suprascapular nerve.r","Long thoracic nerve.r","Dorsal scapular nerve.r","Lateral pectoral nerve.r","Medial pectoral nerve.r",
   "Thoracodorsal nerve.r","Superior subscapular nerve.r","Inferior subscapular nerve.r","Subclavian nerve.r","Medial antebrachial cutaneous nerve.r","Medial brachial cutaneous nerve.r","Lateral antebrachial cutaneous nerve.r","Vagus nerve (X).r"],
 'artery': ["Right subclavian artery","Axillary artery.r","Brachial artery.r","Right common carotid artery","Vertebral artery.r","Brachiocephalic trunk"],
 'vein': ["Right subclavian vein","Axillary vein.r","Internal jugular vein.r","External jugular vein.r","Right brachiocephalic vein","Cephalic vein.r"],
 'muscle': ["Scalenus anterior muscle.r","Scalenus medius muscle.r","Scalenus posterior muscle.r","Sternocleidomastoid muscle.r","Omohyoid muscle.r",
   "Subclavius muscle.r","Pectoralis minor muscle.r","Clavicular head of pectoralis major muscle.r","Sternocostal head of pectoralis major muscle.r",
   "(Abdominal part of pectoralis major muscle).r","Clavicular part of deltoid muscle.r","Acromial part of deltoid muscle.r","Scapular spinal part of deltoid muscle.r",
   "Coracobrachialis muscle.r","Short head of biceps brachii.r","Long head of biceps brachii.r","Brachialis muscle.r",
   "Long head of triceps brachii.r","Lateral head of triceps brachii.r","Medial head of triceps brachii.r",
   "Descending part of trapezius muscle.r","Transverse part of trapezius muscle.r","Ascending part of trapezius muscle.r",
   "Levator scapulae.r","Subscapularis muscle.r","Serratus anterior muscle.r","Latissimus dorsi muscle.r","Teres major muscle.r","Longus colli muscle.r"],
 'bone': ["Clavicle.r","First rib.r","Scapula.r","Humerus.r","Radius.r","Ulna.r","Manubrium of sternum","Hyoid bone","Atlas (C1)","Axis (C2)","Mandible"],
 'airway': ["Thyroid cartilage","Cricoid cartilage","Trachea","Thyroid gland"],
}
REGEX = {   # things whose exact names I did not know: found by pattern, reported back
 'nerve': [r"^Phrenic nerve\.r$", r"(root|branch).*median nerve.*\.r$", r"^Medial cutaneous nerve of (arm|forearm)\.r$", r"^(Anterior|Ventral) ram.*(C[5-8]|T1|cervical|thoracic).*", r"^(Fifth|Sixth|Seventh|Eighth) cervical nerve.*", r"^(C[5-8]|T1)\b.*nerve", r"spinal nerve.*(C[5-8]|T1)"],
 'bone': [r"^(Second|Third) rib\.r$", r"cervical vertebra", r"^(First|Second|Third) thoracic vertebra", r"^Vertebra (C[3-7]|T[1-3])", r"\((C[3-7]|T[1-3])\)$"],
}
picked, missing, found_by_regex = [], [], {}
for layer, names in EXACT.items():
    for n in names:
        (picked.append((layer, BY[n])) if n in BY else missing.append(n))
for layer, pats in REGEX.items():
    for p in pats:
        hits = [o for o in ALL if re.search(p, o.name, re.I) and not o.name.endswith('.l')]
        found_by_regex[p] = [o.name for o in hits][:30]
        for o in hits:
            if all(o is not q for _, q in picked): picked.append((layer, o))
# hand skeleton, merged later as context
hand = [o for o in ALL if o.type == 'MESH' and o.name.endswith('.r') and re.search(r"(carpal bone|metacarpal bone|phalanx of .* of hand|^Scaphoid|^Lunate|^Triquetrum|^Pisiform|^Trapezium|^Trapezoid|^Capitate|^Hamate)", o.name)]
skull = [o for o in ALL if o.type == 'MESH' and any(re.search(r"(cranium|skull)", c, re.I) for c in [col.name for col in o.users_collection]) and not o.name.endswith('.l') and o.name != 'Mandible']

dg = bpy.context.evaluated_depsgraph_get()
scene = bpy.context.scene
exp = bpy.data.collections.new("EXPORT"); scene.collection.children.link(exp)
mats = {k: bpy.data.materials.new("ov_" + k) for k in list(EXACT) + ['context']}
def slug(n): return re.sub(r"[^a-z0-9]+", "_", n.lower()).strip("_")
def bake(o, layer, name=None, selectable=True):
    if o.type == 'CURVE':
        o.data.resolution_u = max(o.data.resolution_u, 16); o.data.bevel_resolution = max(o.data.bevel_resolution, 5)
        if o.data.bevel_depth == 0 and o.data.bevel_object is None: o.data.bevel_depth = 0.0015
        o.data.use_fill_caps = True
    ev = o.evaluated_get(bpy.context.evaluated_depsgraph_get())
    me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=False, depsgraph=bpy.context.evaluated_depsgraph_get())
    me.transform(o.matrix_world)
    for p in me.polygons: p.use_smooth = True
    me.materials.clear(); me.materials.append(mats[layer])
    n = bpy.data.objects.new(slug(name or o.name), me); exp.objects.link(n)
    n["layer"] = layer; n["za_name"] = name or o.name; n["selectable"] = bool(selectable); n["src_type"] = o.type
    return n
def merge(objs, layer, name):
    bm = bmesh.new()
    for o in objs:
        ev = o.evaluated_get(bpy.context.evaluated_depsgraph_get()); me = bpy.data.meshes.new_from_object(ev); me.transform(o.matrix_world); bm.from_mesh(me); bpy.data.meshes.remove(me)
    me = bpy.data.meshes.new(slug(name)); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    me.materials.append(mats['context'])
    n = bpy.data.objects.new(slug(name), me); exp.objects.link(n); n["layer"] = 'bone'; n["za_name"] = name; n["selectable"] = False; n["src_type"] = 'MERGED'
    return n
report = []
for layer, o in picked:
    n = bake(o, layer)
    bb = [n.matrix_world @ Vector(c) for c in n.bound_box]
    report.append({"id": n.name, "za_name": o.name, "layer": layer, "src": o.type, "verts": len(n.data.vertices),
                   "min": [round(min(v[i] for v in bb), 4) for i in range(3)], "max": [round(max(v[i] for v in bb), 4) for i in range(3)],
                   "collections": [c.name for c in o.users_collection][:8]})
if hand: merge(hand, 'bone', 'Bones of hand (right)')
if skull: merge(skull, 'bone', 'Skull')
bpy.ops.object.select_all(action='DESELECT')
for o in exp.objects: o.select_set(True)
bpy.context.view_layer.objects.active = exp.objects[0]
bpy.ops.export_scene.gltf(filepath=out_glb, export_format='GLB', use_selection=True, export_extras=True, export_apply=True, export_yup=True,
                          export_materials='EXPORT', export_animations=False, export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6, export_draco_position_quantization=14, export_draco_normal_quantization=10)
json.dump({"blender": bpy.app.version_string, "missing": missing, "regex": found_by_regex, "hand_parts": len(hand), "skull_parts": len(skull), "objects": report}, open(out_json, 'w'), indent=1)
print("EXPORTED", len(exp.objects), "objects; missing", missing)
