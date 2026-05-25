# Deploy HAF to Render (Docker)

This repo runs as **two Docker web services** on [Render](https://render.com):

| Service | Folder | Port | Role |
|---------|--------|------|------|
| **haf-api** | `server/trade-backend` | 5000 | Express API + uploads |
| **haf-web** | `client` | 3000 | TanStack Start frontend |

You also need a **MySQL database** (Render does not host MySQL). Use [PlanetScale](https://planetscale.com), [Aiven](https://aiven.io), [Railway](https://railway.app), or any MySQL 8 host.

---

## 1. Push code to GitHub

Render deploys from Git. Commit and push this repository (without `.env` files).

---

## 2. Create the API service (Docker)

1. Render Dashboard → **New** → **Web Service**
2. Connect your repo
3. Configure:
   - **Name:** `haf-api`
   - **Root directory:** `server/trade-backend`
   - **Environment:** Docker
   - **Region:** Frankfurt (or your preference)
   - **Health check path:** `/health`
4. **Environment variables:**

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `JWT_SECRET` | long random string |
   | `DB_HOST` | your MySQL host |
   | `DB_PORT` | `3306` |
   | `DB_USER` | your DB user |
   | `DB_PASSWORD` | your DB password |
   | `DB_NAME` | `trade_db` |
   | `CORS_ORIGIN` | `https://haf-web.onrender.com` (set after web is live) |
   | `FRONTEND_URL` | same as `CORS_ORIGIN` |

5. **Disk (recommended):** add a persistent disk, mount path `/app/uploads`, size 1 GB+ so uploaded images survive redeploys
6. **Create Web Service** and wait until the API URL is live (e.g. `https://haf-api.onrender.com`)

---

## 3. Create the web service (Docker)

1. **New** → **Web Service** (same repo)
2. Configure:
   - **Name:** `haf-web`
   - **Root directory:** `client`
   - **Environment:** Docker
   - **Docker build arguments** (required — baked in at build time):

     | Build arg | Value |
     |-----------|-------|
     | `VITE_API_BASE_URL` | `https://haf-api.onrender.com` (no trailing slash) |
     | `VITE_API_SSR_URL` | same URL |

   - **Runtime environment:**
     - `PORT` = `3000`
     - `NODE_ENV` = `production`

3. Deploy the web service

4. Go back to **haf-api** → **Environment** and set `CORS_ORIGIN` and `FRONTEND_URL` to your web URL (e.g. `https://haf-web.onrender.com`), then redeploy the API if needed

If you change `VITE_*` build args later, **redeploy the web service** (they are baked in at Docker build time).

---

## 4. Environment variables reference

### API (`server/trade-backend`)

| Variable | Required | Example |
|----------|----------|---------|
| `PORT` | Render sets this | `5000` |
| `JWT_SECRET` | Yes | long random string |
| `DB_HOST` | Yes | `aws.connect.psdb.cloud` |
| `DB_PORT` | Yes | `3306` |
| `DB_USER` | Yes | |
| `DB_PASSWORD` | Yes | |
| `DB_NAME` | Yes | `trade_db` |
| `CORS_ORIGIN` | Yes (prod) | `https://haf-web.onrender.com` |

### Web (`client`)

| Variable | When | Example |
|----------|------|---------|
| `VITE_API_BASE_URL` | Build time (Docker build arg) | `https://haf-api.onrender.com` |
| `VITE_API_SSR_URL` | Build time (Docker build arg) | `https://haf-api.onrender.com` |
| `PORT` | Runtime | `3000` |

---

## 5. Local Docker test

```bash
docker compose up --build
```

- Site: http://localhost:3000  
- API: http://localhost:5000/health  
- MySQL: `localhost:3306` (user `haf` / pass `hafpass`, db `trade_db`)

Create an admin user via your usual MySQL/seed flow before logging into `/admin`.

---

## 6. Troubleshooting

### `package-lock.json: not found` (or `package.json: not found`)

Render is building from the **wrong folder**. The Docker build context must be the service folder, not the repo root.

1. Open the service in Render → **Settings**
2. Set **Root Directory** to:
   - API: `server/trade-backend`
   - Web: `client`
3. Leave **Dockerfile Path** empty (Render will use `Dockerfile` inside that folder)
4. **Save** and **Manual Deploy**

Do not point Dockerfile at `./server/trade-backend/Dockerfile` while leaving Root Directory blank — that uses the repo root as context and the `COPY` steps fail.

---

## 7. Notes

- **Uploads:** Without a persistent disk on the API service, files in `/app/uploads` are lost on redeploy. Mount a disk at `/app/uploads` in the Render dashboard.
- **HTTPS:** Use `https://` URLs in `VITE_API_BASE_URL` and `CORS_ORIGIN`.
- **Cold starts:** Free/starter plans spin down after inactivity; first request may be slow.
