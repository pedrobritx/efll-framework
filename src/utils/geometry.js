// ── Geometry helpers for the Part 01 diagrams ─────────────────────────────

/**
 * Convert polar coordinates (center, radius, angle in degrees) to [x, y].
 */
export const polar = (cx, cy, r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

/**
 * Build an SVG path string for an annular-sector (donut wedge).
 */
export const annularSectorPath = (cx, cy, rIn, rOut, startDeg, endDeg) => {
  const [x1o, y1o] = polar(cx, cy, rOut, startDeg);
  const [x2o, y2o] = polar(cx, cy, rOut, endDeg);
  const [x1i, y1i] = polar(cx, cy, rIn, startDeg);
  const [x2i, y2i] = polar(cx, cy, rIn, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return [
    `M ${x1o.toFixed(2)} ${y1o.toFixed(2)}`,
    `A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2o.toFixed(2)} ${y2o.toFixed(2)}`,
    `L ${x2i.toFixed(2)} ${y2i.toFixed(2)}`,
    `A ${rIn} ${rIn} 0 ${largeArc} 0 ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
    'Z',
  ].join(' ');
};

/**
 * Build an SVG polyline path for an Archimedean spiral (decorative).
 */
export const archimedeanPath = (cx, cy, rStart, rEnd, loops = 6, steps = 480) => {
  const totalAngle = loops * 2 * Math.PI;
  const b = (rEnd - rStart) / totalAngle;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * totalAngle;
    const r = rStart + b * t;
    const angle = t - Math.PI / 2; // start at 12 o'clock
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
};

/**
 * Wine → gold layer-color ramp (A1 inner → C2 outer).
 */
export const LAYER_COLORS = ['#722F37', '#8E4138', '#A85037', '#B8924A', '#C7A55D', '#D4B47A'];
