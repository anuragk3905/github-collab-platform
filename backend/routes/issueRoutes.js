import express from "express";
import {
  createIssue,
  getIssuesByRepo,
  addComment,
  getCommentsByIssue,
  closeIssue,
} from "../controllers/issueController.js";

import authMiddleware from "../middleware/authMiddleware.js"; // ✅ ADD THIS

const router = express.Router();

// 🔒 Protected routes
router.post("/repos/:id/issues", authMiddleware, createIssue);
router.post("/issues/:id/comments", authMiddleware, addComment);
router.put("/issues/:id/close", authMiddleware, closeIssue);

// 🌍 Public routes
router.get("/repos/:id/issues", getIssuesByRepo);
router.get("/issues/:id/comments", getCommentsByIssue);

export default router;