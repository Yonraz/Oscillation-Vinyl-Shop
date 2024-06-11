import {
  OrderCancelledEvent,
  OrderStatus,
  Topics,
} from "@yonraztickets/common";
import { EachMessagePayload } from "kafkajs";
import mongoose from "mongoose";
import { kafkaWrapper } from "../../../kafka-wrapper";
import { OrderCancelledConsumer } from "../OrderCancelledConsumer";
import { Order } from "../../../models/order";

const setup = async () => {
  const consumer = new OrderCancelledConsumer(kafkaWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    version: 0,
    price: 10,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
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
  return { consumer, data, message, oldOrder: order };
};

it("replicates the order info", async () => {
  const { consumer, data, message, oldOrder } = await setup();
  await consumer.onMessage(data, message);
  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});
