import { expect, type Locator, type Page } from "@playwright/test";

/** Uma janela do desktop do hero (`[data-win]`): sobre.txt, terminal e Projetos. */
export class DesktopWindow {
  readonly root: Locator;
  readonly minimizeButton: Locator;
  readonly closeButton: Locator;

  constructor(
    private readonly page: Page,
    readonly id: string,
    /** Nome do botão que a traz de volta do Dock ("Restaurar: <title>"). */
    readonly title: string,
  ) {
    this.root = page.locator(`[data-win="${id}"]`);
    this.minimizeButton = this.root.getByRole("button", { name: "Minimizar" });
    this.closeButton = this.root.getByRole("button", { name: /fechar/i });
  }

  async minimize() {
    await this.minimizeButton.click();
  }

  async close() {
    await this.closeButton.click();
  }

  /** Traz a janela de volta do Dock e espera a animação de abertura terminar. */
  async restoreFromDock() {
    await this.page.getByRole("button", { name: `Restaurar: ${this.title}` }).click();
    await expect(this.root).toBeVisible();
    await this.page.waitForTimeout(900);
  }

  async box() {
    const box = await this.root.boundingBox();
    if (!box) throw new Error(`a janela "${this.id}" não está na tela`);
    return box;
  }

  /** Arrasta a janela pela barra de título (19 px abaixo do topo). */
  async dragTitleBarBy(dx: number, dy: number) {
    const { x, y, width } = await this.box();
    const bar = { x: x + width / 2, y: y + 19 };
    await this.page.mouse.move(bar.x, bar.y);
    await this.page.mouse.down();
    await this.page.mouse.move(bar.x + dx, bar.y + dy, { steps: 12 });
    await this.page.waitForTimeout(250);
    await this.page.mouse.up();
    await this.page.waitForTimeout(900);
  }
}
