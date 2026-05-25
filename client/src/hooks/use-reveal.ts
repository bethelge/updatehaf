import { useEffect } from "react";

/**
 * Adds `.is-visible` to any `.reveal` element when it scrolls into view.
 * Children with `data-reveal-delay` get a staggered transition-delay.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!els.length) return;

    els.forEach((el) => {
      const d = el.dataset.revealDelay;
      if (d) el.style.transitionDelay = `${d}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
