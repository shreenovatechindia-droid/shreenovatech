require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const path       = require('path');
const rateLimit  = require('express-rate-limit');

const app = express();

// ── Security & Logging ────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('dev'));

// ── CORS ──────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));

// ── Rate Limiting ─────────────────────────────────────────────
app.use('/api/auth/login', rateLimit({ windowMs: 60_000, max: 10, message: { success: false, message: 'Too many requests' } }));
app.use('/api',            rateLimit({ windowMs: 60_000, max: 300 }));

// ── Body Parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static Uploads ────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/bookings',  require('./routes/bookings'));
app.use('/api/payments',  require('./routes/payments'));
app.use('/api/contact',   require('./routes/contacts'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/pricing',   require('./routes/pricing'));
app.use('/api/settings',  require('./routes/settings'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/stats',     require('./routes/analytics'));
app.use('/api/hosting',   require('./routes/hosting'));

// ── Health Check ──────────────────────────────────────────────
app.get('/api', (req, res) => res.json({ success: true, message: 'ShreeNova Tech API v1.0', status: 'running' }));

// ── 404 ───────────────────────────────────────────────────────
app.use('/api/*', (req, res) => res.status(404).json({ success: false, message: 'API endpoint not found' }));

// ── Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ ShreeNova Tech API running on http://localhost:${PORT}/api`);
});
