import {
  Genre,
  OrderCreatedEvent,
  OrderStatus,
  Topics,
} from "@yonraztickets/common";
import { kafkaWrapper } from "../../../kafka-wrapper";
import { OrderCreatedConsumer } from "../OrderCreatedConsumer";
import { Vinyl } from "../../../models/Vinyl";
import mongoose from "mongoose";
import { EachMessagePayload } from "kafkajs";

const setup = async () => {
  // Create an instance of the consumer
  const consumer = new OrderCreatedConsumer(kafkaWrapper.client);
  // create and save a vinyl
  const vinyl = Vinyl.build({
    title: "concert",
    price: 20,
    userId: "123",
    genre: Genre.Jazz,
    imageUrl: "image url",
  });
  await vinyl.save();
  // Create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "123",
    expiresAt: "123",
    vinyl: {
      id: vinyl.id,
      price: vinyl.price,
    },
  };
  // Create a fake message object
  const message: EachMessagePayload = {
    // @ts-ignore
    message: {
      offset: "1",
    },
    partition: 0,
    topic: Topics.OrderCreated,
  };

  return { consumer, vinyl, data, message };
};

it("sets orderId of the vinyl", async () => {
  const { consumer, vinyl, data, message } = await setup();
  await consumer.onMessage(data, message);
  const updatedTicket = await Vinyl.findById(vinyl.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("emits a vinyl updated event", async () => {
  const { consumer, data, message } = await setup();
  await consumer.onMessage(data, message);
  expect(kafkaWrapper.client.producer().send).toHaveBeenCalled();
});
