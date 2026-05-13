// SLA reference groups for Part 05 of the EFLL Framework.
// Each entry: { authors, year, title, venue?, anchor (one-line: where it shows up in the framework) }.

export const REFERENCE_GROUPS = [
  {
    id: 'input',
    name: 'Input & Comprehension',
    anchor: 'Phase 2 · informal-input bridge',
    items: [
      {
        authors: 'Krashen, S. D.',
        year: 1982,
        title: 'Principles and Practice in Second Language Acquisition',
        venue: 'Oxford: Pergamon',
        note: 'Affective filter (Phase 1) and comprehensible input at i+1 (Phase 2).',
      },
      {
        authors: 'Krashen, S. D.',
        year: 2004,
        title: 'The Power of Reading: Insights from the Research',
        venue: '2nd ed., Libraries Unlimited',
        note: 'Extensive reading as part of the informal-input bridge (Phase 7).',
      },
      {
        authors: 'Nguyen, Q. N., & Doan, D. T. H.',
        year: 2025,
        title: "Beyond comprehensible input: A neuro-ecological critique of Krashen's hypothesis",
        venue: 'Frontiers in Psychology, 16, 1636777',
        note: 'Caveat against strong-version CI; supports input + interaction + adaptive sequencing.',
      },
    ],
  },
  {
    id: 'interaction',
    name: 'Interaction & Negotiation',
    anchor: 'Phase 4 · Phase 5',
    items: [
      {
        authors: 'Long, M. H.',
        year: 1996,
        title: 'The role of the linguistic environment in second language acquisition',
        venue: 'Handbook of SLA, pp. 413–468',
        note: 'Negotiation of meaning underpins the communicative task in Phase 5.',
      },
      {
        authors: 'Mackey, A., & Goo, J.',
        year: 2007,
        title: 'Interaction research in SLA: A meta-analysis and research synthesis',
        venue: 'Conversational Interaction in SLA, pp. 407–452',
        note: 'Empirical warrant for interaction-rich classrooms (d ≈ 1.09); larger effects in EFL.',
      },
    ],
  },
  {
    id: 'output',
    name: 'Output & Pushed Production',
    anchor: 'Phase 4 · Phase 5',
    items: [
      {
        authors: 'Swain, M.',
        year: 1985,
        title: 'Communicative competence: Roles of comprehensible input and output',
        venue: 'Input in SLA, pp. 235–253',
        note: 'Pushed output (Phase 4–5); rationale for hypothesis testing and noticing gaps.',
      },
      {
        authors: 'Swain, M.',
        year: 2005,
        title: 'The Output Hypothesis: Theory and research',
        venue: 'Handbook of Research in L2 Teaching and Learning, pp. 471–484',
        note: 'Three functions of output (noticing, testing, metatalk) — dictogloss in Phase 2.',
      },
    ],
  },
  {
    id: 'sociocultural',
    name: 'Sociocultural Theory',
    anchor: 'Phase 3 · Phase 6 · L1 as resource',
    items: [
      {
        authors: 'Vygotsky, L. S.',
        year: 1978,
        title: 'Mind in Society: The Development of Higher Psychological Processes',
        venue: 'Harvard University Press',
        note: 'ZPD-calibrated scaffolding throughout; peer mediation in Phase 4 and Phase 6.',
      },
      {
        authors: 'Aljaafreh, A., & Lantolf, J. P.',
        year: 1994,
        title: 'Negative feedback as regulation and L2 learning in the zone of proximal development',
        venue: 'The Modern Language Journal, 78(4), 465–483',
        note: 'Graduated corrective feedback in Phase 6; implicit-to-explicit prompts.',
      },
      {
        authors: 'Lantolf, J. P., & Thorne, S. L.',
        year: 2006,
        title: 'Sociocultural Theory and the Genesis of Second Language Development',
        venue: 'Oxford University Press',
        note: 'Concept-based instruction option for Phase 3 focus on form.',
      },
    ],
  },
  {
    id: 'identity',
    name: 'Identity, Investment & Motivation',
    anchor: 'Phase 1 · Phase 7',
    items: [
      {
        authors: 'Norton Peirce, B.',
        year: 1995,
        title: 'Social identity, investment, and language learning',
        venue: 'TESOL Quarterly, 29(1), 9–31',
        note: 'Investment over motivation; informs identity work in Phase 1 and learner-suggested content in Phase 7.',
      },
      {
        authors: 'Darvin, R., & Norton, B.',
        year: 2015,
        title: 'Identity and a model of investment in applied linguistics',
        venue: 'Annual Review of Applied Linguistics, 35, 64–84',
        note: 'Digital-age investment model; justifies tying classroom work to learners’ online lives.',
      },
      {
        authors: 'Dörnyei, Z.',
        year: 2005,
        title: 'The Psychology of the Language Learner',
        venue: 'Lawrence Erlbaum',
        note: 'L2 Motivational Self System; useful for EFL contexts with limited target-community contact.',
      },
      {
        authors: 'Al-Hoorie, A. H.',
        year: 2018,
        title: 'The L2 Motivational Self System: A meta-analysis',
        venue: 'Studies in SLLT, 8(4), 721–754',
        note: 'Tempers motivational claims: motivation predicts intended effort more than actual achievement.',
      },
    ],
  },
  {
    id: 'noticing',
    name: 'Noticing & Attention',
    anchor: 'Phase 2 · Phase 3',
    items: [
      {
        authors: 'Schmidt, R. W.',
        year: 1990,
        title: 'The role of consciousness in second language learning',
        venue: 'Applied Linguistics, 11(2), 129–158',
        note: 'Noticing as gateway to intake; underlies input enhancement in Phase 2 and Phase 7 noticing tasks.',
      },
    ],
  },
  {
    id: 'feedback',
    name: 'Corrective Feedback',
    anchor: 'Phase 6',
    items: [
      {
        authors: 'Lyster, R., & Ranta, L.',
        year: 1997,
        title: 'Corrective feedback and learner uptake',
        venue: 'Studies in SLA, 19(1), 37–66',
        note: 'Feedback taxonomy; prompts over recasts for grammatical error in Phase 6.',
      },
      {
        authors: 'Li, S.',
        year: 2010,
        title: 'The effectiveness of corrective feedback in SLA: A meta-analysis',
        venue: 'Language Learning, 60(2), 309–365',
        note: 'CF produces medium-to-large durable effects (d = .53–1.16). Don’t avoid correction.',
      },
      {
        authors: 'Sheen, Y.',
        year: 2007,
        title: 'The effect of focused written CF on ESL learners’ acquisition of articles',
        venue: 'TESOL Quarterly, 41(2), 255–283',
        note: 'Focused (single-feature) written CF works; informs feedback strategy in Phase 6.',
      },
    ],
  },
  {
    id: 'instruction',
    name: 'Instructed SLA · Implicit / Explicit',
    anchor: 'Phase 3',
    items: [
      {
        authors: 'Ellis, R.',
        year: 2005,
        title: 'Measuring implicit and explicit knowledge of a second language',
        venue: 'Studies in SLA, 27(2), 141–172',
        note: 'Two-construct picture; matches assessment to the knowledge you actually want to grow.',
      },
      {
        authors: 'Norris, J. M., & Ortega, L.',
        year: 2000,
        title: 'Effectiveness of L2 instruction: A research synthesis and meta-analysis',
        venue: 'Language Learning, 50(3), 417–528',
        note: 'Instruction works (d ≈ .96); explicit > implicit. License for direct teaching in Phase 3.',
      },
      {
        authors: 'Spada, N., & Tomita, Y.',
        year: 2010,
        title: 'Interactions between type of instruction and type of language feature',
        venue: 'Language Learning, 60(2), 263–308',
        note: 'Explicit instruction especially helpful for complex features (passives, conditionals, articles).',
      },
    ],
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary & The Four Strands',
    anchor: 'Macro grid · all phases',
    items: [
      {
        authors: 'Nation, I. S. P.',
        year: 2022,
        title: 'Learning Vocabulary in Another Language',
        venue: '3rd ed., Cambridge University Press',
        note: 'Four strands (input, output, language-focused learning, fluency) — visible in the macro hours bar.',
      },
      {
        authors: 'Schmitt, N.',
        year: 2008,
        title: 'Instructed second language vocabulary learning',
        venue: 'Language Teaching Research, 12(3), 329–363',
        note: 'Incidental + deliberate study; engagement principle drives Phase 7 scavenger hunts and spaced retrieval.',
      },
    ],
  },
  {
    id: 'translanguaging',
    name: 'Translanguaging & The Multilingual Turn',
    anchor: 'Principle 02 · Phase 3',
    items: [
      {
        authors: 'García, O., & Wei, L.',
        year: 2014,
        title: 'Translanguaging: Language, Bilingualism and Education',
        venue: 'Palgrave Macmillan',
        note: 'L1 as resource (Principle 02); contrastive analysis with Portuguese in Phase 3.',
      },
      {
        authors: 'May, S. (Ed.)',
        year: 2014,
        title: 'The Multilingual Turn: Implications for SLA, TESOL, and Bilingual Education',
        venue: 'Routledge',
        note: 'Drops native-speaker as the goal; aim for the proficient multilingual user.',
      },
    ],
  },
  {
    id: 'cdst',
    name: 'Complex Dynamic Systems',
    anchor: 'Principle 03 · spiral macro grid',
    items: [
      {
        authors: 'Larsen-Freeman, D.',
        year: 1997,
        title: 'Chaos/complexity science and second language acquisition',
        venue: 'Applied Linguistics, 18(2), 141–165',
        note: 'Variability is the norm; the macro grid is a spiral, not a staircase (Principle 03).',
      },
      {
        authors: 'Larsen-Freeman, D., & Cameron, L.',
        year: 2008,
        title: 'Complex Systems and Applied Linguistics',
        venue: 'Oxford University Press',
        note: 'Methodological grounding for tracking development longitudinally rather than pre/post.',
      },
    ],
  },
  {
    id: 'tblt',
    name: 'Task-Based Language Teaching',
    anchor: 'Phase 5',
    items: [
      {
        authors: 'Ellis, R.',
        year: 2003,
        title: 'Task-Based Language Learning and Teaching',
        venue: 'Oxford University Press',
        note: 'Definition of task (non-linguistic outcome) anchors the communicative task in Phase 5.',
      },
      {
        authors: 'Bryfonski, L., & McKay, T. H.',
        year: 2019,
        title: 'TBLT implementation and evaluation: A meta-analysis',
        venue: 'Language Teaching Research, 23(5), 603–632',
        note: 'TBLT works as a sustained programme; curricular commitment matters more than single lessons.',
      },
      {
        authors: 'Boers, F., & Faez, F.',
        year: 2023,
        title: 'Meta-analysis to estimate the relative effectiveness of TBLT programs',
        venue: 'Language Teaching Research (online first)',
        note: 'Cautions against labelling exercises as tasks; precision matters in Phase 5 design.',
      },
    ],
  },
];
