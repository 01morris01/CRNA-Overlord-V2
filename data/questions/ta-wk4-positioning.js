/**
 * Technological Advances in Anesthesia Practice, Week 4
 * Positioning
 * Source: NAS 560 Patient Positioning lecture (Dr. Whybrew). Every question cites its source slide.
 * Textbook alignment: Pardo 19; Nagelhout 23.
 * Authoring conventions: periods, commas, and semicolons only (no dashes as punctuation); numeric ranges written with the word "to".
 */

export const TA_WK4_QUESTIONS = [

  /* ================================================================
     Principles, closed claims, nerve injury prevention
     ================================================================ */

  {
    id: "ta-w4-001",
    type: "mcq",
    prompt: "What are the goals of proper patient positioning under anesthesia?",
    setup: "",
    ans: [
      { t: "Facilitate the surgery, prevent pressure or stretch injury, preserve the airway, and know the complications", ok: true },
      { t: "Place the patient in the single most extreme position the joints will allow, purely to improve exposure", ok: false },
      { t: "Keep the patient comfortable only, because real injury under general anesthesia is not actually a concern", ok: false },
      { t: "Reduce the surgeon workload as much as possible, regardless of any pressure or stretch on the patient", ok: false },
    ],
    rationale: "The goals of positioning are to facilitate surgery and optimize surgical anatomy, minimize the potential for pressure, stretch, or friction-induced injuries, facilitate and preserve access to the airway, and apply knowledge of potential positioning complications. Anesthesia renders the patient insensible to pain and unable to alter position, so achieving these goals protects a patient who cannot protect themselves. Source: NAS 560 Patient Positioning lecture.", // source: slide 3
    scene: "patient",
    sceneCfg: { label: "GOALS OF POSITIONING" },
    metadata: { topic: "Positioning Principles", priority: "high" },
  },

  {
    id: "ta-w4-002",
    type: "mcq",
    prompt: "Why does the anesthetized patient depend entirely on the care team for safe positioning?",
    setup: "",
    ans: [
      { t: "Anesthesia and relaxants leave the patient unable to feel or move, so the whole team must position safely", ok: true },
      { t: "The patient can still feel and adjust position throughout, so the team carries no real responsibility", ok: false },
      { t: "Muscle relaxants make the patient strongly resistant to any injury at all that arises from positioning", ok: false },
      { t: "Positioning is entirely the surgeon responsibility alone, and the anesthesia team plays no part in it", ok: false },
    ],
    rationale: "Anesthesia renders a patient insensible to pain and prevents them from altering their position, and muscle relaxants allow patients to be placed in positions they normally could not assume and kept in anatomical position. It is therefore the shared responsibility of the anesthesia team, the surgeon, and the operating room nurse to ensure proper positioning, because the patient has lost the protective ability to feel discomfort and move. Source: NAS 560 Patient Positioning lecture.", // source: slide 4
    scene: "patient",
    sceneCfg: { label: "POSITIONING RESPONSIBILITY" },
    metadata: { topic: "Positioning Principles", priority: "medium" },
  },

  {
    id: "ta-w4-003",
    type: "mcq",
    prompt: "Positioning complications fall into which categories?",
    setup: "",
    ans: [
      { t: "Nerve damage, tissue damage, and poor perfusion from blocked arterial supply or venous capillary drainage", ok: true },
      { t: "Only nerve damage; the tissue perfusion is never once affected by the way a patient happens to be placed", ok: false },
      { t: "Only allergic skin reactions to the foam and gel padding materials placed against the patient body skin", ok: false },
      { t: "Only loss of the airway, with no vascular consequences and no nerve consequences of any kind at all", ok: false },
    ],
    rationale: "Positioning complications include nerve damage, tissue damage, and inadequate tissue perfusion. The inadequate perfusion can arise from occlusion of the major arterial supply, the arterial capillary supply, or the venous capillary drainage. Recognizing all three categories explains why both compression and stretch, and both arterial and venous compromise, must be considered. Source: NAS 560 Patient Positioning lecture.", // source: slide 5
    scene: "patient",
    sceneCfg: { label: "POSITIONING COMPLICATIONS" },
    metadata: { topic: "Positioning Principles", priority: "medium" },
  },

  {
    id: "ta-w4-004",
    type: "mcq",
    prompt: "What do the ASA and AANA closed claims analyses show about the most common positioning-related nerve injuries?",
    setup: "",
    ans: [
      { t: "ASA found ulnar injury most common, then brachial plexus; the AANA found brachial plexus the most common", ok: true },
      { t: "Both of these databases show the femoral nerve injury as being by far the most common of all injuries", ok: false },
      { t: "Both of these databases show that positioning injuries essentially never lead to any malpractice claims", ok: false },
      { t: "ASA shows brachial plexus first and AANA shows lumbosacral first, with ulnar injuries never reported at all", ok: false },
    ],
    rationale: "In the ASA closed claims analysis the most frequent claimed injury was ulnar neuropathy, followed by brachial plexus injuries and then lumbosacral injuries; ulnar injuries often occurred without an identifiable mechanism, and gender and body habitus may play a role. In the AANA analysis of 223 cases, 44 had nerve injuries, and brachial plexus injuries were most common, followed by ulnar nerve damage. Source: NAS 560 Patient Positioning lecture.", // source: slide 7
    scene: "patient",
    sceneCfg: { label: "CLOSED CLAIMS" },
    metadata: { topic: "Positioning Principles", priority: "medium" },
  },

  {
    id: "ta-w4-005",
    type: "mcq",
    prompt: "Which measures help prevent positioning-related nerve damage, and how does case duration matter?",
    setup: "",
    ans: [
      { t: "History, correct positioning, padding, and reassessment; injuries rise in cases lasting over two hours", ok: true },
      { t: "Only padding the heels matters at all; the history and the reassessment of position make no difference", ok: false },
      { t: "Nerve injuries are entirely unrelated to how long the surgical case happens to last from start to finish", ok: false },
      { t: "Documentation plays no part in prevention and is never actually needed before or after the case at all", ok: false },
    ],
    rationale: "Preventing nerve damage involves a thorough preoperative history, positioning the patient correctly, padding the pressure points, reassessing position throughout the case, and documenting properly. Injuries are more common in cases of longer duration, generally those over 2 hours. For the CRNA, a preexisting deficit such as a footdrop must be documented before surgery so it is not later attributed to positioning. Source: NAS 560 Patient Positioning lecture.", // source: slide 9
    scene: "patient",
    sceneCfg: { label: "PREVENTING NERVE DAMAGE" },
    metadata: { topic: "Nerve Injury Prevention", priority: "high" },
  },

  {
    id: "ta-w4-006",
    type: "mcq",
    prompt: "Which patient factors increase the risk of positioning-related nerve injury?",
    setup: "",
    ans: [
      { t: "Extremes of weight, malnourishment, and preexisting neuropathy from diabetes or a low blood flow state", ok: true },
      { t: "Only young, healthy, normal weight patients are ever at any real risk of a positioning related nerve injury", ok: false },
      { t: "A patient body weight and nutrition status have no effect at all on the risk of any nerve injury at all", ok: false },
      { t: "Only the patients who are having eye surgery are at any real risk for a positioning nerve injury at all", ok: false },
    ],
    rationale: "Certain patients are more prone to positioning nerve injuries: extremes of weight (both obese and thin), malnourishment, and preexisting neuropathies. Predisposing conditions include hepatic disease, low blood flow states such as CHF and arterial or venous insufficiency, hypertension or hypotension, alcohol or tobacco use, diabetes, carpal tunnel syndrome, radiculopathies, and limited joint mobility from burns or rheumatoid arthritis. Documentation of these is critical. Source: NAS 560 Patient Positioning lecture.", // source: slide 10
    scene: "patient",
    sceneCfg: { label: "AT-RISK PATIENTS" },
    metadata: { topic: "Nerve Injury Prevention", priority: "medium" },
  },

  {
    id: "ta-w4-007",
    type: "mcq",
    prompt: "By what mechanism does positioning cause neurovascular compromise of a peripheral nerve?",
    setup: "",
    ans: [
      { t: "Compression or stretch of the vasa nervorum starves the nerve of blood, causing ischemia and then injury", ok: true },
      { t: "Only a direct surgical laceration of the nerve, and never any form of ischemia, causes the actual injury", ok: false },
      { t: "Increasing the blood flow into the nerve is what causes it to swell painfully and then become injured", ok: false },
      { t: "Only the deep nerves that have no fixed bony points anywhere along them are ever at any risk of injury", ok: false },
    ],
    rationale: "Neurovascular compromise occurs by compression or stretching of the intraneural vasa nervorum, the small arteries that supply nerves, which produces nerve ischemia. It is more likely when a nerve has a long superficial course between two fixed points. Compression of a nerve between internal structures and rigid objects, especially combined with stretch, is most detrimental, and a stretched nerve is extremely vulnerable to ischemic compromise. Large fluid volumes that create tissue edema can also contribute. Source: NAS 560 Patient Positioning lecture.", // source: slide 16
    scene: "neuro",
    sceneCfg: { label: "NEUROVASCULAR COMPROMISE" },
    metadata: { topic: "Nerve Injury Prevention", priority: "high" },
  },

  {
    id: "ta-w4-008",
    type: "mcq",
    prompt: "What features of compression make nerve or tissue ischemia more likely during positioning?",
    setup: "",
    ans: [
      { t: "Concentrated pressure over a small area such as the heels or occiput, lasting beyond about twenty minutes", ok: true },
      { t: "Pressure that is spread widely over a large padded area and that lasts for only a very short time at all", ok: false },
      { t: "Compression that lasts for less than a single second is by far the main danger to the patient body nerves", ok: false },
      { t: "Only the compression of the deep visceral organs, and never of the heels or the occiput, is dangerous", ok: false },
    ],
    rationale: "Damage is more likely when compression occurs in a small area where pressure is concentrated, such as the heels and occiput, and when the duration of compression is long. More than about 20 minutes is a general rule, because that is roughly the usual length of time before a compressed extremity goes numb. Source: NAS 560 Patient Positioning lecture.", // source: slide 18
    scene: "patient",
    sceneCfg: { label: "COMPRESSION DURATION" },
    metadata: { topic: "Nerve Injury Prevention", priority: "high" },
  },

  {
    id: "ta-w4-009",
    type: "mcq",
    prompt: "Which bony areas are the classic pressure points to pad during positioning?",
    setup: "",
    ans: [
      { t: "The occiput, the scapula, the elbows, the hips, the sacrum, the heels, the knees, and both outer ears", ok: true },
      { t: "Only the abdomen and the chest, since the bony points are not actually at any risk during positioning", ok: false },
      { t: "Only the fingertips and the very tip of the nose are the points that need any padding during a case", ok: false },
      { t: "The pressure points never vary with position at all and so they never actually need any padding at all", ok: false },
    ],
    rationale: "The classic pressure points are the occiput, scapula, elbows, hips, sacrum, heels, knees, and outer ears. The areas prone to ischemia vary with the surgical position, so the goal is to distribute pressure more evenly with proper padding and to stay vigilant for shifting from the original position throughout the case. Source: NAS 560 Patient Positioning lecture.", // source: slide 20
    scene: "patient",
    sceneCfg: { label: "PRESSURE POINTS" },
    metadata: { topic: "Nerve Injury Prevention", priority: "high" },
  },

  {
    id: "ta-w4-010",
    type: "mcq",
    prompt: "Which maneuvers help avoid stretch injuries during positioning?",
    setup: "",
    ans: [
      { t: "Gentle hip and knee flexion to spare the femoral nerve, the arms abducted under ninety, and a neutral neck", ok: true },
      { t: "Full extension of both the hips and the knees, along with arm abduction taken well beyond ninety degrees", ok: false },
      { t: "Hyperflexion of the patient neck firmly to one side for the entire duration of the surgical procedure", ok: false },
      { t: "Maximal abduction of both of the arms in order to most fully expose the axilla for the surgical team", ok: false },
    ],
    rationale: "Stretch injuries are avoided by gentle flexion of the hips and knees to avoid stretching the femoral nerve, abduction of the arms to less than 90 degrees, and maintaining the cervical spine in a neutral position. These principles recur across nearly every surgical position. Source: NAS 560 Patient Positioning lecture.", // source: slide 21
    scene: "patient",
    sceneCfg: { label: "AVOIDING STRETCH INJURIES" },
    metadata: { topic: "Nerve Injury Prevention", priority: "high" },
  },

  {
    id: "ta-w4-011",
    type: "mcq",
    prompt: "When an intubated patient is repositioned, what are the anesthesia provider responsibilities?",
    setup: "",
    ans: [
      { t: "Anesthesia holds the head and tube, calls the move, disconnects the vent, and rechecks the breath sounds", ok: true },
      { t: "The surgeon takes control of the head and the tube while the anesthesia provider simply watches it all", ok: false },
      { t: "The ventilator should stay connected and keep actively pulling on the tube all through the entire move", ok: false },
      { t: "The breath sounds never need to be rechecked at all after a position change has been made to the patient", ok: false },
    ],
    rationale: "During repositioning the anesthesia provider is responsible for the head and the endotracheal tube and makes the call for when the move takes place, counting so the whole team moves together (move on 3). To prevent tube migration or extubation, disconnect from the ventilator during position changes, hold on to the tube, and always recheck breath sounds afterward, especially after moving to the lateral or prone position. Source: NAS 560 Patient Positioning lecture.", // source: slide 22
    scene: "patient",
    sceneCfg: { label: "MOVING AFTER INDUCTION" },
    metadata: { topic: "Positioning Principles", priority: "high" },
  },

  {
    id: "ta-w4-012",
    type: "mcq",
    prompt: "Postoperative backache after anesthesia is common. What is it most likely related to, and how is it attenuated?",
    setup: "",
    ans: [
      { t: "It relates to case length, relaxants, and lost lumbar lordosis; ease it with flexed and pillow supported knees", ok: true },
      { t: "It is always caused by the regional anesthetic needle itself and is never related to patient positioning", ok: false },
      { t: "It is best prevented by fully extending the whole spine and by crossing the patient ankles over together", ok: false },
      { t: "It has no known relationship at all to the case duration or to the use of any muscle relaxant during it", ok: false },
    ],
    rationale: "Backache after anesthesia is very common and is often attributed to positioning, but it is more likely related to the duration of the procedure, the use of muscle relaxants, and loss of lumbar lordosis from muscle relaxation and stretching of the intervertebral ligaments. It is attenuated by positioning with the knees slightly flexed and supported by a pillow, and by not crossing the feet. Source: NAS 560 Patient Positioning lecture.", // source: slide 13
    scene: "patient",
    sceneCfg: { label: "POSTOPERATIVE BACKACHE" },
    metadata: { topic: "Positioning Principles", priority: "medium" },
  },

  {
    id: "ta-w4-013",
    type: "mcq",
    prompt: "In the supine position, which padding considerations are important?",
    setup: "",
    ans: [
      { t: "Pad the heels, elbows, knees, spine, and occiput; an unpadded occiput causes alopecia, so add a knee pillow", ok: true },
      { t: "No padding at all is needed in the supine position, because the pressure is already evenly distributed", ok: false },
      { t: "The occiput should always be left fully unpadded so that the scalp can be directly monitored during it", ok: false },
      { t: "A pillow under the knees must be avoided because it actively harms the lumbar spine of the supine patient", ok: false },
    ],
    rationale: "The supine position is used for abdominal, pelvic, open heart, head and neck, and most extremity surgery. Pad the heels, elbows, knees, spinal column, and occiput; if a case is prolonged the sacrum may need additional padding, especially with lower perfusion pressures. An improperly padded occiput can lead to alopecia, and a pillow under the knees prevents hyperextension of the leg and knee, which can stretch the tibial and peroneal nerves, while taking pressure off the lumbar area. Source: NAS 560 Patient Positioning lecture.", // source: slide 24
    scene: "patient",
    sceneCfg: { label: "SUPINE PADDING" },
    metadata: { topic: "Supine Position", priority: "high" },
  },

  {
    id: "ta-w4-014",
    type: "mcq",
    prompt: "How does the supine position affect cardiorespiratory status?",
    setup: "",
    ans: [
      { t: "It lowers the functional residual capacity and raises preload; a CHF patient may not tolerate lying flat", ok: true },
      { t: "It raises the functional residual capacity and lowers the preload in every single patient who lies flat", ok: false },
      { t: "It has no effect at all on the preload or on the lung volumes of any patient placed into this position", ok: false },
      { t: "Every patient tolerates lying completely flat equally well, regardless of any degree of heart failure", ok: false },
    ],
    rationale: "Placing a patient supine decreases functional residual capacity and increases preload. Someone with CHF or respiratory dysfunction may not tolerate lying flat, so it is reasonable to start with the head of the bed up and lay them flat after they are asleep. Source: NAS 560 Patient Positioning lecture.", // source: slide 28
    scene: "pulmonary",
    sceneCfg: { label: "SUPINE CARDIORESPIRATORY" },
    metadata: { topic: "Supine Position", priority: "high" },
  },

  /* ================================================================
     Upper extremity nerve injuries
     ================================================================ */

  {
    id: "ta-w4-015",
    type: "mcq",
    prompt: "How should the arms be positioned in the supine patient?",
    setup: "",
    ans: [
      { t: "They may be flexed over the chest, tucked at the sides, or abducted under ninety degrees on arm boards", ok: true },
      { t: "They must always be abducted to at least one hundred twenty degrees in order to allow surgical access", ok: false },
      { t: "They should be allowed to hang freely off the side of the operating bed without any padding underneath", ok: false },
      { t: "The position of the arms never matters at all in a patient who is placed into the standard supine position", ok: false },
    ],
    rationale: "Surgery requirements vary for arm position in the supine patient. The arms can be flexed and secured over the chest, tucked at the sides, or abducted out on padded arm boards. When on arm boards it is important that they are abducted to less than 90 degrees to avoid stretching the brachial plexus. Source: NAS 560 Patient Positioning lecture.", // source: slide 26
    scene: "patient",
    sceneCfg: { label: "SUPINE ARM POSITION" },
    metadata: { topic: "Upper Extremity Nerves", priority: "medium" },
  },

  {
    id: "ta-w4-016",
    type: "mcq",
    prompt: "The ulnar nerve is the most commonly injured nerve under anesthesia. Where does it run, and how does forearm rotation affect pressure on it?",
    setup: "",
    ans: [
      { t: "It runs between the medial epicondyle and the olecranon; supination relieves it and pronation worsens it", ok: true },
      { t: "It runs through the carpal tunnel at the wrist, and pronation fully relieves all pressure on the nerve", ok: false },
      { t: "Pronation puts the least pressure on the ulnar nerve, while supination puts by far the most pressure on it", ok: false },
      { t: "The rotation of the forearm has no effect at all on the amount of pressure under the patient ulnar nerve", ok: false },
    ],
    rationale: "The ulnar nerve travels in the ulnar groove between the medial epicondyle of the humerus and the olecranon of the ulna, so it is important to palpate the groove to ensure there is no compression. With the arm abducted, supination is associated with the least pressure under the ulnar nerve and pronation with the most, and pressure increases with greater abduction (30, 60, then 90 degrees). Source: NAS 560 Patient Positioning lecture.", // source: slide 29
    scene: "anatomy",
    sceneCfg: { label: "ULNAR NERVE ANATOMY" },
    metadata: { topic: "Upper Extremity Nerves", priority: "high" },
  },

  {
    id: "ta-w4-017",
    type: "mcq",
    prompt: "When the arms are tucked at the sides, what positioning precautions matter?",
    setup: "",
    ans: [
      { t: "The ulnar nerve can be compressed, so pad well and keep the hand neutral to avoid carpal tunnel syndrome", ok: true },
      { t: "Tucked arms carry no risk at all to the ulnar nerve and so they do not need any padding at all underneath", ok: false },
      { t: "The hands should be maximally flexed at the wrist in order to make them fit neatly at the patient sides", ok: false },
      { t: "Tucking the arms at the sides reliably protects the patient against every kind of nerve injury there is", ok: false },
    ],
    rationale: "When the arms are tucked at the sides there is potential for compression of the ulnar nerve, so the area must be padded well. Significant flexion of the hand can lead to carpal tunnel syndrome, so a neutral position of the hands should be maintained when the arms are at the sides. Source: NAS 560 Patient Positioning lecture.", // source: slide 32
    scene: "anatomy",
    sceneCfg: { label: "TUCKING ARMS" },
    metadata: { topic: "Upper Extremity Nerves", priority: "medium" },
  },

  {
    id: "ta-w4-018",
    type: "mcq",
    prompt: "How can the radial nerve be injured during positioning, and how does the injury present?",
    setup: "",
    ans: [
      { t: "Arm board depth or pressure on the back of the humerus injures it, giving wrist drop and no thumb abduction", ok: true },
      { t: "Radial nerve injury presents as a claw hand along with a complete loss of the patient thumb adduction", ok: false },
      { t: "The radial nerve simply cannot be injured at all by an arm board placed at the wrong depth or wrong height", ok: false },
      { t: "Radial nerve injury presents only as an isolated foot drop with no effect at all on the hand or wrist", ok: false },
    ],
    rationale: "Improper arm board depth can lead to radial nerve damage, and compression against the posterior surface of the humerus can also stretch the brachial plexus. Radial nerve injury manifests as wrist drop, inability to extend the metacarpal joints, and inability to abduct the thumb, with sensation possibly lost over the hand; it can also be damaged during an IV stick. Source: NAS 560 Patient Positioning lecture.", // source: slide 37
    scene: "anatomy",
    sceneCfg: { label: "RADIAL NERVE" },
    metadata: { topic: "Upper Extremity Nerves", priority: "high" },
  },

  {
    id: "ta-w4-019",
    type: "mcq",
    prompt: "How does a brachial plexus injury present, and what is Erb's paralysis?",
    setup: "",
    ans: [
      { t: "Shoulder and supraclavicular pain days later; Erb's palsy is an upper root injury from C5 to C7 levels", ok: true },
      { t: "Erb's palsy is instead a lower root injury that produces only an isolated loss of the finger flexion", ok: false },
      { t: "A brachial plexus injury produces only an isolated foot drop with no effect on the arm or the shoulder", ok: false },
      { t: "A brachial plexus injury never involves the supraclavicular area or the shoulder of the patient at all", ok: false },
    ],
    rationale: "A brachial plexus injury is characterized by shoulder pain with tenderness over the supraclavicular area, appearing 1 to several days after surgery; if the entire plexus is involved the whole limb is numb and flaccid. Erb's paralysis results from injury of only the upper roots (C5 to C7) and produces internal rotation of the arm, extension of the forearm, and pronation of the hand. Source: NAS 560 Patient Positioning lecture.", // source: slide 35
    scene: "anatomy",
    sceneCfg: { label: "BRACHIAL PLEXUS AND ERB'S" },
    metadata: { topic: "Upper Extremity Nerves", priority: "high" },
  },

  {
    id: "ta-w4-020",
    type: "mcq",
    prompt: "What is Klumpke paralysis, and how does median nerve injury present?",
    setup: "",
    ans: [
      { t: "Klumpke is a lower root injury with hand paralysis; median injury blocks thumb abduction and second finger", ok: true },
      { t: "Klumpke palsy involves only the upper roots and so it completely spares the hand and the finger flexion", ok: false },
      { t: "Median nerve injury causes a wrist drop along with a complete inability to extend the patient wrist at all", ok: false },
      { t: "Median nerve injury produces only a claw hand and has no other effect on the thumb or fingers at all", ok: false },
    ],
    rationale: "Klumpke paralysis results from injury of the lower roots of the brachial plexus and causes loss of finger flexion, paralysis of the hand, and perhaps Horner's syndrome. Median nerve injury can occur during an IV stick or drug extravasation, and edema can lead to carpal tunnel syndrome; it causes inability to abduct the thumb, inability to flex the distal phalanx of the second finger, and lost sensation over the lateral three and a half fingers. Source: NAS 560 Patient Positioning lecture.", // source: slide 38
    scene: "anatomy",
    sceneCfg: { label: "KLUMPKE AND MEDIAN NERVE" },
    metadata: { topic: "Upper Extremity Nerves", priority: "high" },
  },

  {
    id: "ta-w4-021",
    type: "mcq",
    prompt: "How does ulnar nerve injury present clinically?",
    setup: "",
    ans: [
      { t: "Reduced grip with no thumb adduction, lost sensation over the medial finger and a half, and a claw hand", ok: true },
      { t: "A wrist drop along with a complete inability to extend the patient wrist and the fingers of that hand", ok: false },
      { t: "A foot drop together with a clear loss of sensation over the entire sole of the patient affected foot", ok: false },
      { t: "A loss of sensation over only the lateral three and a half fingers, with the normal strength of the hand", ok: false },
    ],
    rationale: "Ulnar nerve injury results in reduced ability to grip with the hand and inability to adduct the thumb, decreased sensation of the medial one and a half fingers, and in severe cases atrophy of the hand muscles producing a claw hand. Source: NAS 560 Patient Positioning lecture.", // source: slide 39
    scene: "anatomy",
    sceneCfg: { label: "ULNAR NERVE DEFICIT" },
    metadata: { topic: "Upper Extremity Nerves", priority: "high" },
  },

  /* ================================================================
     Beach chair and prone position
     ================================================================ */

  {
    id: "ta-w4-022",
    type: "mcq",
    prompt: "The beach chair (semi-Fowler) position is used for shoulder and some cranial surgery. What are its cardiorespiratory effects?",
    setup: "",
    ans: [
      { t: "Slight flexion of the hips and knees, with less respiratory and only minimal cardiovascular compromise", ok: true },
      { t: "It causes severe respiratory compromise and so it is strictly contraindicated for any shoulder surgery", ok: false },
      { t: "It requires full and complete extension of both the hips and the knees throughout the entire procedure", ok: false },
      { t: "It fully eliminates every cardiovascular and respiratory effect of the general anesthetic that is given", ok: false },
    ],
    rationale: "The beach chair, or semi-Fowler, position allows slight flexion of the hips and knees, causes less respiratory compromise, and produces minimal cardiovascular compromise. It is commonly used for shoulder surgery and some craniotomies. Source: NAS 560 Patient Positioning lecture.", // source: slide 40
    scene: "patient",
    sceneCfg: { label: "BEACH CHAIR" },
    metadata: { topic: "Beach Chair and Sitting", priority: "medium" },
  },

  {
    id: "ta-w4-023",
    type: "mcq",
    prompt: "In the beach chair position, why can a blood pressure measured in the arm mislead the provider about cerebral perfusion?",
    setup: "",
    ans: [
      { t: "Arm pressure overstates brain perfusion; a normal arm reading can mean a much lower cerebral perfusion", ok: true },
      { t: "The arm reading is exactly equal to the cerebral perfusion pressure at every single point during a case", ok: false },
      { t: "The brain sits below the heart in this position, so the cerebral pressure is higher than the arm reading", ok: false },
      { t: "A blood pressure taken in the leg best reflects the true cerebral perfusion in the beach chair position", ok: false },
    ],
    rationale: "In the beach chair position the blood pressure measured in the arm does not reflect the true cerebral perfusion pressure. Because the head sits above the heart, when the arm reading is normal the cerebral perfusion pressure can be much less, and a blood pressure measured in the leg would represent cerebral perfusion even less well. For the CRNA, this is why the hydrostatic height of the monitoring site must be accounted for to avoid cerebral hypoperfusion. Source: NAS 560 Patient Positioning lecture.", // source: slide 41
    scene: "patient",
    sceneCfg: { label: "BEACH CHAIR CEREBRAL PERFUSION" },
    metadata: { topic: "Beach Chair and Sitting", priority: "high" },
  },

  {
    id: "ta-w4-024",
    type: "mcq",
    prompt: "The prone position is used for which surgeries, and what are its characteristic pressure points?",
    setup: "",
    ans: [
      { t: "Posterior spine, skull, and buttocks; the pressure points include the eyes, nose, breasts, and genitals", ok: true },
      { t: "It is used only for anterior abdominal surgery, and its only real pressure point is the patient heels", ok: false },
      { t: "It has no pressure points at all, because the body weight is always distributed perfectly evenly on it", ok: false },
      { t: "Its single pressure point is the occiput, and no other part of the body is ever at any risk while prone", ok: false },
    ],
    rationale: "The prone position is used for posterior spine, skull, buttocks, perirectal, and lower extremity surgery. Its potential pressure points include the nose, eyes, mouth, chin, knees, feet, hips, breasts, and genitals (testicles and penis). Source: NAS 560 Patient Positioning lecture.", // source: slide 42
    scene: "patient",
    sceneCfg: { label: "PRONE USES AND PRESSURE POINTS" },
    metadata: { topic: "Prone Position", priority: "high" },
  },

  {
    id: "ta-w4-025",
    type: "mcq",
    prompt: "How is a patient safely moved into the prone position after induction?",
    setup: "",
    ans: [
      { t: "Roll the whole body as one unit with a catcher on the far side, keeping the head neutral and the tube in", ok: true },
      { t: "Flip the patient quickly by the head and the feet only, while they are still lying flat on the stretcher", ok: false },
      { t: "Remove the endotracheal tube fully before turning the patient over into the final prone position itself", ok: false },
      { t: "Keep the patient head fully flexed forward all through the turn in order to protect the airway better", ok: false },
    ],
    rationale: "Induction of anesthesia generally takes place on the stretcher in the supine position. The patient is moved to the side of the bed, an arm is placed along the body, and the entire body is rolled as one unit with someone on the opposite side of the bed to catch the patient. The head is maintained in a neutral position and the patient stays intubated, with the airway and tube as the main focus throughout. Source: NAS 560 Patient Positioning lecture.", // source: slide 44
    scene: "patient",
    sceneCfg: { label: "MOVING PRONE" },
    metadata: { topic: "Prone Position", priority: "high" },
  },

  {
    id: "ta-w4-026",
    type: "mcq",
    prompt: "In the prone position, how should the eyes be protected, and why?",
    setup: "",
    ans: [
      { t: "Pad away from the eyes, since globe pressure causes blindness; skip rigid goggles and use ointment with tape", ok: true },
      { t: "Apply firm and steady pressure directly over both of the eyes in order to keep the eyelids fully closed", ok: false },
      { t: "Press a pair of rigid plastic goggles firmly onto the orbit as the recommended form of eye protection", ok: false },
      { t: "Eye protection is entirely unnecessary in the prone position and so it can be safely skipped each time", ok: false },
    ],
    rationale: "In the prone position the padding needs to avoid the eyes, because pressure on the globe can cause blindness as a result of retinal artery thrombosis. Goggles are not recommended because of their rigid edges; lubricating ointment with tape is preferred. Source: NAS 560 Patient Positioning lecture.", // source: slide 49
    scene: "patient",
    sceneCfg: { label: "PRONE EYE PROTECTION" },
    metadata: { topic: "Prone Position", priority: "high" },
  },

  {
    id: "ta-w4-027",
    type: "mcq",
    prompt: "In the prone position, how should the torso be supported?",
    setup: "",
    ans: [
      { t: "The abdomen should hang completely free, with the weight borne by the iliac crests and lateral thoraces", ok: true },
      { t: "The abdomen should bear the entire body weight pressed firmly against the surface of the operating table", ok: false },
      { t: "The body weight should rest squarely on the sternum and on the epigastrium of the prone patient instead", ok: false },
      { t: "The patient should lie flat with the abdomen fully compressed against the padding of the mattress below", ok: false },
    ],
    rationale: "In the prone position the abdomen should hang freely, and the weight-bearing areas should be the iliac crests and the lateral thoraces. The breasts of women and the genitals of men should not be compressed, and the knees are flexed slightly and padded with the legs and feet padded. Source: NAS 560 Patient Positioning lecture.", // source: slide 54
    scene: "patient",
    sceneCfg: { label: "PRONE WEIGHT BEARING" },
    metadata: { topic: "Prone Position", priority: "high" },
  },

  {
    id: "ta-w4-028",
    type: "mcq",
    prompt: "How does the prone position affect cardiovascular status and ventilation?",
    setup: "",
    ans: [
      { t: "Vena cava compression cuts preload and raises bleeding; chest rolls help and a free abdomen aids the FRC", ok: true },
      { t: "The prone position always raises the preload and it never has any effect on the amount of surgical bleeding", ok: false },
      { t: "Chest rolls actually increase the thoracic compression in the prone patient and so they should be avoided", ok: false },
      { t: "The prone position has no effect at all on the ventilation or on the venous return of the prone patient", ok: false },
    ],
    rationale: "In the prone position, abdominal contents compressing the vena cava can decrease preload, and increased perivertebral pressure can increase surgical bleeding; chest rolls or frames help reduce thoracic compression. For ventilation, the weight of the thorax and abdomen can restrict diaphragm movement and increase the work of breathing in a spontaneously breathing patient, but allowing the abdomen to hang free can have the opposite effect and improve functional residual capacity. Source: NAS 560 Patient Positioning lecture.", // source: slide 55
    scene: "pulmonary",
    sceneCfg: { label: "PRONE CARDIORESPIRATORY" },
    metadata: { topic: "Prone Position", priority: "high" },
  },

  /* ================================================================
     Kneeling, lateral decubitus, and sitting positions
     ================================================================ */

  {
    id: "ta-w4-029",
    type: "mcq",
    prompt: "How does the kneeling position affect spine surgery bleeding and the risk of venous air embolism?",
    setup: "",
    ans: [
      { t: "It cuts spinal bleeding by lowering venous pooling, but it raises the risk of a venous air embolism event", ok: true },
      { t: "It increases the spinal surgical bleeding and it completely eliminates any risk of a venous air embolism", ok: false },
      { t: "It has no effect at all on the surgical bleeding or on the risk of a venous air embolism in the patient", ok: false },
      { t: "It actually lowers the venous air embolism risk in a patient who is breathing spontaneously during it", ok: false },
    ],
    rationale: "The kneeling position can help decrease surgical bleeding in the spine by reducing venous pooling pressure, but it increases the risk of venous air embolism, especially if the patient is spontaneously breathing. Source: NAS 560 Patient Positioning lecture.", // source: slide 57
    scene: "patient",
    sceneCfg: { label: "KNEELING POSITION" },
    metadata: { topic: "Lateral and Sitting", priority: "medium" },
  },

  {
    id: "ta-w4-030",
    type: "mcq",
    prompt: "In the lateral decubitus position, what does the decubitus side refer to, and what are the dependent pressure points?",
    setup: "",
    ans: [
      { t: "The down side is the decubitus side; the dependent malleolus, knee, and hip are the main pressure points", ok: true },
      { t: "The decubitus side is the side that is up and away from the table, and not the side that is down on it", ok: false },
      { t: "There are no dependent pressure points at all to worry about in a patient in the lateral decubitus position", ok: false },
      { t: "Only the non-dependent ankle and the non-dependent knee are ever at any real risk in this side position", ok: false },
    ],
    rationale: "The lateral decubitus position refers to the side of the body that comes in contact with the operating room table, and when charting, the decubitus side is the side that is down. The potential dependent pressure points are the lateral malleolus of the dependent ankle, the lateral aspect of the dependent knee, and the hip of the dependent leg. Source: NAS 560 Patient Positioning lecture.", // source: slide 60
    scene: "patient",
    sceneCfg: { label: "LATERAL DECUBITUS" },
    metadata: { topic: "Lateral and Sitting", priority: "medium" },
  },

  {
    id: "ta-w4-031",
    type: "mcq",
    prompt: "During positive pressure ventilation in the lateral decubitus position, how are ventilation and perfusion distributed between the lungs?",
    setup: "",
    ans: [
      { t: "The down lung gets most blood and the up lung most ventilation, so V and Q mismatch and cause hypoxemia", ok: true },
      { t: "The dependent lower lung gets most of both the ventilation and the blood flow, so V and Q stay matched", ok: false },
      { t: "The upper lung gets most of the blood flow, while the lower lung instead gets most of the ventilation", ok: false },
      { t: "The ventilation and the perfusion stay perfectly matched in the lateral position during the ventilation", ok: false },
    ],
    rationale: "During positive pressure ventilation in the lateral decubitus position, the dependent lung receives most of the blood flow while the non-dependent lung receives most of the ventilation. This V/Q mismatch can lead to a widened PaCO2 to ETCO2 gradient and hypoxemia. During spontaneous ventilation, cephalad displacement of the diaphragm may give a more proportionate V/Q. Source: NAS 560 Patient Positioning lecture.", // source: slide 61
    scene: "pulmonary",
    sceneCfg: { label: "LATERAL V/Q MISMATCH" },
    metadata: { topic: "Lateral and Sitting", priority: "high" },
  },

  {
    id: "ta-w4-032",
    type: "mcq",
    prompt: "What is the purpose of the axillary (chest) roll in the lateral decubitus position, and how is correct placement confirmed?",
    setup: "",
    ans: [
      { t: "Placed just below the axilla to free the neurovascular bundle; a palpable radial pulse confirms placement", ok: true },
      { t: "It is placed directly into the axilla so that it presses firmly onto the axillary neurovascular bundle", ok: false },
      { t: "It is placed underneath the patient head and neck instead, and it is never placed anywhere near the axilla", ok: false },
      { t: "A roll that is placed far too high actually relieves all of the pressure on the underlying brachial plexus", ok: false },
    ],
    rationale: "The axillary, or chest, roll is placed just below the axilla to support the upper part of the rib cage and to decompress the axillary neurovascular bundle, and pressure must be removed from the head of the humerus. There should be an open space between the axilla and the roll with a palpable radial pulse; if the roll is too high it can compress the brachial plexus and artery. A pulse oximeter on the dependent arm helps confirm good blood flow. Source: NAS 560 Patient Positioning lecture.", // source: slide 62
    scene: "anatomy",
    sceneCfg: { label: "AXILLARY ROLL" },
    metadata: { topic: "Lateral and Sitting", priority: "high" },
  },

  {
    id: "ta-w4-033",
    type: "mcq",
    prompt: "How are the head and arms managed in the lateral decubitus position?",
    setup: "",
    ans: [
      { t: "Both arms abducted under ninety, head kept neutral, and the dependent ear and the eye checked for pressure", ok: true },
      { t: "The dependent ear and the eye need no checking, because the operating table fully protects them both", ok: false },
      { t: "Both of the arms should be abducted to well beyond one hundred twenty degrees in the lateral position", ok: false },
      { t: "The patient head should be allowed to hang freely off of the very edge of the operating table itself", ok: false },
    ],
    rationale: "In the lateral decubitus position the same principles for the ulnar nerve apply to the dependent arm, and the upper arm can be padded on pillows or an arm board; both arms should be abducted to less than 90 degrees. The head is maintained in a neutral position, usually requiring an added pillow or blanket under the neck, and the dependent ear and eye must be checked to ensure no pressure is applied. Source: NAS 560 Patient Positioning lecture.", // source: slide 64
    scene: "patient",
    sceneCfg: { label: "LATERAL HEAD AND ARMS" },
    metadata: { topic: "Lateral and Sitting", priority: "medium" },
  },

  {
    id: "ta-w4-034",
    type: "mcq",
    prompt: "In the sitting position, venous air embolism is a risk whenever the surgical field is above the right atrium. How is it detected and treated?",
    setup: "",
    ans: [
      { t: "Detect it with a precordial Doppler, capnography, or TEE; a patent foramen ovale lets air reach the body", ok: true },
      { t: "A venous air embolism simply cannot be detected by any monitor at all, and it truly has no real treatment", ok: false },
      { t: "It can be detected only by an ordinary chest X-ray that is taken at some time after the surgery is over", ok: false },
      { t: "It only ever happens when the surgical field is positioned below the level of the patient right atrium", ok: false },
    ],
    rationale: "Any time the surgical field is above the right atrium, venous air embolism is a risk. Detection methods include a precordial Doppler listening for a mill wheel murmur, capnography, and transesophageal echocardiography. Intervention includes withdrawing air from a central venous line, which must be done quickly and is usually not fast enough, plus supportive care. As right atrial pressure rises, a patent foramen ovale can allow a right to left shunt, leading to systemic air emboli, and patients become hypotensive quickly. Source: NAS 560 Patient Positioning lecture.", // source: slide 70
    scene: "patient",
    sceneCfg: { label: "SITTING AIR EMBOLISM" },
    metadata: { topic: "Lateral and Sitting", priority: "high" },
  },

  {
    id: "ta-w4-035",
    type: "mcq",
    prompt: "In the sitting position, how does the hydrostatic pressure difference affect brain perfusion, and what neck precaution is important?",
    setup: "",
    ans: [
      { t: "Monitoring at the heart understates how poorly the brain is perfused; avoid neck flexion to spare vessels", ok: true },
      { t: "The brain is actually overperfused in the sitting position, so the blood pressure can simply be ignored", ok: false },
      { t: "The flexion of the neck has no real consequences at all for a patient in the upright sitting position", ok: false },
      { t: "Monitoring at the heart overstates the brain perfusion only when the patient is in the supine position", ok: false },
    ],
    rationale: "In the sitting position there is a hydrostatic pressure difference between the heart and the head, so monitoring at the level of the heart may underestimate the degree to which the brain is underperfused. Over-flexion of the neck must be avoided because it can compress the jugular veins, cause biting or kinking of the endotracheal tube, and produce cervical spinal cord ischemia and injury. Source: NAS 560 Patient Positioning lecture.", // source: slide 71
    scene: "patient",
    sceneCfg: { label: "SITTING BRAIN PERFUSION" },
    metadata: { topic: "Lateral and Sitting", priority: "high" },
  },

  /* ================================================================
     Lithotomy, Trendelenburg, lower extremity nerves, eye injury, documentation
     ================================================================ */

  {
    id: "ta-w4-036",
    type: "mcq",
    prompt: "In the lithotomy position, what are the pressure points and the most common nerve injury?",
    setup: "",
    ans: [
      { t: "Pressure on the heels, malleolus, and knees; the common peroneal nerve is most often hurt, giving foot drop", ok: true },
      { t: "The most common injury here is a femoral nerve injury, and it presents to the team as a clear wrist drop", ok: false },
      { t: "There are no real pressure points in the lithotomy position, because the legs are elevated up off the bed", ok: false },
      { t: "The most common injury here is an ulnar nerve injury, and it presents to the team as a classic claw hand", ok: false },
    ],
    rationale: "In the lithotomy position the upper extremity pressure points are similar to supine, plus the heels, the lateral malleolus, and the lateral area of the knees. The most common injury is common peroneal nerve damage from improper positioning, usually evidenced by foot drop, because the nerve wraps laterally around the lateral condyle of the tibia and head of the fibula. The hands can also be caught in the hinges of the bed as the foot of the bed is raised or lowered. Source: NAS 560 Patient Positioning lecture.", // source: slide 75
    scene: "patient",
    sceneCfg: { label: "LITHOTOMY" },
    metadata: { topic: "Lithotomy and Trendelenburg", priority: "high" },
  },

  {
    id: "ta-w4-037",
    type: "mcq",
    prompt: "What are the effects and precautions of the Trendelenburg position?",
    setup: "",
    ans: [
      { t: "Shoulder braces threaten the plexus; it is restrictive, so keep PIP under forty, and it raises ICP and IOP", ok: true },
      { t: "The Trendelenburg position lowers the preload and it clearly reduces the patient intracranial pressure", ok: false },
      { t: "The shoulder braces used in this position fully eliminate any and all risk to the patient brachial plexus", ok: false },
      { t: "Trendelenburg improves the lung compliance and reliably raises the patient functional residual capacity", ok: false },
    ],
    rationale: "In the Trendelenburg position, shoulder braces used to keep the patient from sliding cephalad increase the risk of brachial plexus injuries, so bony prominences should still be padded. The position causes restrictive lung problems, so tidal volume and rate are adjusted to keep peak inspiratory pressure below 40. Increased preload can exacerbate CHF, and both intracranial and intraocular pressures rise. Source: NAS 560 Patient Positioning lecture.", // source: slide 81
    scene: "patient",
    sceneCfg: { label: "TRENDELENBURG" },
    metadata: { topic: "Lithotomy and Trendelenburg", priority: "high" },
  },

  {
    id: "ta-w4-038",
    type: "mcq",
    prompt: "How are the femoral and obturator nerves injured during positioning, and what deficits result?",
    setup: "",
    ans: [
      { t: "Hip flexion past ninety traps the femoral nerve, losing quadriceps and knee jerk; obturator hits adductors", ok: true },
      { t: "The femoral nerve injury causes a clear wrist drop along with a complete loss of the patient thumb abduction", ok: false },
      { t: "The obturator nerve controls foot dorsiflexion, so an injury to that nerve produces a classic foot drop", ok: false },
      { t: "Neither the femoral nerve nor the obturator nerve is ever affected at all by any flexion of the hip joint", ok: false },
    ],
    rationale: "The femoral nerve can be trapped and compressed under the inguinal ligament as a result of acute flexion of the thigh greater than 90 degrees, resulting in an abnormal gait, loss of quadriceps sensation, a decreased knee jerk, and loss of hip flexion and knee extension. The obturator nerve is injured by acute flexion greater than 90 degrees of the thigh to the groin, or by compression or stretching under the inguinal ligament, and causes weakness or paralysis of the adductors of the thigh. Source: NAS 560 Patient Positioning lecture.", // source: slide 84
    scene: "anatomy",
    sceneCfg: { label: "FEMORAL AND OBTURATOR NERVES" },
    metadata: { topic: "Lower Extremity Nerves", priority: "high" },
  },

  {
    id: "ta-w4-039",
    type: "mcq",
    prompt: "Which lower extremity nerve injuries and their presentations are correctly matched?",
    setup: "",
    ans: [
      { t: "Lateral femoral cutaneous gives thigh numbness, saphenous a medial loss, and sciatic paralysis below knee", ok: true },
      { t: "The lateral femoral cutaneous nerve controls the quadriceps, so its injury fully abolishes the knee jerk", ok: false },
      { t: "An injury to the saphenous nerve presents to the team as a clear and classic wrist drop of the patient hand", ok: false },
      { t: "The sciatic nerve simply cannot be injured at all by any kind of patient positioning during the surgery", ok: false },
    ],
    rationale: "The lateral femoral cutaneous nerve produces numbness and hyperesthesia of the anterior lateral thigh, so caution is needed with strap placement (and straps should be avoided over this nerve and the peroneal nerve). The saphenous nerve, when compressed, causes sensory loss to the medial portion of the thigh. The sciatic nerve is damaged when the thighs and legs are externally rotated or the knees extended, causing paralysis of potentially all muscles below the knee and even the hamstrings, with numbness over the lateral calf and foot. Source: NAS 560 Patient Positioning lecture.", // source: slide 86
    scene: "anatomy",
    sceneCfg: { label: "LOWER EXTREMITY NERVES" },
    metadata: { topic: "Lower Extremity Nerves", priority: "high" },
  },

  {
    id: "ta-w4-040",
    type: "mcq",
    prompt: "What is the most common perioperative eye injury, why does it occur, and how is it prevented?",
    setup: "",
    ans: [
      { t: "It is the most common eye injury, from the lost lid reflex and dry eye; prevent it by carefully taping lids", ok: true },
      { t: "Postoperative vision loss is actually far more common than any corneal abrasion ever is in real practice", ok: false },
      { t: "Corneal abrasion happens because tear production actually increases sharply under a general anesthetic", ok: false },
      { t: "Taping the eyelids closed sharply increases the risk of a corneal abrasion and so it must be fully avoided", ok: false },
    ],
    rationale: "Corneal abrasions are by far the most common type of perioperative ocular injury. During general anesthesia the natural lid reflex is abolished and tear production is decreased, which places the cornea at risk; symptoms most commonly manifest as a foreign body sensation in the eye on awakening, photophobia, blurry vision, or erythema. Precautionary measures include early and careful taping of the eyelids after induction, care with dangling objects, close observation as patients awaken, and ophthalmic ointment to add protection and combat dry eye. Source: NAS 560 Patient Positioning lecture.", // source: slide 89
    scene: "patient",
    sceneCfg: { label: "CORNEAL ABRASION" },
    metadata: { topic: "Eye Injury", priority: "high" },
  },

  {
    id: "ta-w4-041",
    type: "mcq",
    prompt: "What is the most cited cause of postoperative vision loss, and which perioperative factors increase its risk?",
    setup: "",
    ans: [
      { t: "Ischemic optic neuropathy is the main cause; risk rises with hypotension, blood loss, and the prone position", ok: true },
      { t: "A corneal abrasion is the cause of vision loss, and it carries no lasting visual deficit for the patient", ok: false },
      { t: "Postoperative vision loss is linked only to cardiac surgery and is never once linked to any spine surgery", ok: false },
      { t: "Hypertension and a very low fluid administration are the two main risk factors for the loss of the vision", ok: false },
    ],
    rationale: "Ischemic optic neuropathy, and to a lesser extent central retinal arterial occlusion from direct retinal pressure, are the conditions most cited as causes of postoperative vision loss. Perioperative factors that increase the risk of ischemic optic neuropathy include prolonged hypotension, long duration of surgery, large blood loss, large-volume crystalloid use, anemia or hemodilution, and increased intraocular or venous pressure from the prone position. The ASA Postoperative Visual Loss Registry found that most reported cases involved patients undergoing spine surgery. Source: NAS 560 Patient Positioning lecture.", // source: slide 93
    scene: "patient",
    sceneCfg: { label: "POSTOPERATIVE VISION LOSS" },
    metadata: { topic: "Eye Injury", priority: "high" },
  },

  {
    id: "ta-w4-042",
    type: "mcq",
    prompt: "What does the AANA standard require regarding documentation of positioning?",
    setup: "",
    ans: [
      { t: "Document the preoperative deficits, the padding used, the pressure points, and the postoperative exam", ok: true },
      { t: "Documentation of the patient position is fully optional and is only rarely relevant to any legal claim", ok: false },
      { t: "Only the surgeon ever documents the positioning, and the anesthesia provider never documents it at all", ok: false },
      { t: "Documentation is only ever needed in the case where a positioning injury has already clearly occurred", ok: false },
    ],
    rationale: "The AANA standard requires complete, accurate, and timely documentation of pertinent information. Applied to positioning, this means documenting preoperative history factors that may contribute to nerve injury, any preoperative neurological deficits, the patient response if awake during positioning, a description of the padding used and where, attention to pressure points and stretching possibilities, and postoperative neurological function. Most closed claims analyses showed little or no documentation of patient position, and breath sounds should be reassessed any time the position is changed. Source: NAS 560 Patient Positioning lecture.", // source: slide 95
    scene: "patient",
    sceneCfg: { label: "POSITIONING DOCUMENTATION" },
    metadata: { topic: "Documentation", priority: "high" },
  },

];

export const TA_WK4_METADATA = {
  nodeId: "ta-wk-4",
  courseId: "tech-advances-anesthesia",
  chapter: "Pardo 19; Nagelhout 23",
  title: "Positioning",
  totalQuestions: 42,
  questionTypes: { mcq: 42, multi: 0, short: 0 },
};
