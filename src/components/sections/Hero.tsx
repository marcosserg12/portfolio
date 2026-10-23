"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { AlphaVideo } from "@/components/ui/AlphaVideo";
import { DocIcon, FolderIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Window } from "@/components/ui/Window";
import { useI18n } from "@/lib/i18n";
import { gsap, hasFinePointer, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { scrollToId } from "@/lib/scroll";
import { Terminal } from "./Terminal";

const ORBIT = ["PHP", "Laravel", "MySQL", "JavaScript", "Next.js"];

/**
 * The MarcOS desktop: on the wallpaper the waving avatar sits in front of a blue sun with the stack orbiting
 * around it, on a frosted shelf where the Dock rests. Draggable windows (about, terminal, projects) and Finder
 * icons (click selects, double-click opens) sit around the avatar; on phones the icons become a home-screen grid.
 */
export function Hero() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const orbit = useRef<HTMLDivElement>(null);
  const zTop = useRef(10);
  const [closed, setClosed] = useState<string[]>([]);
  // Projetos starts in the Dock only on the first load; reopened after a close, it comes back open.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);
  const [sel, setSel] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const cv = t.contact.rows.find((r) => r.id === "cv")!.href;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo("[data-sun]", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }, 0)
        .fromTo("[data-avatar]", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2 }, 0.15)
        .fromTo("[data-hero]", { opacity: 0, y: 60, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.12, transformOrigin: "50% 100%" }, 0.45)
        .fromTo("[data-hero-icon]", { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.06 }, 0.7);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const scroll = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-col='left']", { y: -90, ease: "none", scrollTrigger: scroll });
        gsap.to("[data-col='right']", { y: -150, ease: "none", scrollTrigger: scroll });
        gsap.to("[data-stage-inner]", { scale: 0.94, yPercent: 5, ease: "none", scrollTrigger: scroll });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Orbiting stack chips + pointer parallax on the stage layers.
  useEffect(() => {
    const st = stage.current;
    const orb = orbit.current;
    if (!st || !orb) return;
    const chips = Array.from(orb.querySelectorAll<HTMLElement>("[data-orbit]"));
    const layers = Array.from(st.querySelectorAll<HTMLElement>("[data-depth]"));
    const still = prefersReducedMotion();
    let mx = 0, my = 0, tx = 0, ty = 0, raf = 0, r = orb.offsetWidth / 2;
    const t0 = performance.now();
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
    };
    if (!still && hasFinePointer()) window.addEventListener("pointermove", onMove);
    // Reading offsetWidth inside the frame would force a layout of the whole page on every frame.
    const sized = new ResizeObserver(() => void (r = orb.offsetWidth / 2));
    sized.observe(orb);
    const frame = (now: number) => {
      const time = (now - t0) / 1000;
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      const spin = still ? 0 : time * 0.12;
      chips.forEach((el, k) => {
        const a = spin + (k * Math.PI * 2) / chips.length - Math.PI / 2;
        el.style.transform = `translate(-50%,-50%) translate(${Math.cos(a) * r}px, ${Math.sin(a) * r * 0.97}px)`;
        el.style.opacity = Math.sin(a) > 0.15 ? "0" : "1";
      });
      layers.forEach((el, i) => {
        const d = Number(el.dataset.depth);
        el.style.translate = `${mx * 24 * d}px ${my * 16 * d + (still ? 0 : Math.sin(time * 1.1 + i * 1.7) * 5 * d)}px`;
      });
      if (!still) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    // Nobody sees the orbit once the desktop has scrolled away: stop the loop until it comes back.
    const seen = new IntersectionObserver(([e]) => {
      if (still) return; // the single frame that places the chips must run
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
    });
    seen.observe(st);
    return () => {
      cancelAnimationFrame(raf);
      sized.disconnect();
      seen.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Drag a window by its title bar. While held it lifts and tilts with the motion. On desktop it stays where you
  // throw it, with a little momentum, and its title bar never leaves the desktop; on touch it stretches and springs back.
  const startDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    const win = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-drag]");
    const host = root.current;
    if (!win || !host) return;
    const free = hasFinePointer() && window.innerWidth >= 1024;
    const still = prefersReducedMotion();
    const x0 = Number(gsap.getProperty(win, "x")) || 0;
    const y0 = Number(gsap.getProperty(win, "y")) || 0;
    const sx = e.clientX;
    const sy = e.clientY;
    const toX = gsap.quickTo(win, "x", { duration: still ? 0 : 0.16, ease: "power3" });
    const toY = gsap.quickTo(win, "y", { duration: still ? 0 : 0.16, ease: "power3" });
    const toR = gsap.quickTo(win, "rotation", { duration: 0.3, ease: "power3" });
    let dx = 0, dy = 0, vx = 0, vy = 0, lx = sx, ly = sy, lt = performance.now();
    win.dataset.dragging = "true";
    if (!still) gsap.to(win, { scale: 1.03, duration: 0.2, ease: "power2.out" });

    const move = (ev: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lt);
      vx = vx * 0.6 + ((ev.clientX - lx) / dt) * 0.4;
      vy = vy * 0.6 + ((ev.clientY - ly) / dt) * 0.4;
      lx = ev.clientX;
      ly = ev.clientY;
      lt = now;
      dx = ev.clientX - sx;
      dy = ev.clientY - sy;
      const k = free ? 1 : 0.45;
      toX(x0 + dx * k);
      toY(y0 + dy * k);
      if (!still) toR(Math.max(-5, Math.min(5, vx * 4)));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      delete win.dataset.dragging;
      gsap.to(win, { scale: 1, rotation: 0, duration: 0.5, ease: still ? "none" : "back.out(2.2)" });
      if (!free) {
        gsap.to(win, { x: x0, y: y0, duration: still ? 0 : 0.9, ease: "elastic.out(1, 0.45)" });
        return;
      }
      const cx = Number(gsap.getProperty(win, "x")) || 0;
      const cy = Number(gsap.getProperty(win, "y")) || 0;
      const tx = x0 + dx + (still ? 0 : vx * 160);
      const ty = y0 + dy + (still ? 0 : vy * 160);
      const r = win.getBoundingClientRect();
      const h = host.getBoundingClientRect();
      const left = r.left + tx - cx;
      const top = r.top + ty - cy;
      const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
      const fx = tx + clamp(left, h.left - r.width + 160, h.right - 160) - left;
      const fy = ty + clamp(top, h.top + 48, h.bottom - 160) - top;
      gsap.to(win, { x: fx, y: fy, duration: still ? 0 : 0.7, ease: "power3.out" });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };
  const focus = (e: ReactPointerEvent<HTMLDivElement>) => {
    zTop.current += 1;
    (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-drag]")!.style.zIndex = String(zTop.current);
  };

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToId(id);
  };

  // Close fades the window out as it shrinks a little, like macOS; "Reabrir janelas" brings the closed ones back.
  const close = (id: string) => () => {
    const win = root.current?.querySelector<HTMLElement>(`[data-win="${id}"]`);
    const done = () => setClosed((c) => [...c, id]);
    if (!win || prefersReducedMotion()) return done();
    gsap.to(win, { scale: 0.9, opacity: 0, duration: 0.22, ease: "power2.in", onComplete: done });
  };
  const reopen = () => {
    const back = closed;
    setClosed([]);
    requestAnimationFrame(() =>
      back.forEach((id) => {
        const win = root.current?.querySelector<HTMLElement>(`[data-win="${id}"]`);
        if (win) gsap.fromTo(win, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: prefersReducedMotion() ? 0 : 0.35, ease: "power2.out" });
      }),
    );
  };

  // Rubber-band selection on the wallpaper, picking up the desktop icons it crosses.
  const select = (e: ReactPointerEvent<HTMLElement>) => {
    if (!hasFinePointer() || window.innerWidth < 1024 || e.button !== 0) return;
    const host = root.current;
    if (!host || (e.target as HTMLElement).closest("[data-drag], a, button, input, [data-hero-icon]")) return;
    const box = host.getBoundingClientRect();
    const x0 = e.clientX - box.left;
    const y0 = e.clientY - box.top;
    const icons = Array.from(host.querySelectorAll<HTMLElement>("[data-hero-icon] a"));
    icons.forEach((i) => delete i.dataset.selected);
    const move = (ev: PointerEvent) => {
      const x = ev.clientX - box.left;
      const y = ev.clientY - box.top;
      const rect = { x: Math.min(x0, x), y: Math.min(y0, y), w: Math.abs(x - x0), h: Math.abs(y - y0) };
      setSel(rect);
      icons.forEach((i) => {
        const r = i.getBoundingClientRect();
        const hit = r.right - box.left > rect.x && r.left - box.left < rect.x + rect.w && r.bottom - box.top > rect.y && r.top - box.top < rect.y + rect.h;
        if (hit) i.dataset.selected = "true";
        else delete i.dataset.selected;
      });
    };
    const up = () => {
      setSel(null);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // Only the files: the apps (projects, terminal, contact) already live in the Dock.
  const icons: { label: string; art: ReactNode; href: string; open?: () => void; download?: boolean }[] = [
    { label: t.desktop.icons.cv, art: <DocIcon size={58} />, href: cv, download: true },
    { label: t.desktop.icons.experience, art: <DocIcon size={58} badge="LOG" tone="#556178" />, href: "#experiencia", open: () => scrollToId("experiencia") },
  ];
  // One click opens (a website, not Finder): the icon is selected, pulses like an app launching, and opens.
  const iconClick = (i: (typeof icons)[number]) => (e: MouseEvent<HTMLAnchorElement>) => {
    root.current?.querySelectorAll<HTMLElement>("[data-hero-icon] a").forEach((a) => delete a.dataset.selected);
    const link = e.currentTarget;
    link.dataset.selected = "true";
    window.setTimeout(() => delete link.dataset.selected, 1200);
    const art = link.querySelector("[data-art]");
    if (art && !prefersReducedMotion()) gsap.fromTo(art, { scale: 1 }, { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
    if (i.download) return;
    e.preventDefault();
    i.open?.();
  };

  return (
    <section
      id="top"
      ref={root}
      aria-labelledby="hero-title"
      onPointerDown={select}
      className={`hero-vars relative overflow-hidden pt-10 text-ink lg:h-svh lg:min-h-[740px] ${sel ? "select-none" : ""}`}
    >
      {/* Stage: blue sun, orbiting stack, the avatar clip and floating code, sitting on the desk */}
      <div
        ref={stage}
        className="relative mx-auto mt-2 aspect-square w-[88%] max-w-[480px] sm:mt-32 sm:w-full sm:aspect-[1100/570] sm:max-w-[760px] lg:absolute lg:bottom-[var(--floor)] lg:left-[calc(50%+130px)] lg:mt-0 lg:w-[var(--av)] lg:max-w-none lg:-translate-x-1/2 xl:left-[var(--cx)]"
      >
        <div data-stage-inner className="absolute inset-0">
          <div data-depth="0.25" className="absolute left-1/2 top-[49%] w-[56%] sm:top-[34%] sm:w-[42%]">
            <div
              data-sun
              aria-hidden="true"
              className="aspect-square w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_14px_rgb(47_93_184/0.15),0_0_120px_20px_rgb(47_93_184/0.35)]"
            />
          </div>
          <div ref={orbit} aria-hidden="true" className="absolute left-1/2 top-[49%] aspect-square w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-rim sm:top-[34%] sm:w-[62%]">
            {ORBIT.map((name, k) => (
              <span key={name} data-orbit={k} className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-rim bg-glass/75 px-2.5 py-1 font-mono text-[11px] text-ink shadow-[0_4px_12px_-6px_rgb(20_40_90/0.4)] transition-opacity duration-500 sm:text-[12px]">
                {name}
              </span>
            ))}
          </div>
          <div data-avatar className="absolute inset-x-0 bottom-0 h-[80%] sm:h-full">
            <AlphaVideo
              src="/media/avatar-wave-alpha.webm"
              poster="/media/avatar-wave-alpha-poster.webp"
              alt={t.hero.videoLabel}
              className="absolute inset-0 size-full object-cover object-bottom sm:object-contain"
            />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="h-3 border-t border-rim bg-glass/35 shadow-[0_-1px_0_rgb(20_40_90/0.08)] backdrop-blur-md lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-[var(--floor)]" />

      <div className="relative z-10 flex flex-col gap-4 px-page pb-4 pt-4 lg:contents">
        <div data-col="left" className="mx-auto flex w-full max-w-[560px] flex-col gap-4 lg:absolute lg:left-[2.5vw] lg:top-16 lg:mx-0 lg:w-[336px]">
          <Window title="sobre.txt" icon="user" maximizable={false} ghost={false} onTitlePointerDown={startDrag} onPointerDown={focus} className="relative data-[dragging]:shadow-[0_40px_90px_-20px_rgb(20_40_90/0.6)]" bodyClassName="p-6 lg:p-5" data-drag data-hero data-win="about">
            {/* From lg the card is 84% of its old size (the column is as wide as it). */}
            <h1 id="hero-title" className="text-[40px] font-semibold leading-none tracking-[-0.045em] md:text-[44px] lg:text-[37px]">
              {t.hero.firstName} {t.hero.lastName}
            </h1>
            <p className="mt-3 font-medium text-accent-ink lg:mt-2.5 lg:text-[14px]">
              {t.hero.role} · {t.hero.location}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted lg:mt-2.5 lg:text-[14px]">{t.hero.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2 lg:mt-4">
              <Button href="#projetos" onClick={go("projetos")} className="lg:h-10 lg:px-4 lg:text-[14px]">{t.hero.primary}</Button>
              <Button href={cv} variant="outline" icon="download" iconFirst download className="lg:h-10 lg:px-4 lg:text-[14px]">{t.hero.secondary}</Button>
            </div>
          </Window>
          {closed.length > 0 && (
            <button type="button" onClick={reopen} className="glass flex items-center gap-2 self-start rounded-full px-4 py-2 text-[13px] font-semibold text-ink shadow-[0_8px_20px_-10px_rgb(20_40_90/0.5)] hover:bg-glass/80">
              <Icon name="max" size={14} />
              {t.desktop.window.reopen}
            </button>
          )}
        </div>

        {/* The terminal at 84% of its old size: under sobre.txt on phones, in the lower left corner from lg (no room
            beside the avatar yet) and in the lower right corner from xl. */}
        {!closed.includes("terminal") && (
          <div data-col="right" className="mx-auto w-full max-w-[560px] lg:absolute lg:bottom-[calc(var(--floor)+20px)] lg:left-[2.5vw] lg:mx-0 lg:w-[336px] xl:left-auto xl:right-6">
            <Window dark title="terminal — marcos@brasilia" icon="terminal" maximizable={false} ghost={false} onClose={close("terminal")} onTitlePointerDown={startDrag} onPointerDown={focus} className="relative data-[dragging]:shadow-[0_40px_90px_-20px_rgb(20_40_90/0.6)]" data-drag data-hero data-win="terminal">
              <Terminal />
            </Window>
          </div>
        )}

        <div data-col="right" className="hidden min-[90rem]:absolute min-[90rem]:right-[136px] min-[90rem]:top-16 min-[90rem]:block min-[90rem]:w-[320px]">
          {!closed.includes("projects") && (
          <Window title={t.desktop.icons.projects} icon="folder" maximizable={false} ghost={false} startMinimized={loaded ? undefined : "wide"} onClose={close("projects")} onTitlePointerDown={startDrag} onPointerDown={focus} className="relative data-[dragging]:shadow-[0_40px_90px_-20px_rgb(20_40_90/0.6)]" data-drag data-hero data-win="projects">
            <p className="flex items-center gap-2 border-b border-line px-4 py-2.5 font-mono text-[12px] text-muted">
              <Icon name="folder" size={14} />~/projetos · {t.projects.items.length}
            </p>
            {/* Four rows (55px each) in view, the rest scrolls; Lenis leaves the wheel to the list. */}
            <ul data-lenis-prevent className="max-h-[236px] overflow-y-auto overscroll-contain p-2">
              {t.projects.items.map((p) => (
                <li key={p.id}>
                  <a href="#projetos" onClick={go("projetos")} className="flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-accent-soft">
                    <FolderIcon size={30} className="shrink-0" />
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-medium">{p.title}</span>
                      <span className="block text-[12px] text-muted">{p.kind} · {p.domain}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Window>
          )}
        </div>
      </div>

      {sel && (
        <div aria-hidden="true" className="pointer-events-none absolute z-20 rounded-sm border border-accent-hi/80 bg-accent/20" style={{ left: sel.x, top: sel.y, width: sel.w, height: sel.h }} />
      )}

      <ul className="absolute right-4 top-14 z-10 hidden flex-col gap-2 xl:flex">
        {icons.map((i) => (
          <li key={i.label} data-hero-icon>
            <a href={i.href} onClick={iconClick(i)} download={i.download || undefined} className="group grid w-[96px] justify-items-center gap-1 rounded-lg p-1 text-center">
              <span data-art className="grid h-[68px] w-[76px] place-items-center rounded-md drop-shadow-[0_6px_8px_rgb(20_40_90/0.3)] group-data-[selected]:bg-shade/15">{i.art}</span>
              <span className="rounded px-1.5 py-px text-[12px] font-semibold leading-tight text-ink [text-shadow:0_1px_2px_var(--label-glow)] group-data-[selected]:bg-accent group-data-[selected]:text-white group-data-[selected]:[text-shadow:none]">
                {i.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
