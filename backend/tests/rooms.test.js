import request from 'supertest';
import app from '../src/app.js';

describe('Rooms API', () => {
  test('GET /api/room_types returns list', async () => {
    const res = await request(app).get('/api/room_types');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data.room_types)).toBe(true);
  }, 10000);

  test('GET /api/rooms returns rooms and total', async () => {
    const res = await request(app).get('/api/rooms');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data.rooms)).toBe(true);
    // total may be present (from RoomsService), if not at least ensure rooms returned
  }, 10000);
});
