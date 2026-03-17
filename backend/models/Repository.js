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