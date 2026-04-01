import React, { useState } from "react";
import { toast } from "react-hot-toast";
import http from "../../api/http.js";

export default function ProjectFormModal({ onClose, onSaved, initial }) {
  const isEditing = Boolean(initial?._id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    name: initial?.name || "",
    clientName: initial?.clientName || "",
    phone: initial?.phone || "",
    location: initial?.location || "",
    contractValue: initial?.contractValue ?? "",
    startDate: initial?.startDate ? String(initial.startDate).slice(0, 10) : "",
    endDate: initial?.endDate ? String(initial.endDate).slice(0, 10) : "",
    status: initial?.status || "Active",
    overallProgress: initial?.overallProgress ?? 0,
  }));

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="modalBackdrop">
      <div className="modal">
        <header className="modalHeader">
          <h2 className="modalTitle">{isEditing ? "Edit Project" : "New Project"}</h2>
          <button
            type="button"
            className="modalCloseButton"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <form
          className="modalForm"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setSaving(true);
              const payload = {
                name: form.name,
                clientName: form.clientName,
                phone: form.phone,
                location: form.location,
                contractValue: Number(form.contractValue || 0),
                startDate: form.startDate ? new Date(form.startDate) : null,
                endDate: form.endDate ? new Date(form.endDate) : null,
                status: form.status,
                overallProgress: Number(form.overallProgress || 0),
              };
              if (isEditing) {
                await http.put(`/projects/${initial._id}`, payload);
                toast.success("Project updated");
              } else {
                await http.post("/projects", payload);
                toast.success("Project created");
              }
              onSaved();
            } catch {
              toast.error("Failed to save project");
            } finally {
              setSaving(false);
            }
          }}
        >
          <div className="modalFieldGroup">
            <label className="modalLabel" htmlFor="projectName">
              Project Name
            </label>
            <input
              id="projectName"
              className="modalInput"
              type="text"
              placeholder="Enter project name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
            />
          </div>

          <div className="modalFieldGrid">
            <div className="modalFieldGroup">
              <label className="modalLabel" htmlFor="clientName">
                Client Name
              </label>
              <input
                id="clientName"
                className="modalInput"
                type="text"
                placeholder="Enter client name"
                value={form.clientName}
                onChange={(e) => setField("clientName", e.target.value)}
                required
              />
            </div>
            <div className="modalFieldGroup">
              <label className="modalLabel" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                className="modalInput"
                type="tel"
                placeholder="Enter phone"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="modalFieldGroup">
            <label className="modalLabel" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              className="modalInput"
              type="text"
              placeholder="City"
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
            />
          </div>

          <div className="modalFieldGrid">
            <div className="modalFieldGroup">
              <label className="modalLabel" htmlFor="contractValue">
                Contract Value
              </label>
              <input
                id="contractValue"
                className="modalInput"
                type="number"
                placeholder="Amount"
                value={form.contractValue}
                onChange={(e) => setField("contractValue", e.target.value)}
                min={0}
              />
            </div>
            <div className="modalFieldGroup">
              <label className="modalLabel" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="modalInput"
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="modalFieldGroup">
            <label className="modalLabel" htmlFor="overallProgress">
              Overall Progress (%)
            </label>
            <input
              id="overallProgress"
              className="modalInput"
              type="number"
              placeholder="0"
              value={form.overallProgress}
              onChange={(e) => setField("overallProgress", e.target.value)}
              min={0}
              max={100}
            />
          </div>

          <div className="modalFieldGrid">
            <div className="modalFieldGroup">
              <label className="modalLabel" htmlFor="startDate">
                Start Date
              </label>
              <input
                id="startDate"
                className="modalInput"
                type="date"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
              />
            </div>
            <div className="modalFieldGroup">
              <label className="modalLabel" htmlFor="endDate">
                End Date
              </label>
              <input
                id="endDate"
                className="modalInput"
                type="date"
                value={form.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
              />
            </div>
          </div>

          <footer className="modalFooter">
            <button
              type="button"
              className="modalSecondaryButton"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="modalPrimaryButton" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
