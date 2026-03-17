import * as prService from "../services/prService.js";
import PullRequest from "../models/PullRequest.js";
import * as gitService from "../services/gitService.js";

export const createPullRequest = async (req, res) => {

  try {

    const pr = await prService.createPR(req.body);

    res.json(pr);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};

export const getPullRequests = async (req, res) => {

  try {

    const { repoName } = req.params;

    const prs = await prService.getPRs(repoName);

    res.json(prs);

  } catch (error) {

    res.status(500).json({ error: error.message });

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

    res.json({
      message: "Pull Request merged successfully"
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};