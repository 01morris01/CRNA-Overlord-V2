// plexus.js: what Anatomy Hall knows about the brachial plexus, and where each statement was checked.
//
// RULES FOR THIS FILE
// 1. Every statement shown to a learner carries page-level sources. A source key here means the statement was READ IN
//    CONTEXT on that page (2026-11-10, by Claude, from the learner's own copies). Nothing is cited from a chapter
//    range, and nothing is copied: the wording is original.
// 2. A statement that could not be found in context is not in this file. See docs/overlord-world/CONTENT-VERIFICATION.md
//    for the ones that were removed.
// 3. A relationship is only scored if (a) its statement is verified as above AND (b) tools/audit_plexus.py confirms the
//    model shows it. Both lists are in the docs.
// 4. Structures the source model lacked were built for Overlord, and curves it attached wrongly were corrected
//    (tools/plexus_corrections_plan.py). The model file tags each one, and the app shows that tag to the learner.
// 5. Checked by AI. Not reviewed by an anatomist or faculty. The app says so.

export const SOURCES = {
  ZA: { kind: 'model', cite: 'Model: Overlord corrected plexus (CC BY-SA 4.0), derived from Z-Anatomy, the libre 3D atlas of anatomy (CC BY-SA 4.0), itself from BodyParts3D, The Database Center for Life Science (CC BY-SA 2.1 Japan).' },
  H43: { kind: 'textbook', cite: "Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 43" },
  H44: { kind: 'textbook', cite: "Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 44" },
  H46: { kind: 'textbook', cite: "Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 46" },
  H47: { kind: 'textbook', cite: "Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 47 (table)" },
  H48: { kind: 'textbook', cite: "Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 48" },
  H49: { kind: 'textbook', cite: "Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 49" },
  H50: { kind: 'textbook', cite: "Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 50" },
  H52: { kind: 'textbook', cite: "Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, pp. 51-52" },
  N1149: { kind: 'textbook', cite: 'Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, p. 1149' },
  N1150: { kind: 'textbook', cite: 'Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, p. 1150' },
  N1152: { kind: 'textbook', cite: 'Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, p. 1152' },
  N1153: { kind: 'textbook', cite: 'Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, p. 1153' },
  N1155: { kind: 'textbook', cite: 'Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, pp. 1154-1155' },
  N1156: { kind: 'textbook', cite: 'Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, p. 1156' },
  NETTER: { kind: 'reading', cite: 'Further reading, not used to check any statement here: Netter Atlas of Human Anatomy, Classic Regional Approach, 8th ed., Plate 439.' },
};
export const OUTLINE = { 'III.I.1': 'Regional: anatomy', 'III.I.5': 'Regional: peripheral blocks', 'III.I.7': 'Regional: ultrasound and nerve stimulator concepts' };   // NBCRNA 2025/2026 outline codes
export const CHECK_STATUS = 'Each statement was read in context on the cited page and the model was checked by a geometric audit. All of this was done by AI. No anatomist or faculty member has reviewed it.';
export const MODEL_NOTE = 'The source model had no roots, lateral cord, medial cord or phrenic nerve, and attached several nerves to the wrong cord. Those were built or corrected for Overlord from the two textbooks and are marked on each structure. Not modelled: the phrenic nerve above and below the neck, C3 and C4, and the intercostobrachial nerve.';

const BP = (s) => s + '_of_brachial_plexus_r';
const ROOT = (r) => BP(r + '_root'), DIV = (a, t) => BP(`${a}_division_of_${t}_trunk`);
export const ID = {
  roots: ['c5', 'c6', 'c7', 'c8', 't1'].map(ROOT), trunks: [BP('superior_trunk'), BP('middle_trunk'), BP('inferior_trunk')],
  postDivs: ['superior', 'middle', 'inferior'].map((t) => DIV('posterior', t)), antDivs: ['superior', 'middle', 'inferior'].map((t) => DIV('anterior', t)),
  LC: BP('lateral_cord'), MC: BP('medial_cord'), PC: BP('posterior_cord'),
  mcn: 'musculocutaneous_nerve_r', axillary: 'axillary_nerve_r', radial: 'radial_nerve_r', median: 'median_nerve_r', ulnar: 'ulnar_nerve_r',
  suprascapular: 'suprascapular_nerve_r', longThoracic: 'long_thoracic_nerve_r', dorsalScapular: 'dorsal_scapular_nerve_r', phrenic: 'phrenic_nerve_r',
  antScalene: 'scalenus_anterior_muscle_r', midScalene: 'scalenus_medius_muscle_r', scm: 'sternocleidomastoid_muscle_r',
  subclavianA: 'right_subclavian_artery', axillaryA: 'axillary_artery_r', firstRib: 'first_rib_r', clavicle: 'clavicle_r', cricoid: 'cricoid_cartilage', coracobrachialis: 'coracobrachialis_muscle_r', pecMinor: 'pectoralis_minor_muscle_r',
};
const [C5, C6, C7, C8, T1] = ID.roots, [ST, MT, IT] = ID.trunks;

