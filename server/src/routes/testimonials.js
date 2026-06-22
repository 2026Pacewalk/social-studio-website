import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const initialsOf = (author) => String(author || '').split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

router.get('/', (_req, res) => {
  res.json({ items: db.prepare('SELECT * FROM testimonials WHERE published = 1 ORDER BY sort_order ASC, id ASC').all() });
});

router.get('/all', requireAuth, (_req, res) => {
  res.json({ items: db.prepare('SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC').all() });
});

function payload(b) {
  const author = String(b.author || '').trim();
  return {
    text: String(b.text || '').trim(),
    author,
    role: String(b.role || '').trim(),
    rating: Math.min(5, Math.max(1, parseInt(b.rating, 10) || 5)),
    initials: String(b.initials || '').trim() || initialsOf(author),
    sort_order: Number.isFinite(+b.sort_order) ? +b.sort_order : 0,
    published: b.published === false || b.published === 0 ? 0 : 1,
  };
}

router.post('/', requireAuth, (req, res) => {
  const p = payload(req.body);
  if (!p.text || !p.author) return res.status(400).json({ error: 'Quote and author are required' });
  const info = db.prepare(`INSERT INTO testimonials (text, author, role, rating, initials, sort_order, published)
    VALUES (@text, @author, @role, @rating, @initials, @sort_order, @published)`).run(p);
  res.json({ item: db.prepare('SELECT * FROM testimonials WHERE id = ?').get(info.lastInsertRowid) });
});

router.patch('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const p = payload({ ...existing, ...req.body });
  db.prepare(`UPDATE testimonials SET text=@text, author=@author, role=@role, rating=@rating,
    initials=@initials, sort_order=@sort_order, published=@published WHERE id=@id`).run({ ...p, id: existing.id });
  res.json({ item: db.prepare('SELECT * FROM testimonials WHERE id = ?').get(existing.id) });
});

router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
