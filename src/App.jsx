import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowDown,
  Check,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Pencil,
  Printer,
  RotateCcw,
} from 'lucide-react';

import { THEMES } from './data/themes.js';
import { LEVELS } from './data/levels.js';
import { MACRO } from './data/macro.js';
import { PHASES } from './data/phases.js';
import { EXAMPLES } from './data/examples.js';
import { REFERENCE_GROUPS } from './data/references.js';
import { getEvidenceForSelection } from './data/evidence.js';

import EvidencePanel from './components/EvidencePanel.jsx';
import EvidenceDigest from './components/EvidenceDigest.jsx';
import MacroSpiral from './components/MacroSpiral.jsx';
import MicroArc from './components/MicroArc.jsx';
import { useSelections } from './hooks/useSelections.js';
import { buildMarkdown } from './utils/exportMarkdown.js';

// Components, hooks, and utilities are now imported from dedicated modules.
// Original inline definitions have been extracted to:
//   - src/components/EvidenceItem.jsx
//   - src/components/EvidencePanel.jsx
//   - src/components/EvidenceDigest.jsx
//   - src/components/MacroSpiral.jsx
//   - src/components/MicroArc.jsx
//   - src/hooks/useSelections.js
//   - src/utils/geometry.js
//   - src/utils/exportMarkdown.js

