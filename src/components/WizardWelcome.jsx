import React from 'react';
import { ArrowRight, Eye, Compass } from 'lucide-react';

// First-run orientation. A calm editorial welcome — reusing hero typography —
// that tells a teacher what the tool does and gives one obvious way to begin,
// plus an instant "show me an example" so newcomers see the output immediately.
function WizardWelcome({ onStart, onExample, onExplore }) {
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

      <button type="button" className="lf-welcome-explore" onClick={onExplore}>
        <Compass size={13} aria-hidden /> Just exploring? Browse the full framework
      </button>
    </div>
  );
}

export default React.memo(WizardWelcome);
