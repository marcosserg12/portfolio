"use client";

import { useRef } from "react";
import { useReveal } from "@/components/motion/useReveal";
import { PoseBlock } from "@/components/ui/PoseBlock";
import { Container, Section, SectionHead } from "@/components/ui/Section";
import { Window } from "@/components/ui/Window";
import { useI18n } from "@/lib/i18n";

/** A short, stable pseudo commit hash for each role (decorative, derived from the company name). */
function hash(text: string): string {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

/** The career as a `git log` window: newest commit on top, the current job marked as HEAD (green = running now). */
export function Experience() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <Section id="experiencia" ref={ref}>
      <Container>
        <SectionHead id="experiencia" title={t.experience.title} intro={t.experience.intro} pose={<PoseBlock pose="crossed" alt="" />} />
        <Window data-window title="git log --carreira" icon="log" bodyClassName="px-5 py-7 md:px-8 md:py-9">
          <ol className="relative">
            <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-0.5 bg-line" />
            {t.experience.items.map((it, i) => {
              const head = it.end === null;
              return (
                <li key={it.company + it.period} data-item data-reveal className={`relative grid gap-x-10 gap-y-3 pl-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] ${i < t.experience.items.length - 1 ? "pb-10" : ""}`}>
                  <span aria-hidden="true" className={`absolute left-0 top-1.5 size-4 rounded-full ring-4 ring-panel ${head ? "bg-ok shadow-[0_0_0_7px_rgb(43_182_115/0.18)]" : "bg-[#c3cad6]"}`} />
                  <div>
                    <p className="flex flex-wrap items-center gap-2 font-mono text-[12px] text-muted">
                      {hash(it.company)}
                      {head && <span className="rounded bg-ok/15 px-2 py-0.5 text-ok-ink">HEAD → {t.experience.current}</span>}
                    </p>
                    <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-ink md:text-2xl">{it.company}</h3>
                    <p className="mt-1 text-[15px] text-muted">
                      {it.role} · {it.period} · {it.duration}
                    </p>
                  </div>
                  <div>
                    <p className="max-w-[70ch] leading-relaxed text-ink/80">{it.summary}</p>
                    <p className="mt-3 font-mono text-[12px] text-accent-ink">{it.tags.join("  ·  ")}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Window>
      </Container>
    </Section>
  );
}
