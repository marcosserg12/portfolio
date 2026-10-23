"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type PointerEvent } from "react";
import { AppIcon, DocIcon, type AppId } from "@/components/ui/AppIcon";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n";
import { gsap, hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import { scrollToId } from "@/lib/scroll";
import { minimizedWindows } from "@/lib/windows";

/**
 * The macOS Dock: the site's navigation. Each section is an app; the first time you reach one it "launches"
 * (the icon bounces) and keeps a running dot. Minimised windows wait after the divider; tiles magnify around
 * the cursor on desktop pointers. The last item downloads the CV.
 */
export function Dock() {
  const { t } = useI18n();
  const [active, setActive] = useState("top");
  const [running, setRunning] = useState<string[]>(["top"]);
  const list = useRef<HTMLUListElement>(null);
  const minimized = useSyncExternalStore(minimizedWindows.subscribe, minimizedWindows.get, () => minimizedWindows.empty);
  const cv = t.contact.rows.find((r) => r.id === "cv")!.href;
  const github = t.contact.rows.find((r) => r.id === "github")!.href;
  const label = (id: string) => t.nav.links.find((l) => l.id === id)?.label ?? id;

  const apps: { id: AppId; label: string; phone?: boolean }[] = [
    { id: "top", label: t.nav.home, phone: true },
    { id: "sobre", label: label("sobre"), phone: true },
    { id: "experiencia", label: label("experiencia") },
    { id: "projetos", label: label("projetos"), phone: true },
    { id: "stack", label: label("stack") },
    { id: "formacao", label: label("formacao") },
    { id: "contato", label: label("contato"), phone: true },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          setActive(id);
          setRunning((r) => {
            if (r.includes(id)) return r;
            const icon = list.current?.querySelector(`[data-app="${id}"] [data-bounce]`);
            if (icon && !prefersReducedMotion()) gsap.to(icon, { keyframes: { y: [0, -18, 0, -9, 0] }, duration: 0.9, ease: "none" });
            return [...r, id];
          });
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    apps.forEach((a) => {
      const el = document.getElementById(a.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const magnify = (e: PointerEvent<HTMLUListElement>) => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    list.current?.querySelectorAll<HTMLElement>("[data-tile]").forEach((tile) => {
      const r = tile.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      const s = 1 + 0.5 * Math.max(0, 1 - d / 140);
      tile.style.transform = `translateY(${-(s - 1) * 24}px) scale(${s})`;
    });
  };
  const rest = () => list.current?.querySelectorAll<HTMLElement>("[data-tile]").forEach((tile) => (tile.style.transform = ""));

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToId(id);
  };

  const tip = "pointer-events-none absolute -top-11 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-shade/10 bg-glass/85 px-2.5 py-1 text-[12px] font-medium text-ink opacity-0 shadow-md backdrop-blur transition-opacity group-hover:opacity-100 md:block";
  const tile = "block origin-bottom transition-transform duration-150 ease-out";

  return (
    <nav aria-label="Dock" className="fixed inset-x-0 bottom-2 z-40 flex justify-center px-2 md:bottom-3">
      <ul
        ref={list}
        onPointerMove={magnify}
        onPointerLeave={rest}
        className="glass flex items-end gap-1.5 rounded-[22px] px-2 pb-2 pt-2 shadow-[0_12px_40px_-12px_rgb(20_40_90/0.5)] md:gap-2 md:rounded-[24px] md:px-2.5"
      >
        {apps.map((a) => {
          const on = active === a.id;
          return (
            <li key={a.id} data-app={a.id} className={`group relative ${a.phone ? "" : "max-sm:hidden"}`}>
              <a href={`#${a.id}`} onClick={go(a.id)} aria-label={a.label} aria-current={on ? "true" : undefined} data-tile className={tile}>
                <span data-bounce className="block">
                  <AppIcon app={a.id} glyph={22} className="size-11 md:size-12" />
                </span>
              </a>
              <span className={tip}>{a.label}</span>
              <span aria-hidden="true" className={`absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-ink/70 transition-opacity ${running.includes(a.id) ? "opacity-100" : "opacity-0"}`} />
            </li>
          );
        })}
        <li data-dock-slot className="mx-0.5 h-10 w-px self-center bg-ink/15" aria-hidden="true" />
        {minimized.map((w) => (
          <li key={w.id} className="group relative">
            <button type="button" onClick={w.restore} aria-label={`${t.desktop.window.restore}: ${w.title}`} data-tile className={tile}>
              <span className="flex size-11 flex-col overflow-hidden rounded-md border border-shade/10 bg-panel shadow-md md:size-12">
                <span className="flex h-2.5 items-center gap-0.5 bg-bar px-1">
                  <span className="size-1 rounded-full bg-[#ff5f57]" />
                  <span className="size-1 rounded-full bg-[#febc2e]" />
                  <span className="size-1 rounded-full bg-[#28c840]" />
                </span>
                <span className="grid flex-1 place-items-center text-muted">
                  <Icon name={w.icon} size={18} />
                </span>
              </span>
            </button>
            <span className={tip}>{w.title}</span>
          </li>
        ))}
        <li className="group relative">
          <a href={github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub (${t.desktop.newTab})`} data-tile className={tile}>
            <AppIcon app="github" glyph={24} className="size-11 md:size-12" />
          </a>
          <span className={tip}>GitHub</span>
        </li>
        <li className="group relative">
          <a href={cv} download aria-label={t.hero.secondary} data-tile className={`${tile} grid size-11 place-items-center md:size-12`}>
            <DocIcon size={44} />
          </a>
          <span className={tip}>{t.desktop.icons.cv}</span>
        </li>
      </ul>
    </nav>
  );
}
