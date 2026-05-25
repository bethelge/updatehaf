import { createFileRoute, Link } from "@tanstack/react-router";
import { Ship, Network, Globe, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/service")({
  component: ServicePage,
  head: () => ({ meta: [{ title: "Services — HAF Import & Supply Trade" }, { name: "description", content: "Import services, supply chain solutions, and global reach for organizations across the Horn of Africa." }] }),
});

const services = [
  { icon: Ship, title: "Import Services", desc: "Efficient and reliable import services tailored to your needs." },
  { icon: Network, title: "Supply Chain", desc: "Comprehensive supply chain solutions for seamless operations." },
  { icon: Globe, title: "Global Reach", desc: "Connecting your business to markets around the world." },
];

function ServicePage() {
  return (
    <>
      <section className="pt-32 pb-16" style={{ background: "var(--tint-blue)" }}>
        <div className="container-haf text-center">
          <div className="eyebrow mb-3">What We Do</div>
          <h1 className="font-display text-5xl md:text-6xl text-navy">Our Services</h1>
          <div className="accent-underline mt-4 mx-auto" />
          <p className="mt-6 text-body max-w-xl mx-auto">End-to-end solutions for organizations across Ethiopia, Djibouti & Somaliland.</p>
        </div>
      </section>
      <section className="py-20">
        <div className="container-haf grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="card-haf p-8">
              <div className="icon-square mb-5"><s.icon className="h-5 w-5" /></div>
              <h3 className="font-display text-2xl text-navy mb-2">{s.title}</h3>
              <p className="text-body text-sm leading-relaxed">{s.desc}</p>
              <Link to="/contact" className="btn-outline mt-6 !text-sm">Learn More <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
