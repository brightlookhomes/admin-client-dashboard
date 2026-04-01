import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  createMilestone,
  deleteMilestone,
  getMilestoneById,
  getMilestones,
  updateMilestone,
} from "../controllers/milestoneController.js";

const router = Router();

router.use(requireAuth);

router.get("/", getMilestones);
router.post("/", createMilestone);
router.get("/:id", getMilestoneById);
router.put("/:id", updateMilestone);
router.delete("/:id", deleteMilestone);

export default router;

