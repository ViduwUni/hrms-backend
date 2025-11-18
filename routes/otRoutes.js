import express from "express";
import {
  createOTSettings,
  getOTSettings,
  updateOTSettings,
  deleteOTSettings,
} from "../controllers/otController.js";

const router = express.Router();

router.post("/create", createOTSettings);
router.get("/all", getOTSettings);
router.put("/update", updateOTSettings);
router.delete("/delete", deleteOTSettings);

export default router;
