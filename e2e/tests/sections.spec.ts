import { expect, test } from "../fixtures";
import { MINIMIZED_NOTICE } from "../pages/sections/StackSection";
import { DESKTOP, width } from "../support/viewports";

// Seções da página: Sobre, Stack, Experiência, Projetos e Contato.

test("about shows the three stats with final values", async ({ home }) => {
  await home.goto();
  await home.about.scrollIntoView();
  await expect(home.about.heading).toBeVisible();
  await home.about.scrollToStats();
  await expect(home.about.stat("6+")).toBeVisible({ timeout: 5000 });
});

test("stack config lists the six groups and the server checklist", async ({ home }) => {
  await home.goto();
  await expect(home.stack.groupTitles).toHaveCount(6);
  await expect(home.stack.groupTitles.first()).toHaveText("backend");
  await expect(home.stack.root).toContainText("Angular");
  await expect(home.stack.root).toContainText("Claude Code");
  await expect(home.heading("Segurança e acompanhamento")).toHaveCount(1);
});

for (const w of [390, 1440]) {
  test(`stack usage tooltips stay inside the window at ${w}px`, async ({ home }) => {
    await home.open(width(w));
    await home.stack.chips.first().scrollIntoViewIfNeeded();
    for (const chip of await home.stack.chips.all()) {
      await chip.hover();
      const tip = await home.stack.tooltipOf(chip);
      await expect(tip).toHaveCSS("opacity", "1");
      // a tooltip past the edge is clipped, or the browser scrolls the window's own content to show it
      expect(await home.stack.windowScrollTop()).toBe(0);
      const [t, win] = [await tip.boundingBox(), await home.stack.window.boundingBox()];
      expect(t!.y).toBeGreaterThanOrEqual(win!.y);
      expect(t!.y + t!.height).toBeLessThanOrEqual(win!.y + win!.height);
    }
  });
}

test("yellow light minimizes a window into the Dock and it comes back", async ({ home }) => {
  await home.open(DESKTOP);
  await home.stack.window.scrollIntoViewIfNeeded();
  await home.page.waitForTimeout(1200);
  await home.stack.minimize();
  await expect(home.stack.window).toContainText(MINIMIZED_NOTICE);
  await home.dock.restore("stack.config");
  await expect(home.stack.window).not.toContainText(MINIMIZED_NOTICE);
  await expect(home.stack.chip("PHP")).toBeVisible();
});

test("experience reads as git log with the current job at HEAD", async ({ home }) => {
  await home.goto();
  await expect(home.experience.items).toHaveCount(4);
  await expect(home.experience.items.first()).toContainText("HEAD");
  await expect(home.experience.items.first()).toContainText("Ibranutro");
});

test("A Hora É Agora shows its screenshots and links to the live site", async ({ home }) => {
  await home.open(DESKTOP);
  await home.projects.show("A Hora É Agora");
  await expect(home.projects.activePanel.getByRole("img", { name: /A Hora É Agora — Tela 1\/2/ })).toBeVisible();
  await expect(home.projects.liveSiteLink).toHaveAttribute("href", "https://ahoraeagora.org/");
  await expect(home.projects.liveSiteLink).toHaveAttribute("target", "_blank");
});

test("projects list twelve entries and the panel follows the active one", async ({ home }) => {
  await home.open(DESKTOP);
  await expect(home.projects.rows).toHaveCount(12);
  await expect(home.projects.row(0).getByRole("heading", { level: 3 })).toContainText("DDM E-commerce");
  await home.projects.show(2);
  await expect(home.projects.activePanel).toHaveCount(1);
  await expect(home.projects.activePanel.getByRole("img", { name: /Ponto eletrônico/ }).first()).toBeVisible();
});

test("contact rows link to email, WhatsApp, LinkedIn and the CV", async ({ home, request }) => {
  await home.goto();
  await expect(home.contact.mailtoLinks("mstjsousa@gmail.com").first()).toBeAttached();
  await expect(home.contact.whatsappLinks.first()).toBeAttached();
  await expect(home.contact.linkedinLinks).toHaveCount(1);
  const cv = await home.contact.cvLink.getAttribute("href");
  expect((await request.get(cv!)).ok()).toBe(true);
  await expect(home.body).not.toContainText("98261");
});
