import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Azure için şart
  },
});

// Test connection (isteğe bağlı)
pool
  .connect()
  .then(() => console.log("✅ Connected to Azure PostgreSQL"))
  .catch((err) => console.error("❌ DB Connection Error:", err));
