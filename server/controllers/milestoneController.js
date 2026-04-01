import Milestone from "../models/Milestone.js";
import { cacheDel } from "../utils/cache.js";

export async function createMilestone(req, res) {
  try {
    const milestone = await Milestone.create(req.body);
    if (milestone?.project) cacheDel(`clientPortal:${milestone.project}`);
    res.status(201).json(milestone);
  } catch (err) {
    console.error("Create milestone error", err);
    res.status(400).json({ message: "Could not create milestone." });
  }
}

export async function getMilestones(req, res) {
  try {
    const query = {};
    if (req.query.projectId) {
      query.project = req.query.projectId;
    }
    const milestones = await Milestone.find(query).sort({ expectedDate: 1 });
    res.json(milestones);
  } catch (err) {
    console.error("List milestones error", err);
    res.status(500).json({ message: "Could not fetch milestones." });
  }
}

export async function getMilestoneById(req, res) {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found." });
    }
    res.json(milestone);
  } catch (err) {
    console.error("Get milestone error", err);
    res.status(500).json({ message: "Could not fetch milestone." });
  }
}

export async function updateMilestone(req, res) {
  try {
    const milestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found." });
    }
    if (milestone?.project) cacheDel(`clientPortal:${milestone.project}`);
    res.json(milestone);
  } catch (err) {
    console.error("Update milestone error", err);
    res.status(400).json({ message: "Could not update milestone." });
  }
}

export async function deleteMilestone(req, res) {
  try {
    const existing = await Milestone.findById(req.params.id);
    const milestone = await Milestone.findByIdAndDelete(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found." });
    }
    if (existing?.project) cacheDel(`clientPortal:${existing.project}`);
    res.status(204).send();
  } catch (err) {
    console.error("Delete milestone error", err);
    res.status(500).json({ message: "Could not delete milestone." });
  }
}

