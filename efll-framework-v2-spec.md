# EFLL Framework v2 — Full Specification
*English with Pedro · Lesson Framework expansion*
*Status: locked decisions, ready for implementation*

---

## 0. What this document covers

Everything needed to build the `/compose` workspace and the Student Handout artifact, from routes to data shape to the pedagogical justification for every exercise-type assignment. The existing home-page reference content (sections 01–03, Principles, Footer) is **not touched**. All decisions below were settled through structured design conversation and locked before this spec was written.

---

## 1. Routes

| Route | Content | Notes |
|---|---|---|
| `/` | Existing scroll-spy home page | Unchanged except macro cell click now navigates to `/compose` with state pre-filled |
| `/compose` | Compose workspace | New route — selectors + toggle + output |
| `/compose/library` | Saved lessons list | New route |

**Router implementation:** `HashRouter` — required for GitHub Pages static hosting (no server redirect possible). URLs become `/#/compose`, `/#/compose/library`.

**Navigation bar changes:**

Current nav has scroll-spy section links (Overview · Macro · Micro · Principles). The new bar adds two top-level route links. Final structure:

```
[EFLL Framework]  |  Overview  Macro  Micro  Principles  |  Compose  Library
```

Scroll-spy links are active only when on `/`. On `/compose` and `/compose/library`, the scroll-spy links are still rendered but inert (or scroll-spy is simply suspended). `Compose` and `Library` are route links active on all pages.

---

## 2. Macro → Compose coupling

When the user clicks any cell in the Macro Grid (home page section 02), the app:

1. Writes `{ level, theme }` to the shared composition state in `localStorage`.
2. Navigates to `/#/compose`.
3. The compose selectors read that state on mount and initialize with those values.

This makes the home page a **selection funnel**: read the framework → identify your level and theme → click → land in Compose with it pre-loaded.

The reverse is also true: changes to Level or Theme selectors inside Compose update localStorage, so the home page macro cell reflects the current selection when the user navigates back.

---

## 3. localStorage schema

Two keys. Replace the existing `lf-selections` key with an expanded version.

### `lf-active`
The current working composition. Persists across sessions as the last state.

```js
{
  level: 'B1',           // A1 | A2 | B1 | B2 | C1 | C2
  theme: 'media',        // identity | daily | work | travel | media | society
  lesson: 3,             // 1–8 (archetype index)
  activities: {          // per-phase activity option index
    1: 0, 2: 1, 3: 0, 4: 2, 5: 0, 6: 1, 7: 0
  },
  custom: {              // per-phase user-edited text overrides
    2: 'Custom input instruction...'
  },
  teacherScript: false,  // Plan tab toggle
  activeOutput: 'plan'   // 'plan' | 'handout'
}
```

### `lf-library`
Array of saved lessons.

```js
[
  {
    id: '1716800000000',         // Date.now() as string — no UUID dependency
    name: 'B1 · Media · Lesson 3 — past tenses',  // editable, auto-generated default
    createdAt: '2026-05-15T10:00:00.000Z',
    updatedAt: '2026-05-15T10:00:00.000Z',
    level: 'B1',
    theme: 'media',
    lesson: 3,
    activities: { 1: 0, 2: 1, 3: 0, 4: 2, 5: 0, 6: 1, 7: 0 },
    custom: {},
    teacherScript: false
  }
]
```

**Save flow:** Explicit Save button. On click: snapshot `lf-active` → append to `lf-library` with generated id, name, and timestamps → show brief confirmation. If a lesson with this id already exists in the library, update it (i.e., re-saving an open library item updates rather than duplicates).

**Auto-generated name format:** `{LEVEL} · {Theme Name} · Lesson {N} — {archetype focus}`
Example: `B1 · Media & Story · Lesson 3 — first form focus`
The archetype focus string already exists in `ARCHETYPES[n].focus`.

---

## 4. Compose workspace — layout

