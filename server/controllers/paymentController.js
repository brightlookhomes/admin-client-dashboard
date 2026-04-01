import Payment from "../models/Payment.js";
import { cacheDel } from "../utils/cache.js";

export async function createPayment(req, res) {
  try {
    const payment = await Payment.create(req.body);
    if (payment?.project) cacheDel(`clientPortal:${payment.project}`);
    res.status(201).json(payment);
  } catch (err) {
    console.error("Create payment error", err);
    res.status(400).json({ message: "Could not create payment." });
  }
}

export async function getPayments(req, res) {
  try {
    const query = {};
    if (req.query.projectId) {
      query.project = req.query.projectId;
    }
    const payments = await Payment.find(query).sort({ paidAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("List payments error", err);
    res.status(500).json({ message: "Could not fetch payments." });
  }
}

export async function getPaymentById(req, res) {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }
    res.json(payment);
  } catch (err) {
    console.error("Get payment error", err);
    res.status(500).json({ message: "Could not fetch payment." });
  }
}

export async function updatePayment(req, res) {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }
    if (payment?.project) cacheDel(`clientPortal:${payment.project}`);
    res.json(payment);
  } catch (err) {
    console.error("Update payment error", err);
    res.status(400).json({ message: "Could not update payment." });
  }
}

export async function deletePayment(req, res) {
  try {
    const existing = await Payment.findById(req.params.id);
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }
    if (existing?.project) cacheDel(`clientPortal:${existing.project}`);
    res.status(204).send();
  } catch (err) {
    console.error("Delete payment error", err);
    res.status(500).json({ message: "Could not delete payment." });
  }
}

