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
 * post:
 * summary: Add a new bill for a subscriber
 * tags: [Admin]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - subscriberNo
 * - month
 * - totalAmount
 * properties:
 * subscriberNo:
 * type: string
 * month:
 * type: string
 * example: "2024-12-01"
 * totalAmount:
 * type: number
 * responses:
 * 200:
 * description: Bill created successfully
 * 400:
 * description: Required fields (subscriberNo, month, totalAmount) are missing in the request body or their format is invalid.
 * 401:
 * description: Invalid or missing bearerAuth token. The user's identity could not be authenticated.
 * 403:
 * description: The token is valid, but the user does not have the admin role (authorization failure).
 * 409:
 * description: A bill for the specified subscriberNo and month already exists.
 * 500:
 * description: An unexpected error occurred on the server side (e.g., database connection issue).
 */
router.post("/add-bill", authMiddleware, adminOnly, addBill);

/**
 * @swagger
 * /api/v1/admin/add-bill-detail:
 * post:
 * summary: Add detail to an existing bill
 * tags: [Admin]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - subscriberNo
 * - month
 * - type
 * - amount
 * properties:
 * subscriberNo:
 * type: string
 * month:
 * type: string
 * type:
 * type: string
 * example: "Internet"
 * amount:
 * type: number
 * responses:
 * 200:
 * description: Bill detail added successfully
 * 400:
 * description: Required fields are missing in the request body or their format is invalid.
 * 401:
 * description: Invalid or missing bearerAuth token. The user's identity could not be authenticated.
 * 403:
 * description: The token is valid, but the user does not have the admin role (authorization failure).
 * 404:
 * description: The main bill matching the specified subscriberNo and month was not found.
 * 500:
 * description: An unexpected error occurred on the server side (e.g., database connection issue).
 */
router.post("/add-bill-detail", authMiddleware, adminOnly, addBillDetail);

/**
 * @swagger
 * /api/v1/admin/add-bill-batch:
 * post:
 * summary: Upload CSV to add multiple bills
 * tags: [Admin]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * file:
 * type: string
 * format: binary
 * responses:
 * 200:
 * description: Batch bill upload result (detailed status of uploaded/failed records).
 * 400:
 * description: No file uploaded, file format is incorrect, or the data inside the CSV is invalid/malformed.
 * 401:
 * description: Invalid or missing bearerAuth token. The user's identity could not be authenticated.
 * 403:
 * description: The token is valid, but the user does not have the admin role (authorization failure).
 * 413:
 * description: The size of the uploaded file exceeds the allowed limit (Payload Too Large).
 * 500:
 * description: An unexpected error occurred on the server side (e.g., file processing failure).
 */
router.post(
  "/add-bill-batch",
  authMiddleware,
  adminOnly,
  uploadCsv.single("file"),
  addBillBatch
);

export default router;