```
NavBar
───────────────────────────────────────────────────
SELECTORS (grid visual language, same as existing)
  [ Level pills: A1 A2 B1 B2 C1 C2 ]
  [ Theme cells: I II III IV V VI ]
  [ Archetype cells: 1 2 3 4 5 6 7 8 ]
───────────────────────────────────────────────────
OUTPUT TOGGLE  [ Plan ][ Handout ]   Save button   Lesson name field
───────────────────────────────────────────────────
OUTPUT VIEW
  ↳ PlanView   (existing Compose output, unchanged)
  ↳ HandoutView (new)
───────────────────────────────────────────────────
```

**Selector visual language:** The Level pills, Theme cells, and Archetype cells must match the existing design exactly — same `lf-phase-btn` / `lf-level-btn` patterns, same active states (burgundy background, gold numerals). No new UI components for selectors.

**Output toggle:** Two pills in the same style as the level selector, but smaller weight — these are mode switches, not content selections. Label: `Plan` and `Handout`. Active pill: burgundy fill. Inactive: paper-deep background with border.

**Teacher script toggle:** Inside PlanView only. Single checkbox/toggle in the plan header row: `Teacher script`. When on, each phase card renders an additional teacher-script block below the activity description. This data comes from `CONTENT[level][theme][phase].plan.script`.

---

## 5. Data structure — merged CONTENT

Replace the separate `examples.js` file with `content.js`. The existing `phases.js`, `macro.js`, `themes.js`, `levels.js` files are unchanged.

