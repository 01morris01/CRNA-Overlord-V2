/**
 * Chemistry & Physics for Anesthesia — Node 7
 * States of Matter & Phase Changes
 *
 * Topics: solid/liquid/gas, phase transitions, latent heat of vaporization,
 * boiling point and altitude, vapor pressure, critical temperature,
 * desflurane heated vaporizer, physical vs chemical changes.
 *
 * Source: NAS 510 States of Matter Lecture
 */

export const CP_NODE7_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // STATES OF MATTER & PHASE CHANGES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n7-001",
    type: "mcq",
    prompt: "Which state of matter has particles with the HIGHEST kinetic energy and the weakest intermolecular forces?",
    setup: "",
    ans: [
      { t: "Gas — particles move freely with high kinetic energy and negligible intermolecular forces", ok: true  },
      { t: "Liquid — particles slide past each other with moderate energy and moderate attraction",     ok: false },
      { t: "Solid — particles vibrate in fixed positions with minimal kinetic energy and strong bonds",  ok: false },
      { t: "Plasma — but plasma does not exist under physiologic conditions so it is not relevant",      ok: false },
    ],
    rationale: "In the gas state, particles have the greatest kinetic energy and move randomly with minimal intermolecular forces. Liquids have intermediate energy with particles that slide past each other. Solids have the lowest kinetic energy with particles locked in fixed positions by strong intermolecular forces. Understanding these states is fundamental to how volatile anesthetics vaporize and how gases behave in the breathing circuit.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "States of Matter", priority: "medium" },
  },

  {
    id: "cp-n7-002",
    type: "multi",
    prompt: "Select the THREE phase changes that require the INPUT of energy (endothermic transitions):",
    setup: "",
    choices: [
      "Melting — solid to liquid transition at the melting point temperature",
      "Vaporization — liquid to gas transition at the boiling point or surface",
      "Sublimation — solid directly to gas without passing through liquid phase",
      "Condensation — gas to liquid transition releasing latent heat of vaporization",
      "Deposition — gas directly to solid without passing through the liquid phase",
    ],
    correctAnswers: [
      "Melting — solid to liquid transition at the melting point temperature",
      "Vaporization — liquid to gas transition at the boiling point or surface",
      "Sublimation — solid directly to gas without passing through liquid phase",
    ],
    selectCount: 3,
    rationale: "Phase changes that increase particle energy (moving toward the gas state) are endothermic: melting (solid → liquid), vaporization (liquid → gas), and sublimation (solid → gas). The reverse transitions — freezing, condensation, and deposition — release energy (exothermic). In anesthesia, vaporization of liquid anesthetic in the vaporizer absorbs heat, which is why vaporizers require temperature compensation mechanisms.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Phase Changes", priority: "medium" },
  },

  {
    id: "cp-n7-003",
    type: "mcq",
    prompt: "During vaporization of a liquid anesthetic, the temperature of the remaining liquid drops even though heat is being absorbed. What is this absorbed energy called?",
    setup: "",
    ans: [
      { t: "Latent heat of vaporization — energy used to break intermolecular bonds, not raise temperature", ok: true  },
      { t: "Specific heat capacity — energy required to raise one gram of the substance by one degree Celsius", ok: false },
      { t: "Sensible heat — the measurable temperature change detected by a standard laboratory thermometer",   ok: false },
      { t: "Activation energy — the energy barrier that must be overcome to initiate a chemical reaction",      ok: false },
    ],
    rationale: "Latent heat of vaporization is the energy absorbed during the liquid-to-gas transition WITHOUT a change in temperature. The energy breaks intermolecular bonds rather than increasing kinetic energy. In a vaporizer, as liquid sevoflurane evaporates it cools the remaining liquid, which would decrease vapor output if uncompensated. Variable-bypass vaporizers use bimetallic strip or electronic temperature compensation to maintain consistent output.",
    scene: "gas_piston",
    sceneCfg: { label: "LATENT HEAT — NO TEMP CHANGE" },
    metadata: { topic: "Latent Heat", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BOILING POINT, VAPOR PRESSURE, CRITICAL TEMPERATURE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n7-004",
    type: "mcq",
    prompt: "Water boils at 100°C at sea level but at a lower temperature on a mountain summit. Which statement best explains this observation?",
    setup: "",
    ans: [
      { t: "Lower atmospheric pressure at altitude reduces the boiling point — less pressure to overcome", ok: true  },
      { t: "Colder ambient temperature at the mountain summit directly lowers the boiling point of water", ok: false },
      { t: "Wind at altitude removes heat faster, preventing the water from reaching its true boiling point", ok: false },
      { t: "Decreased oxygen concentration at altitude chemically alters water's hydrogen bonding network",  ok: false },
    ],
    rationale: "A liquid boils when its vapor pressure equals the ambient atmospheric pressure. At altitude, atmospheric pressure is lower, so less vapor pressure is needed to reach the boiling point — the liquid boils at a lower temperature. This principle is critical for desflurane: its boiling point (22.8°C) is near room temperature at sea level, and at altitude (lower Patm) it would boil even more readily, making conventional vaporizers unreliable.",
    scene: "gas_piston",
    sceneCfg: { label: "BOILING POINT vs ALTITUDE" },
    metadata: { topic: "Boiling Point", priority: "high" },
  },

  {
    id: "cp-n7-005",
    type: "mcq",
    prompt: "Vapor pressure is the pressure exerted by a vapor in equilibrium with its liquid. A volatile anesthetic with a HIGHER vapor pressure at a given temperature is described as:",
    setup: "",
    ans: [
      { t: "More volatile — it evaporates more readily and produces more vapor molecules at that temperature", ok: true  },
      { t: "Less volatile — higher pressure means the molecules are compressed and less likely to escape",     ok: false },
      { t: "More potent — vapor pressure directly determines the MAC value of any inhalational anesthetic",    ok: false },
      { t: "More viscous — the higher pressure increases internal resistance to flow within the liquid phase",  ok: false },
    ],
    rationale: "Vapor pressure reflects how readily a liquid evaporates. Higher vapor pressure = more volatile (molecules escape the liquid phase more easily). Desflurane has the highest VP among common volatile agents (~669 mmHg at 20°C), making it the most volatile. Vapor pressure determines how much agent a vaporizer can deliver, but potency (MAC) is a separate pharmacologic property — desflurane is volatile but has a high MAC (6.0%).",
    scene: "gas_piston",
    sceneCfg: { label: "HIGHER VP = MORE VOLATILE" },
    metadata: { topic: "Vapor Pressure", priority: "high" },
  },

  {
    id: "cp-n7-006",
    type: "mcq",
    prompt: "The critical temperature of nitrous oxide is 36.5°C. What is the clinical significance of this value for N₂O cylinder storage?",
    setup: "",
    ans: [
      { t: "Below 36.5°C, N₂O exists as liquid and gas in the cylinder; above it, only gas remains regardless of pressure", ok: true  },
      { t: "Below 36.5°C, N₂O is entirely gaseous in the cylinder and cannot be stored in compressed liquid form at all",   ok: false },
      { t: "At exactly 36.5°C, N₂O undergoes irreversible decomposition into nitrogen and oxygen inside the cylinder",      ok: false },
      { t: "Above 36.5°C, N₂O becomes a supercooled liquid that cannot vaporize until the cylinder is manually vented",     ok: false },
    ],
    rationale: "Critical temperature is the temperature above which a gas cannot be liquefied by pressure alone. N₂O (critical temp 36.5°C) is stored as a liquid-gas mixture in cylinders at room temperature (~20°C). Because room temp is below critical temp, pressure can maintain N₂O in liquid form, allowing more agent per cylinder. The cylinder pressure stays constant at ~745 psi until all liquid is consumed — so pressure is NOT a reliable gauge of remaining N₂O.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Critical Temperature", priority: "high" },
  },

  {
    id: "cp-n7-007",
    type: "mcq",
    prompt: "Desflurane requires a specially heated, pressurized vaporizer (Tec 6) rather than a conventional variable-bypass vaporizer. Why?",
    setup: "",
    ans: [
      { t: "Its vapor pressure (~669 mmHg at 20°C) is near 1 atm, so it nearly boils at room temperature unpredictably", ok: true  },
      { t: "Desflurane is chemically unstable and decomposes when exposed to the metal wicks in standard vaporizers",     ok: false },
      { t: "Its extremely low vapor pressure requires active heating to produce any clinically useful vapor concentration", ok: false },
      { t: "The Tec 6 is used purely for convenience and desflurane works identically in standard bypass vaporizers",     ok: false },
    ],
    rationale: "Desflurane boils at 22.8°C with a vapor pressure of ~669 mmHg at 20°C — dangerously close to atmospheric pressure (760 mmHg). In a conventional variable-bypass vaporizer, small temperature fluctuations could cause desflurane to boil uncontrollably, delivering lethal concentrations. The Tec 6 heats desflurane to 39°C (well above its boiling point), pressurizes the vapor, and injects a precise amount into the fresh gas flow electronically.",
    scene: "gas_piston",
    sceneCfg: { label: "DESFLURANE — VP NEAR 1 ATM" },
    metadata: { topic: "Desflurane Vaporizer", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHYSICAL vs CHEMICAL CHANGES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n7-008",
    type: "multi",
    prompt: "Select the TWO examples that represent PHYSICAL changes (no new chemical substances formed):",
    setup: "",
    choices: [
      "Melting ice cubes in a warm saline bag to bring the solution to room temperature",
      "Dissolving sodium chloride crystals in sterile water to prepare normal saline solution",
      "Combustion of sevoflurane producing carbon dioxide and hydrofluoric acid in a fire",
      "Metabolism of propofol by hepatic cytochrome P450 enzymes into glucuronide conjugates",
      "Rusting of a steel laryngoscope blade when exposed to moisture and oxygen over time",
    ],
    correctAnswers: [
      "Melting ice cubes in a warm saline bag to bring the solution to room temperature",
      "Dissolving sodium chloride crystals in sterile water to prepare normal saline solution",
    ],
    selectCount: 2,
    rationale: "Physical changes alter the form or appearance of a substance without creating new chemical species. Melting ice (solid → liquid H₂O) and dissolving NaCl (crystal → dissociated ions, reversible by evaporation) are physical changes. Combustion, enzymatic metabolism, and rusting all involve breaking and forming chemical bonds to create entirely new substances — these are chemical changes.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Physical vs Chemical Changes", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW QUESTIONS 9–25
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n7-009",
    type: "mcq",
    prompt: "Dry ice (solid CO₂) transitions directly from solid to gas at atmospheric pressure without passing through a liquid phase. This phase change is called:",
    setup: "",
    ans: [
      { t: "Sublimation — the direct transition from solid to gas, bypassing the liquid phase entirely", ok: true  },
      { t: "Vaporization — the transition from liquid to gas that occurs at the boiling point temperature", ok: false },
      { t: "Evaporation — surface molecules escape to the gas phase from a solid crystal lattice form",    ok: false },
      { t: "Deposition — molecules transition from the gas phase directly to the solid phase structure",    ok: false },
    ],
    rationale: "Sublimation is the direct solid-to-gas transition. CO₂'s triple point is at 5.11 atm, so at 1 atm (normal atmospheric pressure), liquid CO₂ cannot exist — solid CO₂ (dry ice) sublimes directly to gas at −78.5°C. This is why dry ice 'smokes' but never puddles. The reverse process (gas → solid) is called deposition.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Phase Changes", priority: "medium" },
  },

  {
    id: "cp-n7-010",
    type: "mcq",
    prompt: "The triple point of a substance is the unique temperature and pressure at which all three phases coexist in equilibrium. For water, the triple point is 0.01°C and 611 Pa. What is its clinical significance?",
    setup: "",
    ans: [
      { t: "It defines a fundamental reference for the Kelvin temperature scale and thermodynamic calibration", ok: true  },
      { t: "It is the temperature at which water boils in the operating room under standard surgical conditions", ok: false },
      { t: "It represents the maximum temperature at which ice can exist in a patient warming fluid reservoir",   ok: false },
      { t: "It is the pressure at which all IV fluids spontaneously freeze during high-altitude air transport",   ok: false },
    ],
    rationale: "The triple point of water (273.16 K = 0.01°C at 611 Pa) is a precisely defined thermodynamic state where ice, liquid water, and water vapor coexist. It serves as the reference point for the Kelvin temperature scale. While not directly clinical, understanding phase diagrams helps explain why volatile anesthetics behave differently at various temperatures and pressures.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Phase Changes", priority: "low" },
  },

  {
    id: "cp-n7-011",
    type: "mcq",
    prompt: "A supercritical fluid has properties of both liquid and gas and exists above both its critical temperature and critical pressure. Which statement about supercritical CO₂ is correct?",
    setup: "",
    ans: [
      { t: "It is used as a solvent in industrial processes because it diffuses like a gas but dissolves like a liquid", ok: true  },
      { t: "It is the standard carrier gas in modern anesthesia machines replacing nitrogen in the fresh gas pipeline",   ok: false },
      { t: "It occurs commonly in the patient's bloodstream during normal carbon dioxide transport and elimination",      ok: false },
      { t: "It is identical to regular CO₂ gas and the supercritical designation has no practical physical meaning",      ok: false },
    ],
    rationale: "Above its critical temperature (31.1°C) and critical pressure (73.8 atm), CO₂ becomes a supercritical fluid with unique properties: it diffuses rapidly like a gas but can dissolve substances like a liquid. Supercritical CO₂ is used industrially for decaffeination and sterilization. In anesthesia, understanding supercritical states helps explain why some gas cylinders (CO₂ fire extinguishers) contain supercritical fluid under certain conditions.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "States of Matter", priority: "low" },
  },

  {
    id: "cp-n7-012",
    type: "mcq",
    prompt: "Water has a high specific heat capacity (4.18 J/g°C). Why do patients with a large body water content cool slowly during anesthesia compared to what might be expected?",
    setup: "",
    ans: [
      { t: "Water absorbs a large amount of heat per degree of temperature change, buffering against rapid cooling", ok: true  },
      { t: "Body water is insulating because it forms an impermeable barrier to heat conduction at the skin surface", ok: false },
      { t: "High specific heat causes water to release heat rapidly, which paradoxically prevents further cooling",   ok: false },
      { t: "Specific heat is irrelevant to patient thermoregulation because blood flow determines temperature alone", ok: false },
    ],
    rationale: "Specific heat capacity is the energy needed to change 1 gram of a substance by 1°C. Water's high value (4.18 J/g°C) means it takes substantial energy to change body temperature. A 70 kg patient (~42 L of water) requires about 42,000 × 4.18 = ~175,000 J to drop 1°C. This thermal inertia buffers against rapid temperature swings, though hypothermia still occurs over hours in the cold OR environment.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Specific Heat", priority: "medium" },
  },

  {
    id: "cp-n7-013",
    type: "mcq",
    prompt: "Heat transfer from a patient in the operating room occurs by four mechanisms. Which mechanism accounts for the LARGEST proportion of intraoperative heat loss?",
    setup: "",
    ans: [
      { t: "Radiation — infrared emission from exposed skin accounts for roughly 40% of total heat loss in the OR", ok: true  },
      { t: "Conduction — direct contact between the patient's body and the cold operating table surface dominates",  ok: false },
      { t: "Evaporation — loss of heat through sweating is the primary mechanism even under general anesthesia",     ok: false },
      { t: "Convection — laminar airflow systems in the OR account for over 50% of intraoperative thermal losses",   ok: false },
    ],
    rationale: "Intraoperative heat loss: radiation ~40%, convection ~30%, evaporation ~20%, conduction ~10%. Radiation (infrared emission from warm skin to cooler OR surfaces) dominates because exposed body surface area is large and OR walls/equipment are relatively cool. This is why covering the patient (reducing exposed surface area) and forced-air warming are the most effective temperature management strategies.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Heat Transfer", priority: "high" },
  },

  {
    id: "cp-n7-014",
    type: "multi",
    prompt: "Select the THREE mechanisms of heat transfer that are relevant to intraoperative patient warming strategies:",
    setup: "",
    choices: [
      "Convection — forced-air warming blankets blow heated air across the patient's skin surface",
      "Radiation — overhead radiant warmers transfer heat via infrared electromagnetic energy",
      "Conduction — warm IV fluids and heated mattress pads transfer heat by direct contact",
      "Sublimation — converting solid warming packs directly to gas releases heat to the patient",
      "Ionization — electrical warming devices strip electrons from skin molecules to generate heat",
    ],
    correctAnswers: [
      "Convection — forced-air warming blankets blow heated air across the patient's skin surface",
      "Radiation — overhead radiant warmers transfer heat via infrared electromagnetic energy",
      "Conduction — warm IV fluids and heated mattress pads transfer heat by direct contact",
    ],
    selectCount: 3,
    rationale: "Convection (forced-air warming — the Bair Hugger is the gold standard), radiation (overhead radiant warmers, common in neonatal care), and conduction (warm IV fluids, heated mattress pads) are all used clinically. Sublimation and ionization are not mechanisms of clinical patient warming. Forced-air warming is the most effective single intervention because it covers a large surface area with continuous heat delivery.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Heat Transfer", priority: "high" },
  },

  {
    id: "cp-n7-015",
    type: "mcq",
    prompt: "Forced-air warming (e.g., Bair Hugger) is the most effective active warming method in the OR. By which primary heat transfer mechanism does it work?",
    setup: "",
    ans: [
      { t: "Convection — heated air flows across the skin surface, transferring thermal energy to the patient", ok: true  },
      { t: "Conduction — the warming blanket makes direct physical contact to transfer heat to the skin surface", ok: false },
      { t: "Radiation — the device emits infrared energy that penetrates skin and warms deep tissue layers",     ok: false },
      { t: "Evaporation — the warm air evaporates moisture from the skin, releasing heat energy into the body",   ok: false },
    ],
    rationale: "Forced-air warming works primarily by convection: a stream of heated air passes over the patient's skin, transferring heat. The disposable blanket distributes airflow evenly. Studies consistently show forced-air warming is superior to conductive mattresses or radiant warmers for maintaining normothermia during surgery because it covers a large surface area and continuously replenishes the warm air layer.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Heat Transfer", priority: "medium" },
  },

  {
    id: "cp-n7-016",
    type: "mcq",
    prompt: "Vapor pressure curves plot saturated vapor pressure vs temperature for volatile anesthetics. At 20°C, the approximate vapor pressures are: desflurane ~669 mmHg, isoflurane ~238 mmHg, sevoflurane ~157 mmHg. Which agent is the LEAST volatile?",
    setup: "",
    ans: [
      { t: "Sevoflurane — its lowest vapor pressure at 20°C means it evaporates least readily of the three agents", ok: true  },
      { t: "Desflurane — despite having the highest vapor pressure it is the least volatile at room temperature",    ok: false },
      { t: "Isoflurane — its intermediate vapor pressure makes it the least volatile of the three listed agents",     ok: false },
      { t: "All three have equal volatility — vapor pressure does not determine how readily a liquid evaporates",     ok: false },
    ],
    rationale: "Volatility is directly related to vapor pressure: higher VP = more volatile. At 20°C, desflurane (669 mmHg) > isoflurane (238 mmHg) > sevoflurane (157 mmHg). Sevoflurane is the least volatile of the three. Its lower VP means it works well in standard variable-bypass vaporizers without the heating mechanism that desflurane requires.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Vapor Pressure", priority: "high" },
  },

  {
    id: "cp-n7-017",
    type: "mcq",
    prompt: "Desflurane boils at 22.8°C at sea level (760 mmHg). At a surgical facility at 2500 m altitude (barometric pressure ~560 mmHg), what happens to desflurane's boiling point?",
    setup: "",
    ans: [
      { t: "The boiling point decreases — lower atmospheric pressure means less vapor pressure needed to boil", ok: true  },
      { t: "The boiling point increases — desflurane requires more energy to vaporize at reduced air pressure",  ok: false },
      { t: "The boiling point is unchanged — boiling point is an intrinsic molecular property that never varies", ok: false },
      { t: "Desflurane cannot be used at altitude because it exists only as a gas above 2000 meters elevation",  ok: false },
    ],
    rationale: "Boiling occurs when vapor pressure equals ambient pressure. At altitude, lower Patm (~560 mmHg) means desflurane reaches its boiling point at a temperature even lower than 22.8°C. At altitude, desflurane would boil well below room temperature, making the Tec 6 vaporizer even more critical for safe delivery. This reinforces why desflurane cannot be used in a standard variable-bypass vaporizer.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Boiling Point", priority: "high" },
  },

  {
    id: "cp-n7-018",
    type: "mcq",
    prompt: "Saturated vapor pressure (SVP) is the maximum vapor pressure a liquid exerts at a given temperature. If a vaporizer chamber reaches SVP, what happens to further evaporation?",
    setup: "",
    ans: [
      { t: "Evaporation and condensation reach equilibrium — net vaporization stops until vapor is removed from the chamber", ok: true  },
      { t: "Evaporation accelerates exponentially because the high vapor concentration drives more molecules out of liquid",   ok: false },
      { t: "The liquid freezes because saturated vapor pressure extracts all remaining thermal energy from the liquid phase",   ok: false },
      { t: "The vaporizer pressure exceeds atmospheric and gas flows backward into the fresh gas supply line automatically",    ok: false },
    ],
    rationale: "At SVP, the rate of evaporation equals the rate of condensation — dynamic equilibrium. No net increase in vapor occurs unless vapor is removed (as fresh gas flow carries it away in a vaporizer). The vaporizer splitting ratio (bypass vs vaporizing chamber) controls how much fresh gas contacts the liquid agent, determining the output concentration.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Vapor Pressure", priority: "medium" },
  },

  {
    id: "cp-n7-019",
    type: "mcq",
    prompt: "Relative humidity (RH) is the ratio of actual water vapor pressure to the saturated vapor pressure at that temperature, expressed as a percentage. If inspired gas has RH of 50% at 37°C (SVP = 47 mmHg), what is the actual water vapor pressure?",
    setup: "",
    ans: [
      { t: "23.5 mmHg — calculated as 50% of the saturated vapor pressure of 47 mmHg at body temperature", ok: true  },
      { t: "47 mmHg — relative humidity does not change the actual water vapor pressure in inspired gas",    ok: false },
      { t: "94 mmHg — multiply the saturated vapor pressure by the relative humidity percentage directly",   ok: false },
      { t: "50 mmHg — relative humidity in percent equals the actual water vapor pressure in mmHg always",   ok: false },
    ],
    rationale: "RH = (actual PH₂O / SVP) × 100%. At 50% RH and 37°C: actual PH₂O = 0.50 × 47 = 23.5 mmHg. Absolute humidity (mg H₂O/L gas) is another way to express moisture content. Inadequately humidified inspired gas (as with dry medical gases) desiccates airway mucosa, impairs mucociliary clearance, and increases secretion viscosity.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Humidity", priority: "medium" },
  },

  {
    id: "cp-n7-020",
    type: "mcq",
    prompt: "A heat and moisture exchanger (HME) is placed between the ETT and the breathing circuit. How does it conserve patient heat and moisture?",
    setup: "",
    ans: [
      { t: "It captures exhaled heat and water vapor and returns them to the patient during the next inspiration", ok: true  },
      { t: "It electrically heats the inspired gas and injects sterile water vapor into the breathing circuit",     ok: false },
      { t: "It absorbs CO₂ from exhaled gas and releases water vapor as a byproduct of the chemical reaction",     ok: false },
      { t: "It acts as a one-way valve that prevents warm exhaled gas from leaving the breathing circuit at all",   ok: false },
    ],
    rationale: "An HME (also called an artificial nose) contains a hygroscopic membrane or element that traps heat and moisture from the patient's warm, humid exhaled gas. On the next inspiration, cool dry gas from the circuit passes through the HME and picks up this stored heat and moisture. HMEs provide ~60–70% humidity recovery — less than active heated humidifiers but adequate for most short-to-moderate surgical cases.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Humidity", priority: "medium" },
  },

  {
    id: "cp-n7-021",
    type: "mcq",
    prompt: "The Joule-Thomson effect describes gas cooling when it expands through a restriction (valve or orifice) without external work or heat exchange. Where is this effect observed in anesthesia?",
    setup: "",
    ans: [
      { t: "At the cylinder regulator where compressed gas expands and cools, sometimes causing frost formation", ok: true  },
      { t: "Inside the vaporizer where liquid anesthetic warms as it passes through the vaporizing chamber wick", ok: false },
      { t: "In the patient's lungs where gas warms to body temperature upon contact with the alveolar membrane",  ok: false },
      { t: "At the scavenging system where waste gas compresses and heats before being vented to the atmosphere", ok: false },
    ],
    rationale: "The Joule-Thomson effect occurs when gas expands through a throttle (valve, orifice) at constant enthalpy — most real gases cool during this process. In anesthesia, high-pressure gas (~2000 psi O₂ or ~745 psi N₂O) expanding through the cylinder regulator cools significantly. With high flow rates, frost can form on the regulator. Prolonged high-flow N₂O use can cool the cylinder enough to reduce vapor pressure and decrease output.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Joule-Thomson Effect", priority: "medium" },
  },

  {
    id: "cp-n7-022",
    type: "mcq",
    prompt: "An adiabatic process is one in which no heat is exchanged with the surroundings. When gas is compressed adiabatically in a diesel engine, what happens to its temperature?",
    setup: "",
    ans: [
      { t: "Temperature rises — the work of compression increases internal energy and therefore temperature", ok: true  },
      { t: "Temperature falls — compression removes energy from the gas molecules, cooling them rapidly",     ok: false },
      { t: "Temperature stays constant — adiabatic means no temperature change by the definition of the term", ok: false },
      { t: "Temperature oscillates — the gas alternately heats and cools during each compression stroke",      ok: false },
    ],
    rationale: "In adiabatic compression, no heat escapes (Q = 0), so all work done on the gas increases its internal energy and temperature. This is how diesel engines ignite fuel and how rapid valve closure in gas pipelines can create dangerous heat. Conversely, adiabatic expansion (as through a cylinder regulator) cools the gas. Understanding adiabatic processes explains temperature changes in compressed gas systems throughout the anesthesia machine.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Adiabatic Processes", priority: "low" },
  },

  {
    id: "cp-n7-023",
    type: "mcq",
    prompt: "The fire triangle requires three elements to sustain combustion. In the OR, which three components complete the fire triangle?",
    setup: "",
    ans: [
      { t: "Fuel (drapes, alcohol prep), oxidizer (O₂ or N₂O), and an ignition source (electrosurgery or laser)", ok: true  },
      { t: "Oxygen, nitrogen, and carbon dioxide — these three gases combine to create a flammable environment",    ok: false },
      { t: "Heat, pressure, and volume — the three thermodynamic variables from the ideal gas law equation",        ok: false },
      { t: "Patient tissue, anesthetic vapor, and room air — the three biologic components of surgical combustion", ok: false },
    ],
    rationale: "The fire triangle: fuel + oxidizer + ignition. In the OR, fuels include surgical drapes, alcohol-based prep solutions, ETTs, and intestinal gases. Oxidizers include oxygen (>21%) and nitrous oxide. Ignition sources include electrosurgical units (Bovie), lasers, and fiber-optic light cables. Removing any one element breaks the triangle and prevents fire. OR fires are a significant safety concern, especially during airway surgery with high FiO₂.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "OR Fire Safety", priority: "high" },
  },

  {
    id: "cp-n7-024",
    type: "mcq",
    prompt: "During laser airway surgery, the risk of endotracheal tube fire is highest when the FiO₂ is elevated. What is the recommended FiO₂ to minimize airway fire risk during laser cases?",
    setup: "",
    ans: [
      { t: "The lowest FiO₂ that maintains adequate oxygenation, ideally below 30% when feasible clinically", ok: true  },
      { t: "100% FiO₂ is always used during laser cases to ensure maximum oxygenation during the procedure",   ok: false },
      { t: "Exactly 21% room air without supplemental oxygen, as this eliminates all combustion risk in the OR", ok: false },
      { t: "FiO₂ is irrelevant to laser fire risk because only the laser power setting determines fire hazard",  ok: false },
    ],
    rationale: "Oxygen is a potent oxidizer that dramatically lowers the ignition threshold and accelerates combustion. During laser airway surgery, FiO₂ should be kept as low as possible (ideally <30%) while maintaining SpO₂ >93%. N₂O should also be avoided (it supports combustion). Laser-resistant ETTs, saline-filled cuffs, and moist pledgets further reduce fire risk. If fire occurs: stop ventilation, remove ETT, flood with saline, and reintubate.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "OR Fire Safety", priority: "high" },
  },

  {
    id: "cp-n7-025",
    type: "mcq",
    prompt: "Electrosurgical units (ESU/Bovie) generate heat by passing radiofrequency current through tissue. When used near supplemental oxygen or N₂O, what is the primary fire concern?",
    setup: "",
    ans: [
      { t: "The ESU spark can ignite oxygen-enriched surgical drapes, alcohol prep, or bowel gas causing a flash fire", ok: true  },
      { t: "The ESU generates enough heat to decompose N₂O into nitrogen and oxygen, creating an explosive gas mixture", ok: false },
      { t: "Radiofrequency energy ionizes oxygen molecules, converting them to ozone which is spontaneously flammable",  ok: false },
      { t: "The ESU is completely safe near all oxidizers because its operating frequency is too low to ignite any fuel", ok: false },
    ],
    rationale: "ESU generates sparks and intense local heat (>200°C) that can ignite fuels in an oxygen-enriched atmosphere. OR fires commonly occur when the Bovie contacts alcohol prep solution or surgical drapes in the presence of supplemental O₂ (e.g., nasal cannula under drapes during facial surgery). Prevention includes allowing alcohol prep to dry completely, reducing FiO₂, and using closed suction near the surgical site.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "OR Fire Safety", priority: "high" },
  },

];

export const CP_NODE7_METADATA = {
  nodeId:   "cp-node-7",
  courseId: "chem-phys-anesthesia",
  chapter:  "States of Matter",
  title:    "States of Matter & Phase Changes",
  totalQuestions: CP_NODE7_QUESTIONS.length,
  questionTypes: {
    mcq:   CP_NODE7_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: CP_NODE7_QUESTIONS.filter(q => q.type === 'multi').length,
    short: CP_NODE7_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