// name: shown when names are allowed. fact: what may be said. tell: how to tell it from its neighbours (used to explain a mistake).
export const STRUCTURES = {
  [C5]: { name: 'C5 root', fact: 'Passes between the anterior and middle scalenes and joins C6 to form the superior trunk.', tell: 'A root is still inside the interval between the scalenes, medial to the trunks.', src: ['N1149', 'H44'] },
  [C6]: { name: 'C6 root', fact: 'Passes between the anterior and middle scalenes and joins C5 to form the superior trunk.', tell: 'A root is still inside the interval between the scalenes, medial to the trunks.', src: ['N1149', 'H44'] },
  [C7]: { name: 'C7 root', fact: 'Passes between the scalenes and continues alone as the middle trunk.', tell: 'A root is still inside the interval between the scalenes, medial to the trunks.', src: ['N1149', 'H44'] },
  [C8]: { name: 'C8 root', fact: 'Passes between the scalenes and joins T1 to form the inferior trunk.', tell: 'A root is still inside the interval between the scalenes, medial to the trunks.', src: ['N1149', 'H44'] },
  [T1]: { name: 'T1 root', fact: 'Joins C8 to form the inferior trunk.', tell: 'The lowest root.', src: ['H44'] },
  [ST]: { name: 'Superior trunk', fact: 'Formed by C5 and C6 at the lateral border of the scalenes. The suprascapular nerve arises from it.', tell: 'The highest of the three trunks.', src: ['H44', 'N1149', 'H48'] },
  [MT]: { name: 'Middle trunk', fact: 'The continuation of C7 alone.', tell: 'The trunk between the other two, fed by a single root.', src: ['H44'] },
  [IT]: { name: 'Inferior trunk', fact: 'Formed by C8 and T1. An interscalene block often spares it.', tell: 'The lowest of the three trunks.', src: ['H44', 'N1152'] },
  [ID.postDivs[0]]: { name: 'Posterior division of the superior trunk', group: 'division', fact: 'Joins the other two posterior divisions to form the posterior cord.', tell: 'A division is the short segment between a trunk and a cord, behind the clavicle.', src: ['H44'] },
  [ID.postDivs[1]]: { name: 'Posterior division of the middle trunk', group: 'division', fact: 'Joins the other two posterior divisions to form the posterior cord.', tell: 'A division is the short segment between a trunk and a cord, behind the clavicle.', src: ['H44'] },
  [ID.postDivs[2]]: { name: 'Posterior division of the inferior trunk', group: 'division', fact: 'Joins the other two posterior divisions to form the posterior cord.', tell: 'A division is the short segment between a trunk and a cord, behind the clavicle.', src: ['H44'] },
  [ID.antDivs[0]]: { name: 'Anterior division of the superior trunk', group: 'division', fact: 'Joins the anterior division of the middle trunk to form the lateral cord.', tell: 'An anterior division runs to the lateral or medial cord, never the posterior one.', src: ['H44'] },
  [ID.antDivs[1]]: { name: 'Anterior division of the middle trunk', group: 'division', fact: 'Joins the anterior division of the superior trunk to form the lateral cord.', tell: 'An anterior division runs to the lateral or medial cord, never the posterior one.', src: ['H44'] },
  [ID.antDivs[2]]: { name: 'Anterior division of the inferior trunk', group: 'division', fact: 'Continues as the medial cord.', tell: 'An anterior division runs to the lateral or medial cord, never the posterior one.', src: ['H44'] },
  [ID.LC]: { name: 'Lateral cord', fact: 'Formed by the anterior divisions of the superior and middle trunks. Lies superior and lateral to the axillary artery. Continues as the musculocutaneous nerve and sends a branch to the median nerve.', tell: 'The cord above and to the outside of the axillary artery.', src: ['H44', 'N1155', 'N1149'] },
  [ID.MC]: { name: 'Medial cord', fact: 'The continuation of the anterior division of the inferior trunk. Lies posterior and medial to the axillary artery. Continues as the ulnar nerve and sends a branch to the median nerve.', tell: 'The cord behind and to the inside of the axillary artery.', src: ['H44', 'N1155', 'N1149'] },
  [ID.PC]: { name: 'Posterior cord', fact: 'Formed by all three posterior divisions. Lies behind the axillary artery. Gives the subscapular nerves, the thoracodorsal nerve, the axillary nerve and the radial nerve.', tell: 'The cord directly behind the axillary artery.', src: ['H44', 'N1155', 'H48'] },
  [ID.mcn]: { name: 'Musculocutaneous nerve', fact: 'C5 to C7. The continuation of the lateral cord. Pierces coracobrachialis, descends between biceps and brachialis, and ends as the lateral cutaneous nerve of the forearm.', tell: 'The nerve that dives into coracobrachialis and runs under biceps.', src: ['H50', 'N1149', 'N1150'] },
  [ID.axillary]: { name: 'Axillary nerve', fact: 'C5 and C6, from the posterior cord. Passes behind the surgical neck of the humerus to supply deltoid; also supplies teres minor.', tell: 'The short nerve that turns backward around the top of the humerus.', src: ['H49', 'N1149'] },
  [ID.radial]: { name: 'Radial nerve', fact: 'C5 to T1, from the posterior cord. Descends along the shaft of the humerus in the spiral groove.', tell: 'The nerve that runs down the back of the humeral shaft.', src: ['H49', 'N1149'] },
  [ID.median]: { name: 'Median nerve', fact: 'Formed where a branch from the lateral cord meets a branch from the medial cord. Descends the arm with the brachial artery.', tell: 'The nerve formed from two roots that stays beside the brachial artery.', src: ['H50', 'N1149'] },
  [ID.ulnar]: { name: 'Ulnar nerve', fact: 'C8 and T1, from the medial cord. Crosses the elbow behind the medial epicondyle.', tell: 'The nerve that passes behind the inner side of the elbow.', src: ['H52', 'N1149'] },
  lateral_root_of_median_nerve_r: { name: 'Lateral root of the median nerve', group: 'division', fact: 'The branch from the lateral cord to the median nerve.', src: ['H50'] },
  medial_root_of_median_nerve_r: { name: 'Medial root of the median nerve', group: 'division', fact: 'The branch from the medial cord to the median nerve.', src: ['H50'] },
  [ID.suprascapular]: { name: 'Suprascapular nerve', fact: 'Arises from the superior trunk. Supplies infraspinatus and the back of the shoulder joint.', tell: 'The nerve that leaves the superior trunk early and runs backward to the scapula.', src: ['H48'] },
  [ID.longThoracic]: { name: 'Long thoracic nerve', fact: 'From the C5 to C7 rami. Descends on the front of the middle scalene to the first rib, then on serratus anterior, which it supplies.', tell: 'The long nerve that runs straight down the chest wall on serratus anterior.', src: ['H46', 'H48'] },
  [ID.dorsalScapular]: { name: 'Dorsal scapular nerve', fact: 'From the C5 ramus. Follows levator scapulae to the scapula and supplies it and the rhomboids. It often passes through the middle scalene.', tell: 'The nerve that runs backward toward levator scapulae.', src: ['H46', 'N1153'] },
  [ID.phrenic]: { name: 'Phrenic nerve', fact: 'Formed from C3 to C5. Descends through the neck on the front of the anterior scalene. Only that part is modelled here.', tell: 'The single nerve lying on the front of the anterior scalene.', src: ['H43'] },
  [ID.antScalene]: { name: 'Anterior scalene', fact: 'The front wall of the interscalene groove. The phrenic nerve runs down its front surface.', tell: 'The scalene in front of the roots.', src: ['N1149', 'H43'] },
  [ID.midScalene]: { name: 'Middle scalene', fact: 'The back wall of the interscalene groove. The long thoracic nerve descends on its front surface, and the dorsal scapular and long thoracic nerves often pass through it.', tell: 'The scalene behind the roots.', src: ['N1149', 'H46', 'N1153'] },
  [ID.scm]: { name: 'Sternocleidomastoid', fact: 'Lies in front of the scalenes. The interscalene groove is found by moving a finger laterally from behind its clavicular head, across the anterior scalene.', tell: 'The long strap from the sternum and clavicle up to the skull.', src: ['N1152'] },
  [ID.subclavianA]: { name: 'Subclavian artery', fact: 'At the first rib the trunks and divisions lie lateral to it.', tell: 'The large artery arching over the first rib.', src: ['N1153'] },
  [ID.axillaryA]: { name: 'Axillary artery', fact: 'The cords are named for where they lie around it: lateral, posterior and medial.', tell: 'The artery the three cords surround, below the clavicle.', src: ['N1149', 'N1155'] },
  [ID.firstRib]: { name: 'First rib', fact: 'The trunks and divisions pass over it, and the trunks divide at its lateral border. The pleura lies immediately below it.', tell: 'The short, flat, highest rib.', src: ['N1149', 'N1153', 'N1155'] },
  [ID.clavicle]: { name: 'Clavicle', fact: 'Roots, trunks and divisions lie above it; cords and terminal branches lie below it. The trunks divide behind it.', tell: 'The collar bone.', src: ['N1149'] },
  [ID.cricoid]: { name: 'Cricoid cartilage', fact: 'A line drawn laterally from it gives the C6 level.', tell: 'The ring of cartilage below the thyroid cartilage.', src: ['N1152'] },
  [ID.coracobrachialis]: { name: 'Coracobrachialis', fact: 'The musculocutaneous nerve pierces it. In the axilla that nerve lies within it, outside the sheath around the artery.', tell: 'The slim muscle on the inner side of the upper arm.', src: ['H50', 'N1156'] },
  [ID.pecMinor]: { name: 'Pectoralis minor', fact: 'An infraclavicular block has to pass through pectoralis major and this muscle.', tell: 'The small chest muscle over the cords.', src: ['N1156'] },
  thoracodorsal_nerve_r: { name: 'Thoracodorsal nerve', group: 'context', fact: 'From the posterior cord, to latissimus dorsi.', src: ['H48', 'H49'] },
  superior_subscapular_nerve_r: { name: 'Upper subscapular nerve', group: 'context', fact: 'The first nerve to arise from the posterior cord.', src: ['H49'] },
  inferior_subscapular_nerve_r: { name: 'Lower subscapular nerve', group: 'context', fact: 'From the posterior cord, to subscapularis and teres major.', src: ['H49'] },
  lateral_antebrachial_cutaneous_nerve_r: { name: 'Lateral cutaneous nerve of the forearm', group: 'context', fact: 'The end of the musculocutaneous nerve.', src: ['N1150'] },
};
export const HIDE = ['vertebra_t10', 'vertebra_t11', 'vertebra_t12'];
export const LAYERS = [['bone', 'Bones'], ['muscle', 'Muscles'], ['artery', 'Arteries'], ['vein', 'Veins'], ['nerve', 'Nerves'], ['airway', 'Airway']];
// What the stimulation layer (earned by a later, delayed review) reports. Only responses stated in the sources are listed.
export const STIM = {
  [ID.mcn]: { says: 'Elbow flexion.', src: ['N1155'] }, [ID.LC]: { says: 'The little finger moves laterally.', src: ['N1155'] },
  [ID.MC]: { says: 'The little finger flexes.', src: ['N1155'] }, [ID.PC]: { says: 'The little finger extends.', src: ['N1155'] },
};

