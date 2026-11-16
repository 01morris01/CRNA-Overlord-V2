# Head and neck study guide catalog for the X-Ray Mirror.
# Coordinates are BodyParts3D 4.0 millimetres (x = body left, y = posterior, z = up), right side given;
# items marked bi=True are mirrored to the left side. Notes follow the study guide wording, without dashes.
import numpy as np

V4 = lambda *p: ('v4',) + tuple(p)
def side(name): return f'^(Right|Left) {name}$'
def exact(name): return f'^{name}$'

ITEMS = []
def item(sec, grp, name, notes=(), parts=(), pins=(), paths=(), approx=False, aka=()):
    ITEMS.append(dict(sec=sec, grp=grp, name=name, notes=list(notes), parts=list(parts),
                      pins=list(pins), paths=list(paths), approx=approx, aka=list(aka)))

SKULL = ['Frontal bone', 'Occipital bone', 'Sphenoid bone', 'Ethmoid', 'Vomer']
SKULL_LR = ['temporal bone', 'parietal bone', 'maxilla', 'zygomatic bone', 'nasal bone', 'lacrimal bone', 'palatine bone']

# ------------------------------------------------------------------ BONES
B = 'Bones'
item(B, 'Frontal bone', 'Frontal bone', parts=[V4(exact('Frontal bone'))])
item(B, 'Frontal bone', 'Supraorbital foramen', ['On the supraorbital margin of the frontal bone.'],
     parts=[('ctx', V4(exact('Frontal bone')))], pins=[('L', 'Supraorbital foramen')])
item(B, 'Parietal bone', 'Parietal bone', parts=[V4(side('parietal bone'))])
item(B, 'Temporal bone', 'Temporal bone', parts=[V4(side('temporal bone'))])
item(B, 'Temporal bone', 'Jugular foramen', ['Cranial nerves IX, X and XI exit here.'],
     parts=[('ctx', V4(side('temporal bone'), exact('Occipital bone')))], pins=[('L', 'Jugular foramen')])
item(B, 'Temporal bone', 'External auditory meatus', parts=[('ctx', V4(side('temporal bone')))],
     pins=[('L', 'External auditory meatus')])
item(B, 'Temporal bone', 'Carotid canal', parts=[('ctx', V4(side('temporal bone')))], pins=[('L', 'Carotid canal')])
item(B, 'Temporal bone', 'Styloid process', parts=[('sub', side('temporal bone'), 'Styloid process', 9, [0, -4, 9])],
     pins=[('L', 'Styloid process')])
item(B, 'Temporal bone', 'Zygomatic process', parts=[('sub', side('temporal bone'), 'Zygomatic process', 13, [6, -4, 0])],
     pins=[('L', 'Zygomatic process')])
item(B, 'Temporal bone', 'Mastoid process', parts=[('sub', side('temporal bone'), 'Mastoid process', 14, [-3, 0, 8])],
     pins=[('L', 'Mastoid process')])
item(B, 'Occipital bone', 'Occipital bone', parts=[V4(exact('Occipital bone'))])
item(B, 'Occipital bone', 'Foramen magnum', parts=[('sub1', exact('Occipital bone'), 'Foramen magnum', 24, [0, 0, 0])],
     pins=[('L', 'Foramen magnum')])
item(B, 'Occipital bone', 'Occipital condyles', parts=[('sub', exact('Occipital bone'), 'Occipital condyles', 10, [0, 0, 3])],
     pins=[('L', 'Occipital condyles')])
item(B, 'Occipital bone', 'Hypoglossal canal', ['Cranial nerve XII exits here.'],
     parts=[('ctx', V4(exact('Occipital bone')))], pins=[('L', 'Hypoglossal canal')])
item(B, 'Sphenoid bone', 'Sphenoid bone', parts=[V4(exact('Sphenoid bone'))])
item(B, 'Sphenoid bone', 'Optic foramen (optic canal)', ['Cranial nerve II passes through.'],
     parts=[('ctx', V4(exact('Sphenoid bone')))], pins=[('L', 'Optic canal')], aka=['Optic canal'])
item(B, 'Sphenoid bone', 'Superior orbital fissure', ['Cranial nerves III, IV, V1 and VI pass through.'],
     parts=[('ctx', V4(exact('Sphenoid bone')))], pins=[('L', 'Superior orbital fissure')])
item(B, 'Sphenoid bone', 'Inferior orbital fissure', parts=[('ctx', V4(exact('Sphenoid bone'), side('maxilla')))],
     pins=[('L', 'Inferior orbital fissure')])
item(B, 'Sphenoid bone', 'Foramen rotundum', ['Maxillary branch V2 passes through.'],
     parts=[('ctx', V4(exact('Sphenoid bone')))], pins=[('L', 'Foramen rotundum')])
item(B, 'Sphenoid bone', 'Foramen ovale', ['Mandibular branch V3 passes through.'],
     parts=[('ctx', V4(exact('Sphenoid bone')))], pins=[('L', 'Foramen ovale')])
item(B, 'Sphenoid bone', 'Foramen lacerum', parts=[('ctx', V4(exact('Sphenoid bone'), side('temporal bone')))],
     pins=[('L', 'Foramen lacerum')])
item(B, 'Sphenoid bone', 'Foramen spinosum', parts=[('ctx', V4(exact('Sphenoid bone')))], pins=[('L', 'Foramen spinosum')])
item(B, 'Other skull bones', 'Lacrimal bones', parts=[V4(side('lacrimal bone'))])
item(B, 'Ethmoid bone', 'Ethmoid bone', parts=[V4(exact('Ethmoid'))])
item(B, 'Ethmoid bone', 'Cribriform plate', ['Olfactory foramina of the cribriform plate carry cranial nerve I.'],
     parts=[('sub', exact('Ethmoid'), 'Cribriform plate', 9, [5, 0, 0], 'bi')], pins=[('L', 'Cribriform plate')])
item(B, 'Ethmoid bone', 'Crista galli', parts=[('sub', exact('Ethmoid'), 'Crista galli', 8, [0, 3, -3])],
     pins=[('L', 'Crista galli')])
item(B, 'Other skull bones', 'Nasal bones', parts=[V4(side('nasal bone'))])
item(B, 'Maxilla', 'Maxilla', parts=[V4(side('maxilla'))])
item(B, 'Maxilla', 'Infraorbital foramen', parts=[('ctx', V4(side('maxilla')))], pins=[('L', 'Infraorbital foramen')])
item(B, 'Other skull bones', 'Palatine bones', parts=[V4(side('palatine bone'))])
item(B, 'Other skull bones', 'Vomer', parts=[V4(exact('Vomer'))])
item(B, 'Other skull bones', 'Zygomatic bones', parts=[V4(side('zygomatic bone'))])
item(B, 'Paranasal sinuses', 'Frontal sinus', ['Paranasal sinus in the frontal bone.'],
     parts=[('ell', [-12, -165, 1549], [9, 6, 9], 'bi'), ('ctx', V4(exact('Frontal bone')))], approx=True)
item(B, 'Paranasal sinuses', 'Ethmoid sinus', ['Paranasal sinus in the ethmoid bone.'],
     parts=[('ell', [-12, -143, 1514], [5, 14, 8], 'bi'), ('ctx', V4(exact('Ethmoid')))], approx=True)
item(B, 'Paranasal sinuses', 'Maxillary sinus', ['Paranasal sinus in the maxillae.'],
     parts=[('ell', [-27, -150, 1494], [11, 14, 12], 'bi'), ('ctx', V4(side('maxilla')))], approx=True)
item(B, 'Paranasal sinuses', 'Sphenoid sinus', ['Paranasal sinus in the sphenoid bone.'],
     parts=[('ell', [-0.5, -114, 1509], [11, 9, 8]), ('ctx', V4(exact('Sphenoid bone')))], approx=True)
