import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductPage — product listing and detail interactions.
 */
export class ProductPage extends BasePage {
  readonly productCards: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResultsTitle: Locator;
  readonly addToCartButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartButton: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartDetailButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchResultsTitle = page.locator('h2.title.text-center');
    this.addToCartButtons = page.locator('.features_items .add-to-cart:visible');
    this.continueShoppingButton = page.locator('[data-dismiss="modal"]');
    this.viewCartButton = page.locator('#cartModal a[href="/view_cart"]');
    this.productName = page.locator('.product-information h2');
    this.productPrice = page.locator('.product-information span span');
    this.quantityInput = page.locator('#quantity');
    this.addToCartDetailButton = page.locator('button.cart');
  }

  async navigate(): Promise<void> {
    await this.goto('/products');
    await this.waitForPageLoad();
  }

  async addFirstProductToCart(): Promise<void> {
    await this.productCards.first().scrollIntoViewIfNeeded();
    await this.productCards.first().hover();
    await this.addToCartButtons.first().click();
    await expect(
      this.continueShoppingButton,
      'Add to cart should open confirmation modal'
    ).toBeVisible();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async viewCart(): Promise<void> {
    if (await this.viewCartButton.isVisible()) {
      await this.viewCartButton.click();
      return;
    }

    await this.page.locator('a[href="/view_cart"]').first().click();
  }

  async searchProduct(keyword: string): Promise<void> {
    await this.fillField(this.searchInput, keyword);
    await this.searchButton.click();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async setQuantity(qty: number): Promise<void> {
    await this.fillField(this.quantityInput, qty.toString());
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) ?? '';
  }

  async getProductPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? '';
  }

  // --- Assertions ---

  async assertSearchResultsTitle(): Promise<void> {
    await expect(
      this.searchResultsTitle,
      'Search results heading should be visible'
    ).toContainText('Searched Products');
  }

  async assertProductCountGreaterThan(count: number): Promise<void> {
    const actual = await this.productCards.count();
    expect(actual).toBeGreaterThan(count);
  }
}
