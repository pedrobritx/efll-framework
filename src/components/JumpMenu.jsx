import React, { useState, useRef, useEffect, useId } from 'react';
import { List, X } from 'lucide-react';

/**
 * Compact "jump to section" menu for small screens. Complements (never replaces)
 * the top nav strip. Lives bottom-left so it stays clear of the back-to-top and
 * xref back-pill in the bottom-right corner.
 *
 * @param {Array<{id:string, num:string, label:string}>} sections
 * @param {string}   activeId   currently-viewed section (from scroll-spy)
 * @param {Function} onJump     called with a section id; should scroll to it
 */
export default function JumpMenu({ sections, activeId, onJump }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);
  const menuId = useId();

  // Close on Escape (returning focus to the toggle) and on outside click.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const handleJump = (id) => {
    onJump(id);
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <div className="lf-jump" ref={rootRef}>
      {open && (
        <nav className="lf-jump-popover" id={menuId} aria-label="Jump to section">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              className="lf-jump-item"
              aria-current={activeId === s.id ? 'true' : undefined}
              onClick={() => handleJump(s.id)}
            >
              <span className="lf-jump-item-num" aria-hidden>{s.num}</span>
              <span className="lf-jump-item-label">{s.label}</span>
            </button>
          ))}
        </nav>
      )}
      <button
        type="button"
        className="lf-jump-toggle"
        ref={toggleRef}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={open ? 'Close section menu' : 'Jump to section'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={15} aria-hidden /> : <List size={15} aria-hidden />}
        <span>{open ? 'Close' : 'Sections'}</span>
      </button>
    </div>
  );
}
