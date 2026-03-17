import mongoose from "mongoose";

const pullRequestSchema = new mongoose.Schema({
  repoName: String,
  title: String,
  description: String,
  sourceBranch: String,
  targetBranch: String,
  status: {
    type: String,
    default: "open"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("PullRequest", pullRequestSchema);