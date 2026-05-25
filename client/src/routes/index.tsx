import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Sprout, Factory, Wheat, FlaskConical, Star, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LogoBadge } from "@/components/site/LogoBadge";
import { testimonials, partners } from "@/lib/site-data";
import { MediaPreview } from "@/components/media-preview";
import { getLinkPlatform, linkPlatformLabel } from "@/lib/media";
import { apiUrl, tradeAssetUrl } from "@/lib/api";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "HAF Import & Supply Trade — LifeStraw Distributor for the Horn of Africa" },
      { name: "description", content: "Exclusive LifeStraw distributor across Ethiopia, Djibouti & Somaliland. Trusted by GIZ, SNV, Mercy Corps and government ministries." },
    ],
  }),
});

const heroPhrases = [
  "Exclusive Distributor of LifeStraw Products across Ethiopia, Djibouti & Somaliland",
  "Supplying Agricultural Equipment, Industrial Machines & Laboratory Furniture",
];

function Typewriter() {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = heroPhrases[phraseIdx];
    const delay = deleting ? 25 : 45;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), 2000);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") { setDeleting(false); setPhraseIdx((i) => (i + 1) % heroPhrases.length); }
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, phraseIdx]);

  return <span className="typewriter-cursor">{text}</span>;
}

function Hero() {
  const slides = [hero1, hero3, hero2];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative h-screen min-h-[680px] overflow-hidden">
      {slides.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity ease-out"
          style={{ opacity: idx === i ? 1 : 0, transitionDuration: "1800ms" }}
        >
          <img
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover ${idx === i ? "animate-kenburns" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 hero-scrim" aria-hidden="true" />

      <div className="container-haf relative z-10 h-full flex items-center pt-20">
        <div className="max-w-2xl animate-fade-up">
          <div className="eyebrow mb-5">Exclusive Distributor</div>
          <h1 className="font-display text-5xl md:text-7xl text-navy leading-[1.05]">
            HAF Import <span style={{ color: "var(--brand-green)" }}>&</span>
            <br />
            <span className="font-medium" style={{ fontWeight: 600 }}>Supply Trade</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-body min-h-[3.5rem]">
            <Typewriter />
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/products" className="btn-primary">
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact Us
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-navy">
            {["6+ Years Experience", "50+ Happy Clients", "3 Countries Served"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: "var(--brand-green)" }}>
                  <Check className="h-3 w-3 text-white" />
                </span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: idx === i ? 32 : 12,
              background: idx === i ? "var(--brand-green)" : "rgba(13,33,55,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
}

const services = [
  { icon: Sprout, title: "Agricultural Equipment", desc: "High-quality farming machinery and tools for modern agriculture." },
  { icon: Factory, title: "Industrial Machines", desc: "Wide range of machinery for various industrial applications." },
  { icon: Wheat, title: "Grain Mills & Accessories", desc: "Complete grain milling solutions with all necessary components." },
  { icon: FlaskConical, title: "Laboratory Furniture", desc: "Premium local and imported furniture for all needs." },
];

function WhatWeOffer() {
  return (
    <section style={{ background: "var(--tint-blue)" }} className="py-20 md:py-28">
      <div className="container-haf grid md:grid-cols-2 gap-12 items-center">
        <div className="grid sm:grid-cols-2 gap-4 order-2 md:order-1">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-haf p-6 group border-l-2 border-transparent hover:border-[var(--brand-blue)]">
              <div className="icon-square mb-4"><Icon className="h-5 w-5" /></div>
              <h3 className="text-lg font-semibold text-navy mb-2 font-sans">{title}</h3>
              <p className="text-sm text-body leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="order-1 md:order-2">
          <SectionHeading
            eyebrow="Our Services"
            title={<>What<br />We Offer</>}
            description="We provide cutting-edge solutions across multiple industries with top-quality equipment and exceptional service."
          />
          <Link to="/products" className="btn-primary mt-8">
            Explore All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedMedia() {
  const [item, setItem] = useState<{ id: string; title: string; description: string; media_type: string; file_url: string; youtube_link?: string } | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(apiUrl("/api/media/"));
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && !cancelled) {
            const first = data[0];
            setItem({
              id: String(first.id ?? ""),
              title: String(first.title ?? ""),
              description: String(first.description ?? ""),
              media_type: String(first.media_type ?? "image"),
              file_url: tradeAssetUrl(String(first.media_url ?? "")),
              youtube_link: first.youtube_link ? String(first.youtube_link) : undefined,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load featured media:", err);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);
  if (!item) return null;
  return (
    <section className="py-20 md:py-28">
      <div className="container-haf">
        <SectionHeading
          eyebrow="Latest Coverage"
          title="Media Coverage"
          description={<>See how we're <span className="text-[var(--brand-blue)] font-semibold">transforming</span> global trade operations.</>}
          center
        />
        <div className="mt-12 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center card-haf overflow-hidden">
          <div className="aspect-video bg-muted overflow-hidden">
            <MediaPreview
              mediaType={item.media_type}
              mediaUrl={item.file_url}
              youtubeLink={item.youtube_link}
              title={item.title}
            />
          </div>
          <div className="p-8 md:p-10">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white" style={{ background: "var(--brand-green)" }}>
              Featured Story
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-navy mt-4">{item.title}</h3>
            <p className="mt-3 text-body leading-relaxed">{item.description}</p>
            
            <div className="mt-5 flex items-center gap-6">
              <Link to="/media" className="inline-flex items-center gap-2 text-[var(--brand-blue)] font-medium hover:gap-3 transition-all">
                View All Coverage <ArrowRight className="h-4 w-4" />
              </Link>
              
              {item.youtube_link && item.media_type !== "link" && (
                <a
                  href={item.youtube_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-blue)] hover:text-[var(--brand-green)] transition-colors"
                >
                  <Play className="h-4 w-4" />
                  {linkPlatformLabel(getLinkPlatform(item.youtube_link))}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: typeof testimonials[number] }) {
  const [qIdx, setQIdx] = useState(0);
  useEffect(() => {
    if (t.quotes.length < 2) return;
    const i = setInterval(() => setQIdx((x) => (x + 1) % t.quotes.length), 5000);
    return () => clearInterval(i);
  }, [t.quotes.length]);
  return (
    <div className="card-haf p-6 border-l-[3px]" style={{ borderLeftColor: "var(--brand-green)" }}>
      <div className="flex items-start gap-4">
        <LogoBadge initials={t.initials} color={t.color} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-navy text-sm leading-tight">{t.company}</div>
          <div className="text-xs text-label mt-0.5">{t.role}</div>
          <div className="flex gap-0.5 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-[#F5B400] text-[#F5B400]" />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-[0.9rem] italic text-body leading-relaxed min-h-[100px]">
        "{t.quotes[qIdx]}"
      </p>
      {t.quotes.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {t.quotes.map((_, i) => (
              <button key={i} onClick={() => setQIdx(i)} aria-label={`Quote ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{ width: qIdx === i ? 16 : 6, background: qIdx === i ? "var(--brand-blue)" : "var(--border)" }} />
            ))}
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => setQIdx((qIdx - 1 + t.quotes.length) % t.quotes.length)}
              className="w-7 h-7 rounded grid place-items-center border border-[var(--border)] hover:bg-[var(--brand-blue)] hover:text-white hover:border-[var(--brand-blue)] transition">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setQIdx((qIdx + 1) % t.quotes.length)}
              className="w-7 h-7 rounded grid place-items-center border border-[var(--border)] hover:bg-[var(--brand-blue)] hover:text-white hover:border-[var(--brand-blue)] transition">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Testimonials() {
  return (
    <section style={{ background: "var(--tint-green)" }} className="py-20 md:py-28">
      <div className="container-haf">
        <SectionHeading
          eyebrow="Client Voices"
          title="Voices of Trust"
          description="What leading organizations say about HAF Import & Supply Trade."
          center
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => <TestimonialCard key={t.company} t={t} />)}
        </div>

        <div className="mt-12 card-haf p-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]" style={{ borderTop: "3px solid var(--brand-blue)" }}>
          {[
            { num: "99.9%", label: "Client Satisfaction" },
            { num: "50+", label: "Successful Projects" },
            { num: "6+", label: "Government Partners" },
          ].map((s) => (
            <div key={s.label} className="text-center py-4 md:py-0">
              <div className="font-display text-5xl text-[var(--brand-blue)]">{s.num}</div>
              <div className="text-xs uppercase tracking-wider text-label mt-2 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Partners() {
  const trackRef = useRef<HTMLDivElement>(null);
  // duplicate list for seamless marquee
  const list = [...partners, ...partners];
  return (
    <section style={{ background: "var(--tint-blue)" }} className="py-20 md:py-24 overflow-hidden">
      <div className="container-haf">
        <SectionHeading eyebrow="Partnerships" title="Our Trusted Partners" description="Collaborating with industry leaders." center />
      </div>
      <div className="mt-12 relative">
        <div className="flex gap-5 animate-[marquee_40s_linear_infinite]" ref={trackRef} style={{ width: "max-content" }}>
          {list.map((p, i) => (
            <div key={i} className="card-haf flex flex-col items-center justify-center gap-3" style={{ width: 188, height: 152, padding: 16 }}>
              <img
                src={p.logo}
                alt={p.name}
                className="h-16 w-full object-contain"
                loading="lazy"
              />
              <div className="text-[11px] text-center text-label leading-tight font-medium px-1">{p.name}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="py-20 md:py-24" style={{ background: "var(--gradient-brand)" }}>
      <div className="container-haf text-center text-white">
        <div className="text-xs font-bold uppercase tracking-[0.18em] opacity-80 mb-4">Get in Touch</div>
        <h2 className="font-display text-4xl md:text-5xl text-white">Ready to Transform Your Supply Chain?</h2>
        <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto">Get in touch with our experts for customized solutions.</p>
        <Link
          to="/contact"
          className="mt-9 inline-flex items-center gap-2 bg-white text-[var(--brand-blue)] font-semibold hover:translate-y-[-1px] transition-transform shadow-lg"
          style={{ padding: "14px 40px", borderRadius: 999 }}
        >
          Contact Us Today <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <div className="reveal" data-reveal="scale"><WhatWeOffer /></div>
      <div className="reveal" data-reveal="blur"><FeaturedMedia /></div>
      <div className="reveal" data-reveal="left"><Testimonials /></div>
      <div className="reveal" data-reveal="right"><Partners /></div>
      <div className="reveal" data-reveal="scale"><CtaBanner /></div>
    </>
  );
}
