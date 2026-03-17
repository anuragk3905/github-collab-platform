import mongoose from "mongoose";

const reviewCommentSchema = new mongoose.Schema({

  prId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PullRequest",
    required: true
  },

  filePath: String,

  lineNumber: Number,

  comment: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("ReviewComment", reviewCommentSchema);