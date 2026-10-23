"use client";

import type { MouseEvent } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import type { ContactId } from "@/content/types";
import { useI18n } from "@/lib/i18n";
import { scrollToId } from "@/lib/scroll";

const ICONS: Record<ContactId, IconName> = { whatsapp: "whatsapp", email: "mail", linkedin: "linkedin", github: "github", cv: "download" };

/** The last widget on the desktop: who, how to reach him, back to the top, and the small print. */
export function Footer() {
  const { t } = useI18n();
  const toTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToId("top");
  };

  return (
    <footer className="pb-28 pt-16 md:pb-32 md:pt-20">
      <Container>
        <div className="glass rounded-[22px] shadow-[0_18px_40px_-20px_rgb(20_40_90/0.45)]">
          <div className="flex flex-col gap-6 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-[18px] font-bold text-panel">M</span>
              <span>
                <span className="block font-semibold">
                  {t.hero.firstName} {t.hero.lastName}
                </span>
                <span className="block text-[14px] text-muted">
                  {t.hero.role} · {t.hero.location}
                </span>
              </span>
            </div>
            <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {t.contact.rows.map((r) => {
                const external = r.href.startsWith("http");
                return (
                  <li key={r.id}>
                    <a
                      href={r.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      download={r.id === "cv" || undefined}
                      className="flex h-10 items-center gap-2 rounded-full bg-glass/70 px-4 text-[14px] font-medium transition-colors hover:bg-glass"
                    >
                      <Icon name={ICONS[r.id]} size={16} />
                      {r.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <a href="#top" onClick={toTop} className="flex h-10 items-center justify-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-panel transition-colors hover:bg-accent hover:text-white">
              {t.footer.backToTop}
              <Icon name="arrow-up-right" size={15} className="-rotate-45" />
            </a>
          </div>
          <div className="flex flex-col gap-1 border-t border-rim px-5 py-3.5 text-[13px] text-ink/65 sm:flex-row sm:justify-between md:px-6">
            <p>© {new Date().getFullYear()} Marcos Sergio Jordão de Sousa</p>
            <p>{t.footer.builtWith}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
