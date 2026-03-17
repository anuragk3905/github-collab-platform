import Issue from "../models/Issue.js";
import Repository from "../models/Repository.js";
import Comment from "../models/Comment.js";

export const createIssue = async (req, res) => {
  try {
    const { id } = req.params; // repoId
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Check if repo exists
    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const issue = await Issue.create({
      title,
      description,
      repoId: id,
      createdBy: req.user.id, // temp user
    });

    res.status(201).json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getIssuesByRepo = async (req, res) => {
  try {
    const { id } = req.params; // repoId

    // check repo exists (good practice)
    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const issues = await Issue.find({ repoId: id });

    res.status(200).json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // issueId
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // check issue exists
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const comment = await Comment.create({
      issueId: id,
      userId: req.user.id, // temp user
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCommentsByIssue = async (req, res) => {
  try {
    const { id } = req.params; // issueId

    // check issue exists
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const comments = await Comment.find({ issueId: id });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const closeIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // 🔒 Only creator can close
    if (issue.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    issue.status = "closed";
    await issue.save();

    res.status(200).json({
      message: "Issue closed successfully",
      issue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};