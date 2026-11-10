import { expect, test } from "../fixtures";
import { DESKTOP, PHONE } from "../support/viewports";

// Navegação, idioma e tema.

test("mobile menu opens and closes", async ({ home }) => {
  const menu = home.mobileMenu;
  await home.open(PHONE);
  await menu.open();
  await expect(menu.root).toBeVisible();
  await expect(menu.sectionLinks).toHaveCount(6);
  await menu.closeWithEscape();
  await expect(menu.root).toBeHidden();

  await menu.goTo("Projetos");
  await expect(menu.root).toBeHidden();
  await expect(home.projects.title).toBeInViewport();
  await menu.goTo("Contato");
  await expect(home.contact.title).toBeInViewport();

  await menu.open();
  await menu.close();
  await expect(menu.root).toBeHidden();
});

test("GitHub opens in a new tab from the menu bar, the Dock, the phone menu and the contact card", async ({ home }) => {
  await home.open(DESKTOP);
  for (const area of [home.header, home.dock.root, home.contact.root]) {
    const link = home.githubLink(area);
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
  await home.resize(PHONE);
  await home.mobileMenu.open();
  await expect(home.githubLink(home.mobileMenu.root)).toBeVisible();
});

test("language toggle switches to English and persists", async ({ home }) => {
  await home.goto();
  await home.switchLanguage("en");
  await expect(home.html).toHaveAttribute("lang", "en");
  await expect(home.link("See projects")).toBeVisible();
  await home.reload();
  await expect(home.html).toHaveAttribute("lang", "en");
});

test("in English nothing is left in Portuguese: window titles, details, terminal, Dock and tab title", async ({ home }) => {
  await home.startIn("en");
  await home.open(DESKTOP);
  await home.page.waitForTimeout(2500); // past the point where Next used to put the Portuguese title back
  await expect(home.page).toHaveTitle("Marcos Sergio — PHP & Full Stack Developer");
  for (const title of ["about.txt", "about.md", "git log --career", "Projects — ~/projects", "education.txt", "zsh — contact"]) {
    await expect(home.page.getByText(title, { exact: true }).first()).toBeAttached();
  }
  await expect(home.dock.restoreButton("Projects", "Restore")).toBeVisible();
  await expect(home.projects.details).toContainText("sector");
  await expect(home.contact.root).toContainText("whoami --contact");
  await expect(home.page.getByLabel("Interface illustration: AI customer service").first()).toContainText("Any openings tomorrow morning?");
  await expect(home.terminal.input).toHaveAttribute("placeholder", /type help/i);
  await home.terminal.run("ls");
  await expect(home.terminal.window.root).toContainText("about/  experience/  projects/");
  const body = await home.body.innerText();
  for (const pt of ["sobre.txt", "sobre.md", "--carreira", "formacao.txt", "contato", "~/projetos", "Tem horário", "Projetos"]) {
    expect(body, pt).not.toContain(pt);
  }
});

test("theme opens light, switches to dark and opens light again", async ({ home }) => {
  await home.page.emulateMedia({ colorScheme: "dark" });
  await home.goto();
  await expect(home.html).not.toHaveAttribute("data-theme", "dark");
  await home.themeToggle.click();
  await expect(home.html).toHaveAttribute("data-theme", "dark");
  await expect(home.themeToggle).toHaveAttribute("aria-pressed", "true");
  await home.themeToggle.click();
  await expect(home.html).not.toHaveAttribute("data-theme", "dark");
  await home.themeToggle.click();
  await home.reload();
  await expect(home.html).not.toHaveAttribute("data-theme", "dark");
});
