import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import contactHero from "@/assets/contact-hero.jpg";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact — HAF Import & Supply Trade" }, { name: "description", content: "Get in touch with HAF Import & Supply Trade in Addis Ababa, Ethiopia." }] }),
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    // Simulate a send — wire up to email later
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent — we'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
    setSending(false);
  };
  return (
    <>
      <section className="relative pt-32 pb-20" style={{ background: `linear-gradient(rgba(13,33,55,0.7), rgba(13,33,55,0.7)), url(${contactHero}) center/cover` }}>
        <div className="container-haf text-center text-white">
          <h1 className="font-display text-5xl md:text-6xl">Contact Us</h1>
          <p className="mt-4 text-lg opacity-90">We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-haf grid md:grid-cols-3 gap-6 -mt-24 relative z-10">
          {[
            { icon: MapPin, title: "Our Location", lines: ["Bole Sub-city Woreda 03", "Bedria City Mall 6th floor", "Office No. 608, Addis Ababa"], bg: "var(--tint-blue)" },
            { icon: Phone, title: "Phone", lines: ["Office: +251 116662226", "Mobile: +251 929425601", "+251 995723232"], bg: "var(--tint-green)" },
            { icon: Mail, title: "Email", lines: ["henokimport2011@gmail.com", "hafimports294@gmail.com", "lifestrawethiopia@gmail.com"], bg: "var(--tint-blue)" },
          ].map((c) => (
            <div key={c.title} className="card-haf p-6" style={{ background: c.bg }}>
              <div className="icon-square mb-4 bg-white"><c.icon className="h-5 w-5" /></div>
              <h3 className="font-semibold text-navy mb-2 font-sans">{c.title}</h3>
              <div className="text-sm text-body space-y-0.5 break-all">{c.lines.map((l) => <div key={l}>{l}</div>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container-haf grid md:grid-cols-2 gap-8">
          <div className="card-haf overflow-hidden">
            <iframe
              title="HAF Location"
              src="https://www.google.com/maps?q=Bole+Bedria+City+Mall+Addis+Ababa&output=embed"
              className="w-full h-full min-h-[420px] border-0"
              loading="lazy"
            />
          </div>
          <form onSubmit={onSubmit} className="card-haf p-8 space-y-4">
            <h3 className="font-display text-2xl text-navy mb-2">Send Us a Message</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required name="from_name" placeholder="Your Name" className="w-full px-4 py-3 rounded-md border border-[var(--border)] focus:border-[var(--brand-blue)] focus:outline-none transition" />
              <input required type="email" name="from_email" placeholder="Email" className="w-full px-4 py-3 rounded-md border border-[var(--border)] focus:border-[var(--brand-blue)] focus:outline-none transition" />
            </div>
            <input required name="subject" placeholder="Subject" className="w-full px-4 py-3 rounded-md border border-[var(--border)] focus:border-[var(--brand-blue)] focus:outline-none transition" />
            <textarea required name="message" rows={5} placeholder="Your message..." className="w-full px-4 py-3 rounded-md border border-[var(--border)] focus:border-[var(--brand-blue)] focus:outline-none transition resize-none" />
            <button disabled={sending} className="btn-primary w-full">
              {sending ? "Sending..." : <>Send Message <Send className="h-4 w-4" /></>}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
