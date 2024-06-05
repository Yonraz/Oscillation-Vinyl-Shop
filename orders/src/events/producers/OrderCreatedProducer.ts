import { BaseProducer, OrderCreatedEvent, Topics } from "@yonraztickets/common";
import { Kafka } from "kafkajs";

export class OrderCreatedProducer extends BaseProducer<OrderCreatedEvent> {
  topic: Topics.OrderCreated = Topics.OrderCreated;
  constructor(kafkaClient: Kafka) {
    super(kafkaClient);
  }
}
