const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const OrganizationMember = require('../models/OrganizationMember');

let mongoServer;

describe('OrganizationMember Model Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create a member with valid data', async () => {
    const validMemberData = {
      organizationId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'Employee'
    };

    const member = await OrganizationMember.create(validMemberData);
    expect(member.email).toBe(validMemberData.email);
    expect(member.status).toBe('Pending'); // Default status
  });

  it('should fail without required fields', async () => {
    const invalidMemberData = {
      email: 'test@example.com'
    };

    await expect(OrganizationMember.create(invalidMemberData))
      .rejects
      .toThrow(mongoose.Error.ValidationError);
  });

  it('should validate email format', async () => {
    const invalidEmailData = {
      organizationId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      email: 'invalid-email',
      fullName: 'Test User',
      role: 'Employee'
    };

    const member = new OrganizationMember(invalidEmailData);
    const validationError = member.validateSync();
    expect(validationError).toBeDefined();
  });

  it('should validate role enum values', async () => {
    const invalidRoleData = {
      organizationId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'InvalidRole'
    };

    const member = new OrganizationMember(invalidRoleData);
    const validationError = member.validateSync();
    expect(validationError).toBeDefined();
  });

  it('should update timestamps on save', async () => {
    const memberData = {
      organizationId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'Employee'
    };

    const member = await OrganizationMember.create(memberData);
    const originalUpdatedAt = member.updatedAt;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 100));

    member.fullName = 'Updated Name';
    await member.save();

    expect(member.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });

  it('should convert email to lowercase', async () => {
    const memberData = {
      organizationId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      email: 'TEST@EXAMPLE.COM',
      fullName: 'Test User',
      role: 'Employee'
    };

    const member = await OrganizationMember.create(memberData);
    expect(member.email).toBe('test@example.com');
  });
});