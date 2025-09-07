const request = require('supertest');
const { app } = require('../server');
const mongoose = require('mongoose');
const Itinerary = require('../src/models/Itinerary');

// -------------------------------
// Mock Redis
// -------------------------------
jest.mock('../src/redis', () => {
  return {
    connect: jest.fn(),
    setEx: jest.fn(),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1),
    keys: jest.fn().mockResolvedValue([]),
  };
});

let token;
let itineraryId;

beforeAll(async () => {
  // Connect to test DB
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  // Clean itineraries for a fresh start
  await Itinerary.deleteMany({});

  // Register a test user and get token
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: `testuser${Date.now()}@example.com`,
      password: '123456'
    });

  token = res.body.token;
});

afterAll(async () => {
  // Drop DB after tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Itinerary API CRUD', () => {

  test('Create itinerary', async () => {
    const res = await request(app)
      .post('/api/itineraries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Paris Trip',
        destination: 'Paris',
        startDate: '2025-09-10',
        endDate: '2025-09-15',
        activities: [
          { time: '09:00', description: 'Visit Eiffel Tower', location: 'Eiffel Tower' },
        ]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    itineraryId = res.body._id;
  });

  test('Get all itineraries', async () => {
    const res = await request(app)
      .get('/api/itineraries')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Get single itinerary', async () => {
    const res = await request(app)
      .get(`/api/itineraries/${itineraryId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', itineraryId);
  });

  test('Update itinerary ', async () => {
    const res = await request(app)
      .put(`/api/itineraries/${itineraryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Paris Trip' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Paris Trip');
  });

  test('Delete itinerary', async () => {
    const res = await request(app)
      .delete(`/api/itineraries/${itineraryId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Itinerary deleted successfully');
  });

});
