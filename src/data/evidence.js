export const EVIDENCE_ITEMS = {
  affectiveReadiness: {
    construct: 'Affective readiness',
    citation: 'Krashen (1982)',
    groupId: 'input',
    implication: 'Begin with low-stakes, meaningful language so learners can enter English before accuracy pressure rises.',
    limitation: 'Lower anxiety helps access input, but it does not replace noticing, feedback, or pushed output.',
  },
  comprehensibleInput: {
    construct: 'Comprehensible input',
    citation: 'Krashen (1982, 2004); Nguyen & Doan (2025)',
    groupId: 'input',
    implication: 'Use interesting input that learners can mostly understand, then add supports that help them notice useful language.',
    limitation: 'Input is necessary but not sufficient; adaptive sequencing and interaction keep it from becoming passive exposure.',
  },
  noticing: {
    construct: 'Noticing and attention',
    citation: 'Schmidt (1990)',
    groupId: 'noticing',
    implication: 'Make the target feature visible through prompts, pauses, comparison, highlighting, or a concrete noticing task.',
    limitation: 'Noticing opens the gate to intake, but learners still need repeated use and feedback across contexts.',
  },
  vocabularyEngagement: {
    construct: 'Vocabulary engagement',
    citation: 'Nation (2022); Schmitt (2008)',
    groupId: 'vocabulary',
    implication: 'Recycle high-utility words across reading, listening, speaking, writing, and retrieval so form, meaning, and use deepen together.',
    limitation: 'Incidental exposure is slow; deliberate recycling and retrieval need to be designed, not hoped for.',
  },
  interactionNegotiation: {
    construct: 'Interaction and negotiation',
    citation: 'Long (1996); Mackey & Goo (2007)',
    groupId: 'interaction',
    implication: 'Use information gaps, clarification requests, and pair work that make learners adjust language to be understood.',
    limitation: 'Interaction works best when the task creates a real communicative need, not just turn-taking around known answers.',
  },
  pushedOutput: {
    construct: 'Pushed output',
    citation: 'Swain (1985, 2005)',
    groupId: 'output',
    implication: 'Ask learners to produce language precise enough that they notice gaps between what they mean and what they can say.',
    limitation: 'Output needs response, repair, or reflection; speaking alone can fossilize shortcuts.',
  },
  explicitInstruction: {
    construct: 'Explicit instruction',
    citation: 'Norris & Ortega (2000); Spada & Tomita (2010)',
    groupId: 'instruction',
    implication: 'Use concise rule discovery or direct explanation when a form is complex, low-salience, or blocking the task.',
    limitation: 'Explicit knowledge should feed communicative use; it is weaker when it remains a detached grammar explanation.',
  },
  socioculturalScaffolding: {
    construct: 'Mediated learning',
    citation: 'Vygotsky (1978); Lantolf & Thorne (2006)',
    groupId: 'sociocultural',
    implication: "Calibrate support inside the learner's ZPD, then withdraw help as control moves from teacher or peer to learner.",
    limitation: 'Scaffolding must be contingent; over-helping turns mediation into dependence.',
  },
  translanguaging: {
    construct: 'Translanguaging',
    citation: 'Garcia & Wei (2014); May (2014)',
    groupId: 'translanguaging',
    implication: 'Use Portuguese strategically for contrast, planning, and metalinguistic talk when it unlocks better English performance.',
    limitation: 'Because EFL exposure is limited, L1 use needs clear boundaries and an English-facing outcome.',
  },
  correctiveFeedback: {
    construct: 'Corrective feedback',
    citation: 'Lyster & Ranta (1997); Li (2010); Sheen (2007)',
    groupId: 'feedback',
    implication: 'Focus correction on one or two teachable targets and mix prompts, recasts, and metalinguistic cues.',
    limitation: 'Correcting everything diffuses attention; feedback should be selective, usable, and tied to the lesson goal.',
  },
  graduatedFeedback: {
    construct: 'Graduated feedback',
    citation: 'Aljaafreh & Lantolf (1994)',
    groupId: 'sociocultural',
    implication: 'Start with implicit prompts and become more explicit only when learners cannot self-repair.',
    limitation: 'A fixed correction script misses the ZPD; the teacher has to respond to what the learner can use in the moment.',
  },
  identityInvestment: {
    construct: 'Identity and investment',
    citation: 'Norton (1995); Darvin & Norton (2015)',
    groupId: 'identity',
    implication: "Connect tasks to learners' real social worlds so English feels like access to identity, community, and capital.",
    limitation: 'A quiet learner may be under-positioned rather than unmotivated; task design should legitimize more voices.',
  },
  motivationAction: {
    construct: 'Motivation into action',
    citation: 'Dornyei (2005); Al-Hoorie (2018)',
    groupId: 'identity',
    implication: 'Link future-self goals to concrete routines, accountability, and next-step tasks.',
    limitation: 'Motivation predicts intended effort better than achievement, so lesson design must bridge intention and behavior.',
  },
  taskBasedOutcome: {
    construct: 'Task-based outcome',
    citation: 'Ellis (2003); Bryfonski & McKay (2019); Boers & Faez (2023)',
    groupId: 'tblt',
    implication: 'Give Phase 5 a non-linguistic outcome: a decision, plan, ranking, proposal, solution, or recommendation.',
    limitation: 'A grammar exercise with a communicative label is not TBLT; the outcome must matter beyond using the target form.',
  },
  fluencyDevelopment: {
    construct: 'Fluency development',
    citation: 'Nation (2022)',
    groupId: 'vocabulary',
    implication: 'Give learners repeated, time-bounded chances to use already-known language faster and with less hesitation.',
    limitation: 'Fluency work should not introduce too much new language or it stops being fluency work.',
  },
};

