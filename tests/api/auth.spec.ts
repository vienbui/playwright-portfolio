import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/ApiClient';
import { USERS } from '../../data/users';

/**
 * API Tests — Authentication (reqres.in)
 * Covers: login success, login failure, register success, register failure
 */
test.describe('API: Authentication', () => {
  let api: ApiClient;

  test.beforeEach(async ({ request }) => {
    api = new ApiClient(request);
  });

  test('POST /api/login — should return token with valid credentials', async () => {
    const response = await api.post('/api/login', USERS.api.existing);

    await api.assertStatus(response, 200);

    const body = await api.getJson<{ token: string }>(response);

    expect(body.token).toBeTruthy();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST /api/login — should return 400 with invalid credentials', async () => {
    const response = await api.post('/api/login', USERS.api.nonExisting);

    await api.assertStatus(response, 400);

    const body = await api.getJson<{ error: string }>(response);
    expect(body.error).toBeTruthy();
  });

  test('POST /api/login — should return 400 when password is missing', async () => {
    const response = await api.post('/api/login', {
      email: USERS.api.existing.email,
      // password intentionally omitted
    });

    await api.assertStatus(response, 400);

    const body = await api.getJson<{ error: string }>(response);
    expect(body.error).toContain('Missing password');
  });

  test('POST /api/register — should register successfully', async () => {
    const response = await api.post('/api/register', USERS.api.existing);

    await api.assertStatus(response, 200);

    const body = await api.getJson<{ id: number; token: string }>(response);
    expect(body.id).toBeTruthy();
    expect(body.token).toBeTruthy();
  });

  test('POST /api/register — should return 400 when email is missing', async () => {
    const response = await api.post('/api/register', {
      password: 'somepassword',
      // email intentionally omitted
    });

    await api.assertStatus(response, 400);
  });
});
