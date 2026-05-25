import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/image/$productSlug")({
  component: ImageGalleryPage,
});

function ImageGalleryPage() {
  const loc = useLocation();
  const raw = (loc.state as { imageUrls?: unknown } | undefined)?.imageUrls;
  const imageUrls = Array.isArray(raw)
    ? raw.map((v) => String(v)).filter((v) => /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(v))
    : [];
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section className="pt-28 pb-16 min-h-screen bg-background">
      <div className="container-haf">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm text-[var(--brand-blue)] mb-6 hover:gap-3 transition-all border-0 bg-transparent p-0"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </button>
        <h1 className="font-display text-4xl text-navy mb-8">Product Gallery</h1>
        {imageUrls.length === 0 ? (
          <div className="text-center text-label py-16">
            No valid gallery images were provided for this product.
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {imageUrls.map((u, i) => (
              <button key={i} onClick={() => setLightbox(i)} className="aspect-square rounded-xl overflow-hidden card-haf">
                <img
                  src={u}
                  loading="lazy"
                  alt={`Gallery image ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/85 z-50 grid place-items-center p-4 animate-fade-up" onClick={() => setLightbox(null)} style={{ animationDuration: "0.2s" }}>
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full">
            <X className="h-6 w-6" />
          </button>
          <img src={imageUrls[lightbox]} alt="" className="max-h-[85vh] max-w-[90vw] rounded-lg" onClick={(e) => e.stopPropagation()} />
          {imageUrls.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + imageUrls.length) % imageUrls.length); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full"><ChevronLeft className="h-6 w-6" /></button>
              <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % imageUrls.length); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full"><ChevronRight className="h-6 w-6" /></button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm">{lightbox + 1} / {imageUrls.length}</div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
