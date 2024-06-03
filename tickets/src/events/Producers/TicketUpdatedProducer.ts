import { Kafka } from "kafkajs";
import {
  TicketUpdatedEvent,
  BaseProducer,
  Topics,
} from "@yonraztickets/common";

export class TicketUpdatedProducer extends BaseProducer<TicketUpdatedEvent> {
  readonly topic: Topics.TicketUpdated = Topics.TicketUpdated;
  constructor(kafkaClient: Kafka) {
    super(kafkaClient);
  }
}
