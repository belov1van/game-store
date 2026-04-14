import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRouter from './routes/auth';
import gamesRouter from './routes/games';
import usersRouter from './routes/users';
import ordersRouter from './routes/orders';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();

// Uploads directory
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

// Static uploads
app.use('/api/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/games', gamesRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  },
);

export default app;
