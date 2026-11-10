import type { Locator, Page } from "@playwright/test";
import { DesktopWindow } from "../components/DesktopWindow";

/** O hero (#top): o desktop do MarcOS com janelas, ícones e chips em órbita. */
export class HeroDesktop {
  readonly root: Locator;
  readonly heading: Locator;
  readonly role: Locator;
  readonly downloadCvLink: Locator;
  readonly aboutWindow: DesktopWindow;
  readonly projectsWindow: DesktopWindow;
  /** Lista de projetos dentro da janela Projetos. */
  readonly projectsList: Locator;
  readonly orbitChips: Locator;
  readonly icons: Locator;
  readonly reopenButton: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator("#top");
    this.heading = page.getByRole("heading", { level: 1 });
    this.role = this.root.locator("p").first();
    this.downloadCvLink = this.root.getByRole("link", { name: "Baixar CV" });
    this.aboutWindow = new DesktopWindow(page, "about", "sobre.txt");
    this.projectsWindow = new DesktopWindow(page, "projects", "Projetos");
    this.projectsList = this.projectsWindow.root.locator("ul");
    this.orbitChips = page.locator("[data-orbit]");
    this.icons = page.locator("[data-hero-icon]");
    this.reopenButton = page.getByRole("button", { name: /reabrir/i });
  }

  /** Ícone do desktop pelo nome do arquivo (Experiência.log, Currículo.pdf). */
  icon(name: string) {
    return this.page.locator("[data-hero-icon] a", { hasText: name });
  }

  /** Quantos projetos aparecem inteiros na janela Projetos, sem rolar. */
  async fullyVisibleProjects() {
    const box = await this.projectsList.boundingBox();
    if (!box) throw new Error("a lista da janela Projetos não está na tela");
    return this.projectsList
      .locator("li")
      .evaluateAll((items, bottom) => items.filter((li) => li.getBoundingClientRect().bottom <= bottom + 0.5).length, box.y + box.height);
  }

  /** Rola a lista da janela Projetos com a roda do mouse sobre ela. */
  async scrollProjectsList(deltaY: number) {
    const box = await this.projectsList.boundingBox();
    if (!box) throw new Error("a lista da janela Projetos não está na tela");
    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await this.page.mouse.wheel(0, deltaY);
  }

  projectsListScrollTop() {
    return this.projectsList.evaluate((el) => el.scrollTop);
  }
}
