import { Kafka, Producer } from "kafkajs";
import { Topics } from "./TopicEnum";

interface Event {
  topic: Topics;
  data: any;
}

export abstract class BaseProducer<T extends Event> {
  abstract topic: T["topic"];
  protected producer: Producer;

  constructor(kafka: Kafka) {
    this.producer = kafka.producer();
  }

  async produce(data: T["data"]): Promise<void> {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: this.topic,
        messages: [
          {
            value: JSON.stringify(data),
          },
        ],
      });
      console.log("Event published to subject", this.topic);
    } catch (err) {
      console.error("Failed to publish event:", err);
      throw err;
    } finally {
      await this.producer.disconnect();
    }
  }
}
