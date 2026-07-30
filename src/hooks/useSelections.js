import { useState, useEffect } from 'react';

const STORAGE_KEY = 'lf-selections';
// Deliberately still 1 after adding `archetype`. `loadSelections` discards the
// entire payload on a version mismatch, so bumping this would wipe every saved
// lesson to introduce one optional field. The spread below already gives a
// pre-archetype payload the new default, which is what an additive field needs.
const SCHEMA_VERSION = 1;

const defaultSelections = {
  schemaVersion: SCHEMA_VERSION,
  level: null,
  theme: null,
  archetype: null,     // 1–8, or null for a standalone lesson (see data/archetypes.js)
  phaseActivities: {}, // { [phaseId]: activityIndex }
  editedExamples: {},  // { [phaseId]: customString }
  editedHandouts: {},  // { [phaseId]: customTaskString }
};

function loadSelections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSelections;
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== SCHEMA_VERSION) return defaultSelections;
    return { ...defaultSelections, ...parsed };
  } catch {
    return defaultSelections;
  }
}

function persistSelections(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* private-mode / quota — ignore */
  }
}

/**
 * Custom hook that manages the lesson-composer selections with
 * localStorage persistence.
 *
 * @returns {[Object, Function, Object]} [selections, setSelections, defaultSelections]
 */
export function useSelections() {
  const [selections, setSelections] = useState(loadSelections);

  useEffect(() => persistSelections(selections), [selections]);

  return [selections, setSelections, defaultSelections];
}
