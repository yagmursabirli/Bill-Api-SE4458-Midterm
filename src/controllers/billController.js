//src/controllers/billController.js
import { pool } from "../db/db.js";

export const queryBill = async (req, res) => {
  try {
    const subscriberId = req.subscriber.id;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "month is required" });
    }

    const result = await pool.query(
      `SELECT total_amount, paid_status 
       FROM bills 
       WHERE subscriber_id = $1 AND month = $2`,
      [subscriberId, month]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bill not found" });
    }

    const bill = result.rows[0];

    res.json({
      subscriberNo: req.subscriber.subscriberNo,
      month,
      totalAmount: bill.total_amount,
      paidStatus: bill.paid_status,
    });
  } catch (err) {
    console.error("Query bill error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const queryBillDetailed = async (req, res) => {
  try {
    const subscriberId = req.subscriber.id;
    const { month, limit = 10, offset = 0 } = req.query;

    if (!month) {
      return res.status(400).json({ error: "month is required" });
    }

    // 1) Bill'i bul
    const billResult = await pool.query(
      `SELECT id, total_amount, paid_status 
       FROM bills 
       WHERE subscriber_id = $1 AND month = $2`,
      [subscriberId, month]
    );

    if (billResult.rows.length === 0) {
      return res.status(404).json({ error: "Bill not found" });
    }

    const bill = billResult.rows[0];

    // 2) Details sayısını al
    const countResult = await pool.query(
      `SELECT COUNT(*) 
       FROM bill_details 
       WHERE bill_id = $1`,
      [bill.id]
    );
    const totalDetails = parseInt(countResult.rows[0].count);

    // 3) Details çek
    const detailsResult = await pool.query(
      `SELECT type, amount 
       FROM bill_details 
       WHERE bill_id = $1 
       LIMIT $2 OFFSET $3`,
      [bill.id, limit, offset]
    );

    res.json({
      subscriberNo: req.subscriber.subscriberNo,
      month,
      totalAmount: bill.total_amount,
      paidStatus: bill.paid_status,
      details: detailsResult.rows,
      paging: {
        limit: Number(limit),
        offset: Number(offset),
        count: totalDetails,
      },
    });
  } catch (err) {
    console.error("Query detailed bill error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const bankingQueryBill = async (req, res) => {
  try {
    const subscriberId = req.subscriber.id;

    // Fetch unpaid bills
    const result = await pool.query(
      `SELECT month, total_amount, remaining_amount
       FROM bills
       WHERE subscriber_id = $1 AND paid_status = false
       ORDER BY month DESC`,
      [subscriberId]
    );

    res.json({
      subscriberNo: req.subscriber.subscriberNo,
      unpaidBills: result.rows,
    });
  } catch (err) {
    console.error("Banking query bill error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
