import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  // Look for test files in the "e2e" directory, relative to this configuration file.
  testDir: "e2e",

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [["html"], ["list"]],

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: "http://127.0.0.1:3000",
    bypassCSP: true,
    launchOptions: {
      args: ["--disable-web-security"],
    },
  },

  // Configure projects for major browsers.
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Habilita logs de console do navegador
        contextOptions: {
          logger: {
            isEnabled: (name, severity) => true,
            log: (name, severity, message, args) => console.log(`${name} ${severity}: ${message}`, ...args),
          },
        },
      },
    },
  ],

  // Run your local dev server before starting the tests.
  webServer: {
    command: "bun dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
})
