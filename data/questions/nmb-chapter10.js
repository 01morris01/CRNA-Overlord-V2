/**
 * NEUROMUSCULAR BLOCKERS QUESTION BANK - Chapter 10
 * Course: Basics of Anesthesia
 * Node: node-10
 * Topic: Neuromuscular Blocking Agents (NMBAs)
 *
 * Question Types:
 * - mcq:   Multiple choice (single best answer) — ans array of {t, ok}
 * - multi:  Select multiple (choices + correctAnswers + selectCount)
 * - short:  Free response (acceptedAnswers array)
 */

export const NMB_QUESTIONS = [

  // ─── NMJ PHYSIOLOGY ──────────────────────────────────────────────────────────

  {
    id: "nmb-001",
    type: "mcq",
    prompt: "At the neuromuscular junction, acetylcholine (ACh) is released from the motor nerve terminal and binds to receptors on the motor end-plate. What type of receptor does ACh bind at the NMJ?",
    setup: "",
    ans: [
      { t: "Nicotinic acetylcholine receptor (nAChR)", ok: true },
      { t: "Muscarinic M2 receptor", ok: false },
      { t: "GABA-A receptor", ok: false },
      { t: "NMDA glutamate receptor", ok: false },
    ],
    rationale: "The NMJ uses nicotinic acetylcholine receptors (nAChR), which are ligand-gated ion channels requiring TWO ACh molecules to open. Non-depolarizing NMBAs competitively antagonize this receptor. Muscarinic receptors are found in the heart, glands, and smooth muscle — not the NMJ.",
    metadata: { topic: "NMJ Physiology", priority: "high" }
  },

  {
    id: "nmb-002",
    type: "short",
    prompt: "How many molecules of acetylcholine must bind to a nicotinic receptor at the NMJ to open the ion channel?",
    setup: "",
    acceptedAnswers: ["2", "two", "Two", "TWO", "2 molecules", "two molecules"],
    rationale: "Each nicotinic AChR at the NMJ has two alpha subunits, each of which must bind one ACh molecule. Only when BOTH alpha subunits are occupied does the channel open, allowing Na+ influx and K+ efflux to generate an end-plate potential.",
    metadata: { topic: "NMJ Physiology", priority: "high" }
  },

  {
    id: "nmb-003",
    type: "mcq",
    prompt: "Acetylcholine is rapidly broken down at the NMJ by which enzyme?",
    setup: "",
    ans: [
      { t: "Acetylcholinesterase (AChE)", ok: true },
      { t: "Pseudocholinesterase (butyrylcholinesterase)", ok: false },
      { t: "Monoamine oxidase (MAO)", ok: false },
      { t: "Catechol-O-methyltransferase (COMT)", ok: false },
    ],
    rationale: "True acetylcholinesterase (AChE), also called specific cholinesterase, terminates ACh signaling at the NMJ by hydrolyzing ACh into choline and acetate. Pseudocholinesterase (plasma cholinesterase/butyrylcholinesterase) is in plasma and metabolizes succinylcholine and mivacurium — not ACh at the NMJ. Neostigmine and edrophonium inhibit AChE to reverse non-depolarizing block.",
    metadata: { topic: "NMJ Physiology", priority: "high" }
  },

  // ─── SUCCINYLCHOLINE ─────────────────────────────────────────────────────────

  {
    id: "nmb-004",
    type: "mcq",
    prompt: "Succinylcholine is classified as which type of neuromuscular blocking agent?",
    setup: "",
    ans: [
      { t: "Depolarizing (Phase I block)", ok: true },
      { t: "Non-depolarizing (competitive antagonist)", ok: false },
      { t: "Dual block initially depolarizing, later non-depolarizing", ok: false },
      { t: "Directly acting muscle relaxant", ok: false },
    ],
    rationale: "Succinylcholine mimics ACh — it depolarizes the motor end-plate and produces visible fasciculations before causing sustained depolarization (Phase I block). The channel stays open but becomes inactivated (desensitized), preventing further contractions. With large/repeated doses, Phase II block (non-depolarizing character) can develop.",
    metadata: { topic: "Succinylcholine", priority: "high" }
  },

  {
    id: "nmb-005",
    type: "mcq",
    prompt: "Which enzyme is responsible for the metabolism of succinylcholine?",
    setup: "",
    ans: [
      { t: "Pseudocholinesterase (plasma cholinesterase / butyrylcholinesterase)", ok: true },
      { t: "True acetylcholinesterase at the NMJ", ok: false },
      { t: "Hepatic CYP3A4 oxidation", ok: false },
      { t: "Renal elimination unchanged", ok: false },
    ],
    rationale: "Succinylcholine is rapidly hydrolyzed in plasma by pseudocholinesterase (butyrylcholinesterase) to succinylmonocholine and then more slowly to succinic acid and choline. This accounts for its short duration (~10 min). Genetic or acquired pseudocholinesterase deficiency dramatically prolongs its duration.",
    metadata: { topic: "Succinylcholine", priority: "high" }
  },

  {
    id: "nmb-006",
    type: "multi",
    prompt: "Select THREE conditions in which succinylcholine carries the highest risk and is generally avoided:",
    setup: "",
    choices: [
      "History of malignant hyperthermia",
      "Known pseudocholinesterase deficiency",
      "Hyperkalemia risk (burns >24h, crush injury, denervation, immobilization)",
      "Difficult airway anticipated",
      "Chronic renal failure without denervation",
      "Prolonged QT syndrome",
    ],
    correctAnswers: [
      "History of malignant hyperthermia",
      "Hyperkalemia risk (burns >24h, crush injury, denervation, immobilization)",
      "Known pseudocholinesterase deficiency",
    ],
    selectCount: 3,
    rationale: "Highest-risk conditions for succinylcholine: (1) Personal or family history of malignant hyperthermia — succinylcholine is a potent MH trigger (use non-triggering agents + dantrolene); (2) Hyperkalemia risk — extrajunctional AChR upregulation in burns >24h, crush injury, denervation, prolonged immobility causes fatal K+ efflux; (3) Pseudocholinesterase deficiency — homozygous atypical enzyme causes 2+ hour paralysis (prolonged block, not lethal, but clinically important). Difficult airway is actually an indication for succinylcholine in RSI, not a contraindication.",
    metadata: { topic: "Succinylcholine", priority: "high" }
  },

  {
    id: "nmb-007",
    type: "mcq",
    prompt: "A patient sustains severe burns covering 40% of BSA. On post-burn day 3, a surgical debridement is planned. Which statement about succinylcholine use is MOST accurate?",
    setup: "72-year-old male, 40% TBSA burns, post-burn day 3, scheduled for debridement.",
    ans: [
      { t: "Succinylcholine is contraindicated due to risk of life-threatening hyperkalemia", ok: true },
      { t: "Succinylcholine can be used safely if potassium is checked first", ok: false },
      { t: "Succinylcholine is safe because the burn is <72 hours old", ok: false },
      { t: "Succinylcholine is the preferred agent because of its rapid onset", ok: false },
    ],
    rationale: "After major burns, immobilization, crush injuries, or denervation injuries, extrajunctional nicotinic acetylcholine receptors proliferate across the muscle membrane within 24 hours. Succinylcholine causes massive K+ efflux from ALL these receptors simultaneously, potentially causing cardiac arrest from hyperkalemia. The critical window begins around 24 hours post-injury and can last months. A normal pre-op potassium does NOT rule out the risk.",
    metadata: { topic: "Hyperkalemia", priority: "high" }
  },

  {
    id: "nmb-008",
    type: "mcq",
    prompt: "The Dibucaine number is used to evaluate pseudocholinesterase function. A normal patient has a Dibucaine number of approximately:",
    setup: "",
    ans: [
      { t: "80 (80% inhibition by dibucaine)", ok: true },
      { t: "20 (20% inhibition by dibucaine)", ok: false },
      { t: "50 (50% inhibition by dibucaine)", ok: false },
      { t: "0 (dibucaine has no effect on normal enzyme)", ok: false },
    ],
    rationale: "Dibucaine inhibits normal pseudocholinesterase by ~80% (Dibucaine number = 80). Heterozygous atypical enzyme: Dibucaine number ~60 with slightly prolonged succinylcholine effect (~20 min). Homozygous atypical: Dibucaine number ~20 with profoundly prolonged block (2+ hours). The Dibucaine number reflects enzyme QUALITY, not quantity.",
    metadata: { topic: "Pseudocholinesterase", priority: "high" }
  },

  {
    id: "nmb-009",
    type: "mcq",
    prompt: "Succinylcholine triggers malignant hyperthermia (MH) through which primary mechanism?",
    setup: "",
    ans: [
      { t: "Uncontrolled calcium release from the sarcoplasmic reticulum via mutant RYR1 channels", ok: true },
      { t: "Direct mitochondrial uncoupling causing uncontrolled heat production", ok: false },
      { t: "Excessive acetylcholine release at the motor nerve terminal", ok: false },
      { t: "Inhibition of the Na+/K+ ATPase pump in muscle cells", ok: false },
    ],
    rationale: "In genetically susceptible patients (usually RYR1 gene mutation), volatile anesthetics and succinylcholine trigger massive, uncontrolled Ca2+ release from the sarcoplasmic reticulum (SR). This causes sustained muscle hypermetabolism: hyperthermia, rigidity, metabolic acidosis, rhabdomyolysis, and hyperkalemia. Treatment is dantrolene, which blocks RYR1 channels.",
    metadata: { topic: "Malignant Hyperthermia", priority: "high" }
  },

  // ─── NON-DEPOLARIZING AGENTS ─────────────────────────────────────────────────

  {
    id: "nmb-010",
    type: "mcq",
    prompt: "Non-depolarizing neuromuscular blocking agents (NDNMBAs) produce muscle relaxation by which mechanism?",
    setup: "",
    ans: [
      { t: "Competitive antagonism at nicotinic receptors — block without activating", ok: true },
      { t: "Persistent depolarization of the motor end-plate", ok: false },
      { t: "Inhibition of acetylcholinesterase at the NMJ", ok: false },
      { t: "Blockade of voltage-gated Na+ channels in the motor nerve", ok: false },
    ],
    rationale: "NDNMBAs competitively block nicotinic AChRs without activating them — no fasciculations, no depolarization. Because it is competitive, block can be reversed by increasing the ACh concentration (neostigmine/edrophonium inhibit AChE) or by direct encapsulation (sugammadex for rocuronium/vecuronium). In contrast, succinylcholine acts as an agonist and causes depolarization before sustained block.",
    metadata: { topic: "Rocuronium", priority: "high" }
  },

  {
    id: "nmb-011",
    type: "mcq",
    prompt: "Rocuronium is the preferred non-depolarizing agent for rapid sequence intubation (RSI). What dose produces conditions similar to succinylcholine (within ~60 seconds)?",
    setup: "",
    ans: [
      { t: "1.2 mg/kg (3 × ED95)", ok: true },
      { t: "0.6 mg/kg (2 × ED95)", ok: false },
      { t: "0.1 mg/kg (1/3 × ED95)", ok: false },
      { t: "2.0 mg/kg (6 × ED95)", ok: false },
    ],
    rationale: "The ED95 of rocuronium is ~0.3 mg/kg. Standard intubation dose is 0.6 mg/kg (onset ~90 sec). For RSI comparable to succinylcholine, 1.2 mg/kg (3× ED95) is used — onset ~60 seconds. The trade-off: prolonged duration (~90 min vs succinylcholine's ~10 min), but can be rapidly reversed with sugammadex (16 mg/kg). This is the foundation of the 'succinylcholine alternative' strategy.",
    metadata: { topic: "Rocuronium", priority: "high" }
  },

  {
    id: "nmb-012",
    type: "mcq",
    prompt: "Which non-depolarizing NMBA undergoes Hofmann elimination, making it independent of renal and hepatic function?",
    setup: "",
    ans: [
      { t: "Cisatracurium", ok: true },
      { t: "Rocuronium", ok: false },
      { t: "Vecuronium", ok: false },
      { t: "Pancuronium", ok: false },
    ],
    rationale: "Cisatracurium (and atracurium) undergo Hofmann elimination — a spontaneous, non-enzymatic degradation at physiologic temperature and pH. This makes them ideal for patients with renal OR hepatic failure because elimination does not depend on either organ. Laudanosine is a metabolite with potential CNS excitatory effects in very high doses. Rocuronium and vecuronium rely on hepatic metabolism/biliary excretion; pancuronium depends heavily on renal elimination.",
    metadata: { topic: "Cisatracurium", priority: "high" }
  },

  {
    id: "nmb-013",
    type: "short",
    prompt: "What is the primary metabolic pathway of cisatracurium that makes it organ-independent?",
    setup: "",
    acceptedAnswers: [
      "Hofmann elimination",
      "hofmann elimination",
      "Hoffman elimination",
      "hoffman elimination",
      "Hofmann",
      "hofmann",
    ],
    rationale: "Hofmann elimination is a spontaneous, non-enzymatic degradation at physiologic pH (~7.4) and temperature (37°C). Cisatracurium breaks down into laudanosine and a monoquaternary acrylate. No renal or hepatic function required. Ester hydrolysis (by non-specific plasma esterases) also contributes to atracurium's elimination.",
    metadata: { topic: "Hofmann", priority: "high" }
  },

  {
    id: "nmb-014",
    type: "mcq",
    prompt: "Pancuronium is known for which cardiovascular side effect?",
    setup: "",
    ans: [
      { t: "Tachycardia and mild hypertension (vagolysis + sympathetic stimulation)", ok: true },
      { t: "Profound bradycardia and hypotension", ok: false },
      { t: "Coronary vasospasm", ok: false },
      { t: "Histamine release causing flushing and hypotension", ok: false },
    ],
    rationale: "Pancuronium causes vagolysis (blocks cardiac muscarinic M2 receptors) and some sympathomimetic activity, resulting in tachycardia and mild hypertension. This can worsen myocardial ischemia in at-risk patients. It is renally eliminated (70%), so it accumulates in renal failure. Historically used in ICU sedation but largely replaced by cisatracurium and vecuronium.",
    metadata: { topic: "Pancuronium", priority: "medium" }
  },

  {
    id: "nmb-015",
    type: "multi",
    prompt: "Select TWO non-depolarizing NMBAs that are relatively cardiovascularly neutral (minimal histamine release and vagolysis):",
    setup: "",
    choices: [
      "Vecuronium",
      "Cisatracurium",
      "Atracurium",
      "Pancuronium",
      "Mivacurium",
    ],
    correctAnswers: ["Vecuronium", "Cisatracurium"],
    selectCount: 2,
    rationale: "Vecuronium and cisatracurium are both cardiovascularly neutral — minimal histamine release and no significant vagolysis or sympathomimetic effects. Atracurium releases histamine at higher doses (especially if given rapidly). Pancuronium causes tachycardia via vagolysis. Mivacurium releases histamine. These properties make vecuronium and cisatracurium preferred for hemodynamically unstable patients.",
    metadata: { topic: "Vecuronium", priority: "medium" }
  },

  // ─── MONITORING / TRAIN-OF-FOUR ───────────────────────────────────────────────

  {
    id: "nmb-016",
    type: "mcq",
    prompt: "Train-of-four (TOF) stimulation delivers 4 supramaximal stimuli at 2 Hz. Which TOF ratio indicates clinically adequate reversal of neuromuscular block?",
    setup: "",
    ans: [
      { t: "TOF ratio ≥ 0.9 (T4/T1 ≥ 0.9)", ok: true },
      { t: "TOF ratio ≥ 0.7 (T4/T1 ≥ 0.7)", ok: false },
      { t: "Any 4/4 twitches, regardless of ratio", ok: false },
      { t: "TOF ratio ≥ 0.5 (T4/T1 ≥ 0.5)", ok: false },
    ],
    rationale: "A TOF ratio (T4/T1) of ≥ 0.9 is required for full recovery of neuromuscular function. At 0.7, the patient may appear awake but has 30% receptor occupancy and compromised airway protective reflexes. 'Fade' (decreasing amplitude of successive twitches) is characteristic of non-depolarizing block — succinylcholine causes uniform reduction without fade.",
    metadata: { topic: "Monitoring", priority: "high" }
  },

  {
    id: "nmb-017",
    type: "mcq",
    prompt: "During deep neuromuscular block with rocuronium, which monitoring mode is most appropriate to detect block depth in the absence of any twitches?",
    setup: "",
    ans: [
      { t: "Post-tetanic count (PTC)", ok: true },
      { t: "Train-of-four (TOF) count", ok: false },
      { t: "Double-burst stimulation (DBS)", ok: false },
      { t: "Single-twitch stimulation", ok: false },
    ],
    rationale: "When TOF count = 0 (all 4 twitches abolished), post-tetanic count (PTC) is used. A tetanic stimulus (50 Hz for 5 sec) temporarily increases ACh in the cleft (post-tetanic potentiation), and the number of twitches that follow (PTC) estimates depth of block. PTC 1-2 = very deep; PTC 10+ = shallow. DBS compares two short tetanic bursts — useful for detecting residual block with low fade. TOF count (not ratio) is used when all 4 twitches are not yet present.",
    metadata: { topic: "Monitoring", priority: "medium" }
  },

  {
    id: "nmb-018",
    type: "mcq",
    prompt: "In non-depolarizing block, TOF monitoring shows 'fade' (progressive weakening of T1→T4). What does fade indicate?",
    setup: "",
    ans: [
      { t: "Prejunctional block depleting ACh mobilization at the nerve terminal", ok: true },
      { t: "Phase II depolarizing block transitioning to non-depolarizing character", ok: false },
      { t: "Artifact due to electrode placement over a muscle fascicle", ok: false },
      { t: "Adequate neuromuscular recovery — fade disappears at TOF ≥ 0.9", ok: false },
    ],
    rationale: "Fade in non-depolarizing block results from presynaptic (prejunctional) blockade. NDNMBAs block presynaptic nAChRs that normally provide positive feedback to mobilize ACh vesicles. With repetitive stimulation, the nerve cannot replenish ACh fast enough, so successive twitches diminish. This is distinct from postjunctional receptor block, which produces the baseline weakness.",
    metadata: { topic: "Monitoring", priority: "medium" }
  },

  // ─── REVERSAL AGENTS ─────────────────────────────────────────────────────────

  {
    id: "nmb-019",
    type: "mcq",
    prompt: "Neostigmine reverses non-depolarizing block by which mechanism?",
    setup: "",
    ans: [
      { t: "Inhibits acetylcholinesterase, increasing ACh at the NMJ to displace NDNMBA", ok: true },
      { t: "Directly encapsulates and inactivates non-depolarizing NMBAs in plasma", ok: false },
      { t: "Acts as a nicotinic agonist to repolarize the motor end-plate", ok: false },
      { t: "Stimulates the motor nerve to increase quantal release of ACh", ok: false },
    ],
    rationale: "Neostigmine (and edrophonium, pyridostigmine) are anticholinesterase agents — they inhibit AChE, preventing ACh breakdown. Accumulation of ACh at the NMJ outcompetes the NDNMBA for receptor occupancy. IMPORTANT: neostigmine also increases ACh at muscarinic sites (heart, GI, bladder), requiring co-administration of an anticholinergic (glycopyrrolate or atropine) to prevent bradycardia, bronchospasm, and excessive secretions.",
    metadata: { topic: "Reversal Agents", priority: "high" }
  },

  {
    id: "nmb-020",
    type: "mcq",
    prompt: "Which reversal agent works by directly encapsulating rocuronium and vecuronium in plasma, rendering them inactive, without cholinergic side effects?",
    setup: "",
    ans: [
      { t: "Sugammadex", ok: true },
      { t: "Neostigmine", ok: false },
      { t: "Edrophonium", ok: false },
      { t: "Pyridostigmine", ok: false },
    ],
    rationale: "Sugammadex is a modified gamma-cyclodextrin that forms a tight (1:1) inclusion complex with rocuronium (and to a lesser degree vecuronium), trapping them in plasma. ACh levels are NOT affected — no muscarinic side effects, no need for anticholinergic co-administration. It is effective even at deep block (TOF=0, PTC=0) and can reverse RSI-dose rocuronium (1.2 mg/kg) within 3 minutes at 16 mg/kg.",
    metadata: { topic: "Reversal Agents", priority: "high" }
  },

  {
    id: "nmb-021",
    type: "mcq",
    prompt: "What dose of sugammadex is recommended for reversal of profound neuromuscular block (PTC = 1-2, following 1.2 mg/kg rocuronium)?",
    setup: "",
    ans: [
      { t: "16 mg/kg", ok: true },
      { t: "2 mg/kg", ok: false },
      { t: "4 mg/kg", ok: false },
      { t: "8 mg/kg", ok: false },
    ],
    rationale: "Sugammadex dosing is block-depth dependent: moderate block (TOF count ≥ 2) → 2 mg/kg; deep block (PTC 1-2, TOF = 0) → 4 mg/kg; immediate reversal of RSI-dose rocuronium (1.2 mg/kg, PTC = 0) → 16 mg/kg. The 16 mg/kg dose achieves TOF ≥ 0.9 within ~3 minutes — the 'can't intubate, can't ventilate' rescue dose when succinylcholine is contraindicated and rocuronium is used for RSI.",
    metadata: { topic: "Reversal Agents", priority: "high" }
  },

  {
    id: "nmb-022",
    type: "multi",
    prompt: "Select TWO reasons why neostigmine requires co-administration of an anticholinergic drug (glycopyrrolate or atropine):",
    setup: "",
    choices: [
      "Neostigmine increases ACh at cardiac muscarinic receptors causing bradycardia",
      "Neostigmine causes bronchospasm and increased secretions via muscarinic stimulation",
      "Neostigmine causes histamine release requiring antihistamine pretreatment",
      "Neostigmine crosses the blood-brain barrier causing CNS excitation",
      "Neostigmine blocks nicotinic receptors causing prolonged weakness",
    ],
    correctAnswers: [
      "Neostigmine increases ACh at cardiac muscarinic receptors causing bradycardia",
      "Neostigmine causes bronchospasm and increased secretions via muscarinic stimulation",
    ],
    selectCount: 2,
    rationale: "By inhibiting AChE everywhere (not just at the NMJ), neostigmine increases ACh at all cholinergic synapses including muscarinic sites — producing SLUDGE: Salivation, Lacrimation, Urination, Defecation, GI upset, Emesis. Most critically: bradycardia (cardiac M2 activation) and bronchospasm/secretions (airway M3). Glycopyrrolate (preferred — quaternary amine, no CNS penetration, slow onset matching neostigmine) or atropine is given concurrently.",
    metadata: { topic: "Reversal Agents", priority: "high" }
  },

  {
    id: "nmb-023",
    type: "mcq",
    prompt: "Neostigmine cannot reliably reverse profound neuromuscular block (TOF count = 0). What is the ceiling effect of neostigmine regarding receptor occupancy?",
    setup: "",
    ans: [
      { t: "Neostigmine cannot overcome >70-80% receptor occupancy by NDNMBA", ok: true },
      { t: "Neostigmine is equally effective at any depth of block", ok: false },
      { t: "Neostigmine works better at deep block because AChE inhibition is more complete", ok: false },
      { t: "Neostigmine requires TOF count ≥ 4 before administration", ok: false },
    ],
    rationale: "Anticholinesterase reversal works by shifting the ACh/NDNMBA competitive balance. When receptor occupancy is very high (>70-80%), even maximum AChE inhibition cannot generate enough ACh to displace all NDNMBA. Neostigmine also has a ceiling effect because it fully saturates AChE — additional doses cannot increase ACh further. Always wait for TOF ≥ 1-2 before giving neostigmine. Sugammadex has no such ceiling.",
    metadata: { topic: "Reversal Agents", priority: "medium" }
  },

  // ─── HYPERKALEMIA / SPECIFIC RISKS ───────────────────────────────────────────

  {
    id: "nmb-024",
    type: "mcq",
    prompt: "A patient with spinal cord injury at T4 (complete, 6 weeks ago) requires an emergent appendectomy. Which statement is correct regarding NMB choice?",
    setup: "38-year-old male, T4 complete SCI 6 weeks ago, emergent appendectomy.",
    ans: [
      { t: "Succinylcholine is absolutely contraindicated — use rocuronium instead", ok: true },
      { t: "Succinylcholine is safe because the injury is chronic (>1 month)", ok: false },
      { t: "Succinylcholine can be used if serum potassium is checked and normal pre-op", ok: false },
      { t: "Either agent is appropriate; use succinylcholine for RSI given its short duration", ok: false },
    ],
    rationale: "Denervation injuries (spinal cord injury, stroke, prolonged immobility) cause massive upregulation of extrajunctional nicotinic AChRs throughout muscle. Succinylcholine activates ALL these receptors simultaneously, releasing potentially fatal amounts of K+. The risk begins ~24-48 hours post-injury and persists indefinitely (years). A normal pre-op K+ does NOT rule out the risk. Use rocuronium + sugammadex for RSI in these patients.",
    metadata: { topic: "Hyperkalemia", priority: "high" }
  },

  {
    id: "nmb-025",
    type: "mcq",
    prompt: "Which condition is associated with Phase II block when succinylcholine is used?",
    setup: "",
    ans: [
      { t: "Large or repeated doses of succinylcholine causing receptor desensitization resembling non-depolarizing block", ok: true },
      { t: "Rapid injection of a single standard intubating dose (1–1.5 mg/kg)", ok: false },
      { t: "Phase II block is synonymous with malignant hyperthermia", ok: false },
      { t: "Phase II block occurs only in patients with pseudocholinesterase deficiency", ok: false },
    ],
    rationale: "Phase I (depolarizing) block is the normal succinylcholine effect — sustained depolarization, fade-free TOF. With large repeated doses or prolonged infusion, Phase II block develops — channels desensitize (no longer respond to ACh), TOF shows fade, and the block begins to resemble a non-depolarizing block. Phase II block can (cautiously) be partially reversed with anticholinesterases, unlike Phase I.",
    metadata: { topic: "Succinylcholine", priority: "medium" }
  },

  // ─── PHARMACOKINETICS / DURATION ─────────────────────────────────────────────

  {
    id: "nmb-026",
    type: "mcq",
    prompt: "Which of the following non-depolarizing NMBAs has the SHORTEST duration of action, making it suitable for short procedures?",
    setup: "",
    ans: [
      { t: "Mivacurium", ok: true },
      { t: "Cisatracurium", ok: false },
      { t: "Rocuronium", ok: false },
      { t: "Pancuronium", ok: false },
    ],
    rationale: "Mivacurium is the shortest-acting non-depolarizing NMBA (~15-20 min duration), metabolized by pseudocholinesterase (same enzyme as succinylcholine). Rocuronium: intermediate duration (~30-60 min at 0.6 mg/kg). Cisatracurium: intermediate (~45-75 min). Pancuronium: long duration (~90-100 min). Mivacurium releases histamine and is contraindicated in pseudocholinesterase deficiency.",
    metadata: { topic: "Rocuronium", priority: "medium" }
  },

  {
    id: "nmb-027",
    type: "mcq",
    prompt: "A patient with severe hepatic failure (Child-Pugh C cirrhosis) requires neuromuscular blockade for a 2-hour laparotomy. Which agent is MOST appropriate?",
    setup: "Severe hepatic cirrhosis, Child-Pugh C, requiring 2-hour laparotomy.",
    ans: [
      { t: "Cisatracurium (Hofmann elimination — organ-independent)", ok: true },
      { t: "Rocuronium (hepatic metabolism and biliary excretion)", ok: false },
      { t: "Vecuronium (predominantly hepatic elimination)", ok: false },
      { t: "Pancuronium (both hepatic and renal)", ok: false },
    ],
    rationale: "Cisatracurium's Hofmann elimination is temperature and pH-dependent — neither hepatic nor renal function required. This makes it the NDNMBA of choice in hepatic and renal failure. Rocuronium (80% biliary/hepatic) and vecuronium (hepatic) will have prolonged duration in liver failure. Atracurium also undergoes Hofmann elimination, but cisatracurium is preferred because it produces 3-5× less laudanosine.",
    metadata: { topic: "Cisatracurium", priority: "high" }
  },

  {
    id: "nmb-028",
    type: "mcq",
    prompt: "Laudanosine is a metabolite of atracurium and cisatracurium. In very high concentrations, laudanosine is associated with which adverse effect?",
    setup: "",
    ans: [
      { t: "CNS excitation and seizures", ok: true },
      { t: "Neuromuscular potentiation and residual block", ok: false },
      { t: "Bradycardia and AV block", ok: false },
      { t: "Histamine-mediated bronchospasm", ok: false },
    ],
    rationale: "Laudanosine crosses the blood-brain barrier and has CNS excitatory properties — at high plasma concentrations (as seen with large doses in ICU patients or renal failure), it can cause seizures. However, clinically significant toxicity from laudanosine is rare with cisatracurium because it produces only 1/5th the laudanosine of atracurium at equipotent doses.",
    metadata: { topic: "Hofmann", priority: "medium" }
  },

  // ─── RESIDUAL BLOCK AND SAFETY ────────────────────────────────────────────────

  {
    id: "nmb-029",
    type: "mcq",
    prompt: "Residual neuromuscular blockade (RNMB) at extubation is defined as a TOF ratio < 0.9. Which clinical complication is most directly associated with RNMB?",
    setup: "",
    ans: [
      { t: "Impaired pharyngeal/airway protective reflexes and aspiration risk", ok: true },
      { t: "Severe bronchospasm from ACh accumulation", ok: false },
      { t: "Delayed emergence from anesthesia due to drug interactions", ok: false },
      { t: "Malignant hyperthermia triggered by residual muscle receptor activation", ok: false },
    ],
    rationale: "Even mild RNMB (TOF 0.7-0.9) causes significant dysfunction of pharyngeal musculature — the genioglossus, pharyngeal dilators, and upper esophageal sphincter all fail to protect the airway adequately. Patients cannot swallow effectively, increasing aspiration risk. Hypoxic ventilatory response is also blunted. This is why a TOF ≥ 0.9 is the standard before extubation, and quantitative (acceleromyography) monitoring is superior to clinical signs.",
    metadata: { topic: "Monitoring", priority: "high" }
  },

  {
    id: "nmb-030",
    type: "mcq",
    prompt: "Which clinical test best predicts adequate neuromuscular recovery at the bedside WITHOUT a neuromuscular monitor?",
    setup: "",
    ans: [
      { t: "Sustained head lift for 5 seconds", ok: true },
      { t: "Grip strength test — patient crushes a towel", ok: false },
      { t: "Respiratory rate > 12 breaths/min", ok: false },
      { t: "SpO2 ≥ 95% on room air", ok: false },
    ],
    rationale: "Sustained 5-second head lift is the traditional clinical test for adequate reversal — it requires ~30% motor unit recruitment and correlates with TOF ≥ 0.6-0.7. However, it is imperfect: patients can sustain it at TOF 0.7 while still having significant pharyngeal weakness. TOF ratio ≥ 0.9 by quantitative monitoring is the gold standard. Grip strength and SpO2 are insufficient — hypoxia is a LATE sign of RNMB.",
    metadata: { topic: "Monitoring", priority: "medium" }
  },

  // ─── HISTAMINE / HEMODYNAMICS ─────────────────────────────────────────────────

  {
    id: "nmb-031",
    type: "mcq",
    prompt: "Which non-depolarizing NMBA is most associated with histamine release, especially when given rapidly as a large bolus?",
    setup: "",
    ans: [
      { t: "Atracurium", ok: true },
      { t: "Rocuronium", ok: false },
      { t: "Vecuronium", ok: false },
      { t: "Cisatracurium", ok: false },
    ],
    rationale: "Atracurium (and mivacurium) are the NDNMBAs most associated with histamine release — causing flushing, hypotension, and occasionally bronchospasm. Cisatracurium, the isomer of atracurium, releases minimal histamine even at high doses. Rocuronium and vecuronium are essentially histamine-free. To minimize histamine release with atracurium: slow injection over 60-90 seconds and avoid large rapid boluses.",
    metadata: { topic: "Histamine", priority: "medium" }
  },

  {
    id: "nmb-032",
    type: "mcq",
    prompt: "A patient receives a rapid large bolus of atracurium and develops facial flushing, erythema over the chest, and systolic BP drops from 130 to 80 mmHg. What is the most likely mechanism?",
    setup: "Patient is 45F, no history of anaphylaxis, receiving atracurium 0.8 mg/kg IV push.",
    ans: [
      { t: "Direct mast cell degranulation and histamine release (not IgE-mediated anaphylaxis)", ok: true },
      { t: "IgE-mediated anaphylactic reaction requiring epinephrine immediately", ok: false },
      { t: "Vagal activation from rapid injection causing vasodilation", ok: false },
      { t: "Propofol-induced TIVA cardiovascular depression potentiated by atracurium", ok: false },
    ],
    rationale: "Atracurium causes direct (non-immunologic) mast cell degranulation — this releases histamine but is dose- and rate-dependent, not IgE-mediated anaphylaxis. It produces flushing, mild hypotension, and rarely bronchospasm. Treatment: slow down/stop infusion, IV fluid bolus, possibly diphenhydramine. Anaphylaxis (IgE-mediated) presents with urticaria, angioedema, severe bronchospasm, and cardiovascular collapse requiring epinephrine.",
    metadata: { topic: "Histamine", priority: "medium" }
  },

  // ─── FACTORS AFFECTING NMB ────────────────────────────────────────────────────

  {
    id: "nmb-033",
    type: "multi",
    prompt: "Select THREE factors that POTENTIATE (prolong/deepen) non-depolarizing neuromuscular block:",
    setup: "",
    choices: [
      "Inhalational anesthetics (volatile agents)",
      "Hypermagnesemia",
      "Hypothermia",
      "Hypercalcemia",
      "Hyperkalemia",
      "Anticholinesterase drugs (neostigmine)",
    ],
    correctAnswers: [
      "Inhalational anesthetics (volatile agents)",
      "Hypermagnesemia",
      "Hypothermia",
    ],
    selectCount: 3,
    rationale: "Potentiators of NDNMB: (1) Volatile agents — augment block at NMJ by unknown mechanism (possibly enhanced postjunctional sensitivity or reduced ACh release); (2) Hypermagnesemia — Mg2+ competes with Ca2+ at the nerve terminal, reducing ACh quantal release, and also stabilizes the postjunctional membrane; (3) Hypothermia — reduces Hofmann elimination of atracurium/cisatracurium, reduces hepatic/renal metabolism of other agents, and prolongs duration. Hypercalcemia ANTAGONIZES block (more Ca2+ → more ACh release). Neostigmine reverses block. Hyperkalemia doesn't significantly potentiate NDNMB.",
    metadata: { topic: "Rocuronium", priority: "high" }
  },

  {
    id: "nmb-034",
    type: "mcq",
    prompt: "Aminoglycoside antibiotics (gentamicin, tobramycin) can interact with neuromuscular blocking agents. What is the mechanism?",
    setup: "",
    ans: [
      { t: "Reduced ACh quantal release from the presynaptic nerve terminal (Ca2+ channel blockade)", ok: true },
      { t: "Direct blockade of nicotinic receptors postjunctionally", ok: false },
      { t: "Inhibition of plasma pseudocholinesterase", ok: false },
      { t: "Potentiation of AChE inhibition by neostigmine", ok: false },
    ],
    rationale: "Aminoglycosides block presynaptic Ca2+ channels required for ACh vesicle exocytosis, reducing the number of ACh quanta released per nerve impulse. They also have some postjunctional stabilizing effect. Net result: they potentiate both depolarizing and non-depolarizing NMBAs, and this block is NOT well reversed by neostigmine. Calcium gluconate administration can partially overcome the aminoglycoside effect. Other drugs that potentiate NMB: local anesthetics, magnesium, volatile agents.",
    metadata: { topic: "Rocuronium", priority: "medium" }
  },

  // ─── SPECIFIC SCENARIOS ───────────────────────────────────────────────────────

  {
    id: "nmb-035",
    type: "mcq",
    prompt: "Malignant hyperthermia is triggered by succinylcholine and volatile agents. Which drug is the specific treatment?",
    setup: "",
    ans: [
      { t: "Dantrolene sodium", ok: true },
      { t: "Bromocriptine (D2 agonist)", ok: false },
      { t: "Cyproheptadine (serotonin antagonist)", ok: false },
      { t: "Sugammadex (to remove the triggering NMBA)", ok: false },
    ],
    rationale: "Dantrolene blocks RYR1 (ryanodine receptor type 1) in the sarcoplasmic reticulum, preventing uncontrolled Ca2+ release. Dose: 2.5 mg/kg IV initially, then 1 mg/kg q5min until symptoms resolve (max ~10 mg/kg). Treatment also includes: stop triggering agents, 100% O2 via hyperventilation, sodium bicarbonate for acidosis, active cooling, treat hyperkalemia, and supportive care. Dantrolene can also be used prophylactically in MH-susceptible patients.",
    metadata: { topic: "Malignant Hyperthermia", priority: "high" }
  },

  {
    id: "nmb-036",
    type: "mcq",
    prompt: "A patient in the PACU has difficulty breathing after abdominal surgery with rocuronium 0.6 mg/kg given 90 minutes ago. The anesthesiologist administered neostigmine 70 mcg/kg at the end of the case. TOF ratio by acceleromyography is now 0.72. What is the BEST next step?",
    setup: "PACU, 90 min after rocuronium, neostigmine given, TOF = 0.72.",
    ans: [
      { t: "Administer sugammadex 2 mg/kg to achieve full reversal", ok: true },
      { t: "Repeat neostigmine 70 mcg/kg (double the dose)", ok: false },
      { t: "Re-intubate and ventilate — neostigmine is the ceiling; further reversal is impossible", ok: false },
      { t: "Administer edrophonium as a shorter-acting reversal agent", ok: false },
    ],
    rationale: "TOF 0.72 means 28% receptor occupancy remains — the patient has RNMB and is at risk for aspiration and respiratory failure. Neostigmine has already been given and repeated dosing is dangerous (could cause cholinergic crisis). Sugammadex (2 mg/kg for moderate block) is the definitive rescue — it directly captures rocuronium regardless of prior neostigmine administration and achieves TOF ≥ 0.9 within minutes. This scenario illustrates the 'rescue sugammadex' role.",
    metadata: { topic: "Reversal Agents", priority: "high" }
  },

  {
    id: "nmb-037",
    type: "mcq",
    prompt: "Which patient population has the HIGHEST risk of hyperkalemia from succinylcholine?",
    setup: "",
    ans: [
      { t: "Patients with thermal burns >24 hours old or major denervation injuries", ok: true },
      { t: "Patients with chronic renal failure but no denervation", ok: false },
      { t: "Patients with myasthenia gravis", ok: false },
      { t: "Neonates under 6 months of age", ok: false },
    ],
    rationale: "Burns (>24h), crush injuries, spinal cord injury, stroke with hemiplegia, prolonged immobilization, and severe disuse atrophy all cause extrajunctional receptor upregulation. Succinylcholine causes K+ efflux from ALL these extra receptors simultaneously. Serum K+ can rise by 5-10+ mEq/L — sufficient for fatal arrhythmias. Chronic renal failure alone causes modest potassium elevation but not extreme succinylcholine-mediated K+ surge unless there is concurrent denervation/upregulation.",
    metadata: { topic: "Hyperkalemia", priority: "high" }
  },

  {
    id: "nmb-038",
    type: "short",
    prompt: "What is the name of the modified gamma-cyclodextrin drug that encapsulates rocuronium to reverse neuromuscular blockade?",
    setup: "",
    acceptedAnswers: [
      "sugammadex", "Sugammadex", "SUGAMMADEX",
      "Bridion", "bridion",
    ],
    rationale: "Sugammadex (brand: Bridion) is a selective relaxant binding agent — a modified gamma-cyclodextrin with a lipophilic cavity that captures the steroidal NMBAs rocuronium and vecuronium. It was FDA-approved in 2015 in the US. Unlike anticholinesterases, it works at any depth of block and has no muscarinic side effects.",
    metadata: { topic: "Reversal Agents", priority: "high" }
  },

  {
    id: "nmb-039",
    type: "mcq",
    prompt: "Vecuronium shares which pharmacokinetic characteristic with rocuronium that makes both good candidates for reversal by sugammadex?",
    setup: "",
    ans: [
      { t: "Both are steroidal (aminosteroidal) non-depolarizing NMBAs", ok: true },
      { t: "Both undergo Hofmann elimination", ok: false },
      { t: "Both are metabolized by pseudocholinesterase", ok: false },
      { t: "Both have quaternary nitrogen groups that create an isoquinolinium structure", ok: false },
    ],
    rationale: "Rocuronium and vecuronium are both aminosteroidal NMBAs — they share a steroidal backbone that fits precisely into sugammadex's cyclodextrin cavity. Sugammadex has higher affinity for rocuronium (Ka = 10^7 M-1) than vecuronium (Ka = 10^6 M-1), so higher doses of sugammadex may be needed for vecuronium reversal in practice. The benzylisoquinolinium agents (atracurium, cisatracurium, mivacurium) are NOT captured by sugammadex.",
    metadata: { topic: "Vecuronium", priority: "medium" }
  },

  {
    id: "nmb-040",
    type: "mcq",
    prompt: "In a 'cannot intubate, cannot oxygenate' (CICO) emergency after RSI with rocuronium 1.2 mg/kg, sugammadex 16 mg/kg is given. Approximately how long until the patient regains spontaneous breathing?",
    setup: "CICO scenario — rocuronium RSI, failed intubation, failed mask ventilation.",
    ans: [
      { t: "~3 minutes (TOF ≥ 0.9 achieved within 3 min in most patients)", ok: true },
      { t: "~15-20 minutes (must wait for hepatic elimination to begin)", ok: false },
      { t: "~10 minutes (equivalent to succinylcholine offset)", ok: false },
      { t: "~30-45 minutes — sugammadex only partially reverses RSI-dose rocuronium", ok: false },
    ],
    rationale: "Studies show 16 mg/kg sugammadex achieves TOF ≥ 0.9 within 2-3 minutes after 1.2 mg/kg rocuronium — making it a true CICO rescue. This has changed RSI practice: in MH-susceptible patients or when succinylcholine is contraindicated, rocuronium 1.2 mg/kg + sugammadex 16 mg/kg is a valid alternative strategy. The patient can potentially resume spontaneous ventilation in ~3 min if sugammadex is immediately available.",
    metadata: { topic: "Reversal Agents", priority: "high" }
  },

  {
    id: "nmb-041",
    type: "mcq",
    prompt: "Which of the following best describes the mechanism of succinylcholine-induced fasciculations before complete block?",
    setup: "",
    ans: [
      { t: "Depolarization of the motor end-plate activates muscle contractile units in an asynchronous, disorganized manner", ok: true },
      { t: "Fasciculations are caused by direct electrical stimulation from the drug's charged moiety", ok: false },
      { t: "Succinylcholine stimulates the alpha motor neuron to fire repetitively", ok: false },
      { t: "Fasciculations reflect the onset of Phase II block converting to non-depolarizing character", ok: false },
    ],
    rationale: "Succinylcholine depolarizes the motor end-plate (mimicking ACh at nAChR), causing asynchronous muscle fiber activation = fasciculations. After this initial depolarization, the membrane remains depolarized (channels inactivated) and cannot respond to further ACh — producing the flaccid paralysis (Phase I block). Fasciculations can be attenuated (not eliminated) by precurarization: giving a small dose of an NDNMBA (e.g., rocuronium 0.06 mg/kg) 3 min before succinylcholine.",
    metadata: { topic: "Succinylcholine", priority: "medium" }
  },

  {
    id: "nmb-042",
    type: "mcq",
    prompt: "The ED95 for succinylcholine is approximately 0.3 mg/kg, but the typical intubating dose is 1–1.5 mg/kg. Why is such a large dose used relative to ED95?",
    setup: "",
    ans: [
      { t: "To ensure rapid complete block (excellent intubating conditions) within 60 seconds", ok: true },
      { t: "To minimize fasciculations and myalgia side effects", ok: false },
      { t: "Higher doses are needed because pseudocholinesterase rapidly breaks it down before it reaches the NMJ", ok: false },
      { t: "Lower doses of succinylcholine cause Phase II block", ok: false },
    ],
    rationale: "3-5× ED95 of succinylcholine (0.3 × 5 = 1.5 mg/kg) is used for RSI to ensure rapid, complete neuromuscular block — excellent intubating conditions within 45-60 seconds. The large overdose provides a safety margin and accounts for pharmacokinetic variability. Pseudocholinesterase begins hydrolysis immediately after injection, so a larger bolus ensures sufficient drug reaches the NMJ before significant breakdown. The tradeoff is more pronounced fasciculations and myalgia.",
    metadata: { topic: "Succinylcholine", priority: "medium" }
  },

  {
    id: "nmb-043",
    type: "mcq",
    prompt: "A patient with myasthenia gravis (MG) will require general anesthesia. Which statement about NMBA use in MG is MOST accurate?",
    setup: "Patient with known myasthenia gravis, on pyridostigmine, for thymectomy.",
    ans: [
      { t: "MG patients are very sensitive to non-depolarizing NMBAs; use reduced doses with careful monitoring", ok: true },
      { t: "MG patients are resistant to succinylcholine and require 2–3× normal doses", ok: false },
      { t: "MG patients respond normally to all NMBAs; no dose adjustment needed", ok: false },
      { t: "Non-depolarizing NMBAs are absolutely contraindicated in MG", ok: false },
    ],
    rationale: "In myasthenia gravis, autoantibodies reduce the number of functional nicotinic AChRs at the NMJ. Therefore: (1) NDNMBAs — patients are EXQUISITELY sensitive (may only need 10-20% of normal dose); (2) Succinylcholine — patients are RESISTANT to depolarizing block (fewer functional receptors, larger margin for complete depolarization). Use quantitative TOF monitoring, low initial NDNMBA doses, and have sugammadex/neostigmine immediately available.",
    metadata: { topic: "Monitoring", priority: "high" }
  },

  {
    id: "nmb-044",
    type: "short",
    prompt: "What class of molecule is rocuronium (hint: relates to its chemical structure, not its receptor action)?",
    setup: "",
    acceptedAnswers: [
      "aminosteroidal",
      "Aminosteroidal",
      "steroidal",
      "Steroidal",
      "aminosteroid",
      "Aminosteroid",
    ],
    rationale: "Rocuronium, vecuronium, and pancuronium are all aminosteroidal (steroidal) non-depolarizing NMBAs — they have a steroidal core structure. This is important because sugammadex specifically encapsulates steroidal NMBAs via hydrophobic interactions. The other main class is benzylisoquinolinium agents (atracurium, cisatracurium, mivacurium) — these are NOT reversed by sugammadex.",
    metadata: { topic: "Rocuronium", priority: "medium" }
  },

  {
    id: "nmb-045",
    type: "mcq",
    prompt: "Which statement best explains why succinylcholine has a uniquely short duration among NMBAs despite having the same receptor target as ACh?",
    setup: "",
    ans: [
      { t: "Succinylcholine is rapidly hydrolyzed by pseudocholinesterase in plasma before significant accumulation at the NMJ", ok: true },
      { t: "True AChE at the NMJ breaks down succinylcholine as efficiently as ACh", ok: false },
      { t: "Succinylcholine undergoes Hofmann elimination at physiologic pH", ok: false },
      { t: "The charged quaternary structure of succinylcholine limits CNS penetration and facilitates rapid renal clearance", ok: false },
    ],
    rationale: "Succinylcholine's brief duration (8-10 min) is due to rapid plasma hydrolysis by pseudocholinesterase (plasma cholinesterase), NOT AChE at the NMJ. AChE cannot hydrolyze succinylcholine efficiently. The drug is destroyed in plasma BEFORE most of it reaches the NMJ, and the portion that does reach the NMJ dissipates as the plasma concentration falls and the drug diffuses back out of the cleft.",
    metadata: { topic: "Succinylcholine", priority: "medium" }
  },

  // ─── NMB ADVANCED (ppt-gap) ──────────────────────────────────────────────────

  {
    id: "nmb-046",
    type: "mcq",
    prompt: "What structural feature is hidden within bulky benzene rings in non-depolarizing neuromuscular blockers?",
    setup: "",
    ans: [
      { t: "Single ACh structure", ok: false },
      { t: "Double ACh structure", ok: true },
      { t: "Calcium binding site", ok: false },
      { t: "Sodium channel mimic", ok: false },
    ],
    rationale: "Non-depolarizing agents structurally resemble two acetylcholine molecules, allowing receptor binding without activation, producing competitive blockade.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-047",
    type: "mcq",
    prompt: "What is the primary renal handling characteristic of highly hydrophilic neuromuscular blockers?",
    setup: "",
    ans: [
      { t: "Tubular reabsorption", ok: false },
      { t: "Hepatic metabolism first", ok: false },
      { t: "Filtered without reabsorption", ok: true },
      { t: "Stored in fat", ok: false },
    ],
    rationale: "Their water solubility allows glomerular filtration without tubular reabsorption, contributing to elimination.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-048",
    type: "mcq",
    prompt: "Under what condition do steroidal neuromuscular blocker metabolites accumulate to clinically significant levels?",
    setup: "",
    ans: [
      { t: "Single bolus dose", ok: false },
      { t: "Rapid sequence induction", ok: false },
      { t: "Continuous infusion over several days", ok: true },
      { t: "Low protein states", ok: false },
    ],
    rationale: "Accumulation becomes significant only with prolonged administration such as multi-day infusions.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-049",
    type: "mcq",
    prompt: "Why is mivacurium prolonged in patients with renal insufficiency?",
    setup: "",
    ans: [
      { t: "Reduced renal clearance", ok: false },
      { t: "Increased hepatic metabolism", ok: false },
      { t: "Decreased plasma cholinesterase activity", ok: true },
      { t: "Increased receptor sensitivity", ok: false },
    ],
    rationale: "Mivacurium is metabolized by plasma cholinesterase, and renal failure reduces enzyme activity, prolonging drug effect.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-050",
    type: "mcq",
    prompt: "Why must induction anesthesia be administered before giving a defasciculating dose of a non-depolarizing neuromuscular blocker?",
    setup: "",
    ans: [
      { t: "Prevent hypertension", ok: false },
      { t: "Avoid airway edema", ok: false },
      { t: "Prevent conscious weakness and distress", ok: true },
      { t: "Improve drug metabolism", ok: false },
    ],
    rationale: "A small dose of a non-depolarizer can cause muscle weakness and impaired breathing while the patient is still conscious.",
    metadata: { topic: "Succinylcholine", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-051",
    type: "mcq",
    prompt: "Does the magnitude of hyperkalemia following succinylcholine correlate with the size of a burn injury?",
    setup: "",
    ans: [
      { t: "Yes, directly proportional", ok: false },
      { t: "Yes, inversely proportional", ok: false },
      { t: "No correlation", ok: true },
      { t: "Only in large burns", ok: false },
    ],
    rationale: "Even small burns can cause severe hyperkalemia due to receptor upregulation.",
    metadata: { topic: "Hyperkalemia", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-052",
    type: "mcq",
    prompt: "Why were early alternatives to d-tubocurarine not considered clinically advantageous?",
    setup: "",
    ans: [
      { t: "Caused severe arrhythmias", ok: false },
      { t: "Increased mortality", ok: false },
      { t: "No meaningful clinical improvement", ok: true },
      { t: "Too short acting", ok: false },
    ],
    rationale: "Although some reduced histamine release, they did not significantly improve clinical outcomes.",
    metadata: { topic: "NMB Pharmacology", priority: "low", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-053",
    type: "mcq",
    prompt: "Why do neuromuscular blockers have minimal placental transfer?",
    setup: "",
    ans: [
      { t: "High protein binding", ok: false },
      { t: "Rapid metabolism", ok: false },
      { t: "Poor lipid solubility", ok: true },
      { t: "Active transport out", ok: false },
    ],
    rationale: "Quaternary ammonium structure makes them highly polar, preventing passage across lipid membranes.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-054",
    type: "mcq",
    prompt: "Why can repeated doses of non-depolarizing neuromuscular blockers cause prolonged paralysis in renal failure?",
    setup: "",
    ans: [
      { t: "Increased receptor sensitivity", ok: false },
      { t: "Drug accumulation", ok: true },
      { t: "Faster metabolism", ok: false },
      { t: "Increased protein binding", ok: false },
    ],
    rationale: "Impaired elimination leads to accumulation with repeated dosing.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-055",
    type: "mcq",
    prompt: "Why is maintaining normothermia important when interpreting neuromuscular blockade?",
    setup: "",
    ans: [
      { t: "Prevents bradycardia", ok: false },
      { t: "Improves oxygenation", ok: false },
      { t: "Prevents accumulation", ok: false },
      { t: "Ensures accurate drug effect assessment", ok: true },
    ],
    rationale: "Hypothermia prolongs drug action and alters interpretation of blockade.",
    metadata: { topic: "Monitoring", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-056",
    type: "multi",
    prompt: "Select TWO conditions that slow Hoffmann elimination:",
    setup: "",
    choices: [
      "Hypothermia",
      "Acidosis",
      "Hyperthermia",
      "Alkalosis",
    ],
    correctAnswers: ["Hypothermia", "Acidosis"],
    selectCount: 2,
    rationale: "Hoffmann elimination is dependent on temperature and pH, so hypothermia and acidosis slow the process.",
    metadata: { topic: "Hofmann", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-057",
    type: "multi",
    prompt: "Select TWO characteristics that prevent neuromuscular blockers from crossing the blood-brain barrier:",
    setup: "",
    choices: [
      "High lipid solubility",
      "Quaternary ammonium structure",
      "High polarity",
      "Small molecular size",
    ],
    correctAnswers: ["Quaternary ammonium structure", "High polarity"],
    selectCount: 2,
    rationale: "Their charged, polar structure prevents passage through lipid membranes like the BBB.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-058",
    type: "multi",
    prompt: "Select TWO factors to consider when dosing neuromuscular blockers in obese patients:",
    setup: "",
    choices: [
      "Total body weight",
      "Lean body mass",
      "Increased fat mass",
      "Increased renal clearance",
    ],
    correctAnswers: ["Lean body mass", "Increased fat mass"],
    selectCount: 2,
    rationale: "Lean body mass is used because fat does not contribute to drug clearance, and obesity decreases elimination efficiency.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-059",
    type: "multi",
    prompt: "Select TWO statements that describe dosing considerations in severe hepatobiliary disease:",
    setup: "",
    choices: [
      "Initial dose should be decreased",
      "Initial dose may need to be increased",
      "Volume of distribution is increased",
      "Clearance is unchanged",
    ],
    correctAnswers: ["Initial dose may need to be increased", "Volume of distribution is increased"],
    selectCount: 2,
    rationale: "Increased volume of distribution causes initial resistance, requiring higher initial dosing.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-060",
    type: "multi",
    prompt: "Select THREE changes in elderly patients that affect neuromuscular blocker duration:",
    setup: "",
    choices: [
      "Increased renal blood flow",
      "Decreased hepatic blood flow",
      "Decreased cardiac output",
      "Increased total body water",
      "Increased body fat",
    ],
    correctAnswers: ["Decreased hepatic blood flow", "Decreased cardiac output", "Increased body fat"],
    selectCount: 3,
    rationale: "Reduced organ function and increased fat lead to prolonged drug effects.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-061",
    type: "multi",
    prompt: "Select TWO true statements regarding neuromuscular blockers in renal failure:",
    setup: "",
    choices: [
      "Single doses are always prolonged",
      "Repeated doses may accumulate",
      "Clearance is increased",
      "Enzymatic activity may be reduced",
    ],
    correctAnswers: ["Repeated doses may accumulate", "Enzymatic activity may be reduced"],
    selectCount: 2,
    rationale: "Accumulation occurs with repeated dosing and enzymatic activity may be decreased.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },

  {
    id: "nmb-062",
    type: "multi",
    prompt: "Select TWO conditions that prolong drugs dependent on organ elimination:",
    setup: "",
    choices: [
      "Obesity",
      "Renal failure",
      "Hyperthermia",
      "Increased metabolism",
    ],
    correctAnswers: ["Obesity", "Renal failure"],
    selectCount: 2,
    rationale: "Both reduce effective elimination, prolonging drug action.",
    metadata: { topic: "NMB Pharmacology", priority: "medium", category: "NMB-advanced", source: "ppt-gap" }
  },


  // ─── PSEUDOCHOLINESTERASE / DRUG INTERACTIONS / CLINICAL PHARMACOLOGY ────────

  {
    id: "boa-node10-nmb-001",
    type: "multi",
    prompt: "Which of the following physiological conditions or disease states are explicitly known to decrease a patient's pseudocholinesterase (plasma ChE) concentration?",
    setup: "",
    choices: [
      "The presence of severe liver disease.",
      "The physiological state of pregnancy.",
      "The presence of neoplastic disease.",
      "The presence of hyperthyroidism.",
      "The physiological state of hypothermia.",
    ],
    correctAnswers: [
      "The presence of severe liver disease.",
      "The physiological state of pregnancy.",
      "The presence of neoplastic disease.",
    ],
    selectCount: 3,
    rationale: "Liver disease, pregnancy, and neoplastic disease are identified as states that decrease pseudocholinesterase concentrations.",
    metadata: { topic: "Pseudocholinesterase", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "pseudocholinesterase", "succinylcholine", "pharmacology", "physiology"] }
  },

  {
    id: "boa-node10-nmb-002",
    type: "multi",
    prompt: "Which of the following specific classes of oral medications are known to cause a decrease in pseudocholinesterase concentration?",
    setup: "",
    choices: [
      "Monoamine oxidase (MAO) inhibitors.",
      "Oral contraceptive medications.",
      "Beta-blocker antihypertensives.",
      "Calcium channel blockers.",
    ],
    correctAnswers: [
      "Monoamine oxidase (MAO) inhibitors.",
      "Oral contraceptive medications.",
    ],
    selectCount: 2,
    rationale: "MAO inhibitors and oral contraceptives decrease plasma cholinesterase concentrations.",
    metadata: { topic: "Pseudocholinesterase", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "pseudocholinesterase", "drug effects", "pharmacology"] }
  },

  {
    id: "boa-node10-nmb-003",
    type: "multi",
    prompt: "Which of the following specific ophthalmic or anticholinesterase agents are associated with a decrease in pseudocholinesterase concentrations?",
    setup: "",
    choices: [
      "The organophosphate pesticide agents.",
      "The reversal agent neostigmine.",
      "The glaucoma medication echothiophate.",
      "The anticholinergic agent atropine.",
      "The anticholinergic agent glycopyrrolate.",
    ],
    correctAnswers: [
      "The organophosphate pesticide agents.",
      "The reversal agent neostigmine.",
      "The glaucoma medication echothiophate.",
    ],
    selectCount: 3,
    rationale: "Anticholinesterases like neostigmine, organophosphates, and echothiophate decrease pseudocholinesterase concentrations.",
    metadata: { topic: "Pseudocholinesterase", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "pseudocholinesterase", "anticholinesterase", "echothiophate"] }
  },

  {
    id: "boa-node10-nmb-004",
    type: "multi",
    prompt: "Which of the following unique or specific drug therapies actively decrease a patient's pseudocholinesterase levels?",
    setup: "",
    choices: [
      "The administration of cytotoxic drugs.",
      "The administration of metoclopramide.",
      "The administration of bambuterol.",
      "The administration of dexamethasone.",
      "The administration of ondansetron.",
    ],
    correctAnswers: [
      "The administration of cytotoxic drugs.",
      "The administration of metoclopramide.",
      "The administration of bambuterol.",
    ],
    selectCount: 3,
    rationale: "Cytotoxic drugs, metoclopramide, and bambuterol decrease pseudocholinesterase concentrations.",
    metadata: { topic: "Pseudocholinesterase", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "pseudocholinesterase", "drug effects", "metoclopramide", "bambuterol"] }
  },

  {
    id: "boa-node10-nmb-005",
    type: "multi",
    prompt: "What specific clinical characteristics explicitly describe the mechanism and use of the drug echothiophate?",
    setup: "",
    choices: [
      "It is primarily utilized as a drug for glaucoma.",
      "It irreversibly inhibits pseudocholinesterase.",
      "It reversibly inhibits pseudocholinesterase.",
      "It is primarily utilized as a systemic vasopressor.",
    ],
    correctAnswers: [
      "It is primarily utilized as a drug for glaucoma.",
      "It irreversibly inhibits pseudocholinesterase.",
    ],
    selectCount: 2,
    rationale: "Echothiophate is used for glaucoma and irreversibly inhibits pseudocholinesterase.",
    metadata: { topic: "Pseudocholinesterase", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "echothiophate", "pseudocholinesterase", "glaucoma"] }
  },

  {
    id: "boa-node10-nmb-006",
    type: "multi",
    prompt: "Which of the following statements correctly describe the relationship between specific cardiovascular or respiratory drugs and pseudocholinesterase concentrations?",
    setup: "",
    choices: [
      "Bambuterol acts as a pro-drug of terbutaline to decrease concentrations.",
      "Esmolol decreases concentrations, although the prolongation is insignificant.",
      "Esmolol decreases concentrations, causing severely significant prolongation.",
      "Bambuterol acts as a pro-drug of albuterol to increase concentrations.",
    ],
    correctAnswers: [
      "Bambuterol acts as a pro-drug of terbutaline to decrease concentrations.",
      "Esmolol decreases concentrations, although the prolongation is insignificant.",
    ],
    selectCount: 2,
    rationale: "Bambuterol is a pro-drug of terbutaline that decreases plasma cholinesterase. Esmolol also decreases it, though the prolongation is noted as insignificant.",
    metadata: { topic: "Pseudocholinesterase", priority: "medium", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "pseudocholinesterase", "esmolol", "bambuterol"] }
  },

  // ─── SUCCINYLCHOLINE HYPERKALEMIA ─────────────────────────────────────────────

  {
    id: "boa-node10-nmb-007",
    type: "multi",
    prompt: "Administration of succinylcholine can cause a massive 5 to 10 mEq/L increase in serum potassium in patients suffering from which of the following traumatic or neurological conditions?",
    setup: "",
    choices: [
      "Severe burn injuries.",
      "Severe systemic trauma.",
      "Direct nerve damage.",
      "Closed head injuries.",
      "Uncomplicated appendicitis.",
      "Minor extremity lacerations.",
    ],
    correctAnswers: [
      "Severe burn injuries.",
      "Severe systemic trauma.",
      "Direct nerve damage.",
      "Closed head injuries.",
    ],
    selectCount: 4,
    rationale: "Potassium can increase by 5 to 10 mEq/L with burns, trauma, nerve damage, and closed head injuries.",
    metadata: { topic: "Succinylcholine Hyperkalemia", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "succinylcholine", "potassium", "hyperkalemia", "contraindications"] }
  },

  {
    id: "boa-node10-nmb-008",
    type: "multi",
    prompt: "Which of the following systemic medical conditions explicitly predispose a patient to a dangerous 5 to 10 mEq/L increase in potassium following succinylcholine administration?",
    setup: "",
    choices: [
      "Severe renal failure.",
      "Severe metabolic acidosis.",
      "Preexisting neuromuscular disease.",
      "Severe hepatic failure.",
      "Preexisting respiratory alkalosis.",
    ],
    correctAnswers: [
      "Severe renal failure.",
      "Severe metabolic acidosis.",
      "Preexisting neuromuscular disease.",
    ],
    selectCount: 3,
    rationale: "Neuromuscular disease, renal failure, and metabolic acidosis are associated with a marked potassium rise after succinylcholine.",
    metadata: { topic: "Succinylcholine Hyperkalemia", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "succinylcholine", "potassium", "hyperkalemia", "neuromuscular disease"] }
  },

  {
    id: "boa-node10-nmb-009",
    type: "multi",
    prompt: "In addition to trauma and metabolic derangements, which of the following specific conditions will cause a 5 to 10 mEq/L increase in potassium when succinylcholine is administered?",
    setup: "",
    choices: [
      "Intra-abdominal infections.",
      "Severe burn injuries.",
      "Minor viral infections.",
      "Superficial skin abrasions.",
    ],
    correctAnswers: [
      "Intra-abdominal infections.",
      "Severe burn injuries.",
    ],
    selectCount: 2,
    rationale: "Intra-abdominal infections and burns are listed as causes for a major potassium increase after succinylcholine.",
    metadata: { topic: "Succinylcholine Hyperkalemia", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "succinylcholine", "potassium", "burns", "infection"] }
  },

  // ─── PANCURONIUM ─────────────────────────────────────────────────────────────

  {
    id: "boa-node10-nmb-010",
    type: "multi",
    prompt: "What specific cardiovascular side effects are explicitly characteristic of the administration of pancuronium?",
    setup: "",
    choices: [
      "It produces a moderately vagolytic effect causing tachycardia.",
      "It produces direct systemic sympathetic stimulation.",
      "It explicitly increases both the heart rate and blood pressure.",
      "It produces a moderately vagotonic effect causing bradycardia.",
      "It explicitly decreases both the heart rate and blood pressure.",
    ],
    correctAnswers: [
      "It produces a moderately vagolytic effect causing tachycardia.",
      "It produces direct systemic sympathetic stimulation.",
      "It explicitly increases both the heart rate and blood pressure.",
    ],
    selectCount: 3,
    rationale: "Pancuronium is moderately vagolytic, stimulates the sympathetic nervous system, and increases heart rate and blood pressure.",
    metadata: { topic: "Pancuronium", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "pancuronium", "cardiovascular", "tachycardia", "sympathetic"] }
  },

  {
    id: "boa-node10-nmb-011",
    type: "mcq",
    prompt: "What anatomical organ serves as the primary pathway for the major metabolism and elimination of pancuronium?",
    setup: "",
    ans: [
      { t: "The primary elimination is strictly through the kidney.", ok: true },
      { t: "The primary elimination is strictly through the liver.", ok: false },
      { t: "The primary elimination is strictly through plasma esterases.", ok: false },
      { t: "The primary elimination is strictly through Hofmann elimination.", ok: false },
    ],
    rationale: "The major metabolism and elimination pathway for pancuronium is through the kidney.",
    metadata: { topic: "Pancuronium", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "pancuronium", "renal elimination", "pharmacokinetics"] }
  },

  // ─── HEPATOBILIARY DISEASE EFFECTS ───────────────────────────────────────────

  {
    id: "boa-node10-nmb-012",
    type: "multi",
    prompt: "How does hepatobiliary disease specifically alter the volume of distribution and the subsequent dosing requirements for neuromuscular blockers?",
    setup: "",
    choices: [
      "It explicitly increases the overall volume of distribution.",
      "It creates an initial resistance to the muscle relaxant.",
      "It requires the initial doses to be slightly higher.",
      "It explicitly decreases the overall volume of distribution.",
      "It requires the initial doses to be slightly lower.",
    ],
    correctAnswers: [
      "It explicitly increases the overall volume of distribution.",
      "It creates an initial resistance to the muscle relaxant.",
      "It requires the initial doses to be slightly higher.",
    ],
    selectCount: 3,
    rationale: "Hepatobiliary disease increases the volume of distribution, causing initial resistance and potentially requiring slightly higher initial doses.",
    metadata: { topic: "Hepatobiliary Disease", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "hepatobiliary disease", "volume of distribution", "dosing"] }
  },

  {
    id: "boa-node10-nmb-013",
    type: "multi",
    prompt: "Hepatobiliary disease actively alters the elimination of non-depolarizing muscle relaxants through which of the following specific mechanisms?",
    setup: "",
    choices: [
      "By increasing the plasma concentration of bile salts.",
      "By decreasing the hepatic uptake of pancuronium.",
      "By decreasing the hepatic uptake of vecuronium.",
      "By increasing the synthesis of plasma cholinesterase.",
      "By increasing the hepatic uptake of pancuronium.",
    ],
    correctAnswers: [
      "By increasing the plasma concentration of bile salts.",
      "By decreasing the hepatic uptake of pancuronium.",
      "By decreasing the hepatic uptake of vecuronium.",
    ],
    selectCount: 3,
    rationale: "Hepatobiliary disease increases plasma bile salts and decreases the hepatic uptake of pancuronium and vecuronium.",
    metadata: { topic: "Hepatobiliary Disease", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "hepatobiliary disease", "pancuronium", "vecuronium", "elimination"] }
  },

  {
    id: "boa-node10-nmb-014",
    type: "multi",
    prompt: "Which of the following specific clinical effects occur to neuromuscular blockers as a direct result of severe liver disease?",
    setup: "",
    choices: [
      "The clinical recovery phase is significantly slower.",
      "The duration of mivacurium is significantly prolonged.",
      "The clinical recovery phase is significantly faster.",
      "The duration of mivacurium is significantly shortened.",
    ],
    correctAnswers: [
      "The clinical recovery phase is significantly slower.",
      "The duration of mivacurium is significantly prolonged.",
    ],
    selectCount: 2,
    rationale: "Severe liver disease decreases plasma cholinesterase synthesis, prolonging mivacurium and slowing clinical recovery.",
    metadata: { topic: "Hepatobiliary Disease", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "liver disease", "mivacurium", "pseudocholinesterase", "recovery"] }
  },

  // ─── ELIMINATION / DURATION PHARMACOKINETICS ─────────────────────────────────

  {
    id: "boa-node10-nmb-015",
    type: "multi",
    prompt: "How does decreased systemic elimination specifically affect the clinical duration of neuromuscular blocking drugs?",
    setup: "",
    choices: [
      "It prolongs the duration especially with prolonged use.",
      "Repeated doses may be prolonged even if a single dose is not.",
      "A single dose is always strictly prolonged regardless of repeated use.",
      "It shortens the duration especially with prolonged use.",
    ],
    correctAnswers: [
      "It prolongs the duration especially with prolonged use.",
      "Repeated doses may be prolonged even if a single dose is not.",
    ],
    selectCount: 2,
    rationale: "Decreased elimination prolongs duration, especially with prolonged use. Repeated doses may be prolonged even when a single dose is not.",
    metadata: { topic: "Pharmacokinetics", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "elimination", "duration", "pharmacokinetics"] }
  },

  {
    id: "boa-node10-nmb-016",
    type: "multi",
    prompt: "A decrease in plasma cholinesterase enzymatic activity will specifically prolong the duration of which of the following neuromuscular blockers?",
    setup: "",
    choices: [
      "The depolarizing agent succinylcholine.",
      "The non-depolarizing agent mivacurium.",
      "The non-depolarizing agent atracurium.",
      "The non-depolarizing agent cisatracurium.",
    ],
    correctAnswers: [
      "The depolarizing agent succinylcholine.",
      "The non-depolarizing agent mivacurium.",
    ],
    selectCount: 2,
    rationale: "Decreased plasma cholinesterase activity prolongs the duration of succinylcholine and mivacurium.",
    metadata: { topic: "Pharmacokinetics", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "pseudocholinesterase", "succinylcholine", "mivacurium", "duration"] }
  },

  {
    id: "boa-node10-nmb-017",
    type: "multi",
    prompt: "Which of the following neuromuscular blocking agents are explicitly NOT prolonged by decreased elimination or decreased enzymatic activity?",
    setup: "",
    choices: [
      "The specific agent atracurium.",
      "The specific agent cisatracurium.",
      "The specific agent succinylcholine.",
      "The specific agent mivacurium.",
    ],
    correctAnswers: [
      "The specific agent atracurium.",
      "The specific agent cisatracurium.",
    ],
    selectCount: 2,
    rationale: "Atracurium and cisatracurium are not prolonged by decreased elimination or decreased plasma cholinesterase activity.",
    metadata: { topic: "Pharmacokinetics", priority: "high", category: "nmb", source: "node-10-chapter-10", tags: ["node-10", "chapter-10", "NMB", "atracurium", "cisatracurium", "Hofmann elimination", "duration"] }
  },

];

export const NMB_METADATA = {
  nodeId: "node-10",
  courseId: "basics-of-anesthesia",
  chapter: "Chapter 10",
  title: "Neuromuscular Blockers",
  totalQuestions: NMB_QUESTIONS.length,
  questionTypes: {
    mcq: NMB_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: NMB_QUESTIONS.filter(q => q.type === 'multi').length,
    short: NMB_QUESTIONS.filter(q => q.type === 'short').length,
  }
};