const PHASE_EVIDENCE_KEYS = {
  1: ['affectiveReadiness', 'identityInvestment'],
  2: ['comprehensibleInput', 'noticing'],
  3: ['explicitInstruction', 'socioculturalScaffolding'],
  4: ['pushedOutput', 'fluencyDevelopment'],
  5: ['taskBasedOutcome', 'interactionNegotiation'],
  6: ['correctiveFeedback', 'graduatedFeedback'],
  7: ['noticing', 'vocabularyEngagement', 'identityInvestment'],
};

const ACTIVITY_RULES = [
  { terms: ['comprehensible input', 'story listening', 'modified input', 'extensive viewing'], keys: ['comprehensibleInput'] },
  { terms: ['low-anxiety', 'affective'], keys: ['affectiveReadiness'] },
  { terms: ['schmidt', 'noticing', 'typographic', 'input enhancement'], keys: ['noticing'] },
  { terms: ['nation', 'schmitt', 'vocabulary', 'lexical', 'strand', 'spaced retrieval', 'engagement'], keys: ['vocabularyEngagement'] },
  { terms: ['long', 'interaction', 'negotiation', 'information gap', 'clarification'], keys: ['interactionNegotiation'] },
  { terms: ['swain', 'output', 'metatalk', 'collaborative dialogue', 'hypothesis testing', 'pushed'], keys: ['pushedOutput'] },
  { terms: ['norris', 'ortega', 'spada', 'tomita', 'explicit instruction', 'explicit is fine', 'form-focused', 'complex forms'], keys: ['explicitInstruction'] },
  { terms: ['lantolf', 'vygotsky', 'sociocultural', 'zpd', 'peer mediation', 'concept-based'], keys: ['socioculturalScaffolding'] },
  { terms: ['garcia', 'wei', 'translanguaging', 'l1 as resource', 'contrastive analysis'], keys: ['translanguaging'] },
  { terms: ['lyster', 'ranta', 'li ', 'sheen', 'feedback', 'prompts', 'recast', 'correction'], keys: ['correctiveFeedback'] },
  { terms: ['aljaafreh', 'graduated cf', 'graduated feedback'], keys: ['graduatedFeedback'] },
  { terms: ['norton', 'identity', 'investment', 'agency'], keys: ['identityInvestment'] },
  { terms: ['dornyei', 'motivation', 'motivational'], keys: ['motivationAction'] },
  { terms: ['tblt', 'task with outcome', 'real-world task', 'non-linguistic goal'], keys: ['taskBasedOutcome'] },
  { terms: ['fluency', 'automatization', 'against time'], keys: ['fluencyDevelopment'] },
];

function addUnique(target, keys) {
  keys.forEach((key) => {
    if (!target.includes(key)) target.push(key);
  });
}

export function getEvidenceForSelection(phase, activity) {
  const keys = [];
  if (phase?.id) addUnique(keys, PHASE_EVIDENCE_KEYS[phase.id] || []);

  const evidenceText = [
    phase?.name,
    phase?.purpose,
    phase?.sla,
    activity?.name,
    activity?.best,
    activity?.sla,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  ACTIVITY_RULES.forEach((rule) => {
    if (rule.terms.some((term) => evidenceText.includes(term))) {
      addUnique(keys, rule.keys);
    }
  });

  return keys.map((key) => EVIDENCE_ITEMS[key]).filter(Boolean).slice(0, 4);
}
