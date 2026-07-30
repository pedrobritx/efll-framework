// Barrel re-export for all data modules.
// Note: `EXAMPLES` (./examples.js) and `getHandout` (./handouts.js) are *not*
// re-exported here. They're heavy and only consumed by the compose section —
// App.jsx loads them via dynamic import() so they're code-split.
export { THEMES } from './themes.js';
export { LEVELS } from './levels.js';
export { MACRO } from './macro.js';
export { PHASES, DEFAULT_PHASE_MINUTES } from './phases.js';
export {
  ARCHETYPES,
  STANDALONE,
  RECOMMENDED_ARCHETYPE_ID,
  ARCHETYPE_SYSTEM_EVIDENCE,
  archetypeById,
  phaseMinutesFor,
  TIGHT_PHASE_MINUTES,
  GENEROUS_PHASE_MINUTES,
} from './archetypes.js';
export { REFERENCE_GROUPS } from './references.js';
export { REPORT_INTRO, DECISIONS } from './rationale.js';
export {
  EVIDENCE_ITEMS,
  getEvidenceForSelection,
  getEvidenceForLevel,
  getEvidenceForTheme,
} from './evidence.js';
