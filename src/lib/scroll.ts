import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null): void {
  lenis = instance;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    // a menu or a full-screen window may have paused smooth scrolling; a stopped Lenis ignores scrollTo
    if (lenis.isStopped) lenis.start();
    lenis.scrollTo(el, { offset: id === "top" ? 0 : -88 });
  } else el.scrollIntoView({ block: "start" });
}
