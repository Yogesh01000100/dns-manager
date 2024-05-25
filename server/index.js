import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { initializeDnsData } from './src/utils/initializeDnsData.js';
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import dnsRoutes from './src/routes/dnsRoutes.js';

const app = express();
app.use(express.json());
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());


app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/dns', dnsRoutes);

app.get('/', (req, res) => {
  res.send('#### test!');
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    if (process.env.RUN_INIT === 'true') {
      await initializeDnsData();
      console.log('DNS data initialization completed successfully.');
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
}

startServer();