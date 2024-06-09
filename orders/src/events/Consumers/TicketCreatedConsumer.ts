import { EachMessagePayload } from "kafkajs";
import {
  Topics,
  BaseConsumer,
  TicketCreatedEvent,
} from "@yonraztickets/common";
import { Ticket } from "../../models/Ticket";
import { groupId } from "./GroupId";

export class TicketCreatedConsumer extends BaseConsumer<TicketCreatedEvent> {
  topic: Topics.TicketCreated = Topics.TicketCreated;
  groupId: string = 'orders-service/ticket-created';
  async onMessage(
    data: TicketCreatedEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
  }
}
