import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 13005;
const SECRET_KEY = 'supersecret_jwt_key_should_be_in_env_but_fine_for_now';

app.use(express.json());

// Init DB
const db = new Database('navcube.db');
db.pragma('journal_mode = WAL');

// Define Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    name TEXT,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    user_id INTEGER PRIMARY KEY,
    language TEXT DEFAULT 'zh',
    data TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    parent_id TEXT,
    name TEXT NOT NULL,
    icon TEXT,
    icon_color TEXT,
    text_color TEXT,
    position_order INTEGER DEFAULT 0,
    is_expanded INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    title_font TEXT DEFAULT 'Inter',
    title_color TEXT DEFAULT '#1f2937',
    url TEXT NOT NULL DEFAULT '',
    url_font TEXT DEFAULT 'Inter',
    url_color TEXT DEFAULT '#6b7280',
    url_external TEXT NOT NULL DEFAULT '',
    url_external_font TEXT DEFAULT 'Inter',
    url_external_color TEXT DEFAULT '#6b7280',
    description TEXT DEFAULT '',
    description_font TEXT DEFAULT 'Inter',
    description_color TEXT DEFAULT '#6b7280',
    icon_url TEXT DEFAULT '',
    icon_color TEXT DEFAULT '#6b7280',
    text_color TEXT DEFAULT '#374151',
    position_order INTEGER DEFAULT 0,
    show_description INTEGER DEFAULT 0,
    show_url INTEGER DEFAULT 0,
    show_url_external INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );
 `);

// Middleware for Auth
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const stmt = db.prepare('INSERT INTO users (username, password_hash, salt, name, avatar) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(username, hash, salt, username, '');
    
    const userId = info.lastInsertRowid;
    const settingsStmt = db.prepare("INSERT INTO settings (user_id, language, data) VALUES (?, ?, ?)");
    settingsStmt.run(userId, 'zh', '{}');

    // Create a root category
    const rootCatStmt = db.prepare("INSERT INTO categories (id, user_id, parent_id, name) VALUES (?, ?, ?, ?)");
    rootCatStmt.run('root', userId, null, '所有 (Root)');

    res.json({ success: true });
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
  if (!user) return res.status(400).json({ error: 'Invalid username or password' });

  const isValid = bcrypt.compareSync(password, user.password_hash);
  if (!isValid) return res.status(400).json({ error: 'Invalid username or password' });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
  res.json({ token, user: { id: user.id, username: user.username, name: user.name, avatar: user.avatar } });
});

// Settings & User Info
app.get('/api/user/info', authenticateToken, (req: any, res) => {
  const user = db.prepare('SELECT id, username, name, avatar FROM users WHERE id = ?').get(req.user.id);
  const settings = db.prepare('SELECT language, data FROM settings WHERE user_id = ?').get(req.user.id);
  res.json({ user, settings });
});

app.put('/api/user/info', authenticateToken, (req: any, res) => {
  const { name, avatar, password } = req.body;
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    db.prepare('UPDATE users SET name = ?, avatar = ?, password_hash = ?, salt = ? WHERE id = ?').run(name, avatar, hash, salt, req.user.id);
  } else {
    db.prepare('UPDATE users SET name = ?, avatar = ? WHERE id = ?').run(name, avatar, req.user.id);
  }
  res.json({ success: true });
});

app.put('/api/user/settings', authenticateToken, (req: any, res) => {
  const { language, data } = req.body;
  db.prepare('UPDATE settings SET language = ?, data = ? WHERE user_id = ?').run(language, JSON.stringify(data), req.user.id);
  res.json({ success: true });
});

app.get('/api/data', authenticateToken, (req: any, res) => {
  const categories = db.prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY position_order ASC').all(req.user.id);
  const tags = db.prepare('SELECT * FROM tags WHERE user_id = ? ORDER BY position_order ASC').all(req.user.id);
  res.json({ categories, tags });
});

app.post('/api/categories', authenticateToken, (req: any, res) => {
  const { id, parent_id, name, icon, icon_color, text_color, position_order, is_expanded } = req.body;
  db.prepare('INSERT INTO categories (id, user_id, parent_id, name, icon, icon_color, text_color, position_order, is_expanded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, req.user.id, parent_id, name, icon || '', icon_color || '', text_color || '', position_order || 0, is_expanded ? 1 : 0);
  res.json({ success: true });
});

app.put('/api/categories/:id', authenticateToken, (req: any, res) => {
  const { parent_id, name, icon, icon_color, text_color, position_order, is_expanded } = req.body;
  db.prepare('UPDATE categories SET parent_id = ?, name = ?, icon = ?, icon_color = ?, text_color = ?, position_order = ?, is_expanded = ? WHERE id = ? AND user_id = ?')
    .run(parent_id, name, icon || '', icon_color || '', text_color || '', position_order || 0, is_expanded ? 1 : 0, req.params.id, req.user.id);
  res.json({ success: true });
});

app.delete('/api/categories/:id', authenticateToken, (req: any, res) => {
  db.prepare('DELETE FROM tags WHERE category_id = ? AND user_id = ?').run(req.params.id, req.user.id);
  db.prepare('DELETE FROM categories WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

app.post('/api/tags', authenticateToken, (req: any, res) => {
  const { id, category_id, title, title_font, title_color, url, url_font, url_color, url_external, url_external_font, url_external_color, description, description_font, description_color, icon_url, icon_color, text_color, position_order, show_description, show_url, show_url_external } = req.body;
  db.prepare(`INSERT INTO tags (id, user_id, category_id, title, title_font, title_color, url, url_font, url_color, url_external, url_external_font, url_external_color, description, description_font, description_color, icon_url, icon_color, text_color, position_order, show_description, show_url, show_url_external) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, req.user.id, category_id, title, title_font || 'Inter', title_color || '#1f2937', url || '', url_font || 'Inter', url_color || '#6b7280', url_external || '', url_external_font || 'Inter', url_external_color || '#6b7280', description || '', description_font || 'Inter', description_color || '#6b7280', icon_url || '', icon_color || '#6b7280', text_color || '#374151', position_order || 0, show_description ? 1 : 0, show_url ? 1 : 0, show_url_external ? 1 : 0);
  res.json({ success: true });
});

