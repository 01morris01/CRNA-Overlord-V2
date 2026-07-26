/**
 * REGIONAL NERVE BLOCKS: structured study data.
 *
 * EDUCATIONAL reference content, summarized in original wording from
 * Hadzic's Peripheral Nerve Blocks and Anatomy for Ultrasound-Guided
 * Regional Anesthesia (3rd ed, NYSORA / McGraw Hill, 2022). This is
 * study material, like the textbook itself; it is not live, patient
 * specific, intra-procedure guidance.
 *
 * Volumes are stated as the ranges the source gives. Where the source
 * itself carries a range or internal tension, both figures are reported
 * rather than inventing a single number.
 *
 * Each block object:
 *   id, name, icon, group, regionLabel, chapter, tagline,
 *   indication, anatomy, ultrasound, technique, volume,
 *   pearls[], source, liveLabeling
 *
 * liveLabeling describes whether a live ultrasound structure labeling
 * model (PLEXUS STUDIO) exists for the region. Supraclavicular has the
 * default live model (nerve_needle_unet.onnx, supraclavicular data). The
 * femoral and popliteal-sciatic blocks now also flag available: true,
 * pointing to peripheral-nerve models (Nerve-UTP) exercised in the Plexus
 * Studio Nerve Model Lab on real Nerve-UTP still frames; each of those
 * models passed a verified abstention gate that stays silent on noise and
 * blank frames (ungated models that hallucinate were NOT shipped). The
 * sciatic model carries an honest note that its data is a proximal window,
 * not the popliteal fossa view. The ulnar and median models also passed but
 * have no block entry here, so they are reachable only via the studio model
 * picker. Every other block honestly reports { available: false }.
 */

export const BLOCK_GROUPS = [
  { id: 'upper',   label: 'Upper Extremity' },
  { id: 'lower',   label: 'Lower Extremity' },
  { id: 'truncal', label: 'Truncal / Abdominal Wall' },
];

