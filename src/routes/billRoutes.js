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
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Bill returned
 */
router.get("/query", authMiddleware, rateLimitQueryBill, queryBill);

/**
 * @swagger
 * /api/v1/bills/detailed:
 *   get:
 *     summary: Query detailed bill with paging (Mobile App)
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *       - in: query
 *         name: limit
 *       - in: query
 *         name: offset
 *     responses:
 *       200:
 *         description: Detailed bill returned
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
 *         description: Unpaid bills returned
 */
router.get("/banking/unpaid", authMiddleware, bankingQueryBill);

export default router;
