import request from "supertest";
import { app } from "../../app";
import { createTicket, makeOrder } from "./utils/helper_functions";
import mongoose from "mongoose";
import { OrderStatus } from "@yonraztickets/common";
import { Order } from "../../models/Order";
import { kafkaWrapper } from "../../kafka-wrapper";

it("returns a 404 for non existing order", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .delete(`/api/orders/${orderId}`)
    .set("Cookie", global.signup())
    .send()
    .expect(404);
});

it("returns a 401 if user does not own the order", async () => {
  const user1 = global.signup();
  const user2 = global.signup();
  const ticket = await createTicket();
  const orderResponse = await makeOrder(user1, ticket);
  expect(orderResponse.status).toEqual(201);
  const { body: order } = orderResponse;
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .send()
    .expect(401);
});

it("updates order status to cancelled", async () => {
  const ticket = await createTicket();
  const user = global.signup();
  const orderResponse = await makeOrder(user, ticket);
  expect(orderResponse.status).toEqual(201);
  const { body: order } = orderResponse;
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  console.log(updatedOrder);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
  const ticket = await createTicket();
  const user = global.signup();
  const orderResponse = await makeOrder(user, ticket);
  expect(orderResponse.status).toEqual(201);
  const { body: order } = orderResponse;
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  console.log(updatedOrder);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

  expect(kafkaWrapper.client.producer().send).toHaveBeenCalled();
});
