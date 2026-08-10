import express from 'express';
import cors from 'cors';
// @ts-ignore
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';
import adminRoutes from './routes/adminRoutes';
import customerRoutes from './routes/customerRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);

app.get('/', (req, res) => {
  res.send('Bengkel API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
