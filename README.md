# EFL Lesson Framework

**Evidence-based English lessons, planned in four steps.**

A guided planning tool for adult EFL teaching, built for the Brazilian context. It pairs
a **CEFR-anchored macro grid** — six themes across six levels, A1–C2 — with a
**seven-phase, 60-minute lesson** grounded in second language acquisition research, and
ties every level, theme, and activity to a citation you can read and trace.

Plan a lesson, then take it to class as a **PDF** or a **student handout**. No install,
no account; everything stays on the device.

**→ [lessonframework.britx.me](https://lessonframework.britx.me)**

![Welcome](docs/screenshots/01-welcome.png)

---

## Two scales at once

**Macro — the curriculum.** Six durable themes that *spiral* across levels: food at A1
becomes food sustainability at B2 and the philosophy of food at C1. Each level carries
its official CEFR descriptor and a planning emphasis; each theme carries a needs-based
rationale.

**Micro — the lesson.** Seven phases across 60 minutes, from lowering the affective
filter through input, noticing, output, and feedback, to an **informal-input bridge**
that follows learners back to the screen they were going to look at anyway.

Every step carries a **"Why this — the research"** panel: the construct, the citation,
the classroom implication, and an honest caveat.

![Level step with sources](docs/screenshots/03-level.png)

## Plan a lesson in four steps

| | Step | What happens |
|---|---|---|
| 1 | **Level** | Pick A1–C2. See what it means and the research behind it. |
| 2 | **Theme** | Pick one of six thematic units. See why it was chosen. |
| 3 | **Build** | Optionally say which of the unit's eight lessons this is, then step through the seven phases. A sensible activity is pre-selected for each. |
| 4 | **Your lesson** | A live lesson plan and student handout, editable inline. |

![Composed lesson](docs/screenshots/06-compose.png)

### Lessons within a unit

A unit is eight lessons, and each splits the same 60 minutes differently: lesson 1 spends
15 minutes on input and 10 on the communicative task; lesson 8 inverts that, with 25 on
the task and 5 on input. Choosing an **archetype** on the Build step redistributes the
seven phases accordingly, and every export carries it.

It is optional — leave it as *Standalone* and the lesson keeps the default split.

## Exports

- **Download PDF** — opens the print dialog with a tuned `@media print` stylesheet.
  Choose *Save as PDF*; the editorial design is preserved with selectable vector text.
  Chrome produces the cleanest result.
- **Copy as Markdown** — copies the lesson plan or the handout.

Every export carries the attribution credit required by the licence.

---

## Licence

**Dual-licensed** — see [LICENSE.md](./LICENSE.md).

- ✅ **Free, with attribution** — individual teachers and tutors, public schools, and any
  institution that charges students **no tuition**.
- 💼 **Commercial licence required** — tuition-charging private schools, franchises, and
  commercial course providers. Pricing on request: **pedrobritx@gmail.com**.

The source is public, but because commercial use is restricted this is
**source-available, not open source** in the OSI sense.

Required credit on shared or exported material:

> Created with EFL Lesson Framework — by Pedro Brito (BRITX) · https://lessonframework.britx.me

Voluntary support, separate from the commercial licence:
[buymeacoffee.com/pedrobritx](https://buymeacoffee.com/pedrobritx)

---

## Documentation

| | |
|---|---|
| [Framework overview](./docs/framework-overview.md) | The pedagogy: macro grid, four-strand budgets, seven phases, eight archetypes |
| [CANON](./docs/CANON.md) | Normative decisions. Where prose and `src/data/` disagree, the data wins |
| [Research](./docs/research/) | SLA reference, annotated bibliography, and the thesis this framework derives from |
| [Handout authoring](./docs/handout-authoring.md) | Level-calibration reference for handout tasks |
| [Contributing](./CONTRIBUTING.md) | Sign-off, standards for pedagogical content |

## Development

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:5173/
npm run build        # production bundle in dist/
npm run preview      # preview the production build
npm run validate     # framework data against schemas/
npm run check-links  # relative markdown links resolve
```

`validate` and `check-links` both run in CI on every pull request.

State persists in `localStorage`: lesson selections under `lf-selections`, the current
step under `lf-wizard`. Clear with **Reset** on *Your lesson*, or `localStorage.clear()`.

### Structure

```
src/
├── App.jsx                  the guided wizard and composer
├── components/              diagrams, evidence panels, manifesto, licence notice
├── data/                    ← single source of truth
│   ├── themes.js            6 thematic units
│   ├── levels.js            6 CEFR levels + four-strand budgets
│   ├── macro.js             6×6 can-do and informal-input bridge matrix
│   ├── phases.js            7 phases, 60 activity options
│   ├── archetypes.js        8 archetypes + per-phase minute budgets
│   ├── examples.js          252 teacher prompts
│   ├── handouts.js          2,160 student tasks, one per activity option
│   ├── evidence.js          SLA constructs, implications, limitations
│   ├── references.js        40 annotated references
│   └── credit.js            attribution strings
├── hooks/                   selections and wizard state
├── styles/                  editorial design system + @media print
└── wizard/steps.js          step model

schemas/                     JSON Schema (2020-12) for the framework data
tools/                       validate.mjs · check-links.mjs
docs/                        pedagogy, canon, research
```

### Deployment

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to
`main`, serving the root of **lessonframework.britx.me**. `vite.config.js` defaults
`base` to `/`; for a path-based deployment set `VITE_BASE_PATH` at build time.

---

Grounded in SLA, CEFR, and critical-literacy scholarship — Council of Europe · Krashen ·
Long · Swain · Vygotsky · Lantolf · Norton · Darvin · Dörnyei · Schmidt · Lyster · Ellis ·
Nation · Laufer & Hulstijn · García & Wei · Larsen-Freeman · VanPatten · Menezes de Souza
& Monte Mór.

**Pedro Brito (BRITX)** · [LinkedIn](https://www.linkedin.com/in/pedrobritx/) · [GitHub](https://github.com/pedrobritx)