```js
// src/data/content.js

export const CONTENT = {
  B1: {
    media: {
      1: {
        plan: {
          example: '...', // existing 252 prompt — preserved verbatim
          script: '...'   // teacher script for this phase (future, author alongside handout)
        },
        handout: {
          type: 'activation-prompt',
          prompts: [
            'What is the last series or film you watched in English?',
            'Can you describe one character in three adjectives?'
          ],
          // No tiers — Phase 1 is always prompt-only
          // No answer key — oral phase
        }
      },
      2: {
        plan: {
          example: '...',
          script: '...'
        },
        handout: {
          type: 'comprehension-noticing',
          contentSuggestions: [
            'A short text (150–200 words at B1) about the series or film you are using as input.',
            'Options: a plot summary paragraph, a character description, or a simplified review.',
            'Avoid transcripts — write or adapt a short original text inspired by the content.',
            'Bold or underline the target grammatical form in the text before printing.'
          ],
          noticingInstruction: 'Find and underline all examples of [target form] in the text above.',
          note: {
            // ≤5 min tier — language reference only, no full exercise
            text: 'Read the text your teacher provides. As you read, look for examples of [target form].',
            items: [
              { q: 'What is the text mainly about?' },
              { q: 'Find one example of [target form] in the text.' }
            ]
          },
          brief: {
            instructions: 'Read the text. Then answer the questions.',
            items: [
              { q: 'What is the text mainly about?', type: 'open' },
              { q: 'Who are the main people or characters?', type: 'open' },
              { q: 'Choose the best summary: A / B / C', type: 'mc', options: ['...', '...', '...'] },
              { q: 'True or False: [statement about text]', type: 'tf' },
              { q: 'Find and underline all examples of [target form] in the text.', type: 'noticing' }
            ]
          },
          full: {
            instructions: 'Read the text. Then answer the questions.',
            items: [
              // brief items +
              { q: 'What does the writer think about [topic]? Find evidence.', type: 'inference' },
              { q: 'Match the word to its meaning: [word bank]', type: 'matching' }
            ]
          },
          answerKey: {
            note: 'Check comprehension orally with the class.',
            brief: ['Varies — teacher confirms.', 'Varies.', 'C', 'False', 'See text — teacher confirms.'],
            full: ['...', '...', '...', '...', '...', 'Varies.', 'See word bank.']
          }
        }
      },
      3: {
        plan: { example: '...', script: '...' },
        handout: {
          type: 'inductive-form',
          note: {
            // ≤5 min — just the examples table, no rule-writing
            text: 'Look at these examples from the text.',
            tableHeaders: ['Example from the text', 'What changes?'],
            rows: [
              { example: '[Example 1]', note: '' },
              { example: '[Example 2]', note: '' },
              { example: '[Example 3]', note: '' }
            ]
          },
          brief: {
            instructions: 'Look at the examples. Identify the pattern. Complete the rule.',
            tableHeaders: ['Example from the text', 'What you notice'],
            rows: [
              { example: '[Example 1]', note: '' },
              { example: '[Example 2]', note: '' },
              { example: '[Example 3]', note: '' }
            ],
            ruleBlank: 'We use [form] when _______________.',
            confirmationItems: []  // 0 in brief tier
          },
          full: {
            instructions: 'Look at the examples. Identify the pattern. Complete the rule. Then check it.',
            tableHeaders: ['Example from the text', 'What you notice'],
            rows: [
              { example: '[Example 1]', note: '' },
              { example: '[Example 2]', note: '' },
              { example: '[Example 3]', note: '' },
              { example: '[Example 4]', note: '' },
              { example: '[Example 5]', note: '' }
            ],
            ruleBlank: 'We use [form] when _______________.',
            confirmationItems: [
              { q: 'Which sentence is correct? A / B', type: 'mc', options: ['...', '...'] },
              { q: 'Write your own example using [form].', type: 'open' }
            ]
          },
          answerKey: {
            note: 'Teacher confirms. See rule in plan notes.',
            brief: { rule: 'We use [form] when [condition]. (Teacher fills this in for the target form.)' },
            full: { rule: '...', items: ['A', 'Open — student production'] }
          }
        }
      },
      4: {
        plan: { example: '...', script: '...' },
        handout: {
          type: 'controlled-practice',
          // exerciseType is level-determined — see Section 6
          // items pool: full has 10, brief has 5, note has 3
          note: {
            instructions: 'Complete the sentences.',
            items: [
              { q: '___ [sentence 1]', answer: '...' },
              { q: '___ [sentence 2]', answer: '...' },
              { q: '___ [sentence 3]', answer: '...' }
            ]
          },
          brief: {
            instructions: 'Complete the sentences. Use the correct form.',
            items: [
              { q: '___ [1]', answer: '...' },
              { q: '___ [2]', answer: '...' },
              { q: '___ [3]', answer: '...' },
              { q: '___ [4]', answer: '...' },
              { q: '___ [5]', answer: '...' }
            ]
          },
          full: {
            instructions: 'Complete the sentences. Use the correct form.',
            items: [
              // 8 core items + 2 extension
            ],
            extension: { q: 'Write two sentences of your own using [form].', type: 'open' }
          },
          answerKey: {
            note: ['...', '...', '...'],
            brief: ['...', '...', '...', '...', '...'],
            full: ['...', '...', '...', '...', '...', '...', '...', '...', '...', '...', 'Open.']
          }
        }
      },
      5: {
        plan: { example: '...', script: '...' },
        handout: {
          type: 'task-card',
          // No tier — Phase 5 is always task-card format
          // Sentence frames vary by level (more at A1–B1, fewer at B2+)
          scenario: '[Describe the communicative situation — student-facing language]',
          goal: '[What you need to achieve by the end — a decision, plan, recommendation, or story]',
          sentenceFrames: [
            'I think / I believe ___.',
            'In my opinion, ___.',
            'What do you think about ___?',
            'I agree / disagree because ___.',
            'Let\'s decide on ___ because ___.'
          ],
          notesSpace: true   // renders a lined notes area in the print layout
          // No answer key — open production
        }
      },
      6: {
        plan: { example: '...', script: '...' },
        handout: {
          type: 'error-correction',
          note: {
            instructions: 'Find and correct the mistake in each sentence.',
            items: [
              { q: '[Sentence with one error]', answer: '[Corrected sentence]' },
              { q: '[Sentence with one error]', answer: '[Corrected sentence]' },
              { q: '[Sentence with one error]', answer: '[Corrected sentence]' }
            ]
          },
          brief: {
            instructions: 'Find and correct the mistake in each sentence.',
            items: [
              // 4 items (identical pool as full, first 4)
            ]
          },
          full: {
            instructions: 'Find and correct the mistake in each sentence.',
            items: [
              // 6 items
            ]
          },
          answerKey: {
            note: ['...', '...', '...'],
            brief: ['...', '...', '...', '...'],
            full: ['...', '...', '...', '...', '...', '...']
          },
          // Can-do self-assessment — drawn from MACRO[level][theme].cando at render time
          // No need to author these — the renderer injects them from the macro data
          selfAssessmentScale: ['1 — Not yet', '2 — Almost', '3 — Yes!']
        }
      },
      7: {
        plan: { example: '...', script: '...' },
        handout: {
          type: 'homework-log',
          // No tier — Phase 7 is always the same structure
          contentSuggestion: '[Specific content suggestion for this level/theme/lesson — names platform, title, episode or text]',
          noticingTask: 'As you [watch / listen / read], find 3 examples of [target form or vocabulary area]. Write them in the log below.',
          logColumns: ['What I found', 'Where (episode, minute, page)', 'What I noticed'],
          logRows: 4  // renders 4 rows in the grid
          // No answer key — open noticing
        }
      }
    }
    // ... other themes
  }
  // ... other levels
}
```

