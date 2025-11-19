import express from "express";
import multer from "multer";
import { processLogs } from "../controllers/logsController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store file in memory

router.post("/process", upload.single("file"), processLogs);

export default router;
