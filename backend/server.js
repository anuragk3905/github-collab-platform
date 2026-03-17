import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import repoRoutes from "./routes/repoRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import { initSocket } from "./config/socket.js";
import activityRoutes from "./routes/activityRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS (only once)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/repos", repoRoutes);
app.use("/", issueRoutes);
app.use("/api", activityRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// ✅ Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));