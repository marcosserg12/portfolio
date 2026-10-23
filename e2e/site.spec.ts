import { expect, test } from "@playwright/test";

test("hero shows name, role and primary actions", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toContainText("Marcos");
  await expect(page.locator("#top p").first()).toContainText("Desenvolvedor PHP e Full Stack");
  await expect(page.getByRole("link", { name: "Ver projetos" })).toBeVisible();
  await expect(page.locator("#top").getByRole("link", { name: "Baixar CV" })).toHaveAttribute("href", "/cv/marcos-sergio-cv.pdf");
});

test("language toggle switches to English and persists", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "en", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "See projects" })).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("mobile menu opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  const menu = page.locator("#mobile-menu");
  await expect(menu).toBeVisible();
  await expect(menu.locator('a[href^="#"]')).toHaveCount(6);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await menu.getByRole("link", { name: "Projetos" }).click();
  await expect(menu).toBeHidden();
  await expect(page.locator("#projetos-title")).toBeInViewport();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await menu.getByRole("link", { name: "Contato" }).click();
  await expect(page.locator("#contato-title")).toBeInViewport();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await menu.getByRole("button", { name: "Fechar menu" }).click();
  await expect(menu).toBeHidden();
});

test("about shows the three stats with final values", async ({ page }) => {
  await page.goto("/");
  const about = page.locator("#sobre");
  await about.scrollIntoViewIfNeeded();
  await expect(about.getByRole("heading", { level: 2, name: "Sobre" })).toBeVisible();
  await about.locator("li", { hasText: "desde 2020" }).scrollIntoViewIfNeeded();
  await expect(about.getByText("6+")).toBeVisible({ timeout: 5000 });
});

test("stack config lists the six groups and the server checklist", async ({ page }) => {
  await page.goto("/");
  const groups = page.locator("#stack [data-group] h3");
  await expect(groups).toHaveCount(6);
  await expect(groups.first()).toHaveText("backend");
  await expect(page.locator("#stack")).toContainText("Angular");
  await expect(page.locator("#stack")).toContainText("Claude Code");
  await expect(page.getByRole("heading", { name: "Segurança e acompanhamento" })).toHaveCount(1);
});

test("experience reads as git log with the current job at HEAD", async ({ page }) => {
  await page.goto("/");
  const items = page.locator("#experiencia [data-item]");
  await expect(items).toHaveCount(4);
  await expect(items.first()).toContainText("HEAD");
  await expect(items.first()).toContainText("Ibranutro");
});

test("hero terminal runs commands", async ({ page }) => {
  await page.goto("/");
  const input = page.locator("#term-input");
  await input.fill("ajuda");
  await input.press("Enter");
  await expect(page.locator("#top")).toContainText("comandos:");
  await input.fill("xyz");
  await input.press("Enter");
  await expect(page.locator("#top")).toContainText("comando não encontrado: xyz");
});

test("projects list eleven entries and the panel follows the active one", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const rows = page.locator("#projetos article");
  await expect(rows).toHaveCount(11);
  await expect(rows.first().getByRole("heading", { level: 3 })).toContainText("DDM E-commerce");
  await rows.nth(2).scrollIntoViewIfNeeded();
  await rows.nth(2).hover();
  await expect(page.locator("#projetos [data-active]")).toHaveCount(1);
  await expect(page.locator("#projetos [data-active]").getByRole("img", { name: /Ponto eletrônico/ }).first()).toBeVisible();
});

test("contact rows link to email, WhatsApp, LinkedIn and the CV", async ({ page, request }) => {
  await page.goto("/");
  const contact = page.locator("#contato");
  await expect(contact.locator('a[href^="mailto:mstjsousa@gmail.com"]').first()).toBeAttached();
  await expect(contact.locator('a[href^="https://wa.me/"]').first()).toBeAttached();
  await expect(contact.locator('a[href^="https://www.linkedin.com/in/"]')).toHaveCount(1);
  const cv = await contact.locator('a[href$=".pdf"]').getAttribute("href");
  expect((await request.get(cv!)).ok()).toBe(true);
  await expect(page.locator("body")).not.toContainText("98261");
});

test("GitHub opens in a new tab from the menu bar, the Dock, the phone menu and the contact card", async ({ page }) => {
  const gh = 'a[href="https://github.com/marcosserg12"]';
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  for (const where of ["header", 'nav[aria-label="Dock"]', "#contato"]) {
    const link = page.locator(`${where} ${gh}`);
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("header").getByRole("button", { name: /menu/i }).click();
  await expect(page.locator(`#mobile-menu ${gh}`)).toBeVisible();
});

test("desktop interactions: ls, window controls, stack usage, arrow keys, copy email", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const input = page.locator("#term-input");
  await input.fill("ls");
  await input.press("Enter");
  await expect(page.locator("#top")).toContainText("projetos/");

  const term = page.locator('[data-win="terminal"]');
  await term.getByRole("button", { name: /fechar/i }).click();
  await expect(page.locator("#term-input")).toHaveCount(0);
  await page.getByRole("button", { name: /reabrir/i }).click();
  await expect(page.locator("#term-input")).toBeVisible();

  const php = page.locator("#stack").getByRole("button", { name: "PHP", exact: true });
  await php.scrollIntoViewIfNeeded();
  await php.focus();
  const tip = page.locator(`#${await php.getAttribute("aria-describedby")}`);
  await expect(tip).toContainText("Ibra");

  const first = page.locator("#projetos article h3 button").first();
  await first.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#projetos article h3 button").nth(1)).toBeFocused();

  const copy = page.locator("#contato dd button");
  await copy.scrollIntoViewIfNeeded();
  await copy.click();
  await expect(copy).toContainText("copiado");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("mstjsousa@gmail.com");
});

