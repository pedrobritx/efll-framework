import React from 'react';
import { ArrowDown } from 'lucide-react';
import { polar, annularSectorPath } from '../utils/geometry.js';

export default function MicroArc({ phases, selectedId, onSelect, onUse }) {
  const cx = 250;
  const cy = 250;
  const rInner = 192;
  const rOuter = 228;
  const totalMin = phases.reduce((s, p) => s + p.defaultMin, 0); // 60

  let acc = 0;
  const segments = phases.map((p) => {
    const startMin = acc;
    acc += p.defaultMin;
    const endMin = acc;
    const startDeg = -90 + (startMin / totalMin) * 360;
    const endDeg = -90 + (endMin / totalMin) * 360;
    const midDeg = (startDeg + endDeg) / 2;
    const [labelX, labelY] = polar(cx, cy, (rInner + rOuter) / 2, midDeg);
    return { ...p, startMin, endMin, startDeg, endDeg, labelX, labelY };
  });

  const selected = segments.find((s) => s.id === selectedId) || segments[0];

  const handleKey = (id) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="lf-arc-wrap">
      <svg
        className="lf-arc-svg"
        viewBox="0 0 500 500"
        role="img"
        aria-label="Micro template — seven phases as a clickable crust ring, each segment sized in proportion to its minute allocation across 60 minutes"
      >
        {/* Minute markers */}
        <text className="lf-arc-tick-label" x={cx} y={cy - rOuter - 18} textAnchor="middle">0 / 60'</text>
        <text className="lf-arc-tick-label" x={cx + rOuter + 22} y={cy + 4} textAnchor="middle">15'</text>
        <text className="lf-arc-tick-label" x={cx} y={cy + rOuter + 26} textAnchor="middle">30'</text>
        <text className="lf-arc-tick-label" x={cx - rOuter - 22} y={cy + 4} textAnchor="middle">45'</text>

        {/* Crust segments */}
        {segments.map((seg) => {
          const isSelected = seg.id === selected.id;
          const isPrior = seg.id < selected.id;
          const d = annularSectorPath(cx, cy, rInner, rOuter, seg.startDeg, seg.endDeg);
          const segClass = [
            'lf-arc-segment',
            isSelected ? 'is-selected' : '',
            isPrior ? 'is-prior' : '',
          ].filter(Boolean).join(' ');
          const labelClass = [
            'lf-arc-segment-label',
            isSelected ? 'is-selected' : '',
            isPrior ? 'is-prior' : '',
          ].filter(Boolean).join(' ');
          return (
            <g
              key={seg.id}
              className="lf-arc-segment-group"
              role="button"
              tabIndex={0}
              aria-label={`Select phase ${seg.id}: ${seg.name} — ${seg.defaultMin} minutes`}
              aria-pressed={isSelected}
              onClick={() => onSelect(seg.id)}
              onKeyDown={handleKey(seg.id)}
            >
              <path d={d} className={segClass} />
              <text
                x={seg.labelX}
                y={seg.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className={labelClass}
              >
                {seg.id}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="lf-arc-description" aria-live="polite">
        <div className="lf-arc-desc-meta">
          <span>Phase {selected.id} of 7</span>
          <span className="lf-arc-desc-time">· {selected.defaultMin} min · starts at {selected.startMin}'</span>
        </div>
        <h4 className="lf-arc-desc-name">{selected.name}</h4>
        <p className="lf-arc-desc-purpose">{selected.purpose}</p>
        <div className="lf-arc-desc-sla">
          <span className="lf-mono">SLA · </span>{selected.sla}
        </div>
        <button
          type="button"
          className="lf-overview-cta"
          onClick={() => onUse(selected.id)}
          title={`Continue to Part 03 with Phase ${selected.id}`}
        >
          Continue to Part 03 <ArrowDown size={12} />
        </button>
      </div>
    </div>
  );
}
