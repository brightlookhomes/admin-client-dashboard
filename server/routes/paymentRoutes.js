import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  createPayment,
  deletePayment,
  getPaymentById,
  getPayments,
  updatePayment,
} from "../controllers/paymentController.js";

const router = Router();

router.use(requireAuth);

router.get("/", getPayments);
router.post("/", createPayment);
router.get("/:id", getPaymentById);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;

