// tests/forum.test.ts
import request from 'supertest';
import app from '../server'; 
import mongoose from 'mongoose';

describe('Forum API', () => {
  let token: string;

  beforeAll(async () => {
    // Login and get token for a tutor
    const res = await request(app).post('/auth/login').send({ email: 'tutor@example.com', password: 'password' });
    token = res.body.token;
  });

  it('should allow a tutor to create a thread', async () => {
    const res = await request(app)
      .post('/courses/123/forum/create-thread')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Topic', content: 'Let’s discuss chapter 1' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Topic');
  });
});
