import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  createUpdate,
  deleteUpdate,
  getUpdateById,
  getUpdates,
  updateUpdate,
} from "../controllers/updateController.js";

const router = Router();

router.use(requireAuth);

router.get("/", getUpdates);
router.post("/", createUpdate);
router.get("/:id", getUpdateById);
router.put("/:id", updateUpdate);
router.delete("/:id", deleteUpdate);

export default router;

