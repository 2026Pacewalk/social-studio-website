import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
const ROLES = ['admin', 'editor'];

router.use(requireAuth, requireRole('admin'));

router.get('/', (_req, res) => {
  res.json({ users: db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC').all() });
});

router.post('/', (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (db.prepare('SELECT 1 FROM users WHERE email = ? COLLATE NOCASE').get(email.trim())) {
    return res.status(409).json({ error: 'A user with that email already exists' });
  }
  const info = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
    .run(name.trim(), email.trim(), bcrypt.hashSync(password, 10), ROLES.includes(role) ? role : 'editor');
  res.json({ user: db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(info.lastInsertRowid) });
});

router.patch('/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, role, password } = req.body || {};
  // Don't allow demoting the last admin
  if (role && role !== user.role && user.role === 'admin' && role !== 'admin') {
    const admins = db.prepare("SELECT COUNT(*) n FROM users WHERE role = 'admin'").get().n;
    if (admins <= 1) return res.status(400).json({ error: 'Cannot demote the only admin' });
  }
  db.prepare('UPDATE users SET name = COALESCE(?, name), role = COALESCE(?, role) WHERE id = ?')
    .run(name ?? null, ROLES.includes(role) ? role : null, user.id);
  if (password) {
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), user.id);
  }
  res.json({ user: db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(user.id) });
});

router.delete('/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.id === req.user.id) return res.status(400).json({ error: 'You cannot delete your own account' });
  if (user.role === 'admin') {
    const admins = db.prepare("SELECT COUNT(*) n FROM users WHERE role = 'admin'").get().n;
    if (admins <= 1) return res.status(400).json({ error: 'Cannot delete the only admin' });
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
  res.json({ ok: true });
});

export default router;
