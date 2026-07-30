import { DEFAULT_PHASE_MINUTES } from './phases.js';

// ─── LESSON ARCHETYPES ───────────────────────────────────────────────────
// A unit is eight lessons. Each plays a different role, and that role shows up
// as a different distribution of the same seven phases across the same 60
// minutes. Lesson 1 spends 15 minutes on input and 10 on the communicative
// task; lesson 8 inverts that, spending 25 on the task and 5 on input.
//
// This is what `phases.js` anticipated: "Default minute allocations (sum to 60).
// These can be overridden per archetype later."
//
// Choosing an archetype is OPTIONAL. With none chosen the lesson is a
// standalone 60 minutes on DEFAULT_PHASE_MINUTES — the behaviour every existing
// saved lesson already has.
//
// `name` is the timing-bearing vocabulary; `aka` is the Course Syllabus naming
// for the same position. Both are carried because they disagree, and resolving
// an archetype by NAME is unsafe: "Productive Stretch" is the canonical name of
// archetype 5 and simultaneously the syllabus name for archetype 7. Always
// resolve by `id` — the position in the unit is the identity.
//
// `evidence` keys index EVIDENCE_ITEMS (see data/evidence.js), matching the
// convention used by levels.js and themes.js.

export const ARCHETYPES = [
  {
    id: 1,
    name: 'Introduction & Diagnostic',
    aka: 'Introduction & Diagnostic',
    focus: 'Surface prior knowledge, set unit goals, pre-test informally.',
    phaseMinutes: [10, 15, 5, 8, 10, 7, 5],
    whyThisArchetype:
      'Opens the unit. The long warm-up and long input phase buy you information: what learners already half-know, and where the gaps actually are. Form work is deliberately thin — you are diagnosing, not teaching a rule yet.',
    evidence: ['proficiencyVariability', 'affectiveReadiness'],
  },
  {
    id: 2,
    name: 'Input Saturation',
    aka: 'Input-Rich Discovery',
    focus: 'Maximize comprehensible input on the theme.',
    phaseMinutes: [5, 18, 8, 10, 10, 5, 4],
    whyThisArchetype:
      'The heaviest input lesson in the unit — 18 minutes, nearly a third of the hour. Learners meet the theme repeatedly before anyone names a rule, so the pattern has something to emerge from.',
    evidence: ['comprehensibleInput', 'noticing'],
  },
  {
    id: 3,
    name: 'First Form Focus',
    aka: 'First Form Focus',
    focus: 'Introduce the primary grammatical target of the unit.',
    phaseMinutes: [6, 10, 14, 12, 10, 5, 3],
    whyThisArchetype:
      "The unit's main grammatical target gets its first explicit treatment. Focus on form peaks at 14 minutes and controlled practice follows immediately at 12, so the rule is used while it is still fresh.",
    evidence: ['explicitInstruction', 'noticing'],
  },
  {
    id: 4,
    name: 'Midpoint Consolidation',
    aka: 'Midpoint Consolidation',
    focus: 'Recycle and integrate input and form.',
    phaseMinutes: [6, 10, 10, 10, 14, 6, 4],
    whyThisArchetype:
      'The most evenly balanced archetype, and the safest choice for a lesson without unit context. Nothing dominates; input, form, practice, and task all get roughly equal time.',
    evidence: ['strandBalanceOverTime', 'vocabularyEngagement'],
  },
  {
    id: 5,
    name: 'Productive Stretch',
    aka: 'Pushed Output',
    focus: 'Push output and accuracy under communicative pressure.',
    phaseMinutes: [5, 8, 8, 12, 18, 6, 3],
    whyThisArchetype:
      'Output-dominant: 18 minutes of communicative task on top of 12 of controlled practice. Learners have to say more than they comfortably can, which is where they notice the gap between meaning and means.',
    evidence: ['pushedOutput', 'interactionNegotiation'],
  },
  {
    id: 6,
    name: 'Second Form Focus',
    aka: 'Form Refinement',
    focus: 'Introduce a secondary form or expand the first.',
    phaseMinutes: [6, 10, 12, 10, 14, 5, 3],
    whyThisArchetype:
      'A second pass at form — either a new feature or a deeper cut at the first one, now that learners have produced it and made errors worth addressing.',
    evidence: ['correctiveFeedback', 'explicitInstruction'],
  },
  {
    id: 7,
    name: 'Performance Rehearsal',
    aka: 'Productive Stretch',
    focus: 'Prepare for the unit final task.',
    phaseMinutes: [5, 8, 6, 10, 20, 7, 4],
    whyThisArchetype:
      'A dry run for lesson 8. Twenty minutes of task with form work cut to 6: the language is no longer new, so the time goes into using it faster and more fluently before it is assessed.',
    evidence: ['fluencyDevelopment', 'pushedOutput'],
  },
  {
    id: 8,
    name: 'Unit Task & Reflection',
    aka: 'Synthesis & Assessment',
    focus: 'Deliver assessable performance and self-assess.',
    phaseMinutes: [5, 5, 4, 8, 25, 10, 3],
    whyThisArchetype:
      'Closes the unit. The task takes 25 minutes and feedback doubles to 10 — the longest reflection slot of any archetype, because this is the lesson that produces the portfolio piece and the can-do check.',
    evidence: ['taskBasedOutcome', 'graduatedFeedback'],
  },
];

// No archetype selected — a standalone lesson on the default minute split.
export const STANDALONE = null;

// The sensible pick for a regular lesson with no unit context: the balanced one.
// Offered as a recommendation, never applied automatically — defaulting to an
// archetype would silently change the minutes a returning teacher already sees.
export const RECOMMENDED_ARCHETYPE_ID = 4;

// Evidence for the archetype *concept*, shown when explaining the selector
// itself rather than any one option.
export const ARCHETYPE_SYSTEM_EVIDENCE = ['strandBalanceOverTime', 'thematicSpiral'];

/** The archetype object for an id, or null for a standalone lesson. */
export function archetypeById(id) {
  if (id == null) return null;
  return ARCHETYPES.find((a) => a.id === id) ?? null;
}

/**
 * Per-phase minutes for a lesson, indexed by phase order (phase 1 at [0]).
 * Falls back to the standalone default when no archetype is chosen, so callers
 * never have to special-case null.
 *
 * @param {number|null} archetypeId
 * @returns {number[]} seven minute values summing to 60
 */
export function phaseMinutesFor(archetypeId) {
  return archetypeById(archetypeId)?.phaseMinutes ?? DEFAULT_PHASE_MINUTES;
}

// Phase budgets at the extremes, used to hint that an activity should be chosen
// to fit. Thresholds are descriptive of the data: across all eight archetypes
// the per-phase budgets run 3–25 minutes.
export const TIGHT_PHASE_MINUTES = 5;
export const GENEROUS_PHASE_MINUTES = 18;
