const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const OrganizationMember = require('../models/OrganizationMember');
const Organization = require('../models/Organization');
const { sendMemberInvitation, sendMemberRemovalNotification } = require('../utils/organizationEmailService');

let mongoServer;

// Mock the email service
jest.mock('../utils/organizationEmailService');

describe('Organization Member Controller Tests', () => {
  let authToken;
  let testOrganization;
  let testMember;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Create test organization
    testOrganization = await Organization.create({
      name: 'Test Organization',
      email: 'test@org.com'
    });

    // Mock auth token and user
    authToken = 'test-auth-token';
    app.request.user = {
      organizationId: testOrganization._id,
      role: 'Admin'
    };
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('addMember', () => {
    const newMemberData = {
      email: 'newmember@test.com',
      fullName: 'New Member',
      role: 'Employee'
    };

    it('should add a new member successfully', async () => {
      sendMemberInvitation.mockResolvedValue(true);

      const response = await request(app)
        .post('/organization/member/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newMemberData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Member invitation sent successfully');
      expect(response.body.data.email).toBe(newMemberData.email);
      expect(sendMemberInvitation).toHaveBeenCalled();
    });

    it('should not add duplicate member', async () => {
      // First create a member
      await OrganizationMember.create({
        ...newMemberData,
        organizationId: testOrganization._id
      });

      const response = await request(app)
        .post('/organization/member/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newMemberData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Member already exists in the organization');
    });
  });

  describe('getAllMembers', () => {
    it('should retrieve all members', async () => {
      const response = await request(app)
        .get('/organization/members')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Members retrieved successfully');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('getMemberById', () => {
    beforeEach(async () => {
      testMember = await OrganizationMember.create({
        email: 'test@member.com',
        fullName: 'Test Member',
        role: 'Employee',
        organizationId: testOrganization._id
      });
    });

    it('should retrieve member by ID', async () => {
      const response = await request(app)
        .get(`/organization/member/${testMember._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(testMember._id.toString());
    });

    it('should return 404 for non-existent member', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/organization/member/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Member not found');
    });
  });

  describe('updateMemberRole', () => {
    it('should update member role', async () => {
      const response = await request(app)
        .put(`/organization/member/${testMember._id}/update-role`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ role: 'Admin' });

      expect(response.status).toBe(200);
      expect(response.body.data.role).toBe('Admin');
    });
  });

  describe('removeMember', () => {
    it('should remove member and send notification', async () => {
      sendMemberRemovalNotification.mockResolvedValue(true);

      const response = await request(app)
        .delete(`/organization/member/${testMember._id}/remove`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Member removed successfully');
      expect(sendMemberRemovalNotification).toHaveBeenCalled();

      // Verify member was actually deleted
      const deletedMember = await OrganizationMember.findById(testMember._id);
      expect(deletedMember).toBeNull();
    });
  });
});