import React from 'react';

export default function EvidenceDigest({ items }) {
  const digestItems = items.slice(0, 2);
  if (!digestItems.length) return null;

  return (
    <div className="lf-compose-evidence">
      <div className="lf-compose-evidence-label">Evidence note</div>
      {digestItems.map((item) => (
        <div key={`${item.construct}-${item.citation}`} className="lf-compose-evidence-item">
          <strong>{item.construct}</strong>
          <span>{item.citation}</span>
          <p>{item.implication}</p>
          <p className="lf-compose-evidence-caveat">Caveat: {item.limitation}</p>
        </div>
      ))}
    </div>
  );
}
