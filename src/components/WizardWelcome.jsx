import React from 'react';
import { Coffee, ExternalLink } from 'lucide-react';
import { CREDIT_LINE, CREDIT_URL, SUPPORT_URL } from '../data/credit.js';
import Manifesto from './Manifesto.jsx';
import LicenseNotice from './LicenseNotice.jsx';

// First-run orientation. A calm editorial welcome — reusing hero typography —
// that tells a teacher what the tool does. The single way to begin now lives in
// the nav ("Start planning"); the full manifesto and licence are folded directly
// into the homepage below, so newcomers can read the philosophy and terms without
// opening a modal. The nav/footer "Manifesto & licence" links scroll here.
function WizardWelcome() {
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

      {/* The framework's philosophy and dual licence, folded directly into the
          homepage. The nav and footer "Manifesto & licence" links scroll here. */}
      <section id="lf-home-manifesto" className="lf-home-manifesto" aria-label="Manifesto and licence">
        <Manifesto />
        <LicenseNotice />
      </section>

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
