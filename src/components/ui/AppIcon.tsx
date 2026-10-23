import { Icon, type IconName } from "./Icon";

/** MarcOS apps: each section is an app with its own icon, drawn like a macOS app icon (squircle, lit from above). */
export const APPS = {
  top: { from: "#8b9bff", to: "#4a3fd4", icon: "home" },
  sobre: { from: "#f2cd95", to: "#c4843f", icon: "user" },
  experiencia: { from: "#ff9a74", to: "#e0442c", icon: "log" },
  projetos: { from: "#86cdff", to: "#2b84ee", icon: "folder" },
  stack: { from: "#6fe3d0", to: "#119a8a", icon: "layers" },
  formacao: { from: "#ffd77a", to: "#ee9f00", icon: "cap" },
  contato: { from: "#86f193", to: "#1fb046", icon: "chat" },
  terminal: { from: "#4d5361", to: "#16191f", icon: "terminal" },
  github: { from: "#3d4450", to: "#0d1117", icon: "github" },
} satisfies Record<string, { from: string; to: string; icon: IconName }>;

export type AppId = keyof typeof APPS;

/** `className` sets the size (default 48px); `glyph` the symbol inside. */
export function AppIcon({ app, glyph = 24, className = "size-12" }: { app: AppId; glyph?: number; className?: string }) {
  const a = APPS[app];
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-[23%] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.5),inset_0_-1px_0_rgb(0_0_0/0.15),0_4px_10px_-4px_rgb(15_30_70/0.45)] ${className}`}
      style={{ background: `linear-gradient(180deg, ${a.from}, ${a.to})` }}
    >
      <Icon name={a.icon} size={glyph} className="drop-shadow-[0_1px_1px_rgb(0_0_0/0.25)]" />
    </span>
  );
}

/** A Finder folder. */
export function FolderIcon({ size = 56, className = "" }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size * 0.82} viewBox="0 0 64 52" className={className}>
      <path d="M4 8a4 4 0 0 1 4-4h14l5 5h29a4 4 0 0 1 4 4v3H4z" fill="#5aa9f0" />
      <path d="M2 16a4 4 0 0 1 4-4h52a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill="#8dc8fb" />
      <path d="M2 16a4 4 0 0 1 4-4h52a4 4 0 0 1 4 4v2H2z" fill="#a9d6fd" />
      <path d="M22 30h20" stroke="#5aa9f0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** A document with a folded corner; `badge` paints the file type band (PDF in red, LOG in grey). */
export function DocIcon({ size = 56, badge = "PDF", tone = "#e5484d", className = "" }: { size?: number; badge?: string; tone?: string; className?: string }) {
  return (
    <svg aria-hidden="true" width={size * 0.8} height={size} viewBox="0 0 48 60" className={className}>
      <path d="M4 3a3 3 0 0 1 3-3h24l13 13v44a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#fff" stroke="#d3d9e4" />
      <path d="M31 0v10a3 3 0 0 0 3 3h10" fill="#eef1f6" stroke="#d3d9e4" />
      <path d="M11 22h22M11 28h26M11 34h18" stroke="#c9d1de" strokeWidth="2" strokeLinecap="round" />
      <rect x="9" y="42" width="30" height="11" rx="2.5" fill={tone} />
      <text x="24" y="50.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">{badge}</text>
    </svg>
  );
}
