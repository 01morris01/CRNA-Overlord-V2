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
