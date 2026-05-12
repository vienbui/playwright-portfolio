import { test, expect } from '@playwright/test';
import * as fs from 'node:fs/promises';

test('authenticate and save storage state', async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing TEST_EMAIL or TEST_PASSWORD environment variables.');
  }

  await page.goto('/login');
  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.locator('[data-qa="login-button"]').click();

  await expect(
    page.locator('a').filter({ hasText: /logged in as/i }),
    'Login should complete before saving storage state'
  ).toBeVisible({ timeout: 10_000 });

  await fs.mkdir('playwright/.auth', { recursive: true });
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
