import express from "express";
import * as reviewController from "../controllers/reviewController.js";

const router = express.Router();

router.post("/comment", reviewController.addReviewComment);

router.get("/:prId", reviewController.getReviewComments);

export default router;