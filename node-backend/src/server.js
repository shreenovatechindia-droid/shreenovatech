require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const path      = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

// ── Trust Proxy (Render/Vercel) ──────────────────────────────
app.set('trust proxy', 1);

// ── Security ──────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      cb(null, true);
    } else {
      cb(null, true); // Allow all in production for now
    }
  },
  credentials: true,
}));

// ── Rate Limiting ─────────────────────────────────────────────
app.use('/api/auth/login', rateLimit({ windowMs: 60_000, max: 10 }));
app.use('/api', rateLimit({ windowMs: 60_000, max: 300 }));

// ── Body Parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/dashboard',    require('./routes/dashboard'));
app.use('/api/bookings',     require('./routes/bookings'));
app.use('/api/payments',     require('./routes/payments'));
app.use('/api/contact',      require('./routes/contacts'));
app.use('/api/portfolio',    require('./routes/portfolio'));
app.use('/api/pricing',      require('./routes/pricing'));
app.use('/api/settings',     require('./routes/settings'));
app.use('/api/users',        require('./routes/users'));
app.use('/api/stats',        require('./routes/analytics'));
app.use('/api/hosting',      require('./routes/hosting'));
app.use('/api/notifications',require('./routes/notifications'));
app.use('/api/faq',          require('./routes/faq'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/track',        require('./routes/track'));
app.use('/api/newsletter',   require('./routes/newsletter'));
app.use('/api/blog',         require('./routes/blog'));
app.use('/api/media',        require('./routes/media'));

// ── Health Check ──────────────────────────────────────────────
app.get('/api', (req, res) =>
  res.json({ success: true, message: 'ShreeNova Tech API v1.0', status: 'running' })
);

// ── 404 ───────────────────────────────────────────────────────
app.use('/api/*', (req, res) =>
  res.status(404).json({ success: false, message: 'API endpoint not found' })
);

// ── Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Local Dev Server ──────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`✅ ShreeNova Tech API running on http://localhost:${PORT}/api`)
  );
}

// ── Vercel Export ─────────────────────────────────────────────
module.exports = app;
