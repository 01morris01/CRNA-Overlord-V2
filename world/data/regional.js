// regional.js: "Four ways in". One focused regional-anesthesia sequence on the corrected plexus:
// a narrated 3D explanation, exploration, independent identification, a case where you choose an approach and say why,
// original practice questions, and later retrieval of what you missed.
//
// Every clinical statement here was read in context in Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50,
// pp. 1152-1156 (and Hadzic 2nd ed. ch. 3 p. 43 for the phrenic nerve's course). Wording is original.
// WHAT THIS IS NOT: it shows where each block is aimed and what lies near it. It does not teach how to perform a
// block. There is no needle, no ultrasound image and no dose guidance, because none of that can be validated here.
import { ID } from './plexus.js';

export const DISCLAIMER = 'This shows where each approach is aimed and what lies beside it. It does not show how to perform a block: no needle path, ultrasound image or dose here has been validated, so none is shown.';
// The four levels. `anchor` = structures whose centre marks the level on the model. `reach` etc. are shown in explore.
export const LEVELS = {
  interscalene: { name: 'Interscalene', anchor: ID.roots.slice(0, 3), view: 'groove', targets: 'the roots, between the anterior and middle scalenes, at the level of C6',
    usedFor: 'Surgery on the shoulder and the proximal upper arm.', misses: 'C8 and T1 (the lower trunk) are often spared, so it is not chosen for surgery below the elbow.',
    near: 'The phrenic nerve on the anterior scalene: the diaphragm on that side is often weakened. Also the stellate ganglion (Horner syndrome), the recurrent laryngeal nerve (hoarseness), the vertebral artery and the pleura.',
    show: [...ID.roots, ID.antScalene, ID.midScalene, ID.phrenic, ID.cricoid], src: ['N1152', 'N1153'] },
  supraclavicular: { name: 'Supraclavicular', anchor: [...ID.postDivs, ...ID.antDivs], view: 'supraclav', targets: 'the trunks and divisions, behind the clavicle and over the first rib, lateral to the subclavian artery',
    usedFor: 'A dense block for surgery on the arm, because the plexus is most compact here.', misses: 'The suprascapular nerve has usually left the superior trunk already, so it is not ideal for shoulder surgery.',
    near: 'The pleura, immediately below the first rib: pneumothorax is the greatest risk. The subclavian artery. Horner syndrome and a weak hemidiaphragm can also occur.',
    show: [...ID.trunks, ...ID.postDivs, ...ID.antDivs, ID.firstRib, ID.subclavianA, ID.clavicle, ID.suprascapular], src: ['N1153', 'N1155'] },
  infraclavicular: { name: 'Infraclavicular', anchor: [ID.LC, ID.MC, ID.PC], view: 'infraclav', targets: 'the three cords, below the clavicle and medial to the coracoid process, around the axillary artery',
    usedFor: 'Surgery on the elbow, forearm and hand.', misses: 'Nothing below the elbow in a complete block. It is not an approach for the shoulder.',
    near: 'The axillary artery and vein. It has to pass through pectoralis major and minor, so it is the most uncomfortable approach. The risk of blocking the phrenic nerve or the stellate ganglion is greatly reduced, which is why it suits a patient with severe respiratory compromise.',
    show: [ID.LC, ID.MC, ID.PC, ID.axillaryA, ID.pecMinor, ID.clavicle], src: ['N1155', 'N1156'] },
  axillary: { name: 'Axillary', anchor: [ID.median, ID.ulnar, ID.radial], anchorAt: 'top', view: 'axilla', targets: 'the terminal nerves as they travel with the axillary artery in the upper arm',
    usedFor: 'Surgery distal to the elbow.', misses: 'The musculocutaneous nerve lies outside the sheath, within coracobrachialis, and needs its own injection.',
    near: 'The axillary artery and vein, which the nerves surround.', show: [ID.median, ID.ulnar, ID.radial, ID.mcn, ID.axillaryA, ID.coracobrachialis], src: ['N1156'] },
};
export const LEVEL_ORDER = ['interscalene', 'supraclavicular', 'infraclavicular', 'axillary'];

