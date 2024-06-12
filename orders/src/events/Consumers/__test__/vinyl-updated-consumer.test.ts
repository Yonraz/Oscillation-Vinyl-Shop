import { VinylUpdatedEvent, Topics, Genre } from "@yonraztickets/common";
import { kafkaWrapper } from "../../../kafka-wrapper";
import mongoose from "mongoose";
import { EachMessagePayload } from "kafkajs";
import { Vinyl } from "../../../models/Vinyl";
import { VinylUpdatedConsumer } from "../VinylUpdatedConsumer";

const setup = async () => {
  const consumer = new VinylUpdatedConsumer(kafkaWrapper.client);
  const vinylId = new mongoose.Types.ObjectId().toHexString();
  const vinyl = Vinyl.build({
    id: vinylId,
    title: "concert",
    price: 20,
  });
  await vinyl.save();

  const data: VinylUpdatedEvent["data"] = {
    id: vinyl.id,
    title: "new concert",
    price: 15,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: vinyl.version + 1,
    genre: Genre.Alternative,
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

it("finds updates and saves a vinyl", async () => {
  const { consumer, data, message } = await setup();
  await consumer.onMessage(data, message);

  const vinyl = await Vinyl.findOne({ _id: data.id });
  expect(vinyl).toBeDefined();
  expect(vinyl!.title).toEqual(data.title);
});

it("rejects updates if version is out of order", async () => {
  const { consumer, data, message } = await setup();
  let error;
  data.version = 10;
  try {
    await consumer.onMessage(data, message);
  } catch (err) {
    error = err;
  }
  expect(error).toBeDefined();
});
