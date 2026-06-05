import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Reusable accessible dialog used across the app (evidence, references, the
// homepage step explainers). Closes on Escape, backdrop click, and the X button;
// locks body scroll while open and restores focus to the trigger on close.
// Content is passed as children; an optional title renders a small kicker header.
function Modal({ open, onClose, title, children }) {
  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lastFocused.current = document.activeElement;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="lf-modal"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="lf-modal-panel">
        <button
          ref={closeRef}
          type="button"
          className="lf-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>
        {title && <div className="lf-modal-title">{title}</div>}
        <div className="lf-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
