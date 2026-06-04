import React from 'react';

/**
 * Hairline reading-progress indicator pinned to the very top edge, above the nav.
 * `progress` is a 0–1 fraction computed from the shared scroll listener in App.
 */
export default function ProgressBar({ progress = 0 }) {
  const pct = Math.round(progress * 100);
  return (
    <div
      className="lf-progress"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="lf-progress-fill" style={{ '--lf-progress': progress }} />
    </div>
  );
}
