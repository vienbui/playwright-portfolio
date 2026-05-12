import { test as base, expect, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CREDENTIALS } from '../config/env';

/**
 * Type declaration for all custom fixtures.
 */
type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  authenticatedPage: HomePage; // HomePage after login
};

/**
 * Extended test with all Page Object fixtures.
 * Usage: import { test, expect } from '../fixtures'
 */
export const test = base.extend<PageFixtures>({

  // --- Page Object Fixtures ---
  // Each fixture creates a POM instance and passes the current page.

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  /**
   * authenticatedPage fixture:
   * Automatically logs in before the test and provides a ready HomePage.
   * Skips login UI — faster and more reliable than repeating login in each test.
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.navigate();
    await loginPage.login(
      CREDENTIALS.validUser.email,
      CREDENTIALS.validUser.password
    );

    if (await loginPage.loginErrorMessage.isVisible()) {
      throw new Error(
        'Authenticated fixture failed: invalid TEST_EMAIL/TEST_PASSWORD credentials.'
      );
    }

    // Wait until login is confirmed
    await expect(
      page.locator('a').filter({ hasText: /logged in as/i }),
      'Login should succeed before test starts'
    ).toBeVisible({ timeout: 10_000 });

    await use(homePage);

    // Teardown: logout after test
    await homePage.logout().catch(() => {
      // Ignore if logout fails (e.g. page already closed)
    });
  },
});

export { expect };
