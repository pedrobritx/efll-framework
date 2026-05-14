import { Heart, Coffee, Briefcase, Map, Film, Globe } from 'lucide-react';

export const THEMES = [
  {
    id: 'identity',
    name: 'Identity & Belonging',
    icon: Heart,
    num: 'I',
    description: 'Who learners are: self, family, heritage, the language of where we come from.',
  },
  {
    id: 'daily',
    name: 'Daily Life & Routines',
    icon: Coffee,
    num: 'II',
    description: 'The rhythm of everyday life: home, food, weekly routine, services, money.',
  },
  {
    id: 'work',
    name: 'Work & Study',
    icon: Briefcase,
    num: 'III',
    description: 'Professional and academic English: meetings, emails, reports, careers.',
  },
  {
    id: 'travel',
    name: 'Travel & Place',
    icon: Map,
    num: 'IV',
    description: 'Moving through the world: navigation, recommendation, cultural depth, geography.',
  },
  {
    id: 'media',
    name: 'Media & Story',
    icon: Film,
    num: 'V',
    description: 'Streaming, lyrics, narrative — how learners already meet English in their leisure.',
  },
  {
    id: 'society',
    name: 'Society & Ideas',
    icon: Globe,
    num: 'VI',
    description: 'Argument and opinion: news, politics, culture, ethics — ideas worth contesting.',
  },
];
