import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import exemplificationRouter from './routes/exemplification.js';
import catRouter from './routes/cat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5051;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes); 
app.use('/api/exemplification', exemplificationRouter);
app.use('/api/cat', catRouter);

app.get('/', (req, res) => res.send('Backend running'));

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
