//src/routes/billRoutes.js
import express from "express";
import { queryBill } from "../controllers/billController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { rateLimitQueryBill } from "../middleware/rateLimitMiddleware.js";

import { queryBillDetailed } from "../controllers/billController.js";

import { bankingQueryBill } from "../controllers/billController.js";

const router = express.Router();

router.get("/query", authMiddleware, rateLimitQueryBill, queryBill);

router.get("/detailed", authMiddleware, queryBillDetailed);

router.get("/banking/unpaid", authMiddleware, bankingQueryBill);

export default router;
