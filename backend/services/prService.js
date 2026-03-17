import PullRequest from "../models/PullRequest.js";

export const createPR = async (data) => {

  const pr = new PullRequest(data);

  await pr.save();

  return pr;
};

export const getPRs = async (repoName) => {

  return await PullRequest.find({ repoName });
};