# Contributing

Corrections to the pedagogy, better handout tasks, additional activity options with real
SLA grounding, accessibility fixes, and bug reports are all welcome.

---

## The sign-off

This project is [dual-licensed](./LICENSE.md), and selling commercial licences requires
the copyright holder to be able to license *the whole work* — including your
contribution. By default you would keep copyright in what you contribute, which would
leave the commercial licence unable to cover it.

So every commit needs a sign-off:

```
git commit -s -m "Fix the B1 media handout for phase 4"
```

which appends `Signed-off-by: Your Name <your.email@example.com>`.

**By signing off you certify the [Developer Certificate of Origin](https://developercertificate.org/),
and additionally grant the copyright holder a perpetual, worldwide, non-exclusive,
royalty-free right to license your contribution under both the free and the commercial
terms in LICENSE.md, including in BRITX products.**

You keep copyright. You are granting a licence, not assigning ownership.

Pull requests without a sign-off cannot be merged; amend with `git commit --amend -s`.

## What makes a good contribution

Pedagogical content — activity options, handout tasks, prompts — must be:

- **Grounded.** Name the SLA construct and a real citation. `sla: 'Nation — fluency
  development strand'` is the bar. If you cannot cite it, it does not go in.
- **Specific.** "Watch *The Good Place* S1E2, note 3 character adjectives" beats "watch
  something in English."
- **Level-calibrated.** Check `src/data/levels.js` and the surrounding entries in the
  cell you are editing.

**Do not invent citations.** A plausible reference to a paper that does not say what is
claimed is worse than no citation, because it survives review by looking right. If you
are unsure a source supports the claim, say so in the pull request.

## Scope

This repository owns **the pedagogy**: what is true for every teacher. It does not own
students, accounts, persistence, or delivery — those belong to the Lexis platform. If
your change assumes a specific learner exists, it belongs there.

## Before opening a pull request

```
npm ci
npm run build        # must succeed
npm run validate     # must pass
npm run check-links  # must pass
```

`validate` checks archetype budgets sum to 60, strand hours sum to 60, macro-grid and
prompt-library completeness, and one handout task per activity option.

Then describe *why* the change is right pedagogically, not just what it does. For content
changes, that reasoning is the review.

---

**Pedro Brito (BRITX)** · [LinkedIn](https://www.linkedin.com/in/pedrobritx/) · [GitHub](https://github.com/pedrobritx)