export const REGIONAL_BLOCKS = [
  {
    id: 'interscalene',
    name: 'Interscalene Block',
    icon: '💡',
    group: 'upper',
    regionLabel: 'Brachial plexus, root/trunk level',
    chapter: 13,
    tagline: 'Brachial plexus blockade in the interscalene groove for shoulder, upper arm, and clavicle surgery.',
    indication:
      'Anesthesia and analgesia for shoulder, upper arm, and clavicle surgery. It reliably covers the shoulder, upper arm, and the lateral two thirds of the clavicle. The inferior trunk (C8 to T1, the ulnar territory) is usually spared unless the injection reaches the supraclavicular level.',
    anatomy:
      'The target is the brachial plexus at the root and trunk level, specifically the superior and middle trunks lying in the groove between the anterior and middle scalene muscles, deep to sternocleidomastoid and the prevertebral (deep cervical) fascia.\nStructures to respect include the carotid artery and internal jugular vein (medial and anterior), the vertebral artery, the phrenic nerve (on the anterior surface of the anterior scalene), and the dorsal scapular and long thoracic nerves (coursing through the middle scalene). The C6 transverse process helps orient the scan.',
    ultrasound:
      'Use a high frequency linear probe with the patient semi sitting and head turned away. One reliable method starts in a sagittal view at the supraclavicular fossa to find the subclavian artery, sees the plexus posterolateral and superficial to it, then traces it cranially into the interscalene groove; an alternative is a transverse view on the lateral neck near the cricoid, finding the carotid deep to sternocleidomastoid.\nAt the interscalene level the plexus appears as round hypoechoic structures stacked between the anterior and middle scalene muscles at roughly 1 to 3 cm depth. This is the classic "stoplight" or "traffic light" string of hypoechoic nodules; C6 often splits into two bundles. Run color Doppler first, since the neck is highly vascular.',
    technique:
      'Sagittal or transverse probe over the lateral neck. The needle is inserted in plane, typically posterior to anterior, and directed between the plexus elements rather than into a single splitting root, to avoid nerve injury.\nAfter negative aspiration, 1 to 2 mL is injected to confirm spread within the scalene space, then the block is completed. Aim to deposit between C5 and C6 (between the upper and middle trunks). Never inject against high resistance or above roughly 15 psi opening pressure.',
    volume: 'Hadzic states 5 to 15 mL (the technique algorithm completes with 7 to 15 mL).',
    pearls: [
      'Ipsilateral phrenic nerve block with hemidiaphragmatic palsy is the most common adverse effect; lower volumes (under 10 mL), dilute local anesthetic, and selective superior trunk targeting reduce but do not eliminate it, so use caution in patients with respiratory compromise.',
      'Reported complications include Horner syndrome, recurrent laryngeal nerve block (hoarseness, risky with an existing vocal cord palsy), and inadvertent epidural or spinal spread.',
      'Use color Doppler before needling because of the dense vascular anatomy of the neck.',
      'Injury to the phrenic, dorsal scapular, and long thoracic nerves has been described; keep the needle path between neural elements.',
    ],
    source: 'Summarized from Hadzic, Peripheral Nerve Blocks (3rd ed), Chapter 13, Interscalene Brachial Plexus Block.',
    liveLabeling: { available: false },
  },
  {
    id: 'supraclavicular',
    name: 'Supraclavicular Block',
    icon: '🍇',
    group: 'upper',
    regionLabel: 'Brachial plexus, trunk/division level',
    chapter: 14,
    tagline: 'The "spinal of the arm": compact trunk and division blockade above the first rib for the whole upper limb.',
    indication:
      'Anesthesia and analgesia for the shoulder, arm, elbow, forearm, and hand. It anesthetizes essentially the entire upper extremity (provided the suprascapular nerve is within the spread), giving a fast, consistent, complete block of arm, forearm, and hand. The intercostobrachial nerve (T2, skin of the medial upper arm) is not covered.',
    anatomy:
      'The target is the brachial plexus at the level of the trunks and divisions as they cross the first rib alongside the subclavian artery. The plexus sits posterolateral and superficial to the subclavian artery; the first rib is a bony backstop deep to it, and the pleura and lung dome lie caudal and deep.\nThe suprascapular and transverse cervical arteries (thyrocervical trunk branches) often course among the plexus elements. The upper trunk arises from C5 to C6, the middle trunk continues C7, and the lower trunk (C8 to T1) lies close to the artery and rib.',
    ultrasound:
      'High frequency linear probe in a sagittal oblique plane just proximal and parallel to the clavicle. Obtain a clear cross section showing the subclavian artery, the first rib, and the pleura underneath.\nThe subclavian artery is an anechoic, round, pulsating structure; the plexus sits posterolateral and superficial to it as a compact group of hypoechoic round nodules wrapped in thin fascial sheaths, the classic "cluster of grapes" (honeycomb) appearance. The first rib is a hyperechoic line casting an acoustic shadow, while pleura is seen sliding with respiration on either side of the rib. Use color Doppler to catch crossing vessels before needling.',
    technique:
      'Sagittal oblique probe, patient supine or semi sitting with head turned away and shoulder relaxed. The needle is advanced in plane, posterior to anterior, toward the plexus.\nThe source describes two injections: the first (about 10 mL) between the first rib and the lower trunk (the "corner pocket"), then the needle is redirected more superficially for a second injection (about 10 mL) between the divisions of the upper and middle trunks. The source cautions against "intracluster" injection because of higher intraneural risk; keep the rib beneath the needle as a safety backstop.',
    volume: 'Hadzic states 20 mL total (two 10 mL injections). A low volume selective upper trunk option uses about 5 mL.',
    pearls: [
      'Pneumothorax is the signature risk, uncommon but potentially life threatening and sometimes delayed after discharge, so keep the needle tip in view and use the rib as a backstop.',
      'Phrenic nerve block risk is lower than with interscalene but cannot be reliably avoided; choose infraclavicular instead if the patient cannot tolerate a 20 to 30% drop in respiratory function.',
      'Routinely use color Doppler, aspirate every few milliliters, and monitor injection pressure.',
      'Suprascapular and long thoracic nerve injuries have been reported.',
    ],
    source: 'Summarized from Hadzic, Peripheral Nerve Blocks (3rd ed), Chapter 14, Supraclavicular Brachial Plexus Block.',
    liveLabeling: {
      available: true,
      model: null,
      note: 'Validated for supraclavicular brachial plexus. Opens the live loop, which runs the supraclavicular model on recorded clips and volunteer video.',
    },
  },
  {
    id: 'infraclavicular',
    name: 'Infraclavicular Block',
    icon: '🦴',
    group: 'upper',
    regionLabel: 'Brachial plexus, cord level',
    chapter: 15,
    tagline: 'Cord level blockade around the axillary artery; phrenic sparing and catheter friendly.',
    indication:
      'Surgery and analgesia for the arm, elbow, forearm, and hand (procedures below the shoulder). It suits painful fractures or arm immobilization and catheter placement, since chest wall musculature stabilizes the catheter. Shoulder analgesia and the intercostobrachial nerve (T2) are not covered by the basic block.',
    anatomy:
      'The target is the brachial plexus at the lateral infraclavicular fossa, where the three cords (lateral, posterior, medial) surround the axillary artery deep to pectoralis major and minor.\nBoundaries are pectoralis major and minor anteriorly, serratus anterior and ribs medially, clavicle and coracoid process superiorly, and humerus laterally. Key neighbors are the axillary artery (pulsating, central), the axillary vein (compressible, medial to the artery), and the ribs and pleura lying deeper and medial. The cords are named for position but vary; the musculocutaneous nerve may leave the plexus at or above the coracoid in about half of patients.',
    ultrasound:
      'High frequency linear probe in a parasagittal orientation medial to the coracoid process and caudal to the clavicle. Identify pectoralis major and minor, then the axillary artery in cross section deep to pectoralis minor, typically at 3 to 5 cm depth.\nThe artery is anechoic and round; the axillary vein is a compressible hypoechoic structure medial to it; the three cords appear as rounded hyperechoic (honeycomb) structures lateral, posterior, and medial to the artery. Abducting the arm to 90 degrees brings the bundle more superficial and improves imaging. Map vessels with color Doppler first.',
    technique:
      'Parasagittal probe, patient supine with head turned away and arm abducted 90 degrees. The needle is inserted in plane, cephalad to caudad, passing through pectoralis major and minor toward the posterior aspect of the axillary artery; a loss of resistance is often felt as it pierces the fascia.\nAfter careful aspiration and avoiding high opening pressure, 1 to 2 mL confirms tip position, aiming for a U shaped spread around the artery reaching all three cords. Fascial septa may block circumferential spread, so multiple needle adjustments and injections may be needed.',
    volume: 'Hadzic states 20 to 30 mL (the sagittal paracoracoid approach uses the higher end, 25 to 30 mL).',
    pearls: [
      'A major advantage is freedom from the respiratory (phrenic and hemidiaphragmatic) side effects of interscalene and supraclavicular blocks, making it a good choice when phrenic sparing matters.',
      'Pneumothorax is uncommon but theoretically possible given pleural proximity; axillary artery injury and dissection have also been described.',
      'Deep plexus location in obese or heavily muscled patients can make imaging difficult, favoring a more proximal or distal approach.',
      'If nerve stimulation is used, a lateral cord response gives elbow or finger flexion and a posterior cord response gives finger and wrist extension.',
    ],
    source: 'Summarized from Hadzic, Peripheral Nerve Blocks (3rd ed), Chapter 15, Infraclavicular Brachial Plexus Block.',
    liveLabeling: { available: false },
  },
  {
    id: 'axillary',
    name: 'Axillary Block',
    icon: '💪',
    group: 'upper',
    regionLabel: 'Brachial plexus, terminal branches',
    chapter: 17,
    tagline: 'Terminal branch blockade around the axillary artery; superficial and free of pneumothorax risk.',
    indication:
      'Surgery of the elbow, forearm, and hand. It blocks the terminal branches of the brachial plexus at the axilla, producing anesthesia of the upper limb from about mid arm down to the hand.',
    anatomy:
      'The target is the cluster of terminal nerves around the axillary artery inside a shared neurovascular sheath: the median nerve (typically anterior and lateral to the artery), the ulnar nerve (medial), and the radial nerve (posterior to the artery, near the conjoint tendon).\nThe bundle sits superficially in a triangular space bounded by the conjoint tendon (teres major and latissimus dorsi) posteriorly, biceps and coracobrachialis laterally, and skin and fascia anteromedially. One or more axillary veins run medially. The musculocutaneous nerve departs the sheath proximally and lies separately in the plane between biceps and coracobrachialis.',
    ultrasound:
      'Place a high frequency linear probe perpendicular to the arm axis over the medial proximal arm, between the anterior axillary fold and the biceps. Center the round, pulsatile, anechoic axillary artery; veins sit medially and collapse with probe pressure.\nThe three main nerves appear as round bundles around the artery, and the conjoint tendon shows as a bright fascial plane deep to the vessels. The classic sign is the musculocutaneous nerve: a hypoechoic oval (often with a bright rim) lying in the fascia between biceps and coracobrachialis. Note that acoustic enhancement deep to the artery is commonly mistaken for the radial nerve.',
    technique:
      'In plane approach, needle entering anterolateral to posterior. A common sequence places the first deposit posterior to the artery (this lifts the plexus and improves visualization), then withdraws and redirects superficial to the artery for the median and ulnar nerves, and finally into the interfascial plane for a separate musculocutaneous injection.\nWith a 20 mL total, the source divides it roughly as 7 to 10 mL deep to the artery, 7 to 10 mL superficial, and 5 mL in the plane for the musculocutaneous nerve. Individual nerves can be blocked with 3 to 5 mL each. Frequent aspiration and slow injection are essential given the many nearby veins.',
    volume: 'Hadzic states 15 to 20 mL total (3 to 5 mL per nerve; effective blocks reported with under 2 mL per nerve).',
    pearls: [
      'The musculocutaneous nerve leaves the sheath proximally and varies anatomically, so it very often needs a separate injection; missing it is a classic cause of a patchy block.',
      'The block does not cover the axillary nerve, so the shoulder and skin over the deltoid remain unanesthetized.',
      'The medial upper arm skin (intercostobrachial nerve, T2) is not covered and may need a subcutaneous ring infiltration just distal to the axilla.',
      'The sheath frequently contains septa that divide it into compartments, which can require separate injections; if no spread is seen on screen, halt, since the tip may be intravascular (risk of local anesthetic systemic toxicity).',
    ],
    source: 'Summarized from Hadzic, Peripheral Nerve Blocks (3rd ed), Chapter 17, Axillary Brachial Plexus Block.',
    liveLabeling: { available: false },
  },
  {
    id: 'femoral',
    name: 'Femoral Nerve Block',
    icon: '🦵',
    group: 'lower',
    regionLabel: 'Femoral nerve, L2 to L4',
    chapter: 24,
    tagline: 'The most powerful analgesic for major knee surgery; hyperechoic wedge lateral to the femoral artery.',
    indication:
      'Anesthesia and analgesia after surgery of the hip, femur, anterior thigh, knee, and patella. It is described as the single most powerful analgesic method for major knee surgery and is widely used for hip fracture pain and to position patients for spinal anesthesia.',
    anatomy:
      'The femoral nerve arises from the dorsal divisions of the ventral rami of L2 to L4. It exits the psoas, runs deep to the fascia iliaca, and passes under the inguinal ligament into the anterior thigh, lying lateral to the femoral artery and vein and anterior to iliopsoas.\nIn the femoral triangle it divides into muscular branches (iliacus, psoas, pectineus, the quadriceps group, and sartorius), cutaneous branches to the anterior thigh and knee, and the saphenous nerve, which continues with the femoral artery down the medial leg. Nearby layers are the fascia lata (superficial) and the fascia iliaca (the layer directly over the nerve).',
    ultrasound:
      'Place a high frequency linear probe transversely over the inguinal (femoral) crease. Identify the femoral artery as a round, pulsatile, anechoic vessel with the compressible femoral vein medial to it.\nLateral to the artery, the femoral nerve appears as a flattened, hyperechoic triangular or oval wedge of fascicles, deep to the fascia iliaca and superficial to iliopsoas, at roughly 2 to 4 cm depth. Scan so only a single artery is seen: if the profunda femoris bifurcation is visible, slide proximally so the injection is above the take off and captures the whole nerve trunk.',
    technique:
      'In plane approach, needle advanced lateral to medial toward the lateral edge of the nerve, aiming to pierce the fascia iliaca and place the tip in the space between the fascial layers that contain the nerve.\nThe source teaches the RAPT checklist before injecting (motor Response absent at 0.5 mA, negative Aspiration, low opening Pressure under 15 psi, controlled Total volume). Inject 1 to 2 mL first to confirm spread and watch the nerve lift off the underlying muscle, then complete the block. Circumferential spread around the nerve is not necessary for success.',
    volume: 'Hadzic states 10 to 20 mL (the text notes 10 to 15 mL is usually sufficient; the flowchart completes with 10 to 20 mL). Dilute concentrations (0.125 to 0.25%) reduce but do not eliminate quadriceps weakness.',
    pearls: [
      'The block invariably causes quadriceps weakness, so use fall prevention protocols and beware of the fall risk.',
      'Circumferential spread is not required; deposit deep to the fascia iliaca, and medial displacement of the nerve confirms correct placement.',
      'Use triple monitoring (ultrasound, nerve stimulation, opening injection pressure), since femoral nerve injury, though less common than upper limb injury, carries significant disability.',
      'The femoral block does not cover posterior or lateral leg territory; a separate sciatic or lateral femoral cutaneous block is needed there.',
    ],
    source: 'Summarized from Hadzic, Peripheral Nerve Blocks (3rd ed), Chapter 24, Femoral Nerve Block.',
    liveLabeling: {
      available: true,
      model: 'femoral',
      note: 'Femoral nerve model (Nerve-UTP), held-out Dice 0.74. Opens Plexus Studio with the femoral model preselected in the Nerve Model Lab and run on a real Nerve-UTP still frame. Its abstention gate is verified to stay silent on noise and blank frames. Structure highlighting only, never a needle target.',
    },
  },
  {
    id: 'adductor-canal',
    name: 'Adductor Canal Block',
    icon: '🦵',
    group: 'lower',
    regionLabel: 'Saphenous nerve, subsartorial',
    chapter: 25,
    tagline: 'Motor sparing knee analgesia targeting the saphenous nerve deep to sartorius at mid thigh.',
    indication:
      'The subsartorial (saphenous, adductor canal, and femoral triangle) blocks anesthetize the medial leg, ankle, and midfoot and provide knee analgesia. Uses include foot and ankle surgery combined with a sciatic block, multimodal knee arthroplasty analgesia (a mainstay of ERAS protocols), and saphenous vein stripping. The femoral triangle block sits more proximal for stronger knee analgesia; the adductor canal block gives strong knee analgesia with less motor loss; the distal saphenous block is essentially a pure sensory block.',
    anatomy:
      'The saphenous nerve is the longest sensory branch of the femoral nerve and travels with the femoral artery and vein down the medial thigh. In the mid third of the thigh these lie in the adductor canal, a triangular tunnel roofed by sartorius (via the vasto adductor membrane), bounded by vastus medialis anterolaterally and adductor longus and magnus posteromedially.\nThe canal also transmits the medial femoral cutaneous nerve, the nerve to vastus medialis, and inconsistent obturator articular branches; distally it ends at the adductor hiatus. The apex of the femoral triangle (proximal limit of the canal) is where the medial border of sartorius crosses the medial border of adductor longus.',
    ultrasound:
      'Place a high frequency linear probe transversely on the medial mid thigh and find the femoral artery as a round, pulsatile, anechoic structure deep to sartorius. Trace the artery until it lies below the midpoint of sartorius (the adductor canal level); the saphenous nerve is lateral to the femoral artery there.\nThe nerve is small and hyperechoic, so it is not always visible and often becomes clearer only after injection opens the plane. To separate the two levels, trace sartorius: injection proximal to the sartorius and adductor longus crossing lands in the femoral triangle, distal to it lands in the adductor canal. Release probe pressure before injecting to reveal the collapsed femoral vein.',
    technique:
      'In plane approach, needle advanced lateral to medial toward the deep fascia of sartorius, staying lateral to the femoral artery (course runs anterolateral to posteromedial). Use the RAPT sequence during injection.\nInject 1 to 2 mL first to confirm the correct site in the intermuscular plane lateral to the artery, then complete the block. Bupivacaine or ropivacaine 0.25 to 0.5% is used. Watch for vascular puncture (release transducer pressure to see the vein first); an out of plane approach may be easier in larger patients.',
    volume: 'Hadzic lists 10 to 20 mL overall (about 5 to 10 mL suffices for a pure saphenous block; 10 to 15 mL completes an adductor canal block). A problem solving tip warns not to exceed about 10 mL, since larger volumes (for example 30 mL) can cause quadriceps paresis.',
    pearls: [
      'The chief advantage over the femoral block is motor sparing: it targets the mainly sensory saphenous nerve rather than the motor femoral trunk, preserving quadriceps strength and supporting early ambulation.',
      'It is not completely free of quadriceps weakness risk; larger volumes worsen it, so keep volume modest.',
      'No single subsartorial injection covers all articular branches to the knee, so it is one component of a multimodal plan.',
      'Fall prevention protocols remain mandatory with any lower extremity block.',
    ],
    source: 'Summarized from Hadzic, Peripheral Nerve Blocks (3rd ed), Chapter 25, Subsartorial Blocks (Saphenous, Adductor Canal, Femoral Triangle).',
    liveLabeling: { available: false },
  },
  {
    id: 'popliteal-sciatic',
    name: 'Popliteal Sciatic Block',
    icon: '🦶',
    group: 'lower',
    regionLabel: 'Sciatic nerve at the popliteal fossa',
    chapter: 29,
    tagline: 'Blockade at the sciatic bifurcation for foot and ankle surgery, sparing the hamstrings.',
    indication:
      'Targets the sciatic nerve at the popliteal fossa and is a mainstay for foot and ankle surgery, especially in the ambulatory setting. It produces sensory and motor block of the lower leg below the knee while sparing the hamstrings. Combined with a saphenous block it gives complete anesthesia of the leg and ankle, since the sciatic distribution misses only the medial leg skin supplied by the saphenous nerve.',
    anatomy:
      'The sciatic nerve descends through the posterior thigh and, roughly 2 to 4 cm proximal to the popliteal crease, divides into the tibial nerve and the common peroneal nerve. Both divisions are wrapped by a shared connective tissue sheath (the source names it the "Vloka sheath") that continues around each nerve after they separate.\nAt the crease the popliteal artery sits deepest (about 2 to 4 cm, between the femoral condyles), the popliteal vein lies superficial to the artery, and the tibial nerve lies posterior and slightly lateral to the vein. The common peroneal nerve travels laterally, deep to the biceps femoris tendon, wrapping around the fibular head and neck.',
    ultrasound:
      'Use a high frequency linear transducer in transverse orientation, 2 to 3 cm proximal to the crease over the medial border of biceps femoris. Identify the round hyperechoic sciatic nerve superficial and lateral to the popliteal artery and vein, then slide proximally to find where the two divisions unite, or distally to watch them split into the tibial and common peroneal nerves.\nProbe pressure and caudal (heel to toe) tilt bring out the honeycomb hyperechoic nerve; color Doppler and calf compression confirm the vessels.',
    technique:
      'Position the patient lateral (most common), prone, or supine with a footrest so the foot is visible. Using an in plane (lateral to medial, through biceps femoris) or out of plane approach, the needle tip is advanced into the common sheath in the space between the tibial and common peroneal nerves; sheath entry is often felt as a loss of resistance or seen as an indentation then snapback.\nInject 1 to 2 mL first to confirm the tip is inside the sheath (the nerves should visibly separate), then complete the block. RAPT cues apply (motor response absent at 0.5 mA, negative aspiration, pressure under 15 psi).',
    volume: 'Hadzic states 15 to 20 mL (the text notes 10 to 20 mL is usually sufficient). For a continuous catheter, confirm with 4 to 5 mL and thread 3 to 5 cm; a typical infusion is ropivacaine 0.2% at 5 mL/hour with a 5 mL bolus every 60 minutes.',
    pearls: [
      'The key principle is to block at or just proximal to the bifurcation, or to deposit local anesthetic between the two divisions inside the common (Vloka) sheath, which speeds onset and lowers the volume needed.',
      'The definitive sign of a correct injection is local anesthetic spreading within the sheath and physically separating the tibial and common peroneal nerves, tracking around both.',
      'Because the block gives complete motor block below the knee, patients cannot ambulate without assistive devices.',
      'Dorsiflexion and plantar flexion of the ankle rotate the nerve and can aid visualization.',
    ],
    source: 'Summarized from Hadzic, Peripheral Nerve Blocks (3rd ed), Chapter 29, Popliteal Sciatic Block.',
    liveLabeling: {
      available: true,
      model: 'sciatic',
      note: 'Sciatic nerve model (Nerve-UTP), held-out Dice 0.72. IMPORTANT WINDOW MISMATCH: the Nerve-UTP sciatic data is a PROXIMAL sciatic window, NOT the popliteal fossa bifurcation view this block uses, so treat it as a recognition aid for the sciatic nerve in general, not a popliteal-specific model. Opens Plexus Studio with the sciatic model preselected in the Nerve Model Lab and run on a real Nerve-UTP still frame. Its abstention gate is verified to stay silent on noise and blank frames. Structure highlighting only, never a needle target.',
    },
  },
  {
    id: 'tap',
    name: 'Transversus Abdominis Plane (TAP) Block',
    icon: '🛡️',
    group: 'truncal',
    regionLabel: 'Abdominal wall, T6 to L1',
    chapter: 38,
    tagline: 'Analgesic field block of the abdominal wall between internal oblique and transversus abdominis.',
    indication:
      'A widely used analgesic (not primary anesthetic) technique for surgery involving the abdominal wall, given as part of a multimodal plan. It provides somatic analgesia to the abdominal wall and parietal peritoneum, with documented efficacy for cesarean delivery, hysterectomy, cholecystectomy, colectomy, prostatectomy, and hernia repair. The goal is to block the lateral and anterior branches of the spinal nerves T6 to L1.',
    anatomy:
      'The anterolateral abdominal wall has rectus abdominis (superficial, paramedian) and, laterally from superficial to deep, the external oblique, internal oblique, and transversus abdominis. The target plane lies between the internal oblique and transversus abdominis.\nThat plane carries the thoracoabdominal nerves (T6 to T12) and the ilioinguinal and iliohypogastric nerves (L1). Near the midaxillary line the nerves give off lateral cutaneous branches, then continue to enter the rectus sheath at the linea semilunaris as anterior cutaneous branches. Deep to transversus abdominis, the transversalis fascia and peritoneum separate the muscle from bowel.',
    ultrasound:
      'Use a high frequency linear transducer transversely on the abdominal wall. The classic image is the three muscle layers stacked as long hypoechoic bands, from superficial to deep the external oblique, internal oblique, and transversus abdominis, with their fasciae as hyperechoic lines. The target is the fascial plane between internal oblique and transversus abdominis; deep to transversus the peritoneum and bowel are visible.\nProbe placement varies by approach: subcostal (oblique along the costal margin), lateral (over the midaxillary line between costal margin and iliac crest), posterior (toward quadratus lumborum), and anterior or ilioinguinal (over the anterior superior iliac spine toward the umbilicus).',
    technique:
      'The approach depends on the coverage needed. For the lateral block the needle goes in plane at the anterior axillary line, advanced anterior to posterior, with the endpoint in the internal oblique to transversus abdominis plane near the midaxillary line. For the subcostal block the needle runs in plane medial to lateral. For the posterior block the target is the most posterior end of the plane, lateral to quadratus lumborum.\nIn all cases the endpoint is hydrodissection opening the fascial plane between internal oblique and transversus abdominis. Staying superficial to the transversalis fascia avoids the peritoneum and bowel.',
    volume: 'Hadzic states 10 to 20 mL per site depending on desired spread and the maximum safe dose, with a minimum around 15 mL per site (roughly 0.2 to 0.3 mL/kg). A large volume of low concentration local anesthetic is used; always account for weight, especially for bilateral or combined blocks.',
    pearls: [
      'The essential point is that the TAP is an analgesic field block covering somatic (parietal) pain only; it does not cover visceral pain, so it is an adjunct within a multimodal regimen, not a standalone anesthetic.',
      'Coverage is injection site dependent: subcostal covers the upper quadrant, lateral covers roughly T10 to T12 (L1 inconsistent), posterior may reach T9 to T12, and the ilioinguinal approach covers the L1 dermatome.',
      'Analgesia quality and duration vary with how much local anesthetic actually reaches the nerves.',
      'Systemic absorption can be significant with large volumes, so watch total dose and local anesthetic systemic toxicity risk; color Doppler helps identify the circumflex iliac artery for the ilioinguinal approach.',
    ],
    source: 'Summarized from Hadzic, Peripheral Nerve Blocks (3rd ed), Chapter 38, Transversus Abdominis Plane Blocks.',
    liveLabeling: { available: false },
  },
  {
    id: 'esp',
    name: 'Erector Spinae Plane (ESP) Block',
    icon: '🦴',
    group: 'truncal',
    regionLabel: 'Interfascial plane, transverse process',
    chapter: 37,
    tagline: 'Interfascial plane block on the transverse process for multidermatomal trunk analgesia.',
    indication:
      'A newer interfascial plane technique used mainly for analgesia rather than surgical anesthesia. Reported uses include rib fractures, back surgery, and chest wall procedures, with many other indications (abdominal, breast) under investigation. It can provide multidermatomal coverage at cervical, thoracic, or lumbar levels and is performed single shot or with a catheter.',
    anatomy:
      'The erector spinae group (iliocostalis, longissimus, spinalis) runs vertically along the spine, superficial to the transverse processes and lamina. The deep fascial plane behind these muscles is separated from the paravertebral space by the transverse processes and the intertransverse and costotransverse ligaments.\nSpinal nerve roots exit the intervertebral foramina and split into a dorsal ramus (posteriorly through the erector spinae to the back), a ventral ramus (the intercostal nerve at T1 to T12, supplying the anterolateral chest and abdominal wall), and communicating rami to the sympathetic trunk in the paravertebral space.',
    ultrasound:
      'Use a linear transducer (high frequency for thoracic; low frequency curved array for lumbar or obese patients) in a paramedian sagittal orientation about 2 cm lateral to the midline. The signature target is the hyperechoic transverse process, seen as a flat, squared hyperechoic line with an acoustic shadow behind it, with the erector spinae muscle sitting directly on top.\nAbove roughly T5, three muscle layers stack above the transverse process (trapezius, rhomboid major, erector spinae); at mid and lower thoracic levels only trapezius and erector spinae are seen. If rounded ribs with pleura between them appear, the probe is too lateral; if flat laminae appear, it is too medial. Correct position shows squared transverse processes with no pleura at that level.',
    technique:
      'Position the patient sitting, lateral, or prone, and identify the level by counting from the first rib or surface landmarks (C7 vertebra prominens, scapular spine at T3, inferior scapular angle at T7). Use a 50 to 100 mm needle in plane, cranial to caudal (or caudal to cranial), advancing until the tip contacts the bony transverse process.\nInject 1 to 3 mL to confirm the tip is in the correct plane; correct spread lifts the erector spinae muscle off the transverse process. Aim the injection at the vertebral level of the surgical incision; for catheters, inject about 5 mL first to open a space before threading.',
    volume: 'Hadzic states 20 to 30 mL to complete the block, spreading craniocaudally along the plane over several vertebral levels; it is volume dependent.',
    pearls: [
      'The mechanism is incompletely understood; spread into the paravertebral space reaching mainly the dorsal rami (and less consistently the ventral rami, sympathetic chain, and epidural space) is the presumed mode of action, which explains the variable coverage.',
      'A safety appeal is that the injection point sits well away from the neuraxis, pleura or peritoneum, and major vessels, so risk is thought lower than a paravertebral block; keep the probe perpendicular until the transverse process is seen and pleura disappears to avoid pneumothorax.',
      'Because it is a large surface area plane block, systemic absorption can be high, so mind the total dose and local anesthetic systemic toxicity risk (consider dilute dosing in elderly or high risk patients).',
      'Reported complications include isolated cases of pneumothorax, partial autonomic neuropathy, and hematoma.',
    ],
    source: 'Summarized from Hadzic, Peripheral Nerve Blocks (3rd ed), Chapter 37, Erector Spinae Plane Block.',
    liveLabeling: { available: false },
  },
];

export default REGIONAL_BLOCKS;
