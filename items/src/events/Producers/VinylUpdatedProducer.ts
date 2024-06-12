import { Kafka } from "kafkajs";
import { BaseProducer, Topics, VinylUpdatedEvent } from "@yonraztickets/common";

export class VinylUpdatedProducer extends BaseProducer<VinylUpdatedEvent> {
  readonly topic: Topics.VinylUpdated = Topics.VinylUpdated;
  constructor(kafkaClient: Kafka) {
    super(kafkaClient);
  }
}
