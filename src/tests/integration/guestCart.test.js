const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../../../app');
const GuestCart = require('../../models/Guestcart');
const Course = require('../../models/course');
const cron = require('node-cron');

// beforeAll(async () => {
//   jest.mock('redis', () => {
//     const mRedisClient = {
//       connect: jest.fn().mockResolvedValue(),
//       on: jest.fn(),
//       get: jest.fn(),
//       set: jest.fn(),
//       quit: jest.fn().mockResolvedValue(),
//     };
//     return {
//       createClient: () => mRedisClient,
//     };
//   });
// });

afterAll(async () => {
  await mongoose.disconnect();
  // await mongoServer.stop();
});

beforeEach(async () => {
  // Clear guest carts before each test
  await GuestCart.deleteMany({});
});


describe("Guest Cart API", () => {
  let testCourse1, testCourse2;

  beforeEach(async () => {
    testCourse1 = await Course.create({
      title: "Course One",
      description: "Description One"
    });

    testCourse2 = await Course.create({
      title: "Course Two",
      description: "Description Two"
    });
  });

  it("should create a new guest cart", async () => {
    const res = await request(app)
      .post("/api/guest/cart/create")
      .send();

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("cartKey");
    expect(res.body.cartKey).toMatch(/^guest_/);
  });

  it("should get a guest cart with populated course details", async () => {
    // Create guest cart with items
    const cart = await GuestCart.create({
      cartKey: "guest_test123",
      items: [{ courseId: testCourse1._id, quantity: 2 }]
    });

    const res = await request(app).get(`/api/guest/cart/${cart.cartKey}`);

    expect(res.status).toBe(200);
    expect(res.body.cartKey).toBe(cart.cartKey);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0]).toMatchObject({
      courseId: testCourse1._id.toString(),
      title: testCourse1.title,
      description: testCourse1.description,
      quantity: 2
    });
  });

  it("should add a new course to guest cart", async () => {
    const cart = await GuestCart.create({
      cartKey: "guest_addtest",
      items: []
    });

    const res = await request(app)
      .post(`/api/guest/cart/${cart.cartKey}/add`)
      .send({ courseId: testCourse1._id, quantity: 3 });

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].quantity).toBe(3);
  });

  it("should increment quantity if course already exists in guest cart", async () => {
    const cart = await GuestCart.create({
      cartKey: "guest_increment",
      items: [{ courseId: testCourse1._id, quantity: 1 }]
    });

    const res = await request(app)
      .post(`/api/guest/cart/${cart.cartKey}/add`)
      .send({ courseId: testCourse1._id, quantity: 4 });

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].quantity).toBe(5); // 1 + 4
  });

  it("should update multiple items in guest cart", async () => {
    const cart = await GuestCart.create({
      cartKey: "guest_update",
      items: [
        { courseId: testCourse1._id, quantity: 1 },
        { courseId: testCourse2._id, quantity: 2 }
      ]
    });

    const updates = [
      { courseId: testCourse1._id.toString(), quantity: 5 },
      { courseId: testCourse2._id.toString(), quantity: 10 }
    ];

    const res = await request(app)
      .put(`/api/guest/cart/${cart.cartKey}`)
      .send({ items: updates });

    expect(res.status).toBe(200);
    expect(res.body.items.find(i => i.courseId === testCourse1._id.toString()).quantity).toBe(5);
    expect(res.body.items.find(i => i.courseId === testCourse2._id.toString()).quantity).toBe(10);
  });

  it("should remove an item from the guest cart", async () => {
    const cart = await GuestCart.create({
      cartKey: "guest_remove",
      items: [
        { courseId: testCourse1._id, quantity: 1 },
        { courseId: testCourse2._id, quantity: 2 }
      ]
    });

    const res = await request(app)
      .delete(`/api/guest/cart/${cart.cartKey}/remove`)
      .send({ courseId: testCourse1._id.toString() });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Item removed from cart");
    expect(res.body.cart.items.find(i => i.courseId === testCourse1._id.toString())).toBeUndefined();
  });
});
