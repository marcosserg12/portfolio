"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { gsap, markMotionReady, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";
import { setLenis } from "@/lib/scroll";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const { locale } = useI18n();

  useEffect(() => {
    markMotionReady();
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Copy length changes with the language, so trigger positions must be recomputed.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [locale]);

  return <>{children}</>;
}
