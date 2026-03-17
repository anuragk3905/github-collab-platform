import simpleGit from "simple-git";
import { diffLines } from "diff";
import fs from "fs";
import path from "path";

const baseRepoPath = path.resolve("repos");

export const initRepository = async (repoName) => {

  const repoPath = path.join(baseRepoPath, repoName);

  if (!fs.existsSync(repoPath)) {
    fs.mkdirSync(repoPath, { recursive: true });
  }

  const git = simpleGit(repoPath);

  await git.init();

  return repoPath;
};

export const commitFiles = async (repoName, message) => {

  const repoPath = path.join(baseRepoPath, repoName);

  const git = simpleGit(repoPath);

  await git.add("./*");

  const commit = await git.commit(message);

  return commit;
};

export const getCommitHistory = async (repoName) => {

  const repoPath = path.join(baseRepoPath, repoName);

  const git = simpleGit(repoPath);

  const log = await git.log();

  return log;
};

export const createBranch = async (repoName, branchName) => {

  const repoPath = path.join(baseRepoPath, repoName);

  const git = simpleGit(repoPath);

  await git.branch([branchName]);

  return { message: "Branch created" };
};

export const switchBranch = async (repoName, branchName) => {

  const repoPath = path.join(baseRepoPath, repoName);

  const git = simpleGit(repoPath);

  await git.checkout(branchName);

  return { message: "Switched branch" };
};

export const mergeBranch = async (repoName, branchName) => {

  const repoPath = `repos/${repoName}`;

  const git = simpleGit(repoPath);

  const status = await git.status();

  if (status.conflicted.length > 0) {
    throw new Error("Merge conflict detected");
  }

  const result = await git.merge([branchName]);

  return result;

};

export const generateDiff = (oldContent, newContent) => {

  const diff = diffLines(oldContent, newContent);

  return diff;
};

export const getBranchDiff = async (repoName, sourceBranch, targetBranch) => {

  const repoPath = `repos/${repoName}`;

  const git = simpleGit(repoPath);

  const base = await git.raw([
    "merge-base",
    targetBranch,
    sourceBranch
  ]);

  const diff = await git.raw([
    "diff",
    `${base.trim()}..${sourceBranch}`
  ]);

  return diff;

};

export const mergePR = async (req, res) => {

  const { repoName, sourceBranch } = req.body;

  const result = await gitService.mergeBranch(repoName, sourceBranch);

  res.json(result);
};

export const getBranches = async (repoName) => {

  const repoPath = `repos/${repoName}`;

  const git = simpleGit(repoPath);

  const branches = await git.branch();

  return branches;

};

export const getCommitGraph = async (repoName) => {

  const repoPath = `repos/${repoName}`;

  const git = simpleGit(repoPath);

  const graph = await git.raw([
    "log",
    "--graph",
    "--oneline",
    "--all"
  ]);

  return graph;

};