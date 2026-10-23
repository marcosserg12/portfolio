import type { MouseEventHandler, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "accent" | "ink" | "outline" | "whatsapp";
  icon?: IconName | "none";
  iconFirst?: boolean;
  download?: boolean;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
};

const variants = {
  accent: "bg-accent text-white hover:bg-accent-ink",
  ink: "bg-ink text-panel hover:bg-accent hover:text-white",
  outline: "border border-line bg-panel text-ink hover:border-ink",
  whatsapp: "bg-wa text-[#06210f] hover:bg-ink hover:text-panel",
};

export function Button({ href, children, variant = "accent", icon = "arrow-right", iconFirst, download, external, onClick, className = "" }: ButtonProps) {
  const glyph = icon !== "none" && <Icon name={icon} size={16} className={iconFirst ? "" : "transition-transform duration-300 group-hover:translate-x-0.5"} />;
  return (
    <a
      href={href}
      onClick={onClick}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.97] ${variants[variant]} ${className}`}
    >
      {iconFirst && glyph}
      <span>{children}</span>
      {!iconFirst && glyph}
    </a>
  );
}
