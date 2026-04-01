import Project from "../models/Project.js";
import Update from "../models/Update.js";
import Milestone from "../models/Milestone.js";
import Payment from "../models/Payment.js";
import { cacheGet, cacheSet } from "../utils/cache.js";

const TTL_MS = 15_000;

export async function getClientPortalBundle(req, res) {
  try {
    const { projectId } = req.params;
    const cacheKey = `clientPortal:${projectId}`;

    const cached = cacheGet(cacheKey);
    if (cached) {
      res.set("Cache-Control", "public, max-age=10");
      return res.json(cached);
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found." });

    const [updates, milestones, payments] = await Promise.all([
      Update.find({ project: projectId }).sort({ createdAt: -1 }),
      Milestone.find({ project: projectId }).sort({ expectedDate: 1 }),
      Payment.find({ project: projectId }).sort({ paidAt: -1 }),
    ]);

    const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const payload = {
      project,
      updates,
      milestones,
      payments,
      totals: {
        totalReceived,
      },
    };

    cacheSet(cacheKey, payload, TTL_MS);
    res.set("Cache-Control", "public, max-age=10");
    res.json(payload);
  } catch (err) {
    console.error("Client portal bundle error", err);
    res.status(500).json({ message: "Could not load project bundle." });
  }
}

