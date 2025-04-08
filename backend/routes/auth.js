// backend/routes/auth.js
import express from 'express';
import dotenv from 'dotenv';
import pkg from 'pg';
import bcrypt from 'bcrypt';

dotenv.config();

const router = express.Router();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

// ✅ Check if user exists and determine role
router.get('/check-user', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const result = await pool.query('SELECT role FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.json({ exists: false });

    res.json({ exists: true, role: result.rows[0].role });
  } catch (err) {
    console.error('❌ Check User Error:', err.message);
    res.status(500).json({ error: 'Failed to check user' });
  }
});

// ✅ Register route (always registers end_user)
router.post('/register', async (req, res) => {
  const { first_name, last_name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, NULL, $4) RETURNING *',
      [first_name, last_name, email, 'end_user']
    );
    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (err) {
    console.error('❌ Registration Error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ✅ Admin login route (email + password)
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (role !== 'admin') return res.status(400).json({ error: 'Only admin login supported here' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'admin']);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Admin not found' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;