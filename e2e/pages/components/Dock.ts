import type { Locator, Page } from "@playwright/test";

/** O Dock na parte de baixo da tela, onde ficam as janelas minimizadas. */
export class Dock {
  readonly root: Locator;
  /** Miniaturas de janelas minimizadas (em português). */
  readonly restoreButtons: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('nav[aria-label="Dock"]');
    this.restoreButtons = page.getByRole("button", { name: /^Restaurar:/ });
  }

  /** Miniatura de uma janela; `verb` muda com o idioma ("Restaurar" ou "Restore"). */
  restoreButton(title: string, verb = "Restaurar") {
    return this.page.getByRole("button", { name: `${verb}: ${title}` });
  }

  async restore(title: string) {
    await this.restoreButton(title).click();
  }
}
