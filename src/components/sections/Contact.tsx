"use client";

import { useRef, useState } from "react";
import { useReveal } from "@/components/motion/useReveal";
import { Button } from "@/components/ui/Button";
import { PoseBlock } from "@/components/ui/PoseBlock";
import { Container, Section, SectionTitle, Widget } from "@/components/ui/Section";
import { Window } from "@/components/ui/Window";
import { useI18n } from "@/lib/i18n";

export function Contact() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const rows = Object.fromEntries(t.contact.rows.map((r) => [r.id, r]));
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${text}`;
    }
  };

  return (
    <Section id="contato" ref={ref} className="pb-16">
      <Container className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
        <div>
          <PoseBlock pose="think" animated alt="" />
          <Widget className="mt-8 p-6 md:p-8">
            <SectionTitle id="contato">{t.contact.title}</SectionTitle>
            <p data-reveal className="mt-4 text-[clamp(28px,3.6vw,50px)] font-semibold leading-[1.04] tracking-[-0.04em] text-balance text-ink">
              {t.footer.invitation}
            </p>
            <p data-reveal className="mt-5 max-w-[48ch] text-lg leading-normal text-muted">{t.contact.intro}</p>
            <div data-reveal className="mt-7 flex flex-wrap gap-2.5">
              <Button href={rows.whatsapp.href} external variant="whatsapp" icon="whatsapp" iconFirst>{t.contact.whatsappCta}</Button>
              <Button href={rows.email.href} icon="mail" iconFirst>{t.contact.emailCta}</Button>
            </div>
          </Widget>
        </div>

        <Window data-window dark title="zsh — contato" icon="terminal" bodyClassName="p-6 font-mono text-[14px] leading-relaxed">
          <p>
            <span className="text-accent-hi">$</span> whoami --contato
          </p>
          <dl className="mt-4 grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2.5">
            {t.contact.rows.map((r) => {
              const external = r.href.startsWith("http");
              return (
                <div key={r.id} className="contents">
                  <dt className="text-ash">{r.label.toLowerCase()}</dt>
                  <dd className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                    <a
                      href={r.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      download={r.id === "cv" || undefined}
                      className="break-words text-paper underline decoration-ash/40 underline-offset-4 transition-colors hover:text-accent-hi"
                    >
                      {r.value} {external ? "↗" : r.id === "cv" ? "↓" : ""}
                    </a>
                    {r.id === "email" && (
                      <button
                        type="button"
                        onClick={() => copy(r.value)}
                        className={`rounded px-1.5 py-0.5 text-[12px] transition-colors ${copied ? "bg-live/15 text-live" : "bg-white/10 text-ash hover:bg-white/15 hover:text-white"}`}
                      >
                        <span aria-live="polite">{copied ? t.desktop.copied : t.desktop.copy}</span>
                      </button>
                    )}
                  </dd>
                </div>
              );
            })}
            <div className="contents">
              <dt className="text-ash">local</dt>
              <dd>{t.hero.location}</dd>
            </div>
          </dl>
          <p className="mt-4">
            <span className="text-accent-hi">$</span> <span className="caret inline-block h-4 w-2 translate-y-0.5 bg-paper" />
          </p>
        </Window>
      </Container>
    </Section>
  );
}
