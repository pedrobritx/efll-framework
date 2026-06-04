import React from 'react';
import { ArrowLeft, ArrowRight, Printer } from 'lucide-react';

// Persistent Back / Next bar pinned to the bottom of the viewport — the single,
// always-visible primary action so a teacher never has to hunt for "what next".
// `back` / `next` are { label, onClick, disabled?, icon? }; helper is an optional
// guiding line shown when the primary action is gated.
function WizardNavBar({ back, next, helper }) {
  if (!back && !next) return null;
  return (
    <div className="lf-wizard-navbar">
      <div className="lf-wizard-navbar-inner">
        {back ? (
          <button
            type="button"
            className="lf-btn lf-btn-ghost lf-wizard-back"
            onClick={back.onClick}
          >
            <ArrowLeft size={14} aria-hidden /> {back.label}
          </button>
        ) : (
          <span className="lf-wizard-navbar-spacer" />
        )}

        {helper && <span className="lf-wizard-help">{helper}</span>}

        {next ? (
          <button
            type="button"
            className="lf-btn lf-btn-primary lf-wizard-next"
            onClick={next.onClick}
            disabled={next.disabled}
          >
            {next.icon === 'printer' && <Printer size={14} aria-hidden />}
            {next.label}
            {next.icon !== 'printer' && <ArrowRight size={14} aria-hidden />}
          </button>
        ) : (
          <span className="lf-wizard-navbar-spacer" />
        )}
      </div>
    </div>
  );
}

export default React.memo(WizardNavBar);
