require("dotenv").config();

const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../db");
const User = require("../models/user");

// глобально збільшуємо таймаут на 20 секунд
jest.setTimeout(20000);

describe("Auth: login controller", () => {
  let server;
  let testUser;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // чистимо БД
    testUser = await User.create({
      email: "test@example.com",
      // пароль "123456", bcrypt-hash
      password: "$2b$10$5z5Tx.hUzB/QJ08Hq9uNqOQEtV.hXsmewuuzEJ.m3mxEC4xtA0RxW",
      subscription: "starter",
    });

    // запускаємо сервер
    server = app.listen(4000, () => {
      console.log("🚀 Test server running on port 4000");
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await sequelize.close();
  });

  it("should return 200, token and user object with email and subscription", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");

    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "test@example.com");
    expect(res.body.user).toHaveProperty("subscription", "starter");

    expect(typeof res.body.user.email).toBe("string");
    expect(typeof res.body.user.subscription).toBe("string");
  });
});
