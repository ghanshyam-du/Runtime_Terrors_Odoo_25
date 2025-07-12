import express from "express";
import {
  createSwapRequest,
  getSwapRequestsForUser,
} from "../controllers/swapController";
const router = express.Router();
import authMiddleware from "../middlewares/authMiddleware";

router.post("/create_swap ", createSwapRequest);
router.get("/get_swaps", authMiddleware, getSwapRequestsForUser);

export default router;
