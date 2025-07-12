// routes/authRoutes.js
import express from "express";
import { signup, login, updateProfile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const upload = multer();

router.put(
  "/update_profile",
  authMiddleware,
  upload.single("profilePicture"), // 👈 this is important
  updateProfile
);

// auth middleware not required
router.post("/signup", signup);
router.post("/login", login);

export default router;
