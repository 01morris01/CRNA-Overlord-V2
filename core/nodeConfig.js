/**
 * NODE CONFIG — Single source of truth for all study nodes.
 *
 * To activate a new node:
 *   1. Create data/questions/<nodeId>.js  (export QUESTIONS array + METADATA object)
 *   2. Add one import line below
 *   3. Add one entry to NODE_CONFIG
 *
 * Everything else (menus, routing, header, scene dispatch) resolves automatically.
 */

import { AIRWAY_QUESTIONS,           AIRWAY_METADATA           } from '../data/questions/airway-management-chapter2.js';
import { PHARM_PRINCIPLES_QUESTIONS, PHARM_PRINCIPLES_METADATA } from '../data/questions/basic-pharmacologic-principles-chapter3.js';
import { CARDIAC_QUESTIONS,      CARDIAC_METADATA      } from '../data/questions/cardiac-physiology-chapter4.js';
import { PULMONARY_QUESTIONS,    PULMONARY_METADATA    } from '../data/questions/pulmonary-physiology-chapter5.js';
import { AUTONOMIC_NS_QUESTIONS, AUTONOMIC_NS_METADATA } from '../data/questions/autonomic-ns-chapter6.js';
import { INHALED_ANESTHETICS_QUESTIONS, INHALED_ANESTHETICS_METADATA } from '../data/questions/inhaled-anesthetics-chapter7.js';
import { IV_ANESTHETICS_QUESTIONS, IV_ANESTHETICS_METADATA } from '../data/questions/iv-anesthetics-chapter8.js';
import { OPIOIDS_QUESTIONS, OPIOIDS_METADATA } from '../data/questions/opioids-chapter9.js';
import { NMB_QUESTIONS,    NMB_METADATA    } from '../data/questions/nmb-chapter10.js';
import { MACHINE_QUESTIONS, MACHINE_METADATA } from '../data/questions/anesthesia-machine-chapter11.js';

// ── Advanced Physiology & Pathophysiology I (Guyton & Hall 14e) ──────────────
import { PATHO_NODE1_QUESTIONS,  PATHO_NODE1_METADATA  } from '../data/questions/patho-node1-cell-organization.js';
import { PATHO_NODE2_QUESTIONS,  PATHO_NODE2_METADATA  } from '../data/questions/patho-node2-genetics-transport.js';
import { PATHO_NODE3_QUESTIONS,  PATHO_NODE3_METADATA  } from '../data/questions/patho-node3-membrane-potentials-skeletal-muscle.js';
import { PATHO_NODE4_QUESTIONS,  PATHO_NODE4_METADATA  } from '../data/questions/patho-node4-muscle-excitation.js';
import { PATHO_NODE5_QUESTIONS,  PATHO_NODE5_METADATA  } from '../data/questions/patho-node5-cardiac-rhythm.js';
import { PATHO_NODE6_QUESTIONS,  PATHO_NODE6_METADATA  } from '../data/questions/patho-node6-ecg-vectorial.js';
import { PATHO_NODE7_QUESTIONS,  PATHO_NODE7_METADATA  } from '../data/questions/patho-node7-arrhythmias-circulation.js';
import { PATHO_NODE8_QUESTIONS,  PATHO_NODE8_METADATA  } from '../data/questions/patho-node8-distensibility-microcirculation.js';
import { PATHO_NODE9_QUESTIONS,  PATHO_NODE9_METADATA  } from '../data/questions/patho-node9-local-neural-bp.js';
import { PATHO_NODE10_QUESTIONS, PATHO_NODE10_METADATA } from '../data/questions/patho-node10-kidney-bp-cardiac-output.js';
import { PATHO_NODE11_QUESTIONS, PATHO_NODE11_METADATA } from '../data/questions/patho-node11-muscle-coronary-hf.js';
import { PATHO_NODE12_QUESTIONS, PATHO_NODE12_METADATA } from '../data/questions/patho-node12-valves-shock.js';
import { PATHO_NODE_13_QUESTIONS as PATHO_NODE13_QUESTIONS, PATHO_NODE_13_METADATA as PATHO_NODE13_METADATA } from '../data/questions/patho-node-13.js';

