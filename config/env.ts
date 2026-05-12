/**
 * Environment configuration
 * Values can be overridden by environment variables for CI/CD
 */

export const BASE_URL =
  process.env.BASE_URL ?? 'https://automationexercise.com';

export const API_BASE_URL =
  process.env.API_BASE_URL ?? 'https://reqres.in';

export const CREDENTIALS = {
  validUser: {
    email: process.env.TEST_EMAIL ?? 'test@example.com',
    password: process.env.TEST_PASSWORD ?? 'Test@1234',
    name: process.env.TEST_NAME ?? 'Test User',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};

export const TIMEOUTS = {
  short: 5_000,
  medium: 10_000,
  long: 30_000,
};
