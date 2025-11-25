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
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// JSON output for APIM
/*app.get("/api-docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});*/
app.get("/api-docs-json", (req, res) => {
  res.type("application/json");
  res.status(200).json(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bills", billRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(morgan(":method :url :status :response-time ms - :remote-addr"));

app.get("/", (req, res) => {
  res.send("Mobile Bill Payment API is running 💙");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});

app.use((err, req, res, next) => {
  console.error("❌ Error:", {
    message: err.message,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  res.status(500).json({ error: "Internal Server Error" });
});
