import request from "supertest";
import { app } from "../../app";
import { Vinyl } from "../../models/Vinyl";
import { kafkaWrapper } from "../../kafka-wrapper";
import { Genre } from "@yonraztickets/common";

it("has a route listening to /api/vinyls for post requests", async () => {
  const response = await request(app).post("/api/vinyls").send({});
  expect(response.status).not.toEqual(404);
});

it("allows access only for signed in users", async () => {
  const response = await request(app).post("/api/vinyls").send({});
  expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/vinyls")
    .set("Cookie", global.signup())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error for invalid title", async () => {
  await request(app)
    .post("/api/vinyls")
    .set("Cookie", global.signup())
    .send({
      title: "",
      price: 10,
      genre: Genre.Jazz,
      imageUrl: "image url",
    })
    .expect(400);
});

it("returns an error for invalid price", async () => {
  await request(app)
    .post("/api/vinyls")
    .set("Cookie", global.signup())
    .send({
      title: "title",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/vinyls")
    .set("Cookie", global.signup())
    .send({
      title: "title",
    })
    .expect(400);
});

it("returns an error for invalid genre", async () => {
  await request(app)
    .post("/api/vinyls")
    .set("Cookie", global.signup())
    .send({
      title: "title",
      price: 20,
      genre: "invalid genre",
      imageUrl: "image url",
    })
    .expect(400);

  await request(app)
    .post("/api/vinyls")
    .set("Cookie", global.signup())
    .send({
      title: "title",
      price: 20,
      imageUrl: "image url",
    })
    .expect(400);
});

it("creates a vinyl with valid inputs", async () => {
  let vinyls = await Vinyl.find({});
  expect(vinyls).toHaveLength(0);
  const title = "Thundercat";
  await request(app)
    .post("/api/vinyls")
    .set("Cookie", global.signup())
    .send({
      title,
      price: 10,
      genre: Genre.Jazz,
      imageUrl: "image url",
    })
    .expect(201);

  vinyls = await Vinyl.find({});
  expect(vinyls).toHaveLength(1);

  expect(vinyls[0].price).toEqual(10);
  expect(vinyls[0].title).toEqual(title);
});

it("emits an event", async () => {
  const title = "Thundercat";
  await request(app)
    .post("/api/vinyls")
    .set("Cookie", global.signup())
    .send({
      title,
      price: 10,
      genre: Genre.Jazz,
      imageUrl: "image url",
    })
    .expect(201);

  expect(kafkaWrapper.client.producer().send).toHaveBeenCalled();
});
