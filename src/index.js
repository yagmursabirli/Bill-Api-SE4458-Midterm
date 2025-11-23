//src/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { swaggerSpec, swaggerUi } from "./swagger.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// JSON output for APIM
app.get("/api-docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bills", billRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);



app.get("/", (req, res) => {
  res.send("Mobile Bill Payment API is running 💙");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
