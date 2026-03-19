import Issue from "../models/Issue.js";
import Repository from "../models/Repository.js";
import Comment from "../models/Comment.js";
import {
  logActivity,
  notifyRepoMembers,
} from "../utils/eventHelpers.js";

export const createIssue = async (req, res) => {
  try {
    const { id } = req.params; // repoId
    const { title, description } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Title is required" });
    }
    const issueTitle = title.trim();
    if (issueTitle.length < 3) {
      return res
        .status(400)
        .json({ message: "Issue title must be at least 3 characters long" });
    }

    // Route middleware preloads membership context
    const repo = req.repo || (await Repository.findById(id));
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const issue = await Issue.create({
      title: issueTitle,
      description,
      repoId: id,
      createdBy: req.user.id, // temp user
    });

    await logActivity({
      repoId: repo._id,
      userId: req.user.id,
      eventType: "issue_created",
      message: `Issue created: ${issueTitle}`,
      metadata: { issueId: String(issue._id) },
    });

    await notifyRepoMembers({
      repo,
      excludeUserId: req.user.id,
      type: "new_issue",
      message: `New issue in ${repo.name}: ${issueTitle}`,
      payload: { type: "new_issue", message: `New issue: ${issueTitle}` },
      repoId: repo._id,
    });

    res.status(201).json(issue);
  } catch (error) {
    throw error;
  }
};

export const getIssuesByRepo = async (req, res) => {
  try {
    const { id } = req.params; // repoId

    const repo = req.repo || (await Repository.findById(id));
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const issues = await Issue.find({ repoId: id });

    res.status(200).json(issues);
  } catch (error) {
    throw error;
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // issueId
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ message: "Comment text is required" });
    }
    const commentText = text.trim();
    if (commentText.length < 1) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const issue = req.issue || (await Issue.findById(id));
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const comment = await Comment.create({
      issueId: id,
      userId: req.user.id, // temp user
      text: commentText,
    });

    const repo = req.repo || (await Repository.findById(issue.repoId));
    await logActivity({
      repoId: repo._id,
      userId: req.user.id,
      eventType: "comment_added",
      message: `Comment added on issue`,
      metadata: { issueId: String(comment.issueId) },
    });

    await notifyRepoMembers({
      repo,
      excludeUserId: req.user.id,
      type: "new_comment",
      message: `New comment in ${repo.name}`,
      payload: { type: "new_comment", message: `New comment` },
      repoId: repo._id,
    });

    res.status(201).json(comment);
  } catch (error) {
    throw error;
  }
};

export const getCommentsByIssue = async (req, res) => {
  try {
    const { id } = req.params; // issueId

    const issue = req.issue || (await Issue.findById(id));
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const comments = await Comment.find({ issueId: id });

    res.status(200).json(comments);
  } catch (error) {
    throw error;
  }
};

export const closeIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = req.issue || (await Issue.findById(id));

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // 🔒 Only creator can close
    if (issue.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (issue.status === "closed") {
      return res.status(400).json({ message: "Issue is already closed" });
    }

    const repo = req.repo || (await Repository.findById(issue.repoId));
    issue.status = "closed";
    await issue.save();

    await logActivity({
      repoId: repo._id,
      userId: req.user.id,
      eventType: "issue_closed",
      message: `Issue closed`,
      metadata: { issueId: String(issue._id) },
    });

    res.status(200).json({
      message: "Issue closed successfully",
      issue,
    });
  } catch (error) {
    throw error;
  }
};