# Research

The evidence base the framework rests on. Moved here from the retired `ets`
specifications repository, which was archived once its contents found their proper homes.

| Document | What it is |
|---|---|
| [`sla-reference.md`](./sla-reference.md) | Annotated SLA/ESL reference across twelve themes — input, interaction, output, sociocultural theory, identity and motivation, noticing, corrective feedback, implicit/explicit knowledge, vocabulary, translanguaging, complex dynamic systems, TBLT |
| [`annotated-bibliography.md`](./annotated-bibliography.md) | Thirteen sections covering CEFR, IPA, Cambridge and IELTS, in both official and academic sources, with methodological caveats |
| [`thesis-framework.md`](./thesis-framework.md) | *"I Learned English from Netflix"* — the Master's framework on informal digital exposure and formal instruction in Brazilian EFL, from which this teaching framework was derived |

## How this connects to the code

These documents are the reasoning; `src/data/` is the operational form.

- Per-phase and per-activity `sla` strings in `src/data/phases.js` name the construct
- `src/data/evidence.js` holds the citation, the classroom implication, and an honest limitation for each construct
- `src/data/references.js` groups the full citations and cross-links them to the parts of the framework they support

The validator checks that every phase and activity cites *something*, and that every
`evidence` key resolves to a real entry. It cannot check that a citation actually
supports the claim — that is a human review, and it is the review that matters most.

## A standing caveat

The compendium tilts Anglophone and cognitivist. Conversation analysis for SLA, L2
pragmatics, and Brazilian applied linguistics are under-represented relative to their
importance for this framework's actual context. Citation counts are not truth — a
heavily cited paper is sometimes heavily argued against — and SLA's replication record
is modest. Meta-analyses inherit the quality of the studies they pool.

Where the framework makes a strong claim, prefer the limitation field in
`evidence.js` over the confident summary.
