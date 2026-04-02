import React, { useState } from "react";
import { toast } from "react-hot-toast";
import http from "../../api/http.js";
import ModalShell from "../common/ModalShell.jsx";

export default function AddPaymentModal({ projectId, onClose, onSaved }) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await http.post("/payments", {
        project: projectId,
        amount: Number(amount),
        title,
        paidAt: paymentDate ? new Date(paymentDate) : new Date()
      });
      toast.success("Payment added");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to add payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title="Add Payment" onClose={onClose}>
      <form className="projectModalForm" onSubmit={handleSubmit}>
        <div className="projectModalFieldGroup">
          <label className="projectModalLabel" htmlFor="paymentAmount">
            Amount (₹) <span className="projectModalAsterisk">*</span>
          </label>
          <div className="projectAmountInputGroup">
            <span className="projectAmountPrefix">₹</span>
            <input
              id="paymentAmount"
              className="projectModalInput projectModalInput--amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
              min={0}
            />
          </div>
        </div>

        <div className="projectModalFieldGroup">
          <label className="projectModalLabel" htmlFor="paymentTitle">
            Note / Description
          </label>
          <input
            id="paymentTitle"
            className="projectModalInput"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Foundation stage payment"
            autoComplete="off"
          />
        </div>

        <div className="projectModalFieldGroup">
          <label className="projectModalLabel" htmlFor="paymentDate">
            Date <span className="projectModalAsterisk">*</span>
          </label>
          <input
            id="paymentDate"
            className="projectModalInput"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
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
            {saving ? "Adding..." : "Add Payment"}
          </button>
        </footer>
      </form>
    </ModalShell>
  );
}
