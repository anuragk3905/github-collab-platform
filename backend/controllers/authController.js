import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const NODE_ENV = process.env.NODE_ENV || "development";

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: NODE_ENV === "production" ? "Lax" : "Strict",
  maxAge: ONE_DAY_MS,
});

/* REGISTER */
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "Username is required" });
    }
    if (username.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Email must include @" });
    }
    // Basic email format check (full validation is enforced by mongoose)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Email must be valid" });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Password is required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Never return password field in API response
    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({ message: "User registered", user: safeUser });
  } catch (err) {
    // Handle mongoose validation errors / duplicate keys
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    if (err && err.name === "ValidationError") {
      const firstError = Object.values(err.errors || {})[0];
      return res.status(400).json({
        message: firstError?.message || "Validation error",
      });
    }
    return res.status(500).json({ message: err.message });
  }
};

/* LOGIN */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Email must include @" });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Store token in HTTP-only cookie
    res.cookie("token", token, buildCookieOptions());

    res.json({ message: "Login successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* LOGOUT */
export const logout = (req, res) => {
  res.clearCookie("token", buildCookieOptions());
  res.json({ message: "Logout successful" });
};