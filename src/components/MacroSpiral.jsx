import React from 'react';
import { ArrowDown } from 'lucide-react';
import { polar, annularSectorPath, archimedeanPath, LAYER_COLORS } from '../utils/geometry.js';

export default function MacroSpiral({ themes, levels, selectedId, onSelect, onUse }) {
  const cx = 250;
  const cy = 250;
  const rInner = 64;
  const rOuter = 218;
  const layerCount = levels.length; // 6 CEFR layers per wedge
  const radii = Array.from({ length: layerCount + 1 }, (_, i) =>
    rInner + ((rOuter - rInner) * i) / layerCount,
  );
  const selected = themes.find((t) => t.id === selectedId) || themes[0];

  const shortName = (name) => name.split(' & ')[0];

  const handleKey = (id) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="lf-spiral-wrap">
      <svg
        className="lf-spiral-svg"
        viewBox="0 0 500 500"
        role="img"
        aria-label="Macro grid — six themes as pizza wedges, each subdivided into six CEFR-level onion rings (A1 inner → C2 outer)"
      >
        {themes.map((theme, i) => {
          const startDeg = -90 + i * 60;
          const endDeg = startDeg + 60;
          const midDeg = startDeg + 30;
          const isSelected = theme.id === selected.id;
          const [labelX, labelY] = polar(cx, cy, rOuter - 13, midDeg);
          return (
            <g
              key={theme.id}
              className={`lf-spiral-wedge ${isSelected ? 'is-selected' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`Select theme: ${theme.name}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(theme.id)}
              onKeyDown={handleKey(theme.id)}
            >
              {radii.slice(0, -1).map((rIn, j) => {
                const rOut = radii[j + 1];
                const d = annularSectorPath(cx, cy, rIn, rOut, startDeg, endDeg);
                const style = { '--layer-index': j };
                if (isSelected) style.fill = LAYER_COLORS[j];
                return (
                  <path
                    key={j}
                    d={d}
                    className={`lf-spiral-layer ${isSelected ? 'is-selected' : ''}`}
                    style={style}
                  />
                );
              })}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className={`lf-spiral-label ${isSelected ? 'is-selected' : ''}`}
              >
                {shortName(theme.name)}
              </text>
            </g>
          );
        })}
        <path
          className="lf-spiral-spiral"
          d={archimedeanPath(cx, cy, rInner + 2, rOuter - 2, 6, 600)}
        />
      </svg>

      <div className="lf-spiral-description" aria-live="polite">
        <div className="lf-arc-desc-meta">
          <span>Theme {selected.num} of VI</span>
        </div>
        <h4 className="lf-arc-desc-name">{selected.name}</h4>
        <p className="lf-arc-desc-purpose">{selected.description}</p>
        <button
          type="button"
          className="lf-overview-cta"
          onClick={() => onUse(selected.id)}
          title={`Use ${selected.name} in macro`}
        >
          Use in macro <ArrowDown size={12} />
        </button>
      </div>
    </div>
  );
}
