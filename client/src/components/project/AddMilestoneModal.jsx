import React, { useState } from "react";
import { toast } from "react-hot-toast";
import http from "../../api/http.js";
import ModalShell from "../common/ModalShell.jsx";

export default function AddMilestoneModal({ projectId, onClose, onSaved }) {
  const [milestoneName, setMilestoneName] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await http.post("/milestones", {
        project: projectId,
        name: milestoneName,
        expectedDate: expectedDate ? new Date(expectedDate) : null
      });
      toast.success("Milestone added");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to add milestone");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title="Add Milestone" onClose={onClose}>
      <form className="projectModalForm" onSubmit={handleSubmit}>
        <div className="projectModalFieldGroup">
          <label className="projectModalLabel" htmlFor="milestoneName">
            Milestone Name <span className="projectModalAsterisk">*</span>
          </label>
          <input
            id="milestoneName"
            className="projectModalInput"
            type="text"
            value={milestoneName}
            onChange={(e) => setMilestoneName(e.target.value)}
            placeholder="e.g., Foundation"
            required
          />
        </div>

        <div className="projectModalFieldGroup">
          <label className="projectModalLabel" htmlFor="expectedDate">
            Expected Date
          </label>
          <input
            id="expectedDate"
            className="projectModalInput"
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
          />
        </div>

        <footer className="projectModalFooter projectModalFooter--right">
          <button
            type="button"
            className="projectModalSecondaryButton"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="projectModalPrimaryButton" disabled={saving}>
             {saving ? "Adding..." : "Add Milestone"}
          </button>
        </footer>
      </form>
    </ModalShell>
  );
}
