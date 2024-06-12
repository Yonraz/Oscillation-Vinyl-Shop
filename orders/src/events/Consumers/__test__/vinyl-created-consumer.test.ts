import { VinylCreatedEvent, Topics, Genre } from "@yonraztickets/common";
import { kafkaWrapper } from "../../../kafka-wrapper";
import { Vinyl } from "../../../models/Vinyl";
import { VinylCreatedConsumer } from "../VinylCreatedConsumer";
import mongoose from "mongoose";
import { EachMessagePayload } from "kafkajs";

const setup = async () => {
  const consumer = new VinylCreatedConsumer(kafkaWrapper.client);

  const data: VinylCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    genre: Genre.Jazz,
    description: "asdasd",
  };

  const message: EachMessagePayload = {
    // @ts-ignore
    message: {
      offset: "1",
    },
    topic: Topics.VinylCreated,
    partition: 0,
  };
  return { consumer, data, message };
};

it("creates and saves a vinyl", async () => {
  const { consumer, data, message } = await setup();
  await consumer.onMessage(data, message);

  const vinyl = await Vinyl.findById(data.id);
  expect(vinyl).toBeDefined();
  expect(vinyl!.title).toEqual(data.title);
});
