/**
 * Static test data for use in tests.
 * For dynamic/unique data, use TestDataGenerator instead.
 */

export const USERS = {
  valid: {
    email: 'test@example.com',
    password: 'Test@1234',
    name: 'Test User',
  },
  invalid: {
    email: 'notexist@example.com',
    password: 'wrongpass',
  },
  // reqres.in test users
  api: {
    existing: { email: 'eve.holt@reqres.in', password: 'cityslicka' },
    nonExisting: { email: 'peter@klaven.com', password: 'wrongpass' },
    id2: { id: 2, email: 'janet.weaver@reqres.in', first_name: 'Janet' },
  },
} as const;

export const PRODUCTS = {
  searchKeyword: 'dress',
  category: 'Women',
  subCategory: 'Dress',
} as const;
