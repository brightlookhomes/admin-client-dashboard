import Update from "../models/Update.js";
import { cacheDel } from "../utils/cache.js";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary just in case (ensure env is loaded)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createUpdate(req, res) {
  try {
    const update = await Update.create(req.body);
    if (update?.project) cacheDel(`clientPortal:${update.project}`);
    res.status(201).json(update);
  } catch (err) {
    console.error("Create update error", err);
    res.status(400).json({ message: "Could not create update." });
  }
}

export async function getUpdates(req, res) {
  try {
    const query = {};
    if (req.query.projectId) {
      query.project = req.query.projectId;
    }
    const updates = await Update.find(query).sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    console.error("List updates error", err);
    res.status(500).json({ message: "Could not fetch updates." });
  }
}

export async function getUpdateById(req, res) {
  try {
    const update = await Update.findById(req.params.id);
    if (!update) {
      return res.status(404).json({ message: "Update not found." });
    }
    res.json(update);
  } catch (err) {
    console.error("Get update error", err);
    res.status(500).json({ message: "Could not fetch update." });
  }
}

export async function updateUpdate(req, res) {
  try {
    const update = await Update.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!update) {
      return res.status(404).json({ message: "Update not found." });
    }
    if (update?.project) cacheDel(`clientPortal:${update.project}`);
    res.json(update);
  } catch (err) {
    console.error("Update update error", err);
    res.status(400).json({ message: "Could not update update." });
  }
}

export async function deleteUpdate(req, res) {
  try {
    const update = await Update.findById(req.params.id);
    if (!update) {
      return res.status(404).json({ message: "Update not found." });
    }

    // Cleanup Cloudinary
    if (update.media?.length > 0) {
      for (const item of update.media) {
        if (item.publicId) {
          const isVideo = item.url.toLowerCase().match(/\.(mp4|mov|webm|ogv)$/) || item.url.includes("/video/upload/");
          await cloudinary.uploader.destroy(item.publicId, {
            resource_type: isVideo ? "video" : "image"
          });
        }
      }
    }

    await Update.findByIdAndDelete(req.params.id);
    if (update?.project) cacheDel(`clientPortal:${update.project}`);

    res.status(204).send();
  } catch (err) {
    console.error("Delete update error", err);
    res.status(500).json({ message: "Could not delete update." });
  }
}

