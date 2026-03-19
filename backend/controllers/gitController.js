import * as gitService from "../services/gitService.js";
import simpleGit from "simple-git";
import { logActivity, notifyRepoMembers } from "../utils/eventHelpers.js";

export const createRepo = async (req, res) => {

  const { repoName } = req.body;

  const repoPath = await gitService.initRepository(repoName);

  res.json({ repoPath });
};

export const commit = async (req, res) => {

  const { repoName, message } = req.body;

  const result = await gitService.commitFiles(repoName, message);

  const repo = req.repo;
  if (repo) {
    await logActivity({
      repoId: repo._id,
      userId: req.user.id,
      eventType: "commit_pushed",
      message: `Commit pushed to ${repo.name}`,
      metadata: { commit: result?.commit || null },
    });

    await notifyRepoMembers({
      repo,
      excludeUserId: req.user.id,
      type: "commit_pushed",
      message: `New commit pushed in ${repo.name}`,
      payload: { type: "commit_pushed", message: `New commit in ${repo.name}` },
      repoId: repo._id,
    });
  }

  res.json(result);
};

export const getCommits = async (req, res) => {

  const { repoName } = req.params;

  const commits = await gitService.getCommitHistory(repoName);

  res.json(commits);
};

export const createBranch = async (req, res) => {

  const { repoName, branchName } = req.body;

  const result = await gitService.createBranch(repoName, branchName);

  const repo = req.repo;
  if (repo) {
    await logActivity({
      repoId: repo._id,
      userId: req.user.id,
      eventType: "branch_created",
      message: `Branch created`,
      metadata: { branchName },
    });
  }

  res.json(result);
};

export const switchBranch = async (req, res) => {

  const { repoName, branchName } = req.body;

  const result = await gitService.switchBranch(repoName, branchName);

  res.json(result);
};

export const mergeBranch = async (req, res) => {

  const { repoName, branchName } = req.body;

  const result = await gitService.mergeBranch(repoName, branchName);

  const repo = req.repo;
  if (repo) {
    await logActivity({
      repoId: repo._id,
      userId: req.user.id,
      eventType: "commit_pushed",
      message: `Branches merged`,
      metadata: { mergedBranch: branchName },
    });
  }

  res.json(result);
};

export const getDiff = async (req, res) => {

  const { repoName } = req.params;

  const git = simpleGit(`repos/${repoName}`);

  const diff = await git.diff();

  res.json({ diff });
};

export const getPRDiff = async (req, res) => {
  try {

    const { repoName, sourceBranch, targetBranch } = req.query;

    if (!repoName || !sourceBranch || !targetBranch) {
      return res.status(400).json({
        error: "repoName, sourceBranch and targetBranch are required"
      });
    }

    const diff = await gitService.getBranchDiff(
      repoName,
      sourceBranch,
      targetBranch
    );

    res.json({ diff });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBranches = async (req, res) => {

  const { repoName } = req.params;

  const branches = await gitService.getBranches(repoName);

  res.json(branches);

};

export const getCommitGraph = async (req, res) => {

  const { repoName } = req.params;

  const graph = await gitService.getCommitGraph(repoName);

  res.json({ graph });

};