//src/middleware/rateLimitMiddleware.js
import { pool } from "../db/db.js";

export const rateLimitQueryBill = async (req, res, next) => {
  try {
    const subscriberNo = req.subscriber.subscriberNo;
    const today = new Date().toISOString().split("T")[0];

    // Check existing record
    const result = await pool.query(
      "SELECT * FROM rate_limits WHERE subscriber_no = $1 AND date = $2",
      [subscriberNo, today]
    );

    if (result.rows.length > 0) {
      const record = result.rows[0];

      if (record.count >= 3) {
        return res
          .status(429)
          .json({ error: "Daily limit reached (3 requests per day)" });
      }

      // Increase count
      await pool.query(
        "UPDATE rate_limits SET count = count + 1 WHERE id = $1",
        [record.id]
      );
    } else {
      // Create new record
      await pool.query(
        "INSERT INTO rate_limits (subscriber_no, date, count) VALUES ($1, $2, 1)",
        [subscriberNo, today]
      );
    }

    next();
  } catch (err) {
    console.error("Rate limit error:", err);
    res.status(500).json({ error: "Rate limit failed" });
  }
};
