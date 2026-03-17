import * as gitService from "../services/gitService.js";

export const createRepo = async (req, res) => {

  const { repoName } = req.body;

  const repoPath = await gitService.initRepository(repoName);

  res.json({ repoPath });
};

export const commit = async (req, res) => {

  const { repoName, message } = req.body;

  const result = await gitService.commitFiles(repoName, message);

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