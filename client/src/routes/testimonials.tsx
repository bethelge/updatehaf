import { createFileRoute } from "@tanstack/react-router";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { LogoBadge } from "@/components/site/LogoBadge";
import { testimonials } from "@/lib/site-data";

export const Route = createFileRoute("/testimonials")({
  component: TestimonialsPage,
  head: () => ({ meta: [{ title: "Testimonials — HAF Import & Supply Trade" }, { name: "description", content: "What leading organizations say about working with HAF Import & Supply Trade." }] }),
});

function Card({ t }: { t: typeof testimonials[number] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (t.quotes.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % t.quotes.length), 5000);
    return () => clearInterval(id);
  }, [t.quotes.length]);
  return (
    <div className="card-haf p-6 border-l-[3px]" style={{ borderLeftColor: "var(--brand-green)" }}>
      <div className="flex items-start gap-4">
        <LogoBadge initials={t.initials} color={t.color} />
        <div className="flex-1">
          <div className="font-semibold text-navy text-sm">{t.company}</div>
          <div className="text-xs text-label">{t.role}</div>
          <div className="flex gap-0.5 mt-2">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-[#F5B400] text-[#F5B400]" />)}</div>
        </div>
      </div>
      <p className="mt-4 italic text-body text-sm leading-relaxed min-h-[100px]">"{t.quotes[i]}"</p>
      {t.quotes.length > 1 && (
        <div className="mt-4 flex justify-between">
          <div className="flex gap-1.5">{t.quotes.map((_, k) => <span key={k} className="h-1.5 rounded-full" style={{ width: i === k ? 16 : 6, background: i === k ? "var(--brand-blue)" : "var(--border)" }} />)}</div>
          <div className="flex gap-1.5">
            <button onClick={() => setI((i - 1 + t.quotes.length) % t.quotes.length)} className="w-7 h-7 rounded grid place-items-center border border-[var(--border)] hover:bg-[var(--brand-blue)] hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => setI((i + 1) % t.quotes.length)} className="w-7 h-7 rounded grid place-items-center border border-[var(--border)] hover:bg-[var(--brand-blue)] hover:text-white"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function TestimonialsPage() {
  return (
    <>
      <section className="pt-32 pb-16" style={{ background: "var(--gradient-brand)" }}>
        <div className="container-haf text-center text-white">
          <div className="text-xs font-bold uppercase tracking-[0.18em] opacity-80 mb-3">Client Voices</div>
          <h1 className="font-display text-5xl md:text-6xl">Voices of Trust</h1>
          <p className="mt-4 text-lg opacity-90">Hear directly from the organizations we serve.</p>
        </div>
      </section>
      <section className="py-20">
        <div className="container-haf grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => <Card key={t.company} t={t} />)}
        </div>
        <div className="container-haf mt-12 card-haf p-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]" style={{ borderTop: "3px solid var(--brand-blue)" }}>
          {[{ n: "99.9%", l: "Client Satisfaction" }, { n: "50+", l: "Successful Projects" }, { n: "6+", l: "Government Partners" }].map((s) => (
            <div key={s.l} className="text-center py-4 md:py-0">
              <div className="font-display text-5xl text-[var(--brand-blue)]">{s.n}</div>
              <div className="text-xs uppercase tracking-wider text-label mt-2 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
