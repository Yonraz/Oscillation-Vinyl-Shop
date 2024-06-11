import { OrderCreatedEvent, OrderStatus, Topics } from "@yonraztickets/common";
import { kafkaWrapper } from "../../../kafka-wrapper";
import { OrderCreatedConsumer } from "../OrderCreatedConsumer";
import mongoose from "mongoose";
import { EachMessagePayload } from "kafkajs";
import { Order } from "../../../models/order";

const setup = async () => {
  const consumer = new OrderCreatedConsumer(kafkaWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    status: OrderStatus.Created,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
    },
  };

  const message: EachMessagePayload = {
    // @ts-ignore
    message: {
      offset: "1",
    },
    topic: Topics.OrderCreated,
    partition: 0,
  };
  return { consumer, data, message };
};

it("replicates the order info", async () => {
  const { consumer, data, message } = await setup();
  await consumer.onMessage(data, message);
  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order!.price).toEqual(data.ticket.price);
});
