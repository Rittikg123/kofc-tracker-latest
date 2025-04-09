import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

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

// 1. Check if user exists
router.get('/check-user', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const result = await pool.query('SELECT role FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.json({ exists: false });
    return res.json({ exists: true, role: result.rows[0].role });
  } catch (err) {
    console.error('❌ Check Error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Register end_user
router.post('/register', async (req, res) => {
  const { first_name, last_name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, NULL, $4) RETURNING *',
      [first_name, last_name, email, 'end_user']
    );
    return res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (err) {
    console.error('❌ Register Error:', err.message);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// 3. Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'admin']);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Admin not found' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    return res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// 🔁 ADMIN MENU ROUTES

// Get all users (for admin menu)
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, first_name, last_name, email, role FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Fetch Users Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Promote end_user to admin WITH custom password
router.put('/users/:id/promote', async (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;

  if (!password) return res.status(400).json({ error: 'Password is required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET role = $1, password = $2 WHERE id = $3',
      ['admin', hashed, userId]
    );
    res.json({ message: '✅ User promoted to admin with custom password' });
  } catch (err) {
    console.error('❌ Promotion Error:', err.message);
    res.status(500).json({ error: 'Promotion failed' });
  }
});

// Demote admin to end_user
router.put('/users/:id/demote', async (req, res) => {
  const userId = req.params.id;
  try {
    await pool.query('UPDATE users SET role = $1, password = NULL WHERE id = $2', ['end_user', userId]);
    res.json({ message: 'User demoted to end_user' });
  } catch (err) {
    console.error('❌ Demotion Error:', err.message);
    res.status(500).json({ error: 'Demotion failed' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('❌ Deletion Error:', err.message);
    res.status(500).json({ error: 'Deletion failed' });
  }
});

export default router;