item(B, 'Sutures', 'Sagittal suture', parts=[('strip', exact('Right parietal bone'), exact('Left parietal bone'), 2.5)])
item(B, 'Sutures', 'Coronal suture', parts=[('strip', exact('Frontal bone'), side('parietal bone'), 2.5)])
item(B, 'Sutures', 'Squamous suture', parts=[('strip', side('temporal bone'), side('parietal bone'), 2.5)])
item(B, 'Sutures', 'Lambdoid suture', parts=[('strip', exact('Occipital bone'), side('parietal bone'), 2.5)])
item(B, 'Other skull bones', 'Hard palate', ['Hard palate = maxillae + palatine bones.'],
     parts=[('box', '^(Right|Left) (maxilla|palatine bone)$', [-24, -176, 1466], [23, -128, 1483])], pins=[('L', 'Hard palate')])
item(B, 'Mandible', 'Mandible', parts=[V4(exact('Mandible'))])
item(B, 'Mandible', 'Body of mandible', parts=[('box', exact('Mandible'), [-60, -180, 1418], [60, -128, 1462])],
     pins=[('L', 'Body of mandible')])
item(B, 'Mandible', 'Ramus', parts=[('box', exact('Mandible'), [-60, -132, 1452], [-30, -88, 1492], 'bi')], pins=[('L', 'Ramus')])
item(B, 'Mandible', 'Coronoid process', parts=[('sub', exact('Mandible'), 'Coronoid process', 9, [0, 2, -4])],
     pins=[('L', 'Coronoid process')])
item(B, 'Mandible', 'Mandibular condyle', ['Articulates at the TMJ.'],
     parts=[('sub', exact('Mandible'), 'Mandibular condyle', 9, [0, 0, -3])], pins=[('L', 'Mandibular condyle')])
item(B, 'Mandible', 'Mandibular angle', parts=[('sub', exact('Mandible'), 'Mandibular angle', 11, [0, -3, 3])],
     pins=[('L', 'Mandibular angle')])
item(B, 'Mandible', 'Mandibular notch', parts=[('ctx', V4(exact('Mandible')))], pins=[('L', 'Mandibular notch')])
item(B, 'Mandible', 'Mandibular foramen', ['Also called the inferior alveolar foramen.'],
     parts=[('ctx', V4(exact('Mandible')))], pins=[('L', 'Mandibular foramen')], aka=['Inferior alveolar foramen'])
item(B, 'Mandible', 'Mental foramen', parts=[('ctx', V4(exact('Mandible')))], pins=[('L', 'Mental foramen')])
item(B, 'Mandible', 'Mylohyoid line', parts=[('ctx', V4(exact('Mandible')))], pins=[('L', 'Mylohyoid line')])
item(B, 'Hyoid bone', 'Hyoid bone', parts=[V4(exact('Hyoid bone'))])
item(B, 'Hyoid bone', 'Body of hyoid', parts=[('box', exact('Hyoid bone'), [-11, -135, 1420], [11, -118, 1445])],
     pins=[('L', 'Hyoid body')])
item(B, 'Hyoid bone', 'Greater horns', parts=[('sub', exact('Hyoid bone'), 'Greater horns', 14, [3, -8, 0])],
     pins=[('L', 'Greater horns')])
item(B, 'Hyoid bone', 'Lesser horns', parts=[('ctx', V4(exact('Hyoid bone')))], pins=[('L', 'Lesser horns')])
item(B, 'Cervical vertebrae', 'Cervical vertebrae (C1 to C7)',
     parts=[V4(exact('Atlas'), exact('Axis'), *[f'^{n} cervical vertebra$' for n in ('Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh')])])
item(B, 'Cervical vertebrae', 'C1 = Atlas', parts=[V4(exact('Atlas'))])
item(B, 'Cervical vertebrae', 'C2 = Axis', parts=[V4(exact('Axis'))])
item(B, 'Cervical vertebrae', 'Transverse foramen', ['Vertebral artery passes through the transverse foramina.'],
     parts=[('ctx', V4(*[f'^{n} cervical vertebra$' for n in ('Third', 'Fourth', 'Fifth', 'Sixth')])), ('ctx', V4(side('vertebral artery')))],
     pins=[('P', [-24, -78, 1436], 'bi'), ('P', [-25, -80, 1421], 'bi'), ('P', [-26, -82, 1407], 'bi')], approx=True)

# ------------------------------------------------------------------ MUSCLES
M = 'Muscles'
def mus(grp, name, o=None, i=None, n=None, a=None, parts=(), oi=None, extra=()):
    notes = []
    if oi: notes.append(f'Origin/Insertion: {oi}')
    if o: notes.append(f'Origin: {o}')
    if i: notes.append(f'Insertion: {i}')
    if n: notes.append(f'Innervation: {n}')
    if a: notes.append(f'Action: {a}')
    notes += list(extra)
    item(M, grp, name, notes, parts=parts)
F = 'Face and head'
mus(F, 'Frontalis', 'epicranial aponeurosis', 'near eyebrows', 'facial nerve (temporal branch)', 'elevates eyebrows',
    parts=[('v3', ['FMA46759', 'FMA46760'])])
mus(F, 'Orbicularis oculi', oi='around the orbit', n='facial nerve (temporal and zygomatic branches)', a='closes eyelid',
    parts=[('v3', ['FMA46782', 'FMA46783', 'FMA46785', 'FMA46786'])])
mus(F, 'Corrugator supercilii', 'superciliary margin of frontal bone',
    'deep to skin of the eyebrow near supraorbital margin', 'facial nerve (mostly temporal branch)',
    'pulls eyebrows medially and inferiorly', parts=[('v3', ['FMA46796', 'FMA46797'])])
mus(F, 'Orbicularis oris', oi='around the mouth', n='facial nerve (buccal and marginal mandibular branches)',
    a='closes mouth, purses the lips', parts=[('v3', ['FMA46841'])])
mus(F, 'Masseter', 'maxillary process and zygomatic arch of zygomatic bone', 'ramus and coronoid process of the mandible',
    'trigeminal nerve (masseteric nerve from V3)', 'elevates mandible, also protracts and slightly abducts mandible',
    parts=[('v3', ['FMA49001', 'FMA49002', 'FMA49004', 'FMA49005'])])
mus(F, 'Temporalis', 'temporal fossa of parietal and temporal bones', 'coronoid process of mandible',
    'trigeminal nerve (deep temporal nerves from V3)', 'elevates mandible, retracts mandible, slightly abducts mandible',
    parts=[('v3', ['FMA49007', 'FMA49008'])])
mus(F, 'Lateral pterygoid', 'greater wing and pterygoid plate of sphenoid bone', 'mandibular condyle and TMJ capsule',
    'trigeminal nerve (anterior division of V3)', 'protracts and laterally moves mandible',
    parts=[('v3', ['FMA49022', 'FMA49023', 'FMA49024', 'FMA49025'])])
mus(F, 'Medial pterygoid', 'pterygoid plate of sphenoid bone and pyramidal process of palatine bone',
    'medial aspect of ramus and angle of mandible', 'trigeminal nerve (medial pterygoid branch of V3)',
    'elevates and protracts mandible, laterally moves mandible', parts=[('v3', ['FMA49012', 'FMA49013'])])
mus(F, 'Buccinator', 'maxilla, mandible, and pterygomandibular raphe', 'modiolus of the mouth, orbicularis oris muscle',
    'facial nerve (buccal branch)', 'compresses cheeks', parts=[('v3', ['FMA46835', 'FMA46836'])])
N = 'Neck'
mus(N, 'Platysma', 'fascia and skin of upper thorax and shoulders', 'inferior border of mandible, skin of face and cheek, modiolus',
    'facial nerve (cervical branch)', 'depresses mouth and lower lip, assists in depressing mandible', parts=[V4(side('platysma'))])
mus(N, 'Sternocleidomastoid', 'manubrium of sternum, medial 1/3 of clavicle',
    'mastoid process of temporal bone, superior nuchal line of occipital bone', 'accessory nerve',
    'unilateral contraction turns head, bilateral contraction flexes neck', parts=[V4(side('sternocleidomastoid'))])
