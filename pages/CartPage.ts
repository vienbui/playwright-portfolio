import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage — shopping cart interactions.
 */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartProductNames: Locator;
  readonly cartProductPrices: Locator;
  readonly cartQuantities: Locator;
  readonly deleteButtons: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('#cart_info_table tbody tr');
    this.cartProductNames = page.locator('.cart_description h4 a');
    this.cartProductPrices = page.locator('.cart_price p');
    this.cartQuantities = page.locator('.cart_quantity button');
    this.deleteButtons = page.locator('.cart_delete a');
    this.proceedToCheckoutButton = page.locator('.check_out');
    this.emptyCartMessage = page.locator('#empty_cart');
  }

  async navigate(): Promise<void> {
    await this.goto('/view_cart');
    await this.waitForPageLoad();
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async removeFirstItem(): Promise<void> {
    const initialCount = await this.cartItems.count();
    await this.deleteButtons.first().click();
    await expect(
      this.cartItems,
      'Cart item count should decrease after removing first item'
    ).toHaveCount(Math.max(0, initialCount - 1));
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  async getFirstProductName(): Promise<string> {
    return (await this.cartProductNames.first().textContent()) ?? '';
  }

  // --- Assertions ---

  async assertCartHasItems(expectedCount: number): Promise<void> {
    await expect(
      this.cartItems,
      `Expected ${expectedCount} items in cart`
    ).toHaveCount(expectedCount);
  }

  async assertCartIsEmpty(): Promise<void> {
    await this.assertVisible(this.emptyCartMessage, 'Empty cart message');
  }

  async assertProductInCart(productName: string): Promise<void> {
    await expect(
      this.cartProductNames.filter({ hasText: productName }),
      `Expected "${productName}" to be in cart`
    ).toBeVisible();
  }
}
