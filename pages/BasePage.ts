import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — all Page Objects extend this class.
 * Contains shared actions and helpers to avoid duplication.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to a relative or absolute URL
  async goto(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  // Wait for page to be fully loaded
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Get page title
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // Click and wait for navigation
  async clickAndNavigate(locator: Locator): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation(),
      locator.click(),
    ]);
  }

  // Type into a field after clearing it
  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }

  // Assert URL contains a path segment
  async assertUrlContains(segment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(segment));
  }

  // Assert element is visible with a meaningful error message
  async assertVisible(locator: Locator, description: string): Promise<void> {
    await expect(locator, `Expected "${description}" to be visible`).toBeVisible();
  }

  // Take a named screenshot
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}
