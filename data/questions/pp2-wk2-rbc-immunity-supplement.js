/**
 * BIOL-510-A Adv Phys & Pathophys II — Week 2 SUPPLEMENT
 * Red Blood Cells / Resistance to Infection I & II (Ch. 33–35)
 * Guyton & Hall 14e — sourced from lecture slides
 * 60 additional MCQs to supplement the original 25-question bank.
 */

export const PP2_WK2_SUPPLEMENT_QUESTIONS = [

  /* ================================================================
     Ch. 33 — Red Blood Cells, Anemia, and Polycythemia  (20 MCQs)
     ================================================================ */

  // --- RBC Structure and Function (4) ---

  {
    id: "pp2-w2s-001",
    type: "mcq",
    prompt: "The mature red blood cell has a distinctive biconcave disc shape. What primary advantage does this morphology confer for oxygen transport?",
    setup: "",
    ans: [
      { t: "High surface area to volume ratio lets O2 diffuse rapidly to interior hemoglobin", ok: true },
      { t: "ATP dependent membrane pumps in the concavities actively transport O2 into the cell", ok: false },
      { t: "Peripheral hemoglobin packing builds a steep gradient pulling O2 inward from plasma", ok: false },
      { t: "Disc shape blocks entry into splenic sinusoids, preventing premature RBC destruction", ok: false },
    ],
    rationale: "The biconcave disc shape gives the mature RBC an exceptionally high surface area to volume ratio, which shortens the diffusion distance for O2 from any point on the membrane to hemoglobin molecules inside. This shape also provides excess membrane surface area relative to cell volume, allowing the cell to deform dramatically when squeezing through capillaries as narrow as 3 micrometers without rupturing. RBCs lack mitochondria and therefore cannot use ATP dependent O2 transport. For the CRNA, understanding RBC deformability is relevant when managing patients receiving large volume transfusions of stored blood, because storage lesions reduce membrane flexibility and potentially impair microcirculatory flow. Guyton Ch. 33.", // source: Ch 33 slide 2
    scene: "hematology",
    sceneCfg: { label: "RBC BICONCAVE SHAPE" },
    metadata: { topic: "RBC Structure and Function", priority: "medium" },
  },

  {
    id: "pp2-w2s-002",
    type: "mcq",
    prompt: "Red blood cells can pass through capillaries much smaller than their own diameter. Which structural feature primarily enables this remarkable deformability?",
    setup: "",
    ans: [
      { t: "Excess membrane surface relative to volume lets it fold without stretching to rupture", ok: true },
      { t: "Active cytoskeletal contraction powered by mitochondrial ATP within the erythrocyte", ok: false },
      { t: "Rapid aquaporin mediated water efflux shrinks the cell to fit through narrow passages", ok: false },
      { t: "Reversible fragmentation into smaller pieces that reassemble after crossing the vessel", ok: false },
    ],
    rationale: "Mature RBCs are 7 to 8 micrometers in diameter but routinely deform to pass through capillaries as narrow as 3 micrometers. The biconcave disc shape provides substantial excess membrane relative to cell contents, so the membrane can fold and bend without being stretched to its elastic limit. Mature RBCs lack mitochondria and a nucleus, so they cannot perform active cytoskeletal contraction. For the CRNA, conditions that reduce membrane deformability (hereditary spherocytosis, storage lesions in banked blood, sickle cell disease) impair microcirculatory flow and can contribute to tissue ischemia. Guyton Ch. 33.", // source: Ch 33 slide 2
    scene: "hematology",
    sceneCfg: { label: "RBC DEFORMABILITY" },
    metadata: { topic: "RBC Structure and Function", priority: "medium" },
  },

  {
    id: "pp2-w2s-003",
    type: "mcq",
    prompt: "The normal red blood cell concentration differs between men and women. Which values are correct?",
    setup: "",
    ans: [
      { t: "Men about 5,200,000/mm3; women about 4,700,000/mm3; counts rise at high altitude", ok: true },
      { t: "Men about 4,700,000/mm3; women about 5,200,000/mm3; estrogen drives EPO more than testosterone", ok: false },
      { t: "Both sexes identical at about 4,000,000/mm3 under normal sea level conditions", ok: false },
      { t: "Men about 7,000,000/mm3; women about 6,500,000/mm3, reflecting greater muscle mass", ok: false },
    ],
    rationale: "Normal RBC counts are higher in men (approximately 5.2 million/mm3) than in women (approximately 4.7 million/mm3). Testosterone stimulates EPO production and has a direct stimulatory effect on erythroid progenitors in the bone marrow, which accounts for the sex difference. Counts are physiologically elevated at high altitude due to chronic hypoxia driven EPO secretion. For the CRNA, knowledge of normal RBC count ranges is essential for interpreting preoperative labs and recognizing pathologic polycythemia versus physiologic altitude adaptation. Guyton Ch. 33.", // source: Ch 33 slide 3
    scene: "hematology",
    sceneCfg: { label: "RBC COUNT — SEX DIFFERENCES" },
    metadata: { topic: "RBC Structure and Function", priority: "high" },
  },

  {
    id: "pp2-w2s-004",
    type: "mcq",
    prompt: "Normal hematocrit (the fraction of blood volume occupied by packed red blood cells) in a healthy adult is approximately:",
    setup: "",
    ans: [
      { t: "40 to 45 percent, with slightly lower values in women due to lower circulating RBC mass", ok: true },
      { t: "55 to 60 percent, reflecting the fact that cellular elements dominate blood volume over plasma", ok: false },
      { t: "20 to 25 percent, because plasma constitutes the vast majority of whole blood", ok: false },
      { t: "30 to 35 percent in men and 25 to 30 percent in women under normal sea level conditions", ok: false },
    ],
    rationale: "Normal hematocrit is 40 to 45 percent (slightly lower in women, approximately 36 to 44%). Hematocrit below 35% generally indicates anemia, while values above 50 to 55% suggest polycythemia. An elevated hematocrit increases blood viscosity, raising systemic vascular resistance and the risk of thrombotic events. For the CRNA, hematocrit is a critical preoperative value that guides decisions about transfusion thresholds, acceptable blood loss calculations, and assessment of oxygen carrying capacity. Guyton Ch. 33.", // source: Ch 33 slide 3
    scene: "hematology",
    sceneCfg: { label: "NORMAL HEMATOCRIT" },
    metadata: { topic: "RBC Structure and Function", priority: "high" },
  },

  // --- Erythropoiesis Development (2) ---

  {
    id: "pp2-w2s-005",
    type: "mcq",
    prompt: "During the first few weeks of embryonic development, erythropoiesis occurs primarily in the:",
    setup: "",
    ans: [
      { t: "Yolk sac, which serves as the earliest site of blood cell formation before intraembryonic hematopoiesis begins", ok: true },
      { t: "Bone marrow, which is the primary hematopoietic organ from the earliest stages of embryogenesis through adulthood", ok: false },
      { t: "Fetal liver and spleen, which assume hematopoietic function only during the middle trimester of development", ok: false },
      { t: "Thymus, where all blood cell lineages including erythrocytes originate before migrating to other organs", ok: false },
    ],
    rationale: "Erythropoiesis shifts through three anatomic sites during development. The yolk sac is the first site, producing primitive nucleated erythroblasts during the first few weeks of embryonic life. By the middle trimester, the liver, spleen, and lymph nodes become the primary sites. During the last month of gestation, the bone marrow assumes this role and remains the dominant site throughout postnatal life. For the CRNA, understanding this developmental sequence is relevant when caring for premature neonates whose hematopoietic systems may still involve extramedullary sites. Guyton Ch. 33.", // source: Ch 33 slide 4
    scene: "hematology",
    sceneCfg: { label: "YOLK SAC ERYTHROPOIESIS" },
    metadata: { topic: "Erythropoiesis Development", priority: "medium" },
  },

  {
    id: "pp2-w2s-006",
    type: "mcq",
    prompt: "In postnatal life, the primary site of red blood cell production is the:",
    setup: "",
    ans: [
      { t: "Bone marrow; in adults the vertebrae, sternum, ribs, and pelvis make nearly all RBCs", ok: true },
      { t: "Liver, which stays the dominant erythropoietic organ from fetal life into adulthood", ok: false },
      { t: "Spleen, where red pulp macrophages nurture progenitors and release mature RBCs", ok: false },
      { t: "Peripheral lymph nodes, which convert lymphoid tissue to erythroid tissue with EPO", ok: false },
    ],
    rationale: "Beginning in the last month of gestation and continuing throughout postnatal life, the bone marrow is the exclusive site of erythropoiesis under normal conditions. In children, virtually all bones contain red (hematopoietic) marrow. By adulthood, red marrow is confined to the axial skeleton (vertebrae, sternum, ribs, pelvis, skull) and the proximal ends of the femur and humerus. Under severe hematopoietic stress, the liver and spleen can resume extramedullary hematopoiesis. For the CRNA, this explains why bone marrow biopsy of the iliac crest is the standard diagnostic procedure for hematologic disorders. Guyton Ch. 33.", // source: Ch 33 slide 4
    scene: "hematology",
    sceneCfg: { label: "BONE MARROW ERYTHROPOIESIS" },
    metadata: { topic: "Erythropoiesis Development", priority: "medium" },
  },

  // --- Hematopoietic Stem Cell Lineage (2) ---

  {
    id: "pp2-w2s-007",
    type: "mcq",
    prompt: "Hematopoiesis is regulated by two categories of signals: growth inducers and differentiation inducers. Growth inducers such as interleukin 3 (IL-3) primarily:",
    setup: "",
    ans: [
      { t: "Drive proliferation of stem and progenitor cells, expanding the precursor pool", ok: true },
      { t: "Commit a progenitor to terminally differentiate into one mature lineage like RBCs", ok: false },
      { t: "Stimulate splenic macrophages to destroy and clear senescent circulating blood cells", ok: false },
      { t: "Transport iron from ferritin stores to developing erythroblasts in the bone marrow", ok: false },
    ],
    rationale: "Hematopoiesis is driven by two complementary signal types. Growth inducers (IL-3, GM-CSF, SCF) promote proliferation and amplification of stem and progenitor cell pools. Differentiation inducers commit these expanded progenitors to mature into specific lineages (e.g., EPO for erythrocytes, G-CSF for neutrophils, TPO for megakaryocytes). This two-signal model explains how the marrow can rapidly increase production of specific cell types (e.g., neutrophils during infection, RBCs during hypoxia) while maintaining the stem cell reserve. For the CRNA, understanding growth factors is relevant when managing patients receiving recombinant colony stimulating factors (filgrastim, epoetin alfa) perioperatively. Guyton Ch. 33.", // source: Ch 33 slide 5
    scene: "hematology",
    sceneCfg: { label: "GROWTH INDUCERS — IL-3" },
    metadata: { topic: "Hematopoietic Stem Cell Lineage", priority: "medium" },
  },

  {
    id: "pp2-w2s-008",
    type: "mcq",
    prompt: "In the hematopoietic lineage, the colony forming unit for erythrocytes (CFU-E) represents:",
    setup: "",
    ans: [
      { t: "A committed erythroid progenitor that can give rise only to red blood cell precursors", ok: true },
      { t: "A pluripotent stem cell able to produce all lineages including WBCs and platelets", ok: false },
      { t: "A mature erythrocyte just released from the marrow into the peripheral circulation", ok: false },
      { t: "A progenitor committed to the granulocyte and monocyte lineage, called CFU-GM", ok: false },
    ],
    rationale: "Hematopoietic differentiation follows a hierarchical pathway: pluripotent HSC to multipotent progenitor (CFU-S) to lineage committed progenitors. CFU-E is the committed erythroid progenitor that responds primarily to EPO and gives rise only to erythrocyte precursors. Similarly, CFU-GM produces granulocytes and monocytes, while CFU-M (megakaryocyte) produces platelets. The lymphoid stem cell (LSC) gives rise to T and B lymphocytes through a separate pathway. Understanding this hierarchy helps CRNAs appreciate why pancytopenia (aplastic anemia) involves stem cell failure at the HSC level, while isolated cytopenias may reflect problems at the committed progenitor level. Guyton Ch. 33.", // source: Ch 33 slide 6
    scene: "hematology",
    sceneCfg: { label: "CFU-E — ERYTHROID PROGENITOR" },
    metadata: { topic: "Hematopoietic Stem Cell Lineage", priority: "medium" },
  },

  // --- Erythropoiesis Maturation (2) ---

  {
    id: "pp2-w2s-009",
    type: "mcq",
    prompt: "Which sequence correctly describes the maturation stages of erythrocyte development from earliest precursor to circulating red blood cell?",
    setup: "",
    ans: [
      { t: "Proerythroblast, basophil, polychromatophil, orthochromatic, reticulocyte, erythrocyte", ok: true },
      { t: "Reticulocyte, proerythroblast, basophil, polychromatophil, orthochromatic, erythrocyte", ok: false },
      { t: "Myeloblast, promyelocyte, myelocyte, metamyelocyte, band cell, mature erythrocyte", ok: false },
      { t: "Proerythroblast, orthochromatic, basophil, polychromatophil, reticulocyte, erythrocyte", ok: false },
    ],
    rationale: "Erythrocyte maturation proceeds through six recognizable stages. The proerythroblast is the earliest identifiable erythroid precursor. Progressive hemoglobin accumulation and nuclear condensation occur through the basophil, polychromatophil, and orthochromatic erythroblast stages. The nucleus is extruded at the orthochromatic stage, producing a reticulocyte that retains residual ribosomal RNA for 1 to 2 days. The third distractor describes the granulocyte maturation sequence, not the erythrocyte pathway. For the CRNA, recognizing that the reticulocyte count reflects marrow erythropoietic activity is essential for distinguishing hemolytic from hypoproliferative anemias preoperatively. Guyton Ch. 33.", // source: Ch 33 slide 7
    scene: "hematology",
    sceneCfg: { label: "ERYTHROCYTE MATURATION STAGES" },
    metadata: { topic: "Erythropoiesis Maturation", priority: "high" },
  },

  {
    id: "pp2-w2s-010",
    type: "mcq",
    prompt: "A reticulocyte is best described as:",
    setup: "",
    ans: [
      { t: "An immature RBC that has extruded its nucleus but keeps RNA; it matures in 1 to 2 days", ok: true },
      { t: "A nucleated erythroid precursor in the marrow not yet making any hemoglobin at all", ok: false },
      { t: "A senescent erythrocyte near the end of its 120 day life that has turned spherical", ok: false },
      { t: "A platelet precursor fragment shed from megakaryocytes into the peripheral blood", ok: false },
    ],
    rationale: "Reticulocytes are the final immature stage of erythrocyte development. They have already extruded their nucleus but retain ribosomal RNA and organelles for an additional 1 to 2 days, during which they complete hemoglobin synthesis. The normal reticulocyte count is 0.5 to 1.5% of circulating RBCs. An elevated reticulocyte count indicates active marrow compensation for RBC loss (hemolysis, hemorrhage), while a low count suggests marrow production failure. For the CRNA, the reticulocyte count is a rapid bedside indicator that helps differentiate anemia etiologies when planning perioperative blood management. Guyton Ch. 33.", // source: Ch 33 slide 7
    scene: "hematology",
    sceneCfg: { label: "RETICULOCYTE DEFINITION" },
    metadata: { topic: "Erythropoiesis Maturation", priority: "high" },
  },

  // --- EPO Regulation (4) ---

  {
    id: "pp2-w2s-011",
    type: "mcq",
    prompt: "The erythropoietin (EPO) feedback loop links tissue oxygenation to RBC production. Which of the following conditions would NOT directly stimulate increased EPO secretion?",
    setup: "",
    ans: [
      { t: "Polycythemia vera; autonomous RBC growth suppresses EPO by negative feedback", ok: true },
      { t: "Chronic GI blood loss, which lowers circulating RBC mass and tissue oxygen delivery", ok: false },
      { t: "Chronic obstructive pulmonary disease, which impairs gas exchange and lowers arterial O2", ok: false },
      { t: "Residence at high altitude, where low atmospheric O2 reduces tissue oxygenation", ok: false },
    ],
    rationale: "The EPO feedback loop works as follows: tissue hypoxia stimulates the kidneys to produce EPO, which acts on bone marrow erythroid progenitors to increase RBC production until tissue oxygenation is restored. Any condition that reduces tissue O2 delivery (low blood volume, anemia, decreased hemoglobin, poor blood flow, pulmonary disease) increases EPO. In polycythemia vera, the JAK2 V617F mutation drives autonomous RBC production independent of EPO, so the elevated RBC mass suppresses EPO through negative feedback. For the CRNA, distinguishing primary from secondary polycythemia by EPO level guides preoperative risk assessment and phlebotomy decisions. Guyton Ch. 33.", // source: Ch 33 slide 8
    scene: "hematology",
    sceneCfg: { label: "EPO FEEDBACK LOOP" },
    metadata: { topic: "EPO Regulation", priority: "high" },
  },

  {
    id: "pp2-w2s-012",
    type: "mcq",
    prompt: "Compensatory (secondary) polycythemia is characterized by an elevated RBC mass driven by increased EPO secretion. Which set of conditions correctly represents causes of compensatory polycythemia?",
    setup: "",
    ans: [
      { t: "High altitude, chronic lung disease, and heart failure; all lower tissue O2 delivery", ok: true },
      { t: "JAK2 V617F mutation, myelofibrosis, and essential thrombocythemia; clonal neoplasms", ok: false },
      { t: "Iron overload, excess vitamin B12 intake, and anabolic steroid abuse; substrate excess", ok: false },
      { t: "Acute hemorrhage, dehydration, and splenic sequestration; no true RBC mass increase", ok: false },
    ],
    rationale: "Compensatory polycythemia occurs when tissue hypoxia chronically stimulates EPO production, driving a sustained increase in RBC mass. Classic triggers include high altitude (reduced PO2), chronic lung disease (impaired gas exchange), and heart failure (reduced cardiac output and tissue perfusion). This is physiologically appropriate and distinct from polycythemia vera, which is a neoplastic autonomous process. For the CRNA, patients with compensatory polycythemia have elevated hematocrit and blood viscosity, increasing perioperative thrombotic risk. Phlebotomy to reduce Hct below 55% is often recommended before elective surgery. Guyton Ch. 33.", // source: Ch 33 slide 9
    scene: "hematology",
    sceneCfg: { label: "COMPENSATORY POLYCYTHEMIA" },
    metadata: { topic: "EPO Regulation", priority: "high" },
  },

  {
    id: "pp2-w2s-013",
    type: "mcq",
    prompt: "A patient who has undergone bilateral nephrectomy still produces a small amount of erythropoietin. What is the approximate residual EPO production and resulting hematocrit in an anephric individual?",
    setup: "",
    ans: [
      { t: "About 10% of normal, made by the liver, supporting a hematocrit near 23 to 25 percent", ok: true },
      { t: "Zero EPO, so hematocrit falls to unmeasurable levels within weeks without exogenous EPO", ok: false },
      { t: "About 50% of normal from the adrenal glands, keeping hematocrit near 35 to 40 percent", ok: false },
      { t: "Full production from the marrow itself, so hematocrit stays normal at 40 to 45 percent", ok: false },
    ],
    rationale: "While the kidneys produce approximately 90% of circulating EPO in adults, the liver contributes the remaining 10%. In anephric patients, this hepatic EPO production can sustain a hematocrit of approximately 23 to 25 percent, which is insufficient for normal oxygen delivery but prevents fatal anemia. Extrarenal EPO stimulants include catecholamines (epinephrine, norepinephrine) and prostaglandins. Patients with chronic kidney disease (CKD) develop anemia as renal EPO production declines, and they typically require erythropoiesis stimulating agents (ESAs) such as epoetin alfa or darbepoetin. For the CRNA, CKD patients presenting for surgery often have baseline hematocrits of 25 to 33 percent despite ESA therapy. Guyton Ch. 33.", // source: Ch 33 slide 10
    scene: "hematology",
    sceneCfg: { label: "ANEPHRIC EPO — HEPATIC SOURCE" },
    metadata: { topic: "EPO Regulation", priority: "high" },
  },

  {
    id: "pp2-w2s-014",
    type: "mcq",
    prompt: "After acute blood loss triggers tissue hypoxia, how quickly does the erythropoietic system respond?",
    setup: "",
    ans: [
      { t: "Plasma EPO rises within hours but new RBCs take about 5 days; output can rise 10 fold", ok: true },
      { t: "New RBCs appear in 2 to 4 hours because the marrow stores mature cells for instant release", ok: false },
      { t: "EPO is unchanged for 48 to 72 hours, then output slowly doubles over several weeks", ok: false },
      { t: "The spleen releases its RBC reserve in seconds, offsetting losses up to 30 percent of volume", ok: false },
    ],
    rationale: "The erythropoietic response to hypoxia follows a predictable timeline. Hypoxia stabilizes HIF in renal interstitial cells, triggering EPO gene transcription within minutes. Plasma EPO levels rise within hours. However, the time required for erythroid progenitors to proliferate, mature through multiple stages, and release reticulocytes means new RBCs reach the circulation in approximately 5 days. Under maximal stimulation, the marrow can increase RBC production up to 10 fold. EPO remains elevated until tissue oxygenation is restored. For the CRNA, this 5 day lag explains why postoperative hemoglobin continues to fall for several days after surgical blood loss before marrow compensation begins. Guyton Ch. 33.", // source: Ch 33 slide 11
    scene: "hematology",
    sceneCfg: { label: "EPO RESPONSE TIMELINE" },
    metadata: { topic: "EPO Regulation", priority: "high" },
  },

  // --- Vitamin B12 and Folate Metabolism (4) ---

  {
    id: "pp2-w2s-015",
    type: "mcq",
    prompt: "Vitamin B12 and folic acid are both essential for normal erythropoiesis. Their shared critical role is in:",
    setup: "",
    ans: [
      { t: "DNA replication; deficiency stalls nuclear maturation while hemoglobin synthesis goes on", ok: true },
      { t: "Hemoglobin synthesis; deficiency of either blocks insertion of iron into the heme ring", ok: false },
      { t: "Membrane phospholipid production; deficiency yields fragile RBCs that rupture in vessels", ok: false },
      { t: "Mitochondrial oxidative phosphorylation; deficiency limits ATP for erythroblast division", ok: false },
    ],
    rationale: "B12 (cobalamin) and folate are essential cofactors in the thymidylate synthase pathway, which converts deoxyuridylate to thymidylate for DNA synthesis. When either is deficient, DNA replication slows while RNA directed cytoplasmic growth (including hemoglobin accumulation) continues at a normal pace. This nuclear-cytoplasmic dyssynchrony produces abnormally large cells (megaloblasts and macrocytes) that are fragile and irregular in shape. The resulting macrocytic anemia (MCV greater than 100 fL) is accompanied by hypersegmented neutrophils on the peripheral smear. For the CRNA, nitrous oxide irreversibly oxidizes B12, inactivating methionine synthase, which is why N2O is contraindicated in B12 deficient patients and prolonged N2O exposure can precipitate megaloblastic changes. Guyton Ch. 33.", // source: Ch 33 slide 12
    scene: "hematology",
    sceneCfg: { label: "B12 AND FOLATE — DNA SYNTHESIS" },
    metadata: { topic: "Vitamin B12 and Folate Metabolism", priority: "high" },
  },

  {
    id: "pp2-w2s-016",
    type: "mcq",
    prompt: "Pernicious anemia results from a failure to absorb vitamin B12. The underlying defect involves:",
    setup: "",
    ans: [
      { t: "Atrophic gastric mucosa fails to make intrinsic factor, so ileal B12 absorption is lost", ok: true },
      { t: "Excessive hepatic clearance of B12 depletes plasma faster than diet can replace it", ok: false },
      { t: "Loss of ileal transferrin receptors blocks B12 carrier binding and its endocytosis", ok: false },
      { t: "Autoimmune destruction of jejunal villi removes the absorption site for B12 and iron", ok: false },
    ],
    rationale: "Intrinsic factor is a glycoprotein produced by gastric parietal cells. It binds dietary B12 in the stomach, protecting the vitamin from enzymatic degradation as it transits the intestine. The IF-B12 complex binds to specific receptors (cubilin) on the mucosal surface of the terminal ileum, where it is absorbed via receptor mediated pinocytosis. In pernicious anemia, autoimmune destruction of parietal cells (or antibodies against IF itself) eliminates IF production, preventing B12 absorption regardless of dietary intake. B12 is stored in the liver in quantities sufficient for 3 to 4 years, so clinical manifestations develop slowly. For the CRNA, patients with pernicious anemia or post-gastrectomy patients lack IF and require parenteral B12 supplementation. Guyton Ch. 33.", // source: Ch 33 slide 13
    scene: "hematology",
    sceneCfg: { label: "PERNICIOUS ANEMIA — INTRINSIC FACTOR" },
    metadata: { topic: "Vitamin B12 and Folate Metabolism", priority: "high" },
  },

  {
    id: "pp2-w2s-017",
    type: "mcq",
    prompt: "Vitamin B12 is stored primarily in the liver. After complete cessation of B12 absorption, how long can hepatic stores sustain normal hematologic function before clinical deficiency develops?",
    setup: "",
    ans: [
      { t: "3 to 4 years; large hepatic reserves deplete slowly, so deficiency develops insidiously", ok: true },
      { t: "2 to 4 weeks; minimal stores deplete fast, causing acute onset megaloblastic anemia", ok: false },
      { t: "3 to 6 months; moderate hepatic stores give a brief buffer before symptoms appear", ok: false },
      { t: "More than 10 years; the liver stores enough B12 to last a lifetime without intake", ok: false },
    ],
    rationale: "The liver stores approximately 2 to 5 mg of vitamin B12, and the normal daily requirement is only 1 to 3 micrograms. This means that after complete cessation of B12 absorption (as occurs after total gastrectomy or with loss of intrinsic factor), hepatic stores can sustain normal hematologic and neurologic function for 3 to 4 years before depletion causes clinical disease. This prolonged latency explains why pernicious anemia and post-gastrectomy B12 deficiency present insidiously. Folate stores, by contrast, last only 3 to 4 months. For the CRNA, post-gastrectomy patients presenting years after surgery may develop unrecognized B12 deficiency with neurologic complications. Guyton Ch. 33.", // source: Ch 33 slide 13
    scene: "hematology",
    sceneCfg: { label: "B12 HEPATIC STORES — 3 TO 4 YEARS" },
    metadata: { topic: "Vitamin B12 and Folate Metabolism", priority: "medium" },
  },

  {
    id: "pp2-w2s-018",
    type: "mcq",
    prompt: "Which statement about folic acid (folate) is correct?",
    setup: "",
    ans: [
      { t: "Found in green vegetables, fruits, and meats but destroyed by prolonged cooking", ok: true },
      { t: "Stored in the liver for 3 to 4 years like B12, so deficiency takes years to develop", ok: false },
      { t: "Synthesized de novo by human cells, so dietary intake is unnecessary for adults", ok: false },
      { t: "Requires intrinsic factor for absorption in the terminal ileum, just like B12", ok: false },
    ],
    rationale: "Folic acid is abundant in fresh green vegetables, fruits, and meats but is heat labile and destroyed by prolonged cooking. Unlike B12, folate stores are limited (lasting only 3 to 4 months), so dietary deficiency develops relatively quickly in malnourished individuals, alcoholics, or those with poor diets. Folate is absorbed in the proximal jejunum without requiring intrinsic factor. Humans cannot synthesize folate de novo. Deficiency produces macrocytic anemia identical to B12 deficiency on peripheral smear, but without the neurologic manifestations (subacute combined degeneration) seen in B12 deficiency. For the CRNA, folate supplementation is important in pregnant patients to prevent neural tube defects. Guyton Ch. 33.", // source: Ch 33 slide 14
    scene: "hematology",
    sceneCfg: { label: "FOLIC ACID — DIETARY SOURCES" },
    metadata: { topic: "Vitamin B12 and Folate Metabolism", priority: "medium" },
  },

  // --- Hemoglobin Oxygen Transport (1) ---

  {
    id: "pp2-w2s-019",
    type: "mcq",
    prompt: "Each hemoglobin molecule contains four heme groups, each with a central iron atom. When fully saturated with oxygen, how many total oxygen atoms does one hemoglobin molecule carry?",
    setup: "",
    ans: [
      { t: "8 oxygen atoms; four heme irons each bind one O2 molecule, giving four O2 in total", ok: true },
      { t: "4 oxygen atoms; each heme binds a single oxygen atom rather than a whole O2 molecule", ok: false },
      { t: "2 oxygen atoms; only one of the four heme groups can bind O2 at physiologic pH", ok: false },
      { t: "16 oxygen atoms; each heme group binds two O2 molecules, giving eight O2 in total", ok: false },
    ],
    rationale: "Hemoglobin is a tetramer consisting of two alpha and two beta globin subunits, each containing one heme group with a central ferrous (Fe2+) iron atom. Each iron atom reversibly binds one molecule of molecular oxygen (O2), and since each O2 molecule contains two oxygen atoms, the total is 4 O2 molecules or 8 oxygen atoms per hemoglobin molecule. The oxygen is carried as intact molecular O2, loosely and reversibly bound. Cooperative binding means that O2 binding to one heme facilitates O2 binding to the remaining hemes, producing the sigmoidal oxyhemoglobin dissociation curve. For the CRNA, this cooperative binding is what allows hemoglobin to load efficiently in the lungs and unload efficiently in the tissues. Guyton Ch. 33.", // source: Ch 33 slide 15
    scene: "hematology",
    sceneCfg: { label: "HEMOGLOBIN — 8 OXYGEN ATOMS" },
    metadata: { topic: "Hemoglobin Oxygen Transport", priority: "high" },
  },

  // --- Iron Homeostasis (1) ---

  {
    id: "pp2-w2s-020",
    type: "mcq",
    prompt: "Total body iron content is approximately 4 to 5 grams. The largest fraction of this iron is found in:",
    setup: "",
    ans: [
      { t: "Hemoglobin, holding about 65%; the rest is ferritin, myoglobin, heme, and transferrin", ok: true },
      { t: "Ferritin in the reticuloendothelial system, storing about 65% as an emergency reserve", ok: false },
      { t: "Myoglobin in skeletal muscle, holding the majority because total muscle mass is large", ok: false },
      { t: "Plasma transferrin, circulating about 65% for continuous delivery to all body tissues", ok: false },
    ],
    rationale: "Iron distribution in the body follows a clear hierarchy. The vast majority (65%) resides in hemoglobin within circulating RBCs and developing erythroblasts. Storage iron (15 to 30%) exists as ferritin and hemosiderin, primarily in the liver, spleen, and bone marrow macrophages. Myoglobin in skeletal and cardiac muscle holds 4%, while intracellular heme enzymes (cytochromes, catalase) contain about 1%. Only 0.1% circulates bound to the transport protein transferrin, though this small pool turns over rapidly. For the CRNA, this distribution explains why chronic blood loss is the most common cause of iron deficiency in adults, since each milliliter of packed RBCs contains approximately 1 mg of iron. Guyton Ch. 33.", // source: Ch 33 slide 16
    scene: "hematology",
    sceneCfg: { label: "IRON DISTRIBUTION — 65% IN HEMOGLOBIN" },
    metadata: { topic: "Iron Homeostasis", priority: "high" },
  },

  /* ================================================================
     Ch. 34 — Resistance to Infection: I. Leukocytes,
     Granulocytes, Monocyte-Macrophage System, Inflammation (20 MCQs)
     ================================================================ */

  // --- Leukocyte Differential (4) ---

  {
    id: "pp2-w2s-021",
    type: "mcq",
    prompt: "The total white blood cell count in a normal adult is approximately:",
    setup: "",
    ans: [
      { t: "7,000 per mm3, almost 1,000 fold fewer than circulating red blood cells", ok: true },
      { t: "70,000 per mm3, reflecting the high metabolic demands of immune surveillance", ok: false },
      { t: "700 per mm3, because white blood cells are extremely rare among blood elements", ok: false },
      { t: "5,000,000 per mm3, about equal to the red cell count for balanced delivery", ok: false },
    ],
    rationale: "The normal total WBC count ranges from approximately 4,500 to 11,000 per mm3, with an average of about 7,000 per mm3. This is roughly 1,000 times fewer than RBCs (5 million per mm3). The platelet count (approximately 300,000 per mm3) falls between these two values. Leukocytosis (WBC above 11,000) suggests infection, inflammation, or hematologic malignancy, while leukopenia (below 4,500) may indicate bone marrow suppression or overwhelming sepsis. For the CRNA, the preoperative WBC count and differential help assess infection risk and guide decisions about proceeding with elective surgery. Guyton Ch. 34.", // source: Ch 34 slide 3
    scene: "hematology",
    sceneCfg: { label: "TOTAL WBC COUNT — 7,000/mm3" },
    metadata: { topic: "Leukocyte Differential", priority: "high" },
  },

  {
    id: "pp2-w2s-022",
    type: "mcq",
    prompt: "In the normal WBC differential, which cell type has the highest proportion?",
    setup: "",
    ans: [
      { t: "Neutrophils at about 62%, the dominant phagocyte and first defense against bacteria", ok: true },
      { t: "Lymphocytes at about 62%, since adaptive cells must outnumber innate cells overall", ok: false },
      { t: "Monocytes at about 62%, since they are precursors of all tissue macrophages in the body", ok: false },
      { t: "Eosinophils at about 62%, from constant low level parasitic and allergic surveillance", ok: false },
    ],
    rationale: "The normal WBC differential is: neutrophils 62%, lymphocytes 30%, monocytes 5.3%, eosinophils 2.3%, and basophils 0.4%. Neutrophils are the most abundant WBC type and serve as the primary phagocytic defense against bacterial infections. The absolute neutrophil count (ANC) is calculated as WBC multiplied by the percentage of neutrophils. Neutropenia (ANC below 1,500 per mm3) dramatically increases the risk of bacterial and fungal infections. For the CRNA, monitoring the ANC is critical when managing chemotherapy patients or those with hematologic disorders who present for surgery. Guyton Ch. 34.", // source: Ch 34 slide 3
    scene: "hematology",
    sceneCfg: { label: "NEUTROPHILS — 62% OF WBCs" },
    metadata: { topic: "Leukocyte Differential", priority: "high" },
  },

  {
    id: "pp2-w2s-023",
    type: "mcq",
    prompt: "Basophils are the least common white blood cell in the peripheral blood. Their normal proportion in the WBC differential is approximately:",
    setup: "",
    ans: [
      { t: "0.4%, the rarest granulocyte; they hold histamine and heparin like tissue mast cells", ok: true },
      { t: "2.3%, the same as eosinophils; basophils and eosinophils are present in equal numbers", ok: false },
      { t: "5.3%, the same as monocytes; basophils and monocytes share a common progenitor cell", ok: false },
      { t: "10%, because basophils are needed in high numbers for continuous allergic surveillance", ok: false },
    ],
    rationale: "Basophils comprise only 0.4% of circulating WBCs, making them the rarest leukocyte in peripheral blood. Despite their low numbers, basophils play an important role in allergic responses and inflammation. They contain granules rich in histamine, heparin, and other mediators, similar to mast cells (their tissue-resident counterparts). Eosinophils constitute 2.3% and are involved in parasitic defense and allergic modulation. For the CRNA, basophil activation during anesthetic drug administration can contribute to anaphylactoid (non-IgE mediated) histamine release, which is clinically indistinguishable from true anaphylaxis. Guyton Ch. 34.", // source: Ch 34 slide 3
    scene: "hematology",
    sceneCfg: { label: "BASOPHILS — 0.4% OF WBCs" },
    metadata: { topic: "Leukocyte Differential", priority: "medium" },
  },

  {
    id: "pp2-w2s-024",
    type: "mcq",
    prompt: "Lymphocytes comprise the second largest fraction of circulating white blood cells, at approximately:",
    setup: "",
    ans: [
      { t: "30%; they mediate adaptive immunity via antigen specific B cell and T cell responses", ok: true },
      { t: "62%; lymphocytes outnumber every other circulating white blood cell type combined", ok: false },
      { t: "5.3%; they are scarce in blood because most of them reside in lymphoid tissues", ok: false },
      { t: "2.3%; lymphocytes are rare in circulation and function mainly within the thymus", ok: false },
    ],
    rationale: "Lymphocytes account for approximately 30% of circulating WBCs. They are the mediators of acquired immunity: B lymphocytes produce antibodies (humoral immunity), while T lymphocytes provide cell mediated immunity (CD4+ helper cells and CD8+ cytotoxic cells). The blood lymphocyte count represents only a small fraction of total body lymphocytes; the majority reside in lymphoid organs (lymph nodes, spleen, thymus, Peyer's patches, tonsils). Lymphocytes continuously recirculate between blood and lymph, providing immune surveillance. For the CRNA, lymphopenia can indicate immunosuppression from steroids, chemotherapy, or HIV, increasing perioperative infection risk. Guyton Ch. 34.", // source: Ch 34 slide 3
    scene: "hematology",
    sceneCfg: { label: "LYMPHOCYTES — 30% OF WBCs" },
    metadata: { topic: "Leukocyte Differential", priority: "medium" },
  },

  // --- Leukocyte Development and Lifespan (6) ---

  {
    id: "pp2-w2s-025",
    type: "mcq",
    prompt: "The bone marrow maintains a reserve pool of granulocytes and monocytes. This reserve contains approximately:",
    setup: "",
    ans: [
      { t: "3 times the circulating pool, about a 6 day supply mobilized fast during infection", ok: true },
      { t: "Equal to the circulating pool, providing only a 1 to 2 day reserve for the body", ok: false },
      { t: "10 times the circulating pool, providing a 3 week supply with no new production", ok: false },
      { t: "A negligible reserve; nearly all granulocytes are released as soon as they mature", ok: false },
    ],
    rationale: "The bone marrow stores approximately 3 times as many granulocytes as are found in the circulating blood at any given time, which represents roughly a 6 day supply. During acute infection, the marrow releases this reserve pool rapidly, producing the leukocytosis (elevated WBC count with left shift) commonly seen in bacterial sepsis. Corticosteroids also mobilize the marrow reserve, which is why steroid administration causes a transient leukocytosis (demargination plus marrow release). For the CRNA, stress-dose steroids given perioperatively can elevate the WBC count, which should not be misinterpreted as new infection. Guyton Ch. 34.", // source: Ch 34 slide 9
    scene: "hematology",
    sceneCfg: { label: "MARROW GRANULOCYTE RESERVE — 6 DAYS" },
    metadata: { topic: "Leukocyte Development and Lifespan", priority: "high" },
  },

  {
    id: "pp2-w2s-026",
    type: "mcq",
    prompt: "Lymphocytes develop primarily in peripheral lymphoid organs. Which set of organs correctly represents major sites of lymphocyte development and residence?",
    setup: "",
    ans: [
      { t: "Thymus, spleen, tonsils, lymph nodes, and Peyer's patches in the gut wall", ok: true },
      { t: "Bone marrow only, where all lymphocytes mature before release into circulation", ok: false },
      { t: "Liver, kidneys, and adrenal glands; they filter blood and so concentrate lymphocytes", ok: false },
      { t: "Skeletal muscle and adipose tissue, where lymphocytes provide local tissue immunity", ok: false },
    ],
    rationale: "Unlike granulocytes and monocytes (which develop in the bone marrow), lymphocytes develop and reside primarily in peripheral lymphoid organs. T cells mature in the thymus, while B cells complete their development in the bone marrow and then migrate to peripheral lymphoid tissues. The spleen, lymph nodes, tonsils, adenoids, and gut-associated lymphoid tissue (Peyer's patches) provide organized microenvironments where lymphocytes encounter antigens, undergo clonal expansion, and differentiate into effector cells. For the CRNA, splenectomy removes a major lymphoid organ, increasing susceptibility to encapsulated organisms (S. pneumoniae, H. influenzae, N. meningitidis) and requiring pre-splenectomy vaccination. Guyton Ch. 34.", // source: Ch 34 slide 9
    scene: "hematology",
    sceneCfg: { label: "LYMPHOID ORGAN DEVELOPMENT" },
    metadata: { topic: "Leukocyte Development and Lifespan", priority: "medium" },
  },

  {
    id: "pp2-w2s-027",
    type: "mcq",
    prompt: "Platelets are produced by which mechanism in the bone marrow?",
    setup: "",
    ans: [
      { t: "Fragmentation of megakaryocyte cytoplasm; proplatelets shed many platelets into blood", ok: true },
      { t: "Direct release from pluripotent stem cells with no intermediate megakaryocyte stage", ok: false },
      { t: "Budding from the surface of circulating monocytes passing through splenic vessels", ok: false },
      { t: "Mitotic division of existing platelets, splitting into two daughters every 5 days", ok: false },
    ],
    rationale: "Megakaryocytes are the largest cells in the bone marrow, with polyploid nuclei (up to 64N from endomitosis). They develop from the megakaryocyte committed progenitor (CFU-M) and reside along bone marrow sinusoidal walls. Their cytoplasm extends long, branching processes called proplatelets that fragment into individual platelets as they are released into the sinusoidal blood. Each megakaryocyte can produce 1,000 to 3,000 platelets. Thrombopoietin (TPO), produced primarily by the liver, is the major regulator of megakaryocyte development. Platelets are replaced approximately every 10 days. For the CRNA, understanding platelet production is relevant when managing thrombocytopenic patients or those receiving TPO receptor agonists. Guyton Ch. 34.", // source: Ch 34 slide 9
    scene: "hematology",
    sceneCfg: { label: "MEGAKARYOCYTE FRAGMENTATION" },
    metadata: { topic: "Leukocyte Development and Lifespan", priority: "medium" },
  },

  {
    id: "pp2-w2s-028",
    type: "mcq",
    prompt: "After granulocytes (primarily neutrophils) are released from the bone marrow, they circulate in the blood for approximately:",
    setup: "",
    ans: [
      { t: "4 to 8 hours, then 4 to 5 days in tissue; both shorten sharply during active infection", ok: true },
      { t: "7 to 10 days in the circulation, much like the normal lifespan of circulating platelets", ok: false },
      { t: "Several weeks to months in circulation, comparable to the lifespan of tissue macrophages", ok: false },
      { t: "Only seconds to minutes, since they marginate and leave the vessels right upon release", ok: false },
    ],
    rationale: "Granulocytes have the shortest circulating lifespan of all WBCs. Neutrophils circulate for only 4 to 8 hours before marginating, adhering to endothelium, and migrating into the tissues via diapedesis. In the tissues they survive an additional 4 to 5 days, during which they perform phagocytosis and bacterial killing. During active infection and inflammation, neutrophil turnover accelerates dramatically as cells are consumed in the inflammatory process. This rapid turnover explains why the marrow must maintain a large reserve pool. For the CRNA, the short circulating half life of neutrophils means that changes in the WBC count reflect acute processes; a rising neutrophil count indicates ongoing bacterial infection or stress response. Guyton Ch. 34.", // source: Ch 34 slide 10
    scene: "hematology",
    sceneCfg: { label: "GRANULOCYTE LIFESPAN — 4 TO 8 HOURS" },
    metadata: { topic: "Leukocyte Development and Lifespan", priority: "high" },
  },

  {
    id: "pp2-w2s-029",
    type: "mcq",
    prompt: "Circulating monocytes have a blood transit time of 10 to 20 hours. After migrating into the tissues, they transform into macrophages that can survive for:",
    setup: "",
    ans: [
      { t: "Months or longer; tissue macrophages are long lived and keep functioning for a long time", ok: true },
      { t: "4 to 5 days, the very same as the tissue lifespan of circulating granulocytes after entry", ok: false },
      { t: "Only 24 hours, so they need continuous replacement from the circulating monocyte pool", ok: false },
      { t: "10 to 20 hours, the same as their time in the bloodstream before tissue conversion begins", ok: false },
    ],
    rationale: "Monocytes represent a transitional stage between bone marrow precursors and tissue macrophages. After a relatively brief circulatory period of 10 to 20 hours, monocytes enter the tissues and differentiate into macrophages. Unlike neutrophils (which die after a few days), tissue macrophages are remarkably long lived, persisting for months or even years. Macrophages can ingest and digest bacteria, extrude the waste products, and continue functioning. They also serve as antigen presenting cells, linking innate and adaptive immunity. For the CRNA, the longevity of tissue macrophages explains why chronic granulomatous inflammation (tuberculosis, sarcoidosis) persists, and why alveolar macrophages provide sustained pulmonary defense. Guyton Ch. 34.", // source: Ch 34 slide 10
    scene: "hematology",
    sceneCfg: { label: "MACROPHAGE LIFESPAN — MONTHS" },
    metadata: { topic: "Leukocyte Development and Lifespan", priority: "medium" },
  },

  {
    id: "pp2-w2s-030",
    type: "mcq",
    prompt: "Platelets circulate in the blood and are replaced approximately every:",
    setup: "",
    ans: [
      { t: "10 days; spleen and liver macrophages clear them and thrombopoietin drives replacement", ok: true },
      { t: "120 days, matching the lifespan of the red cells they interact with during hemostasis", ok: false },
      { t: "24 hours; this very rapid turnover makes the platelet count swing widely day to day", ok: false },
      { t: "4 to 8 hours, the same circulating duration as granulocytes after marrow release", ok: false },
    ],
    rationale: "Platelets have a normal circulating lifespan of approximately 8 to 12 days, with replacement occurring about every 10 days. Senescent platelets are cleared by macrophages primarily in the spleen and liver. The normal platelet count is approximately 150,000 to 400,000 per mm3 (average approximately 300,000 per mm3). Thrombopoietin (TPO) produced by the liver is the primary regulator; when the platelet count drops, unbound TPO increases and stimulates megakaryocyte production. For the CRNA, platelet transfusion for thrombocytopenia or qualitative platelet defects is a common perioperative intervention. Stored platelets have a shelf life of only 5 days at room temperature. Guyton Ch. 34.", // source: Ch 34 slide 10
    scene: "hematology",
    sceneCfg: { label: "PLATELET REPLACEMENT — 10 DAYS" },
    metadata: { topic: "Leukocyte Development and Lifespan", priority: "medium" },
  },

  // --- Neutrophil Recruitment and Migration (2) ---

  {
    id: "pp2-w2s-031",
    type: "mcq",
    prompt: "The recruitment of neutrophils from the bloodstream to a site of bacterial infection involves a specific sequence of events. Which order is correct?",
    setup: "",
    ans: [
      { t: "Margination, firm adhesion, diapedesis, then chemotaxis toward the infection source", ok: true },
      { t: "Chemotaxis first, then margination, then diapedesis, then firm adhesion at the site", ok: false },
      { t: "Diapedesis first through intact endothelium, then margination in tissue, then chemotaxis", ok: false },
      { t: "Phagocytosis in the vessel lumen, then diapedesis to deliver killed bacteria to tissue", ok: false },
    ],
    rationale: "Neutrophil extravasation is a highly organized multistep process. Inflammatory mediators activate local endothelial cells, causing them to express selectins that bind neutrophil surface ligands, producing slow rolling (margination). Subsequent integrin activation produces firm adhesion. The neutrophil then squeezes between endothelial cells (diapedesis) and enters the interstitial space. Once in the tissue, the neutrophil follows a chemical gradient (chemotaxis) toward the infection source. Chemotactic factors include bacterial products, complement fragments (C5a), IL-8, and leukotriene B4. For the CRNA, corticosteroids impair neutrophil margination and diapedesis, which explains steroid-induced leukocytosis (cells remain in circulation) and the increased infection risk in steroid-treated patients. Guyton Ch. 34.", // source: Ch 34 slides 11, 12
    scene: "hematology",
    sceneCfg: { label: "NEUTROPHIL RECRUITMENT STEPS" },
    metadata: { topic: "Neutrophil Recruitment and Migration", priority: "high" },
  },

  {
    id: "pp2-w2s-032",
    type: "mcq",
    prompt: "Chemotaxis is the directed migration of phagocytes toward the source of infection. Which substances can serve as chemoattractants for neutrophils?",
    setup: "",
    ans: [
      { t: "Bacterial products, tissue breakdown products, and complement fragments such as C5a", ok: true },
      { t: "Erythropoietin, thrombopoietin, and transferrin redirecting phagocytes to infection", ok: false },
      { t: "Only antibodies, which directly attract neutrophils after binding bacterial surfaces", ok: false },
      { t: "Oxygen and glucose gradients drawing neutrophils to areas of high metabolic demand", ok: false },
    ],
    rationale: "Chemotaxis is driven by a concentration gradient of chemoattractant substances. Key chemotactic factors include: bacterial products (formyl-methionyl peptides such as fMLP), complement fragments (C5a is the most potent), interleukin-8 (IL-8/CXCL8), leukotriene B4 (LTB4), and tissue degradation products released from damaged cells. Neutrophils detect these signals through G protein coupled receptors and migrate directionally up the concentration gradient using ameboid motion. Antibodies enhance phagocytosis through opsonization but do not directly serve as chemoattractants. For the CRNA, understanding chemotaxis explains why complement activation during cardiopulmonary bypass recruits neutrophils to the lungs, contributing to post-bypass pulmonary dysfunction. Guyton Ch. 34.", // source: Ch 34 slide 11
    scene: "hematology",
    sceneCfg: { label: "CHEMOTACTIC SUBSTANCES" },
    metadata: { topic: "Neutrophil Recruitment and Migration", priority: "medium" },
  },

  // --- Phagocytosis and Bacterial Killing (4) ---

  {
    id: "pp2-w2s-033",
    type: "mcq",
    prompt: "Opsonization enhances phagocytosis by:",
    setup: "",
    ans: [
      { t: "Coating the pathogen with antibody or C3b that phagocyte receptors grip for engulfment", ok: true },
      { t: "Directly lysing the bacterial membrane by inserting perforin pores, like cytotoxic cells", ok: false },
      { t: "Neutralizing bacterial toxins so they cannot harm the phagocyte during ingestion", ok: false },
      { t: "Triggering the bacterium to undergo programmed cell death before it is even engulfed", ok: false },
    ],
    rationale: "Opsonization is the process of coating a pathogen with molecules (opsonins) that mark it for phagocytosis. The two major opsonins are IgG antibodies (recognized by Fc receptors on phagocytes) and complement component C3b (recognized by complement receptors CR1 and CR3). Unopsonized bacteria with smooth capsules can evade phagocytosis because the phagocyte cannot grip the surface. Encapsulated bacteria (S. pneumoniae, H. influenzae, N. meningitidis) are particularly dependent on opsonization for clearance. For the CRNA, patients with hypogammaglobulinemia, complement deficiencies, or asplenia have impaired opsonization and are at significantly increased risk for invasive infections with encapsulated organisms. Guyton Ch. 34.", // source: Ch 34 slide 13
    scene: "hematology",
    sceneCfg: { label: "OPSONIZATION — C3b AND IgG" },
    metadata: { topic: "Phagocytosis and Bacterial Killing", priority: "high" },
  },

  {
    id: "pp2-w2s-034",
    type: "mcq",
    prompt: "After a neutrophil engulfs a bacterium, the intracellular killing process involves formation of a phagolysosome. Which sequence correctly describes this process?",
    setup: "",
    ans: [
      { t: "Pseudopods engulf it into a phagosome that fuses with lysosomes to digest and kill it", ok: true },
      { t: "The bacterium is drawn into the nucleus, where nuclear enzymes degrade the pathogen", ok: false },
      { t: "The phagocyte dumps granule contents outside to kill bacteria without internalizing them", ok: false },
      { t: "The bacterium is sealed in a lipid droplet from smooth ER and stored in the cell forever", ok: false },
    ],
    rationale: "Phagocytosis follows a defined intracellular pathway. The phagocyte recognizes the bacterium (aided by opsonization), extends pseudopods to engulf it, and internalizes it within a membrane-bound vesicle called the phagosome. Cytoplasmic lysosomes and specific granules then fuse with the phagosome to form the phagolysosome, creating a microenvironment rich in hydrolytic enzymes, defensins, and reactive oxygen species. After digestion, residual debris is expelled by exocytosis. Neutrophils typically die after ingesting 5 to 20 bacteria, while macrophages can ingest much larger numbers and survive. For the CRNA, understanding this process explains why pus (dead neutrophils and digested bacteria) accumulates at infection sites and why abscess drainage is essential for surgical source control. Guyton Ch. 34.", // source: Ch 34 slide 14
    scene: "hematology",
    sceneCfg: { label: "PHAGOLYSOSOME FORMATION" },
    metadata: { topic: "Phagocytosis and Bacterial Killing", priority: "high" },
  },

  {
    id: "pp2-w2s-035",
    type: "mcq",
    prompt: "Compared to neutrophils, tissue macrophages are substantially more powerful phagocytes. A single activated macrophage can ingest:",
    setup: "",
    ans: [
      { t: "Up to about 100 bacteria, plus larger particles like damaged RBCs and malarial parasites", ok: true },
      { t: "Only 3 to 5 bacteria before the macrophage is killed by accumulated bacterial toxins", ok: false },
      { t: "Only particles under 1 micrometer, since the phagosome cannot expand for larger targets", ok: false },
      { t: "An unlimited number, since macrophages are immortal and regenerate their lysosomal enzymes", ok: false },
    ],
    rationale: "Tissue macrophages are far more effective phagocytes than neutrophils. A single macrophage can ingest up to approximately 100 bacteria (compared to 5 to 20 for a neutrophil). Macrophages can also engulf much larger particles including senescent or damaged RBCs, malarial parasites, and even tumor cells. After digesting their contents, macrophages can extrude the waste products and continue functioning for many more months. This ability to survive and continue phagocytosing makes macrophages the dominant phagocyte in chronic infections and granulomatous diseases. For the CRNA, splenic macrophages clear damaged and parasitized RBCs, which is why splenectomized patients are vulnerable to severe malaria and Howell-Jolly body accumulation. Guyton Ch. 34.", // source: Ch 34 slide 15
    scene: "hematology",
    sceneCfg: { label: "MACROPHAGE CAPACITY — 100 BACTERIA" },
    metadata: { topic: "Phagocytosis and Bacterial Killing", priority: "medium" },
  },

  {
    id: "pp2-w2s-036",
    type: "mcq",
    prompt: "Macrophage lysosomes contain lipases that are particularly important for killing which pathogen?",
    setup: "",
    ans: [
      { t: "Mycobacterium tuberculosis, whose waxy mycolic acid wall resists ordinary proteases", ok: true },
      { t: "Escherichia coli, a gram negative rod whose thin wall is easily digested by proteases", ok: false },
      { t: "Influenza virus, whose lipid envelope is dissolved by lipases to expose its viral RNA", ok: false },
      { t: "Staphylococcus aureus, whose coagulase enzyme is specifically neutralized by lipases", ok: false },
    ],
    rationale: "Mycobacterium tuberculosis has a unique cell wall rich in mycolic acids (long chain fatty acids) that makes it highly resistant to conventional proteolytic enzyme degradation within the phagolysosome. Macrophage lipases are critical for hydrolyzing these lipid-rich cell wall components. Despite this, M. tuberculosis has evolved mechanisms to survive within macrophages by inhibiting phagolysosome fusion, which is why TB is characterized by granuloma formation (macrophages walling off bacteria they cannot kill). For the CRNA, active or latent TB is an important consideration in immunocompromised surgical patients, and positive pressure ventilation can aerosolize TB during airway management. Guyton Ch. 34.", // source: Ch 34 slide 16
    scene: "hematology",
    sceneCfg: { label: "MACROPHAGE LIPASES — TB KILLING" },
    metadata: { topic: "Phagocytosis and Bacterial Killing", priority: "medium" },
  },

  {
    id: "pp2-w2s-037",
    type: "mcq",
    prompt: "During the respiratory burst, phagocyte enzymes generate strongly bactericidal reactive oxygen species (ROS). Which combination correctly identifies these species?",
    setup: "",
    ans: [
      { t: "Superoxide anion, hydrogen peroxide, and hydroxyl radicals from NADPH oxidase systems", ok: true },
      { t: "Carbon monoxide, methane, and ammonia; these metabolic gases poison the trapped bacteria", ok: false },
      { t: "Nitric oxide, prostacyclin, and thromboxane A2 as the main bactericidal mediators here", ok: false },
      { t: "Bicarbonate, carbonic acid, and dissolved CO2, which create a lethal acid-base pH shift", ok: false },
    ],
    rationale: "The respiratory burst is the rapid increase in oxygen consumption that occurs when phagocytes activate the NADPH oxidase enzyme complex. This enzyme reduces molecular O2 to superoxide anion (O2 minus), which is then converted to hydrogen peroxide (H2O2) by superoxide dismutase, and further to hypochlorous acid (HOCl) by myeloperoxidase. Hydroxyl radicals (OH minus) are also generated. These reactive oxygen species are highly toxic to bacteria within the phagolysosome. Chronic granulomatous disease (CGD), caused by NADPH oxidase deficiency, results in inability to generate the respiratory burst and severe recurrent infections. For the CRNA, CGD patients require aggressive perioperative infection prophylaxis and strict aseptic technique. Guyton Ch. 34.", // source: Ch 34 slide 17
    scene: "hematology",
    sceneCfg: { label: "RESPIRATORY BURST — ROS" },
    metadata: { topic: "Phagocytosis and Bacterial Killing", priority: "high" },
  },

  // --- Monocyte Macrophage System (3) ---

  {
    id: "pp2-w2s-038",
    type: "mcq",
    prompt: "The reticuloendothelial system (also called the mononuclear phagocyte system) is composed of:",
    setup: "",
    ans: [
      { t: "Monocytes, mobile and fixed tissue macrophages, and some specialized endothelial cells", ok: true },
      { t: "Neutrophils and eosinophils only, treated as the sole phagocytic cells in the body", ok: false },
      { t: "T and B lymphocytes, forming the reticuloendothelial cell network across all tissues", ok: false },
      { t: "Red blood cells and platelets, forming a reticular meshwork lining vessel endothelium", ok: false },
    ],
    rationale: "The reticuloendothelial system (RES), also known as the mononuclear phagocyte system, is a network of phagocytic cells located throughout the body. It includes circulating monocytes, mobile tissue macrophages, and fixed tissue macrophages that have taken up long-term residence in specific organs. After entering the tissues, monocytes enlarge 5 fold and develop extensive lysosomal content, becoming highly efficient macrophages. When appropriately stimulated, fixed macrophages can break away from their tissue attachments and become mobile, migrating to sites of inflammation. This system provides a distributed phagocytic network present in virtually all tissues. For the CRNA, the RES clears bacteria, cellular debris, and drug carrying lipid emulsions from the circulation. Guyton Ch. 34.", // source: Ch 34 slide 18
    scene: "hematology",
    sceneCfg: { label: "RETICULOENDOTHELIAL SYSTEM" },
    metadata: { topic: "Monocyte Macrophage System", priority: "medium" },
  },

  {
    id: "pp2-w2s-039",
    type: "mcq",
    prompt: "Kupffer cells are tissue resident macrophages located in the:",
    setup: "",
    ans: [
      { t: "Hepatic sinusoids, where they survey blood arriving from the portal circulation", ok: true },
      { t: "Alveolar spaces of the lungs, where they digest inhaled particles and microorganisms", ok: false },
      { t: "Subcutaneous tissue of the skin, where they are instead known as the histiocytes", ok: false },
      { t: "Germinal centers of lymph nodes, where they present antigen to naive lymphocytes", ok: false },
    ],
    rationale: "Kupffer cells are the largest population of tissue resident macrophages in the body. They line the hepatic sinusoids and filter portal venous blood draining from the GI tract, removing bacteria, endotoxin, and particulate matter that have crossed the intestinal barrier. This function is critical because the GI tract is a constant source of bacterial translocation. Kupffer cells also clear senescent RBCs, immune complexes, and drug metabolites. Other specialized macrophage populations include alveolar macrophages (lungs), histiocytes (skin and connective tissue), osteoclasts (bone), microglia (CNS), and mesangial cells (kidney). For the CRNA, liver disease impairs Kupffer cell function, increasing susceptibility to portal bacteremia and sepsis. Guyton Ch. 34.", // source: Ch 34 slide 19
    scene: "hematology",
    sceneCfg: { label: "KUPFFER CELLS — LIVER SINUSOIDS" },
    metadata: { topic: "Monocyte Macrophage System", priority: "high" },
  },

  {
    id: "pp2-w2s-040",
    type: "mcq",
    prompt: "Alveolar macrophages patrol the surface of the pulmonary alveoli. Their primary function is to:",
    setup: "",
    ans: [
      { t: "Digest or trap inhaled particles and pathogens before they cross the alveolar wall", ok: true },
      { t: "Produce pulmonary surfactant to lower alveolar surface tension and prevent atelectasis", ok: false },
      { t: "Aid gas exchange by carrying O2 from the alveolar space into pulmonary capillary blood", ok: false },
      { t: "Secrete mucus that traps particles on the airway surface for mucociliary clearance", ok: false },
    ],
    rationale: "Alveolar macrophages (also called dust cells) reside on the alveolar surface and within the alveolar fluid. They provide the primary cellular defense against inhaled pathogens and particles that reach the distal airways. By phagocytosing bacteria, fungi, and particulate matter, they prevent pulmonary infection and maintain alveolar sterility. Surfactant is produced by type II alveolar pneumocytes, not macrophages. Gas exchange occurs passively across the thin type I alveolar epithelium. Mucus is secreted by goblet cells and submucosal glands in the conducting airways. For the CRNA, endotracheal intubation bypasses upper airway defenses, making alveolar macrophages the last line of defense against aspirated material during general anesthesia. Guyton Ch. 34.", // source: Ch 34 slide 19
    scene: "hematology",
    sceneCfg: { label: "ALVEOLAR MACROPHAGES" },
    metadata: { topic: "Monocyte Macrophage System", priority: "medium" },
  },

  /* ================================================================
     Ch. 35 — Resistance to Infection: II. Immunity and Allergy
     (20 MCQs)
     ================================================================ */

  // --- Innate vs Acquired Immunity (2) ---

  {
    id: "pp2-w2s-041",
    type: "mcq",
    prompt: "Innate immunity provides nonspecific resistance to infection. Which of the following is NOT a component of innate immunity?",
    setup: "",
    ans: [
      { t: "Antigen specific antibody production; this is a function of the adaptive immune system", ok: true },
      { t: "Physical barriers such as the skin and the mucosal surfaces lining body cavities", ok: false },
      { t: "Gastric acid, which creates a hostile environment for many ingested pathogens", ok: false },
      { t: "Complement proteins that opsonize pathogens and build the membrane attack complex", ok: false },
    ],
    rationale: "Innate immunity includes all defense mechanisms that do not require prior exposure to a specific pathogen and do not improve with repeated encounters. Components include: physical barriers (skin, mucous membranes), chemical barriers (gastric acid, lysozyme in tears), cellular defenses (neutrophils, macrophages, natural killer cells), and humoral factors (complement proteins, acute phase reactants). Antigen specific antibody production is the hallmark of adaptive (acquired) humoral immunity mediated by B lymphocytes differentiating into plasma cells. For the CRNA, innate immunity provides the immediate defense during the perioperative period, while adaptive responses take days to weeks to develop after antigen exposure. Guyton Ch. 35.", // source: Ch 35 slide 2
    scene: "hematology",
    sceneCfg: { label: "INNATE IMMUNITY COMPONENTS" },
    metadata: { topic: "Innate vs Acquired Immunity", priority: "high" },
  },

  {
    id: "pp2-w2s-042",
    type: "mcq",
    prompt: "Acquired (adaptive) immunity can be divided into two major arms. Which statement correctly describes them?",
    setup: "",
    ans: [
      { t: "Humoral uses B cell antibodies in fluids; cell mediated uses T cells to kill infected cells", ok: true },
      { t: "Humoral is mediated by neutrophils; cell mediated is mediated by antigen presenting macrophages", ok: false },
      { t: "Both arms are mediated only by B lymphocytes; T cells play no role in acquired immunity", ok: false },
      { t: "Humoral is mediated by the complement system; cell mediated is mediated by natural killer cells", ok: false },
    ],
    rationale: "Acquired immunity has two arms that work together. Humoral immunity is mediated by B lymphocytes that differentiate into antibody secreting plasma cells. Circulating antibodies neutralize toxins, opsonize pathogens, activate complement, and prevent viral attachment. Cell mediated immunity is mediated by T lymphocytes: CD4+ helper T cells coordinate the immune response through cytokine secretion, while CD8+ cytotoxic T cells directly kill virus infected cells and tumor cells via perforin and granzyme release. Complement and NK cells are components of innate, not adaptive, immunity. For the CRNA, understanding both arms is important for managing patients with specific immune deficiencies (hypogammaglobulinemia versus T cell depletion). Guyton Ch. 35.", // source: Ch 35 slide 3
    scene: "hematology",
    sceneCfg: { label: "HUMORAL vs CELL MEDIATED" },
    metadata: { topic: "Innate vs Acquired Immunity", priority: "high" },
  },

  // --- Antigen and Epitope Recognition (2) ---

  {
    id: "pp2-w2s-043",
    type: "mcq",
    prompt: "An antigen is best defined as:",
    setup: "",
    ans: [
      { t: "Any substance that can elicit a specific immune response, usually a protein or polysaccharide", ok: true },
      { t: "Any white blood cell that fights infection, including neutrophils, monocytes, and lymphocytes", ok: false },
      { t: "An antibody molecule made by plasma cells that circulates in blood to neutralize pathogens", ok: false },
      { t: "A complement protein that opsonizes bacteria for later phagocytosis by tissue macrophages", ok: false },
    ],
    rationale: "An antigen (antibody generator) is any substance that can be specifically recognized by the adaptive immune system and provoke an immune response. Most antigens are proteins or large polysaccharides (molecular weight greater than approximately 10,000 daltons) with repeating molecular surface structures. Small molecules (haptens) can become antigenic when coupled to a larger carrier protein. Antigens are unique to each organism, which is the basis of immune specificity. For the CRNA, common perioperative antigens include drug-protein conjugates (beta-lactam antibiotics binding to serum proteins to form immunogenic complexes), latex proteins, and blood group antigens on transfused RBCs. Guyton Ch. 35.", // source: Ch 35 slide 4
    scene: "hematology",
    sceneCfg: { label: "ANTIGEN DEFINITION" },
    metadata: { topic: "Antigen and Epitope Recognition", priority: "high" },
  },

  {
    id: "pp2-w2s-044",
    type: "mcq",
    prompt: "The specific molecular structures on an antigen that are recognized by B cell and T cell receptors are called:",
    setup: "",
    ans: [
      { t: "Epitopes; each lymphocyte clone reads one, and an antigen may carry several different ones", ok: true },
      { t: "Opsonins; these are the molecular tags that mark pathogens for phagocytic destruction", ok: false },
      { t: "Cytokines; these signaling molecules are released by immune cells to coordinate the response", ok: false },
      { t: "Haptens; small molecules that directly stimulate lymphocyte receptors with no carrier needed", ok: false },
    ],
    rationale: "Epitopes are the specific three dimensional molecular structures on the surface of an antigen that are recognized by the complementary antigen binding sites on antibodies (B cell receptors) or T cell receptors. A single antigen molecule typically has multiple different epitopes, each of which may be recognized by a different lymphocyte clone. This means a single pathogen can stimulate many different lymphocyte clones simultaneously (polyclonal response). Opsonins are molecules that coat pathogens for phagocytosis. Cytokines are signaling proteins. Haptens are small molecules that are immunogenic only when conjugated to carrier proteins. For the CRNA, epitope mapping is used to design targeted immunotherapies and to understand cross-reactivity between different neuromuscular blocking agents. Guyton Ch. 35.", // source: Ch 35 slide 4
    scene: "hematology",
    sceneCfg: { label: "EPITOPES — ANTIGENIC DETERMINANTS" },
    metadata: { topic: "Antigen and Epitope Recognition", priority: "medium" },
  },

  // --- Lymphocyte Development and Maturation (4) ---

  {
    id: "pp2-w2s-045",
    type: "mcq",
    prompt: "T lymphocytes undergo maturation and selection in which organ?",
    setup: "",
    ans: [
      { t: "The thymus; marrow precursors gain antigen specificity and are selected for self tolerance", ok: true },
      { t: "The spleen; T cells mature within the red pulp, exposed there to blood borne antigens", ok: false },
      { t: "The bone marrow only; T cells finish their entire development without leaving that organ", ok: false },
      { t: "The liver; hepatic sinusoidal endothelial cells supply the niche for T cell maturation", ok: false },
    ],
    rationale: "The thymus is the primary lymphoid organ for T cell maturation. Bone marrow derived T cell precursors migrate to the thymus, where they undergo rapid proliferation and develop unique T cell receptors (TCRs) through gene rearrangement. Each T cell clone becomes specific for a single epitope. The thymus also performs selection: positive selection ensures T cells can recognize self MHC molecules, while negative selection (clonal deletion) eliminates T cells that react strongly to self-antigens. Most of this process occurs just before and shortly after birth, which is why neonatal thymectomy has profound effects on T cell immunity. For the CRNA, thymectomy during cardiac surgery in neonates can impair T cell development. Guyton Ch. 35.", // source: Ch 35 slide 7
    scene: "hematology",
    sceneCfg: { label: "T CELL MATURATION — THYMUS" },
    metadata: { topic: "Lymphocyte Development and Maturation", priority: "high" },
  },

  {
    id: "pp2-w2s-046",
    type: "mcq",
    prompt: "During T cell maturation in the thymus, self-reactive T cell clones that would attack the body's own tissues are eliminated through a process called:",
    setup: "",
    ans: [
      { t: "Clonal deletion; strongly self reactive T cells undergo apoptosis, giving central tolerance", ok: true },
      { t: "Clonal expansion; self reactive clones are forced to proliferate until they exhaust and die", ok: false },
      { t: "Opsonization; self reactive T cells are coated with complement and eaten by thymic macrophages", ok: false },
      { t: "Somatic hypermutation; the TCR genes are mutated at random until self reactivity is removed", ok: false },
    ],
    rationale: "Clonal deletion is the negative selection process that eliminates developing T cells whose T cell receptors (TCRs) bind with high affinity to self-antigens (self-peptide-MHC complexes) presented by medullary thymic epithelial cells and dendritic cells. These self-reactive cells are induced to undergo apoptosis. This process eliminates approximately 95% of developing thymocytes and is essential for establishing central tolerance (preventing autoimmunity). Failure of clonal deletion can lead to autoimmune diseases (type 1 diabetes, systemic lupus erythematosus). For the CRNA, patients with autoimmune diseases often require chronic immunosuppression that must be managed perioperatively, and may need stress-dose steroids. Guyton Ch. 35.", // source: Ch 35 slide 7
    scene: "hematology",
    sceneCfg: { label: "CLONAL DELETION — SELF-TOLERANCE" },
    metadata: { topic: "Lymphocyte Development and Maturation", priority: "high" },
  },

  {
    id: "pp2-w2s-047",
    type: "mcq",
    prompt: "B lymphocytes undergo initial growth and differentiation in the:",
    setup: "",
    ans: [
      { t: "Fetal liver before birth, then mainly bone marrow; they later seed lymphoid organs", ok: true },
      { t: "Thymus, the same organ where T cells mature; both lineages finish there in the thymus", ok: false },
      { t: "Spleen only; B cells are made and mature entirely in the white pulp from fetal life on", ok: false },
      { t: "Peyer's patches of the gut, since the intestinal wall has the greatest antigen exposure", ok: false },
    ],
    rationale: "B cell development begins in the fetal liver during embryonic life and transitions to the bone marrow after birth, where it continues throughout life. In the bone marrow, B cell precursors undergo immunoglobulin gene rearrangement to generate a unique B cell receptor (surface IgM) on each clone. Self-reactive B cells are eliminated or rendered anergic. Mature naive B cells then migrate to peripheral lymphoid organs (spleen, lymph nodes, Peyer's patches) where they reside until they encounter their specific antigen. Upon antigen binding and T cell help, B cells undergo clonal expansion and differentiate into antibody-secreting plasma cells. For the CRNA, conditions affecting the bone marrow (aplastic anemia, myeloma) impair B cell production and antibody-mediated defense. Guyton Ch. 35.", // source: Ch 35 slide 8
    scene: "hematology",
    sceneCfg: { label: "B CELL DEVELOPMENT SITES" },
    metadata: { topic: "Lymphocyte Development and Maturation", priority: "medium" },
  },

  {
    id: "pp2-w2s-048",
    type: "mcq",
    prompt: "Each B cell clone is specific for a single antigen. The mechanism that generates this enormous antibody diversity is:",
    setup: "",
    ans: [
      { t: "Combinatorial V, D, and J gene rearrangement, yielding millions of unique specificities", ok: true },
      { t: "Random point mutations spread across the whole B cell genome, altering every gene at once", ok: false },
      { t: "Direct swapping of receptor proteins between neighboring B cells through marrow gap junctions", ok: false },
      { t: "A fixed library of exactly 1,000 preassembled antibody genes, each a different specificity", ok: false },
    ],
    rationale: "Antibody diversity is generated primarily through V(D)J recombination. The immunoglobulin heavy chain locus contains approximately 65 V segments, 27 D segments, and 6 J segments, while the light chain loci contain multiple V and J segments. Random selection and joining of these segments, combined with junctional diversity (imprecise joining and N-nucleotide addition), generates an estimated 10^11 or more unique antibody specificities from a finite number of gene segments. Additional diversity comes from somatic hypermutation during the germinal center reaction. For the CRNA, this vast repertoire enables the immune system to recognize virtually any foreign molecule, including novel drug-protein conjugates encountered during anesthesia. Guyton Ch. 35.", // source: Ch 35 slide 10
    scene: "hematology",
    sceneCfg: { label: "V(D)J RECOMBINATION — ANTIBODY DIVERSITY" },
    metadata: { topic: "Lymphocyte Development and Maturation", priority: "medium" },
  },

  // --- Lymphocyte Activation (2) ---

  {
    id: "pp2-w2s-049",
    type: "mcq",
    prompt: "In lymphoid organs, macrophages serve as antigen-presenting cells that initiate the adaptive immune response. They do this by:",
    setup: "",
    ans: [
      { t: "Displaying processed peptide on MHC class II to CD4 T cells while secreting growth cytokines", ok: true },
      { t: "Inserting pathogen DNA directly into lymphocyte nuclei to reprogram their antigen specificity", ok: false },
      { t: "Releasing intact pathogens into lymphoid tissue so lymphocytes recognize them unprocessed", ok: false },
      { t: "Carrying live bacteria to the bone marrow so B cell precursors can be educated against them", ok: false },
    ],
    rationale: "Antigen presentation is the critical bridge between innate and adaptive immunity. Macrophages (and dendritic cells) phagocytose pathogens, degrade them into peptide fragments, and display these fragments on MHC class II molecules on their cell surface. CD4+ helper T cells recognize the peptide-MHC II complex through their T cell receptors. Simultaneously, the antigen-presenting cell secretes costimulatory cytokines (IL-1, IL-6, TNF-alpha) that promote T cell activation and proliferation. This two-signal requirement (antigen presentation plus costimulation) prevents inappropriate immune activation. For the CRNA, understanding antigen presentation explains how blood transfusions can sensitize patients to donor antigens and why typing and crossmatching are essential. Guyton Ch. 35.", // source: Ch 35 slide 11
    scene: "hematology",
    sceneCfg: { label: "ANTIGEN PRESENTATION — MHC II" },
    metadata: { topic: "Lymphocyte Activation", priority: "high" },
  },

  {
    id: "pp2-w2s-050",
    type: "mcq",
    prompt: "For clonal expansion and immune activation to occur, lymphocytes must receive a specific signal. Which statement is correct?",
    setup: "",
    ans: [
      { t: "Both B and T cells need antigen to proliferate; without it they stay quiescent in lymph organs", ok: true },
      { t: "Lymphocytes proliferate at a constant rate regardless of antigen, keeping effector cells ready", ok: false },
      { t: "Only T cells need antigen; B cells proliferate constitutively and make all antibody classes", ok: false },
      { t: "Lymphocytes are driven only by macrophage cytokines; direct antigen recognition is not required", ok: false },
    ],
    rationale: "The clonal selection theory states that each lymphocyte bears receptors for a single antigen. Lymphocytes remain quiescent (in G0 phase) until they encounter their specific antigen. B cells recognize intact antigens through surface immunoglobulin, while T cells recognize processed peptide-MHC complexes. Upon activation, lymphocytes undergo clonal expansion, producing large numbers of effector cells (plasma cells from B cells; effector T cells from T cells) and long-lived memory cells. This antigen-driven proliferation ensures that immune responses are targeted and proportionate. For the CRNA, immunosuppressive drugs (calcineurin inhibitors, anti-proliferatives) block this activation/proliferation pathway, preventing transplant rejection but also impairing pathogen defense. Guyton Ch. 35.", // source: Ch 35 slide 11
    scene: "hematology",
    sceneCfg: { label: "ANTIGENIC STIMULATION REQUIRED" },
    metadata: { topic: "Lymphocyte Activation", priority: "medium" },
  },

  // --- Antibody Production (2) ---

  {
    id: "pp2-w2s-051",
    type: "mcq",
    prompt: "When a B cell encounters its specific antigen and receives T cell help, it proliferates and differentiates into antibody-secreting plasma cells. What is the approximate scale of this clonal response?",
    setup: "",
    ans: [
      { t: "Up to 500 progeny in 4 days, each plasma cell secreting about 2,000 antibodies per second", ok: true },
      { t: "About 5 to 10 progeny over several weeks, each secreting 1 to 2 antibody molecules per hour", ok: false },
      { t: "Over 1 million progeny within 24 hours, overwhelming the pathogen at the first encounter", ok: false },
      { t: "Antibody production does not begin until at least 30 days after the initial antigen exposure", ok: false },
    ],
    rationale: "B cell clonal expansion is remarkably efficient. Upon activation by antigen binding and costimulatory signals from helper T cells, B cells proliferate to generate lymphoblasts and plasmablasts that differentiate into mature plasma cells. Each activated B cell clone can produce up to 500 progeny within 4 days. Each plasma cell is an antibody factory, capable of secreting approximately 2,000 immunoglobulin molecules per second. Plasma cells can persist for many weeks if antigenic stimulation continues. This massive amplification is what allows the adaptive immune system to mount an effective defense against an initial infection. For the CRNA, this 4-day lag to significant antibody production explains why passive immunization (immunoglobulin administration) is used for immediate post-exposure prophylaxis. Guyton Ch. 35.", // source: Ch 35 slide 12
    scene: "hematology",
    sceneCfg: { label: "PLASMA CELL OUTPUT — 2,000 Ig/SEC" },
    metadata: { topic: "Antibody Production", priority: "high" },
  },

  {
    id: "pp2-w2s-052",
    type: "mcq",
    prompt: "The secondary (anamnestic) immune response differs from the primary response in several important ways. Which characteristic correctly describes the secondary response?",
    setup: "",
    ans: [
      { t: "Faster, higher titer, longer lasting, higher affinity, from preexisting memory cells", ok: true },
      { t: "Identical in timing and size to the primary, since each antigen encounter is independent", ok: false },
      { t: "Produces fewer antibodies than the primary, since many cells were used in the first encounter", ok: false },
      { t: "Occurs only at the exact prior antigen dose; a different dose cannot trigger any memory cells", ok: false },
    ],
    rationale: "The secondary immune response is a hallmark of adaptive immunity. During the primary response, antigen-specific memory B and T cells are generated alongside effector cells. These memory cells persist for years and respond much more rapidly upon re-exposure to the same antigen. The secondary response begins within 1 to 2 days (versus 5 to 14 days for the primary), achieves antibody titers 10 to 100 times higher, and produces antibodies with greater affinity for the antigen (due to affinity maturation in germinal centers during the primary response). For the CRNA, the secondary response explains why a second exposure to a drug allergen (e.g., a neuromuscular blocking agent) can produce a much more severe anaphylactic reaction than the initial sensitizing exposure. Guyton Ch. 35.", // source: Ch 35 slide 13
    scene: "hematology",
    sceneCfg: { label: "SECONDARY IMMUNE RESPONSE" },
    metadata: { topic: "Antibody Production", priority: "high" },
  },

  // --- Immunoglobulin Structure (3) ---

  {
    id: "pp2-w2s-053",
    type: "mcq",
    prompt: "The basic structural unit of an immunoglobulin (antibody) molecule consists of:",
    setup: "",
    ans: [
      { t: "Two heavy and two light chains in a Y shape, joined by disulfide bonds with a hinge", ok: true },
      { t: "A single polypeptide chain folded into a globular shape with one antigen binding site", ok: false },
      { t: "Four identical heavy chains in a ring, with antigen binding sites placed at each end", ok: false },
      { t: "Two heavy chains only; light chains appear solely in the IgM and IgE isotypes", ok: false },
    ],
    rationale: "All immunoglobulin classes share the same basic monomeric structure: two identical heavy chains and two identical light chains (either kappa or lambda) joined by disulfide bonds. The molecule has a characteristic Y shape. The hinge region provides flexibility, allowing the two antigen-binding arms (Fab fragments) to bind epitopes at varying distances apart. The stem (Fc fragment, formed by the constant regions of the heavy chains) determines the antibody class and mediates effector functions such as complement activation, placental transfer, and binding to Fc receptors on phagocytes. For the CRNA, the Fc region is clinically relevant because IgE Fc binds to mast cell FcepsilonRI receptors, and it is this binding that primes mast cells for degranulation upon allergen re-exposure. Guyton Ch. 35.", // source: Ch 35 slide 14
    scene: "hematology",
    sceneCfg: { label: "IMMUNOGLOBULIN STRUCTURE — Y SHAPE" },
    metadata: { topic: "Immunoglobulin Structure", priority: "high" },
  },

  {
    id: "pp2-w2s-054",
    type: "mcq",
    prompt: "Each antibody molecule has a variable portion and a constant portion. The variable portion:",
    setup: "",
    ans: [
      { t: "Forms the antigen binding site and differs by clone; both chains shape its specificity", ok: true },
      { t: "Sets the immunoglobulin class and drives effector functions like complement activation", ok: false },
      { t: "Is identical across all antibodies regardless of specificity, giving the molecule stability", ok: false },
      { t: "Lies only on the light chains; heavy chains contribute constant region sequences alone", ok: false },
    ],
    rationale: "The variable region occupies the amino-terminal portion of both heavy and light chains and forms the antigen-binding site (paratope). The enormous diversity of variable region sequences (generated by V(D)J recombination and somatic hypermutation) is what gives each antibody its unique specificity. Within the variable region, three hypervariable loops (complementarity-determining regions, CDRs) make direct contact with the epitope. The constant region of the heavy chain determines the immunoglobulin class (isotype) and mediates biological effector functions. For the CRNA, monoclonal antibody therapeutics (sugammadex, a modified gamma-cyclodextrin, works differently but biologics like rituximab use this variable region targeting principle) exploit specific variable region binding to target molecules. Guyton Ch. 35.", // source: Ch 35 slide 14
    scene: "hematology",
    sceneCfg: { label: "VARIABLE REGION — ANTIGEN SPECIFICITY" },
    metadata: { topic: "Immunoglobulin Structure", priority: "medium" },
  },

  {
    id: "pp2-w2s-055",
    type: "mcq",
    prompt: "Antibodies are described as bivalent. This means:",
    setup: "",
    ans: [
      { t: "It has at least two binding sites, so one antibody can cross link two identical epitopes", ok: true },
      { t: "Antibodies work only when two different immunoglobulin classes cooperate together at once", ok: false },
      { t: "Each antibody can bind two entirely different antigens at the same time at distinct sites", ok: false },
      { t: "Antibodies need two different receptors on the phagocyte before they trigger internalization", ok: false },
    ],
    rationale: "Bivalency means each antibody monomer has two identical antigen-binding sites (one on each Fab arm of the Y). This allows a single antibody to bind two identical epitopes simultaneously. When multiple antibodies bind to particles bearing repeated epitopes, they cross-link them into large aggregates (agglutination for cells, precipitation for soluble antigens). IgM, as a pentamer, has 10 antigen-binding sites (decavalent), making it particularly effective at agglutination. Antibody bivalency also permits immune complex formation, which activates complement and is cleared by the reticuloendothelial system. For the CRNA, antibody mediated cross-linking is the mechanism behind blood group agglutination reactions during incompatible transfusions. Guyton Ch. 35.", // source: Ch 35 slide 15
    scene: "hematology",
    sceneCfg: { label: "ANTIBODY BIVALENCY" },
    metadata: { topic: "Immunoglobulin Structure", priority: "medium" },
  },

  // --- Immunoglobulin Classes (3) ---

  {
    id: "pp2-w2s-056",
    type: "mcq",
    prompt: "IgM is the first immunoglobulin class produced during a primary immune response. Which structural feature makes IgM especially effective at agglutinating pathogens?",
    setup: "",
    ans: [
      { t: "IgM is a pentamer with 10 binding sites, the best at agglutination and complement activation", ok: true },
      { t: "IgM is a monomer with one huge binding site that fits several epitopes at the same time", ok: false },
      { t: "IgM circulates as a dimer linked by secretory component, just like secretory IgA in mucosa", ok: false },
      { t: "IgM carries 20 binding sites per molecule because each monomer contributes four binding sites", ok: false },
    ],
    rationale: "IgM is the largest immunoglobulin, circulating as a pentamer with a molecular weight of approximately 900 kDa. The five monomers are linked by disulfide bonds and a J (joining) chain. This pentameric structure provides 10 antigen-binding sites (though steric constraints may limit functional valence to approximately 5). IgM is the most efficient complement activator (a single IgM pentamer can activate the classical pathway) and is the most effective agglutinin. It is the first antibody produced in a primary response and the first expressed on developing B cells. IgM does not cross the placenta. For the CRNA, IgM anti-A and anti-B isohemagglutinins cause the most severe acute hemolytic transfusion reactions through complement mediated intravascular hemolysis. Guyton Ch. 35.", // source: Ch 35 slide 17
    scene: "hematology",
    sceneCfg: { label: "IgM PENTAMER — 10 BINDING SITES" },
    metadata: { topic: "Immunoglobulin Classes", priority: "high" },
  },

  {
    id: "pp2-w2s-057",
    type: "mcq",
    prompt: "The five classes of immunoglobulins are IgM, IgG, IgA, IgD, and IgE. Which class is critically involved in allergic reactions?",
    setup: "",
    ans: [
      { t: "IgE; it binds mast cell receptors, and allergen cross linking triggers histamine release", ok: true },
      { t: "IgG, since it is the most abundant antibody and so mediates most reactions including allergy", ok: false },
      { t: "IgA, since it coats all mucosal surfaces, where most allergen exposure actually takes place", ok: false },
      { t: "IgD, since it acts as the main B cell surface receptor for allergens in the respiratory tract", ok: false },
    ],
    rationale: "IgE is the least abundant serum immunoglobulin (present in trace amounts) but plays a central role in type I (immediate) hypersensitivity reactions and anaphylaxis. IgE is produced by plasma cells driven by Th2 cytokines (IL-4, IL-13) and binds with very high affinity to FcepsilonRI receptors on mast cells and basophils. When a multivalent allergen cross-links two or more surface-bound IgE molecules, it triggers degranulation and release of histamine, tryptase, prostaglandins, and leukotrienes. Immunoglobulins constitute approximately 20% of total plasma proteins. For the CRNA, IgE-mediated anaphylaxis to NMBs, antibiotics, and latex is a life-threatening OR emergency requiring immediate epinephrine. Guyton Ch. 35.", // source: Ch 35 slide 16
    scene: "hematology",
    sceneCfg: { label: "IgE — ALLERGIC REACTIONS" },
    metadata: { topic: "Immunoglobulin Classes", priority: "high" },
  },

  {
    id: "pp2-w2s-058",
    type: "mcq",
    prompt: "Immunoglobulins make up approximately what fraction of total plasma proteins?",
    setup: "",
    ans: [
      { t: "About 20% of plasma proteins, with IgG near 75% of immunoglobulins and the most abundant", ok: true },
      { t: "Under 1% of plasma proteins; immunoglobulins are trace next to albumin and clotting factors", ok: false },
      { t: "About 50% of all plasma proteins, shared equally among the five immunoglobulin classes", ok: false },
      { t: "About 80% of plasma proteins, since defense needs very high antibody concentrations", ok: false },
    ],
    rationale: "Immunoglobulins constitute approximately 20% of total plasma proteins (the majority of the gamma-globulin fraction on serum protein electrophoresis). Albumin accounts for approximately 60%. IgG is the dominant class at 75% of total serum immunoglobulins (approximately 1,000 mg/dL), followed by IgA (approximately 200 mg/dL), IgM (approximately 120 mg/dL), IgD (approximately 3 mg/dL), and IgE (approximately 0.05 mg/dL). IgM is the earliest produced during primary responses, while IgG dominates the secondary response. For the CRNA, hypergammaglobulinemia (as in multiple myeloma) or hypogammaglobulinemia (as in common variable immunodeficiency) significantly affects perioperative infection risk and may alter protein binding of anesthetic drugs. Guyton Ch. 35.", // source: Ch 35 slide 16
    scene: "hematology",
    sceneCfg: { label: "IMMUNOGLOBULINS — 20% OF PLASMA PROTEIN" },
    metadata: { topic: "Immunoglobulin Classes", priority: "medium" },
  },

  // --- Antibody Effector Mechanisms (2) ---

  {
    id: "pp2-w2s-059",
    type: "mcq",
    prompt: "Antibodies eliminate pathogens and foreign molecules through several direct mechanisms. Which of the following is a recognized direct mechanism of antibody action?",
    setup: "",
    ans: [
      { t: "Agglutination, in which bivalent antibodies cross link particles into easily cleared clumps", ok: true },
      { t: "Direct bacterial lysis by antibody forming pores in the membrane with no complement involved", ok: false },
      { t: "Inhibition of bacterial DNA replication after the antibody enters the bacterial cytoplasm", ok: false },
      { t: "Conversion of bacterial toxins into nutrients that then support host cell metabolism", ok: false },
    ],
    rationale: "Antibodies act against pathogens through five major mechanisms: (1) agglutination (clumping particulate antigens), (2) precipitation (aggregating soluble antigens), (3) neutralization (blocking toxin active sites or viral attachment sites), (4) lysis (antibody plus complement forming the MAC to lyse cells), and (5) complement activation (IgG/IgM Fc regions bind C1q to initiate the classical pathway). Importantly, antibodies themselves do not form pores; lysis requires complement activation. Agglutination is clinically significant in ABO blood typing, where anti-A or anti-B antibodies agglutinate incompatible RBCs. For the CRNA, understanding these mechanisms is essential for recognizing and managing transfusion reactions and perioperative anaphylaxis. Guyton Ch. 35.", // source: Ch 35 slides 18, 19
    scene: "hematology",
    sceneCfg: { label: "AGGLUTINATION — ANTIBODY MECHANISM" },
    metadata: { topic: "Antibody Effector Mechanisms", priority: "high" },
  },

  {
    id: "pp2-w2s-060",
    type: "mcq",
    prompt: "When an antigen-presenting cell activates a T cell, the subsequent activation cascade follows which pattern?",
    setup: "",
    ans: [
      { t: "CD4 helper T cells activate first and their cytokines expand CD4, CD8, and memory T cells", ok: true },
      { t: "CD8 cytotoxic T cells activate first and then recruit CD4 helpers via perforin signaling", ok: false },
      { t: "All T cell subsets differentiate at once into antibody producing plasma cells with no steps", ok: false },
      { t: "T cells skip antigen presentation and independently detect free antigen in the bloodstream", ok: false },
    ],
    rationale: "T cell activation begins when an antigen-presenting cell (dendritic cell, macrophage, or B cell) presents processed antigen on MHC class II to a CD4+ helper T cell. The activated helper T cell produces cytokines (IL-2, IL-4, IFN-gamma) that have multiple effects: (1) autocrine stimulation of further CD4+ expansion, (2) activation and expansion of CD8+ cytotoxic T cells, (3) activation of B cells for antibody production, and (4) activation of macrophages for enhanced killing. Both CD4+ and CD8+ populations generate clonal memory T cells that persist long-term for rapid secondary responses. T cells do not produce antibodies; that is exclusively a B cell and plasma cell function. For the CRNA, this cascade is the target of immunosuppressive drugs used in transplant patients (calcineurin inhibitors block IL-2 production). Guyton Ch. 35.", // source: Ch 35 slide 20
    scene: "hematology",
    sceneCfg: { label: "T CELL ACTIVATION CASCADE" },
    metadata: { topic: "T Cell Activation Pathway", priority: "high" },
  },

];

export const PP2_WK2_SUPPLEMENT_METADATA = {
  nodeId:         "pp2-wk-2",
  courseId:        "adv-phys-path-2",
  chapter:        "Ch. 33–35",
  title:          "Red Blood Cells / Resistance to Infection I & II — Supplement",
  totalQuestions:  PP2_WK2_SUPPLEMENT_QUESTIONS.length,
  questionTypes:  { mcq: 60 },
};
