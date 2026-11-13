# Content verification

**What this lists.** Every statement the plexus exhibit can show a learner or score them on: 124 rows, generated
from `world/data/plexus.js` and `world/data/regional.js` by `tools/content_report.mjs`. Regenerate it after any edit.

**What "verified" means here.** Each statement was read in context on the cited printed page of the learner's own copy,
and the wording in the app is original (no passages are copied). A chapter or page range is never used as evidence: a
citation names the page the statement was read on. This reading was done by an AI assistant on 2026-11-10. **No anatomist,
CRNA or faculty member has reviewed it**, and the app says so in every source panel.

**Printed pages, not PDF positions.** All page numbers are the numbers printed on the page. In the PDFs that were used,
Hadzic's printed page N is PDF page N + 29, and Nagelhout's printed page N is PDF page N + 184.

**Sources.** Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 43 · Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 44 · Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 46 · Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 47 (table) · Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 48 · Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 49 · Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, p. 50 · Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, pp. 51-52 · Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, p. 1149 · Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, p. 1150 · Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, p. 1152 · Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, p. 1153 · Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, pp. 1154-1155 · Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, p. 1156 · Further reading, not used to check any statement here: Netter Atlas of Human Anatomy, Classic Regional Approach, 8th ed., Plate 439.

**A statement is scored only if** it is verified as above **and** `tools/audit_plexus.py` confirms that the model shows
it (48 of 48 checks on the corrected model; see `PLEXUS-DISCREPANCIES.md` for what was wrong in the source model).

**Outline mapping.** Items are filed under NBCRNA outline areas III.I.1 (Regional: anatomy), III.I.5 (Regional: peripheral blocks), III.I.7 (Regional: ultrasound and nerve stimulator concepts), from the 2025/2026
content outline. Practice questions are original; none is an NBCRNA item and no score here predicts an exam result.

## Looked for and not found: removed from the app

