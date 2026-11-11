// collection.js: what a learner can come to hold. For every one, five plain answers: what it is, why this work earned it,
// what you can do with it, what is kept, and why you would come back. Nothing here improves a simulated patient or stands
// for clinical competence; an item is a thing to use and a record of something you demonstrated on a model.
import { CASES } from '../data/regional.js';

export const ITEMS = {
  'plexus-specimen': { name: 'Brachial plexus specimen', where: 'On your studio shelf',
    what: 'A one-third scale cast of the gallery\'s right brachial plexus: bones, vessels and every nerve of the model.',
    why: 'You identified its structures without labels, from views and dressings you had not been shown, at three in four or better, unaided.',
    use: 'Open it from the shelf to turn, peel and isolate at any time. Pin your own note to any structure. Run a personal-best round from it.',
    keeps: 'The specimen, your notes, and your best unaided round with its time.',
    back: 'What you missed or guessed comes due again. Passing a review a day or more later adds a stimulation layer to it.',
    how: 'Pass the plexus challenge in the gallery: three in four, unaided.' },
  'stimulator-layer': { name: 'Stimulation layer', where: 'On the specimen',
    what: 'A new way to inspect the specimen: select a cord or the musculocutaneous nerve and see the motor response the textbook states.',
    why: 'You passed a review of due items a day or more after first earning the specimen. That is delayed recall, not same-day memory.',
    use: 'In Explore, select a nerve and stimulate it. Only responses read on the cited page are shown; the rest say so.',
    keeps: 'The layer.', back: 'More responses are added only as their sources are checked.',
    how: 'Hold the specimen for a day, then pass a review of what is due.' },
  'regional-patch': { name: 'Regional series patch', where: 'On your studio shelf, and on your character card',
    what: 'A sleeve patch and a small framed plaque: the Overlord mark with one tick beneath it.',
    why: 'You completed the regional series: identification at three in four, a defensible approach in the case, and the questions.',
    use: 'It marks the series on your studio wall and your character card. It is an expression, not a tool.',
    keeps: 'The patch.', back: 'Each further series adds a tick.',
    how: 'Complete the regional series from the stone table in the gallery.' },
  'airway-sections': { name: 'Airway and neck section set', where: 'On your studio shelf',
    what: 'A small cast of the airway and neck from a real CT scan, with its slice lightbox.',
    why: 'You identified its structures without labels, on the model and on the scan slices.',
    use: 'Open it to section the model at any level and read the matching slice.',
    keeps: 'The set and your best round.', back: 'Missed structures come due again, on a different slice or view.',
    how: 'Pass the unlabeled round at the airway exhibit in the gallery.' },
};
export const ORDER = ['plexus-specimen', 'stimulator-layer', 'airway-sections', 'regional-patch'];
export function info(id) {
  if (id.startsWith('case:')) { const c = CASES.find((q) => q.id === id.slice(5));
    return { name: 'Case: ' + (c?.title || id.slice(5)), where: 'On your studio desk and the rail above it', what: 'Your own decisions in this case, in order: the level you chose, the reasons you selected, your sentence, and the model answer.',
      why: 'You completed the case and explained your choice in your own words.', use: 'Replay it at the desk, and set a later attempt beside an earlier one.', keeps: 'Every attempt, up to twelve.', back: 'The case returns when a reason was off. A better second attempt is the comparison worth having.' }; }
  return ITEMS[id];
}
