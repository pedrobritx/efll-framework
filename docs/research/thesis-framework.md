# SLA/ESL Research, Thesis Framework & Lesson Framework Project

> **Purpose**: This document is a handoff export of a multi-turn working session covering Second Language Acquisition research, a Master’s-level thesis framework for the Brazilian EFL context, a pedagogical lesson plan framework, and an interactive website implementing both layers. It is designed to let the user (or another AI assistant) continue the work in a new conversation without losing context.
> 

---

## 1. Project Overview & Working Context

### Project arc

The session began as a literature review of foundational and recent SLA/ESL research, then evolved into a thesis framework for a Master’s-level research project on Brazilian EFL learners, then operationalized that thesis into a teachable lesson plan framework, and finally implemented the lesson framework as an interactive React website.

### User preferences applied throughout

- **Language**: English (matches user’s input)
- **Detail level**: Intermediate technical, comprehensive coverage when scope warrants
- **Format**: Full markdown by default — headers, bullets, tables; code blocks with explanation above and below
- **Tone**: Constructive, willing to push back; ESL/Dev/Translation work held to strictest quality bar
- **Neurodivergent teaching profile**: chunked content, concrete examples before abstract theory, visual/structured formats, analogies tied to user’s existing knowledge domains

### Anchoring scholarship

The session repeatedly grounds claims in named scholars. Anglophone SLA: Krashen, Long, Swain, Vygotsky/Lantolf, Norton, Dörnyei, Schmidt, Lyster, Ellis, Nation, García & Wei, Larsen-Freeman. Brazilian applied linguistics (flagged as critical for thesis-bench credibility): Almeida Filho, Leffa, Paiva, Schlatter, Cox & Assis-Peterson, Rajagopalan, Moita Lopes, Celani.

---

## 2. Part I — SLA/ESL Research Compendium (Summary)

A full annotated reference document is in `sla-esl-research-reference.md`. The structure is theme-organized; each entry includes citation, core argument, why it’s influential, and practical implication for teachers/learners.

### Themes covered

1. **Input Hypothesis & Comprehension-Based Approaches** — Krashen (1982, 2004); Nguyen & Doan (2025) critique
2. **Interaction Hypothesis & Negotiation of Meaning** — Long (1996); Mackey & Goo (2007) meta-analysis
3. **Output Hypothesis** — Swain (1985, 2005)
4. **Sociocultural Theory & Mediated Learning** — Vygotsky (1978); Aljaafreh & Lantolf (1994); Lantolf & Thorne (2006)
5. **Identity, Investment & Motivation** — Norton (1995); Darvin & Norton (2015); Dörnyei (2005); Al-Hoorie (2018) meta-analysis
6. **Noticing & Attention** — Schmidt (1990)
7. **Corrective Feedback** — Lyster & Ranta (1997); Li (2010) meta-analysis; Sheen (2007)
8. **Implicit vs. Explicit Knowledge & Instructed SLA** — Ellis (2005); Norris & Ortega (2000); Spada & Tomita (2010) meta-analyses
9. **Vocabulary Acquisition** — Nation (2022); Schmitt (2008)
10. **Translanguaging & the Multilingual Turn** — García & Wei (2014); May (2014)
11. **Complex Dynamic Systems Theory** — Larsen-Freeman (1997, 2008)
12. **Task-Based Language Teaching** — Ellis (2003); Bryfonski & McKay (2019); Boers & Faez (2023) critical re-examination

### Acknowledged biases & gaps

- Anglophone/cognitivist tilt; underrepresented strands include conversation analysis for SLA, L2 pragmatics, and Brazilian applied linguistics
- Citation counts ≠ truth (high citation can mean a paper is argued against)
- Modest replication record in SLA
- Meta-analyses inherit primary-study quality issues

---

## 3. Part II — Thesis Framework Analysis: Brazilian Context

### Two foundational moves the report didn’t make explicit

**Move 1: Brazil is EFL, not ESL.** The standard literature conflates ESL/SLA but for Brazilian thesis work this is a liability. There is no critical mass of target-language community contact outside the classroom. This reshapes which theories are most generative:

| Theory | ESL (e.g., Norton’s Canada) | EFL (Brazil) |
| --- | --- | --- |
| Interaction Hypothesis | High ecological validity | Engineered, not naturalistic |
| Investment (Norton) | Power relations with target community | Mostly *imagined* community |
| L2 Motivational Self System | Concrete possible selves | Heavily media-mediated possible selves |
| Translanguaging | Resists monolingual host society | Resists English-only classroom ideology |
| Comprehensible input | Available in environment | Must be engineered (digital + classroom) |

Bryfonski & McKay (2019) found TBLT had *larger* effects in EFL than ESL — EFL needs its own theoretical accounting.

