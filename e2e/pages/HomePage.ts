import type { Locator, Page } from "@playwright/test";
import type { Viewport } from "../support/viewports";
import { Dock } from "./components/Dock";
import { MobileMenu } from "./components/MobileMenu";
import { Terminal } from "./components/Terminal";
import { AboutSection } from "./sections/AboutSection";
import { ContactSection } from "./sections/ContactSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { HeroDesktop } from "./sections/HeroDesktop";
import { ProjectsSection } from "./sections/ProjectsSection";
import { StackSection } from "./sections/StackSection";

export type Locale = "pt" | "en";

/**
 * Page Object da página única do portfólio. Junta os componentes (Dock, terminal, menu do celular) e as seções;
 * os testes usam só o que está aqui e deixam as asserções no próprio teste.
 */
export class HomePage {
  readonly html: Locator;
  readonly body: Locator;
  readonly header: Locator;
  readonly mainHeading: Locator;
  readonly themeToggle: Locator;

  readonly hero: HeroDesktop;
  readonly terminal: Terminal;
  readonly dock: Dock;
  readonly mobileMenu: MobileMenu;
  readonly about: AboutSection;
  readonly stack: StackSection;
  readonly experience: ExperienceSection;
  readonly projects: ProjectsSection;
  readonly contact: ContactSection;

  constructor(readonly page: Page) {
    this.html = page.locator("html");
    this.body = page.locator("body");
    this.header = page.locator("header");
    this.mainHeading = page.getByRole("heading", { level: 1 });
    this.themeToggle = page.getByRole("button", { name: "Tema escuro" });

    this.hero = new HeroDesktop(page);
    this.terminal = new Terminal(page);
    this.dock = new Dock(page);
    this.mobileMenu = new MobileMenu(page);
    this.about = new AboutSection(page);
    this.stack = new StackSection(page);
    this.experience = new ExperienceSection(page);
    this.projects = new ProjectsSection(page);
    this.contact = new ContactSection(page);
  }

  async goto() {
    await this.page.goto("/");
  }

  /** Ajusta o tamanho da tela (se pedido) e abre a página. */
  async open(viewport?: Viewport) {
    if (viewport) await this.resize(viewport);
    await this.goto();
  }

  async resize(viewport: Viewport) {
    await this.page.setViewportSize(viewport);
  }

  async reload() {
    await this.page.reload();
  }

  /** Espera a abertura animada do desktop (janelas e Dock) terminar. */
  async waitForIntro(ms = 1500) {
    await this.page.waitForTimeout(ms);
  }

  /** Faz a próxima visita já começar no idioma pedido, como se tivesse sido escolhido antes. */
  async startIn(locale: Locale) {
    await this.page.addInitScript((value) => localStorage.setItem("locale", value), locale);
  }

  async switchLanguage(locale: Locale) {
    await this.page.getByRole("button", { name: locale, exact: true }).click();
  }

  link(name: string) {
    return this.page.getByRole("link", { name });
  }

  heading(name: string) {
    return this.page.getByRole("heading", { name });
  }

  sectionHeading(name: string) {
    return this.page.getByRole("heading", { level: 2, name, exact: true });
  }

  /** Link do GitHub dentro de uma área da página (cabeçalho, Dock, contato, menu do celular). */
  githubLink(within: Locator) {
    return within.locator('a[href="https://github.com/marcosserg12"]');
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  scrollY() {
    return this.page.evaluate(() => window.scrollY);
  }

  /** Quantos pixels a página passa da largura da tela (0 ou menos = sem rolagem horizontal). */
  horizontalOverflow() {
    return this.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  }

  clipboardText() {
    return this.page.evaluate(() => navigator.clipboard.readText());
  }
}
