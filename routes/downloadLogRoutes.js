import express from "express";
import {
  addDownloadLog,
  getDownloadLogs,
} from "../controllers/downloadLogController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addDownloadLog);
router.get("/", protect, admin, getDownloadLogs);

export default router;
