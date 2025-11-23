//src/routes/adminRoutes.js

import express from "express";
import { addBill } from "../controllers/adminController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";
import { addBillDetail } from "../controllers/adminController.js";
import { addBillBatch } from "../controllers/adminController.js";
import { uploadCsv } from "../middleware/uploadCsv.js";

const router = express.Router();

router.post("/add-bill", authMiddleware, adminOnly, addBill);

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
