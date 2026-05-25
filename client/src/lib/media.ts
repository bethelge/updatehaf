export type MediaPlatform = "youtube" | "facebook" | "other";

export function getLinkPlatform(url: string): MediaPlatform {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "youtu.be" || host.endsWith("youtube.com")) return "youtube";
    if (host.endsWith("facebook.com") || host === "fb.watch") return "facebook";
  } catch {
    /* ignore */
  }
  return "other";
}

export function getYouTubeEmbedId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return id || null;
    }
    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const m = u.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/);
      return m?.[1] ?? null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function linkPlatformLabel(platform: MediaPlatform): string {
  if (platform === "youtube") return "YouTube";
  if (platform === "facebook") return "Facebook";
  return "External link";
}
