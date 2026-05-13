# EFLL · English as a Foreign Language Lesson Framework

A CEFR-anchored macro grid (6 levels × 6 themes) and a seven-phase micro template for 60-minute lessons, grounded in SLA research from Krashen to Lyster and calibrated for Brazilian EFL classrooms. Pick a level and theme in **Part 02**, an activity per phase in **Part 03**, and **Part 04** assembles the lesson — downloadable as PDF, copyable as Markdown.

## Local development

Requires Node 20+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # preview the production build
```

Selections persist in `localStorage` under the key `lf-selections`. To clear them, click **Reset** at the bottom of Part 04, or run `localStorage.removeItem('lf-selections')` in the browser console.

## Deploy to GitHub Pages

1. Create a new GitHub repo named `efll-framework` (the name must match the `base` path in `vite.config.js`; if you pick a different name, update `base: '/<your-repo>/'`).
2. Push this directory to that repo's `main` branch.
3. In the repo's **Settings → Pages**, set **Source** to **GitHub Actions** (one-time manual step).
4. The workflow at `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
5. Site URL: `https://<your-github-username>.github.io/efll-framework/`.

## Project structure

```
├── index.html                    # mount point + Google Fonts preload
├── vite.config.js                # base path for project page URL
├── package.json
├── src/
│   ├── main.jsx                  # React 18 root
│   ├── App.jsx                   # all four parts + composer logic
│   ├── styles.css                # editorial design system + @media print
│   └── data/
│       ├── themes.js             # 6 thematic units
│       ├── levels.js             # 6 CEFR levels
│       ├── macro.js              # 6×6 can-do + bridge matrix
│       ├── phases.js             # 7 phases + activity options
│       └── examples.js           # 252 concrete prompts
├── .github/workflows/deploy.yml  # GitHub Pages deployment
└── lesson-framework.jsx          # original monolithic artifact — kept for reference
```

## PDF export

Clicking **Download PDF** triggers the browser's print dialog with a tuned `@media print` stylesheet — choose **Save as PDF**. The PDF preserves the editorial design (Fraunces, Newsreader, paper / wine / gold) and is vector-rendered with selectable text. Chrome produces the cleanest output; Safari and Firefox are close.

Before printing, the app waits on `document.fonts.ready` so the PDF uses Fraunces / Newsreader, not the Times fallback.

## Credits

A framework by **English with Pedro**. Grounded in Krashen · Long · Swain · Vygotsky · Lantolf · Norton · Dörnyei · Schmidt · Lyster · Ellis · Nation · García & Wei · Larsen-Freeman · Paiva.
