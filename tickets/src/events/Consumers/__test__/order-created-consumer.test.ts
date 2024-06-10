import { OrderCreatedEvent, OrderStatus, Topics } from "@yonraztickets/common";
import { kafkaWrapper } from "../../../kafka-wrapper";
import { OrderCreatedConsumer } from "../OrderCreatedConsumer";
import { Ticket } from "../../../models/Ticket";
import mongoose from "mongoose";
import { EachMessagePayload } from "kafkajs";

const setup = async () => {
  // Create an instance of the consumer
  const consumer = new OrderCreatedConsumer(kafkaWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });
  await ticket.save();
  // Create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "123",
    expiresAt: "123",
    ticket: {
      id: ticket.id,
      price: ticket.price,
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

  return { consumer, ticket, data, message };
};

it("sets orderId of the ticket", async () => {
  const { consumer, ticket, data, message } = await setup();
  await consumer.onMessage(data, message);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("emits a ticket updated event", async () => {
  const { consumer, ticket, data, message } = await setup();
  await consumer.onMessage(data, message);
  expect(kafkaWrapper.client.producer().send).toHaveBeenCalled();
});