// THE NARRATED EXPLANATION. Captions are also spoken when the browser has a voice. About 75 seconds.
export const NARRATION = [
  { say: 'Local anesthetic can be placed at four levels of the brachial plexus. Each level reaches a different part of it, and has different neighbours.', view: 'whole', glow: [], ms: 7500, src: ['N1152'] },
  { level: 'interscalene', say: 'Highest is the interscalene groove. The roots pass between the anterior and middle scalenes here, level with the cricoid cartilage and C6. It is used for the shoulder and upper arm.', ms: 11000, src: ['N1152'] },
  { level: 'interscalene', say: 'Two things to remember. The lower trunk, C8 and T1, is often spared. And the phrenic nerve lies on the anterior scalene right beside it, so the diaphragm on that side is often weakened.', glow: [ID.trunks[2], ID.phrenic], ms: 12000, src: ['N1152', 'N1153'] },
  { level: 'supraclavicular', say: 'Behind the clavicle, over the first rib, the trunks and divisions are packed closely together beside the subclavian artery. A block here is dense for the arm. The pleura is just below the rib.', ms: 12000, src: ['N1153', 'N1155'] },
  { level: 'infraclavicular', say: 'Below the clavicle, the three cords surround the axillary artery. This level is used for the elbow, forearm and hand, and it is far from the phrenic nerve.', ms: 10500, src: ['N1155'] },
  { level: 'axillary', say: 'In the axilla the terminal nerves travel with the artery. It covers the arm below the elbow. The musculocutaneous nerve has already left, inside coracobrachialis, and needs its own injection.', glow: [ID.mcn, ID.coracobrachialis], ms: 12000, src: ['N1156'] },
  { say: 'That is where each approach is aimed. How to perform one is not shown here.', view: 'whole', glow: [], ms: 5500, src: [] },
];

// INDEPENDENT IDENTIFICATION. No labels, no highlights, no level markers.
const A = (ask, answer, why, src, outline = 'III.I.5') => ({ kind: 'apply', ask, answer: [].concat(answer), why, src, outline });
export const IDENTIFY = [
  A('An interscalene block often spares one trunk. Select it.', ID.trunks[2], 'C8 and T1, the lower trunk, are often spared, which is why this block is not used for surgery below the elbow.', ['N1152']),
  A('After an interscalene block the patient is short of breath. Select the nerve most likely responsible.', ID.phrenic, 'The phrenic nerve lies on the anterior scalene close to the injection, and blocking it weakens the diaphragm on that side.', ['N1153', 'H43']),
  A('A supraclavicular block is not ideal for shoulder surgery because one nerve is often missed. Select it.', ID.suprascapular, 'The suprascapular nerve arises from the proximal superior trunk, above the level of a supraclavicular block.', ['N1153']),
  A('An in-plane interscalene block passes through the middle scalene. Select a nerve that can be injured inside that muscle.', [ID.dorsalScapular, ID.longThoracic], 'The dorsal scapular and long thoracic nerves often pass through the middle scalene.', ['N1153']),
  A('During an axillary block one nerve lies outside the sheath and needs its own injection. Select it.', ID.mcn, 'The musculocutaneous nerve lies within coracobrachialis, outside the sheath around the artery.', ['N1156']),
  A('Select the landmark used to find the C6 level for an interscalene block.', ID.cricoid, 'A line drawn laterally from the cricoid cartilage gives the C6 level.', ['N1152']),
  A('Select the cord an infraclavicular block aims to reach behind the artery.', ID.PC, 'The aim is to reach behind the axillary artery, which is where the posterior cord lies.', ['N1155']),
  A('Select the bone that separates the plexus from the pleura during a supraclavicular block.', ID.firstRib, 'The plexus lies above the first rib and the pleura immediately below it.', ['N1155']),
];
export const IDENTIFY_LENGTH = 5;

