import { BaseConsumer, OrderCreatedEvent, Topics } from "@yonraztickets/common";
import { EachMessagePayload, Kafka } from "kafkajs";
import { Vinyl } from "../../models/Vinyl";
import { VinylUpdatedProducer } from "../Producers/VinylUpdatedProducer";
import { kafkaWrapper } from "../../kafka-wrapper";

export class OrderCreatedConsumer extends BaseConsumer<OrderCreatedEvent> {
  topic: Topics.OrderCreated = Topics.OrderCreated;
  groupId: string = "tickets-service/order-created";
  constructor(client: Kafka) {
    super(client);
  }
  async onMessage(
    data: OrderCreatedEvent["data"],
    message: EachMessagePayload
  ): Promise<void> {
    const { id, vinyl } = data;
    const foundVinyl = await Vinyl.findById(vinyl.id);
    if (!foundVinyl) {
      throw new Error("Ticket not found");
    }
    foundVinyl.set({ orderId: id });
    await foundVinyl.save();
    const producer = new VinylUpdatedProducer(this.client);
    await producer.produce({
      id: foundVinyl.id,
      title: foundVinyl.title,
      price: foundVinyl.price,
      userId: foundVinyl.userId,
      orderId: foundVinyl.orderId,
      version: foundVinyl.version,
      genre: foundVinyl.genre,
      description: foundVinyl.description,
    });
  }
}
