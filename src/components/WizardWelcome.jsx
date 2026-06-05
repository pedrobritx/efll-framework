import React from 'react';
import { ArrowRight, Eye, BookOpen, Coffee, ExternalLink } from 'lucide-react';
import { CREDIT_LINE, CREDIT_URL, SUPPORT_URL } from '../data/credit.js';

// First-run orientation. A calm editorial welcome — reusing hero typography —
// that tells a teacher what the tool does and gives one obvious way to begin,
// plus an instant "show me an example" so newcomers see the output immediately.
// A concise manifesto sits below; the full version opens via onManifesto.
function WizardWelcome({ onStart, onExample, onManifesto }) {
  const STEPS = [
    { n: '1', label: 'Level', sub: 'A1 – C2' },
    { n: '2', label: 'Theme', sub: 'six units' },
    { n: '3', label: 'Build', sub: 'seven phases' },
    { n: '4', label: 'Your lesson', sub: 'export' },
  ];
  return (
    <div className="lf-welcome">
      <div className="lf-eyebrow">EFLLF · A pedagogical framework for Brazilian EFL</div>
      <h1 className="lf-welcome-title">
        Plan an English lesson in <em>four steps</em>.
      </h1>
      <p className="lf-welcome-sub">
        Choose a level, choose a theme, then build a complete 60-minute lesson from
        research-grounded activities. Take it to class as a PDF or a student handout.
        Nothing to install, no account — your work stays on this device.
      </p>

      <ol className="lf-welcome-steps" aria-label="The four steps">
        {STEPS.map((s) => (
          <li key={s.n}>
            <span className="lf-welcome-step-num">{s.n}</span>
            <span className="lf-welcome-step-text">
              <strong>{s.label}</strong>
              <em>{s.sub}</em>
            </span>
          </li>
        ))}
      </ol>

      <div className="lf-welcome-actions">
        <button type="button" className="lf-btn lf-btn-primary" onClick={onStart}>
          Start planning <ArrowRight size={14} aria-hidden />
        </button>
        <button type="button" className="lf-btn lf-btn-secondary" onClick={onExample}>
          <Eye size={14} aria-hidden /> Show me an example lesson
        </button>
      </div>

      {/* Concise manifesto — the full version (with the two-layer diagrams and
          the licence) opens in an overlay via onManifesto. */}
      <div className="lf-welcome-manifesto">
        <p className="lf-welcome-manifesto-lead">
          <strong>Well-structured lessons, built from accurate, well-sourced research.</strong>{' '}
          A two-layer framework — a CEFR-anchored macro grid and a seven-phase micro lesson — where
          every level, theme, and activity is tied to a citation you can trace.
        </p>
        <button type="button" className="lf-welcome-manifesto-link" onClick={onManifesto}>
          <BookOpen size={13} aria-hidden /> Read the manifesto &amp; licence
        </button>
      </div>

      <div className="lf-welcome-foot">
        <a className="lf-welcome-foot-link" href={CREDIT_URL} target="_blank" rel="noopener noreferrer">
          {CREDIT_LINE} <ExternalLink size={11} aria-hidden />
        </a>
        <a className="lf-welcome-foot-link" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
          <Coffee size={12} aria-hidden /> Support the project
        </a>
      </div>
    </div>
  );
}

export default React.memo(WizardWelcome);
