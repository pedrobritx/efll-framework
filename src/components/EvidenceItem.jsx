import React from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';

export default function EvidenceItem({ item }) {
  return (
    <div className="lf-evidence-item">
      <div className="lf-evidence-source">
        <div className="lf-evidence-construct">{item.construct}</div>
        <div className="lf-evidence-citation">{item.citation}</div>
      </div>
      <div className="lf-evidence-notes">
        <p>
          <Lightbulb size={14} aria-hidden />
          <span>{item.implication}</span>
        </p>
        <p>
          <AlertTriangle size={14} aria-hidden />
          <span>{item.limitation}</span>
        </p>
      </div>
    </div>
  );
}
