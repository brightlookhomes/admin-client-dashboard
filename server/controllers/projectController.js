import Project from "../models/Project.js";
import Payment from "../models/Payment.js";
import Update from "../models/Update.js";
import Milestone from "../models/Milestone.js";
import { cacheDel } from "../utils/cache.js";
import { v2 as cloudinary } from "cloudinary";

export async function createProject(req, res) {
  try {
    const project = await Project.create(req.body);
    cacheDel(`clientPortal:${project._id}`);
    res.status(201).json(project);
  } catch (err) {
    console.error("Create project error", err);
    res.status(400).json({ message: "Could not create project." });
  }
}

export async function getProjects(_req, res) {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    const projectIds = projects.map((p) => p._id);
    const revenueByProject = await Payment.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: "$project", total: { $sum: "$amount" } } },
    ]);
    const revenueMap = new Map(
      revenueByProject.map((r) => [String(r._id), r.total])
    );

    res.json(
      projects.map((p) => ({
        ...p.toObject(),
        totalReceived: revenueMap.get(String(p._id)) ?? 0,
      }))
    );
  } catch (err) {
    console.error("List projects error", err);
    res.status(500).json({ message: "Could not fetch projects." });
  }
}

export async function getProjectById(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    res.json(project);
  } catch (err) {
    console.error("Get project error", err);
    res.status(500).json({ message: "Could not fetch project." });
  }
}

export async function updateProject(req, res) {
  try {
    const updateData = { ...req.body };
    if (updateData.overallProgress !== undefined) {
      if (Number(updateData.overallProgress) >= 100) {
        updateData.status = "Completed";
      } else {
        updateData.status = "Active";
      }
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    cacheDel(`clientPortal:${project._id}`);
    res.json(project);
  } catch (err) {
    console.error("Update project error", err);
    res.status(400).json({ message: "Could not update project." });
  }
}

export async function deleteProject(req, res) {
  try {
    // Ensure config is applied after dotenv.config() has run
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // 1. Fetch all updates to find their media publicIds
    const updates = await Update.find({ project: projectId });
    for (const update of updates) {
      if (update.media?.length > 0) {
        for (const item of update.media) {
          try {
            if (item && item.publicId && item.url) {
              const urlStr = String(item.url);
              const isVideo = urlStr.toLowerCase().match(/\.(mp4|mov|webm|ogv)$/) || urlStr.includes("/video/upload/");
              await cloudinary.uploader.destroy(item.publicId, {
                resource_type: isVideo ? "video" : "image"
              });
            }
          } catch (cloudErr) {
            console.error("Failed to delete media from Cloudinary during cascade:", cloudErr);
          }
        }
      }
    }

    // 2. Cascade delete related documents
    await Update.deleteMany({ project: projectId });
    await Milestone.deleteMany({ project: projectId });
    await Payment.deleteMany({ project: projectId });

    // 3. Delete the project itself
    await Project.findByIdAndDelete(projectId);

    cacheDel(`clientPortal:${projectId}`);
    res.status(204).send();
  } catch (err) {
    console.error("Delete project error", err);
    res.status(500).json({ message: "Could not delete project." });
  }
}
