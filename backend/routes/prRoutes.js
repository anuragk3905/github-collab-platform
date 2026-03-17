import express from "express";
import * as prController from "../controllers/prController.js";

const router = express.Router();

router.post("/", prController.createPullRequest);

router.get("/:repoName", prController.getPullRequests);

router.put("/:prId/merge", prController.mergePullRequest);

export default router;