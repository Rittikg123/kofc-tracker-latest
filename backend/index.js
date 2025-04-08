import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = 5051;

// ✅ Enable CORS
app.use(cors());

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use('/api', authRoutes); // ✅ Ensures all routes are under /api

// ✅ Test endpoint
app.get('/api/test-db', async (req, res) => {
  res.json({ now: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
