import mongoose from "mongoose";

const updateSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    description: { type: String, trim: true },
    media: [
      {
        url: { type: String },
        publicId: { type: String },
      }
    ],
  },
  { timestamps: true }
);

const Update = mongoose.model("Update", updateSchema);

export default Update;

