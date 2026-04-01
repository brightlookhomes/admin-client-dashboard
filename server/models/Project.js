import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
      index: true,
    },
    contractValue: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    overallProgress: { type: Number, default: 0, min: 0, max: 100 },
    shareToken: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;

