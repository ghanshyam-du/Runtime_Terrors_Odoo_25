import express from "express";
import {
  createSwapRequest,
  getSwapRequestsForUser,
  updateSwapStatus,
} from "../controllers/swapController.js";
const router = express.Router();
import authMiddleware from "../middlewares/authMiddleware.js";

router.post("/create_swap", createSwapRequest);
router.get("/get_swaps", authMiddleware, getSwapRequestsForUser);
router.patch("/:id", authMiddleware, updateSwapStatus);

export default router;
