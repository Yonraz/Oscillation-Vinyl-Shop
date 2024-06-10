import { TicketCreatedEvent, Topics } from "@yonraztickets/common";
import { kafkaWrapper } from "../../../kafka-wrapper";
import { Ticket } from "../../../models/Ticket";
import { TicketCreatedConsumer } from "../TicketCreatedConsumer";
import mongoose from "mongoose";
import { EachMessagePayload } from "kafkajs";

const setup = async () => {
  const consumer = new TicketCreatedConsumer(kafkaWrapper.client);

  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  const message: EachMessagePayload = {
    // @ts-ignore
    message: {
      offset: "1",
    },
    topic: Topics.TicketCreated,
    partition: 0,
  };
  return { consumer, data, message };
};

it("creates and saves a ticket", async () => {
  const { consumer, data, message } = await setup();
  await consumer.onMessage(data, message);

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
});
