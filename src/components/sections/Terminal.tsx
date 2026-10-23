"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { scrollToId } from "@/lib/scroll";

type Line = { cmd?: string; out: ReactNode };

const ROUTES: Record<string, string> = {
  sobre: "sobre", about: "sobre",
  experiencia: "experiencia", "experiência": "experiencia", experience: "experiencia",
  projetos: "projetos", projects: "projetos",
  stack: "stack",
  formacao: "formacao", "formação": "formacao", education: "formacao",
  contato: "contato", contact: "contato",
};

const PROMPT = "marcos@brasilia:~$";

/** A small working terminal: commands scroll to sections, open the CV or WhatsApp. */
export function Terminal() {
  const { t } = useI18n();
  const term = t.desktop.terminal;
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const body = useRef<HTMLDivElement>(null);
  const cv = t.contact.rows.find((r) => r.id === "cv")!.href;
  const wa = t.contact.rows.find((r) => r.id === "whatsapp")!.href;

  const run = (e: FormEvent) => {
    e.preventDefault();
    const cmd = value.trim();
    setValue("");
    if (!cmd) return;
    const key = cmd.toLowerCase();
    if (key === "limpar" || key === "clear") {
      setLines([]);
      return;
    }
    let out: ReactNode;
    if (key === "ajuda" || key === "help") out = term.help;
    else if (key === "ia" || key === "ai") out = term.ai;
    else if (key === "ls") out = t.nav.links.map((l) => `${l.id}/`).join("  ");
    else if (key === "sudo contratar" || key === "sudo hire") {
      out = <span className="text-live">{term.granted}</span>;
      window.setTimeout(() => window.open(wa, "_blank", "noopener"), 700);
    }
    else if (ROUTES[key]) {
      out = `${term.opening} ${key}…`;
      window.setTimeout(() => scrollToId(ROUTES[key]), 250);
    } else if (key === "cv") {
      out = `${term.opening} ${cv}`;
      window.open(cv, "_blank");
    } else if (key === "whatsapp") {
      out = `${term.opening} WhatsApp…`;
      window.open(wa, "_blank", "noopener");
    } else if (key === "whoami") out = term.whoami;
    else out = <span className="text-[#ff8a80]">{`${term.notFound} ${cmd}`}</span>;
    setLines((l) => [...l.slice(-6), { cmd, out }]);
    requestAnimationFrame(() => body.current?.scrollTo({ top: body.current.scrollHeight }));
  };

  return (
    <div ref={body} className="max-h-[230px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed">
      <p>
        <span className="text-accent-hi">{PROMPT}</span> whoami
      </p>
      <p className="text-paper/90">{term.whoami}</p>
      <p>
        <span className="text-accent-hi">{PROMPT}</span> status ibranutro
      </p>
      <p>
        <span className="text-live">●</span> {term.status}
      </p>
      {lines.map((l, i) => (
        <div key={i}>
          <p>
            <span className="text-accent-hi">{PROMPT}</span> {l.cmd}
          </p>
          <p className="text-paper/90">{l.out}</p>
        </div>
      ))}
      <form onSubmit={run} className="flex items-center gap-2">
        <label htmlFor="term-input" className="shrink-0 text-accent-hi">{PROMPT}</label>
        <input
          id="term-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={term.hint}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-paper caret-accent-hi outline-none placeholder:text-ash/70"
        />
      </form>
    </div>
  );
}