mus(N, 'Digastric (anterior belly)', 'inner surface of mandible', 'hyoid bone',
    'trigeminal nerve (from a branch of inferior alveolar nerve from V3)', 'depresses mandible, elevates hyoid',
    parts=[('half', side('digastric'), 1, '<', -124.0), V4(side('intermediate tendon'))])
mus(N, 'Digastric (posterior belly)', 'mastoid notch of temporal bone', 'hyoid bone', 'facial nerve (digastric branch)',
    'depresses mandible, elevates hyoid', parts=[('half', side('digastric'), 1, '>', -124.0), V4(side('intermediate tendon'))])
mus(N, 'Mylohyoid', 'internal surface of mandible', 'hyoid bone', 'trigeminal nerve (mandibular nerve branch of V3)',
    'depresses mandible, elevates hyoid', parts=[V4(side('mylohyoid'))])
mus(N, 'Stylohyoid', 'styloid process of temporal bone', 'hyoid bone', 'facial nerve (stylohyoid branch)',
    'elevates and retracts hyoid bone', parts=[V4(side('stylohyoid'))])
mus(N, 'Thyrohyoid', 'thyroid cartilage', 'hyoid bone', 'anterior ramus of C1', 'depresses hyoid bone, elevates larynx',
    parts=[V4(side('thyrohyoid'))])
mus(N, 'Sternothyroid', 'manubrium and first costal cartilage', 'thyroid cartilage', 'anterior rami of C1 to C3',
    'depresses larynx and thyroid cartilage', parts=[V4(side('sternothyroid'))])
mus(N, 'Sternohyoid', 'medial end of clavicle and manubrium', 'hyoid bone', 'anterior rami of C1 to C3', 'depresses hyoid bone',
    parts=[V4(side('sternohyoid'))])
mus(N, 'Omohyoid', 'superior border of scapula', 'hyoid bone', 'anterior rami of C1 to C3',
    'depresses hyoid bone, tenses deep cervical fascia to prevent collapse of internal jugular vein', parts=[V4(side('omohyoid'))])
SC = dict(o='tubercles and transverse processes of cervical vertebrae',
          i='anterior and middle scalene into 1st rib, posterior scalene into 2nd rib',
          n='anterior rami of cervical nerves', a='elevate ribs and flex cervical spine')
mus(N, 'Scalenes', parts=[V4(side('scalenus anterior'), side('scalenus medius'), side('scalenus posterior'))], **SC)
mus(N, 'Anterior scalene', parts=[V4(side('scalenus anterior'))], **SC)
mus(N, 'Middle scalene', parts=[V4(side('scalenus medius'))], **SC)
mus(N, 'Posterior scalene', parts=[V4(side('scalenus posterior'))], **SC)
mus(N, 'Levator scapulae', 'posterior tubercles and transverse processes of C1 to C4 vertebrae', 'scapula',
    'dorsal scapular nerve', 'elevates and rotates scapula, laterally flexes neck', parts=[V4(side('levator scapulae'))])
mus(N, 'Splenius capitis', 'ligamentum nuchae and spinous processes of C7 to T3 vertebrae',
    'mastoid process of temporal bone, superior nuchal line of occipital bone', 'posterior rami of C3 to C4',
    'bilateral contraction extends neck, unilateral contraction rotates and laterally flexes head', parts=[V4(side('splenius capitis'))])
mus(N, 'Trapezius', 'occipital bone, ligamentum nuchae, and spinous processes of C7 to T12',
    'lateral 1/3 of clavicle, acromion, and medial end of spine of the scapula', 'accessory nerve',
    'elevates/retracts/depresses/rotates scapula (depending on which fibers contract), extends head/neck when scapula is held in place by other muscles',
    parts=[V4('^Descending part of (right|left) trapezius$', '^Transverse part of (right|left) trapezius$')],
    extra=['Shown: the upper (descending) and middle fibers.'])
item(M, 'Neck', 'Anterior triangle of the neck', ['Bounded by the mandible, the midline of the neck and the anterior border of sternocleidomastoid.'],
     parts=[('ctx', V4(side('sternocleidomastoid'), exact('Mandible')))],
     paths=[dict(pts=[[-1, -172, 1424], [-30, -150, 1432], [-46, -108, 1446], [-38, -112, 1400], [-14, -122, 1338], [-1, -128, 1338], [-1, -150, 1400], [-1, -172, 1424]], bi=True, kind='region')],
     approx=True)
item(M, 'Neck', 'Posterior triangle of the neck', ['Bounded by sternocleidomastoid, trapezius and the clavicle.'],
     parts=[('ctx', V4(side('sternocleidomastoid'), '^Descending part of (right|left) trapezius$'))],
     paths=[dict(pts=[[-52, -72, 1470], [-60, -90, 1395], [-58, -100, 1335], [-85, -80, 1328], [-78, -50, 1360], [-55, -45, 1430], [-52, -72, 1470]], bi=True, kind='region')],
     approx=True)
item(M, 'Neck', 'Carotid sheath', ['Contains the common carotid artery, internal jugular vein and vagus nerve.'],
     parts=[V4(side('common carotid artery'), side('internal jugular vein'))],
     paths=[dict(pts=[[-16.5, -108, 1373], [-21, -109, 1428]], bi=True, kind='artery'),
            dict(pts=[[-26.4, -114, 1381], [-29, -110, 1430], [-33, -95, 1468], [-33, -79, 1497]], bi=True, kind='vein'),
            dict(pts=[[-21, -114, 1335], [-22, -112, 1400], [-27, -104, 1450], [-33, -80, 1497]], bi=True, kind='nerve')],
     approx=True)

# ------------------------------------------------------------------ BRAIN
BR = 'Brain'
FRONTAL = V4(side('superior frontal gyrus'), side('middle frontal gyrus'), side('inferior frontal gyrus'), side('precentral gyrus'), exact('Orbital gyrus'))
PARIETAL = V4(side('postcentral gyrus'), side('superior parietal lobule'), side('supramarginal gyrus'), side('angular gyrus'))
TEMPORAL = V4('^(Anterior|Posterior) part of (right|left) superior temporal gyrus$', side('middle temporal gyrus'), side('inferior temporal gyrus'), side('fusiform gyrus'))
item(BR, 'Cerebrum', 'Cerebrum', parts=[('page', 'cerebrum')])
item(BR, 'Cerebrum', 'Cerebral hemispheres', parts=[('page', 'cerebrum')])
CORTEX = ('v4',) + FRONTAL[1:] + PARIETAL[1:] + TEMPORAL[1:] + (side('occipital lobe'), side('insula'), side('cingulate gyrus'), side('parahippocampal gyrus'))
item(BR, 'Cerebrum', 'Cerebral cortex (gray matter)', parts=[CORTEX])
item(BR, 'Cerebrum', 'White matter', parts=[V4('^White matter of (right|left) cerebral hemisphere$')])
item(BR, 'Cerebrum', 'Basal nuclei', ['Caudate nucleus, putamen and globus pallidus.'],
     parts=[V4(side('caudate nucleus'), side('putamen'), side('globus pallidus'))])
item(BR, 'Cerebrum', 'Corpus callosum', parts=[V4(exact('Corpus callosum'))])
item(BR, 'Cerebrum', 'Internal capsule', parts=[V4(side('internal capsule'))])
item(BR, 'Cerebrum', 'Fornix', parts=[V4(side('fornix of forebrain'), exact('Commissure of fornix of forebrain'))])
item(BR, 'Ventricles and CSF', 'Lateral ventricles', parts=[V4(side('lateral ventricle'))])
item(BR, 'Ventricles and CSF', 'Third ventricle', parts=[V4(exact('Third ventricle'))])
item(BR, 'Ventricles and CSF', 'Aqueduct of the midbrain', parts=[V4(exact('Cerebral aqueduct'))], aka=['Cerebral aqueduct'])
item(BR, 'Ventricles and CSF', 'Fourth ventricle', parts=[V4(exact('Fourth ventricle'))])
item(BR, 'Sulci and fissures', 'Central sulcus', ['Separates the precentral gyrus (frontal lobe) from the postcentral gyrus (parietal lobe).'],
     parts=[('strip', side('precentral gyrus'), side('postcentral gyrus'), 3.0)])
