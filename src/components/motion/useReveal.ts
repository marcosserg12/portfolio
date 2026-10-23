"use client";

import type { RefObject } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";
import { genieShape } from "@/lib/windows";

/**
 * Entrances inside `scope`: [data-reveal] rises in, [data-window] opens like a macOS app launched from the Dock
 * (the genie in reverse: it pours up out of a pinched bottom edge and widens), [data-pose] pops up out of its block.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current ?? undefined;
      const reveal = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      const windows = gsap.utils.toArray<HTMLElement>("[data-window]", root);
      const poses = gsap.utils.toArray<HTMLElement>("[data-pose] img, [data-pose] video", root);
      if (prefersReducedMotion()) {
        gsap.set([...reveal, ...windows], { opacity: 1, y: 0, scale: 1 });
        return;
      }
      // onLeave covers jumps (End key, fast flicks) that skip past an element without "entering" it.
      const rise = (batch: Element[]) =>
        gsap.fromTo(batch, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.07, overwrite: true });
      const open = (batch: Element[]) =>
        gsap
          .timeline()
          .fromTo(batch, { opacity: 0, y: 140, scaleX: 0.55, scaleY: 0.3, clipPath: genieShape(0.5, 0.85, 0.3) }, { opacity: 1, y: 0, scaleX: 1, scaleY: 1, duration: 0.85, ease: "expo.out", stagger: 0.1, transformOrigin: "50% 100%", overwrite: true })
          .to(batch, { clipPath: genieShape(0.5, 0, 0.3), duration: 0.5, ease: "power2.out", stagger: 0.1 }, 0.15)
          .set(batch, { clearProps: "clipPath,scale,scaleX,scaleY" });
      if (reveal.length) ScrollTrigger.batch(reveal, { start: "top 90%", once: true, onEnter: rise, onLeave: rise });
      if (windows.length) ScrollTrigger.batch(windows, { start: "top 92%", once: true, onEnter: open, onLeave: open });
      poses.forEach((img) =>
        gsap.fromTo(img, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "back.out(1.5)", scrollTrigger: { trigger: img, start: "top 95%", once: true } }),
      );
    },
    { scope },
  );
}
