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
        <Window data-window title="sobre.md" icon="file" bodyClassName="grid md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
          <div className="relative min-h-[300px] overflow-hidden border-b border-line bg-surface md:border-b-0 md:border-r">
            <img src="/img/poses/face.webp" alt={t.hero.photoAlt} loading="lazy" className="absolute inset-x-0 bottom-0 mx-auto h-[94%] w-auto max-w-none object-contain object-bottom" />
            <span className="absolute bottom-3 left-3 rounded-md bg-night px-2 py-1 font-mono text-[11px] text-white">foto.png</span>
          </div>
          <div className="flex flex-col gap-6 p-6 md:p-8">
            <p className="text-[clamp(22px,2.2vw,28px)] font-medium leading-snug tracking-[-0.02em] text-pretty">{t.about.statement}</p>
            <p className="max-w-[68ch] leading-relaxed text-muted">{t.about.paragraph}</p>
            <dl className="grid gap-4 sm:grid-cols-3">
              {t.about.facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[12px] text-muted">{f.label}</dt>
                  <dd className="mt-1 font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ul className="grid border-t border-line bg-bar sm:grid-cols-3 md:col-span-2">
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
