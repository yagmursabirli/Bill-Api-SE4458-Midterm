// src/routes/authRoutes.js

import express from "express";
import {
  loginSubscriber,
  registerSubscriber,
  registerAdmin,
  loginAdmin,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Subscriber login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriberNo
 *               - pin
 *             properties:
 *               subscriberNo:
 *                 type: string
 *                 example: "123456"
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Login success
 */
router.post("/login", loginSubscriber);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new subscriber
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriberNo
 *               - pin
 *             properties:
 *               subscriberNo:
 *                 type: string
 *                 example: "998877"
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Subscriber registered successfully
 */
router.post("/register", registerSubscriber);

/**
 * @swagger
 * /api/v1/auth/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "adminYagmur"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Admin registered
 */
router.post("/admin/register", registerAdmin);

/**
 * @swagger
 * /api/v1/auth/admin/login:
 *   post:
 *     summary: Login as admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "adminYagmur"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Admin login success
 */
router.post("/admin/login", loginAdmin);

export default router;
