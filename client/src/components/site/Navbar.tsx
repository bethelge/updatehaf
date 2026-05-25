import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, Sun, Moon } from "lucide-react";
import { Logo } from "./Logo";
import { useTheme } from "@/hooks/use-theme";

const mainLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
];
const moreLinks = [
  { to: "/products", label: "Products" },
  // { to: "/service", label: "Services" },
  { to: "/stories", label: "Success Stories" },
  { to: "/media", label: "Media Coverage" },
  // { to: "/testimonials", label: "Testimonials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const ThemeButton = ({ className = "" }: { className?: string }) => (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] text-navy hover:bg-[var(--tint-blue)] hover:text-[var(--brand-blue)] transition-colors ${className}`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || mobileOpen
          ? "color-mix(in oklab, var(--background) 92%, transparent)"
          : "color-mix(in oklab, var(--background) 80%, transparent)",
        backdropFilter: "blur(12px)",
        boxShadow: scrolled ? "0 1px 0 var(--border), 0 4px 16px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="container-haf flex items-center justify-between h-18 py-3">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {mainLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 text-sm font-medium text-navy hover:text-[var(--brand-blue)] transition-colors"
              activeProps={{ style: { color: "var(--brand-blue)" } }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}

          <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button className="px-4 py-2 text-sm font-medium text-navy hover:text-[var(--brand-blue)] inline-flex items-center gap-1">
              More <ChevronDown className="h-4 w-4" />
            </button>
            {moreOpen && (
              <div
                className="absolute top-full right-0 pt-2 w-60 animate-fade-up"
                style={{ animationDuration: "0.15s" }}
              >
                <div className="bg-card rounded-xl border border-[var(--border)] shadow-[0_12px_32px_rgba(13,33,55,0.10)] py-2 overflow-hidden">
                  {moreLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="block px-4 py-2.5 text-sm text-navy hover:bg-[var(--tint-blue)] hover:text-[var(--brand-blue)] transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ThemeButton className="ml-2" />
          <Link to="/contact" className="btn-primary ml-2 !py-2.5 !px-5 !text-sm">
            Contact Us
          </Link>
        </nav>

        <div className="lg:hidden flex items-center gap-2">
          <ThemeButton />
          <button
            className="text-navy"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--border)] animate-fade-up" style={{ animationDuration: "0.2s", background: "var(--background)" }}>
          <div className="container-haf py-4 flex flex-col gap-1">
            {[...mainLinks, ...moreLinks].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-base font-medium text-navy hover:bg-[var(--tint-blue)] rounded-md"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
