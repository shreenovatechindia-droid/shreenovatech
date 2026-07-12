const router = require('express').Router();
const db     = require('../config/db');
const { ok } = require('../middleware/helpers');

router.post('/', async (req, res) => {
  try {
    const { page, referrer } = req.body;
    const ip        = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || '';
    const userAgent = req.headers['user-agent'] || '';
    const today     = new Date().toISOString().slice(0, 10);
    await db.execute(
      'INSERT INTO visitors (ip_address,page,user_agent,referrer,visit_date) VALUES (?,?,?,?,?)',
      [ip, page||'/', userAgent, referrer||'', today]
    );
  } catch {}
  ok(res, null, 'Tracked');
});

module.exports = router;
