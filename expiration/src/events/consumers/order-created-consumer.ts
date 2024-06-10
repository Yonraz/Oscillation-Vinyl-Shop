import { BaseConsumer, OrderCreatedEvent, Topics } from "@yonraztickets/common";
import { EachMessagePayload } from "kafkajs";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedConsumer extends BaseConsumer<OrderCreatedEvent> {
  topic: Topics.OrderCreated = Topics.OrderCreated;
  groupId = "expiration-service/order-created";
  async onMessage(
    data: OrderCreatedEvent["data"],
    payload: EachMessagePayload
  ) {
    await expirationQueue.add({
      orderId: data.id,
    });
  }
}
