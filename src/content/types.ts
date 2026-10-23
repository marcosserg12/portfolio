export type Locale = "pt" | "en";
export type SectionId = "sobre" | "stack" | "experiencia" | "projetos" | "formacao" | "contato";
export type PreviewId = "ecommerce" | "saas" | "ponto" | "faturamento" | "ia" | "chamados" | "nfce" | "atendimento" | "elite" | "unity" | "monitor";
export type ContactId = "email" | "whatsapp" | "linkedin" | "github" | "cv";

export interface Dictionary {
  meta: { lang: string; title: string };
  nav: { links: { id: SectionId; label: string }[]; cta: string; skip: string; menu: string; close: string; language: string; home: string; items: string; theme: string };
  hero: {
    firstName: string; lastName: string; role: string; lead: string;
    primary: string; secondary: string; scrollHint: string; location: string; photoAlt: string; videoLabel: string;
  };
  about: {
    title: string; statement: string; paragraph: string;
    facts: { label: string; value: string }[];
    stats: { value: number; suffix?: string; label: string }[];
  };
  stack: {
    title: string; intro: string; groups: { name: string; items: string[] }[];
    server: { title: string; intro: string; items: { name: string; detail: string }[] };
  };
  experience: {
    title: string; intro: string; current: string;
    items: { period: string; duration: string; role: string; company: string; summary: string; tags: string[]; start: number; end: number | null }[];
  };
  projects: {
    title: string; intro: string; previewLabel: string; shotLabel: string; viewCode: string;
    items: { id: PreviewId; title: string; description: string; kind: string; domain: string; tags: string[]; repo?: string; shots?: string[] }[];
  };
  education: { title: string; intro: string; items: { course: string; institution: string; period: string }[] };
  contact: { title: string; intro: string; whatsappCta: string; emailCta: string; rows: { id: ContactId; label: string; value: string; href: string }[] };
  footer: { invitation: string; cta: string; backToTop: string; builtWith: string };
  desktop: {
    os: string; available: string; menu: string; selectProject: string;
    icons: { cv: string; experience: string; projects: string; terminal: string; contact: string };
    terminal: { hint: string; help: string; notFound: string; opening: string; whoami: string; status: string; granted: string; ai: string };
    window: { minimize: string; restore: string; maximize: string; unmaximize: string; close: string; reopen: string; minimized: string };
    usedIn: string; thisSite: string; copy: string; copied: string; newTab: string;
  };
}
