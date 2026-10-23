"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useReveal } from "@/components/motion/useReveal";
import { FolderIcon } from "@/components/ui/AppIcon";
import { Icon } from "@/components/ui/Icon";
import { PoseBlock } from "@/components/ui/PoseBlock";
import { Container, Section, SectionHead } from "@/components/ui/Section";
import { Window } from "@/components/ui/Window";
import { useI18n } from "@/lib/i18n";
import { ProjectPreview } from "./ProjectPreview";

/** Projects as a file explorer: the folder list on the left, a preview pane of the selected system on the right. */
export function Projects() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useReveal(ref);
  const current = t.projects.items[active];
  const rows = useRef<(HTMLButtonElement | null)[]>([]);
  const step = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = t.projects.items.length;
    const next = e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    rows.current[next]?.focus();
  };
  const slug = (title: string) => title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <Section id="projetos" ref={ref}>
      <Container>
        <SectionHead id="projetos" title={t.projects.title} intro={t.projects.intro} pose={<PoseBlock pose="point-down" reachBelow alt="" />} />
        <Window data-window title={`${t.desktop.icons.projects} — ~/projetos`} icon="folder" bodyClassName="lg:grid lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <ol className="divide-y divide-line lg:divide-y-0 lg:border-r lg:border-line lg:p-2">
            {t.projects.items.map((p, i) => {
              const on = i === active;
              return (
                <li key={p.id}>
                  <article>
                    <h3>
                    <button
                      ref={(el) => {
                        rows.current[i] = el;
                      }}
                      type="button"
                      onKeyDown={(e) => step(e, i)}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-pressed={on}
                      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors lg:rounded-lg lg:px-3 lg:py-3 ${on ? "lg:bg-accent lg:text-white" : "hover:bg-accent-soft"}`}
                    >
                      <FolderIcon size={36} className="shrink-0" />
                      <span className="min-w-0">
                        <span className="block truncate text-[16px] font-semibold tracking-[-0.01em]">{p.title}</span>
                        <span className={`block font-mono text-[12px] ${on ? "lg:text-white/80" : "text-muted"}`}>
                          {slug(p.title)}/ · {p.domain}
                        </span>
                      </span>
                    </button>
                    </h3>
                    <div className="px-4 pb-5 lg:hidden">
                      <ProjectPreview id={p.id} label={p.shots ? p.title : `${t.projects.previewLabel} ${p.title}`} shots={p.shots} shotLabel={t.projects.shotLabel} />
                      <p className="mt-3 leading-relaxed text-muted">{p.description}</p>
                      <p className="mt-2 font-mono text-[12px] text-accent-ink">{p.tags.join(" · ")}</p>
                      {p.repo && <CodeLink href={p.repo} label={t.projects.viewCode} />}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>

          <div className="hidden lg:block">
            <p className="flex items-center gap-2 border-b border-line px-6 py-3 font-mono text-[12px] text-muted">
              <Icon name="folder" size={14} />~/projetos/{slug(current.title)}
            </p>
            <div className="p-6 xl:p-8">
              <div className="relative mx-auto max-w-[680px]">
                {t.projects.items.map((p, i) => (
                  <div
                    key={p.id}
                    data-active={i === active || undefined}
                    className={`transition-[opacity,transform,visibility] duration-500 ${i === 0 ? "relative" : "absolute inset-0"} ${i === active ? "visible opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0"}`}
                  >
                    <ProjectPreview id={p.id} label={p.shots ? p.title : `${t.projects.previewLabel} ${p.title}`} shots={p.shots} shotLabel={t.projects.shotLabel} />
                  </div>
                ))}
              </div>
              <div aria-live="polite" className="mx-auto mt-6 grid max-w-[680px] gap-x-8 gap-y-2 xl:grid-cols-[minmax(0,1fr)_auto]">
                <div>
                  <p className="text-[22px] font-semibold tracking-[-0.02em]">{current.title}</p>
                  <p className="mt-2 max-w-[60ch] leading-relaxed text-muted">{current.description}</p>
                  {current.repo && <CodeLink href={current.repo} label={t.projects.viewCode} />}
                </div>
                <dl className="grid h-fit grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[12px]">
                  <dt className="text-muted">tipo</dt>
                  <dd>{current.kind}</dd>
                  <dt className="text-muted">área</dt>
                  <dd>{current.domain}</dd>
                  <dt className="text-muted">stack</dt>
                  <dd className="text-accent-ink">{current.tags.join(" · ")}</dd>
                </dl>
              </div>
            </div>
          </div>
        </Window>
      </Container>
    </Section>
  );
}

function CodeLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex items-center gap-1.5 font-medium text-accent-ink underline-offset-4 hover:underline"
    >
      {label}
      <Icon name="arrow-up-right" size={14} />
    </a>
  );
}
