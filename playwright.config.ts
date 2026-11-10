import { defineConfig, devices } from "@playwright/test";

const ci = !!process.env.CI;

export default defineConfig({
  testDir: "e2e/tests",
  fullyParallel: true,
  // no CI: falha se sobrar um test.only, tenta de novo testes instáveis e guarda o trace da nova tentativa
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  reporter: ci ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://localhost:4173", locale: "pt-BR", trace: "on-first-retry" },
  webServer: {
    command: "node scripts/serve.mjs out 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !ci,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], locale: "pt-BR" } }],
});
