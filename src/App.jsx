import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Coffee,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Pencil,
  Printer,
  RotateCcw,
  X,
} from 'lucide-react';

import {
  THEMES,
  LEVELS,
  MACRO,
  PHASES,
  REFERENCE_GROUPS,
  getEvidenceForSelection,
  getEvidenceForLevel,
  getEvidenceForTheme,
} from './data/index.js';
import { refsForAnchor } from './data/references.js';
import { CREDIT_LINE, CREDIT_URL, COMMERCIAL_CONTACT, SUPPORT_URL } from './data/credit.js';
import { useSelections } from './hooks/useSelections.js';
import { useWizard } from './hooks/useWizard.js';
import { scrollBehavior } from './hooks/useReducedMotion.js';
import { buildMarkdown } from './utils/exportMarkdown.js';
import { STEP_META, defaultActivityIdxFor } from './wizard/steps.js';
import EvidencePanel from './components/EvidencePanel.jsx';
import EvidenceDigest from './components/EvidenceDigest.jsx';
import MacroSpiral from './components/MacroSpiral.jsx';
import MicroArc from './components/MicroArc.jsx';
import WizardStepper from './components/WizardStepper.jsx';
import WizardNavBar from './components/WizardNavBar.jsx';
import WizardWelcome from './components/WizardWelcome.jsx';

// ── Cross-reference plumbing ──────────────────────────────────────────────
// Lets a reference pill jump to the concept's wizard step.
const XRefContext = createContext(null);

const PRINCIPLE_NAMES = {
  1: 'informal input',
  2: 'L1 as resource',
  3: 'variability',
};

function refGroupName(id) {
  const g = REFERENCE_GROUPS.find((x) => x.id === id);
  return g?.name ?? id;
}

function anchorLabel(a) {
  if (a.label) return a.label;
  if (a.kind === 'phase') return `Phase ${a.id}`;
  if (a.kind === 'principle') return `Principle: ${PRINCIPLE_NAMES[a.id] ?? a.id}`;
  if (a.kind === 'level') return `Level ${a.id}`;
  if (a.kind === 'theme') return THEMES.find((t) => t.id === a.id)?.name ?? a.id;
  if (a.kind === 'section') return a.id;
  return String(a.id);
}

function XRefPill({ kind, id, label, fromLabel, targetGroupId }) {
  const xref = useContext(XRefContext);
  if (!xref) return null;
  const onClick = () => xref.jumpTo({ kind, id, fromLabel, targetGroupId });
  return (
    <button
      type="button"
      className="lf-xref-pill"
      onClick={onClick}
      title={`Jump to ${label}`}
    >
      <span>{label}</span>
      <ArrowUpRight size={11} aria-hidden />
    </button>
  );
}

