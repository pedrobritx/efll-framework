import React from 'react';
import { Mail, ExternalLink, Download } from 'lucide-react';
import { CREDIT_LINE, CREDIT_URL, COMMERCIAL_CONTACT } from '../data/credit.js';
import { downloadCreditImage } from '../utils/creditImage.js';

// In-app summary of the dual licence. Free for individuals and tuition-free
// institutions with attribution; tuition-charging private schools need a paid
// recurring commercial licence. Mirrors LICENSE.md — see it for the full terms.
function LicenseNotice() {
  return (
    <div className="lf-license">
      <div className="lf-license-kicker">Licence &amp; terms</div>
      <h3 className="lf-license-title">Free to teach with. Paid to sell with.</h3>

      <div className="lf-license-grid">
        <div className="lf-license-card">
          <div className="lf-license-card-tag">Free · with attribution</div>
          <p>
            Individual teachers and tutors, public schools, and any institution that charges
            students <strong>no tuition</strong> may use, adapt, and share lessons and handouts
            freely — as long as the credit below stays visible.
          </p>
        </div>
        <div className="lf-license-card">
          <div className="lf-license-card-tag">Commercial · licensed</div>
          <p>
            Tuition-charging private schools, franchises, and commercial course providers need a
            paid, recurring commercial licence before use. Pricing on request. Attribution still
            applies.
          </p>
        </div>
      </div>

      <div className="lf-license-credit">
        <span className="lf-license-credit-label">Required credit</span>
        <a href={CREDIT_URL} target="_blank" rel="noopener noreferrer">
          {CREDIT_LINE} <ExternalLink size={11} aria-hidden />
        </a>
        <button type="button" className="lf-license-credit-dl" onClick={downloadCreditImage}>
          <Download size={13} aria-hidden /> Download credit image (PNG)
        </button>
      </div>

      <div className="lf-license-links">
        <a className="lf-license-link" href={`mailto:${COMMERCIAL_CONTACT}`}>
          <Mail size={13} aria-hidden /> {COMMERCIAL_CONTACT} · commercial licensing
        </a>
      </div>

      <p className="lf-license-disclaimer">
        This is a plain-language summary of the project&rsquo;s own terms, provided as-is. It is not
        formal legal advice. See <code>LICENSE.md</code> in the repository for the full text.
      </p>
    </div>
  );
}

export default React.memo(LicenseNotice);
