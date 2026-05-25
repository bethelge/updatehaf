// Visual placeholder logo (letter badge) for partners / testimonials
export function LogoBadge({
  initials,
  color,
  size = 56,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      className="flex items-center justify-center rounded-lg font-bold text-white shrink-0 shadow-sm"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        fontSize: Math.max(11, size / 4.2),
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}
