import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { STEP_META, STEPPER_STEPS } from '../wizard/steps.js';

// The top progress stepper. Shows the four core steps, then a trailing "Start
// over" action (not a step — it clears the lesson and returns to step 1). Step
// states: current (wine), complete (gold tick), available (clickable), locked
// (greyed, not yet reachable).
function WizardStepper({ current, isComplete, canGoTo, onNavigate, onStartOver }) {
  return (
    <nav className="lf-wizard-stepper" aria-label="Lesson planning steps">
      <ol>
        {STEPPER_STEPS.map((id, i) => {
          const meta = STEP_META[id];
          const state =
            current === id
              ? 'current'
              : isComplete(id)
                ? 'complete'
                : canGoTo(id)
                  ? 'available'
                  : 'locked';
          const locked = state === 'locked';
          return (
            <li key={id} className={`lf-wizard-step-node is-${state}`}>
              <button
                type="button"
                onClick={() => !locked && onNavigate(id)}
                disabled={locked}
                aria-current={current === id ? 'step' : undefined}
                aria-disabled={locked || undefined}
              >
                <span className="lf-wizard-node-num">
                  {state === 'complete' ? <Check size={14} aria-hidden /> : i + 1}
                </span>
                <span className="lf-wizard-node-labels">
                  <span className="lf-wizard-node-label">{meta.label}</span>
                  <span className="lf-wizard-node-sub">{meta.sub}</span>
                </span>
              </button>
            </li>
          );
        })}
        {/* Trailing action — clears the lesson and restarts (sits where the old
            "research" node was). Not a step, so it carries no number/aria-current. */}
        {onStartOver && (
          <li className="lf-wizard-step-node lf-wizard-step-restart">
            <button type="button" onClick={onStartOver} title="Clear selections and start a new lesson">
              <span className="lf-wizard-node-num">
                <RotateCcw size={14} aria-hidden />
              </span>
              <span className="lf-wizard-node-labels">
                <span className="lf-wizard-node-label">Start over</span>
                <span className="lf-wizard-node-sub">new lesson</span>
              </span>
            </button>
          </li>
        )}
      </ol>
    </nav>
  );
}

export default React.memo(WizardStepper);
