import { Kafka, EachMessagePayload, Consumer } from "kafkajs";
import { Topics } from "./TopicEnum";

interface Event {
  topic: Topics;
  data: any;
}

export abstract class BaseConsumer<T extends Event> {
  abstract topic: T["topic"];
  abstract groupId: string;
  abstract onMessage(data: T["data"], payload: EachMessagePayload): void;

  private kafka: Kafka;
  private consumer: Consumer | undefined;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
  }

  async consume() {
    this.consumer = this.kafka.consumer({ groupId: this.groupId });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        console.log(`Message received: ${this.topic} / ${this.groupId}`);
        const parsedData = this.parseMessage(payload);
        this.onMessage(parsedData, payload);
      },
    });
  }

  parseMessage(payload: EachMessagePayload) {
    const { message } = payload;
    const data = message.value?.toString();
    return data ? JSON.parse(data) : null;
  }

  async close() {
    if (this.consumer) {
      await this.consumer.disconnect();
      console.log("Kafka connection closed!");
    }
  }
}
