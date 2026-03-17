import express from "express";
import {
  createRepo,
  getAllRepos,
  getRepoById,
  deleteRepo,
} from "../controllers/repoController.js";

const router = express.Router();

router.post("/", createRepo);
router.get("/", getAllRepos);
router.get("/:id", getRepoById);
router.delete("/:id", deleteRepo); // ✅ NEW

export default router;