import { TicketUpdatedEvent, Topics } from "@yonraztickets/common";
import { kafkaWrapper } from "../../../kafka-wrapper";
import mongoose from "mongoose";
import { EachMessagePayload } from "kafkajs";
import { Ticket } from "../../../models/Ticket";
import { TicketUpdatedConsumer } from "../TicketUpdatedConsumer";

const setup = async () => {
  const consumer = new TicketUpdatedConsumer(kafkaWrapper.client);
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: ticketId,
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "new concert",
    price: 15,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
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

it("finds updates and saves a ticket", async () => {
  const { consumer, data, message } = await setup();
  await consumer.onMessage(data, message);

  const ticket = await Ticket.findOne({ _id: data.id });
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
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