// THE LESSON. Six steps. Each ends with something you do to the model.
export const LESSON = [
  { title: 'Start with what covers it.', say: 'The sternocleidomastoid lies in front of the scalenes. Clinically the groove between the scalenes is found by sliding a finger sideways from behind this muscle, across the anterior scalene.', view: 'anterolateral', glow: [ID.scm], do: 'Click the sternocleidomastoid to lift it away.', until: { hide: ID.scm }, src: ['N1152'] },
  { title: 'Five roots, one interval.', say: 'The plexus begins as five roots, C5 to T1. They pass between the anterior and middle scalene muscles.', view: 'groove', glow: [ID.antScalene, ID.midScalene], hide: [ID.scm, 'omohyoid_muscle_r'], do: 'Click any root in the interval between the two scalenes.', until: { pick: ID.roots }, src: ['N1149'] },
  { title: 'Three trunks.', say: 'At the lateral border of the scalenes the roots converge. C5 and C6 form the superior trunk. C7 continues alone as the middle trunk. C8 and T1 form the inferior trunk.', view: 'groove', glow: ID.trunks, label: ID.trunks, ghost: ['muscle'], do: 'Click the three trunks from highest to lowest.', until: { order: ID.trunks }, src: ['H44', 'N1149'] },
  { title: 'Every trunk divides.', say: 'Behind the clavicle, at the lateral border of the first rib, each trunk splits into an anterior and a posterior division. All three posterior divisions run to the same place.', view: 'cords', glow: ID.postDivs, ghost: ['muscle'], do: 'Click all three posterior divisions.', until: { all: ID.postDivs }, src: ['N1149', 'H44'] },
  { title: 'Three cords around an artery.', say: 'The posterior divisions form the posterior cord. The anterior divisions of the superior and middle trunks form the lateral cord. The anterior division of the inferior trunk becomes the medial cord. Each is named for where it lies beside the axillary artery.', view: 'cords', glow: [ID.LC, ID.MC, ID.PC, ID.axillaryA], label: [ID.LC, ID.MC, ID.PC], ghost: ['muscle'], do: 'Click the cord that lies behind the artery.', until: { pick: [ID.PC] }, src: ['H44', 'N1155'] },
  { title: 'Five nerves leave for the arm.', say: 'The musculocutaneous nerve is the continuation of the lateral cord. The ulnar nerve continues from the medial cord. The median nerve takes a branch from each. The axillary and radial nerves come from the posterior cord.', view: 'arm', glow: [ID.mcn, ID.axillary, ID.radial, ID.median, ID.ulnar], label: [ID.mcn, ID.axillary, ID.radial, ID.median, ID.ulnar], ghost: ['muscle'], do: 'Click the two nerves that come from the posterior cord.', until: { all: [ID.axillary, ID.radial] }, src: ['N1149', 'H50'] },
];

