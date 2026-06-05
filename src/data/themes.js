import { Heart, Coffee, Briefcase, Map, Film, Globe } from 'lucide-react';

// Six durable thematic units. `rationale` explains why the theme earns a place —
// grounded in needs analysis (Long 2015), identity/investment (Norton; Darvin &
// Norton), English-as-expanding-use (Nayar; Menezes de Souza & Monte Mór), and
// spiral progression (Larsen-Freeman). `evidence` keys index EVIDENCE_ITEMS.
export const THEMES = [
  {
    id: 'identity',
    name: 'Identity & Belonging',
    icon: Heart,
    num: 'I',
    description: 'Who learners are: self, family, heritage, the language of where we come from.',
    rationale:
      'Learning starts from who learners already are. Tasks tied to their real social worlds turn English into access to identity and community, not a neutral subject — and a quiet learner is often under-positioned rather than unmotivated.',
    evidence: ['identityInvestment', 'needsAnalysis', 'thematicSpiral'],
  },
  {
    id: 'daily',
    name: 'Daily Life & Routines',
    icon: Coffee,
    num: 'II',
    description: 'The rhythm of everyday life: home, food, weekly routine, services, money.',
    rationale:
      'The everyday is where high-frequency language lives and recurs. Routine, concrete tasks create the need, search, and evaluation that make vocabulary stick, and they recycle the same language across levels.',
    evidence: ['needsAnalysis', 'eflContext', 'thematicSpiral'],
  },
  {
    id: 'work',
    name: 'Work & Study',
    icon: Briefcase,
    num: 'III',
    description: 'Professional and academic English: meetings, emails, reports, careers.',
    rationale:
      'Many Brazilian learners study English for instrumental reasons — employability, study, migration. Anchoring the theme in real workplace and academic tasks gives lessons a non-linguistic outcome that matters beyond the classroom.',
    evidence: ['needsAnalysis', 'taskBasedOutcome', 'thematicSpiral'],
  },
  {
    id: 'travel',
    name: 'Travel & Place',
    icon: Map,
    num: 'IV',
    description: 'Moving through the world: navigation, recommendation, cultural depth, geography.',
    rationale:
      'English functions as a lingua franca of mobility. Framing travel and place as participation — not imitation of a native-speaker norm — matches how learners will actually use English to move through the world.',
    evidence: ['needsAnalysis', 'eflContext', 'thematicSpiral'],
  },
  {
    id: 'media',
    name: 'Media & Story',
    icon: Film,
    num: 'V',
    description: 'Streaming, lyrics, narrative — how learners already meet English in their leisure.',
    rationale:
      "Streaming, lyrics, and games are where learners already meet English daily. Treating that informal digital input as curricular — and as a site of identity investment — closes the loop between class and the screen, rather than leaving it residual.",
    evidence: ['identityInvestment', 'comprehensibleInput', 'thematicSpiral'],
  },
  {
    id: 'society',
    name: 'Society & Ideas',
    icon: Globe,
    num: 'VI',
    description: 'Argument and opinion: news, politics, culture, ethics — ideas worth contesting.',
    rationale:
      'Ideas worth contesting give advanced learners something real to do with language. A critical-literacy stance — drawing on the Brazilian letramento crítico tradition — and strategic L1 use let learners argue, not just translate.',
    evidence: ['eflContext', 'translanguaging', 'thematicSpiral'],
  },
];
