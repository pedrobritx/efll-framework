import React from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollBehavior } from '../hooks/useReducedMotion.js';

/**
 * Floating "back to top" control. Rendered only once the page is scrolled deep
 * (gated by the caller). When the xref back-pill is showing, `raised` lifts this
 * above it so the two fixed controls never overlap.
 */
export default function BackToTop({ visible, raised }) {
  if (!visible) return null;
  return (
    <button
      type="button"
      className={`lf-backtotop${raised ? ' is-raised' : ''}`}
      aria-label="Back to top"
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
    >
      <ArrowUp size={18} aria-hidden />
    </button>
  );
}
