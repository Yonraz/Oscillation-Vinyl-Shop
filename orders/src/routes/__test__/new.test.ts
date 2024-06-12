import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Vinyl } from "../../models/Vinyl";
import { Order } from "../../models/Order";
import { OrderStatus } from "@yonraztickets/common";
import { kafkaWrapper } from "../../kafka-wrapper";

it("has a route listening to /api/orders for post requests", async () => {
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

it("returns an error for invalid vinylId", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      vinylId: "",
    })
    .expect(400);
});

it("returns an error if the ticket doesnt exist", async () => {
  const vinylId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      vinylId,
    })
    .expect(404);
});

it("returns an error if vinyl is reserved", async () => {
  const vinyl = Vinyl.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "stevie wonder",
    price: 300,
  });
  await vinyl.save();
  const order = Order.build({
    userId: "ab3410ff",
    status: OrderStatus.Created,
    vinyl,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      vinylId: vinyl.id,
    })
    .expect(400);
});

it("reserves a valid vinyl", async () => {
  const vinyl = Vinyl.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "stevie wonder",
    price: 300,
  });
  await vinyl.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      vinylId: vinyl.id,
    })
    .expect(201);
});

it("emits and order created event", async () => {
  const vinyl = Vinyl.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "stevie wonder",
    price: 300,
  });
  await vinyl.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      vinylId: vinyl.id,
    })
    .expect(201);
  expect(kafkaWrapper.client.producer().send).toHaveBeenCalled();
});
