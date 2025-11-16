import express from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

// Employee routes
router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", admin, updateEmployee);
router.delete("/:id", admin, deleteEmployee);

export default router;
