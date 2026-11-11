// plexus.js: everything the brachial plexus slice knows, in one place: which structures are in the model, what may be
// said about each, where that statement was checked, the lesson, the identification challenge and the practice questions.
//
// RULES FOR THIS FILE
// 1. A structure may only be asked about if it exists as its own named object in the source model (Z-Anatomy).
//    The model has NO separate lateral cord, medial cord, C5-T1 roots or phrenic nerve. They are never asked for and
//    never drawn; where a lesson has to mention them it says the model lacks them.
// 2. Every fact carries source keys. Text here is original; nothing is copied from the books.
// 3. `checked` says who checked it. Today that is "ai" everywhere: compared by Claude against the cited pages and
//    against tools/audit_plexus.py. It is not faculty-reviewed. The app shows this status to the learner.

export const SOURCES = {
  ZA: { kind: 'model', cite: 'Z-Anatomy, the libre 3D atlas of anatomy (CC BY-SA 4.0), derived from BodyParts3D, The Database Center for Life Science (CC BY-SA 2.1 Japan). Names follow Terminologia Anatomica 2.' },
  HADZIC3: { kind: 'textbook', cite: "Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3 Functional Regional Anesthesia Anatomy, pp. 43-48" },
  HADZIC_PH: { kind: 'textbook', cite: "Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 43 (course of the phrenic nerve and its block with approaches above the clavicle)" },
  NAG50: { kind: 'textbook', cite: 'Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50 Regional Anesthesia: Upper Extremity, Lower Extremity, and Truncal Blocks, pp. 1149-1156' },
  NETTER439: { kind: 'atlas', cite: 'Netter Atlas of Human Anatomy: Classic Regional Approach, 8th ed., Plate 439 Brachial Plexus: Schema (see also Plates 483, 484)' },
  NBCRNA: { kind: 'outline', cite: 'NBCRNA 2025/2026 NCE and SEE Content Outline, III.I Local/regional anesthetics: 1 Anatomy, 5 Peripheral blocks, 7 Ultrasound and/or nerve stimulator guided concepts' },
};

