import { Kafka, Producer } from "kafkajs";

export class KafkaWrapper {
  private _client?: Kafka;
  private _producer?: Producer;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access Kafka client before connecting");
    }
    return this._client;
  }

  get producer() {
    if (!this._producer) {
      throw new Error("Cannot access Kafka producer before connecting");
    }
    return this._producer;
  }

  async connect(clientId: string, brokers: string[]) {
    this._client = new Kafka({ clientId, brokers });
    this._producer = this._client.producer();
    await this._producer.connect();
    console.log("Connected to Kafka");
  }
}

export const kafkaWrapper = new KafkaWrapper();
