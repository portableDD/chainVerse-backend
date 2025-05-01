const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Course = require("../models/course");
const CourseReport = require("../models/courseReport");
const User = require("../models/User");

let mongoServer;
let adminToken;
let courseId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create admin user and get token
  const admin = new User({
    email: "admin@test.com",
    password: "password123",
    role: "ADMIN",
  });
  await admin.save();

  // Login and get token (implement your auth logic here)
  adminToken = "your-auth-token";
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Create test course
  const course = new Course({
    title: "Test Course",
    description: "Test Description",
    enrollments: [
      { userId: new mongoose.Types.ObjectId(), status: "ACTIVE" },
      { userId: new mongoose.Types.ObjectId(), status: "COMPLETED" },
    ],
  });
  await course.save();
  courseId = course._id;
});

afterEach(async () => {
  await Course.deleteMany({});
  await CourseReport.deleteMany({});
});

describe("Course Report API", () => {
  describe("GET /reports/course/:courseId", () => {
    it("should return 403 for unauthorized access", async () => {
      const response = await request(app)
        .get(`/reports/course/${courseId}`)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(403);
    });

    it("should return course report for admin", async () => {
      const response = await request(app)
        .get(`/reports/course/${courseId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("courseId");
      expect(response.body.data).toHaveProperty("totalEnrollments");
      expect(response.body.data).toHaveProperty("completionRate");
    });

    it("should return 404 for non-existent course", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/reports/course/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /reports/courses", () => {
    it("should return 403 for unauthorized access", async () => {
      const response = await request(app)
        .get("/reports/courses")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(403);
    });

    it("should return all course reports for admin", async () => {
      const response = await request(app)
        .get("/reports/courses")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
