import { EachMessagePayload } from "kafkajs";
import {
  Topics,
  BaseConsumer,
  TicketUpdatedEvent,
  NotFoundError,
} from "@yonraztickets/common";
import { Ticket } from "../../models/Ticket";
import { groupId } from "./GroupId";

export class TicketUpdatedConsumer extends BaseConsumer<TicketUpdatedEvent> {
  topic: Topics.TicketUpdated = Topics.TicketUpdated;
  groupId: string = "orders-service/ticket-updated";
  async onMessage(
    data: TicketUpdatedEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    const { id, title, price } = data;
    const ticket = await Ticket.findOne({ _id: id, version: data.version - 1 });
    
    if (!ticket) {
      throw new NotFoundError();
    }
    ticket.set({ title, price });
    await ticket.save();
  }
}
