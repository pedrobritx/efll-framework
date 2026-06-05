import React from 'react';
import { useModal } from '../context/modal.js';
import Manifesto from './Manifesto.jsx';
import LicenseNotice from './LicenseNotice.jsx';

// Each step tile is clickable and opens a short "why this step" explainer, so a
// teacher can understand the rationale before committing. Copy is drawn from the
// framework's own language (CEFR spiral, six themes, seven-phase arc, export).
const STEPS = [
  {
    n: '1',
    label: 'Level',
    sub: 'A1 – C2',
    heading: 'Start from where learners actually are.',
    paras: [
      'CEFR level anchors the whole framework. The macro grid spirals each theme through six levels — A1 on the inner ring, C2 on the outer — so a theme is never "finished", it returns harder and richer.',
      'Choosing the level sets the planning emphasis: survival chunks and a lowered affective filter at A1; abstraction, register, and nuance by C1–C2.',
    ],
  },
  {
    n: '2',
    label: 'Theme',
    sub: 'six units',
    heading: 'Six durable themes, not a list of topics.',
    paras: [
      'The same six themes return at every level — food at A1 becomes food sustainability at B2 becomes the philosophy of food at C1. Spiralling, not stacking.',
      'Tasks tie English to who learners already are. Grounded in needs analysis and identity/investment research, a theme turns the language into access to identity and community, not a neutral subject.',
    ],
  },
  {
    n: '3',
    label: 'Build',
    sub: 'seven phases',
    heading: 'A seven-phase, sixty-minute arc.',
    paras: [
      'The micro lesson is grounded in second language acquisition research — from lowering the affective filter, through input, noticing, output and feedback, to an informal-input bridge that follows learners back to the screen.',
      'Phase 7 — the curricular handoff to informal digital input — is non-optional: a lesson that ends without it has not closed the loop the framework argues for.',
    ],
  },
  {
    n: '4',
    label: 'Your lesson',
    sub: 'export',
    heading: 'Take it to class.',
    paras: [
      'The composer assembles your choices into a complete 60-minute lesson plan and a ready-to-print student handout — every move still traceable to the citation underneath it.',
      'Export as a PDF or copy the handout, with the required attribution credit attached.',
    ],
  },
];

// First-run orientation. A calm editorial welcome that tells a teacher what the
// tool does; the one way to begin lives in the nav ("Start planning"). The full
// manifesto and licence are folded in below; the nav/footer "Manifesto & licence"
// links scroll to them.
function WizardWelcome() {
  const openModal = useModal();

  const openStep = (s) => openModal(
    (
      <div className="lf-modal-explainer">
        <h3>{s.heading}</h3>
        {s.paras.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    ),
    { title: `Step ${s.n} · ${s.label}` },
  );

  return (
    <div className="lf-welcome">
      <div className="lf-eyebrow">EFL Lesson Framework · A pedagogical framework for Brazilian EFL</div>
      <h1 className="lf-welcome-title">
        Plan an English lesson in <em>four steps</em>.
      </h1>
      <p className="lf-welcome-sub">
        Choose a level, choose a theme, then build a complete 60-minute lesson from
        research-grounded activities. Take it to class as a PDF or a student handout.
        Nothing to install, no account — your work stays on this device.
      </p>

      <ol className="lf-welcome-steps" aria-label="The four steps — tap any step to read why it exists">
        {STEPS.map((s) => (
          <li key={s.n}>
            <button type="button" className="lf-welcome-step" onClick={() => openStep(s)}>
              <span className="lf-welcome-step-num">{s.n}</span>
              <span className="lf-welcome-step-text">
                <strong>{s.label}</strong>
                <em>{s.sub}</em>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* The framework's philosophy and dual licence, folded directly into the
          homepage. The nav and footer "Manifesto & licence" links scroll here. */}
      <section id="lf-home-manifesto" className="lf-home-manifesto" aria-label="Manifesto and licence">
        <Manifesto />
        <LicenseNotice />
      </section>
    </div>
  );
}

export default React.memo(WizardWelcome);
