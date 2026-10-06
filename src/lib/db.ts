import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// Local SQLite file in ./data — created on first use.
const DB_PATH = path.join(process.cwd(), "data", "liamdex.db");

const globalForDb = globalThis as unknown as { liamdexDb?: Database.Database };

function open() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      starter TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS counters (
      key TEXT PRIMARY KEY,
      value INTEGER NOT NULL DEFAULT 0
    );
  `);
  return db;
}

// Reuse one connection across hot reloads in dev.
export const db = globalForDb.liamdexDb ?? (globalForDb.liamdexDb = open());

export type GuestEntry = { id: number; name: string; message: string; starter: string; created_at: string };

export function listGuests(limit = 20): GuestEntry[] {
  return db
    .prepare("SELECT id, name, message, starter, created_at FROM guestbook ORDER BY id DESC LIMIT ?")
    .all(limit) as GuestEntry[];
}

export function countGuests(): number {
  return (db.prepare("SELECT COUNT(*) AS n FROM guestbook").get() as { n: number }).n;
}

export function addGuest(name: string, message: string, starter: string): GuestEntry {
  const info = db.prepare("INSERT INTO guestbook (name, message, starter) VALUES (?, ?, ?)").run(name, message, starter);
  return db
    .prepare("SELECT id, name, message, starter, created_at FROM guestbook WHERE id = ?")
    .get(info.lastInsertRowid) as GuestEntry;
}

export function bumpCounter(key: string): number {
  return (
    db
      .prepare(
        "INSERT INTO counters (key, value) VALUES (?, 1) ON CONFLICT(key) DO UPDATE SET value = value + 1 RETURNING value",
      )
      .get(key) as { value: number }
  ).value;
}

export function readCounter(key: string): number {
  const row = db.prepare("SELECT value FROM counters WHERE key = ?").get(key) as { value: number } | undefined;
  return row?.value ?? 0;
}
