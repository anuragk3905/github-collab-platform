import ReviewComment from "../models/ReviewComment.js";

export const addComment = async (data) => {

  const comment = new ReviewComment(data);

  await comment.save();

  return comment;
};

export const getComments = async (prId) => {

  return await ReviewComment.find({ prId });
};