**Move 2: The Anglophone literature lacks Brazilian voices.** A Brazilian thesis must integrate: Almeida Filho (abordagem comunicativa, OGEL), Leffa (CALL, language teacher education), Paiva (CDST applied to Brazilian learners — the canonical Brazilian localization of Larsen-Freeman), Schlatter (language assessment, CELPE-Bras), Cox & Assis-Peterson (decolonial English in Brazil), Rajagopalan (English as a global language, post-colonial critique).

### Three nested layers for thesis design

```
┌─────────────────────────────────────────────────────────┐
│  MACRO: Sociopolitical context                          │
│  English as cultural capital; public/private divide;    │
│  decolonial critique; ELF vs. native-speaker norms      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  MESO: Pedagogical context                        │  │
│  │  Curriculum (BNCC), teacher education, materials, │  │
│  │  institutional constraints, CEFR alignment        │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  MICRO: Learner-level processes             │  │  │
│  │  │  Input, interaction, output, attention,     │  │  │
│  │  │  identity construction, motivation,         │  │  │
│  │  │  feedback uptake                            │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

A strong Brazilian thesis picks **one layer as primary** and lets the others contextualize.

### Four candidate thesis directions considered

- **A — Identity & Investment in Adult Brazilian Learners** (Norton + Dörnyei, qualitative case study)
- **B — Translanguaging in Brazilian English Classrooms** (García & Wei + Lantolf, mixed methods classroom observation)
- **C — Informal Digital Input + Formal Instruction (Hybrid SLA)** (Krashen, Schmidt, Nation, CDST, mixed methods longitudinal) **← SELECTED**
- **D — Corrective Feedback in Brazilian Adult ESL Contexts** (Lyster & Ranta + Aljaafreh & Lantolf, quasi-experimental)

---

## 4. Part III — Direction C Thesis Framework (Selected Direction)

### Working title

**“I Learned English from Netflix”: The Interaction of Informal Digital Exposure and Formal Instruction in Adult Brazilian EFL Acquisition**

Academic alternative: *Bridging Streaming and Schooling: A Mixed-Methods Investigation of Informal Digital Input, Formal Instruction, and Proficiency Trajectories in the Brazilian EFL Ecosystem.*

### The Brazilian EFL Ecosystem — Four Tracks

| Track | Institution type | Typical access | Typical outcome | Informal input role |
| --- | --- | --- | --- | --- |
| **Public basic education** | Escolas públicas (BNCC-mandated) | Universal but minimal hours, often unprepared teachers | A1–A2 ceiling for most | Primary or only source of meaningful exposure |
| **Private basic education** | Colégios particulares with English streams | Middle/upper-middle class | A2–B1 | Major supplement, status-aligned |
| **Binational centers & elite franchises** | Casa Thomas Jefferson (Brasília), Cultura Inglesa, Associação Alumni, IBEU | Middle/upper-middle class | B2–C2 achievable | Strongly encouraged, integrated curricularly |
| **Mass-market franchises** | Wizard, CCAA, Fisk, Yázigi, Wise Up, Skill | Broader access | A2–B2, highly variable | Sometimes encouraged, often substituted by method-loyalty |
| **Private tutoring / independent teachers** | EwP-style boutique services, online platforms | Variable by price point | Highly variable | Heavily integrated, often the differentiator |

A thesis that doesn’t account for **track** as a variable will produce noisy data attributable to track rather than to informal input.

### Theoretical framework — three tiers

**Meta-theory: Complex Dynamic Systems Theory (CDST)**
- Larsen-Freeman (1997, 2008); de Bot, Lowie & Verspoor (2007)
- **Paiva** for Brazilian localization (cite prominently)
- Why: accommodates non-linear trajectories, multiple interacting subsystems, individual variability as data

**Lens 1: Nation’s Four Strands** (Input / Output / Language-focused / Fluency)
- Operational framework for categorizing formal AND informal input
- Testable hypothesis: Brazilian formal instruction is heavy on strand 3, light on strands 1–2; informal digital input does the heavy lifting on strand 1 for learners past B1

**Lens 2: Identity, Investment & Motivation**
- Norton (1995); Darvin & Norton (2015) — investment, imagined communities
- Dörnyei (2005); Al-Hoorie (2018) — L2 Motivational Self System
- Brazilian addition: Rajagopalan, Cox & Assis-Peterson on English as cultural capital in Brazil

### Research questions

**Primary RQ**: How do sustained informal digital English exposure and formal classroom instruction interact in shaping the proficiency trajectories and L2 identities of adult Brazilian EFL learners across different institutional contexts?

**Sub-RQ 1 (Quantitative)**: What is the relationship between self-reported informal digital English exposure (type, frequency, duration, engagement) and measurable proficiency gains over 6–12 months, controlling for formal-instruction track and baseline proficiency?

**Sub-RQ 2 (Qualitative)**: How do adult Brazilian learners narrate the role of informal digital exposure in their language development, and how do these narratives reflect their L2 identity construction and investment?

**Sub-RQ 3 (Mixed/Contextual)**: How do different tiers of Brazilian formal-instruction contexts position informal digital input — as resource, distraction, or substitute — in their pedagogical discourse?

### Methodology — sequential explanatory mixed-methods (QUAN → QUAL)

```
PHASE 1: Quantitative (months 1–9)
  ├─ Recruitment & baseline (n ≈ 30–40)
  ├─ Pre-test proficiency battery
  ├─ Informal exposure tracking (6 months)
  └─ Post-test proficiency battery

