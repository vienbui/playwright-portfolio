import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — handles all login/signup UI interactions.
 * URL: /login
 */
export class LoginPage extends BasePage {
  // --- Locators ---
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('[data-qa="login-email"]');
    this.passwordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.loginErrorMessage = page.locator('p:has-text("Your email or password is incorrect")');
    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
  }

  // --- Actions ---

  async navigate(): Promise<void> {
    await this.goto('/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    await this.loginButton.click();
  }

  async initiateSignup(name: string, email: string): Promise<void> {
    await this.fillField(this.signupNameInput, name);
    await this.fillField(this.signupEmailInput, email);
    await this.signupButton.click();
  }

  // --- Assertions ---

  async assertLoginErrorVisible(): Promise<void> {
    await this.assertVisible(this.loginErrorMessage, 'Login error message');
  }

  async assertOnLoginPage(): Promise<void> {
    await this.assertUrlContains('login');
    await expect(this.loginButton).toBeVisible();
  }
}
