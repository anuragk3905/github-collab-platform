import express from "express";
import {
  createIssue,
  getIssuesByRepo,
  addComment,
  getCommentsByIssue,
  closeIssue,
} from "../controllers/issueController.js";

const router = express.Router();

router.post("/repos/:id/issues", createIssue);
router.get("/repos/:id/issues", getIssuesByRepo);

router.post("/issues/:id/comments", addComment);
router.get("/issues/:id/comments", getCommentsByIssue);

// Close issue
router.put("/issues/:id/close", closeIssue); // ✅ NEW

export default router;