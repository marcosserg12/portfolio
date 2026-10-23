"use client";

import { useRef } from "react";
import { NumberTicker } from "@/components/motion/NumberTicker";
import { useReveal } from "@/components/motion/useReveal";
import { PoseBlock } from "@/components/ui/PoseBlock";
import { Container, Section, SectionHead } from "@/components/ui/Section";
import { Window } from "@/components/ui/Window";
import { useI18n } from "@/lib/i18n";

export function About() {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <Section id="sobre" ref={ref}>
      <Container>
        <SectionHead id="sobre" title={t.about.title} pose={<PoseBlock pose="cheer" animated alt="" caption={locale === "pt" ? "olá!" : "hi!"} />} />
        <Window data-window title="sobre.md" icon="file" bodyClassName="grid lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-5 p-6 md:p-8 lg:p-10">
            <p className="max-w-[32ch] text-[clamp(22px,2.2vw,30px)] font-medium leading-[1.25] tracking-[-0.025em] text-balance">{t.about.statement}</p>
            <p className="max-w-[62ch] leading-relaxed text-muted text-pretty">{t.about.paragraph}</p>
          </div>
          {/* Get Info, as in the Finder: key/value rows and whether I'm taking work */}
          <aside className="flex flex-col border-t border-line bg-bar p-6 md:p-8 lg:border-l lg:border-t-0">
            <h3 className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">{t.about.info}</h3>
            <dl className="mt-3 divide-y divide-line">
              {t.about.facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="shrink-0 text-[14px] text-muted">{f.label}</dt>
                  <dd className="text-right text-[15px] font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 inline-flex items-center gap-2.5 self-start rounded-full bg-ok/12 px-3.5 py-1.5 text-[14px] font-medium text-ok-ink lg:mt-auto">
              <span aria-hidden="true" className="pulse-ok size-2 rounded-full bg-ok" />
              {t.about.status}
            </p>
          </aside>
          <ul className="grid border-t border-line bg-bar sm:grid-cols-3 lg:col-span-2">
            {t.about.stats.map((s, i) => (
              <li key={s.label} className={`flex items-baseline gap-3 px-6 py-5 sm:flex-col sm:gap-1.5 md:px-8 lg:flex-row lg:gap-3 ${i > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""}`}>
                <NumberTicker value={s.value} suffix={s.suffix} className="text-[40px] font-semibold leading-none tracking-[-0.04em] text-accent" />
                <span className="text-[14px] leading-snug text-muted">{s.label}</span>
              </li>
            ))}
          </ul>
        </Window>
      </Container>
    </Section>
  );
}
