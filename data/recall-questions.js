export const RECALL_QUESTIONS_BASICS = [

  // 1a. Malignant Hyperthermia — Recognition and Dantrolene — node-7
  {
    id: 'r-mh-1a',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-7',
    prompt: 'A patient develops malignant hyperthermia 20 minutes after sevoflurane induction. Describe the immediate first three actions and the critical drug, including its dose and redosing.',
    rubric: {
      key_points: [
        { id: 'discontinue', weight: 1, description: 'Discontinue triggering agent (volatile anesthetic, succinylcholine)' },
        { id: 'hyperventilate', weight: 1, description: 'Hyperventilate with 100% FiO2 at high fresh gas flows (10 L/min+)' },
        { id: 'dantrolene', weight: 2, description: 'Administer dantrolene 2.5 mg/kg IV bolus, repeat q5-10min up to 10 mg/kg' },
        { id: 'call_help', weight: 1, description: 'Call for help; activate MH hotline (1-800-MH-HYPER)' },
      ],
      common_errors: [
        'Confusing dantrolene with diazepam',
        'Quoting incorrect dantrolene dose (e.g., 1 mg/kg)',
        'Suggesting to continue volatile anesthetic',
      ],
      minimum_passing_score: 60,
    },
    topic: 'malignant-hyperthermia',
    chapter: 'crisis-management',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Miller Ch 73', topic: 'malignant-hyperthermia' },
  },

  // 1b. Malignant Hyperthermia — Supportive Management — node-7
  {
    id: 'r-mh-1b',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-7',
    prompt: 'After administering dantrolene for malignant hyperthermia, what supportive measures do you initiate? Describe cooling techniques and metabolic derangement management.',
    rubric: {
      key_points: [
        { id: 'cool', weight: 2, description: 'Active cooling (cold IV fluids, ice packs to groin/axilla, cold gastric lavage)' },
        { id: 'treat_acidosis', weight: 2, description: 'Treat metabolic acidosis with bicarbonate, treat hyperkalemia' },
        { id: 'monitor', weight: 1, description: 'Monitor core temperature, ETCO2, ABG, serum potassium, CK, urine output; continue dantrolene until signs of MH resolve' },
      ],
      common_errors: [
        'Stopping dantrolene too early before clinical signs resolve',
        'Failing to monitor for recrudescence in the 24-48 hours after initial episode',
      ],
      minimum_passing_score: 60,
    },
    topic: 'malignant-hyperthermia',
    chapter: 'crisis-management',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Miller Ch 73', topic: 'malignant-hyperthermia' },
  },

  // 2a. LAST — Immediate Management and Seizure Control — node-3
  {
    id: 'r-last-1a',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-3',
    prompt: 'A patient receiving a brachial plexus block with bupivacaine develops perioral numbness, tinnitus, and then a seizure. Describe your immediate management steps and how you control the seizure.',
    rubric: {
      key_points: [
        { id: 'stop_injection', weight: 1, description: 'Stop injection of local anesthetic immediately' },
        { id: 'call_help', weight: 1, description: 'Call for help, get LAST rescue kit / Intralipid' },
        { id: 'airway', weight: 1, description: 'Manage airway — 100% O2, intubate if needed, avoid hyperventilation' },
        { id: 'seizure_benzo', weight: 2, description: 'Treat seizures with benzodiazepine (midazolam) or small-dose propofol; avoid large doses of propofol' },
      ],
      common_errors: [
        'Using epinephrine in large boluses (small doses only if needed)',
        'Treating with lidocaine during LAST from another local anesthetic',
      ],
      minimum_passing_score: 60,
    },
    topic: 'local-anesthetic-systemic-toxicity',
    chapter: 'pharmacologic-principles',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Barash Ch 36', topic: 'local-anesthetic-systemic-toxicity' },
  },

  // 2b. LAST — Intralipid Rescue and Cardiac Arrest — node-3
  {
    id: 'r-last-1b',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-3',
    prompt: 'A patient in LAST progresses to cardiovascular collapse despite initial seizure management. Describe the Intralipid rescue protocol, its dose, and which ACLS drugs must be avoided.',
    rubric: {
      key_points: [
        { id: 'intralipid', weight: 2, description: 'Administer 20% Intralipid: 1.5 mL/kg IV bolus over 1 min, then 0.25 mL/kg/min infusion' },
        { id: 'avoid_vasopressin', weight: 1, description: 'Avoid vasopressin, calcium channel blockers, beta-blockers, and lidocaine in ACLS' },
        { id: 'cpr_if_needed', weight: 1, description: 'Start CPR if cardiac arrest; consider cardiopulmonary bypass for refractory arrest' },
        { id: 'epi_small', weight: 1, description: 'If epinephrine is needed, use small boluses (<1 mcg/kg); large doses can worsen LAST cardiac toxicity' },
      ],
      common_errors: [
        'Forgetting Intralipid entirely',
        'Using standard ACLS epinephrine doses (1 mg boluses) which can worsen LAST',
        'Treating with lidocaine during LAST from another local anesthetic',
      ],
      minimum_passing_score: 60,
    },
    topic: 'local-anesthetic-systemic-toxicity',
    chapter: 'pharmacologic-principles',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Barash Ch 36', topic: 'local-anesthetic-systemic-toxicity' },
  },

  // 3a. Anaphylaxis — Epinephrine and Volume — node-3
  {
    id: 'r-anaphylaxis-1a',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-3',
    prompt: 'You suspect anaphylaxis during a general anesthetic — hypotension, bronchospasm, diffuse rash. Describe the first three critical actions including the key drug, its dose, and fluid management.',
    rubric: {
      key_points: [
        { id: 'remove_trigger', weight: 1, description: 'Remove or discontinue the suspected trigger (antibiotics, NMBAs, latex, colloids)' },
        { id: 'epinephrine', weight: 2, description: 'Administer epinephrine: 10-100 mcg IV boluses (adults), titrate to effect; infusion if refractory' },
        { id: 'volume', weight: 1, description: 'Aggressive IV fluid resuscitation (crystalloid 1-2 L bolus, may need 4-8 L total)' },
        { id: 'fio2', weight: 1, description: '100% FiO2; ensure adequate ventilation' },
      ],
      common_errors: [
        'Omitting epinephrine or using too-small doses',
        'Confusing anaphylaxis doses with cardiac arrest doses (1 mg vs 10-100 mcg)',
        'Forgetting volume resuscitation',
      ],
      minimum_passing_score: 60,
    },
    topic: 'anaphylaxis',
    chapter: 'autonomic-pharmacology',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Miller Ch 86', topic: 'anaphylaxis' },
  },

  // 3b. Anaphylaxis — Refractory Management and Adjuncts — node-3
  {
    id: 'r-anaphylaxis-1b',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-3',
    prompt: 'Anaphylaxis under anesthesia is not responding to initial epinephrine boluses. What secondary vasopressors do you use, and what adjunct medications do you add? Include doses.',
    rubric: {
      key_points: [
        { id: 'secondary_vasopressors', weight: 2, description: 'Consider vasopressin 1-2 units IV for refractory hypotension; norepinephrine infusion' },
        { id: 'steroids_antihistamines', weight: 1, description: 'Corticosteroids (hydrocortisone 200 mg IV or methylprednisolone) and antihistamines (diphenhydramine, ranitidine) as adjuncts' },
        { id: 'epi_infusion', weight: 1, description: 'Transition from epinephrine boluses to continuous infusion (0.05-0.5 mcg/kg/min) for sustained hemodynamic support' },
        { id: 'bronchospasm', weight: 1, description: 'Treat persistent bronchospasm with inhaled albuterol; consider ketamine or inhaled epinephrine for severe cases' },
      ],
      common_errors: [
        'Relying solely on epinephrine boluses without escalating to infusion',
        'Omitting steroids — they reduce the biphasic late-phase reaction',
      ],
      minimum_passing_score: 60,
    },
    topic: 'anaphylaxis',
    chapter: 'autonomic-pharmacology',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Miller Ch 86', topic: 'anaphylaxis' },
  },

  // 4. Succinylcholine hyperkalemia in burns — node-10
  {
    id: 'r-sch-k-1',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-10',
    prompt: 'Explain the mechanism by which succinylcholine causes life-threatening hyperkalemia in a burn patient. When does the risk begin, and when does it resolve?',
    rubric: {
      key_points: [
        { id: 'upregulation', weight: 2, description: 'Burns cause proliferation and upregulation of extrajunctional (immature/fetal) nicotinic acetylcholine receptors across the muscle membrane' },
        { id: 'prolonged_opening', weight: 1, description: 'These extrajunctional receptors have prolonged channel opening time, causing massive efflux of intracellular potassium when depolarized by succinylcholine' },
        { id: 'normal_vs_abnormal', weight: 1, description: 'Normal K+ rise with succinylcholine is ~0.5 mEq/L; in burn patients the rise can be 5-10+ mEq/L, causing cardiac arrest' },
        { id: 'onset_timing', weight: 1, description: 'Risk begins approximately 24-48 hours after the burn injury (not immediately)' },
        { id: 'resolution', weight: 1, description: 'Risk persists for 1-2 years after burn or until wounds are fully healed and receptor expression normalizes' },
      ],
      common_errors: [
        'Saying the risk starts immediately after the burn (it takes 24-48 hours for receptor changes)',
        'Confusing the mechanism with rhabdomyolysis',
        'Stating succinylcholine is always contraindicated (safe within first 24 hours)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'succinylcholine-hyperkalemia',
    chapter: 'neuromuscular-blockers',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Stoelting Ch 8', topic: 'succinylcholine-hyperkalemia' },
  },

  // 5a. Propofol — Mechanism and Pharmacokinetics — node-8
  {
    id: 'r-propofol-1a',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-8',
    prompt: 'Describe the mechanism of action of propofol at the receptor level. Then explain why a single bolus wears off so quickly and why propofol is favored for TIVA.',
    rubric: {
      key_points: [
        { id: 'gaba', weight: 2, description: 'Propofol potentiates GABA-A receptor activity, enhancing chloride conductance and causing neuronal hyperpolarization/inhibition' },
        { id: 'onset_duration', weight: 1, description: 'Rapid onset (one arm-brain circulation time, ~30-45 seconds); short duration of action due to rapid redistribution (wake in 5-10 min after single bolus)' },
        { id: 'context_sensitive', weight: 1, description: 'Context-sensitive half-time remains short even after prolonged infusion, making it ideal for TIVA' },
      ],
      common_errors: [
        'Saying propofol acts on NMDA receptors (that is ketamine)',
        'Confusing redistribution with metabolism as reason for short duration',
      ],
      minimum_passing_score: 60,
    },
    topic: 'propofol-pharmacology',
    chapter: 'iv-anesthetics',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Barash Ch 18', topic: 'propofol-pharmacology' },
  },

  // 5b. Propofol — Clinical Effects on Induction — node-8
  {
    id: 'r-propofol-1b',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-8',
    prompt: 'You are about to induce a patient with propofol. Describe the cardiovascular and respiratory effects you anticipate, including the mechanism of hemodynamic changes. What bonus property makes propofol useful postoperatively?',
    rubric: {
      key_points: [
        { id: 'hypotension', weight: 2, description: 'Causes dose-dependent hypotension via decreased SVR and mild myocardial depression' },
        { id: 'apnea', weight: 1, description: 'Causes respiratory depression and apnea, especially on bolus induction' },
        { id: 'antiemetic', weight: 1, description: 'Has antiemetic properties at sub-hypnotic doses' },
        { id: 'pain_injection', weight: 1, description: 'Propofol commonly causes pain on injection; pretreatment with lidocaine or using a large vein reduces incidence' },
      ],
      common_errors: [
        'Stating propofol increases blood pressure',
        'Failing to anticipate apnea on bolus induction',
      ],
      minimum_passing_score: 60,
    },
    topic: 'propofol-pharmacology',
    chapter: 'iv-anesthetics',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Barash Ch 18', topic: 'propofol-pharmacology' },
  },

  // 6. Frank-Starling mechanism — node-4
  {
    id: 'r-starling-1',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-4',
    prompt: 'Explain the Frank-Starling mechanism in clinical terms. How does it apply to the management of a patient with decreased cardiac output in the OR?',
    rubric: {
      key_points: [
        { id: 'definition', weight: 2, description: 'The Frank-Starling law states that increased ventricular end-diastolic volume (preload) stretches cardiac myocytes, increasing the force of contraction and stroke volume — up to a physiologic limit' },
        { id: 'curve', weight: 1, description: 'The Starling curve plots stroke volume (or CO) against preload (LVEDP/LVEDV); the ascending limb shows benefit from volume, the plateau shows diminishing returns' },
        { id: 'clinical_volume', weight: 1, description: 'Clinically, if a patient is on the ascending limb (hypovolemic), giving IV fluid increases stroke volume and cardiac output' },
        { id: 'flat_portion', weight: 1, description: 'On the flat portion of the curve, additional volume does not improve CO and may worsen pulmonary edema — this is where diuretics or vasodilators help' },
        { id: 'failure', weight: 1, description: 'In heart failure, the Starling curve shifts downward and rightward — higher filling pressures produce less stroke volume; inotropes shift it back up' },
      ],
      common_errors: [
        'Stating that more preload always improves cardiac output (ignores the flat portion)',
        'Confusing preload with afterload',
        'Omitting the concept of the curve shifting in heart failure',
      ],
      minimum_passing_score: 60,
    },
    topic: 'frank-starling-mechanism',
    chapter: 'cardiac-physiology',
    difficulty: 2,
    metadata: { priority: 'medium', source: 'Barash Ch 10', topic: 'frank-starling-mechanism' },
  },

  // 7. Four mechanisms of hypoxemia — node-5
  {
    id: 'r-hypoxemia-1',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-5',
    prompt: 'List and explain the four mechanisms of hypoxemia. For each, give one clinical example relevant to anesthesia practice.',
    rubric: {
      key_points: [
        { id: 'vq_mismatch', weight: 1, description: 'V/Q mismatch: areas of lung receive blood flow but inadequate ventilation (or vice versa). Example: atelectasis under GA, one-lung ventilation, COPD' },
        { id: 'shunt', weight: 1, description: 'Right-to-left shunt: blood bypasses ventilated alveoli entirely. Example: intracardiac shunt (ASD/VSD), ARDS with consolidated lung, endobronchial intubation' },
        { id: 'diffusion', weight: 1, description: 'Diffusion impairment: thickened alveolar-capillary membrane slows O2 transfer. Example: pulmonary fibrosis, interstitial lung disease' },
        { id: 'hypoventilation', weight: 1, description: 'Alveolar hypoventilation: decreased minute ventilation raises PACO2 and lowers PAO2. Example: opioid-induced respiratory depression, residual neuromuscular blockade' },
        { id: 'shunt_o2_response', weight: 1, description: 'Key distinction: V/Q mismatch and hypoventilation respond to supplemental O2; true shunt does not respond well to increased FiO2' },
      ],
      common_errors: [
        'Forgetting diffusion impairment as a mechanism',
        'Confusing V/Q mismatch with true shunt',
        'Stating that supplemental O2 corrects all causes of hypoxemia (shunt is resistant)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'hypoxemia-mechanisms',
    chapter: 'pulmonary-physiology',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Barash Ch 15', topic: 'hypoxemia-mechanisms' },
  },

  // 8a. ASA Physical Status — Classes 1-3 and the E Modifier — node-2
  {
    id: 'r-asa-1a',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-2',
    prompt: 'Define ASA Physical Status classes 1 through 3 and the E modifier. For each class, give a clinical example.',
    rubric: {
      key_points: [
        { id: 'asa1', weight: 1, description: 'ASA 1: Normal healthy patient. Example: healthy adult presenting for hernia repair' },
        { id: 'asa2', weight: 1, description: 'ASA 2: Mild systemic disease without functional limitation. Example: well-controlled hypertension, BMI 30-39, social drinker, smoker' },
        { id: 'asa3', weight: 1, description: 'ASA 3: Severe systemic disease with functional limitation. Example: poorly controlled DM, ESRD on dialysis, morbid obesity (BMI ≥40), stable angina, pacemaker' },
        { id: 'e_modifier', weight: 2, description: 'The "E" modifier is appended for emergency surgery (e.g., ASA 3E)' },
      ],
      common_errors: [
        'Confusing ASA 2 and ASA 3 boundaries — the key distinction is functional limitation',
        'Omitting the E modifier for emergencies',
      ],
      minimum_passing_score: 60,
    },
    topic: 'asa-physical-status',
    chapter: 'preoperative-assessment',
    difficulty: 1,
    metadata: { priority: 'medium', source: 'Barash Ch 1', topic: 'asa-physical-status' },
  },

  // 8b. ASA Physical Status — Classes 4-6 — node-2
  {
    id: 'r-asa-1b',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-2',
    prompt: 'Define ASA Physical Status classes 4 through 6. For each class, give a clinical example and explain how it changes your anesthetic planning.',
    rubric: {
      key_points: [
        { id: 'asa4', weight: 2, description: 'ASA 4: Severe systemic disease that is a constant threat to life. Example: recent MI or stroke (<3 months), ongoing cardiac ischemia, severe valve dysfunction, sepsis' },
        { id: 'asa5', weight: 1, description: 'ASA 5: Moribund patient not expected to survive without surgery. Example: ruptured AAA, massive trauma, intracranial hemorrhage with mass effect' },
        { id: 'asa6', weight: 1, description: 'ASA 6: Declared brain-dead patient whose organs are being harvested for donation' },
        { id: 'planning', weight: 1, description: 'ASA 4-5 patients require invasive monitoring, prepared blood products, ICU bed reservation, and discussion of goals of care before proceeding' },
      ],
      common_errors: [
        'Confusing ASA 4 and ASA 5 — ASA 5 is moribund (not expected to survive without surgery)',
        'Forgetting ASA 6 (organ donor)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'asa-physical-status',
    chapter: 'preoperative-assessment',
    difficulty: 1,
    metadata: { priority: 'medium', source: 'Barash Ch 1', topic: 'asa-physical-status' },
  },

  // 9. Context-sensitive half-time — node-8 (IV Anesthetics — CSHT is an IV-infusion PK concept)
  {
    id: 'r-csht-1',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-8',
    prompt: 'Define context-sensitive half-time. Explain why it matters more than elimination half-life for choosing anesthetic agents in clinical practice. Give examples comparing two agents.',
    rubric: {
      key_points: [
        { id: 'definition', weight: 2, description: 'Context-sensitive half-time (CSHT) is the time required for plasma drug concentration to decrease by 50% after stopping an infusion of a given duration (the "context")' },
        { id: 'vs_elimination', weight: 1, description: 'Elimination half-life only reflects terminal phase kinetics and can be misleading; CSHT accounts for redistribution and is more clinically relevant for predicting recovery' },
        { id: 'remifentanil', weight: 1, description: 'Remifentanil has a nearly flat CSHT (~3-4 min) regardless of infusion duration because it is metabolized by tissue esterases' },
        { id: 'fentanyl_example', weight: 1, description: 'Fentanyl has a CSHT that increases significantly with infusion duration (accumulates in peripheral compartments), leading to prolonged effect after long cases' },
        { id: 'clinical_choice', weight: 1, description: 'For long cases where rapid recovery is desired, agents with short/flat CSHT (remifentanil, propofol, desflurane) are preferred over those with rising CSHT (fentanyl, thiopental)' },
      ],
      common_errors: [
        'Confusing context-sensitive half-time with elimination half-life',
        'Stating that all opioids accumulate equally with prolonged infusion',
        'Forgetting that the "context" refers to infusion duration',
      ],
      minimum_passing_score: 60,
    },
    topic: 'context-sensitive-half-time',
    chapter: 'pharmacokinetics',
    difficulty: 2,
    metadata: { priority: 'medium', source: 'Barash Ch 11', topic: 'context-sensitive-half-time' },
  },

  // 10. Sniffing position and airway axes — node-2
  {
    id: 'r-sniffing-1',
    type: 'recall',
    courseId: 'basics-of-anesthesia',
    nodeId: 'node-2',
    prompt: 'Describe the sniffing position for direct laryngoscopy. What three axes does it align, and how is each axis manipulated?',
    rubric: {
      key_points: [
        { id: 'three_axes', weight: 2, description: 'The three axes are: oral axis (OA), pharyngeal axis (PA), and laryngeal/tracheal axis (LA)' },
        { id: 'head_extension', weight: 1, description: 'Atlanto-occipital extension (head tilt back) aligns the oral axis with the pharyngeal axis' },
        { id: 'neck_flexion', weight: 1, description: 'Lower cervical flexion (achieved by raising the occiput with a pillow or towel roll) aligns the pharyngeal axis with the laryngeal axis' },
        { id: 'combined_effect', weight: 1, description: 'The combination creates the "sniffing the morning air" position — head extended on a flexed neck — bringing all three axes into closest alignment for a line of sight to the glottis' },
        { id: 'obese_ramp', weight: 1, description: 'In obese patients, the head-elevated laryngoscopy position (HELP/ramp) achieves the same axis alignment by elevating the torso, shoulders, and head until the ear canal is at the level of the sternal notch' },
      ],
      common_errors: [
        'Stating only two axes (forgetting the oral axis or the laryngeal axis)',
        'Confusing neck extension with atlanto-occipital extension',
        'Omitting the need for lower cervical flexion (pillow under occiput)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'sniffing-position',
    chapter: 'airway-management',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Barash Ch 28', topic: 'sniffing-position' },
  },

];