// ── Chemistry & Physics for Anesthesia Practice ─────────────────────────────
import { CP_NODE1_QUESTIONS, CP_NODE1_METADATA } from '../data/questions/cp-node1-smart-sheets.js';
import { CP_NODE2_QUESTIONS, CP_NODE2_METADATA } from '../data/questions/cp-node2-med-math.js';
import { CP_NODE3_QUESTIONS, CP_NODE3_METADATA } from '../data/questions/cp-node3-physics1.js';
import { CP_NODE4_QUESTIONS, CP_NODE4_METADATA } from '../data/questions/cp-node4-physics2.js';
import { CP_NODE5_QUESTIONS, CP_NODE5_METADATA } from '../data/questions/cp-node5-fluids.js';
import { CP_NODE6_QUESTIONS, CP_NODE6_METADATA } from '../data/questions/cp-node6-gas-laws.js';
import { CP_NODE7_QUESTIONS, CP_NODE7_METADATA } from '../data/questions/cp-node7-states-of-matter.js';
import { CP_NODE9_QUESTIONS, CP_NODE9_METADATA } from '../data/questions/cp-node9-acids-bases-buffers.js';
import { CP_NODE10_QUESTIONS, CP_NODE10_METADATA } from '../data/questions/cp-node10-electricity-electrical-safety.js';

import { WEEK_1_QUESTIONS, WEEK_1_METADATA } from '../data/questions/week-1.js';
import { WEEK_2_QUESTIONS, WEEK_2_METADATA } from '../data/questions/week-2.js';
import { WEEK_3_QUESTIONS, WEEK_3_METADATA } from '../data/questions/week-3.js';
import { WEEK_4_QUESTIONS, WEEK_4_METADATA } from '../data/questions/week-4.js';
import { WEEK_5_QUESTIONS, WEEK_5_METADATA } from '../data/questions/week-5.js';
import { WEEK_6_QUESTIONS, WEEK_6_METADATA } from '../data/questions/week-6.js';
import { WEEK_7_SPRING_BREAK_QUESTIONS, WEEK_7_SPRING_BREAK_METADATA } from '../data/questions/week-7-spring-break.js';
import { WEEK_8_QUESTIONS, WEEK_8_METADATA } from '../data/questions/week-8.js';
import { WEEK_9_QUESTIONS, WEEK_9_METADATA } from '../data/questions/week-9.js';
import { WEEK_10_QUESTIONS, WEEK_10_METADATA } from '../data/questions/week-10.js';
import { WEEK_11_QUESTIONS, WEEK_11_METADATA } from '../data/questions/week-11.js';
import { WEEK_13_QUESTIONS, WEEK_13_METADATA } from '../data/questions/week-13.js';
// ─── Registry ─────────────────────────────────────────────────────────────────

