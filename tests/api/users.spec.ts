import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/ApiClient';
import { USERS } from '../../data/users';

/**
 * API Tests — Users resource (reqres.in)
 * Covers: GET, POST, PUT, PATCH, DELETE, error cases
 */
test.describe('API: Users', () => {
  let api: ApiClient;

  test.beforeEach(async ({ request }) => {
    api = new ApiClient(request);
  });

  // --- GET ---

  test('GET /api/users — should return paginated user list', async () => {
    const response = await api.get('/api/users', { page: '1' });

    await api.assertStatus(response, 200);

    const body = await api.getJson<{
      page: number;
      total: number;
      data: { id: number; email: string }[];
    }>(response);

    expect(body.page).toBe(1);
    expect(body.total).toBeGreaterThan(0);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('email');
  });

  test('GET /api/users/:id — should return single user', async () => {
    const response = await api.get('/api/users/2');

    await api.assertStatus(response, 200);

    const body = await api.getJson<{ data: { id: number; email: string; first_name: string } }>(response);

    expect(body.data.id).toBe(2);
    expect(body.data.email).toBe(USERS.api.id2.email);
    expect(body.data.first_name).toBe(USERS.api.id2.first_name);
  });

  test('GET /api/users/:id — should return 404 for non-existent user', async () => {
    const response = await api.get('/api/users/999');

    await api.assertStatus(response, 404);
  });

  // --- POST ---

  test('POST /api/users — should create a new user', async () => {
    const newUser = { name: 'QA Automation', job: 'Engineer' };

    const response = await api.post('/api/users', newUser);

    await api.assertStatus(response, 201);

    const body = await api.getJson<{
      name: string;
      job: string;
      id: string;
      createdAt: string;
    }>(response);

    expect(body.name).toBe(newUser.name);
    expect(body.job).toBe(newUser.job);
    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();

    // Verify createdAt is a valid date
    expect(new Date(body.createdAt).toString()).not.toBe('Invalid Date');
  });

  // --- PUT ---

  test('PUT /api/users/:id — should fully update a user', async () => {
    const updatedUser = { name: 'Updated Name', job: 'Senior QA' };

    const response = await api.put('/api/users/2', updatedUser);

    await api.assertStatus(response, 200);

    const body = await api.getJson<{ name: string; job: string; updatedAt: string }>(response);

    expect(body.name).toBe(updatedUser.name);
    expect(body.job).toBe(updatedUser.job);
    expect(body.updatedAt).toBeTruthy();
  });

  // --- PATCH ---

  test('PATCH /api/users/:id — should partially update a user', async () => {
    const patch = { job: 'Lead QA Automation' };

    const response = await api.patch('/api/users/2', patch);

    await api.assertStatus(response, 200);

    const body = await api.getJson<{ job: string; updatedAt: string }>(response);
    expect(body.job).toBe(patch.job);
  });

  // --- DELETE ---

  test('DELETE /api/users/:id — should delete a user', async () => {
    const response = await api.delete('/api/users/2');

    await api.assertStatus(response, 204);
    // 204 No Content — body should be empty
  });
});
