"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AppIcon, DocIcon, FolderIcon } from "@/components/ui/AppIcon";
import { Icon } from "@/components/ui/Icon";
import type { Locale, SectionId } from "@/content/types";
import { useI18n } from "@/lib/i18n";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { getLenis, scrollToId } from "@/lib/scroll";

function LangToggle() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div role="group" aria-label={t.nav.language} className="flex rounded-md bg-shade/[0.07] p-0.5 font-mono text-[12px]">
      {(["pt", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={locale === l}
          onClick={() => setLocale(l)}
          className={`h-7 min-w-8 rounded px-2 uppercase transition-colors ${locale === l ? "bg-panel text-ink shadow-sm" : "text-ink/60 hover:text-ink"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

type TransitionDoc = Document & { startViewTransition?: (update: () => void) => { ready: Promise<void> } };

/**
 * Light / dark switch. The site always opens light (no stored choice, no system preference); switching paints the
 * new theme in a circle that grows out of the button, where the browser supports view transitions.
 */
function ThemeToggle() {
  const { t } = useI18n();
  const [dark, setDark] = useState(false);
  const flip = (e: MouseEvent<HTMLButtonElement>) => {
    const next = !dark;
    const apply = () => {
      const html = document.documentElement;
      if (next) html.dataset.theme = "dark";
      else delete html.dataset.theme;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? "#0b1430" : "#a8c5f4");
      setDark(next);
    };
    const doc = document as TransitionDoc;
    if (!doc.startViewTransition || prefersReducedMotion()) return apply();
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(apply).ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
      ),
    );
  };
  return (
    <button
      type="button"
      onClick={flip}
      aria-pressed={dark}
      aria-label={t.nav.theme}
      title={t.nav.theme}
      className="grid size-8 place-items-center rounded-md transition-colors hover:bg-shade/[0.06]"
    >
      <Icon name={dark ? "sun" : "moon"} size={16} />
    </button>
  );
}

/** The menu bar clock, as macOS writes it: "ter. 21 de out. 18:02" (Brasília time). */
function Clock() {
  const { locale } = useI18n();
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const tz = { timeZone: "America/Sao_Paulo" } as const;
      const lang = locale === "pt" ? "pt-BR" : "en-US";
      const day = now.toLocaleDateString(lang, { ...tz, weekday: "short", day: "numeric", month: "short" });
      setTime(`${day}  ${now.toLocaleTimeString("pt-BR", { ...tz, hour: "2-digit", minute: "2-digit" })}`);
    };
    tick();
    const id = window.setInterval(tick, 10000);
    return () => window.clearInterval(id);
  }, [locale]);
  return <span className="whitespace-pre tabular-nums">{time}</span>;
}

/** MarcOS menu bar: frosted like macOS; the bold name is the app (section) in front, the sections are its menus. */
export function Nav() {
  const { t } = useI18n();
  const [active, setActive] = useState<SectionId | null>(null);
  const [open, setOpen] = useState(false);
  const finder = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const cv = t.contact.rows.find((r) => r.id === "cv")!.href;
  const github = t.contact.rows.find((r) => r.id === "github")!.href;

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id === "top" ? null : (e.target.id as SectionId))),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["top", ...t.nav.links.map((l) => l.id)].forEach((sid) => {
      const el = document.getElementById(sid);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [t]);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    // the Finder window zooms out of the menu button, like a folder opening on macOS
    const win = finder.current;
    if (win && !prefersReducedMotion()) {
      gsap.fromTo(win, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42, ease: "expo.out", transformOrigin: "92% 0%" });
    }
    win?.querySelector<HTMLElement>("[data-current], a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      toggle.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    document.body.style.overflow = "";
    scrollToId(id);
  };

  return (
    <>
      <a href="#conteudo" className="sr-only z-[70] rounded-md bg-accent px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-12">
        {t.nav.skip}
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-rim bg-glass/55 text-ink shadow-[0_1px_0_rgb(20_40_90/0.06)] backdrop-blur-2xl backdrop-saturate-150">
        <nav aria-label={t.nav.home} className="relative z-10 flex h-10 items-center gap-6 px-3 text-[13px] md:px-4">
          <a href="#top" onClick={go("top")} className="flex h-8 items-center gap-2.5 font-bold">
            <span className="grid size-[22px] place-items-center rounded-md bg-ink text-[12px] text-panel">M</span>
            {active ? t.nav.links.find((l) => l.id === active)?.label : t.desktop.os}
          </a>
          <ul className="hidden items-center gap-5 lg:flex">
            {t.nav.links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`rounded px-1.5 py-1 transition-colors ${active === l.id ? "bg-accent text-white" : "text-ink/80 hover:bg-shade/[0.06]"}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden items-center gap-2 md:flex">
              <span className="pulse-ok size-[7px] rounded-full bg-live" />
              {t.desktop.available}
            </span>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub (${t.desktop.newTab})`}
              title="GitHub"
              className="-mx-1 grid size-8 place-items-center rounded-md text-ink/80 transition-colors hover:bg-shade/[0.06] hover:text-ink"
            >
              <Icon name="github" size={16} />
            </a>
            <span className="flex items-center gap-1.5">
              <ThemeToggle />
              <LangToggle />
            </span>
            <span className="hidden items-center gap-3 sm:flex">
              <Icon name="wifi" size={15} />
              <Clock />
            </span>
            <button
              ref={toggle}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className="-mr-1 grid size-8 place-items-center rounded-md hover:bg-shade/[0.06] lg:hidden"
            >
              <Icon name={open ? "close" : "menu"} size={18} />
              <span className="sr-only">{open ? t.nav.close : t.nav.menu}</span>
            </button>
          </div>
        </nav>
      </header>
      {open && (
        // Phones and tablets: the menu is a Finder window of folders, one per section, opened from the menu button.
        // It lives outside the header: the header's backdrop-filter would trap a fixed child inside its 40px.
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div aria-hidden="true" onClick={() => setOpen(false)} className="absolute inset-0 bg-[rgb(20_40_90/0.25)] backdrop-blur-sm" />
          <div
            id="mobile-menu"
            ref={finder}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            className="absolute inset-x-3 top-12 overflow-hidden rounded-xl border border-shade/10 bg-panel text-ink shadow-[0_30px_70px_-20px_rgb(20_40_90/0.6)] sm:left-auto sm:w-[440px]"
          >
            <div className="relative flex h-[38px] items-center border-b border-shade/[0.07] bg-bar px-2.5">
              <span className="flex items-center gap-2">
                <button type="button" onClick={() => setOpen(false)} aria-label={t.nav.close} className="grid size-7 place-items-center">
                  <span className="grid size-3 place-items-center rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.25)]">
                    <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
                      <path d="M4.2 4.2l3.6 3.6M7.8 4.2 4.2 7.8" stroke="rgb(0 0 0 / 0.6)" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <span aria-hidden="true" className="size-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.25)]" />
                <span aria-hidden="true" className="size-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.25)]" />
              </span>
              <span className="pointer-events-none absolute inset-x-24 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-ink/75">
                <FolderIcon size={16} />
                {t.desktop.os}
              </span>
            </div>
            <div className="flex items-center gap-2 border-b border-shade/[0.07] px-3 py-2 font-mono text-[12px] text-muted">
              <Icon name="folder" size={14} />
              ~/marcos
            </div>
            <ul className="grid grid-cols-3 gap-x-1 gap-y-3 p-3 sm:grid-cols-4">
              {t.nav.links.map((l) => {
                const on = active === l.id;
                return (
                  <li key={l.id}>
                    <a
                      href={`#${l.id}`}
                      onClick={go(l.id)}
                      data-current={on || undefined}
                      aria-current={on ? "true" : undefined}
                      className="group grid justify-items-center gap-1.5 rounded-lg px-1 py-2 text-center outline-offset-0 hover:bg-shade/[0.05]"
                    >
                      <span className={`grid place-items-center rounded-md px-1 ${on ? "bg-shade/[0.08]" : ""}`}>
                        <FolderIcon size={58} />
                      </span>
                      <span className={`max-w-full truncate rounded px-1.5 py-px text-[13px] font-medium ${on ? "bg-accent text-white" : ""}`}>{l.label}</span>
                    </a>
                  </li>
                );
              })}
              <li>
                <a href={cv} download className="grid justify-items-center gap-1.5 rounded-lg px-1 py-2 text-center outline-offset-0 hover:bg-shade/[0.05]">
                  <span className="grid h-[48px] place-items-center">
                    <DocIcon size={50} />
                  </span>
                  <span className="max-w-full truncate px-1.5 py-px text-[13px] font-medium">{t.desktop.icons.cv}</span>
                </a>
              </li>
              <li>
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GitHub (${t.desktop.newTab})`}
                  className="grid justify-items-center gap-1.5 rounded-lg px-1 py-2 text-center outline-offset-0 hover:bg-shade/[0.05]"
                >
                  <span className="grid h-[48px] place-items-center">
                    <AppIcon app="github" glyph={26} className="size-[46px]" />
                  </span>
                  <span className="max-w-full truncate px-1.5 py-px text-[13px] font-medium">GitHub</span>
                </a>
              </li>
            </ul>
            <p className="border-t border-shade/[0.07] bg-bar px-3 py-1.5 text-center text-[11px] text-muted">
              {t.nav.links.length + 2} {t.nav.items}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
