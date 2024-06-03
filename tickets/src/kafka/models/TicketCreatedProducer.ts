import { Kafka } from "kafkajs";
import { TicketCreatedEvent } from "../events/TicketCreatedEvent";
import { BaseProducer } from "./BaseProducer";
import { Topics } from "./TopicEnum";

export class TicketCreatedProducer extends BaseProducer<TicketCreatedEvent> {
  readonly topic: Topics.TicketCreated = Topics.TicketCreated;
  constructor(kafkaClient: Kafka) {
    super(kafkaClient);
  }
}
