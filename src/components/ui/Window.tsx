"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEventHandler, type ReactNode, type Ref } from "react";
import { useI18n } from "@/lib/i18n";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { getLenis } from "@/lib/scroll";
import { addMinimized, genieTimeline, removeMinimized } from "@/lib/windows";
import { Icon, type IconName } from "./Icon";

type WindowProps = {
  [data: `data-${string}`]: string | boolean | number | undefined;
  title: string;
  icon: IconName;
  children: ReactNode;
  dark?: boolean;
  className?: string;
  bodyClassName?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  onTitlePointerDown?: PointerEventHandler<HTMLDivElement>;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  /** Enables the red light; the caller decides what closing means. */
  onClose?: () => void;
  /** Enables the green light (off for windows inside moving layers). */
  maximizable?: boolean;
  /**
   * While minimised, leave a dashed outline with "Restaurar" where the window was (section windows). Off for the
   * desktop's own windows: they simply go to the Dock, and on phones they leave the flow until restored.
   */
  ghost?: boolean;
};

const GLYPHS = {
  close: "M4.2 4.2l3.6 3.6M7.8 4.2 4.2 7.8",
  min: "M3.6 6h4.8",
  zoom: "M3.8 8.2V4.9l3.3 3.3zM8.2 3.8v3.3L4.9 3.8z",
};

/**
 * An application window of MarcOS, drawn like macOS: traffic lights on the left, title in the middle.
 * Yellow minimises with the genie effect into the Dock (optionally an outline keeps its place and restores it),
 * green zooms to full screen (double-click the title bar too; Esc or a click outside leaves), red is the caller's.
 */
