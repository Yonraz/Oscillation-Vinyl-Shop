import {
  BaseConsumer,
  OrderCancelledEvent,
  Topics,
} from "@yonraztickets/common";
import { TicketUpdatedProducer } from "../Producers/TicketUpdatedProducer";
import { Ticket } from "../../models/Ticket";
import { EachMessagePayload } from "kafkajs";

export class OrderCancelledConsumer extends BaseConsumer<OrderCancelledEvent> {
  topic: Topics.OrderCancelled = Topics.OrderCancelled;
  groupId: string = "tickets-service";
  async onMessage(
    data: OrderCancelledEvent["data"],
    message: EachMessagePayload
  ) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({ orderId: undefined });
    await ticket.save();
    //@ts-ignore
    const producer = new TicketUpdatedProducer(this.client);
    //@ts-ignore
    await producer.produce({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      //@ts-ignore
      orderId: ticket.orderId,
      version: ticket.version,
    });
  }
}
