# Contributing

Thanks for wanting to improve the EFL Lesson Framework.

Corrections to the pedagogy, better handout tasks, additional activity options with
real SLA grounding, accessibility fixes, and bug reports are all welcome.

---

## Before you send code: the sign-off

This project is **dual-licensed** — free for individual teachers and tuition-free
institutions, paid for tuition-charging institutions (see [LICENSE.md](./LICENSE.md)).
Selling commercial licences requires the copyright holder to be able to license
*the whole work*, including your contribution.

By default, you would keep copyright in whatever you contribute — which would leave
the commercial licence unable to cover it. So every contribution needs a sign-off.

We use the [Developer Certificate of Origin](https://developercertificate.org/) (DCO),
plus one additional clause covering the dual licence. Add a `Signed-off-by` line to
each commit:

```
git commit -s -m "Fix the B1 media handout for phase 4"
```

which appends:

```
Signed-off-by: Your Name <your.email@example.com>
```

**By signing off you certify the DCO, and additionally grant the copyright holder a
perpetual, worldwide, non-exclusive, royalty-free right to license your contribution
under both the free and the commercial terms in LICENSE.md, including in BRITX
products.**

You keep copyright in your contribution. You are granting a licence, not assigning
ownership.

Pull requests without a sign-off can't be merged. If you forget, amend with
`git commit --amend -s` and force-push.

---

## What makes a good contribution

**Pedagogical content** — activity options, handout tasks, prompts — must be:

- **grounded**: name the SLA construct and a real citation. `sla: 'Nation — fluency
  development strand'` is the bar. If you cannot cite it, it does not go in.
- **specific**: "Watch *The Good Place* S1E2, note 3 character adjectives" beats
  "watch something in English."
- **level-calibrated**: check `src/data/levels.js` and the surrounding entries in the
  cell you are editing.

**Do not invent citations.** A plausible-looking reference to a paper that does not
say what is claimed is worse than no citation, because it survives review by looking
right. If you are unsure a source supports the claim, say so in the PR.

**Data changes must validate.** Run:

```
npm run validate
```

This checks archetype budgets sum to 60, strand hours sum to 60, macro-grid and
prompt-library completeness, and handout tier calibration.

---

## What belongs here, and what does not

This repository owns **the pedagogy**: what is true for every teacher.

It does **not** own students, accounts, persistence, or delivery — those live in the
Lexis platform. If your change assumes a specific learner exists, it belongs there,
not here.

---

## Before opening a pull request

```
npm ci
npm run build       # must succeed
npm run validate    # must pass
```

Then describe *why* the change is right pedagogically, not just what it does. For
content changes, that reasoning is the review.