---

## 6. The three-tier system

The handout renderer reads `ARCHETYPES[lesson - 1].times[phaseIndex]` to determine which tier to render. The archetype times array already exists in the data.

| Phase time (minutes) | Tier rendered | Rationale |
|---|---|---|
| ≤ 5 | **note** — language reference box, 2–3 minimal items | DeKeyser: insufficient time for procedural practice; reference support only |
| 6–9 | **brief** — short exercise, 3–5 items | Enough for one practice cycle; retrieval without overrun |
| ≥ 10 | **full** — complete exercise with all items and extension | Full procedural cycle; Nation's fluency strand engaged |

**Phase-specific overrides:**

- **Phase 1** — no tier system. Always renders the activation-prompt card regardless of archetype time. Justification: the warm-up's function (affective filter reduction, schema activation) does not scale with time — a shorter warm-up just means fewer discussion questions, not a different artifact type.
- **Phase 5** — no tier system. Always renders the task card. The sentence frames count can reduce at higher archetypes with shorter Phase 5 time, but the card format stays constant. Justification: Ellis's task definition requires a non-linguistic outcome — compressing a task into a reference note destroys its communicative purpose.
- **Phase 7** — no tier system. Always renders the full homework log. The log is always needed regardless of archetype; what changes is the `contentSuggestion` and `noticingTask` strings.

---

## 7. Exercise type taxonomy by phase

The mapping below is the pedagogical core of the handout library. Every assignment is grounded in the SLA literature.

### Phase 1 — Activation Prompt Card

**SLA grounding:** Krashen (1985) — affective filter hypothesis (low-threat activation reduces anxiety before input); Dörnyei (2001) — motivational warm-up creates positive orientation toward the lesson theme; schema theory (Anderson 1977) — prior knowledge activation improves comprehension of subsequent input.

**Format:** Two discussion questions printed in large type, optionally with an image placeholder box labeled "Teacher: add image or write prompt on board." No answer key.

**Level calibration:**
- A1–A2: Single-clause questions with familiar vocabulary ("What do you eat for breakfast?")
- B1–B2: Questions requiring opinion or description ("How has your relationship with [theme] changed?")
- C1–C2: Abstract or hypothetical questions ("To what extent is [theme] culturally determined?")

---

### Phase 2 — Reading Comprehension + Noticing Task

**SLA grounding:** Krashen (1982) — comprehensible input hypothesis (i+1 input drives acquisition); Schmidt (1990) — noticing hypothesis (intake requires conscious attention to form); VanPatten (1996) — input processing (comprehension precedes form attention; tasks must sequence meaning-before-form).

**Exercise type family:** Reading Comprehension → Multiple-choice → Matching → Noticing task.

