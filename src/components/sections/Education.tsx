"use client";

import { useRef } from "react";
import { useReveal } from "@/components/motion/useReveal";
import { Container, Section, SectionHead } from "@/components/ui/Section";
import { Window } from "@/components/ui/Window";
import { useI18n } from "@/lib/i18n";

export function Education() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <Section id="formacao" ref={ref}>
      <Container>
        <SectionHead id="formacao" title={t.education.title} intro={t.education.intro} />
        <Window data-window title="formacao.txt" icon="cap">
          <ul className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
            {t.education.items.map((e) => (
              <li key={e.course} data-reveal className="flex flex-col gap-1.5 p-6">
                <span className="font-mono text-[12px] text-muted">{e.period}</span>
                <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.01em]">{e.course}</h3>
                <span className="text-[14px] text-muted">{e.institution}</span>
              </li>
            ))}
          </ul>
        </Window>
      </Container>
    </Section>
  );
}