// THE CASE. Choose the level on the model, then choose the statements that support the choice, then say why.
// `grade`: best = the approach the source singles out; ok = also defensible from the source; no = contradicted by it.
export const CASES = [
  { id: 'copd-radius', title: 'Distal radius fracture, severe COPD', outline: 'III.I.5',
    stem: 'A 67-year-old with severe COPD on home oxygen needs fixation of a distal radius fracture. A regional technique is planned as the main anesthetic.',
    grade: { interscalene: ['no', 'The surgery is below the elbow, where C8 and T1 are often spared, and this approach commonly weakens the diaphragm, which this patient cannot afford.'],
      supraclavicular: ['no', 'It would cover the forearm, but a weak hemidiaphragm can occur with this approach too, and this patient has no reserve. The pleura is also immediately below the first rib.'],
      infraclavicular: ['best', 'It covers the elbow, forearm and hand, and the risk of blocking the phrenic nerve is greatly reduced, which is exactly why it is preferred in severe respiratory compromise.'],
      axillary: ['ok', 'It covers the arm below the elbow and is far from the phrenic nerve. The source singles out the infraclavicular approach for patients like this, and the musculocutaneous nerve would need its own injection.'] },
    reasons: [['The operation is below the elbow.', true, 'True, and it is what rules out an approach that spares C8 and T1.'], ['Approaches above the clavicle can weaken the diaphragm on that side.', true, 'True for both the interscalene and supraclavicular approaches.'],
      ['An interscalene block reliably numbs the forearm and hand.', false, 'False. C8 and T1 are often spared at that level.'], ['Below the clavicle the phrenic nerve is unlikely to be blocked.', true, 'True, and it is the main reason for this choice.'],
      ['Pneumothorax cannot happen with a brachial plexus block.', false, 'False. The pleura lies immediately below the first rib.']],
    model: 'Infraclavicular: it covers below the elbow and stays away from the phrenic nerve, which matters most in a patient with no respiratory reserve.', src: ['N1152', 'N1153', 'N1155', 'N1156'] },
  { id: 'cuff-repair', title: 'Arthroscopic rotator cuff repair', outline: 'III.I.5',
    stem: 'A healthy 34-year-old is having an arthroscopic rotator cuff repair and wants the best pain control afterwards.',
    grade: { interscalene: ['best', 'This is the approach for the shoulder and proximal upper arm. The shoulder is supplied mainly by C5 and C6, which are blocked here. A weak hemidiaphragm is expected but rarely matters with healthy lungs.'],
      supraclavicular: ['no', 'The suprascapular nerve, which arises from the proximal superior trunk, is often missed at this level, so the shoulder may not be covered.'],
      infraclavicular: ['no', 'This level is for the elbow, forearm and hand. It is below everything that supplies the shoulder.'], axillary: ['no', 'This covers the arm distal to the elbow, not the shoulder.'] },
    reasons: [['The shoulder is supplied mainly by C5 and C6.', true, 'True, and those roots are what this level blocks.'], ['A lower approach can miss the suprascapular nerve.', true, 'True. It leaves the superior trunk early.'],
      ['The ulnar side of the hand will be reliably numb.', false, 'False. C8 and T1 are often spared here, which does not matter for the shoulder.'], ['In a patient with healthy lungs a weak hemidiaphragm rarely causes trouble.', true, 'True, and it is why the phrenic nerve does not rule this out here.'],
      ['It is chosen because it avoids the phrenic nerve.', false, 'False. This is the approach most likely to block it.']],
    model: 'Interscalene: it blocks C5 and C6, which supply the shoulder, and a lower approach can miss the suprascapular nerve. The phrenic block that comes with it is tolerated with healthy lungs.', src: ['N1152', 'N1153', 'N1155', 'N1156'] },
];

// PRACTICE QUESTIONS. Original items written for Overlord in formats NBCRNA lists (multiple choice, multiple correct
// response, and a matching item in the style of drag and drop). They are not NBCRNA items and predict nothing.
export const QUESTIONS = [
  { type: 'single', outline: 'III.I.5', stem: 'After an interscalene block a patient has a drooping eyelid, a small pupil and a dry face on the same side. Which structure was blocked?',
    options: ['Stellate (cervicothoracic) ganglion', 'Phrenic nerve', 'Recurrent laryngeal nerve', 'Suprascapular nerve'], correct: [0], why: 'Ptosis, miosis and anhidrosis are Horner syndrome, from block of the stellate ganglion. A phrenic block weakens the diaphragm; a recurrent laryngeal block causes hoarseness.', src: ['N1153'] },
  { type: 'multi', outline: 'III.I.5', stem: 'Which of these are recognised consequences or risks of an interscalene block? Select all that apply.',
    options: ['Weakness of the diaphragm on the same side', 'Horner syndrome', 'Hoarseness', 'Reliable anesthesia of the little finger', 'Pneumothorax'], correct: [0, 1, 2, 4], why: 'Phrenic block, stellate ganglion block, recurrent laryngeal block and pneumothorax are all described. The little finger is C8 and T1 territory, which this block often spares.', src: ['N1152', 'N1153'] },
  { type: 'match', outline: 'III.I.5', stem: 'Match each approach to the part of the plexus it targets.', left: ['Interscalene', 'Supraclavicular', 'Infraclavicular', 'Axillary'], right: ['Roots', 'Trunks and divisions', 'Cords', 'Terminal branches'], correct: [0, 1, 2, 3],
    why: 'From the neck to the arm the approaches meet the plexus in the order it is built: roots, then trunks and divisions, then cords, then terminal branches.', src: ['N1152', 'N1153', 'N1155', 'N1156'] },
  { type: 'single', outline: 'III.I.5', stem: 'Why is a supraclavicular block considered less than ideal for shoulder surgery?',
    options: ['The suprascapular nerve is often missed', 'The radial nerve is often missed', 'It cannot be done with ultrasound', 'It never reaches the superior trunk'], correct: [0], why: 'The suprascapular nerve arises from the proximal superior trunk, above the level of the block, so it is often missed.', src: ['N1153'] },
  { type: 'single', outline: 'III.I.7', stem: 'During an infraclavicular block with a nerve stimulator, the little finger extends. Which cord is being stimulated?',
    options: ['Posterior cord', 'Medial cord', 'Lateral cord', 'None; this is the musculocutaneous nerve'], correct: [0], why: 'Posterior cord: the little finger extends. Medial cord: it flexes. Lateral cord: it moves laterally. Elbow flexion is the musculocutaneous nerve.', src: ['N1155'] },
];
export const QUESTIONS_LENGTH = 4;
