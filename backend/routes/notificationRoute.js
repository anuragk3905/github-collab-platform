import express from "express";
import {
  getMyNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", getMyNotifications);
router.patch("/:notificationId/read", markNotificationRead);

export default router;