// id = object name in the GLB. `ask` = may appear in the challenge.
export const STRUCTURES = {
  superior_trunk_of_brachial_plexus_r: { name: 'Superior trunk', group: 'trunk', ask: true, fact: 'Formed by C5 and C6. Gives the suprascapular nerve and the nerve to subclavius.', src: ['HADZIC3', 'NETTER439'] },
  middle_trunk_of_brachial_plexus_r: { name: 'Middle trunk', group: 'trunk', ask: true, fact: 'The continuation of C7 alone.', src: ['HADZIC3', 'NETTER439'] },
  inferior_trunk_of_brachial_plexus_r: { name: 'Inferior trunk', group: 'trunk', ask: true, fact: 'Formed by C8 and T1. It lies lowest, just behind and above the subclavian artery.', src: ['HADZIC3', 'NETTER439'] },
  posterior_cord_of_brachial_plexus_r: { name: 'Posterior cord', group: 'cord', ask: true, fact: 'Formed by the posterior divisions of all three trunks. Gives the axillary and radial nerves, the subscapular nerves and the thoracodorsal nerve.', src: ['HADZIC3', 'NETTER439'] },
  musculocutaneous_nerve_r: { name: 'Musculocutaneous nerve', group: 'terminal', ask: true, fact: 'C5 to C7, from the lateral cord. Pierces coracobrachialis, supplies the elbow flexors, and ends as the lateral cutaneous nerve of the forearm. This model draws it only in the arm, beside coracobrachialis and not through it.', src: ['NAG50', 'NETTER439'] },
  axillary_nerve_r: { name: 'Axillary nerve', group: 'terminal', ask: true, fact: 'C5 and C6, from the posterior cord. Winds around the surgical neck of the humerus to deltoid and teres minor.', src: ['NAG50', 'NETTER439'] },
  radial_nerve_r: { name: 'Radial nerve', group: 'terminal', ask: true, fact: 'C5 to T1, the continuation of the posterior cord. Runs behind the humerus and supplies the extensors of the arm and forearm.', src: ['NAG50', 'NETTER439'] },
  median_nerve_r: { name: 'Median nerve', group: 'terminal', ask: true, fact: 'C5 to T1, from both the lateral and medial cords. Travels with the brachial artery down the arm.', src: ['NAG50', 'NETTER439'] },
  ulnar_nerve_r: { name: 'Ulnar nerve', group: 'terminal', ask: true, fact: 'C8 and T1, from the medial cord. Passes behind the medial epicondyle at the elbow.', src: ['NAG50', 'NETTER439'] },
  suprascapular_nerve_r: { name: 'Suprascapular nerve', group: 'branch', ask: true, fact: 'C5 and C6, from the superior trunk. Runs back to supraspinatus and infraspinatus and carries much of the sensation of the shoulder joint.', src: ['HADZIC3', 'NETTER439'] },
  long_thoracic_nerve_r: { name: 'Long thoracic nerve', group: 'branch', ask: true, fact: 'From the roots C5 to C7. Descends on serratus anterior, which it supplies; injury produces a winged scapula.', src: ['HADZIC3', 'NETTER439'] },
  dorsal_scapular_nerve_r: { name: 'Dorsal scapular nerve', group: 'branch', ask: true, fact: 'From the C5 root. Runs back through the middle scalene to the rhomboids and levator scapulae.', src: ['HADZIC3', 'NETTER439'] },
  scalenus_anterior_muscle_r: { name: 'Anterior scalene', group: 'landmark', ask: true, fact: 'The roots of the plexus pass behind it and in front of the middle scalene. The subclavian vein passes in front of it; the artery and plexus pass behind.', src: ['HADZIC3', 'NAG50'] },
  scalenus_medius_muscle_r: { name: 'Middle scalene', group: 'landmark', ask: true, fact: 'Forms the back wall of the interscalene groove.', src: ['HADZIC3', 'NAG50'] },
  sternocleidomastoid_muscle_r: { name: 'Sternocleidomastoid', group: 'landmark', ask: true, fact: 'Covers the scalenes. The interscalene groove is felt behind its lateral border.', src: ['NAG50'] },
  right_subclavian_artery: { name: 'Subclavian artery', group: 'landmark', ask: true, fact: 'Crosses the first rib behind the anterior scalene, with the trunks of the plexus above and behind it.', src: ['HADZIC3', 'NAG50'] },
  first_rib_r: { name: 'First rib', group: 'landmark', ask: true, fact: 'The subclavian artery crosses it, with the inferior trunk just behind the artery.', src: ['NAG50'] },
  clavicle_r: { name: 'Clavicle', group: 'landmark', ask: true, fact: 'Divides the plexus into a supraclavicular part (roots, trunks, divisions) and an infraclavicular part (cords and branches).', src: ['NAG50'] },
  cricoid_cartilage: { name: 'Cricoid cartilage', group: 'landmark', ask: true, fact: 'Marks the level of C6, the level at which the interscalene groove is traditionally sought.', src: ['NAG50'] },
  // present in the model, shown and named, but not asked about in this slice
  axillary_artery_r: { name: 'Axillary artery', group: 'context', fact: 'The cords are named for their position around this artery.', src: ['NAG50', 'NETTER439'] },
  right_subclavian_vein: { name: 'Subclavian vein', group: 'context', fact: 'Passes in front of the anterior scalene.', src: ['HADZIC3'] },
  scalenus_posterior_muscle_r: { name: 'Posterior scalene', group: 'context' },
  pectoralis_minor_muscle_r: { name: 'Pectoralis minor', group: 'context', fact: 'The cords lie deep to it in the infraclavicular fossa.', src: ['NAG50'] },
  coracobrachialis_muscle_r: { name: 'Coracobrachialis', group: 'context' },
  vertebra_c6: { name: 'C6 vertebra', group: 'context' },
};
// what the learner is told, wherever it matters
export const MODEL_GAPS = 'This model has no separate lateral cord, medial cord, C5 to T1 roots or phrenic nerve, and it draws the junction of divisions and cords only roughly. Those are taught in words and never asked for by clicking.';
export const CHECK_STATUS = 'Checked by AI against the cited pages and a geometric audit of the model. Not yet reviewed by faculty.';
export const HIDE = ['vertebra_t10', 'vertebra_t11', 'vertebra_t12'];
export const LAYERS = [['bone', 'Bones'], ['muscle', 'Muscles'], ['artery', 'Arteries'], ['vein', 'Veins'], ['nerve', 'Nerves'], ['airway', 'Airway']];