// THE FILM. A 76-second authored 3D lesson built around one question, with captions, replay and scrubbing. Every cue is a
// statement already verified above (same page-level sources); the conclusion only chains them. The picture at time t is a
// pure function of t, so the same scene serves the interactive lesson and a frame-exact capture (window.renderAt).
// view = camera; hide / ghost / glow / label = what the model shows; predict = the film stops for an unscored prediction.
const LIFT = [ID.scm, 'omohyoid_muscle_r'];
export const FILM = { title: 'Follow the lowest trunk', seconds: 76, cues: [
  { t: 0, view: 'whole', say: 'A block placed between the scalene muscles often spares the lowest part of the plexus. Which nerve does that leave working? Follow one trunk and you can answer it.', src: ['N1152'] },
  { t: 9, view: 'groove', hide: LIFT, glow: [ID.antScalene, ID.midScalene], label: ID.roots, say: 'The right side of the neck, from the front. Five roots, C5 to T1, pass between the anterior and middle scalene muscles.', src: ['N1149'] },
  { t: 18.5, view: 'groove', hide: LIFT, ghost: ['muscle'], glow: ID.trunks, label: ID.trunks, say: 'At the edge of the scalenes they become three trunks. C5 and C6 form the superior trunk. C7 continues alone as the middle. C8 and T1 form the inferior trunk, the lowest.', src: ['H44', 'N1149'] },
  { t: 29.5, view: 'cords', hide: LIFT, ghost: ['muscle'], glow: [...ID.postDivs, ID.PC], label: [ID.PC], say: 'Behind the clavicle each trunk splits into an anterior and a posterior division. All three posterior divisions join to form one cord.', src: ['N1149', 'H44'] },
  { t: 39, view: 'cords', hide: LIFT, ghost: ['muscle'], glow: [ID.antDivs[2]], label: [ID.antDivs[2]], say: 'The anterior division of the inferior trunk continues on its own. Before you see it: which cord does it become?', predict: { options: ['Lateral cord', 'Posterior cord', 'Medial cord'], answer: 2 }, src: ['H44'] },
  { t: 46.5, view: 'infraclav', hide: LIFT, ghost: ['muscle'], glow: [ID.MC, ID.axillaryA], label: [ID.LC, ID.PC, ID.MC], say: 'The medial cord. It lies behind and to the inside of the axillary artery. All three cords are named for where they lie around that artery.', src: ['H44', 'N1155', 'N1149'] },
  { t: 56.5, view: 'arm', hide: LIFT, ghost: ['muscle'], glow: [ID.MC, ID.ulnar], label: [ID.ulnar], say: 'The medial cord continues as the ulnar nerve, C8 and T1. It crosses the elbow behind the medial epicondyle.', src: ['N1149', 'H52'] },
  { t: 65.5, view: 'arm', hide: LIFT, ghost: ['muscle'], glow: [ID.trunks[2], ID.antDivs[2], ID.MC, ID.ulnar], label: [ID.trunks[2], ID.ulnar], say: 'So a block that spares the inferior trunk spares C8 and T1, the fibres that reach the ulnar nerve. That is why it is not chosen for surgery below the elbow.', src: ['N1152', 'H52'] },
] };

