import simpleGit from "simple-git";
import { diffLines } from "diff";
import fs from "fs";
import path from "path";

const baseRepoPath = path.resolve("repos");

const assertSafeRepoName = (repoName) => {
  const name = typeof repoName === "string" ? repoName.trim() : "";
  if (!name) throw new Error("repoName is required");
  // Allow only safe characters to prevent path traversal
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
    throw new Error("Invalid repoName. Use only letters, numbers, . _ -");
  }
  return name;
};

const getRepoPath = (repoName, ensureExists = true) => {
  const safeRepoName = assertSafeRepoName(repoName);
  const repoPath = path.join(baseRepoPath, safeRepoName);

  if (ensureExists && !fs.existsSync(repoPath)) {
    throw new Error(`Repository not found: ${safeRepoName}`);
  }

  return repoPath;
};

const assertSafeBranchName = (branchName) => {
  const name = typeof branchName === "string" ? branchName.trim() : "";
  if (!name) throw new Error("branchName is required");
  // Prevent traversal patterns; allow slashes for feature branches
  if (name.includes("..") || name.includes("\\\\")) {
    throw new Error("Invalid branchName");
  }
  if (!/^[a-zA-Z0-9._\/-]+$/.test(name)) {
    throw new Error("Invalid branchName");
  }
  return name;
};

export const initRepository = async (repoName) => {
  const safeRepoName = assertSafeRepoName(repoName);
  const repoPath = path.join(baseRepoPath, safeRepoName);

  if (!fs.existsSync(repoPath)) {
    fs.mkdirSync(repoPath, { recursive: true });
  }

  const git = simpleGit(repoPath);

  await git.init();

  return repoPath;
};

export const ensureRepoExists = (repoName) => getRepoPath(repoName, true);

export const commitFiles = async (repoName, message) => {
  const safeMessage =
    typeof message === "string" && message.trim().length > 0
      ? message.trim()
      : null;

  if (!safeMessage) {
    throw new Error("Commit message is required");
  }
  if (safeMessage.length > 200) {
    throw new Error("Commit message is too long (max 200 chars)");
  }

  const repoPath = getRepoPath(repoName, true);

  const git = simpleGit(repoPath);

  await git.add("./*");

  const commit = await git.commit(safeMessage);

  return commit;
};

export const getCommitHistory = async (repoName) => {
  const repoPath = getRepoPath(repoName, true);

  const git = simpleGit(repoPath);

  const log = await git.log();

  return log;
};

export const createBranch = async (repoName, branchName) => {
  const safeBranchName = assertSafeBranchName(branchName);
  const repoPath = getRepoPath(repoName, true);

  const git = simpleGit(repoPath);

  await git.branch([safeBranchName]);

  return { message: "Branch created" };
};

export const switchBranch = async (repoName, branchName) => {
  const safeBranchName = assertSafeBranchName(branchName);
  const repoPath = getRepoPath(repoName, true);

  const git = simpleGit(repoPath);

  await git.checkout(safeBranchName);

  return { message: "Switched branch" };
};

export const mergeBranch = async (repoName, branchName) => {
  const safeBranchName = assertSafeBranchName(branchName);
  const repoPath = getRepoPath(repoName, true);

  const git = simpleGit(repoPath);

  const status = await git.status();

  if (status.conflicted.length > 0) {
    throw new Error("Merge conflict detected");
  }

  const result = await git.merge([safeBranchName]);

  return result;

};

export const generateDiff = (oldContent, newContent) => {

  const diff = diffLines(oldContent, newContent);

  return diff;
};

export const getBranchDiff = async (repoName, sourceBranch, targetBranch) => {
  const safeSourceBranch = assertSafeBranchName(sourceBranch);
  const safeTargetBranch = assertSafeBranchName(targetBranch);
  const repoPath = getRepoPath(repoName, true);

  const git = simpleGit(repoPath);

  const base = await git.raw([
    "merge-base",
    safeTargetBranch,
    safeSourceBranch
  ]);

  const diff = await git.raw([
    "diff",
    `${base.trim()}..${safeSourceBranch}`
  ]);

  return diff;

};

export const mergePR = async (req, res) => {

  const { repoName, sourceBranch } = req.body;

  const result = await mergeBranch(repoName, sourceBranch);

  res.json(result);
};

export const getBranches = async (repoName) => {
  const repoPath = getRepoPath(repoName, true);

  const git = simpleGit(repoPath);

  const branches = await git.branch();

  return branches;

};

export const getCommitGraph = async (repoName) => {
  const repoPath = getRepoPath(repoName, true);

  const git = simpleGit(repoPath);

  const graph = await git.raw([
    "log",
    "--graph",
    "--oneline",
    "--all"
  ]);

  return graph;

};