import { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
      <h2 className="font-display text-4xl md:text-5xl text-navy">{title}</h2>
      <div className={`accent-underline mt-4 ${center ? "mx-auto" : ""}`} />
      {description && (
        <p className="mt-5 text-body text-base md:text-lg">{description}</p>
      )}
    </div>
  );
}