item(BR, 'Sulci and fissures', 'Lateral cerebral sulcus', ['Separates the temporal lobe from the frontal and parietal lobes.'],
     parts=[('strip', '^(Anterior|Posterior) part of (right|left) superior temporal gyrus$', '^(Right|Left) (inferior frontal|precentral|postcentral|supramarginal) gyrus$', 3.5)])
item(BR, 'Sulci and fissures', 'Parieto-occipital sulcus', ['Separates the parietal lobe from the occipital lobe.'],
     parts=[('strip', side('occipital lobe'), '^(Right|Left) (superior parietal lobule|angular gyrus|cingulate gyrus)$', 3.5)])
item(BR, 'Sulci and fissures', 'Longitudinal fissure', ['Separates the right and left cerebral hemispheres.'],
     parts=[('strip', '^Right (superior frontal gyrus|precentral gyrus|postcentral gyrus|superior parietal lobule|occipital lobe|cingulate gyrus)$',
             '^Left (superior frontal gyrus|precentral gyrus|postcentral gyrus|superior parietal lobule|occipital lobe|cingulate gyrus)$', 4.5)])
item(BR, 'Sulci and fissures', 'Transverse fissure', ['Separates the cerebrum from the cerebellum.'],
     parts=[('strip', exact('Cerebellum'), '^(Right|Left) (occipital lobe|fusiform gyrus|inferior temporal gyrus)$', 6.0), ('ctx', V4(exact('Tentorium cerebelli')))])
L_ = 'Lobes of the cerebrum'
item(BR, L_, 'Frontal lobe', parts=[FRONTAL])
item(BR, L_, 'Precentral gyrus = Primary motor cortex', parts=[V4(side('precentral gyrus'))], aka=['Primary motor cortex'])
item(BR, L_, "Broca's area", ['Usually in the left inferior frontal gyrus.'], parts=[V4(exact('Left inferior frontal gyrus'))],
     pins=[('P', [52, -118, 1560])])
item(BR, L_, 'Parietal lobe', parts=[PARIETAL])
item(BR, L_, 'Postcentral gyrus = Primary somatosensory cortex', parts=[V4(side('postcentral gyrus'))], aka=['Primary somatosensory cortex'])
item(BR, L_, 'Occipital lobe', parts=[V4(side('occipital lobe'))])
item(BR, L_, 'Primary visual cortex', ['In the occipital lobe.'], parts=[('ctx', V4(side('occipital lobe')))],
     pins=[('P', [-5, 2, 1540], 'bi')], approx=True)
item(BR, L_, 'Temporal lobe', parts=[TEMPORAL])
item(BR, L_, 'Primary auditory cortex', ['In the temporal lobe.'],
     parts=[V4('^(Anterior|Posterior) part of (right|left) superior temporal gyrus$')], pins=[('P', [-50, -80, 1560], 'bi')], approx=True)
item(BR, L_, "Wernicke's area", ['Usually in the posterior left superior temporal gyrus.'],
     parts=[V4(exact('Posterior part of left superior temporal gyrus'))])
item(BR, L_, 'Insula (inner lobe)', parts=[V4(side('insula'))], aka=['Insula'])
D = 'Diencephalon'
item(BR, D, 'Diencephalon', ['Thalamus, hypothalamus and epithalamus.'],
     parts=[V4(side('thalamus'), exact('Hypothalamus'), exact('Habenula'), exact('Pineal body'), side('stria medullaris of thalamus'))])
item(BR, D, 'Thalamus', parts=[V4(side('thalamus'))])
item(BR, D, 'Hypothalamus', parts=[V4(exact('Hypothalamus'), exact('Mammillary body'), exact('Tuber cinereum'))])
item(BR, D, 'Infundibulum', ['Stalk connecting the hypothalamus to the pituitary gland.'],
     parts=[('ctx', V4(exact('Hypothalamus'), exact('Pituitary gland')))],
     paths=[dict(pts=[[-0.5, -100, 1540], [-0.5, -103, 1528], [-0.5, -105, 1518]], kind='nerve')], approx=True)
item(BR, D, 'Pituitary gland', parts=[V4(exact('Pituitary gland'))])
item(BR, D, 'Epithalamus', parts=[V4(exact('Habenula'), exact('Pineal body'), side('stria medullaris of thalamus'))])
item(BR, D, 'Pineal gland', parts=[V4(exact('Pineal body'))])
BS = 'Brain stem and cerebellum'
item(BR, BS, 'Brain stem', ['Midbrain, pons and medulla oblongata.'],
     parts=[V4(exact('Midbrain'), exact('Peduncle of midbrain'), exact('Pons'), exact('Medulla oblongata'))])
item(BR, BS, 'Midbrain', parts=[V4(exact('Midbrain'), exact('Peduncle of midbrain'))])
item(BR, BS, 'Pons', parts=[V4(exact('Pons'))])
item(BR, BS, 'Medulla oblongata', parts=[V4(exact('Medulla oblongata'))])
item(BR, BS, 'Cerebellum', parts=[V4(exact('Cerebellum'))])
item(BR, BS, 'Arbor vitae (white matter)', ['White matter of the cerebellum.'], parts=[('ctx', V4(exact('Cerebellum')))],
     pins=[('P', [-14, -40, 1512], 'bi')], approx=True, aka=['Arbor vitae'])
item(BR, BS, 'Cerebellar cortex (gray matter)', parts=[V4(exact('Cerebellum'))], aka=['Cerebellar cortex'])
item(BR, BS, 'Spinal cord', parts=[V4(exact('Central canal of spinal cord'))],
     paths=[dict(pts=[[-0.5, -62, 1465], [-0.5, -62, 1440], [-0.5, -64, 1410], [-0.5, -62, 1380], [-0.5, -58, 1350]], kind='cord')], approx=True)
MN = 'Meninges and CSF'
item(BR, MN, 'Cranial meninges', ['Dura mater, arachnoid mater and pia mater.'], parts=[V4(exact('Tentorium cerebelli'))],
     pins=[('P', [-0.5, -100, 1628])], approx=True)
item(BR, MN, 'Dura mater', ['Outermost meningeal layer. The tentorium cerebelli shown here is a fold of dura.'],
     parts=[V4(exact('Tentorium cerebelli'))], pins=[('P', [-0.5, -100, 1627])], approx=True)
item(BR, MN, 'Arachnoid mater', parts=[('ctx', ('page', 'cerebrum'))], pins=[('P', [-0.5, -100, 1624])], approx=True)
item(BR, MN, 'Pia mater', ['Clings to the surface of the brain.'], parts=[('ctx', ('page', 'cerebrum'))],
     pins=[('P', [-6, -100, 1621])], approx=True)
SSS = [[-0.5, -150, 1560], [-0.5, -140, 1600], [-0.5, -110, 1628], [-0.5, -70, 1630], [-0.5, -30, 1610], [-0.5, 0, 1575], [-0.5, 8, 1540]]
item(BR, MN, 'Superior sagittal sinus', parts=[('ctx', ('page', 'cerebrum'))], paths=[dict(pts=SSS, kind='vein')], approx=True)
item(BR, MN, 'Falx cerebri', ['Dura in the longitudinal fissure.'],
     parts=[('strip', '^Right (superior frontal gyrus|precentral gyrus|postcentral gyrus|superior parietal lobule|occipital lobe|cingulate gyrus)$',
             '^Left (superior frontal gyrus|precentral gyrus|postcentral gyrus|superior parietal lobule|occipital lobe|cingulate gyrus)$', 4.5)],
     paths=[dict(pts=SSS, kind='vein')], approx=True)
