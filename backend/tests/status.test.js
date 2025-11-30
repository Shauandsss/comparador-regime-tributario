import request from 'supertest';
import app from '../src/app.js';

describe('GET /status', () => {
  it('should return status 200 and { ok: true }', async () => {
    const response = await request(app).get('/status');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});

describe('GET /', () => {
  it('should return API information', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('version');
  });
});
