import { EachMessagePayload, Kafka } from "kafkajs";
import {
  TicketCreatedEvent,
  BaseConsumer,
  Topics,
} from "@yonraztickets/common";

export class TicketCreatedConsumer extends BaseConsumer<TicketCreatedEvent> {
  readonly topic: Topics.TicketCreated = Topics.TicketCreated;
  groupId = "payments-service";
  constructor(kafkaClient: Kafka) {
    super(kafkaClient);
  }
  onMessage(
    data: TicketCreatedEvent["data"],
    payload: EachMessagePayload
  ): void {
    console.log("Event data!", data);
  }
}
