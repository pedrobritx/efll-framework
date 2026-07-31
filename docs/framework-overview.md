# The EFLL Framework

**Status:** Normative — this is the canonical pedagogy ([CANON.md](./CANON.md) D1)
**Last updated:** 2026-07-30

English as a Foreign Language, Lived — a lesson framework for adult EFL learners, developed for
the Brazilian context and adaptable beyond it. Two layers: a **macro** grid of what gets taught
across levels, and a **micro** template of how a single lesson runs.

Values in this document are explanatory. The authoritative copies live in
[`data/`](../src/data/) and are validated by `npm run validate`; where prose and data disagree,
data wins ([CANON.md](./CANON.md) D8).

---

## Design principles

1. **Can-do anchored.** Every unit targets specific CEFR descriptors as observable outcomes.
2. **Spiral, not linear.** Themes recur across levels with deepening complexity.
3. **Informal input is curricular, not residual.** Every lesson ends with a bridge into
   digital content the learner will actually consume. This is the framework's signature move.
4. **L1 is a tool, not a contaminant.** Portuguese is permitted where it does real work.
5. **Balanced across Nation's four strands**, budgeted explicitly per level.

---

## Macro layer — six themes × six levels

Six durable themes, each recurring at every level:

| | Theme | Covers |
|---|---|---|
| I | Identity & Belonging | self, family, communities |
| II | Daily Life & Routines | food, home, time, transport |
| III | Work & Study | school, career, professional identity |
| IV | Travel & Place | geography, mobility, intercultural encounters |
| V | Media & Story | entertainment, narrative, digital culture |
| VI | Society & Ideas | politics, environment, ethics, abstract argument |

Six levels, A1–C2. Six × six gives **36 macro cells**, each holding can-do statements and a
level-calibrated informal-input bridge naming specific content —
[`data/macro-grid.json`](../src/data/macro.js).

