import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer style={{ background: "#0D2137", color: "rgba(255,255,255,0.75)" }} className="mt-0 pt-16 pb-6">
      <div className="container-haf grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="HAF" width={40} height={40} className="h-10 w-10" />
            <div>
              <div className="text-white font-display text-base font-bold">HAF Import & Supply Trade</div>
              <div className="text-xs opacity-70 mt-0.5">ሃፍ አስመጪ እና አቅራቢ ንግድ ስራ</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed opacity-80 max-w-sm">
            Exclusive Distributor of LifeStraw across Ethiopia, Djibouti & Somaliland. Trusted supplier of agricultural, industrial, and laboratory equipment.
          </p>
          <p className="text-xs opacity-60 mt-6">© 2025 HAF Import & Supply Trade. All rights reserved.</p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 font-sans">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About Us" },
              { to: "/products", label: "Products" },
              { to: "/media", label: "Media Coverage" },
              { to: "/stories", label: "Success Stories" },
              { to: "/contact", label: "Contact Us" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-[var(--brand-green)] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 font-sans">Get in Touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="h-4 w-4 mt-1 shrink-0 text-[var(--brand-green)]" /><span>Bole Sub-city, Bedria City Mall, 6th floor, Office 608, Addis Ababa, Ethiopia</span></li>
            <li className="flex gap-3"><Phone className="h-4 w-4 mt-1 shrink-0 text-[var(--brand-green)]" /><span>+251 116662226<br/>+251 929425601</span></li>
            <li className="flex gap-3"><Mail className="h-4 w-4 mt-1 shrink-0 text-[var(--brand-green)]" /><span>henokimport2011@gmail.com<br/>hafimports294@gmail.com</span></li>
          </ul>
        </div>
      </div>

      <div className="container-haf mt-12 pt-6 border-t border-white/10 text-xs text-center opacity-60">
        Designed & Built with care
      </div>
    </footer>
  );
}
