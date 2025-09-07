const request = require('supertest');
const { app } = require('../server');
const mongoose = require('mongoose');
const User = require('../src/models/User');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Authentication API', () => {

  test('Register a new user', async () => {
    const randomEmail = `testuser${Date.now()}@example.com`;

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: randomEmail,
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('Login existing user', async () => {
    const randomEmail = `testuser${Date.now()}@example.com`;

    // First register
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: randomEmail,
        password: 'password123'
      });

    // Then login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: randomEmail,
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

});
