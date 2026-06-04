// ─── WIZARD STEP MODEL ───────────────────────────────────────────────────
// The guided flow shown to teachers. Steps map onto the existing scroll
// sections (kept mounted) so print/PDF and the cross-reference DOM stay valid.

export const STEP_IDS = ['welcome', 'level', 'theme', 'activities', 'compose', 'learn'];

// Plain, friendly labels with the framework's own vocabulary kept as a subtitle —
// approachable for newcomers while preserving the macro/micro identity.
export const STEP_META = {
  welcome: { label: 'Start here', sub: 'welcome' },
  level: { label: 'Choose level', sub: 'CEFR · A1–C2' },
  theme: { label: 'Choose theme', sub: 'macro · 6 units' },
  activities: { label: 'Build the lesson', sub: 'micro · 7 phases' },
  compose: { label: 'Your lesson', sub: 'compose · 60 min' },
  learn: { label: 'The research', sub: 'references' },
};

// Nodes rendered in the top stepper, in order. `learn` is an optional trailing
// node (rendered with a book glyph rather than a numeral).
export const STEPPER_STEPS = ['level', 'theme', 'activities', 'compose', 'learn'];

// CEFR ordering, low → high.
const ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const rank = (l) => ORDER.indexOf(l);

// Does an activity's `best` band (e.g. 'A2+', 'A1–B1', 'All', 'A1, complex forms')
// suit the chosen CEFR level? Used to pre-select a sensible default per phase.
export function bestMatchesLevel(best, level) {
  if (!best) return true;
  const lr = rank(level);
  if (lr < 0) return true;
  if (/all/i.test(best)) return true;
  const range = best.match(/([ABC][12])\s*[–-]\s*([ABC][12])/);
  if (range) return lr >= rank(range[1]) && lr <= rank(range[2]);
  const plus = best.match(/([ABC][12])\s*\+/);
  if (plus) return lr >= rank(plus[1]);
  const bare = best.match(/([ABC][12])/);
  if (bare) return lr >= rank(bare[1]);
  return true;
}

// The recommended activity index for a phase at a given level: the first
// activity whose band suits the level, else the first activity.
export function defaultActivityIdxFor(phase, level) {
  if (!phase || !level) return 0;
  const idx = phase.activities.findIndex((a) => bestMatchesLevel(a.best, level));
  return idx >= 0 ? idx : 0;
}
