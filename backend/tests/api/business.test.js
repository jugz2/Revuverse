const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');
const Business = require('../../models/Business');
const jwt = require('jsonwebtoken');

describe('Business API', () => {
  let token;
  let userId;

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
    // Clear the collections before each test
    await User.deleteMany({});
    await Business.deleteMany({});

    // Create a test user
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'business-test@example.com',
      password: 'password123'
    });

    userId = user._id;

    // Generate a token for the test user
    token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/business', () => {
    it('should create a new business', async () => {
      const res = await request(app)
        .post('/api/business')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Business',
          category: 'Restaurant',
          address: '123 Test St',
          phone: '123-456-7890',
          email: 'business@example.com',
          website: 'https://testbusiness.com',
          description: 'A test business'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'Test Business');
      expect(res.body).toHaveProperty('owner', userId.toString());
    });

    it('should not create a business without authentication', async () => {
      const res = await request(app)
        .post('/api/business')
        .send({
          name: 'Test Business',
          category: 'Restaurant',
          address: '123 Test St',
          phone: '123-456-7890',
          email: 'business@example.com'
        });
      
      expect(res.statusCode).toEqual(401);
    });

    it('should not create a business without required fields', async () => {
      const res = await request(app)
        .post('/api/business')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Business'
          // Missing required fields
        });
      
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/business', () => {
    it('should get all businesses for the authenticated user', async () => {
      // Create some test businesses
      await Business.create({
        name: 'Business 1',
        category: 'Restaurant',
        address: '123 Test St',
        phone: '123-456-7890',
        email: 'business1@example.com',
        owner: userId
      });

      await Business.create({
        name: 'Business 2',
        category: 'Retail',
        address: '456 Test Ave',
        phone: '987-654-3210',
        email: 'business2@example.com',
        owner: userId
      });

      const res = await request(app)
        .get('/api/business')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toEqual(2);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[1]).toHaveProperty('name');
    });

    it('should not get businesses without authentication', async () => {
      const res = await request(app)
        .get('/api/business');
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/business/:id', () => {
    it('should get a single business by ID', async () => {
      // Create a test business
      const business = await Business.create({
        name: 'Single Business',
        category: 'Healthcare',
        address: '789 Test Blvd',
        phone: '555-555-5555',
        email: 'single@example.com',
        owner: userId
      });

      const res = await request(app)
        .get(`/api/business/${business._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Single Business');
      expect(res.body).toHaveProperty('_id', business._id.toString());
    });

    it('should not get a business that does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/business/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
    });

    it('should not get a business that belongs to another user', async () => {
      // Create another user
      const anotherUser = await User.create({
        firstName: 'Another',
        lastName: 'User',
        email: 'another@example.com',
        password: 'password123'
      });

      // Create a business owned by another user
      const business = await Business.create({
        name: 'Another Business',
        category: 'Entertainment',
        address: '999 Other St',
        phone: '111-222-3333',
        email: 'another-business@example.com',
        owner: anotherUser._id
      });

      const res = await request(app)
        .get(`/api/business/${business._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('PUT /api/business/:id', () => {
    it('should update a business', async () => {
      // Create a test business
      const business = await Business.create({
        name: 'Update Business',
        category: 'Professional Services',
        address: '321 Update St',
        phone: '444-444-4444',
        email: 'update@example.com',
        owner: userId
      });

      const res = await request(app)
        .put(`/api/business/${business._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Business Name',
          phone: '999-999-9999'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Updated Business Name');
      expect(res.body).toHaveProperty('phone', '999-999-9999');
      expect(res.body).toHaveProperty('category', 'Professional Services'); // Unchanged field
    });

    it('should not update a business that does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .put(`/api/business/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name'
        });
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /api/business/:id', () => {
    it('should delete a business', async () => {
      // Create a test business
      const business = await Business.create({
        name: 'Delete Business',
        category: 'Automotive',
        address: '123 Delete St',
        phone: '777-777-7777',
        email: 'delete@example.com',
        owner: userId
      });

      const res = await request(app)
        .delete(`/api/business/${business._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      
      // Verify the business was deleted
      const deletedBusiness = await Business.findById(business._id);
      expect(deletedBusiness).toBeNull();
    });

    it('should not delete a business that does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/business/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
    });

    it('should not delete a business that belongs to another user', async () => {
      // Create another user
      const anotherUser = await User.create({
        firstName: 'Another',
        lastName: 'User',
        email: 'another-delete@example.com',
        password: 'password123'
      });

      // Create a business owned by another user
      const business = await Business.create({
        name: 'Another Delete Business',
        category: 'Entertainment',
        address: '999 Delete St',
        phone: '888-888-8888',
        email: 'another-delete-business@example.com',
        owner: anotherUser._id
      });

      const res = await request(app)
        .delete(`/api/business/${business._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(403);
      
      // Verify the business was not deleted
      const notDeletedBusiness = await Business.findById(business._id);
      expect(notDeletedBusiness).not.toBeNull();
    });
  });
}); 