//src/controllers/authController.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";

export const loginSubscriber = async (req, res) => {
  try {
    const { subscriberNo, pin } = req.body;

    if (!subscriberNo || !pin) {
      return res.status(400).json({ error: "subscriberNo and pin required" });
    }

    // Find subscriber
    const result = await pool.query(
      "SELECT * FROM subscribers WHERE subscriber_no = $1",
      [subscriberNo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    const subscriber = result.rows[0];

    // Compare pin with hash
    const isValid = await bcrypt.compare(pin, subscriber.pin_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid pin" });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: subscriber.id,
        subscriberNo: subscriber.subscriber_no,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const registerSubscriber = async (req, res) => {
  try {
    const { subscriberNo, pin } = req.body;

    if (!subscriberNo || !pin) {
      return res.status(400).json({ error: "subscriberNo and pin required" });
    }

    // Check if subscriber exists
    const exists = await pool.query(
      "SELECT * FROM subscribers WHERE subscriber_no = $1",
      [subscriberNo]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Subscriber already exists" });
    }

    // Hash PIN
    const pinHash = await bcrypt.hash(pin, 10);

    // Insert subscriber
    const result = await pool.query(
      "INSERT INTO subscribers (subscriber_no, pin_hash) VALUES ($1, $2) RETURNING *",
      [subscriberNo, pinHash]
    );

    res.json({
      message: "Subscriber registered successfully",
      subscriber: result.rows[0],
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }

    // Check if admin exists
    const exists = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Admin already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin
    const result = await pool.query(
      `INSERT INTO admins (username, password_hash, role)
       VALUES ($1, $2, 'admin') RETURNING id, username, role`,
      [username, passwordHash]
    );

    res.json({
      message: "Admin registered successfully",
      admin: result.rows[0],
    });
  } catch (err) {
    console.error("Admin register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    // Find admin
    const result = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const admin = result.rows[0];

    // Compare password
    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Admin login successful",
      token
    });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