export function Window({ title, icon, children, dark, className = "", bodyClassName = "", style, ref, onTitlePointerDown, onPointerDown, onClose, maximizable = true, ghost = true, ...data }: WindowProps) {
  const { t } = useI18n();
  const labels = t.desktop.window;
  const id = useId();
  const [min, setMin] = useState(false);
  const [max, setMax] = useState(false);
  const [holder, setHolder] = useState(0);
  const self = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => removeMinimized(id), [id]);

  useEffect(() => {
    if (!max) return;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    if (self.current && !prefersReducedMotion()) gsap.fromTo(self.current, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "expo.out" });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMax(false);
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [max]);

  const toggleMax = () => {
    if (!max) setHolder(self.current?.offsetHeight ?? 0);
    setMax((m) => !m);
  };

  // The window keeps its place (and any offset it was dragged to) while it waits in the Dock.
  const rest = (el: HTMLElement) => {
    gsap.set(el, { scaleX: 1, scaleY: 1, opacity: 1 });
    el.style.clipPath = "";
  };

  const restore = () => {
    const el = self.current;
    if (!el) return;
    removeMinimized(id);
    setMin(false);
    // measure after React has put the window back in the layout (it may have left the flow on phones)
    requestAnimationFrame(() => bringBack(el));
  };

  const bringBack = (el: HTMLElement) => {
    const play = () => {
      const tl = genieTimeline(el);
      if (!tl) return gsap.set(el, { visibility: "visible" });
      tl.progress(1);
      gsap.set(el, { visibility: "visible" });
      tl.eventCallback("onReverseComplete", () => rest(el)).reverse();
    };
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return play();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -90, onComplete: play });
    else {
      el.scrollIntoView({ block: "center" });
      play();
    }
  };

  const minimize = () => {
    const el = self.current;
    if (!el || min || max) return;
    const x = gsap.getProperty(el, "x");
    const y = gsap.getProperty(el, "y");
    const done = () => {
      rest(el);
      gsap.set(el, { x, y, visibility: "hidden" });
      setMin(true);
      addMinimized({ id, title, icon, restore });
    };
    const tl = genieTimeline(el);
    if (!tl) return done();
    tl.eventCallback("onComplete", done).play();
  };

  const setRefs = (el: HTMLDivElement | null) => {
    self.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
  };

  const light = (kind: keyof typeof GLYPHS, color: string, label: string, onClick?: () => void) => (
    <button type="button" onClick={onClick} disabled={!onClick} aria-label={label} title={onClick ? label : undefined} className="grid size-5 place-items-center disabled:pointer-events-none pointer-coarse:size-7">
      <span className="grid size-3 place-items-center rounded-full shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.25)]" style={{ background: onClick ? color : dark ? "#3a4256" : "var(--light-off)" }}>
        {onClick && (
          <svg viewBox="0 0 12 12" className="size-3 opacity-0 transition-opacity group-hover/lights:opacity-100 group-focus-within/lights:opacity-100" aria-hidden="true">
            <path d={GLYPHS[kind]} stroke="rgb(0 0 0 / 0.6)" strokeWidth="1.2" fill={kind === "zoom" ? "rgb(0 0 0 / 0.6)" : "none"} strokeLinecap="round" />
          </svg>
        )}
      </span>
    </button>
  );

  return (
    <>
      {max && <div aria-hidden="true" style={{ height: holder }} />}
      {max && <div aria-hidden="true" onClick={() => setMax(false)} className="fixed inset-0 z-[55] bg-[rgb(20_40_90/0.28)] backdrop-blur-md" />}
      <div
        {...data}
        ref={setRefs}
        style={style}
        onPointerDown={onPointerDown}
        role={max ? "dialog" : undefined}
        aria-modal={max || undefined}
        aria-label={max ? title : undefined}
        className={`overflow-hidden rounded-xl border ${
          dark
            ? "on-dark border-black/40 bg-ink-2 text-paper shadow-[0_24px_60px_-18px_rgb(10_20_50/0.6),0_2px_8px_rgb(10_20_50/0.2)]"
            : "border-shade/10 bg-panel text-ink shadow-[0_24px_60px_-18px_rgb(20_40_90/0.45),0_2px_8px_rgb(20_40_90/0.12)]"
        } ${max ? "fixed inset-x-3 bottom-24 top-14 z-[56] flex flex-col md:inset-x-10" : "relative"} ${min && !ghost ? "max-lg:hidden" : ""} ${className}`}
      >
        <div
          onPointerDown={onTitlePointerDown}
          onDoubleClick={maximizable ? toggleMax : undefined}
          className={`relative flex h-[38px] shrink-0 select-none items-center border-b px-2.5 ${
            dark ? "border-black/30 bg-ink-3 text-ash" : "border-shade/[0.07] bg-bar text-muted"
          } ${onTitlePointerDown ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
        >
          <span className="group/lights relative z-10 flex gap-0.5">
            {light("close", "#ff5f57", labels.close, onClose)}
            {light("min", "#febc2e", labels.minimize, max ? undefined : minimize)}
            {light("zoom", "#28c840", max ? labels.unmaximize : labels.maximize, maximizable ? toggleMax : undefined)}
          </span>
          <span className={`pointer-events-none absolute inset-x-24 flex items-center justify-center gap-1.5 text-[13px] font-semibold ${dark ? "text-paper/85" : "text-ink/75"}`}>
            <Icon name={icon} size={14} className="shrink-0 opacity-70" />
            <span className="truncate">{title}</span>
          </span>
        </div>
        <div className={max ? "min-h-0 flex-1 overflow-y-auto" : ""}>
          <div className={bodyClassName}>{children}</div>
        </div>
        {min && ghost && (
          <div className="visible absolute inset-0 grid place-items-center rounded-xl border-2 border-dashed border-rim bg-glass/25 p-4 text-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <p className="text-[14px] font-medium text-ink/80">{labels.minimized}</p>
              <button type="button" onClick={restore} className="glass rounded-full px-4 py-2 text-[14px] font-semibold text-ink shadow-[0_6px_18px_-8px_rgb(20_40_90/0.5)] hover:bg-glass/80">
                {labels.restore} “{title}”
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
