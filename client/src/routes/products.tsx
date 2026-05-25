import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Boxes, Camera } from "lucide-react";
import { apiUrl, tradeAssetUrl } from "@/lib/api";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Products — HAF Import & Supply Trade" },
      {
        name: "description",
        content:
          "Browse our premium collection of water purification, agricultural, industrial, and laboratory products.",
      },
    ],
  }),
});

type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  main_images: string[];
  explore_images: string[];
};

type ApiRow = Record<string, unknown>;

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fallback-water-1",
    title: "LifeStraw Community Purifier Pro",
    description:
      "High-capacity water purification for institutions and emergency deployment.",
    category: "Water Purification",
    main_images: ["/uploads/demo-water-1.jpg"],
    explore_images: ["/uploads/demo-water-2.jpg", "/uploads/demo-water-3.jpg"],
  },
  {
    id: "fallback-agri-1",
    title: "Agriculture Seedling Tray Set",
    description:
      "Durable trays designed for nursery efficiency and consistent healthy growth.",
    category: "Agricultural Inputs",
    main_images: ["/uploads/demo-agri-1.jpg"],
    explore_images: [],
  },
  {
    id: "fallback-industrial-1",
    title: "Industrial Processing Unit",
    description:
      "Reliable industrial machine built for high-throughput operations with low maintenance.",
    category: "Industrial Machinery",
    main_images: ["/uploads/demo-industrial-1.jpg"],
    explore_images: ["/uploads/demo-industrial-2.jpg"],
  },
];

export function parseImageField(value: unknown): unknown[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") || trimmed.startsWith('"')) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === "string") return [parsed];
        return [];
      } catch {
        return [trimmed];
      }
    }
    return [trimmed];
  }
  return [];
}

export function isValidImagePath(path: string): boolean {
  const s = path.trim();
  if (!s) return false;
  if (/^data:image\//i.test(s)) return true;
  return /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(s);
}

export function normalizeImageArray(value: unknown): string[] {
  const parsed = parseImageField(value);
  return parsed
    .map((entry) => String(entry ?? "").trim())
    .filter((entry) => isValidImagePath(entry))
    .map((entry) => tradeAssetUrl(entry));
}

function normalizeProduct(row: ApiRow): Product {
  const main = normalizeImageArray(row.main_images ?? row.image);
  const explore = normalizeImageArray(row.explore_images);
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? "Untitled Product"),
    description: String(row.description ?? "No description provided."),
    category: String(row.category ?? "Uncategorized"),
    main_images: main,
    explore_images: explore,
  };
}

function ProductCard({ p }: { p: Product }) {
  const nav = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const imgs = p.main_images;
  const exploreImages = p.explore_images;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (imgs.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % imgs.length), 3000);
    return () => clearInterval(t);
  }, [imgs.length]);

  const overlayText = p.description || "Explore product details and full gallery.";

  return (
    <div
      ref={cardRef}
      className={`products-card ${isVisible ? "is-visible" : ""}`}
      role="article"
      aria-label={p.title}
    >
      <div className="products-card-media">
        {imgs.length > 0 ? (
          imgs.map((img, imageIndex) => (
            <img
              key={`${p.id}-${img}-${imageIndex}`}
              src={img}
              alt={`${p.title} image ${imageIndex + 1}`}
              loading="lazy"
              className={`products-card-image ${idx === imageIndex ? "is-active" : ""}`}
            />
          ))
        ) : (
          <div className="products-no-image">
            <Camera className="h-8 w-8" />
            <span>No image available</span>
          </div>
        )}
        <div className="products-card-overlay">
          <h3>{p.title}</h3>
          <p>{overlayText}</p>
        </div>
      </div>
      <div className="products-card-body">
        <h3 className="products-card-title">{p.title}</h3>
        <p className="products-card-desc">{p.description}</p>
        {exploreImages.length > 0 ? (
          <button
            type="button"
            onClick={() =>
              nav({
                to: "/image/$productSlug",
                params: { productSlug: p.id },
                state: { imageUrls: exploreImages } as Record<string, unknown>,
              })
            }
            className="products-explore-btn"
          >
            Explore gallery <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function CategorySlider({ title, products }: { title: string; products: Product[] }) {
  const trackItems = useMemo(() => {
    if (products.length === 0) return [];
    return products.length < 4 ? [...products, ...products, ...products] : [...products, ...products];
  }, [products]);

  return (
    <section className="products-category-block">
      <div className="products-category-header">
        <div className="products-category-title-wrap">
          <span className="products-category-icon" aria-hidden="true">
            <Boxes className="h-4 w-4" />
          </span>
          <h2>{title}</h2>
        </div>
        <span className="products-category-count">{products.length} items</span>
      </div>

      <div className="products-slider-shell">
        <div className="products-slider-fade products-slider-fade--left" aria-hidden="true" />
        <div className="products-slider-fade products-slider-fade--right" aria-hidden="true" />
        <div className="products-slider-viewport" tabIndex={0} aria-label={`${title} products — scroll horizontally`}>
          <div
            className="products-marquee-track"
            style={{ "--marquee-count": String(products.length) } as CSSProperties}
          >
            {trackItems.map((p, i) => (
              <div key={`${p.id}-${i}`} className="products-marquee-item">
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(apiUrl("/api/product"));
        if (res.ok) {
          const data: unknown = await res.json();
          const rows = Array.isArray(data) ? data : [];
          const mapped: Product[] = rows.map((row) => normalizeProduct(row as ApiRow));
          if (!cancelled) {
            setItems(mapped.length ? mapped : FALLBACK_PRODUCTS.map(normalizeProductFromSeed));
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback below.
      }

      if (!cancelled) {
        setItems(FALLBACK_PRODUCTS.map(normalizeProductFromSeed));
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(
    () =>
      items.reduce<Record<string, Product[]>>((acc, p) => {
        (acc[p.category] = acc[p.category] || []).push(p);
        return acc;
      }, {}),
    [items],
  );

  return (
    <main className="products-page">
      <section className="products-hero">
        <div className="products-hero-watermark" aria-hidden="true">
          Premium
        </div>
        <div className="container-haf products-hero-inner">
          <h1>Our Premium Collection</h1>
          <p>
            Curated solutions in water purification, agriculture, laboratory systems, and industrial
            equipment for modern institutions.
          </p>
        </div>
      </section>

      <section className="products-categories">
        <div className="container-haf">
          {loading && <div className="text-center text-label py-16">Loading products...</div>}
          {!loading && items.length === 0 && (
            <div className="text-center text-label py-16">No products found.</div>
          )}
          {Object.entries(grouped).map(([cat, prods]) => (
            <CategorySlider key={cat} title={cat} products={prods} />
          ))}
        </div>
      </section>
    </main>
  );
}

function normalizeProductFromSeed(seed: Product): Product {
  return {
    ...seed,
    main_images: seed.main_images.map((img) => tradeAssetUrl(img)),
    explore_images: seed.explore_images.map((img) => tradeAssetUrl(img)),
  };
}
