import React, { useState, useEffect } from 'react';
import {
  ChevronDown, ChevronRight, Sparkles, Layers, Clock, Compass,
  Users, Coffee, Briefcase, Map, Film, Globe, Heart,
  Sun, Headphones, Target, PenLine, MessagesSquare, RefreshCw, Tv,
  BookOpen, GraduationCap, Building2, Lightbulb,
  Pencil, Check, Printer, Copy, RotateCcw
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────
// DATA — MACRO GRID
// ─────────────────────────────────────────────────────────────────────────

const THEMES = [
  { id: 'identity', name: 'Identity & Belonging', icon: Heart, num: 'I' },
  { id: 'daily', name: 'Daily Life & Routines', icon: Coffee, num: 'II' },
  { id: 'work', name: 'Work & Study', icon: Briefcase, num: 'III' },
  { id: 'travel', name: 'Travel & Place', icon: Map, num: 'IV' },
  { id: 'media', name: 'Media & Story', icon: Film, num: 'V' },
  { id: 'society', name: 'Society & Ideas', icon: Globe, num: 'VI' },
];

const LEVELS = [
  { id: 'A1', label: 'A1', name: 'Breakthrough', desc: 'Basic survival language', hours: { i: 18, o: 12, l: 18, f: 12 } },
  { id: 'A2', label: 'A2', name: 'Waystage', desc: 'Connected everyday language', hours: { i: 18, o: 15, l: 15, f: 12 } },
  { id: 'B1', label: 'B1', name: 'Threshold', desc: 'Independent user emerging', hours: { i: 18, o: 18, l: 12, f: 12 } },
  { id: 'B2', label: 'B2', name: 'Vantage', desc: 'Effective independent use', hours: { i: 18, o: 18, l: 10, f: 14 } },
  { id: 'C1', label: 'C1', name: 'Nuance', desc: 'Proficient, near-native', hours: { i: 20, o: 18, l: 8, f: 14 } },
  { id: 'C2', label: 'C2', name: 'Mastery', desc: 'Full command, refinement', hours: { i: 22, o: 20, l: 4, f: 14 } },
];

const MACRO = {
  A1: {
    identity: { cando: ['introduce myself with name, age, nationality, family', 'say where I live and what I do', 'ask and answer basic personal questions'], bridge: ['Peppa Pig with subtitles', 'Bluey', 'Simple Instagram captions'] },
    daily: { cando: ['name common foods, drinks, daily activities', 'tell the time and days', 'order in a restaurant'], bridge: ['Cooking shorts on TikTok with captions', 'Sesame Street clips'] },
    work: { cando: ['say what I do for work or study', 'name school subjects, basic job titles', 'fill in a simple form'], bridge: ['LinkedIn profile headlines', 'BBC Learning English (Lower Beginner)'] },
    travel: { cando: ['name countries, cities, basic directions', 'understand simple signs', 'book a room or ticket with basic phrases'], bridge: ['Travel vlog intros', 'Google Maps in English', 'Airline boarding announcements'] },
    media: { cando: ['name film genres, hobbies, music styles', 'express simple likes and dislikes', 'understand song titles and basic lyrics'], bridge: ['Pop songs with lyric videos (Taylor Swift, Coldplay)', 'Spotify interface in English'] },
    society: { cando: ['name weather, seasons, colors, basic emotions', 'understand very simple news headlines'], bridge: ['Weather forecasts', 'Newsy headlines', 'Emoji-rich social posts'] },
  },
  A2: {
    identity: { cando: ['describe my family, friends, daily life in short connected sentences', 'talk about past experiences using simple past', 'express basic feelings and reasons'], bridge: ['Family/lifestyle vlogs (simple expat content)', 'Short Instagram Reels with captions'] },
    daily: { cando: ['describe my home, neighborhood, weekly routine', 'make plans and arrangements', 'handle most everyday shopping and service encounters'], bridge: ['Cooking with Babish Basics', "Trader Joe's hauls", 'Subtitled restaurant reviews'] },
    work: { cando: ['describe my job or studies and explain what I do day to day', 'talk about past and future plans', 'write a short email or message at work'], bridge: ['LinkedIn "day in the life" posts', 'Simple business English podcasts'] },
    travel: { cando: ['describe a trip I have taken', 'book travel, ask for directions, deal with airport situations', 'compare two places'], bridge: ["Rick Steves' Europe", 'Budget-travel YouTube channels', 'Airline safety videos'] },
    media: { cando: ['retell the plot of a film or series in simple terms', 'describe characters and opinions', 'understand most of a children\'s or YA series with subtitles'], bridge: ['Stranger Things S1 (EN subs)', 'Avatar: The Last Airbender', 'Simplified Disney+ content'] },
    society: { cando: ['describe basic news topics', 'express simple opinions on familiar issues', 'understand short weather and local news segments'], bridge: ['BBC Learning English 6 Minute English', 'Basic Vox Shorts', 'Weather + traffic news'] },
  },
  B1: {
    identity: { cando: ['narrate experiences, dreams, and ambitions in a connected way', 'discuss values and beliefs in familiar terms', 'give brief reasons for opinions'], bridge: ['Personal essay YouTube (Casey Neistat-style vlogs)', 'TED-Ed animated shorts'] },
    daily: { cando: ['manage most situations encountered while traveling or living abroad', 'discuss lifestyle choices (diet, exercise, sustainability)'], bridge: ['Bon Appétit test kitchen', 'The Minimalists podcast (selected)'] },
    work: { cando: ['participate in a meeting on a familiar topic', 'write a structured email, cover letter, or report', 'describe career goals and trajectory'], bridge: ['Harvard Business Review short videos', 'Indeed Career Guide', 'LinkedIn Learning intros'] },
    travel: { cando: ['handle complex travel situations (delays, complaints, recommendations)', 'describe places with cultural and historical context'], bridge: ['Lonely Planet', 'Anthony Bourdain Parts Unknown (subs)', 'Travel podcasts'] },
    media: { cando: ['follow most mainstream TV series with English subtitles', 'discuss film and series plots, themes, and characters', 'write a short review'], bridge: ['Friends, The Office, Brooklyn Nine-Nine', 'The Watch podcast', 'Letterboxd reviews'] },
    society: { cando: ['follow the main points of news reports on familiar topics', 'express and justify opinions in informal discussion'], bridge: ['Vox', 'Johnny Harris', 'Last Week Tonight (selected segments)', 'The Daily podcast'] },
  },
  B2: {
    identity: { cando: ['discuss personal values, identity, and life choices with nuance', 'participate in extended conversation with native speakers without strain'], bridge: ['Modern Love podcast', 'The Moth storytelling', 'Long-form Instagram captions'] },
    daily: { cando: ['discuss complex lifestyle topics (nutrition, fitness, finance, sustainability) with domain-specific vocabulary'], bridge: ['Huberman Lab (selected)', 'The Financial Diet', 'Pick Up Limes'] },
    work: { cando: ['run a meeting in English, give a structured presentation', 'handle workplace negotiation', 'write detailed professional documents'], bridge: ['HBR IdeaCast', 'Lex Fridman Podcast (technical interviews)', 'Y Combinator talks'] },
    travel: { cando: ['discuss intercultural experiences with depth', 'understand and use idiomatic regional varieties'], bridge: ['Nomadic Matt', 'YouTube documentaries on specific cultures', 'Atlas Obscura'] },
    media: { cando: ['follow most films and series without subtitles', 'discuss themes, cinematography, narrative structure'], bridge: ['Succession, The Bear, Severance (without subtitles)', 'Every Frame a Painting'] },
    society: { cando: ['follow most TV news and current affairs', 'engage in argument on abstract topics', 'understand most editorial content'], bridge: ['The Economist (audio edition)', 'Planet Money', 'Hidden Brain', 'The New York Times'] },
  },
  C1: {
    identity: { cando: ['discuss identity, culture, and ideology with subtlety and precision', 'use idiom and register flexibly'], bridge: ['The Ezra Klein Show', 'Literary podcasts', 'Substack essays'] },
    daily: { cando: ['engage with specialized lifestyle content (philosophy of food, slow living, neurodivergence discourse)'], bridge: ['Conversations with Tyler', 'On Being', 'Specialist YouTube essayists'] },
    work: { cando: ['function at near-native level in professional and academic contexts', 'write for publication or formal audiences'], bridge: ['Academic journal podcasts', 'Conference recordings', 'Hacker News discussion threads'] },
    travel: { cando: ['engage with literary travel writing, cultural criticism, geopolitics'], bridge: ['Foreign Affairs', 'Literary travel books (Solnit, Theroux)', 'The Long Read (Guardian)'] },
    media: { cando: ['analyze film, literature, and television with critical and theoretical vocabulary'], bridge: ['Academic film criticism', 'Backlisted podcast', 'Essay films'] },
    society: { cando: ['follow complex argument across registers', 'engage with academic and policy discourse'], bridge: ['The Atlantic', 'London Review of Books', 'The Tim Ferriss Show (long-form)', 'Academic Twitter'] },
  },
  C2: {
    identity: { cando: ['comprehend with ease virtually everything heard or read in this domain', 'differentiate finer shades of meaning even in complex situations'], bridge: ['Any English-language content for educated native audiences'] },
    daily: { cando: ['express myself spontaneously, fluently, and precisely on any everyday topic'], bridge: ['Any English-language content for educated native audiences'] },
    work: { cando: ['function indistinguishably from an educated native professional in any work or academic context'], bridge: ['Any English-language content for educated native audiences'] },
    travel: { cando: ['engage with travel and cultural discourse at full literary and academic depth'], bridge: ['Any English-language content for educated native audiences'] },
    media: { cando: ['analyze and discuss any media with full critical, theoretical, and stylistic vocabulary'], bridge: ['Any English-language content for educated native audiences'] },
    society: { cando: ['summarize information from different sources, reconstructing arguments and accounts in a coherent presentation'], bridge: ['Any English-language content for educated native audiences'] },
  },
};

// ─────────────────────────────────────────────────────────────────────────
// DATA — MICRO PHASES
// ─────────────────────────────────────────────────────────────────────────

const PHASES = [
  {
    id: 1, name: 'Warm-up & Schema Activation', time: '5–8 min', icon: Sun,
    purpose: 'Lower the affective filter; activate prior knowledge and target-language schema; transition learners from L1-dominant cognition.',
    sla: 'Krashen — affective filter; schema theory',
    activities: [
      { name: 'Personal question rotation', best: 'All levels', sla: 'Krashen — low-anxiety input' },
      { name: 'Vocabulary brainstorm on board', best: 'A1–B1', sla: 'Nation — lexical activation' },
      { name: '"Two truths and a lie" (level-adapted)', best: 'A2+', sla: 'Norton — identity work' },
      { name: 'Image / meme prompt: "What\'s happening here?"', best: 'A2+', sla: 'Schema activation' },
      { name: '30-second free recall of last lesson', best: 'All', sla: 'Spaced retrieval (Schmitt)' },
      { name: 'Quick poll on unit theme', best: 'All', sla: 'Engagement (Schmitt)' },
      { name: '"What did you notice in [recommended content]?"', best: 'B1+', sla: "Schmidt's noticing + informal-input bridge" },
    ],
  },
  {
    id: 2, name: 'Input & Noticing', time: '10–12 min', icon: Headphones,
    purpose: 'Provide comprehensible input at i+1; engineer noticing of target features.',
    sla: 'Krashen — comprehensible input; Schmidt — noticing',
    activities: [
      { name: 'Authentic video clip (3–5 min, with strategic pausing)', best: 'A2+', sla: 'Krashen — comprehensible input' },
      { name: 'Reading text with input enhancement (bolded targets)', best: 'A2+', sla: 'Schmidt — typographic noticing' },
      { name: 'Listening jigsaw (different segments per learner)', best: 'B1+', sla: 'Long — interaction + input' },
      { name: 'Story-based input (TPRS-style narrative)', best: 'A1–B1', sla: 'Krashen — story listening' },
      { name: 'Podcast snippet with transcript', best: 'B1+', sla: 'Multimodal input' },
      { name: 'Teacher narrative with target structures recycled', best: 'All', sla: 'Krashen — modified input' },
      { name: 'Dictogloss (listen, reconstruct in pairs)', best: 'B1+', sla: 'Swain — noticing + output' },
    ],
  },
  {
    id: 3, name: 'Focus on Form', time: '8–10 min', icon: Target,
    purpose: 'Language-focused learning (Nation strand 3); explicit attention to a target feature noticed in Phase 2.',
    sla: 'Ellis — explicit instruction; Lantolf — concept-based',
    activities: [
      { name: 'Inductive rule discovery: "What\'s the pattern?"', best: 'A2+', sla: 'Ellis — explicit instruction' },
      { name: 'Direct mini-lesson with examples', best: 'A1, complex forms', sla: 'Norris & Ortega — explicit is fine' },
      { name: 'Concept-based instruction (underlying logic before form)', best: 'B1+', sla: 'Lantolf — SCT' },
      { name: 'Contrastive analysis with L1 (translanguaging)', best: 'All', sla: 'García & Wei — L1 as resource' },
      { name: 'Error correction collective: anonymized errors on board', best: 'B1+', sla: 'Lyster & Ranta — prompts' },
      { name: 'Metalinguistic discussion in L1 or L2', best: 'All', sla: 'Swain — metatalk' },
    ],
  },
  {
    id: 4, name: 'Controlled Practice', time: '8–10 min', icon: PenLine,
    purpose: 'Safe hypothesis testing; build accuracy and fluency in the target feature.',
    sla: 'Swain — hypothesis testing; DeKeyser — automatization',
    activities: [
      { name: 'Gap-fill / sentence transformation', best: 'A1–B1', sla: 'Form-focused practice' },
      { name: 'Sentence-builder dominoes', best: 'A1–B1', sla: 'Engagement (Schmitt)' },
      { name: 'Drill chains (chained questions around the circle)', best: 'A1–A2', sla: 'Automatization (DeKeyser)' },
      { name: 'Mingle activity (find someone who…)', best: 'A2+', sla: 'Output + interaction' },
      { name: 'Information gap (two-way)', best: 'A2+', sla: 'Long — negotiation of meaning' },
      { name: 'Picture description with target structure', best: 'A2+', sla: 'Pushed output (Swain)' },
      { name: 'Sentence transformation against time', best: 'B1+', sla: 'Fluency development' },
    ],
  },
  {
    id: 5, name: 'Communicative Task', time: '12–15 min', icon: MessagesSquare,
    purpose: 'Genuine task with non-linguistic outcome (Ellis 2003); learners use language as a means to an end.',
    sla: 'Ellis — TBLT; Long — interaction',
    activities: [
      { name: 'Decision-making task (rank, choose, plan)', best: 'A2+', sla: 'Ellis — task with outcome' },
      { name: 'Problem-solving task (escape room, mystery)', best: 'B1+', sla: 'TBLT' },
      { name: 'Role-play with non-linguistic goal', best: 'B1+', sla: 'Ellis — real-world task' },
      { name: 'Opinion gap with required consensus', best: 'B1+', sla: 'Long — interaction' },
      { name: 'Project micro-task (design, propose, present)', best: 'B1+', sla: 'TBLT — extended task' },
      { name: 'Mini-presentation with Q&A', best: 'B1+', sla: 'Output + interaction' },
      { name: 'Debate (structured)', best: 'B2+', sla: 'Argumentation, register' },
      { name: 'Collaborative writing (Google Docs live)', best: 'B1+', sla: 'Swain — collaborative dialogue' },
      { name: 'Storytelling with prompts', best: 'A2+', sla: 'Narrative output' },
    ],
  },
  {
    id: 6, name: 'Feedback & Reflection', time: '5–7 min', icon: RefreshCw,
    purpose: 'Graduated corrective feedback; metacognitive reflection on learning.',
    sla: 'Lyster & Ranta — uptake; Aljaafreh & Lantolf — ZPD-calibrated',
    activities: [
      { name: 'Reformulation gallery: anonymized errors corrected collectively', best: 'A2+', sla: 'Lyster & Ranta — prompts' },
      { name: 'Self-correction with recorded output', best: 'B1+', sla: 'Swain — noticing gaps' },
      { name: 'Peer feedback with rubric', best: 'B1+', sla: 'Sociocultural — peer mediation' },
      { name: 'Graduated CF in real time (summarized here)', best: 'All', sla: 'Aljaafreh & Lantolf — ZPD' },
      { name: 'Exit ticket: "One thing I learned / one I\'m unsure about"', best: 'All', sla: 'Metacognition' },
      { name: 'Recast log (track high-frequency errors weekly)', best: 'All', sla: 'Lyster & Ranta — longitudinal' },
    ],
  },
  {
    id: 7, name: 'Informal-Input Bridge', time: '3–5 min', icon: Tv,
    purpose: 'Curricular handoff to informal digital input — the thesis-aligned move that distinguishes this template from generic CLT.',
    sla: 'Schmidt + Nation (strand 1) + Norton (investment)',
    activities: [
      { name: '"This week, watch / listen / read X" with a specific noticing task', best: 'All', sla: 'Schmidt + Nation strand 1' },
      { name: 'Vocabulary scavenger hunt in recommended content', best: 'A2+', sla: 'Schmitt — engagement' },
      { name: 'Series club: one episode per week, brief in-class discussion', best: 'B1+', sla: 'Extensive viewing (Krashen)' },
      { name: 'Podcast journal: short reflection on one episode', best: 'B2+', sla: 'Strand 1 + strand 2' },
      { name: 'Lyric analysis assignment with a specific song', best: 'A2+', sla: 'Affective + lexical' },
      { name: '"Find an example of [target form] in real content"', best: 'B1+', sla: 'Noticing in the wild' },
      { name: 'Recommend-back: learner suggests content to teacher', best: 'B1+', sla: 'Norton — investment, agency' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// DATA — LESSON ARCHETYPES (1 through 8 within a unit)
// ─────────────────────────────────────────────────────────────────────────
// Each archetype shifts the phase-time allocation within the 60-min lesson.
// Times array maps to phases 1-7. Sum = 60 minutes.

const ARCHETYPES = [
  { id: 1, name: 'Introduction & Diagnostic', focus: 'Surface prior knowledge, set unit goals, pre-test informally.', times: [10, 15, 5, 8, 10, 7, 5] },
  { id: 2, name: 'Input Saturation', focus: 'Maximize comprehensible input on the theme.', times: [5, 18, 8, 10, 10, 5, 4] },
  { id: 3, name: 'First Form Focus', focus: 'Introduce the primary grammatical target of the unit.', times: [6, 10, 14, 12, 10, 5, 3] },
  { id: 4, name: 'Midpoint Consolidation', focus: 'Recycle and integrate input and form.', times: [6, 10, 10, 10, 14, 6, 4] },
  { id: 5, name: 'Productive Stretch', focus: 'Push output and accuracy under communicative pressure.', times: [5, 8, 8, 12, 18, 6, 3] },
  { id: 6, name: 'Second Form Focus', focus: 'Introduce a secondary form or expand the first.', times: [6, 10, 12, 10, 14, 5, 3] },
  { id: 7, name: 'Performance Rehearsal', focus: 'Prepare for the unit final task.', times: [5, 8, 6, 10, 20, 7, 4] },
  { id: 8, name: 'Unit Task & Reflection', focus: 'Deliver assessable performance and self-assess.', times: [5, 5, 4, 8, 25, 10, 3] },
];

// ─────────────────────────────────────────────────────────────────────────
// DATA — EXAMPLES LIBRARY (252 prompts: 6 levels × 6 themes × 7 phases)
// ─────────────────────────────────────────────────────────────────────────

const EXAMPLES = {
  A1: {
    identity: {
      1: "Stand-and-share: 'My name is ___. I'm from ___. I'm ___ years old.' Everyone speaks for 20 seconds to a partner.",
      2: "Watch a 2-min Bluey clip where the family is introduced. Pause and list: who is in Bluey's family?",
      3: "Present simple 'to be' + family words. Inductive: 'She IS my sister. He IS my brother.' What's the pattern?",
      4: "Mingle: ask 5 classmates 'How many brothers or sisters do you have?' Note answers in a grid.",
      5: "Mini family poster: draw 3 family members. Present in 60 seconds: 'This is my ___. He or she is ___.'",
      6: "Anonymized board errors from Phase 5. Class identifies and corrects together.",
      7: "Watch one Peppa Pig episode (5 min, EN subs). Note 2 new family words. Bring next class.",
    },
    daily: {
      1: "Around the room: 'I wake up at ___. I have ___ for breakfast.' Each learner shares one daily fact.",
      2: "Watch a 90-second TikTok cooking short with captions. List 5 food words you see or hear.",
      3: "Present simple for routines + frequency adverbs (always, usually, sometimes, never). Inductive from the video.",
      4: "Pair drill: 'How often do you eat pizza?' / 'I usually eat pizza on Friday.' Use 6 different activities.",
      5: "Restaurant role-play in pairs: one is server, one is customer. Order food, drinks, ask for the bill. Switch.",
      6: "Board errors from the role-play. Class corrects 'I want a coffee, please' vs. 'I am wanting...'.",
      7: "Watch 3 Sesame Street cooking shorts (5 min total) with subs. Bring 3 new food words next class.",
    },
    work: {
      1: "Around the room: 'I'm a ___. I study or work at ___.' Each learner shares one work or study fact.",
      2: "Read 6 LinkedIn profile headlines aloud. Note job titles and one verb for each ('I help,' 'I design,' 'I teach').",
      3: "Present simple + occupation vocabulary. Inductive: 'A teacher TEACHES. A designer DESIGNS.' What's the pattern?",
      4: "Pair guessing game: 'I help sick people. I work in a hospital.' Partner guesses the job. 5 rounds each.",
      5: "Job fair role-play: pairs swap business cards (made on paper). 'What do you do?' 'I'm a ___. I work at ___.'",
      6: "Board errors from Phase 5: 'I am a engineer' vs. 'I am an engineer'. Class corrects.",
      7: "Find 3 LinkedIn profiles in English in your network. Note the headline structure. Bring one next class.",
    },
    travel: {
      1: "Map prompt on the board: 'Have you been to ___?' Hands up. 'Where do you want to go?' Pairs share.",
      2: "Watch a 2-min travel vlog intro (e.g., Mark Wiens). Note 5 place words (country, city, beach, mountain).",
      3: "There is / there are + place vocabulary. Inductive: 'There IS a beach. There ARE mountains.' Singular vs. plural.",
      4: "Pair description: A describes a city using 'There is / are' (no naming it); B guesses the city. 3 rounds.",
      5: "Travel agency role-play: pairs play agent + customer. 'I want to go to ___.' 'There is a beach there. There are restaurants.'",
      6: "Anonymized errors on the board. Class fixes 'There is mountains' vs. 'There are mountains.'",
      7: "Watch one airline boarding announcement video (2 min). Note 5 destinations. Bring next class.",
    },
    media: {
      1: "Around the room: 'I like ___. I don't like ___.' (film genre, music style, hobby) — 1 sentence each.",
      2: "Listen to the chorus of a simple pop song (e.g., Coldplay 'Yellow') with lyric video. Note 5 emotion or color words.",
      3: "Present simple + like / love / hate + -ing. Inductive: 'I LIKE watching films.' Why -ing?",
      4: "Mingle: 'Do you like ___?' (10 things). Note answers. Then class summary: 'Maria likes pizza but doesn't like rap.'",
      5: "Music-recommendation pair task: each learner names 3 songs and one reason: 'I like it because it's happy / slow / sad.'",
      6: "Board errors: 'I like to watching' vs. 'I like watching'. Class corrects.",
      7: "Choose one English-language song. Listen 3 times this week. Bring 3 lyric words next class.",
    },
    society: {
      1: "Weather window: 'How is the weather today?' Each learner answers in one sentence.",
      2: "Read a 3-headline weather forecast. Note: 'It's sunny in São Paulo.' 'It's raining in Recife.'",
      3: "Present simple + weather adjectives + place. Inductive: 'It IS sunny. It IS raining.' Subject 'it'.",
      4: "Map drill: pairs forecast for 5 Brazilian cities using a weather map. Switch and check.",
      5: "Mini weather report role-play: each learner presents a 30-second forecast for one city.",
      6: "Board errors: 'Today is rain' vs. 'It's raining today'. Class corrects.",
      7: "Watch one English-language weather forecast (3 min). Note 5 weather adjectives. Bring next class.",
    },
  },
  A2: {
    identity: {
      1: "Pair share: 'Tell your partner one thing you did last weekend with your family.'",
      2: "Read a short Instagram caption (4 sentences) where someone introduces their family in past simple. Underline all past-tense verbs.",
      3: "Past simple regular vs. irregular. Sort 12 verbs from the input into two groups. Find the pattern.",
      4: "Pair gap-fill: 'Yesterday I ___ (go) to my grandmother's house.' Then transform into Yes/No questions.",
      5: "Story-circle in pairs: each learner shares a 90-second family memory using past simple. Listener asks 3 follow-ups.",
      6: "Error gallery: 4 anonymized errors on the board. Pairs propose corrections, then volunteer.",
      7: "Watch one family vlog on YouTube (5–7 min, subs). Write 3 past-simple sentences about what the family did.",
    },
    daily: {
      1: "Pair share: 'Describe your kitchen. What's in it?' 60 seconds each.",
      2: "Watch a Trader Joe's haul video (3 min, subs). Note 8 food items and 3 adjectives describing them (fresh, frozen, organic).",
      3: "Countable vs. uncountable nouns + quantifiers (some, any, much, many, a lot of). Sort items from the video.",
      4: "Shopping list dictation in pairs: A reads list, B writes, then they compare. Then transform: 'Have we got any milk?'",
      5: "Plan a dinner party for 4 friends: agree on the menu, shopping list, and budget. Present plan to another pair.",
      6: "Pair feedback using a 3-point rubric (clarity, vocabulary range, accuracy). One praise, one suggestion.",
      7: "Watch one Babish Basics episode (8–10 min, subs). Identify 5 cooking verbs used and bring next class.",
    },
    work: {
      1: "Pair share: 'Describe a typical day at work or school' in 90 seconds.",
      2: "Listen to a 3-min 'day in the life' podcast for a beginner job (barista, nanny, retail). Note 6 work verbs.",
      3: "Present simple vs. present continuous: 'I usually work at 9 AM' vs. 'I'm working on a project this week.'",
      4: "Pair gap-fill with both tenses: 'I usually ___ at 9, but this week I ___ from home.' 8 sentences.",
      5: "Email writing in pairs: 'You can't come to a meeting. Write to your boss.' Compare with another pair.",
      6: "Pair email exchange: each reads the other's email and notes one strength + one fix.",
      7: "Read 2 LinkedIn 'day in the life' posts in English. Note the tense shifts. Bring observations next class.",
    },
    travel: {
      1: "Pair share: 'Tell me about a trip you took last year' in 60 seconds.",
      2: "Watch a 3-min Rick Steves Europe segment on a city. Note past simple verbs the narrator uses ('We visited,' 'They built').",
      3: "Past simple + travel verbs (visited, stayed, traveled, flew). Regular + 4 irregular. Inductive sorting.",
      4: "Travel timeline pair work: each learner draws a timeline of their last trip. Partner asks 5 questions in past simple.",
      5: "Photo storytelling in pairs: each shows a travel photo on their phone and tells the story in 90 seconds.",
      6: "Class gallery: 4 anonymized error sentences from photo stories. Pairs propose fixes.",
      7: "Watch one budget travel YouTube video (8 min, subs). Note 3 places visited and 3 actions in past simple.",
    },
    media: {
      1: "Pair share: 'The last film or series you watched — was it good?' 60-second response.",
      2: "Watch a 2-min Stranger Things S1 scene with subtitles. Note 5 past-tense verbs and 3 character adjectives.",
      3: "Past simple + adjective vocabulary for character/plot ('scary,' 'funny,' 'boring,' 'exciting'). Inductive.",
      4: "Plot-summary gap-fill in pairs: 8 sentences about a known series with verb gaps. Then partner predicts the next event.",
      5: "Film-recommendation pair task: each learner pitches 2 films or series for 90 seconds each, using past tense and adjectives.",
      6: "Pair recommendation review: partners identify which pitch made them most want to watch the film.",
      7: "Watch one episode of Avatar: The Last Airbender (subs). Note 5 new adjectives describing characters.",
    },
    society: {
      1: "Pair share: 'What was in the news this week?' 30-second response — even partial.",
      2: "Read 3 BBC Learning English headlines on simple news topics. Note past simple verbs.",
      3: "Past simple for news + reporting structures ('A man WAS arrested,' 'The president SAID').",
      4: "Headline rewriting: take 5 simple headlines and rewrite as full past-tense sentences. Pair compare.",
      5: "News-reporting pair task: each learner reports one local news event in 90 seconds, partner asks 3 questions.",
      6: "Pair fact-check: partners verify one fact in each other's Phase 5 report. Note one improvement.",
      7: "Listen to one 6 Minute English episode. Note 5 new vocabulary items. Bring next class.",
    },
  },
  B1: {
    identity: {
      1: "Image prompt: a photo of a family gathering. 'What's the story here?' Pairs speculate in 90 seconds.",
      2: "Watch a TED-Ed animated short on identity formation (3 min). Note 3 abstract nouns about identity (belonging, heritage, kinship).",
      3: "Present perfect for life experiences: 'I have lived...', 'I have moved...'. Compare with past simple. Time markers as clue.",
      4: "Find-someone-who grid using present perfect: 'has lived in another city,' 'has changed schools,' 'has a sibling abroad.'",
      5: "Personal heritage interview: in pairs, learners interview each other for 4 minutes about family origins, then summarize to the class.",
      6: "Self-correction: learners replay a 60-second audio of their own Phase 5 turn and mark one thing they'd change.",
      7: "Watch one episode of a Casey Neistat-style vlog on family or identity (8–10 min). Identify 3 expressions of belonging used.",
    },
    daily: {
      1: "Brainstorm in pairs: 'What does a healthy week look like for you?' List 5 elements.",
      2: "Listen to a 5-min Bon Appétit clip on a recipe. Note signposting language ('First,' 'Once that's done,' 'Meanwhile').",
      3: "Sequencing adverbials + present passive for processes ('The onions ARE chopped'). When passive is natural in instructions.",
      4: "Recipe reordering: 8 cut-up steps for a Brazilian dish (e.g., feijoada). Pairs sequence and justify.",
      5: "Cook-along narration: in pairs, one learner walks through a recipe; partner asks 5 clarifying questions in real time.",
      6: "Self-correction: each learner notes one place in Phase 5 where they paused or struggled. Share strategies in pairs.",
      7: "Watch one Pick Up Limes video (10–12 min). Find 3 sequencing adverbials and 2 passive constructions.",
    },
    work: {
      1: "Quick poll: 'What's the hardest part of your job or studies right now?' 1 sentence each.",
      2: "Watch an HBR short video (3 min) on a workplace topic. Note 4 collocations ('team dynamics,' 'tight deadline').",
      3: "Modal verbs for workplace politeness: 'Could you...?', 'Would it be possible...?', 'I was wondering if...'.",
      4: "Email transformation: rewrite 5 blunt requests using polite modal language. Pair check.",
      5: "Meeting role-play: 4 learners discuss a workplace problem (e.g., a project is behind schedule). Reach a decision in 10 min.",
      6: "Recording review: learners listen to 60 seconds of their meeting and identify one move they'd refine.",
      7: "Watch one HBR IdeaCast episode (15 min). Identify the structure of one argument made. Bring next class.",
    },
    travel: {
      1: "Quick prompt: 'Best travel mistake you ever made?' 90-second pair share.",
      2: "Watch an Anthony Bourdain Parts Unknown segment (5 min) on a place. Note 4 phrases describing cultural context.",
      3: "Modal verbs for advice / recommendation: 'You should try,' 'You must visit,' 'You'd better avoid,' 'You could also.'",
      4: "Recommendation cards: pairs draw a destination card and give 5 recommendations using different modals.",
      5: "Travel-blogger pitch: each learner pitches a 4-min destination guide to a partner-as-editor. Editor pushes back.",
      6: "Recording review: each learner notes one moment they used a strong recommendation modal well.",
      7: "Listen to one travel podcast episode (20 min). Identify 5 cultural details mentioned. Bring next class.",
    },
    media: {
      1: "Quick poll: 'Last series you binged?' Each learner names one and one adjective.",
      2: "Watch a 4-min clip from The Good Place S1E1. Note past simple + past continuous; track Eleanor's arrival.",
      3: "Past simple vs. past continuous + when / while. Contrastive note: Portuguese pretérito imperfeito ≠ EN past continuous always.",
      4: "Narrative gap-fill: 8 sentences about Eleanor with both past tenses. Then transform with when / while.",
      5: "Series-pitch pairs: each learner narrates a 3-min plot summary using ≥4 past-tense verbs and 3 adjectives.",
      6: "Anonymized error gallery from Phase 5: 4 errors on the board. Class corrects collectively.",
      7: "Watch The Good Place S1E2 (24 min, subs). Note 3 new character adjectives. Optional: post to class WhatsApp.",
    },
    society: {
      1: "Quick poll: 'Most important issue in Brazil right now?' One sentence each.",
      2: "Watch a Vox short (5 min) on a global issue. Note 4 cause-effect connectors ('because,' 'as a result,' 'which led to').",
      3: "Cause-effect structures: 'X led to Y,' 'Because of X, Y happened,' 'This resulted in...'.",
      4: "Cause-effect chains: pairs build a 4-link causal chain for a recent news event. Present to another pair.",
      5: "Opinion exchange: pairs discuss 'The biggest issue facing Brazil' for 6 min. Use cause-effect structures.",
      6: "Recording review: each learner identifies one strong cause-effect move and one place they reached for L1.",
      7: "Listen to one The Daily episode (~25 min). Map the cause-effect structure of the story.",
    },
  },
  B2: {
    identity: {
      1: "Provocation: 'Identity is something you inherit, not something you choose.' Agree or disagree? 90 seconds with a partner.",
      2: "Listen to a 5-min Moth storytelling segment on family. Note 4 idiomatic expressions used to talk about belonging.",
      3: "Hedging language for sensitive topics: 'I suppose,' 'In a sense,' 'It's complicated, but...'. When and why we soften.",
      4: "Card swap: each learner gets a values card (e.g., 'family above all'). Defend it for 2 minutes — partners challenge.",
      5: "Round-table: 'What does home mean to you?' Each learner speaks 90 sec, then group discussion. Use hedging from Phase 3.",
      6: "Peer rubric: rate partner's Phase 5 turn on fluency, accuracy, complexity (1–5). Share one strength + one area.",
      7: "Listen to one Modern Love podcast episode (15–20 min). Note 5 collocations around relationships and identity.",
    },
    daily: {
      1: "Provocation: 'Brazil's eating culture is endangered.' Quick reaction in pairs (90 sec).",
      2: "Read a Bon Appétit feature (700 words) on food sustainability. Identify the author's argument and 3 supporting examples.",
      3: "Modal verbs of speculation and probability for trends ('may be shifting,' 'is likely to,' 'could end up'). Hedge claims appropriately.",
      4: "Statement transformation: rewrite 8 blunt claims as hedged versions appropriate to academic / journalistic register.",
      5: "Panel discussion: 4 learners take roles (chef, nutritionist, environmentalist, consumer). 10-min discussion on food futures.",
      6: "Peer transcription of one minute: identify 3 strong moves and 1 area for upgrade in partner's register.",
      7: "Listen to one Huberman Lab episode segment on nutrition (15 min). Map 3 evidence-claim structures used.",
    },
    work: {
      1: "Pair share: 'Describe a workplace conflict you've witnessed' (real or invented). 2 min.",
      2: "Listen to a 5-min Y Combinator talk excerpt. Map the speaker's three-part argument structure.",
      3: "Discourse markers for argumentation: 'Granted, but...', 'That said,' 'On balance,' 'In the final analysis.'",
      4: "Argument scaffolding: take a position card and build 3 supporting points with appropriate connectors. Spoken delivery to partner.",
      5: "Mini-presentation: each learner gives a 4-min talk proposing a workplace improvement. Group Q&A (3 min).",
      6: "Q&A audit: peers identify one place the presenter handled a question well and one place to improve.",
      7: "Listen to one Lex Fridman interview segment (20 min). Identify the interviewer's question structure.",
    },
    travel: {
      1: "Pair share: 'A place that changed how you see the world' — 2 min.",
      2: "Read an Atlas Obscura piece (~600 words) on an unusual destination. Identify the writer's voice and 3 vivid descriptors.",
      3: "Adjective order and sensory description: 'a small, dusty, ochre-walled village.' When precision pays off.",
      4: "Place-description rewriting: take 5 flat descriptions and add layered sensory adjectives. Pair compare.",
      5: "Travel essay aloud: each learner gives a 4-min sensory-rich description of a place. Group identifies the strongest image.",
      6: "Peer feedback on imagery: partner picks 2 strong images and 1 cliché in Phase 5 output.",
      7: "Read one Atlas Obscura article. Identify three cultural and three sensory details. Bring next class.",
    },
    media: {
      1: "Provocation: 'Streaming has ruined attention.' 2-minute pair response.",
      2: "Watch a 5-min Every Frame a Painting video on a director. Note 4 film-craft terms (mise-en-scène, pacing, framing).",
      3: "Critical vocabulary: theme, motif, arc, foil, juxtaposition, ambivalence. Definitions + examples from known films.",
      4: "Apply-the-term card game: pairs draw a critical term + a known film. Defend a 60-sec interpretation.",
      5: "Mini film review: 4-min spoken review of a recent film using ≥4 critical terms. Group identifies the strongest claim.",
      6: "Peer review of claims: partner identifies the strongest argument and one place evidence was thin.",
      7: "Watch one Severance or The Bear episode (no subs). Identify 2 thematic motifs. Bring next class.",
    },
    society: {
      1: "Provocation: 'Brazil is at a turning point.' 2-minute pair response — what does 'turning point' mean here?",
      2: "Read a 600-word Vox explainer on a political issue. Map the argument: claim, evidence, counterargument.",
      3: "Argument structure: claim → reason → evidence → acknowledgment of counter → rebuttal. Identify in input.",
      4: "Argument scaffolding: pairs build a full argument on a contested issue using all 5 moves.",
      5: "Structured debate: pairs argue opposing positions on a Brazilian policy question for 10 min.",
      6: "Peer review: partners identify the strongest evidence and the weakest counterargument handled.",
      7: "Listen to one Planet Money or Hidden Brain episode (~25 min). Map the argument structure.",
    },
  },
  C1: {
    identity: {
      1: "Quote response: 'We are who we were when we first felt foreign.' (Lahiri, paraphrased). 2 minutes of free response with a partner.",
      2: "Read a 600-word Ezra Klein newsletter on identity politics. Identify the writer's hedging, qualification, and rhetorical moves.",
      3: "Discourse markers for nuance: 'It's not that... but rather...', 'On one reading...', 'To put it more precisely...'.",
      4: "Reformulation chain: take a blunt statement → soften it three ways with increasing nuance. Compare in pairs.",
      5: "Mini-essay aloud: 3-min spoken op-ed on a personal identity question. Group offers one structural and one stylistic note.",
      6: "Self-transcription: learners transcribe 60 sec of their Phase 5 output and identify one place to upgrade lexical precision.",
      7: "Read one Substack essay on identity or culture (~10 min). Bring one rhetorical move you noticed for next class.",
    },
    daily: {
      1: "Quote response: 'You are what you eat — but who decides what's edible?' 2-minute paired response.",
      2: "Read a long-form essay (1200 words) on slow food or food philosophy. Map the argument and identify rhetorical strategy.",
      3: "Nominalization and abstract phrasing ('the practice of mindful consumption' vs. 'eating slowly'). When formal noun phrases serve.",
      4: "Style transfer: rewrite 5 conversational claims about food in academic register with nominalization.",
      5: "Position paper aloud: 4-min spoken argument on a food / lifestyle ethics question. Group offers one critical and one structural note.",
      6: "Style audit: peer notes one place where partner's register shifted unintentionally and one place it was deftly modulated.",
      7: "Read one On Being interview transcript on food philosophy. Bring one rhetorical or conceptual move next class.",
    },
    work: {
      1: "Quote response: 'Productivity is the wage of the soul.' 2 min of paired response.",
      2: "Read a Hacker News thread on a contested technical topic. Map the argument moves and rhetorical strategies.",
      3: "Hedging at a senior register: 'It strikes me that...,' 'There's a case to be made...,' 'I'm inclined to think...'.",
      4: "Steel-man exercise: take a position you disagree with and present the strongest version of it in 2 min.",
      5: "Round-table: 'What's the future of knowledge work?' 4 learners, 15 min, with reading prep.",
      6: "Argument peer review: partner identifies the strongest claim and one logical gap in Phase 5 output.",
      7: "Read one Stratechery article. Identify three rhetorical moves the writer uses. Bring next class.",
    },
    travel: {
      1: "Quote response: 'A journey is best measured in friends, rather than miles.' (Tim Cahill). 2 min.",
      2: "Read a Foreign Affairs article on a country or region. Map the analytical framing and geopolitical claims.",
      3: "Cause-effect and conditional structures for analysis: 'Were the borders to shift, the consequences would be...'.",
      4: "Geopolitical scenario writing: pairs construct 3 conditional analyses about a hypothetical regional change.",
      5: "Briefing: each learner gives a 4-min analytical briefing on a region. Group asks critical questions.",
      6: "Argument peer review: partner identifies the most defensible and the most contestable claim in Phase 5.",
      7: "Read one Foreign Affairs analysis. Identify three structural moves of policy argument.",
    },
    media: {
      1: "Quote response: 'Television has lifted the playwright's burden of constructing a plot.' 2 min.",
      2: "Read a 1200-word film essay (e.g., Reverse Shot, Senses of Cinema). Map argument and identify theoretical vocabulary.",
      3: "Theoretical framing: auteur theory, genre as ideology, the gaze, postmodern pastiche. When framework enables critique.",
      4: "Apply-a-theory writing: take a theoretical lens and write a 100-word reading of a film. Pair exchange.",
      5: "Film-theory plenary: 5-min argued reading of a film through a chosen lens. Group offers counter-readings.",
      6: "Counter-reading peer review: partner offers the strongest alternative reading to one Phase 5 claim.",
      7: "Read one Backlisted-listed academic essay. Identify the theoretical frame deployed.",
    },
    society: {
      1: "Quote response: 'A society is what its laws fail to prevent.' 2-minute pair response.",
      2: "Read a 1500-word Atlantic essay on policy or society. Map argument and identify rhetorical strategies.",
      3: "Concession-counter structures: 'While X, nonetheless Y.' 'For all the merits of X, Y remains.' Hedged disagreement.",
      4: "Concession drill: take 5 strong claims and add appropriate concession + counter. Pair compare register.",
      5: "Policy briefing: 4-min argued briefing on a Brazilian or global policy. Group offers critical questions.",
      6: "Argument peer review: partner identifies one logical gap and one place hedging served the argument.",
      7: "Read one Ezra Klein newsletter. Identify three rhetorical moves the writer uses.",
    },
  },
  C2: {
    identity: {
      1: "Aphorism debate: 'The self is a habit, not a fact.' Take 2 minutes — defend, refute, or complicate.",
      2: "Read a London Review of Books essay (1500 words) on diaspora and identity. Map the argument structure and stylistic register shifts.",
      3: "Rhetorical inversion, anaphora, periodic sentence. Identify in input, then attempt one of each in writing.",
      4: "Style transfer: rewrite a flat paragraph in three voices: academic, literary, polemical.",
      5: "Salon: 8-minute spoken essay on an identity question. Group offers critical response in academic register.",
      6: "Style autopsy: peer marks the stylistic high and low points of partner's Phase 5 turn with reasoning.",
      7: "Engage with one essay from Granta or LRB. Identify the writer's signature stylistic move.",
    },
    daily: {
      1: "Provocation: 'Authenticity in food is a marketing fiction.' Defend, refute, or complicate in 2 min.",
      2: "Read an MFK Fisher essay or a Harper's piece on food culture. Map voice, register, and stylistic signatures.",
      3: "Literary register: simile, metaphor, controlled fragment. When stylistic risk pays off in non-fiction.",
      4: "Pastiche: write one 100-word paragraph in MFK Fisher's voice and one in Bourdain's. Share aloud.",
      5: "Salon: 8-min spoken essay on a question of food, culture, and meaning. Group offers critical literary response.",
      6: "Stylistic peer review: partners identify the strongest sentence and weakest sentence in Phase 5 output with reasoning.",
      7: "Read one full Bourdain or Solnit essay on place and food. Identify the writer's signature voice.",
    },
    work: {
      1: "Provocation: 'The professional self is a performance.' Defend, refute, complicate in 2 min.",
      2: "Read a longform essay on labor and identity (e.g., from The Atlantic). Map argument and stylistic signatures.",
      3: "Subordinate clause embedding and periodic sentences. When complex syntax aids precision.",
      4: "Sentence-level rewriting: take 5 simple statements and embed them into complex periodic structures. Pair compare.",
      5: "Plenary contribution: 6-min spoken position on the future of work. Group critical response.",
      6: "Stylistic peer review: identify the most precise and the most imprecise sentence in Phase 5.",
      7: "Read one academic article (~5000 words) on work and meaning. Bring one conceptual move next class.",
    },
    travel: {
      1: "Provocation: 'Travel writing is colonial.' Defend, refute, or complicate in 2 min.",
      2: "Read a Rebecca Solnit or Bruce Chatwin essay. Map voice, register, and the relationship between place and meaning.",
      3: "Lyrical register, controlled metaphor, and meditative pacing. When prose slows for resonance.",
      4: "Pastiche: write 150 words in Solnit's voice describing a Brazilian landscape. Share aloud.",
      5: "Travel-essay reading: each learner reads aloud a 500-word original travel essay. Group offers critical literary response.",
      6: "Stylistic peer review: partner identifies the strongest and weakest stylistic risk taken.",
      7: "Read one full Solnit, Theroux, or Chatwin chapter. Identify the writer's signature stylistic move.",
    },
    media: {
      1: "Provocation: 'Genre is the death of art.' Defend, refute, complicate in 2 min.",
      2: "Read a James Wood or Pauline Kael review. Map voice, evaluative moves, and stylistic signatures.",
      3: "Evaluative register: judgment without flatness. 'Brilliant but exhausting'; 'admirable in ambition, modest in result.'",
      4: "Pastiche review: write 200 words in Kael's evaluative voice on a film you've seen. Share aloud.",
      5: "Critical salon: 8-min spoken review of a film or series in chosen critical voice. Group offers literary response.",
      6: "Stylistic peer review: partner identifies the strongest evaluative move and one place that flattened.",
      7: "Read one full James Wood essay. Identify the writer's signature evaluative move.",
    },
    society: {
      1: "Provocation: 'Politics is downstream of culture.' 2 min — defend, refute, complicate.",
      2: "Read an LRB or Foreign Affairs essay. Map argument and identify stylistic + rhetorical signatures.",
      3: "Subordinated argument: long periodic sentences carrying complex hedged claims. When syntax does the argumentative work.",
      4: "Sentence-level argument: take a complex hedged claim and render it as a single 50-word period.",
      5: "Plenary contribution: 8-min spoken essay on a contested societal question. Group critical response.",
      6: "Stylistic peer review: partner identifies the most subtle rhetorical move in Phase 5.",
      7: "Read one full LRB essay or Tim Ferriss long-form interview. Identify the writer's signature move.",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────

export default function LessonFrameworkSite() {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedLevel, setSelectedLevel] = useState('B1');
  const [selectedCell, setSelectedCell] = useState({ level: 'B1', theme: 'media' });
  const [activePhase, setActivePhase] = useState(1);
  const [scrolled, setScrolled] = useState(false);

  // Compose-section state
  const [composeLesson, setComposeLesson] = useState(3);
  // Per-phase activity index (default 0 = first option)
  const [composeActivities, setComposeActivities] = useState({});
  // Per-phase custom text override (if user has edited)
  const [composeCustom, setComposeCustom] = useState({});
  // Which phase is currently in edit mode (id or null)
  const [editingPhase, setEditingPhase] = useState(null);
  // Local draft text while editing
  const [draftText, setDraftText] = useState('');
  // Copy-confirmation toast
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cellData = MACRO[selectedCell.level]?.[selectedCell.theme];
  const phaseData = PHASES.find(p => p.id === activePhase);

  // ─── COMPOSE HELPERS ───────────────────────────────────────────────────
  const composeLevel = selectedCell.level;
  const composeTheme = selectedCell.theme;
  const composeCell = MACRO[composeLevel]?.[composeTheme];
  const composeThemeData = THEMES.find(t => t.id === composeTheme);
  const composeLevelData = LEVELS.find(l => l.id === composeLevel);
  const composeArchetype = ARCHETYPES[composeLesson - 1];

  const getExample = (phaseId) => {
    if (composeCustom[phaseId] !== undefined) return composeCustom[phaseId];
    return EXAMPLES[composeLevel]?.[composeTheme]?.[phaseId] || '';
  };

  const getActivityIdx = (phaseId) => composeActivities[phaseId] ?? 0;

  const setActivity = (phaseId, idx) => {
    setComposeActivities(prev => ({ ...prev, [phaseId]: idx }));
  };

  const startEdit = (phaseId) => {
    setDraftText(getExample(phaseId));
    setEditingPhase(phaseId);
  };

  const saveEdit = (phaseId) => {
    setComposeCustom(prev => ({ ...prev, [phaseId]: draftText }));
    setEditingPhase(null);
  };

  const cancelEdit = () => {
    setEditingPhase(null);
    setDraftText('');
  };

  const resetExample = (phaseId) => {
    setComposeCustom(prev => {
      const next = { ...prev };
      delete next[phaseId];
      return next;
    });
  };

  const resetAll = () => {
    setComposeLesson(3);
    setComposeActivities({});
    setComposeCustom({});
    setSelectedCell({ level: 'B1', theme: 'media' });
    setSelectedLevel('B1');
  };

  const buildMarkdown = () => {
    let md = `# Lesson Plan — ${composeThemeData.name}\n\n`;
    md += `**Level:** ${composeLevel} · ${composeLevelData.name}\n`;
    md += `**Unit:** ${composeThemeData.num}. ${composeThemeData.name}\n`;
    md += `**Lesson:** ${composeLesson} of 8 — *${composeArchetype.name}*\n`;
    md += `**Archetype focus:** ${composeArchetype.focus}\n\n`;
    md += `## Can-do outcomes\n\n`;
    composeCell.cando.forEach(c => { md += `- I can ${c}.\n`; });
    md += `\n## Informal-input bridge\n\n`;
    composeCell.bridge.forEach(b => { md += `- ${b}\n`; });
    md += `\n---\n\n## Lesson plan (60 min)\n\n`;
    PHASES.forEach((phase, i) => {
      const time = composeArchetype.times[i];
      const actIdx = getActivityIdx(phase.id);
      const activity = phase.activities[actIdx];
      const example = getExample(phase.id);
      md += `### Phase ${phase.id} — ${phase.name}  \n`;
      md += `*${time} min · ${activity.name}*\n\n`;
      md += `${example}\n\n`;
      md += `> **SLA grounding:** ${activity.sla}\n\n`;
    });
    md += `\n---\n*Generated with the English with Pedro lesson framework.*\n`;
    return md;
  };

  const handleCopyMarkdown = async () => {
    const md = buildMarkdown();
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (e) {
      // Fallback for environments without clipboard API
      const ta = document.createElement('textarea');
      ta.value = md;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2400); }
      catch (err) { console.error('Copy failed', err); }
      document.body.removeChild(ta);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="lf-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=JetBrains+Mono:wght@400;500;600&display=swap');

        :root {
          --paper: #F2EBDD;
          --paper-deep: #E8DFCB;
          --paper-shadow: #DCD0B8;
          --ink: #1A1612;
          --ink-soft: #3D342C;
          --ink-mute: #6B5F52;
          --wine: #722F37;
          --wine-deep: #4F1A1F;
          --wine-light: #A04C53;
          --gold: #B8924A;
          --gold-soft: #D4B47A;
          --sage: #5E6B52;
          --line: #C7B89A;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .lf-root {
          background: var(--paper);
          color: var(--ink);
          font-family: 'Newsreader', Georgia, serif;
          font-size: 17px;
          line-height: 1.55;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .lf-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(114, 47, 55, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(184, 146, 74, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .lf-grain {
          position: fixed;
          inset: 0;
          opacity: 0.4;
          pointer-events: none;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .lf-display { font-family: 'Fraunces', Georgia, serif; font-weight: 500; letter-spacing: -0.02em; }
        .lf-mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: 'ss01'; }

        /* ─── NAV ─── */
        .lf-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          transition: all 0.3s ease;
          padding: 18px 0;
        }
        .lf-nav-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .lf-monogram {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 22px;
          color: var(--wine-deep);
          letter-spacing: -0.04em;
        }
        .lf-monogram span { color: var(--gold); }
        .lf-nav-links {
          display: flex;
          gap: 28px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .lf-nav-link {
          color: var(--ink-soft);
          cursor: pointer;
          padding: 8px 0;
          border-bottom: 1px solid transparent;
          transition: all 0.2s;
          background: none;
          border-top: none;
          border-left: none;
          border-right: none;
          font: inherit;
        }
        .lf-nav-link:hover, .lf-nav-link.active {
          color: var(--wine-deep);
          border-bottom-color: var(--wine-deep);
        }

        /* ─── HERO ─── */
        .lf-hero {
          padding: 80px 32px 120px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .lf-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--wine);
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lf-eyebrow::before {
          content: '';
          width: 32px;
          height: 1px;
          background: var(--wine);
        }
        .lf-hero h1 {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: clamp(48px, 8vw, 104px);
          line-height: 0.96;
          letter-spacing: -0.035em;
          color: var(--ink);
          margin-bottom: 40px;
          max-width: 1100px;
        }
        .lf-hero h1 em {
          font-style: italic;
          font-weight: 300;
          color: var(--wine-deep);
        }
        .lf-hero-sub {
          max-width: 680px;
          font-size: 19px;
          line-height: 1.6;
          color: var(--ink-soft);
          margin-bottom: 56px;
        }
        .lf-hero-meta {
          display: flex;
          gap: 56px;
          flex-wrap: wrap;
          padding-top: 32px;
          border-top: 1px solid var(--line);
        }
        .lf-hero-meta-item {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .lf-hero-meta-item div:first-child {
          color: var(--ink-mute);
          margin-bottom: 6px;
        }
        .lf-hero-meta-item div:last-child {
          color: var(--ink);
          font-family: 'Fraunces', serif;
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.01em;
          text-transform: none;
        }

        /* ─── SECTION ─── */
        .lf-section {
          padding: 100px 32px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .lf-section-header {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 32px;
          margin-bottom: 72px;
          align-items: start;
        }
        .lf-section-num {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 80px;
          line-height: 0.9;
          color: var(--wine);
        }
        .lf-section-title h2 {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.02;
          letter-spacing: -0.025em;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .lf-section-title h2 em {
          font-style: italic;
          color: var(--wine);
        }
        .lf-section-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--wine);
          margin-bottom: 16px;
        }
        .lf-section-desc {
          max-width: 720px;
          color: var(--ink-soft);
          font-size: 18px;
          line-height: 1.65;
        }

        /* ─── OVERVIEW DIAGRAM ─── */
        .lf-overview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-top: 48px;
        }
        .lf-overview-card {
          background: var(--paper-deep);
          border: 1px solid var(--line);
          padding: 40px;
          position: relative;
        }
        .lf-overview-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 4px;
          background: var(--wine);
        }
        .lf-overview-card.micro::before { background: var(--gold); }
        .lf-overview-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--wine);
          margin-bottom: 16px;
        }
        .lf-overview-card.micro .lf-overview-tag { color: var(--gold); }
        .lf-overview-card h3 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 32px;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
        }
        .lf-overview-card p { color: var(--ink-soft); margin-bottom: 16px; }
        .lf-overview-list {
          list-style: none;
          margin-top: 24px;
        }
        .lf-overview-list li {
          padding: 10px 0;
          border-bottom: 1px dotted var(--line);
          color: var(--ink-soft);
          font-size: 15px;
          display: flex;
          gap: 16px;
          align-items: baseline;
        }
        .lf-overview-list li:last-child { border-bottom: none; }
        .lf-overview-list .lf-mono {
          color: var(--wine);
          font-size: 11px;
          min-width: 60px;
        }

        /* ─── MACRO GRID ─── */
        .lf-macro-controls {
          display: flex;
          gap: 0;
          margin-bottom: 32px;
          border: 1px solid var(--line);
          overflow-x: auto;
          background: var(--paper-deep);
        }
        .lf-level-btn {
          flex: 1;
          padding: 16px 20px;
          background: transparent;
          border: none;
          border-right: 1px solid var(--line);
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          color: var(--ink-soft);
          text-align: left;
          transition: all 0.2s;
          min-width: 140px;
          position: relative;
        }
        .lf-level-btn:last-child { border-right: none; }
        .lf-level-btn:hover { background: var(--paper-shadow); }
        .lf-level-btn.active {
          background: var(--wine-deep);
          color: var(--paper);
        }
        .lf-level-btn .lf-level-label {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .lf-level-btn .lf-level-name {
          display: block;
          font-size: 10px;
          opacity: 0.7;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .lf-macro-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
        }
        @media (max-width: 900px) {
          .lf-macro-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .lf-macro-grid { grid-template-columns: 1fr; }
        }
        .lf-cell {
          background: var(--paper-deep);
          padding: 28px 24px;
          cursor: pointer;
          transition: all 0.25s;
          position: relative;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
          border: none;
          font: inherit;
          color: inherit;
        }
        .lf-cell:hover {
          background: var(--paper);
          transform: translateY(-2px);
        }
        .lf-cell.active {
          background: var(--ink);
          color: var(--paper);
        }
        .lf-cell-num {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 13px;
          color: var(--wine);
          letter-spacing: 0.04em;
        }
        .lf-cell.active .lf-cell-num { color: var(--gold-soft); }
        .lf-cell-icon {
          color: var(--wine);
          opacity: 0.85;
        }
        .lf-cell.active .lf-cell-icon { color: var(--gold); }
        .lf-cell-name {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 20px;
          letter-spacing: -0.015em;
          line-height: 1.15;
        }
        .lf-cell-preview {
          margin-top: auto;
          font-size: 13px;
          color: var(--ink-mute);
          font-style: italic;
        }
        .lf-cell.active .lf-cell-preview { color: var(--paper-shadow); }

        /* Detail panel */
        .lf-detail {
          margin-top: 32px;
          background: var(--ink);
          color: var(--paper);
          padding: 56px;
          position: relative;
          overflow: hidden;
        }
        .lf-detail::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(184, 146, 74, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .lf-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(184, 146, 74, 0.3);
          flex-wrap: wrap;
          gap: 16px;
        }
        .lf-detail-title {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: 36px;
          letter-spacing: -0.02em;
        }
        .lf-detail-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--gold-soft);
        }
        .lf-detail-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
        }
        @media (max-width: 800px) {
          .lf-detail { padding: 36px 24px; }
          .lf-detail-body { grid-template-columns: 1fr; gap: 40px; }
        }
        .lf-detail-section h4 {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--gold);
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px dotted rgba(184, 146, 74, 0.4);
        }
        .lf-cando-list { list-style: none; }
        .lf-cando-list li {
          padding: 12px 0;
          font-family: 'Newsreader', serif;
          font-size: 17px;
          line-height: 1.5;
          color: var(--paper);
          display: flex;
          gap: 16px;
          align-items: baseline;
        }
        .lf-cando-list li::before {
          content: '"I can';
          font-family: 'Fraunces', serif;
          font-style: italic;
          color: var(--gold);
          flex-shrink: 0;
        }
        .lf-cando-list li::after { content: '"'; color: var(--gold); }
        .lf-bridge-list { list-style: none; }
        .lf-bridge-list li {
          padding: 12px 0;
          border-bottom: 1px dotted rgba(184, 146, 74, 0.2);
          font-size: 16px;
          color: var(--paper);
          display: flex;
          gap: 14px;
          align-items: center;
        }
        .lf-bridge-list li:last-child { border-bottom: none; }
        .lf-bridge-list li::before {
          content: '☞';
          color: var(--gold);
          font-size: 14px;
        }

        /* Strand distribution bar */
        .lf-strands {
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid rgba(184, 146, 74, 0.3);
        }
        .lf-strands-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--gold);
          margin-bottom: 16px;
        }
        .lf-strands-bar {
          display: flex;
          height: 32px;
          background: rgba(184, 146, 74, 0.1);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 500;
        }
        .lf-strand {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          transition: flex 0.4s;
        }

        /* ─── MICRO TIMELINE ─── */
        .lf-timeline {
          margin-top: 32px;
        }
        .lf-timeline-track {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 48px;
          position: relative;
        }
        @media (max-width: 900px) {
          .lf-timeline-track { grid-template-columns: 1fr; }
        }
        .lf-phase-btn {
          background: var(--paper-deep);
          border: 1px solid var(--line);
          padding: 24px 16px;
          cursor: pointer;
          transition: all 0.25s;
          text-align: left;
          font: inherit;
          color: inherit;
          position: relative;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .lf-phase-btn:hover {
          border-color: var(--wine);
          transform: translateY(-2px);
        }
        .lf-phase-btn.active {
          background: var(--wine-deep);
          color: var(--paper);
          border-color: var(--wine-deep);
        }
        .lf-phase-num {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 40px;
          line-height: 1;
          color: var(--wine);
          letter-spacing: -0.02em;
        }
        .lf-phase-btn.active .lf-phase-num { color: var(--gold); }
        .lf-phase-name {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 15px;
          line-height: 1.2;
          letter-spacing: -0.01em;
          margin-top: auto;
        }
        .lf-phase-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--ink-mute);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .lf-phase-btn.active .lf-phase-time { color: var(--gold-soft); }
        .lf-phase-icon {
          opacity: 0.7;
          color: var(--wine);
        }
        .lf-phase-btn.active .lf-phase-icon { color: var(--gold); opacity: 1; }

        .lf-phase-detail {
          background: var(--paper-deep);
          border: 1px solid var(--line);
          padding: 48px;
        }
        @media (max-width: 800px) { .lf-phase-detail { padding: 32px 24px; } }
        .lf-phase-detail-header {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 32px;
          margin-bottom: 40px;
          padding-bottom: 32px;
          border-bottom: 1px solid var(--line);
        }
        .lf-phase-detail-num {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 72px;
          line-height: 0.9;
          color: var(--wine);
        }
        .lf-phase-detail-title {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 36px;
          letter-spacing: -0.025em;
          margin-bottom: 8px;
        }
        .lf-phase-detail-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--wine);
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }
        .lf-phase-purpose {
          font-style: italic;
          font-size: 18px;
          line-height: 1.55;
          color: var(--ink-soft);
          margin-bottom: 12px;
          max-width: 800px;
        }
        .lf-phase-sla {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--wine);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .lf-activities {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
        }
        .lf-activity {
          background: var(--paper);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: background 0.2s;
        }
        .lf-activity:hover { background: var(--paper-deep); }
        .lf-activity-name {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 17px;
          line-height: 1.3;
          letter-spacing: -0.01em;
          color: var(--ink);
        }
        .lf-activity-meta {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px dotted var(--line);
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--ink-mute);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .lf-activity-best {
          color: var(--wine);
          font-weight: 500;
        }

        /* ─── WORKED EXAMPLE ─── */
        .lf-example {
          background: var(--ink);
          color: var(--paper);
          padding: 80px 56px;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 800px) { .lf-example { padding: 56px 24px; } }
        .lf-example::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(114, 47, 55, 0.4) 0%, transparent 70%);
          pointer-events: none;
        }
        .lf-example-header {
          margin-bottom: 56px;
          position: relative;
          z-index: 2;
        }
        .lf-example-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--gold);
          margin-bottom: 24px;
        }
        .lf-example-title {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.025em;
          margin-bottom: 32px;
          max-width: 900px;
        }
        .lf-example-title em { font-style: italic; color: var(--gold-soft); }
        .lf-example-meta-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 32px;
          padding: 24px 0;
          border-top: 1px solid rgba(184, 146, 74, 0.3);
          border-bottom: 1px solid rgba(184, 146, 74, 0.3);
        }
        .lf-example-meta-row > div > div:first-child {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--gold);
          margin-bottom: 8px;
        }
        .lf-example-meta-row > div > div:last-child {
          font-family: 'Fraunces', serif;
          font-size: 16px;
          line-height: 1.4;
        }
        .lf-example-phases {
          position: relative;
          z-index: 2;
        }
        .lf-example-phase {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 32px;
          padding: 28px 0;
          border-bottom: 1px dotted rgba(184, 146, 74, 0.3);
        }
        .lf-example-phase:last-child { border-bottom: none; }
        .lf-example-phase-num {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 48px;
          line-height: 1;
          color: var(--gold);
        }
        .lf-example-phase-content h5 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 18px;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }
        .lf-example-phase-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 12px;
        }
        .lf-example-phase-activity {
          font-size: 16px;
          line-height: 1.6;
          color: var(--paper-deep);
        }

        /* ─── TRACKS ─── */
        .lf-tracks {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-top: 32px;
        }
        .lf-track-card {
          background: var(--paper-deep);
          border: 1px solid var(--line);
          padding: 36px 32px;
          position: relative;
          transition: all 0.25s;
        }
        .lf-track-card:hover {
          background: var(--paper);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(26, 22, 18, 0.06);
        }
        .lf-track-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 3px;
          background: var(--wine);
        }
        .lf-track-icon {
          color: var(--wine);
          margin-bottom: 20px;
        }
        .lf-track-name {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 24px;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .lf-track-examples {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--wine);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px dotted var(--line);
          line-height: 1.6;
        }
        .lf-track-profile {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--ink-mute);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        .lf-track-note {
          font-size: 15px;
          line-height: 1.6;
          color: var(--ink-soft);
        }

        /* ─── PRINCIPLES (footer) ─── */
        .lf-principles {
          background: var(--wine-deep);
          color: var(--paper);
          padding: 100px 32px;
          position: relative;
          z-index: 2;
        }
        .lf-principles-inner {
          max-width: 1400px;
          margin: 0 auto;
        }
        .lf-principles-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--gold-soft);
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lf-principles-tag::before {
          content: '';
          width: 40px;
          height: 1px;
          background: var(--gold-soft);
        }
        .lf-principles h2 {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: clamp(36px, 5vw, 56px);
          line-height: 1.05;
          letter-spacing: -0.025em;
          margin-bottom: 64px;
          max-width: 900px;
        }
        .lf-principles h2 em { font-style: italic; color: var(--gold-soft); }
        .lf-principles-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 56px;
          counter-reset: principle;
        }
        .lf-principle {
          counter-increment: principle;
          padding-top: 32px;
          border-top: 1px solid rgba(184, 146, 74, 0.3);
        }
        .lf-principle::before {
          content: counter(principle, decimal-leading-zero);
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 36px;
          color: var(--gold-soft);
          display: block;
          margin-bottom: 16px;
        }
        .lf-principle h4 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 22px;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .lf-principle p {
          color: var(--paper-deep);
          font-size: 16px;
          line-height: 1.65;
        }

        /* ─── FOOTER ─── */
        .lf-footer {
          background: var(--ink);
          color: var(--paper-deep);
          padding: 56px 32px;
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          position: relative;
          z-index: 2;
        }
        .lf-footer-mono {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 48px;
          text-transform: none;
          letter-spacing: -0.02em;
          color: var(--gold);
          margin-bottom: 20px;
          display: block;
        }
        .lf-footer-line { color: var(--ink-mute); margin-top: 24px; }

        /* ─── ORNAMENT ─── */
        .lf-ornament {
          text-align: center;
          font-family: 'Fraunces', serif;
          font-size: 32px;
          color: var(--gold);
          margin: 24px 0;
          letter-spacing: 0.6em;
          opacity: 0.7;
        }

        /* ─── ANIMATIONS ─── */
        @keyframes lf-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lf-hero h1, .lf-hero-sub, .lf-hero-meta, .lf-eyebrow {
          animation: lf-fade-up 0.8s ease-out backwards;
        }
        .lf-eyebrow { animation-delay: 0s; }
        .lf-hero h1 { animation-delay: 0.1s; }
        .lf-hero-sub { animation-delay: 0.3s; }
        .lf-hero-meta { animation-delay: 0.45s; }

        /* ─── COMPOSE A LESSON ─── */
        .lf-compose-selectors {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
          margin-bottom: 24px;
        }
        @media (max-width: 1000px) {
          .lf-compose-selectors { grid-template-columns: 1fr 1fr; }
          .lf-compose-actions { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .lf-compose-selectors { grid-template-columns: 1fr; }
        }
        .lf-compose-selector {
          background: var(--paper-deep);
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .lf-compose-selector-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--wine);
        }
        .lf-compose-select {
          background: transparent;
          border: none;
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 18px;
          letter-spacing: -0.01em;
          color: var(--ink);
          cursor: pointer;
          padding: 4px 0;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23722F37' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 4px center;
          padding-right: 24px;
        }
        .lf-compose-actions {
          background: var(--paper-deep);
          padding: 20px 24px;
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
        }
        .lf-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 10px 16px;
          border: 1px solid var(--wine);
          cursor: pointer;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: var(--wine);
          white-space: nowrap;
        }
        .lf-btn:hover { transform: translateY(-1px); }
        .lf-btn-primary {
          background: var(--wine-deep);
          color: var(--paper);
          border-color: var(--wine-deep);
        }
        .lf-btn-primary:hover { background: var(--ink); border-color: var(--ink); }
        .lf-btn-secondary {
          background: var(--paper);
          color: var(--wine);
        }
        .lf-btn-secondary:hover { background: var(--paper-shadow); }
        .lf-btn-ghost {
          border-color: var(--line);
          color: var(--ink-mute);
        }
        .lf-btn-ghost:hover { color: var(--wine); border-color: var(--wine); }

        .lf-compose-context {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
          margin-bottom: 32px;
        }
        @media (max-width: 900px) {
          .lf-compose-context { grid-template-columns: 1fr; }
        }
        .lf-compose-context-col {
          background: var(--paper);
          padding: 28px 24px;
        }
        .lf-compose-context-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--wine);
          margin-bottom: 16px;
        }
        .lf-compose-context-archetype {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 22px;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
          color: var(--ink);
        }
        .lf-compose-context-archetype-focus {
          font-style: italic;
          color: var(--ink-soft);
          font-size: 15px;
          line-height: 1.5;
        }
        .lf-compose-cando, .lf-compose-bridge {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .lf-compose-cando li {
          padding: 6px 0;
          font-size: 14px;
          line-height: 1.5;
          color: var(--ink-soft);
        }
        .lf-compose-cando li::before {
          content: '"I can ';
          font-family: 'Fraunces', serif;
          font-style: italic;
          color: var(--wine);
        }
        .lf-compose-cando li::after { content: '."'; color: var(--wine); }
        .lf-compose-bridge li {
          padding: 6px 0;
          font-size: 14px;
          line-height: 1.5;
          color: var(--ink-soft);
          display: flex;
          gap: 10px;
          align-items: baseline;
        }
        .lf-compose-bridge li::before {
          content: '☞';
          color: var(--gold);
          flex-shrink: 0;
        }

        /* PLAN HEADER */
        .lf-compose-plan-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--ink);
          gap: 24px;
          flex-wrap: wrap;
        }
        .lf-compose-plan-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--wine);
          margin-bottom: 8px;
        }
        .lf-compose-plan-title {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: -0.025em;
          color: var(--ink);
          line-height: 1.05;
        }
        .lf-compose-plan-total {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 32px;
          color: var(--wine);
          letter-spacing: -0.02em;
        }

        /* PHASE CARD */
        .lf-compose-phase {
          background: var(--paper-deep);
          border: 1px solid var(--line);
          padding: 32px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        @media (max-width: 700px) { .lf-compose-phase { padding: 24px 20px; } }
        .lf-compose-phase:hover {
          background: var(--paper);
          border-color: var(--wine-light);
        }
        .lf-compose-phase.focused {
          background: var(--paper);
          border-color: var(--wine);
          border-left: 4px solid var(--wine);
          padding-left: 36px;
        }
        @media (max-width: 700px) {
          .lf-compose-phase.focused { padding-left: 28px; }
        }
        .lf-compose-phase-head {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 24px;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px dotted var(--line);
        }
        @media (max-width: 600px) {
          .lf-compose-phase-head {
            grid-template-columns: 60px 1fr;
            gap: 16px;
          }
        }
        .lf-compose-phase-num {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 48px;
          line-height: 1;
          color: var(--wine);
          letter-spacing: -0.03em;
        }
        @media (max-width: 600px) { .lf-compose-phase-num { font-size: 36px; } }
        .lf-compose-phase-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .lf-compose-phase-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lf-compose-phase-icon { color: var(--wine); }
        .lf-compose-phase-title {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 22px;
          letter-spacing: -0.02em;
          color: var(--ink);
        }
        .lf-compose-phase-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--wine);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          padding: 6px 12px;
          background: var(--paper-shadow);
          border-radius: 2px;
        }
        .lf-compose-activities-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--ink-mute);
          margin-bottom: 12px;
        }
        .lf-compose-activities {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 24px;
        }
        .lf-pill {
          font-family: 'Newsreader', serif;
          font-size: 14px;
          padding: 8px 14px;
          background: var(--paper);
          border: 1px solid var(--line);
          color: var(--ink-soft);
          cursor: pointer;
          transition: all 0.15s;
          line-height: 1.3;
        }
        .lf-pill:hover {
          border-color: var(--wine);
          color: var(--wine);
        }
        .lf-pill.active {
          background: var(--wine-deep);
          color: var(--paper);
          border-color: var(--wine-deep);
        }

        .lf-compose-example-block {
          background: var(--paper);
          border: 1px solid var(--line);
          padding: 20px;
          margin-bottom: 16px;
        }
        .lf-compose-example-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--wine);
        }
        .lf-custom-tag {
          color: var(--gold);
          font-style: italic;
          margin-left: 4px;
          text-transform: none;
          font-size: 11px;
          letter-spacing: 0.04em;
        }
        .lf-compose-example-actions {
          display: flex;
          gap: 4px;
        }
        .lf-icon-btn {
          width: 28px;
          height: 28px;
          padding: 0;
          background: transparent;
          border: 1px solid var(--line);
          color: var(--ink-soft);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
        }
        .lf-icon-btn:hover {
          border-color: var(--wine);
          color: var(--wine);
          background: var(--paper-shadow);
        }
        .lf-icon-btn-primary {
          background: var(--wine);
          color: var(--paper);
          border-color: var(--wine);
        }
        .lf-icon-btn-primary:hover {
          background: var(--wine-deep);
          color: var(--paper);
        }
        .lf-compose-example-text {
          font-family: 'Newsreader', serif;
          font-size: 17px;
          line-height: 1.55;
          color: var(--ink);
        }
        .lf-compose-example-edit {
          width: 100%;
          font-family: 'Newsreader', serif;
          font-size: 17px;
          line-height: 1.55;
          color: var(--ink);
          background: var(--paper-deep);
          border: 1px solid var(--wine);
          padding: 12px;
          resize: vertical;
          min-height: 100px;
          outline: none;
        }
        .lf-compose-example-edit:focus { border-color: var(--wine-deep); }
        .lf-compose-sla {
          font-family: 'Newsreader', serif;
          font-size: 13px;
          color: var(--ink-mute);
          font-style: italic;
          padding-top: 8px;
        }
        .lf-compose-sla .lf-mono {
          font-style: normal;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--wine);
          margin-right: 4px;
        }

        /* ─── PRINT STYLESHEET (used for PDF export) ─── */
        @media print {
          @page { margin: 18mm 16mm; size: A4; }

          /* Hide chrome */
          .lf-nav, .lf-hero, #overview, #macro, #micro,
          .lf-principles, .lf-footer, .lf-grain,
          .lf-compose-selectors, .lf-section-header,
          .lf-phase-edit-btn, .lf-compose-example-actions,
          .lf-ornament {
            display: none !important;
          }

          /* Print backgrounds white-ish for ink saving */
          .lf-root { background: white !important; }
          .lf-section { padding: 0 !important; max-width: 100% !important; }
          .lf-compose { padding: 0 !important; }

          /* Context strip becomes a compact header */
          .lf-compose-context {
            grid-template-columns: 1fr !important;
            border: none !important;
            background: transparent !important;
            margin-bottom: 16px !important;
            page-break-inside: avoid;
          }
          .lf-compose-context-col {
            background: transparent !important;
            padding: 8px 0 !important;
            border-bottom: 1px solid #333 !important;
          }
          .lf-compose-context-col:last-child { border-bottom: 2px solid #000 !important; }
          .lf-compose-context-label {
            color: #722F37 !important;
            font-size: 9pt !important;
          }
          .lf-compose-context-archetype {
            font-size: 16pt !important;
            color: #000 !important;
          }
          .lf-compose-context-archetype-focus {
            font-size: 11pt !important;
            color: #333 !important;
          }
          .lf-compose-cando li, .lf-compose-bridge li {
            font-size: 10pt !important;
            color: #222 !important;
          }

          /* Plan header */
          .lf-compose-plan-header {
            border-bottom: 1px solid #000 !important;
            margin-bottom: 12px !important;
            padding-bottom: 8px !important;
          }
          .lf-compose-plan-title {
            font-size: 18pt !important;
            color: #000 !important;
          }
          .lf-compose-plan-total {
            font-size: 14pt !important;
            color: #722F37 !important;
          }
          .lf-compose-plan-eyebrow {
            font-size: 8pt !important;
          }

          /* Phase cards as compact print blocks */
          .lf-compose-phase {
            background: white !important;
            border: 1px solid #999 !important;
            border-left: 3px solid #722F37 !important;
            padding: 12px 16px !important;
            margin-bottom: 8px !important;
            page-break-inside: avoid;
          }
          .lf-compose-phase.focused {
            border-left: 3px solid #722F37 !important;
            padding-left: 16px !important;
          }
          .lf-compose-phase-head {
            grid-template-columns: 50px 1fr !important;
            gap: 16px !important;
            margin-bottom: 10px !important;
            padding-bottom: 8px !important;
            border-bottom: 1px dotted #999 !important;
          }
          .lf-compose-phase-num {
            font-size: 28pt !important;
            color: #722F37 !important;
          }
          .lf-compose-phase-title {
            font-size: 13pt !important;
            color: #000 !important;
          }
          .lf-compose-phase-time {
            font-size: 9pt !important;
            background: white !important;
            border: 1px solid #722F37 !important;
            color: #722F37 !important;
            padding: 2px 8px !important;
          }
          .lf-compose-phase-icon { display: none !important; }
          .lf-compose-activities-label {
            font-size: 8pt !important;
            color: #722F37 !important;
            margin-bottom: 4px !important;
          }
          /* Hide non-selected pills; show only the chosen activity inline */
          .lf-compose-activities { display: block !important; margin-bottom: 8px !important; }
          .lf-pill { display: none !important; }
          .lf-pill.active {
            display: inline-block !important;
            background: white !important;
            color: #000 !important;
            border: none !important;
            padding: 0 !important;
            font-size: 11pt !important;
            font-style: italic !important;
          }
          .lf-pill.active::before { content: '› '; color: #722F37; }
          .lf-compose-example-block {
            background: white !important;
            border: none !important;
            border-left: 2px solid #B8924A !important;
            padding: 4px 12px !important;
            margin-bottom: 8px !important;
          }
          .lf-compose-example-label {
            color: #B8924A !important;
            font-size: 8pt !important;
            margin-bottom: 4px !important;
          }
          .lf-compose-example-text {
            font-size: 10.5pt !important;
            color: #000 !important;
            line-height: 1.45 !important;
          }
          .lf-compose-sla {
            font-size: 9pt !important;
            color: #555 !important;
          }
          .lf-compose-sla .lf-mono {
            color: #722F37 !important;
            font-size: 8pt !important;
          }

          /* Print footer */
          .lf-compose-plan::after {
            content: "Generated with the English with Pedro lesson framework.";
            display: block;
            margin-top: 16px;
            padding-top: 8px;
            border-top: 1px solid #999;
            font-family: 'Fraunces', serif;
            font-style: italic;
            font-size: 9pt;
            color: #722F37;
            text-align: center;
          }
        }
      `}</style>

      <div className="lf-grain" />

      {/* NAV */}
      <nav className="lf-nav" style={{
        background: scrolled ? 'rgba(242, 235, 221, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      }}>
        <div className="lf-nav-inner">
          <div className="lf-monogram">EwP<span>·</span>framework</div>
          <div className="lf-nav-links">
            {[
              { id: 'overview', label: '01 Overview' },
              { id: 'macro', label: '02 Macro' },
              { id: 'micro', label: '03 Micro' },
              { id: 'compose', label: '04 Compose' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`lf-nav-link ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="lf-hero">
        <div className="lf-eyebrow">A pedagogical framework · Brazilian EFL · Hybrid digital + formal</div>
        <h1>
          A lesson plan framework <em>for the streaming era</em>
        </h1>
        <p className="lf-hero-sub">
          Two interlocking layers. A <strong>macro</strong> grid of CEFR-anchored thematic units with informal-input bridges built in. A <strong>micro</strong> seven-phase lesson template grounded in SLA research from Krashen to Lyster, calibrated for Brazilian classrooms — binational centers, mass-market franchises, private tutoring, and self-study.
        </p>
        <div className="lf-hero-meta">
          <div className="lf-hero-meta-item">
            <div>Levels</div>
            <div>A1 → C2 · CEFR Companion Vol.</div>
          </div>
          <div className="lf-hero-meta-item">
            <div>Themes</div>
            <div>Six durable, spiraling domains</div>
          </div>
          <div className="lf-hero-meta-item">
            <div>Lesson template</div>
            <div>Seven phases · 60 minutes</div>
          </div>
          <div className="lf-hero-meta-item">
            <div>Context</div>
            <div>EFL Brazil · four institutional tracks</div>
          </div>
        </div>
      </header>

      {/* OVERVIEW */}
      <section id="overview" className="lf-section">
        <div className="lf-section-header">
          <div className="lf-section-num">01</div>
          <div className="lf-section-title">
            <div className="lf-section-kicker">The two layers</div>
            <h2>Macro <em>and</em> micro structures, woven together.</h2>
            <p className="lf-section-desc">
              The framework operates simultaneously at curricular scale (years of study mapped to CEFR) and at lesson scale (60 minutes of structured activity). Each layer answers a different design question. Together they make informal digital input curricular rather than residual.
            </p>
          </div>
        </div>

        <div className="lf-overview">
          <div className="lf-overview-card">
            <div className="lf-overview-tag">Macro · curricular scale</div>
            <h3>Six themes, six levels, thirty-six cells.</h3>
            <p>Each cell answers: <em>what can a learner do</em> in this domain at this level, and <em>what digital content</em> bridges classroom and life?</p>
            <ul className="lf-overview-list">
              <li><span className="lf-mono">I.</span><span>Identity &amp; Belonging</span></li>
              <li><span className="lf-mono">II.</span><span>Daily Life &amp; Routines</span></li>
              <li><span className="lf-mono">III.</span><span>Work &amp; Study</span></li>
              <li><span className="lf-mono">IV.</span><span>Travel &amp; Place</span></li>
              <li><span className="lf-mono">V.</span><span>Media &amp; Story</span></li>
              <li><span className="lf-mono">VI.</span><span>Society &amp; Ideas</span></li>
            </ul>
          </div>

          <div className="lf-overview-card micro">
            <div className="lf-overview-tag">Micro · lesson scale</div>
            <h3>Seven phases, sixty minutes, one outcome.</h3>
            <p>Each phase answers: <em>what SLA process</em> are we engineering, and <em>which activities</em> serve it well at this level?</p>
            <ul className="lf-overview-list">
              <li><span className="lf-mono">i.</span><span>Warm-up &amp; schema activation</span></li>
              <li><span className="lf-mono">ii.</span><span>Input &amp; noticing</span></li>
              <li><span className="lf-mono">iii.</span><span>Focus on form</span></li>
              <li><span className="lf-mono">iv.</span><span>Controlled practice</span></li>
              <li><span className="lf-mono">v.</span><span>Communicative task</span></li>
              <li><span className="lf-mono">vi.</span><span>Feedback &amp; reflection</span></li>
              <li><span className="lf-mono">vii.</span><span>Informal-input bridge</span></li>
            </ul>
          </div>
        </div>

        <div className="lf-ornament">❦ ❦ ❦</div>
      </section>

      {/* MACRO */}
      <section id="macro" className="lf-section">
        <div className="lf-section-header">
          <div className="lf-section-num">02</div>
          <div className="lf-section-title">
            <div className="lf-section-kicker">The macro grid</div>
            <h2>CEFR-anchored thematic units, <em>level by level.</em></h2>
            <p className="lf-section-desc">
              Pick a level, then a theme. Each cell shows the can-do outcomes and the level-calibrated digital content that bridges classroom and life.
              The themes spiral — food at A1 becomes food sustainability at B2 becomes the philosophy of food at C1.
            </p>
          </div>
        </div>

        <div className="lf-macro-controls">
          {LEVELS.map(lvl => (
            <button
              key={lvl.id}
              className={`lf-level-btn ${selectedLevel === lvl.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedLevel(lvl.id);
                setSelectedCell({ level: lvl.id, theme: selectedCell.theme });
              }}
            >
              <span className="lf-level-label">{lvl.label}</span>
              <span className="lf-level-name">{lvl.name}</span>
            </button>
          ))}
        </div>

        <div className="lf-macro-grid">
          {THEMES.map(theme => {
            const Icon = theme.icon;
            const cell = MACRO[selectedLevel]?.[theme.id];
            const isActive = selectedCell.level === selectedLevel && selectedCell.theme === theme.id;
            return (
              <button
                key={theme.id}
                className={`lf-cell ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCell({ level: selectedLevel, theme: theme.id })}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="lf-cell-num">{theme.num}</span>
                  <Icon size={20} className="lf-cell-icon" />
                </div>
                <div className="lf-cell-name">{theme.name}</div>
                <div className="lf-cell-preview">
                  {cell?.cando[0]?.slice(0, 60)}…
                </div>
              </button>
            );
          })}
        </div>

        {cellData && (
          <div className="lf-detail">
            <div className="lf-detail-header">
              <div>
                <div className="lf-detail-meta" style={{ marginBottom: 8 }}>
                  {selectedCell.level} · {LEVELS.find(l => l.id === selectedCell.level)?.name}
                </div>
                <div className="lf-detail-title">
                  {THEMES.find(t => t.id === selectedCell.theme)?.name}
                </div>
              </div>
              <div className="lf-detail-meta">
                {LEVELS.find(l => l.id === selectedCell.level)?.desc}
              </div>
            </div>

            <div className="lf-detail-body">
              <div className="lf-detail-section">
                <h4>Can-do statements</h4>
                <ul className="lf-cando-list">
                  {cellData.cando.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="lf-detail-section">
                <h4>Informal-input bridge</h4>
                <ul className="lf-bridge-list">
                  {cellData.bridge.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>

            <div className="lf-strands">
              <div className="lf-strands-label">
                Nation's four strands · per 60 hours · {LEVELS.find(l => l.id === selectedCell.level)?.hours.i + LEVELS.find(l => l.id === selectedCell.level)?.hours.o + LEVELS.find(l => l.id === selectedCell.level)?.hours.l + LEVELS.find(l => l.id === selectedCell.level)?.hours.f}h total
              </div>
              <div className="lf-strands-bar">
                {(() => {
                  const h = LEVELS.find(l => l.id === selectedCell.level)?.hours;
                  const total = h.i + h.o + h.l + h.f;
                  return (
                    <>
                      <div className="lf-strand" style={{ flex: h.i, background: '#D4B47A' }}>Input · {h.i}h</div>
                      <div className="lf-strand" style={{ flex: h.o, background: '#B8924A' }}>Output · {h.o}h</div>
                      <div className="lf-strand" style={{ flex: h.l, background: '#8E6B2E' }}>Form · {h.l}h</div>
                      <div className="lf-strand" style={{ flex: h.f, background: '#5E4720', color: 'var(--paper)' }}>Fluency · {h.f}h</div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        <div className="lf-ornament">❦ ❦ ❦</div>
      </section>

      {/* MICRO */}
      <section id="micro" className="lf-section">
        <div className="lf-section-header">
          <div className="lf-section-num">03</div>
          <div className="lf-section-title">
            <div className="lf-section-kicker">The micro template</div>
            <h2>Seven phases, <em>one lesson.</em></h2>
            <p className="lf-section-desc">
              Click any phase to see its purpose, its grounding in SLA research, and activity options. The seventh phase — the informal-input bridge — is the framework's signature move: a deliberate, curricular handoff from classroom to streaming.
            </p>
          </div>
        </div>

        <div className="lf-timeline">
          <div className="lf-timeline-track">
            {PHASES.map(phase => {
              const Icon = phase.icon;
              return (
                <button
                  key={phase.id}
                  className={`lf-phase-btn ${activePhase === phase.id ? 'active' : ''}`}
                  onClick={() => setActivePhase(phase.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="lf-phase-num">{phase.id}</span>
                    <Icon size={18} className="lf-phase-icon" />
                  </div>
                  <div>
                    <div className="lf-phase-time">{phase.time}</div>
                    <div className="lf-phase-name">{phase.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {phaseData && (
            <div className="lf-phase-detail">
              <div className="lf-phase-detail-header">
                <div className="lf-phase-detail-num">{phaseData.id < 10 ? '0' + phaseData.id : phaseData.id}</div>
                <div>
                  <div className="lf-phase-detail-title">{phaseData.name}</div>
                  <div className="lf-phase-detail-time">{phaseData.time} · Phase {phaseData.id} of 7</div>
                  <p className="lf-phase-purpose" style={{ marginTop: 16 }}>{phaseData.purpose}</p>
                  <div className="lf-phase-sla">SLA grounding · {phaseData.sla}</div>
                </div>
              </div>

              <h4 style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: 'var(--wine)',
                marginBottom: 20,
              }}>
                Activity options · {phaseData.activities.length}
              </h4>

              <div className="lf-activities">
                {phaseData.activities.map((act, i) => (
                  <div key={i} className="lf-activity">
                    <div className="lf-activity-name">{act.name}</div>
                    <div className="lf-activity-meta">
                      <span className="lf-activity-best">{act.best}</span>
                      <span>{act.sla}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lf-ornament">❦ ❦ ❦</div>
      </section>

      {/* COMPOSE A LESSON */}
      <section id="compose" className="lf-section lf-compose">
        <div className="lf-section-header">
          <div className="lf-section-num">04</div>
          <div className="lf-section-title">
            <div className="lf-section-kicker">Compose a lesson</div>
            <h2>Build a real lesson <em>from your choices.</em></h2>
            <p className="lf-section-desc">
              Combine level, theme, lesson number, and per-phase activities into a printable lesson plan.
              Each phase ships with a concrete prompt from the library — click the pencil to edit, or accept it as-is.
              Export as PDF (via your browser's print dialog) or copy as Markdown.
            </p>
          </div>
        </div>

        {/* SELECTORS */}
        <div className="lf-compose-selectors">
          <div className="lf-compose-selector">
            <div className="lf-compose-selector-label">Level</div>
            <select
              className="lf-compose-select"
              value={composeLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setSelectedCell({ level: e.target.value, theme: composeTheme });
              }}
            >
              {LEVELS.map(l => <option key={l.id} value={l.id}>{l.label} · {l.name}</option>)}
            </select>
          </div>

          <div className="lf-compose-selector">
            <div className="lf-compose-selector-label">Theme · Unit</div>
            <select
              className="lf-compose-select"
              value={composeTheme}
              onChange={(e) => setSelectedCell({ level: composeLevel, theme: e.target.value })}
            >
              {THEMES.map(t => <option key={t.id} value={t.id}>{t.num}. {t.name}</option>)}
            </select>
          </div>

          <div className="lf-compose-selector">
            <div className="lf-compose-selector-label">Lesson · Archetype</div>
            <select
              className="lf-compose-select"
              value={composeLesson}
              onChange={(e) => setComposeLesson(Number(e.target.value))}
            >
              {ARCHETYPES.map(a => (
                <option key={a.id} value={a.id}>{a.id}. {a.name}</option>
              ))}
            </select>
          </div>

          <div className="lf-compose-actions">
            <button className="lf-btn lf-btn-ghost" onClick={resetAll} title="Reset to worked example">
              <RotateCcw size={14} /> Reset
            </button>
            <button className="lf-btn lf-btn-secondary" onClick={handleCopyMarkdown}>
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy as Markdown</>}
            </button>
            <button className="lf-btn lf-btn-primary" onClick={handlePrint}>
              <Printer size={14} /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* CONTEXT STRIP */}
        <div className="lf-compose-context">
          <div className="lf-compose-context-col">
            <div className="lf-compose-context-label">Lesson · {composeLesson} of 8</div>
            <div className="lf-compose-context-archetype">{composeArchetype.name}</div>
            <div className="lf-compose-context-archetype-focus">{composeArchetype.focus}</div>
          </div>
          <div className="lf-compose-context-col">
            <div className="lf-compose-context-label">Can-do outcomes · {composeLevel}</div>
            <ul className="lf-compose-cando">
              {composeCell?.cando.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
          <div className="lf-compose-context-col">
            <div className="lf-compose-context-label">Informal-input bridge</div>
            <ul className="lf-compose-bridge">
              {composeCell?.bridge.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        </div>

        {/* LESSON PLAN */}
        <div className="lf-compose-plan">
          <div className="lf-compose-plan-header">
            <div>
              <div className="lf-compose-plan-eyebrow">The lesson · 60 min · {composeLevel} {composeThemeData.name}</div>
              <h3 className="lf-compose-plan-title">Lesson {composeLesson} — {composeArchetype.name}</h3>
            </div>
            <div className="lf-compose-plan-total">
              {composeArchetype.times.reduce((a, b) => a + b, 0)} min
            </div>
          </div>

          {PHASES.map((phase, idx) => {
            const Icon = phase.icon;
            const time = composeArchetype.times[idx];
            const actIdx = getActivityIdx(phase.id);
            const activity = phase.activities[actIdx];
            const isEditing = editingPhase === phase.id;
            const isCustom = composeCustom[phase.id] !== undefined;
            const isFocused = activePhase === phase.id;
            const example = getExample(phase.id);

            return (
              <div
                key={phase.id}
                className={`lf-compose-phase ${isFocused ? 'focused' : ''}`}
                onClick={() => !isEditing && setActivePhase(phase.id)}
              >
                <div className="lf-compose-phase-head">
                  <div className="lf-compose-phase-num">
                    <span>{phase.id < 10 ? `0${phase.id}` : phase.id}</span>
                  </div>
                  <div className="lf-compose-phase-meta">
                    <div className="lf-compose-phase-title-row">
                      <Icon size={18} className="lf-compose-phase-icon" />
                      <div className="lf-compose-phase-title">{phase.name}</div>
                    </div>
                    <div className="lf-compose-phase-time">{time} min</div>
                  </div>
                </div>

                <div className="lf-compose-phase-body">
                  <div className="lf-compose-activities-label">Activity type</div>
                  <div className="lf-compose-activities">
                    {phase.activities.map((act, i) => (
                      <button
                        key={i}
                        className={`lf-pill ${actIdx === i ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivity(phase.id, i);
                        }}
                      >
                        {act.name}
                      </button>
                    ))}
                  </div>

                  <div className="lf-compose-example-block">
                    <div className="lf-compose-example-label">
                      <span>Concrete prompt {isCustom && <em className="lf-mono lf-custom-tag">· custom</em>}</span>
                      {!isEditing ? (
                        <div className="lf-compose-example-actions">
                          {isCustom && (
                            <button
                              className="lf-icon-btn"
                              onClick={(e) => { e.stopPropagation(); resetExample(phase.id); }}
                              title="Reset to library default"
                            >
                              <RotateCcw size={13} />
                            </button>
                          )}
                          <button
                            className="lf-icon-btn lf-phase-edit-btn"
                            onClick={(e) => { e.stopPropagation(); startEdit(phase.id); }}
                            title="Edit prompt"
                          >
                            <Pencil size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="lf-compose-example-actions">
                          <button
                            className="lf-icon-btn"
                            onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                            title="Cancel"
                          >
                            ✕
                          </button>
                          <button
                            className="lf-icon-btn lf-icon-btn-primary"
                            onClick={(e) => { e.stopPropagation(); saveEdit(phase.id); }}
                            title="Save"
                          >
                            <Check size={13} />
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <textarea
                        className="lf-compose-example-edit"
                        value={draftText}
                        onChange={(e) => setDraftText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        rows={4}
                      />
                    ) : (
                      <div className="lf-compose-example-text">{example}</div>
                    )}
                  </div>

                  <div className="lf-compose-sla">
                    <span className="lf-mono">SLA grounding ·</span> {activity.sla}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="lf-principles">
        <div className="lf-principles-inner">
          <div className="lf-principles-tag">Three closing commitments</div>
          <h2>The framework holds <em>only if</em> these three things hold.</h2>

          <div className="lf-principles-list">
            <div className="lf-principle">
              <h4>Informal input is curricular, not residual.</h4>
              <p>A lesson that ends without an informal-input bridge has not closed the loop the framework argues for. Phase 7 is non-optional.</p>
            </div>
            <div className="lf-principle">
              <h4>L1 is a tool, not a contaminant.</h4>
              <p>Strategic Portuguese in Phases 3 and 6 supports rather than undermines L2 acquisition. Translanguaging is permission, not problem.</p>
            </div>
            <div className="lf-principle">
              <h4>Variability is the norm.</h4>
              <p>Complex Dynamic Systems Theory means learners will not progress linearly through the macro grid. The framework is a spiral, not a staircase.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lf-footer">
        <span className="lf-footer-mono">English with Pedro</span>
        <div>A framework · For Brazilian EFL · Adult learners · Digital + Formal</div>
        <div className="lf-footer-line">Grounded in Krashen · Long · Swain · Vygotsky · Lantolf · Norton · Dörnyei · Schmidt · Lyster · Ellis · Nation · García &amp; Wei · Larsen-Freeman · Paiva</div>
      </footer>
    </div>
  );
}
