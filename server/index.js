import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import updateRoutes from "./routes/updateRoutes.js";
import milestoneRoutes from "./routes/milestoneRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { seedAdminFromEnv } from "./utils/seedAdmin.js";
import publicRoutes from "./routes/publicRoutes.js";

const app = express();

// Enable Cross-Origin Resource Sharing for frontend dev.
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("Missing MONGODB_URI in environment (.env or .env.example).");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
    await seedAdminFromEnv();

    app.use("/api/auth", authRoutes);
    app.use("/api/projects", projectRoutes);
    app.use("/api/updates", updateRoutes);
    app.use("/api/milestones", milestoneRoutes);
    app.use("/api/payments", paymentRoutes);
    app.use("/api/uploads", uploadRoutes);
    app.use("/api/public", publicRoutes);

    // Static Frontend Files
    const clientDistPath = path.join(__dirname, "../client/dist");
    app.use(express.static(clientDistPath));

    app.get("*", (req, res) => {
      // Exclude API routes from catch-all for better debugging
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "API route not found" });
      }
      res.sendFile(path.join(clientDistPath, "index.html"));
    });

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

