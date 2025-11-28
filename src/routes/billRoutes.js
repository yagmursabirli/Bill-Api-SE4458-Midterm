//src/routes/billRoutes.js
import express from "express";
import { queryBill } from "../controllers/billController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { rateLimitQueryBill } from "../middleware/rateLimitMiddleware.js";

import { queryBillDetailed } from "../controllers/billController.js";

import { bankingQueryBill } from "../controllers/billController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bills
 *   description: Mobile & Banking Bill Endpoints
 */

/**
 * @swagger
 * /api/v1/bills/query:
 *   get:
 *     summary: Query a single month's bill (Mobile App)
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: "2024-12-01"
 *     responses:
 *       200:
 *         description: Bill returned successfully
 *       400:
 *         description: Invalid or missing month parameter
 *       401:
 *         description: Unauthorized - Token required
 *       404:
 *         description: Bill not found for the given month
 *       429:
 *         description: Too many requests (Rate limit exceeded)
 *       500:
 *         description: Server error
 */

router.get("/query", authMiddleware, rateLimitQueryBill, queryBill);

/**
 * @swagger
 * /api/v1/bills/detailed:
 *   get:
 *     summary: Query detailed bill with pagination (Mobile App)
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detailed bill returned successfully
 *       400:
 *         description: Invalid pagination or month parameter
 *       401:
 *         description: Unauthorized - Token required
 *       404:
 *         description: Bill not found
 *       500:
 *         description: Server error
 */

router.get("/detailed", authMiddleware, queryBillDetailed);

/**
 * @swagger
 * /api/v1/bills/banking/unpaid:
 *   get:
 *     summary: List all unpaid bills (Banking App)
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unpaid bills returned
 *       401:
 *         description: Unauthorized - Token required
 *       404:
 *         description: No unpaid bills found
 *       500:
 *         description: Server error
 */
router.get("/banking/unpaid", authMiddleware, bankingQueryBill);

export default router;
