import express from "express";
import * as gitController from "../controllers/gitController.js";

const router = express.Router();

router.post("/repo/init", gitController.createRepo);

router.post("/commit", gitController.commit);

router.get("/repos/:repoName/commits", gitController.getCommits);

router.post("/branch", gitController.createBranch);

router.post("/checkout", gitController.switchBranch);

router.post("/merge", gitController.mergeBranch);

router.get("/diff", gitController.getPRDiff);

router.get("/branches/:repoName", gitController.getBranches);

router.get("/graph/:repoName", gitController.getCommitGraph);

export default router;