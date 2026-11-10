import type { Locator, Page } from "@playwright/test";

/** Seção Experiência (#experiencia), mostrada como um git log. */
export class ExperienceSection {
  readonly root: Locator;
  readonly title: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    this.root = page.locator("#experiencia");
    this.title = page.locator("#experiencia-title");
    this.items = this.root.locator("[data-item]");
  }
}
