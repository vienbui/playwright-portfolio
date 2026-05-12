import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

/**
 * Type declaration for all custom fixtures.
 */
type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  authenticatedPage: HomePage;
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

  authenticatedPage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect };
