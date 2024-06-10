import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Topics,
} from "@yonraztickets/common";
import { kafkaWrapper } from "../../../kafka-wrapper";
import { Ticket } from "../../../models/Ticket";
import { OrderCreatedConsumer } from "../OrderCreatedConsumer";
import mongoose from "mongoose";
import { EachMessagePayload } from "kafkajs";
import { OrderCancelledConsumer } from "../OrderCancelledConsumer";

const setup = async () => {
  // Create an instance of the consumer
  const consumer = new OrderCancelledConsumer(kafkaWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });
  ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket.save();
  // Create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
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

  return { consumer, ticket, data, message };
};

it("sets ticket orderId to undefined if order is cancelled", async () => {
  const { consumer, ticket, data, message } = await setup();
  await consumer.onMessage(data, message);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toBeUndefined();
});

it("emits a ticket updated event", async () => {
  const { consumer, data, message } = await setup();
  await consumer.onMessage(data, message);
  expect(kafkaWrapper.client.producer().send).toHaveBeenCalled();
});
