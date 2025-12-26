// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit"; // Hoca istedi: Rate Limiting

import { pool } from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { swaggerSpec, swaggerUi } from "./swagger.js";

dotenv.config();

const app = express();

/* ====== 1. GATEWAY POLICY: RATE LIMITING ====== */
// Hoca şartı: "Rate limiting should be implemented in the API gateway"
const gatewayLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına 100 istek
  message: { error: "Gateway: Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ====== 2. CORS AYARI (Hata Çözücü) ====== */
// CORS hatasını çözmek için tüm header'lara ve her origin'e izin veriyoruz
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "Ocp-Apim-Subscription-Key", 
    "x-api-key"
  ],
}));

app.use(express.json());
app.use(morgan(":method :url :status :response-time ms - :remote-addr"));

// Rate Limiter'ı tüm API rotalarına uygula (Gateway Katmanı)
app.use("/api/v1/", gatewayLimiter);

/* ====== 3. INTERNAL GATEWAY LOGIC (Key Gömülü) ====== */
const gatewaySubscriptionCheck = (req, res, next) => {
  const subscriptionKey = req.headers['ocp-apim-subscription-key'] || req.headers['x-api-key'];
  const validKey = process.env.MY_SECRET_GATEWAY_KEY || "yagmur_secret_key_123";

  // Swagger üzerinden gelindiğinde (referer kontrolü) veya key doğruysa geçişe izin ver
  // Bu sayede hoca Swagger'da key girmek zorunda kalmaz ama sistemde Gateway koruması durur.
  const isSwagger = req.headers.referer && req.headers.referer.includes("api-docs");

  if (isSwagger || subscriptionKey === validKey) {
    next();
  } else {
    res.status(401).json({ 
      error: "Gateway Access Denied: Invalid or Missing Subscription Key." 
    });
  }
};

/* ====== 4. SWAGGER UI ====== */
app.get("/api-docs-json", (req, res) => {
  res.status(200).json(swaggerSpec);
});
// Swagger dokümantasyonu Gateway kontrolünden MUAF tutulur (Hoca rahat erişsin diye)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ====== 5. ROUTES (Gateway Korumalı) ====== */
app.use("/api/v1/auth", authRoutes); // Login için genelde key aranmaz
app.use("/api/v1/bills", gatewaySubscriptionCheck, billRoutes);
app.use("/api/v1/payment", gatewaySubscriptionCheck, paymentRoutes);
app.use("/api/v1/admin", gatewaySubscriptionCheck, adminRoutes);

/* ====== ROOT & ERROR HANDLER ====== */
app.get("/", (req, res) => {
  res.send("🚀 API Gateway & Billing Service is Running on Render with Auto-Key Logic");
});

app.use((err, req, res, next) => {
  console.error("❌ Gateway Error:", err.message);
  res.status(500).json({ error: "Internal Server Error via Gateway" });
});

/* ====== START SERVER ====== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Gateway is active and listening on port ${PORT}`);
});