import {
  BaseProducer,
  OrderCancelledEvent,
  Topics,
} from "@yonraztickets/common";
import { Kafka } from "kafkajs";

export class OrderCancelledProducer extends BaseProducer<OrderCancelledEvent> {
  topic: Topics.OrderCancelled = Topics.OrderCancelled;
  constructor(kafkaClient: Kafka) {
    super(kafkaClient);
  }
}
