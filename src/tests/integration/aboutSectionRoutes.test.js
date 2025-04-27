const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const AboutSection = require('../../models/AboutSection');
const aboutSectionRoutes = require('../../routes/aboutSectionRoutes');

jest.mock('../../middlewares/auth', () => ({
  isAuthenticated: (req, res, next) => next(),
  isAdmin: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/section', aboutSectionRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await AboutSection.deleteMany({});
});

describe('About Section API Endpoints', () => {
  describe('POST /section', () => {
    it('should create a new section successfully', async () => {
      const res = await request(app)
        .post('/section')
        .send({
          sectionType: 'about',
          title: 'About ChainVerse Academy',
          content: '<p>ChainVerse Academy is a leading blockchain education platform.</p>'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.sectionType).toBe('about');
    });
    
    it('should return an error if section type already exists', async () => {
      // Create a section first
      await new AboutSection({
        sectionType: 'about',
        title: 'About Us',
        content: 'Original content'
      }).save();
      

      const res = await request(app)
        .post('/section')
        .send({
          sectionType: 'about',
          title: 'About ChainVerse',
          content: 'Different content'
        });
      
      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('already exists');
    });
    
    it('should validate input fields', async () => {
      const res = await request(app)
        .post('/section')
        .send({
          sectionType: 'invalid',
          title: '',
          content: ''
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });
  
  // ... rest of the test as before
});