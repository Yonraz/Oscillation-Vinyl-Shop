import request from "supertest";
import { app } from "../../app";

it("responds with current user details", async () => {
  const cookie = await signup();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie!)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it('response with null if no current user', async () => {
    const response = await request(app)
      .get("/api/users/currentuser")
      .send()
      .expect(200);

    expect(response.body.currentUser).toEqual(null);
})
