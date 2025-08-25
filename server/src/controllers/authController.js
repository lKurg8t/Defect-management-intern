import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dbPool } from '../index.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const [rows] = await dbPool.query(
      'SELECT id, uuid, username, email, password_hash, full_name, role, status FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    try { await dbPool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]); } catch {}
    const payload = { sub: user.uuid, uid: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '8h' });
    return res.json({
      token,
      user: { id: user.id, uuid: user.uuid, username: user.username, email: user.email, fullName: user.full_name, role: user.role, status: user.status }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const me = async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const token = auth.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    const [rows] = await dbPool.query(
      'SELECT id, uuid, username, email, full_name, role, status FROM users WHERE uuid = ? LIMIT 1',
      [payload.sub]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const u = rows[0];
    return res.json({ id: u.id, uuid: u.uuid, username: u.username, email: u.email, fullName: u.full_name, role: u.role, status: u.status });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const logout = (req, res) => res.status(204).end();

export const seedAdmin = async (req, res) => {
  try {
    if ((process.env.ALLOW_SEED || '').toLowerCase() !== 'true') return res.status(403).json({ error: 'Seeding disabled' });
    const { username = 'admin', email = 'admin@example.com', password = 'admin123', full_name = 'System Administrator', role = 'ADMIN' } = req.body || {};
    const [exists] = await dbPool.query('SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1', [email, username]);
    if (exists.length > 0) return res.status(409).json({ error: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await dbPool.query(
      'INSERT INTO users (uuid, username, email, password_hash, full_name, role, status, created_at, updated_at) VALUES (UUID(),?,?,?,?,?,"ACTIVE", NOW(), NOW())',
      [username, email, hash, full_name, role]
    );
    return res.status(201).json({ id: result.insertId, username, email, full_name, role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
