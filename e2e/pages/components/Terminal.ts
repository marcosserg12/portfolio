import type { Locator, Page } from "@playwright/test";
import { DesktopWindow } from "./DesktopWindow";

/** O terminal do hero, que aceita comandos (ajuda, ls...). */
export class Terminal {
  readonly window: DesktopWindow;
  readonly input: Locator;

  constructor(page: Page) {
    this.window = new DesktopWindow(page, "terminal", "terminal — marcos@brasilia");
    this.input = page.locator("#term-input");
  }

  async run(command: string) {
    await this.input.fill(command);
    await this.input.press("Enter");
  }
}
