import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CoverageGridCard,
  FeaturedCoverage,
  type CoverageItem,
} from "@/components/media/coverage-ui";
import { apiUrl, tradeAssetUrl } from "@/lib/api";

export const Route = createFileRoute("/media")({
  component: MediaPage,
  head: () => ({
    meta: [
      { title: "Media Coverage — HAF Import & Supply Trade" },
      {
        name: "description",
        content:
          "Featured appearances, interviews, and media coverage of HAF Import & Supply Trade.",
      },
    ],
  }),
});

function normalizeCreatedAt(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function MediaPage() {
  const [items, setItems] = useState<CoverageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(apiUrl("/api/media/"));
        if (res.ok) {
          const data: unknown = await res.json();
          const rows = Array.isArray(data) ? data : [];
          const mapped: CoverageItem[] = rows.map((row: Record<string, unknown>) => ({
            id: String(row.id ?? ""),
            title: String(row.title ?? ""),
            description: String(row.description ?? ""),
            media_type: String(row.media_type ?? "image"),
            file_url: tradeAssetUrl(String(row.media_url ?? "")),
            youtube_link: row.youtube_link ? String(row.youtube_link) : undefined,
            created_at: normalizeCreatedAt(row.created_at),
          }));
          if (!cancelled) setItems(mapped);
        }
      } catch (err) {
        console.error("Failed to load media:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = items[0];
  const more = items.slice(1);

  return (
    <>
      <section className="page-hero">
        <div className="container-haf text-center text-white">
          <p className="page-hero-eyebrow">Press & Media</p>
          <h1 className="font-display text-5xl md:text-6xl">Media Coverage</h1>
          <p className="page-hero-sub mx-auto max-w-2xl">
            Featured appearances, interviews, and the stories told about our work across the Horn of Africa.
          </p>
          <div className="page-hero-rule" />
        </div>
      </section>

      <section className="media-page-body py-16 md:py-20">
        <div className="container-haf">
          {loading && (
            <p className="text-center text-label py-20">Loading coverage…</p>
          )}

          {!loading && items.length === 0 && (
            <div className="media-empty">
              <p className="text-navy font-semibold font-sans text-lg">No coverage published yet</p>
              <p className="text-body mt-2 max-w-md mx-auto">
                When you add media from the admin panel, featured stories and coverage cards will appear here automatically.
              </p>
              <Link to="/admin" className="btn-primary mt-8 inline-flex">
                Go to admin
              </Link>
            </div>
          )}

          {!loading && featured && (
            <>
              <p className="media-section-label">Featured</p>
              <FeaturedCoverage item={featured} />
            </>
          )}

          {!loading && more.length > 0 && (
            <div className="mt-16 md:mt-20">
              <p className="media-section-label">More coverage</p>
              <div className="media-grid">
                {more.map((m) => (
                  <CoverageGridCard key={m.id} item={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
