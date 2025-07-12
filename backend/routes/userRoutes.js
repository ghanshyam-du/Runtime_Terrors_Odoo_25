import express from "express";
import { getPublicUsers, getUserById } from "../controllers/userController.js";

const router = express.Router();

router.get("/public_users", getPublicUsers);
router.get("/:id", getUserById);

export default router;
