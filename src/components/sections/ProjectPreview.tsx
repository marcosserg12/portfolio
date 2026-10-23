"use client";

import { useState, type ReactNode } from "react";
import type { PreviewId } from "@/content/types";

function Pill({ children, tone }: { children: ReactNode; tone: "cyan" | "violet" | "muted" }) {
  const tones = { cyan: "bg-accent-hi/20 text-accent-hi", violet: "bg-paper/15 text-paper", muted: "bg-paper/[0.08] text-ash" };
  return <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] ${tones[tone]}`}>{children}</span>;
}

function Ecommerce() {
  // product shots drawn as flat silhouettes on tinted cards: shirt, running shoe, cap
  const products = [
    ["Camiseta Dry", "R$ 79,90", "bg-[#1b2f57]", "#8db2f5", "M17 9 8 14l4 8 4-2v20h16V20l4 2 4-8-9-5c-1 3-3.5 5-7 5s-6-2-7-5z"],
    ["Tênis Run", "R$ 299,00", "bg-[#2b2f3d]", "#e8edf5", "M6 31c0-5 2-11 7-13l4 6c4 2 9 3 15 3 6 0 10 2 10 5v1H6zM6 34h36v3H6z"],
    ["Boné Sport", "R$ 59,90", "bg-[#3a2c22]", "#f2b36b", "M9 29c0-9 6.7-15 15-15s15 6 15 15zM9 29h33c0 2.5-1.8 4-4 4H9z"],
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="semiwide text-base font-bold text-paper">DDM</span>
          <span className="rounded-full bg-ink/70 px-2.5 py-1 text-ash">Buscar produtos</span>
        </div>
        <Pill tone="cyan">carrinho · 3</Pill>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {products.map(([name, price, bg, fill, shape]) => (
          <div key={name} className="flex flex-col gap-1">
            <div className={`grid min-h-12 flex-1 place-items-center rounded-lg ${bg}`}>
              <svg viewBox="0 0 48 48" className="h-3/5 max-h-24 w-auto" aria-hidden="true">
                <path d={shape} fill={fill} />
              </svg>
            </div>
            <span className="truncate font-medium text-paper">{name}</span>
            <span className="text-accent-hi">{price}</span>
          </div>
        ))}
      </div>
      <span className="text-[10px] text-ash">Pedido #2291 · pago · enviado hoje</span>
    </div>
  );
}

function Saas() {
  return (
    <div className="flex h-full flex-col rounded-[10px] bg-ink-3 p-3">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-[7px] rounded-full bg-paper/25" />
        ))}
        <span className="ml-3 text-[10px] text-ash">sualoja.com.br</span>
      </div>
      <div className="mt-3 grid flex-1 grid-cols-3 gap-2.5">
        {["Moda", "Café", "Pet"].map((name, i) => (
          <div key={name} className="flex flex-col gap-1.5">
            <div className="flex flex-1 flex-col gap-1.5 rounded-lg bg-ink p-2">
              <span className={`h-[38%] rounded ${i === 1 ? "bg-paper/30" : "bg-accent-hi/60"}`} />
              <span className="h-1.5 w-[70%] rounded-full bg-paper/50" />
              <span className="h-1 w-[85%] rounded-full bg-paper/20" />
              <span className={`mt-auto h-3 w-[45%] rounded-full ${i === 1 ? "bg-paper" : "bg-accent-hi"}`} />
            </div>
            <span className="text-[10px] font-medium text-paper">Template {name}</span>
          </div>
        ))}
      </div>
      <span className="mt-2 self-end rounded-full bg-accent-hi px-3 py-1 text-[11px] font-semibold text-ink">Publicar loja</span>
    </div>
  );
}

function Ponto() {
  const punches: [string, string, boolean][] = [
    ["07:58", "Entrada", true],
    ["12:01", "Saída almoço", true],
    ["13:03", "Volta almoço", true],
    ["—", "Saída", false],
  ];
  return (
    <div className="grid h-full grid-cols-[1.1fr_1fr] gap-4">
      <div className="flex flex-col justify-center">
        <span className="semiwide text-[clamp(40px,4.4vw,60px)] font-bold leading-none tracking-[-0.03em] text-paper">08:02</span>
        <span className="mt-2 text-ash">terça, 21 de outubro</span>
        <span className="mt-4 self-start rounded-full bg-accent-hi px-3.5 py-2 text-xs font-semibold text-ink">Registrar entrada</span>
      </div>
      <div className="flex flex-col justify-center gap-2.5">
        {punches.map(([hour, label, done]) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`size-1.5 rounded-full ${done ? "bg-accent-hi" : "bg-paper/25"}`} />
            <span className={`text-xs ${done ? "text-paper" : "text-ash"}`}>{hour}</span>
            <span className="text-ash">{label}</span>
          </div>
        ))}
        <span className="mt-2 text-paper">Saldo do mês +02h14</span>
      </div>
    </div>
  );
}

function Faturamento() {
  const bars = [52, 68, 44, 80, 61, 96, 72, 58];
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-ash">Despesas · outubro</span>
          <p className="semiwide text-[28px] font-bold leading-tight text-paper">R$ 48.320</p>
        </div>
        <Pill tone="cyan">−8% vs set</Pill>
      </div>
      <div className="mt-auto flex h-[55%] items-end gap-[5%] border-b border-paper/15">
        {bars.map((h, i) => (
          <span key={i} className={`flex-1 rounded-t ${i === 5 ? "bg-accent-hi" : "bg-paper/25"}`} style={{ height: `${h}%` }} />
        ))}
      </div>
      <span className="mt-1.5 text-[10px] text-ash">por centro de custo</span>
    </div>
  );
}

function Ia() {
  const bubble = "max-w-[80%] rounded-xl px-3 py-2 text-paper";
  return (
    <div className="flex h-full flex-col gap-2">
      <span className={`${bubble} self-start bg-paper/[0.08]`}>Tem horário amanhã de manhã?</span>
      <span className={`${bubble} self-end bg-accent-hi/20`}>Tenho 9h e 10h30. Qual prefere?</span>
      <span className={`${bubble} self-start bg-paper/[0.08]`}>9h, por favor</span>
      <div className="mt-auto flex items-center gap-2">
        {["WhatsApp", "IA", "Agenda"].map((node, i) => (
          <span key={node} className="flex items-center gap-2">
            <span className={`rounded-lg border px-2.5 py-1.5 text-paper ${i === 1 ? "border-paper/40 bg-paper/20" : "border-accent-hi/60 bg-ink-3"}`}>{node}</span>
            {i < 2 && <span className="text-ash">→</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function Chamados() {
  const tickets: [string, string, string, "cyan" | "violet" | "muted"][] = [
    ["#1042", "Impressora da recepção", "aberto", "cyan"],
    ["#1041", "Acesso ao sistema de RH", "em andamento", "violet"],
    ["#1039", "Erro no relatório mensal", "resolvido", "muted"],
    ["#1037", "Novo usuário no financeiro", "resolvido", "muted"],
  ];
  return (
    <ul className="flex h-full flex-col justify-center gap-2">
      {tickets.map(([id, title, status, tone]) => (
        <li key={id} className="flex items-center gap-2.5 rounded-lg bg-ink/60 px-3 py-2">
          <span className="text-ash">{id}</span>
          <span className="min-w-0 flex-1 truncate font-medium text-paper">{title}</span>
          <Pill tone={tone}>{status}</Pill>
        </li>
      ))}
    </ul>
  );
}

// a 21×21 QR-like grid: three finder squares plus a fixed scatter of modules, drawn as one path
const QR_FINDERS = [[0, 0], [14, 0], [0, 14]];
const QR_PATH = (() => {
  const nearFinder = (x: number, y: number) => QR_FINDERS.some(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);
  let d = QR_FINDERS.map(([x, y]) => `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`).join("");
  for (let y = 0; y < 21; y++)
    for (let x = 0; x < 21; x++) if (!nearFinder(x, y) && ((Math.imul(x + 1, 2654435761) ^ Math.imul(y + 1, 40503)) >>> 0) % 9 < 4) d += `M${x} ${y}h1v1h-1z`;
  return d;
})();

function Nfce() {
  const items = [
    ["X-Burguer", "18,00"],
    ["Batata média", "12,00"],
    ["Suco natural", "9,00"],
    ["Refrigerante", "6,00"],
  ];
  return (
    <div className="grid h-full grid-cols-[1.3fr_1fr] gap-4">
      <div className="flex flex-col rounded-lg bg-ink/60 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-paper">Venda #318</span>
          <span className="text-ash">PIX</span>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {items.map(([name, price]) => (
            <li key={name} className="flex items-baseline gap-2">
              <span className="min-w-0 flex-1 truncate text-paper">{name}</span>
              <span className="text-ash">R$ {price}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-baseline justify-between gap-2 border-t border-dashed border-paper/20 pt-2">
          <span className="text-ash">Total</span>
          <span className="semiwide whitespace-nowrap text-sm font-bold text-paper sm:text-base">R$ 45,00</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2.5">
        <svg viewBox="-1.5 -1.5 24 24" className="aspect-square h-[46%] rounded-md bg-paper text-ink" aria-hidden="true">
          <path d={QR_PATH} fill="currentColor" fillRule="evenodd" />
        </svg>
        <Pill tone="cyan">NFC-e autorizada</Pill>
        <span className="text-center text-[10px] text-ash [text-wrap:balance]">Sefaz-DF · assinada com A1</span>
      </div>
    </div>
  );
}

const previews: Partial<Record<PreviewId, () => ReactNode>> = {
  ecommerce: Ecommerce,
  saas: Saas,
  ponto: Ponto,
  faturamento: Faturamento,
  ia: Ia,
  chamados: Chamados,
  nfce: Nfce,
};

/** Real screenshots of the system; with more than one, dots switch between them. */
function Shots({ shots, label, shotLabel }: { shots: string[]; label: string; shotLabel: string }) {
  const [current, setCurrent] = useState(0);
  return (
    <figure className="relative aspect-[376/220] overflow-hidden rounded-xl bg-ink-2 md:max-lg:aspect-[12/5]">
      {shots.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized WebP
        <img
          key={src}
          src={src}
          alt={`${label} — ${shotLabel} ${i + 1}/${shots.length}`}
          aria-hidden={i !== current || undefined}
          loading="lazy"
          decoding="async"
          width={1200}
          height={750}
          className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-300 ${i === current ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {shots.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 rounded-full bg-ink/75 px-1 backdrop-blur">
          {shots.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`${shotLabel} ${i + 1}/${shots.length}`}
              aria-pressed={i === current}
              className="grid size-7 place-items-center"
            >
              <span className={`size-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/40 hover:bg-white/70"}`} />
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}

export function ProjectPreview({ id, label, shots, shotLabel }: { id: PreviewId; label: string; shots?: string[]; shotLabel: string }) {
  const Preview = previews[id];
  if (shots?.length || !Preview) return <Shots shots={shots ?? []} label={label} shotLabel={shotLabel} />;
  return (
    <div role="img" aria-label={label} data-ui className="relative aspect-[376/220] overflow-hidden md:max-lg:aspect-[12/5] rounded-xl bg-ink-2 p-4 text-[11px] leading-tight">
      <Preview />
    </div>
  );
}
