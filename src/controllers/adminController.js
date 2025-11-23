//src/controllers/adminController.js
import { pool } from "../db/db.js";
import csv from "fast-csv";

export const addBill = async (req, res) => {
  try {
    const { subscriberNo, month, totalAmount } = req.body;

    if (!subscriberNo || !month || !totalAmount) {
      return res
        .status(400)
        .json({ error: "subscriberNo, month and totalAmount are required" });
    }

    // subscriber exists?
    const subResult = await pool.query(
      "SELECT id FROM subscribers WHERE subscriber_no = $1",
      [subscriberNo]
    );

    if (subResult.rows.length === 0) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    const subscriberId = subResult.rows[0].id;

    // Check for duplicate bill
    const billExists = await pool.query(
      `SELECT id FROM bills WHERE subscriber_id = $1 AND month = $2`,
      [subscriberId, month]
    );

    if (billExists.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Bill already exists for this month" });
    }

    // Insert new bill
    await pool.query(
      `INSERT INTO bills (subscriber_id, month, total_amount, remaining_amount, paid_status)
       VALUES ($1, $2, $3, $3, false)`,
      [subscriberId, month, totalAmount]
    );

    res.json({
      transactionStatus: "Success",
    });
  } catch (err) {
    console.error("Add bill error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const addBillDetail = async (req, res) => {
  try {
    const { subscriberNo, month, type, amount } = req.body;

    if (!subscriberNo || !month || !type || !amount) {
      return res.status(400).json({
        error: "subscriberNo, month, type and amount are required",
      });
    }

    // 1) Subscriber var mı?
    const subResult = await pool.query(
      "SELECT id FROM subscribers WHERE subscriber_no = $1",
      [subscriberNo]
    );

    if (subResult.rows.length === 0) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    const subscriberId = subResult.rows[0].id;

    // 2) Bill var mı?
    const billResult = await pool.query(
      `SELECT id FROM bills WHERE subscriber_id = $1 AND month = $2`,
      [subscriberId, month]
    );

    if (billResult.rows.length === 0) {
      return res.status(404).json({ error: "Bill not found for that month" });
    }

    const billId = billResult.rows[0].id;

    // 3) bill_detail ekle
    await pool.query(
      `INSERT INTO bill_details (bill_id, type, amount)
       VALUES ($1, $2, $3)`,
      [billId, type, amount]
    );

    res.json({
      transactionStatus: "Success",
      billId,
      detail: { type, amount },
    });
  } catch (err) {
    console.error("Add bill detail error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const addBillBatch = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required" });
    }

    const results = [];
    const success = [];
    const failed = [];

    const stream = csv.parseString(req.file.buffer.toString("utf-8"), {
      headers: true,
      ignoreEmpty: true,
      trim: true,
    });

    stream.on("error", (error) => console.error(error));

    stream.on("data", (row) => {
      results.push(row);
    });

    stream.on("end", async () => {
      for (const row of results) {
        const { subscriberNo, month, totalAmount } = row;

        try {
          // Subscriber exists?
          const subResult = await pool.query(
            "SELECT id FROM subscribers WHERE subscriber_no = $1",
            [subscriberNo]
          );

          if (subResult.rows.length === 0) {
            failed.push({
              subscriberNo,
              month,
              reason: "Subscriber not found",
            });
            continue;
          }

          const subscriberId = subResult.rows[0].id;

          // Duplicate bill check
          const billExists = await pool.query(
            `SELECT id FROM bills WHERE subscriber_id = $1 AND month = $2`,
            [subscriberId, month]
          );

          if (billExists.rows.length > 0) {
            failed.push({
              subscriberNo,
              month,
              reason: "Bill already exists",
            });
            continue;
          }

          // Insert bill
          await pool.query(
            `INSERT INTO bills (subscriber_id, month, total_amount, remaining_amount, paid_status)
             VALUES ($1, $2, $3, $3, false)`,
            [subscriberId, month, totalAmount]
          );

          success.push({ subscriberNo, month });
        } catch (err) {
          failed.push({
            subscriberNo,
            month,
            reason: "Unknown error",
          });
        }
      }

      res.json({
        transactionStatus: "Completed",
        success,
        failed,
      });
    });
  } catch (err) {
    console.error("Batch add bill error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
