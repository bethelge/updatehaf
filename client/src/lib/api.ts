/**
 * URLs for the trade Express API in `server/trade-backend`.
 *
 * Dev: leave `VITE_API_BASE_URL` unset so requests stay same-origin; Vite proxies
 * `/api` and `/uploads` to the backend (see `vite.config.ts`).
 *
 * Production: set `VITE_API_BASE_URL` to your API origin (no trailing slash), e.g.
 * `https://api.yoursite.com`.
 *
 * SSR / server loaders: the dev proxy does not apply. Set `VITE_API_SSR_URL` to the
 * backend base (default in code: `http://127.0.0.1:5000`) so server-side `fetch` works.
 */

function trimTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

export function getApiOrigin(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return raw ? trimTrailingSlash(raw.trim()) : "";
}

/** Path must look like `/api/...` or `/uploads/...`. */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const origin = getApiOrigin();
  return origin ? `${origin}${p}` : p;
}

/** Turn `/uploads/...` paths from the API into a URL the browser can load. */
export function tradeAssetUrl(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  const origin = getApiOrigin();
  return origin ? `${origin}${p}` : p;
}

/** Use when calling the trade API from TanStack Start server code (SSR, server functions). */
export function apiUrlForServer(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const ssr = import.meta.env.VITE_API_SSR_URL as string | undefined;
  const origin = trimTrailingSlash(
    (ssr?.trim() || getApiOrigin() || "http://127.0.0.1:5000") as string,
  );
  return `${origin}${p}`;
}
