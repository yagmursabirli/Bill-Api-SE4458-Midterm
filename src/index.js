// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import { pool } from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { swaggerSpec, swaggerUi } from "./swagger.js";

dotenv.config();

const app = express();

/* ====== MIDDLEWARES ====== */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Ocp-Apim-Subscription-Key", "x-api-key"],
  })
);

app.use(express.json());
app.use(morgan(":method :url :status :response-time ms - :remote-addr"));

/* ====== CUSTOM GATEWAY MIDDLEWARE (Azure APIM Yerine) ====== */
// Bu middleware, Azure kredisi bittiği için APIM'in yaptığı Subscription Key kontrolünü simüle eder[cite: 59, 62].
const gatewaySubscriptionCheck = (req, res, next) => {
  // Frontend'den gelecek olan key'i kontrol ediyoruz
  const subscriptionKey = req.headers['ocp-apim-subscription-key'] || req.headers['x-api-key'];
  
  // Render Environment Variables'a ekleyeceğin MY_SECRET_KEY, yoksa varsayılanı kullanır
  const validKey = process.env.MY_SECRET_GATEWAY_KEY || "yagmur_secret_key_123";

  if (subscriptionKey === validKey) {
    next(); // Key doğruysa bir sonraki rotaya geç
  } else {
    res.status(401).json({ 
      error: "Unauthorized: Invalid or Missing Subscription Key via Gateway Logic." 
    });
  }
};

/* ====== SWAGGER ====== */
app.get("/api-docs-json", (req, res) => {
  res.status(200).json(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ====== ROUTES (Gateway Korumalı) ====== */
// Tüm ana rotaların başına 'gatewaySubscriptionCheck' ekleyerek APIM mimarisini koruyoruz[cite: 63, 67].
app.use("/api/v1/auth", authRoutes); // Login işlemi için genelde key aranmaz ama istersen ekleyebilirsin
app.use("/api/v1/bills", gatewaySubscriptionCheck, billRoutes);
app.use("/api/v1/payment", gatewaySubscriptionCheck, paymentRoutes);
app.use("/api/v1/admin", gatewaySubscriptionCheck, adminRoutes);

/* ====== ROOT ====== */
app.get("/", (req, res) => {
  res.send("Mobile Bill Payment API is running on Render with Custom Gateway 💙");
});

/* ====== ERROR HANDLER ====== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", {
    message: err.message,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  res.status(500).json({ error: "Internal Server Error" });
});

/* ====== START SERVER ====== */
// Render dinamik port atadığı için process.env.PORT kullanımı zorunludur[cite: 106].
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});