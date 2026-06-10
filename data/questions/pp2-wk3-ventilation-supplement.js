/**
 * BIOL-510-A Adv Phys and Pathophys II, Week 3 SUPPLEMENT (Ventilation)
 * Pulmonary Ventilation (Guyton and Hall 14e, Ch. 38)
 * Sourced from the Chapter 38 slides; every question cites its source page.
 * Supplements the Ch 38 ventilation content in the pp2-wk-3 node bank.
 * Authoring conventions: periods, commas, and semicolons only (no dashes as punctuation);
 * numeric ranges written with the word "to"; the four answer options are kept approximately equal length.
 */

export const PP2_WK3_VENTILATION_QUESTIONS = [

  /* ================================================================
     Overview, anatomy, notation, and gas laws
     ================================================================ */

  {
    id: "pp2-w3v-001",
    type: "mcq",
    prompt: "What is the primary goal of the respiratory system, and which functions accomplish it?",
    setup: "",
    ans: [
      { t: "To supply oxygen and remove carbon dioxide, by ventilation, its regulation, diffusion, and transport", ok: true },
      { t: "To warm and humidify inspired air, done mainly by the nasal conchae and the bronchial mucosa lining", ok: false },
      { t: "To regulate the blood pH by itself, done only by adjusting the plasma bicarbonate concentration up", ok: false },
      { t: "To filter foreign particles from blood, done by the alveolar macrophages and the resident mast cells", ok: false },
    ],
    rationale: "The primary goal of the respiratory system is to provide oxygen to the tissues and remove carbon dioxide. Four functions accomplish this: ventilation (movement of air in and out of the lungs), regulation of ventilation, diffusion of gases across the alveolar membrane, and transport of oxygen and carbon dioxide in the blood. Warming and humidifying air, acid base buffering, and macrophage clearance are secondary or supporting roles, not the primary goal. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 2
    scene: "pulmonary",
    sceneCfg: { label: "PURPOSE OF RESPIRATION" },
    metadata: { topic: "Respiratory Overview", priority: "high" },
  },

  {
    id: "pp2-w3v-002",
    type: "mcq",
    prompt: "Air passes through the conducting passages before reaching the gas-exchange surface. Which sequence is correct from the pharynx downward?",
    setup: "",
    ans: [
      { t: "Pharynx, then larynx with the vocal cords, then trachea, then the bronchi, and finally the alveoli", ok: true },
      { t: "Trachea, then pharynx, then larynx, then the alveoli, and finally the segmental bronchi branches", ok: false },
      { t: "Larynx, then trachea, then pharynx, then bronchi, and finally the conchae of the nasal cavity", ok: false },
      { t: "Bronchi, then alveoli, then trachea, then larynx, and finally the pharynx near the esophagus", ok: false },
    ],
    rationale: "Inspired air travels from the nose and pharynx through the larynx (which houses the vocal cords and the glottis), then the trachea, which divides at the carina into the right and left main bronchi, then progressively smaller bronchi and bronchioles, and finally reaches the alveoli where gas exchange occurs. Everything proximal to the alveoli is conducting (anatomic dead space); only the alveoli exchange gas. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 3
    scene: "pulmonary",
    sceneCfg: { label: "RESPIRATORY PASSAGES" },
    metadata: { topic: "Airway Anatomy", priority: "medium" },
  },

  {
    id: "pp2-w3v-003",
    type: "mcq",
    prompt: "In respiratory physiology notation, what do the symbols P, F, S, and C each represent?",
    setup: "",
    ans: [
      { t: "P is partial pressure, F is the fractional concentration, S is saturation, and C is the content", ok: true },
      { t: "P is perfusion, F is the flow rate, S is the shunt fraction, and C is the chest wall compliance", ok: false },
      { t: "P is pleural pressure, F is the forced volume, S is surfactant, and C is the carbon dioxide output", ok: false },
      { t: "P is plateau pressure, F is the FRC, S is the stroke volume, and C is the cardiac output per beat", ok: false },
    ],
    rationale: "The standard symbols are: P for partial pressure of a gas (PCO2 is the partial pressure of carbon dioxide), F for fractional concentration or pressure (FN2 is the nitrogen fraction), S for saturation as a decimal or percent (SO2 is the percent saturation of hemoglobin with oxygen), and C for concentration or content (the total amount carried). These letters combine with location subscripts to describe any gas in any compartment. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 5
    scene: "pulmonary",
    sceneCfg: { label: "STANDARD NOTATIONS" },
    metadata: { topic: "Notation", priority: "medium" },
  },

  {
    id: "pp2-w3v-004",
    type: "mcq",
    prompt: "In symbols such as PaCO2 and PAO2, what do the lowercase a and the uppercase A subscripts denote?",
    setup: "",
    ans: [
      { t: "Lowercase a is arterial blood, and uppercase A is the alveolar gas in the lung", ok: true },
      { t: "Lowercase a is the alveolar gas, and uppercase A is the arterial blood sample", ok: false },
      { t: "Lowercase a is mixed venous blood, and uppercase A is the inspired air mixture", ok: false },
      { t: "Lowercase a is the capillary blood, and uppercase A is the mixed expired air", ok: false },
    ],
    rationale: "Location subscripts identify the compartment: lowercase a means arterial blood (PaCO2 is arterial carbon dioxide partial pressure), uppercase A means alveolar gas (PAO2 is alveolar oxygen partial pressure). Other locations include v for mixed venous, c for pulmonary capillary, I for inspired gas, and E for mixed expired gas. Keeping the case straight matters because alveolar and arterial values differ and their gradient is clinically important. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 5
    scene: "pulmonary",
    sceneCfg: { label: "LOCATION SUBSCRIPTS" },
    metadata: { topic: "Notation", priority: "medium" },
  },

  {
    id: "pp2-w3v-005",
    type: "mcq",
    prompt: "The ideal gas law is written PV = nRT. What does each term represent?",
    setup: "",
    ans: [
      { t: "P is pressure, V is volume, n is the moles of gas, R is the gas constant, and T is temperature", ok: true },
      { t: "P is pressure, V is velocity, n is viscosity, R is resistance, and T is the elapsed flow time", ok: false },
      { t: "P is power, V is volume, n is the breath number, R is the radius, and T is the wall tension", ok: false },
      { t: "P is perfusion, V is volume, n is the density, R is the radius, and T is absolute temperature", ok: false },
    ],
    rationale: "In the ideal gas law PV = nRT, P is the gas pressure (atmospheres), V is the volume in which the gas is contained (liters), n is the number of moles of gas, R is the universal gas constant, and T is the absolute temperature in kelvin. Rearranged as P = nRT/V, it shows that for a fixed amount of gas at constant temperature, pressure is proportional to 1/V, which is Boyle's law. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 6
    scene: "pulmonary",
    sceneCfg: { label: "IDEAL GAS LAW" },
    metadata: { topic: "Gas Laws", priority: "high" },
  },

  {
    id: "pp2-w3v-006",
    type: "mcq",
    prompt: "According to Boyle's law, at constant temperature and amount of gas, how do pressure and volume relate?",
    setup: "",
    ans: [
      { t: "Pressure and volume are inversely related, so when the volume falls the pressure rises", ok: true },
      { t: "Pressure and volume are directly related, so when the volume falls the pressure also falls", ok: false },
      { t: "Pressure and volume are unrelated, so changing the volume has no effect on the pressure", ok: false },
      { t: "Pressure equals the volume squared, so halving the volume cuts the pressure to one quarter", ok: false },
    ],
    rationale: "Boyle's law states that for a given quantity of gas at constant temperature, pressure is inversely proportional to volume (P1V1 = P2V2). When the lung volume increases during inspiration the alveolar pressure falls below atmospheric, and air flows in; when volume decreases during expiration the alveolar pressure rises above atmospheric, and air flows out. This inverse relationship is the basis for how the chest wall and diaphragm move air. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 6
    scene: "pulmonary",
    sceneCfg: { label: "BOYLE'S LAW" },
    metadata: { topic: "Gas Laws", priority: "high" },
  },

  {
    id: "pp2-w3v-007",
    type: "mcq",
    prompt: "During quiet inspiration, how does Boyle's law explain air flow into the alveoli?",
    setup: "",
    ans: [
      { t: "The chest expands and alveolar volume rises, so alveolar pressure falls below atmospheric and air flows in", ok: true },
      { t: "The chest contracts and alveolar volume falls, so the alveolar pressure rises and air is pushed outward", ok: false },
      { t: "The alveoli actively pump air inward using their cilia, with no change in the alveolar gas pressure", ok: false },
      { t: "Atmospheric pressure drops below the alveolar pressure, which then drives air outward up the gradient", ok: false },
    ],
    rationale: "Inspiration begins when the diaphragm and external intercostals enlarge the thorax. By Boyle's law, increasing the volume of the alveoli lowers the alveolar pressure to about negative 1 cm H2O, below atmospheric pressure, so air flows in down the pressure gradient. During expiration the volume falls and alveolar pressure rises to about positive 1 cm H2O, pushing air out. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 9
    scene: "pulmonary",
    sceneCfg: { label: "INSPIRATION AND BOYLE'S LAW" },
    metadata: { topic: "Mechanics", priority: "high" },
  },

  {
    id: "pp2-w3v-008",
    type: "mcq",
    prompt: "Dalton's law of partial pressures describes a gas mixture. Which statement is correct?",
    setup: "",
    ans: [
      { t: "Each gas exerts a pressure independent of the others, and the total is the sum of the partial pressures", ok: true },
      { t: "Each gas exerts a pressure that depends on the others, and the total equals the largest single partial", ok: false },
      { t: "All gases share one common pressure equally, so each partial pressure is the total divided evenly out", ok: false },
      { t: "The total pressure is the product of the partial pressures of every gas that is present in the mixture", ok: false },
    ],
    rationale: "Dalton's law states that in a gas mixture each gas exerts its own partial pressure independent of the pressures of the other gases, and the total pressure is the sum of those partial pressures. In atmospheric air, Patm = PH2O + PO2 + PN2 (plus trace gases), and the partial pressure of any gas equals its fractional concentration multiplied by the total pressure. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 10
    scene: "pulmonary",
    sceneCfg: { label: "DALTON'S LAW" },
    metadata: { topic: "Gas Laws", priority: "high" },
  },

  {
    id: "pp2-w3v-009",
    type: "mcq",
    prompt: "Fick's law describes gas diffusion across the respiratory membrane. Which relationship does it state?",
    setup: "",
    ans: [
      { t: "Diffusion rises with the area, the pressure gradient, and the diffusion coefficient, and falls with distance", ok: true },
      { t: "Diffusion rises with the membrane thickness and falls with the area and the partial pressure difference", ok: false },
      { t: "Diffusion depends only on the gas temperature and is independent of area, the gradient, and distance", ok: false },
      { t: "Diffusion rises only with the respiratory rate and is unaffected by surface area or the pressure gradient", ok: false },
    ],
    rationale: "Fick's law states that the rate of gas diffusion is directly proportional to the surface area, the partial pressure gradient across the membrane, and the diffusion coefficient of the gas, and inversely proportional to the thickness (distance) of the membrane. Gas diffusion equals Area times the pressure difference times the diffusion coefficient, divided by distance. A larger gradient and thinner membrane both speed diffusion. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 11
    scene: "pulmonary",
    sceneCfg: { label: "FICK'S LAW OF DIFFUSION" },
    metadata: { topic: "Gas Laws", priority: "high" },
  },

  {
    id: "pp2-w3v-010",
    type: "mcq",
    prompt: "Fick's law uses a diffusion coefficient. How is that coefficient determined for a gas?",
    setup: "",
    ans: [
      { t: "It equals the gas solubility divided by the square root of the gas molecular weight", ok: true },
      { t: "It equals the molecular weight divided by the square root of the gas solubility value", ok: false },
      { t: "It equals the gas solubility multiplied by the full molecular weight of that same gas", ok: false },
      { t: "It equals the membrane thickness divided by the square root of the alveolar surface area", ok: false },
    ],
    rationale: "The diffusion coefficient equals the solubility of the gas divided by the square root of its molecular weight. Because carbon dioxide is about 20 times more soluble than oxygen, it diffuses far faster across the respiratory membrane even though its molecular weight is slightly higher. This is why carbon dioxide retention generally reflects a ventilation problem rather than a diffusion problem. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 11
    scene: "pulmonary",
    sceneCfg: { label: "DIFFUSION COEFFICIENT" },
    metadata: { topic: "Gas Laws", priority: "medium" },
  },

  {
    id: "pp2-w3v-011",
    type: "mcq",
    prompt: "Several cell types make up the alveolar wall. Which pairing of cell to function is correct?",
    setup: "",
    ans: [
      { t: "Type II alveolar epithelial cells make surfactant, while type I cells form the thin exchange surface", ok: true },
      { t: "Type I alveolar epithelial cells make surfactant, while type II cells form the thin exchange surface", ok: false },
      { t: "The alveolar macrophages make the surfactant, while the mast cells form the thin gas exchange surface", ok: false },
      { t: "The capillary endothelial cells make surfactant, while the fibroblasts form the thin exchange surface", ok: false },
    ],
    rationale: "The alveolar wall contains capillary endothelial cells, type I alveolar epithelial cells (thin, flat cells forming the gas exchange surface), type II alveolar epithelial cells (which produce surfactant), plus fibroblasts, macrophages, and mast cells. Surfactant from the type II cells lowers surface tension and prevents alveolar collapse, which is why type II cell immaturity causes neonatal respiratory distress. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 12
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR CELL TYPES" },
    metadata: { topic: "Alveoli", priority: "high" },
  },

  {
    id: "pp2-w3v-012",
    type: "mcq",
    prompt: "During quiet inspiration, which muscle actions enlarge the thorax?",
    setup: "",
    ans: [
      { t: "The diaphragm contracts and descends while the external intercostals raise and expand the rib cage", ok: true },
      { t: "The diaphragm relaxes and rises while the internal intercostals contract, lowering the whole rib cage", ok: false },
      { t: "The abdominal muscles contract strongly while the diaphragm stays relaxed, compressing the thorax down", ok: false },
      { t: "Only the scalenes contract during quiet breathing while the diaphragm and intercostals stay fully at rest", ok: false },
    ],
    rationale: "Quiet inspiration is active: the diaphragm contracts and descends, and the external intercostals contract to elevate the rib cage, increasing both the vertical and the anteroposterior diameters of the thorax. Quiet expiration is normally passive, driven by elastic recoil. Accessory muscles such as the sternocleidomastoid and scalenes assist with forced inspiration, and the abdominal muscles and internal intercostals drive forced expiration. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 14
    scene: "pulmonary",
    sceneCfg: { label: "MECHANICS OF INSPIRATION" },
    metadata: { topic: "Mechanics", priority: "high" },
  },

  /* ================================================================
     Airway control, pressures, compliance, and surface tension
     ================================================================ */

  {
    id: "pp2-w3v-013",
    type: "mcq",
    prompt: "Quiet expiration is passive, but forced expiration is active. Which muscles drive forced expiration?",
    setup: "",
    ans: [
      { t: "The abdominal muscles and the internal intercostals contract to drive a forceful active expiration", ok: true },
      { t: "The diaphragm and the external intercostals contract to drive a forceful active expiration outward", ok: false },
      { t: "The scalenes and the sternocleidomastoid muscles contract to push the air out during forced breathing", ok: false },
      { t: "No muscles are involved at all, since even a forced expiration relies only on passive elastic recoil", ok: false },
    ],
    rationale: "Quiet expiration is passive, powered by the elastic recoil of the lungs and chest wall. Forced expiration becomes active: the abdominal muscles (rectus abdominis, external and internal obliques, transversus abdominis) contract to push the diaphragm up, and the internal intercostals pull the rib cage down. The diaphragm and external intercostals are inspiratory muscles, and the scalenes and sternocleidomastoid are accessory inspiratory muscles. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 15
    scene: "pulmonary",
    sceneCfg: { label: "MUSCLES OF EXPIRATION" },
    metadata: { topic: "Mechanics", priority: "medium" },
  },

  {
    id: "pp2-w3v-014",
    type: "mcq",
    prompt: "When breathing becomes labored, accessory muscles assist inspiration. Which muscles are these?",
    setup: "",
    ans: [
      { t: "The sternocleidomastoid and the scalenes, which lift the upper rib cage during forced inspiration", ok: true },
      { t: "The rectus abdominis and the internal oblique, which lift the rib cage during a forced inspiration", ok: false },
      { t: "The transversus abdominis and the internal intercostals, which lift the rib cage when breathing hard", ok: false },
      { t: "The diaphragm alone, since no accessory muscles ever assist inspiration even when breathing is labored", ok: false },
    ],
    rationale: "The accessory muscles of inspiration are the sternocleidomastoid and the scalenes, which elevate and fix the upper rib cage when ventilatory demand is high. The diaphragm and external intercostals do the work of quiet inspiration. The abdominal muscles and internal intercostals are expiratory muscles. Visible use of accessory muscles is a clinical sign of respiratory distress. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 15
    scene: "pulmonary",
    sceneCfg: { label: "ACCESSORY INSPIRATORY MUSCLES" },
    metadata: { topic: "Mechanics", priority: "medium" },
  },

  {
    id: "pp2-w3v-015",
    type: "mcq",
    prompt: "Autonomic nerves control bronchiolar diameter. How do the sympathetic and parasympathetic systems act?",
    setup: "",
    ans: [
      { t: "Sympathetic beta-2 receptors dilate the bronchioles, while parasympathetic acetylcholine constricts them", ok: true },
      { t: "Sympathetic beta-2 receptors constrict the bronchioles, while parasympathetic acetylcholine dilates them", ok: false },
      { t: "Both the sympathetic and the parasympathetic systems constrict the bronchioles to about the same degree", ok: false },
      { t: "Both the sympathetic and the parasympathetic systems dilate the bronchioles to about the same degree", ok: false },
    ],
    rationale: "Sympathetic stimulation acts on beta-2 receptors in bronchiolar smooth muscle to cause bronchodilation, while parasympathetic stimulation releases acetylcholine that causes bronchoconstriction. This is the basis for treating bronchospasm with beta-2 agonists and anticholinergics. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 16
    scene: "pulmonary",
    sceneCfg: { label: "BRONCHIOLAR NERVE CONTROL" },
    metadata: { topic: "Airway Control", priority: "high" },
  },

  {
    id: "pp2-w3v-016",
    type: "mcq",
    prompt: "Besides nerves, circulating substances change bronchiolar diameter. Which pairing is correct?",
    setup: "",
    ans: [
      { t: "Histamine and acetylcholine constrict the bronchioles, while the beta agonists relax and dilate them", ok: true },
      { t: "Histamine and acetylcholine dilate the bronchioles, while the beta agonists constrict the airways more", ok: false },
      { t: "Beta agonists and histamine both constrict the bronchioles, while acetylcholine dilates the airways", ok: false },
      { t: "Only carbon dioxide changes the bronchiolar diameter, and no humoral mediator has any real effect", ok: false },
    ],
    rationale: "Humoral mediators also regulate airway tone. Histamine and acetylcholine constrict the bronchioles, while adrenergic beta agonists relax the smooth muscle and dilate the airways. Histamine release during allergic and asthmatic responses contributes to bronchospasm, which beta agonists reverse. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 16
    scene: "pulmonary",
    sceneCfg: { label: "HUMORAL AIRWAY CONTROL" },
    metadata: { topic: "Airway Control", priority: "high" },
  },

  {
    id: "pp2-w3v-017",
    type: "mcq",
    prompt: "What are the approximate pleural and alveolar pressures at rest and during inspiration?",
    setup: "",
    ans: [
      { t: "Pleural is about negative 5 at rest and negative 8 on inspiration; alveolar is 0 then negative 1", ok: true },
      { t: "Pleural is about positive 5 at rest and positive 8 on inspiration; alveolar is 0 then positive 1", ok: false },
      { t: "Pleural is about 0 at rest and positive 5 on inspiration; alveolar is negative 8 then negative 1", ok: false },
      { t: "Pleural and alveolar are both about 0 at rest and stay at 0 throughout the entire breath cycle", ok: false },
    ],
    rationale: "Pleural pressure is normally subatmospheric, about negative 5 cm H2O at rest, becoming more negative to about negative 8 cm H2O during inspiration as the chest expands. Alveolar pressure is 0 cm H2O at rest (equal to atmospheric), falls to about negative 1 cm H2O during inspiration to draw air in, and rises to about positive 1 cm H2O during expiration to push air out. The negative pleural pressure is what holds the lung expanded against the chest wall. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 18
    scene: "pulmonary",
    sceneCfg: { label: "PLEURAL AND ALVEOLAR PRESSURES" },
    metadata: { topic: "Mechanics", priority: "high" },
  },

  {
    id: "pp2-w3v-018",
    type: "mcq",
    prompt: "Lung compliance is the change in volume per change in pressure. What is the normal value, and what is transpulmonary pressure?",
    setup: "",
    ans: [
      { t: "Compliance is about 200 mL per cm H2O, and transpulmonary pressure is alveolar minus pleural pressure", ok: true },
      { t: "Compliance is about 20 mL per cm H2O, and transpulmonary pressure is pleural minus alveolar pressure", ok: false },
      { t: "Compliance is about 2000 mL per cm H2O, and transpulmonary pressure is alveolar plus pleural pressure", ok: false },
      { t: "Compliance is about 200 mL per cm H2O, and transpulmonary pressure equals the full atmospheric pressure", ok: false },
    ],
    rationale: "Lung compliance, the change in volume per unit change in pressure (delta V over delta P), is normally about 200 mL per cm H2O. Transpulmonary pressure is the distending pressure across the lung, equal to alveolar pressure minus pleural pressure; it is what the elastic recoil of the lung opposes. A stiffer lung (lower compliance) requires a larger transpulmonary pressure to achieve the same volume change. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 18
    scene: "pulmonary",
    sceneCfg: { label: "COMPLIANCE AND TRANSPULMONARY PRESSURE" },
    metadata: { topic: "Mechanics", priority: "high" },
  },

  /* ================================================================
     Surface tension, lung volumes, and dead space
     ================================================================ */

  {
    id: "pp2-w3v-019",
    type: "mcq",
    prompt: "Lung compliance is set by two elastic forces. What are they, and which contributes most to alveolar recoil?",
    setup: "",
    ans: [
      { t: "Lung tissue elasticity and surface tension; the surface tension at the air water interface adds the most", ok: true },
      { t: "Airway resistance and blood viscosity; the blood viscosity in the lung capillaries adds the most recoil", ok: false },
      { t: "Chest wall weight and gravity; the downward pull of gravity on the lung tissue adds the most to recoil", ok: false },
      { t: "Pleural fluid volume and rib stiffness; the stiffness of the ribs adds the most to the alveolar recoil", ok: false },
    ],
    rationale: "Lung compliance is determined by two elastic forces: the elasticity of the lung tissue itself and the surface tension of the fluid lining the alveoli. Surface tension at the air to fluid interface accounts for roughly two thirds of the recoil; this is shown by the fact that a saline filled lung, which has no air interface, is far more compliant. Surfactant lowers this surface tension. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 23
    scene: "pulmonary",
    sceneCfg: { label: "DETERMINANTS OF COMPLIANCE" },
    metadata: { topic: "Compliance", priority: "high" },
  },

  {
    id: "pp2-w3v-020",
    type: "mcq",
    prompt: "Surfactant reduces alveolar surface tension. Which statement about it is correct?",
    setup: "",
    ans: [
      { t: "It is made by type II alveolar cells and lowers surface tension, helping to prevent alveolar collapse", ok: true },
      { t: "It is made by type I alveolar cells and raises surface tension, helping to keep the alveoli open wide", ok: false },
      { t: "It is made by alveolar macrophages and raises surface tension, which tends to collapse the alveoli", ok: false },
      { t: "It is made by the capillary endothelium and has no measurable effect on the alveolar surface tension", ok: false },
    ],
    rationale: "Surfactant is a detergent like substance secreted by type II alveolar epithelial cells. It interferes with the hydrogen bonding between water molecules at the alveolar surface, reducing surface tension at the air to fluid interface. By lowering surface tension, surfactant increases compliance, prevents collapse of small alveoli, and keeps alveoli of different sizes stable. Its deficiency in premature infants causes respiratory distress syndrome. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 24
    scene: "pulmonary",
    sceneCfg: { label: "SURFACTANT" },
    metadata: { topic: "Compliance", priority: "high" },
  },

  {
    id: "pp2-w3v-021",
    type: "mcq",
    prompt: "A lung filled with saline is far more compliant than the same lung filled with air. Why?",
    setup: "",
    ans: [
      { t: "Saline removes the air to fluid interface, eliminating surface tension so only tissue elasticity remains", ok: true },
      { t: "Saline adds a second air to fluid interface, which roughly doubles the surface tension in the alveoli", ok: false },
      { t: "Saline stiffens the lung tissue itself, so a much higher pressure is needed to reach the same volume", ok: false },
      { t: "Saline washes out all of the surfactant, which sharply raises the surface tension throughout the lung", ok: false },
    ],
    rationale: "Filling the lung with saline abolishes the air to fluid interface, so surface tension is eliminated and only the elastic recoil of the lung tissue remains. The saline filled lung therefore requires much less pressure to inflate to a given volume than the air filled lung. This experiment demonstrates that surface tension, not tissue elasticity, is the larger component of normal lung recoil. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 25
    scene: "pulmonary",
    sceneCfg: { label: "SALINE VERSUS AIR FILLED LUNG" },
    metadata: { topic: "Compliance", priority: "medium" },
  },

  {
    id: "pp2-w3v-022",
    type: "mcq",
    prompt: "Lung disease shifts the pressure-volume curve. How do emphysema and fibrosis change compliance?",
    setup: "",
    ans: [
      { t: "Emphysema raises compliance, so the lung overfills easily; fibrosis lowers it, so the lung is stiff", ok: true },
      { t: "Emphysema lowers compliance, so the lung is stiff; fibrosis raises it, so the lung overfills easily", ok: false },
      { t: "Both emphysema and fibrosis raise compliance, so the lung overfills very easily in either disease", ok: false },
      { t: "Both emphysema and fibrosis lower compliance equally, so the lung is equally stiff in both diseases", ok: false },
    ],
    rationale: "Emphysema destroys elastic tissue, so compliance increases and the lung overdistends easily but recoils poorly, trapping air. Fibrosis stiffens the lung, so compliance decreases and a much larger pressure is needed to inflate it. On the pressure to volume curve, emphysema sits above the normal line and fibrosis below it. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 26
    scene: "pulmonary",
    sceneCfg: { label: "COMPLIANCE IN DISEASE" },
    metadata: { topic: "Compliance", priority: "high" },
  },

  {
    id: "pp2-w3v-023",
    type: "mcq",
    prompt: "Lung capacities are sums of lung volumes. Which definition is correct?",
    setup: "",
    ans: [
      { t: "Functional residual capacity is the expiratory reserve plus the residual volume left after a quiet breath", ok: true },
      { t: "Vital capacity is the tidal volume plus the residual volume that remains after a maximal full expiration", ok: false },
      { t: "Total lung capacity is the inspiratory reserve volume minus the residual volume of the whole lung field", ok: false },
      { t: "Tidal volume is the largest volume that can be exhaled after a maximal inspiration to the total capacity", ok: false },
    ],
    rationale: "Capacities are combinations of the four volumes. Functional residual capacity is the expiratory reserve volume plus the residual volume, the gas left in the lungs after a normal quiet expiration (about 2400 mL). Vital capacity is the inspiratory reserve plus tidal plus expiratory reserve volume, the most that can be exhaled after a maximal inspiration. Total lung capacity is vital capacity plus residual volume (about 6000 mL). Tidal volume is the normal quiet breath, about 500 mL. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 27
    scene: "pulmonary",
    sceneCfg: { label: "LUNG VOLUMES AND CAPACITIES" },
    metadata: { topic: "Lung Volumes", priority: "high" },
  },

  {
    id: "pp2-w3v-024",
    type: "mcq",
    prompt: "Anatomic dead space is about 150 mL. How do minute ventilation and alveolar ventilation differ?",
    setup: "",
    ans: [
      { t: "Minute ventilation is tidal volume times rate; alveolar ventilation subtracts dead space, then times rate", ok: true },
      { t: "Minute ventilation subtracts dead space first; alveolar ventilation uses the full tidal volume times rate", ok: false },
      { t: "Both equal tidal volume times rate, so the dead space has no effect on either ventilation calculation", ok: false },
      { t: "Alveolar ventilation is always larger than minute ventilation because it adds the dead space back in too", ok: false },
    ],
    rationale: "Minute respiratory volume (minute ventilation) is the tidal volume multiplied by the respiratory rate, the total air moved per minute. Alveolar ventilation subtracts the dead space first: it equals tidal volume minus dead space, multiplied by the rate. Anatomic dead space (the conducting airways, about 150 mL) plus any alveolar dead space gives the physiologic dead space, whose size depends on the ventilation to perfusion ratio. Because dead space air does not reach the alveoli, alveolar ventilation is always less than minute ventilation. Source: Chapter 38, Guyton and Hall 14e.", // source: Ch 38 p 29
    scene: "pulmonary",
    sceneCfg: { label: "DEAD SPACE AND VENTILATION" },
    metadata: { topic: "Ventilation", priority: "high" },
  },

  /* coverage gap-fill (Ch 38 to 43) */

  {
    id: "pp2-w3v-025",
    type: "mcq",
    prompt: "Air leaving the trachea reaches the gas exchange units through a branching tree. Which statement about the lower conducting structures is correct?",
    setup: "",
    ans: [
      { t: "The carina is where the trachea splits into two main bronchi", ok: true },
      { t: "The carina is the first branch point inside each lung lobe", ok: false },
      { t: "The main bronchi arise directly from the laryngeal cartilage", ok: false },
      { t: "The trachea divides into terminal bronchioles at the carina", ok: false },
    ],
    rationale: "The carina marks the bifurcation of the trachea into the right and left main, or primary, bronchi. Each main bronchus then branches into lobar and segmental bronchi and progressively smaller bronchioles before reaching the alveoli. The larynx lies above the trachea, not where the bronchi originate, and terminal bronchioles are many generations distal to the carina.", // source: Ch 38 p 4
    scene: "pulmonary",
    sceneCfg: { label: "CARINA AND BRONCHI" },
    metadata: { topic: "lower-airway-anatomy", priority: "medium" },
  },

  {
    id: "pp2-w3v-026",
    type: "mcq",
    prompt: "Two serous membranes surround each lung. Which pairing of pleural layer to location is correct?",
    setup: "",
    ans: [
      { t: "Visceral pleura covers the lung; parietal lines the chest wall", ok: true },
      { t: "Visceral pleura lines the rib cage and also covers the diaphragm fully", ok: false },
      { t: "Parietal pleura adheres directly onto the alveolar gas surface", ok: false },
      { t: "Parietal pleura is the inner layer touching the lung tissue", ok: false },
    ],
    rationale: "The visceral pleura is the inner layer that adheres to and covers the lung surface itself, while the parietal pleura is the outer layer that lines the chest wall, diaphragm, and mediastinum. The thin fluid filled pleural space between them couples the lung to the chest wall and is the site of the subatmospheric pleural pressure.", // source: Ch 38 p 4
    scene: "pulmonary",
    sceneCfg: { label: "PLEURAL LAYERS" },
    metadata: { topic: "pleural-membranes", priority: "medium" },
  },

  {
    id: "pp2-w3v-027",
    type: "mcq",
    prompt: "An anatomy diagram of the upper airway labels several structures above the trachea. Which statement about these structures is correct?",
    setup: "",
    ans: [
      { t: "The epiglottis covers the larynx during swallowing", ok: true },
      { t: "The conchae sit within the larynx beside the vocal cords", ok: false },
      { t: "The glottis is the opening into the esophagus", ok: false },
      { t: "The vocal cords lie within the trachea itself", ok: false },
    ],
    rationale: "The epiglottis is a flap that folds down over the laryngeal opening, or glottis, during swallowing to keep food out of the airway. The conchae are bony shelves in the nasal cavity, not the larynx. The glottis is the opening into the larynx and trachea, not the esophagus, and the vocal cords lie within the larynx, above the trachea.", // source: Ch 38 p 3
    scene: "pulmonary",
    sceneCfg: { label: "UPPER AIRWAY" },
    metadata: { topic: "upper-airway-structures", priority: "medium" },
  },

  {
    id: "pp2-w3v-028",
    type: "mcq",
    prompt: "During quiet inspiration the chest cavity enlarges in more than one dimension. Which change occurs as the thorax expands?",
    setup: "",
    ans: [
      { t: "Anteroposterior and vertical diameters both increase", ok: true },
      { t: "The rib cage drops and the sternum swings backward", ok: false },
      { t: "Only the side to side diameter increases as ribs fall", ok: false },
      { t: "The diaphragm rises and shortens the vertical axis", ok: false },
    ],
    rationale: "External intercostal contraction elevates the rib cage and swings the sternum upward and forward, increasing the anteroposterior diameter, while diaphragmatic contraction flattens the dome and lengthens the vertical, or cephalocaudal, diameter. Both effects raise thoracic volume, which by Boyle law lowers alveolar pressure and draws air in. The diaphragm descends rather than rises during inspiration.", // source: Ch 38 p 14
    scene: "pulmonary",
    sceneCfg: { label: "THORAX DIMENSIONS" },
    metadata: { topic: "thoracic-cage-mechanics", priority: "high" },
  },

  {
    id: "pp2-w3v-029",
    type: "mcq",
    prompt: "Resistance is not uniform along the bronchial tree. Where is airway resistance greatest?",
    setup: "",
    ans: [
      { t: "In the medium sized bronchi of the larger airways", ok: true },
      { t: "In the smallest terminal bronchioles far downstream", ok: false },
      { t: "In the alveolar ducts at the gas exchange surface", ok: false },
      { t: "Evenly spread across every airway generation", ok: false },
    ],
    rationale: "Although each small bronchiole has a tiny lumen, the small airways branch into an enormous number that run in parallel, so their combined cross sectional area is huge and their summed resistance is low. The greatest resistance therefore lies in the medium sized bronchi of the first several generations, where total cross sectional area is still relatively small.", // source: Ch 38 p 17
    scene: "pulmonary",
    sceneCfg: { label: "RESISTANCE SITE" },
    metadata: { topic: "airway-resistance-distribution", priority: "high" },
  },

  {
    id: "pp2-w3v-030",
    type: "mcq",
    prompt: "During a forced expiration a patient with floppy airways cannot increase flow by pushing harder. Which mechanism explains this?",
    setup: "",
    ans: [
      { t: "High pleural pressure compresses airways and caps flow", ok: true },
      { t: "Surfactant dissolves and seals the small bronchioles shut", ok: false },
      { t: "Radial traction widens airways more as effort rises", ok: false },
      { t: "Alveolar pressure falls below pleural pressure on effort", ok: false },
    ],
    rationale: "In forced expiration the strongly positive pleural pressure is transmitted around the intrathoracic airways. At a point downstream the pressure inside the airway falls below the surrounding pleural pressure, so the airway is compressed, or dynamically collapsed. Pushing harder raises both the driving and the compressing pressure equally, so flow cannot increase. This is dynamic airway compression.", // source: Ch 38 p 21
    scene: "pulmonary",
    sceneCfg: { label: "DYNAMIC COMPRESSION" },
    metadata: { topic: "dynamic-airway-compression", priority: "high" },
  },

  {
    id: "pp2-w3v-031",
    type: "mcq",
    prompt: "On a maximal expiratory flow volume curve, once the curve is reached, harder effort does not raise flow over most of the vital capacity. This behavior is best described as which property?",
    setup: "",
    ans: [
      { t: "Flow is effort independent over most of the range", ok: true },
      { t: "Flow is set only by airway surfactant content", ok: false },
      { t: "Flow rises in direct proportion to the effort used", ok: false },
      { t: "Flow is limited only by the inspiratory muscles", ok: false },
    ],
    rationale: "Beyond a modest level of effort, maximal expiratory flow is governed by dynamic compression rather than by muscular force, so additional effort cannot increase it. Over most of the vital capacity the flow is therefore effort independent and depends instead on lung elastic recoil and airway resistance. This is why the descending limb of the maximal flow volume curve is reproducible.", // source: Ch 38 p 22
    scene: "pulmonary",
    sceneCfg: { label: "EFFORT INDEPENDENCE" },
    metadata: { topic: "effort-independent-flow", priority: "medium" },
  },

  {
    id: "pp2-w3v-032",
    type: "mcq",
    prompt: "A pressure volume loop of the lung shows that the inspiratory path does not retrace the expiratory path. What is this property called and what mainly causes it?",
    setup: "",
    ans: [
      { t: "Hysteresis, caused largely by surface tension", ok: true },
      { t: "Compliance, caused by airway resistance alone", ok: false },
      { t: "Hysteresis, caused only by airway collapse", ok: false },
      { t: "Elastance, caused by rising blood flow in lung", ok: false },
    ],
    rationale: "Hysteresis is the difference between the inflation and deflation limbs of the pressure volume loop, so the lung holds more volume at a given pressure during deflation than during inflation. It arises mainly from surface tension at the air liquid interface and the recruitment of surfactant, which is why a saline filled lung shows almost no hysteresis.", // source: Ch 38 p 23
    scene: "pulmonary",
    sceneCfg: { label: "HYSTERESIS" },
    metadata: { topic: "pressure-volume-hysteresis", priority: "medium" },
  },

  {
    id: "pp2-w3v-033",
    type: "mcq",
    prompt: "Two airways with the same anatomy can have different physiologic dead space at different times. What determines the size of the physiologic dead space?",
    setup: "",
    ans: [
      { t: "The ventilation perfusion ratio of the lung units", ok: true },
      { t: "The tidal volume divided by the resting heart rate value", ok: false },
      { t: "The diameter of the trachea during inspiration", ok: false },
      { t: "The amount of surfactant lining the alveoli", ok: false },
    ],
    rationale: "Physiologic dead space is the anatomic dead space plus alveolar dead space, the latter being alveoli that are ventilated but poorly perfused. When the ventilation perfusion ratio is high in some units, those alveoli receive air that cannot exchange gas, enlarging the physiologic dead space. In healthy lungs physiologic dead space nearly equals anatomic dead space.", // source: Ch 38 p 31
    scene: "pulmonary",
    sceneCfg: { label: "DEAD SPACE AND VQ" },
    metadata: { topic: "physiologic-dead-space-vq", priority: "high" },
  },

  {
    id: "pp2-w3v-034",
    type: "mcq",
    prompt: "Compliance is reported in cm of water in this chapter. About how does 1 cm of water compare to mm Hg?",
    setup: "",
    ans: [
      { t: "1 cm water is about 0.7 mm Hg", ok: true },
      { t: "1 cm water is about 7.4 mm Hg", ok: false },
      { t: "1 cm water is about 13 mm Hg", ok: false },
      { t: "1 cm water equals exactly 1 mm Hg", ok: false },
    ],
    rationale: "Because mercury is roughly 13.6 times denser than water, a column of water exerts far less pressure than the same height of mercury, so 1 cm of water equals about 0.74 mm Hg. Respiratory pressures are quoted in cm of water because the values are small, while blood pressures are quoted in mm Hg.", // source: Ch 38 p 18
    scene: "pulmonary",
    sceneCfg: { label: "PRESSURE UNITS" },
    metadata: { topic: "pressure-unit-conversion", priority: "medium" },
  },

  {
    id: "pp2-w3v-035",
    type: "mcq",
    prompt: "Movement of the vocal cords is controlled by intrinsic laryngeal muscles. Which muscle abducts the cords to open the glottis for breathing?",
    setup: "",
    ans: [
      { t: "Posterior cricoarytenoid", ok: true },
      { t: "Lateral cricoarytenoid", ok: false },
      { t: "Transverse arytenoid pair", ok: false },
      { t: "Thyroarytenoid muscle", ok: false },
    ],
    rationale: "The posterior cricoarytenoid is the only muscle that abducts the vocal cords, rotating the arytenoid cartilages to widen the glottis for airflow. The lateral cricoarytenoid and the transverse arytenoid adduct the cords, and the thyroarytenoid adjusts cord tension. Loss of the posterior cricoarytenoid can dangerously narrow the airway.", // source: Ch 38 p 32
    scene: "pulmonary",
    sceneCfg: { label: "VOCAL CORD ABDUCTION" },
    metadata: { topic: "laryngeal-muscle-abduction", priority: "medium" },
  },

  {
    id: "pp2-w3v-036",
    type: "mcq",
    prompt: "During phonation the larynx changes the position of the vocal cords. Which cord position is required to produce voiced sound?",
    setup: "",
    ans: [
      { t: "The cords are adducted near the midline", ok: true },
      { t: "The cords are fully abducted and held wide", ok: false },
      { t: "The cords are removed from the air stream", ok: false },
      { t: "The cords are pulled into the trachea below", ok: false },
    ],
    rationale: "Phonation requires the vocal cords to be brought together, or adducted, near the midline so that expired air sets them vibrating. Full abduction widens the glottis for quiet breathing and produces no sound, while intermediate openings yield whispering. The pitch and loudness are then adjusted by changing cord tension and airflow.", // source: Ch 38 p 32
    scene: "pulmonary",
    sceneCfg: { label: "PHONATION POSITION" },
    metadata: { topic: "phonation-cord-position", priority: "medium" },
  },

  {
    id: "pp2-w3v-037",
    type: "mcq",
    prompt: "During inspiration the resistance of the intrathoracic airways falls. Which mechanism best accounts for this widening?",
    setup: "",
    ans: [
      { t: "Radial traction from more negative pleural pressure", ok: true },
      { t: "Positive pleural pressure squeezing the airways wide open", ok: false },
      { t: "Surfactant pushing the airway walls apart", ok: false },
      { t: "Acetylcholine release relaxing airway muscle", ok: false },
    ],
    rationale: "As the chest expands, pleural pressure becomes more subatmospheric and is transmitted around the intrathoracic airways, pulling their walls outward by radial traction from the surrounding lung tissue. This widens the airways and lowers resistance during inspiration, the opposite of the dynamic compression seen in forced expiration. Acetylcholine actually constricts airways.", // source: Ch 38 p 20
    scene: "pulmonary",
    sceneCfg: { label: "RADIAL TRACTION" },
    metadata: { topic: "airway-radial-traction", priority: "medium" },
  },

];
