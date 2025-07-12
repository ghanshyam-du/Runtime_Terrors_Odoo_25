import express from "express";
import { getPublicUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/public_users", getPublicUsers);

export default router;
