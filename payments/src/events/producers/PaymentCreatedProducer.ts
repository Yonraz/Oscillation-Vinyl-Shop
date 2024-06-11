import {
  BaseProducer,
  PaymentCreatedEvent,
  Topics,
} from "@yonraztickets/common";
import { Kafka } from "kafkajs";

export class PaymentCreatedProducer extends BaseProducer<PaymentCreatedEvent> {
  readonly topic = Topics.PaymentCreated;
  constructor(client: Kafka) {
    super(client);
  }
}