item(BR, MN, 'Subarachnoid space', ['Contains cerebrospinal fluid.'], parts=[('ctx', ('page', 'cerebrum'))],
     pins=[('P', [-0.5, -100, 1622]), ('P', [-40, -100, 1600], 'bi')], approx=True)
item(BR, MN, 'Arachnoid villi', ['Return CSF to the superior sagittal sinus.'], paths=[dict(pts=SSS, kind='vein')],
     pins=[('P', [-4, -110, 1626], 'bi'), ('P', [-4, -60, 1627], 'bi')], approx=True)
item(BR, MN, 'Cerebrospinal fluid', ['Fills the ventricles and the subarachnoid space.'],
     parts=[V4(side('lateral ventricle'), exact('Third ventricle'), exact('Cerebral aqueduct'), exact('Fourth ventricle'))], aka=['CSF'])
item(BR, MN, 'Choroid plexus', ['Produces cerebrospinal fluid.'], parts=[V4(exact('Choroid plexus of cerebral hemisphere'))])
item(BR, MN, 'Septum pellucidum', parts=[V4(exact('Septum of telencephalon'))])

# ------------------------------------------------------------------ EYE
E = 'Eye'
EYE_C = [-30.5, -151, 1518]
item(E, 'Eye', 'Conjunctiva', parts=[('ctx', V4(side('sclera')))], pins=[('P', [-38, -160, 1522], 'bi')], approx=True)
item(E, 'Eye', 'Lacrimal gland', parts=[V4(side('lacrimal gland'))])
item(E, 'Eye', 'Nasolacrimal duct', parts=[V4(side('nasolacrimal duct'), side('lacrimal sac'))])
X = 'Extrinsic eye muscles'
for nm, pat, cn in [('Superior rectus', 'superior rectus', 'III'), ('Inferior rectus', 'inferior rectus', 'III'),
                    ('Medial rectus', 'medial rectus', 'III'), ('Inferior oblique', 'inferior oblique', 'III'),
                    ('Superior oblique', 'superior oblique', 'IV'), ('Lateral rectus', 'lateral rectus', 'VI')]:
    item(E, X, nm, [f'Moved by cranial nerve {cn}.'], parts=[V4(side(pat))])
item(E, X, 'All extrinsic eye muscles', parts=[V4(*[side(p) for p in ('superior rectus', 'inferior rectus', 'medial rectus', 'lateral rectus', 'superior oblique', 'inferior oblique')])])
item(E, 'Eye', 'Cornea', parts=[V4(side('cornea'))])
item(E, 'Eye', 'Sclera', parts=[V4(side('sclera'))])
item(E, 'Eye', 'Iris', parts=[V4(side('iris'))])
item(E, 'Eye', 'Pupil', parts=[('ctx', V4(side('iris')))], pins=[('P', [-30.5, -161, 1518], 'bi')])
item(E, 'Eye', 'Retina', parts=[V4('^Optic part of (right|left) retina$')])
item(E, 'Eye', 'Optic disc', parts=[('ctx', V4('^Optic part of (right|left) retina$', side('optic nerve')))], pins=[('P', [-29, -140, 1520], 'bi')], approx=True)
item(E, 'Eye', 'Macula lutea', parts=[('ctx', V4('^Optic part of (right|left) retina$'))], pins=[('P', [-33.5, -140, 1518], 'bi')], approx=True)
item(E, 'Eye', 'Central fovea', parts=[('ctx', V4('^Optic part of (right|left) retina$'))], pins=[('P', [-33.5, -139.5, 1517.5], 'bi')], approx=True, aka=['Fovea'])
item(E, 'Eye', 'Central retinal artery', ['Runs in the optic nerve.'], parts=[('ctx', V4(side('optic nerve')))],
     paths=[dict(pts=[[-27, -132, 1521], [-28.5, -136, 1520.5], [-29, -140, 1520]], bi=True, kind='artery')], approx=True)
item(E, 'Eye', 'Central retinal vein', ['Runs in the optic nerve.'], parts=[('ctx', V4(side('optic nerve')))],
     paths=[dict(pts=[[-26, -132, 1521.5], [-28, -136, 1521], [-28.5, -140, 1520.5]], bi=True, kind='vein')], approx=True)
item(E, 'Eye', 'Lens', parts=[V4(side('lens'))])
item(E, 'Eye', 'Anterior cavity', ['Anterior chamber + posterior chamber, filled with aqueous humor.'],
     parts=[V4('^Anterior chamber of (right|left) eyeball$')])
item(E, 'Eye', 'Anterior chamber', parts=[V4('^Anterior chamber of (right|left) eyeball$')])
item(E, 'Eye', 'Posterior chamber', ['Between the iris and the lens.'], parts=[('ctx', V4(side('iris'), side('lens')))],
     pins=[('P', [-35, -159, 1518], 'bi')], approx=True)
item(E, 'Eye', 'Aqueous humor', parts=[V4('^Anterior chamber of (right|left) eyeball$')])
item(E, 'Eye', 'Vitreous chamber (posterior cavity)', parts=[V4(side('vitreous body'))], aka=['Posterior cavity'])
item(E, 'Eye', 'Vitreous body (vitreous humor)', parts=[V4(side('vitreous body'))], aka=['Vitreous humor'])
item(E, 'Eye', 'Scleral venous sinus (canal of Schlemm)', ['At the junction of the cornea and sclera.'],
     parts=[('ctx', V4(side('cornea')))], pins=[('P', [-30.5, -160.5, 1525], 'bi')], approx=True, aka=['Canal of Schlemm'])

# ------------------------------------------------------------------ EAR
EA = 'Ear'
TB = ('ctx', V4(side('temporal bone')))
item(EA, 'External ear', 'External ear', parts=[V4(exact('External ear'))])
item(EA, 'External ear', 'Pinna', parts=[V4(exact('External ear'))], aka=['Auricle'])
item(EA, 'External ear', 'External auditory canal', parts=[TB], paths=[dict(pts=[[-70, -82, 1507], [-60, -80, 1507], [-47, -83, 1506]], bi=True, kind='duct')], approx=True)
item(EA, 'Middle ear', 'Tympanic membrane', parts=[TB], pins=[('P', [-46, -83, 1506], 'bi')], approx=True)
item(EA, 'Middle ear', 'Middle ear', parts=[TB], pins=[('P', [-41, -83, 1508], 'bi')], approx=True)
item(EA, 'Middle ear', 'Auditory ossicles', ['Malleus, incus and stapes.'], parts=[TB],
     pins=[('P', [-43, -84, 1509], 'bi'), ('P', [-41, -81, 1510], 'bi'), ('P', [-39, -82, 1507], 'bi')], approx=True)
item(EA, 'Middle ear', 'Malleus', parts=[TB], pins=[('P', [-43, -84, 1509], 'bi')], approx=True)
item(EA, 'Middle ear', 'Incus', parts=[TB], pins=[('P', [-41, -81, 1510], 'bi')], approx=True)
item(EA, 'Middle ear', 'Stapes', parts=[TB], pins=[('P', [-39, -82, 1507], 'bi')], approx=True)
item(EA, 'Middle ear', 'Eustachian tube', ['Also called the auditory tube or pharyngotympanic tube.'], parts=[TB],
     paths=[dict(pts=[[-40, -86, 1505], [-30, -96, 1499], [-20, -104, 1494], [-14, -108, 1491]], bi=True, kind='duct')],
     approx=True, aka=['Auditory tube', 'Pharyngotympanic tube'])