export const NODE_CONFIG = {

  "node-2": {
    courseId:          "basics-of-anesthesia",
    title:             "Airway Management",
    chapterLabel:      "Ch. 2",
    badgeLabel:        "AIRWAY MANAGEMENT Ch.2",
    icon:              "🫁",
    questions:         AIRWAY_QUESTIONS,
    questionsMeta:     AIRWAY_METADATA,
    sceneRendererName: "renderAirwayManagementScene",
    stopSceneName:     "stopAirwayManagementScene",
  },

  "node-3": {
    courseId:          "basics-of-anesthesia",
    title:             "Basic Pharmacologic Principles",
    chapterLabel:      "Ch. 3",
    badgeLabel:        "PHARMACOLOGIC PRINCIPLES Ch.3",
    icon:              "💊",
    questions:         PHARM_PRINCIPLES_QUESTIONS,
    questionsMeta:     PHARM_PRINCIPLES_METADATA,
    sceneRendererName: "renderBasicPharmacologicPrinciplesScene",
    stopSceneName:     "stopBasicPharmacologicPrinciplesScene",
  },

  "node-4": {
    courseId:          "basics-of-anesthesia",
    title:             "Cardiac Physiology",
    chapterLabel:      "Ch. 4",
    badgeLabel:        "CARDIAC PHYSIOLOGY Ch.4",
    icon:              "❤️",
    questions:         CARDIAC_QUESTIONS,
    questionsMeta:     CARDIAC_METADATA,
    sceneRendererName: "renderCardiacPhysiologyScene",
    stopSceneName:     "stopCardiacPhysiologyScene",
  },

  "node-5": {
    courseId:          "basics-of-anesthesia",
    title:             "Pulmonary Physiology",
    chapterLabel:      "Ch. 5",
    badgeLabel:        "PULMONARY PHYSIOLOGY Ch.5",
    icon:              "🫁",
    questions:         PULMONARY_QUESTIONS,
    questionsMeta:     PULMONARY_METADATA,
    sceneRendererName: "renderPulmonaryPhysiologyScene",
    stopSceneName:     "stopPulmonaryPhysiologyScene",
  },

  "node-6": {
    courseId:          "basics-of-anesthesia",
    title:             "Autonomic Nervous System",
    chapterLabel:      "Ch. 6",
    badgeLabel:        "AUTONOMIC NS Ch.6",
    icon:              "⚡",
    questions:         AUTONOMIC_NS_QUESTIONS,
    questionsMeta:     AUTONOMIC_NS_METADATA,
    sceneRendererName: "renderAutonomicNSScene",
    stopSceneName:     "stopAutonomicNSScene",
  },

  "node-7": {
    courseId:          "basics-of-anesthesia",
    title:             "Inhaled Anesthetics",
    chapterLabel:      "Ch. 7",
    badgeLabel:        "INHALED ANESTHETICS Ch.7",
    icon:              "🫁",
    questions:         INHALED_ANESTHETICS_QUESTIONS,
    questionsMeta:     INHALED_ANESTHETICS_METADATA,
    sceneRendererName: "renderInhaledAnestheticsScene",
    stopSceneName:     "stopInhaledAnestheticsScene",
  },

  "node-8": {
    courseId:          "basics-of-anesthesia",
    title:             "IV Anesthetics",
    chapterLabel:      "Ch. 8",
    badgeLabel:        "IV ANESTHETICS Ch.8",
    icon:              "💊",
    questions:         IV_ANESTHETICS_QUESTIONS,
    questionsMeta:     IV_ANESTHETICS_METADATA,
    sceneRendererName: "renderIVAnestheticsScene",
    stopSceneName:     "stopIVAnestheticsScene",
  },

  "node-9": {
    courseId:          "basics-of-anesthesia",
    title:             "Opioids",
    chapterLabel:      "Ch. 9",
    badgeLabel:        "OPIOIDS Ch.9",
    icon:              "💉",
    questions:         OPIOIDS_QUESTIONS,
    questionsMeta:     OPIOIDS_METADATA,
    sceneRendererName: "renderOpioidScene",
    stopSceneName:     "stopOpioidScene",
  },

  "node-10": {
    courseId:          "basics-of-anesthesia",
    title:             "Neuromuscular Blockers",
    chapterLabel:      "Ch. 10",
    badgeLabel:        "NMB Ch.10",
    icon:              "🧪",
    questions:         NMB_QUESTIONS,
    questionsMeta:     NMB_METADATA,
    sceneRendererName: "renderNMBScene",
    stopSceneName:     "stopNMBScene",
  },

  "node-11": {
    courseId:          "basics-of-anesthesia",
    title:             "Anesthesia Delivery Systems",
    chapterLabel:      "Ch. 11",
    badgeLabel:        "DELIVERY SYSTEMS Ch.11",
    icon:              "⚙️",
    questions:         MACHINE_QUESTIONS,
    questionsMeta:     MACHINE_METADATA,
    sceneRendererName: "renderAnesthesiaMachineScene",
    stopSceneName:     "stopAnesthesiaMachineScene",
  },

  // ── Advanced Physiology & Pathophysiology I (Guyton & Hall 14e) ───────────
  //
  // These nodes use the data-driven SCENE_REGISTRY (tier-1 dispatch in
  // gameUI.js), so no per-node renderer is required. Every question carries
  // its own q.scene + q.sceneCfg.

  "patho-node-1": {
    courseId:      "adv-phys-path-1",
    title:         "Organization of the Human Body & The Cell",
    chapterLabel:  "Ch. 1–2",
    badgeLabel:    "CELL & HOMEOSTASIS Ch.1–2",
    icon:          "🧬",
    questions:     PATHO_NODE1_QUESTIONS,
    questionsMeta: PATHO_NODE1_METADATA,
  },

  "patho-node-2": {
    courseId:      "adv-phys-path-1",
    title:         "Genetic Control & Membrane Transport",
    chapterLabel:  "Ch. 3–4",
    badgeLabel:    "DNA / TRANSPORT Ch.3–4",
    icon:          "🧪",
    questions:     PATHO_NODE2_QUESTIONS,
    questionsMeta: PATHO_NODE2_METADATA,
  },

  "patho-node-3": {
    courseId:      "adv-phys-path-1",
    title:         "Membrane Potentials & Skeletal Muscle",
    chapterLabel:  "Ch. 5–6",
    badgeLabel:    "AP / SARCOMERE Ch.5–6",
    icon:          "⚡",
    questions:     PATHO_NODE3_QUESTIONS,
    questionsMeta: PATHO_NODE3_METADATA,
  },

  "patho-node-4": {
    courseId:      "adv-phys-path-1",
    title:         "Muscle Excitation — Skeletal & Smooth",
    chapterLabel:  "Ch. 7–8",
    badgeLabel:    "NMJ / SMOOTH MUSCLE Ch.7–8",
    icon:          "💪",
    questions:     PATHO_NODE4_QUESTIONS,
    questionsMeta: PATHO_NODE4_METADATA,
  },

  "patho-node-5": {
    courseId:      "adv-phys-path-1",
    title:         "Cardiac Muscle & Rhythmic Excitation",
    chapterLabel:  "Ch. 9–10",
    badgeLabel:    "CARDIAC AP / SA NODE Ch.9–10",
    icon:          "❤️",
    questions:     PATHO_NODE5_QUESTIONS,
    questionsMeta: PATHO_NODE5_METADATA,
  },

  "patho-node-6": {
    courseId:      "adv-phys-path-1",
    title:         "Fundamentals of ECG & Vectorial Analysis",
    chapterLabel:  "Ch. 11–12",
    badgeLabel:    "ECG / AXIS Ch.11–12",
    icon:          "📈",
    questions:     PATHO_NODE6_QUESTIONS,
    questionsMeta: PATHO_NODE6_METADATA,
  },

  "patho-node-7": {
    courseId:      "adv-phys-path-1",
    title:         "Arrhythmias & Overview of the Circulation",
    chapterLabel:  "Ch. 13–14",
    badgeLabel:    "ARRHYTHMIAS / VESSELS Ch.13–14",
    icon:          "💓",
    questions:     PATHO_NODE7_QUESTIONS,
    questionsMeta: PATHO_NODE7_METADATA,
  },

  "patho-node-8": {
    courseId:      "adv-phys-path-1",
    title:         "Vascular Distensibility & Microcirculation",
    chapterLabel:  "Ch. 15–16",
    badgeLabel:    "COMPLIANCE / STARLING Ch.15–16",
    icon:          "🩸",
    questions:     PATHO_NODE8_QUESTIONS,
    questionsMeta: PATHO_NODE8_METADATA,
  },

  "patho-node-9": {
    courseId:      "adv-phys-path-1",
    title:         "Local Blood Flow & Nervous Regulation of BP",
    chapterLabel:  "Ch. 17–18",
    badgeLabel:    "AUTOREG / BAROREFLEX Ch.17–18",
    icon:          "🧠",
    questions:     PATHO_NODE9_QUESTIONS,
    questionsMeta: PATHO_NODE9_METADATA,
  },

  "patho-node-10": {
    courseId:      "adv-phys-path-1",
    title:         "Renal BP Control & Cardiac Output",
    chapterLabel:  "Ch. 19–20",
    badgeLabel:    "RAAS / CO-VR Ch.19–20",
    icon:          "🫘",
    questions:     PATHO_NODE10_QUESTIONS,
    questionsMeta: PATHO_NODE10_METADATA,
  },

  "patho-node-11": {
    courseId:      "adv-phys-path-1",
    title:         "Muscle/Coronary Blood Flow & Cardiac Failure",
    chapterLabel:  "Ch. 21–22",
    badgeLabel:    "CORONARY / HF Ch.21–22",
    icon:          "💔",
    questions:     PATHO_NODE11_QUESTIONS,
    questionsMeta: PATHO_NODE11_METADATA,
  },

  "patho-node-12": {
    courseId:      "adv-phys-path-1",
    title:         "Heart Valves & Circulatory Shock",
    chapterLabel:  "Ch. 23–24",
    badgeLabel:    "VALVES / SHOCK Ch.23–24",
    icon:          "⚠️",
    questions:     PATHO_NODE12_QUESTIONS,
    questionsMeta: PATHO_NODE12_METADATA,
  },
  "patho-node-13": {
    courseId:      "adv-phys-path-1",
    title:         "Regulation of Body Fluid Compartments / The Urinary System",
    chapterLabel:  "Ch. 25–26",
    badgeLabel:    "BODY FLUID Ch.25–26",
    icon:          "💧",
    questions:     PATHO_NODE13_QUESTIONS,
    questionsMeta: PATHO_NODE13_METADATA,
  },


  // ── Chemistry & Physics for Anesthesia Practice ────────────────────────────
  //
  // cp-node-2 is the MATH/DRIP node: untimed + adaptive. The untimed flag
  // tells gameUI.js to skip the 35-sec countdown. All other CP nodes are
  // timed normally.

  "cp-node-1": {
    courseId:      "chem-phys-anesthesia",
    title:         "Smart Sheets & Course Foundations",
    chapterLabel:  "Foundations",
    badgeLabel:    "SMART SHEETS",
    icon:          "📐",
    questions:     CP_NODE1_QUESTIONS,
    questionsMeta: CP_NODE1_METADATA,
  },

  "cp-node-2": {
    courseId:      "chem-phys-anesthesia",
    title:         "Medical Math & Drip Calculations",
    chapterLabel:  "Math / Drip",
    badgeLabel:    "MED MATH — UNTIMED",
    icon:          "🧮",
    questions:     CP_NODE2_QUESTIONS,
    questionsMeta: CP_NODE2_METADATA,
    untimed:       true,   // disables 35-sec timer for the entire node
    adaptive:      true,   // metadata flag for future adaptive behavior
  },

  "cp-node-3": {
    courseId:      "chem-phys-anesthesia",
    title:         "Physics I — Forces, Pressure & Measurement",
    chapterLabel:  "Physics I",
    badgeLabel:    "PHYSICS I",
    icon:          "⚖️",
    questions:     CP_NODE3_QUESTIONS,
    questionsMeta: CP_NODE3_METADATA,
  },

  "cp-node-4": {
    courseId:      "chem-phys-anesthesia",
    title:         "Physics II — Energy, Work & Ventilation",
    chapterLabel:  "Physics II",
    badgeLabel:    "PHYSICS II",
    icon:          "🔋",
    questions:     CP_NODE4_QUESTIONS,
    questionsMeta: CP_NODE4_METADATA,
  },

  "cp-node-5": {
    courseId:      "chem-phys-anesthesia",
    title:         "Fluids — Hydrostatics & Hydrodynamics",
    chapterLabel:  "Fluids",
    badgeLabel:    "FLUIDS",
    icon:          "💧",
    questions:     CP_NODE5_QUESTIONS,
    questionsMeta: CP_NODE5_METADATA,
  },

  "cp-node-6": {
    courseId:      "chem-phys-anesthesia",
    title:         "The Gas Laws",
    chapterLabel:  "Gas Laws",
    badgeLabel:    "GAS LAWS",
    icon:          "🫁",
    questions:     CP_NODE6_QUESTIONS,
    questionsMeta: CP_NODE6_METADATA,
  },

  "cp-node-7": {
    courseId:      "chem-phys-anesthesia",
    title:         "States of Matter & Phase Changes",
    chapterLabel:  "States",
    badgeLabel:    "STATES OF MATTER",
    icon:          "🧊",
    questions:     CP_NODE7_QUESTIONS,
    questionsMeta: CP_NODE7_METADATA,
  },

  "cp-node-9": {
    courseId:      "chem-phys-anesthesia",
    title:         "Acids, Bases & Buffers",
    chapterLabel:  "Ch. 9",
    badgeLabel:    "ACIDS / BASES / BUFFERS",
    icon:          "⚗️",
    questions:     CP_NODE9_QUESTIONS,
    questionsMeta: CP_NODE9_METADATA,
  },
  "cp-node-10": {
    courseId:      "chem-phys-anesthesia",
    title:         "Electricity & Electrical Safety",
    chapterLabel:  "Ch. 10",
    badgeLabel:    "ELECTRICITY Ch.10",
    icon:          "⚡",
    questions:     CP_NODE10_QUESTIONS,
    questionsMeta: CP_NODE10_METADATA,
  },


    "week-1": {
    courseId:      "adv-health-assessment",
    title:         "Week 1",
    chapterLabel:  "Week 1",
    badgeLabel:    "HEALTH Week.1",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_1_QUESTIONS,
    questionsMeta: WEEK_1_METADATA,
  },

    "week-2": {
    courseId:      "adv-health-assessment",
    title:         "Week 2",
    chapterLabel:  "Week 2",
    badgeLabel:    "HEALTH Week.2",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_2_QUESTIONS,
    questionsMeta: WEEK_2_METADATA,
  },

    "week-3": {
    courseId:      "adv-health-assessment",
    title:         "Week 3",
    chapterLabel:  "Week 3",
    badgeLabel:    "HEALTH Week.3",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_3_QUESTIONS,
    questionsMeta: WEEK_3_METADATA,
  },

    "week-4": {
    courseId:      "adv-health-assessment",
    title:         "Week 4",
    chapterLabel:  "Week 4",
    badgeLabel:    "HEALTH Week.4",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_4_QUESTIONS,
    questionsMeta: WEEK_4_METADATA,
  },

    "week-5": {
    courseId:      "adv-health-assessment",
    title:         "Week 5",
    chapterLabel:  "Week 5",
    badgeLabel:    "HEALTH Week.5",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_5_QUESTIONS,
    questionsMeta: WEEK_5_METADATA,
  },

    "week-6": {
    courseId:      "adv-health-assessment",
    title:         "Week 6",
    chapterLabel:  "Week 6",
    badgeLabel:    "HEALTH Week.6",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_6_QUESTIONS,
    questionsMeta: WEEK_6_METADATA,
  },

    "week-7-spring-break": {
    courseId:      "adv-health-assessment",
    title:         "week 7/spring break",
    chapterLabel:  "Week 7",
    badgeLabel:    "HEALTH Week.7",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_7_SPRING_BREAK_QUESTIONS,
    questionsMeta: WEEK_7_SPRING_BREAK_METADATA,
  },

    "week-8": {
    courseId:      "adv-health-assessment",
    title:         "Week 8",
    chapterLabel:  "Week 8",
    badgeLabel:    "HEALTH Week.8",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_8_QUESTIONS,
    questionsMeta: WEEK_8_METADATA,
  },

    "week-9": {
    courseId:      "adv-health-assessment",
    title:         "Week 9",
    chapterLabel:  "Week 9",
    badgeLabel:    "HEALTH Week.9",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_9_QUESTIONS,
    questionsMeta: WEEK_9_METADATA,
  },

    "week-10": {
    courseId:      "adv-health-assessment",
    title:         "Week 10",
    chapterLabel:  "Week 10",
    badgeLabel:    "HEALTH Week.10",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_10_QUESTIONS,
    questionsMeta: WEEK_10_METADATA,
  },

    "week-11": {
    courseId:      "adv-health-assessment",
    title:         "Week 11",
    chapterLabel:  "Week 11",
    badgeLabel:    "HEALTH Week.11",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_11_QUESTIONS,
    questionsMeta: WEEK_11_METADATA,
  },

    "week-13": {
    courseId:      "adv-health-assessment",
    title:         "WEEK 13",
    chapterLabel:  "Week 13",
    badgeLabel:    "HEALTH Week.13",
    icon:          "\ud83e\ude7a",
    questions:     WEEK_13_QUESTIONS,
    questionsMeta: WEEK_13_METADATA,
  },

  // ── Add future nodes here ──────────────────────────────────────────────────

};

