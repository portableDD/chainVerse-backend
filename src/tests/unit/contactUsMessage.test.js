const request = require('supertest');
const app = require('../../../server'); // Path to your server.js file
const mongoose = require('mongoose');
const ContactMessage = require('../../models/ContactMessage'); // Path to your model

describe('Contact Us Management API - E2E Tests', () => {
  // Mock data for testing
  const mockMessage = {
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    subject: 'Test Subject',
    message: 'This is a test message.'
  };

  let createdMessageId;

  // Connect to the test database before running tests
  beforeAll(async () => {
    const dbUri = 'mongodb://localhost:27017/contact-us-test'; // Use your test DB URI
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // Clean up the database after each test
  afterEach(async () => {
    await ContactMessage.deleteMany({});
  });

  // Disconnect after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test: POST /contact-us
  it('should create a new contact message', async () => {
    const response = await request(app)
      .post('/contact-us')
      .send(mockMessage)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Message submitted successfully.');

    // Verify the message is saved in the database
    const savedMessage = await ContactMessage.findOne({ email: mockMessage.email });
    expect(savedMessage).toBeTruthy();
    expect(savedMessage.fullName).toBe(mockMessage.fullName);

    createdMessageId = savedMessage._id;
  });

  // Test: GET /contact-us (Admin Only)
  it('should retrieve all contact messages (admin access)', async () => {
    await ContactMessage.create(mockMessage);

    const response = await request(app)
      .get('/contact-us')
      .set('Authorization', 'Bearer <admin-token>'); // Replace with valid admin token

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].email).toBe(mockMessage.email);
  });

  // Test: GET /contact-us/:id (Admin Only)
  it('should retrieve a contact message by ID (admin access)', async () => {
    const createdMessage = await ContactMessage.create(mockMessage);

    const response = await request(app)
      .get(`/contact-us/${createdMessage._id}`)
      .set('Authorization', 'Bearer <admin-token>'); // Replace with valid admin token

    expect(response.status).toBe(200);
    expect(response.body.subject).toBe(mockMessage.subject);
  });

  // Test: PATCH /contact-us/:id (Admin Only)
  it('should update the status of a contact message (admin access)', async () => {
    const createdMessage = await ContactMessage.create(mockMessage);

    const updatedData = { status: 'resolved', adminNote: 'Message reviewed' };

    const response = await request(app)
      .patch(`/contact-us/${createdMessage._id}`)
      .send(updatedData)
      .set('Authorization', 'Bearer <admin-token>'); // Replace with valid admin token

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Message updated successfully.');

    // Verify the update in the database
    const updatedMessage = await ContactMessage.findById(createdMessage._id);
    expect(updatedMessage.status).toBe('resolved');
    expect(updatedMessage.adminNote).toBe('Message reviewed');
  });

  // Test: DELETE /contact-us/:id (Admin Only)
  it('should delete a contact message by ID (admin access)', async () => {
    const createdMessage = await ContactMessage.create(mockMessage);

    const response = await request(app)
      .delete(`/contact-us/${createdMessage._id}`)
      .set('Authorization', 'Bearer <admin-token>'); // Replace with valid admin token

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Message deleted successfully.');

    // Verify the message is deleted from the database
    const deletedMessage = await ContactMessage.findById(createdMessage._id);
    expect(deletedMessage).toBeNull();
  });
});