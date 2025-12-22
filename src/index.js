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
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(morgan(":method :url :status :response-time ms - :remote-addr"));

/* ====== SWAGGER ====== */
app.get("/api-docs-json", (req, res) => {
  res.status(200).json(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ====== ROUTES ====== */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bills", billRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

/* ====== ROOT ====== */
app.get("/", (req, res) => {
  res.send("Mobile Bill Payment API is running 💙");
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
