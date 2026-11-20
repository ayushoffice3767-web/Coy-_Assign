
import Database from "better-sqlite3";
import { profiles } from "./seed.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(currentDir, "../data");

// Create database directory if it doesn't exist
fs.mkdirSync(dataDir, { recursive: true });

// Open SQLite database
const dbPath = path.join(dataDir, "coy-discover.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT,
    age INTEGER,
    photo TEXT,
    bio TEXT,
    city TEXT,
    college TEXT,
    interests TEXT,
    liked_current_user INTEGER
);

CREATE TABLE IF NOT EXISTS swipes (
    profile_id TEXT PRIMARY KEY,
    direction TEXT CHECK(direction IN ('like','pass')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
    profile_id TEXT PRIMARY KEY,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

const count = db.prepare(
    "SELECT COUNT(*) AS n FROM profiles"
).get().n;

if (count === 0) {
    const insert = db.prepare(`
        INSERT INTO profiles
        VALUES (
            @id, @name, @age, @photo, @bio,
            @city, @college, @interests, @liked
        )
    `);

    const seed = db.transaction(() => {
        profiles.forEach(p => {
            insert.run({
                ...p,
                interests: JSON.stringify(p.interests),
                liked: p.likedCurrentUser ? 1 : 0
            });
        });
    });

    seed();
}

export default db;
