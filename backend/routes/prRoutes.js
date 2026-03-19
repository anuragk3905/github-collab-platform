import express from "express";
import * as prController from "../controllers/prController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import permissionMiddleware from "../middleware/permissionMiddleware.js";
import Repository from "../models/Repository.js";
import PullRequest from "../models/PullRequest.js";

const router = express.Router();

// Attach repo to req based on repoName in body (for create PR)
const loadRepoFromBody = async (req, res, next) => {
  try {
    const { repoName } = req.body;

    if (!repoName) {
      return res.status(400).json({ message: "repoName is required" });
    }

    const repo = await Repository.findOne({ name: repoName });

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    req.repo = repo;
    next();
  } catch (error) {
    next(error);
  }
};

// Attach repo to req based on prId in params (for merge)
const loadRepoFromPrId = async (req, res, next) => {
  try {
    const { prId } = req.params;

    const pr = await PullRequest.findById(prId);

    if (!pr) {
      return res.status(404).json({ message: "Pull Request not found" });
    }

    const repo = await Repository.findOne({ name: pr.repoName });

    if (!repo) {
      return res.status(404).json({ message: "Repository not found for this PR" });
    }

    req.repo = repo;
    next();
  } catch (error) {
    next(error);
  }
};

// Attach repo to req based on repoName in params (for listing PRs)
const loadRepoFromRepoNameParam = async (req, res, next) => {
  try {
    const { repoName } = req.params;

    if (!repoName) {
      return res.status(400).json({ message: "repoName is required" });
    }

    const repo = await Repository.findOne({ name: repoName });
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    req.repo = repo;
    next();
  } catch (error) {
    next(error);
  }
};

// Creating PRs: authenticated and at least collaborator on the repo
router.post(
  "/",
  authMiddleware,
  loadRepoFromBody,
  permissionMiddleware("collaborator"),
  prController.createPullRequest
);

router.get(
  "/:repoName",
  authMiddleware,
  loadRepoFromRepoNameParam,
  permissionMiddleware("viewer"),
  prController.getPullRequests
);

// Merging PRs: only owner of the repo
router.put(
  "/:prId/merge",
  authMiddleware,
  loadRepoFromPrId,
  permissionMiddleware("owner"),
  prController.mergePullRequest
);

export default router;