import request from "supertest";
import { app } from "../../app";

it("responds with cookie for valid credentials", async () => {
  await signup();

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});

it("falis when account does not exist", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("falis for incorrect password", async () => {
  await signup();
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "pword",
    })
    .expect(400);
});
