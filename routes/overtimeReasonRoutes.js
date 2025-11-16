import express from "express";
import { getOvertimeOptions, addOvertimeOption, deleteOvertimeOption } from "../controllers/overtimeReasonController.js";

const router = express.Router();

router.get("/", getOvertimeOptions);
router.post("/", addOvertimeOption);
router.delete("/:id", deleteOvertimeOption);

export default router;