item(EA, 'Inner ear', 'Inner ear', parts=[TB], pins=[('P', [-33, -87, 1506], 'bi'), ('P', [-36, -80, 1508], 'bi'), ('P', [-38, -74, 1512], 'bi')], approx=True)
item(EA, 'Inner ear', 'Cochlea', ['Hearing.'], parts=[TB], pins=[('P', [-33, -87, 1506], 'bi')], approx=True)
item(EA, 'Inner ear', 'Vestibule', ['Balance.'], parts=[TB], pins=[('P', [-36, -80, 1508], 'bi')], approx=True)
item(EA, 'Inner ear', 'Semicircular canals', ['Balance.'], parts=[TB], pins=[('P', [-38, -74, 1512], 'bi')], approx=True)

# ------------------------------------------------------------------ OTHER STRUCTURES
O = 'Other structures'
item(O, 'Neck organs', 'Esophagus', parts=[('box', exact('Esophagus'), [-30, -130, 1300], [30, -60, 1400])])
THY = [('ell', [-18, -103, 1384], [8, 9, 19], 'bi')]
item(O, 'Neck organs', 'Thyroid gland', ['Two lobes joined by the isthmus.'], parts=THY + [('ell', [-0.5, -114, 1377], [11, 4, 5])], approx=True)
item(O, 'Neck organs', 'Isthmus', ['Isthmus of the thyroid gland.'], parts=[('ell', [-0.5, -114, 1377], [11, 4, 5])] + [('ctx', p) for p in THY], approx=True)
item(O, 'Neck organs', 'Parathyroid glands', ['On the posterior thyroid lobes.'], parts=[('ctx', p) for p in THY],
     pins=[('P', [-19, -95, 1395], 'bi'), ('P', [-19, -95, 1372], 'bi')], approx=True)
item(O, 'Salivary glands', 'Parotid glands', parts=[('ell', [-50, -97, 1478], [9, 14, 22], 'bi')], approx=True)
item(O, 'Salivary glands', 'Parotid duct', ['Crosses the masseter and pierces the buccinator.'],
     parts=[('ctx', ('ell', [-50, -97, 1478], [9, 14, 22], 'bi'))],
     paths=[dict(pts=[[-52, -110, 1484], [-51, -125, 1486], [-47, -140, 1485], [-38, -150, 1482]], bi=True, kind='duct')], approx=True)
item(O, 'Salivary glands', 'Sublingual glands', parts=[V4(side('sublingual gland'))])
item(O, 'Salivary glands', 'Submandibular glands', parts=[V4(side('submandibular gland'))])
MO = 'Mouth'
item(O, MO, 'Mouth', parts=[V4(exact('Lip'), exact('Tongue'))], pins=[('P', [-0.5, -170, 1455])])
TEETH = lambda kind: V4(f'^(Right|Left) (upper|lower) {kind} tooth$')
item(O, MO, 'Teeth', ['Know names and how to number them: incisors, canines, premolars, molars.'],
     parts=[TEETH('(central|lateral) secondary incisor'), TEETH('secondary canine'), TEETH('(first|second) secondary premolar'), TEETH('(first|second) secondary molar')])
item(O, MO, 'Incisors', parts=[TEETH('(central|lateral) secondary incisor')])
item(O, MO, 'Canines', parts=[TEETH('secondary canine')])
item(O, MO, 'Premolars', parts=[TEETH('(first|second) secondary premolar')])
item(O, MO, 'Molars', parts=[TEETH('(first|second) secondary molar')])
item(O, MO, 'Tongue', parts=[V4(exact('Tongue'))])
item(O, MO, 'Frenulum', ['Lingual frenulum under the tongue.'], parts=[('ctx', V4(exact('Tongue')))], pins=[('P', [-0.5, -158, 1438])], approx=True)
item(O, MO, 'Soft palate', ['Shown by the muscles of the soft palate.'],
     parts=[V4(side('levator veli palatini'), side('tensor veli palatini'), exact('Uvular muscle'))], approx=True)
item(O, MO, 'Uvula', parts=[V4(exact('Uvular muscle'))])
item(O, MO, 'Palatoglossal arches', parts=[('ctx', V4(exact('Tongue')))],
     paths=[dict(pts=[[-6, -118, 1474], [-14, -116, 1466], [-17, -116, 1455]], bi=True, kind='region')], approx=True)
item(O, MO, 'Palatopharyngeal arches', parts=[V4(side('palatopharyngeus'))])
TON = 'Tonsils'
item(O, TON, 'Tonsils', ['Pharyngeal tonsils (adenoids), tubal tonsils, palatine tonsils, lingual tonsils.'],
     pins=[('P', [-0.5, -96, 1500]), ('P', [-14, -106, 1490], 'bi'), ('P', [-15, -110, 1460], 'bi'), ('P', [-0.5, -113, 1448])], approx=True)
item(O, TON, 'Pharyngeal tonsils (adenoids)', pins=[('P', [-0.5, -96, 1500])], approx=True, aka=['Adenoids'])
item(O, TON, 'Tubal tonsils', pins=[('P', [-14, -106, 1490], 'bi')], approx=True)
item(O, TON, 'Palatine tonsils', pins=[('P', [-15, -110, 1460], 'bi')], approx=True)
item(O, TON, 'Lingual tonsils', parts=[('ctx', V4(exact('Tongue')))], pins=[('P', [-0.5, -113, 1448])], approx=True)
item(O, TON, 'Opening of eustachian tube', pins=[('P', [-14, -108, 1491], 'bi')], approx=True)
NO = 'Nose'
item(O, NO, 'Nares', parts=[V4(side('major alar cartilage'))], pins=[('P', [-6, -200, 1478], 'bi')], approx=True)
item(O, NO, 'Nasal vestibule', parts=[('ctx', V4(side('major alar cartilage')))], pins=[('P', [-6, -192, 1482], 'bi')], approx=True)
item(O, NO, 'Nasal septum', ['Septal cartilage + perpendicular plate of ethmoid bone + vomer.'],
     parts=[V4(exact('Septal nasal cartilage'), exact('Vomer')), ('box', exact('Ethmoid'), [-3, -165, 1495], [2, -125, 1532])])
item(O, NO, 'Septal cartilage', parts=[V4(exact('Septal nasal cartilage'))])
item(O, NO, 'Perpendicular plate of ethmoid bone', parts=[('box', exact('Ethmoid'), [-3, -165, 1495], [2, -125, 1532]), ('ctx', V4(exact('Ethmoid')))])
item(O, NO, "Kiesselbach plexus / Little's area", ['On the anterior nasal septum.'], parts=[('ctx', V4(exact('Septal nasal cartilage')))],
     pins=[('P', [-1.5, -180, 1488], 'bi')], approx=True, aka=['Kiesselbach plexus', "Little's area"])
item(O, NO, 'Turbinate bones', ['Superior, middle and inferior nasal conchae.'],
     parts=[V4(side('inferior nasal concha')), ('box', exact('Ethmoid'), [-14, -160, 1495], [13, -128, 1515])], aka=['Nasal conchae'])
item(O, NO, 'Superior nasal concha', ['Part of the ethmoid bone.'], parts=[('ctx', V4(exact('Ethmoid')))], pins=[('P', [-6, -138, 1513], 'bi')], approx=True)
item(O, NO, 'Middle nasal concha', ['Part of the ethmoid bone.'], parts=[('box', exact('Ethmoid'), [-14, -160, 1495], [13, -128, 1508])], pins=[('P', [-8, -148, 1501], 'bi')], approx=True)
item(O, NO, 'Inferior nasal concha', parts=[V4(side('inferior nasal concha'))])
item(O, NO, 'Meatuses', ['Meatuses = spaces beneath the conchae.'], parts=[('ctx', V4(side('inferior nasal concha')))],
     pins=[('P', [-9, -140, 1508], 'bi'), ('P', [-11, -150, 1494], 'bi'), ('P', [-12, -155, 1481], 'bi')], approx=True)
