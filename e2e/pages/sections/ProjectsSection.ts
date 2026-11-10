import type { Locator, Page } from "@playwright/test";

/** Seção Projetos (#projetos): a lista à esquerda e o painel do projeto ativo à direita. */
export class ProjectsSection {
  readonly root: Locator;
  readonly title: Locator;
  readonly rows: Locator;
  /** Botões dos títulos, que se navegam com as setas do teclado. */
  readonly rowButtons: Locator;
  readonly activePanel: Locator;
  readonly details: Locator;
  readonly liveSiteLink: Locator;

  constructor(page: Page) {
    this.root = page.locator("#projetos");
    this.title = page.locator("#projetos-title");
    this.rows = this.root.locator("article");
    this.rowButtons = this.root.locator("article h3 button");
    this.activePanel = this.root.locator("[data-active]");
    this.details = this.root.locator("dl");
    this.liveSiteLink = this.root.getByRole("link", { name: /Ver o site no ar/ }).last();
  }

  row(nameOrIndex: string | number) {
    return typeof nameOrIndex === "number" ? this.rows.nth(nameOrIndex) : this.rows.filter({ hasText: nameOrIndex });
  }

  /** Passa o mouse sobre um projeto para ele virar o ativo no painel. */
  async show(nameOrIndex: string | number) {
    const row = this.row(nameOrIndex);
    await row.scrollIntoViewIfNeeded();
    await row.hover();
  }
}
