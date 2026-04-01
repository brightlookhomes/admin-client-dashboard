import { v2 as cloudinary } from "cloudinary";

export async function uploadToCloudinary(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Ensure config is applied after dotenv.config() has run
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "brightlook",
      resource_type: "auto",
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      originalFilename: result.original_filename,
    });
  } catch (err) {
    console.error("DEBUG: Cloudinary upload error full structure:", err);
    res.status(500).json({ 
      message: "Upload failed.",
      error: err.message || "Internal server error"
    });
  }
}

