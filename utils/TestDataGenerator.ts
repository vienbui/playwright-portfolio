/**
 * TestDataGenerator — generates unique test data to avoid conflicts
 * when tests run in parallel or are retried.
 */
export class TestDataGenerator {

  static uniqueEmail(prefix = 'test'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 7);
    return `${prefix}_${timestamp}_${random}@testmail.com`;
  }

  static uniqueName(prefix = 'User'): string {
    const random = Math.random().toString(36).slice(2, 7);
    return `${prefix}_${random}`;
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  static randomPhone(): string {
    return `09${Math.floor(Math.random() * 900000000 + 100000000)}`;
  }

  static newUser() {
    return {
      name: TestDataGenerator.uniqueName(),
      email: TestDataGenerator.uniqueEmail(),
      password: 'Test@1234!',
      firstName: 'Auto',
      lastName: 'Test',
      address: '123 Test Street',
      city: 'Ho Chi Minh',
      state: 'HCM',
      zipCode: '70000',
      country: 'Vietnam',
      mobile: TestDataGenerator.randomPhone(),
    };
  }
}
