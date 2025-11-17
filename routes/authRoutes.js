import express from "express";
import {
  register,
  login,
  getProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  logout,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

// Protected routes
router.get("/profile", protect, getProfile);

// Admin-only routes
router.get("/", protect, admin, getUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
