import express from "express";
import { getRepoActivity } from "../controllers/activityController.js";

const router = express.Router();

router.get("/repos/:id/activity", getRepoActivity);

export default router;