//src/routes/paymentRoutes.js
import express from "express";
import { payBill } from "../controllers/paymentController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment API Endpoints
 */

/**
 * @swagger
 * /api/v1/payment/pay:
 *   post:
 *     summary: Pay bill (partial or full) - Web Site
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriberNo
 *               - month
 *               - amount
 *     responses:
 *       200:
 *         description: Payment completed
 */
router.post("/pay", payBill);

export default router;
