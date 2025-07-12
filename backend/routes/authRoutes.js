// routes/authRoutes.js
import express from "express";
import { signup, login, updateProfile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// routes
// token required
router.post("/update_profile", authMiddleware, updateProfile);

// auth middleware not required
router.post("/signup", signup);
router.post("/login", login);

export default router;