export default function App() {
  const [selections, setSelections, defaultSelections] = useSelections();
  const wizard = useWizard();
  const { step } = wizard;
  const [activePhase, setActivePhase] = useState(1);
  // The sticky nav — measured so --nav-offset (scroll-margin) clears it at any width.
  const navRef = useRef(null);
  const [editingPhase, setEditingPhase] = useState(null);
  const [draftText, setDraftText] = useState('');
  const [editingHandoutPhase, setEditingHandoutPhase] = useState(null);
  const [handoutDraftText, setHandoutDraftText] = useState('');
  const [toast, setToast] = useState(null);
  // Which tab is active in Part 04 — view state only, not persisted.
  const [composeTab, setComposeTab] = useState('plan'); // 'plan' | 'handout'
  // Heavy data modules (examples ~32 KB, handouts ~280 KB) are split out of the
  // initial bundle and fetched on idle so first paint stays light. By the time
  // the user navigates to the compose section they're already resident.
  const [examplesMod, setExamplesMod] = useState(null);
  const [handoutsMod, setHandoutsMod] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      import('./data/examples.js').then((m) => { if (!cancelled) setExamplesMod(m); });
      import('./data/handouts.js').then((m) => { if (!cancelled) setHandoutsMod(m); });
    };
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(load, { timeout: 1500 });
      return () => {
        cancelled = true;
        if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(handle);
      };
    }
    const t = setTimeout(load, 200);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  // Keep --nav-offset in sync with the real nav height (it wraps taller on small
  // screens), so scroll-padding-top offsets every jump/snap landing accurately.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const apply = () => {
      const h = Math.round(nav.getBoundingClientRect().height) + 12;
      document.documentElement.style.setProperty('--nav-offset', `${h}px`);
    };
    apply();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', apply, { passive: true });
      return () => window.removeEventListener('resize', apply);
    }
    const ro = new ResizeObserver(apply);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  // Reveal each section as it enters view. Gated so content is never stuck hidden:
  // only arm when IntersectionObserver exists and motion isn't reduced.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.querySelector('.lf-root');
    const els = Array.from(document.querySelectorAll('.lf-reveal'));
    if (!root || els.length === 0) return;
    root.classList.add('lf-reveal-ready');
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.classList.remove('lf-reveal-ready');
    };
  }, []);

  const goToPhase = useCallback((id) => {
    setActivePhase(id);
    const el = document.getElementById('phase-timeline');
    if (el) el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }, []);

  // Keep the active phase card in view within the horizontal timeline rail
  // (mobile). Scroll the track itself — not the button — so the page doesn't
  // jump vertically.
  const timelineTrackRef = useRef(null);
  useEffect(() => {
    const track = timelineTrackRef.current;
    if (!track) return;
    if (track.scrollWidth <= track.clientWidth) return; // not a scrollable rail
    const activeBtn = track.querySelector('.lf-phase-btn.active');
    if (!activeBtn) return;
    const left = Math.max(0, activeBtn.offsetLeft - track.offsetLeft - 4);
    track.scrollTo({ left, behavior: scrollBehavior() });
  }, [activePhase]);

  // ─── CROSS-REFERENCE JUMPS ───────────────────────────────────────────────
  // The framework is shown one step at a time, so a reference pill switches to
  // the relevant step rather than scrolling a long document.
  const wizardRef = useRef(wizard);
  wizardRef.current = wizard;
  const jumpTo = useCallback(({ kind, id }) => {
    if (kind === 'phase') setActivePhase(id);
    wizardRef.current.setStep(kind === 'phase' ? 'activities' : 'learn');
  }, []);

  const xrefValue = useMemo(() => ({ jumpTo }), [jumpTo]);

  // ─── DERIVED STATE ──────────────────────────────────────────────────────
  const level = selections.level;
  const theme = selections.theme;
  const levelData = useMemo(() => LEVELS.find((l) => l.id === level) || null, [level]);
  const themeData = useMemo(() => THEMES.find((t) => t.id === theme) || null, [theme]);
  const levelEvidence = useMemo(() => getEvidenceForLevel(levelData), [levelData]);
  // The theme step previews a focused theme (the spiral default) before commit.
  const themeFocus = useMemo(() => themeData || THEMES.find((t) => t.id === 'identity'), [themeData]);
  const themeEvidence = useMemo(() => getEvidenceForTheme(themeFocus), [themeFocus]);
  const macroCell = useMemo(() => (level && theme ? MACRO[level]?.[theme] : null), [level, theme]);
  const hasMacro = Boolean(level && theme && macroCell);

  const phaseData = useMemo(() => PHASES.find((p) => p.id === activePhase), [activePhase]);
  // refsForAnchor is pure over (kind, id) and called multiple times per phase
  // in render (micro detail + compose plan). Precompute once.
  const refsByPhase = useMemo(() => {
    const map = new Map();
    for (const p of PHASES) map.set(p.id, refsForAnchor('phase', p.id));
    return map;
  }, []);
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
      if (!level || !theme || !examplesMod) return '';
      return examplesMod.EXAMPLES[level]?.[theme]?.[phaseId] || '';
    },
    [selections.editedExamples, level, theme, examplesMod]
  );

  const getHandoutText = useCallback(
    (phaseId, activityIdx) => {
      if (selections.editedHandouts[phaseId] !== undefined) return selections.editedHandouts[phaseId];
      if (!level || !theme || !handoutsMod) return '';
      return handoutsMod.getHandout(level, theme, phaseId, activityIdx) || '';
    },
    [selections.editedHandouts, level, theme, handoutsMod]
  );

  // ─── ACTIONS ────────────────────────────────────────────────────────────
  const setLevel = (id) => setSelections((s) => ({ ...s, level: id }));
  const setTheme = (id) => setSelections((s) => ({ ...s, theme: id }));
  const setPhaseActivity = (phaseId, idx) =>
    setSelections((s) => ({
      ...s,
      phaseActivities: { ...s.phaseActivities, [phaseId]: idx },
    }));

  // Tapping a card records the choice; the sticky Next button advances the
  // phase, so a teacher can compare options before moving on.
  const chooseActivity = (phaseId, idx) => {
    setPhaseActivity(phaseId, idx);
  };

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

  const startHandoutEdit = (phaseId, activityIdx) => {
    setHandoutDraftText(getHandoutText(phaseId, activityIdx));
    setEditingHandoutPhase(phaseId);
  };
  const saveHandoutEdit = (phaseId) => {
    setSelections((s) => ({
      ...s,
      editedHandouts: { ...s.editedHandouts, [phaseId]: handoutDraftText },
    }));
    setEditingHandoutPhase(null);
  };
  const cancelHandoutEdit = () => {
    setEditingHandoutPhase(null);
    setHandoutDraftText('');
  };
  const resetHandout = (phaseId) =>
    setSelections((s) => {
      const next = { ...s.editedHandouts };
      delete next[phaseId];
      return { ...s, editedHandouts: next };
    });

  const resetAll = () => {
    setSelections(defaultSelections);
    setActivePhase(1);
    setEditingPhase(null);
    setEditingHandoutPhase(null);
    setToast({ kind: 'info', label: 'Selections reset' });
    setTimeout(() => setToast(null), 2200);
  };

  // ─── EXPORT: MARKDOWN ───────────────────────────────────────────────────
  const getMarkdown = () => {
    if (!hasMacro) return '';
    return buildMarkdown({ themeData, levelData, level, macroCell, getExample, selectedActivityIdx });
  };

  // ─── EXPORT: HANDOUT MARKDOWN ───────────────────────────────────────────
  const buildHandoutMarkdown = () => {
    if (!hasMacro) return '';
    let md = `# Student handout — ${themeData.name}\n\n`;
    md += `**Level:** ${level} · ${levelData.name}\n`;
    md += `**Date:** _________________________\n\n`;
    md += `## By the end of this lesson, you'll be able to\n\n`;
    macroCell.cando.forEach((c) => {
      md += `- ${c.charAt(0).toUpperCase() + c.slice(1)}.\n`;
    });
    md += `\n---\n\n`;
    PHASES.forEach((phase) => {
      const actIdx = selectedActivityIdx(phase.id);
      const activity = phase.activities[actIdx];
      const task = getHandoutText(phase.id, actIdx);
      md += `### Phase ${phase.id} — ${phase.name} (${phase.defaultMin} min)\n`;
      md += `**${activity.name}**\n\n`;
      md += `**Your task:** ${task}\n\n`;
    });
    md += `\n---\n*${CREDIT_LINE} (${CREDIT_URL})*\n`;
    return md;
  };

  const handleCopyMarkdown = async () => {
    const md = composeTab === 'handout' ? buildHandoutMarkdown() : getMarkdown();
    if (!md) {
      setToast({ kind: 'warn', label: 'Pick a level and theme first' });
      setTimeout(() => setToast(null), 2200);
      return;
    }
    const okLabel = composeTab === 'handout' ? 'Copied handout' : 'Copied as Markdown';
    try {
      await navigator.clipboard.writeText(md);
      setToast({ kind: 'ok', label: okLabel });
    } catch {
      const ta = document.createElement('textarea');
      ta.value = md;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setToast({ kind: 'ok', label: okLabel });
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
    // Toggle a body class so the print stylesheet can show only the handout
    // when it's the active tab, or only the lesson plan otherwise.
    const isHandout = composeTab === 'handout';
    if (isHandout) document.body.classList.add('lf-print-handout');
    const cleanup = () => {
      document.body.classList.remove('lf-print-handout');
      window.removeEventListener('afterprint', cleanup);
    };
    if (isHandout) window.addEventListener('afterprint', cleanup);
    window.print();
  };

  // ─── TOTAL ──────────────────────────────────────────────────────────────
  const totalMinutes = PHASES.reduce((sum, p) => sum + p.defaultMin, 0);

  // ─── GUIDED WIZARD ──────────────────────────────────────────────────────
  // Disable global scroll-snap: the wizard shows one step at a time and snap
  // fights the single-panel view.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('lf-wizard-active');
    return () => html.classList.remove('lf-wizard-active');
  }, []);

  // On entering a step — or moving between phases within the build step — return
  // to the top so every screen reads from the same, predictable starting point.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  }, [step]);
  useEffect(() => {
    if (step !== 'activities') return;
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  }, [activePhase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-select a sensible activity per phase as soon as a level+theme exist, so
  // a teacher can accept the recommendation in one tap and tweak only what they
  // want. Fills phases with no existing choice — never overrides a real pick.
  useEffect(() => {
    if (!hasMacro) return;
    setSelections((s) => {
      let changed = false;
      const pa = { ...s.phaseActivities };
      for (const p of PHASES) {
        if (pa[p.id] === undefined) {
          pa[p.id] = defaultActivityIdxFor(p, s.level);
          changed = true;
        }
      }
      return changed ? { ...s, phaseActivities: pa } : s;
    });
  }, [hasMacro, level, theme, setSelections]);

  // ─── WIZARD NAVIGATION ──────────────────────────────────────────────────
  const startPlanning = () => { wizard.markSeenWelcome(); wizard.setStep('level'); };
  // The manifesto + licence live inline on the homepage. From the nav or footer,
  // return to the homepage if needed, then scroll the inline section into view.
  const goToManifesto = useCallback(() => {
    if (step !== 'welcome') wizard.setStep('welcome');
    requestAnimationFrame(() => {
      document.getElementById('lf-home-manifesto')
        ?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    });
  }, [step, wizard]);

  const goPrevPhase = () => {
    if (activePhase > 1) setActivePhase(activePhase - 1);
    else wizard.setStep('theme');
  };
  const goNextPhase = () => {
    if (activePhase < 7) setActivePhase(activePhase + 1);
    else wizard.setStep('compose');
  };

  const stepIsComplete = (id) => {
    if (id === 'level') return Boolean(level);
    if (id === 'theme') return hasMacro;
    if (id === 'activities') return hasMacro && allPhasesPicked;
    return false;
  };
  const stepCanGoTo = (id) => {
    if (id === 'level' || id === 'learn') return true;
    if (id === 'theme') return Boolean(level);
    if (id === 'activities' || id === 'compose') return hasMacro;
    return false;
  };

  // Per-step Back/Next config for the sticky bottom bar.
  let navCfg = null;
  if (step !== 'welcome') {
    if (step === 'level') {
      navCfg = {
        back: { label: 'Welcome', onClick: () => wizard.setStep('welcome') },
        next: { label: 'Next: choose a theme', disabled: !level, onClick: () => wizard.setStep('theme') },
        helper: !level ? 'Pick the level you teach to continue' : null,
      };
    } else if (step === 'theme') {
      navCfg = {
        back: { label: 'Level', onClick: () => wizard.setStep('level') },
        next: { label: 'Next: build the lesson', disabled: !hasMacro, onClick: () => wizard.setStep('activities') },
        helper: !theme ? 'Choose a theme to continue' : null,
      };
    } else if (step === 'activities') {
      navCfg = {
        back: { label: activePhase > 1 ? 'Previous phase' : 'Theme', onClick: goPrevPhase },
        next: { label: activePhase < 7 ? 'Next phase' : 'Next: your lesson', onClick: goNextPhase },
        helper: `Phase ${activePhase} of 7 · a recommended activity is pre-selected`,
      };
    } else if (step === 'compose') {
      navCfg = {
        back: { label: 'Activities', onClick: () => wizard.setStep('activities') },
        next: { label: 'Download PDF', icon: 'printer', onClick: handlePrintPdf },
        helper: allPhasesPicked ? 'Ready to teach — export below, or open the research' : 'Tip: the research tab is one step away',
      };
    } else if (step === 'learn') {
      navCfg = {
        back: { label: 'Your lesson', onClick: () => wizard.setStep('compose') },
        next: null,
      };
    }
  }

  // ─── RENDER ─────────────────────────────────────────────────────────────
  return (
    <XRefContext.Provider value={xrefValue}>
      <div className="lf-root lf-mode-wizard" data-wstep={step}>
        <div className="lf-grain" />
        <div className="lf-sr-only" aria-live="polite">{STEP_META[step]?.label}</div>

        {/* NAV */}
        <nav ref={navRef} className="lf-nav">
          <div className="lf-nav-inner">
            <div className="lf-monogram">EFL Lesson<span>·</span>framework</div>
            <div className="lf-nav-actions">
              <button
                type="button"
                className="lf-nav-explore-toggle"
                onClick={goToManifesto}
              >
                <BookOpen size={13} aria-hidden /> Manifesto &amp; licence
              </button>
              {step === 'welcome' && (
                <button
                  type="button"
                  className="lf-nav-cta"
                  onClick={startPlanning}
                >
                  Start planning <ArrowRight size={14} aria-hidden />
                </button>
              )}
            </div>
          </div>
          {step !== 'welcome' && (
            <WizardStepper
              current={step}
              isComplete={stepIsComplete}
              canGoTo={stepCanGoTo}
              onNavigate={(id) => wizard.setStep(id)}
            />
          )}
        </nav>

        <WizardWelcome />

        {/* PART 2 — MACRO */}
        <section id="macro" className="lf-section lf-reveal">
          <div className="lf-section-header">
            <div className="lf-section-num">02</div>
            <div className="lf-section-title">
              <div className="lf-section-kicker">The macro grid</div>
              <h2>Pick a level, <em>then a theme.</em></h2>
              <p className="lf-section-desc">
                Choose a CEFR level (A1–C2) and a thematic unit. Selections feed the lesson composer in compose. The
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

          {/* LEVEL STEP — what the chosen CEFR level means, with sources */}
          <div className="lf-wizard-level-extra">
            {levelData ? (
              <div className="lf-step-desc">
                <div className="lf-step-desc-head">
                  <span className="lf-step-desc-tag">{levelData.label} · {levelData.name}</span>
                  <span className="lf-step-desc-sub">CEFR descriptor</span>
                </div>
                <p className="lf-step-desc-lead">{levelData.cefrDescriptor}</p>
                <p className="lf-step-desc-why">
                  <strong>Planning emphasis · </strong>{levelData.whyThisLevel}
                </p>
                {levelEvidence.length > 0 && (
                  <details className="lf-step-sources">
                    <summary>Why this level — the research <span aria-hidden>›</span></summary>
                    <EvidencePanel
                      items={levelEvidence}
                      context={`${levelData.label} · ${levelData.name}`}
                    />
                  </details>
                )}
              </div>
            ) : (
              <p className="lf-step-desc-empty">
                Pick a level above to see what it means and the research behind it.
              </p>
            )}
          </div>

          {/* THEME STEP — level context, the spiral, and why this theme */}
          <div className="lf-wizard-theme-extra">
            {level && (
              <div className="lf-wizard-context-chip">
                <span>Planning for <strong>{level} · {levelData?.name}</strong></span>
                <button type="button" onClick={() => wizard.setStep('level')}>change level</button>
              </div>
            )}
            <div className="lf-wizard-spiral">
              <MacroSpiral
                themes={THEMES}
                levels={LEVELS}
                selectedId={theme || 'identity'}
                onSelect={setTheme}
                onUse={() => {}}
                hideUseCta
              />
            </div>
            <div className="lf-step-desc">
              <div className="lf-step-desc-head">
                <span className="lf-step-desc-tag">{themeFocus.num} · {themeFocus.name}</span>
                <span className="lf-step-desc-sub">{theme ? 'selected theme' : 'preview — tap a theme'}</span>
              </div>
              <p className="lf-step-desc-lead">{themeFocus.description}</p>
              <p className="lf-step-desc-why">
                <strong>Why this theme · </strong>{themeFocus.rationale}
              </p>
              {themeEvidence.length > 0 && (
                <details className="lf-step-sources">
                  <summary>Why this theme — the research <span aria-hidden>›</span></summary>
                  <EvidencePanel items={themeEvidence} context={themeFocus.name} />
                </details>
              )}
            </div>
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
            </div>
          )}

          <div className="lf-ornament">❦ ❦ ❦</div>
        </section>

        {/* PART 3 — MICRO */}
        <section id="micro" className="lf-section lf-reveal">
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

          <div className="lf-wizard-arc">
            <MicroArc
              phases={PHASES}
              selectedId={activePhase}
              onSelect={(id) => setActivePhase(id)}
              onUse={() => {}}
              hideUseCta
            />
          </div>

          <div className="lf-timeline" id="phase-timeline">
            <div className="lf-timeline-track" ref={timelineTrackRef}>
              {PHASES.map((phase) => {
                const Icon = phase.icon;
                return (
                  <button
                    key={phase.id}
                    id={`phase-${phase.id}`}
                    className={`lf-phase-btn ${activePhase === phase.id ? 'active' : ''} ${hasPhaseSelection(phase.id) ? 'has-selection' : ''}`}
                    onClick={() => goToPhase(phase.id)}
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
                    {(refsByPhase.get(phaseData.id) ?? []).length > 0 && (
                      <div className="lf-phase-xrefs">
                        <span className="lf-phase-xrefs-label">Research ·</span>
                        {(refsByPhase.get(phaseData.id) ?? []).map((gid) => (
                          <XRefPill
                            key={gid}
                            kind="section"
                            id="references"
                            label={refGroupName(gid)}
                            fromLabel={`Phase ${phaseData.id} · ${phaseData.name}`}
                            targetGroupId={gid}
                          />
                        ))}
                      </div>
                    )}
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
                    const numeral = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][i] || String(i + 1);
                    return (
                      <button
                        key={i}
                        className={`lf-activity-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => chooseActivity(phaseData.id, i)}
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
              </div>
            )}
          </div>

          <div className="lf-ornament">❦ ❦ ❦</div>
        </section>

        {/* PART 4 — COMPOSE */}
        <section id="compose" className="lf-section lf-compose lf-reveal">
          <div className="lf-section-header">
            <div className="lf-section-num">04</div>
            <div className="lf-section-title">
              <div className="lf-section-kicker">The composed lesson</div>
              <h2>Your lesson plan, <em>ready to teach.</em></h2>
              <p className="lf-section-desc">
                A live preview assembled from your selections — level and theme from macro, phase activities from
                micro. Each phase carries a concrete prompt from the library; click the pencil to edit. When ready,
                download a PDF or copy the plan as Markdown.
              </p>
            </div>
          </div>

          {!hasMacro && (
            <div className="lf-compose-empty">
              <strong>Nothing to compose yet</strong>
              Pick a <em>level</em> and a <em>theme</em> in macro, then choose an activity for each phase in micro.
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

              {/* TABS */}
              <div
                className="lf-compose-tabs"
                role="tablist"
                aria-label="Compose view"
                onKeyDown={(e) => {
                  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
                  e.preventDefault();
                  setComposeTab((t) => (t === 'plan' ? 'handout' : 'plan'));
                }}
              >
                <button
                  role="tab"
                  id="tab-plan"
                  aria-controls="panel-plan"
                  aria-selected={composeTab === 'plan'}
                  tabIndex={composeTab === 'plan' ? 0 : -1}
                  className={`lf-compose-tab ${composeTab === 'plan' ? 'is-active' : ''}`}
                  onClick={() => setComposeTab('plan')}
                >
                  Lesson plan
                </button>
                <button
                  role="tab"
                  id="tab-handout"
                  aria-controls="panel-handout"
                  aria-selected={composeTab === 'handout'}
                  tabIndex={composeTab === 'handout' ? 0 : -1}
                  className={`lf-compose-tab ${composeTab === 'handout' ? 'is-active' : ''}`}
                  onClick={() => setComposeTab('handout')}
                >
                  Student handout
                </button>
              </div>

              {/* LESSON PLAN */}
              {composeTab === 'plan' && (
                <div className="lf-compose-plan" id="panel-plan" role="tabpanel" aria-labelledby="tab-plan" tabIndex={-1}>
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
                            <label className="lf-compose-activity-swap-wrap" title="Swap activity">
                              <span className="lf-compose-activity-swap-label">Swap activity</span>
                              <select
                                className="lf-compose-activity-swap"
                                value={actIdx}
                                onChange={(e) => setPhaseActivity(phase.id, Number(e.target.value))}
                                aria-label="Swap activity"
                              >
                                {phase.activities.map((a, i) => (
                                  <option key={i} value={i}>{a.name}</option>
                                ))}
                              </select>
                            </label>
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
                                      aria-label="Reset prompt to library default"
                                    >
                                      <RotateCcw size={13} />
                                    </button>
                                  )}
                                  <button
                                    className="lf-icon-btn"
                                    onClick={() => startEdit(phase.id)}
                                    title="Edit prompt"
                                    aria-label="Edit prompt"
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
                                    aria-label="Cancel editing"
                                  >
                                    <X size={13} />
                                  </button>
                                  <button
                                    className="lf-icon-btn lf-icon-btn-primary"
                                    onClick={() => saveEdit(phase.id)}
                                    title="Save"
                                    aria-label="Save prompt"
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
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
                                  else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); saveEdit(phase.id); }
                                }}
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

                          <EvidenceDigest
                            items={evidenceItems}
                            renderRefLink={(item) =>
                              item.groupId ? (
                                <XRefPill
                                  kind="section"
                                  id="references"
                                  label={refGroupName(item.groupId)}
                                  fromLabel={`Compose · Phase ${phase.id} ${phase.name}`}
                                  targetGroupId={item.groupId}
                                />
                              ) : null
                            }
                          />

                          <div className="lf-compose-xrefs">
                            <span className="lf-compose-xrefs-label">Trace ·</span>
                            <XRefPill
                              kind="phase"
                              id={phase.id}
                              label={`Phase ${phase.id} in micro`}
                              fromLabel={`Compose · Phase ${phase.id} ${phase.name}`}
                            />
                            <XRefPill
                              kind="section"
                              id="macro"
                              label={`${themeData.name} in macro`}
                              fromLabel={`Compose · Phase ${phase.id} ${phase.name}`}
                            />
                          </div>

                          {(refsByPhase.get(phase.id) ?? []).length > 0 && (
                            <div className="lf-compose-xrefs">
                              <span className="lf-compose-xrefs-label">Research grounding ·</span>
                              {(refsByPhase.get(phase.id) ?? []).map((gid) => (
                                <XRefPill
                                  key={gid}
                                  kind="section"
                                  id="references"
                                  label={refGroupName(gid)}
                                  fromLabel={`Compose · Phase ${phase.id} ${phase.name}`}
                                  targetGroupId={gid}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* STUDENT HANDOUT */}
              {composeTab === 'handout' && (
                <div className="lf-handout" id="panel-handout" role="tabpanel" aria-labelledby="tab-handout" tabIndex={-1}>
                  <div className="lf-handout-header">
                    <div className="lf-handout-eyebrow">Student handout</div>
                    <h3 className="lf-handout-title">{themeData.name}</h3>
                    <div className="lf-handout-meta">
                      <span className="lf-handout-level">{level} · {levelData.name}</span>
                      <span className="lf-handout-sep">·</span>
                      <span className="lf-handout-date">Date: <span className="lf-handout-date-line">&nbsp;</span></span>
                      <span className="lf-handout-sep">·</span>
                      <span className="lf-handout-name">Name: <span className="lf-handout-date-line">&nbsp;</span></span>
                    </div>
                  </div>

                  <div className="lf-handout-cando-block">
                    <div className="lf-handout-cando-label">By the end of this lesson, you'll be able to</div>
                    <ul className="lf-handout-cando">
                      {macroCell.cando.map((c, i) => (
                        <li key={i}>{c.charAt(0).toUpperCase() + c.slice(1)}.</li>
                      ))}
                    </ul>
                  </div>

                  {PHASES.map((phase) => {
                    const actIdx = selectedActivityIdx(phase.id);
                    const activity = phase.activities[actIdx];
                    const task = getHandoutText(phase.id, actIdx);
                    const isEditingHandout = editingHandoutPhase === phase.id;
                    const isCustomHandout = selections.editedHandouts[phase.id] !== undefined;

                    return (
                      <div key={phase.id} className="lf-handout-phase">
                        <div className="lf-handout-phase-head">
                          <span className="lf-handout-phase-num">
                            {phase.id < 10 ? `0${phase.id}` : phase.id}
                          </span>
                          <div className="lf-handout-phase-titles">
                            <div className="lf-handout-phase-title">{phase.name}</div>
                            <div className="lf-handout-phase-activity">{activity.name}</div>
                          </div>
                          <div className="lf-handout-phase-time">{phase.defaultMin} min</div>
                        </div>
                        <div className="lf-handout-task-block">
                          <div className="lf-handout-task-label">
                            <span>Your task {isCustomHandout && <em className="lf-mono lf-custom-tag">· custom</em>}</span>
                            {!isEditingHandout ? (
                              <div className="lf-handout-task-actions">
                                {isCustomHandout && (
                                  <button
                                    className="lf-icon-btn"
                                    onClick={() => resetHandout(phase.id)}
                                    title="Reset to library default"
                                    aria-label="Reset task to library default"
                                  >
                                    <RotateCcw size={13} />
                                  </button>
                                )}
                                <button
                                  className="lf-icon-btn"
                                  onClick={() => startHandoutEdit(phase.id, actIdx)}
                                  title="Edit task"
                                  aria-label="Edit task"
                                >
                                  <Pencil size={13} />
                                </button>
                              </div>
                            ) : (
                              <div className="lf-handout-task-actions">
                                <button
                                  className="lf-icon-btn"
                                  onClick={cancelHandoutEdit}
                                  title="Cancel"
                                  aria-label="Cancel editing"
                                >
                                  <X size={13} />
                                </button>
                                <button
                                  className="lf-icon-btn lf-icon-btn-primary"
                                  onClick={() => saveHandoutEdit(phase.id)}
                                  title="Save"
                                  aria-label="Save task"
                                >
                                  <Check size={13} />
                                </button>
                              </div>
                            )}
                          </div>
                          {isEditingHandout ? (
                            <textarea
                              className="lf-handout-task-edit"
                              value={handoutDraftText}
                              onChange={(e) => setHandoutDraftText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') { e.preventDefault(); cancelHandoutEdit(); }
                                else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); saveHandoutEdit(phase.id); }
                              }}
                              autoFocus
                              rows={4}
                            />
                          ) : (
                            <div className="lf-handout-task">
                              {task || <em className="lf-handout-task-empty">Task to be added for this activity.</em>}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="lf-handout-footer">
                    {CREDIT_LINE} · {CREDIT_URL.replace('https://', '')}
                  </div>
                </div>
              )}

              {/* ACTION BAR */}
              <div className="lf-compose-actions-bar">
                <div className="lf-actions-spacer">
                  <span className="lf-compose-actions-note">
                    {allPhasesPicked
                      ? 'All seven phases set. Ready to export.'
                      : 'Tip: pick an activity for each phase in micro to lock the plan.'}
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
        <section id="principles" className="lf-principles lf-reveal">
          <div className="lf-principles-inner">
            <div className="lf-principles-tag">Three commitments</div>
            <h2>The framework <em>rests on</em> three commitments.</h2>

            <div className="lf-principles-list">
              <div className="lf-principle" id="principle-1">
                <h4>Informal input is curricular, not residual.</h4>
                <p>A lesson that ends without an informal-input bridge hasn't closed the loop the framework argues for. Phase 7 is non-optional.</p>
                <XRefPill kind="section" id="references" label="research · informal input" fromLabel="Principle: informal input" targetGroupId="input" />
              </div>
              <div className="lf-principle" id="principle-2">
                <h4>L1 is a resource, not a contaminant.</h4>
                <p>Strategic Portuguese in Phases 3 and 6 supports rather than undermines L2 acquisition. Translanguaging is permission, not problem.</p>
                <XRefPill kind="section" id="references" label="research · translanguaging" fromLabel="Principle: L1 as resource" targetGroupId="translanguaging" />
              </div>
              <div className="lf-principle" id="principle-3">
                <h4>Variability is the norm.</h4>
                <p>Complex Dynamic Systems Theory tells us learners don't progress linearly through the macro grid. The framework is a spiral, not a staircase.</p>
                <XRefPill kind="section" id="references" label="research · complex dynamic systems" fromLabel="Principle: variability" targetGroupId="cdst" />
              </div>
            </div>
          </div>
        </section>

        {/* PART 5 — REFERENCES */}
        <section id="references" className="lf-section lf-references lf-reveal">
          <div className="lf-section-header">
            <div className="lf-section-num">05</div>
            <div className="lf-section-title">
              <div className="lf-section-kicker">The research</div>
              <h2>Where each move <em>comes from.</em></h2>
              <p className="lf-section-desc">
                Each phase in the micro lesson is grounded in second language acquisition principles. Click an
                author or key term in this panel to jump to the bibliography, where you can trace the research
                and see exactly where it shows up in the EFL Lesson Framework.
              </p>
            </div>
          </div>

          <div className="lf-references-grid">
            {REFERENCE_GROUPS.map((group) => (
              <div key={group.id} id={`ref-${group.id}`} className="lf-ref-group">
                <div className="lf-ref-group-head">
                  <h3 className="lf-ref-group-name">{group.name}</h3>
                  <div className="lf-ref-group-anchor">
                    <span className="lf-ref-group-anchor-label">Jump to ·</span>
                    {group.anchors.map((a, i) => (
                      <XRefPill
                        key={`${a.kind}-${a.id}-${i}`}
                        kind={a.kind}
                        id={a.id}
                        label={anchorLabel(a)}
                        fromLabel={group.name}
                      />
                    ))}
                  </div>
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
          <a className="lf-footer-link" href={CREDIT_URL} target="_blank" rel="noopener noreferrer">
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
          <a className="lf-footer-link" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
            <Coffee size={12} /> Support the project
          </a>
          <a className="lf-footer-link" href={`mailto:${COMMERCIAL_CONTACT}`}>
            <Mail size={12} /> {COMMERCIAL_CONTACT}
          </a>
          <button
            type="button"
            className="lf-footer-link lf-footer-link-btn"
            onClick={goToManifesto}
          >
            <BookOpen size={12} /> Manifesto &amp; licence
          </button>

          <div className="lf-footer-line">
            © {new Date().getFullYear()} · Pedro Henrique Bahia Brito · Free for individual &amp; tuition-free use
            with attribution · Commercial licence required for tuition-charging schools.
          </div>
        </footer>

        {toast && (
          <div className="lf-toast" role="status">
            <Check size={14} /> {toast.label}
          </div>
        )}

        {step !== 'welcome' && navCfg && (
          <WizardNavBar back={navCfg.back} next={navCfg.next} helper={navCfg.helper} />
        )}
      </div>
    </XRefContext.Provider>
  );
}
