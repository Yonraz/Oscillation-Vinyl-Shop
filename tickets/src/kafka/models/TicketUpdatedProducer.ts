import { Kafka } from "kafkajs";
import { Topics } from "./TopicEnum";
import { TicketUpdatedEvent } from "../events/TicketUpdatedEvent";
import { BaseProducer } from "./AbstractProducer";

export class TicketUpdatedProducer extends BaseProducer<TicketUpdatedEvent> {
  readonly topic: Topics.TicketUpdated = Topics.TicketUpdated;
  constructor(kafkaClient: Kafka) {
    super(kafkaClient);
  }
}
