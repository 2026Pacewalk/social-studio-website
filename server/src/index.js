import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './db.js';
import { UPLOADS_DIR } from './db.js';
import { seed } from './seed.js';
import authRoutes from './routes/auth.js';
import leadRoutes from './routes/leads.js';
import portfolioRoutes from './routes/portfolio.js';
import testimonialRoutes from './routes/testimonials.js';
import userRoutes from './routes/users.js';

seed();

const app = express();
app.use(express.json({ limit: '1mb' }));
if (process.env.CORS_ORIGIN) app.use(cors({ origin: process.env.CORS_ORIGIN.split(',').map((s) => s.trim()) }));
else if (process.env.NODE_ENV !== 'production') app.use(cors());

// Uploaded images
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/users', userRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`[api] Social Studios API listening on http://127.0.0.1:${PORT}`));