PHASE 2: Qualitative (months 9–14)
  ├─ Case selection (4–6 from quan sample, max-variation)
  ├─ Semi-structured interviews (×2 per case)
  ├─ Language portrait elicitation
  └─ Artifact analysis (actual digital consumption)

PHASE 3: Synthesis (months 14–18)
  ├─ Joint display analysis
  ├─ Triangulation
  └─ Theoretical integration
```

**Participants**: 30–40 quantitative; 4–6 qualitative cases. Adults (18–45), B1+ baseline. Quota-sampled across four tracks (binational, franchise, tutoring, autodidact).

**Quantitative measures**:
- Proficiency battery: LexTALE (Lemhöfer & Broersma, 2012), Elicited Imitation Test (Wu & Ortega, 2013), C-test or Cambridge Linguaskill, productive writing task, aural comprehension
- Informal exposure log: weekly self-report (streaming, gaming, social media, music, podcasts, reading, interaction, AI chatbots) + engagement subscale
- Formal instruction log: monthly check-in

**Qualitative methods**:
- Semi-structured interviews (Portuguese, learner’s choice)
- Language portrait (Busch, 2018)
- Artifact analysis (Netflix watch history, YouTube subscriptions, social media follows, gaming chat logs) — with LGPD compliance

**Analysis**:
- Quantitative: multiple regression with proficiency gain as DV; CDST-faithful individual time-series for case-study sub-sample; Bayesian alternative if power borderline
- Qualitative: thematic analysis (Braun & Clarke, 2006); cross-case synthesis
- Mixed: joint displays per case

**Ethics**: CEP/CONEP submission; informed consent; LGPD compliance for digital artifacts.

### Chapter structure (Master’s scale, ~190–250 pages)

| # | Chapter | ~Pages | Core content |
| --- | --- | --- | --- |
| 1 | Introduction | 10–15 | Motivation, problem, RQs, structure |
| 2 | Brazilian EFL Ecosystem | 20–25 | Four-track system, BNCC, history (Almeida Filho, Rajagopalan) |
| 3 | Theoretical Framework | 25–30 | CDST + Nation + Norton/Dörnyei + Brazilian scholarship (Paiva, Leffa) |
| 4 | Methodology | 20–25 | Mixed-methods rationale, instruments, ethics |
| 5 | Quantitative Findings | 25–30 | Sub-RQ 1; regression, trajectories |
| 6 | Qualitative Case Studies | 30–40 | Sub-RQ 2; 4–6 cases, portraits, artifact triangulation |
| 7 | Cross-Tier Discourse Analysis | 15–20 | Sub-RQ 3; how each track positions informal input |
| 8 | Discussion & Integration | 20–25 | Theoretical contribution, pedagogical implications |
| 9 | Conclusion | 5–10 | Future research, EwP-type practice implications |
| — | References, appendices | 20–30 | Instruments, codebooks, ethical documents |

### Brazilian scholarship anchors (must appear)

- **English in Brazil / sociopolitical**: Rajagopalan, Cox & Assis-Peterson, Moita Lopes
- **Applied linguistics / pedagogy**: Almeida Filho, Leffa, Celani
- **CDST in Brazilian SLA**: Paiva (foundational), Silva e Silva
- **Language assessment**: Schlatter, Scaramucci
- **Digital/CALL in Brazil**: Leffa, Paiva (digital narratives)
- **Teacher education**: Vieira-Abrahão, Gimenez
- **Critical/decolonial English**: Pennycook (paired with Brazilian critics)
- Local journals to cite: **RBLA** (Revista Brasileira de Linguística Aplicada), **TLA** (Trabalhos em Linguística Aplicada)

### Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Self-report on informal exposure is inaccurate | Triangulate with artifact analysis on case-study subsample; weekly (not retrospective monthly) reporting |
| 12-month attrition | Over-recruit by 30–40%; light-touch monthly check-ins |
| Causal claims limited (no randomization) | Frame as descriptive/exploratory; CDST already de-emphasizes simple causality |
| “Netflix” as moving target | Document platform context as 2026–27 snapshot |
| Ethics review delays | Submit CEP package early; pilot instruments meanwhile |
| Banca pushback on CDST as “non-falsifiable” | Pair with rigorous quantitative analysis |

---

## 5. Part IV — Lesson Plan Framework: Macro Structure

### Design principles

1. **Can-do anchored**: each unit targets specific CEFR descriptors as observable outcomes
2. **Spiral, not linear**: themes recur across levels with deepening complexity
3. **Informal-input bridge in every unit**: digital content is curricular, not extracurricular
4. **Translanguaging-permissive**: L1 Portuguese as a resource in lower levels for metalinguistic work
5. **Productive + receptive balance**: each unit distributes hours across Nation’s four strands

### The six durable themes (spiral across all CEFR levels)

1. **Identity & Belonging** (self, family, communities)
2. **Daily Life & Routines** (food, home, time, transportation)
3. **Work & Study** (school, career, professional identity)
4. **Travel & Place** (geography, mobility, intercultural encounters)
5. **Media & Story** (entertainment, narrative, digital culture)
6. **Society & Ideas** (politics, environment, ethics, abstract argument)

### The macro grid: full content by CEFR level

#### A1 — Breakthrough

Hours per 60h block: Input 18 · Output 12 · Form 18 · Fluency 12

| # | Theme | “I can…” statements | Informal-input bridge |
| --- | --- | --- | --- |
| 1 | Identity & Belonging | introduce myself with name, age, nationality, family / say where I live and what I do / ask and answer basic personal questions | Peppa Pig, Bluey; simple Instagram captions |
| 2 | Daily Life & Routines | name common foods, drinks, daily activities / tell time and days / order in a restaurant | TikTok cooking shorts with captions; Sesame Street |
| 3 | Work & Study | say what I do for work or study / name school subjects, basic job titles / fill in a simple form | LinkedIn profile headlines; BBC Learning English Lower Beginner |
| 4 | Travel & Place | name countries, cities, basic directions / understand simple signs / book a room or ticket | Travel vlog intros; Google Maps in English; airline announcements |
| 5 | Media & Story | name film genres, hobbies, music styles / express simple likes/dislikes / understand song titles | Pop songs with lyric videos (Taylor Swift, Coldplay); Spotify in English |
| 6 | Society & Ideas | name weather, seasons, colors, basic emotions / understand very simple news headlines | Weather forecasts; Newsy headlines; emoji-rich social posts |

#### A2 — Waystage

Hours per 60h: Input 18 · Output 15 · Form 15 · Fluency 12

| # | Theme | “I can…” | Informal-input bridge |
| --- | --- | --- | --- |
| 1 | Identity & Belonging | describe family/friends/daily life / talk about past with simple past / express feelings & reasons | Family/lifestyle vlogs; Instagram Reels with captions |
| 2 | Daily Life & Routines | describe home, neighborhood, weekly routine / make plans / handle everyday shopping | Cooking with Babish Basics; Trader Joe’s hauls; subtitled restaurant reviews |
| 3 | Work & Study | describe job/studies day-to-day / past & future plans / write short emails | LinkedIn day-in-the-life posts; simple business English podcasts |
| 4 | Travel & Place | describe a trip taken / book travel, ask directions / compare two places | Rick Steves’ Europe; budget travel YouTube; airline safety videos |
| 5 | Media & Story | retell plot of film/series simply / describe characters & opinions / understand YA series with subtitles | Stranger Things S1; Avatar: The Last Airbender; simplified Disney+ |
| 6 | Society & Ideas | describe basic news / simple opinions on familiar issues / short weather/local news | BBC Learning English 6 Minute English; Vox Shorts |

#### B1 — Threshold (the inflection point for the thesis)

Hours per 60h: Input 18 · Output 18 · Form 12 · Fluency 12

> B1 is where most Brazilian learners plateau in formal instruction and where informal digital input becomes the dominant predictor of further progress.
> 

| # | Theme | “I can…” | Informal-input bridge |
| --- | --- | --- | --- |
| 1 | Identity & Belonging | narrate experiences, dreams, ambitions / discuss values and beliefs / give brief reasons for opinions | Casey Neistat-style vlogs; TED-Ed animated shorts |
| 2 | Daily Life & Routines | manage most travel/living-abroad situations / discuss lifestyle choices (diet, exercise, sustainability) | Bon Appétit test kitchen; The Minimalists podcast |
| 3 | Work & Study | participate in meetings on familiar topics / write structured emails/cover letters/reports / describe career trajectory | HBR short videos; Indeed Career Guide; LinkedIn Learning |
| 4 | Travel & Place | handle complex travel situations / describe places with cultural and historical context | Lonely Planet; Anthony Bourdain Parts Unknown; travel podcasts |
| 5 | Media & Story | follow most mainstream TV with subtitles / discuss plots, themes, characters / write a short review | Friends, The Office, Brooklyn Nine-Nine; The Watch podcast; Letterboxd |
| 6 | Society & Ideas | follow main points of news on familiar topics / express and justify opinions in informal discussion | Vox; Johnny Harris; Last Week Tonight; The Daily podcast |

#### B2 — Vantage

Hours per 60h: Input 18 · Output 18 · Form 10 · Fluency 14

| # | Theme | “I can…” | Informal-input bridge |
| --- | --- | --- | --- |
| 1 | Identity & Belonging | discuss personal values/identity/life choices with nuance / extended conversation without strain | Modern Love podcast; The Moth storytelling |
| 2 | Daily Life & Routines | discuss complex lifestyle topics with domain-specific vocabulary | Huberman Lab; The Financial Diet; Pick Up Limes |
| 3 | Work & Study | run a meeting, give structured presentations / handle workplace negotiation / write detailed professional documents | HBR IdeaCast; Lex Fridman; Y Combinator talks |
| 4 | Travel & Place | discuss intercultural experiences with depth / understand idiomatic regional varieties | Nomadic Matt; cultural documentaries; Atlas Obscura |
| 5 | Media & Story | follow most films/series without subtitles / discuss themes, cinematography, narrative structure | Succession, The Bear, Severance (no subs); Every Frame a Painting |
| 6 | Society & Ideas | follow TV news/current affairs / argue on abstract topics / understand editorial content | The Economist audio; Planet Money; Hidden Brain; NYT |

#### C1 — Effective Operational Proficiency

Hours per 60h: Input 20 · Output 18 · Form 8 · Fluency 14

| # | Theme | “I can…” | Informal-input bridge |
| --- | --- | --- | --- |
| 1 | Identity & Belonging | discuss identity/culture/ideology with subtlety and precision / use idiom and register flexibly | The Ezra Klein Show; literary podcasts; Substack essays |
| 2 | Daily Life & Routines | engage with specialized lifestyle content (philosophy of food, slow living, neurodivergence discourse) | Conversations with Tyler; On Being; specialist YouTube essayists |
| 3 | Work & Study | function at near-native level in professional/academic contexts / write for publication | Academic journal podcasts; conference recordings; Hacker News threads |
| 4 | Travel & Place | engage with literary travel writing, cultural criticism, geopolitics | Foreign Affairs; Solnit, Theroux; Guardian Long Read |
| 5 | Media & Story | analyze film/literature/TV with critical and theoretical vocabulary | Academic film criticism; Backlisted podcast; essay films |
| 6 | Society & Ideas | follow complex argument across registers / engage with academic/policy discourse | The Atlantic; London Review of Books; Tim Ferriss long-form; academic Twitter |

#### C2 — Mastery

Hours per 60h: Input 22 · Output 20 · Form 4 · Fluency 14

At C2 the distinction between “input for learning” and “input for living” dissolves. Any English-language content for educated native audiences is appropriate. Pedagogical work is refinement, register, and rare lexis.

---

## 6. Part V — Lesson Plan Framework: Micro Structure

### Theoretical grounding (per phase)

- **Phase 1 (Warm-up)** → Krashen (affective filter), schema theory
- **Phase 2 (Input)** → Krashen (comprehensible input) + Schmidt (noticing)
- **Phase 3 (Focus on Form)** → Ellis (explicit instruction), Lantolf (concept-based)
- **Phase 4 (Controlled Practice)** → Swain (hypothesis testing), DeKeyser (automatization)
- **Phase 5 (Communicative Task)** → Ellis (TBLT), Long (interaction)
- **Phase 6 (Feedback & Reflection)** → Lyster & Ranta, Aljaafreh & Lantolf (ZPD-calibrated)
- **Phase 7 (Informal-Input Bridge)** → Schmidt + Nation (strand 1) + Norton (investment) — the thesis-aligned signature move

### The 7-phase template (60-minute lesson)

```
1. Warm-up & Schema Activation        5–8 min
2. Input & Noticing                   10–12 min
3. Focus on Form                      8–10 min
4. Controlled Practice                8–10 min
5. Communicative Task                 12–15 min
6. Feedback & Reflection              5–7 min
7. Informal-Input Bridge              3–5 min
```

### Phase 1 — Warm-up & Schema Activation

**Purpose**: Lower affective filter; activate prior knowledge and target-language schema; transition from L1-dominant cognition.

| Activity | Best for | SLA grounding |
| --- | --- | --- |
| Personal question rotation | All levels | Krashen — low-anxiety input |
| Vocabulary brainstorm on board | A1–B1 | Nation — lexical activation |
| “Two truths and a lie” (level-adapted) | A2+ | Norton — identity work |
| Image/meme prompt | A2+ | Schema activation |
| 30-second free recall of last lesson | All | Spaced retrieval (Schmitt) |
| Quick poll on unit theme | All | Engagement (Schmitt) |
| “What did you notice in [recommended content]?” | B1+ | Schmidt’s noticing + bridge |

### Phase 2 — Input & Noticing

**Purpose**: Provide comprehensible input at i+1; engineer noticing of target features.

| Activity | Best for | SLA grounding |
| --- | --- | --- |
| Authentic video clip (3–5 min, strategic pausing) | A2+ | Krashen — comprehensible input |
| Reading text with input enhancement (bolded targets) | A2+ | Schmidt — typographic noticing |
| Listening jigsaw (different segments per learner) | B1+ | Long — interaction + input |
| Story-based input (TPRS-style narrative) | A1–B1 | Krashen — story listening |
| Podcast snippet with transcript | B1+ | Multimodal input |
| Teacher narrative with target structures recycled | All | Krashen — modified input |
| Dictogloss (listen, reconstruct in pairs) | B1+ | Swain — noticing + output |

### Phase 3 — Focus on Form

**Purpose**: Language-focused learning; explicit attention to a target feature noticed in Phase 2.

| Activity | Best for | SLA grounding |
| --- | --- | --- |
| Inductive rule discovery | A2+ | Ellis — explicit instruction |
| Direct mini-lesson with examples | A1, complex forms | Norris & Ortega — explicit is fine |
| Concept-based instruction | B1+ | Lantolf — SCT |
| Contrastive analysis with L1 (translanguaging) | All | García & Wei — L1 as resource |
| Error correction collective (anonymized errors) | B1+ | Lyster & Ranta — prompts |
| Metalinguistic discussion in L1 or L2 | All | Swain — metatalk |

**Note**: Strategic L1 use is most defensible at this phase. Resist franchise-style “English only” purism.

### Phase 4 — Controlled Practice

**Purpose**: Safe hypothesis testing; build accuracy and fluency.

| Activity | Best for | SLA grounding |
| --- | --- | --- |
| Gap-fill / sentence transformation | A1–B1 | Form-focused practice |
| Sentence-builder dominoes | A1–B1 | Engagement (Schmitt) |
| Drill chains (chained questions) | A1–A2 | Automatization (DeKeyser) |
| Mingle activity (find someone who…) | A2+ | Output + interaction |
| Information gap (two-way) | A2+ | Long — negotiation of meaning |
| Picture description with target structure | A2+ | Pushed output (Swain) |
| Sentence transformation against time | B1+ | Fluency development |

### Phase 5 — Communicative Task

**Purpose**: Genuine task with non-linguistic outcome; learners use language as a means to an end.

| Activity | Best for | SLA grounding |
| --- | --- | --- |
| Decision-making task (rank, choose, plan) | A2+ | Ellis — task with outcome |
| Problem-solving task | B1+ | TBLT |
| Role-play with non-linguistic goal | B1+ | Ellis — real-world task |
| Opinion gap with required consensus | B1+ | Long — interaction |
| Project micro-task | B1+ | TBLT — extended task |
| Mini-presentation with Q&A | B1+ | Output + interaction |
| Debate (structured) | B2+ | Argumentation, register |
| Collaborative writing (Google Docs live) | B1+ | Swain — collaborative dialogue |
| Storytelling with prompts | A2+ | Narrative output |

### Phase 6 — Feedback & Reflection

**Purpose**: Graduated corrective feedback; metacognitive reflection.

| Activity | Best for | SLA grounding |
| --- | --- | --- |
| Reformulation gallery (anonymized errors corrected) | A2+ | Lyster & Ranta — prompts |
| Self-correction with recorded output | B1+ | Swain — noticing gaps |
| Peer feedback with rubric | B1+ | Sociocultural — peer mediation |
| Graduated CF in real time | All | Aljaafreh & Lantolf — ZPD |
| Exit ticket | All | Metacognition |
| Recast log (weekly tracking) | All | Lyster & Ranta — longitudinal |

**Feedback principle**: Start with the most implicit prompt the learner can use; escalate only as needed.

### Phase 7 — Informal-Input Bridge

**Purpose**: Curricular handoff to informal digital input — the framework’s signature move.

| Activity | Best for | SLA grounding |
| --- | --- | --- |
| “This week, watch/listen/read X” with noticing task | All | Schmidt + Nation strand 1 |
| Vocabulary scavenger hunt in recommended content | A2+ | Schmitt — engagement |
| Series club (one episode/week, in-class discussion) | B1+ | Extensive viewing (Krashen) |
| Podcast journal (short reflection) | B2+ | Strand 1 + strand 2 |
| Lyric analysis assignment | A2+ | Affective + lexical |
| “Find an example of [target form] in real content” | B1+ | Noticing in the wild |
| Recommend-back (learner suggests content to teacher) | B1+ | Norton — investment, agency |

**Principle**: Recommendations must be *specific* (named show, episode, channel), *accessible* (free or already-owned platforms), and *level-calibrated*.

---

## 7. Part VI — Lesson Archetypes (Lesson 1–8 Within a Unit)

Each unit consists of 8 lessons. Each lesson plays a different role, shifting the time allocation across the 7 phases. All archetypes sum to 60 minutes.

| # | Archetype | Focus | Phase times (P1–P7) |
| --- | --- | --- | --- |
| 1 | **Introduction & Diagnostic** | Surface prior knowledge, set unit goals, pre-test informally | 10 / 15 / 5 / 8 / 10 / 7 / 5 |
| 2 | **Input Saturation** | Maximize comprehensible input on the theme | 5 / 18 / 8 / 10 / 10 / 5 / 4 |
| 3 | **First Form Focus** | Introduce primary grammatical target of the unit | 6 / 10 / 14 / 12 / 10 / 5 / 3 |
| 4 | **Midpoint Consolidation** | Recycle and integrate input and form | 6 / 10 / 10 / 10 / 14 / 6 / 4 |
| 5 | **Productive Stretch** | Push output and accuracy under communicative pressure | 5 / 8 / 8 / 12 / 18 / 6 / 3 |
| 6 | **Second Form Focus** | Introduce secondary form or expand the first | 6 / 10 / 12 / 10 / 14 / 5 / 3 |
| 7 | **Performance Rehearsal** | Prepare for the unit final task | 5 / 8 / 6 / 10 / 20 / 7 / 4 |
| 8 | **Unit Task & Reflection** | Deliver assessable performance and self-assess | 5 / 5 / 4 / 8 / 25 / 10 / 3 |

---

## 8. Part VII — Worked Example

**Lesson 3 of Unit V (Media & Story), B1, archetype “First Form Focus”**

**Working title**: “I Learned English from Netflix” — narrating series plots with past simple and past continuous

**Can-do focus**: I can discuss film/series plots, themes, and characters · I can write a short review

**Lesson objective**: By the end of the lesson, learners will be able to describe a series plot and one character using past simple, past continuous, and 6 target adjectives.

**Recommended content**: *The Good Place* (Netflix) — accessible humor, philosophy themes, clear pronunciation, full English subtitles available.

| Phase | Time | Activity |
| --- | --- | --- |
| 1. Warm-up | 6 min | Quick poll: “What’s the last series you finished?” Each learner names one in 30 seconds with one adjective describing it. |
| 2. Input & Noticing | 12 min | Watch a 4-min clip from *The Good Place* S1E1 (Eleanor’s arrival in “the Good Place”). Comprehension questions, then re-watch with attention to past-tense verbs. |
| 3. Focus on Form | 9 min | Inductive: learners list past-tense verbs noticed. Teacher elicits past simple (completed) vs. past continuous (background/ongoing). Contrastive note: Portuguese *pretérito imperfeito* ≠ English past continuous in all contexts. |
| 4. Controlled Practice | 9 min | Pair gap-fill: past simple vs. past continuous in a short narrative about Eleanor. Then transform: “She arrived. The architect was waiting.” → connect with *when* / *while*. |
| 5. Communicative Task | 13 min | In pairs: each learner narrates the plot of a recent series episode (3 min each), using ≥4 past-tense verbs and 3 character adjectives. Listener takes notes, then summarizes back. |
| 6. Feedback & Reflection | 6 min | Teacher shares 4 anonymized errors from Phase 5 on the board. Class corrects collectively. Exit ticket: “One adjective I used today that’s new for me.” |
| 7. Informal-Input Bridge | 5 min | Assignment: Watch *The Good Place* S1E2 (24 min) with English subtitles before next lesson. Note 3 new adjectives describing characters. Optional: post one in class WhatsApp/Discord with a screenshot. |

---

## 9. Part VIII — Interactive Website Implementation

A single-file React artifact (`lesson-framework.jsx`) implements the framework as an interactive site.

### Design direction

Editorial academic journal × interactive learning tool. Cream/parchment background with deep burgundy (EwP brand wine-red), warm gold accents, charcoal ink. Typography pairing: **Fraunces** (variable serif display), **Newsreader** (editorial body), **JetBrains Mono** (technical labels). Manuscript-style ornaments (❦), drop-cap section numbers, asymmetric layouts.

### Sections

1. **Hero** — title, subtitle, meta strip
2. **01 Overview** — two side-by-side cards explaining macro and micro layers
3. **02 Macro Grid** — CEFR level selector + 6 theme cells; clicking a cell shows can-do statements, informal-input bridge, and strand distribution bar
4. **03 Micro Timeline** — 7 phase cards in a row; clicking a phase shows purpose, SLA grounding, and full activity options grid
5. **04 Compose a Lesson** — interactive lesson builder:
    - Selectors for Level / Theme / Lesson archetype (inherits from sections 02 + 03)
    - Context strip: archetype focus, can-do outcomes, informal-input bridge
    - Seven phase cards with:
        - Activity-type pills (pick one of 5–9 per phase)
        - Concrete prompt pulled from 252-prompt library (6 levels × 6 themes × 7 phases)
        - Click-to-edit inline (pencil icon → textarea → save/cancel)
        - “Custom” tag + reset-to-library button if edited
        - Focused phase highlighted with left burgundy bar
    - **Export**: Copy as Markdown (clipboard) or Print/Save PDF (browser print dialog with custom `@media print` stylesheet)
6. **Closing principles** (three commitments):
    - Informal input is curricular, not residual
    - L1 is a tool, not a contaminant
    - Variability is the norm
7. **Footer** — EwP signature, citation acknowledgments

### Removed in iteration

- The original “Worked Example” section was replaced by the interactive Compose a Lesson section
- The original “Implementation Tracks” section (binational/franchise/tutoring/autodidact cards) was removed entirely to tighten focus

### Library content note

The `EXAMPLES` constant in the .jsx file contains 252 hand-written concrete prompts. They are level-calibrated, theme-tied, and reference specific named content (Bluey at A1, The Good Place at B1, Modern Love podcast at B2, LRB essays at C2, etc.). These are the most labor-intensive content in the file — they cannot be regenerated trivially without rewriting them.

### Tech notes

- Single .jsx file, ~2,750 lines, ~128 KB
- Uses React (hooks), lucide-react icons
- No external state management; all state via useState
- Google Fonts loaded via @import in style block
- Print stylesheet at end of CSS handles PDF export via `window.print()`
- Markdown export via `navigator.clipboard.writeText()` with fallback

---

## 10. Possible Next Steps

The session ended with the interactive website complete. Useful continuations:

### Thesis-side

1. **Research proposal / projeto de pesquisa** in the format Brazilian programmes require
2. **Pre-pilot version of the informal exposure log** instrument
3. **Literature-review reading list** organized by the framework, with Brazilian scholarship integrated
4. **CEP/ethics submission** structure
5. **Timeline / Gantt** sized to user’s actual availability
6. **Methodology section pressure-test** (sampling, power, analysis decisions)
7. **Supervisor scouting** at UnB (Linguística Aplicada programme, CDST + mixed methods expertise)
8. **Binational center partnership** outreach (Casa Thomas Jefferson in Brasília)

### Lesson framework / EwP-side

1. **Build a unit in full detail** — pick one level/theme combination, write all 8 lessons end-to-end
2. **Develop the informal-input curation database** — a level-calibrated, theme-tagged content library beyond what’s in the .jsx
3. **Design assessment rubrics** aligned with the can-do statements
4. **Create a teacher-training module** to deploy this framework at scale
5. **Build a learner-facing version** — a study-skills guide for autodidact learners
6. **Map the framework to BNCC** descriptors for public/private school applicability
7. **Add a Portuguese-language UI option** to the website for Brazilian teachers without strong English

### Website-side

1. **Add BNCC mapping** as a new section
2. **Internationalization** (Portuguese UI labels)
3. **Save/share lesson plans** via URL parameters (no backend needed)
4. **Print-only handout view** with student-facing language
5. **Mobile app** version (React Native, fits user’s tech stack)
6. **Multi-lesson view** showing a full 8-lesson unit at once

### Research/writing-side

1. **Convert thesis framework into a publishable conceptual article** for *Revista Brasileira de Linguística Aplicada* or similar
2. **Convert lesson framework into a practitioner article** for an ELT magazine (e.g., *Modern English Teacher*, *English Teaching Professional*)
3. **Conference proposal** for BRAZ-TESOL, ABRAPUI, or AILA-Brazil
4. **Workshop materials** for EwP teacher development or community of practice

---

## Quick handoff prompt for resuming in a new conversation

If continuing this work in a new AI conversation, the user can paste this snippet at the start:

```
I'm continuing a project on Brazilian EFL teaching and a Master's-level
thesis framework. Context:

- I'm Pedro, an ESL teacher in Brasília (brand: "English with Pedro")
  with a Letras-Inglês degree and ongoing CS/full-stack studies.

- I've developed a thesis framework: Direction C — "I Learned English
  from Netflix": Hybrid SLA combining informal digital input + formal
  instruction in adult Brazilian EFL. Mixed-methods, CDST-grounded.

- I've also built a lesson plan framework with:
  - Macro: 6 themes × 6 CEFR levels (A1–C2), with can-do statements
    and informal-input bridges
  - Micro: 7-phase 60-min lesson template (Warm-up / Input / Form /
    Practice / Task / Feedback / Bridge), each with activity options
  - 8 lesson archetypes per unit shifting phase timing
  - 252 concrete prompt examples in a library (6×6×7)

- I have an interactive React website implementing the framework with
  a Compose-a-Lesson builder, Markdown export, and PDF print.

I'd like to work on: [INSERT TASK]
```

---

*End of conversation export. All substantive content from the session is preserved above. The companion files `sla-esl-research-reference.md` and `lesson-framework.jsx` contain the full research compendium and interactive implementation respectively.*