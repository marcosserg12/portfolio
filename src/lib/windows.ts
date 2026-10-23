import type { IconName } from "@/components/ui/Icon";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/** A window sent to the Dock; `restore` brings it back to its place on the page. */
export type MinimizedWindow = { id: string; title: string; icon: IconName; restore: () => void };

let items: MinimizedWindow[] = [];
const subscribers = new Set<() => void>();
const emit = () => subscribers.forEach((fn) => fn());

export const minimizedWindows = {
  subscribe(fn: () => void) {
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  },
  get: () => items,
  empty: [] as MinimizedWindow[],
};

export function addMinimized(win: MinimizedWindow) {
  items = [...items.filter((i) => i.id !== win.id), win];
  emit();
}

export function removeMinimized(id: string) {
  items = items.filter((i) => i.id !== id);
  emit();
}

/** Where windows fly to when minimised: the slot after the Dock's divider. */
export function dockTarget(): DOMRect | null {
  return document.querySelector("[data-dock-slot]")?.getBoundingClientRect() ?? null;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * The genie outline as a clip-path: at `q` 0 the whole window (with room for its shadow), at 1 its sides have
 * curved in, S-shaped like macOS, down to a neck `neck` wide at `at` (0–1 across the window) on the bottom edge.
 */
export function genieShape(at: number, q: number, neck = 0.1) {
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= 10; i++) {
    const y = i / 10;
    const k = smooth(y) * q;
    const yy = (-10 + y * 120).toFixed(1);
    const l = -10 + (at * 100 - neck * 50 + 10) * k;
    const r = 110 - (110 - (at * 100 + neck * 50)) * k;
    left.push(`${l.toFixed(2)}% ${yy}%`);
    right.unshift(`${r.toFixed(2)}% ${yy}%`);
  }
  return `polygon(${[...left, ...right].join(",")})`;
}

/**
 * The macOS genie, built for `el` where it stands now: the sides curve in towards the Dock, then the window pours
 * down through the neck into the Dock slot. Play it to minimise; from the end, reversed, it restores.
 * Returns null without a Dock or with reduced motion.
 */
export function genieTimeline(el: HTMLElement) {
  const target = dockTarget();
  if (!target || prefersReducedMotion()) return null;
  const r = el.getBoundingClientRect();
  const tx = target.left + target.width / 2;
  const at = Math.min(0.95, Math.max(0.05, (tx - r.left) / r.width));
  const x = Number(gsap.getProperty(el, "x")) || 0;
  const y = Number(gsap.getProperty(el, "y")) || 0;
  const shape = { q: 0 };
  return gsap
    .timeline({ paused: true })
    .to(shape, { q: 1, duration: 0.4, ease: "power2.in", onUpdate: () => void (el.style.clipPath = genieShape(at, shape.q)) }, 0)
    .to(el, { x: x + tx - (r.left + at * r.width), y: y + target.top + target.height / 2 - r.bottom, scaleY: 0.05, scaleX: 0.16, transformOrigin: `${at * 100}% 100%`, duration: 0.5, ease: "power3.in" }, 0.16)
    .to(el, { opacity: 0, duration: 0.14, ease: "none" }, 0.52);
}
