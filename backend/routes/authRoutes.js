import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

// test protected route
router.get("/profile", authMiddleware, (req, res) => {
  res.json(req.user);
});

export default router;