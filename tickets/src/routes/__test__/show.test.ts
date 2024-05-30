import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { getInvalidId } from "./utils";

it("returns 404 if the ticket is not found", async () => {
  const id = getInvalidId();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "stevie wonder";
  const price = 208;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title,
      price,
    });

  console.log(response.body);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
