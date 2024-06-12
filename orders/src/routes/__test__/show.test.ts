import request from "supertest";
import { app } from "../../app";
import { createVinyl, makeOrder } from "./utils/helper_functions";
import mongoose from "mongoose";

it("returns a 404 for non existing order", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", global.signup())
    .send()
    .expect(404);
});

it("returns a 401 if user does not own the order", async () => {
  const user1 = global.signup();
  const user2 = global.signup();
  const vinyl = await createVinyl();
  const orderResponse = await makeOrder(user1, vinyl);
  expect(orderResponse.status).toEqual(201);
  const { body: order } = orderResponse;
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .send()
    .expect(401);
});

it("successfully fetches an order", async () => {
  const vinyl = await createVinyl();
  const user = global.signup();
  const orderResponse = await makeOrder(user, vinyl);
  expect(orderResponse.status).toEqual(201);
  const { body: order } = orderResponse;
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
