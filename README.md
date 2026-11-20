# Coy Discover

Standalone mobile-first discovery and mutual matching demo for the Coy SDE Intern Assignment.

## Features
- Home placeholder, Discover and Matches tabs
- 36 seeded mock profiles (name, age, photo, bio, city, college, interests)
- Drag-to-swipe cards plus Like and Pass buttons
- Swiped profiles are excluded from future feed responses
- Server-side mutual matching
- Incoming likes are not exposed by the feed API
- SQLite persistence across reloads
- Demo reset endpoint/button

## Stack
React + Vite, Framer Motion, Node.js + Express, SQLite (`better-sqlite3`).

## Requirements
Node.js 18+ and npm.

## Run
From the project root:
```bash
npm install
npm run dev
```
Open http://localhost:5173. API runs at http://localhost:4000.

Build frontend:
```bash
npm run build
```

## APIs
- `GET /feed` — profiles not yet swiped on; no incoming-like metadata.
- `POST /swipe` — JSON `{ "profileId": "profile-3", "direction": "like" }`; direction is `like` or `pass`. Returns `isMatch` and match data only on mutual likes.
- `GET /matches` — mutual matches only.
- `POST /demo/reset` — clears swipes and matches for repeatable demos.

## Demo matching
Some seed profiles have an incoming like for the assumed demo user. Incoming likes remain private. Liking one of those profiles creates a match.

## Privacy
The assignment allows assuming one logged-in user and does not require external auth. Matching is determined server-side; `likedCurrentUser` is never returned by `/feed`.
