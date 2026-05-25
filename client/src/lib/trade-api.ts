const API_BASE = (import.meta.env.VITE_TRADE_API_URL ?? "http://localhost:5000").replace(/\/$/, "");

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

/** Resolve `/uploads/...` paths from the trade backend to absolute URLs. */
export function tradeAssetUrl(mediaUrl: string): string {
  if (!mediaUrl) return "";
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl;
  const path = mediaUrl.startsWith("/") ? mediaUrl : `/${mediaUrl}`;
  return `${API_BASE}${path}`;
}
