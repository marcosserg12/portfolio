import { expect, test } from "../fixtures";
import { MINIMIZED_NOTICE } from "../pages/sections/StackSection";
import { DESKTOP, PHONE, WIDE, width } from "../support/viewports";

// O hero é um desktop: janelas arrastáveis, Dock, terminal e ícones.

test("hero shows name, role and primary actions", async ({ home }) => {
  await home.goto();
  await expect(home.hero.heading).toContainText("Marcos");
  await expect(home.hero.role).toContainText("Desenvolvedor PHP e Full Stack");
  await expect(home.link("Ver projetos")).toBeVisible();
  await expect(home.hero.downloadCvLink).toHaveAttribute("href", "/cv/marcos-sergio-cv.pdf");
});

test("hero terminal runs commands", async ({ home }) => {
  await home.goto();
  await home.terminal.run("ajuda");
  await expect(home.hero.root).toContainText("comandos:");
  await home.terminal.run("xyz");
  await expect(home.hero.root).toContainText("comando não encontrado: xyz");
});

test("desktop interactions: ls, window controls, stack usage, arrow keys, copy email", async ({ home, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await home.open(DESKTOP);
  await home.terminal.run("ls");
  await expect(home.hero.root).toContainText("projetos/");

  await home.terminal.window.close();
  await expect(home.terminal.input).toHaveCount(0);
  await home.hero.reopenButton.click();
  await expect(home.terminal.input).toBeVisible();

  const php = home.stack.chip("PHP");
  await php.scrollIntoViewIfNeeded();
  await php.focus();
  await expect(await home.stack.tooltipOf(php)).toContainText("Ibra");

  await home.projects.rowButtons.first().focus();
  await home.page.keyboard.press("ArrowDown");
  await expect(home.projects.rowButtons.nth(1)).toBeFocused();

  await home.contact.copyEmail();
  await expect(home.contact.copyEmailButton).toContainText("copiado");
  expect(await home.clipboardText()).toBe("mstjsousa@gmail.com");
});

test("hero windows can be dragged by the title bar on desktop", async ({ home }) => {
  await home.open(DESKTOP);
  await home.waitForIntro();
  const before = await home.terminal.window.box();
  await home.terminal.window.dragTitleBarBy(120, -40);
  const after = await home.terminal.window.box();
  expect(after.x - before.x).toBeGreaterThan(80);
});

// at 1440 the Projetos window is already in the Dock
for (const [w, docked] of [[1440, 3], [390, 2]] as const) {
  test(`hero windows minimize into the Dock and come back at ${w}px`, async ({ home }) => {
    await home.open(width(w));
    await home.waitForIntro();
    for (const win of [home.hero.aboutWindow, home.terminal.window]) {
      await win.minimize();
      await expect(win.root).toBeHidden();
      await expect(win.root).not.toContainText(MINIMIZED_NOTICE);
    }
    await expect(home.dock.restoreButtons).toHaveCount(docked);
    await home.dock.restore("sobre.txt");
    await expect(home.hero.aboutWindow.root).toBeVisible();
    await expect(home.hero.heading).toBeVisible();
  });
}

test("the Projetos window shows four projects and scrolls the rest without moving the page", async ({ home }) => {
  await home.open(WIDE);
  await home.hero.projectsWindow.restoreFromDock();
  await expect(home.hero.projectsList).toBeVisible();
  expect(await home.hero.fullyVisibleProjects()).toBe(4);

  await home.hero.scrollProjectsList(300);
  await expect.poll(() => home.hero.projectsListScrollTop()).toBeGreaterThan(0);
  expect(await home.scrollY()).toBe(0);
});

for (const w of [1440, 1600]) {
  test(`the desktop opens tidy at ${w}px: sobre.txt, the terminal in the corner, five orbit chips, two files`, async ({ home }) => {
    await home.open(width(w));
    await home.waitForIntro();
    await expect(home.hero.aboutWindow.root).toBeVisible();
    await expect(home.hero.projectsWindow.root).toBeHidden();
    const term = await home.terminal.window.box();
    expect(w - (term.x + term.width)).toBeLessThan(40); // lower right corner
    expect(term.y).toBeGreaterThan(900 / 2);
    expect(Math.round(term.width)).toBe(336);
    await expect(home.dock.restoreButton("Projetos")).toBeVisible();
    await expect(home.hero.root).not.toContainText("git push origin main");
    await expect(home.hero.root).not.toContainText("FROM projetos");
    await expect(home.hero.orbitChips).toHaveCount(5);
    await expect(home.hero.icons).toHaveCount(2);
  });
}

test("on phones the terminal stays open in the page", async ({ home }) => {
  await home.open(PHONE);
  await expect(home.terminal.window.root).toBeVisible();
  await expect(home.dock.restoreButtons).toHaveCount(0);
});

test("desktop icons open with a single click", async ({ home }) => {
  await home.open(DESKTOP);
  await home.waitForIntro();
  await home.hero.icon("Experiência.log").click();
  await expect(home.experience.title).toBeInViewport();
  await home.scrollToTop();
  await home.page.waitForTimeout(500);
  await expect(home.hero.icon("Currículo.pdf")).toHaveAttribute("download", "");
});
