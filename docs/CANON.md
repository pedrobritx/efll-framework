# CANON — pedagogical decisions

**Normative for this repository.** Where any other document conflicts with this one, this
one wins.

The framework was designed across several working sessions that produced internally
coherent documents disagreeing with each other. This records how those conflicts were
resolved.

---

## D1 — The 7-phase template is the canonical pedagogy

Three incompatible answers to "what is the shape of a lesson?" existed at once: PPP by
default, a methodology-neutral pattern library, and this 7-phase hybrid. A fourth — a
10-stage flow — lived in a separate tool.

**The 7-phase template is canon.** PPP, ESA, TBLT, CLT, Dogme and the Lexical Approach
remain available for comparison, adaptation, and teacher training; none is the default.
The 10-stage flow is a *delivery profile* for online 1-to-1 — the same seven phases with
checking and answer-reveal given their own screen-shared stages — not a rival pedagogy.

It is the only one of the four grounded phase-by-phase in named research, implemented in
working software, and carried through a complete syllabus.

## D2 — Archetype identity is positional, not nominal

Two archetype name sets existed, and only one carried the per-phase minute budgets.

**Identity is the position in the unit, `1` through `8`.** Both vocabularies resolve to
it: `name` is the timing-bearing set, `aka` is the Course Syllabus set.

> ⚠ **Never resolve archetypes by name.** "Productive Stretch" is the canonical name of
> **archetype 5** and simultaneously the syllabus name for **archetype 7**. Matching on
> the string assigns a lesson with a 20-minute Phase 5 to a slot budgeted for 18, or the
> reverse. `npm run validate` reports the collision on every run.

The syllabus names are arguably the better descriptors — "Pushed Output" is more honest
than "Productive Stretch". Changing them is one `name` field per archetype; positional
ids are what make that reversible.

## D3 — Strand budgets come from the per-level hour allocation

Three accounts of Nation's four strands existed: per-level hours, a flat 25% each, and
per-level percentages matching neither.

**The per-level hours in `src/data/levels.js` are canon.** All four strands total 60
hours at every level.

| Level | Input | Output | Language-focused | Fluency |
|---|---|---|---|---|
| A1 | 18 h | 12 h | 18 h | 12 h |
| A2 | 18 h | 15 h | 15 h | 12 h |
| B1 | 18 h | 18 h | 12 h | 12 h |
| B2 | 18 h | 18 h | 10 h | 14 h |
| C1 | 20 h | 18 h | 8 h | 14 h |
| C2 | 22 h | 20 h | 4 h | 14 h |

Form work declines as level rises; input and output grow.

**The budget is per level across 60 contact hours, not per unit.** An 8-hour unit does not
owe two hours to each strand. Units deviate freely, and the archetype sequence is how that
deviation is organised.

## D4 — The framework spans A1–C2; a programme is an instance of it

- **This repository is the framework**, A1–C2: 6 themes × 6 levels = 36 macro cells;
  36 × 7 phases = 252 prompts; 2,160 handout tasks. Complete.
- **A programme instantiates it** for a particular course and lives with the platform that
  delivers it. The flagship syllabus covers A2–C1 in 48 units; A1 and C2 are first-class
  here and simply unused by it.

## D5 — `src/data/` is the single source of truth

**`src/data/` is authoritative**, validated by `npm run validate` against `schemas/`.

A previous arrangement mirrored this data into a separate repository, and the mirror
drifted — 49 activity options on one side, 60 on the other. `tools/validate.mjs` therefore
imports the data modules **directly** rather than through a generated copy. A copy is a
second source, and a second source drifts.

Prose in `docs/` explains the reasoning. Where prose and `src/data/` disagree, the data
wins, because the data is the copy that is tested.
