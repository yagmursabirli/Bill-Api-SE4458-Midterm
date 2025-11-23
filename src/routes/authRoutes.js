//src/routes/authRoutes.js

import express from "express";
import {
  loginSubscriber,
  registerSubscriber,
} from "../controllers/authController.js";
import { registerAdmin } from "../controllers/authController.js";
import { loginAdmin } from "../controllers/authController.js";

const router = express.Router();

// POST /api/v1/auth/login
router.post("/login", loginSubscriber);
router.post("/register", registerSubscriber);

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

export default router;
