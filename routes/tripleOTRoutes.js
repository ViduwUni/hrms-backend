import express from "express";
import {
  addTripleOT,
  getTripleOTs,
  updateTripleOT,
  deleteTripleOT,
} from "../controllers/tripleOTController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addTripleOT);
router.get("/", protect, getTripleOTs);
router.put("/:id", protect, updateTripleOT);
router.delete("/:id", protect, deleteTripleOT);

export default router;