// THE CHALLENGE. Nothing is labelled or highlighted. kind: find = name it; relation = work it out from a relationship.
// Every item's statement is page-verified and its geometry passes the audit. outline = NBCRNA outline code.
const F = (ask, answer, why, src) => ({ kind: 'find', ask, answer: [].concat(answer), why, src, outline: 'III.I.1' });
const R = (ask, answer, why, src) => ({ kind: 'relation', ask, answer: [].concat(answer), why, src, outline: 'III.I.1' });
export const CHALLENGE = [
  F('Select the superior trunk.', ST, 'The highest trunk, formed by C5 and C6.', ['H44']),
  F('Select the inferior trunk.', IT, 'The lowest trunk, formed by C8 and T1.', ['H44']),
  F('Select the posterior cord.', ID.PC, 'The cord behind the axillary artery, formed by all three posterior divisions.', ['H44', 'N1155']),
  F('Select the lateral cord.', ID.LC, 'The cord superior and lateral to the axillary artery.', ['N1155']),
  F('Select the medial cord.', ID.MC, 'The cord posterior and medial to the axillary artery.', ['N1155']),
  F('Select the phrenic nerve.', ID.phrenic, 'It lies on the front of the anterior scalene.', ['H43']),
  F('Select the anterior scalene.', ID.antScalene, 'The scalene in front of the roots.', ['N1149']),
  F('Select the suprascapular nerve.', ID.suprascapular, 'It leaves the superior trunk and runs back toward the scapula.', ['H48']),
  R('Select a root that helps form the superior trunk.', [C5, C6], 'C5 and C6 join to form the superior trunk.', ['H44']),
  R('Select the trunk that is the continuation of a single root.', MT, 'The middle trunk is C7 alone. The other two are each formed by two roots.', ['H44']),
  R('Select a division that joins the posterior cord.', ID.postDivs, 'All three posterior divisions join to form the posterior cord. Anterior divisions never do.', ['H44']),
  R('Select the nerve that is the continuation of the lateral cord.', ID.mcn, 'The musculocutaneous nerve continues from the lateral cord.', ['N1149']),
  R('Select the nerve that pierces coracobrachialis.', ID.mcn, 'The musculocutaneous nerve pierces coracobrachialis, then runs between biceps and brachialis.', ['H50']),
  R('Select the nerve that passes behind the surgical neck of the humerus.', ID.axillary, 'The axillary nerve passes behind the surgical neck on its way to deltoid.', ['H49']),
  R('Select the nerve that runs in the spiral groove of the humerus.', ID.radial, 'The radial nerve descends along the humeral shaft in the spiral groove.', ['H49']),
  R('Select the nerve that crosses the elbow behind the medial epicondyle.', ID.ulnar, 'The ulnar nerve crosses the elbow behind the medial epicondyle.', ['H52']),
  R('Select the nerve formed by branches from two cords.', ID.median, 'The median nerve is formed where a branch from the lateral cord meets a branch from the medial cord.', ['H50', 'N1149']),
  R('Select the muscle on whose front surface the phrenic nerve descends.', ID.antScalene, 'The phrenic nerve descends through the neck on the front of the anterior scalene.', ['H43']),
  R('Select the nerve that descends on the middle scalene and then on serratus anterior.', ID.longThoracic, 'The long thoracic nerve runs down the front of the middle scalene to the first rib, then onto serratus anterior.', ['H46', 'H48']),
  R('Select the cord that gives the axillary and radial nerves.', ID.PC, 'Both arise from the posterior cord.', ['N1149', 'H48']),
];
export const CHALLENGE_LENGTH = 8;
export const VIEWS_FOR_CHALLENGE = ['whole', 'anterolateral', 'lateral', 'anterior', 'posterior', 'superior'];

// Short page-verified statements, kept for reuse (they were field notes on the first island).
export const FIELD_NOTES = {
  dock: { text: 'C5 and C6 form the superior trunk. C7 continues alone as the middle trunk. C8 and T1 form the inferior trunk.', src: ['H44'] },
  east: { text: 'The cords are named for where they lie around the axillary artery: lateral, posterior and medial.', src: ['N1155'] },
  west: { text: 'All three posterior divisions join to form the posterior cord. The axillary and radial nerves come from it.', src: ['H44', 'N1149'] },
  hill: { text: 'The phrenic nerve runs down the front of the anterior scalene, right beside the interscalene groove.', src: ['H43', 'N1153'] },
};