**Structure (all tiers include the noticing task — it is non-negotiable):**
1. Comprehension questions (varying count by tier)
2. Noticing instruction: "Find and underline all examples of [target form] in the text."

**Teacher content slot:** The text itself is always teacher-provided. The handout renders a visual placeholder box labeled with the `contentSuggestions` strings (visible on screen, hidden in print — the teacher prints with the actual text substituted).

**Level calibration:**
- A1: 100–130 words; picture support; yes/no and matching questions
- A2: 130–170 words; multiple-choice with 3 options
- B1: 170–220 words; multiple-choice + open inference
- B2: 220–280 words; multiple-choice + inference + vocabulary in context
- C1–C2: 300+ words; inference, implication, authorial stance questions

---

### Phase 3 — Inductive Discovery Table + Rule Completion

**SLA grounding:** Ellis (2005) — explicit instruction produces durable grammatical knowledge (meta-analysis); Norris & Ortega (2000) — explicit > implicit for form-focused outcomes; Long (1991) — focus on form (attention to form during meaning-focused activity); Schmidt (1990) — noticing as the necessary condition for learning.

**Exercise type:** Inductive discovery (not a Cambridge exam exercise type — this is pedagogically prior to controlled practice; the exam types are downstream of understanding).

**Structure:**
1. Header: "Look at these examples from the text."
2. 2-column table: [Example sentence | Space for learner note]
3. Rule completion blank: "We use [form] when ___."
4. (Full tier only) 1–2 confirmation items verifying the rule.

**Why inductive, not deductive:** The framework's Phase 2 precedes Phase 3 specifically to provide the input data from which learners form hypotheses. A deductive rule-first format would bypass the noticing done in Phase 2 and waste the cognitive work already done (Schmidt 1990; Ellis 2005).

**Level calibration:**
- A1: The table headers and example structure are given; learner fills in one pattern word. Rule blank is sentence-completed ("We add ___ to make it plural.")
- A2–B1: Learner identifies pattern and writes partial rule.
- B2+: Open discovery — learner writes the full rule from scratch, optionally including one exception.

**Cambridge exercise types used at confirmation step (full tier):**
- A1–B1: Multiple-choice (choose the correct form A/B)
- B1–B2: Open cloze (one word per blank, grammar-focused)
- B2–C2: Word formation, key word transformations

---

### Phase 4 — Controlled Practice

**SLA grounding:** DeKeyser (2007) — skill acquisition theory / automatization (declarative knowledge becomes procedural through practice); Long (1991) — form-focused instruction; Swain (1985) — pushed output (accuracy required under form-conscious conditions).

**Exercise type family:** This is where Cambridge exam exercise formats fit most directly. The choice of exercise type within Phase 4 is **level-determined**, not theme-determined, because the exercise type reflects the learner's capacity for metalinguistic control.

| Level | Primary exercise type | Rationale |
|---|---|---|
| A1 | Sentence completion with word bank | Reduces processing load; tests form recognition before production |
| A2 | Multiple-choice (3 options) + gap-fill with word bank | Adds distractor reasoning; word bank still scaffolds production |
| B1 | Open cloze (grammar-focused) + sentence completion | Removes word bank; tests independent form retrieval |
| B2 | Multiple-choice cloze (lexical — collocations, fixed phrases) + open cloze | Lexical precision as well as grammar |
| C1 | Key word transformations + open cloze | Full structural manipulation; paraphrase under constraints |
| C2 | Key word transformations (advanced) + error correction | Near-native grammatical judgment required |

**Cambridge exercise type definitions (for authoring reference):**

