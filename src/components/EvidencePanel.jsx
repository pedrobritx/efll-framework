import React from 'react';
import { BookOpen } from 'lucide-react';
import EvidenceItem from './EvidenceItem.jsx';

export default function EvidencePanel({ items, context }) {
  if (!items.length) return null;

  return (
    <aside className="lf-evidence-panel" aria-live="polite">
      <div className="lf-evidence-head">
        <div className="lf-evidence-kicker">
          <BookOpen size={14} aria-hidden />
          Live evidence layer
        </div>
        <div>
          <h4>Why this works</h4>
          <p>{context}</p>
        </div>
      </div>
      <div className="lf-evidence-list">
        {items.map((item) => (
          <EvidenceItem key={`${item.construct}-${item.citation}`} item={item} />
        ))}
      </div>
    </aside>
  );
}
