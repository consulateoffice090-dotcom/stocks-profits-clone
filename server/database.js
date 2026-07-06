import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'database.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    password    TEXT    NOT NULL,
    balance     REAL    NOT NULL DEFAULT 200.00,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// Create transactions table
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    type        TEXT    NOT NULL,
    amount      REAL    NOT NULL,
    crypto      TEXT,
    wallet      TEXT,
    tx_hash     TEXT,
    status      TEXT    NOT NULL DEFAULT 'confirmed',
    note        TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

console.log('✔  Database initialized at', DB_PATH);

export default db;
