#!/usr/bin/env node
/**
 * Validate the framework data in src/data/ against schemas/, then check the
 * cross-file invariants JSON Schema cannot express on its own.
 *
 * The data modules are imported directly rather than through a generated JSON copy.
 * That is deliberate: a copy is a second source, and a second source drifts. The
 * previous arrangement — this framework mirrored into a separate specs repository —
 * had silently reached 49 activities on one side and 60 on the other.
 *
 *     npm run validate
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

import { THEMES } from '../src/data/themes.js';
import { LEVELS } from '../src/data/levels.js';
import { PHASES, DEFAULT_PHASE_MINUTES } from '../src/data/phases.js';
import { ARCHETYPES } from '../src/data/archetypes.js';
import { MACRO } from '../src/data/macro.js';
import { EXAMPLES } from '../src/data/examples.js';
import { HANDOUTS } from '../src/data/handouts.js';
import { EVIDENCE_ITEMS } from '../src/data/evidence.js';

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const errors = [];
const warnings = [];
const notes = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

for (const file of readdirSync('schemas').filter((f) => f.endsWith('.json'))) {
  ajv.addSchema(JSON.parse(readFileSync(join('schemas', file), 'utf8')));
}

const BASE = 'https://github.com/pedrobritx/efl-lesson-framework/schemas/';
function checkAgainst(ref, label, data) {
  const validate = ajv.getSchema(ref);
  if (!validate) throw new Error(`cannot resolve schema ${ref}`);
  if (validate(data)) return true;
  for (const e of validate.errors ?? []) {
    err(label, `${e.instancePath || '/'} ${e.message}${e.params?.allowedValues ? ` (${e.params.allowedValues.join(', ')})` : ''}`);
  }
  return false;
}

// Icons are React components; strip them so the data can be validated as data.
const withoutIcons = (arr) => arr.map(({ icon, ...rest }) => rest);

// ── schema conformance ──────────────────────────────────────────────────────────
checkAgainst(`${BASE}framework.schema.json#/$defs/themes`, 'themes.js', withoutIcons(THEMES));
checkAgainst(`${BASE}framework.schema.json#/$defs/levels`, 'levels.js', LEVELS);
checkAgainst(`${BASE}framework.schema.json#/$defs/phases`, 'phases.js', withoutIcons(PHASES));
checkAgainst(`${BASE}framework.schema.json#/$defs/archetypes`, 'archetypes.js', ARCHETYPES);
checkAgainst(`${BASE}framework.schema.json#/$defs/macro`, 'macro.js', MACRO);
checkAgainst(`${BASE}framework.schema.json#/$defs/examples`, 'examples.js', EXAMPLES);
checkAgainst(`${BASE}handouts.schema.json`, 'handouts.js', HANDOUTS);

const themeIds = THEMES.map((t) => t.id);
const levelIds = LEVELS.map((l) => l.id);
const phaseIds = PHASES.map((p) => p.id);

// ── the invariants that actually bite ───────────────────────────────────────────

// Every archetype redistributes the same hour. A budget that does not total 60
// silently mis-times every lesson planned in that slot.
for (const a of ARCHETYPES) {
  const sum = a.phaseMinutes.reduce((x, y) => x + y, 0);
  if (sum !== 60) err('archetypes.js', `archetype ${a.id} (${a.name}) totals ${sum} min, expected 60`);
  if (a.phaseMinutes.length !== PHASES.length) {
    err('archetypes.js', `archetype ${a.id} has ${a.phaseMinutes.length} budgets for ${PHASES.length} phases`);
  }
  for (const key of a.evidence) {
    if (!EVIDENCE_ITEMS[key]) err('archetypes.js', `archetype ${a.id} cites unknown evidence key "${key}"`);
  }
}
const archetypeIds = ARCHETYPES.map((a) => a.id);
if (new Set(archetypeIds).size !== 8 || Math.min(...archetypeIds) !== 1 || Math.max(...archetypeIds) !== 8) {
  err('archetypes.js', 'ids must be exactly 1–8, each once');
}
// "Productive Stretch" is archetype 5's name and archetype 7's aka. Anything
// resolving by string mis-assigns a lesson. Surface every such collision.
const nameOwner = new Map(ARCHETYPES.map((a) => [a.name, a.id]));
for (const a of ARCHETYPES) {
  const clash = nameOwner.get(a.aka);
  if (clash !== undefined && clash !== a.id) {
    notes.push(`archetype ${a.id} aka "${a.aka}" is also archetype ${clash}'s name — resolve archetypes by id, never by name`);
  }
}

// The standalone default is what every lesson without an archetype uses.
const defaultSum = DEFAULT_PHASE_MINUTES.reduce((x, y) => x + y, 0);
if (defaultSum !== 60) err('phases.js', `DEFAULT_PHASE_MINUTES totals ${defaultSum}, expected 60`);
PHASES.forEach((p, i) => {
  if (p.defaultMin !== DEFAULT_PHASE_MINUTES[i]) {
    err('phases.js', `phase ${p.id} defaultMin ${p.defaultMin} ≠ DEFAULT_PHASE_MINUTES[${i}] ${DEFAULT_PHASE_MINUTES[i]}`);
  }
});

// Nation's four strands are budgeted per level across 60 contact hours.
for (const l of LEVELS) {
  const sum = Object.values(l.hours).reduce((x, y) => x + y, 0);
  if (sum !== 60) err('levels.js', `${l.id} strand hours total ${sum}, expected 60`);
}

// ── grid completeness ───────────────────────────────────────────────────────────
let macroCells = 0;
let promptCount = 0;
let handoutCount = 0;

for (const level of levelIds) {
  for (const theme of themeIds) {
    if (!MACRO[level]?.[theme]) { err('macro.js', `missing cell ${level}/${theme}`); continue; }
    macroCells++;

    for (const id of phaseIds) {
      if (!EXAMPLES[level]?.[theme]?.[id]) err('examples.js', `missing prompt ${level}/${theme}/phase ${id}`);
      else promptCount++;

      // The join between a chosen activity and its student instruction is the array
      // index. A short array yields an undefined task for the last activities —
      // invisible until a teacher picks one and prints a blank handout.
      const tasks = HANDOUTS[level]?.[theme]?.[id];
      const expected = PHASES[id - 1].activities.length;
      if (!Array.isArray(tasks)) {
        err('handouts.js', `missing tasks ${level}/${theme}/phase ${id}`);
      } else {
        handoutCount += tasks.length;
        if (tasks.length !== expected) {
          err('handouts.js', `${level}/${theme}/phase ${id} has ${tasks.length} tasks for ${expected} activities`);
        }
        tasks.forEach((t, i) => {
          if (/\bTODO\b|\bTBD\b|\bplaceholder\b/i.test(t)) {
            warn('handouts.js', `${level}/${theme}/phase ${id}[${i}] looks unfinished`);
          }
        });
      }
    }
  }
}

const expectedPrompts = levelIds.length * themeIds.length * phaseIds.length;
if (promptCount !== expectedPrompts) err('examples.js', `${promptCount} prompts, expected ${expectedPrompts}`);
const expectedHandouts = levelIds.length * themeIds.length * PHASES.reduce((s, p) => s + p.activities.length, 0);
if (handoutCount !== expectedHandouts) err('handouts.js', `${handoutCount} tasks, expected ${expectedHandouts}`);

// Every phase and activity must cite research — it is what distinguishes this
// framework from a list of classroom ideas.
for (const p of PHASES) {
  if (!p.sla?.trim()) err('phases.js', `phase ${p.id} cites no SLA grounding`);
  p.activities.forEach((a, i) => {
    if (!a.sla?.trim()) err('phases.js', `phase ${p.id} activity ${i} ("${a.name}") cites no SLA grounding`);
  });
}
for (const [label, list] of [['themes.js', THEMES], ['levels.js', LEVELS]]) {
  for (const entry of list) {
    for (const key of entry.evidence ?? []) {
      if (!EVIDENCE_ITEMS[key]) err(label, `${entry.id} cites unknown evidence key "${key}"`);
    }
  }
}

// The CLM and Activity schemas are published contracts with no instances in this
// repo yet; compiling them proves they are at least well-formed.
for (const ref of ['clm.schema.json', 'activity.schema.json']) {
  if (!ajv.getSchema(`${BASE}${ref}`)) err('schemas', `${ref} failed to compile`);
}

// ── report ──────────────────────────────────────────────────────────────────────
console.log('Framework');
console.log(`  ${THEMES.length} themes · ${LEVELS.length} levels · ${PHASES.length} phases · ${ARCHETYPES.length} archetypes`);
console.log(`  ${macroCells} macro cells · ${promptCount} prompts · ${handoutCount} handout tasks`);
console.log(`  archetype budgets: ${ARCHETYPES.map((a) => a.phaseMinutes.reduce((x, y) => x + y, 0)).join(' ')} min`);
console.log(`  strand budgets:    ${LEVELS.map((l) => Object.values(l.hours).reduce((x, y) => x + y, 0)).join(' ')} h`);
console.log(`  activities/phase:  ${PHASES.map((p) => p.activities.length).join(' ')}`);

if (notes.length) {
  console.log(`\n${notes.length} note(s):`);
  for (const n of notes) console.log(`  · ${n}`);
}
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ! ${w}`);
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('\n✓ all framework data valid');
