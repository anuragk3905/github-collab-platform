import express from "express";
import * as gitController from "../controllers/gitController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import permissionMiddleware from "../middleware/permissionMiddleware.js";
import Repository from "../models/Repository.js";

const router = express.Router();

const loadRepoByNameFromBody = async (req, res, next) => {
  try {
    const { repoName } = req.body || {};
    if (!repoName) return res.status(400).json({ message: "repoName is required" });
    const repo = await Repository.findOne({ name: String(repoName).trim() });
    if (!repo) return res.status(404).json({ message: "Repository not found" });
    req.repo = repo;
    next();
  } catch (error) {
    next(error);
  }
};

const loadRepoByNameFromParam = async (req, res, next) => {
  try {
    const { repoName } = req.params;
    if (!repoName) return res.status(400).json({ message: "repoName is required" });
    const repo = await Repository.findOne({ name: String(repoName).trim() });
    if (!repo) return res.status(404).json({ message: "Repository not found" });
    req.repo = repo;
    next();
  } catch (error) {
    next(error);
  }
};

const loadRepoByNameFromQuery = async (req, res, next) => {
  try {
    const { repoName } = req.query;
    if (!repoName) return res.status(400).json({ message: "repoName is required" });
    const repo = await Repository.findOne({ name: String(repoName).trim() });
    if (!repo) return res.status(404).json({ message: "Repository not found" });
    req.repo = repo;
    next();
  } catch (error) {
    next(error);
  }
};

// All git operations require authentication
router.post("/repo/init", authMiddleware, gitController.createRepo);

router.post("/commit", authMiddleware, loadRepoByNameFromBody, permissionMiddleware("collaborator"), gitController.commit);

router.get("/repos/:repoName/commits", authMiddleware, loadRepoByNameFromParam, permissionMiddleware("viewer"), gitController.getCommits);

router.post("/branch", authMiddleware, loadRepoByNameFromBody, permissionMiddleware("collaborator"), gitController.createBranch);

router.post("/checkout", authMiddleware, loadRepoByNameFromBody, permissionMiddleware("collaborator"), gitController.switchBranch);

router.post("/merge", authMiddleware, loadRepoByNameFromBody, permissionMiddleware("owner"), gitController.mergeBranch);

router.get("/diff", authMiddleware, loadRepoByNameFromQuery, permissionMiddleware("viewer"), gitController.getPRDiff);

router.get("/branches/:repoName", authMiddleware, loadRepoByNameFromParam, permissionMiddleware("viewer"), gitController.getBranches);

router.get("/graph/:repoName", authMiddleware, loadRepoByNameFromParam, permissionMiddleware("viewer"), gitController.getCommitGraph);

export default router;