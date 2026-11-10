import type { Locator, Page } from "@playwright/test";

/** Seção Sobre (#sobre), com os números que contam até o valor final. */
export class AboutSection {
  readonly root: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.root = page.locator("#sobre");
    this.heading = this.root.getByRole("heading", { level: 2, name: "Sobre" });
  }

  stat(value: string) {
    return this.root.getByText(value);
  }

  async scrollIntoView() {
    await this.root.scrollIntoViewIfNeeded();
  }

  /** Rola até o item dos números, para a contagem começar. */
  async scrollToStats(item = "desde 2020") {
    await this.root.locator("li", { hasText: item }).scrollIntoViewIfNeeded();
  }
}