The framework spans all six levels. The EwP flagship programme instantiates A2–C1 only; see
[`docs/programme/`](https://github.com/pedrobritx/lexis/blob/main/docs/pedagogy/programme/syllabus.md) and [CANON.md](./CANON.md) D5.

### Nation's four strands

Each level allocates 60 contact hours across the four strands —
[`data/levels.json`](../src/data/levels.js), reproduced here as percentages:

| Level | Meaning-focused input | Meaning-focused output | Language-focused learning | Fluency development |
|---|---|---|---|---|
| A1 | 30% | 20% | 30% | 20% |
| A2 | 30% | 25% | 25% | 20% |
| B1 | 30% | 30% | 20% | 20% |
| B2 | 30% | 30% | 16.7% | 23.3% |
| C1 | 33.3% | 30% | 13.3% | 23.3% |
| C2 | 36.7% | 33.3% | 6.7% | 23.3% |

Form work declines as level rises; input and output grow. The budget is **per level across 60
hours**, not per unit — individual units deviate freely, and the archetype sequence is
precisely how that deviation is organised.

---

## Micro layer — the 7-phase lesson

Sixty minutes, seven phases, each grounded in named research —
[`data/phases.json`](../src/data/phases.js).

| # | Phase | Nominal | Purpose | Grounding |
|---|---|---|---|---|
| 1 | Warm-up & Schema Activation | 5–8 min | Lower the affective filter; activate prior knowledge | Krashen; schema theory |
| 2 | Input & Noticing | 10–12 min | Comprehensible input at i+1; engineer noticing | Krashen; Schmidt |
| 3 | Focus on Form | 8–10 min | Explicit attention to a feature noticed in Phase 2 | Ellis; Lantolf |
| 4 | Controlled Practice | 8–10 min | Safe hypothesis testing; automatisation | Swain; DeKeyser |
| 5 | Communicative Task | 12–15 min | A task with a non-linguistic outcome | Ellis; Long |
| 6 | Feedback & Reflection | 5–7 min | Graduated corrective feedback; metacognition | Lyster & Ranta; Aljaafreh & Lantolf |
| 7 | Informal-Input Bridge | 3–5 min | Curricular handoff to digital input | Schmidt; Nation; Norton |

Phase order is not arbitrary. Phase 3 follows Phase 2 so that learners form hypotheses from
input they have already processed — a rule-first presentation would waste that noticing. Phase
6 pairs correction with self-assessment because feedback produces most uptake when followed by
explicit metacognitive processing.

**Phase 7 is not homework in the ordinary sense.** Without a structured noticing task, informal
input stays unconscious and drives incidental acquisition only. The bridge instrumentalises it:
named content, a specific noticing task, a log collected at the start of the next lesson.

### Translanguaging policy

Portuguese is permitted in **Phase 3** (Focus on Form) and **Phase 6** (Feedback), plus
homework instructions. Phases 1, 2, 4, 5 and 7 run in English.

This is a considered position, not a concession. Metalinguistic work and feedback are where L1
does something English cannot do as efficiently, and franchise-style English-only purism costs
more in those two phases than it buys. Everywhere else, the target language is the medium.

---

## Unit layer — eight archetypes

A unit is eight lessons. Each plays a different role, shifting time across the seven phases.
All eight sum to 60 minutes — [`data/archetypes.json`](../src/data/archetypes.js).

| id | Archetype | P1 | P2 | P3 | P4 | P5 | P6 | P7 |
|---|---|---|---|---|---|---|---|---|
| 1 | Introduction & Diagnostic | 10 | 15 | 5 | 8 | 10 | 7 | 5 |
| 2 | Input Saturation | 5 | 18 | 8 | 10 | 10 | 5 | 4 |
| 3 | First Form Focus | 6 | 10 | 14 | 12 | 10 | 5 | 3 |
| 4 | Midpoint Consolidation | 6 | 10 | 10 | 10 | 14 | 6 | 4 |
| 5 | Productive Stretch | 5 | 8 | 8 | 12 | 18 | 6 | 3 |
| 6 | Second Form Focus | 6 | 10 | 12 | 10 | 14 | 5 | 3 |
| 7 | Performance Rehearsal | 5 | 8 | 6 | 10 | 20 | 7 | 4 |
| 8 | Unit Task & Reflection | 5 | 5 | 4 | 8 | 25 | 10 | 3 |

The arc runs from diagnosis through input, form, and consolidation to performance: Phase 5
grows from 10 minutes in lesson 1 to 25 in lesson 8, while Phase 2 shrinks from 15 to 5.

> **Resolve archetypes by `id`, never by name.** The Course Syllabus uses a second set of names
> for the same eight positions, and "Productive Stretch" is the canonical name of archetype 5
> *and* the syllabus name for archetype 7. Both vocabularies are recorded in `data/archetypes.json`
> as `name` and `aka`. See [CANON.md](./CANON.md) D2.

These minute budgets are load-bearing beyond planning: they drive the phase timings shown in
the composer, the micro-arc diagram, and both Markdown exports. Resolve them with
`phaseMinutesFor(archetypeId)`, which returns `DEFAULT_PHASE_MINUTES` for a standalone lesson.

---

## What is where

| | Path |
|---|---|
| Prompt library — 252 teacher-facing prompts, 6 levels × 6 themes × 7 phases | [`src/data/examples.js`](../src/data/examples.js) |
| Handout library — 2,160 student-facing tasks, keyed by activity | [`src/data/handouts.js`](../src/data/handouts.js) · [authoring reference](./handout-authoring.md) |
| Macro grid — can-do statements and informal-input bridges | [`src/data/macro.js`](../src/data/macro.js) |
| Phases, archetypes, levels, themes | [`src/data/`](../src/data/) |
| Evidence and citations | [`src/data/evidence.js`](../src/data/evidence.js), [`references.js`](../src/data/references.js) |
| Normative decisions | [`docs/CANON.md`](./CANON.md) |
| Research grounding | [`docs/research/`](./research/) |
| The application | [`src/App.jsx`](../src/App.jsx) |
