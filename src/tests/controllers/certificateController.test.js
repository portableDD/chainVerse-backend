const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const sinon = require('sinon');
const app = require('../../src/app');
const Certificate = require('../../src/models/Certificate');
const ShareAnalytics = require('../../src/models/ShareAnalytics');
const User = require('../../src/models/User');
const cloudStorage = require('../../src/utils/cloudStorage');
const certificateGenerator = require('../../src/utils/certificateGenerator');
const { generatePublicHash } = require('../../src/utils/hashGenerator');

let mongoServer;
let testUser;
let testCertificate;
let authToken;

beforeAll(async () => {
  // Set up MongoDB memory server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Set up test user
  testUser = new User({
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User'
  });
  await testUser.save();

  // Generate auth token
  authToken = `Bearer ${testUser.generateAuthToken()}`;

  sinon.stub(cloudStorage, 'uploadToCloudStorage').resolves({
    url: 'https://cdn.chainverse.io/certs/test-certificate.png',
    key: 'certificates/12345/certificate.png'
  });

  sinon.stub(certificateGenerator, 'generateCertificateImage').resolves(Buffer.from('fake-image-data'));
});

beforeEach(async () => {
  testCertificate = new Certificate({
    studentId: testUser._id,
    studentName: 'Test User',
    courseId: new mongoose.Types.ObjectId(),
    courseTitle: 'Web3 Foundations',
    issueDate: new Date(),
  });
  await testCertificate.save();
});

afterEach(async () => {
  await Certificate.deleteMany({});
  await ShareAnalytics.deleteMany({});
});

afterAll(async () => {
  sinon.restore();
  
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Certificate Public Link Generation', () => {
  test('should generate a public link for a valid certificate', async () => {
    const response = await request(app)
      .get(`/certificates/${testCertificate._id}/public-link`)
      .set('Authorization', authToken);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('publicUrl');
    expect(response.body).toHaveProperty('metadata');
    expect(response.body.metadata).toHaveProperty('studentName', 'Test User');
    expect(response.body.metadata).toHaveProperty('courseTitle', 'Web3 Foundations');
  });

  test('should reject public link generation for non-owned certificate', async () => {
    const anotherUser = new User({
      email: 'another@example.com',
      password: 'hashedPassword',
      name: 'Another User'
    });
    await anotherUser.save();
    
    const anotherToken = `Bearer ${anotherUser.generateAuthToken()}`;

    const response = await request(app)
      .get(`/certificates/${testCertificate._id}/public-link`)
      .set('Authorization', anotherToken);

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Unauthorized access to certificate');
  });

  test('should handle certificate not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    
    const response = await request(app)
      .get(`/certificates/${fakeId}/public-link`)
      .set('Authorization', authToken);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Certificate not found');
  });
});

describe('Certificate Share Metadata', () => {
  test('should return share metadata for valid certificate', async () => {
    const response = await request(app)
      .get(`/certificates/${testCertificate._id}/share-metadata`)
      .set('Authorization', authToken);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('courseTitle', 'Web3 Foundations');
    expect(response.body).toHaveProperty('studentName', 'Test User');
    expect(response.body).toHaveProperty('certificateThumbnail');
    expect(response.body).toHaveProperty('shareMessage');
    expect(response.body).toHaveProperty('verificationLink');
  });

  test('should reject share metadata for non-owned certificate', async () => {
    const anotherUser = new User({
      email: 'another@example.com',
      password: 'hashedPassword',
      name: 'Another User'
    });
    await anotherUser.save();
    
    const anotherToken = `Bearer ${anotherUser.generateAuthToken()}`;

    const response = await request(app)
      .get(`/certificates/${testCertificate._id}/share-metadata`)
      .set('Authorization', anotherToken);

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Unauthorized access to certificate');
  });
});

describe('Certificate Share Analytics', () => {
  test('should record a share event for valid platform', async () => {
    const response = await request(app)
      .post(`/certificates/${testCertificate._id}/track-share`)
      .set('Authorization', authToken)
      .send({ platform: 'linkedin' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Share event recorded successfully');

    const events = await ShareAnalytics.find({ certificateId: testCertificate._id });
    expect(events).toHaveLength(1);
    expect(events[0].platform).toBe('linkedin');
  });

  test('should reject share event for invalid platform', async () => {
    const response = await request(app)
      .post(`/certificates/${testCertificate._id}/track-share`)
      .set('Authorization', authToken)
      .send({}); 

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Platform is required');
  });

  test('should reject share event for non-owned certificate', async () => {
    const anotherUser = new User({
      email: 'another@example.com',
      password: 'hashedPassword',
      name: 'Another User'
    });
    await anotherUser.save();
    
    const anotherToken = `Bearer ${anotherUser.generateAuthToken()}`;

    const response = await request(app)
      .post(`/certificates/${testCertificate._id}/track-share`)
      .set('Authorization', anotherToken)
      .send({ platform: 'linkedin' });

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Unauthorized access to certificate');
  });
});

describe('Public Certificate Access', () => {
  test('should return public certificate data by hash', async () => {
    testCertificate.publicHash = generatePublicHash(testCertificate._id);
    testCertificate.imageUrl = 'https://cdn.chainverse.io/certs/test-certificate.png';
    await testCertificate.save();

    const response = await request(app)
      .get(`/certificates/public/${testCertificate.publicHash}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('studentName', 'Test User');
    expect(response.body).toHaveProperty('courseTitle', 'Web3 Foundations');
    expect(response.body).toHaveProperty('imageUrl');
    expect(response.body).toHaveProperty('verificationHash', testCertificate.publicHash);
    
    expect(response.body).not.toHaveProperty('studentId');
    expect(response.body).not.toHaveProperty('_id');
  });

  test('should handle invalid public hash', async () => {
    const fakeHash = 'invalidhash12345';
    
    const response = await request(app)
      .get(`/certificates/public/${fakeHash}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Certificate not found');
  });
});

describe('Certificate Retrieval', () => {
  test('should return certificate with image URL', async () => {
    const response = await request(app)
      .get(`/certificates/${testCertificate._id}`)
      .set('Authorization', authToken);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('imageUrl');
    expect(response.body).toHaveProperty('studentName', 'Test User');
    expect(response.body).toHaveProperty('courseTitle', 'Web3 Foundations');
  });

  test('should generate image URL if not present', async () => {
    testCertificate.imageUrl = undefined;
    await testCertificate.save();

    const response = await request(app)
      .get(`/certificates/${testCertificate._id}`)
      .set('Authorization', authToken);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('imageUrl', 'https://cdn.chainverse.io/certs/test-certificate.png');
  });
});