import { expect, test } from "../fixtures";
import { width } from "../support/viewports";

// Estrutura de títulos, responsividade e movimento reduzido.

test("every section has an h2 and the page has one h1", async ({ home }) => {
  await home.goto();
  await expect(home.mainHeading).toHaveCount(1);
  for (const name of ["Sobre", "Stack", "Experiência", "Projetos", "Formação", "Contato"]) {
    await expect(home.sectionHeading(name)).toHaveCount(1);
  }
});

for (const w of [390, 768, 1440]) {
  test(`no horizontal overflow at ${w}px`, async ({ home }) => {
    await home.open(width(w));
    expect(await home.horizontalOverflow()).toBeLessThanOrEqual(0);
  });
}

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("content is visible without animation", async ({ home }) => {
    await home.goto();
    const first = home.contact.revealItems.first();
    await first.scrollIntoViewIfNeeded();
    await expect(first).toHaveCSS("opacity", "1");
  });
});
