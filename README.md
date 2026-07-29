# DXM '26 — Local Dev & Admin Guide

Quick guide to run the site locally and test admin add/edit/delete (client localStorage or server-backed).

Prereqs
- Node.js 18+
- npm

Install

```bash
npm install
```

Client-only (fast, no server)
- The app already supports full admin CRUD stored in the browser `localStorage`.
- Run the frontend dev server:

```bash
npm run dev
```

- Open the site at the address printed by Vite (typically `http://localhost:5173`).
- Sign in at `/auth` using the built-in fallback admin credentials:

- Email: `esakkimuthu2907@gmail.com`
- Password: `Esakki@123`

- Any add/edit/delete operations performed in the admin UI will update the public pages immediately (stored to localStorage).

Server-backed API (persistent across browsers/devices)
- This repo includes serverless-style API handlers in `api/` that are intended to run under Vercel or a similar serverless runtime.
- To run the API locally and have the admin UI persist to a server-side JSON DB, use the Vercel CLI.

1. Install Vercel CLI (if you don't have it):

```bash
npm i -g vercel
```

2. Set environment variables for admin (example):

Windows (PowerShell):

```powershell
$env:ADMIN_EMAIL = 'esakkimuthu2907@gmail.com'
$env:ADMIN_PASSWORD = 'Esakki@123'
$env:JWT_SECRET = 'your_jwt_secret_here'
vercel dev
```

macOS / Linux (bash):

```bash
export ADMIN_EMAIL=esakkimuthu2907@gmail.com
export ADMIN_PASSWORD=Esakki@123
export JWT_SECRET=your_jwt_secret_here
vercel dev
```

3. Seed the admin user (vercel dev runs on port 3000 by default):

```bash
curl -X POST http://localhost:3000/api/seed
```

4. Open the frontend (Vite) or the dev origin Vercel provides. Sign in with the same admin email/password; the login endpoint will return a JWT and admin actions (POST/PUT/DELETE) will be persisted to the server DB stored in `/tmp/mock_db.json` while running locally under `vercel dev`.

Notes
- Image uploads in the admin UI are converted to data-URLs and stored either in `localStorage` or sent to the server as string data; for production you should replace this with real file uploads to a storage bucket.
- The server API included here uses a simple filesystem JSON mock DB (`/tmp/mock_db.json`) for local testing; for production swap `api/_lib/db.js` to connect to your MongoDB or other persistent store.

If you want, I can:
- Add a small Express dev-server to run the `api/` handlers without Vercel.
- Replace data-URL image handling with file uploads to a storage service.
