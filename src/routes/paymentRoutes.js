// src/routes/paymentRoutes.js
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
 *             properties:
 *               subscriberNo:
 *                 type: string
 *                 example: "123456"
 *               month:
 *                 type: string
 *                 example: "2024-12-01"
 *               amount:
 *                 type: number
 *                 example: 50.75
 *     responses:
 *       200:
 *         description: Payment completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment successful"
 *                 remaining_amount:
 *                   type: number
 *                   example: 25.50
 *                 paid_status:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Invalid input or missing fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bill not found
 *       409:
 *         description: Bill already fully paid
 *       500:
 *         description: Internal server error
 */
router.post("/pay", payBill);

export default router;
