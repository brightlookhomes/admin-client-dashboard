import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export async function seedAdminFromEnv() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const existingCount = await Admin.countDocuments();
  if (existingCount > 0) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({
    email: email.toLowerCase().trim(),
    passwordHash,
    name: "Admin",
  });

  console.log("Seeded initial admin from env");
}

