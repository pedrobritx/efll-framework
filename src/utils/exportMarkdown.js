import { PHASES } from '../data/phases.js';
import { getEvidenceForSelection } from '../data/evidence.js';
import { CREDIT_MARKDOWN } from '../data/credit.js';

/**
 * Build a Markdown string for the composed lesson plan.
 *
 * @param {Object} params
 * @param {Object} params.themeData   – theme object ({ name, num, … })
 * @param {Object} params.levelData   – level object ({ id, name, … })
 * @param {string} params.level       – level id, e.g. 'B1'
 * @param {Object} params.macroCell   – MACRO[level][theme] cell
 * @param {Function} params.getExample      – (phaseId) => string
 * @param {Function} params.selectedActivityIdx – (phaseId) => number
 * @param {Function} params.minutesFor      – (phaseId) => number, from the chosen archetype
 * @param {Object|null} params.archetypeData – archetype object, or null for a standalone lesson
 * @returns {string} Markdown content
 */
export function buildMarkdown({
  themeData,
  levelData,
  level,
  macroCell,
  getExample,
  selectedActivityIdx,
  minutesFor,
  archetypeData,
}) {
  const minutes = minutesFor ?? ((phaseId) => PHASES.find((p) => p.id === phaseId)?.defaultMin ?? 0);
  let md = `# Lesson Plan — ${themeData.name}\n\n`;
  md += `**Level:** ${level} · ${levelData.name}\n`;
  md += `**Unit:** ${themeData.num}. ${themeData.name}\n`;
  md += archetypeData
    ? `**Lesson:** ${archetypeData.id} of 8 · ${archetypeData.name} — ${archetypeData.focus}\n\n`
    : `**Lesson:** standalone (default 60-minute split)\n\n`;
  md += `## Can-do outcomes\n\n`;
  macroCell.cando.forEach((c) => {
    md += `- I can ${c}.\n`;
  });
  md += `\n## Informal-input bridge\n\n`;
  macroCell.bridge.forEach((b) => {
    md += `- ${b}\n`;
  });
  md += `\n---\n\n## Lesson plan (60 min)\n\n`;
  PHASES.forEach((phase) => {
    const actIdx = selectedActivityIdx(phase.id);
    const activity = phase.activities[actIdx];
    const example = getExample(phase.id);
    const evidenceItems = getEvidenceForSelection(phase, activity).slice(0, 2);
    md += `### Phase ${phase.id} — ${phase.name}\n`;
    md += `*${minutes(phase.id)} min · ${activity.name}*\n\n`;
    md += `${example}\n\n`;
    md += `> **SLA grounding:** ${activity.sla}\n\n`;
    if (evidenceItems.length) {
      md += `> **Evidence:** ${evidenceItems.map((item) => `${item.construct} (${item.citation})`).join('; ')}\n`;
      md += `> **Classroom implication:** ${evidenceItems.map((item) => item.implication).join(' ')}\n`;
      md += `> **Caveat:** ${evidenceItems.map((item) => item.limitation).join(' ')}\n\n`;
    }
  });
  md += `\n---\n${CREDIT_MARKDOWN}\n`;
  return md;
}
