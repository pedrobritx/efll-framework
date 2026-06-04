import { useState, useEffect, useRef } from 'react';

/**
 * Tracks which section is currently in view and returns its id, so the nav can
 * highlight the section you're actually reading (not just the last one clicked).
 *
 * Uses a single IntersectionObserver. The rootMargin shrinks the observation
 * band to roughly the upper-middle of the viewport — accounting for the sticky
 * nav — so a section becomes "active" as its heading crosses that line.
 *
 * @param {string[]} sectionIds  ids of the sections to observe, in document order
 * @param {Object}   [options]
 * @param {string}   [options.rootMargin]
 * @param {Function} [options.isPaused]  return true to suppress updates (e.g.
 *                                       during a click-driven smooth scroll)
 * @returns {string|null} the active section id
 */
export function useScrollSpy(sectionIds, { rootMargin = '-45% 0px -50% 0px', isPaused } = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);

  // Keep the latest isPaused in a ref so the observer effect doesn't re-run (and
  // tear down/rebuild the IntersectionObserver) on every render.
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const idsKey = sectionIds.join('|');

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const ids = idsKey.split('|').filter(Boolean);
    const visible = new Map(); // id -> boundingClientRect.top

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) visible.set(id, entry.boundingClientRect.top);
          else visible.delete(id);
        }

        const paused = isPausedRef.current;
        if (typeof paused === 'function' && paused()) return;
        if (visible.size === 0) return;

        // Of the sections crossing the band, pick the topmost (smallest |top|),
        // which is the one the reader is sitting on.
        let bestId = null;
        let bestTop = Infinity;
        for (const [id, top] of visible) {
          if (Math.abs(top) < bestTop) {
            bestTop = Math.abs(top);
            bestId = id;
          }
        }
        if (bestId) setActiveId(bestId);
      },
      { rootMargin, threshold: 0 },
    );

    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [idsKey, rootMargin]);

  return activeId;
}
