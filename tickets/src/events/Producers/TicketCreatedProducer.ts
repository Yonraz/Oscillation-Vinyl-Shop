import { Kafka } from "kafkajs";
import {
  TicketCreatedEvent,
  BaseProducer,
  Topics,
} from "@yonraztickets/common";
export class TicketCreatedProducer extends BaseProducer<TicketCreatedEvent> {
  readonly topic: Topics.TicketCreated = Topics.TicketCreated;
  constructor(kafkaClient: Kafka) {
    super(kafkaClient);
  }
}
