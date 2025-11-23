//src/controllers/paymentController.js
import { pool } from "../db/db.js";

export const payBill = async (req, res) => {
  try {
    const { subscriberNo, month, amount } = req.body;

    if (!subscriberNo || !month || !amount) {
      return res.status(400).json({ error: "subscriberNo, month and amount required" });
    }

    // 1) Subscriber'ı bul
    const subResult = await pool.query(
      "SELECT id FROM subscribers WHERE subscriber_no = $1",
      [subscriberNo]
    );

    if (subResult.rows.length === 0) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    const subscriberId = subResult.rows[0].id;

    // 2) Bill'i bul
    const billResult = await pool.query(
      `SELECT id, total_amount, remaining_amount, paid_status
       FROM bills 
       WHERE subscriber_id = $1 AND month = $2`,
      [subscriberId, month]
    );

    if (billResult.rows.length === 0) {
      return res.status(404).json({ error: "Bill not found" });
    }

    const bill = billResult.rows[0];

    // 3) Eğer zaten tamamen ödenmişse
    if (bill.paid_status) {
      return res.json({
        paymentStatus: "Successful",
        remainingAmount: 0
      });
    }

    // 4) Ödeme fazla ise hata
    if (amount > bill.remaining_amount) {
      return res.status(400).json({
        paymentStatus: "Error",
        error: "Amount exceeds remaining balance"
      });
    }

    // 5) Ödeme işlemi (remaining azalt)
    const newRemaining = bill.remaining_amount - amount;
    const isPaid = newRemaining === 0;

    // Update bill
    await pool.query(
      `UPDATE bills 
       SET remaining_amount = $1, paid_status = $2 
       WHERE id = $3`,
      [newRemaining, isPaid, bill.id]
    );

    // payments tablosuna kayıt
    await pool.query(
      `INSERT INTO payments (bill_id, paid_amount)
       VALUES ($1, $2)`,
      [bill.id, amount]
    );

    res.json({
      paymentStatus: "Successful",
      remainingAmount: newRemaining
    });

  } catch (err) {
    console.error("Pay bill error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
