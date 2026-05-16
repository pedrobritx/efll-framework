import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
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
import { getHandout } from './data/handouts.js';
import { REFERENCE_GROUPS, refsForAnchor } from './data/references.js';
import { getEvidenceForSelection } from './data/evidence.js';

// ── Cross-reference plumbing ──────────────────────────────────────────────
// Lets a user jump from a reference to a concept (or vice-versa) and walk back.
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

function XRefBackPill() {
  const xref = useContext(XRefContext);
  if (!xref || xref.stack.length === 0) return null;
  const top = xref.stack[xref.stack.length - 1];
  return (
    <button
      type="button"
      className="lf-xref-back-pill"
      onClick={xref.popXref}
      title="Back to where you jumped from"
    >
      <ArrowLeft size={13} aria-hidden />
      <span>Back to <strong>{top.fromLabel}</strong></span>
    </button>
  );
}

const STORAGE_KEY = 'lf-selections';
const SCHEMA_VERSION = 1;

const defaultSelections = {
  schemaVersion: SCHEMA_VERSION,
  level: null,
  theme: null,
  phaseActivities: {}, // { [phaseId]: activityIndex }
  editedExamples: {},  // { [phaseId]: customString }
};

function loadSelections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSelections;
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== SCHEMA_VERSION) return defaultSelections;
    return { ...defaultSelections, ...parsed };
  } catch {
    return defaultSelections;
  }
}

function persistSelections(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* private-mode / quota — ignore */
  }
}

function EvidenceItem({ item }) {
  return (
    <div className="lf-evidence-item">
      <div className="lf-evidence-source">
        <div className="lf-evidence-construct">{item.construct}</div>
        <div className="lf-evidence-citation">{item.citation}</div>
      </div>
      <div className="lf-evidence-notes">
        <p>
          <Lightbulb size={14} aria-hidden />
          <span>{item.implication}</span>
        </p>
        <p>
          <AlertTriangle size={14} aria-hidden />
          <span>{item.limitation}</span>
        </p>
      </div>
    </div>
  );
}

function EvidencePanel({ items, context }) {
  if (!items.length) return null;

  return (
    <aside className="lf-evidence-panel" aria-live="polite">
      <div className="lf-evidence-head">
        <div className="lf-evidence-kicker">
          <BookOpen size={14} aria-hidden />
          Live evidence layer
        </div>
        <div>
          <h4>Why this works</h4>
          <p>{context}</p>
        </div>
      </div>
      <div className="lf-evidence-list">
        {items.map((item) => (
          <EvidenceItem key={`${item.construct}-${item.citation}`} item={item} />
        ))}
      </div>
    </aside>
  );
}

function EvidenceDigest({ items }) {
  const digestItems = items.slice(0, 2);
  if (!digestItems.length) return null;

  return (
    <div className="lf-compose-evidence">
      <div className="lf-compose-evidence-label">Evidence note</div>
      {digestItems.map((item) => (
        <div key={`${item.construct}-${item.citation}`} className="lf-compose-evidence-item">
          <strong>{item.construct}</strong>
          <span>{item.citation}</span>
          <p>{item.implication}</p>
          <p className="lf-compose-evidence-caveat">Caveat: {item.limitation}</p>
        </div>
      ))}
    </div>
  );
}

