"""Display names and groups for TotalSegmentator classes used in the head-and-neck exhibit (pure data).

Imported by the Slicer scripts and the venv scripts. `display_name(cls)` returns standard anatomical English;
side comes from the `_left` / `_right` in the class name ("midline" otherwise).
"""

BASE_NAMES = {
    # airway
    "trachea": "Trachea (lumen)",
    "larynx_air": "Laryngeal airway (lumen)",
    "nasopharynx": "Nasopharynx (lumen)",
    "oropharynx": "Oropharynx (lumen)",
    "hypopharynx": "Hypopharynx (lumen)",
    "nasal_cavity": "Nasal cavity (air)",
    "sinus_maxillary": "Maxillary sinuses",
    "sinus_frontal": "Frontal sinuses",
    "auditory_canal": "External acoustic meatus",
    "lung_upper_lobe": "Lung, upper lobe",
    "lung_lower_lobe": "Lung, lower lobe",
    # cartilage
    "thyroid_cartilage": "Thyroid cartilage",
    "cricoid_cartilage": "Cricoid cartilage",
    "costal_cartilages": "Costal cartilages",
    # bone
    "hyoid": "Hyoid bone",
    "mandible": "Mandible",
    "skull": "Skull",
    "hard_palate": "Hard palate",
    "teeth_upper": "Maxillary teeth",
    "teeth_lower": "Mandibular teeth",
    "zygomatic_arch": "Zygomatic arch",
    "styloid_process": "Styloid process",
    "vertebrae_C1": "Atlas (C1 vertebra)",
    "vertebrae_C2": "Axis (C2 vertebra)",
    "vertebrae_C3": "C3 vertebra", "vertebrae_C4": "C4 vertebra", "vertebrae_C5": "C5 vertebra",
    "vertebrae_C6": "C6 vertebra", "vertebrae_C7": "C7 vertebra",
    "vertebrae_T1": "T1 vertebra", "vertebrae_T2": "T2 vertebra", "vertebrae_T3": "T3 vertebra",
    "vertebrae_T4": "T4 vertebra", "vertebrae_T5": "T5 vertebra", "vertebrae_T6": "T6 vertebra", "vertebrae_T7": "T7 vertebra",
    "clavicula": "Clavicle",
    "sternum": "Sternum",
    "scapula": "Scapula",
    "rib_left_1": "First rib", "rib_right_1": "First rib", "rib_left_2": "Second rib", "rib_right_2": "Second rib",
    "rib_left_3": "Third rib", "rib_right_3": "Third rib", "rib_left_4": "Fourth rib", "rib_right_4": "Fourth rib",
    "rib_left_5": "Fifth rib", "rib_right_5": "Fifth rib", "rib_left_6": "Sixth rib", "rib_right_6": "Sixth rib",
    # vessels
    "aorta": "Aorta",
    "brachiocephalic_trunk": "Brachiocephalic trunk",
    "subclavian_artery": "Subclavian artery",
    "common_carotid_artery": "Common carotid artery",
    "internal_carotid_artery": "Internal carotid artery",
    "internal_jugular_vein": "Internal jugular vein",
    "brachiocephalic_vein": "Brachiocephalic vein",
    "superior_vena_cava": "Superior vena cava",
    # glands
    "thyroid_gland": "Thyroid gland",
    "parotid_gland": "Parotid gland",
    "submandibular_gland": "Submandibular gland",
    # muscles and soft tissue
    "sternocleidomastoid": "Sternocleidomastoid muscle",
    "superior_pharyngeal_constrictor": "Superior pharyngeal constrictor",
    "middle_pharyngeal_constrictor": "Middle pharyngeal constrictor",
    "inferior_pharyngeal_constrictor": "Inferior pharyngeal constrictor",
    "trapezius": "Trapezius muscle",
    "platysma": "Platysma",
    "levator_scapulae": "Levator scapulae muscle",
    "anterior_scalene": "Anterior scalene muscle",
    "middle_scalene": "Middle scalene muscle",
    "posterior_scalene": "Posterior scalene muscle",
    "sterno_thyroid": "Sternothyroid muscle",
    "thyrohyoid": "Thyrohyoid muscle",
    "prevertebral": "Prevertebral muscles (longus colli and longus capitis)",
    "masseter": "Masseter muscle",
    "temporalis": "Temporalis muscle",
    "lateral_pterygoid": "Lateral pterygoid muscle",
    "medial_pterygoid": "Medial pterygoid muscle",
    "digastric": "Digastric muscle",
    "tongue": "Tongue",
    "soft_palate": "Soft palate",
    "autochthon": "Deep (intrinsic) back muscles",
    # other
    "esophagus": "Esophagus",
    "spinal_cord": "Spinal cord",
    "brain": "Brain",
    "heart": "Heart",
    "eye": "Eye", "eye_lens": "Lens of eye", "optic_nerve": "Optic nerve",
    "head": "Head (outer surface)",
}

GROUPS = {
    "airway": ["trachea", "larynx_air", "nasopharynx", "oropharynx", "hypopharynx", "nasal_cavity", "sinus_maxillary", "sinus_frontal",
               "auditory_canal", "lung_upper_lobe", "lung_lower_lobe"],
    "cartilage": ["thyroid_cartilage", "cricoid_cartilage", "costal_cartilages"],
    "bone": ["hyoid", "mandible", "skull", "hard_palate", "teeth_upper", "teeth_lower", "zygomatic_arch", "styloid_process",
             "clavicula", "sternum", "scapula"],
    "vessel": ["aorta", "brachiocephalic_trunk", "subclavian_artery", "common_carotid_artery", "internal_carotid_artery",
               "internal_jugular_vein", "brachiocephalic_vein", "superior_vena_cava"],
    "gland": ["thyroid_gland", "parotid_gland", "submandibular_gland"],
    "muscle": ["sternocleidomastoid", "superior_pharyngeal_constrictor", "middle_pharyngeal_constrictor", "inferior_pharyngeal_constrictor",
               "trapezius", "platysma", "levator_scapulae", "anterior_scalene", "middle_scalene", "posterior_scalene", "sterno_thyroid",
               "thyrohyoid", "prevertebral", "masseter", "temporalis", "lateral_pterygoid", "medial_pterygoid", "digastric", "tongue",
               "soft_palate", "autochthon"],
}


def split_side(cls):
    """('thyroid_cartilage', 'midline') / ('internal_jugular_vein', 'left') / ('rib_left_1', 'left')."""
    if cls.startswith("rib_left_"):
        return cls, "left"
    if cls.startswith("rib_right_"):
        return cls, "right"
    if cls.endswith("_left"):
        return cls[:-5], "left"
    if cls.endswith("_right"):
        return cls[:-6], "right"
    return cls, "midline"


def display_name(cls):
    base, side = split_side(cls)
    nm = BASE_NAMES.get(base, base.replace("_", " ").capitalize())
    return nm if side == "midline" else f"{nm}, {side}"


def group(cls):
    base, _ = split_side(cls)
    if base.startswith("vertebrae_") or base.startswith("rib_"):
        return "bone"
    for g, members in GROUPS.items():
        if base in members:
            return g
    return "other"
