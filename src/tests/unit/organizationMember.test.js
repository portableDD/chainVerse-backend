make a const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../server');
const OrganizationMember = require('../../models/OrganizationMember');
const User = require('../../models/User');

describe('Organization Member Routes', () => {
  let adminToken;
  let regularToken;
  let testMemberId;

  beforeAll(async () => {
    // Create admin user
    const adminUser = await User.create({
      email: 'admin@test.com',
      password: 'password123',
      isAdmin: true,
      isEmailVerified: true
    });

    // Create regular user
    const regularUser = await User.create({
      email: 'regular@test.com',
      password: 'password123',
      isAdmin: false,
      isEmailVerified: true
    });

    // Generate tokens
    adminToken = adminUser.generateAuthToken();
    regularToken = regularUser.generateAuthToken();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await OrganizationMember.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /organization/member/add', () => {
    it('should add a new member when admin token is provided', async () => {
      const memberData = {
        email: 'newmember@test.com',
        fullName: 'New Member',
        role: 'Employee'
      };

      const response = await request(app)
        .post('/organization/member/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(memberData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      testMemberId = response.body.data._id;
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .post('/organization/member/add')
        .send({
          email: 'test@test.com',
          role: 'member'
        });

      expect(response.status).toBe(401);
    });

    it('should return 403 when non-admin token is provided', async () => {
      const response = await request(app)
        .post('/organization/member/add')
        .set('Authorization', `Bearer ${regularToken}`)
        .send({
          email: 'test@test.com',
          role: 'member'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /organization/members', () => {
    it('should return all members when admin token is provided', async () => {
      const response = await request(app)
        .get('/organization/members')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app).get('/organization/members');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /organization/member/:id', () => {
    it('should return member details when valid ID is provided', async () => {
      const response = await request(app)
        .get(`/organization/member/${testMemberId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.data).toHaveProperty('_id', testMemberId);
    });

    it('should return 404 when invalid ID is provided', async () => {
      const response = await request(app)
        .get('/organization/member/invalidid')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /organization/member/:id/update-role', () => {
    it('should update member role when valid data is provided', async () => {
      const response = await request(app)
        .put(`/organization/member/${testMemberId}/update-role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'Admin' });

      expect(response.status).toBe(200);
      expect(response.body.data.role).toBe('Admin');
    });

    it('should return 400 when invalid role is provided', async () => {
      const response = await request(app)
        .put(`/organization/member/${testMemberId}/update-role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'invalid_role' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /organization/member/:id/remove', () => {
    it('should remove member when valid ID is provided', async () => {
      const response = await request(app)
        .delete(`/organization/member/${testMemberId}/remove`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify member is actually removed
      const memberExists = await OrganizationMember.findById(testMemberId);
      expect(memberExists).toBeNull();
    });

    it('should return 404 when member does not exist', async () => {
      const response = await request(app)
        .delete(`/organization/member/${testMemberId}/remove`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});