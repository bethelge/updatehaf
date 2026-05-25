import { createFileRoute } from "@tanstack/react-router";
import { stories } from "@/lib/site-data";
import { MapPin, Calendar, Tag, Sparkles } from "lucide-react";
import valuesBg from "@/assets/values-bg.jpg";

export const Route = createFileRoute("/stories")({
  component: StoriesPage,
  head: () => ({ meta: [{ title: "Success Stories — HAF Import & Supply Trade" }, { name: "description", content: "Transforming lives through clean water and partnerships across Ethiopia." }] }),
});

function StoriesPage() {
  return (
    <>
      <section className="pt-32 pb-16" style={{ background: "var(--gradient-brand)" }}>
        <div className="container-haf text-center text-white">
          <div className="text-xs font-bold uppercase tracking-[0.18em] opacity-80 mb-3">Impact</div>
          <h1 className="font-display text-5xl md:text-6xl max-w-3xl mx-auto">Transforming Lives Through Clean Water</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">Real partnerships, real results across Ethiopia and beyond.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container-haf space-y-8">
          {stories.map((s, idx) => (
            <article key={s.title} className="card-haf p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white" style={{ background: "var(--brand-blue)" }}>{s.category}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-muted text-label">{s.year}</span>
              </div>
              <h2 className="font-display text-3xl text-navy">{s.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-label">
                <span className="flex items-center gap-1.5"><Tag className="h-4 w-4" /> {s.partner}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {s.location}</span>
              </div>
              <p className="mt-5 text-body leading-relaxed">{s.description}</p>
              <div className="mt-5 p-4 rounded-md border-l-4 flex items-start gap-3" style={{ background: "var(--tint-blue)", borderLeftColor: "var(--brand-blue)" }}>
                <Sparkles className="h-5 w-5 text-[var(--brand-blue)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--brand-blue)] mb-1">Impact</div>
                  <div className="text-sm text-navy">{s.impact}</div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: Math.min(s.imageCount, 6) }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden">
                    <img src={valuesBg} alt={`${s.title} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
