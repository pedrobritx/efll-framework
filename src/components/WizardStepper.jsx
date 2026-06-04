import React from 'react';
import { Check, BookOpen } from 'lucide-react';
import { STEP_META, STEPPER_STEPS } from '../wizard/steps.js';

// The top progress stepper. Shows the four core steps plus an optional trailing
// "research" node. States: current (wine), complete (gold tick), available
// (clickable), locked (greyed, not yet reachable).
function WizardStepper({ current, isComplete, canGoTo, onNavigate }) {
  return (
    <nav className="lf-wizard-stepper" aria-label="Lesson planning steps">
      <ol>
        {STEPPER_STEPS.map((id, i) => {
          const meta = STEP_META[id];
          const isOptional = id === 'learn';
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
            <li
              key={id}
              className={`lf-wizard-step-node is-${state} ${isOptional ? 'is-optional' : ''}`}
            >
              <button
                type="button"
                onClick={() => !locked && onNavigate(id)}
                disabled={locked}
                aria-current={current === id ? 'step' : undefined}
                aria-disabled={locked || undefined}
              >
                <span className="lf-wizard-node-num">
                  {isOptional ? (
                    <BookOpen size={14} aria-hidden />
                  ) : state === 'complete' ? (
                    <Check size={14} aria-hidden />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="lf-wizard-node-labels">
                  <span className="lf-wizard-node-label">{meta.label}</span>
                  <span className="lf-wizard-node-sub">{meta.sub}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default React.memo(WizardStepper);
