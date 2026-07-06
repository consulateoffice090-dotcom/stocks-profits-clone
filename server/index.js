import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import depositRouter from './routes/deposit.js';
import './database.js'; // initialize DB on startup

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: true, // Allow any origin
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/deposit', depositRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── Static files (production build) ────────────────────────────────────────
// Serve the Vite dist folder when running in production mode
const DIST = path.join(__dirname, '..', 'dist');
app.use(express.static(DIST));

// Fallback: serve index.html for non-API routes
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Stocks Profits API running at http://localhost:${PORT}`);
  console.log(`📡  API endpoints:`);
  console.log(`    POST /api/auth/register`);
  console.log(`    POST /api/auth/login`);
  console.log(`    GET  /api/auth/me`);
  console.log(`    GET  /api/deposit/wallets`);
  console.log(`    POST /api/deposit/submit`);
  console.log(`    GET  /api/deposit/history`);
  console.log(`    GET  /api/health\n`);
});