for (const width of [390, 1440]) {
  test(`stack usage tooltips stay inside the window at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const win = page.locator("#stack [data-window]").first();
    const chips = page.locator("#stack [data-group] button[aria-describedby]");
    await chips.first().scrollIntoViewIfNeeded();
    for (const chip of await chips.all()) {
      await chip.hover();
      const tip = page.locator(`#${await chip.getAttribute("aria-describedby")}`);
      await expect(tip).toHaveCSS("opacity", "1");
      // a tooltip past the edge is clipped, or the browser scrolls the window's own content to show it
      expect(await win.evaluate((el) => el.scrollTop)).toBe(0);
      const [t, w] = [await tip.boundingBox(), await win.boundingBox()];
      expect(t!.y).toBeGreaterThanOrEqual(w!.y);
      expect(t!.y + t!.height).toBeLessThanOrEqual(w!.y + w!.height);
    }
  });
}

test("yellow light minimizes a window into the Dock and it comes back", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const win = page.locator("#stack [data-window]").first();
  await win.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await win.getByRole("button", { name: "Minimizar" }).click();
  await expect(win).toContainText("Janela minimizada no Dock");
  await page.getByRole("button", { name: "Restaurar: stack.config" }).click();
  await expect(win).not.toContainText("Janela minimizada no Dock");
  await expect(win.getByRole("button", { name: "PHP", exact: true })).toBeVisible();
});

test("hero windows can be dragged by the title bar on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForTimeout(1500);
  const win = page.locator('[data-win="terminal"]');
  const before = (await win.boundingBox())!;
  const bar = { x: before.x + before.width / 2, y: before.y + 19 };
  await page.mouse.move(bar.x, bar.y);
  await page.mouse.down();
  await page.mouse.move(bar.x + 120, bar.y - 40, { steps: 12 });
  await page.waitForTimeout(250);
  await page.mouse.up();
  await page.waitForTimeout(900);
  const after = (await win.boundingBox())!;
  expect(after.x - before.x).toBeGreaterThan(80);
});

for (const [width, wins] of [[1440, ["about", "terminal", "projects"]], [390, ["about", "terminal"]]] as const) {
  test(`hero windows minimize into the Dock and come back at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(1500);
    for (const id of wins) {
      const win = page.locator(`[data-win="${id}"]`);
      await win.getByRole("button", { name: "Minimizar" }).click();
      await expect(win).toBeHidden();
      await expect(win).not.toContainText("Janela minimizada no Dock");
    }
    const thumbs = page.getByRole("button", { name: /^Restaurar:/ });
    await expect(thumbs).toHaveCount(wins.length);
    await page.getByRole("button", { name: "Restaurar: sobre.txt" }).click();
    await expect(page.locator('[data-win="about"]')).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
}

test("desktop icons open with a single click", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForTimeout(1500);
  const icon = (name: string) => page.locator("[data-hero-icon] a", { hasText: name });
  const home = async () => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
  };
  for (const [name, title] of [["Experiência.log", "#experiencia-title"], ["Projetos", "#projetos-title"], ["Contato", "#contato-title"]]) {
    await home();
    await icon(name).click();
    await expect(page.locator(title)).toBeInViewport();
  }
  await home();
  await expect(icon("Currículo.pdf")).toHaveAttribute("download", "");
  await icon("Terminal").click();
  await expect(page.locator("#term-input")).toBeFocused();
  await page.locator('[data-win="terminal"]').getByRole("button", { name: "Fechar" }).click();
  await expect(page.locator("#term-input")).toHaveCount(0);
  await icon("Terminal").click();
  await expect(page.locator("#term-input")).toBeFocused();
  await page.locator('[data-win="terminal"]').getByRole("button", { name: "Minimizar" }).click();
  await expect(page.locator('[data-win="terminal"]')).toBeHidden();
  await icon("Terminal").click();
  await expect(page.locator("#term-input")).toBeFocused();
});

test("theme opens light, switches to dark and opens light again", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveAttribute("data-theme", "dark");
  const toggle = page.getByRole("button", { name: "Tema escuro" });
  await toggle.click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(html).not.toHaveAttribute("data-theme", "dark");
  await toggle.click();
  await page.reload();
  await expect(html).not.toHaveAttribute("data-theme", "dark");
});

test("every section has an h2 and the page has one h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  for (const name of ["Sobre", "Stack", "Experiência", "Projetos", "Formação", "Contato"]) {
    await expect(page.getByRole("heading", { level: 2, name, exact: true })).toHaveCount(1);
  }
});

for (const width of [390, 768, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("content is visible without animation", async ({ page }) => {
    await page.goto("/");
    const last = page.locator("#contato [data-reveal]").first();
    await last.scrollIntoViewIfNeeded();
    await expect(last).toHaveCSS("opacity", "1");
  });
});
