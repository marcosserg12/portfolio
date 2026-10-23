"use client";

import { useRef } from "react";
import { useReveal } from "@/components/motion/useReveal";
import { PoseBlock } from "@/components/ui/PoseBlock";
import { Container, Section, SectionHead } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Window } from "@/components/ui/Window";
import { useI18n } from "@/lib/i18n";

/** Open every day: filled in blue. Both spellings of the VPS chip (pt / en). */
const CORE = new Set(["PHP", "Laravel", "MySQL", "JavaScript", "Next.js", "Nginx", "VPS Linux", "Linux VPS", "Claude", "Claude Code"]);
/** Tools this portfolio itself was built with. */
const THIS_SITE = new Set(["Next.js", "Claude Code"]);

/** "Grupo Ibra — Ibranutro" → "Grupo Ibra"; "Departamento Civil da Marinha do Brasil" → "Marinha do Brasil". */
function shortCompany(name: string): string {
  return name.split(" — ")[0].replace(/^Departamento Civil da /, "");
}

/**
 * The stack as a config file: one row per role, the tools used every day filled in blue. Hovering or focusing a
 * tool tells where it was used, from the experience and project records on this page.
 */
export function Stack() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const usage = (item: string) => {
    const where = [
      ...t.experience.items.filter((e) => e.tags.includes(item)).map((e) => shortCompany(e.company)),
      ...t.projects.items.filter((p) => p.tags.includes(item)).map((p) => p.title),
    ];
    if (THIS_SITE.has(item)) where.push(t.desktop.thisSite);
    return [...new Set(where)];
  };

  return (
    <Section id="stack" ref={ref}>
      <Container>
        <SectionHead id="stack" title={t.stack.title} intro={t.stack.intro} pose={<PoseBlock pose="thumbs" animated alt="" />} />
        <Window data-window title="stack.config" icon="layers">
          <ul className="divide-y divide-line">
            {t.stack.groups.map((g, i) => {
              // The window clips what overflows it: rows in the lower half open their tooltips upwards, over the rows above.
              const up = i >= t.stack.groups.length / 2;
              return (
              <li key={g.name} data-group data-reveal className="relative grid gap-3 focus-within:z-10 hover:z-10 px-5 py-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center md:px-6">
                <h3 className="font-mono text-[13px] text-accent-ink">{g.name.toLowerCase()}</h3>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((item) => {
                    const where = usage(item);
                    const chip = `rounded-lg px-3 py-1.5 text-[15px] font-medium transition-[background-color,border-color,transform] duration-200 ${
                      CORE.has(item) ? "bg-accent text-white hover:bg-accent-ink" : "border border-line bg-panel hover:border-accent"
                    }`;
                    if (!where.length) return <li key={item} className={chip}>{item}</li>;
                    const tipId = `use-${item.replace(/\W+/g, "-").toLowerCase()}`;
                    return (
                      <li key={item} className="relative">
                        <button type="button" aria-describedby={tipId} className={`peer ${chip} hover:-translate-y-0.5`}>
                          {item}
                        </button>
                        <span
                          role="tooltip"
                          id={tipId}
                          className={`pointer-events-none absolute left-0 z-20 w-max max-w-[280px] ${up ? "bottom-full mb-2 -translate-y-1" : "top-full mt-2 translate-y-1"} rounded-lg bg-night px-3 py-2 text-[13px] leading-snug text-paper opacity-0 shadow-[0_12px_30px_-10px_rgb(0_0_0/0.6)] transition-[opacity,transform] duration-200 peer-hover:translate-y-0 peer-hover:opacity-100 peer-focus:translate-y-0 peer-focus:opacity-100`}
                        >
                          <span className="font-mono text-[11px] text-accent-hi">{t.desktop.usedIn}</span>
                          <span className="block">{where.join(" · ")}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
              );
            })}
          </ul>
        </Window>

        <Window data-window title="monitor — vps" icon="shield" className="mt-6" bodyClassName="grid lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="border-b border-line bg-bar p-6 lg:border-b-0 lg:border-r md:p-7">
            <span className="grid size-11 place-items-center rounded-xl bg-ok/15 text-ok-ink">
              <Icon name="shield" size={24} />
            </span>
            <h3 className="mt-4 text-[22px] font-semibold tracking-[-0.02em]">{t.stack.server.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{t.stack.server.intro}</p>
          </div>
          <ul className="grid sm:grid-cols-2">
            {t.stack.server.items.map((s) => (
              <li key={s.name} data-reveal className="flex gap-3 border-b border-line px-5 py-4 md:px-6 sm:[&:nth-child(odd)]:border-r">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ok text-white">
                  <Icon name="check" size={14} />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{s.name}</span>
                  <span className="block text-[14px] leading-snug text-muted">{s.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </Window>
      </Container>
    </Section>
  );
}
