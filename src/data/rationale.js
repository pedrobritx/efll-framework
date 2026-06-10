// ─── RESEARCH REPORT: DESIGN-DECISION RATIONALE ──────────────────────────────
// The "interactive report" content for the research step. Where references.js is
// the bibliography (who said what), this file is the argument (why the framework
// is built the way it is) — each decision paired with the evidence that motivates
// it AND the evidence that complicates it.
//
// Every citation, effect size, and caveat below is drawn from the project's
// Annotated Bibliography for ELT, SLA, and English-Language Assessment (verified
// pass). No figures are invented; contested points are flagged, not smoothed over.
//
// Shape:
//   REPORT_INTRO  → { lead, caveats: [{ title, body }] }
//   DECISIONS     → [{ id, kicker, title, rationale, support, temper,
//                      phases?: number[]  (micro phases it governs → jump links),
//                      groups: string[]   (reference-group ids in references.js) }]

export const REPORT_INTRO = {
  lead:
    'Every move the framework makes is a choice, and every choice should answer to evidence. ' +
    'This page traces each major decision — the shape of the macro grid, the seven phases of a ' +
    'lesson, the place of the first language — back to the research that motivates it and, just ' +
    'as deliberately, to the research that complicates it. Where the evidence is contested, the ' +
    'framework’s job is to take a defensible position, not to pretend the debate is closed.',

  // The four caveats the bibliography requires be kept in view throughout.
  caveats: [
    {
      title: 'Citation counts ≠ truth',
      body:
        'A reference appearing here is a reason, not a guarantee. Krashen’s Input Hypothesis is ' +
        'among the most-cited claims in the field and also widely judged non-falsifiable in its ' +
        'original form (McLaughlin 1987; Gregg 1984); Norton’s investment work is foundational yet ' +
        'rests on a narrow base of eight immigrant women in Canada. The framework cites these as ' +
        'productive ways to think, not settled law.',
    },
    {
      title: 'An Anglophone, cognitivist tilt',
      body:
        'Most of the canon below was produced in US, UK, and Canadian universities, working on ' +
        'European-language learners — a narrowness Ortega (2019) catalogues directly. Brazilian ' +
        'critical-literacy work (Menezes de Souza & Monte Mór) and Global-South translanguaging are ' +
        'included deliberately as counterweights, not footnotes.',
    },
    {
      title: 'Replication is thin',
      body:
        'Direct replications make up under 1% of published SLA studies (Marsden, Morgan-Short, ' +
        'Thompson & Abugaber 2018). Treat every single-study claim here as provisional until it has ' +
        'been corroborated.',
    },
    {
      title: 'Meta-analyses inherit their inputs',
      body:
        'An effect size is only as clean as the studies feeding it (Plonsky 2013). Where numbers ' +
        'appear, read them against L2-specific benchmarks — d ≈ .40 small, .70 medium, 1.00 large ' +
        '(Plonsky & Oswald 2014) — rather than Cohen’s generic ones.',
    },
  ],
};

