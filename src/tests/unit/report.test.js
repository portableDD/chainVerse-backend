const request = require("supertest");
const app = require("../app"); // Express app
const { setupTestDB, teardownTestDB } = require("./utils/db");

describe("Tutor Reports", () => {
  beforeAll(setupTestDB);
  afterAll(teardownTestDB);

  it("should return 403 if user is not admin or manager", async () => {
    const res = await request(app).get("/reports/tutors").set("Authorization", "Bearer fakeToken");
    expect(res.status).toBe(403);
  });
});