- **Multiple-choice cloze:** Gapped text; 4 options per gap; tests lexical choice, collocations, phrasal verbs, fixed phrases. Cambridge Use of English Part 1 (B2+). Simplified 3-option version used at A2–B1.
- **Open cloze:** Gapped text; one word per gap; no options given; tests grammatical knowledge (articles, prepositions, auxiliary verbs, conjunctions). Cambridge Use of English Part 2 (B2+). Adapted single-gap sentences used at B1.
- **Word formation:** A base word is given; learner derives the correct form (prefix/suffix). Tests morphological awareness. Cambridge Use of English Part 3 (B2+). Simplified 2-option version (noun/adjective) used at B1.
- **Key word transformations:** A sentence is given; learner rewrites it using a key word, keeping the meaning. Tests structural knowledge and paraphrase. Cambridge Use of English Part 4 (B2+). Not used below B2.
- **Sentence completion:** A sentence with one or more blanks; learner writes the correct word(s). No options. Used at A2–B1. Closest to Cambridge Young Learners / KET format.

---

### Phase 5 — Task Card

**SLA grounding:** Ellis (2003) — task definition (four criteria: meaning-focused, real-world resemblance, non-linguistic outcome, language as means not end); Long (1996) — interaction hypothesis (negotiation of meaning drives acquisition); Swain (1985) — output hypothesis (pushed output triggers noticing and hypothesis-testing); Mackey & Goo (2007) — interaction meta-analysis (d ≈ 1.09 for tasks with interaction).

**Format:** Task card — not an exercise, not a test. The handout prints as a distinct bordered card section.

**Structure:**
1. **Scenario** — student-facing description of the communicative situation (1–2 sentences)
2. **Your goal** — the non-linguistic outcome: a decision, recommendation, plan, narrative, or argument
3. **Sentence frames** — level-calibrated scaffolding
4. **Notes space** — lined area for planning or note-taking during the task

**Sentence frame count by level:**
- A1: 6–8 frames (highly scaffolded; learner assembles utterances from frames)
- A2: 5–6 frames
- B1: 4–5 frames
- B2: 2–3 frames (minimal; fluency and spontaneity foregrounded)
- C1–C2: 0–1 frame (only if a specific register or genre marker is targeted)

**No answer key.** The task produces open communicative output. The teacher assesses through observation (future rubric feature), not a printed key.

---

### Phase 6 — Error Correction + Can-Do Self-Assessment

**SLA grounding:** Lyster & Ranta (1997) — corrective feedback taxonomy (prompts that require learner-generated repair produce more uptake than recasts); Li (2010) — CF meta-analysis (d = 0.61–1.16; explicit focused CF most effective for form); Sheen (2007) — focused written CF on single target form produces acquisition; CEFR Companion Volume (2020) — can-do descriptors as learner self-assessment tool.

**Structure — two parts, always both:**

**Part A — Error Correction exercise:**
- 3 (note) / 4 (brief) / 6 (full) sentences, each containing one error in the target form from Phase 3.
- Instructions: "Find and correct the mistake in each sentence."
- Answer key: corrected sentence for each item.
- At B2+: Key word transformation format can replace simple correction — learner rewrites with a key word rather than just correcting.

**Part B — Can-Do Self-Assessment:**
- Always rendered regardless of tier or archetype time.
- 3 can-do statements pulled at render time from `MACRO[level][theme].cando` — no additional authoring needed.
- Scale: `1 — Not yet · 2 — Almost · 3 — Yes!`
- One blank row: "Something I want to practise more: ___"
- No answer key — self-assessment.

**Rationale for pairing correction and self-assessment:** Lyster & Ranta's uptake research shows corrective feedback is most effective when followed by explicit metacognitive processing. The self-assessment directly addresses the can-do statements the lesson targets, closing the pedagogical loop between Phase 6 and the macro grid.

---

### Phase 7 — Homework Brief + Noticing Log

**SLA grounding:** Schmidt (1990) — noticing is deliberate; homework logs instrumentalize noticing in informal input (without a structured noticing task, informal input exposure remains unconscious and drives incidental acquisition only); Nation (2001) — meaning-focused input strand (strand 1); Nation (2022) — informal digital input qualifies as strand 1 when volume is sufficient; Norton (2000) — investment (learner agency in content selection increases engagement and uptake).

**Structure — always the same format (no tier variation):**

