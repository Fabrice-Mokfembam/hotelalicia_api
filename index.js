import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import lockRoutes from './routes/lockRoutes.js';

const app = express();
app.use(bodyParser.json());

const { PORT } = process.env;

app.use('/auth', authRoutes);
app.use('/locks', lockRoutes);

app.listen(PORT || 3000, () => {
  console.log(`TTLock API proxy running on port ${PORT || 3000}`);
});
