import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/**
 * ApiClient — wraps Playwright's APIRequestContext with helpers.
 * Makes API calls more readable and adds built-in response validation.
 */
export class ApiClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  // --- Core HTTP Methods ---

  async get(endpoint: string, params?: Record<string, string>): Promise<APIResponse> {
    return this.request.get(endpoint, { params });
  }

  async post<T>(endpoint: string, body: T): Promise<APIResponse> {
    return this.request.post(endpoint, { data: body });
  }

  async put<T>(endpoint: string, body: T): Promise<APIResponse> {
    return this.request.put(endpoint, { data: body });
  }

  async patch<T>(endpoint: string, body: Partial<T>): Promise<APIResponse> {
    return this.request.patch(endpoint, { data: body });
  }

  async delete(endpoint: string): Promise<APIResponse> {
    return this.request.delete(endpoint);
  }

  // --- Response Helpers ---

  async getJson<T>(response: APIResponse): Promise<T> {
    return response.json() as Promise<T>;
  }

  // --- Assertion Helpers ---

  async assertStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    const actualStatus = response.status();
    let failureMessage = `Expected status ${expectedStatus}, got ${actualStatus}`;

    if (actualStatus !== expectedStatus && (actualStatus === 401 || actualStatus === 403)) {
      try {
        const body = await response.json();
        const authReason =
          typeof body?.message === 'string'
            ? body.message
            : typeof body?.error === 'string'
              ? body.error
              : 'authentication failed';

        failureMessage = `${failureMessage}. API authentication issue: ${authReason}. Check REQRES_API_KEY in .env`;
      } catch {
        failureMessage = `${failureMessage}. API authentication failed. Check REQRES_API_KEY in .env`;
      }
    }

    expect(actualStatus, failureMessage).toBe(expectedStatus);
  }

  assertOk(response: APIResponse): void {
    expect(
      response.ok(),
      `Expected response to be OK (2xx), got ${response.status()}`
    ).toBeTruthy();
  }

  async assertBodyContains(response: APIResponse, key: string, value?: unknown): Promise<void> {
    const body = await response.json();
    expect(body, `Response body should contain key "${key}"`).toHaveProperty(key);
    if (value !== undefined) {
      expect(body[key]).toBe(value);
    }
  }
}
