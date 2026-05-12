import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, API_BASE_URL } from './config/env';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if test.only is accidentally left in source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers on CI
  workers: process.env.CI ? 2 : undefined,

  // Reporter config
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['github'] as ['github']] : []),
  ],

  // Shared settings for all projects
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // --- UI Projects ---
    {
      name: 'chromium',
      testMatch: 'tests/e2e/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: 'tests/e2e/**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },

    // --- API Project (no browser needed) ---
    {
      name: 'api',
      testMatch: 'tests/api/**/*.spec.ts',
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': process.env.REQRES_API_KEY ?? '',
        },
      },
    },
  ],
});
