import * as prService from "../services/prService.js";
import PullRequest from "../models/PullRequest.js";
import * as gitService from "../services/gitService.js";
import { logActivity, notifyRepoMembers } from "../utils/eventHelpers.js";

export const createPullRequest = async (req, res) => {

  try {

    const { repoName, title, sourceBranch, targetBranch } = req.body || {};

    if (!repoName || typeof repoName !== "string") {
      return res.status(400).json({ message: "repoName is required" });
    }
    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "title is required" });
    }
    if (!sourceBranch || typeof sourceBranch !== "string") {
      return res.status(400).json({ message: "sourceBranch is required" });
    }
    if (!targetBranch || typeof targetBranch !== "string") {
      return res.status(400).json({ message: "targetBranch is required" });
    }

    const pr = await prService.createPR(req.body);

    const repo = req.repo;
    if (repo) {
      await logActivity({
        repoId: repo._id,
        userId: req.user.id,
        eventType: "pull_request_opened",
        message: `PR opened: ${pr.title}`,
        metadata: { prId: String(pr._id) },
      });

      await notifyRepoMembers({
        repo,
        excludeUserId: req.user.id,
        type: "new_pr",
        message: `New pull request in ${repo.name}: ${pr.title}`,
        payload: {
          type: "new_pr",
          message: `PR: ${pr.title}`,
          prId: pr._id,
        },
        repoId: repo._id,
      });
    }

    res.json(pr);

  } catch (error) {
    throw error;
  }
};

export const getPullRequests = async (req, res) => {

  try {

    const { repoName } = req.params;

    const prs = await prService.getPRs(repoName);

    res.json(prs);

  } catch (error) {
    throw error;
  }
};

export const mergePullRequest = async (req, res) => {

  try {

    const { prId } = req.params;

    const pr = await PullRequest.findById(prId);

    if (!pr) {
      return res.status(404).json({ error: "Pull Request not found" });
    }

    if (pr.status === "merged") {
      return res.status(400).json({ error: "PR already merged" });
    }

    await gitService.mergeBranch(pr.repoName, pr.sourceBranch);

    pr.status = "merged";

    await pr.save();

    const repo = req.repo;
    if (repo) {
      await logActivity({
        repoId: repo._id,
        userId: req.user.id,
        eventType: "pull_request_merged",
        message: `PR merged: ${pr.title}`,
        metadata: { prId: String(pr._id) },
      });

      await notifyRepoMembers({
        repo,
        excludeUserId: req.user.id,
        type: "pr_merged",
        message: `Pull request merged in ${repo.name}: ${pr.title}`,
        payload: {
          type: "pr_merged",
          message: `PR merged: ${pr.title}`,
          prId: pr._id,
        },
        repoId: repo._id,
      });
    }

    res.json({
      message: "Pull Request merged successfully"
    });

  } catch (error) {
    throw error;

  }

};