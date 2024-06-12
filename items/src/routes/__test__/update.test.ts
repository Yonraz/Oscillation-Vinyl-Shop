import request from "supertest";
import { app } from "../../app";
import { getInvalidId } from "../../utils/utils";
import { kafkaWrapper } from "../../kafka-wrapper";
import mongoose from "mongoose";
import { Vinyl } from "../../models/Vinyl";
import { Genre } from "@yonraztickets/common";

const invalidTitle = "";
const invalidPrice = -10;

const validRequestBody = {
  title: "title",
  price: 20,
  genre: Genre.Jazz,
  imageUrl: "image url",
};

it("returns a 404 if provided id does not exist", async () => {
  const id = getInvalidId();
  await request(app)
    .put(`/api/vinyls/${id}`)
    .set("Cookie", global.signup())
    .send(validRequestBody)
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  await request(app).put("/api/vinyls/:id").send(validRequestBody).expect(401);
});

it("returns a 401 if the user does not own the vinyl", async () => {
  const response = await request(app)
    .post("/api/vinyls")
    .set("Cookie", global.signup())
    .send(validRequestBody);

  await request(app)
    .put(`/api/vinyls/${response.body.id}`)
    .set("Cookie", global.signup())
    .send({
      title: "new title",
      price: 100,
      genre: Genre.Classical,
      imageUrl: "new image url",
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post("/api/vinyls")
    .set("Cookie", cookie)
    .send(validRequestBody);

  await request(app)
    .put(`/api/vinyls/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: invalidTitle,
      price: 10,
      genre: Genre.Classical,
      imageUrl: "new image url",
    })
    .expect(400);

  await request(app)
    .put(`/api/vinyls/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: invalidPrice,
    })
    .expect(400);
});

it("updates the vinyl provided valid inputs", async () => {
  const newTitle = "herbie hancock trio live at java jazz festival";
  const newPrice = 300;

  const cookie = global.signup();

  const response = await request(app)
    .post("/api/vinyls")
    .set("Cookie", cookie)
    .send(validRequestBody);

  await request(app)
    .put(`/api/vinyls/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
      genre: Genre.Classical,
      imageUrl: "new image url",
    })
    .expect(200);

  const vinylResponse = await request(app)
    .get(`/api/vinyls/${response.body.id}`)
    .send();

  expect(vinylResponse.body.title).toEqual(newTitle);
  expect(vinylResponse.body.price).toEqual(newPrice);
});

it("publishes an event", async () => {
  const newTitle = "herbie hancock trio live at java jazz festival";
  const newPrice = 300;

  const cookie = global.signup();

  const response = await request(app)
    .post("/api/vinyls")
    .set("Cookie", cookie)
    .send(validRequestBody);

  await request(app)
    .put(`/api/vinyls/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
      genre: Genre.Classical,
      imageUrl: "new image url",
    })
    .expect(200);

  expect(kafkaWrapper.client.producer().send).toHaveBeenCalled();
});

it("rejects attempt to update a reserved vinyl", async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post("/api/vinyls")
    .set("Cookie", cookie)
    .send(validRequestBody);

  const vinyl = await Vinyl.findById(response.body.id);
  vinyl!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await vinyl!.save();

  await request(app)
    .put(`/api/vinyls/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
      genre: Genre.Classical,
      imageUrl: "new image url",
    })
    .expect(400);
});
