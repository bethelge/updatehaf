import logo from "@/assets/logo.png";
import { Link } from "@tanstack/react-router";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <img src={logo} alt="HAF" width={40} height={40} className="h-10 w-10" />
      <div className="leading-tight">
        <div
          className="font-display text-[15px] font-bold tracking-tight"
          style={{ color: light ? "white" : "var(--navy)" }}
        >
          HAF Import & Supply Trade
        </div>
        <div
          className="text-[11px] mt-0.5"
          style={{ color: light ? "rgba(255,255,255,0.7)" : "var(--label)" }}
        >
          ሃፍ አስመጪ እና አቅራቢ ንግድ ስራ
        </div>
      </div>
    </Link>
  );
}