// THE LESSON: six steps, each ends with something you do to the model, not a question about it.
const T = ['superior_trunk_of_brachial_plexus_r', 'middle_trunk_of_brachial_plexus_r', 'inferior_trunk_of_brachial_plexus_r'];
const TERM = ['musculocutaneous_nerve_r', 'axillary_nerve_r', 'radial_nerve_r', 'median_nerve_r', 'ulnar_nerve_r'];
export const LESSON = [
  { title: 'It is hidden.', say: 'From the front, the plexus is covered. The muscle in the way is the sternocleidomastoid.', view: 'anterolateral', glow: ['sternocleidomastoid_muscle_r'], do: 'Click the sternocleidomastoid to lift it away.', until: { hide: 'sternocleidomastoid_muscle_r' }, src: ['NAG50'] },
  { title: 'Two muscles, one groove.', say: 'Underneath are the anterior and middle scalenes. The roots of the plexus run between them, in the interscalene groove, and join into trunks at its outer edge. This model starts at the trunks.', view: 'groove', glow: ['scalenus_anterior_muscle_r', 'scalenus_medius_muscle_r'], hide: ['sternocleidomastoid_muscle_r', 'omohyoid_muscle_r'], do: 'Click any one of the trunks coming out beside the scalenes.', until: { pick: T }, src: ['HADZIC3', 'NAG50'] },
  { title: 'Three trunks.', say: 'C5 and C6 join as the superior trunk. C7 continues alone as the middle trunk. C8 and T1 join as the inferior trunk, which sits lowest, just behind the subclavian artery.', view: 'groove', glow: T, label: T, ghost: ['muscle'], do: 'Click the three trunks from highest to lowest.', until: { order: T }, src: ['HADZIC3', 'NETTER439'] },
  { title: 'Every trunk divides.', say: 'Behind the clavicle each trunk splits into an anterior and a posterior division. All three posterior divisions join into one posterior cord. The anterior divisions form the lateral and medial cords. This model draws that junction only roughly and has no separate lateral or medial cord, so take the wiring from these words and the position from the model.', view: 'cords', glow: ['posterior_cord_of_brachial_plexus_r'], ghost: ['muscle'], do: 'Click the posterior cord.', until: { pick: ['posterior_cord_of_brachial_plexus_r'] }, src: ['HADZIC3', 'NETTER439'] },
  { title: 'Five nerves leave for the arm.', say: 'From the posterior cord: axillary and radial. From the lateral cord: musculocutaneous, which this model draws only in the arm. From the medial cord: ulnar. From both: median.', view: 'arm', glow: TERM, label: TERM, ghost: ['muscle'], do: 'Click the two nerves that come from the posterior cord.', until: { all: ['axillary_nerve_r', 'radial_nerve_r'] }, src: ['NAG50', 'NETTER439'] },
  { title: 'Why the level matters.', say: 'An interscalene block is placed high, at about the level of the cricoid cartilage, around the superior and middle trunks. The inferior trunk is furthest away, so C8 and T1 are the fibres most often missed. The phrenic nerve, which is not in this model, runs down the front of the anterior scalene right beside the injection.', view: 'groove', glow: ['cricoid_cartilage', ...T], ghost: ['muscle'], do: 'Click the trunk an interscalene block is most likely to miss.', until: { pick: ['inferior_trunk_of_brachial_plexus_r'] }, src: ['NAG50', 'HADZIC_PH'] },
];