1. **Assignment brief** (1 short paragraph): specific content + platform + episode or text
2. **Noticing task** (1 sentence): "As you [watch / listen / read], find 3 examples of [target form or vocabulary]. Write them below."
3. **Noticing log grid:** 4 rows × 3 columns

| What I found | Where (episode, time, page) | What I noticed |
|---|---|---|
| | | |
| | | |
| | | |
| | | |

4. **Optional reflection line:** "One thing that surprised me: ___"

**Print layout:** Phase 7 is always the final section of the handout. The log grid fills the remaining space at the bottom of the last page. Teachers collect the log at Phase 1 of the next lesson (the "What did you notice in [content]?" warm-up activity already in the phase options).

---

## 8. Handout header

Appears at the top of every printed handout. Visible on screen but optimized for print.

```
[ EFLL Framework  ·  English with Pedro ]          Level: [B1]
Name: _____________________________    Class: ___________    Date: ___________
─────────────────────────────────────────────────────────────────────────────
[Theme Name]  ·  Lesson [N]  ·  [Archetype Name]
```

`Level` is pre-populated from the composition state. `Name`, `Class`, and `Date` are blank lines for the student to complete. The theme, lesson, and archetype render from the composition state.

---

## 9. Answer key rendering

**On screen:** Answer keys are collapsed by default (toggle chevron). This lets the teacher review the key without students seeing it on a shared screen.

**In print (`@media print`):** Answer keys are always expanded and visible. They print as a separated section at the end of the handout, visually distinct (lighter background, italicized "Answer Key" header). The teacher can optionally cut the answer key off before distributing — standard Cambridge exam preparation practice.

**Key format by phase:**
- Phase 2 comprehension: short answers or letter (A/B/C). Noticing key: "See text — teacher confirms."
- Phase 3 rule: completed rule statement. Confirmation items: letters or short answers.
- Phase 4: one correct answer per item (or two for transformations).
- Phase 6 error correction: corrected sentence in full.
- Phase 6 self-assessment: "Personal responses — no answer key."
- Phases 1, 5, 7: "No answer key — communicative/reflective activity."

---

## 10. Print stylesheets — Handout

A new `@media print` block for the handout view, added to `styles.css`. The existing plan print block is unchanged.

**Hide in print:**
- NavBar
- ComposeSelectors
- OutputToggle
- SaveBar / lesson name field
- SLA grounding citations
- Answer key collapse toggles (keys always expand)
- Screen-only notes/instructions for teacher content slot

**Show in print:**
- HandoutHeader (full width)
- All 7 phase sections at the tier determined by the current archetype
- Answer keys (expanded, separated section)
- Phase 7 noticing log grid (ruled lines, 4 rows)

**Page break rules:**
- `page-break-before: always` before the Answer Key section
- `page-break-inside: avoid` on each phase section card
- Phase 5 task card: `page-break-inside: avoid` — the card must print whole

**Font/color:** Same Fraunces / Newsreader / JetBrains Mono. Same wine / gold / paper tokens. The handout uses the same design system as the plan PDF.

---

## 11. Component tree

```
App (HashRouter)
├── Route "/"           → HomeApp (existing — minor change: macro cell click navigates)
└── Route "/compose"    → ComposeApp
    ├── NavBar          (shared — extended with Compose + Library links)
    ├── ComposeSelectors
    │   ├── LevelGrid   (existing visual pattern, reads lf-active)
    │   ├── ThemeGrid   (existing visual pattern)
    │   └── ArchetypeGrid (existing visual pattern — currently called lessonPicker)
    ├── WorkspaceBar
    │   ├── OutputToggle   (2-pill: Plan | Handout)
    │   ├── LessonNameField (editable input, auto-generated default)
    │   └── SaveButton
    └── OutputView
        ├── PlanView    (existing Compose output)
        │   └── TeacherScriptToggle
        └── HandoutView (new)
            ├── HandoutHeader
            ├── HandoutPhase × 7
            │   ├── PhaseHeader (number, name, time — from PHASES data)
            │   ├── PhaseContent (renders note/brief/full tier from CONTENT)
            │   └── AnswerKey (collapsible on screen, expanded in print)
            └── (Phase 7 renders HomeworkLog inside HandoutPhase instead of AnswerKey)

Route "/compose/library" → LibraryApp
    ├── NavBar
    ├── LibraryHeader ("Saved Lessons")
    └── LessonList
        └── LessonCard × n
            ├── LessonName (editable inline)
            ├── LessonMeta (level · theme · archetype · saved date)
            └── Actions (Open | Delete)
```