PH = 'Pharynx'
item(O, PH, 'Pharynx', ['Nasopharynx, oropharynx and laryngopharynx.'], parts=[V4(side('superior pharyngeal constrictor'), side('middle pharyngeal constrictor'), side('inferior pharyngeal constrictor'))])
item(O, PH, 'Nasopharynx', parts=[('ctx', V4(side('superior pharyngeal constrictor')))], pins=[('P', [-0.5, -105, 1492])], approx=True)
item(O, PH, 'Oropharynx', parts=[('ctx', V4(side('superior pharyngeal constrictor'), side('middle pharyngeal constrictor')))], pins=[('P', [-0.5, -102, 1455])], approx=True)
item(O, PH, 'Laryngopharynx', parts=[('ctx', V4(side('middle pharyngeal constrictor'), side('inferior pharyngeal constrictor')))], pins=[('P', [-0.5, -96, 1415])], approx=True)
LX = 'Larynx'
item(O, LX, 'Larynx', parts=[V4(exact('Thyroid cartilage'), exact('Cricoid cartilage'), exact('Epiglottis'), side('arytenoid cartilage'))])
item(O, LX, 'Epiglottis', parts=[V4(exact('Epiglottis'))])
item(O, LX, 'Aryepiglottic folds', parts=[V4(side('aryepiglotticus'))])
item(O, LX, 'Thyroid cartilage', parts=[V4(exact('Thyroid cartilage'))])
item(O, LX, 'Superior horn (thyroid cartilage)', parts=[('sub', exact('Thyroid cartilage'), 'Superior horn', 8, [0, 0, -3])], pins=[('L', 'Superior horn')], aka=['Superior horn'])
item(O, LX, 'Inferior horn (thyroid cartilage)', parts=[('sub', exact('Thyroid cartilage'), 'Inferior horn', 7, [0, 0, 3])], pins=[('L', 'Inferior horn')], aka=['Inferior horn'])
item(O, LX, 'Laryngeal prominence', ["The Adam's apple."], parts=[('sub1', exact('Thyroid cartilage'), 'Laryngeal prominence', 9, [0, 3, -3])], pins=[('L', 'Laryngeal prominence')])
item(O, LX, 'Thyrohyoid membrane', parts=[V4(side('thyrohyoid membrane'), exact('Median thyrohyoid ligament'))])
item(O, LX, 'Cricothyroid ligament', parts=[V4(exact('Median cricothyroid ligament'))])
item(O, LX, 'Cricoid cartilage', parts=[V4(exact('Cricoid cartilage'))])
item(O, LX, 'Cricotracheal ligament', parts=[('ctx', V4(exact('Cricoid cartilage'), exact('Trachea')))], pins=[('P', [-0.5, -109, 1387])], approx=True)
item(O, LX, 'Arytenoid cartilages', parts=[V4(side('arytenoid cartilage'))])
item(O, LX, 'Corniculate cartilage', parts=[V4(side('corniculate cartilage'))])
item(O, LX, 'Cuneiform cartilage', parts=[V4(side('cuneiform cartilage'))])
item(O, LX, 'Vocal folds (true vocal cords)', parts=[V4(side('vocal ligament'), side('vocalis'))], aka=['True vocal cords'])
item(O, LX, 'Rima glottidis', ['The opening between the vocal folds.'], parts=[('ctx', V4(side('vocal ligament')))], pins=[('P', [-0.5, -108, 1405])], approx=True)
IM = 'Intrinsic laryngeal muscles'
item(O, IM, 'Posterior cricoarytenoid', parts=[V4(side('posterior crico-arytenoid'))])
item(O, IM, 'Lateral cricoarytenoid', parts=[V4(side('lateral crico-arytenoid'))])
item(O, IM, 'Transverse arytenoid', parts=[V4(exact('Transverse arytenoid'))])
item(O, IM, 'Oblique arytenoid', parts=[V4(side('oblique arytenoid'))])
item(O, IM, 'Thyroarytenoid', parts=[V4(side('thyro-arytenoid'))])
item(O, IM, 'Thyroepiglottic', ['Shown by the thyroepiglottic ligament, which the muscle runs along.'], parts=[V4(exact('Thyro-epiglottic ligament'))], approx=True)
item(O, IM, 'Vocalis (muscle)', parts=[V4(side('vocalis'))], aka=['Vocalis'])
item(O, IM, 'Cricothyroid', parts=[V4('^(Straight|Oblique) part of (right|left) cricothyroid$')])
item(O, 'Airway', 'Trachea', parts=[('box', exact('Trachea'), [-30, -130, 1300], [30, -60, 1400])])

# ------------------------------------------------------------------ NERVES
NV = 'Nerves'
item(NV, 'Nasal nerves', 'Anterior ethmoidal nerve (branch of V1)', parts=[V4(side('anterior ethmoidal nerve'))], aka=['Anterior ethmoidal nerve'])
item(NV, 'Nasal nerves', 'Nasopalatine nerve (branch of V2)', ['Runs along the nasal septum to the incisive canal.'],
     parts=[('ctx', V4(exact('Vomer')))], paths=[dict(pts=[[-1.5, -128, 1505], [-1.5, -145, 1495], [-1.5, -162, 1484], [-1, -172, 1474]], bi=True, kind='nerve')],
     approx=True, aka=['Nasopalatine nerve'])
C = 'Cranial nerves'
def cn(num, nm, foramen, action, parts=(), paths=(), pins=(), approx=True, aka=()):
    item(NV, C, f'{num} {nm}', [f'Foramen: {foramen}', f'Action: {action}'], parts=parts, paths=paths, pins=pins, approx=approx, aka=[nm] + list(aka))
P = lambda pts, kind='nerve': dict(pts=pts, bi=True, kind=kind)
cn('I', 'Olfactory', 'Olfactory foramina of the cribriform plate of the ethmoid bone', 'Smell',
   parts=[('ctx', V4(exact('Ethmoid')))], paths=[P([[-4, -152, 1526], [-5, -140, 1530], [-7, -122, 1534], [-10, -108, 1538]])])
cn('II', 'Optic', 'Optic foramen', 'Vision', parts=[V4(side('optic nerve'), exact('Optic chiasm'), side('optic tract'))], approx=False)
cn('III', 'Oculomotor', 'Superior orbital fissure', 'Movement of eyeball; Movement of eyelid; Pupil constriction',
   parts=[('ctx', V4(side('(superior|inferior|medial) rectus'), side('inferior oblique')))],
   paths=[P([[-3, -93, 1540], [-8, -100, 1530], [-14, -110, 1524], [-22, -122, 1525], [-27, -128, 1526], [-30, -136, 1522]])])
cn('IV', 'Trochlear', 'Superior orbital fissure', 'Movement of eyeball (superior oblique muscle)',
   parts=[V4(side('trochlear nerve')), ('ctx', V4(side('superior oblique')))], approx=False)
cn('V', 'Trigeminal', 'Ophthalmic branch V1 = superior orbital fissure. Maxillary branch V2 = foramen rotundum. Mandibular branch V3 = foramen ovale.',
   'Sensation for skin on face; Movement for chewing',
   parts=[V4(side('ophthalmic nerve'), side('frontal nerve'), side('nasociliary nerve'), side('lacrimal nerve'))],
   paths=[P([[-12, -86, 1515], [-18, -95, 1514], [-22, -101, 1513]]),
          P([[-22, -101, 1513], [-19, -112, 1517], [-17, -119, 1520], [-22, -130, 1509], [-27, -150, 1503], [-27, -162, 1497]]),
          P([[-22, -101, 1513], [-24, -102, 1505], [-28, -108, 1490], [-34, -112, 1470], [-36, -125, 1452], [-28, -150, 1442], [-22, -162, 1442]])],
   aka=['V1', 'V2', 'V3'])
cn('VI', 'Abducens', 'Superior orbital fissure', 'Movement of eyeball (lateral rectus muscle)',
   parts=[('ctx', V4(side('lateral rectus')))],
   paths=[P([[-3, -86, 1500], [-6, -96, 1512], [-14, -110, 1520], [-26, -126, 1527], [-33, -138, 1520]])])