// ─── Accessors ────────────────────────────────────────────────────────────────

/** Returns config for a single node, or null if not found. */
export function getNodeConfig(nodeId) {
  return NODE_CONFIG[nodeId] || null;
}

/**
 * Returns all node configs for a given courseId, each annotated with its nodeId.
 * Used by menus.js to auto-build the map without manual wiring.
 */
export function getNodesByCourse(courseId) {
  return Object.entries(NODE_CONFIG)
    .filter(([, cfg]) => cfg.courseId === courseId)
    .map(([nodeId, cfg]) => ({ nodeId, ...cfg }));
}

/**
 * Returns an ordered list of distinct courses found in NODE_CONFIG.
 * Each entry: { courseId, label, nodeCount }.
 */
const COURSE_LABELS = {
  'basics-of-anesthesia':  'Basics of Anesthesia',
  'adv-phys-path-1':       'Pathophysiology',
  'chem-phys-anesthesia':  'Chemistry & Physics',
  'adv-health-assessment': 'Health Assessment',
};

const COURSE_ORDER = [
  'basics-of-anesthesia',
  'adv-phys-path-1',
  'adv-health-assessment',
  'chem-phys-anesthesia',
];

export function getDistinctCourses() {
  const seen = new Set();
  Object.values(NODE_CONFIG).forEach(cfg => seen.add(cfg.courseId));

  // Sort by predefined order, then alphabetical for unknowns.
  const ordered = [...seen].sort((a, b) => {
    const ia = COURSE_ORDER.indexOf(a);
    const ib = COURSE_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });

  return ordered.map(courseId => ({
    courseId,
    label: COURSE_LABELS[courseId] || courseId,
    nodeCount: getNodesByCourse(courseId).length,
  }));
}
