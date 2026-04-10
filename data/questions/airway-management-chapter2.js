/**
 * Airway Management — Chapter 2
 * Course: Basics of Anesthesia  |  Node: node-2
 * 100 questions: 76 mcq, 24 multi
 */

export const AIRWAY_QUESTIONS = [

  // ── 001 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-001",
    type: "mcq",
    prompt: "Which branch of the trigeminal nerve supplies sensory innervation to the anterior third of the nasal septum and lateral wall?",
    ans: [
      { t: "Sphenopalatine nerve.",      ok: false },
      { t: "Anterior ethmoidal nerve.",  ok: true  },
      { t: "Lingual nerve.",             ok: false },
      { t: "Glossopharyngeal nerve.",    ok: false },
    ],
    rationale: "The anterior ethmoidal nerve is a branch of V1 and supplies the anterior third of the nasal septum and lateral wall. This matters during nasal instrumentation and regional airway anesthesia.",
    metadata: { tags: ["airway management", "nasal anatomy", "trigeminal nerve", "V1"] },
  },

  // ── 002 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-002",
    type: "mcq",
    prompt: "The maxillary division of the trigeminal nerve (V2) supplies the posterior two-thirds of the nasal septum and lateral wall via what structure?",
    ans: [
      { t: "Sphenopalatine ganglion.",      ok: true  },
      { t: "Anterior ethmoidal nerve.",     ok: false },
      { t: "Internal laryngeal nerve.",     ok: false },
      { t: "Superior cervical ganglion.",   ok: false },
    ],
    rationale: "V2 contributes sensory innervation to the posterior nasal cavity through the sphenopalatine ganglion. This is why posterior nasal instrumentation can be uncomfortable without adequate topicalization.",
    metadata: { tags: ["airway management", "nasal anatomy", "trigeminal nerve", "V2"] },
  },

  // ── 003 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-003",
    type: "mcq",
    prompt: "Which nerve provides sensory innervation to the anterior two-thirds of the tongue?",
    ans: [
      { t: "Anterior ethmoidal nerve (V1).", ok: false },
      { t: "Sphenopalatine nerve (V2).",     ok: false },
      { t: "Lingual nerve (V3).",            ok: true  },
      { t: "Glossopharyngeal nerve (IX).",   ok: false },
    ],
    rationale: "The lingual nerve, a branch of V3, provides general sensory innervation to the anterior two-thirds of the tongue. This is separate from taste innervation.",
    metadata: { tags: ["airway management", "tongue innervation", "V3", "lingual nerve"] },
  },

  // ── 004 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-004",
    type: "multi",
    prompt: "Which structures receive sensory innervation from the glossopharyngeal nerve (CN IX)? Select 4.",
    choices: [
      "Posterior third of the tongue.",
      "Soft palate.",
      "Oropharynx and tonsils.",
      "Topside of the epiglottis.",
      "Anterior third of the nasal septum.",
      "Hard palate.",
    ],
    correctAnswers: [
      "Posterior third of the tongue.",
      "Soft palate.",
      "Oropharynx and tonsils.",
      "Topside of the epiglottis.",
    ],
    selectCount: 4,
    rationale: "CN IX supplies sensation to the posterior tongue, soft palate, oropharynx, tonsils, and the upper epiglottic region. It is a key target during glossopharyngeal nerve block for awake airway work.",
    metadata: { tags: ["airway management", "glossopharyngeal nerve", "awake intubation", "airway blocks"] },
  },

  // ── 005 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-005",
    type: "mcq",
    prompt: "Relative to the cervical spine, where is the nasopharynx located?",
    ans: [
      { t: "Anterior to C1.",       ok: true  },
      { t: "Anterior to C2 to C3.", ok: false },
      { t: "Anterior to C4 to C5.", ok: false },
      { t: "Posterior to C6.",      ok: false },
    ],
    rationale: "The nasopharynx lies anterior to C1. Knowing these relations helps when mentally mapping airway anatomy during instrumentation.",
    metadata: { tags: ["airway management", "pharyngeal anatomy", "nasopharynx"] },
  },

  // ── 006 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-006",
    type: "mcq",
    prompt: "Which structure marks the border between the oropharynx and hypopharynx?",
    ans: [
      { t: "Hard palate.",      ok: false },
      { t: "Soft palate.",      ok: false },
      { t: "Epiglottis.",       ok: true  },
      { t: "Cricoid cartilage.", ok: false },
    ],
    rationale: "The epiglottis marks the transition between the oropharynx and hypopharynx. This is clinically relevant when interpreting laryngoscopic views.",
    metadata: { tags: ["airway management", "pharyngeal anatomy", "epiglottis"] },
  },

  // ── 007 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-007",
    type: "mcq",
    prompt: "The hypopharynx is bounded inferiorly by the lower border of the cricoid cartilage at what cervical level?",
    ans: [
      { t: "C1 to C2.", ok: false },
      { t: "C3 to C4.", ok: false },
      { t: "C5 to C6.", ok: true  },
      { t: "C7 to T1.", ok: false },
    ],
    rationale: "The hypopharynx extends down to the lower border of the cricoid cartilage at about C5 to C6. This level is also important in airway and cervical anatomy correlation.",
    metadata: { tags: ["airway management", "hypopharynx", "cervical anatomy"] },
  },

  // ── 008 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-008",
    type: "mcq",
    prompt: "The true vocal cords attach anteriorly to the thyroid cartilage and posteriorly to which structures?",
    ans: [
      { t: "Cricoid cartilages.",     ok: false },
      { t: "Arytenoid cartilages.",   ok: true  },
      { t: "Corniculate cartilages.", ok: false },
      { t: "Cuneiform cartilages.",   ok: false },
    ],
    rationale: "The true cords attach posteriorly to the arytenoids. This relationship is central to understanding vocal cord movement and laryngeal muscle action.",
    metadata: { tags: ["airway management", "laryngeal anatomy", "vocal cords", "arytenoids"] },
  },

  // ── 009 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-009",
    type: "multi",
    prompt: "Which laryngeal cartilages are unpaired? Select 3.",
    choices: [
      "Epiglottis.",
      "Thyroid cartilage.",
      "Cricoid cartilage.",
      "Arytenoid cartilage.",
      "Corniculate cartilage.",
    ],
    correctAnswers: ["Epiglottis.", "Thyroid cartilage.", "Cricoid cartilage."],
    selectCount: 3,
    rationale: "The three unpaired laryngeal cartilages are the epiglottis, thyroid, and cricoid. The arytenoid and corniculate cartilages are paired.",
    metadata: { tags: ["airway management", "laryngeal cartilages", "anatomy"] },
  },

  // ── 010 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-010",
    type: "mcq",
    prompt: "Which branch of the vagus nerve provides sensory input to the hypopharynx above the vocal folds?",
    ans: [
      { t: "Internal branch of the superior laryngeal nerve.", ok: true  },
      { t: "External branch of the superior laryngeal nerve.", ok: false },
      { t: "Recurrent laryngeal nerve.",                       ok: false },
      { t: "Glossopharyngeal nerve.",                          ok: false },
    ],
    rationale: "The internal branch of the superior laryngeal nerve carries sensation above the vocal cords. This is why it is a major target in awake airway topicalization and nerve block.",
    metadata: { tags: ["airway management", "superior laryngeal nerve", "sensory innervation", "awake intubation"] },
  },

  // ── 011 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-011",
    type: "mcq",
    prompt: "What is the function of the external branch of the superior laryngeal nerve?",
    ans: [
      { t: "Sensory input to the trachea below the vocal cords.", ok: false },
      { t: "Motor function to the cricothyroid muscle.",          ok: true  },
      { t: "Motor function to the thyroarytenoid muscle.",        ok: false },
      { t: "Sensory input to the soft palate.",                   ok: false },
    ],
    rationale: "The external branch of the superior laryngeal nerve supplies the cricothyroid muscle. That muscle tenses the vocal cords.",
    metadata: { tags: ["airway management", "superior laryngeal nerve", "cricothyroid muscle"] },
  },

  // ── 012 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-012",
    type: "mcq",
    prompt: "Which intrinsic laryngeal muscle elongates and tenses the true vocal cords?",
    ans: [
      { t: "Cricothyroid muscle.",           ok: true  },
      { t: "Thyroarytenoid muscle.",         ok: false },
      { t: "Posterior cricoarytenoid muscle.", ok: false },
      { t: "Transverse arytenoid muscle.",   ok: false },
    ],
    rationale: "The cricothyroid muscle tenses and elongates the cords. A useful memory cue is that cricothyroid makes the cords tense.",
    metadata: { tags: ["airway management", "laryngeal muscles", "cricothyroid"] },
  },

  // ── 013 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-013",
    type: "multi",
    prompt: "Which intrinsic laryngeal muscles shorten and relax the true vocal cords? Select 2.",
    choices: [
      "Thyroarytenoid muscle.",
      "Vocalis muscle.",
      "Cricothyroid muscle.",
      "Posterior cricoarytenoid muscle.",
    ],
    correctAnswers: ["Thyroarytenoid muscle.", "Vocalis muscle."],
    selectCount: 2,
    rationale: "The thyroarytenoid and vocalis muscles shorten and relax the cords. This contrasts with the cricothyroid, which tenses them.",
    metadata: { tags: ["airway management", "laryngeal muscles", "vocal cords"] },
  },

  // ── 014 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-014",
    type: "mcq",
    prompt: "What is the function of the posterior cricoarytenoid muscle?",
    ans: [
      { t: "Adducts the vocal cords.",      ok: false },
      { t: "Abducts the vocal cords.",      ok: true  },
      { t: "Closes the glottic opening.",   ok: false },
      { t: "Tenses the vocal cords.",       ok: false },
    ],
    rationale: "The posterior cricoarytenoid is the main vocal cord abductor. It is critical because opening the cords is essential for airflow.",
    metadata: { tags: ["airway management", "laryngeal muscles", "posterior cricoarytenoid"] },
  },

  // ── 015 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-015",
    type: "multi",
    prompt: "Which intrinsic laryngeal muscles adduct the vocal cords or arytenoids? Select 2.",
    choices: [
      "Lateral cricoarytenoid muscle.",
      "Transverse arytenoid muscle.",
      "Posterior cricoarytenoid muscle.",
      "Thyroepiglottic muscle.",
    ],
    correctAnswers: ["Lateral cricoarytenoid muscle.", "Transverse arytenoid muscle."],
    selectCount: 2,
    rationale: "The lateral cricoarytenoid and transverse arytenoid are important adductors. They help close the cords and narrow the glottic opening.",
    metadata: { tags: ["airway management", "laryngeal muscles", "adduction"] },
  },

  // ── 016 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-016",
    type: "mcq",
    prompt: "Which intrinsic laryngeal muscle opens the glottis?",
    ans: [
      { t: "Thyroepiglottic muscle.",    ok: true  },
      { t: "Aryepiglottic muscle.",      ok: false },
      { t: "Oblique arytenoid muscle.",  ok: false },
      { t: "Cricothyroid muscle.",       ok: false },
    ],
    rationale: "The thyroepiglottic muscle helps open the glottis. This contrasts with the aryepiglottic and oblique arytenoid muscles, which help close it.",
    metadata: { tags: ["airway management", "laryngeal muscles", "glottis"] },
  },

  // ── 017 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-017",
    type: "multi",
    prompt: "Which intrinsic laryngeal muscles function to close the glottis? Select 2.",
    choices: [
      "Aryepiglottic muscle.",
      "Oblique arytenoid muscle.",
      "Thyroepiglottic muscle.",
      "Posterior cricoarytenoid muscle.",
    ],
    correctAnswers: ["Aryepiglottic muscle.", "Oblique arytenoid muscle."],
    selectCount: 2,
    rationale: "The aryepiglottic and oblique arytenoid muscles contribute to glottic closure. This is relevant to airway protection and laryngospasm physiology.",
    metadata: { tags: ["airway management", "laryngeal muscles", "glottic closure"] },
  },

  // ── 018 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-018",
    type: "mcq",
    prompt: "All intrinsic muscles of the larynx are innervated by the recurrent laryngeal nerve except which muscle?",
    ans: [
      { t: "Cricothyroid muscle.",           ok: true  },
      { t: "Thyroarytenoid muscle.",         ok: false },
      { t: "Lateral cricoarytenoid muscle.", ok: false },
      { t: "Vocalis muscle.",                ok: false },
    ],
    rationale: "The cricothyroid is the exception and is supplied by the external branch of the superior laryngeal nerve. All other intrinsic laryngeal muscles receive RLN innervation.",
    metadata: { tags: ["airway management", "recurrent laryngeal nerve", "superior laryngeal nerve"] },
  },

  // ── 019 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-019",
    type: "mcq",
    prompt: "What is the usual presentation of a unilateral recurrent laryngeal nerve injury?",
    ans: [
      { t: "Severe respiratory distress without hoarseness.",       ok: false },
      { t: "Hoarseness without compromised respiratory status.",    ok: true  },
      { t: "Total aphonia and severe stridor.",                     ok: false },
      { t: "Immediate complete airway obstruction.",                ok: false },
    ],
    rationale: "A unilateral RLN injury usually causes hoarseness, but the airway is often preserved because the contralateral cord compensates. Bilateral acute injury is far more dangerous.",
    metadata: { tags: ["airway management", "recurrent laryngeal nerve", "hoarseness"] },
  },

  // ── 020 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-020",
    type: "mcq",
    prompt: "In the acute phase of bilateral recurrent laryngeal nerve injury, what dangerous presentation occurs?",
    ans: [
      { t: "Unopposed tension and adduction causing stridor and severe respiratory distress.", ok: true  },
      { t: "Unopposed relaxation and abduction causing severe aspiration risk.",              ok: false },
      { t: "Completely normal respiration with slight hoarseness.",                           ok: false },
      { t: "Normal voice with total aphonia.",                                                ok: false },
    ],
    rationale: "Acute bilateral RLN injury can leave the cords dangerously adducted, producing stridor and airway compromise. This is a true airway emergency pattern.",
    metadata: { tags: ["airway management", "recurrent laryngeal nerve", "stridor", "airway emergency"] },
  },

  // ── 021 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-021",
    type: "multi",
    prompt: "Which conditions or procedures specifically threaten the left recurrent laryngeal nerve? Select 3.",
    choices: [
      "Patent ductus arteriosus ligation.",
      "Left atrial enlargement from mitral stenosis.",
      "Aortic arch aneurysm.",
      "Thyroid or parathyroid surgery.",
      "General external pressure from an LMA.",
    ],
    correctAnswers: [
      "Patent ductus arteriosus ligation.",
      "Left atrial enlargement from mitral stenosis.",
      "Aortic arch aneurysm.",
    ],
    selectCount: 3,
    rationale: "The left RLN loops under the aortic arch, so pathology or surgery in that region can injure it. PDA ligation, left atrial enlargement, and aortic arch aneurysm are classic left-sided threats. Thyroid surgery is bilateral risk, not specific to the left.",
    metadata: { tags: ["airway management", "left recurrent laryngeal nerve", "thoracic anatomy"] },
  },

  // ── 022 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-022",
    type: "mcq",
    prompt: "From which vessel does the superior thyroid artery arise?",
    ans: [
      { t: "External carotid artery.",   ok: true  },
      { t: "Internal carotid artery.",   ok: false },
      { t: "Brachiocephalic trunk.",     ok: false },
      { t: "Subclavian artery.",         ok: false },
    ],
    rationale: "The superior thyroid artery is the first branch off the external carotid artery. It contributes to laryngeal blood supply.",
    metadata: { tags: ["airway management", "laryngeal blood supply", "superior thyroid artery"] },
  },

  // ── 023 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-023",
    type: "multi",
    prompt: "In the awake state, upper airway obstruction is prevented by which three sets of dilator muscles? Select 3.",
    choices: [
      "Tensor palatine.",
      "Genioglossus.",
      "Hyoid muscles.",
      "Thyroarytenoid muscles.",
      "Masseter muscles.",
    ],
    correctAnswers: ["Tensor palatine.", "Genioglossus.", "Hyoid muscles."],
    selectCount: 3,
    rationale: "The tensor palatine, genioglossus, and hyoid muscles help keep the upper airway patent when awake. Loss of their tone during anesthesia contributes to obstruction.",
    metadata: { tags: ["airway management", "upper airway obstruction", "dilator muscles"] },
  },

  // ── 024 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-024",
    type: "mcq",
    prompt: "Which dilator muscle helps keep the nasopharynx open in the awake state?",
    ans: [
      { t: "Tensor palatine.",       ok: true  },
      { t: "Genioglossus.",          ok: false },
      { t: "Hyoid muscle.",          ok: false },
      { t: "Sternocleidomastoid.",   ok: false },
    ],
    rationale: "The tensor palatine helps maintain patency of the nasopharynx. This is one of the reasons airway tone matters so much during induction.",
    metadata: { tags: ["airway management", "nasopharynx", "tensor palatine"] },
  },

  // ── 025 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-025",
    type: "mcq",
    prompt: "The adult trachea begins at C6 and ends at what landmark?",
    ans: [
      { t: "The carina at T4 to T5.",         ok: true  },
      { t: "The carina at T7 to T8.",         ok: false },
      { t: "The thyroid cartilage at T2 to T3.", ok: false },
      { t: "The cricoid cartilage at T1 to T2.", ok: false },
    ],
    rationale: "The adult trachea extends from about C6 to the carina at T4 to T5. That endpoint matters when thinking about mainstem intubation and tube migration.",
    metadata: { tags: ["airway management", "trachea", "carina"] },
  },

  // ── 026 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-026",
    type: "mcq",
    prompt: "What are the usual physical dimensions of the adult trachea?",
    ans: [
      { t: "About 2.5 cm wide and 10 to 13 cm long.",  ok: true  },
      { t: "About 1.0 cm wide and 5 to 7 cm long.",    ok: false },
      { t: "About 4.0 cm wide and 20 to 25 cm long.",  ok: false },
      { t: "About 2.5 cm wide and 30 to 35 cm long.",  ok: false },
    ],
    rationale: "The adult trachea is about 2.5 cm in width and 10 to 13 cm in length. These dimensions help frame safe tube depth and airway anatomy.",
    metadata: { tags: ["airway management", "trachea", "anatomy"] },
  },

  // ── 027 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-027",
    type: "mcq",
    prompt: "Which cartilage is the only completely circular cartilaginous ring in the airway?",
    ans: [
      { t: "Cricoid cartilage.",     ok: true  },
      { t: "Thyroid cartilage.",     ok: false },
      { t: "Arytenoid cartilage.",   ok: false },
      { t: "Epiglottic cartilage.",  ok: false },
    ],
    rationale: "The cricoid cartilage is the only complete cartilaginous ring in the airway. That is one reason it is such an important landmark in airway procedures.",
    metadata: { tags: ["airway management", "cricoid cartilage", "airway landmarks"] },
  },

  // ── 028 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-028",
    type: "mcq",
    prompt: "What epithelium lines the human trachea?",
    ans: [
      { t: "Ciliated columnar epithelium.",     ok: true  },
      { t: "Flat squamous epithelium.",         ok: false },
      { t: "Stratified cuboidal epithelium.",   ok: false },
      { t: "Transitional epithelium.",          ok: false },
    ],
    rationale: "The trachea is lined by ciliated columnar epithelium. This is important for mucociliary clearance and airway defense.",
    metadata: { tags: ["airway management", "trachea", "epithelium"] },
  },

  // ── 029 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-029",
    type: "mcq",
    prompt: "By about nine years of age, how many alveoli do humans have?",
    ans: [
      { t: "About 300 million.", ok: true  },
      { t: "About 100 million.", ok: false },
      { t: "About 500 million.", ok: false },
      { t: "About 800 million.", ok: false },
    ],
    rationale: "Humans have roughly 300 million alveoli by age nine. This highlights the enormous gas exchange surface available in normal lungs.",
    metadata: { tags: ["airway management", "alveoli", "pulmonary anatomy"] },
  },

  // ── 030 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-030",
    type: "mcq",
    prompt: "What structure allows direct air movement between adjacent alveoli?",
    ans: [
      { t: "Pores of Kohn.",          ok: true  },
      { t: "Canals of Lambert.",      ok: false },
      { t: "Fenestrations of His.",   ok: false },
      { t: "Bronchiolar strictures.", ok: false },
    ],
    rationale: "The pores of Kohn provide collateral ventilation between neighboring alveoli. This becomes relevant in some disease states and gas distribution patterns.",
    metadata: { tags: ["airway management", "alveoli", "pores of Kohn"] },
  },

  // ── 031 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-031",
    type: "mcq",
    prompt: "Which pneumocyte covers about 80 percent of the alveolar surface and forms tight junctions?",
    ans: [
      { t: "Type I pneumocyte.",       ok: true  },
      { t: "Type II pneumocyte.",      ok: false },
      { t: "Type III pneumocyte.",     ok: false },
      { t: "Macrophage pneumocyte.",   ok: false },
    ],
    rationale: "Type I pneumocytes form the thin structural gas exchange surface and cover most of the alveolar area. They are crucial for efficient diffusion.",
    metadata: { tags: ["airway management", "alveoli", "type I pneumocyte"] },
  },

  // ── 032 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-032",
    type: "multi",
    prompt: "Which functions are performed by Type II pneumocytes? Select 3.",
    choices: [
      "Produce pulmonary surfactant.",
      "Resist oxygen toxicity.",
      "Divide and produce Type I cells.",
      "Act primarily as macrophages.",
      "Cover most of the alveolar surface.",
    ],
    correctAnswers: [
      "Produce pulmonary surfactant.",
      "Resist oxygen toxicity.",
      "Divide and produce Type I cells.",
    ],
    selectCount: 3,
    rationale: "Type II pneumocytes produce surfactant, are relatively resistant to oxygen toxicity, and can regenerate Type I cells. They are functionally important far beyond their surface area share.",
    metadata: { tags: ["airway management", "alveoli", "type II pneumocyte", "surfactant"] },
  },

  // ── 033 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-033",
    type: "mcq",
    prompt: "What role is assigned to Type III pneumocyte cells in this source set?",
    ans: [
      { t: "They act as macrophages fighting infection and producing inflammatory responses.", ok: true  },
      { t: "They produce surfactant.",                                                        ok: false },
      { t: "They form the structural alveolar barrier.",                                      ok: false },
      { t: "They generate complete cartilaginous rings.",                                     ok: false },
    ],
    rationale: "Type III cells are identified here as macrophage-like cells involved in defense and inflammation. The key idea is their immune role within the alveolus.",
    metadata: { tags: ["airway management", "alveoli", "macrophages"] },
  },

  // ── 034 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-034",
    type: "mcq",
    prompt: "Which white blood cell is commonly present in the alveoli of smokers and patients with acute lung injury?",
    ans: [
      { t: "Neutrophils.",   ok: true  },
      { t: "Basophils.",     ok: false },
      { t: "Eosinophils.",   ok: false },
      { t: "Erythrocytes.",  ok: false },
    ],
    rationale: "Neutrophils are commonly present in inflammatory conditions such as smoking and acute lung injury. Their presence reflects active inflammatory activation.",
    metadata: { tags: ["airway management", "alveoli", "acute lung injury", "neutrophils"] },
  },

  // ── 035 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-035",
    type: "mcq",
    prompt: "Which description best matches the right mainstem bronchus?",
    ans: [
      { t: "About 2.5 cm long with a 25-degree takeoff.", ok: true  },
      { t: "About 5.0 cm long with a 45-degree takeoff.", ok: false },
      { t: "About 2.5 cm long with a 45-degree takeoff.", ok: false },
      { t: "About 5.0 cm long with a 25-degree takeoff.", ok: false },
    ],
    rationale: "The right mainstem bronchus is shorter and more vertical, about 2.5 cm long with a 25-degree takeoff. That is why inadvertent right mainstem intubation is common.",
    metadata: { tags: ["airway management", "bronchial anatomy", "right mainstem bronchus"] },
  },

  // ── 036 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-036",
    type: "mcq",
    prompt: "Which description best matches the left mainstem bronchus?",
    ans: [
      { t: "About 5.0 cm long with a 45-degree takeoff.", ok: true  },
      { t: "About 2.5 cm long with a 25-degree takeoff.", ok: false },
      { t: "About 2.5 cm long with a 45-degree takeoff.", ok: false },
      { t: "About 5.0 cm long with a 25-degree takeoff.", ok: false },
    ],
    rationale: "The left mainstem bronchus is longer and more angled, about 5 cm long with a 45-degree takeoff. This difference helps explain asymmetry in airway device positioning risks.",
    metadata: { tags: ["airway management", "bronchial anatomy", "left mainstem bronchus"] },
  },

  // ── 037 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-037",
    type: "multi",
    prompt: "Which instructions are required for proper Mallampati examination? Select 4.",
    choices: [
      "Sit upright.",
      "Extend the neck fully.",
      "Open the mouth wide and stick out the tongue.",
      "Do not phonate.",
      "Phonate 'ahhh' during the exam.",
      "Recline fully supine.",
    ],
    correctAnswers: [
      "Sit upright.",
      "Extend the neck fully.",
      "Open the mouth wide and stick out the tongue.",
      "Do not phonate.",
    ],
    selectCount: 4,
    rationale: "A proper Mallampati exam requires upright positioning, neck extension, maximal mouth opening with tongue protrusion, and no phonation. Phonation can distort the view and change the class.",
    metadata: { tags: ["airway management", "Mallampati", "airway assessment"] },
  },

  // ── 038 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-038",
    type: "mcq",
    prompt: "Which structures are visible in a Mallampati Class I airway?",
    ans: [
      { t: "Pillars, uvula, soft palate, and hard palate.", ok: true  },
      { t: "Uvula, soft palate, and hard palate only.",     ok: false },
      { t: "Soft palate and hard palate only.",             ok: false },
      { t: "Hard palate only.",                             ok: false },
    ],
    rationale: "Class I gives the fullest view: pillars, uvula, soft palate, and hard palate. It generally suggests easier laryngoscopy, though it is not a perfect predictor alone.",
    metadata: { tags: ["airway management", "Mallampati", "Class I"] },
  },

  // ── 039 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-039",
    type: "mcq",
    prompt: "Which structures are visible in a Mallampati Class II airway?",
    ans: [
      { t: "Uvula, soft palate, and hard palate.",          ok: true  },
      { t: "Pillars, uvula, soft palate, and hard palate.", ok: false },
      { t: "Soft palate and hard palate only.",             ok: false },
      { t: "Hard palate only.",                             ok: false },
    ],
    rationale: "Class II still shows the uvula, soft palate, and hard palate, but not the pillars. It suggests less available space than Class I.",
    metadata: { tags: ["airway management", "Mallampati", "Class II"] },
  },

  // ── 040 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-040",
    type: "mcq",
    prompt: "Which structures are visible in a Mallampati Class III airway?",
    ans: [
      { t: "Soft palate and hard palate only.",             ok: true  },
      { t: "Uvula, soft palate, and hard palate.",          ok: false },
      { t: "Pillars, uvula, soft palate, and hard palate.", ok: false },
      { t: "Hard palate only.",                             ok: false },
    ],
    rationale: "Class III shows only the soft palate and hard palate. This increases concern for potentially difficult laryngoscopy.",
    metadata: { tags: ["airway management", "Mallampati", "Class III"] },
  },

  // ── 041 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-041",
    type: "mcq",
    prompt: "Which structures are visible in a Mallampati Class IV airway?",
    ans: [
      { t: "Hard palate only.",                             ok: true  },
      { t: "Soft palate and hard palate only.",             ok: false },
      { t: "Uvula, soft palate, and hard palate.",          ok: false },
      { t: "Pillars, uvula, soft palate, and hard palate.", ok: false },
    ],
    rationale: "Class IV shows only the hard palate. It is associated with higher risk of difficult direct laryngoscopy.",
    metadata: { tags: ["airway management", "Mallampati", "Class IV"] },
  },

  // ── 042 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-042",
    type: "mcq",
    prompt: "What is seen in a Cormack-Lehane Grade I view?",
    ans: [
      { t: "A complete or nearly complete view of the glottic opening.", ok: true  },
      { t: "Only the posterior region of the glottic opening.",         ok: false },
      { t: "Only the epiglottis.",                                       ok: false },
      { t: "Only the soft palate.",                                      ok: false },
    ],
    rationale: "Grade I gives a full or nearly full glottic view. This is the most favorable direct laryngoscopic grade.",
    metadata: { tags: ["airway management", "Cormack-Lehane", "Grade I"] },
  },

  // ── 043 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-043",
    type: "mcq",
    prompt: "What is seen in a Cormack-Lehane Grade II view?",
    ans: [
      { t: "Only the posterior region of the glottic opening.",         ok: true  },
      { t: "A complete or nearly complete view of the glottic opening.", ok: false },
      { t: "Only the epiglottis.",                                       ok: false },
      { t: "Only the soft palate.",                                      ok: false },
    ],
    rationale: "Grade II allows only a partial glottic view, often the posterior structures. The anterior commissure is not fully seen.",
    metadata: { tags: ["airway management", "Cormack-Lehane", "Grade II"] },
  },

  // ── 044 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-044",
    type: "mcq",
    prompt: "What is seen in a Cormack-Lehane Grade III view?",
    ans: [
      { t: "Only the epiglottis.",               ok: true  },
      { t: "Only the soft palate.",              ok: false },
      { t: "A complete view of the glottis.",    ok: false },
      { t: "The posterior region of the glottis.", ok: false },
    ],
    rationale: "Grade III means the epiglottis is visible but the glottic opening is not. This is a classic scenario where adjuncts like a bougie may help.",
    metadata: { tags: ["airway management", "Cormack-Lehane", "Grade III", "bougie"] },
  },

  // ── 045 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-045",
    type: "mcq",
    prompt: "For which laryngoscopic grade is an Eschmann introducer (bougie) best utilized?",
    ans: [
      { t: "Grade III.",                                                  ok: true  },
      { t: "Grade I.",                                                    ok: false },
      { t: "Grade IV.",                                                   ok: false },
      { t: "It is contraindicated in any intubation attempt.",            ok: false },
    ],
    rationale: "The bougie is especially useful in Grade III views, where the epiglottis is visible but the cords are not. It is much less helpful in Grade IV when even the epiglottis is not seen.",
    metadata: { tags: ["airway management", "bougie", "Cormack-Lehane"] },
  },

  // ── 046 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-046",
    type: "multi",
    prompt: "A thyromental distance of less than 6 cm suggests which issues? Select 2.",
    choices: [
      "Mandibular hypoplasia.",
      "Small submandibular space.",
      "Large submandibular space.",
      "More caudal laryngeal position.",
    ],
    correctAnswers: ["Mandibular hypoplasia.", "Small submandibular space."],
    selectCount: 2,
    rationale: "A short thyromental distance suggests a small mandibular space and reduced room to displace the tongue during laryngoscopy. That can make direct visualization harder.",
    metadata: { tags: ["airway management", "thyromental distance", "difficult laryngoscopy"] },
  },

  // ── 047 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-047",
    type: "multi",
    prompt: "A thyromental distance greater than 9 cm suggests which anatomical shifts? Select 2.",
    choices: [
      "The larynx assumes a more caudal position.",
      "The tongue moves caudally because it is fixed at the hyoid bone.",
      "The larynx assumes a more cephalad position.",
      "The tongue moves cephalad away from the glottis.",
    ],
    correctAnswers: [
      "The larynx assumes a more caudal position.",
      "The tongue moves caudally because it is fixed at the hyoid bone.",
    ],
    selectCount: 2,
    rationale: "A very long thyromental distance may reflect a more caudally positioned larynx and tongue, shifting the glottic opening farther from the line of sight. More distance is not always easier.",
    metadata: { tags: ["airway management", "thyromental distance", "anatomy"] },
  },

  // ── 048 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-048",
    type: "mcq",
    prompt: "In the 3-3-2 rule, placing three fingers between the mentum and hyoid predicts what?",
    ans: [
      { t: "Ability to lift the tongue into the mandible.",  ok: true  },
      { t: "Ability to insert a Macintosh blade.",           ok: false },
      { t: "Ability to insert an oral airway.",              ok: false },
      { t: "Total cervical spine mobility.",                 ok: false },
    ],
    rationale: "The mentum-to-hyoid portion of the 3-3-2 rule estimates how well the tongue can be displaced into the mandibular space. Less room means a harder line of sight.",
    metadata: { tags: ["airway management", "3-3-2 rule", "airway assessment"] },
  },

  // ── 049 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-049",
    type: "mcq",
    prompt: "In the Upper Lip Bite Test, a patient who can move the lower incisors in line with the upper incisors is classified as what?",
    ans: [
      { t: "ULBT Class II.",  ok: true  },
      { t: "ULBT Class I.",   ok: false },
      { t: "ULBT Class III.", ok: false },
      { t: "ULBT Class IV.",  ok: false },
    ],
    rationale: "ULBT Class II means the lower incisors can meet the upper incisors but not move beyond them. This is an intermediate finding, less favorable than Class I.",
    metadata: { tags: ["airway management", "upper lip bite test", "ULBT"] },
  },

  // ── 050 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-050",
    type: "mcq",
    prompt: "What defines an Upper Lip Bite Test Class III airway?",
    ans: [
      { t: "The patient cannot move the lower incisors past the upper incisors.", ok: true  },
      { t: "The patient can bite above the vermilion border of the upper lip.",   ok: false },
      { t: "The patient can bite exactly on the vermilion border.",               ok: false },
      { t: "The patient has no mandibular incisors.",                             ok: false },
    ],
    rationale: "Class III means the patient cannot advance the lower incisors beyond the upper incisors. That predicts a greater risk of difficult intubation.",
    metadata: { tags: ["airway management", "upper lip bite test", "difficult intubation"] },
  },

  // ── 051 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-051",
    type: "mcq",
    prompt: "What is normal atlanto-occipital extension in a healthy patient?",
    ans: [
      { t: "35 degrees.",  ok: true  },
      { t: "90 degrees.",  ok: false },
      { t: "165 degrees.", ok: false },
      { t: "15 degrees.",  ok: false },
    ],
    rationale: "Normal atlanto-occipital extension is about 35 degrees. Markedly reduced extension can make laryngoscopy more difficult because the axes do not align as well.",
    metadata: { tags: ["airway management", "atlanto-occipital extension", "cervical mobility"] },
  },

  // ── 052 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-052",
    type: "multi",
    prompt: "Which conditions can impair atlanto-occipital joint mobility? Select 4.",
    choices: [
      "Degenerative joint disease.",
      "Rheumatoid arthritis.",
      "Ankylosing spondylitis.",
      "Down syndrome.",
      "Obstructive sleep apnea.",
      "Chronic asthma.",
    ],
    correctAnswers: [
      "Degenerative joint disease.",
      "Rheumatoid arthritis.",
      "Ankylosing spondylitis.",
      "Down syndrome.",
    ],
    selectCount: 4,
    rationale: "These conditions can limit cervical extension or create instability, complicating direct laryngoscopy. AO mobility is a major part of difficult airway assessment.",
    metadata: { tags: ["airway management", "atlanto-occipital mobility", "difficult airway"] },
  },

  // ── 053 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-053",
    type: "multi",
    prompt: "Using the BONES mnemonic, which factors predict difficult mask ventilation? Select 4.",
    choices: [
      "Beard.",
      "Obesity.",
      "No teeth.",
      "Elderly age over 55.",
      "Elderly age over 75.",
      "Severe burns.",
    ],
    correctAnswers: ["Beard.", "Obesity.", "No teeth.", "Elderly age over 55."],
    selectCount: 4,
    rationale: "BONES stands for Beard, Obese, No teeth, Elderly (over 55), and Snoring. These factors increase the likelihood of difficult mask seal or airway patency problems.",
    metadata: { tags: ["airway management", "BONES", "mask ventilation"] },
  },

  // ── 054 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-054",
    type: "multi",
    prompt: "Which findings are risk factors for difficult laryngoscopy and intubation? Select 4.",
    choices: [
      "Small mouth opening.",
      "Long incisor teeth.",
      "Prominent overbite.",
      "High arched palate.",
      "Elongated thin neck.",
      "Mallampati Class I.",
    ],
    correctAnswers: [
      "Small mouth opening.",
      "Long incisor teeth.",
      "Prominent overbite.",
      "High arched palate.",
    ],
    selectCount: 4,
    rationale: "These features reduce working space or worsen the line of sight during direct laryngoscopy. They belong to classic difficult intubation screening patterns.",
    metadata: { tags: ["airway management", "difficult intubation", "laryngoscopy"] },
  },

  // ── 055 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-055",
    type: "multi",
    prompt: "Which situations increase the risk of supraglottic airway placement failure? Select 3.",
    choices: [
      "Severe upper airway obstruction.",
      "Altered pharyngeal anatomy preventing a seal.",
      "Poor airway compliance requiring excessive peak inspiratory pressure.",
      "Completely empty stomach.",
      "Normal interincisor gap.",
    ],
    correctAnswers: [
      "Severe upper airway obstruction.",
      "Altered pharyngeal anatomy preventing a seal.",
      "Poor airway compliance requiring excessive peak inspiratory pressure.",
    ],
    selectCount: 3,
    rationale: "SGAs work best when they can seal and ventilation pressures stay reasonable. Obstruction, distorted anatomy, and poor compliance all work against that.",
    metadata: { tags: ["airway management", "supraglottic airway", "SGA failure"] },
  },

  // ── 056 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-056",
    type: "multi",
    prompt: "Which conditions are risk factors for difficult placement of an invasive airway such as cricothyrotomy? Select 4.",
    choices: [
      "Abnormal neck anatomy such as tumors or hematomas.",
      "Obesity.",
      "Short neck.",
      "Laryngeal trauma.",
      "Elongated neck.",
      "Normal cervical motion.",
    ],
    correctAnswers: [
      "Abnormal neck anatomy such as tumors or hematomas.",
      "Obesity.",
      "Short neck.",
      "Laryngeal trauma.",
    ],
    selectCount: 4,
    rationale: "These features make landmarks harder to identify or distort anatomy, complicating emergency front-of-neck access. Invasive airway planning depends heavily on neck anatomy.",
    metadata: { tags: ["airway management", "invasive airway", "cricothyrotomy"] },
  },

  // ── 057 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-057",
    type: "mcq",
    prompt: "In the LEMON difficult airway mnemonic, what does the E stand for?",
    ans: [
      { t: "Evaluate the 3-3-2 rule.",             ok: true  },
      { t: "Extubate awake.",                       ok: false },
      { t: "Escalate to surgical airway.",          ok: false },
      { t: "Ensure the patient empties the stomach.", ok: false },
    ],
    rationale: "In LEMON, E stands for Evaluate 3-3-2. It is a structured way to estimate available working space for laryngoscopy.",
    metadata: { tags: ["airway management", "LEMON", "airway assessment"] },
  },

  // ── 058 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-058",
    type: "mcq",
    prompt: "How long must a patient wait before surgery after clear liquids according to fasting guidelines?",
    ans: [
      { t: "2 hours.", ok: true  },
      { t: "4 hours.", ok: false },
      { t: "6 hours.", ok: false },
      { t: "8 hours.", ok: false },
    ],
    rationale: "Clear liquids require a minimum fasting interval of 2 hours. This reflects their faster gastric emptying compared with formula or solids.",
    metadata: { tags: ["airway management", "fasting guidelines", "aspiration risk"] },
  },

  // ── 059 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-059",
    type: "mcq",
    prompt: "How long must a patient wait before surgery after infant formula or solid food?",
    ans: [
      { t: "6 hours.", ok: true  },
      { t: "4 hours.", ok: false },
      { t: "2 hours.", ok: false },
      { t: "8 hours.", ok: false },
    ],
    rationale: "Infant formula and solid food require at least 6 hours of fasting. They empty more slowly than clear liquids.",
    metadata: { tags: ["airway management", "fasting guidelines", "aspiration risk"] },
  },

  // ── 060 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-060",
    type: "mcq",
    prompt: "Mendelson syndrome risk is strongly associated with which gastric fluid parameters?",
    ans: [
      { t: "pH less than 2.5 and volume greater than 25 mL.",  ok: true  },
      { t: "pH greater than 2.5 and volume less than 25 mL.",  ok: false },
      { t: "pH less than 4.5 and volume greater than 50 mL.",  ok: false },
      { t: "pH greater than 4.5 and volume less than 50 mL.",  ok: false },
    ],
    rationale: "Classic aspiration pneumonitis risk is associated with highly acidic gastric contents and a clinically significant volume. The key thresholds are pH below 2.5 and volume above 25 mL.",
    metadata: { tags: ["airway management", "Mendelson syndrome", "aspiration"] },
  },

  // ── 061 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-061",
    type: "mcq",
    prompt: "What does a positive prayer sign suggest during airway assessment?",
    ans: [
      { t: "A difficult airway associated with stiff joint syndrome.", ok: true  },
      { t: "A simple airway associated with hyperextensible joints.", ok: false },
      { t: "A major risk for postoperative nausea and vomiting.",     ok: false },
      { t: "A major risk for malignant hyperthermia.",                ok: false },
    ],
    rationale: "A positive prayer sign suggests limited joint mobility, often from diabetic stiff joint syndrome. That can correlate with difficult laryngoscopy and intubation.",
    metadata: { tags: ["airway management", "prayer sign", "difficult airway"] },
  },

  // ── 062 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-062",
    type: "mcq",
    prompt: "The sniffing position aligns which three axes to improve the line of sight for intubation?",
    ans: [
      { t: "Oral, pharyngeal, and laryngeal axes.",         ok: true  },
      { t: "Oral, nasal, and tracheal axes.",               ok: false },
      { t: "Tracheal, bronchial, and laryngeal axes.",      ok: false },
      { t: "Nasal, pharyngeal, and esophageal axes.",       ok: false },
    ],
    rationale: "The sniffing position is classically described as aligning the oral, pharyngeal, and laryngeal axes. This improves direct laryngoscopic view.",
    metadata: { tags: ["airway management", "sniffing position", "intubation positioning"] },
  },

  // ── 063 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-063",
    type: "mcq",
    prompt: "After endotracheal tube placement, what happens when the patient's nose is moved away from the chest?",
    ans: [
      { t: "The tube tip moves away from the carina by about 2 cm.",          ok: true  },
      { t: "The tube tip moves toward the carina by about 2 cm.",             ok: false },
      { t: "The tube rotates laterally by about 0.7 cm.",                     ok: false },
      { t: "The tube enters the right mainstem bronchus immediately.",         ok: false },
    ],
    rationale: "The tube goes where the nose goes. Extending the neck pulls the tube tip upward and away from the carina by roughly 2 cm.",
    metadata: { tags: ["airway management", "ETT position", "neck extension"] },
  },

  // ── 064 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-064",
    type: "mcq",
    prompt: "After endotracheal tube placement, what happens when the patient's nose is tucked to the chest?",
    ans: [
      { t: "The tube tip moves toward the carina by about 2 cm.",      ok: true  },
      { t: "The tube tip moves away from the carina by about 2 cm.",   ok: false },
      { t: "The tube tip exits the cords immediately.",                 ok: false },
      { t: "The tube rotates laterally by 5 cm.",                      ok: false },
    ],
    rationale: "Flexing the neck advances the ETT toward the carina. This is why head movement after intubation can create an unintended mainstem position.",
    metadata: { tags: ["airway management", "ETT position", "neck flexion"] },
  },

  // ── 065 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-065",
    type: "mcq",
    prompt: "What airway risk is increased when a mechanically ventilated patient is placed in steep Trendelenburg?",
    ans: [
      { t: "Abdominal contents shift toward the chest, reduce thoracic volume, and increase the risk of endobronchial intubation.", ok: true  },
      { t: "Abdominal contents shift toward the pelvis and prevent endobronchial intubation.",                                     ok: false },
      { t: "The recurrent laryngeal nerves are stretched to paralysis.",                                                           ok: false },
      { t: "The lower esophageal sphincter opens and empties the stomach.",                                                       ok: false },
    ],
    rationale: "Steep Trendelenburg pushes abdominal contents cephalad, reduces thoracic volume, and can shift the tube position deeper. That raises concern for endobronchial intubation.",
    metadata: { tags: ["airway management", "Trendelenburg", "ETT migration", "endobronchial intubation"] },
  },

  // ── 066 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-066",
    type: "multi",
    prompt: "Which are contraindications to placement of a nasopharyngeal airway? Select 4.",
    choices: [
      "Cribriform plate injury.",
      "LeFort II or III fracture.",
      "Basilar skull fracture.",
      "Active CSF rhinorrhea.",
      "Isolated mandibular fracture.",
      "Simple deviated septum.",
    ],
    correctAnswers: [
      "Cribriform plate injury.",
      "LeFort II or III fracture.",
      "Basilar skull fracture.",
      "Active CSF rhinorrhea.",
    ],
    selectCount: 4,
    rationale: "These injuries create a risk of intracranial passage or major trauma with NPA placement. Facial trauma near the skull base is the key red flag pattern.",
    metadata: { tags: ["airway management", "nasopharyngeal airway", "contraindications", "facial trauma"] },
  },

  // ── 067 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-067",
    type: "mcq",
    prompt: "Which endotracheal tube size is generally appropriate for an adult female?",
    ans: [
      { t: "7.0 to 7.5 mm.",    ok: true  },
      { t: "7.5 to 9.0 mm.",    ok: false },
      { t: "5.0 to 6.5 mm.",    ok: false },
      { t: "9.0 to 10.0 mm.",   ok: false },
    ],
    rationale: "A common oral ETT internal diameter range for an adult female is 7.0 to 7.5 mm. Adult males are generally sized slightly larger.",
    metadata: { tags: ["airway management", "ETT size", "adult female"] },
  },

  // ── 068 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-068",
    type: "mcq",
    prompt: "During rapid sequence intubation, what cricoid pressure is recommended before loss of consciousness?",
    ans: [
      { t: "20 Newtons or about 2 kg.", ok: true  },
      { t: "40 Newtons or about 4 kg.", ok: false },
      { t: "10 Newtons or about 1 kg.", ok: false },
      { t: "80 Newtons or about 8 kg.", ok: false },
    ],
    rationale: "Before loss of consciousness, the recommended cricoid pressure is about 20 Newtons. It is increased after loss of consciousness if cricoid pressure is being applied.",
    metadata: { tags: ["airway management", "RSI", "cricoid pressure"] },
  },

  // ── 069 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-069",
    type: "multi",
    prompt: "Which complications can occur with cricoid pressure during RSI? Select 4.",
    choices: [
      "Esophageal rupture if the patient is actively vomiting.",
      "Airway obstruction.",
      "Difficulty with laryngoscopy.",
      "Impaired glottic visualization.",
      "Extreme reflex tachycardia and hypertension.",
      "Instant massive bronchospasm.",
    ],
    correctAnswers: [
      "Esophageal rupture if the patient is actively vomiting.",
      "Airway obstruction.",
      "Difficulty with laryngoscopy.",
      "Impaired glottic visualization.",
    ],
    selectCount: 4,
    rationale: "Cricoid pressure is not benign. It can worsen the laryngoscopic view, obstruct the airway, and risk esophageal injury if the patient vomits against a closed outlet.",
    metadata: { tags: ["airway management", "cricoid pressure", "RSI complications"] },
  },

  // ── 070 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-070",
    type: "mcq",
    prompt: "What does BURP stand for?",
    ans: [
      { t: "Backward, Upward, Rightward Pressure.",   ok: true  },
      { t: "Backward, Upward, Rearward Pulling.",     ok: false },
      { t: "Bilateral, Upward, Rightward Pressure.",  ok: false },
      { t: "Bilateral, Unilateral, Rearward Pulling.", ok: false },
    ],
    rationale: "BURP means backward, upward, rightward pressure on the thyroid cartilage. It is used to improve glottic view during laryngoscopy.",
    metadata: { tags: ["airway management", "BURP", "laryngoscopy optimization"] },
  },

  // ── 071 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-071",
    type: "mcq",
    prompt: "What does ELM stand for in airway management?",
    ans: [
      { t: "External Laryngeal Manipulation.", ok: true  },
      { t: "External Lingual Manipulation.",   ok: false },
      { t: "Endotracheal Laryngeal Maneuvers.", ok: false },
      { t: "Endotracheal Lingual Maneuvers.",  ok: false },
    ],
    rationale: "ELM stands for external laryngeal manipulation. Unlike standardized BURP, it refers to tailored manual adjustment of the larynx while viewing.",
    metadata: { tags: ["airway management", "ELM", "laryngoscopy"] },
  },

  // ── 072 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-072",
    type: "multi",
    prompt: "In which congenital syndromes is the Bullard laryngoscope particularly useful? Select 2.",
    choices: [
      "Pierre-Robin syndrome.",
      "Treacher Collins syndrome.",
      "Down syndrome.",
      "Klippel-Feil syndrome.",
    ],
    correctAnswers: ["Pierre-Robin syndrome.", "Treacher Collins syndrome."],
    selectCount: 2,
    rationale: "The Bullard is useful in patients with difficult anatomy such as Pierre-Robin and Treacher Collins syndromes. It is especially helpful when mouth opening is limited and anatomy is challenging.",
    metadata: { tags: ["airway management", "Bullard laryngoscope", "congenital airway syndromes"] },
  },

  // ── 073 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-073",
    type: "mcq",
    prompt: "When advancing a gum elastic bougie blindly, what tactile finding supports tracheal placement?",
    ans: [
      { t: "Feeling the bougie bounce along the tracheal rings.",      ok: true  },
      { t: "Smooth movement with absolutely no resistance.",           ok: false },
      { t: "Immediate stop at the soft palate.",                       ok: false },
      { t: "A plunge into gastric fluid.",                             ok: false },
    ],
    rationale: "A tracheal 'click' or ring feel as the bougie advances supports tracheal placement. In contrast, esophageal passage often feels smoother and less structured.",
    metadata: { tags: ["airway management", "bougie", "tracheal confirmation"] },
  },

  // ── 074 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-074",
    type: "mcq",
    prompt: "During a glossopharyngeal nerve block, local anesthetic is placed at the base of what structure?",
    ans: [
      { t: "Palatoglossal arch.",        ok: true  },
      { t: "Greater cornu of the hyoid.", ok: false },
      { t: "Cricothyroid membrane.",     ok: false },
      { t: "Thyrohyoid membrane.",       ok: false },
    ],
    rationale: "The base of the palatoglossal arch is infiltrated to block branches of the glossopharyngeal nerve. This helps blunt gag and pharyngeal sensation for awake airway work.",
    metadata: { tags: ["airway management", "glossopharyngeal block", "awake intubation"] },
  },

  // ── 075 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-075",
    type: "mcq",
    prompt: "During a superior laryngeal nerve block, local anesthetic is injected at the inferior border of what landmark?",
    ans: [
      { t: "Greater cornu of the hyoid bone.", ok: true  },
      { t: "Cricothyroid membrane.",           ok: false },
      { t: "Palatoglossal arch.",              ok: false },
      { t: "Anterior commissure.",             ok: false },
    ],
    rationale: "The superior laryngeal nerve block is performed near the inferior border of the greater cornu of the hyoid. This targets sensation above the vocal cords.",
    metadata: { tags: ["airway management", "superior laryngeal nerve block", "awake intubation"] },
  },

  // ── 076 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-076",
    type: "mcq",
    prompt: "During a transtracheal block, the needle penetrates which structure in a caudal direction?",
    ans: [
      { t: "Cricothyroid membrane.",    ok: true  },
      { t: "Thyrohyoid membrane.",      ok: false },
      { t: "Palatoglossal arch.",       ok: false },
      { t: "True vocal cords.",         ok: false },
    ],
    rationale: "A transtracheal block is placed through the cricothyroid membrane. This allows local anesthetic to enter the trachea and be spread upward by coughing.",
    metadata: { tags: ["airway management", "transtracheal block", "cricothyroid membrane"] },
  },

  // ── 077 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-077",
    type: "mcq",
    prompt: "What useful effect does coughing during a transtracheal block create?",
    ans: [
      { t: "It sprays local anesthetic back up through the vocal cords.",     ok: true  },
      { t: "It forces local anesthetic into the alveoli.",                    ok: false },
      { t: "It pushes local anesthetic out the nasal cavity.",               ok: false },
      { t: "It drives local anesthetic directly into the bloodstream.",       ok: false },
    ],
    rationale: "The cough spreads local anesthetic upward across the cords and nearby mucosa. That improves topical anesthesia for awake airway instrumentation.",
    metadata: { tags: ["airway management", "transtracheal block", "topicalization"] },
  },

  // ── 078 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-078",
    type: "multi",
    prompt: "Which signs support correct endotracheal tube placement? Select 4.",
    choices: [
      "Sustained EtCO2 waveform.",
      "Bilateral breath sounds.",
      "Tube misting.",
      "Absence of gastric sounds.",
      "No chest rise and fall.",
      "Immediate SpO2 drop.",
    ],
    correctAnswers: [
      "Sustained EtCO2 waveform.",
      "Bilateral breath sounds.",
      "Tube misting.",
      "Absence of gastric sounds.",
    ],
    selectCount: 4,
    rationale: "A sustained EtCO2 waveform is the strongest confirmation. Bilateral breath sounds, tube misting, and absence of gastric sounds reinforce the picture together.",
    metadata: { tags: ["airway management", "ETT confirmation", "capnography"] },
  },

  // ── 079 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-079",
    type: "mcq",
    prompt: "Capnography measures exhaled carbon dioxide to verify what physiological process?",
    ans: [
      { t: "Ventilation rather than oxygenation.",     ok: true  },
      { t: "Oxygenation rather than ventilation.",     ok: false },
      { t: "Exact alveolar surface area.",             ok: false },
      { t: "Hemoglobin saturation curve.",             ok: false },
    ],
    rationale: "Capnography is fundamentally a monitor of ventilation. It does not directly measure oxygenation.",
    metadata: { tags: ["airway management", "capnography", "ventilation"] },
  },

  // ── 080 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-080",
    type: "mcq",
    prompt: "How does eight deep breaths over 60 seconds compare with three minutes of tidal breathing on 100 percent oxygen for preoxygenation?",
    ans: [
      { t: "They are equivalent.",                                        ok: true  },
      { t: "Eight deep breaths are significantly better.",               ok: false },
      { t: "Three minutes of tidal breathing is significantly better.",  ok: false },
      { t: "Both are inferior to four deep breaths.",                    ok: false },
    ],
    rationale: "Eight deep breaths in 60 seconds is treated as equivalent to three minutes of tidal breathing on 100 percent oxygen. Both are established preoxygenation approaches.",
    metadata: { tags: ["airway management", "preoxygenation"] },
  },

  // ── 081 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-081",
    type: "mcq",
    prompt: "In a healthy, non-obese patient with normal lungs, proper preoxygenation provides apnea without desaturation for about how long?",
    ans: [
      { t: "8.5 minutes.",  ok: true  },
      { t: "2.5 minutes.",  ok: false },
      { t: "4.0 minutes.",  ok: false },
      { t: "12.0 minutes.", ok: false },
    ],
    rationale: "In a healthy, non-obese patient, adequate preoxygenation can maintain oxygen saturation above 90 percent for about 8.5 minutes of apnea. Obesity and lung disease shorten this window dramatically.",
    metadata: { tags: ["airway management", "preoxygenation", "apnea without desaturation"] },
  },

  // ── 082 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-082",
    type: "multi",
    prompt: "Which criteria support awake extubation readiness? Select 4.",
    choices: [
      "Adequate tidal volume and respiratory rate.",
      "Ability to open eyes on command.",
      "Ability to sustain head or leg lift for at least 5 seconds.",
      "Vital capacity of at least 15 mL/kg.",
      "Inspiratory force of at least positive 5 cm H2O.",
      "Completely empty stomach.",
    ],
    correctAnswers: [
      "Adequate tidal volume and respiratory rate.",
      "Ability to open eyes on command.",
      "Ability to sustain head or leg lift for at least 5 seconds.",
      "Vital capacity of at least 15 mL/kg.",
    ],
    selectCount: 4,
    rationale: "These findings support adequate strength, consciousness, and ventilation for awake extubation. The inspiratory force criterion in clinical practice is based on adequate negative inspiratory force.",
    metadata: { tags: ["airway management", "awake extubation", "extubation criteria"] },
  },

  // ── 083 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-083",
    type: "mcq",
    prompt: "What train-of-four ratio is required to support adequate reversal before awake extubation?",
    ans: [
      { t: "Greater than 0.90 with no fade.", ok: true  },
      { t: "Greater than 0.70 with no fade.", ok: false },
      { t: "Greater than 0.50 with no fade.", ok: false },
      { t: "Greater than 0.25 with no fade.", ok: false },
    ],
    rationale: "A TOF ratio above 0.90 is the accepted threshold for adequate recovery. Lower ratios can still leave clinically meaningful residual weakness.",
    metadata: { tags: ["airway management", "awake extubation", "neuromuscular reversal", "TOF"] },
  },

  // ── 084 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-084",
    type: "multi",
    prompt: "Which actions reflect the core spirit of the ASA Difficult Airway Algorithm? Select 4.",
    choices: [
      "Plan ahead and be ready for anything.",
      "If suspicious of trouble, intubate awake.",
      "If in trouble but still able to ventilate, wake the patient up.",
      "When choosing an airway approach, do what you do best.",
      "If intubation fails, keep repeating the same technique.",
      "Always paralyze before airway assessment.",
    ],
    correctAnswers: [
      "Plan ahead and be ready for anything.",
      "If suspicious of trouble, intubate awake.",
      "If in trouble but still able to ventilate, wake the patient up.",
      "When choosing an airway approach, do what you do best.",
    ],
    selectCount: 4,
    rationale: "The core ideas are preparation, anticipation, preserving safety when ventilation is possible, and using the technique you perform best. Repeating failed attempts without changing strategy is dangerous.",
    metadata: { tags: ["airway management", "ASA difficult airway algorithm", "difficult airway"] },
  },

  // ── 085 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-085",
    type: "mcq",
    prompt: "In an awake asthmatic patient, what reflex does the endotracheal tube commonly trigger during extubation?",
    ans: [
      { t: "Bronchospasm.",   ok: true  },
      { t: "Laryngospasm.",   ok: false },
      { t: "Bradycardia.",    ok: false },
      { t: "Hypothermia.",    ok: false },
    ],
    rationale: "Asthmatic airways are reactive, and stimulation from the tube can provoke bronchospasm during emergence or extubation. This is one reason extubation planning matters so much in reactive airways.",
    metadata: { tags: ["airway management", "extubation", "asthma", "bronchospasm"] },
  },

  // ── 086 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-086",
    type: "mcq",
    prompt: "What intravenous medication may be given before extubation to reduce bronchospasm risk in an awake asthmatic?",
    ans: [
      { t: "Lidocaine 1.5 mg/kg IV.",      ok: true  },
      { t: "Propofol 1.5 mg/kg IV.",       ok: false },
      { t: "Succinylcholine 1.5 mg/kg IV.", ok: false },
      { t: "Rocuronium 1.5 mg/kg IV.",     ok: false },
    ],
    rationale: "IV lidocaine given shortly before suctioning and extubation can blunt airway reflexes and help reduce bronchospasm. Timing matters for that benefit.",
    metadata: { tags: ["airway management", "extubation", "asthma", "lidocaine"] },
  },

  // ── 087 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-087",
    type: "mcq",
    prompt: "Why should a small amount of positive pressure be applied just before extubation?",
    ans: [
      { t: "It can help blow secretions sitting above the cuff out into the pharynx.",  ok: true  },
      { t: "It forces all volatile anesthetic out of the lungs.",                       ok: false },
      { t: "It ensures the vocal cords stay abducted.",                                 ok: false },
      { t: "It ensures the vocal cords stay adducted.",                                 ok: false },
    ],
    rationale: "A small positive-pressure breath can move secretions above the cuff upward before the tube is removed. That may reduce aspiration of pooled secretions during extubation.",
    metadata: { tags: ["airway management", "extubation", "positive pressure"] },
  },

  // ── 088 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-088",
    type: "mcq",
    prompt: "What hemodynamic response is classically caused by laryngoscopy and tracheal intubation?",
    ans: [
      { t: "Hypertension and tachycardia.",  ok: true  },
      { t: "Hypotension and bradycardia.",   ok: false },
      { t: "Hypotension and tachycardia.",   ok: false },
      { t: "Hypertension and bradycardia.",  ok: false },
    ],
    rationale: "Laryngoscopy and intubation stimulate airway reflexes and sympathetic discharge, commonly causing hypertension and tachycardia. This can be clinically significant in vulnerable patients.",
    metadata: { tags: ["airway management", "laryngoscopy", "hemodynamic response"] },
  },

  // ── 089 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-089",
    type: "mcq",
    prompt: "Laryngospasm is triggered by sensory stimulation of which nerve?",
    ans: [
      { t: "Superior laryngeal nerve.",    ok: true  },
      { t: "Recurrent laryngeal nerve.",   ok: false },
      { t: "Glossopharyngeal nerve.",      ok: false },
      { t: "Sphenopalatine nerve.",        ok: false },
    ],
    rationale: "The superior laryngeal nerve provides the sensory afferent limb for laryngospasm. Airway stimulation above the cords is the classic trigger zone.",
    metadata: { tags: ["airway management", "laryngospasm", "superior laryngeal nerve"] },
  },

  // ── 090 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-090",
    type: "mcq",
    prompt: "What IV succinylcholine dose is recommended for severe persistent laryngospasm causing hypoxia?",
    ans: [
      { t: "0.25 to 1 mg/kg IV.",   ok: true  },
      { t: "2 to 3 mg/kg IV.",      ok: false },
      { t: "5 to 10 mg/kg IV.",     ok: false },
      { t: "10 to 15 mg/kg IV.",    ok: false },
    ],
    rationale: "If laryngospasm persists and oxygenation is threatened, IV succinylcholine in the lower rescue range is recommended to relax the laryngeal muscles quickly. Speed matters here.",
    metadata: { tags: ["airway management", "laryngospasm", "succinylcholine"] },
  },

  // ── 091 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-091",
    type: "mcq",
    prompt: "What dangerous condition can be caused by strong inspiratory efforts against severe laryngospasm?",
    ans: [
      { t: "Negative-pressure pulmonary edema.", ok: true  },
      { t: "Positive-pressure pulmonary edema.", ok: false },
      { t: "Tension pneumothorax.",              ok: false },
      { t: "Pulmonary embolism.",                ok: false },
    ],
    rationale: "Large negative intrathoracic pressures generated against a closed glottis can pull fluid into the lungs and cause negative-pressure pulmonary edema. It is a well-known complication of severe laryngospasm.",
    metadata: { tags: ["airway management", "laryngospasm", "negative-pressure pulmonary edema"] },
  },

  // ── 092 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-092",
    type: "multi",
    prompt: "What protective mechanisms are compromised by a transtracheal block during awake intubation? Select 2.",
    choices: [
      "Cough reflex.",
      "Swallowing reflex.",
      "Diaphragmatic breathing.",
      "Immediate severe bronchospasm.",
    ],
    correctAnswers: ["Cough reflex.", "Swallowing reflex."],
    selectCount: 2,
    rationale: "Transtracheal block blunts cough and depresses swallowing protection. That is useful for tolerance, but it also increases aspiration risk.",
    metadata: { tags: ["airway management", "transtracheal block", "airway reflexes", "aspiration"] },
  },

  // ── 093 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-093",
    type: "mcq",
    prompt: "With a lighted stylet, what suggests accidental esophageal placement rather than tracheal placement?",
    ans: [
      { t: "A diffuse glow rather than a well-circumscribed glow.",     ok: true  },
      { t: "The light shuts off due to esophageal moisture.",           ok: false },
      { t: "A bright blue glow rather than a red glow.",               ok: false },
      { t: "A perfectly distinct glow all the way down the neck.",     ok: false },
    ],
    rationale: "Esophageal placement produces a diffuse transillumination because the light is deeper and more soft tissue is interposed. Tracheal placement gives a more discrete, focused glow.",
    metadata: { tags: ["airway management", "lighted stylet", "esophageal placement"] },
  },

  // ── 094 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-094",
    type: "mcq",
    prompt: "If infection is confined to the floor of the mouth, which intubation technique is usually still acceptable?",
    ans: [
      { t: "Nasal intubation.",              ok: true  },
      { t: "Translaryngeal intubation.",     ok: false },
      { t: "Standard direct laryngoscopy.",  ok: false },
      { t: "Direct surgical tracheostomy only.", ok: false },
    ],
    rationale: "If infection is limited to the floor of the mouth, a nasal route may still avoid the diseased area and remain feasible. This depends on the exact anatomy involved.",
    metadata: { tags: ["airway management", "nasal intubation", "airway infection"] },
  },

  // ── 095 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-095",
    type: "mcq",
    prompt: "If infection extends through the hypopharynx to the level of the hyoid bone, which approach is likely to be very difficult?",
    ans: [
      { t: "Any translaryngeal approach.",          ok: true  },
      { t: "Awake tracheostomy.",                   ok: false },
      { t: "Awake fiberoptic nasal approach.",      ok: false },
      { t: "Retrograde wire intubation.",           ok: false },
    ],
    rationale: "When disease involves the hypopharynx to the hyoid level, translaryngeal attempts become difficult because the airway path itself is affected. That shifts planning toward alternatives.",
    metadata: { tags: ["airway management", "airway infection", "translaryngeal approach"] },
  },

  // ── 096 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-096",
    type: "mcq",
    prompt: "An interincisor gap of less than what measurement correlates with difficulty achieving a direct laryngoscopic line of sight?",
    ans: [
      { t: "Less than 3 to 4.5 cm.",  ok: true  },
      { t: "Less than 7 to 8.5 cm.",  ok: false },
      { t: "Less than 1 to 2.5 cm.",  ok: false },
      { t: "Less than 10 to 12 cm.",  ok: false },
    ],
    rationale: "A reduced interincisor gap limits blade insertion and maneuverability. Once mouth opening is below about 3 to 4.5 cm, direct laryngoscopy becomes more difficult.",
    metadata: { tags: ["airway management", "interincisor gap", "difficult laryngoscopy"] },
  },

  // ── 097 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-097",
    type: "mcq",
    prompt: "A sternomental distance less than what measurement is a major clue to potentially difficult laryngoscopy?",
    ans: [
      { t: "Less than 12.5 cm.", ok: true  },
      { t: "Less than 7.0 cm.",  ok: false },
      { t: "Less than 3.0 cm.",  ok: false },
      { t: "Less than 18.5 cm.", ok: false },
    ],
    rationale: "A sternomental distance below 12.5 cm with full extension suggests limited space and a potentially poor laryngoscopic line of sight. It is another useful bedside screening clue.",
    metadata: { tags: ["airway management", "sternomental distance", "difficult laryngoscopy"] },
  },

  // ── 098 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-098",
    type: "multi",
    prompt: "Which are contraindications to retrograde tracheal intubation? Select 3.",
    choices: [
      "Unidentifiable cricothyroid membrane.",
      "Anterior neck pathology such as tumors or stenosis.",
      "Coagulopathy.",
      "Significantly reduced mouth opening.",
      "Limited neck movement.",
    ],
    correctAnswers: [
      "Unidentifiable cricothyroid membrane.",
      "Anterior neck pathology such as tumors or stenosis.",
      "Coagulopathy.",
    ],
    selectCount: 3,
    rationale: "Retrograde intubation should not be used when the membrane cannot be identified, the anterior neck is pathologic, or bleeding risk is high. Reduced mouth opening and limited neck motion are not contraindications and may actually motivate using it.",
    metadata: { tags: ["airway management", "retrograde intubation", "contraindications"] },
  },

  // ── 099 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-099",
    type: "mcq",
    prompt: "In retrograde tracheal intubation, after puncturing the cricothyroid membrane, in what direction is the guidewire advanced?",
    ans: [
      { t: "Cephalad, to be retrieved from the mouth or nose.", ok: true  },
      { t: "Caudal, to anchor at the carina.",                  ok: false },
      { t: "Laterally, to exit the side of the neck.",          ok: false },
      { t: "Posteriorly, into the esophagus.",                  ok: false },
    ],
    rationale: "The wire is passed cephalad and then retrieved from the mouth or nose to guide the tube into the trachea. The direction is fundamental to the technique.",
    metadata: { tags: ["airway management", "retrograde intubation", "guidewire"] },
  },

  // ── 100 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node2-airway-100",
    type: "mcq",
    prompt: "Which device is a long, thin, hollow tube used as a placeholder to maintain access to the airway after extubation?",
    ans: [
      { t: "Airway exchange catheter.",    ok: true  },
      { t: "Eschmann gum elastic bougie.", ok: false },
      { t: "Bullard laryngoscope.",        ok: false },
      { t: "Lighted stylet.",              ok: false },
    ],
    rationale: "An airway exchange catheter preserves access to the trachea after extubation in high-risk patients. It is a placeholder, not a definitive airway by itself.",
    metadata: { tags: ["airway management", "airway exchange catheter", "extubation"] },
  },

];

// ── Metadata ──────────────────────────────────────────────────────────────────

const _mcqCount   = AIRWAY_QUESTIONS.filter(q => q.type === 'mcq').length;
const _multiCount = AIRWAY_QUESTIONS.filter(q => q.type === 'multi').length;

export const AIRWAY_METADATA = {
  nodeId:    "node-2",
  courseId:  "basics-of-anesthesia",
  chapter:   "Chapter 2",
  title:     "Airway Management",
  totalQuestions: AIRWAY_QUESTIONS.length,
  questionTypes: { mcq: _mcqCount, multi: _multiCount, short: 0 },
};
