# Handout authoring reference

> **Partly superseded — read the banner before the guide.**
>
> This was written for a handout model that was designed but never built: one file per
> macro cell, three authored tiers per phase (`note` / `brief` / `full`) selected by the
> archetype's minute budget, with answer keys.
>
> **What was actually built is simpler and is already complete.** `src/data/handouts.js`
> holds one student-facing task per *activity option* — `HANDOUTS[level][theme][phase][activityIdx]`
> — so choosing an activity brings its handout task with it. That is 2,160 tasks across all
> 36 cells, authored, rather than 252 entries of which one was done.
>
> **Still valid, and the reason this document survives:** the level-calibration tables
> below (text length, exercise type, sentence-frame count, how much of the rule the learner
> writes) and the non-negotiable rules. Those describe the pedagogy, not the file format.
>
> **No longer applies:** the three-tier system, the per-cell file layout, the priority
> authoring order, and the "copy the reference cell" workflow. Answer keys remain a genuine
> gap — the one worked example, with keys and teacher scripts, is kept at
> [`lexis/docs/pedagogy/reference/b1-media-worked-cell.json`](https://github.com/pedrobritx/lexis/blob/main/docs/pedagogy/reference/b1-media-worked-cell.json)
> should that gap ever be filled.
>
> To edit handout tasks today: change `src/data/handouts.js` and run `npm run validate`,
> which checks that every phase has exactly one task per activity option.

---

Validate after every cell:

```
npm run validate
```

---

## Author the phases in this order

Not 1 through 7. This order:

```
7 → 2 → 3 → 4 → 6 → 5 → 1
```

**Phase 7 first.** The content suggestion anchors everything — once you have named the episode,
article, or podcast, you know what vocabulary and which structures the lesson revolves around.
Choosing content last produces a lesson whose bridge does not fit it.

**Then Phase 2** — the comprehension items and noticing task for that content.
**Then Phase 3** — the inductive table, using examples that would plausibly appear in the
Phase 2 text.
**Then Phase 4** — controlled practice on exactly the form Phase 3 discovered.
**Then Phase 6** — error-correction items using mistakes learners at this level actually make on
this form.
**Then Phase 5** — a task connected to the theme and the vocabulary activated in Phases 2–4.
**Phase 1 last** — the discussion questions should prime for the Phase 2 content, which you can
only do once that content exists.

This mirrors the SLA flow and is what keeps a cell internally coherent rather than seven
unrelated exercises sharing a header.

---

## Effort per phase

| Phase | What to author | Effort |
|---|---|---|
| 1 | 2 discussion questions, level-calibrated | Low |
| 2 | 2–4 content suggestions · 7 comprehension items · noticing instruction · answer key | Medium |
| 3 | 5 example rows · rule statement · 2 confirmation items · answer key | Medium |
| 4 | 10 practice items · extension · all answers at three tiers | **High** |
| 5 | Scenario · goal · sentence frames | Medium |
| 6 | 6 error sentences with corrections | Medium |
| 7 | Content suggestion naming a platform and title · noticing task | Low |

Phase 4 is most of the work. Write the 10 full-tier items first; brief is the first 5 and note
is the first 3, so ordering matters — put the clearest items first.

---

## Tiers

Phases 2, 3, 4 and 6 carry three tiers. The renderer picks one from the archetype's minute
budget for that phase ([`src/data/archetypes.js`](../src/data/archetypes.js)):

| Phase minutes | Tier | Item count (P2 / P4 / P6) |
|---|---|---|
| ≤ 5 | `note` — reference box | 2–3 / 3 / 3 |
| 6–9 | `brief` — short exercise | 5 / 5 / 4 |
| ≥ 10 | `full` — complete exercise | 7 / 8–10 / 6 |

The validator warns when counts deviate, and when an answer key is shorter than its tier.

**Phases 1, 5 and 7 have no tiers.** A warm-up, a communicative task, and a noticing log do not
become different artifacts when time is short — they just get smaller. Compressing a task into a
reference note would destroy the non-linguistic outcome that makes it a task at all.

---

## Level calibration

**Phase 2 — text length and question type**

| Level | Words | Questions |
|---|---|---|
| A1 | 100–130 | Picture support; yes/no and matching |
| A2 | 130–170 | Multiple choice, 3 options |
| B1 | 170–220 | Multiple choice + open inference |
| B2 | 220–280 | + vocabulary in context |
| C1–C2 | 300+ | Inference, implication, authorial stance |

**Phase 4 — exercise type is level-determined, not theme-determined.** It reflects the learner's
capacity for metalinguistic control, so it does not vary by topic.

| Level | `exerciseType` |
|---|---|
| A1 | `sentence-completion-word-bank` |
| A2 | `multiple-choice-plus-gap-fill` |
| B1 | `open-cloze-plus-sentence-completion` |
| B2 | `multiple-choice-cloze-plus-open-cloze` |
| C1 | `key-word-transformation-plus-open-cloze` |
| C2 | `key-word-transformation-plus-error-correction` |

**Phase 5 — sentence frames fall as level rises:** A1 6–8 · A2 5–6 · B1 4–5 · B2 2–3 · C1–C2 0–1.

**Phase 3 — how much of the rule the learner writes:** at A1 the structure is given and they
supply one word; at A2–B1 they identify the pattern and write a partial rule; at B2+ they write
it from scratch, ideally including an exception.

---

## Rules that are not negotiable

**The Phase 2 text is always teacher-provided.** Author `contentSuggestions`, never the text
itself. It renders as an on-screen placeholder, hidden in print, and the teacher substitutes
real material. This keeps the library free of third-party content and lets one cell serve any
series or article at that level.

**The noticing task appears in every Phase 2 tier.** Including `note`. Intake requires conscious
attention to form; a tier that drops it is not doing Phase 2's job.

**Phase 3 is inductive, never deductive.** Phase 2 supplied the input the learner reasons from.
A rule-first table throws that away.

**Phase 7 must name a platform and a specific title, episode, or text.** "Watch something in
English" is not a bridge. Recommendations must be specific, accessible on platforms learners
already have, and level-calibrated.

**Can-do statements are never authored here.** Phase 6 pulls three at render time from
[`src/data/macro.js`](../src/data/macro.js). Writing them into the handout would
duplicate them and let them drift.

**Answer keys are collapsed on screen, expanded in print.** So a shared screen does not leak
them, and the teacher can cut the printed key off before distributing.

---

## Priority order

Highest teaching frequency first. A2–B2 is where most instruction happens; C2 is the least
urgent cell in the library.

1. ~~B1 · Media & Story~~ — done, the reference model
2. B1 · Identity & Belonging, B1 · Daily Life & Routines
3. A2 — all six themes
4. B2 — all six themes
5. A1 — all six themes
6. C1 — all six themes
7. C2 — all six themes

---

## Starting a new cell

```
cp data/content/B1/media.json data/content/<LEVEL>/<theme>.json
```

Then, in order: update `level` and `theme`; replace Phase 7's content suggestion with something
real at that level; work back through 2 → 3 → 4 → 6 → 5 → 1; set Phase 4's `exerciseType` from
the table above; adjust Phase 5's frame count; and run `npm run validate`.

Do not leave bracketed placeholders behind. A cell with `[Example 1]` in it validates
structurally and is useless in a classroom, which is the failure mode this guide exists to
prevent.
