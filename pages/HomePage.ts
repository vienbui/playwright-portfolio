import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage — landing page interactions.
 */
export class HomePage extends BasePage {
  readonly navbarLoginLink: Locator;
  readonly navbarLoggedInUser: Locator;
  readonly navbarLogoutLink: Locator;
  readonly navbarCartLink: Locator;
  readonly productsList: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly slider: Locator;

  constructor(page: Page) {
    super(page);
    this.navbarLoginLink = page.locator('a[href="/login"]');
    this.navbarLoggedInUser = page.locator('a').filter({ hasText: /logged in as/i });
    this.navbarLogoutLink = page.locator('a[href="/logout"]');
    this.navbarCartLink = page.locator('a[href="/view_cart"]');
    this.productsList = page.locator('.features_items .product-image-wrapper');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.slider = page.locator('#slider');
  }

  async navigate(): Promise<void> {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  async goToLogin(): Promise<void> {
    await this.navbarLoginLink.click();
  }

  async logout(): Promise<void> {
    await this.navbarLogoutLink.click();
  }

  async searchProduct(keyword: string): Promise<void> {
    await this.fillField(this.searchInput, keyword);
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  async getProductCount(): Promise<number> {
    return this.productsList.count();
  }

  // --- Assertions ---

  async assertLoggedIn(username: string): Promise<void> {
    await expect(
      this.navbarLoggedInUser,
      `Expected to see "Logged in as ${username}"`
    ).toContainText(username);
  }

  async assertLoggedOut(): Promise<void> {
    await this.assertVisible(this.navbarLoginLink, 'Login nav link');
  }

  async assertProductsVisible(): Promise<void> {
    await expect(
      this.productsList.first(),
      'Expected at least one product to be visible'
    ).toBeVisible();
  }
}
