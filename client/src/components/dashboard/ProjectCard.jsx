import React from "react";

function formatCurrencyINR(value) {
  const n = Number(value || 0);
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function ProjectCard({ project, onOpen, onEdit, onDelete }) {
  return (
    <article className="projectCard" role="button" tabIndex={0} onClick={onOpen}>
      <header className="projectCardHeader">
        <div style={{ width: '100%', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <h3 className="projectName">{project.name}</h3>
            <span className="statusBadge">{project.status || "Active"}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span className="projectClientName" style={{ fontSize: '13px', color: 'var(--c-gray-700)', fontWeight: '500' }}>{project.clientName}</span>
            <span className="projectLocation" style={{ fontSize: '12px', color: '#9ca3af' }}>{project.location}</span>
          </div>
        </div>
      </header>

      <div className="projectProgress">
        <div className="projectProgressLabelRow">
          <span className="projectProgressLabel">Progress</span>
          <span className="projectProgressPercent">
            {project.overallProgress || 0}%
          </span>
        </div>
        <div className="projectProgressBarTrack">
          <div
            className="projectProgressBarFill"
            style={{ width: `${project.overallProgress || 0}%` }}
          />
        </div>
      </div>

      <footer className="projectMetaRow">
        <div className="projectMetaItem">
          <span className="projectMetaLabel">Received</span>
          <span className="projectMetaValue projectMetaValue--accent">
            {formatCurrencyINR(project.totalReceived)}
          </span>
        </div>
        <div className="projectMetaItem">
          <span className="projectMetaLabel">Updates</span>
          <span className="projectMetaValue">—</span>
        </div>
      </footer>

      <div className="projectCardActions" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="projectCardEdit" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="projectCardDelete" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}
