# Handout authoring

How to write and calibrate student-facing handout tasks.

`src/data/handouts.js` holds one task per *activity option* —
`HANDOUTS[level][theme][phase][activityIdx]` — so choosing an activity brings its handout
task with it. All 2,160 are authored across all 36 macro cells.

To change one: edit `src/data/handouts.js` and run `npm run validate`, which checks that
every phase has exactly one task per activity option.

---

## Author the phases in this order

Not 1 through 7:

```
7 → 2 → 3 → 4 → 6 → 5 → 1
```

**Phase 7 first.** The content suggestion anchors everything — once you have named the
episode, article, or podcast, you know what vocabulary and which structures the lesson
revolves around. Choosing content last produces a lesson whose bridge does not fit it.

Then **Phase 2** (comprehension and noticing for that content), **Phase 3** (an inductive
table using examples that would plausibly appear in the Phase 2 text), **Phase 4**
(controlled practice on exactly the form Phase 3 discovered), **Phase 6** (error
correction using mistakes learners at this level actually make on that form), **Phase 5**
(a task connected to the theme and the vocabulary activated in 2–4), and **Phase 1** last
— the discussion questions prime for Phase 2, which you can only do once it exists.

This mirrors the SLA flow and is what keeps a cell internally coherent rather than seven
unrelated exercises sharing a header.

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

**Phase 4 — exercise type is level-determined, not theme-determined.** It reflects the
learner's capacity for metalinguistic control, so it does not vary by topic.

| Level | Exercise type |
|---|---|
| A1 | Sentence completion with word bank |
| A2 | Multiple choice + gap fill |
| B1 | Open cloze + sentence completion |
| B2 | Multiple-choice cloze + open cloze |
| C1 | Key-word transformation + open cloze |
| C2 | Key-word transformation + error correction |

**Phase 5 — sentence frames fall as level rises:** A1 6–8 · A2 5–6 · B1 4–5 · B2 2–3 ·
C1–C2 0–1.

**Phase 3 — how much of the rule the learner writes:** at A1 the structure is given and
they supply one word; at A2–B1 they identify the pattern and write a partial rule; at B2+
they write it from scratch, ideally including an exception.

---

## Rules that are not negotiable

**The Phase 2 text is always teacher-provided.** Author content *suggestions*, never the
text itself. This keeps the library free of third-party content and lets one cell serve
any series or article at that level.

**The noticing task appears in every Phase 2 handout.** Intake requires conscious
attention to form; a Phase 2 without it is not doing its job.

**Phase 3 is inductive, never deductive.** Phase 2 supplied the input the learner reasons
from; a rule-first table throws that away.

**Phase 7 must name a platform and a specific title, episode, or text.** "Watch something
in English" is not a bridge. Recommendations must be specific, accessible on platforms
learners already have, and level-calibrated.

**Can-do statements are never authored here.** Phase 6 pulls three at render time from
[`src/data/macro.js`](../src/data/macro.js). Writing them into the handout would duplicate
them and let them drift.

---

## Answer keys

The handout library carries tasks, not answers. This is a known gap.

The one worked example — a full macro cell with teacher scripts and answer keys — is kept
in the Lexis repository as a specimen rather than a template. Because the Phase 2 text is
teacher-provided, a key has to be written against *their* text, which argues for
generating keys per lesson rather than authoring them per cell.
