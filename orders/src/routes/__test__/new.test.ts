import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/Ticket";
import { Order } from "../../models/Order";
import { OrderStatus } from "@yonraztickets/common";
import { kafkaWrapper } from "../../kafka-wrapper";

it("has a route listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).not.toEqual(404);
});

it("allows access only for signed in users", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error for invalid ticketId", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketId: "",
    })
    .expect(400);
});

it("returns an error if the ticket doesnt exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if ticket is reserved", async () => {
  const ticket = Ticket.build({
    title: "stevie wonder",
    price: 300,
  });
  await ticket.save();
  const order = Order.build({
    userId: "ab3410ff",
    status: OrderStatus.Created,
    ticket,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserves a valid ticket", async () => {
  const ticket = Ticket.build({
    title: "stevie wonder",
    price: 300,
  });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it("emits and order created event", async () => {
    const ticket = Ticket.build({
      title: "stevie wonder",
      price: 300,
    });
    await ticket.save();
    await request(app)
      .post("/api/orders")
      .set("Cookie", global.signup())
      .send({
        ticketId: ticket.id,
      })
      .expect(201);
    expect(kafkaWrapper.client.producer().send).toHaveBeenCalled();
});
