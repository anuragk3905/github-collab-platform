import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  role: {
    type: String,
    enum: ["owner", "collaborator", "viewer"],
    default: "viewer",
  },
});

const repositorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Repository name must be at least 3 characters long"],
      maxlength: [60, "Repository name must be at most 60 characters long"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [collaboratorSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Repository", repositorySchema);