import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import repoRoutes from "./routes/repoRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";

import gitRoutes from "./routes/gitRoutes.js";
import prRoutes from "./routes/prRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

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
app.use("/api/git", gitRoutes);
app.use("/api/pr", prRoutes);
app.use("/api/reviews", reviewRoutes);


// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// ✅ Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));