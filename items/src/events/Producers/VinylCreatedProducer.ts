import { Kafka } from "kafkajs";
import { BaseProducer, Topics, VinylCreatedEvent } from "@yonraztickets/common";
export class VinylCreatedProducer extends BaseProducer<VinylCreatedEvent> {
  readonly topic: Topics.VinylCreated = Topics.VinylCreated;
  constructor(kafkaClient: Kafka) {
    super(kafkaClient);
  }
}
