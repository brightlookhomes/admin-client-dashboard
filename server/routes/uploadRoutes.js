import { Router } from "express";
import multer from "multer";
import requireAuth from "../middleware/requireAuth.js";
import { uploadToCloudinary } from "../controllers/uploadController.js";

const router = Router();
const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

router.post("/", requireAuth, upload.single("file"), uploadToCloudinary);

export default router;