// THE CHALLENGE: nothing is labelled. `find` = identification, `apply` = use it.
export const CHALLENGE = [
  { kind: 'find', ask: 'Select the superior trunk.', answer: ['superior_trunk_of_brachial_plexus_r'], why: 'The highest of the three trunks, formed by C5 and C6.', src: ['HADZIC3'] },
  { kind: 'find', ask: 'Select the middle trunk.', answer: ['middle_trunk_of_brachial_plexus_r'], why: 'C7 alone, between the other two.', src: ['HADZIC3'] },
  { kind: 'find', ask: 'Select the posterior cord.', answer: ['posterior_cord_of_brachial_plexus_r'], why: 'The single cord formed by all three posterior divisions.', src: ['HADZIC3'] },
  { kind: 'find', ask: 'Select the anterior scalene.', answer: ['scalenus_anterior_muscle_r'], why: 'The front wall of the interscalene groove.', src: ['NAG50'] },
  { kind: 'find', ask: 'Select the median nerve.', answer: ['median_nerve_r'], why: 'It follows the brachial artery down the middle of the arm.', src: ['NAG50'] },
  { kind: 'find', ask: 'Select the subclavian artery.', answer: ['right_subclavian_artery'], why: 'It crosses the first rib with the plexus above and behind it.', src: ['HADZIC3'] },
  { kind: 'find', ask: 'Select the suprascapular nerve.', answer: ['suprascapular_nerve_r'], why: 'It leaves the superior trunk and runs backward toward the scapula.', src: ['HADZIC3'] },
  { kind: 'apply', ask: 'An interscalene block is placed at the level of the cricoid. Select the trunk it is most likely to miss.', answer: ['inferior_trunk_of_brachial_plexus_r'], why: 'The inferior trunk (C8, T1) is lowest and furthest from the injection, which is why the ulnar side of the forearm and hand may be spared.', src: ['NAG50'] },
  { kind: 'apply', ask: 'After surgery the patient cannot flex the elbow well and the lateral forearm is numb. Select the nerve.', answer: ['musculocutaneous_nerve_r'], why: 'It supplies the elbow flexors and ends as the lateral cutaneous nerve of the forearm.', src: ['NAG50'] },
  { kind: 'apply', ask: 'A fracture of the surgical neck of the humerus. Select the nerve most at risk.', answer: ['axillary_nerve_r'], why: 'The axillary nerve winds around the surgical neck on its way to deltoid.', src: ['NAG50'] },
  { kind: 'apply', ask: 'A midshaft fracture of the humerus with wrist drop. Select the nerve.', answer: ['radial_nerve_r'], why: 'The radial nerve runs against the back of the humeral shaft and supplies the wrist extensors.', src: ['NAG50'] },
  { kind: 'apply', ask: 'A winged scapula after a procedure on the chest wall. Select the nerve.', answer: ['long_thoracic_nerve_r'], why: 'It supplies serratus anterior, which holds the scapula against the chest.', src: ['HADZIC3'] },
  { kind: 'apply', ask: 'Numb little finger after resting the elbow on a hard armboard. Select the nerve.', answer: ['ulnar_nerve_r'], why: 'The ulnar nerve is exposed behind the medial epicondyle.', src: ['NAG50'] },
  { kind: 'apply', ask: 'Select the muscle that separates the subclavian vein from the subclavian artery and the plexus.', answer: ['scalenus_anterior_muscle_r'], why: 'The vein passes in front of the anterior scalene; the artery and plexus pass behind it.', src: ['HADZIC3'] },
];
export const CHALLENGE_LENGTH = 8;

// PRACTICE QUESTIONS: original items written for this app in formats the NBCRNA lists (multiple choice, multiple
// correct response). They are NOT NBCRNA items and completing them predicts nothing about an exam score.
export const QUESTIONS = [
  { type: 'single', stem: 'A patient has an interscalene block for shoulder arthroscopy. Shoulder analgesia is excellent, but sensation to the medial forearm and little finger is intact. Which explanation is most likely?',
    options: ['The inferior trunk was not reached by local anesthetic', 'The superior trunk was not reached by local anesthetic', 'The musculocutaneous nerve leaves the plexus above the injection', 'The posterior cord was not reached by local anesthetic'], correct: [0],
    why: 'C8 and T1 form the inferior trunk, the lowest and furthest from an injection around the superior and middle trunks, so the ulnar distribution is the part most often spared.', src: ['NAG50', 'HADZIC3'] },
  { type: 'multi', stem: 'Which nerves arise from the posterior cord of the brachial plexus? Select all that apply.',
    options: ['Axillary', 'Radial', 'Musculocutaneous', 'Thoracodorsal', 'Ulnar'], correct: [0, 1, 3],
    why: 'The posterior cord gives the axillary and radial nerves, the upper and lower subscapular nerves and the thoracodorsal nerve. Musculocutaneous is from the lateral cord and ulnar from the medial cord.', src: ['HADZIC3', 'NETTER439'] },
  { type: 'single', stem: 'Thirty minutes after an interscalene block a patient with severe COPD becomes short of breath. Breath sounds are present on both sides. Which structure explains this most directly?',
    options: ['Phrenic nerve on the anterior scalene', 'Recurrent laryngeal nerve in the tracheo-esophageal groove', 'Long thoracic nerve on serratus anterior', 'Dome of the pleura behind the first rib'], correct: [0],
    why: 'The phrenic nerve descends on the front of the anterior scalene, next to the interscalene groove. Blocks above the clavicle commonly cause hemidiaphragmatic paresis, which matters when respiratory reserve is limited. Pneumothorax is possible with blocks near the pleura but breath sounds here are equal.', src: ['HADZIC_PH', 'NAG50'] },
];