export default function App() {
  const [selections, setSelections, defaultSelections] = useSelections();
  const [activeSection, setActiveSection] = useState('overview');
  const [activePhase, setActivePhase] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [draftText, setDraftText] = useState('');
  const [toast, setToast] = useState(null);
  // Part 01 overview-local selections (independent of the global composer).
  const [overviewTheme, setOverviewTheme] = useState('identity');
  const [overviewPhase, setOverviewPhase] = useState(1);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = useCallback((id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // ─── DERIVED STATE ──────────────────────────────────────────────────────
  const level = selections.level;
  const theme = selections.theme;
  const levelData = useMemo(() => LEVELS.find((l) => l.id === level) || null, [level]);
  const themeData = useMemo(() => THEMES.find((t) => t.id === theme) || null, [theme]);
  const macroCell = useMemo(() => (level && theme ? MACRO[level]?.[theme] : null), [level, theme]);
  const hasMacro = Boolean(level && theme && macroCell);

  const phaseData = useMemo(() => PHASES.find((p) => p.id === activePhase), [activePhase]);
  const selectedActivityIdx = (phaseId) => selections.phaseActivities[phaseId] ?? 0;
  const hasPhaseSelection = (phaseId) => selections.phaseActivities[phaseId] !== undefined;
  const allPhasesPicked = PHASES.every((p) => hasPhaseSelection(p.id));
  const activeActivityIdx = phaseData ? selectedActivityIdx(phaseData.id) : 0;
  const activeActivity = phaseData?.activities[activeActivityIdx] || null;
  const activeEvidence = useMemo(
    () => getEvidenceForSelection(phaseData, activeActivity),
    [phaseData, activeActivity]
  );

  const getExample = useCallback(
    (phaseId) => {
      if (selections.editedExamples[phaseId] !== undefined) return selections.editedExamples[phaseId];
      if (!level || !theme) return '';
      return EXAMPLES[level]?.[theme]?.[phaseId] || '';
    },
    [selections.editedExamples, level, theme]
  );

  // ─── ACTIONS ────────────────────────────────────────────────────────────
  const setLevel = (id) => setSelections((s) => ({ ...s, level: id }));
  const setTheme = (id) => setSelections((s) => ({ ...s, theme: id }));
  const setPhaseActivity = (phaseId, idx) =>
    setSelections((s) => ({
      ...s,
      phaseActivities: { ...s.phaseActivities, [phaseId]: idx },
    }));

  const startEdit = (phaseId) => {
    setDraftText(getExample(phaseId));
    setEditingPhase(phaseId);
  };
  const saveEdit = (phaseId) => {
    setSelections((s) => ({
      ...s,
      editedExamples: { ...s.editedExamples, [phaseId]: draftText },
    }));
    setEditingPhase(null);
  };
  const cancelEdit = () => {
    setEditingPhase(null);
    setDraftText('');
  };
  const resetExample = (phaseId) =>
    setSelections((s) => {
      const next = { ...s.editedExamples };
      delete next[phaseId];
      return { ...s, editedExamples: next };
    });
  const resetAll = () => {
    setSelections(defaultSelections);
    setActivePhase(1);
    setEditingPhase(null);
    setToast({ kind: 'info', label: 'Selections reset' });
    setTimeout(() => setToast(null), 2200);
  };

  // ─── PART 01 → COMPOSER PRE-SELECT HANDLERS ─────────────────────────────
  const useThemeFromOverview = (themeId) => {
    const t = THEMES.find((x) => x.id === themeId);
    setSelections((s) => ({ ...s, theme: themeId, level: s.level ?? 'B1' }));
    setToast({ kind: 'ok', label: `${t?.name ?? 'Theme'} set in Part 02` });
    setTimeout(() => setToast(null), 2200);
    scrollTo('macro');
  };

  const usePhaseFromOverview = (phaseId) => {
    setActivePhase(phaseId);
    setToast({ kind: 'ok', label: `Phase ${phaseId} focused in Part 03` });
    setTimeout(() => setToast(null), 2200);
    scrollTo('micro');
  };

  // ─── EXPORT: MARKDOWN ───────────────────────────────────────────────────
  const getMarkdown = () => {
    if (!hasMacro) return '';
    return buildMarkdown({ themeData, levelData, level, macroCell, getExample, selectedActivityIdx });
  };

  const handleCopyMarkdown = async () => {
    const md = getMarkdown();
    if (!md) {
      setToast({ kind: 'warn', label: 'Pick a level and theme first' });
      setTimeout(() => setToast(null), 2200);
      return;
    }
    try {
      await navigator.clipboard.writeText(md);
      setToast({ kind: 'ok', label: 'Copied as Markdown' });
    } catch {
      const ta = document.createElement('textarea');
      ta.value = md;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setToast({ kind: 'ok', label: 'Copied as Markdown' });
      } catch {
        setToast({ kind: 'warn', label: 'Copy failed' });
      }
      document.body.removeChild(ta);
    }
    setTimeout(() => setToast(null), 2200);
  };

  const handlePrintPdf = async () => {
    if (!hasMacro) {
      setToast({ kind: 'warn', label: 'Pick a level and theme first' });
      setTimeout(() => setToast(null), 2200);
      return;
    }
    // Wait for fonts to be available so the PDF uses Fraunces/Newsreader,
    // not the fallback. Modest delay so the print dialog opens with everything
    // already painted.
    try {
      if (document?.fonts?.ready) await document.fonts.ready;
    } catch {
      /* ignore */
    }
    window.print();
  };

  // ─── TOTAL ──────────────────────────────────────────────────────────────
  const totalMinutes = PHASES.reduce((sum, p) => sum + p.defaultMin, 0);

  // ─── RENDER ─────────────────────────────────────────────────────────────
  return (
    <div className="lf-root">
      <div className="lf-grain" />

      {/* NAV */}
      <nav
        className="lf-nav"
        style={{
          background: scrolled ? 'rgba(242, 235, 221, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        }}
      >
        <div className="lf-nav-inner">
          <div className="lf-monogram">EFLL<span>·</span>framework</div>
          <div className="lf-nav-links">
            {[
              { id: 'overview', label: '01 Overview' },
              { id: 'macro', label: '02 Macro' },
              { id: 'micro', label: '03 Micro' },
              { id: 'compose', label: '04 Compose' },
              { id: 'references', label: '05 References' },
            ].map((item) => (
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
        <div className="lf-eyebrow">EFLLF · A pedagogical framework for Brazilian EFL</div>
        <h1>
          English as a Foreign Language <em>Lesson Framework</em>
        </h1>
        <p className="lf-hero-sub">
          A two-layer framework for planning English lessons in Brazilian EFL contexts. The <strong>macro</strong>
          layer is a CEFR-anchored grid of six thematic units (A1–C2) paired with informal-input recommendations. The
          <strong> micro</strong> layer is a seven-phase, 60-minute lesson template grounded in second language
          acquisition research. Designed for binational centers, language franchises, private tutoring, and self-study.
        </p>
        <div className="lf-hero-meta">
          <div className="lf-hero-meta-item"><div>Levels</div><div>A1 → C2 · CEFR Companion Vol.</div></div>
          <div className="lf-hero-meta-item"><div>Themes</div><div>Six durable, spiralling domains</div></div>
          <div className="lf-hero-meta-item"><div>Lesson template</div><div>Seven phases · 60 minutes</div></div>
          <div className="lf-hero-meta-item"><div>Context</div><div>EFL Brazil · four institutional tracks</div></div>
        </div>
      </header>

      {/* PART 1 — OVERVIEW */}
      <section id="overview" className="lf-section">
        <div className="lf-section-header">
          <div className="lf-section-num">01</div>
          <div className="lf-section-title">
            <div className="lf-section-kicker">The two layers</div>
            <h2>Macro <em>and</em> micro structures, woven together.</h2>
            <p className="lf-section-desc">
              The framework operates simultaneously at curricular scale (years of study mapped to CEFR) and at lesson
              scale (60 minutes of structured activity). Each layer answers a different design question. Together they
              make informal digital input curricular rather than residual.
            </p>
          </div>
        </div>

        <div className="lf-overview">
          <div className="lf-overview-card">
            <div className="lf-overview-tag">Macro · curricular scale</div>
            <h3>Six themes, six levels. <em>Spiralling, not stacking.</em></h3>
            <p>
              Each theme deepens through every level. Click a theme to see its rings bloom outward — A1 inner,
              C2 outer — and read a brief description.
            </p>
            <MacroSpiral
              themes={THEMES}
              levels={LEVELS}
              selectedId={overviewTheme}
              onSelect={setOverviewTheme}
              onUse={useThemeFromOverview}
            />
          </div>

          <div className="lf-overview-card micro">
            <div className="lf-overview-tag">Micro · lesson scale</div>
            <h3>Seven phases, sixty minutes. <em>One full hour.</em></h3>
            <p>
              A 60-minute lesson curved into a full clock face. Click any stop to see its purpose and SLA grounding; the
              arc fills wine → gold as the lesson unfolds.
            </p>
            <MicroArc
              phases={PHASES}
              selectedId={overviewPhase}
              onSelect={setOverviewPhase}
              onUse={usePhaseFromOverview}
            />
          </div>
        </div>

        <div className="lf-ornament">❦ ❦ ❦</div>
      </section>

      {/* PART 2 — MACRO */}
      <section id="macro" className="lf-section">
        <div className="lf-section-header">
          <div className="lf-section-num">02</div>
          <div className="lf-section-title">
            <div className="lf-section-kicker">The macro grid</div>
            <h2>Pick a level, <em>then a theme.</em></h2>
            <p className="lf-section-desc">
              Choose a CEFR level (A1–C2) and a thematic unit. Selections feed the lesson composer in Part 04. The
              six themes spiral across levels — <em>food</em> at A1 becomes <em>food sustainability</em> at B2 becomes
              <em> the philosophy of food</em> at C1.
            </p>
          </div>
        </div>

        <div className="lf-macro-controls">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              className={`lf-level-btn ${level === lvl.id ? 'active' : ''}`}
              onClick={() => setLevel(lvl.id)}
            >
              <span className="lf-level-label">{lvl.label}</span>
              <span className="lf-level-name">{lvl.name}</span>
            </button>
          ))}
        </div>

        <div className="lf-macro-grid">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const cell = level ? MACRO[level]?.[t.id] : null;
            const isActive = level && theme === t.id;
            return (
              <button
                key={t.id}
                className={`lf-cell ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (!level) setLevel('B1'); // sensible default if user clicked theme first
                  setTheme(t.id);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="lf-cell-num">{t.num}</span>
                  <Icon size={20} className="lf-cell-icon" />
                </div>
                <div className="lf-cell-name">{t.name}</div>
                <div className="lf-cell-preview">{cell ? `${cell.cando[0].slice(0, 60)}…` : 'Pick a level to preview…'}</div>
              </button>
            );
          })}
        </div>

        {hasMacro && (
          <div className="lf-detail">
            <div className="lf-detail-header">
              <div>
                <div className="lf-detail-meta" style={{ marginBottom: 8 }}>
                  {level} · {levelData.name}
                </div>
                <div className="lf-detail-title">{themeData.name}</div>
              </div>
              <div className="lf-detail-meta">{levelData.desc}</div>
            </div>

            <div className="lf-detail-body">
              <div className="lf-detail-section">
                <h4>Can-do statements</h4>
                <ul className="lf-cando-list">
                  {macroCell.cando.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="lf-detail-section">
                <h4>Informal-input bridge</h4>
                <ul className="lf-bridge-list">
                  {macroCell.bridge.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>

            <div className="lf-strands">
              <div className="lf-strands-label">
                Nation's four strands · per 60 hours · {levelData.hours.i + levelData.hours.o + levelData.hours.l + levelData.hours.f}h total
              </div>
              <div className="lf-strands-bar">
                <div className="lf-strand" style={{ flex: levelData.hours.i, background: '#D4B47A' }}>Input · {levelData.hours.i}h</div>
                <div className="lf-strand" style={{ flex: levelData.hours.o, background: '#B8924A' }}>Output · {levelData.hours.o}h</div>
                <div className="lf-strand" style={{ flex: levelData.hours.l, background: '#8E6B2E' }}>Form · {levelData.hours.l}h</div>
                <div className="lf-strand" style={{ flex: levelData.hours.f, background: '#5E4720', color: 'var(--paper)' }}>Fluency · {levelData.hours.f}h</div>
              </div>
            </div>

            <button className="lf-detail-cta" onClick={() => scrollTo('micro')}>
              Continue to phase &amp; activity selection <ArrowDown size={12} />
            </button>
          </div>
        )}

        <div className="lf-ornament">❦ ❦ ❦</div>
      </section>

      {/* PART 3 — MICRO */}
      <section id="micro" className="lf-section">
        <div className="lf-section-header">
          <div className="lf-section-num">03</div>
          <div className="lf-section-title">
            <div className="lf-section-kicker">The micro template</div>
            <h2>Pick a phase, <em>then an activity.</em></h2>
            <p className="lf-section-desc">
              Step through the seven phases of a 60-minute lesson. For each phase, click an activity card to mark your
              choice — selections flow into the composer below. The phase sequence is grounded in second language
              acquisition research; Phase 7 — the informal-input bridge — extends classroom work into the digital
              content learners already consume.
            </p>
          </div>
        </div>

        <div className="lf-timeline">
          <div className="lf-timeline-track">
            {PHASES.map((phase) => {
              const Icon = phase.icon;
              return (
                <button
                  key={phase.id}
                  className={`lf-phase-btn ${activePhase === phase.id ? 'active' : ''} ${hasPhaseSelection(phase.id) ? 'has-selection' : ''}`}
                  onClick={() => setActivePhase(phase.id)}
                >
                  <span className="lf-phase-tick" aria-hidden />
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
                  <div className="lf-phase-breadcrumb">
                    <strong>Phase {phaseData.id} of 7</strong>
                    <span className="sep">·</span>
                    <span>{phaseData.name}</span>
                    <span className="sep">·</span>
                    <span>{hasPhaseSelection(phaseData.id) ? 'activity selected' : 'pick an activity below'}</span>
                  </div>
                  <div className="lf-phase-detail-title">{phaseData.name}</div>
                  <div className="lf-phase-detail-time">{phaseData.time} · Phase {phaseData.id} of 7</div>
                  <p className="lf-phase-purpose" style={{ marginTop: 16 }}>{phaseData.purpose}</p>
                  <div className="lf-phase-sla">SLA grounding · {phaseData.sla}</div>
                </div>
              </div>

              <h4
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  color: 'var(--wine)',
                  marginBottom: 20,
                }}
              >
                Activity options · {phaseData.activities.length} · click to select
              </h4>

              <div className="lf-activities-grid">
                {phaseData.activities.map((act, i) => {
                  const isSelected = selectedActivityIdx(phaseData.id) === i && hasPhaseSelection(phaseData.id);
                  const ActIcon = phaseData.icon;
                  const numeral = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i] || String(i + 1);
                  return (
                    <button
                      key={i}
                      className={`lf-activity-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setPhaseActivity(phaseData.id, i)}
                    >
                      <span className="lf-activity-check" aria-hidden><Check size={12} /></span>
                      <div className="lf-activity-head">
                        <span className="lf-activity-num">{numeral}</span>
                        <ActIcon size={18} className="lf-activity-icon" />
                      </div>
                      <div className="lf-activity-name">{act.name}</div>
                      <div className="lf-activity-descriptor">
                        <span className="lf-activity-best">{act.best}</span> · {act.sla}
                      </div>
                    </button>
                  );
                })}
              </div>

              <EvidencePanel
                items={activeEvidence}
                context={`Phase ${phaseData.id}: ${phaseData.name} · ${activeActivity?.name || 'Select an activity'}`}
              />

              {phaseData.id < 7 && (
                <button
                  className="lf-detail-cta"
                  style={{ marginTop: 24, color: 'var(--wine)', borderColor: 'var(--wine)' }}
                  onClick={() => setActivePhase(phaseData.id + 1)}
                >
                  Next phase <ArrowDown size={12} style={{ transform: 'rotate(-90deg)' }} />
                </button>
              )}
              {phaseData.id === 7 && allPhasesPicked && (
                <button
                  className="lf-detail-cta"
                  style={{ marginTop: 24, color: 'var(--wine)', borderColor: 'var(--wine)' }}
                  onClick={() => scrollTo('compose')}
                >
                  See the composed lesson <ArrowDown size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="lf-ornament">❦ ❦ ❦</div>
      </section>

      {/* PART 4 — COMPOSE */}
      <section id="compose" className="lf-section lf-compose">
        <div className="lf-section-header">
          <div className="lf-section-num">04</div>
          <div className="lf-section-title">
            <div className="lf-section-kicker">The composed lesson</div>
            <h2>Your lesson plan, <em>ready to teach.</em></h2>
            <p className="lf-section-desc">
              A live preview assembled from your selections — level and theme from Part 02, phase activities from
              Part 03. Each phase carries a concrete prompt from the library; click the pencil to edit. When ready,
              download a PDF or copy the plan as Markdown.
            </p>
          </div>
        </div>

        {!hasMacro && (
          <div className="lf-compose-empty">
            <strong>Nothing to compose yet</strong>
            Pick a <em>level</em> and a <em>theme</em> in Part 02, then choose an activity for each phase in Part 03.
            Your lesson will assemble itself here.
          </div>
        )}

        {hasMacro && (
          <>
            {/* CONTEXT STRIP */}
            <div className="lf-compose-context">
              <div className="lf-compose-context-col">
                <div className="lf-compose-context-label">Level · Theme</div>
                <div className="lf-compose-context-archetype">
                  {level} · {themeData.name}
                </div>
                <div className="lf-compose-context-archetype-focus">{levelData.name} — {levelData.desc}</div>
              </div>
              <div className="lf-compose-context-col">
                <div className="lf-compose-context-label">Can-do outcomes · {level}</div>
                <ul className="lf-compose-cando">
                  {macroCell.cando.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div className="lf-compose-context-col">
                <div className="lf-compose-context-label">Informal-input bridge</div>
                <ul className="lf-compose-bridge">
                  {macroCell.bridge.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            </div>

            {/* LESSON PLAN */}
            <div className="lf-compose-plan">
              <div className="lf-compose-plan-header">
                <div>
                  <div className="lf-compose-plan-eyebrow">The lesson · 60 min · {level} {themeData.name}</div>
                  <h3 className="lf-compose-plan-title">Lesson — {themeData.name}</h3>
                </div>
                <div className="lf-compose-plan-total">{totalMinutes} min</div>
              </div>

              {PHASES.map((phase) => {
                const Icon = phase.icon;
                const time = phase.defaultMin;
                const actIdx = selectedActivityIdx(phase.id);
                const activity = phase.activities[actIdx];
                const isEditing = editingPhase === phase.id;
                const isCustom = selections.editedExamples[phase.id] !== undefined;
                const example = getExample(phase.id);
                const evidenceItems = getEvidenceForSelection(phase, activity);

                return (
                  <div key={phase.id} className="lf-compose-phase">
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
                      <div className="lf-compose-activity-row">
                        <div>
                          <div className="lf-compose-activity-row-label">Activity</div>
                          <div className="lf-compose-activity-name">{activity.name}</div>
                        </div>
                        <select
                          className="lf-compose-activity-swap"
                          value={actIdx}
                          onChange={(e) => setPhaseActivity(phase.id, Number(e.target.value))}
                          title="Swap activity"
                        >
                          {phase.activities.map((a, i) => (
                            <option key={i} value={i}>{a.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="lf-compose-example-block">
                        <div className="lf-compose-example-label">
                          <span>Concrete prompt {isCustom && <em className="lf-mono lf-custom-tag">· custom</em>}</span>
                          {!isEditing ? (
                            <div className="lf-compose-example-actions">
                              {isCustom && (
                                <button
                                  className="lf-icon-btn"
                                  onClick={() => resetExample(phase.id)}
                                  title="Reset to library default"
                                >
                                  <RotateCcw size={13} />
                                </button>
                              )}
                              <button
                                className="lf-icon-btn"
                                onClick={() => startEdit(phase.id)}
                                title="Edit prompt"
                              >
                                <Pencil size={13} />
                              </button>
                            </div>
                          ) : (
                            <div className="lf-compose-example-actions">
                              <button
                                className="lf-icon-btn"
                                onClick={cancelEdit}
                                title="Cancel"
                              >
                                ✕
                              </button>
                              <button
                                className="lf-icon-btn lf-icon-btn-primary"
                                onClick={() => saveEdit(phase.id)}
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

                      <EvidenceDigest items={evidenceItems} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTION BAR */}
            <div className="lf-compose-actions-bar">
              <div className="lf-actions-spacer">
                <span className="lf-compose-actions-note">
                  {allPhasesPicked
                    ? 'All seven phases set. Ready to export.'
                    : 'Tip: pick an activity for each phase in Part 03 to lock the plan.'}
                </span>
              </div>
              <button className="lf-btn lf-btn-ghost" onClick={resetAll} title="Clear all selections">
                <RotateCcw size={14} /> Reset
              </button>
              <button className="lf-btn lf-btn-secondary" onClick={handleCopyMarkdown}>
                <Copy size={14} /> Copy as Markdown
              </button>
              <button className="lf-btn lf-btn-primary" onClick={handlePrintPdf}>
                <Printer size={14} /> Download PDF
              </button>
            </div>
          </>
        )}
      </section>

      {/* PRINCIPLES */}
      <section className="lf-principles">
        <div className="lf-principles-inner">
          <div className="lf-principles-tag">Three commitments</div>
          <h2>The framework <em>rests on</em> three commitments.</h2>

          <div className="lf-principles-list">
            <div className="lf-principle">
              <h4>Informal input is curricular, not residual.</h4>
              <p>A lesson that ends without an informal-input bridge hasn't closed the loop the framework argues for. Phase 7 is non-optional.</p>
            </div>
            <div className="lf-principle">
              <h4>L1 is a resource, not a contaminant.</h4>
              <p>Strategic Portuguese in Phases 3 and 6 supports rather than undermines L2 acquisition. Translanguaging is permission, not problem.</p>
            </div>
            <div className="lf-principle">
              <h4>Variability is the norm.</h4>
              <p>Complex Dynamic Systems Theory tells us learners don't progress linearly through the macro grid. The framework is a spiral, not a staircase.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PART 5 — REFERENCES */}
      <section id="references" className="lf-section lf-references">
        <div className="lf-section-header">
          <div className="lf-section-num">05</div>
          <div className="lf-section-title">
            <div className="lf-section-kicker">The research</div>
            <h2>Where each move <em>comes from.</em></h2>
            <p className="lf-section-desc">
              The framework draws on foundational and contemporary scholarship in second language acquisition. What
              follows is a curated bibliography organised by the construct each work anchors, with a brief note on
              where it shows up in the EFLL Framework.
            </p>
          </div>
        </div>

        <div className="lf-references-grid">
          {REFERENCE_GROUPS.map((group) => (
            <div key={group.id} className="lf-ref-group">
              <div className="lf-ref-group-head">
                <h3 className="lf-ref-group-name">{group.name}</h3>
                <div className="lf-ref-group-anchor">Anchors · {group.anchor}</div>
              </div>
              <ul className="lf-ref-list">
                {group.items.map((item, i) => (
                  <li key={i} className="lf-ref-item">
                    <div className="lf-ref-citation">
                      <span className="lf-ref-author">{item.authors}</span>
                      <span className="lf-ref-year"> ({item.year}).</span>{' '}
                      <em className="lf-ref-title">{item.title}</em>
                      {item.venue && <span className="lf-ref-venue">. {item.venue}.</span>}
                    </div>
                    <div className="lf-ref-note">{item.note}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lf-ornament">❦ ❦ ❦</div>
      </section>

      {/* FOOTER */}
      <footer className="lf-footer">
        <span className="lf-footer-mono">English with Pedro</span>
        <div className="lf-footer-sub">A framework · For Brazilian EFL · Adult learners · Digital + Formal</div>

        <nav className="lf-footer-links" aria-label="Author links">
          <a
            className="lf-footer-link"
            href="https://pedrobritx.github.io/EwP/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={12} /> English with Pedro
          </a>
          <a
            className="lf-footer-link"
            href="https://www.linkedin.com/in/pedrobritx/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={12} /> LinkedIn
          </a>
          <a
            className="lf-footer-link"
            href="https://github.com/pedrobritx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={12} /> GitHub
          </a>
          <a className="lf-footer-link" href="mailto:pedrobritx@gmail.com">
            <Mail size={12} /> pedrobritx@gmail.com
          </a>
        </nav>

        <div className="lf-footer-line">
          © {new Date().getFullYear()} · Pedro Brito · The EFLL Framework is an open framework.
        </div>
      </footer>

      {toast && (
        <div className="lf-toast" role="status">
          <Check size={14} /> {toast.label}
        </div>
      )}
    </div>
  );
}
