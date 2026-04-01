import React from "react";

export default function ModalShell({ title, children, onClose }) {
  return (
    <div
      className="projectModalOverlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="projectModal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="projectModalHeader">
          <h2 className="projectModalTitle">{title}</h2>
          <button
            type="button"
            className="projectModalCloseButton"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
