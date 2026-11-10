import type { Locator, Page } from "@playwright/test";

/** Seção Contato (#contato): e-mail, WhatsApp, LinkedIn, GitHub e o CV. */
export class ContactSection {
  readonly root: Locator;
  readonly title: Locator;
  readonly whatsappLinks: Locator;
  readonly linkedinLinks: Locator;
  readonly cvLink: Locator;
  readonly copyEmailButton: Locator;
  /** Blocos que entram com animação ao rolar a página. */
  readonly revealItems: Locator;

  constructor(page: Page) {
    this.root = page.locator("#contato");
    this.title = page.locator("#contato-title");
    this.whatsappLinks = this.root.locator('a[href^="https://wa.me/"]');
    this.linkedinLinks = this.root.locator('a[href^="https://www.linkedin.com/in/"]');
    this.cvLink = this.root.locator('a[href$=".pdf"]');
    this.copyEmailButton = this.root.locator("dd button");
    this.revealItems = this.root.locator("[data-reveal]");
  }

  mailtoLinks(address: string) {
    return this.root.locator(`a[href^="mailto:${address}"]`);
  }

  async copyEmail() {
    await this.copyEmailButton.scrollIntoViewIfNeeded();
    await this.copyEmailButton.click();
  }
}
