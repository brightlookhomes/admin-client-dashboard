import { Router } from "express";
import { getClientPortalBundle } from "../controllers/publicController.js";

const router = Router();

router.get("/projects/:projectId", getClientPortalBundle);

export default router;