| Claim | What happened |
|---|---|
| Injury to the long thoracic nerve produces a winged scapula | Not found in context on the pages read. Removed from scored content. |
| Radial nerve injury produces wrist drop | Not found in context on the pages read. Removed from scored content. |
| The subclavian vein passes anterior to the anterior scalene | Not found in context on the pages read. Removed; the related audit check was dropped with it. |
| Root values of the median nerve | The two books differ (Hadzic's table gives C6 to T1). Shown nowhere and never tested. |
| Any needle path, ultrasound appearance, drug or dose | Nothing of this kind could be validated, so none is shown. |

## The second exhibit (airway and neck, from a CT scan)

It makes **no textbook statements**. Names come from the segmentation software's class list; every sentence about position
is computed from the reviewed masks of that one scan and is worded "measured on this scan". How the outlines were reviewed
and corrected, and their limits, are in `HEADNECK-CT.md`. Items are filed under I.A.2 (Basic sciences: respiratory anatomy).

## Every statement, where it is used, and where it was read

| Where | Statement | Read on |
|---|---|---|
| Explore: C5 root | Passes between the anterior and middle scalenes and joins C6 to form the superior trunk. | Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 p. 44 |
| Explore: C6 root | Passes between the anterior and middle scalenes and joins C5 to form the superior trunk. | Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 p. 44 |
| Explore: C7 root | Passes between the scalenes and continues alone as the middle trunk. | Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 p. 44 |
| Explore: C8 root | Passes between the scalenes and joins T1 to form the inferior trunk. | Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 p. 44 |
| Explore: T1 root | Joins C8 to form the inferior trunk. | Hadzic 2e ch.3 p. 44 |
| Explore: Superior trunk | Formed by C5 and C6 at the lateral border of the scalenes. The suprascapular nerve arises from it. | Hadzic 2e ch.3 p. 44; Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 p. 48 |
| Explore: Middle trunk | The continuation of C7 alone. | Hadzic 2e ch.3 p. 44 |
| Explore: Inferior trunk | Formed by C8 and T1. An interscalene block often spares it. | Hadzic 2e ch.3 p. 44; Nagelhout 7e ch.50 p. 1152 |
| Explore: Posterior division of the superior trunk | Joins the other two posterior divisions to form the posterior cord. | Hadzic 2e ch.3 p. 44 |
| Explore: Posterior division of the middle trunk | Joins the other two posterior divisions to form the posterior cord. | Hadzic 2e ch.3 p. 44 |
| Explore: Posterior division of the inferior trunk | Joins the other two posterior divisions to form the posterior cord. | Hadzic 2e ch.3 p. 44 |
| Explore: Anterior division of the superior trunk | Joins the anterior division of the middle trunk to form the lateral cord. | Hadzic 2e ch.3 p. 44 |
| Explore: Anterior division of the middle trunk | Joins the anterior division of the superior trunk to form the lateral cord. | Hadzic 2e ch.3 p. 44 |
| Explore: Anterior division of the inferior trunk | Continues as the medial cord. | Hadzic 2e ch.3 p. 44 |
| Explore: Lateral cord | Formed by the anterior divisions of the superior and middle trunks. Lies superior and lateral to the axillary artery. Continues as the musculocutaneous nerve and sends a branch to the median nerve. | Hadzic 2e ch.3 p. 44; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1149 |
| Explore: Medial cord | The continuation of the anterior division of the inferior trunk. Lies posterior and medial to the axillary artery. Continues as the ulnar nerve and sends a branch to the median nerve. | Hadzic 2e ch.3 p. 44; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1149 |
| Explore: Posterior cord | Formed by all three posterior divisions. Lies behind the axillary artery. Gives the subscapular nerves, the thoracodorsal nerve, the axillary nerve and the radial nerve. | Hadzic 2e ch.3 p. 44; Nagelhout 7e ch.50 pp. 1154-1155; Hadzic 2e ch.3 p. 48 |
| Explore: Musculocutaneous nerve | C5 to C7. The continuation of the lateral cord. Pierces coracobrachialis, descends between biceps and brachialis, and ends as the lateral cutaneous nerve of the forearm. | Hadzic 2e ch.3 p. 50; Nagelhout 7e ch.50 p. 1149; Nagelhout 7e ch.50 p. 1150 |
| Explore: Axillary nerve | C5 and C6, from the posterior cord. Passes behind the surgical neck of the humerus to supply deltoid; also supplies teres minor. | Hadzic 2e ch.3 p. 49; Nagelhout 7e ch.50 p. 1149 |
| Explore: Radial nerve | C5 to T1, from the posterior cord. Descends along the shaft of the humerus in the spiral groove. | Hadzic 2e ch.3 p. 49; Nagelhout 7e ch.50 p. 1149 |
| Explore: Median nerve | Formed where a branch from the lateral cord meets a branch from the medial cord. Descends the arm with the brachial artery. | Hadzic 2e ch.3 p. 50; Nagelhout 7e ch.50 p. 1149 |
| Explore: Ulnar nerve | C8 and T1, from the medial cord. Crosses the elbow behind the medial epicondyle. | Hadzic 2e ch.3 pp. 51-52; Nagelhout 7e ch.50 p. 1149 |
| Explore: Lateral root of the median nerve | The branch from the lateral cord to the median nerve. | Hadzic 2e ch.3 p. 50 |
| Explore: Medial root of the median nerve | The branch from the medial cord to the median nerve. | Hadzic 2e ch.3 p. 50 |
| Explore: Suprascapular nerve | Arises from the superior trunk. Supplies infraspinatus and the back of the shoulder joint. | Hadzic 2e ch.3 p. 48 |
| Explore: Long thoracic nerve | From the C5 to C7 rami. Descends on the front of the middle scalene to the first rib, then on serratus anterior, which it supplies. | Hadzic 2e ch.3 p. 46; Hadzic 2e ch.3 p. 48 |
| Explore: Dorsal scapular nerve | From the C5 ramus. Follows levator scapulae to the scapula and supplies it and the rhomboids. It often passes through the middle scalene. | Hadzic 2e ch.3 p. 46; Nagelhout 7e ch.50 p. 1153 |
| Explore: Phrenic nerve | Formed from C3 to C5. Descends through the neck on the front of the anterior scalene. Only that part is modeled here. | Hadzic 2e ch.3 p. 43 |
| Explore: Anterior scalene | The front wall of the interscalene groove. The phrenic nerve runs down its front surface. | Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 p. 43 |
| Explore: Middle scalene | The back wall of the interscalene groove. The long thoracic nerve descends on its front surface, and the dorsal scapular and long thoracic nerves often pass through it. | Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 p. 46; Nagelhout 7e ch.50 p. 1153 |
| Explore: Sternocleidomastoid | Lies in front of the scalenes. The interscalene groove is found by moving a finger laterally from behind its clavicular head, across the anterior scalene. | Nagelhout 7e ch.50 p. 1152 |
| Explore: Subclavian artery | At the first rib the trunks and divisions lie lateral to it. | Nagelhout 7e ch.50 p. 1153 |
| Explore: Axillary artery | The cords are named for where they lie around it: lateral, posterior and medial. | Nagelhout 7e ch.50 p. 1149; Nagelhout 7e ch.50 pp. 1154-1155 |
| Explore: First rib | The trunks and divisions pass over it, and the trunks divide at its lateral border. The pleura lies immediately below it. | Nagelhout 7e ch.50 p. 1149; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155 |
| Explore: Clavicle | Roots, trunks and divisions lie above it; cords and terminal branches lie below it. The trunks divide behind it. | Nagelhout 7e ch.50 p. 1149 |
| Explore: Cricoid cartilage | A line drawn laterally from it gives the C6 level. | Nagelhout 7e ch.50 p. 1152 |
| Explore: Coracobrachialis | The musculocutaneous nerve pierces it. In the axilla that nerve lies within it, outside the sheath around the artery. | Hadzic 2e ch.3 p. 50; Nagelhout 7e ch.50 p. 1156 |
| Explore: Pectoralis minor | An infraclavicular block has to pass through pectoralis major and this muscle. | Nagelhout 7e ch.50 p. 1156 |
| Explore: Thoracodorsal nerve | From the posterior cord, to latissimus dorsi. | Hadzic 2e ch.3 p. 48; Hadzic 2e ch.3 p. 49 |
| Explore: Upper subscapular nerve | The first nerve to arise from the posterior cord. | Hadzic 2e ch.3 p. 49 |
| Explore: Lower subscapular nerve | From the posterior cord, to subscapularis and teres major. | Hadzic 2e ch.3 p. 49 |
| Explore: Lateral cutaneous nerve of the forearm | The end of the musculocutaneous nerve. | Nagelhout 7e ch.50 p. 1150 |
| Film, 0s | A block placed between the scalene muscles often spares the lowest part of the plexus. Which nerve does that leave working? Follow one trunk and you can answer it. | Nagelhout 7e ch.50 p. 1152 |
| Film, 9s | The right side of the neck, from the front. Five roots, C5 to T1, pass between the anterior and middle scalene muscles. | Nagelhout 7e ch.50 p. 1149 |
| Film, 18.5s | At the edge of the scalenes they become three trunks. C5 and C6 form the superior trunk. C7 continues alone as the middle. C8 and T1 form the inferior trunk, the lowest. | Hadzic 2e ch.3 p. 44; Nagelhout 7e ch.50 p. 1149 |
| Film, 29.5s | Behind the clavicle each trunk splits into an anterior and a posterior division. All three posterior divisions join to form one cord. | Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 p. 44 |
| Film, 39s | The anterior division of the inferior trunk continues on its own. Before you see it: which cord does it become? | Hadzic 2e ch.3 p. 44 |
| Film, 46.5s | The medial cord. It lies behind and to the inside of the axillary artery. All three cords are named for where they lie around that artery. | Hadzic 2e ch.3 p. 44; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1149 |
| Film, 56.5s | The medial cord continues as the ulnar nerve, C8 and T1. It crosses the elbow behind the medial epicondyle. | Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 pp. 51-52 |
| Film, 65.5s | So a block that spares the inferior trunk spares C8 and T1, the fibers that reach the ulnar nerve. That is why it is not chosen for surgery below the elbow. | Nagelhout 7e ch.50 p. 1152; Hadzic 2e ch.3 pp. 51-52 |
| Hands-on, step 1 | The sternocleidomastoid lies in front of the scalenes. Clinically the groove between the scalenes is found by sliding a finger sideways from behind this muscle, across the anterior scalene. | Nagelhout 7e ch.50 p. 1152 |
| Hands-on, step 2 | The plexus begins as five roots, C5 to T1. They pass between the anterior and middle scalene muscles. | Nagelhout 7e ch.50 p. 1149 |
| Hands-on, step 3 | At the lateral border of the scalenes the roots converge. C5 and C6 form the superior trunk. C7 continues alone as the middle trunk. C8 and T1 form the inferior trunk. | Hadzic 2e ch.3 p. 44; Nagelhout 7e ch.50 p. 1149 |
| Hands-on, step 4 | Behind the clavicle, at the lateral border of the first rib, each trunk splits into an anterior and a posterior division. All three posterior divisions run to the same place. | Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 p. 44 |
| Hands-on, step 5 | The posterior divisions form the posterior cord. The anterior divisions of the superior and middle trunks form the lateral cord. The anterior division of the inferior trunk becomes the medial cord. Each is named for where it lies beside the axillary artery. | Hadzic 2e ch.3 p. 44; Nagelhout 7e ch.50 pp. 1154-1155 |
| Hands-on, step 6 | The musculocutaneous nerve is the continuation of the lateral cord. The ulnar nerve continues from the medial cord. The median nerve takes a branch from each. The axillary and radial nerves come from the posterior cord. | Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 p. 50 |
| Challenge (find) | Select the superior trunk. → The highest trunk, formed by C5 and C6. | Hadzic 2e ch.3 p. 44 |
| Challenge (find) | Select the inferior trunk. → The lowest trunk, formed by C8 and T1. | Hadzic 2e ch.3 p. 44 |
| Challenge (find) | Select the posterior cord. → The cord behind the axillary artery, formed by all three posterior divisions. | Hadzic 2e ch.3 p. 44; Nagelhout 7e ch.50 pp. 1154-1155 |
| Challenge (find) | Select the lateral cord. → The cord superior and lateral to the axillary artery. | Nagelhout 7e ch.50 pp. 1154-1155 |
| Challenge (find) | Select the medial cord. → The cord posterior and medial to the axillary artery. | Nagelhout 7e ch.50 pp. 1154-1155 |
| Challenge (find) | Select the phrenic nerve. → It lies on the front of the anterior scalene. | Hadzic 2e ch.3 p. 43 |
| Challenge (find) | Select the anterior scalene. → The scalene in front of the roots. | Nagelhout 7e ch.50 p. 1149 |
| Challenge (find) | Select the suprascapular nerve. → It leaves the superior trunk and runs back toward the scapula. | Hadzic 2e ch.3 p. 48 |
| Challenge (relation) | Select a root that helps form the superior trunk. → C5 and C6 join to form the superior trunk. | Hadzic 2e ch.3 p. 44 |
| Challenge (relation) | Select the trunk that is the continuation of a single root. → The middle trunk is C7 alone. The other two are each formed by two roots. | Hadzic 2e ch.3 p. 44 |
| Challenge (relation) | Select a division that joins the posterior cord. → All three posterior divisions join to form the posterior cord. Anterior divisions never do. | Hadzic 2e ch.3 p. 44 |
| Challenge (relation) | Select the nerve that is the continuation of the lateral cord. → The musculocutaneous nerve continues from the lateral cord. | Nagelhout 7e ch.50 p. 1149 |
| Challenge (relation) | Select the nerve that pierces coracobrachialis. → The musculocutaneous nerve pierces coracobrachialis, then runs between biceps and brachialis. | Hadzic 2e ch.3 p. 50 |
| Challenge (relation) | Select the nerve that passes behind the surgical neck of the humerus. → The axillary nerve passes behind the surgical neck on its way to deltoid. | Hadzic 2e ch.3 p. 49 |
| Challenge (relation) | Select the nerve that runs in the spiral groove of the humerus. → The radial nerve descends along the humeral shaft in the spiral groove. | Hadzic 2e ch.3 p. 49 |
| Challenge (relation) | Select the nerve that crosses the elbow behind the medial epicondyle. → The ulnar nerve crosses the elbow behind the medial epicondyle. | Hadzic 2e ch.3 pp. 51-52 |
| Challenge (relation) | Select the nerve formed by branches from two cords. → The median nerve is formed where a branch from the lateral cord meets a branch from the medial cord. | Hadzic 2e ch.3 p. 50; Nagelhout 7e ch.50 p. 1149 |
| Challenge (relation) | Select the muscle on whose front surface the phrenic nerve descends. → The phrenic nerve descends through the neck on the front of the anterior scalene. | Hadzic 2e ch.3 p. 43 |
| Challenge (relation) | Select the nerve that descends on the middle scalene and then on serratus anterior. → The long thoracic nerve runs down the front of the middle scalene to the first rib, then onto serratus anterior. | Hadzic 2e ch.3 p. 46; Hadzic 2e ch.3 p. 48 |
| Challenge (relation) | Select the cord that gives the axillary and radial nerves. → Both arise from the posterior cord. | Nagelhout 7e ch.50 p. 1149; Hadzic 2e ch.3 p. 48 |
| Stimulation layer: Musculocutaneous nerve | Elbow flexion. | Nagelhout 7e ch.50 pp. 1154-1155 |
| Stimulation layer: Lateral cord | The little finger moves laterally. | Nagelhout 7e ch.50 pp. 1154-1155 |
| Stimulation layer: Medial cord | The little finger flexes. | Nagelhout 7e ch.50 pp. 1154-1155 |
| Stimulation layer: Posterior cord | The little finger extends. | Nagelhout 7e ch.50 pp. 1154-1155 |
| Four ways in: Interscalene | Aimed at the roots, between the anterior and middle scalenes, at the level of C6. Used for: Surgery on the shoulder and the proximal upper arm. Misses: C8 and T1 (the lower trunk) are often spared, so it is not chosen for surgery below the elbow. Beside it: The phrenic nerve on the anterior scalene: the diaphragm on that side is often weakened. Also the stellate ganglion (Horner syndrome), the recurrent laryngeal nerve (hoarseness), the vertebral artery and the pleura. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153 |
| Four ways in: Supraclavicular | Aimed at the trunks and divisions, behind the clavicle and over the first rib, lateral to the subclavian artery. Used for: A dense block for surgery on the arm, because the plexus is most compact here. Misses: The suprascapular nerve has usually left the superior trunk already, so it is not ideal for shoulder surgery. Beside it: The pleura, immediately below the first rib: pneumothorax is the greatest risk. The subclavian artery. Horner syndrome and a weak hemidiaphragm can also occur. | Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155 |
| Four ways in: Infraclavicular | Aimed at the three cords, below the clavicle and medial to the coracoid process, around the axillary artery. Used for: Surgery on the elbow, forearm and hand. Misses: Nothing below the elbow in a complete block. It is not an approach for the shoulder. Beside it: The axillary artery and vein. It has to pass through pectoralis major and minor, so it is the most uncomfortable approach. The risk of blocking the phrenic nerve or the stellate ganglion is greatly reduced, which is why it suits a patient with severe respiratory compromise. | Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Four ways in: Axillary | Aimed at the terminal nerves as they travel with the axillary artery in the upper arm. Used for: Surgery distal to the elbow. Misses: The musculocutaneous nerve lies outside the sheath, within coracobrachialis, and needs its own injection. Beside it: The axillary artery and vein, which the nerves surround. | Nagelhout 7e ch.50 p. 1156 |
| Regional narration, 1 | Local anesthetic can be placed at four levels of the brachial plexus. Each level reaches a different part of it, and has different neighbors. | Nagelhout 7e ch.50 p. 1152 |
| Regional narration, 2 | Highest is the interscalene groove. The roots pass between the anterior and middle scalenes here, level with the cricoid cartilage and C6. It is used for the shoulder and upper arm. | Nagelhout 7e ch.50 p. 1152 |
| Regional narration, 3 | Two things to remember. The lower trunk, C8 and T1, is often spared. And the phrenic nerve lies on the anterior scalene right beside it, so the diaphragm on that side is often weakened. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153 |
| Regional narration, 4 | Behind the clavicle, over the first rib, the trunks and divisions are packed closely together beside the subclavian artery. A block here is dense for the arm. The pleura is just below the rib. | Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155 |
| Regional narration, 5 | Below the clavicle, the three cords surround the axillary artery. This level is used for the elbow, forearm and hand, and it is far from the phrenic nerve. | Nagelhout 7e ch.50 pp. 1154-1155 |
| Regional narration, 6 | In the axilla the terminal nerves travel with the artery. It covers the arm below the elbow. The musculocutaneous nerve has already left, inside coracobrachialis, and needs its own injection. | Nagelhout 7e ch.50 p. 1156 |
| Regional narration, 7 | That is where each approach is aimed. How to perform one is not shown here. | (model only) |
| Regional identify | An interscalene block often spares one trunk. Select it. → C8 and T1, the lower trunk, are often spared, which is why this block is not used for surgery below the elbow. | Nagelhout 7e ch.50 p. 1152 |
| Regional identify | After an interscalene block the patient is short of breath. Select the nerve most likely responsible. → The phrenic nerve lies on the anterior scalene close to the injection, and blocking it weakens the diaphragm on that side. | Nagelhout 7e ch.50 p. 1153; Hadzic 2e ch.3 p. 43 |
| Regional identify | A supraclavicular block is not ideal for shoulder surgery because one nerve is often missed. Select it. → The suprascapular nerve arises from the proximal superior trunk, above the level of a supraclavicular block. | Nagelhout 7e ch.50 p. 1153 |
| Regional identify | An in-plane interscalene block passes through the middle scalene. Select a nerve that can be injured inside that muscle. → The dorsal scapular and long thoracic nerves often pass through the middle scalene. | Nagelhout 7e ch.50 p. 1153 |
| Regional identify | During an axillary block one nerve lies outside the sheath and needs its own injection. Select it. → The musculocutaneous nerve lies within coracobrachialis, outside the sheath around the artery. | Nagelhout 7e ch.50 p. 1156 |
| Regional identify | Select the landmark used to find the C6 level for an interscalene block. → A line drawn laterally from the cricoid cartilage gives the C6 level. | Nagelhout 7e ch.50 p. 1152 |
| Regional identify | Select the cord an infraclavicular block aims to reach behind the artery. → The aim is to reach behind the axillary artery, which is where the posterior cord lies. | Nagelhout 7e ch.50 pp. 1154-1155 |
| Regional identify | Select the bone that separates the plexus from the pleura during a supraclavicular block. → The plexus lies above the first rib and the pleura immediately below it. | Nagelhout 7e ch.50 pp. 1154-1155 |
| Case: Distal radius fracture, severe COPD | A 67-year-old with severe COPD on home oxygen needs fixation of a distal radius fracture. A regional technique is planned as the main anesthetic. Model answer: Infraclavicular: it covers below the elbow and stays away from the phrenic nerve, which matters most in a patient with no respiratory reserve. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Distal radius fracture, severe COPD (interscalene: no) | The surgery is below the elbow, where C8 and T1 are often spared, and this approach commonly weakens the diaphragm, which this patient cannot afford. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Distal radius fracture, severe COPD (supraclavicular: no) | It would cover the forearm, but a weak hemidiaphragm can occur with this approach too, and this patient has no reserve. The pleura is also immediately below the first rib. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Distal radius fracture, severe COPD (infraclavicular: best) | It covers the elbow, forearm and hand, and the risk of blocking the phrenic nerve is greatly reduced, which is exactly why it is preferred in severe respiratory compromise. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Distal radius fracture, severe COPD (axillary: ok) | It covers the arm below the elbow and is far from the phrenic nerve. The source singles out the infraclavicular approach for patients like this, and the musculocutaneous nerve would need its own injection. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Distal radius fracture, severe COPD (reason, true) | The operation is below the elbow. True, and it is what rules out an approach that spares C8 and T1. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Distal radius fracture, severe COPD (reason, true) | Approaches above the clavicle can weaken the diaphragm on that side. True for both the interscalene and supraclavicular approaches. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Distal radius fracture, severe COPD (reason, false) | An interscalene block reliably numbs the forearm and hand. False. C8 and T1 are often spared at that level. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Distal radius fracture, severe COPD (reason, true) | Below the clavicle the phrenic nerve is unlikely to be blocked. True, and it is the main reason for this choice. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Distal radius fracture, severe COPD (reason, false) | Pneumothorax cannot happen with a brachial plexus block. False. The pleura lies immediately below the first rib. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Arthroscopic rotator cuff repair | A healthy 34-year-old is having an arthroscopic rotator cuff repair and wants the best pain control afterwards. Model answer: Interscalene: it blocks C5 and C6, which supply the shoulder, and a lower approach can miss the suprascapular nerve. The phrenic block that comes with it is tolerated with healthy lungs. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Arthroscopic rotator cuff repair (interscalene: best) | This is the approach for the shoulder and proximal upper arm. The shoulder is supplied mainly by C5 and C6, which are blocked here. A weak hemidiaphragm is expected but rarely matters with healthy lungs. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Arthroscopic rotator cuff repair (supraclavicular: no) | The suprascapular nerve, which arises from the proximal superior trunk, is often missed at this level, so the shoulder may not be covered. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Arthroscopic rotator cuff repair (infraclavicular: no) | This level is for the elbow, forearm and hand. It is below everything that supplies the shoulder. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Arthroscopic rotator cuff repair (axillary: no) | This covers the arm distal to the elbow, not the shoulder. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Arthroscopic rotator cuff repair (reason, true) | The shoulder is supplied mainly by C5 and C6. True, and those roots are what this level blocks. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Arthroscopic rotator cuff repair (reason, true) | A lower approach can miss the suprascapular nerve. True. It leaves the superior trunk early. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Arthroscopic rotator cuff repair (reason, false) | The ulnar side of the hand will be reliably numb. False. C8 and T1 are often spared here, which does not matter for the shoulder. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Arthroscopic rotator cuff repair (reason, true) | In a patient with healthy lungs a weak hemidiaphragm rarely causes trouble. True, and it is why the phrenic nerve does not rule this out here. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Case: Arthroscopic rotator cuff repair (reason, false) | It is chosen because it avoids the phrenic nerve. False. This is the approach most likely to block it. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Practice question 1 (single) | After an interscalene block a patient has a drooping eyelid, a small pupil and a dry face on the same side. Which structure was blocked? → Ptosis, miosis and anhidrosis are Horner syndrome, from block of the stellate ganglion. A phrenic block weakens the diaphragm; a recurrent laryngeal block causes hoarseness. | Nagelhout 7e ch.50 p. 1153 |
| Practice question 2 (multi) | Which of these are recognized consequences or risks of an interscalene block? Select all that apply. → Phrenic block, stellate ganglion block, recurrent laryngeal block and pneumothorax are all described. The little finger is C8 and T1 territory, which this block often spares. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153 |
| Practice question 3 (match) | Match each approach to the part of the plexus it targets. → From the neck to the arm the approaches meet the plexus in the order it is built: roots, then trunks and divisions, then cords, then terminal branches. | Nagelhout 7e ch.50 p. 1152; Nagelhout 7e ch.50 p. 1153; Nagelhout 7e ch.50 pp. 1154-1155; Nagelhout 7e ch.50 p. 1156 |
| Practice question 4 (single) | Why is a supraclavicular block considered less than ideal for shoulder surgery? → The suprascapular nerve arises from the proximal superior trunk, above the level of the block, so it is often missed. | Nagelhout 7e ch.50 p. 1153 |
| Practice question 5 (single) | During an infraclavicular block with a nerve stimulator, the little finger extends. Which cord is being stimulated? → Posterior cord: the little finger extends. Medial cord: it flexes. Lateral cord: it moves laterally. Elbow flexion is the musculocutaneous nerve. | Nagelhout 7e ch.50 pp. 1154-1155 |
