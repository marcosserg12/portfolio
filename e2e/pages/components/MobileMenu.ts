import type { Locator, Page } from "@playwright/test";

/** Menu de navegação do celular, aberto pelo botão do cabeçalho. */
export class MobileMenu {
  readonly root: Locator;
  readonly openButton: Locator;
  readonly closeButton: Locator;
  /** Links para as seções da página (âncoras #). */
  readonly sectionLinks: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator("#mobile-menu");
    this.openButton = page.locator("header").getByRole("button", { name: "Abrir menu" });
    this.closeButton = this.root.getByRole("button", { name: "Fechar menu" });
    this.sectionLinks = this.root.locator('a[href^="#"]');
  }

  async open() {
    await this.openButton.click();
  }

  async close() {
    await this.closeButton.click();
  }

  async closeWithEscape() {
    await this.page.keyboard.press("Escape");
  }

  /** Abre o menu e vai para uma seção. */
  async goTo(section: string) {
    await this.open();
    await this.root.getByRole("link", { name: section }).click();
  }
}
