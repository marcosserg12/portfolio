import { test as base, expect } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

/** `test` do Playwright com a fixture `home`, o Page Object da página já criado para cada teste. */
export const test = base.extend<{ home: HomePage }>({
  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect };
