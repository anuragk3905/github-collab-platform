import * as reviewService from "../services/reviewService.js";

export const addReviewComment = async (req, res) => {

  try {

    const comment = await reviewService.addComment(req.body);

    res.json(comment);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};

export const getReviewComments = async (req, res) => {

  try {

    const { prId } = req.params;

    const comments = await reviewService.getComments(prId);

    res.json(comments);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};