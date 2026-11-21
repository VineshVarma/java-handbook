import { defineConfig, devices } from '@playwright/test';

const isProduction = process.env.PLAYWRIGHT_TEST_BASE_URL || process.env.USE_PROD;
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || (isProduction ? 'https://java-internals.vercel.app' : 'http://localhost:3000');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  ...(!isProduction && {
    webServer: {
      command: 'npm run start',
      url: 'http://localhost:3000',
      reuseExistingServer: false,
      timeout: 120000,
    },
  }),
});
