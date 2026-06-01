/**
 * BIOL-510-A Adv Phys and Pathophys II, Week 3 SUPPLEMENT
 * Hemostasis and Blood Coagulation (Guyton and Hall 14e, Ch. 37)
 * Sourced from lecture slides; every question cites its source slide.
 * Additional MCQs supplementing the original Ch 37 questions in the node bank.
 */

export const PP2_WK3_SUPPLEMENT_QUESTIONS = [

  /* ================================================================
     Primary hemostasis: constriction, platelets, platelet plug
     ================================================================ */

  {
    id: "pp2-w3s-001",
    type: "mcq",
    prompt: "Hemostasis proceeds through an ordered set of mechanisms after a vessel is cut. Which sequence correctly lists the main steps in the order the body uses them to stop blood loss?",
    setup: "",
    ans: [
      { t: "Vascular constriction, then formation of a platelet plug, then formation of a blood clot, then growth of fibrous tissue that heals the vascular damage", ok: true },
      { t: "Formation of a blood clot, then vascular constriction, then formation of a platelet plug, then immediate fibrinolysis of the clot", ok: false },
      { t: "Formation of a platelet plug, then vascular constriction, then fibrinolysis, then permanent scarring without any clot", ok: false },
      { t: "Activation of plasmin, then vascular dilation, then platelet aggregation, then clot retraction", ok: false },
    ],
    rationale: "Guyton describes four sequential mechanisms of hemostasis. First, vascular constriction reduces flow through the injured vessel within seconds. Second, a platelet plug forms as platelets adhere, activate, and aggregate. Third, a blood clot forms as the coagulation cascade generates fibrin that traps blood cells and platelets. Fourth, over the following days fibrous tissue invades and permanently heals the vessel, sometimes with recanalization that restores flow. For the CRNA, recognizing that constriction and the platelet plug are the immediate primary responses, while fibrin clotting is slower, explains why platelet disorders cause immediate oozing whereas factor deficiencies cause delayed or rebleeding. Guyton Ch. 37.", // source: Ch 37 slide 2
    scene: "hematology",
    sceneCfg: { label: "STEPS OF HEMOSTASIS" },
    metadata: { topic: "Hemostasis Overview", priority: "high" },
  },

  {
    id: "pp2-w3s-002",
    type: "mcq",
    prompt: "After platelets adhere at a site of vascular injury, they change shape and undergo granule release. Which group of mediators is released during degranulation to recruit and activate additional platelets?",
    setup: "",
    ans: [
      { t: "ADP, platelet activating factor (PAF), and thromboxane A2, which recruit and activate nearby platelets and amplify aggregation", ok: true },
      { t: "Prostacyclin, nitric oxide, and tissue plasminogen activator, which together recruit more platelets to the growing plug", ok: false },
      { t: "Antithrombin III, protein C, and thrombomodulin, which are released by platelets to accelerate aggregation", ok: false },
      { t: "Heparin, plasmin, and fibrin degradation products, which are released to strengthen the platelet plug", ok: false },
    ],
    rationale: "Guyton Figure 37-1 shows platelet recruitment, adhesion, activation, and degranulation. After adhering to von Willebrand factor and collagen through the GpIb receptor, platelets change shape and release granule contents including ADP, platelet activating factor (PAF), and thromboxane A2. These mediators recruit and activate additional circulating platelets, driving aggregation and growth of the plug. Prostacyclin and nitric oxide are endothelial products that inhibit platelets, and antithrombin III and protein C are anticoagulants, so those choices describe the opposite of degranulation. For the CRNA, this degranulation step is the target of antiplatelet drugs and explains why platelet function, not just platelet number, governs primary hemostasis. Guyton Ch. 37.", // source: Ch 37 slide 3
    scene: "hematology",
    sceneCfg: { label: "PLATELET DEGRANULATION" },
    metadata: { topic: "Platelet Plug Formation", priority: "high" },
  },

  {
    id: "pp2-w3s-003",
    type: "mcq",
    prompt: "Figure 37-2 illustrates the key events at a severed vessel. Which ordered sequence matches that figure?",
    setup: "",
    ans: [
      { t: "Severed vessel, platelets agglutinate, fibrin appears, fibrin clot forms, clot retraction occurs", ok: true },
      { t: "Severed vessel, fibrin clot forms, platelets agglutinate, clot retraction occurs, fibrin appears", ok: false },
      { t: "Severed vessel, clot retraction occurs, platelets agglutinate, fibrin appears, fibrin clot forms", ok: false },
      { t: "Severed vessel, fibrin appears, clot retraction occurs, platelets agglutinate, fibrin clot forms", ok: false },
    ],
    rationale: "Guyton Figure 37-2 depicts five sequential events. A vessel is severed; platelets agglutinate into the initial plug; fibrin strands then appear as the coagulation cascade activates; a mature fibrin clot forms that traps cells and seals the defect; and finally clot retraction occurs as platelets contract and pull the fibrin meshwork together. The ordering emphasizes that the platelet plug forms before the fibrin clot and that retraction is the final step. For the CRNA, this timeline clarifies why immediate surgical bleeding reflects platelet plug failure while delayed bleeding reflects defective fibrin formation or premature clot breakdown. Guyton Ch. 37.", // source: Ch 37 slide 4
    scene: "hematology",
    sceneCfg: { label: "KEY EVENTS IN HEMOSTASIS" },
    metadata: { topic: "Hemostasis Overview", priority: "medium" },
  },

  {
    id: "pp2-w3s-004",
    type: "mcq",
    prompt: "Immediately after a vessel is cut, its wall constricts to limit blood loss. In the smallest vessels, which platelet-derived mediator is primarily responsible for this local vasoconstriction?",
    setup: "",
    ans: [
      { t: "Thromboxane A2 released by platelets, which constricts the small vessels at the site of injury", ok: true },
      { t: "Nitric oxide released by platelets, which constricts small vessels by relaxing vascular smooth muscle", ok: false },
      { t: "Bradykinin released by platelets, which constricts small vessels through a myogenic reflex", ok: false },
      { t: "Prostacyclin released by platelets, which constricts small vessels while promoting platelet adhesion", ok: false },
    ],
    rationale: "Guyton lists several causes of vascular constriction after injury: myogenic spasm of the vessel wall, local factors released from the traumatized tissues and platelets, and nervous reflexes initiated by pain. In the smaller vessels specifically, thromboxane A2 released by activated platelets is the key local vasoconstrictor. Nitric oxide and prostacyclin actually cause vasodilation and inhibit platelets, so they are distractors. For the CRNA, thromboxane A2 is the product of the platelet cyclooxygenase pathway that aspirin irreversibly blocks, linking this physiology directly to antiplatelet pharmacology and perioperative bleeding risk. Guyton Ch. 37.", // source: Ch 37 slide 5
    scene: "hematology",
    sceneCfg: { label: "VASCULAR CONSTRICTION" },
    metadata: { topic: "Vascular Constriction", priority: "high" },
  },

  {
    id: "pp2-w3s-005",
    type: "mcq",
    prompt: "Which statement about normal platelet size, origin, concentration, and lifespan is correct?",
    setup: "",
    ans: [
      { t: "Platelets are 1 to 4 micrometer discs formed by fragmentation of megakaryocytes, normally 150,000 to 300,000 per microliter, with a lifespan in blood of about 8 to 12 days", ok: true },
      { t: "Platelets are 7 to 8 micrometer nucleated cells formed in the spleen, normally 4 to 5 million per microliter, with a lifespan of about 120 days", ok: false },
      { t: "Platelets are 1 to 4 micrometer discs formed by fragmentation of lymphocytes, normally 5,000 to 10,000 per microliter, with a lifespan of about 1 day", ok: false },
      { t: "Platelets are 10 to 15 micrometer discs released directly from marrow sinusoids, normally 500,000 to 800,000 per microliter, with a lifespan of about 30 days", ok: false },
    ],
    rationale: "Guyton describes platelets (thrombocytes) as small discs 1 to 4 micrometers in diameter that form by fragmentation of megakaryocytes in the bone marrow. The normal circulating concentration is 150,000 to 300,000 per microliter, and the platelet lifespan in blood is about 8 to 12 days before removal by tissue macrophages, largely in the spleen. The distractors describe red blood cells (7 to 8 micrometers, 120 day lifespan) or invented values. For the CRNA, knowing the normal platelet count range is essential for interpreting preoperative labs and setting transfusion thresholds, since counts below specific levels markedly raise bleeding risk. Guyton Ch. 37.", // source: Ch 37 slide 6
    scene: "hematology",
    sceneCfg: { label: "PLATELET STRUCTURE" },
    metadata: { topic: "Platelet Structure and Production", priority: "high" },
  },

  {
    id: "pp2-w3s-006",
    type: "mcq",
    prompt: "Although platelets lack a nucleus, they contain functional components that support hemostasis. Which platelet component is correctly matched to its function?",
    setup: "",
    ans: [
      { t: "Actin, myosin, and thrombosthenin provide contractile capability that lets platelets contract and retract the clot", ok: true },
      { t: "A cell nucleus directs platelet mitosis so the platelet plug grows by local platelet division", ok: false },
      { t: "Hemoglobin within platelets carries the oxygen required for the contractile machinery of clot retraction", ok: false },
      { t: "Surfactant stored in platelet granules lowers surface tension so platelets can spread across the wound", ok: false },
    ],
    rationale: "Guyton notes that platelets, despite having no nucleus, retain several functional structures. They contain actin, myosin, and thrombosthenin, which give them contractile capability used in clot retraction. Residual endoplasmic reticulum and Golgi apparatus synthesize enzymes and prostaglandins, store calcium, and produce fibrin stabilizing factor and platelet derived growth factor. Mitochondria and enzyme systems form ATP and ADP. Platelets do not divide because they have no nucleus, carry no hemoglobin, and store no surfactant, so those options are false. For the CRNA, the contractile proteins explain clot retraction, and platelet derived growth factor explains the role of platelets in healing the vessel wall. Guyton Ch. 37.", // source: Ch 37 slide 7
    scene: "hematology",
    sceneCfg: { label: "PLATELET FUNCTIONS" },
    metadata: { topic: "Platelet Structure and Production", priority: "medium" },
  },

  {
    id: "pp2-w3s-007",
    type: "mcq",
    prompt: "The platelet cell membrane keeps platelets quiet in healthy vessels but reactive at injury sites. Which description of the platelet membrane is correct?",
    setup: "",
    ans: [
      { t: "Surface glycoproteins repel intact normal endothelium but adhere to injured endothelium and exposed collagen, while membrane phospholipids help activate clotting", ok: true },
      { t: "Surface glycoproteins adhere strongly to intact normal endothelium, which is why platelets line healthy vessels", ok: false },
      { t: "Membrane phospholipids inhibit the coagulation cascade so that clotting occurs only after the platelet plug fully forms", ok: false },
      { t: "The platelet membrane lacks glycoproteins, so adhesion depends entirely on fibrin generated by thrombin", ok: false },
    ],
    rationale: "Guyton emphasizes two membrane features. Surface glycoproteins cause platelets to be repelled by intact normal endothelium yet to adhere to injured endothelial surfaces and especially to exposed collagen in the vessel wall. Membrane phospholipids, including platelet factor 3 activity, help activate several steps of the clotting cascade. This dual behavior keeps platelets inert in healthy vessels but reactive precisely where injury exposes collagen. The distractors reverse these properties. For the CRNA, the platelet phospholipid surface is where the prothrombin activator complex assembles, which is why adequate platelet function is required for efficient thrombin generation, not merely for the mechanical plug. Guyton Ch. 37.", // source: Ch 37 slide 8
    scene: "hematology",
    sceneCfg: { label: "PLATELET MEMBRANE" },
    metadata: { topic: "Platelet Structure and Production", priority: "medium" },
  },

  {
    id: "pp2-w3s-008",
    type: "mcq",
    prompt: "A patient with a very low platelet count develops pinpoint skin hemorrhages and bleeding gums. How does this presentation relate to platelet plug formation?",
    setup: "",
    ans: [
      { t: "Platelets normally seal the tiny daily ruptures in small vessels, so when platelet numbers are very low the sealing fails and produces petechiae and bleeding gums", ok: true },
      { t: "Petechiae occur because excess platelets clump and rupture small vessels from the inside", ok: false },
      { t: "Bleeding gums occur only when fibrinogen is absent and are unrelated to the platelet count", ok: false },
      { t: "Pinpoint hemorrhages reflect failure of the extrinsic pathway rather than any platelet function", ok: false },
    ],
    rationale: "Guyton explains that platelets continuously plug the minute ruptures that occur in small vessels every day. Platelets contact damaged endothelium, form irregular shapes, release granule contents such as ADP and thromboxane A2, adhere to collagen and von Willebrand factor, and recruit more platelets to build the plug. When the platelet count falls very low, this routine sealing fails and small hemorrhages appear as petechiae and bleeding gums. The distractors misattribute the findings to platelet excess, fibrinogen, or the extrinsic pathway. For the CRNA, mucocutaneous bleeding such as petechiae signals a platelet problem and warrants attention before neuraxial or invasive procedures. Guyton Ch. 37.", // source: Ch 37 slide 9
    scene: "hematology",
    sceneCfg: { label: "PLATELET PLUG AND PETECHIAE" },
    metadata: { topic: "Platelet Plug Formation", priority: "high" },
  },

  {
    id: "pp2-w3s-009",
    type: "mcq",
    prompt: "In severe vascular trauma, how quickly does clotting begin, and how does the clot evolve over the following minutes to weeks?",
    setup: "",
    ans: [
      { t: "Clotting begins in about 15 to 20 seconds, an occlusive clot forms within 3 to 6 minutes, retraction occurs over 20 to 60 minutes, and over 1 to 2 weeks fibroblasts organize the clot into fibrous tissue", ok: true },
      { t: "Clotting begins after about 2 hours, becomes occlusive in 12 hours, retracts over several days, and never organizes into fibrous tissue", ok: false },
      { t: "Clotting begins instantly, becomes occlusive within 1 second, and is fully dissolved within 5 minutes by plasmin", ok: false },
      { t: "Clotting begins in about 15 to 20 minutes, becomes occlusive in 6 to 8 hours, and retracts over 2 to 3 weeks", ok: false },
    ],
    rationale: "Guyton gives a clear clotting timeline for severe vascular trauma. A clot begins to develop in about 15 to 20 seconds, and within 3 to 6 minutes the clot becomes occlusive unless the vascular opening is very large. Over the next 20 to 60 minutes the clot retracts, expressing serum and pulling the wound edges together. Over the following 1 to 2 weeks, fibroblasts invade the clot and organize it into fibrous tissue. The distractors use grossly incorrect time scales. For the CRNA, this rapid onset explains why even brief effective vascular compression lets the initial clot establish itself at a puncture or surgical site. Guyton Ch. 37.", // source: Ch 37 slide 11
    scene: "hematology",
    sceneCfg: { label: "CLOT TIMELINE" },
    metadata: { topic: "Clot Formation and Progression", priority: "high" },
  },

  {
    id: "pp2-w3s-010",
    type: "mcq",
    prompt: "Thrombin acts on fibrinogen to build the fibrin meshwork of the clot. Which description of fibrin production is correct?",
    setup: "",
    ans: [
      { t: "Thrombin, a weak protease, cleaves small peptides from fibrinogen to form fibrin monomers that spontaneously polymerize, and fibrin stabilizing factor, activated by thrombin, cross-links the strands", ok: true },
      { t: "Plasmin cleaves fibrinogen into fibrin monomers, and antithrombin III then cross-links them into a stable meshwork", ok: false },
      { t: "Thrombin converts plasminogen directly into fibrin, bypassing fibrinogen entirely", ok: false },
      { t: "Fibrinogen polymerizes on its own without any enzyme, and thrombin merely dissolves the excess strands", ok: false },
    ],
    rationale: "Guyton describes fibrin production in steps. Thrombin, acting as a weak protease, cleaves four low molecular weight peptides from each fibrinogen molecule, forming a fibrin monomer that spontaneously polymerizes with other monomers into long fibrin fibers that make up the reticulum of the clot. Initially these fibers are held by weak noncovalent bonds. Fibrin stabilizing factor, present in plasma and released from platelets and activated by thrombin itself, then forms covalent cross-links between adjacent fibrin strands, greatly strengthening the meshwork. The distractors misassign these roles to plasmin or antithrombin III. For the CRNA, this explains why both adequate fibrinogen and adequate thrombin generation are needed for a strong clot. Guyton Ch. 37.", // source: Ch 37 slide 14
    scene: "hematology",
    sceneCfg: { label: "FIBRIN PRODUCTION" },
    metadata: { topic: "Coagulation Common Pathway", priority: "high" },
  },

  {
    id: "pp2-w3s-011",
    type: "mcq",
    prompt: "In the final common pathway shown in Figure 37-3, prothrombin is converted to thrombin. What is required for this conversion, and what does the resulting thrombin act on next?",
    setup: "",
    ans: [
      { t: "Prothrombin activator in the presence of calcium ions converts prothrombin to thrombin, and thrombin then converts fibrinogen to fibrin", ok: true },
      { t: "Plasmin in the presence of potassium ions converts prothrombin to thrombin, and thrombin then converts fibrin back to fibrinogen", ok: false },
      { t: "Tissue plasminogen activator converts prothrombin to thrombin without calcium, and thrombin then digests the platelet plug", ok: false },
      { t: "Antithrombin III converts prothrombin to thrombin, and thrombin then inactivates factors V and VIII", ok: false },
    ],
    rationale: "Guyton Figure 37-3 shows the common pathway. Prothrombin activator, formed by either the extrinsic or intrinsic pathway, acts on prothrombin in the presence of calcium ions to generate thrombin. Thrombin then cleaves fibrinogen to form fibrin monomers that polymerize into fibrin fibers, while activated fibrin stabilizing factor cross-links them. Calcium, which is factor IV, is required at several points, which is why citrate, by chelating calcium, prevents clotting in stored blood samples and banked blood. The distractors substitute the wrong enzymes, ions, or directions. For the CRNA, the calcium requirement explains why large volume citrated blood transfusion can cause hypocalcemia that impairs both coagulation and myocardial function. Guyton Ch. 37.", // source: Ch 37 slide 12
    scene: "hematology",
    sceneCfg: { label: "COMMON PATHWAY" },
    metadata: { topic: "Coagulation Common Pathway", priority: "high" },
  },

  {
    id: "pp2-w3s-012",
    type: "mcq",
    prompt: "Once thrombin is generated within a forming clot, it drives a positive feedback loop that extends the clot. Which statement best describes this process?",
    setup: "",
    ans: [
      { t: "Thrombin acts on prothrombin to generate still more thrombin and activates other clotting factors to make more prothrombin activator, so additional fibrin forms at the periphery of the clot", ok: true },
      { t: "Thrombin activates antithrombin III, which feeds back to generate more prothrombin activator and extends the clot indefinitely", ok: false },
      { t: "Thrombin immediately inhibits its own formation, so a clot can never extend beyond its initial size", ok: false },
      { t: "Thrombin converts plasminogen to plasmin, which feeds back to generate more thrombin at the clot periphery", ok: false },
    ],
    rationale: "Guyton describes clot extension as a positive feedback process. Thrombin generated in the clot is bound to platelets and trapped in the fibrin meshwork. This thrombin acts directly on prothrombin to generate even more thrombin, and it also activates several other clotting factors that increase the formation of prothrombin activator. As a result, additional fibrin monomers and polymers form at the periphery, extending the clot until anticoagulant mechanisms check the reaction. The distractors confuse this with anticoagulant or fibrinolytic actions. For the CRNA, this self-amplifying loop explains why pathologic clotting can propagate rapidly, and why the natural anticoagulant systems are essential to confine clotting to the site of injury. Guyton Ch. 37.", // source: Ch 37 slide 15
    scene: "hematology",
    sceneCfg: { label: "CLOT EXTENSION" },
    metadata: { topic: "Coagulation Common Pathway", priority: "medium" },
  },

  {
    id: "pp2-w3s-013",
    type: "mcq",
    prompt: "About 20 to 60 minutes after a clot forms, it retracts. What drives clot retraction and what is its functional benefit?",
    setup: "",
    ans: [
      { t: "Platelets bound to the fibrin meshwork contract using actin, myosin, and thrombosthenin, squeezing out serum and pulling the edges of the vascular defect together", ok: true },
      { t: "Plasmin digests the central fibrin, allowing the clot to collapse inward and pull the vessel edges together", ok: false },
      { t: "Osmotic loss of water from the clot shrinks the fibrin in a passive process that does not involve platelets", ok: false },
      { t: "Red blood cells trapped in the clot contract and expel plasma, closing the vascular defect", ok: false },
    ],
    rationale: "Guyton explains that clot retraction begins within 20 to 60 minutes and depends on platelets. Platelets bind to multiple fibrin fibers and then contract through their actin, myosin, and thrombosthenin, the same contractile proteins used for shape change. This contraction pulls the fibrin strands closer, squeezing serum (plasma without fibrinogen and clotting factors) out of the clot and drawing the edges of the damaged vessel together to help close the defect. Because retraction requires platelets, it fails when the platelet count is very low. The distractors substitute plasmin, osmosis, or red cells. For the CRNA, poor clot retraction is one functional consequence of severe thrombocytopenia. Guyton Ch. 37.", // source: Ch 37 slide 16
    scene: "hematology",
    sceneCfg: { label: "CLOT RETRACTION" },
    metadata: { topic: "Clot Formation and Progression", priority: "medium" },
  },

  {
    id: "pp2-w3s-014",
    type: "mcq",
    prompt: "Both the extrinsic and intrinsic pathways generate prothrombin activator, but they are triggered differently. Which pairing of trigger to pathway is correct?",
    setup: "",
    ans: [
      { t: "The extrinsic pathway is triggered by trauma to the vessel wall and adjacent tissues, while the intrinsic pathway is triggered by trauma to the blood itself or exposure of blood to collagen", ok: true },
      { t: "The extrinsic pathway is triggered by exposure of blood to collagen, while the intrinsic pathway is triggered by release of tissue factor from damaged tissue", ok: false },
      { t: "The extrinsic pathway is triggered by a fall in plasma calcium, while the intrinsic pathway is triggered by a rise in plasma calcium", ok: false },
      { t: "Both pathways are triggered only by platelet degranulation, differing solely in their speed of fibrin breakdown", ok: false },
    ],
    rationale: "Guyton states that prothrombin activator is generated by two pathways that usually act together. The extrinsic pathway begins with trauma to the vascular wall and the surrounding tissues, which release tissue factor. The intrinsic pathway begins with trauma to the blood itself or exposure of the blood to collagen from a damaged vessel wall. In both pathways a cascade of clotting factors, most of which are inactive proteolytic enzymes until they are activated, leads stepwise to prothrombin activator. The distractors swap the triggers or invent calcium based triggers. For the CRNA, this dual trigger model underlies the two standard laboratory tests, the prothrombin time for the extrinsic pathway and the aPTT for the intrinsic pathway. Guyton Ch. 37.", // source: Ch 37 slide 17
    scene: "hematology",
    sceneCfg: { label: "TWO CLOTTING PATHWAYS" },
    metadata: { topic: "Coagulation Pathways", priority: "high" },
  },

  {
    id: "pp2-w3s-015",
    type: "mcq",
    prompt: "In the extrinsic clotting pathway of Figure 37-5, what initiates the cascade and what is the role of factor VII?",
    setup: "",
    ans: [
      { t: "Tissue trauma releases tissue factor, which complexes with factor VII to form VIIa, and this complex activates factor X to Xa, leading to prothrombin activator", ok: true },
      { t: "Contact with collagen activates factor XII, which then activates factor VII directly to form prothrombin activator", ok: false },
      { t: "Tissue factor activates plasminogen, which then activates factor VII to dissolve the early clot", ok: false },
      { t: "Factor VII is activated by thrombin alone, independent of tissue factor, and then activates fibrinogen directly", ok: false },
    ],
    rationale: "Guyton Figure 37-5 shows the extrinsic pathway. Trauma to tissue releases tissue factor, also called tissue thromboplastin, a complex of lipoprotein and phospholipids. Tissue factor complexes with and activates factor VII to VIIa. The tissue factor and VIIa complex, together with calcium, then activates factor X to Xa. Activated X combines with factor V and platelet phospholipids to form prothrombin activator, which converts prothrombin to thrombin. Contact activation of factor XII belongs to the intrinsic pathway, not the extrinsic, so that choice is wrong. For the CRNA, the extrinsic pathway is assessed by the prothrombin time and is the pathway most affected by warfarin through its vitamin K dependent factors. Guyton Ch. 37.", // source: Ch 37 slide 18
    scene: "hematology",
    sceneCfg: { label: "EXTRINSIC PATHWAY" },
    metadata: { topic: "Coagulation Pathways", priority: "high" },
  },

  {
    id: "pp2-w3s-016",
    type: "mcq",
    prompt: "The intrinsic pathway in Figure 37-4 begins with contact activation inside the blood. Which sequence of factor activations correctly describes the intrinsic pathway?",
    setup: "",
    ans: [
      { t: "Trauma to blood or contact with collagen activates factor XII to XIIa and releases platelet phospholipids; XIIa activates XI, XIa activates IX, and IXa with factor VIII, platelet phospholipids, and calcium activates factor X to Xa", ok: true },
      { t: "Tissue factor activates factor VII directly, which activates factor X without any contribution from factors XII, XI, or IX", ok: false },
      { t: "Factor XII activates fibrinogen directly to fibrin, bypassing factors XI, IX, and X entirely", ok: false },
      { t: "Thrombin activates factor XII first, and the pathway then proceeds from X to IX to XI in reverse order", ok: false },
    ],
    rationale: "Guyton Figure 37-4 details the intrinsic pathway. Trauma to the blood or exposure of blood to collagen activates factor XII to XIIa and causes release of platelet phospholipids. Activated XII, aided by high-molecular-weight kininogen and accelerated by prekallikrein, activates factor XI to XIa. Activated XI then activates factor IX to IXa. Activated IX, acting with factor VIII, platelet phospholipids, and calcium, activates factor X to Xa. Activated X combines with factor V and platelet phospholipids to form prothrombin activator. Factor VIII is the factor missing in hemophilia A, and contact activation of XII begins the cascade. For the CRNA, the intrinsic pathway is monitored by the aPTT and is the pathway prolonged by heparin. Guyton Ch. 37.", // source: Ch 37 slide 19
    scene: "hematology",
    sceneCfg: { label: "INTRINSIC PATHWAY" },
    metadata: { topic: "Coagulation Pathways", priority: "high" },
  },

  {
    id: "pp2-w3s-017",
    type: "mcq",
    prompt: "The extrinsic and intrinsic pathways differ markedly in how quickly they generate a clot. Which comparison of their speeds is correct?",
    setup: "",
    ans: [
      { t: "The extrinsic pathway is explosive and can produce a clot in as little as 15 seconds when tissue trauma is severe, whereas the intrinsic pathway is slower and usually requires 1 to 6 minutes", ok: true },
      { t: "The intrinsic pathway is explosive and clots in 15 seconds, whereas the extrinsic pathway requires 1 to 6 minutes", ok: false },
      { t: "Both pathways require exactly 1 second because they share the same activating enzymes", ok: false },
      { t: "The extrinsic pathway requires about 30 minutes, whereas the intrinsic pathway requires about 2 hours", ok: false },
    ],
    rationale: "Guyton contrasts the two pathways by speed. The extrinsic pathway is explosive once initiated, and with severe tissue trauma clotting can occur in as little as 15 seconds because tissue factor rapidly drives factor X activation. The intrinsic pathway is much slower, usually requiring 1 to 6 minutes, because it depends on a longer series of contact activated steps within the blood. Both pathways converge on the common pathway at the activation of factor X. The distractors reverse the pathways or invent times. For the CRNA, this speed difference is mirrored in the laboratory: the prothrombin time, which tests the fast extrinsic pathway, is reported in seconds, and the aPTT tests the slower intrinsic pathway. Guyton Ch. 37.", // source: Ch 37 slide 20
    scene: "hematology",
    sceneCfg: { label: "PATHWAY SPEEDS" },
    metadata: { topic: "Coagulation Pathways", priority: "medium" },
  },

  {
    id: "pp2-w3s-018",
    type: "mcq",
    prompt: "In normal intact vessels, several endothelial features keep blood from clotting. Which set of features correctly prevents clotting on healthy endothelium?",
    setup: "",
    ans: [
      { t: "A smooth endothelial surface, a glycocalyx that repels clotting factors and platelets, and thrombomodulin that binds thrombin and activates protein C, which then inactivates factors V and VIII", ok: true },
      { t: "A rough endothelial surface, a glycocalyx that attracts platelets, and thrombomodulin that activates factors V and VIII", ok: false },
      { t: "Exposed collagen, tissue factor displayed on the luminal surface, and continuous thrombin generation on the endothelium", ok: false },
      { t: "Continuous release of ADP and thromboxane A2 by endothelium, which keeps platelets primed for aggregation", ok: false },
    ],
    rationale: "Guyton lists the endothelial features that prevent clotting in intact vessels. The endothelial surface is smooth, which prevents contact activation of the intrinsic pathway. A glycocalyx layer on the endothelium repels clotting factors and platelets. Thrombomodulin, a protein bound to the endothelial membrane, binds thrombin; the thrombomodulin and thrombin complex then activates protein C, which inactivates factors V and VIII. Together these features prevent a clot from forming on healthy endothelium. When the endothelial surface is damaged, its smoothness, glycocalyx, and thrombomodulin are lost, and clotting is favored. The distractors invert these protective features. For the CRNA, loss of these endothelial protections explains why atherosclerosis and endothelial injury promote pathologic thrombosis. Guyton Ch. 37.", // source: Ch 37 slide 21
    scene: "hematology",
    sceneCfg: { label: "PREVENTION OF CLOTTING" },
    metadata: { topic: "Anticoagulants in Normal Vasculature", priority: "high" },
  },

  {
    id: "pp2-w3s-019",
    type: "mcq",
    prompt: "Two of the most important anticoagulants that limit a clot to its site are the fibrin fibers themselves and antithrombin III. How do they restrain clotting?",
    setup: "",
    ans: [
      { t: "Fibrin fibers adsorb about 85 to 90 percent of the thrombin formed, keeping it from spreading, and antithrombin III then inactivates the remaining thrombin over the next 12 to 20 minutes", ok: true },
      { t: "Fibrin fibers release the thrombin they trap back into the blood, and antithrombin III converts that thrombin into plasmin within seconds", ok: false },
      { t: "Antithrombin III activates the trapped thrombin, while fibrin fibers convert factor X into prothrombin activator to amplify clotting", ok: false },
      { t: "Fibrin fibers and antithrombin III both stimulate thrombin production, ensuring the clot grows until the vessel is fully sealed", ok: false },
    ],
    rationale: "Guyton identifies two intravascular anticoagulants that confine a clot. As thrombin forms, much of it is adsorbed onto the fibrin fibers as they develop, so that about 85 to 90 percent of the thrombin produced becomes bound to fibrin. This prevents thrombin from spreading into the rest of the blood and extending the clot excessively. The thrombin that does escape into the blood combines with antithrombin III, which blocks its effect on fibrinogen and then inactivates the thrombin itself over the next 12 to 20 minutes. The distractors reverse these actions or claim they promote clotting. For the CRNA, antithrombin III is the cofactor that heparin dramatically potentiates, linking this physiology to anticoagulant pharmacology. Guyton Ch. 37.", // source: Ch 37 slide 22
    scene: "hematology",
    sceneCfg: { label: "NEGATIVE FEEDBACK" },
    metadata: { topic: "Anticoagulants in Normal Vasculature", priority: "medium" },
  },

  {
    id: "pp2-w3s-020",
    type: "mcq",
    prompt: "Heparin is a powerful endogenous and pharmacologic anticoagulant. Which description of its mechanism and source is correct?",
    setup: "",
    ans: [
      { t: "Heparin is a highly negatively charged molecule that, by combining with antithrombin III, increases antithrombin III effectiveness 100 to 1000 fold and helps remove activated factors XII, XI, X, and IX; it is produced by mast cells and basophils, especially around the liver and lungs", ok: true },
      { t: "Heparin is a positively charged molecule that activates factor X directly and is produced only by hepatocytes in the liver", ok: false },
      { t: "Heparin works by digesting fibrin strands the way plasmin does and is produced by platelets during degranulation", ok: false },
      { t: "Heparin converts prothrombin to thrombin more rapidly and is produced by endothelial cells lining the great veins", ok: false },
    ],
    rationale: "Guyton describes heparin as a strongly negatively charged conjugated polysaccharide that is a powerful anticoagulant. By itself heparin has little anticoagulant action, but when it combines with antithrombin III it increases the effectiveness of antithrombin III for removing thrombin by 100 to 1000 fold. The heparin and antithrombin III complex also helps remove several other activated coagulation factors, including activated factors XII, XI, X, and IX. Heparin is produced by mast cells and basophils, which are especially abundant in the connective tissue around the capillaries of the liver and lungs, sites where slowly flowing blood carries many small clots. The distractors reverse the charge, source, or mechanism. For the CRNA, this is the basis of clinical heparin anticoagulation and explains why antithrombin III deficiency causes heparin resistance. Guyton Ch. 37.", // source: Ch 37 slide 23
    scene: "hematology",
    sceneCfg: { label: "HEPARIN MECHANISM" },
    metadata: { topic: "Anticoagulant Drugs", priority: "high" },
  },

  {
    id: "pp2-w3s-021",
    type: "mcq",
    prompt: "Clots are eventually dissolved by the fibrinolytic system. Which description of clot lysis is correct?",
    setup: "",
    ans: [
      { t: "Plasminogen is trapped in the clot, and tissue plasminogen activator released slowly from injured tissue converts plasminogen to plasmin, a proteolytic enzyme that digests fibrin fibers and several clotting factors to dissolve the clot", ok: true },
      { t: "Antithrombin III is trapped in the clot and is converted by thrombin into plasmin, which then digests fibrin", ok: false },
      { t: "Thrombin slowly converts fibrin back into fibrinogen, dissolving the clot without any plasmin", ok: false },
      { t: "Heparin trapped in the clot is converted into plasminogen, which then cross-links and removes the fibrin strands", ok: false },
    ],
    rationale: "Guyton describes lysis of blood clots through the plasmin system. The plasma protein plasminogen (profibrinolysin) becomes trapped in the clot along with other plasma proteins. Injured tissues and vascular endothelium slowly release tissue plasminogen activator (t-PA), which over a day or more converts plasminogen into plasmin (fibrinolysin). Plasmin is a proteolytic enzyme that digests the fibrin fibers and also digests fibrinogen, factor V, factor VIII, prothrombin, and factor XII. By lysing the clot, plasmin reopens vessels and clears clots from tiny peripheral vessels. The distractors substitute the wrong proteins. For the CRNA, this is the system exploited by thrombolytic drugs such as recombinant t-PA used to dissolve pathologic clots. Guyton Ch. 37.", // source: Ch 37 slide 24
    scene: "hematology",
    sceneCfg: { label: "CLOT LYSIS" },
    metadata: { topic: "Fibrinolysis", priority: "high" },
  },

  {
    id: "pp2-w3s-022",
    type: "mcq",
    prompt: "Vitamin K is required by the liver to produce several clotting factors. Which statement about vitamin K and its dependent factors is correct?",
    setup: "",
    ans: [
      { t: "The liver requires vitamin K to produce prothrombin (factor II) and factors VII, IX, and X, as well as protein C; vitamin K is fat-soluble and is largely supplied by intestinal bacteria, so deficiency arises with fat malabsorption, biliary obstruction, or liver disease", ok: true },
      { t: "Vitamin K is water-soluble and is required to produce fibrinogen and factors XI, XII, and XIII, but not prothrombin", ok: false },
      { t: "Vitamin K is required only for platelet production and has no role in the synthesis of any clotting factor", ok: false },
      { t: "Vitamin K is supplied entirely by dietary meat, so intestinal bacteria and bile have no effect on its availability", ok: false },
    ],
    rationale: "Guyton lists the vitamin K dependent clotting factors made by the liver: prothrombin (factor II), factor VII, factor IX, factor X, and protein C. Vitamin K is a fat-soluble vitamin, and a large portion of the body supply is synthesized by bacteria in the intestine. Because it is fat-soluble, its absorption requires bile, so deficiency develops with fat malabsorption, biliary obstruction, prolonged antibiotic suppression of gut flora, or liver disease that impairs factor synthesis. Lack of vitamin K therefore reduces production of these factors and causes a bleeding tendency, prolonging the prothrombin time. The distractors misstate the solubility, the factors involved, or the sources. For the CRNA, vitamin K can be administered to restore these factors, although severe liver disease causes a coagulopathy that vitamin K alone may not correct because synthetic capacity itself is lost. Guyton Ch. 37.", // source: Ch 37 slide 26
    scene: "hematology",
    sceneCfg: { label: "VITAMIN K FACTORS" },
    metadata: { topic: "Vitamin K and Coagulation", priority: "high" },
  },

  {
    id: "pp2-w3s-023",
    type: "mcq",
    prompt: "Hemophilia is a classic inherited bleeding disorder. Which statement about hemophilia A and hemophilia B is correct?",
    setup: "",
    ans: [
      { t: "Hemophilia A results from deficiency of factor VIII and accounts for about 85 percent of cases (about 1 in 10,000), hemophilia B results from deficiency of factor IX and accounts for about 15 percent (about 1 in 60,000), and both impair the intrinsic pathway and are X-linked, occurring almost only in males", ok: true },
      { t: "Hemophilia A results from deficiency of factor IX, hemophilia B from deficiency of factor VIII, and both are inherited as autosomal dominant traits affecting the extrinsic pathway", ok: false },
      { t: "Hemophilia A results from deficiency of fibrinogen and hemophilia B from deficiency of platelets, and both occur almost only in females", ok: false },
      { t: "Both forms result from deficiency of factor VII and prolong the prothrombin time rather than the aPTT", ok: false },
    ],
    rationale: "Guyton explains that hemophilia is an X-linked bleeding disorder occurring almost exclusively in males. About 85 percent of cases are hemophilia A, caused by deficiency of factor VIII, with an incidence of about 1 in 10,000. The remaining roughly 15 percent are hemophilia B (Christmas disease), caused by deficiency of factor IX, with an incidence of about 1 in 60,000. Because both factor VIII and factor IX act in the intrinsic pathway, both forms prolong the aPTT while the prothrombin time remains normal. Bleeding is typically into joints and deep tissues and can follow trauma or surgery by hours. The distractors swap the factors, inheritance, or affected pathway. For the CRNA, knowing the specific factor deficiency guides factor replacement before invasive procedures. Guyton Ch. 37.", // source: Ch 37 slide 28
    scene: "hematology",
    sceneCfg: { label: "HEMOPHILIA" },
    metadata: { topic: "Bleeding Disorders", priority: "high" },
  },

  {
    id: "pp2-w3s-024",
    type: "mcq",
    prompt: "Thrombocytopenia is a low platelet count that causes a characteristic bleeding pattern. Which statement about thrombocytopenia is correct?",
    setup: "",
    ans: [
      { t: "Bleeding is usually modest until the count falls below about 50,000 per microliter and becomes life-threatening below about 10,000; it produces small cutaneous and mucosal hemorrhages (petechiae and purpura), and transfused platelets are effective for only about 1 to 4 days", ok: true },
      { t: "Bleeding becomes life-threatening as soon as the count falls below 200,000 per microliter, and transfused platelets last about 120 days", ok: false },
      { t: "Thrombocytopenia produces deep joint and muscle bleeds identical to hemophilia and never causes skin findings", ok: false },
      { t: "Thrombocytopenia prolongs the prothrombin time markedly while leaving the platelet plug entirely normal", ok: false },
    ],
    rationale: "Guyton describes thrombocytopenia as a deficiency of platelets. Bleeding is usually modest until the platelet count falls below about 50,000 per microliter, and a count below about 10,000 is frequently life-threatening. The characteristic finding is many small hemorrhages in the skin and mucous membranes, producing petechiae and purpura rather than the large deep bleeds of hemophilia. Because the bleeding is from small vessels and capillaries, it is the platelet plug that fails. Transfused platelets help but survive only about 1 to 4 days, so repeated transfusion may be needed. The distractors misstate the thresholds, the bleeding pattern, or the lab effect. For the CRNA, these thresholds guide platelet transfusion decisions and the safety of neuraxial anesthesia. Guyton Ch. 37.", // source: Ch 37 slide 29
    scene: "hematology",
    sceneCfg: { label: "THROMBOCYTOPENIA" },
    metadata: { topic: "Bleeding Disorders", priority: "high" },
  },

  {
    id: "pp2-w3s-025",
    type: "mcq",
    prompt: "Abnormal clots can form in vessels and then travel. Which statement correctly distinguishes a thrombus from an embolus and identifies the main predisposing conditions?",
    setup: "",
    ans: [
      { t: "A thrombus is an abnormal clot that develops in a vessel, and an embolus is a clot that has broken free and travels in the blood; the main predisposing conditions are a roughened endothelial surface, as in atherosclerosis, and slowly flowing or stagnant blood, as with immobilization", ok: true },
      { t: "A thrombus travels in the blood while an embolus stays fixed in place, and both are caused only by a high platelet count", ok: false },
      { t: "A thrombus is a clot that forms outside vessels in the tissues, and an embolus is a clot confined to the heart chambers", ok: false },
      { t: "Both thrombi and emboli are prevented by slow blood flow and by roughening of the endothelial surface", ok: false },
    ],
    rationale: "Guyton defines a thrombus as an abnormal clot that develops within a blood vessel, and an embolus as a thrombus or fragment that has broken loose and flows in the blood until it lodges in a narrower vessel. Two conditions especially predispose to thromboembolism: a roughened endothelial surface, such as that produced by atherosclerosis, infection, or trauma, which can initiate clotting; and slowly flowing or stagnant blood, such as occurs with prolonged immobilization, which lets small amounts of thrombin and other procoagulants accumulate. Treatment includes tissue plasminogen activator to dissolve clots and, in some cases, surgical embolectomy. The distractors reverse the definitions or the risk factors. For the CRNA, immobilization and venous stasis under anesthesia underlie perioperative venous thromboembolism prophylaxis. Guyton Ch. 37.", // source: Ch 37 slide 30
    scene: "hematology",
    sceneCfg: { label: "THROMBI AND EMBOLI" },
    metadata: { topic: "Thromboembolic Disease", priority: "high" },
  },

  {
    id: "pp2-w3s-026",
    type: "mcq",
    prompt: "A common and dangerous embolic event arises from clots that form in the deep veins of the legs. Which statement about pulmonary embolism is correct?",
    setup: "",
    ans: [
      { t: "Clots that form in the large veins of the legs and pelvis can break loose, travel through the right heart, and lodge in the pulmonary arteries as a pulmonary embolus; tissue plasminogen activator given promptly can be life-saving by dissolving the clot", ok: true },
      { t: "Pulmonary emboli almost always originate in the pulmonary veins and travel backward into the left atrium", ok: false },
      { t: "Pulmonary emboli are clots that form within the alveoli and block gas exchange directly, and they cannot be treated with any drug", ok: false },
      { t: "Pulmonary emboli arise from clots in the carotid arteries and travel into the lungs through the aorta", ok: false },
    ],
    rationale: "Guyton explains that a frequent source of dangerous emboli is the large veins of the legs and pelvis, where slowly flowing blood favors clot formation, especially during prolonged immobilization. A clot can break loose as an embolus, travel through the venous system and the right side of the heart, and lodge in the pulmonary arteries, producing a pulmonary embolus that obstructs pulmonary blood flow. Prompt administration of tissue plasminogen activator can be life-saving by activating plasmin to dissolve the clot. The distractors misplace the origin of the embolus or deny effective treatment. For the CRNA, this is the rationale for venous thromboembolism prophylaxis and for recognizing sudden intraoperative cardiovascular collapse as possible pulmonary embolism. Guyton Ch. 37.", // source: Ch 37 slide 31
    scene: "hematology",
    sceneCfg: { label: "PULMONARY EMBOLUS" },
    metadata: { topic: "Thromboembolic Disease", priority: "high" },
  },

  {
    id: "pp2-w3s-027",
    type: "mcq",
    prompt: "Disseminated intravascular coagulation (DIC) is a paradoxical disorder of widespread clotting and bleeding. Which statement about DIC is correct?",
    setup: "",
    ans: [
      { t: "Widespread tissue factor release, as in sepsis or massive tissue trauma, triggers clotting throughout the small vessels; this consumes clotting factors and platelets, so the patient can then bleed severely despite the diffuse clotting", ok: true },
      { t: "DIC is caused by a complete absence of tissue factor, so clotting cannot occur anywhere in the circulation", ok: false },
      { t: "In DIC the large arteries clot while the small vessels are entirely spared, and clotting factor levels actually rise", ok: false },
      { t: "DIC results from an isolated deficiency of factor VIII and is limited to bleeding into the joints", ok: false },
    ],
    rationale: "Guyton describes disseminated intravascular coagulation as widespread clotting in the small vessels caused by entry of large amounts of tissue factor into the blood, as occurs with septicemia from circulating bacteria or toxins, or with massive tissue damage. The diffuse clotting consumes clotting factors and platelets faster than they can be replaced, so the procoagulants become depleted and the patient paradoxically develops a severe bleeding tendency. The small clots can also obstruct peripheral vessels and contribute to circulatory shock. The distractors deny the role of tissue factor, reverse the vessels involved, or confuse DIC with hemophilia. For the CRNA, DIC is a feared complication of sepsis, obstetric emergencies, and massive trauma, and it is treated by reversing the cause and replacing factors and platelets. Guyton Ch. 37.", // source: Ch 37 slide 32
    scene: "hematology",
    sceneCfg: { label: "DIC" },
    metadata: { topic: "Bleeding Disorders", priority: "high" },
  },

  {
    id: "pp2-w3s-028",
    type: "mcq",
    prompt: "Warfarin and related coumarin drugs are oral anticoagulants. Which statement about their mechanism, monitoring, and reversal is correct?",
    setup: "",
    ans: [
      { t: "Warfarin inhibits vitamin K epoxide reductase (VKOR c1), so the liver cannot recycle vitamin K and gradually makes less active factor II, VII, IX, and X; it is monitored by the prothrombin time and INR (commonly targeted near 2.0 to 3.0), and it is reversed with vitamin K and, when urgent, fresh frozen plasma", ok: true },
      { t: "Warfarin directly inactivates circulating thrombin within minutes and is monitored by the aPTT, with reversal by protamine", ok: false },
      { t: "Warfarin increases liver synthesis of factors II, VII, IX, and X and is reversed by giving additional vitamin K antagonists", ok: false },
      { t: "Warfarin works by chelating calcium in the blood and is reversed by infusing calcium chloride", ok: false },
    ],
    rationale: "Guyton explains that coumarins such as warfarin act by inhibiting vitamin K epoxide reductase complex 1 (VKOR c1), the enzyme that regenerates active vitamin K in the liver. Without recycled vitamin K, the liver cannot fully activate prothrombin (factor II) and factors VII, IX, and X, so the plasma levels of these active factors fall over a day or more as existing factors are degraded. Warfarin therapy is monitored with the prothrombin time, reported as the INR, with common therapeutic targets near 2.0 to 3.0 and higher ranges such as 2.5 to 3.5 for some mechanical valves, while an INR near 1.0 is normal. Because the effect depends on synthesizing new factors, reversal is slow: vitamin K restores synthesis over hours, and fresh frozen plasma or prothrombin complex replaces factors immediately when bleeding is urgent. The distractors confuse warfarin with heparin, reverse its effect, or invent a calcium mechanism. For the CRNA, this governs perioperative bridging and reversal decisions. Guyton Ch. 37.", // source: Ch 37 slide 34
    scene: "hematology",
    sceneCfg: { label: "WARFARIN" },
    metadata: { topic: "Anticoagulant Drugs", priority: "high" },
  },

  {
    id: "pp2-w3s-029",
    type: "mcq",
    prompt: "Two simple bedside tests historically used to assess hemostasis are the bleeding time and the clotting time. Which statement correctly contrasts them?",
    setup: "",
    ans: [
      { t: "The bleeding time, normally about 1 to 6 minutes, mainly reflects platelet function and the small-vessel response, whereas the whole blood clotting time, normally about 6 to 10 minutes, reflects the coagulation cascade but is poorly reproducible", ok: true },
      { t: "The bleeding time, normally about 6 to 10 minutes, reflects the coagulation cascade, whereas the clotting time, about 1 to 6 minutes, reflects platelet function", ok: false },
      { t: "The bleeding time measures plasma calcium, whereas the clotting time measures hemoglobin concentration", ok: false },
      { t: "Both tests are highly reproducible and have completely replaced the prothrombin time and aPTT in modern practice", ok: false },
    ],
    rationale: "Guyton describes two classic tests. The bleeding time is measured by making a small standardized skin puncture and timing how long bleeding continues; it is normally about 1 to 6 minutes and depends mainly on platelet function and the response of the small vessels, so it is prolonged by thrombocytopenia or platelet dysfunction. The whole blood clotting time is measured by placing blood in a tube and timing clot formation; it is normally about 6 to 10 minutes but is poorly reproducible and insensitive, so it has largely been replaced by specific tests. The distractors swap the times and meanings or misstate what the tests measure. For the CRNA, these tests illustrate the conceptual split between platelet (primary) and coagulation (secondary) hemostasis that the modern prothrombin time and aPTT assess more precisely. Guyton Ch. 37.", // source: Ch 37 slide 35
    scene: "hematology",
    sceneCfg: { label: "BLEEDING AND CLOTTING TIME" },
    metadata: { topic: "Coagulation Testing", priority: "medium" },
  },

  {
    id: "pp2-w3s-030",
    type: "mcq",
    prompt: "The prothrombin time is a standard laboratory measure of the extrinsic and common pathways. Which statement about how it is performed and reported is correct?",
    setup: "",
    ans: [
      { t: "Excess calcium and tissue factor are added to plasma to trigger the extrinsic pathway, and the time to clot, normally about 12 seconds, reflects the extrinsic and common pathways; results are standardized as the INR, calculated from the patient PT divided by a normal control PT, raised to the ISI power", ok: true },
      { t: "Collagen and factor XII are added to trigger the intrinsic pathway, and a normal value is about 2 minutes", ok: false },
      { t: "The prothrombin time measures only the platelet count and is reported directly in platelets per microliter", ok: false },
      { t: "All calcium is removed from the plasma so that no clot can form, and the result equals the hemoglobin level", ok: false },
    ],
    rationale: "Guyton describes the prothrombin time. Blood is collected and an excess of calcium ions and tissue factor are added to the plasma; the excess calcium reverses the anticoagulant effect of citrate, and the added tissue factor triggers the extrinsic pathway. The time required for the plasma to clot, normally about 12 seconds, reflects the activity of the extrinsic and common pathways and lengthens when the vitamin K dependent factors decline. To allow comparison between laboratories, the result is reported as the International Normalized Ratio (INR), calculated from the ratio of the patient prothrombin time to a normal control prothrombin time, raised to the power of the International Sensitivity Index (ISI) of the reagent. The distractors confuse the test with the aPTT or platelet count or misstate the calcium step. For the CRNA, the prothrombin time and INR are the standard monitors of warfarin therapy and of hepatic synthetic function. Guyton Ch. 37.", // source: Ch 37 slide 36
    scene: "hematology",
    sceneCfg: { label: "PROTHROMBIN TIME" },
    metadata: { topic: "Coagulation Testing", priority: "high" },
  },

];