app.put('/api/tags/:id', authenticateToken, (req: any, res) => {
  const { category_id, title, title_font, title_color, url, url_font, url_color, url_external, url_external_font, url_external_color, description, description_font, description_color, icon_url, icon_color, text_color, position_order, show_description, show_url, show_url_external } = req.body;
  db.prepare(`UPDATE tags SET category_id = ?, title = ?, title_font = ?, title_color = ?, url = ?, url_font = ?, url_color = ?, url_external = ?, url_external_font = ?, url_external_color = ?, description = ?, description_font = ?, description_color = ?, icon_url = ?, icon_color = ?, text_color = ?, position_order = ?, show_description = ?, show_url = ?, show_url_external = ? WHERE id = ? AND user_id = ?`)
    .run(category_id, title, title_font || 'Inter', title_color || '#1f2937', url || '', url_font || 'Inter', url_color || '#6b7280', url_external || '', url_external_font || 'Inter', url_external_color || '#6b7280', description || '', description_font || 'Inter', description_color || '#6b7280', icon_url || '', icon_color || '#6b7280', text_color || '#374151', position_order || 0, show_description ? 1 : 0, show_url ? 1 : 0, show_url_external ? 1 : 0, req.params.id, req.user.id);
  res.json({ success: true });
});

app.delete('/api/tags/:id', authenticateToken, (req: any, res) => {
  db.prepare('DELETE FROM tags WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

// Admin DB endpoints
app.get('/api/admin/tables', authenticateToken, (req: any, res) => {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  res.json({ tables: tables.map((t: any) => t.name) });
});

app.get('/api/admin/tables/:tableName', authenticateToken, (req: any, res) => {
  const { tableName } = req.params;
  // very basic protection, this is a local user db
  const validTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?").get(tableName);
  if (!validTables) return res.status(400).json({error: 'Invalid table'});
  const data = db.prepare(`SELECT * FROM ${tableName}`).all(); // UNSAFE in prod, but ok for this required feature
  res.json({ data });
});

app.post('/api/admin/sql', authenticateToken, (req: any, res) => {
  const { sql } = req.body;
  try {
    const result = db.prepare(sql).run();
    res.json({ success: true, changes: result.changes });
  } catch(err: any) {
    res.status(400).json({ error: err.message });
  }
});


async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
