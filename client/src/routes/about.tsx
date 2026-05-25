import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Target, Eye, Shield, Lightbulb, Sparkles, Award } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import about1 from "@/assets/about-1.jpg";
import about2 from "@/assets/about-2.jpg";
import about3 from "@/assets/about-3.jpg";
import valuesBg from "@/assets/values-bg.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [{ title: "About — HAF Import & Supply Trade" }, { name: "description", content: "Founded in 2017, HAF Import & Supply Trade serves governmental and non-governmental organizations across the Horn of Africa." }] }),
});

function Counter({ to, suffix = "+" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = Date.now();
        const tick = () => {
          const p = Math.min(1, (Date.now() - start) / 1500);
          setN(Math.floor(p * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        tick();
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <div ref={ref}>{n}{suffix}</div>;
}

function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-background">
        <div className="container-haf grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionHeading eyebrow="About Us" title="About HAF Import & Supply Trade" />
            <div className="mt-6 space-y-4 text-body leading-relaxed">
              <p>HAF Import and Supply Trade Company was established in 2017 under the Addis Ababa City Administration Trade and Industry Development Bureau, with the aim to import, supply, and distribute machines, equipment, and materials.</p>
              <p>The company was founded with the full commitment of the owner and General Manager, Mr. Henok Ataklty. We've successfully completed supplies and installations for governmental and non-governmental organizations.</p>
              <p>Our pledge is to honor every commitment with high-quality products from globally reputed companies — backed by professional service and sound management principles.</p>
            </div>
          </div>
          <div className="about-mosaic" aria-label="About us photo collage">
            <figure className="about-mosaic-cell about-mosaic-top">
              <img src={about1} alt="HAF team and partners during an on-site project visit" loading="lazy" />
            </figure>
            <figure className="about-mosaic-cell about-mosaic-bottom">
              <img src={about2} alt="HAF equipment installation and operational setup" loading="lazy" />
            </figure>
            <figure className="about-mosaic-cell about-mosaic-feature">
              <img src={about3} alt="HAF field work and client collaboration in action" loading="lazy" />
            </figure>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--gradient-brand)" }}>
        <div className="container-haf grid grid-cols-3 text-white text-center divide-x divide-white/20">
          {[{ to: 6, label: "Years in Business" }, { to: 50, label: "Happy Clients" }, { to: 100, label: "Products" }].map((s) => (
            <div key={s.label} className="px-4">
              <div className="font-display text-5xl md:text-6xl"><Counter to={s.to} /></div>
              <div className="text-xs uppercase tracking-wider opacity-80 mt-2 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28" style={{ background: "var(--tint-blue)" }}>
        <div className="container-haf">
          <SectionHeading eyebrow="Direction" title="Our Guiding Principles" center />
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="card-haf p-8 border-l-[4px] relative" style={{ borderLeftColor: "var(--brand-blue)" }}>
              <span className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white" style={{ background: "var(--brand-blue)" }}>Mission</span>
              <div className="icon-square mb-5"><Target className="h-5 w-5" /></div>
              <h3 className="font-display text-2xl text-navy mb-3">Our Mission</h3>
              <p className="text-body leading-relaxed">To be the leading supplier of innovative and essential technologies in water purification, laboratory equipment, and agriculture in the Horn of Africa — enhancing quality of life and improving food security.</p>
              <div className="mt-6">
                <div className="text-xs text-label uppercase tracking-wider font-semibold flex justify-between">
                  <span>Commitment Level</span><span>100%</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--tint-blue)] mt-2 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "100%", background: "var(--gradient-brand-soft)" }} />
                </div>
              </div>
            </div>
            <div className="card-haf p-8 border-l-[4px] relative" style={{ borderLeftColor: "var(--brand-green)" }}>
              <span className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white" style={{ background: "var(--brand-green)" }}>Vision</span>
              <div className="icon-square mb-5" style={{ background: "var(--tint-green)", color: "var(--brand-green)" }}><Eye className="h-5 w-5" /></div>
              <h3 className="font-display text-2xl text-navy mb-3">Our Vision</h3>
              <p className="text-body leading-relaxed">To evolve from a leading distributor into a local manufacturer of water purification equipment within five years — creating sustainable employment, building domestic industrial capacity, and securing Ethiopia's supply chain.</p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs text-label uppercase tracking-wider font-semibold">
                <Award className="h-4 w-4 text-[var(--brand-green)]" /> Target: 2025
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 relative overflow-hidden values-section" style={{ backgroundImage: `url(${valuesBg})` }}>
        <div className="container-haf">
          <SectionHeading eyebrow="What We Stand For" title="Our Core Values" center />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Integrity", color: "var(--brand-green)", desc: "We operate with transparency and honesty in all our dealings." },
              { icon: Sparkles, title: "Impact", color: "var(--brand-blue)", desc: "We focus on products that deliver tangible, positive change." },
              { icon: Award, title: "Reliability", color: "#E94E1B", desc: "We deliver on our promises to customers and partners." },
              { icon: Lightbulb, title: "Innovation", color: "#F5B400", desc: "We promote modern solutions to persistent challenges." },
            ].map((v) => (
              <div key={v.title} className="card-haf p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-xl grid place-items-center mb-4" style={{ background: v.color + "15", color: v.color }}>
                  <v.icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-navy mb-2 font-sans">{v.title}</h4>
                <p className="text-sm text-body">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
