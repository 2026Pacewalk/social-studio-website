import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { sendLeadAlert } from '../mailer.js';

const router = Router();
const STATUSES = ['new', 'contacted', 'won', 'lost'];

// Public: capture a lead from the website contact form
router.post('/', async (req, res) => {
  const b = req.body || {};
  if (b._honey) return res.json({ ok: true }); // bot trap
  const name = String(b.name || '').trim();
  const email = String(b.email || '').trim();
  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Valid email is required' });

  const lead = {
    name,
    email,
    phone: String(b.phone || '').trim(),
    service: String(b.service || '').trim(),
    event_date: String(b.eventDate || b.event_date || '').trim(),
    brand: String(b.brand || '').trim(),
    budget: String(b.budget || '').trim(),
    message: String(b.message || '').trim(),
  };
  const info = db.prepare(`INSERT INTO leads (name, email, phone, service, event_date, brand, budget, message)
    VALUES (@name, @email, @phone, @service, @event_date, @brand, @budget, @message)`).run(lead);
  sendLeadAlert(lead); // fire-and-forget
  res.json({ ok: true, id: info.lastInsertRowid });
});

// Admin: list with optional filters
router.get('/', requireAuth, (req, res) => {
  const { status, q } = req.query;
  let sql = 'SELECT * FROM leads';
  const where = [], params = {};
  if (status && STATUSES.includes(status)) { where.push('status = @status'); params.status = status; }
  if (q) { where.push('(name LIKE @q OR email LIKE @q OR phone LIKE @q OR message LIKE @q)'); params.q = `%${q}%`; }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY created_at DESC';
  const leads = db.prepare(sql).all(params);
  const counts = db.prepare('SELECT status, COUNT(*) n FROM leads GROUP BY status').all()
    .reduce((a, r) => ((a[r.status] = r.n), a), {});
  counts.total = db.prepare('SELECT COUNT(*) n FROM leads').get().n;
  res.json({ leads, counts });
});

router.get('/export.csv', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  const cols = ['id', 'created_at', 'name', 'email', 'phone', 'service', 'event_date', 'brand', 'budget', 'status', 'message', 'notes'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send(csv);
});

router.patch('/:id', requireAuth, (req, res) => {
  const { status, notes } = req.body || {};
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  if (status && !STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare('UPDATE leads SET status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ?')
    .run(status ?? null, notes ?? null, req.params.id);
  res.json({ lead: db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id) });
});

router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
