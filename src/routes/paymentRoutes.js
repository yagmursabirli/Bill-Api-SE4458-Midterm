//src/routes/paymentRoutes.js
import express from "express";
import { payBill } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/pay", payBill);

export default router;
