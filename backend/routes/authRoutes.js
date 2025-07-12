// routes/authRoutes.js
import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// routes
// token required


// auth middleware not required
router.post("/signup", signup);
router.post("/login", login);

export default router;