// ── Geometry helpers for the Part 01 diagrams ─────────────────────────────
const polar = (cx, cy, r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

// Annular-sector (donut wedge) path.
const annularSectorPath = (cx, cy, rIn, rOut, startDeg, endDeg) => {
  const [x1o, y1o] = polar(cx, cy, rOut, startDeg);
  const [x2o, y2o] = polar(cx, cy, rOut, endDeg);
  const [x1i, y1i] = polar(cx, cy, rIn, startDeg);
  const [x2i, y2i] = polar(cx, cy, rIn, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return [
    `M ${x1o.toFixed(2)} ${y1o.toFixed(2)}`,
    `A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2o.toFixed(2)} ${y2o.toFixed(2)}`,
    `L ${x2i.toFixed(2)} ${y2i.toFixed(2)}`,
    `A ${rIn} ${rIn} 0 ${largeArc} 0 ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
    'Z',
  ].join(' ');
};

// Archimedean spiral path (polyline) — decorative, threads through layers.
const archimedeanPath = (cx, cy, rStart, rEnd, loops = 6, steps = 480) => {
  const totalAngle = loops * 2 * Math.PI;
  const b = (rEnd - rStart) / totalAngle;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * totalAngle;
    const r = rStart + b * t;
    const angle = t - Math.PI / 2; // start at 12 o'clock
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
};

// Wine → gold layer-color ramp (A1 inner → C2 outer).
const LAYER_COLORS = ['#722F37', '#8E4138', '#A85037', '#B8924A', '#C7A55D', '#D4B47A'];

function MacroSpiral({ themes, levels, selectedId, onSelect, onUse }) {
  const cx = 250;
  const cy = 250;
  const rInner = 64;
  const rOuter = 218;
  const layerCount = levels.length; // 6 CEFR layers per wedge
  const radii = Array.from({ length: layerCount + 1 }, (_, i) =>
    rInner + ((rOuter - rInner) * i) / layerCount,
  );
  const selected = themes.find((t) => t.id === selectedId) || themes[0];

  const shortName = (name) => name.split(' & ')[0];

  const handleKey = (id) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="lf-spiral-wrap">
      <svg
        className="lf-spiral-svg"
        viewBox="0 0 500 500"
        role="img"
        aria-label="Macro grid — six themes as pizza wedges, each subdivided into six CEFR-level onion rings (A1 inner → C2 outer)"
      >
        {themes.map((theme, i) => {
          const startDeg = -90 + i * 60;
          const endDeg = startDeg + 60;
          const midDeg = startDeg + 30;
          const isSelected = theme.id === selected.id;
          const [labelX, labelY] = polar(cx, cy, rOuter - 13, midDeg);
          return (
            <g
              key={theme.id}
              className={`lf-spiral-wedge ${isSelected ? 'is-selected' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`Select theme: ${theme.name}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(theme.id)}
              onKeyDown={handleKey(theme.id)}
            >
              {radii.slice(0, -1).map((rIn, j) => {
                const rOut = radii[j + 1];
                const d = annularSectorPath(cx, cy, rIn, rOut, startDeg, endDeg);
                const style = { '--layer-index': j };
                if (isSelected) style.fill = LAYER_COLORS[j];
                return (
                  <path
                    key={j}
                    d={d}
                    className={`lf-spiral-layer ${isSelected ? 'is-selected' : ''}`}
                    style={style}
                  />
                );
              })}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className={`lf-spiral-label ${isSelected ? 'is-selected' : ''}`}
              >
                {shortName(theme.name)}
              </text>
            </g>
          );
        })}
        <path
          className="lf-spiral-spiral"
          d={archimedeanPath(cx, cy, rInner + 2, rOuter - 2, 6, 600)}
        />
      </svg>

      <div className="lf-spiral-description" aria-live="polite">
        <div className="lf-arc-desc-meta">
          <span>Theme {selected.num} of VI</span>
        </div>
        <h4 className="lf-arc-desc-name">{selected.name}</h4>
        <p className="lf-arc-desc-purpose">{selected.description}</p>
        <button
          type="button"
          className="lf-overview-cta"
          onClick={() => onUse(selected.id)}
          title={`Use ${selected.name} in macro`}
        >
          Use in macro <ArrowDown size={12} />
        </button>
      </div>
    </div>
  );
}

function MicroArc({ phases, selectedId, onSelect, onUse }) {
  const cx = 250;
  const cy = 250;
  const rInner = 192;
  const rOuter = 228;
  const totalMin = phases.reduce((s, p) => s + p.defaultMin, 0); // 60

  let acc = 0;
  const segments = phases.map((p) => {
    const startMin = acc;
    acc += p.defaultMin;
    const endMin = acc;
    const startDeg = -90 + (startMin / totalMin) * 360;
    const endDeg = -90 + (endMin / totalMin) * 360;
    const midDeg = (startDeg + endDeg) / 2;
    const [labelX, labelY] = polar(cx, cy, (rInner + rOuter) / 2, midDeg);
    return { ...p, startMin, endMin, startDeg, endDeg, labelX, labelY };
  });

  const selected = segments.find((s) => s.id === selectedId) || segments[0];

  const handleKey = (id) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="lf-arc-wrap">
      <svg
        className="lf-arc-svg"
        viewBox="0 0 500 500"
        role="img"
        aria-label="Micro template — seven phases as a clickable crust ring, each segment sized in proportion to its minute allocation across 60 minutes"
      >
        {/* Minute markers */}
        <text className="lf-arc-tick-label" x={cx} y={cy - rOuter - 18} textAnchor="middle">0 / 60'</text>
        <text className="lf-arc-tick-label" x={cx + rOuter + 22} y={cy + 4} textAnchor="middle">15'</text>
        <text className="lf-arc-tick-label" x={cx} y={cy + rOuter + 26} textAnchor="middle">30'</text>
        <text className="lf-arc-tick-label" x={cx - rOuter - 22} y={cy + 4} textAnchor="middle">45'</text>

        {/* Crust segments */}
        {segments.map((seg) => {
          const isSelected = seg.id === selected.id;
          const isPrior = seg.id < selected.id;
          const d = annularSectorPath(cx, cy, rInner, rOuter, seg.startDeg, seg.endDeg);
          const segClass = [
            'lf-arc-segment',
            isSelected ? 'is-selected' : '',
            isPrior ? 'is-prior' : '',
          ].filter(Boolean).join(' ');
          const labelClass = [
            'lf-arc-segment-label',
            isSelected ? 'is-selected' : '',
            isPrior ? 'is-prior' : '',
          ].filter(Boolean).join(' ');
          return (
            <g
              key={seg.id}
              className="lf-arc-segment-group"
              role="button"
              tabIndex={0}
              aria-label={`Select phase ${seg.id}: ${seg.name} — ${seg.defaultMin} minutes`}
              aria-pressed={isSelected}
              onClick={() => onSelect(seg.id)}
              onKeyDown={handleKey(seg.id)}
            >
              <path d={d} className={segClass} />
              <text
                x={seg.labelX}
                y={seg.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className={labelClass}
              >
                {seg.id}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="lf-arc-description" aria-live="polite">
        <div className="lf-arc-desc-meta">
          <span>Phase {selected.id} of 7</span>
          <span className="lf-arc-desc-time">· {selected.defaultMin} min · starts at {selected.startMin}'</span>
        </div>
        <h4 className="lf-arc-desc-name">{selected.name}</h4>
        <p className="lf-arc-desc-purpose">{selected.purpose}</p>
        <div className="lf-arc-desc-sla">
          <span className="lf-mono">SLA · </span>{selected.sla}
        </div>
        <button
          type="button"
          className="lf-overview-cta"
          onClick={() => onUse(selected.id)}
          title={`Use Phase ${selected.id} in micro`}
        >
          Use in micro <ArrowDown size={12} />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [selections, setSelections, defaultSelections] = useSelections();
  const [activeSection, setActiveSection] = useState('overview');
  const [activePhase, setActivePhase] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [draftText, setDraftText] = useState('');
  const [toast, setToast] = useState(null);
  // Which tab is active in Part 04 — view state only, not persisted.
  const [composeTab, setComposeTab] = useState('plan'); // 'plan' | 'handout'
  // Part 01 overview-local selections (independent of the global composer).
  const [overviewTheme, setOverviewTheme] = useState('identity');
  const [overviewPhase, setOverviewPhase] = useState(1);
  // Cross-reference jump history — pushed on jumpTo, popped on back-pill click.
  const [xrefStack, setXrefStack] = useState([]);
  // Transient highlight for a jump target (phase id, principle id, or ref group id).
  const [highlight, setHighlight] = useState(null); // { kind, id }

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

  const goToPhase = useCallback((id) => {
    setActivePhase(id);
    const el = document.getElementById('phase-timeline');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // ─── CROSS-REFERENCE JUMPS ───────────────────────────────────────────────
  const jumpTo = useCallback(({ kind, id, fromLabel, targetGroupId }) => {
    setXrefStack((s) => [
      ...s,
      { fromLabel, scrollY: window.scrollY, restorePhase: activePhase },
    ]);

    let targetEl = null;
    if (kind === 'phase') {
      setActivePhase(id);
      targetEl = document.getElementById('phase-timeline');
      setHighlight({ kind: 'phase', id });
    } else if (kind === 'principle') {
      targetEl = document.getElementById(`principle-${id}`);
      setHighlight({ kind: 'principle', id });
    } else if (kind === 'section') {
      const groupId = targetGroupId;
      targetEl = groupId
        ? document.getElementById(`ref-${groupId}`)
        : document.getElementById(id);
      if (groupId) setHighlight({ kind: 'ref', id: groupId });
    }
    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof window !== 'undefined') {
      window.setTimeout(() => setHighlight(null), 2200);
    }
  }, [activePhase]);

  const popXref = useCallback(() => {
    setXrefStack((s) => {
      if (!s.length) return s;
      const entry = s[s.length - 1];
      if (typeof entry.restorePhase === 'number') setActivePhase(entry.restorePhase);
      window.scrollTo({ top: entry.scrollY, behavior: 'smooth' });
      return s.slice(0, -1);
    });
  }, []);

  const xrefValue = useMemo(
    () => ({ stack: xrefStack, jumpTo, popXref }),
    [xrefStack, jumpTo, popXref],
  );

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
    setToast({ kind: 'ok', label: `${t?.name ?? 'Theme'} set in macro` });
    setTimeout(() => setToast(null), 2200);
    scrollTo('macro');
  };

  const usePhaseFromOverview = (phaseId) => {
    setActivePhase(phaseId);
    setToast({ kind: 'ok', label: `Phase ${phaseId} focused in micro` });
    setTimeout(() => setToast(null), 2200);
    scrollTo('micro');
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
      const task = getHandout(level, theme, phase.id, actIdx);
      md += `### Phase ${phase.id} — ${phase.name} (${phase.defaultMin} min)\n`;
      md += `**${activity.name}**\n\n`;
      md += `**Your task:** ${task}\n\n`;
    });
    md += `\n---\n*English with Pedro · lesson handout.*\n`;
    return md;
  };

  const handleCopyMarkdown = async () => {
    const md = composeTab === 'handout' ? buildHandoutMarkdown() : buildMarkdown();
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

  // ─── RENDER ─────────────────────────────────────────────────────────────
  return (
    <XRefContext.Provider value={xrefValue}>
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
              { id: 'overview', label: 'overview' },
              { id: 'macro', label: 'macro' },
              { id: 'micro', label: 'micro' },
              { id: 'compose', label: 'compose' },
              { id: 'references', label: 'references' },
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
              Continue to micro <ArrowDown size={12} />
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

        <div
          className={`lf-timeline ${highlight?.kind === 'phase' ? 'is-highlight' : ''}`}
          id="phase-timeline"
        >
          <div className="lf-timeline-track">
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
                  {refsForAnchor('phase', phaseData.id).length > 0 && (
                    <div className="lf-phase-xrefs">
                      <span className="lf-phase-xrefs-label">Research ·</span>
                      {refsForAnchor('phase', phaseData.id).map((gid) => (
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
                  onClick={() => goToPhase(phaseData.id + 1)}
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
            <div className="lf-compose-tabs" role="tablist" aria-label="Compose view">
              <button
                role="tab"
                aria-selected={composeTab === 'plan'}
                className={`lf-compose-tab ${composeTab === 'plan' ? 'is-active' : ''}`}
                onClick={() => setComposeTab('plan')}
              >
                Lesson plan
              </button>
              <button
                role="tab"
                aria-selected={composeTab === 'handout'}
                className={`lf-compose-tab ${composeTab === 'handout' ? 'is-active' : ''}`}
                onClick={() => setComposeTab('handout')}
              >
                Student handout
              </button>
            </div>

            {/* LESSON PLAN */}
            {composeTab === 'plan' && (
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

                      {refsForAnchor('phase', phase.id).length > 0 && (
                        <div className="lf-compose-xrefs">
                          <span className="lf-compose-xrefs-label">Research grounding ·</span>
                          {refsForAnchor('phase', phase.id).map((gid) => (
                            <XRefPill
                              key={gid}
                              kind="section"
                              id="references"
                              label={refGroupName(gid)}
                              fromLabel={`Phase ${phase.id} · ${phase.name}`}
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
            <div className="lf-handout">
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
                const task = getHandout(level, theme, phase.id, actIdx);

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
                      <div className="lf-handout-task-label">Your task</div>
                      <div className="lf-handout-task">
                        {task || <em className="lf-handout-task-empty">Task to be added for this activity.</em>}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="lf-handout-footer">
                English with Pedro · lesson handout
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
      <section className="lf-principles">
        <div className="lf-principles-inner">
          <div className="lf-principles-tag">Three commitments</div>
          <h2>The framework <em>rests on</em> three commitments.</h2>

          <div className="lf-principles-list">
            <div className={`lf-principle ${highlight?.kind === 'principle' && highlight.id === 1 ? 'is-highlight' : ''}`} id="principle-1">
              <h4>Informal input is curricular, not residual.</h4>
              <p>A lesson that ends without an informal-input bridge hasn't closed the loop the framework argues for. Phase 7 is non-optional.</p>
              <XRefPill kind="section" id="references" label="research · informal input" fromLabel="Principle: informal input" targetGroupId="input" />
            </div>
            <div className={`lf-principle ${highlight?.kind === 'principle' && highlight.id === 2 ? 'is-highlight' : ''}`} id="principle-2">
              <h4>L1 is a resource, not a contaminant.</h4>
              <p>Strategic Portuguese in Phases 3 and 6 supports rather than undermines L2 acquisition. Translanguaging is permission, not problem.</p>
              <XRefPill kind="section" id="references" label="research · translanguaging" fromLabel="Principle: L1 as resource" targetGroupId="translanguaging" />
            </div>
            <div className={`lf-principle ${highlight?.kind === 'principle' && highlight.id === 3 ? 'is-highlight' : ''}`} id="principle-3">
              <h4>Variability is the norm.</h4>
              <p>Complex Dynamic Systems Theory tells us learners don't progress linearly through the macro grid. The framework is a spiral, not a staircase.</p>
              <XRefPill kind="section" id="references" label="research · complex dynamic systems" fromLabel="Principle: variability" targetGroupId="cdst" />
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
            <div
              key={group.id}
              id={`ref-${group.id}`}
              className={`lf-ref-group ${highlight?.kind === 'ref' && highlight.id === group.id ? 'is-highlight' : ''}`}
            >
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

      <XRefBackPill />
    </div>
    </XRefContext.Provider>
  );
}
