import { test, expect } from '../../fixtures';
import { PRODUCTS } from '../../data/users';

/**
 * Product feature tests
 * Covers: product listing, search, add to cart
 */
test.describe('Products', () => {

  test.beforeEach(async ({ productPage }) => {
    await productPage.navigate();
  });

  test('should display products on products page', async ({ productPage }) => {
    await productPage.assertProductCountGreaterThan(0);
  });

  test('should search for products and show results', async ({ productPage, page }) => {
    await productPage.searchProduct(PRODUCTS.searchKeyword);

    // Verify search results page
    await expect(page.locator('h2.title'), 'Search results heading should render').toContainText('Searched Products');
    await expect(page.locator('.product-image-wrapper').first(), 'At least one searched product should be shown').toBeVisible();
  });

  test('should add product to cart and verify', async ({ productPage, cartPage }) => {
    // Add first product to cart
    const productName = await productPage.getProductCount();
    expect(productName, 'Products page should list at least one product').toBeGreaterThan(0);

    await productPage.addFirstProductToCart();
    await productPage.viewCart();

    // Verify cart has item
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount, 'Cart should contain exactly one product after adding one item').toBe(1);
  });

  test('should remove product from cart', async ({ productPage, cartPage }) => {
    await productPage.addFirstProductToCart();
    await productPage.viewCart();

    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount, 'Cart should have at least one item before remove action').toBeGreaterThan(0);

    await cartPage.removeFirstItem();

    // Cart should be empty or have one less item
    const newCount = await cartPage.getCartItemCount();
    expect(newCount, 'Cart item count should decrement by one after removal').toBe(initialCount - 1);
  });
});
