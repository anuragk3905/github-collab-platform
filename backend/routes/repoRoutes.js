import express from "express";
import {
  createRepo,
  getAllRepos,
  getRepoById,
  deleteRepo,
} from "../controllers/repoController.js";

import authMiddleware from "../middleware/authMiddleware.js"; // ✅ ADD THIS

const router = express.Router();

// 🔒 Protected routes
router.post("/", authMiddleware, createRepo);
router.delete("/:id", authMiddleware, deleteRepo);

// 🌍 Public routes
router.get("/", getAllRepos);
router.get("/:id", getRepoById);

export default router;