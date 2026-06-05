// CEFR levels. `cefrDescriptor` paraphrases the official global-scale descriptor
// (Council of Europe 2001, Table 1, p. 24; updated by the 2020 Companion Volume).
// `whyThisLevel` is the planning emphasis, read off the four-strands hours profile
// (Nation): form-focused time falls and input/fluency time rises as proficiency
// grows. `evidence` keys index EVIDENCE_ITEMS (see data/evidence.js).
export const LEVELS = [
  {
    id: 'A1',
    label: 'A1',
    name: 'Breakthrough',
    desc: 'Basic survival language',
    hours: { i: 18, o: 12, l: 18, f: 12 },
    cefrDescriptor:
      'Understands and uses familiar everyday expressions and very basic phrases to meet concrete needs; can introduce themselves and ask and answer simple personal questions, if the other person speaks slowly and clearly.',
    whyThisLevel:
      'Survival functions and high-frequency chunks. The hours profile leans on form and input: build a small, usable repertoire and lower the affective filter before accuracy pressure rises.',
    evidence: ['cefrAlignment', 'proficiencyVariability'],
  },
  {
    id: 'A2',
    label: 'A2',
    name: 'Waystage',
    desc: 'Connected everyday language',
    hours: { i: 18, o: 15, l: 15, f: 12 },
    cefrDescriptor:
      'Understands sentences and frequent expressions about areas of immediate relevance (personal and family information, shopping, work); can handle simple, routine exchanges of information on familiar matters.',
    whyThisLevel:
      'Connect the survival chunks into routine exchanges. Output time grows as learners string known language into short, predictable transactions over familiar topics.',
    evidence: ['cefrAlignment', 'proficiencyVariability'],
  },
  {
    id: 'B1',
    label: 'B1',
    name: 'Threshold',
    desc: 'Independent user emerging',
    hours: { i: 18, o: 18, l: 12, f: 12 },
    cefrDescriptor:
      'Understands the main points of clear standard input on familiar matters; can cope with most situations while travelling, produce simple connected text, and describe experiences, plans and opinions.',
    whyThisLevel:
      'The independent user emerges. Input and output are balanced: shift from rehearsed exchanges to coping with the unexpected and producing connected, personally meaningful text.',
    evidence: ['cefrAlignment', 'proficiencyVariability'],
  },
  {
    id: 'B2',
    label: 'B2',
    name: 'Vantage',
    desc: 'Effective independent use',
    hours: { i: 18, o: 18, l: 10, f: 14 },
    cefrDescriptor:
      'Understands the main ideas of complex text on concrete and abstract topics; can interact with enough fluency and spontaneity that conversation with proficient speakers is not a strain for either side.',
    whyThisLevel:
      'Towards effective, spontaneous use. Form-focused time tapers and fluency rises: push for range, argument, and the ability to sustain interaction without rehearsing every turn.',
    evidence: ['cefrAlignment', 'proficiencyVariability'],
  },
  {
    id: 'C1',
    label: 'C1',
    name: 'Nuance',
    desc: 'Proficient, near-native',
    hours: { i: 20, o: 18, l: 8, f: 14 },
    cefrDescriptor:
      'Understands a wide range of demanding, longer texts and grasps implicit meaning; can express ideas fluently and spontaneously and use language flexibly for social, academic and professional purposes.',
    whyThisLevel:
      'Effective operational proficiency. Most time is input and fluency; explicit form-work targets only high-difficulty, low-salience features. Work on register, implication, and precision.',
    evidence: ['cefrAlignment', 'proficiencyVariability'],
  },
  {
    id: 'C2',
    label: 'C2',
    name: 'Mastery',
    desc: 'Full command, refinement',
    hours: { i: 22, o: 20, l: 4, f: 14 },
    cefrDescriptor:
      'Understands with ease virtually everything heard or read; can express themselves spontaneously, very fluently and precisely, differentiating finer shades of meaning even in complex situations.',
    whyThisLevel:
      'Refinement, not new survival language. Form-focused time is minimal; the work is nuance, idiom, and shades of meaning across rich input and high-quality output.',
    evidence: ['cefrAlignment', 'proficiencyVariability'],
  },
];
