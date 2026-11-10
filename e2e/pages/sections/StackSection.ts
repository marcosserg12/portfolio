import type { Locator, Page } from "@playwright/test";

export const MINIMIZED_NOTICE = "Janela minimizada no Dock";

/** Seção Stack (#stack): a janela stack.config com os grupos e os chips de tecnologia. */
export class StackSection {
  readonly root: Locator;
  /** A primeira janela da seção, stack.config. */
  readonly window: Locator;
  readonly minimizeButton: Locator;
  readonly groupTitles: Locator;
  /** Chips que mostram onde a tecnologia foi usada (tooltip). */
  readonly chips: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator("#stack");
    this.window = this.root.locator("[data-window]").first();
    this.minimizeButton = this.window.getByRole("button", { name: "Minimizar" });
    this.groupTitles = this.root.locator("[data-group] h3");
    this.chips = this.root.locator("[data-group] button[aria-describedby]");
  }

  chip(name: string) {
    return this.window.getByRole("button", { name, exact: true });
  }

  /** O tooltip ligado a um chip pelo aria-describedby. */
  async tooltipOf(chip: Locator) {
    const id = await chip.getAttribute("aria-describedby");
    if (!id) throw new Error("o chip não tem aria-describedby");
    return this.page.locator(`#${id}`);
  }

  windowScrollTop() {
    return this.window.evaluate((el) => el.scrollTop);
  }

  async minimize() {
    await this.minimizeButton.click();
  }
}
