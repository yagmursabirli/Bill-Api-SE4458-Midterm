//src/routes/adminRoutes.js

import express from "express";
import { addBill } from "../controllers/adminController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";
import { addBillDetail } from "../controllers/adminController.js";
import { addBillBatch } from "../controllers/adminController.js";
import { uploadCsv } from "../middleware/uploadCsv.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations for bill management
 */

/**
 * @swagger
 * /api/v1/admin/add-bill:
 *   post:
 *     summary: Add a new bill for a subscriber
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriberNo
 *               - month
 *               - totalAmount
 *             properties:
 *               subscriberNo:
 *                 type: string
 *               month:
 *                 type: string
 *                 example: "2024-12-01"
 *               totalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bill created successfully
 *
 */

router.post("/add-bill", authMiddleware, adminOnly, addBill);

/**
 * @swagger
 * /api/v1/admin/add-bill-detail:
 *   post:
 *     summary: Add detail to an existing bill
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriberNo
 *               - month
 *               - type
 *               - amount
 *             properties:
 *               subscriberNo:
 *                 type: string
 *               month:
 *                 type: string
 *               type:
 *                 type: string
 *                 example: "Internet"
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bill detail added successfully
 */

router.post("/add-bill-detail", authMiddleware, adminOnly, addBillDetail);

/**
 * @swagger
 * /api/v1/admin/add-bill-batch:
 *   post:
 *     summary: Upload CSV to add multiple bills
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Batch bill upload result
 */

router.post(
  "/add-bill-batch",
  authMiddleware,
  adminOnly,
  uploadCsv.single("file"),
  addBillBatch
);

export default router;
