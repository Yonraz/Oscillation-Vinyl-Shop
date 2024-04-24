import request from "supertest";
import { app } from "../../app";

it("returns a 201 status code on successful signup", async () => {
  await signup();
});

it("returns a 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test.com",
      password: "1",
    })
    .expect(400);
});

it("returns a 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with no email or password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ password: "password" })
    .expect(400);
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("does not allow duplicate emails", async () => {
  await signup();
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("creates cookie after successful signup", async () => {
  const cookie = await signup();

  expect(cookie).toBeDefined();
});
