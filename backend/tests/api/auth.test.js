const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    // Connect to a test database before running tests
    const mongoURI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/revuverse-test';
    await mongoose.connect(mongoURI);
  });

  afterAll(async () => {
    // Disconnect from the test database after tests
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the users collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should not register a user with an existing email', async () => {
      // Create a user first
      await User.create({
        firstName: 'Existing',
        lastName: 'User',
        email: 'existing@example.com',
        password: 'password123'
      });

      // Try to register with the same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'existing@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      // Create a user first
      await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'login@example.com',
        password: 'password123'
      });

      // Login with the user
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'login@example.com');
    });

    it('should not login with incorrect credentials', async () => {
      // Create a user first
      await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'login@example.com',
        password: 'password123'
      });

      // Try to login with incorrect password
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get the current user profile', async () => {
      // Create a user first
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'me@example.com',
        password: 'password123'
      });

      // Login to get a token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'me@example.com',
          password: 'password123'
        });
      
      const token = loginRes.body.token;

      // Get the user profile
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('email', 'me@example.com');
    });

    it('should not get profile without authentication', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.statusCode).toEqual(401);
    });
  });
}); 