import express from "express";
import { registerUser } from "../controllers/authController";

const router = express();

// Register Route
router.post('/register', registerUser)
export default router;
