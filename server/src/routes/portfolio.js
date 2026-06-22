import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import db from '../db.js';
import { UPLOADS_DIR } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const ASPECTS = ['tall', 'wide', 'square'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase().replace(/[^.a-z0-9]/g, '');
    cb(null, `${Date.now()}-${crypto.randomBytes(5).toString('hex')}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

// Parse the stored gallery JSON into an array for API responses
function serialize(row) {
  let gallery = [];
  try { gallery = JSON.parse(row.gallery || '[]'); } catch { gallery = []; }
  return { ...row, gallery: Array.isArray(gallery) ? gallery : [] };
}

// Public: published items
router.get('/', (_req, res) => {
  res.json({ items: db.prepare('SELECT * FROM portfolio WHERE published = 1 ORDER BY sort_order ASC, id ASC').all().map(serialize) });
});

// Admin: all items
router.get('/all', requireAuth, (_req, res) => {
  res.json({ items: db.prepare('SELECT * FROM portfolio ORDER BY sort_order ASC, id ASC').all().map(serialize) });
});

router.post('/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

function payload(b) {
  let gallery = [];
  if (Array.isArray(b.gallery)) gallery = b.gallery;
  else if (typeof b.gallery === 'string') { try { const g = JSON.parse(b.gallery); if (Array.isArray(g)) gallery = g; } catch { gallery = []; } }
  gallery = gallery.filter((x) => typeof x === 'string' && x.trim()).slice(0, 40);
  return {
    title: String(b.title || '').trim(),
    category: String(b.category || '').trim(),
    year: String(b.year || '').trim(),
    description: String(b.description || '').trim(),
    image: String(b.image || '').trim(),
    gallery: JSON.stringify(gallery),
    aspect: ASPECTS.includes(b.aspect) ? b.aspect : 'wide',
    sort_order: Number.isFinite(+b.sort_order) ? +b.sort_order : 0,
    published: b.published === false || b.published === 0 ? 0 : 1,
  };
}

router.post('/', requireAuth, (req, res) => {
  const p = payload(req.body);
  if (!p.title || !p.category || !p.image) return res.status(400).json({ error: 'Title, category and a cover image are required' });
  const info = db.prepare(`INSERT INTO portfolio (title, category, year, description, image, gallery, aspect, sort_order, published)
    VALUES (@title, @category, @year, @description, @image, @gallery, @aspect, @sort_order, @published)`).run(p);
  res.json({ item: serialize(db.prepare('SELECT * FROM portfolio WHERE id = ?').get(info.lastInsertRowid)) });
});

router.patch('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM portfolio WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Item not found' });
  const p = payload({ ...existing, ...req.body });
  db.prepare(`UPDATE portfolio SET title=@title, category=@category, year=@year, description=@description,
    image=@image, gallery=@gallery, aspect=@aspect, sort_order=@sort_order, published=@published WHERE id=@id`).run({ ...p, id: existing.id });
  res.json({ item: serialize(db.prepare('SELECT * FROM portfolio WHERE id = ?').get(existing.id)) });
});

router.delete('/:id', requireAuth, (req, res) => {
  const item = db.prepare('SELECT * FROM portfolio WHERE id = ?').get(req.params.id);
  // remove uploaded files (cover + gallery), skipping the seeded /assets ones
  const urls = [item?.image, ...(() => { try { return JSON.parse(item?.gallery || '[]'); } catch { return []; } })()];
  urls.forEach((u) => {
    if (typeof u === 'string' && u.startsWith('/uploads/')) {
      try { fs.unlinkSync(path.join(UPLOADS_DIR, path.basename(u))); } catch { /* ignore */ }
    }
  });
  db.prepare('DELETE FROM portfolio WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
