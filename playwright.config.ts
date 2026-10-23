import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  use: { baseURL: "http://localhost:4173", locale: "pt-BR" },
  webServer: {
    command: "node scripts/serve.mjs out 4173",
    url: "http://localhost:4173",
    reuseExistingServer: true,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], locale: "pt-BR" } }],
});
