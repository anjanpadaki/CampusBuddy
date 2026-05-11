const request = require('supertest');
const app = require('../server');

describe('Basic API Tests', () => {
  it('should return 200 OK for the health check endpoint', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('should return 400 for login with missing credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '', password: '' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });
});
