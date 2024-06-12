import {
  Genre,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Topics,
} from "@yonraztickets/common";
import { kafkaWrapper } from "../../../kafka-wrapper";
import { Vinyl } from "../../../models/Vinyl";
import { OrderCreatedConsumer } from "../OrderCreatedConsumer";
import mongoose from "mongoose";
import { EachMessagePayload } from "kafkajs";
import { OrderCancelledConsumer } from "../OrderCancelledConsumer";

const setup = async () => {
  // Create an instance of the consumer
  const consumer = new OrderCancelledConsumer(kafkaWrapper.client);
  // create and save a vinyl
  const vinyl = Vinyl.build({
    title: "concert",
    price: 20,
    userId: "123",
    genre: Genre.Jazz,
    imageUrl: "image url",
  });
  vinyl.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await vinyl.save();
  // Create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    vinyl: {
      id: vinyl.id,
    },
  };
  // Create a fake message object
  const message: EachMessagePayload = {
    // @ts-ignore
    message: {
      offset: "1",
    },
    partition: 0,
    topic: Topics.OrderCancelled,
  };

  return { consumer, vinyl, data, message };
};

it("sets vinyl orderId to undefined if order is cancelled", async () => {
  const { consumer, vinyl, data, message } = await setup();
  await consumer.onMessage(data, message);
  const updatedVinyl = await Vinyl.findById(vinyl.id);
  expect(updatedVinyl!.orderId).toBeUndefined();
});

it("emits a vinyl updated event", async () => {
  const { consumer, data, message } = await setup();
  await consumer.onMessage(data, message);
  expect(kafkaWrapper.client.producer().send).toHaveBeenCalled();
});
