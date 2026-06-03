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
      { t: "To facilitate surgery and optimize surgical anatomy, minimize the potential for pressure, stretch, or friction-induced injuries, facilitate and preserve access to the airway, and apply knowledge of potential positioning complications", ok: true },
      { t: "To deliberately place the patient in the most extreme position the joints allow, to improve exposure", ok: false },
      { t: "Only to keep the patient comfortable, since injury under anesthesia is not a concern", ok: false },
      { t: "To minimize the surgeon workload regardless of pressure or stretch on the patient", ok: false },
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
      { t: "Anesthesia renders the patient insensible to pain and prevents them from altering position, and muscle relaxants allow them to be placed in positions they normally could not assume and to be held there, so the anesthesia team, surgeon, and operating room nurse are responsible for proper positioning", ok: true },
      { t: "Because the patient can still feel and adjust position, the team has no real responsibility", ok: false },
      { t: "Because muscle relaxants make the patient resistant to any injury from positioning", ok: false },
      { t: "Because positioning is solely the surgeon responsibility and not the anesthesia team", ok: false },
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
      { t: "Nerve damage, tissue damage, and inadequate tissue perfusion from occlusion of the major arterial supply, the arterial capillary supply, or venous capillary drainage", ok: true },
      { t: "Only nerve damage; tissue perfusion is never affected by positioning", ok: false },
      { t: "Only allergic reactions to the padding materials", ok: false },
      { t: "Only airway loss, with no vascular or nerve consequences", ok: false },
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
      { t: "In the ASA closed claims the most frequent claimed injury was ulnar neuropathy, followed by brachial plexus and then lumbosacral injuries, while in the AANA analysis brachial plexus injuries were most common, followed by ulnar nerve damage", ok: true },
      { t: "Both databases show femoral nerve injury as by far the most common", ok: false },
      { t: "Both databases show that positioning injuries essentially never lead to claims", ok: false },
      { t: "The ASA data show brachial plexus first while AANA shows lumbosacral first, with ulnar injuries unreported", ok: false },
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
      { t: "A thorough preoperative history, correct positioning, padding of pressure points, reassessing position throughout the case, and proper documentation; injuries are more common in longer cases, generally those over 2 hours", ok: true },
      { t: "Only padding the heels; history and reassessment do not matter", ok: false },
      { t: "Nerve injuries are unrelated to case duration", ok: false },
      { t: "Documentation has no role in prevention and is never needed", ok: false },
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
      { t: "Extremes of weight (both obese and thin), malnourishment, and preexisting neuropathies such as those from diabetes, hepatic disease, low blood flow states (CHF, arterial or venous insufficiency), carpal tunnel syndrome, and limited joint mobility", ok: true },
      { t: "Only young, healthy, normal-weight patients are at risk", ok: false },
      { t: "Body weight and nutrition have no effect on nerve injury risk", ok: false },
      { t: "Only patients having eye surgery are at risk for any nerve injury", ok: false },
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
      { t: "Compression or stretching of the intraneural vasa nervorum (the small arteries supplying the nerve) produces nerve ischemia; this is more likely when a nerve has a long superficial course between two fixed points, and a stretched nerve is especially vulnerable to ischemic compression", ok: true },
      { t: "Only by direct laceration of the nerve, never by ischemia", ok: false },
      { t: "By increasing blood flow to the nerve, which causes swelling and injury", ok: false },
      { t: "Only deep nerves with no fixed points are at risk", ok: false },
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
      { t: "Compression over a small concentrated area (such as the heels and occiput) and compression of long duration; more than about 20 minutes is a general rule, since that is roughly how long it takes a compressed extremity to go numb", ok: true },
      { t: "Compression spread over a large padded area for a short time", ok: false },
      { t: "Compression lasting less than 1 second is the main danger", ok: false },
      { t: "Only compression of deep visceral organs, never of the heels or occiput", ok: false },
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
      { t: "The occiput, scapula, elbows, hips, sacrum, heels, knees, and outer ears", ok: true },
      { t: "Only the abdomen and chest, since bony points are not at risk", ok: false },
      { t: "Only the fingertips and the tip of the nose", ok: false },
      { t: "Pressure points do not vary with position and never need padding", ok: false },
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
      { t: "Gentle flexion of the hips and knees to avoid stretching the femoral nerve, abduction of the arms to less than 90 degrees, and maintaining the cervical spine in a neutral position", ok: true },
      { t: "Full extension of the hips and knees with arm abduction beyond 90 degrees", ok: false },
      { t: "Hyperflexion of the neck to one side for the whole case", ok: false },
      { t: "Maximal arm abduction to better expose the axilla", ok: false },
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
      { t: "The anesthesia provider is responsible for the head and endotracheal tube, calls when the move occurs (counting so the team moves together), disconnects from the ventilator during the position change while holding the tube, and rechecks breath sounds afterward, especially after moving to lateral or prone", ok: true },
      { t: "The surgeon controls the head and tube while anesthesia simply watches", ok: false },
      { t: "The ventilator should stay connected and pulling on the tube during the move", ok: false },
      { t: "Breath sounds never need rechecking after a position change", ok: false },
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
      { t: "It is more likely related to the duration of the procedure, the use of muscle relaxants, and loss of lumbar lordosis from muscle relaxation and stretching of the intervertebral ligaments; it is attenuated by positioning with the knees slightly flexed and supported by a pillow, and by not crossing the feet", ok: true },
      { t: "It is always caused by the regional anesthetic needle and never by positioning", ok: false },
      { t: "It is prevented by fully extending the spine and crossing the ankles", ok: false },
      { t: "It has no known relationship to procedure duration or muscle relaxants", ok: false },
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
      { t: "Pad the heels, elbows, knees, spinal column, and occiput; an unpadded occiput can lead to alopecia, and a pillow under the knees prevents hyperextension of the leg and knee that can stretch the tibial and peroneal nerves while taking pressure off the lumbar area", ok: true },
      { t: "No padding is needed in the supine position because pressure is evenly distributed", ok: false },
      { t: "The occiput should be left unpadded to monitor the scalp", ok: false },
      { t: "A pillow under the knees should be avoided because it harms the lumbar spine", ok: false },
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
      { t: "It decreases functional residual capacity and increases preload; a patient with CHF or respiratory dysfunction may not tolerate lying flat, so it is reasonable to start with the head of the bed up and lay them flat after induction", ok: true },
      { t: "It increases functional residual capacity and decreases preload in everyone", ok: false },
      { t: "It has no effect on preload or lung volumes", ok: false },
      { t: "Every patient tolerates lying flat equally well regardless of CHF", ok: false },
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
      { t: "They may be flexed and secured over the chest, tucked at the sides, or abducted on padded arm boards; when on arm boards they must be abducted to less than 90 degrees", ok: true },
      { t: "They must always be abducted to at least 120 degrees for access", ok: false },
      { t: "They should hang off the side of the bed unpadded", ok: false },
      { t: "Arm position never matters in the supine patient", ok: false },
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
      { t: "It travels in the ulnar groove between the medial epicondyle of the humerus and the olecranon of the ulna; with the arm abducted, supination places the least pressure on the ulnar nerve and pronation the most, and pressure increases with greater abduction", ok: true },
      { t: "It runs through the carpal tunnel at the wrist, and pronation relieves all pressure on it", ok: false },
      { t: "Pronation places the least pressure on the ulnar nerve and supination the most", ok: false },
      { t: "Forearm rotation has no effect on pressure under the ulnar nerve", ok: false },
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
      { t: "There is potential for compression of the ulnar nerve, so the area must be padded well; significant flexion of the hand can lead to carpal tunnel syndrome, so the hands should be kept in a neutral position", ok: true },
      { t: "Tucked arms carry no risk to the ulnar nerve and need no padding", ok: false },
      { t: "The hands should be maximally flexed to fit at the sides", ok: false },
      { t: "Tucking the arms protects against all nerve injury", ok: false },
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
      { t: "Improper arm board depth or compression against the posterior surface of the humerus can injure the radial nerve (and stretch the brachial plexus); radial nerve injury presents as wrist drop, inability to extend the metacarpal joints, and inability to abduct the thumb", ok: true },
      { t: "Radial nerve injury presents as a claw hand with loss of thumb adduction", ok: false },
      { t: "The radial nerve cannot be injured by an arm board", ok: false },
      { t: "Radial nerve injury causes only foot drop", ok: false },
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
      { t: "A brachial plexus injury causes shoulder pain with tenderness over the supraclavicular area 1 to several days after surgery, and if the entire plexus is involved the whole limb is numb and flaccid; Erb's paralysis is injury of the upper roots (C5 to C7), producing internal rotation of the arm, extension of the forearm, and pronation of the hand", ok: true },
      { t: "Erb's paralysis is injury of the lower roots producing loss of finger flexion only", ok: false },
      { t: "A brachial plexus injury causes only an isolated foot drop", ok: false },
      { t: "A brachial plexus injury never involves the supraclavicular area", ok: false },
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
      { t: "Klumpke paralysis is injury of the lower roots of the brachial plexus, causing loss of finger flexion, paralysis of the hand, and sometimes Horner's syndrome; median nerve injury causes inability to abduct the thumb, inability to flex the distal phalanx of the second finger, and lost sensation over the lateral three and a half fingers", ok: true },
      { t: "Klumpke paralysis involves the upper roots and spares the hand", ok: false },
      { t: "Median nerve injury causes wrist drop and inability to extend the wrist", ok: false },
      { t: "Median nerve injury causes only a claw hand", ok: false },
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
      { t: "Reduced ability to grip with inability to adduct the thumb, decreased sensation over the medial one and a half fingers, and in severe cases atrophy of the hand muscles producing a claw hand", ok: true },
      { t: "Wrist drop with inability to extend the wrist and fingers", ok: false },
      { t: "Foot drop with loss of sensation to the sole of the foot", ok: false },
      { t: "Loss of sensation over the lateral three and a half fingers only", ok: false },
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
      { t: "It allows slight flexion of the hips and knees, causes less respiratory compromise, and produces minimal cardiovascular compromise", ok: true },
      { t: "It causes severe respiratory compromise and is contraindicated for shoulder surgery", ok: false },
      { t: "It requires full extension of the hips and knees", ok: false },
      { t: "It eliminates all cardiovascular and respiratory effects of anesthesia", ok: false },
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
      { t: "The arm blood pressure does not reflect the true cerebral perfusion pressure; because the head sits above the heart, when the arm reading is normal the cerebral perfusion pressure can be much less, and a blood pressure measured in the leg represents cerebral perfusion even less well", ok: true },
      { t: "The arm reading exactly equals the cerebral perfusion pressure at all times", ok: false },
      { t: "The brain sits below the heart in the beach chair position, so cerebral pressure is higher", ok: false },
      { t: "A leg blood pressure best reflects cerebral perfusion in this position", ok: false },
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
      { t: "It is used for posterior spine, skull, buttocks, perirectal, and lower extremity surgery; its pressure points include the nose, eyes, mouth, chin, knees, feet, hips, breasts, and genitals", ok: true },
      { t: "It is used only for anterior abdominal surgery, with pressure points only at the heels", ok: false },
      { t: "It has no pressure points because the body weight is evenly distributed", ok: false },
      { t: "Its only pressure point is the occiput", ok: false },
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
      { t: "Induction is generally on the stretcher in the supine position; the patient is moved to the side of the bed, the arm is placed along the body, and the entire body is rolled as one unit with someone on the opposite side to catch the patient, while the head is kept neutral and the patient stays intubated", ok: true },
      { t: "The patient is flipped quickly by the head and feet only, while still on the stretcher", ok: false },
      { t: "The endotracheal tube is removed before turning the patient prone", ok: false },
      { t: "The head is fully flexed during the turn to protect the airway", ok: false },
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
      { t: "Padding must avoid the eyes because pressure on the globe can cause blindness from retinal artery thrombosis; goggles are not recommended because of their rigid edges, and lubricating ointment with tape is preferred", ok: true },
      { t: "Firm pressure should be applied directly over the eyes to keep them closed", ok: false },
      { t: "Rigid goggles pressed onto the orbit are the recommended protection", ok: false },
      { t: "Eye protection is unnecessary in the prone position", ok: false },
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
      { t: "The abdomen should hang freely, and the weight-bearing areas should be the iliac crests and the lateral thoraces", ok: true },
      { t: "The abdomen should bear the full body weight against the table", ok: false },
      { t: "The weight should rest on the sternum and the epigastrium", ok: false },
      { t: "The patient should lie flat with the abdomen compressed against the mattress", ok: false },
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
      { t: "Abdominal contents can compress the vena cava and decrease preload, and increased perivertebral pressure can increase surgical bleeding; chest rolls or frames reduce thoracic compression, and although the weight of the thorax and abdomen can increase the work of breathing, letting the abdomen hang free can actually improve functional residual capacity", ok: true },
      { t: "The prone position always increases preload and never affects bleeding", ok: false },
      { t: "Chest rolls increase thoracic compression and should be avoided", ok: false },
      { t: "The prone position has no effect on ventilation or venous return", ok: false },
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
      { t: "It can decrease surgical bleeding in the spine by reducing venous pooling pressure, but it increases the risk of venous air embolism, especially in a spontaneously breathing patient", ok: true },
      { t: "It increases spinal bleeding and eliminates any risk of venous air embolism", ok: false },
      { t: "It has no effect on bleeding or air embolism risk", ok: false },
      { t: "It decreases venous air embolism risk in spontaneously breathing patients", ok: false },
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
      { t: "The decubitus side is the side that is down, in contact with the table; the dependent pressure points include the lateral malleolus of the dependent ankle, the lateral aspect of the dependent knee, and the hip of the dependent leg", ok: true },
      { t: "The decubitus side is the side that is up, away from the table", ok: false },
      { t: "There are no dependent pressure points in the lateral position", ok: false },
      { t: "Only the non-dependent ankle and knee are at risk", ok: false },
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
      { t: "The dependent (down) lung receives most of the blood flow while the non-dependent (up) lung receives most of the ventilation, producing a V/Q mismatch that can widen the PaCO2 to ETCO2 gradient and cause hypoxemia", ok: true },
      { t: "The dependent lung receives most of both ventilation and perfusion, so V and Q stay matched", ok: false },
      { t: "The non-dependent lung receives most of the blood flow and the dependent lung most of the ventilation", ok: false },
      { t: "Ventilation and perfusion are perfectly matched in the lateral position", ok: false },
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
      { t: "It is placed just below the axilla to support the upper rib cage and decompress the axillary neurovascular bundle and the head of the humerus; correct placement leaves an open space between the axilla and the roll with a palpable radial pulse, whereas a roll placed too high can compress the brachial plexus and artery", ok: true },
      { t: "It is placed directly in the axilla to press on the neurovascular bundle", ok: false },
      { t: "It is placed under the head, not near the axilla", ok: false },
      { t: "A roll placed too high relieves pressure on the brachial plexus", ok: false },
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
      { t: "Both arms are abducted to less than 90 degrees, with the dependent arm protected as for the ulnar nerve and the upper arm padded on pillows or an arm board; the head is kept neutral, usually needing a pillow or blanket under the neck, and the dependent ear and eye must be checked for pressure", ok: true },
      { t: "The dependent ear and eye need no checking because the table protects them", ok: false },
      { t: "The arms should be abducted beyond 120 degrees in the lateral position", ok: false },
      { t: "The head should be allowed to hang off the edge of the table", ok: false },
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
      { t: "Detection methods include a precordial Doppler listening for a mill wheel murmur, capnography, and transesophageal echocardiography; intervention includes withdrawing air from a central venous line (often not fast enough) plus supportive care, and a patent foramen ovale can allow a right to left shunt producing systemic air emboli", ok: true },
      { t: "Venous air embolism cannot be detected by any monitor and has no treatment", ok: false },
      { t: "It is detected only by a chest X-ray taken after surgery", ok: false },
      { t: "It occurs only when the surgical field is below the right atrium", ok: false },
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
      { t: "Because of the hydrostatic difference between the heart and the head, monitoring at the level of the heart may underestimate how much the brain is underperfused; over-flexion of the neck must be avoided because it can compress the jugular veins, kink or cause biting of the endotracheal tube, and produce cervical spinal cord ischemia", ok: true },
      { t: "The brain is overperfused in the sitting position, so blood pressure can be ignored", ok: false },
      { t: "Neck flexion has no consequences in the sitting position", ok: false },
      { t: "Monitoring at the heart overestimates brain perfusion only in the supine position", ok: false },
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
      { t: "The pressure points include the heels, the lateral malleolus, and the lateral area of the knees (with the upper extremity similar to supine); the most common injury is common peroneal nerve damage from improper positioning, typically presenting as foot drop, and the hands can be caught in the bed hinges as the foot of the bed is raised or lowered", ok: true },
      { t: "The most common injury is femoral nerve damage presenting as wrist drop", ok: false },
      { t: "There are no pressure points in lithotomy because the legs are elevated", ok: false },
      { t: "The most common injury is ulnar nerve damage presenting as a claw hand", ok: false },
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
      { t: "Shoulder braces used to prevent cephalad sliding increase the risk of brachial plexus injury; the position causes restrictive lung problems, so tidal volume and rate are adjusted to keep peak inspiratory pressure below 40, and increased preload can exacerbate CHF while intracranial and intraocular pressures rise", ok: true },
      { t: "Trendelenburg decreases preload and lowers intracranial pressure", ok: false },
      { t: "Shoulder braces eliminate any risk to the brachial plexus", ok: false },
      { t: "Trendelenburg improves lung compliance and raises functional residual capacity", ok: false },
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
      { t: "Acute flexion of the thigh greater than 90 degrees can trap and compress the femoral nerve under the inguinal ligament, causing an abnormal gait, loss of quadriceps sensation, a decreased knee jerk, and loss of hip flexion and knee extension; the obturator nerve, injured by the same acute flexion or compression under the inguinal ligament, causes weakness or paralysis of the thigh adductors", ok: true },
      { t: "The femoral nerve injury causes wrist drop and loss of thumb abduction", ok: false },
      { t: "The obturator nerve controls foot dorsiflexion, so its injury causes foot drop", ok: false },
      { t: "Neither nerve is affected by hip flexion", ok: false },
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
      { t: "The lateral femoral cutaneous nerve causes numbness and hyperesthesia of the anterolateral thigh (so caution is needed with strap placement); the saphenous nerve causes sensory loss to the medial thigh; and the sciatic nerve, injured when the thighs and legs are externally rotated or the knees extended, causes paralysis of muscles below the knee with numbness over the lateral calf and foot", ok: true },
      { t: "The lateral femoral cutaneous nerve controls the quadriceps, so its injury abolishes the knee jerk", ok: false },
      { t: "The saphenous nerve injury presents as wrist drop", ok: false },
      { t: "The sciatic nerve cannot be injured by positioning", ok: false },
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
      { t: "Corneal abrasion is by far the most common perioperative ocular injury; under general anesthesia the natural lid reflex is abolished and tear production decreases, placing the cornea at risk, and it presents as a foreign body sensation, photophobia, blurry vision, or erythema on waking; it is prevented by early careful taping of the eyelids and ophthalmic ointment", ok: true },
      { t: "Postoperative vision loss is far more common than corneal abrasion", ok: false },
      { t: "Corneal abrasion occurs because tear production increases under anesthesia", ok: false },
      { t: "Taping the eyelids increases the risk of corneal abrasion and should be avoided", ok: false },
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
      { t: "Ischemic optic neuropathy (and to a lesser extent central retinal artery occlusion from direct retinal pressure) is the most cited cause of postoperative vision loss; risk factors include prolonged hypotension, long surgery, large blood loss, large-volume crystalloid use, anemia or hemodilution, and increased intraocular or venous pressure from the prone position, and the ASA registry found most reported cases involved spine surgery", ok: true },
      { t: "Corneal abrasion is the cause of postoperative vision loss and carries no lasting deficit", ok: false },
      { t: "Postoperative vision loss is associated only with cardiac surgery and never spine surgery", ok: false },
      { t: "Hypertension and low fluid administration are the main risk factors for vision loss", ok: false },
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
      { t: "There shall be complete, accurate, and timely documentation, including preoperative history factors and any neurological deficits, the patient response if awake during positioning, a description of padding used and where, attention to pressure points, and postoperative neurological function; closed claims often showed little or no documentation of position", ok: true },
      { t: "Documentation of position is optional and rarely relevant to claims", ok: false },
      { t: "Only the surgeon documents positioning, never the anesthesia provider", ok: false },
      { t: "Documentation is needed only if an injury has already occurred", ok: false },
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