cn('VII', 'Facial', 'Stylomastoid foramen', 'Movement for facial expressions; Taste; Tear production; Saliva',
   parts=[('ctx', ('v3', ['FMA46759', 'FMA46760', 'FMA46782', 'FMA46783', 'FMA46841', 'FMA46835', 'FMA46836']))],
   paths=[P([[-13, -84, 1506], [-25, -80, 1510], [-36, -82, 1500], [-43, -77, 1483], [-50, -92, 1477]]),
          P([[-50, -92, 1477], [-60, -115, 1520], [-55, -140, 1545]]), P([[-50, -92, 1477], [-56, -125, 1500], [-45, -150, 1508]]),
          P([[-50, -92, 1477], [-52, -125, 1482], [-40, -155, 1478]]), P([[-50, -92, 1477], [-46, -120, 1445], [-32, -160, 1438]]),
          P([[-50, -92, 1477], [-46, -105, 1440], [-40, -112, 1415]])],
   pins=[('P', [-43, -77, 1483], 'bi')], aka=['Stylomastoid foramen'])
cn('VIII', 'Vestibulocochlear', 'Internal auditory meatus', 'Hearing; Balance',
   parts=[TB], paths=[P([[-13, -82, 1507], [-24, -80, 1510], [-31, -82, 1508], [-34, -84, 1507]])], aka=['Internal auditory meatus'])
cn('IX', 'Glossopharyngeal', 'Jugular foramen', 'Swallowing; Speech; Taste; Saliva', parts=[('ctx', V4(exact('Tongue')))],
   paths=[P([[-8, -76, 1495], [-22, -77, 1498], [-33, -78, 1497], [-32, -92, 1480], [-25, -108, 1462], [-14, -118, 1450]])])
cn('X', 'Vagus', 'Jugular foramen', 'Swallowing; Speech; Coughing; Taste; Sensation for pharynx and epiglottis; Digestion; Slows heart rate',
   parts=[('ctx', V4(side('common carotid artery'), side('internal jugular vein')))],
   paths=[P([[-8, -74, 1492], [-22, -76, 1496], [-33, -79, 1497], [-29, -100, 1460], [-22, -112, 1400], [-21, -114, 1335]])])
cn('XI', 'Accessory', 'Jugular foramen', 'Swallowing; Movement of sternocleidomastoid and trapezius muscles',
   parts=[('ctx', V4(side('sternocleidomastoid'), '^Descending part of (right|left) trapezius$'))],
   paths=[P([[-8, -70, 1488], [-22, -74, 1494], [-33, -77, 1496], [-40, -85, 1470], [-48, -90, 1445], [-58, -70, 1410], [-62, -55, 1380]])])
cn('XII', 'Hypoglossal', 'Hypoglossal canal', 'Swallowing; Speech', parts=[('ctx', V4(exact('Tongue')))],
   paths=[P([[-6, -80, 1488], [-16, -70, 1482], [-24, -70, 1478], [-32, -88, 1460], [-30, -108, 1440], [-20, -122, 1436], [-14, -140, 1440]])])

# ------------------------------------------------------------------ VESSELS
AR, VE = 'Arteries', 'Veins'
BIF = [-21, -109, 1428]
ECA = [[-21, -110, 1430], [-25, -114, 1445], [-32, -110, 1462], [-40, -100, 1480], [-44, -96, 1490]]
item(AR, AR, 'Common carotid artery', ['Bifurcation at C3/C4 level.'], parts=[V4(side('common carotid artery'))],
     paths=[P([[-16.5, -108, 1373], [-19, -109, 1405], BIF], 'artery')], approx=True)
item(AR, AR, 'Carotid sinus', ['At the bifurcation of the common carotid artery.'], parts=[('ctx', V4(side('common carotid artery')))],
     pins=[('P', BIF, 'bi')], paths=[P([[-16.5, -108, 1373], [-19, -109, 1405], BIF], 'artery')], approx=True)
item(AR, AR, 'Internal carotid artery', parts=[V4(side('internal carotid artery'))],
     paths=[P([BIF, [-28, -107, 1431], [-35, -105, 1436]], 'artery')], approx=True)
item(AR, AR, 'External carotid artery', parts=[('ctx', V4(side('common carotid artery')))], paths=[P(ECA, 'artery')], approx=True)
def eca_branch(nm, pts, notes=()):
    item(AR, 'External carotid branches', nm, list(notes), paths=[P(ECA, 'ctxartery'), P(pts, 'artery')], approx=True)
eca_branch('Superior thyroid artery', [[-22, -112, 1433], [-22, -118, 1420], [-20, -114, 1402], [-18, -108, 1396]])
eca_branch('Cricothyroid artery', [[-21, -117, 1410], [-11, -119, 1398], [-1, -117, 1395]], ['Branch of the superior thyroid artery.'])
eca_branch('Lingual artery', [[-24, -113, 1440], [-19, -121, 1438], [-13, -132, 1441], [-8, -150, 1449]])
eca_branch('Facial artery', [[-27, -114, 1447], [-31, -126, 1440], [-37, -140, 1428], [-39, -150, 1445], [-31, -170, 1462], [-23, -176, 1490], [-15, -170, 1520]])
eca_branch('Occipital artery', [[-28, -112, 1449], [-36, -95, 1466], [-42, -70, 1480], [-36, -40, 1496], [-20, -10, 1512]])
eca_branch('Posterior auricular artery', [[-38, -100, 1475], [-51, -82, 1488], [-63, -72, 1506]])
eca_branch('Ascending pharyngeal artery', [[-21, -108, 1432], [-18, -102, 1460], [-16, -100, 1490]])
eca_branch('Maxillary artery', [[-44, -96, 1490], [-38, -110, 1492], [-30, -122, 1496], [-24, -128, 1500]])
eca_branch('Superficial temporal artery', [[-44, -96, 1490], [-66, -92, 1505], [-70, -95, 1530], [-67, -112, 1560], [-58, -140, 1566]])
item(AR, 'Subclavian branches', 'Subclavian artery', parts=[V4(side('subclavian artery'))])
item(AR, 'Subclavian branches', 'Vertebral artery', ['Passes through the transverse foramina.'], parts=[V4(side('vertebral artery'))])
item(AR, 'Subclavian branches', 'Internal mammary artery', ['Also called the internal thoracic artery.'],
     parts=[('box', side('internal thoracic artery'), [-60, -140, 1300], [60, -90, 1360])], aka=['Internal thoracic artery'])
item(AR, 'Subclavian branches', 'Thyrocervical trunk', parts=[V4(side('thyrocervical trunk'))])
item(AR, 'Subclavian branches', 'Inferior thyroid artery', parts=[V4(side('inferior thyroid artery'))])
item(AR, AR, 'Circle of Willis', parts=[V4(side('anterior cerebral artery'), exact('Anterior communicating artery'), side('posterior communicating artery'),
                                           '^(Pre|Post)communicating part of (right|left) posterior cerebral artery$', exact('Basilar artery'),
                                           '^Sphenoid part of (right|left) middle cerebral artery$')])
item(VE, VE, 'Internal jugular vein', parts=[V4(side('internal jugular vein'))],
     paths=[P([[-26.4, -114, 1381], [-29, -110, 1430], [-33, -95, 1468], [-33, -79, 1497]], 'vein')], approx=True)
item(VE, VE, 'External jugular vein', parts=[('ctx', V4(side('sternocleidomastoid')))],
     paths=[P([[-47, -104, 1452], [-51, -96, 1420], [-50, -84, 1385], [-46, -78, 1340]], 'vein')], approx=True)
item(VE, VE, 'Anterior jugular vein', paths=[P([[-7, -142, 1430], [-9, -132, 1400], [-11, -126, 1365], [-24, -122, 1336]], 'vein')], approx=True)
item(VE, VE, 'Brachiocephalic vein', parts=[V4(side('brachiocephalic vein'))])
