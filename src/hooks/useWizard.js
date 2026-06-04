import { useState, useEffect } from 'react';

// Wizard view-state lives under its own localStorage key so the lesson schema
// (`lf-selections`, schemaVersion 1) is never touched — zero migration risk to
// teachers' saved lessons. Returning users resume on their last step.
const STORAGE_KEY = 'lf-wizard';

const defaultWizard = {
  mode: 'wizard', // 'wizard' | 'explore'
  step: 'welcome',
  seenWelcome: false,
};

function loadWizard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultWizard;
    return { ...defaultWizard, ...JSON.parse(raw) };
  } catch {
    return defaultWizard;
  }
}

function persistWizard(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* private-mode / quota — ignore */
  }
}

/**
 * Owns the guided-wizard view state (current step, mode, first-run flag) with
 * its own localStorage persistence. Step gating/validation stays in App, where
 * the lesson selections live.
 */
export function useWizard() {
  const [state, setState] = useState(loadWizard);

  useEffect(() => persistWizard(state), [state]);

  const setMode = (mode) => setState((s) => ({ ...s, mode }));
  const setStep = (step) => setState((s) => ({ ...s, step }));
  const markSeenWelcome = () => setState((s) => ({ ...s, seenWelcome: true }));

  return { ...state, setMode, setStep, markSeenWelcome };
}