---

## 12. Library (`/compose/library`)

**Open lesson:** Writes the saved lesson's state to `lf-active` in localStorage, then navigates to `/#/compose`. The compose workspace loads with that lesson's selections.

**Delete lesson:** Removes from `lf-library` array. No confirmation dialog needed — lessons are small data, and the teacher can re-compose quickly.

**Rename lesson:** Inline edit on the card — click name, type, press Enter or blur to save.

**Empty state:** "No saved lessons yet. Go to Compose and save your first lesson."

---

## 13. Authoring guide — the 252 handout entries

Each of the 36 cells (6 levels × 6 themes) needs 7 phase entries. What needs to be authored per cell, per phase:

| Phase | What to author | Effort |
|---|---|---|
| 1 | 2 discussion questions (level-calibrated) | Low |
| 2 | 2–3 content suggestions + 7 comprehension items (brief uses 5, full uses 7) + noticing instruction | Medium |
| 3 | 5 example rows + completed rule statement + 2 confirmation items | Medium |
| 4 | 10 controlled practice items (note uses 3, brief uses 5, full uses 10) + extension item + all answers | High |
| 5 | Scenario description + goal + sentence frames (count per level table above) | Medium |
| 6 | 6 error sentences + corrected versions + can-do statements (auto from MACRO) | Medium |
| 7 | Content suggestion (specific title/platform) + noticing task instruction | Low |

**Priority authoring order** (highest teaching frequency first):

1. B1 · Media & Story — fully worked out in the conversation export; author this first as the reference model
2. B1 · Identity & Belonging, B1 · Daily Life & Routines
3. A2 across all 6 themes
4. B2 across all 6 themes
5. A1 across all 6 themes
6. C1 across all 6 themes
7. C2 across all 6 themes — least urgent; highest instruction frequency is A2–B2

**Authoring process for each new cell:**

1. Write Phase 7 first — the content suggestion anchors the informal-input bridge and tells you what vocabulary and structures the lesson revolves around.
2. Write Phase 2 — the comprehension items and noticing task for that content.
3. Write Phase 3 — the inductive table using examples that would naturally appear in the Phase 2 text.
4. Write Phase 4 — the controlled practice items testing exactly the form from Phase 3.
5. Write Phase 6 — the error correction items use errors typical of that level on that form.
6. Write Phase 5 — the task scenario should connect to the theme and the vocabulary activated in Phases 2–4.
7. Write Phase 1 last — discussion questions should prime for Phase 2 content.

This order mirrors the SLA flow and ensures content coherence across the handout.

---

## 14. Open items — not blocked, but track

These are future features that the current spec must not prevent (no architectural dead-ends), but do not need to be built now.

| Feature | Implication for current build |
|---|---|
| Teacher script in Plan tab | `plan.script` field already included in CONTENT data shape — author later |
| Slides tab | State model already supports it — tab adds as third pill in OutputToggle |
| Homework tab | Same — fourth pill |
| Observation rubric (Cambridge / IELTS band descriptors) | No current impact — separate route eventually |
| Supabase sync | localStorage schema is already a flat serializable array — migration is a copy operation |
| Portuguese UI labels | All UI strings should use a constants object from the start, not inline strings, to make i18n trivial later |

---

*Spec complete. Next step: build `/compose` route skeleton with selectors, toggle, and save bar — then wire HandoutView for one cell (B1 · Media · Lesson 3) as the live reference before authoring the full 252.*
