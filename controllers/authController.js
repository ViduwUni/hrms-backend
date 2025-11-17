import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import generateTokenWithSession from "../utils/generateTokenWithSession.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const SESSION_DURATION = 2 * 60 * 60 * 1000;

// Register
export const register = async (req, res) => {
  const { username, email, password, isAdmin, canApprove } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      username,
      email,
      password,
      isAdmin,
      canApprove,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      canApprove: user.canApprove,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    if (user.isLoggedIn && user.sessionId) {
      if (user.sessionExpires && new Date() > user.sessionExpires) {
        user.isLoggedIn = false;
        user.sessionId = null;
        user.sessionExpires = null;
        await user.save();
      } else {
        return res.status(403).json({
          message: "User already logged in on another browser/device",
        });
      }
    }

    const sessionId = uuidv4();
    const expires = new Date(Date.now() + SESSION_DURATION);

    user.sessionId = sessionId;
    user.isLoggedIn = true;
    user.sessionExpires = expires;
    user.lastLogin = new Date();
    user.lastActivity = new Date();

    await user.save();

    const token = generateTokenWithSession(user._id, sessionId);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      canApprove: user.canApprove,
      lastLogin: user.lastLogin,
      token,
      sessionExpires: expires,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.isLoggedIn = false;
    user.sessionId = null;
    user.sessionExpires = null;

    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      canApprove: user.canApprove,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single user by ID (Admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = req.body.password;
    if (typeof req.body.isAdmin === "boolean") user.isAdmin = req.body.isAdmin;
    if (typeof req.body.canApprove === "boolean")
      user.canApprove = req.body.canApprove;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
