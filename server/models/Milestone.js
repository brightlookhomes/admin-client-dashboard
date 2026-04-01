import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    expectedDate: { type: Date },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Milestone = mongoose.model("Milestone", milestoneSchema);

export default Milestone;

