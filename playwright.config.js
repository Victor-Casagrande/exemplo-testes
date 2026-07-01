const { devices } = require("@playwright/test");

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  // Um único worker evita race conditions com o servidor em memória compartilhado
  workers: 1,
  testDir: "./src/tests/e2e",

  testMatch: "*.spec.js",

  use: {
    baseURL: "http://localhost:3030",

    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  // Roda os testes nos três principais engines de browser (tarefa E2E 10)
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  reporter: [
    [
      "html",
      {
        outputFolder: "./reports/playwright",
        open: "never",
      },
    ],
  ],

  outputDir: "./test-results/playwright",

  webServer: {
    command: "npm start",
    url: "http://localhost:3030",
    reuseExistingServer: true,
  },
};