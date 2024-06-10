import { BaseConsumer, OrderCreatedEvent, Topics } from "@yonraztickets/common";
import { EachMessagePayload, Kafka } from "kafkajs";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedProducer } from "../Producers/TicketUpdatedProducer";
import { kafkaWrapper } from "../../kafka-wrapper";

export class OrderCreatedConsumer extends BaseConsumer<OrderCreatedEvent> {
  topic: Topics.OrderCreated = Topics.OrderCreated;
  groupId: string = "tickets-service/order-created";
  constructor(client: Kafka) {
    super(client);
  }
  async onMessage(
    data: OrderCreatedEvent["data"],
    message: EachMessagePayload
  ): Promise<void> {
    const { id, ticket } = data;
    const foundTicket = await Ticket.findById(ticket.id);
    if (!foundTicket) {
      throw new Error("Ticket not found");
    }
    foundTicket.set({ orderId: id });
    await foundTicket.save();
    const producer = new TicketUpdatedProducer(this.client);
    await producer.produce({
      id: foundTicket.id,
      title: foundTicket.title,
      price: foundTicket.price,
      userId: foundTicket.userId,
      orderId: foundTicket.orderId,
      version: foundTicket.version,
    });
  }
}
