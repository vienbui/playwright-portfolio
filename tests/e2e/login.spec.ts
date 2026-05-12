import { test, expect } from '../../fixtures';
import { USERS } from '../../data/users';
import { CREDENTIALS } from '../../config/env';

/**
 * Login feature tests
 * Covers: valid login, invalid login, logout flow
 */
test.describe('Login', () => {
  test.describe('Unauthenticated flows', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should login successfully with valid credentials', async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login(CREDENTIALS.validUser.email, CREDENTIALS.validUser.password);

      // Assert user is logged in
      await expect(
        page.locator('a').filter({ hasText: /logged in as/i }),
        'Login should show the "Logged in as" navbar indicator'
      ).toBeVisible();
      await expect(page).toHaveURL('/');
    });

    test('should show error with invalid credentials', async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login(USERS.invalid.email, USERS.invalid.password);

      await loginPage.assertLoginErrorVisible();
    });

    test('should redirect to login when accessing protected page unauthenticated', async ({ page }) => {
      await page.goto('/checkout');
      // Should stay on checkout or redirect — verify not logged in state
      await expect(page.locator('a[href="/login"]')).toBeVisible();
    });
  });

  test('should logout successfully', async ({ authenticatedPage, page }) => {
    await authenticatedPage.navigate();

    await expect(
      page.locator('a').filter({ hasText: /logged in as/i }),
      'User should be logged in before logout'
    ).toBeVisible({ timeout: 10_000 });

    await authenticatedPage.logout();

    await expect(page, 'Should redirect to login page after logout').toHaveURL(/login/);
  });
});
