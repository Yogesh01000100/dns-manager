import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import dnsRoutes from './src/routes/dnsRoute.js';

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
  res.send('# test!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});