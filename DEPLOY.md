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

## 2. Deploy with Blueprint

1. Render Dashboard → **New** → **Blueprint**
2. Connect the repo and select `render.yaml`
3. When prompted, set **sync: false** variables for the API:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `CORS_ORIGIN` → your frontend URL, e.g. `https://haf-web.onrender.com`
4. Deploy both services

After the API is live, open **haf-web** → **Environment** and confirm:

- `VITE_API_BASE_URL` = `https://haf-api.onrender.com` (no trailing slash)
- `VITE_API_SSR_URL` = same URL

If you change `VITE_*` values, **redeploy the web service** (they are baked in at Docker build time).

---

## 3. Manual Docker deploy (alternative)

### API

- **Root directory:** `server/trade-backend`
- **Environment:** Docker
- **Health check path:** `/health`
- **Disk (recommended):** mount `/app/uploads` (1 GB+) so uploaded images survive redeploys

### Web

- **Root directory:** `client`
- **Environment:** Docker
- **Docker build args:**
  - `VITE_API_BASE_URL` = public API URL
  - `VITE_API_SSR_URL` = public API URL (or internal URL if using Render private networking)

---

## 4. Environment variables

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
| `VITE_API_BASE_URL` | Build time | `https://haf-api.onrender.com` |
| `VITE_API_SSR_URL` | Build time | `https://haf-api.onrender.com` |
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

## 6. Notes

- **Uploads:** Without a Render disk on the API service, files in `/uploads` are lost on redeploy. `render.yaml` includes a 1 GB disk mount.
- **HTTPS:** Use `https://` URLs in `VITE_API_BASE_URL` and `CORS_ORIGIN`.
- **Cold starts:** Free/starter plans spin down after inactivity; first request may be slow.
