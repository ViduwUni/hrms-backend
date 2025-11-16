import express from "express";
import { getOvertimeAuditLogs } from "../controllers/overtimeAuditLogController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", protect, getOvertimeAuditLogs);

export default router;
