import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import apiRoutes from './routes/index.js';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database pool
export const dbPool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'defect_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use('/api', apiRoutes);

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log(`[dms-server] http://localhost:${port}`));
