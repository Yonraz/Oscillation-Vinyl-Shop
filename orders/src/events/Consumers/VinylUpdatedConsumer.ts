import { EachMessagePayload } from "kafkajs";
import {
  Topics,
  BaseConsumer,
  VinylUpdatedEvent,
  NotFoundError,
} from "@yonraztickets/common";
import { Vinyl } from "../../models/Vinyl";

export class VinylUpdatedConsumer extends BaseConsumer<VinylUpdatedEvent> {
  topic: Topics.VinylUpdated = Topics.VinylUpdated;
  groupId: string = "orders-service/vinyl-updated";
  async onMessage(
    data: VinylUpdatedEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    const { id, title, price } = data;
    const vinyl = await Vinyl.findOne({ _id: id, version: data.version - 1 });

    if (!vinyl) {
      throw new NotFoundError();
    }
    vinyl.set({ title, price });
    await vinyl.save();
  }
}
