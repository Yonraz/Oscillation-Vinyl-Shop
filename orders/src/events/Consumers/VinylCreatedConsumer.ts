import { EachMessagePayload } from "kafkajs";
import { Topics, BaseConsumer, VinylCreatedEvent } from "@yonraztickets/common";
import { Vinyl } from "../../models/Vinyl";

export class VinylCreatedConsumer extends BaseConsumer<VinylCreatedEvent> {
  topic: Topics.VinylCreated = Topics.VinylCreated;
  groupId: string = "orders-service/vinyl-created";
  async onMessage(
    data: VinylCreatedEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    const { id, title, price } = data;
    const vinyl = Vinyl.build({
      id,
      title,
      price,
    });
    await vinyl.save();
  }
}
