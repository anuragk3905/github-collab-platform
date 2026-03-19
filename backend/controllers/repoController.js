import Repository from "../models/Repository.js";
import { logActivity } from "../utils/eventHelpers.js";
import Issue from "../models/Issue.js";
import Comment from "../models/Comment.js";
import PullRequest from "../models/PullRequest.js";
import ReviewComment from "../models/ReviewComment.js";
import Notification from "../models/NotificationModel.js";
import Activity from "../models/ActivityModel.js";
import mongoose from "mongoose";

export const createRepo = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Repository name is required" });
    }

    const repoName = String(name).trim();
    if (repoName.length < 3) {
      return res
        .status(400)
        .json({ message: "Repository name must be at least 3 characters long" });
    }

    const repo = await Repository.create({
      name: repoName,
      owner: req.user.id,
      collaborators: [
        {
          userId: req.user.id,
          role: "owner",
        },
      ],
    });

    await logActivity({
      repoId: repo._id,
      userId: req.user.id,
      eventType: "repo_created",
      message: `Repository created: ${repo.name}`,
      metadata: {},
    });

    res.status(201).json(repo);
  } catch (error) {
    throw error;
  }
};

export const getAllRepos = async (req, res) => {
  try {
    const userId = req.user.id;

    const repos = await Repository.find({
      $or: [
        { owner: userId },
        { "collaborators.userId": userId },
      ],
    });

    res.status(200).json(repos);
  } catch (error) {
    throw error;
  }
};

export const getRepoById = async (req, res) => {
  try {
    const { id } = req.params;

    // Can be preloaded by route middleware
    const repo = req.repo || (await Repository.findById(id));

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.status(200).json(repo);
  } catch (error) {
    throw error;
  }
};

export const deleteRepo = async (req, res) => {
  try {
    const { id } = req.params;

    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

  
    const userId = req.user.id;

    // Check if user is owner
    if (repo.owner.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Best-effort cleanup to avoid orphaned documents
    const issueDocs = await Issue.find({ repoId: repo._id }).select("_id");
    const issueIds = issueDocs.map((d) => d._id);

    if (issueIds.length > 0) {
      await Comment.deleteMany({ issueId: { $in: issueIds } });
      await Issue.deleteMany({ repoId: repo._id });
    }

    const prDocs = await PullRequest.find({ repoName: repo.name }).select("_id");
    const prIds = prDocs.map((d) => d._id);

    if (prIds.length > 0) {
      await ReviewComment.deleteMany({ prId: { $in: prIds } });
    }

    await PullRequest.deleteMany({ repoName: repo.name });

    await Notification.deleteMany({ repoId: repo._id });
    await Activity.deleteMany({ repoId: repo._id });

    await repo.deleteOne();

    await logActivity({
      repoId: repo._id,
      userId: req.user.id,
      eventType: "repo_deleted",
      message: `Repository deleted: ${repo.name}`,
      metadata: {},
    });

    res.status(200).json({ message: "Repository deleted successfully" });
  } catch (error) {
    throw error;
  }
};

export const addCollaborator = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body || {};

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const repo = req.repo;
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const requestedRole = role || "collaborator";
    if (!["owner", "collaborator", "viewer"].includes(requestedRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent assigning owner role through this endpoint (UX: owner transfer should be explicit)
    if (requestedRole === "owner") {
      return res
        .status(400)
        .json({ message: "Use ownership transfer to set owner" });
    }

    // Do not allow adding the repo owner as a collaborator again
    if (String(repo.owner) === String(userId)) {
      return res.status(400).json({ message: "User is already the owner" });
    }

    const existing = repo.collaborators.find(
      (c) => String(c.userId) === String(userId)
    );

    if (existing) {
      existing.role = requestedRole;
    } else {
      repo.collaborators.push({ userId, role: requestedRole });
    }

    await repo.save();

    await logActivity({
      repoId: repo._id,
      userId: req.user.id,
      eventType: "collaborator_added",
      message: `Collaborator added/updated`,
      metadata: { targetUserId: String(userId), role: requestedRole, repoId: String(repo._id) },
    });

    return res.status(200).json(repo);
  } catch (error) {
    throw error;
  }
};