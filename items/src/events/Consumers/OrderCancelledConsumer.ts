import {
  BaseConsumer,
  OrderCancelledEvent,
  Topics,
} from "@yonraztickets/common";
import { VinylUpdatedProducer } from "../Producers/VinylUpdatedProducer";
import { Vinyl } from "../../models/Vinyl";
import { EachMessagePayload } from "kafkajs";

export class OrderCancelledConsumer extends BaseConsumer<OrderCancelledEvent> {
  topic: Topics.OrderCancelled = Topics.OrderCancelled;
  groupId: string = "tickets-service/order-cancelled";
  async onMessage(
    data: OrderCancelledEvent["data"],
    message: EachMessagePayload
  ) {
    const vinyl = await Vinyl.findById(data.vinyl.id);
    if (!vinyl) {
      throw new Error("Ticket not found");
    }
    vinyl.set({ orderId: undefined });
    console.log(vinyl);
    await vinyl.save();
    //@ts-ignore
    const producer = new VinylUpdatedProducer(this.client);
    //@ts-ignore
    await producer.produce({
      id: vinyl.id,
      title: vinyl.title,
      price: vinyl.price,
      userId: vinyl.userId,
      version: vinyl.version,
    });
  }
}