export const DECISIONS = [
  {
    id: 'spiral',
    kicker: 'The macro grid',
    title: 'A spiral, not a staircase',
    rationale:
      'Each of the six themes returns at every CEFR level instead of being “covered” once and ' +
      'retired — the grid loops outward rather than climbing a ladder.',
    support:
      'Complex Dynamic Systems work (Larsen-Freeman 1997; Larsen-Freeman & Cameron 2008) treats ' +
      'language development as non-linear and variable, with progress that doubles back rather than ' +
      'advancing in clean steps — so a theme is never finished, it returns harder. The CEFR’s levels ' +
      'are themselves bands of ability, not cut-points (Council of Europe 2020), which is why the ' +
      'same theme can be re-entered at A2 and again at B2 without redundancy.',
    temper:
      'CDST is better at describing variability than predicting it: Gregg (2010) argues that in ' +
      'applied linguistics it usually works as metaphor rather than as a mathematical model. The ' +
      'spiral is therefore a design heuristic — a reason to expect uneven, recursive progress — not ' +
      'a claim that a learner’s trajectory can be computed.',
    groups: ['cdst', 'cefr'],
  },
  {
    id: 'themes',
    kicker: 'The six themes',
    title: 'Content from needs, not a contents page',
    rationale:
      'Themes are chosen for their hold on learners’ real lives — identity, daily life, work, ' +
      'travel, media, society — rather than inherited from a coursebook’s unit order.',
    support:
      'Needs analysis is the starting point for a defensible syllabus (Long 2015), and tasks retain ' +
      'vocabulary in proportion to the need, search, and evaluation they provoke (Laufer & Hulstijn ' +
      '2001) — themes learners are invested in generate exactly that load. For a Brazilian classroom, ' +
      'Nayar (1997) reframes the setting as a context of expanding English use rather than a deficient ' +
      '“EFL” one, and the letramento crítico tradition (Menezes de Souza & Monte Mór 2011) gives ' +
      'domestic grounding for rooting content in learners’ social worlds.',
    temper:
      'Relevance is not the same as rigour. A theme only earns its place when it also carries a real ' +
      'language demand; “engaging” content with no gap to close becomes a conversation class, not a ' +
      'lesson. The framework pairs each theme with a level-appropriate task so motivation and ' +
      'difficulty rise together.',
    groups: ['thematic', 'vocabulary'],
  },
  {
    id: 'cefr',
    kicker: 'Levelling',
    title: 'CEFR 2020 — and levels as bands, not gates',
    rationale:
      'Levels are set against the 2020 Companion Volume’s descriptor scales and treated as ' +
      'overlapping bands of ability rather than hard gates.',
    support:
      'The 2020 Companion Volume’s descriptors replace the 2001 set for new alignment work and add the ' +
      'scales the framework leans on, while the 2001 volume remains the source for the action-oriented ' +
      'architecture (Council of Europe 2001, 2020). North (2014), one of the framework’s principal ' +
      'authors, is the closest thing to an authorised account of how the descriptors are meant to be used.',
    temper:
      'The descriptors were largely intuitively scaled, and a single descriptor can cover ' +
      'qualitatively different proficiencies (Alderson 2007; Hulstijn 2007); harmonisation pressure also ' +
      'tempts providers to claim alignment without doing the validation (Fulcher 2004). So a “B1 lesson” ' +
      'is a centre of gravity, not a measurement.',
    groups: ['cefr'],
  },
  {
    id: 'phase1',
    kicker: 'Micro · Phase 1',
    title: 'Open by lowering the filter and opening identity',
    rationale:
      'The lesson begins by reducing anxiety and inviting learners to bring who they are into the ' +
      'room, before any new language is at stake.',
    support:
      'Krashen’s affective filter gives the intuitive case for starting low-stakes, and Norton (1995) ' +
      'reframes a “demotivated” student as one whose investment in the identities on offer is low — a ' +
      'diagnosis that changes the intervention. In EFL settings with little contact with a target ' +
      'community, an Ideal-L2-Self vision (Dörnyei 2005) gives motivation something concrete to attach to.',
    temper:
      'Vision is not achievement. Al-Hoorie’s (2018) meta-analysis of 39 samples (N ≈ 32,000) finds the ' +
      'Ideal L2 Self predicts self-reported intended effort strongly (r ≈ .61) but objective achievement ' +
      'only weakly (r ≈ .20). So Phase 1 buys engagement and a reason to try — it does not, on its own, ' +
      'buy outcomes, which is why the later phases carry the learning load.',
    phases: [1],
    groups: ['identity', 'input'],
  },
  {
    id: 'phase2',
    kicker: 'Micro · Phase 2',
    title: 'Comprehensible input, with noticing engineered in',
    rationale:
      'Learners meet the target language in rich, understandable input that has been shaped so the ' +
      'features that matter are hard to miss.',
    support:
      'Comprehensible input at i+1 (Krashen 1982) sets the floor, and Schmidt’s (1990) Noticing ' +
      'Hypothesis supplies the mechanism: focal awareness of a form in input is the gateway to intake, ' +
      'which is what justifies input flooding and enhancement rather than passive exposure.',
    temper:
      'Noticing’s causal reach is contested. Truscott (1998) argues it supports only metalinguistic ' +
      'knowledge, not grammar acquisition, and a neuro-ecological critique (Nguyen & Doan 2025) warns ' +
      'against the strong version of comprehensible input. The framework therefore treats engineered ' +
      'noticing as a high-value bet, not a guarantee — and pushes the form into use in the phases that ' +
      'follow rather than assuming exposure is enough.',
    phases: [2],
    groups: ['input', 'noticing', 'output'],
  },
  {
    id: 'phase3',
    kicker: 'Micro · Phase 3',
    title: 'Explicit focus on form — and L1 as a tool',
    rationale:
      'Targeted, explicit attention to form is built in, and Portuguese is allowed to do real cognitive ' +
      'work rather than being banished from the room.',
    support:
      'Instruction works and explicit tends to beat implicit, especially for hard-to-perceive features ' +
      '(Norris & Ortega 2000, d ≈ .96; Spada & Tomita 2010 on complex forms such as passives and ' +
      'conditionals). Translanguaging theory (García & Wei 2014) and sociocultural accounts of the L1 ' +
      'as a thinking tool make strategic contrastive work with Portuguese a principled move, not a lapse.',
    temper:
      'The explicit/implicit interface is genuinely unresolved — N. Ellis (2005) makes the case that ' +
      'adult learning is largely implicit and statistical — and MacSwan (2017) cautions that the strong ' +
      'translanguaging claim conflates one repertoire with one grammar. Hence “strategic” L1: a scaffold ' +
      'and a contrast, deployed deliberately, not a default medium.',
    phases: [3],
    groups: ['instruction', 'translanguaging', 'sociocultural'],
  },
  {
    id: 'phase45',
    kicker: 'Micro · Phases 4–5',
    title: 'Push output, then run a real task',
    rationale:
      'Learners are pushed to produce the language, then put it to work in a task with a genuine, ' +
      'non-linguistic outcome.',
    support:
      'Output forces syntactic processing that comprehension can skip (Swain 1985), and meaning is ' +
      'negotiated most usefully during interaction (Long 1996, p. 414), with interaction research ' +
      'showing large effects and larger ones in EFL (Mackey & Goo 2007, d ≈ 1.09). A task — defined by ' +
      'its outcome, not its language (Ellis 2003) — is what turns that negotiation into something worth ' +
      'doing.',
    temper:
      'Output’s causal role is weaker than often claimed (Krashen 1998, re-reading Swain’s own data), ' +
      'and TBLT pays off as a sustained programme more than as a one-off (Bryfonski & McKay 2019); ' +
      'Boers & Faez (2023) warn against relabelling ordinary exercises as “tasks”. So Phase 5 holds a ' +
      'real outcome gap, and the framework treats task-based design as a curricular commitment, not a ' +
      'single lesson’s trick.',
    phases: [4, 5],
    groups: ['output', 'interaction', 'tblt'],
  },
  {
    id: 'phase6',
    kicker: 'Micro · Phase 6',
    title: 'Feedback that prompts, not just corrects',
    rationale:
      'When a learner slips, the default is a prompt that hands the repair back to them, rather than a ' +
      'recast that quietly supplies the answer.',
    support:
      'Lyster & Ranta (1997) found recasts were the most common move (55% of all feedback) yet drew ' +
      'learner repair only 18% of the time, while prompts drew it far more often; oral corrective ' +
      'feedback as a whole carries durable, medium-to-large effects (Li 2010, d ≈ .53–1.16). Aljaafreh & ' +
      'Lantolf (1994) add the shape: begin with implicit hints and escalate only as the learner needs it.',
    temper:
      'The picture is genuinely contested. Goo & Mackey (2013) — “the case against the case against ' +
      'recasts” — show that on delayed post-tests recasts match prompts for acquisition; Lyster & Ranta ' +
      'measured immediate uptake, not learning. So the framework prefers prompts for the production and ' +
      'diagnostic information they generate in speaking, without treating recasts as a mistake.',
    phases: [6],
    groups: ['feedback', 'sociocultural'],
  },
  {
    id: 'phase7',
    kicker: 'Micro · Phase 7',
    title: 'Hand off to informal input — non-optional',
    rationale:
      'The lesson closes by bridging to the informal, mostly digital English learners meet on their ' +
      'own time; a lesson that skips this hasn’t closed the loop the framework argues for.',
    support:
      'Extensive reading and self-selected input drive gains beyond the classroom (Krashen 2004), and ' +
      'vocabulary grows through repeated, engaged encounters over time (Schmitt 2008). Tying that input ' +
      'to learners’ own online lives is an investment move (Norton 1995; Darvin & Norton 2015): it makes ' +
      'the out-of-class hours count as English study rather than leaving them to chance.',
    temper:
      'A handoff is only as good as its uptake — recommending input is not the same as learners engaging ' +
      'with it, and out-of-class study is the hardest part of the chain to verify. The framework makes ' +
      'Phase 7 explicit and concrete precisely because vague “read more in English” advice rarely lands.',
    phases: [7],
    groups: ['input', 'identity', 'vocabulary'],
  },
];
