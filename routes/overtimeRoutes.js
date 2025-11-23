import express from "express";
import {
  addOvertime,
  getOvertimes,
  deleteOvertime,
  updateOvertime,
  exportOvertimeExcel,
  approveOvertime,
  rejectOvertime,
  getPendingOvertimes,
  getOvertimePreview,
} from "../controllers/overtimeController.js";
import {
  protect,
  requireApprovalPermission,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", addOvertime);
router.get("/", getOvertimes);
router.get("/pending", getPendingOvertimes);
router.get("/export", exportOvertimeExcel);
router.get("/preview", getOvertimePreview);
router.put("/:id", updateOvertime);
router.put("/:id/approve", protect, requireApprovalPermission, approveOvertime);
router.put("/:id/reject", protect, requireApprovalPermission, rejectOvertime);
router.delete("/:id", deleteOvertime);

export default router;
