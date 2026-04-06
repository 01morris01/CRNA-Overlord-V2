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

import { OPIOIDS_QUESTIONS, OPIOIDS_METADATA } from '../data/questions/opioids-chapter9.js';
import { NMB_QUESTIONS,    NMB_METADATA    } from '../data/questions/nmb-chapter10.js';
import { MACHINE_QUESTIONS, MACHINE_METADATA } from '../data/questions/anesthesia-machine-chapter11.js';

// ─── Registry ─────────────────────────────────────────────────────────────────

export const NODE_CONFIG = {

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
    title:             "Anesthesia Machine",
    chapterLabel:      "Ch. 11",
    badgeLabel:        "MACHINE Ch.11",
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
